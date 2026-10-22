# Project Brief

What this project is, the problem it solves, and its domain language. The non-derivable "why", not the "how".

## What it is

- A local web tool that maps a scattered music collection onto a hand-sorted library: it finds what is missing, copies it in one keystroke, fills the missing years, files by style, and edits cues and loops on a waveform over a Traktor collection.
- One person, one collection, one machine. Flask serves it on port 8765, the frontend is vanilla TypeScript bundled by esbuild, there is no account and nothing leaves the machine.

## Why it exists

- The collection lives in dozens of folders (the *éparpillé*) next to a library organised by hand (the *Source Data*). Closing that gap was a manual loop: find, copy, tag, file, and never risk a wrong year.
- The tool writes the metadata into the files themselves (ID3, FLAC), with a journal as the only way back.
- Nothing is ever deleted. A file that leaves the library is moved to `<source>/_trash/<date>/`, never to the bin.

## Domain language

The terms a contributor must know to read the code.

| Term | Meaning |
| ---- | ------- |
| Source Data | The organised library the collection converges on. One folder per style. |
| Éparpillé | A file outside Source Data, waiting to be filed. The left column. |
| Tranche | The 5-year band of a style folder: `techno_acid_1990`. `trancheOf(y) = y - y%5`. |
| Style | The genre a folder declares, parsed from its name (`^([a-z]+(?:_[a-z]+)*?)(?:_(\d{4}))?$`). Derived from the disk, never a maintained list. |
| Jumeau (twin) | The copy of a file that is already filed in Source Data. |
| Doublon / homonyme probable | The same name exactly / the same length ±2 s with a fuzzy name. The LEDs tell them apart. |
| Pastille « déjà rangé » | The badge on an épars whose twin already exists under the active source filter. |
| Beatgrid / grille | BPM, phase and downbeats, detected or entered, written into the NML as `TEMPO` + `CUE_V2 TYPE=4`. |
| Cue / loop | A marker or a loop on the waveform, slots A to H, stored in the NML. |
| NML / collection.nml | Traktor's collection file. The app indexes it, adds tracks to it, writes cues and grids into it. |
| Journal | `data/journal.json`, append-only, one line per operation. Not the write journal. |
| Journal d'écriture | `data/year_apply_journal.jsonl` and `data/style_apply_journal.jsonl`: the only undo path for tag writes, shared by the scripts and the palette. |
| Certain / à revue / introuvable | The three verdicts of the year consolidation. Only `certain` may be written to a file. |
| EPIC | The unit of evolution: one file in `docs/superpowers/epics/` plus a line in its index. |

## Key features

- Sync: scan the scattered folders, spot the missing and the duplicated files, copy into the right sub-folder with `F5`.
- Doubles: groups of versions of one track, arbitration by quality, the losers filed into `_trash/`.
- Years: a review page over the doubtful years, corroborated across providers, and an export of the human's choices.
- Styles: a keyboard palette picks the style and computes the destination folder, then writes the tag right away.
- Playlists: create, rate, export by hard links, with a Traktor import badge.
- Cue editor: waveform, cues A to H, loops, zoom, beatgrid, and the grid written back into the NML.
