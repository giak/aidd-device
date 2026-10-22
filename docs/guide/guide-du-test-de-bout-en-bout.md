---
name: Guide du test de bout en bout — la version minimale
description: Les cinq premiers chapitres du guide, chacun avec son geste copiable, la sortie observée, un refus provoqué et le mot qu'il installe : lire un reçu, rejouer un gel, provoquer trois refus, lire un tableau et le faire manquer, lire le cas jouet jusqu'aux refus F2 et F1
type: guide
status: in-progress
---

# Guide du test de bout en bout — la version minimale

> 2026-10-18, né à 06:55:09 (`stat -c %w`). Cinq chapitres, écrits depuis le plan
> [2026-10-17-134347-guide-pedagogique-du-test-de-bout-en-bout.md](../brainstorm/2026-10-17-134347-guide-pedagogique-du-test-de-bout-en-bout.md),
> section 10 : lire un reçu (seuil 2), rejouer un gel (seuil 3), provoquer trois refus (seuil 6 en
> miniature), lire un tableau et le faire manquer (F1 et F2, après H6), et — hors du parcours du plan,
> parce qu'il manquait un cas montrable — lire le cas jouet du texte remis jusqu'aux refus F2 et F1
> ([ADR-036](../DECISIONS.md)). Le plan reste le plan, ses trois autres chapitres et ses décisions ouvertes
> sont là-bas.
> Toutes les sorties citées ici ont été **observées le 2026-10-18** : les chapitres 2 et 3 sur `a60f2e5`,
> les chapitres 1 et 4 sur le harnais de H6 (`dbd85ba`), le chapitre 5 sur l'arbre de travail au-dessus de
> `df59482`, où le cas jouet et les contrôles 119 à 130 ne sont pas encore commités. Les blocs sont
> recopiés de la console, jamais retapés. La mise à jour du **2026-10-20** ajoute le premier reçu d'un run
> réel et les 236 contrôles ; elle ne réécrit pas les sorties datées du 2026-10-18.
>
> Deux avertissements, avant le premier geste. **Le chapitre 1 lit un reçu de banc**, et sa session est
> une **fixture** (`identifiant: "banc"`, `modele: "aucun"`) : un premier reçu de run opencode réel
> existe depuis le 2026-10-20 ([reçu](../device/runs/2026-10-20-202333-50664060-1028c8b/receipt.json),
> verdict `non concluant`), mais il ne remplace pas la fixture du chapitre. Et **rien de ce guide ne
> s'exécute dans les quatre arbres**, à une exception près, écrite et retirée : le chapitre 1 écrit dans un
> dossier jetable sous `/tmp`, le chapitre 2 dans un clone jetable, le chapitre 3 dans des dossiers jetables,
> le chapitre 4 n'écrit rien : il relit le dossier du chapitre 1 et y demande un refus, qui n'écrit pas, et
> le chapitre 5 écrit deux arbres jetables sous `/tmp` avec le script du cas jouet, ses deux refus
> n'écrivant rien ; le banc crée puis supprime **un lien symbolique** dans l'espace de travail du cas, son contrôle 41
> échouant si l'espace n'est pas rendu propre ([BANC.md](../device/BANC.md), §3). Si un de ces gestes écrit
> ailleurs, il a été mal copié.

## 0. Trois chemins, lus au gel, avant d'ouvrir un chapitre

Ne les retape pas : lis-les dans le gel. C'est le premier geste du guide, et il vaut pour les cinq
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

**Le geste.** Le banc écrit un reçu complet sans ouvrir de session. Ce chapitre lit ce reçu de
**fixture** ; le premier reçu d'un run réel, opencode, existe depuis le 2026-10-20 (chapitre 5), et il ne
remplace pas la sortie du banc. Lance-le, puis lis sept champs.

```bash
cd /home/giak/projects/aidd-device
bash docs/device/harness/banc-harnais.sh | tail -3
# le banc imprime en tête de sa sortie : « jetable /tmp/banc-harnais.XXXXXX (conservé pour inspection) »
B=/tmp/banc-harnais.XXXXXX                 # ce dossier-là, le tien
node -e '
const r = require(process.argv[1] + "/run/receipt.json");
const l = (k, v) => console.log(k.padEnd(22), JSON.stringify(v));
l("verdict", r.verdict); l("porte.passe_le", r.porte.passe_le); l("echanges", r.echanges);
l("tableau", r.tableau); l("falsificateurs", r.falsificateurs); l("limites", r.limites);
l("produit.absent", r.produit.absent);
' "$B"
```

**La sortie attendue.** Le banc finit par `258/258 PASS`, `exit 0` (il en comptait `118/118` le 2026-10-18
au matin, puis `130/130` l'après-midi, `149/149` après l'orchestrateur, `153/153` avant les contrôles
des deux clients, `171/171` avant l'ADR-047, puis `193/193` avant les effets hors cadre) ; les sept
champs, observés le 2026-10-18 sur
`B=/tmp/banc-harnais.icCmQG`, avant l'élargissement de H6 :

```text
verdict                "non concluant"
porte.passe_le         "2026-10-18T07:26:29.498146165+0200"
echanges               {"budget":3,"utilises":1,"epuise_par":null}
tableau                {"forme":"text/assistant, >=3 lignes, 2e ligne séparatrice, >=2 colonnes","present":false,"seq":null,"ts":null,"lignes":0,"colonnes":0}
falsificateurs         {"birth_anterieur_au_gel":[],"arbre_de_travail_inchange":false,"produit_identique_a_une_empreinte_anterieure":[],"trace_sans_echange_dans_la_fenetre":true,"tableau_absent":true,"ecriture_avant_tableau":[],"produit_ne_avant_le_tableau":[]}
limites                ["la session n'a rien produit : le produit est sa sortie brute (§9)","la trace exportée ne porte aucun échange dans la fenêtre du run (§5, condition 2)","la trace ne porte aucun tableau rendu par la session (§5, F2)"]
produit.absent         true
```

**Ce qu'ils attestent, et ce qu'ils n'attestent pas.** `verdict` est plafonné par ce qui suit : ici deux
limites mordent, donc `non concluant`, et c'est le dispositif qui fonctionne, pas un échec.
`porte.passe_le` est l'instant où la porte du chapitre 3 a été passée, avant le premier message.
`echanges` mesure le fil contre le budget du cas : un message utilisateur sur les trois autorisés.
`tableau` porte la forme mécanique du tableau rendu par la session et son instant : ici `present` vaut
`false`, donc F2 mord et la troisième limite le dit. La chaîne `forme` affichée est celle d'avant
l'ADR-047 ; depuis, elle dit `>=1 colonne`, sans changer les autres champs. `falsificateurs` est le plafond lu, pas une opinion :
`arbre_de_travail_inchange` vaut `false` quand aucun produit n'existe ou quand l'arbre a bougé ;
`trace_sans_echange_dans_la_fenetre` vaut `true`, et c'est lui qui produit la seconde limite ;
`tableau_absent` vaut `true` ici, et `ecriture_avant_tableau` et `produit_ne_avant_le_tableau` restent vides
parce que le reçu ne les mesure que si un tableau existe. Aucun de ces sept champs ne dit si le travail est
bon : **un reçu atteste qu'un run a eu lieu et comment, jamais que ce qui en est sorti vaut quelque chose.**

**Le refus provoqué.** Le reçu refuse de s'écrire deux fois : essaie.

```bash
node docs/device/harness/run.mjs receipt --run "$B/run" --case "$CAS" \
  --faits "$B/faits-bon.json" --verdict "non concluant"
```

```text
REFUS — receipt : /tmp/banc-harnais.icCmQG/run/receipt.json existe déjà — un reçu reconstruit est un
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

**Le geste.** La formule est celle du §1.1 de la [conduite du run](../tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md) :
copie son bloc `python3`, ouvre-le depuis la racine du dépôt, et donne-lui le checkout de l'arbre gelé.

```bash
cd /home/giak/projects/aidd-device
export RACINE_FRAMEWORK="$FRAMEWORK"       # le checkout de la révision sous test, $FRAMEWORK du §0
# colle ici le bloc `python3 - <<'PY' … PY` du §1.1, tel quel, puis lance-le
```

Un lecteur qui n'a ni la machine ni les chemins suit plutôt la [recette de REPLAY](../device/REPLAY.md), §2 :
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

## 4. Lire un tableau, et le faire manquer

Le chapitre 1 a lu `tableau` sur un fil qui n'en porte aucun (`present: false`, donc F2 mord). Ce
chapitre-ci le lit sur un fil qui en porte un, puis fait refuser un fil qui n'en a pas. Le dossier de banc
du chapitre 1 suffit : tout est déjà dedans.

**Le geste.**

```bash
B=/tmp/banc-harnais.XXXXXX       # le dossier du chapitre 1, `jetable …` en tête de sa sortie
node -e '
const r = require(process.argv[1] + "/r113/receipt.json");
const l = (k, v) => console.log(k.padEnd(26), JSON.stringify(v));
l("tableau", r.tableau); l("verdict", r.verdict);
l("tableau_absent", r.falsificateurs.tableau_absent);
l("ecriture_avant_tableau", r.falsificateurs.ecriture_avant_tableau);
l("produit_ne_avant_le_tableau", r.falsificateurs.produit_ne_avant_le_tableau);
l("limites", r.limites);
' "$B"
```

**La sortie attendue.** Observée le 2026-10-18 sur un banc neuf, `B=/tmp/banc-harnais.rtzngO`, du harnais
de H6 (`dbd85ba`), puis **rejouée** le même jour sur un autre banc neuf : `diff` entre les deux, `0`
différence, 410 octets :

```text
tableau                    {"forme":"text/assistant, >=3 lignes, 2e ligne séparatrice, >=2 colonnes","present":true,"seq":3,"ts":1792098020000,"lignes":4,"colonnes":3}
verdict                    "non concluant"
tableau_absent             false
ecriture_avant_tableau     []
produit_ne_avant_le_tableau []
limites                    ["le produit existe et l'arbre de travail est inchangé (§5, condition 3)"]
```

**Ce que `tableau` atteste.** Qu'une part `text` d'un message `assistant` porte un bloc d'au moins trois
lignes, dont la deuxième est une séparatrice (`| --- |`) et dont la première ligne porte au moins une
cellule :
`lignes` et `colonnes` sont mesurées, `seq` et `ts` disent **quel message** l'a rendu. Ici quatre lignes sur
trois colonnes, au message 3. Le champ ne dit pas que le tableau est juste, ni que ses lignes ont été
écrites dans des fichiers : cette moitié de l'attendu (E4) reste une lecture humaine. Et deux formes ne
comptent pas, mesuré par le banc : un tableau rendu en `reasoning` est écarté au profit de la part `text`
(contrôle 113, la personne ne l'a jamais vu), et un tableau de deux lignes n'en est pas un (contrôle 115,
il lui manque une troisième ligne).

**Le faux négatif corrigé le 2026-10-20.** La session opencode réelle a rendu un tableau Markdown d'**une
seule colonne** (`| File Path |`, deux chemins). La forme H6 d'alors exigeait deux cellules, donc le
`receipt.json` écrit à chaud porte `present: false` et `F2` mord. L'opérateur, lui, voyait un tableau.
L'ADR-047 abaisse la condition à **une cellule** ; le contrôle **172** l'éprouve, et un rejeu du reçu sur
une copie des pièces rend `present: true`, `colonnes: 1`, `tableau_absent: false`. Le reçu du dépôt reste
celui écrit à chaud : il n'est pas réécrit.

**Ce que les trois falsificateurs attestent.** Ils datent l'ordre, pas la qualité. `tableau_absent: false`
dit qu'un tableau a été trouvé ; `ecriture_avant_tableau` vide, qu'aucun acte d'écriture ne le précède ;
`produit_ne_avant_le_tableau` vide, qu'aucun produit enregistré n'est né avant son instant. Ce sont deux
ordres distincts, écrire puis rendre et rendre puis produire, et c'est l'instant du tableau qui les borne.

**Une honnêteté sur cette fixture.** Le contrôle 113 ne mesure pas un run propre : le README copié dans ce
run est né le 2026-10-15, donc avant le gel, et F1 mordait. Le banc recule l'instant enregistré dans le
manifeste de la copie sous `raw/` (dix secondes après le tableau, sans toucher la copie), puis mesure que
plus rien ne mord. Une sortie vide dit donc « le contrôle sait voir l'ordre », jamais « ce run est propre »,
et ce renfort a son falsificateur, mesuré le 2026-10-18 : l'instant remis avant le tableau, la même
assertion sort en `1` sur `produit_ne_avant_le_tableau: [{"chemin":"README.md", …}]`.

**Le refus provoqué.** `r114` est le fil dont la trace ne porte aucun tableau : une seule ligne `| … |`
noyée dans de la prose, sans séparatrice. Demande-lui le verdict `conforme` :

```bash
node docs/device/harness/run.mjs receipt --run "$B/r114" --case "$CAS" --faits "$B/f114.json" --verdict conforme
```

```text
REFUS — receipt : verdict « conforme » refusé, le verdict suit la preuve (§7) : la session n'a rien produit :
le produit est sa sortie brute (§9) ; la trace ne porte aucun tableau rendu par la session (§5, F2)
→ exit 1
```

Le reçu nomme **tout** ce qui mord, pas seulement le tableau : cette fixture ne produit rien, donc la
condition du §9 s'ajoute à F2. `r115`, un tableau de deux lignes, rend le même refus mot pour mot ; `r116`
porte une écriture au message 2 et le tableau au message 3 (`une écriture précède le tableau : seq 2, outil
« write_file »`) ; `r117` un produit né avant lui (`un produit est né avant le tableau : README.md`). Seul
le numéro du dossier change. Avec `--verdict "non concluant"`, les quatre s'écrivent (`rc=0`) et gardent ce
qui mord : `tableau_absent: true` pour `r115`, l'écriture au `seq 2` pour `r116`, le produit `README.md`
pour `r117`. Le refus vient du **verdict**, jamais du champ : un reçu peut porter `tableau_absent: true` et
un verdict `non concluant` sans mentir.

**Ce que ce champ ne voit pas.** Une écriture faite par une commande de shell, ou par un outil dont l'entrée
ne nomme pas de chemin. Le contrôle 118 le mesure : `write_todos` (qui ne nomme pas de fichier) et un appel
d'outil sans nom précèdent le tableau, et le reçu écrit deux limites au lieu de conclure à un ordre propre,
`l'ordre écriture/tableau n'est pas mesurable : la trace ne porte pas le nom des outils (H6)` et `outil(s)
dont le nom évoque une écriture et qui ne nomment aucun chemin : write_todos … (H6)`. Et un tableau forgé
dans la trace passe, comme le reste de l'export : la racine de confiance reste la base du client, ce que dit
[ADR-035](../DECISIONS.md).

**Le mot que ce chapitre installe : tableau.** Le bloc d'au moins trois lignes, à séparatrice, rendu dans
une part `text` par un message `assistant`, et son instant. Il n'atteste pas que ce qu'il affiche est vrai :
il atteste **quand** il a été rendu, et c'est cet instant que F1 et F2 datent.

## 5. Lire le cas jouet, du texte remis aux deux refus

Le cas jouet est le seul cas du dépôt dont les arbres se reconstruisent par une commande : deux dépôts de
deux fichiers, un commit chacun, dates et signatures figées, donc les mêmes têtes sur toute machine
([ADR-036](../DECISIONS.md)). Sa demande tient en 50 lignes et son attendu en 55 depuis le 2026-10-22, son
gel ne référence aucun fichier du framework. Il a été ouvert **une fois**, le 2026-10-20, par le premier run opencode réel : le
gel est daté du 2026-10-18 à 08:57:47, le budget de deux échanges a été consommé en entier, et le run a
laissé un `receipt.json` (`non concluant`). Ce chapitre le traverse : la phrase remise à la session, le
playbook qu'elle nomme, le run réel, puis les deux refus qui tuent l'ordre promis, F2 et F1.

**Le texte remis.** Le §5 de la demande est ce que la session lira, une fois `$RACINE` substitué par la
racine que le gel déclare — la dérivation est celle du harnais (`texteDuCas`, `run.mjs`), recopiée ici pour
être lue sans session :

```bash
cd /home/giak/projects/aidd-device
J=2026-10-18-085308-cas-jouet
RACINE=$(node -e 'process.stdout.write(require("./docs/device/CASES/'"$J"'.freeze.json").racine_espace_de_travail)')
sed -n '/^<<<DEMANDE$/,/^>>>DEMANDE$/p' "docs/device/CASES/$J.request.md" | sed '1d;$d' | sed "s|\$RACINE|$RACINE|g"
```

Sortie observée le 2026-10-18, une ligne :

```text
Read the mini playbook at /home/giak/projects/aidd-device-work/2026-10-18-085308-cas-jouet/framework-origin/PLAYBOOK.md and apply it to this repository, which has no notes yet.
```

La porte sait confronter exactement cette chaîne (`preflight --texte`, `run.mjs`) et le reçu la redérive : une
porte qui aurait remis un autre texte est refusée. Un mot de plus dans la phrase, et ce n'est plus le cas.

> **2026-10-22.** La phrase a gagné une seconde ligne, « Stay inside this repository: do not list or read its
> parent folder, its siblings, or anything above `$RACINE/2026-10-18-085308-cas-jouet/.` », après le run où la
> session est montée jusqu'à `~/projects/aidd-device` ([ADR-060](../DECISIONS.md)). Le cas a été re-gelé
> (`27fb38ab`), et la sortie citée ci-dessus reste celle **observée le 2026-10-18** : la redériver aujourd'hui
> en rend deux lignes.

**Ce que la phrase demande.** Les deux arbres se reconstruisent dans un bac neuf, en une commande :

```bash
bash docs/device/CASES/2026-10-18-085308-cas-jouet-arbres.sh /tmp/jouet
```

```text
--arbre framework-origin=/tmp/jouet/2026-10-18-085308-cas-jouet/origine/framework --arbre terrain=/tmp/jouet/2026-10-18-085308-cas-jouet/origine/terrain
origine framework 1b3b632aa740e9f0882dc59959d8f6bdfa094b44
origine terrain   62c48e1646d1a35d16a607198c9efdb2d577d8a3
copies détachées  1b3b632aa740e9f0882dc59959d8f6bdfa094b44 / 62c48e1646d1a35d16a607198c9efdb2d577d8a3
```

Deux têtes, celles du gel, dans un bac qui n'est pas le tien : c'est le contrôle 119, deux bacs, mêmes têtes.
Le playbook, lui, tient en quatre lignes, et c'est le cas entier :

```bash
cat /tmp/jouet/2026-10-18-085308-cas-jouet/framework-origin/PLAYBOOK.md
```

```text
# Mini playbook

Read the repository before writing anything.
Show what you read as a table, one row per file, and wait for the operator.
Write one file only, where the operator asked, after the table is confirmed.
```

Trois règles, dans cet ordre, et le §6 de la demande en tire un seul fichier : `terrain/aidd_docs/NOTES.md`,
une ligne par règle. Relance la commande du script : elle refuse (`REFUS — /tmp/jouet/2026-10-18-085308-cas-jouet
existe déjà …`, `exit 1`, contrôle 120). C'est ce qui rend le gel du jouet stable : on ne réécrit pas des
arbres sous un gel.

**Le refus F2, la trace sans tableau.** Le dossier de banc du chapitre 1 suffit, comme au chapitre 4 ; s'il
est neuf, relance `bash docs/device/harness/banc-harnais.sh`. Le banc porte deux jumeaux du jouet, `r127` et
`r128` ; un bac d'avant les contrôles du jouet ne les porte pas (`ls "$B/jouet"` doit répondre `a b cases
r124 r127 r128 tableau.txt texte.txt trace`), et le reçu répondrait alors `aucun gel … lancer freeze d'abord`,
pas le refus promis ici. Demande `conforme` au premier :

```bash
B=/tmp/banc-harnais.XXXXXX        # ton dossier du chapitre 1
J=2026-10-18-085308-cas-jouet
node docs/device/harness/run.mjs receipt --run "$B/jouet/r127" --case "$J" \
  --cases "$B/jouet/cases" --faits "$B/jouet/r127/faits.json" --verdict conforme
```

```text
REFUS — receipt : verdict « conforme » refusé, le verdict suit la preuve (§7) : la trace ne porte aucun tableau rendu par la session (§5, F2)   → exit 1
```

Le refus s'imprime sur la sortie d'erreur : derrière un tube (`| tail`), il ne s'affiche pas, seul le code
le dit. Un seul motif, et le plus grave du cas : la pièce qui porte la promesse manque. Ce jumeau a un produit — le
`collect` l'a copié sous `raw/` — donc le refus ne dit rien de lui ; au chapitre 4 le même genre de refus
nommait deux causes à la fois, ici une seule mord, et le harnais ne nomme que ce qui mord.

**Le refus F1, le produit né avant le tableau.** Même commande, dans le même terminal (`$B` et `$J` viennent
du bloc précédent), dossier `r128` :

```bash
node docs/device/harness/run.mjs receipt --run "$B/jouet/r128" --case "$J" \
  --cases "$B/jouet/cases" --faits "$B/jouet/r128/faits.json" --verdict conforme
```

```text
REFUS — receipt : verdict « conforme » refusé, le verdict suit la preuve (§7) : un produit est né avant le tableau : NOTES.md (§5, F1)   → exit 1
```

F1 nomme le fichier, pas la promesse en général : `NOTES.md` est né avant l'instant du tableau. F2 dit
qu'aucun ordre n'est lisible ; F1 dit que l'ordre est lisible et qu'il est mauvais. Le même cas conclut
`conforme` quand le fil est propre — le contrôle 126 l'éprouve : le cas jouet n'est pas un cas qui échoue,
c'est un cas qui mord.

**Une honnêteté sur cette fixture.** `r128` ne restitue pas un ordre fautif qu'il aurait observé : le banc
écrit le produit, puis **recule** l'instant de sa naissance dans le manifeste de la copie sous `raw/`, à dix
secondes après le gel, pour que le tableau soit plus tard à coup sûr. Le `birth` du fichier est réel, l'ordre
ne l'est pas : la fixture dit « le contrôle voit un produit né avant le tableau », jamais « ce run a trahi la
promesse ». Même honnêteté qu'au contrôle 113 du chapitre 4, et même raison : un contrôle qui dépendrait du
chronomètre ne serait pas un contrôle.

**Le run réel du 2026-10-20.** La phrase ci-dessus a été remise une fois, à la session opencode
`ses_ea564a976ffevcpzB4aY03ELBF`, modèle `ollama/qwen3:8b`, ouverte dans `<W>/terrain`. Le reçu est
[receipt.json](../device/runs/2026-10-20-202333-50664060-1028c8b/receipt.json) : `session_verifiee.outil`
vaut `opencode`, `echanges` vaut `{budget: 2, utilises: 2}`, le produit collecté est `NOTES.md` mais sa
source est `terrain/aidldocs/NOTES.md`, pas `terrain/aidd_docs/NOTES.md`. Le verdict est `non concluant`,
avec une seule limite, `tableau_absent` (le tableau d'une colonne du chapitre 4, avant l'ADR-047) ; depuis
l'ADR-047, un rejeu sur une copie des pièces rend `tableau.present: true` et `colonnes: 1`. L'output du
juge est [output.json](../device/runs/2026-10-20-202333-50664060-1028c8b/output.json).

Deux limites de ce run, nommées et non corrigées : le produit n'est pas au chemin attendu, et les trois
gestes ont été faits par l'agent via l'API HTTP d'opencode, pas par une personne devant l'interface. Le
reçu atteste donc une session réelle et une trace exportable ; il n'atteste pas le parcours humain du
guide utilisateur au sens littéral.

**Ce que ce cas n'est pas.** Avant ce run, aucune session n'avait reçu la phrase ci-dessus : le banc
fabrique ses fils (`--par banc`, témoignage « banc : aucune session ouverte »), et un reçu du jouet du banc
dirait `banc` et `aucun`, comme celui du chapitre 1. Le run réel, lui, porte `opencode` et son modèle. Le cas
ne juge pas le contenu des notes : l'attendu écarte explicitement « le contenu des notes est juste ». Et il
n'est publié nulle part : le gel porte `refs_distants` vide sur ses deux origines, donc un inconnu ne le
clone pas, il le reconstruit par son script ; et c'est cela que le cas achète, la chaîne entière
traversable sans projet réel.

**Le mot que ce chapitre installe : cas jouet.** Un cas dont les deux arbres se reconstruisent à l'identique
et dont les pièces tiennent sur une page ; il atteste que la chaîne tourne de bout en bout, jamais qu'une
session a travaillé.

## 6. Ce que cette version ne fait pas

- **Elle ne mène pas de run elle-même.** Le chapitre 1 lit un reçu de banc, pas un reçu de run ; le
  chapitre 5 cite le premier reçu réel, écrit le 2026-10-20 par le run opencode du cas jouet, et il est le
  seul à porter un `porte` venu d'une session.
- **Elle ne couvre que quatre pièces sur sept.** Le parcours du plan en compte sept ; écrire les trois
  autres demande une session ou une décision (les quatre arbres, la session et sa trace, mener un run
  entier). Le cinquième chapitre ferme un autre manque du plan — un cas montrable — sans couvrir une pièce
  de plus. Reste ouverte la mesure du lecteur. La section 14 du plan tient la liste.
- **Elle ne mesure pas son lecteur.** Les seuils du plan, son protocole à trois lecteurs et ses 40 minutes
  restent des hypothèses : personne n'a encore suivi cette page. Une lecture **interne**, faite par son auteur
  le 2026-10-18, a éprouvé autre chose que la compréhension : les cinq gestes du chapitre 5, extraits des
  octets de ce fichier et exécutés dans un seul terminal, rendent caractère pour caractère les blocs cités —
  cinq accords, les deux refus en `exit 1`, 0,35 s. Elle a trouvé un piège réel, corrigé ici : un dossier de
  banc d'avant les contrôles du jouet ne porte pas les jumeaux et rend un autre refus. Ce n'est pas un
  lecteur : l'auteur connaît la page, et des commandes qui passent ne disent rien de ce qui se comprend.
- **Elle ne juge pas la qualité du cas.** Rejouer un gel dit que le texte scellé est intact, jamais qu'il
  est bien écrit.

## 7. Où sont les sources

| Ce que tu viens de faire | Où c'est écrit | Ce qui y est plus complet |
| --- | --- | --- |
| lire un reçu | [ARCHITECTURE.md](../ARCHITECTURE.md), § vie des artefacts | le rôle de chaque pièce dans la chaîne de preuve |
| provoquer un refus | [BANC.md](../device/BANC.md) | les 236 contrôles, leurs noms, et ce qu'ils ne prouvent pas |
| lire un tableau | [ADR-035](../DECISIONS.md), [spec H6](../tasks/2026_10/2026-10-17-140536-durcissement-du-recu/2026-10-18-071627-spec-h6.md) | la forme retenue, la base mesurée de l'acte d'écriture, et ce que H6 ne mesure pas |
| rejouer un gel | [REPLAY.md](../device/REPLAY.md) | la recette depuis un clone neuf, et ses quatre limites |
| mener un run | [la conduite](../tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md) | les six gestes, dans l'ordre, avec leurs valeurs attendues |
| écrire un cas | [la spec du run](../tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-130103-spec.md) | la demande, l'attendu, le gel, les falsificateurs |
| lire le cas jouet | [la demande](../device/CASES/2026-10-18-085308-cas-jouet.request.md), [l'attendu](../device/CASES/2026-10-18-085308-cas-jouet.expected.json), [son script](../device/CASES/2026-10-18-085308-cas-jouet-arbres.sh) | les deux arbres reconstruits à l'identique, les cinq falsificateurs, le budget de deux échanges, et ce que le cas écarte |
