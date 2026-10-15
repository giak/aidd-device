---
name: Tableau de bord
description: État d'avancement réel du projet, l'état courant prime sur toute mémoire, à jour après chaque séance
type: dashboard
status: in-progress
---

# DASHBOARD — État d'avancement

> Dernière mise à jour : 2026-10-15 (Séance 1, en cours)
> Source de vérité pour « où en est le projet ? ». Mettre à jour après chaque séance.

## 1. Statut global

🟢 **Fondation documentaire en place — boucle 2 ouverte, en itération**

| Domaine | Statut |
|---|---|
| Fondation documentaire B1–B6 | 🟢 approuvée, appliquée ([ADR-001](DECISIONS.md), commit `1bbb9d2`) |
| Phrase fausse dans `AGENTS.md` | 🟢 corrigée sur place (659 parts d'outils ; [ADR-006](DECISIONS.md)) |
| Journal des séances | 🟢 recréé ([trace.md](trace.md), Séance 1) |
| Boucle 2 : gestion de projet | 🟨 spec écrite, en itération ([ADR-005](DECISIONS.md)) |
| Cadre d'output de l'agent | 🟢 appliqué à `AGENTS.md` §OUTPUT ([ADR-009](DECISIONS.md)) |
| Le protocole de test (MEGA-PROMPT v6) | 🔲 rien construit — le vrai travail |
| Le dispositif (v6 §10) | 🟨 `DEVICE.md`, `BOUNDARY.md`, le harnais et le premier `CASES/` complet et gelé ([docs/device/](device/DEVICE.md), [ADR-013](DECISIONS.md), [ADR-014](DECISIONS.md)) ; **un premier run a eu lieu** le 2026-10-15 — la session a lu le dépôt et **n'a rien produit**, verdict `non concluant` ([son PV](device/runs/2026-10-15-171559-4c39e5c5-1d471a5/PV.md)) |

## 2. Documents produits

| Document | Fichier | Statut |
|---|---|---|
| Vision | `docs/VISION.md` | 🟢 v0.1 |
| PFD | `docs/PFD.md` | 🟢 v0.1 |
| Registre d'ADR | `docs/DECISIONS.md` | 🟢 ouvert |
| Dashboard | `docs/DASHBOARD.md` | 🟢 ce fichier |
| Fondation documentaire | `docs/brainstorm/2026-10-15-080225-fondation-documentaire.md` | 🟢 appliquée |
| Boucle 2 | `docs/brainstorm/2026-10-15-081511-gestion-de-projet.md` | 🟨 en itération |
| Journal | `docs/trace.md` | 🟢 vivant |
| Explication pour débutants | `docs/EXPLICATION.md` | 🟨 écrit, 3 schémas mermaid, non commité |
| Bilan du premier run | `docs/brainstorm/2026-10-15-201458-bilan-premier-run.md` | 🟨 écrit après le run : 4 causes du `non concluant`, 6 schémas, 2 arbitrages, 8 brainstorm — la page à lire avant de reprendre |
| Dispositif — la page | `docs/device/DEVICE.md` | 🟨 v0.1, 895 mots |
| Dispositif — la frontière | `docs/device/BOUNDARY.md` | 🟨 v0.1, 1 563 mots |
| Dispositif — le harnais | `docs/device/harness/run.mjs` | 🟨 882 lignes, **63 refus**, 5 commandes ; `freeze --racine` déclare la racine des espaces de travail une seule fois et en dérive les deux copies du cas (ADR-019), `preflight` (ADR-018) refuse d'autoriser l'ouverture hors de l'espace de travail gelé et vérifie le texte remis (`--texte`), `collect` refuse un `--from` hors de l'arbre `travail` du gel et le reçu y relit la provenance (ADR-020), et `receipt` n'accepte plus un autre des quatre arbres ; `collect --sans-produit` ouvre le chemin de la spec §9 (un run qui ne produit rien laisse un `receipt.json` et un `output.json`) ; banc jetable 36/36, 12/12 sur le re-hachage du cas (reçu et jugement), **46/46** sur la porte, la racine déclarée, l'origine du produit et la non-régression (13 contrôles pour la porte dont 9 refus, 11 pour la racine, 15 pour l'origine), et le banc du 2026-10-15 sur le chemin sans produit ([bilan](brainstorm/2026-10-15-201458-bilan-premier-run.md) §9) |
| Dispositif — le premier run | `docs/device/runs/2026-10-15-171559-4c39e5c5-1d471a5/PV.md` | 🟨 conduit le 2026-10-15 (`17:15:59`–`17:29:51`) : un échange consommé sur trois, aucun tableau rendu, aucun fichier produit, verdict `non concluant` — **sans reçu ni `output.json`** : le harnais refuse un produit vide (trou ouvert, PV §5) |
| Dispositif — rejouer le gel | `docs/device/REPLAY.md` | 🟨 la recette qu'un inconnu suit depuis un clone neuf : un bloc, la sortie observée, quatre limites |
| Dispositif — le premier cas | `docs/device/CASES/` (demande, attendu, gel) | 🟨 écrit le 2026-10-15, **re-gelé** après le premier run (`gele_le` 22:11:24, empreinte **`0d9a2180`**, les anciens `bc126fe6`, `38fa91f4` et `07246039` détruits, après trois passes de rectification, le déplacement de l'espace de travail puis la racine déclarée) : le cas nomme `$RACINE` — la racine que le gel déclare une seule fois, et dont les deux copies du cas sont dérivées ([ADR-019](DECISIONS.md)) — le texte du §5 porte un **chemin absolu** après substitution (le relatif ne résolvait pas depuis la racine de projet de la session) et la porte le vérifie (`preflight --texte`), l'attendu porte **9 falsificateurs** avec `F9` (la lecture de la révision sous test) et 4 de l'attendu ; rejeu du gel `exit 0` ([bilan](brainstorm/2026-10-15-201458-bilan-premier-run.md) §6.1) |

## 3. Prochains pas (TODO court terme)

1. **Le premier run a eu lieu** (2026-10-15, session `opencode`, `ses_ebfdd6595ffentQru7gA9UPLSc`) et
   s'est conclu `non concluant` : la session n'a rendu aucun tableau et n'a rien écrit sous
   `terrain/aidd_docs/` ([PV](device/runs/2026-10-15-171559-4c39e5c5-1d471a5/PV.md)). L'ordre de
   reprise, les 4 causes, les arbitrages et les brainstorm sont au
   [bilan du premier run](brainstorm/2026-10-15-201458-bilan-premier-run.md), dont les contrôles rejoués
   le soir (gel `exit 0`, 4 arbres, 40/44 fichiers identiques à la copie installée, 6/6 schémas rendus).
   Quatre choses à
   trancher avant le second run : **le harnais ne sait pas produire de reçu pour un run sans produit**
   (spec §9 le prévoit, `collect` refuse, donc `receipt` puis `compare` refusent) ; et **le chemin du §5
   de la demande ne résout pas** depuis l'ouverture que la conduite §2.1 prescrit (`$W/terrain`), la
   session l'a mesuré et est allée lire la copie installée de la skill plutôt que la révision sous test ;
   et **aucun falsificateur ne mesure la lecture** — rien n'a signalé que le cas avait mesuré un autre
   objet que la révision sous test (la copie installée diverge sur 4 fichiers dont 2 alimentent des
   destinations attendues, bilan §4.1 ; nouveau falsificateur `F9`, bilan §6.1).
2. **Fait ce jour** : arbitrer la clause de preuve du v6 §10, mesurée insatisfiable sous sa lettre
   (`comm` des `git ls-files` rend 2 lignes : `AGENTS.md`, `README.md`). Arbitrée en **paires chemin
   + contenu** et réparée dans le document ([ADR-014](DECISIONS.md)) ; les trois relevés restent dans
   [BOUNDARY.md](device/BOUNDARY.md) §6.
3. Arbitrer la boucle 2 : commit de clôture (P5), remote (P6).
4. Après approbation : ouvrir la boucle 3, le protocole de test du framework (MEGA-PROMPT v6).
5. **Fait ce jour** : le remote public existe et porte `main` (`github.com/giak/aidd-device`, poussé
   le 2026-10-15, 18 commits). La question 1 du §11 reste « non » pour sa dernière clause : les quatre
   arbres gelés du cas sont désormais publics ([ADR-017](DECISIONS.md), relevé dans
   [BOUNDARY.md](device/BOUNDARY.md) §3), mais le run du 2026-10-15 n'a rien produit et n'a laissé
   aucun `output.json` — « lire l'écart » attend encore.

## 4. Commits d'avancement

| Commit | Contenu |
| --- | --- |
| `1bbb9d2` | fondation documentaire B1–B6, journal recréé, phrase corrigée, appareil du 14 retiré |
| `326a5be` | structure deuteros : VISION, PFD, DECISIONS, DASHBOARD, spec boucle 2 |
| `9768b4c` | `AGENTS.md` contrat autonome (audit de pollution) et cadre d'output implémenté |
