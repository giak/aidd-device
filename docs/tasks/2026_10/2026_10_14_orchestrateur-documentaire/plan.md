---
name: Construire l'orchestrateur documentaire
description: Les étapes de mise en place, leur état, et ce que chacune doit produire
type: plan
status: done
---

# Plan — orchestrateur documentaire

La spec validée par le relecteur humain est dans [spec.md](spec.md). Ce plan la met en œuvre.

| Étape | Ce qu'elle produit | État |
| --- | --- | --- |
| 1 | `scripts/docs-index.mjs`, sans dépendance, qui lit le frontmatter et dérive les trois fichiers | fait |
| 2 | Le squelette : `docs/brainstorm/`, `docs/tasks/<mois>/<date>_<slug>/` | fait |
| 3 | Les trois fichiers d'état générés | fait |
| 4 | Les critères d'acceptation de la spec, joués | fait, voir [run.md](run.md) |
| 5 | Le crochet `.githooks/pre-commit`, qui refuse un commit dont le tableau de bord est périmé | fait, voir [run.md](run.md) |
| 6 | Le premier commit, qui donne leurs dates de git aux documents | fait, `9d3ee04` |

## Décision prise en cours de route, la première

La première version du générateur convergeait en deux exécutions : les trois fichiers n'entraient
dans l'inventaire qu'à partir du run qui les créait, donc le deuxième run les redécrivait. Corrigé à
la cause — les trois documents générés font partie du manifeste par construction et ne sont jamais
relus du disque — et non en acceptant un « il faut le lancer deux fois ». Le détail est dans
[run.md](run.md).

## Décision prise en cours de route, la seconde

Le commit qui a donné leurs dates aux documents a révélé une auto-référence : les fichiers d'état
qui affichent une date affichaient la leur, donc le commit qui les enregistrait la changeait, et ils
étaient périmés au sortir de chaque commit. Corrigé à la cause — les trois fichiers générés portent
la date de leur **premier** commit, les documents écrits celle de leur dernier. Mesures dans
[run.md](run.md), raison et limite dans [spec.md](spec.md).

## Ce que ce plan ne fait pas

Aucune CI n'appelle le générateur : seul le crochet `.githooks/pre-commit` le fait, et seulement
s'il est installé dans le clone. Un commit passé avec `--no-verify`, ou depuis un clone non armé,
laisse `dashboard.md` dériver jusqu'à la prochaine exécution manuelle.
