---
name: Brainstorm — centraliser les runs, guidés compris
description: "un seul foyer docs/device/runs pour tout run, un run.json qui porte le mode, le statut, la pertinence et les limites, un index généré et un vérificateur ; la migration des trois run-guides, et le refus du framework traité à part"
type: brainstorm
status: open
---

# Brainstorm — centraliser les runs

> 2026-10-23, après le run guidé de `03-shadow-areas`. Sources mesurées : [les runs](../device/runs),
> [le run-guide du 10-task](../tasks/2026_10/2026-10-23-033645-deroule-du-test-10-task/2026-10-23-033645-run-guide.md),
> [celui du 03-shadow-areas](../tasks/2026_10/2026-10-23-075314-test-03-shadow-areas/2026-10-23-075314-run-guide.md),
> la [spec du run guidé](../tasks/2026_10/2026-10-22-221207-traces-et-run-guide/2026-10-22-221207-spec-run-guide.md)
> et le [refus du `cas`](../device/harness/orchestrer.mjs) mesuré aujourd'hui.

## 1. Le défaut, mesuré

| # | Fait | Preuve |
| --- | --- | --- |
| 1 | Deux foyers. Les runs indépendants vivent sous `docs/device/runs/` ; les runs guidés vivent sous `docs/tasks/`. | 29 dossiers dans `runs/` ; 3 run-guides réels sous `docs/tasks/` |
| 2 | Aucun run du 2026-10-23 dans `runs/`. | `find docs/device/runs -maxdepth 1 -newermt '2026-10-23 00:00'` rend 0 |
| 3 | Les limites du guidé sont en prose, pas en données. Aucun fichier ne dit « non pertinent comme preuve d'indépendance ». | run-guides §7, lus à la main |
| 4 | Le dossier de la spec du 22:12 porte deux fichiers qui finissent par `-run-guide.md` : le run-guide du 21:37 et `2026-10-22-221207-spec-run-guide.md`. `tracer` exige exactement un `*-run-guide.md` : il refuserait ce dossier. | `orchestrer.mjs`, refus `tracer` ; `ls` du dossier |
| 5 | `runs/` mélange quatre états sans index : 19 reçus, 8 `gate.json` sans reçu, 2 dossiers non classés (un run manuel avec `PV.md` et `ECART.md`, un dossier qui ne porte qu'un `texte-a-remettre.txt`). | comptes du 2026-10-23 sur `docs/device/runs/*/` |
| 6 | Un skill du framework ne peut pas devenir un cas : `cas` refuse. Le mode qui produit un reçu est donc fermé aux skills AIDD. | `REFUS — cas : le skill vit dans un des quatre arbres déjà gelés (/home/giak/projects/framework) …` |

Le point 1 est le défaut que tu nommes. Les points 3 à 5 sont la même maladie : le run guidé n'a pas de
dossier, donc pas de place pour ses limites, son statut ou son absence de trace.

## 2. Ce que je propose

**Un seul foyer : `docs/device/runs/<id>/`.** Tout run y naît, guidé ou indépendant. Un run guidé porte
`run.json`, son run-guide et, quand il existe, `trace/`. Il ne porte ni reçu, ni `gate.json`, ni
`output.json`. Un run indépendant garde ses pièces actuelles, `receipt.json` en tête.

**Un fichier de drapeau : `run.json`.** C'est le fichier que tu demandes : il dit le mode, le statut, la
révision lue, le terrain, la conduite, les pièces, et surtout `pertinence` et `limites[]`. Un run guidé
sans limite est refusé : un guidé qui ne dit pas ce qu'il ne prouve pas n'a pas de raison d'exister.

**Un index généré : `docs/device/runs/INDEX.md`.** Il lit `receipt.json` pour les indépendants,
`run.json` pour les guidés, `gate.json` sans reçu pour les avortés, et marque `non classé` ce qui ne
tombe dans aucun. Il ne s'édite pas à la main : il se régénère.

**Un vérificateur : `runs.mjs`.** Il refuse un dossier guidé qui porte un reçu, un guidé sans limite, un
dossier qui porte les deux, et un `run.json` dont `session_non_independante` ne force pas
`pertinence.comme_preuve_du_skill: false`. Il écrit l'index. Le banc l'éprouve.

## 3. La simulation

Un bac jetable, hors dépôt, a porté trois dossiers : deux guidés réels et un indépendant réel
(`receipt.json` du 2026-10-20). Le vérificateur a rendu l'index suivant, puis a refusé deux copies
cassées, l'une avec un reçu dans un dossier guidé, l'autre avec un guidé sans limite.

```text
| Run | Date | Mode | Cas / skill | Statut ou verdict | Limites | Pièces |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-10-20-222845-50664060-3d0db46 | 2026-10-20 | indépendant | 2026-10-18-085308-cas-jouet | conforme | 0, aucune | receipt.json |
| 2026-10-23-033645-guide-10-task | 2026-10-23 | guide | 10-task | forme tenue | 3, session_non_independante, trace_absente, revision_non_consignee | run-guide |
| 2026-10-23-075314-guide-03-shadow-areas | 2026-10-23 | guide | 03-shadow-areas | forme tenue | 4, session_non_independante, trace_absente, terrain_non_propre, attendu_non_gele | run-guide |
```

Le bac a aussi montré ce qui manque au guidé actuel : sa révision n'est pas toujours consignée (le
run-guide du 10-task n'en cite aucune), et son terrain peut être sale sans que rien ne le dise.

## 4. Le schéma de `run.json`

```json
{
  "type": "run",
  "mode": "guide",
  "statut": "forme tenue",
  "skill": { "nom": "03-shadow-areas", "chemin": "plugins/aidd-refine/skills/03-shadow-areas", "revision": "fe48de12" },
  "terrain": { "chemin": "/home/giak/aidd-device-work/…/terrain", "tete": "416ec1f", "porcelain": " M app.py, M test_app.py, ?? aidd_docs/" },
  "conduite": "agent",
  "rapport_le": "2026-10-23T07:50:28+02:00",
  "consigne_le": "2026-10-23T07:55:00+02:00",
  "pertinence": { "comme_preuve_du_skill": false, "raison": "session_non_independante" },
  "limites": [
    { "code": "session_non_independante", "effet": "non pertinent comme preuve d'indépendance", "detail": "ADR-074" },
    { "code": "trace_absente", "effet": "aucune ligne ne cite de seq", "detail": "tracer --liste depuis 2026-10-23T06:00 rend 0 fil" },
    { "code": "terrain_non_propre", "effet": "la condition de copie neuve n'est pas remplie", "detail": " M app.py, M test_app.py, ?? aidd_docs/ au départ" },
    { "code": "attendu_non_gele", "effet": "l'antériorité de l'attendu n'est pas prouvée", "detail": "spec du 22:12, §2" }
  ],
  "pieces": ["2026-10-23-075314-run-guide.md"],
  "verdict": null
}
```

Règles du vérificateur :

- exactement un de `receipt.json` et `run.json` par dossier, jamais les deux, jamais aucun ;
- guidé : `mode: guide`, `verdict: null`, `statut` parmi `forme tenue`, `forme non tenue`, `non observé`,
  au moins une limite, et aucun reçu ;
- `skill.revision: null` seulement avec la limite `revision_non_consignee` ;
- `pertinence.comme_preuve_du_skill` vaut `false` dès que `session_non_independante` est présente ;
- indépendant : le reçu reste la source, `run.json` ne le recopie pas.

## 5. Le nom et la place

- guidé : `docs/device/runs/<YYYY-MM-DD-HHMMSS>-guide-<slug>/` ;
- indépendant : le nom actuel du harnais, `<YYYY-MM-DD-HHMMSS>-<empreinte8>-<alea>/` ;
- à l'intérieur, le run-guide s'appelle `run-guide.md`, un nom fixe. `tracer` le lira par
  `run.json.pieces`, plus par le motif `*-run-guide.md` : la spec du 22:12 cesse d'être confondue avec un
  run. Le dossier de la spec garde sa spec, et rien d'autre.

## 6. La migration

Trois run-guides réels : le run du 21:37, celui du 10-task et celui du 03-shadow-areas. Le quatrième
fichier qui finit par `-run-guide.md` est la spec ; il ne bouge pas.

1. Créer les trois dossiers sous `runs/`, avec `run.json` et `run-guide.md`.
2. Déplacer les fichiers, sans réécrire leur contenu. Corriger les liens de voisinage de tâche : trois
   occurrences dans le run-guide du 10-task, deux dans celui du 03-shadow-areas. Les liens vers `docs/`
   gardent la même profondeur et restent valides. `liens.mjs` le prouve.
3. Mettre à jour les 10 références à ces trois fichiers, dans 7 pages : `ARCHITECTURE`, `DASHBOARD`,
   `EXPLICATION`, `trace.md`, le brainstorm du 2026-10-23-030728, l'épreuve du 2026-10-23-025408 et la
   spec de la présentation. Pas de pointeur à l'ancien chemin : un pointeur nommé `*-run-guide.md`
   serait un piège pour `tracer`.
4. Les deux dossiers non classés reçoivent un `run.json` minimal, `mode: manuel`, `statut: non observé`,
   avec leurs pièces et une limite `protocole_anterieur`. Les huit dossiers `gate.json` sans reçu restent
   tels quels : l'index les marque `avorté`, sans `run.json`.
5. Les dossiers de tâche vidés sont supprimés ; celui du 21:37 garde sa spec.

## 7. Le refus du framework, traité à part

Le point 6 est un second défaut, et il ne se règle pas par la centralisation. `cas` refuse tout skill
dont le dépôt est un arbre gelé, et le framework en est un depuis le gel du 2026-10-15. Or les cinq cas
existants testent des skills du framework : la règle et le corpus se contredisent.

Deux issues : garder le refus et acter que les skills AIDD n'ont que le mode guidé, ou corriger la règle
pour que seule la **destination** (le terrain, le dépôt du dispositif) soit refusée, jamais la **source**
du skill, qui est lue et copiée. La seconde est cohérente avec les cas existants, et elle rend possible
un vrai reçu pour `03-shadow-areas`. Elle demande sa propre spec et un contrôle de banc. Décidé le 2026-10-23 : la seconde
([ADR-080](../DECISIONS.md)), avec les contrôles 269 et 270.

## 8. Ce que ça change

- [ADR-074](../DECISIONS.md) et la [spec du 22:12](../tasks/2026_10/2026-10-22-221207-traces-et-run-guide/2026-10-22-221207-spec-run-guide.md) :
  le foyer du run guidé passe de `docs/tasks/` à `docs/device/runs/`, avec `run.json`.
- [ADR-076](../DECISIONS.md) et `tracer` : le run-guide se lira par `run.json.pieces`, plus par un
  motif qui attrape les specs.
- `runs/INDEX.md`, `DASHBOARD`, `README`, `ORCHESTRATEUR`, `ARCHITECTURE`, `EXPLICATION`, `PFD` : un lien
  vers l'index, des comptes séparés « reçus » et « guidés ».
- Le banc : un contrôle par refus du vérificateur, et un contrôle d'index.
- Aucun reçu n'est réécrit. Aucun contenu de run-guide ne change, hors liens.

## 9. Ce que ça ne prouve pas

- Un run guidé reste non indépendant : `pertinence.comme_preuve_du_skill: false` est une déclaration,
  pas une mesure.
- L'index est une vue ; il peut dériver si on ne le régénère pas. Le vérificateur contrôle la forme, pas
  la vérité des limites.
- La simulation est un bac jetable, pas le dispositif : la migration réelle peut rencontrer des liens
  qu'elle n'a pas vus.
- Classer les deux dossiers anciens ne rend pas leurs limites rétroactives.

## 10. Décision

1. **Centraliser** (recommandé) : `run.json`, `INDEX.md`, `runs.mjs`, migration des trois run-guides.
2. **Centraliser et corriger le refus du framework**, avec une spec séparée, puis rejouer
   `03-shadow-areas` en indépendant pour obtenir un reçu.
3. Garder les deux foyers et se contenter d'un index.

La première règle la dispersion. La seconde ajoute la preuve indépendante. Je recommande 1 puis 2, dans
cet ordre : l'index existe avant le second mode, et le reçu du 03-shadow-areas arrive dans un foyer qui
sait déjà le lire.
