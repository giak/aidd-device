# Testing

How the project is tested: the layers, the tools, and the conventions. Where tests live and how to run them.

## Strategy

- Two suites, one per side. The backend is covered by pytest at the repo root, the frontend by vitest in jsdom, co-located with the module it tests.
- The frontend suite is characterisation, not aspiration: `commands/keyboardMatrix.test.ts` holds a matrix of every key against every context and fails the build on a dead or shadowed binding.
- A third layer measures the real browser. The headless harnesses in `scripts/` drive Chrome over the DevTools Protocol and settle UI questions (legend layout, focus contrast, filter chip, style palette) by measuring, not by looking. They read the tags back from disk to prove a write.

## Tools

- vitest + jsdom for the frontend. The only module ever mocked is `api.ts`; everything else runs with its production code.
- pytest for the backend; `websocket-client` and the CDP harnesses drive Chrome headless.
- Coverage with `@vitest/coverage-v8`, via `npm run coverage`.

## Conventions

- The backend tests live at the repo root (`test_app.py`, `test_nml.py`, `test_apply_*.py`, `test_collect_*.py`, …); the frontend tests sit next to their module as `*.test.ts`. No `.js` test file exists — do not create one.
- The DOM is built before the imports with `vi.hoisted()`, so the modules load their real elements and nothing but `api.ts` is mocked.
- `docs/TESTING-GUIDE.md` is the house method and is mandatory before writing a test: the Product Manager / Implementer / Reviewer roles, and an SDD block written as a comment above the `it(...)`.
- Assertions are on what the user sees — the DOM, a class, the shared state — never on an implementation detail.
- A behaviour change is written test-first: the test has to fail before the code exists.
- The suite must survive a random order (`npm run test:shuffle`, then the three fixed seeds). Two files were flaky because `state.filters` was not reset between tests.

## Run

- Frontend: `npm test` (watch: `npm run test:watch`), `npm run test:shuffle`, `npm run test:shuffle:gate`.
- Backend: `./venv/bin/python -m pytest -q`.
- The frontend needs `npm install`; the backend needs `./venv/bin/pip install -r requirements.txt`.

## Browser QA

- Entry: `npm start`, then `http://localhost:8765`.
- Auth: none — the app is local and has no account.
- State: the harnesses are isolated. `scripts/capture_ui.py` builds a synthetic `data/` and a synthetic corpus in a temporary folder, on an ephemeral port, and never touches the real `data/`. `npm run build` is mandatory first, and a change to `templates/index.html` needs an app restart.
