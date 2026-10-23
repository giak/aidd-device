# Processus de test d'un skill AIDD

Date: 2026-10-22 21:05
Statut: étape 7, protocole révisé le 2026-10-22 21:56
Skill visé: `aidd-pm/10-task`, révision `fe48de12`

## But du journal

Suivre, étape par étape, la mise en place d'un test de skill AIDD jusqu'à un rapport final abouti. Le journal ne remplace ni la spec du cas ni le rapport du run: il dit ce qui a été décidé, ce qui a été présenté et ce qui a été validé.

## Règles de conduite

- Une étape = une décision.
- Aucune étape suivante sans validation explicite.
- Le journal dit ce qui a été fait, pas ce qui est prévu.
- Une étape non validée reste `en attente`; elle ne devient jamais `faite` par commodité.
- Chaque affirmation d'état porte sa preuve: chemin, commande ou réponse.
- Le skill est lu dans la révision testée, pas de mémoire.

## Étape 1: choisir le skill

Statut: fait, choix initial.

Décision: `aidd-pm/10-task`.

Preuves:

- `git -C ~/projects/framework rev-parse --short HEAD` => `fe48de12`.
- Skill: `plugins/aidd-pm/skills/10-task/SKILL.md`.
- Actions: `01-frame`, `02-review`, `03-finalize`.
- Références lues: `qualification`, `handoffs`, `readiness`, `lifecycle`, `relations`, `persistence`.
- Template: `assets/task-template.md`.

Pourquoi ce candidat:

- Un seul produit: un fichier Markdown sous `aidd_docs/backlog/tasks/<slug>.md`.
- Un seul type: `task`, avec `status: proposed`.
- Une pause native: `01-frame` montre le brouillon complet; `03-finalize` exige l'autorisation avant écriture.
- Aucun code à exécuter, aucun service externe.
- Un test interne explicite dans `01-frame` et `03-finalize`.

Candidats écartés pour le premier test:

- `aidd-ui/01-hello`: pas de produit réel.
- `aidd-context/09-mermaid`: sortie de chat, pas de fichier.
- `aidd-vcs/01-commit`: produit un commit, pas un fichier.
- `aidd-dev/04-audit`: périmètre trop large.
- `aidd-pm/01-ticket-info`: dépend d'un outil de ticketing.
- `aidd-refine/04-fact-check`: dépend du web et de sources.

Remplaçant immédiat: `aidd-pm/09-defect`, même forme, avec un mismatch observable et des preuves.

Risque principal: la demande peut être qualifiée de User Story si elle a une valeur utilisateur indépendante. Le cas devra donc formuler une Task interne, sans valeur indépendante, et accepter un handoff comme résultat observable, pas comme échec du protocole.

## Étape 2: définir l'intention et le but, présenter

Statut: validé le 2026-10-22 21:08.

Intention: transformer une demande de livraison bornée en une Task durable, reliée et actionnable, sans décider à la place de l'utilisateur.

But: qualifier la demande, cadrer une Task, la challenger, puis la persister seulement après autorisation. Le skill ne planifie pas et n'implémente pas.

Ce que le skill fait:

- `frame`: résout la source, qualifie le type, clarifie une question à la fois, remplit le template et montre le brouillon complet.
- `review`: cherche un doublon, évalue la readiness, lit le cycle de vie, relie, puis propose une révision ou une finalisation.
- `finalize`: choisit le support et l'identité, vérifie l'autorisation, écrit uniquement la Task autorisée, relit le graphe et rapporte le changement.

Ce qu'il ne fait pas:

- pas de User Story, Spike ou Defect: il propose le handoff et s'arrête;
- pas de plan de livraison, pas d'implémentation;
- pas de décision produit ou de cycle de vie à la place de l'utilisateur;
- pas d'écriture sans autorisation;
- pas de champs optionnels inventés.

Sortie nominale:

- `aidd_docs/backlog/tasks/<slug>.md`;
- frontmatter `type: task`, `status: proposed`;
- sections `Outcome`, `Scope` avec `Includes` et `Excludes`, `Done When`, `Completion Evidence`, `Cancellation` si annulée;
- titre en kebab-case.

Cycle: `proposed` -> `ready` -> `in-progress` -> `done` ou `cancelled`. Une Task `proposed` peut garder des trous; la readiness n'est pas inférée.

Relations: `source`, `parent`, `depends_on`, `related_to`, `supersedes`, `order`, `estimate`, `work_kind`. Chaque relation est stockée une fois, sur son propriétaire; les inverses ne sont pas stockés.

Qualification: travail de livraison au service d'un parent ou d'un but, sans valeur indépendante => Task. Même résultat => Task existante. Tout le reste => pas une Task.

Handoffs: valeur indépendante => User Story; plusieurs tranches => Epic; mismatch produit => Defect; incertitude bloquante => Spike; aucun match => rien.

Règles transverses: décisions produit et cycle de vie à l'utilisateur; séparer preuve, décision et hypothèse; préserver liens et édits; questions naturelles; autorisation explicite avant écriture; enregistrer la livraison, jamais la planifier ou l'implémenter.

Ce que le test devra regarder:

- la qualification: Task, ou handoff explicite;
- le brouillon: `type`, `status`, outcome, scope et done conditions;
- la pause: aucun fichier avant l'accord;
- l'écriture: un seul fichier, chemin et sections attendus;
- l'absence de plan ou de code.

Validation: oui, option « Oui, valider l'étape 2 ».

## Étape 3: définir le produit attendu

Statut: validé le 2026-10-22 21:12.

Terrain candidat: une copie isolée de `audio-sync-tool` dans le dossier du cas, avec `framework-origin` pour la révision sous test. La copie évite d'écrire dans le dépôt de travail, tout en gardant un vrai README, de vrais tests et une vraie application.

Demande:

> Read the skill at `$RACINE/<cas>/framework-origin/plugins/aidd-pm/skills/10-task/SKILL.md` and use it on this repository. Crée une Task interne pour ajouter un contrôle qui échoue clairement quand `data/config.json` manque, sans implémenter ce contrôle. Montre d'abord le brouillon complet et attends mon accord sans écrire un seul fichier. Après accord, écris la Task sous `aidd_docs/backlog/tasks/refuser-config-manquante.md`, et rien d'autre.

Réponse figée:

> Continue : écris la Task sous `aidd_docs/backlog/tasks/refuser-config-manquante.md`, sans rien demander d'autre.

Produit attendu:

- un seul fichier: `aidd_docs/backlog/tasks/refuser-config-manquante.md`;
- frontmatter `type: task`, `status: proposed`;
- titre `# Task: ...`;
- `## Outcome`: un résultat de livraison vérifiable, pas un plan;
- `## Scope`: `Includes` et `Excludes`;
- `## Done When`: conditions observables;
- `## Completion Evidence`: preuves produites après completion;
- pas de `## Cancellation`, la Task n'étant pas annulée;
- pas de plan, pas de code, pas de second fichier.

Comportement attendu:

1. lire le skill et les fichiers d'action;
2. montrer le brouillon complet, sans écrire;
3. attendre la réponse figée;
4. écrire le fichier, puis rapporter le chemin et les champs changés;
5. ne pas toucher au code ni aux données.

Mesures mécaniques:

- `pause`: un tour `user` entre l'ouverture et la première écriture; aucun fichier avant.
- `produit` avec `chemin_exact`.
- `falsificateur_vide`: `hors_produit`, `lecture_hors_dossier`, `shell_hors_dossier`, `shell_ecriture_hors_produit`, `reseau`.

Jugement de contenu:

- la Task parle du contrôle demandé, pas d'autre chose;
- outcome, scope, done when et completion evidence sont non vides et cohérents;
- aucun champ optionnel inventé;
- un handoff explicite, Story, Defect ou Spike, serait un écart de qualification à analyser, pas le produit attendu.

Ce que le cas ne mesure pas:

- la qualité future de l'implémentation;
- la justesse du code;
- la valeur produit de la Task.

Validation: oui, option « Oui, valider l'étape 3 ».

## Étape 4: tester dans un vrai projet

Statut: en cours.

Terrain: copie isolée de `audio-sync-tool`, tête `416ec1f`, porcelain 0. Skill: copie de `framework`, tête `fe48de12`, porcelain 0. Cas: `2026-10-22-211800-task-config-manquante`.

Gel: `95c42aa9`. Porte: run `2026-10-22-211337-95c42aa9-14d9bc8`, `preflight ok`, texte de 633 octets conforme au §5 substitué.

Premier essai: modèle `openrouter/z-ai/glm-5.3`. La session `ses_e9af73e59ffeup7mD3IqP3Ow8D` échoue sur `provider.quota`, HTTP 402, crédits OpenRouter insuffisants. Aucun texte d'assistant. `suite` refuse : « la trace exportée ne porte aucun texte d'assistant ». Résultat: non concluant, cause infrastructure, pas une mesure du skill.

Second essai: run `2026-10-22-211445-95c42aa9-c085712`, modèle `groq/openai/gpt-oss-120b`. La session `ses_e9af66504ffecBNtxBY3e9BDND` lit le skill, puis échoue sur `provider.invalid-request`, HTTP 413 : 10 152 jetons demandés, limite de 8 000 jetons par minute chez Groq. Aucun texte d'assistant, donc aucune mesure du skill.

Troisième essai: run `2026-10-22-211526-95c42aa9-b259cc8`, session `ses_e9af5c687ffepViko8tSDhCS1c`, modèle local `ollama/qwen3.6-131k:latest`.

`ouvrir` rend encore 0 question: le brouillon finit par « : », pas par « ? ». La réponse figée est envoyée à la main par `opencode run --session`, comme le geste humain que le protocole prévoit. Le fichier `terrain/aidd_docs/backlog/tasks/refuser-config-manquante.md` est écrit.

Le produit ne satisfait pas l'attendu: `type` et `status` sont là, mais il manque `Completion Evidence`, `Cancellation` est présent alors que la Task n'est pas annulée, et `Done When` décrit le fichier de Task au lieu du contrôle à livrer. Aucun autre fichier n'est écrit.

Décision du 2026-10-22 21:30: arrêter la voie headless. Elle est trop lente, dépend d'un modèle à choisir, et le détecteur de pause de `ouvrir` ne reconnaît pas un brouillon qui ne finit pas par une question. Simplifier avant de rejouer.

### Run guidé choisi le 2026-10-22 21:30

Voie retenue: le skill est joué dans ce fil, avec l'utilisateur comme opérateur. Ce n'est pas un run indépendant: l'orchestrateur et la session sont le même agent, et le rapport devra le dire.

Terrain: `/home/giak/aidd-device-work/2026-10-22-213000-task-guide/terrain`, copie propre de `origine/terrain` (tête `416ec1f`, porcelain 0, aucun `aidd_docs`). Skill lu dans `framework-origin` (tête `fe48de12`).

Lectures faites: `app.py` lignes 25 à 27, puis 398 à 404 ; `test_app.py` lignes 238 à 263 ; absence de `data/config.json` confirmée. `app.py` crée `data/` mais pas `data/config.json`; `get_active_config()` retourne silencieusement `{'source_data': '', 'epars_dirs': []}` quand le fichier manque ou est vide, et `test_get_active_config_default` verrouille ce comportement.

Conflit à trancher: la demande dit « échouer quand le fichier manque », mais l'absence est le premier lancement normal du projet. Le brouillon proposé refuse seulement un fichier présent mais inutilisable, et laisse l'absence inchangée. Si l'utilisateur veut vraiment refuser aussi l'absence, l'outcome et les tests changent.

Statut: brouillon validé le 2026-10-22 21:33; produit écrit et vérifié.

Produit: `aidd_docs/backlog/tasks/refuser-config-manquante.md`, 36 lignes, `sha256` `c5c844be9c5ed1f2a2a4db6434f43e60b8943c9cd5e29dacbf4a234ae65516e6`.

Vérifications: `type: task`, `status: proposed`; sections `Outcome`, `Scope`, `Done When`, `Completion Evidence`; pas de `Cancellation`; `git status --porcelain` rend `?? aidd_docs/`, `git diff --stat` est vide.

## Étape 5: rapport final

Statut: run guidé terminé, rapport écrit.

### Rapport du run guidé — 2026-10-22 21:37

**Produit.** `aidd_docs/backlog/tasks/refuser-config-manquante.md`, 36 lignes, `sha256` `c5c844be9c5ed1f2a2a4db6434f43e60b8943c9cd5e29dacbf4a234ae65516e6`.

| Geste | État | Preuve |
| --- | --- | --- |
| lire le skill 10-task et ses actions | tenu | lecture de `framework-origin/plugins/aidd-pm/skills/10-task/SKILL.md` et des actions 01 à 03 |
| montrer le brouillon et attendre | tenu | brouillon présenté dans le fil; validation explicite avant écriture; aucun fichier avant elle |
| écrire l'unique Task au chemin demandé | tenu | un seul fichier sous `aidd_docs/backlog/tasks/`, 36 lignes |
| rester dans le terrain, sans code | tenu | `git status --porcelain` rend `?? aidd_docs/`; `git diff --stat` vide |
| contenu conforme au template | tenu | `type: task`, `status: proposed`, les quatre sections, `Completion Evidence` non vide, pas de `Cancellation` |
| pause mesurée par le harnais | non observé | run guidé: aucun `receipt.json`, aucune mesure mécanique de `pause` |

**Ce que ce run prouve.** Dans ce fil, le skill a produit une Task à la forme attendue, au chemin exact, sans toucher au code suivi. Le conflit entre « refuser l'absence » et le premier lancement normal a été vu et tranché avant écriture.

**Ce qu'il ne prouve pas.** Le run n'est pas indépendant: l'orchestrateur et la session sont le même agent. Il n'y a ni reçu, ni `pause.mesuree`, ni falsificateur, ni trace exportée. Le contenu de la Task n'est pas une preuve que l'implémentation future est juste. La voie headless, elle, a échoué sur le quota, la limite de jetons et la lenteur, pas sur le skill.

**Prochaine action.** Pour un run indépendant, ouvrir un fil Freebuff séparé sur ce terrain et rejouer le même cas. Sinon, garder ce run guidé comme preuve de forme, pas comme preuve de protocole complet.

### Critique fonctionnelle du 2026-10-22 21:40

La Task est un document de backlog, pas un programme: elle ne peut pas « faire » ce qui est attendu par elle-même. Revue statique:

- cohérente avec `app.py`: `get_active_config()` retourne un défaut sur absence ou configuration vide; `load_json()` retourne aussi un défaut sur JSON corrompu.
- baseline: `python3 -m pytest -q test_app.py -k "get_active_config or config_default"` rend `4 passed, 193 deselected`.
- actionnable: le contrôle peut vivre dans `if __name__ == '__main__'` et être testé via une fonction qui reçoit `CONFIG_PATH`.
- ambiguïtés: « message explicite » et « code non nul » ne sont pas pinnés; le contournement de `load_json` n'est pas dit; le profil avec clés manquantes (`test_get_active_config_missing_keys`) reste valide, ce que la Task ne contredit pas mais ne dit pas; le fixture de test monkeypatche `CONFIG_PATH`, donc un contrôle à l'import casserait les tests.
- verdict: actionnable, pas vérifiée. Pour prouver qu'elle fait ce qui est attendu, il faut l'implémenter dans une copie et exécuter les quatre cas.

## Étape 6: ce que le raisonnement laisse

Statut: validé le 2026-10-22 21:56.

Décision: l'évaluation ne juge pas le thinking. Elle juge les **traces vérifiables** qu'il laisse:
question posée, décision énoncée avec son motif, source citée, commande lancée, fichier écrit. Une trace
absente n'est pas une faute: c'est une mesure absente, et elle se dit en limite. Une part `reasoning`
montre ce que le modèle a émis, jamais ce qu'il a pensé.

Conséquence sur le protocole: un cas peut déclarer `attendu_details.traces[]`, avec un geste, une preuve
et `requis`. Le harnais ne lit pas encore ce bloc: la grille s'applique à la main dans un run guidé, et
le rapport dit ce qui n'a pas été observé. Décision consignée en [ADR-073](../DECISIONS.md).

## Étape 7: le mode simple, une seule session

Statut: validé le 2026-10-22 21:56.

Décision: le test d'un skill se joue dans la conversation courante. Le même agent est opérateur et
session sous test. Pas de headless, pas de modèle à choisir, pas de second fil, pas d'appel à `ouvrir`.

Ce que le run guidé prouve: la forme du produit, ses chemins, ses écritures, la présence des traces
déclarées. Ce qu'il ne prouve pas: que le skill seul produit le geste, puisque l'agent a lu l'attendu. Le
rapport **doit** porter `session_non_independante`, déclarée. Décision consignée en [ADR-074](../DECISIONS.md).

Pourquoi le headless attend: les trois essais du 22 octobre ont échoué avant le skill (quota OpenRouter
402, limite Groq 413, lenteur locale) et `ouvrir` n'a pas reconnu un brouillon fini par « : ». Ce n'est
pas un abandon: c'est un report, et une nouvelle ADR sera nécessaire pour le rouvrir.

## Journal

| Date | Étape | Décision | Validation |
| --- | --- | --- | --- |
| 2026-10-22 21:05 | 1 | `10-task` retenu | choix initial |
| 2026-10-22 21:08 | 2 | intention et but validés | oui |
| 2026-10-22 21:12 | 3 | produit attendu validé | oui |
| 2026-10-22 21:13 | 4 | gel `95c42aa9`, porte passée | run `2026-10-22-211337-95c42aa9-14d9bc8` |
| 2026-10-22 21:14 | 4 | OpenRouter GLM 5.3 : quota 402 | non concluant, infrastructure |
| 2026-10-22 21:15 | 4 | Groq gpt-oss-120b : 413, 10 152 > 8 000 TPM | non concluant, infrastructure |
| 2026-10-22 21:20 | 4 | Ollama qwen3.6-131k : produit écrit après réponse manuelle | produit incomplet |
| 2026-10-22 21:30 | 4 | arrêt de la voie headless | simplification à décider |
| 2026-10-22 21:31 | 4 | run guidé choisi, terrain propre, brouillon présenté | en attente |
| 2026-10-22 21:33 | 4 | brouillon validé, Task écrite | oui |
| 2026-10-22 21:37 | 5 | rapport guidé écrit | produit conforme à la forme |
| 2026-10-22 21:40 | 5 | critique fonctionnelle: actionnable, non vérifiée | baseline 4 tests verts |
| 2026-10-22 21:56 | 6 | le raisonnement se juge sur ses traces observables | [ADR-073](../DECISIONS.md) |
| 2026-10-22 21:56 | 7 | run guidé, session unique, headless différé | [ADR-074](../DECISIONS.md) |
