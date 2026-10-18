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
| la porte autorise ce dossier | `node docs/device/harness/run.mjs preflight --case <cas> --repertoire $W/terrain --texte $W/texte-a-remettre.txt` | `ouverture autorisée dans …/terrain (HEAD 416ec1f, porcelain 0 ligne(s)) ; gel 0d9a2180 re-haché, 2 fichier(s) du cas et 8 référence(s) ; texte 832036f7 (254 octets) conforme au §5 substitué` — **`exit 0`**. Mesuré le 2026-10-17 **avant** l'ADR-034 : la même commande sort aujourd'hui en `exit 2`, `--run` étant obligatoire, et son `gate.json` n'apparaît dans la sortie qu'avec lui. La commande d'aujourd'hui est au §4.0 |
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

**4.0 Le dossier du run et la porte, avant d'ouvrir.** — **Mise à jour du 2026-10-18, avant l'ouverture** :
deux portes ont été passées pour ce run, une seule est **celle du run**. La première, le 2026-10-18 à
`07:02:51` (`docs/device/runs/2026-10-18-070251-4c39e5c5-db61c44/gate.json`, `exit 0`, `gel 0d9a2180`, arbre
`416ec1f` `porcelain 0 ligne`, texte `832036f7` (254 o), HEAD du dispositif `db61c44`, l'arbre était propre)
précède H6 et est **remplacée** : elle garde sa note datée et ne reçoit aucune pièce du run
([ADR-037](../../../DECISIONS.md) : le dossier d'un run est la porte la plus récente passée pour son cas
avant le premier message). La porte du run est la seconde, passée le 2026-10-18 à `07:56:25` :
`docs/device/runs/2026-10-18-075625-4c39e5c5-dbd85ba/gate.json`, `exit 0`, mêmes gel, arbre et texte, HEAD
du dispositif `dbd85ba`. Relancer `preflight` sur ce dossier sort maintenant en `exit 1` (`existe déjà`) :
c'est le refus à éprouver, pas une panne. **Le dossier existe : le bloc ci-dessous ne sert qu'à un run neuf,
il ne se relance pas ici.** Depuis l'[ADR-034](../../../DECISIONS.md), le reçu
refuse un dossier de run sans `gate.json` : la porte se passe donc **avant** 4.1, dans le dossier du run, et
son instant doit précéder le premier message. Le nom est celui du §4.6, et le dossier ne se crée qu'ici :

```text
RUN=/home/giak/projects/aidd-device/docs/device/runs/$(date +%Y-%m-%d-%H%M%S)-4c39e5c5-$(git -C /home/giak/projects/aidd-device rev-parse --short HEAD)
mkdir -p "$RUN"
node /home/giak/projects/aidd-device/docs/device/harness/run.mjs preflight \
  --case 2026-10-15-133423-promesse-memoire-avant-ecriture \
  --repertoire $W/terrain --texte $W/texte-a-remettre.txt --run "$RUN"
```

Attendu : `preflight ok — … ; porte docs/device/runs/…/gate.json`, `exit 0`, et un fichier qui porte
`type: gate`, `cas`, `passe_le`, `repertoire`, `gel.empreinte` = `0d9a2180…`, `arbre.head_complet` = `416ec1fa…`,
`texte.sha256` = `832036f7…`. Un refus arrête tout : **rien ne s'ouvre**. Relancer la même commande sort en
`exit 1` (`existe déjà`) : une porte ne s'écrase pas, et c'est le premier refus que cette liste fait éprouver
sans ouvrir de session. `$W` est celui du §1.

> **Mesuré le 2026-10-18** ([répétition à blanc de la clôture](2026-10-18-083743-repetition-a-blanc-de-la-cloture.md)) :
> `--texte` compare les **octets** du fichier au §5 substitué, l'octet près — un saut de ligne final de trop
> fait refuser (« 256 octets reçus, 255 attendus »), et la longueur attendue dépend de la racine déclarée :
> elle se relève au gel par `wc -c` (254 sur la racine réelle), jamais retenue de mémoire. Le fichier
> `texte-a-remettre.txt` s'écrit donc **sans** saut de ligne final.

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

**4.3 Coller le texte du §5, mot pour mot.** Source : `$W/kit-ouverture.md` (§1, 254 octets,
`832036f7…`), qui remplace sur ce point `$W/mode-d-emploi.md` — celui-ci disait les trois premiers gestes
sans leurs commandes. Il ne se retape pas. Le budget est de **trois messages** au total.

**4.4 Vérifier le premier maillon dès le collage.** Le texte stocké par le client est le texte reçu :

```text
sqlite3 -readonly "$DB" "select json_extract(parts_json,'\$[0].text') from messages
  where thread_id='<thread>' and role='user' order by seq limit 1;" > /tmp/remis.txt
wc -c < /tmp/remis.txt                                         # attendu : 255
sha256sum <(head -c -1 /tmp/remis.txt) "$W/texte-a-remettre.txt"
```

Deux fois `832036f7…`, une fois `head -c -1` appliqué : `sqlite3` ajoute un saut de ligne à chaque ligne
sortie, d'où **255** octets pour un texte de **254**. La version antérieure de ce §4.4 annonçait deux
empreintes égales sans ce retrait : le premier fichier en aurait pesé 255, et son empreinte n'aurait pas
été `832036f7…` (mesuré le 2026-10-17 : 238 octets pour 237 de texte sur un message réel). Ce que
l'opérateur a collé et ce qui est stocké sont alors le même octet-à-octet. Une différence se dit dans le
témoignage, elle ne se corrige pas par un second collage.

**4.5 À la fin, dans cet ordre.** (1) `date -Is` ; (2) **l'export de la trace**, avant tout autre geste
(commande du §1.5, `$RUN/trace/echange.jsonl`) ; (3) rien dans `terrain` : ni fichier créé, ni supprimé, ni
`.freebuff/` touché. Le chemin de ce fichier se recopie dans `faits.trace.chemin_exporte` (§4.7). Depuis
l'[ADR-025](../../../DECISIONS.md), un **dossier** de trace absent est refusé (`exit 1`) ; un fichier absent
sous un dossier présent reste une **limite** « trace machine introuvable », et la pièce (1) manque sans que
personne ne l'ait vu — c'est cette limite-là qu'il faut lire au reçu.

**4.6 Le dossier du run.** Celui du **§4.0**, déjà créé et déjà porteur de sa porte : il ne se renomme pas
et ne se recrée pas à la clôture. Son nom mêle la révision du gel (`4c39e5c5`) et celle du dispositif qui
produit la sortie. La seconde révision nomme ce qui a produit la sortie : elle ne couvre que du commité. Un fichier modifié
après le commit qu'elle cite n'est pas nommé par elle — le reçu doit le dire plutôt que de laisser croire
l'inverse.

**4.7 Puis `collect`, `receipt`, `compare`.** L'ordre et les champs sont ceux de la
[conduite](2026-10-15-154303-run.md) §3 ; cette liste ne les recopie pas, mais elle nomme les cinq gestes
que la conduite dit et qu'un opérateur saute quand il suit la liste seule — chacun éprouvé le 2026-10-17
([répétition à blanc](2026-10-17-100609-repetition-a-blanc-de-l-ouverture.md)).

**Une commande les enchaîne, à partir du seul identifiant du fil** — elle est ici, et nulle part ailleurs ;
le kit d'ouverture (`…/aidd-device-work/2026-10-15-133423-promesse-memoire-avant-ecriture/kit-ouverture.md`)
§5 y renvoie sans la recopier. Elle cherche la base du client qui **contient** ce fil (un identifiant ne dit pas de quel
projet il vient), lit la racine de l'espace de travail et la révision sous test **dans le gel** — jamais
retapées —, nomme le dossier du run, mesure la fin, exporte la trace (avant tout autre geste, §4.5), puis
appelle `faits`, `collect`, `receipt`, `compare`. Elle n'écrit **rien** si l'un des cinq faits humains
manque ou garde son gabarit `« <…> »`, et s'arrête au premier refus du harnais en laissant les pièces déjà
écrites : une pièce sans reçu est un brouillon de preuve, jamais un reçu.Le dossier du run est nommé par l'opérateur au §4.0 : la chaîne le reçoit dans `RUN`, et refuse un dossier
absent ou qui ne porte pas de `gate.json` ([ADR-034](../../../DECISIONS.md)). `collect` prend la branche
produit si `terrain/aidd_docs` existe, `--sans-produit` sinon.

```bash
RUN="$RUN" FIL='<fil>' PAR='<qui a ouvert et cloture>' TEMOIGNAGE='<vos mots>' \
DIFFERENCE='<ce qui differe de l attendu>' PHRASE='<la phrase du jugement>' \
VERDICT='non concluant' bash <<'CHAINE'
set -uo pipefail

# The thread id arrives through the environment: a heredoc-fed script has no $1.
FIL="${FIL:-}"
case "$FIL" in
  ""|*[!A-Za-z0-9_-]*)
    echo "USAGE — FIL : l'identifiant du fil, lettres, chiffres, tirets et soulignés seulement" >&2
    exit 2 ;;
esac

REPO=/home/giak/projects/aidd-device
OUTILS=$REPO/docs/device/harness/run.mjs
CAS=2026-10-15-133423-promesse-memoire-avant-ecriture
GEL=$REPO/docs/device/CASES/$CAS.freeze.json


# The five facts only a person gives. Checked before the first byte is written: a run directory
# without a receipt is a draft of evidence, and ADR-024 forbids inventing any of them.
for outil in git node sqlite3 date; do
  command -v "$outil" >/dev/null || { echo "REFUS — « $outil » introuvable ; la chaîne en a besoin pour dériver les faits" >&2; exit 1; }
done
PAR="${PAR:-}" ; TEMOIGNAGE="${TEMOIGNAGE:-}" ; ATTENDU_VU="${ATTENDU_VU:-non}"
DIFFERENCE="${DIFFERENCE:-}" ; PHRASE="${PHRASE:-}" ; VERDICT="${VERDICT:-}" ; LIMITES="${LIMITES:-}"
MANQUE=0
[ -n "$PAR" ]        || { echo "REFUS — PAR vide : le reçu nomme qui a ouvert et clôturé, cela ne se devine pas (ADR-024)" >&2; MANQUE=1; }
[ -n "$TEMOIGNAGE" ] || { echo "REFUS — TEMOIGNAGE vide : ce que l'opérateur atteste n'appartient à aucune machine (ADR-024)" >&2; MANQUE=1; }
[ -n "$DIFFERENCE" ] || { echo "REFUS — DIFFERENCE vide : l'écart entre l'attendu et le produit se pèse, il ne s'extrait pas du reçu (spec §8)" >&2; MANQUE=1; }
[ -n "$PHRASE" ]     || { echo "REFUS — PHRASE vide : la phrase du jugement est celle du juge (spec §8)" >&2; MANQUE=1; }
# A value still wearing its grit « <…> » is the template, not the testimony: a paste left half-filled
# would otherwise write a run directory naming « <qui a ouvert et cloture> ».
for couple in "PAR=$PAR" "TEMOIGNAGE=$TEMOIGNAGE" "DIFFERENCE=$DIFFERENCE" "PHRASE=$PHRASE"; do
  case "${couple#*=}" in "<"*">") echo "REFUS — ${couple%%=*} porte encore son gabarit « ${couple#*=} » : un gabarit n'est pas un témoignage (ADR-024)" >&2; MANQUE=1 ;; esac
done
case "$VERDICT" in conforme|ecart|"non concluant") ;; *) echo "REFUS — VERDICT vaut « $VERDICT », attendu conforme | ecart | non concluant" >&2; MANQUE=1 ;; esac
case "$ATTENDU_VU" in oui|non) ;; *) echo "REFUS — ATTENDU_VU vaut « $ATTENDU_VU », attendu oui | non" >&2; MANQUE=1 ;; esac
case "$LIMITES" in ""|mord|"ne mord pas"|"non évaluable") ;; *) echo "REFUS — LIMITES vaut « $LIMITES », attendu mord | ne mord pas | non évaluable" >&2; MANQUE=1 ;; esac
[ "$MANQUE" = 0 ] || { echo "REFUS — rien n'a été écrit : ces cinq faits précèdent le premier geste." >&2; exit 1; }

# 1. The client's base, found through the thread: an identifier does not say which project it comes from.
BASES=()
for db in "$HOME"/.config/freebuff-desktop/projects/*/desktop-v2.db; do
  [ -f "$db" ] || continue
  [ "$(sqlite3 -readonly "$db" "select count(*) from threads where id='$FIL';")" = 1 ] && BASES+=("$db")
done
[ "${#BASES[@]}" -eq 1 ] || { echo "REFUS — le fil « $FIL » se lit dans ${#BASES[@]} base(s) du client, une seule attendue ; rien n'a été écrit" >&2; exit 1; }
BASE="${BASES[0]}"

# 2. The freeze: working-space root and revision under test are read, never retyped.
GEL_LU=$(node -e '
  const g = require(process.argv[1]);
  const t = (g.arbres || []).find((a) => a.label === "revision-sous-test");
  if (!t || !g.racine_espace_de_travail || !g.cas) { console.error("gel incomplet"); process.exit(1); }
  console.log([g.racine_espace_de_travail, g.cas, t.head].join("\t"));
' "$GEL") || { echo "REFUS — $GEL illisible ou incomplet ; rien n'a été écrit" >&2; exit 1; }
IFS=$'\t' read -r RACINE CAS_G FW <<<"$GEL_LU"
[ "$CAS_G" = "$CAS" ] || { echo "REFUS — le gel nomme le cas « $CAS_G », la chaîne « $CAS » ; rien n'a été écrit" >&2; exit 1; }
W="$RACINE/$CAS" ; TRAVAIL="$W/terrain"
[ -d "$TRAVAIL" ] || { echo "REFUS — $TRAVAIL n'est pas un répertoire ; le run n'aurait où écrire" >&2; exit 1; }

# 3. The run directory, named to the second, gel revision then device revision (spec §4, ADR-023). It
# comes from the operator (§4.0), where the gate was already passed; the chain verifies it and never
# names another.
DEV=$(git -C "$REPO" rev-parse --short HEAD) || { echo "REFUS — $REPO : révision illisible ; rien n'a été écrit" >&2; exit 1; }
# H5 (ADR-034) : the gate is passed before the session opens, in the run directory the operator named at
# §4.0, and the receipt refuses a directory that carries none. The chain reuses that directory and never
# writes a gate: a gate written now would be dated after the first message, which is exactly what the
# receipt's HEAD and date checks are meant to keep visible.
RUN="${RUN:-}"
[ -n "$RUN" ] || { echo "REFUS — RUN absent : la porte se passe avant la session, dans le dossier du run (ADR-034) ; rien n'a été écrit" >&2; exit 1; }
[ -d "$RUN" ] && [ -f "$RUN/gate.json" ] || { echo "REFUS — $RUN ne porte aucune porte (gate.json) : la passer avec preflight avant d'ouvrir (ADR-034) ; rien n'a été écrit" >&2; exit 1; }
mkdir -p "$RUN/trace"
PORCELAIN=$(git -C "$REPO" status --porcelain)
[ -z "$PORCELAIN" ] || echo "note — $DEV ne nomme pas les $(printf '%s\n' "$PORCELAIN" | wc -l) fichier(s) modifiés du dispositif : le dire au reçu (§1.3)"

# 4. The trace first, its end measured before it: the only piece the operator does not write (§1.5, §4.5).
FIN=$(date -Is)
# The query is written on one line, exactly as faits records it: a wrapped query would give a faits.json
# whose trace.commande is an equivalent, not the command that produced the file.
SQL="select json_object('seq', m.seq, 'role', m.role, 'kind', json_extract(value,'\$.kind'), 'open', json_extract(value,'\$.open'), 'outil', json_extract(value,'\$.toolName'), 'chemin_outil', json_extract(value,'\$.input.path'), 'text', json_extract(value,'\$.text'), 'ts', m.ts) from messages m, json_each(m.parts_json) where m.thread_id='$FIL' order by m.seq, json_each.key;"
sqlite3 -readonly "$BASE" "$SQL" > "$RUN/trace/echange.jsonl" || { echo "REFUS — l'export de la trace a échoué ; le reçu n'aurait rien à compter" >&2; exit 1; }
echo "trace — $(grep -c '' "$RUN/trace/echange.jsonl") ligne(s) lues dans $BASE"

# 5. The facts, derived; then the product, collected or its absence named (§4, §9).
node "$OUTILS" faits --case "$CAS" --base "$BASE" --fil "$FIL" \
  --trace "$RUN/trace/echange.jsonl" --out "$RUN/faits.json" \
  --par "$PAR" --fin "$FIN" --temoignage "$TEMOIGNAGE" --attendu-vu "$ATTENDU_VU" || exit 1
if [ -d "$TRAVAIL/aidd_docs" ]; then
  node "$OUTILS" collect --run "$RUN" --case "$CAS" --from "$TRAVAIL/aidd_docs" || exit 1
else
  node "$OUTILS" collect --run "$RUN" --case "$CAS" --sans-produit || exit 1
  echo "note — aucun aidd_docs sous $TRAVAIL : run sans produit (§9), ce qui suffit à « non concluant »"
fi

# 6. The hot receipt, then the judge on the receipt alone (§6, §8). The gate was checked at step 3; it is
# checked again here, because the receipt would refuse it and the message should say which piece moved.
[ -f "$RUN/gate.json" ] || { echo "REFUS — la porte de $RUN a disparu entre-temps ; le reçu la refuserait (ADR-034)" >&2; exit 1; }
node "$OUTILS" receipt --run "$RUN" --case "$CAS" --faits "$RUN/faits.json" --verdict "$VERDICT" || exit 1
node "$OUTILS" compare --run "$RUN" --case "$CAS" --difference "$DIFFERENCE" --phrase "$PHRASE" \
  --verdict "$VERDICT" ${LIMITES:+--limites "$LIMITES"} || exit 1

printf 'chaîne ok — %s\n  reçu   %s\n  sortie %s\n' "$RUN" "$RUN/receipt.json" "$RUN/output.json"
CHAINE
```

Ce que cette commande **ne** fait pas : `last-message.md` (geste 3 ci-dessous, à la main, verbatim), et la
clôture des quatre arbres. Elle ne lance pas non plus `preflight` : cette porte se franchit **avant** la
session, et un `terrain` déjà écrit la ferait refuser.

Ce que chaque pièce prouve, et que la chaîne ne dispense pas de lire :


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
- **La chaîne du §4.7 sur un vrai fil de `terrain`** : elle est éprouvée jusqu'au refus de `faits`, sur un
  fil d'un autre projet, et refuse proprement un fil inconnu sans rien écrire ; elle n'a jamais atteint
  `receipt` ni `compare`, faute d'un fil ouvert dans la copie du cas.
- **Sa branche produit** (`collect --from terrain/aidd_docs`) : jamais exercée, parce que `terrain` n'a pas
  d'`aidd_docs` et qu'en créer un y écrirait, ce que le run interdit. Seule la branche `--sans-produit` a
  été éprouvée.
- **Le mode direct avant l'ouverture** : il se lit dans la ligne du fil, donc **après** l'ouverture (§4.2).
  Le client ne l'expose pas avant.
- **Le `default_branch` relevé par le client** (`origin/test/aidd-installation`) : aucune commande de cette
  liste ne l'a comparé au remote ; il n'entre dans aucune décision du run.
- **Le `info/exclude` de la copie** : il est nommé, pas expliqué. Personne n'a consigné qui l'a écrit le
  2026-10-15 21:44, et cette liste ne l'invente pas.
- **L'écriture hors racine** : la sonde du §1.7 n'a mesuré que la lecture.
