---
name: Consign and naming
description: Consign what a change produced: trace entry, dated filename, task folder, frontmatter, proof, immutability, drift. Use when something must outlive the session, or a file is created, renamed or moved. Not for reasoning, verifying a claim, or deciding what to build.
---
## CONSIGN

* A change is not finished until the document explaining it exists. Consigning is a closure condition, never added scope.
* Two channels, nothing else. (1) Per exchange, a memory written immediately, never at the end of the session; its id cited wherever its facts are used. (2) Per séance, a section of `docs/trace.md`, numbered `## Séance N — YYYY-MM-DD (subject)`, continued by `(suite)` when a séance resumes, appended and never rewritten afterwards. A séance without its section does not exist.
* A séance entry follows the skeleton: Objectif; Fait (what was produced, with the commands); Vérifié (exit codes, figures, or `OPEN`/`UNKNOWN` said aloud); Dérives signalées, non corrigées; Rectifications of its own claims; Prochaines étapes; Mémoires (one line per memory). An absent subsection is silence, never filler.
* One home per nature, under `docs/`, nothing else: the journal at `docs/trace.md`, a task in its folder, what is closed in `docs/archive/`. Nothing floats at the repository root, no parallel tree, no spec without a home; what has no declared home yet lives in today's section. A document restating another is a duplicate; the copy loses.
* Every fact carries its proof: an exchange its memory id, a measurement the command establishing it, a date git (`%cI`, never declared by the document). A name is a convenience, never evidence; the source is the machine: the application database (tool calls are `parts_json` parts, not message rows), git history, exports, Mnemolite.
* Two levels of immutability: a closed section or document is a dated record, never edited again; the change concerning it opens a new dated record citing it. The running séance stays alive and is worked at.
* A consigned document carries `name`;`description`;`type`;`status`, with `status` ∈ `pending`;`in-progress`;`done`;`blocked`.
* Zero tolerance to drift: anything outside these rules is named immediately in the running séance section, never excused, never re-declared in a v2.
* Only committed documents outlive memory: a change without a document, or a document left uncommitted, leaves nothing read.
* No script, no hook, no CI by default: a mechanical check is earned by demonstrated drift, never promised.

## NAMING

* Every file created from this rule carries `YYYY-MM-DD-HHMMSS-` in local time, e.g. `2026-09-26-142305-revision-du-plan.md`. Seconds, not minutes: at minute resolution, pieces written in one minute are indistinguishable and alphabetical order stops being chronological.
* A task folder is `docs/tasks/<YYYY_MM>/<YYYY-MM-DD-HHMMSS>-<slug>/`; its documents keep their type after the prefix: `...-spec.md`;`...-plan.md`;`...-run.md`;`...-ecart.md`. Links use the full name.
* The prefix carries the measured birth time (`stat -c %w`), never a guessed or rounded one. A small measured gap stays named, never silently corrected.
* A rename updates paths and nothing else: a path written inside a live document is updated, a renamed path being a broken link; but a block recording the output of a command actually run keeps the old paths it printed, verbatim.
