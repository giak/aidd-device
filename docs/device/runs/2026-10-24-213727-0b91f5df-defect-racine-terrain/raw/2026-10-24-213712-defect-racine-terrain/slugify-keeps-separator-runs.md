# Defect: slugify keeps separator runs

## Source

QA observation — `observations/2026-10-24-qa-run.md`, run on released wheel `slugify-cli 0.4.1`.

## Observed mismatch

| Call | Observed output | Project promise (README.md) |
|---|---|---|
| `slugify('Hello -- World!')` | `hello---world` | "replace any run of spaces and punctuation with a single `-`" |
| `slugify("  Hello, World!  ")` | `'-hello-world-'` | "never start or end a slug with `-`" |

Both observed calls violate the project's own stated rules.

## Evidence

- `slugify('Hello -- World!')` produces three consecutive dashes `---` instead of collapsing the `--` run to a single `-`.
- `slugify("  Hello, World!  ")` preserves leading and trailing dashes, contradicting the "never start or end a slug with `-`" rule.

## Impact

The newsletter importer builds one URL per article from slugified titles. Preserved separator runs and leading/trailing dashes produce malformed URL slugs, which may break link resolution or produce inconsistent article URLs.

## Remediation class

The `slugify` function should collapse any run of spaces and punctuation (including `--`, `!`, `,`, etc.) to a single `-`, and strip leading/trailing `-` characters. This aligns with the three rules promised in `README.md`.

## Lifecycle state

**capture** — defect framed from observed QA mismatch; ready for assessment and finalization per the `09-defect` lifecycle (source → capture → assess → finalize).

## Links

- `observations/2026-10-24-qa-run.md` — raw QA output
- `README.md` — project promises
- `tests/test_slugify.py` — test expectations