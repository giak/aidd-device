---
name: Rapport utilisateur — 2026-10-15-133423-promesse-memoire-avant-ecriture
description: non concluant ; morsure(s) : tableau_absent ; 2 limite(s)
type: run-report
status: done
---

# Rapport utilisateur — 2026-10-15-133423-promesse-memoire-avant-ecriture

> Vue déterministe du reçu `receipt.json` et de la trace `trace/echange.jsonl`. Reçu écrit le 2026-10-21T08:12:55+02:00. Ce rapport ne remplace ni le reçu ni l'output.

## 1. La réponse

Le reçu conclut `non concluant` ; morsures : `tableau_absent` ; limites : 2 (voir §5).

Un non concluant n'est pas une défaillance du dispositif : il dit ce que la preuve ne permet pas de conclure.

> « La session a lu la skill, posé une question, puis s'est arrêtée sans tableau ni produit après des essais de scan en erreur. » — `output.json`

## 2. Ce qui a été testé

| | |
| --- | --- |
| Cas | `2026-10-15-133423-promesse-memoire-avant-ecriture` |
| Session | opencode ; modèle `ollama/qwen3:8b` ; fil `ses_ea2fcbb86ffeStrQPkoONhWbXb` ; ouverte par agent le 2026-10-21T07:50:57+02:00 |
| Budget | 1/3 échange(s) |
| Tableau | absent |
| Produit | absent |
| Révisions | framework `fe48de12` ; terrain `416ec1f` |
| Durée | de 2026-10-21T07:51:03+02:00 à 2026-10-21T08:11:07+02:00 |
| Trace | 16 ligne(s) lue(s) ; outils : execute 4, glob 1, question 1, read 1 |

## 3. Ce que le reçu établit

- le gel a été re-haché : empreinte `0d9a2180c0f1251f785727d726d446d4fa9387331143c35cca5a701b678204e8`, 2 fichier(s), 8 référence(s) (`gel_verifie`).
- la porte est citée : `e48d1bdea324c801cd4d434897e514a1980b70d42fa72c25a6c13836736a1a75`, cas `2026-10-15-133423-promesse-memoire-avant-ecriture`, gel `0d9a2180c0f1251f785727d726d446d4fa9387331143c35cca5a701b678204e8` (`porte`).
- la trace a été lue et rejouée : 16 ligne(s), 16 échange(s) dans la fenêtre, sha256 `3846a03a7a90859edb290bb4108339adc72091614e8d251de5a672e8d9fe2eb1` (`trace_lue`), `2026-10-21T08:12:55+02:00` (`trace_verifiee`).
- la copie sous `raw/` a été re-hachée : 0 fichier(s), manifeste `ec4814399baf5f4b89bdfbc68e525e2399d5ec64351aa9e8756573de2b653bc4` (`produit.verifie`).
- le budget a été compté : 1/3 échange(s) (`echanges`).
- la forme du tableau a été lue : aucun tableau (`tableau`).

## 4. Ce qu'il n'établit pas

- la qualité du skill, la justesse du produit et la reproductibilité ;
- les gestes humains, qui reposent sur `temoignage` ;
- les lectures faites par un outil `shell`, dont la commande n'est pas dans la trace normalisée ;
- les limites du reçu, détaillées au §5.

Ce que l'output écarte comme non testable :

- la mémoire décrit correctement l'architecture, les conventions et les décisions du terrain : le contenu ne se juge pas ici : aucune vérité de référence n'existe dans ce dispositif, et le cas mesure l'ordre des gestes, jamais la justesse du texte (v6 §8 : comparer, ne pas attribuer)
- les gabarits sont remplis plutôt que laissés vides : la complétude d'une section dépend du dépôt lu ; `memory-rules.md` interdit au contraire la section inutilisée, et rien dans la révision sous test ne fixe un taux de remplissage
- l'action `sync` a câblé les outils IA du poste et la mémoire est « wired » : hors du cas par la demande §7 : le câblage écrit hors du répertoire de travail ; le flux de la skill va jusqu'à `sync`, la demande s'arrête avant
- une ligne écrite à la main dans un banc survit à `refresh` : le défaut est connu de l'auteur du commit et chiffré dans son message (« survives a refresh 1 run in 2 ») ; le cas prend un dépôt **sans** banc, donc `refresh` n'est pas exercé — l'attendu serait non mesurable ici
- le nombre de lignes du tableau, et le nombre de fichiers écrits : le scan décide ce que le dépôt prouve ; ni la révision sous test ni la demande ne fixent un chiffre, et un chiffre écrit ici serait une invention
- le rapport final prend la forme de `assets/report.md` : cet asset est la sortie de l'action `check`, absente du flux `setup` ; exiger sa forme jugerait une action que le cas ne déclenche pas
- la session n'a posé aucune question hors du tableau : la skill demande d'« ask for what the repo cannot prove » : une question de ce type est prévue, et la troisième réponse figée la couvre ; l'interdire contredirait la révision sous test

## 5. Les morsures et les limites

| Clé | Ce que la morsure dit |
| --- | --- |
| tableau_absent | la trace ne porte aucun tableau rendu par la session ; valeur : true |

**Limites**

- la session n'a rien produit : le produit est sa sortie brute (§9)
- la trace ne porte aucun tableau rendu par la session (§5, F2)

## 6. Les lectures hors dossier

Le reçu ne nomme aucune lecture hors dossier.

## 7. Les pistes

- Vérifier que la session rend un tableau avant d'écrire, puis rejouer.
- Vérifier le chemin du produit et la collecte sous `raw/<cas>/`, puis rejouer.

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
