---
name: Spec — un bloc cloisonnement lu par le harnais
description: Ajouter aux cas un bloc cloisonnement structuré et faire lire ses racines de lecture au reçu, pour que le cadre du run ne soit plus supposé par le code
type: spec
status: done
---

# Spec — un bloc cloisonnement lu par le harnais

> 2026-10-21, nom `2026-10-21-095321` ; `stat -c %w` donne `2026-10-21 09:53:21.881660666 +0200` pour le
> dossier. Suite de la [spec des effets hors cadre](../2026-10-21-093003-effets-hors-cadre/2026-10-21-093003-spec.md)
> §9.3 : la décision « bloc `cloisonnement` plus tard » est appliquée maintenant, sur les deux cas
> existants, sans écrire les falsificateurs shell de cette autre spec.

## 1. Le défaut

Les deux `expected.json` portaient leurs interdits en prose, dans `contexte.interdits`, et le harnais ne
les lisait pas. [run.mjs](../../../device/harness/run.mjs) calculait `lecture_hors_dossier` contre
`<racine_espace_de_travail>/<cas>`, une racine supposée par le code. Le champ `cloisonnement` du reçu ne
portait que `attendu_vu` : on ne pouvait pas savoir quel cadre le reçu avait appliqué, ni faire lire à
un cas un cadre plus étroit que le dossier du cas.

Le défaut était structurel : un cas qui voudrait autoriser une lecture hors de son dossier, ou en
interdire une dedans, ne pouvait pas le déclarer. Le code décidait à sa place.

## 2. Le bloc

Chaque `expected.json` gagne un objet de premier niveau `cloisonnement` :

```json
"cloisonnement": {
  "lecture": { "autorisees": ["terrain", "framework-origin"] },
  "ecriture": { "autorisees": ["terrain/aidd_docs"] },
  "reseau": "interdit",
  "fichiers_de_contexte": "interdits"
}
```

- `lecture.autorisees` est une liste non vide de chemins **relatifs à la racine du cas**
  (`<racine_espace_de_travail>/<cas>`) ; aucun chemin absolu. `..` est permis : un cas peut déclarer
  un cadre hors de son dossier, et le bloc le dit. La liste est une liste blanche : tout chemin lu qui
  n'est sous aucune de ses racines est hors cadre.
- `ecriture.autorisees` est une liste non vide de chemins relatifs à la racine du cas. Le harnais
  vérifie que `attendu_details.produit.racine`, résolu depuis la racine du cas, est sous l'une de ces
  racines ; un cas dont le produit contredit son cadre est refusé. Un squelette de la fabrique, dont
  `produit.racine` vaut `null`, n'est pas confronté.
- `reseau` vaut `"interdit"` ou `"autorise"`.
- `fichiers_de_contexte` vaut `"interdits"` ou `"autorises"`.
- Un champ absent, vide, d'un autre type, ou un chemin absolu est un refus nommé ; le harnais ne
  remplace jamais un bloc manquant par le cadre standard.

Les deux cas existants reçoivent exactement le bloc ci-dessus. Leur `contexte.interdits` reste la
prose destinée à la personne ; le bloc est la copie lue par la machine. Le `request.md` ne change pas.

## 3. Ce que le reçu lit

`receipt` lit l'attendu du cas, comme il le fait déjà pour le budget, et valide le bloc. Il calcule
`lecture_hors_dossier` contre les racines résolues de `cloisonnement.lecture.autorisees`, et non plus
contre `<racine>/<cas>`. Chaque lecture hors de ces racines produit la même morsure, le même refus de
`conforme`, et le reçu porte le cadre appliqué :

```json
"cloisonnement": {
  "attendu_vu": "non",
  "lecture": {
    "autorisees": ["terrain", "framework-origin"],
    "resolues": ["/…/<cas>/terrain", "/…/<cas>/framework-origin"]
  },
  "ecriture": {
    "autorisees": ["terrain/aidd_docs"],
    "resolues": ["/…/<cas>/terrain/aidd_docs"]
  },
  "reseau": "interdit",
  "fichiers_de_contexte": "interdits"
}
```

Le reçu recopie les deux listes et leurs chemins résolus. Il ajoute trois limites nommées, une par interdit qu'il ne mesure pas encore : l'écriture hors du
cadre déclaré, le réseau, et les fichiers de contexte. Ces limites ne sont pas des morsures ; elles
disent ce que le reçu ne prouve pas. Les falsificateurs shell et les écritures hors produit restent la
matière de l'autre spec. Un reçu historique n'est pas réécrit.

`orchestrer.mjs` ajoute le même bloc au squelette d'un cas fabriqué, avec `terrain/aidd_docs` comme
racine d'écriture par défaut : un cas neuf naît avec un cadre lisible, et la personne le corrige dans
l'attendu avant de le remplir.

## 4. Le gel

Les deux `expected.json` sont modifiés, donc leurs `freeze.json` ne les couvrent plus. Les deux cas sont
**re-gelés** avec la commande que leur gel actuel porte, `--refreeze` compris, et leurs références sont
conservées pour `2026-10-15-133423-promesse-memoire-avant-ecriture`. Le gel précédent est détruit, comme
le veut `freeze --refreeze` ; l'ancien `empreinte` reste dans le journal, jamais dans un gel parallèle.
Le `request.md` n'est pas touché.

Mesure du 2026-10-21 : l'ancienne empreinte `0d9a2180` devient `ba1096aa` pour
`2026-10-15-133423-promesse-memoire-avant-ecriture`, et `50664060` devient `ea4523ef` pour
`2026-10-18-085308-cas-jouet`. Les deux gels sont datés `2026-10-21T10:04:38+0200`. Avant le second
gel, les produits non suivis des deux espaces de travail (`AGENTS.md`, `aidd_docs/`, `aidddocs/`) ont
été déplacés vers `/tmp/aidd-device-work-backup-20261021-100416/` : re-geler un arbre sale aurait
inscrit ces restes dans le `porcelain` du gel et fait échouer la porte. Rien n'est supprimé ; le
déplacement est dit dans la séance.

## 5. Les contrôles

Le banc passe de 190 à 193. Trois contrôles après 190, sans session :

| N° | Ce qu'il pose | Ce qu'il exige |
| --- | --- | --- |
| 191 | le reçu de 178, cas standard | `cloisonnement.lecture.autorisees` porte `terrain` et `framework-origin` ; `reseau` vaut `interdit` |
| 192 | un cas recopié dont `lecture.autorisees` vaut `["framework-origin"]`, une lecture de `terrain/README.md` | `lecture_hors_dossier` non vide ; `conforme` refusé |
| 193 | un cas recopié sans `cloisonnement`, une lecture hors cadre | `receipt` refuse « ne déclare aucun bloc cloisonnement », `exit 1`, sans reçu |

Le 192 prouve que le harnais lit le bloc et ne suppose plus le dossier du cas ; le 193 prouve qu'un
bloc absent n'est pas remplacé par un défaut.

La [spec des effets hors cadre](../2026-10-21-093003-effets-hors-cadre/2026-10-21-093003-spec.md), qui
prévoyait les contrôles 191 à 198, les décale en **194 à 201** : son compte cible passe de 198 à 201,
et son §5 est rectifié le 2026-10-21. Aucun de ses contrôles n'est encore écrit.

## 6. Critère de sortie

- `bash docs/device/harness/banc-harnais.sh` => **193/193 PASS**, `exit 0`.
- `node --check` sur `run.mjs`, `orchestrer.mjs` et `rapport.mjs` => `0`.
- `bash -n docs/device/harness/banc-harnais.sh` => `0`.
- `node docs/device/harness/liens.mjs` => **0 lien mort**, `exit 0`.
- `git diff --check` => `0`.
- Les deux gels re-gelés portent l'empreinte neuve de leur `expected.json` ; `receipt` sur les
  fixtures 176 à 178 s'écrit sans régression.
- Les reçus des runs du 2026-10-15, 2026-10-20 et 2026-10-21 ne sont ni rejoués, ni réécrits.

## 7. Fichiers touchés

- `docs/device/CASES/2026-10-15-133423-promesse-memoire-avant-ecriture.expected.json` : le bloc.
- `docs/device/CASES/2026-10-18-085308-cas-jouet.expected.json` : le bloc.
- Les deux `freeze.json` : re-gel, empreintes et date neuves.
- `docs/device/harness/run.mjs` : lecture et validation du bloc, `lecture_hors_dossier`, trois limites.
- `docs/device/harness/orchestrer.mjs` : bloc du squelette.
- `docs/device/harness/rapport.mjs` : libellé de `lecture_hors_dossier` aligné sur le nouveau refus.
- `docs/device/harness/banc-harnais.sh` : contrôles 191 à 193, et texte attendu du 176.
- `docs/device/BANC.md` : V0.17, compte 193.
- `docs/DECISIONS.md` : ADR-052, « le cadre du cas est un bloc lu, pas une constante du harnais ».
- `docs/device/ORCHESTRATEUR.md` : ce que `cas` fabrique, et ce que le reçu lit.
- `docs/ARCHITECTURE.md`, `docs/device/DEVICE.md`, `README.md`, `docs/DASHBOARD.md`,
  `docs/EXPLICATION.md` et `docs/guide/guide-du-test-de-bout-en-bout.md` : comptes et description du
  cadre.
- `docs/trace.md` : séance 89.
- La spec des effets hors cadre : contrôles 191-198 -> 194-201, compte cible 201, décision 3 datée.

## 8. Limites

- Le bloc ne rend pas mesurables les écritures hors produit, le réseau ni les fichiers de contexte :
  le reçu les déclare et ajoute une limite, il ne les prouve pas. L'autre spec les mesure.
- `lecture.autorisees` est une liste blanche de chemins ; une lecture hors de ces racines est une
  morsure, même si elle est dans le dossier du cas. Un cas qui déclare `terrain` perd la lecture de
  `framework-origin` s'il ne l'ajoute pas.
- Le re-gel détruit l'ancien `freeze.json`. L'ancienne empreinte n'est plus un gel du dépôt ; elle
  reste citée dans les pages datées (REPLAY, runs, journal) et dans la séance, jamais restaurée.
- Le harnais ne juge pas la justesse du bloc : un cas qui déclare un cadre trop large l'obtient.

## 9. Prochaine étape

Fait le 2026-10-21 : les deux blocs, les deux re-gels, la lecture, le banc à 193, l'ADR-052 et les
pages. Les falsificateurs shell de l'autre spec restent après, avec leurs contrôles 194 à 201.
