# Coding Assertions

The checks that must pass for code to count as done. Minimal, run after every change.

## Before commit

The fast gate.

| Order | Command | Checks |
| ----- | ------- | ------ |
| 1 | `npm run typecheck` | `tsc --noEmit` over the frontend |
| 2 | `npm run lint` | biome over `static/src/` |
| 3 | `npx vitest run` | the frontend suite |
| 4 | `./venv/bin/python -m pytest -q` | the backend suite |

## Before push

The heavier gate. This is exactly what CI runs, in this order.

| Order | Command | Checks |
| ----- | ------- | ------ |
| 1 | `npm run typecheck` | `tsc --noEmit` |
| 2 | `npm run lint` | biome over `static/src/` only — the Python backend and the build scripts are not linted |
| 3 | `npm test` | the vitest suite, sequential |
| 4 | `npm run test:shuffle` | the same suite in random order, one random seed |
| 5 | `npm run test:shuffle:gate` | the same suite with three fixed seeds (1, 2, 3), so a failure is reproducible locally |
| 6 | `python -m pytest -q` | the backend suite |
| 7 | `npm run build` | the esbuild bundle, then `scripts/validate-build.js` |

## Behavior

- Green is not "verified": the project separates a passing test from a verified task, and a UI claim needs a proof harness (`scripts/proof_*.py`, `scripts/measure_*.py`) that measures the real browser, or reads the tag back from the disk.
- The project's own surgery rules (`AGENT.md`, %SURGERY) still apply: list the files you are going to touch before touching them, keep the change to three files at a time, and validate with `git diff` plus the suite.
- If a gate fails, spawn one agent per violated assertion rather than fixing them serially.
