# Codebase Audit: audio-sync-tool

Full read-only audit across the seven quality pillars.

- **Date**: 2026-11-10
- **Scope**: entire repository (audio-sync-tool)
- **Health**: fair
- **Findings**: 0 critical, 9 warning, 21 minor

## Findings

One row per issue, sorted by severity (critical first). Category = pillar.

| Sev | Category | Location | Issue | Suggested fix | Effort |
| --- | --- | --- | --- | --- | --- |
| 🟡 | code-quality | `app.py:1` | Backend monolith: 2350 lines, 33 routes, tag I/O, scan and NML mixed in one module | Split into Flask blueprints (config, scan, tags, nml, playlists) | L |
| 🟡 | code-quality | `static/src/render/cueEditor.ts:1` | 1701-line module, 28 exports (waveform + beatgrid + cues + NML) | Split into focused modules per concern | L |
| 🟡 | code-quality | `static/src/render/yearsUI.ts:68`, `static/src/render/yearAudit.ts:193`, `static/src/render/dupsUI.ts:26`, `static/src/render/playlistUI.ts:343` | `esc`/`escapeHtml` helper duplicated in 4 modules | Extract one helper into `core/dom.ts` | S |
| 🟡 | code-quality | `static/src/render/cueEditor.ts:29` | Pervasive `any` (regions, entries) and non-null assertions weaken type safety | Type wavesurfer regions/entries | M |
| 🟡 | architecture | `static/src/render/cueEditor.ts:1` | God module: 1701 lines, 28 exports, mixes waveform rendering, beatgrid, cues, NML I/O | Split into focused modules with a thin orchestrator | L |
| 🟡 | architecture | `app.py:1` | Monolithic backend: 33 routes + scan + tag I/O + NML parsing in one 2350-line file | Extract Flask blueprints per domain | L |
| 🟡 | security | `static/src/commands/playlist.ts:98` | Playlist name interpolated into `innerHTML` without escaping (XSS) | Escape with the shared helper | S |
| 🟡 | security | `app.py:1039` | `/delete` physically removes files (`os.remove`) instead of moving to `_trash/` | Route deletions through `_trash/<date>/` or require confirmation | M |
| 🟡 | dependencies | `package-lock.json` | `npm audit`: 15 vulnerabilities in dev toolchain (3 critical, 6 high, 6 moderate) | Run `npm audit fix`; schedule devDeps bump | M |
| 🟢 | code-quality | `static/src/render/eparsUI.ts:155` | `state.journal as any` bypasses the journal entry type | Type `state.journal` as `JournalEntry[]` | S |
| 🟢 | code-quality | `static/src/commands/playlist.ts:98` | Playlist name interpolated into `innerHTML` template without escaping | Use `escapeHtml(name)` | S |
| 🟢 | code-quality | repository-wide | 325 non-null assertions (`!`) across `static/src` | Audit hot paths; replace with guards where null is realistic | M |
| 🟢 | architecture | repository-wide | No ADR/C4 document in repo — conformance check skipped, only coupling heuristics applied | Record documented architecture as ADRs | S |
| 🟢 | architecture | `static/src/render/*.ts` | Render modules call `fetch` via `api.ts` directly; no service boundary | Document convention or add thin service modules | M |
| 🟢 | security | `app.py:294` | `/config` accepts and persists arbitrary JSON without schema validation | Validate required keys/types before `save_json` | M |
| 🟢 | security | `app.py:325` | No security headers (CSP, X-Frame-Options, nosniff) on index response | Add an `after_request` header set | S |
| 🟢 | security | repository-wide | No CSRF token on state-changing POSTs (acceptable for localhost single-user) | Document threat model; add CSRF if exposed beyond loopback | M |
| 🟢 | dependencies | `requirements.txt` | Pins Flask 3.1.3 / mutagen 1.47.0 / pytest 9.1.1 but no lockfile or hashes; env runs older | Add a pinned lock (pip-compile) with hashes | S |
| 🟢 | dependencies | `package.json` | Only one runtime npm dependency (`wavesurfer.js`); devDeps are the whole surface | Keep runtime minimal | S |
| 🟢 | dependencies | repository-wide | No license-compliance tooling | Run a license checker in CI | S |
| 🟢 | performance | `app.py:543` | `/scan` indexes synchronously in-process; large collections block the request thread | Move scan to a background job or chunked streaming | M |
| 🟢 | performance | `static/src/render/cueEditor.ts` | Waveform 3-band rendering recomputed on every zoom/seek without memoization | Memoize downsampled band data per zoom level | M |
| 🟢 | performance | `static/dist/script.js` | Bundle is 274 KB (wavesurfer included); no bundle analyzer run | Run a bundle analyzer and tree-shake unused plugins | S |
| 🟢 | tests | `README.md:597`, `README.md:621` | Documentation counts drift (claimed 53 vitest files/1230 tests, 12 pytest/367; actual 75 and 371) | Regenerate counts from CI and update README | S |
| 🟢 | tests | `.github/workflows/ci.yml` | No coverage gate in CI (coverage run is manual) | Add a coverage threshold step | S |
| 🟢 | tests | repository-wide | No backend coverage measurement (pytest without `--cov`) | Add `pytest-cov` and a threshold | M |
| 🟢 | ui | `templates/index.html` | Sparse ARIA: only `aria-live` and a few `aria-modal`/`aria-label` | Add semantic roles/labels; run axe against a live build | M |
| 🟢 | ui | `templates/index.html` | No loading affordance on the main lists while `/scan` runs | Add a visible loading state tied to scan progress | S |
| 🟢 | ui | `static/styles/pages/years.css` (legend) | Legend modal reaches 1061 px height below 1850 px viewport (documented limitation) | Re-evaluate 3-column layout at small widths | M |
| 🟢 | ui | `static/src/commands/playlist.ts:98` | Playlist name injected into dialog markup unescaped | Escape with the shared helper | S |

## Top actions

1. Split the two god modules (`app.py`, `cueEditor.ts`) — resolves 4 warning findings; hand off to `refactor`.
2. Consolidate the duplicated HTML-escape helper into `core/dom.ts` and apply it in `commands/playlist.ts:98` — closes the XSS vector and the DRY finding.
3. Type the wavesurfer region/entry shapes in `cueEditor.ts` — removes most `any` usage.
4. Triage the 15 npm audit findings (dev toolchain) and add a Python lockfile with hashes.
5. Refresh README test/coverage counts and add coverage gates to CI.

## Coverage

- **Scanned**: code-quality, architecture, security, dependencies, performance, tests, ui
- **Skipped**:
  - architecture: conformance to ADR/C4 — no architecture documents found, conformance check skipped (coupling heuristics applied)
  - dependencies: CVE scan for Python — no `pip-audit`/`safety` available, scanner absent
  - performance: no profiler or bundle analyzer available — static heuristics only
  - ui: runtime accessibility pass — no URL provided, static inspection only
- **Notes**: baseline verified green before audit: `npm test` 1230/1230 pass, `npm run typecheck` clean, `npm run lint` clean, `npm run build` succeeds, `pytest` 371/371 pass. No code was changed by this audit.