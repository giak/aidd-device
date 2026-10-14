---
name: Construction du générateur et du squelette
description: Ce qui a été exécuté, ce que ça a donné, et les deux défauts trouvés et corrigés en chemin
type: run
status: done
---

# Run — construction de l'orchestrateur documentaire

Journée du 2026-10-14, dans `/home/giak/projects/aidd-device`. Chaque ligne de résultat vient d'une
commande dont la sortie a été lue, code de sortie compris.

## Ce qui a été exécuté

```console
node scripts/docs-index.mjs            → exit 0, 6 document(s) lus, 0 fichier(s) réécrit(s) après stabilisation
node scripts/docs-index.mjs --strict   → exit 1 quand un statut hors vocabulaire est présent, 0 sinon
```

## Les cinq critères de la spec

| Critère | Résultat |
| --- | --- |
| 1. Seuls les trois fichiers d'état changent | Vérifié par empreintes de tous les fichiers de `docs/` avant/après : la première exécution n'ajoute que `index.md`, `dashboard.md` et `trace.md`. La méthode par empreintes remplace `git status`, qui ne peut rien distinguer tant que `docs/` n'est pas suivi. |
| 2. Deux exécutions consécutives laissent les fichiers identiques | Vérifié, ligne de dérivation comprise : la deuxième exécution annonce `0 fichier(s) réécrit(s)` et les empreintes sont inchangées. |
| 3. `status: pending` apparaît en `todo` | Vérifié : `spec.md` était compté dans la colonne `todo` du tableau de bord. Il est passé à `done` après la construction, donc la mesure ne se rejoue plus telle quelle — elle est datée du moment où elle a été faite. |
| 4. Un document sans frontmatter n'est pas écarté | Vérifié : `MEGA-PROMPT-TEST-AIDD-v6.md` apparaît en `unknown / unknown` dans l'index et dans la colonne `unknown`. |
| 5. Chaque fichier généré porte la commande et l'instant | Vérifié : la même ligne apparaît dans les trois, avec la commande et l'horodatage. |

## Deux défauts trouvés pendant la construction, et corrigés à la cause

1. **Le générateur convergeait en deux exécutions.** Les trois fichiers générés n'entraient dans
   l'inventaire qu'à partir du run qui les créait, donc le deuxième run les redécrivait. Le premier
   test d'idempotence a échoué pour cette raison. Corrigé en déclarant les trois documents comme
   partie du manifeste par construction, jamais relus du disque ; leurs dates continuent de venir de
   git. Après quoi l'idempotence est vérifiée dès la première exécution.
2. **Le frontmatter généré portait une clé `path:`.** Fuite de la fonction qui décrit les documents
   générés, qui recopiait la description entière au lieu des seuls champs du contrat de frontmatter.
   Corrigé ; les trois fichiers régénérés ne portent plus que `name`, `description`, `type` et
   `status`.

## Sonde jouée puis retirée

Un document temporaire portant `status: todo` a été ajouté :

```console
docs-index: docs/tasks/2026_10/_sonde.md: statut « todo » hors vocabulaire (attendu : pending | in-progress | done | blocked)
defaut exit=0
strict exit=1
| Sonde | spec | todo | unknown | [_sonde.md](tasks/2026_10/_sonde.md) |
```

L'index porte la valeur telle qu'elle est écrite, la console la nomme, et `--strict` en fait un
portier. La sonde a été retirée et l'index ne la cite plus.

## Double contrôle, après la livraison

Quatre affirmations ont été éprouvées au lieu d'être supposées, et deux se sont révélées fausses.

| Affirmation | Ce qui a été fait | Résultat |
| --- | --- | --- |
| Les dates viennent de git | Dépôt jetable dans `/tmp`, deux commits | La date d'un document suivi suit son dernier commit (18:07:37 puis 18:07:43) ; un fichier non commité reste `unknown`. C'était le seul chemin du générateur qui n'avait jamais produit de valeur. |
| L'idempotence tient aussi dans un dépôt commité | Deux exécutions de suite dans ce même dépôt jetable | Identique : aucun octet ne bouge. |
| Le repli du nom, chez `kanban`, est le nom de fichier | Lecture de `task-name-fallback.ts` et de `task-group.ts:10-12` | **Faux.** `plan.md`, `master-plan.md` et `spec.md` rendent le nom du dossier parent. Spec corrigée. |
| Nos documents restent lisibles par les outils du framework | Lecture de `kanban-deps.ts`, de `cli/src/kernel/paths.ts:13` et du plan `2026_09_03_dependances-kanban` | **Faux.** La commande hôte qui montait `kanban` est débranchée, `kanban/` n'a ni binaire ni point d'entrée, et le CLI cherche la constante `aidd_docs`. Spec corrigée : le vocabulaire est une convention que nous tenons seuls. |

Troisième défaut, du même double contrôle : **le générateur plantait en `ENOENT` avec une pile d'appels
quand `docs/` n'existait pas**, mesuré dans un dossier jetable. Il crée désormais le dossier ; vérifié
ensuite, dossier vide : exit 0, trois fichiers écrits, idempotent à la deuxième exécution.

Quatrième défaut, trouvé par ce double contrôle et non par les tests d'origine : **`--strict` sortait en 1
sur quatre documents simplement non commités**, alors que la spec réserve ce code au statut hors
vocabulaire. Les deux conditions sont maintenant séparées — `--strict` sort en 0 sur l'état courant et
en 1 avec un `status: todo` — et la spec porte la distinction.

## Le crochet pré-commit

`.githooks/pre-commit` régénère puis refuse si quelque chose a bougé. Éprouvé **par git**, dans un
dépôt jetable à part, avec `core.hooksPath` installé :

| Situation | Résultat mesuré |
| --- | --- |
| `docs/` jamais généré, premier commit | refusé, les trois fichiers nommés comme périmés |
| Après `git add -A` | passe |
| Un document modifié sans régénérer | refusé, les trois nommés deux fois (périmés **et** différents de l'index) |
| Après `git add docs/` | passe |
| `dashboard.md` édité à la main puis indexé | refusé, `dashboard.md` nommé ; le fichier est réécrit, donc le commit suivant n'a plus rien à valider |
| Rien de périmé | passe, **0 octet** sur `stderr` |
| Générateur absent (`scripts/docs-index.mjs` supprimé) | refusé, avec la raison nommée |

Dans le dossier de travail lui-même, crochet installé (`git config core.hooksPath .githooks`) :
sonde ajoutée → **exit 1** avec les trois fichiers nommés ; sonde retirée → **exit 0**. Aucun commit
n'a été créé (`git log` count = 1, celui du relecteur humain).

Le cycle sonde a été recontrôlé : les trois fichiers reviennent identiques à l'octet près, ligne de
dérivation normalisée.

## Ce que ce run ne prouve pas

- **Le lecteur `kanban` n'a pas été exécuté, et ne peut pas l'être en l'état.** Le vocabulaire de
  statut a été relevé dans son code (`filesystem-task-document-repository.ts`, `progress-status.ts`),
  pas éprouvé en le lançant. Un double contrôle a montré plus grave : la commande hôte qui le montait
  est débranchée, `kanban/` est un paquet privé sans point d'entrée, et le CLI cherche une constante
  de nom, `DOCS_DIR = "aidd_docs"` (`cli/src/kernel/paths.ts:13`). « Compatible avec `kanban` » est
  donc une convention que nous tenons seuls, pas une interopérabilité constatable.
- **Le repli du nom n'est pas celui que la première version de la spec annonçait** : pour `plan.md`,
  `master-plan.md` et `spec.md`, `kanban` rend le nom du dossier parent, pas le nom de fichier. Sans
  effet sur nos documents, qui portent tous un `name`, mais la spec est corrigée.
- **Toutes les dates sont `unknown`** : rien n'est commité, donc `git log` ne rend rien. Le
  générateur le dit sur `stderr` pour chaque document concerné.
- **Rien n'appelle le générateur automatiquement.** Aucun crochet, aucune CI. Entre deux exécutions
  manuelles, `dashboard.md` peut donc être en retard sur les documents qu'il résume.
