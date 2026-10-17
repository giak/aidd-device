---
name: BOUNDARY — la frontière du dispositif
description: Les quatre arbres, les chemins du framework lus ou non, la révision installée, et les preuves que le framework est intact et qu'aucun fichier du dispositif ne lui appartient
type: boundary
status: in-progress
---

# BOUNDARY — la frontière

> V0.1 — 2026-10-15. Répond à la question 7 du v6 §11 : « Aucun fichier du dispositif n'appartient
> au framework, et le framework est-il intact ? » Chaque chiffre porte la commande qui l'établit.
> Un relevé daté reste un relevé : chaque run refait les mesures, et un HEAD qui bouge invalide
> celles-ci.

## 1. Les quatre arbres

| Arbre | Chemin | Ce qu'on y fait |
| --- | --- | --- |
| framework-origin | `/home/giak/projects/framework` | lu, **jamais** écrit ni installé ici |
| révision sous test | `$RACINE/<cas>/framework-origin` — un espace de travail par cas, hors des quatre arbres ; la copie est **dérivée** de `--racine` au gel | copie d'une révision de l'origine ; paramètre de run, jamais une constante |
| terrain | `/home/giak/projects/audio-sync-tool` | lu, **jamais** écrit ; copie de travail par run |
| le dispositif | `/home/giak/projects/aidd-device` | le seul arbre que le dispositif écrit |

**Un même nom pour deux choses, et il faut le savoir** : `framework-origin` nomme ici la **source**
(`/home/giak/projects/framework`), et il nomme aussi le **dossier qui porte sa copie**
(`<racine>/<cas>/framework-origin`, dont le label de gel est « révision sous test »). Le texte remis à
la session porte le second sens, le §3 parle du premier.

Tout ce qui exécute tourne dans un répertoire jetable, hors de ces arbres. Le foyer, arrêté le
2026-10-15 : `<racine>/<identifiant-du-cas>/`, qui porte `terrain/` — où la session écrit — et
`framework-origin/`, lu seul. La **racine** se déclare une seule fois, au gel
(`racine_espace_de_travail`) : le cas l'écrit `$RACINE` et ne nomme aucun chemin de machine, sinon un
déplacement obligerait à réécrire le cas gelé ([ADR-019](../DECISIONS.md)). Rangé sous `~/projects/`
**avec** le projet et **hors** de lui : le dépôt du dispositif porte les preuves, dont le corrigé du cas
en cours. **Un espace par cas, jamais par run** : le texte remis et le gel y portent des chemins
absolus ; deux runs du même cas se distinguent par leurs pièces, sous `docs/device/runs/`.

## 2. Les chemins du framework que le dispositif lit

Mesurés le 2026-10-15 sur la révision `fe48de12` :

| Chemin | Mesure | Commande |
| --- | --- | --- |
| tout l'arbre, pour en faire la copie sous test | 2 599 fichiers suivis | `git -C /home/giak/projects/framework ls-files \| wc -l` |
| la surface sous test | 51 `SKILL.md` | `find /home/giak/projects/framework/plugins -name SKILL.md \| wc -l` |
| l'installeur | 400 fichiers | `find /home/giak/projects/framework/cli/src -type f \| wc -l` |
| les contrôles que citera un compte-rendu | 17 fichiers | `ls /home/giak/projects/framework/scripts/*.mjs /home/giak/projects/framework/scripts/*.js \| wc -l` |

## 3. La révision qu'il installe

```text
git -C /home/giak/projects/framework rev-parse --short HEAD   → fe48de12
git -C /home/giak/projects/framework log -1 --format='%cI %s' → 2026-10-14T14:03:16+02:00 docs(framework): …
git -C /home/giak/projects/framework branch --show-current    → feat/protocole-de-test-aidd
```

La révision sous test est épinglée **par run** et enregistrée dans `CASES/<cas>.request.md`. La
commande qui l'installe, en revanche, n'est pas encore choisie : c'est un paramètre de run, et rien
n'est écrit avant l'arbitrage de la spec du run — `OPEN`.

Les quatre arbres gelés du premier cas sont **publiés** (relevé du 2026-10-15) : `framework-origin`
`fe48de12` sur `github.com/giak/framework`, branche `gel/2026-10-15-fe48de12`, poussée ce jour ;
`terrain` et `travail` `416ec1f` sur `github.com/giak/audio-sync-tool` `main` ; `revision-sous-test`
`4c39e5c5` sur `github.com/ai-driven-dev/framework`, où 83 branches distantes le portent. Un tiers
reconstitue donc chaque `HEAD` gelé — mais pas le `porcelain` gelé : les fichiers non suivis
(`.freebuff/`, la copie périmée du v6 chez l'origine) n'entrent dans aucun commit. Nuance du champ :
`arbres[].refs_distants` dit les branches telles que **le clone de l'arbre** les connaît, et celui de
`revision-sous-test` comme de `travail` est un miroir local — les adresses publiques sont celles
dessus. Le dépôt public du dispositif (`github.com/giak/aidd-device`) porte le dispositif seul, et le
gel porte des chemins de cette machine : un tiers refait son propre gel avant de faire tourner. Une
partie de la réponse à la question 1 du §11.

## 4. Ce qu'il ne lit pas

- Dans le framework : `.git/**`, `node_modules/**`, et les dossiers présents mais non suivis que
  `git ls-files` ne connaît pas — `.kilo/**` (worktrees tiers, `git ls-files .kilo | wc -l` → 0),
  `.freebuff/`, `.aidd/`, `temp/`, `.pytest_cache/`.
- Dans le terrain : `.kilo/worktrees/**`, le worktree tiers constaté et conservé (ADR-011), qui
  n'entre dans aucune copie de travail.
- Vers une session : `CASES/*.expected.json` ne part jamais (spec §3), pas plus que ce journal.

## 5. La preuve que le framework est intact

Deux relevés, avant et après chaque run :

```text
git -C /home/giak/projects/framework rev-parse --short HEAD
git -C /home/giak/projects/framework status --porcelain
```

Depuis l'[ADR-021](../DECISIONS.md) (variante A, 2026-10-16), la même commande se relève aussi **en
clôture de toute séance capable d'écrire**, et son écart va au `Vérifié` de la séance : c'est le seul
contrôle qui attrape la classe des deux incidents de `13:0x` et `13:34`, nés hors run. Il constate, il ne
prévient pas : une dérive réparée avant le relevé ne laisse rien à lire.

Relevé **avant** (2026-10-15, 13:18) : HEAD `fe48de12` ; porcelain, 2 lignes — `?? .freebuff/` et
`?? aidd_docs/MEGA-PROMPT-TEST-AIDD-v6.md`. La paire identique est la preuve ; le relevé dit aussi ce
qu'elle ne couvre pas, puisque ces deux lignes préexistaient à tout run et ne viennent pas du
dispositif : `.freebuff/` est écrit par le client, et la copie non suivie du méga-prompt est une
copie périmée laissée hors de ma portée (arbitrage `4bb23eec`).

**Relevé de clôture du 2026-10-16** (le geste de l'ADR-021, variante A), fait avant d'écrire le bilan
du projet : origine `fe48de12`, porcelain **les deux mêmes lignes** ; terrain `416ec1f`, une ligne,
`?? .freebuff/`. Aucune ligne nouvelle : rien de ce que le dispositif a écrit ce jour n'a touché ces
deux arbres.

## 6. La preuve qu'aucun fichier du dispositif n'appartient au framework

**La clause du v6 §10 est réparée** (ADR-014, 2026-10-15) : elle se mesure en **paires chemin +
contenu**, ni par le chemin seul ni par le contenu seul. Les trois relevés qui l'ont fait trancher
restent ci-dessous, à leur place.

**1. Par chemin seul, la clause d'origine tombait.**

```text
LC_ALL=C comm -12 <(git -C /home/giak/projects/framework ls-files | LC_ALL=C sort) \
                  <(git -C /home/giak/projects/aidd-device ls-files | LC_ALL=C sort)
→ AGENTS.md
→ README.md
```

Deux dépôts qui portent chacun leur page d'entrée partagent ces deux noms par convention, sans
qu'aucun fichier appartienne à l'autre. Écrit tel quel, « intersection vide » entre deux
`git ls-files` est insatisfiable — et il le serait pour tout dépôt ayant un `AGENTS.md` et un
`README.md`. Ce ne sont pas les mêmes fichiers : `sha256` framework `499b6a99…` contre dispositif
`030506ef…` (`AGENTS.md`) ; `aae97f91…` contre `9920d7e1…` (`README.md`) — empreintes prises à la
révision **commitée**, celle que porte l'index, qui est la base du relevé 3. Le `README.md` du
dispositif a changé depuis (ADR-013 : 14 octets, 1 242 à l'arbitrage du foyer, `cadb364d…`), ce qui
rend le désaccord plus net et ne change pas le verdict.

**2. Par contenu seul, elle ne décide pas davantage.** L'intersection des empreintes est vide, mais
ce n'est pas un contrôle :

```text
( cd /home/giak/projects/framework  && git ls-files -z | xargs -0 sha256sum | awk '{print $1}' | LC_ALL=C sort -u ) > /tmp/f.sha
( cd /home/giak/projects/aidd-device && git ls-files -z | xargs -0 sha256sum | awk '{print $1}' | LC_ALL=C sort -u ) > /tmp/d.sha
LC_ALL=C comm -12 /tmp/f.sha /tmp/d.sha | wc -l                                        → 0
```

2 556 empreintes distinctes côté framework, 11 côté dispositif, 0 commune — et cette intersection se
casserait au premier fichier vide écrit d'un côté sans qu'aucun fichier n'appartienne à l'autre : le
framework en suit **13** (`e69de29b…`). Même contenu n'est pas même fichier.

**3. Par paire chemin + contenu, elle décide.** Une paire identique est le même fichier, et c'est
l'appartenance même :

```text
cd /tmp
git -C /home/giak/projects/framework  ls-files -s | awk -F'\t' '{split($1,a," "); print a[2]"\t"$2}' | LC_ALL=C sort > f.pairs
git -C /home/giak/projects/aidd-device ls-files -s | awk -F'\t' '{split($1,a," "); print a[2]"\t"$2}' | LC_ALL=C sort > d.pairs
LC_ALL=C comm -12 f.pairs d.pairs | wc -l                                              → 0
```

2 599 paires côté framework, 11 côté dispositif, **0 commune** : aucun fichier suivi du dispositif
n'est un fichier suivi du framework. Les deux chemins partagés y portent un autre contenu, et les
neuf autres chemins du dispositif n'existent pas chez l'origine. Par chemin absolu, les 11 fichiers
du dispositif vivent tous sous `/home/giak/projects/aidd-device`, aucun sous l'origine.

**Remesuré le 2026-10-16** : 2 599 paires côté framework, **42** côté dispositif, **0 commune** — le
nombre de fichiers suivis du dispositif a quintuplé, le verdict ne bouge pas.

## 7. La révision du dispositif

```text
git -C /home/giak/projects/aidd-device rev-parse --short HEAD   → 64901e3   (branche main, relevé du 2026-10-16)
git -C /home/giak/projects/aidd-device ls-files | wc -l         → 42
```

**Relevé du 2026-10-16** : 42 fichiers suivis. Les preuves et les pages de la journée sont entrées au
dépôt par `64901e3` ; ce qui n'était pas encore commité au moment de ce relevé, `git status --porcelain`
le nomme.

Relevé du 2026-10-15, 15:13, après la réparation de la clause (§6) ; 11 fichiers suivis alors, et
l'arbre modifié :

```text
git -C /home/giak/projects/aidd-device status --porcelain              → 8 lignes
   6 « M » (README.md, docs/DASHBOARD.md, docs/DECISIONS.md, docs/PFD.md,
            docs/brainstorm/MEGA-PROMPT-TEST-AIDD-v6.md, docs/trace.md)
   2 « ?? » (docs/device/, docs/tasks/)
find docs/device docs/tasks -type f                                    → 4 fichiers
   DEVICE.md 895 mots · BOUNDARY.md 1 383 mots · CASES/<cas>.request.md 1 196 mots
   docs/tasks/2026_10/2026-10-15-130103-run-par-session-operateur/…-spec.md
```

Les trois pages de `docs/device/` étaient alors écrites mais pas commitées : elles porteront le compte à
**14**. La séance a été commitée depuis : le compte est passé à **18** et `status --porcelain` ne rend
plus rien (relevé du même jour, `39750fe`). Le terrain, relevé le même jour à 13:18 : HEAD `416ec1f`, `ls-files` 307, porcelain 1
ligne — `?? .freebuff/`, écrit par le client dans un arbre déclaré read-only, laissé en place
(ADR-011).

## 8. Ce que ce fichier ne prouve pas

- C'est un relevé, pas une garantie : l'intersection des paires vaut pour ces deux révisions, et une
  révision du framework qui écrirait un fichier du dispositif la casserait.
- Le contrôle porte sur les fichiers **suivis** : les artefacts non commités du dispositif
  (`docs/device/`, `docs/tasks/` aujourd'hui) n'entrent pas dans `git ls-files`. Ce qu'ils touchent
  est couvert autrement — un fichier du dispositif écrit dans l'arbre du framework apparaîtrait dans
  la paire de `porcelain` du §5, relevée avant et après chaque run.
- L'intégrité du framework **pendant** un run n'est prouvée que par la paire `porcelain` relevée à ce
  moment-là, pas par cette page.
- Le `?? .freebuff/` du terrain et la copie périmée du v6 chez l'origine restent, nommés et non
  corrigés.
- Un artefact du dispositif peut atterrir **dans l'arbre de l'origine** sans que le dispositif l'ait
  écrit là : les outils de fichiers du client résolvent un **chemin relatif** contre la racine du
  projet du client, qui est le framework. Deux fois le 2026-10-15 (`docs/tasks` vers 13:0x,
  `docs/device/CASES` à 13:34), deux fois réparé à la main — jamais par le dispositif lui-même. La
  parade tenue est d'écrire en chemin absolu. Depuis le 2026-10-16, la paire de `porcelain` du §5 se
  relève aussi en clôture de toute séance capable d'écrire ([ADR-021](../DECISIONS.md), variante A) :
  la dérive est désormais **lue**, jamais empêchée ; un écart réparé avant le relevé ne laisse rien à
  lire, et rien dans le dépôt n'empêche l'écriture, seulement son silence. Le volet reçu de l'ADR-021
  (variante B) n'a pas été retenu : un arbre voisin déplacé **pendant** un run n'a encore jamais été
  constaté.
