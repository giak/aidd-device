Verified: block == bank (16 files), and `git status` shows only the two new untracked paths — no tracked file modified.

## What changed

```
aidd_docs/
├── README.md · GUIDELINES.md · CONTRIBUTING.md     copied as-is, placeholders untouched
└── memory/
    ├── README.md                                    copied as-is, file index refreshed by the hook
    ├── project-brief.md architecture.md codebase-map.md coding-assertions.md
    ├── testing.md vcs.md ecosystem.md api.md integration.md cli.md
    ├── data.md database.md deployment.md design.md forms.md navigation.md
    └── internal/.gitkeep · external/.gitkeep
AGENTS.md                                            new, AIDD template + the filled <aidd_project_memory> block
```

**16 memory files**, one per confirmed capability: core (6) · ecosystem · api (2) · ui (3) · cli · data · database · deployment. `backlog` skipped as you asked — the repo tracks its own work in `docs/superpowers/epics/`. `realtime` dropped (the websocket only serves the CDP harnesses). `database` kept (JSON store under `data/`, no ORM).

**Wiring**: opencode only. `AGENTS.md` created from the AIDD template; `update_memory.js opencode` exited 0 and filled the block with the 16 `@aidd_docs/memory/*.md` references and refreshed the TOC in `memory/README.md`. `AGENT.md` (the project's own rulebook) was not touched. Nothing staged or committed.

## What the templates lack, and I did not inject

- **The traceability rule** — every evolution gets an EPIC file plus an index line, and a delivery lands as two commits (`feat:` then `docs: … traçabilité`). The EPIC itself is in the project-brief glossary and the commit pair in `vcs.md`, but the *rule* has no section of its own.
- **The project's rulebook** — `AGENT.md` holds the data-safety rules (never `rm` on user paths, `data/` never overwritten without confirmation), the surgery rules (≤3 files per request) and the work rules. The bank's natural home for it is `aidd_docs/GUIDELINES.md`, whose placeholders are the team's to fill, so I left them as they came.

## One deliberate deviation

The ecosystem graph uses `Human -- desktop --> Traktor`: the four access modes (mcp/cli/http/web) have none for a desktop DJ application, and `web` would be a lie. Its label carries `human only`, per the rule. The app↔Traktor relation (it parses and writes `collection.nml`) is in `integration.md`.
