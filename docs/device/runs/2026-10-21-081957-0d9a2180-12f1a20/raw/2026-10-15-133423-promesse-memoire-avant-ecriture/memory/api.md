# API

The HTTP API surface: its style, the main resources, and the contracts.

## Style

- A flat REST-ish surface served by Flask, all of it in `app.py`. No versioning, no base path, no global prefix.
- The resources are grouped by path prefix instead: `/scan`, `/config`, `/copy`, `/years/…`, `/styles/…`, `/api/nml/…`, `/api/track/…`.

## Resources

- Configuration and scan: `/config`, `/scan`, `/scan-progress`, `/load`, `/ping`, `/mkdir`.
- File operations: `/copy`, `/move`, `/delete`, `/journal`.
- Years: `/years/preview`, `/years/review`, `/years/apply`, `/years/audit`, `/years/audit/review`, `/years/web-status`.
- Styles: `/styles/review`, `/styles/apply`, `/styles/audit`, `/styles/align`.
- Playlists, ratings, audio: `/playlists`, `/ratings`, `/audio`.
- Traktor: `/api/nml/status`, `/api/track/match`, `/api/track/add`, `/api/track/cues`, `/api/track/grid`, `/api/beatgrid`, `/api/track/analyze`.

## Contracts

- There is no OpenAPI spec and no schema file: `app.py` is the contract, and the frontend calls it through `static/src/api.ts`, a fetch wrapper with a network retry.
- The routes that write a tag follow one grammar, whichever route it is: validate → confine the path to the configured roots → write the old value to the journal → write the frame → re-read the file. A failed write is reported, never silently swallowed.
- A write also patches the scan index in the same request and answers `cache_updated`. Without it the screen would keep serving the value from before the write.
- The answer says which half of the pair was written: `/copy` returns `style`, `style_writes` and `style_error` separately, so a failed tag never blocks the copy.
- Errors are `jsonify({'ok': False, 'error': …})` with the matching status code. A corrupt JSON file in `data/` is never a 500: the default is returned and the incident is journalled.
