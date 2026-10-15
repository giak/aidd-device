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
| Le dispositif (v6 §10) | 🟨 `DEVICE.md`, `BOUNDARY.md`, le harnais et le premier `CASES/` complet et gelé ([docs/device/](device/DEVICE.md), [ADR-013](DECISIONS.md), [ADR-014](DECISIONS.md)) ; aucun run — état B |

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
| Dispositif — la page | `docs/device/DEVICE.md` | 🟨 v0.1, 895 mots |
| Dispositif — la frontière | `docs/device/BOUNDARY.md` | 🟨 v0.1, 1 383 mots |
| Dispositif — le harnais | `docs/device/harness/run.mjs` | 🟨 `freeze`, `collect`, `receipt`, `compare` ; banc jetable 36/36, aucun run réel |
| Dispositif — le premier cas | `docs/device/CASES/` (demande, attendu, gel) | 🟨 écrit et **gelé** le 2026-10-15 (`gele_le` 15:29:49), 8 falsificateurs du run et 4 de l'attendu ; aucun run — état B |

## 3. Prochains pas (TODO court terme)

1. **Fait ce jour** : la spec du run par session d'opérateur est approuvée par l'ordre du relecteur
   (`in-progress`), le harnais est écrit (gel, manifeste, reçu, comparaison) et le premier cas est
   complet et gelé. Reste : conduire le run — la session que l'opérateur ouvre — puis `collect`,
   `receipt`, `compare`.
2. **Fait ce jour** : arbitrer la clause de preuve du v6 §10, mesurée insatisfiable sous sa lettre
   (`comm` des `git ls-files` rend 2 lignes : `AGENTS.md`, `README.md`). Arbitrée en **paires chemin
   + contenu** et réparée dans le document ([ADR-014](DECISIONS.md)) ; les trois relevés restent dans
   [BOUNDARY.md](device/BOUNDARY.md) §6.
3. Arbitrer la boucle 2 : commit de clôture (P5), remote (P6).
4. Après approbation : ouvrir la boucle 3, le protocole de test du framework (MEGA-PROMPT v6).
5. **Fait ce jour** : le remote public existe (`github.com/giak/aidd-device`, vide, `origin` posé) ;
   le push reste à faire, et la question 1 du §11 ne se répond « oui » qu'après lui.

## 4. Commits d'avancement

| Commit | Contenu |
| --- | --- |
| `1bbb9d2` | fondation documentaire B1–B6, journal recréé, phrase corrigée, appareil du 14 retiré |
| `326a5be` | structure deuteros : VISION, PFD, DECISIONS, DASHBOARD, spec boucle 2 |
| `9768b4c` | `AGENTS.md` contrat autonome (audit de pollution) et cadre d'output implémenté |
