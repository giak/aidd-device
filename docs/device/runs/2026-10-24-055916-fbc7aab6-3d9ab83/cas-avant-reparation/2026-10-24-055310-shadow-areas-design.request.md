---
name: Demande — 2026-10-24-055310-shadow-areas-design
description: Le cas fabriqué pour plugins/aidd-refine/skills/03-shadow-areas/SKILL.md : scanner une spec de `cartes-de-visite` et écrire son rapport d'ombres à côté d'elle, sans toucher la source, budget de 1 échange
type: case-request
status: in-progress
---

# Demande — 2026-10-24-055310-shadow-areas-design

## 1. Identifiant

`2026-10-24-055310-shadow-areas-design`

## 2. La révision sous test (`framework-origin`)

`origine/framework`, copie de `$RACINE/2026-10-23-202002-framework` (tête `fe48de12`, elle-même clone de `/home/giak/projects/framework`) ; `framework-origin` est son clone détaché, `origin` pointant le chemin local.

## 3. Le terrain (`terrain`)

`origine/terrain`, copie de `/home/giak/projects/cartes-de-visite` (tête `6a74c46`) ; `terrain` est son clone détaché — c'est là que la session écrit.

## 4. Répertoire de travail

`$RACINE/2026-10-24-055310-shadow-areas-design/` — la session travaille dans `terrain/` et lit `framework-origin/` ; hors des quatre arbres, `$RACINE` déclarée une seule fois, au gel.

## 5. Le texte remis à la session, verbatim

Entre les deux lignes de garde, et rien d'autre :
```text
<<<DEMANDE
Read the skill at $RACINE/2026-10-24-055310-shadow-areas-design/framework-origin/plugins/aidd-refine/skills/03-shadow-areas/SKILL.md and use it on this repository.
This repository is `cartes-de-visite`, a static business-card project; the artifact to scan is `docs/superpowers/specs/2026-08-01-carte-visite-v2-design.md`.
Run the skill on that artifact, in the order its own actions prescribe, and write the report where its action 02 says; do not modify the source, do not write anywhere else, and do not ask me a question.
>>>DEMANDE
```

## 6. Ce qu'elle doit produire

`terrain/docs/superpowers/specs/2026-08-01-carte-visite-v2-design-shadow-report.md` : un fichier neuf, nommé en retirant la dernière extension de la source et en ajoutant `-shadow-report.md`, écrit à côté d'elle. Aucun autre fichier n'est produit, aucun fichier existant n'est modifié.

Le produit doit se suffire : ce que la session cite comme preuve est dans le fichier produit, ou sous `terrain/.scratch/`, collecté en annexe ; un chemin volatil n'est pas une preuve (ADR-067).

## 7. Ce qui lui est interdit

Écrire dans `framework-origin/` et dans `origine/` ; lire sous `docs/device/CASES/` ; écrire hors de `terrain/docs/superpowers/specs/` et de `terrain/.scratch/` (le scratch est collecté en annexe, jamais compté comme produit) ; modifier `docs/superpowers/specs/2026-08-01-carte-visite-v2-design.md` ou tout autre fichier existant du terrain ; sortir du répertoire de travail, ni dans le reste de `$HOME` ni dans `/tmp` ; toute écriture git, tout appel réseau ; écrire les fichiers de contexte d'outils IA.

## 8. Budget, et les deux textes figés de l'opérateur

**1 échange(s) au plus** ; les deux réponses se figent **avant** le run.
```text
<<<REPONSE_TABLEAU
Continue: write the shadow report where the skill's action 02 says, without modifying the source, and stop.
>>>REPONSE_TABLEAU
<<<REPONSE_AUTRE
Answer from the repository. If it cannot be read there, say so and stop.
>>>REPONSE_AUTRE
```
