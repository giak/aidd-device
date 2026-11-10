---
name: Rapport utilisateur — 2026-11-10-104020-04-audit
description: non concluant ; morsure(s) : session_terminale_en_erreur, tableau_absent ; 12 limite(s)
type: run-report
status: done
---

# Rapport utilisateur — 2026-11-10-104020-04-audit

> Vue déterministe du reçu `receipt.json` et de la trace `trace/echange.jsonl`. Reçu écrit le 2026-11-10T10:48:26+01:00. Ce rapport ne remplace ni le reçu ni l'output.

## 1. La réponse

Le reçu conclut `non concluant` ; morsures : `session_terminale_en_erreur`, `tableau_absent` ; limites : 12 (voir §5).

Causes nommées : dispositif.

La promesse du cas n'est pas mesurée mécaniquement : elle relève d'un juge, et aucun juge n'est nommé dans l'output.

> « Aucune clause n'est mesurée : le client n'a rendu aucune réponse, donc ce run ne dit rien du skill 04-audit. » — `output.json`

## 2. Ce qui a été testé

| | |
| --- | --- |
| Cas | `2026-11-10-104020-04-audit` |
| Session | opencode ; modèle `ollama/huihui_ai/Qwen3.6-abliterated:35b-Claude-4.7` ; fil `ses_e3b27b149ffePcRvILKxi9E4pg` ; ouverte par buffy (agent) le 2026-11-10T10:44:32+01:00 |
| Budget | 1/3 échange(s) |
| Tableau | absent |
| Attendu vu | déclaré non ; mesure non |
| Produit | absent |
| Révisions | framework `fe48de12` ; terrain `416ec1f` |
| Durée | de 2026-11-10T10:44:33+01:00 à 2026-11-10T10:44:33+01:00 (premier et dernier message de la trace) |
| Fenêtre du reçu | déclarée de 2026-11-10T10:44:33+01:00 à 2026-11-10T10:47:18+01:00 |
| Trace | 1 ligne(s) lue(s) ; aucun outil nommé |

## 3. Ce que le reçu établit

- le gel a été re-haché : empreinte `f2b05782820ffd4747fda7c4c6383666876b3e1b05f6015302b6e65c8ce85721`, 2 fichier(s), 0 référence(s) (`gel_verifie`).
- la porte est citée : `5e35dbd4300bf0df91a2316f9fad68302852f691e5e5c5e8358d3d2c9b275081`, cas `2026-11-10-104020-04-audit`, gel `f2b05782820ffd4747fda7c4c6383666876b3e1b05f6015302b6e65c8ce85721` (`porte`).
- la trace a été lue et rejouée : 1 ligne(s), dont 1 dans la fenêtre du run, sha256 `6cde5c7eba515905a106a867c822009dc8f3a52afd39a25147a02dde03ce7381` (`trace_lue`), `2026-11-10T10:48:26+01:00` (`trace_verifiee`).
- la copie sous `raw/` a été re-hachée : 0 fichier(s), manifeste `049acc764fc4419b8eeaeda1545353b976bfe75c9956da4d0fe3225ece701bbf` (`produit.verifie`).
- le budget a été compté : 1/3 échange(s) (`echanges`).
- la conduite est déclarée par un agent (buffy (agent)), non vérifiée (`conduite`).
- la forme du tableau a été lue : aucun tableau (`tableau`).
- la promesse du cas est `juge_seul` : la promesse est énoncée, mais aucune mesure ne l'éprouve : `compare` doit nommer le juge et sa rubrique (`promesse`).

## 4. Ce qu'il n'établit pas

- la qualité du skill, la justesse du produit et la reproductibilité ;
- la conduite (agent ou humain), qui est déclarée par l'opérateur et jamais vérifiée ;
- l'identité du juge, sa rubrique et la fidélité de sa lecture ;
- le contenu d'une commande `shell` construite dynamiquement, que le reçu ne sait pas lire (ADR-051) ;
- les limites du reçu, détaillées au §5.

Ce que l'output écarte comme non testable :

- le contenu du produit est juste : le contenu ne se juge pas ici : le cas mesure l'ordre des gestes et les destinations, jamais la justesse du texte

## 5. Les morsures et les limites

| Clé | Ce que la morsure dit |
| --- | --- |
| session_terminale_en_erreur | la session s'est terminée sur une erreur : le run n'a pas été mesuré ; valeur : {"outcome":"failed","type":"provider.invalid-request","statut":404,"seq":3} |
| tableau_absent | la trace ne porte aucun tableau rendu par la session ; valeur : true |

**Limites**

- la conduite (agent) est déclarée par « buffy (agent) » : le reçu ne prouve pas qui a répondu, et un run conduit par un agent n'est ni une faute ni un mérite (ADR-071)
- le cas limite l'écriture à terrain/aidd_docs et à son scratch terrain/.scratch ; ce reçu compare les chemins nommés par les outils d'écriture, les cibles littérales des commandes shell et les chemins nouveaux du porcelain, pas les effets d'un binaire opaque (cloisonnement.ecriture, ADR-063)
- le scratch terrain/.scratch est lisible et scriptible, jamais compté comme produit ; il est collecté sous annexe/<cas>/ et le reçu le vérifie (ADR-067)
- le cas déclare un scratch, mais le run n'a aucune annexe collectée : les scripts et les sorties qu'il cite ne sont pas dans le reçu (ADR-067)
- dernier_message_non_atteste : faits.json ne porte pas le champ dernier_message — le reçu ne peut pas rattacher `raw/<cas>/last-message.md` à la trace, et le juge lit un texte que rien n'atteste (ADR-065)
- le cas interdit le réseau ; les clients déclarés sont curl, wget, nc, ssh, git fetch/push/clone, npm install et pip install — un client non listé n'est pas mesuré (cloisonnement.reseau)
- le cas interdit les fichiers de contexte ; le reçu ne reconnaît que les noms déclarés — AGENTS.md, CLAUDE.md, .github/copilot-instructions.md (cloisonnement.fichiers_de_contexte)
- la promesse du cas n'est pas mesurée mécaniquement : elle relève d'un juge, que `compare` doit nommer avec sa rubrique pour `conforme` — le reçu ne vérifie ni l'identité du juge ni sa lecture (audit du 2026-10-24, D2, D3)
- la pause est mesurée comme un tour `user` entre l'ouverture et la première écriture nommée : sa durée est l'intervalle entre la part précédente et ce tour, jamais une attente humaine, un accord donné sans tour n'est pas vu, et une écriture faite par une commande shell ne la clôt pas (ADR-069, ADR-078)
- la session n'a rien produit : le produit est sa sortie brute (§9)
- la session s'est terminée sur une erreur : outcome « failed », provider.invalid-request, statut 404 (seq 3) — un run tronqué n'a pas de verdict à recevoir (ADR-103)
- la trace ne porte aucun tableau rendu par la session (§5, F2)

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

- Vérifier que la session rend un tableau avant d'écrire, puis rejouer.
- Vérifier le chemin du produit et la collecte sous `raw/<cas>/`, puis rejouer.
- Relire la limite « la conduite (agent) est déclarée par « buffy (agent) » : le reçu ne prouve pas qui a répondu, et un run conduit par un agent n'est ni une faute ni un mérite (ADR-071) » et corriger la pièce qu'elle nomme.
- Relire la limite « le cas déclare un scratch, mais le run n'a aucune annexe collectée : les scripts et les sorties qu'il cite ne sont pas dans le reçu (ADR-067) » et corriger la pièce qu'elle nomme.
- Relire la limite « la session s'est terminée sur une erreur : outcome « failed », provider.invalid-request, statut 404 (seq 3) — un run tronqué n'a pas de verdict à recevoir (ADR-103) » et corriger la pièce qu'elle nomme.

## 8. Où lire les preuves

| Pièce | Lien |
| --- | --- |
| receipt.json | [receipt.json](receipt.json) |
| output.json | [output.json](output.json) |
| trace/echange.jsonl | [trace/echange.jsonl](trace/echange.jsonl) |
| gate.json | [gate.json](gate.json) |
| faits.json | [faits.json](faits.json) |

## 9. Ce que ce rapport ne prouve pas

Ce rapport est une vue des pièces du run, pas un nouveau run. Il ne juge ni le contenu ni la qualité du produit, ne remplace pas la lecture humaine, et ne mesure pas ce que le reçu ne mesure pas. Les absences et les limites sont dites dans les sections précédentes ; elles ne sont pas comblées par ce document.
