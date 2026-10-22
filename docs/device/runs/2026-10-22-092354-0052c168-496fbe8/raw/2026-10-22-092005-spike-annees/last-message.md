Spike écrite et close : `aidd_docs/backlog/spikes/survie-choix-annes-regeneration-caches.md` (`status: open` -> `status: resolved`).

## Réponse à la question

**Les deux propositions sont vraies en même temps, et c'est la seconde qui porte le risque.**

1. **Survie** — `data/year_review.json` et `data/year_audit_review.json` ne sont écrits que par deux endroits (`app.py:1505` POST `/years/review`, `app.py:1842` POST `/years/audit/review`, tous deux en *fusion*), lus par un seul (`scripts/apply_years.py:205`). Aucun script de collecte ne les mentionne. Les 6 caches de collecte ne sont écrits qu'en **append** (`collect_years.py:601`, `collect_discogs.py:155`, `collect_itunes.py:191`, `collect_discogs_reform.py:137`, `collect_discogs_reform2.py:188`, `collect_youtube_topic.py:328-330`) et ne sont jamais tronqués ni supprimés : les 16 suppressions du dépôt sont `cache.json` (index de scan, `app.py:310`), un fichier audio, un export de playlist, des nœuds XML, des `/tmp`.
2. **Non-reconstructibilité** — si ces fichiers disparaissent, les choix sont perdus : rien ne les redérive. Le seul autre exemplaire est la session navigateur en mémoire (`yearsUI.ts:55,108-120`).

Le vrai risque n'est donc pas le code : c'est le geste humain « je repars d'un `data/` propre », qui détruit des décisions **non** auto-régénérées — alors que `AGENT.md` §DATA-SAFETY #4 déclare `data/` auto-régénéré.

## Preuve

- Empreinte AST de **tout** le dépôt (tous `.py`, pas un échantillonnage) : `/tmp/opencode/spike_annees/h1_write_footprint.py`.
- 11 vérifications exécutées jetables : **11/11** (`/tmp/opencode/spike_annees/h2_runtime.py`), dont deux décisives — cache vidé **+** fichier de revue présent => le choix humain est toujours appliqué (`source: 'review'`) ; cache vidé **+** fichier de revue absent => plus rien à écrire (`no_match: 1`).
- Tests du dépôt : `test_apply_years.py -k review` 1 vert, `test_app.py -k review` 18 verts.

## Réserve honnête

`data/` n'existe pas dans ce checkout (git-ignoré) : la preuve est **structurelle**, pas un test sur votre collection réelle. Et l'*effet* des décisions peut se détacher sans que le fichier change : clés `artiste\ttitre` pour la revue des années (un fichier renommé perd sa décision), chemins absolus pour l'audit (un fichier déplacé perd la sienne). `data/year_audit.json` est, lui, bien réécrit (`audit_applied_years.py:165-166`).

## Suite proposée (votre décision)

Documenter la garantie dans `README.md` § « Enrichissement des années » et `AGENT.md` §DATA-SAFETY : les deux fichiers de revue sont des décisions humaines, **non** régénérables, à sauvegarder avant toute purge de `data/` ; distinguer l'index de scan (`cache.json`, supprimé au changement de config) des caches de collecte (append). Un garde-fou (instantané horodaté) n'a de sens que si ce geste de purge est courant.

Arbre rendu à son état initial : seul `aidd_docs/` est nouveau (non suivi par git, absent du `.gitignore`). Le dossier `data/` vide créé par `pytest test_app.py` (`app.py:26`) a été supprimé.
