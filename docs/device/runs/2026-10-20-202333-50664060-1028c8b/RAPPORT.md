---
name: Rapport utilisateur — 2026-10-18-085308-cas-jouet
description: non concluant ; morsure(s) : tableau_absent ; 3 limite(s)
type: run-report
status: done
---

# Rapport utilisateur — 2026-10-18-085308-cas-jouet

> Vue déterministe du reçu `receipt.json` et de la trace `trace/echange.jsonl`. Reçu écrit le 2026-10-20T20:47:54+02:00. Ce rapport ne remplace ni le reçu ni l'output.

## 1. La réponse

Le reçu conclut `non concluant` ; morsures : `tableau_absent` ; limites : 3 (voir §5).

Aucune cause n'est nommée dans l'output : le rapport ne peut pas dire quelle couche a manqué.

Ce reçu ne porte pas de bloc `promesse` : il précède ce champ, et le rapport ne peut pas dire ce que le verdict couvre de la promesse du cas.

> « la session a lu le playbook, montré un tableau de deux fichiers et attendu la réponse, puis a écrit les trois règles dans aidldocs/NOTES.md au lieu de aidd_docs/NOTES.md » — `output.json`

## 2. Ce qui a été testé

| | |
| --- | --- |
| Cas | `2026-10-18-085308-cas-jouet` |
| Session | opencode ; modèle `ollama/qwen3:8b` ; fil `ses_ea564a976ffevcpzB4aY03ELBF` ; ouverte par buffy le 2026-10-20T20:38:12+02:00 |
| Budget | 2/2 échange(s), épuisé au seq 7 |
| Tableau | absent |
| Attendu vu | déclaré non ; mesure absente du reçu (antérieur à l'ADR-092) |
| Produit | 1 fichier(s) : `raw/2026-10-18-085308-cas-jouet/NOTES.md` (NOTES.md 206 o) |
| Révisions | framework `1b3b632` ; terrain `62c48e1` |
| Durée | de 2026-10-20T20:38:17+02:00 à 2026-10-20T20:43:54+02:00 (premier et dernier message de la trace) |
| Fenêtre du reçu | déclarée de 2026-10-20T20:38:17+02:00 à 2026-10-20T20:46:27+02:00 |
| Trace | 12 ligne(s) lue(s) ; outils : glob 1, read 1, write 1 |

## 3. Ce que le reçu établit

- le gel a été re-haché : empreinte `50664060c6f9f11b35b89acde6b4512d4fb5918fa53d8e81400bccf005c58a66`, 2 fichier(s), 0 référence(s) (`gel_verifie`).
- la porte est citée : `1ce7c051ce848711d6fe649e501fbfdb9bcd7f7034c1093f4162055acd6e6fac`, cas `2026-10-18-085308-cas-jouet`, gel `50664060c6f9f11b35b89acde6b4512d4fb5918fa53d8e81400bccf005c58a66` (`porte`).
- la trace a été lue et rejouée : 12 ligne(s), dont 12 dans la fenêtre du run, sha256 `eca8eb4a27ed8806f469dd4a0f08bccf018134ada3e19db4a7dc8a9a5ce4f7ca` (`trace_lue`), `2026-10-20T20:47:54+02:00` (`trace_verifiee`).
- la copie sous `raw/` a été re-hachée : 1 fichier(s), manifeste `31b8ba6f649d0b5e7295d3387fc31b1067a2f2ab9bec4cd5581398c0f71770c7` (`produit.verifie`).
- le budget a été compté : 2/2 échange(s) (`echanges`).
- la conduite n'est pas déclarée par ce reçu (`conduite` absent ou nul).
- la forme du tableau a été lue : aucun tableau (`tableau`).
- le reçu ne porte pas de bloc `promesse` : il ne dit pas ce que son verdict couvre de la promesse du cas.

## 4. Ce qu'il n'établit pas

- la qualité du skill, la justesse du produit et la reproductibilité ;
- la conduite (agent ou humain), qui est déclarée par l'opérateur et jamais vérifiée ;
- l'identité du juge, sa rubrique et la fidélité de sa lecture ;
- le contenu d'une commande `shell` construite dynamiquement, que le reçu ne sait pas lire (ADR-051) ;
- les limites du reçu, détaillées au §5.

Ce que l'output écarte comme non testable :

- le contenu des notes est juste : le contenu ne se juge pas ici : le cas mesure l'ordre des gestes, jamais la justesse du texte
- la session n'a posé aucune question : le playbook demande de montrer et d'attendre ; la seconde réponse figée couvre toute autre question

## 5. Les morsures et les limites

| Clé | Ce que la morsure dit |
| --- | --- |
| tableau_absent | la trace ne porte aucun tableau rendu par la session ; valeur : true |

**Limites**

- la trace ne porte aucun tableau rendu par la session (§5, F2)
- le reçu ne porte pas `lecture_hors_dossier` : il a été écrit avant l'ADR-049, et les lectures hors dossier ne sont pas mesurées
- le reçu ne porte pas `promesse` : écrit avant ce champ, il ne dit pas ce que son verdict couvre de la promesse du cas

## 6. Les effets hors cadre

### 6.1 Les lectures hors dossier

Ce reçu a été écrit avant l'ADR-049 : il ne porte pas `lecture_hors_dossier`. Le rapport ne peut donc pas conclure sur les lectures hors dossier, et l'absence de ce champ est dite dans les limites.

### 6.2 Les écritures d'outil hors dossier

Ce reçu ne porte pas `ecriture_hors_dossier` : il a été écrit avant l'ADR-063, et les chemins nommés par les outils d'écriture ne sont pas mesurés.

### 6.3 Les lectures par une commande shell

Ce reçu ne porte pas `shell_hors_dossier` : il a été écrit avant l'ADR-051, et les lectures faites par une commande shell ne sont pas mesurées.

### 6.4 Les écritures shell hors du produit

Ce reçu ne porte pas `shell_ecriture_hors_produit` : il a été écrit avant l'ADR-051, et les écritures d'une commande shell ne sont pas mesurées.

### 6.5 Les appels réseau

Ce reçu ne porte pas `reseau` : il a été écrit avant l'ADR-051, et les appels réseau ne sont pas mesurés.

### 6.6 Les fichiers hors du produit

Ce reçu ne porte pas `hors_produit` : il a été écrit avant l'ADR-051, et les fichiers nouveaux hors du produit ne sont pas mesurés.

### 6.7 Les commandes shell mal formées

Ce reçu ne porte pas `shell_invalide` : il a été écrit avant l'ADR-070, et une commande mal formée est comptée avec les commandes non interprétées.

### 6.8 Les commandes shell non interprétées

Ce reçu ne porte pas `shell_non_interpretable` : il a été écrit avant l'ADR-051, et une commande shell non littérale n'est pas signalée.

### 6.9 Les chemins nommés dans le code des outils

Ce reçu ne porte pas `code_hors_dossier` : il a été écrit avant l'ADR-088, et les chemins du code d'un outil ne sont pas mesurés.

## 7. Les pistes

- Vérifier que la session rend un tableau avant d'écrire, puis rejouer.
- Rejouer avec un reçu écrit après l'ADR-049, ou reconstruire les pièces avec la règle actuelle.

## 8. Où lire les preuves

| Pièce | Lien |
| --- | --- |
| receipt.json | [receipt.json](receipt.json) |
| output.json | [output.json](output.json) |
| trace/echange.jsonl | [trace/echange.jsonl](trace/echange.jsonl) |
| gate.json | [gate.json](gate.json) |
| faits.json | [faits.json](faits.json) |
| raw/2026-10-18-085308-cas-jouet/NOTES.md | [raw/2026-10-18-085308-cas-jouet/NOTES.md](raw/2026-10-18-085308-cas-jouet/NOTES.md) |

## 9. Ce que ce rapport ne prouve pas

Ce rapport est une vue des pièces du run, pas un nouveau run. Il ne juge ni le contenu ni la qualité du produit, ne remplace pas la lecture humaine, et ne mesure pas ce que le reçu ne mesure pas. Les absences et les limites sont dites dans les sections précédentes ; elles ne sont pas comblées par ce document.
