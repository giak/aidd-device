#!/usr/bin/env bash
# banc-harnais.sh — the bench of the harness: the refusals and the acceptances of run.mjs and of
# the link check beside it (liens.mjs), replayed dry. 148 controls, no session opened, nothing
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
  --par banc --fin "$ISO1" --temoignage "banc : aucun run reel" >/dev/null || { echo "ARRET — la fixture faits du banc ne s'écrit pas"; exit 2; }
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
controle "47 faits, fil local dans l'arbre gelé"   0 node "$H" faits --case "$CAS" --base "$DBF" --fil fil-banc --trace "$B/trace/echange.jsonl" --out "$B/faits-genere.json" --par banc --fin "$(date -Is)" --temoignage "banc"
controle "48 faits refus, fil inconnu"             1 node "$H" faits --case "$CAS" --base "$DBF" --fil fil-absent --trace "$B/trace/echange.jsonl" --out "$B/f48.json" --par banc --fin "$(date -Is)" --temoignage "banc"
sqlite3 "$DBF" "update threads set project_path='$B/inexistant' where id='fil-banc';"
controle "49 faits refus, chemin qui ne résout pas" 1 node "$H" faits --case "$CAS" --base "$DBF" --fil fil-banc --trace "$B/trace/echange.jsonl" --out "$B/f49.json" --par banc --fin "$(date -Is)" --temoignage "banc"
sqlite3 "$DBF" "update threads set project_path='$W/terrain', branch='freebuff/banc', worktree_path='$B/wt' where id='fil-banc';"
controle "50 faits refus, fil en worktree"         1 node "$H" faits --case "$CAS" --base "$DBF" --fil fil-banc --trace "$B/trace/echange.jsonl" --out "$B/f50.json" --par banc --fin "$(date -Is)" --temoignage "banc"

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
    --par banc --fin "$ISO1" --temoignage "banc : aucun run reel" >/dev/null || { echo "ARRET — les faits de $1 ne s'écrivent pas"; exit 2; }
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
  --out "$B/f107.json" --par banc --fin "$ISO1" --temoignage "banc : aucun run reel" >/dev/null \
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

# 113-118 : le tableau a une forme mécanique, et F1 et F2 la lisent (H6, ADR-035). Les fils portent
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
SQL
mkdir -p "$B/trace-h6"
export-fil banc-tableau "$B/trace-h6/tableau.jsonl" "$B/f113.json" || { echo "ARRET — l'export de 113 ne s'écrit pas"; exit 2; }
export-fil banc-prose "$B/trace-h6/prose.jsonl" "$B/f114.json" || { echo "ARRET — l'export de 114 ne s'écrit pas"; exit 2; }
export-fil banc-deux-lignes "$B/trace-h6/deux.jsonl" "$B/f115.json" || { echo "ARRET — l'export de 115 ne s'écrit pas"; exit 2; }
export-fil banc-ecriture "$B/trace-h6/ecriture.jsonl" "$B/f116.json" || { echo "ARRET — l'export de 116 ne s'écrit pas"; exit 2; }
export-fil banc-tableau "$B/trace-h6/tableau117.jsonl" "$B/f117.json" || { echo "ARRET — l'export de 117 ne s'écrit pas"; exit 2; }
export-fil banc-sans-nom "$B/trace-h6/sansnom.jsonl" "$B/f118.json" || { echo "ARRET — l'export de 118 ne s'écrit pas"; exit 2; }
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
    --par banc --fin "$(date -Is)" --temoignage "banc : aucune session ouverte (cas jouet)" >/dev/null || return 1
  bash -c "$(node -e "process.stdout.write(require('$3').trace.commande)")"
}
mkdir -p "$B/jouet/trace"
: > "$B/jouet/trace/echange.jsonl"
controle "125 faits du jouet, seize valeurs dérivées du fil" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$H','faits','--case','$JOUET','--cases','$B/jouet/cases','--base','$DBF','--fil','jouet-banc','--trace','$B/jouet/trace/echange.jsonl','--out','$B/jouet/r124/faits.json','--par','banc','--fin','$(date -Is)','--temoignage','banc : aucune session ouverte (cas jouet)'],{stdio:'ignore'});
const f=JSON.parse(fs.readFileSync('$B/jouet/r124/faits.json','utf8'));
let n=0; const compte=(v)=>{ if (v && typeof v==='object') Object.values(v).forEach(compte); else n++; };
compte(f);
process.exit(n===16 ?0:1)"
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
insert into messages values('orch-fil',3,'assistant',$(($OP-5))*1000,json_array(json_object('kind','tool','toolName','write_file','input',json_object('path','$O/cas-test/terrain/aidd_docs/NOTES.md'),'status','success')));
SQL
mkdir -p "$O/home/.config/freebuff-desktop/projects/banc"
cp "$DBF" "$O/home/.config/freebuff-desktop/projects/banc/desktop-v2.db"
controle "140 suite, faits, trace et copie" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','suite','--cas','cas-test','--cases','$O/cases','--run','$O/run','--fil','orch-fil','--produit','aidd_docs'],{stdio:'ignore',env:{...process.env,HOME:'$O/home'}});
const f=JSON.parse(fs.readFileSync('$O/run/faits.json','utf8'));
process.exit(f.session.identifiant==='orch-fil' && fs.existsSync('$O/run/raw/cas-test/NOTES.md') && fs.readFileSync('$O/run/trace/echange.jsonl','utf8').length>0 ?0:1)"
controle "141 refus 9, fin sans last-message" 0 refus-nomme 1 "last-message.md" node "$ORCH" fin --cas cas-test --cases "$O/cases" --run "$O/run" --difference "aucune" --phrase "banc"
printf 'le dernier message de la session.\n' > "$O/run/raw/cas-test/last-message.md"
controle "142 refus 10, verdict interdit par la preuve" 0 refus-nomme 1 "attendu_incomplet" node "$ORCH" fin --cas cas-test --cases "$O/cases" --run "$O/run" --difference "aucune" --phrase "banc" --verdict conforme
controle "143 fin, recu et output du cas fabrique" 0 node -e "
const {execFileSync}=require('child_process'),fs=require('fs');
execFileSync('node',['$ORCH','fin','--cas','cas-test','--cases','$O/cases','--run','$O/run','--difference','aucune : le produit porte le chemin nomme','--phrase','banc : la chaine traverse un cas fabrique','--verdict','non concluant','--limites','ne mord pas'],{stdio:'ignore'});
const r=JSON.parse(fs.readFileSync('$O/run/receipt.json','utf8')),o=JSON.parse(fs.readFileSync('$O/run/output.json','utf8'));
process.exit(r.verdict==='non concluant' && r.limites.some(l=>l.includes('attendu_incomplet')) && o.verdict==='non concluant' ?0:1)"
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

echo
echo "$PASS/$TOTAL PASS"
[ "$PASS" = "$TOTAL" ]
