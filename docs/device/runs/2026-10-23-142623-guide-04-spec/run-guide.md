---
name: Run guidé : 04-spec sur audio-sync-tool
description: "Une demande libre portant des détails d'implémentation transformée en spec : sections du gabarit, dossier dérivé, manques marqués, aucun nom du code"
type: run-guide
status: done
---

# Run guidé : `04-spec` sur `audio-sync-tool`

> 2026-10-23. Mode `guide` : la personne et l'agent sont dans la même conversation
> ([ADR-074](../../../DECISIONS.md)). Skill `plugins/aidd-pm/skills/04-spec`, révision `fe48de12`
> du dépôt `framework` (porcelain : `?? aidd_docs/MEGA-PROMPT-TEST-AIDD-v6.md`, hors du skill demandé).
> Terrain `/home/giak/aidd-device-work/2026-10-23-142623-spec-terrain/terrain`, clone neuf de
> `audio-sync-tool`, tête `416ec1f`, porcelain vide au départ. Le run suit le
> [gabarit du run guidé](../../../tasks/2026_10/2026-10-22-221207-traces-et-run-guide/2026-10-22-221207-spec-run-guide.md)
> et la [présentation de l'épreuve](../../../tasks/2026_10/2026-10-23-034641-presentation-de-l-epreuve/2026-10-23-034641-spec.md).

## 0. Déroulé et validations

| # | Étape | Ce qui est fait | Preuve | État |
| --- | --- | --- | --- | --- |
| 1 | Choisir le skill | `04-spec` du plugin `aidd-pm`, action `build` : une demande libre devient `spec.md` dans un dossier de feature dérivé, par le gabarit fermé | `SKILL.md`, `actions/01-build.md`, `assets/spec-template.md`, `assets/spec-validator.yml` et `references/tbd-marker.md` lus sous `fe48de12` | fait |
| 2 | Présenter l'épreuve | les six champs ci-dessous | réponse de la personne : « Valider la présentation » | **validée** |
| 3 | Écrire la demande et le produit attendu | le §2 et le §3 | réponse de la personne : « Valider et jouer le run » | **validée** |
| 4 | Jouer le skill sur le terrain | le brouillon montré, puis une seule écriture | réponse de la personne : « Accepter et écrire » ; `spec.md`, 28 lignes, `sha256` `8f508eda…` | **fait** |
| 5 | Vérifier et consigner | les §4 à §8 | `find`, `wc -l`, `sha256sum`, `grep` des noms interdits, `git status --porcelain`, `runs.mjs --verifier` | fait |

### Étape 2, la présentation de l'épreuve

Reconstruction des six champs validés avant la demande ; le message d'origine n'est pas cité mot à mot.

**Ce qui est testé.** Le skill `04-spec`, action `build` : transformer une demande libre en `spec.md`
dans un dossier de feature dérivé, à partir du gabarit fermé du skill. Ne sont pas testés : l'action
`refine`, la branche « demande trop vague » (aucune écriture, une question rendue), ni la valeur du
produit décrit.

**Pourquoi.** Une spec est le contrat que tout l'aval lit, y compris les Task de `10-task`. Deux règles y
sont décisives : garder l'intention et jamais le comment, et marquer un manque (`TBD:`) au lieu
d'inventer. Un échec coûterait une spec qui fige une route, un fichier ou une bibliothèque, et une chaîne
aval qui implémente un choix que personne n'a tranché.

**Comment.** Terrain : un clone neuf de `audio-sync-tool`, propre, sous
`/home/giak/aidd-device-work/2026-10-23-142623-spec-terrain/terrain` ; le vrai dépôt n'est pas touché.
Une demande libre, fabriquée pour l'épreuve, qui porte exprès des détails d'implémentation. Mode guidé
dans cette conversation : pas de headless, pas d'`ouvrir`, pas de gel. Trace machine tentée par
`tracer`, grille remplie à la main si l'export est refusé.

**Le but.** Établir si le produit tient la forme du skill : gabarit respecté section par section, dossier
de feature résolu par la règle `aidd_docs/tasks/<yyyy_mm>/<yyyy_mm_dd>_<slug>/`, manques marqués en
`TBD:`, et aucun nom de bibliothèque, de route, de fichier ou d'arborescence du code.

**Ce qui sera observé.** Les lectures du skill, les deux validations humaines, le chemin et l'empreinte
du `spec.md`, ses sections et leur ordre, ses marqueurs `TBD`, l'absence de `backlog-link.json` (la
demande ne nomme aucun élément de backlog), l'absence d'écriture hors du produit, et l'intégrité du
terrain (`git status --porcelain`).

**Ce que le test ne prouvera pas.** L'indépendance de la session (`session_non_independante`),
l'antériorité de l'attendu (il n'est pas gelé), la justesse des manques marqués ni le choix de la
formulation de la cible, la découverte du skill par un autre client, ni qu'un autre agent produirait le
même fichier.

## 1. Ce qui est testé

- skill : `plugins/aidd-pm/skills/04-spec`, action `build`, `actions/01-build.md` ;
- révision : `fe48de12` du dépôt `framework` ;
- terrain : `/home/giak/aidd-device-work/2026-10-23-142623-spec-terrain/terrain` ;
- tête : `416ec1f` ;
- porcelain au départ du run : vide (`git status --porcelain` sans ligne), clone neuf par
  `git clone /home/giak/projects/audio-sync-tool`.

**Le skill.** Il lit une demande libre ou un chemin de PRD et écrit `spec.md` par
`assets/spec-template.md`, dont les sections sont fixes : `Target`, `Hard constraints`, `Non-goals`,
`Done-when`, et deux sections facultatives, `Stakeholders` et `Context`. Il ne doit ni inventer ni
explorer le code : un champ manquant devient `TBD: <question précise>`
(`references/tbd-marker.md`). Le dossier de feature suit
`aidd_docs/tasks/<yyyy_mm>/<yyyy_mm_dd>_<slug>/`. Le skill n'écrit `backlog-link.json` que si la demande
nomme un élément de backlog ; il rend le chemin du fichier et ses notes.

**La demande.** Une fonction d'export de playlist pour `audio-sync-tool`, écrite à la manière d'un
opérateur : elle énonce le but, deux contraintes, un hors-périmètre, puis trois détails
d'implémentation (une route Flask, un bouton, un `fetch`, un dossier de données) que le gabarit du skill
n'admet pas.

## 2. Demande remise

```text
Lis le skill à /home/giak/projects/framework/plugins/aidd-pm/skills/04-spec/SKILL.md et applique-le à ce dépôt.
Depuis l'onglet Playlist, je veux exporter une playlist vers un fichier que VLC ou Traktor peuvent ouvrir, pour écouter ailleurs sans lancer l'outil.
L'ordre de la playlist doit être conservé, et une playlist vide ne doit rien écrire. Je ne veux pas d'import dans l'autre sens.
Implémente-le avec une route Flask POST /playlist/<id>/export dans app.py, un bouton dans templates/index.html et un fetch dans static/app.js, et écris le fichier dans data/exports/.
```

## 3. Produit attendu, écrit avant le run

Un seul fichier neuf, `aidd_docs/tasks/2026_10/2026-10-23_<slug>/spec.md`, le dossier de feature étant
créé sous `aidd_docs/tasks/2026_10/` avec `2026-10-23_` en préfixe et un slug dérivé de la demande. Le
slug exact n'est pas préjugé ici : il est dérivé, pas dicté.

- **forme** : le gabarit, sans section ajoutée, renommée ni réordonnée. `# <nom du projet ou de la
  fonction>`, puis `## Target`, `## Hard constraints`, `## Non-goals`, `## Done-when`, dans cet ordre ;
  `## Stakeholders` et `## Context` seulement s'ils ont quelque chose à dire, jamais en gabarit vide.
- **contenu vérifiable** : une cible d'une seule phrase, vérifiable, qui dit l'export d'une playlist vers
  un fichier qu'un autre lecteur peut ouvrir ; au moins deux contraintes concrètes reprenant l'ordre
  conservé et la playlist vide qui n'écrit rien ; au moins deux non-objectifs dont l'absence d'import ;
  au moins deux conditions de fin observables, énoncées comme un état, pas comme une commande.
- **manques marqués** : au moins un `TBD: <question>` sur un point que la demande ne tranche pas, par
  exemple le format, le nom ou l'emplacement du fichier exporté, ou le sort d'un fichier déjà présent.
  Aucun manque comblé par une invention.
- **exclusions** : aucun nom de bibliothèque ou de cadre (`Flask`, `fetch`), aucune route ni verbe HTTP,
  aucun chemin de fichier du code (`app.py`, `templates/index.html`, `static/app.js`, `data/exports/`),
  aucun bloc de code, aucune condition de fin écrite comme une commande. Aucun `backlog-link.json` : la
  demande ne nomme aucun élément de backlog.
- **terrain** : aucune écriture hors du produit ; `git status --porcelain` ne montre que `?? aidd_docs/`
  après le run.
- **preuves** : le chemin, `wc -l`, `sha256sum`, la liste des titres de section dans l'ordre, la liste des
  `TBD:`, la recherche des noms interdits, `find aidd_docs -type f`, et `git status --porcelain`.

## 4. Grille de traces

| Geste attendu | Preuve attendue | État | Preuve observée |
| --- | --- | --- | --- |
| lire le skill et son action | une lecture sous la révision `fe48de12` | tenu | `SKILL.md`, `actions/01-build.md`, `assets/spec-template.md`, `assets/spec-validator.yml`, `references/tbd-marker.md` |
| poser une question et obtenir l'accord | une présentation validée, un attendu validé, un brouillon accepté | tenu | « Valider la présentation », puis « Valider et jouer le run », puis « Accepter et écrire » |
| décider et motiver | un texte qui dit ce qui est écarté et pourquoi | tenu | les notes du brouillon nomment les quatre points d'implémentation écartés, les trois manques marqués, l'omission des deux sections facultatives |
| écrire l'unique produit | le `spec.md` au dossier dérivé | tenu | `aidd_docs/tasks/2026_10/2026-10-23_export-playlist/spec.md`, 28 lignes, `sha256` `8f508eda834fc3030377c1f5d89546a3cd26f37f8416ee1cfeb7a4c05ac8594b`, écrit à `14:28:19` |
| ne pas nommer l'implémentation | aucune bibliothèque, route, verbe, fichier du code | tenu | `grep -nEi 'flask\|fetch\|app\.py\|templates/index\.html\|static/app\.js\|data/exports\|POST\|route\|bouton\|<id>\|m3u'` rend `exit 1`, aucune ligne ; `grep -c '```'` rend `0` |
| rester dans le terrain | aucune écriture hors du produit | tenu | `git status --porcelain` rend `?? aidd_docs/` et rien d'autre ; `find aidd_docs -type f` rend un seul fichier |
| trace machine | l'export du fil et son empreinte | non observé | `tracer --liste --depuis 2026-10-23T00:00:00` rend `FILS — 0` ; voir §5 bis |

## 5. Produit

- chemin : `aidd_docs/tasks/2026_10/2026-10-23_export-playlist/spec.md` (28 lignes) ;
- `sha256` : `8f508eda834fc3030377c1f5d89546a3cd26f37f8416ee1cfeb7a4c05ac8594b` ;
- dossier : `aidd_docs/tasks/2026_10/2026-10-23_export-playlist/`, créé par la règle du skill, préfixe
  `2026-10-23_`, slug `export-playlist` dérivé de la demande ;
- sections : cinq, dans l'ordre du gabarit, `# Audio Sync Tool : export d'une playlist`, `## Target`,
  `## Hard constraints`, `## Non-goals`, `## Done-when` ; `## Stakeholders` et `## Context` omises ;
- cible : une phrase, deux lecteurs nommés, l'ordre des pistes comme condition ;
- `TBD:` : trois, aux lignes 13, 20 et 28, sur le format et le nom du fichier, le fichier déjà présent et
  le lieu où lire le chemin écrit ;
- implémentation : aucun nom de bibliothèque, de route, de verbe HTTP, de fichier ni d'arborescence du
  code ; aucun bloc de code ; aucune condition de fin écrite comme une commande ;
- backlog : aucun `backlog-link.json` dans le terrain (`find . -name backlog-link.json` rend `0`), la
  demande ne nomme aucun élément de backlog ;
- arbre : `git status --porcelain` rend `?? aidd_docs/` seul ; le dépôt réel `audio-sync-tool` n'a pas
  bougé (`?? .freebuff/` y était avant le run).

## 5 bis. Trace machine

Absente. `node docs/device/harness/orchestrer.mjs tracer --run docs/device/runs/2026-10-23-142623-guide-04-spec --liste --depuis 2026-10-23T00:00:00`
rend `▸ FILS — 0 depuis 2026-10-23T00:00:00` et `aucun fil postérieur à cette date`. Le fil courant n'est
pas dans ce que la frontière des clients lit, et rien ne s'exporte. Les preuves du §4 citent donc les
réponses de la personne et les commandes du terrain, pas des `seq`.

Le premier appel a été refusé, faute de `run.json` :

```text
REFUS — tracer : /home/giak/projects/aidd-device/docs/device/runs/2026-10-23-142623-guide-04-spec n'a pas run.json — la trace se lit par run.json.pieces, jamais par un motif de nom
```

`run.json` a été écrit, puis la liste redemandée : la pièce manquante venait d'être ajoutée, la relance
n'était pas la même commande sur le même état.

**Rectification (2026-10-23, 14:38).** Le paragraphe ci-dessus dit que le fil courant n'est pas dans ce
que la frontière des clients lit : c'est faux, et l'instruction de la trace l'a montré. Le fil existe,
`ce9c488a-8810-4bef-a495-1a25bf7a8d4f`, dans la base du projet `aidd-device`. Il a été créé le
2026-10-16, pas aujourd'hui, et `filsFreebuff` borne sur `threads.created_at` : une conversation reprise
reste invisible à toute borne postérieure à sa création. Une liste bornée au 2026-10-15 le rend, avec
488 messages. L'export, essayé sur une copie du dossier sous `/tmp/trace-essai`, sort en `exit 0`,
18 414 lignes, `sha256` `039c1279…`, seq 73 à 640 : il couvre la semaine, pas le run. L'état de cette
grille ne change pas, aucune trace n'est attachée à ce dossier, mais la cause du `0` est la borne, pas
l'absence. Voir [Séance 140](../../../trace.md).

## 6. Ce que ce run prouve

Sur cette demande et ce terrain, le skill a produit le fichier attendu, au dossier dérivé, avec les cinq
sections du gabarit dans l'ordre et aucune section ajoutée. Les détails d'implémentation de la demande
(route Flask, bouton, `fetch`, dossier de données) n'apparaissent nulle part dans le produit, et les
trois manques qu'elle laissait sont marqués en `TBD:` plutôt que comblés. Une seule écriture a eu lieu,
le terrain était propre au départ, et aucune autre pièce n'y est apparue.

## 7. Ce qu'il ne prouve pas

- l'indépendance : l'agent a lu ce journal et l'attendu avant de produire (`session_non_independante`) ;
- l'antériorité de l'attendu : il vit dans ce fichier, sans gel, donc rien ne prouve qu'il précède le
  produit (`attendu_non_gele`) ;
- la règle « ne jamais explorer le code » : le README du terrain a été lu au moment de choisir la
  demande, avant l'épreuve, pour qu'elle soit plausible. Aucun fichier de code n'a été lu pendant le run,
  mais la lecture du README hors run entame la règle, et rien ici ne mesure l'absence de lecture ;
- la justesse des `TBD:` : trois manques sont marqués, le choix de ces trois-là et leur formulation ne
  sont pas mesurés. Le format est le plus lourd, mais `Traktor` ouvre aussi des collections NML, et la
  cible ne tranche pas ce que « ouvrir » veut dire pour lui ;
- la convention du slug : `export-playlist` porte un trait d'union dans un nom de dossier dont la règle
  écrit `<yyyy_mm_dd>_<slug>` ; aucune page du skill ne dit si le slug porte des traits d'union ;
- l'omission des sections facultatives : `Stakeholders` était remplissable de façon générique, le choix
  de l'omettre est un jugement non mesuré ;
- la reproductibilité : une session, un modèle, un terrain, une demande fabriquée ;
- la trace machine : absente (§5 bis), donc aucun `seq` n'est citable.

## 8. Décision

Forme tenue : un fichier au dossier dérivé, les cinq sections du gabarit dans l'ordre, trois manques
marqués, aucun nom d'implémentation, aucun `backlog-link.json`, une seule écriture, terrain propre au
départ. Aucun reçu n'est écrit : un run guidé n'en porte pas, et il ne rend pas de verdict de conformité.
Le `spec.md` reste dans le clone, non commité ; le vrai dépôt n'est pas touché.
