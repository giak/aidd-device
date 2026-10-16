---
name: v14 — les quatre réparations du delta
description: Ce que v14 change à v13 (quatre réparations, +9 jetons), ce qu'il ne change pas, et les mesures qui l'établissent
type: analyse
status: done
---

# v14 : les quatre réparations du delta, et rien de plus

Ce fichier ne fait pas partie du contrat. Il note ce que v14 change, ce qu'il ne change pas, et
pourquoi. Le candidat lui-même est [le texte appliqué](v14.md).

---

## 0. D'où viennent ces quatre réparations

Le [delta du 2026-10-15-223732](2026-10-15-223732-delta-v13-contre-etat-avant-application.md) a
comparé v13 à l'état qu'il remplace et laissé quatre réparations chiffrées à décider. Le relecteur
a demandé la correction. v14 est exactement ces quatre réparations, et aucune autre : une correction
demandée n'autorise pas les corrections voisines.

## 1. Les quatre diffs, et leur prix mesuré

Chaque réparation a été appliquée à une copie d'`AGENTS.md`, puis le fichier entier a été compté en
`o200k`. Le prix est le delta du fichier, pas celui d'un fragment.

| # | réparation | avant → après | jetons |
|---|---|---|---|
| 1 | `F2` — le devoir rendu à `RECOVERY` | « … best effort + explicit limits. » → « … best effort + explicit limits. **Never invent missing information.** » | **+5** |
| 2 | le verbe de la règle d'ADR-010 | « A rule here neither clear nor specific … » → « A rule here **that is** neither clear nor specific … » | **+2** |
| 3 | `F1` — l'adverbe rendu | « Never describe, simulate … » → « Never **merely** describe, simulate … » | **+1** |
| 4 | `F3` — la condition rendue | « capability exists » → « capability **is available** » | **+1** |
| | | **total** | **+9** |

Mesure d'ensemble : source **3 197 → 3 206** jetons `o200k` ; noyau `AGENTS.md` **1 768 → 1 777**
(les quatre réparations tombent toutes dans le noyau, aucune dans les trois blocs). Les skills sont
inchangés, et c'est vérifié : après réécriture, `git status` ne les voit pas modifiés.

## 2. Ce qui n'est pas réparé, et pourquoi

Le delta nommait d'autres pertes. Elles ne sont pas dans v14 :

- **`F8`, la justification du commit** (« an uncommitted change is unfinished, so the request is part
  of consignment ») : c'est un *pourquoi*, pas un devoir. Le lien survit par `CONSIGN` « Only
  committed documents outlive memory ». Le rendre coûterait du budget sans ajouter d'obligation.
- **Les huit qualités d'`INVARIANTS`** (`pragmatic`…`reliable`) : le delta a établi qu'aucune
  n'énonçait d'obligation vérifiable. Les réintroduire coûte **18 jetons** (mesuré, six termes) pour
  du vocabulaire. Leur place serait le `# AGENT` de tête, pas `INVARIANTS`.
- **« named as one »** : la contrainte de nommage a un domicile partiel en `R2` (« what the agent
  writes is a reconstruction, never a source »). La rendre explicitement est une décision de fond,
  pas une réparation.
- **Les trois affaiblissements de forme** (`already`, `one`, `it happens to use`) : deux sont des
  pertes de précision négligeables, le troisième est plus strict que l'original.

Aucune de ces quatre lignes n'est un devoir perdu ou une phrase cassée : elles relèvent d'un
arbitrage, pas d'une réparation. Elles restent ouvertes.

## 3. Vérifié

- `cmp docs/contracts/candidat/v14.md docs/contracts/AGENTS-source.md` → identiques.
- Noyau de la source contre `AGENTS.md` → `diff` muet ; trois blocs contre les trois `SKILL.md` →
  trois `diff` muets ; trois `description` égales aux phrases de tête.
- Le diff v13 → v14 touche **quatre lignes**, et rien d'autre (`diff -u`, lu en entier).
- Jetons appliqués : source 3 206, noyau 1 777, skills 802 + 294 + 293 = 1 389.

## 4. Limites

- Mesure en `o200k_base`, pas dans le tokenizer du modèle servi : ordre de grandeur, pas valeur
  exacte.
- v14 corrige le texte, pas son application : rien ici ne dit qu'une règle est mieux *suivie*
  après qu'avant.
- Le choix « capability **is available** » garde la forme fragmentaire de v13 (« the required
  capability » serait plus fidèle, à +3 jetons). Il n'a pas été retenu : ce serait une cinquième
  réparation, non demandée.
