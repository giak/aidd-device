---
name: Run guidé : 04-audit, premier passage sur un skill jamais exercé
description: "Les sept piliers de 04-audit joués sur audio-sync-tool : huit fichiers écrits, dix trouvailles, une critique, aucune ligne de code modifiée ; la forme tient, le skill n'est pas prouvé"
type: run-guide
status: done
---

# Run guidé : `04-audit` sur `audio-sync-tool`

> 2026-11-10. Mode `guide` : la personne et l'agent sont dans la même conversation
> ([ADR-074](../../../DECISIONS.md)). Skill `plugins/aidd-dev/skills/04-audit`, révision `fe48de12`, neuf
> fichiers : un `SKILL.md`, sept actions, un gabarit. Terrain
> `/home/giak/projects/aidd-device-work/2026-10-21-173843-plan-simple/2026-11-10-100124-fact-check-passage-2/terrain`,
> clone neuf de `audio-sync-tool`, tête `416ec1f`, porcelain vide au départ. Ce run suit le
> [gabarit du run guidé](../../../tasks/2026_10/2026-10-22-221207-traces-et-run-guide/2026-10-22-221207-spec-run-guide.md).
> C'est le premier passage sur ce skill : aucun run antérieur ne le nomme, donc aucun produit attendu d'un
> passage précédent n'a été lu.

## 0. Déroulé et validations

| # | Étape | Ce qui est fait | Preuve | État |
| --- | --- | --- | --- | --- |
| 1 | Choisir le skill | `04-audit`, sept actions, un gabarit, relus sous `fe48de12` | `git ls-tree -r fe48de12` : 9 fichiers ; `runs.mjs` : aucun run ne nomme `04-audit` | fait |
| 2 | Présenter l'épreuve | non fait : l'ordre de l'opérateur ouvre le tour, la présentation n'a pas eu lieu avant lui | aucun tour `user` ne suit une présentation absente | non observé |
| 3 | Écrire le produit attendu | le §3, écrit après l'ordre | aucun tour `user` ne suit le §3 | non observé |
| 4 | Jouer le skill sur le terrain | les sept piliers, huit fichiers écrits sous `aidd_docs/tasks/2026_11/2026_11_10_audit/` | le §4 ; `git status --porcelain` : `?? aidd_docs/` | fait |
| 5 | Vérifier et consigner | les §5 à §8 | `runs.mjs` → 0, `liens.mjs` → 0 | fait |

## 1. Ce qui est testé

- skill : `plugins/aidd-dev/skills/04-audit`, les sept actions `01-code-quality`, `02-architecture`,
  `03-security`, `04-dependencies`, `05-performance`, `06-tests`, `07-ui`, et le gabarit
  `assets/audit-template.md` ;
- révision : `fe48de12`, celle du framework gelé, le skill n'ayant subi aucune modification ;
- terrain : un clone neuf de `audio-sync-tool`, tête `416ec1f`, 307 fichiers, 48 131 lignes de Python,
  TypeScript et JavaScript ;
- portée : tout le dépôt, les sept piliers.

## 2. La demande, verbatim

> prends un autre skill, et fait un run complet

La portée vient de cette phrase : « run complet » nomme les sept piliers. L'action `Scope` exige une question
pour une demande non bornée, jamais un défaut silencieux ; ici la personne a borné, donc aucune question
n'était due, et aucune portée n'a été choisie par le joueur.

## 3. Le produit attendu

Un dossier `aidd_docs/tasks/2026_11/2026_11_10_audit/`, un fichier par pilier (`code-quality.md`,
`architecture.md`, `security.md`, `dependencies.md`, `performance.md`, `tests.md`, `ui.md`), plus `report.md`
fusionné. Chaque fichier porte `## Findings`, `## Top actions`, `## Coverage` ; chaque ligne de trouvaille
porte une sévérité, le pilier, un `file:line`, un correctif et un effort ; le rapport fusionné trie par
sévérité et couvre les sept piliers ; toute facette non scannable est notée sous `Coverage > Skipped` avec sa
raison ; aucun code n'est modifié.

L'attendu ne nomme pas les trouvailles : elles dépendent du dépôt et de ce que les scans trouvent. Les déclarer
d'avance serait les inventer, ce que le skill interdit.

## 4. Le produit

Huit fichiers, dix trouvailles : 1 critique, 4 avertissements, 5 mineures. Santé `fair`, une critique isolée et
réparable.

- `aidd_docs/tasks/2026_11/2026_11_10_audit/security.md` : 🔴 `app.py:772`, `/copy` crée `dst_dir` et copie
  avec un chemin venu du corps de la requête, sans `is_path_allowed`, alors que `app.py:614` et `app.py:1010`
  gardent leurs routes sœurs.
- `app.py:58` 🟡, `except Exception:` suivi de `pass`, 55 occurrences dans les fichiers Python.
- `app.py:1` 🟡, 2 350 lignes, 33 routes, 77 fonctions dans un module unique.
- `app.py:2274` 🟡, chaque écriture de beatgrid relit et réécrit tout `beatgrids.json` (`app.py:2283`), la
  lecture seule recharge le fichier (`app.py:2291`).
- `vitest.config.js:7` 🟡, `coverage` configuré sans `thresholds`.
- 🟢 : `cueEditor.ts` 1 701 lignes, `package.json:25` devDependencies en `^`, `app.py:1285` index des styles
  recalculé, `test_app.py` 3 826 lignes, `ui.ts:249` erreur effacée après cinq secondes.

Les sept fichiers de pilier et `report.md` sont dans le terrain ; le rapport fusionné porte les dix lignes,
la liste d'actions classées avec leur handoff (`07-refactor`, `06-test`) et la couverture des sept piliers.

## 5. Vérifications

**Les huit fichiers existent** : sept fichiers de pilier et `report.md`, listés dans
`aidd_docs/tasks/2026_11/2026_11_10_audit/`.

**Les trois sections sont là** : `Findings`, `Top actions`, `Coverage`, une fois chacune dans chacun des huit
fichiers.

**Les lignes de trouvaille** : 1 + 2 + 1 + 1 + 2 + 2 + 1 = 10 dans les piliers, 10 dans `report.md`, six
colonnes par ligne.

**Les emplacements cités portent ce que la trouvaille affirme**, relus un par un sur le terrain :

- `app.py:58` → `except Exception:`, `app.py:59` → `pass` ;
- `app.py:772` → `os.makedirs(dst_dir, exist_ok=True)` sans garde, `app.py:614` et `app.py:1010` →
  `if not is_path_allowed(...)` ;
- `app.py:2274` → `cache = load_json(BEATGRID_PATH, {})`, `app.py:2283` → `save_json(BEATGRID_PATH, cache)`,
  `app.py:2291` → chargement de la même clé en lecture ;
- `app.py:1285` → `for source_dir, files in source_files.items():` ;
- `package.json:25` → `"@biomejs/biome": "^2.5.1"`, `package.json:34` → `"wavesurfer.js": "7.12.11"` ;
- `vitest.config.js:7` → `coverage: {`, aucun `thresholds` dans le fichier ;
- `static/src/ui.ts:215` → commentaire des cinq secondes, `static/src/ui.ts:249` → `setTimeout` qui retire le
  message.

**Mesures** : 55 `except Exception`, 33 routes, 77 fonctions, `app.py` 2 350 lignes, `cueEditor.ts` 1 701
lignes, `test_app.py` 3 826 lignes, 12 fichiers `test_*.py`, 22 fichiers `*.test.ts`, `docs/adr` absent.

**Lecture seule** : `git diff --stat` → 0 ligne ; `git status --porcelain` → `?? aidd_docs/`, rien d'autre.

## 6. La grille, dérivée du skill

| Geste | Preuve attendue | État | Preuve |
| --- | --- | --- | --- |
| Sept piliers couverts, un fichier par pilier | sept fichiers et le rapport | tenu | §4 |
| Trois sections par fichier | 21 sections | tenu | §5 |
| `file:line`, sévérité, correctif, effort par ligne | dix lignes complètes | tenu | §5 |
| Rapport fusionné trié par sévérité | critique en tête | tenu | §4 |
| Lecture seule | aucun diff suivi | tenu | §5 |
| Facette non scannable déclarée avec sa raison | six facettes sous `Skipped` | tenu | §4 et les fichiers de pilier |
| Portée nommée ou question posée | « run complet » dans la demande | tenu | §2 |
| Tour suivant après le produit | un tour `user` | non observé | aucun tour après le §3 |

## 7. Limites et statut

- `session_non_independante` : le joueur a écrit l'attendu puis produit lui-même ([ADR-074](../../../DECISIONS.md)).
  La confusion est plus faible qu'au passage 2 de `04-fact-check`, parce qu'aucun produit antérieur du skill
  n'existait à lire, mais elle reste entière : rien ne sépare l'attendu du produit.
- `attendu_non_gele` : le §3 est écrit après la demande, sans gel.
- `trace_absente` : aucune trace machine exportée pour ce fil ; la grille du §6 est remplie à la main.

**Ce que les scans ne couvrent pas**, et qui borne les trouvailles : aucun scanner de CVE, aucun inventaire de
licences, aucun profiler, aucun rapport de couverture, aucune passe d'accessibilité à l'exécution. Le classement
et la santé sont un jugement, pas une mesure.

Statut de forme : **forme tenue** (sept clauses tenues, aucune violée). Verdict : `null`, un guidé n'atteste
pas la valeur du skill.

## 8. Ce que ce run ne prouve pas

Que le skill produirait seul ce rapport ; que la liste des trouvailles soit complète, aucune des facettes
écartées n'ayant été scannée ; que la route `/copy` soit exploitable dans les conditions réelles, l'outil
n'écoutant que sur la boucle locale ; que le classement des cinq actions soit le meilleur ; que la santé `fair`
soit la bonne note, aucun seuil de santé n'étant mesuré.
