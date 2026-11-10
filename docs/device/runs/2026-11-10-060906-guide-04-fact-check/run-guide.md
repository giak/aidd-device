---
name: Run guidé : 04-fact-check sur audio-sync-tool
description: "Le paragraphe « Stack » du README transformé en affirmations sourcées : cascade bornée au dépôt, un renvoi par affirmation, aucune suppression, mécanique interne absente ; indépendance non observée"
type: run-guide
status: in-progress
---

# Run guidé : `04-fact-check` sur `audio-sync-tool`

> 2026-11-10, 06:09. Mode `guide` : la personne et l'agent sont dans la même conversation
> ([ADR-074](../../../DECISIONS.md)). Skill `plugins/aidd-refine/skills/04-fact-check`, révision
> `fe48de12` du dépôt `framework` (porcelain du dossier vide, 8 fichiers dans l'arbre de cette révision ;
> le porcelain du dépôt porte une modification sous `plugins/aidd-refine/skills/03-shadow-areas`, hors du
> skill demandé). Terrain `/home/giak/projects/aidd-device-work/2026-11-10-060906-fact-check-terrain/terrain`,
> clone neuf de `audio-sync-tool`, tête `416ec1f`, porcelain vide au départ. Le run suit le
> [gabarit du run guidé](../../../tasks/2026_10/2026-10-22-221207-traces-et-run-guide/2026-10-22-221207-spec-run-guide.md)
> et la [présentation de l'épreuve](../../../tasks/2026_10/2026-10-23-034641-presentation-de-l-epreuve/2026-10-23-034641-spec.md).

## 0. Déroulé et validations

| # | Étape | Ce qui est fait | Preuve | État |
| --- | --- | --- | --- | --- |
| 1 | Choisir le skill | `04-fact-check` d'`aidd-refine` : trois actions, `identify-claims → verify → report`, quatre références | `SKILL.md`, les trois actions, `claim-categories.md`, `verification-cascade.md`, `report-output-discipline.md`, `report-template.md` lus sous `fe48de12` ; `git ls-tree -r --name-only fe48de12 plugins/aidd-refine/skills/04-fact-check` → 8 fichiers ; aucun run ne l'exerce (`ls docs/device/runs \| grep -c fact-check` → 0) | fait |
| 2 | Présenter l'épreuve | les six champs, ci-dessous au §1 | réponse rendue par un outil de question, que l'[ADR-082](../../../DECISIONS.md) ne compte pas comme un tour | non observé |
| 3 | Écrire la demande et le produit attendu | le §2 et le §3 | réponse rendue par un outil de question, que l'[ADR-082](../../../DECISIONS.md) ne compte pas comme un tour | non observé |
| 4 | Jouer le skill sur le terrain | les trois actions, sans écrire de fichier | le §4, et `git status --porcelain` dans le terrain → 0 ligne | fait |
| 5 | Vérifier et consigner | les §4 à §8 | `runs.mjs --index` puis `--verifier` → 0 ; `liens.mjs` → 0 mort ; rectification du §7 | fait |

### Étape 2, les six champs

**Ce qui est testé.** Le skill `04-fact-check` et ses trois actions, avec ses quatre références. Ne sont pas
testés : le tier web de la cascade, hors périmètre par construction ; le cache proposé en fin de rapport ;
le comportement du skill sur du code.

**Pourquoi.** Aucun run, aucun cas ne l'a jamais exercé, et c'est le skill qui porte la règle
`EVIDENCE>=CLAIM` du framework : sa faute typique est d'affirmer sans source, de recopier une affirmation
fausse au lieu de la corriger, ou de laisser filtrer sa mécanique interne. La décision éclairée : sur un
dépôt réel, le skill cite-t-il une source pour chaque affirmation vérifiée, corrige-t-il la fausse, et
borne-t-il l'indécidable au lieu de l'affirmer ?

**Comment.** Terrain : un clone neuf et propre de `audio-sync-tool`, tête `416ec1f`, sous
`/home/giak/projects/aidd-device-work/2026-11-10-060906-fact-check-terrain/terrain` ; le vrai dépôt n'est
pas touché. Source : le paragraphe « Stack » du `README.md` du terrain, lignes 10 à 12 sur 725. Mode guidé
dans cette conversation : pas d'`ouvrir`, pas de headless, pas de gel. Le skill ne persiste rien : produit
en prose, plus la trace.

**Le but.** Établir que le produit tient la forme du skill : chaque affirmation vérifiée porte un `[n]`,
`## Sources` numéroté avec un chemin repo-relatif existant, aucune affirmation supprimée, une affirmation
que le dépôt ne tranche pas garde à la lettre `(unverified - no source found)` et figure sous
`## Unverified claims`, et aucun mot interdit n'apparaît (`Cascade`, `tier`, `verified`, `refuted`,
catégories, « by inspection », commandes).

**Ce qui sera observé.** La lecture des 8 fichiers sous `fe48de12` ; les deux validations ; la demande
verbatim ; les chemins cités confrontés au terrain (`test -f`, `wc -l`, `grep`) ; le compte d'affirmations
avant et après ; l'absence des mots interdits (`grep -F`) ; le marqueur exact ; le porcelain du terrain,
attendu vide ; la trace machine par `tracer`.

**Ce que le test ne prouvera pas.** L'indépendance (`session_non_independante`, déclarée) ; l'antériorité de
l'attendu (non gelé) ; le tier web et la justesse d'une vérification hors dépôt ; la qualité de la
réécriture en prose ; qu'un autre agent produirait la même chose.

## 1. Ce qui est testé

- skill : `plugins/aidd-refine/skills/04-fact-check`, actions `01-identify-claims.md`,
  `02-verify.md`, `03-report.md` ;
- révision : `fe48de12` du dépôt `framework` ;
- références lues : `references/claim-categories.md`, `references/verification-cascade.md`,
  `references/report-output-discipline.md`, `assets/report-template.md` ;
- terrain : `/home/giak/projects/aidd-device-work/2026-11-10-060906-fact-check-terrain/terrain` ;
- texte cible : `README.md` du terrain, lignes 10 à 12.

## 2. La demande, verbatim

> Vérifie les faits du paragraphe « Stack » de `README.md`, lignes 10 à 12. Chaque affirmation vérifiée
> doit porter une source du dépôt, aucune affirmation ne doit être supprimée, et ce que le dépôt ne tranche
> pas doit rester marqué. Ne modifie aucun fichier.

## 3. Le produit attendu

Le texte cible porte huit affirmations vérifiables, toutes des `project-fact` ou des `version` résolubles
par le terrain seul :

| # | Affirmation | Source que le dépôt porte | Où |
| --- | --- | --- | --- |
| 1 | Python 3.12 | `python-version: '3.12'` | `.github/workflows/ci.yml:29` |
| 2 | Flask 3.1 | `Flask==3.1.3` | `requirements.txt:1` |
| 3 | TypeScript, bundlé par esbuild | `typescript ^6.0.3`, `esbuild ^0.28.1`, `import * as esbuild` | `package.json:30`, `package.json:27`, `build.js:12` |
| 4 | Aucun framework | une seule dépendance d'exécution, `wavesurfer.js`, bibliothèque et non framework | `package.json:34` |
| 5 | Vitest côté frontend | `vitest ^1.6.0`, script `test: vitest run` | `package.json:31`, `package.json:6` |
| 6 | pytest côté backend | `pytest==9.1.1` | `requirements.txt:3` |
| 7 | mutagen pour les tags | `from mutagen import File as MutagenFile` | `app.py:18` |
| 8 | `data/` en JSON, ignoré par git | `data/` sous `.gitignore` ; `data/beatgrids.json` écrit par le serveur | `.gitignore:3`, `app.py:34`, `app.py:2283` |

**Ce que le produit doit être.** Les huit affirmations conservées, dans l'ordre de lecture, chacune suivie
d'un renvoi `[1]` à `[8]` ; un bloc `## Sources` numéroté, une entrée par renvoi, portant le chemin
repo-relatif et l'affirmation qu'il adosse ; aucun bloc `## Unverified claims` si les huit se résolvent ;
aucun mot interdit de `report-output-discipline.md` ; aucune commande, aucun chemin de méthode ; le texte
d'origine est réécrit, pas commenté.

**Ce que le produit ne doit pas être.** Une paraphrase qui retire une affirmation ; un renvoi sans source
réelle, ou vers un chemin absent du terrain ; une section de mécanique (`Cascade`, `tier 1`, `verified`) ;
une affirmation nouvelle que le paragraphe ne portait pas ; un fichier écrit, ou le terrain modifié.

**Limite de ce texte cible, nommée d'avance.** Aucune des huit affirmations n'est démentie par le dépôt :
la clause du §1 sur la correction d'une affirmation contradictoire n'est donc pas exerçable ici, et le
verdict ne la jugera pas. Le marqueur d'indécidable n'est pas exerçable non plus si les huit se résolvent ;
la conformité se jugera alors sur l'omission correcte de `## Unverified claims`, et non sur sa présence.

## 4. Le produit

Les trois actions ont été suivies dans l'ordre : `identify-claims` a retenu huit affirmations et écarté le
reste du paragraphe (aucune opinion, aucun jugement), `verify` a résolu chacune aux tiers 1 et 2 du
dépôt sans atteindre le tier web, `report` a réécrit le paragraphe en n'ajoutant que les renvois. Rapport
tel que rendu :

> Stack : Python 3.12 [1] + Flask 3.1 [2], TypeScript vanilla [3] bundlé par esbuild [3] (aucun
> framework [4]), Vitest [5] (frontend) + pytest [6] (backend), mutagen [7] (tags), `data/` en JSON
> (git-ignoré) [8].
>
> ## Sources
>
> [1] `ci.yml` - `.github/workflows/ci.yml:29` - verifies: "Python 3.12"
> [2] `requirements.txt` - `requirements.txt:1` - verifies: "Flask 3.1"
> [3] `package.json`, `build.js` - `package.json:27`, `package.json:30`, `build.js:12` - verifies:
> "TypeScript vanilla bundlé par esbuild"
> [4] `package.json` - `package.json:34` - verifies: "aucun framework"
> [5] `package.json` - `package.json:6`, `package.json:31` - verifies: "Vitest (frontend)"
> [6] `requirements.txt` - `requirements.txt:3` - verifies: "pytest (backend)"
> [7] `app.py` - `app.py:18` - verifies: "mutagen (tags)"
> [8] `.gitignore`, `app.py` - `.gitignore:3`, `app.py:34`, `app.py:2283` - verifies: "`data/` en JSON
> (git-ignoré)"

Aucun bloc `## Unverified claims` : les huit affirmations se résolvent dans le dépôt. Aucun fichier écrit,
le terrain n'a pas bougé.

## 5. Vérifications

**Les treize lignes citées existent et portent ce que le renvoi prétend.** Une par une, sur le terrain :
`.github/workflows/ci.yml:29` → `python-version: '3.12'` ; `requirements.txt:1` → `Flask==3.1.3` ;
`package.json:27` → `"esbuild": "^0.28.1"` ; `package.json:30` → `"typescript": "^6.0.3"` ;
`build.js:12` → `import * as esbuild from 'esbuild';` ; `package.json:34` → `"wavesurfer.js": "7.12.11"` ;
`package.json:6` → `"test": "vitest run"` ; `package.json:31` → `"vitest": "^1.6.0"` ;
`requirements.txt:3` → `pytest==9.1.1` ; `app.py:18` → `from mutagen import File as MutagenFile` ;
`.gitignore:3` → `data/` ; `app.py:34` → `BEATGRID_PATH = os.path.join(DATA_DIR, 'beatgrids.json')` ;
`app.py:2283` → `save_json(BEATGRID_PATH, cache)`.

**Les huit affirmations sont conservées.** Le paragraphe d'origine et le produit portent le même texte
mot pour mot ; les seuls ajouts sont les huit renvois `[1]` à `[8]`, tous présents (relevé par `grep -o`,
huit numéros distincts). Aucune affirmation retirée, aucune ajoutée.

**Aucun mot interdit dans le produit.** `sed` borné au bloc du §4, puis `grep -E` sur `Cascade`, `tier [123]`,
`verified`, `refuted`, `conflict`, les catégories, `by inspection`, `codebase inspection` : **0** ligne. Les
mêmes mots apparaissent ailleurs dans ce journal, aux §1 et §3, où ils nomment l'interdit ; ils ne sont pas
dans le produit.

**Aucun bloc `## Unverified claims`**, et c'est conforme : les huit se résolvent dans le dépôt, le skill
l'omet au lieu de le remplir.

**Le terrain n'a pas bougé.** `git status --porcelain` dans le terrain : **0** ligne.

## 6. La grille, dérivée du skill et des quatre familles

[ADR-082](../../../DECISIONS.md) exige une ligne par action déclarée par le `SKILL.md` lu sous la révision
sous test, puis les quatre familles de l'[ADR-073](../../../DECISIONS.md), puis la borne du terrain. Sans
trace machine, cette grille est la seule lecture du geste, et une case vide la rendrait muette.

| Geste | Preuve attendue | État | Preuve |
| --- | --- | --- | --- |
| `01 identify-claims` : extraire les affirmations vérifiables, écarter l'opinion, une catégorie par affirmation | la liste des affirmations retenues | non observé | la liste n'existe que dans le §4, écrite par le joueur ; rien ne montre la sélection |
| `02 verify` : cascade du moins cher au plus cher, court-circuit, web en dernier | un verdict et une source par affirmation, sans tier web | non observé | les sources du §3 et du §5 sont réelles, mais rien ne montre le parcours de la cascade |
| `03 report` : réécriture avec renvois, `## Sources`, marqueur exact, discipline de sortie | le produit du §4 | violé | deux règles manquées, la ligne de cache et les entrées par source (§7) |
| Question posée et tour suivant | deux tours `user` après les deux présentations | non observé | les deux réponses viennent d'un outil de question : pas un tour ([ADR-082](../../../DECISIONS.md)) |
| Décision énoncée avec son motif | le choix du skill et l'écartement de `02-implement`, avec leur raison | tenu | §0 étape 1 et §1 |
| Accès à une source ou à une commande | lecture des 8 fichiers du skill sous `fe48de12` et des 13 lignes citées | tenu | §1 et §5, sorties de commandes |
| Production écrite avec son chemin | aucun fichier écrit, le produit est un texte | tenu | §4, et `git status --porcelain` dans le terrain à 0 ligne |
| Borne du terrain | clone neuf de `audio-sync-tool`, tête `416ec1f`, porcelain vide au départ et à l'arrivée | tenu | §0 et §5 |

## 7. Limites et statut

- `session_non_independante` : l'agent a lu l'attendu avant de produire ([ADR-074](../../../DECISIONS.md)).
- `attendu_non_gele` : le §3 est écrit après la validation de l'épreuve, sans gel.
- `trace_absente` : `tracer` a refusé deux fils, `6972de9d…` et `3e6da3fa…`, avec le même motif, « ne porte
  aucun message utilisateur » ; la trace machine du run n'existe donc pas, et la grille du §6 est manuelle.

Statut de forme : **forme non tenue** (rectifié le 2026-11-10, à la question « le skill a-t-il produit ce qu'il est censé faire ? »). Verdict : `null`, un guidé n'atteste pas la valeur du skill.

**Les deux écarts, constatés après le premier jugement.** Le produit tient les huit affirmations, les sources réelles et la discipline de sortie, mais il manque deux règles que le skill s'impose à lui-même :

1. `actions/03-report.md:22` demande, dès qu'un fait vérifié est stable, « one cache-suggestion line with a yes/no recommendation ». Le paragraphe porte des faits épinglés (`Flask==3.1.3`, `pytest==9.1.1`, `python-version: '3.12'`) : la ligne était due, et elle est absente (`grep -c "Cache suggestion"` sur ce journal → `0`).
2. `actions/03-report.md:20` demande « one numbered entry per source ». Deux renvois compressent plusieurs sources : `[3]` couvre `package.json:27`, `package.json:30` et `build.js:12` ; `[8]` couvre `.gitignore:3`, `app.py:34` et `app.py:2283`. Cinq sources n'ont donc pas leur entrée numérotée propre.

Le produit n'est pas réécrit : il reste la pièce du run, et c'est le jugement qui change.

**Deuxième rectification, même jour : les validations ne sont pas des tours.** L'[ADR-082](../../../DECISIONS.md)
ne compte une validation que si un message `user` la suit, et une réponse rendue par un outil de question n'est
pas un tour. Les deux validations de ce run sont passées par un outil : elles s'écrivent `non observé` avec
leur raison, jamais `validée`, et le §0 comme le §6 ont été corrigés en conséquence. La grille du §6 porte
désormais une ligne par action déclarée par le `SKILL.md`, puis les quatre familles, puis la borne du terrain.

**Ce que ce run n'a pas exercé, dit d'avance au §3 et constaté ici.** Aucune des huit affirmations n'était
démentie par le dépôt : la branche « corriger une affirmation fausse » du skill, et le marqueur exact
`(unverified - no source found)`, restent non exercés. Le run ne dit rien de ces deux comportements.

## 8. Ce que ce run ne prouve pas

Que `04-fact-check` produirait ce rapport sans l'attendu sous les yeux ; que sa cascade atteindrait le bon
tier sur un texte mêlant faits externes et faits du dépôt ; qu'il reconnaîtrait une affirmation fausse (la
branche n'a pas été exercée) ; ni que la réécriture est meilleure que l'originale en prose.
