---
name: Fondation documentaire
description: Les six bases de la consignation (deux canaux, un foyer, preuve, immuabilité, règles en AGENTS.md, zéro dérive), révisées après l'exemple deuteros, en itération ouverte
type: spec
status: done
---

# Fondation documentaire

## Origine

Le dépôt a été vidé par le relecteur, 2026-10-15 matin, verbatim : « bon, tu n'a rien fait. j'ai tout
éffacé dans le projet. il faut brainstorm des specs. revoir de fond en comble
/home/giak/projects/aidd-device/AGENTS.md. posé les bases de la gestion docuementaires et de gestion
de projet ».

Quatre arbitrages ont suivi, verbatim du relecteur, et tiennent cette spec :

1. « non, on met à place la gestion docuementaire du projet, on ne traite pas de son but, masi de
   comment on trace tout, on note tout » — la fondation avant la raison d'être.
2. « tu vas trop vite, on a pas poser les fondation docuentaires ! » — la gestion de projet est la
   boucle suivante, jamais le sujet de celle-ci.
3. « babayy step, on est le brainstorm . » — on est au brainstorm ; une spec n'est pas un engagement.
4. « pas de script » — l'enforcement n'est pas un script : prose dans `AGENTS.md`, discipline du
   write-back, arbitrage humain.

L'exemple deuteros-resurrected-web/docs a été étudié et a produit trois emprunts, deux
renforcements, un ajournement (mémoire `44bd6559` : séances numérotées, format interne du compte
rendu, registre d'ADR ajourné ; un seul foyer, frontmatter obligatoire).

## Les six bases

**B1. Deux canaux pour tout noter.** Un échange devient une mémoire Mnemolite, écrite
immédiatement, jamais en fin de séance, et son `memory_id` est cité partout où ses faits le sont.
Une séance devient une section de `docs/trace.md`, append-only, jamais réécrite après coup ; le
journal cite le `memory_id` de chaque échange qu'il raconte. Une séance non consignée n'existe pas.

**B2. Un foyer par nature, sous `docs/`, rien d'autre.** Le journal à `docs/trace.md` ; une tâche
dans son dossier ; ce qui est clos dans `docs/archive/`. Rien ne flotte à la racine, aucun arbre
parallèle, aucune spec sans foyer ; ce qui n'a pas encore de foyer déclaré vit dans la section du
jour, jamais en vrac. Renforcement amydré par l'exemple deuteros (deux maisons pour la même nature,
specs dupliquées, `AGENTS.md` citant des chemins morts) : **aucune exception de gel** tant que la
fondation ne la déclare pas, et `AGENTS.md` ne cite jamais un chemin qui n'existe pas.

**B3. Chaque fait porte sa preuve.** Un échange porte son `memory_id` ; une mesure porte la
commande qui l'établit ; une date vient de git (`%cI`), jamais déclarée par le document. Ce que
l'agent écrit est une reconstitution, nommée comme telle : la source est la base de l'application,
l'historique git, l'export d'une base, Mnemolite. Frontmatter obligatoire : `name`·`description`·
`type`·`status`, `status` ∈ `pending`·`in-progress`·`done`·`blocked` — deuteros n'a ni frontmatter
ni statut lisible : c'est le renforcement.

**B4. Deux niveaux d'immuabilité.** Une séance cancelée est un relevé daté : elle n'est jamais
éditée ; le changement qui la concerne ouvre un nouveau document ou une nouvelle section datée qui
la cite. En cours de séance, la section du jour reste vivante, au fil de l'eau.

**B5. Les règles vivent dans `AGENTS.md`, le gate est la discipline.** Pas de script, pas de
crochet, pas de CI : l'application passe par la règle (write-back par échange), un audit d'échange
de chaque séance (rédigé dans le CR, bridge une absence de trappe au lieu de la taire), et
l'arbitrage du relecteur humain. Une première vérification mécanique n'entre QUE pérdue, pas
promis — la soirées dernière a construit des outils et oublié l'essentiel (19 documents non
commités, la preuve de base non déclarée).

**B6. Tolérance zéro à la dérive.** Tout ce qui n'est pas B1–B5 — un nommage s'encombrant, un
dossier flottant, un document sans frontmatter, un échange sans memory_id — est nommé immédiatement
dans la section du jour, pas toléré puis re-déclaré en v2. Une dérive ignore est le signe que le
point B1 s'est déjà tu.

## Format d'une entrée de séance (emprunté de l'exemple deuteros)

```
## Séance N — YYYY-MM-DD (sujet)

Objectif.
Fait.                (ce qui a été produit ; les commandes de mesure)
Vérifié.             (exit codes, chiffres ; ou OPEN/UNKNOWN dit explicitement)
Dérives signalées, non corrigées.
Rectifications de ses propres affirmations.      (si aucune : silence, pas de ligne creuse)
Prochaines étapes (TODO).
Mémoires de la séance. (une ligne par memory_id)
```

Numérotation stable ; continuité par « (suite) » quand une séance coupée reprend ; un échange
repris par le même fil rejoint la section du jour.

## Hors de portée de cette spec (explicitement)

- La gestion de projet (unités de travail, dossiers de tâche, critère falsifiable, commit) : la
  boucle suivante, arbitrage 2 ci-dessus. Le jour où la fondation est approuvée, elle s'écrit
  comme la boucle 2 de cette même conception.
- Un registre d'adr (emprunt listé à l'exemple deuteros, ajourné) : le registre ne naît que quand
  les décisions deviennent trop nombreuses pour la section de séance.
- Tout enforcement mécanique : arbitrage 4 ci-dessus.

## Décisions, et de qui

- Refusées du relecteur, ce jour, verbatim (les quatre arbitrages, ci-dessus) : la fondation
  d'abord, the gestion de projet ensuite.
- Émises (titre itératif pouvant être corrigé) : les six bases, les emprunts/renforcements/
  ajournement après l'exemple deuteros (mémoire `44bd6559`), le format d'entrée, le hors-périmètre.
- À décider par le relecteur : l'approbation de cette spec, base de la boucle 2 ; la refonte de la
  section `CONSIGN` d'`AGENTS.md` sur le modèle de cette page, une seule fois approuvée.
