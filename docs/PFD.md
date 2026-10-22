---
name: Plan fonctionnel détaillé
description: Ce que le dispositif et sa gestion documentaire produisent, organisé par phase, à affiner
type: pfd
status: in-progress
---

# PFD — Plan fonctionnel détaillé

> Version 0.3 — 2026-10-22 (remise au vrai : quatre cas gelés, treize reçus, les deux pages remesurées).
> Statut : document-cadre, à affiner au fil des phases.
> Source première : le [MEGA-PROMPT v6](brainstorm/MEGA-PROMPT-TEST-AIDD-v6.md), §10.

Légende : 🔲 non démarré · 🟨 en cours · 🟢 fait · 🟠 à revoir

## Ce que le dispositif doit produire (v6 §10)

| Artefact | Ce qu'il prouve | Phase | Statut |
| --- | --- | --- | --- |
| `DEVICE.md` | ce que fait le dispositif, la commande de clonage et de lancement | 2 | 🟨 page écrite (**1 169 mots** mesurés le 2026-10-22, **au-dessus du plafond de 900** du §10 : à resserrer) ; la séquence de six gestes y est écrite, mais **la commande exacte de lancement que le §10 demande n'existe pas** et la page dit pourquoi : le lancement inclut un geste humain, ouvrir la session |
| `BOUNDARY.md` | le framework est intact, aucun fichier du dispositif ne lui appartient | 2 | 🟨 page écrite (**2 040 mots**, remesuré le 2026-10-22 ; elle annonçait 1 563, puis 1 686, puis 1 970) ; la preuve d'appartenance se mesure en paires chemin + contenu ([ADR-014](DECISIONS.md)), **remesurée le 2026-10-16** : 2 599 paires d'un côté, 42 de l'autre, **0 commune** ; les relevés du second run restent à faire |
| `CASES/*.expected.json` | les attendus écrits avant le premier run, empreinte figée | 2 | 🟢 **quatre cas gelés**, chacun avec sa demande, son attendu et son gel : promesse mémoire `ba1096aa` (8 références), cas jouet `27fb38ab` (0), `plan-simple` `bee028f8` (9) et `spike-annees` `0052c168` (11) ; l'attendu du premier porte 9 falsificateurs dont `F9` (`sha256` `ae4914c5…`, 15 423 o) |
| `runs/<horodatage>/output.json` | l'écart : un objet par cas, verdict et limites | 2 | 🟢 **treize `output.json`**, un par reçu ; le run du 2026-10-15 reste le seul sans le sien, antérieur au chemin sans produit que le harnais sait écrire depuis (spec §9, `collect --sans-produit`) |
| `NEGATIVE.md` | le dispositif a signalé une casse connue | 2 | 🟨 ouvert le 2026-10-17 : une phrase de skill retournée est signalée (`exit 1`, `docs/device/NEGATIVE.md`), le produit jugé `écart` manque encore |
| `ECART.md` | le compte-rendu commité dans la pull request framework | 2 | 🟨 rédigé le 2026-10-17 au foyer du run (`docs/device/runs/2026-10-15-171559-…/ECART.md`), dans la forme de la PR : phrase de verdict, écart nommé, limites qui mordent, révisions, clone, commande qui refait le run, ce qui manque ; aucun lien markdown, chemins en `backticks`. **Pas commité dans une PR** : aucune PR n'existe |

## Les 3 phases du projet

| Phase | Contenu | Statut |
| --- | --- | --- |
| 1 — Gestion documentaire (fondation + boucle 2) | la gestion comme terrain de consignation : B1–B6, unité de travail, clôture, remote | 🟨 en cours |
| 2 — Le dispositif (le v6) | DEVICE/BOUNDARY écrits, quatre cas gelés ; **treize reçus** (8 `non concluant`, 3 `conforme`, 2 `ecart`) ; la publication d'`ECART.md` dans une PR reste ; `NEGATIVE.md` et `ECART.md` sont écrits, à moitié (2026-10-17) | 🟨 |
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
| Boucle 2 : remote | décision externe, jamais côté agent | 🟢 public, `origin`, poussé le 2026-10-15, re-poussé le 2026-10-16, et **déclaré dans `AGENTS.md`** le 2026-10-16 — P6 close |
