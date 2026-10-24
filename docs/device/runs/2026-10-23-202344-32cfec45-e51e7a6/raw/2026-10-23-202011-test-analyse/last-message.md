`9 passed` — seul `test_skill_analysis.py` est nouveau (`git status` : `?? test_skill_analysis.py`, aucun fichier existant touché).

## Comportements couverts

**1. Décodage ffmpeg des non-WAV (score 4)** — `test_skill_analysis.py`
- `test_decode_to_pcm_ffmpeg_output_is_mono_floats` : sortie `s16le` ffmpeg → flottants mono normalisés à `ANALYSIS_RATE` (4000 Hz), bornes −1,0 / +32767/32768 vérifiées.
- `test_decode_to_pcm_ffmpeg_failure_raises_analysis_error` (4 cas) : code retour ≠ 0, sortie vide, binaire absent (`OSError`), timeout → `AnalysisError`, sans repli stdlib pour un `.flac`.

**2. Repli WAV stdlib sans ffmpeg (score 3)**
- `test_decode_to_pcm_wav_8bit_samples_centered_on_zero` : PCM 8 bits non signé recentré autour de 0, taux natif préservé.
- `test_decode_to_pcm_wav_rejects_unusual_layout` (3 cas) : 24 bits, 32 bits, 3 canaux → `AnalysisError` explicite.

## Pending
- **Repli ODF pleine bande (score 4)** — non testé : tout rythme pleine bande fuit aussi dans la bande 40–150 Hz, un test devrait patcher le filtre interne (couplage à l'implémentation interdit par la skill).

Le mock porte uniquement sur le sous-processus ffmpeg (frontière externe) ; aucun couplage aux arguments de commande ni aux fonctions privées du DSP.