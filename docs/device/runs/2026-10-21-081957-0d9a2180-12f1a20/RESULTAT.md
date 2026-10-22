---
name: Résultat — 2026-10-15-133423-promesse-memoire-avant-ecriture
description: non concluant ; 1 règle non tenue ; 5 gestes déclarés
type: run-result
status: done
---

# Résultat du test — 2026-10-15-133423-promesse-memoire-avant-ecriture, 2026-10-21

## 1. En une phrase

5 gestes attendus : 2 tenus, 1 violé, 2 non observés. Le run ne permet pas de conclure.

## 2. Le contexte

Cas `2026-10-15-133423-promesse-memoire-avant-ecriture`, session opencode, modèle minimax-m3.1-flash-free, audio-sync-tool, la copie du terrain sous `terrain/`, sans `aidd_docs/` au départ, et la révision sous test sous `framework-origin/`. Durée : 15 min 26 s, 2 échanges sur 3.

## 3. Ce qui était attendu

Au vu de la demande, la session lit la skill de la révision sous test, rend d'abord un tableau lu depuis le dépôt et attend la réponse de l'opérateur sans avoir modifié un seul fichier du projet, puis écrit sous `terrain/aidd_docs/` les seuls fichiers dont la colonne `Write to` de `references/memory-destinations.md` nomme la destination — `memory/backlog.md` en moins, écarté par l'opérateur — et termine par un court rapport de ce qui a changé.

Produit attendu : chaque fichier écrit est une destination de la colonne `Write to` de `references/memory-destinations.md`, à son chemin exact ; aucun autre fichier n'est un produit.

## 4. Attendu contre observé

| Attendu | Observé | Résultat |
| --- | --- | --- |
| lire la skill de la révision sous test | « 02-project-memory/SKILL.md » lu | tenu |
| montrer un tableau avant d'écrire | aucune violation mesurée | tenu |
| attendre la réponse de l'opérateur | question posée ; mesure absente du reçu | non observé |
| écrire sous aidd_docs, aux destinations du skill | « memory/README.md » produit ; mesure absente du reçu | non observé |
| rester dans le dossier du cas, sans réseau | une lecture est sortie du dossier autorisé ; mesure absente du reçu | **violé** |

## 5. Ce que ça veut dire

Règles non tenues : une lecture est sortie du dossier autorisé.
Le reçu ne peut pas trancher : ce que le cas attend n'a pas pu être constaté, ou une règle bloque le verdict.

## 6. Ce que tu peux décider

- **Utilisable en l'état ?** Non : ce run ne démontre ni que le skill tient, ni qu'il échoue. Il faut rejouer.

**À corriger.**
- une lecture est sortie du dossier : le cas doit nommer les racines permises, ou le skill doit dire où lire
- Un second run, sur un autre modèle, dira si le comportement vient du skill ou de la session.

## 7. Ce que ce run ne dit pas

- La justesse de ce que la session a écrit n'est pas jugée ici.
- Un autre modèle, un autre dépôt, un autre skill ne sont pas couverts.
- Les gestes humains reposent sur le témoignage de la personne.
- Ce que le reçu ne sait pas mesurer est listé dans les limites du rapport technique.

## 8. Les preuves

| Pièce | Lien |
| --- | --- |
| Rapport technique | [RAPPORT.md](RAPPORT.md) |
| Reçu | [receipt.json](receipt.json) |
| Décision du juge | [output.json](output.json) |
| Trace | [trace/echange.jsonl](trace/echange.jsonl) |
| Fichier produit | [CONTRIBUTING.md](raw/2026-10-15-133423-promesse-memoire-avant-ecriture/CONTRIBUTING.md) |
| Fichier produit | [GUIDELINES.md](raw/2026-10-15-133423-promesse-memoire-avant-ecriture/GUIDELINES.md) |
| Fichier produit | [README.md](raw/2026-10-15-133423-promesse-memoire-avant-ecriture/README.md) |
| Fichier produit | [memory/README.md](raw/2026-10-15-133423-promesse-memoire-avant-ecriture/memory/README.md) |
| Fichier produit | [memory/api.md](raw/2026-10-15-133423-promesse-memoire-avant-ecriture/memory/api.md) |

22 fichiers produits au total ; la liste complète est dans le rapport technique.
