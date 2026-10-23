---
name: Demande — 2026-10-22-211800-task-config-manquante
description: Le cas fabriqué pour plugins/aidd-pm/skills/10-task/SKILL.md : deux origines copiées sous la racine déclarée, une demande remplie, budget de 3 échange(s), produit exact sous aidd_docs/backlog/tasks/, tableau non requis, pause requise
type: case-request
status: ready
---

# Demande — 2026-10-22-211800-task-config-manquante

## 1. Identifiant

`2026-10-22-211800-task-config-manquante`

## 2. La révision sous test (`framework-origin`)

`origine/framework`, copie de `/home/giak/aidd-src-20261022-2115/framework` (tête `fe48de12`) ; `framework-origin` est son clone détaché, `origin` pointant le chemin local.

## 3. Le terrain (`terrain`)

`origine/terrain`, copie de `/home/giak/aidd-src-20261022-2115/terrain` (tête `416ec1f`) ; `terrain` est son clone détaché — c'est là que la session écrit.

## 4. Répertoire de travail

`$RACINE/2026-10-22-211800-task-config-manquante/` — la session travaille dans `terrain/` et lit `framework-origin/` ; hors des quatre arbres, `$RACINE` déclarée une seule fois, au gel.

## 5. Le texte remis à la session, verbatim

Entre les deux lignes de garde, et rien d'autre :
```text
<<<DEMANDE
Read the skill at $RACINE/2026-10-22-211800-task-config-manquante/framework-origin/plugins/aidd-pm/skills/10-task/SKILL.md and use it on this repository.
Ce dépôt est audio-sync-tool, l'outil local de synchronisation musicale décrit par son README. Crée une Task interne pour ajouter un contrôle de démarrage qui échoue clairement quand `data/config.json` manque, sans implémenter ce contrôle. Montre d'abord le brouillon complet de la Task et attends mon accord sans avoir écrit un seul fichier. Après accord, écris la Task sous `aidd_docs/backlog/tasks/refuser-config-manquante.md`, et rien d'autre.
>>>DEMANDE
```

## 6. Ce qu'elle doit produire

Le produit exact est `terrain/aidd_docs/backlog/tasks/refuser-config-manquante.md`, et rien d'autre sous `terrain/`.

Ce fichier porte `type: task`, `status: proposed`, un titre `# Task: ...`, puis les sections `Outcome`, `Scope` avec `Includes` et `Excludes`, `Done When`, et `Completion Evidence`. Il ne porte pas `Cancellation`, la Task n'étant pas annulée. Il ne contient ni plan de livraison ni code.

Le produit doit se suffire : ce que la session cite comme preuve est dans le fichier produit, ou sous `terrain/.scratch/`, collecté en annexe ; un chemin volatil n'est pas une preuve (ADR-067).

## 7. Ce qui lui est interdit

Écrire dans `framework-origin/` et dans `origine/` ; lire sous `docs/device/CASES/` ; écrire hors de `terrain/aidd_docs` et de `terrain/.scratch/` (le scratch est collecté en annexe, jamais compté comme produit) ; sortir du répertoire de travail, ni dans le reste de `$HOME` ni dans `/tmp` ; toute écriture git, tout appel réseau ; écrire les fichiers de contexte d'outils IA.

## 8. Budget, et les deux textes figés de l'opérateur

**3 échange(s) au plus** ; les deux réponses se figent **avant** le run.
```text
<<<REPONSE_TABLEAU
Continue : écris la Task sous aidd_docs/backlog/tasks/refuser-config-manquante.md, sans rien demander d'autre.
>>>REPONSE_TABLEAU
<<<REPONSE_AUTRE
Answer from the repository. If it cannot be read there, say so and stop.
>>>REPONSE_AUTRE
```
