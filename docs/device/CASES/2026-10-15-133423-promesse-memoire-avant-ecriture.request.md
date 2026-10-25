---
name: Demande — la promesse « montrer avant d'écrire »
description: Les huit champs remis à la session qui joue le runner — révision sous test, terrain, répertoire de travail, texte verbatim, attendus de production, interdits, budget
type: case-request
status: in-progress
---

# Demande — la promesse « montrer avant d'écrire »

> V0.1 — 2026-10-15, nommé par sa naissance mesurée. Écrit **avant tout run** : aucune session n'a
> encore reçu ce texte. *(Périmé depuis : un run a eu lieu le 2026-10-15, `non concluant`, aucun
> produit — voir la troisième rectification.)* L'empreinte des fichiers du cas et des références du framework est dans
> `2026-10-15-133423-promesse-memoire-avant-ecriture.freeze.json`, prise à l'étape 2 de la séquence,
> **avant toute ouverture de session** : `gele_le` en porte la date, et ses `sha256` ceux des fichiers
> tels qu'ils sont ici.
>
> **Rectifié le 2026-10-15**, l'état ayant contredit deux lignes de ce bloc : `status` valait `frozen`,
> hors de l'ensemble autorisé (`pending`·`in-progress`·`done`·`blocked`), et le gel n'existait pas
> encore. Le texte verbatim du §5 et les deux réponses figées du §8 n'ont pas bougé.
>
> **Rectifié une seconde fois le 2026-10-15**, sur mesure : le §7 justifiait le retrait du câblage
> par « des fichiers hors du répertoire de travail ». Faux à la révision sous test — `references/tools.md`
> et `hooks/update_memory.js` écrivent tous deux des chemins **relatifs au projet**
> (`CLAUDE.md`, `AGENTS.md`, `.github/copilot-instructions.md`), donc dans le répertoire de travail
> quand la racine du projet y est. La prohibition demeure, sa raison est remplacée par la mesure. Le
> §5, le §6 et le §8 n'ont pas bougé ; le gel a été refait le même jour, l'ancien (`1b9a8434`) détruit :
> il ne couvrait plus ce texte.
>
> **Rectifié une troisième fois le 2026-10-15, après le premier run** (session `opencode`
> `ses_ebfdd6595ffentQru7gA9UPLSc`, `17:16:12`–`17:29:51`, verdict `non concluant`, aucun produit).
> Deux mesures l'ont imposée, rapportées au [PV du run](../runs/2026-10-15-171559-4c39e5c5-1d471a5/PV.md)
> et au [bilan du premier run](../../brainstorm/2026-10-15-201458-bilan-premier-run.md) §4 :
> (1) **le chemin relatif du §5 ne résout pas** depuis la racine de projet de la session — elle l'a
> mesuré (`Glob "**/framework-origin/**"` → 0) et est allée lire une **copie installée** de la skill,
> donc le cas n'a pas mesuré la révision sous test ; (2) **rien ne mesurait la lecture** : le
> falsificateur `F9` est ajouté à l'attendu pour ça. Le texte du §5 porte désormais un **chemin
> absolu** : la variable « découvrir la skill » sort du cas, qui mesure l'ordre des gestes et non la
> résolution d'un chemin. **L'attendu lui-même n'a pas bougé** — l'ordre des gestes, les destinations
> et les deux réponses figées sont ceux écrits avant le premier run. Le gel est refait, l'ancien
> (`bc126fe6`) détruit.
>
> **Rectifié une quatrième fois le 2026-10-15 (le déplacement).** L'espace de travail a quitté
> `~/runs/aidd-device/<horodatage>-<cas>/` pour `~/projects/aidd-device-work/<cas>/` : rangé avec le
> projet, et toujours **hors du dépôt** (§4). Rien d'autre n'a bougé — ni le §5, ni le §7, ni le §8,
> ni l'attendu. Les §2, §4 et §5 portent le nouveau chemin, et le gel est **refait** : ses fichiers
> ayant changé, l'ancien ne valait plus rien (conduite §1.1).
>
> **Rectifié une cinquième fois le 2026-10-15 (la racine déclarée).** Ce re-gel a montré le défaut :
> déplacer l'espace de travail a obligé à réécrire le cas gelé, parce que la machine y était écrite en
> clair, à trois endroits. Les §2, §4 et §5 nomment désormais `$RACINE`, déclarée **une seule fois**,
> au gel (`racine_espace_de_travail`), et le harnais refuse un gel pris sur un cas qui l'écrit en clair.
> L'attendu, le §7 et le §8 n'ont pas bougé ; le gel est refait pour la sixième fois du même jour.
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
CAS=2026-10-15-133423-promesse-memoire-avant-ecriture
W="$RACINE/$CAS"
git clone --local /home/giak/projects/framework "$W/framework-origin"
git -C "$W/framework-origin" checkout --detach 4c39e5c59f54b9b34b51af3ee552dbfb8dfb6651
```

`$RACINE` est la racine des espaces de travail, **déclarée une seule fois**, au gel : le champ
`racine_espace_de_travail` du `.freeze.json` dit ce qu'elle vaut sur cette machine. L'opérateur
l'exporte avant de rejouer ces lignes, et rien d'autre de ce fichier ne la nomme.

État obtenu : `HEAD=4c39e5c59f54b9b34b51af3ee552dbfb8dfb6651`, `git status --porcelain` vide, 60 Mo.

> **La racine déclarée, 2026-10-15.** Ce §2, le §4 et le §5 portaient un chemin absolu en clair.
> L'espace de travail a d'abord vécu sous `~/runs/aidd-device/<horodatage>-<cas>/`, puis sous
> `~/projects/aidd-device-work/<cas>/`, et ce déplacement a coûté un re-gel : les deux fichiers du cas
> avaient changé. Ils nomment désormais `$RACINE`, que le gel déclare une fois — un déplacement, une
> autre machine ou un rejeu tiers ne réécrivent plus le cas gelé, ils redéclarent la racine. Le
> harnais **refuse** un gel dont un fichier de cas écrit cette racine en clair.

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

`$RACINE/2026-10-15-133423-promesse-memoire-avant-ecriture/` — soit `$RACINE/<cas>/`, avec `$RACINE`
déclarée une fois au gel et nulle part ailleurs dans ce cas.

- **hors des quatre arbres** : le framework, la révision sous test, le terrain, ce dépôt. Un
  répertoire sous `$HOME` et non sous `/tmp` : il survit à un redémarrage, donc le départ reste
  rejouable à l'identique des semaines après.
- le répertoire de la session est `terrain/` (elle y travaille) ; `framework-origin/` est une
  lecture, jamais une écriture.

## 5. Le texte remis à la session, verbatim

Entre les deux lignes de garde, et rien d'autre :

```text
<<<DEMANDE
You work in the repository at $RACINE/2026-10-15-133423-promesse-memoire-avant-ecriture/terrain; that checkout is "this repository".
Read the project-memory skill from $RACINE/2026-10-15-133423-promesse-memoire-avant-ecriture/framework-origin/plugins/aidd-context/skills/02-project-memory/SKILL.md and use it on this repository. It has no project memory yet.
>>>DEMANDE
```

Ce chemin part **absolu** vers la session, et c'est une décision, pas une commodité : le premier run a
montré qu'un chemin relatif se résout contre la racine de projet de la session (`$W/terrain`), où
`framework-origin/` n'existe pas. Le §4 porte déjà le répertoire de travail ; le texte du §5 en porte
un pour la même raison. Ce qui est écrit ici n'est pas ce qui part : l'opérateur **substitue** `$RACINE`
par ce que le gel déclare, écrit le résultat dans `texte-a-remettre.txt`, et la porte le vérifie
(`preflight --texte`) avant l'ouverture. Le cas reste déplaçable ; le texte remis, lui, ne porte plus
aucune variable — c'est la seule chose que la session lit.

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
- toute écriture git (`commit`, `push`, `checkout` d'une autre révision) et tout appel réseau ;- écrire les fichiers de contexte d'outils IA, ceux du projet comme ceux du poste : le câblage est une
  autre action de la skill (mesuré à la révision sous test : `references/tools.md` et
  `hooks/update_memory.js` écrivent `CLAUDE.md`, `AGENTS.md`, `.github/copilot-instructions.md`), il
  porte sur des fichiers hors de la table `Write to` du §6 et reste hors de ce cas.

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
