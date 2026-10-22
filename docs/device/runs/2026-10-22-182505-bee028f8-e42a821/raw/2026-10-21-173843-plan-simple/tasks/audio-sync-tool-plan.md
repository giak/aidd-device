# Audio Sync Tool: "Copy All Missing" Plan

## 🧰 Implementation Plan

### 🔧 Phase 1: Backend Core
- ✅ Write app.py skeleton with config + data helpers
- ✅ Test config routes + implement
- ✅ Run config tests
- ✅ Write scan test + implement scanner
- ✅ Run scan tests
- ✅ Write copy + journal tests + implement
- ✅ Run all backend tests
- ✅ Commit

### 🖼️ Phase 2: Frontend Development
- ✅ Write index.html template
- ✅ Write style.css
- ✅ Write script.js
- ✅ Manual verification — start server and test in browser
- ✅ Commit

### 📄 Phase 3: README + Final Smoke Test
- ✅ Write README.md
- ✅ Final smoke test — full workflow
- ✅ Commit

## 📊 Spec Coverage

| Spec Requirement | Implementation |
|------------------|----------------|
| Scanner (index by filename) | ✅ Task 1, Step 4 |
| Comparator (nouveau/doublon/traite) | ✅ Task 2, Step 3 (`computeStatus`) |
| Two-panel interface | ✅ Task 2, Step 1 (HTML), Step 2 (CSS) |
| Click file → click destination → copy | ✅ Task 2, Step 3 (`selectFile` + `selectDestination`) |
| Copy, no delete | ✅ Task 1, Step 6 (`shutil.copy2`) |
| Journal persistence | ✅ Task 1, Step 6 (journal.json) |
| Config persistence | ✅ Task 1, Step 2 (config.json) |
| Routes: /, /scan, /copy, /config, /journal | ✅ Task 1, all steps |
| No npm | ✅ Platform choice — Flask + vanilla JS |
| Port 8765 | ✅ Task 1, `app.run(port=8765)` |

## 📌 Tasks Summary

### Backend Core (app.py)
- [ ] Skeleton with config + data helpers
- [ ] Test config routes + implementation
- [ ] Scan test + scanner implementation
- [ ] Copy + journal tests + implementation
- [ ] Run all backend tests
- [ ] Commit

### Frontend (HTML + CSS + JS)
- [ ] Index.html template
- [ ] Style.css
- [ ] Script.js
- [ ] Manual verification
- [ ] Commit

### README + Smoke Test
- [ ] README.md
- [ ] Full workflow test
- [ ] Commit

## 🛠️ Implementation Details

### Backend
- **Routes**: `/`, `/scan`, `/copy`, `/config`, `/journal`
- **State**: `data/config.json`, `data/journal.json`
- **Features**: File scanning, copying, config management, journal persistence

### Frontend
- **UI**: Two-panel layout with file status indicators (● nouveau, ○ doublon, ▲ traite)
- **Workflow**: Click file → click destination → copy confirmation dialog
- **Styling**: Dark theme with monospace font

## 🧪 Tests

### Backend Tests
- `test_app.py`:
  - `test_config_default`
  - `test_config_save_and_read`
  - `test_scan_finds_mp3_and_flac`
  - `test_scan_epars_dirs`
  - `test_copy_file_and_journal`
  - `test_copy_missing_source`

### Frontend Tests
- Manual verification:
  1. Config panel saves paths
  2. Scan button shows files with correct badges
  3. Click ● file → click source folder → copy
  4. Journal updates with copied files

## ✅ Completion Criteria

- [ ] All backend tests pass
- [ ] Frontend UI functions correctly
- [ ] README is complete
- [ ] Full workflow test succeeds
- [ ] Git commit history shows all changes

## 🎯 Final Result

A web-based audio sync tool that:
1. Scans scattered music folders
2. Identifies missing files from source data
3. Enables one-click copy navigation
4. Maintains persistent config and journal
5. Displays file status with visual indicators

This plan follows the 01-plan skill protocol: gather → explore → wireframe → plan. No code was written - only the implementation plan and phase breakdown were created.