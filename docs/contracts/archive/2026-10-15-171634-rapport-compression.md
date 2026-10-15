---
name: Rapport de compression — dix tests d'optimisation, de compression et de refactoring sur le contrat
description: Ce qui a été tenté pour alléger AGENTS.md et ses skills, ce que chaque essai a rapporté, et pourquoi deux seulement ont été retenus.
type: audit
status: done
---

# Rapport de compression

Dix tests, tous lancés contre `AGENTS.md` et `.agents/skills/`. Deux ont été retenus, huit ont
été rejetés sur mesure. Ce document dit ce qui a été essayé, ce que chaque essai a rapporté, et
ce qui reste non mesuré.

## Le point de départ

| état | taille | note |
|---|---|---|
| début de session | 11 374 car | 13 sections, 72 puces |
| après récupération des règles framework | 13 272 car | 88 puces |
| **avant découpe** | **13 386 car** | 13 sections, 88 puces |
| **noyau** | **8 560 car** | 9 sections, 59 puces |
| **skills** | **6 230 octets** | 3 fichiers |
| **par tour au repos** | **9 519 car** | noyau 8 560 + niveau 1 959 |

Le fichier a grossi de 18 % pendant la session, puis la découpe a ramené ce qui est chargé à
chaque tour sous son niveau d'origine.

## Les dix tests

| # | test | gain mesuré | verdict |
|---|---|---|---|
| 1 | réécriture dense du noyau | −2 % | rejeté |
| 2 | MCO v7.1 sur `OUTPUT` | −3 % | rejeté |
| 3 | MCO v7.1 sur le noyau entier | −0,2 % | rejeté |
| 4 | **découpe noyau + skills** | **−27 %/tour** | **retenu** |
| 5 | découpe plus profonde (`AUDIT`, `STOP`) | −18 à +66 o | rejeté, négatif |
| 6 | scinder `01-consign` | −510 o sur un tour de fichier | rejeté, négatif |
| 7 | collision de déclencheurs entre skills | aucune | rien à corriger |
| 8 | **niveau 1 des descriptions compressé** | **−14 % du niveau 1, 161 o/tour** | **retenu** |
| 9 | n-grammes répétés (4–8 mots, ≥3 occurrences) | 145 o = 1,0 % | non actionnable |
| 10 | `R8`/`R9` en tableau markdown | 0 o | non actionnable |

## Pourquoi la compression échoue ici, mesuré

La méthode MCO annonce −54 % et le livre sur sa propre source. Appliquée ici, elle ne livre
rien. Ce n'est pas la méthode : c'est la source.

| document | car par puce | nature | gain obtenu |
|---|---|---|---|
| `MCO/AGENTS.md`, la source des −54 % | **525** | prose, phrases, exemples | −54 % |
| `aidd-device/AGENTS.md` | **145** | listes fermées, inéquations `→` `!=` `<=` | **−0,2 %** |

**Le gain d'une méthode de compression est fonction de la prose de sa source, pas de la
méthode.** Un document à 145 car par puce, avec des listes fermées, est au plancher. Les
4,8 % de balisage markdown — puces, titres, backticks, séparateurs — sont incompressibles.

Le projet MCO lui-même a fait ce constat : son prompt est passé d'un DSL symbolique (◉ → △ ◆ ⊙
⟐) à du « langage naturel dense » en v7.1. `VISION.compressed.dsl.md` ne contient plus aucun
symbole. Le DSL est mort parce qu'il ne se lit pas sans légende, et qu'une légende coûte ce
qu'elle économise.

## Test 5 — la découpe est déjà à son optimum

Valeur marginale de sortir encore une section, niveau 1 du skill inclus :

| section | taille | gain si sortie | verdict |
|---|---|---|---|
| `OUTPUT` | 2 983 o | +2 728 o | rentable à la lettre |
| `INVARIANTS` | 1 509 o | +1 254 o | rentable à la lettre |
| `VERIFY` | 920 o | +665 o | rentable à la lettre |
| `CHANGE` | 707 o | +452 o | rentable à la lettre |
| `SCOPE` | 430 o | +175 o | — |
| `RECOVERY` | 419 o | +164 o | — |
| `REASON` | 386 o | +131 o | — |
| `AUDIT` | 321 o | +66 o | non rentable |
| `STOP` | 237 o | **−18 o** | non rentable, sortir coûte plus que ça ne rapporte |

Les trois sections qui rapportent le plus sont `OUTPUT`, `INVARIANTS`, `VERIFY` — exactement
celles qu'on ne peut pas sortir : elles gouvernent chaque réponse, chaque décision, chaque
affirmation. **La découpe actuelle est le point fixe.** Sortir davantage dégraderait le
contrat pour gagner 66 octets.

## Test 6 — `01-consign` ne doit pas être scindé

`01-consign` fait 56 % de la masse des skills et contient deux sections. C'est le seul point qui
paraît faible. Il ne l'est pas.

```
tour de consignation seule     3 586 → 3 234 o    352 o gagnés
tour de création de fichier   3 586 → 4 096 o    510 o de plus
tour sans rien                 +255 o par tour, pour rien
```

On paie 255 o **chaque tour** pour attendre un déclenchement qui coûte plus cher quand il
arrive. Consigner implique nommer : une nouvelle puce a besoin des deux jeux de règles, et
charger la moitié d'un protocole est pire que d'en charger tout.

## Test 8 — le niveau 1, le gisement oublié

Les descriptions de skills sont **le seul déclencheur** et sont chargées à chaque tour. My
première estimation à 255 o par description était fausse : elles en font 318 à 369. Le niveau 1
coûtait 1 120 o par tour, plus que toute la section `AUDIT`.

```
niveau 1   1 120 → 959 o    −14 %    161 o par tour
```

Le test de qualité bloque l'écriture si une description perd son `Use when` ou son `Not for`.
Il a.attrapé deux défauts :

| skill | avant | après compression | corrigé |
|---|---|---|---|
| `01-consign` | `Use before or after producing…` | — | `Use when something must outlive…` |
| `03-boundaries` | `Use before writing into…` | `Use before writing into…` — **aggravé** | `Use when writing into…` |

**Ma version compressée de `03-boundaries` a recopié la forme faible du déclencheur.** Elle
n'était pas moins bonne ; elle était aussi mauvaise. Corrigée à la main après le test.

## Ce que les tests n'ont pas mesuré

Tout ce qui précède est compté en **octets**. Trois choses ne le sont pas :

1. **Est-ce qu'un agent charge un skill quand il devrait ?** Rien dans cette session ne le dit.
   Le test par `GET /api/skill` est **inconcluant** : 34 skills sans `location`, 0 avec, y
   compris pour un dépôt dont on sait que 34 skills chargent. La requête est fausse, pas la
   convention.
2. **Est-ce qu'un agent exécute une règle qu'il a lue ?** Aucune mesure.
3. **Le gain en octets vaut-il une règle de moins appliquée ?** Jamais arbitré.

La troisième est la seule qui compte vraiment, et elle n'est pas mesurable en octets.

## Quatre contrôles laxistes de cette session

Signalés parce qu'ils invalident des preuves que j'ai données :

| moment | le test | le défaut | conclusion |
|---|---|---|---|
| compression du compact | comparait les 6 premiers mots d'une puce | passe toute troncature | « 0 règle perdue » était juste, la preuve était invalide |
| R4 | « le principe est conservé mot pour mot » | la clause de tête avait été remplacée | énoncé faux |
| premier bilan | motif `allowed;` au lieu de `allowed.` | rien n'a été supprimé | le test n'a pas tourné, j'ai conclu qu'il passait |
| audit de couverture | regex trop larges | `parallel` venait de « no parallel tree » | 3 couvertes et non 4 |

Le schéma est le même : **un contrôle maison compare le fichier à mon modèle du fichier.** Seul
un contrôle externe — le garde, qui refuse — attrape ce que je rate. C'est structurel, et ça
ne se corrige pas en étant plus rigoureux.

## Ce qui reste non commité

Le noyau, les trois skills, les deux outils et ce rapport sont sur le disque mais **hors git**.
Un découpage identique a déjà disparu en une nuit sans que l'on sache qui. Le fichier porte la
règle *« Never commit or push unless the user asks »* : c'est une décision de l'opérateur, pas
de l'agent.