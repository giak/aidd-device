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
| `DEVICE.md` | ce que fait le dispositif, la commande de clonage et de lancement | 2 | 🔲 |
| `BOUNDARY.md` | le framework est intact, l'intersection des fichiers est vide | 2 | 🔲 |
| `CASES/*.expected.json` | les attendus écrits avant le premier run, empreinte figée | 2 | 🔲 |
| `runs/<horodatage>/output.json` | l'écart : un objet par cas, verdict et limites | 2 | 🔲 |
| `NEGATIVE.md` | le dispositif a signalé une casse connue | 2 | 🔲 |
| `ECART.md` | le compte-rendu commité dans la pull request framework | 2 | 🔲 |

## Les 3 phases du projet

| Phase | Contenu | Statut |
| --- | --- | --- |
| 1 — Gestion documentaire (fondation + boucle 2) | la gestion comme terrain de consignation : B1–B6, unité de travail, clôture, remote | 🟨 en cours |
| 2 — Le dispositif (le v6) | DEVICE/CASES/runs/NEGATIVE, au moins un run réel | 🔲 |
| 3 — Amélioration continue | mesure des dérives de sa propre consignation, arbitrages | 🔲 |

## 2. Gestion documentaire (la partie en cours)

| Système | Contenu | Statut |
| --- | --- | --- |
| Fondation B1–B6 | échange-mémoire, section-par-séance, preuve, immuabilité, zéro dérive | 🟢 |
| Journal | `TRACE.md` recréé, une section numérotée par séance | 🟢 |
| Registre ADR | `DECISIONS.md`, léger, Contexte/Options/Choix/Conséquences | 🟢 |
| État d'avancement | `DASHBOARD.md`, titre de vérité pour « où en est le projet ? » | 🟢 |
| Boucle 2 : unité de travail | critère falsifiable AVANT, dossier de tâche, clôture | 🟨 la spec en itération |
| Boucle 2 : commit de clôture | debout / ponctuel — à décider | 🟨 |
| Boucle 2 : remote | décision externe, jamais côté agent | 🟨 |
