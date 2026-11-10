# Codebase Audit: performance

Read-only audit of the `performance` pillar on `audio-sync-tool` (scope: entire repository).

- **Date**: 2026-11-10
- **Scope**: entire codebase
- **Health**: good
- **Findings**: 0 critical, 0 warning, 3 minor

## Findings

| Sev | Category | Location | Issue | Suggested fix | Effort |
| --- | --- | --- | --- | --- | --- |
| 🟢 | performance | `app.py:543` | `/scan` indexes synchronously in-process; large collections block the request thread (progress tracking exists but no background worker) | Move scan to a background job or chunked streaming; keep progress endpoint | M |
| 🟢 | performance | `static/src/render/cueEditor.ts` | Waveform 3-band rendering recomputed on every zoom/seek without memoization in hot paths | Memoize downsampled band data per zoom level | M |
| 🟢 | performance | `static/dist/script.js` | Bundle is 274 KB (wavesurfer included); no bundle analyzer run to confirm duplication | Run a bundle analyzer and tree-shake unused wavesurfer plugins | S |

## Top actions

1. Run a bundle analyzer and confirm no duplicated dependency in the 274 KB bundle.
2. Profile `/scan` on a large collection before considering a background worker.

## Coverage

- **Scanned**: performance (static heuristics)
- **Skipped**: no profiler or bundle analyzer available — static heuristics only; no runtime bottleneck asserted without evidence