---
name: Audit du contrat contre le projet : ce qu'il prend en compte, et ce qu'il ignore
description: Le contrat corrigé (v14) mesuré contre l'arbre du projet et son registre de décisions : foyers non nommés, faille non couverte, contradictions avec ADR-012, coût du partage noyau + skills, et les six réparations proposées non appliquées
type: audit
status: done
---

# Le contrat sert-il ce projet ?

Ce fichier ne fait pas partie du contrat et ne le modifie pas : il mesure l'écart entre ce que le
contrat dit et ce que l'arbre est. Les réparations sont chiffrées au §5, aucune n'est appliquée.

---

## 0. Ce que cet audit est, et n'est pas

**Pas indépendant** : l'agent qui écrit ces lignes a appliqué v13 puis v14. Aucun second relecteur
n'existe ici. Ce qui le rend utile, c'est qu'il cherche à falsifier la conclusion « le contrat prend
le projet en compte et le sert au mieux ».

**La question.** Les cinq fichiers du contrat nomment-ils ce que ce dépôt est, et le laissent-ils
servi au meilleur coût ?

**Ce qui le ferait mentir** : un foyer du projet non nommé, une règle du contrat que l'arbre
contredit, une faille déjà mesurée que le contrat ne couvre pas.

**Périmètre.** `AGENTS.md` (le noyau, chargé à chaque tour) et les trois `SKILL.md`, contre l'arbre
du projet (66 fichiers suivis) et son registre de décisions (20 ADR au 2026-10-16).

---

## 1. Ce que le contrat prend déjà en compte, mesuré

- **Les quatre arbres** (`TERRITORY`) : `framework-origin`, la révision sous test, le terrain, ce
  dépôt, chacun nommé avec son chemin. Les deux chemins absolus existent sur cette machine.
- **Mnemolite** (`MEMORY`) : les quatre outils nommés et l'ordre « natif avant curl » sont réels.
- **Le corpus du dispositif** : `TERRITORY` nomme « this-repo — the device and its documents ».
- **Le déclenchement des skills** : le noyau porte la phrase qui les nomme et dit quand les lire.
  C'est le seul mécanisme de chargement du dépôt, et il fonctionne : cette session les a lus sur
  cette phrase.
- **Le prix de la prise en compte, mesuré** : noyau **1 777** jetons, dont **49** de contenu
  proprement projectif — 28 pour la phrase de renvoi aux skills, 21 pour « Prose under `docs/` is
  French… ». Le reste du noyau est universel.

---

## 2. Ce que le contrat ne prend pas en compte

**A1 — aucun foyer du projet n'est nommé.** `docs/device/`, `docs/DECISIONS.md`, `docs/VISION.md`,
`docs/PFD.md`, `docs/DASHBOARD.md`, `docs/contracts/` : **0 occurrence** dans les cinq fichiers.
`CONSIGN` énumère trois foyers (`docs/trace.md`, un dossier de tâche, `docs/archive/`) quand
`docs/` en porte **dix** : `brainstorm`, `contracts`, `DASHBOARD.md`, `DECISIONS.md`, `device`,
`EXPLICATION.md`, `PFD.md`, `tasks`, `trace.md`, `VISION.md`.

**A2 — un foyer nommé n'existe pas.** `CONSIGN` : « what is closed in `docs/archive/` ».
`docs/archive` est **absent** de l'arbre (`test -e` → non) ; le seul `archive` est
`docs/contracts/archive`.

**A3 — la faille mesurée du projet n'est couverte par aucun skill.** `docs/device/BOUNDARY.md` §8
consigne **deux incidents datés** du 2026-10-15 (13:0x et 13:34) où un artefact du dispositif a
atterri dans l'arbre de l'origine, et donne la cause : « les outils de fichiers du client résolvent
un **chemin relatif** contre la racine du projet du client, qui est le framework », puis la parade
tenue : « écrire en chemin absolu ». Il conclut : « **rien dans le dépôt ne la contrôle** ».
`TERRITORY` interdit d'écrire chez l'origine mais ne dit ni le mécanisme ni la parade : un agent qui
l'a lu peut déclencher l'incident sans savoir qu'il le peut.

**A4 — le registre des décisions n'a pas de règle.** `DECISIONS.md` ouvre 20 ADR et pose « Une
décision non consignée n'existe pas ». **0 occurrence** de `ADR` dans les cinq fichiers du contrat.
Les ADR-014 à 017 ont pourtant été écrits par des agents en séance (journal, tours `2dc0e6a0`,
`191f5687`, `8fac6e0b`) : la production existe, la règle qui la gouverne est hors du contrat.

**A5 — trois documents de la campagne violent la règle de frontmatter.** `CONSIGN` : « A consigned
document carries `name`;`description`;`type`;`status`. » Mesuré : la première ligne de
`v11-analyse.md`, `v12-analyse.md` et `v13-analyse.md` n'est pas `---`. Non corrigés ici : ce sont
des relevés datés, et la règle veut qu'un relevé clos ne se réécrive pas.

---

## 3. Contradictions

**C1 — ADR-012 est en vigueur et le contrat le contredit.** `grep` du registre : « skills »
n'apparaît que dans l'ADR-012 et une citation du framework ; aucune ADR postérieure ne traite
l'architecture du contrat. ADR-012 a décidé « un seul contrat : `AGENTS.md`, **sans skills, sans
copie**, sans contrôle mécanique », et a fixé la condition d'un revirement : « Une tentative de
re-découpe devra venir avec sa **dérive mesurée**, pas avec un contrôle promis. » Or l'arbre porte
trois skills et une copie. La re-découpe est venue avec un **gain** (105 jetons) et une mesure de
coût, jamais avec une dérive. **C'est une contradiction de gouvernance, pas de texte : elle ne se
répare pas dans le contrat.**

**C2 — le contrat viole sa propre règle du doublon.** `CONSIGN` : « A document restating another is
a duplicate; the copy loses. » `sha256` : `candidat/v14.md` et `AGENTS-source.md` rendent tous deux
`04a2dc7ad69e…` — **octet pour octet identiques**. Le noyau se lit en outre dans `AGENTS.md` et
dans `candidat/v13.md`. ADR-012 avait supprimé la copie de référence pour ce motif exact.

**C3 — le README du dépôt décrit un contrat qui n'existe plus.** `README.md` (racine) :
« `AGENTS.md` — le contrat de travail, **autonome** : il vaut pour tout ce qui s'écrit ici. » Or
`AGENTS.md` dit lui-même que `CONSIGN`, `NAMING`, `MEMORY` et `TERRITORY` vivent dans ses trois
skills, et la checklist le confirme : ces règles n'y sont pas.

**C4 — le chargement « à la pertinence » n'a pas de mécanisme.** Le préambule `# SKILLS` :
« Chargé à la pertinence, **jamais à chaque tour**. » ADR-012 consigne que ce dépôt n'a pas de
chargeur on-demand, et cette session le confirme : les trois skills n'ont pas été injectés d'eux
mêmes. Le déclenchement repose sur une phrase du noyau, donc sur l'obéissance de l'agent — conforme
à ADR-004 (aucun contrôle mécanique), mais le mot « jamais » décrit une propriété que rien ne tient.

---

## 4. Coût et optimalité

| charge | jetons `o200k` | quand |
|---|---:|---|
| noyau `AGENTS.md` | 1 777 | chaque tour |
| `01-consign` | 802 | à la lecture |
| `02-memory` | 294 | à la lecture |
| `03-boundaries` | 293 | à la lecture |

Le noyau est **0,169 %** d'une fenêtre client de 1 048 576 : le contrat n'est pas ce qui remplit le
contexte, la conversation et les sorties d'outils le font. Le partage « noyau universel + skills de
projet » est le bon sens de lecture, à une réserve mesurée : **1 389 jetons de règles de projet ne
sont payés par aucun tour où l'agent ne les lit pas**, et 49 jetons de contenu projectif sont payés
par tous les tours. La phrase de renvoi du noyau est le point le plus chargé du contrat, et le seul
qui rende les skills visibles.

**Ce que cet audit ne peut pas dire** : si un autre partage servirait mieux. Le mesurer demanderait
des tours où les skills ne sont pas lus, et une mesure de ce qui a manqué.

---

## 5. Ce que cet audit laisse à décider

Chiffré au jeton, mesuré sur le fichier entier, **non appliqué** :

1. **`A3` — TERRITORY.** Nommer le mécanisme et la parade de BOUNDARY §8 : *« Write in absolute
   paths: a relative path resolves against the client's project root, which is the origin's tree,
   and has twice put a file of this repo there. »* → **+34 jetons**.
2. **`A1`+`A2` — CONSIGN.** Nommer les foyers réels et réparer `docs/archive/` : *« the journal at
   `docs/trace.md`, a task in its folder, a decision in `docs/DECISIONS.md`, the device's pages in
   `docs/device/`, this contract in `docs/contracts/`, what is closed in that folder's own
   `archive/` »* → **+32 jetons**.
3. **`C1` — ADR-012.** Soit un ADR daté qui la remplace, avec la dérive mesurée qu'elle exige, soit
   le retour au contrat unique. Acte de gouvernance, hors du texte.
4. **`C2` — le doublon.** Décider lequel des deux fichiers identiques est le document, et déclasser
   l'autre : la copie perd.
5. **`C3` — le README racine.** Retirer « autonome », ou rendre le contrat autonome.
6. **`A5` — le frontmatter.** Quatre lignes sur les trois analyses, ou l'acte qui les exempte.
7. **`A4` — le registre.** Une règle, ou la décision de laisser les ADR hors du contrat.

Les deux premières seulement touchent le texte, pour **+66 jetons** sur 1 777 (**3,7 %** du noyau,
0,006 % d'une fenêtre).

---

## 6. Limites

- **Revue interne**, dite telle : un seul auditeur, celui qui a appliqué le texte.
- Audit de **correspondance**, jamais de comportement : rien ici ne dit que le contrat est *suivi*.
- Les incidents de BOUNDARY §8 sont **lus dans le dépôt**, datés, non rejoués sur cette machine
  pendant cet audit.
- L'inventaire des foyers et des ADR vaut au **2026-10-16** : un ADR ajouté invaliderait `C1`.
- Le coût mesuré est en `o200k_base`, pas dans le tokenizer du modèle servi.
