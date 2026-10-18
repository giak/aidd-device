---
name: Tableau de bord
description: État d'avancement réel du projet, l'état courant prime sur toute mémoire, à jour après chaque séance
type: dashboard
status: in-progress
---

# DASHBOARD — État d'avancement

> Dernière mise à jour : 2026-10-18 (Séance 55, H6 — la forme mécanique du tableau est écrite, ce que F1 et F2 lisent désormais ([ADR-035](DECISIONS.md)) : `receipt` rend `tableau{forme, present, seq, ts, lignes, colonnes}` et trois falsificateurs de plus, l'export du §1.5 gagne `outil` et `chemin_outil`, le banc passe à **118/118 PASS**, `exit 0` ([spec](tasks/2026_10/2026-10-17-140536-durcissement-du-recu/2026-10-18-071627-spec-h6.md)) ; deux commits, `7e05b9c` (la spec de l'orchestrateur et le premier `gate.json` réel) et `dbd85ba` (H6), puis une **porte neuve** passée à `07:56:25` sur cette révision propre, `docs/device/runs/2026-10-18-075625-4c39e5c5-dbd85ba/`, en attente de son fil ; Séance 54 — l'orchestrateur interactif : « test ça », brainstorm et spec écrites, **en attente d'approbation** ([spec](tasks/2026_10/2026-10-18-070820-orchestrateur-interactif-du-test/2026-10-18-071018-spec.md)) ; Séance 53 — les trois chapitres minimaux du guide, écrits et éprouvés ([guide](guide-du-test-de-bout-en-bout.md), 256 lignes, sorties observées) ; Séances 28 à 31, la copie du cas vérifiée avant le geste ([liste de contrôle](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-17-095643-liste-de-controle-ouverture-second-run.md)), le contrôle négatif ouvert ([NEGATIVE.md](device/NEGATIVE.md)), l'écart du premier run rédigé dans la forme de la PR ([ECART.md](device/runs/2026-10-15-171559-4c39e5c5-1d471a5/ECART.md)), et la liste suivie à blanc sur une copie jetable : six trous trouvés, deux branches de `collect` et un reçu à 20 champs éprouvés `exit 0` ([répétition](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-17-100609-repetition-a-blanc-de-l-ouverture.md)))
> Source de vérité pour « où en est le projet ? ». Mettre à jour après chaque séance.

## 1. Statut global

🟢 **Fondation documentaire en place, dispositif prêt à ouvrir — boucle 2 ouverte, en itération**

| Domaine | Statut |
|---|---|
| Fondation documentaire B1–B6 | 🟢 approuvée, appliquée ([ADR-001](DECISIONS.md), commit `1bbb9d2`) |
| Phrase fausse dans `AGENTS.md` | 🟢 corrigée sur place (659 parts d'outils ; [ADR-006](DECISIONS.md)) |
| Journal des séances | 🟢 vivant ([trace.md](trace.md), Séance 6) ; les séances 2 et 4 sont sorties du journal avec le dossier du contrat (commit `8b52313`) |
| Boucle 2 : gestion de projet | 🟨 spec écrite, en itération ([ADR-005](DECISIONS.md)) |
| Cadre d'output de l'agent | 🟢 appliqué à `AGENTS.md` §OUTPUT |
| Le protocole de test (MEGA-PROMPT v6) | 🟨 en construction par le dispositif : l'instrument existe (harnais, banc, cas gelé) et **un run réel a eu lieu** ; ce qui manque n'est pas l'outil mais le résultat — l'écart d'un run qui produit (§1 de la ligne suivante) |
| Le dispositif (v6 §10) | 🟨 `DEVICE.md`, `BOUNDARY.md`, le harnais à six commandes et le premier `CASES/` **re-gelé** ([docs/device/](device/DEVICE.md), [ADR-013](DECISIONS.md), [ADR-014](DECISIONS.md)) ; **un premier run a eu lieu** le 2026-10-15 — la session a lu le dépôt et **n'a rien produit**, verdict `non concluant` ([son PV](device/runs/2026-10-15-171559-4c39e5c5-1d471a5/PV.md)) ; les trois trous qu'il a ouverts sont comblés (reçu sans produit, chemin du §5, falsificateur `F9`), la sonde du client est faite (§1.7 de la conduite, 2026-10-16) et **le second run n'attend plus qu'un fil neuf** dans le projet ouvert le 2026-10-17 (§3.1) |
| Dossier du contrat | 🟢 **retiré du dépôt** le 2026-10-16 (commit `8b52313`, poussé) : 43 fichiers, 479 189 octets de contenu (le message du commit en annonçait « 564 Ko » sur disque, chiffre non reproduit ici), les ADR-007, 008, 009, 010 et 012, et les passages du journal et de cette page qui en parlaient. `AGENTS.md` et les trois `.agents/skills/` restent, désormais **seules copies** des quatre artefacts ; l'historique git garde tout (`git restore --source=8b52313~1 docs/contracts`) |

## 2. Documents produits

| Document | Fichier | Statut |
|---|---|---|
| Vision | `docs/VISION.md` | 🟢 v0.1 |
| Bilan du projet | `docs/brainstorm/2026-10-16-153204-bilan-du-projet.md` | 🟢 écrit le 2026-10-16 (Séance 21) : tour complet, mesures, réparations, évaluation de l'architecture, ce qui reste |
| Relecture à froid des entrées | `docs/brainstorm/2026-10-16-133942-relecture-a-froid-des-entrees.md` | 🟨 six décrochages mesurés, **six traités** le 2026-10-16 (Séance 21) ; ses trois manques transverses restent ouverts |
| PFD | `docs/PFD.md` | 🟢 v0.2 |
| Registre d'ADR | `docs/DECISIONS.md` | 🟢 ouvert |
| Dashboard | `docs/DASHBOARD.md` | 🟢 ce fichier |
| Fondation documentaire | `docs/brainstorm/2026-10-15-080225-fondation-documentaire.md` | 🟢 appliquée |
| Boucle 2 | `docs/brainstorm/2026-10-15-081511-gestion-de-projet.md` | 🟨 en itération |
| Journal | `docs/trace.md` | 🟢 vivant |
| Architecture du protocole | `docs/ARCHITECTURE.md` | 🟨 écrit le 2026-10-16 (Séance 6, suite) : acteurs, arbres, six commandes, vie des artefacts, falsificateurs et plafond du verdict, **5 schémas mermaid** rendus et libellés relus en SVG ; les autres pages y renvoient, la page ne les recopie pas. **Rectifiée le même jour (Séance 16)**, chaque chiffre relu contre sa pièce : le gabarit du nom d'un run (un `@` que le nom réel n'a pas), le marqueur `.freebuff/project-id` du client dans « qui écrit où », et ce que la sonde du client a mesuré aux limites — les cinq schémas restent **intacts**. **Complétée le même jour (Séance 17)**, second contrôle, trois réparations : le banc du harnais entre au §4 et à la carte du §9, `last-message.md` revient sous `raw/<cas>/` (spec §4), `produit.absent` est rendu au reçu ; les cinq schémas re-rendus, 5/5 `exit 0`, et `cmp` identique après la dernière réparation |
| Explication pour débutants | `docs/EXPLICATION.md` | 🟢 écrit et commité (`41f531c`, revu en `6789bec`), 3 schémas mermaid |
| Orchestrateur interactif — le brainstorm | `docs/brainstorm/2026-10-18-070921-orchestrateur-interactif-du-test.md` | 🟨 166 lignes, né à `07:09:21` (`stat -c %w`) : la promesse (« test ça » et être pris par la main), les trois formes possibles et la préférence pour un couple page + commande, le partage machine / trois gestes humains (aucune interface de ligne de commande n'ouvre un fil ; la base du client est la seule source de la trace), la fabrique de cas et son mur, le contrat de narration en six lignes, cinq falsificateurs O1 à O5, les décisions ouvertes |
| Orchestrateur interactif — la spec | `docs/tasks/2026_10/2026-10-18-070820-orchestrateur-interactif-du-test/2026-10-18-071018-spec.md` | 🟨 205 lignes (201 à l'écriture, le décalage des ADR du 2026-10-18 en ajoute quatre), née à `07:10:18`, **`status: pending`** : cinq critères d'acceptation falsifiables, cinq sous-commandes (`cas`, `porte`, `suite`, `fin`, `lire`) avec options et codes `0/1/2`, ce que chacune écrit et ne touche jamais, quatre formes de bloc à six lignes, gabarits de demande et de squelette d'attendu (`a_remplir` → limite `attendu_incomplet`), douze refus, dix contrôles à partir du 119, trois ADR (036 à 038, décalées le 2026-10-18 pour laisser 035 à H6), trois phases ; **rien n'est codé avant approbation** |
| Durcissement du reçu — H6 | `docs/tasks/2026_10/2026-10-17-140536-durcissement-du-recu/2026-10-18-071627-spec-h6.md` | 🟢 159 lignes, née à `07:16:27`, **`status: done`** : la forme mécanique du tableau (bloc d'au moins trois lignes dans une part `text` d'un message `assistant`, séparatrice en deuxième ligne, au moins deux cellules), l'instant qu'elle donne à F1, l'acte d'écriture reconnu à un nom de la famille **et** un chemin nommé (`input.path`, mesuré : `write_todos` n'écrit pas un fichier), les deux champs que l'export gagne, trois refus, deux limites, six contrôles (113 à 118) ; ce que H6 ne mesure pas est dit, et aucun cas n'est retouché |
| Guide d'usage — la version minimale | `docs/guide-du-test-de-bout-en-bout.md` | 🟨 écrit le 2026-10-18 (Séance 53), **262 lignes, 2 015 mots** après la remesure du 2026-10-18 (Séance 55) : trois chapitres sur les sept du plan (lire un reçu, rejouer un gel, provoquer trois refus), chacun avec son geste copiable, sa sortie **observée** le 2026-10-18, un refus provoqué et le mot qu'il installe ; le chapitre 1 lit un reçu de **banc** (aucun `receipt.json` n'existe encore, mesuré par `find` le 2026-10-18), le chapitre 2 rejoue la formule du §1.1 de la conduite et casse le gel dans un clone jetable, le chapitre 3 provoque trois refus sans session (`exit 1`, `2`, `1`) ; contrôles : banc **112/112 PASS**, `liens.mjs` 35 fichiers, **377** liens, **0 mort**, `exit 0` ; chapitre 1 remesuré le 2026-10-18 après H6, banc **118/118 PASS** et reçu à sept champs (`tableau` compris) |
| Bilan du premier run | `docs/brainstorm/2026-10-15-201458-bilan-premier-run.md` | 🟢 écrit après le run et commité (`d0d894b`) : 4 causes du `non concluant`, 6 schémas, 2 arbitrages, 8 brainstorm — la page à lire avant de reprendre |
| Dispositif — la page | `docs/device/DEVICE.md` | 🟨 v0.1, **896 mots** (`wc -w`, mesuré le 2026-10-16) : le plafond du v6 §10 est de 900, et la page le dépassait (1 004) avant la Séance 21 |
| Dispositif — la frontière | `docs/device/BOUNDARY.md` | 🟨 v0.1, **1 970 mots** (`wc -w`, remesuré le 2026-10-16 après la Séance 21 ; la page avait annoncé 1 563, puis 1 686) |
| Dispositif — le harnais | `docs/device/harness/run.mjs` | 🟨 **1 742 lignes, 148 refus, 6 commandes** (`faits` entre le 2026-10-17, [ADR-024](DECISIONS.md) : les seize valeurs exigées par le reçu, dérivées du fil et du gel, et un chemin qui ne résout pas refusé) ; `freeze --racine` déclare la racine des espaces de travail une seule fois et en dérive les deux copies du cas (ADR-019), `preflight` (ADR-018) refuse d'autoriser l'ouverture hors de l'espace de travail gelé et vérifie le texte remis (`--texte`), `collect` refuse un `--from` hors de l'arbre `travail` du gel et le reçu y relit la provenance (ADR-020), et `receipt` n'accepte plus un autre des quatre arbres, et refuse depuis l'ADR-025 un `faits.json` dont les chemins ne se situent pas, en comparant l'arbre du run après résolution des liens ; `collect --sans-produit` ouvre le chemin de la spec §9 (un run qui ne produit rien laisse un `receipt.json` et un `output.json`) ; banc né jetable le 2026-10-15 (36/36), 12/12 sur le re-hachage du cas (reçu et jugement), **46/46** sur la porte, la racine déclarée, l'origine du produit et la non-régression (13 contrôles pour la porte dont 9 refus, 11 pour la racine, 15 pour l'origine), et le banc du 2026-10-15 sur le chemin sans produit ([bilan](brainstorm/2026-10-15-201458-bilan-premier-run.md) §9) ; **son foyer a changé le 2026-10-16** : le banc vit au dépôt, `docs/device/harness/banc-harnais.sh`, renommé avec son foyer et lisant ses faits de machine au gel ([BANC.md](device/BANC.md), [ADR-022](DECISIONS.md)) ; rejoué le même jour depuis le dépôt, **46/46 PASS**, `exit 0` ; le 2026-10-17, `faits` entre, puis `receipt` situe les chemins de `faits.json`, et le banc passe à **56/56 PASS** ; la même journée, l'ADR-026 fait déclarer et sonder les prérequis (`git`, `date` GNU, `sqlite3`) au démarrage, puis l'ADR-027 ajoute `liens.mjs`, le contrôle de liens qui compte hors code, l'ADR-028 rattache `session.identifiant` au fil que la commande d'export lit, et l'ADR-029 fait lire l'export au reçu pour compter les échanges de la fenêtre (condition 2 du §5), banc **67/67 PASS**, `exit 0` ; le même jour encore, les ADR-030, 031 et 032 font re-hacher la copie sous `raw/`, relire la base que `faits.json` nomme, rejouer l'export du §1.5 et hacher la trace que `compare` re-hache à son tour, banc **96/96 PASS**, `exit 0` ; et l'ADR-033 mesure le budget d'échanges du cas contre les messages `user` du fil, refuse un dépassement et nomme l'échange qui a épuisé un budget atteint, banc **102/102 PASS**, `exit 0` ; et le 2026-10-18, l'ADR-035 lit la forme mécanique du tableau rendu par la session (F1 et F2), l'export gagne `outil` et `chemin_outil`, et le banc passe à **118/118 PASS**, `exit 0` |
| Dispositif — l'écart du premier run | `docs/device/runs/2026-10-15-171559-4c39e5c5-1d471a5/ECART.md` | 🟨 rédigé le 2026-10-17 dans la forme que la pull request attend (phrase de verdict, écart nommé, limites qui mordent dont `F2`, `F8`, `F9`, preuve du contrôle négatif, révisions, clone, commande qui refait le run, ce qui manque) : **aucun lien markdown**, chemins en `backticks` ; il n'est **pas** commité dans une PR, faute de PR |
| Dispositif — la répétition à blanc de l'ouverture | `docs/tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-17-100609-repetition-a-blanc-de-l-ouverture.md` | 🟢 faite le 2026-10-17 sur une copie jetable : gel rejoué au même `0d9a2180`, porte `exit 0`, `collect`/`receipt`/`compare` `exit 0` **dans les deux branches** (produit et sans produit), reçu à 20 champs, `output.json` à 11 ; **six trous trouvés dans la liste**, tous réparés ; ce qui n'a pas pu être éprouvé est dit (fil, texte, premier message) |
| Dispositif — le premier run | `docs/device/runs/2026-10-15-171559-4c39e5c5-1d471a5/PV.md` | 🟨 conduit le 2026-10-15 (`17:15:59`–`17:29:51`) : un échange consommé sur trois, aucun tableau rendu, aucun fichier produit, verdict `non concluant` — **sans reçu ni `output.json`**, ce run étant antérieur au chemin sans produit ; le harnais sait désormais l'écrire (spec §9, `collect --sans-produit`), la pièce reste donc telle quelle : ce qui reste ouvert est le **run**, plus l'outil |
| Dispositif — la liste de contrôle de l'ouverture | `docs/tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-17-095643-liste-de-controle-ouverture-second-run.md` | 🟨 écrite le 2026-10-17 : l'état mesuré de la copie (porte `exit 0`, gel `11/11` `True`, texte `832036f7` 254 o, projet `terrain-38d8d3f1` sur `<W>/terrain`, 0 fil), les commandes du geste avec leur valeur attendue, et la prédiction `?? .freebuff/` de la conduite §1.7, mesurée fausse |
| Dispositif — le contrôle négatif | `docs/device/NEGATIVE.md` | 🟨 v0.1, écrit le 2026-10-17 : une phrase de `02-project-memory/SKILL.md` retournée (`End with a short report…` → `Never report…`, 1 223 → 1 209 o, `149f0f19…` → `329852d0…`) dans un banc jetable sous `/tmp` ; la copie intacte rend `exit 0`, la copie cassée `exit 1` avec le fichier, les deux empreintes et le chemin. Ce qui manque est nommé : le produit jugé `écart`, donc la moitié de la question 6 du §11 |
| Dispositif — rejouer le gel | `docs/device/REPLAY.md` | 🟨 la recette qu'un inconnu suit depuis un clone neuf : un bloc, la sortie observée, quatre limites |
| Dispositif — le banc du harnais | `docs/device/BANC.md` | 🟨 v0.2, écrit le 2026-10-16, **118 contrôles** depuis le 2026-10-18 (113 à 118 : la forme mécanique du tableau, H6, [ADR-035](DECISIONS.md)) : les refus et les acceptations de `run.mjs` et de `liens.mjs`, où ils vivent, comment les lancer, ce qu'ils lisent dans le gel et ce qu'ils ne prouvent pas ([ADR-022](DECISIONS.md), [ADR-027](DECISIONS.md), [ADR-030](DECISIONS.md), [ADR-031](DECISIONS.md), [ADR-032](DECISIONS.md), [ADR-033](DECISIONS.md)) |
| Dispositif — le premier cas | `docs/device/CASES/` (demande, attendu, gel) | 🟨 écrit le 2026-10-15, **re-gelé** après le premier run (`gele_le` `2026-10-15T22:11:24.782242943+0200`, empreinte **`0d9a2180`**, les anciens `bc126fe6`, `38fa91f4` et `07246039` détruits, après trois passes de rectification, le déplacement de l'espace de travail puis la racine déclarée) : le cas nomme `$RACINE` — la racine que le gel déclare une seule fois, et dont les deux copies du cas sont dérivées ([ADR-019](DECISIONS.md)) — le texte du §5 porte un **chemin absolu** après substitution (le relatif ne résolvait pas depuis la racine de projet de la session) et la porte le vérifie (`preflight --texte`), l'attendu porte **9 falsificateurs** avec `F9` (la lecture de la révision sous test) et 4 de l'attendu ; rejeu du gel `exit 0` ([bilan](brainstorm/2026-10-15-201458-bilan-premier-run.md) §6.1). **Remesuré le 2026-10-16** : demande `5aac04fb…` (13 413 o), attendu `ae4914c5…` (15 423 o), gel à `2 fichiers` et `8 références`, racine `…/aidd-device-work`, les deux copies au repos (`framework-origin` `4c39e5c5`, `terrain` `416ec1f`, `porcelain` 0 ligne), et `preflight --case … --repertoire <W>/terrain --texte <W>/texte-a-remettre.txt` rend « ouverture autorisée », `exit 0` |

## 3. Prochains pas (TODO court terme)

1. **La sonde du client est faite (2026-10-16, Séance 15) ; ce qui reste est un geste, pas une
   mesure.** Le client du second run est **Freebuff**, à modèle hébergé ; la
   [conduite](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md) §1.5
   et §1.6 portent la source de trace et la lecture de la fenêtre, et son **§1.7** ce que la sonde a rendu :
   les foyers du client (`~/.config/freebuff-desktop/`, `~/.config/Freebuff/`, `~/.freebuff/`, et
   `.freebuff/project-id` écrit **dans l'arbre ouvert**) ; le mode **worktree** à refuser, un fil pouvant
   créer une **branche** dans la copie du cas ; la racine de projet, les onze projets portant des racines
   absolues quelconques, dont une en `/tmp` — rien n'interdit `<W>/terrain` ; le texte remis **octet pour
   octet** (`cmp` identique sur deux échantillons, aucun guillemet ajouté, l'inverse d'`opencode` au
   premier run) ; la lecture **hors de la racine** libre, donc le `..` du bilan §11 n'est pas bloqué ; et
   l'export de trace rejoué tel quel (**694 lignes**, huit genres, `notice` compris). Reste un geste de
   l'opérateur, pas une mesure : **ouvrir un fil neuf, en mode direct**. Ce qui a changé le 2026-10-17 :
   le projet `terrain-38d8d3f1` existe et pointe `<W>/terrain` (`select root_path from projects`, le même
   marqueur `project-id` de 37 o écrit à 09:50:56), la base du projet compte **0 fil** et **0 message**,
   et `git worktree list` ne rend qu'une entrée, `416ec1f (detached HEAD)`. La ligne qui disait « aucun
   projet Freebuff ne pointe l'espace de travail gelé » était vraie au 2026-10-16 et ne l'est plus ; les
   commandes de vérification du fil, elles, sont dans la
   [liste de contrôle du 2026-10-17](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-17-095643-liste-de-controle-ouverture-second-run.md).
2. **Puis le second run**, sur le gel `0d9a2180`, trois échanges, session neuve (bilan §11, étape 4).
   Son ordre exact : la [conduite](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md).
3. **Puis l'écart, même si le run ne produit rien** : `collect --sans-produit`, `receipt`, `compare`
   (étapes 5 et 6), avec l'entrée au journal de la séance.
4. **`NEGATIVE.md` est ouvert le 2026-10-17** (Séance 29) : la casse volontaire est signalée par la chaîne de preuve, `exit 1`, mais le contrôle comportemental — un produit jugé `écart` — attend un run qui produit. **`ECART.md` est rédigé le 2026-10-17** au foyer du run, mais sa destination — `aidd_docs/tasks/<mois>/<dossier>/ECART.md` dans un working copy de la PR du framework — n'existe pas encore.
5. **P6 close le 2026-10-16, P5 ouverte** : le remote (`origin`, public) porte `main` depuis le 2026-10-15
   et `AGENTS.md` **déclare** désormais son adresse (ligne 11, commit `0fd34d7`, journée poussée le jour
   même) — c'était la seule moitié de P6 qui restait. **Restent ouverts, sans action ce jour** : l'arbitrage
   de la boucle 2 sur le commit debout (P5) et le frontmatter des trois skills (`name`;`description` là où
   `CONSIGN` en nomme quatre), laissé `OPEN` par la Séance 5, faute de `drift` établi. Après quoi seulement : la boucle 3, le protocole de test du framework (MEGA-PROMPT v6).

**Ce qui est fermé depuis le bilan du premier run** : ses trois trous le sont tous — reçu d'un run sans
produit (spec §9, `collect --sans-produit`), chemin du §5 qui ne résolvait pas ([ADR-019](DECISIONS.md),
racine déclarée + `preflight --texte`), et lecture de la révision sous test non mesurée (`F9` dans
l'attendu). Les 4 causes, les arbitrages et les brainstorm qui restent se lisent au
[bilan du premier run](brainstorm/2026-10-15-201458-bilan-premier-run.md).

## 4. Commits d'avancement

| Commit | Contenu |
| --- | --- |
| `1bbb9d2` | fondation documentaire B1–B6, journal recréé, phrase corrigée, appareil du 14 retiré |
| `326a5be` | structure deuteros : VISION, PFD, DECISIONS, DASHBOARD, spec boucle 2 |
| `9768b4c` | `AGENTS.md` en contrat autonome, et cadre d'output implémenté |
| `41f531c` | `EXPLICATION.md`, le projet raconté à qui n'en connaît rien |
| `6789bec` | la porte d'avant la session, la racine déclarée et l'origine du produit (14 fichiers, +677/−110) |
| `8b52313` | le dossier du contrat sort du dépôt (46 fichiers, +67/−7 877) |
| `d239b08` | le journal porte cette mise au dépôt et le sort des skills ; `HEAD` au `2026-10-16T09:16:08+02:00`, 36 commits, `origin/main` au même sha |
| `64901e3` | Séances 15 à 18 au dépôt : [ADR-023](DECISIONS.md) (le nom du dossier d'un run s'écrit en tirets, `framework@rev` est la notation du v6), `ARCHITECTURE.md` réparée trois fois, la conduite §1.7 pour la sonde du client Freebuff (7 fichiers, +445/−29) — **non poussé** |
