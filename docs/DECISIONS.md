---
name: Registre des décisions
description: ADR léger — contexte, choix, conséquences, numéroté, au fil de l'eau ; le fond du contrat documentaire
type: decisions
status: in-progress
---

# DECISIONS — Registre des décisions

> Chaque ADR documente une décision structurante : contexte, options, choix, conséquences.
> Format léger proposé par l'ADR léger (vision/Dashboard template, deuteros). Une décision non
> consignée n'existe pas ; un numéro n'est jamais réattribué.

## ADR-001 — La fondation documentaire : six bases de consignation (approuvée 2026-10-15)

**Contexte** : l'appareil documentaire du 14 a été vidé par le relecteur, verbatim, mémoire
`e493b0b8` : « bon, tu n'a rien fait. j'ai tout éffacé dans le projet. il faut brainstorm des
specs. revoir de fond en comble /home/giak/projects/aidd-device/AGENTS.md. posé les bases de la
gestion docuementaires et de gestion de projet » ; il exige « comment on trace tout, on note
tout ».

**Options** : appareil d'outils générationnels (vécu = 19 docs non commités) · fondation en prose
sans script (choisi) · CI.

**Choix** : deux canaux (mémoire par échange écrite immédiatement ; section de séance numérotée,
append-only), un foyer par nature, chaque fait porte sa preuve, deux niveaux d'immuabilité, zéro
dérive. Décision portée mémoire `e5411d2e` ; format courant et sed de l'entrée dans TRACE.md.

**Conséquences** : sans script ni hook ni CI ; toute vérification mécanique sera méritée, pas
promis.

## ADR-002 — Un seul foyer documentaire, dit `docs/` (2026-10-15)

**Contexte** : l'agent avait proposé `aidd_docs/<date>.md` à la racine ; refus verbatim « cela va
denirie le bordel . on a djà un dossier docs » (mémoire `50add890`) ; l'exemple deuteros vit le
même bazar (deux maisons, specs duplicées, chemins morts).

**Choix** : un type de document, un foyer ; rien ne flotte à la racine ; aucune maison gelée
d'exception tant que la fondation ne la déclare pas. PAS de déplacement vers `aidd_docs/` pour ce
dépôt.

**Conséquences** : la convention `aidd_docs/` du framework s'applique aux projets consommateurs,
pas ici : ce dépôt la consomme, n'ouvre aucun arbre parallèle et n'en prolonge pas la structure.

## ADR-003 — Séance consignée numérotée, un format auditable (2026-10-15)

**Contexte** : deuils d'audits rétrospectifs (`8c78b47e`, `9ed80a52`) : des échanges entiers
sans mémoire ; des sections de séance bavardes non falsifiables.

**Choix** : `## Séance N — YYYY-MM-DD (sujet)`, continuité par `(suite)` ; le squelette interne
est : Objectif · Fait · Vérifié · Dérives signalées non corrigées · Rectifications · Prochaines
étapes · Mémoires (une ligne par `memory_id`) ; un sous-titre absent est un silence, jamais un
remplissage. Emprunte du journal de l'exemple deuteros (l'archive `TRACE.md` de
`/home/giak/projects/deuteros-resurrected-web`), sans lien direct : un chemin hors du dépôt est
cité en clair, jamais en lien.

**Conséquences** : tout échange reçoit un `memory_id` mentionné dans la section du jour ; une
absence de `memory_id` dans une entrée du jour est une erreur auditable.

## ADR-004 — Pas de script, pas de hook, pas de CI tant qu'une dérive n'est pas démontrée (2026-10-15)

**Contexte** : l'arbitrage « pas de script » (`7f2cd67b`) ; le soir du 14 rien n'a arrêté mon
appareil de contrôles ; mieux : mon audit « 19 documents non commités » promettait
l'absence de travaux, pas une preuve (L4).

**Choix** : la discipline (write-back par échange, arbitrage humain) tient le gate. Une
vérification mécanique ne sera **méritée** que par une dérive démontrée, jamais ajoutée par envie.

**Conséquences** : le dépôt n'a plus aucun contrôle automatique, conformément au retrait du
crochet ; une future règle M précise sa classe, sa commande et son contrôle négatif avant usage.

## ADR-005 — Critère d'acceptation falsifiable AVANT le travail (boucle 2, en itération 2026-10-15)

**Contexte** : six dossiers de tâche créés en treize minutes la nuit du 14, sans critère ni
clôture ; le relecteur rejette ainsi une tâche sans critère pour l'agent.

**Choix** (à valider) : une tâche s'ouvre avec un critère falsifiable, écrit AVANT le travail ;
sinon, le sujet reste un constat de séance. Toute clôture est une vérification citée dans le
`run.md`. En itération : [081511-gestion-de-projet.md](brainstorm/2026-10-15-081511-gestion-de-projet.md).

**Conséquences** : aucun dossier suivi d'à-côté ; le journal porte le déroulé, le dossier porte
l'objet livré.

## ADR-006 — La phrase « 0 tool rows » est fausse ; corrigée sur place (2026-10-15)

**Contexte** : le contrat d'`AGENTS.md` portait « mesuré : 0 tool rows in 69 messages » ; la
mesure
visait la mauvaise colonne : les appels d'outils sont des parts dans `parts_json`, pas des lignes
de messages ; 659 parts d'outils mesurées dans un fil (mémoire `12cdb674`).

**Choix** : `AGENTS.md` est un contrat vivant, corrigé sur place ; le document daté qui a dit
faux ne se réécrit pas, une rectification datée lui répond.

**Conséquences** : toute mesure de l'agent porte la commande qui l'établit ; un chiffre recopié
d'un document, d'un journal ou d'une mémoire n'est jamais une preuve.
