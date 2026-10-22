---
name: Résultat — 2026-10-18-085308-cas-jouet
description: ecart ; 0 règle non tenue ; 5 gestes déclarés
type: run-result
status: done
---

# Résultat du test — 2026-10-18-085308-cas-jouet, 2026-10-22

## 1. En une phrase

5 gestes attendus : 5 tenus, 0 violé, 0 non observé. La procédure attendue est tenue ; le juge a lu un comportement que le reçu ne mesure pas : voir la section 5.

## 2. Le contexte

Cas `2026-10-18-085308-cas-jouet`, session opencode, modèle minimax-m3.1-flash-free, dépôt jouet de deux fichiers, `README.md` et `app.py`, reconstruit par le script du cas. Durée : 5 min 26 s, 2 échanges sur 2.

## 3. Ce qui était attendu

La session lit `PLAYBOOK.md` de la révision jouet, rend un tableau d'une ligne par fichier lu et attend la réponse de l'opérateur sans avoir rien écrit, puis écrit l'unique fichier `terrain/aidd_docs/NOTES.md`, une ligne par règle, et rien d'autre.

Produit attendu : un seul fichier, à ce chemin exact : `aidd_docs/NOTES.md`.

## 4. Attendu contre observé

| Attendu | Observé | Résultat |
| --- | --- | --- |
| lire le playbook de framework-origin | « PLAYBOOK.md » lu | tenu |
| montrer un tableau avant d'écrire | aucune violation mesurée | tenu |
| attendre l'accord de l'opérateur | question posée ; aucune violation mesurée | tenu |
| écrire un seul fichier, à aidd_docs/NOTES.md | « NOTES.md » produit ; aucune violation mesurée | tenu |
| rester dans le cadre, sans réseau | aucune violation mesurée | tenu |

Le juge a lu autre chose que ce tableau : voir la section 5.

## 5. Ce que ça veut dire

Le juge retient : « le produit est celui de l'attendu — terrain/aidd_docs/NOTES.md, trois lignes, écrit après le tableau et après la question — mais la session a appelé Mnemolite cinq fois pendant le run, quatre lectures et un update_memory sur d2af9c4c, hors du dépôt et hors du cadre que le cas déclare ».

Le reçu ne mesure pas cette différence : elle ne vient pas d'une règle qu'il sait lire, et le tableau de la section 4 peut donc dire « tenu » là où le juge voit un écart.

## 6. Ce que tu peux décider

- **Utilisable en l'état ?** La procédure est tenue, donc le skill n'est pas mis en cause par ce run ; c'est la session ou la mesure qui ne l'est pas.

**À corriger.**
- Le juge a lu ce que le reçu ne voit pas. Si ce comportement doit être permis ou interdit, c'est le cas qu'il faut écrire, pas le rapport.
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
| Fichier produit | [NOTES.md](raw/2026-10-18-085308-cas-jouet/NOTES.md) |
