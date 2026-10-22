Spike écrite et conclue. Voici le bilan.

## Identité et écritures

**Un seul fichier** : `aidd_docs/backlog/spikes/choix-revue-annees-survie-caches.md`

| Champ | Avant | Après |
| --- | --- | --- |
| `status` (frontmatter) | `open` | `resolved` |
| `Investigation` | tableau vide | 8 tentatives (méthode / preuve / résultat) |
| `Outcome` | gabarit vide | réponse, confiance, incertitudes restantes |
| `Follow-up` | gabarit vide | 5 points pour l'exécutant d'EPIC-054 |
| `related_to` | absent | EPIC-033, EPIC-045 |

Relations : `parents` → `docs/superpowers/epics/EPIC-054-cles-annees-depuis-tags.md` (les deux tâches ouvertes) ; `source` → ta demande du 2026-10-22 ; `related_to` → EPIC-033 (la revue) et EPIC-045 (l'audit), stockés une seule fois, sur l'artefact dont le chemin trie en premier.

Vérification : `git status` ne montre que `?? aidd_docs/` — **aucun fichier suivi n'a été modifié**, aucune EPIC touchée, aucune entrée d'index, et le `data/` vide que la suite de tests avait créé a été retiré.

## La réponse**Les deux fichiers vivent bien dans des fichiers que rien ne reconstruit** : aucun script de collecte n'écrit ni ne supprime `year_review.json` / `year_audit_review.json` (seules les deux routes POST de l'app les écrivent, en fusion) ; les caches sont en `append` ; le seul artefact du bloc années qui se réécrit est `year_audit.json` (`audit_applied_years.py:164-167`).

**Mais « survivre » ≠ « s'appliquer »**, et trois conditions neutralisent un choix conservé :

1. **L'ombre du mode tags** — avec `--keys-from-tags` (le mode qu'EPIC-054 ouvre), un fichier dont la clé-TAGS est corroborée prend l'année automatique ; le choix humain, enregistré sous la clé du nom, n'est jamais consulté. Mesuré : `1999` automatique au lieu de `1985` humain — et `1985` sur le *même* cache en mode nom.
2. **L'identité par le nom** — un renommage rend le choix inerte, sans erreur ni compte rendu.
3. **Le rejet n'est pas un veto** — `load_review()` jette les `null` ; après une régénération qui corrobore, l'année est écrite malgré le rejet.

En mode nom (le défaut), un choix d'année survit et **bat** le cache, y compris cache vidé : il est injecté dans la consolidation et matché par une clé indépendante du cache. Les décisions d'audit survivent au rebuild de `year_audit.json` (clé = chemin absolu) ; seul le contenu des propositions est recalculé.

## Preuves

- Lecture : carte complète des écrivains de `data/`, `git log -S` (la dérivation de clé n'a pas bougé depuis EPIC-033 — les choix pointent encore les mêmes fichiers), comparaison des deux parseurs (0 divergence sur 13 noms piégés).
- Simulation jetable isolée (`/tmp/opencode`, hors dépôt, faux MP3, aucun réseau, aucun `data/` réel) : 10 scénarios, dont les 3 conditions de perte ci-dessus.
- Tests du dépôt : `test_apply_years.py` 15 verts, `test_app.py -k "review or audit"` 22 verts.

## Ce que je n'ai pas tranché (à toi / au propriétaire d'EPIC-054)

La question de conception qui reste ouverte est **l'arbitrage revue vs automatique en mode tags** — aujourd'hui l'automatique gagne. La spike le documente en follow-up 1 ; je n'ai touché ni EPIC ni code. Reste aussi non mesurable d'ici : le nombre de choix encore résolvables sur la vraie collection (`data/` absent d'ici) et le périmètre exact des fichiers touchés par la perte n°1, qui demande la collection et le cache réels.