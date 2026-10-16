# docs/contracts

Un contrat, un document, quatre fichiers. Chaque dossier ici contient **une seule chose**.

## Ce qui fait foi

[`AGENTS-source.md`](AGENTS-source.md) est **la source** : le contrat entier, écrit une fois,
en un seul document continu.

```
# AGENT            9 sections  →  AGENTS.md
# SKILLS           3 blocs     →  .agents/skills/<id>/SKILL.md
  ## 01-consign     description + CONSIGN + NAMING
  ## 02-memory      description + MEMORY
  ## 03-boundaries  description + TERRITORY
```

Ce document ne contient aucun marqueur, aucun commentaire, aucun frontmatter, aucune
convention de découpage. Il se lit comme le contrat se veut : d'un bout à l'autre. La
frontière entre le noyau et les skills est le titre `# SKILLS`, rien de plus.

Les fichiers livrés sont écrits à la main à partir de ce document. `AGENTS.md` reprend le
noyau tel quel ; chaque `SKILL.md` reprend un bloc et porte, comme le veut la convention des
skills dont ce dépôt suit la forme, un frontmatter `name` et `description` — que la source
porte comme une phrase de tête et non comme du YAML.

Ce frontmatter est écrit **pour un chargeur**, et ce dépôt n'en porte aucun : ADR-012 le dit
(« faute de chargeur on-demand dans ce dépôt ») et l'[audit de la
couture](candidat/2026-10-16-070456-audit-couture-noyau-skills.md) §`F4` le mesure. Le client,
lui, n'est pas mesuré (`OPEN`) : la seule voie de découverte **observée** ici est la phrase du
préambule d'`AGENTS.md`, qui nomme les trois skills et demande de les lire. Un agent qui ne suit
pas cette phrase ne les lit pas.

Quand le contrat change, on modifie la source, puis on réécrit les quatre fichiers. Cette
synchronisation se fait à la main. Aucun outil ne la contrôle : c'est délibéré. La règle du
dépôt l'impose — *« no script, no hook, no CI by default: a mechanical check is earned by
demonstrated drift, never promised »* — et le coût est assumé. Un jour où la source et un
artefact divergent pour de bon, un contrôle se justifiera. Pas avant.

## Candidats

[`candidat/v19.md`](candidat/v19.md) **attend un arbitrage** : c'est le contrat écrit en **DSL**, un
appareil de notation fait de mots-clés en capitales, de `→`, `|`, `&`, `!` et de la seule grammaire
retirée. Mesure contre le texte appliqué : noyau **1 777 → 1 599 jetons (−10,0 %)**, **par tour au repos
1 967 → 1 776 (−9,7 %)**, contrat entier 3 170 → 2 921, caractères 13 750 → 11 927 (−13,3 %). Il porte
une légende de **32 jetons** (`OUTPUT` R5 l'exige) ; sans elle le tour tombe à **1 744**, au prix d'une
règle violée. [`candidat/2026-10-16-074335-v19-analyse.md`](candidat/2026-10-16-074335-v19-analyse.md)
donne la mesure appareil par appareil : la jointure `_`, les parenthèses d'appel et `NO_REGRESSION`
**coûtent** des jetons (8 contre 4, 4 contre 2, 4 contre 2), la barre paie et la flèche est neutre ; le gain
vient de la grammaire retirée, pas des glyphes. Couverture : `78` puces sur `83` au-dessus de 60 % de
mots retrouvés, les cinq autres entièrement littérales et vérifiées au `grep`. **La relecture règle par
règle n'est pas faite** : c'est la faiblesse nommée du candidat.

[`candidat/v17.md`](candidat/v17.md) est le brouillon du DSL et [`candidat/v18.md`](candidat/v18.md) la
mesure qui a condamné ses appareils coûteux. L'analyse de `v17` affirmait « v17 = v15 + DSL, une seule
variable » : **faux, mesuré** — `v17` reprend aussi le bloc d'en-tête de `v16`. La grandeur attribuable
au DSL seul est celle de `v18`/`v19`.

[`candidat/v16.md`](candidat/v16.md) **attend un arbitrage**, sur un autre axe (la structure, pas la
notation). Il applique le paquet chiffré par
[l'étude KERNEL](candidat/2026-10-16-071827-etude-compression-symbolique-kernel.md) : la phrase de renvoi
devient une règle de **propriété** et de **précédence** (`A`), une règle nouvelle refuse de faire
semblant quand un propriétaire est illisible (`B`), `AUDIT`;`RECOVERY`;`STOP` sortent du noyau dans un
quatrième skill `04-recovery` (`C`), et la phrase de tête de `02-memory` cesse de recopier ses règles
(`D`, conséquence de `A`). Mesure : noyau **1 777 → 1 669 jetons (−108, −6,1 %)**, **par tour au repos
1 967 → 1 885 (−82, −4,2 %)**, contrat entier 3 170 → 3 285 (**+115**), `83` puces de v15 sur `83`
retrouvées mot pour mot, `0` perdue, `1` nouvelle. Le prix : `C` ne vaut que si un chargeur existe, et
`A` nomme quatre dossiers quand `INVARIANTS` l.23 interdit de nommer le mécanisme.
[`candidat/2026-10-16-073347-v16-analyse.md`](candidat/2026-10-16-073347-v16-analyse.md) dit le reste :
la réconciliation par opération, et le jeton d'écart qui reste `OPEN`.

[`candidat/v15.md`](candidat/v15.md) est **le texte appliqué** : `AGENTS-source.md` est ce fichier,
octet pour octet (`cmp`, 2026-10-16), et les quatre artefacts ont été réécrits depuis lui. Mesure :
source 13 659 caractères / 3 170 jetons `o200k`, noyau **1 777** jetons. v15, c'est v14 moins le
paragraphe de tête du bloc `# SKILLS` (« Ce qui ne décrit que ce dépôt. Chargé à la pertinence… ») :
**−36 jetons**, et **aucun artefact ne bouge** (`sha256sum -c` sur les quatre, identiques). Le
retrait rend vraie la phrase de ce README — « la frontière entre le noyau et les skills est le titre
`# SKILLS`, rien de plus » — et ne perd aucune règle : la convention de nommage que portait le
paragraphe est le tableau ci-dessus.

[`candidat/v14.md`](candidat/v14.md) reste comme l'étape précédente : les quatre réparations du delta,
`F2` (+5), le verbe de la règle d'ADR-010 (+2), `F1` (+1), `F3` (+1), **+9** jetons ; source
13 797 caractères / 3 206 jetons, noyau 1 777.
[`candidat/v14-analyse.md`](candidat/v14-analyse.md) dit ce qu'il ne répare pas, et pourquoi — avec un
chiffre faux, relevé par l'audit antagoniste : le « +3 jetons » de « the required capability » est
mesuré à **+2**.

[`candidat/v13.md`](candidat/v13.md) reste comme l'étape précédente : la compression de la campagne,
source 13 742 caractères / 3 197 jetons contre 14 181 / 3 302 avant application, noyau 1 768 contre
1 835. [`candidat/v12.md`](candidat/v12.md) et [`candidat/v11.md`](candidat/v11.md) restent comme
étapes : v12 ne gagne pas un jeton sur l'ancienne source, v11 en coûte 79 de plus au fichier. Rien
n'y est réédité.

Le raisonnement de chaque candidat est à part,
[`candidat/v13-analyse.md`](candidat/v13-analyse.md), [`candidat/v12-analyse.md`](candidat/v12-analyse.md)
et [`candidat/v11-analyse.md`](candidat/v11-analyse.md), pour que le candidat reste un livrable et
non un rapport sur lui-même. Cette séparation n'est pas cosmétique : un livrable qui contient le
commentaire qu'on fait sur lui-même n'est plus lisible comme un livrable.

[`candidat/2026-10-15-215612-veille-compression.md`](candidat/2026-10-15-215612-veille-compression.md)
mesure l'état appliqué, rapporte ce que la veille change aux trois analyses et chiffre les leviers
restants, dont un seul est encore ouvert : différer `AUDIT`, `RECOVERY` et `STOP` dans un skill.

[`candidat/2026-10-15-220849-relecture-contrat-applique.md`](candidat/2026-10-15-220849-relecture-contrat-applique.md)
audite le texte appliqué énoncé par énoncé contre le texte d'avant application (revue interne) :
aucun devoir perdu, **neuf trouvailles** dont trois réserves, dont une (`F2`) appelant une décision.
Sa base était une **reconstruction** de ce texte, la relecture croyant l'original perdu. Ce résumé a
dit « trois écarts » jusqu'au 2026-10-16, confondant les réserves et les trouvailles : la relecture
titre « Les neuf trouvailles » et écrit que les trois analyses antérieures n'en annonçaient aucune.

[`candidat/2026-10-15-223732-delta-v13-contre-etat-avant-application.md`](candidat/2026-10-15-223732-delta-v13-contre-etat-avant-application.md)
compare l'état appliqué à celui qu'il remplace, règle par règle : gains mesurés, pertes, régressions.
Sa base n'est pas une reconstruction mais le commit `3b54711`, qui porte la source d'avant application
et ses quatre artefacts ; c'est lui qui corrige la prémisse de la relecture, et qui rend les 18 lignes
d'écart entre ses 229 lignes de diff annoncées et les 211 mesurées.

[`candidat/2026-10-16-063502-audit-v14-service-du-projet.md`](candidat/2026-10-16-063502-audit-v14-service-du-projet.md)
mesure le contrat corrigé contre l'arbre du projet : foyers non nommés, `docs/archive/` nommé mais
absent, faille de `BOUNDARY` §8 non couverte par un skill, contradiction avec ADR-012, doublon
`v14.md` ↔ `AGENTS-source.md`, et six réparations chiffrées, **non appliquées**.

[`candidat/2026-10-16-064440-audit-antagoniste.md`](candidat/2026-10-16-064440-audit-antagoniste.md)
l'attaque : dix-sept objections contre l'audit, les analyses et le delta, chacune avec son verdict —
quatre chiffres ou comptes tombent, une réparation proposée est contredite par le contrat lui-même,
quatre constats sont affaiblis, deux ne sont pas tranchables, six tiennent. Il dit aussi ce qu'aucun
de ces documents ne peut établir, et se corrige deux fois lui-même (§4bis).

[`candidat/2026-10-16-070456-audit-couture-noyau-skills.md`](candidat/2026-10-16-070456-audit-couture-noyau-skills.md)
audite la **couture** entre le noyau et les trois skills, c'est-à-dire ce que la découpe fait au
contrat. Aucune régression de règle : 9 sections dans `AGENTS.md` plus 4 dans les skills font 13, et le
texte appliqué est identique à `AGENTS-source.md` (une ligne vide de `diff`, et le niveau de titre des
blocs, que le contrôle n° 2 ci-dessous normalise). Ce qui est perdu, ce sont des garanties : sept
constats — trois manques, une dépendance, trois effets de bord — plus une tension sur le commit
antérieure à la découpe. **43 % du contrat** (1 389 jetons sur 3 166) vit derrière un pointeur en
prose, dans un dépôt sans chargeur ; le noyau emploie « in its home », que seul `01-consign` définit ;
et la loi `MEMORY`, que `~/.AGENTS.md` impose déjà à tous les projets, a maintenant trois maisons.
Aucun de ces constats n'est réparé : quatre demandent une décision de forme, le cinquième demande soit
un chargeur soit l'acceptation écrite du pointeur.

[`candidat/2026-10-16-071827-etude-compression-symbolique-kernel.md`](candidat/2026-10-16-071827-etude-compression-symbolique-kernel.md)
étudie ce que `KERNEL.md` du projet `truth-engine` apporte à la compression : rien en notation, tout en
structure. KERNEL n'est pas un contrat compressé mais un appareil **17,4 fois plus gros** (241 028 octets
contre 13 823) payé par un vérificateur de 5 741 lignes ; ses symboles ne valent que parce qu'un
exécuteur les lit, et chez nous la compression de texte est mesurée comme épuisée (MCO −0,2 % sur un
noyau de 145 caractères par puce). Quatre dispositifs sont chiffrés sur nos fichiers : propriété +
précédence (**+14 j**, contre la phrase de renvoi de 67 j), échec de lecture (**+36 j**, une règle que
nous n'avons pas), chargement par module (**−137 j nets**), registre + porte (non chiffré, dossier
ADR-004).

## Ce qu'un tiers peut vérifier lui-même

Les commandes ci-dessous sont écrites ici, jamais committées comme script, hook ou CI : la règle du
dépôt veut qu'un contrôle mécanique soit mérité (ADR-004), et rien dans l'arbre ne les exécute. Le
2026-10-15 elles ont été lancées telles quelles, sur cette machine, et ont rendu quatre `diff` muets
et trois « identique ». Une commande non lancée n'a pas sa place ici.

Prérequis : `awk`, `sed` et GNU coreutils (`head -n -2`). Pour le compte de jetons, `python3` avec
`tiktoken`.

Relancées le 2026-10-16 après l'application de v14 : mêmes résultats, quatre `diff` muets et trois
« identique », et cette fois `git status` ne voit **aucun** `SKILL.md` modifié — les quatre
réparations tombent dans le noyau, pas dans les blocs.

**1. Le noyau de la source est `AGENTS.md`, à l'octet.**

```bash
sed -n '1,/^# SKILLS$/p' docs/contracts/AGENTS-source.md | head -n -2 > /tmp/noyau.md
diff /tmp/noyau.md AGENTS.md
```

**2. Chaque bloc de la source est son `SKILL.md`, hors frontmatter et niveau de titre.**

```bash
for id in 01-consign 02-memory 03-boundaries; do
  awk -v id="$id" '$0=="## "id{p=1;next} p&&/^## /{p=0} p' docs/contracts/AGENTS-source.md \
    | sed -n '/^### /,$p' | sed 's/^### /## /' \
    | awk 'NF{n=NR} {l[NR]=$0} END{for(i=1;i<=n;i++) print l[i]}' > /tmp/blk.md
  tail -n +5 .agents/skills/$id/SKILL.md > /tmp/art.md
  diff /tmp/blk.md /tmp/art.md
done
```

**3. La `description` du frontmatter est la phrase de tête du bloc.**

```bash
for id in 01-consign 02-memory 03-boundaries; do
  src=$(awk -v id="$id" '$0=="## "id{inb=1;next} inb&&/^## /{inb=0} inb&&/^### /{exit} inb&&NF{printf "%s ",$0}' docs/contracts/AGENTS-source.md)
  fm=$(grep -m1 '^description: ' .agents/skills/$id/SKILL.md | sed 's/^description: //')
  [ "${src% }" = "$fm" ] && echo "$id : identique" || echo "$id : ecart"
done
```

**4. Le coût, si l'encodeur est là** (facultatif ; 3 197 jetons `o200k` attendus le 2026-10-15) :

```bash
python3 -c "import tiktoken; print(len(tiktoken.get_encoding('o200k_base').encode(open('docs/contracts/AGENTS-source.md').read())))"
```

**Ce que ce contrôle prouve, et ce qu'il ne prouve pas.** Il prouve que les quatre artefacts
correspondent à la source pour l'état de l'arbre où il tourne. Il ne prouve pas que le contrat est
suivi, ni que la source dit ce qu'elle devrait dire : c'est une mesure de correspondance, pas de
comportement. Si un `diff` sort quelque chose, la source fait foi : l'artefact est réécrit, jamais
l'inverse.

## Archive

[`archive/`](archive) — tout ce qui a servi et ne sert plus : versions `v0` à `v9`, rapports
de sessions, une référence de comparaison. Rien n'y est réédité.

`archive/migration-2026-10-15-absorber-artefacts.cjs` reconstituait la source depuis les
artefacts. Il inverse le sens d'autorité et **ne doit pas être relancé** : l'édition serait
écrasée. Conservé comme trace.