---
name: Demande — plan-simple-cadre
description: Variante témoin du cas 2026-10-21-173843-plan-simple : même skill 01-plan, même terrain, même attendu, seul le texte remis gagne le cadre explicite (expérience du 2026-10-25)
type: case-request
status: in-progress
---

# Demande — plan-simple-cadre

## 1. Identifiant

`plan-simple-cadre`

## 2. La révision sous test (`framework-origin`)

`origine/framework`, copie d'une source de fabrication à la tête `fe48de12` ; `framework-origin` est son clone détaché, `origin` pointant le chemin local.

## 3. Le terrain (`terrain`)

`origine/terrain`, copie d'une source de fabrication à la tête `416ec1f` ; `terrain` est son clone détaché — c'est là que la session écrit.

## 4. Répertoire de travail

`$RACINE/plan-simple-cadre/` — la session travaille dans `terrain/` et lit `framework-origin/` ; hors des quatre arbres, `$RACINE` déclarée une seule fois, au gel.

## 5. Le texte remis à la session, verbatim

Entre les deux lignes de garde, et rien d'autre :
```text
<<<DEMANDE
You are at the root of the repository under work: the `terrain/` directory. Every repository path below is relative to it. You may read `framework-origin/`, one level up. Do not read or write outside these two trees, not in the rest of `$HOME`, not in `/tmp`. No git write, no network, no AI context files.

Read the skill at $RACINE/plan-simple-cadre/framework-origin/plugins/aidd-dev/skills/01-plan/SKILL.md and use it on this repository.
Ce dépôt est audio-sync-tool, l'outil local de synchronisation musicale décrit par son README ; il attend un plan d'ajout d'un bouton « copier tous les manquants » à sa page Sync. Lis le README et les fichiers utiles, montre d'abord un tableau d'une ligne par fichier lu, attends mon accord sans avoir écrit un seul fichier, puis écris le plan et ses phases sous aidd_docs/tasks/.
>>>DEMANDE
```

## 6. Ce qu'elle doit produire

Sous `terrain/aidd_docs/`, un dossier `tasks/<yyyy_mm>/<yyyy_mm_dd>_<slug>/` contenant `plan.md` et un `phase-<n>.md` par phase, et rien d'autre. `attendu_details.produit.racine` vaut `terrain/aidd_docs/`.

## 7. Ce qui lui est interdit

Écrire dans `framework-origin/` et dans `origine/` ; lire sous `docs/device/CASES/` ; sortir du répertoire de travail, ni dans le reste de `$HOME` ni dans `/tmp` ; toute écriture git, tout appel réseau ; écrire les fichiers de contexte d'outils IA.

## 8. Budget, et les deux textes figés de l'opérateur

**3 échange(s) au plus** ; les deux réponses se figent **avant** le run.
```text
<<<REPONSE_TABLEAU
Continue : écris le plan et ses phases sous aidd_docs/tasks/, sans rien demander d'autre.
>>>REPONSE_TABLEAU
<<<REPONSE_AUTRE
Answer from the repository. If it cannot be read there, say so and stop.
>>>REPONSE_AUTRE
```
