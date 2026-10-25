The defect has been created at `aidd_docs/backlog/defects/slugify-leading-dashes.md`.

**Summary of what was recorded:**

| Qualification | Detail |
|---|---|
| **Mismatch** | `slugify("  Hello, World!  ")` returns `'-hello-world-'` (leading + trailing dash) vs. the promise that a slug never starts or ends with `-` |
| **Evidence** | Expected: `"hello-world"` (per `tests/test_slugify.py:13`) • Observed: `'-hello-world-'` (per `observations/2026-10-24-qa-run.md:9`) • Promised: "never start or end a slug with `-`" (per `README.md`) |
| **Impact** | Newsletter importer produces invalid URL path segments |
| **Lifecycle state** | `capture` — new observation framed from the source |
| **Path** | `aidd_docs/backlog/defects/slugify-leading-dashes.md` |

The file captures the observed mismatch, the documentary evidence, and the acceptance criterion — without diagnosing the cause or proposing a fix, as instructed.