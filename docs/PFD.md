---
name: Plan fonctionnel détaillé
description: Ce que le dispositif et sa gestion documentaire produisent, organisé par phase, à affiner
type: pfd
status: in-progress
---

# PFD — Plan fonctionnel détaillé

> Version 0.2 — 2026-10-16 (mise au vrai de l'état mesuré). Statut : document-cadre, à affiner au fil des phases.
> Source première : le [MEGA-PROMPT v6](brainstorm/MEGA-PROMPT-TEST-AIDD-v6.md), §10.

Légende : 🔲 non démarré · 🟨 en cours · 🟢 fait · 🟠 à revoir

## Ce que le dispositif doit produire (v6 §10)

| Artefact | Ce qu'il prouve | Phase | Statut |
| --- | --- | --- | --- |
| `DEVICE.md` | ce que fait le dispositif, la commande de clonage et de lancement | 2 | 🟨 page écrite (895 mots, mesuré le 2026-10-16) ; le lancement n'est pas une commande unique et la page le dit, la séquence de six gestes y est écrite |
| `BOUNDARY.md` | le framework est intact, aucun fichier du dispositif ne lui appartient | 2 | 🟨 page écrite (1 686 mots, mesuré le 2026-10-16) ; la preuve d'appartenance se mesure en paires chemin + contenu ([ADR-014](DECISIONS.md)), les relevés du second run restent à faire |
| `CASES/*.expected.json` | les attendus écrits avant le premier run, empreinte figée | 2 | 🟨 écrit, puis **rectifié et re-gelé six fois** le 2026-10-15 — dernier gel `0d9a2180` (`gele_le` `2026-10-15T22:11:24.782242943+0200`, [ADR-018](DECISIONS.md), [ADR-019](DECISIONS.md)) ; l'attendu porte 9 falsificateurs dont `F9` (`sha256` `ae4914c5…`, 15 423 o), la demande `5aac04fb…` (13 413 o). **Un run a eu lieu** le même jour (`non concluant`, aucun produit) |
| `runs/<horodatage>/output.json` | l'écart : un objet par cas, verdict et limites | 2 | 🔲 — un run a eu lieu (`runs/2026-10-15-171559-…/`), **sans `output.json`** : il est antérieur au chemin sans produit, que le harnais sait écrire depuis (spec §9, `collect --sans-produit`). L'`output.json` s'écrira avec le second run |
| `NEGATIVE.md` | le dispositif a signalé une casse connue | 2 | 🔲 |
| `ECART.md` | le compte-rendu commité dans la pull request framework | 2 | 🔲 |

## Les 3 phases du projet

| Phase | Contenu | Statut |
| --- | --- | --- |
| 1 — Gestion documentaire (fondation + boucle 2) | la gestion comme terrain de consignation : B1–B6, unité de travail, clôture, remote | 🟨 en cours |
| 2 — Le dispositif (le v6) | DEVICE/BOUNDARY écrits, CASES gelé (`0d9a2180`) ; un run a eu lieu (`non concluant`) ; `output.json`, `NEGATIVE.md`, `ECART.md` et un run concluant restent | 🟨 |
| 3 — Amélioration continue | mesure des dérives de sa propre consignation, arbitrages | 🔲 |

## 2. Gestion documentaire (la partie en cours)

| Système | Contenu | Statut |
| --- | --- | --- |
| Fondation B1–B6 | échange-mémoire, section-par-séance, preuve, immuabilité, zéro dérive | 🟢 |
| Journal | `trace.md` recréé, une section numérotée par séance | 🟢 |
| Registre ADR | `DECISIONS.md`, léger, Contexte/Options/Choix/Conséquences | 🟢 |
| État d'avancement | `DASHBOARD.md`, titre de vérité pour « où en est le projet ? » | 🟢 |
| Boucle 2 : unité de travail | critère falsifiable AVANT, dossier de tâche, clôture | 🟨 la spec en itération |
| Boucle 2 : commit de clôture | debout / ponctuel — à décider | 🟨 |
| Boucle 2 : remote | décision externe, jamais côté agent | 🟢 public, `origin`, poussé le 2026-10-15, re-poussé le 2026-10-16 |
