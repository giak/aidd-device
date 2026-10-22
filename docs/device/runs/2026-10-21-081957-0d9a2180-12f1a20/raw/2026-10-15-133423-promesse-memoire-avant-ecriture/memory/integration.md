# Integration

How this system integrates with external/third-party services. The map of every tool around the project, this one included, lives in the ecosystem memory.

## External services

- **MusicBrainz** (`musicbrainz.org/ws`): the reference for a track's first release. `scripts/collect_years.py`, one request per second.
- **Deezer** (`api.deezer.com`): the second provider, no key. It has to name both the artist and the title to count.
- **Discogs** (`api.discogs.com`): the third provider, needs a token in `data/discogs_token` (gitignored, chmod 600), 60 requests per minute. Two extra passes rephrase the query when the artist name is junk (`collect_discogs_reform.py`, `collect_discogs_reform2.py`).
- **iTunes** (`itunes.apple.com`): an appendix pool, no key, about 20 requests per minute.
- **YouTube**, through `yt-dlp`: the "- Topic" channels and only them, the duration within 15 s. The run collected 0 of 84 — the Topic channels had been merged into the artist profiles.
- **Local web search**: a DuckDuckGo MCP server at `http://localhost:8010/mcp` (`data/search_mcp.json` or `SEARCH_MCP_URL` to change it), with a fallback on the public HTML endpoint. `GET /years/web-status` probes it in one second. The years it returns are candidates only: they never vote, so the two-provider rule is not bypassed.
- **Traktor**: the app reads and writes `collection.nml` — the index, the added tracks, the cues, the beatgrids. Traktor itself is a desktop application the human opens.
- **Chrome**: the headless harnesses (`scripts/measure_*.py`, `scripts/proof_*.py`, `scripts/capture_ui.py`) drive it over the DevTools Protocol, and read the tags back from disk to prove a write.
- **ffmpeg**: decodes mp3, flac and ogg for the server-side beat analysis (`analysis.py`). Without it only the WAV path works, through the `wave` stdlib.

## Calling conventions

- Every provider is queried over plain HTTP with an explicit rate limit, and every answer is cached as JSONL in `data/`. A key that was collected is never queried again: the collection is incremental, and the errors are re-throwable.
- The web search is optional. When it is unreachable, the years review says so instead of leaving the impression that it is available.
- The Traktor match keys on the file name **and** its size in rounded kilobytes: Traktor stores the size that way, and in bytes the match never succeeds.
