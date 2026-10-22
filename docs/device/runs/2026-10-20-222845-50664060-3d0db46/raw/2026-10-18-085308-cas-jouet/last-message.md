Done. One file written, nothing else touched.

**Written:** `terrain/aidd_docs/NOTES.md` (204 B, 3 lines, `sha256 2ab3d3cc…`)

```text
- Read the repository before writing anything.
- Show what you read as a table, one row per file, and wait for the operator.
- Write one file only, where the operator asked, after the table is confirmed.
```

One line per rule, taken verbatim from `framework-origin/PLAYBOOK.md` (the repo itself carries no rules of its own — `README.md` is 3 lines of description, `app.py` a single `print`).

**State of the working copy:**
- `git status --porcelain` → `?? aidd_docs/` — the only entry; `README.md` and `app.py` keep their original hashes (`77e6c7f2…`, `072357af…`), unmodified.
- `diff -r` against `origine/terrain` reports only the added `aidd_docs` directory.
- No commit, no other file, `framework-origin/` left read-only.

One point left to you: the notes are untracked (not committed), since "nothing else" read as *no other write*. Say the word if the commit is wanted.