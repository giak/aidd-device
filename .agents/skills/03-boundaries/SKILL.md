---
name: Repository boundaries
description: The four trees and what may be written where: origin never modified in place, revision under test in a throwaway directory, terrain read-only, this repo. Use when writing into any repository, creating a worktree, or running anything that executes. Not for ordinary edits inside this repo, or for reasoning.
---
## TERRITORY

Four things stay distinct here, never merged:

* **framework-origin** — `/home/giak/projects/framework`. Never modified in place, never written into.
  Evidence that origin is unchanged: two identical `git -C <origin> status --porcelain`, before and after.
* **revision-under-test** — a revision of origin, checked out into a throwaway
  directory outside every tree below; a per-run parameter, never a constant of this file.
* **terrain** — `/home/giak/projects/audio-sync-tool`, read-only, at the revision each run records.
* **this-repo** — the device and its documents, nothing else.
* Never install origin here. Reading its tree: allowed. Copying its files, skills or output here: never.
* Anything that executes runs in a throwaway directory outside these trees.
* The report the spec asks for is written in the framework's PR working copy (a checkout, never the
  origin) at `aidd_docs/tasks/<year_month>/<date_slug>/ECART.md`.
