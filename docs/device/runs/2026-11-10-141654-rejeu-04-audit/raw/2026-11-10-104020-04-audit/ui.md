# Codebase Audit: ui

Read-only audit of the `ui` pillar on `audio-sync-tool` (scope: entire repository).

- **Date**: 2026-11-10
- **Scope**: entire codebase
- **Health**: good
- **Findings**: 0 critical, 0 warning, 4 minor

## Findings

| Sev | Category | Location | Issue | Suggested fix | Effort |
| --- | --- | --- | --- | --- | --- |
| 🟢 | ui | `templates/index.html` | Sparse ARIA: only `aria-live` and a few `aria-modal`/`aria-label`; most interactive surfaces rely on custom keyboard handling without roles | Add semantic roles/labels to lists, dialogs and status regions; run axe against a live build | M |
| 🟢 | ui | `templates/index.html` | No loading affordance on the main lists while `/scan` runs (only a progress endpoint consumed by UI) | Add a visible loading state tied to scan progress | S |
| 🟢 | ui | `static/styles/pages/years.css`, `static/styles/pages/legend` (via `measure_legend.py`) | Legend modal reaches 1061 px height below 1850 px viewport (documented limitation) | Re-evaluate the 3-column layout at small widths or accept documented scroll | M |
| 🟢 | ui | `static/src/commands/playlist.ts:98` | Playlist name injected into dialog markup unescaped (also security) | Escape with the shared helper | S |

## Top actions

1. Run an axe pass against a live build (URL not provided in this audit) and fix any violations.
2. Add explicit loading/empty states to the scan-driven lists.

## Coverage

- **Scanned**: ui (static component/markup analysis)
- **Skipped**: runtime accessibility pass — no URL provided, static inspection only; no runtime findings invented