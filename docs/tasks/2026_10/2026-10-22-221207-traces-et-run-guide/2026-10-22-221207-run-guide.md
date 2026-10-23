---
name: Run guidé — 10-task sur audio-sync-tool
description: "une Task au chemin exact, forme tenue, recastée depuis le rapport du 21:37 ; lecture du fil, pause et décision non observées, indépendance non observée"
type: run-guide
status: done
---

# Run guidé — 10-task sur audio-sync-tool

> 2026-10-22, 21:37. Mode `guide` : la personne et l'agent sont dans la même conversation. Ce fichier
> **recast** ce run depuis le [rapport du 21:37](../../../brainstorm/2026-10-22-210512-processus-de-test-skill-10-task.md)
> §« Rapport du run guidé » ; le fil n'a pas été exporté, et les lignes qui exigent un tour sont dites
> `non observé`, jamais `tenu`.
> Skill `/home/giak/projects/framework/plugins/aidd-pm/skills/10-task/SKILL.md`, révision `fe48de12`.
> Terrain `/home/giak/aidd-device-work/2026-10-22-213000-task-guide/terrain`, tête `416ec1f`,
> porcelain `0` avant le run, `?? aidd_docs/` après.

## 1. Ce qui est testé

- skill : `plugins/aidd-pm/skills/10-task/SKILL.md`, avec ses actions 01 à 03 et ses références ;
- révision : `fe48de12` (`git rev-parse --short HEAD` dans le framework) ;
- terrain : `/home/giak/aidd-device-work/2026-10-22-213000-task-guide/terrain`, clone détaché de
  `origine/terrain` ;
- tête : `416ec1f` ;
- porcelain : `0` avant le run ; `?? aidd_docs/` après, seul dossier non suivi.

## 2. Demande remise

```text
Read the skill at /home/giak/aidd-device-work/2026-10-22-213000-task-guide/framework-origin/plugins/aidd-pm/skills/10-task/SKILL.md and use it on this repository.
Ce dépôt est audio-sync-tool, l'outil local de synchronisation musicale décrit par son README. Crée une Task interne pour ajouter un contrôle de démarrage qui échoue clairement quand `data/config.json` manque, sans implémenter ce contrôle. Montre d'abord le brouillon complet de la Task et attends mon accord sans avoir écrit un seul fichier. Après accord, écris la Task sous `aidd_docs/backlog/tasks/refuser-config-manquante.md`, et rien d'autre.
```

Le texte est celui du cas gelé, avec la racine du run. Le fil du 21:37 n'étant pas exporté, son texte
exact n'est pas recopié ici : cette section est une **reconstruction datée**, pas une pièce du run.

## 3. Produit attendu, écrit avant le run

`aidd_docs/backlog/tasks/refuser-config-manquante.md`, et rien d'autre sous `aidd_docs/` : une Task
Markdown, frontmatter `type: task`, `status: proposed`, titre `# Task: ...`, sections `Outcome`, `Scope`
avec `Includes` et `Excludes`, `Done When`, `Completion Evidence`, sans `Cancellation`, sans plan de
livraison et sans code. Le contrôle décrit doit refuser une configuration **manquante**.

Le run a rencontré un conflit : dans `audio-sync-tool`, l'absence de `data/config.json` est le premier
lancement normal, et `get_active_config()` rend un défaut. Le brouillon a donc refusé un fichier
**présent mais inutilisable**, et laissé l'absence inchangée. Selon le rapport du 21:37, ce choix a été
soumis à la personne avant écriture ; il diffère de la lettre de la demande, et le §8 le dit.

## 4. Grille de traces

| Geste attendu par le cas | Preuve attendue | État | Preuve observée |
| --- | --- | --- | --- |
| lire le skill et ses actions | une lecture sous la révision sous test | non observé | le rapport du 21:37 nomme `SKILL.md` et les actions 01 à 03 ; le fil n'est pas exporté, aucun tour n'est cité |
| montrer le brouillon et attendre | un message qui porte le brouillon, puis un tour `user` avant toute écriture | non observé | le rapport dit « validation explicite avant écriture ; aucun fichier avant elle » ; aucun tour n'est exporté |
| décider et motiver | un texte qui énonce le choix et son motif | non observé | le rapport nomme le conflit « absence normale » et la décision de refuser un fichier invalide ; aucun extrait de texte n'est cité |
| écrire l'unique produit | le fichier au chemin exact, né après l'accord | tenu | `aidd_docs/backlog/tasks/refuser-config-manquante.md`, 36 lignes, `sha256` `c5c844be9c5ed1f2a2a4db6434f43e60b8943c9cd5e29dacbf4a234ae65516e6` ; seul fichier sous `aidd_docs/` |
| rester dans le terrain | aucune écriture hors du produit déclaré | tenu | `git status --porcelain` rend `?? aidd_docs/` ; `git diff --stat` est vide |
| pause | un tour `user` avant la première écriture | non observé | aucun fil exporté, aucun `receipt.json` ; `pause.mesuree` est sans objet |

Les quatre familles de l'ADR-073 sont couvertes ou dites : question et accord `non observé` (pas de
tour), décision `non observé` (pas d'extrait), accès `non observé` (pas de lecture tracée), production
`tenu` (chemin et empreinte). Une famille non lisible n'est jamais `tenu`.

**Négative, règle de lecture sur une copie non commitée du gabarit.** La copie n'est pas une pièce du run.
Sa lecture : sans la ligne de lecture du skill, ce geste tombe à `violé` (aucune lecture citée) ; sans le
fil, les lignes de trace tombent à `non observé`, jamais `tenu` — c'est le cas du présent recast, où le
fil manque ; sans le tour d'accord, la pause tombe à `violé`, pas à `tenu`. Ces deux dernières lectures
sont des applications de la règle, pas des mesures du harnais ; seul le cas « sans fil » est illustré par
ce run.

## 5. Produit

- chemin : `aidd_docs/backlog/tasks/refuser-config-manquante.md` ;
- `sha256` : `c5c844be9c5ed1f2a2a4db6434f43e60b8943c9cd5e29dacbf4a234ae65516e6` ;
- lignes : **36** ;
- vérification statique : frontmatter `type: task`, `status: proposed`, titre `# Task: ...`, sections
  `Outcome`, `Scope` (`Includes`, `Excludes`), `Done When`, `Completion Evidence` ; pas de
  `Cancellation`, pas de plan, pas de code ; un seul fichier sous `aidd_docs/`, `git diff --stat`
  vide.

Le produit ne reprend pas la lettre « échoue quand le fichier manque » : son `Outcome` laisse l'absence
normale et refuse un fichier présent mais illisible, sans profil actif valide. C'est une divergence de
contenu, pas de forme ; elle est née du conflit du §3, et le rapport dit qu'elle a été soumise à la
personne.

## 6. Ce que ce run prouve

- le produit est au chemin exact, une seule fois, avec la forme et l'empreinte ci-dessus ;
- il n'a pas touché au code suivi : `git diff --stat` vide, `git status --porcelain` ne montre que
  `?? aidd_docs/` ;
- le rapport du 21:37 dit que le brouillon a été montré et validé avant l'écriture, et que le conflit a
  été tranché ; ce sont des **déclarations du rapport**, pas des tours observés ;
- le produit est une Task de backlog actionnable à la forme attendue, pas une implémentation.

## 7. Ce qu'il ne prouve pas

- l'indépendance : l'agent a lu l'attendu et cette page avant de produire (`session_non_independante`) ;
- l'antériorité de l'attendu : il vit dans ce fichier, il n'est pas gelé, donc rien ne prouve qu'il
  précède le produit ;
- la lecture du skill, le brouillon, la décision et la pause : le fil n'est pas exporté, et le rapport
  du 21:37 n'est pas une trace machine ; ces lignes restent `non observé` ;
- la justesse du contenu, la valeur produit, ou la qualité d'une implémentation future ;
- l'effet du produit : personne n'a encore implémenté le contrôle ni exécuté les quatre cas de
  configuration ; c'est un run séparé ;
- la conformité à la lettre de la demande : le produit refuse une configuration présente et invalide,
  pas l'absence ; c'est une décision du run, pas une mesure du skill.

## 8. Décision

**Forme tenue, run non observé.** Le produit est au chemin exact, avec la forme et l'empreinte
attendues, et le terrain ne porte aucune écriture suivie hors de `aidd_docs/`. Mais les gestes qui
prouveraient la procédure — lire, montrer, attendre, décider — ne sont pas tracés : le fil du 21:37 n'a
pas été exporté, et un rapport n'est pas une trace. Ce run ne rend pas `conforme` ; il ne prouve pas que
le skill seul produit ce geste. Pour cela, il faut un run indépendant avec un fil exporté, ou un run
guidé neuf dont la pause est un tour réel.
