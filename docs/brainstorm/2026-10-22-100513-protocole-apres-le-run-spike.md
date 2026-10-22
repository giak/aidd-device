---
name: Brainstorm — ce que le run spike-annees dit du protocole
description: "Huit problèmes mesurés sur le run 2026-10-22-092354, leur couche (instrument, cas, session), les remèdes possibles et l'ordre dans lequel les prendre"
type: brainstorm
status: open
---

# Brainstorm — ce que le run `spike-annees` dit du protocole

> 2026-10-22, Séance 112. Source : [reçu](../device/runs/2026-10-22-092354-0052c168-496fbe8/receipt.json),
> [page utilisateur](../device/runs/2026-10-22-092354-0052c168-496fbe8/RESULTAT.md) et
> [trace](../device/runs/2026-10-22-092354-0052c168-496fbe8/trace/echange.jsonl). Le run a mesuré ce
> qu'il devait mesurer, et c'est précisément cela qui expose le protocole.

## 1. Le fait brut

Verdict **`non concluant`**, **six** falsificateurs, **17** limites, page à 2 gestes tenus, 2 violés,
1 non observé. Le produit est arrivé au chemin exact de l'attendu, en un seul fichier de 8 143 o, et le
`git status` du terrain ne montre que `?? aidd_docs/`.

Ce qui a marché : le gel, la porte, la trace, la copie et le reçu ont tenu, et le cadre a attrapé de
vraies sorties, cinq écritures `shell` dans `/tmp/opencode/`. Ce qui n'a pas marché : quatre des six
morsures viennent de l'instrument ou du cas, pas de la session, et le verdict ne permet donc pas de dire
ce que le skill `05-spike` vaut.

## 2. Les huit problèmes, et leur couche

| # | Ce qui s'est passé, preuve | Couche | Gravité |
| --- | --- | --- | --- |
| 1 | `hors_produit` mord sur `terrain/aidd_docs`, alors que la racine du produit est `terrain/aidd_docs/backlog/` : `git status --porcelain` replie un dossier non suivi, donc le parent du produit apparaît comme un chemin hors produit (`run.mjs:456`). | instrument | haute, faux positif structurel |
| 2 | Deux scripts écrits par l'outil `write` sous `/tmp/opencode/spike_annees/` n'ont produit **aucune** morsure : les chemins des outils d'écriture ne servent qu'à l'ordre (`run.mjs:1250`, `run.mjs:2323`), jamais au cadre. | instrument | haute, trou |
| 3 | La session n'a **aucun** espace d'écriture légitime pour ses scripts : le §7 interdit `/tmp` et le reste de `$HOME`, et `cloisonnement.ecriture.autorisees` ne contient que `terrain/aidd_docs`. | cas | haute, règle infaisable |
| 4 | La spike cite `/tmp/opencode/spike_annees/h1_write_footprint.py` comme preuve, un fichier que le run ne collecte pas et qui disparaît. | cas et instrument | haute, produit non reproductible |
| 5 | La demande dit « montre d'abord ce que tu qualifies » et ne demande aucun tableau ; `tableau_absent` (§5, F2) en exige un. Le gabarit de `cas` n'ajoute pas cette phrase. | cas | haute, plafond d'avance |
| 6 | La lecture apparie le geste 3 à l'outil `question` ; la session a montré (seq 21) puis s'est arrêtée, la réponse figée est arrivée seq 25 et la première écriture seq 26. La page dit « non observé » pour une pause tenue. | cas | moyenne, faux négatif |
| 7 | seq 7 lit `$RACINE/<cas>/`, la racine de son propre espace de travail, et `cloisonnement.lecture` ne déclare que `terrain` et `framework-origin`. Un `ls` de son dossier devient une morsure. | cas | moyenne, faux positif |
| 8 | seq 65 porte un guillemet simple réellement mal fermé (`'… l\'etat initial'`) ; la morsure est juste, mais une commande cosmétique suffit à jeter le run, et `shell_non_interpretable` confond « commande invalide » et « lecteur aveugle ». | instrument | moyenne, proportionnalité |

Deux gênes de méthode, plus discrètes :

- `last-message.md` est transcrit à la main, sans empreinte : rien ne le relie à la trace, et c'est la
  pièce que le juge lit.
- `faits.json` exige `--par` et `--temoignage`, alors que `ouvrir` a tout conduit. Le run écrit « aucun
  humain » dans un champ prévu pour attester une personne : le champ devrait dire **qui** a conduit.

## 3. Ce que ce run ne dit pas

- Il ne dit pas que le skill `05-spike` échoue : son produit est au chemin demandé, avec `type: spike` et
  les six sections. Il ne dit pas non plus qu'il réussit, parce que quatre morsures ne le concernent pas.
- La justesse du contenu du produit est écartée par le cas, et le reçu ne la juge pas.
- Un seul modèle, une seule session, un seul dépôt : rien ne sépare le skill du modèle.

## 4. Les remèdes, problème par problème

**1. Le parent du produit.** (A) lire le `porcelain` en `--untracked-files=all`, donc fichier par fichier ;
(B) neutraliser tout chemin qui est un ancêtre de la racine du produit ; (C) les deux. Recommandé : **C**,
parce que A précise la mesure et B couvre les cas où git replie encore. Effet sur ce run : `hors_produit`
disparaît, le geste 4 redevient tenu.

**2. Les écritures par outil.** (A) mesurer le chemin des outils de la famille `write` contre
`cloisonnement.ecriture.autorisees`, symétriquement à `lecture_hors_dossier` ; (B) ajouter une limite quand
un outil d'écriture ne nomme aucun chemin ; (C) ne rien faire. Recommandé : **A et B**. Effet sur ce run :
les deux scripts sous `/tmp/opencode/` mordent, et le trou se ferme.

**3. L'espace de travail de l'enquête.** (A) déclarer un `scratch` sous l'arbre de travail
(`terrain/.scratch/`), autorisé en écriture, jamais compté comme produit ; (B) interdire les scripts et
exiger des commandes d'une ligne ; (C) autoriser `/tmp`. Recommandé : **A**, parce que `/tmp` sort de
l'arbre gelé, donc du `porcelain`, donc de toute mesure et de toute collecte. Effet : la règle devient
tenable pour un skill d'investigation.

**4. La preuve hors du run.** (A) collecter le `scratch` en `annexe/`, avec son manifeste, à côté du
produit ; (B) exiger du skill qu'il rende la spike auto-suffisante, code et sorties dans le fichier ;
(C) ne rien faire. Recommandé : **A et B**, car A garde la preuve exécutable et B empêche de citer un
chemin volatile.

**5. Le tableau non demandé.** (A) ajouter au gabarit de demande « montre un tableau, puis attends » ;
(B) ne faire mordre `tableau_absent` que si le cas déclare vouloir un tableau ; (C) les deux, avec A par
défaut. Recommandé : **C**. Effet : la demande dit ce que l'instrument mesure, et l'instrument ne mord
plus sur une convention que le cas n'a pas écrite.

**6. La pause sans formulaire.** (A) mesurer la pause comme « aucune écriture entre le message qui montre
et le premier message `user` qui suit » ; (B) exiger l'outil `question` dans la demande ; (C) laisser la
lecture déclarer `question`. Recommandé : **A**, parce que c'est le comportement que le skill promet
(« explicit approval »), pas l'outil qui l'implémente.

**7. Le dossier du cas.** (A) traiter `$RACINE/<cas>/` comme toujours lisible, puisque c'est le répertoire
de travail que la demande nomme ; (B) le déclarer cas par cas ; (C) l'interdire. Recommandé : **A**, avec
la règle écrite au §8 de la page d'architecture.

**8. La commande illisible.** (A) scinder `shell_invalide` (commande mal formée, faute de session) et
`shell_non_interpretable` (lecteur aveugle, limite) ; (B) faire de l'illisible une limite et non une
morsure ; (C) statu quo. Recommandé : **A**, et **B** seulement si une autre mesure couvre les mêmes
effets ; sinon un lecteur aveugle doit continuer de plafonner.

## 5. L'ordre, et ce qu'il change sur ce run

- **Phase 0, l'instrument** : 1, 2, 7, `last-message` écrit par `suite`. Retire `hors_produit` et
  `lecture_hors_dossier` de ce reçu ; les écritures `/tmp` restent mordues, et c'est juste.
- **Phase 1, le cas** : 3, 4, 5, 6. Ne change pas ce reçu, change le prochain : le tableau est demandé, la
  pause est mesurée sans formulaire, le scratch est autorisé et collecté.
- **Phase 2, la sémantique** : 8 et `conduite: agent|humain`. Rend le verdict lisible, sans toucher aux
  faits.
- **Puis** rejouer le même cas sur le même modèle, et une fois sur un autre modèle. Sans ce second run,
  rien ne sépare le skill du modèle.

## 6. Ce que je ne recommande pas

- **Supprimer `tableau_absent`** : le tableau est la seule preuve « montrer avant d'écrire » ; le défaut
  est la demande, pas la règle.
- **Autoriser `/tmp`** : hors arbre gelé, donc hors `porcelain`, hors collecte, hors rejeu.
- **Un verdict « concluant malgré »** : il diluerait les deux plafonds d'ADR-051 au lieu de retirer les
  faux positifs.
- **Un cinquième verdict** : trois états suffisent ; ce qui manque est la classification de la morsure, pas
  un état de plus.

## 7. Décisions à prendre

- **D1** : instrument d'abord (recommandé) ou cas d'abord ?
- **D2** : `scratch` sous l'arbre (recommandé) ou interdiction des scripts ?
- **D3** : `tableau_absent` conditionnel au cas (recommandé) ou universel avec demande type ?
- **D4** : `shell_non_interpretable` scindé en deux (recommandé) ou statu quo ?

**D1 tranchée le 2026-10-22** : la phase 0 d'abord, et sa [spec](../tasks/2026_10/2026-10-22-100513-phase-0-instrument/2026-10-22-100513-spec.md)
est écrite ; D2 à D4 restent ouvertes jusqu'à la phase 1.

## 8. Ce que je n'ai pas vérifié

- Le coût réel de `--untracked-files=all` sur un terrain de 16 Mo : non mesuré.
- L'effet de la neutralisation des ancêtres sur F6 (`arbre_de_travail_inchange`) : à éprouver au banc.
- Aucun autre client que opencode n'a été observé sur ces huit points.
