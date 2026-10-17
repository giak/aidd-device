#!/usr/bin/env bash
# banc-harnais.sh — the bench of the harness: the refusals and the acceptances of run.mjs and of
# the link check beside it (liens.mjs), replayed dry. 67 controls, no session opened, nothing
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

mkdir -p "$B/cases" "$B/cases2" "$B/trace" "$B/run"
cp "$GEL" "$B/cases/$CAS.freeze.json"

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
cat > "$B/faits-mauvais.json" <<JSON
{"session":{"application":"banc","identifiant":"banc","modele":"aucun","ouverte_par":"banc","ouverte_le":"2026-10-15T23:00:00+02:00"},
"horodatage_debut":"2026-10-15T23:00:00+02:00","horodatage_fin":"2026-10-15T23:01:00+02:00",
"repertoire_de_travail":"$TERRAIN","trace":{"source":"banc","chemin_exporte":"$B/trace/echange.jsonl","commande":"sqlite3 -readonly base \"select json_object('seq', m.seq) from messages m, json_each(m.parts_json) where m.thread_id='banc' order by m.seq;\""},
"cloisonnement":{"attendu_vu":"non"},"temoignage":{"qui":"banc","quand":"2026-10-15T23:01:00+02:00","texte":"banc : aucun run reel"}}
JSON
sed "s#\"repertoire_de_travail\":\"$TERRAIN\"#\"repertoire_de_travail\":\"$W/terrain\"#" \
  "$B/faits-mauvais.json" > "$B/faits-bon.json"
controle "15 receipt refus, autre arbre gelé"    1 node "$H" receipt --run "$B/run" --case "$CAS" --faits "$B/faits-mauvais.json"
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
mk() { # nom-du-run, chemin-de-la-source-du-produit
  node "$H" collect --run "$B/$1" --case "$CAS" --sans-produit >/dev/null 2>&1
  node -e "const fs=require('fs'),p='$B/$1/raw/$CAS/manifest.json';const m=JSON.parse(fs.readFileSync(p,'utf8'));
const src='$2';
if (src==='') { m.arbre_de_travail={label:'travail',chemin:'$TERRAIN'}; }
else { m.fichiers=[{chemin:'produit.md',source:src,sha256:'0'.repeat(64),taille:1,birth:null,birth_epoch:null}]; }
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
DBF="$B/client.db"
sqlite3 "$DBF" "create table threads(id text primary key, project_path text, execution_mode text, branch text, worktree_path text, harness_id text, model text, created_at integer);
create table messages(thread_id text, seq integer, role text, ts integer, parts_json text);
insert into threads values('fil-banc','$W/terrain','local','','','codebuff','m-banc',$(($(date +%s)*1000-60000)));
insert into messages values('fil-banc',1,'user',$(($(date +%s)*1000-30000)),'[]');"
touch "$B/trace/echange.jsonl"
controle "47 faits, fil local dans l'arbre gelé"   0 node "$H" faits --case "$CAS" --base "$DBF" --fil fil-banc --trace "$B/trace/echange.jsonl" --out "$B/faits-genere.json" --par banc --fin "$(date -Is)" --temoignage "banc"
controle "48 faits refus, fil inconnu"             1 node "$H" faits --case "$CAS" --base "$DBF" --fil fil-absent --trace "$B/trace/echange.jsonl" --out "$B/f48.json" --par banc --fin "$(date -Is)" --temoignage "banc"
sqlite3 "$DBF" "update threads set project_path='$B/inexistant' where id='fil-banc';"
controle "49 faits refus, chemin qui ne résout pas" 1 node "$H" faits --case "$CAS" --base "$DBF" --fil fil-banc --trace "$B/trace/echange.jsonl" --out "$B/f49.json" --par banc --fin "$(date -Is)" --temoignage "banc"
sqlite3 "$DBF" "update threads set project_path='$W/terrain', branch='freebuff/banc', worktree_path='$B/wt' where id='fil-banc';"
controle "50 faits refus, fil en worktree"         1 node "$H" faits --case "$CAS" --base "$DBF" --fil fil-banc --trace "$B/trace/echange.jsonl" --out "$B/f50.json" --par banc --fin "$(date -Is)" --temoignage "banc"

# 51-56 : receipt situe les chemins de faits.json, et les compare comme faits les compare (ADR-025)
vide() { node "$H" collect --run "$B/$1" --case "$CAS" --sans-produit >/dev/null 2>&1; }
faits-en() { # travail, trace, sortie — depuis le faits.json du banc, seules les deux valeurs changent
  node -e "const fs=require('fs');const t=JSON.parse(fs.readFileSync('$B/faits-bon.json','utf8'));
t.repertoire_de_travail=process.argv[1];t.trace.chemin_exporte=process.argv[2];
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
refus-nomme() { # exit attendu, texte attendu, commande... — un refus explicite, pas une trace Node
  local voulu="$1" attendu="$2"; shift 2
  local sortie rc
  sortie=$("$@" 2>&1); rc=$?
  [ "$rc" = "$voulu" ] && printf '%s' "$sortie" | grep -qF -- "$attendu"
}
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

# 66-67 : le reçu lit l'export et compte les échanges de la fenêtre (§5, condition 2 ; ADR-029)
D66=$(date -d '2026-10-15T23:00:00+02:00' +%s000)
mkdir -p "$B/trace66"
printf '{"seq":1,"role":"user","ts":%s,"text":"banc"}\n' "$((D66+30000))" > "$B/trace66/dans.jsonl"
printf '{"seq":1,"role":"user","ts":%s,"text":"banc"}\n' "$((D66-3600000))" > "$B/trace66/hors.jsonl"
trace66() { # fichier de trace, sortie
  node -e "const fs=require('fs');const t=JSON.parse(fs.readFileSync('$B/faits-bon.json','utf8'));
t.trace.chemin_exporte=process.argv[1];fs.writeFileSync(process.argv[2],JSON.stringify(t,null,2)+'\n')" "$1" "$2"
}
trace66 "$B/trace66/dans.jsonl" "$B/f66.json"
trace66 "$B/trace66/hors.jsonl" "$B/f67.json"
for r in r66 r67; do node "$H" collect --run "$B/$r" --case "$CAS" --sans-produit >/dev/null 2>&1; done
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

echo
echo "$PASS/$TOTAL PASS"
[ "$PASS" = "$TOTAL" ]
