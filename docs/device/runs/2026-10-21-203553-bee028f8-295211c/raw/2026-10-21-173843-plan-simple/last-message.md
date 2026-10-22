Plan écrit. Voici le bilan.

## Fichiers écrits

```
aidd_docs/tasks/2026_10/2026_10_21_copier-tous-les-manquants/
├── plan.md        # Overview · Phases · Decisions (D1→D6)
├── phase-1.md     # Colle de suggestion partagée (DRY)
├── phase-2.md     # Moteur du plan « manquants » (pur)
├── phase-3.md     # Bouton + aperçu + copie  (seule phase UI, porte le wireframe)
├── phase-4.md     # Raccourci clavier `m` + légende générée
└── phase-5.md     # EPIC-057 + index EPICs + README
```

Aucun `backlog-link.json` : la source est une demande en texte, sans ticket ni fichier de backlog.

## Décision produit que j'ai dû trancher seulLe harness est non-interactif (`question` annulée) : impossible de vous demander la règle de destination. J'ai retenu **D1 — choix de session d'abord, suggestion automatique ensuite**, aperçu obligatoire avant toute copie — la seule règle qui fait vraiment « tous les manquants » (les ~5 000 épars sans choix posé à la main), en m'appuyant sur le moteur de suggestion existant. Elle est écrite comme **hypothèse assumée** dans `plan.md` (D1), avec l'alternative écrite noir sur blanc : si vous préférez, on ne copie que les fichiers dont le style a été choisi à la main avec `G` — la suggestion ne sert plus qu'à proposer.

Corollaire assumé, à connaître avant d'exécuter : une copie vers un dossier stylé **écrit le genre dans les tags** (épars + copie, contrat EPIC-043). C'est journalisé et annulable (`apply_styles.py --undo`), mais sur un lot de masse cela fait des milliers d'écritures.

## Ce que le plan réutilise au lieu de réinventer

`computeStatus` (le « manquant » = `nouveau`), `destFor`/`findEparsEntry`, `styleSuggest`, `buildCopyDialogSpec`/`confirmCopyDialog`, `copyFilesTo` (le chemin du flux `e`), `patchEparsFileAfterCopy`. **Aucune route backend nouvelle**, aucune suppression, `_trash` intouché.

## Score du plan —8/10

✓ **Sûr** : chaque brique existe déjà dans le dépôt (le plan n'invente pas de mécanisme) ; le découpage respecte la règle S4 du projet (≤3 fichiers par passe) ; la projection des phases couvre exactement les listes modify/create (aucun delete) ; le wireframe est ancré sur la structure réelle du template ; les tests s'appuient sur les fixtures vitest existantes.

✗ **Risques** : (1) **D1 non validée par vous** — c'est le point à trancher en premier ; (2) le coût de la suggestion : `suggestForEpars` sera appelé pour des milliers de fichiers, il faut mesurer le temps de calcul du plan avant de l'industrialiser ; (3) `templates/index.html` est modifié → **redémarrage de l'app obligatoire** (bundle figé) ; (4) la matrice clavier est une barrière CI : le binding `m` doit être déclaré sans shadowing, sinon `npm test` casse ; (5) le seuil de confiance du code (0.25) diffère du README (0.30) — j'aiAligné le plan sur le code, la dérive documentaire reste ouverte.

Prochaine étape possible : je peux exécuter la phase 1 (extraction DRY, zéro changement de comportement) ou d'abord figer D1 avec vous.
