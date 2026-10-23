---
name: Spec — centraliser les runs, guidés compris
description: "Un seul foyer docs/device/runs pour tout run, un run.json qui porte mode, statut, pertinence et limites, un INDEX.md généré, un vérificateur runs.mjs, la migration des trois run-guides et le run-guide lu par run.json"
type: spec
status: open
---

# Spec — centraliser les runs

> 2026-10-23, née du [brainstorm du 08:14](../../../brainstorm/2026-10-23-081413-centraliser-les-runs.md)
> et de la mesure du même jour. Corrige le défaut constaté : deux foyers, `docs/device/runs/` pour
> l'indépendant et `docs/tasks/` pour le guidé, donc aucune vue unique, et des limites qui vivent en
> prose.

## 1. Le défaut, mesuré

- `docs/device/runs/` porte 29 dossiers : 19 `receipt.json`, 8 `gate.json` sans reçu, 2 non classés.
- `docs/tasks/` porte 3 run-guides réels, et un quatrième fichier qui finit par `-run-guide.md` sans être
  un run : `2026-10-22-221207-spec-run-guide.md`. `tracer` exige exactement un `*-run-guide.md` et
  refuserait ce dossier à deux fichiers.
- Aucun run du 2026-10-23 dans `docs/device/runs/`.
- Aucune pièce ne dit « non pertinent comme preuve d'indépendance » ; le §7 du run-guide le dit en prose.

## 2. La règle

**Un run, un dossier sous `docs/device/runs/<id>/`.** Le guidé y entre comme l'indépendant.

- Guidé : `docs/device/runs/<YYYY-MM-DD-HHMMSS>-guide-<slug>/`, avec `run.json`, `run-guide.md` et,
  quand il existe, `trace/`. Ni `receipt.json`, ni `gate.json`, ni `output.json`.
- Indépendant : le nom et les pièces actuels ne changent pas ; `receipt.json` reste la source.
- Avorté : un `gate.json` sans reçu reste tel quel ; l'index le marque `avorté`.
- Manuel : un dossier antérieur au protocole reçoit un `run.json` `mode: manuel`, `statut: non observé`,
  `limites: [protocole_anterieur]` et ses pièces. Ni reçu ni verdict.

`docs/tasks/` garde les specs, les brainstorms et les épreuves ; il ne porte plus de run.

## 3. `run.json`

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
  "pieces": ["run-guide.md"],
  "verdict": null
}
```

Champs requis : `type`, `mode`, `statut`, `skill`, `terrain`, `conduite`, `rapport_le`, `consigne_le`,
`pertinence`, `limites`, `pieces`, `verdict`.

- `type` vaut `run` ; `mode` vaut `guide` ou `manuel` ; `verdict` vaut `null` dans un `run.json`.
- `statut` vaut `forme tenue`, `forme non tenue` ou `non observé`.
- `skill` : `nom`, `chemin`, `revision`. `revision: null` exige la limite `revision_non_consignee`.
  `skill` et `terrain` peuvent être `null` pour `mode: manuel` seulement.
- `terrain` : `chemin`, `tete`, `porcelain`, tous des chaînes ; `porcelain` peut être vide.
- `conduite` vaut `agent` ou `humain`.
- `rapport_le` et `consigne_le` : ISO 8601, ou `null` quand la pièce ne le porte pas.
- `pertinence.comme_preuve_du_skill` : booléen ; `false` dès que `session_non_independante` est présente ;
  `raison` nomme un code de limite.
- `limites` : liste non vide ; chaque entrée a `code`, `effet`, `detail`, non vides. Codes admis :
  `session_non_independante`, `trace_absente`, `terrain_non_propre`, `attendu_non_gele`,
  `revision_non_consignee`, `run_non_observe`, `protocole_anterieur`.
- `pieces` : liste non vide de noms relatifs, sans `..` ; un guidé cite `run-guide.md`, et ce fichier
  existe.
- Un guidé porte au moins une limite : un run qui ne dit pas ce qu'il ne prouve pas ne se consigne pas.

## 4. `runs.mjs`

Nouveau fichier `docs/device/harness/runs.mjs`, sans réseau, sans session.

```text
node docs/device/harness/runs.mjs --verifier
node docs/device/harness/runs.mjs --index
```

`--verifier` parcourt `docs/device/runs/*/` et refuse, en `1`, au premier défaut :

- `runs : <dossier> porte receipt.json et run.json — un run porte une seule pièce de statut` ;
- `runs : <dossier> ne porte ni receipt.json, ni gate.json, ni run.json — un dossier de run se classifie` ;
- `runs : <dossier> est guidé et porte receipt.json — un guidé n'atteste pas ce qu'il n'a pas` ;
- `runs : <dossier> est guidé et porte gate.json` (ou `output.json`) ;
- `runs : <dossier> est guidé sans limite — un guidé qui ne dit pas ce qu'il ne prouve pas ne se consigne pas` ;
- `runs : <dossier> dit session_non_independante et pertinence vraie — la limite et la pertinence se contredisent` ;
- `runs : <dossier> a revision null sans revision_non_consignee` ;
- `runs : <dossier> cite une pièce absente : <pièce>` ;
- `runs : <dossier> n'a pas run-guide.md` ;
- `runs : code de limite inconnu : <code>` ;
- `runs : <dossier> a un statut hors des trois — forme tenue, forme non tenue, non observé` ;
- `runs : <dossier> est un reçu sans verdict lisible` ;
- `runs : INDEX.md diverge de la génération — régénérer`.

`--index` valide tout, puis écrit `docs/device/runs/INDEX.md` ; un dossier invalide arrête l'écriture.
Sans option, la commande sort en `2` avec l'usage. `--verifier` compare l'index généré au fichier et refuse
un index périmé : l'index est une vue, pas une source, et sa dérive se mesure.

## 5. `INDEX.md`

Généré, jamais édité. Première ligne : `<!-- généré par runs.mjs — ne pas éditer -->`. Puis un tableau
trié par nom de dossier :

```text
| Run | Date | Mode | Cas / skill | Statut ou verdict | Limites | Pièces |
```

- Date : les dix premiers caractères du nom du dossier.
- Guidé : `guide`, `skill.nom`, `statut`, les codes de `limites`, les pièces.
- Indépendant : `indépendant`, `cas` du reçu, `verdict` du reçu, les codes de `limites` ou `aucune`, les
  pièces du dossier.
- Avorté : `avorté`, `sans reçu`, `aucune` limite, `gate.json` et le texte s'il existe.
- Manuel : `manuel`, `skill.nom` ou `inconnu`, `non observé`, les codes, les pièces.

## 6. `tracer`

`tracer` lit `run.json` et sa liste `pieces` au lieu du motif `*-run-guide.md`. Il refuse : un dossier
sans `run.json`, un `mode` autre que `guide`, une liste `pieces` qui ne contient pas exactement
`run-guide.md`, un `run-guide.md` absent. Le reste ne change pas : ni reçu, ni verdict, trace écrite une
seule fois, fil inconnu refusé. La spec du 22:12 cesse d'être confondue avec un run, et le contrôle 265
change de fixture.

## 7. La migration

Trois run-guides réels, déplacés par `git mv`, contenu inchangé hors liens :

| Run | Dossier | `statut` | Limites |
| --- | --- | --- | --- |
| 2026-10-22, run du 21:37 | `2026-10-22-221207-guide-10-task` | `forme tenue` | `session_non_independante`, `trace_absente`, `run_non_observe`, `attendu_non_gele` |
| 2026-10-23, 10-task | `2026-10-23-033645-guide-10-task` | `forme tenue` | `session_non_independante`, `trace_absente`, `revision_non_consignee`, `attendu_non_gele` |
| 2026-10-23, 03-shadow-areas | `2026-10-23-075314-guide-03-shadow-areas` | `forme tenue` | `session_non_independante`, `trace_absente`, `terrain_non_propre`, `attendu_non_gele` |

- Le run du 21:37 garde son horodatage de fichier, faute d'heure exacte ; `consigne_le` est son `mtime`.
- Les liens de voisinage de tâche se réécrivent : trois occurrences dans le run-guide du 10-task, deux
  dans celui du 03-shadow-areas. Les liens vers `docs/` gardent la même profondeur.
- Dix références externes, dans sept pages, pointent vers les nouveaux chemins. Pas de pointeur à
  l'ancien chemin : un pointeur nommé `*-run-guide.md` serait un piège pour `tracer`.
- Les deux dossiers non classés reçoivent un `run.json` manuel : le run du 2026-10-15 (`PV.md`,
  `ECART.md`, `faits.json`, les trois refus) et le dossier du 2026-10-22 (`texte-a-remettre.txt`).
- Les huit dossiers `gate.json` sans reçu ne changent pas ; l'index les marque `avorté`.
- Les dossiers de tâche vidés sont supprimés ; celui du 22:12 garde sa spec. Aucun reçu n'est réécrit.

## 8. Pages à aligner

- [ADR-074](../../../DECISIONS.md) : le foyer du run guidé devient `docs/device/runs/`, et `run.json`
  porte ses limites.
- [Spec du 22:12](../2026-10-22-221207-traces-et-run-guide/2026-10-22-221207-spec-run-guide.md) : §2
  (chemin), §3 (gabarit et `run.json`), §6 (critère de sortie).
- [ADR-076](../../../DECISIONS.md) et `tracer` : lecture par `run.json.pieces`.
- [ORCHESTRATEUR](../../../device/ORCHESTRATEUR.md) : `runs.mjs`, la trace et le foyer du guidé.
- [DASHBOARD](../../../DASHBOARD.md), [README](../../../../README.md) : un lien vers `INDEX.md`, des
  comptes séparés « reçus », « guidés », « avortés », « manuels ».
- [ARCHITECTURE](../../../ARCHITECTURE.md), [EXPLICATION](../../../EXPLICATION.md),
  [PFD](../../../PFD.md), [guide utilisateur](../../../guide/guide-utilisateur.md) : le foyer unique.
- [BANC](../../../device/BANC.md) : les quatre contrôles ci-dessous.

## 9. Le banc

Quatre contrôles, **269** à **272**, et le banc passe à **272**.

- **269** : `runs.mjs --verifier` refuse un dossier guidé qui porte un reçu.
- **270** : il refuse un guidé sans limite, et accepte le même dossier avec une limite.
- **271** : `--index` écrit l'index ; `--verifier` refuse un index périmé, puis passe après `--index`.
- **272** : `tracer` lit `run.json.pieces` ; un dossier qui porte `run-guide.md` et une spec nommée
  `*-spec-run-guide.md` est accepté, un dossier sans `run.json` est refusé.

## 10. Ce qui rendrait cette spec fausse

- Un guidé avec un reçu, ou un indépendant avec un `run.json`.
- Un guidé sans limite, ou un index accepté après édition à la main.
- Un run-guide déplacé dont le contenu change, ou un reçu réécrit.
- Un lien mort après migration, ou un `tracer` qui accepte encore le motif `*-run-guide.md`.
- Un `run.json` qui recopie le reçu de l'indépendant au lieu de le laisser source.

## 11. L'ordre

1. `runs.mjs`, ses refus et les contrôles 269 à 272.
2. `tracer` par `run.json.pieces`, contrôle 272.
3. La migration des trois run-guides, des deux dossiers manuels et des liens.
4. L'index généré, les pages et les comptes.

Aucune ligne de code n'est écrite avant l'accord sur cette spec.
