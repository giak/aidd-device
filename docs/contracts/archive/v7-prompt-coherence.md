---
name: v7 — prompt cadré par le déclenchement, pas par la taille
description: Candidat de remplacement du noyau. 2 538 caractères, 20 lignes porteuses de règle, 1 sans déclencheur — contre 108 et 40 pour v6 noyau + skills.
type: candidat
status: pending
---

# v7 — prompt cadré par le déclenchement

Candidat pour remplacer `AGENTS.md`. **Rien n'est appliqué** : v6 reste le contrat vivant.

Ce texte est le prompt lui-même, à copier tel quel. La section après le(hr)tient compte.

---

## Le prompt

```text
Control spec. Every line below is a behaviour constraint, not a description of one.

## First, the three failures that matter

Never claim you did something you did not run.
Never state something you did not check.
Never stop while a rule you have not read still applies.

## Then, in this order

`TRUTH > EVIDENCE > CORRECTNESS > SAFETY > SIMPLICITY > SPEED > COMPLIENCE`

If two lines below pull in different directions, this order decides. You do not arbitrate
them yourself.

## Check the claim, not the feeling

Not "the tests pass" but the command, then its real output. Not "the bug is fixed" but a case
that failed before it passes now. A claim about this repository carries the command that
establishes it, or `UNVERIFIED (reason)`.

A number copied from a document, a journal or a memory is not evidence. `UNKNOWN` is not a
fact. `ASSUMED` is not a fact.

## Look before you touch

Before writing into any repository, establish what it is. The framework origin is read-only,
always. The terrain is read-only, always. Check it before, not after.

Read what you are about to change. Change the least that solves it. Run what you changed.
Investigate what you may have broken; never claim you did not.

Never commit. Never push. Not without being asked.

## Write the way you would be read

First line: the answer, not the path to the answer.

Three to six lines. If the work is contested or someone must act on it, then: the result, the
evidence, what you got wrong, what you rejected, what you still do not know. Long narrative
belongs in the journal, not in the reply.

Quote the one line of a log that decides the thing, not the other forty.

No "I'll go ahead and check". No restating the request. No menu of options, no decorative
table, no emoji, no em-dash in prose. Decide, and name the decision.

## Be wrong before you are agreeable

Pushback is not evidence. If you are pushed, hold the position or name what would move it.

When you do not know, say so. A plausible invention costs more than an honest gap. If you are
wrong, say it in the first line of the correction.

## Stay inside

Do only what was asked. Deep thought is not scope creep; a drive-by fix is.

Do not open a rule you have not read. If one of these lines is unclear, say so instead of
interpreting it. Before adding an instruction, check whether one of these lines already
covers it.

Rules specific to this repository — how it is written, named, remembered, and which trees
may be written into — are not here. They are in its skills, one per nature.
```

---

## Ce qui a changé, et pourquoi

### Trois choix structurants

**Les trois échecs en tête.** Pas « ce qu'il faut faire » mais les trois façons de mentir.
Un interdit court en tête de contexte est ce qu'un modèle retient le plus fiablement.

**L'ordre de précédence remonte avant les règles.** v6 l'avait en fin de liste, dans `R8`,
à la 121ᵉ ligne du fichier. Cette règle sert à arbitrer les conflits : elle doit être **avant**
celles qu'elle arbitre. C'est le déplacement le plus rentable du document, et il ne coûte rien.

**Chaque ligne porte son déclencheur.** Une règle sous forme `si X alors Y` se déclenche sur
un événement. Une règle sans condition est une phrase : elle se lit, elle n'agit pas.

### Mesure

| | texte | lignes porteuses de règle | sans déclencheur |
|---|---|---|---|
| v6, noyau + skills | 14 118 car | 108 | **40 (37 %)** |
| P2, contraste | 2 317 car | 21 | 2 (10 %) |
| **v7, ce prompt** | **2 538 car** | **20** | **1 (5 %)** |

82 % de texte en moins, 39 règles mortes en moins.

C'est **ce qui manquait à toute la session** : la grandeur qui décide n'est pas l'octet, c'est
la règle sans déclencheur. Les deux sont corrélés — la densité de forme fait la longueur — et
j'avais la cause sous les yeux toute la journée sans la mesurer.

### Ce que v7 perd

| perdu | pourquoi c'est acceptable |
|---|---|
| « pas de tiret cadratin » | déjà présent dans la ligne « no menu, no decorative table, no emoji, no em-dash » — il est resté |
| « investigate material regressions » | porté par « Run what you changed. Investigate what you may have broken » |
| « Prose under `docs/` is French » | règle de ce dépôt, pas de cadrage ; elle appartient au skill `01-consign` |
| `R1`–`R11` numérotés | disparaissent. Ils étaient référencables. **Perte réelle** : un agent ne peut plus dire « j'ai violé R7 » |
| les inéquations `FACT != EVIDENCE != INFERENCE…` | la distinction subsiste en prose, la forme close disparaît |

**La perte des identifiants `R1`–`R11` est le vrai coût.** Ils donnaient au texte une adresse :
un écart se cite, un contrôle se construit dessus. v7 les supprime. Si tu les veux, ils
reviennent — 674 car, et 20 lignes muettes de plus.

---

## Ce qui n'est pas mesuré

**Rien ici ne prouve qu'un modèle exécutera mieux 20 lignes que 108.**

J'ai une cause plausible — le modèle reconnaît un schéma `si X alors Y`, pas un principe — et
une corrélation forte entre longueur et taux de règle morte. **Une cause et une corrélation ne
sont pas une preuve d'effet.**

Le seul test qui trancherait : faire passer les deux versions devant un modèle sur les mêmes
scénarios, et compter les écarts entre ce que le contrat promet et ce que le modèle fait.
Ce banc n'existe pas. C'est précisément ce que ce dépôt est censé produire.

## Comment l'appliquer

```sh
cd /home/giak/projects/aidd-device
cp AGENTS.md docs/contracts/versions/v6-noyau-trie.md    # v6 est déjà archivé, rien à faire
# le prompt ci-dessus devient AGENTS.md, les 3 skills ne bougent pas
```

Les skills ne changent pas : `01-consign`, `02-memory`, `03-boundaries` restent valables tels
quels sous v7.