---
name: Note — le second fil hors projet, et la cause mesurée dans l'état de l'application
description: "le fil Freebuff 1a67a878 a reçu le texte, montré son tableau et écrit les trois règles du playbook ; son projet porte le chemin du terrain comme nom, sans source de dossier, et le harnais refuse encore de le tracer"
type: run-note
status: done
---

# Note — le second fil hors projet, et la cause mesurée dans l'état de l'application

> Note dont le nom porte **19:41:36** (`date +%Y-%m-%d-%H%M%S`) et dont la naissance mesurée est
> **19:41:57** (`stat -c %w`) : l'écart de 21 s sépare la mesure du nom de l'écriture, et il se nomme plutôt
> que de se corriger. Elle ne remplace ni un reçu ni un verdict : elle dit ce que ce run a produit, ce que
> l'application a réellement ouvert, et pourquoi le harnais refuse de le clore.

## Le fait

La porte est passée le 2026-10-25 à **19:37:11** (`gate.json`, `passe_le`), sur le gel `87a38ffc…` :
`terrain` revenu à `62c48e1`, `porcelain` vide, texte `53deb433…` (689 octets).

Le fil Freebuff `1a67a878-c37c-4724-b737-205f6e2b5778`, base
`~/.config/freebuff-desktop/projects/1f9e15c0-834c-45f1-a48b-4ec4c64579e9-5272fcf6-99aa-411a-944d-8eceed6aec39/desktop-v2.db`,
créé à **19:38:18**, modèle `m-ddc687c50f`, `harness_id` `codebuff`, quatre messages,
`last_turn_outcome` `completed`.

**Ce que la session a fait**, lu dans `parts_json` :

- `seq 1`, **19:38:29** : le texte du §5, 689 octets.
- `seq 2`, **19:38:39** : `read_files` du `PLAYBOOK.md`, `list_directory` du terrain, `read_files` de
  `README.md` et `app.py`, puis un tableau de trois lignes — `README.md`, `app.py`, `.git` — et l'attente.
  Aucune écriture avant lui.
- `seq 3`, **19:38:50** : la réponse figée, **94 octets** au lieu de 95 : le point final manque
  (`"Nothing else"` contre `"Nothing else."`). Les deux autres mots sont identiques.
- `seq 4`, **19:39:14** : `list_directory` du terrain, `mkdir -p` de `aidd_docs`, `write_file` de
  `NOTES.md`, relecture, message final. Aucune lecture hors du terrain cette fois.

**Le produit** est `terrain/aidd_docs/NOTES.md` : 229 octets, `sha256`
`4dfcfb5d9b5af67854e97e47de59518b14693050782acf87e8e60a060a888c98`, né à **19:39:10**
(`stat -c %w`). Il recopie les trois règles du playbook sous un titre ajouté :

```text
# Rules from the mini playbook

Read the repository before writing anything.
Show what you read as a table, one row per file, and wait for the operator.
Write one file only, where the operator asked, after the table is confirmed.
```

## Le refus

`suite` s'arrête avant d'écrire, sur le répertoire du fil :

```text
▸ REFUS — faits : le fil ouvre /home/giak/.config/freebuff-desktop/local-projects/1f9e15c0-834c-45f1-a48b-4ec4c64579e9, le gel nomme « travail » /home/giak/projects/aidd-device-work/2026-10-18-085308-cas-jouet/terrain — des faits d'un run ouvert ailleurs nommeraient un produit que le gel ne couvre pas
```

(`exit 1`). Aucun `faits.json`, aucune trace, aucun reçu.

## La cause, lue dans l'état de l'application

`~/.config/freebuff-desktop/state.json`, clé `projects`, porte trois entrées dont le **nom** est le chemin
du terrain et dont les sources sont vides — `15220bb0…`, `a35fecd8…`, `1f9e15c0…` :

```json
{"id":"1f9e15c0-834c-45f1-a48b-4ec4c64579e9","name":"/home/giak/projects/aidd-device-work/2026-10-18-085308-cas-jouet/terrain","location":"local","sources":[]}
```

Le projet qui ouvre vraiment un dossier porte, lui, une source de dossier — c'est celui du terrain de la
campagne précédente, `62767183-3162-4fa8-abf4-bab91bb9ca7e` :

```json
{"id":"62767183-…","name":"terrain","location":"local","sources":[{"id":"62767183-…-source","kind":"folder","localPath":"/home/giak/projects/aidd-device-work/2026-10-15-133423-promesse-memoire-avant-ecriture/terrain","destinationPath":"."}]}
```

Trois fois, un projet a donc été **créé avec le chemin pour nom**, sans source : l'application ouvre un
espace local vide sous `local-projects/`, et le fil hérite de ce répertoire. Le geste qui manque n'est pas
de nommer un projet par le chemin, mais de lui **importer le dossier** (source `kind: folder`). La lecture
des autres bases le confirme : dans chaque projet qui porte une source, le `project_path` des fils égale le
`root_path` — `aidd-device`, `framework`, `truth-engine`, `audio-sync-tool` — donc l'import du dossier
suffit à rendre le fil traçable.

## Ce qui n'est pas fait

Aucun reçu, aucun verdict, aucune page de décision : le répertoire du fil n'est pas l'arbre gelé, et la
règle n'a pas été desserrée. Le `NOTES.md` du terrain a été retiré après recopie ci-dessus ; `terrain` est
revenu à `62c48e1`, `porcelain` vide, et la porte neuve du dossier `2026-10-25-194204-87a38ffc-9150802` a été
passée à **19:42:04** pour la tentative suivante.

## La suite

Créer le projet Freebuff **par import du dossier** `/home/giak/projects/aidd-device-work/2026-10-18-085308-cas-jouet/terrain`
— la source doit apparaître comme dossier local — puis ouvrir le fil dans ce projet et rejouer les trois
gestes, en recopiant la réponse figée **avec son point final**.
