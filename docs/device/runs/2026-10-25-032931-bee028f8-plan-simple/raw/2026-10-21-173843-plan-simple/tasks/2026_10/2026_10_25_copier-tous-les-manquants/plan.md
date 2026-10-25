---
objective: "Un bouton sur la page Sync copie en un lot confirmé les fichiers épars manquants visibles vers le dossier Source Data surligné, sans toucher aux homonymes probables, aux doublons ni aux traités."
status: pending
---

# Plan: copier tous les manquants

## Overview

| Field      | Value                                                                                   |
| ---------- | --------------------------------------------------------------------------------------- |
| **Goal**   | Un lot confirmé de copies vers le dossier surligné, avec ses exclusions dites à l'écran |
| **Source** | Demande utilisateur (texte) + [`README.md`](../../../../README.md) (contrat Sync / F5)  |

## Phases

| #   | Phase                                   | File                         |
| --- | --------------------------------------- | ---------------------------- |
| 1   | Le lot se calcule                      | [`phase-1.md`](./phase-1.md) |
| 2   | Le bouton copie, confirme et rend compte | [`phase-2.md`](./phase-2.md) |
| 3   | Le contrat et la trace                  | [`phase-3.md`](./phase-3.md) |

## Decisions

| Decision                                                        | Why                                                                                                                                                          |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Destination = dossier Source Data surligné (règle F5), pas de routage par style | Le dossier est la déclaration de style (EPIC-043) ; router sur une suggestion écrirait des genres heuristiques à l'échelle, alors que le choix du dossier reste humain. |
| Manquants = `nouveau` visibles, **homonymes probables exclus**    | L'ambre est une revue, pas une copie : `dupMatches` signale un doublon probable ; le copier en lot créerait le doublon que la page Doublons sert à arbitrer.       |
| Bouton seul, aucun raccourci clavier                             | Les bindings vivent dans `commands/*.ts` et la légende est engendrée avec une bijection testée ; ajouter une touche pour un geste non demandé élargirait la matrice. |
| Réutiliser `copyFilesTo` et `confirmCopyDialog` ; backend intact | Un seul `GET /journal` final, patch d'index/DOM, collision suffixée `-2`, style écrit des deux côtés et journal partagé sont déjà couverts par les tests.          |
| Bouton dans le header gauche, pas dans `#epars-status-line`      | `patchEparsFileAfterCopy` réécrit `#epars-status-line.innerHTML` à chaque copie : un bouton placé là disparaîtrait après la première copie.                     |
| Plan figé au clic                                                | La modale montre le N exact ; un changement de filtre ou de focus pendant la copie ne doit pas modifier silencieusement le lot déjà confirmé.                  |
