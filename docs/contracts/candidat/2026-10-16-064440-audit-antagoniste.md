---
name: Audit antagoniste — dix-sept objections contre l'audit, les analyses et le delta
description: Attaque une à une chaque affirmation des documents du 2026-10-15 et du 2026-10-16, avec un verdict mesuré : quatre tombent, une est contredite par le contrat, quatre sont affaiblies, deux ne sont pas tranchables, six tiennent
type: audit
status: done
---

# Audit antagoniste

Ce fichier ne fait pas partie du contrat. Il attaque les documents qui l'ont précédé : l'audit du
contrat contre le projet, les analyses de v13 et v14, le delta, la relecture, et le README du
dossier. Il ne confirme rien. Chaque objection porte son verdict et la commande qui le tranche.

---

## 0. La thèse à attaquer, et son sort

Le relecteur a écrit : « donc tes audit et analyses sont fausses ». C'est la thèse de ce document,
et elle doit être mesurée, pas accordée.

**Ce qu'elle a de vrai.** Quatre chiffres ou comptes de mes documents sont faux (§2, `T1`, `T2`,
`T3`, `T4`), une réparation que je propose est contredite par le contrat que je prétends servir
(`T5`), et quatre constats sont affaiblis (`T6` à `T8`, `T14`).

**Ce qu'elle n'établit pas.** Les mesures centrales tiennent : le prix des quatre réparations de v14
(`+5`, `+2`, `+1`, `+1`), le tableau des jetons du delta, l'identité `v14.md` ↔ `AGENTS-source.md`,
le fait d'ADR-012, le doublon, le README « autonome » (`T9`, `T10`, `T11`, `T15`). Aucun d'eux n'est
tombé, et aucun n'a été réfuté par un contrôle.

**Le verdict honnête n'est donc pas « fausses », c'est plus étroit et plus utile.** Ces documents
sont utilisables comme **mesures**, pas comme **vérification** : ils ont produit des chiffres rejoués
et justes, et ils ont laissé passer quatre erreurs que seule une attaque a sorties. Un document qui
se trompe quatre fois sur des comptes ne peut pas se porter lui-même comme preuve de sa justesse.

---

## 1. Méthode de l'attaque

Une objection est retenue seulement si elle a un **falsificateur** : une commande, un fichier lu, ou
une règle du contrat lui-même. Les verdicts sont `TOMBE`, `CONTREDIT`, `AFFAIBLI`, `TIENT`,
`NON_TRANCHABLE`. Aucune objection n'est retenue sur l'impression.

---

## 2. Les objections

### `T1` — le « +3 jetons » de v14-analyse. `TOMBE`

`v14-analyse.md` §4 écrit : « « the required capability » serait plus fidèle, à **+3 jetons** ».
Mesuré sur la phrase réelle :

| variante | jetons |
|---|---:|
| v13/v14 actuelle : `… change material, capability is available, …` | 20 |
| avec `the required ` | 22 (**+2**) |
| la phrase d'origine entière (`Verify material claims whenever the required capability is available …`) | 16 (**−4**) |

Le chiffre faux est **+3** ; le vrai est **+2**. Pire : restaurer la phrase d'origine **économise**
4 jetons, ce qui inverse l'argument du document.

### `T2` — « trois écarts non documentés ». `TOMBE`

Le `README` du dossier décrivait la relecture du 220849 par « aucun devoir perdu, **trois écarts non
documentés** ». Or la relecture titre son §3 « **Les neuf trouvailles** » et écrit : « Les trois
analyses antérieures n'en annonçaient **aucune**. » Les **trois** de mon résumé sont ses **réserves**
(§4 : `F2`, `F1`+`F3`, `F5`). Le résumé a confondu une réserve et une trouvaille, et divisé le
compte par trois. Corrigé dans le README le 2026-10-16.

### `T3` — « aucun foyer du projet n'est nommé ». `TOMBE`

L'audit du 2026-10-16-063502 l'affirme en tête du constat `A1`. C'est faux : le contrat **nomme**
quatre foyers (`grep -o`, occurrences, pas lignes).

| motif | occurrences, noyau | occurrences, skills |
|---|---:|---:|
| `docs/` | **1** | **1** |
| `docs/trace.md` | 0 | **2** |
| `docs/tasks/…` | 0 | **2** |
| `docs/archive` | 0 | **1** |

Ce qui tient est plus étroit, et c'est ce que le corps du constat disait déjà : six foyers réels ne
sont nommés nulle part — `docs/device/`, `docs/contracts/`, `docs/DECISIONS.md`, `docs/VISION.md`,
`docs/PFD.md`, `docs/DASHBOARD.md`. La conclusion ne change pas ; l'en-tête était faux.

### `T4` — « trois documents » sans frontmatter. `TOMBE` comme compte

L'audit `A5` nomme trois documents. Le compte juste, sur les fichiers suivis par git :

```text
docs/*.md et docs/**/*.md suivis : 45, dont sans frontmatter : 21
```

**21 sur 45**, pas trois sur un total non dit. Les trois nommés sont exacts mais ne sont pas le cas
le plus net : le lot comprend les seize pièces de `docs/contracts/archive/`, écrites avant la règle,
et deux documents qui ne sont pas du texte de contrat. Le constat reste ; son compte était faux.

### `T5` — la réparation proposée pour `TERRITORY`. `CONTREDIT`

L'audit §5 propose d'ajouter : *« Write in absolute paths: a relative path resolves against the
client's project root, which is the origin's tree, and has twice put a file of this repo there. »*
Le contrat que cette phrase doit servir porte, dans ses propres `INVARIANTS` :

> Name by intention, not mechanism: name the goal or the responsibility, never the tool or the format.

« Write in absolute paths » est un **mécanisme**. La phrase ajoute en outre un **fait passé** (« has
twice put a file of this repo there ») à un texte de règles, où un fait daté n'a pas de domicile :
`CONSIGN` range les faits dans le journal et les mémoires. La proposition est donc refusée par sa
cible, et la réparation doit être repensée — nommer la responsabilité (« an artifact of this repo
never lands in another tree »), pas la recette.

### `T6` — « 49 jetons de contenu proprement projectif ». `AFFAIBLI`

L'arithmétique tient (`28 + 21 = 49`, mesurés). Le qualificatif est un **jugement**, pas une mesure :
la phrase d'idiome (« Prose under `docs/` is French ») énonce une politique de dépôt, mais elle
gouverne la sortie, qui est universelle. Prendre 49 comme la part projective du noyau est une lecture
défendable, pas un chiffre établi.

### `T7` — « le déclenchement des skills fonctionne ». `NON_TRANCHABLE`

L'audit écrit : « c'est le seul mécanisme de chargement du dépôt, et il fonctionne : cette session les
a lus sur cette phrase. » **Une** session, **un** agent : c'est l'auteur du document qui se cite
lui-même. Le fait que les trois `SKILL.md` n'aient pas été injectés d'eux-mêmes est établi ; que la
phrase du noyau suffise à les faire lire n'est pas mesuré, seulement vécu.

### `T8` — le préambule « jamais à chaque tour ». `AFFAIBLI`, et sans objet depuis v15

L'audit `C4` en fait une propriété que rien ne tient. La seconde moitié de la phrase est pourtant
**vraie des fichiers** : aucun bloc `## 0N-…` n'est dans `AGENTS.md`, le fichier chargé à chaque
tour. Ce qui manque de mécanisme est la première moitié, « chargé à la pertinence ». Depuis v15 le
paragraphe est supprimé : l'objection n'a plus d'objet, et c'est la suppression qui l'a résolue, pas
l'argument.

### `T9` — ADR-012 est contredite. `TIENT`, et durci

La chronologie, établie par git :

| moment | fait |
|---|---|
| 13:11:42, `d02b750` | « Consigner le §7 amendé du v6 et **ramener le contrat à un seul AGENTS.md** » — la décision d'ADR-012 |
| 16:55:40 | `archive/2026-10-15-165540-agents-reference.md`, la référence « avant coupe » : la découpe est de retour sur le disque |
| 17:16:44 | `bilan-des-pertes.md` compte référence / noyau / **skills** |
| 20:54:23, `3b54711` | première fois que `.agents/skills/` entre dans git |

`grep -n skills docs/DECISIONS.md` → les seules occurrences sont l'ADR-012 elle-même et une citation
du framework. Aucune ADR ne remplace l'ADR-012, et sa condition explicite — « une tentative de
re-découpe devra venir avec sa **dérive mesurée** » — n'est remplie par rien : la re-découpe est venue
avec un gain. **Nuance que l'attaque apporte** : le choix du relecteur consigné en `c4800bff` (« v13
seul : pas de report de sections dans un skill ») porte sur le **report de sections**, pas sur
l'architecture ; il ne vaut donc pas acte de re-découpe.

### `T10` — le doublon `v14.md` ↔ `AGENTS-source.md`. `TIENT` sur le fait, `AFFAIBLI` sur le poids

`sha256` identiques, c'est mesuré. Mais `candidat/` est désigné par le README comme une suite
d'**étapes de campagne**, et l'`archive/` porte déjà seize pièces du même genre : la copie y a un
rôle déclaré. Le cas net n'est donc pas « une copie existe », il est qu'**aucune phrase ne dit
laquelle des deux fait foi** quand elles diffèrent. La règle du contrat tranche (« la copie perd »),
le dossier ne le dit pas.

### `T11` — le README « autonome ». `TIENT`, et plus grave que l'audit ne le disait

L'audit `C3` dit la phrase fausse. L'attaque ajoute deux faits : elle est **entrée** en `f90851d`
(2026-10-15T15:32:11), c'est-à-dire **sous l'ADR-012** et pendant la période du contrat unique, où
elle était vraie ; et le `README.md` a été committé de nouveau en `6789bec` (22:30:28), **après** la
découpe, sans que la ligne bouge. La phrase n'est pas une erreur d'origine, c'est une **survivance**.

### `T12` — `docs/archive/` absent. `TIENT` sur le fait, lecture de rechange non tranchée

`test -e docs/archive` → non ; le seul `archive` est `docs/contracts/archive/`. Mais `CONSIGN`
écrit « what is closed in `docs/archive/` » dans une puce qui parle du foyer **de chaque nature** :
la lecture « l'`archive/` de ce dossier » est possible, et alors la phrase n'est pas fausse mais
**ambiguë** — ce qu'ADR-010 efface, jamais n'interprète.

### `T13` — la faille de `BOUNDARY` §8 n'est couverte par aucun skill. `TIENT` comme fait

`TERRITORY` interdit d'écrire chez l'origine et ne nomme ni le mécanisme (un chemin relatif se résout
contre la racine du projet du client, qui est le framework) ni la parade tenue. `BOUNDARY` §8 le
mesure, date deux incidents (13:0x, 13:34) et conclut « rien dans le dépôt ne la contrôle ». Le
**fait** tient ; la réparation proposée, elle, tombe (`T5`).

### `T14` — le registre des décisions n'a pas de règle. `TIENT` comme fait, `AFFAIBLI` comme défaut

0 occurrence de `ADR` dans les cinq fichiers : mesuré. Mais l'attaque demande où est le **coût** : le
registre porte ses propres règles en tête (« Une décision non consignée n'existe pas », numérotation,
format léger) et **aucun incident n'est cité** où l'absence de règle dans le contrat aurait coûté un
ADR manqué, mal numéroté ou mal placé. Un manque sans incident est une observation, pas un défaut.

### `T15` — le tableau des jetons du delta. `TIENT`

Revérifié ligne à ligne : source 3 302 → 3 197, noyau **1 835 → 1 768**, `01-consign` 832 → 802,
`02-memory` 300 → 294, `03-boundaries` 295 → 293, total 6 564 → 6 354. Toutes égales, en `o200k`,
par rejeu complet sur `git show 3b54711:<chemin>`.

### `T16` — les 229 contre 211 lignes. `NON_TRANCHABLE`

Le delta les déclare `OPEN` et l'attaque ne les tranche pas : la reconstruction d'alors n'existe plus
et le `diff` sur la base durable fait 211. `OPEN` reste `OPEN`.

### `T17` — l'objection structurelle, la plus forte. `TIENT`

Aucun de ces documents n'a de second relecteur : même agent, même soir, même arbre. Le contrat
s'applique à eux et le dit : `SELF-ASSERTED COMPLIANCE != VERIFIED COMPLIANCE`. Et ils auditent tous
la **correspondance** — le texte contre un autre texte, ou le texte contre l'arbre —, jamais
l'**effet** : aucun ne dit qu'une règle est mieux suivie après qu'avant. Conséquence directe pour la
question posée : **« le contrat sert-il ce projet ? » n'est pas décidable par ces documents.** Il
faudrait un run où une règle manque et où le manque se paie.

---

## 3. Ce qui tombe, et ce qu'il en reste

| # | tombe | reste |
|---|---|---|
| `T1` | le « +3 jetons » de v14-analyse | que `the required` coûte +2, et que la phrase d'origine coûte moins |
| `T2` | « trois écarts » du README | neuf trouvailles, trois réserves |
| `T3` | « aucun foyer nommé » | six foyers réels non nommés |
| `T4` | « trois documents » sans frontmatter | 21 sur 45 |
| `T5` | ma réparation pour `TERRITORY` | que le fait de la faille tient (`T13`) |

Les deux premières sont corrigées dans le `README` du dossier le 2026-10-16 ; les trois autres vivent
dans des relevés datés, qui ne se réécrivent pas — ce fichier est leur correctif, et il les cite.

## 4. Le partage des dix-sept

| verdict | objections | total |
|---|---|---:|
| `TOMBE` | `T1`, `T2`, `T3`, `T4` | **4** |
| `CONTREDIT` | `T5` | **1** |
| `AFFAIBLI` | `T6`, `T8`, `T10`, `T14` | **4** |
| `NON_TRANCHABLE` | `T7`, `T16` | **2** |
| `TIENT` | `T9`, `T11`, `T12`, `T13`, `T15`, `T17` | **6** |
| | | **17** |

`T10` et `T14` tiennent sur le fait et sont affaiblis sur le poids ou le défaut : ils sont comptés
**une fois**, dans `AFFAIBLI`. Et les mesures de v14/v15 qui n'ont pas tombé : `+5`, `+2`, `+1`, `+1`,
`+9`, source 3 206 puis 3 170, noyau 1 777, artefacts identiques après retrait du paragraphe.

## 4bis. Rectification de ce fichier

Le tableau de `T3` a d'abord été écrit en **lignes** (`grep -c`), ce qui donnait `docs/` à 4 en
skills et laissait croire à trois foyers. Il est réécrit en **occurrences** (`grep -o`) et complète
la liste : `docs/tasks/…` était nommé deux fois. Un correctif qui se trompe du même compte que ceux
qu'il dénonce ne vaut rien.

**Deuxième rectification du même fichier.** Son frontmatter, le README du dossier et la séance
annonçaient « quatre tombent, une est contredite, quatre sont affaiblies, **sept** tiennent » : 16
objections sur 17. Les deux `NON_TRANCHABLE` (`T7`, `T16`) étaient omis du partage. Le compte juste
est **4 / 1 / 4 / 2 / 6**, et il est écrit au §4 sous forme de table. Deux erreurs de compte en un
document qui en dénonce quatre : c'est la démonstration de `T17`, pas une excuse.

## 5. Ce que cet audit ne peut pas établir

- **Il est interne lui aussi** : même auteur, même jour. Il ne remplace pas un second relecteur ; il
  augmente le nombre d'objections, pas l'indépendance.
- **Rien de comportemental** : aucune objection ne porte sur l'effet d'une règle, faute de run
  instrumenté.
- **Les comptes sont datés** : 45 documents et 20 ADR au 2026-10-16 ; un ajout les invalide.
- **Il ne prouve pas non plus la thèse inverse** : que les documents sont justes. Il montre ce qui a
  résisté, pas ce qui a été vérifié par un tiers.
