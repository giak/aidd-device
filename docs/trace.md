---
name: Journal des séances
description: Ce qui ne touche pas au besoin du projet (conventions, méthode, outillage du dépôt, maintenance), séance par séance, une entrée auditable par séance
type: journal
status: in-progress
---

# Journal des séances

> Recréé à zéro le 2026-10-15, après l'effacement du soir par le relecteur. Les séances antérieures
> ne sont pas reconstituées ; leurs faits survivent dans les mémoires Mnemolite, énumérées dans la
> Séance 1. Le format des entrées est celui de la fondation documentaire
> [2026-10-15-080225-fondation-documentaire.md](brainstorm/2026-10-15-080225-fondation-documentaire.md),
> en cours d'approbation : ce journal est son premier client.

## Séance 1 — 2026-10-15 (le dépôt est vidé, la fondation documentaire est en brainstorm)

**Objectif.** Repartir de l'effacement : le dépôt ne porte plus que `AGENTS.md`, `README.md`, les
deux MEGA-PROMPT v6 du brainstorm du protocole de test, et cette spec neuve. Recouvrer les bases de
la gestion documentaire — comment on trace tout, on note tout — avant toute autre pièce.

**Fait.**

- L'état du dépôt mesuré après l'effacement : `git status --porcelain` montre (`D
  scripts/docs-index.mjs`, `D docs/trace.md`, `D docs/index.md`, `D docs/dashboard.md`, `D
  .githooks/pre-commit`) et reste resté tout ce que cette page cita hier soir. Mesuré à 08:02
  locales.
- La spec de la fondation est écrite : `docs/brainstorm/2026-10-15-080225-fondation-documentaire.md`
  (nom portant la naissance mesurée par `date`), frontmatter `status: in-progress` depuis son
  approbation, itération ouverte.
- La section `CONSIGN` d'`AGENTS.md` est réécrite sur B1–B6 (mémoire `e5411d2e`), et la phrase
  fausse du 2026-10-14 est corrigée sur place : les appels d'outils sont des parts dans
  `parts_json`, pas des lignes de messages ; 659 tool parts mesurées dans un fil. `AGENTS.md` est
  un contrat vivant ; la section datée du 2026-10-14 ci-dessous ne se réécrit pas.
- Le journal est recréé (cette page) ; c'est l'application minimale de B1, pas une anti-coupée.

**Vérifié.** `date +'%Y-%m-%d-%H%M%S'` → `2026-10-15-080225` au moment de la création. Pas d'autre
mesure : aucun script ne contrôle quoi que ce soit (« pas de script », arbitrage 4 de la séance) ;
ce journal est écrit à la main et se déclare reconstitution.

**Dérives signalées, non corrigées.**

- Le reste du dépôt git porte des documents effacés en `D` non commités et une modification
  d'`AGENTS.md` non commitée : rien n'est citable tant que le relecteur ne demande pas de commit
  (discipline L4 déjà connue, tenue sans exception cette séance).
- La règle NAMING d'`AGENTS.md` exige des secondes ; la section `CONSIGN` contient la phrase fausse
  du 2026-10-14 (« 0 tool rows in 69 messages »), déjà réfutée par la mémoire `12cdb674` et par la
  mesure 659 parts d'outils. Les deux seront corrigées dans la boucle de refonte d'`AGENTS.md`,
  pas ici (cette page ne se réécrit pas après une séance.close). Le buttoman proprite.

**Prochaines étapes (TODO).**

1. Itérer la spec avec le relecteur (c'est le brainstorm ouvert).
2. Une fois approuvée : réécrire `CONSIGN` d'`AGENTS.md` sur son modèle — **fait ce jour** ; puis
   ouvrir la boucle 2 (gestion de projet : unité de travail, critère falsifiable, commit).

**Mémoires de la séance.** `e493b0b8` l'effacement et la demande de fond en comble ; `7f2cd67b` les
quatre arbitrages (fondation d'abord, trop vite, baby steps, pas de script) ; `44bd6559` l'exemple
deuteros et ses leçons ; `f923e5ff` l'ordre d'écrire les specs sur disque en itération. Les
mémoires antérieures à cette séance, qui survivent à l'effacement des fichiers : `8c78b47e`
(le verdict « propose rien, tout revoir »), `50add890` (l'architecture remise à plat du soir
précédent), `12cdb674` (les cinq décisions et la réfutation du « 0 tool rows »).
