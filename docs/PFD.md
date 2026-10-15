---
name: Plan fonctionnel détaillé
description: Ce que le dispositif et sa gestion documentaire produisent, organisé par phase, à affiner
type: pfd
status: pending
---

# PFD — Plan fonctionnel détaillé

> Version 0.1 — 2026-10-15. Statut : document-cadre, à affiner au fil des phases.
> Source première : le [MEGA-PROMPT v6](brainstorm/MEGA-PROMPT-TEST-AIDD-v6.md), §10.

Légende : 🔲 non démarré · 🟨 en cours · 🟢 fait · 🟠 à revoir

## Ce que le dispositif doit produire (v6 §10)

| Artefact | Ce qu'il prouve | Phase | Statut |
| --- | --- | --- | --- |
| `DEVICE.md` | ce que fait le dispositif, la commande de clonage et de lancement | 2 | 🟨 page écrite (895 mots), lancement à écrire |
| `BOUNDARY.md` | le framework est intact, aucun fichier du dispositif ne lui appartient | 2 | 🟨 page écrite, relevés du run à venir |
| `CASES/*.expected.json` | les attendus écrits avant le premier run, empreinte figée | 2 | 🟨 écrit et gelé (2026-10-15) ; **un run a eu lieu** le même jour (`non concluant`, aucun produit), le cas attend une rectification ([bilan](brainstorm/2026-10-15-201458-bilan-premier-run.md)) |
| `runs/<horodatage>/output.json` | l'écart : un objet par cas, verdict et limites | 2 | 🔲 — un run a eu lieu (`runs/2026-10-15-171559-…/`), **sans `output.json`** : le harnais refuse un produit vide |
| `NEGATIVE.md` | le dispositif a signalé une casse connue | 2 | 🔲 |
| `ECART.md` | le compte-rendu commité dans la pull request framework | 2 | 🔲 |

## Les 3 phases du projet

| Phase | Contenu | Statut |
| --- | --- | --- |
| 1 — Gestion documentaire (fondation + boucle 2) | la gestion comme terrain de consignation : B1–B6, unité de travail, clôture, remote | 🟨 en cours |
| 2 — Le dispositif (le v6) | DEVICE/BOUNDARY écrits ; CASES/runs/NEGATIVE et un run réel restent | 🟨 |
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
| Boucle 2 : remote | décision externe, jamais côté agent | 🟢 public, `origin`, poussé le 2026-10-15 |
