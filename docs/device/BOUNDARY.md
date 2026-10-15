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
| révision sous test | un répertoire jetable, hors des quatre arbres | copie d'une révision de l'origine ; paramètre de run, jamais une constante |
| terrain | `/home/giak/projects/audio-sync-tool` | lu, **jamais** écrit ; copie de travail par run |
| le dispositif | `/home/giak/projects/aidd-device` | le seul arbre que le dispositif écrit |

Tout ce qui exécute tourne dans un répertoire jetable, hors de ces arbres.

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

Relevé **avant** (2026-10-15, 13:18) : HEAD `fe48de12` ; porcelain, 2 lignes — `?? .freebuff/` et
`?? aidd_docs/MEGA-PROMPT-TEST-AIDD-v6.md`. La paire identique est la preuve ; le relevé dit aussi ce
qu'elle ne couvre pas, puisque ces deux lignes préexistaient à tout run et ne viennent pas du
dispositif : `.freebuff/` est écrit par le client, et la copie non suivie du méga-prompt est une
copie périmée laissée hors de ma portée (arbitrage `4bb23eec`).

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

## 7. La révision du dispositif

```text
git -C /home/giak/projects/aidd-device rev-parse --short HEAD   → d02b750   (branche main)
git -C /home/giak/projects/aidd-device ls-files | wc -l         → 11
```

11 fichiers suivis. Relevé du 2026-10-15, 15:13, après la réparation de la clause (§6) :

```text
git -C /home/giak/projects/aidd-device status --porcelain              → 8 lignes
   6 « M » (README.md, docs/DASHBOARD.md, docs/DECISIONS.md, docs/PFD.md,
            docs/brainstorm/MEGA-PROMPT-TEST-AIDD-v6.md, docs/trace.md)
   2 « ?? » (docs/device/, docs/tasks/)
find docs/device docs/tasks -type f                                    → 4 fichiers
   DEVICE.md 895 mots · BOUNDARY.md 1 383 mots · CASES/<cas>.request.md 1 196 mots
   docs/tasks/2026_10/2026-10-15-130103-run-par-session-operateur/…-spec.md
```

Les trois pages de `docs/device/` sont écrites mais pas commitées : elles porteront le compte à
**14**. Le terrain, relevé le même jour à 13:18 : HEAD `416ec1f`, `ls-files` 307, porcelain 1
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
  parade tenue est d'écrire en chemin absolu, et rien dans le dépôt ne la contrôle. La paire de
  `porcelain` du §5 le montrerait, mais elle le constaterait après coup : ce contrôle constate, il
  ne prévient pas.
