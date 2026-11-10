# Codebase Audit: dependencies

Read-only audit of the `dependencies` pillar on `audio-sync-tool` (scope: entire repository).

- **Date**: 2026-11-10
- **Scope**: entire codebase
- **Health**: fair
- **Findings**: 0 critical, 1 warning, 3 minor

## Findings

| Sev | Category | Location | Issue | Suggested fix | Effort |
| --- | --- | --- | --- | --- | --- |
| 🟡 | dependencies | `package-lock.json` | `npm audit`: 15 vulnerabilities in dev toolchain (esbuild, vite, vitest, undici, brace-expansion, glob) — 3 critical, 6 high, 6 moderate | Run `npm audit fix` where non-breaking; schedule devDeps bump for breaking ones | M |
| 🟢 | dependencies | `requirements.txt` | Pins Flask 3.1.3 / mutagen 1.47.0 / pytest 9.1.1 but no lockfile or hashes; environment currently runs Flask 3.0.2 / mutagen 1.46.0 / pytest 7.4.3 | Add a pinned lock (pip-compile) with hashes for reproducible installs | S |
| 🟢 | dependencies | `package.json` | Only one runtime npm dependency (`wavesurfer.js` 7.12.11) — good; devDeps are the whole surface | Keep runtime minimal; document the dev-only nature of npm audit findings | S |
| 🟢 | dependencies | repository-wide | No license-compliance tooling; project is private/local, risk low but unverified | Run a license checker (e.g. `pip-licenses`, `license-checker`) in CI | S |

## Top actions

1. Triage the 15 npm audit findings (mostly dev tooling) and bump what is non-breaking.
2. Add a Python lockfile with hashes to make installs reproducible.

## Coverage

- **Scanned**: dependencies (npm audit run; manifest and lockfile reviewed)
- **Skipped**: CVE scan for Python — no `pip-audit`/`safety` available; scanner absent