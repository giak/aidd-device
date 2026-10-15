---
name: Demande — la promesse « montrer avant d'écrire »
description: Les huit champs remis à la session qui joue le runner — révision sous test, terrain, répertoire de travail, texte verbatim, attendus de production, interdits, budget
type: case-request
status: pending
---

# Demande — la promesse « montrer avant d'écrire »

> V0.1 — 2026-10-15, nommé par sa naissance mesurée. Écrit **avant tout run** : aucune session n'a
> encore reçu ce texte. L'empreinte des fichiers du cas et des références du framework est dans
> `2026-10-15-133423-promesse-memoire-avant-ecriture.freeze.json`, prise à l'étape 2 de la séquence,
> **avant toute ouverture de session** : `gele_le` en porte la date, et ses `sha256` ceux des fichiers
> tels qu'ils sont ici.
>
> **Rectifié le 2026-10-15**, l'état ayant contredit deux lignes de ce bloc : `status` valait `frozen`,
> hors de l'ensemble autorisé (`pending`·`in-progress`·`done`·`blocked`), et le gel n'existait pas
> encore. Le texte verbatim du §5 et les deux réponses figées du §8 n'ont pas bougé.
> Champs imposés par la [spec du run](../../tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-130103-spec.md) §3 ;
> l'attendu vit à côté, dans `.expected.json`, et ne part jamais.

## 1. Identifiant du cas

`2026-10-15-133423-promesse-memoire-avant-ecriture`

## 2. Révision du framework sous test

- **commit** : `4c39e5c59f54b9b34b51af3ee552dbfb8dfb6651` (`4c39e5c59`), arbre
  `4c79f56a741820c68dce14b7acf253250bb43b5f`
- **sujet** : `refactor(aidd-context): project memory shows what it would change before writing (#633)`
  — 2026-08-14 12:41:36 +0200, auteur Baptiste LAFOURCADE
- **deux écritures du même contenu** : `a9d5b0b20a4812857cff2e15c9f3dfe97456003b` porte le même
  sujet, la même date et le **même arbre** `4c79f56a…` (rebase). Le cas épingle `4c39e5c59`, dont
  le parent `7ec7bbc575` est l'état d'avant ; les deux sont ancêtres de `main`.

**Ce que la modification change, mesuré** (`git ls-tree` et `git show` sur `4c39e5c59^` contre
`4c39e5c59`) :

- `actions/` : `01-scan`, `02-generate`, `03-sync` → `01-scan`, `02-write`, `03-check`, `04-sync` ;
- `assets/` : `scan-summary.md` apparaît, et les gabarits passent sous `assets/templates/` ;
- `references/reading-sources.md` apparaît : ce que le scan lit, du moins cher au plus cher ;
- `01-scan.md` : l'étape 4 passe de « Show each capability with its evidence. Ask the user to add or
  drop one. » à « Show the scan as `scan-summary.md` does, ask for what the repo cannot prove, and
  wait. » ; son tableau `Test` gagne la ligne `Summary — one row per capability and per tool, each
  carrying evidence` ;
- `SKILL.md` : le flux `build --> scan --> generate --> sync` devient
  `new --> scan --> write --> sync` et `update --> scan --> check --> write`.

**Ce qu'elle promet, dans ses mots** : le sujet du commit — « project memory shows what it would
change before writing » — et la première ligne de l'asset créé pour ça
(`assets/scan-summary.md`) : « Here is what I read. Correct me before I write. » L'asset fixe la
forme : « One row per capability, one row per tool. The evidence is a path or a dependency, never a
claim. »

**Ce qu'elle ne promet pas — mesuré par son auteur, pas deviné.** Le message du même commit porte un
défaut connu et chiffré : « a hand-written line in an existing memory file survives a refresh 1 run
in 2, against 3 in 3 before this change… Do not run refresh on a bank holding notes worth keeping
until this is fixed. » Ce cas-ci prend donc un dépôt **sans** banc de mémoire : il n'exerce ni
`refresh`, ni la survie d'une note écrite à la main.

**Commande d'installation dans un répertoire jetable** (exécutée, sortie recopiée) :

```text
W=/home/giak/runs/aidd-device/2026-10-15-133335-promesse-memoire-avant-ecriture
git clone --local /home/giak/projects/framework "$W/framework-origin"
git -C "$W/framework-origin" checkout --detach 4c39e5c59f54b9b34b51af3ee552dbfb8dfb6651
```

État obtenu : `HEAD=4c39e5c59f54b9b34b51af3ee552dbfb8dfb6651`, `git status --porcelain` vide, 60 Mo.

## 3. Révision du terrain, et sa copie de travail

- **dépôt du terrain** : `/home/giak/projects/audio-sync-tool` — un outil Flask 3.1 + vue TypeScript
  construite par `build.js`, 307 fichiers suivis, tests `vitest` et `pytest`.
- **révision** : `416ec1fa08b7c8cabb8dedb4d5fd0eec37a5afde` (`416ec1f`) — celle de son HEAD, arbre de
  travail propre en dehors de `?? .freebuff/` (non suivi, écrit par le client, constaté à l'ADR-011).
- **propriété qui fait choisir ce terrain** : `aidd_docs/` n'y existe pas — mesuré, `find` ne rend
  rien côté terrain. La mémoire projet y est à écrire pour la **première fois**, donc `setup` seul
  est exercé, sans banc à respecter.
- **copie de travail** (exécutée, sortie recopiée) :

```text
git clone /home/giak/projects/audio-sync-tool "$W/terrain"
git -C "$W/terrain" checkout --detach 416ec1fa08b7c8cabb8dedb4d5fd0eec37a5afde
```

État obtenu : `HEAD=416ec1fa08b7c8cabb8dedb4d5fd0eec37a5afde`, aucune modification, 16 Mo, aucun
`aidd_docs/`. La copie ne porte ni `.kilo/worktrees/` (ignoré, donc non cloné) ni `.freebuff/` :
elle est propre par construction, ce qui rend le `git status` avant/après lisible.

## 4. Répertoire de travail

`/home/giak/runs/aidd-device/2026-10-15-133335-promesse-memoire-avant-ecriture/`

- **hors des quatre arbres** : le framework, la révision sous test, le terrain, ce dépôt. Un
  répertoire sous `$HOME` et non sous `/tmp` : il survit à un redémarrage, donc le départ reste
  rejouable à l'identique des semaines après.
- le répertoire de la session est `terrain/` (elle y travaille) ; `framework-origin/` est une
  lecture, jamais une écriture.

## 5. Le texte remis à la session, verbatim

Entre les deux lignes de garde, et rien d'autre :

```text
<<<DEMANDE
Read the project-memory skill from framework-origin/plugins/aidd-context/skills/02-project-memory/SKILL.md and use it on this repository. It has no project memory yet.
>>>DEMANDE
```

La demande est en anglais comme la skill, ses gabarits et le banc qu'ils produisent : l'attendu
porte sur l'**ordre** des gestes, pas sur la langue, et une demande française ajouterait une seconde
variable (du français à écrire dans des gabarits anglais) sans rien prouver de plus.

Ce que la demande **ne dit pas** : ni `setup`, ni `scan`, ni `write`. Le vocabulaire interne de la
skill reste à la skill ; ce que le cas mesure, c'est ce qu'elle en fait.

## 6. Ce qu'elle doit produire

La mémoire projet de `terrain/`, sous `terrain/aidd_docs/` : les fichiers dont `Write to` de
`references/memory-destinations.md` — à la révision sous test, empreinte au `.freeze.json` — nomme
la destination. Chemin exact, nom exact, à la racine du terrain copié. Rien d'autre n'est attendu ;
aucun fichier hors de cette table n'est un produit.

## 7. Ce qui lui est interdit

- écrire dans `framework-origin/` — la révision sous test s'y lit, ne s'y modifie pas ;
- écrire dans `/home/giak/projects/audio-sync-tool` — l'original du terrain ;
- lire quoi que ce soit sous `/home/giak/projects/aidd-device/docs/device/CASES/` — l'attendu y vit ;
- sortir du répertoire de travail (§4) : ni dans le reste de `$HOME`, ni dans `/tmp` ;
- toute écriture git (`commit`, `push`, `checkout` d'une autre révision) et tout appel réseau ;
- écrire dans les configurations d'outils IA du poste : le câblage est une autre action de la skill,
  il vise des fichiers hors du répertoire de travail et il est hors de ce cas.

## 8. Budget, et les deux textes figés de l'opérateur

**Trois échanges au plus.** Le premier porte la demande (§5). Les suivants sont figés ici, avant le
run, pour qu'aucune parole de l'opérateur ne soit improvisée pendant qu'il voit le produit :

- **réponse au tableau** (le cas normal) :

```text
<<<REPONSE_TABLEAU
Yes, that matches. Do not write the backlog memory: this repo tracks its work elsewhere. Everything else is right.
>>>REPONSE_TABLEAU
```

- **réponse à toute autre question** — un troisième échange où la session demande autre chose que la
  confirmation de son tableau :

```text
<<<REPONSE_AUTRE
Answer from the repository. If it cannot be read there, say so and stop.
>>>REPONSE_AUTRE
```

L'opérateur n'improvise rien d'autre. Un run qui épuise les trois échanges sans avoir rendu son
tableau reste conservé : il se conclut `non concluant`, et le reçu nomme l'échange qui l'a épuisé.
