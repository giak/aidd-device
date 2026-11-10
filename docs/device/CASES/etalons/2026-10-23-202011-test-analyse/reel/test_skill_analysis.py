"""Comportements non couverts de `analysis.py` (skill 06-test, action 01).

Deux comportements testés, par ordre de priorité :

1. Décodage des formats non-WAV via ffmpeg — PCM s16le normalisé en flottants,
   ffmpeg absent / en échec / sortie vide → `AnalysisError`, et jamais de repli
   silencieux sur le décodeur stdlib pour un non-WAV.
2. Cohérence inter-taux — un signal natif 44,1 kHz (décimé en interne) et le
   même signal fourni directement à 4 kHz doivent donner le même BPM et la même
   phase ; un taux ≤ 4 kHz est accepté tel quel.

Aucun ffmpeg réel n'est requis : le binaire est simulé et injecté dans `PATH`,
donc le contrat testé est le décodage, pas l'implémentation `subprocess`.
"""
import math
import stat
import wave

import pytest

from analysis import ANALYSIS_RATE, AnalysisError, analyze_samples, decode_to_pcm


def make_kick(bpm=128.0, phase=0.25, seconds=8.0, rate=44100):
    """Kick 55 Hz amorti (30 ms) à chaque beat, premier beat à `phase`."""
    n = int(seconds * rate)
    out = [0.0] * n
    interval = 60.0 / bpm
    t = phase
    while t < seconds - 0.01:
        i0 = int(t * rate)
        for j in range(min(int(0.03 * rate), n - i0)):
            tt = j / rate
            out[i0 + j] = math.sin(2 * math.pi * 55 * tt) * math.exp(-tt / 0.008)
        t += interval
    return out


# ── 1. Décodage non-WAV via ffmpeg ────────────────────────────────────────


def _install_fake_ffmpeg(tmp_path, monkeypatch, body):
    """Installe un faux `ffmpeg` (script sh) et le laisse seul dans PATH."""
    bindir = tmp_path / 'bin'
    bindir.mkdir(exist_ok=True)
    exe = bindir / 'ffmpeg'
    exe.write_text('#!/bin/sh\n%s\n' % body)
    exe.chmod(exe.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
    monkeypatch.setenv('PATH', str(bindir))
    return exe


def test_decode_ffmpeg_normalizes_s16le_to_float(tmp_path, monkeypatch):
    """Sortie ffmpeg s16le → flottants mono au taux d'analyse :
    -32768 → -1.0, 0 → 0.0, 16384 → 0.5."""
    _install_fake_ffmpeg(
        tmp_path, monkeypatch,
        "printf '\\000\\200\\000\\000\\000\\100'",
    )
    samples, rate = decode_to_pcm(str(tmp_path / 'track.mp3'))
    assert rate == ANALYSIS_RATE
    assert samples == [-1.0, 0.0, 0.5]


def test_decode_ffmpeg_missing_binary_raises_analysis_error(tmp_path, monkeypatch):
    """ffmpeg introuvable → `AnalysisError` explicite, pas d'OSError brut."""
    empty = tmp_path / 'empty-bin'
    empty.mkdir()
    monkeypatch.setenv('PATH', str(empty))
    with pytest.raises(AnalysisError, match='ffmpeg'):
        decode_to_pcm(str(tmp_path / 'track.mp3'))


def test_decode_ffmpeg_failure_reports_stderr(tmp_path, monkeypatch):
    """Code de sortie ≠ 0 → `AnalysisError` reprenant le message d'erreur
    de ffmpeg (diagnostic exploitable côté API)."""
    _install_fake_ffmpeg(
        tmp_path, monkeypatch,
        'echo "boom: invalid data" >&2\nexit 1',
    )
    with pytest.raises(AnalysisError, match='boom: invalid data'):
        decode_to_pcm(str(tmp_path / 'track.mp3'))


def test_decode_ffmpeg_empty_stream_raises_analysis_error(tmp_path, monkeypatch):
    """ffmpeg réussit mais ne produit aucun échantillon → `AnalysisError`
    (audio vide/illisible), jamais une liste vide silencieuse."""
    _install_fake_ffmpeg(tmp_path, monkeypatch, 'exit 0')
    with pytest.raises(AnalysisError, match='audio vide'):
        decode_to_pcm(str(tmp_path / 'track.mp3'))


def test_decode_non_wav_never_falls_back_to_stdlib(tmp_path, monkeypatch):
    """Un .mp3 dont le contenu est en réalité un WAV valide, avec ffmpeg en
    échec, doit lever : le repli stdlib est réservé aux .wav."""
    real_wav = tmp_path / 'track.mp3'
    with wave.open(str(real_wav), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(44100)
        w.writeframes(b'\x00' * 4000)
    _install_fake_ffmpeg(
        tmp_path, monkeypatch,
        'echo "unsupported" >&2\nexit 1',
    )
    with pytest.raises(AnalysisError, match='unsupported'):
        decode_to_pcm(str(real_wav))


# ── 2. Cohérence inter-taux (décimation 44,1 kHz → 4 kHz) ─────────────────


@pytest.mark.parametrize('bpm,phase', [(128.0, 0.25), (124.0, 1.5), (126.0, 3.0)])
def test_analysis_consistent_between_native_rates(bpm, phase):
    """Même morceau fourni à 44,1 kHz (décimé en interne) ou à 4 kHz nativement
    → même BPM (±1) et même phase (±0.05 s), et BPM proche de la vérité (±2)."""
    high = analyze_samples(make_kick(bpm=bpm, phase=phase, rate=44100), 44100)
    low = analyze_samples(make_kick(bpm=bpm, phase=phase, rate=4000), 4000)

    assert high is not None and low is not None
    assert high['bpm'] == pytest.approx(bpm, abs=2.0)
    assert low['bpm'] == pytest.approx(bpm, abs=2.0)
    assert low['bpm'] == pytest.approx(high['bpm'], abs=1.0)
    assert low['phase'] == pytest.approx(high['phase'], abs=0.05)


def test_analysis_accepts_native_analysis_rate_without_resampling():
    """Un signal déjà au taux d'analyse est analysé tel quel (pas de décimation
    destructrice) : BPM et phase retrouvés."""
    res = analyze_samples(make_kick(bpm=120.0, phase=0.4, rate=ANALYSIS_RATE), ANALYSIS_RATE)
    assert res is not None
    assert res['bpm'] == pytest.approx(120.0, abs=2.0)
    assert res['confidence'] > 0.3
