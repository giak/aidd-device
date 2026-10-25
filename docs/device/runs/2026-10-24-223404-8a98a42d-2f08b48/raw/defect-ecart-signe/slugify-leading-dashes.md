---
name: slugify-leading-dashes
description: slugify keeps leading/trailing dashes, breaking the "never start or end with -" promise
source: observations/2026-10-24-qa-run.md
lifecycle: capture
---

## Mismatch

`slugify("  Hello, World!  ")` returns `'-hello-world-'` (keeps leading and trailing dash), but the project promises in `README.md` and `tests/test_slugify.py` that a slug never starts or ends with `-`.

## Evidence

- **Expected** (per `tests/test_slugify.py:13`): `slugify("  Hello, World!  ") == "hello-world"`
- **Observed** (per `observations/2026-10-24-qa-run.md`): `repr(slugify("  Hello, World!  "))` → `'-hello-world-'`
- **Promised** (per `README.md`): "never start or end a slug with `-`"

## Impact

The newsletter importer builds one URL per article using this utility; a slug starting or ending with `-` produces an invalid URL path segment.

## Acceptance Criteria (as documented)

- `slugify("  Hello, World!  ")` must return `"hello-world"` — no leading or trailing dash.