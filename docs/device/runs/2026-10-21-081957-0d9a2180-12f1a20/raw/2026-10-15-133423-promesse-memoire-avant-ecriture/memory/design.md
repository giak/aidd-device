# Design

The visual language: the design system, tokens, and UI conventions. What it looks like, not how it is coded.

## System

- No component library and no CSS framework. The design system is a set of CSS layers plus a small vocabulary of shared components.
- `static/styles/`: `tokens.css` (the variables), `base.css` (reset, focus, scrollbar), `components.css` (the families that cross pages: modal, dialog, toast, filter chip, empty panel), and `pages/<page>.css` for what belongs to one page. `pages/index.css` aggregates them, and **the order of the `@import`s is the cascade** — do not reorder it.
- `script.ts` imports `index.css`; esbuild emits `static/dist/script.css` next to the JS.

## Tokens

- Every colour, spacing and typography value is a CSS variable declared in `static/styles/tokens.css`, and only there. A token declared twice is a bug.
- `npm run audit:css` reports the CSS that matches nothing any more. It is a report, not a fix: each dead rule has to be checked by hand.

## Components

- The shared components are the modal, the dialog, the toast, the filter chip, the empty panel, the file row, the source tree node and the style palette. `static/src/render/` holds one factory per page and per shared component.
- One focus grammar everywhere: a 2 px accent box, a 4 px bar and a tinted background. It was measured, not chosen by eye — the panel contrast went from 3.38:1 to 11.45:1.
- The feedback channels do not cross: the status bar guides, the toast confirms an action, the dialog asks for a decision.
- The legend (`?`) is generated from the labelled bindings, and a test proves the bijection. It cannot describe a shortcut that does not exist.
- A scroll container keeps `padding-top: 0`: the space of a sticky header lives inside the painted background of the sticky element itself, or the rows paint over it.

## Accessibility

- The bar is measured. Focus visibility, contrast and the legend layout are verified by the headless harnesses (`scripts/measure_focus_visibility.py`, `scripts/measure_legend.py`), which compute what the browser actually renders.
- The palette scales with the screen — `clamp(560px, 44vw, 1180px)`, `auto-fill` columns — and no keycap is drawn inside a clickable button.
- No web font: the app falls back to a local font, so it works offline.
