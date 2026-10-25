The defect has been created at `aidd_docs/backlog/defects/slugify-keeps-separator-runs.md` with lifecycle state `capture`, as qualified.

To recap what was recorded:

- **Two observed mismatches** from the QA run: `slugify('Hello -- World!')` returned `hello---world` (kept the `--` run instead of collapsing to `-`), and `slugify("  Hello, World!  ")` returned `'-hello-world-'` (kept leading/trailing dashes, violating the "never start or end with `-`" rule).
- **Lifecycle state**: `capture` — the defect is framed and ready for assessment/finalization per the `09-defect` lifecycle.
- **No code diagnosis or fix** was proposed, per the instruction.