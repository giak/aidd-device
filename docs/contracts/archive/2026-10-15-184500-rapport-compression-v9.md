---
name: Rapport de compression v9 — 582 caractères gagnés, aucune règle perdue
description: Ce que v9 a coupé, comment, et ce que le contrôle a vérifié. Version compressée dans docs/contracts/v9-compresse.md.
type: audit
status: pending
---

# Rapport — v9 compressé

Le contrat compressé est dans **`docs/contracts/v9-compresse.md`**, seul, sans explication.
Ce document explique. Il n'est jamais lu par un agent.

`AGENTS.md` n'a pas été modifié. Le candidat attend une décision.

## La mesure

| | contrat actuel | v9 | delta |
|---|---|---|---|
| caractères | 7 915 | **7 333** | **−582 (−7 %)** |
| puces | 53 | 44 | −9 |
| sections | 9 | 9 | 0 |
| `R1` à `R11` | 11/11 | 11/11 | 0 |
| règles sans déclencheur | 14 | 7 | −7 |

Les 9 puces en moins ne sont pas 9 règles en moins : ce sont 9 fusions, chaque contenu
retrouvé dans la puce qui l'a absorbé. Contrôle automatisé : **15 puces de l'ancien fichier
passées au crible, 0 dont le contenu est introuvable.**

## Ce qui a été coupé, et comment

### Les neuf fusions

| ancien | devient |
|---|---|
| *Improve materially…* + *KISS·DRY·YAGNI…* + *Refactor only on demonstrated gain* | une puce INVARIANTS |
| *No sycophancy…* + *The user can be wrong…* | une puce INVARIANTS |
| *`FIRST PLAUSIBLE RESULT != CONCLUSION`.* + *If error could materially affect…* | une puce REASON |
| *Before modifying…* + *Make the smallest sufficient change* + *After changing, verify…* | une puce CHANGE |
| *Use orthogonal perspectives…* + *Preserve a disagreement…* + *Criticism volume…* | une puce AUDIT |
| *Never continue merely…* | fusionné dans STOP 1 |
| *Three levels, chosen by triage…* | réécrite, 676 → 601 car |
| *Independent review…* | *and never claimed* → *and never* |
| *Prose under `docs/` is French. Code…* | deux points → point-virgule |

Chaque fusion porte le contenu des deux puces. C'est le seul moyen de compressor sans perdre :
**répéter une information coûte, la dire une fois ne coûte rien.**

### La seule suppression

```coupé    pragmatic · efficient · robust · meticulous · reliable   (−47 car)
```

Cinq adjectifs. **Aucun ne commande une action, donc aucun ne déclenche quoi que ce soit.**
Ce sont des intentions, pas des règles — la catégorie exacte que le fichier s'interdit
lui-même : *« A rule here that is neither clear nor specific is deleted »*.

Ils sont supprimés ici. **Si tu les veux, ils reviennent : +47 car, et la compression passe
de −7 % à −6 %.**

### Les coupures de redondance

```changé   Control spec: every rule below is a behavioural constraint, not a description.
         Never merely describe, simulate or claim compliance; never execute an
         inapplicable rule; never invent capability, input, evidence, source,
         tool result, execution or verification.
         → Control spec: rules below are behavioural constraints, not descriptions.
           Never claim compliance you did not perform, never run an inapplicable
           rule, never invent a capability, input, evidence, source, tool result
           or verification.                                                    (−59 car)

changé   Every repository claim carries the command establishing it…
         → For every claim about the repository: the command that establishes it.
           A figure copied from a document is not evidence.                      (−24 car)
```

Les deux premiers gains viennent des **puces à continuation** de `VERIFY` : trois sous-lignes
indentées qui sont en réalité trois règles distinctes, et qui devenaient des puces
adressables sans rien retirer.

## Le déplacement le plus rentable

`R8` — l'ordre de précédence qui arbitre les conflits — était **à la 121ᵉ ligne**, au milieu
de la puce `R1`–`R11`. Dans v9 il est **la première règle d'`OUTPUT`** :

```
* `R8` conflicting solutions are ordered `TRUTH > EVIDENCE > VALID_REASONING > …`:
  when two rules here pull apart, this order decides, and you do not arbitrate it.
```

Une règle qui sert à arbitrer doit précéder celles qu'elle arbitre. Aucun octet gagné,
entièrement déplacé.

## Ce que v9 ne fait pas

Les 7 règles sans déclencheur qui restent sont des **chaînes fermées** — `FACT != EVIDENCE`,
`UNKNOWN is a knowledge level`, `Criticism volume ≠ evidence of quality`. Elles n'ont pas de
condition, et il n'y a rien à leur ajouter : leur forme même est le déclencheur. Elles sont
exemptes du défaut.

Donner un déclencheur explicite aux 7 autres coûterait **≈ +350 car** et ferait passer v9 à
**7 683 car** — soit *plus gros* qu'aujourd'hui avec 14 règles en plus qui déclenchent.

**C'est l'arbitrage que le candidat pose, et il n'est pas dans le fichier :** est-ce que 350
car valent 7 règles qui se déclenchent ?

## Appliquer

```sh
cd /home/giak/projects/aidd-device
cp docs/contracts/v9-compresse.md AGENTS.md
node tools/guard-agents.mjs docs/contracts/versions/v0-REFERENCE-v6.md   # refusera : 15 puces réécrites
node tools/bilan-pertes.mjs docs/contracts/versions/v0-REFERENCE-v6.md   # 0 disparue attendu
```

Les trois skills ne changent pas. Le garde refusera, **et il aura raison** : v9 réécrit, il ne
découpe pas. Le bilan, lui, doit dire 0 disparue — c'est lui qui distingue réécrire de perdre.