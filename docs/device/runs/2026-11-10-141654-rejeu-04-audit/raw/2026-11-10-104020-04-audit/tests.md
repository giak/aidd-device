# Codebase Audit: tests

Read-only audit of the `tests` pillar on `audio-sync-tool` (scope: entire repository).

- **Date**: 2026-11-10
- **Scope**: entire codebase
- **Health**: good
- **Findings**: 0 critical, 0 warning, 3 minor

## Findings

| Sev | Category | Location | Issue | Suggested fix | Effort |
| --- | --- | --- | --- | --- | --- |
| 🟢 | tests | `README.md:597`, `README.md:621` | Documentation counts drift: claims "53 vitest files / 1230 tests" and "12 pytest files / 367 tests", actual 75 test files and 371 pytest tests | Regenerate the counts from CI and update README | S |
| 🟢 | tests | `.github/workflows/ci.yml` | No coverage gate in CI (coverage run is manual via `npm run coverage`) | Add a coverage threshold step or fail below the documented 94.7 % | S |
| 🟢 | tests | repository-wide | No backend coverage measurement (pytest runs without `--cov`) | Add `pytest-cov` and a threshold for `app.py`/`nml.py`/`analysis.py` | M |

## Top actions

1. Refresh README test/coverage counts to match CI reality.
2. Add a coverage gate to CI for both suites.

## Coverage

- **Scanned**: tests (static inspection of test files and CI workflow)
- **Skipped**: no coverage tool configured in CI — static inspection only; no coverage numbers invented
- **Notes**: suite is healthy and deterministic: `npm test` 1230/1230 pass, `pytest` 371/371 pass (one failure only when `static/dist` is missing, environment-related), typecheck and biome lint clean; shuffle tests pass. No skipped tests without reason found.