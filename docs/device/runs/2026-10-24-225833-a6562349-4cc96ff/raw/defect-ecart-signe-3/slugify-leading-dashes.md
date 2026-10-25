# Defect: slugify retains leading and trailing dashes

## Source
QA observation — slugify, 2026-10-24 (observations/2026-10-24-qa-run.md)

## Description
`slugify("  Hello, World!  ")` returns `'-hello-world-'`, preserving a leading dash and a trailing dash. The project promises (README.md, test_no_leading_or_trailing_dash) that a slug never starts or ends with `-`.

## Evidence
- `slugify('  Hello, World!  ')` produces `'-hello-world-'` (leading and trailing dashes retained)
- README.md rules: lower case every word, replace runs of spaces/punctuation with a single `-`, never start or end a slug with `-`
- test_no_leading_or_trailing_dash asserts `slugify("  Hello, World!  ") == "hello-world"`

## Impact
Newsletter importer builds one URL per article; a slug starting or ending with `-` may break URL resolution or produce unexpected paths.

## Lifecycle state
captured

## Assumptions
- The slugify function is implemented in `slugify.py` and imported by the newsletter pipeline.
- No intentional design to allow leading/trailing dashes; the behavior appears to be an edge-case artifact of how leading/trailing spaces are trimmed.