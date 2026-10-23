# Plan écrit — `aidd_docs/tasks/2026_10/2026_10_22_copier-tous-les-manquants/`

| Fichier écrit | Contenu |
|---|---|
| `plan.md` | `status: pending`, Overview (goal + source), 3 phases, 5 décisions (validées avec vous) |
| `phase-1.md` | Cœur du lot : `buildManquantsList()` (pur) + `copyManquants()` dans un nouveau `render/bulkCopy.ts` + `bulkCopy.test.ts` — ✅ 2 fichiers créés |
| `phase-2.md` | Bouton `#btn-copy-manquants` dans le h2 d'Éparpillé (placement symétrique à `#btn-add-dir`), câblage à la `script.ts:104`, wireframe confirmé — ✏️ 3 fichiers |
| `phase-3.md` | Règle CSS dans `sync-main.css` (section éparpillé), EPIC-057 (055/056 prises) + entrée à l'index, validation complète + redémarrage Flask — ✏️ 3 fichiers + ✅ 1 |

Aucun `backlog-link.json` : la source est un texte brut, pas de ticket. Passage de relire des fichiers écrits effectué — plus aucun texte mélangé ni placeholder `{...}` reste dans la forme de la dernière version.

**Revue (accord interactif obtenu) — score : 9/10**

- ✓ Phases fermées sur le dépôt : la projection cumulée couvre ✏️ `index.html`, `script.ts`, `bulkCopy.ts`, `sync-main.css`, épic `README` · ✅ `bulkCopy.ts`, `bulkCopy.test.ts`, `EPIC-057` · ❌ rien supprimé — chaque phase embarque sa part.
- ✓ Une seule voie d'écriture : `copyFilesTo` + modale F5 réutilisées, zéro signature modifiée (S1), zéro binding nouveau (légende/matrice intactes).
- ✓ Phases de taille S4 (2-3 fichiers), chaque phase embarque son verdict, et réutilise les critères déjà testés (`buildRangementPlan`, `executeCopy`, `stylePreview`).
- ✓ Règles de dépôt suivies : EPIC réglementaire, CSS page + pas de token, canaux feedback respectés, redémarrage Flask intégré à la validation.
- ✗ Risque 1 : le lot peut porter sur des dizaines de fichiers → copie séquentielle par `/copy` (comme l'aperçu E) — pas de progression par fichier, seulement le compte final.
- ✗ Risque 2 : le câblage exact au boot (`initBulkCopyButton()`) reste lisible sur un seul pattern avéré(`#btn-add-dir`) ; le test jsdom est retenu jusqu'au vert du module.
- ✗ Risque 3 : la définition LED bleue exclue les verdict d'homonyme ambre — assumé (décision confirmée : pas de doublon involontaire dans un lot).

Compétence 01-plan terminée — echo `aidd:step-end aidd-dev:01-plan` emitted.