---
name: Consign and naming
description: CONSIGN trace entry, dated filename, task folder, frontmatter, proof, immutability, drift. USE IF must outlive the session | a file is created, renamed | moved. NOT FOR reasoning | verifying a claim | deciding what to build.
---
## CONSIGN

NO CHANGE IS FINISHED WITHOUT the document explaining it; CONSIGN = closure condition, NEVER added scope.
2 CHANNELS only: channel 1, per exchange → memory written immediately, NEVER at end of session, its id
cited wherever its facts are used; channel 2, per séance → section of `docs/trace.md`, numbered
`## Séance N — YYYY-MM-DD (subject)`, continued `(suite)` when a séance resumes, appended, NEVER rewritten;
séance without its section = does not exist.
SÉANCE SKELETON: Objectif; Fait: what was produced, + commands; Vérifié: exit codes, figures, `OPEN`|`UNKNOWN`
said aloud; Dérives signalées, non corrigées; Rectifications of its own claims; Prochaines
étapes; Mémoires one line per memory. ABSENT SUBSECTION = silence, NEVER filler.
ONE HOME PER NATURE, under `docs/`, nothing else: journal = `docs/trace.md`; task = its folder; closed =
`docs/archive/`. NEVER float at repo root; NO parallel tree; NO spec without a home; IF no declared home →
today's section. DUPLICATE document restating another → the copy loses.
EVERY FACT CARRIES ITS PROOF: exchange → memory id; measurement → command establishing it; date → git
 `%cI`, NEVER document declared. A NAME = convenience, NEVER evidence; SOURCE = the machine: application
database: tool calls = `parts_json` parts, NOT message rows, git history, exports, Mnemolite.
2 LEVELS of immutability: closed section|document = dated record, NEVER edited again; the change concerning
it → new dated record citing it; the running séance stays alive & is worked at.
CONSIGNED DOCUMENT CARRIES `name`;`description`;`type`;`status`, `status` ∈
`pending`;`in-progress`;`done`;`blocked`.
ZERO TOLERANCE TO DRIFT: anything outside these rules named immediately in the running séance section,
NEVER excused, NEVER re-declared in a v2.
ONLY COMMITTED DOCUMENTS OUTLIVE MEMORY: a change without a document, | a document uncommitted, leaves
nothing read.
NO script|hook|CI by default: a mechanical check is EARNED by demonstrated drift, NEVER promised.

## NAMING

EVERY CREATED FILE carries `YYYY-MM-DD-HHMMSS-` in local time, e.g. `2026-09-26-142305-revision-du-plan.md`;
SECONDS, NOT minutes: at minute resolution pieces written in one minute are indistinguishable & alphabetical
order stops being chronological.
TASK FOLDER = `docs/tasks/<YYYY_MM>/<YYYY-MM-DD-HHMMSS>-<slug>/`; its documents keep their type after the
prefix: `...-spec.md`;`...-plan.md`;`...-run.md`;`...-ecart.md`; links use the full name.
PREFIX carries the measured birth time `stat -c %w`, NEVER guessed|rounded; a small measured gap stays
named, NEVER silently corrected.
RENAME updates paths & nothing else: a path inside a live document is updated; a renamed path = broken link;
a block recording actually run command output keeps the old paths it printed, verbatim.
