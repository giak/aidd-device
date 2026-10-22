---
name: Résultat — 2026-10-22-092005-spike-annees
description: non concluant ; 6 règles non tenues ; 5 gestes déclarés
type: run-result
status: done
---

# Résultat du test — 2026-10-22-092005-spike-annees, 2026-10-22

## 1. En une phrase

5 gestes attendus : 2 tenus, 2 violés, 1 non observé. Le run ne permet pas de conclure.

## 2. Le contexte

Cas `2026-10-22-092005-spike-annees`, session opencode, modèle minimax-m3.1-flash-free, audio-sync-tool, outil local de synchronisation musicale, à la révision 416ec1f. Durée : 12 min 20 s, 2 échanges sur 3.

## 3. Ce qui était attendu

La session lit le skill 05-spike de la révision sous test, lit le dépôt audio-sync-tool, montre ce qu'elle qualifie et où elle compte écrire et attend l'accord sans avoir écrit un seul fichier, puis investigue dans le dépôt et écrit sous `terrain/aidd_docs/backlog/spikes/` une spike qui porte `type: spike` et les sections Question, Decision, Bounds, Investigation, Outcome et Follow-up, et rien d'autre sous `terrain/`.

Produit attendu : un seul fichier `.md` sous `spikes/`, portant `type: spike` et les six sections du gabarit du skill ; aucun autre fichier sous cette racine.

## 4. Attendu contre observé

| Attendu | Observé | Résultat |
| --- | --- | --- |
| lire le skill 05-spike et les fichiers d'action qu'il nomme | « 05-spike » lu | tenu |
| lire le dépôt audio-sync-tool | « /terrain/ » lu | tenu |
| montrer ce qui est qualifié et attendre l'accord | aucun outil « question » dans la trace ; aucune violation mesurée | non observé |
| écrire la spike sous aidd_docs/backlog/spikes/ | 1 fichier(s) ; un fichier a été écrit hors du produit attendu | **violé** |
| rester dans le dossier du cas, sans réseau | une lecture est sortie du dossier autorisé ; une commande a lu hors du dossier autorisé ; une commande a écrit hors du fichier attendu ; aucune violation mesurée | **violé** |

## 5. Ce que ça veut dire

Règles non tenues : la session n'a pas montré de tableau ; une lecture est sortie du dossier autorisé ; une commande a lu hors du dossier autorisé ; une commande a écrit hors du fichier attendu ; une commande n'a pas pu être lue ; un fichier a été écrit hors du produit attendu.
Le reçu ne peut pas trancher : ce que le cas attend n'a pas pu être constaté, ou une règle bloque le verdict.

## 6. Ce que tu peux décider

- **Utilisable en l'état ?** Non : ce run ne démontre ni que le skill tient, ni qu'il échoue. Il faut rejouer.

**À corriger.**
- le cas exige un tableau avant l'écriture : la session ne l'a pas rendu, donc le skill doit dire plus clairement qu'il faut montrer avant d'écrire
- une lecture est sortie du dossier : le cas doit nommer les racines permises, ou le skill doit dire où lire
- une commande a lu hors du dossier : pareil, la racine est à déclarer ou l'ordre à corriger
- une commande a écrit hors du fichier attendu : vérifier si le skill autorise cette écriture
- une commande n'a pas pu être lue : le cas doit l'écrire en clair, sinon la mesure restera aveugle
- un fichier a été écrit en dehors du produit attendu : le cas doit dire s'il est permis
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
| Fichier produit | [spikes/survie-choix-annes-regeneration-caches.md](raw/2026-10-22-092005-spike-annees/spikes/survie-choix-annes-regeneration-caches.md) |
