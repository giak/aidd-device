# Codebase Audit: security

Read-only audit of the `security` pillar on `audio-sync-tool` (scope: entire repository).

- **Date**: 2026-11-10
- **Scope**: entire codebase
- **Health**: fair
- **Findings**: 0 critical, 2 warning, 3 minor

## Findings

| Sev | Category | Location | Issue | Suggested fix | Effort |
| --- | --- | --- | --- | --- | --- |
| 🟡 | security | `static/src/commands/playlist.ts:98` | Playlist name interpolated into `innerHTML` without escaping (XSS if a playlist name contains markup) | Escape with the shared `escapeHtml` helper before interpolation | S |
| 🟡 | security | `app.py:1039` | `/delete` physically removes files (`os.remove`) instead of moving to `_trash/`, bypassing the project's no-erase rule | Route deletions through `_trash/<date>/` or require explicit confirmation | M |
| 🟢 | security | `app.py:294` | `/config` accepts and persists arbitrary JSON without schema validation | Validate required keys/types (source_data, epars_dirs, configs) before `save_json` | M |
| 🟢 | security | `app.py:325` | No security headers (CSP, X-Frame-Options, nosniff) on the index response | Add a small `after_request` header set (defense in depth for local app) | S |
| 🟢 | security | repository-wide | No CSRF token on state-changing POSTs; acceptable for a single-user localhost app but noted | Document the localhost-only threat model; add CSRF if exposed beyond loopback | M |

## Top actions

1. Escape the playlist name in `commands/playlist.ts:98` — closes the only concrete XSS vector.
2. Align `/delete` with the trash convention — removes the data-loss path.

## Coverage

- **Scanned**: security (input validation, authz, secrets, injection, deserialization reviewed)
- **Skipped**: none
- **Notes**: path traversal is well protected (`is_path_allowed` at `app.py:1122`, incl. symlink tests in `test_app.py`); no hardcoded secrets found; `subprocess` calls use argument lists (no shell injection).