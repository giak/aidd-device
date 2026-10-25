---
name: Résultat — 2026-10-15-133423-promesse-memoire-avant-ecriture
description: non concluant ; 6 clauses, 3 tenues, 0 violée, 3 non jugées
type: run-result
status: done
---

# promesse-memoire-avant-ecriture — run du 2026-10-21

## 1. Le verdict

**Non concluant.**
La session a tenu toutes les clauses mesurées du skill, puis un de ses gestes est sorti du cadre ; ce fait ne dit rien du skill.
Le skill n'est donc ni confirmé ni condamné : il faut rejouer dans un bac clos.

## 2. Ce qui s'est passé

La trace couvre 14 min 27 s, du premier message à 08:24 au dernier à 08:38.
1. 08:24 elle fait 63 lectures, dont `SKILL.md` et ses 3 actions, et 13 fichiers sous `terrain`.
2. 08:28 elle rend un tableau de 11 lignes sur 2 colonnes et pose sa question.
3. 08:28 vous répondez « Yes, that matches. Do not write the backlog memory: this repo track… », et elle écrit 16 fichiers, 36 Ko.
4. 08:31 une commande regarde hors du dossier.
5. 08:38 elle rend son dernier message, qui nomme les 22 chemins écrits, et s'arrête.

## 3. Le skill a-t-il tenu sa promesse ?

| ce que le skill promet | ce qui a été observé | état |
| --- | --- | --- |
| lire la skill et ses références, puis lire le dépôt | « 02-project-memory/SKILL.md » lu du tour 2 | tenu |
| rendre un tableau d'une ligne par capability et par outil, chacune portant une preuve (un chemin ou une dépendance) | tableau rendu ; aucune écriture avant le tableau ; aucun fichier né avant le tableau | tenu |
| attendre la réponse de l'opérateur : aucun fichier du projet n'a changé au moment du tableau | question posée du tour 22 ; mesure absente du run | non jugé |
| après la réponse, écrire sous la copie du terrain les lignes confirmées, moins celle que l'opérateur a écartée | « memory/README.md » produit ; mesure absente du run | non jugé |
| terminer par un court rapport de ce qui a changé | texte du tour 61 : « aidd_docs » | tenu |
| le produit est juste, pas seulement présent | aucune mesure de la justesse | non jugé |

## 4. Pourquoi ce verdict, et à qui la faute

Une lecture est sortie du dossier autorisé (`memory/project-brief.md`). C'est un fait de session : ce que le run mesure ne condamne pas le skill. Une seule sortie interdit le verdict favorable.

## 5. Ce que ça dit du skill, et ce que ça ne dit pas

**Dit :**
- Le skill fait lire avant d'écrire : 63 lectures, la première à 08:24.
- Le produit demandé est là : 22 fichiers, 36 Ko, sous `le dossier du produit`.

**Ne dit pas :**
- Si le produit est juste : aucun juge n'a signé la promesse.
- Ce qu'un autre modèle, un autre dépôt ou un second run donnerait.
- Si un agent ou une personne a conduit ce run : la conduite n'est pas déclarée.

## 6. Trois gestes au plus

- **Skill** : rien à corriger de ce run ; à éprouver, une ligne qui dise de ne pas lire hors du dossier de travail.
- **Cas** : nommer le répertoire de travail dans le texte remis, pour que la session sache où elle travaille.
- **Protocole** : rejouer le même cas sur un second run.

[Annexe technique](RAPPORT.md) — les mesures, les limites et la trace.
