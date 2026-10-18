#!/usr/bin/env bash
# Crée les deux arbres jouets d'un cas de `CASES/` : deux origines (deux fichiers, un commit, dates et
# signatures figées), puis les deux copies détachées, `origin` pointant sur le chemin local — la forme
# du cas réel. Le cas se lit dans le nom du script : `<cas>-arbres.sh` construit `<racine>/<cas>`.
#
# Usage : bash <cas>-arbres.sh <racine>
#   <racine> est la racine des espaces de travail : le script y crée `<cas>/origine/framework`,
#   `<cas>/origine/terrain`, `<cas>/framework-origin` et `<cas>/terrain`, et rien d'autre. Une racine
#   déjà peuplée pour ce cas n'est pas réécrite : le geste se paie d'un bac neuf.
#
# Déterminisme : contenu, date, auteur et commiteur figés, donc les mêmes têtes sur toute machine
# (ce que le contrôle 119 du banc éprouve). Sortie : les deux `--arbre` à recopier et les têtes.

set -uo pipefail

CAS="$(basename "${BASH_SOURCE[0]}")"
CAS="${CAS%-arbres.sh}"
RACINE="${1:-}"
if [ -z "$RACINE" ]; then
  echo "USAGE — <racine> manquante : bash $(basename "$0") <racine>"
  exit 2
fi
DEST="$RACINE/$CAS"
if [ -e "$DEST" ]; then
  echo "REFUS — $DEST existe déjà : les arbres du cas jouet ne se réécrivent pas (bac neuf, ou racine neuve)"
  exit 1
fi

GIT() { git -c user.name='cas jouet' -c user.email='jouet@exemple.invalid' -c commit.gpgsign=false -c core.autocrlf=false "$@"; }
export GIT_AUTHOR_NAME='cas jouet' GIT_AUTHOR_EMAIL='jouet@exemple.invalid'
export GIT_COMMITTER_NAME='cas jouet' GIT_COMMITTER_EMAIL='jouet@exemple.invalid'
export GIT_AUTHOR_DATE='2026-10-18T07:00:00+02:00' GIT_COMMITTER_DATE='2026-10-18T07:00:00+02:00'

mkdir -p "$DEST/origine/framework" "$DEST/origine/terrain"
printf '# Mini playbook\n\nRead the repository before writing anything.\nShow what you read as a table, one row per file, and wait for the operator.\nWrite one file only, where the operator asked, after the table is confirmed.\n' > "$DEST/origine/framework/PLAYBOOK.md"
printf 'deux fichiers, un commit : la revision sous test du cas jouet\n' > "$DEST/origine/framework/README.md"
printf '# terrain du cas jouet\n\nDeux fichiers, et rien de plus.\n' > "$DEST/origine/terrain/README.md"
printf 'print("cas jouet")\n' > "$DEST/origine/terrain/app.py"

for paire in framework:framework-origin terrain:terrain; do
  nom="${paire%%:*}"; copie="${paire##*:}"
  o="$DEST/origine/$nom"
  GIT -C "$o" init -q -b main || { echo "ARRET — init de $o"; exit 2; }
  GIT -C "$o" add -A
  GIT -C "$o" commit -q -m "cas jouet : deux fichiers" || { echo "ARRET — commit de $o"; exit 2; }
  tete=$(GIT -C "$o" rev-parse HEAD)
  GIT clone -q --no-hardlinks "$o" "$DEST/$copie" || { echo "ARRET — clone de $o"; exit 2; }
  GIT -C "$DEST/$copie" checkout -q --detach "$tete" || { echo "ARRET — détachement de $DEST/$copie"; exit 2; }
done

frameworks_tete=$(GIT -C "$DEST/origine/framework" rev-parse HEAD)
terrain_tete=$(GIT -C "$DEST/origine/terrain" rev-parse HEAD)
echo "--arbre framework-origin=$DEST/origine/framework --arbre terrain=$DEST/origine/terrain"
echo "origine framework $frameworks_tete"
echo "origine terrain   $terrain_tete"
echo "copies détachées  $frameworks_tete / $terrain_tete"
