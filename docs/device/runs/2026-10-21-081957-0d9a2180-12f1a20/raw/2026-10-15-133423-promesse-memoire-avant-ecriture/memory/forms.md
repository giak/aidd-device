# Forms

How forms are built and validated across the UI.

## Approach

- No form library and no validation library. The inputs are raw DOM elements, and the validation lives in the command handlers and in the backend routes.
- The native `prompt()` and `confirm()` are gone, replaced by custom dialogs (`confirmDialog`, `promptDialog`), so the flow keeps the app's look and its focus trap.
- The keyboard-first flows are not forms at all: the style palette and the copy dialog are driven by the key registry and open a DOM layer with its own `keydown` handler.

## Conventions

- A rating is edited inline in the row (`N`, or a click on the cell): `Enter` saves, `Escape` cancels back to the previous value, an empty field clears it, and a blur saves. It is editable on the Playlist page only — on Sync, `N` does nothing and the click only highlights the row.
- The backend is the validator for anything that touches the disk: a path is confined to the configured roots, a rating is clamped to 0-100, and the answer says what was written.
- A destructive action is always confirmed: the copy and the moves to `_trash/` go through the dialog. And a removal is a move, never a deletion.
