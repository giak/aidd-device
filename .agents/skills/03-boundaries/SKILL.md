---
name: Repository boundaries
description: TERRITORY 4 trees, what may be written where: origin NEVER modified in place; revision under test in a throwaway dir; terrain read-only; this repo. USE IF writing into any repository | creating a worktree | running anything that executes. NOT FOR ordinary edits inside this repo | reasoning.
---
## TERRITORY

4 THINGS stay distinct, NEVER merged:
* framework-origin — `/home/giak/projects/framework`. NEVER modified in place, NEVER written into.
  PROOF origin unchanged = 2 identical `git -C <origin> status --porcelain`, before & after.
* revision-under-test — a revision of origin, checked out into a throwaway directory OUTSIDE every tree
 below; a per run parameter, NEVER a constant of this file.
* terrain — `/home/giak/projects/audio-sync-tool`, read only, at the revision each run records.
* this-repo — the device & its documents, nothing else.
NEVER install origin here; READING its tree: allowed; COPYING its files, skills | output here: NEVER.
anything that executes runs in a throwaway directory OUTSIDE these trees.
the report the spec asks for is written in the framework's PR working copy, a checkout NEVER the origin,
at `aidd_docs/tasks/<year_month>/<date_slug>/ECART.md`.
