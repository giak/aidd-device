## Livré

`test_skill_analysis.py` (nouveau, racine du dépôt) — **9 passed in 0.14s** ; `git status` ne montre que `?? test_skill_analysis.py`, aucun fichier existant touché.

### Comportement 1 — décodage non-WAV via ffmpeg (score 5)

| Test | Contrat vérifié |
|---|---|
| `test_decode_ffmpeg_normalizes_s16le_to_float` | s16le → `-32768→-1.0, 0→0.0, 16384→0.5`, taux = `ANALYSIS_RATE` |
| `test_decode_ffmpeg_missing_binary_raises_analysis_error` | binaire absent → `AnalysisError` mentionnant ffmpeg |
| `test_decode_ffmpeg_failure_reports_stderr` | code ≠ 0 → `AnalysisError` reprenant le stderr (`boom: invalid data`) |
| `test_decode_ffmpeg_empty_stream_raises_analysis_error` | sortie vide → `AnalysisError` `audio vide` |
| `test_decode_non_wav_never_falls_back_to_stdlib` | WAV déguisé en `.mp3` + ffmpeg en échec → erreur `unsupported`, jamais de repli stdlib |

Faux binaire `#!/bin/sh` injecté seul dans `PATH` : aucun monkeypatch des internes d'`analysis.py`, aucun ffmpeg réel requis.

### Comportement 2 — cohérence inter-taux (score 4)

| Test | Contrat vérifié |
|---|---|
| `test_analysis_consistent_between_native_rates[128/124/126]` | 44,1 kHz (décimé en interne) vs 4 kHz natif → même BPM (±1), même phase (±0.05 s), BPM réel ±2 |
| `test_analysis_accepts_native_analysis_rate_without_resampling` | taux natif = 4 kHz accepté tel quel, BPM/phase retrouvés |

### Preuves de non-régression et de sensibilité

- `test_analysis.py` + `test_app.py` : **211 passed, 1 failed** — l'unique échec `test_cache_buster_covers_css` est **antérieur et sans rapport** : il exige `static/dist/script.css`, absent car `npm run build` n'a pas été lancé (message du test lui-même).
- Mutations sur copie dans `/tmp/opencode/mut` (dépôt intact) : normalisation `32768→32767` → seul le test de décodage échoue ; diviseur de décimation faussé → les 3 tests inter-taux échouent.
- Incident de conception corrigé en cours de route : sous ce harnais `sys.executable` pointe une AppImage inexistante, le shebang Python du faux ffmpeg échouait — deux assertions passaient pour la mauvaise raison. Remplacé par `sh` + messages d'erreur spécifiques pour chaque cas.

### Pending (approuvés mais hors quota de deux)

| Comportement | Score | Raison |
|---|---|---|
| #3 matériel sans kick → BPM quand même | 4 | non traité (quota 2) ; de plus la branche de repli interne n'est pas isolable de façon observable |
| #4 `analyze_path` bout en bout | 4 | non traité (quota 2) |
| #5 WAV 8 bits + rejets 24/32 bits, >2 canaux | 3 | non traité (quota 2) |
| #6 bornes 2 s pile / taux < 4 kHz | 3 | non traité (quota 2) |
| #7 gardes `_detect_tempo` (`n<20`, `frame_rate≤0`) | 2 | non traité (quota 2) |
| #8 troncature `MAX_SECONDS` (90 s) | 2 | fixture de 90 s coûteuse, gain marginal |