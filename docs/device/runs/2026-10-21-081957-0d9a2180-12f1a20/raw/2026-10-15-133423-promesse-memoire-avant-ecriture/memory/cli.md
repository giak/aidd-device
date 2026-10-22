# CLI

The command-line tool: its commands, inputs, and distribution.

## Commands

There is no single entry point: the CLI is a set of Python scripts in `scripts/`, run with `./venv/bin/python scripts/<name>.py`.

- `collect_years.py`, `collect_discogs.py`, `collect_itunes.py`, `collect_discogs_reform.py`, `collect_discogs_reform2.py`, `collect_youtube_topic.py`: fill the year caches from the providers.
- `report_years.py`: merge the caches into one report, writing nothing.
- `apply_years.py`, `apply_styles.py`: write the tags, or undo them.
- `audit_applied_years.py`: audit the years already written, into `confirme` / `contredit` / `a_revoir` / `non_verifie`.
- `remix_credit.py`: the credit of a remix, the first parenthesised segment that names someone.
- `measure_*.py`, `proof_*.py`, `capture_ui.py`, `perf_ui.py`: the headless browser harnesses.

## Interface

- `argparse` throughout, and the flags mean the same thing everywhere: `--report` reads, `--apply` writes, `--undo` reverts, a dry run is the default.
- `--limit N` samples the work, `--only=remix` restricts a collection to the remix keys, `--keys-from-tags` switches the year matching from the file name to the tags, `--review` applies the human's choices from the years view.
- The scripts resolve `data/` from the repository root, so they are run from the root.

## Distribution

- Not published anywhere. They are part of the repository and run in place from the virtualenv (`./venv/`); `npm start` is the equivalent for the app itself.
