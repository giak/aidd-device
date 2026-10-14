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
| 4 | Les cinq critères d'acceptation de la spec, joués | fait, voir [run.md](run.md) |
| 5 | Le crochet `.githooks/pre-commit`, qui refuse un commit dont le tableau de bord est périmé | fait, voir [run.md](run.md) |
| 6 | Le premier commit, qui donnera leurs dates de git aux documents | à faire par le relecteur humain |

## Décision prise en cours de route

La première version du générateur convergeait en deux exécutions : les trois fichiers n'entraient
dans l'inventaire qu'à partir du run qui les créait, donc le deuxième run les redécrivait. Corrigé à
la cause — les trois documents générés font partie du manifeste par construction et ne sont jamais
relus du disque — et non en acceptant un « il faut le lancer deux fois ». Le détail est dans
[run.md](run.md).

## Ce que ce plan ne fait pas

Aucun crochet n'appelle le générateur automatiquement. Tant que rien ne l'appelle, les trois
fichiers ne sont à jour qu'après une exécution manuelle, et `dashboard.md` peut mentir entre deux
exécutions. C'est le premier candidat d'un `pre-commit`, et ce n'est pas décidé.
