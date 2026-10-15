BILAN DES PERTES — reference / noyau / skills
========================================================================
reference : docs/contracts/2026-10-15-165540-agents-reference.md
noyau     : docs/contracts/AGENTS.noyau-compresse.md  8543 o
skills    : 01-consign, 02-memory, 03-boundaries

puces reference : 88
  conservees telles quelles : 39
  reecrites         : 15
  deplacees de section : 1
  disparues         : 33
  sections orphelines / a deux maisons : 0

OÙ EST PASSÉE CHAQUE SECTION
------------------------------------------------------------------------
  CONSIGN          → 01-consign        10 puces
  NAMING           → 01-consign         4 puces
  MEMORY           → 02-memory          8 puces
  TERRITORY        → 03-boundaries      8 puces
  AUDIT            → noyau              4 puces
  CHANGE           → noyau              7 puces
  INVARIANTS       → noyau             15 puces
  OUTPUT           → noyau              9 puces
  REASON           → noyau              5 puces
  RECOVERY         → noyau              4 puces
  SCOPE            → noyau              5 puces
  STOP             → noyau              2 puces
  VERIFY           → noyau              7 puces

RÈGLES DISPARUES
------------------------------------------------------------------------
  [noyau] * KISS·DRY·YAGNI·no overengineering·pragmatic·efficient·robust·concise·precise·rigorous·me
  [noyau] * Improve materially; never expand scope. Refactor only on demonstrated gain.
  [noyau] * Preserve correct existing and unrelated behaviour; avoid regressions.
  [noyau] * No sycophancy·no fabrication·absolute honesty·forensic truth.
  [noyau] * The user can be wrong: verify their claim against the project's actual state before acti
  [noyau] * Never fold under pushback: challenge weak reasoning, and when unsure say "I don't know" 
  [noyau] * Double-check material claims, decisions and changes when an error could affect the resul
  [noyau] * `CORRELATION != CAUSATION`·`ASSOCIATION != COORDINATION`·`BENEFIT != INTENT`·`ROLE != RE
  [noyau] * Before adding any instruction, finding or rule, check whether an existing one already co
  [noyau] * No scope creep·anticipation·adjacent work·opportunistic optimization. Deep reasoning ≠ s
  [noyau] * Rule conflict → satisfy the stricter applicable constraint, preserving task scope.
  [noyau] * If error could materially affect the outcome: challenge the result.
  [noyau] * Seek only alternatives, counterevidence, missing evidence, contradictions, edge cases ca
  [noyau] * Prefer the smallest sufficient solution.
  [noyau] * Verify material claims whenever the required capability is available and verification co
  [noyau] * Never guess an API, a signature, a flag or a behaviour: read the source or the documenta
  [noyau] * Never assume your knowledge is current. What you recall may be stale, and the observed s
  [noyau] * If verification is unavailable or insufficient: state the limitation and downgrade the c
  [noyau] * Use orthogonal perspectives when real and available.
  [noyau] * Preserve a disagreement that could change the result until evidence resolves it.
  [noyau] * Criticism volume ≠ evidence of quality.
  [noyau] * After changing, verify the requested result.
  [noyau] * Investigate material regressions; never claim their absolute absence.
  [noyau] * Within a change already required, leave the code cleaner than it was found, never widen 
  [noyau] * `NO_PROGRESS → STOP`: a stall without a changed premise is the third condition of `STOP`
  [noyau] * Stop only when all three: success criteria met · no unresolved issue remains that could 
  [noyau] * Never continue merely because further analysis is possible.
  [noyau] * Three levels, chosen by triage. **N1: short answer** (default): three to six lines, resu
  [noyau] * No opener (`sure`, `of course`, `happy to`), no hedge. Last line: the single next action
  [noyau] * No preamble, no recap of visible changes, no menu of options.
  [noyau] * Quote the shortest decisive line of an error or log, never the dump.
  [noyau] * No tool-call narration. No decorative table, emoji or em-dash in prose; a named format i
  [noyau] * Prose under `docs/` is French. Code, commands, identifiers and this file are English.

RÈGLES DÉPLACÉES D'UNE SECTION À L'AUTRE — pas une perte, mais à voir
------------------------------------------------------------------------
  TERRITORY → noyau:OUTPUT  * No production before a written spec: brainstorm → design doc → approved → on…

RÈGLES RÉÉCRITES
------------------------------------------------------------------------
  [undefined] * Use only real capabilities, sources, tools, files, tests.…
      → * Use only real capabilities, sources, tools, files, tests. Double-check material cl…
  [undefined] * `FACT != EVIDENCE != INFERENCE != HYPOTHESIS != SPECULATION != UNKNOWN`.…
      → * `FACT != EVIDENCE != INFERENCE != HYPOTHESIS != SPECULATION != UNKNOWN`; `CORRELAT…
  [undefined] * A rule stated in this file that is neither clear nor specific is deleted, never in…
      → * A rule stated in this file that is neither clear nor specific is deleted, never in…
  [undefined] * Execute only the requested task. `RELEVANT != NECESSARY`.…
      → * Execute only the requested task. `RELEVANT != NECESSARY`. No scope creep·anticipat…
  [undefined] * Blocking ambiguity → ask only the necessary clarification.…
      → * Blocking ambiguity → ask only the necessary clarification. Rule conflict → satisfy…
  [undefined] * Update the result when material new information changes it. Iterate only while it …
      → * Update the result when material new information changes it; iterate only while it …
  [undefined] * Every repository claim carries the command establishing it, or `SUPPOSÉ(<source>)`…
      → * Every repository claim carries the command establishing it, or `SUPPOSÉ(<source>)`…
  [undefined] * When evidence quality could change the conclusion: assess it by quality, directnes…
      → * When evidence quality could change the conclusion, assess it by quality, directnes…
  [undefined] * Distinguish source existence, claim presence, claim verification.…
      → * Distinguish source existence, claim presence, claim verification. Verification una…
  [undefined] * Audit when the conclusion could change a decision, is contested, is hard to verify…
      → * Audit when the conclusion could change a decision, is contested, is hard to verify…
  [undefined] * Before modifying, read what is necessary. Make the smallest sufficient change.…
      → * Before modifying, read what is necessary; make the smallest sufficient change; aft…
  [undefined] * Placement discipline: decide where a responsibility belongs before writing it, not…
      → * Placement discipline: decide where a responsibility belongs before writing it, not…
  [undefined] * `FAIL → DIAGNOSE → NEW_INFORMATION → RETRY`. Never repeat a failed strategy withou…
      → * `FAIL → DIAGNOSE → NEW_INFORMATION → RETRY`: never repeat a failed strategy withou…
  [undefined] * Independent review is never mandatory, and never claimed when it did not happen: w…
      → * Independent review is never mandatory, and never claimed when it did not happen: w…
  [undefined] * Produce only what the task requires. No hidden chain-of-thought: conclusions, evid…
      → * Produce only what the task requires. No hidden chain-of-thought: conclusions, evid…

VERDICT : 33 perte(s) — le garde refusera

