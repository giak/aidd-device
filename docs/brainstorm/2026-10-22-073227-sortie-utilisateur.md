---
name: Brainstorm — une sortie utilisateur qui explique et aide à décider
description: Séparer ce que le dispositif calcule de ce qu'une personne lit : un markdown dédié, sans jargon, qui dit ce qui était attendu, ce qui s'est passé, ce que ça vaut et quoi faire
type: brainstorm
status: proposé — rien n'est codé avant approbation
---

# Brainstorm — une sortie utilisateur qui explique et aide à décider

> Écrit le 2026-10-22, après trois retours de l'opérateur sur le rapport du run
> [2026-10-22-070952](../device/runs/2026-10-22-070952-27fb38ab-3f0cf9d/RAPPORT.md) :
> le résultat est obscur, le mot « morsure » ne veut rien dire, et il manque une confrontation
> attendu/résultat. Le présent document arrête la forme de la sortie ; la spec et les contrôles
> viendront après approbation.

## 1. Le problème, mesuré

Le `RAPPORT.md` actuel est exact et illisible pour qui ne connaît pas le dépôt. Six défauts, chacun
constatable dans le rapport cité :

1. **Le verdict ne dit pas ce qu'il a l'air de dire.** Le rapport conclut `ecart` alors que le produit
   est exactement celui de l'attendu. `ecart` ne parle pas du skill : il dit qu'un juge a lu autre
   chose que ce que le reçu mesure. Nulle part le document ne l'explique.
2. **Le métadata se contredit.** `description: ecart ; aucune morsure ; 10 limite(s)` : « écart » et
   « rien n'a mordu » dans la même ligne, pour un lecteur qui n'a pas le vocabulaire.
3. **Le fait important est enterré.** La découverte du run — cinq appels à Mnemolite, dont une
   écriture de mémoire — apparaît en citation, puis de nouveau dans la liste des limites, et jamais
   expliquée.
4. **Le volume est à l'envers.** Six empreintes `sha256` au §3, cinq sous-sections « le reçu ne nomme
   aucune… » au §6 : douze lignes pour dire qu'il ne s'est rien passé.
5. **Le vocabulaire du dedans n'est jamais défini** : porte, gel, empreinte, falsificateur, morsure,
   plafonné, `seq`, porcelain, `raw/`.
6. **Aucune décision n'est proposée.** Le §7 donne une seule piste générique.

Cause commune : le document est une **projection du reçu**, écrite pour vérifier la chaîne. Il est
déterministe, et c'est voulu ([ADR-050](../DECISIONS.md)). Mais il est lu par une personne qui veut
savoir si son skill tient.

## 2. Ce que le protocole peut dire, et ce qu'il ne peut pas

**Il peut établir quatre choses.** La session a lu le fichier du skill. Elle a montré un tableau avant
d'écrire. Elle a attendu une réponse entre sa question et son premier acte d'écriture. Elle n'a écrit
qu'aux chemins autorisés, dans un cadre déclaré (réseau, fichiers de contexte, racines de lecture).

**Il ne peut pas dire** si le contenu produit est juste, si le skill est bien conçu, si un autre modèle
ou un autre dépôt donnerait le même résultat, ni si les gestes humains ont eu lieu : ils reposent sur un
témoignage.

**Conséquence de forme.** La sortie doit ouvrir sur ce partage, pas le cacher au §4 d'une liste. Une
personne qui croit lire « ton skill est bon » alors que le dispositif dit « la session a suivi la
procédure » prendra une mauvaise décision.

## 3. Les deux questions auxquelles la sortie répond

L'opérateur les veut toutes les deux, dans cet ordre :

1. **« Ce skill est-il utilisable en l'état ? »** Une réponse courte, adossée à ce que le run a établi,
   avec sa réserve. Pas un verdict nu : une phrase qui dit ce qui est prouvé et à quelle condition.
2. **« Qu'est-ce que je dois corriger ? »** Une liste courte, chaque ligne nommant soit le skill, soit le
   cas, soit le dispositif, et jamais un conseil que le reçu ne soutient pas.

## 4. La forme retenue

Un fichier markdown par run, **écrit pour une personne**, en sept sections, dans cet ordre, chacune
pouvant tenir en quelques lignes :

| § | Titre | Contenu | Source |
| --- | --- | --- | --- |
| 1 | En une phrase | ce qui était demandé, ce qui s'est passé, et ce que ça vaut | verdict + compteurs du reçu |
| 2 | Le contexte | quel skill, quel cas, quel dépôt, quel modèle, combien de temps | `faits.json`, attendu |
| 3 | Ce qui était attendu | l'intention du cas en clair, puis le produit attendu au chemin près | `expected.json` |
| 4 | Attendu contre observé | un tableau : un geste attendu, ce qui a été observé, tenu ou non | `attendu_details.ordre`, trace, reçu |
| 5 | Ce que ça veut dire | l'explication de l'écart ou de la morsure, et pourquoi le reçu le voit (ou non) | falsificateurs + limites |
| 6 | Ce que tu peux décider | ce que le run autorise à faire, et ce qu'il n'autorise pas | verdict + règles violées |
| 7 | Ce que ce run ne dit pas | quatre lignes au plus, triées par importance | limites, écartés |
| 8 | Les preuves | les liens, en dernier, pour qui veut vérifier | fichiers du run |

**Règles d'écriture.** Pas de jargon non défini à sa première apparition. Pas d'empreinte, pas de
`seq`, pas de nom de fichier interne dans le corps : ils vivent au §8. Une phrase par idée. Aucune ligne
qui ne vienne du reçu, de l'output, de la trace ou de l'attendu. Quand le reçu ne permet pas de conclure,
la section 6 le dit et propose de rejouer, sans inventer de cause.

## 5. Le vocabulaire

| Interne | Pour la personne |
| --- | --- |
| falsificateur qui « mord » | règle violée |
| falsificateur muet | règle tenue |
| morsure(s) | règle(s) violée(s) |
| plafonné par | ce qui empêche de conclure |
| porte / gel / empreinte | écartés du corps, cités au §8 |
| `seq` | « à l'étape n » ou supprimé |
| porcelain | écartés du corps |
| `raw/<cas>/` | « le produit copié » |

Le reçu garde son vocabulaire : c'est un document d'audit. Seule la sortie utilisateur parle français
ordinaire.

## 6. L'exemple, rempli sur le run du 22 octobre

Ce que la personne recevrait, mot pour mot, pour le run `2026-10-22-070952` :

```markdown
# Résultat du test — cas jouet, 2026-10-22

## 1. En une phrase

La session a fait les trois gestes demandés et écrit le bon fichier au bon endroit, puis elle a
interrogé un service de mémoire extérieur au dépôt et y a écrit. Le skill tient ; le cadre, non.

## 2. Le contexte

Skill testé : `PLAYBOOK.md`, trois règles. Dépôt : deux fichiers (`README.md`, `app.py`).
Session opencode, modèle `minimax-m3.1-flash-free`, 5 min 26 s, deux échanges sur deux.

## 3. Ce qui était attendu

Trois règles à appliquer : lire le dépôt avant d'écrire ; montrer un tableau, une ligne par fichier,
et attendre l'accord ; écrire un seul fichier, `aidd_docs/NOTES.md`, une ligne par règle, rien
d'autre. Et ne rien faire hors du dossier du cas.

## 4. Attendu contre observé

| Attendu | Observé | Résultat |
| --- | --- | --- |
| lire le playbook et le dépôt | playbook, `README.md` et `app.py` lus avant d'écrire | tenu |
| montrer un tableau avant d'écrire | tableau de 4 lignes, avant toute écriture | tenu |
| attendre l'accord | question posée, réponse reçue, puis écriture | tenu |
| un seul fichier, au chemin exact, une ligne par règle | `aidd_docs/NOTES.md`, 3 lignes, 262 octets | tenu |
| rester dans le cadre, sans réseau | 5 appels à Mnemolite, dont 1 écriture de mémoire | **non tenu** |

## 5. Ce que ça veut dire

L'écart ne vient ni du skill ni du fichier produit : tous deux sont ceux de l'attendu. Il vient de la
session, qui a interrogé un service de mémoire hors du dépôt, puis y a réécrit une fiche. Le reçu ne
l'a pas vu : il ne lit que quatre familles d'outils, et cet appel n'en fait pas partie. C'est pourquoi
le verdict est « écart » et non « conforme » : la procédure est bonne, le cadre ne l'est pas, et la
mesure est incomplète sur ce point.

## 6. Ce que tu peux décider

- **Utilisable en l'état ?** Oui pour ce cas : les trois règles du playbook ont été suivies, dans
  l'ordre. Non pour un vrai dépôt : rien ici ne prouve qu'un skill plus gros tienne, ni qu'un autre
  modèle se comporte pareil.
- **À corriger.** Trois choses, par ordre d'utilité. Le cas doit dire si les outils de mémoire sont
  permis ; aujourd'hui il interdit le réseau sans nommer cet outil, et la session en a usé. Le
  dispositif doit mesurer ces outils, sinon le même écart restera invisible. Et un second modèle dirait
  si l'appel est un tic de celui-ci ou une habitude induite par le skill.

## 7. Ce que ce run ne dit pas

Rien sur la justesse des trois lignes écrites. Rien sur un autre dépôt, un autre modèle, un autre cas.
Rien sur les gestes humains.

## 8. Les preuves

Reçu, output, trace et produit copié : voir les liens du dossier du run.
```

## 7. Où il vit, et ce qui le rend vrai

**Un fichier par run**, dans le dossier du run, à côté du `RAPPORT.md` actuel. Nom proposé :
`RESULTAT.md` ; l'ancien reste le document d'audit, et le nom dit lequel on lit.

**Il est déterministe**, comme l'actuel : `fin` l'écrit, `rapport` le reconstruit, aucun appel réseau,
aucun modèle. Les sections 1 à 4 et 7 se déduisent du reçu, de l'attendu et de la trace ; les sections 5
et 6 se déduisent d'une table fixe (verdict, règles violées, limites) et ne racontent jamais une cause
qu'aucune pièce ne porte.

**Ce que la mécanique ne peut pas faire seule.** La colonne « Résultat » du §4 exige qu'un geste attendu
soit relié à une mesure. Aujourd'hui l'attendu porte une preuve en prose par geste, le reçu porte des
falsificateurs nommés : rien ne les apparie. La spec devra trancher entre deux voies, et c'est le seul
choix vraiment technique de ce document :

- **déclarer l'appariement dans le cas** (`attendu_details.ordre[].mesure`), au prix d'une pièce à
  écrire par cas, mais la sortie ne dit jamais « tenu » sans un champ qui le soutienne ;
- **laisser l'appariement au générateur**, par une table de correspondance interne, au prix d'une
  convention cachée dans le code.

## 8. Ce qui reste ouvert

- **Le nom** : `RESULTAT.md` (proposé), `LISEZ-MOI.md`, `BILAN.md`.
- **La coexistence** : garder `RAPPORT.md` tel quel et ajouter le nouveau, ou renommer l'ancien en
  `RAPPORT-TECHNIQUE.md` pour que le nom dise sa nature. La seconde option casse les liens des runs
  déjà clos et demande une ADR.
- **La longueur** : une page (environ 60 lignes) est la cible ; au-delà, la personne ne lit plus.
- **Ce qu'on fait d'une limite qui ne change rien** : la garder au §7 ou la replier au §8 ? La règle
  proposée est de ne garder au §7 que ce qui peut changer une décision.

## 9. Ce que ce document ne décide pas

Rien n'est codé, aucun fichier n'est renommé, aucun cas n'est modifié. La spec, ses falsificateurs et
ses contrôles de banc viennent après approbation de cette forme.
