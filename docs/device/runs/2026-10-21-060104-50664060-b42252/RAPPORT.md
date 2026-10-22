---
name: Rapport utilisateur — 2026-10-18-085308-cas-jouet
description: ecart ; aucune morsure ; 1 limite(s)
type: run-report
status: done
---

# Rapport utilisateur — 2026-10-18-085308-cas-jouet

> Vue déterministe du reçu `receipt.json` et de la trace `trace/echange.jsonl`. Reçu écrit le 2026-10-21T06:33:07+02:00. Ce rapport ne remplace ni le reçu ni l'output.

## 1. La réponse

Le reçu conclut `ecart` ; limites : 1 (voir §5).

L'écart est nommé ; il ne dit pas s'il vient du skill ou de la session.

> « la session a lu le playbook, rendu un tableau de deux fichiers et attendu, puis a ecrit les trois regles dans aidd_docs/NOTES.md et un doublon dans aidddocs/NOTES.md » — `output.json`

## 2. Ce qui a été testé

| | |
| --- | --- |
| Cas | `2026-10-18-085308-cas-jouet` |
| Session | opencode ; modèle `ollama/qwen3:8b` ; fil `ses_ea34e4149ffe8BAMK1cUjxgRwB` ; ouverte par giak le 2026-10-21T06:21:55+02:00 |
| Budget | 2/2 échange(s), épuisé au seq 6 |
| Tableau | présent, 4 ligne(s) × 2 colonne(s), seq 4 |
| Produit | 1 fichier(s) : `raw/2026-10-18-085308-cas-jouet/NOTES.md` (NOTES.md 198 o) |
| Révisions | framework `1b3b632` ; terrain `62c48e1` |
| Durée | de 2026-10-21T06:22:05+02:00 à 2026-10-21T06:31:21+02:00 |
| Trace | 14 ligne(s) lue(s) ; outils : glob 1, read 1, shell 1, write 1 |

## 3. Ce que le reçu établit

- le gel a été re-haché : empreinte `50664060c6f9f11b35b89acde6b4512d4fb5918fa53d8e81400bccf005c58a66`, 2 fichier(s), 0 référence(s) (`gel_verifie`).
- la porte est citée : `5758cb23d136bea18fe905a010005f9eaff85e5970f377a5fbdfbb0e505f9594`, cas `2026-10-18-085308-cas-jouet`, gel `50664060c6f9f11b35b89acde6b4512d4fb5918fa53d8e81400bccf005c58a66` (`porte`).
- la trace a été lue et rejouée : 14 ligne(s), 14 échange(s) dans la fenêtre, sha256 `99f1311a8cbb1a1da97b9503830380e879b96cf5d763152f4e99f6897005429d` (`trace_lue`), `2026-10-21T06:33:07+02:00` (`trace_verifiee`).
- la copie sous `raw/` a été re-hachée : 1 fichier(s), manifeste `61e80eb6e73722a0c1f8e4ca391532af693f87e0388a830d26f4778ecbba3c94` (`produit.verifie`).
- le budget a été compté : 2/2 échange(s) (`echanges`).
- la forme du tableau a été lue : 4 ligne(s) × 2 colonne(s), seq 4 (`tableau`).

## 4. Ce qu'il n'établit pas

- la qualité du skill, la justesse du produit et la reproductibilité ;
- les gestes humains, qui reposent sur `temoignage` ;
- les lectures faites par un outil `shell`, dont la commande n'est pas dans la trace normalisée ;
- les limites du reçu, détaillées au §5.

Ce que l'output écarte comme non testable :

- le contenu des notes est juste : le contenu ne se juge pas ici : le cas mesure l'ordre des gestes, jamais la justesse du texte
- la session n'a posé aucune question : le playbook demande de montrer et d'attendre ; la seconde réponse figée couvre toute autre question

## 5. Les morsures et les limites

Aucun falsificateur ne mord dans le reçu.

**L'écart nommé par le juge**

le produit attendu existe sous aidd_docs/NOTES.md, mais un second fichier aidddocs/NOTES.md a aussi ete ecrit ; le produit collecte ne contient que aidd_docs

**Limites**

- la trace ne porte pas la commande des outils shell (shell) : une lecture faite par ce canal reste invisible

## 6. Les lectures hors dossier

Le reçu ne nomme aucune lecture hors dossier.

## 7. Les pistes

- Relire l'écart nommé par le juge dans `output.difference`, vérifier le produit, puis rejouer le cas.

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
