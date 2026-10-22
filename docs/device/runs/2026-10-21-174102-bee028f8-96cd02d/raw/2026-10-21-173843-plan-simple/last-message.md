Plan et phases écrits. Aucun autre fichier du dépôt n'a été touché (`git status` : `?? aidd_docs/` seulement).

## Fichiers écrits

```
aidd_docs/tasks/2026_10/2026_10_21_copie-tous-les-manquants/
├── plan.md      (14,1 K) — Overview / Phases / Decisions
├── phase-1.md   ( 6,4 K) — Domaine pur des fichiers manquants
├── phase-2.md   ( 8,4 K) — Action de lot confirmée (verrou, progression, bilan)
├── phase-3.md   (10,8 K) — Bouton « Copier les N manquants » (wireframe incluse)
├── phase-4.md   ( 7,0 K) — Viabilité à l'échelle (mesure, puis chemin rapide si justifié)
└── phase-5.md   ( 6,7 K) — EPIC-057 + README
```

Aucun `backlog-link.json` : la source est un texte brut, sans ticket ni fichier d'EPIC nommé.

## Décisions prises faute de retour (issues de la source, pas inventées)

| Décision | Fondement dans le dépôt |
|---|---|
| Destination = **dossier Source Data surligné** (cible du F5) | `copyFilesTo` existe déjà (`actions.ts` l. 298-352) ; une destination auto par style recouvrirait l'aperçu `e` et contredirait « le style est la seule décision humaine » (AGENT.md) |
| Lot = **tous les `nouveau` de l'index**, filtre ignoré | Le filtre est un filtre d'affichage (`state.filters`) ; l'index est la vérité — le compte exact est annoncé dans la modale |
| **Confirmation obligatoire** avant toute copie | `△DATA-SAFETY` + grammaire EPIC-051 (toutes les copies passent par la modale) |
| **Zéro backend** | `POST /copy` crée déjà le dossier, écrit le style des deux côtés, ne peut pas écraser (`_collision_dst`) |
| **Pas de raccourci clavier en P1** | `S5` : la matrice clavier (78 cellules + 5 invariants) reste intacte ; le raccourci part en P2 dans l'EPIC |
| Jumeau **dans la destination** = exclu ; jumeau rangé ailleurs = conservé et annoncé | Règle identique à `buildRangementPlan` (aperçu `e`) |

## Score de confiance (non écrit dans les fichiers)

**8 / 10**

✓ Chaque fait du plan est sourcé par un fichier + numéro de ligne du dépôt ; la projection couvre l'intégralité des modifiés/créés/créés conditionnels et les phases se découpent en unités livrables.
✓ Le périmètre est strict (aucune feature non demandée, aucun raccourci, aucun backend), les tests d'acceptation sont observables, la phase 4 tranche par mesure et non par intuition.
✓ Les pièges réels du dépôt sont traités : coût O(N×M) du patch DOM, `computeStatus` recalculant le journal à chaque appel, verrou anti double-clic, clash de noms entre dossiers épars.

✗ Le plan **n'expose pas** un prototype dans le navigateur : la forme exacte du bouton (libellé, place, largeur à 1 280 px) n'est validée que par wireframe, pas par un harnais de mesure.
✗ La phase 4 a une **livraison conditionnelle** (le chemin rapide n'est écrit que si la mesure le justifie) — la branche « aucune correction » doit être assumée comme telle par l'exécutant.
✗ La destination « dossier surligné » reste un choix **produit non tranché par la source** : c'est le point que je te demanderais en premier si tu veux le confirmer avant l'implémentation.