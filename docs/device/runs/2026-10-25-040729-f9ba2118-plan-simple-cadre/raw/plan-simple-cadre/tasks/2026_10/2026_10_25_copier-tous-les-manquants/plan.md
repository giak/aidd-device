---
objective: "Copier en un seul geste, depuis la page Sync, tous les manquants visibles vers le dossier Source Data surligné — confirmation chiffrée, exclusions dites, bilan honnête."
status: pending
---

# Plan: Copier tous les manquants depuis la page Sync

## Overview

| Field      | Value                                                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Goal**   | Un bouton dans l'en-tête Éparpillé copie les manquants visibles vers le dossier surligné à droite, via la modale de copie existante.       |
| **Source** | Texte de la demande (cette session). Aucune référence de backlog. Contexte produit : `README.md` du dépôt (`audio-sync-tool`).             |

## Phases

| #   | Phase                                             | File                         |
| --- | ------------------------------------------------- | ---------------------------- |
| 1   | Copie du lot : cible, pool visible, bilan (logique + tests) | [`phase-1.md`](./phase-1.md) |
| 2   | Le bouton dans l'en-tête Éparpillé                | [`phase-2.md`](./phase-2.md) |
| 3   | Documentation, EPIC-057 et gate                   | [`phase-3.md`](./phase-3.md) |

## Decisions

| Decision | Why |
| -------- | --- |
| La destination est le dossier Source Data surligné à droite, jamais une destination inventée | C'est la seule placement que l'app connaît sans deviner un style ; le rangement par style existe déjà (`g` puis `e`) et n'est pas dupliqué ici. |
| Le pool est lu dans le DOM rendu (`#epars-container .file.nouveau`) | Le filtre et le statut ne vivent qu'au rendu : ce que l'écran montre est exactement ce qui part, et le prédicat de filtre n'est pas réimplémenté une seconde fois. |
| « Manquant » = statut `nouveau` seulement (`computeStatus`), pas `traité` ni `doublon` | Le bouton doit s'accorder avec la ligne « ● N reste » qui le motive ; `traité` (copié puis disparu de la source) reste un cas à trancher à la main. |
| Exclure et annoncer les jumeaux déjà présents dans le dossier cible | Même règle que l'aperçu `e` (`twinInDest`) : copier créerait un doublon dans le même dossier ; l'exclusion est écrite dans la modale, jamais silencieuse. |
| Copies séquentielles via `copyFilesTo`, avec callback de progression optionnel — aucune route backend en lot | Un seul chemin de copie pour F5, l'aperçu `e` et le lot ; pas de nouveau mode d'échec, pas de transaction à inventer. Le coût est la durée, annoncée dans la modale. |
| Aucun raccourci clavier, aucun nouveau binding | La demande est un bouton ; la légende `?` et la matrice clavier sont générées et vérifiées par bijection — on ne les touche pas pour un geste souris. |
