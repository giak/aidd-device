Report written: `docs/superpowers/specs/2026-08-01-carte-visite-v2-design-shadow-report.md`

**What the skill did**
- Read `actions/01-detect.md` and `actions/02-render-report.md` before running them (as the skill requires), plus the locked sets, category definitions, severity rubric, probe rules and report template.
- `detect`: source validated (markdown, inside the working directory, not a `*-shadow-report.md`), no prior report found → plain mode; scanned the 7 locked categories in order, deduped by category + snippet, assigned severity from the rubric, wrote each probe as a direct question.
- `render-report`: one heading per category in locked order, gaps sorted blocker → major → minor, snippet as blockquote, header totals filled, no `status: clean` stamp (majors remain), no warnings block (nothing to warn about), saved next to the source under the derived name.

**Result: 18 gaps — 0 blocker, 11 major, 7 minor**

The heaviest clusters, all concrete rather than generic:
- **Calibration**: canvas `measureText` widths assumed to survive px→pt→mm into print; the URL measured lowercase but displayed uppercase; print scale never stated (fit-to-page would shrink every card).
- **Cut layout**: the 0.5pt "repère de coupe" is never placed relative to the 90×55 trim box, and adjacent cards share a cut line with no gutter.
- **"~5mm" cut margin** conflicts with a centred 180×275mm grid on A4 (leftover 15mm/11mm), so it reads as either fixed, minimum, or approximate.
- **Success criteria not testable**: "pyramide visible à l'œil nu" and "lisibles" have no tolerance or minimum size.
- **Unnamed dependency**: `v2/carte_de_visite.svg` has no stated production path that would keep it metric-identical to the A4.

**Constraints respected**: source untouched (`md5 78ecf00d…` identical before/after), no file written outside the report, nothing else in the repo modified (only the report appears as untracked).