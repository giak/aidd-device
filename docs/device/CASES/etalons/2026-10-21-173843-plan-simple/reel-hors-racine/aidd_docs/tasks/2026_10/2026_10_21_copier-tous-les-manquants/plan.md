---
objective: "La page Sync permet de copier en un clic, vers le dossier surligné de Source Data, tous les fichiers éparpillés manquants — le lot étant confirmé avant toute écriture."
status: pending
---

# Plan: Bouton « copier tous les manquants » (page Sync)

## Overview

| Field      | Value                                                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Goal**   | Un bouton dans l'en-tête du panneau Éparpillé copie en un seul lot, vers le dossier surligné à droite, tous les fichiers « nouveau » (LED bleue) qui respectent le filtre actif. La confirmation montre le lot (fichiers → destination) avant toute écriture. |
| **Source** | Texte utilisateur (2026-10-21) : « un bouton "copier tous les manquants" à sa page Sync » — dépôt `audio-sync-tool` (Flask 3.1 + TypeScript vanilla). |

## Phases

| #   | Phase                                                       | File                         |
| --- | ----------------------------------------------------------- | ---------------------------- |
| 1   | Socle — la sélection des fichiers manquants                | [`phase-1.md`](./phase-1.md) |
| 2   | Bouton, destination, confirmation, exécution du lot         | [`phase-2.md`](./phase-2.md) |
| 3   | Preuve bout-en-bout, documentation, traçabilité EPIC        | [`phase-3.md`](./phase-3.md) |

## Decisions

| Decision                                                                                                       | Why                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Le lot passe par la modale structurée existante (`buildCopyDialogSpec` + `confirmCopyDialog`), jamais par une exécution directe | DATA-SAFETY : un lot touche des centaines de fichiers. La modale affiche déjà « N fichiers → dossier », le badge « ➕ sera créé » et le consentement style (EPIC-051) — réécrire ce Dialogue serait un second vocabulaire pour le même acte. |
| La destination est le dossier **surligné dans la colonne Source Data** (`.focused` → `dataset.dirpath`)           | Même règle que le F5 simple (`executeCopy`) : une seule grammaire de destination dans l'app. La destination ne dépend pas du panneau actif — le `.focused` de la colonne droite survit au changement de panneau (`focus.ts` ne nettoie que le conteneur visé). |
| « Manquant » = statut `nouveau` de `computeStatus` (absent de Source Data **et** jamais copié)                   | La LED bleue et le statut partagent déjà une définition unique (`utils.ts`). Réutiliser `computeStatus` évite un second verdict qui divergerait de l'affichage. `traite` et `doublon` sont donc exclus du lot. |
| Le lot respecte le filtre actif du chip Éparpillé (`sync-epars`)                                                  | Le filtre est un rétrécissement délibéré de la liste ; le compte de manquants déjà affiché dans `#epars-status-line` (« ● N reste ») est le compte **filtré** — le bouton et l'affichage disent la même chose.                     |
| Le lot passe par `copyFilesTo()` (un `POST /copy` par fichier), donc **zéro backend**                            | `/copy` crée déjà le dossier cible (`os.makedirs`), journalise, écrit le style du dossier cible sur l'épars **et** la copie (EPIC-043) et met le cache de scan à jour. Une route « copy all » dupliquerait tout cela. |
| Le bouton vit dans l'en-tête du panneau Éparpillé et réutilise la classe CSS `.panel-add-btn`                     | Aucun CSS nouveau (règle CSS : une règle transverse va dans `components.css`, une règle de page dans `static/styles/pages/sync.css`). L'emplacement et le style calquent le bouton ➕ du panneau Source Data.          |
| **Hors périmètre — aucun raccourci clavier**                                                                  | La demande est un bouton. Ajouter une touche toucherait la matrice `commands/keyboardMatrix.test.ts` (EPIC-031) pour un gain nul.                                                                       |
| **Hors périmètre — aucune route backend, aucune écriture de tag nouvelle**                                     | Le flux `/copy` suffit ; il écrit déjà le style du dossier cible (EPIC-043) et ne touche jamais l'année.                                                                                                       |
| **Hors périmètre — `makeFileEl` n'est pas modifiée**                                                            | C'est une fonction partagée (`AGENT.md` S2) ; le bouton n'a besoin d'aucune colonne ni d'aucune ligne supplémentaire.                                                                                        |
| Les homonymes probables **ne sont pas exclus** du lot                                                          | Décision actée avec l'utilisateur. Un fichier « nouveau » dont le jumeau est déjà rangé (pastille « ⤷ déjà rangé ») sera copié — il est visible dans la modale et retirable par le filtre. Le coût est assumé : quasi-doublon, jamais perte de donnée. |
