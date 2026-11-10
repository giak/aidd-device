# Codebase Audit: code-quality

Read-only audit of the `code-quality` pillar on `audio-sync-tool` (scope: entire repository).

- **Date**: 2026-11-10
- **Scope**: entire codebase
- **Health**: fair
- **Findings**: 0 critical, 4 warning, 3 minor

## Findings

| Sev | Category | Location | Issue | Suggested fix | Effort |
| --- | --- | --- | --- | --- | --- |
| 🟡 | code-quality | `app.py:1` | Backend monolith: 2350 lines, 33 routes, tag I/O, scan and NML mixed in one module | Split into Flask blueprints (config, scan, tags, nml, playlists) sharing helpers | L |
| 🟡 | code-quality | `static/src/render/cueEditor.ts:1` | 1701-line module, 28 exports (waveform + beatgrid + cues + NML) | Split into focused modules per concern, keep public entrypoint | L |
| 🟡 | code-quality | `static/src/render/yearsUI.ts:68`, `static/src/render/yearAudit.ts:193`, `static/src/render/dupsUI.ts:26`, `static/src/render/playlistUI.ts:343` | `esc`/`escapeHtml` helper duplicated in 4 modules | Extract one `escapeHtml` into `core/dom.ts` and import | S |
| 🟡 | code-quality | `static/src/render/cueEditor.ts:29` | Pervasive `any` (regions, entries) and non-null assertions weaken type safety | Type wavesurfer regions/entries; replace `as any` with typed interfaces | M |
| 🟢 | code-quality | `static/src/render/eparsUI.ts:155` | `state.journal as any` bypasses the journal entry type | Type `state.journal` as `JournalEntry[]` | S |
| 🟢 | code-quality | `static/src/commands/playlist.ts:98` | Playlist name interpolated into `innerHTML` template without escaping | Use `escapeHtml(name)` (also security) | S |
| 🟢 | code-quality | repository-wide | 325 non-null assertions (`!`) across `static/src` | Audit hot paths; replace with guards where null is realistic | M |

## Top actions

1. Split `app.py` into blueprints and `cueEditor.ts` into focused modules — resolves the two 🟡 structural findings; hand off to `refactor`.
2. Consolidate the duplicated HTML-escape helper into `core/dom.ts` — resolves the 🟡 DRY finding; trivial, high leverage.
3. Type the wavesurfer region/entry shapes in `cueEditor.ts` — resolves the 🟡/🟢 typing findings.

## Coverage

- **Scanned**: code-quality
- **Skipped**: none