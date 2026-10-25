Plan et phases écrits sous `aidd_docs/tasks/2026_10/2026_10_25_copier-tous-les-manquants/` :

- [`plan.md`](aidd_docs/tasks/2026_10/2026_10_25_copier-tous-les-manquants/plan.md)
- [`phase-1.md`](aidd_docs/tasks/2026_10/2026_10_25_copier-tous-les-manquants/phase-1.md) — calcul pur du lot, exclusions et tests
- [`phase-2.md`](aidd_docs/tasks/2026_10/2026_10_25_copier-tous-les-manquants/phase-2.md) — bouton, modale, copie, style, test 300 fichiers
- [`phase-3.md`](aidd_docs/tasks/2026_10/2026_10_25_copier-tous-les-manquants/phase-3.md) — README, EPIC-057, index, gates

Décisions structurantes : destination = dossier Source Data surligné, homonymes probables exclus du lot, doublons/traités exclus, réutilisation de `copyFilesTo` et `confirmCopyDialog`, aucun changement backend, bouton dans le header gauche pour survivre aux re-renders de la status line.

Confiance : **8/10**
- ✓ Arborescence, fonctions et scripts vérifiés (`computeStatus`, `copyFilesTo`, `buildCopyDialogSpec`, `refreshDupMatches`, `sync.css`, EPIC-056 → 057)
- ✓ Découpage en trois phases avec Test Scope, wireframes UI et critères d'acceptation
- ✓ Aucun code modifié ; `git status` ne montre que `aidd_docs/`
- ✗ Pas de progression fichier par fichier sur les très gros lots, et le compteur du bouton peut différer du `● N reste` puisque les homonymes restent comptés dans la status line — les deux limites sont documentées dans les phases.