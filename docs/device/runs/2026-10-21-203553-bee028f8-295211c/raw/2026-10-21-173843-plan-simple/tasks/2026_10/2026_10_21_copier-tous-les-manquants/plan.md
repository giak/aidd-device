---
objective: "La page Sync expose un bouton « Tous les manquants » qui range en un geste tous les fichiers épars absents de Source Data, après un aperçu qui dit ce qui part où, et chaque écriture de tag reste annulable."
status: pending
---

<!-- Fill or omit these sections; never add, rename, or reorder one. -->

# Plan: Bouton « Tous les manquants » (page Sync)

## Overview

| Field      | Value                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Goal**   | Un bouton unique range les fichiers épars absents de Source Data vers leur dossier cible calculé (style → tranche), avec aperçu. |
| **Source** | Demande en texte de l'utilisateur (2026-10-21) — « un bouton "copier tous les manquants" sur la page Sync ». Aucun ticket, aucun fichier source. |

## Phases

| #   | Phase                                     | File                         |
| --- | ----------------------------------------- | ---------------------------- |
| 1   | Colle de suggestion partagée (DRY)        | [`phase-1.md`](./phase-1.md) |
| 2   | Moteur du plan « manquants » (pur)        | [`phase-2.md`](./phase-2.md) |
| 3   | Bouton + aperçu + copie des manquants     | [`phase-3.md`](./phase-3.md) |
| 4   | Raccourci clavier `m` + légende générée   | [`phase-4.md`](./phase-4.md) |
| 5   | EPIC-057 + index EPICs + README           | [`phase-5.md`](./phase-5.md) |

## Decisions

<!-- Architecture-magnitude only, one you'd regret reversing. Omit if none qualify. -->

| Decision                                                                                                                     | Why                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1 — Destination = choix de session d'abord, suggestion automatique ensuite (seuil de `styleSuggest`), aperçu obligatoire avant toute copie | Le besoin est « tous les manquants » : les ~5 000 épars sans choix de style resteraient hors d'atteinte en ne copiant que les choix posés à la main. Le moteur de suggestion existe déjà (4 signaux pondérés, `styleSuggest.ts`) et la copie vers un dossier stylé écrit le genre par le contrat EPIC-043, journalisé et annulable. La suggestion reste un *choix de destination*, pas un choix de style : l'aperçu affiche le détail (choisis / suggérés) et rien n'est copié avant confirmation. **Hypothèse assumée** — la question n'a pas pu être posée à l'utilisateur (harnais non interactif). Alternative retenue si retour utilisateur : ne copier que les fichiers dont le style a été choisi à la main avec `G` (la suggestion ne sert plus qu'à proposer). |
| D2 — Aucune route backend nouvelle                                                                   | `POST /copy` crée le dossier cible (`os.makedirs`), copie, journalise, écrit le style du dossier et met le cache à jour ; `copyFilesTo()` (extrait du batch F5) enchaîne déjà les copies dossier par dossier pour le flux `e`. Réutiliser ce chemin évite un second vocabulaire de copie et garde l'annulation par `apply_styles.py --undo`. |
| D3 — Un module pur `missingPlan.ts`, entrée explicite, aucune lecture de `state`                              | Le plan (qui va où, qui est exclu) doit être testable sans DOM ni state : c'est le cœur de la décision, il mérite des tests unitaires déterministes. Le state n'est lu qu'au point d'appel.                              |
| D4 — Le bouton est dans le template (`#btn-copy-missing`), son état est écrit par `renderEpars`                 | Structure dans le HTML, état dans le JS — même contrat que `#btn-add-dir` (➕ Source Data). Un nœud stable survit aux re-renders de la ligne d'état (reconstruits en innerHTML) ; le texte du bouton porte le compte exact. |
| D5 — Le plan porte sur TOUS les fichiers `nouveau` de l'index, hors filtre actif                              | La destination est calculée par fichier, pas par ligne visible : filtrer l'épars ne change pas la destination. Le bouton affiche le compte global et l'aperçu rappelle qu'un filtre est actif s'il y en a un.                     |
| D6 — Exclusion par défaut du jumeau déjà rangé et des fichiers sans destination                             | Un jumeau déjà dans le dossier cible produirait un doublon ; un fichier sans style ni suggestion n'a pas de dossier cible. Les deux sont **listés** dans l'aperçu, jamais copiés en silence.                                |

<!-- Ressources : aucune source externe consultée (lecture de dépôt uniquement). -->
