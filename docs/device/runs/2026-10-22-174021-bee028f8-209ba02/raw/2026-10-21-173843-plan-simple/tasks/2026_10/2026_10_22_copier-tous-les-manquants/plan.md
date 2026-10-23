---
objective: Copier d'un seul clic, depuis la page Sync, tous les fichiers épars LED bleue sans jumeau dans le dossier surligné à droite — même modale que F5, même journal, sans nouveau binding clavier.
status: pending
---

# Plan: Bouton « copier tous les manquants » (page Sync)

## Overview

| Field      | Value |
| ---------- | ----- |
| **Goal**   | Un bouton dans le header du panneau Éparpillé ouvre la modale F5 pré-remplie avec tous les fichiers LED bleue (`nouveau`) dont le jumeau n'est pas déjà sous le dossier de destination surligné à droite, puis copie le lot via `copyFilesTo` (journal, patch index, sélection vidée) — un seul nouveau chemin d'entrée, aucune signature modifiée. |
| **Source** | Demande utilisateur en texte brut (in-canale, 2026-10-22) : « ajout d'un bouton "copier tous les manquants" à sa page Sync ». Aucun ticket, aucun fichier source. |

## Phases

| #   | Phase                                                        | File                        |
| --- | ------------------------------------------------------------ | --------------------------- |
| 1   | Cœur du lot — calcul des manquants + copie confirmée (pur + test) | [`phase-1.md`](./phase-1.md) |
| 2   | Bouton dans le header Éparpillé + câblage au boot             | [`phase-2.md`](./phase-2.md) |
| 3   | Style CSS, EPIC-057, validation complète (build + suites + redémarrage) | [`phase-3.md`](./phase-3.md) |

## Resources

*(aucune source externe consultée — tout repose sur des fichiers du dépôt)*

## Decisions

| Decision                                                                 | Why |
| ------------------------------------------------------------------------ | --- |
| « Manquants » = LED bleue (`nouveau`) sans jumeau (`dupMatches`) sous le dossier cible | Complément exact de la pastille « ⤷ déjà rangé » (EPIC-034) : précisément ce que F5 copierait, en un lot. Même filtre que `buildRangementPlan` (exclusion `twinInDest`). |
| Destination = dossier actuellement surligné à droite (cible du flux F5) s | Zéro surprise : la copie ne part que d'une cible visée humainement ; si rien n'est surligné → statut de guidage, rien ne bouge. |
| Un seul chemin d'écriture : `copyFilesTo` réutilisée, modale F5 (`buildCopyDialogSpec` + `confirmCopyDialog`) réutilisée | La primitive de lot existe (extrait du F5, EPIC-035), la modale accepte déjà les groupes multi-fichiers + badge « ➕ (sera créé) » — jamais de deuxième mécanisme de copie. |
| Bouton seul, aucun binding clavier | La légende `?` est générée depuis les bindings (`commands/*.ts`) et la matrice clavier fait échouer la CI sur un binding mort — un bouton pur n'exige de toucher ni l'une ni l'autre (périmètre minimal). |
| Aucun raccourci nouveau, aucune variable CSS nouvelle ; règle du bouton dans `sync-main.css` | Règle d'architecture : nouvelle règle CSS = fichier de sa page (section « éparpillé »), nouvelle variable = uniquement `tokens.css` (à éviter ici). |
