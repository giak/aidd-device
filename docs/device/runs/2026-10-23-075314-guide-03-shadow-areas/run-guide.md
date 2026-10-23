---
name: Run guidé — 03-shadow-areas sur audio-sync-tool
description: "Le rapport d'angles morts de la Task refuser-config-manquante : forme tenue, six écarts, Task intacte, indépendance non observée"
type: run-guide
status: done
---

# Run guidé — `03-shadow-areas` sur `audio-sync-tool`

> 2026-10-23. Mode `guide` : la personne et l'agent sont dans la même conversation
> ([ADR-074](../../../DECISIONS.md)). Skill `plugins/aidd-refine/skills/03-shadow-areas`, révision
> `fe48de12` du dépôt `framework` (porcelain : `?? aidd_docs/MEGA-PROMPT-TEST-AIDD-v6.md`, hors du
> skill). Terrain `/home/giak/aidd-device-work/2026-10-23-035316-task-config-terrain/terrain`, tête
> `416ec1f`. Le run suit le [gabarit du run guidé](../../../tasks/2026_10/2026-10-22-221207-traces-et-run-guide/2026-10-22-221207-spec-run-guide.md)
> et la [présentation de l'épreuve](../../../tasks/2026_10/2026-10-23-034641-presentation-de-l-epreuve/2026-10-23-034641-spec.md).

## 0. Déroulé et validations

| # | Étape | Ce qui est fait | Preuve | État |
| --- | --- | --- | --- | --- |
| 1 | Choisir le skill | `03-shadow-areas` du plugin `aidd-refine` : scanne un artefact markdown et écrit un rapport d'angles morts adjacent, sans code ni correctif | `SKILL.md`, trois `actions/`, trois `references/` et `assets/report-template.md` lus, 387 lignes (`wc -l`) | fait |
| 2 | Présenter l'épreuve | les six champs ci-dessous | réponse de la personne : « Valider la présentation » | **validée** |
| 3 | Écrire la demande et le produit attendu | le §2 et le §3 | réponse de la personne : « Valider et jouer le run » | **validée** |
| 4 | Jouer le skill sur le terrain | le rapport écrit à côté de la Task | `refuser-config-manquante-shadow-report.md`, 43 lignes, `sha256` `b744f6a5…` | **fait** |
| 5 | Vérifier et consigner | les §4 à §8 ; forme, comptes, empreintes relus | `liens.mjs`, `git diff --check`, `git status --porcelain` du terrain | fait |

### Étape 2, la présentation de l'épreuve

Reconstruction des six champs validés avant la demande ; le message d'origine n'est pas cité mot à mot.

**Ce qui est testé.** Le skill `03-shadow-areas`, sa capacité à extraire d'une Task des angles morts
rangés dans la taxonomie verrouillée, avec une sévérité et une question actionnable, et à écrire un seul
rapport à côté de la source. Ne sont pas testés : la valeur du travail décrit par la Task, ni la justesse
d'un correctif.

**Pourquoi.** Une Task est le premier artefact que la chaîne aval lit. Un angle mort non nommé devient une
question de spec, un retravail ou un test manquant plus tard. Le test éclaire une décision : un scan
mécanique d'artefact peut-il servir sans relecture humaine systématique ? Un échec coûterait un rapport
qui rate l'essentiel ou invente des écarts.

**Comment.** Un vrai projet (`audio-sync-tool`), une Task réelle, le skill joué dans la conversation
courante, sans headless ni gel. Une demande bornée, un seul fichier attendu, une grille de traces remplie
à la main.

**Le but.** Établir si le produit tient la forme déclarée par le skill (chemin dérivé, frontmatter,
catégories et sévérités verrouillées, questions, comptes) et s'il nomme l'angle mort le plus lourd de la
Task.

**Ce qui sera observé.** Les lectures du skill, la validation de la présentation et de la demande, le
chemin et l'empreinte du rapport, sa forme, ses comptes, l'intégrité de la Task et l'absence d'écriture
hors du produit.

**Ce que le test ne prouvera pas.** L'indépendance de la session, l'antériorité non gelée de l'attendu, la
justesse des catégories et des sévérités, ni que le skill seul produit ce résultat.

## 1. Ce qui est testé

- skill : `plugins/aidd-refine/skills/03-shadow-areas` ;
- révision : `fe48de12` du dépôt `framework` ;
- terrain : `/home/giak/aidd-device-work/2026-10-23-035316-task-config-terrain/terrain` ;
- tête : `416ec1f` ;
- porcelain au moment de la vérification : ` M app.py`, ` M test_app.py`, `?? aidd_docs/` ; les deux
  modifications datent de `07:22:24` et `07:22:30`, avant le run, et leur auteur n'est pas établi.

**Le skill.** Il lit un artefact markdown (idée, stories, PRD, spec) et rend un rapport d'angles morts.
Sept catégories et trois sévérités sont verrouillées par `references/locked-sets.json` ; chaque écart
porte une question directe terminée par `?`, une sévérité et l'extrait dont il vient. Le rapport s'écrit à
côté de la source, nommé par la règle `<source sans sa dernière extension>-shadow-report.md`. Le skill ne
corrige rien, n'écrit ni code ni spec, et ne dialogue pas : il scanne et rend.

**La source scannée.** `aidd_docs/backlog/tasks/refuser-config-manquante.md`, la Task produite par le run
guidé du `10-task` le 2026-10-23 à 03:56, `sha256`
`818db266102b8c13a1a0a27a1df56dd3d67d81e36a79ea18873349edc5fffc6f`. Elle demande de refuser le démarrage
quand `data/config.json` manque, exclut la création automatique du fichier, et liste deux preuves de fin.

## 2. Demande remise

```text
Read the skill at /home/giak/projects/framework/plugins/aidd-refine/skills/03-shadow-areas/SKILL.md and apply it to this repository.
Ce dépôt est audio-sync-tool. Scanne `aidd_docs/backlog/tasks/refuser-config-manquante.md` et écris le rapport d'angles morts à côté de la Task. Ne modifie pas la Task, n'écris aucun autre fichier, ne propose ni correctif ni implémentation.
```

## 3. Produit attendu, écrit avant le run

Un seul fichier neuf : `aidd_docs/backlog/tasks/refuser-config-manquante-shadow-report.md`, dérivé du nom
de la source par la règle du skill.

- frontmatter : `source`, `generated_at`, et `status: clean` seulement si aucun blocker ni major ne reste ;
- corps : `# Shadow Areas Report`, `Source:`, `Generated:`, la ligne
  `Total gaps: n | Blocker: n | Major: n | Minor: n`, puis `## Gaps by Category` ; une section par
  catégorie présente, dans l'ordre verrouillé ; chaque écart s'écrit `**[severity]** <question>` et porte
  l'extrait cité en blockquote ;
- contenu vérifiable : au moins un écart nomme l'absence de moyen de créer `data/config.json` au premier
  lancement, avec une sévérité `blocker` ou `major`, quelle que soit la catégorie ; sept catégories et
  trois sévérités seulement, prises dans les jeux verrouillés ; chaque question commence par une forme
  autorisée et finit par `?` ;
- exclusions : la Task reste intacte (`sha256` `818db266…fffc6f` avant et après), aucun code, aucune spec,
  aucun correctif, aucun second rapport ;
- preuves : les deux empreintes, `find aidd_docs -type f` qui passe de 1 à 2, la forme et les comptes du
  rapport, et `git status --porcelain` sans autre écriture.

## 4. Grille de traces

| Geste attendu | Preuve attendue | État | Preuve observée |
| --- | --- | --- | --- |
| lire le skill et ses références | une lecture sous la révision `fe48de12` | tenu | `SKILL.md`, `actions/01-detect.md`, `actions/02-render-report.md`, `actions/03-diff.md`, `references/categories.md`, `references/severity-rubric.md`, `references/probe-style.md`, `references/locked-sets.json`, `assets/report-template.md` |
| poser une question et obtenir l'accord | une présentation, puis la réponse de la personne | tenu | « Valider la présentation », puis « Valider et jouer le run » |
| décider et motiver | un texte qui énonce le choix de catégorie et de sévérité, avec son motif | non observé | aucun message du fil ne dit pourquoi un écart est `blocker` ou `major` ; la grille le dit, elle ne le comble pas |
| écrire l'unique produit | le rapport au chemin dérivé | tenu | `aidd_docs/backlog/tasks/refuser-config-manquante-shadow-report.md`, 43 lignes, `sha256` `b744f6a525f371d785a2c328eb3c520133214f7e6e4c165a0bf00308b9f72571` |
| ne pas modifier la source | la Task à la même empreinte | tenu | `818db266…fffc6f` avant et après |
| rester dans le terrain | aucune écriture hors du produit déclaré | tenu | `git status --porcelain` : le rapport est la seule entrée neuve (`?? aidd_docs/`) ; ` M app.py` et ` M test_app.py` datent de `07:22`, avant le rapport né à `07:50:41` |
| trace machine | l'export du fil et son empreinte | non observé | `tracer --liste --depuis 2026-10-23T06:00:00` rend `0` fil ; le dernier fil des bases listées date du 2026-10-19 ; voir §5 bis |

## 5. Produit

- chemin : `aidd_docs/backlog/tasks/refuser-config-manquante-shadow-report.md` (43 lignes) ;
- `sha256` : `b744f6a525f371d785a2c328eb3c520133214f7e6e4c165a0bf00308b9f72571` ;
- frontmatter : `source` et `generated_at` (`2026-10-23T07:50:28+02:00`), pas de `status: clean` : un
  blocker reste ;
- comptes : `Total gaps: 6 | Blocker: 1 | Major: 4 | Minor: 1`, identiques aux six lignes relevées ;
- catégories : cinq, dans l'ordre verrouillé (`unstated assumption`, `ambiguous term`,
  `missing failure mode`, `missing acceptance criterion`, `missing dependency`) ; aucune section vide ;
- questions : les six commencent par une forme du jeu verrouillé (`Which`, `What`, `How`) et finissent par
  `?` ;
- extraits : six blockquotes, quatre contigus dans la source, deux recollent une ligne coupée
  (`par` / `défaut.`), mot à mot intact ;
- tri : dans chaque catégorie, les sévérités vont de `blocker` à `minor` ;
- source : Task inchangée, `sha256` `818db266102b8c13a1a0a27a1df56dd3d67d81e36a79ea18873349edc5fffc6f` ;
- arbre : `find aidd_docs -type f` rend deux fichiers, la Task et le rapport ; aucun second rapport.

## 5 bis. Trace machine

Absente. `node docs/device/harness/orchestrer.mjs tracer --run docs/tasks/2026_10/2026-10-23-075314-test-03-shadow-areas --liste --depuis 2026-10-23T06:00:00`
rend `▸ FILS — 0 depuis 2026-10-23T06:00:00`. Le dernier fil que les bases Freebuff listent date du
2026-10-19 : le fil courant n'est pas dans ce que la frontière des clients lit, et rien ne s'exporte. Les
preuves du §4 citent donc les réponses de la personne, pas des `seq`, et aucune ligne ne devient `tenu`
sur un tour illisible.

## 6. Ce que ce run prouve

Sur cette Task et cette demande, le skill a produit le fichier attendu, au chemin dérivé, avec la forme
annoncée : frontmatter sans `status` puisqu'un blocker demeure, six écarts comptés juste, cinq catégories
dans l'ordre verrouillé, trois sévérités du jeu, six questions d'une forme autorisée finissant par `?`.
La source n'a pas bougé, et aucune écriture hors du produit dans le terrain n'est datée dans la fenêtre du run. Le
contenu porte l'écart annoncé d'avance : aucune voie n'est donnée pour obtenir `data/config.json` quand
l'application refuse de démarrer sans lui, en `blocker`.

## 7. Ce qu'il ne prouve pas

- l'indépendance : l'agent a lu l'attendu et cette page avant de produire (`session_non_independante`) ;
- l'antériorité de l'attendu : il vit dans ce fichier, il n'est pas gelé, donc rien ne prouve qu'il précède
  le produit ;
- la justesse des classements. Trois doutes, nommés et non tranchés :
  - l'écart `blocker` « comment obtenir `data/config.json` » est rangé en `missing failure mode` alors que
    la Task décrit déjà la défaillance (le refus) ; ce qui manque est le pas préalable qui produit le
    fichier, plus proche de `missing dependency` ;
  - « Which build or install step must run before the pytest suite counts as green? » est `major` ; le
    README du projet nomme l'installation (`./venv/bin/pip install -r requirements.txt`) et
    `docs/TESTING-GUIDE.md`, et la rubrique réserve `major` au retravail, donc `minor` se défend ;
  - « Which launch paths must run the configuration check » suppose une ambiguïté que le projet réduit :
    le README documente `npm start` et `./venv/bin/python app.py` ;
- le contrat d'appariement de `03-diff` : il compare catégorie et extrait ; deux extraits recollent une
  ligne coupée, donc deux runs peuvent citer le même passage sous deux formes et ne pas s'apparier ;
- la propreté du terrain : la copie portait `?? aidd_docs/` (la Task du run précédent) et deux
  modifications antérieures (` M app.py`, ` M test_app.py`, `07:22`), donc elle n'est pas la copie neuve
  que la spec demande. Le rapport ne lit que la Task, mais l'état du terrain reste une réserve ;
- la reproductibilité : une session, un modèle, un projet ; la découverte du skill n'est pas mesurée ;
- la trace machine : absente (§5 bis), donc aucun `seq` n'est citable.

## 8. Décision

Forme tenue : un fichier au chemin dérivé, la forme et les comptes attendus, la Task intacte, aucune
écriture datée hors du produit dans le terrain. Les doutes du §7 portent sur le jugement de contenu et sur l'état du
terrain, pas sur la forme. Aucun reçu n'est écrit : un run guidé n'en porte pas, et il ne rend pas de
verdict de conformité. Le rapport reste dans le clone, non commité ; le vrai dépôt n'est pas touché.
