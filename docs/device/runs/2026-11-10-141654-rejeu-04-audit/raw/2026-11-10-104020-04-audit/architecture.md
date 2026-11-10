# Codebase Audit: architecture

Read-only audit of the `architecture` pillar on `audio-sync-tool` (scope: entire repository).

- **Date**: 2026-11-10
- **Scope**: entire codebase
- **Health**: fair
- **Findings**: 0 critical, 2 warning, 2 minor

## Findings

| Sev | Category | Location | Issue | Suggested fix | Effort |
| --- | --- | --- | --- | --- | --- |
| 🟡 | architecture | `static/src/render/cueEditor.ts:1` | God module: 1701 lines, 28 exports, mixes waveform rendering, beatgrid, cues, NML I/O | Split into `cueWaveform`, `cueBeatgrid`, `cueCues`, `cueNml` with a thin orchestrator | L |
| 🟡 | architecture | `app.py:1` | Monolithic backend: 33 routes + scan + tag I/O + NML parsing in one 2350-line file | Extract Flask blueprints per domain; keep shared helpers in a module | L |
| 🟢 | architecture | repository-wide | No ADR/C4 document in repo (`aidd_docs/memory`, `docs/adr` absent) — conformance check skipped, only coupling heuristics applied | Record the documented architecture (README/AGENT.md) as ADRs or note "no arch docs" in Coverage | S |
| 🟢 | architecture | `static/src/render/*.ts` | Render modules call `fetch` via `api.ts` directly; no service boundary between UI and data | Acceptable for vanilla; document the convention or add thin service modules if growth continues | M |

## Top actions

1. Split the two god modules (`cueEditor.ts`, `app.py`) — resolves both 🟡 findings; hand off to `refactor`.
2. Add at least a minimal ADR index capturing the documented architecture — resolves the conformance gap.

## Coverage

- **Scanned**: architecture (coupling heuristics; no circular imports detected between `static/src` modules)
- **Skipped**: conformance to ADR/C4 — no architecture documents found, conformance check skipped