#!/usr/bin/env bash
# banc-harnais.sh — the bench of the harness: the refusals and the acceptances of run.mjs and of
# the link check beside it (liens.mjs), replayed dry. 96 controls, no session opened, nothing
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
controle() { # nom, attendu, commande...
  local nom="$1" attendu="$2"; shift 2
  TOTAL=$((TOTAL+1))
  "$@" >/dev/null 2>&1
  local rc=$?
  if [ "$rc" = "$attendu" ]; then PASS=$((PASS+1)); printf 'PASS  %-46s exit=%s\n' "$nom" "$rc"
  else printf 'FAIL  %-46s exit=%s attendu=%s\n' "$nom" "$rc" "$attendu"; fi
}
refus-nomme() { # exit attendu, texte attendu, commande... — un refus explicite, pas une trace Node
  local voulu="$1" attendu="$2"; shift 2
  local sortie rc
  sortie=$("$@" 2>&1); rc=$?
  [ "$rc" = "$voulu" ] && printf '%s' "$sortie" | grep -qF -- "$attendu"
}

mkdir -p "$B/cases" "$B/cases2" "$B/trace" "$B/run"
cp "$GEL" "$B/cases/$CAS.freeze.json"

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
controle "1 porte, dossier gelé (--repertoire)"  0 node "$H" preflight --case "$CAS" --repertoire "$W/terrain"
controle "2 porte, répertoire courant"           0 bash -c "cd '$W/terrain' && node '$H' preflight --case '$CAS'"

# 3-7 : les mauvais dossiers
controle "3 refus, terrain original"             1 node "$H" preflight --case "$CAS" --repertoire "$TERRAIN"
controle "4 refus, révision sous test"           1 node "$H" preflight --case "$CAS" --repertoire "$W/framework-origin"
controle "5 refus, ancien foyer ~/runs"          1 node "$H" preflight --case "$CAS" --repertoire "$HOME/runs/aidd-device/2026-10-15-133335-promesse-memoire-avant-ecriture/terrain"
controle "6 refus, répertoire courant = dépôt"   1 node "$H" preflight --case "$CAS"
controle "7 refus, cas sans gel"                 1 node "$H" preflight --case cas-inexistant

# 8 : l'arbre « travail » du gel pointe dans le dépôt du dispositif
node -e "const fs=require('fs'),p='$B/cases/$CAS.freeze.json'; const g=JSON.parse(fs.readFileSync(p,'utf8'));
g.arbres.find(a=>a.label==='travail').chemin='$REPO/docs';
fs.writeFileSync(p, JSON.stringify(g,null,2)+'\n');"
controle "8 refus, arbre travail dans le dépôt"  1 node "$H" preflight --case "$CAS" --cases "$B/cases" --repertoire "$REPO/docs"

# 9 : l'arbre « travail » du gel n'est pas un dépôt git
mkdir -p "$B/pas-un-depot"
cp "$GEL" "$B/cases/$CAS.freeze.json"
node -e "const fs=require('fs'),p='$B/cases/$CAS.freeze.json'; const g=JSON.parse(fs.readFileSync(p,'utf8'));
g.arbres.find(a=>a.label==='travail').chemin='$B/pas-un-depot';
fs.writeFileSync(p, JSON.stringify(g,null,2)+'\n');"
controle "9 refus, arbre travail non-git"        1 node "$H" preflight --case "$CAS" --cases "$B/cases" --repertoire "$B/pas-un-depot"

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
controle "10 refus, porcelain changé"            1 node "$H" preflight --case "$CAS" --cases "$B/cases" --repertoire "$B/faux-travail"
rm -f "$B/faux-travail/ecrit-par-derive.txt"
controle "11 porte, même arbre sans la dérive"   0 node "$H" preflight --case "$CAS" --cases "$B/cases" --repertoire "$B/faux-travail"

# 12-13 : un fichier du cas a bougé depuis le gel (gel copié, chemins par nom de base)
node -e "const fs=require('fs'),path=require('path'); const g=JSON.parse(fs.readFileSync('$GEL','utf8'));
g.fichiers=g.fichiers.map(f=>({...f, chemin: path.basename(f.chemin)}));
g.arbres.find(a=>a.label==='travail').chemin='$W/terrain';
for (const f of g.fichiers) fs.copyFileSync(path.join('$REPO/docs/device/CASES', f.chemin), path.join('$B/cases2', f.chemin));
fs.writeFileSync('$B/cases2/$CAS.freeze.json', JSON.stringify(g,null,2)+'\n');
fs.appendFileSync(path.join('$B/cases2', g.fichiers.find(f=>f.role==='demande').chemin), '\nretouche apres le gel\n');"
controle "12 refus, fichier du cas qui a bougé"  1 node "$H" preflight --case "$CAS" --cases "$B/cases2" --repertoire "$W/terrain"
node -e "const fs=require('fs'),path=require('path');
for (const f of JSON.parse(fs.readFileSync('$B/cases2/$CAS.freeze.json','utf8')).fichiers)
  fs.copyFileSync(path.join('$REPO/docs/device/CASES', path.basename(f.chemin)), path.join('$B/cases2', f.chemin));"
controle "13 porte, gel rejoué d'un banc"        0 node "$H" preflight --case "$CAS" --cases "$B/cases2" --repertoire "$W/terrain"

# 14-19 : non-régression du reste du harnais (le reçu sur le dossier gelé, et les refus d'origine)
controle "14 collect --sans-produit"             0 node "$H" collect --run "$B/run" --case "$CAS" --sans-produit
# The bench's faits.json is written by faits, never by hand: H2 compares the command the piece cites
# to the one the receipt rebuilds, and a hand-written command differs by its SQL (ADR-032). The
# export is made before faits, as §1.5 orders it, and is the thread's own output — here empty,
# since the thread « banc » has no part.
: > "$B/trace/echange.jsonl"
node "$H" faits --case "$CAS" --base "$DBF" --fil banc --trace "$B/trace/echange.jsonl" --out "$B/faits-banc.json" \
  --par banc --fin "$ISO1" --temoignage "banc : aucun run reel" >/dev/null || { echo "ARRET — la fixture faits du banc ne s'écrit pas"; exit 2; }
node -e "const fs=require('fs');const t=JSON.parse(fs.readFileSync('$B/faits-banc.json','utf8'));
t.repertoire_de_travail='$TERRAIN';fs.writeFileSync('$B/faits-mauvais.json',JSON.stringify(t,null,2)+'\n')"
cp "$B/faits-banc.json" "$B/faits-bon.json"
controle "15 receipt refus, base d'un autre arbre" 0 refus-nomme 1 "ouvre" node "$H" receipt --run "$B/run" --case "$CAS" --faits "$B/faits-mauvais.json"
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
controle "27 preflight --texte, substitute juste" 0 node "$H" preflight --case "$CAS" --repertoire "$RACINE/$CAS/terrain" --texte "$B/texte-juste.txt"
controle "28 preflight refus, saut de ligne final" 1 node "$H" preflight --case "$CAS" --repertoire "$RACINE/$CAS/terrain" --texte "$B/texte-saut.txt"
controle "29 preflight refus, chemin d'un autre foyer" 1 node "$H" preflight --case "$CAS" --repertoire "$RACINE/$CAS/terrain" --texte "$B/texte-faux.txt"
controle "30 preflight refus, texte absent" 1 node "$H" preflight --case "$CAS" --repertoire "$RACINE/$CAS/terrain" --texte "$B/aucun-texte.txt"
mkdir -p "$B/cases-sans-racine"
node -e "const fs=require('fs');const g=JSON.parse(fs.readFileSync('$GEL','utf8'));delete g.racine_espace_de_travail;fs.writeFileSync('$B/cases-sans-racine/$CAS.freeze.json',JSON.stringify(g,null,2)+'\n');"
controle "31 preflight refus, gel sans racine déclarée" 1 node "$H" preflight --case "$CAS" --cases "$B/cases-sans-racine" --repertoire "$RACINE/$CAS/terrain" --texte "$B/texte-juste.txt"

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
controle "47 faits, fil local dans l'arbre gelé"   0 node "$H" faits --case "$CAS" --base "$DBF" --fil fil-banc --trace "$B/trace/echange.jsonl" --out "$B/faits-genere.json" --par banc --fin "$(date -Is)" --temoignage "banc"
controle "48 faits refus, fil inconnu"             1 node "$H" faits --case "$CAS" --base "$DBF" --fil fil-absent --trace "$B/trace/echange.jsonl" --out "$B/f48.json" --par banc --fin "$(date -Is)" --temoignage "banc"
sqlite3 "$DBF" "update threads set project_path='$B/inexistant' where id='fil-banc';"
controle "49 faits refus, chemin qui ne résout pas" 1 node "$H" faits --case "$CAS" --base "$DBF" --fil fil-banc --trace "$B/trace/echange.jsonl" --out "$B/f49.json" --par banc --fin "$(date -Is)" --temoignage "banc"
sqlite3 "$DBF" "update threads set project_path='$W/terrain', branch='freebuff/banc', worktree_path='$B/wt' where id='fil-banc';"
controle "50 faits refus, fil en worktree"         1 node "$H" faits --case "$CAS" --base "$DBF" --fil fil-banc --trace "$B/trace/echange.jsonl" --out "$B/f50.json" --par banc --fin "$(date -Is)" --temoignage "banc"

# 51-56 : receipt situe les chemins de faits.json, et les compare comme faits les compare (ADR-025)
vide() { node "$H" collect --run "$B/$1" --case "$CAS" --sans-produit >/dev/null 2>&1; }
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
controle "57 prérequis refus, sqlite3 absent"      0 refus-nomme 1 "« sqlite3 » est introuvable" env PATH="$B/sans-sqlite" "$NODE" "$H" faits --case "$CAS" --base "$B/client.db" --fil fil-banc --trace "$B/trace/echange.jsonl" --out "$B/f57.json" --par banc --fin "$(date -Is)" --temoignage banc
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
for r in r64 r65; do node "$H" collect --run "$B/$r" --case "$CAS" --sans-produit >/dev/null 2>&1; done
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
    --par banc --fin "$ISO1" --temoignage "banc : aucun run reel" >/dev/null 2>&1 || return 1
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

echo
echo "$PASS/$TOTAL PASS"
[ "$PASS" = "$TOTAL" ]
