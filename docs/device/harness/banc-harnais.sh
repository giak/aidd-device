#!/usr/bin/env bash
# banc-harnais.sh — the bench of the harness: the refusals and the acceptances of run.mjs and of
# the link check beside it (liens.mjs), replayed dry. 262 controls, no session opened, nothing
# written in the repository or in the four trees.
#
# Everything it needs about this machine — the workspace root and the four trees — it reads
# from the case's freeze, never from a constant: a bench with a machine path baked in stops
# following a moved workspace, and those paths are facts of the freeze's moment (ADR-019).
#
# It writes only in a scratch directory under $TMPDIR, printed at the end, plus one symlink it
# creates and removes in the case's workspace (controls 40-41, which then assert that the
# workspace is clean). It never writes in the repository, and never in the four trees.
#
# Usage: bash docs/device/harness/banc-harnais.sh [<cas>]
#        → "<n>/<m> PASS", exit 0 if everything passes, 1 otherwise.
#        The manual: docs/device/BANC.md
#
# It refuses to run rather than lie: a missing freeze, a freeze without a declared root, or a
# workspace that is not there stops it before the first control, because a bench whose fixture
# is absent would count "refusals" that are really accidents.

set -uo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
H="$REPO/docs/device/harness/run.mjs"
CAS="${1:-2026-10-15-133423-promesse-memoire-avant-ecriture}"
GEL="$REPO/docs/device/CASES/$CAS.freeze.json"

[ -f "$GEL" ] || { echo "ARRET — gel absent : $GEL (le banc éprouve le harnais sur un gel réel, il ne le fabrique pas)"; exit 2; }
[ -f "$H" ] || { echo "ARRET — harnais absent : $H"; exit 2; }

# The fixture, read from the freeze: root of the workspaces, and the four trees as the freeze
# recorded them.
eval "$(node -e "
const g=require('$GEL');
const a=Object.fromEntries(g.arbres.map(x=>[x.label,x.chemin]));
const r=g.racine_espace_de_travail;
const q=v=>JSON.stringify(v===undefined?null:v);
console.log('RACINE='+q(r));
console.log('W='+q(r===undefined?null:r+'/$CAS'));
console.log('FRAMEWORK='+q(a['framework-origin']));
console.log('TERRAIN='+q(a['terrain']));
" )" || { echo "ARRET — gel illisible : $GEL"; exit 2; }
[ "$RACINE" != "null" ] && [ -n "$RACINE" ] || { echo "ARRET — le gel ne déclare pas racine_espace_de_travail (gel d'avant l'ADR-019) : $GEL"; exit 2; }
[ -d "$W/terrain" ] || { echo "ARRET — l'espace de travail du cas n'est pas là : $W/terrain (re-geler, ou relancer depuis la machine qui l'a gelé)"; exit 2; }

B="$(mktemp -d "${TMPDIR:-/tmp}/banc-harnais.XXXXXX")" || { echo "ARRET — pas de dossier jetable"; exit 2; }
cd "$REPO"
echo "banc — cas $CAS, dépôt $REPO"
echo "jetable $B (conservé pour inspection)"

PASS=0; TOTAL=0
# `controle` attribue a chaque controle son fichier de detail ($B/detail.<n>, renommable en posant DETAIL
# avant l'appel) ; sa commande y ecrit une raison par ligne quand elle tombe, et `controle` les imprime
# sous son FAIL, prefixees `echec :`. Le fichier est efface apres lecture et DETAIL remis a vide : aucun
# controle n'herite du detail d'un autre, et rien ne colle a un numero de controle (drift : le detail du
# 153 vivait sur une ligne apres son appel).
DETAIL=""
controle() { # nom, attendu, commande...
  local nom="$1" attendu="$2"; shift 2
  TOTAL=$((TOTAL+1))
  local detail="${DETAIL:-$B/detail.$TOTAL}" # automatique ; un controle peut le nommer autrement
  DETAIL="$detail"; export DETAIL # le fichier de détail se lit dans l'environnement du contrôle
  "$@" >/dev/null 2>&1
  local rc=$?
  if [ "$rc" = "$attendu" ]; then PASS=$((PASS+1)); printf 'PASS  %-46s exit=%s\n' "$nom" "$rc"
  else
    printf 'FAIL  %-46s exit=%s attendu=%s\n' "$nom" "$rc" "$attendu"
    if [ -s "$detail" ]; then sed 's/^/      echec : /' "$detail"; fi
  fi
  rm -f "$detail"
  DETAIL=""
}
refus-nomme() { # exit attendu, texte attendu, commande... — un refus explicite, pas une trace Node
  local voulu="$1" attendu="$2"; shift 2
  local sortie rc raisons=()
  sortie=$("$@" 2>&1); rc=$?
  if [ "$rc" != "$voulu" ]; then raisons+=("sortie attendue $voulu, vue $rc"); fi
  if ! printf '%s' "$sortie" | grep -qF -- "$attendu"; then raisons+=("texte attendu introuvable : $attendu"); fi
  if [ ${#raisons[@]} -gt 0 ] && [ -n "${DETAIL:-}" ]; then
    printf '%s\n' "${raisons[@]}" > "$DETAIL"
    printf 'sortie vue : %s\n' "$(printf '%s' "$sortie" | head -n 1 | cut -c1-160)" >> "$DETAIL"
    return 1
  fi
  [ ${#raisons[@]} -eq 0 ]
}

mkdir -p "$B/cases" "$B/cases2" "$B/trace" "$B/run"
cp "$GEL" "$B/cases/$CAS.freeze.json"

# H5 (ADR-034) : a gate writes what preflight measured, and every receipt now demands one. It must be
# passed with the same --cases as the receipt that will read it: the empreinte of the gel is compared,
# and the re-geled controls 101 and 102 carry another one. preflight refuses to overwrite a gate, so
# one gate per run directory, and none is written by hand.
porte() { # dossier-de-run [dossier-des-cas]
  local cases="${2:-}"
  if [ -n "$cases" ]; then
    node "$H" preflight --run "$1" --case "$CAS" --cases "$cases" --repertoire "$W/terrain" >/dev/null 2>&1 \
      || { echo "ARRET — la porte de $1 ne s'écrit pas (cas $cases)"; exit 2; }
  else
    node "$H" preflight --run "$1" --case "$CAS" --repertoire "$W/terrain" >/dev/null 2>&1 \
      || { echo "ARRET — la porte de $1 ne s'écrit pas"; exit 2; }
  fi
}

# The client's base and its thread, before the first receipt: H3 re-reads them (ADR-031). The two
# instants are derived as faits derives them (`date -d @<seconde>`), so the fixture and the harness
# compare the same string, whatever the local zone.
D0=$(date -d '2026-10-15T23:00:00+02:00' +%s000)
ISO0=$(date -d "@$((D0 / 1000))" --iso-8601=seconds)
ISO1=$(date -d "@$((D0 / 1000 + 60))" --iso-8601=seconds)
DBF="$B/client.db"
sqlite3 "$DBF" "create table threads(id text primary key, project_path text, execution_mode text, branch text, worktree_path text, harness_id text, model text, created_at integer);
create table messages(thread_id text, seq integer, role text, ts integer, parts_json text);
insert into threads values('banc','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc',1,'user',$D0,'[]');"

# 1-2 : l'ouverture autorisée, sur le gel réel
controle "1 porte, dossier gelé (--repertoire)"  0 node "$H" preflight --case "$CAS" --repertoire "$W/terrain" --run "$B/p1"
controle "2 porte, répertoire courant"           0 bash -c "cd '$W/terrain' && node '$H' preflight --case '$CAS' --run '$B/p2'"

# 3-7 : les mauvais dossiers
controle "3 refus, terrain original"             1 node "$H" preflight --case "$CAS" --repertoire "$TERRAIN" --run "$B/p3"
controle "4 refus, révision sous test"           1 node "$H" preflight --case "$CAS" --repertoire "$W/framework-origin" --run "$B/p4"
controle "5 refus, ancien foyer ~/runs"          1 node "$H" preflight --case "$CAS" --repertoire "$HOME/runs/aidd-device/2026-10-15-133335-promesse-memoire-avant-ecriture/terrain" --run "$B/p5"
controle "6 refus, répertoire courant = dépôt"   1 node "$H" preflight --case "$CAS" --run "$B/p6"
controle "7 refus, cas sans gel"                 1 node "$H" preflight --case cas-inexistant --run "$B/p7"

# 8 : l'arbre « travail » du gel pointe dans le dépôt du dispositif
node -e "const fs=require('fs'),p='$B/cases/$CAS.freeze.json'; const g=JSON.parse(fs.readFileSync(p,'utf8'));
g.arbres.find(a=>a.label==='travail').chemin='$REPO/docs';
fs.writeFileSync(p, JSON.stringify(g,null,2)+'\n');"
controle "8 refus, arbre travail dans le dépôt"  1 node "$H" preflight --case "$CAS" --cases "$B/cases" --repertoire "$REPO/docs" --run "$B/p8"

# 9 : l'arbre « travail » du gel n'est pas un dépôt git
mkdir -p "$B/pas-un-depot"
cp "$GEL" "$B/cases/$CAS.freeze.json"
node -e "const fs=require('fs'),p='$B/cases/$CAS.freeze.json'; const g=JSON.parse(fs.readFileSync(p,'utf8'));
g.arbres.find(a=>a.label==='travail').chemin='$B/pas-un-depot';
fs.writeFileSync(p, JSON.stringify(g,null,2)+'\n');"
controle "9 refus, arbre travail non-git"        1 node "$H" preflight --case "$CAS" --cases "$B/cases" --repertoire "$B/pas-un-depot" --run "$B/p9"

# 10 : bonne révision, porcelain d'un autre état
rm -rf "$B/faux-travail"
git clone --quiet --no-hardlinks "$TERRAIN" "$B/faux-travail"
head_gel=$(node -e "const a=require('$GEL').arbres.find(a=>a.label==='terrain'); process.stdout.write(a.head_complet||a.head)")
git -C "$B/faux-travail" checkout --quiet --detach "$head_gel"
cp "$GEL" "$B/cases/$CAS.freeze.json"
node -e "const fs=require('fs'),p='$B/cases/$CAS.freeze.json'; const g=JSON.parse(fs.readFileSync(p,'utf8'));
g.arbres.find(a=>a.label==='travail').chemin='$B/faux-travail';
fs.writeFileSync(p, JSON.stringify(g,null,2)+'\n');"
echo "note" > "$B/faux-travail/ecrit-par-derive.txt"
controle "10 refus, porcelain changé"            1 node "$H" preflight --case "$CAS" --cases "$B/cases" --repertoire "$B/faux-travail" --run "$B/p10"
rm -f "$B/faux-travail/ecrit-par-derive.txt"
controle "11 porte, même arbre sans la dérive"   0 node "$H" preflight --case "$CAS" --cases "$B/cases" --repertoire "$B/faux-travail" --run "$B/p11"

# 12-13 : un fichier du cas a bougé depuis le gel (gel copié, chemins par nom de base)
node -e "const fs=require('fs'),path=require('path'); const g=JSON.parse(fs.readFileSync('$GEL','utf8'));
g.fichiers=g.fichiers.map(f=>({...f, chemin: path.basename(f.chemin)}));
g.arbres.find(a=>a.label==='travail').chemin='$W/terrain';
for (const f of g.fichiers) fs.copyFileSync(path.join('$REPO/docs/device/CASES', f.chemin), path.join('$B/cases2', f.chemin));
fs.writeFileSync('$B/cases2/$CAS.freeze.json', JSON.stringify(g,null,2)+'\n');
fs.appendFileSync(path.join('$B/cases2', g.fichiers.find(f=>f.role==='demande').chemin), '\nretouche apres le gel\n');"
controle "12 refus, fichier du cas qui a bougé"  1 node "$H" preflight --case "$CAS" --cases "$B/cases2" --repertoire "$W/terrain" --run "$B/p12"
node -e "const fs=require('fs'),path=require('path');
for (const f of JSON.parse(fs.readFileSync('$B/cases2/$CAS.freeze.json','utf8')).fichiers)
  fs.copyFileSync(path.join('$REPO/docs/device/CASES', path.basename(f.chemin)), path.join('$B/cases2', f.chemin));"
controle "13 porte, gel rejoué d'un banc"        0 node "$H" preflight --case "$CAS" --cases "$B/cases2" --repertoire "$W/terrain" --run "$B/p13"

# 14-19 : non-régression du reste du harnais (le reçu sur le dossier gelé, et les refus d'origine)
controle "14 collect --sans-produit"             0 node "$H" collect --run "$B/run" --case "$CAS" --sans-produit
porte "$B/run"
# The bench's faits.json is written by faits, never by hand: H2 compares the command the piece cites
# to the one the receipt rebuilds, and a hand-written command differs by its SQL (ADR-032). The
# export is made before faits, as §1.5 orders it, and is the thread's own output — here empty,
# since the thread « banc » has no part.
: > "$B/trace/echange.jsonl"
node "$H" faits --case "$CAS" --base "$DBF" --fil banc --trace "$B/trace/echange.jsonl" --out "$B/faits-banc.json" \
  --par banc --fin "$ISO1" --conduite humain >/dev/null || { echo "ARRET — la fixture faits du banc ne s'écrit pas"; exit 2; }
node -e "const fs=require('fs');const t=JSON.parse(fs.readFileSync('$B/faits-banc.json','utf8'));
t.repertoire_de_travail='$TERRAIN';fs.writeFileSync('$B/faits-mauvais.json',JSON.stringify(t,null,2)+'\n')"
cp "$B/faits-banc.json" "$B/faits-bon.json"
controle "15 receipt refus, porte et dossier diffèrent" 0 refus-nomme 1 "la porte a autorisé" node "$H" receipt --run "$B/run" --case "$CAS" --faits "$B/faits-mauvais.json"
controle "16 receipt, dossier gelé"              0 node "$H" receipt --run "$B/run" --case "$CAS" --faits "$B/faits-bon.json"
controle "17 compare, depuis le reçu seul"       0 node "$H" compare --run "$B/run" --case "$CAS" --difference "banc : rien produit" --phrase "banc" --verdict "non concluant" --limites "ne mord pas"
controle "18 second collect refusé"              1 node "$H" collect --run "$B/run" --case "$CAS" --sans-produit
controle "19 verdict conforme refusé"            1 node "$H" compare --run "$B/run" --case "$CAS" --difference x --phrase y --verdict conforme
controle "20 --help"                             0 node "$H" --help

# 21-31 : la racine déclarée (ADR-019) — gel, garde du cas, texte substitué
mkdir -p "$B/cases-lint"
cp "$REPO/docs/device/CASES/$CAS.request.md" "$REPO/docs/device/CASES/$CAS.expected.json" "$B/cases-lint/"
cp "$GEL" "$B/cases-lint/$CAS.freeze.json"
cp "$B/cases-lint/$CAS.request.md" "$B/cases-lint/$CAS.request.md.bak"
printf '\nracine en clair : %s\n' "$RACINE" >> "$B/cases-lint/$CAS.request.md"
controle "21 freeze refus, cas qui nomme la racine" 1 node "$H" freeze --case "$CAS" --cases "$B/cases-lint" --refreeze \
  --racine "$RACINE" --arbre framework-origin="$FRAMEWORK" --arbre terrain="$TERRAIN"
mv "$B/cases-lint/$CAS.request.md.bak" "$B/cases-lint/$CAS.request.md"
controle "22 freeze refus, --arbre sur un label dérivé" 1 node "$H" freeze --case "$CAS" --cases "$B/cases-lint" --refreeze \
  --racine "$RACINE" --arbre travail="$RACINE/$CAS/terrain" --arbre framework-origin="$FRAMEWORK" --arbre terrain="$TERRAIN"
controle "23 freeze refus, racine dans le dépôt" 1 node "$H" freeze --case "$CAS" --cases "$B/cases-lint" --refreeze \
  --racine "$REPO/docs" --arbre framework-origin="$FRAMEWORK" --arbre terrain="$TERRAIN"
controle "24 freeze refus, racine inexistante" 1 node "$H" freeze --case "$CAS" --cases "$B/cases-lint" --refreeze \
  --racine "$B/racine-absente" --arbre framework-origin="$FRAMEWORK" --arbre terrain="$TERRAIN"
controle "25 freeze ok, deux arbres dérivés" 0 node "$H" freeze --case "$CAS" --cases "$B/cases-lint" --refreeze \
  --racine "$RACINE" --arbre framework-origin="$FRAMEWORK" --arbre terrain="$TERRAIN" \
  --ref-root "$RACINE/$CAS/framework-origin" --ref plugins/aidd-context/skills/02-project-memory/SKILL.md
controle "26 le gel porte la racine et les arbres dérivés" 0 node -e "
const g=require('$B/cases-lint/$CAS.freeze.json'); const ok=g.racine_espace_de_travail==='$RACINE'
  && g.arbres.length===4
  && g.arbres.find(a=>a.label==='travail').chemin==='$RACINE/$CAS/terrain'
  && g.arbres.find(a=>a.label==='revision-sous-test').chemin==='$RACINE/$CAS/framework-origin'
  && g.arbres.find(a=>a.label==='travail').head===g.arbres.find(a=>a.label==='terrain').head; process.exit(ok?0:1)"

T=$(sed -n '/^<<<DEMANDE$/,/^>>>DEMANDE$/p' "$REPO/docs/device/CASES/$CAS.request.md" | sed '1d;$d' | sed "s|\$RACINE|$RACINE|g")
printf '%s' "$T" > "$B/texte-juste.txt"; printf '%s\n' "$T" > "$B/texte-saut.txt"
sed "s|$RACINE|$RACINE-ailleurs|" "$B/texte-juste.txt" > "$B/texte-faux.txt"
controle "27 preflight --texte, substitute juste" 0 node "$H" preflight --case "$CAS" --repertoire "$RACINE/$CAS/terrain" --texte "$B/texte-juste.txt" --run "$B/p27"
controle "28 preflight refus, saut de ligne final" 1 node "$H" preflight --case "$CAS" --repertoire "$RACINE/$CAS/terrain" --texte "$B/texte-saut.txt" --run "$B/p28"
controle "29 preflight refus, chemin d'un autre foyer" 1 node "$H" preflight --case "$CAS" --repertoire "$RACINE/$CAS/terrain" --texte "$B/texte-faux.txt" --run "$B/p29"
controle "30 preflight refus, texte absent" 1 node "$H" preflight --case "$CAS" --repertoire "$RACINE/$CAS/terrain" --texte "$B/aucun-texte.txt" --run "$B/p30"
mkdir -p "$B/cases-sans-racine"
node -e "const fs=require('fs');const g=JSON.parse(fs.readFileSync('$GEL','utf8'));delete g.racine_espace_de_travail;fs.writeFileSync('$B/cases-sans-racine/$CAS.freeze.json',JSON.stringify(g,null,2)+'\n');"
controle "31 preflight refus, gel sans racine déclarée" 1 node "$H" preflight --case "$CAS" --cases "$B/cases-sans-racine" --repertoire "$RACINE/$CAS/terrain" --texte "$B/texte-juste.txt" --run "$B/p31"

# 32-45 : l'origine du produit (ADR-020) — collect exige l'espace gelé, le reçu relit le manifeste
FROM_OK="$W/terrain/README.md"
mkdir -p "$B/ailleurs" "$B/cases-vides"
printf 'produit ecrit ailleurs\n' > "$B/ailleurs/produit.md"
controle "32 collect ok, --from dans l'espace gelé" 0 node "$H" collect --run "$B/run-produit" --case "$CAS" --from "$FROM_OK"
controle "33 le manifeste nomme l'arbre du gel"    0 node -e "
const m=require('$B/run-produit/raw/$CAS/manifest.json');
process.exit(m.arbre_de_travail && m.arbre_de_travail.chemin==='$W/terrain' ? 0 : 1)"
controle "34 collect refus, terrain original"     1 node "$H" collect --run "$B/run-hors" --case "$CAS" --from "$TERRAIN"
controle "35 collect refus, révision sous test"   1 node "$H" collect --run "$B/run-rev" --case "$CAS" --from "$W/framework-origin"
controle "36 collect refus, hors des quatre arbres" 1 node "$H" collect --run "$B/run-tmp" --case "$CAS" --from "$B/ailleurs"
controle "37 collect refus, source absente"       1 node "$H" collect --run "$B/run-absent" --case "$CAS" --from "$B/inconnu"
controle "38 collect refus, cas sans gel"         1 node "$H" collect --run "$B/run-sansgel" --case "$CAS" --cases "$B/cases-vides" --from "$FROM_OK"
mkdir -p "$B/cases-sans-travail"
node -e "const fs=require('fs');const g=JSON.parse(fs.readFileSync('$GEL','utf8'));
g.arbres=g.arbres.filter(a=>a.label!=='travail');
fs.writeFileSync('$B/cases-sans-travail/$CAS.freeze.json',JSON.stringify(g,null,2)+'\n');"
controle "39 collect refus, gel sans arbre travail" 1 node "$H" collect --run "$B/run-sanstrav" --case "$CAS" --cases "$B/cases-sans-travail" --from "$FROM_OK"
ln -s "$B/ailleurs" "$W/terrain/derive-banc"
controle "40 collect refus, lien qui sort de l'espace" 1 node "$H" collect --run "$B/run-lien" --case "$CAS" --from "$W/terrain/derive-banc"
rm -f "$W/terrain/derive-banc"
controle "41 l'espace de travail rendu propre"     0 node -e "
const {execFileSync}=require('child_process');
process.exit(execFileSync('git',['-C','$W/terrain','status','--porcelain'],{encoding:'utf8'}).trim()===''?0:1)"

# 42-45 : le reçu relit l'origine — la porte de collect peut être sautée
mk() { # nom-du-run, source déclarée — la copie est réelle, seule la provenance déclarée change (H1, ADR-030)
  node "$H" collect --run "$B/$1" --case "$CAS" --sans-produit >/dev/null 2>&1
  porte "$B/$1"
  cp "$W/terrain/README.md" "$B/$1/raw/$CAS/produit.md"
  node -e "const fs=require('fs'),crypto=require('crypto'),p='$B/$1/raw/$CAS/manifest.json',copie='$B/$1/raw/$CAS/produit.md';
const m=JSON.parse(fs.readFileSync(p,'utf8'));const src='$2';
if (src==='') { m.arbre_de_travail={label:'travail',chemin:'$TERRAIN'}; fs.unlinkSync(copie); }
else { const b=fs.readFileSync(copie); m.fichiers=[{chemin:'produit.md',source:src,sha256:crypto.createHash('sha256').update(b).digest('hex'),taille:b.length,birth:null,birth_epoch:null}]; }
fs.writeFileSync(p,JSON.stringify(m,null,2)+'\n');"
}
mk recu-arbre ""
controle "42 receipt refus, manifeste d'un autre arbre" 1 node "$H" receipt --run "$B/recu-arbre" --case "$CAS" --faits "$B/faits-bon.json"
mk recu-source "$TERRAIN/README.md"
controle "43 receipt refus, source hors de l'espace" 1 node "$H" receipt --run "$B/recu-source" --case "$CAS" --faits "$B/faits-bon.json"
mk recu-interne "$W/terrain/README.md"
controle "44 receipt, source dans l'espace gelé"   0 node "$H" receipt --run "$B/recu-interne" --case "$CAS" --faits "$B/faits-bon.json" --verdict "non concluant"
mk recu-disparue "$W/terrain/inexistant-au-recu.md"
controle "45 receipt, source disparue = limite"    0 node "$H" receipt --run "$B/recu-disparue" --case "$CAS" --faits "$B/faits-bon.json" --verdict "non concluant"
controle "46 la limite de la source disparue est écrite" 0 node -e "
const r=require('$B/recu-disparue/receipt.json');
process.exit(r.limites.some(l=>l.includes('source du produit non résolvable'))?0:1)"

# 47-50 : les faits se dérivent du fil et du gel, ils ne se tapent pas (ADR-024)
sqlite3 "$DBF" "insert into threads values('fil-banc','$W/terrain','local','','','codebuff','m-banc',$(($(date +%s)*1000-60000)));
insert into messages values('fil-banc',1,'user',$(($(date +%s)*1000-30000)),'[]');"
controle "47 faits, fil local dans l'arbre gelé"   0 node "$H" faits --case "$CAS" --base "$DBF" --fil fil-banc --trace "$B/trace/echange.jsonl" --out "$B/faits-genere.json" --par banc --fin "$(date -Is)" --conduite humain
controle "48 faits refus, fil inconnu"             1 node "$H" faits --case "$CAS" --base "$DBF" --fil fil-absent --trace "$B/trace/echange.jsonl" --out "$B/f48.json" --par banc --fin "$(date -Is)" --conduite humain
sqlite3 "$DBF" "update threads set project_path='$B/inexistant' where id='fil-banc';"
controle "49 faits refus, chemin qui ne résout pas" 1 node "$H" faits --case "$CAS" --base "$DBF" --fil fil-banc --trace "$B/trace/echange.jsonl" --out "$B/f49.json" --par banc --fin "$(date -Is)" --conduite humain
sqlite3 "$DBF" "update threads set project_path='$W/terrain', branch='freebuff/banc', worktree_path='$B/wt' where id='fil-banc';"
controle "50 faits refus, fil en worktree"         1 node "$H" faits --case "$CAS" --base "$DBF" --fil fil-banc --trace "$B/trace/echange.jsonl" --out "$B/f50.json" --par banc --fin "$(date -Is)" --conduite humain

# 51-56 : receipt situe les chemins de faits.json, et les compare comme faits les compare (ADR-025)
vide() { # nom [dossier-des-cas] — un dossier de run vide, et sa porte (H5)
  node "$H" collect --run "$B/$1" --case "$CAS" --sans-produit >/dev/null 2>&1
  porte "$B/$1" "${2:-}"
}
faits-en() { # travail, trace, sortie — depuis le faits.json du banc, seules les deux valeurs changent
  # The redirect at the end of trace.commande moves with the exported path, otherwise H2 would
  # refuse the piece for citing another export before reaching the control it serves (ADR-032).
  node -e "const fs=require('fs');const t=JSON.parse(fs.readFileSync('$B/faits-bon.json','utf8'));
t.repertoire_de_travail=process.argv[1];t.trace.chemin_exporte=process.argv[2];
const i=t.trace.commande.lastIndexOf(' > ');
t.trace.commande=t.trace.commande.slice(0,i)+' > '+process.argv[2];
fs.writeFileSync(process.argv[3],JSON.stringify(t,null,2)+'\n')" "$1" "$2" "$3"
}
for r in r51 r52 r53 r54 r55 r56; do vide "$r"; done
faits-en "$B/pas-la" "$B/trace/echange.jsonl" "$B/f51.json"
controle "51 receipt refus, travail qui ne résout pas" 1 node "$H" receipt --run "$B/r51" --case "$CAS" --faits "$B/f51.json"
controle "52 ce refus nomme la résolution, pas l'arbre" 0 node -e "
const {execFileSync}=require('child_process');
try{execFileSync('node',['$H','receipt','--run','$B/r52','--case','$CAS','--faits','$B/f51.json'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});process.exit(1);}
catch(e){process.exit(String(e.stderr).includes('ne résout pas')?0:1)}"
faits-en "$W/terrain" "$B/absent/echange.jsonl" "$B/f53.json"
controle "53 receipt refus, dossier de la trace absent" 1 node "$H" receipt --run "$B/r53" --case "$CAS" --faits "$B/f53.json"
controle "54 ce refus nomme le dossier de la trace" 0 node -e "
const {execFileSync}=require('child_process');
try{execFileSync('node',['$H','receipt','--run','$B/r54','--case','$CAS','--faits','$B/f53.json'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});process.exit(1);}
catch(e){process.exit(String(e.stderr).includes('dossier du chemin exporté')?0:1)}"
ln -s "$W/terrain" "$B/lien-terrain"
faits-en "$B/lien-terrain" "$B/trace/echange.jsonl" "$B/f55.json"
controle "55 receipt ok, travail par un lien résolu" 0 node "$H" receipt --run "$B/r55" --case "$CAS" --faits "$B/f55.json"
rm -f "$B/lien-terrain"
faits-en "$W/terrain" "$B/trace/absente.jsonl" "$B/f56.json"
controle "56 receipt, trace absente = limite (§7)" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/r56','--case','$CAS','--faits','$B/f56.json'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/r56/receipt.json','utf8'));
process.exit(r.limites.some(l=>l.includes('trace machine introuvable'))?0:1)"

# 57-60 : les prérequis sont déclarés et sondés au démarrage (ADR-026)
NODE=$(command -v node)
for d in sans-date sans-sqlite sans-git faux-date; do mkdir -p "$B/$d"; done
ln -s "$(command -v git)" "$B/sans-date/git"
ln -s "$(command -v git)" "$B/sans-sqlite/git"; ln -s "$(command -v date)" "$B/sans-sqlite/date"
ln -s "$(command -v date)" "$B/sans-git/date"; ln -s "$(command -v sqlite3)" "$B/sans-git/sqlite3"
ln -s "$(command -v git)" "$B/faux-date/git"
printf '#!/bin/sh\necho "date: illegal option -- -" >&2\nexit 1\n' > "$B/faux-date/date"; chmod +x "$B/faux-date/date"
controle "57 prérequis refus, sqlite3 absent"      0 refus-nomme 1 "« sqlite3 » est introuvable" env PATH="$B/sans-sqlite" "$NODE" "$H" faits --case "$CAS" --base "$B/client.db" --fil fil-banc --trace "$B/trace/echange.jsonl" --out "$B/f57.json" --par banc --fin "$(date -Is)" --conduite humain
controle "58 prérequis refus, date qui n'obéit pas" 0 refus-nomme 1 "GNU coreutils" env PATH="$B/faux-date" "$NODE" "$H" collect --run "$B/run-pre58" --case "$CAS" --sans-produit
controle "59 prérequis refus, git absent"         0 refus-nomme 1 "« git » est introuvable" env PATH="$B/sans-git" "$NODE" "$H" preflight --case "$CAS"
controle "60 --help déclare les prérequis"        0 refus-nomme 0 "sqlite3 -version" "$NODE" "$H" --help

# 61-63 : le contrôle de liens lit la prose, pas les citations (ADR-027)
L="$REPO/docs/device/harness/liens.mjs"
mkdir -p "$B/liens" "$B/liens-code"
: > "$B/liens/present.md"
printf '[prose](absent.md)\n[ok](present.md)\n' > "$B/liens/prose.md"
printf 'texte\n`[faux](absent.md)`\n' > "$B/liens-code/citation.md"
controle "61 liens, le dépôt sans lien mort"       0 refus-nomme 0 "0 mort(s)" "$NODE" "$L"
controle "62 liens refus, un lien mort en prose"  0 refus-nomme 1 "MORT" "$NODE" "$L" --racine "$B/liens"
controle "63 liens, une citation entre backticks" 0 refus-nomme 0 "1 motif(s)" "$NODE" "$L" --racine "$B/liens-code"

# 64-65 : session.identifiant se rattache au fil que la commande d'export lit (ADR-028)
faits-ident() { # identifiant, commande, sortie
  node -e "const fs=require('fs');const t=JSON.parse(fs.readFileSync('$B/faits-bon.json','utf8'));
t.session.identifiant=process.argv[1];t.trace.commande=process.argv[2];
fs.writeFileSync(process.argv[3],JSON.stringify(t,null,2)+'\n')" "$1" "$2" "$3"
}
for r in r64 r65; do node "$H" collect --run "$B/$r" --case "$CAS" --sans-produit >/dev/null 2>&1; porte "$B/$r"; done
faits-ident "fil-a" "sqlite3 -readonly base \"select json_object('seq', m.seq) from messages m where m.thread_id='banc'\"" "$B/f64.json"
controle "64 receipt refus, identifiant d'un autre fil" 0 refus-nomme 1 "session.identifiant vaut" node "$H" receipt --run "$B/r64" --case "$CAS" --faits "$B/f64.json"
faits-ident "banc" "banc" "$B/f65.json"
controle "65 receipt refus, commande sans fil"    0 refus-nomme 1 "ne nomme aucun fil" node "$H" receipt --run "$B/r65" --case "$CAS" --faits "$B/f65.json"

# 66-67 : le reçu lit l'export et compte les échanges de la fenêtre (§5, condition 2 ; ADR-029).
# H2 (ADR-032) interdit d'écrire la trace à la main : le fichier est la sortie de la requête du
# §1.5 sur une base qui porte le fil, exécutée par la commande que faits écrit. Le cas « hors
# fenêtre » se déplace donc dans la base : le premier message utilisateur n'a aucune part, donc il
# ne s'exporte pas, et le seul message exporté tombe une heure après la fenêtre.
export-fil() { # fil, fichier de trace, faits — le geste §1.5 : le fichier est la sortie de la pièce
  : > "$2"
  node "$H" faits --case "$CAS" --base "$DBF" --fil "$1" --trace "$2" --out "$3" \
    --par banc --fin "$ISO1" --conduite humain >/dev/null 2>&1 || return 1
  bash -c "$(node -e "process.stdout.write(require('$3').trace.commande)")"
}
sqlite3 "$DBF" <<SQL
insert into threads values('banc-fenetre','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-fenetre',1,'user',$D0,'[{"kind":"text","text":"banc"},{"kind":"text","text":"banc, seconde part"}]');
insert into threads values('banc-hors-fenetre','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-hors-fenetre',1,'user',$D0,'[]');
insert into messages values('banc-hors-fenetre',2,'assistant',$(($D0+3600000)),'[{"kind":"text","text":"banc, une heure plus tard"}]');
SQL
mkdir -p "$B/trace66"
export-fil banc-fenetre "$B/trace66/fenetre.jsonl" "$B/f66.json" || { echo "ARRET — l'export de 66 ne s'écrit pas"; exit 2; }
export-fil banc-hors-fenetre "$B/trace66/hors.jsonl" "$B/f67.json" || { echo "ARRET — l'export de 67 ne s'écrit pas"; exit 2; }
for r in r66 r67; do vide "$r"; done
controle "66 receipt, échange dans la fenêtre"      0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/r66','--case','$CAS','--faits','$B/f66.json'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/r66/receipt.json','utf8'));
process.exit(r.trace_lue.echanges_dans_la_fenetre>=1 && r.falsificateurs.trace_sans_echange_dans_la_fenetre===false ?0:1)"
controle "67 receipt, trace hors fenêtre = cond. 2"  0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/r67','--case','$CAS','--faits','$B/f67.json'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/r67/receipt.json','utf8'));
process.exit(r.falsificateurs.trace_sans_echange_dans_la_fenetre===true && r.limites.some(l=>l.includes('condition 2')) ?0:1)"

# 68-86 : H1 re-hache la copie (ADR-030), H3 relit la base (ADR-031)
produit-run() { # nom — un run dont le produit est réellement copié depuis l'espace gelé
  node "$H" collect --run "$B/$1" --case "$CAS" --from "$W/terrain/README.md" >/dev/null 2>&1
  porte "$B/$1"
}
faits-fil() { # fil, sortie — copie de faits-bon, identifiant et commande d'export au même fil
  node -e "const fs=require('fs');const t=JSON.parse(fs.readFileSync('$B/faits-bon.json','utf8'));
t.session.identifiant=process.argv[1];
t.trace.commande=t.trace.commande.replace(/thread_id='[^']*'/, \"thread_id='\"+process.argv[1]+\"'\");
fs.writeFileSync(process.argv[2],JSON.stringify(t,null,2)+'\n')" "$1" "$2"
}

produit-run r68
printf 'retouche apres collect\n' >> "$B/r68/raw/$CAS/README.md"
controle "68 receipt refus, copie réécrite"      0 refus-nomme 1 "ne rend plus l'empreinte" node "$H" receipt --run "$B/r68" --case "$CAS" --faits "$B/faits-bon.json" --verdict "non concluant"

produit-run r69
rm "$B/r69/raw/$CAS/README.md"
controle "69 receipt refus, copie supprimée"     0 refus-nomme 1 "n'est plus dans la copie" node "$H" receipt --run "$B/r69" --case "$CAS" --faits "$B/faits-bon.json" --verdict "non concluant"

produit-run r70
: > "$B/r70/raw/$CAS/ajoute.md"
controle "70 receipt refus, fichier en trop"     0 refus-nomme 1 "absent du manifeste" node "$H" receipt --run "$B/r70" --case "$CAS" --faits "$B/faits-bon.json" --verdict "non concluant"

produit-run r71
controle "71 receipt, copie intacte et comptée"  0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/r71','--case','$CAS','--faits','$B/faits-bon.json','--verdict','non concluant'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/r71/receipt.json','utf8'));
process.exit(r.produit.verifie && r.produit.verifie.fichiers===1 && /^[0-9a-f]{64}$/.test(r.produit.verifie.manifeste_sha256)?0:1)"
controle "72 manifeste haché au reçu"            0 node -e "
const fs=require('fs'),crypto=require('crypto');const r=JSON.parse(fs.readFileSync('$B/r71/receipt.json','utf8'));
const sha=crypto.createHash('sha256').update(fs.readFileSync('$B/r71/raw/$CAS/manifest.json')).digest('hex');
process.exit(r.produit.verifie.manifeste_sha256===sha?0:1)"

produit-run r73
node -e "const fs=require('fs'),p='$B/r73/raw/$CAS/manifest.json';const m=JSON.parse(fs.readFileSync(p,'utf8'));m.fichiers[0].chemin='../../evasion.md';fs.writeFileSync(p,JSON.stringify(m,null,2)+'\n');"
controle "73 receipt refus, chemin qui sort"     0 refus-nomme 1 "sort de" node "$H" receipt --run "$B/r73" --case "$CAS" --faits "$B/faits-bon.json" --verdict "non concluant"

produit-run r74
rm "$B/r74/raw/$CAS/README.md"
ln -s "$W/terrain/README.md" "$B/r74/raw/$CAS/README.md"
controle "74 receipt refus, lien symbolique"     0 refus-nomme 1 "lien symbolique" node "$H" receipt --run "$B/r74" --case "$CAS" --faits "$B/faits-bon.json" --verdict "non concluant"

for r in r75 r76 r77 r78 r79 r80 r81 r82 r83 r84 r85; do vide "$r"; done
node -e "const fs=require('fs');const t=JSON.parse(fs.readFileSync('$B/faits-bon.json','utf8'));delete t.trace.base;fs.writeFileSync('$B/f75.json',JSON.stringify(t,null,2)+'\n')"
controle "75 receipt refus, faits sans base"     0 refus-nomme 1 "trace.base" node "$H" receipt --run "$B/r75" --case "$CAS" --faits "$B/f75.json" --verdict "non concluant"
node -e "const fs=require('fs');const t=JSON.parse(fs.readFileSync('$B/faits-bon.json','utf8'));t.trace.base='$B/absente.db';fs.writeFileSync('$B/f76.json',JSON.stringify(t,null,2)+'\n')"
controle "76 receipt refus, base absente"        0 refus-nomme 1 "n'existe pas" node "$H" receipt --run "$B/r76" --case "$CAS" --faits "$B/f76.json" --verdict "non concluant"

sqlite3 "$DBF" "insert into threads values('banc-hors','$B/ailleurs','local','','','codebuff','aucun',$D0);
insert into threads values('banc-distance','$W/terrain','remote','','','codebuff','aucun',$D0);
insert into threads values('banc-worktree','$W/terrain','local','freebuff/x','$B/wt','codebuff','aucun',$D0);
insert into threads values('banc-modele','$W/terrain','local','','','codebuff','autre-modele',$D0);
insert into threads values('banc-heure','$W/terrain','local','','','codebuff','aucun',$((D0+5000)));
insert into threads values('banc-sans-message','$W/terrain','local','','','codebuff','aucun',$D0);
insert into threads values('banc-debut','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-debut',1,'user',$((D0+5000)),'[]');"

faits-fil fil-absent "$B/f77.json"
controle "77 receipt refus, fil absent"          0 refus-nomme 1 "ne connaît aucun fil" node "$H" receipt --run "$B/r77" --case "$CAS" --faits "$B/f77.json" --verdict "non concluant"
faits-fil banc-hors "$B/f78.json"
controle "78 receipt refus, base hors de l'arbre" 0 refus-nomme 1 "ouvre" node "$H" receipt --run "$B/r78" --case "$CAS" --faits "$B/f78.json" --verdict "non concluant"
faits-fil banc-distance "$B/f79.json"
controle "79 receipt refus, mode non local"      0 refus-nomme 1 "s'exécute en" node "$H" receipt --run "$B/r79" --case "$CAS" --faits "$B/f79.json" --verdict "non concluant"
faits-fil banc-worktree "$B/f80.json"
controle "80 receipt refus, worktree"            0 refus-nomme 1 "worktree" node "$H" receipt --run "$B/r80" --case "$CAS" --faits "$B/f80.json" --verdict "non concluant"
faits-fil banc-modele "$B/f81.json"
controle "81 receipt refus, modèle démenti"      0 refus-nomme 1 "modèle" node "$H" receipt --run "$B/r81" --case "$CAS" --faits "$B/f81.json" --verdict "non concluant"
faits-fil banc-heure "$B/f82.json"
controle "82 receipt refus, ouverture démentie"  0 refus-nomme 1 "l'ouverture du fil" node "$H" receipt --run "$B/r82" --case "$CAS" --faits "$B/f82.json" --verdict "non concluant"
faits-fil banc-debut "$B/f83.json"
controle "83 receipt refus, début démenti"       0 refus-nomme 1 "premier message du fil" node "$H" receipt --run "$B/r83" --case "$CAS" --faits "$B/f83.json" --verdict "non concluant"
faits-fil banc-sans-message "$B/f84.json"
controle "84 receipt refus, aucun message user"  0 refus-nomme 1 "aucun message utilisateur" node "$H" receipt --run "$B/r84" --case "$CAS" --faits "$B/f84.json" --verdict "non concluant"

faits-fil banc "$B/f85.json"
controle "85 receipt, base concordante"          0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/r85','--case','$CAS','--faits','$B/f85.json','--verdict','non concluant'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/r85/receipt.json','utf8'));
process.exit(r.session_verifiee && r.session_verifiee.fil==='banc' && r.session_verifiee.modele==='aucun' && r.session_verifiee.ouverte_le==='$ISO0' ?0:1)"

controle "86 prérequis refus, sqlite3 absent au reçu" 0 refus-nomme 1 "« sqlite3 » est introuvable" env PATH="$B/sans-sqlite" "$NODE" "$H" receipt --run "$B/r85" --case "$CAS" --faits "$B/f85.json" --verdict "non concluant"

produit-run r87
printf 'dernier message de la session\n' > "$B/r87/raw/$CAS/last-message.md"
controle "87 receipt, dernier message admis et haché" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs'),crypto=require('crypto');
execFileSync('node',['$H','receipt','--run','$B/r87','--case','$CAS','--faits','$B/faits-bon.json','--verdict','non concluant'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/r87/receipt.json','utf8'));
const sha=crypto.createHash('sha256').update(fs.readFileSync('$B/r87/raw/$CAS/last-message.md')).digest('hex');
process.exit(r.produit.verifie && r.produit.verifie.last_message_sha256===sha?0:1)"

# 88-96 : H2 rejoue l'export depuis la base et hache la trace (ADR-032). Chaque cas qui touche le
# fichier a le sien : une trace réécrite pour un contrôle ne doit pas faire refuser le reçu d'un
# autre.
mkdir -p "$B/trace88"
export-fil banc-fenetre "$B/trace88/fenetre.jsonl" "$B/f88.json" || { echo "ARRET — l'export de 88 ne s'écrit pas"; exit 2; }
vide r88
controle "88 receipt, export intact et haché"     0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs'),crypto=require('crypto');
execFileSync('node',['$H','receipt','--run','$B/r88','--case','$CAS','--faits','$B/f88.json'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/r88/receipt.json','utf8'));
const sha=crypto.createHash('sha256').update(fs.readFileSync('$B/trace88/fenetre.jsonl')).digest('hex');
process.exit(r.trace_lue.sha256===sha && typeof r.trace_lue.rejoue_le==='string' && r.trace_lue.rejoue_le.length>0 ?0:1)"

export-fil banc-fenetre "$B/trace89.jsonl" "$B/f89.json" || { echo "ARRET — l'export de 89 ne s'écrit pas"; exit 2; }
printf '{"seq":9,"role":"user"}\n' >> "$B/trace89.jsonl"
vide r89
controle "89 receipt refus, un octet ajouté"     0 refus-nomme 1 "ne rend pas ce que la base rend" node "$H" receipt --run "$B/r89" --case "$CAS" --faits "$B/f89.json"

export-fil banc-fenetre "$B/trace90.jsonl" "$B/f90.json" || { echo "ARRET — l'export de 90 ne s'écrit pas"; exit 2; }
node -e "const fs=require('fs'),p='$B/trace90.jsonl';const l=fs.readFileSync(p,'utf8').split('\n').filter(x=>x!=='');
fs.writeFileSync(p,l.reverse().join('\n')+'\n')"
vide r90
controle "90 receipt refus, lignes permutées"    0 refus-nomme 1 "ne rend pas ce que la base rend" node "$H" receipt --run "$B/r90" --case "$CAS" --faits "$B/f90.json"

piece-h2() { # source (faits du banc), sortie — une copie où seule la commande bouge
  node -e "const fs=require('fs');const t=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));
t.trace.commande=process.argv[3];fs.writeFileSync(process.argv[2],JSON.stringify(t,null,2)+'\n')" "$1" "$2" "$3"
}
commande-de() { node -e "process.stdout.write(JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')).trace.commande)" "$1"; }
COMM88=$(commande-de "$B/f88.json") || { echo "ARRET — la pièce de 88 est illisible"; exit 2; }

piece-h2 "$B/f88.json" "$B/f91.json" "$(printf '%s' "$COMM88" | sed 's/ order by m.seq, json_each.key;/ order by m.seq;/')"
vide r91
controle "91 receipt refus, requête retouchée"   0 refus-nomme 1 "n'est pas la commande que ce run reconstruit" node "$H" receipt --run "$B/r91" --case "$CAS" --faits "$B/f91.json"

piece-h2 "$B/f88.json" "$B/f92.json" "$(printf '%s' "$COMM88" | sed "s#sqlite3 -readonly $DBF #sqlite3 -readonly $B/autre.db #")"
vide r92
controle "92 receipt refus, autre base citée"    0 refus-nomme 1 "n'est pas la commande que ce run reconstruit" node "$H" receipt --run "$B/r92" --case "$CAS" --faits "$B/f92.json"

piece-h2 "$B/f88.json" "$B/f94.json" "${COMM88% > *} > $B/trace88/ailleurs.jsonl"
vide r94
controle "94 receipt refus, autre chemin d'export" 0 refus-nomme 1 "n'est pas la commande que ce run reconstruit" node "$H" receipt --run "$B/r94" --case "$CAS" --faits "$B/f94.json"

sqlite3 "$DBF" <<SQL
insert into threads values('banc-apres','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-apres',1,'user',$D0,'[{"kind":"text","text":"banc"}]');
SQL
export-fil banc-apres "$B/trace93.jsonl" "$B/f93.json" || { echo "ARRET — l'export de 93 ne s'écrit pas"; exit 2; }
sqlite3 "$DBF" <<SQL
insert into messages values('banc-apres',2,'assistant',$(($D0+1000)),'[{"kind":"text","text":"banc, après l''export"}]');
SQL
vide r93
controle "93 receipt refus, message ajouté après l'export" 0 refus-nomme 1 "ne rend pas ce que la base rend" node "$H" receipt --run "$B/r93" --case "$CAS" --faits "$B/f93.json"

controle "95 compare, trace intacte"             0 node "$H" compare --run "$B/r88" --case "$CAS" --difference "banc : rien produit" --phrase "banc" --verdict "non concluant" --limites "ne mord pas"

export-fil banc-fenetre "$B/trace96.jsonl" "$B/f96.json" || { echo "ARRET — l'export de 96 ne s'écrit pas"; exit 2; }
vide r96
node "$H" receipt --run "$B/r96" --case "$CAS" --faits "$B/f96.json" >/dev/null || { echo "ARRET — le reçu de 96 ne s'écrit pas"; exit 2; }
printf '{"seq":99,"role":"user"}\n' >> "$B/trace96.jsonl"
controle "96 compare refus, trace réécrite"      0 refus-nomme 1 "ne rend plus son empreinte" node "$H" compare --run "$B/r96" --case "$CAS" --difference x --phrase y --verdict "non concluant" --limites "ne mord pas"

# 97-102 : le budget d'échanges du cas, mesuré contre les messages `user` du fil (ADR-033). Les fils
# portent `parts_json = '[]'`, donc l'export rejoué par H2 est vide comme `$B/trace/echange.jsonl`,
# et seul le compte des messages distingue les cas.
sqlite3 "$DBF" <<SQL
insert into threads values('banc-budget-1','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-budget-1',1,'user',$D0,'[]');
insert into threads values('banc-budget-3','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-budget-3',1,'user',$D0,'[]');
insert into messages values('banc-budget-3',2,'assistant',$D0,'[]');
insert into messages values('banc-budget-3',3,'user',$D0,'[]');
insert into messages values('banc-budget-3',4,'assistant',$D0,'[]');
insert into messages values('banc-budget-3',5,'user',$D0,'[]');
insert into threads values('banc-budget-4','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-budget-4',1,'user',$D0,'[]');
insert into messages values('banc-budget-4',2,'user',$D0,'[]');
insert into messages values('banc-budget-4',3,'user',$D0,'[]');
insert into messages values('banc-budget-4',4,'user',$D0,'[]');
SQL
faits-budget() { # fil, sortie — faits sur le fil, la trace vide étant déjà là (H2 exige l'export)
  node "$H" faits --case "$CAS" --base "$DBF" --fil "$1" --trace "$B/trace/echange.jsonl" --out "$2" \
    --par banc --fin "$ISO1" --conduite humain >/dev/null || { echo "ARRET — les faits de $1 ne s'écrivent pas"; exit 2; }
}
faits-budget banc-budget-1 "$B/f97.json"
faits-budget banc-budget-3 "$B/f98.json"
faits-budget banc-budget-4 "$B/f99.json"
faits-budget banc-budget-4 "$B/f100.json"
for r in r97 r98 r99 r100; do vide "$r"; done
controle "97 receipt, fil dans le budget"        0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/r97','--case','$CAS','--faits','$B/f97.json','--verdict','non concluant'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/r97/receipt.json','utf8'));
process.exit(r.echanges && r.echanges.budget===3 && r.echanges.utilises===1 && r.echanges.epuise_par===null ?0:1)"
controle "98 receipt, budget épuisé et nommé"      0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/r98','--case','$CAS','--faits','$B/f98.json','--verdict','non concluant'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/r98/receipt.json','utf8'));
process.exit(r.echanges.utilises===3 && r.echanges.epuise_par && r.echanges.epuise_par.seq===5 && Number.isFinite(r.echanges.epuise_par.ts) ?0:1)"
controle "99 receipt refus, dépassement du budget" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
let err='';
try{execFileSync('node',['$H','receipt','--run','$B/r99','--case','$CAS','--faits','$B/f99.json'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});process.exit(1)}
catch(e){err=String(e.stderr);process.exit(e.status===1 && err.includes('porte 4 messages utilisateur, le cas en autorise 3') && err.includes('seq 4') && !fs.existsSync('$B/r99/receipt.json') ?0:1)}"
controle "100 dépassement, non concluant compris" 0 refus-nomme 1 "un run qui dépasse le budget d'échanges" node "$H" receipt --run "$B/r100" --case "$CAS" --faits "$B/f100.json" --verdict "non concluant"

cas-budget() { # nom, retouche de l'attendu — un cas recopié, modifié, re-gelé (le motif des contrôles 21-26)
  mkdir -p "$B/$1"
  cp "$REPO/docs/device/CASES/$CAS.request.md" "$B/$1/"
  node -e "const fs=require('fs');const a=JSON.parse(fs.readFileSync('$REPO/docs/device/CASES/$CAS.expected.json','utf8'));$2;fs.writeFileSync('$B/$1/$CAS.expected.json',JSON.stringify(a,null,2)+'\n')"
  node "$H" freeze --case "$CAS" --cases "$B/$1" --refreeze --racine "$RACINE" \
    --arbre framework-origin="$FRAMEWORK" --arbre terrain="$TERRAIN" >/dev/null || { echo "ARRET — le re-gel de $1 ne s'écrit pas"; exit 2; }
}
cas-budget cases-sans-budget "delete a.demande.budget_echanges"
cas-budget cases-budget-zero "a.demande.budget_echanges=0"
vide r101 "$B/cases-sans-budget"
vide r102 "$B/cases-budget-zero"
controle "101 receipt refus, attendu sans budget"  0 refus-nomme 1 "ne déclare aucun budget" node "$H" receipt --run "$B/r101" --case "$CAS" --cases "$B/cases-sans-budget" --faits "$B/f97.json"
controle "102 receipt refus, budget illisible"     0 refus-nomme 1 "un entier positif" node "$H" receipt --run "$B/r102" --case "$CAS" --cases "$B/cases-budget-zero" --faits "$B/f97.json"

# 103-112 : la porte laisse une trace, et le reçu la confronte (H5, ADR-034). 104 à 108 et 112 partent
# d'une porte réelle produite par preflight, puis retouchent un seul champ : le motif des contrôles
# 21-26 et 101-102. Aucune porte n'est écrite à la main, sinon la forme que le contrôle 103 éprouve.
node "$H" collect --run "$B/r103" --case "$CAS" --sans-produit >/dev/null 2>&1 || { echo "ARRET — r103 ne se monte pas"; exit 2; }
controle "103 receipt refus, aucune porte"        0 refus-nomme 1 "aucune porte" node "$H" receipt --run "$B/r103" --case "$CAS" --faits "$B/faits-bon.json"

vide r104
node -e "const fs=require('fs'),p='$B/r104/gate.json';const g=JSON.parse(fs.readFileSync(p,'utf8'));
g.cas='un-autre-cas';fs.writeFileSync(p,JSON.stringify(g,null,2)+'\n')"
controle "104 receipt refus, porte d'un autre cas" 0 refus-nomme 1 "autorise le cas" node "$H" receipt --run "$B/r104" --case "$CAS" --faits "$B/faits-bon.json"

vide r105
controle "105 receipt refus, porte d'un gel regelé" 0 refus-nomme 1 "cite l'empreinte du gel" node "$H" receipt --run "$B/r105" --case "$CAS" --cases "$B/cases-budget-zero" --faits "$B/faits-bon.json"

vide r106
node -e "const fs=require('fs'),p='$B/r106/gate.json';const g=JSON.parse(fs.readFileSync(p,'utf8'));
g.arbre.porcelain=['?? ajoute-apres-la-porte'];fs.writeFileSync(p,JSON.stringify(g,null,2)+'\n')"
controle "106 receipt refus, porte d'un autre arbre" 0 refus-nomme 1 "n'a pas été passée sur l'arbre" node "$H" receipt --run "$B/r106" --case "$CAS" --faits "$B/faits-bon.json"

# 107 : le seul refus qui confronte la porte à une mesure postérieure. Il faut donc un arbre qui bouge
# vraiment entre les deux, et pas dans l'espace de travail : le clone des contrôles 10-11, un gel copié
# qui le nomme « travail », et un commit vide qui déplace le HEAD sans toucher au porcelain.
mkdir -p "$B/cases-h5"
cp "$GEL" "$B/cases-h5/$CAS.freeze.json"
node -e "const fs=require('fs'),p='$B/cases-h5/$CAS.freeze.json';const g=JSON.parse(fs.readFileSync(p,'utf8'));
g.arbres.find(a=>a.label==='travail').chemin='$B/faux-travail';fs.writeFileSync(p,JSON.stringify(g,null,2)+'\n')"
sqlite3 "$DBF" "insert into threads values('banc-h5','$B/faux-travail','local','','','codebuff','aucun',$D0);
insert into messages values('banc-h5',1,'user',$D0,'[]');"
: > "$B/trace-h5.jsonl"
node "$H" faits --case "$CAS" --cases "$B/cases-h5" --base "$DBF" --fil banc-h5 --trace "$B/trace-h5.jsonl" \
  --out "$B/f107.json" --par banc --fin "$ISO1" --conduite humain >/dev/null \
  || { echo "ARRET — les faits de 107 ne s'écrivent pas"; exit 2; }
node "$H" collect --run "$B/r107" --case "$CAS" --cases "$B/cases-h5" --sans-produit >/dev/null 2>&1 \
  || { echo "ARRET — r107 ne se monte pas"; exit 2; }
node "$H" preflight --run "$B/r107" --case "$CAS" --cases "$B/cases-h5" --repertoire "$B/faux-travail" >/dev/null 2>&1 \
  || { echo "ARRET — la porte de r107 ne s'écrit pas"; exit 2; }
git -C "$B/faux-travail" -c user.email=banc@exemple -c user.name=banc commit --allow-empty --quiet -m "banc : un commit apres la porte" \
  || { echo "ARRET — le commit de 107 ne s'écrit pas"; exit 2; }
controle "107 receipt refus, HEAD bougé depuis la porte" 0 refus-nomme 1 "a été commité pendant le run" node "$H" receipt --run "$B/r107" --case "$CAS" --cases "$B/cases-h5" --faits "$B/f107.json"

vide r108
node -e "const fs=require('fs'),p='$B/r108/gate.json';const g=JSON.parse(fs.readFileSync(p,'utf8'));
g.passe_le_epoch=g.gel.gele_le_epoch-1;fs.writeFileSync(p,JSON.stringify(g,null,2)+'\n')"
controle "108 receipt refus, porte antérieure au gel" 0 refus-nomme 1 "antérieure au gel" node "$H" receipt --run "$B/r108" --case "$CAS" --faits "$B/faits-bon.json"

vide r109
controle "109 receipt, porte intacte citée"       0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs'),crypto=require('crypto');
execFileSync('node',['$H','receipt','--run','$B/r109','--case','$CAS','--faits','$B/faits-bon.json','--verdict','non concluant'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/r109/receipt.json','utf8'));
const g=JSON.parse(fs.readFileSync('$B/r109/gate.json','utf8'));
const sha=crypto.createHash('sha256').update(fs.readFileSync('$B/r109/gate.json')).digest('hex');
process.exit(r.porte && r.porte.sha256===sha && r.porte.gel_empreinte===g.gel.empreinte && r.porte.arbre.head_complet===g.arbre.head_complet && r.porte.passe_le_epoch===g.passe_le_epoch ?0:1)"

node "$H" preflight --case "$CAS" --run "$B/p110" --repertoire "$W/terrain" >/dev/null 2>&1 || { echo "ARRET — la porte de p110 ne s'écrit pas"; exit 2; }
controle "110 preflight refus, porte déjà là"     0 refus-nomme 1 "existe déjà" node "$H" preflight --case "$CAS" --run "$B/p110" --repertoire "$W/terrain"
controle "111 preflight refus, --run manquant"    2 node "$H" preflight --case "$CAS" --repertoire "$W/terrain"

node -e "const fs=require('fs'),p='$B/r109/gate.json';const g=JSON.parse(fs.readFileSync(p,'utf8'));
g.passe_le_epoch=g.passe_le_epoch+1;fs.writeFileSync(p,JSON.stringify(g,null,2)+'\n')"
controle "112 compare refus, porte réécrite"      0 refus-nomme 1 "ne rend plus son empreinte" node "$H" compare --run "$B/r109" --case "$CAS" --difference x --phrase y --verdict "non concluant" --limites "ne mord pas"

# 113-118 et 172 : le tableau a une forme mécanique, et F1 et F2 la lisent (H6, ADR-035 ;
# une colonne acceptée depuis ADR-047). Les fils portent
# leurs parts, l'export reste celui du §1.5 exécuté par la commande que faits écrit : aucune trace n'est
# tapée à la main. Un tableau rendu dans une part `reasoning` ne compte pas (113 le mesure : le tableau
# gardé est celui de la part `text`), trois lignes sont exigées (114, 115), et une écriture est un `tool`
# dont le nom porte un des mots déclarés ET dont l'entrée nomme un chemin — mesuré sur la base du client
# de cette machine : `write_file` et `str_replace` portent `input.path`, `write_todos` porte `input.todos`
# et n'est donc pas une écriture (118 le mesure : aucune écriture avant le tableau, deux limites dites).
sqlite3 "$DBF" <<SQL
insert into threads values('banc-tableau','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-tableau',1,'user',$D0,'[{"kind":"text","text":"banc, la demande"}]');
insert into messages values('banc-tableau',2,'assistant',$(($D0+10000)),'[{"kind":"reasoning","text":"| capability | outil | preuve |\n| --- | --- | --- |\n| r | s | t |\n| u | v | w |"}]');
insert into messages values('banc-tableau',3,'assistant',$(($D0+20000)),'[{"kind":"text","text":"voici le tableau lu du depot.\n\n| capability | outil | preuve |\n| --- | --- | --- |\n| a | write_file | b |\n| c | str_replace | d |\n\nfin du tableau"}]');
insert into threads values('banc-prose','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-prose',1,'user',$D0,'[{"kind":"text","text":"banc, la demande"}]');
insert into messages values('banc-prose',2,'assistant',$(($D0+20000)),'[{"kind":"text","text":"une ligne | seule | ne fait pas un tableau."}]');
insert into threads values('banc-deux-lignes','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-deux-lignes',1,'user',$D0,'[{"kind":"text","text":"banc, la demande"}]');
insert into messages values('banc-deux-lignes',2,'assistant',$(($D0+20000)),'[{"kind":"text","text":"| capability | outil |\n| --- | --- |"}]');
insert into threads values('banc-ecriture','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-ecriture',1,'user',$D0,'[{"kind":"text","text":"banc, la demande"}]');
insert into messages values('banc-ecriture',2,'assistant',$(($D0+10000)),'[{"kind":"tool","toolName":"write_file","input":{"path":"terrain/aidd_docs/x.md"},"status":"success"}]');
insert into messages values('banc-ecriture',3,'assistant',$(($D0+20000)),'[{"kind":"text","text":"| capability | outil | preuve |\n| --- | --- | --- |\n| a | b | c |\n| d | e | f |"}]');
insert into threads values('banc-sans-nom','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-sans-nom',1,'user',$D0,'[{"kind":"text","text":"banc, la demande"}]');
insert into messages values('banc-sans-nom',2,'assistant',$(($D0+8000)),'[{"kind":"tool","toolName":"write_todos","input":{"todos":[]},"status":"success"}]');
insert into messages values('banc-sans-nom',3,'assistant',$(($D0+10000)),'[{"kind":"tool","input":{"command":"ls"},"status":"success"}]');
insert into messages values('banc-sans-nom',4,'assistant',$(($D0+20000)),'[{"kind":"text","text":"| capability | outil | preuve |\n| --- | --- | --- |\n| a | b | c |\n| d | e | f |"}]');
insert into threads values('banc-une-colonne','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-une-colonne',1,'user',$D0,'[{"kind":"text","text":"banc, la demande"}]');
insert into messages values('banc-une-colonne',2,'assistant',$(($D0+20000)),'[{"kind":"text","text":"| File Path |\n| --- |\n| terrain/app.py |\n| terrain/README.md |"}]');
insert into threads values('banc-lecture-hors','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-lecture-hors',1,'user',$D0,'[{"kind":"text","text":"banc, la demande"}]');
insert into messages values('banc-lecture-hors',2,'assistant',$(($D0+20000)),'[{"kind":"tool","toolName":"read","input":{"path":"$RACINE/autre-cas/kit.md"},"status":"success"},{"kind":"text","text":"| File Path |\n| --- |\n| terrain/app.py |\n| terrain/README.md |"}]');
insert into threads values('banc-lecture-dans','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-lecture-dans',1,'user',$D0,'[{"kind":"text","text":"banc, la demande"}]');
insert into messages values('banc-lecture-dans',2,'assistant',$(($D0+20000)),'[{"kind":"tool","toolName":"read","input":{"path":"$W/terrain/README.md"},"status":"success"},{"kind":"text","text":"| File Path |\n| --- |\n| terrain/app.py |\n| terrain/README.md |"}]');
SQL
mkdir -p "$B/trace-h6"
export-fil banc-tableau "$B/trace-h6/tableau.jsonl" "$B/f113.json" || { echo "ARRET — l'export de 113 ne s'écrit pas"; exit 2; }
export-fil banc-prose "$B/trace-h6/prose.jsonl" "$B/f114.json" || { echo "ARRET — l'export de 114 ne s'écrit pas"; exit 2; }
export-fil banc-deux-lignes "$B/trace-h6/deux.jsonl" "$B/f115.json" || { echo "ARRET — l'export de 115 ne s'écrit pas"; exit 2; }
export-fil banc-ecriture "$B/trace-h6/ecriture.jsonl" "$B/f116.json" || { echo "ARRET — l'export de 116 ne s'écrit pas"; exit 2; }
export-fil banc-tableau "$B/trace-h6/tableau117.jsonl" "$B/f117.json" || { echo "ARRET — l'export de 117 ne s'écrit pas"; exit 2; }
export-fil banc-sans-nom "$B/trace-h6/sansnom.jsonl" "$B/f118.json" || { echo "ARRET — l'export de 118 ne s'écrit pas"; exit 2; }
export-fil banc-une-colonne "$B/trace-h6/unecolonne.jsonl" "$B/f172.json" || { echo "ARRET — l'export de 172 ne s'écrit pas"; exit 2; }
export-fil banc-lecture-hors "$B/trace-h6/lecture-hors.jsonl" "$B/f176.json" || { echo "ARRET — l'export de 176 ne s'écrit pas"; exit 2; }
export-fil banc-lecture-dans "$B/trace-h6/lecture-dans.jsonl" "$B/f178.json" || { echo "ARRET — l'export de 178 ne s'écrit pas"; exit 2; }
# 113 : le positif doit être propre des deux côtés, et il ne l'était pas. La fixture copie le README du
# terrain, né le 2026-10-15 à 13:33, donc avant le gel : F1 mordait, et la condition 1 avec, sans que le
# contrôle dise rien du tableau. Le `birth` enregistré est reculé (la copie sous raw/ ne bouge pas), dix
# secondes après le tableau : le contrôle mesure alors l'absence de morsure, que rien d'autre n'éprouvait.
produit-run r113
node -e "const fs=require('fs'),p='$B/r113/raw/$CAS/manifest.json';const m=JSON.parse(fs.readFileSync(p,'utf8'));
m.fichiers[0].birth_epoch=$(($D0/1000+30));m.fichiers[0].birth=new Date(m.fichiers[0].birth_epoch*1000).toISOString();
fs.writeFileSync(p,JSON.stringify(m,null,2)+'\n')"
vide r114
vide r115
vide r116
produit-run r117
vide r118
vide r172
# F1 contre l'instant du tableau, pas contre le gel : la naissance du produit est reculée à dix secondes
# après le début du run, vingt secondes avant le tableau (le manifeste est édité, la copie ne bouge pas).
node -e "const fs=require('fs'),p='$B/r117/raw/$CAS/manifest.json';const m=JSON.parse(fs.readFileSync(p,'utf8'));
m.fichiers[0].birth_epoch=$(($D0/1000+10));m.fichiers[0].birth=new Date(m.fichiers[0].birth_epoch*1000).toISOString();
fs.writeFileSync(p,JSON.stringify(m,null,2)+'\n')"
controle "113 receipt, tableau lu, reasoning écarté" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/r113','--case','$CAS','--faits','$B/f113.json','--verdict','non concluant'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/r113/receipt.json','utf8'));
process.exit(r.tableau.present===true && r.tableau.lignes===4 && r.tableau.colonnes===3 && r.tableau.seq===3 && r.tableau.ts===$(($D0+20000)) && r.falsificateurs.tableau_absent===false && r.falsificateurs.ecriture_avant_tableau.length===0 && r.falsificateurs.produit_ne_avant_le_tableau.length===0 ?0:1)"
controle "114 receipt refus, une ligne de prose"   0 refus-nomme 1 "la trace ne porte aucun tableau rendu par la session" node "$H" receipt --run "$B/r114" --case "$CAS" --faits "$B/f114.json" --verdict conforme
controle "115 receipt refus, tableau de deux lignes" 0 refus-nomme 1 "la trace ne porte aucun tableau rendu par la session" node "$H" receipt --run "$B/r115" --case "$CAS" --faits "$B/f115.json" --verdict conforme
controle "116 receipt refus, écriture avant le tableau" 0 refus-nomme 1 "une écriture précède le tableau : seq 2, outil « write_file »" node "$H" receipt --run "$B/r116" --case "$CAS" --faits "$B/f116.json" --verdict conforme
controle "117 receipt refus, produit né avant le tableau" 0 refus-nomme 1 "un produit est né avant le tableau : README.md" node "$H" receipt --run "$B/r117" --case "$CAS" --faits "$B/f117.json" --verdict conforme
controle "118 receipt, outils sans nom = limites dites" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/r118','--case','$CAS','--faits','$B/f118.json','--verdict','non concluant'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/r118/receipt.json','utf8'));
process.exit(r.tableau.present===true && r.falsificateurs.ecriture_avant_tableau.length===0 && r.limites.some(l=>l.includes('la trace ne porte pas le nom des outils')) && r.limites.some(l=>l.includes('ne nomment aucun chemin : write_todos')) ?0:1)"
controle "172 receipt, tableau d'une colonne accepté" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/r172','--case','$CAS','--faits','$B/f172.json','--verdict','non concluant'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/r172/receipt.json','utf8'));
process.exit(r.tableau.present===true && r.tableau.lignes===4 && r.tableau.colonnes===1 && r.falsificateurs.tableau_absent===false ?0:1)"
# 173-174 : la phrase du juge nomme parfois un nombre de colonnes. Le reçu en mesure un : six le
# dément (173, refus nommé, aucun output), une le confirme (174, output écrit sur une copie du run ;
# la copie est prise avant le refus, qui n'écrit rien). La règle du code est mécanique — chiffres ou
# mots de un à vingt — et BANC.md dit ce qu'elle ne voit pas.
cp -a "$B/r172" "$B/r172b"
controle "173 compare refus, phrase contraire aux colonnes" 0 refus-nomme 1 "la phrase cite 6 colonnes, le reçu en mesure 1" node "$H" compare --run "$B/r172" --case "$CAS" --difference "banc : phrase contraire" --phrase "un tableau de six colonnes" --verdict "non concluant" --limites "ne mord pas"
controle "174 compare, phrase conforme aux colonnes" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','compare','--run','$B/r172b','--case','$CAS','--difference','banc : phrase conforme','--phrase','un tableau d une colonne','--verdict','non concluant','--limites','ne mord pas'],{stdio:'ignore'});
const o=JSON.parse(fs.readFileSync('$B/r172b/output.json','utf8'));
process.exit(o.phrase==='un tableau d une colonne' ?0:1)"

# 119-130 : le cas jouet, et sa première fixture de bout en bout (ADR-036). Douze contrôles qui
# traversent la chaîne entière sur UN cas, sans session : le script compagnon rend les mêmes têtes dans
# deux bacs (119) et refuse un bac déjà peuplé (120), le gel du bac rend l'empreinte du gel committé avec
# zéro référence et des `refs_distants` vides (121), la porte s'écrit et nomme l'arbre « travail » (122)
# et ne s'écrase pas (123), le produit se collecte (124), les faits se dérivent du fil (125), le reçu
# conclut `conforme` (126) et refuse deux fois — F2 sur un fil sans tableau (127), F1 sur un produit né
# avant lui (128) —, le juge écrit son output (129), et les deux pièces du cas tiennent sur une page
# (130). Tout vit sous $B : le gel committé du jouet n'est jamais retouché, et rien n'est écrit hors du
# bac. Le gel du bac est pris au passage ; ses instants bornent la fixture (le fil de 128 est daté après
# lui, sinon la condition 1 du §5 mordrait avec F1 et le refus ne nommerait plus F1 seul).
JOUET=2026-10-18-085308-cas-jouet
JS="$REPO/docs/device/CASES/$JOUET-arbres.sh"
JGEL="$REPO/docs/device/CASES/$JOUET.freeze.json"
[ -f "$JS" ] || { echo "ARRET — script compagnon du cas jouet absent : $JS"; exit 2; }
[ -f "$JGEL" ] || { echo "ARRET — gel du cas jouet absent : $JGEL"; exit 2; }
JT="$B/jouet/a"; JB="$B/jouet/b"
mkdir -p "$JT" "$JB" "$B/jouet/cases"
bash "$JS" "$JT" >/dev/null || { echo "ARRET — les arbres du jouet ne s'écrivent pas (a)"; exit 2; }
bash "$JS" "$JB" >/dev/null || { echo "ARRET — les arbres du jouet ne s'écrivent pas (b)"; exit 2; }
JROOT="$JB/$JOUET"

controle "119 le script du jouet rend les mêmes têtes" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const tete=(d)=>execFileSync('git',['-C',d,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
const gele=JSON.parse(fs.readFileSync('$JGEL','utf8'));
const attendu=(l)=>gele.arbres.find(a=>a.label===l).head_complet;
const a1=tete('$JT/$JOUET/framework-origin'), b1=tete('$JB/$JOUET/framework-origin');
const a2=tete('$JT/$JOUET/terrain'), b2=tete('$JB/$JOUET/terrain');
process.exit(a1===b1 && a2===b2 && a1===attendu('revision-sous-test') && a2===attendu('travail') ?0:1)"
controle "120 le script refuse un bac déjà peuplé" 0 refus-nomme 1 "REFUS" bash "$JS" "$JT"

cp "$REPO/docs/device/CASES/$JOUET.request.md" "$REPO/docs/device/CASES/$JOUET.expected.json" "$B/jouet/cases/"
controle "121 freeze du jouet, empreinte committée, refs vides" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','freeze','--case','$JOUET','--cases','$B/jouet/cases','--racine','$JB',
  '--arbre','framework-origin=$JROOT/origine/framework','--arbre','terrain=$JROOT/origine/terrain'],{stdio:'ignore'});
const g=JSON.parse(fs.readFileSync('$B/jouet/cases/$JOUET.freeze.json','utf8'));
const com=JSON.parse(fs.readFileSync('$JGEL','utf8'));
const declarees=g.arbres.filter(a=>a.label==='framework-origin'||a.label==='terrain');
const vides=g.references.length===0 && declarees.every(a=>a.refs_distants.length===0 && a.remotes.length===0);
process.exit(g.empreinte===com.empreinte && vides ?0:1)"

# Les trois portes sont passées AVANT le produit : `preflight` refuse un arbre qui a bougé depuis le
# gel, et le produit écrit à l'étape suivante est exactement ce qui le fait bouger (contrôle 122 du
# cas réel, même règle ; c'est pourquoi la chaîne passe la porte avant d'ouvrir la session).
porte-jouet() { # nom-du-run — une porte sur l'arbre du jouet, écrite par preflight
  node "$H" preflight --run "$B/jouet/$1" --case "$JOUET" --cases "$B/jouet/cases" --repertoire "$JROOT/terrain" >/dev/null 2>&1 \
    || { echo "ARRET — la porte du jouet $1 ne s'écrit pas"; exit 2; }
}
porte-jouet r124
controle "122 la porte du jouet nomme l'arbre travail" 0 node -e "
const g=JSON.parse(require('fs').readFileSync('$B/jouet/r124/gate.json','utf8'));
process.exit(g.arbre.label==='travail' && g.arbre.chemin==='$JROOT/terrain' ?0:1)"
controle "123 preflight refuse une porte déjà là" 0 refus-nomme 1 "existe déjà" node "$H" preflight --run "$B/jouet/r124" --case "$JOUET" --cases "$B/jouet/cases" --repertoire "$JROOT/terrain"
porte-jouet r127
porte-jouet r128

# Le produit, écrit après la porte et après le gel (le `sleep` évite la limite de résolution du `birth`,
# qui mordrait sinon à une seconde du gel) ; le fil du banc est fabriqué autour de sa naissance réelle.
sleep 2
mkdir -p "$JROOT/terrain/aidd_docs"
printf 'Read the repository before writing anything.\nShow what you read as a table, one row per file, and wait for the operator.\nWrite one file only, where the operator asked, after the table is confirmed.\n' \
  > "$JROOT/terrain/aidd_docs/NOTES.md"
P=$(stat -c %Y "$JROOT/terrain/aidd_docs/NOTES.md")
T_JOUET=$(node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync('$B/jouet/cases/$JOUET.freeze.json','utf8')).gele_le_epoch))")
TXT_JOUET=$(sed -n '/^<<<DEMANDE$/,/^>>>DEMANDE$/p' "$REPO/docs/device/CASES/$JOUET.request.md" | sed '1d;$d' | sed "s|\$RACINE|$JB|g")
printf '%s' "$TXT_JOUET" > "$B/jouet/texte.txt"
TABLE_J=$'| fichier | objet |\n| --- | --- |\n| README.md | le terrain du jouet |\n| app.py | une ligne |'
printf '%s\n' "$TABLE_J" > "$B/jouet/tableau.txt"
# Le fil de 128 est daté après le gel du bac, sinon la condition 1 du §5 (naissance avant le gel) mordrait
# avec F1 et le refus ne nommerait plus F1 seul ; le produit, lui, naît pour de vrai, après la porte.
J1=$(( ($T_JOUET + 1) * 1000 ))
J2=$(( ($T_JOUET + 60) * 1000 ))
sqlite3 "$DBF" <<SQL
insert into threads values('jouet-banc','$JROOT/terrain','local','','','codebuff','aucun',$P);
insert into messages values('jouet-banc',1,'user',$(($P-40000)),json_array(json_object('kind','text','text','$TXT_JOUET')));
insert into messages values('jouet-banc',2,'assistant',$(($P-20000)),json_array(json_object('kind','text','text','banc, le tableau du jouet :'||char(10)||char(10)||'$TABLE_J')));
insert into messages values('jouet-banc',3,'assistant',$(($P-10000)),json_array(json_object('kind','tool','toolName','write_file','input',json_object('path','$JROOT/terrain/aidd_docs/NOTES.md'),'status','success')));
insert into threads values('jouet-sans-tableau','$JROOT/terrain','local','','','codebuff','aucun',$P);
insert into messages values('jouet-sans-tableau',1,'user',$(($P-40000)),json_array(json_object('kind','text','text','$TXT_JOUET')));
insert into messages values('jouet-sans-tableau',2,'assistant',$(($P-20000)),json_array(json_object('kind','text','text','banc : une ligne de prose, aucun tableau.')));
insert into threads values('jouet-f1','$JROOT/terrain','local','','','codebuff','aucun',$J1);
insert into messages values('jouet-f1',1,'user',$J1,json_array(json_object('kind','text','text','$TXT_JOUET')));
insert into messages values('jouet-f1',2,'assistant',$J2,json_array(json_object('kind','text','text','banc, le tableau du jouet, daté après la naissance du produit :'||char(10)||char(10)||'$TABLE_J')));
SQL

controle "124 collect du produit du jouet" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','collect','--run','$B/jouet/r124','--case','$JOUET','--cases','$B/jouet/cases','--from','$JROOT/terrain/aidd_docs'],{stdio:'ignore'});
process.exit(fs.existsSync('$B/jouet/r124/raw/$JOUET/NOTES.md') && fs.existsSync('$B/jouet/r124/raw/$JOUET/manifest.json') ?0:1)"

# L'export du §1.5, puis les faits : le fichier est la sortie de la commande que faits écrit (H2),
# jamais une trace tapée à la main — le motif des contrôles 66 à 118.
export-jouet() { # fil, trace, faits
  : > "$2"
  node "$H" faits --case "$JOUET" --cases "$B/jouet/cases" --base "$DBF" --fil "$1" --trace "$2" --out "$3" \
    --par banc --fin "$(date -Is)" --conduite humain >/dev/null || return 1
  bash -c "$(node -e "process.stdout.write(require('$3').trace.commande)")"
}
mkdir -p "$B/jouet/trace"
: > "$B/jouet/trace/echange.jsonl"
controle "125 faits du jouet, dix-huit valeurs dérivées du fil" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','faits','--case','$JOUET','--cases','$B/jouet/cases','--base','$DBF','--fil','jouet-banc','--trace','$B/jouet/trace/echange.jsonl','--out','$B/jouet/r124/faits.json','--par','banc','--fin','$(date -Is)','--conduite','humain'],{stdio:'ignore'});
const f=JSON.parse(fs.readFileSync('$B/jouet/r124/faits.json','utf8'));
let n=0; const compte=(v)=>{ if (v && typeof v==='object') Object.values(v).forEach(compte); else n++; };
compte(f);
// 18 depuis ADR-044 : session.outil et trace.client s'ajoutent aux seize valeurs du fil (deux additions, pas un affaiblissement).
process.exit(n===18 ?0:1)"
# L'export du §1.5, exécuté après les faits : le fichier est la sortie de la commande que faits a écrite,
# jamais une trace tapée à la main (H2, ADR-032).
E=$(node -e "process.stdout.write(require('$B/jouet/r124/faits.json').trace.commande)") || { echo "ARRET — faits du jouet illisible"; exit 2; }
bash -c "$E" || { echo "ARRET — l'export du jouet ne s'écrit pas"; exit 2; }
controle "126 le reçu du jouet conclut conforme" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/jouet/r124','--case','$JOUET','--cases','$B/jouet/cases','--faits','$B/jouet/r124/faits.json','--verdict','conforme'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/jouet/r124/receipt.json','utf8'));
const muets=Object.values(r.falsificateurs).every(v=>Array.isArray(v)?v.length===0:v===false);
process.exit(r.verdict==='conforme' && r.tableau.present===true && muets ?0:1)"

# 127 et 128 : les deux refus qui font mordre F2 et F1 sur un cas entier. Chacun a son dossier de run,
# sa copie et son fil : un reçu écrit ne se réécrit pas, et deux refus ne partagent pas une porte.
node "$H" collect --run "$B/jouet/r127" --case "$JOUET" --cases "$B/jouet/cases" --from "$JROOT/terrain/aidd_docs" >/dev/null 2>&1 \
  || { echo "ARRET — le collect de 127 ne s'écrit pas"; exit 2; }
export-jouet jouet-sans-tableau "$B/jouet/trace/sans-tableau.jsonl" "$B/jouet/r127/faits.json" \
  || { echo "ARRET — l'export de 127 ne s'écrit pas"; exit 2; }
controle "127 receipt refus, fil sans tableau (F2)" 0 refus-nomme 1 "F2" node "$H" receipt --run "$B/jouet/r127" --case "$JOUET" --cases "$B/jouet/cases" --faits "$B/jouet/r127/faits.json" --verdict conforme

node "$H" collect --run "$B/jouet/r128" --case "$JOUET" --cases "$B/jouet/cases" --from "$JROOT/terrain/aidd_docs" >/dev/null 2>&1 \
  || { echo "ARRET — le collect de 128 ne s'écrit pas"; exit 2; }
export-jouet jouet-f1 "$B/jouet/trace/f1.jsonl" "$B/jouet/r128/faits.json" \
  || { echo "ARRET — l'export de 128 ne s'écrit pas"; exit 2; }
node -e "const fs=require('fs'),p='$B/jouet/r128/raw/$JOUET/manifest.json';
const m=JSON.parse(fs.readFileSync(p,'utf8'));
m.fichiers[0].birth_epoch=$J1/1000+10;m.fichiers[0].birth=new Date(m.fichiers[0].birth_epoch*1000).toISOString();
fs.writeFileSync(p,JSON.stringify(m,null,2)+'\n')" || { echo "ARRET — la retouche de 128 ne s'écrit pas"; exit 2; }
controle "128 receipt refus, produit né avant le tableau (F1)" 0 refus-nomme 1 "F1" node "$H" receipt --run "$B/jouet/r128" --case "$JOUET" --cases "$B/jouet/cases" --faits "$B/jouet/r128/faits.json" --verdict conforme

controle "129 compare du jouet, output écrit" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','compare','--run','$B/jouet/r124','--case','$JOUET','--cases','$B/jouet/cases','--difference','aucune : le produit porte l unique chemin du §6','--phrase','banc : la chaîne traverse le cas jouet entier.','--verdict','conforme','--limites','ne mord pas'],{stdio:'ignore'});
const o=JSON.parse(fs.readFileSync('$B/jouet/r124/output.json','utf8'));
process.exit(o.verdict==='conforme' ?0:1)"
controle "130 les deux pièces du jouet tiennent sur une page" 0 node -e "
const fs=require('fs');
const lignes=(p)=>fs.readFileSync(p,'utf8').split('\n').length-1;
const d='$REPO/docs/device/CASES/$JOUET';
const req=lignes(d+'.request.md'), att=lignes(d+'.expected.json');
process.exit(req<=55 && att<=60 && req+att<=115 ?0:1)"


# 131-145 : l'orchestrateur interactif (ADR-038 a 040) — les douze refus du §7 de la spec, deux
# acceptations (un cas fabrique puis gele, un reçu de bout en bout), et le compte des lignes d'un bloc.
# Rien n'ouvre de session : le fil est une ligne dans la base du banc, et le produit est ecrit a la
# main, comme aux contrôles 124 a 130. `cas` n'ecrit que sous $O, jamais dans CASES/.
ORCH="$REPO/docs/device/harness/orchestrer.mjs"
O="$B/orch"
OSKILL="$JT/$JOUET/origine/framework/PLAYBOOK.md"
OTERRAIN="$JT/$JOUET/origine/terrain"
mkdir -p "$O/cases" "$O/runsansporte"
controle "131 refus 1, cas sans --skill" 0 refus-nomme 1 "obligatoire" bash -c "node '$ORCH' cas --id sans-skill --cases '$O/cases' --racine '$O' </dev/null"
controle "132 refus 1, skill introuvable" 0 refus-nomme 1 "introuvable" bash -c "node '$ORCH' cas --skill '$O/absent.md' --cases '$O/cases' --racine '$O' </dev/null"
controle "133 cas fabrique et gele, deux pieces" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','cas','--skill','$OSKILL','--terrain','$OTERRAIN','--id','cas-test','--racine','$O','--cases','$O/cases','--budget','2'],{stdio:'ignore',input:'',encoding:'utf8'});
const g=JSON.parse(fs.readFileSync('$O/cases/cas-test.freeze.json','utf8'));
const pieces=['request.md','expected.json','freeze.json'].every(p=>fs.existsSync('$O/cases/cas-test.'+p));
process.exit(pieces && g.arbres.length===4 && g.racine_espace_de_travail==='$O' ?0:1)"
controle "134 refus 4, cas deja la" 0 refus-nomme 1 "existe déjà" bash -c "node '$ORCH' cas --skill '$OSKILL' --terrain '$OTERRAIN' --id cas-test --racine '$O' --cases '$O/cases' </dev/null"
controle "135 refus 11, budget hors domaine" 0 refus-nomme 2 "hors domaine" bash -c "node '$ORCH' cas --skill '$OSKILL' --terrain '$OTERRAIN' --id budget-zero --racine '$O' --cases '$O/cases' --budget 0 </dev/null"
controle "136 porte du cas fabrique" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','porte','--cas','cas-test','--cases','$O/cases','--run','$O/run','--repertoire','$O/cas-test/terrain'],{stdio:'ignore'});
const g=JSON.parse(fs.readFileSync('$O/run/gate.json','utf8'));
process.exit(g.cas==='cas-test' && fs.existsSync('$O/run/texte-a-remettre.txt') ?0:1)"
controle "137 refus 6, porte deja la" 0 refus-nomme 1 "existe déjà" node "$ORCH" porte --cas cas-test --cases "$O/cases" --run "$O/run"
# 210 et 211 : les deux defauts mesures le 2026-10-21 (Seance 96). 210 : le defaut de --id prenait
# basename(skill), donc SKILL/PLAYBOOK en majuscules sortait du domaine et `cas` refusait sans rien
# ecrire. 211 : `porte` coupait le JSON de la porte a 220 caracteres dans `obtenu`, au milieu d'un
# chemin ; il doit montrer la ligne entiere que preflight a ecrite.
rm -rf "$O/cases-id"
controle "210 cas sans --id, skill en fichier" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','cas','--skill','$OSKILL','--terrain','$OTERRAIN','--racine','$O','--cases','$O/cases-id'],{stdio:'ignore',input:'',encoding:'utf8'});
const noms=fs.readdirSync('$O/cases-id').filter((n)=>n.endsWith('.request.md'));
if(noms.length!==1) process.exit(1);
const id=noms[0].replace(/\.request\.md$/,'');
process.exit(/^[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{6}-playbook$/.test(id)&&['request.md','expected.json','freeze.json'].every((p)=>fs.existsSync('$O/cases-id/'+id+'.'+p))?0:1)"
controle "211 porte, obtenu recopie preflight" 0 node -e "
const {execFileSync}=require('child_process');
const out=execFileSync('node',['$ORCH','porte','--cas','cas-test','--cases','$O/cases','--run','$O/run-obtenu','--repertoire','$O/cas-test/terrain'],{encoding:'utf8'});
const l=out.split('\n').find((x)=>x.startsWith('  obtenu              :'));
if(!l) process.exit(1);
const v=l.slice(l.indexOf(':')+1).trim();
process.exit(v.startsWith('preflight ok')&&v.includes('gate.json')&&v.length>220?0:1)"
controle "138 refus 8, suite avant la porte" 0 refus-nomme 1 "aucune porte" bash -c "node '$ORCH' suite --cas cas-test --cases '$O/cases' --run '$O/runsansporte' --fil rien </dev/null"
controle "139 refus 7, fil inconnu du client" 0 refus-nomme 1 "n'existe dans aucune base" bash -c "HOME='$O/home' node '$ORCH' suite --cas cas-test --cases '$O/cases' --run '$O/run' --fil fantome </dev/null"
# Le produit nait apres le gel (le sleep evite la resolution du birth), et son fil est fabrique autour
# de lui dans une copie de la base du banc : l'orchestrateur decouvre la base par $HOME, comme sur un poste.
sleep 2
mkdir -p "$O/cas-test/terrain/aidd_docs"
printf 'Read the repository before writing.\nShow what you read as a table.\nWrite one file only.\n' > "$O/cas-test/terrain/aidd_docs/NOTES.md"
OP=$(date +%s)
OTABLE=$'| fichier | objet |\n| --- | --- |\n| PLAYBOOK.md | trois regles |'
sqlite3 "$DBF" <<SQL
insert into threads values('orch-fil','$O/cas-test/terrain','local','','','codebuff','aucun',$(($OP-600)));
insert into messages values('orch-fil',1,'user',$(($OP-400))*1000,json_array(json_object('kind','text','text','Read the skill at $O/cas-test/framework-origin/PLAYBOOK.md and use it on this repository.')));
insert into messages values('orch-fil',2,'assistant',$(($OP-30))*1000,json_array(json_object('kind','text','text','banc, le tableau :'||char(10)||char(10)||'$OTABLE')));
insert into messages values('orch-fil',3,'user',$(($OP-20))*1000,json_array(json_object('kind','text','text','vas-y')));
insert into messages values('orch-fil',4,'assistant',$(($OP-5))*1000,json_array(json_object('kind','tool','toolName','write_file','input',json_object('path','$O/cas-test/terrain/aidd_docs/NOTES.md'),'status','success')));
SQL
mkdir -p "$O/home/.config/freebuff-desktop/projects/banc"
cp "$DBF" "$O/home/.config/freebuff-desktop/projects/banc/desktop-v2.db"
controle "140 suite, faits, trace et copie" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','suite','--cas','cas-test','--cases','$O/cases','--run','$O/run','--fil','orch-fil','--produit','aidd_docs','--conduite','humain'],{stdio:'ignore',env:{...process.env,HOME:'$O/home'}});
const f=JSON.parse(fs.readFileSync('$O/run/faits.json','utf8'));
process.exit(f.session.identifiant==='orch-fil' && fs.existsSync('$O/run/raw/cas-test/NOTES.md') && fs.readFileSync('$O/run/trace/echange.jsonl','utf8').length>0 ?0:1)"
# 242 : `suite` écrit le dernier message et l'atteste (ADR-065). Le fichier porte la dernière part `text`
# d'un message assistant de la trace exportée, faits.json en cite l'empreinte, et le reçu à blanc accepte.
controle "242 suite, dernier message écrit et attesté" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs'),crypto=require('crypto');
const run='$O/run', cas='cas-test', r=[];
const p=run+'/raw/'+cas+'/last-message.md';
const f=JSON.parse(fs.readFileSync(run+'/faits.json','utf8'));
const dm=f.dernier_message||{};
if(!fs.existsSync(p)) r.push('last-message.md absent');
else {
  const t=fs.readFileSync(p,'utf8');
  const parts=fs.readFileSync(run+'/trace/echange.jsonl','utf8').split('\n').filter(Boolean).map((l)=>JSON.parse(l));
  const dernier=parts.filter((x)=>x.role==='assistant'&&x.kind==='text'&&typeof x.text==='string').pop();
  if(!dernier) r.push('la trace ne porte aucun texte assistant');
  else if(t!==dernier.text) r.push('le fichier ne dit pas le texte de la trace');
  const sha=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  if(dm.sha256!==sha) r.push('faits.dernier_message.sha256 ne rend pas le fichier');
  if(dm.chemin!==p) r.push('faits.dernier_message.chemin : '+dm.chemin);
}
let code=0,sortie='';
try{execFileSync('node',['$H','receipt','--run',run,'--case',cas,'--cases','$O/cases','--faits',run+'/faits.json','--sans-ecrire'],{encoding:'utf8',stdio:['ignore','pipe','pipe']})}catch(e){code=e.status;sortie=String(e.stderr||'')}
if(code!==0) r.push('receipt --sans-ecrire refuse : '+sortie.split('\n')[0]);
if(r.length){fs.writeFileSync(process.env.DETAIL,r.join('\n')+'\n');process.exit(1)}"

# Depuis l'ADR-065, `suite` écrit lui-même `last-message.md` : le refus 9 se mesure sur un run privé de
# la pièce, et la pièce est restaurée **octet pour octet** — un texte retapé ne rendrait plus l'empreinte
# que les faits attestent, et le reçu de 143 le refuserait, à raison.
cp "$O/run/raw/cas-test/last-message.md" "$B/last-message-140.md"
rm -f "$O/run/raw/cas-test/last-message.md"
controle "141 refus 9, fin sans last-message" 0 refus-nomme 1 "last-message.md" node "$ORCH" fin --cas cas-test --cases "$O/cases" --run "$O/run" --difference "aucune" --phrase "banc"
cp "$B/last-message-140.md" "$O/run/raw/cas-test/last-message.md"
controle "142 refus 10, verdict interdit par la preuve" 0 refus-nomme 1 "attendu_incomplet" node "$ORCH" fin --cas cas-test --cases "$O/cases" --run "$O/run" --difference "aucune" --phrase "banc" --verdict conforme
controle "143 fin, recu et output du cas fabrique" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','fin','--cas','cas-test','--cases','$O/cases','--run','$O/run','--difference','aucune : le produit porte le chemin nomme','--phrase','banc : la chaine traverse un cas fabrique','--verdict','non concluant','--limites','ne mord pas'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$O/run/receipt.json','utf8')),o=JSON.parse(fs.readFileSync('$O/run/output.json','utf8'));
process.exit(r.verdict==='non concluant' && r.limites.some(l=>l.includes('attendu_incomplet')) && o.verdict==='non concluant' ?0:1)"
# 243 : un dernier message retouché fait refuser le reçu ; un faits.json sans le champ rend la limite, pas
# un refus (ADR-032, ADR-065). Les deux partent d'une copie du run de 143, privée de son reçu et de son
# output : la pièce est la même, seul le champ change.
M243="$B/m243"
rm -rf "$M243"; mkdir -p "$M243"
cp -a "$O/run/." "$M243/"
rm -f "$M243/receipt.json" "$M243/output.json" "$M243/RAPPORT.md" "$M243/RESULTAT.md"
printf 'un texte que la trace ne porte pas\n' > "$M243/raw/cas-test/last-message.md"
node -e "const fs=require('fs'),p='$M243/faits.json';const f=JSON.parse(fs.readFileSync(p,'utf8'));f.dernier_message.chemin='$M243/raw/cas-test/last-message.md';fs.writeFileSync(p,JSON.stringify(f,null,2)+'\n')"
M243B="$B/m243b"
rm -rf "$M243B"; mkdir -p "$M243B"
cp -a "$O/run/." "$M243B/"
rm -f "$M243B/receipt.json" "$M243B/output.json" "$M243B/RAPPORT.md" "$M243B/RESULTAT.md"
node -e "const fs=require('fs'),p='$M243B/faits.json';const f=JSON.parse(fs.readFileSync(p,'utf8'));delete f.dernier_message;fs.writeFileSync(p,JSON.stringify(f,null,2)+'\n')"
controle "243 dernier message : retouché refusé, non attesté limité" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs'),r=[];
const appel=(run)=>{try{execFileSync('node',['$H','receipt','--run',run,'--case','cas-test','--cases','$O/cases','--faits',run+'/faits.json','--verdict','non concluant'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stderr||'')}}};
const refus=appel('$M243');
if(refus.code!==1) r.push('retouché : sortie '+refus.code+' au lieu de 1');
else if(!refus.sortie.includes('ne rend plus son empreinte')) r.push('le refus ne nomme pas l empreinte : '+refus.sortie.split('\\n')[0]);
if(fs.existsSync('$M243/receipt.json')) r.push('un reçu a été écrit sur la pièce retouchée');
const ok=appel('$M243B');
if(ok.code!==0) r.push('sans champ : refusé — '+ok.sortie.split('\\n')[0]);
else {
  const x=JSON.parse(fs.readFileSync('$M243B/receipt.json','utf8'));
  if(!x.limites.some((l)=>String(l).includes('dernier_message_non_atteste'))) r.push('la limite dernier_message_non_atteste manque');
}
if(r.length){fs.writeFileSync(process.env.DETAIL,r.join('\\n')+'\\n');process.exit(1)}"

controle "144 refus 12, lire sans recu" 0 refus-nomme 1 "absent" node "$ORCH" lire --cas cas-test --run "$O/runsansporte"
controle "145 refus 2, skill dans un arbre gele" 0 refus-nomme 1 "quatre arbres" bash -c "node '$ORCH' cas --skill '$O/cas-test/origine/framework/PLAYBOOK.md' --terrain '$OTERRAIN' --id refus2 --racine '$O' --cases '$O/cases' </dev/null"
controle "146 refus 3, terrain = un arbre gele" 0 refus-nomme 1 "quatre arbres" bash -c "node '$ORCH' cas --skill '$OSKILL' --terrain '$O/cas-test/origine/terrain' --id refus3 --racine '$O' --cases '$O/cases' </dev/null"
controle "147 refus 5, aucune racine possible" 0 refus-nomme 1 "racine" bash -c "unset HOME; node '$ORCH' cas --skill '$OSKILL' --terrain '$OTERRAIN' --id refus5 --cases '$O/cases' </dev/null"
controle "148 chaque bloc de narration fait six lignes au plus" 0 node -e "
const {execFileSync}=require('child_process');
const out=execFileSync('node',['$ORCH','lire','--cas','cas-test','--run','$O/run'],{encoding:'utf8'});
const blocs=out.split(/\n(?=▸ )/).filter(b=>b.trim());
const long=blocs.filter(b=>b.trim().split('\n').length>6);
process.exit(blocs.length>=1 && long.length===0 ?0:1)"
# Le dossier des cas n'existe pas encore : `cas` le cree (drift mesure le 2026-10-18, le guide utilisateur
# le premier : la commande sortait en ENOENT au lieu d'ecrire la demande).
rm -rf "$O/cases-neuf"
controle "149 cas cree son dossier --cases" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','cas','--skill','$OSKILL','--terrain','$OTERRAIN','--id','neuf','--racine','$O','--cases','$O/cases-neuf'],{stdio:'ignore',input:'',encoding:'utf8'});
process.exit(['request.md','expected.json','freeze.json'].every(p=>fs.existsSync('$O/cases-neuf/neuf.'+p))?0:1)"
# Un depot de skill sale : `cas` sortait 0 et le clone perdait la modification, sans un mot (drift mesure le
# 2026-10-18, scenario « je travaille sur un truc non commite »). Refus par defaut, `--tel-quel` porte l'arbre.
rm -rf "$B/sale" "$O/cases-sale" "$O/tq"
mkdir -p "$B/sale/skills/x"
printf '# x\n' > "$B/sale/skills/x/SKILL.md"
git -c init.defaultBranch=main -C "$B/sale" init -q
git -C "$B/sale" add -A
git -C "$B/sale" -c user.name=banc -c user.email=banc@invalid -c commit.gpgsign=false commit -q -m banc
printf '\n6. non commitee.\n' >> "$B/sale/skills/x/SKILL.md"
controle "150 refus 13, depot du skill sale" 0 refus-nomme 1 "non commit" bash -c "node '$ORCH' cas --skill '$B/sale/skills/x/SKILL.md' --terrain '$OTERRAIN' --id sale --racine '$O' --cases '$O/cases-sale' </dev/null"
controle "151 cas --tel-quel porte la modification" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','cas','--skill','$B/sale/skills/x/SKILL.md','--terrain','$OTERRAIN','--id','tq','--racine','$O','--cases','$O/cases-sale','--tel-quel'],{stdio:'ignore',input:'',encoding:'utf8'});
const copie=fs.readFileSync('$O/tq/framework-origin/skills/x/SKILL.md','utf8');
process.exit(copie.includes('non commitee')?0:1)"
rm -rf "$B/sale-terrain"
mkdir -p "$B/sale-terrain"
printf '# terrain sale\n' > "$B/sale-terrain/README.md"
git -c init.defaultBranch=main -C "$B/sale-terrain" init -q
git -C "$B/sale-terrain" add -A
git -C "$B/sale-terrain" -c user.name=banc -c user.email=banc@invalid -c commit.gpgsign=false commit -q -m banc
printf '\n// non commite\n' >> "$B/sale-terrain/README.md"
controle "152 refus 13, terrain sale" 0 refus-nomme 1 "le terrain" bash -c "node '$ORCH' cas --skill '$OSKILL' --terrain '$B/sale-terrain' --id sale2 --racine '$O' --cases '$O/cases-sale' </dev/null"
# Les deux pages qui parlent des commandes sont confrontees au code : l'annexe du guide et le runbook
# d'ORCHESTRATEUR.md. Chaque option nommee doit exister dans l'usage reel, toutes les commandes
# offertes doivent y etre nommees, et les douze refus du runbook doivent etre ceux du §7 de la spec, chacun
# eprouve par un controle du banc dont le texte attendu vit dans le code. Un renommage cote code, et
# aucune des deux pages ne peut plus mentir en silence (drift : le guide a omis `--tel-quel`).
# En cas d'echec, le controle ecrit ses confrontations rompues dans $DETAIL, que `controle` imprime sous
# sa ligne FAIL : le compte et l'exit ne changent pas, seul le silence tombe (une page qui ment se nomme).
DETAIL="$B/153-detail"
controle "153 guide et runbook contre le code" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
let usage='';try{execFileSync('node',['$ORCH'],{encoding:'utf8'});}catch(e){usage=(e.stdout||'')+(e.stderr||'');}
const guide=fs.readFileSync('$REPO/docs/guide/guide-utilisateur.md','utf8');
const annexe=(guide.split(/\n## Annexe/)[1]||'');
const q=String.fromCharCode(96);
const options=[...new Set(annexe.match(/--[a-z][a-z-]*/g)||[])];
const inconnues=options.filter(o=>!usage.includes(o));
const offertes=[...new Set(usage.split('\n').map(l=>(l.match(/^  ([a-z][a-z-]*) +--/)||[])[1]).filter(Boolean))];
const nonNommees=offertes.filter(c=>!annexe.includes('| '+q+c+q+' |'));
const sections={};let cur=null;for(const l of usage.split('\n')){const m=l.match(/^  ([a-z][a-z-]*) +--/);if(m){cur=m[1];sections[cur]=l;}else if(cur&&l.startsWith('       '))sections[cur]+='\n'+l;}
const runbook=fs.readFileSync('$REPO/docs/device/ORCHESTRATEUR.md','utf8');
const lignes=[...runbook.matchAll(/^node docs\/device\/harness\/orchestrer\.mjs (\S+) (.*)$/gm)].map(m=>({cmd:m[1],opts:[...m[2].matchAll(/--[a-z][a-z-]*/g)].map(x=>x[0])}));
const nommees=new Set(lignes.map(l=>l.cmd));
const toutes=[...nommees].every(c=>sections[c])&&offertes.every(c=>nommees.has(c))&&lignes.every(l=>l.opts.every(o=>(sections[l.cmd]||'').includes(o)));
const spec=fs.readFileSync('$REPO/docs/tasks/2026_10/2026-10-18-070820-orchestrateur-interactif-du-test/2026-10-18-071018-spec.md','utf8');
const table=((spec.split(/\n## 7\. Les refus/)[1]||'').split(/\n## 8\./)[0]);
const refus=[...table.matchAll(/^\| (\d+) \|[^|]*\|[^|]*\| (\d+) \|$/gm)].map(m=>({n:+m[1],sortie:+m[2]}));
const mot=runbook.match(/Les (\S+) conditions sont celles du/);
const mots={dix:10,onze:11,douze:12,treize:13,quatorze:14,quinze:15,seize:16};
const douze=mot?(mots[mot[1]]||parseInt(mot[1],10)):NaN;
const qq=String.fromCharCode(34);
const banc=fs.readFileSync('$REPO/docs/device/harness/banc-harnais.sh','utf8');
const codes=fs.readFileSync('$REPO/docs/device/harness/orchestrer.mjs','utf8')+fs.readFileSync('$REPO/docs/device/harness/run.mjs','utf8');
const eprouves=new Map();
for(const l of banc.split('\n')){if(!l.startsWith('controle '))continue;const p=l.split(qq);const m=(p[1]||'').match(/refus (\d+),/);const e=(p[2]||'').match(/refus-nomme (\d+)/);if(!m||!e||!p[3])continue;const n=+m[1];if(!eprouves.has(n))eprouves.set(n,[]);eprouves.get(n).push({sortie:+e[1],texte:p[3]});}
const manque=[];
const raisons=[];
if(!annexe)raisons.push('annexe du guide : section ## Annexe introuvable');
for(const o of inconnues)raisons.push('option '+o+' : absente de l usage de orchestrer.mjs');
for(const c of nonNommees)raisons.push('annexe : la ligne de table de '+c+' manque');
for(const c of nommees)if(!sections[c])raisons.push('runbook §2 : la commande '+c+' n est pas offerte par l usage');
for(const c of Object.keys(sections))if(!nommees.has(c))raisons.push('runbook §2 : la commande offerte '+c+' n y est pas nommee');
for(const l of lignes)for(const o of l.opts)if(!(sections[l.cmd]||'').includes(o))raisons.push('runbook §2 : option '+o+' hors de la section d usage de '+l.cmd);
if(!Number.isFinite(douze))raisons.push('runbook : la phrase qui annonce le nombre de conditions est introuvable');
if(refus.length!==douze)raisons.push('spec §7 : '+refus.length+' refus numerotes, '+douze+' annonce(s) par le runbook');
for(let n=1;n<=douze;n++){const r=refus.find(x=>x.n===n),ex=eprouves.get(n)||[];if(!r)manque.push('spec '+n);if(!ex.length)manque.push('banc '+n);if(!r)raisons.push('spec §7 : refus '+n+' absent de la table');if(!ex.length)raisons.push('banc : aucun controle nomme refus '+n+',');for(const e of ex){if(r&&e.sortie!==r.sortie)manque.push('sortie '+n);if(!codes.includes(e.texte))manque.push('code '+n);if(r&&e.sortie!==r.sortie)raisons.push('refus '+n+' : le banc attend '+e.sortie+', la spec '+r.sortie);if(!codes.includes(e.texte))raisons.push('refus '+n+' : le texte attendu ne vit ni dans orchestrer.mjs ni dans run.mjs');}}
const bon=annexe && inconnues.length===0 && nonNommees.length===0 && toutes && refus.length===douze && manque.length===0;
if(!bon)fs.writeFileSync(process.env.DETAIL,(raisons.length?raisons:['confrontation rompue non nommee — lire le code du controle']).join('\n')+'\n');
process.exit(bon?0:1)"

# 154-171 : les deux clients (ADR-043 à 046). Le faux `opencode` ne prouve que l'adaptateur : il rend
# une fixture JSON, ne touche à aucun réseau, et le CLI réel reste hors du banc. Le cas `cas-oc` est
# fabriqué et sa porte passée AVANT le produit, comme la chaîne réelle. Le store et le HOME sont des
# bacs : rien n'est lu ni écrit dans le vrai client.
OCB="$B/oc"
OCBIN="$OCB/bin"
OCFIX="$OCB/fixtures"
mkdir -p "$OCBIN" "$OCFIX" "$OCB/home/.local/share/opencode" "$OCB/trace"
cat > "$OCBIN/opencode" <<'SH'
#!/usr/bin/env bash
if [ "$1" = "--version" ]; then echo "opencode v2.0.32"; exit 0; fi
if [ "$1" = "session" ] && [ "$2" = "export" ]; then
  f="${OPENCODE_FIXTURE_DIR}/${3}.json"
  [ -f "$f" ] || { echo "session inconnue : $3" >&2; exit 1; }
  cat "$f"; exit 0
fi
echo "commande opencode non prise en charge : $*" >&2
exit 1
SH
chmod +x "$OCBIN/opencode"
OCENV=(env "PATH=$OCBIN:$PATH" "OPENCODE_FIXTURE_DIR=$OCFIX")

# Le cas opencode : budget 3, porte avant le produit, puis le produit du jouet. Le gel et l'attendu
# restent ceux que `cas` a fabriqués ; aucun fichier du cas n'est retouché à la main.
node "$ORCH" cas --skill "$OSKILL" --terrain "$OTERRAIN" --id cas-oc --racine "$O" --cases "$O/cases" --budget 3 </dev/null >/dev/null 2>&1 \
  || { echo "ARRET — le cas opencode ne se fabrique pas"; exit 2; }
node "$ORCH" porte --cas cas-oc --cases "$O/cases" --run "$O/oc-run" --repertoire "$O/cas-oc/terrain" >/dev/null 2>&1 \
  || { echo "ARRET — la porte opencode ne s'écrit pas"; exit 2; }
sleep 2
mkdir -p "$O/cas-oc/terrain/aidd_docs" "$O/ailleurs"
printf 'Read the repository before writing.\nShow what you read as a table.\nWrite one file only.\n' > "$O/cas-oc/terrain/aidd_docs/NOTES.md"

# Les fixtures : petites, fabriquées, au même format que l'export du CLI. Le tableau vit dans une part
# `assistant/text` ; une part `synthetic` et une `reasoning` en portent un aussi, pour qu'aucune des deux
# ne soit prise pour le tableau rendu. L'ordre des parts est l'ordre des lignes (ADR-045).
node - "$OCFIX" "$O/cas-oc/terrain" "$O/ailleurs" "$JROOT/terrain" <<'NODE'
const fs = require("fs"), path = require("path");
const [dir, terrain, ailleurs, jt] = process.argv.slice(2);
const T0 = Date.now() - 3600 * 1000;
const table = "| fichier | objet |\n| --- | --- |\n| README.md | le terrain |";
const autreTable = "| x | y |\n| --- | --- |\n| 1 | 2 |";
const user = (ts, texte) => ({ type: "user", info: { role: "user", time: { created: ts } }, text: texte, parts: [{ type: "text", text: texte }] });
const assistant = (ts, parts) => ({ type: "assistant", info: { role: "assistant", time: { created: ts } }, parts });
const tool = (name, p) => ({ type: "tool", name, state: { input: { path: p } } });
// ADR-051 : une commande shell n'a pas de `path`, elle a un texte — le seul champ que le scan lit.
const shell = (command) => ({ type: "tool", name: "shell", state: { input: { command } } });
const base = (id, { directory = terrain, model = { providerID: "banc", id: "modele-oc" }, users = 1, parts = null, firstTs = T0 } = {}) => {
  const messages = [];
  for (let i = 0; i < users; i++) messages.push(user(firstTs + i * 1000, `demande ${i + 1}`));
  messages.push(assistant(firstTs + 1000, parts || [
    { type: "reasoning", text: "un tableau qui n'est pas rendu :\n\n" + autreTable },
    { type: "synthetic", text: "une instruction qui contient un tableau :\n\n" + autreTable },
    { type: "text", text: "banc, le tableau :\n\n" + table },
    tool("read", path.join(directory, "README.md")),
    tool("write", path.join(directory, "aidd_docs", "NOTES.md")),
  ]));
  return { info: { id, location: { directory }, model, time: { created: firstTs }, agent: "build" }, messages };
};
const ecrire = (id, objet) => fs.writeFileSync(path.join(dir, id + ".json"), JSON.stringify(objet, null, 2) + "\n");
ecrire("banc-opencode-ok", base("banc-opencode-ok"));
ecrire("banc-opencode-apres", base("banc-opencode-apres", { parts: [
  { type: "text", text: "banc, le tableau :\n\n" + table },
  tool("write", path.join(terrain, "aidd_docs", "NOTES.md")),
] }));
ecrire("banc-opencode-ordre", base("banc-opencode-ordre", { parts: [
  tool("write", path.join(terrain, "aidd_docs", "NOTES.md")),
  { type: "text", text: "banc, le tableau :\n\n" + table },
  tool("write", path.join(terrain, "aidd_docs", "NOTES.md")),
] }));
ecrire("banc-opencode-budget-4", base("banc-opencode-budget-4", { users: 4 }));
ecrire("banc-opencode-ailleurs", base("banc-opencode-ailleurs", { directory: ailleurs }));
const sansLocation = base("banc-opencode-sans-location"); delete sansLocation.info.location; ecrire("banc-opencode-sans-location", sansLocation);
const sansModele = base("banc-opencode-sans-modele"); delete sansModele.info.model; ecrire("banc-opencode-sans-modele", sansModele);
const sansUser = base("banc-opencode-sans-user"); sansUser.messages = sansUser.messages.filter((m) => m.type !== "user"); ecrire("banc-opencode-sans-user", sansUser);
ecrire("banc-opencode-modele", base("banc-opencode-modele", { model: { providerID: "banc", id: "autre" } }));
// La fixture qui éprouve le champ `commande` de l'adaptateur opencode (contrôle 201).
ecrire("banc-opencode-shell", base("banc-opencode-shell", { parts: [
  { type: "text", text: "banc, le tableau :\n\n" + table },
  shell("cat README.md"),
]}));
ecrire("banc-ambigu", base("banc-ambigu"));
ecrire("banc-jouet-apres", base("banc-jouet-apres", { directory: jt, parts: [
  { type: "text", text: "banc, le tableau du jouet :\n\n" + table },
  tool("write", path.join(jt, "aidd_docs", "NOTES.md")),
] }));
ecrire("banc-jouet-ordre", base("banc-jouet-ordre", { directory: jt, parts: [
  tool("write", path.join(jt, "aidd_docs", "NOTES.md")),
  { type: "text", text: "banc, le tableau du jouet :\n\n" + table },
] }));
NODE

faits-oc() { # fixture, sortie, trace [--base|--store ...]
  local fixture="$1" sortie="$2" trace="$3"; shift 3
  : > "$trace"
  "${OCENV[@]}" node "$H" faits --case cas-oc --cases "$O/cases" --client opencode --store "$OCB/home/.local/share/opencode" --fil "$fixture" --trace "$trace" --out "$sortie" --par banc --fin "$(date -Is)" --conduite humain "$@"
}
controle "154 faits opencode, session dérivée" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs'),path=require('path');
const trace='$OCB/trace/154.jsonl';
try{fs.unlinkSync(trace)}catch{}
try{fs.unlinkSync('$OCB/f154.json')}catch{}
execFileSync('node',['$H','faits','--case','cas-oc','--cases','$O/cases','--client','opencode','--store','$OCB/home/.local/share/opencode','--fil','banc-opencode-ok','--trace',trace,'--out','$OCB/f154.json','--par','banc','--fin','$(date -Is)','--conduite','humain'],{stdio:'ignore',env:{...process.env,PATH:'$OCBIN:'+process.env.PATH,OPENCODE_FIXTURE_DIR:'$OCFIX'}});
const f=JSON.parse(fs.readFileSync('$OCB/f154.json','utf8'));
process.exit(f.session.outil==='opencode' && f.trace.client==='opencode' && f.trace.cwd==='$O/cas-oc/terrain' && f.session.modele==='banc/modele-oc' && f.session.ouverte_le && f.horodatage_debut ?0:1)"
controle "155 faits opencode, répertoire hors gel" 0 refus-nomme 1 "n'est pas le gel « travail »" env PATH="$OCBIN:$PATH" OPENCODE_FIXTURE_DIR="$OCFIX" node "$H" faits --case cas-oc --cases "$O/cases" --client opencode --store "$OCB/home/.local/share/opencode" --fil banc-opencode-ailleurs --trace "$OCB/trace/155.jsonl" --out "$OCB/f155.json" --par banc --fin "$(date -Is)" --conduite humain
controle "156 faits opencode, location absente" 0 refus-nomme 1 "location.directory" env PATH="$OCBIN:$PATH" OPENCODE_FIXTURE_DIR="$OCFIX" node "$H" faits --case cas-oc --cases "$O/cases" --client opencode --store "$OCB/home/.local/share/opencode" --fil banc-opencode-sans-location --trace "$OCB/trace/156.jsonl" --out "$OCB/f156.json" --par banc --fin "$(date -Is)" --conduite humain
controle "157 faits opencode, modèle absent" 0 refus-nomme 1 "aucun modèle" env PATH="$OCBIN:$PATH" OPENCODE_FIXTURE_DIR="$OCFIX" node "$H" faits --case cas-oc --cases "$O/cases" --client opencode --store "$OCB/home/.local/share/opencode" --fil banc-opencode-sans-modele --trace "$OCB/trace/157.jsonl" --out "$OCB/f157.json" --par banc --fin "$(date -Is)" --conduite humain
controle "158 faits opencode, aucun user" 0 refus-nomme 1 "aucun message utilisateur" env PATH="$OCBIN:$PATH" OPENCODE_FIXTURE_DIR="$OCFIX" node "$H" faits --case cas-oc --cases "$O/cases" --client opencode --store "$OCB/home/.local/share/opencode" --fil banc-opencode-sans-user --trace "$OCB/trace/158.jsonl" --out "$OCB/f158.json" --par banc --fin "$(date -Is)" --conduite humain
controle "159 faits opencode refuse --base" 0 refus-nomme 1 "refuse --base" node "$H" faits --case cas-oc --cases "$O/cases" --client opencode --base "$DBF" --fil banc-opencode-ok --trace "$OCB/trace/159.jsonl" --out "$OCB/f159.json" --par banc --fin "$(date -Is)" --conduite humain
controle "160 faits freebuff refuse --store" 0 refus-nomme 1 "refuse --store" node "$H" faits --case cas-oc --cases "$O/cases" --client freebuff --base "$DBF" --store "$OCB/home/.local/share/opencode" --fil banc --trace "$OCB/trace/160.jsonl" --out "$OCB/f160.json" --par banc --fin "$(date -Is)" --conduite humain

copie-porte-oc() { mkdir -p "$1"; cp "$O/oc-run/gate.json" "$1/gate.json"; }
copie-porte-jouet() { mkdir -p "$1"; cp "$B/jouet/r124/gate.json" "$1/gate.json"; }
copie-oc() { # source, dest — recopie un run sans son reçu, et réoriente les chemins de la trace
  rm -rf "$2"; cp -a "$1" "$2"; rm -f "$2/receipt.json" "$2/output.json"
  node -e "const fs=require('fs'),p='$2/faits.json';const f=JSON.parse(fs.readFileSync(p,'utf8'));f.trace.chemin_exporte='$2/trace/echange.jsonl';f.trace.export_brut='$2/trace/export-brut.json';fs.writeFileSync(p,JSON.stringify(f,null,2)+'\n')" \
    || { echo "ARRET — la copie opencode $2 ne réoriente pas ses faits"; exit 2; }
}
suite-jouet-oc() { # dossier-du-run, fixture — une suite opencode sur le cas jouet, porte déjà copiée
  "${OCENV[@]}" HOME="$OCB/home" node "$ORCH" suite --cas "$JOUET" --cases "$B/jouet/cases" --run "$1" --client opencode --fil "$2" --produit aidd_docs --conduite humain
}

controle "161 suite auto, opencode" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','suite','--cas','cas-oc','--cases','$O/cases','--run','$O/oc-run','--fil','banc-opencode-ok','--produit','aidd_docs','--conduite','humain'],{stdio:'ignore',env:{...process.env,HOME:'$OCB/home',PATH:'$OCBIN:'+process.env.PATH,OPENCODE_FIXTURE_DIR:'$OCFIX'}});
const f=JSON.parse(fs.readFileSync('$O/oc-run/faits.json','utf8'));
process.exit(f.session.outil==='opencode' && f.trace.client==='opencode' && fs.existsSync('$O/oc-run/trace/echange.jsonl') && fs.existsSync('$O/oc-run/raw/cas-oc/NOTES.md') ?0:1)"
# Le fil ambigu vit dans les deux sources : la base Freebuff copiée sous un HOME de bac, et la fixture
# opencode. `suite` doit refuser sans --client et passer avec --client opencode.
mkdir -p "$OCB/home-amb/.config/freebuff-desktop/projects/banc"
cp "$DBF" "$OCB/home-amb/.config/freebuff-desktop/projects/banc/desktop-v2.db"
sqlite3 "$OCB/home-amb/.config/freebuff-desktop/projects/banc/desktop-v2.db" \
  "insert into threads values('banc-ambigu','$O/cas-oc/terrain','local','','','codebuff','aucun',$(date +%s)000);"
controle "162 suite auto, ambiguïté des deux clients" 0 refus-nomme 1 "deux clients" bash -c "HOME='$OCB/home-amb' PATH='$OCBIN:$PATH' OPENCODE_FIXTURE_DIR='$OCFIX' node '$ORCH' suite --cas cas-oc --cases '$O/cases' --run '$O/oc-run' --fil banc-ambigu --store '$OCB/home/.local/share/opencode' --produit aidd_docs </dev/null"
copie-porte-oc "$O/oc-run-c163"
controle "163 suite --client opencode, ambiguïté" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','suite','--cas','cas-oc','--cases','$O/cases','--run','$O/oc-run-c163','--client','opencode','--fil','banc-ambigu','--store','$OCB/home/.local/share/opencode','--produit','aidd_docs','--conduite','humain'],{stdio:'ignore',env:{...process.env,HOME:'$OCB/home-amb',PATH:'$OCBIN:'+process.env.PATH,OPENCODE_FIXTURE_DIR:'$OCFIX'}});
process.exit(fs.existsSync('$O/oc-run-c163/faits.json') ?0:1)"
# ADR-065 : `suite` a écrit `$O/oc-run/raw/cas-oc/last-message.md` et l'a attesté ; le retaper romprait l'empreinte.
controle "164 receipt opencode, conforme au client rejoué" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','fin','--cas','cas-oc','--cases','$O/cases','--run','$O/oc-run','--difference','aucune','--phrase','banc opencode','--verdict','non concluant'],{stdio:'ignore',env:{...process.env,HOME:'$OCB/home',PATH:'$OCBIN:'+process.env.PATH,OPENCODE_FIXTURE_DIR:'$OCFIX'}});
const r=JSON.parse(fs.readFileSync('$O/oc-run/receipt.json','utf8'));
process.exit(r.session_verifiee.outil==='opencode' && r.trace_verifiee.outil==='opencode' && /^[0-9a-f]{64}$/.test(r.trace_verifiee.sha256) ?0:1)"
# 165-166 : deux copies du run, deux traces réorientées, et deux refus du rejeu opencode.
copie-oc "$O/oc-run" "$O/oc-r165"
printf 'une ligne ajoutée après l export.\n' >> "$O/oc-r165/trace/echange.jsonl"
controle "165 receipt opencode, JSONL modifié" 0 refus-nomme 1 "ne rend pas ce que le client rend" env PATH="$OCBIN:$PATH" OPENCODE_FIXTURE_DIR="$OCFIX" node "$H" receipt --run "$O/oc-r165" --case cas-oc --cases "$O/cases" --faits "$O/oc-r165/faits.json" --verdict "non concluant"
copie-oc "$O/oc-run" "$O/oc-r166"
node -e "const fs=require('fs'),p='$O/oc-r166/faits.json';const f=JSON.parse(fs.readFileSync(p,'utf8'));f.session.modele='menteur';fs.writeFileSync(p,JSON.stringify(f,null,2)+'\n')"
controle "166 receipt opencode, modèle démenti" 0 refus-nomme 1 "modèle du reçu est démenti" env PATH="$OCBIN:$PATH" OPENCODE_FIXTURE_DIR="$OCFIX" node "$H" receipt --run "$O/oc-r166" --case cas-oc --cases "$O/cases" --faits "$O/oc-r166/faits.json" --verdict "non concluant"
# 167 : quatre messages user contre le budget 3 du cas opencode ; le reçu s'arrête au rang 4.
mkdir -p "$B/r167/trace"
cp "$O/oc-run/gate.json" "$B/r167/gate.json"
node "$H" collect --run "$B/r167" --case cas-oc --cases "$O/cases" --sans-produit >/dev/null 2>&1 || { echo "ARRET — le collect de 167 ne s'écrit pas"; exit 2; }
"${OCENV[@]}" node "$H" faits --case cas-oc --cases "$O/cases" --client opencode --store "$OCB/home/.local/share/opencode" --fil banc-opencode-budget-4 --trace "$B/r167/trace/echange.jsonl" --out "$B/r167/faits.json" --par banc --fin "$(date -Is)" --conduite humain >/dev/null 2>&1 || { echo "ARRET — les faits de 167 ne s'écrivent pas"; exit 2; }
controle "167 receipt opencode, rang 4 au-delà du budget" 0 refus-nomme 1 "rang 4" env PATH="$OCBIN:$PATH" OPENCODE_FIXTURE_DIR="$OCFIX" node "$H" receipt --run "$B/r167" --case cas-oc --cases "$O/cases" --faits "$B/r167/faits.json" --verdict "non concluant"
copie-oc "$O/oc-run" "$O/oc-r168"
node -e "const fs=require('fs'),p='$O/oc-r168/faits.json';const f=JSON.parse(fs.readFileSync(p,'utf8'));f.horodatage_debut=new Date(Date.parse(f.horodatage_debut)+1000).toISOString();fs.writeFileSync(p,JSON.stringify(f,null,2)+'\n')"
controle "168 receipt opencode, premier message démenti" 0 refus-nomme 1 "début du run est démenti" env PATH="$OCBIN:$PATH" OPENCODE_FIXTURE_DIR="$OCFIX" node "$H" receipt --run "$O/oc-r168" --case cas-oc --cases "$O/cases" --faits "$O/oc-r168/faits.json" --verdict "non concluant"

# 169-171 : l'ordre par ligne (ADR-045). Une écriture avant le tableau, dans le même message, mord ;
# une écriture après ne mord pas. Le cas jouet est complet, donc `conforme` y est possible.
copie-porte-jouet "$O/oc-order"
suite-jouet-oc "$O/oc-order" banc-jouet-ordre >/dev/null 2>&1 || { echo "ARRET — la suite de 169 ne s'écrit pas"; exit 2; }
# ADR-065 : `suite` a écrit `$O/oc-order/raw/$JOUET/last-message.md` et l'a attesté ; le retaper romprait l'empreinte.
controle "169 écriture avant tableau, conforme refusé" 0 refus-nomme 1 "écriture précède le tableau" env PATH="$OCBIN:$PATH" OPENCODE_FIXTURE_DIR="$OCFIX" node "$ORCH" fin --cas "$JOUET" --cases "$B/jouet/cases" --run "$O/oc-order" --difference aucune --phrase banc --verdict conforme
copie-porte-jouet "$O/oc-order2"
suite-jouet-oc "$O/oc-order2" banc-jouet-ordre >/dev/null 2>&1 || { echo "ARRET — la suite de 170 ne s'écrit pas"; exit 2; }
# ADR-065 : `suite` a écrit `$O/oc-order2/raw/$JOUET/last-message.md` et l'a attesté ; le retaper romprait l'empreinte.
controle "170 écriture avant tableau, non concluant écrit" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','fin','--cas','$JOUET','--cases','$B/jouet/cases','--run','$O/oc-order2','--difference','aucune','--phrase','banc','--verdict','non concluant'],{stdio:'ignore',env:{...process.env,PATH:'$OCBIN:'+process.env.PATH,OPENCODE_FIXTURE_DIR:'$OCFIX'}});
const r=JSON.parse(fs.readFileSync('$O/oc-order2/receipt.json','utf8'));
process.exit(r.falsificateurs.ecriture_avant_tableau.length>0 ?0:1)"
copie-porte-jouet "$O/oc-apres"
suite-jouet-oc "$O/oc-apres" banc-jouet-apres >/dev/null 2>&1 || { echo "ARRET — la suite de 171 ne s'écrit pas"; exit 2; }
# ADR-065 : `suite` a écrit `$O/oc-apres/raw/$JOUET/last-message.md` et l'a attesté ; le retaper romprait l'empreinte.
controle "171 écriture après tableau, conforme accepté" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','fin','--cas','$JOUET','--cases','$B/jouet/cases','--run','$O/oc-apres','--difference','aucune','--phrase','banc','--verdict','conforme'],{stdio:'ignore',env:{...process.env,PATH:'$OCBIN:'+process.env.PATH,OPENCODE_FIXTURE_DIR:'$OCFIX'}});
const r=JSON.parse(fs.readFileSync('$O/oc-apres/receipt.json','utf8'));
process.exit(r.verdict==='conforme' && r.falsificateurs.ecriture_avant_tableau.length===0 ?0:1)"

# 175 : la durée de `porte` est lue dans les reçus du cas, pas dans une constante. Le terrain vivant
# porte le produit d'un run non collecté ; le contrôle en copie un état propre sous $B et laisse le gel
# du dépôt intact. Le nombre de runs, le minimum, le maximum et la fourchette arrondie sont recalculés
# ici depuis les `receipt.json` du dépôt, avec la définition du code (`ouverte_le` → `recu_ecrit_le`),
# et la sortie doit les nommer : un run réel de plus ne fait pas rougir le banc (ADR-053). Ce contrôle
# a nommé en dur « 9 min 42 s à 15 min 50 s » et « 10 à 20 min » jusqu'au 2026-10-22, et deux runs de
# plus l'ont fait rougir sans qu'aucun code ne change : l'attendu figé mesurait le dossier, pas `porte`.
D="$B/duree"
mkdir -p "$D/cases" "$D/case"
cp -a "$JT/$JOUET/terrain" "$D/case/terrain"
git -C "$D/case/terrain" clean -fdx >/dev/null
cp "$REPO/docs/device/CASES/$JOUET.request.md" "$REPO/docs/device/CASES/$JOUET.expected.json" "$REPO/docs/device/CASES/$JOUET.freeze.json" "$D/cases/"
node - "$D/cases/$JOUET.freeze.json" "$D/case/terrain" <<'NODE'
const fs = require('fs');
const [p, terrain] = process.argv.slice(2);
const g = JSON.parse(fs.readFileSync(p, 'utf8'));
g.arbres.find((a) => a.label === 'travail').chemin = terrain;
fs.writeFileSync(p, JSON.stringify(g, null, 2) + '\n');
NODE
controle "175 porte, durée lue dans les reçus" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs'),path=require('path');
const sortie=execFileSync('node',['$ORCH','porte','--cas','$JOUET','--cases','$D/cases','--run','$D/run','--repertoire','$D/case/terrain'],{encoding:'utf8'});
const racine='$REPO/docs/device/runs';
const duree=(s)=>Math.floor(s/60)+' min '+String(s%60).padStart(2,'0')+' s';
const entierDe5=(s)=>Math.ceil(s/300)*5;
const mesures=[];
for(const d of fs.readdirSync(racine)){
  let j;try{j=JSON.parse(fs.readFileSync(path.join(racine,d,'receipt.json'),'utf8'))}catch{continue}
  if(!j||j.cas!=='$JOUET')continue;
  const debut=Date.parse(j.session?.ouverte_le??j.session_verifiee?.ouverte_le??j.horodatage_debut);
  const fin=Date.parse(j.horodatage_fin),ecrit=Date.parse(j.recu_ecrit_le);
  if(!Number.isFinite(debut)||!Number.isFinite(fin)||!Number.isFinite(ecrit)||fin<debut||ecrit<fin)continue;
  mesures.push(Math.round((ecrit-debut)/1000));
}
if(!mesures.length)process.exit(1);
const bas=Math.min(...mesures),haut=Math.max(...mesures);
const mesure=bas===haut?duree(bas):duree(bas)+' à '+duree(haut);
const fourchette=entierDe5(bas)===entierDe5(haut)?entierDe5(bas)+' min':entierDe5(bas)+' à '+entierDe5(haut)+' min';
process.exit(sortie.includes(mesures.length+' run'+(mesures.length>1?'s':'')) && sortie.includes(mesure) && sortie.includes(fourchette) ?0:1)"

# 176-178 : une lecture hors du cadre déclaré interdit `conforme`. Les racines autorisées sont
# `terrain` et `framework-origin`, relatives à la racine du cas, lues dans le bloc `cloisonnement`
# (ADR-052) ; le kit d'un autre cas et le README de la racine n'y sont pas. La fixture est un fil de la base du banc,
# exporté par la commande du §1.5 ; le produit de 176-178 est le README du terrain, avec une naissance
# reculée après le tableau, pour que F1 ne morde pas à sa place.
lecture-run() { # nom — run avec produit, naissance du produit après le tableau
  produit-run "$1"
  node -e "const fs=require('fs'),p='$B/$1/raw/$CAS/manifest.json';const m=JSON.parse(fs.readFileSync(p,'utf8'));
  m.fichiers[0].birth_epoch=$(($D0/1000+30));m.fichiers[0].birth=new Date(m.fichiers[0].birth_epoch*1000).toISOString();
  fs.writeFileSync(p,JSON.stringify(m,null,2)+'\n')"
}
lecture-run r176
controle "176 receipt refus, lecture hors dossier" 0 refus-nomme 1 "une lecture est sortie du cadre déclaré" node "$H" receipt --run "$B/r176" --case "$CAS" --faits "$B/f176.json" --verdict conforme
lecture-run r177
controle "177 receipt, lecture hors dossier nommée" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/r177','--case','$CAS','--faits','$B/f176.json','--verdict','non concluant'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/r177/receipt.json','utf8'));
const l=r.falsificateurs.lecture_hors_dossier||[];
process.exit(r.verdict==='non concluant' && l.length===1 && l[0].seq===2 && l[0].outil==='read' && String(l[0].chemin).includes('autre-cas') ?0:1)"
lecture-run r178
controle "178 receipt, lecture dans le dossier non signalée" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/r178','--case','$CAS','--faits','$B/f178.json','--verdict','non concluant'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/r178/receipt.json','utf8'));
process.exit(r.verdict==='non concluant' && (r.falsificateurs.lecture_hors_dossier||[]).length===0 ?0:1)"

# 179-190 : le rapport utilisateur, dérivé du reçu, de l'output et de la trace (ADR-050). Les copies
# viennent des trois reçus réels du cas jouet ; 185 et 186 repartent du reçu de 177, qui porte le champ
# `lecture_hors_dossier`, pour éprouver la lecture et son absence. 187 part du run `conforme` de 179,
# passe le reçu et l'output en `ecart` sans falsificateur, et exige une piste tirée de
# `output.difference` (Séance 83). 188 part du même run, ajoute un falsificateur `tableau_absent` et
# garde la différence : la morsure et la piste de différence doivent coexister. 189 retire différence,
# morsure et limite : le repli « Aucune action dérivée » doit rester. 190 passe en `non concluant` avec
# une différence non vide : la différence et sa piste doivent rester tues. Rien n'écrit dans le dépôt.
RB="$B/rapport"
mkdir -p "$RB"
rapport-copie() { # source, dest — copie un run et retire les pages dérivées
  rm -rf "$2"; mkdir -p "$2"; cp -a "$1/." "$2/"; rm -f "$2/RAPPORT.md" "$2/RESULTAT.md"
}
rapport-copie "$REPO/docs/device/runs/2026-10-20-222845-50664060-3d0db46" "$RB/r179"
controle "179 rapport, conforme, liens et déterminisme" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs'),crypto=require('crypto');
const run='$RB/r179', rp=run+'/RAPPORT.md';
const sha=(p)=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run',run,'--remplacer'],{stdio:'ignore'});
const t=fs.readFileSync(rp,'utf8'), h=sha(rp);
fs.unlinkSync(rp);
execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run',run,'--remplacer'],{stdio:'ignore'});
process.exit(t.includes('conforme') && t.includes('NOTES.md') && t.includes('aucun falsificateur') && t.includes('receipt.json') && t.includes('trace/echange.jsonl') && h===sha(rp) ?0:1)"
rapport-copie "$REPO/docs/device/runs/2026-10-20-202333-50664060-1028c8b" "$RB/r180"
controle "180 rapport, non concluant, tableau absent et chemin produit" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const run='$RB/r180';
execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run',run],{stdio:'ignore'});
const t=fs.readFileSync(run+'/RAPPORT.md','utf8');
process.exit(t.includes('non concluant') && t.includes('tableau_absent') && t.includes('aidldocs/NOTES.md') ?0:1)"
controle "181 rapport refuse d'écraser sans --remplacer" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs'),crypto=require('crypto');
const run='$RB/r179', rp=run+'/RAPPORT.md';
const sha=(p)=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const h=sha(rp); let e=null;
try{execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run',run],{stdio:'pipe',encoding:'utf8'})}catch(x){e=x}
process.exit(e && e.status===1 && /existe déjà/.test(e.stderr) && sha(rp)===h ?0:1)"
controle "182 rapport --remplacer réécrit" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const run='$RB/r179';
execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run',run,'--remplacer'],{stdio:'ignore'});
process.exit(fs.existsSync(run+'/RAPPORT.md') && fs.readFileSync(run+'/RAPPORT.md','utf8').includes('conforme') ?0:1)"
mkdir -p "$RB/vide"
controle "183 rapport sans reçu refusé" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const run='$RB/vide'; let e=null;
try{execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run',run],{stdio:'pipe',encoding:'utf8'})}catch(x){e=x}
process.exit(e && e.status===1 && /receipt.json/.test(e.stderr) && !fs.existsSync(run+'/RAPPORT.md') ?0:1)"
copie-porte-jouet "$O/oc-fin"
suite-jouet-oc "$O/oc-fin" banc-jouet-apres >/dev/null 2>&1 || { echo "ARRET — la suite de 184 ne s'écrit pas"; exit 2; }
# ADR-065 : `suite` a écrit `$O/oc-fin/raw/$JOUET/last-message.md` et l'a attesté ; le retaper romprait l'empreinte.
controle "184 fin écrit RAPPORT.md automatiquement" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const env={...process.env,PATH:'$OCBIN:'+process.env.PATH,OPENCODE_FIXTURE_DIR:'$OCFIX'};
const args=['$ORCH','fin','--cas','$JOUET','--cases','$B/jouet/cases','--run','$O/oc-fin','--difference','aucune','--phrase','banc','--verdict','conforme'];
execFileSync('node',args,{stdio:'ignore',env});
const r=JSON.parse(fs.readFileSync('$O/oc-fin/receipt.json','utf8'));
const t=fs.readFileSync('$O/oc-fin/RAPPORT.md','utf8');
let e=null;try{execFileSync('node',args,{stdio:'pipe',encoding:'utf8',env})}catch(x){e=x}
process.exit(r.verdict==='conforme' && t.includes('conforme') && e && e.status===1 && /existe déjà/.test(e.stderr) ?0:1)"
rapport-copie "$B/r177" "$RB/r185"
controle "185 rapport nomme une lecture hors dossier" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const run='$RB/r185';
execFileSync('node',['$ORCH','rapport','--cas','$CAS','--run',run],{stdio:'ignore'});
const t=fs.readFileSync(run+'/RAPPORT.md','utf8');
process.exit(t.includes('lecture_hors_dossier') && t.includes('autre-cas') && t.includes('bac propre') ?0:1)"
rapport-copie "$B/r177" "$RB/r186"
node -e "const fs=require('fs'),p='$RB/r186/receipt.json';const r=JSON.parse(fs.readFileSync(p,'utf8'));delete r.falsificateurs.lecture_hors_dossier;fs.writeFileSync(p,JSON.stringify(r,null,2)+'\n')"
controle "186 rapport dit le champ absent" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const run='$RB/r186';
execFileSync('node',['$ORCH','rapport','--cas','$CAS','--run',run],{stdio:'ignore'});
const t=fs.readFileSync(run+'/RAPPORT.md','utf8');
process.exit(t.includes('écrit avant l') && t.includes('ne porte pas') && t.includes('lecture_hors_dossier') ?0:1)"
rapport-copie "$RB/r179" "$RB/r187"
node -e "const fs=require('fs');
for (const [p,v] of [['$RB/r187/receipt.json','ecart'],['$RB/r187/output.json','ecart']]) {
  const j=JSON.parse(fs.readFileSync(p,'utf8')); j.verdict=v; fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n');
}
const p='$RB/r187/output.json', o=JSON.parse(fs.readFileSync(p,'utf8'));
o.difference='le second fichier aidddocs/NOTES.md a aussi ete ecrit'; o.phrase='ecart de banc';
fs.writeFileSync(p,JSON.stringify(o,null,2)+'\n')"
controle "187 rapport, ecart sans morsure, difference et piste" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs'),crypto=require('crypto');
const run='$RB/r187';
const sha=(p)=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const avant=[sha(run+'/receipt.json'),sha(run+'/output.json')];
execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run',run,'--remplacer'],{stdio:'ignore'});
const t=fs.readFileSync(run+'/RAPPORT.md','utf8');
const apres=[sha(run+'/receipt.json'),sha(run+'/output.json')];
process.exit(t.includes(\"L'écart nommé par le juge\") && t.includes('second fichier aidddocs/NOTES.md') && t.includes(\"Relire l'écart nommé par le juge\") && !t.includes('Aucune action dérivée') && avant[0]===apres[0] && avant[1]===apres[1] ?0:1)"
rapport-copie "$RB/r179" "$RB/r188"
node -e "const fs=require('fs');
const p='$RB/r188/receipt.json', r=JSON.parse(fs.readFileSync(p,'utf8'));
r.verdict='ecart'; r.falsificateurs.tableau_absent=true;
r.tableau={...r.tableau, present:false, lignes:0, colonnes:0};
fs.writeFileSync(p,JSON.stringify(r,null,2)+'\n');
const q='$RB/r188/output.json', o=JSON.parse(fs.readFileSync(q,'utf8'));
o.verdict='ecart'; o.difference='le second fichier aidddocs/NOTES.md a aussi ete ecrit'; o.phrase='ecart de banc mordu';
fs.writeFileSync(q,JSON.stringify(o,null,2)+'\n')"
controle "188 rapport, ecart mordu, difference et piste" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs'),crypto=require('crypto');
const run='$RB/r188';
const sha=(p)=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const avant=[sha(run+'/receipt.json'),sha(run+'/output.json')];
execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run',run,'--remplacer'],{stdio:'ignore'});
const t=fs.readFileSync(run+'/RAPPORT.md','utf8');
const apres=[sha(run+'/receipt.json'),sha(run+'/output.json')];
process.exit(t.includes('| tableau_absent |') && t.includes(\"L'écart nommé par le juge\") && t.includes('second fichier aidddocs/NOTES.md') && t.includes('Vérifier que la session rend un tableau') && t.includes(\"Relire l'écart nommé par le juge\") && !t.includes('Aucune action dérivée') && avant[0]===apres[0] && avant[1]===apres[1] ?0:1)"
rapport-copie "$RB/r179" "$RB/r189"
node -e "const fs=require('fs');
const p='$RB/r189/receipt.json', r=JSON.parse(fs.readFileSync(p,'utf8'));
r.verdict='ecart'; r.limites=[]; r.falsificateurs.lecture_hors_dossier=[];
fs.writeFileSync(p,JSON.stringify(r,null,2)+'\n');
const q='$RB/r189/output.json', o=JSON.parse(fs.readFileSync(q,'utf8'));
o.verdict='ecart'; o.difference=''; o.phrase='ecart de banc sans difference';
fs.writeFileSync(q,JSON.stringify(o,null,2)+'\n')"
controle "189 rapport, ecart sans difference, repli" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs'),crypto=require('crypto');
const run='$RB/r189';
const sha=(p)=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const avant=[sha(run+'/receipt.json'),sha(run+'/output.json')];
execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run',run,'--remplacer'],{stdio:'ignore'});
const t=fs.readFileSync(run+'/RAPPORT.md','utf8');
const apres=[sha(run+'/receipt.json'),sha(run+'/output.json')];
process.exit(t.includes('Aucune action dérivée ; relire le reçu et le produit.') && !t.includes(\"L'écart nommé par le juge\") && !t.includes(\"Relire l'écart nommé par le juge\") && avant[0]===apres[0] && avant[1]===apres[1] ?0:1)"
rapport-copie "$RB/r179" "$RB/r190"
node -e "const fs=require('fs');
const p='$RB/r190/receipt.json', r=JSON.parse(fs.readFileSync(p,'utf8'));
r.verdict='non concluant'; r.limites=['limite de banc']; r.falsificateurs.lecture_hors_dossier=[];
fs.writeFileSync(p,JSON.stringify(r,null,2)+'\n');
const q='$RB/r190/output.json', o=JSON.parse(fs.readFileSync(q,'utf8'));
o.verdict='non concluant'; o.difference='une difference qui ne doit pas sortir'; o.phrase='non concluant de banc';
fs.writeFileSync(q,JSON.stringify(o,null,2)+'\n')"
controle "190 rapport, non concluant, difference tue" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs'),crypto=require('crypto');
const run='$RB/r190';
const sha=(p)=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const avant=[sha(run+'/receipt.json'),sha(run+'/output.json')];
execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run',run,'--remplacer'],{stdio:'ignore'});
const t=fs.readFileSync(run+'/RAPPORT.md','utf8');
const apres=[sha(run+'/receipt.json'),sha(run+'/output.json')];
process.exit(t.includes('non concluant') && t.includes('limite de banc') && t.includes('Relire la limite') && !t.includes(\"L'écart nommé par le juge\") && !t.includes('une difference qui ne doit pas sortir') && !t.includes(\"Relire l'écart nommé par le juge\") && !t.includes('Aucune action dérivée') && avant[0]===apres[0] && avant[1]===apres[1] ?0:1)"

# 191-193 : le cadre est un bloc lu, pas une constante du harnais (ADR-052). 191 lit le bloc du cas
# standard dans le reçu de 178 ; 192 recopie le cas, retire `terrain` de `lecture.autorisees` et lit
# le README du terrain : la lecture doit mordre, alors qu'elle était dans le dossier du cas ; 193
# retire le bloc et exige un refus, jamais un retour au cadre standard. Les cas recopiés sont re-gelés
# par `cas-budget`, donc leurs empreintes et leurs gates sont neufs.
controle "191 reçu, cadre déclaré lu" 0 node -e "
const fs=require('fs');
const r=JSON.parse(fs.readFileSync('$B/r178/receipt.json','utf8'));
const c=r.cloisonnement||{};
const l=c.lecture&&c.lecture.autorisees||[];
process.exit(c.attendu_vu==='non' && l.includes('terrain') && l.includes('framework-origin') && c.reseau==='interdit' && c.fichiers_de_contexte==='interdits' ?0:1)"
cas-budget cases-cloison "a.cloisonnement.lecture.autorisees=['framework-origin']"
node "$H" collect --run "$B/r192" --case "$CAS" --cases "$B/cases-cloison" --from "$W/terrain/README.md" >/dev/null || { echo "ARRET — r192 ne se collecte pas"; exit 2; }
node -e "const fs=require('fs'),p='$B/r192/raw/$CAS/manifest.json';const m=JSON.parse(fs.readFileSync(p,'utf8'));
m.fichiers[0].birth_epoch=$(($D0/1000+30));m.fichiers[0].birth=new Date(m.fichiers[0].birth_epoch*1000).toISOString();
fs.writeFileSync(p,JSON.stringify(m,null,2)+'\n')"
porte "$B/r192" "$B/cases-cloison"
controle "192 reçu, cadre rétréci, lecture hors cadre" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/r192','--case','$CAS','--cases','$B/cases-cloison','--faits','$B/f178.json','--verdict','non concluant'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/r192/receipt.json','utf8'));
const l=r.falsificateurs.lecture_hors_dossier||[];
process.exit(r.verdict==='non concluant' && l.length===1 && l[0].outil==='read' && String(l[0].chemin).includes('terrain/README.md') && r.cloisonnement.lecture.autorisees.length===1 && r.cloisonnement.lecture.autorisees[0]==='framework-origin' ?0:1)"
cas-budget cases-sans-cloison "delete a.cloisonnement"
node "$H" collect --run "$B/r193" --case "$CAS" --cases "$B/cases-sans-cloison" --from "$W/terrain/README.md" >/dev/null || { echo "ARRET — r193 ne se collecte pas"; exit 2; }
porte "$B/r193" "$B/cases-sans-cloison"
controle "193 reçu refus, bloc cloisonnement absent" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
let code=0,sortie='';
try { execFileSync('node',['$H','receipt','--run','$B/r193','--case','$CAS','--cases','$B/cases-sans-cloison','--faits','$B/f176.json','--verdict','non concluant'],{encoding:'utf8',stdio:['ignore','pipe','pipe']}); }
catch(e){ code=e.status; sortie=String(e.stdout||'')+String(e.stderr||''); }
process.exit(code===1 && sortie.includes('ne déclare aucun bloc cloisonnement') && !fs.existsSync('$B/r193/receipt.json') ?0:1)"

# 194-201 : les **effets hors cadre** (ADR-051). Une part `tool` nommée `shell` porte désormais sa
# commande dans la trace, écrite par la requête d'export de `clients.mjs` : aucune trace n'est tapée à
# la main. 194 à 197 lisent une commande sur le cas réel et exigent qu'un `conforme` soit refusé en
# nommant la morsure, puis qu'un `non concluant` s'écrive avec le falsificateur. 198 et 199 ajoutent un
# fichier nouveau sous l'arbre du **cas jouet**, hors de son produit : `AGENTS.md` est un fichier de
# contexte, `aidddocs/NOTES.md` un fichier de produit, et le second autorise `ecart` quand le premier
# force `non concluant`. 200 et 201 sont les positifs : des commandes littérales — `$?`, apostrophes,
# `\$`, affectation résolue entre guillemets — ne mordent pas et laissent `conforme` passer ; 201 vérifie
# aussi que l'adaptateur Freebuff écrit `commande`.
SH="$B/shell"
mkdir -p "$SH/trace" "$SH/ailleurs"
printf 'un fichier hors du cadre\n' > "$SH/ailleurs/projet-brief.md"
node - "$DBF" "$W/terrain" "$D0" "$SH/ailleurs/projet-brief.md" "$SH/ecrit.txt" <<'NODE'
const { execFileSync } = require("child_process");
const [db, travail, d0, ailleurs, ecrit] = process.argv.slice(2);
const D0 = Number(d0);
const q = (s) => String(s).replace(/'/g, "''");
const sql = (s) => execFileSync("sqlite3", [db, s]);
const TABLE = "banc, le tableau :\n\n| fichier | objet |\n| --- | --- |\n| README.md | le terrain |";
const fil = (id, commandes) => {
  sql(`insert into threads values('${id}','${q(travail)}','local','','','codebuff','aucun',${D0});`);
  sql(`insert into messages values('${id}',1,'user',${D0},'${q(JSON.stringify([{ kind: "text", text: "banc, la demande" }]))}');`);
  sql(`insert into messages values('${id}',2,'assistant',${D0 + 10000},'${q(JSON.stringify([{ kind: "text", text: TABLE }]))}');`);
  const parts = commandes.map((command) => ({ kind: "tool", toolName: "shell", input: { command }, status: "success" }));
  sql(`insert into messages values('${id}',3,'assistant',${D0 + 20000},'${q(JSON.stringify(parts))}');`);
};
fil("banc-shell-hors", [`cat ${ailleurs}`]);
fil("banc-shell-ecrit", [`echo x > ${ecrit}`]);
fil("banc-shell-reseau", ["curl -s http://localhost:8010/mcp"]);
fil("banc-shell-dyn", ["P=/tmp; echo x > $P/x"]);
NODE
export-fil banc-shell-hors "$SH/trace/194.jsonl" "$SH/f194.json" || { echo "ARRET — l'export de 194 ne s'écrit pas"; exit 2; }
export-fil banc-shell-ecrit "$SH/trace/195.jsonl" "$SH/f195.json" || { echo "ARRET — l'export de 195 ne s'écrit pas"; exit 2; }
export-fil banc-shell-reseau "$SH/trace/196.jsonl" "$SH/f196.json" || { echo "ARRET — l'export de 196 ne s'écrit pas"; exit 2; }
export-fil banc-shell-dyn "$SH/trace/197.jsonl" "$SH/f197.json" || { echo "ARRET — l'export de 197 ne s'écrit pas"; exit 2; }
for r in r194 r195 r196 r197; do lecture-run "$r"; done

controle "194 reçu, lecture shell hors cadre" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$B/r194','--case','$CAS','--faits','$SH/f194.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes('une commande shell sort du cadre déclaré')) raisons.push('le refus ne nomme pas la lecture shell : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) raisons.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$B/r194/receipt.json','utf8'));
  const l=r.falsificateurs.shell_hors_dossier||[];
  if(l.length!==1) raisons.push('shell_hors_dossier : '+l.length+' entrée(s)');
  else if(!String(l[0].chemin).includes('ailleurs')) raisons.push('chemin inattendu : '+l[0].chemin);
  else if(!String(l[0].commande).startsWith('cat ')||!String(l[0].commande).includes('projet-brief.md')) raisons.push('commande absente de l entrée : '+JSON.stringify(l[0].commande));
  if((r.falsificateurs.lecture_hors_dossier||[]).length) raisons.push('lecture_hors_dossier double la ligne shell');
  if(r.verdict!=='non concluant') raisons.push('verdict '+r.verdict);
  try{execFileSync('node',['$ORCH','rapport','--cas','$CAS','--run','$B/r194'],{stdio:'ignore'})}catch(e){raisons.push('rapport : '+String(e.message).slice(0,120))}
  const rp=fs.existsSync('$B/r194/RAPPORT.md')?fs.readFileSync('$B/r194/RAPPORT.md','utf8'):'';
  if(!rp.includes('shell_hors_dossier')) raisons.push('RAPPORT ne nomme pas la morsure shell');
  if(!rp.includes('vérifier les commandes shell')) raisons.push('RAPPORT ne dérive pas la piste shell');
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

controle "195 reçu, écriture shell hors produit" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$B/r195','--case','$CAS','--faits','$SH/f195.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes('une commande shell écrit hors du produit')) raisons.push('le refus ne nomme pas l écriture : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) raisons.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$B/r195/receipt.json','utf8'));
  const l=r.falsificateurs.shell_ecriture_hors_produit||[];
  if(l.length!==1) raisons.push('shell_ecriture_hors_produit : '+l.length+' entrée(s)');
  else if(!String(l[0].chemin).endsWith('/ecrit.txt')) raisons.push('chemin inattendu : '+l[0].chemin);
  if((r.falsificateurs.lecture_hors_dossier||[]).length) raisons.push('lecture_hors_dossier double la ligne shell');
  try{execFileSync('node',['$ORCH','rapport','--cas','$CAS','--run','$B/r195'],{stdio:'ignore'})}catch(e){raisons.push('rapport : '+String(e.message).slice(0,120))}
  const rp=fs.existsSync('$B/r195/RAPPORT.md')?fs.readFileSync('$B/r195/RAPPORT.md','utf8'):'';
  if(!rp.includes('shell_ecriture_hors_produit')) raisons.push('RAPPORT ne nomme pas la morsure d écriture');
  if(!rp.includes('écrit hors du produit')) raisons.push('RAPPORT ne dérive pas la piste écriture');
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

controle "196 reçu, appel réseau interdit" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$B/r196','--case','$CAS','--faits','$SH/f196.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes('un appel réseau interdit')) raisons.push('le refus ne nomme pas le réseau : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) raisons.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$B/r196/receipt.json','utf8'));
  const l=r.falsificateurs.reseau||[];
  if(l.length!==1) raisons.push('reseau : '+l.length+' entrée(s)');
  else if(l[0].motif!=='curl') raisons.push('motif inattendu : '+l[0].motif);
  if((r.falsificateurs.lecture_hors_dossier||[]).length) raisons.push('lecture_hors_dossier double la ligne shell');
  try{execFileSync('node',['$ORCH','rapport','--cas','$CAS','--run','$B/r196'],{stdio:'ignore'})}catch(e){raisons.push('rapport : '+String(e.message).slice(0,120))}
  const rp=fs.existsSync('$B/r196/RAPPORT.md')?fs.readFileSync('$B/r196/RAPPORT.md','utf8'):'';
  if(!rp.includes('reseau')) raisons.push('RAPPORT ne nomme pas la morsure réseau');
  if(!rp.includes('interdiction réseau')) raisons.push('RAPPORT ne dérive pas la piste réseau');
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

controle "197 reçu, commande shell non interprétable" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$B/r197','--case','$CAS','--faits','$SH/f197.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes(\"n'est pas interprétable\")) raisons.push('le refus ne nomme pas la commande non interprétable : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) raisons.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$B/r197/receipt.json','utf8'));
  const l=r.falsificateurs.shell_non_interpretable||[];
  if(l.length!==1) raisons.push('shell_non_interpretable : '+l.length+' entrée(s)');
  else if(!String(l[0].motif).includes('référence non quotée')) raisons.push('motif inattendu : '+l[0].motif);
  if(!r.limites.some((x)=>String(x).includes('non interprétable'))) raisons.push('aucune limite nommée pour la commande non interprétée');
  if((r.falsificateurs.lecture_hors_dossier||[]).length) raisons.push('lecture_hors_dossier double la ligne shell');
  try{execFileSync('node',['$ORCH','rapport','--cas','$CAS','--run','$B/r197'],{stdio:'ignore'})}catch(e){raisons.push('rapport : '+String(e.message).slice(0,120))}
  const rp=fs.existsSync('$B/r197/RAPPORT.md')?fs.readFileSync('$B/r197/RAPPORT.md','utf8'):'';
  if(!rp.includes('shell_non_interpretable')) raisons.push('RAPPORT ne nomme pas la morsure non interprétable');
  if(!rp.includes('Lire à la main la commande')) raisons.push('RAPPORT ne dérive pas la piste non interprétable');
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

# Le cas jouet pour 198 et 199 : son produit existe déjà, et sa porte du contrôle 124 a été passée quand
# l'arbre était encore propre. Le fichier nouveau est donc le seul écart que la porte n'a pas vu.
JEU="$B/jouet"
produit-jouet() { # nom-de-run — porte copiée de r124, produit collecté depuis le jouet
  mkdir -p "$JEU/$1"
  cp "$JEU/r124/gate.json" "$JEU/$1/gate.json"
  node "$H" collect --run "$JEU/$1" --case "$JOUET" --cases "$JEU/cases" --from "$JROOT/terrain/aidd_docs" >/dev/null 2>&1 \
    || { echo "ARRET — le produit du jouet de $1 ne se collecte pas"; exit 2; }
}
produit-jouet r198
export-jouet jouet-banc "$JEU/trace/198.jsonl" "$JEU/r198/faits.json" || { echo "ARRET — l'export de 198 ne s'écrit pas"; exit 2; }
printf 'contexte de banc, hors du produit\n' > "$JROOT/terrain/AGENTS.md"
controle "198 reçu, fichier de contexte hors produit" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$JEU/r198','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r198/faits.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes('un fichier de contexte est écrit hors du produit')) raisons.push('le refus ne nomme pas le contexte : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) raisons.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$JEU/r198/receipt.json','utf8'));
  const l=r.falsificateurs.hors_produit||[];
  if(l.length!==1) raisons.push('hors_produit : '+l.length+' entrée(s) : '+JSON.stringify(l));
  else if(l[0].chemin!=='terrain/AGENTS.md'||l[0].nature!=='contexte') raisons.push('entrée inattendue : '+JSON.stringify(l[0]));
  if(r.verdict!=='non concluant') raisons.push('verdict '+r.verdict);
  if((r.falsificateurs.lecture_hors_dossier||[]).length) raisons.push('lecture_hors_dossier double la ligne shell');
  try{execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run','$JEU/r198'],{stdio:'ignore'})}catch(e){raisons.push('rapport : '+String(e.message).slice(0,120))}
  const rp=fs.existsSync('$JEU/r198/RAPPORT.md')?fs.readFileSync('$JEU/r198/RAPPORT.md','utf8'):'';
  if(!rp.includes('hors_produit')) raisons.push('RAPPORT ne nomme pas la morsure hors produit');
  if(!rp.includes('Classer les fichiers nouveaux')) raisons.push('RAPPORT ne dérive pas la piste hors produit');
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"
rm -f "$JROOT/terrain/AGENTS.md"

produit-jouet r199
export-jouet jouet-banc "$JEU/trace/199.jsonl" "$JEU/r199/faits.json" || { echo "ARRET — l'export de 199 ne s'écrit pas"; exit 2; }
mkdir -p "$JROOT/terrain/aidddocs"
printf 'un fichier de produit, hors du produit\n' > "$JROOT/terrain/aidddocs/NOTES.md"
controle "199 reçu, fichier de produit hors produit -> ecart" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$JEU/r199','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r199/faits.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes('un fichier est hors du produit')) raisons.push('le refus ne nomme pas le fichier hors produit : '+refuse.sortie.split('\n')[0]);
const ok=appel('ecart');
if(ok.code!==0) raisons.push('ecart refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$JEU/r199/receipt.json','utf8'));
  const l=r.falsificateurs.hors_produit||[];
  if(l.length!==1) raisons.push('hors_produit : '+l.length+' entrée(s) : '+JSON.stringify(l));
  else if(l[0].chemin!=='terrain/aidddocs/NOTES.md'||l[0].nature!=='produit') raisons.push('entrée inattendue : '+JSON.stringify(l[0]));
  if(r.verdict!=='ecart') raisons.push('verdict '+r.verdict);
  if((r.falsificateurs.lecture_hors_dossier||[]).length) raisons.push('lecture_hors_dossier double la ligne shell');
  try{execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run','$JEU/r199'],{stdio:'ignore'})}catch(e){raisons.push('rapport : '+String(e.message).slice(0,120))}
  const rp=fs.existsSync('$JEU/r199/RAPPORT.md')?fs.readFileSync('$JEU/r199/RAPPORT.md','utf8'):'';
  if(!rp.includes('hors_produit')) raisons.push('RAPPORT ne nomme pas la morsure hors produit');
  if(!rp.includes('Classer les fichiers nouveaux')) raisons.push('RAPPORT ne dérive pas la piste hors produit');
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"
rm -rf "$JROOT/terrain/aidddocs"

# 200 et 201 : les positifs. Les commandes sont littérales et restent dans le cadre ; le tableau et le
# produit sont ceux du jouet, dont l'arbre a bougé depuis la porte (le produit), donc la condition 3 ne
# mord pas. Le budget du jouet est de deux échanges, et le fil n'en porte qu'un.
node - "$DBF" "$JROOT/terrain" "$P" "$JROOT/framework-origin/PLAYBOOK.md" "$JROOT/framework-origin/COPIE.md" "$JROOT/framework-origin/COPIE-APRES.md" "$JROOT/terrain/aidd_docs/NOTES.md" "$JROOT/framework-origin/COPIE-FRONTIERE.md" <<'NODE'
const { execFileSync } = require("child_process");
const [db, travail, p, playbook, copie, copieApres, produit, copieFrontiere] = process.argv.slice(2);
const base = Number(p) * 1000;
const q = (s) => String(s).replace(/'/g, "''");
const sql = (s) => execFileSync("sqlite3", [db, s]);
const TABLE = "banc, le tableau du jouet :\n\n| fichier | objet |\n| --- | --- |\n| README.md | le terrain |";
const fil = (id, commandes) => {
  sql(`insert into threads values('${id}','${q(travail)}','local','','','codebuff','aucun',${base - 60000});`);
  sql(`insert into messages values('${id}',1,'user',${base - 40000},'${q(JSON.stringify([{ kind: "text", text: "banc, la demande" }]))}');`);
  sql(`insert into messages values('${id}',2,'assistant',${base - 20000},'${q(JSON.stringify([{ kind: "text", text: TABLE }]))}');`);
  const parts = commandes.map((command, i) => ({ kind: "tool", toolName: "shell", input: { command }, status: "success" }));
  sql(`insert into messages values('${id}',3,'assistant',${base - 10000},'${q(JSON.stringify(parts))}');`);
};
fil("banc-shell-propre", ["git status", "cat aidd_docs/memory/api.md", "true; echo $?", "echo '$HOME'", "echo \\$HOME"]);
fil("banc-shell-affectation", [
  `T=${playbook}; cp "$T" aidd_docs/premier.md`,
  `T=${playbook}; cp "\${T}" aidd_docs/second.md`,
]);
// 202 et 203 : le puits `/dev/null` (ADR-053). Le positif écrit vers le puits par redirection et par
// argument ; le garde-fou vérifie que la règle compare le chemin entier, pas un préfixe.
fil("banc-shell-puits", ["head -n 2 README.md 2>/dev/null; cp README.md /dev/null; ls -la"]);
fil("banc-shell-puits-presque", ["cat /dev/nullx; echo x > /dev/nullx"]);
// 212 et 213 : les deux formes mesurées sur le run plan-simple de la Séance 98. La plage d'un `awk`
// commence par `/` sans être un chemin ; la variable d'une boucle `for … in` littérale se résout.
fil("banc-shell-awk", ["awk '/^```mermaid$/,/^```$/' README.md"]);
fil("banc-shell-for", ["for f in README.md aidd_docs/memory/api.md; do echo \"=== $f ===\"; grep -n plan \"$f\"; done"]);
// 214 à 217 : la substitution bornée (ADR-056). 214 porte une substitution dont la commande interne est
// lisible ; 215 lit, dans la substitution, un chemin hors du cadre ; 216 emploie la valeur inconnue comme
// chemin ; 217 imbrique une substitution, que le lecteur refuse de borner.
fil("banc-shell-substitution", ["n=$(grep -c plan README.md); echo \"$n\""]);
fil("banc-shell-substitution-lecture", ["n=$(cat ../hors-cadre.md); echo \"$n\""]);
fil("banc-shell-substitution-chemin", ["cat $(ls aidd_docs)"]);
fil("banc-shell-substitution-imbriquee", ["x=$(cat $(ls))"]);
// 218 à 221 : `xargs` et `find -exec` dont la commande interne est littérale (ADR-057). 218 lit la
// commande d'un `xargs` ; 219 lit, dans un `-exec`, un chemin hors du cadre ; 220 emploie `{}` comme
// chemin ; 221 omet le terminateur du bloc.
fil("banc-shell-xargs", ["echo x | xargs grep -n plan README.md"]);
fil("banc-shell-exec-lecture", ["find . -exec cat ../hors-cadre.md \\;"]);
fil("banc-shell-exec-placeholder", ["find . -exec cat {} \\;"]);
fil("banc-shell-exec-non-terminee", ["find . -exec cat"]);
// 249 : un guillemet simple non ferme, que le shell refuserait. Meme forme que le seq 65 du run spike-annees.
fil("banc-shell-guillemet-ouvert", ["echo 'un guillemet non ferme"]);
// 222 et 223 : la question sans réponse (ADR-058). 222 pose une question puis écrit sans qu'aucune ligne
// `user` ne les sépare ; 223 porte la réponse figée entre les deux. Le tableau et le produit sont ceux du
// jouet, et l'écriture est celle d'un acte nommé (`write` + chemin), comme H6 le définit.
const filQuestion = (id, reponse) => {
  sql(`insert into threads values('${id}','${q(travail)}','local','','','codebuff','aucun',${base - 60000});`);
  sql(`insert into messages values('${id}',1,'user',${base - 40000},'${q(JSON.stringify([{ kind: "text", text: "banc, la demande" }]))}');`);
  sql(`insert into messages values('${id}',2,'assistant',${base - 30000},'${q(JSON.stringify([{ kind: "text", text: TABLE }]))}');`);
  const Q = { kind: "tool", toolName: "question", input: { question: "on écrit le produit ?" }, status: "success" };
  sql(`insert into messages values('${id}',3,'assistant',${base - 20000},'${q(JSON.stringify([Q]))}');`);
  if (reponse) sql(`insert into messages values('${id}',4,'user',${base - 15000},'${q(JSON.stringify([{ kind: "text", text: "banc, la réponse figée" }]))}');`);
  const W = { kind: "tool", toolName: "write", input: { path: "aidd_docs/NOTES.md", content: "le produit du jouet" }, status: "success" };
  sql(`insert into messages values('${id}',${reponse ? 5 : 4},'assistant',${base - 10000},'${q(JSON.stringify([W]))}');`);
};
filQuestion("banc-question-sans-reponse", false);
filQuestion("banc-question-repondue", true);
// 204 et 205 : F7 compare le produit aux fichiers **lus** avant sa naissance (ADR-054). Le positif lit
// une copie exacte du produit ; le garde-fou lit le playbook, dont le contenu diffère.
// 206 et 207 : les deux exclusions de F7 (ADR-054). 206 lit une copie exacte **après** la naissance du
// produit (seconde suivante) ; 207 relit **le produit lui-même**, avant sa naissance. Aucun des deux ne
// doit mordre. Les deux contrôles exigent la limite d'ADR-054 : sans elle, une fixture non lue passerait
// pour un silence.
// 208 et 209 : la frontière d'égalité (ADR-055). `birth_epoch` a la résolution de la seconde ; la même
// copie exacte est lue dans la seconde de naissance (208) puis dans la seconde précédente (209).
const naissance = (Number(p) + 5) * 1000; // les manifestes de 204 à 209 sont retouchés à P+5
const filLecture = (id, chemin, tsLecture = base - 10000) => {
  sql(`insert into threads values('${id}','${q(travail)}','local','','','codebuff','aucun',${base - 60000});`);
  sql(`insert into messages values('${id}',1,'user',${base - 40000},'${q(JSON.stringify([{ kind: "text", text: "banc, la demande" }]))}');`);
  sql(`insert into messages values('${id}',2,'assistant',${base - 20000},'${q(JSON.stringify([{ kind: "text", text: TABLE }]))}');`);
  const part = { kind: "tool", toolName: "read", input: { path: chemin }, status: "success" };
  sql(`insert into messages values('${id}',3,'assistant',${tsLecture},'${q(JSON.stringify([part]))}');`);
};
filLecture("banc-f7-copie", copie);
filLecture("banc-f7-lecture", playbook);
filLecture("banc-f7-apres", copieApres, base + 6000);
filLecture("banc-f7-soi", produit);
filLecture("banc-f7-frontiere", copieFrontiere, naissance);
filLecture("banc-f7-avant", copieFrontiere, naissance - 1);
NODE
produit-jouet r200
export-jouet banc-shell-propre "$JEU/trace/200.jsonl" "$JEU/r200/faits.json" || { echo "ARRET — l'export de 200 ne s'écrit pas"; exit 2; }
controle "200 reçu, commandes littérales, conforme accepté" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
try{execFileSync('node',['$H','receipt','--run','$JEU/r200','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r200/faits.json','--verdict','conforme'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});}catch(e){raisons.push('conforme refusé : '+String(e.stderr||'').split('\n')[0])}
if(!raisons.length){
  const r=JSON.parse(fs.readFileSync('$JEU/r200/receipt.json','utf8'));
  for(const k of ['shell_hors_dossier','shell_ecriture_hors_produit','shell_non_interpretable','reseau','hors_produit','lecture_hors_dossier']) if((r.falsificateurs[k]||[]).length) raisons.push(k+' mord : '+JSON.stringify(r.falsificateurs[k]));
  if(r.verdict!=='conforme') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

produit-jouet r201
export-jouet banc-shell-affectation "$JEU/trace/201.jsonl" "$JEU/r201/faits.json" || { echo "ARRET — l'export de 201 ne s'écrit pas"; exit 2; }
controle "201 reçu, affectation littérale, conforme accepté" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
try{execFileSync('node',['$H','receipt','--run','$JEU/r201','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r201/faits.json','--verdict','conforme'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});}catch(e){raisons.push('conforme refusé : '+String(e.stderr||'').split('\n')[0])}
if(!raisons.length){
  const r=JSON.parse(fs.readFileSync('$JEU/r201/receipt.json','utf8'));
  for(const k of ['shell_hors_dossier','shell_ecriture_hors_produit','shell_non_interpretable','reseau','hors_produit']) if((r.falsificateurs[k]||[]).length) raisons.push(k+' mord : '+JSON.stringify(r.falsificateurs[k]));
  if(r.verdict!=='conforme') raisons.push('verdict '+r.verdict);
}
const lignes=fs.readFileSync('$JEU/trace/201.jsonl','utf8').split('\n').filter(Boolean).map((l)=>JSON.parse(l));
const shell=lignes.filter((l)=>l.outil==='shell');
if(shell.length!==2) raisons.push('lignes shell dans la trace : '+shell.length);
else if(!String(shell[0].commande).includes('cp \"\$T\" aidd_docs/premier.md')) raisons.push('commande non écrite par l adaptateur : '+JSON.stringify(shell[0].commande));
else if(!String(shell[1].commande).includes('cp \"\${T}\" aidd_docs/second.md')) raisons.push('commande \${T} non écrite : '+JSON.stringify(shell[1].commande));
// L'adaptateur opencode écrit le même champ (ADR-051, spec §4.1) : la fixture « banc-opencode-shell »
// porte une commande, et faits doit la rendre dans le JSONL normalisé, pas seulement en mémoire.
const trace='$OCB/trace/201-shell.jsonl';
fs.writeFileSync(trace,'');
try{execFileSync('node',['$H','faits','--case','cas-oc','--cases','$O/cases','--client','opencode','--store','$OCB/home/.local/share/opencode','--fil','banc-opencode-shell','--trace',trace,'--out','$OCB/f201-shell.json','--par','banc','--fin','$(date -Is)','--conduite','humain'],{stdio:'ignore',env:{...process.env,PATH:'$OCBIN:'+process.env.PATH,OPENCODE_FIXTURE_DIR:'$OCFIX'}});}catch(e){raisons.push('faits opencode : '+String(e.message).slice(0,120))}
if(fs.existsSync(trace)){
  const l=fs.readFileSync(trace,'utf8').split('\n').filter(Boolean).map((x)=>JSON.parse(x)).find((x)=>x.outil==='shell');
  if(!l) raisons.push('aucune ligne shell dans la trace opencode');
  else if(l.commande!=='cat README.md') raisons.push('commande opencode non écrite : '+JSON.stringify(l.commande));
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

# 202 et 203 : le puits `/dev/null` (ADR-053). 202 écrit vers le puits par redirection (`2>/dev/null`)
# et par argument (`cp … /dev/null`) : aucune des deux listes ne doit le retenir, et `conforme` passe.
# 203 emploie `/dev/nullx`, un nom qui commence par le puits : la règle compare le chemin entier, donc
# les deux falsificateurs mordent et `conforme` est refusé.
produit-jouet r202
export-jouet banc-shell-puits "$JEU/trace/202.jsonl" "$JEU/r202/faits.json" || { echo "ARRET — l'export de 202 ne s'écrit pas"; exit 2; }
controle "202 reçu, /dev/null n'est ni lecture ni écriture" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
try{execFileSync('node',['$H','receipt','--run','$JEU/r202','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r202/faits.json','--verdict','conforme'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});}catch(e){raisons.push('conforme refusé : '+String(e.stderr||'').split('\n')[0])}
if(!raisons.length){
  const r=JSON.parse(fs.readFileSync('$JEU/r202/receipt.json','utf8'));
  for(const k of ['shell_hors_dossier','shell_ecriture_hors_produit','shell_non_interpretable','reseau','hors_produit']) if((r.falsificateurs[k]||[]).length) raisons.push(k+' mord : '+JSON.stringify(r.falsificateurs[k]));
  if(r.verdict!=='conforme') raisons.push('verdict '+r.verdict);
  if(!(r.limites||[]).some((l)=>l.includes('/dev/null')&&l.includes('puits'))) raisons.push('la limite ne nomme pas le puits');
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

produit-jouet r203
export-jouet banc-shell-puits-presque "$JEU/trace/203.jsonl" "$JEU/r203/faits.json" || { echo "ARRET — l'export de 203 ne s'écrit pas"; exit 2; }
controle "203 reçu, /dev/nullx reste un chemin" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$JEU/r203','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r203/faits.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes('une commande shell sort du cadre déclaré')) raisons.push('le refus ne nomme pas la lecture shell : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) raisons.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$JEU/r203/receipt.json','utf8'));
  const lus=r.falsificateurs.shell_hors_dossier||[], ecrits=r.falsificateurs.shell_ecriture_hors_produit||[];
  if(!lus.some((e)=>e.chemin==='/dev/nullx')) raisons.push('shell_hors_dossier ne nomme pas /dev/nullx : '+JSON.stringify(lus));
  if(!ecrits.some((e)=>e.chemin==='/dev/nullx')) raisons.push('shell_ecriture_hors_produit ne nomme pas /dev/nullx : '+JSON.stringify(ecrits));
  if(lus.some((e)=>e.chemin==='/dev/null')||ecrits.some((e)=>e.chemin==='/dev/null')) raisons.push('le puits est retenu alors que la commande ne le cible pas');
  if(r.verdict!=='non concluant') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

# 204 et 205 : F7 compare le produit aux fichiers lus avant sa naissance (ADR-054). Le 204 lit une copie
# exacte du produit, née après la lecture : le falsificateur la nomme, avec sa source, et `conforme` est
# refusé. Le 205 lit un fichier au contenu différent : aucun falsificateur ne mord, `conforme` passe.
produit-jouet r204
cp "$JROOT/terrain/aidd_docs/NOTES.md" "$JROOT/framework-origin/COPIE.md"
node -e "const fs=require('fs'),p='$JEU/r204/raw/$JOUET/manifest.json';const m=JSON.parse(fs.readFileSync(p,'utf8'));m.fichiers[0].birth_epoch=$P+5;m.fichiers[0].birth=new Date(m.fichiers[0].birth_epoch*1000).toISOString();fs.writeFileSync(p,JSON.stringify(m,null,2)+'\n')"
export-jouet banc-f7-copie "$JEU/trace/204.jsonl" "$JEU/r204/faits.json" || { echo "ARRET — l'export de 204 ne s'écrit pas"; exit 2; }
controle "204 reçu, produit copié d'une lecture (F7)" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$JEU/r204','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r204/faits.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes('le produit est identique à un fichier déjà présent avant le run')) raisons.push('le refus ne nomme pas F7 : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) raisons.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$JEU/r204/receipt.json','utf8'));
  const l=r.falsificateurs.produit_identique_a_une_empreinte_anterieure||[];
  const copie=l.find((e)=>e.chemin==='NOTES.md'&&String(e.source).includes('COPIE.md'));
  if(!copie) raisons.push('F7 ne nomme pas la copie : '+JSON.stringify(l));
  else if(typeof copie.sha256!=='string'||copie.sha256.length!==64) raisons.push('empreinte absente de l entrée : '+JSON.stringify(copie));
  if(r.verdict!=='non concluant') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"
rm -f "$JROOT/framework-origin/COPIE.md"

produit-jouet r205
node -e "const fs=require('fs'),p='$JEU/r205/raw/$JOUET/manifest.json';const m=JSON.parse(fs.readFileSync(p,'utf8'));m.fichiers[0].birth_epoch=$P+5;m.fichiers[0].birth=new Date(m.fichiers[0].birth_epoch*1000).toISOString();fs.writeFileSync(p,JSON.stringify(m,null,2)+'\n')"
export-jouet banc-f7-lecture "$JEU/trace/205.jsonl" "$JEU/r205/faits.json" || { echo "ARRET — l'export de 205 ne s'écrit pas"; exit 2; }
controle "205 reçu, lecture au contenu différent, conforme" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
try{execFileSync('node',['$H','receipt','--run','$JEU/r205','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r205/faits.json','--verdict','conforme'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});}catch(e){raisons.push('conforme refusé : '+String(e.stderr||'').split('\n')[0])}
if(!raisons.length){
  const r=JSON.parse(fs.readFileSync('$JEU/r205/receipt.json','utf8'));
  for(const k of ['produit_identique_a_une_empreinte_anterieure','shell_hors_dossier','shell_ecriture_hors_produit','shell_non_interpretable','reseau','hors_produit','lecture_hors_dossier']) if((r.falsificateurs[k]||[]).length) raisons.push(k+' mord : '+JSON.stringify(r.falsificateurs[k]));
  if(r.verdict!=='conforme') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

produit-jouet r206
cp "$JROOT/terrain/aidd_docs/NOTES.md" "$JROOT/framework-origin/COPIE-APRES.md"
export-jouet banc-f7-apres "$JEU/trace/206.jsonl" "$JEU/r206/faits.json" || { echo "ARRET — l'export de 206 ne s'écrit pas"; exit 2; }
controle "206 reçu, lecture après la naissance (F7 silencieux)" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
try{execFileSync('node',['$H','receipt','--run','$JEU/r206','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r206/faits.json','--verdict','conforme'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});}catch(e){raisons.push('conforme refusé : '+String(e.stderr||'').split('\n')[0])}
if(!raisons.length){
  const r=JSON.parse(fs.readFileSync('$JEU/r206/receipt.json','utf8'));
  const f7=r.falsificateurs.produit_identique_a_une_empreinte_anterieure||[];
  if(f7.length) raisons.push('F7 mord une lecture postérieure : '+JSON.stringify(f7));
  if(!(r.limites||[]).some((l)=>l.includes('ADR-054'))) raisons.push('limite ADR-054 absente : la lecture n a pas été vue');
  if((r.limites||[]).some((l)=>l.includes('ADR-055'))) raisons.push('limite ADR-055 sur une lecture de la seconde suivante : '+JSON.stringify((r.limites||[]).filter((l)=>l.includes('ADR-055'))));
  if(r.verdict!=='conforme') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"
rm -f "$JROOT/framework-origin/COPIE-APRES.md"

produit-jouet r207
export-jouet banc-f7-soi "$JEU/trace/207.jsonl" "$JEU/r207/faits.json" || { echo "ARRET — l'export de 207 ne s'écrit pas"; exit 2; }
controle "207 reçu, relecture du produit lui-même (F7 silencieux)" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
try{execFileSync('node',['$H','receipt','--run','$JEU/r207','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r207/faits.json','--verdict','conforme'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});}catch(e){raisons.push('conforme refusé : '+String(e.stderr||'').split('\n')[0])}
if(!raisons.length){
  const r=JSON.parse(fs.readFileSync('$JEU/r207/receipt.json','utf8'));
  const f7=r.falsificateurs.produit_identique_a_une_empreinte_anterieure||[];
  if(f7.length) raisons.push('F7 mord la relecture du produit : '+JSON.stringify(f7));
  if(!(r.limites||[]).some((l)=>l.includes('ADR-054'))) raisons.push('limite ADR-054 absente : la lecture n a pas été vue');
  if(r.verdict!=='conforme') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

# 208 et 209 : la frontière d'égalité de F7 (ADR-055). `birth_epoch` est une seconde entière ; une
# lecture datée dans cette même seconde peut précéder ou suivre la naissance réelle. Le 208 l'écarte de
# la morsure et exige que la limite nomme l'indécision ; le 209 lit la même copie dans la seconde
# précédente, où F7 mord sans limite d'ADR-055 — sans ce garde-fou, une fenêtre élargie passerait.
produit-jouet r208
cp "$JROOT/terrain/aidd_docs/NOTES.md" "$JROOT/framework-origin/COPIE-FRONTIERE.md"
node -e "const fs=require('fs'),p='$JEU/r208/raw/$JOUET/manifest.json';const m=JSON.parse(fs.readFileSync(p,'utf8'));m.fichiers[0].birth_epoch=$P+5;m.fichiers[0].birth=new Date(m.fichiers[0].birth_epoch*1000).toISOString();fs.writeFileSync(p,JSON.stringify(m,null,2)+'\n')"
export-jouet banc-f7-frontiere "$JEU/trace/208.jsonl" "$JEU/r208/faits.json" || { echo "ARRET — l'export de 208 ne s'écrit pas"; exit 2; }
controle "208 reçu, lecture dans la seconde de naissance (F7 silencieux)" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
try{execFileSync('node',['$H','receipt','--run','$JEU/r208','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r208/faits.json','--verdict','conforme'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});}catch(e){raisons.push('conforme refusé : '+String(e.stderr||'').split('\n')[0])}
if(!raisons.length){
  const r=JSON.parse(fs.readFileSync('$JEU/r208/receipt.json','utf8'));
  const f7=r.falsificateurs.produit_identique_a_une_empreinte_anterieure||[];
  if(f7.length) raisons.push('F7 mord une lecture de la seconde de naissance : '+JSON.stringify(f7));
  const lim=(r.limites||[]).find((l)=>l.includes('ADR-055'));
  if(!lim) raisons.push('limite ADR-055 absente : l indécision n est pas nommée');
  else if(!lim.includes('COPIE-FRONTIERE.md')) raisons.push('la limite ne nomme pas la lecture : '+lim);
  if(!(r.limites||[]).some((l)=>l.includes('ADR-054'))) raisons.push('limite ADR-054 absente : la lecture n a pas été vue');
  if(r.verdict!=='conforme') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

produit-jouet r209
node -e "const fs=require('fs'),p='$JEU/r209/raw/$JOUET/manifest.json';const m=JSON.parse(fs.readFileSync(p,'utf8'));m.fichiers[0].birth_epoch=$P+5;m.fichiers[0].birth=new Date(m.fichiers[0].birth_epoch*1000).toISOString();fs.writeFileSync(p,JSON.stringify(m,null,2)+'\n')"
export-jouet banc-f7-avant "$JEU/trace/209.jsonl" "$JEU/r209/faits.json" || { echo "ARRET — l'export de 209 ne s'écrit pas"; exit 2; }
controle "209 reçu, lecture dans la seconde précédente (F7 mord)" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$JEU/r209','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r209/faits.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes('le produit est identique à un fichier déjà présent avant le run')) raisons.push('le refus ne nomme pas F7 : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) raisons.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$JEU/r209/receipt.json','utf8'));
  const f7=r.falsificateurs.produit_identique_a_une_empreinte_anterieure||[];
  const entree=f7.find((e)=>e.chemin==='NOTES.md'&&String(e.source).includes('COPIE-FRONTIERE.md'));
  if(!entree) raisons.push('F7 ne nomme pas la copie de la seconde précédente : '+JSON.stringify(f7));
  if((r.limites||[]).some((l)=>l.includes('ADR-055'))) raisons.push('limite ADR-055 sur une lecture strictement antérieure : '+JSON.stringify((r.limites||[]).filter((l)=>l.includes('ADR-055'))));
  if(r.verdict!=='non concluant') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"
# 212-213 : les deux formes, sur le cas jouet, pour que `conforme` soit atteignable et que la morsure
# mesurée soit la seule différence. 212 refuse si le programme d'`awk` est ramassé comme un chemin ;
# 213 refuse si la boucle rend la commande opaque.
produit-jouet r212
export-jouet banc-shell-awk "$JEU/trace/212.jsonl" "$JEU/r212/faits.json" || { echo "ARRET — l'export de 212 ne s'écrit pas"; exit 2; }
controle "212 reçu, plage awk n'est pas un chemin" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
try{execFileSync('node',['$H','receipt','--run','$JEU/r212','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r212/faits.json','--verdict','conforme'],{encoding:'utf8',stdio:['ignore','pipe','pipe']})}catch(e){raisons.push('conforme refusé : '+String(e.stderr||e.stdout||'').split('\n')[0])}
if(!raisons.length){
  const r=JSON.parse(fs.readFileSync('$JEU/r212/receipt.json','utf8'));
  const l=r.falsificateurs.shell_hors_dossier||[];
  if(l.length) raisons.push('shell_hors_dossier mord sur le programme awk : '+JSON.stringify(l));
  if(r.verdict!=='conforme') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

produit-jouet r213
export-jouet banc-shell-for "$JEU/trace/213.jsonl" "$JEU/r213/faits.json" || { echo "ARRET — l'export de 213 ne s'écrit pas"; exit 2; }
controle "213 reçu, boucle for littérale déroulée" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
try{execFileSync('node',['$H','receipt','--run','$JEU/r213','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r213/faits.json','--verdict','conforme'],{encoding:'utf8',stdio:['ignore','pipe','pipe']})}catch(e){raisons.push('conforme refusé : '+String(e.stderr||e.stdout||'').split('\n')[0])}
if(!raisons.length){
  const r=JSON.parse(fs.readFileSync('$JEU/r213/receipt.json','utf8'));
  const l=r.falsificateurs.shell_non_interpretable||[];
  if(l.length) raisons.push('shell_non_interpretable mord sur la boucle : '+JSON.stringify(l));
  if(r.verdict!=='conforme') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

# 214-217 : la substitution bornée (ADR-056). 214 et 215 mesurent les deux moitiés de la règle — la
# substitution est lue (214 accepté) et ses effets sont mesurés (215 mord sur la lecture interne) ; 216 et
# 217 gardent les deux bornes — la valeur reste inconnue, et une substitution imbriquée reste refusée.
produit-jouet r214
export-jouet banc-shell-substitution "$JEU/trace/214.jsonl" "$JEU/r214/faits.json" || { echo "ARRET — l'export de 214 ne s'écrit pas"; exit 2; }
controle "214 reçu, substitution bornée lue" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
try{execFileSync('node',['$H','receipt','--run','$JEU/r214','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r214/faits.json','--verdict','conforme'],{encoding:'utf8',stdio:['ignore','pipe','pipe']})}catch(e){raisons.push('conforme refusé : '+String(e.stderr||e.stdout||'').split('\n')[0])}
if(!raisons.length){
  const r=JSON.parse(fs.readFileSync('$JEU/r214/receipt.json','utf8'));
  const l=r.falsificateurs.shell_non_interpretable||[];
  if(l.length) raisons.push('shell_non_interpretable mord sur la substitution : '+JSON.stringify(l));
  if(r.verdict!=='conforme') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

produit-jouet r215
export-jouet banc-shell-substitution-lecture "$JEU/trace/215.jsonl" "$JEU/r215/faits.json" || { echo "ARRET — l'export de 215 ne s'écrit pas"; exit 2; }
controle "215 reçu, lecture interne de la substitution mesurée" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$JEU/r215','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r215/faits.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes('une commande shell sort du cadre déclaré')) raisons.push('le refus ne nomme pas la lecture interne : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) raisons.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$JEU/r215/receipt.json','utf8'));
  const l=r.falsificateurs.shell_hors_dossier||[];
  if(!l.some((e)=>String(e.chemin).endsWith('/hors-cadre.md'))) raisons.push('shell_hors_dossier ne nomme pas la lecture interne : '+JSON.stringify(l));
  if((r.falsificateurs.shell_non_interpretable||[]).length) raisons.push('la substitution reste opaque : '+JSON.stringify(r.falsificateurs.shell_non_interpretable));
  if(r.verdict!=='non concluant') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

produit-jouet r216
export-jouet banc-shell-substitution-chemin "$JEU/trace/216.jsonl" "$JEU/r216/faits.json" || { echo "ARRET — l'export de 216 ne s'écrit pas"; exit 2; }
controle "216 reçu, valeur de substitution jamais un chemin" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$JEU/r216','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r216/faits.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes('valeur inconnue')) raisons.push('le refus ne nomme pas la valeur inconnue : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) raisons.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$JEU/r216/receipt.json','utf8'));
  const l=r.falsificateurs.shell_non_interpretable||[];
  if(!l.some((e)=>String(e.motif).includes('valeur inconnue'))) raisons.push('shell_non_interpretable ne nomme pas la valeur : '+JSON.stringify(l));
  if(r.verdict!=='non concluant') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

produit-jouet r217
export-jouet banc-shell-substitution-imbriquee "$JEU/trace/217.jsonl" "$JEU/r217/faits.json" || { echo "ARRET — l'export de 217 ne s'écrit pas"; exit 2; }
controle "217 reçu, substitution imbriquée refusée" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$JEU/r217','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r217/faits.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes('substitution imbriquée')) raisons.push('le refus ne nomme pas l imbrication : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) raisons.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$JEU/r217/receipt.json','utf8'));
  const l=r.falsificateurs.shell_non_interpretable||[];
  if(!l.some((e)=>String(e.motif).includes('imbriquée'))) raisons.push('shell_non_interpretable ne nomme pas l imbrication : '+JSON.stringify(l));
  if(r.verdict!=='non concluant') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

# 218-221 : `xargs` et `find -exec` (ADR-057). 218 et 219 mesurent la même règle que la substitution — la
# commande interne est lue, ses effets mesurés ; 220 et 221 gardent les bornes — `{}` reste inconnu, et un
# bloc sans terminateur reste refusé.
produit-jouet r218
export-jouet banc-shell-xargs "$JEU/trace/218.jsonl" "$JEU/r218/faits.json" || { echo "ARRET — l'export de 218 ne s'écrit pas"; exit 2; }
controle "218 reçu, commande de xargs lue" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
try{execFileSync('node',['$H','receipt','--run','$JEU/r218','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r218/faits.json','--verdict','conforme'],{encoding:'utf8',stdio:['ignore','pipe','pipe']})}catch(e){raisons.push('conforme refusé : '+String(e.stderr||e.stdout||'').split('\n')[0])}
if(!raisons.length){
  const r=JSON.parse(fs.readFileSync('$JEU/r218/receipt.json','utf8'));
  const l=r.falsificateurs.shell_non_interpretable||[];
  if(l.length) raisons.push('shell_non_interpretable mord sur xargs : '+JSON.stringify(l));
  if(r.verdict!=='conforme') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

produit-jouet r219
export-jouet banc-shell-exec-lecture "$JEU/trace/219.jsonl" "$JEU/r219/faits.json" || { echo "ARRET — l'export de 219 ne s'écrit pas"; exit 2; }
controle "219 reçu, commande interne du find -exec mesurée" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$JEU/r219','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r219/faits.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes('une commande shell sort du cadre déclaré')) raisons.push('le refus ne nomme pas la lecture interne : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) raisons.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$JEU/r219/receipt.json','utf8'));
  const l=r.falsificateurs.shell_hors_dossier||[];
  if(!l.some((e)=>String(e.chemin).endsWith('/hors-cadre.md'))) raisons.push('shell_hors_dossier ne nomme pas la lecture interne : '+JSON.stringify(l));
  if((r.falsificateurs.shell_non_interpretable||[]).length) raisons.push('la commande interne reste opaque : '+JSON.stringify(r.falsificateurs.shell_non_interpretable));
  if(r.verdict!=='non concluant') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

produit-jouet r220
export-jouet banc-shell-exec-placeholder "$JEU/trace/220.jsonl" "$JEU/r220/faits.json" || { echo "ARRET — l'export de 220 ne s'écrit pas"; exit 2; }
controle "220 reçu, {} de find -exec jamais un chemin" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$JEU/r220','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r220/faits.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes('valeur inconnue')) raisons.push('le refus ne nomme pas la valeur inconnue : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) raisons.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$JEU/r220/receipt.json','utf8'));
  const l=r.falsificateurs.shell_non_interpretable||[];
  if(!l.some((e)=>String(e.motif).includes('valeur inconnue'))) raisons.push('shell_non_interpretable ne nomme pas la valeur : '+JSON.stringify(l));
  if(r.verdict!=='non concluant') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

produit-jouet r221
export-jouet banc-shell-exec-non-terminee "$JEU/trace/221.jsonl" "$JEU/r221/faits.json" || { echo "ARRET — l'export de 221 ne s'écrit pas"; exit 2; }
controle "221 reçu, find -exec sans terminateur refusé" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$JEU/r221','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r221/faits.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes('non terminée')) raisons.push('le refus ne nomme pas le terminateur : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) raisons.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$JEU/r221/receipt.json','utf8'));
  const l=r.falsificateurs.shell_invalide||[];
  if(!l.some((e)=>String(e.motif).includes('non terminée'))) raisons.push('shell_invalide ne nomme pas le terminateur : '+JSON.stringify(l));
  if((r.falsificateurs.shell_non_interpretable||[]).length) raisons.push('shell_non_interpretable mord sur une commande mal formée');
  if(r.verdict!=='non concluant') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

# 222 et 223 : la question sans réponse (ADR-058). 222 mesure la morsure et le plafond ; 223 mesure que
# la réponse, entre la question et l'écriture, laisse le reçu muet.
produit-jouet r222
export-jouet banc-question-sans-reponse "$JEU/trace/222.jsonl" "$JEU/r222/faits.json" || { echo "ARRET — l'export de 222 ne s'écrit pas"; exit 2; }
controle "222 reçu, question sans réponse avant l'écriture" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$JEU/r222','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r222/faits.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes('la session a posé une question et écrit sans réponse')) raisons.push('le refus ne nomme pas la question sans réponse : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) raisons.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$JEU/r222/receipt.json','utf8'));
  const l=r.falsificateurs.question_sans_reponse||[];
  if(l.length!==1) raisons.push('question_sans_reponse : '+JSON.stringify(l));
  else if(l[0].seq_question!==3||l[0].seq_ecriture!==4) raisons.push('les seq nommés ne sont pas ceux du fil : '+JSON.stringify(l[0]));
  if(r.verdict!=='non concluant') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

produit-jouet r223
export-jouet banc-question-repondue "$JEU/trace/223.jsonl" "$JEU/r223/faits.json" || { echo "ARRET — l'export de 223 ne s'écrit pas"; exit 2; }
controle "223 reçu, réponse entre la question et l'écriture" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
try{execFileSync('node',['$H','receipt','--run','$JEU/r223','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r223/faits.json','--verdict','conforme'],{encoding:'utf8',stdio:['ignore','pipe','pipe']})}catch(e){raisons.push('conforme refusé : '+String(e.stderr||e.stdout||'').split('\n')[0])}
if(!raisons.length){
  const r=JSON.parse(fs.readFileSync('$JEU/r223/receipt.json','utf8'));
  const l=r.falsificateurs.question_sans_reponse||[];
  if(l.length) raisons.push('question_sans_reponse mord sur une question répondue : '+JSON.stringify(l));
  if(r.verdict!=='conforme') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

# 224-227 : `ouvrir` (spec 2026-10-22-000407). Le serveur opencode est factice : il imite les cinq
# routes de l'API et ne touche a aucun reseau. Le cas, la porte et le texte sont ceux de `cas-test`,
# ecrits plus haut : `ouvrir` n'ecrit rien, et le controle verifie aussi cette immobilité.
cat > "$O/faux-serveur.mjs" <<'JS'
// Un serveur opencode factice, et `ouvrir` contre lui. argv : detail, mode, run, cas, cases, orch.
import http from "node:http";
import { spawn } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const [detail, mode, run, cas, cases, orch] = process.argv.slice(2);
const raisons = [];
const prompts = [];
const answers = [];
const voulues = mode === "exces" ? 3 : 1;
let posees = 0;
let formPending = false;
let idleAt = 0;
let assistant = null;
let horloge = 0;
const tick = () => Date.now() + (++horloge);
const questionTexte = "Would you like to proceed with the implementation plan?";
const texteBloc = "Le point est dans un bloc :\n```text\nEst-ce une question ?\n```\nRien d'autre.";
const poserTexte = (texte) => {
  assistant = { id: "msg_a" + tick(), type: "assistant", time: { created: tick() }, content: [{ type: "text", text: texte }] };
  idleAt = tick();
};

const formulaire = (n) => ({
  id: "frm_" + n,
  sessionID: "ses_banc",
  title: "Questions",
  metadata: { kind: "question" },
  fields: [{
    key: "q0",
    title: "Destination",
    type: "string",
    options: [
      { value: "aidd_docs/tasks (Recommended)", label: "aidd_docs/tasks (Recommended)" },
      { value: "docs/plan.md", label: "docs/plan.md" },
    ],
    custom: true,
  }],
});

const serveur = http.createServer((req, res) => {
  let corps = "";
  req.on("data", (b) => { corps += b; });
  req.on("end", () => {
    const envoi = (code, objet) => {
      res.writeHead(code, { "content-type": "application/json" });
      res.end(objet === undefined ? "" : JSON.stringify(objet));
    };
    const url = req.url;
    if (req.method === "POST" && url === "/api/session") {
      return envoi(200, { data: { id: "ses_banc", model: { providerID: "banc", id: "faux" }, outcome: null } });
    }
    if (req.method === "POST" && url === "/api/session/ses_banc/prompt") {
      prompts.push(JSON.parse(corps).text);
      const n = prompts.length;
      const cree = tick();
      if (mode === "accepter" || mode === "exces") {
        if (n === 1) { posees = 1; formPending = true; }
        idleAt = 0;
      } else if (mode === "texte") {
        if (n === 1) poserTexte(questionTexte);
        else idleAt = tick();
      } else if (mode === "texte-formulaire") {
        if (n === 1) { posees = 1; formPending = true; }
        else if (n === 2) idleAt = 0;
        else idleAt = tick();
      } else if (mode === "texte-exces") {
        poserTexte("Question " + n + " ?");
      } else if (mode === "texte-bloc") {
        if (n === 1) poserTexte(texteBloc);
      } else if (mode === "texte-sans-question") {
        if (n === 1) poserTexte("Le brouillon complet :\n\n- Outcome : écrire le contrôle\n- Scope : le démarrage");
      } else if (mode === "texte-rappel") {
        if (n === 1) poserTexte("<system-reminder>\nContinuer ?\n</system-reminder>?");
      }
      return envoi(200, { data: { id: "msg_u" + n, type: "user", time: { created: cree } } });
    }
    if (req.method === "GET" && url === "/api/session/ses_banc/form") {
      return envoi(200, { data: formPending ? [formulaire(posees)] : [] });
    }
    if (req.method === "POST" && url.startsWith("/api/session/ses_banc/form/frm_")) {
      answers.push(JSON.parse(corps));
      if (mode === "texte-formulaire") {
        formPending = false;
        poserTexte(questionTexte);
      } else if (posees < voulues) {
        posees += 1;
        formPending = true;
        idleAt = 0;
      } else {
        formPending = false;
        idleAt = tick();
      }
      res.writeHead(204);
      return res.end();
    }
    if (req.method === "GET" && url === "/api/session/ses_banc/message") {
      const data = idleAt ? [
        ...(assistant ? [assistant] : []),
        { id: "msg_idle", type: "idle", time: { created: idleAt }, outcome: "succeeded" },
      ] : [];
      return envoi(200, { data });
    }
    envoi(404, { error: "route inconnue " + req.method + " " + url });
  });
});

await new Promise((ok) => serveur.listen(0, "127.0.0.1", ok));
const port = serveur.address().port;
const avant = readdirSync(run).sort().join(",");
const enfant = spawn(process.execPath, [orch, "ouvrir", "--cas", cas, "--cases", cases, "--run", run,
  "--api", "http://127.0.0.1:" + port, "--delai", "2"], { encoding: "utf8" });
let sortie = "";
enfant.stdout.on("data", (b) => { sortie += b; });
enfant.stderr.on("data", (b) => { sortie += b; });
const code = await new Promise((ok) => enfant.on("exit", ok));
serveur.close();

const attendu = JSON.parse(readFileSync(cases + "/" + cas + ".expected.json", "utf8"));
const figees = attendu.demande.reponses_figees;
const texte = readFileSync(run + "/texte-a-remettre.txt", "utf8");
if (mode === "accepter") {
  if (code !== 0) raisons.push("exit " + code + " au lieu de 0 : " + sortie.split("\n")[0]);
  if (prompts.length !== 2) raisons.push(prompts.length + " message(s) envoyé(s), 2 attendus");
  else {
    if (prompts[0] !== texte) raisons.push("le premier message n'est pas le texte de la porte, octet pour octet");
    if (prompts[1] !== figees[0]) raisons.push("le second message n'est pas la réponse figée du cas");
  }
  if (answers.length !== 1) raisons.push(answers.length + " réponse(s) au formulaire, 1 attendue");
  else if (answers[0].answer.q0 !== "aidd_docs/tasks (Recommended)") {
    raisons.push("le formulaire n'a pas reçu l'option Recommandé : " + JSON.stringify(answers[0]));
  }
  if (!sortie.includes("inactive")) raisons.push("le bloc ne dit pas la session inactive");
} else if (mode === "texte") {
  if (code !== 0) raisons.push("exit " + code + " au lieu de 0 : " + sortie.split("\n")[0]);
  if (prompts.length !== 2) raisons.push(prompts.length + " message(s) envoyé(s), 2 attendus");
  else {
    if (prompts[0] !== texte) raisons.push("le premier message n'est pas le texte de la porte, octet pour octet");
    if (prompts[1] !== figees[0]) raisons.push("le second message n'est pas la réponse figée du cas");
  }
  if (answers.length !== 0) raisons.push(answers.length + " réponse(s) au formulaire, 0 attendue");
  if (!sortie.includes("texte, question")) raisons.push("le bloc ne nomme pas la question jouée en texte");
  if (!sortie.includes("1 question(s)")) raisons.push("le bloc ne compte pas la question jouée");
} else if (mode === "texte-formulaire") {
  if (code !== 0) raisons.push("exit " + code + " au lieu de 0 : " + sortie.split("\n")[0]);
  if (prompts.length !== 3) raisons.push(prompts.length + " message(s) envoyé(s), 3 attendus");
  else {
    if (prompts[0] !== texte) raisons.push("le premier message n'est pas le texte de la porte");
    if (prompts[1] !== figees[0]) raisons.push("la réponse figée ne part pas avant le formulaire");
    if (prompts[2] !== figees[1]) raisons.push("la seconde réponse figée ne part pas après la question en texte");
  }
  if (answers.length !== 1) raisons.push(answers.length + " réponse(s) au formulaire, 1 attendue");
  if (!sortie.includes("2 question(s)")) raisons.push("le bloc ne compte pas les deux questions jouées");
} else if (mode === "texte-exces") {
  if (code !== 1) raisons.push("exit " + code + " au lieu de 1 : " + sortie.split("\n")[0]);
  if (!sortie.includes("n'en fige que 2")) raisons.push("le refus ne nomme pas les deux réponses figées : " + sortie.split("\n")[0]);
  if (prompts.length !== 3) raisons.push(prompts.length + " message(s) envoyé(s), 3 attendus");
  if (answers.length !== 0) raisons.push(answers.length + " réponse(s) au formulaire, 0 attendue");
} else if (mode === "texte-bloc") {
  // ADR-077 : la derniere ligne hors bloc ("Rien d'autre.") ne demande rien et une reponse reste a
  // jouer : `ouvrir` refuse au lieu de rendre un succes a zero question.
  if (code !== 1) raisons.push("exit " + code + " au lieu de 1 : " + sortie.split("\n")[0]);
  if (prompts.length !== 1) raisons.push(prompts.length + " message(s) envoyé(s), 1 attendu");
  if (answers.length !== 0) raisons.push(answers.length + " réponse(s) au formulaire, 0 attendue");
  if (!sortie.includes("sans question")) raisons.push("le refus ne dit pas la session arrêtée sans question");
  if (sortie.includes("texte, question")) raisons.push("un ? dans un bloc a été pris pour une question");
} else if (mode === "texte-sans-question") {
  if (code !== 1) raisons.push("exit " + code + " au lieu de 1 : " + sortie.split("\n")[0]);
  if (prompts.length !== 1) raisons.push(prompts.length + " message(s) envoyé(s), 1 attendu");
  if (answers.length !== 0) raisons.push(answers.length + " réponse(s) au formulaire, 0 attendue");
  if (!sortie.includes("sans question")) raisons.push("le refus ne dit pas la session arrêtée sans question");
  if (!sortie.includes("suite --fil ses_banc")) raisons.push("le refus ne dit pas comment reprendre : " + sortie.split("\n")[0]);
  if (!sortie.includes("Scope : le démarrage")) raisons.push("le refus ne cite pas la dernière ligne");
} else if (mode === "texte-rappel") {
  if (code !== 0) raisons.push("exit " + code + " au lieu de 0 : " + sortie.split("\n")[0]);
  if (prompts.length !== 1) raisons.push(prompts.length + " message(s) envoyé(s), 1 attendu");
  if (answers.length !== 0) raisons.push(answers.length + " réponse(s) au formulaire, 0 attendue");
  if (sortie.includes("texte, question")) raisons.push("un rappel système a été pris pour une question");
  if (!sortie.includes("0 question(s)")) raisons.push("le bloc ne dit pas qu'aucune question n'est jouée");
} else {
  if (code !== 1) raisons.push("exit " + code + " au lieu de 1 : " + sortie.split("\n")[0]);
  if (!sortie.includes("n'en fige que 2")) raisons.push("le refus ne nomme pas les deux réponses figées : " + sortie.split("\n")[0]);
  if (prompts.length !== 3) raisons.push(prompts.length + " message(s) envoyé(s), 3 attendus");
  if (answers.length !== 2) raisons.push(answers.length + " réponse(s) au formulaire, 2 attendues");
}
if (readdirSync(run).sort().join(",") !== avant) raisons.push("ouvrir a écrit dans le dossier du run");
if (raisons.length) { writeFileSync(detail, raisons.join("\n") + "\n"); process.exit(1); }
JS
controle "224 refus, ouvrir sans porte" 0 refus-nomme 1 "aucune porte" bash -c "node '$ORCH' ouvrir --cas cas-test --cases '$O/cases' --run '$O/runsansporte' </dev/null"
controle "225 refus, opencode introuvable" 0 refus-nomme 1 "introuvable dans le PATH" env PATH=/nonexistent "$(command -v node)" "$ORCH" ouvrir --cas cas-test --cases "$O/cases" --run "$O/run"
controle "226 ouvrir, texte, réponse figée et formulaire" 0 node "$O/faux-serveur.mjs" "$B/detail.226" accepter "$O/run" cas-test "$O/cases" "$ORCH"
controle "227 refus, plus de questions que de réponses figées" 0 node "$O/faux-serveur.mjs" "$B/detail.227" exces "$O/run" cas-test "$O/cases" "$ORCH"
controle "254 ouvrir, question en texte jouée" 0 node "$O/faux-serveur.mjs" "$B/detail.254" texte "$O/run" cas-test "$O/cases" "$ORCH"
controle "255 ouvrir, formulaire puis texte" 0 node "$O/faux-serveur.mjs" "$B/detail.255" texte-formulaire "$O/run" cas-test "$O/cases" "$ORCH"
controle "256 refus, texte sans réponse figée" 0 node "$O/faux-serveur.mjs" "$B/detail.256" texte-exces "$O/run" cas-test "$O/cases" "$ORCH"
controle "257 refus, ? dans un bloc et texte sans question" 0 node "$O/faux-serveur.mjs" "$B/detail.257" texte-bloc "$O/run" cas-test "$O/cases" "$ORCH"
controle "258 rappel système, jamais une question" 0 node "$O/faux-serveur.mjs" "$B/detail.258" texte-rappel "$O/run" cas-test "$O/cases" "$ORCH"
controle "266 refus, session arrêtée sur un texte sans question" 0 node "$O/faux-serveur.mjs" "$B/detail.266" texte-sans-question "$O/run" cas-test "$O/cases" "$ORCH"
cat > "$O/delai.mjs" <<'JS'
// ADR-077 : le refus de delai nomme le fil, sinon la reprise n'a pas d'identifiant. Le banc lit le
// texte du code plutot que d'attendre une minute : le controle 266 eprouve le comportement voisin.
import { readFileSync } from "node:fs";
const t = readFileSync(process.argv[2], "utf8");
const ok = t.includes("la session ${fil} n'est pas devenue inactive en ${minutes} min")
  && t.includes("le fil reste lisible par « suite --fil ${fil} »");
process.exit(ok ? 0 : 1);
JS
controle "267 le refus de délai nomme le fil (texte du code)" 0 node "$O/delai.mjs" "$ORCH"

# 263-265 : `tracer`, la trace du run guide (ADR-076). Le fil est un fil Freebuff de fixture ; le
# dossier porte un `-run-guide.md`, et rien d'autre ne doit etre ecrit que trace/echange.jsonl et
# trace/fil.json. Le HOME factice evite de lire la base reelle de la personne.
P263=$(date +%s%3N)
sqlite3 "$DBF" <<SQL
insert into threads values('fil-trace','$W/terrain','local','','','codebuff','m-banc',$P263);
insert into messages values('fil-trace',1,'user',$(($P263-2000)),'[{"kind":"text","text":"demande"}]');
insert into messages values('fil-trace',2,'assistant',$P263,'[{"kind":"text","text":"reponse"}]');
SQL
mkdir -p "$O/home-trace/.config/freebuff-desktop/projects/banc"
cp "$DBF" "$O/home-trace/.config/freebuff-desktop/projects/banc/desktop-v2.db"
mkdir -p "$O/guide" "$O/guide-fil" "$O/sans-guide" "$O/deux-guides"
printf '%s\n' '# Run guide' > "$O/guide/2026-10-23-000000-run-guide.md"
printf '%s\n' '# Run guide' > "$O/guide-fil/2026-10-23-000000-run-guide.md"
printf '%s\n' '# Run guide 1' > "$O/deux-guides/2026-10-23-000000-run-guide.md"
printf '%s\n' '# Run guide 2' > "$O/deux-guides/2026-10-23-000001-run-guide.md"
cat > "$O/tracer-banc.mjs" <<'JS'
// `tracer` sur une base de fixture : argv orchestrer, mode, dossier, HOME, store opencode.
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const [orch, mode, run, home, store] = process.argv.slice(2);
const raisons = [];
const env = { ...process.env, HOME: home };
const appel = (dossier, fil) => {
  try {
    const sortie = execFileSync(process.execPath,
      [orch, "tracer", "--run", dossier, "--fil", fil, "--client", "freebuff", "--store", store],
      { env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return { code: 0, sortie };
  } catch (e) {
    return { code: e.status, sortie: String(e.stdout || "") + String(e.stderr || "") };
  }
};

if (mode === "ok") {
  const r = appel(run, "fil-trace");
  if (r.code !== 0) raisons.push("exit " + r.code + " : " + r.sortie.split("\n")[0]);
  else {
    const p = join(run, "trace", "fil.json");
    if (!existsSync(p)) raisons.push("fil.json absent");
    else {
      const f = JSON.parse(readFileSync(p, "utf8"));
      const b = readFileSync(join(run, "trace", "echange.jsonl"));
      const lignes = b.toString("utf8").split("\n").filter(Boolean);
      if (f.messages !== 2 || f.trace?.lignes !== 2 || lignes.length !== 2) {
        raisons.push("messages/lignes " + f.messages + "/" + f.trace?.lignes + "/" + lignes.length);
      }
      if (f.trace?.sha256 !== createHash("sha256").update(b).digest("hex")) raisons.push("sha256 qui ne rend pas le fichier");
      if (f.identifiant !== "fil-trace") raisons.push("identifiant " + f.identifiant);
      if (f.modele !== "m-banc") raisons.push("modele " + f.modele);
      if (f.premier?.seq !== 1 || f.dernier?.seq !== 2) raisons.push("premier/dernier " + JSON.stringify([f.premier, f.dernier]));
      const pieces = readdirSync(join(run, "trace")).sort().join(",");
      if (pieces !== "echange.jsonl,fil.json") raisons.push("pieces de trace : " + pieces);
    }
  }
} else if (mode === "refus-fil") {
  const absent = appel(run, "fil-absent");
  if (absent.code !== 1) raisons.push("fil inconnu : exit " + absent.code);
  if (existsSync(join(run, "trace"))) raisons.push("une trace a ete ecrite pour un fil inconnu");
  mkdirSync(join(run, "trace"), { recursive: true });
  writeFileSync(join(run, "trace", "echange.jsonl"), "");
  const deja = appel(run, "fil-trace");
  if (deja.code !== 1) raisons.push("trace existante : exit " + deja.code);
  if (!/déjà/.test(deja.sortie)) raisons.push("le refus ne dit pas que la trace existe deja");
} else if (mode === "refus-dossier") {
  for (const d of ["sans-guide", "deux-guides"]) {
    const r = appel(join(run, d), "fil-trace");
    if (r.code !== 1) raisons.push(d + " : exit " + r.code);
    if (existsSync(join(run, d, "trace"))) raisons.push(d + " : une trace a ete ecrite");
  }
}
if (raisons.length) { writeFileSync(process.env.DETAIL, raisons.join("\n") + "\n"); process.exit(1); }
JS
controle "263 tracer, export du fil et fil.json" 0 node "$O/tracer-banc.mjs" "$ORCH" ok "$O/guide" "$O/home-trace" "$O/opencode-vide"
controle "264 tracer refuse un fil inconnu et une trace deja ecrite" 0 node "$O/tracer-banc.mjs" "$ORCH" refus-fil "$O/guide-fil" "$O/home-trace" "$O/opencode-vide"
controle "265 tracer refuse un dossier sans run-guide unique" 0 node "$O/tracer-banc.mjs" "$ORCH" refus-dossier "$O" "$O/home-trace" "$O/opencode-vide"

# 259-262 : les traces de texte et de commande (spec du 2026-10-22 22:12, ADR-075). Un reçu synthétique
# suffit : rien n'ouvre de session, et les contrôles portent sur les trois états d'une assertion de texte,
# sur la dernière ligne hors bloc, sur la commande lue dans la trace et sur le refus d'une assertion mal formée.
P="$B/traces"
mkdir -p "$P"
cp "$REPO/docs/device/CASES/$JOUET.expected.json" "$P/"
node - "$P" "$JOUET" <<'JS'
const fs = require("fs"), path = require("path");
const [P, JOUET] = process.argv.slice(2);
const recu = (d) => {
  fs.mkdirSync(path.join(d, "trace"), { recursive: true });
  const r = {
    cas: JOUET, verdict: "non concluant",
    session: { outil: "opencode", modele: "opencode/banc" },
    horodatage_debut: "2026-10-22T10:00:00+02:00", horodatage_fin: "2026-10-22T10:01:00+02:00",
    echanges: { utilises: 0, budget: 1 },
    produit: { chemins: [], fichiers: [] }, falsificateurs: {},
  };
  fs.writeFileSync(path.join(d, "receipt.json"), JSON.stringify(r, null, 2) + "\n");
  fs.writeFileSync(path.join(d, "output.json"), JSON.stringify({ verdict: "non concluant", difference: "" }, null, 2) + "\n");
};
const trace = (d, lignes) => {
  fs.mkdirSync(path.join(d, "trace"), { recursive: true });
  fs.writeFileSync(path.join(d, "trace", "echange.jsonl"), lignes.map((l) => JSON.stringify(l)).join("\n") + "\n");
};
const cases = (nom, gestes) => {
  const d = path.join(P, "cases" + nom);
  fs.mkdirSync(d, { recursive: true });
  fs.copyFileSync(path.join(P, JOUET + ".expected.json"), path.join(d, JOUET + ".expected.json"));
  fs.writeFileSync(path.join(d, JOUET + ".lecture.json"), JSON.stringify({ cas: JOUET, gestes }, null, 2) + "\n");
};

cases("259", [
  { geste: "le brouillon est annoncé", assertions: [{ type: "trace_texte", contient: "je propose de" }] },
  { geste: "le brouillon est complet", assertions: [{ type: "trace_texte", contient: "absent" }] },
  { geste: "le texte est dit tel quel", assertions: [{ type: "trace_texte", contient: "JE PROPOSE DE" }] },
  { geste: "la personne répond", assertions: [{ type: "trace_texte", role: "user", contient: "ok" }] },
]);
recu(path.join(P, "r259"));
trace(path.join(P, "r259"), [
  { seq: 12, role: "assistant", kind: "text", text: "je propose de créer le plan.", ts: 1 },
  { seq: 13, role: "assistant", kind: "text", text: "Rien ici.", ts: 2 },
  { seq: 14, role: "user", kind: "text", text: "ok", ts: 3 },
]);
cases("259b", [{ geste: "le brouillon est annoncé", assertions: [{ type: "trace_texte", contient: "je propose de" }] }]);
recu(path.join(P, "r259b"));
trace(path.join(P, "r259b"), [{ seq: 12, role: "assistant", kind: "tool", outil: "read", chemin_outil: "README.md", ts: 1 }]);

cases("260", [
  { geste: "la question est la dernière ligne", assertions: [{ type: "trace_texte", finit_par: "?", a_partir_du_tour: 20 }] },
  { geste: "un bloc ne porte pas la question", assertions: [{ type: "trace_texte", finit_par: "?", a_partir_du_tour: 21 }] },
  { geste: "un rappel système n'est pas une question", assertions: [{ type: "trace_texte", finit_par: "?", a_partir_du_tour: 22 }] },
]);
recu(path.join(P, "r260"));
trace(path.join(P, "r260"), [
  { seq: 20, role: "assistant", kind: "text", text: "Question ?\n```\ncode ?\n```", ts: 1 },
  { seq: 21, role: "assistant", kind: "text", text: "```\n? \n```", ts: 2 },
  { seq: 22, role: "assistant", kind: "text", text: "<system-reminder>rappel ?", ts: 3 },
]);

cases("261", [
  { geste: "la commande est dans la trace", assertions: [{ type: "trace_outil", outil: "shell", commande_contient: "rg README" }] },
  { geste: "le chemin et la commande sont dans la trace", assertions: [{ type: "trace_outil", outil: "shell", chemin_contient: "README", commande_contient: "rg README" }] },
  { geste: "une autre commande ne suffit pas", assertions: [{ type: "trace_outil", outil: "shell", commande_contient: "ls" }] },
]);
recu(path.join(P, "r261"));
trace(path.join(P, "r261"), [
  { seq: 30, role: "assistant", kind: "tool", outil: "shell", commande: "rg README", chemin_outil: "/x/README.md", ts: 1 },
]);
cases("261b", [{ geste: "la commande est dans la trace", assertions: [{ type: "trace_outil", outil: "shell", commande_contient: "rg README" }] }]);
recu(path.join(P, "r261b"));
trace(path.join(P, "r261b"), [
  { seq: 30, role: "assistant", kind: "tool", outil: "shell", chemin_outil: "/x/README.md", ts: 1 },
]);
JS
controle "259 texte, trois états et casse" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const lire=(run,cases)=>{execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--cases','$P/cases'+cases,'--run','$P/'+run,'--remplacer'],{stdio:'ignore'});return fs.readFileSync('$P/'+run+'/RESULTAT.md','utf8')};
const t=lire('r259','259');
const b=lire('r259b','259b');
const tab=t.split('## 4.')[1].split('## 5.')[0];
const ligne=(nom)=>(tab.split('\n').find((l)=>l.startsWith('| '+nom+' |'))||'');
const r=[];
if(![1,2,3,4,5,6,7,8].every((i)=>t.includes('## '+i+'.')))r.push('section manquante');
if(!ligne('le brouillon est annoncé').includes('texte du tour 12'))r.push('le texte tenu ne nomme pas son tour');
if(!ligne('le brouillon est annoncé').includes('« je propose de »'))r.push('le texte tenu ne cite pas le fragment');
if(!ligne('le brouillon est annoncé').includes('| tenu |'))r.push('le texte trouvé ne porte pas tenu');
if(!ligne('le brouillon est complet').includes('aucun texte assistant ne contient « absent »'))r.push('le texte absent ne nomme pas le manque');
if(!ligne('le brouillon est complet').includes('| **violé** |'))r.push('le texte absent ne porte pas violé');
if(!ligne('le texte est dit tel quel').includes('| **violé** |'))r.push('la casse différente ne porte pas violé');
if(!ligne('la personne répond').includes('| tenu |'))r.push('le texte de la personne ne porte pas tenu');
const tab2=b.split('## 4.')[1].split('## 5.')[0];
if(!tab2.includes('aucun texte assistant examinable dans la trace'))r.push('la trace sans texte ne dit pas non observé');
if(!tab2.includes('| non observé |'))r.push('la trace sans texte ne porte pas non observé');
if(r.length){fs.writeFileSync('$B/detail.259',r.join('\n')+'\n');process.exit(1)}"
controle "260 texte, dernière ligne hors bloc" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--cases','$P/cases260','--run','$P/r260','--remplacer'],{stdio:'ignore'});
const t=fs.readFileSync('$P/r260/RESULTAT.md','utf8');
const tab=t.split('## 4.')[1].split('## 5.')[0];
const ligne=(nom)=>(tab.split('\n').find((l)=>l.startsWith('| '+nom+' |'))||'');
const r=[];
if(!ligne('la question est la dernière ligne').includes('finit par « ? »'))r.push('la question hors bloc n\'est pas nommée');
if(!ligne('la question est la dernière ligne').includes('| tenu |'))r.push('la question hors bloc ne porte pas tenu');
if(!ligne('un bloc ne porte pas la question').includes('| **violé** |'))r.push('le bloc ne porte pas violé');
if(!ligne('un rappel système n\'est pas une question').includes('| non observé |'))r.push('le rappel système ne porte pas non observé');
if(!ligne('un rappel système n\'est pas une question').includes('aucun texte assistant examinable'))r.push('le rappel système ne dit pas le manque');
if(r.length){fs.writeFileSync('$B/detail.260',r.join('\n')+'\n');process.exit(1)}"
controle "261 commande, trois états" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const lire=(run,cases)=>{execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--cases','$P/cases'+cases,'--run','$P/'+run,'--remplacer'],{stdio:'ignore'});return fs.readFileSync('$P/'+run+'/RESULTAT.md','utf8')};
const t=lire('r261','261');
const b=lire('r261b','261b');
const tab=t.split('## 4.')[1].split('## 5.')[0];
const ligne=(nom)=>(tab.split('\n').find((l)=>l.startsWith('| '+nom+' |'))||'');
const r=[];
if(!ligne('la commande est dans la trace').includes('commande du tour 30 : « rg README »'))r.push('la commande n\'est pas citée');
if(!ligne('la commande est dans la trace').includes('| tenu |'))r.push('la commande lue ne porte pas tenu');
if(!ligne('le chemin et la commande sont dans la trace').includes('| tenu |'))r.push('le chemin et la commande ne portent pas tenu');
if(!ligne('une autre commande ne suffit pas').includes('shell sans « ls »'))r.push('la commande absente n\'est pas nommée');
if(!ligne('une autre commande ne suffit pas').includes('| **violé** |'))r.push('la commande absente ne porte pas violé');
const tab2=b.split('## 4.')[1].split('## 5.')[0];
if(!tab2.includes('shell sans commande lisible'))r.push('la commande illisible ne dit pas le manque');
if(!tab2.includes('| non observé |'))r.push('la commande illisible ne porte pas non observé');
if(r.length){fs.writeFileSync('$B/detail.261',r.join('\n')+'\n');process.exit(1)}"
controle "262 refus, assertion de texte mal formée" 0 node -e "
const {verifierLecture,TYPES_ASSERTION}=require('$H'.replace(/run\.mjs$/,'resultat.mjs'));
const base=(a)=>({gestes:[{geste:'une mesure',assertions:[a]}]});
const r=[];
if(!TYPES_ASSERTION.includes('trace_texte'))r.push('trace_texte absent du vocabulaire');
const valides=[{type:'trace_texte',contient:'x'},{type:'trace_texte',finit_par:'?'},{type:'trace_texte',role:'user',contient:'x',a_partir_du_tour:2},{type:'trace_outil',outil:'shell',commande_contient:'rg'}];
for(const a of valides){try{verifierLecture(base(a))}catch(e){r.push('valide refusé : '+e.message)}}
const invalides=[
  ['les deux critères',{type:'trace_texte',contient:'x',finit_par:'?'}],
  ['aucun critère',{type:'trace_texte'}],
  ['role hors domaine',{type:'trace_texte',contient:'x',role:'system'}],
  ['tour zéro',{type:'trace_texte',contient:'x',a_partir_du_tour:0}],
  ['tour fractionnaire',{type:'trace_texte',contient:'x',a_partir_du_tour:1.5}],
  ['critère vide',{type:'trace_texte',contient:''}],
  ['commande vide',{type:'trace_outil',outil:'shell',commande_contient:''}],
];
for(const [nom,a] of invalides){let refuse=false;try{verifierLecture(base(a))}catch(e){refuse=true}if(!refuse)r.push('accepté : '+nom)}
if(r.length){fs.writeFileSync('$B/detail.262',r.join('\n')+'\n');process.exit(1)}"

# 228-230 : la page utilisateur (ADR-061). Un reçu synthétique suffit : rien n'ouvre de session, et les
# contrôles portent sur le contrat de forme, sur les trois états d'un geste et sur le déterminisme.
U="$B/utilisateur"
mkdir -p "$U/r228/trace" "$U/r229"
node -e "
const fs=require('fs');
const cas='$JOUET';
const base={cas,verdict:'ecart',session:{outil:'opencode',modele:'opencode/banc-modele'},horodatage_debut:'2026-10-22T10:00:00+02:00',horodatage_fin:'2026-10-22T10:05:00+02:00',echanges:{utilises:2,budget:2},produit:{chemins:['raw/'+cas+'/NOTES.md'],fichiers:[{chemin:'NOTES.md'}]},falsificateurs:{tableau_absent:false,ecriture_avant_tableau:[],question_sans_reponse:[],reseau:[],lecture_hors_dossier:[],shell_hors_dossier:[],hors_produit:[]}};
const ecrire=(d,r)=>{fs.mkdirSync(d,{recursive:true});fs.writeFileSync(d+'/receipt.json',JSON.stringify(r,null,2)+'\n');fs.writeFileSync(d+'/output.json',JSON.stringify({verdict:r.verdict,difference:'le banc a lu une difference hors mesure'},null,2)+'\n')};
ecrire('$U/r228',base);
const sansQuestion=JSON.parse(JSON.stringify(base));
delete sansQuestion.falsificateurs.question_sans_reponse;
sansQuestion.falsificateurs.reseau=[{seq:5,quoi:'un appel'}];
ecrire('$U/r229',sansQuestion);
fs.writeFileSync('$U/r228/trace/echange.jsonl',JSON.stringify({seq:2,kind:'tool',outil:'read',chemin_outil:'/x/PLAYBOOK.md',ts:1})+'\n'+JSON.stringify({seq:3,kind:'tool',outil:'question',chemin_outil:null,ts:2})+'\n');
"
controle "228 rapport, page utilisateur écrite" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run','$U/r228','--remplacer'],{stdio:'ignore'});
const t=fs.readFileSync('$U/r228/RESULTAT.md','utf8');
const corps=t.split('\n').filter((l)=>!/^(name|description|type|status):/.test(l)).join('\n').replace(/\]\([^)]*\)/g,']()');
const interdit=corps.match(/\b(morsures?|mord(?:ent)?|falsificateurs?|porcelain|plafonn(?:é|ée|és|ées)|seq)\b|\braw\//i);
const sections=[1,2,3,4,5,6,7,8].every((i)=>t.includes('## '+i+'.'));
const gestes=(fs.readFileSync('$REPO/docs/device/CASES/$JOUET.lecture.json','utf8').match(/\"geste\"/g)||[]).length;
const tableau=t.split('## 4.')[1].split('## 5.')[0];
const lignes=(tableau.match(/^\| (?!Attendu|---)/gm)||[]).length;
process.exit(sections && !interdit && lignes===gestes ?0:1)"
controle "229 page utilisateur, trois états d'un geste" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run','$U/r229','--remplacer'],{stdio:'ignore'});
const t=fs.readFileSync('$U/r229/RESULTAT.md','utf8');
process.exit(t.includes('**violé**') && t.includes('non observé') && t.includes('Quelque chose est sorti du cadre') && !t.includes('La procédure attendue est tenue') && !/\| attendre l'accord de l'opérateur \|[^\n]*\| tenu \|/.test(t) ?0:1)"
controle "230 page utilisateur, déterminisme et refus d'écrasement" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs'),crypto=require('crypto');
const sha=(p)=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run','$U/r228','--remplacer'],{stdio:'ignore'});
const a=sha('$U/r228/RESULTAT.md');
execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run','$U/r228','--remplacer'],{stdio:'ignore'});
const b=sha('$U/r228/RESULTAT.md');
fs.unlinkSync('$U/r228/RAPPORT.md');
let refuse=false,texte='';
try{execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run','$U/r228'],{stdio:'pipe'})}catch(e){refuse=true;texte=String(e.stderr)}
process.exit(a===b && refuse && texte.includes('RESULTAT.md') ?0:1)"

# 231-233 : les lectures des deux autres cas (spec du 2026-10-22 08:17). 231 et 232 partent de runs
# réels du dépôt, en copie ; 233 tient le vocabulaire fermé de toutes les lectures déclarées.
rapport-copie "$REPO/docs/device/runs/2026-10-21-081957-0d9a2180-12f1a20" "$RB/r231"
controle "231 page utilisateur, cas promesse, trois états" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const cas='2026-10-15-133423-promesse-memoire-avant-ecriture', run='$RB/r231';
execFileSync('node',['$ORCH','rapport','--cas',cas,'--run',run,'--remplacer'],{stdio:'ignore'});
const t=fs.readFileSync(run+'/RESULTAT.md','utf8');
const gestes=(JSON.parse(fs.readFileSync('$REPO/docs/device/CASES/'+cas+'.lecture.json','utf8')).gestes||[]).length;
const tableau=t.split('## 4.')[1].split('## 5.')[0];
const lignes=(tableau.match(/^\| (?!Attendu|---)/gm)||[]).length;
const cadre=/^\| rester dans le dossier du cas, sans réseau \|.*\| \*\*violé\*\* \|$/m.test(tableau);
const attente=/^\| attendre la réponse de l'opérateur \|.*\| non observé \|$/m.test(tableau);
const raisons=[];
if(![1,2,3,4,5,6,7,8].every((i)=>t.includes('## '+i+'.')))raisons.push('section manquante');
if(lignes!==gestes)raisons.push(lignes+' ligne(s) pour '+gestes+' geste(s)');
if(t.split('\n').length>80)raisons.push(t.split('\n').length+' ligne(s), plafond 80');
if(!cadre)raisons.push('le geste de cadre ne porte pas violé');
if(!attente)raisons.push('la question non mesurée ne porte pas non observé');
if(raisons.length){fs.writeFileSync('$B/detail.231',raisons.join('\n')+'\n');process.exit(1)}"
rapport-copie "$REPO/docs/device/runs/2026-10-21-234646-bee028f8-d88d78c" "$RB/r232"
controle "232 page utilisateur, cas plan-simple, cinq gestes tenus" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const cas='2026-10-21-173843-plan-simple', run='$RB/r232';
execFileSync('node',['$ORCH','rapport','--cas',cas,'--run',run,'--remplacer'],{stdio:'ignore'});
const t=fs.readFileSync(run+'/RESULTAT.md','utf8');
const gestes=(JSON.parse(fs.readFileSync('$REPO/docs/device/CASES/'+cas+'.lecture.json','utf8')).gestes||[]).length;
const tableau=t.split('## 4.')[1].split('## 5.')[0];
const lignes=(tableau.match(/^\| (?!Attendu|---)/gm)||[]).length;
const tenus=(tableau.match(/\| tenu \|$/gm)||[]).length;
const raisons=[];
if(![1,2,3,4,5,6,7,8].every((i)=>t.includes('## '+i+'.')))raisons.push('section manquante');
if(lignes!==gestes)raisons.push(lignes+' ligne(s) pour '+gestes+' geste(s)');
if(tenus!==gestes)raisons.push(tenus+' geste(s) tenu(s) sur '+gestes);
if(/\*\*violé\*\*|non observé/.test(tableau))raisons.push('un geste du run conforme n\'est pas tenu');
if(raisons.length){fs.writeFileSync('$B/detail.232',raisons.join('\n')+'\n');process.exit(1)}"
controle "233 lectures, vocabulaire fermé et attendu présent" 0 node -e "
const fs=require('fs');
const dossier='$REPO/docs/device/CASES';
const types=new Set(['trace_outil','trace_texte','falsificateur_vide','produit','pause']);
const fichiers=fs.readdirSync(dossier).filter((f)=>f.endsWith('.lecture.json'));
const raisons=[];
if(!fichiers.length)raisons.push('aucune lecture déclarée');
for(const f of fichiers){
  const l=JSON.parse(fs.readFileSync(dossier+'/'+f,'utf8'));
  const cas=f.replace(/\.lecture\.json$/,'');
  if(l.cas!==cas)raisons.push(f+' nomme '+l.cas);
  if(!fs.existsSync(dossier+'/'+cas+'.expected.json'))raisons.push(f+' sans attendu');
  if(!Array.isArray(l.gestes)||!l.gestes.length){raisons.push(f+' sans geste');continue;}
  for(const g of l.gestes){
    const as=Array.isArray(g.assertions)?g.assertions:[];
    if(!as.length)raisons.push(f+' : geste sans assertion — '+(g.geste||'?'));
    for(const a of as)if(!types.has(a.type))raisons.push(f+' : type inconnu — '+a.type);
  }
}
if(raisons.length){fs.writeFileSync('$B/detail.233',raisons.join('\n')+'\n');process.exit(1)}"

# 234 : toute règle que les reçus portent doit avoir une phrase et un conseil. La fixture les déclare
# toutes non tenues, et le compte des conseils vient de son fichier de clés, pas d'une constante du banc.
V="$B/violations"
mkdir -p "$V"
node -e "
const fs=require('fs');
const cles=['birth_anterieur_au_gel','arbre_de_travail_inchange','produit_identique_a_une_empreinte_anterieure','trace_sans_echange_dans_la_fenetre','tableau_absent','ecriture_avant_tableau','produit_ne_avant_le_tableau','question_sans_reponse','pause_non_tenue','lecture_hors_dossier','shell_invalide','shell_hors_dossier','shell_ecriture_hors_produit','shell_non_interpretable','reseau','hors_produit'];
fs.writeFileSync('$V/cles.json',JSON.stringify(cles)+'\n');
const f={}; for(const k of cles) f[k]=[{seq:1,motif:'banc'}];
const r={cas:'$JOUET',verdict:'non concluant',session:{outil:'opencode',modele:'opencode/banc-modele'},horodatage_debut:'2026-10-22T10:00:00+02:00',horodatage_fin:'2026-10-22T10:01:00+02:00',echanges:{utilises:1,budget:1},produit:{chemins:[],fichiers:[]},falsificateurs:f};
fs.writeFileSync('$V/receipt.json',JSON.stringify(r,null,2)+'\n');
"
controle "234 page utilisateur, une phrase et un conseil par règle" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const run='$V', cles=JSON.parse(fs.readFileSync(run+'/cles.json','utf8'));
execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--run',run,'--remplacer'],{stdio:'ignore'});
const t=fs.readFileSync(run+'/RESULTAT.md','utf8');
const regles=(t.match(/^Règles non tenues : (.*)$/m)||[])[1]||'';
const conseils=t.split('**À corriger.**')[1].split('##')[0].split('\n').filter((l)=>l.startsWith('- ')).length;
const raisons=[];
if(!regles)raisons.push('aucune ligne de règles non tenues');
if(regles.includes('_'))raisons.push('une règle reste sous son identifiant : '+regles.slice(0,180));
if(conseils<cles.length+1)raisons.push(conseils+' conseil(s) pour '+cles.length+' règles');
if(raisons.length){fs.writeFileSync('$B/detail.234',raisons.join('\n')+'\n');process.exit(1)}"

# 235-236 : la lecture est vérifiée avant d'être servie (spec du 2026-10-22 08:46). Deux copies du run
# jouet du 2026-10-22 et deux dossiers `--cases` de banc : un geste sans assertion, un type inconnu.
L="$B/lectures"
mkdir -p "$L/cases235" "$L/cases236"
cp "$REPO/docs/device/CASES/$JOUET.expected.json" "$L/cases235/"
cp "$REPO/docs/device/CASES/$JOUET.expected.json" "$L/cases236/"
rapport-copie "$REPO/docs/device/runs/2026-10-22-070952-27fb38ab-3f0cf9d" "$L/r235"
rapport-copie "$REPO/docs/device/runs/2026-10-22-070952-27fb38ab-3f0cf9d" "$L/r236"
node -e "
const fs=require('fs');
const base=JSON.parse(fs.readFileSync('$REPO/docs/device/CASES/$JOUET.lecture.json','utf8'));
const sans=JSON.parse(JSON.stringify(base)); delete sans.gestes[0].assertions;
fs.writeFileSync('$L/cases235/$JOUET.lecture.json',JSON.stringify(sans,null,2)+'\n');
const type=JSON.parse(JSON.stringify(base)); type.gestes[1].assertions[0].type='trace_plate';
fs.writeFileSync('$L/cases236/$JOUET.lecture.json',JSON.stringify(type,null,2)+'\n');
"
controle "235 refus, lecture sans assertion" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
let e=null;
try{execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--cases','$L/cases235','--run','$L/r235'],{stdio:'pipe'})}catch(x){e=x}
const r=[];
if(!e||e.status!==1)r.push('sortie '+(e?e.status:'aucune')+' au lieu de 1');
else if(!String(e.stderr).includes('ne déclare aucune assertion'))r.push('le refus ne nomme pas le geste : '+String(e.stderr).split('\n')[0]);
if(fs.existsSync('$L/r235/RAPPORT.md'))r.push('un RAPPORT.md a été écrit');
if(fs.existsSync('$L/r235/RESULTAT.md'))r.push('un RESULTAT.md a été écrit');
if(r.length){fs.writeFileSync('$B/detail.235',r.join('\n')+'\n');process.exit(1)}"
controle "236 refus, type d assertion inconnu" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
let e=null;
try{execFileSync('node',['$ORCH','rapport','--cas','$JOUET','--cases','$L/cases236','--run','$L/r236'],{stdio:'pipe'})}catch(x){e=x}
const r=[];
const sortie=String(e&&e.stderr);
if(!e||e.status!==1)r.push('sortie '+(e?e.status:'aucune')+' au lieu de 1');
else if(!sortie.includes('trace_plate')||!sortie.includes('hors de trace_outil'))r.push('le refus ne nomme pas le type et son vocabulaire : '+sortie.split('\n')[0]);
if(fs.existsSync('$L/r236/RAPPORT.md'))r.push('un RAPPORT.md a été écrit');
if(fs.existsSync('$L/r236/RESULTAT.md'))r.push('un RESULTAT.md a été écrit');
if(r.length){fs.writeFileSync('$B/detail.236',r.join('\n')+'\n');process.exit(1)}"

# 237-238 : le produit sous un dossier neuf (ADR-062). Deux bacs jouets neufs, un cas recopié dont la
# racine du produit descend d'un cran (`terrain/aidd_docs/backlog`), re-gelé deux fois : 237 sur un arbre
# propre, 238 sur un arbre qui porte déjà `aidd_docs/` non suivi, donc le gel et la porte le replient.
# La porte ne s'écrit que sur un arbre identique au gel (H5) : le dossier non suivi doit précéder le gel.
JR="$B/produit"
mkdir -p "$JR/cases237" "$JR/cases238"
cp "$REPO/docs/device/CASES/$JOUET.request.md" "$JR/cases237/"
cp "$REPO/docs/device/CASES/$JOUET.request.md" "$JR/cases238/"
node -e "
const fs=require('fs');
for(const d of ['cases237','cases238']){
  const a=JSON.parse(fs.readFileSync('$REPO/docs/device/CASES/$JOUET.expected.json','utf8'));
  a.attendu_details.produit.racine='terrain/aidd_docs/backlog/';
  a.attendu_details.produit.regle='un seul fichier, aidd_docs/backlog/spikes/x.md';
  fs.writeFileSync('$JR/'+d+'/$JOUET.expected.json',JSON.stringify(a,null,2)+'\n');
}"
produit-bac() { # nom [geste-avant-le-gel] — un bac jouet neuf, son gel, et son fil dans la base du banc
  local nom="$1" bac="$JR/bac$1" racine="$JR/bac$1/$JOUET"
  bash "$JS" "$bac" >/dev/null || { echo "ARRET — le bac $nom ne s'écrit pas"; exit 2; }
  eval "${2:-true}" || { echo "ARRET — le geste d'avant le gel de $nom échoue"; exit 2; }
  node "$H" freeze --case "$JOUET" --cases "$JR/cases$nom" --racine "$bac" \
    --arbre framework-origin="$racine/origine/framework" --arbre terrain="$racine/origine/terrain" >/dev/null \
    || { echo "ARRET — le gel de $nom ne s'écrit pas"; exit 2; }
  node "$H" preflight --run "$JR/r$nom" --case "$JOUET" --cases "$JR/cases$nom" --repertoire "$racine/terrain" >/dev/null \
    || { echo "ARRET — la porte de $nom ne s'écrit pas"; exit 2; }
  local t=$(($(date +%s)-60))
  sqlite3 "$DBF" <<SQL
insert into threads values('banc-produit-$nom','$racine/terrain','local','','','codebuff','aucun',$((t*1000)));
insert into messages values('banc-produit-$nom',1,'user',$((t*1000)),json_array(json_object('kind','text','text','banc, la demande')));
insert into messages values('banc-produit-$nom',2,'assistant',$((t*1000+10000)),json_array(json_object('kind','text','text','banc, le tableau :'||char(10)||char(10)||'| fichier | objet |'||char(10)||'| --- | --- |'||char(10)||'| PLAYBOOK.md | trois regles |')));
insert into messages values('banc-produit-$nom',3,'assistant',$((t*1000+20000)),json_array(json_object('kind','tool','toolName','write_file','input',json_object('path','$racine/terrain/aidd_docs/backlog/spikes/x.md'),'status','success')));
SQL
}
produit-bac 237
mkdir -p "$JR/bac237/$JOUET/terrain/aidd_docs/backlog/spikes"
printf '# spike de banc\n' > "$JR/bac237/$JOUET/terrain/aidd_docs/backlog/spikes/x.md"
node "$H" collect --run "$JR/r237" --case "$JOUET" --cases "$JR/cases237" --from "$JR/bac237/$JOUET/terrain/aidd_docs/backlog" >/dev/null 2>&1 \
  || { echo "ARRET — le produit de 237 ne se collecte pas"; exit 2; }
mkdir -p "$JR/r237/trace"; : > "$JR/r237/trace/echange.jsonl"
node "$H" faits --case "$JOUET" --cases "$JR/cases237" --base "$DBF" --fil banc-produit-237 \
  --trace "$JR/r237/trace/echange.jsonl" --out "$JR/r237/faits.json" --par banc --fin "$(date -Is)" \
  --conduite humain >/dev/null || { echo "ARRET — les faits de 237 ne s'écrivent pas"; exit 2; }
bash -c "$(node -e "process.stdout.write(require('$JR/r237/faits.json').trace.commande)")" || { echo "ARRET — l'export de 237 ne s'écrit pas"; exit 2; }
controle "237 reçu, produit sous un dossier neuf" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const r=[];
try{execFileSync('node',['$H','receipt','--run','$JR/r237','--case','$JOUET','--cases','$JR/cases237','--faits','$JR/r237/faits.json','--verdict','conforme'],{encoding:'utf8',stdio:['ignore','pipe','pipe']})}catch(e){r.push('conforme refusé : '+String(e.stderr||'').split('\n')[0])}
if(!r.length){
  const x=JSON.parse(fs.readFileSync('$JR/r237/receipt.json','utf8'));
  if((x.falsificateurs.hors_produit||[]).length) r.push('hors_produit : '+JSON.stringify(x.falsificateurs.hors_produit));
  if((x.falsificateurs.ecriture_hors_dossier||[]).length) r.push('ecriture_hors_dossier : '+JSON.stringify(x.falsificateurs.ecriture_hors_dossier));
  if(x.verdict!=='conforme') r.push('verdict '+x.verdict);
}
if(r.length){fs.writeFileSync(process.env.DETAIL,r.join('\n')+'\n');process.exit(1)}"

# 238 : `aidd_docs/autre.md` existe avant le gel, donc la porte porte `?? aidd_docs/` ; le produit naît sous
# ce dossier, un fichier y naît aussi hors du produit, et un dossier neuf naît ailleurs. Le reçu saute le
# fichier du dossier déjà non suivi, nomme `terrain/docs/y.md` (fichier par fichier, pas `terrain/docs`),
# et ne nomme jamais l'ancêtre du produit.
produit-bac 238 'mkdir -p "$JR/bac238/$JOUET/terrain/aidd_docs" && printf "deja non suivi avant le gel\\n" > "$JR/bac238/$JOUET/terrain/aidd_docs/autre.md"'
mkdir -p "$JR/bac238/$JOUET/terrain/aidd_docs/backlog" "$JR/bac238/$JOUET/terrain/docs"
printf '# produit de banc\n' > "$JR/bac238/$JOUET/terrain/aidd_docs/backlog/y.md"
printf 'hors du produit, sous le dossier deja connu\n' > "$JR/bac238/$JOUET/terrain/aidd_docs/autre2.md"
printf 'hors du produit, dossier neuf\n' > "$JR/bac238/$JOUET/terrain/docs/y.md"
node "$H" collect --run "$JR/r238" --case "$JOUET" --cases "$JR/cases238" --from "$JR/bac238/$JOUET/terrain/aidd_docs/backlog" >/dev/null 2>&1 \
  || { echo "ARRET — le produit de 238 ne se collecte pas"; exit 2; }
mkdir -p "$JR/r238/trace"; : > "$JR/r238/trace/echange.jsonl"
node "$H" faits --case "$JOUET" --cases "$JR/cases238" --base "$DBF" --fil banc-produit-238 \
  --trace "$JR/r238/trace/echange.jsonl" --out "$JR/r238/faits.json" --par banc --fin "$(date -Is)" \
  --conduite humain >/dev/null || { echo "ARRET — les faits de 238 ne s'écrivent pas"; exit 2; }
bash -c "$(node -e "process.stdout.write(require('$JR/r238/faits.json').trace.commande)")" || { echo "ARRET — l'export de 238 ne s'écrit pas"; exit 2; }
controle "238 reçu, dossier connu sauté, dossier neuf nommé" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const r=[];
try{execFileSync('node',['$H','receipt','--run','$JR/r238','--case','$JOUET','--cases','$JR/cases238','--faits','$JR/r238/faits.json','--verdict','ecart'],{encoding:'utf8',stdio:['ignore','pipe','pipe']})}catch(e){r.push('ecart refusé : '+String(e.stderr||'').split('\n')[0])}
if(!r.length){
  const x=JSON.parse(fs.readFileSync('$JR/r238/receipt.json','utf8'));
  const h=(x.falsificateurs.hors_produit||[]).map((e)=>e.chemin).sort();
  if(JSON.stringify(h)!==JSON.stringify(['terrain/docs/y.md'])) r.push('hors_produit : '+JSON.stringify(h));
  if(h.includes('terrain/aidd_docs')) r.push('l ancêtre du produit est nommé');
  if(h.includes('terrain/aidd_docs/autre2.md')) r.push('un fichier du dossier déjà non suivi est nommé');
}
if(r.length){fs.writeFileSync(process.env.DETAIL,r.join('\n')+'\n');process.exit(1)}"

# 239-241 : les écritures d'outil et la racine du cas (ADR-063, ADR-064, ADR-066). Trois fils de la base du
# banc, exportés par la pièce : un outil d'écriture hors du cadre, un dans le cadre et un sans chemin, puis
# trois lectures — la racine du cas, son parent, et un fichier que la session a elle-même écrit.
EO="$B/outils"
mkdir -p "$EO"
sqlite3 "$DBF" <<SQL
insert into threads values('banc-ecrit-outil','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-ecrit-outil',1,'user',$D0,json_array(json_object('kind','text','text','banc, la demande')));
insert into messages values('banc-ecrit-outil',2,'assistant',$(($D0+10000)),json_array(json_object('kind','text','text','banc, le tableau :'||char(10)||char(10)||'| fichier | objet |'||char(10)||'| --- | --- |'||char(10)||'| README.md | le terrain |')));
insert into messages values('banc-ecrit-outil',3,'assistant',$(($D0+20000)),json_array(json_object('kind','tool','toolName','write_file','input',json_object('path','$EO/ailleurs.txt'),'status','success')));
insert into threads values('banc-lectures','$W/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-lectures',1,'user',$D0,json_array(json_object('kind','text','text','banc, la demande')));
insert into messages values('banc-lectures',2,'assistant',$(($D0+10000)),json_array(json_object('kind','text','text','banc, le tableau :'||char(10)||char(10)||'| fichier | objet |'||char(10)||'| --- | --- |'||char(10)||'| README.md | le terrain |')));
insert into messages values('banc-lectures',3,'assistant',$(($D0+20000)),json_array(json_object('kind','tool','toolName','read','input',json_object('path','$W'),'status','success'),json_object('kind','tool','toolName','read','input',json_object('path','$RACINE'),'status','success'),json_object('kind','tool','toolName','write_file','input',json_object('path','$EO/ecrit-lu.txt'),'status','success'),json_object('kind','tool','toolName','read','input',json_object('path','$EO/ecrit-lu.txt'),'status','success')));
SQL
export-fil banc-ecrit-outil "$EO/t239.jsonl" "$EO/f239.json" || { echo "ARRET — l'export de 239 ne s'écrit pas"; exit 2; }
export-fil banc-lectures "$EO/t241.jsonl" "$EO/f241.json" || { echo "ARRET — l'export de 241 ne s'écrit pas"; exit 2; }
lecture-run r239
lecture-run r241
# 240 vit sur le jouet : son produit est né après le gel, et son arbre a bougé depuis la porte — le cas
# réel, re-gelé le 2026-10-21, ferait mordre la condition 1 sur un produit daté de la fixture.
sqlite3 "$DBF" <<SQL
insert into threads values('banc-ecrit-cadre-jouet','$JROOT/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-ecrit-cadre-jouet',1,'user',$D0,json_array(json_object('kind','text','text','banc, la demande')));
insert into messages values('banc-ecrit-cadre-jouet',2,'assistant',$(($D0+10000)),json_array(json_object('kind','text','text','banc, le tableau :'||char(10)||char(10)||'| fichier | objet |'||char(10)||'| --- | --- |'||char(10)||'| PLAYBOOK.md | trois regles |')));
insert into messages values('banc-ecrit-cadre-jouet',3,'assistant',$(($D0+20000)),json_array(json_object('kind','tool','toolName','write_file','input',json_object('path','$JROOT/terrain/aidd_docs/NOTES.md'),'status','success'),json_object('kind','tool','toolName','write_todos','input',json_object('todos',json_array()),'status','success')));
SQL
produit-jouet r240
export-jouet banc-ecrit-cadre-jouet "$JEU/trace/240.jsonl" "$JEU/r240/faits.json" || { echo "ARRET — l'export de 240 ne s'écrit pas"; exit 2; }
controle "239 reçu, écriture d'outil hors du cadre" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const r=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$B/r239','--case','$CAS','--faits','$EO/f239.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) r.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes(\"une écriture d'outil sort du cadre déclaré\")) r.push('le refus ne nomme pas l écriture : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) r.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const x=JSON.parse(fs.readFileSync('$B/r239/receipt.json','utf8'));
  const l=x.falsificateurs.ecriture_hors_dossier||[];
  if(l.length!==1) r.push('ecriture_hors_dossier : '+l.length+' entrée(s) : '+JSON.stringify(l));
  else {
    if(!String(l[0].chemin).endsWith('/ailleurs.txt')) r.push('chemin inattendu : '+l[0].chemin);
    if(!String(l[0].outil).includes('write')) r.push('outil inattendu : '+l[0].outil);
  }
  try{execFileSync('node',['$ORCH','rapport','--cas','$CAS','--run','$B/r239'],{stdio:'ignore'})}catch(e){r.push('rapport : '+String(e.message).slice(0,120))}
  const rp=fs.existsSync('$B/r239/RAPPORT.md')?fs.readFileSync('$B/r239/RAPPORT.md','utf8'):'';
  if(!rp.includes('ecriture_hors_dossier')) r.push('RAPPORT ne nomme pas la morsure d écriture');
  if(!rp.includes('écriture hors du dossier autorisé')) r.push('RAPPORT ne dérive pas la piste d écriture');
}
if(r.length){fs.writeFileSync(process.env.DETAIL,r.join('\n')+'\n');process.exit(1)}"
controle "240 reçu, écriture dans le cadre et outil sans chemin" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const r=[];
try{execFileSync('node',['$H','receipt','--run','$JEU/r240','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r240/faits.json','--verdict','conforme'],{encoding:'utf8',stdio:['ignore','pipe','pipe']})}catch(e){r.push('conforme refusé : '+String(e.stderr||'').split('\n')[0])}
if(!r.length){
  const x=JSON.parse(fs.readFileSync('$JEU/r240/receipt.json','utf8'));
  if((x.falsificateurs.ecriture_hors_dossier||[]).length) r.push('ecriture_hors_dossier mord : '+JSON.stringify(x.falsificateurs.ecriture_hors_dossier));
  if(!x.limites.some((l)=>String(l).includes('write_todos'))) r.push('la limite ne nomme pas write_todos');
  if(x.verdict!=='conforme') r.push('verdict '+x.verdict);
}
if(r.length){fs.writeFileSync(process.env.DETAIL,r.join('\n')+'\n');process.exit(1)}"
controle "241 reçu, racine du cas lue, parent mordu, relecture propre" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const r=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$B/r241','--case','$CAS','--faits','$EO/f241.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const ok=appel('non concluant');
if(ok.code!==0) r.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const x=JSON.parse(fs.readFileSync('$B/r241/receipt.json','utf8'));
  const lect=x.falsificateurs.lecture_hors_dossier||[];
  const ecr=x.falsificateurs.ecriture_hors_dossier||[];
  if(lect.length!==1) r.push('lecture_hors_dossier : '+JSON.stringify(lect));
  else if(lect[0].chemin!=='$RACINE') r.push('la lecture mordue n est pas le parent : '+lect[0].chemin);
  if(ecr.length!==1) r.push('ecriture_hors_dossier : '+JSON.stringify(ecr));
  else if(!String(ecr[0].chemin).endsWith('/ecrit-lu.txt')) r.push('écriture inattendue : '+ecr[0].chemin);
  if((x.cloisonnement.lecture.racine_du_cas||'')!=='$W') r.push('racine_du_cas : '+x.cloisonnement.lecture.racine_du_cas);
  if((lect[0]&&lect[0].chemin)==='$W') r.push('la racine du cas a mordu');
}
if(r.length){fs.writeFileSync(process.env.DETAIL,r.join('\n')+'\n');process.exit(1)}"

# ---------------------------------------------------------------------------------------------
# 244-248 : la phase 1 du protocole (ADR-067 a 069). Chaque controle part d'une copie fraiche du cas
# fabrique `cas-test` sous $B, re-gelee avec sa propre racine : aucune ecriture dans les quatre arbres.
p1-cas() { # nom — une copie du cas et de son espace, gelee sous $B/<nom>
  local r="$B/$1"
  rm -rf "$r"; mkdir -p "$r/cas-test" "$r/cases"
  cp -a "$O/cas-test/terrain" "$r/cas-test/terrain"
  cp -a "$O/cas-test/framework-origin" "$r/cas-test/framework-origin"
  cp "$O/cases/cas-test.request.md" "$r/cases/"
  cp "$O/cases/cas-test.expected.json" "$r/cases/"
  node "$H" freeze --case cas-test --cases "$r/cases" --racine "$r" \
    --arbre framework-origin="$r/cas-test/framework-origin" --arbre terrain="$r/cas-test/terrain" >/dev/null 2>&1
}
p1-fil() { # fil, terrain, mode, chemin-ecrit
  sqlite3 "$DBF" "insert into threads values('$1','$2','local','','','codebuff','aucun',$D0);"
  sqlite3 "$DBF" "insert into messages values('$1',1,'user',$D0,'[{\"kind\":\"text\",\"text\":\"banc\"}]');"
  if [ "$3" = "pause" ]; then
    sqlite3 "$DBF" "insert into messages values('$1',2,'assistant',$(($D0+10000)),'[{\"kind\":\"text\",\"text\":\"| a | b |\\n| --- | --- |\\n| x | y |\"}]');"
    sqlite3 "$DBF" "insert into messages values('$1',3,'user',$(($D0+15000)),'[]');"
    sqlite3 "$DBF" "insert into messages values('$1',4,'assistant',$(($D0+20000)),'[{\"kind\":\"tool\",\"toolName\":\"write_file\",\"input\":{\"path\":\"$4\"},\"status\":\"success\"}]');"
  else
    sqlite3 "$DBF" "insert into messages values('$1',2,'assistant',$(($D0+10000)),'[{\"kind\":\"tool\",\"toolName\":\"write_file\",\"input\":{\"path\":\"$4\"},\"status\":\"success\"}]');"
    sqlite3 "$DBF" "insert into messages values('$1',3,'user',$(($D0+15000)),'[]');"
  fi
}
p1-faits() { # racine, fil, produit — copie le produit, exporte, ecrit les faits
  node "$H" collect --run "$1/run" --case cas-test --cases "$1/cases" --from "$3" >/dev/null 2>&1 || return 1
  : > "$1/trace.jsonl"
  node "$H" faits --case cas-test --cases "$1/cases" --base "$DBF" --fil "$2" --trace "$1/trace.jsonl" --out "$1/faits.json" --par banc --fin "$ISO1" --conduite humain >/dev/null 2>&1 || return 1
  bash -c "$(node -e "process.stdout.write(require('$1/faits.json').trace.commande)")"
}

p1-cas p1-244
mkdir -p "$B/p1-244/cas-test/terrain/aidd_docs"
node "$H" preflight --run "$B/p1-244/run" --case cas-test --cases "$B/p1-244/cases" --repertoire "$B/p1-244/cas-test/terrain" >/dev/null 2>&1 || { echo "ARRET — la porte de 244"; exit 2; }
mkdir -p "$B/p1-244/cas-test/terrain/.scratch"
printf 'print(1)\n' > "$B/p1-244/cas-test/terrain/.scratch/x.py"
printf 'hors produit\n' > "$B/p1-244/cas-test/terrain/HORS.txt"
printf 'produit\n' > "$B/p1-244/cas-test/terrain/aidd_docs/P1.md"
sleep 1
node "$H" collect --run "$B/p1-244/run" --case cas-test --cases "$B/p1-244/cases" --annexe "$B/p1-244/cas-test/terrain/.scratch" >/dev/null 2>&1 || { echo "ARRET — annexe 244"; exit 2; }
sqlite3 "$DBF" <<SQL
insert into threads values('banc-p1','$B/p1-244/cas-test/terrain','local','','','codebuff','aucun',$D0);
insert into messages values('banc-p1',1,'user',$D0,'[{"kind":"text","text":"banc"}]');
insert into messages values('banc-p1',2,'assistant',$(($D0+10000)),'[{"kind":"text","text":"| a | b |\n| --- | --- |\n| x | y |"}]');
insert into messages values('banc-p1',3,'user',$(($D0+15000)),'[{"kind":"text","text":"accord"}]');
insert into messages values('banc-p1',4,'assistant',$(($D0+20000)),'[{"kind":"tool","toolName":"write_file","input":{"path":"$B/p1-244/cas-test/terrain/.scratch/x.py"},"status":"success"},{"kind":"tool","toolName":"read","input":{"path":"$B/p1-244/cas-test/terrain/.scratch/x.py"},"status":"success"},{"kind":"tool","toolName":"write_file","input":{"path":"$B/p1-244/cas-test/terrain/HORS.txt"},"status":"success"}]');
SQL
p1-faits "$B/p1-244" banc-p1 "$B/p1-244/cas-test/terrain/aidd_docs/P1.md" || { echo "ARRET — faits 244"; exit 2; }
controle "244 scratch ecrit et lu, annexe, HORS.txt mordu" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/p1-244/run','--case','cas-test','--cases','$B/p1-244/cases','--faits','$B/p1-244/faits.json','--verdict','non concluant'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/p1-244/run/receipt.json','utf8'));
const raisons=[];
if(r.cloisonnement.ecriture.scratch!=='terrain/.scratch') raisons.push('scratch absent du cadre');
if(r.pause.mesuree!==true||r.pause.seq_reponse!==3) raisons.push('pause : '+JSON.stringify(r.pause));
if(!r.annexe||r.annexe.fichiers.length!==1||r.annexe.fichiers[0].chemin!=='x.py') raisons.push('annexe : '+JSON.stringify(r.annexe&&r.annexe.fichiers));
const ecr=r.falsificateurs.ecriture_hors_dossier;
if(ecr.length!==1||!String(ecr[0].chemin).endsWith('/HORS.txt')) raisons.push('ecriture_hors_dossier : '+JSON.stringify(ecr));
const hp=r.falsificateurs.hors_produit;
if(!hp.some((f)=>f.chemin==='terrain/HORS.txt')) raisons.push('HORS.txt absent de hors_produit');
if(hp.some((f)=>String(f.chemin).includes('.scratch'))) raisons.push('le scratch est compte comme produit');
if(r.falsificateurs.pause_non_tenue.length) raisons.push('pause tenue mais mordue');
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

cp -a "$B/p1-244/run" "$B/run245"; rm -f "$B/run245/receipt.json"
printf 'touche\n' >> "$B/run245/annexe/cas-test/x.py"
controle "245 annexe retouchee, recu refuse" 0 refus-nomme 1 "ne rend plus l'empreinte" node "$H" receipt --sans-ecrire --run "$B/run245" --case cas-test --cases "$B/p1-244/cases" --faits "$B/p1-244/faits.json"

p1-cas p1-246
# le champ tableau est retire de l'attendu : le defaut (vrai) doit mordre sans que le cas le declare
node -e "const fs=require('fs');const p='$B/p1-246/cases/cas-test.expected.json';const a=JSON.parse(fs.readFileSync(p,'utf8'));delete a.attendu_details.tableau;fs.writeFileSync(p,JSON.stringify(a,null,2)+'\n')"
node "$H" freeze --case cas-test --cases "$B/p1-246/cases" --refreeze --racine "$B/p1-246" --arbre framework-origin="$B/p1-246/cas-test/framework-origin" --arbre terrain="$B/p1-246/cas-test/terrain" >/dev/null 2>&1 || { echo "ARRET — le re-gel de 246"; exit 2; }
mkdir -p "$B/p1-246/cas-test/terrain/aidd_docs"
node "$H" preflight --run "$B/p1-246/run" --case cas-test --cases "$B/p1-246/cases" --repertoire "$B/p1-246/cas-test/terrain" >/dev/null 2>&1 || { echo "ARRET — la porte de 246"; exit 2; }
printf 'produit\n' > "$B/p1-246/cas-test/terrain/aidd_docs/P2.md"
sleep 1
p1-fil banc-pause "$B/p1-246/cas-test/terrain" breach "$B/p1-246/cas-test/terrain/aidd_docs/P2.md"
p1-faits "$B/p1-246" banc-pause "$B/p1-246/cas-test/terrain/aidd_docs/P2.md" || { echo "ARRET — faits 246"; exit 2; }
controle "246 pause non tenue, tableau absent par defaut" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/p1-246/run','--case','cas-test','--cases','$B/p1-246/cases','--faits','$B/p1-246/faits.json','--verdict','non concluant'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/p1-246/run/receipt.json','utf8'));
const raisons=[];
if(r.pause.mesuree!==false) raisons.push('pause mesuree : '+JSON.stringify(r.pause));
if(r.falsificateurs.pause_non_tenue.length!==1) raisons.push('pause_non_tenue : '+JSON.stringify(r.falsificateurs.pause_non_tenue));
if(r.falsificateurs.tableau_absent!==true) raisons.push('tableau_absent devrait mordre par defaut : '+r.falsificateurs.tableau_absent);
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

p1-cas p1-247
node -e "const fs=require('fs');const p='$B/p1-247/cases/cas-test.expected.json';const a=JSON.parse(fs.readFileSync(p,'utf8'));a.attendu_details.tableau={requis:false};fs.writeFileSync(p,JSON.stringify(a,null,2)+'\n')"
node "$H" freeze --case cas-test --cases "$B/p1-247/cases" --refreeze --racine "$B/p1-247" --arbre framework-origin="$B/p1-247/cas-test/framework-origin" --arbre terrain="$B/p1-247/cas-test/terrain" >/dev/null 2>&1 || { echo "ARRET — le re-gel de 247"; exit 2; }
mkdir -p "$B/p1-247/cas-test/terrain/aidd_docs"
node "$H" preflight --run "$B/p1-247/run" --case cas-test --cases "$B/p1-247/cases" --repertoire "$B/p1-247/cas-test/terrain" >/dev/null 2>&1 || { echo "ARRET — la porte de 247"; exit 2; }
printf 'produit\n' > "$B/p1-247/cas-test/terrain/aidd_docs/P3.md"
sleep 1
p1-fil banc-pause247 "$B/p1-247/cas-test/terrain" breach "$B/p1-247/cas-test/terrain/aidd_docs/P3.md"
p1-faits "$B/p1-247" banc-pause247 "$B/p1-247/cas-test/terrain/aidd_docs/P3.md" || { echo "ARRET — faits 247"; exit 2; }
controle "247 tableau non demande, aucune morsure" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','receipt','--run','$B/p1-247/run','--case','cas-test','--cases','$B/p1-247/cases','--faits','$B/p1-247/faits.json','--verdict','non concluant'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$B/p1-247/run/receipt.json','utf8'));
const raisons=[];
if(r.tableau.requis!==false) raisons.push('tableau.requis : '+r.tableau.requis);
if(r.falsificateurs.tableau_absent!==false) raisons.push('tableau_absent : '+r.falsificateurs.tableau_absent);
if(!r.limites.some((l)=>String(l).includes('ne demande pas de tableau'))) raisons.push('limite du tableau absente');
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

mkdir -p "$B/gabarit"
node "$ORCH" cas --skill "$OSKILL" --terrain "$OTERRAIN" --id cas-gabarit --racine "$O" --cases "$B/gabarit" --budget 3 </dev/null >/dev/null 2>&1 || { echo "ARRET — le gabarit de 248"; exit 2; }
controle "248 gabarit, tableau, scratch et autosuffisance" 0 node -e "
const fs=require('fs');
const d='$B/gabarit';const id='cas-gabarit';
const req=fs.readFileSync(d+'/'+id+'.request.md','utf8');
const exp=JSON.parse(fs.readFileSync(d+'/'+id+'.expected.json','utf8'));
const raisons=[];
if(!/Montre d'abord un tableau/.test(req)) raisons.push('phrase du tableau absente');
if(!req.includes('terrain/.scratch')) raisons.push('scratch absent de la demande');
if(!req.includes('Le produit doit se suffire')) raisons.push('autosuffisance absente');
if(exp.cloisonnement.ecriture.scratch!=='terrain/.scratch') raisons.push('scratch absent du squelette');
if(!exp.attendu_details.tableau||exp.attendu_details.tableau.requis!==true) raisons.push('tableau absent du squelette');
if(!exp.attendu_details.pause||exp.attendu_details.pause.requis!==true) raisons.push('pause absente du squelette');
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

# 249 et 250 : la phase 2 du protocole (ADR-070). 249 : une commande que le shell refuserait tombe dans
# `shell_invalide`, et `shell_non_interpretable` reste vide. 250 : une commande valide que le lecteur ne
# suit pas garde son plafond et porte une limite par entree, qui nomme le seq et le motif.
produit-jouet r249
export-jouet banc-shell-guillemet-ouvert "$JEU/trace/249.jsonl" "$JEU/r249/faits.json" || { echo "ARRET — l'export de 249 ne s'écrit pas"; exit 2; }
controle "249 recu, commande mal formee classee invalide" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(v)=>{try{execFileSync('node',['$H','receipt','--run','$JEU/r249','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r249/faits.json','--verdict',v],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stdout||'')+String(e.stderr||'')}}};
const refuse=appel('conforme');
if(refuse.code!==1) raisons.push('conforme attendu en 1, vu '+refuse.code);
else if(!refuse.sortie.includes('mal formée')) raisons.push('le refus ne nomme pas la commande mal formée : '+refuse.sortie.split('\n')[0]);
const ok=appel('non concluant');
if(ok.code!==0) raisons.push('non concluant refusé : '+ok.sortie.split('\n')[0]);
else {
  const r=JSON.parse(fs.readFileSync('$JEU/r249/receipt.json','utf8'));
  const l=r.falsificateurs.shell_invalide||[];
  if(l.length!==1) raisons.push('shell_invalide : '+l.length+' entrée(s)');
  else if(!String(l[0].motif).includes('guillemet simple non fermé')) raisons.push('motif inattendu : '+l[0].motif);
  else if(l[0].seq!==3) raisons.push('seq inattendu : '+l[0].seq);
  if((r.falsificateurs.shell_non_interpretable||[]).length) raisons.push('shell_non_interpretable mord : '+JSON.stringify(r.falsificateurs.shell_non_interpretable));
  if(!r.limites.some((x)=>String(x).includes('seq 3')&&String(x).includes('mal formée')&&String(x).includes('ne sont pas mesurés'))) raisons.push('aucune limite par entrée pour la commande mal formée : '+JSON.stringify(r.limites.filter((x)=>String(x).includes('formée'))));
  if(r.verdict!=='non concluant') raisons.push('verdict '+r.verdict);
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"
controle "250 recu, lecteur aveugle et sa limite par entree" 0 node -e "
const fs=require('fs');
const raisons=[];
const r=JSON.parse(fs.readFileSync('$B/r197/receipt.json','utf8'));
const l=r.falsificateurs.shell_non_interpretable||[];
if(l.length!==1) raisons.push('shell_non_interpretable : '+l.length+' entrée(s)');
else {
  const e=l[0];
  if(!r.limites.some((x)=>String(x).includes('seq '+e.seq)&&String(x).includes('non interprétable')&&String(x).includes(e.motif))) raisons.push('aucune limite par entrée pour le seq '+e.seq+' : '+JSON.stringify(r.limites.filter((x)=>String(x).includes('interprétable'))));
  if(r.limites.some((x)=>/^\d+ commande\(s\) shell non interprétable\(s\)/.test(String(x)))) raisons.push('la limite agrégée subsiste');
  if(!r.limites.some((x)=>String(x).includes('rien ne prouve'))) raisons.push('la limite ne dit pas ce qui reste non prouvé');
}
if((r.falsificateurs.shell_invalide||[]).length) raisons.push('shell_invalide mord sur une commande valide : '+JSON.stringify(r.falsificateurs.shell_invalide));
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

# 251 à 253 : la conduite déclarée (ADR-071). 251 : `faits --conduite agent` s'écrit, et le reçu le
# recopie sans le vérifier. 252 : sans --conduite, ou avec un mot hors domaine, `faits` refuse en usage.
# 253 : un faits antérieur (témoignage seul) reste lisible, rend `conduite: null` et nomme la limite.
produit-jouet r251
: > "$JEU/trace/251.jsonl"
node "$H" faits --case "$JOUET" --cases "$JEU/cases" --base "$DBF" --fil jouet-banc --trace "$JEU/trace/251.jsonl" --out "$JEU/r251/faits.json" --par ouvrir --fin "$(date -Is)" --conduite agent >/dev/null 2>&1 || { echo "ARRET — les faits de 251 ne s'écrivent pas"; exit 2; }
bash -c "$(node -e "process.stdout.write(require('$JEU/r251/faits.json').trace.commande)")"
controle "251 conduite agent ecrite et recopiee" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const f=JSON.parse(fs.readFileSync('$JEU/r251/faits.json','utf8'));
if(!f.conduite||f.conduite.mode!=='agent') raisons.push('conduite du faits : '+JSON.stringify(f.conduite));
if(f.conduite&&f.conduite.qui!=='ouvrir') raisons.push('qui inattendu : '+JSON.stringify(f.conduite&&f.conduite.qui));
if(f.temoignage!==undefined) raisons.push('temoignage subsiste dans faits.json');
try{execFileSync('node',['$H','receipt','--run','$JEU/r251','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r251/faits.json','--verdict','non concluant'],{stdio:'ignore'})}catch(e){raisons.push('receipt refusé : '+String(e.stderr||'').split('\n')[0])}
if(!raisons.length){
  const r=JSON.parse(fs.readFileSync('$JEU/r251/receipt.json','utf8'));
  if(!r.conduite||r.conduite.mode!=='agent') raisons.push('conduite du reçu : '+JSON.stringify(r.conduite));
  if(!r.limites.some((x)=>String(x).includes('conduite (agent)')&&String(x).includes('ne prouve pas qui a répondu'))) raisons.push('aucune limite qui dit ce que la déclaration ne prouve pas');
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"
controle "252 faits refuse une conduite absente ou hors domaine" 0 node -e "
const {execFileSync}=require('child_process');
const raisons=[];
const appel=(args)=>{try{execFileSync('node',['$H','faits',...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return{code:0,sortie:''}}catch(e){return{code:e.status,sortie:String(e.stderr||'')+String(e.stdout||'')}}};
const base=['--case','$JOUET','--cases','$JEU/cases','--base','$DBF','--fil','jouet-banc','--trace','$JEU/trace/251.jsonl','--out','$JEU/r252/faits.json','--par','banc','--fin','$(date -Is)'];
const sans=appel(base);
if(sans.code!==2) raisons.push('conduite absente : sortie '+sans.code+' au lieu de 2');
else if(!sans.sortie.includes('--conduite requis')) raisons.push('le refus ne nomme pas --conduite : '+sans.sortie.split('\n')[0]);
const robot=appel([...base,'--conduite','robot']);
if(robot.code!==2) raisons.push('conduite robot : sortie '+robot.code+' au lieu de 2');
else if(!robot.sortie.includes('attendu agent | humain')) raisons.push('le refus ne nomme pas le domaine : '+robot.sortie.split('\n')[0]);
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"
produit-jouet r253
node -e "
const fs=require('fs');
const f=JSON.parse(fs.readFileSync('$JEU/r124/faits.json','utf8'));
delete f.conduite; f.temoignage={qui:'banc',quand:f.horodatage_fin,texte:'temoignage de banc, ecrit avant l ADR-071'};
fs.writeFileSync('$JEU/r253/faits.json',JSON.stringify(f,null,2)+'\n');
"
controle "253 faits anterieur, conduite nulle et limite nommee" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
try{execFileSync('node',['$H','receipt','--run','$JEU/r253','--case','$JOUET','--cases','$JEU/cases','--faits','$JEU/r253/faits.json','--verdict','non concluant'],{stdio:'ignore'})}catch(e){raisons.push('receipt refusé : '+String(e.stderr||'').split('\n')[0])}
if(!raisons.length){
  const r=JSON.parse(fs.readFileSync('$JEU/r253/receipt.json','utf8'));
  if(r.conduite!==null) raisons.push('conduite devrait être nulle : '+JSON.stringify(r.conduite));
  if(!r.limites.some((x)=>String(x).includes('conduite_non_declaree'))) raisons.push('la limite conduite_non_declaree manque');
  if(r.verdict!=='non concluant') raisons.push('verdict '+r.verdict);
  if(!r.temoignage) raisons.push('le témoignage antérieur n\'est pas recopié');
}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

# 268 : la pause porte son intervalle (ADR-078). Deux fils de fixture, 10 000 ms puis 200 ms entre
# le brouillon et l'accord ; le premier ne porte pas de limite courte, le second la nomme. Un recu
# anterieur, sans le champ, reste lisible par `lire`.
P268=$(date +%s%3N)
sqlite3 "$DBF" <<SQL
insert into threads values('pause-banc','$JROOT/terrain','local','','','codebuff','aucun',$P268);
insert into messages values('pause-banc',1,'user',$(($P268-40000)),json_array(json_object('kind','text','text','demande')));
insert into messages values('pause-banc',2,'assistant',$(($P268-30000)),json_array(json_object('kind','text','text','brouillon complet')));
insert into messages values('pause-banc',3,'user',$(($P268-20000)),json_array(json_object('kind','text','text','accord')));
insert into messages values('pause-banc',4,'assistant',$(($P268-10000)),json_array(json_object('kind','tool','toolName','write_file','input',json_object('path','$JROOT/terrain/aidd_docs/NOTES.md'),'status','success')));
insert into threads values('pause-courte','$JROOT/terrain','local','','','codebuff','aucun',$P268);
insert into messages values('pause-courte',1,'user',$(($P268-40000)),json_array(json_object('kind','text','text','demande')));
insert into messages values('pause-courte',2,'assistant',$(($P268-20000)),json_array(json_object('kind','text','text','brouillon complet')));
insert into messages values('pause-courte',3,'user',$(($P268-19800)),json_array(json_object('kind','text','text','accord')));
insert into messages values('pause-courte',4,'assistant',$(($P268-10000)),json_array(json_object('kind','tool','toolName','write_file','input',json_object('path','$JROOT/terrain/aidd_docs/NOTES.md'),'status','success')));
SQL
produit-jouet r268
produit-jouet r268b
export-jouet pause-banc "$JEU/trace/268.jsonl" "$JEU/r268/faits.json" || { echo "ARRET — l'export de 268 ne s'écrit pas"; exit 2; }
export-jouet pause-courte "$JEU/trace/268b.jsonl" "$JEU/r268b/faits.json" || { echo "ARRET — l'export de 268b ne s'écrit pas"; exit 2; }
controle "268 pause, attente_ms mesuree et limite courte" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
const raisons=[];
const appel=(run,faits)=>{try{execFileSync('node',['$H','receipt','--run',run,'--case','$JOUET','--cases','$JEU/cases','--faits',faits,'--verdict','non concluant'],{stdio:'ignore'});return 0}catch(e){return e.status}};
const code=appel('$JEU/r268','$JEU/r268/faits.json');
if(code!==0) raisons.push('receipt r268 : exit '+code);
else {
  const r=JSON.parse(fs.readFileSync('$JEU/r268/receipt.json','utf8'));
  if(!r.pause||r.pause.attente_ms!==10000) raisons.push('attente_ms : '+JSON.stringify(r.pause));
  if(r.pause&&r.pause.mesuree!==true) raisons.push('pause non mesuree');
  if(!r.limites.some((x)=>String(x).includes('sa durée est l\'intervalle')&&String(x).includes('ADR-078'))) raisons.push('la limite ne dit pas ce que la duree mesure');
  if(r.limites.some((x)=>String(x).includes('pas mesurée'))) raisons.push('l ancienne limite subsiste');
  if(r.limites.some((x)=>String(x).includes('200 ms'))) raisons.push('une limite courte sur une pause de 10 s');
}
const code2=appel('$JEU/r268b','$JEU/r268b/faits.json');
if(code2!==0) raisons.push('receipt r268b : exit '+code2);
else {
  const r=JSON.parse(fs.readFileSync('$JEU/r268b/receipt.json','utf8'));
  if(!r.pause||r.pause.attente_ms!==200) raisons.push('attente_ms courte : '+JSON.stringify(r.pause));
  if(!r.limites.some((x)=>String(x).includes('200 ms')&&String(x).includes('pas une attente humaine'))) raisons.push('aucune limite courte nommee');
}
try{execFileSync('node',['$ORCH','lire','--cas','2026-10-22-143219-0052c168-876b08f','--run','$REPO/docs/device/runs/2026-10-22-143219-0052c168-876b08f'],{stdio:'ignore'})}catch(e){raisons.push('un recu anterieur sans attente_ms est refuse : '+String(e.stderr||'').split('\n')[0])}
if(raisons.length){fs.writeFileSync(process.env.DETAIL,raisons.join('\n')+'\n');process.exit(1)}"

rm -f "$JROOT/framework-origin/COPIE-FRONTIERE.md"

echo
echo "$PASS/$TOTAL PASS"
[ "$PASS" = "$TOTAL" ]
