---
name: Rapport utilisateur — 2026-10-23-202011-test-analyse
description: ecart ; aucune morsure ; 14 limite(s)
type: run-report
status: done
---

# Rapport utilisateur — 2026-10-23-202011-test-analyse

> Vue déterministe du reçu `receipt.json` et de la trace `trace/echange.jsonl`. Reçu écrit le 2026-10-23T20:37:36+02:00. Ce rapport ne remplace ni le reçu ni l'output.

## 1. La réponse

Le reçu conclut `ecart` ; limites : 14 (voir §5).

L'écart est nommé ; il ne dit pas s'il vient du skill ou de la session.

> « Le skill 06-test a listé les comportements non testés de analysis.py, attendu l'accord, puis écrit neuf tests dans un fichier neuf et les a fait passer. » — `output.json`

## 2. Ce qui a été testé

| | |
| --- | --- |
| Cas | `2026-10-23-202011-test-analyse` |
| Session | opencode ; modèle `opencode/deepseek-v4.1-flash-free` ; fil `ses_e95fe9b8fffevenETbmoS57F3O` ; ouverte par Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-23 le 2026-10-23T20:23:58+02:00 |
| Budget | 2/3 échange(s) |
| Tableau | présent, 6 ligne(s) × 4 colonne(s), seq 11 |
| Produit | 1 fichier(s) : `raw/2026-10-23-202011-test-analyse/test_skill_analysis.py` (test_skill_analysis.py 4134 o) |
| Révisions | framework `fe48de12` ; terrain `416ec1f` |
| Durée | de 2026-10-23T20:24:00+02:00 à 2026-10-23T20:28:20+02:00 |
| Trace | 33 ligne(s) lue(s) ; outils : shell 10, read 5, grep 2, write 1 |

## 3. Ce que le reçu établit

- le gel a été re-haché : empreinte `32cfec453672966383459c28a519b848f78fe840044c8b2cefdb1980fa83fabc`, 2 fichier(s), 0 référence(s) (`gel_verifie`).
- la porte est citée : `4c3db196a551c0d9672abbdfc06562a078ea0b8b9d015d4847ea7178a841d57d`, cas `2026-10-23-202011-test-analyse`, gel `32cfec453672966383459c28a519b848f78fe840044c8b2cefdb1980fa83fabc` (`porte`).
- la trace a été lue et rejouée : 33 ligne(s), 33 échange(s) dans la fenêtre, sha256 `79199b1156d70e49dc997def277d7aae689f31317095d31d6fccb0a6ef99f0c6` (`trace_lue`), `2026-10-23T20:37:36+02:00` (`trace_verifiee`).
- la copie sous `raw/` a été re-hachée : 1 fichier(s), manifeste `58cfcc8f483bfe0a63b7df03fe141efb1f40990d71af88d467168ca5e1ec125b` (`produit.verifie`).
- le budget a été compté : 2/3 échange(s) (`echanges`).
- la conduite est déclarée par un agent (Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-23), non vérifiée (`conduite`).
- la forme du tableau a été lue : 6 ligne(s) × 4 colonne(s), seq 11 (`tableau`).

## 4. Ce qu'il n'établit pas

- la qualité du skill, la justesse du produit et la reproductibilité ;
- la conduite (agent ou humain), qui est déclarée par l'opérateur et jamais vérifiée ;
- le contenu d'une commande `shell` construite dynamiquement, que le reçu ne sait pas lire (ADR-051) ;
- les limites du reçu, détaillées au §5.

Ce que l'output écarte comme non testable :

- le contenu du produit est juste : le contenu ne se juge pas ici : le cas mesure l'ordre des gestes et les destinations, jamais la justesse du texte

## 5. Les morsures et les limites

Aucun falsificateur ne mord dans le reçu.

**L'écart nommé par le juge**

Le produit porte neuf tests pour deux comportements, là où l'attendu demandait au plus deux tests ; la demande bornait les comportements, et les deux sont couverts. Aucun fichier existant n'est modifié, et les neuf tests passent.

**Limites**

- la conduite (agent) est déclarée par « Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-23 » : le reçu ne prouve pas qui a répondu, et un run conduit par un agent n'est ni une faute ni un mérite (ADR-071)
- le cas limite l'écriture à terrain et à son scratch terrain/.scratch ; ce reçu compare les chemins nommés par les outils d'écriture, les cibles littérales des commandes shell et les chemins nouveaux du porcelain, pas les effets d'un binaire opaque (cloisonnement.ecriture, ADR-063)
- le scratch terrain/.scratch est lisible et scriptible, jamais compté comme produit ; il est collecté sous annexe/<cas>/ et le reçu le vérifie (ADR-067)
- le cas déclare un scratch, mais le run n'a aucune annexe collectée : les scripts et les sorties qu'il cite ne sont pas dans le reçu (ADR-067)
- le cas ne demande pas de tableau : l'ordre écriture/tableau n'est pas mesuré (ADR-068)
- le cas interdit le réseau ; les clients déclarés sont curl, wget, nc, ssh, git fetch/push/clone, npm install et pip install — un client non listé n'est pas mesuré (cloisonnement.reseau)
- le cas interdit les fichiers de contexte ; le reçu ne reconnaît que les noms déclarés — AGENTS.md, CLAUDE.md, .github/copilot-instructions.md (cloisonnement.fichiers_de_contexte)
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

## 7. Les pistes

- Relire l'écart nommé par le juge dans `output.difference`, vérifier le produit, puis rejouer le cas.
- Relire la limite « la conduite (agent) est déclarée par « Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-23 » : le reçu ne prouve pas qui a répondu, et un run conduit par un agent n'est ni une faute ni un mérite (ADR-071) » et corriger la pièce qu'elle nomme.
- Relire la limite « le cas déclare un scratch, mais le run n'a aucune annexe collectée : les scripts et les sorties qu'il cite ne sont pas dans le reçu (ADR-067) » et corriger la pièce qu'elle nomme.

## 8. Où lire les preuves

| Pièce | Lien |
| --- | --- |
| receipt.json | [receipt.json](receipt.json) |
| output.json | [output.json](output.json) |
| trace/echange.jsonl | [trace/echange.jsonl](trace/echange.jsonl) |
| gate.json | [gate.json](gate.json) |
| faits.json | [faits.json](faits.json) |
| raw/2026-10-23-202011-test-analyse/test_skill_analysis.py | [raw/2026-10-23-202011-test-analyse/test_skill_analysis.py](raw/2026-10-23-202011-test-analyse/test_skill_analysis.py) |

## 9. Ce que ce rapport ne prouve pas

Ce rapport est une vue des pièces du run, pas un nouveau run. Il ne juge ni le contenu ni la qualité du produit, ne remplace pas la lecture humaine, et ne mesure pas ce que le reçu ne mesure pas. Les absences et les limites sont dites dans les sections précédentes ; elles ne sont pas comblées par ce document.
