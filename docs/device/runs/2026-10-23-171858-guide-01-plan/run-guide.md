---
name: Run guidé : 01-plan sur audio-sync-tool
description: "Le découpage d'app.py (EPIC-055) transformé en plan et ses phases : gabarits, dossier dérivé, projections couvrantes, backlog-link, aucune place-holder ; indépendance non observée"
type: run-guide
status: done
---

# Run guidé : `01-plan` sur `audio-sync-tool`

> 2026-10-23, 17:18. Mode `guide` : la personne et l'agent sont dans la même conversation
> ([ADR-074](../../../DECISIONS.md)). Skill `plugins/aidd-dev/skills/01-plan`, révision `fe48de12`
> du dépôt `framework` (porcelain : `?? aidd_docs/MEGA-PROMPT-TEST-AIDD-v6.md`, hors du skill demandé ;
> rien sous `plugins/aidd-dev/skills/01-plan`). Terrain
> `/home/giak/aidd-device-work/2026-10-23-171858-plan-terrain/terrain`, clone neuf de
> `audio-sync-tool`, tête `416ec1f`, porcelain vide au départ. Le run suit le
> [gabarit du run guidé](../../../tasks/2026_10/2026-10-22-221207-traces-et-run-guide/2026-10-22-221207-spec-run-guide.md)
> et la [présentation de l'épreuve](../../../tasks/2026_10/2026-10-23-034641-presentation-de-l-epreuve/2026-10-23-034641-spec.md).

## 0. Déroulé et validations

| # | Étape | Ce qui est fait | Preuve | État |
| --- | --- | --- | --- | --- |
| 1 | Choisir le skill | `01-plan` du plugin `aidd-dev` : une source est restatée, le code lu, puis un plan et ses phases sont écrits par les deux gabarits | `SKILL.md`, les quatre actions, `plan-template.md`, `phase-template.md` et `plan-status.md` lus sous `fe48de12` ; fil `ce9c488a-8810-4bef-a495-1a25bf7a8d4f` relevé par `tracer --liste --depuis 2026-10-23T00:00:00` et inscrit dans `run.json` | fait |
| 2 | Présenter l'épreuve | les six champs ci-dessous | réponse de la personne : « Valider la présentation » | **validée** |
| 3 | Écrire la demande et le produit attendu | le §2 et le §3 | réponse de la personne : « Valider et jouer le run » | **validée** |
| 4 | Jouer le skill sur le terrain | le brouillon montré, puis les écritures du plan | réponse de la personne : « Accepter et écrire » ; huit fichiers écrits à `17:22-17:23`, `plan.md` 35 lignes, `sha256` `59818cc5…` | **fait** |
| 5 | Vérifier et consigner | les §4 à §8 | `find`, `wc -l`, `sha256sum`, `grep`, `git status --porcelain`, `tracer` (`exit 0`, 133 lignes, §5 bis) | fait |

### Étape 2, la présentation de l'épreuve

Reconstruction des six champs soumis avant la demande ; le message d'origine n'est pas cité mot à mot.

**Ce qui est testé.** Le skill `01-plan`, ses actions `gather → explore → wireframe → plan` et ses deux
gabarits. Ne sont pas testés : l'implémentation (le skill ne code jamais), le contenu du découpage
proposé, ni l'action `wireframe`, qui doit être sautée faute d'interface et dont le saut reste
observable.

**Pourquoi.** `01-plan` est le seul skill qui transforme une source en phases que `02-implement` exécute
et que `05-review` vérifie ; un plan creux se paie en implémentation à l'aveugle. La décision que ce
test éclaire : sur une source réelle et un terrain inconnu, le skill produit-il un plan dont les
projections couvrent le travail, et dont chaque phase tient seule ?

**Comment.** Terrain : un clone neuf de `audio-sync-tool`, propre, sous
`/home/giak/aidd-device-work/2026-10-23-171858-plan-terrain/terrain` ; le vrai dépôt n'est pas touché.
Source : un chemin d'artefact de backlog du terrain,
`docs/superpowers/epics/EPIC-055-decoupage-app-monolithe.md`, qui liste les zones candidates et les
contraintes héritées. Mode guidé dans cette conversation : pas de headless, pas d'`ouvrir`, pas de gel.
Trace machine par `tracer`, bornée au run ; grille des quatre familles remplie à la main.

**Le but.** Établir que le produit tient la forme du skill : `plan.md` et ses `phase-<n>.md` au dossier
dérivé `aidd_docs/tasks/2026_10/2026-10-23_<slug>/`, sections des deux gabarits sans ajout ni
réordonnancement, projection d'arborescence par phase, `Test Scope` en mermaid, aucun `{…}` résiduel,
`backlog-link.json` nommant l'EPIC, et des phases dont les projections réunies couvrent les listes
modifier, créer, supprimer.

**Ce qui sera observé.** Les lectures du skill sous `fe48de12` (SKILL, quatre actions, deux gabarits,
une référence), les deux validations, la demande verbatim, les chemins écrits, `wc -l`, `sha256sum`, les
titres de sections dans l'ordre, la couverture des projections, la recherche de `{`, le
`backlog-link.json`, la commande de fin de step, et le porcelain du terrain.

**Ce que le test ne prouvera pas.** L'indépendance (`session_non_independante`) ; l'antériorité de
l'attendu (non gelé) ; la justesse du découpage, des phases et des critères d'acceptation ; la fidélité
de la lecture d'`app.py` ; qu'un autre agent produirait le même plan ; ni que le plan guide réellement
une implémentation.

## 1. Ce qui est testé

- skill : `plugins/aidd-dev/skills/01-plan`, actions `01-gather.md`, `02-explore.md`,
  `03-wireframe.md`, `04-plan.md` ;
- révision : `fe48de12` du dépôt `framework` ;
- terrain : `/home/giak/aidd-device-work/2026-10-23-171858-plan-terrain/terrain` ;
- tête : `416ec1f` ;
- porcelain au départ du run : vide (`git status --porcelain` sans ligne), clone neuf par
  `git clone /home/giak/projects/audio-sync-tool`.

**Le skill.** Il restate une source (`gather`), lit le code qu'elle touche pour bâtir une projection et
des contrôles de faisabilité (`explore`), esquisse un écran en ASCII quand la fonction a une interface
(`wireframe`), puis écrit `plan.md` et un `phase-<n>.md` par phase au dossier
`aidd_docs/tasks/<yyyy_mm>/<yyyy_mm_dd>_<feature-slug>/` (`plan`). Les deux gabarits ferment leurs
sections : « Fill or omit these sections; never add, rename, or reorder one », et aucun `{…}` ne doit
rester. Quand la source nomme un élément de backlog et que le dossier est neuf, le skill écrit un
`backlog-link.json`. Après les écritures, et seulement alors, il lance
`echo "aidd:step-end aidd-dev:01-plan"`.

**La source.** L'EPIC-055, au statut backend : `app.py` concentre 2 350 lignes et 33 routes ; l'EPIC
nomme sept zones candidates avec leurs lignes et un module cible par zone, et deux contraintes
héritées (les tests monkeypatchent les constantes de module ; les routes ne changent pas).

## 2. Demande remise

```text
Lis le skill à /home/giak/projects/framework/plugins/aidd-dev/skills/01-plan/SKILL.md et applique-le à ce dépôt.

Découpe app.py (2 350 lignes, 33 routes) en modules : le backend doit devenir lisible zone par zone, sans framework et sans réécriture.
Source : docs/superpowers/epics/EPIC-055-decoupage-app-monolithe.md, qui liste les zones candidates et les contraintes héritées.
Une zone par phase au plus, chaque phase doit pouvoir être livrée et vérifiée seule, tests verts à chaque étape.
Aucune route renommée : le frontend ne doit pas voir la différence.
Écris le plan et ses phases. Ne code rien.
```

## 3. Produit attendu, écrit avant le run

Un dossier de feature neuf sous `aidd_docs/tasks/2026_10/`, préfixe `2026-10-23_` et un slug dérivé de
la demande (le slug exact n'est pas préjugé : il est dérivé, pas dicté). Il porte `plan.md`, un
`phase-<n>.md` par phase, et un `backlog-link.json`.

- **`plan.md`** : frontmatter `objective` en une phrase et `status: pending` ; sections `## Overview`
  (tableau `Goal` et `Source`), `## Phases` (tableau `#`, `Phase`, `File` dont chaque `File` pointe vers
  un `phase-<n>.md`), `## Resources` seulement pour une source externe réellement consultée et
  `## Decisions` seulement pour un choix d'architecture qu'on regretterait d'inverser ; aucune autre
  section, aucun réordonnancement.
- **chaque `phase-<n>.md`** : frontmatter `status: pending` ; sections `## Architecture projection`
  (arbre `txt` avec ✅ créer, ✏️ modifier, ❌ supprimer, un chemin par entrée), `## User Journey`
  (mermaid `flowchart`), `## Test Scope` (mermaid `journey` avec `Setup` et `Happy path`, une section
  par cas limite dont le déclencheur et le résultat connu, un seul acteur par phase), `## Tasks to do`
  (tâches numérotées, étapes concises), `## Test acceptance criteria` (tableau `Task` et critère
  observable, jamais une commande). `## Wireframe` est **omis** : la demande n'a pas d'interface.
- **phases** : au moins deux, chacune livrable et vérifiable seule ; les projections réunies couvrent
  les listes modifier, créer et supprimer du découpage, dont les sept modules que l'EPIC nomme, et
  `app.py` apparaît en ✏️ dans plus d'une phase.
- **`backlog-link.json`** : un objet dont `backlog` vaut
  `docs/superpowers/epics/EPIC-055-decoupage-app-monolithe.md` (chemin du terrain, pas de forge), plus
  `written_at` ISO et `written_by: "aidd-dev:01-plan"`.
- **propreté** : aucun `{…}` ni `TODO` de gabarit dans les fichiers écrits ; aucune section inventée ;
  aucune place-holder de mermaid.
- **commande de fin** : `echo "aidd:step-end aidd-dev:01-plan"` exécutée après les écritures, jamais
  avant.
- **terrain** : aucune écriture hors d'`aidd_docs/` ; `app.py` et son `sha256` inchangés ; aucun test
  touché ; `git status --porcelain` ne montre que `?? aidd_docs/` après le run.
- **preuves** : `find aidd_docs -type f`, `wc -l` par fichier, `sha256sum`, la liste des titres de
  section dans l'ordre par fichier, `grep -n '{'`, `grep -rn 'Wireframe'`, le contenu de
  `backlog-link.json`, `sha256sum app.py` avant et après, et `git status --porcelain`.**Exclusions.** Aucun code écrit, aucun module créé, aucun test modifié : le skill ne code jamais. Aucun `phase-0`, aucune phase de préparation vide. Aucune décision d'architecture inventée (le choix d'un framework, d'un gestionnaire de routes ou d'une bibliothèque) : l'EPIC les exclut.

## 4. Grille de traces

| Geste attendu | Preuve attendue | État | Preuve observée |
| --- | --- | --- | --- |
| lire le skill, ses quatre actions, ses gabarits et sa référence | une lecture sous la révision `fe48de12` | tenu | `SKILL.md`, `actions/01-gather.md`, `actions/02-explore.md`, `actions/03-wireframe.md`, `actions/04-plan.md`, `assets/plan-template.md`, `assets/phase-template.md`, `references/plan-status.md` lus sous `fe48de12` |
| restater la source (`gather`) | la source nommée et reprise en points | tenu | l'EPIC-055 lu dans le terrain, sept zones et deux contraintes héritées repris dans `plan.md` et les six phases |
| explorer le code (`explore`) | une lecture qui borne les fichiers, les règles et les risques | tenu | `app.py` 2 350 lignes, 33 `@app.route`, `test_app.py` fixture autouse à sept `monkeypatch.setattr` et douze noms importés d'`app` ; deux constats écrits : plages de lignes de l'EPIC périmées, `/styles/audit` à 886 hors de la plage annoncée |
| sauter `wireframe` | aucune section `Wireframe`, et la raison | tenu | `grep -rn 'Wireframe' plan.md phase-*.md` sort en `1`, aucune ligne ; la demande n'a pas d'interface |
| poser une question et obtenir l'accord | trois tours `user` de validation | non observé | les trois appels `ask_questions` sont au seq 657, mais leurs réponses ne sont pas dans l'export : les parts d'outil ne portent que `kind`, `id`, `toolName` et `input`. L'accord a eu lieu, il n'est pas lisible dans la trace. Voir la rectification sous le tableau |
| décider et motiver | les décisions du plan, chacune avec son motif | tenu | six lignes dans `## Decisions` : propriétaire unique des chemins, `Blueprint` sans `url_prefix`, `_scan_file` picklable, pas de framework, `get_active_config` dans `store`, helpers d'artiste dans `scan` |
| écrire le produit | les chemins, leurs empreintes et leurs sections | tenu | huit fichiers sous `aidd_docs/tasks/2026_10/2026-10-23_decoupage-app-py/`, 582 lignes, empreintes au §5 |
| déclarer le backlog | un `backlog-link.json` qui nomme l'EPIC | tenu | `backlog` vaut `docs/superpowers/epics/EPIC-055-decoupage-app-monolithe.md`, `written_by` vaut `aidd-dev:01-plan` |
| lancer la commande de fin de step, après les écritures | `echo "aidd:step-end aidd-dev:01-plan"` | tenu | sorti à `17:23:42`, après le dernier fichier écrit ; rien avant |
| rester dans le terrain | aucune écriture hors du produit | tenu | `git status --porcelain` rend `?? aidd_docs/` seul ; `sha256sum app.py` rend `9f2e8d5c…`, identique au départ |
| trace machine | l'export du fil et son empreinte | non observé | `tracer` a refusé un export vide ; la fenêtre est à reprendre au tour suivant, voir §5 bis |

Toutes les lignes `tenu` du tableau ont la même preuve de tour, `seq 657`, le message du run dans l'export : la colonne cite le chemin, l'empreinte ou la commande, et le `seq` les rattache au fil. La ligne « trace machine » cite les deux `seq`, 656 et 657.

**Rectification (2026-10-23, 17:35).** La ligne « poser une question et obtenir l'accord » disait `tenu`, avec les trois réponses pour preuve. La lecture des parts montre qu'un appel `ask_questions` ne garde que `kind`, `id`, `toolName` et `input` : la réponse de la personne n'est écrite nulle part dans le message. Les trois questions sont au seq 657, les trois accords ne sont pas exportables. La ligne passe donc à `non observé`, et l'accord reste une déclaration de l'agent. C'est une mesure, pas une panne de ce run : `tracer` ne peut exporter que ce que le client écrit.

**Deux décisions ajoutées pendant le run.** Le brouillon validé en portait quatre ; le play en a écrit six. `get_active_config` est allé dans `store.py` et non dans `app.py`, et `_artist_title`, `_years_strip_accents` et `_build_source_index` dans `scan.py` et non dans `tagging.py` : sans cela, `scan.py` aurait importé `app` ou `tagging` aurait importé `app`, donc un cycle à l'ouverture. Les deux lignes sont motivées dans le plan ; elles ne changent ni le nombre de phases ni les modules du brouillon.

## 5. Produit

- dossier : `aidd_docs/tasks/2026_10/2026-10-23_decoupage-app-py/`, huit fichiers, 582 lignes de Markdown ;
- `plan.md` : 35 lignes, `sha256` `59818cc5eca781a3d4920ba5bc874a249c14f12b1b5d1d5b8fd7e790a385995b` ;
- `phase-1.md` 87 lignes `55c9bd6a…`, `phase-2.md` 89 `4b8330c9…`, `phase-3.md` 90 `ec8133c1…`, `phase-4.md` 93 `3b3995e5…`, `phase-5.md` 94 `54100ba0…`, `phase-6.md` 94 `7faed9f4…` ;
- sections de `plan.md` : `## Overview`, `## Phases`, `## Decisions`, dans l'ordre du gabarit ; `## Resources` omis, aucune source externe consultée ;
- sections de chaque phase : `## Architecture projection`, `## User Journey`, `## Test Scope`, `## Tasks to do`, `## Test acceptance criteria`, dans cet ordre ; `## Wireframe` omis dans les six, aucune autre section ;
- projections : six phases, sept modules créés (`store`, `scan`, `copying`, `tagging`, `tracks`, `playlists`, `beatgrid`), `app.py` en ✏️ dans les six ; aucune suppression (❌) : le découpage ne retire aucun fichier ;
- place-holders : `grep -n '{' plan.md phase-*.md` sort en `1`, aucune ligne ; `grep -rn 'TODO'` de même ;
- backlog : `backlog-link.json` de 5 lignes, `backlog` nomme le chemin de l'EPIC dans le terrain, `written_at` `2026-10-23T17:23:42+02:00`, `written_by` `aidd-dev:01-plan` ;
- terrain : `app.py` non modifié (`sha256` `9f2e8d5cd563e962dd9edc3bfa7f78296cb35a45f8ec54e1c0351acd0ba58add`, identique avant et après), `git status --porcelain` rend `?? aidd_docs/` seul ;
- commande de fin : `aidd:step-end aidd-dev:01-plan`, sortie après la dernière écriture.

## 5 bis. Trace machine

Exportée au tour suivant, `exit 0` :

```text
▸ TRACE — ce9c488a-8810-4bef-a495-1a25bf7a8d4f
  empreinte           : 39b523b130ed42d991b1aeaab8becc47114f975d128054dcc268f9279e92fc84 (133 ligne(s))
  fenêtre             : 2026-10-23T17:17:00+02:00 → 2026-10-23T17:27:00+02:00
  source              : freebuff, m-096e75164d
```

- `trace/echange.jsonl` : 133 lignes, `sha256` `39b523b130ed42d991b1aeaab8becc47114f975d128054dcc268f9279e92fc84`, seq 656 à 657, exporté le `2026-10-23T17:27:17+02:00` ;
- `trace/fil.json` : client `freebuff`, application `Freebuff Desktop (desktop-v2.db, harness_id codebuff)`, modèle `m-096e75164d`, `lignes: 133`, fenêtre `17:17:00 → 17:27:00`, `premier` et `dernier` aux seq 656 et 657 ;
- la fenêtre couvre le message de consigne (seq 656, `ts` 1792768663888) et le message du run (seq 657), et s'arrête avant la consigne de clôture (seq 658) ;
- 133 lignes pour 132 parts : le message 657 en porte 132, le message 656 une seule.

**Le premier appel, refusé.** `tracer` a été lancé dans le tour qui jouait le run, avec une fenêtre ouverte à `2026-10-23T17:18:04+02:00`, l'instant de la consigne :

```text
REFUS — tracer : l'export de ce9c488a-8810-4bef-a495-1a25bf7a8d4f est vide — une trace vide ne se cite pas
```

La cause est mesurée, et ce n'est pas l'absence du fil : le client écrit le message d'un tour quand ce tour se termine, et le seul message du run présent dans la base à cet instant portait `17:17:43`. La requête de la fenêtre rendait zéro ligne :

```text
select count(*), min(seq), max(seq) from messages where thread_id='ce9c488a…' and ts>=1792768684000 and ts<1792769058413;
0|||
```

Le fil est créé le `2026-10-16T09:19:16+02:00`, porte 504 messages, et son dernier portait `17:17:43` à cet instant. Le fichier vide laissé par le refus a été retiré : un `echange.jsonl` de zéro octet n'est pas une trace.

**Ce que l'export ne nomme pas.** La colonne `chemin_outil` ne lit que `$.input.path` : un `read_files`, qui prend `paths`, se prouve par son outil et son `seq`, jamais par ses chemins. Les écritures et les remplacements portent leur chemin, et les commandes leur texte.

## 6. Ce que ce run prouve

Sur cette source et ce terrain, le skill a produit un `plan.md` et six `phase-<n>.md` au dossier dérivé, avec les sections des deux gabarits dans l'ordre, sans `Wireframe`, sans place-holder et sans section inventée. Un `backlog-link.json` nomme l'EPIC source. Les projections réunies couvrent les sept modules que l'EPIC nomme et laissent `app.py` en modification dans les six phases ; aucune suppression n'est déclarée, et c'est le fait : le découpage ne retire aucun fichier. Les décisions sont motivées par des faits lus dans le code, dont deux points de couplage que l'EPIC ne nommait pas (les points de patch des tests, les helpers d'artiste appelés par `/scan`). Le terrain n'a pas bougé hors d'`aidd_docs/`.

## 7. Ce qu'il ne prouve pas

- l'indépendance : l'agent a lu ce journal et l'attendu avant de produire (`session_non_independante`) ;
- l'antériorité de l'attendu : il vit dans ce fichier, sans gel (`attendu_non_gele`) ;
- la justesse du découpage : aucune phase n'a été jouée, aucun module n'existe, et le plan n'a pas été relu par un tiers ;
- la fidélité de la lecture d'`app.py` : les zones sont bornées par des fonctions et des routes nommées, pas par une analyse exhaustive ; `_source_style_of` est cité dans deux phases, et son propriétaire final n'est pas tranché ;
- l'exactitude des critères d'acceptation : ils décrivent des comportements observables, mais aucune commande ne les a exécutés ;
- la reproductibilité : une session, un modèle, un terrain, une source ;
- la trace machine comme preuve des chemins lus : elle nomme l'outil et le `seq`, pas les `paths` d'un `read_files` (§5 bis), et les chemins cités au §4 viennent du tour, pas de l'export ;
- la complétude de l'export : 133 lignes couvrent le message du run, pas l'état du dépôt ni les fichiers hors du fil ;
- l'accord de la personne : les réponses d'`ask_questions` ne sont pas dans l'export, donc la pause du §4 est `non observé` et le « brouillon accepté » reste une déclaration de l'agent, jamais une pièce.

## 8. Décision

Forme tenue pour le produit : huit fichiers au dossier dérivé, sections des deux gabarits dans l'ordre, `Wireframe` omis, aucun place-holder, `backlog-link.json` nommant l'EPIC, projections couvrant créer et modifier, une commande de fin après les écritures, aucune écriture hors d'`aidd_docs/`, et la trace machine attachée (133 lignes, seq 656 à 657). La pause, elle, reste `non observé` : le brouillon a été accepté, l'acceptation n'est pas dans la trace. Aucun reçu n'est écrit, et aucun verdict de conformité n'est rendu : un run guidé ne porte ni l'un ni l'autre. Le plan reste dans le clone, non commité ; le vrai dépôt n'est pas touché.
