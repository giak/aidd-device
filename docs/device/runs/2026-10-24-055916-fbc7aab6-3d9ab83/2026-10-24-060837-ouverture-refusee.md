---
name: Note — l'ouverture a refusé, le run a conclu
description: "ouvrir sort en 1 sur une session qui a fini sans question, alors que le cas déclare pause.requis: false ; le fil est resté lisible, suite a mesuré, le reçu dit conforme sans morsure"
type: run-note
status: done
---

# Note — l'ouverture a refusé, le run a conclu

> Note datée du **2026-10-24 à 06:08:37** (`date`). Elle ne remplace ni le reçu ni l'output ; elle dit ce
> que la clôture de l'ouverture a fait, et ce que le reçu n'en porte pas.

## Le fait

- `orchestrer.mjs ouvrir` a ouvert la session `ses_e93ef8d88ffeg5U044HxnHrQIm` dans le terrain, envoyé le
  `texte-a-remettre.txt` de la porte, puis **sorti en `1`** : « la session … s'est arrêtée sans question
  après 0 réponse(s) jouée(s) … le run n'est pas un succès à zéro question ».
- Le cas `2026-10-24-055310-shadow-areas-design` déclare `attendu_details.pause.requis: false` : le skill
  `03-shadow-areas` ne pose aucune question, et la requête lui interdit d'en poser une. Zéro question est
  donc la forme attendue, pas un arrêt manqué.
- La règle qui refuse (`orchestrer.mjs`, ADR-077 : « une session arrêtée sur un texte qui ne demande rien
  n'est pas un run fini ») ne lit pas `pause.requis`. Elle protège une pause qui existe ; sur un cas qui
  n'en déclare aucune, elle refuse la clôture normale du skill.
- Le refus nomme lui-même la suite : « réponds à la main, puis `suite --fil <id>` ». Aucune question
  n'étant posée, il n'y avait rien à répondre ; `suite` a été joué sur le fil nommé, avec `--client
  opencode` et `--conduite agent`.
- Le produit existe : `terrain/docs/superpowers/specs/2026-08-01-carte-visite-v2-design-shadow-report.md`,
  18 écarts, 0 blocker, 11 major, 7 minor ; la source garde son `sha256` et `git status --porcelain` ne
  montre que ce fichier.

## Le verdict

Le reçu porte `conforme` : aucun falsificateur ne mord, ni sur `P` (rapport présent, nom dérivé, catégories
et sévérités verrouillées, chaque question finit par `?`, pas de `status: clean` avec des majors, source
intacte), ni sur F3 à F9. La lecture du rapport par le juge est la vérification de `P` ; le harnais ne la
dérive pas.

Ce que le verdict n'achète pas : le chemin heureux de l'orchestrateur. `ouvrir` a refusé, et le run a été
conduit jusqu'au reçu par la porte de sortie que ce refus nomme. Un `conforme` de ce run atteste le produit
et la trace, pas que `ouvrir` sait clore un skill qui ne pause pas.

## Ce qui n'est pas fait

- `orchestrer.mjs` n'est pas modifié : faire lire `pause.requis` à la règle d'ADR-077 demanderait son propre
  cas, son contrôle de banc et une décision, pas un correctif de passage.
- Aucune revue indépendante ; le réseau n'est pas coupé ; la conduite est déclarée, jamais vérifiée.
