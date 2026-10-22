Plan written. Nothing else in the repo was touched (`git status` shows only the new `aidd_docs/` tree).

## Fichiers écrits

```
aidd_docs/tasks/2026_10/2026_10_21_copier-tous-les-manquants/
├── plan.md        (5,7 K)
├── phase-1.md     (4,9 K)  Confinement du chemin de POST /copy
├── phase-2.md     (6,5 K)  Le plan « manquants » — calcul pur
├── phase-3.md     (10,5 K) Bouton, aperçu et application du lot
└── phase-4.md     (4,2 K)  Traçabilité EPIC-057 et documentation
```

Aucun `backlog-link.json` : la source est un texte brut, elle ne nomme ni ticket ni fichier de backlog (règle de l'action `04`).

## Dérive par rapport à votre consigne « attends mon accord »

La question interactive a été annulée par le harnais (« This non-interactive run cannot ask the user questions »). J'ai donc continued avec les trois options que j'avais recommandées, et je les ai **écrites dans le plan** (commentaire de bas de `plan.md`) pour qu'elles soient corrigeables d'un coup d'œil :

1. « Les manquants » = statut `nouveau`, **jumeaux probables exclus** (sinon le lot crée des doublons).
2. Destination = **calculée par style** (choix de session `g`, sinon la suggestion automatique existante), pas le dossier surligné.
3. Le confinement de `POST /copy` est **une phase du plan**.

Une seule de ces trois est réellement structurante : si vous vouliez le dossier surligné à droite, la phase 2 disparaît au profit d'un simple appel à `copyFilesTo` — dites-le et je réécris.

## Revue du plan —8/10

**✓**
- « Manquant » n'est pas une notion inventée : c'est `computeStatus(...) === 'nouveau'`, déjà affiché comme `● N reste`.
- Le routage n'est pas inventé non plus : `destFor` + `suggestStyle` (seuil 0,25) existent déjà, et l'aperçu `e` (`stylePreview.ts`) fournit le patron exact — plan pur → modale → `copyFilesTo` par dossier.
- Le confinement arrive **avant** la feature, et `/copy` est bien la seule route d'écriture de fichier sans `is_path_allowed` (`/move`, `/delete`, `/mkdir` en ont un).
- Les phases sont livraison-unitaire vérifiable ; la projection couvre tout le modify/create (aucun delete).
- Numérotation vérifiée : EPIC-055 et 056 existent déjà → la nouvelle est **EPIC-057**.

**✗ risques**
1. **Le routage auto se trompe en série.** Le style est *inféré* (heuristique à 0,25), pas choisi. Si un sous-dossier épars entier mappe mal, tout un lot part dans le mauvais dossier — l'aperçu le montre avant l'écriture, mais un mauvais dossier confirmé reste un mauvais rangement.
2. **Les fichiers sans année sont exclus** d'un style daté. Sur cette collection (1 555 fichiers sans année sur 6 696), une part notable des manquants sera écartée du lot.
3. **Effet de bord tag massif** : `/copy` écrit le style du dossier cible dans l'épars **et** la copie (EPIC-043). Un lot de 300 fichiers = 300 écritures de genre sur le disque. C'est journalisé et `--undo`-able, et la modale le dit.
4. **300 requêtes + réécriture complète du journal à chaque copie** (`log_journal` relit et réécrit le JSON entier) → O(N²) d'E/S, et le journal plafonné à 500 entrées fait tourner l'historique.
5. `copyFilesTo` n'appelle pas `refreshDupMatches()` — défaut préexistant qui touche aussi l'aperçu `e`. Le plan ne le corrige que dans le nouveau flux (scope strict) : `e` garde son badge périmé.
6. Le confinement s'appuie sur `get_allowed_dirs()`, qui ne connaît que la config **active** : un appelant externe de `/copy` visant une autre racine serait refusé.
