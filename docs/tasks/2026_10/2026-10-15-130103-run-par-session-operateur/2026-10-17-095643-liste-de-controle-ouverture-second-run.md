---
name: Liste de contrôle — l'ouverture du second run
description: Ce qui a été vérifié le 2026-10-17 sur la copie du cas, les contrôles qui restent à passer au moment du geste, la commande de chacun et la valeur attendue, et les deux choses que la conduite §1.7 annonçait faussement
type: checklist
status: in-progress
---

# Liste de contrôle — l'ouverture du second run

> V0.1 — 2026-10-17, née à 09:56:43 (`stat -c %w`). Elle ne remplace ni la
> [conduite](2026-10-15-154303-run.md), ni la [spec](2026-10-15-130103-spec.md) : elle range, dans l'ordre
> du geste, ce qui se vérifie avant, pendant et juste après l'ouverture, avec la sortie attendue de chaque
> contrôle. Ce qui a déjà été mesuré l'est daté ; ce qui ne pourra l'être qu'à l'ouverture est dit tel.

## 1. Ce que l'état dit, avant tout geste

L'ouverture a **commencé** le 2026-10-17, hors du dépôt : le client Freebuff a créé un projet sur la copie
du cas à `09:50:56` (`stat -c %w` de `terrain/.freebuff/project-id`) et une note pour l'opérateur a été
écrite à `09:52:23` (`$W/mode-d-emploi.md`, citée ci-dessous). **Aucun fil n'est ouvert** : `threads` et
`messages` comptent **0** ligne, la base du projet pèse 188 416 octets. Aucune séance du journal ne
consignait ces deux gestes ; c'est cette liste qui les nomme, et la Séance 28 du journal qui les date.

`$W` = `/home/giak/projects/aidd-device-work/2026-10-15-133423-promesse-memoire-avant-ecriture`.

## 2. L'état mesuré de la copie du cas (2026-10-17)

| Ce qui est affirmé | Commande | Résultat observé |
| --- | --- | --- |
| la porte autorise ce dossier | `node docs/device/harness/run.mjs preflight --case <cas> --repertoire $W/terrain --texte $W/texte-a-remettre.txt` | `ouverture autorisée dans …/terrain (HEAD 416ec1f, porcelain 0 ligne(s)) ; gel 0d9a2180 re-haché, 2 fichier(s) du cas et 8 référence(s) ; texte 832036f7 (254 octets) conforme au §5 substitué` — **`exit 0`** |
| le gel tient, hors du harnais | la formule du §1.1, `RACINE_FRAMEWORK=$W/framework-origin` | **11/11 `True`** (2 fichiers, 1 `HEAD` d'arbre, 8 références), `empreinte True` sur `0d9a2180…` — **`exit 0`** |
| le texte à remettre n'a pas bougé | `sha256sum $W/texte-a-remettre.txt` | `832036f7…` · **254** octets, mtime 2026-10-15 22:15 |
| le texte que l'opérateur lira est le même | bloc `text` de `$W/mode-d-emploi.md`, comparé octet à octet | **254** octets, `832036f7…`, identique (`True`) |
| le projet pointe la copie, pas un autre arbre | `select id, root_path, default_branch from projects` | `root_path` = `$W/terrain` ; `default_branch` = `origin/test/aidd-installation` (relevé du client, non vérifié contre le remote) |
| aucun fil, donc aucun worktree | `select count(*) from threads` ; `git -C $W/terrain worktree list` | **0** fil ; une seule entrée, `…/terrain 416ec1f (detached HEAD)` |

Les quatre arbres, `rev-parse --short HEAD` + `status --porcelain` :

| Arbre | `HEAD` | `porcelain` |
| --- | --- | --- |
| `/home/giak/projects/framework` | `fe48de12` | 2 lignes |
| `/home/giak/projects/audio-sync-tool` | `416ec1f` | 1 ligne |
| `$W/framework-origin` | `4c39e5c5` | 0 ligne |
| `$W/terrain` | `416ec1f` | **0 ligne** |

Le `HEAD` de la copie est **détaché** : c'est l'état gelé. Une session qui la mettrait sur une branche
déplacerait le `HEAD` et sortirait du gel.

## 3. Ce que la conduite §1.7 annonçait, et qui est faux

Le §1.7 disait : « le `.gitignore` d'`audio-sync-tool` **n'ignore pas** `.freebuff/` : une session ouverte
sur `$W/terrain` y laissera donc une ligne, `?? .freebuff/` ». **Le fait mesuré le contredit.** La copie
porte `.freebuff/` à la **ligne 7 de son `.git/info/exclude`** (mtime 2026-10-15 21:44), que le §1.7 n'a
pas lu ; le marqueur `project-id` existe depuis le 2026-10-17 09:50:56 et le `porcelain` reste à **0
ligne**. La paire avant/après de l'ADR-021 est donc **0 → 0** pour `terrain`, et la preuve que le client a
ouvert le bon arbre n'est pas une ligne de git : c'est le contenu du marqueur, comparé à l'identifiant du
projet.

Ce même `info/exclude` n'est pas celui de l'original : 7 lignes contre 48, les exclusions Kilo de
`/home/giak/projects/audio-sync-tool` n'y sont plus. L'écart date du 2026-10-15 21:44 et n'était consigné
nulle part. Il ne change ni `HEAD` ni `porcelain`, donc le gel ne le voit pas ; il change ce que la copie
ignore.

## 4. Le geste, dans l'ordre

**4.1 Ouvrir un fil neuf, vide, en mode direct.** Ni worktree, ni branche, ni « reprendre un fil ».

**4.2 Vérifier le fil avant de coller.** Rien ne part avant cette ligne :

```text
DB=~/.config/freebuff-desktop/projects/terrain-38d8d3f1-9054-4a79-bdbf-bf83b651ad6c/desktop-v2.db
sqlite3 -readonly -separator $'\t' "$DB" \
  "select id, project_path, execution_mode, coalesce(branch,''), coalesce(worktree_path,''),
          harness_id, model from threads;"
```

Attendu : **une** ligne, `project_path` = `$W/terrain`, `execution_mode` = `local`, `branch` et
`worktree_path` **vides**. Toute autre valeur arrête le geste : le fil est à fermer et à rouvrir. Accolée,
`git -C $W/terrain worktree list` doit rendre **une** ligne, celle du §2.

**4.3 Coller le texte du §5, mot pour mot.** Source : `$W/mode-d-emploi.md`, bloc unique, 254 octets,
`832036f7…`. Il ne se retape pas. Le budget est de **trois messages** au total.

**4.4 Vérifier le premier maillon dès le collage.** Le texte stocké par le client est le texte reçu :

```text
sqlite3 -readonly "$DB" "select json_extract(parts_json,'\$[0].text') from messages
  where thread_id='<thread>' and role='user' order by seq limit 1;" > /tmp/sonde/remis.txt
sha256sum /tmp/sonde/remis.txt "$W/texte-a-remettre.txt"
```

Deux fois `832036f7…` : ce que l'opérateur a collé et ce qui est stocké sont le même octet-à-octet. Une
différence se dit dans le témoignage, elle ne se corrige pas par un second collage.

**4.5 À la fin, dans cet ordre.** (1) `date -Is` ; (2) **l'export de la trace**, avant tout autre geste
(commande du §1.5, `$RUN/trace/echange.jsonl`) ; (3) rien dans `terrain` : ni fichier créé, ni supprimé, ni
`.freebuff/` touché. Le chemin de ce fichier se recopie dans `faits.trace.chemin_exporte` (§4.7). Depuis
l'[ADR-025](../../../DECISIONS.md), un **dossier** de trace absent est refusé (`exit 1`) ; un fichier absent
sous un dossier présent reste une **limite** « trace machine introuvable », et la pièce (1) manque sans que
personne ne l'ait vu — c'est cette limite-là qu'il faut lire au reçu.

**4.6 Le dossier du run.** Nommé à l'ouverture, révisions du gel :

```text
RUN=/home/giak/projects/aidd-device/docs/device/runs/$(date +%Y-%m-%d-%H%M%S)-4c39e5c5-$(git -C /home/giak/projects/aidd-device rev-parse --short HEAD)
mkdir -p "$RUN"
```

La seconde révision nomme ce qui a produit la sortie : elle ne couvre que du commité. Un fichier modifié
après le commit qu'elle cite n'est pas nommé par elle — le reçu doit le dire plutôt que de laisser croire
l'inverse.

**4.7 Puis `collect`, `receipt`, `compare`.** L'ordre et les champs sont ceux de la
[conduite](2026-10-15-154303-run.md) §3 ; cette liste ne les recopie pas, mais elle nomme les cinq gestes
que la conduite dit et qu'un opérateur saute quand il suit la liste seule — chacun éprouvé le 2026-10-17
([répétition à blanc](2026-10-17-100609-repetition-a-blanc-de-l-ouverture.md)) :

1. **`faits.json`, écrit à chaud, par le harnais** ([ADR-024](../../../DECISIONS.md)) :

   ```text
   node docs/device/harness/run.mjs faits --case <cas> --base <desktop-v2.db> \
     --fil <fil> --trace "$RUN/trace/echange.jsonl" --out "$RUN/faits.json" \
     --par <qui> --fin "$(date -Is)" --temoignage '<texte>'
   ```

   Elle dérive de la base et du gel les champs du §1.4 (`session`, `horodatage_debut`, le répertoire de
   travail, la trace) et refuse un fil inconnu, un modèle vide, un chemin qui ne résout pas, un fil hors
   de l'arbre `travail`, un fil en worktree, une fin antérieure au début, et un `faits.json` déjà écrit.
   `--par`, `--fin` et `--temoignage` sont les trois faits que seule une personne donne : la commande ne
   les invente pas.
2. **`collect`, et ses deux branches.** Un produit : `collect --run "$RUN" --case "$CAS" --from
   "$W/terrain/aidd_docs"`. Aucun produit — le cas du premier run : `collect … --sans-produit`.
   L'autre branche refuse, donc sans elle `receipt` et `compare` refusent aussi.
3. **`last-message.md`**, à la main, sous `raw/$CAS/`, verbatim.
4. **`receipt`, une seule fois, pendant le run.** Il refuse d'écraser un reçu existant : un reçu
   reconstruit est un témoignage. Son `--verdict` est **contraint par les falsificateurs** — toute autre
   valeur que `non concluant` est refusée quand l'un mord.
5. **`compare`, par le juge, sur le reçu seul.** Il refuse `ecart` quand le reçu dit `non concluant`, et
   n'écrit jamais deux fois le même `output.json`.

Le contrôle de clôture des quatre arbres (ADR-021, BOUNDARY §5) attend **0 → 0** pour `terrain`, et les
deux lignes de l'origine inchangées.

## 5. Ce que cette liste ne prouve pas

- **Rien du candidat** : aucun fil n'est ouvert, aucune promesse n'est testée. Un projet créé n'est pas une
  session.
- **Le mode direct avant l'ouverture** : il se lit dans la ligne du fil, donc **après** l'ouverture (§4.2).
  Le client ne l'expose pas avant.
- **Le `default_branch` relevé par le client** (`origin/test/aidd-installation`) : aucune commande de cette
  liste ne l'a comparé au remote ; il n'entre dans aucune décision du run.
- **Le `info/exclude` de la copie** : il est nommé, pas expliqué. Personne n'a consigné qui l'a écrit le
  2026-10-15 21:44, et cette liste ne l'invente pas.
- **L'écriture hors racine** : la sonde du §1.7 n'a mesuré que la lecture.
