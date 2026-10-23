---
name: Spec — rendre un cas possible pour un skill du framework
description: "cas refuse tout skill dans un arbre gelé, donc aucun run indépendant pour un skill AIDD ; la règle vise désormais les arbres que la session écrit, puis 03-shadow-areas est fabriqué et joué jusqu'au reçu"
type: spec
status: open
---

# Spec — un cas pour un skill du framework

> 2026-10-23, après le [brainstorm du 08:14](../../../brainstorm/2026-10-23-081413-centraliser-les-runs.md)
> §7, et la mesure du même jour. Cette spec ne touche ni au gel, ni à la porte, ni au reçu : elle change
> la seule condition qui empêche de fabriquer un cas pour un skill AIDD, puis joue le cas.

## 1. Le défaut, mesuré

`node docs/device/harness/orchestrer.mjs cas --skill …/03-shadow-areas --terrain … --tel-quel` refuse :

```text
REFUS — cas : le skill vit dans un des quatre arbres déjà gelés (/home/giak/projects/framework) — tester le dispositif avec lui-même ne prouve rien ; rien ne s'écrit
```

La cause est le gel du 2026-10-15, qui a nommé `/home/giak/projects/framework` comme arbre. Depuis,
`arbresGeles` refuse tout skill de ce dépôt. Or les cinq cas existants testent des skills du framework :
la règle et le corpus se contredisent, et le mode qui produit un reçu est fermé aux skills AIDD.

## 2. La règle

`cas` refuse un skill dont le dépôt est un arbre **que la session écrit**, ou le dépôt du dispositif.
Il ne refuse plus un skill dont le dépôt est une source **lue** : `framework-origin`, `terrain` et la
révision sous test sont copiés, jamais écrits.

- Arbres écrits : les `travail` des gels de `--cases`.
- Dépôt du dispositif : `DEPOT` (`/home/giak/projects/aidd-device`).
- Sources lues : `framework-origin`, `terrain`, `revision-sous-test` ; un skill qui y vit est accepté.
- Le contrôle du terrain ne change pas : le terrain proposé reste refusé s'il est un des quatre arbres.
- Le refus du dépôt sale ne change pas : `--tel-quel` reste nécessaire pour un arbre non commité.

Le refus devient, pour un arbre écrit :

```text
REFUS — cas : le skill vit dans un arbre que le run écrit (<chemin>) — la session y écrirait, et le test se confondrait avec son terrain ; rien ne s'écrit
```

et, pour le dépôt du dispositif :

```text
REFUS — cas : le skill vit dans le dépôt du dispositif (<chemin>) — le dispositif se mesurerait lui-même ; rien ne s'écrit
```

## 3. Le changement

- Une fonction `arbresEcrits(cases)` rend les chemins des arbres de label `travail` des gels.
  `arbresGeles` reste pour le contrôle du terrain.
- `commandeCas` remplace `dedans(framework, geles)` par `dedans(framework, [...arbresEcrits(cases), DEPOT])`.
- La spec de l'orchestrateur, §7 condition 2, passe de « le skill est dans un des quatre arbres » à « le
  skill est dans un arbre que le run écrit, ou dans le dépôt du dispositif ».
- Le contrôle **145** change de fixture : un skill dans un `travail` gelé est refusé.
- Deux contrôles neufs : l'un accepte un skill du framework et fabrique un cas, l'autre refuse un skill
  dans `DEPOT`. Ils sont **273** et **274** si la centralisation passe d'abord, **269** et **270** si
  cette spec passe seule d'abord ; dans le premier ordre le banc finit à **274**, dans le second à
  **270**. Aucun contrôle existant n'est renuméroté.

## 4. Le cas `03-shadow-areas`

Après le changement, le cas se fabrique comme les autres. Son contenu est soumis à la personne avant le
gel ([ADR-041](../../../DECISIONS.md)) ; cette spec ne le gèle pas.

- **Identifiant** : `2026-10-23-<HHMMSS>-shadow-areas`.
- **Terrain** : un clone neuf à `416ec1f`, qui porte seulement
  `aidd_docs/backlog/tasks/refuser-config-manquante.md` (`sha256`
  `818db266…fffc6f`), porcelain `?? aidd_docs/` ; le fichier du run guidé n'y est pas.
- **Demande** : lire le skill sous `$RACINE/<id>/framework-origin/`, scanner la Task, écrire le rapport
  d'angles morts à côté d'elle, ne rien modifier d'autre, ne proposer ni correctif ni implémentation.
- **Produit** : `terrain/aidd_docs/backlog/tasks/refuser-config-manquante-shadow-report.md`, un seul
  fichier. Racine d'écriture : `terrain/aidd_docs`.
- **Promesse** : le rapport nomme au moins l'absence de moyen d'obtenir `data/config.json` au premier
  lancement, en `blocker` ou `major`.
- **Falsificateur P** : le rapport ne nomme aucun écart sur l'obtention de `data/config.json` ; il tue la
  promesse du skill.
- **Traces** : la lecture du skill sous `framework-origin`, l'écriture du seul produit, la Task à la même
  empreinte avant et après. Le contenu du rapport n'est pas jugé au-delà de la promesse.
- **Tableau et pause** : `tableau.requis: false`, `pause.requis: false` ; le skill écrit sans demander
  d'accord, et exiger une pause inventerait un geste qu'il n'a pas.
- **Réponse figée** : une seule, « Continue, sans modifier la Task. », utilisée seulement si la session
  pose une question.
- **Cloisonnement** : lecture `terrain`, `framework-origin` ; écriture `terrain/aidd_docs` et
  `terrain/.scratch` ; réseau interdit ; fichiers de contexte interdits.

## 5. Le run

1. `cas` fabrique le cas, avec `--tel-quel` pour le framework non commité ; le gel enregistre le
   porcelain.
2. La personne confirme la demande, l'attendu et le falsificateur ; `run.mjs freeze --refreeze` re-gèle.
3. `porte` écrit la porte et le texte.
4. `ouvrir` ouvre la session opencode avec un modèle nommé, envoie le texte et joue la réponse figée ;
   le modèle est un paramètre du run ([ADR-044](../../../DECISIONS.md)), pas du cas.
5. `suite`, puis `fin` : le verdict est celui que la preuve autorise. `rapport` écrit la page utilisateur.
6. Le reçu et l'index entrent dans `docs/device/runs/` ; `runs.mjs --index` les liste.

Un modèle absent ou un quota épuisé arrête le run avec le refus nommé, sans reçu. Aucun reçu n'est écrit
à la main, et un `non concluant` est un résultat valide.

## 6. Ce qui rendrait cette spec fausse

- Un skill du framework encore refusé, ou un skill du dépôt du dispositif accepté.
- Un cas fabriqué dont le `framework-origin` n'est pas la révision gelée.
- Un reçu écrit sans `ouvrir`, sans porte ou sans trace.
- Un run présenté `conforme` alors que le falsificateur P mord.
- Une réponse figée ou un tableau ajoutés au cas pour faire passer `ouvrir`.

## 7. L'ordre

1. Le changement de `commandeCas`, ses deux refus et les contrôles 145, 273 et 274.
2. La fabrication du cas, sa confirmation et son gel.
3. Le run par `porte`, `ouvrir`, `suite`, `fin`, `rapport`, et l'index.
