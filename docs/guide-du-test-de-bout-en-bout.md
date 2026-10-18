---
name: Guide du test de bout en bout — la version minimale
description: Les trois premiers chapitres du guide, chacun avec son geste copiable, la sortie observée, un refus provoqué et le mot qu'il installe : lire un reçu, rejouer un gel, provoquer trois refus
type: guide
status: in-progress
---

# Guide du test de bout en bout — la version minimale

> 2026-10-18, né à 06:55:09 (`stat -c %w`). Trois chapitres, écrits depuis le plan
> [2026-10-17-134347-guide-pedagogique-du-test-de-bout-en-bout.md](brainstorm/2026-10-17-134347-guide-pedagogique-du-test-de-bout-en-bout.md),
> section 10 : lire un reçu (seuil 2), rejouer un gel (seuil 3), provoquer trois refus (seuil 6 en
> miniature). Le plan reste le plan, ses quatre autres chapitres et ses décisions ouvertes sont là-bas.
> Toutes les sorties citées ici ont été **observées le 2026-10-18** sur `a60f2e5`, et les blocs sont
> recopiés de la console, jamais retapés.
>
> Deux avertissements, avant le premier geste. **Aucun `receipt.json` n'existe dans ce dépôt** : la pièce
> que lit le chapitre 1 vient du banc, et sa session est une **fixture** (`identifiant: "banc"`,
> `modele: "aucun"`). Le premier reçu d'un run réel viendra du second run. Et **rien de ce guide ne
> s'exécute dans les quatre arbres**, à une exception près, écrite et retirée : le chapitre 1 écrit dans un
> dossier jetable sous `/tmp`, le chapitre 2 dans un clone jetable, le chapitre 3 dans des dossiers jetables,
> et le banc crée puis supprime **un lien symbolique** dans l'espace de travail du cas, son contrôle 41
> échouant si l'espace n'est pas rendu propre ([BANC.md](device/BANC.md), §3). Si un de ces gestes écrit
> ailleurs, il a été mal copié.

## 0. Trois chemins, lus au gel, avant d'ouvrir un chapitre

Ne les retape pas : lis-les dans le gel. C'est le premier geste du guide, et il vaut pour les trois
chapitres.

```bash
cd /home/giak/projects/aidd-device         # votre clone du dispositif, seul chemin à remplacer
eval "$(node -e '
const g = require("./docs/device/CASES/2026-10-15-133423-promesse-memoire-avant-ecriture.freeze.json");
const a = Object.fromEntries(g.arbres.map((x) => [x.label, x.chemin]));
const q = (v) => JSON.stringify(v);
console.log("CAS=" + q(g.cas));
console.log("W=" + q(g.racine_espace_de_travail + "/" + g.cas));
console.log("FRAMEWORK=" + q(a["revision-sous-test"]));
')"
echo "$CAS"; echo "$W"; echo "$FRAMEWORK"
```

Sortie observée le 2026-10-18 :

```text
2026-10-15-133423-promesse-memoire-avant-ecriture
/home/giak/projects/aidd-device-work/2026-10-15-133423-promesse-memoire-avant-ecriture
/home/giak/projects/aidd-device-work/2026-10-15-133423-promesse-memoire-avant-ecriture/framework-origin
```

`$W` est l'espace de travail du cas, celui où la session s'ouvrira ; `$FRAMEWORK` est le checkout de la
révision sous test, le seul chemin que le gel te demande de fournir ailleurs.

## 1. Lire un reçu

**Le geste.** Le banc écrit un reçu complet sans ouvrir de session : c'est la seule source de reçu
aujourd'hui, et c'est dit. Lance-le, puis lis six champs.

```bash
cd /home/giak/projects/aidd-device
bash docs/device/harness/banc-harnais.sh | tail -3
# le banc imprime en tête de sa sortie : « jetable /tmp/banc-harnais.XXXXXX (conservé pour inspection) »
B=/tmp/banc-harnais.XXXXXX                 # ce dossier-là, le tien
node -e '
const r = require(process.argv[1] + "/run/receipt.json");
const l = (k, v) => console.log(k.padEnd(22), JSON.stringify(v));
l("verdict", r.verdict); l("porte.passe_le", r.porte.passe_le); l("echanges", r.echanges);
l("falsificateurs", r.falsificateurs); l("limites", r.limites); l("produit.absent", r.produit.absent);
' "$B"
```

**La sortie attendue.** Le banc finit par `112/112 PASS`, `exit 0` ; les six champs, observés le
2026-10-18 sur `B=/tmp/banc-harnais.Enruf8` :

```text
verdict                "non concluant"
porte.passe_le         "2026-10-18T06:50:35.151080548+0200"
echanges               {"budget":3,"utilises":1,"epuise_par":null}
falsificateurs         {"birth_anterieur_au_gel":[],"arbre_de_travail_inchange":false,"produit_identique_a_une_empreinte_anterieure":[],"trace_sans_echange_dans_la_fenetre":true}
limites                ["la session n'a rien produit : le produit est sa sortie brute (§9)","la trace exportée ne porte aucun échange dans la fenêtre du run (§5, condition 2)"]
produit.absent         true
```

**Ce qu'ils attestent, et ce qu'ils n'attestent pas.** `verdict` est plafonné par ce qui suit : ici deux
limites mordent, donc `non concluant`, et c'est le dispositif qui fonctionne, pas un échec.
`porte.passe_le` est l'instant où la porte du chapitre 3 a été passée, avant le premier message.
`echanges` mesure le fil contre le budget du cas : un message utilisateur sur les trois autorisés.
`falsificateurs` est le plafond lu, pas une opinion : `arbre_de_travail_inchange` vaut `false` quand aucun
produit n'existe ou quand l'arbre a bougé ; `trace_sans_echange_dans_la_fenetre` vaut `true`, et c'est lui
qui produit la seconde limite. Aucun de ces six champs ne dit si le travail est bon : **un reçu atteste
qu'un run a eu lieu et comment, jamais que ce qui en est sorti vaut quelque chose.**

**Le refus provoqué.** Le reçu refuse de s'écrire deux fois : essaie.

```bash
node docs/device/harness/run.mjs receipt --run "$B/run" --case "$CAS" \
  --faits "$B/faits-bon.json" --verdict "non concluant"
```

```text
REFUS — receipt : /tmp/banc-harnais.Enruf8/run/receipt.json existe déjà — un reçu reconstruit est un
témoignage, jamais un reçu (§6)   → exit 1
```

**Quatre affirmations, une fausse.** (1) La porte a été passée le 2026-10-18 à 06:50:35, dans l'espace de
travail du cas. (2) Le fil a consommé un message utilisateur sur trois. (3) Ce reçu atteste qu'une session
réelle a travaillé sur le cas. (4) Le produit est absent, donc aucun `conforme` n'est possible. La fausse
est la (3), et le reçu la dément lui-même : `session.identifiant` vaut `"banc"`, `session.modele` vaut
`"aucun"`, son témoignage dit `"banc : aucun run reel"`, et `session_verifiee.base` pointe une base de
banc sous `/tmp`.

**Le mot que ce chapitre installe : reçu.** La pièce écrite par le harnais au moment du run, qui joint
demande, produit, trace, horodatages et verdict. Ni un compte-rendu, ni une preuve de qualité.

## 2. Rejouer un gel

**Le geste.** La formule est celle du §1.1 de la [conduite du run](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md) :
copie son bloc `python3`, ouvre-le depuis la racine du dépôt, et donne-lui le checkout de l'arbre gelé.

```bash
cd /home/giak/projects/aidd-device
export RACINE_FRAMEWORK="$FRAMEWORK"       # le checkout de la révision sous test, $FRAMEWORK du §0
# colle ici le bloc `python3 - <<'PY' … PY` du §1.1, tel quel, puis lance-le
```

Un lecteur qui n'a ni la machine ni les chemins suit plutôt la [recette de REPLAY](device/REPLAY.md), §2 :
même formule, mais elle prend le cas dans un clone neuf et ne réécrit aucun chemin.

**La sortie attendue.** Observée le 2026-10-18, `exit 0` :

```text
fichier attendu True
fichier demande True
arbre revision-sous-test HEAD 4c39e5c5 gelé 4c39e5c5 True
reference plugins/aidd-context/skills/02-project-memory/SKILL.md True
reference plugins/aidd-context/skills/02-project-memory/actions/01-scan.md True
reference plugins/aidd-context/skills/02-project-memory/actions/02-write.md True
reference plugins/aidd-context/skills/02-project-memory/assets/scan-summary.md True
reference plugins/aidd-context/skills/02-project-memory/references/memory-destinations.md True
reference plugins/aidd-context/skills/02-project-memory/references/structure.md True
reference plugins/aidd-context/skills/02-project-memory/references/memory-rules.md True
reference plugins/aidd-context/skills/02-project-memory/references/reading-sources.md True
empreinte True
```

Onze faits comparés, une empreinte recalculée sur les mêmes lignes, et deux `True` par ligne : le disque
et le gel. Ces empreintes-là ne dépendent d'aucun outil du dispositif, tu viens de les calculer à la main.

**Le refus provoqué.** Un octet de plus dans la demande, et le gel tombe. Ne le fais pas dans ton dépôt :
fais-le dans un clone jetable.

```bash
D=/tmp/gel-tamper; rm -rf "$D"
git clone --quiet --no-hardlinks /home/giak/projects/aidd-device "$D"
cd "$D"
printf "\n" >> "docs/device/CASES/$CAS.request.md"
node docs/device/harness/run.mjs preflight --case "$CAS" --repertoire "$W/terrain" --run /tmp/porte-tamper
```

```text
REFUS — preflight : le demande a changé depuis le gel — a202f033 au disque, 5aac04fb gelé
(docs/device/CASES/2026-10-15-133423-promesse-memoire-avant-ecriture.request.md) ; le gel est la seule
preuve du « écrit avant d'avoir vu le produit » (§3), donc rien ne s'écrit ici   → exit 1
```

La formule du §1.1, relancée dans ce clone, dit la même chose à sa façon : `fichier demande False`, et
`exit 1`. Relance-la dans le dépôt intact : elle repasse à `True`. Le `le demande` est une faute
d'accord du harnais, recopiée telle quelle ; elle ne change rien au refus.

**Le mot que ce chapitre installe : gel.** L'empreinte des fichiers du cas et des références, prise avant
que la moindre session soit ouverte. Il prouve que le texte scellé est intact ; il ne prouve pas qu'un run
a eu lieu, et la recette de REPLAY, §1, dit exactement cela.

## 3. Provoquer trois refus

Aucun des trois ne demande de session, ni de fil, ni de produit. Chacun écrit dans `/tmp` seulement.

**Refus 1 : un dossier qui n'est pas celui du gel.** Depuis la racine du dépôt, la porte refuse net.

```bash
cd /home/giak/projects/aidd-device
node docs/device/harness/run.mjs preflight --case "$CAS" --run /tmp/porte-1
```

```text
REFUS — preflight : ouverture refusée dans /home/giak/projects/aidd-device — le gel de ce cas ouvre la
session dans /home/giak/projects/aidd-device-work/2026-10-15-133423-promesse-memoire-avant-ecriture/terrain
(§4 de la demande) ; écrire ailleurs ferait du produit l'écrit d'un autre dossier, et la paire
avant/après du §5.2 ne le mesurerait pas   → exit 1
```

Le terrain original (`/home/giak/projects/audio-sync-tool`) refuse de la même façon, avec le même motif :
un produit écrit là serait l'écrit d'un autre dossier.

**Refus 2 : une porte sans dossier de run.** `--run` n'est pas une commodité, c'est l'endroit où la porte
laisse sa trace.

```bash
node docs/device/harness/run.mjs preflight --case "$CAS" --repertoire "$W/terrain"
```

```text
USAGE — --run requis
```

La suite est l'aide du harnais, et le code est **2**, pas 1 : c'est une commande mal formée, pas un refus
motivé. Deux codes différents pour deux natures différentes, la distinction compte quand tu écriras un
script.

**Refus 3 : un dossier de run sans porte.** Prends les pièces du banc (chapitre 1), enlève la porte, et
demande le reçu.

```bash
B=/tmp/banc-harnais.XXXXXX        # ton dossier du chapitre 1
cp -r "$B/run" /tmp/run-sans-porte
rm -f /tmp/run-sans-porte/receipt.json /tmp/run-sans-porte/output.json /tmp/run-sans-porte/gate.json
node docs/device/harness/run.mjs receipt --run /tmp/run-sans-porte --case "$CAS" \
  --faits "$B/faits-bon.json" --verdict "non concluant"
```

```text
REFUS — receipt : aucune porte /tmp/run-sans-porte/gate.json — la porte d'avant la session n'a pas laissé
de trace : un reçu sans elle ne distingue plus un run qui a passé preflight d'un run qui l'a sauté (H5)
→ exit 1
```

C'est le refus le plus utile des trois : il dit pourquoi la porte doit précéder l'ouverture. Une session
ouverte sans porte produit un dossier que plus rien ne distingue d'un dossier fabriqué après coup.

**Le mot que ce chapitre installe : porte.** Le passage autorisé, daté, écrit dans le dossier du run avant
le premier message. Elle atteste que quelqu'un a passé `preflight` en ce dossier-là, à cet instant-là.
Elle ne prouve pas qu'il ne l'a pas fabriquée : la porte est forgeable, et le plan le dit (sa figure 9 et
son falsificateur G7).

## 4. Ce que cette version ne fait pas

- **Elle ne mène aucun run.** Le chapitre 1 lit un reçu de banc, pas un reçu de run ; le premier reçu réel
  sera écrit par le second run, et il sera le seul à porter un `porte` venu d'une session.
- **Elle ne couvre que trois pièces sur sept.** Le parcours du plan en compte sept ; écrire les quatre
  autres demande une session ou une décision (la forme mécanique du tableau, le cas jouet, le foyer du
  guide). La section 14 du plan tient la liste.
- **Elle ne mesure pas son lecteur.** Les seuils du plan, son protocole à trois lecteurs et ses 40 minutes
  restent des hypothèses : personne n'a encore suivi cette page.
- **Elle ne juge pas la qualité du cas.** Rejouer un gel dit que le texte scellé est intact, jamais qu'il
  est bien écrit.

## 5. Où sont les sources

| Ce que tu viens de faire | Où c'est écrit | Ce qui y est plus complet |
| --- | --- | --- |
| lire un reçu | [ARCHITECTURE.md](ARCHITECTURE.md), § vie des artefacts | le rôle de chaque pièce dans la chaîne de preuve |
| provoquer un refus | [BANC.md](device/BANC.md) | les 112 contrôles, leurs noms, et ce qu'ils ne prouvent pas |
| rejouer un gel | [REPLAY.md](device/REPLAY.md) | la recette depuis un clone neuf, et ses quatre limites |
| mener un run | [la conduite](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md) | les six gestes, dans l'ordre, avec leurs valeurs attendues |
| écrire un cas | [la spec du run](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-130103-spec.md) | la demande, l'attendu, le gel, les falsificateurs |
