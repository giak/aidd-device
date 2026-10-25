---
name: Rapport utilisateur — plan-simple-cadre
description: non concluant ; aucune morsure ; 12 limite(s)
type: run-report
status: done
---

# Rapport utilisateur — plan-simple-cadre

> Vue déterministe du reçu `receipt.json` et de la trace `trace/echange.jsonl`. Reçu écrit le 2026-10-25T04:24:47+01:00. Ce rapport ne remplace ni le reçu ni l'output.

## 1. La réponse

Le reçu conclut `non concluant` ; limites : 12 (voir §5).

Causes nommées : dispositif.

La promesse du cas n'est pas mesurée mécaniquement : elle est signée « mord » par Buffy (juge du run), rubrique « condition P : le plan et ses trois phases » sur 2 pièce(s) liée(s) au reçu ; le rapport ne vérifie ni l'identité du juge ni la fidélité de sa lecture. Motif signé : le plan annonce trois phases, mais phase-2.md et phase-3.md sont absents.

> « La session a écrit le plan et la première phase, puis le fournisseur a refusé la suite (free-limit, 429) ; le dispositif a traité cette session comme finie et a proposé conforme, alors que deux phases sur trois manquent : le run ne peut pas conclure sur le skill. » — `output.json`

## 2. Ce qui a été testé

| | |
| --- | --- |
| Cas | `plan-simple-cadre` |
| Session | opencode ; modèle `opencode/deepseek-v4.1-flash-free` ; fil `ses_e8ef8c48bffe40DX0frc2ogIhb` ; ouverte par opencode headless, modèle opencode/deepseek-v4.1-flash-free, agent build le 2026-10-25T04:07:41+01:00 |
| Budget | 2/3 échange(s) |
| Tableau | présent, 38 ligne(s) × 3 colonne(s), seq 26 |
| Attendu vu | déclaré non ; mesure non |
| Produit | 2 fichier(s) : `raw/plan-simple-cadre/tasks/2026_10/2026_10_25_copier-tous-les-manquants/phase-1.md`, `raw/plan-simple-cadre/tasks/2026_10/2026_10_25_copier-tous-les-manquants/plan.md` (tasks/2026_10/2026_10_25_copier-tous-les-manquants/phase-1.md 8263 o, tasks/2026_10/2026_10_25_copier-tous-les-manquants/plan.md 2923 o) |
| Révisions | framework `fe48de12` ; terrain `416ec1f` |
| Durée | de 2026-10-25T04:07:43+01:00 à 2026-10-25T04:17:00+01:00 (premier et dernier message de la trace) |
| Fenêtre du reçu | déclarée de 2026-10-25T04:07:43+01:00 à 2026-10-25T04:22:32+01:00 |
| Trace | 92 ligne(s) lue(s) ; outils : read 49, grep 7, shell 3, write 2, question 1 |

## 3. Ce que le reçu établit

- le gel a été re-haché : empreinte `f9ba2118c2320f0b3c492c5f41e421b50752aca2cd0ef6fed41a725adcec9235`, 2 fichier(s), 9 référence(s) (`gel_verifie`).
- la porte est citée : `08e7a7c5f960f3ebca64168f23b1b56ca145752cc1578ff6c73e6aadb40ae82c`, cas `plan-simple-cadre`, gel `f9ba2118c2320f0b3c492c5f41e421b50752aca2cd0ef6fed41a725adcec9235` (`porte`).
- la trace a été lue et rejouée : 92 ligne(s), dont 92 dans la fenêtre du run, sha256 `ee60c9ddef99c8406ae7ae9719494f4cfb25e185b4bf74554e71ab1e893ad5d3` (`trace_lue`), `2026-10-25T04:24:47+01:00` (`trace_verifiee`).
- la copie sous `raw/` a été re-hachée : 2 fichier(s), manifeste `bb4e33180193aaaf30848688ffef17bfbb1a8c2d941671830ac2ff527dd11385` (`produit.verifie`).
- le budget a été compté : 2/3 échange(s) (`echanges`).
- la conduite est déclarée par un agent (opencode headless, modèle opencode/deepseek-v4.1-flash-free, agent build), non vérifiée (`conduite`).
- la forme du tableau a été lue : 38 ligne(s) × 3 colonne(s), seq 26 (`tableau`).
- la promesse du cas est `juge_seul` : la promesse est énoncée, mais aucune mesure ne l'éprouve : `compare` doit nommer le juge et sa rubrique (`promesse`).
- la promesse est signée « mord » par Buffy (juge du run), rubrique « condition P : le plan et ses trois phases » : 2 pièce(s) re-hachée(s) contre le reçu (`promesse-signee.json`). Motif signé : le plan annonce trois phases, mais phase-2.md et phase-3.md sont absents.

## 4. Ce qu'il n'établit pas

- la qualité du skill, la justesse du produit et la reproductibilité ;
- la conduite (agent ou humain), qui est déclarée par l'opérateur et jamais vérifiée ;
- l'identité du juge, sa rubrique et la fidélité de sa lecture ;
- le contenu d'une commande `shell` construite dynamiquement, que le reçu ne sait pas lire (ADR-051) ;
- les limites du reçu, détaillées au §5.

Ce que l'output écarte comme non testable :

- le contenu du produit est juste : le contenu ne se juge pas ici : le cas mesure l'ordre des gestes et les destinations, jamais la justesse du texte

## 5. Les morsures et les limites

Aucun falsificateur ne mord dans le reçu.

**Limites**

- la conduite (agent) est déclarée par « opencode headless, modèle opencode/deepseek-v4.1-flash-free, agent build » : le reçu ne prouve pas qui a répondu, et un run conduit par un agent n'est ni une faute ni un mérite (ADR-071)
- le cas limite l'écriture à terrain/aidd_docs ; ce reçu compare les chemins nommés par les outils d'écriture, les cibles littérales des commandes shell et les chemins nouveaux du porcelain, pas les effets d'un binaire opaque (cloisonnement.ecriture, ADR-063)
- le cas interdit le réseau ; les clients déclarés sont curl, wget, nc, ssh, git fetch/push/clone, npm install et pip install — un client non listé n'est pas mesuré (cloisonnement.reseau)
- le cas interdit les fichiers de contexte ; le reçu ne reconnaît que les noms déclarés — AGENTS.md, CLAUDE.md, .github/copilot-instructions.md (cloisonnement.fichiers_de_contexte)
- la promesse du cas n'est pas mesurée mécaniquement : elle relève d'un juge, que `compare` doit nommer avec sa rubrique pour `conforme` — le reçu ne vérifie ni l'identité du juge ni sa lecture (audit du 2026-10-24, D2, D3)
- la pause est mesurée comme un tour `user` entre l'ouverture et la première écriture nommée : sa durée est l'intervalle entre la part précédente et ce tour, jamais une attente humaine, un accord donné sans tour n'est pas vu, et une écriture faite par une commande shell ne la clôt pas (ADR-069, ADR-078)
- les commandes shell sont lues quand leur texte est littéral (shell) ; une commande construite dynamiquement n'est pas interprétée, et le reçu le dit
- le répertoire initial d'une commande shell est le `travail` du gel ; le reçu suit le texte, donc un `cd` qui aurait échoué ne déplace pas la lecture (ADR-051)
- `/dev/null` est un puits : il n'est ni une lecture ni une écriture, les autres fichiers de périphérique restent comptés (ADR-053)
- le produit est comparé par sha256 aux fichiers lus hors du produit, relus au reçu ; un fichier lu puis modifié ou supprimé ne peut plus être reconnu (ADR-054)
- hors_produit ne retient que les chemins nouveaux du porcelain : une modification ou une suppression d'un fichier déjà présent hors du produit n'est pas attribuée au run (ADR-051)
- la porte et le gel replient un dossier non suivi en une seule entrée du porcelain ; le reçu étend seulement son propre côté après-run (`--untracked-files=all`), saute un chemin sous un dossier déjà non suivi avant le run et un ancêtre de la racine du produit, et compare les entrées comme des chaînes, sans décoder les guillemets de git (ADR-062)

## 6. Les effets hors cadre

### 6.1 Les lectures hors dossier

Le reçu ne nomme aucune lecture hors dossier.

### 6.2 Les écritures d'outil hors dossier

Le reçu ne nomme aucune écriture d'outil hors du cadre déclaré.

### 6.3 Les lectures par une commande shell

Le reçu ne nomme aucune lecture shell hors du cadre déclaré.

### 6.4 Les écritures shell hors du produit

Le reçu ne nomme aucune écriture shell hors du produit.

### 6.5 Les appels réseau

Le reçu ne nomme aucun appel réseau interdit.

### 6.6 Les fichiers hors du produit

Le reçu ne nomme aucun fichier nouveau hors du produit.

### 6.7 Les commandes shell mal formées

Le reçu ne nomme aucune commande shell mal formée.

### 6.8 Les commandes shell non interprétées

Le reçu ne nomme aucune commande shell non interprétable.

### 6.9 Les chemins nommés dans le code des outils

Le reçu ne nomme aucun chemin hors du cadre dans le code d'un outil.

## 7. Les pistes

- Corriger la branche P que le juge a signée « mord » : le plan annonce trois phases, mais phase-2.md et phase-3.md sont absents.
- Relire la limite « la conduite (agent) est déclarée par « opencode headless, modèle opencode/deepseek-v4.1-flash-free, agent build » : le reçu ne prouve pas qui a répondu, et un run conduit par un agent n'est ni une faute ni un mérite (ADR-071) » et corriger la pièce qu'elle nomme.

## 8. Où lire les preuves

| Pièce | Lien |
| --- | --- |
| receipt.json | [receipt.json](receipt.json) |
| output.json | [output.json](output.json) |
| trace/echange.jsonl | [trace/echange.jsonl](trace/echange.jsonl) |
| gate.json | [gate.json](gate.json) |
| faits.json | [faits.json](faits.json) |
| promesse-signee.json | [promesse-signee.json](promesse-signee.json) |
| raw/plan-simple-cadre/tasks/2026_10/2026_10_25_copier-tous-les-manquants/phase-1.md | [raw/plan-simple-cadre/tasks/2026_10/2026_10_25_copier-tous-les-manquants/phase-1.md](raw/plan-simple-cadre/tasks/2026_10/2026_10_25_copier-tous-les-manquants/phase-1.md) |
| raw/plan-simple-cadre/tasks/2026_10/2026_10_25_copier-tous-les-manquants/plan.md | [raw/plan-simple-cadre/tasks/2026_10/2026_10_25_copier-tous-les-manquants/plan.md](raw/plan-simple-cadre/tasks/2026_10/2026_10_25_copier-tous-les-manquants/plan.md) |

## 9. Ce que ce rapport ne prouve pas

Ce rapport est une vue des pièces du run, pas un nouveau run. Il ne juge ni le contenu ni la qualité du produit, ne remplace pas la lecture humaine, et ne mesure pas ce que le reçu ne mesure pas. Les absences et les limites sont dites dans les sections précédentes ; elles ne sont pas comblées par ce document.
