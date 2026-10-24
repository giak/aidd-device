---
name: Rapport utilisateur — 2026-10-24-055310-shadow-areas-design
description: conforme ; aucune morsure ; 15 limite(s)
type: run-report
status: done
---

# Rapport utilisateur — 2026-10-24-055310-shadow-areas-design

> Vue déterministe du reçu `receipt.json` et de la trace `trace/echange.jsonl`. Reçu écrit le 2026-10-24T12:11:07+02:00. Ce rapport ne remplace ni le reçu ni l'output.

## 1. La réponse

Le reçu conclut `conforme` : aucun falsificateur mesuré n'a mordu ; limites : 15 (voir §5).

Cela atteste la chaîne, la porte, la trace et les pièces du run ; l'ordre des gestes du skill, la qualité du skill et la justesse du produit ne sont pas mesurés.

La promesse du cas n'est pas mesurée mécaniquement : elle relève d'un juge nommé (Buffy, agent de l'opérateur giak, revue interne non indépendante, rubrique P), et le rapport ne vérifie ni son identité ni sa lecture.

> « Le skill 03-shadow-areas, dans la révision f43af3fe qui porte la règle de nommage corrigée, a lu la spec, écrit son rapport sous 2026-08-01-carte-visite-v2-design-shadow-report.md à côté d'elle, avec six écarts classés et la source intacte. » — `output.json`

## 2. Ce qui a été testé

| | |
| --- | --- |
| Cas | `2026-10-24-055310-shadow-areas-design` |
| Session | opencode ; modèle `openrouter/cohere/north-mini-code:free` ; fil `ses_e92a08340ffeRTd3tm4Ti7rwAE` ; ouverte par Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-24 le 2026-10-24T12:05:36+02:00 |
| Budget | 1/1 échange(s), épuisé au seq 1 |
| Tableau | absent |
| Attendu vu | déclaré non ; mesure non |
| Produit | 1 fichier(s) : `raw/2026-10-24-055310-shadow-areas-design/2026-08-01-carte-visite-v2-design-shadow-report.md` (2026-08-01-carte-visite-v2-design-shadow-report.md 2023 o) |
| Révisions | framework `f43af3fe` ; terrain `6a74c46` |
| Durée | de 2026-10-24T12:05:38+02:00 à 2026-10-24T12:10:02+02:00 (premier et dernier message de la trace) |
| Fenêtre du reçu | déclarée de 2026-10-24T12:05:38+02:00 à 2026-10-24T12:10:43+02:00 |
| Trace | 95 ligne(s) lue(s) ; outils : read 23, shell 13, write 5, edit 4, skill 1 |

## 3. Ce que le reçu établit

- le gel a été re-haché : empreinte `5b1e2724dd9cb075a35c179f17073a183808c4d2c472b388ce7c5ffad3dd3706`, 2 fichier(s), 1 référence(s) (`gel_verifie`).
- la porte est citée : `c1e6f4071b06143de8def0277a60a45d8d8f5cbf4eb36f8c7205d26a53e145d5`, cas `2026-10-24-055310-shadow-areas-design`, gel `5b1e2724dd9cb075a35c179f17073a183808c4d2c472b388ce7c5ffad3dd3706` (`porte`).
- la trace a été lue et rejouée : 95 ligne(s), dont 95 dans la fenêtre du run, sha256 `edb4b3a44e20aecafee4b01ef97ba5832653ad74f2201b5ec0c7cb1afb8946f1` (`trace_lue`), `2026-10-24T12:11:07+02:00` (`trace_verifiee`).
- la copie sous `raw/` a été re-hachée : 1 fichier(s), manifeste `703881efccc17a3f7c85b7b5c8bbad4905d5f74f7caf802e16db4728c040a151` (`produit.verifie`).
- le budget a été compté : 1/1 échange(s) (`echanges`).
- la conduite est déclarée par un agent (Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-24), non vérifiée (`conduite`).
- la forme du tableau a été lue : aucun tableau (`tableau`).
- la promesse du cas est `juge_seul` : la promesse est énoncée, mais aucune mesure ne l'éprouve : `compare` doit nommer le juge et sa rubrique (`promesse`).
- le juge est nommé par l'output : Buffy, agent de l'opérateur giak, revue interne non indépendante, rubrique P (`output.promesse`).

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

Aucun falsificateur ne mord dans le reçu.

**Limites**

- la conduite (agent) est déclarée par « Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-24 » : le reçu ne prouve pas qui a répondu, et un run conduit par un agent n'est ni une faute ni un mérite (ADR-071)
- le cas limite l'écriture à terrain/docs/superpowers/specs et à son scratch terrain/.scratch ; ce reçu compare les chemins nommés par les outils d'écriture, les cibles littérales des commandes shell et les chemins nouveaux du porcelain, pas les effets d'un binaire opaque (cloisonnement.ecriture, ADR-063)
- le scratch terrain/.scratch est lisible et scriptible, jamais compté comme produit ; il est collecté sous annexe/<cas>/ et le reçu le vérifie (ADR-067)
- le cas déclare un scratch, mais le run n'a aucune annexe collectée : les scripts et les sorties qu'il cite ne sont pas dans le reçu (ADR-067)
- le cas ne demande pas de tableau : l'ordre écriture/tableau n'est pas mesuré (ADR-068)
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

- Répéter sur un autre modèle ou un vrai dépôt, et lire le produit à la main : le reçu ne juge pas son contenu.
- Relire la limite « la conduite (agent) est déclarée par « Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-24 » : le reçu ne prouve pas qui a répondu, et un run conduit par un agent n'est ni une faute ni un mérite (ADR-071) » et corriger la pièce qu'elle nomme.
- Relire la limite « le cas déclare un scratch, mais le run n'a aucune annexe collectée : les scripts et les sorties qu'il cite ne sont pas dans le reçu (ADR-067) » et corriger la pièce qu'elle nomme.

## 8. Où lire les preuves

| Pièce | Lien |
| --- | --- |
| receipt.json | [receipt.json](receipt.json) |
| output.json | [output.json](output.json) |
| trace/echange.jsonl | [trace/echange.jsonl](trace/echange.jsonl) |
| gate.json | [gate.json](gate.json) |
| faits.json | [faits.json](faits.json) |
| raw/2026-10-24-055310-shadow-areas-design/2026-08-01-carte-visite-v2-design-shadow-report.md | [raw/2026-10-24-055310-shadow-areas-design/2026-08-01-carte-visite-v2-design-shadow-report.md](raw/2026-10-24-055310-shadow-areas-design/2026-08-01-carte-visite-v2-design-shadow-report.md) |

## 9. Ce que ce rapport ne prouve pas

Ce rapport est une vue des pièces du run, pas un nouveau run. Il ne juge ni le contenu ni la qualité du produit, ne remplace pas la lecture humaine, et ne mesure pas ce que le reçu ne mesure pas. Les absences et les limites sont dites dans les sections précédentes ; elles ne sont pas comblées par ce document.
