---
type: spike
status: resolved
source: demande-utilisateur-2026-10-22
parents:
  - docs/superpowers/epics/EPIC-033-enrichissement-annees-id3.md
  - docs/superpowers/epics/EPIC-045-revue-annees-ecrites.md
  - docs/superpowers/epics/EPIC-054-cles-annees-depuis-tags.md
---

# Spike: Survie des choix humains d'années à la régénération des caches de collecte

## Question

Les décisions humaines de la page « Années douteuses » — `data/year_review.json` et
`data/year_audit_review.json` — survivent-elles à une régénération des caches de collecte
(`data/year_cache.jsonl` et les cinq autres `*_cache.jsonl`), ou vivent-elles dans un fichier
que rien ne reconstruit ?

## Decision

Décider si une régénération des caches peut être lancée sans sauvegarde préalable des choix
humains, et si une garantie (« les fichiers de revue sont hors du périmètre des caches ») doit
être inscrite dans les scripts de collecte et le runbook de re-collecte.

## Bounds

- Evidence needed: l'inventaire `fichier:ligne` de tout ce qui écrit, tronque ou efface les
  6 caches de collecte et les 2 fichiers de revue ; le recouvrement entre les deux ensembles ;
  la réponse sourcée à « un chemin de régénération touche-t-il ce fichier ? » pour chaque
  fichier de revue.
- Stop when: chaque fichier de revue a une réponse oui/non sourcée, et tout chemin de
  suppression ou de troncature de cache est nommé.

## Investigation

| Attempt | Evidence | Result |
| ------- | -------- | ------ |
| Empreinte d'écriture de tout le dépôt (AST, tous `.py`, pas un grep) | `/tmp/opencode/spike_annees/h1_write_footprint.py` | Les 2 fichiers de revue ont **2 écrivains et 0 suppression** : `app.py:1505` (POST `/years/review`) et `app.py:1842` (POST `/years/audit/review`). Un seul lecteur : `scripts/apply_years.py:205`. Aucun script de collecte ne les mentionne. |
| Écriture des 6 caches de collecte | idem | **6 écritures, toutes en APPEND** : `collect_years.py:601`, `collect_discogs.py:155`, `collect_itunes.py:191`, `collect_discogs_reform.py:137`, `collect_discogs_reform2.py:188`, `collect_youtube_topic.py:328-330` (appelé `:369`). Aucune troncature, aucune suppression. `app.py` ne les écrit jamais (constantes `:1220-1229`, lectures `:1320/:1355/:1452`). |
| Toutes les suppressions du dépôt | idem | 16 suppressions au total : `app.py:310` (`cache.json`, l'index de scan, supprimé quand la config source change), `app.py:1060` (fichier audio), `app.py:2001` (export de playlist), `nml.py:219/248` (nœuds XML), `rmtree` de `/tmp` dans les harnais, tests. **Aucun cache de collecte, aucun fichier de revue.** |
| Empreinte runtime d'une collecte réelle (lookup stubbé, espace jetable) | `/tmp/opencode/spike_annees/h2_runtime.py` E3a-E3d | La collecte **ajoute** 1 ligne à son cache, ne touche aucun autre cache, ne crée aucun fichier, et laisse `year_review.json` + `year_audit_review.json` **byte-identiques**. |
| Le choix humain dépend-il des caches ? | idem E1a/E1b | Non. `apply_years.build_worklist()` avec un `year_cache.jsonl` **vidé** applique toujours le choix humain (`year: 1995`, `source: 'review'`) : l'injection est indépendante du cache (`scripts/apply_years.py:225-227`). |
| Le choix humain est-il reconstructible depuis les caches ? | idem E2 | Non. Cache vidé **et** fichier de revue absent → plus rien à écrire (`stats={'no_match': 1}`). Le choix n'existe que dans le fichier. |
| Les routes de revue écrasent-elles les choix antérieurs ? | idem E4a-E4b + `pytest -k review` (1 + 18 tests verts) | Non : les deux routes **fusionnent** (`app.py:1503-1505`, `app.py:1801-1842`). Un 2ᵉ POST ajoute une clé et conserve la 1ʳᵉ. |
| Nature d'une « régénération » côté outil | `collect_years.py:293-312`, `report_years.py:69-74` | Une re-collecte **accumule** (append) ; la consolidation retient la dernière ligne valide par clé (`last_valid`). Le choix humain reste prioritaire (`source: 'review'`). |
| Ce qui est réellement régénéré à côté | `app.py:302-310`, `scripts/audit_applied_years.py:165-166` | `data/cache.json` (index de scan) **est** supprimé par l'app quand la config change, et `data/year_audit.json` (source de l'audit, pas un cache de collecte) **est** réécrit (`mode 'w'`). |

## Outcome

- Result: **les deux fichiers de revue survivent à toute régénération des caches, et ils ne
  vivent dans aucun fichier que le dépôt reconstruit.** Les deux propriétés sont vraies
  simultanément, et c'est la seconde qui commande le risque :
  1. *Survie* — aucun chemin de collecte n'écrit, ne tronque ni ne supprime `year_review.json`
     ou `year_audit_review.json` ; leurs seuls écrivains sont les deux routes de revue, qui
     fusionnent. Une régénération des 6 caches (append ou wipe manuel du cache seul) ne les
     touche pas. Le choix humain reste prioritaire même cache vide (`source: 'review'`).
  2. *Non-reconstructibilité* — si ces fichiers disparaissent, les choix sont perdus
     définitivement : rien ne les redérive (E2), et la seule autre copie est la session
     navigateur en mémoire (`static/src/render/yearsUI.ts:55,108-120`), perdue au rechargement.
     Le vrai risque n'est donc pas le code : c'est le geste humain « je repars d'un `data/`
     propre », qui détruit des choix non auto-régénérés (contrairement aux caches, que
     `AGENT.md` §DATA-SAFETY #4 déclare justement « auto-régénérés »).
- Confidence: haute — empreinte AST de tout le dépôt (pas d'échantillonnage) + 11 vérifications
  exécutées jetables (11/11) + les tests du dépôt eux-mêmes (`test_apply_years.py -k review` :
  1 vert ; `test_app.py -k review` : 18 verts). Limite assumée : `data/` n'existe pas dans ce
  checkout (git-ignoré) — la preuve est donc structurelle (code) et non un test sur la
  collection réelle de l'utilisateur.
- Remaining uncertainty:
  1. **L'effet peut se détacher du fichier, sans que le fichier change.** Les clés de
     `year_review.json` sont `artiste\ttitre` (nom du fichier, `yearsUI.ts:95-97`) : renommer un
     fichier, ou changer le parsing `artist_title`, rend la décision inerte. Les clés de
     `year_audit_review.json` sont des **chemins absolus** (`app.py:1808-1815`) : déplacer un
     fichier rend la décision inerte.
  2. `data/year_audit.json` est régénéré (`audit_applied_years.py:165-166`) ; les décisions
     d'audit survivent mais deviennent inertes pour un chemin qui quitte l'audit
     (`app.py:1810-1812`, « chemin hors de l'audit »).
  3. `data/cache.json` (index de scan, entrée de l'univers des clés de collecte) est supprimé
     par l'app au changement de config source (`app.py:302-310`) — sans effet sur les caches
     de collecte ni sur les fichiers de revue.

## Follow-up

La décision à prendre (produit, pas technique) : la garantie « les fichiers de revue ne sont
pas auto-régénérés » est **vraie mais implicite** — elle n'est écrite nulle part et n'est
protégée par aucun garde-fou, alors que `AGENT.md` §DATA-SAFETY #4 affirme l'inverse pour
`data/`. Deux suites possibles, à trancher par le propriétaire :

1. **Documentation (recommandé, coût nul)** — `README.md` § « Enrichissement des années » et
   `AGENT.md` §DATA-SAFETY : préciser que `data/year_review.json` et
   `data/year_audit_review.json` sont des **décisions humaines, non régénérables**, à
   sauvegarder avant toute purge de `data/`, et distinguer l'index de scan (`cache.json`,
   supprimé au changement de config) des caches de collecte (append).
2. **Garde-fou** — si la purge manuelle de `data/` est un geste courant, une EPIC peut
   ajouter un instantané horodaté des fichiers de revue avant toute écriture destructive, ou
   un avertissement explicite dans les scripts de collecte. À n'ouvrir que si le point 1 est
   jugé insuffisant.

Parents à mettre à jour : `EPIC-033` (caches + revue des années manquantes) et `EPIC-045`
(revue des années écrites) ; `EPIC-054` (re-collecte par les tags) n'est concerné que par le
fait que sa re-collecte est un append, pas une réécriture.
