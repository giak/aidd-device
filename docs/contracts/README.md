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
noyau tel quel ; chaque `SKILL.md` reprend un bloc et le rend lisible par le chargeur, donc
avec un frontmatter `name` et `description` — que la source porte comme une phrase de tête
et non comme du YAML.

Quand le contrat change, on modifie la source, puis on réécrit les quatre fichiers. Cette
synchronisation se fait à la main. Aucun outil ne la contrôle : c'est délibéré. La règle du
dépôt l'impose — *« no script, no hook, no CI by default: a mechanical check is earned by
demonstrated drift, never promised »* — et le coût est assumé. Un jour où la source et un
artefact divergent pour de bon, un contrôle se justifiera. Pas avant.

## Candidats

[`candidat/v13.md`](candidat/v13.md) est **le texte appliqué** : `AGENTS-source.md` est ce fichier,
octet pour octet (`cmp`, 2026-10-15), et les quatre artefacts ont été réécrits le même soir à
partir de lui. Mesure : source 13 742 caractères / 3 197 jetons `o200k` contre 14 181 / 3 302 avant
application, noyau 1 768 jetons contre 1 835, sans règle perdue.

[`candidat/v12.md`](candidat/v12.md) et [`candidat/v11.md`](candidat/v11.md) restent comme étapes de
la campagne : v12 ne gagne pas un jeton sur l'ancienne source, v11 en coûte 79 de plus au fichier.
Rien n'y est réédité.

Le raisonnement de chaque candidat est à part, [`candidat/v13-analyse.md`](candidat/v13-analyse.md),
[`candidat/v12-analyse.md`](candidat/v12-analyse.md) et [`candidat/v11-analyse.md`](candidat/v11-analyse.md),
pour que le candidat reste un livrable et non un rapport sur lui-même. Cette séparation n'est pas
cosmétique : un livrable qui contient le commentaire qu'on fait sur lui-même n'est plus lisible
comme un livrable.

[`candidat/2026-10-15-215612-veille-compression.md`](candidat/2026-10-15-215612-veille-compression.md)
mesure l'état appliqué, rapporte ce que la veille change aux trois analyses et chiffre les leviers
restants, dont un seul est encore ouvert : différer `AUDIT`, `RECOVERY` et `STOP` dans un skill.

[`candidat/2026-10-15-220849-relecture-contrat-applique.md`](candidat/2026-10-15-220849-relecture-contrat-applique.md)
audite le texte appliqué énoncé par énoncé contre le texte d'avant application (revue interne) :
aucun devoir perdu, trois écarts non documentés, dont un appelant une décision.

## Ce qu'un tiers peut vérifier lui-même

Les commandes ci-dessous sont écrites ici, jamais committées comme script, hook ou CI : la règle du
dépôt veut qu'un contrôle mécanique soit mérité (ADR-004), et rien dans l'arbre ne les exécute. Le
2026-10-15 elles ont été lancées telles quelles, sur cette machine, et ont rendu quatre `diff` muets
et trois « identique ». Une commande non lancée n'a pas sa place ici.

Prérequis : `awk`, `sed` et GNU coreutils (`head -n -2`). Pour le compte de jetons, `python3` avec
`tiktoken`.

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