The defect has been created at `aidd_docs/backlog/defects/slugify-leading-dashes.md`. Here's a summary:

| Field | Value |
|---|---|
| **Mismatch** | `slugify("  Hello, World!  ")` returns `'-hello-world-'` with leading/trailing dashes, contradicting the project promise that slugs never start or end with `-` |
| **Lifecycle state** | `capture` — new observed product mismatch, framed per the 09-defect skill |
| **Path written** | `aidd_docs/backlog/defects/slugify-leading-dashes.md` |

The file records the observed output, the violating sources (`README.md`, `tests/test_slugify.py`, `slugify.py`), and the `capture` state with no fix proposed or diagnosed, as instructed.