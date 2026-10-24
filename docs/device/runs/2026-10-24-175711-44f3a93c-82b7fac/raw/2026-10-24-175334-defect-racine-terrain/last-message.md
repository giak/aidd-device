The defect has been created at `aidd_docs/backlog/defects/slugify-keeps-separator-runs.md` with lifecycle state **assess**.

**Summary recorded in the defect:**

| Item | Detail |
|---|---|
| **Title** | slugify-keeps-separator-runs |
| **Evidence** | `slugify('Hello -- World!')` → `hello---world` (should be `hello-world`); `slugify('  Hello, World!  ')` → `'-hello-world-'` (should be `'hello-world'`) |
| **Project promises** (from `README.md`) | lower‑case every word; replace any run of spaces/punctuation with a single `-`; never start/end with `-` |
| **Mismatch** | Runs of separator characters are kept instead of collapsed; leading/trailing `-` are not stripped |
| **Impact** | Newsletter importer may generate broken/duplicate article URLs |
| **Lifecycle state** | **assess** (evidence captured, ready for backlog triage) |

The file is now in the backlog and ready for the next lifecycle transition.