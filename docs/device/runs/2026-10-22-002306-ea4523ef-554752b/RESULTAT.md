---
name: Résultat — 2026-10-18-085308-cas-jouet
description: non concluant ; 4 clauses, 3 tenues, 0 violée, 1 non jugée
type: run-result
status: done
---

# cas-jouet — run du 2026-10-22

## 1. Le verdict

**Non concluant.**
La session a tenu toutes les clauses mesurées du skill, puis un de ses gestes est sorti du cadre ; ce fait ne dit rien du skill.
Le skill n'est donc ni confirmé ni condamné : il faut rejouer dans un bac clos.

## 2. Ce qui s'est passé

La trace couvre 1 min 05 s, du premier message à 00:23 au dernier à 00:24.
1. 00:23 elle fait 6 lectures, dont `PLAYBOOK.md` et 1 autre fichier, et 2 fichiers sous `terrain`.
2. 00:23 une commande regarde hors du dossier.
3. 00:24 elle rend un tableau de 4 lignes sur 6 colonnes et pose sa question.
4. 00:24 vous répondez « Yes, that matches. Write the notes file at aidd_docs/NOTES.md, one … », et elle écrit aussitôt 1 fichier, 207 octets.
5. 00:24 elle rend son dernier message, qui nomme le chemin écrit, et s'arrête.

## 3. Le skill a-t-il tenu sa promesse ?

| ce que le skill promet | ce qui a été observé | état |
| --- | --- | --- |
| lire le playbook de `framework-origin` | « PLAYBOOK.md » lu du tour 2 | tenu |
| rendre le tableau et attendre | tableau rendu ; aucune écriture avant le tableau ; question posée du tour 19 | tenu |
| écrire `aidd_docs/NOTES.md` après la réponse figée | « NOTES.md » produit ; aucun fichier hors produit | tenu |
| le produit est juste, pas seulement présent | aucune mesure de la justesse | non jugé |

## 4. Pourquoi ce verdict, et à qui la faute

Une lecture est sortie du dossier autorisé (`aidd-device-work/README.md`). C'est un fait de session : ce que le run mesure ne condamne pas le skill. Une seule sortie interdit le verdict favorable.

## 5. Ce que ça dit du skill, et ce que ça ne dit pas

**Dit :**
- Le skill fait lire avant d'écrire : 6 lectures, la première à 00:23.
- Le produit demandé est là : 1 fichier, 207 octets, sous `aidd_docs/`.

**Ne dit pas :**
- Si le produit est juste : aucun juge n'a signé la promesse.
- Ce qu'un autre modèle, un autre dépôt ou un second run donnerait.
- Si un agent ou une personne a conduit ce run : la conduite n'est pas déclarée.

## 6. Trois gestes au plus

- **Skill** : rien à corriger de ce run ; à éprouver, une ligne qui dise de ne pas lire hors du dossier de travail.
- **Cas** : nommer le répertoire de travail dans le texte remis, pour que la session sache où elle travaille.
- **Protocole** : rejouer le même cas sur un second run.

[Annexe technique](RAPPORT.md) — les mesures, les limites et la trace.
