---
name: REPLAY — rejouer le gel depuis un clone neuf
description: La recette qu'un inconnu suit pour rejouer le gel d'un cas sans réécrire un chemin, ce qu'elle prouve, et les limites qu'elle ne franchit pas
type: replay
status: in-progress
question: Comment rejouer un gel depuis un clone neuf ?
---

# REPLAY — rejouer le gel depuis un clone neuf

> Pour qui n'a ni la machine de l'auteur ni ses chemins. La formule est celle du §5.3 de la
> [spec du run](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-130103-spec.md),
> écrite aussi au §1.1 de la [conduite](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md)
> pour l'opérateur — qui, lui, connaît le cas et ses racines. Ici, rien n'est connu d'avance : tout
> vient du gel. Les sorties citées ont été observées le 2026-10-15 ; celles du §3, depuis le clone
> public, le 2026-10-17.

## 1. Ce que la recette établit, et ce qu'elle n'établit pas

| Vérifiable depuis un clone | Par quoi |
| --- | --- |
| les deux fichiers du cas (demande, attendu) | leur `sha256`, contre le gel |
| les huit références du framework | hachées dans un checkout de la révision gelée |
| l'empreinte globale | recalculée sur les dix lignes du §5.3, contre `empreinte` |
| le `HEAD` de chaque arbre | contre les branches publiques que le gel nomme (`arbres[].refs_distants`) |

| Non vérifiable, et pourquoi |
| --- |
| le `porcelain` gelé : ses fichiers non suivis (`.freebuff/`, la copie périmée du v6) n'entrent dans aucun commit |
| les dates de **naissance** des fichiers : git ne les transporte pas — un clone date tout à l'heure du clone |
| l'instant `gele_le` : déclaré par le gel ; git ne borne que l'entrée au dépôt du gel publié (commit `6789bec`, `22:30:28`) |
| l'état non commité du dispositif : un clone ne reçoit que ce qui est poussé |

Rien de tout cela ne dit qu'un **run** a eu lieu : la recette porte sur le gel, et ce qu'un run laisse
se lit au §5, qui n'est pas sa question. Ce que la recette établit, c'est que le texte scellé est bien
celui qu'un tiers peut relire, et que rien ne l'a déplacé depuis.

## 2. La recette

Tout se fait dans un dossier jetable, hors de tout arbre connu. Elle ne réécrit aucun chemin : elle
lit le cas, la révision et les dépôts **dans le gel**.

```bash
set -euo pipefail
D=/tmp/gel-verif              # dossier jetable, recréé à chaque essai
rm -rf "$D"; mkdir -p "$D"; cd "$D"

# 1. le dispositif public, et le cas gelé qu'il porte
git clone --quiet https://github.com/giak/aidd-device.git dispositif
cd dispositif
CAS=$(basename "$(ls -1 docs/device/CASES/*.freeze.json | head -1)" .freeze.json)
echo "cas gelé : $CAS"

# 2. l'arbre des références : le gel dit sa révision
REV=$(python3 -c "
import json; g=json.load(open('docs/device/CASES/$CAS.freeze.json'))
a=[x for x in g['arbres'] if x['label']=='revision-sous-test'][0]
print(a.get('head_complet') or a['head'])")
echo "arbre des références à $REV"
git clone --quiet --filter=blob:none --no-checkout https://github.com/ai-driven-dev/framework.git ../fw
git -C ../fw checkout --quiet "$REV"

# 3. la formule, puis les quatre arbres, relus depuis le gel
RACINE_FRAMEWORK=$PWD/../fw python3 - "$CAS" <<'PY'
import hashlib, json, os, subprocess, sys
RACINE, CAS = os.getcwd(), sys.argv[1]
FR = os.environ["RACINE_FRAMEWORK"]
g = json.load(open(os.path.join(RACINE, "docs/device/CASES", CAS + ".freeze.json")))
sha = lambda p: hashlib.sha256(open(p, "rb").read()).hexdigest()
arbres = {a["label"]: a for a in g["arbres"]}
lignes, ok = [], []

# Un gel d'avant l'ADR-016 écrit des chemins absolus : depuis un clone, ils ne désignent
# rien. Le dire, plutôt que de rendre deux `False` qui accuseraient les mauvais fichiers.
if any(os.path.isabs(f["chemin"]) for f in g["fichiers"]):
    print("gel d'avant l'ADR-016 : des chemins absolus y sont écrits (fichiers[].chemin),")
    print("donc un clone ne peut pas le rejouer sans réécrire ces chemins — c'est ce que")
    print("l'ADR-016 a réparé.")
    sys.exit(3)

for f in g["fichiers"]:
    h = sha(os.path.join(RACINE, f["chemin"]))
    lignes.append(f'{f["role"]}\t{os.path.basename(f["chemin"])}\t{h}')
    ok.append(h == f["sha256"]); print("fichier  ", f["role"], h == f["sha256"])

for label in sorted({r["arbre"] for r in g["references"]}):
    complet = subprocess.run(["git", "-C", FR, "rev-parse", "HEAD"], capture_output=True, text=True).stdout.strip()
    attendu = arbres[label].get("head_complet") or arbres[label]["head"]
    ok.append(complet.startswith(attendu))
    print("arbre    ", label, "HEAD", complet[:8], "gelé", attendu[:8], complet.startswith(attendu))

for r in g["references"]:
    h = sha(os.path.join(FR, r["chemin"]))
    lignes.append(f'reference\t{r["chemin"]}\t{h}')
    ok.append(h == r["sha256"]); print("reference", r["chemin"], h == r["sha256"])

for label, a in arbres.items():
    distants = a.get("refs_distants") or []
    if not distants:
        print("arbre    ", label, "publié nulle part : non vérifiable depuis ici"); continue
    url = next((r["url"] for r in a.get("remotes", []) if r["nom"] == distants[0].split("/")[0]), "")
    if not url or not url.startswith("http"):
        print("arbre    ", label, "dépôt public inconnu du gel (", url or "aucun remote", ") : non vérifiable depuis ici"); continue
    for d in distants:
        nom, _, ref = d.partition("/")
        sortie = subprocess.run(["git", "ls-remote", url, "refs/heads/" + ref], capture_output=True, text=True).stdout.split()
        if sortie and sortie[0].startswith(a["head_complet"]):
            print("arbre    ", label, "publié sur", ref, True); ok.append(True); break
    else:
        print("arbre    ", label, "publié mais aucun ref ne porte le HEAD gelé :", False); ok.append(False)

emp = hashlib.sha256(("\n".join(sorted(lignes)) + "\n").encode()).hexdigest() == g["empreinte"]
print("empreinte", emp)
print("VERDICT  ", "gel rejoué à l'identique" if all(ok) and emp else "GEL CADUC — ne pas s'y fier")
sys.exit(0 if all(ok) and emp else 1)
PY
```

## 3. Ce que la recette rend, mesuré

**Le gel publié, au 2026-10-17.** `origin/main` porte le gel d'après l'ADR-016 et l'ADR-019 : empreinte
`0d9a2180c0f1251f785727d726d446d4fa9387331143c35cca5a701b678204e8`, `gele_le`
`2026-10-15T22:11:24.782242943+0200`, `fichiers[].chemin` **relatifs**, `racine_espace_de_travail`
déclarée. Il est entré au dépôt par `6789bec` (`2026-10-15T22:30:28+02:00`), et le fichier publié est
**octet pour octet** celui du dépôt local (`sha256`
`d50ee0ab7b71bd0f2c3fb9db0012907ed1a022ff234207adc91f3c38fce33a44`). Les deux gels d'avant —
`bc126fe6`, chemins absolus, puis `07246039` — ne sont plus ce qu'un clone reçoit.

**Depuis un clone neuf, le 2026-10-17** : le bloc du §2 tel quel, sans ligne ajoutée ni fichier déposé
à la main, rejoué depuis `/tmp/gel-verif` sur un clone dont le `HEAD` était alors `a8eabca` — les
commits non poussés à cet instant ne touchaient pas le cas → `exit 0` :

```text
cas gelé : 2026-10-15-133423-promesse-memoire-avant-ecriture
arbre des références à 4c39e5c59f54b9b34b51af3ee552dbfb8dfb6651
fichier   attendu True
fichier   demande True
arbre     revision-sous-test HEAD 4c39e5c5 gelé 4c39e5c5 True
reference plugins/aidd-context/skills/02-project-memory/SKILL.md True
reference plugins/aidd-context/skills/02-project-memory/actions/01-scan.md True
reference plugins/aidd-context/skills/02-project-memory/actions/02-write.md True
reference plugins/aidd-context/skills/02-project-memory/assets/scan-summary.md True
reference plugins/aidd-context/skills/02-project-memory/references/memory-destinations.md True
reference plugins/aidd-context/skills/02-project-memory/references/structure.md True
reference plugins/aidd-context/skills/02-project-memory/references/memory-rules.md True
reference plugins/aidd-context/skills/02-project-memory/references/reading-sources.md True
arbre     framework-origin publié sur gel/2026-10-15-fe48de12 True
arbre     terrain publié sur main True
arbre     revision-sous-test dépôt public inconnu du gel ( /home/giak/projects/framework ) : non vérifiable depuis ici
arbre     travail dépôt public inconnu du gel ( /home/giak/projects/audio-sync-tool ) : non vérifiable depuis ici
empreinte True
VERDICT   gel rejoué à l'identique
→ exit 0
```

**Le garde-fou du §2 est toujours là, et il ne mord plus sur le gel publié.** Sa branche d'arrêt reste
écrite pour un gel d'avant l'ADR-016 ; éprouvée le 2026-10-17 sur `bc126fe6` (commit `c925604`), hors du
clone, elle rend ses trois lignes et son code :

```text
gel d'avant l'ADR-016 : des chemins absolus y sont écrits (fichiers[].chemin),
donc un clone ne peut pas le rejouer sans réécrire ces chemins — c'est ce que
l'ADR-016 a réparé.
→ exit 3
```

C'est un résultat, pas une panne : la recette **dit** qu'elle ne peut pas rejouer ce gel-là, au lieu
de rendre deux `False` qui accuseraient les mauvais fichiers. Le gel publié, lui, ne la déclenche pas.

Un seul `False` suffit à faire tomber le gel : dans ce cas la recette sort en `1` et son dernier mot
est **GEL CADUC**. Les deux lignes « dépôt public inconnu du gel » disent une limite du gel, pas une
panne de la recette : voir §4.

## 4. Les quatre arbres, et où un inconnu les retrouve

| Label du gel | `HEAD` gelé | Où le trouver | Vérifié par la recette ? |
| --- | --- | --- | --- |
| `framework-origin` | `fe48de12` | `github.com/giak/framework`, branche `gel/2026-10-15-fe48de12` ([ADR-017](DECISIONS.md)) | oui, par `ls-remote` sur le ref que le gel nomme |
| `terrain` | `416ec1f` | `github.com/giak/audio-sync-tool`, `main` | oui, de même |
| `revision-sous-test` | `4c39e5c5` | `github.com/ai-driven-dev/framework`, où l'étape 2 le prend : il n'est la pointe d'aucune branche, mais 83 la contiennent ; le **chemin** de la copie est dérivé de `racine_espace_de_travail` (ADR-019) | oui, par le checkout de l'étape 2 — mais pas par `ls-remote` : ses `remotes` dans le gel pointent un chemin **local** |
| `travail` | `416ec1f` | même commit que `terrain` ; ses `remotes` dans le gel sont locaux eux aussi, et son chemin est dérivé de la même racine | non : ni par le gel, ni par un clone |

## 5. Les limites, nommées

- **Le `porcelain` gelé ne se reconstitue pas.** Il liste des fichiers non suivis ; aucun commit ne les
  porte. Un tiers constate l'état suivi, jamais l'autre.
- **La naissance ne voyage pas.** `git` ne transporte pas la date de naissance d'un fichier : la
  condition 1 du §5 (un produit né avant le gel) ne se vérifie que sur la machine qui a produit.
- **Le `porcelain` des copies est local.** `revision-sous-test` et `travail` sont des copies ; leurs
  `remotes` gelés sont des chemins de cette machine (`/home/giak/…`). La recette le dit à voix haute
  plutôt que de faire semblant.
- **`gele_le` est déclaré.** Le gel porte l'instant du scellé ; ce qu'un tiers peut opposer, c'est la
  date d'entrée au dépôt (`git log --format=%cI` sur le `.freeze.json`), qui la borne.
- **La racine est un fait de la machine qui gèle.** `racine_espace_de_travail` dit où cette machine
garde ses espaces de travail, et les deux copies du cas en sont dérivées ; le **cas**, lui, ne nomme
plus aucun chemin de machine ([ADR-019](DECISIONS.md)) : un tiers déclare la sienne au gel suivant,
sans réécrire un octet du cas gelé.
- **La recette ne juge pas la qualité du cas.** Elle dit que le texte scellé est intact, jamais qu'il
  est bien écrit, ni que l'attendu est juste.
- **Rien de ceci n'atteste un run.** La recette porte sur le gel : elle dit que le texte scellé est
  intact, jamais qu'une session l'a ouvert, et aucune empreinte ne porte les pièces d'un run. Un run a
  pourtant eu lieu le 2026-10-15 (`17:15:59`–`17:29:51`, verdict `non concluant`, aucun produit —
  [PV](device/runs/2026-10-15-171559-4c39e5c5-1d471a5/PV.md)) et ses pièces sont publiées avec le reste :
  `trace/echange-1.txt` (34 609 o), `trace/session-ses_ebfdd6595ffentQru7gA9UPLSc.json` (161 022 o),
  `faits.json`, `veille-etat.txt`. Ce que la recette n'en dit pas : le moindre mot, et c'est voulu.
  Ce run n'a laissé ni `receipt.json` ni `output.json`, antérieur au chemin sans produit (spec §9).

## 6. La version de l'opérateur

Le §1.1 de la [conduite](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md)
porte la même formule dans sa variante d'avant l'ouverture de session : elle connaît le cas et les
racines de cette machine, et elle sert à vérifier que le gel tient avant d'ouvrir. C'est la même
formule à deux jeux de paramètres, pas deux vérités.

## 7. Le cas jouet, et comment le reconstruire

`CASES/` porte un second cas, **jouet** ([ADR-036](DECISIONS.md)) : `2026-10-18-085308-cas-jouet`,
deux pièces qui tiennent sur une page, et des arbres qui ne se clonent nulle part — ils se
**reconstruisent** :

```text
bash docs/device/CASES/2026-10-18-085308-cas-jouet-arbres.sh "$RACINE"
```

Le script crée `$RACINE/<cas>/origine/{framework,terrain}` (deux dépôts de deux fichiers, un commit à
date, auteur et commiteur figés), puis les deux copies détachées `$RACINE/<cas>/{framework-origin,terrain}`,
`origin` pointant le chemin local. Il imprime les deux `--arbre` à recopier et les têtes ; deux exécutions
dans deux bacs rendent **les mêmes têtes** (`1b3b632a…` et `62c48e16…`), ce que le contrôle 119 éprouve, et
un bac déjà peuplé est refusé (120). Le gel du dépôt porte `empreinte 27fb38ab` depuis le re-gel du
2026-10-22 ([ADR-060](DECISIONS.md) ; il portait `50664060` puis `ea4523ef`), **zéro référence**, et
`refs_distants` **vide** sur ses deux origines : le cas est publié nulle part, et cette page est la réponse
à « où le retrouver ». Le banc le reconstruit et le re-gèle dans son bac jetable, puis traverse la chaîne
entière sur lui (contrôles 119 à 130, [BANC](BANC.md) §4) — ce gel-là est celui qu'il éprouve, et il
compare son empreinte à celle du gel committé. Aucune session n'ouvre ce cas : son budget de deux échanges
est intact, et il est fait pour le banc et pour le guide, pas pour un run.

## 8. Rejouer un export de trace, selon le client

Le reçu ne recopie pas une commande : il la reconstruit et rejoue l'export par `harness/clients.mjs`.
La même recette vaut pour les deux clients, à la source près.

- **Freebuff** : `sqlite3 -readonly <desktop-v2.db> "<requête du §1.5>"`, puis comparaison octet à
  octet avec `trace/echange.jsonl`. La base est relue, le fil doit y être, et `trace.base` la nomme.
- **opencode** : `opencode session export <id>` dans `trace.cwd`, JSON normalisé en JSONL par
  l'adaptateur, puis comparaison du `sha256` normalisé. L'export brut (`trace/export_brut`) est haché
  et conservé ; s'il diffère au rejeu, le reçu écrit la limite `export_brut_instable`, jamais un refus :
  `info.time.updated` et les jetons bougent quand la session bouge (ADR-046). `trace.store` doit exister,
  `trace.cwd` doit résoudre au `travail` du gel, et un JSONL modifié après l'export est refusé.

Depuis l'ADR-051, le JSONL normalisé porte `commande` sur chaque ligne `tool` : un export produit avant
ce champ ne rend plus les mêmes octets au rejeu, donc un reçu ancien n'est pas rejoué, il reste la pièce
datée de son run (§6, ADR-051). Une ligne `shell` sans `commande` — trace ancienne, ou outil qui n'en
donnera jamais — produit `shell_non_interpretable` motif « commande absente » et la limite
`shell_sans_commande` : le scan ne suppose pas l'absence d'effet.

Les contrôles 154 à 171 ([BANC](BANC.md) §4) éprouvent cette recette sur un faux `opencode` et des fixtures :
ils prouvent l'adaptateur, pas le CLI réel.
