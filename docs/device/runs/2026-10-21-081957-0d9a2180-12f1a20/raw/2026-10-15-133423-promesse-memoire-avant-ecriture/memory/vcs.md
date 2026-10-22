# VCS

The version-control conventions this project follows: branches, commits, and the platform.

## Setup

- Main branch: `main`.
- Platform: GitHub, repository `giak/audio-sync-tool`. `gh` is the CLI, authenticated as `giak`.
- This checkout is a worktree whose `origin` points at a local clone, not at GitHub. The GitHub remote lives on that upstream clone.

## Branches

- No branch convention. The history is linear on `main`, with the occasional scratch branch; work lands on `main` directly.
- The unit of work is an EPIC, not a branch.

## Commits

- Conventional-commit prefixes, in use: `feat`, `fix`, `docs`, `chore`, `style`. The subject names the EPIC when there is one: `feat: EPIC-051+052 — la copie se lit d'un coup d'œil…`.
- The subject is French and imperative, the body gives the why and the measured numbers.
- A delivery is usually two commits: the code (`feat:`) and the traceability (`docs: EPIC-0xx — traçabilité (<sha>)`). The `docs:` commit is what closes the EPIC in the index.
- The numbers in a commit body are the ones measured at the time. They are a snapshot, not a standing truth.

## Commit Strategy

- AI should auto commit: `after task done` — one atomic commit per delivered change, never a commit that smuggles in an unrelated edit.
- The project's own surgery rules (`AGENT.md`, %SURGERY) still apply: at most three files per request, and `git diff` plus a green suite before the commit.
