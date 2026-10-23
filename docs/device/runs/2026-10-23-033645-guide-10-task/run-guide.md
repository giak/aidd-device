---
name: Déroulé du test de `10-task`, étape par étape
description: "Le journal de conduite du test guidé du skill `10-task` : chaque étape, son choix, sa preuve et sa validation, de la sélection du skill au run dans un vrai projet"
type: run-guide
status: done
---

# Déroulé du test de `10-task`

> 2026-10-23, Séance 126. Ce fichier suit le gabarit du run guidé
> ([spec du 2026-10-22 22:12](../../../tasks/2026_10/2026-10-22-221207-traces-et-run-guide/2026-10-22-221207-spec-run-guide.md)),
> avec une section **0** de plus : le déroulé et ses validations. Il se remplit au fur et à mesure ; une
> étape n'est close que par une validation de la personne, et une validation refusée rouvre l'étape au
> lieu d'ouvrir la suivante.

## 0. Déroulé et validations

| # | Étape | Ce qui est fait | Preuve | État |
| --- | --- | --- | --- | --- |
| 1 | Choisir le skill | `10-task` du plugin `aidd-pm` : il produit une Task de backlog, savoir-faire borné et vérifiable, sans code | `SKILL.md` lu (235 lignes pour le skill entier, `wc -l`) | fait |
| 2 | Présenter l'épreuve | les six champs ci-dessous, puis le §1 comme référence | [spec de l'étape](../../../tasks/2026_10/2026-10-23-034641-presentation-de-l-epreuve/2026-10-23-034641-spec.md) ; `SKILL.md`, trois `actions/`, six `references/` et `assets/task-template.md` lus | **validée le 2026-10-23 à 03:48** |
| 3 | Ce que la Task doit produire pour un vrai projet | le §2 (demande) et le §3 (produit attendu) : projet, Task visée, chemin et contenu | `audio-sync-tool` à `416ec1f` ; `app.py` sans contrôle de configuration (`grep` vide) | **validée le 2026-10-23 à 03:53** |
| 4 | Tester dans un vrai projet | le run guidé, puis les §4 à §8 du gabarit | clone `2026-10-23-035316-task-config-terrain`, tête `416ec1f`, porcelain `0` | **terminé le 2026-10-23 à 03:58** |

Rien n'est écrit dans un projet avant l'étape 4, et aucune écriture n'a lieu sans accord explicite.

### Étape 2, la présentation de l'épreuve

**Ce que tu vas tester.** Le skill `10-task`, joué sur un vrai projet : sa capacité à transformer une
demande bornée en une Task de backlog unique, correctement typée et apte, et à ne l'écrire qu'après ton
accord. Tu ne testes ni la Task que tu choisiras, ni le travail qu'elle décrit.

**Pourquoi.** Toute la chaîne aval part de la Task : une Task floue, dupliquée, mal typée ou écrite sans
accord contamine la spec, le dev et la vérification qui suivent. Le test doit donc montrer deux choses. Le
fond : la Task est bornée, vérifiable, non dupliquée, et porte ses conditions de fin et ses preuves. La
conduite : le brouillon est montré avant toute écriture, l'accord est demandé, une question est posée à la
fois, les autres types sont refusés, rien n'est écrit hors de la Task. Ce qui se joue : savoir si `10-task`
peut servir un vrai backlog sans relecture humaine systématique.

**Comment.** Un vrai projet, une demande réelle et bornée, le skill joué dans la conversation courante
([ADR-074](../../../DECISIONS.md)), sans headless. Le skill montre un brouillon complet, tu valides, il
écrit un seul fichier `aidd_docs/backlog/tasks/<slug>.md`. La conversation laisse une trace, et la grille du
gabarit juge les gestes. Aucun fichier du projet n'est touché avant l'étape 4.

**Le but.** Établir si le produit est conforme (`type: task`, `status: proposed`, `Outcome`, `Scope`,
`Done When`, `Completion Evidence`), si la Task est distincte et apte au sens de `readiness`, et si la
conduite tient. Le test ne juge pas la valeur du travail décrit.

**Ce qui sera observé.** Les gestes de la conversation, le brouillon montré avant toute écriture, l'accord
explicite, le nombre de questions, le fichier écrit (chemin, frontmatter, sections, relations), l'absence
d'écriture hors Task, et les écarts.

**Ce que ce test ne prouvera pas.** La valeur du travail que la Task décrit, ni la qualité de son
implémentation future. Un seul modèle, une seule session, un seul projet : la session n'est pas
indépendante ([ADR-074](../../../DECISIONS.md)). Il ne dit rien non plus de la pertinence du backlog du
projet.

Cette présentation est la règle du protocole depuis le 2026-10-23
([spec](../../../tasks/2026_10/2026-10-23-034641-presentation-de-l-epreuve/2026-10-23-034641-spec.md)) : un champ manquant
vaut présentation non faite, et aucune demande n'est écrite avant ta validation.

**Validée le 2026-10-23 à 03:48.** L'étape 3 s'ouvre : le projet réel, puis la Task à produire.

## 1. Ce qui est testé

**Le skill.** `plugins/aidd-pm/skills/10-task` : `SKILL.md`, trois `actions/`, six `references/` et
`assets/task-template.md`, 235 lignes au total (`wc -l`). Sa description : « Produces or refines a backlog
Task for bounded delivery work without independent user value. Use when the user wants to create, link,
order, estimate, transition, or complete one. Not for User Stories, Spikes, Defects, or implementation. »

**L'intention.** Transformer une demande en **une** Task de livraison bornée, qui sert un objectif ou un
parent sans porter de valeur d'usage indépendante, et ne rien décider à la place de la personne.

**Le but.** Cadrer (`frame`), éprouver le type et l'aptitude (`review`), puis persister ou transitionner
(`finalize`). Une question à la fois ; le produit et les décisions de cycle de vie restent à la personne ;
aucune écriture sans accord explicite.

**Le produit du skill.** Un brouillon complet montré avant toute écriture, puis, sur accord, **un**
fichier Markdown : `aidd_docs/backlog/tasks/<slug>.md`, nom de fichier en kebab-case, frontmatter
`type: task` et `status: proposed`, titre `# Task: <delivery outcome>`, sections `Outcome`, `Scope`
(`Includes` / `Excludes`), `Done When`, `Completion Evidence`. `Cancellation` n'existe que pour une Task
annulée.

**Ce que la Task produite doit faire.** Elle engage un travail de livraison borné, qui sert un parent ou un
objectif et ne porte pas de valeur d'usage indépendante (`qualification`). Son `Outcome` est **un**
résultat livrable et vérifiable ; son `Scope` ferme les frontières, `Includes` et `Excludes` ; son
`Done When` liste des conditions observables, et son `Completion Evidence` les preuves produites après
coup. Elle est le bon de travail, pas le travail : le skill n'implémente pas et ne planifie pas, et la
Task ne contient ni plan d'exécution ni code.

**Comment la Task est évaluée.** Deux moments, deux mesures.

- **À sa formation**, par le skill : `frame` exige `type: task`, `status: proposed`, un `Outcome`, un
  `Scope` et des conditions de fin ; `review` exige les six critères de `readiness`, c'est-à-dire un
  résultat vérifiable, des frontières qui empêchent le travail caché, une fin prouvable, une propriété
  connue ou une intention standalone explicite, des relations liées ou absentes, et `work_kind` seulement
  si le projet l'utilise. Une Task peut rester `proposed` avec des trous ; l'aptitude ne se devine pas.
- **À sa livraison**, par ses propres critères : `Done When` et `Completion Evidence` sont les deux listes
  que la Task doit porter ; `status: done` ne s'écrit que si ces preuves passent, et `finalize` refuse un
  `done` dont les conditions ou les preuves sont vides.

Le skill ne note pas la valeur du travail : il vérifie la forme et l'aptitude de la Task. Ce qui prouve
que le travail est fait, c'est la `Completion Evidence` que la Task a nommée d'avance.

**Les données que le produit doit générer.**

- le chemin et le slug, en kebab-case, sous `aidd_docs/backlog/tasks/` ;
- le frontmatter : `type: task`, `status: proposed`, puis `ready`, `in-progress`, `done` ou `cancelled`
  selon le cycle de vie ; aucun champ optionnel ne s'ajoute s'il n'est pas connu et supporté par le projet ;
- les sections non vides : un résultat livrable et vérifiable (`Outcome`), des frontières (`Scope`), des
  conditions de fin observables (`Done When`), les preuves produites après coup (`Completion Evidence`) ;
- les relations seulement si elles sont connues : `source`, `parent`, `depends_on`, `related_to`,
  `supersedes`, `order`, `estimate`, `work_kind` ; chaque relation une fois, chez son propriétaire,
  jamais son inverse (`children`, `blocked_by`, `superseded_by` se dérivent) ;
- rien d'autre : une seule Task, aucun code, aucune spec, aucun doublon quand une Task équivalente existe.

**Ce qu'il ne fait pas.** Il n'implémente pas, ne planifie pas, et n'écrit ni Story, ni Spike, ni Defect :
il nomme la capacité voisine et s'arrête (`handoffs`). Il ne devine pas l'aptitude : une Task peut rester
`proposed` avec des trous. Il ne touche pas au reste du dépôt.

## 2. Demande remise

**Le terrain.** `audio-sync-tool` (`416ec1f`), projet réel de synchronisation musicale, n'a **pas** d'arbre
`aidd_docs/` : `ls aidd_docs/backlog/tasks/` rend `0` fichier et `git status` ne montre que `?? .freebuff/`.
Le run se joue sur un clone détaché de `416ec1f` sous `/home/giak/aidd-device-work/`, comme le run du
22:12 ; le vrai dépôt n'est pas touché, et la Task créera l'arbre dans le clone. Clone mesuré :
`/home/giak/aidd-device-work/2026-10-23-035316-task-config-terrain/terrain`, tête `416ec1f`, porcelain
`0`, `aidd_docs` absent, `data/` absent (ignoré par git).

**La demande**, telle qu'elle sera suivie :

```text
Read the skill at /home/giak/projects/framework/plugins/aidd-pm/skills/10-task/SKILL.md and use it on this repository.
Ce dépôt est audio-sync-tool. Crée une Task interne pour ajouter un contrôle de démarrage qui échoue clairement quand `data/config.json` manque, sans implémenter ce contrôle. Montre d'abord le brouillon complet de la Task et attends mon accord sans avoir écrit un seul fichier. Après accord, écris la Task sous `aidd_docs/backlog/tasks/refuser-config-manquante.md`, et rien d'autre.
```

C'est la demande du run du 22:12, rejouée sur le même projet : elle rend les deux runs comparables. Le
dépôt n'ayant pas de Task équivalente, le skill ne peut pas la refuser comme doublon.

## 3. Produit attendu, écrit avant le run

Un seul fichier, `aidd_docs/backlog/tasks/refuser-config-manquante.md`, dans le clone :

- frontmatter `type: task`, `status: proposed`, aucun champ optionnel que le projet ne supporte pas ;
- `Outcome` : au démarrage, l'application refuse clairement quand `data/config.json` manque, avec un
  message explicite et un code de sortie non nul ;
- `Scope` : inclut le contrôle de démarrage, son message, son code de sortie et les tests des deux cas ;
  exclut l'interface, les autres fichiers de `data/` et la création d'un `config.json` par défaut ;
- `Done When` : fichier absent, message clair et sortie non nulle ; fichier présent, démarrage inchangé ;
  les deux cas sont couverts par un test ;
- `Completion Evidence` : la sortie des deux cas et le résultat des tests ;
- rien d'autre : aucun code, aucune modification du dépôt, aucun second fichier.

**Validée le 2026-10-23 à 03:53.** Le run s'ouvre sur le clone, et le brouillon de la Task est montré avant
la première écriture.

## 4. Grille de traces

La conversation courante n'est pas exportée par `tracer` : la grille cite donc les messages et les
réponses de la personne, pas des `seq`. La trace machine reste absente, et c'est une limite, pas un geste
tenu.

| Geste attendu | Observé | État |
| --- | --- | --- |
| brouillon complet montré avant toute écriture | la Task entière est dans le message de 03:54, avant le fichier | tenu |
| accord explicite avant écriture | question de 03:55, réponse « Approuver et écrire la Task » | tenu |
| une seule écriture, au chemin demandé | `aidd_docs/backlog/tasks/refuser-config-manquante.md`, né à 03:56:39 | tenu |
| aucun autre fichier | `git status --porcelain` => `?? aidd_docs/` | tenu |
| frontmatter conforme | `type: task`, `status: proposed` | tenu |
| quatre sections non vides | `Outcome`, `Scope`, `Done When`, `Completion Evidence` | tenu |
| aucun champ optionnel non supporté | aucun `parent`, `estimate` ou `work_kind` | tenu |
| pas de doublon | aucune Task dans le dépôt avant ce run | tenu |
| une question à la fois | aucune question bloquante ; les trois questions posées sont les validations du protocole | tenu |
| qualification | travail de livraison borné, sans valeur d'usage indépendante | tenu |
| readiness | outcome, scope, done, ownership standalone explicite, relations absentes, classification absente | tenu |
| trace machine | aucune : le fil n'est pas exporté | limite |

## 5. Produit

Un fichier, dans le clone : `aidd_docs/backlog/tasks/refuser-config-manquante.md`, `sha256`
`818db266102b8c13a1a0a27a1df56dd3d67d81e36a79ea18873349edc5fffc6f`, 4 sections, frontmatter
`type: task` et `status: proposed`. Le dépôt porte `?? aidd_docs/` et rien d'autre.

**Décisions et hypothèses du brouillon.** Les tests entrent dans `Scope` et `Done When` alors que la
demande ne les nomme pas : le projet exige zéro régression, et sans test la fin n'est pas prouvable. Le
code de sortie est dit « non nul » et non `1` : la demande ne fixe pas sa valeur. Le contrôle précède
l'ouverture du port, parce que « au démarrage » n'a de sens que là.

## 6. Ce que ce run prouve

Sur ce projet et cette demande, le skill a produit une Task conforme au §3 : un seul fichier, au chemin
demandé, `type: task`, `status: proposed`, quatre sections non vides, aucun champ optionnel, aucune
écriture hors de la Task, et aucune écriture avant l'accord explicite.

## 7. Ce qu'il ne prouve pas

Il ne prouve pas que le travail décrit est fait, ni qu'il est faisable sans casser la suite : aucun code
n'a été écrit. Il ne prouve pas la reproductibilité : une session, un modèle, un projet. Le conducteur
avait lu les références du skill avant le run, donc la découverte n'est pas mesurée. La trace machine
manque, et les tests ajoutés au `Scope` sont une inférence, pas une clause de la demande.

## 8. Décision

Run clos le 2026-10-23 à 03:58. La Task écrite est conforme au §3 : un fichier, au chemin demandé, bon
frontmatter, quatre sections non vides, aucun champ optionnel, aucune écriture hors Task, aucune écriture
avant l'accord. Aucun écart de conduite. Le produit reste dans le clone, non commité ; le vrai dépôt n'est
pas touché. Aucun reçu n'est écrit : le run guidé n'en porte pas.
