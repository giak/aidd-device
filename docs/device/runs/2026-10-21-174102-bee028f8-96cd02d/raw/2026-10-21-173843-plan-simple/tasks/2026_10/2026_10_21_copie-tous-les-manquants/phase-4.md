---
status: pending
---

# Instruction: Viabilité à l'échelle (mesure, puis chemin rapide si la mesure le justifie)

## Architecture projection

> Tree of the final files. ✅ create · ✏️ modify · ❌ delete

```txt
.
├── static/src/
│   ├── actions.ts          ✏️ modify (conditionnel) — variante « bulk » : un re-render au lieu d'un patch DOM par fichier
│   └── actions.test.ts      ✏️ modify (conditionnel) — tests de la variante bulk
├── app.py                  ✏️ modify (conditionnel) — POST /copy/bulk : une requête, boucle serveur, un journal
├── test_app.py             ✏️ modify (conditionnel) — tests de la route bulk
└── docs/superpowers/reports/
    └── 2026-10-21-lot-manquants-perf.md   ✅ create — mesure avant / après, répartition HTTP vs DOM, décision
```

## User Journey

```mermaid
flowchart TD
  A[Lot de référence : N fichiers dans des répertoires jetables] --> B[Mesure 1 : coût par fichier côté serveur]
  A --> C[Mesure 2 : coût par fichier côté navigateur]
  B --> D{Seuil franchi ?}
  C --> D
  D -->|non| E[Le chemin actuel suffit — rien à réécrire, la mesure est consignée]
  D -->|oui, le DOM domine| F[Variante bulk : un re-render à la fin]
  D -->|oui, le serveur domine| G[Route POST /copy/bulk]
  F --> H[Mesure 3 : le même lot, après correction]
  G --> H
  H --> I[Rapport : avant, après, décision]
```

## Test Scope

```mermaid
---
title: Test scope
---
journey
  section Setup
    Lot de référence de 100 fichiers audio jetables (hors collection de l'utilisateur) et index des deux côtés => état prêt à copier: 5: system
  section Happy path
    Le lot de référence passe par le chemin de copie => durée totale et durée par fichier mesurées et consignées: 5: system
  section Edge case - le DOM domine
    La mesure attribue la majorité du temps au patch DOM => variante bulk livrée, le même lot repasse sous 50 ms par fichier: 5: system
  section Edge case - le serveur domine
    La mesure attribue la majorité du temps aux requêtes HTTP => route bulk livrée et testée, le même lot repasse sous 50 ms par fichier: 5: system
  section Edge case - seuil non franchi
    La mesure reste sous 100 ms par fichier => aucune réécriture du chemin de copie, la mesure est consignée telle quelle: 5: system
  section Teardown
    Fin des mesures => répertoires jetables supprimés, aucun fichier de la collection touché: 5: system
```

## Tasks to do

### `1)` Mesurer avant de corriger

> Aucune correction ne part d'une intuition : la décision sort d'une mesure reproductible.

1. **Serveur** : mesurer le coût d'un `POST /copy` réel — copies, écriture du style, relecture des tags,
   écriture du journal et du cache — sur un lot de 100 fichiers **jetables** (répertoires temporaires,
   jamais la collection de l'utilisateur — `△DATA-SAFETY`).
2. **Navigateur** : mesurer le coût du chemin de copie côté interface sur le même lot — boucle de tranches,
   `copyFilesTo` (patch d'index + `patchEparsFileAfterCopy` + `patchSourceFileAfterCopy`) et re-render final.
   Le poste suspect est connu : `patchEparsFileAfterCopy` rescane **tous** les spans épars à chaque fichier
   copié (`static/src/domPatches.ts`, l. 34-42) → coût O(fichiers × fichiers).
3. Consigner les deux mesures (durée totale, durée par fichier, répartition des postes) dans
   `docs/superpowers/reports/2026-10-21-lot-manquants-perf.md`.
4. **Seuil de décision, écrit dans le rapport** : au-delà de **100 ms par fichier** (soit plus de 10 s pour
   100 fichiers), le chemin de copie doit être accéléré ; en deçà, il est **conservé tel quel** (KISS).

### `2)` Chemin rapide — seulement si le seuil est franchi

> Une seule voie, choisie par le poste qui domine.

1. **Si le DOM domine** (variante frontend, zéro backend, prioritaire) : une copie de lot qui n'appelle plus
   `patchEparsFileAfterCopy` / `patchSourceFileAfterCopy` **par fichier**, mais met à jour l'index
   `state.sourceFiles` puis déclenche **un seul** re-render event-driven à la fin (la mécanique existante :
   `state.sourceFiles = { …state.sourceFiles }` → `sourceFiles:changed` → rendu). Le comportement visible
   doit rester identique : même bilan, mêmes compteurs, même journal.
2. **Si le serveur domine** (route backend) : `POST /copy/bulk` — une requête, une boucle serveur, un journal.
   Elle réutilise **exactement** le code de `POST /copy` (mêmes garde-fous : `os.makedirs`, `_collision_dst`,
   écriture du style des deux côtés, journal, cache) — jamais une réimplémentation. `app.py` est earmelé
   pour un découpage (EPIC-055) : le route est écrit de façon à s'en détacher facilement.
3. Tests : un test qui vérifie qu'un lot de N fichiers produit N entrées de journal et N copies, et que la
   variante bulk donne **le même état final** que le chemin actuel (même index, même journal).

### `3)` Re-mesurer et consigner

1. Rejouer la mesure sur le même lot de 100 fichiers après la correction.
2. Consigner dans le rapport : mesure avant, mesure après, poste dominant, décision, seuil appliqué.
3. Le rapport est la **preuve** de la phase : sans lui, la phase n'est pas terminée.

## Test acceptance criteria

| Task | Acceptance criteria                                                                                                                                           |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Le rapport existe et contient : durée totale, durée par fichier, répartition des postes (serveur / DOM), pour un lot de 100 fichiers jetables                     |
| 1    | La mesure s'est faite sur des répertoires jetables : aucun fichier de la collection de l'utilisateur n'a été écrit ni déplacé                                                  |
| 1    | Le seuil de décision (100 ms par fichier) est écrit dans le rapport                                                                                             |
| 2    | Si le seuil n'est pas franchi : aucun changement du chemin de copie n'est livré, et le rapport dit pourquoi                                                                                                                     |
| 2    | Si le seuil est franchi : la variante livrée donne le même état final (index + journal) que le chemin actuel, et le test le prouve                                                                                                |
| 3    | La mesure après correction est consignée dans le rapport ; si une correction a eu lieu, la durée par fichier du lot de 100 est inférieure ou égale à 50 ms                    |
| 3    | `npm test` et `./venv/bin/python -m pytest -q` restent verts après les corrections éventuelles                                                                                                                              |
