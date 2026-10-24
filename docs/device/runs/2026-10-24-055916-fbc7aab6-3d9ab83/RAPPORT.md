---
name: Rapport utilisateur — 2026-10-24-055310-shadow-areas-design
description: conforme ; aucune morsure ; 15 limite(s)
type: run-report
status: done
---

# Rapport utilisateur — 2026-10-24-055310-shadow-areas-design

> Vue déterministe du reçu `receipt.json` et de la trace `trace/echange.jsonl`. Reçu écrit le 2026-10-24T06:07:13+02:00. Ce rapport ne remplace ni le reçu ni l'output.

## 1. La réponse

Le reçu conclut `conforme` : aucun falsificateur mesuré n'a mordu ; limites : 15 (voir §5).

Cela atteste la chaîne, la porte, la trace et l'ordre des gestes, pas la qualité du skill ni la justesse du produit.

> « Le skill 03-shadow-areas a écrit, à côté de la source intacte, un rapport d'ombres classé dans les sept catégories et trois sévérités verrouillées, chaque écart portant une question finissant par « ? ». » — `output.json`

## 2. Ce qui a été testé

| | |
| --- | --- |
| Cas | `2026-10-24-055310-shadow-areas-design` |
| Session | opencode ; modèle `opencode/deepseek-v4.1-flash-free` ; fil `ses_e93ef8d88ffeg5U044HxnHrQIm` ; ouverte par Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-24 le 2026-10-24T05:59:39+02:00 |
| Budget | 1/1 échange(s), épuisé au seq 1 |
| Tableau | absent |
| Produit | 1 fichier(s) : `raw/2026-10-24-055310-shadow-areas-design/2026-08-01-carte-visite-v2-design-shadow-report.md` (2026-08-01-carte-visite-v2-design-shadow-report.md 4303 o) |
| Révisions | framework `fe48de12` ; terrain `6a74c46` |
| Durée | de 2026-10-24T05:59:40+02:00 à 2026-10-24T06:03:48+02:00 |
| Trace | 34 ligne(s) lue(s) ; outils : read 13, shell 3, edit 2, glob 1, write 1 |

## 3. Ce que le reçu établit

- le gel a été re-haché : empreinte `fbc7aab67ace1475c8943ccd7b15762c71464312997d0c408ce7b11857c5b738`, 2 fichier(s), 0 référence(s) (`gel_verifie`).
- la porte est citée : `54e48f62941d82b97e0498bf2eabb707cfe09d3936099476ed208e4debc3c127`, cas `2026-10-24-055310-shadow-areas-design`, gel `fbc7aab67ace1475c8943ccd7b15762c71464312997d0c408ce7b11857c5b738` (`porte`).
- la trace a été lue et rejouée : 34 ligne(s), 34 échange(s) dans la fenêtre, sha256 `8b14506ede0874071dc8b35d17754c468c34dbe4c73f1deb7c0502e2fa226451` (`trace_lue`), `2026-10-24T06:07:13+02:00` (`trace_verifiee`).
- la copie sous `raw/` a été re-hachée : 1 fichier(s), manifeste `e335e4b0c8c3a6bfbbe8a20b440cfa1fbb517b1ce101262c59ae56ac992572cc` (`produit.verifie`).
- le budget a été compté : 1/1 échange(s) (`echanges`).
- la conduite est déclarée par un agent (Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-24), non vérifiée (`conduite`).
- la forme du tableau a été lue : aucun tableau (`tableau`).

## 4. Ce qu'il n'établit pas

- la qualité du skill, la justesse du produit et la reproductibilité ;
- la conduite (agent ou humain), qui est déclarée par l'opérateur et jamais vérifiée ;
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
- la pause est mesurée comme un tour `user` entre l'ouverture et la première écriture nommée : sa durée est l'intervalle entre la part précédente et ce tour, jamais une attente humaine, un accord donné sans tour n'est pas vu, et une écriture faite par une commande shell ne la clôt pas (ADR-069, ADR-078)
- outil(s) de lecture sans chemin : glob — la lecture hors dossier ne les classe pas
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
- Relire la limite « outil(s) de lecture sans chemin : glob — la lecture hors dossier ne les classe pas » et corriger la pièce qu'elle nomme.

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
