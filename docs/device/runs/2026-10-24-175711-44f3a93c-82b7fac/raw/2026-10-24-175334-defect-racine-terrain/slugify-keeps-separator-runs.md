---
name: slugify-keeps-separator-runs
description: slugify does not collapse runs of spaces/punctuation to a single - and does not strip leading/trailing dashes
lifecycle: assess
---

## Evidence

Observed output from `slugify-cli 0.4.1`:

```
$ python -c "from slugify import slugify; print(slugify('Hello -- World!'))"
hello---world

$ python -c "from slugify import slugify; print(repr(slugify('  Hello, World!  ')))"
'-hello-world-'
```

## Project Promises (from README.md)

- lower case every word;
- replace any run of spaces and punctuation with a single `-`;
- never start or end a slug with `-`.

## Mismatch

- `slugify('Hello -- World!')` returns `hello---world` instead of `hello-world` (run of `---` not collapsed to `-`)
- `slugify('  Hello, World!  ')` returns `'-hello-world-'` instead of `'hello-world'` (leading/trailing `-` present, and runs of spaces not collapsed)

## Impact

Newsletter importer builds one URL per article using slugify; incorrect slugs may produce broken or duplicate URLs.

## Assumptions

The `slugify` function is expected to follow the project rules stated in README.md.