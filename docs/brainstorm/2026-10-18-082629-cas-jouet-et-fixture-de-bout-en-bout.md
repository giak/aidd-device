---
name: Cas jouet, et la première fixture de bout en bout
description: Brainstorm : pourquoi un second cas minuscule, ce qu'il mesure, où vivent ses arbres, comment le banc le traverse de bout en bout sans session, ce qui reste dehors, et ce qui n'a pas été mesuré
type: brainstorm
status: in-progress
---

# Cas jouet, et la première fixture de bout en bout

> 2026-10-18, né à 08:26:52 (`stat -c %w` ; le nom porte la minute mesurée avant l'écriture, l'écart de
> 23 secondes reste nommé, jamais lissé). Ceci est un **brainstorm**, pas
> la spec : il dit ce que la demande implique, ce que le dispositif impose déjà, les trois formes que le
> cas peut prendre, ce que la fixture du banc éprouverait, ce qui reste dehors, et ce qui n'a pas été
> mesuré. **Rien n'est encore écrit dans `docs/device/CASES/`**, et la sonde de la section 2 vivait sous
> `/tmp`, jetable.

## 1. La demande, et ce qu'elle a de neuf

La demande, Séance 57 : « Écrire un cas jouet (demande minuscule, attendu, gel) dans
`docs/device/CASES/`, assez petit pour tenir dans une page, et l'ajouter au banc comme fixture de bout en
bout. » Elle ferme la ligne 3 de la section 14 du plan du guide : **« un cas jouet, à écrire ou à extraire
du cas réel »**, dont l'absence laisse les chapitres du guide sans exemple montrable, et la ligne qui en
dépend au §11 du même plan (le foyer et l'amorce).

Ce qui est neuf, mécaniquement : jusqu'ici le banc éprouve le harnais sur des **fixtures** (faux travail,
cas recopiés et re-gelés, traces fabriquées en SQLite) et le cas réel vit à côté d'elles ; personne n'avait
demandé qu'un **cas entier**, ses fichiers compris, traverse la chaîne complète sans session. C'est la
première fois aussi qu'un second cas vivrait dans `CASES/`.

## 2. Ce que le dispositif impose déjà, et ce que la sonde a montré

Sonde jetable `/tmp/sonde-jouet.sh` (2026-10-18, aucune écriture dans le dépôt) : deux dépôts jouets de
deux fichiers, créés à dates et signatures figées, deux copies sous une racine déclarée, les fichiers du
cas recopiés, puis `freeze` → **`exit 0`**, empreinte `cba74210` :

- `freeze` exige `--racine` **hors du dépôt**, et les deux copies `$RACINE/<cas>/framework-origin` et
  `$RACINE/<cas>/terrain` doivent **exister** ; `--arbre framework-origin=…` et `--arbre terrain=…` les
  déclarent, `revision-sous-test` et `travail` sont dérivés de la racine (ADR-019) ;
- **un arbre sans remote passe** : la sonde rend `remotes 0` et `refs_distants []` sur les deux origines,
  et le code dit pourquoi (`an empty list says out loud that the tree is published nowhere`) ;
- **aucune référence n'est exigée** : `--ref` facultatif, `references 0` au gel accepté ;
- les fichiers du cas sont ceux qui portent le préfixe `<cas>.`, et **tout** fichier de ce préfixe qui
  n'est pas `.request.md` prend le rôle « attendu » dans l'empreinte : un script compagnon doit donc
  porter un **tiret** (`<cas>-…`), jamais un point ;
- `receipt` exige de l'attendu un `demande.budget_echanges` entier positif (H4) ; un cas jouet n'y coupe
  pas ;
- `compare` lit `<cas>.expected.json` pour `attendu` et `ecartes`.

Ce que la sonde **n'a pas** éprouvé : `preflight`, `collect`, `faits`, `receipt` et `compare` sur un gel
sans référence. C'est le premier point de la phase 0 de la spec, avant de tenir le cas pour bon.

## 3. Où vivent les arbres du cas jouet : trois formes

| # | Arbres | Ce que ça donne | Ce que ça coûte |
| --- | --- | --- | --- |
| **A** | deux dépôts jouets (deux fichiers) créés par un **script compagnon** à dates figées, sous `$RACINE` | rejouable hors ligne, d'un clone ; têtes épinglées ; aucune publication nouvelle | un script de plus ; le gel dira `refs_distants` vide, ce qui est vrai |
| **B** | l'environnement du cas réel (`framework` `4c39e5c59`, `terrain` `416ec1f`) | rien de neuf à construire | le jouet ne s'ouvre que sur cette machine (60 Mo), et n'ajoute rien que le cas réel ne porte déjà |
| **C** | deux dépôts jouets **publiés** sur GitHub | l'esprit de l'ADR-017 est respecté à la lettre | réseau, comptes, deux dépôts de plus pour quatre fichiers |

**Mon avis : A.** Un jouet qui exige l'environnement du réel ne remplace rien ; A est le seul qui rende le
cas reconstituable d'un clone sans réseau, et la sonde a montré que le gel l'accepte tel quel. Je garde C
comme réponse si tu veux que le jouet soit clonable par un inconnu sans script.

## 4. Ce que le cas jouet mesure : deux formes

- **Forme 1, la promesse en miniature** : budget de deux échanges ; la session rend un tableau lu du dépôt,
  attend la réponse figée, puis écrit **un** fichier au chemin exact. Falsificateurs : aucune écriture
  avant le tableau (F1), aucun tableau (F2), un produit hors du chemin prescrit (F3), aucun produit (F8),
  une écriture hors du répertoire de travail (F5).
- **Forme 2, la chaîne seule** : aucun ordre à tenir, un fichier attendu à un chemin exact, deux
  falsificateurs. Plus court d'une page, et ne mesure que le transport.

**Mon avis : Forme 1.** H6 vient de donner au tableau une forme mécanique ([ADR-035](../DECISIONS.md)) ;
un jouet qui mesure **aussi** l'ordre donne au guide un exemple où les mécanismes récents se lisent en dix
lignes, et au banc sa première fixture où F1 et F2 mordent sur un cas entier.

## 5. Ce que la fixture du banc éprouverait

Une fois le cas gelé, la fixture reconstruit son environnement dans le bac jetable du banc (le script
compagnon, la racine locale), recopie les fichiers du cas, puis traverse la chaîne dans l'ordre :

1. `freeze` sur la racine du bac → gel local, `exit 0` ;
2. `preflight --run <dossier> --repertoire <travail>` → `gate.json` écrit, `exit 0` ;
3. le fil fabriqué (base SQLite du banc, comme les contrôles 113 à 118) et l'export du §1.5 ;
4. `collect` du produit de la fixture → `exit 0`, puis `faits` → `exit 0` ;
5. `receipt --verdict conforme` → `exit 0`, et deux refus au moins : `conforme` sur un fil sans tableau,
   et `conforme` sur un produit né avant le tableau ;
6. `compare` → `output.json` écrit, `exit 0`.

C'est la première fois que ces six commandes s'enchaînent sur **un** cas, sans session : le gain n'est pas
la couverture (chaque commande a ses contrôles) mais la **couture** entre elles.

## 6. Ce qui reste dehors

- **Aucune session** : le cas jouet est fait pour le banc et pour le guide, pas pour un run réel ; rien
  n'est ouvert, et le budget de deux échanges n'est jamais consommé ici.
- **Pas de publication** (forme A) : le gel dira `refs_distants` vide, et le script est la réponse à
  « où retrouver ces arbres ».
- **Le guide n'est pas retouché** : `REPLAY.md` gagne un bloc de plus quand le cas sera gelé.

## 7. Ce qui n'a pas été mesuré

- La chaîne complète sur un gel **sans référence** (section 2) ;
- le coût réel de la fixture en secondes de banc (les 118 contrôles actuels durent ~30 s ; à remesurer) ;
- la taille finale des trois fichiers du cas en octets, pour la « page » promise ;
- la reconstruction des arbres jouets par le script sur une autre machine (les têtes n'y dépendent que des
  dates et signatures figées — à prouver par un rejeu dans un bac neuf).

## 8. Décisions ouvertes

1. **Les arbres** : A, B ou C (§3). Mon avis : A.
2. **Ce qu'il mesure** : forme 1 ou forme 2 (§4). Mon avis : forme 1.
3. Le reste m'est laissé : le nom du cas (`2026-10-18-HHMMSS-cas-jouet`), le chemin du script compagnon
   (`docs/device/CASES/<cas>-arbres.sh`, hors du préfixe `<cas>.`), un [ADR](../DECISIONS.md) court qui
   enregistre le second cas et sa nature, et la forme exacte des cinq falsificateurs.
