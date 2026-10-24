---
name: Rapport utilisateur — 2026-10-24-055310-shadow-areas-design
description: ecart ; morsure(s) : hors_produit ; 14 limite(s)
type: run-report
status: done
---

# Rapport utilisateur — 2026-10-24-055310-shadow-areas-design

> Vue déterministe du reçu `receipt.json` et de la trace `trace/echange.jsonl`. Reçu écrit le 2026-10-24T11:37:35+02:00. Ce rapport ne remplace ni le reçu ni l'output.

## 1. La réponse

Le reçu conclut `ecart` ; morsures : `hors_produit` ; limites : 14 (voir §5).

L'écart est nommé ; il ne dit pas s'il vient du skill ou de la session.

La promesse du cas n'est pas mesurée mécaniquement : elle relève d'un juge, et aucun juge n'est nommé dans l'output.

> « La session a lu le skill 03-shadow-areas dans la révision sous test, scanné la spec sans la modifier et écrit un rapport d'ombres classé dans les ensembles verrouillés, mais sous 2026-08-01-carte-visite-v2-shadow-report.md, un nom qui retire -design avec l'extension. » — `output.json`

## 2. Ce qui a été testé

| | |
| --- | --- |
| Cas | `2026-10-24-055310-shadow-areas-design` |
| Session | opencode ; modèle `openrouter/cohere/north-mini-code:free` ; fil `ses_e92bf7bb7ffeTp6Nh9xCBqVl5c` ; ouverte par Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-24 le 2026-10-24T11:31:47+02:00 |
| Budget | 1/1 échange(s), épuisé au seq 1 |
| Tableau | absent |
| Attendu vu | déclaré non ; mesure non |
| Produit | 1 fichier(s) : `raw/2026-10-24-055310-shadow-areas-design/2026-08-01-carte-visite-v2-shadow-report.md` (2026-08-01-carte-visite-v2-shadow-report.md 984 o) |
| Révisions | framework `fe48de12` ; terrain `6a74c46` |
| Durée | de 2026-10-24T11:31:48+02:00 à 2026-10-24T11:34:38+02:00 (premier et dernier message de la trace) |
| Fenêtre du reçu | déclarée de 2026-10-24T11:31:48+02:00 à 2026-10-24T11:36:53+02:00 |
| Trace | 44 ligne(s) lue(s) ; outils : read 13, write 7, glob 5, execute 2 |

## 3. Ce que le reçu établit

- le gel a été re-haché : empreinte `868436ae4c4133fb3a6591f5adb42cb80e599df7e4591a6be9954aaeffc512b5`, 2 fichier(s), 1 référence(s) (`gel_verifie`).
- la porte est citée : `97d06ca48ee61c41e8e49ea5264fc3b67c4daff789b85e5d139f2f73f7dc45a3`, cas `2026-10-24-055310-shadow-areas-design`, gel `868436ae4c4133fb3a6591f5adb42cb80e599df7e4591a6be9954aaeffc512b5` (`porte`).
- la trace a été lue et rejouée : 44 ligne(s), dont 44 dans la fenêtre du run, sha256 `0452ba9264848adbf9903e943a68a9338337f05b76b78a982d720187d7f5755b` (`trace_lue`), `2026-10-24T11:37:35+02:00` (`trace_verifiee`).
- la copie sous `raw/` a été re-hachée : 1 fichier(s), manifeste `0f93813aa023c958d60b9d3bd6d8767b5ab2605c6e8533aa933e240e14c3a317` (`produit.verifie`).
- le budget a été compté : 1/1 échange(s) (`echanges`).
- la conduite est déclarée par un agent (Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-24), non vérifiée (`conduite`).
- la forme du tableau a été lue : aucun tableau (`tableau`).
- la promesse du cas est `juge_seul` : la promesse est énoncée, mais aucune mesure ne l'éprouve : `compare` doit nommer le juge et sa rubrique (`promesse`).

## 4. Ce qu'il n'établit pas

- la qualité du skill, la justesse du produit et la reproductibilité ;
- la conduite (agent ou humain), qui est déclarée par l'opérateur et jamais vérifiée ;
- l'identité du juge, sa rubrique et la fidélité de sa lecture ;
- le contenu d'une commande `shell` construite dynamiquement, que le reçu ne sait pas lire (ADR-051) ;
- les limites du reçu, détaillées au §5.

Ce que l'output écarte comme non testable :

- le contenu du produit est juste : le contenu ne se juge pas ici : le cas mesure le nom, l'emplacement, la forme classée et l'invariant de la source, jamais la pertinence des écarts trouvés
- le rapport couvre toutes les ombres réelles de la spec : aucune mesure d'exhaustivité n'existe : un rapport court et bien formé passe, un rapport long et bien formé aussi

## 5. Les morsures et les limites

| Clé | Ce que la morsure dit |
| --- | --- |
| hors_produit | un fichier a été écrit hors du produit ; valeur : {"chemin":"terrain/docs/superpowers/specs/2026-08-01-carte-visite-v2-shadow-report.md","nature":"produit"} |

**L'écart nommé par le juge**

Le rapport est né sous docs/superpowers/specs/2026-08-01-carte-visite-v2-shadow-report.md : la session a retiré -design avec l'extension, alors que l'action 02 demande de retirer la seule dernière extension (md). Le produit attendu, 2026-08-01-carte-visite-v2-design-shadow-report.md, est donc absent, et le fichier écrit tombe hors de la racine du produit.

**Limites**

- la conduite (agent) est déclarée par « Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-24 » : le reçu ne prouve pas qui a répondu, et un run conduit par un agent n'est ni une faute ni un mérite (ADR-071)
- le cas limite l'écriture à terrain/docs/superpowers/specs et à son scratch terrain/.scratch ; ce reçu compare les chemins nommés par les outils d'écriture, les cibles littérales des commandes shell et les chemins nouveaux du porcelain, pas les effets d'un binaire opaque (cloisonnement.ecriture, ADR-063)
- les chemins absolus nommés dans le code de execute sont lus dans l'export brut (4 chemin(s)) ; un chemin construit dynamiquement, relatif ou hors d'un littéral n'est pas mesuré, et le reçu ne distingue pas une lecture d'une écriture (ADR-088)
- le scratch terrain/.scratch est lisible et scriptible, jamais compté comme produit ; il est collecté sous annexe/<cas>/ et le reçu le vérifie (ADR-067)
- le cas ne demande pas de tableau : l'ordre écriture/tableau n'est pas mesuré (ADR-068)
- le cas interdit le réseau ; les clients déclarés sont curl, wget, nc, ssh, git fetch/push/clone, npm install et pip install — un client non listé n'est pas mesuré (cloisonnement.reseau)
- le cas interdit les fichiers de contexte ; le reçu ne reconnaît que les noms déclarés — AGENTS.md, CLAUDE.md, .github/copilot-instructions.md (cloisonnement.fichiers_de_contexte)
- la promesse du cas n'est pas mesurée mécaniquement : elle relève d'un juge, que `compare` doit nommer avec sa rubrique pour `conforme` — le reçu ne vérifie ni l'identité du juge ni sa lecture (audit du 2026-10-24, D2, D3)
- outil(s) dont le nom évoque une écriture et qui ne nomment aucun chemin : write — l'ordre écriture/tableau ne les classe pas (H6)
- la pause est mesurée comme un tour `user` entre l'ouverture et la première écriture nommée : sa durée est l'intervalle entre la part précédente et ce tour, jamais une attente humaine, un accord donné sans tour n'est pas vu, et une écriture faite par une commande shell ne la clôt pas (ADR-069, ADR-078)
- le produit est comparé par sha256 aux fichiers lus hors du produit, relus au reçu ; un fichier lu puis modifié ou supprimé ne peut plus être reconnu (ADR-054)
- hors_produit ne retient que les chemins nouveaux du porcelain : une modification ou une suppression d'un fichier déjà présent hors du produit n'est pas attribuée au run (ADR-051)
- la porte et le gel replient un dossier non suivi en une seule entrée du porcelain ; le reçu étend seulement son propre côté après-run (`--untracked-files=all`), saute un chemin sous un dossier déjà non suivi avant le run et un ancêtre de la racine du produit, et compare les entrées comme des chaînes, sans décoder les guillemets de git (ADR-062)
- un fichier hors du produit a été écrit : terrain/docs/superpowers/specs/2026-08-01-carte-visite-v2-shadow-report.md (§4)

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

| chemin | nature |
| --- | --- |
| terrain/docs/superpowers/specs/2026-08-01-carte-visite-v2-shadow-report.md | produit |

Ces entrées interdisent `conforme` (`hors_produit`).

### 6.7 Les commandes shell mal formées

Le reçu ne nomme aucune commande shell mal formée.

### 6.8 Les commandes shell non interprétées

Le reçu ne nomme aucune commande shell non interprétable.

### 6.9 Les chemins nommés dans le code des outils

Le reçu ne nomme aucun chemin hors du cadre dans le code d'un outil.

## 7. Les pistes

- Classer les fichiers nouveaux hors du produit (contexte, artefact du client, produit) et corriger ce que la session a écrit, puis rejouer.
- Relire l'écart nommé par le juge dans `output.difference`, vérifier le produit, puis rejouer le cas.
- Relire la limite « la conduite (agent) est déclarée par « Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-24 » : le reçu ne prouve pas qui a répondu, et un run conduit par un agent n'est ni une faute ni un mérite (ADR-071) » et corriger la pièce qu'elle nomme.

## 8. Où lire les preuves

| Pièce | Lien |
| --- | --- |
| receipt.json | [receipt.json](receipt.json) |
| output.json | [output.json](output.json) |
| trace/echange.jsonl | [trace/echange.jsonl](trace/echange.jsonl) |
| gate.json | [gate.json](gate.json) |
| faits.json | [faits.json](faits.json) |
| raw/2026-10-24-055310-shadow-areas-design/2026-08-01-carte-visite-v2-shadow-report.md | [raw/2026-10-24-055310-shadow-areas-design/2026-08-01-carte-visite-v2-shadow-report.md](raw/2026-10-24-055310-shadow-areas-design/2026-08-01-carte-visite-v2-shadow-report.md) |

## 9. Ce que ce rapport ne prouve pas

Ce rapport est une vue des pièces du run, pas un nouveau run. Il ne juge ni le contenu ni la qualité du produit, ne remplace pas la lecture humaine, et ne mesure pas ce que le reçu ne mesure pas. Les absences et les limites sont dites dans les sections précédentes ; elles ne sont pas comblées par ce document.
