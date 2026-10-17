#!/usr/bin/env bash
# banc-harnais.sh — the bench of the harness: the refusals and the acceptances of run.mjs,
# replayed dry. 50 controls, no session opened, nothing written in the repository or in the
# four trees.
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
"repertoire_de_travail":"$TERRAIN","trace":{"source":"banc","chemin_exporte":"$B/trace","commande":"banc"},
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

echo
echo "$PASS/$TOTAL PASS"
[ "$PASS" = "$TOTAL" ]
