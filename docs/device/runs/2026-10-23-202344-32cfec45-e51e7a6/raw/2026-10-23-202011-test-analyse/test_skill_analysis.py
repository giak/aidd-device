"""Comportements non couverts de analysis.py (skill 06-test).

Deux comportements retenus :
1. Décodage ffmpeg des formats non-WAV (mp3/flac/ogg) : sortie s16le → flottants
   mono normalisés, et toute défaillance ffmpeg → AnalysisError (jamais de repli
   stdlib silencieux pour un non-WAV).
2. Repli WAV stdlib (sans ffmpeg) : 8 bits accepté, 24/32 bits et > stéréo
   rejetés par une AnalysisError explicite.
"""
import struct
import subprocess
import wave

import pytest

from analysis import ANALYSIS_RATE, AnalysisError, decode_to_pcm


# ── Décodage ffmpeg (formats non-WAV) ─────────────────────────────────────


def _fake_ffmpeg(monkeypatch, *, stdout=b'', returncode=0, stderr=b'', exc=None):
    """Remplace le sous-processus ffmpeg (frontière externe) par une réponse fixe."""
    def fake_run(*_args, **_kwargs):
        if exc is not None:
            raise exc
        return subprocess.CompletedProcess(args=[], returncode=returncode,
                                           stdout=stdout, stderr=stderr)

    monkeypatch.setattr('analysis.subprocess.run', fake_run)


def test_decode_to_pcm_ffmpeg_output_is_mono_floats(tmp_path, monkeypatch):
    """Un mp3 décodé par ffmpeg → flottants mono normalisés à ANALYSIS_RATE."""
    path = tmp_path / 'track.mp3'
    path.write_bytes(b'\x00' * 32)
    pcm = [-32768, -16384, 0, 16384, 32767]
    _fake_ffmpeg(monkeypatch, stdout=b''.join(struct.pack('<h', v) for v in pcm))

    samples, rate = decode_to_pcm(str(path))

    assert rate == ANALYSIS_RATE
    assert len(samples) == len(pcm)
    assert samples == pytest.approx([-1.0, -0.5, 0.0, 0.5, 32767 / 32768], abs=1e-6)


@pytest.mark.parametrize('ffmpeg_kwargs', [
    {'returncode': 1, 'stderr': b'Invalid data found when processing input'},
    {'stdout': b''},  # code retour 0 mais aucune donnée PCM
    {'exc': OSError('ffmpeg absent')},
    {'exc': subprocess.TimeoutExpired(['ffmpeg'], 120)},
], ids=['decode-error', 'empty-output', 'binary-missing', 'timeout'])
def test_decode_to_pcm_ffmpeg_failure_raises_analysis_error(
        tmp_path, monkeypatch, ffmpeg_kwargs):
    """Toute défaillance ffmpeg sur un non-WAV → AnalysisError (pas de repli)."""
    path = tmp_path / 'broken.flac'
    path.write_bytes(b'not audio')
    _fake_ffmpeg(monkeypatch, **ffmpeg_kwargs)

    with pytest.raises(AnalysisError):
        decode_to_pcm(str(path))


# ── Repli WAV stdlib (sans ffmpeg) : formats acceptés / rejetés ───────────


def _write_wav_raw(path, *, channels, sampwidth, rate, frames):
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(channels)
        w.setsampwidth(sampwidth)
        w.setframerate(rate)
        w.writeframes(frames)


def _ffmpeg_unavailable(monkeypatch):
    _fake_ffmpeg(monkeypatch, exc=OSError('ffmpeg absent'))


def test_decode_to_pcm_wav_8bit_samples_centered_on_zero(tmp_path, monkeypatch):
    """WAV 8 bits non signé (repli sans ffmpeg) → échantillons ramenés autour de 0."""
    path = tmp_path / 'huit-bits.wav'
    _write_wav_raw(path, channels=1, sampwidth=1, rate=8000,
                   frames=bytes([128, 255, 0, 192]))
    _ffmpeg_unavailable(monkeypatch)

    samples, rate = decode_to_pcm(str(path))

    assert rate == 8000
    assert samples == pytest.approx([0.0, (255 - 128) / 128.0, -1.0, (192 - 128) / 128.0])


@pytest.mark.parametrize('channels,sampwidth,frame_bytes', [
    (1, 3, 3),   # 24 bits
    (1, 4, 4),   # 32 bits
    (3, 2, 6),   # 3 canaux (au-delà de stéréo)
], ids=['24-bit', '32-bit', 'trois-canaux'])
def test_decode_to_pcm_wav_rejects_unusual_layout(
        tmp_path, monkeypatch, channels, sampwidth, frame_bytes):
    """WAV hors 8/16 bits ou > stéréo (repli sans ffmpeg) → AnalysisError."""
    path = tmp_path / 'exotique.wav'
    _write_wav_raw(path, channels=channels, sampwidth=sampwidth, rate=8000,
                   frames=b'\x00' * (frame_bytes * 100))
    _ffmpeg_unavailable(monkeypatch)

    with pytest.raises(AnalysisError):
        decode_to_pcm(str(path))
