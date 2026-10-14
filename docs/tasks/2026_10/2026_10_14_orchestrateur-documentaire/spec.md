---
name: Orchestrateur documentaire de aidd-device
description: Arborescence de docs/, frontmatter commun, et les trois fichiers d'état que rien ne doit écrire à la main
type: spec
status: done
---

# Orchestrateur documentaire

## Intention

Ce dépôt porte un protocole de test, et sa matière première est de la prose : un méga-prompt, des
cas, des comptes-rendus. Une prose qui n'est pas relue devient fausse sans prévenir. Le défaut est
déjà documenté deux fois, mesuré : une ligne de mémoire qui affirmait « 41 commits, tous non
poussés » alors que le dépôt en comptait 134 (issue #942), et un compte-rendu de session dont
l'affirmation « zéro occurrence de `localStorage` dans `src/` » est devenue fausse **huit heures et
vingt-neuf minutes** plus tard, sans que rien ne la reprenne.

Ce système existe pour que l'état du dossier soit **toujours dérivable**, jamais recopié. C'est sa
seule raison d'être : une entrée lisible pour le relecteur, et un état qui se recalcule au lieu de
se périmer.

## Non-goals

- Ne pas reproduire la chaîne documentaire complète d'AIDD (`frame.md`, `review.md`,
  `validation.md`, `measurements.md`) : chaque document supplémentaire est une affirmation de plus
  à tenir vraie.
- Ne pas écrire d'outil de rendu. On adopte le vocabulaire du lecteur qui existe (`kanban/`) sans le
  réimplémenter — sans prétendre pour autant qu'il nous lira, voir la nuance plus bas.
- Ne pas héberger d'exécution. Les exécutions du dispositif vivent chez lui, hors des deux arbres
  sous test (méga-prompt §10) ; ce dossier ne contient que des documents.

## Ce qu'AIDD fait, et ce qu'il ne fait pas

Relevé le 2026-10-14 sur l'arbre du framework à la révision `fe48de12` :

- `aidd_docs/` : `README.md`, `GUIDELINES.md`, `CONTRIBUTING.md`, `brainstorm/`, `memory/`
  (`internal/decisions/`, `external/`), `product/`, `recipes/`, `specs/<AAAA_MM>/`,
  `tasks/<AAAA_MM>/<AAAA_MM_JJ>_<slug>/`, `runs/`.
- par tâche : `frame.md`, `spec.md`, `plan.md`, `phase-N.md`, `review.md`, `validation.md`,
  `measurements.md`, `findings.md`, chacun avec un frontmatter.
- **`index.md`, `dashboard.md` et `trace.md` n'existent nulle part** dans l'arbre : recherche sur
  tout le dépôt, zéro occurrence. Ces noms sont une demande du relecteur humain, pas une convention
  héritée.
- l'équivalent fonctionnel existe, autrement : le `README.md` sert d'entrée ; le board est **dérivé**
  du frontmatter par `kanban/` ; la trace est `aidd_docs/runs/`, un journal alimenté par hook et
  gitignoré.

Contrat du lecteur `kanban` (`kanban/src/infrastructure/filesystem/filesystem-task-document-repository.ts`) :
il parcourt récursivement tous les `.md` du dossier, lit le frontmatter avec `gray-matter`, et
n'utilise que quatre clés — `name`, `description`, `type`, `status`. Quand `name` manque,
`resolveTaskDocumentNameFallback` rend le **nom du dossier parent** pour `plan.md`, `master-plan.md`
et `spec.md`, et le nom du fichier sans `.md` sinon (`task-name-fallback.ts`, `task-group.ts:10-12`) :
le repli n'est donc pas « le nom de fichier » dans le cas le plus courant.
`deriveProgressStatus` (`kanban/src/domain/models/progress-status.ts`) ne connaît que
`pending → todo`, `in-progress`, `done`, `implemented → done`, `reviewed → done`, `blocked`, et
renvoie `unknown` pour tout le reste. **`status: todo` n'existe pas dans ce vocabulaire et tomberait
en `unknown`.** C'est une contrainte mesurée, pas un choix de goût.

**Ce lecteur n'est pas un chemin disponible aujourd'hui** (correction du 2026-10-14, la première
version de ce document s'appuyait sur lui à tort) : la commande hôte qui le montait est débranchée, ce
que le dépôt du framework consigne lui-même dans
`aidd_docs/tasks/2026_09/2026_09_03_dependances-kanban/plan.md` ; `kanban/` est un paquet privé sans
binaire, sans `main` et sans point d'entrée ; et le nom du dossier que le CLI cherche est une
constante, `DOCS_DIR = "aidd_docs"` (`cli/src/kernel/paths.ts:13`). Adopter son vocabulaire reste un
bon pari de convention, mais **tenu par nous seuls** : personne ne lit `docs/` aujourd'hui, et cette
compatibilité ne se vérifie pas en lançant l'outil.

## Arborescence retenue

```text
.githooks/pre-commit                        crochet versionné, installé par `git config core.hooksPath .githooks`
scripts/docs-index.mjs                      le générateur
docs/
├── index.md                                  généré
├── dashboard.md                              généré
├── trace.md                                  généré
├── brainstorm/
│   └── MEGA-PROMPT-TEST-AIDD-v6.md           existe déjà
└── tasks/
    └── 2026_10/
        └── 2026_10_14_orchestrateur-documentaire/
            ├── spec.md                     ce document
            ├── plan.md
            ├── run.md
            └── (phase-N.md, brainstorm.md et ecart.md le jour où ils ont un contenu)
```

Le relecteur humain a choisi le sous-ensemble : `brainstorm.md`, `spec.md`, `plan.md`, `phase-N.md`
quand il y a des phases, puis `run.md` et `ecart.md` pour le protocole. `frame.md`, `review.md`,
`validation.md` et `measurements.md` ne sont pas créés tant qu'ils n'ont pas de contenu propre.

## Frontmatter commun

Chaque document commence par un bloc YAML à clés scalaires :

```yaml
---
name: Orchestrateur documentaire
description: une ligne, ce que le document décide ou rapporte
type: spec            # brainstorm | spec | plan | phase | run | ecart | index | dashboard | trace
status: pending       # pending | in-progress | done | blocked
---
```

`date` et `updated` ne figurent pas ici : ils sont dérivés de git, comme dit plus bas.

`status` n'accepte que les quatre valeurs que `kanban` sait convertir. Un document sans frontmatter
n'est pas écarté : il apparaît en `type: unknown` / `status: unknown`, avec son chemin. Disparaître
en silence serait pire que d'être vu sans type.

**`date` et `updated` ne sont pas écrits à la main** (mon choix). `date` est la date du premier
commit qui touche le fichier, `updated` celle du dernier, toutes deux lues par le générateur avec
`git log -1 --format=%cI -- <chemin>`. La raison est l'objet même de ce document : trier `trace.md`
sur une date déclarée, c'est trier sur une revendication, exactement le défaut que #942 a mesuré. Un
fichier non suivi par git reçoit `date: unknown` et est nommé dans la sortie du générateur ; le
frontmatter ne porte donc que `name`, `description`, `type` et `status` comme valeurs écrites par un
humain.

## Les trois fichiers d'état

Tous trois sont **générés**. Aucun n'est édité à la main. Chacun commence par un frontmatter, puis
une ligne de dérivation qui porte la commande exacte et l'instant :

```text
> Généré le 2026-10-14T18:02:11+02:00 par `node scripts/docs-index.mjs` — ne pas éditer.
```

- **`index.md`** : chaque document de `docs/`, une ligne par document, avec son type, son statut, sa
  date et un lien relatif. Les documents générés y figurent sous leur propre type.
- **`dashboard.md`** : le compte par statut, puis les documents groupés par statut, dans l'ordre des
  colonnes de `kanban` (`todo`, `in-progress`, `done`, `blocked`, `unknown`). C'est le regroupement de
  ce lecteur, dans son ordre de colonnes, écrit dans un fichier pour être lisible dans la pull
  request. **Les
  trois fichiers générés sont exclus de ces comptes** (mon choix) : sinon l'état dépendrait de sa
  propre sortie, et un fichier de plus ferait bouger un total qui le mentionne.
- **`trace.md`** : une ligne par document, du plus récent au plus ancien, avec sa date et son lien.
  Un `run.md` y apparaît une fois, comme n'importe quel document — il est indexé une seule fois et
  n'a pas de traitement séparé. **Limite dite à voix haute dans le fichier lui-même** : cette trace
  ne rapporte que ce que les documents déclarent et que git a commité. Une modification faite sans
  document, ou un document non commité, ne laisse aucune trace, et le fichier doit le dire plutôt
  que de laisser croire à une exhaustivité.

## Le générateur

- Vit à `scripts/docs-index.mjs`, **sans aucune dépendance** : le dépôt n'a pas de `package.json`, et
  en ajouter un pour lire quatre clés scalaires serait disproportionné. Le lecteur de frontmatter ne
  traite que le bloc initial, clé `: valeur`, et refuse de deviner au-delà.
- Il parcourt `docs/`, écrit les trois fichiers, et rien d'autre. Pas d'écriture hors de `docs/`. Un
  dépôt sans dossier `docs/` est un état légitime : il le crée au lieu d'échouer.
- Il est **idempotent, ligne de dérivation comprise** (mon choix) : il n'écrit un fichier que si son
  contenu a changé, et la ligne de dérivation porte l'instant du dernier changement de contenu, pas
  celui de la dernière exécution. Deux exécutions de suite laissent donc l'arbre propre au lieu de
  le salir en permanence ; c'est ce qui permet d'appeler le générateur depuis un crochet sans
  fabriquer de bruit.
- Un `status` hors vocabulaire ne passe pas en silence : le générateur nomme le fichier et la valeur
  sur `stderr`, l'écrit en `unknown` dans `index.md`, et sort en **0**. L'option `--strict` le fait
  sortir en 1, pour l'appelant qui veut en faire un portier. Mon choix : le défaut ne casse pas, mais
  il parle.
- Un document **non commité** est une note, jamais une erreur : le générateur le nomme sur `stderr`
  sans faire échouer `--strict`. Les deux conditions étaient confondues dans la première version, ce
  qui faisait sortir `--strict` en 1 à chaque document neuf et l'aurait rendu inutilisable.
- Il n'échoue pas sur un document illisible : il le liste en `unknown` et continue.

## Le crochet qui refuse un état périmé

Rien n'empêche `dashboard.md` de prendre du retard entre deux exécutions si personne ne l'appelle.
Le crochet `.githooks/pre-commit` ferme ce trou au moment qui compte : **il régénère d'abord, puis
refuse si quelque chose a bougé.**

Il regarde deux choses, parce qu'elles échouent dans des états différents :

1. la régénération a réécrit un des trois fichiers : la copie de travail était périmée ;
2. un des trois diffère de ce qui est indexé : le commit embarquerait autre chose que ce qu'une
   exécution fraîche produit — une édition à la main, typiquement.

Le premier signal est le seul qui fonctionne **avant** que `docs/` soit suivi par git, puisque
`git diff` ne dit rien d'un fichier non suivi. C'est l'état de ce dépôt au 2026-10-14.

**Rien n'est indexé à ta place.** Un commit doit contenir ce que tu as choisi, jamais ce qu'un
crochet y a ajouté. Conséquence assumée : le premier commit qui suit la modification d'un document
est refusé une fois, puis passe après `git add docs/`.

Installation, une fois par clone : `git config core.hooksPath .githooks`. Le crochet est versionné,
donc l'installation est reproductible, mais elle n'est pas automatique : un clone qui l'ignore ne
vérifie rien.

## Critères d'acceptation

1. Après `node scripts/docs-index.mjs`, seuls `index.md`, `dashboard.md` et `trace.md` diffèrent.
   Tant que `docs/` n'est pas suivi par git, la vérification se fait par empreintes de tous les
   fichiers du dossier ; elle redevient un `git status --porcelain docs/` après le premier commit.
2. Deux exécutions consécutives laissent les trois fichiers **strictement identiques**, ligne de
   dérivation comprise.
3. Un document `status: pending` est compté dans la colonne `todo` du tableau de bord, ce qui prouve
   que le vocabulaire est bien celui de `kanban`. Mesuré le 2026-10-14 sur ce document avant qu'il
   passe à `done` — voir [run.md](run.md).
4. Un fichier `.md` ajouté sous `docs/tasks/` sans frontmatter apparaît dans `index.md` en
   `unknown` et n'est pas écarté.
5. Chaque fichier généré porte la commande qui l'a produit et l'instant du dernier changement de son
   contenu.
6. Avec le crochet installé, un commit dont le tableau de bord ne correspond plus aux documents est
   **refusé**, et la sortie nomme les fichiers concernés.
7. Le même commit passe après `git add docs/`, et un commit sans rien de périmé ne dit pas un mot.

## Ce qui reste au constructeur

- L'emplacement exact du script : `scripts/docs-index.mjs` est mon choix, `tools/` conviendrait aussi.
- Le rendu des tableaux, tant qu'ils restent lisibles en terminal et en diff.
- Le crochet attrape une édition manuelle **au moment du commit**, à condition d'être installé et de
  ne pas être contourné : `git commit --no-verify` passe outre, et rien ne le signale. Après coup, la
  ligne de dérivation reste le seul témoin, et elle ne résiste pas à une recopie.

## Résolu le 2026-10-14 — une spec a une seule maison

Le relecteur humain a tranché : **la tâche**. `docs/specs/` n'existe pas, et ce document-ci vit dans
`docs/tasks/2026_10/2026_10_14_orchestrateur-documentaire/spec.md`. La question venait du contrôle
constructeur : deux emplacements pour une même nature de document violent la règle « un fait, une
maison », que ce dépôt tient déjà.

## Décisions, et de qui

- **Du relecteur humain**, le 2026-10-14 : les fichiers d'état sont **générés** ; la chaîne
  documentaire par tâche est le **sous-ensemble** `brainstorm` / `spec` / `plan` / `phase-N` / `run`
  / `ecart`.
- **Miennes**, après le contrôle constructeur, à corriger si elles déplaisent : `docs/` plutôt qu'un
  `aidd_docs/` ; la prose en français ; le script sans dépendance ; `scripts/docs-index.mjs` ;
  `date` et `updated` lus dans git ; les trois fichiers générés exclus des comptes du tableau de
  bord ; `status` hors vocabulaire signalé sans faire échouer, `--strict` pour l'inverse ;
  idempotence ligne de dérivation comprise.
- **Du relecteur humain**, après le contrôle constructeur : une spec a **une seule maison**, la
  tâche ; `docs/specs/` n'existe pas.
