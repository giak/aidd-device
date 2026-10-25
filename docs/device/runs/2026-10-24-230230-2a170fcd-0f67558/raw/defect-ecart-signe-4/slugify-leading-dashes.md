# Defect: slugify produces leading/trailing dashes

**State:** capture

**Observed mismatch:**
- `slugify("  Hello, World!  ")` returns `'-hello-world-'` (with leading and trailing `-`)
- `README.md` promises: "never start or end a slug with `-`"
- Test `test_no_leading_or_trailing_dash` expects `"hello-world"`

**Evidence:**
- `observations/2026-10-24-qa-run.md` records the call producing `'-hello-world-'`
- `tests/test_slugify.py` contains `test_no_leading_or_trailing_dash` asserting the correct output
- `README.md` rules state replacement of runs of spaces/punctuation with `-` and no leading/trailing `-`

**Product impact:** Newsletter importer builds one URL per article; a leading/trailing dash may break URL formatting.

**Assessment:** The discrepancy is between observed output and documented promise; requires revisiting slugify implementation or documentation.