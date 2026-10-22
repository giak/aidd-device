Plan écrit.

## Fichiers écrits

```
aidd_docs/tasks/2026_10/2026_10_21_copier-tous-les-manquants/
├── plan.md      (5,7 K)
├── phase-1.md   (5,6 K)
├── phase-2.md   (13,0 K)
└── phase-3.md   (7,0 K)
```

Aucun `backlog-link.json` : la source est du texte brut, elle ne nomme ni ticket ni artefact Markdown (04-plan, étape 2).

## Décisions actées

| Question | Choix retenu |
|---|---|
| Destination | Le dossier **surligné dans la colonne Source Data** — même règle que le F5 simple (`executeCopy` lit `#source-container .focused`, dossier parent si c'est une ligne de fichier) |
| « Manquant » | Statut `nouveau` de `computeStatus` — absent de Source Data **et** jamais copié. `traite` et `doublon` exclus |
| Filtre | Le lot respecte le chip Éparpillé (`sync-epars`) — le compte « ● N reste » de `#epars-status-line` est déjà ce compte filtré |

## Contenu du plan

- **Phase 1 — socle** : `render/copyAllMissing.ts` (fonction pure `collectMissingFiles`, zéro DOM, zéro `state`) + tests. Le filtre est appliqué avec **exactement** les mêmes champs et le même pli que `renderEpars`, sinon le lot et l'écran ne verraient pas le même ensemble.
- **Phase 2 — le bouton** : `#btn-copy-missing` dans le `<h2>` du panneau Éparpillé (classe `.panel-add-btn` existante → **aucun CSS nouveau**), destination résolue depuis le `.focused`, modale `confirmCopyDialog` existante (N fichiers → dossier, badge ➕, consentement style), exécution via `copyFilesTo` → **zéro backend**. Wireframe inclus.
- **Phase 3 — preuve et traçabilité** : test d'intégration (`POST /copy` mocké), signature de bundle dans `validate-build.js`, README (Sync + Limites connues), EPIC-057 + entrée d'index (convention `AGENT.md` ; les EPIC-055/056 en cours sont en backlog et ne chevauchent pas).

## Revue du plan (score 8,5/10 — non écrit dans les fichiers)

✓ **Solidité** — zéro backend, zéro CSS, zéro modification de fonction partagée (`makeFileEl` intact) ; le filtre et le statut réutilisent les implémentations existantes au lieu d'en créer une seconde.
✓ **Sécurité** — la modale existante est la porte unique avant écriture ; double-clic gardé ; le dossier créé est signalé.
✓ **Traçabilité** — EPIC-057, README, test d'intégration, preuve de build.

✗ **Risques assumés** — un lot de plusieurs centaines de fichiers enchaîne autant d'appels `/copy` (et autant d'écritures de tag style, EPIC-043) : la progression n'est visible que par le changement de LED, pas par un compteur.
✗ **Limite connue** — les homonymes probables ne sont pas exclus du lot (décision actée) : un quasi-doublon peut être créé, l'utilisateur le voit dans la modale.
✗ **Point de friction** — modifier `templates/index.html` impose un redémarrage de l'app (Flask compile le template au chargement) ; c'est signalé dans la phase 2.
✗ **Non couvert** — pas de raccourci clavier (la matrice EPIC-031 reste intacte) : le geste reste un clic de souris, là où le reste de l'app est pilotable au clavier.
