---
name: Tableau de bord
description: État d'avancement réel du projet, l'état courant prime sur toute mémoire, à jour après chaque séance
type: dashboard
status: in-progress
---

# DASHBOARD — État d'avancement

> Dernière mise à jour : 2026-10-16 (Séance 21 — tour complet du projet : DEVICE ramené sous son plafond de 900 mots, six pages remises au vrai, [bilan daté](brainstorm/2026-10-16-153204-bilan-du-projet.md))
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
| Le dispositif (v6 §10) | 🟨 `DEVICE.md`, `BOUNDARY.md`, le harnais à cinq commandes et le premier `CASES/` **re-gelé** ([docs/device/](device/DEVICE.md), [ADR-013](DECISIONS.md), [ADR-014](DECISIONS.md)) ; **un premier run a eu lieu** le 2026-10-15 — la session a lu le dépôt et **n'a rien produit**, verdict `non concluant` ([son PV](device/runs/2026-10-15-171559-4c39e5c5-1d471a5/PV.md)) ; les trois trous qu'il a ouverts sont comblés (reçu sans produit, chemin du §5, falsificateur `F9`) et **le second run n'attend que la sonde du client** (§3.1) |
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
| Architecture du protocole | `docs/ARCHITECTURE.md` | 🟨 écrit le 2026-10-16 (Séance 6, suite) : acteurs, arbres, cinq commandes, vie des artefacts, falsificateurs et plafond du verdict, **5 schémas mermaid** rendus et libellés relus en SVG ; les autres pages y renvoient, la page ne les recopie pas. **Rectifiée le même jour (Séance 16)**, chaque chiffre relu contre sa pièce : le gabarit du nom d'un run (un `@` que le nom réel n'a pas), le marqueur `.freebuff/project-id` du client dans « qui écrit où », et ce que la sonde du client a mesuré aux limites — les cinq schémas restent **intacts**. **Complétée le même jour (Séance 17)**, second contrôle, trois réparations : le banc du harnais entre au §4 et à la carte du §9, `last-message.md` revient sous `raw/<cas>/` (spec §4), `produit.absent` est rendu au reçu ; les cinq schémas re-rendus, 5/5 `exit 0`, et `cmp` identique après la dernière réparation |
| Explication pour débutants | `docs/EXPLICATION.md` | 🟢 écrit et commité (`41f531c`, revu en `6789bec`), 3 schémas mermaid |
| Bilan du premier run | `docs/brainstorm/2026-10-15-201458-bilan-premier-run.md` | 🟢 écrit après le run et commité (`d0d894b`) : 4 causes du `non concluant`, 6 schémas, 2 arbitrages, 8 brainstorm — la page à lire avant de reprendre |
| Dispositif — la page | `docs/device/DEVICE.md` | 🟨 v0.1, **896 mots** (`wc -w`, mesuré le 2026-10-16) : le plafond du v6 §10 est de 900, et la page le dépassait (1 004) avant la Séance 21 |
| Dispositif — la frontière | `docs/device/BOUNDARY.md` | 🟨 v0.1, **1 970 mots** (`wc -w`, remesuré le 2026-10-16 après la Séance 21 ; la page avait annoncé 1 563, puis 1 686) |
| Dispositif — le harnais | `docs/device/harness/run.mjs` | 🟨 882 lignes, **63 refus**, 5 commandes ; `freeze --racine` déclare la racine des espaces de travail une seule fois et en dérive les deux copies du cas (ADR-019), `preflight` (ADR-018) refuse d'autoriser l'ouverture hors de l'espace de travail gelé et vérifie le texte remis (`--texte`), `collect` refuse un `--from` hors de l'arbre `travail` du gel et le reçu y relit la provenance (ADR-020), et `receipt` n'accepte plus un autre des quatre arbres ; `collect --sans-produit` ouvre le chemin de la spec §9 (un run qui ne produit rien laisse un `receipt.json` et un `output.json`) ; banc né jetable le 2026-10-15 (36/36), 12/12 sur le re-hachage du cas (reçu et jugement), **46/46** sur la porte, la racine déclarée, l'origine du produit et la non-régression (13 contrôles pour la porte dont 9 refus, 11 pour la racine, 15 pour l'origine), et le banc du 2026-10-15 sur le chemin sans produit ([bilan](brainstorm/2026-10-15-201458-bilan-premier-run.md) §9) ; **son foyer a changé le 2026-10-16** : le banc vit au dépôt, `docs/device/harness/banc-harnais.sh`, renommé avec son foyer et lisant ses faits de machine au gel ([BANC.md](device/BANC.md), [ADR-022](DECISIONS.md)) ; rejoué le même jour depuis le dépôt, **46/46 PASS**, `exit 0` |
| Dispositif — le premier run | `docs/device/runs/2026-10-15-171559-4c39e5c5-1d471a5/PV.md` | 🟨 conduit le 2026-10-15 (`17:15:59`–`17:29:51`) : un échange consommé sur trois, aucun tableau rendu, aucun fichier produit, verdict `non concluant` — **sans reçu ni `output.json`**, ce run étant antérieur au chemin sans produit ; le harnais sait désormais l'écrire (spec §9, `collect --sans-produit`), la pièce reste donc telle quelle : ce qui reste ouvert est le **run**, plus l'outil |
| Dispositif — rejouer le gel | `docs/device/REPLAY.md` | 🟨 la recette qu'un inconnu suit depuis un clone neuf : un bloc, la sortie observée, quatre limites |
| Dispositif — le banc du harnais | `docs/device/BANC.md` | 🟨 v0.1, écrit le 2026-10-16 : les 46 contrôles qui éprouvent les refus et les acceptations de `run.mjs`, où ils vivent, comment les lancer, ce qu'ils lisent dans le gel et ce qu'ils ne prouvent pas ([ADR-022](DECISIONS.md)) |
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
   l'opérateur, pas une mesure : **aucun projet Freebuff ne pointe l'espace de travail gelé** —
   `select root_path from projects` sur les onze bases rend `/home/giak/projects/audio-sync-tool` (le
   terrain **original**) et `/home/giak/projects/aidd-device`, jamais `<W>/terrain`.
2. **Puis le second run**, sur le gel `0d9a2180`, trois échanges, session neuve (bilan §11, étape 4).
   Son ordre exact : la [conduite](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md).
3. **Puis l'écart, même si le run ne produit rien** : `collect --sans-produit`, `receipt`, `compare`
   (étapes 5 et 6), avec l'entrée au journal de la séance.
4. **Enfin `NEGATIVE.md`, puis `ECART.md`** (étape 7) : jamais ouverts à ce jour.
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
