---
name: Étude — compression symbolique et méta-langage : ce que KERNEL apporte, ce qu'il coûte
description: KERNEL.md lu et mesuré, les dix tests de compression déjà passés sur ce contrat rappelés, et les quatre dispositifs réellement transférables chiffrés sur nos fichiers, charges comprises
type: veille
status: in-progress
---

# Étude : compression symbolique, heuristique et méta-langage

> 2026-10-16. Demande : « la compression sémantique, heuristique, symbolique, méta-langage cognitif afin
> de trouver les meilleures façons de compresser et optimiser ? Regarde et étudie KERNEL.md. »
> Source étudiée : `/home/giak/projects/truth-engine/truth-engine-v2/KERNEL.md` (797 lignes, 77 174
> octets, v2.10.7). Revue **interne** : même agent, même jour, aucun second relecteur.

## 1. Résultat

**KERNEL n'est pas une compression de contrat. C'est un appareil 17 fois plus gros que le nôtre, payé
par un vérificateur de 5 741 lignes.** 241 000 octets de contrat (KERNEL + ses modules possédés) contre
nos 13 823, plus 5 741 lignes de Python que nous n'avons pas. Sa densité n'est pas typographique : elle
vient de ce qu'un exécuteur lit ses symboles.

**Sur nos fichiers, la compression de texte est terminée et c'est mesuré** : des dix tests passés sur ce
contrat les 14 et 15 octobre, deux ont été retenus (la découpe, −27 % par tour ; le niveau 1 des
descriptions, −14 %), et l'écriture dense comme MCO ont rendu **−0,2 %** — parce qu'un contrat de
145 caractères par puce est au plancher. Ce qui reste n'est pas de la typographie, c'est de la structure,
et je chiffre quatre dispositifs de KERNEL : **+14**, **+36**, **−137** et un quatrième hors de portée
tant qu'ADR-004 n'est pas instruite.

## 2. Ce que KERNEL fait, mesuré

| | KERNEL | ce dépôt | ratio |
|---|---:|---:|---:|
| contrat (KERNEL + modules possédés) | 241 028 o | 13 823 o | **17,4×** |
| lignes de contrat | 3 339 | 146 | 22,9× |
| exécuteur | `tools/verify/verify.py` 2 747 l. + `tools/runtime/run_state.py` 2 994 l. | **aucun** | — |
| opérateurs de modalité nommés | 11, **229 occurrences** (`NEVER` 94, `ENFORCE` 29, `MUST` 25, `BLOCK_IF` 24, `CHECKPOINT` 16, `ON_FAIL` 12, `EMIT` 8, `FREEZE` 7, `BOUND` 6, `TARGET` 3, `DEGRADE_IF` 3, `PREFER` 2) | 0 nommé | — |

Compte des opérateurs : occurrences du nom encadré par un non-`[A-Z_]`. Le compte brut de sous-chaînes
en donnerait **246**, parce qu'il ramasse aussi les noms qui embarquent ces mots
(`CHECKPOINT_ORDER_OK`) ; le compte juste est **229**, et la règle est écrite ici pour que le chiffre
soit reproductible.

Ses cinq dispositifs, et ce que chacun règle :

1. **`PRECEDENCE`** — « KERNEL owns orchestration/state/persistence and cross-domain predicates; domain
   files own ontology/formula/format/operations. Conflict: domain authority wins its domain. »
2. **`EXTERNAL CONTRACT OWNERS`** — un tableau sujet → module, plus la règle : « Undefined-here domain
   symbol != undefined contract; NEVER duplicate or override owning module definition in KERNEL. »
3. **`MODULE FAILURE`** — `ON_FAIL[scheduled canonical @READ] → BLOCK_IF[MODULE_UNAVAILABLE:{f}]`, et
   « NEVER run a phase whose owning ontology/protocol/gate is unavailable. »
4. **Registre machine, jamais la prose** — l'état vit dans `RUN_STATE_PATH` (JSON atomique), les scores
   symboliques dans un bucket `symbols` (`run_state.py set-symbols`), et le verdict dans
   `.verify/result.json` : « a file cannot truthfully certify its own successful write before that write
   occurs », `DELIVERY_STATE := runtime/external verification state only`.
5. **Porte externe** — `PRE_GATE_VERIFY` → `DELIVERY_GATE_VERIFY`, avec parité exigée entre l'appareil et
   l'état (`verify.py:R2C0` doit égaliser `run_state.BUNDLE_REVISION`, test `tests/test_verify_gate.py`).

**Le point décisif : ses symboles sont lus.** La veille du 2026-10-15 a déjà écrit la conclusion, sur
d'autres sources : un DSL de contraintes ne paie pas parce qu'un LLM le décode, il paie parce qu'un
**vérificateur** le lit (AgentSpec et al., 88-100 % de conformité déclarée). KERNEL est cette moitié-là
du couple, avec ses 2 747 lignes de vérificateur. Sans elles, ses 229 opérateurs seraient de la notation
privée, et la littérature sur la fidélité par opérateur (26 % à 98 % selon le modèle, proche de zéro
pour les 7B-12B, `→` à 0 %) dit ce que ça vaut.

## 3. Pourquoi sa notation ne se transplante pas ici

Trois mesures, toutes déjà faites dans ce dossier avant ce tour :

- **Chez nous, la méthode ne paie pas parce que la source n'est pas de la prose d'exemple.**
  `MCO/AGENTS.md` : 525 caractères par puce, prose, exemples → −54 %. `aidd-device/AGENTS.md` :
  145 caractères par puce, listes fermées, `→`, `!=`, `<=` → **−0,2 %**. Le rapport de la campagne le
  dit : « le gain d'une méthode de compression est fonction de la prose de sa source, pas de la
  méthode. »
- **Le projet MCO a rendu son propre DSL.** Son prompt est passé du symbolique (◉ → △ ◆ ⊙ ⟐) au
  « langage naturel dense » en v7.1 ; `VISION.compressed.dsl.md` ne contient plus aucun symbole. Motif
  relevé : un DSL ne se lit pas sans légende, et **une légende coûte ce qu'elle économise**.
- **La matrice des dix tests** (14-15 octobre) : réécriture dense −2 % rejeté, MCO sur `OUTPUT` −3 %
  rejeté, MCO sur le noyau −0,2 % rejeté, découpe −27 %/tour retenu, découpe plus profonde négative
  rejetée, scission de `01-consign` négative, n-grammes répétés 1,0 % non actionnable, `R8`/`R9` en
  tableau 0 o, niveau 1 des descriptions −14 % retenu.

Une quatrième, mesurée ce tour-ci et plus gênante : **nous écrivons déjà à moitié symboliquement, sans
le nommer.** Le contrat porte 45 `NEVER` (`never` 36 + `Never` 9), 30 `→`, 17 `!=`, 11 `only`, et zéro
opérateur nommé. Le gain de KERNEL n'est donc pas « symboliser » : c'est **nommer** ce qui n'a pas de nom
(échec, blocage, gel, mise en attente) et **faire lire ces noms par autre chose qu'un modèle**.

## 4. Les quatre dispositifs transférables, chiffrés sur nos fichiers

Base mesurée : noyau 1 777 jetons ; skills 1 389 ; contrat entier 3 166. Encodeur `o200k_base`.

### A · `OWNERSHIP` + `PRECEDENCE` — **81 jetons**, contre 67 retirés : **net +14 j**
Texte candidat, mesuré :

> One owner per rule: this file owns what applies everywhere, a skill owns one nature of repository
> rule, an ADR owns what it decided. The owner's text is the definition; another file citing it names it,
> never restates it. Precedence when owners pull apart: the owner of a subject wins that subject, this
> file wins what applies everywhere.

Il **remplace** la phrase de renvoi actuelle (l.8-10, 67 jetons), donc le net est **+14 jetons (＋0,8 % du
noyau)**. Ce qu'il règle, par construction : `F5` (trois maisons pour `MEMORY`, dont une globale),
`F6` (chemins et faits recopiés dans une règle et dans un relevé), et les 20 jetons de `02-memory`.
**Un obstacle déclaré** : un tableau de propriété **doit nommer les fichiers**, et `INVARIANTS` l.23 dit
« never the tool or the format ». KERNEL ne peut pas exister sous cette règle. Les deux ensemble
demandent un arbitrage, pas une retouche.

### B · `ON_FAIL[SILENCE]` — **36 jetons**, une règle que nous n'avons pas
Texte candidat, mesuré :

> A rule whose file cannot be read is not a rule that applies: `SKILLS_UNREADABLE`, said out loud, before
> proceeding on a trigger that pointed at it.

C'est `MODULE FAILURE` réduit à ce que nous pouvons tenir : nous n'avons pas de phase à bloquer, nous
avons un pointeur à croire. Il répare le trou de `F4` **sans chargeur** : aujourd'hui, trois skills
illisibles ne produisent rien, ni règle ni signal.

### C · Chargement par module — **−137 jetons nets** sur le noyau (−7,7 %)
Déplacer `AUDIT` (65 j) + `RECOVERY` (84 j) + `STOP` (42 j) = **191 jetons bruts** hors du noyau, dans un
skill dont le frontmatter et la description coûtent **54 jetons mesurés** : **net −137 j**, noyau
1 777 → 1 640.
**Deux chiffres antérieurs du dossier ne disent pas la même chose, et aucun ne porte les charges** : la
veille du 2026-10-15 annonce « −182 jetons » (poids brut, v13, sans le prix du skill) ; le test 5 de la
campagne annonce « `STOP` : −18 o, sortir coûte plus que ça ne rapporte » (octets nets du niveau 1, sur
un noyau de 8 560 caractères). Ma mesure recompte sur le noyau courant et porte les deux : **191 bruts,
54 de charges, 137 nets**.

### D · Registre machine + porte — hors de portée tant qu'ADR-004 n'est pas instruite
C'est le vrai dispositif de KERNEL, et le seul qui rende impossible la classe d'erreur qui nous coûte
quelque chose. **La dérive est démontrable et nommable** : quatre comptes faux en deux jours, plus, dans
le tour de ce matin, **trois numéros de ligne faux dans mon propre audit** (R5 attribuée à `INVARIANTS`
l.82 au lieu d'`OUTPUT` l.81, `Name by intention` l.12 au lieu de l.23, « A séance without its section »
l.9 au lieu de l.8). La classe est unique : **renvoi et compte recopiés à la main**. Un contrôle de cette
classe-là est petit : recalculer ce qui est recalculable (numéros de ligne cités, sections citées,
comptes de lignes et de jetons annoncés dans un document, synchronisation source ↔ artefacts que le
README décrit déjà à la main), et refuser au lieu d'avertir. ADR-004 exige d'une règle M qu'elle dise
**sa classe, sa commande et son contrôle négatif** avant usage ; ces trois-là sont maintenant nommables,
ce qui n'était pas le cas hier.

## 5. Ce qui n'est pas établi

- **Aucune mesure d'application des règles**, ici comme dans toute la campagne : pas d'accès à un modèle
  dans ce tour. Les gains sont en jetons, jamais en conformité.
- **La transférabilité de KERNEL n'est pas mesurée** : je lis son architecture et je la compare à la
  nôtre ; aucun de ses dispositifs n'a tourné sur ce dépôt.
- **La grandeur « 62-81 % » de MetaGlyph reste `OPEN`** (mots ou jetons BPE) : non citée comme gain.
- Le chiffre de fidélité par opérateur (`→` à 0 %) vient de la veille, qui a lu le corps de l'article ;
  je n'ai vérifié que l'abstract.
- `D` n'est pas chiffré : un vérificateur ne se mesure pas en jetons, et je n'en propose aucun tant que
  la classe de dérive n'est pas arbitrée.

## 6. Recommandation

Un paquet, dans cet ordre : **A + B + C = net −87 jetons sur le noyau (−4,9 %), avec deux règles que le
contrat n'a pas** (propriété, échec de lecture), et la fin des trois maisons pour `MEMORY`. Une seule
chose l'empêche d'être appliqué tel quel : A nomme des fichiers et `INVARIANTS` l'interdit — c'est
l'arbitrage à rendre. `D` est un dossier séparé, et son instruction commence par ADR-004.
