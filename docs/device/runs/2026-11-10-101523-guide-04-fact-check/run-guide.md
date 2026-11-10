---
name: Run guidé : 04-fact-check, second passage sur une révision modifiée
description: "Le même paragraphe « Stack », le même terrain, la même intention, sur la révision feadf291 qui nomme le déclencheur du cache et compte une entrée par emplacement cité ; le produit tient les six clauses, la comparaison ne prouve pas le skill"
type: run-guide
status: done
---

# Run guidé : `04-fact-check`, passage 2 sur `audio-sync-tool`

> 2026-11-10. Mode `guide` : la personne et l'agent sont dans la même conversation
> ([ADR-074](../../../DECISIONS.md)). Skill `plugins/aidd-refine/skills/04-fact-check`, révision
> `feadf291`, commit `fix(aidd-refine): make 04-fact-check citations and cache proposal testable` d'un clone
> de travail de `fe48de12`, porcelain vide. Terrain
> `/home/giak/projects/aidd-device-work/2026-10-21-173843-plan-simple/2026-11-10-100124-fact-check-passage-2/terrain`,
> clone neuf de `audio-sync-tool`, tête `416ec1f`, porcelain vide au départ, le même que le passage 1. Ce run
> suit le [gabarit du run guidé](../../../tasks/2026_10/2026-10-22-221207-traces-et-run-guide/2026-10-22-221207-spec-run-guide.md).

## 0. Déroulé et validations

| # | Étape | Ce qui est fait | Preuve | État |
| --- | --- | --- | --- | --- |
| 1 | Choisir le skill | `04-fact-check`, trois actions, quatre références, relues sous `feadf291` | `git ls-tree -r fe48de12` : 8 fichiers ; le commit ne change que 2 fichiers, 4 lignes | fait |
| 2 | Présenter l'épreuve | les six champs, présentés après la préparation de la révision modifiée | tour `user` qui suit la présentation : « il faut faire un RUN complet sur un skill », il ordonne le run et vaut validation de l'épreuve | validé |
| 3 | Écrire le produit attendu | le §3 | aucun tour `user` ne suit le §3, qui n'existait pas encore quand la personne a écrit | non observé |
| 4 | Jouer le skill sur le terrain | les trois actions, sans écrire de fichier | le §4, et le porcelain du terrain à 0 ligne | fait |
| 5 | Vérifier et consigner | les §4 à §8 | `runs.mjs --verifier` → 0, `liens.mjs` → 0 | fait |

## 1. Ce qui est testé

- skill : `plugins/aidd-refine/skills/04-fact-check`, actions `01-identify-claims`, `02-verify`,
  `03-report`, et les références `claim-categories`, `verification-cascade`, `report-output-discipline`,
  `report-template` ;
- révision : `feadf291`, qui remplace « one numbered entry per source » par « one cited location » et
  « stable » par un déclencheur nommé ([geste du passage 1](#7-limites-et-statut)) ;
- terrain : le même clone neuf de `audio-sync-tool`, tête `416ec1f` ;
- texte cible : `README.md`, lignes 10 à 12.

## 2. La demande, verbatim

La demande du passage 1, reprise telle quelle, pour que les deux passages comparent le même travail :

> Vérifie les faits du paragraphe « Stack » de `README.md`, lignes 10 à 12. Chaque affirmation vérifiée
> doit porter une source du dépôt, aucune affirmation ne doit être supprimée, et ce que le dépôt ne tranche
> pas doit rester marqué. Ne modifie aucun fichier.

## 3. Le produit attendu

Huit affirmations, treize emplacements : `ci.yml:29` pour Python 3.12 ; `requirements.txt:1` pour Flask 3.1 ;
`package.json:30`, `package.json:27` et `build.js:12` pour TypeScript bundlé par esbuild ; `package.json:34`
pour l'absence de framework ; `package.json:31` et `package.json:6` pour Vitest ; `requirements.txt:3` pour
pytest ; `app.py:18` pour mutagen ; `.gitignore:3`, `app.py:34` et `app.py:2283` pour `data/`.

Sous la règle corrigée, la forme attendue change sur deux points : treize entrées `## Sources`, une par
emplacement cité, et une ligne de cache, puisque trois versions épinglées sont vérifiées.

## 4. Le produit

> Stack : **Python 3.12 [1] + Flask 3.1 [2]**, **TypeScript vanilla [3]** bundlé par esbuild [4][5]
> (aucun framework [6]), **Vitest [7][8]** (frontend) + **pytest [9]** (backend), **mutagen** [10] (tags),
> `data/` [11][12][13] en JSON (git-ignoré).
>
> ## Sources
>
> [1] `.github/workflows/ci.yml` - `.github/workflows/ci.yml:29` - verifies: "Python 3.12"
> [2] `requirements.txt` - `requirements.txt:1` - verifies: "Flask 3.1"
> [3] `package.json` - `package.json:30` - verifies: "TypeScript vanilla"
> [4] `package.json` - `package.json:27` - verifies: "bundlé par esbuild"
> [5] `build.js` - `build.js:12` - verifies: "bundlé par esbuild"
> [6] `package.json` - `package.json:34` - verifies: "aucun framework"
> [7] `package.json` - `package.json:31` - verifies: "Vitest (frontend)"
> [8] `package.json` - `package.json:6` - verifies: "Vitest (frontend)"
> [9] `requirements.txt` - `requirements.txt:3` - verifies: "pytest (backend)"
> [10] `app.py` - `app.py:18` - verifies: "mutagen (tags)"
> [11] `.gitignore` - `.gitignore:3` - verifies: "`data/` git-ignoré"
> [12] `app.py` - `app.py:34` - verifies: "`data/` en JSON"
> [13] `app.py` - `app.py:2283` - verifies: "`data/` en JSON"
>
> > Cache suggestion: "Flask==3.1.3, pytest==9.1.1 et python-version: '3.12'" looks stable - cache it for
> > reuse? (recommended: yes, trois versions épinglées)

Aucun bloc `## Unverified claims` : les huit affirmations se résolvent dans le dépôt. Aucun fichier écrit.

## 5. Vérifications

**Les treize emplacements cités existent et portent ce que le renvoi prétend** (relevés sur le terrain du
run) : `.github/workflows/ci.yml:29` → `python-version: '3.12'` ; `requirements.txt:1` → `Flask==3.1.3` ;
`package.json:30` → `"typescript": "^6.0.3"` ; `package.json:27` → `"esbuild": "^0.28.1"` ;
`build.js:12` → `import * as esbuild from 'esbuild';` ; `package.json:34` → `"wavesurfer.js": "7.12.11"`,
seule dépendance d'exécution ; `package.json:31` → `"vitest": "^1.6.0"` ; `package.json:6` →
`"test": "vitest run"` ; `requirements.txt:3` → `pytest==9.1.1` ; `app.py:18` →
`from mutagen import File as MutagenFile` ; `.gitignore:3` → `data/` ; `app.py:34` →
`BEATGRID_PATH = os.path.join(DATA_DIR, 'beatgrids.json')` ; `app.py:2283` → `save_json(BEATGRID_PATH, cache)`.

**Les huit affirmations sont conservées.** Le paragraphe, renvois retirés, est identique au texte d'origine
mot pour mot (`sans renvois = original : true`), treize renvois distincts.

**Une entrée par emplacement cité** : treize lignes `[n]`, une par emplacement, aucune n'en porte deux.

**La ligne de cache est là** : une ligne, un seul fait nommé, une recommandation. Les trois versions sont
épinglées (`==`, `==`, `python-version`), donc le déclencheur de `03-report.md:22` s'applique.

**Aucun mot interdit** dans le bloc produit : `Cascade`, `tier`, `verified`, `refuted`, `conflict`, les
catégories, `by inspection`, `verdict` : 0 occurrence.

**Le terrain n'a pas bougé** : `git status --porcelain` → 0 ligne, tête `416ec1f`.

## 6. La grille, dérivée du skill et des quatre familles

| Geste | Preuve attendue | État | Preuve |
| --- | --- | --- | --- |
| `01 identify-claims` : extraire, écarter l'opinion, une catégorie par affirmation | la liste des affirmations retenues | non observé | la liste n'existe que dans ce journal, écrite par le joueur |
| `02 verify` : cascade du moins cher au plus cher, court-circuit | un verdict et une source par affirmation | non observé | les treize emplacements sont réels, mais rien ne montre le parcours |
| `03 report` : réécriture avec renvois, `## Sources`, marqueur, discipline | le produit du §4 | tenu | les six clauses tiennent, dont les deux qui avaient mordu |
| Question posée et tour suivant | deux tours `user` | non observé | un tour après la présentation, aucun après le §3 |
| Décision énoncée avec son motif | le choix du skill et l'écartement des autres | tenu | §1 |
| Accès à une source ou à une commande | lecture des 8 fichiers et des 13 emplacements | tenu | §1 et §5 |
| Production écrite avec son chemin | aucun fichier écrit | tenu | §4, porcelain à 0 |
| Borne du terrain | clone neuf, tête `416ec1f`, porcelain vide | tenu | §0 et §5 |

## 7. Limites et statut

- `session_non_independante` : l'agent a lu le produit attendu du passage 1, qui nomme les huit affirmations
  et les treize emplacements, avant d'écrire celui-ci ([ADR-074](../../../DECISIONS.md)). Le produit est donc
  confondu : sa forme tenue ne prouve pas que le skill la produise seul, et elle ne prouve pas que la
  correction en soit la cause. C'est la limite matérielle de ce passage.
- `attendu_non_gele` : le §3 est écrit après le tour qui valide l'épreuve, sans gel.
- `trace_absente` : aucune trace machine n'a été exportée pour ce fil ; la grille du §6 est remplie à la main,
  et les deux premières actions y restent `non observé`.

**Le geste, déclaré.** Après le passage 1, décision `corriger`, preuve : `03-report.md:20` comptait une entrée
par « source », ce qui a laissé `[3]` et `[8]` du passage 1 porter cinq emplacements, et `:22` déclenchait la
ligne de cache sur un fait « stable » sans dire ce qui qualifie. La révision `feadf291` nomme les deux.

Statut de forme : **forme tenue** (six clauses tenues, aucune violée). Verdict : `null`, un guidé n'atteste
pas la valeur du skill.

## 8. Ce que ce run ne prouve pas

Que le skill produirait ce rapport sans l'attendu du passage 1 sous les yeux ; que la correction soit la cause
du changement observé, un seul passage n'établissant aucune causalité ; que la branche « corriger une
affirmation fausse » fonctionne, aucune des huit affirmations n'étant démentie par le dépôt ; que la
réécriture est meilleure en prose que l'originale.
