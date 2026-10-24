---
name: Demande — 2026-10-24-175334-defect-racine-terrain
description: Le cas fabriqué pour plugins/aidd-pm/skills/09-defect, rejoué avec un texte qui nomme `terrain/` comme racine du dépôt et ne donne aucun chemin absolu de la machine : rapporter un écart observé de `slugify-cli` en un Defect unique sous `aidd_docs/backlog/defects/`, avec un tableau de qualification, une pause et un accord, budget de 3 échanges
type: case-request
status: in-progress
---

# Demande — 2026-10-24-175334-defect-racine-terrain

## 1. Identifiant

`2026-10-24-175334-defect-racine-terrain`

## 2. La révision sous test (`framework-origin`)

`origine/framework`, copie de `/home/giak/projects/framework` (tête `fe48de12`, arbre de travail porté par `--tel-quel` : une action de `03-shadow-areas` modifiée et un fichier non suivi) ; `framework-origin` en est la copie détachée, `origin` pointant le chemin local. Le skill sous test, `plugins/aidd-pm/skills/09-defect`, n'est touché par aucune de ces modifications.

## 3. Le terrain (`terrain`)

`origine/terrain`, copie d'un dépôt git de fixture, `terrain-slugify` (tête `6c42d4d`), une petite bibliothèque de slugs avec son observation QA ; `terrain` en est la copie de travail détachée — c'est là que la session écrit.

## 4. Répertoire de travail

`$RACINE/2026-10-24-175334-defect-racine-terrain/` — la session travaille dans `terrain/` et lit `framework-origin/` ; hors des quatre arbres, `$RACINE` déclarée une seule fois, au gel.

## 5. Le texte remis à la session, verbatim

Entre les deux lignes de garde, et rien d'autre :
```text
<<<DEMANDE
You are at the root of the repository under work: the `terrain/` directory. It is `slugify-cli`, a small text utility the newsletter importer uses to build article URLs, and every repository path below is relative to it.

Read the skill under test first: it sits beside this root, one level up, at `../framework-origin/plugins/aidd-pm/skills/09-defect/SKILL.md`. Use it on this repository.

The promises live in `README.md` and `tests/test_slugify.py`; `observations/2026-10-24-qa-run.md` records two calls whose output differs from them.

Turn that observed mismatch into one backlog Defect, at `aidd_docs/backlog/defects/slugify-keeps-separator-runs.md`.

Before any write, show one Markdown table of what you qualify the mismatch as, the lifecycle state it deserves, and the path you will write. End that turn with a question asking for my agreement, so the pause is explicit.

Once I agree, you have my authority to create that one Defect with the state your readiness check finds, and to ask no second question.

Do not modify any existing file. Do not diagnose the cause or propose a fix.
>>>DEMANDE
```

## 6. Ce qu'elle doit produire

`terrain/aidd_docs/backlog/defects/slugify-keeps-separator-runs.md` : un fichier neuf, un seul, au chemin que la demande nomme, portant `type: defect`, un `status` d'état `reported` ou `ready`, un titre, et les sections `Expected`, `Actual`, `Reproduction`, `Impact` et `Evidence` renseignées à partir de l'observation et du dépôt. Aucun autre fichier n'est produit, aucun fichier existant n'est modifié, `slugify.py` garde son empreinte.

Le produit doit se suffire : ce que la session cite comme preuve est dans le fichier produit, ou sous `terrain/.scratch/`, collecté en annexe ; un chemin volatil n'est pas une preuve (ADR-067).

## 7. Ce qui lui est interdit

Écrire dans `framework-origin/` et dans `origine/` ; lire sous `docs/device/CASES/` ; écrire hors de `terrain/aidd_docs` et de `terrain/.scratch/` (le scratch est collecté en annexe, jamais compté comme produit) ; modifier un fichier existant du terrain, `slugify.py`, ses tests, le README et l'observation compris ; diagnostiquer la cause ou proposer un correctif ; sortir du répertoire de travail, ni dans le reste de `$HOME` ni dans `/tmp` ; toute écriture git, tout appel réseau ; écrire les fichiers de contexte d'outils IA.

## 8. Budget, et les deux textes figés de l'opérateur

**3 échanges au plus** : le message de la porte, le tableau suivi de sa question, et la réponse à une question de plus s'il en pose une. Les deux réponses se figent **avant** le run.
```text
<<<REPONSE_TABLEAU
Agreed: one Defect, and the path you named is the target. Create it with the lifecycle state your readiness check finds, from the observation and the repository, and do not diagnose or fix the code.
>>>REPONSE_TABLEAU
<<<REPONSE_AUTRE
Answer from the repository. If it cannot be read there, say so and stop.
>>>REPONSE_AUTRE
```
