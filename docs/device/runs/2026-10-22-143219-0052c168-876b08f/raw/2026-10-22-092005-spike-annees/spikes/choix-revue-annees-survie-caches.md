---
type: spike
status: resolved
source: "Demande utilisateur du 2026-10-22 — page « Années douteuses » (data/year_review.json, data/year_audit_review.json) et régénération des caches de collecte"
parents:
  - docs/superpowers/epics/EPIC-054-cles-annees-depuis-tags.md
related_to:
  - docs/superpowers/epics/EPIC-033-enrichissement-annees-id3.md
  - docs/superpowers/epics/EPIC-045-revue-annees-ecrites.md
---

# Spike: Les choix de revue des années survivent-ils à une régénération des caches ?

## Question

Les choix humains de la page « Années douteuses » — `data/year_review.json`
(année choisie ou rejet, fichiers **sans** année) et `data/year_audit_review.json`
(décisions « corriger » / « garder » sur les années **déjà écrites**) — survivent-ils
à une régénération des caches de collecte (`data/year_cache.jsonl` et les cinq
autres) ?

## Decision

EPIC-054 a deux tâches ouvertes : `--report` puis dry-run
`apply_years.py --keys-from-tags` (compter les écritures potentielles), puis
« application des certaines + revue des singles ». Avant de les exécuter, savoir
si l'on peut régénérer les caches et appliquer sans perdre — ni faire ombrer —
les choix de revue déjà pris, et sinon, ce qu'il faut protéger avant.

## Bounds

- Evidence needed:
  1. Les écrivains de `data/year_review.json` et `data/year_audit_review.json`
     face aux écrivains des caches de collecte : un chemin de régénération
     écrit-il, remplace-t-il ou supprime-t-il l'un des deux ?
  2. La clé d'identité employée par chaque fichier de revue, et la manière dont
     `scripts/apply_years.py --review` résout une entrée de revue vers un
     fichier (clé du nom, clé des tags, précédence entre les deux).
  3. Ce qu'une régénération change réellement (univers de clés, filtre `v≥2`,
     précédence des pools, inventaire `data/cache.json`) et si cela peut faire
     qu'une entrée de revue conservée cesse de résoudre, ou soit ombrée par une
     valeur automatique.
  4. Une simulation jetable et isolée (répertoire temporaire, aucun fichier
     audio réel, aucun accès au `data/` réel) qui rejoue « régénération puis
     application » et observe si le choix de revue atterrit encore.
- Stop when: pour chacun des deux fichiers, trois réponses sont établies —
  (a) un chemin de régénération l'écrit-il ou le supprime-t-il ?
  (b) ses entrées résolvent-elles encore les mêmes fichiers après régénération ?
  (c) à quelles conditions exactes cessent-elles de résoudre ?

## Investigation

Simulation jetable : `scripts/apply_years.py` et `app.py` importés depuis le
dépôt, tous leurs chemins redirigés vers un `tempfile`, faux MP3 (6 cadres MPEG
valides, tags ID3), aucun appel réseau, aucun fichier du `data/` réel touché.

| Attempt | Evidence | Result |
| ------- | -------- | ------ |
| Recensement des écrivains de `data/` (`save_json`, `open(...,'w')`, `open(...,'a')`) | `app.py:1505` → `year_review.json` ; `app.py:1842` → `year_audit_review.json` ; `scripts/collect_*.py` → caches en **append** ; `scripts/audit_applied_years.py:164-167` → `year_audit.json` **réécrit à blanc** | Aucun script de collecte n'écrit ni ne supprime les deux fichiers de revue : ils ne sont écrits que par les deux routes POST de l'app, en fusion, jamais tronqués. Le seul artefact du bloc années qui se reconstruit est `year_audit.json`. |
| Historique de la dérivation de clé (`git log -S`) | `a1810d6` (EPIC-033) est la **seule** introduction de `artist_title` (collect_years) comme de `_artist_title`/`_YEARS_NOISE` (app) | La clé `artiste\ttitre` n'a pas bougé depuis les choix de revue : les choix enregistrés pointent encore les mêmes fichiers. |
| S0 — les deux parseurs (celui qui écrit la revue, celui qui l'applique) sur 13 noms piégés | 0 divergence entre `app._artist_title` et `collect_years.artist_title` | Les deux bouts de la chaîne parlent la même clé. |
| S1 — avant régénération (cache corrobore 1999, humain 1985) | `worklist` → `('Some Artist - Some Song.mp3', '1985', 'review')` | Le choix humain bat le cache. |
| S2 / S3 — régénération (résultat neuf 2001 ; cache vidé, lignes `none`) | `worklist` → `1985` source `review` dans les deux cas | **Le choix survit à la régénération, même cache vidé** : il est injecté dans la consolidation (`apply_years.py:225-227`) et matché par la clé du **nom**, qui ne dépend d'aucun cache. |
| S4 / S4b — application en mode `--keys-from-tags` avec une clé-TAGS corroborée | mode tags → `1999` source `deezer+musicbrainz` ; **même** cache en mode nom → `1985` source `review` | **Condition de perte n°1** : en mode tags, le fichier est matché d'abord par sa clé-TAGS ; si celle-ci est corroborée, la valeur automatique s'applique et le choix humain (clé du nom) n'est **jamais consulté**. |
| S5 — renommage du fichier (clé dérivée différente) | aucun candidat, `stats={'no_match': 1}` | **Condition de perte n°2** : l'identité du choix est le nom du fichier ; un renommage rend le choix inerte, silencieusement (aucune erreur, aucun compte rendu). |
| S6 — rejet humain (`null`) alors que le cache corrobore | `load_review()` → `{}` ; `worklist` → `1999` source `deezer+musicbrainz` | **Condition de perte n°3** : le rejet n'est pas un veto — `load_review()` le jette (`if v`). Après une régénération qui corrobore, l'année est écrite malgré le rejet. (L'UI le dit : « Rejeter » masque la carte pour la session.) |
| S7 / S8 — audit : « garder » puis réécriture de `year_audit.json` ; « corriger » | « garder » → `counts.garder = 1` **après** réécriture du fichier d'audit ; « corriger » → `TDRC` 1991 écrit sur le disque, journal `old: 2024`, `counts.corriger = 1` **après** réécriture, disque toujours à 1991 | Les décisions d'audit (clé = **chemin absolu**) survivent au rebuild de `year_audit.json` ; les propositions, elles, sont recalculées depuis les caches et peuvent changer. |
| Tests du dépôt | `pytest test_apply_years.py` → 15 verts ; `pytest test_app.py -k "review or audit"` → 22 verts | Les comportements ci-dessus sont déjà épinglés par la suite du dépôt ; la simulation les rejoue hors ligne. |

## Outcome

- Result: **les deux fichiers vivent bien dans des fichiers que rien ne reconstruit** —
  aucun script de collecte n'écrit ni ne supprime `data/year_review.json` ni
  `data/year_audit_review.json` ; ils ne sont écrits que par les deux routes POST
  de l'app, en fusion. Une régénération des caches ne les touche pas.

  Mais **survivre ne veut pas dire s'appliquer**. L'effet d'un choix est redécidé
  au moment de l'application, par le cache, et trois conditions le neutralisent :
  1. **l'ombre du mode tags** — avec `--keys-from-tags` (le mode qu'EPIC-054
     ouvre), un fichier dont la clé-TAGS est corroborée prend l'année automatique ;
     le choix humain, enregistré sous la clé du nom, n'est jamais consulté ;
  2. **l'identité par le nom** — un renommage rend le choix inerte, sans erreur ;
  3. **le rejet n'est pas un veto** — `load_review()` jette les `null`, donc une
     régénération qui corrobore une année écrit malgré le rejet humain.

  En revanche, dans le **mode nom** (le défaut actuel), un choix d'année survit
  à la régénération et **bat** le cache, y compris si le cache est vidé : il est
  injecté dans la consolidation et matché par une clé qui ne dépend d'aucun
  cache. Et les décisions d'audit (« garder », « corriger ») survivent au rebuild
  de `year_audit.json`, parce qu'elles sont indexées par chemin absolu ; seul le
  contenu des propositions est recalculé.

- Confidence: **haute sur le mécanisme** (code lu + 10 scénarios mesurés en
  isolation + 37 tests du dépôt verts : le comportement est déterministe et
  documenté par le code). **Moyenne sur l'ampleur réelle** : le `data/` de la
  collection n'est pas dans ce dépôt (git-ignoré), le nombre de choix encore
  résolvables **sur la vraie collection** n'a pas pu être mesuré ici — seuls les
  chiffres du dépôt sont repris (692 choix exportés dont 59 rejets, 46 décisions
  d'audit à trancher ; README « État courant », EPIC-033/045).

- Remaining uncertainty:
  1. Le nombre exact de choix qui résoudraient encore **sur la vraie collection**
     (mesure impossible ici : `data/` absent, collection réelle non accessible).
  2. Les fichiers dont la clé-TAGS est corroborée **et** qui portent un choix
     humain sous la clé du nom : c'est le périmètre exact de la perte n°1, il
     demande la collection réelle et le cache réel (réseau).
  3. Les décisions d'audit indexées par chemin : elles sont orphelines si la
     collection est déplacée (même fragilité que la perte n°2).
  4. `data/` est git-ignoré et `AGENT.md` le déclare « NE PAS TOUCHER » : aucune
     sauvegarde ne protège les **choix** eux-mêmes (le journal `data/year_apply_journal.jsonl`
     ne protège que les écritures, pas les décisions).

## Follow-up

Pour l'exécutant d'EPIC-054 (décisions de conception, à trancher par le
propriétaire de l'EPIC — rien n'a été modifié hors de cette spike) :

1. **Arbitrer l'ombre du mode tags avant de lancer `apply_years.py --keys-from-tags`.**
   Aujourd'hui, la valeur automatique l'emporte sur le choix humain dés qu'une
   clé-TAGS est corroborée. Deux voies : (a) faire gagner la revue en mode tags
   (matcher d'abord la clé du nom quand une entrée de revue existe pour elle),
   ou (b) refaire la revue dans l'UI sur les fichiers concernés et ré-exporter
   (mais l'UI n'enregistre que des clés du nom : il faut donc une clé de revue
   capable de porter la clé-TAGS, sinon l'option (b) boucle).
2. **Copier `data/year_review.json` et `data/year_audit_review.json` hors de
   `data/`** avant toute campagne de collecte/application. Ce n'est pas une
   reconstruction : c'est la seule sauvegarde qui existe, ces fichiers étant
   non versionnés et non recopiés.
3. **Relancer l'audit** (`scripts/audit_applied_years.py`) après la collecte :
   `data/year_audit.json` est le seul artefact du bloc qui se réécrit — les
   décisions restent, les propositions changent.
4. **Décider ce que vaut un rejet.** Si l'intention est d'empêcher une écriture,
   `load_review()` doit conserver les `null` et le pipeline doit les respecter ;
   sinon, le dire dans le README (aujourd'hui : le rejet masque la carte pour la
   session, il ne bloque rien).
5. **Trancher le sort d'un choix devenu orphelin** (fichier renommé) : le signaler
   (compteur dans le dry-run) plutôt que le laisser disparaître en silence.
