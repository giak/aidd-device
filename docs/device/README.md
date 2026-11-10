---
name: device — les pièces du dispositif
description: "Ce que porte le dossier device : les runs, les cas et le harnais, plus six notes qui survivent pour les liens anciens, avec leur repreneur"
type: index
status: in-progress
question: Que porte le dossier device, et où lire chacune de ses pièces ?
---

# device — les pièces du dispositif

> Ce dossier porte trois choses et six notes. Les trois choses sont vivantes et se lisent dans l'ordre des
> besoins ; les six notes ne répondent plus à aucune question, elles existent pour qu'un lien ancien ne meure
> pas ([INDEX](../INDEX.md) §1 bis). Un inconnu qui ouvre ce dossier doit savoir laquelle il regarde.

## 1. Les trois foyers

| Entrée | La question qu'elle répond | Où lire |
| --- | --- | --- |
| [runs/](runs/README.md) | qu'a laissé une session, et à quoi se fier ? | [anatomie d'un dossier de run](runs/README.md), puis l'[index généré](runs/INDEX.md) qui classe les runs par mode |
| [CASES/](CASES/) | quelles demandes, quels attendus, quels gels ? | la [carte](../INDEX.md), puis le [PROTOCOLE](../PROTOCOLE.md) §2 pour ce que chaque pièce autorise |
| [harness/](harness/) | quels programmes mesurent, et que refusent-ils ? | [ARCHITECTURE](../ARCHITECTURE.md) §4 pour le cycle d'un run, [PROTOCOLE](../PROTOCOLE.md) §2 pour les commandes |

Le harnais est fait de huit programmes sans dépendance : `run.mjs` (les commandes), `orchestrer.mjs` (les
arbres), `runs.mjs` (l'index des runs), `rapport.mjs` et `resultat.mjs` (les deux pages d'un run),
`clients.mjs` (l'export de trace), `liens.mjs` (les liens morts) et `banc-harnais.sh` (les contrôles).

## 2. Les six notes, et leur repreneur

Une note ne s'édite pas et ne compte pas comme un foyer : elle dit où la réponse a été reprise.

| Note | Repreneur | Depuis |
| --- | --- | --- |
| [BANC](BANC.md) | [BANC](../BANC.md) | 2026-10-23 |
| [BOUNDARY](BOUNDARY.md) | [ARCHITECTURE](../ARCHITECTURE.md) §3 et §3.1 | 2026-10-23 |
| [DEVICE](DEVICE.md) | [ARCHITECTURE](../ARCHITECTURE.md), [README](../../README.md) | 2026-10-23 |
| [NEGATIVE](NEGATIVE.md) | [journal](../trace.md) Séance 29, [DASHBOARD](../DASHBOARD.md) | 2026-10-23 |
| [ORCHESTRATEUR](ORCHESTRATEUR.md) | [PROTOCOLE](../PROTOCOLE.md) | 2026-10-23 |
| [REPLAY](REPLAY.md) | [REPLAY](../REPLAY.md) | 2026-10-23 |

## 3. Ce que ce dossier ne porte pas

Aucun verdict, aucune mesure, aucune chronologie : un verdict se lit dans le reçu de son run, une mesure dans
la page qui la produit, une chronologie au [journal](../trace.md). Ce fichier ne fait que nommer les portes, et
il ne les remplace pas.
