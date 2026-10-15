---
name: Vision
description: La raison d'être du dépôt en une page, à la manière d'un document-cadre stable
type: vision
status: done
---

# VISION

> Version 0.1 — 2026-10-15. Document-cadre : se change rarement, par décision d'ADR.

## Le projet en une phrase

Un **dispositif de test** dont l'objet est le framework AIDD : il prend une modification du
framework, la fait exécuter par un expérimentateur, et nomme l'écart entre ce qu'elle promet et ce
qu'elle produit, de façon rejouable.

## Pourquoi ce dispositif

- `SUPPOSÉ(MEGA-PROMPT v6 §2)` : le framework porte deux surfaces, 458 fichiers markdown,
  16 413 lignes, et « aucun de ces contrôles ne dit si une promesse est vraie quand un modèle lit
  la skill » ([MEGA-PROMPT v6](brainstorm/MEGA-PROMPT-TEST-AIDD-v6.md), §2) — chiffres relevés
  par le v6 dans le dépôt du framework, jamais remesurés ici.
- Le besoin entier est : **transformer une conviction privée en fait partagé** — à une autre
  personne, pas à une machine (MEGA-PROMPT v6, §1).
- `SUPPOSÉ(MEGA-PROMPT v6 §9)` : huit tentatives antérieures ont échoué pour des causes
  récurrentes — dispositif non rejouable, attendu écrit après le produit, des chiffres produits
  faux puis réfutés par la commande qui tranche.

## Pour qui

- **Celui qui modifie le framework** : il écrit ce qu'il attend, lance le dispositif, lit l'écart.
- **Celui qui relit la pull request** : il tranche sans cloner le dispositif, et a le droit de ne
  pas y croire. Ce sont les deux seuls utilisateurs (v6 §3).

## Ce que ce dépôt est

- Le dispositif versionné dans son propre dépôt git ;
- un terrain de consignation exemplaire : tout est tracé, noté, fondé et daté — la gestion
  documentaire ici pratique ce que le dispositif mesure ailleurs ;
- un seul foyer documentaire : `docs/` (VISION, PFD, DECISIONS, DASHBOARD, TRACE, brainstorm,
  tasks, archive).

## Ce que le dispositif n'est **PAS** (non-objectifs)

- ❌ Pas une refonte du framework : il l'appelle comme objet sous test et n'exige aucune
  modification de lui (v6 §5).
- ❌ Pas un harnais de régression classique : il rejoue un départ, jamais une réponse (v6 §8).
- ❌ Pas un runner garanti : précondition constatée, jamais supposée (v6 §7).
