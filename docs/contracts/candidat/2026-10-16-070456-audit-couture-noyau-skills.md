---
name: Audit de la couture — noyau `AGENTS.md` contre `.agents/skills`
description: Les sept effets de bord, dépendances et manques que produit la découpe du contrat en un fichier d'entrée et trois skills, chacun mesuré, plus une suspicion de régression tuée par la mesure
type: audit
status: in-progress
---

# Audit de la couture

> 2026-10-16. Demande : comparer `AGENTS.md` et `.agents/skills/` pour trouver les **régressions, effets de
> bord, manques**, pas pour compter des mots. Revue **interne** : même agent, même jour, aucun second
> relecteur. Chaque affirmation porte la commande qui l'établit.

## 1. Résultat

**La découpe ne perd aucune règle : les treize sections du contrat sont là, et le texte appliqué est
identique à sa source. Elle perd des garanties.** 43 % du contrat (1 389 jetons sur 3 166) vit
désormais derrière un pointeur en prose, dans un dépôt sans chargeur : sept constats en découlent —
trois manques (`F1`, `F5`, `F7`), une dépendance (`F2`), trois effets de bord (`F3`, `F4`, `F6`) — plus
une tension préexistante (`F8`). La phrase du préambule qui les explique — « Rules unique to this
repository live in its skills » — est fausse pour l'une des trois lois déplacées.

## 2. La couture, mesurée

| pièce | jetons | lignes | sections |
|---|---:|---:|---|
| `AGENTS.md` (fichier d'entrée) | 1 777 | 91 | 9 |
| `.agents/skills/01-consign` | 802 | 23 | `CONSIGN`;`NAMING` |
| `.agents/skills/02-memory` | 294 | 14 | `MEMORY` |
| `.agents/skills/03-boundaries` | 293 | 18 | `TERRITORY` |
| **les trois skills** | **1 389** | **55** | **4** |
| contrat entier | 3 166 | 146 | 13 |

Aucune section manquante : 9 + 4 = 13, le compte du contrat d'avant la découpe.
**Aucune régression de règle mesurée entre `v15` et l'état appliqué** : `AGENTS.md` est le noyau de
`docs/contracts/AGENTS-source.md` (`diff` → 1 ligne, une ligne vide finale), et le corps des trois
skills y est reproduit tel quel, le seul écart étant le niveau de titre (`###` dans la copie, `##` dans
le fichier).

## 3. Les sept trouvailles

### F1 · `MANQUE` — la condition de clôture de la séance n'est plus dans le fichier d'entrée
`grep -c` sur `AGENTS.md` : `séance` → 0, `docs/trace.md` → 0, `archive` → 0, `trace` → 1 (la glose du
préambule), `Mnemolite` → 1 (la même glose). La règle « A change is not finished until the document
explaining it exists » vit seule dans `01-consign` l.7, comme « A séance without its section does not
exist » l.8, et « Only committed documents outlive memory » l.15.
Conséquence : un agent qui ne reçoit que `AGENTS.md` peut terminer une tâche sans rien consigner, et
**rien dans le noyau ne le lui reproche**.

### F2 · `DEPENDANCE` — le noyau emploie un label que seul un skill définit
`AGENTS.md` l.85 (niveau `N3`) dit « a dated file **in its home** ». Le mot `home` n'apparaît qu'à cette
ligne dans le noyau ; sa définition est dans `01-consign` l.10 (« One home per nature, under `docs/` »).
Même dépendance pour `CHANGE` l.63 (« a written spec »), dont le foyer et le nom (`...-spec.md`) sont
définis dans `NAMING`. Or `OUTPUT` R5 impose « no internal code or label without its one-sentence
definition at first use » (l.81). Le noyau se contredit, et c'est la découpe qui a créé ce cas.

### F3 · `EFFET DE BORD` — le préambule nomme par mécanisme, ce que le contrat interdit
`INVARIANTS` l.23 : « Name by intention, not mechanism: name the goal or the responsibility, never the
tool or the format. » Le préambule l.8-10 dit « Rules unique to this repository live in its skills, one
per nature: `01-consign` …, `02-memory` …, `03-boundaries` … ». Ces trois identifiants sont des
**dossiers**. Le pointeur ne fonctionne qu'en nommant l'outil, et la règle interdit de le nommer.
Avant la découpe, il n'y avait rien à nommer : la tension est née de la découpe.

### F4 · `EFFET DE BORD` — aucun chargeur dans le dépôt ; le client, lui, n'est pas mesuré
Racine du dépôt : `ls -a1` → `.agents AGENTS.md docs .freebuff .git .gitignore README.md` ;
`find . -maxdepth 2 -name '*.mjs' -o -name '*.sh' -o -name 'package.json'` → **rien**. Aucun mécanisme
du dépôt ne lit `.agents/`. L'ADR-012 avait nommé cette perte (« faute de chargeur on-demand dans ce
dépôt ») ; la découpe suivante a rétabli les `description:` sans rétablir le chargeur.
Observation de session (un seul harnais, Freebuff Desktop) : `AGENTS.md` et `~/.AGENTS.md` sont injectés
comme fichiers d'instructions, les trois skills du dépôt **non** — ils n'ont été lus que parce que le
pointeur les nomme. Les `description:` ne sont donc pas mortes, mais leur lecteur réel n'est pas un
routeur : c'est un agent qui a déjà décidé de lire le fichier.

**Le README du dossier affirme ce chargeur.** L.23 : « chaque `SKILL.md` reprend un bloc et le rend
lisible **par le chargeur**, donc avec un frontmatter `name` et `description` ». Or ADR-012 l.294 dit
l'inverse pour ce dépôt — « faute de chargeur on-demand dans ce dépôt » — et l'arbre n'en porte aucun.
Le README ne se trompe donc pas sur une nuance : il décrit un mécanisme que l'ADR avait nommé absent,
et que la mesure ne trouve pas.

**Rétrécissement du 2026-10-16, après relecture du dossier.** Ma première version écrivait « aucun
chargeur » sans borne, et c'est plus fort que ce qui est établi. Ce qui est mesuré : aucun mécanisme
**du dépôt** ne lit `.agents/` (`ls -a1`, `find`, `grep`). Ce qui ne l'est pas : le client. Le dossier
portait déjà la borne, deux fois — la veille du 2026-10-15 §7 (« Le déclenchement d'un skill dans ce
client n'est pas mesuré […] c'est une observation de ce tour, pas une mesure du chargeur ») et la
mémoire `ec04b064` (`<projet>/.agents/skills/` lu par opencode V2 **et** Freebuff, `~/.agents/skills/`
lu seulement si opt-in), celle-ci reposant sur le binaire **0.0.173** alors que la machine tournait
**0.0.186**, treize révisions plus loin. `state.json` du client ne nomme aucun skill, les trois skills
du dépôt n'y sont pas, ceux du compte y sont trois fois. Donc : **`OPEN`**, et la seule voie de
découverte observée ici reste la phrase du préambule.

### F5 · `MANQUE` — la loi MEMORY a une maison globale, et celle d'ici la répète
`ls ~/.agents/skills` → `chatgpt-bridge`, `mnemolite-mem-first`, `visual-explainer`. `~/.AGENTS.md`
l.3-9 impose la même loi à **tous** les projets, nomme son skill global, prévient que l'auto-découverte
n'est pas fiable, et fixe la règle de partage : « le projet précise son périmètre, **ne répète pas la
procédure** ». Or `02-memory` répète la procédure (memory first, write-back, read-back). Trois maisons
pour une loi : `~/.AGENTS.md`, `~/.agents/skills/mnemolite-mem-first/`, `.agents/skills/02-memory/`.
Conséquence directe : le préambule qui déclare ces règles « unique to this repository » dit **faux**
pour `02-memory` seule des trois.

### F6 · `EFFET DE BORD` — les mêmes chemins absolus dans une règle vivante et un relevé gelé
`.agents/skills/03-boundaries` l.9 et l.13 portent `/home/giak/projects/framework` et
`/home/giak/projects/audio-sync-tool` ; `docs/device/BOUNDARY.md` l.19 et l.21 portent les mêmes, plus
treize lignes de commandes. Le skill est une règle, donc mutable ; l'artefact est un relevé daté, donc
gelé par `01-consign` (« a closed section or document is a dated record, never edited again »). Un
déménagement oblige donc à bouger l'un et interdit de bouger l'autre : la règle et sa mesure
divergent au premier déménagement, et rien ne dit laquelle fait foi.

### F7 · `MANQUE` — le même artefact déclare son déclencheur deux fois, différemment
- Noyau l.8-10 : lire les skills « before writing here, consigning or touching a repository ».
- `01-consign` : « when something must outlive the session, or a file is created, renamed or moved ».
- `02-memory` : « when stating a fact this session has not established, or recording one ».
- `03-boundaries` : « when writing into any repository, creating a worktree, or **running anything that
  executes** ».

Le noyau couvre « toucher un dépôt », pas **exécuter** : l'exécution tourne justement dans un répertoire
jetable, hors des arbres. Un agent qui suit le noyau à la lettre ne lit pas `03-boundaries` avant de
lancer une commande, et ne lit pas `02-memory` avant d'énoncer un fait non établi. Deux listes, deux
auteurs, deux portées : là où un chargeur rattraperait l'écart, le dépôt n'a qu'une phrase.

### F8 · tension préexistante, pas un effet de la découpe
`AGENTS.md` l.64 « Never commit or push unless the user asks » contre `01-consign` l.15 « Only committed
documents outlive memory: … a document left uncommitted, leaves nothing read ». Les deux règles
coexistaient avant la découpe : je les nomme parce que leur effet est visible maintenant — 4 fichiers
modifiés et 6 non suivis dans ce dépôt, donc, par la seconde règle, rien qui « survive ». Aucune règle
ne dit qui ferme cette boucle.

## 4. Une suspicion que la mesure a tuée

J'ai d'abord cru à une régression de règle : le corps de `01-consign` **n'est pas** identique entre
`AGENTS-source.md` et le fichier appliqué (`sha256` des deux corps : `1880d4aa…` contre `b99cf70c…`).
`diff` dit pourquoi : `### CONSIGN` / `### NAMING` dans la copie inlinée, `## CONSIGN` / `## NAMING`
dans le fichier. **Niveau de titre, zéro différence de règle.** La suspicion tombe — et elle tombe pour
une raison déjà écrite : le contrôle n° 2 du README du dossier normalise ce niveau
(`sed 's/^### /## /'`) avant de comparer, donc l'écart est connu, documenté et neutralisé.

## 5. Ce que cet audit ne dit pas

- Il mesure la couture, pas l'**effet** : aucune de ces sept trouvailles ne prouve qu'une règle a manqué
  à un run. Cette preuve demanderait un run où l'agent ne suit pas le pointeur.
- La régression de règle est mesurée **contre `v15`**, pas contre la référence d'avant la compression :
  les pertes de la chaîne v11→v15 ont leur propre dossier.
- F4 repose sur **un** harnais observé et sur l'absence de script dans le dépôt ; un autre client peut
  charger `.agents/skills/`. `OPEN`.
- Chiffres valables au 2026-10-16, framework `fe48de12`. Prose mesurée en `o200k_base`.
