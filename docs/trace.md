---
name: Journal des séances
description: Ce qui ne touche pas au besoin du projet (conventions, méthode, outillage du dépôt, maintenance), séance par séance, une entrée auditable par séance
type: journal
status: in-progress
---

# Journal des séances

> Recréé à zéro le 2026-10-15, après l'effacement du soir par le relecteur. Les séances antérieures
> ne sont pas reconstituées ; leurs faits survivent dans les mémoires Mnemolite, énumérées dans la
> Séance 1. Le format des entrées est celui de la fondation documentaire
> [2026-10-15-080225-fondation-documentaire.md](brainstorm/2026-10-15-080225-fondation-documentaire.md),
> approuvée : ce journal est son premier client.

> Nettoyage du 2026-10-16 : les séances 2 et 4 — la campagne d'optimisation du contrat, hors sujet du
> projet — ont été retirées avec leur dossier `docs/contracts/`, sur décision du relecteur. Les numéros
> de séance ne se réattribuent pas : ce journal passe de 1 à 3 à 5. Le registre perd de son côté les
> ADR-007 à 010 et 012, qui traitaient d'`AGENTS.md`. Le détail est en Séance 5.

## Séance 1 — 2026-10-15 (le dépôt est vidé, la fondation documentaire est en brainstorm)

**Objectif.** Repartir de l'effacement : le dépôt ne porte plus que `AGENTS.md`, `README.md`, les
deux MEGA-PROMPT v6 du brainstorm du protocole de test, et cette spec neuve. Recouvrer les bases de
la gestion documentaire — comment on trace tout, on note tout — avant toute autre pièce.

**Fait.**

- L'état du dépôt mesuré après l'effacement : `git status --porcelain` montre (`D
  scripts/docs-index.mjs`, `D docs/trace.md`, `D docs/index.md`, `D docs/dashboard.md`, `D
  .githooks/pre-commit`) et reste resté tout ce que cette page cita hier soir. Mesuré à 08:02
  locales.
- La spec de la fondation est écrite : `docs/brainstorm/2026-10-15-080225-fondation-documentaire.md`
  (nom portant la naissance mesurée par `date`), frontmatter `status: in-progress` depuis son
  approbation, itération ouverte.
- La section `CONSIGN` d'`AGENTS.md` est réécrite sur B1–B6 (mémoire `e5411d2e`), et la phrase
  fausse du 2026-10-14 est corrigée sur place : les appels d'outils sont des parts dans
  `parts_json`, pas des lignes de messages ; 659 tool parts mesurées dans un fil. `AGENTS.md` est
  un contrat vivant ; la section datée du 2026-10-14 ci-dessous ne se réécrit pas.
- Sur ordre explicite, tout l'état de la boucle 1 est commité : `1bbb9d2`, 11 fichiers,
  +605/−938 — l'effacement de la nuit formalisé, la fondation, le journal, la phrase fausse
  corrigée. Statué plus tard dans la séance : l'écriture a continué après ce commit, la clôture
  de la Séance 1 attend le prochain commit.
- La boucle 2 est ouverte comme ordonné : sa spec est écrite,
  `docs/brainstorm/2026-10-15-081511-gestion-de-projet.md` (P1–P6 : critère falsifiable avant le
  travail, dossier de tâche, frontière avec le journal, clôture par vérification, commit de
  clôture, remote). `status: in-progress`, à itérer (mémoire `6bf9e005`).
- Sur correction du relecteur (mémoire `a3e08338` : « tes specs se repetent »), la structure
  documentaire vit dans quatre documents vivants, une page par nature à la manière de l'exemple
  deuteros : `docs/VISION.md` (la raison d'être), `docs/PFD.md` (les phases), `docs/DECISIONS.md`
  (les ADR, où B1–B6 et P1–P6 migrent sans répétition), `docs/DASHBOARD.md` (l'état, à jour après
  chaque séance). Les specs de `brainstorm/` gardent l'origine datée et les verbatims ; le
  contrat vivant se tient dans les quatre documents ; la spec fondation passe à `status: done`,
  la spec boucle 2 à `in-progress`.
- Sur ordre « commit » (mémoire `15a1923b`), la salve entière est commitée : `9768b4c`, 6 fichiers,
+601/−65 — contrat autonome, registre, état, journal. L'arbre est redevenu propre après ce commit.
- Sous ordre du relecteur, cette structure documentaire est commitée :
  `326a5be`, 7 fichiers, +350/−15 (mémoire `439732cd`).
- Le journal est recréé (cette page) ; c'est l'application minimale de B1, pas une anti-coupée.
- Le travail du protocole de test est repris (§4 de la séance) : les deux documents (méga-prompt v6
  et journal v6) sont relus et leurs chiffres remesurés sur le framework `fe48de12` — les quatorze
  figures de surface reproduisent exactement (400, 530/320, 51, 9, 458/16 413, 51, 173, 27, 1), les
  cas `skill-eval` donnent 11/4/5, l'annexe A2 est vérifiée ligne à ligne (`skipped: true` en l.100
  et l.153, la seconde dans `if (broke)` l.151, agrégats l.150/181 ; `resolveProjectRoot` : une
  seule définition `project-root.ts:3-7` et un seul appel `menu.ts:35`), le `pre-commit` porte bien
  18 `run:`, et le dépôt rend lui-même les 3 chemins morts annoncés (`check-referenced-paths.js` →
  exit 1). Dérive signalée : mon premier comptage annonçait 22 contrôles — il comptait les quatre
  crochets ; le chiffre du document est le bon (18 dans le seul `pre-commit`).
- Deux arbitrages du relecteur, qui commandent la suite : (a) **c'est la copie du dispositif du
  méga-prompt v6 qui gouverne** — la copie non suivie du framework (`??`, 563 l, md5 `4a507d69…`)
  porte l'ancienne rédaction de A2-3, réfutée, contre la copie suivie du dispositif (574 l, md5
  `680542853f…`) ; le `diff` est un seul bloc, et la remesure donne raison au dispositif ;
  (b) **le runner est la session de l'opérateur**, ce qui tranche la contradiction relevée par le
  journal v6 §6 et rend l'état A atteignable sans binaire headless.
  Dérive signalée, **non corrigée, hors de ma portée** : la copie périmée du framework ne se
  supprime pas d'ici — `/home/giak/projects/framework` est l'arbre `framework-origin`, read-only par
  contrat, et le toucher ferait tomber la preuve « deux `git status --porcelain` identiques ».
  Elle demande la main de l'opérateur (ou une exception de territoire écrite).
- **Spec du run par session d'opérateur écrite**, sur l'ordre « écris la spec du run mené par une
  session d'opérateur : ce qui part, ce qui revient, et quelle preuve atteste que le run a eu lieu » :
  `docs/tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-130103-spec.md` — nom
  portant sa naissance mesurée (`stat -c %w` → `2026-10-15 13:01:03`), 176 lignes, 9 592 octets
  (9 589 avant la correction du renvoi relatif), `status: pending`. La **demande** y est `CASES/<cas>.request.md` (huit champs, empreinte de `CASES/`
  enregistrée avant toute ouverture de session, l'attendu qui ne part jamais) ; le **produit** est une
  copie verbatim avec manifeste `sha256`/taille/`birth`, le message final de la session, l'export de
  trace et `receipt.json` ; la **preuve** est ordonnée en trois pièces — la trace machine de la session
  (trois sources constatées ici : `desktop-v2.db` de Freebuff Desktop et ses tables, les `.jsonl` de
  claude CLI, `opencode.db` et `storage/` d'opencode), l'état des arbres avant/après, l'empreinte
  antérieure de la demande — la parole de l'opérateur n'étant reçue que comme témoignage étiqueté. Elle
  porte aussi les quatre conditions qui rendraient fausse l'affirmation « le run a eu lieu », et la
  règle « le verdict suit la preuve ».
- **Incident de territoire, réparé dans le tour.** L'écriture de cette spec a d'abord atterri dans
  `framework-origin` : les outils de fichiers du client résolvent un chemin **relatif** contre la racine
  du projet du client (le framework), pas contre ce dépôt. Réparé : contenu copié dans le fichier du
  dispositif (qui garde sa naissance), puis `rm -rf /home/giak/projects/framework/docs/tasks`. Preuve
  du retour : `git -C /home/giak/projects/framework status --porcelain` → les deux lignes d'avant
  (`.freebuff/`, `aidd_docs/MEGA-PROMPT-TEST-AIDD-v6.md`), et `docs/tasks` absent de l'origine.
- **Le dispositif reçoit ses deux premières pages**, sur l'ordre « Écris DEVICE.md et BOUNDARY.md du
  dispositif à partir du §7 amendé, sans coder le dispositif lui-même » :
  `docs/device/DEVICE.md` (895 mots, limite du §10 : 900 ; 105 lignes) et `docs/device/BOUNDARY.md`
  (1 013 mots, 128 lignes) — chiffres finaux, après les deux retouches de forme du tour.
  `DEVICE.md` porte ce que le dispositif fait et ne fait pas, les trois rôles et la séparation
  réellement tenue (« de contexte, pas de personne » — question 4 du §11), l'état (**état B** :
  aucune session n'a reçu de demande), les huit champs de la demande, ce qui revient, la commande de
  clonage et la révision `d02b750` (le sommet d'alors), la séquence d'un run dont seule la première
  ligne existe, et la
  correspondance nom du v6 §10 → foyer. `BOUNDARY.md` porte les quatre arbres, les chemins lus
  (2 599 fichiers suivis, 51 `SKILL.md`, 400 fichiers `cli/src`, 17 `scripts/*.mjs|js` — tous
  revérifiés), la révision installée `fe48de12`, ce qui n'est pas lu, et les deux preuves :
  framework intact (porcelain 2 lignes et HEAD inchangés avant et après l'écriture), et aucun
  fichier du dispositif appartenant au framework. Aucun code écrit, conformément à l'ordre.
  Décision de foyer consignée (ADR-013, mémoire `118a0d4f`) : `docs/device/`, noms du v6 conservés,
  sans préfixe daté, pour ne pas faire violer au dispositif la règle qu'il enseigne.
- **La clause de preuve du v6 §10 est arbitrée et réparée dans le document**, sur l'ordre « Arbitre la
  clause de preuve du v6 §10, mesurée insatisfiable telle qu'écrite, et répare-la dans le document »
  (ADR-014, mémoire `2dc0e6a0`). Les trois lectures de la clause ont été mesurées avant de trancher :
  par **chemin** seul, `LC_ALL=C comm -12` des deux `git ls-files` triés rend 2 lignes, `AGENTS.md`
  et `README.md` — insatisfiable pour tout dépôt qui a ses deux pages d'entrée ; par **contenu**
  seul, 0 commune sur 2 556 empreintes distinctes côté framework et 11 côté dispositif, mais 13
  fichiers vides suivis chez l'origine (blob `e69de29b…`) casseraient le contrôle au premier
  `.gitkeep` écrit d'un côté ; par **paire** chemin + contenu (`git ls-files -s`), 0 commune sur
  2 599 paires contre 11. Réparé sur la troisième, la seule qui décide, et le document dit lui-même
  pourquoi les deux autres ne décident pas : §10 et §11 Q7 exigent l'intersection vide des paires.
  Mesures après réparation : md5 `607eebaf…` → `a33f947d…`, `wc -l` 600 → 605 ; `BOUNDARY.md` §6
  réécrit sur l'ordre des raisons et re-relevé (1 013 → 1 383 mots). Le journal v6, lui, n'est pas
  touché : c'est un enregistrement daté.
- **Le harnais minimal du run est écrit**, sur l'ordre « Écris le harnais minimal du run — gel de
  l'empreinte de `CASES/`, manifeste des produits, reçu, comparaison attendu/produit — sans ouvrir de
  session » (mémoire `9f15f4d7`). Un fichier, `docs/device/harness/run.mjs`, Node 22 ESM, sans
  dépendance, quatre commandes adossées chacune à un paragraphe de la spec : `freeze` (§3 Figement,
  §5.2 avant — sha256, taille et `birth` des fichiers du cas, références du framework, état des trois
  arbres), `collect` (§4 — copie verbatim sous `runs/<id>/raw/<cas>/`, manifeste par fichier, copie
  relue contre la source), `receipt` (§6, §5, §7 — reçu écrit à chaud, falsificateurs, plafond de
  verdict), `compare` (§8, v6 §10 — l'écart et la phrase, depuis le reçu seul). Il n'ouvre aucune
  session et ne décide rien : il **refuse** — un gel sans attendu, un gel, un produit ou un reçu déjà
  là, un lien symbolique dans le produit, un champ manquant dans `faits.json`, et tout verdict que la
  preuve ne porte pas (produit né avant le gel, arbre de travail inchangé, produit identique à une
  empreinte antérieure, cloisonnement rompu, rien produit). Vérifié par un banc jetable hors des
  quatre arbres, non commité (`/tmp/aidd-harness-test.sh`) : **36/36 PASS, 0 FAIL** (`node --check`
  compris), les quatre commandes, les onze refus, et les conditions 1 et 3 du §5 isolées l'une de
  l'autre. Sur le vrai cas, il refuse — le gel d'un cas sans attendu ne prouverait pas « écrit avant
  d'avoir vu le produit » — et laisse `CASES/` intact. La spec du run passe `pending` →
  `in-progress` : l'ordre tient lieu d'approbation, et la phrase qui interdisait d'écrire la moindre
  ligne de dispositif avant l'approbation est corrigée sur place. `DEVICE.md` porte le harnais, ses
  cinq gestes et 897 mots (limite du §10 : 900).
- **Le premier cas est complet et gelé**, sans qu'aucune session ait été ouverte. L'attendu
  (`CASES/2026-10-15-133423-promesse-memoire-avant-ecriture.expected.json`, 12 985 o, `sha256`
  `d9b4ee01…`) porte les
  champs du v6 §10 — identifiant, la demande verbatim remise au skill, le contexte de départ
  (révision `4c39e5c59`, arbre `4c79f56a…`, terrain `416ec1f`, les deux copies, les interdits),
  l'attendu en une phrase, les sources dont il se lit — plus **8 falsificateurs du run**, **4
  falsificateurs de l'attendu** et **7 attendus écartés** avec leur critère. Le gel
  (`…freeze.json`, `gele_le` `2026-10-15T15:29:49.581938260+0200`, empreinte `1b9a8434…`, refait
  après la rectification 6 ci-dessous) couvre les deux fichiers du cas — naissances 13:34:50 et
  15:26:49, toutes deux antérieures au gel, `sha256` recalculés après coup et identiques —,
  **8 références** de la révision sous test (`SKILL.md`,
  `01-scan.md`, `02-write.md`, `scan-summary.md`, `memory-destinations.md`, `structure.md`,
  `memory-rules.md`, `reading-sources.md`) et **4 arbres** : `framework-origin` `fe48de12` (ses 2
  lignes `??`, inchangées), `terrain` `416ec1f` (1 ligne, `?? .freebuff/`, ADR-011),
  `revision-sous-test` `4c39e5c5` propre, `travail` `416ec1f` propre. L'état B tient : `receipt`
  refuse faute de manifeste — aucun run n'a eu lieu, et rien ici ne l'atteste. L'attendu se lit dans
  la révision sous test, jamais deviné : la colonne `Write to` de `memory-destinations.md` fixe les
  destinations, la seule correction de l'opérateur (`memory/backlog.md` écarté) est un falsificateur,
  et les deux règles que la session doit tenir — aucun `TODO` ni `<placeholder>` sous `memory/`,
  rapport final — viennent des Tests de `02-write.md` et de la règle transverse de `SKILL.md`.
- **La demande du premier cas a été rectifiée en tête**, l'état ayant contredit deux de ses lignes :
  `status: frozen`, hors de `pending`·`in-progress`·`done`·`blocked`, → `pending`, et l'affirmation
  d'un gel « pris au même moment » → « pris à l'étape 2, avant toute ouverture de session », le gel
  existant désormais. Le texte verbatim du §5 et les deux réponses figées du §8 n'ont pas bougé ; la
  rectification est écrite dans le fichier, et le gel qui suit porte les empreintes du texte rectifié.
- **La séance est commitée en cinq commits et le dépôt public est ouvert**, sur l'ordre « commit
  tout, en plusieurs commits ; puis créer un dépôt public sur GitHub, on va push après » (mémoire
  `6c040683`). Les commits suivent l'ordre où les choses ont été faites : `81f8ca4` (la spec du run et
  les deux pages du dispositif, 3 fichiers, +451), `1362837` (le harnais, +448), `ffbdee4` (le
  premier cas gelé, 3 fichiers, +478), `f90851d` (le foyer, la clause du §10 réparée, l'état et le
  journal, 6 fichiers, +274/−17), puis « Dire l'état vrai du remote » (`DEVICE.md`, `DASHBOARD.md`,
  cette page, +17/−5) — l'arbre est propre après le cinquième. Puis
  `gh repo create aidd-device --public --source=. --remote=origin` : **aucun push**, `git ls-remote
  origin` vide et `gh repo view --json isEmpty` à `true`, le dépôt public
  (`https://github.com/giak/aidd-device`, créé le 2026-10-15T13:32:20Z) existe et ne porte rien
  encore. La conséquence est dite là où elle compte : `DEVICE.md`, le `DASHBOARD.md` et cette page ne
  disent plus « aucun remote », et la question 1 du §11 ne se répond « oui » qu'après le premier push.
  Commiter a aussi déplacé la révision que deux pages citent : `DEVICE.md` et `BOUNDARY.md` disaient
  `d02b750`, le sommet d'avant la séance ; le sixième commit, « Faire suivre la révision citée aux
  commits », leur fait porter `39750fe`, relevé du 2026-10-15, et `BOUNDARY.md` dit en plus l'état
  d'après les commits (18 fichiers suivis, `status --porcelain` vide).
- **La conduite du run du premier cas est écrite**, sur l'ordre « Prépare la conduite du run du
  premier cas : ce qu'il faut relever avant d'ouvrir la session, ce qui se remet mot pour mot, et ce
  qui doit revenir après » (mémoire `0aeef2f8`).
  `docs/tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md`, né à
  15:43:03 (`stat -c %w`), type `run`, `status: pending`, 2 093 mots. Il dit l'ordre des quatre
  commandes du harnais, ce que le reçu exigera sans pouvoir le lire (`faits.json`, la trace machine),
  le texte remis mot pour mot et les deux réponses figées, puis ce qui doit revenir. Avant de
  l'écrire, le gel a été revalidé sur disque — formule du §5.3 recalculée : les 10 `sha256` (2
  fichiers du cas, 8 références) et l'empreinte `1b9a8434` concordent, les 4 arbres rendent leurs
  `HEAD` et `porcelain` gelés, `docs/device/runs/` n'existe pas — et les commandes du §3 ont été
  éprouvées sur un banc jetable sous `/tmp` : `collect` ok, second `collect` refusé, `receipt`
  `non concluant` (condition 3 mordante sur un faux produit), `compare` ok, `receipt --verdict ecart`
  refusé. Le banc n'est pas un run, et la conduite le dit. La page entre au dépôt au septième
  commit `5cd0233`, « Consigner la conduite du run du premier cas » — le cas, son gel et le harnais
  y étaient déjà (`ffbdee4`, `1362837`) et rien d'eux n'est repris, ce que `git diff --stat HEAD~1
  HEAD -- docs/device/` confirme en ne rendant rien.
- **Un point laissé `OPEN` par cette conduite**, nommé plutôt que tranché : le §5 de la demande exige
  que le texte remis à la session soit les deux lignes entre gardes *et rien d'autre*, alors que le
  §7 lui interdit quatre choses. Comment les interdits atteignent la session sans ajouter de texte
  au §5 n'est pas décidé : la conduite dit que les énoncer serait un écart à consigner dans le reçu,
  jamais ajouté en silence. Arbitrage du relecteur.
- **`main` est poussée sur le dépôt public**, sur l'ordre « Pousse la branche main vers origin et
  vérifie que le dépôt public rend bien les 6 commits, puis dis si la question 1 du §11 passe à
  « oui » » (mémoire `6a329774`). `git push -u origin main` → exit 0, `* [new branch] main -> main`,
  `848ad7a6a84e5a57f6eb22c6b41a37beb903466d` ; la branche portait **18** commits, pas 6 — les six du
  libellé étaient le lot du tour précédent, et `git rev-list --count HEAD` le dit avant le push.
  Vérifié côté GitHub : `git ls-remote origin refs/heads/main` rend le même hachage que le HEAD
  local ; `gh repo view` → `isEmpty false`, `PUBLIC`, branche par défaut `main`, `pushedAt`
  `2026-10-15T13:49:35Z` ; l'API sert les trois fichiers de `CASES/` et les deux documents du dossier
  de tâche ; `git diff --stat origin/main` est vide ; le blob de la conduite est identique des deux
  côtés (`ecff6b57…`) ; `39750fe`, la révision du dispositif citée dans `DEVICE.md`, est un ancêtre
  de `origin/main`.
- **Le point `OPEN` de la conduite est arbitré — ADR-015**, sur l'ordre « mesure si une session tient
  le cadre du §7 sans qu'on énonce les interdits, et tranche en conséquence » (mémoire `691e913c`).
  Mesures à la révision sous test `4c39e5c5` : `references/tools.md` et `hooks/update_memory.js`
  visent `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `.github/copilot-instructions.md` et
  `aidd_docs/**` — des chemins **relatifs au projet** ; le `git add` du script ne tourne que pour le
  hook automatique, jamais quand la skill l'appelle ; l'étape 3 de `actions/04-sync.md` attend le
  choix de l'utilisateur avant d'écrire. Aucune étape de la skill n'écrit donc hors du projet. En
  face, ce qui a réellement fait sortir un agent du cadre ce jour-là n'est pas un manque de paroles
  mais la résolution d'un chemin relatif par le client contre **sa** racine de projet — les deux
  incidents de 13:0x et 13:34. Décision (ADR-015) : le §5 garde sa lettre, les interdits ne se disent
  pas, la session s'ouvre avec sa **racine de projet** posée sur `$W/terrain` ; l'ADR porte ce qui le
  rendrait faux (une session quittant le cadre par ses propres décisions au premier run). Le §7 de la
  demande justifiait le retrait du câblage par « des fichiers hors du répertoire de travail » : faux à
  cette révision, la raison est remplacée par la mesure et la prohibition demeure (seconde note de
  rectification en tête du fichier). Le gel est refait avant toute ouverture de session : `1b9a8434`
  détruit, `bc126fe6` au `2026-10-15T15:59:39.604335300+0200`, empreinte recalculée sur disque =
  gelée ; le reste du cas est inchangé (attendu `d9b4ee01`, 8 références, 4 arbres).

**Vérifié.** `date +'%Y-%m-%d-%H%M%S'` → `2026-10-15-080225` au moment de la création. Pas d'autre
mesure : aucun script ne contrôle quoi que ce soit (« pas de script », arbitrage 4 de la séance) ;
ce journal est écrit à la main et se déclare reconstitution.

**Dérives signalées, non corrigées.**

- L'état initial : des documents effacés en `D` non commités et `AGENTS.md` modifié non commité,
  rien n'étant alors citable tant que le relecteur ne demande pas de commit (L4). Résolu dans la
  séance : le commit `1bbb9d2` a formalisé l'effacement et la fondation, à sa demande explicite.
- La règle NAMING d'`AGENTS.md` exige des secondes (tenue), et la section `CONSIGN` portait la
  phrase fausse du 2026-10-14, réfutée par la mémoire `12cdb674` et par la mesure de 659 parts
  d'outils. Traité dans la séance : `CONSIGN` réécrite, phrase corrigée sur place.
- Les outils de fichiers du client résolvent un chemin relatif contre la racine du projet du client,
  pas contre ce dépôt : toute écriture relative faite d'ici peut atterrir dans `framework-origin`.
  **Deux occurrences le même jour**, deux fois réparées : la spec du run vers 13:0x (`docs/tasks`
  copié dans le dispositif puis retiré de l'origine), et la demande du premier cas à 13:34
  (`docs/device/CASES/2026-10-15-133423-…request.md` retrouvée chez l'origine, remise dans
  `docs/device/CASES/`, `docs/device/` retiré de l'origine). Preuve du retour, les deux fois :
  `git -C /home/giak/projects/framework status --porcelain` → les 2 lignes documentées
  (`.freebuff/`, `aidd_docs/MEGA-PROMPT-TEST-AIDD-v6.md`). La cause n'est pas réparée — la parade
  tenue est d'écrire en chemin absolu, et rien dans le dépôt ne la contrôle.
- **La clause de preuve du v6 §10 était fausse telle qu'écrite** : signalée, non corrigée d'abord
  (le document n'était pas de l'agent, et la règle veut qu'une clause contredite se répare sur ordre,
  jamais en silence), puis **réparée sur ordre du relecteur** dans le tour suivant (ADR-014,
  mémoire `2dc0e6a0`, entrée correspondante dans **Fait** ci-dessus). Mesure de la dérive :
  `LC_ALL=C comm -12` des deux `git ls-files` triés rendait **2 lignes**, `AGENTS.md` et `README.md`
  — deux dépôts qui portent chacun leur page d'entrée partagent forcément ces noms. Ces deux fichiers
  ne sont pas les mêmes (sha256 `499b6a99…` contre `030506ef…` pour `AGENTS.md`, `aae97f91…` contre
  `9920d7e1…` pour `README.md`), l'intersection des **contenus** est vide (2 556 empreintes distinctes
  côté framework, 11 côté dispositif, 0 commune) mais le framework suit 13 fichiers vides, et
  l'intersection des **paires** chemin + contenu est vide (2 599 contre 11, 0 commune). `BOUNDARY.md`
  porte les trois relevés et retient la paire ; le v6 §10 et sa question 7 sont réparés à la source.
  La même phrase, recopiée dans le PFD (« l'intersection des fichiers est vide »), avait déjà été
  corrigée là où elle décrivait le dispositif.
- **Une tension entre l'ordre et un invariant, nommée.** `AGENTS.md` §`CONSIGN` porte « No script,
  no hook, no CI by default: a mechanical check is earned by demonstrated drift, never promised ».
  Le harnais écrit ce jour n'est pas un contrôle sur le dépôt : c'est l'instrument du run, exigé par
  le v6 §10 et par les §3, §4 et §6 de la spec, et ordonné par le relecteur. Les deux lectures sont
  nommées ; si la seconde est la bonne, le harnais se supprime et les quatre gestes redeviennent
  manuels.
- La demande du premier cas porte `status: frozen`, hors de l'ensemble autorisé
  (`pending`·`in-progress`·`done`·`blocked`), et affirme que l'empreinte du cas « est dans
  `…freeze.json`, prise au même moment » : ce gel n'existe pas, et le harnais refuse de le prendre
  tant que l'attendu manque. Corriger l'artefact d'une autre tâche est un arbitrage du relecteur :
  nommé, laissé tel quel.
- **Le titre de cette séance ne couvre plus ce qu'elle tient**, nommé et non corrigé. Elle s'ouvre
sur « le dépôt est vidé, la fondation documentaire est en brainstorm » et porte depuis la boucle 2,
la remesure du v6, l'amendement de son §7, l'arbitrage du contrat unique et les deux pages du
dispositif. Numéroter une séance neuve pour la suite du jour est un arbitrage du relecteur, pas une
correction d'agent sur une section vivante.

**Prochaines étapes (TODO).**

1. Itérer la spec avec le relecteur (c'est le brainstorm ouvert).
2. Une fois approuvée : réécrire `CONSIGN` d'`AGENTS.md` sur son modèle — **fait ce jour** ; puis
   ouvrir la boucle 2 (gestion de projet : unité de travail, critère falsifiable, commit) —
   **fait ce jour**, commit `1bbb9d2` puis spec `081511` en itération.
3. Arbitrer la spec boucle 2 : le commit debout de P5, le remote de P6.
4. Après l'approbation de la boucle 2 : le vrai travail, le protocole de test du framework
   (MEGA-PROMPT v6).
5. **Fait ce jour** sur la copie qui gouverne : le §7 du méga-prompt v6 est retitré « Le runner :
   une session d'opérateur » et dit la décision (aucun runner sans interaction ici, donc le runner
   est la session que l'opérateur ouvre, et l'indépendance des rôles ne dépend d'aucune capacité de
   spawn) ; les états A/B sont reformulés (état A : quelle session, la demande exacte remise, la
   preuve de réponse, où vit le produit brut ; état B : la session demandée et la réponse obtenue ou
   son absence), et `DEVICE.md` porte la demande exacte, `ATTEMPT.md` la session demandée à la place
   de la « sortie brute » qui n'existe pas. Les deux trous sont fermés : le §8 dit ce que la phrase
   de verdict a le droit d'affirmer (une comparaison, jamais une attribution ; Q2 renvoie à §8), et
   `NEGATIVE.md` dit qu'**une raison documentée n'est pas un contrôle fait** (Q6 sans réponse, donc
   « non », donc pas fini en état A). Mesures après retouches de forme : `wc -l` 574 → 600, md5
   `680542853f6a98bd3830a98b1ee87faa` → `607eebafb3bbf1d273c3513d26d19e52`, `liens_morts=0`. Le
   `OUVERT` du §6 du journal v6 reste tel quel : c'est un enregistrement daté, la résolution vit ici.
6. Arbitrer la spec du run par session d'opérateur : elle commande la phase 2 du PFD (`DEVICE.md`,
   `BOUNDARY.md`, `CASES/`), et la question qu'elle laisse ouverte — l'emplacement des artefacts du
   dispositif. Cette ligne disait « que le v6 veut à la racine » : c'était mon inférence, rectifiée
   à l'arbitrage (rectification 5 ci-dessous). Le foyer est tranché : `docs/device/` (ADR-013,
   mémoire `e185e4da`).
7. **Conduire le run** : la conduite est écrite (`2026-10-15-154303-run.md`), le gel tient, les
   commandes sont éprouvées. Reste le geste humain — ouvrir la session neuve, remettre le texte du
   §5, tenir le budget de trois échanges — puis `collect`, `receipt`, et le `compare` du juge.

- Sort du worktree tiers dans le terrain, tranché le 2026-10-15 (ADR-011, mémoire `ea3c4010`).
  Mesures (`git -C /home/giak/projects/audio-sync-tool …`) : le terrain enregistre lui-même le
  worktree, détaché sur `416ec1f`, son propre HEAD (`416ec1fa08b7c8cabb8dedb4d5fd0eec37a5afde`) ;
  mtime 2026-09-25 20:21 ; arbre de travail propre ; `.kilo/worktrees/` est dans
  `.git/info/exclude` (ligne 9) ; aucun run du dispositif n'a eu lieu (`docs/tasks` absent).
  Conséquences pour l'appareil : constaté, conservé, **aucune clause ajoutée** — la règle oblige
  l'appareil et n'interdit rien à un outil tiers déjà présent ; supprimer ou déplacer serait
  écrire dans un arbre déclaré read-only pour un gain mesuré nul, et déplacer rendrait caduc le
  registre du dépôt principal (mécanisme rectifié plus bas : c'est `gitdir` du dépôt principal, pas
  le `.git` du worktree, qui pointe l'ancien chemin). Seul écart réel, nommé et non corrigé :
  `?? .freebuff/` (37 octets,
  2026-10-14 15:49), écrit par le client dans un arbre read-only, non ignoré, laissé en place.

**Rectifications de ses propres affirmations.** Trouvées par le double-check ordonné par le
relecteur (mémoire `731fb8d3`) : (1) la paragraphe « mémoires antérieures » avait fait passer
`8c78b47e` et `50add890` pour antérieures à la séance, alors qu'elles ont été écrites ce matin
dans cette séance — corrigé dans la liste ci-dessous ; (2) `VISION.md` citait les chiffres du v6
comme acquis — désormais marqués `SUPPOSÉ(MEGA-PROMPT v6 §2)` ; (3) `DECISIONS.md` ADR-001 citait
« tu n'a rien fait » sans attribution et avec une ponctuation transformée — citation exacte
rétablie, attribuée à `e493b0b8` ; (4) j'avais écrit « `.agents/` (cinq skills) » dans la mémoire
`a31a4ac2` du même jour, et la carte de suite proposée au relecteur portait ce chiffre — comptage
fait dans ce tour : **trois** skills, pas cinq ; la rectification vit dans la
mémoire `594f7674`, le chiffre faux reste lisible dans `a31a4ac2`, non réécrit ; (5) j'ai écrit ici
que le v6 §10 « veut à la racine » les artefacts du dispositif. Mesure faite au tour de
l'arbitrage du foyer : `grep -n 'racine'` sur le méga-prompt v6 → **une seule ligne**, l.524 de
l'annexe A, et elle parle du *résolveur de racine du framework* (`project-root.ts`), pas du parent
des artefacts ; sur le journal v6 → aucune. Le §10 nomme les artefacts sans dossier parent — le seul
chemin à dossier côté dispositif est `runs/<horodatage>-<framework@rev>-<dispositif@rev>/output.json`. Le document est muet sur le
parent : c'est le contrat du dépôt qui le comble, et la ligne 186 lui prêtait une prescription qu'il
ne porte pas. Le v6 n'a pas été touché ; `docs/device/` reste le foyer (ADR-013), et l'indirection
est payée par une porte d'entrée dans `README.md`. (6) Le premier gel du cas a d'abord été pris
(15:27:08) sur un attendu dont des citations étaient inexactes : « no TODO and no <placeholder>
remains » écrit sans les deux backticks du fichier source, et une citation de `01-scan.md` dont le
lien interne avait été abrégé. Les 15 citations de l'attendu — spans entre « … » — ont été repassées
une à une sur les fichiers gelés, la demande et le message du commit `4c39e5c59` : 14 viennent des
fichiers de la skill, une du message du commit (« survives a refresh 1 run in 2 »), une de la demande
(« Everything else is right. »). Les rectifications faites, l'attendu portait `d9b4ee01…` au lieu de
`9da9b265…`, et le gel, devenu caduc, a été refait (`--refreeze`, 15:29:49) : le gel précédent est
détruit, jamais conservé à côté d'un texte qu'il ne couvre plus. La naissance de l'attendu reste
15:26:49 — une rectification ne la déplace pas —, et le gel porte l'empreinte du texte tel qu'il est.
(7) J'ai écrit, dans `DEVICE.md`, dans le `DASHBOARD.md` et ici même, que la question 1 du §11 se
répondrait « oui » après le premier push. C'est faux, et la mesure le dit : la question demande de
**récupérer**, de **faire tourner** et de **lire l'écart**. Le push remplit la première clause — un
clone public rend `848ad7a` — mais « faire tourner » exige la révision sous test, qui vit dans
`/home/giak/projects/framework`, non publié, et « lire l'écart » exige un `output.json` qui n'existe
pas : aucun run n'a eu lieu. La question reste « non », et les trois pages sont réparées. La leçon
est la même qu'ailleurs dans cette séance : un artefact publié ne vaut que pour la clause qu'il
satisfait, jamais pour la question entière.

**Mémoires de la séance.** `8c78b47e` le verdict du matin (« enfonce des portes ouvertes »,
« tout revoir ») ; `50add890` la remise à plat et la correction du pivot (`aidd_docs/<date>.md`
refusé) ; `e493b0b8` l'effacement et la demande de fond en comble ; `7f2cd67b` les
quatre arbitrages (fondation d'abord, trop vite, baby steps, pas de script) ; `44bd6559` l'exemple
deuteros et ses leçons ; `f923e5ff` l'ordre d'écrire les specs sur disque en itération ; `e5411d2e`
l'approbation de la fondation ; `a3e08338` la correction des  specs répétées et la structure VISION/PFD/DECISIONS/DASHBOARD à la deuteros ; `731fb8d3` le
  double-check et ses corrections ; `439732cd` le second commit ordonné, la question « P5/P6 ? »
  qui prouve le jargon interne. Une mémoire antérieure à la séance,
  qui survit à l'effacement des fichiers : `12cdb674` (les cinq décisions du 14 et la réfutation
  du « 0 tool rows »). Du tour suivant : `118a0d4f` les deux pages du dispositif
  (`DEVICE.md` 895 mots, `BOUNDARY.md` 1 013), le foyer `docs/device/` (ADR-013), la clause du §10 mesurée
  fausse sous sa lettre, et l'état B déclaré — aucun run n'a eu lieu. Et, de  l'arbitrage du foyer :
  `e185e4da` — le v6 ne prescrit nulle part la racine (une occurrence du mot, l.524, et elle parle du
  résolveur de racine du framework), ma trace affirmait le contraire, et `docs/device/` est gardé sans
  qu'aucune exception soit nécessaire. De l'arbitrage de la clause de preuve : `2dc0e6a0` — le §10
  mesuré insatisfiable sous trois lectures (chemins, contenus, paires), la réparation du document
  sur ordre, et la seconde occurrence de l'incident de territoire, réparée dans le même tour. Du tour
  suivant : `9f15f4d7` — le harnais minimal du run, ses quatre commandes, ses onze refus, le banc
  jetable à 36/36, et la tension nommée avec l'invariant « pas de script ». Du tour d'après :
  `ba4885cf` — le premier cas écrit et gelé (attendu, 8 falsificateurs du run, 4 de l'attendu, 7
  attendus écartés, `gele_le` `15:29:49`), la demande rectifiée, l'état B intact. Du tour suivant :
  `6c040683` — les six commits de la séance et le dépôt public ouvert, sans push. Du tour suivant :
  `0aeef2f8` — la conduite du run écrite (`2026-10-15-154303-run.md`), le gel revalidé sur disque
  (10 `sha256` et l'empreinte `1b9a8434`), les quatre arbres inchangés, les commandes du §3 éprouvées
  sur un banc jetable, et les deux points laissés ouverts (les interdits du §7, le verdict). Du tour
  suivant : `191bbf9b` — la prémisse de l'ordre corrigée par mesure (le cas, son gel et le harnais
  étaient déjà au dépôt : `ffbdee4`, `1362837`) et le commit `5cd0233`, qui n'ajoute que la conduite
  et l'entrée du journal, jamais un message qui nommerait ce que son diff ne porte pas. Du tour
  suivant : `6a329774` — le push de `main` sur le dépôt public (`848ad7a`, 18 commits, vérifié côté
  GitHub), et la question 1 du §11 mesurée clause par clause : « non », le push ne remplissant que la
  récupération, et les trois pages qui affirmaient le contraire réparées. Du tour suivant :
  `691e913c` — l'arbitrage du cadre (ADR-015) sur mesures de `tools.md`, `update_memory.js` et
  `04-sync.md`, la rectification du §7 de la demande, et le gel refait (`bc126fe6`, `1b9a8434`
  détruit). Du tour suivant : `59a2f37b` — `docs/EXPLICATION.md`, le projet raconté à qui n'en connaît
  rien (la fiche de recette, l'enveloppe scellée, les quatre arbres, les quatre pièges, l'état B,
  échecs et réussites), 3 schémas et 0 lien interne cassé ; **rectification de mon fait dans le même
  tour** : mon §5 dessinait cinq arbres, dont un `travail` que j'avais posé comme cinquième alors
  que la conduite gèle exactement quatre arbres — `framework-origin`, `terrain` lus et jamais
  écrits, `revision-sous-test` (`$W/framework-origin`) et `travail` (`$W/terrain`) — le schéma et le
  titre de section sont refaits sur le vocabulaire gelé ; et la phrase fausse du `README.md` (« son
  harnais reste à écrire ») réparée, alors que `run.mjs` (448 lignes) existe depuis 15:21. Du tour
  suivant : `d7ec5531` — le gel `bc126fe6` rejoué depuis un **clone neuf du dépôt public** : la formule
  du §5.3, réimplémentée sans le harnais, rend les `10/10` empreintes de fichiers et l'empreinte
  globale `bc126fe6…` à l'identique, les 8 références relues dans un clone public de
  `ai-driven-dev/framework` à `4c39e5c5` (le `fetch` par SHA y est refusé : clone `--filter=blob:none`
  puis `checkout`). Les quatre arbres rendent les `HEAD` et `porcelain` gelés. Quatre limites
  mesurées, non supposées : `fe48de12` n'est dans aucune branche distante, la naissance des fichiers
  n'est pas transportée par git (`16:28:44` au clone pour des fichiers nés à `13:34:50` et `15:26:49`),
  les lignes `porcelain` sont locales à la machine, et la commande gelée porte des chemins absolus —
  le tiers doit substituer les siens pour rejouer. `terrain` reste vérifiable sans cloner :
  `git ls-remote https://github.com/giak/audio-sync-tool.git main` → `416ec1fa…`. Du tour suivant : `79f3858f` — rejeu du gel **en tiers qui doute**, depuis un second clone neuf (`/tmp/tiers2-20261015-163144`, HEAD `1d471a5`, arbre propre) : `10/10` empreintes et `bc126fe6…` ; l'horloge corrobore ce que le gel déclare (`gele_le_epoch` → `2026-10-15T15:59:39+02:00`, exactement `gele_le` ; les deux `birth_epoch` rendent leurs dates au centième près), la prémisse du cas est vraie (`$W/terrain` n'a pas d'`aidd_docs`, il est accessible en écriture), et les quatre arbres tiennent après tous les bancs. **Un défaut trouvé par ce doute, mesuré et non déduit** : hors `freeze`, le harnais ne hache plus jamais les fichiers du cas — `receipt` et `compare` lisent le gel, pas le disque. Banc 2 : `request.md` réécrit dans un `--cases` jetable → `receipt` **exit 0** et `demande.sha256` recopie la valeur gelée. Banc 3 : `expected.json` réécrit (`attendu` est une chaîne de 447 caractères) → `compare` **exit 0** et `output.json.attendu` porte le texte réécrit pendant que le reçu cite `bc126fe6`. L'invariant « l'attendu écrit avant le produit » ne tient donc que par le rejeu manuel du §1.1 et par la parole de l'opérateur. Réparation proposée, non appliquée : re-hacher `gel.fichiers` + `gel.references` dans `receipt` et `compare`, refuser sur écart. Du tour suivant : `191f5687` — **ADR-016**, le gel ne stocke plus que des chemins relatifs : `fichiers[].chemin` relatif à la racine du dépôt (nom de base seul hors du dépôt), `references[]` nomme l'`arbre` où le fichier a été haché à la place de `racine`, `--ref-root` doit être l'un des `--arbre` (refus mesuré, exit 1), et chaque arbre porte ses `remotes` — sans quoi un label ne dit pas où le reprendre ; les chemins des arbres restent absolus, « où cette machine a lu cet arbre » étant un fait. Gel refait à `16:36:06.165096639+0200` : **empreinte inchangée**, `bc126fe6` — la formule ne hache que rôle, nom de base et `sha256`. Le §1.1 de la conduite est réécrit en rejeu d'un seul paramètre (`RACINE_FRAMEWORK`, aucun chemin réécrit), il vérifie le `HEAD` de l'arbre et sort en `1` sur un seul `False` : éprouvé depuis un clone neuf (exit 0, 10/10) et sur `main` au lieu de `4c39e5c5` (exit 1, `False` — les huit fichiers y sont identiques, seul ce contrôle distingue les deux). Régression vérifiée sur banc : verdict interdit refusé, reçu et `compare` inchangés. Le compte de refus passe de 29 à 30 et `run.mjs` de 448 à 479 lignes ; les pages qui citaient 29 refus et le scellé de 15:59:39 sont rectifiées. Du tour suivant : `8fac6e0b` — **ADR-017**, l'origine du framework est publiée : `git push origin fe48de12:refs/heads/gel/2026-10-15-fe48de12` sur `github.com/giak/framework` (ref neuf, `main` et l'upstream intacts), après mesure que le commit n'était dans aucune branche distante et qu'un `fetch` par `sha` le refuse. Un clone public de cette branche rend `fe48de12a8b615ec4c456b63945b7e9dfc7835ca`, exactement le `head_complet` gelé — les quatre `HEAD` gelés sont désormais publics, le `porcelain` gelé non (fichiers non suivis, dits dans BOUNDARY §3). Le gel gagne `refs_distants` et `head_complet`, ce dernier pour une raison mesurée : `--short` s'abrège par dépôt, `fe48de12` devient `fe48de1` dans un clone neuf, et la comparaison courte aurait menti. Gel refait à `16:43:17.693147522+0200`, empreinte `bc126fe6` encore inchangée ; rejeu à jour : `10/10`, arbre du relecteur au `HEAD` gelé, `receipt` et `compare` inchangés, `node --check` OK. `BOUNDARY` §3 et `DEVICE.md` affirmaient que rien n'était publié : c'était faux, ils sont réparés (DEVICE reste à 894 mots sur 900).

## Séance 3 — 2026-10-15 (le foyer des espaces de travail, et le re-gel du cas)

**Objectif.** Rangement, demandé par le relecteur : les espaces de travail des runs vivaient sous
`~/runs/aidd-device/<horodatage>-<cas>/`, hors de tout projet, et allaient devenir une décharge à
chaque cas nouveau. Tous les runs et tous les espaces de travail doivent se lire sous `~/projects/`,
dans un dossier au nom explicite.

**Fait.**

- **Le foyer arrêté : `~/projects/aidd-device-work/<identifiant-du-cas>/`**, portant `terrain/` (où la
  session écrit) et `framework-origin/` (lu seul). Il voisine ses pairs déjà nommés de la même façon
  dans `~/projects/` (`audio-sync-tool-aidd`, `framework-aidd-temp`, `aidd-archives`).
- **Pourquoi ce n'est pas `.work/` dans le dépôt**, essayé puis abandonné dans la même séance : la
  règle écrite dans quatre pièces (request §4, [BOUNDARY](device/BOUNDARY.md) §1, `DECISIONS.md`,
  [DEVICE](device/DEVICE.md)) est que l'espace de travail vit **hors des quatre arbres, dont le
  dépôt**. Avec `.work/`, une session qui dérive écrit dans le dépôt qui porte les preuves, et le
  corrigé du cas est à trois niveaux au-dessus. L'ignore par git ne protège que le suivi, pas la
  mesure. Le voisin satisfait les deux : rangé **avec** le projet, **hors** de lui.
- **Un processus tenait l'ancien dossier** : `node ~/.local/bin/context-mode`, démarré `21:31:28`,
  enfant du service d'arrière-plan d'opencode. Arrêté avant le déplacement — un plugin qui tourne dans
  l'espace de travail y écrit. Vérifié après : `ps -p 2224192` ne rend plus rien. Les treize autres
  `context-mode` vivants sont ceux des autres sessions et n'ont pas été touchés.
- **Les deux copies, après le déplacement** : `framework-origin` `4c39e5c5` et `terrain` `416ec1f`,
  `git status --porcelain` **vide** pour les deux, remotes intacts — identiques à l'état d'avant, et
  `~/runs` a été supprimé.
- **Le cas portait l'ancien chemin absolu**, donc les fichiers du cas ont changé : §2 (les deux
  commandes de copie), §4 (le répertoire de travail), §5 (le texte remis à la session), plus les trois
  chemins du contexte de l'attendu. Rien d'autre : ni l'attendu, ni les deux réponses figées.
- **Le gel ne valait donc plus rien** et a été refait — cinquième re-gel du même jour : empreinte
  `38fa91f4` → **`07246039`**, `gele_le` `2026-10-15T21:57:31.349243146+0200`, l'ancien détruit.
  Mesuré, pas déclaré : le §1.1 de la conduite rejoué sur le gel neuf → 10/10 `True`, `empreinte
  True`, `exit 0`. C'est le premier re-gel du projet qui **change l'empreinte** : la formule ne hache
  pas les chemins, mais elle hache le contenu des fichiers du cas, et le nouveau chemin est écrit
  dedans. Les trois empreintes du cas suivent : demande `dce9e131…` (12 253 o), attendu `e32e420c…`
  (14 879 o), texte nu `832036f7…` (254 o, contre 245).
- **Les pages qui citaient les anciennes valeurs sont rectifiées**, chacune sur place : la conduite du
  run (trois empreintes + deux chemins + la note du §1.1), `README.md`, `EXPLICATION.md`,
  `DASHBOARD.md`, `REPLAY.md`, et une note datée au bilan du premier run. `BOUNDARY.md` §1 nomme
  désormais le foyer dans sa table des quatre arbres, et `DEVICE.md` le nomme dans « Ce qui part ».
- **Ce qui a été laissé tel quel, et pourquoi** : les pièces du run 1 sous `docs/device/runs/`
  (`faits.json`, `trace/commande.txt`, `collect-refus.txt`) portent encore `~/runs/…` — elles disent où
  la session a travaillé **ce jour-là**, et une pièce de reçu rectifiée après coup serait un faux. Le
  gel du premier run, lui, est détruit comme les précédents : rien ne s'y rejoue.
- **Un fichier non demandé, assumé** : `.gitignore` (non suivi) ne porte que `.freebuff/`, l'identifiant
  de projet que le client écrit lui-même dans l'arbre.

**Rectifications de mes propres énoncés.** Ma première note de séance affirmait que `BOUNDARY.md` §20
et §24 portaient la règle du « hors des quatre arbres » : `BOUNDARY.md` s'arrête au §8, ces numéros
n'existent pas. La règle, elle, existe bien, au §1 et dans les trois autres pièces nommées ci-dessus.

**Limites, nommées.** Un espace par **cas**, jamais par run : le §5 de la demande et le gel y portent
un chemin absolu, et un second run du même cas le réutilise. Le chemin reste celui de cette machine —
un tiers substitue les siens, comme le dit [REPLAY](device/REPLAY.md) — et rien dans le dépôt ne
contrôle qu'un run s'ouvre dans le bon dossier : c'est l'opérateur qui le pose.

**Prochaines étapes.** Le second run, sur le gel `07246039`. Rien de cette séance n'est commité :
`docs/device/runs/`, `docs/device/REPLAY.md`, `.gitignore` et les
rectifications ci-dessus attendent le commit du relecteur.

**Mémoires.** Aucune : cette séance n'a fait aucun appel Mnemolite (rangement de fichiers et mesures
locales, rien à vérifier auprès d'une source).

**Tour suivant : la porte d'avant la session.** Demande du relecteur : faire refuser l'ouverture d'un
run dont le dossier de travail n'est pas l'espace gelé du cas. Le trou a d'abord été **mesuré**, pas
supposé : sur banc, un `faits.json` déclarant `/home/giak/projects/audio-sync-tool` — le terrain
**original**, celui que l'interdit du §7 promet de ne pas écrire — écrivait un `receipt.json` et
sortait en `0`, parce que `receipt` acceptait alors **n'importe lequel** des quatre arbres gelés comme
répertoire de travail. Cinquième commande, `preflight` : le cas est re-haché comme au reçu, puis le
dossier examiné (`--repertoire`, sinon le répertoire courant) doit être **exactement** le chemin gelé
sous le label `travail`, exister, être un répertoire, ne pas vivre dans le dépôt du dispositif, et être
encore dans l'état gelé — `HEAD` **et** `porcelain`. `receipt` est resserré sur le même label, en second
filet : une porte peut être sautée.
Banc jetable `/tmp/banc-porte.sh`, chaque contrôle comparant le code de sortie observé à celui attendu :
**20/20 PASS**, dont **13 contrôles pour la porte** — **9 refus** (terrain original, `$W/framework-origin`,
ancien foyer `~/runs/…`, répertoire courant resté dans le dépôt, cas sans gel, arbre `travail` gelé dans
le dépôt, arbre qui n'est plus un dépôt git, arbre à la bonne révision et au mauvais `porcelain`, cas
dont un fichier a bougé) et **4 ouvertures** (dossier gelé par `--repertoire`, par le répertoire courant,
et deux gels rejoués depuis un banc `--cases`) — et **7 de non-régression** : `collect --sans-produit` ;
`receipt` refusant un autre arbre gelé ; `receipt` acceptant le dossier gelé ; `compare` ; second
`collect` refusé ; verdict `conforme` refusé ; `--help`. Le banc a d'abord rendu **19/20**, et le contrôle en échec était le
banc lui-même : le gel patché du contrôle précédent n'avait pas été reposé. Corrigé, rejoué, 20/20. Le harnais passe de 598 à **677 lignes**, de 40 à **47
refus**, de 4 à **5 commandes** ; l'[ADR-018](DECISIONS.md) porte la décision, la [spec](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-130103-spec.md)
§3 l'exigence, la [conduite](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md)
§1.0 la porte et §5 le banc, et son §1.4 est rectifié — sa ligne disait « un autre chemin fait refuser
`receipt` », ce qui était faux tant que n'importe quel arbre passait.
Deux choses laissées telles quelles, nommées : `collect` accepte toujours un `--from` venu d'ailleurs,
dont le manifeste garde la source absolue (ce que la porte ne couvre pas, et l'ADR le dit) ; et le refus
du re-hachage écrit « le demande a changé depuis le gel », faute d'accord — défaut d'origine, non corrigé
ici pour ne pas réécrire une phrase que des pièces citent. Le cas gelé n'a pas bougé : ses deux fichiers
rendent `e32e420c` et `dce9e131`, et le gel `07246039` tient. Rien n'est commité par ce tour.

**Tour d'après : la racine déclarée.** Le re-gel du déplacement avait montré le défaut sans le nommer :
déplacer l'espace de travail avait coûté une réécriture du **cas gelé**, parce que la machine y était
écrite en clair, à trois endroits — demande §2, §4 et §5, plus trois champs de contexte de l'attendu.
`freeze` prend désormais `--racine` (obligatoire), l'enregistre une fois (`racine_espace_de_travail`) et
en **dérive** les deux copies du cas : `--arbre travail=…` et `--arbre revision-sous-test=…` sont
refusés, un espace de travail déclaré deux fois finissant par se contredire. Le cas écrit `$RACINE`, et
le harnais **refuse** un gel dont un fichier de cas écrit cette racine en clair — ce refus est ce qui a
empêché le re-gel tant que les deux fichiers portaient encore le chemin.
Mesuré : sixième re-gel du jour, `07246039` → **`0d9a2180`**, `gele_le` `22:11:24`, les deux arbres
dérivés relus au bon `HEAD` et au bon `porcelain` ; rejeu du §1.1 : 10/10 `True`, `exit 0`. Le **texte
remis** ne bouge pas d'un octet (`832036f7…`, 254 octets) : la substitution redonne exactement l'ancien
chemin, ce qui est la preuve que le cas dit la même chose qu'avant, sans la machine.
`preflight` gagne `--texte <fichier>` : le §5 du cas, `$RACINE` substitué par la racine du gel, sans
variable et sans saut de ligne final. Banc étendu de 20 à **31 contrôles, 31/31 PASS** : quatre refus de
`freeze` (cas qui nomme la racine, `--arbre` sur un label dérivé, racine dans le dépôt, racine
inexistante), la dérivation vérifiée dans le gel écrit, et cinq contrôles du texte — substitution juste
acceptée, saut de ligne final, chemin d'un autre foyer, fichier absent et gel sans racine déclarée
refusés. Le harnais passe de 677 à **773 lignes** et de 47 à **56 refus** ; l'[ADR-019](DECISIONS.md)
porte la décision, la [spec](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-130103-spec.md)
§3 le champ 4 et le figement, la [conduite](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md)
§1.0 (la recette de substitution), §1.3, §2.1 et §5, et [REPLAY](device/REPLAY.md) §4 et §5.
Ce qui reste attaché à la machine, et qu'il faut dire : le **gel** garde les chemins absolus des arbres
et la racine — c'est un relevé de cette machine, pas une propriété du cas, ce que l'ADR-016 disait déjà
des arbres ; deux machines font deux gels. Et rien ne force l'opérateur à passer `--texte` : le contrôle
du texte n'existe que si on le lui donne. Rien n'est commité par ce tour.

**Tour d'après : l'origine du produit.** Le tour de la porte avait laissé un trou **nommé**, écrit noir
sur blanc dans l'ADR-018 : « `collect` accepte toujours un `--from` venu d'ailleurs ». Mesuré avant d'y
toucher : trois sources passaient — le terrain **original** (celui que le cas promet de ne pas écrire),
la copie `framework-origin`, un dossier de `/tmp`. Un produit rapporté d'un autre dossier donnait donc
un `raw/<cas>/` indiscernable de celui d'un run ouvert au bon endroit, alors que la paire avant/après du
§5.2 mesurait un arbre où rien n'avait été écrit. `collect` lit désormais le gel, prend l'arbre
`travail`, et refuse toute source dont le chemin **résolu** n'y tombe pas — dont un **lien** posé dans
l'espace de travail qui pointe dehors, que seul le `realpath` attrape ; le manifeste écrit l'arbre de la
copie (`arbre_de_travail`). Le reçu refait le contrôle sur le manifeste **seul**, une porte pouvant être
sautée : un autre arbre, ou une source de fichier hors de l'arbre du run, sont des refus ; une source qui
ne se résout plus devient une **limite** écrite, le produit étant déjà copié et haché quand le reçu
s'écrit.
Mesuré : banc étendu de 31 à **46 contrôles, 46/46 PASS**, dont quinze pour l'origine — `collect` accepté
depuis l'espace gelé, refusé depuis le terrain original, `framework-origin`, un dossier hors des quatre
arbres, une source absente, un cas sans gel, un gel sans arbre `travail`, et le lien qui sort — puis le
reçu : refus sur un manifeste d'un autre arbre et sur une source hors de l'espace, accepté sur une source
dans l'espace, accepté avec sa limite sur une source disparue ; et l'espace de travail relu propre après
le lien. Le harnais passe de 773 à **882 lignes** et de 56 à **63 refus** ; l'[ADR-020](DECISIONS.md)
porte la décision et l'ADR-018 cesse de compter ce trou parmi les siens, la
[spec](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-130103-spec.md) §4 l'exige,
la [conduite](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md) §3.1
l'énonce et son §5 porte le banc.
Ce que le contrôle **ne** couvre pas : un opérateur qui recollerait à la main un manifeste cohérent après
coup — le reçu relit alors les mêmes pièces que lui, et rien ne distingue un manifeste réécrit d'un
manifeste né ainsi. Rien n'est commité par ce tour.

**Mise à jour.** Les trois tours restés dans l'arbre de travail — la porte, la racine déclarée et
l'origine du produit — sont commités ensemble, sur arbitrage du relecteur : ils sont mêlés dans neuf
fichiers, et les séparer aurait demandé de reconstruire des états jamais mesurés. Commit `6789bec`,
14 fichiers, +677/−110. La branche est poussée dans la foulée (`41f531c..6789bec  main -> main`), donc
le distant porte le gel `0d9a2180`, la porte et ses deux suites. Deux conséquences nommées : le §3 du
[REPLAY](device/REPLAY.md) décrit encore un gel poussé antérieur à l'ADR-016, et les 71 lignes d'un
autre fil que l'arbre portait dans ce journal entrent dans le même commit, à sa demande.

## Séance 5 — 2026-10-16 (le dossier du contrat est retiré du dépôt)

**Objectif.** Décision du relecteur : l'optimisation d'`AGENTS.md` n'est pas le but du projet et son
dossier documentaire le pollue. Retirer `docs/contracts/` et ses traces des documents vivants. Les
commits ne sont pas touchés, Mnemolite non plus.

**Fait.** `rm -rf docs/contracts` : **43 fichiers, 564 Ko** — la source du contrat, son README et ses
commandes de contrôle, trois audits, deux études, les candidats `v11` à `v19` avec leurs analyses,
l'archive `v0` à `v9`, une veille, deux relectures, un delta, un script de migration. Du journal : la
**Séance 2** entière (veille, mesure, arbitrage), les blocs de campagne rattachés à elle et posés après
la Séance 3, et la **Séance 4** entière avec ses huit sous-sections.

**Vérifié.** `find docs/contracts -type f | wc -l` → **0**. `git status --porcelain` → **43** entrées
`D` : le dossier était commité, donc `git restore docs/contracts` le rend en entier. `AGENTS.md` et les
trois `.agents/skills/*/SKILL.md` sont **intacts** (`git diff --stat -- AGENTS.md .agents` muet).
`docs/DASHBOARD.md` et `docs/EXPLICATION.md` ne portaient **aucune** occurrence de la campagne
(`grep -c -i` sur `contracts|v1[1-9]|compression|DSL|noyau` → `0`) : rien n'y a été réécrit.

**Deuxième passe, même séance, sur arbitrage du même jour.** La fin de la **Séance 1** part à son tour
— le premier épisode de la même optimisation : ses quatre puces de forme de réponse, son `R4` renforcé,
son découpage « noyau + skills » et les rectifications qui les suivent. Le registre perd les
**ADR-007, 008, 009, 010 et 012**, qui traitaient du contenu ou de la forme d'`AGENTS.md`, pas du
projet ; **un numéro ne se réattribue pas**, le registre passe donc de 006 à 011 puis à 013, et une
note d'en-tête le dit. Les quatre mentions datées du chemin `docs/contracts` (journal 106, 487, 656 ;
registre 259) sont traitées : trois disparaissent avec les passages retirés, la quatrième — un
inventaire de fin de Séance 3 — est **reformulée** sans les deux chemins qu'elle listait, ce qui est une
retouche assumée d'un relevé daté, faite sur ordre. Enfin les renvois aux ADR supprimés (dans les
ADR-011 et 014, et dans trois passages du journal) sont retirés sans toucher aux faits qu'ils portaient.

**Troisième passe, sur arbitrage du même jour.** Les **réflexions sur le fichier** quittent la
Séance 1 : l'audit qui l'a « jugé pollué » avec ses compteurs de lignes, l'arbitrage qui l'a ramené à un
seul fichier, l'audit externe de son contenu avec la règle effacée qui en est sortie, et deux clauses de
la liste des mémoires. Le tableau de bord perd la mention « audit de pollution » de sa ligne de commit.
Restent, gardés comme faits du projet : la réécriture de `CONSIGN`, la phrase fausse corrigée sur place,
les relevés de `BOUNDARY.md`, le brainstorm de fondation, et cet enregistrement-ci.

**Mise au dépôt, sur ordre.** Ordre « commit », puis, devant l'état constaté, « les skills devraient
être aussi commit ». Commit `8b52313` « Retirer du dépôt le dossier du contrat et ses traces » :
**46 fichiers, +67 / −7 877**, les 43 `D` du dossier et trois réécritures (`trace.md`,
`DECISIONS.md`, `DASHBOARD.md`). `git status --porcelain -uall` → **0** entrée après coup.
Réversibilité mesurée, pas promise : `git ls-tree -r HEAD~1` compte **43** fichiers sous
`docs/contracts/`, `HEAD` en compte **0**, donc `git restore --source=HEAD~1 docs/contracts` les rend
tous. Puis `git push origin main` → `6789bec..8b52313`, `push_status=0`, avec `origin/main..HEAD` = **0**
et `HEAD..origin/main` = **0**.

**Les trois skills étaient déjà commités**, constat plutôt qu'acte : `git ls-files .agents` les liste,
`git log --diff-filter=A -- .agents` les fait naître au commit `12ad625`, `git ls-tree -r 6789bec` les
trouve **déjà** à `origin/main` avant ce push, et `git log -1 -- .agents/skills/*/SKILL.md` les donne
revus par `cb14fbd` (v19). Ni ignorés (`git check-ignore` → exit **1**), ni ailleurs :
`find . -name SKILL.md` ne rend que ces trois-là. Ce push les publie donc dans leur révision courante,
`sha256` identiques au disque (`7f4ea4a2f737`, `ce62b53a3997`, `fb3f63ccbc4f`).

**Rectifications de la séance.** Deux phrases ci-dessus ont cessé d'être vraies avec la mise au dépôt :
« rien n'est commité par cette séance » (Limites), vraie au moment de la mesure, et
« `git status --porcelain` → 43 entrées `D` » (Vérifié), qui décrit l'état d'avant le commit. L'arbre
est propre depuis `8b52313`. Le reste tient.

**Dérive signalée, puis tranchée.** Le dépôt avait tranché, le 2026-10-15, un contrat en **un seul
fichier, sans skills** ; l'arbre porte de nouveau `.agents/skills/`, et la décision qui l'avait tranché
part avec ce nettoyage — plus rien d'écrit ne s'y oppose. Le relecteur tranche le même jour : il les
garde, et leur présence au dépôt depuis `12ad625` avec leur publication en v19 vaut l'acte daté
demandé ; `AGENTS.md` ligne 4 les nomme déjà, rien n'est à retirer.

**Limites.** L'historique git porte encore tout le dossier : aucun commit n'est touché, comme demandé, et
rien n'est commité par cette séance. La suppression laisse les quatre artefacts **sans source** :
`AGENTS.md` et les trois skills sont désormais les seules copies, et le contrôle « le noyau de la source
est `AGENTS.md` » n'a plus de base. Reste `OPEN`, non actionné : le frontmatter des trois skills porte
`name` et `description`, là où la règle `CONSIGN` en nomme quatre (`name`;`description`;`type`;`status`) ;
lecture la plus plausible, cette règle vise les pièces datées, pas les skills, donc aucun `drift` établi.

**Mémoires.** `84f550b7`.

## Séance 6 — 2026-10-16 (le tableau de bord et le PFD remis au vrai)

**Objectif.** Demande du relecteur : mettre `docs/DASHBOARD.md` et `docs/PFD.md` au vrai de l'état
mesuré — gel `0d9a2180`, harnais à cinq commandes, dossier du contrat retiré — et consigner la dérive
dans une section de séance. Rien d'autre : ni le dispositif, ni les pièces d'un run.

**Fait.** Le point d'état a été **rejoué avant d'écrire**, jamais recopié d'un document.

- `docs/DASHBOARD.md` : en-tête daté `2026-10-16` (Séance 6) ; ligne du journal (« Séance 6 », les
  séances 2 et 4 étant sorties avec le dossier) ; une ligne **Dossier du contrat** ajoutée (retiré du
  dépôt, `8b52313` : 43 fichiers, 479 189 octets de contenu, les ADR-007, 008, 009, 010 et 012 partis, `AGENTS.md` et les
  trois skills désormais seules copies, l'historique intact et `git restore --source=8b52313~1` nommé) ;
  la ligne du dispositif porte les trois trous fermés et le second run qui n'attend que la sonde du
  client ; `EXPLICATION.md` passe de « non commité » à commité (`41f531c`, revu `6789bec`) ; le bilan du
  premier run passe de 🟨 à 🟢 (`d0d894b`) ; la ligne du run 1 dit le trou comblé **côté outil** et laissé
  tel quel **côté pièce** ;  la ligne du cas porte `gele_le` à la seconde, les deux `sha256`, `2 fichiers`,
  `8 références` et la porte rejouée le 2026-10-16 ; la ligne `BOUNDARY.md` portait 1 563 mots, la mesure
  en rend **1 686** ; la ligne `PFD` suit la version de la page (v0.2) ; **le §3 est réécrit** sur la chaîne §11 du bilan
  (sonde du client, second run, `output.json`, `NEGATIVE.md` puis `ECART.md`, arbitrages ouverts) ;
  **le §4** gagne quatre commits (`41f531c`, `6789bec`, `8b52313`, `d239b08`).
- `docs/PFD.md` : version `0.2` ; `status` de `pending` à `in-progress` ; la ligne `CASES/` dit la
  rectification et le gel `0d9a2180` au lieu d'« attend une rectification » ; la ligne
  `runs/…/output.json` dit que le harnais sait écrire un run sans produit et que le fichier attend le
  second run ; la ligne `DEVICE.md` dit 895 mots et le lancement écrit (six gestes, pas de commande
  unique) ; la ligne `BOUNDARY.md` ne promet plus des relevés « du run à venir » mais porte ses
  1 686 mots et la règle de preuve en paires ([ADR-014](DECISIONS.md)) ; la phase 2 et le remote portent
  l'état mesuré.
- Ce qui n'a **pas** été touché, et pourquoi : `docs/device/DEVICE.md`, `docs/device/REPLAY.md`, la spec
  de la boucle 2 et les documents datés. Leurs écarts sont nommés aux dérives ci-dessous ; les réparer
  n'était pas demandé.

**Vérifié.** Chaque chiffre écrit dans les deux documents a été mesuré dans cette séance :

| Contrôle | Commande | Résultat |
| --- | --- | --- |
| dépôt | `git rev-parse HEAD origin/main`, `git status --short`, `git rev-list --count HEAD` | `d239b08` des deux côtés, arbre vide, **36** commits, HEAD daté `2026-10-16T09:16:08+02:00` |
| gel | lecture de `CASES/*.freeze.json` | `0d9a2180…`, `gele_le` `2026-10-15T22:11:24.782242943+0200`, racine `…/aidd-device-work`, 4 arbres (`fe48de12`/2 lignes `porcelain`, `416ec1f`/1, `4c39e5c5`/0, `416ec1f`/0), `2 fichiers`, `8 références` |
| cas | `sha256sum`, `wc -c` | demande `5aac04fb…` 13 413 o, attendu `ae4914c5…` 15 423 o |
| texte remis | substitution du §5 puis `cmp` avec `texte-a-remettre.txt` | `832036f7…`, 254 octets, identique |
| porte | `run.mjs preflight --case … --repertoire <W>/terrain --texte …` | « ouverture autorisée … gel `0d9a2180` re-haché, 2 fichier(s) du cas et 8 référence(s) ; texte `832036f7` conforme », **exit 0** |
| prémisse du cas | `ls <W>/terrain/aidd_docs`, `find <W> -name .freebuff` | absent, aucun `.freebuff` |
| harnais | `wc -l`, `usage` | 882 lignes, cinq commandes, `collect --sans-produit` exposé |
| refus comptés | `grep -c 'refuse('`, puis comptage des appels | 63 lignes contenant le motif, dont la définition `function refuse(message)` : **62 sites d'appel** ; la convention du projet est constante (`grep -c` rend 29 pour 448 lignes, 40 pour 598, 63 pour 882) |
| origine du second run | `select root_path from projects` sur les onze bases `~/.config/freebuff-desktop/projects/*/desktop-v2.db` | aucun projet sur `<W>/terrain` ; les deux `audio-sync-tool-*` pointent le terrain **original** |
| mots des deux pages | `wc -w` sur `DEVICE.md` et `BOUNDARY.md` | 895 et **1 686** mots (la page du tableau de bord annonçait 1 563 pour la seconde) |
| DEVICE | §« Récupérer et lancer » | six gestes écrits, aucune commande unique de lancement |
| dossier du contrat retiré | `git ls-tree -r 8b52313~1 -- docs/contracts`, puis somme des `%(objectsize)` | 43 fichiers, **479 189** octets ; le message du commit en annonçait « 564 Ko », chiffre non reproduit ici |

**Dérives signalées, non corrigées.** Hors du périmètre demandé, nommées ici :

- `DEVICE.md` §« Récupérer et lancer » cite `1d471a5` (« relevé du 2026-10-15 ») : daté, donc pas faux,
  mais l'arbre est à `d239b08` et un lecteur qui clone aujourd'hui l'y lit périmé.
- `DEVICE.md` §« Ce qui revient » énumère `raw/<cas>/`, `last-message.md`, `trace/`, `receipt.json` et
  conclut « Rien d'autre » : `compare` écrit aussi `output.json` dans le dossier du run (`run.mjs:849`),
  la liste est incomplète.
- `docs/brainstorm/2026-10-15-081511-gestion-de-projet.md` laisse **P6** à trancher alors que le remote
  existe et porte `main` depuis le 2026-10-15 ([ADR-017](DECISIONS.md)) ; la ligne du tableau de bord qui
  le comptait parmi les arbitrages ouverts est rectifiée par cette séance, la spec ne l'est pas.

**Rectifications.** Deux de mes propres énoncés, corrigés dans la foulée, pas lissés :

- ma première commande de porte portait `--case docs/device/CASES/…request.md` (le **fichier**, pas
  l'identifiant du cas) : refus attendu, et mon relevé l'a rendu `exit=0` parce que je lisais le code de
  sortie à travers un tube (`| tail`). Rejouée avec l'identifiant et sans tube : « ouverture autorisée »,
  `exit 0`.
- le chiffre de refus publié (47 par l'[ADR-018](DECISIONS.md), 63 par l'[ADR-020](DECISIONS.md) et par
  [EXPLICATION](EXPLICATION.md)) est un compte de **lignes** contenant `refuse(` : la ligne de définition
  en fait partie, les sites d'appel sont 62. Le chiffre publié est conservé, la méthode est dite.

**Limites.** Rien n'est commité par cette séance : les deux documents et cette section vivent dans
l'arbre de travail. La mise au vrai porte sur l'état **mesuré ce jour** ; ce qui bougera ensuite (second
run, nouveau gel) les rendra faux à leur tour, comme les séances précédentes l'avaient fait pour ceux-ci.

**Prochaines étapes.** L'étape 3 du [bilan §11](brainstorm/2026-10-15-201458-bilan-premier-run.md) : la
sonde du client Freebuff — poser la racine de projet sur `<W>/terrain`, la remise du texte à l'octet,
l'export de trace — puis le second run sur le gel `0d9a2180`.

**Mémoires.** `11210a41`, mise à jour dans la même foulée : elle portait la dérive comme non corrigée.

**Tour suivant : l'architecture sur une page.** Demande du relecteur : le protocole lui paraît dispersé et
il ne voit plus qui fait quoi ni comment ; il demande une page qui rassemble l'architecture détaillée,
avec des schémas.

**Fait.** Une page neuve, `docs/ARCHITECTURE.md`, neuf sections et cinq schémas mermaid, qui ne recopie
pas les autres pages : elle assemble les acteurs et leur séparation de contexte, les arbres et qui écrit
où, les cinq commandes du harnais avec ce que chacune lit, écrit et refuse, la vie des artefacts (chaque
pièce a un seul écrivain), les neuf falsificateurs `F1` à `F9` et les quatre `E1` à `E4`, le plafond du
verdict, puis les limites nommées. Elle dit d'entrée où est le piège du vocabulaire : **deux ensembles
portent le nom « les quatre arbres »** ([BOUNDARY](device/BOUNDARY.md) §1 liste les sources et le dépôt,
le gel enregistre quatre labels dont les deux copies dérivées). Chaque chiffre de la page vient d'une
pièce du dépôt : gel `0d9a2180` et ses quatre labels, `run.mjs` (882 lignes, cinq commandes, sorties `0`
fait, `1` refus, `2` usage), [spec](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-130103-spec.md)
§6 et §8, [conduite](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md)
§3.3, et l'attendu lu par script pour les falsificateurs. Contre la duplication, `DEVICE.md` gagne une
ligne de renvoi au-dessus de « Ce qu'il fait » et le tableau de bord une ligne dans ses documents.

**Vérifié.** Les cinq blocs mermaid extraits et rendus un par un : `mmdc` 11.4.2
(`PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome`) rend **exit 0 sur les cinq** (SVG de 24 336,
11 918, 14 101, 19 367 et 16 149 octets). Le contrôle qui compte, celui du [bilan](brainstorm/2026-10-15-201458-bilan-premier-run.md)
§9, un exit 0 ne prouvant pas un rendu : les libellés attendus ont été relus dans chaque SVG (acteurs et
`output.json` pour la séquence ; `framework-origin`, `revision sous test`, `travail`, `le dispositif`
pour les arbres ; `freeze`, `preflight`, `autorise`, `refuse` pour la chaîne ; `CASES cas.request.md`,
`trace/`, `ECART.md` pour les artefacts ; `non concluant`, `verdict possible`, `cloisonnement` pour le
plafond), **aucun manquant**, zéro élément `<g class="error-icon">` et zéro « Syntax error » : l'unique
occurrence de `error-icon` est une règle CSS du gabarit. Contrôle des liens des trois pages touchées :
aucun mort.

**Rectification.** La page neuve n'écrit **aucun tiret cadratin dans sa prose** (R4) : les trois
occurrences que le compte rend (`grep -c '—'` => 3) sont au `name`, au titre et à la ligne de version,
la convention des autres pages. Les passages écrits plus tôt dans la journée, cette séance et le tableau
de bord, en portent dans leur prose, comme le reste du corpus. Signalé, non réécrit : une réécriture de
forme sur des relevés datés n'était pas demandée.

**Limites.** Rien n'est commité. La page est une V0.1 : ses chiffres sont datés (gel `0d9a2180`, `HEAD`
du dispositif `d239b08`), et le second run périmera ceux qui en dépendent.

**Prochaines étapes.** Inchangées : l'étape 3 du bilan §11, la sonde du client Freebuff, puis le second
run sur le gel `0d9a2180`.

**Mémoires.** `7a8ffaeb`, plus `11210a41` mise à jour dans la même foulée.

**Tour suivant : les trois dérives réparées.** Demande du relecteur : réparer les trois dérives
nommées plus haut.

**Fait.**

- `DEVICE.md` §« Récupérer et lancer » : le relevé `1d471a5` (2026-10-15) devient **`d239b08`**
  (2026-10-16), et la cause est réparée avec le chiffre : deux lignes disent que ce nombre est un
  relevé, jamais une constante, et qu'il se relève au moment où on le cite. L'autre occurrence de
  `1d471a5` dans la page (ligne 55) reste : c'est le **nom du dossier du premier run**,
  `runs/2026-10-15-171559-4c39e5c5-1d471a5/`, un chemin et non un relevé.
- `DEVICE.md` §« Ce qui revient » : la liste gagne **`output.json`**, avec son écrivain (`compare`, le
  juge, jamais l'opérateur) et la ligne de code qui le pose (`join(runDir, "output.json")`,
  `run.mjs:849`).
- `docs/brainstorm/2026-10-15-081511-gestion-de-projet.md` : une **note datée** sous P6, et la ligne
  « À décider par le relecteur » ne porte plus que la **déclaration** du remote dans `AGENTS.md`, le
  remote lui-même étant mesuré.

**Vérifié.** `git remote -v` => `origin https://github.com/giak/aidd-device.git` ;
`git ls-remote https://github.com/giak/aidd-device.git main` **sans authentification** =>
`d239b08b8b36852aad5ec36237b90ab837a593d3`, exit 0, donc lisible hors machine et sans clé ;
`git log -1 origin/main` => `d239b08`, `2026-10-16T09:16:08+02:00` ; `grep -c -i 'remote\|github' AGENTS.md`
=> **0**, ce qui établit la partie de P6 qui reste ; liens des pages réparées : **aucun mort**.

**Rectification.** La liste des dérives de ce bloc annonçait ces trois-là comme « non corrigées » : elles
le sont à partir de ce tour, et cette phrase ne vaut plus que pour les dérives qui restent. Une dérive de
même nature est laissée en place, nommée : `BOUNDARY.md` §7 cite `39750fe` pour la révision du dispositif
au 2026-10-15. C'est un relevé daté, sur une page qui prévient déjà qu'« un HEAD qui bouge invalide
celles-ci », et il est la preuve de l'état de ce jour-là, pas une affirmation sur aujourd'hui.

**Limites.** Rien n'est commité. La déclaration du remote dans `AGENTS.md` reste un arbitrage du
relecteur : c'est son contrat, je n'y ajoute pas une clause de mon chef.

**Prochaines étapes.** Inchangées : l'étape 3 du bilan §11, la sonde du client Freebuff, puis le second
run sur le gel `0d9a2180`.

**Mémoires.** `11210a41`, corrigée : elle portait ces trois dérives comme non réparées.

**Tour suivant : l'entrée du README.** Demande du relecteur : qu'un nouveau lecteur commence par la vue
d'ensemble.

**Fait.** `README.md` : [docs/ARCHITECTURE.md](ARCHITECTURE.md) passe **en tête des entrées**, avant
`AGENTS.md` (le contrat), avec une ligne qui dit ce qu'on y trouve. La ligne de `DEVICE.md` perd « qui
fait quoi », que la page d'architecture possède désormais, et gagne « ce qu'il ne fait pas ».

**Vérifié.** `grep -n '^- \[' README.md` => l'entrée d'architecture est la première (ligne 8) ; liens du
README rejoués, **aucun mort**. Le reste du README n'est pas touché : sa section « État » reste le relevé
du 2026-10-15 (`882 lignes, cinq commandes`, empreinte `0d9a2180`), vrai tel quel.

**Limites.** Rien n'est commité.

**Mémoires.** Aucune : un rangement n'est pas un fait mesuré ; cette séance le porte et `11210a41` garde
l'état.

**Tour suivant : la relecture à froid des entrées.** Demande du relecteur : parcourir le README et ses
entrées comme un inconnu, et dire où la lecture décroche.

**Fait.** Un document daté,
[2026-10-16-133942-relecture-a-froid-des-entrees.md](brainstorm/2026-10-16-133942-relecture-a-froid-des-entrees.md) :
la marche en huit étapes, **six décrochages mesurés** avec leur plus petite réparation, ce qui manque aux
huit entrées, et les limites de la relecture. Aucun correctif appliqué. Les six : l'ordre ouvre par le
dedans (ARCHITECTURE en tête, la VISION en l.19) ; « AIDD » jamais défini (`grep -i aidd` sur les quatre
pages d'entrée : des emplois, aucune définition) ; « run » et « cas » absents du lexique (§14 en définit
quatorze, pas eux) ; `framework-origin` nomme **deux arbres** (la source BOUNDARY §1 l.19, le dossier de
la copie l.20) ; ce qui n'existe pas encore n'est pas dit (`NEGATIVE.md` : 0 occurrence dans le README et
ARCHITECTURE) ; EXPLICATION annonce 21 commits quand l'arbre est au 36e.

**Rectifications.**

- La relecture **n'est pas indépendante** : même main que la page d'architecture et l'entrée du README,
  écrites le même jour. Le document le dit en tête, et aucun second relecteur n'existe ici.
- Le fichier a d'abord été nommé `2026-10-16-133919-...`, l'horodatage lu **avant** l'écriture ; sa
  naissance mesurée est `13:39:42`, vingt-trois secondes plus tard. Renommé sur la naissance mesurée,
  comme la règle de nommage l'exige, le premier nom est dit ici, jamais corrigé en silence.
- Un lien mort de ma main, trouvé en vérifiant : `[README](../README.md)` depuis `docs/brainstorm/` ne
  désignait rien. Réparé en `../../README.md` et rejoué.

**Limites.** Rien n'est commité. Les six constats sont mesurés mais **non arbitrés** ; la marche a lu,
jamais exécuté (ni la recette de [REPLAY](device/REPLAY.md), ni la séquence de [DEVICE](device/DEVICE.md)).

**Prochaines étapes.** Inchangées pour le dispositif : l'étape 3 du bilan §11, la sonde du client
Freebuff, puis le second run. Ce que cette relecture ajoute est un choix : les six constats se réparent
en une poignée de lignes, ou restent nommés.

**Mémoires.** `db325302`.

**Clôture de la séance, 2026-10-16 (13:41).** Cinq tours, tous sur les mêmes documents, et aucun code
touché : le harnais rend le même `git diff` muet qu'à l'ouverture. La séance se ferme ici.

**Ce qu'elle a produit.**

| Pièce | État après la séance |
| --- | --- |
| `docs/ARCHITECTURE.md` | **neuve** : 262 lignes, neuf sections, cinq schémas mermaid rendus et leurs libellés relus dans les SVG |
| `docs/brainstorm/2026-10-16-133942-relecture-a-froid-des-entrees.md` | **neuve** : 111 lignes, six décrochages mesurés, aucun corrigé |
| `docs/DASHBOARD.md` | remis au vrai (en-tête, statut global, ligne du dossier du contrat, ligne du cas, §3 réécrit, §4 complété) |
| `docs/PFD.md` | v0.2, `status` de `pending` à `in-progress`, lignes `CASES/`, `runs/`, `DEVICE.md`, phase 2 et remote au mesuré |
| `docs/device/DEVICE.md` | relevé `d239b08`, `output.json` dans « Ce qui revient », renvoi vers ARCHITECTURE, ligne d'entrée du README resserrée |
| `docs/brainstorm/2026-10-15-081511-gestion-de-projet.md` | note datée sous P6, ligne « À décider par le relecteur » réduite à la déclaration du remote |
| `README.md` | ARCHITECTURE en tête des entrées, avant `AGENTS.md` |
| `docs/trace.md` | cette séance : cinq blocs, plus cette clôture |

Mesuré, **le journal exclu** (il est la trace, pas la pièce) : `git diff --stat -- README.md docs
':!docs/trace.md'` => **cinq fichiers, +77 / −49** ; et `git status -uall` => **deux fichiers neufs**,
262 lignes pour l'architecture, 111 pour la relecture. Mémoires de la séance : `11210a41` (l'état mesuré,
mise à jour deux fois), `7a8ffaeb` (la page d'architecture), `db325302` (la relecture à froid).

**Ce qui reste ouvert.**

1. **Le dispositif**, chaîne §11 du [bilan](brainstorm/2026-10-15-201458-bilan-premier-run.md) : la sonde du
   client Freebuff (étape 3), le second run sur le gel `0d9a2180` (4), le reçu et l'`output.json` (5 et 6),
   puis `NEGATIVE.md` et `ECART.md` (7, jamais ouverts).
2. **Cinq arbitrages du relecteur**, aucun ne bloquant les étapes 3 et 4 : le commit debout de la boucle 2
   (P5) ; la **déclaration** du remote dans `AGENTS.md` ; les six décrochages de la relecture, réparables en
   une poignée de lignes ; le frontmatter des trois skills, `OPEN` depuis la Séance 5 ; et le **commit de la
   journée**, dont le contenu est le tableau ci-dessus.
3. **Nommé, non corrigé** : `BOUNDARY.md` §7 cite `39750fe` (relevé du 2026-10-15), de même nature que le
   bloc de clonage réparé, laissé tel quel parce que la page assume qu'« un HEAD qui bouge invalide
   celles-ci ».

**Ordre de reprise.** Le commit de la journée d'abord : rien de cette séance n'est commité, et un document
non commité ne survit pas à la mémoire du dépôt. Ensuite l'étape 3 (la sonde du client), puis le second run.
Les arbitrages du point 2 se prennent quand le relecteur le décide ; aucun ne bloque le run.

**Fermeture.** La séance est close à cet instant : ce qui la touchera plus tard s'écrira dans un nouveau
bloc daté qui la cite, jamais dans les cinq blocs ci-dessus. Elle se ferme sur un `HEAD` inchangé,
`d239b08` (`2026-10-16T09:16:08+02:00`), et un arbre qui porte tout son travail.

## Séance 7 — 2026-10-16 (le contrôle qu'une dérive démontrée rend exigible, proposé et non codé)

**Objectif.** Répondre à la question que BOUNDARY §8 laisse ouverte et qu'ADR-004 conditionne : la dérive
d'écriture constatée deux fois le 2026-10-15 rend-elle un contrôle mécanique exigible, et ce contrôle
vaut-il un crochet ou reste-t-il une mesure de run ?

**Fait.** Une pièce produite : **ADR-021**, proposée et non codée,
[DECISIONS.md](DECISIONS.md#L414) l.414. Aucun fichier de code touché, aucune commande du harnais ajoutée.
Mesures de la séance :

| Mesure | Commande | Résultat |
| --- | --- | --- |
| la paire est prise et non lue | `grep -n 'memeArbre' docs/device/harness/run.mjs` | 3 lignes : l.317 la définition, l.487 la porte (arbre `travail` seul), l.748 le reçu (falsificateur `arbre_de_travail_inchange`, `travail` seul) |
| ce que le reçu écrit de la paire | `run.mjs` l.788 | `const arbres = { avant: gel.arbres, apres };` : les quatre arbres sont mesurés, comparaison sur `travail` seulement |
| le code n'a pas bougé | `git diff --quiet docs/device/harness/run.mjs` | `exit 0` |
| contrôle négatif du volet séance, couru aujourd'hui | `git -C /home/giak/projects/framework status --porcelain` | 2 lignes, `?? .freebuff/` et `?? aidd_docs/MEGA-PROMPT-TEST-AIDD-v6.md`, `exit 0` : la ligne de base de BOUNDARY §5 tient |

**Vérifié.** Le verdict est **mesure, jamais crochet**, et les trois raisons se vérifient : la dérive
n'écrit aucun événement git dans le dispositif (aucun commit, aucun checkout, aucun chemin du dépôt
touché) ; le seul arbre où un crochet la verrait est l'origine, que BOUNDARY §1 interdit d'écrire, et son
installation apparaîtrait dans la paire de `porcelain` censée constater les dérives ; et c'est l'outil du
client, hors des deux dépôts, qui résout le chemin, donc la détection est après coup de toute façon. Le
contrôle proposé a ses deux volets, chacun avec sa classe, sa commande et son contrôle négatif, comme la
conséquence d'ADR-004 l'exige : au reçu la comparaison des arbres autres que `travail`, écrite en
**limite** ; à la séance la paire de `porcelain` de l'origine, au `Vérifié`. `OPEN` sur deux points, dits
pour ce qu'ils sont : les deux incidents datés (`13:0x` et `13:34`) n'auraient **pas** été attrapés par le
volet reçu, puisqu'aucun run n'était ouvert et que le premier ouvre à `17:15:59` (`faits.json` du run,
`horodatage_debut`) ; et le chiffre du banc
(**46** contrôles, ADR-020) reste celui d'hier, les deux contrôles de plus étant une exigence du codage, pas
une mesure.

**Dérives signalées, non corrigées.** Aucune nouvelle. `BOUNDARY.md` §8 et la Séance 1 portent la dérive
pour ce qu'elle est, et l'ADR-021 les cite sans les réécrire.

**Rectifications.** Une, de la séance même, mesurée **après** son écriture : l'ADR-021 et le bloc ci-dessus
datèrent d'abord l'ouverture du premier run à `15:43`, qui est la **naissance de la conduite**
(`stat -c %w`, `15:43:03`), jamais le run. Les pièces du run portent `horodatage_debut`
`2026-10-15T17:15:59+02:00` et `session.ouverte_le` `17:16:12+02:00`
(`docs/device/runs/2026-10-15-171559-4c39e5c5-1d471a5/faits.json`), et les deux textes ont été corrigés sur
ce chiffre. L'inférence « la conduite est née à 15:43 donc le run ouvre à 15:43 » ne tenait pas : un document
né à 15:43 peut décrire un run qui ouvre deux heures plus tard. Le verdict de la fiche n'en bouge pas, les
deux incidents restant antérieurs à toute ouverture.

**Prochaines étapes.** 1. L'arbitrage de l'ADR-021 : mesure acceptée, mesure refusée, ou crochet malgré les
trois raisons. 2. Si la mesure est acceptée, une passe de codage : une comparaison, une limite, deux
contrôles de banc. 3. Le reste est celui de la Séance 6, inchangé : le commit de la journée d'abord, puis
l'étape 3 (la sonde du client), puis le second run.

**Mémoires.** `42548adf` — l'ADR-021 proposée, ses deux volets, le verdict et ce qu'elle ne couvre pas.

**Fermeture.** La séance est close à cet instant : ce qui la touchera plus tard s'écrira dans un nouveau
bloc daté qui la cite, jamais dans les blocs ci-dessus. Elle se ferme sur un `HEAD` inchangé, `d239b08`, un
arbre qui porte toujours tout le travail de la journée, et une décision proposée que personne n'a encore
arbitrée.

## Séance 8 — 2026-10-16 (le banc du harnais entre dans le dépôt)

**Objectif.** Rapatrier dans le dépôt le banc qui éprouve le harnais, avec son mode d'emploi, pour que les
46 contrôles ne vivent plus dans `/tmp`.

**Fait.** Deux pièces neuves : `docs/device/harness/banc-harnais.sh` (ex `/tmp/banc-porte.sh`, renommé
puisque « porte » ne nommait que la première des cinq commandes qu'il éprouve depuis ADR-020) et
[docs/device/BANC.md](device/BANC.md), son mode d'emploi en six sections. Deux lignes ajoutées à
[DEVICE.md](device/DEVICE.md) (`L'état`, `Récupérer et lancer`) et l'ADR-022 au registre. Mesures :

| Mesure | Commande | Résultat |
| --- | --- | --- |
| la base, avant de toucher à rien | `bash /tmp/banc-porte.sh` | **46/46 PASS**, `exit 0` |
| le banc du dépôt | `bash docs/device/harness/banc-harnais.sh` | **46/46 PASS**, `exit 0`, même compte |
| plus de dépendance au répertoire courant | `cd / && bash /home/giak/projects/aidd-device/docs/device/harness/banc-harnais.sh` | **46/46 PASS**, `exit 0` |
| les trois garde-fous, dans un faux dépôt jetable | `bash <faux>/docs/device/harness/banc-harnais.sh` | trois `ARRET`, `exit 2` chacun (gel absent ; gel sans `racine_espace_de_travail` ; espace de travail absent) |

Ce qui a changé dans le script, et rien d'autre : le dépôt se retrouve par sa propre position
(`BASH_SOURCE`, comme `run.mjs`) ; la racine des espaces de travail et les quatre arbres se lisent **au
gel** (`racine_espace_de_travail`, `arbres[].chemin`) au lieu d'être écrits en clair ; le dossier jetable
vient de `mktemp -d` ; le `HEAD` du terrain du contrôle 10 vient du gel au lieu d'un `sha` en dur ;
l'ancien foyer s'écrit `$HOME/runs/...`, et le libellé du contrôle 5 a perdu ce même chemin ; les
commentaires passent en anglais (code en anglais, prose des pages en français), les noms des contrôles
restent en français, c'est le rapport. Les 46 contrôles, leur ordre et leurs issues attendues sont
inchangés.

**Vérifié.** Le compte est identique avant et après le déplacement, et il est **46**, pas davantage : les
deux contrôles qu'ADR-021 demande pour le volet reçu restent à écrire. Le banc touche un dossier jetable
sous `$TMPDIR` et **un lien symbolique écrit puis retiré** dans l'espace de travail du cas (contrôles 40
et 41, le 41 échouant si l'espace n'est pas rendu propre) ; jamais le dépôt, jamais les quatre arbres,
aucune session, `run.mjs` intact. `grep -n '/home/giak'` sur le script → **aucun**, et le banc est rejoué
complet après la retouche du libellé : 46/46, `exit 0`.

**Dérives signalées, non corrigées.** La copie superseded `/tmp/banc-porte.sh` est **laissée en place**,
nommée ici : elle sort de la session sans qu'on l'efface, et c'est le fichier du dépôt qui fait foi
désormais. Le dépôt porte maintenant un script (ADR-004 et ADR-012 parlaient d'absence de contrôle
mécanique) : l'ADR-022 le tranche en le nommant **artefact de la preuve**, jamais automatisme, et le mode
d'emploi dit à voix haute qu'il n'éprouve que le harnais.

**Rectifications.** Une, de la séance même : la première rédaction de ce bloc affirmait « et rien
d'autre » pour la liste des changements, alors que le **libellé** du contrôle 5 perdait ensuite son chemin
de machine (`ancien foyer /home/giak/runs` → `ancien foyer ~/runs`). Le compte, l'ordre et les issues
attendues n'ont pas bougé ; c'était le dernier chemin en clair du script, et le banc a été rejoué après la
retouche.

**Prochaines étapes.** 1. Le commit : tout ce travail est non commité, dont la journée entière. 2. Les
deux contrôles d'ADR-021 quand l'arbitrage tombe ; ils prendront place dans ce même compte. 3. La copie de
`/tmp`, à effacer ou à laisser, quand le relecteur le dit.

**Mémoires.** `e65db0f3` — le banc entré dans le dépôt, ses chemins lus au gel, ses trois garde-fous, et ce
qu'il ne couvre pas.

**Fermeture.** La séance est close à cet instant : ce qui la touchera plus tard s'écrira dans un nouveau
bloc daté qui la cite. Elle se ferme sur un `HEAD` inchangé, `d239b08`, et un banc qui passe ses 46
contrôles depuis le dépôt.

## Séance 9 — 2026-10-16 (la journée est mise au dépôt)

**Objectif.** Mettre au dépôt ce que les Séances 6 à 8 ont produit, sur la demande du relecteur.

**Fait.** Un commit sur `main` : `0d2f012` (« Consigner la journée du 2026-10-16 : l'architecture, la
relecture, deux ADR et le banc »), **11 fichiers, +1 199 / −52**. Contenu : les deux pages neuves de la
Séance 6 (architecture, relecture à froid) et ses cinq pages remises au vrai ; le registre avec l'ADR-021
proposée et l'ADR-022 ; le banc `docs/device/harness/banc-harnais.sh`, mode `100755`, avec son mode d'emploi
`docs/device/BANC.md` ; et le journal des trois séances.

**Vérifié.** `git show --stat --format='' 0d2f012` → les 11 chemins attendus, aucun autre ;
`git status --porcelain` → vide après le commit ; `git rev-parse --short HEAD origin/main` → `0d2f012`
d'un côté, `d239b08` de l'autre : **rien n'est poussé**, `main` est devant d'un commit. Le compte de
fichiers annoncé par le relecteur (six pages et deux fichiers neufs) était celui de la Séance 6 : les
Séances 7 et 8 y ont ajouté `docs/DECISIONS.md` et les deux fichiers du banc, d'où les onze.

**Dérives signalées, non corrigées.** Aucune.

**Rectifications.** Aucune.

**Prochaines étapes.** Le push n'est pas demandé ; la déclaration du remote dans `AGENTS.md` reste un
arbitrage ouvert, et il commande ce push. Puis, inchangés : l'arbitrage de l'ADR-021, ses deux contrôles de
banc, et le mot à dire sur la copie `/tmp/banc-porte.sh`.

**Mémoires.** Aucune nouvelle : `e65db0f3` porte la mise à jour du dépôt de la Séance 8, et le hash du
commit vit ici.

**Fermeture.** La séance est close à cet instant : ce qui la touchera plus tard s'écrira dans un nouveau
bloc daté qui la cite. Elle se ferme sur `0d2f012`, arbre propre, dépôt devant `origin/main` d'un commit.

## Séance 10 — 2026-10-16 (les chiffres de la clôture de la Séance 6, rejoués)

**Objectif.** Rejouer d'un bout à l'autre les chiffres de la clôture de la Séance 6, rapporter ce qui ne
correspond plus, et ne rien corriger en silence.

**Fait.** Chaque figure rejouée par sa propre commande :

| Figure de la clôture | Commande | Résultat |
| --- | --- | --- |
| `ARCHITECTURE.md`, 262 lignes, neuf sections, cinq schémas | `wc -l` ; `grep -c '^## '` ; le compte des blocs mermaid | 262 ; 9 ; 5 : **tient** |
| la relecture, 111 lignes, six décrochages | `wc -l` ; `grep -n '^### '` | 111 ; les décrochages 1 à 6 : **tient** |
| « cinq blocs, plus cette clôture » | `grep -c 'Tour suivant'` plus le premier tour | 5 : **tient**, mais la même séance écrit « Cinq tours » à sa clôture et « les cinq blocs mermaid » à son deuxième tour : le mot y porte deux sens |
| cinq fichiers, +77 / −49 | `git diff --numstat d239b08 0d2f012` sur les cinq fichiers ; les deux hunks du banc lus dans le `git diff` de `DEVICE.md` | +82 / −52 moins +5 / −3, soit **+77 / −49** : **tient**, reconstitué |
| `git status -uall` rend deux fichiers neufs | `git status -uall --porcelain` | **0 ligne** : les deux fichiers sont commités (`0d2f012`) |
| « aucun code touché », le harnais rend le même `git diff` muet | `git diff --quiet d239b08 HEAD -- docs/device/harness/run.mjs` | `exit 0` : **tient** |
| trois mémoires, dont `11210a41` mise à jour deux fois | lecture des trois | les trois existent ; `11210a41` porte `updated_at` `11:32:39` contre `created_at` `11:21:50`, donc au moins une mise à jour ; le compte « deux fois » n'est pas exposé par l'outil, `UNKNOWN` |
| la clôture se ferme sur un `HEAD` inchangé, `d239b08` | `git log -1` | **`1235c5a`** : `d239b08` était le HEAD du moment, et la clôture le dit comme tel |

**Vérifié.** Les trois points ouverts qu'elle laissait tiennent encore, mesuré : `NEGATIVE.md` et `ECART.md`
absents ; `AGENTS.md` ne nomme ni remote ni `github.com` (0 occurrence) ; `BOUNDARY.md` §7 cite toujours
`39750fe` ; les trois skills n'ont ni `type:` ni `status:` (l'`OPEN` de la Séance 5) ; les six décrochages
restent non corrigés, contrôle fait sur le deuxième (« AIDD » employé sans définition) et le sixième
(`EXPLICATION` annonce « 21 commits » quand l'arbre en compte **38**). Un des cinq arbitrages du point 2 est
fait : le commit de la journée, `0d2f012`, porté au journal par `1235c5a`. Les deux hunks de la Séance 8
sur `DEVICE.md` ont été reconnus par leur contenu (`−2/+3` et `−1/+2`, leurs retraits étant restés ceux de
`d239b08`) : c'est ce qui rend le +77 / −49 reconstruit, et non supposé.

**Dérives signalées, non corrigées.** `docs/DASHBOARD.md` ligne 44 parle encore d'un « banc **jetable** » :
le compte qu'elle donne (46/46) est juste, l'adjectif est faux depuis la Séance 8, où le banc est entré dans
le dépôt (`harness/banc-harnais.sh`, [ADR-022](DECISIONS.md)). Signalé ici, pas réécrit : ce rapport n'était
pas un mandat de correction.

**Rectifications.** Aucune **figure** : aucune n'était fausse, ni au moment, ni aujourd'hui ; les deux
écarts (`git status -uall`, `HEAD`) sont des états datés que du travail postérieur a légitimement dépassés.
Deux de **forme**, corrigées dans la foulée : la première rédaction citait `--numstat` avant qu'il ne soit
couru (il rend le même total que le `--stat`, 82 / 52, vérifié depuis), et elle portait un triple accent
grave dans une cellule de tableau, qui aurait cassé le rendu. Les cinq rendus mermaid vivent encore dans
`/tmp/arch/block-1.svg` à `block-5.svg`, mais relire un libellé dans un SVG n'est pas une mesure rejouable :
c'est un acte daté, attesté par le journal seul.

**Prochaines étapes.** Le mot du relecteur sur les deux points nommés (les six décrochages, l'adjectif du
`DASHBOARD`) ; puis, inchangée, l'étape 3 du bilan §11, la sonde du client.

**Mémoires.** `2a354eb2` — le rejeu intégral, ce qui tient, ce qui a été dépassé, et la dérive signalée ;
`11210a41` corrigée à la source, elle disait « travail NON COMMITÉ » et « 36 commits ».

**Fermeture.** La séance est close à cet instant : ce qui la touchera plus tard s'écrira dans un nouveau
bloc daté qui la cite. Elle se ferme sur `1235c5a`, un journal qui porte ce rapport **non commité**, et une
clôture ancienne dont aucune figure n'est tombée.

## Séance 11 — 2026-10-16 (l'ADR-021 réduite à un choix : A, le volet séance, ou B, les deux volets)

**Objectif.** Rendre l'arbitrage de l'ADR-021 possible en un mot, sur la demande du relecteur.

**Fait.** La fiche est réécrite au registre, même numéro, même place : elle porte maintenant deux variantes
nommées, précédées du fait mesuré commun et des trois raisons qui écartent le crochet, suivies de ce que
chaque réponse déclenche. `A`, le volet séance seul : la commande du §5 comparée aux deux lignes
documentées, en clôture de toute séance capable d'écrire, prix **aucune ligne de code** et deux lignes de
prose dans BOUNDARY §5. `B`, les deux volets : A plus la comparaison des arbres autres que `travail` au
reçu, l'écart écrit en limite, prix une comparaison, une limite et deux contrôles au banc (`46` → `48`). La
fiche dit aussi ce que `B` **n'attrape pas** : la classe des deux incidents datés, aucun run n'étant ouvert
alors, le premier ouvrant à `17:15:59`.

**Vérifié.** Le registre reste numéroté et continu : `grep -n '^## ADR-02'` → ADR-020 `l.379`, ADR-021
`l.414`, ADR-022 `l.460`, cette dernière intacte après le remplacement. **Rien n'est codé** :
`git diff --quiet docs/device/harness/run.mjs` → `exit 0` ; le harnais reste à 882 lignes et le banc à ses 46
contrôles, aucun des deux n'ayant bougé.

**Dérives signalées, non corrigées.** Aucune nouvelle ; celles de la Séance 10 tiennent (les six
décrochages, l'adjectif du `DASHBOARD`).

**Rectifications.** Aucune.

**Prochaines étapes.** La réponse `A` ou `B` ; si `B`, la passe de codage et ses deux contrôles. Restent en
attente, hors de cette fiche : le mot sur les six décrochages et l'adjectif du `DASHBOARD`, l'étape 3 du
bilan §11 (la sonde du client), et le commit de ce qui n'est pas commité.

**Mémoires.** `42548adf` corrigée à la source : elle décrivait les deux volets en bloc, elle porte
maintenant le choix `A` / `B` et ce que chaque réponse déclenche.

**Fermeture.** La séance est close à cet instant : ce qui la touchera plus tard s'écrira dans un nouveau
bloc daté qui la cite. Elle se ferme sur `1235c5a`, deux fichiers modifiés et non commités (`docs/trace.md`,
`docs/DECISIONS.md`), et une fiche qui n'attend plus qu'un mot.

## Séance 12 — 2026-10-16 (l'ADR-021 tranchée : la variante A, et le geste écrit dans BOUNDARY §5)

**Objectif.** Enregistrer l'arbitrage de l'ADR-021 rendu le 2026-10-16, appliquer ce que la variante
retenue demande, et ne rien coder au-delà.

**Fait.** Réponse : **`A`, le volet séance seul.** Trois pages touchées : le registre, où l'ADR-021 passe
d'« à arbitrer » à **acceptée**, la réponse et ses conséquences écrites, `B` décrit comme non retenu ;
`BOUNDARY.md` §5, qui porte le geste (la paire de `porcelain` de l'origine relevée aussi en clôture de
toute séance capable d'écrire, l'écart allant au `Vérifié`) ; et `BOUNDARY.md` §8, dont le dernier point ne
dit plus « rien dans le dépôt ne la contrôle » mais que la dérive est **lue**, jamais empêchée.

**Vérifié.** **Aucune ligne de code** : `git diff --quiet docs/device/harness/run.mjs` → `exit 0` ; le
harnais reste à 882 lignes et le banc à ses 46 contrôles, la variante `B` seule en aurait ajouté deux. Le
geste n'est pas une mesure neuve : sa commande et son contrôle négatif ont été courus le 2026-10-16
(`git -C /home/giak/projects/framework status --porcelain` → les deux lignes documentées, `exit 0`).
`git status --porcelain` → trois fichiers modifiés : `docs/DECISIONS.md`, `docs/device/BOUNDARY.md`,
`docs/trace.md`.

**Dérives signalées, non corrigées.** Celles de la Séance 10 tiennent : les six décrochages de la relecture
et l'adjectif « jetable » du `DASHBOARD` attendent toujours un mot.

**Rectifications.** Aucune.

**Prochaines étapes.** Le commit des trois fichiers, dans la foulée. Restent ouverts, hors de cette fiche :
les deux dérives ci-dessus, l'étape 3 du bilan §11 (la sonde du client), et la variante `B`, si un jour un
run montre un arbre voisin déplacé.

**Mémoires.** `42548adf` — l'ADR-021 : réponse `A`, ce qu'elle applique, ce que `B` aurait coûté et ce qui
la rappellerait.**Fermeture.** La séance est close à cet instant : ce qui la touchera plus tard s'écrira dans un nouveau
bloc daté qui la cite. Elle se ferme sur `1235c5a`, trois fichiers qui portent l'arbitrage, rien de codé, et
une dérive devenue lue sans être empêchée.

## Séance 13 — 2026-10-16 (le remote déclaré dans `AGENTS.md`, et la journée poussée)

**Objectif.** Fermer le second des cinq arbitrages de la Séance 6, la **déclaration** du remote dans
`AGENTS.md`, la seule moitié de P6 qui restait, puis pousser la journée et remettre au vrai les pages qui
l'attendaient.

**Fait.** `AGENTS.md` gagne une phrase, la première du contrat à nommer l'adresse du dépôt : le contrat passe
de 113 à 115 lignes (commit `0fd34d7`, 3 insertions, 1 suppression, un seul fichier). La poussée suit dans la
même foulée. Quatre pages portaient la décision comme pendante et portent son état : la note datée sous
`P6` de la [spec de la boucle 2](brainstorm/2026-10-15-081511-gestion-de-projet.md), qui dit maintenant que
la déclaration est faite ; sa ligne « À décider par le relecteur », qui l'avait listée ; le point 5 du
[DASHBOARD](DASHBOARD.md), dont la moitié « remote » est close quand celle du commit debout (P5) reste
ouverte, et son en-tête de dernière mise à jour ; la ligne « Boucle 2 : remote » du [PFD](PFD.md).

**Vérifié.** L'adresse n'est pas recopiée d'une page : `git remote -v` rend `origin
https://github.com/giak/aidd-device.git` (fetch et push), `git branch --show-current` rend `main`, et
`git ls-remote origin refs/heads/main` la lit **sans authentification** — la lecture hors machine que P6
demandait. La déclaration est au contrat, mesurée par `grep -n 'github.com/giak/aidd-device' AGENTS.md` →
ligne 11 ; avant elle, 0 occurrence de « remote » ou de « github » dans `AGENTS.md` (relevé de la Séance 10,
rejoué). **Le geste de l'[ADR-021](DECISIONS.md) est tenu pour la première fois** : `git -C
/home/giak/projects/framework status --porcelain` → les deux lignes documentées en [BOUNDARY](device/BOUNDARY.md)
§5 (`?? .freebuff/`, `?? aidd_docs/MEGA-PROMPT-TEST-AIDD-v6.md`), `exit 0`, aucun écart à lire. Et la
poussée, avant et après : `git ls-remote origin refs/heads/main` → `d239b08` avant, `0fd34d7` après ;
`git push origin main` → `d239b08..0fd34d7  main -> main`, `exit 0`.

**Dérives signalées, non corrigées.** Aucune nouvelle. Celles de la Séance 10 tiennent : les six décrochages
de la relecture, dont le sixième — `EXPLICATION.md` annonçait « 21 commits » quand l'arbre en comptait 38 à
ce relevé-là et **40** avant le commit qui porte ce bloc (`git rev-list --count HEAD`) — et l'adjectif
« jetable » du `DASHBOARD`. Les deux restent au mot du relecteur.

**Rectifications.** Aucune.

**Prochaines étapes.** L'étape 3 du bilan §11 (la sonde du client Freebuff), puis le second run sur le gel
`0d9a2180`. Restent ouverts, hors de cette fiche : le commit debout de P5, les six décrochages, le frontmatter
des trois skills, et la copie `/tmp/banc-porte.sh`.

**Mémoires.** `11210a41` corrigée à la source : elle disait « `origin/main` reste `d239b08` et **rien n'est
poussé** ». `e65db0f3` (le banc entré au dépôt, Séance 8) portait la même phrase ; corrigée elle aussi, dans
l'amendement du même jour, parce qu'une mémoire contredite par l'état se corrige à la source.

**Fermeture.** La séance est close à cet instant : ce qui la touchera plus tard s'écrira dans un nouveau
bloc daté qui la cite. Elle se ferme sur `65ae76b`, qui porte P6 remise au vrai, puis sur le commit qui
porte cet amendement : `origin/main` a quitté `d239b08` pour porter la journée, et le geste de l'ADR-021 a
trouvé son premier témoin.

## Séance 14 — 2026-10-16 (la poussée vue par un inconnu : la recette rejouée depuis un clone neuf)

**Objectif.** Éprouver la poussée de la Séance 13 par l'interface d'un tiers — la [recette de
rejeu](device/REPLAY.md) — et réparer ce que ce push a rendu faux.

**Fait.** La poussée a fait mentir deux phrases de REPLAY §3, écrites le 2026-10-15 : « le gel poussé est
encore celui d'avant l'ADR-016 » (sortie `exit 3`) et « il attend un commit et un push ». Réparées : le bloc
`exit 3` reste, daté « jusqu'au push du 2026-10-16 » ; une entrée datée dit ce que le clone public rend
depuis ; l'intro du bloc « avec le gel refait » passe au passé ; la note d'ouverture des sorties citées
mentionne le 2026-10-16 ; et la dernière phrase que la recette imprime sur un gel d'avant l'ADR-016 ne parle
plus d'un push qui n'a plus lieu d'être.

**Vérifié.** Le §3 n'était pas une prédiction : la recette du §2, **extraite du fichier** (bloc `bash`, pas
recopiée à la main), écrite dans `/tmp/replay-seance14.sh` et rejouée **depuis un clone neuf**, deux fois —
avant la réparation et après. Les deux : `empreinte True`, `VERDICT   gel rejoué à l'identique`, `exit 0`,
les huit références `True`, `framework-origin publié sur gel/2026-10-15-fe48de12 True`, `terrain publié sur
main True`, et les deux mêmes limites (« dépôt public inconnu du gel ») pour `revision-sous-test` et
`travail`. `bash -n` sur la recette réparée → `exit 0`. Le gel que le clone reçoit, mesuré : `git show
origin/main:docs/device/CASES/<cas>.freeze.json` → empreinte `0d9a2180…`, `gele_le`
`2026-10-15T22:11:24.782242943+0200`, `fichiers[].chemin` **relatifs**, et `git diff --quiet origin/main --
<gel>` → `exit 0` (identique au disque). La journée sur `origin/main` : `0d2f012`, `1235c5a`, `497c5fe`,
`0fd34d7`, `65ae76b`, `553de8d` ; `git rev-list --count origin/main..HEAD` → **0** à cette mesure-là.

**Dérives signalées, non corrigées.** Celles de la Séance 10, inchangées : les six décrochages de la
relecture (dont `EXPLICATION.md`, « 21 commits ») et l'adjectif « jetable » du `DASHBOARD`.

**Rectifications.** Aucune.

**Prochaines étapes.** L'étape 3 du bilan §11 (la sonde du client Freebuff), puis le second run sur le gel
`0d9a2180` — qui se lit maintenant hors machine. Inchangés, hors de cette fiche : le commit debout de P5, les
six décrochages, le frontmatter des trois skills, la copie `/tmp/banc-porte.sh`.

**Mémoires.** `4aec359e` — nouvelle : la recette passe depuis un clone public, ce qu'elle prouve et ce qu'elle
ne prouve pas, et la réparation de REPLAY. `11210a41` corrigée à la source : sa ligne disait que le gel refait
n'était pas encore poussé.

**Fermeture.** La séance est close à cet instant : ce qui la touchera plus tard s'écrira dans un nouveau
bloc daté qui la cite. Elle se ferme sur le commit qui la porte : un inconnu, depuis un clone neuf, rejoue le
texte scellé et lit les quatre arbres, sans rien connaître de cette machine.

## Séance 15 — 2026-10-16 (la sonde du client Freebuff : ce qu'il écrit, où, et ce qu'on peut en prouver)

**Objectif.** Faire l'**étape 3** de la chaîne du [bilan](brainstorm/2026-10-15-201458-bilan-premier-run.md)
§11 — sonder le client du second run : racine de projet, texte octet pour octet, lecture en `..`, trace
exportable — et l'écrire dans son foyer, sans toucher au harnais.

**Fait.** La [conduite](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md)
gagne un **§1.7**, en neuf sous-sections : les cinq foyers du client et ce qu'on y trouve ; ce qu'il écrit
**dans l'arbre où on l'ouvre** ; le piège du mode *worktree* ; la racine de projet ; la comparaison du texte
**octet pour octet** ; la lecture hors de la racine ; l'export de trace ; les quatre gestes de l'ouverture,
puis cinq limites nommées. Son §1.5 est rectifié — sa liste de genres était **incomplète**, pas fausse. Le
point 1 du [DASHBOARD](DASHBOARD.md) §3.1 passe de « non éprouvé » à « sonde faite ; il reste un geste ».
**Aucune ligne de code** : `run.mjs` et le banc ne sont pas touchés, et rien n'entre au dépôt comme script —
les commandes de la sonde vivent dans la page, pas dans un mécanisme de plus.

**Vérifié.** Chaque ligne du §1.7 vient d'une commande courue le 2026-10-16, dans une session Freebuff
ouverte sur ce dépôt (fil `ce9c488a`, *harness* `codebuff`) :

| Ce qui est mesuré | Commande | Résultat |
| --- | --- | --- |
| le texte stocké contre le texte reçu | `cmp` et `sha256sum`, sur `parts_json[0].text` extrait en lecture seule | **identiques**, `deffae8d…` (145 o) et `12c09bd7…` (105 o) : aucun guillemet ajouté, l'inverse d'`opencode` au premier run |
| la base du projet | `count(*)` sur `threads`, `messages`, `json_array_length(parts_json)` | 4 fils, 101 messages, 2 504 parts, 10,5 Mo |
| les racines | `select id, root_path, default_branch from projects` sur les onze bases | onze lignes, toutes **absolues**, dont une en `/tmp` — rien n'interdit `<W>/terrain` |
| l'état du fil | `threads` : `model`, `harness_id`, `execution_mode`, `branch`, `worktree_path` | `codebuff`, `local`, `branch` et `worktree_path` **vides** ici ; un autre fil porte une branche `freebuff/…` et `~/.freebuff/worktrees/dfe8952d/aidd-device`, encore dans `git worktree list` |
| ce que le client écrit dans l'arbre | `cat .freebuff/project-id` | 37 o, l'UUID du projet ; la copie `terrain` du cas n'en a **pas** et son `porcelain` est **vide** |
| la lecture hors racine | `read_files` sur `../audio-sync-tool/README.md` | résolu et lu (`/home/giak/projects/audio-sync-tool/README.md`) — le `..` du bilan §11 n'est pas bloqué |
| l'export de trace | la commande du §1.5, rejouée telle quelle | `exit 0`, **694 lignes**, 863 514 o, huit genres dont `notice` |
| les compteurs | `select distinct key from messages, json_each(metrics_json)` | `context`, `compactions`, `usage`, `costUsd` |
| la pièce du cas | `sha256sum <W>/texte-a-remettre.txt` | `832036f7…`, 254 o — le texte à comparer à l'ouverture |

**Dérives signalées, non corrigées.** Celles de la Séance 10, inchangées : les six décrochages de la
relecture (dont `EXPLICATION.md`, « 21 commits ») et l'adjectif « jetable » du `DASHBOARD`. Celle que cette
séance a nommée était **dans son périmètre** et a été corrigée dans la foulée : la liste des genres du §1.5.

**Rectifications.** Deux, sur les affirmations de cette séance, trouvées par un contrôle fait après
l'écriture : le **compte de sous-sections** annoncé « huit » est **neuf** (`grep -c '^#### '` sur le §1.7) ;
et le lien du §1.7 vers le `.gitignore` racine visait `docs/.gitignore`, qui n'existe pas — réparé en
`../../../../.gitignore`, et les cinq liens du §1.7 résolvent tous, contrôle rejoué (`exit 0`).

**Prochaines étapes.** Le geste, pas la mesure : **aucun projet Freebuff ne pointe `<W>/terrain`** — la
racine du run se pose à la main, et c'est la dernière chose qui manque avant l'étape 4, le second run.
Tiennent aussi, hors de cette fiche : le commit debout de P5, les six décrochages, le frontmatter des trois
skills, la copie `/tmp/banc-porte.sh`.

**Mémoires.** `e1112361` — nouvelle : les foyers du client, le texte octet pour octet, le piège du worktree,
la lecture hors racine, l'export rejoué, et ce que la sonde ne prouve pas. `11210a41` corrigée à la source :
sa ligne disait que l'étape 3 était non faite.

**Fermeture.** La séance est close à cet instant : ce qui la touchera plus tard s'écrira dans un nouveau bloc
daté qui la cite. Elle se ferme sur un travail **non commité** (la conduite, le `DASHBOARD`, ce bloc) : le
relecteur n'a pas demandé de commit, et un dépôt propre se lit — pas une séance.

## Séance 16 — 2026-10-16 (`ARCHITECTURE.md` relue, chiffre par chiffre)

**Objectif.** Double-check de [ARCHITECTURE.md](ARCHITECTURE.md) : relire chaque chiffre contre sa pièce, et
réparer ce qui ne tenait plus.

**Fait.** **Un chiffre était faux, corrigé** : le gabarit du nom de dossier d'un run portait un `@`
(`runs/<horodatage>-<révision du framework>@<révision du dispositif>/`) que le nom réel n'a pas : le seul
dossier existant est `docs/device/runs/2026-10-15-171559-4c39e5c5-1d471a5/`, séparateurs à tirets, et c'est
lui la source du gabarit. **Deux faits mesurés le même jour entrent**, au foyer de leurs sections : au §3,
le marqueur `.freebuff/project-id` (37 o) que le client écrit dans l'arbre ouvert et hors produit ; au §8, ce que la sonde du client a rendu (lectures hors racine **libres**, écritures hors racine **non éprouvées**, mode *worktree* à refuser, texte stocké identique au texte reçu). La note de rectification entre en tête et le §9 nomme désormais le §1.7 de la conduite.

**Vérifié.** Chaque affirmation chiffrée de la page, relue contre sa pièce, le 2026-10-16 :

| Ce que la page affirme | Pièce réinterrogée | Résultat |
| --- | --- | --- |
| 882 lignes, « aucune dépendance, aucun hook, aucun CI » | `wc -l run.mjs` ; son en-tête l. 33 | 882 ; la phrase y est : **tient** |
| le reçu et le jugement refusent un cas qui a bougé depuis le gel | en-tête de `run.mjs` l. 42-44, la formule d'empreinte l. 259, le refus l. 274 | **tient** : c'est la réparation du doute du 2026-10-15, en place dans le code |
| les quatre labels et leurs `HEAD` (`fe48de12`, `416ec1f`, `4c39e5c5`, `416ec1f`) | lecture du gel | **tient** |
| `arbres[]` porte `head`, `head_complet`, `porcelain`, `remotes`, `refs_distants` | les clés réelles de `arbres[0]` | **tient** (`chemin`, `head`, `head_complet`, `label`, `porcelain`, `refs_distants`, `remotes`) |
| `fichiers[]` (rôle, chemin, `sha256`), `references[]` (arbre, chemin, `sha256`), **8 références** | les clés réelles et le comptage | **tient** (les deux portent en plus `birth`, `birth_epoch`, `taille`) |
| **neuf** falsificateurs du run, **quatre** de l'attendu, nommés `F1`…`F9` / `E1`…`E4` | `falsificateurs_du_run` et `falsificateurs_de_l_attendu` de l'attendu | **tient** : 9 et 4, conditions conformes à ce que la page écrit |
| un re-gel détruit le précédent, « six fois le 2026-10-15 » | `run.mjs` l. 379 ; journal, Séance 3 (« cinquième re-gel du même jour » puis « sixième ») | **tient** |
| le plafond du verdict | conduite §3.3 | **tient** |
| les liens de la page | existence de chaque cible | **10/10 résolvent** |

**Dérives signalées, non corrigées.** Celles de la Séance 10, inchangées (les six décrochages, l'adjectif
« jetable »). Et une nommée par cette relecture : `DECISIONS.md` l. 145 écrit le même gabarit de nom de run
avec `@` (`runs/<horodatage>-<framework@rev>-<dispositif@rev>/`) : lisible comme une notation, mais c'est
elle qui a induit le `@` de la page ; la laisser telle quelle est un choix du relecteur, pas une évidence.

**Rectifications.** Aucune.

**Prochaines étapes.** Inchangées : le geste (ouvrir un projet Freebuff sur `<W>/terrain`), puis le second
run. Restes hors de cette fiche : le commit debout de P5, les six décrochages, le frontmatter des trois
skills, `/tmp/banc-porte.sh`, et ce qui n'est pas commité depuis la Séance 15.

**Mémoires.** `0f0916a8` — nouvelle : la relecture d'`ARCHITECTURE.md`, ce qui tient chiffre par chiffre, le
`@` corrigé, et les deux faits de la sonde entrés dans la page.

**Fermeture.** La séance est close à cet instant : ce qui la touchera plus tard s'écrira dans un nouveau bloc
daté qui la cite. Elle se ferme sur un travail **non commité** (la page, son registre, ce bloc) : quatre
fichiers modifiés aujourd'hui, aucun commit, la relecture a réparé une page, elle n'a ouvert aucune session.

## Séance 17 — 2026-10-16 (`ARCHITECTURE.md`, second contrôle : trois réparations)

**Objectif.** Refaire le double-check de [ARCHITECTURE.md](ARCHITECTURE.md), la Séance 16 ayant clos le sien
sur un travail non commité : chaque référence reportée sur sa pièce, et ce qui a manqué depuis, comblé.

**Fait.** Trois défauts trouvés, trois réparations, dans la page et à sa note d'en-tête :

| Défaut | Pièce qui le dit | Réparation |
| --- | --- | --- |
| le **banc du harnais** n'était nommé nulle part, alors qu'il vit au dépôt depuis le jour même | [BANC.md](device/BANC.md), [ADR-022](DECISIONS.md) | une phrase au §4 (46 contrôles, rien ne le déclenche seul, il n'éprouve que le harnais, jamais le dépôt) et une ligne à la carte du §9 |
| `last-message.md` rangé sous `runs/<id>/` | spec §4, qui le place sous `raw/<cas>/` | la ligne du tableau §5 et le libellé du schéma §5, remis sous `raw/<cas>/` |
| `produit.absent` attribué à `output.json` | `run.mjs` l. 784 (le reçu porte `produit`) contre l. 858 (la sortie porte `produit_brut`) | la phrase du §7 : `produit.absent` au reçu, `produit_brut` à la sortie |

Le [DASHBOARD](DASHBOARD.md) suit : en-tête à la séance, ligne du banc du harnais complétée de son nouveau
foyer, et une ligne pour [BANC.md](device/BANC.md), qui manquait à la liste des documents produits.

**Vérifié.** Chaque chiffre et chaque nom, remesuré ce jour :

| Ce que la page affirme | Commande | Résultat |
| --- | --- | --- |
| le banc, 46 contrôles | `bash docs/device/harness/banc-harnais.sh` | `exit 0`, `46/46 PASS`, 46 `PASS` / 0 `FAIL` |
| les cinq schémas mermaid | 5 blocs extraits, `mmdc` 11.4.2, `PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome` | 5/5 `exit 0` : 24 336 / 11 918 / 14 101 / **19 375** / 16 149 o ; 0 élément `<g class="error-icon"` ; le libellé modifié relu dans le SVG ; et `cmp` 5/5 avec les blocs extraits **après** la dernière réparation |
| les 11 liens | boucle sur chaque cible | 11/11 résolvent (10 + `BANC.md`) |
| 882 lignes, « aucune dépendance » | `wc -l run.mjs` ; `grep '^import'` | 882 ; cinq imports, tous `node:` (fs, crypto, child_process, path, url) |
| les quatre labels et leurs `HEAD` | lecture du gel | tiennent (`fe48de12`, `416ec1f`, `4c39e5c5`, `416ec1f`) |
| 2 fichiers de cas, 8 références, `racine_espace_de_travail`, `gele_le` | lecture du gel | tiennent (`…/aidd-device-work`, `2026-10-15T22:11:24…`) |
| 9 falsificateurs du run, 4 de l'attendu, `F1`…`F9` / `E1`…`E4` | `falsificateurs_du_run`, `falsificateurs_de_l_attendu` | tiennent, conditions conformes à ce que la page écrit |
| le dossier du run | `ls docs/device/runs/` ; `git cat-file -t 1d471a5` | un seul dossier, `2026-10-15-171559-4c39e5c5-1d471a5` ; `1d471a5` est un commit du dépôt |
| les refus du §4, commande par commande | `grep 'preflight : ' run.mjs` (9 refus) et les refus de `collect`, `receipt`, `compare` | tiennent |
| la copie `travail` ne porte aucun `aidd_docs` | `ls $W/terrain` | tient |
| `cloisonnement.attendu_vu` | `run.mjs` l. 683, 756 | tient : exigé au reçu, et « oui » force `non concluant` |

**Dérives signalées, non corrigées.** Le gabarit `@` du v6 vit encore à cinq endroits (spec §4, conduite
§1.3, [DEVICE](device/DEVICE.md) l. 70, [DECISIONS](DECISIONS.md) l. 145, méga-prompt v6 l. 387), et c'est
la commande réelle de la conduite §1.3 qui rend des tirets : `ARCHITECTURE.md` est la seule page alignée sur
le nom réel du dossier de run. `DASHBOARD.md` §2 garde l'adjectif « jetable » et les comptes du banc des 15
et 16 : complétés d'une ligne de foyer, pas réécrits. Et rien des Séances 15 et 16 n'est commité à cet
instant.

**Rectifications.** Aucune.

**Prochaines étapes.** Inchangées : le geste (ouvrir un projet Freebuff sur `<W>/terrain`, en mode direct,
sans *worktree*), puis le second run sur le gel `0d9a2180`.

**Mémoires.** `e0a566d7` — nouvelle : le second contrôle d'`ARCHITECTURE.md`, les trois réparations, ce qui a
été remesuré, et les cinq endroits qui gardent le gabarit `@`.

**Fermeture.** La séance est close à cet instant : ce qui la touchera plus tard s'écrira dans un nouveau bloc
daté qui la cite. Elle se ferme sur un travail **non commité** (la page, le tableau de bord, ce bloc) : aucun
commit, aucune session ouverte, `run.mjs` intact.

## Séance 18 — 2026-10-16 (le gabarit du nom d'un run : des tirets, et `@` redevient une notation)

**Objectif.** Trancher la divergence que la Séance 16 avait nommée et laissée ouverte : trois pages du
dispositif **prescrivaient** `runs/<horodatage>-<framework@rev>-<dispositif@rev>/`, la seule page alignée sur
le nom réel écrivait des tirets, et la commande de la conduite en produisait déjà.

**Fait.** La décision est l'[ADR-023](DECISIONS.md), et les pages qui prescrivent l'appliquent :

| Pièce | Nature | Geste |
| --- | --- | --- |
| spec §4 l. 83 | prescription | le gabarit écrit en tirets, renvoi à l'ADR-023, note datée en tête |
| conduite §1.3 l. 205 et ses puces l. 219-220 | prescription | même gabarit ; les puces nomment « révision du framework » et « révision du dispositif » et disent `framework@rev` pour ce qu'il est, la notation du v6 ; note datée en tête |
| [DEVICE](device/DEVICE.md) l. 70 | prescription | même gabarit, renvoi |
| [ARCHITECTURE](ARCHITECTURE.md) §5 l. 184 | description | la phrase du gabarit gagne le renvoi |
| v6 l. 387 (le gabarit) et l. 392-393 (l'exigence), [ADR-013](DECISIONS.md) l. 145, journal l. 345 et l. 1311 | citations | **inchangées** : un enregistrement daté ne se réécrit pas pour une notation |

**Vérifié.** La mesure qui tranche, et le reste, remesurés ce jour :

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| le v6 ne prescrit aucun séparateur | `grep -n 'porte les deux révisions'` (l. 393) et relecture du bullet l. 387 | le v6 dit « Le nom du dossier porte les deux révisions, sans quoi la sortie ne dit pas ce qui l'a produite » : l'exigence porte sur les deux révisions, pas sur le caractère qui les sépare |
| le nom réel porte ces deux révisions | `ls docs/device/runs/` ; `git cat-file -t 1d471a5` | `2026-10-15-171559-4c39e5c5-1d471a5`, et `1d471a5` → `commit` de ce dépôt |
| la commande de la conduite rend des tirets | conduite §1.3 l. 212 | `…/runs/$(date +%Y-%m-%d-%H%M%S)-4c39e5c5-$(git -C … rev-parse --short HEAD)` |
| `run.mjs` ne fabrique aucun nom de dossier | `grep -n 'runs/' run.mjs` ; `grep -c 'date +'` | deux mentions, en commentaire ; `--run` reçoit le chemin ; zéro `date +` |
| ce qui garde un `@` est une citation | `grep -rn 'framework@rev'` | quatre fichiers : le v6, l'ADR-013 qui le mesure, le journal, et l'ADR-023 qui le cite |
| les liens des six pages touchées | boucle sur chaque cible, depuis le dossier de chaque page | 0 mort, après la réparation de `DEVICE.md` |
| les cinq schémas d'ARCHITECTURE | `cmp` des blocs extraits contre ceux rendus en Séance 17 | identiques : l'édition est hors mermaid |

**Dérives signalées, non corrigées.** Aucune nouvelle : le `@` qui subsiste dans le v6 et dans les
enregistrements datés est le résultat de la décision, pas une dérive. Restent celles des séances 10, 16 et
17, inchangées.

**Rectifications.** Deux, toutes deux de cette séance. (1) L'ADR-023 citait la spec « l. 80 » et la conduite
« l. 201 / l. 205 », numéros mesurés **avant** l'amendement des deux pages ; l'édition déplaçant ses propres
cibles, ils ont été remesurés après (l. 83, l. 205, l. 212) et corrigés dans l'ADR. (2) Le renvoi
`[ADR-023](DECISIONS.md)` du premier jet de `DEVICE.md` visait à côté depuis `docs/device/` : lien mort,
attrapé par le contrôle et corrigé en `../DECISIONS.md`.

**Prochaines étapes.** Inchangées : le geste (ouvrir un projet Freebuff sur `<W>/terrain`, en mode direct,
sans *worktree*), puis le second run sur le gel `0d9a2180`, dont le dossier suivra le gabarit tranché ici.

**Mémoires.** `2819def3` — nouvelle : l'ADR-023, la mesure qui la fonde, les pages amendées, les citations
laissées verbatim et les deux rectifications de la séance.

**Fermeture.** La séance est close à cet instant : ce qui la touchera plus tard s'écrira dans un nouveau bloc
daté qui la cite. Elle se ferme sur un travail **non commité** (sept fichiers : trois pages vivantes du
dispositif, la spec, la conduite, le tableau de bord et ce bloc) : aucun commit, aucune session ouverte,
`run.mjs` intact.

## Séance 18 — 2026-10-16 (suite)

**Objectif.** Le contrôle de fin de la séance, qui relit ce qu'elle vient d'écrire : la citation du journal
dans l'ADR-023.

**Fait.** Cette citation nommait « les séances 3, 9 et 16 du journal », écrit **sans mesure** dans le premier
bloc. Le journal ne porte le gabarit du v6 qu'à **deux** endroits, et dans **deux** séances : Séance 1 l. 345
et Séance 16 l. 1290 et 1311. La phrase de l'ADR-023 est corrigée sur place et cite désormais les lignes
mesurées, pas des numéros de séance devinés.

**Vérifié.** `awk` sur le journal, chaque occurrence rattachée à sa séance (`/^## Séance/`), et
`grep -n 'framework@rev' docs/trace.md` → l. 345 (Séance 1), l. 1290 et 1311 (Séance 16). Les liens des sept
pages touchées : 0 mort, rejoué après cette correction. `run.mjs` intact (`git diff --quiet`, `exit 0`).

**Rectifications.** La troisième de la séance, et la seule que le premier bloc ne porte pas : une citation
qui nommait deux séances étrangères au fait. Les deux premières (numéros de ligne de l'ADR remesurés après
amendement, lien mort de `DEVICE.md`) sont dans le bloc précédent, telles qu'écrites.

**Mémoires.** `2819def3` — complétée de cette troisième rectification, relue après coup.

**Fermeture.** La séance est de nouveau close, cette fois sur ses trois rectifications. Travail toujours
**non commité** : sept fichiers, aucun commit, aucune session ouverte.

## Séance 19 — 2026-10-16 (le commit de la journée : `64901e3`)

**Objectif.** Mettre au dépôt ce que les Séances 15 à 18 ont produit : le contrat le dit, un document non
commité ne laisse rien à lire.

**Fait.** Commit **`64901e3`**, « Trancher le nom du dossier d'un run, et réparer deux pages du dispositif »,
sur `main` : 7 fichiers, **+445 / −29**. Par fichier : `ARCHITECTURE.md` (47), `DASHBOARD.md` (29),
`DECISIONS.md` (39, l'ADR-023), `DEVICE.md` (3), la spec du run (6), la conduite (132, son §1.7), le journal
(218, Séances 15 à 18 et la suite de la 18). Indexation **par nom** des sept chemins, jamais `git add -A`, et
un garde avant le commit (`git diff --cached --name-only | wc -l` = 7, sinon abandon). Le [DASHBOARD](DASHBOARD.md)
reçoit sa ligne et son en-tête.

**Vérifié.** `git show --stat --oneline HEAD` → 7 fichiers, **445 insertions, 29 suppressions**, exactement le
`git diff --stat` relevé avant l'indexation. `git status --porcelain` **vide** après le commit.
`git log --oneline -1` → `64901e3`, sur `main`. **Aucun push** : le relecteur ne l'a pas demandé, et
`origin/main` n'a pas été interrogé.

**Ce que ce commit rend faux, sans réécrire personne.** Les séances 15, 16, 17 et 18 disent « rien n'est
commité » : c'était vrai à l'instant où chacune s'écrivait, et ces blocs ne se réécrivent pas. Idem des
mémoires `e1112361`, `0f0916a8`, `e0a566d7` et `2819def3`, qui portent la même phrase. L'état courant est ici.

**Prochaines étapes.** Inchangées : le geste (ouvrir un projet Freebuff sur `<W>/terrain`, en mode direct,
sans *worktree*), puis le second run sur le gel `0d9a2180`. Restent ouverts, consignés ailleurs : le
frontmatter des trois skills, le commit debout de P5, les six décrochages, et le push de ce commit si le
relecteur le demande.

**Mémoires.** `4de9b689` — nouvelle : le commit, sa méthode, son contenu par fichier, et ce qu'il rend faux.

**Fermeture.** La séance est close à cet instant, sur le commit **`64901e3`**. Ce bloc et la ligne du
tableau de bord restent hors du dépôt : le second commit annoncé ici n'a pas eu lieu, la relecture s'étant
arrêtée entre les deux. Aucune session ouverte, `run.mjs` intact.

## Séance 20 — 2026-10-16 (le README de la racine, remis au vrai)

**Objectif.** La question du relecteur : « le `README.md` est à jour ? ».

**Fait.** Contrôle des dix puces de sa liste d'entrées et de sa section « État », puis **deux manques
comblés**. Le banc du
harnais, entré au dépôt le jour même, n'était pas dans la liste des entrées, là où [REPLAY](device/REPLAY.md)
et [DEVICE](device/DEVICE.md) sont. Et l'« État » s'arrêtait au premier run et à son re-gel, en renvoyant au
[bilan](brainstorm/2026-10-15-201458-bilan-premier-run.md) pour « l'ordre de reprise » alors que ses étapes 1
à 3 sont faites : il porte désormais l'état au 2026-10-16 (les trois trous comblés, le client sondé, le banc
**46/46 PASS**, [ADR-023](DECISIONS.md) tranchée) et renvoie au [tableau de bord](DASHBOARD.md) pour l'état
courant, le bilan gardant les raisons et les arbitrages.

**Vérifié.** Chaque affirmation chiffrée du README, relue contre sa pièce :

| Ce que le README affirme | Pièce réinterrogée | Résultat |
| --- | --- | --- |
| 882 lignes, cinq commandes, `collect --sans-produit` | `wc -l run.mjs` ; les cinq fonctions de commande | **tient** |
| le cas re-gelé, empreinte `0d9a2180` | `.empreinte` du gel | **tient** (`0d9a2180c0f1251f…`) |
| le run du 2026-10-15, `17:16:12`–`17:29:51`, session `opencode` | `PV.md` et le bilan §« un run a-t-il eu lieu » | **tient** : la fenêtre est celle de la session, le dossier du run s'appelant `171559` |
| ses entrées et ses liens | boucle sur chaque cible | **toutes résolvent** : 17 cibles distinctes, 0 morte |
| le banc, **46/46 PASS** | `bash docs/device/harness/banc-harnais.sh` (Séance 17, rejoué depuis) | **tient**, `exit 0` |

**Rectifications.** Deux. (1) La phrase de clôture de la Séance 19 annonçait deux commits et un arbre propre :
le second n'a pas eu lieu. Corrigée pour dire ce qui est, plutôt qu'un état espéré. (2) Le premier jet de ce
bloc annonçait « les douze entrées » du README, qui en porte **dix** : compté par `awk` sur les puces de sa
section, et corrigé ici, qui cite désormais les dix puces et les 17 cibles de lien.

**Prochaines étapes.** Inchangées : le geste (ouvrir un projet Freebuff sur `<W>/terrain`, en mode direct,
sans *worktree*), puis le second run sur le gel `0d9a2180`. **Trois fichiers attendent leur commit** : ce
bloc, le tableau de bord et le README.

**Mémoires.** `e9f76f91` — nouvelle : le contrôle des dix entrées et de l'état du README, les deux manques
comblés, et les deux rectifications de la séance.

**Fermeture.** La séance est close à cet instant, sur un travail en partie **hors du dépôt** (le README, ce
bloc, le tableau de bord) : aucun commit depuis `64901e3`, aucune session ouverte, `run.mjs` intact.

## Séance 21 — 2026-10-16 (tour complet du projet, six pages remises au vrai, et un bilan daté)

**Objectif.** La demande du relecteur : « fait un tour de tout le projet, mise à jour de docs, évaluation de
l'architecture, que reste-t-il à faire, bref, fait un bilan détaillé ».

**Fait.** Un tour mesuré du dépôt, **quatorze réparations** dans six pages vivantes, et un bilan daté au foyer
des brainstorm : [2026-10-16-153204-bilan-du-projet.md](brainstorm/2026-10-16-153204-bilan-du-projet.md)
(préfixe = naissance mesurée, `stat -c %w` → `2026-10-16 15:32:04`). Ici, ce qui a bougé :

| Défaut | Pièce qui le dit | Réparation |
| --- | --- | --- |
| [DEVICE](device/DEVICE.md) à **1 004 mots** pour un plafond de 900 | v6 §10 l. 365 | ramené à **896** : « Lire un écart » renvoyé au §4 d'ARCHITECTURE, le tableau des huit noms du v6 réduit à son renvoi d'ADR-013, le lancement resserré ; contenu prescrit intact |
| [EXPLICATION](EXPLICATION.md) annonçait **21 commits** et « poussé », le banc « jetable », DEVICE à 895 mots | son en-tête, ses §9, §11 | état complété au 2026-10-16 : 44 commits, dernier commit non poussé, banc au dépôt (**46/46**, ADR-022), DEVICE à 896 |
| BOUNDARY §5 n'avait **pas de relevé de clôture** | ADR-021, variante A | relevé ajouté : les deux arbres rendent **les mêmes lignes** qu'au matin |
| BOUNDARY §7 citait **`39750fe`** et 18 fichiers suivis | dérive nommée non corrigée depuis la Séance 10 | relevé du jour : `64901e3`, **42** suivis ; §6 remesuré : **0** paire commune sur 42 et 2 599 |
| les **six constats** de la [relecture à froid](brainstorm/2026-10-16-133942-relecture-a-froid-des-entrees.md) | son §2 | six traités : « AIDD » défini au README, `run` et `cas` au lexique, ce qui n'existe pas encore dit, `framework-origin` averti à BOUNDARY §1, README ouvert par le dispositif et son pourquoi |
| le `.freebuff/` du client et le mode *worktree* | conduite §1.7 | mesurés (37 octets) et nommés dans EXPLICATION §12 |
| [PFD](PFD.md) et [DASHBOARD](DASHBOARD.md) portaient deux comptes de mots périmés | `wc -w` | DEVICE **896**, BOUNDARY **1 970** |
| le DASHBOARD disait encore « le protocole de test : rien construit » | le harnais, le banc et le gel, qui existent | ligne passée à 🟨, avec ce qui manque : l'écart d'un run qui produit |

**Vérifié.** Chaque chiffre du bilan, remesuré ce jour :

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| l'arbre et son remote | `git rev-list --count HEAD` ; `git rev-parse --short HEAD` ; `git rev-parse --short origin/main` | 44 · `64901e3` · `a8eabca` (**un commit non poussé**) |
| aucun fichier du dispositif n'appartient au framework | paires chemin + contenu, `git ls-files -s` des deux arbres | 2 599 · 42 · **0 commune** |
| le framework est intact | `git -C /home/giak/projects/framework status --porcelain` | 2 lignes, **identiques au relevé du 2026-10-15** |
| le terrain est intact | même paire | `416ec1f`, 1 ligne, `?? .freebuff/` |
| le gel tient | `.empreinte` du gel | `0d9a2180c0f1251f…` |
| le harnais refuse ce qu'il doit | `bash docs/device/harness/banc-harnais.sh` | `46/46 PASS`, `exit 0` |
| ses refus sont écrits | `grep -c 'refuse(' run.mjs` | 63 |
| les liens des sept pages touchées et du bilan | boucle sur chaque cible | **0 mort** |
| `run.mjs` intact | `git diff --quiet` | `exit 0` |

**Dérives signalées, non corrigées.** Le `@` du v6 et des enregistrements datés (par décision, ADR-023) ;
`.freebuff/project-id` dans l'arbre du dispositif (37 octets, ignoré par `.gitignore`) ; le worktree tiers du
terrain (ADR-011) ; la copie périmée du v6 chez l'origine. Et la dérive **documentaire** elle-même : le banc
éprouve le harnais, le relevé de clôture éprouve les arbres, **personne n'éprouve les chiffres écrits** —
l'arbitrage est proposé au §4.7 du bilan, pas tranché ici.

**Rectifications.** Aucune.

**Prochaines étapes.** Celles du bilan §5, dans l'ordre : le geste (ouvrir un projet Freebuff sur
`<W>/terrain`, en mode direct, sans *worktree*) puis le second run ; le commit du jour et le push ;
`NEGATIVE.md` puis `ECART.md` ; les trois manques transverses de la relecture ; le frontmatter des trois
skills ; le commit debout de P5 ; l'arbitrage sur la dérive documentaire.

**Mémoires.** `05c5233b` — nouvelle : le bilan, ses quatorze réparations, ses mesures, les dix fragilités
nommées et l'ordre de ce qui reste.

**Fermeture.** La séance est close à cet instant. Travail **non commité** : six pages vivantes, le journal, le
nouveau bilan ; `HEAD` reste `64901e3`, aucune session ouverte, `run.mjs` intact.

## Séance 22 — 2026-10-16 (RTK sous Freebuff : trois harnais, un shim éprouvé, un skill posé et prouvé)

**Objectif.** La demande, en trois temps : rendre l'usage de RTK effectif sous Freebuff « de façon transparente
et efficace » ; contester mes conclusions, sans flatterie ni complaisance ; puis poser le skill en fichier comme
`mnemolite-mem-first`, et garder les traces de tout.

**Fait.** Trois choses, toutes hors du dépôt sauf ce journal.

1. **Le canal d'instructions de Freebuff, lu dans le bundle** (`resources/orchestrator/orchestrator.js`, révision
   montée ce jour). Le bloc « Account skills » est recalculé **à chaque tour** : `accountSkillsContext` au
   offset 9 745 830, puis préfixé au message utilisateur au 9 762 372. À l'inverse, `~/.AGENTS.md` n'est lu
   qu'à l'ouverture du fil : `loadUserKnowledgeFiles` a **une** définition et **un** appel, dans
   `initialSessionState`, et la copie injectée est donc figée pour le fil.
2. **Les mesures rtk**, version 1.0.1 : `rtk rewrite` comme moteur de décision, le défaut des sondes
   `--version`, et un shim éprouvé puis corrigé.
3. **Le skill posé** : `~/.agents/skills/rtk-first/SKILL.md`, 2 178 octets, sha1-10 `0940cc0878`,
   `description` de 853 caractères **entre guillemets doubles**, corps en cinq sections. Le verrou d'import a
   été levé en renommant `imported.json` en `imported.json.bak-2026-10-16-1900`, puis l'app a été redémarrée.

**Vérifié.** Chaque affirmation, avec la commande qui l'établit :

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| le bloc de skills est par tour, `AGENTS.md` par fil | offsets lus dans `orchestrator.js` ; appelants de `loadUserKnowledgeFiles` | 9 745 830 / 9 762 372 ; 1 définition, 1 appel dans `initialSessionState` |
| le harnais `codebuff` n'a pas de surface de hook | `grep` de sept noms de hook dans `app.asar` | 0 occurrence ; les 20 `onToolCall` et 19 `"hooks"` de l'orchestrateur sont le code Claude Code embarqué et la validation de ses settings |
| Freebuff a trois harnais, pas un | `HARNESS_IDS`, `AGENT_OPTIONS`, `DEFAULT_HARNESS` | `codebuff` (défaut), `claude-code`, `codex` |
| l'utilisateur n'est pas sous Claude | `harness_id` dans les bases `desktop-v2.db` | **35 fils, tous `codebuff`**, aucun `claude-code`, aucun `codex` |
| le harnais `claude-code` chargerait les settings utilisateur | `claudePermissionOptions` | `settingSources: ["user"]`, `disableAllHooks: false` |
| le hook rtk de Claude Code fonctionne | `printf '{"tool_name":"Bash","tool_input":{"command":"git status"}}' \| rtk hook claude` | `updatedInput` valant `rtk git status` |
| `rtk rewrite` décide seul, quatre codes | boucle sur sept commandes | `git status` → 3, `echo hello` → 1, `git status > f` → 1, `echo $(date)` → 1, pipeline → 3 |
| le shim filtre sans récurrence | bac `/tmp/rtk-poc2`, une entrée par commande | `git status` 403 → **28 octets**, `ls -al` 2 187 → **739**, codes 2 et 128 propagés |
| le shim coûte | 20 × `git status`, avec et sans | 2,2 ms contre **62,4 ms** par appel |
| un skill dont la description contient ` : ` disparaît en silence | js-yaml, le parseur du bundle, sur les quatre fichiers | `chatgpt-bridge` : `bad indentation of a mapping entry` ; les trois autres passent |
| le skill est réellement importé | `imported.json`, dossier de révision, `current.json` | `["mnemolite-mem-first","rtk-first","visual-explainer"]`, révision **4**, quatre skills, et la ligne `rtk-first` présente dans le bloc injecté |
| l'écart d'un octet entre source et copie matérialisée | tailles comparées | 2 178 source contre 2 177 matérialisée, à cause du `.trim()` de `cloudSkillSchema` |

**Dérives signalées, non corrigées.** `headroom_memory.db` non suivi à la racine du dépôt (16:55, table
`memories` à **0 ligne**) alors que le store réel est `~/.headroom/memory.db` ; instrumentation de `~/.claude`
(`CLAUDE.md`, `RTK.md`, hook `PreToolUse`) écrite le jour même à **17:46**, une minute après l'archive rtk de
`/tmp/rtk-up`, **attribution UNKNOWN** ; `chatgpt-bridge` reste écarté, par son propre frontmatter ; défaut
amont de rtk 1.0.1 sur les sondes `--version` (`rtk wc --version` substitué, `rtk rg --version` en échec) ; et
l'état du dépôt lui-même : **sept** fichiers modifiés et **deux** non suivis, antérieurs à cette séance et non
touchés par elle.

**Rectifications.** Quatre, toutes mesurées après coup contre moi-même. « La transparence est impossible sous
Freebuff » était trop large : elle ne vaut que pour le harnais `codebuff`, le harnais `claude-code` étant déjà
instrumenté par `~/.claude/settings.json`. Mon shim reconstruisait la commande avec `$*` et cassait les
arguments espacés, `grep "deux mots" p.txt` rendant `mots: Aucun fichier ou dossier de ce nom` en exit 2,
corrigé par `printf '%q '`. J'ai attribué à tort l'absence de `chatgpt-bridge` à la limite de 1 000 caractères :
c'est son YAML. Enfin un de mes scripts a imprimé « vide = aucun fichier du dépôt modifié » alors que
`git status` ne l'était pas.

**Prochaines étapes.** Mesurer la conformité réelle du modèle, c'est-à-dire le fait que les commandes passent
vraiment par rtk, contre la ligne de base relevée avant l'import : **44 117 commandes**, **2,2 M** de tokens
économisés, **31,1 %** (`rtk gain`). Trancher le sort de `headroom_memory.db`. Remonter le défaut `--version`
de rtk en amont. Et committer les documents du jour, sans quoi, règle du dépôt, ils ne sont pas lus.

**Mémoires.** `bcf1ffba` — l'investigation RTK sous Freebuff, corrigée deux fois (harnais `claude-code`, piège
YAML, shim corrigé). `82aeaf2c` — le texte exact du skill, ses plafonds et sa condition d'injection. `a53b820b`
— la preuve de l'import après redémarrage.

**Fermeture.** Séance close à cet instant. Hors dépôt : `~/.agents/skills/rtk-first/SKILL.md` et le renommage
`imported.json.bak-2026-10-16-1900` dans le dossier de compte ; dans le dépôt : ce paragraphe seul. `HEAD`
reste `64901e3`, `origin/main` à `a8eabca`, aucun commit ni push de ma part.

## Séance 22 — 2026-10-16 (suite)

**Objet de la suite.** Le journal ne portait pas encore deux volets de la même conversation : Headroom, et la
recherche web. Les deux sont mesurés ici, avec leurs pièges.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| l'aller-retour Headroom fonctionne dans Freebuff | `headroom_compress` puis `headroom_retrieve`, texte à témoins `31415 / 27182 / 16180` | hash `bbfeca50187069a7980d5c53`, texte rendu **exactement**, témoins intacts, `source=local` |
| Headroom n'économise pas forcément | deux charges de test | `router:noop` puis `router:protected:recent_code` → **0 token économisé**, et `savings_percent` affiche **100,0** : champ trompeur |
| Headroom est branché mais non alimenté | `~/.agents/mcp.json` | `headroom` → `headroom mcp serve`, binaire 0.25.0 ; `headroom-memory` sur `~/.headroom/memory.db`, jamais écrit, MnemoLite reste la mémoire canonique |
| les **deux** chemins de recherche web rendent de vrais résultats | `web_search` natif, puis `web_search` du serveur MCP `mcp-searxng-local` | 10 résultats organiques (Serper : `engine: google`, `credits: 1`) et 3 résultats étiquetés `Engine: google cse`, le serveur déclarant lui-même brave `Suspended`, duckduckgo `CAPTCHA`, google `access denied` |

**Rectifications.** Une note antérieure disait que « la réparation searxng est confirmée fonctionnelle dans
Freebuff » sur la foi d'un appel `web_search` : cet appel était celui de l'outil **natif**, adossé à Serper. Les
deux outils portent le même nom, et la voie MCP searxng ne se prouve qu'en appelant **son** outil, ce qui est
fait ici.

**Prochaines étapes.** Celles de la séance : la conformité rtk mesurée contre 44 117 commandes et 31,1 %, le
sort de `headroom_memory.db`, le défaut `--version` remonté en amont, et le commit des documents du jour.

**Mémoires.** `ed625b01` — Headroom utilisable et réellement utilisé ici, rtk sans déclencheur mécanique.
`a10f189b` — la voie MCP searxng vérifiée, distincte de l'outil natif `web_search`.

**Fermeture.** Suite close à cet instant. Rien de plus dans le dépôt que ce paragraphe ; `HEAD` reste
`64901e3`.

## Séance 23 — 2026-10-16 (le skill `rtk-first` mis à l'épreuve : mécanisme prouvé, bénéfice marginal)

**Objectif.** La demande : « teste le skill RTK, prouve-moi que cela fonctionne ».

**Fait.** Un test à témoins, dans ce dépôt : compteur `rtk gain` avant et après, un lot de commandes écrites
selon la règle du skill, un témoin **natif** pour chaque commande, puis deux lectures indépendantes, le
registre d'rtk et la base du harnais.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| la règle arrive au modèle | bloc injecté de ce fil | ligne `rtk-first` avec sa description entière de **853** caractères |
| la consigne est suivie | registre `rtk gain --history`, horodaté `21:09` et `21:10` | onze entrées : `rtk git status --short`, `rtk ls -al docs`, `rtk git log`, `rtk grep`, `rtk read`, `rtk git diff`, `rtk git status` |
| le harnais enregistre ces commandes | base du fil, `parts_json` | `rtk git status --short .` en `seq138`, plus les lignes de diagnostic `seq130` à `seq146` |
| le filtrage a lieu, là où il sert | octets, natif contre rtk | `git diff` **50 579 → 39 429** (−22 %), `ls -al docs` **662 → 208** (−68 %) |
| le filtrage ne sert à rien, et parfois nuit | même protocole | `git status --short` 219 → 218 (0 %), `rtk read` sur 143 380 octets de prose **identique**, `rtk grep` 470 → **512**, donc plus gros |
| les chiffres d'rtk sont des jetons estimés | arithmétique des deux sources | 454 / 4 ≈ 113 pour « 108 » annoncé ; 11 150 / 4 ≈ 2 787 pour « 2.9K » annoncé |

**Dérives signalées, non corrigées.** Le compteur et le registre d'rtk ne s'incrémentent pas de la même façon :
**+7** au compteur pour **8** entrées au registre, puis **+1** pour 2 entrées ; cause `UNKNOWN`. `rg` n'est pas
installé sur cette machine, donc la ligne de comparaison `rg` du test est vide et **sans valeur**, elle est
dite ici pour qu'on ne la relise pas comme un gain nul. Et le fond du sujet : sur un dépôt de prose markdown,
les filtres d'rtk n'ont presque rien à grouper, donc le bénéfice y est marginal, ce qui ne dit rien du 31,1 %
global affiché par `rtk gain`, venu de l'ère Claude Code.

**Rectifications.** Aucune contre mes affirmations : le test confirme le mécanisme et **contredit l'attente de
gain**, que personne n'avait quantifiée avant.

**Prochaines étapes.** Décider si le skill reste en place au vu du gain mesuré ; mesurer sur une base qui
contient du code plutôt que de la prose, seule façon de savoir où rtk paie ici ; le sort de
`headroom_memory.db` ; le commit des documents du jour.

**Mémoires.** `c40228f8` — le test, ses deux témoins, ses octets et son verdict.

**Fermeture.** Séance close à cet instant. Aucune commande d'rtk n'a touché le dépôt : les onze appels étaient
des lectures. `HEAD` reste `64901e3`, rien de nouveau dans l'arbre que ce paragraphe.

## Séance 24 — 2026-10-16 (`headroom_memory.db` : vérifié, supprimé, cause reproduite)

**Objectif.** Trancher le sort du fichier `headroom_memory.db` posé à la racine : dire s'il servait à quelque
chose, l'effacer sinon, et nommer ce qui l'a créé plutôt que de le supposer.

**Fait.** Fichier vérifié puis supprimé, et cause reproduite hors dépôt, dans un dossier jetable de `/tmp`,
comme la frontière l'exige pour tout ce qui s'exécute.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| aucun contenu | `sqlite3 … "select count(*) from memories;"` | **0** ligne ; une seule table `memories`, schéma et douze index, rien d'autre |
| suivi par personne | `git status --porcelain`, `git check-ignore -v` | `??` non suivi, et l'ignore ne répond rien |
| tenu ouvert par personne | recherche dans `/proc/*/fd` | **0** |
| non référencé par la configuration | `~/.agents/mcp.json`, entrée `headroom-memory` | `--db /home/giak/.headroom/memory.db`, argument **explicite** |
| empreinte avant suppression | `sha256sum`, `stat` | `defac9ea…`, 57 344 octets, mtime `2026-10-16 16:55:21` |
| supprimé, et rien laissé | `rm -v`, puis `test -e`, puis `git status` | `'headroom_memory.db' supprimé` ; plus de fichier ; `git` muet pour ce chemin |
| la cause est dans le paquet | `grep -rn headroom_memory` sur `site-packages` | `headroom/cli/memory.py:38`, `default="headroom_memory.db"`, chemin **relatif** (paquet `headroom_ai 0.25.0`) |
| la cause est reproduite | dossier jetable, `headroom memory list` puis `stats` | base de **56 Ko** créée dans le répertoire courant, deux fois ; `No memories found.` |
| `--help` innocenté | dossier jetable, `headroom memory --help` seul | exit 0, **aucun** fichier créé |
| la commande d'ici | base du fil, `seq116` | se termine par `headroom memory stats`, **sans `cd`**, donc dans la racine ; `seq116` à `16:56:47`, fichier à `16:55:21` |

**Dérives signalées, non corrigées.** Deux. (1) C'est **ma** sonde du tour Headroom, à 16:55, qui a laissé une
base SQLite dans un dépôt de documentation, et le paquet la déposera à chaque fois : le chemin par défaut est
relatif au répertoire courant, donc toute sous-commande `headroom memory` sans `--db` lancée depuis un projet y
recrée le fichier. (2) La base réellement configurée, `~/.headroom/memory.db`, est vide elle aussi, 0 ligne et
dernière écriture au 13 juin : le serveur `headroom-memory` s'annonce dans les configurations sans avoir jamais
rien stocké. Hors demande, non corrigé.

**Rectifications.** Aucune contre mes affirmations antérieures : la veille disait ce fichier non expliqué, pas
inexplicable, et il est maintenant expliqué et effacé.

**Prochaines étapes.** Décider du commit des documents du jour, seul geste qui les fera survivre à la mémoire ;
si `headroom memory` reste dans les habitudes, `<cmd> --db /home/giak/.headroom/memory.db` ou un dossier
jetable.

**Mémoires.** `a90a44ef` — le contrôle, la suppression et la cause reproduite.

**Fermeture.** Séance close à cet instant. Rien de nouveau dans le dépôt que ce paragraphe ; `HEAD` reste
`64901e3` et `headroom_memory.db` n'existe plus.

## Séance 25 — 2026-10-16 (`context-mode` dans opencode : utile, utilisé, et trois recouvrements)

**Objectif.** Répondre à la question du relecteur : le projet `https://github.com/mksglu/context-mode`, employé
dans opencode, est-il utile, et les serveurs MCP déjà en place se marchent-ils sur les pieds.

**Fait.** Une recherche web confiée à l'agent de recherche (dépôt, page des releases, manifeste du paquet,
annonce de la v1.0.0 : quatre adresses lues), puis un audit local : configuration d'opencode, source du plugin,
journal d'opencode, bases de session de `context-mode`, et ses propres outils de diagnostic. **Rien n'a été
modifié**, ni configuration, ni dépôt.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| installé des deux façons | `opencode.json` | `mcp.context-mode` `enabled: true` **et** `plugins/context-mode.ts` (15 Ko) ; `plugin: []` |
| le conflit annoncé par le README ne mord pas ici | `grep -n` sur le plugin | le plugin ne pousse que des hooks (`ctx.tool.hook("execute.before", …)`, ligne 196) ; **aucun** enregistrement d'outil |
| les 11 outils viennent du MCP | journal opencode | `timestamp=2026-10-16T19:19:54.927Z … message="mcp connected" server=context-mode tools=11` |
| il sert vraiment | `tool_calls` de la base `e0b8aac08e5ff3a9.db` | `ctx_execute` **240** appels / 481 842 octets rendus ; `ctx_batch_execute` 17 / 279 596 ; `ctx_execute_file` 5 / 7 506 |
| il capture aussi la session | `session_events` de la même base | 4 776 `agent_usage`, 233 `user_prompt`, 210 `rule`, 115 `decision`, 107 `sandbox-execute`, 103 `file_edit` |
| aucun blocage observé | recherche de `deny`/`blocked` dans les événements | **aucun** événement de refus |
| deux hooks sur le même événement | `grep` des deux plugins | `context-mode.ts:196` et `rtk.ts:219` accrochent tous deux `tool.execute.before` |
| doctrine injectée | `node_modules/context-mode/hooks/routing-block.mjs` | bloc `<context_window_protection>` : `ctx_batch_execute` en « outil de recherche primaire », `ctx_search` en priorité 0 pour l'état de session |
| deux stockages distincts | `context-mode search` et `doctor` | le CLI lit `~/.gemini/context-mode/…` (plateforme détectée « Antigravity CLI »), opencode écrit `~/.config/opencode/context-mode/…` ; la recherche répond `No matches`, sur la mauvaise base |

**Dérives signalées, non corrigées.** Deux recouvrements de doctrine et un partage de stockage bancal. (1) Trois
mécanismes visent le même but, garder les octets bruts hors du contexte : `context-mode` par l'exécution en bac à
sable, `headroom` par compression et restitution par empreinte, `rtk` par filtrage des sorties ; leurs gains ne
s'additionnent pas, et le modèle doit choisir. (2) `ctx_search` est proposé en priorité 0 pour retrouver
décisions et erreurs passées, alors que la règle du dépôt est Mnemolite d'abord : deux magasins, l'un alimenté
tout seul par la session, l'autre curé. (3) `doctor` détecte la mauvaise plateforme et conseille de réparer des
hooks Antigravity (`agy plugin install …`) quand le binaire est absent : conseil non actionnable. Enfin le
paquet est sous Elastic License 2.0, ce qui n'est pas une licence libre au sens strict.

**Rectifications.** Aucune contre moi-même dans cette séance. Une attente du README est en revanche démentie par
l'état local, en faveur du relecteur : le conflit « plugin + entrée MCP ⇒ zéro outil » n'a pas lieu ici,
puisque le plugin installé localement n'enregistre pas d'outils. À noter aussi sur la qualité de preuve : les
citations du README viennent de la lecture faite par l'agent de recherche sur quatre adresses, pas de ma propre
lecture ; tout ce qui est mesuré ici l'est en local.

**Prochaines étapes.** Décision du relecteur, une seule : écrire une règle de préséance dans l'`AGENTS.md`
d'opencode (MnemoLite canonique pour les faits, `ctx_search` pour l'état de session, `rtk` pour les commandes
shell) plutôt que de désactiver une capacité mesurée comme utilisée. Non appliquée : elle touche la
configuration d'un client, hors du périmètre demandé.

**Mémoires.** `a49628ec` — l'audit, ses quatre constats, ses mesures et son verdict.

**Fermeture.** Séance close à cet instant. Rien de nouveau dans le dépôt que ce paragraphe ; aucune
configuration n'a été touchée, ni celle d'opencode, ni celle de Freebuff.

## Séance 25 — 2026-10-16 (suite)

**Objectif.** Fermer la seule affirmation de cette séance qui reposait sur une vérification trop étroite : le
plugin `context-mode` enregistre-t-il des outils, ou seulement des hooks.

**Fait.** Plugin relu à la bonne ligne, source du serveur relue, et nom réellement employé côté hôte retrouvé
dans le journal d'opencode.

**Rectification.** Mon premier contrôle portait sur un motif étroit, `registerTool`, `tool: {` et consorts, et il
a conclu à tort à « aucun enregistrement d'outil ». Le plugin **enregistre bien les onze outils** :
`await ctx.tool.transform((editor) => { … editor.add({ name: registered.name, … }) })`, lignes 143 et 154,
après avoir posé `CONTEXT_MODE_EMBEDDED_PLUGIN_TOOLS=1` et importé `REGISTERED_CTX_TOOLS` de
`build/server.js`. La phrase « le conflit du README ne mord pas ici » est donc remplacée, pas nuancée.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| le plugin enregistre des outils | lecture du plugin, lignes 143 et 154 | `ctx.tool.transform` puis `editor.add({ name: registered.name, … })` |
| un garde-fou existe côté serveur | lecture de `build/server.js:115` | `shouldSuppressMcpToolsForNativePluginHost()` : supprime les outils si la plateforme est `opencode` ou `kilo` **et** si les réglages portent le plugin **et** l'ancienne entrée MCP |
| le garde-fou n'a pas joué ici | journal d'opencode, et `opencode.json` | `mcp connected server=context-mode tools=11` ; `plugin: []` étant vide, la condition « plugin déclaré » est fausse |
| le nom vu par le modèle est préfixé | journal d'opencode, lignes 26029 et 151434 | le hook écrit « Call `context-mode_ctx_execute(language, code)` » et cite `context-mode_ctx_fetch_and_index` |

**Ce qui reste `UNKNOWN`, dit comme tel.** La liste d'outils effectivement vue par le modèle. Soit les deux
familles coexistent, noms nus du plugin et noms préfixés du serveur, et la redondance est réelle, soit le client
dédoublonne en silence : le journal ne porte aucun avertissement, et je n'ai pas observé de session. Trancher
demande un tour dans une session opencode réelle, ou `ctx_stats` vu du modèle.

**Prochaines étapes.** Inchangées, plus une : mesurer la liste réelle des outils `ctx_*` dans une session, au
lieu de raisonner sur le code.

**Mémoires.** `a49628ec` — corrigée une seconde fois à la source ; elle porte désormais le mécanisme du
garde-fou, le nom préfixé et l'inconnu assumé.

**Fermeture.** Suite close à cet instant. Aucune configuration touchée, aucune écriture hors ce paragraphe.

## Séance 26 — 2026-10-16 (`context-mode` sous Freebuff : faisable, à moitié utile)

**Objectif.** Répondre à la question du relecteur : peut-on employer `context-mode` sous Freebuff sans gêner ce
qui existe déjà.

**Fait.** Configuration MCP de Freebuff lue, adaptateurs du paquet énumérés, recherche de `freebuff` et
`codebuff` dans le paquet, et sonde du mode MCP autonome dans un dossier jetable de `/tmp` avec stockage forcé.
**Rien n'a été modifié.**

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| ce que Freebuff lit | lecture de `~/.agents/mcp.json` | 4 serveurs : `headroom`, `headroom-memory`, `mcp-searxng-local`, `mnemolite` ; `context-mode` **absent** |
| variante | `~/.agents/.mcp.json` | un 5e serveur, `search` ; le dépôt n'a pas de `.agents/mcp.json` |
| Freebuff n'est pas une plateforme connue | `grep -ri "codebuff\|freebuff"` sur `build/` | **aucune** occurrence ; adaptateurs : `antigravity`, `antigravity-cli`, `claude-code`, `codex`, `copilot-cli`, `cursor`, `gemini-cli`, `jetbrains-copilot`, `kimi`, `kiro` |
| le mode MCP autonome marche | sonde JSON-RPC en dossier jetable | exit **0**, aucune erreur, **11** outils annoncés : `ctx_execute`, `ctx_batch_execute`, `ctx_execute_file`, `ctx_fetch_and_index`, `ctx_index`, `ctx_search`, `ctx_stats`, `ctx_doctor`, `ctx_upgrade`, `ctx_purge`, `ctx_insight` |
| le stockage se fixe | `CONTEXT_MODE_DIR` vers un dossier temporaire | création de `<tmp>/store/sessions` : la variable est bien suivie |

**Dérives signalées, non corrigées.** Sans adaptateur Freebuff, il n'y a **ni hooks, ni routage imposé, ni
capture de session, ni reprise après compaction** : la moitié de la valeur du produit ne fonctionne pas là-bas, et
il ne resterait que les onze outils. Corollaire favorable, et c'est la réponse à l'inquiétude : aucune collision
mécanique n'est possible avec le plugin rtk, qui n'existe pas non plus sous Freebuff, et aucune collision de noms
d'outils n'est possible puisque Freebuff expose les outils MCP par `search_mcp_tools` puis
`call_mcp_tool(server, tool, …)` au lieu d'un registre plat. Le coût réel serait doctrinal : une quatrième
destination pour la mémoire et la collecte, face au skill `rtk-first` et à la règle MnemoLite d'abord.

**Rectifications.** Aucune.

**Prochaines étapes.** Décision du relecteur, une seule : brancher ou non, et sous quelle forme. La forme propre
serait une entrée MCP `context-mode` dans `~/.agents/mcp.json` avec `CONTEXT_MODE_DIR` **fixé** pour que la
détection de plateforme ne choisisse pas un répertoire au hasard, plus une ligne de préséance. Non appliquée :
la question portait sur la faisabilité, et la modification sort du dépôt.

**Mémoires.** `575975b2` — la faisabilité, ses mesures et ses limites.

**Fermeture.** Séance close à cet instant. Aucune configuration touchée, dans Freebuff comme dans opencode ; le
dépôt ne gagne que ce paragraphe.

## Séance 26 — 2026-10-16 (suite)

**Objectif.** Réparer une affirmation plus forte que ma preuve : j'avais écrit « les 11 outils fonctionnent »
alors que j'avais seulement constaté leur **annonce** par `tools/list`.

**Fait.** Appel réel d'un outil dans la même sonde jetable, `tools/call` sur `ctx_stats`, stockage toujours
forcé par `CONTEXT_MODE_DIR`.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| un outil répond vraiment | JSON-RPC `tools/call` sur `ctx_stats` | exit **0**, aucune erreur, réponse textuelle complète, sans passer par l'annonce seule |
| le stockage forcé est bien utilisé | même sonde | création de `<tmp>/store/content` et `<tmp>/store/sessions` |
| ce que l'outil dit de lui-même | sa propre réponse | « 1.2K conversations in OpenCode », « 37.8K events · 1.2K sessions · ~$48.40 saved lifetime », « 3.5 MB indexed », cinq adaptateurs « skipped » : Claude Code, Gemini CLI, Antigravity, Antigravity CLI, Kilo |

**Rectification.** Ma phrase « les 11 outils fonctionnent » était trop forte au moment où je l'ai écrite : la
bonne formulation était « annoncés et le serveur répond ». Elle est maintenant vraie, mais par cette mesure-ci,
pas par la précédente.

**Ce qui reste `UNKNOWN`.** Les chiffres que `ctx_stats` affiche sont tenus par le produit, pas par moi :
« $48.40 saved » est son estimation, pas un relevé de facturation. Et détail qui mérite d'être dit : la sonde
était isolée par `CONTEXT_MODE_DIR`, pourtant la partie « persistent memory » de sa réponse portait des chiffres
globaux qui ne peuvent pas venir d'un magasin vide ; il a donc lu ailleurs, sans que je sache où.

**Prochaines étapes.** Inchangées : décider si on le branche sous Freebuff, et sous quelle forme.

**Mémoires.** `575975b2` — mise à jour, elle porte l'appel réel, les chiffres auto-déclarés et le flou de magasin.

**Fermeture.** Suite close à cet instant. Aucune configuration touchée ; le dépôt ne gagne que ce paragraphe.

## Séance 27 — 2026-10-16 (`context-mode` branché sous Freebuff : lanceur à stockage figé)

**Objectif.** Brancher `context-mode` sous Freebuff avec le stockage figé, puis vérifier par un appel réel que
les outils répondent sans que rien d'existant ne bouge.

**Fait.** Un lanceur créé, une entrée MCP ajoutée après sauvegarde, et deux sondes : le serveur lui-même, et un
serveur voisin pour prouver que rien n'a bougé. Première écriture de cette séance hors du dépôt, la session comptant déjà d'autres écritures de ce genre avant celle-ci.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| lanceur créé | `ls -l` | `/home/giak/.local/bin/context-mode-freebuff`, 981 octets, exécutable ; fixe `CONTEXT_MODE_DATA_DIR` et `CONTEXT_MODE_DIR`, puis `exec` le binaire |
| sauvegarde faite avant toute écriture | `cp -p` | `~/.agents/mcp.json.bak-2026-10-16-213955` ; état initial 594 o, sha1-10 `b7006b251b` |
| édition minimale et valide | `diff` avec la sauvegarde, `python3 -m json.tool` | une seule addition, cinq lignes ; JSON valide (exit **0**) |
| les quatre voisins intacts | comparaison structurelle des deux versions | `mcp-searxng-local`, `mnemolite`, `headroom`, `headroom-memory` **IDENTIQUES** ; ajoutés `['context-mode']` ; supprimés `[]` |
| état final | `sha1sum`, `stat` | 727 o, sha1-10 `3d2b6e2c69`, mtime `21:40:00` |
| le serveur répond | sonde stdio JSON-RPC **par le lanceur de la config** | exit **0**, aucune erreur, **11** outils, appel réel `ctx_stats` rendu |
| le stockage est bien figé | même sonde | `~/.context-mode/context-mode/content/ef57836a71e1da25.db` et `…/sessions/stats-pid-90159.json` |
| rien d'existant ne bouge | appel réel `headroom_stats` | réponse normale (serveur `06cddfe2…`) |

**Rectification.** J'avais présenté `CONTEXT_MODE_DIR` comme le moyen propre de figer le stockage. La lecture de
`adapters/base.js` montre que le réglage **universel** est `CONTEXT_MODE_DATA_DIR` (il couvre aussi la mémoire
persistante), `CONTEXT_MODE_DIR` ne décrivant que sessions et contenu indexé. Les deux sont posés, sur un arbre
unique.

**Dérives signalées, non corrigées.** Deux. (1) Le lanceur existe parce que **rien ne prouve** que le chargeur
MCP de Freebuff transmette un champ `env` au processus enfant : le chargeur vit dans le binaire de l'application,
non inspecté. Le motif du lanceur est celui de `mcp-searxng-local`, déjà éprouvé. (2) `~/.agents/.mcp.json` n'a
pas été touché et porte désormais une liste différente de celle de `mcp.json` : l'écart est nommé ici, et il le
reste tant qu'on ne sait pas qui lit ce second fichier.

**Ce qui n'a pas pu être fait, et ne peut pas l'être par moi.** Le chargement de la nouvelle entrée exige un
redémarrage de Freebuff, que seul le relecteur peut déclencher. Sans lui, la seule chose établie est que le
serveur fonctionne **quand** Freebuff l'appellera, pas que Freebuff l'appelle.

**Prochaines étapes.** Redémarrer Freebuff, puis vérifier depuis la session que le serveur apparaît et qu'un
outil répond ; en cas d'échec du chargement, restaurer
`~/.agents/mcp.json.bak-2026-10-16-213955`.

**Mémoires.** `a1932044` — le branchement, ses preuves, son retour arrière et ce qui reste en attente.

**Fermeture.** Séance close à cet instant. Hors dépôt : deux fichiers touchés, le lanceur créé et la
configuration MCP augmentée d'une entrée ; dans le dépôt, ce paragraphe et rien d'autre.

## Séance 27 — 2026-10-16 (suite)

**Objectif.** Éprouver le lanceur dans un environnement d'exécution **minimal**, puisque celui que Freebuff
transmet au processus enfant n'est pas connu.

**Fait.** Sonde supplémentaire avec `env -i HOME=/home/giak PATH=/usr/bin:/bin`. Le lanceur a **échoué** :
c'est le premier échec utile de cette séance. Cause trouvée, reproduite, corrigée, puis les deux environnements
revalidés.

**Rectification.** Le lanceur était **fragile** : le paquet se lance par son shebang `#!/usr/bin/env node`, or cet
hôte expose `/usr/bin/node` en **v18.19.1**, trop vieux pour `context-mode` qui exige **>= 22.5**. Dans un
environnement minimal, le serveur mourait donc (`exit 1`, zéro outil) sans que rien ne l'annonce, et cela serait
arrivé à la première session Freebuff dépourvue du Node 22 dans son PATH. Le lanceur **résout désormais
l'interpréteur lui-même** : parcours de `~/.local/share/pnpm/nodejs/*/bin/node`, `~/.nvm/versions/node/*/bin/node`,
`/usr/local/bin/node`, `/usr/bin/node`, et premier candidat répondant à la condition `> 22` ou `= 22` avec mineure
`>= 5`. État final : **1 977** octets, sha1-10 `84f2474b88`.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| la fragilité est réelle et reproductible | `env -i …` puis `/usr/bin/node` sur le bundle | `exit 1`, stderr rempli, **avant** correction ; `/usr/bin/node -v` -> `v18.19.1` |
| le même bundle avec le bon Node passe | `env -i …` puis Node 22.12.0 de pnpm | `exit 0`, réponse `initialize` normale |
| le lanceur corrigé tient en environnement normal | sonde complète | `exit 0`, **11** outils, appel réel `ctx_stats` |
| le lanceur corrigé tient en environnement minimal | `env -i HOME=… PATH=/usr/bin:/bin` | `exit 0`, **11** outils, appel réel `ctx_stats` |
| le stockage ne bouge pas | `ls` du magasin épinglé | nouveaux fichiers dans `/home/giak/.context-mode/context-mode/sessions` |

**Ce qui reste `UNKNOWN`.** Toujours le même : le chargement de l'entrée par Freebuff, qui exige un redémarrage.
Détail à retenir pour la suite : la résolution de Node retient le premier candidat **>= 22.5** trouvé, donc si
plusieurs Node coexistent, le premier du parcours gagne ; le parcours est ordonné par préférence, pas par
fraîcheur.

**Prochaines étapes.** Inchangées : redémarrer Freebuff, puis vérifier depuis la session ; en cas d'échec du
chargement, restaurer `~/.agents/mcp.json.bak-2026-10-16-213955`.

**Mémoires.** `a1932044` — mise à jour : elle porte la résolution d'interpréteur, l'échec mesuré et les deux
environnements validés.

**Fermeture.** Suite close à cet instant. Rien d'autre que ce paragraphe et le lanceur corrigé.

## Séance 28 — 2026-10-17 (l'ouverture du second run, vérifiée avant le geste)

**Objectif.** Préparer l'ouverture du second run : vérifier la copie du cas contre la conduite §1.7 — la
racine de projet, le mode direct, l'absence de worktree, le texte à remettre — puis écrire la liste de
contrôle du geste.

**Fait.** Une liste de contrôle datée, née à `09:56:43` (`stat -c %w`) :
[2026-10-17-095643-liste-de-controle-ouverture-second-run.md](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-17-095643-liste-de-controle-ouverture-second-run.md),
cinq sections, l'état mesuré du jour, l'ordre du geste avec la valeur attendue de chaque contrôle, et ce que
la liste ne prouve pas. Deux pages vivantes réparées : la conduite §1.7 (sa prédiction sur `?? .freebuff/`,
et son ordre d'avant-ouverture) et le tableau de bord (l'en-tête, la ligne du dispositif, la ligne du §3.1
qui disait qu'aucun projet Freebuff ne pointait `<W>/terrain`, une ligne de document).

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| la porte autorise la copie | `run.mjs preflight --case <cas> --repertoire $W/terrain --texte $W/texte-a-remettre.txt` | `ouverture autorisée … (HEAD 416ec1f, porcelain 0 ligne(s)) ; gel 0d9a2180 re-haché, 2 fichier(s) et 8 référence(s) ; texte 832036f7 (254 octets) conforme au §5 substitué` — **`exit 0`** |
| le gel tient hors du harnais | formule du §1.1, `RACINE_FRAMEWORK=$W/framework-origin` | **11/11 `True`**, `empreinte True`, `0d9a2180…` — **`exit 0`** |
| le texte n'a pas bougé | `sha256sum`, `wc -c` | `832036f7…`, **254** octets, mtime 2026-10-15 22:15 |
| le texte que l'opérateur lira est le même | bloc `text` de `$W/mode-d-emploi.md`, comparé octet à octet | 254 octets, `832036f7…`, identique |
| les quatre arbres | `rev-parse --short HEAD`, `status --porcelain` | `fe48de12`/2, `416ec1f`/1, `4c39e5c5`/0, `416ec1f`/**0** |
| le projet pointe la copie | `select root_path, default_branch from projects` | `<W>/terrain` ; `origin/test/aidd-installation` (relevé du client) |
| aucun fil, aucun worktree | `select count(*) from threads`, `git worktree list` | **0** fil, **0** message ; une seule entrée, `416ec1f (detached HEAD)` |
| le marqueur du client est entré sans ligne git | `cat .freebuff/project-id`, `status --porcelain`, `check-ignore -v` | `38d8d3f1-…`, **0** ligne, `.git/info/exclude:7:.freebuff/` |
| l'`exclude` de la copie n'est pas celui de l'original | `diff`, `cat -n` | 7 lignes contre 48 (les exclusions Kilo manquent), mtime **2026-10-15 21:44** |

**Rectifications de ses propres affirmations.** Trois, toutes trouvées par cette vérification. (1) Le §1.7
annonçait « une session ouverte sur `$W/terrain` y laissera donc une ligne, `?? .freebuff/` » : la prédiction
est fausse, la copie ignore `.freebuff/` par son `.git/info/exclude`, et le marqueur écrit le 2026-10-17
laisse la paire à **0 → 0** ; le §1.7 est rectifié sur place, avec la note datée en tête de la conduite.
(2) Le tableau de bord affirmait encore que **le second run n'attendait que la sonde du client**, faite la
veille : la ligne est remise au vrai. (3) Le même tableau de bord écrivait qu'**aucun projet Freebuff ne
pointe l'espace de travail gelé** : c'était vrai au 2026-10-16, faux depuis le 2026-10-17 09:50:56, et la
ligne porte désormais le projet, son marqueur et le compte de fils.

**Dérives signalées, non corrigées.** Quatre. (1) L'ouverture a **commencé hors du dépôt et n'était
consignée nulle part** : le client a créé le projet `terrain-38d8d3f1` à 09:50:56 et `$W/mode-d-emploi.md` a
été écrit à 09:52:23, sans séance ni mémoire ; cette séance les nomme, elle n'en attribue pas l'auteur.
(2) Le `.git/info/exclude` de la copie du cas a été **remplacé** le 2026-10-15 21:44 par une version de sept
lignes qui ignore `.freebuff/` et perd les exclusions Kilo de l'original : aucun document ne dit qui l'a fait
ni pourquoi, le gel ne le voit pas (ni `HEAD` ni `porcelain` ne changent), et la liste de contrôle le nomme
sans l'expliquer. (3) `$W/mode-d-emploi.md` vit **hors du dépôt** : il n'est pas commité, donc il ne survit
pas à la mémoire ; ce qui doit durer est dans la liste de contrôle, et le texte qu'il porte est le cas
lui-même. (4) Le `default_branch` relevé par le client (`origin/test/aidd-installation`) n'a été comparé à
aucun remote : `UNKNOWN`, et aucune décision du run n'en dépend.

**Prochaines étapes.** Un fil neuf, vide, en mode direct, dans le projet `terrain-38d8d3f1` ; la ligne du fil
lue avant de coller (`execution_mode` `local`, `branch` et `worktree_path` vides) ; le texte du §5 collé mot
pour mot, budget de trois messages ; l'export de la trace avant tout autre geste ; puis `collect`, `receipt`,
`compare`. Le détail et les valeurs attendues sont dans la liste de contrôle du 2026-10-17.

**Mémoires.** `cb481add` — la vérification de la copie, la dérive du `info/exclude`, les deux pages réparées
et ce qui reste à faire au geste.

**Fermeture.** Séance close à cet instant. Le dépôt gagne la liste de contrôle, la conduite et le tableau de
bord réparés, et ce paragraphe ; aucun fil n'est ouvert, aucune copie du cas touchée, rien de commité.

## Séance 28 — 2026-10-17 (suite)

**Objectif.** Mettre la séance et ses trois pages au dépôt, pousser, et vérifier que `origin/main` les porte.

**Fait.** Commit `fad7a83` — « Préparer l'ouverture du second run, et réparer ce que la vérification a
démenti » — quatre fichiers, **+209/−11** : la liste de contrôle (nouvelle), la conduite §1.7 et sa note
datée, le tableau de bord, ce journal. Poussé sur `https://github.com/giak/aidd-device.git`, branche `main` :
`57fddc8..fad7a83`, `push exit 0`.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| le commit est sur la branche distante | `git ls-remote origin refs/heads/main` | `fad7a8321365986f3f0f62c13eb5a0d5ea75b984 refs/heads/main`, égal à `git rev-parse HEAD` |
| les quatre fichiers y sont, au même contenu | `git fetch` puis `git rev-parse origin/main:<chemin>` contre `git hash-object <chemin>` | **4/4 identiques** : `DASHBOARD.md`, `trace.md`, la conduite, la liste |

**Ce qui reste.** Ce paragraphe : il est écrit après la poussée qu'il relate et part au commit qui le porte ;
c'est le seul contenu non commité à l'instant où il s'écrit. Puis le geste : un fil neuf en mode direct, sa
ligne lue avant de coller (liste de contrôle §4.2).

**Fermeture.** Suite close à cet instant.

## Séance 29 — 2026-10-17 (le contrôle négatif : une phrase de skill retournée, signalée)

**Objectif.** Construire `NEGATIVE.md` (v6 §10, question 6 du §11) : introduire une casse volontaire dans une
phrase de skill du framework, montrer la sortie qui la signale, ou documenter pourquoi le contrôle ne peut
pas être construit.

**Fait.** [NEGATIVE.md](device/NEGATIVE.md), six sections, type `negative` : la casse, les deux directions du
contrôle avec leurs sorties brutes, ce qu'il prouve et ne prouve pas, et la moitié comportementale nommée
comme manquante. Le banc vit sous `/tmp/negatif-2026-10-17-100043`, hors des quatre arbres : une copie de la
révision sous test, une copie de `CASES/`, et un seul champ du gel copié changé —
`arbres[revision-sous-test].chemin`, que l'empreinte ne couvre pas ([ADR-016](DECISIONS.md)). Le tableau de
bord gagne sa ligne et l'étape 7 y passe de « jamais ouvert » à « ouvert à moitié » ; le PFD, qui portait
encore `NEGATIVE.md` en 🔲 et parmi les pièces manquantes, est remis au vrai (🟨, deux lignes).

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| le banc n'est pas piégé | `preflight --cases <banc>` sur la copie intacte | `preflight ok … gel 0d9a2180 re-haché, 2 fichier(s) et 8 référence(s) ; texte 832036f7` — **`exit 0`** |
| la phrase est retournée | `sed`/`grep` sur la copie | l. 33 `- End with a short report of what changed.` → `- Never report what changed.` ; **1 223 → 1 209** o, `149f0f19…` → `329852d0…` |
| la casse est signalée | même commande, copie cassée | `REFUS — preflight : la référence « …/SKILL.md » de l'arbre « revision-sous-test » a changé depuis le gel — 329852d0 au disque, 149f0f19 gelé …` — **`exit 1`** |
| le signal n'est pas un coup de chance | première casse essayée, autre phrase (`Ask before anything ambiguous…`, `629c5bcf`) | **`exit 1`** aussi : deux perturbations, deux refus |
| le cas réel n'a pas bougé | `preflight --texte …` sur `CASES/` | `exit 0`, gel `0d9a2180`, 2 fichiers, 8 références, texte `832036f7` |
| les quatre arbres intacts | `rev-parse --short HEAD`, `status --porcelain` | `fe48de12`/2, `416ec1f`/1, `4c39e5c5`/0, `416ec1f`/0 — identiques au matin |

**Rectifications de ses propres affirmations.** Une, de méthode : la première casse essayée retournait la
règle d'ambiguïté, qui n'est citée par aucun falsificateur ; elle signalait aussi, mais elle liait mal la
casse à ce que le cas attend. La seconde porte sur la phrase que `E2` cite mot pour mot — « End with a short
report of what changed » — et c'est elle qui est retenue : retourner la phrase tue la raison d'être de
`E2`, donc le cas qui doit la signaler est nommé.

**Dérives signalées, non corrigées.** Trois. (1) **La moitié comportementale du contrôle n'est pas faite** :
le dispositif signale l'identité de la casse, pas son effet ; aucun produit n'a été écrit selon la règle
retournée, donc `compare` n'a rien jugé. La question 6 du §11 reste **à moitié** répondue, et le v6 est
explicite : en état A, le travail n'est pas fini. (2) Le refus est celui de `preflight` ; `receipt`
(`run.mjs:661`) et `compare` (`:836`) appellent la même fonction, mais c'est un fait de lecture, pas une
mesure — aucune des deux n'a été courue ici. (3) Le banc `/tmp` est jetable par construction : la preuve
tient tant que la sortie citée est crue, et les commandes du §3 suffisent à le refaire.

**Prochaines étapes.** Le contrôle comportemental, écrit d'avance au §5 de `NEGATIVE.md` : troisième copie du
cas dans un dossier jetable, référence pointant une copie cassée, `freeze --refreeze`, même session et même
texte du §5, puis `collect`, `receipt`, `compare` — le juge doit rendre `écart` et la différence nommer
`E2`. Il attend donc un run qui produit, c'est-à-dire le geste qui reste de la Séance 28.

**Mémoires.** `7535b660` — la casse, les deux directions mesurées, les deux perturbations, et la moitié qui
manque.

**Fermeture.** Séance close à cet instant. Le dépôt gagne `NEGATIVE.md`, sa ligne au tableau de bord, deux
lignes du PFD et ce paragraphe ; rien n'est commité, aucun des quatre arbres n'a été touché, le banc jetable
reste sous `/tmp`.

## Séance 30 — 2026-10-17 (`ECART.md` du premier run, dans la forme de la pull request)

**Objectif.** Écrire `ECART.md` pour le premier cas : la forme qu'attend la pull request, ce qui peut déjà
être dit du run `non concluant`, et ce qui manque encore.

**Fait.** [ECART.md](device/runs/2026-10-15-171559-4c39e5c5-1d471a5/ECART.md), sept sections, écrit au
foyer du run, à côté de ses pièces brutes : la phrase de verdict, l'écart (attendu, produit, différence
nommée, verdict, pourquoi pas `écart`), les falsificateurs qui mordent et ceux qui ne sont pas évaluables,
les limites du run, la preuve du contrôle négatif avec sa sortie, les révisions et le clone, la commande
qui refait le run, et ce qui n'a pas été fait. **Aucun lien markdown, chemins en `backticks`** : c'est la
forme que le dépôt du framework impose (`check-markdown-links.js`). Le PFD (ligne `ECART.md`, phase 2) et le
tableau de bord (en-tête, ligne de document, étape 7) sont remis au vrai.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| la fenêtre du run | `cat horodatage_debut.txt horodatage_fin.txt` | `2026-10-15T17:15:59+02:00`, `2026-10-15T17:29:51+02:00` |
| les trois refus, cités mot pour mot | `cat collect-refus.txt receipt-refus.txt compare-refus.txt` | `--from absent …/terrain/aidd_docs` ; `aucun manifeste … lancer collect d'abord` ; `aucun reçu … le reçu seul (§8)` |
| la trace est là, et son empreinte | `ls -l`, `sha256sum` | `161 022` octets, `40f7bb60…` |
| aucun produit | `ls <W>/terrain/aidd_docs` | absente, avant comme après |
| trois `Glob`, tous vides | `grep` de `trace/echange-1.txt` | `**/02-project-memory/SKILL.md`, `**/project-memory/**/*.md`, `**/framework-origin/**` — **0 résultat** chacun |
| le document ne casse aucun contrôle de lien | `grep -c ']('` sur `ECART.md` | **0** |

**Rectifications de ses propres affirmations.** Une : le PV ne nomme que **deux** `Glob` ; la trace en
porte **trois** (le second, `**/project-memory/**/*.md`, n'y figure pas). L'écart dit trois, et le PV reste
tel qu'il a été écrit — c'est un enregistrement daté.

**Dérives signalées, non corrigées.** Quatre. (1) `ECART.md` n'est **pas** à sa destination : le v6 le veut
commité sous `aidd_docs/tasks/<mois>/<dossier>/ECART.md` dans un working copy de la PR du framework ; aucune
PR n'existe, donc aucune copie de travail — le geste de publication est nommé au §7, pas fait. (2) Aucun
`receipt.json`, aucun `output.json` pour ce run : il est antérieur au chemin sans produit, et l'écart tient
sur le PV et les trois refus. (3) `faits.json` cite l'ancien espace de travail
(`/home/giak/runs/aidd-device/…`), mort depuis le déplacement : l'écart le nomme, la pièce reste telle
quelle. (4) La moitié comportementale du contrôle négatif manque toujours : l'écart renvoie à
`NEGATIVE.md`, qui le dit.

**Prochaines étapes.** Le run d'abord (fil neuf, mode direct, texte du §5, trois messages), puis
`collect`/`receipt`/`compare`, et un `ECART.md` **du second run** — celui-ci restera l'écart daté du premier.
La publication dans une PR attend une PR.

**Mémoires.** `48afce8c` — la forme, les mesures, la rectification des trois `Glob`, et les quatre manques.

**Fermeture.** Séance close à cet instant. Le dépôt gagne `ECART.md`, deux lignes du PFD, trois du tableau
de bord et ce paragraphe ; rien n'est commité, aucun des quatre arbres n'a été touché.

## Séance 31 — 2026-10-17 (l'ouverture suivie à blanc : six trous, trouvés avant de payer un run)

**Objectif.** Répéter l'ouverture du second run sur une copie jetable du cas, en suivant la liste de contrôle
ligne à ligne, pour prouver qu'elle se suit sans trou avant de payer un vrai run.

**Fait.** [Répétition à blanc](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-17-100609-repetition-a-blanc-de-l-ouverture.md),
six sections, sur `/tmp/repetition-2026-10-17-100539` : copies du terrain, de la révision sous test et de
`CASES/`, hors des quatre arbres, re-gelées là. **Six trous trouvés, tous réparés** : la liste ne disait pas
d'écrire `faits.json` ni `last-message.md`, ne reliait pas `faits.trace.chemin_exporte` à l'export, n'avait
pas la branche `collect --sans-produit` (l'issue du premier run), ne disait ni que le reçu s'écrit une seule
fois ni que le verdict est contraint par les falsificateurs. La liste et le tableau de bord sont réparés.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| le cas voyage | `freeze --refreeze --racine <banc>` | `2 fichiers du cas, 8 reference(s), 4 arbre(s) ; empreinte 0d9a2180` — `exit 0` |
| la porte tient sur la copie | `preflight --cases <banc> --repertoire <banc>/terrain` | `ouverture autorisée (HEAD 416ec1f, porcelain 0)` — `exit 0` |
| la chaîne va jusqu'au bout, avec produit | `collect` puis `receipt --verdict ecart` puis `compare` | `2 fichier(s)`, reçu à **20 champs** (`1 limite`), `output.json` à **11 clés**, **7 attendus écartés** — trois `exit 0` |
| la branche sans produit fonctionne | `collect --sans-produit` puis `receipt` puis `compare` | `0 fichier`, `non concluant`, **3 limites** — trois `exit 0` |
| la requête du fil est valide | `sqlite3 -readonly … from threads;` | `exit 0`, **0 ligne** (aucun fil n'est encore ouvert) |
| les commandes lisent le cas par défaut | `collect` sans `--cases` | **refus** : produit « hors de l'espace de travail gelé » — c'est le gel du vrai cas qui était lu, pas celui du banc |

**Rectifications de ses propres affirmations.** Aucune sur un fait antérieur. Une sur la méthode : la
première exécution de `collect` sur le banc a échoué de ma faute, `--cases` omis ; le refus était juste, et
il a appris que les trois commandes sont attachées au dossier `CASES` du dépôt par défaut — sans effet pour
le vrai run, dont le cas vit là.

**Dérives signalées, non corrigées.** Trois. (1) **Trois étapes de la liste ne sont pas éprouvables sans
session** : 4.1 (fil neuf, mode direct), 4.3 (collage) et 4.4 (premier message stocké comparé au texte) ;
elles restent à faire au vrai geste, et la répétition le dit plutôt que de le laisser croire. (2) Le produit
de la répétition est **factice** — deux fichiers écrits pour l'exercice, et le reçu porte lui-même
« répétition, aucune session » ; aucun de ces fichiers n'est cité comme un run. (3) Le parent
`docs/device/runs/` n'a pas été éprouvé : un `mkdir` sous `/tmp` a tenu lieu, et la commande de nommage,
elle, a rendu ce qu'elle devait.

**Prochaines étapes.** Le geste, désormais sans trou connu dans sa liste : fil neuf en mode direct, la ligne
du fil lue avant de coller, le texte du §5, trois messages au plus, l'export, puis les cinq gestes du §4.7
— dont les deux branches de `collect` selon que la session produit ou non.

**Mémoires.** `a226af32` — le banc, les sorties, les six trous, et ce qui n'a pas pu être éprouvé.

**Fermeture.** Séance close à cet instant. Le dépôt gagne la répétition, la liste réparée, une ligne du
tableau de bord et ce paragraphe ; rien n'est commité, aucun des quatre arbres n'a été touché, le banc
jetable reste sous `/tmp`.

## Séance 32 — 2026-10-17 (`faits` : les quinze valeurs du reçu, dérivées au lieu d'être tapées)

**Objectif.** Faire écrire `faits.json` par le harnais : une commande qui lit le fil du client et l'export de
trace, remplit les champs du reçu et refuse un chemin qui ne résout pas.

**Fait.** Une sixième commande, `faits`, dans `run.mjs` ([ADR-024](DECISIONS.md)), et le banc qui la couvre :
contrôles 47 à 50. Elle lit la base du client en `-readonly` par `sqlite3`, en dérive `session.application` ·
`identifiant` · `modele` · `ouverte_le`, `horodatage_debut` (le premier message de l'utilisateur),
`repertoire_de_travail`, `trace.source` · `chemin_exporte` · `commande`, et exige les trois faits humains —
qui a ouvert, quand le run s'est terminé, ce que l'opérateur témoigne. Le harnais passe de cinq à six
commandes, de 882 à **1 006 lignes**, de 63 à **86 refus**. Les pages qui comptent sont remises au vrai :
DEVICE (896 mots, sous son plafond), BANC, DASHBOARD, ARCHITECTURE, EXPLICATION, README, et le §4.7 de la
liste de contrôle, qui nomme désormais une commande au lieu de quinze valeurs tapées à la main.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| le code est valide | `node --check run.mjs`, `--help` | les deux `exit 0`, l'aide liste `faits` |
| elle écrit les faits d'un fil | base **factice** (schéma minimal), fil pointant `<W>/terrain`, un message | `faits ok — … début 2026-10-17T10:00:46+02:00, fin …` — **`exit 0`**, neuf groupes de champs |
| un fil inconnu est refusé | `--fil fil-absent` | `aucun fil « fil-absent » … l'identifiant se lit dans la base, il ne se devine pas` — **`exit 1`** |
| un chemin qui ne résout pas est refusé | `project_path=/tmp/nexiste-pas/terrain` | `le répertoire de travail du fil (…) ne résout pas — le run aurait écrit nulle part` — **`exit 1`** |
| un fil en worktree est refusé | `branch=freebuff/x`, `worktree_path=…` | `il déplacerait le HEAD de la copie, et le produit sortirait de l'arbre gelé (§1.7)` — **`exit 1`** |
| une fin antérieure au début est refusée | `--fin 2020-01-01…` | `un run ne se termine pas avant d'avoir commencé` — **`exit 1`** |
| une trace absente est refusée | `--trace /tmp/aucune-trace.jsonl` | `l'export se fait avant tout autre geste (§1.5)` — **`exit 1`** |
| les faits ne s'écrivent qu'une fois | même `--out` deux fois | `les faits s'écrivent une fois, à chaud` — **`exit 1`** |
| le banc couvre la commande | `bash docs/device/harness/banc-harnais.sh` | **50/50 PASS**, `exit 0` |

**Rectifications de ses propres affirmations.** Aucune. Le chiffre des refus change de convention sans la
changer : la page comptait les lignes portant `refuse(`, définition comprise (63) ; la même commande en rend
86, dont 85 sites d'appel.

**Dérives signalées, non corrigées.** Quatre. (1) `receipt` accepte encore un `faits.json` dont
`repertoire_de_travail` ne résout pas ou ne nomme pas l'arbre `travail` : c'est le falsificateur de
l'ADR-024, et il n'est pas réparé — `faits` refuse ce que `receipt` croit encore. (2) `trace.chemin_exporte`
n'est vérifié que par son **existence** : un fichier quelconque y passe pour un export. (3) La base factice
du banc est un schéma minimal, pas la base du client : le banc prouve la logique de refus, pas la forme
exacte des tables. (4) La commande appelle `sqlite3` et `date -d`, deux binaires qui ne sont pas déclarés au
`--help` comme prérequis — le banc, lui, en dépend désormais.

**Prochaines étapes.** Le geste, avec une étape de moins à la main : fil neuf, collage, export, puis `faits`
avec le fil et la date de fin, puis `collect` (deux branches), `last-message.md`, `receipt`, `compare`.

**Mémoires.** `85c25441` — la commande, ses refus mesurés, le banc, et les quatre limites.

**Fermeture.** Séance close à cet instant. Le dépôt gagne `run.mjs` et son banc, l'ADR-024, la liste de
contrôle réparée et sept pages remises au vrai ; rien n'est commité, aucun des quatre arbres n'a été touché.

## Séance 33 — 2026-10-17 (la journée poussée : commit `1f7ea2b`, quinze blobs relus sur `origin/main`)

**Objectif.** Consigner la journée du 2026-10-17 dans un commit, pousser, et vérifier sur le distant que ce
qui est lu là est bien ce qui est écrit ici.

**Fait.** Commit `1f7ea2b168c5c0a5a6e45277746288af4af0256f`, **15 fichiers, 783 insertions, 42 suppressions** :
`NEGATIVE.md`, l'`ECART.md` du premier run rangé dans son dossier de run, la répétition à blanc, la liste
réparée (§4.7), l'ADR-024 et la commande `faits` avec son banc, et les pages de suivi — README, ARCHITECTURE,
DASHBOARD, DECISIONS, EXPLICATION, PFD, BANC, DEVICE. Poussée `6f7f583..1f7ea2b` sur `origin/main`.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| le banc passe avant le commit | `bash docs/device/harness/banc-harnais.sh` | `50/50 PASS` — `exit 0` |
| le harnais est syntaxiquement sain | `node --check docs/device/harness/run.mjs` | `exit 0`, sans sortie |
| aucun lien mort dans les quinze fichiers | lecture des `](../…)` relatifs des fichiers `-m -o` | **241 liens, 0 mort** |
| aucun caractère invisible | recherche de `U+00AD`, `U+200B`, `U+FEFF` | aucun |
| aucun secret dans le diff | motifs `sk-`, `ghp_`, `PRIVATE KEY`, `api_key=` | aucun |
| la poussée est acceptée | `git push origin main` | `6f7f583..1f7ea2b`, `exit 0` |
| les têtes concordent | `rev-parse HEAD` · `rev-parse origin/main` · `ls-remote origin main` | trois fois `1f7ea2b168c5c0a5a6e45277746288af4af0256f` |
| les blobs du distant sont ceux du disque | pour les 15 chemins : `rev-parse origin/main:<chemin>` contre `hash-object` | **15 identiques, 0 divergent** |
| l'arbre est propre | `git status --porcelain` | **0** avant et après la poussée |

**Dérives signalées, non corrigées.** Deux. (1) Les Séances 31 et 32 se ferment sur « rien n'est commité » :
c'était vrai à leur instant, et ce paragraphe est la suite datée qui le clôt, sans réécrire leur texte. (2) La
preuve des blobs lit le `tree` de `origin/main` après `fetch`, pas l'API GitHub : un reflet forcé côté serveur
ne serait pas vu par ce contrôle.

**Rectifications de ses propres affirmations.** Une, sur le même jour : les pages annonçaient « neuf champs »
là où `receipt` en exige **quinze** ; le code les remplissait tous. Corrigé dans DECISIONS, EXPLICATION,
DASHBOARD, le titre de la Séance 32 et la mémoire `85c25441`.

**Prochaines étapes.** `receipt` accepte encore un `faits.json` dont les chemins ne résolvent pas, alors que
`faits` les refuse : deux commandes qui ne croient pas la même chose.

**Mémoires.** `d97d9a8e` — le commit, la poussée, les quinze blobs, et la correction des « neuf champs ».

**Fermeture.** Séance close à cet instant. Le dépôt gagne ce paragraphe ; il part dans le commit qui le porte,
dont l'empreinte ne peut donc pas figurer ici. Aucun des quatre arbres n'a été touché.

## Séance 33 — 2026-10-17 (suite)

**Rectification.** La cellule « aucun lien mort dans les quinze fichiers » citait `](../…)` comme forme de
lien : faute de frappe, la forme visée est celle d'un lien relatif ordinaire. Le contrôle rejoué en
retirant les segments entre backticks rend **73 liens, 0 mort** ; le premier passage en comptait 76 parce
qu'il lisait aussi trois motifs écrits en code, dont celui-là. La méthode était donc plus permissive que
la mesure annoncée, jamais plus sévère.

**Fermeture.** Cette suite part dans le commit qui la porte (`e1c292d` porte le paragraphe précédent).
Aucun des quatre arbres n'a été touché.

## Séance 34 — 2026-10-17 (`receipt` situe les chemins de `faits.json`)

**Objectif.** Faire que `receipt` refuse un `faits.json` dont les chemins ne se situent pas, en reprenant les
contrôles de `faits` — la faille que la Séance 32 avait laissée ouverte et nommée.

**Fait.** [ADR-025](DECISIONS.md), écrite avant le code, puis `run.mjs` : trois refus de plus — `travail`
absent, `travail` qui n'est pas un répertoire, dossier de `trace.chemin_exporte` absent — et la comparaison
de l'arbre du run **après résolution des liens** (`racineDeclaree` par `resolu`), l'arbre « travail » du gel
étant retrouvé de la même façon dans le relevé d'après. Le banc passe de **50 à 56 contrôles** (51 à 56) ; les
pages qui comptent et décrivent sont remises au vrai : BANC, DEVICE, DASHBOARD, EXPLICATION, ARCHITECTURE
(deux lignes et la ligne `receipt` du tableau des commandes), le falsificateur de l'ADR-024 — clos, daté — et
le §4.5 de la liste de contrôle.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| avant : une trace sous un dossier absent est acceptée | `receipt` sur un `faits.json` variante, banc `/tmp/mesure-receipt.X9UBZr` | `receipt ok`, **`exit 0`**, 3 limites dont « trace machine introuvable » |
| avant : un travail absent est refusé pour un mauvais motif | même banc | `exit 1`, mais « n'est pas celui que le gel nomme « travail » » |
| avant : un travail par lien symbolique est refusé | même banc | `exit 1` — alors que `faits` écrit le même fichier en `exit 0` |
| après : travail absent refusé | contrôle 51 | `exit 1` |
| après : ce refus nomme la résolution | contrôle 52 | le message contient « ne résout pas » — `exit 0` |
| après : dossier de trace absent refusé | contrôle 53 | `exit 1` |
| après : ce refus nomme le dossier de la trace | contrôle 54 | le message contient « dossier du chemin exporté » — `exit 0` |
| après : travail par lien accepté | contrôle 55 | `exit 0` |
| après : trace absente sous un dossier présent reste une limite (§7) | contrôle 56 | `exit 0`, reçu portant « trace machine introuvable » |
| le banc entier | `bash docs/device/harness/banc-harnais.sh` | **56/56 PASS**, `exit 0` |
| les contrôles neufs distinguent l'ancien du nouveau | ancien `run.mjs` (`git show HEAD:…`) | 52 échoue, 53 échoue, 55 échoue ; 51 passe déjà (autre motif) ; 56 inchangé |
| le harnais reste syntaxiquement sain | `node --check docs/device/harness/run.mjs` | `exit 0` |
| aucun lien mort, aucune ancre morte | 139 liens hors code des neuf fichiers ; slugs des `##` de DECISIONS | 0 mort, 0 ancre manquante |
| les pages qui comptent sont au vrai | `grep -c "refuse(" ; wc -l` | refus **86 → 89**, lignes **1 006 → 1 035**, banc **50 → 56** |

**Dérives signalées, non corrigées.** Trois. (1) Le contrôle 51, seul, ne distingue pas l'ancien harnais du
nouveau : il passait déjà, pour un autre motif ; c'est le 52, qui lit le message, qui l'éprouve. (2) Une
différence subsiste avec `faits`, **voulue** et dite à l'ADR-025 : `faits` refuse d'écrire un `faits.json`
dont la trace est absente, `receipt` accepte le même fichier quand le dossier existe et le note comme limite —
le §7 demande que le reçu enregistre un export manqué, non qu'il fasse disparaître le run. (3) `receipt` ne
vérifie toujours pas `session.identifiant` : aucune pièce du run ne nomme le fil, il reste donc recopié.

**Rectifications de ses propres affirmations.** Une, de méthode. Le premier essai de falsification a échoué de
ma main : la copie de l'ancien harnais, posée sous `/tmp`, déduit sa racine de dépôt de sa propre position et
n'a trouvé ni gel ni cas — quatre contrôles rendus `exit 1` pour la mauvaise raison. Rejoué avec la copie à
`docs/device/harness/.banc-ancien.mjs`, retirée dans le même appel, `porcelain` revérifié.

**Prochaines étapes.** Rien n'est commité : neuf fichiers modifiés. Le second run reste le juge de tout ceci :
ces six contrôles éprouvent l'instrument, pas une session.

**Mémoires.** `cd738350` — les quatre mesures, les six contrôles, la falsification, et les trois dérives.

## Séance 35 — 2026-10-17 (le harnais déclare ses prérequis, et les sonde avant la commande)

**Objectif.** Faire vérifier et déclarer par le harnais ses prérequis (`sqlite3`, `date -d`), avec un refus
explicite au démarrage.

**Fait.** [ADR-026](DECISIONS.md), écrite avant le code, puis `run.mjs` : quatre prérequis sondés par l'appel
réel — `git --version` et `date --iso-8601=seconds` pour toutes les commandes, `date -d @0` et
`sqlite3 -version` pour `faits` seule — vérifiés après l'analyse des arguments et avant la commande, avec un
refus qui nomme l'outil, la commande, l'usage et le remède ; un bloc « prérequis » au `--help`. Le banc gagne
les contrôles 57 à 60 et passe à **60**. Pages remises au vrai : BANC (§2 et §4), DEVICE, DASHBOARD,
EXPLICATION, ARCHITECTURE.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| avant : `sqlite3` absent | `faits` avec un `PATH` amputé, banc `/tmp/prerequis.dePd9W` | `REFUS — faits : sqlite3 introuvable…`, mais après les contrôles de `--out` — `exit 1` |
| avant : `date` absent | `collect --sans-produit` | **trace Node** (`spawnSync` ENOENT), pas un refus — `exit 1` |
| avant : `date` non GNU | `collect --sans-produit`, faux `date` | `date: illegal option -- -` puis **trace Node** — `exit 1` |
| avant : `git` absent | `preflight` | refus **accusant le dossier** (« ouverture refusée dans … — le gel ouvre la session ailleurs ») — `exit 1` |
| après : `sqlite3` absent | contrôle 57 | refus « « sqlite3 » est introuvable », `exit 1` — assertion tenue |
| après : `date` qui n'obéit pas | contrôle 58 | refus « GNU coreutils requis », `exit 1` — assertion tenue |
| après : `git` absent | contrôle 59 | refus « « git » est introuvable », `exit 1` — assertion tenue |
| après : le `--help` déclare | contrôle 60 | `sqlite3 -version` présent dans la sortie, `exit 0` |
| le banc entier | `bash docs/device/harness/banc-harnais.sh` | **60/60 PASS**, `exit 0` |
| les quatre contrôles neufs distinguent l'ancien du nouveau | ancien `run.mjs` (`git show HEAD:…`) | les quatre assertions **échouent** : message autre, trace Node, refus qui accuse le dossier, `--help` muet |
| le harnais reste sain | `node --check` | `exit 0` |
| aucun lien mort, aucune ancre morte | 215 liens hors code ; slugs des `##` de DECISIONS | 0 mort, 0 ancre manquante |
| les pages qui comptent sont au vrai | `wc -l`, `grep -c "refuse("` | lignes **1 035 → 1 082**, refus **89 → 90**, banc **56 → 60** |

**Dérives signalées, non corrigées.** Trois. (1) Le contrôle 57 distingue l'ancien harnais par le **libellé**
du refus, pas par son existence : l'ancien nommait déjà `sqlite3`, tard et sans guillemets — le gain réel est
le moment, avant tout contrôle de chemin, et la déclaration. (2) Le banc ne sonde pas sa propre machine : si
`git`, `date` ou `sqlite3` manquaient, les liens du banc échoueraient et les contrôles 57 à 60 rendraient
`FAIL` au lieu d'un arrêt `exit 2` ; le §2 de BANC le dit. (3) Les sondes coûtent deux à quatre processus par
invocation, devant les `git` déjà lancés.

**Rectifications de ses propres affirmations.** Deux. (1) Un lien mort que j'avais écrit dans BANC,
`../../DECISIONS.md` depuis `docs/device/` : corrigé en `../DECISIONS.md`, contrôle de liens rejoué, 0 mort.
(2) Le même fichier portait, depuis la séance précédente, un paragraphe collé à la citation d'en-tête
(« …l'ont écrit.**En une phrase.** ») : séparé, sans changer un mot.

**Prochaines étapes.** Rien n'est commité : dix fichiers modifiés. Le second run reste le juge : ces quatre
contrôles éprouvent l'instrument, pas une session.

**Mémoires.** `231ab99e` — les quatre pannes d'avant, les quatre refus d'après, la contre-épreuve.

## Séance 36 — 2026-10-17 (un contrôle de liens qui lit la prose, et imprime les deux comptes)

**Objectif.** Écrire dans le dépôt un contrôle de liens qui écarte les segments de code et compare les deux
comptes, pour que la mesure annoncée soit celle que la méthode rend.

**Fait.** [ADR-027](DECISIONS.md), écrite avant le code, puis `docs/device/harness/liens.mjs` : sans
dépendance, il lit tous les `.md` sous la racine hors dossiers cachés, écarte les blocs clôturés (` ``` `,
`~~~`) et les segments entre backticks, résout chaque cible relative depuis le fichier qui la porte, ignore
les schémas extérieurs et les ancres seules, accepte `--racine` et `--json`, et imprime **le compte strict,
puis le naïf**, avec le nombre de motifs écartés. Il sort en `1` sur un lien mort en prose, `0` sinon, `2` sur
usage. Le banc gagne les contrôles 61 à 63 et passe à **63**. Pages remises au vrai : BANC (en-tête, §1, §4),
DEVICE, DASHBOARD, EXPLICATION, ARCHITECTURE.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| avant : le compte naïf fabrique des morts | balayage ad hoc, dépôt entier | **316** liens, **2** morts — deux citations `](../…)` entre backticks du journal ; strict **312**, **0** mort, écart **4** |
| sur le dépôt | `node docs/device/harness/liens.mjs` | `28 fichier(s) : 315 lien(s) hors code, 0 mort(s) ; 11 motif(s)` écartés — **326** au compte naïf — `exit 0` |
| un lien mort en prose est refusé et nommé | fixture `prose.md` → `absent.md` | `1 mort(s)`, `MORT …/prose.md -> absent.md`, `exit 1` |
| une citation entre backticks est écartée | fixture `` `[faux](absent.md)` `` | `0 lien(s) hors code`, `1 motif(s)` écarté, `exit 0` |
| un bloc clôturé est écarté | fixture ```text … ``` | `0 lien(s)`, `1 motif(s)` écarté, `exit 0` |
| ancres seules et schémas extérieurs ignorés | fixture `#section`, `https://`, `mailto:` | `0 lien(s)`, `0 mort(s)`, `exit 0` |
| le résultat machine est le même | `--json` | `fichiers`, `liens`, `morts`, `ecartes`, `naif`, `limites` |
| le banc éprouve les trois cas | contrôles 61 à 63 | **63/63 PASS**, `exit 0` |
| le script est syntaxiquement sain | `node --check docs/device/harness/liens.mjs` | `exit 0` |

**Dérives signalées, non corrigées.** Quatre. (1) Les ancres (`#…`) ne sont pas vérifiées et un bloc de code
**indenté** n'est pas écarté : c'est écrit dans l'aide du script, dans l'ADR et dans sa sortie. (2) Le compte
naïf inclut les exemples de code légitimes : il sert de borne, pas de mesure. (3) L'ADR-027 a déplacé le compte
naïf de 316 à 320 en s'écrivant elle-même — première démonstration de la dérive qu'elle mesure ; la ligne est
dans l'ADR, datée. (4) Le banc compte désormais trois contrôles pour un instrument qui n'est pas le harnais du
run ; l'en-tête de BANC et du script le disent.

**Rectifications de ses propres affirmations.** Une. La mesure de l'ADR a d'abord été écrite « 316 / 4 » sans
dire ce que le fichier de l'ADR ajoutait ; la ligne « 320 et 8 après l'écriture » l'a réparée le même jour.

**Prochaines étapes.** Rien n'est commité : onze fichiers modifiés, dont un nouveau. Le contrôle mesure le
dépôt, pas le run.

**Mémoires.** `eb53855d` — la mesure des deux comptes, les quatre fixtures, le banc à 63.

## Séance 37 — 2026-10-17 (`receipt` rattache `session.identifiant` à la trace)

**Objectif.** Faire vérifier par `receipt` que `session.identifiant` correspond à une pièce du run, au lieu
de le recopier tel quel.

**Fait.** [ADR-028](DECISIONS.md), écrite avant le code. La pièce qui nomme le fil était là depuis le début :
la commande d'export, que `faits` construit avec l'identifiant du run (`… where m.thread_id='<fil>' …`), et
que la séance 34 avait déclarée « aucune pièce ne nomme le fil ». `receipt` en extrait les `thread_id='…'` et
refuse : aucune mention, plusieurs fils, un fil différent de `session.identifiant`, et une commande sans
`from messages`. Le banc gagne les contrôles 64 et 65, ses fixtures `faits-bon.json` et `faits-mauvais.json`
portent désormais une commande qui nomme `banc`, et le banc passe à **65**. Pages remises au vrai : BANC,
DEVICE, DASHBOARD, EXPLICATION, ARCHITECTURE (dont la ligne `receipt` du tableau des commandes).

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| avant : un identifiant qui n'est pas celui de la commande | banc `/tmp/mesure-ident.s5IH3U`, `identifiant=fil-a`, `thread_id='fil-b'` | **accepté**, `exit 0` |
| avant : une commande qui ne nomme aucun fil | même banc, commande `"banc"` | **accepté**, `exit 0` |
| avant : identifiant et commande d'accord | même banc | accepté, `exit 0` |
| après : un autre fil est refusé et nommé | contrôle 64 | refus « session.identifiant vaut « fil-a », la trace exportée lit le fil « banc » », `exit 1` |
| après : une commande sans fil est refusée | contrôle 65 | refus « ne nomme aucun fil », `exit 1` |
| le banc entier | `bash docs/device/harness/banc-harnais.sh` | **65/65 PASS**, `exit 0` |
| les deux contrôles neufs distinguent l'ancien du nouveau | ancien `run.mjs` (`git show HEAD:…`) | les deux acceptent encore (`exit 0`) : les contrôles échouent contre lui |
| le harnais reste sain | `node --check` | `exit 0` |
| les liens du dépôt | `node docs/device/harness/liens.mjs` | 316 hors code, **0 mort**, 327 au compte naïf, `exit 0` |
| les pages qui comptent sont au vrai | `wc -l`, `grep -c "refuse("` | lignes **1 082 → 1 102**, refus **90 → 94**, banc **63 → 65** |

**Dérives signalées, non corrigées.** Deux. (1) Un `faits.json` édité **sur les deux champs** (identifiant et
commande) passe encore : c'est un contrôle de cohérence dans la pièce, pas un second témoin, et l'ADR le dit.
(2) La forme de la commande n'est vérifiée qu'en surface — la présence de `from messages` et d'un
`thread_id='…'` ; une requête qui exporterait autre chose que les messages du fil, tout en nommant ce fil,
passerait.

**Rectifications de ses propres affirmations.** Une, qui vient d'une séance précédente : la séance 34 écrivait
« aucune pièce du run ne nomme le fil », et c'était faux — `trace.commande` le nomme, et c'est précisément ce
qui a permis de rattacher l'identifiant sans lire la base du client.

**Prochaines étapes.** Rien n'est commité : onze fichiers modifiés, un nouveau. Le second run reste le juge.

**Mémoires.** `a7280791` — les trois mesures d'avant, les deux contrôles, la falsification.

## Séance 38 — 2026-10-17 (`receipt` lit l'export, et la condition 2 cesse d'être une limite)

**Objectif.** Faire lire par `receipt` la trace exportée au lieu de la constater : au moins un échange dans la
fenêtre du run, pour que la condition 2 du §5 cesse d'être une limite.

**Fait.** [ADR-029](DECISIONS.md), écrite avant le code. `receipt` lit l'export ligne à ligne (JSONL du §1.5,
`ts` en epoch ms), compte les lignes, les illisibles, celles sans horodatage numérique et les échanges tombant
entre `horodatage_debut` et `horodatage_fin`, écrit ce compte sous `trace_lue`, remplace le falsificateur en
dur `trace_non_lue_par_le_harnais` par `trace_sans_echange_dans_la_fenetre`, et remplace la limite « ne lit
aucune des trois sources » par ce que le fichier a de travers. Un dossier nommé comme la trace est refusé. Le
banc gagne les contrôles 66 et 67 et passe à **67** ; deux fixtures pointent désormais un fichier de trace
(`$B/trace/echange.jsonl`) au lieu du dossier `$B/trace`. Pages remises au vrai : BANC, DEVICE, DASHBOARD,
EXPLICATION, ARCHITECTURE.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| avant : un échange hors fenêtre | banc `/tmp/mesure-trace.Qhvqm8` | accepté, `exit 0`, falsificateur `trace_non_lue_par_le_harnais: true` |
| avant : un export vide | même banc | accepté, `exit 0`, même falsificateur |
| avant : une ligne qui n'est pas du JSON | même banc | accepté, `exit 0`, même falsificateur |
| avant : deux échanges dans la fenêtre | même banc | accepté, `exit 0`, **même falsificateur** — les quatre reçus sont identiques |
| après : un échange dans la fenêtre | contrôle 66 | `trace_lue.echanges_dans_la_fenetre ≥ 1`, falsificateur **faux** |
| après : un échange hors fenêtre | contrôle 67 | falsificateur **vrai**, limite « … condition 2 » écrite, `exit 0` |
| le banc entier | `bash docs/device/harness/banc-harnais.sh` | **67/67 PASS**, `exit 0` |
| les deux contrôles neufs distinguent l'ancien du nouveau | ancien `run.mjs` (`git show HEAD:…`) | `trace_lue` absent, falsificateur `trace_non_lue_par_le_harnais` : les deux contrôles échouent contre lui |
| le harnais reste sain | `node --check` | `exit 0` |
| les pages qui comptent sont au vrai | `wc -l`, `grep -c "refuse("` | lignes **1 102 → 1 150**, refus **94 → 96**, banc **65 → 67** |

**Dérives signalées, non corrigées.** Trois. (1) La forme lue est celle de l'export du §1.5 (Freebuff
Desktop) : un export d'une autre source du §5.1, dont les lignes ne portent pas `ts`, tombe dans « lignes sans
horodatage » et la fenêtre ne le date pas — la limite le dit, la condition 2 mord. (2) Un échange se compte à
la ligne, sans distinguer un message d'une part d'outil : la condition 2 demande « au moins un échange », pas
un type. (3) Un export lisible mais **hors** fenêtre et un export **absent** mordent tous deux la condition 2 ;
le reçu les distingue par la limite (« introuvable » ou non) et par `trace_lue.lignes`, pas par le
falsificateur.

**Rectifications de ses propres affirmations.** Une, pendant le travail : le premier passage du banc a rendu
`66/67`, le contrôle 55 tombant en `exit 1` — sa fixture passait encore le **dossier** `$B/trace` comme chemin
d'export, que le nouveau refus rejette à juste titre. La fixture a été corrigée, pas le contrôle.

**Prochaines étapes.** Rien n'est commité : onze fichiers modifiés, un nouveau. Le second run reste le juge :
vingt-deux contrôles de plus que le banc d'il y a trois jours, et pas une session ouverte.

**Mémoires.** `381402b7` — les quatre reçus identiques d'avant, les deux contrôles, la fixture corrigée.

## Séance 39 — 2026-10-17 (la journée poussée : commit `b2d531e`)

**Objectif.** Consigner et pousser la journée du 2026-10-17, ADR-025 et sa suite comprises, blobs vérifiés sur
le distant.

**Fait.** Commit `b2d531e99a1badba6e0413b54f862a32e76c5b8f`, **11 fichiers, 831 insertions, 32 suppressions**,
dont `docs/device/harness/liens.mjs` en création : les ADR-025 à 029, `run.mjs` (1 006 → 1 150 lignes, 86 → 96
refus), le banc (50 → 67 contrôles), les pages de suivi et les séances 34 à 38. Poussée `938163c..b2d531e`.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| le banc passe avant le commit | `bash docs/device/harness/banc-harnais.sh` | **67/67 PASS**, `exit 0` |
| les liens du dépôt tiennent | `node docs/device/harness/liens.mjs` | 317 hors code, **0 mort**, `exit 0` |
| les deux scripts sont sains | `node --check` × 2 | `exit 0` |
| aucun caractère invisible, aucun secret | balayage des fichiers du diff | aucun |
| la poussée est acceptée | `git push origin main` | `938163c..b2d531e`, `exit 0` |
| les têtes concordent | `rev-parse HEAD` · `origin/main` · `ls-remote` | trois fois `b2d531e99a1badba6e0413b54f862a32e76c5b8f` |
| les blobs du distant sont ceux du disque | 11 chemins : `rev-parse origin/main:<chemin>` contre `hash-object` | **11 identiques, 0 divergent** |
| l'arbre est propre | `git status --porcelain` | **0** |

**Dérives signalées, non corrigées.** Une. La demande nommait « l'ADR-025, les six contrôles et la séance 34 » ;
le lot poussé va jusqu'à l'ADR-029 et 67 contrôles, parce que les quatre travaux suivants ont été demandés et
faits avant ce commit. Le message de commit le dit, plutôt que de laisser croire que la demande en couvrait
moins.

**Fermeture.** Séance close à cet instant. Ce paragraphe part dans le commit qui le porte, dont l'empreinte ne
peut donc pas figurer ici. Aucun des quatre arbres n'a été touché.

**Mémoires.** `558e0a85` — le commit, la poussée, les onze blobs.

## Séance 39 — 2026-10-17 (suite)

**Rectification.** La ligne « Mémoires » de la séance précédente est arrivée malformée sur `origin/main` : un
`sed` dont les backticks ont été interprétés par le shell y avait laissé le jeton `MEMOIRE_A_COMPLETER` collé à
l'identifiant `558e0a85`, poussé dans `f52e5cb`. La ligne est remise en état ici, et cette suite le dit plutôt
que de laisser croire l'original juste. Leçon de méthode : un remplacement qui traverse des backticks se fait
sans shell.

**Fermeture.** Cette suite part dans le commit qui la porte. Aucun des quatre arbres n'a été touché.

## Séance 40 — 2026-10-17 (le kit d'ouverture : une page, plus de retour au journal)

**Objectif.** L'ouverture du second run demandait encore de rouvrir le journal : le texte et les deux
réponses vivaient dans `$W/mode-d-emploi.md` (09:52), mais les commandes des gestes et la suite du harnais
vivaient dans la conduite §1.5 et la liste de contrôle §4. Le kit les met sur une page.

**Fait.** `$W/kit-ouverture.md` (7 483 octets, `stat -c %w` = 2026-10-17 10:53:48) : §1 le texte du §5, extrait
du cas par script, `$RACINE` substitué ; §2 les deux réponses figées et leurs déclencheurs ; §3 les sept
gestes de l'opérateur avec leurs commandes — lire la ligne du fil, coller, vérifier le premier maillon, `date -Is`,
nommer `$RUN`, exporter la trace ; §4 ce qui ne part jamais ; §5 les cinq gestes du harnais, dans l'ordre.
Le §5 repose les variables dont il se sert, au lieu de les supposer restées de la section précédente. `$W/mode-d-emploi.md`
n'est pas touché : la liste de contrôle §4.3 dit désormais lequel des deux fait foi.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| le bloc du kit est le texte scellé | extraction + `sha256` | **254** octets, `832036f7…`, identique à `texte-a-remettre.txt` |
| le harnais accepte ce bloc | `preflight --case <cas> --repertoire $W/terrain --texte <bloc extrait>` | `ouverture autorisée … texte 832036f7 (254 octets) conforme au §5 substitué`, **`exit 0`** |
| la commande d'export tourne | la requête du kit, rejouée sur la base d'un autre projet | **1 875** lignes JSONL, `exit 0` (le `141` d'un premier essai venait du `head`, pas du SQL) |
| la trace lue est celle que `faits` enregistre | lecture de `run.mjs` (801-802) | commande **identique** au caractère près, `where m.thread_id=` comprise |
| la colonne du fil existe | `.schema threads` | `execution_mode TEXT NOT NULL DEFAULT 'local'` |
| les drapeaux du §5 existent | `faits` avec un fil inexistant | `REFUS — faits : aucun fil « fil-inexistant » dans …desktop-v2.db`, **`exit 1`**, aucun fichier écrit |

**Dérives signalées, et corrigées.** Trois, toutes introduites par l'ADR-028/029 et poussées :

1. liste de contrôle §4.4 annonçait « deux fois `832036f7…` » sans retirer le saut de ligne que `sqlite3`
   ajoute : le premier fichier pèse 255 octets pour un texte de 254, et son empreinte n'aurait pas été celle
   du texte (mesuré : 238 octets pour 237 sur un message réel). Corrigé en `head -c -1`, taille attendue
   nommée, et la correction datée sur place.
2. conduite §1.5 affirmait « Le harnais n'en lit **aucune** » : faux depuis ADR-029, le reçu relit l'export.
3. conduite §1.4 donnait `chemin_exporte: "$RUN/trace/"`, un **dossier** — que le reçu refuse désormais.

**Prochaines étapes.** Ouvrir le fil neuf dans le projet `terrain`, en mode direct ; le §3 du kit se lit sans
revenir ici.

**Mémoires.** `abed7a80` — le kit, ses contrôles, les trois dérives corrigées, et la leçon du saut de ligne `sqlite3`.

## Séance 41 — 2026-10-17 (la clôture en une commande : du fil au jugement)

**Objectif.** La clôture demandait encore cinq appels recopiés de la conduite §3, plus le nom du dossier du
run et l'export mesuré à la main : un opérateur qui suit la liste seule en saute la moitié. Une commande,
partant du seul identifiant de fil, les enchaîne.

**Fait.** Liste de contrôle §4.7 : un bloc `FIL=<fil> … bash <<'CHAINE'` — le script voyage dans le heredoc,
aucun fichier à créer. Il cherche la base du client qui **contient** le fil (un identifiant ne dit pas de
quel projet il vient), lit `racine_espace_de_travail` et la révision `revision-sous-test` **dans le gel**,
nomme le dossier `runs/<horodatage>-<gel>-<dispositif>`, mesure la fin, exporte la trace (§4.5 : avant tout
autre geste), puis appelle `faits`, `collect` (produit si `terrain/aidd_docs` existe, `--sans-produit`
sinon), `receipt`, `compare`. Cinq faits humains — `PAR`, `TEMOIGNAGE`, `DIFFERENCE`, `PHRASE`, `VERDICT` —
sont vérifiés **avant** le premier octet : refusés ensemble, rien n'est écrit. Le kit §5 ne recopie plus les
cinq gestes : il renvoie au bloc, et nomme ce que la chaîne ne fait pas (`last-message.md`, clôture des
quatre arbres, `preflight` qui se franchit avant la session).

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| le bloc du document se lit comme du shell | `bash -n` sur le bloc extrait par script | `exit 0` |
| le bloc du document est le script éprouvé | `diff` bloc interne / fichier essayé | **identique octet à octet**, 89 lignes |
| cinq faits manquants n'écrivent rien | bloc collé, sans variables | 5 `REFUS`, **`exit 1`**, aucun dossier |
| un fil inconnu n'écrit rien | bloc collé, `FIL=zzznothread` | `REFUS — le fil … se lit dans 0 base(s)`, **`exit 1`**, `/tmp/runs-p` absent |
| l'export tourne et rend des lignes | bloc collé, fil réel d'un autre projet | `trace — 2003 ligne(s)`, `echange.jsonl` écrit |
| la porte de `faits` tient | même essai | `REFUS — faits : le fil ouvre …/aidd-device, le gel nomme « travail » …/terrain`, **`exit 1`** |
| la branche sans produit existe | `collect --sans-produit` dans `/tmp` | `collect ok — run sans produit (§9), 0 fichier`, **`exit 0`** |
| les drapeaux de `receipt` et `compare` existent | appels sans reçu, sans faits | refus nommés, **`exit 1`** |
| les liens tiennent | `node docs/device/harness/liens.mjs` | 319 liens, **0 mort**, `exit 0` ; 8 clôtures de bloc dans le document, paire |

**Dérives signalées.** Le kit §5 portait les cinq gestes commande par commande : avec le bloc, il en serait
devenu la copie. Il renvoie désormais au §4.7, et le §4.7 dit qu'il est le seul foyer. Aucune dérive de
mesure cette fois — les essais ont tourné sur des copies sous `/tmp`, jamais dans `docs/device/runs/`.

**Rectifications de mes propres gestes.** La première extraction du bloc, par `awk`, a rendu **0 ligne** et
un `bash -n` vert sur un fichier vide : un `exit 0` qui ne prouvait rien. Refaite en `python3`, le bloc
extrait est identique octet à octet au script essayé — c'est cette mesure-là qui compte. Second trou, trouvé
au contrôle final : un collage laissé avec ses gabarits `« <…> »` passait le contrôle de vacuité, et aurait
écrit un dossier de run nommant `« <qui a ouvert et cloture> »`. Le bloc refuse désormais une valeur qui garde
son gabarit (`REFUS — PAR porte encore son gabarit …`, 4 refus, **`exit 1`**, rien d'écrit) ; `FIL` s'écrit
`'<fil>'`, donc un bloc collé tel quel s'arrête au `USAGE`, jamais dans un dossier.

**OPEN.** La chaîne n'a jamais atteint `receipt` ni `compare` : aucun fil n'existe dans le projet `terrain`
(`threads` = 0). Éprouvée jusqu'au refus de `faits`, elle ne l'est pas jusqu'au reçu ; c'est écrit au §5 de
la liste.

**Prochaines étapes.** Ouvrir le fil neuf dans `terrain`, mode direct, coller le texte du kit §1, puis lancer
le bloc du §4.7 avec les cinq faits.

**Mémoires.** `5f473202` (2026-10-17 11:40:12) — la commande, son ordre, ses cinq portes mesurées, et
la limite « jamais jusqu'au reçu ».

## Séance 41 — 2026-10-17 (suite) : ce que le double contrôle a trouvé

**Objectif.** Relire les trois livrables de la journée et les deux commits contre leurs propres affirmations,
sans complaisance : chercher ce qui est faux, périmé ou invérifiable, et le prouver par la mesure.

**Fait.** Quatre corrections, toutes dans le bloc du §4.7 et la liste :

1. **la requête d'export tient maintenant sur une ligne**, exactement comme `faits` l'enregistre. Elle était
   coupée sur quatre lignes : `faits.json` aurait porté un équivalent, pas la commande qui a produit le
   fichier. Mesure après réparation : variables substituées, la commande exécutée est **identique caractère
   par caractère** au modèle de `run.mjs` (501 caractères, 0 différence).
2. **« 89 lignes » était périmé.** Ce chiffre mesurait le script d'avant le garde-fou des gabarits ; la
   version committée en compte 94, celle d'après réparation 93 (`wc -l` sur le bloc extrait).
3. **un diagnostic muet dans la recherche de base** : `sqlite3 … 2>/dev/null` faisait disparaître l'erreur
   d'une base illisible, et le refus final aurait dit « 0 base » sans dire pourquoi. Le `2>/dev/null` est
   retiré ; la boucle se comporte pareil, l'erreur se voit.
4. **le §5 de la liste nomme une branche jamais exercée** : `collect --from terrain/aidd_docs` (produit),
   impossible à éprouver sans écrire dans `terrain`. Et le préambule du §4.7 dit que le gabarit non rempli
   bloque aussi.

**Rectification d'une fausse piste, la mienne.** J'ai suspecté faux le « commande identique au caractère
près » de la Séance 40, à cause des guillemets autour de `"$DB"` et de `"$RUN/…"` que `faits` n'écrit pas.
Mesure contre le modèle extrait de `run.mjs` : substitution des deux côtés, **533 caractères, 0 différence**.
L'affirmation tient ; c'est mon soupçon qui était l'erreur, et il n'a pas été « réparé ».

**Rectification d'un message de commit.** `9fdf435` écrit « Aucun des trois n'écrit rien » : la polarité est
inversée, les trois cas n'écrivent **rien**. Un message de commit ne se réécrit pas ; il se rectifie ici.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| le bloc extrait se lit | `bash -n`, bloc du §4.7 | **93 lignes**, `exit 0` |
| collé tel quel, il s'arrête avant d'écrire | bloc sans variable | `USAGE — FIL …`, **`exit 2`**, aucun dossier |
| un gabarit restant bloque | `FIL` rempli, quatre gabarits | 4 `REFUS`, **`exit 1`**, aucun dossier |
| un fil inconnu n'écrit rien | `FIL=zzznothread` | `REFUS — … 0 base(s)`, **`exit 1`**, aucun dossier |
| l'export tourne et la porte de `faits` tient | fil réel d'un autre projet | `trace — 2 244 ligne(s)`, puis `REFUS — faits : le fil ouvre …/aidd-device`, **`exit 1`** |
| la commande exécutée est celle qui sera enregistrée | substitution des deux côtés contre le modèle de `run.mjs` | **501 caractères, 0 différence** |
| idem pour la commande du kit §3.6 | même méthode | **533 caractères, 0 différence** |
| les liens tiennent | `liens.mjs` | 324 liens, **0 mort**, `exit 0` |

**Note de mesure.** L'export du fil d'essai a rendu **2 003** lignes à 13:38 et **2 244** à 14:05 : ce fil
est vivant, il s'agit probablement de cette session. Le nombre de lignes est donc un instantané, jamais une
constante ; le bloc affiche le sien à l'exécution.

**Prochaines étapes.** Committer ces quatre corrections et la présente suite ; ouvrir le fil neuf dans
`terrain` pour que la chaîne atteigne `receipt` et `compare`.

**Mémoires.** `5f473202` mise à jour : la requête d'export s'écrit sur une ligne, la commande enregistrée
doit être la commande exécutée, et un chiffre de ligne de script se remesure après chaque édition.
## Séance 42 — 2026-10-17 (le guide pédagogique du test de bout en bout, en brainstorm)

**Objectif.** Savoir comment écrire un guide qui prenne un lecteur par la main jusqu'à savoir mener un test
de bout en bout, avant d'en écrire une ligne.

**Fait.** `docs/brainstorm/2026-10-17-134347-guide-pedagogique-du-test-de-bout-en-bout.md` (18 007 octets,
`stat -c %w` = 2026-10-17 13:43:47) : les trois lecteurs possibles et celui que je devine (§1), le
renversement du parcours, du verdict vers les arbres (§2), les cinq seuils avec leur preuve et l'erreur qui
trahit un seuil non franchi (§3), la règle « on ne nomme qu'après avoir fait » et cinq anti-patterns (§4),
sept chapitres au tableau (§5), huit figures dont cinq Mermaid et leur quiproquo empêché (§6), cinq
exercices (§7), cinq falsificateurs du guide et un protocole de mesure (§8), format et longueur (§9), la
plus petite version livrable en trois chapitres (§10), les décisions ouvertes (§11), les sources et ce qui
n'est pas mesuré (§12). Rien du guide lui-même n'est écrit.

**Vérifié.**

| Ce qui est affirmé | Commande | Résultat |
| --- | --- | --- |
| les cinq figures se rendent, et disent ce qu'elles doivent dire | blocs extraits, `mmdc` 11.4.2, `PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome` | 5/5 `exit 0`, 0 nœud d'erreur, 0 « Syntax error », libellé attendu présent dans chaque SVG ; 11 451 / 12 753 / 10 446 / 25 428 / 10 266 octets |
| aucune figure ne s'est dégradée en silence | lecture du texte des SVG | au premier passage, sept libellés « 1. », « 2. » … lus comme des listes : `exit 0` et sept « Unsupported markdown: list » ; libellés réécrits en « chapitre 1 : … », revérifiés |
| les liens tiennent | `node docs/device/harness/liens.mjs` | 324 liens hors code, **0 mort**, `exit 0` (deux liens `../../tasks/` corrigés en `../tasks/`) |
| la forme est celle de la maison | comptages | 12 clôtures de bloc, accents graves appariés, 0 apostrophe typographique, 0 tiret cadratin |

**Dérives signalées, non corrigées.** Le paragraphe §9 affirmait que les figures « se vérifient » avant de
l'avoir fait ; la phrase a été mise au vrai et la mesure ajoutée au §12. Le brainstorm ne tranche pas la
question du lecteur : il la pose, avec une devinette nommée.

**Prochaines étapes.** Trancher A / B / C (§1), puis écrire les trois chapitres de la version minimale (§10)
et les faire lire à un tiers.

**Mémoires.** `2eaac4fb` (2026-10-17 11:46:14) : le renversement verdict vers arbres, les cinq seuils, le
piège Mermaid des libellés numérotés que l'exit code cache, et ce qui reste non mesuré.
## Séance 43 — 2026-10-17 (étude antagoniste : le protocole atteste des fichiers, pas une session)

**Objectif.** Chercher ce qui casse dans le protocole de test, par l'attaque et non par la relecture, et le
prouver par des sondes exécutées plutôt que par des lectures.

**Fait.** `docs/brainstorm/2026-10-17-135619-etude-antagoniste-du-protocole.md` (17 020 octets à la
première écriture, **17 065** après trois rectifications, **17 696** après la quatrième ; `stat -c %w` = 2026-10-17 13:56:19) : sept expériences montées dans des clones jetables sous `/tmp`, un
modèle de menace, cinq loups, cinq lièvres, quatre zones d'ombre, ce qui tient, six durcissements chiffrés,
et ce que l'étude ne prouve pas. **Aucun fichier du harnais n'est modifié** : une revue, pas une réparation.

**Vérifié.**

| Sonde | Geste | Résultat observé |
| --- | --- | --- |
| A | produit dans un clone, `faits.json` et `echange.jsonl` écrits à la main, aucun fil | `receipt` **`exit 0`**, `verdict conforme` |
| B | idem plus `memory/backlog.md` (falsificateur F4) | **`exit 0`**, `conforme` |
| C | produit sous un chemin ignoré par git | `conforme` refusé, `exit 1` ; avec `non concluant`, reçu écrit, **`exit 0`** |
| D | aucune trace exportée | **`exit 1`**, condition 2 mord |
| E | échanges hors fenêtre | **`exit 1`** |
| F | copie sous `raw/` réécrite après collect (28 → 34 o) | **`exit 0`**, `conforme`, reçu citant l'ancien `sha256` |
| G | copie sous `raw/` supprimée, manifeste gardé | **`exit 0`**, `conforme` |

Statique : `grep -c budget run.mjs` = **0** ; `grep -c backlog run.mjs` = **0** ; `empreinteDeGel` (323-327)
ne hache ni `arbres` ni la trace ; `receipt` ne lit jamais la base nommée par `trace.source`.

**Rectifications, quatre.** Trois pendant l'écriture : « l'opérateur écrit six des sept entrées » était un
chiffre non mesuré, remplacé par la liste des pièces ; F8 était compté parmi les falsificateurs non lus,
faux, un manifeste vide fait mordre « la session n'a rien produit » ; les sondes n'avaient pas « passé
`preflight` », qui n'a pas été invoqué, c'est le reçu qui les a laissées passer. La quatrième au contrôle
final : « `terrain` est resté à `porcelain` 0 ligne » était faux. `git -C /home/giak/projects/audio-sync-tool
status --porcelain` rend **1 ligne** (`?? .freebuff/`, dossier daté du 2026-10-14 15:49), et le gel du
2026-10-15 enregistre déjà cette ligne ; la preuve de non-écriture est donc l'**égalité** avec le gel, pas un
zéro. Étude §9 et §10 corrigés.

**Dérives signalées, non corrigées.** `terrain/.gitignore` n'ignore pas `aidd_docs`, donc C n'ouvre pas de
risque aujourd'hui ; `.git/info/exclude` de la copie (7 lignes contre 48) reste non expliqué, et il est le
vecteur exact de C. Aucune réparation du harnais n'est appliquée : la règle du dépôt exige une spec écrite
avant le code, et le durcissement proposé (H1 à H6) la demande.

**OPEN.** Aucune session réelle n'a été ouverte ; aucune base du client n'a été falsifiée ; le montage
modifie `arbres[travail]` du gel, c'est-à-dire le trou W5 lui-même.

**Prochaines étapes.** Écrire la spec du durcissement H1 (re-hachage de `raw/`) et H3 (re-contrôle de la
base), puis les éprouver au banc ; F1 attend une définition mécanique du tableau.

**Mémoires.** `5f586e45` (2026-10-17 11:58:00) : le protocole atteste des fichiers, les sept sondes, le fait
que `raw/` n'est jamais remesuré, et les durcissements H1 à H6 proposés.
## Séance 44 — 2026-10-17 (spec du durcissement H1 et H3)

**Objectif.** Écrire, avant toute ligne de code, la spec des deux premiers durcissements mesurés par l'étude
antagoniste : le reçu re-hache `raw/<cas>/` (H1), et refuse un `faits.json` que la base du client dément (H3).

**Fait.** `docs/tasks/2026_10/2026-10-17-140536-durcissement-du-recu/2026-10-17-140536-spec.md`
(199 lignes, 2 061 mots, 12 621 octets ; naissance du dossier `stat -c %w` = 2026-10-17 14:05:36, le nom la
porte). Dix sections : critère falsifiable, H1 en six règles, H3 en huit refus, interface (un champ
`trace.base`, deux champs de reçu, deux prérequis étendus), 18 contrôles de banc (68 à 85), non-régression,
ce qui reste ouvert, quatre décisions soumises au relecteur. **Aucun fichier du harnais touché** : la spec
attend l'approbation, puis le code.

**Vérifié.**

| Citation | Ce qui s'y trouve |
| --- | --- |
| 838-839 | lecture du manifeste au reçu |
| 1049-1052 | `produit` recopie les `sha256` du manifeste, ne les recalcule pas |
| 661-691 | `copier`, puis `writeJson(join(dest, "manifest.json"))` : le manifeste s'écrit au même chemin qu'un produit de ce nom |
| 617-618 | manifeste vide d'un run `--sans-produit` |
| 743-821 | `cmdFaits`, ses refus, et l'écriture de `trace.source` (816) |
| 844-865 | les champs que `receipt` exige de `faits.json` |
| 163-183 | `PREREQUIS`, dont `sqlite3` et `date -d`, déclarés pour `faits` seule |
| 721-742 | `isoDeMs` et `lireBase`, réutilisables par `receipt` |

`node docs/device/harness/liens.mjs` → `exit 0`, 31 fichiers, 327 liens, **0 mort**. Sur la spec :
18 lignes de contrôle, 4 tirets cadratins (le `name` et trois titres, convention du dépôt), **0 dans la prose**.

**Rectifications.** Deux, avant livraison. J'avais écrit « onze contrôles » lisent `faits-bon.json` : faux,
ils sont douze, et deux d'entre eux (44 et 45) citent un fichier jamais copié, que H1 transforme en refus ;
la conséquence est écrite en trois points au §6. J'avais cité le bloc `session` du reçu comme 844-876 : il
finit à 865, `temoignage` compris.

**Dérives signalées, non corrigées.** Un produit qui contiendrait un fichier nommé `manifest.json` serait
écrasé par le manifeste de `collect` : inféré du code (661-691), non mesuré, et H1 le refuse en amont.

**OPEN.** H3 crée `trace.base` : un `faits.json` d'avant cette spec est refusé par le nouveau `receipt`,
assumé au §4.1 et sans effet sur les reçus déjà écrits (le reçu refuse de s'écraser). Aucune session réelle,
aucune base forgée : H1 et H3 sont spécifiés, pas éprouvés.

**Prochaines étapes.** Approbation de la spec, puis H1 et H3 dans `run.mjs`, puis les 18 contrôles du banc et
la mise à jour de `BANC.md`, `DEVICE.md`, `README.md`. H2, H4, H5, H6 restent hors spec.

**Mémoires.** `0ce57877` (2026-10-17 12:08:00) : `trace.base` explicite contre le parsing de `trace.source`,
le refus d'un fichier en plus sous `raw/`, et la fixture des contrôles 44-45.

## Séance 45 — 2026-10-17 (H1 et H3 appliqués : le reçu relit sa copie et sa base)

**Objectif.** Appliquer les deux premiers durcissements de l'étude antagoniste, sur la spec approuvée par
la demande : `receipt` re-hache `raw/<cas>/` (H1, ADR-030) et relit la base que `faits.json` nomme
(H3, ADR-031).

**Fait.** `run.mjs` : `verifierCopie` (H1) re-hache chaque fichier du manifeste, refuse un fichier absent,
un `sha256` différent, un chemin qui sort de `raw/<cas>/`, un lien symbolique et un fichier non listé ;
hache `manifest.json` et `last-message.md` sous `produit.verifie`. `faits` écrit `trace.base` ; `receipt`
l'exige, relit la base en `-readonly` et refuse huit écarts (fil absent, répertoire hors de l'arbre gelé,
mode non local, worktree, modèle, heure d'ouverture, premier message, aucun message), puis écrit
`session_verifiee` depuis la base. `sqlite3 -version` et `date -d @0` passent à `faits` **et** `receipt`.
`--help` et l'en-tête disent les deux gestes. Le banc passe de 67 à **87 contrôles** (68 à 87), les
fixtures de `faits-bon.json` et des contrôles 44-45 mises au vrai, le contrôle 15 nommant désormais son
motif. ADR-030 et ADR-031 écrites ; `BANC.md`, `DEVICE.md`, `ARCHITECTURE.md`, `EXPLICATION.md`,
`DASHBOARD.md`, `README.md` et la spec remis à leurs compteurs.

**Vérifié.**

| Geste | Résultat observé |
| --- | --- |
| `bash docs/device/harness/banc-harnais.sh` | **87/87 PASS**, `exit 0` |
| `node --check docs/device/harness/run.mjs` | `exit 0` |
| `node docs/device/harness/liens.mjs` | 328 liens, **0 mort**, `exit 0` |
| `wc -l run.mjs` · `grep -c "refuse("` | **1 311** lignes, **122** refus |
| sonde F rejouée (contrôle 68) | copie réécrite après `collect` → **`exit 1`**, empreinte nommée |
| copie supprimée (contrôle 69) | **`exit 1`** |
| `faits.json` sans `trace.base`, fil inconnu, base absente (75-77) | **`exit 1`**, motif nommé |
| base concordante (85) | `exit 0`, `session_verifiee.fil` = `banc` |

**Rectifications, trois, dont une matérielle.**

1. **H1 aurait refusé tout run conforme.** La spec du run fait écrire `last-message.md` **à la main** sous
   `raw/<cas>/` après `collect` (§4) ; le manifeste ne peut donc pas le lister, et la règle « tout fichier
   non listé est un refus » l'aurait frappé. Trouvé en cherchant qui écrit ce fichier, pas en relisant ma
   spec. `last-message.md` est désormais une exception **nommée et mesurée** (hachée sous
   `produit.verifie.last_message_sha256`), et le contrôle 87 la prouve. La spec §3 et §9 sont amendées.
2. **18 contrôles annoncés, 19 écrits.** Le fil sans message utilisateur a son propre contrôle (84), sinon
   la branche restait non éprouvée. La table §6 est renumérotée 68 à 87, le §7 passe à 87.
3. **Deux fixtures mentaient par omission.** Les contrôles 44 et 45 citaient un fichier jamais copié : H1 en
   fait des refus, donc la fixture dépose une vraie copie avec le `sha256` qu'elle inscrit. Et
   `faits-bon.json` devait nommer un fil qui existe : le banc insère `banc` dans `$DBF` avant le premier
   reçu, avec ses heures dérivées comme `faits` les dérive.

**Dérives signalées, non corrigées.** `receipt` dépend maintenant de la base au moment du reçu : un
`faits.json` d'avant la spec est refusé, et un run dont la base a disparu entre `faits` et `receipt` ne peut
plus produire de reçu. C'est le prix de H3, dit dans l'ADR-031, pas un défaut constaté.

**OPEN.** Aucune session réelle ; aucune base forgée (H3 ne ferme pas W1 : un fil cohérent dans une base
forgée passe) ; `trace.base` et `trace.commande` peuvent nommer deux bases différentes tant que H2 n'est
pas fait.

**Prochaines étapes.** H2 (rejouer l'export, hacher la trace), puis H4, H5, H6 ; la définition mécanique du
tableau reste le préalable de H6.

**Mémoires.** `778c8ffe` (2026-10-17 12:26:30) : les deux gestes appliqués, `last-message.md` sauvé de H1,
le banc à 87 et les rectifications de la spec.

## Séance 46 — 2026-10-17 (spec H2 : l'export rejoué depuis la base, la trace hachée)

**Objectif.** Spécifier H2, avant le code : lier la trace exportée à la base qui la produit, sans exécuter
la commande que porte `faits.json`.

**Fait.** `docs/tasks/2026_10/2026-10-17-140536-durcissement-du-recu/2026-10-17-143030-spec-h2.md`
(158 lignes, 1 748 mots, 10 398 octets ; naissance `stat -c %w` = 2026-10-17 14:30:30). Le reçu
**reconstruit** la commande d'export depuis `trace.base`, `session.identifiant` et `trace.chemin_exporte`,
avec le gabarit de `faits` (807-810) ; il exige l'égalité caractère pour caractère avec `trace.commande`
(ferme L4 sans interpréter une pièce éditable) ; il exécute la requête en `-readonly`, capture **les
octets** de la sortie, compare au `sha256` du fichier, et écrit `trace_lue.sha256` et `trace_lue.rejoue_le`.
`compare` re-hache la trace citée et refuse si elle a changé. Neuf contrôles (88 à 96), banc 87 → 96 ;
ADR-032 prévue.

**Vérifié.**

| Citation | Ce qui s'y trouve |
| --- | --- |
| 807-810 | le gabarit de la commande d'export, seul texte que H2 recopie |
| 823 | `trace{source, base, chemin_exporte, commande}` |
| 240 | `sha256File`, la fonction que le rejeu confronte |
| 1251 | `cmdCompare`, où le re-hachage prend place |
| 1232 | `trace_lue`, où les deux champs nouveaux entrent |

`node docs/device/harness/liens.mjs` → `exit 0`, 32 fichiers, 334 liens, **0 mort**. Sur la spec :
9 lignes de contrôle (88 à 96), 2 tirets cadratins (le `name` et le titre), **0 dans la prose**.

**Rectifications, trois.** La spec §8 disait que les contrôles 16 à 55 s'appuyaient sur un fichier vide :
`echange.jsonl` n'est créé qu'au contrôle 47, donc ces quatre-là ont une trace absente, pas un vide ; seul
le 85 compare un vide à un vide. Corrigé. Les deux liens vers `DECISIONS.md` étaient écrits `../` depuis un dossier de
tâche, donc faux : `../../../`, vérifié par le contrôle de liens. Et le contrôle 94 doublait le 56 (trace
absente) : remplacé par un `trace.commande` qui cite un autre chemin d'export, sinon un contrôle neuf
n'apprenait rien.

**Dérives signalées, non corrigées.** H2 découvre que les contrôles 66 et 67 tapaient leurs exports : sous
la règle nouvelle ils seraient refusés avant la fenêtre. Leur fixture doit être produite par le rejeu, et le
cas hors fenêtre se déplace **dans la base** (fil `banc-hors-fenetre` : premier message sans part, message
tardif avec une part), pas dans le fichier. La spec §8 le détaille, le banc n'est pas touché.

**OPEN.** Aucune session réelle ; la base reste la racine de confiance ; un message ajouté au fil après
l'export fera refuser le reçu (l'ordre du §1.5 l'évite, la spec le dit) ; `faits` écrit le chemin de la base
sans guillemets dans `trace.commande`, donc un chemin avec espace casserait le rejeu.

**Prochaines étapes.** Approbation, puis H2 dans `run.mjs` et ADR-032 ; ensuite H4 (budget), H5
(`gate.json`), H6 (le tableau).

**Mémoires.** `1ffc563f` (2026-10-17 12:33:17) : reconstruire sans exécuter, égalité octet pour octet,
`compare` re-hache, et les fixtures 66-67 à refaire.

## Séance 47 — 2026-10-17 (H2 appliqué : l'export rejoué depuis la base, la trace hachée)

**Objectif.** Appliquer la spec H2 approuvée : lier la preuve au fichier exporté, sans jamais exécuter la
chaîne que porte `faits.json`.

**Fait.**

- `run.mjs` (1 393 lignes, contre 1 311) : le gabarit du §1.5 est écrit **une fois** (`requeteExport`,
  `commandeExport`, 767-771) ; `faits` s'en sert (830) au lieu de le recopier ; `receipt` reconstruit la
  commande depuis `trace.base`, `session.identifiant` et `trace.chemin_exporte`, refuse une `trace.commande`
  qui en diffère, rejoue la requête en `-readonly`, compare **les octets** au fichier et écrit
  `trace_lue.sha256` et `trace_lue.rejoue_le` (1090-1126) ; `compare` re-hache la trace citée (1345-1358).
  `--help` dit les deux refus nouveaux et les deux champs du reçu.
- `banc-harnais.sh` (507 lignes, contre 328) : le `faits.json` du banc est produit par `faits` — une pièce
  écrite à la main n'atteint plus le reçu ; `faits-en` déplace la redirection de `trace.commande` avec le
  chemin exporté ; les fixtures 66-67 sont produites par le rejeu (`export-fil` exécute la commande que
  `faits` écrit), le fil `banc-fenetre` porte deux parts, et le cas hors fenêtre se déplace **dans la base**
  (`banc-hors-fenetre`) ; neuf contrôles neufs (88 à 96) ; en-tête à 96.
- [ADR-032](DECISIONS.md) écrite, et la limite de l'ADR-031 qui la nommait close sur place, d'une phrase
  datée. `BANC.md`, `DEVICE.md`, `ARCHITECTURE.md`, `EXPLICATION.md`, `DASHBOARD.md` et `README.md` passent
  de 87 à **96** ; la spec H2 passe à `status: done` et reçoit un §13 pour ses deux écarts.
- Deux chiffres périmés remis au mesuré dans la même passe : le nombre de lignes du harnais (1 311 →
  **1 393**, `wc -l`) et son compte de refus (86 → **127**, `grep -c 'refuse('`), dans `EXPLICATION.md`,
  `ARCHITECTURE.md`, `DASHBOARD.md` et `README.md`. Le tableau de bord citait encore **67/67** comme dernier
  compte du banc : il porte désormais les trois paliers (67, puis 87 et 96).

**Vérifié.**

| Commande | Résultat |
| --- | --- |
| `bash docs/device/harness/banc-harnais.sh` | **96/96 PASS**, `exit 0`, 0 `FAIL` |
| `node --check docs/device/harness/run.mjs` | `exit 0` |
| `node docs/device/harness/liens.mjs` | `exit 0`, 32 fichiers, 341 liens hors code, **0 mort** |
| contrôle 88 (fixture `banc-fenetre`) | `trace_lue` = `{lignes: 2, echanges_dans_la_fenetre: 2, illisibles: 0, sha256: 92354997…, rejoue_le: 2026-10-17T20:42:31+02:00}` |
| contrôle 89, rejoué à la main | `REFUS — … ne rend pas ce que la base rend pour le fil « banc-fenetre » — efccadca au fichier, 92354997 au rejeu …`, `exit 1` |
| contrôle 96, rejoué à la main | `REFUS — compare : la trace citée par le reçu ne rend plus son empreinte — ba840a8c au disque, 92354997 au reçu`, `exit 1` |

**Dérives signalées, non corrigées.** La spec H1/H3 du même dossier porte encore « Statut : en attente
d'approbation » et `status: in-progress` alors que H1 et H3 sont dans `run.mjs` depuis la Séance 45 :
constaté en cherchant une convention de statut, laissé en place (hors du périmètre de H2). `faits` écrit
toujours le chemin de la base sans guillemets dans `trace.commande` : un chemin avec espace casserait à la
fois le rejeu et la comparaison, et c'est dit dans l'ADR-032, pas corrigé.

**Rectifications.** Deux, sur mes propres affirmations. La ligne 88-96 de `BANC.md` annonçait « cinq refus » :
le compte est **sept** (89, 90, 91, 92, 93, 94, 96) pour deux acceptations, corrigé avant livraison. Et le
§8.3 de la spec H2 disait que les contrôles 16, 44, 45 et 55 garderaient une trace **absente** : faux dès
lors que leur `faits.json` vient de `faits` — la trace existe et est vide, le rejeu rend zéro ligne, et
l'égalité des empreintes tient ; l'absence n'est plus éprouvée que par le contrôle 56. Écrit au §13 de la
spec, pas dissimulé.

**OPEN.** Aucune session réelle ; la base reste la racine de confiance (W1 ouvert) ; un message ajouté au
fil après l'export fait refuser le reçu, donc l'ordre du §1.5 devient obligatoire ; le rejeu prouve le
fichier **à l'instant du reçu**, pas au bon moment. **Rien n'est commité.**

**Prochaines étapes.** H4 (le budget), H5 (`gate.json`), H6 (le tableau, après sa définition mécanique).

**Mémoires.** `6c3fc62b` (2026-10-17 20:44:50) : reconstruire sans exécuter, égalité octet pour octet,
`compare` re-hache, le `faits.json` du banc produit par `faits`, les fixtures 66-67 par le rejeu, 96/96.

## Séance 48 — 2026-10-17 (spec H4 : le budget d'échanges, mesuré contre le fil)

**Objectif.** Spécifier H4, avant le code : le cas fixe un budget d'échanges, rien ne le mesure, et la
promesse « le reçu nomme l'échange qui l'a épuisé » n'est tenue par aucune ligne.

**Fait.**

- `docs/tasks/2026_10/2026-10-17-140536-durcissement-du-recu/2026-10-17-204933-spec-h4.md`, 180 lignes,
  11 759 octets, 1 983 mots (remesurés après deux corrections de relecture) ; naissance `stat -c %w` =
  `2026-10-17 20:49:33.969414763 +0200`, le nom porte `204933`. Aucune ligne de `run.mjs`.
- **Ce qui se compte** : un échange = un message `user` du fil, tous, sans filtre de fenêtre (le fil est le
  run ; `horodatage_fin` est un instant choisi, il ne doit pas réduire le budget ; l'export ne filtre pas
  non plus). Les appels d'outils sont des parts, pas des messages.
- **Où le budget se lit** : `demande.budget_echanges` de l'attendu (`3`), que `verifierLeGel` re-hache avant
  toute lecture puisque l'attendu est l'un des deux fichiers du gel. Un champ de gel aurait été éditable
  sans re-gel : `empreinte` ne hache que `fichiers` et `references`.
- **Refus, pas plafond** : `utilises > budget` est un refus (`exit 1`, rien ne s'écrit), `--verdict non
  concluant` ne le sauve pas ; `utilises == budget` est normal et le reçu nomme l'échange (`epuise_par`).
- Six contrôles prévus (97 à 102), banc 96 → **102**, aucune fixture existante retouchée (le fil `banc` a
  **1** message `user`, `fil-banc` 1, `banc-fenetre` 1, `banc-hors-fenetre` 1, `banc-apres` 1, tous sous 3).

**Vérifié.**

| Commande | Résultat |
| --- | --- |
| `grep -c budget docs/device/harness/run.mjs` | **0** |
| `grep -n budget_echanges …expected.json` | l. **9**, `"budget_echanges": 3`, sous `demande` |
| rôles des fichiers du gel | `attendu \| demande`, donc l'attendu est re-haché |
| `grep -n « Trois échanges au plus » …request.md` | l. **193** ; « nomme l'échange qui l'a épuisé » l. **214** |
| `node docs/device/harness/liens.mjs` | `exit 0`, 33 fichiers, 346 liens hors code, **0 mort** |
| tirets cadratins dans la spec | **2** (le `name` et le titre), **0 dans la prose** |

Le banc n'a pas été relancé : aucune ligne de code n'a changé dans cette séance, et son contrôle 61 éprouve
`liens.mjs`, relancé seul.

**Dérives signalées, non corrigées.** La règle « l'attendu est lu par le juge seul » (ARCHITECTURE §5, spec du
protocole §3) est amendée par cette spec : le reçu y lira **un entier**, pas le contenu. C'est dit au §2, pas
corrigé dans les pages, puisque la spec n'est pas approuvée. Rien d'autre n'a été trouvé qui contredise un
document.

**Rectifications.** Quatre, sur mes propres pièces. La cellule `--help` du §6 portait un tiret cadratin qui
faisait un troisième tiret hors du `name` et du titre : remplacé par « rien sur le budget ». Le §2 citait la
requête d'export à l'appui de « un échange = un message », alors qu'elle rend **une ligne par part** :
reformulé, et la distinction dite (deux parts, un échange). Le bandeau de la spec ne portait pas la valeur de
naissance, seulement la commande qui la donne : ajoutée. Et la mémoire
écrite pour cette séance contenait `echanges{бudget…}` avec un `б` cyrillique : corrigée à la source par
`update_memory`, relue après correction.

**OPEN.** Spec non approuvée, donc aucun code ; la base reste la racine de confiance ; le budget compte les
tours de l'opérateur, pas les questions de la session ; un fil continué après le run fera refuser ; aucune
session réelle. **Rien n'est commité.**

**Prochaines étapes.** Approbation, puis H4 dans `run.mjs` avec les contrôles 97 à 102 et l'ADR-033 ; ensuite
H5 (`gate.json`), puis H6.

**Mémoires.** `eeb9b255` (2026-10-17 20:50:04, corrigée à 20:50:22, chiffres remesurés à 20:51:28) : les
mesures de l'écart, les quatre décisions (attendu, tous les messages `user`, refus du dépassement,
`epuise_par`), le banc à 102 et les limites.

## Séance 49 — 2026-10-17 (la poussée : quatre commits, du guide au journal)

**Objectif.** Committer tout le travail en attente en plusieurs commits, puis pousser sur `origin/main`.

**Fait.** Quatre commits, du plus ancien au plus récent :

| Commit | Contenu | Mesure |
| --- | --- | --- |
| `4c46476` | les deux brainstorms du 2026-10-17 (guide de bout en bout, étude antagoniste) | 2 fichiers, +551 |
| `f0fca6e` | les trois specs du dossier `2026-10-17-140536-durcissement-du-recu` | 3 fichiers, +567 |
| `9ed2e29` | H1, H2 et H3 : `run.mjs`, le banc, les trois ADR, six pages | 9 fichiers, +605/−82 |
| `4214275` | le journal, Séances 42 à 48 | 1 fichier, +350 |

Le découpage suit ce qui peut tenir tout seul. Les specs précèdent leur code, et le journal vient après.
Le durcissement n'a **pas** été coupé en trois : `run.mjs` et le banc portent H1, H2 et H3 dans les mêmes
fichiers, et un commit partiel aurait laissé un banc qui ne passe pas son propre arbre. Un commit par
geste aurait demandé d'écrire deux états intermédiaires jamais mesurés.

**Vérifié.**

| Commande | Résultat |
| --- | --- |
| `bash docs/device/harness/banc-harnais.sh` sur l'arbre du commit `9ed2e29` | **96/96 PASS**, `exit 0`, 0 `FAIL` |
| `node --check docs/device/harness/run.mjs` | `exit 0` |
| `node docs/device/harness/liens.mjs` | `exit 0`, 33 fichiers, 346 liens, **0 mort** |
| `git push origin main` | `642b5ef..4214275 main -> main`, `exit 0` |
| `git ls-remote origin main` | `4214275f3a2f2a7712042b939330f4ac664b41b6` = `git rev-parse HEAD` |
| `git status -sb` | `## main...origin/main`, plus rien devant |

La poussée publie **sept** commits : les quatre de cette séance et trois déjà commits mais jamais poussés
(`5786276` Séance 40, `9fdf435` Séance 41, `d70e016` la réparation de la clôture).

**OPEN.** Aucune session réelle ; la poussée ne change pas les limites dites en Séance 48 ; le commit de
cette séance part après elle, donc le dernier `origin/main` n'est pas celui des quatre lignes ci-dessus.

**Mémoires.** `dcef65d7` (2026-10-17 20:54:09) : les quatre commits, la poussée et le hash lu sur le distant.

## Séance 50 — 2026-10-17 (H4 appliqué : le budget d'échanges mesuré contre le fil)

**Objectif.** Appliquer la spec H4 approuvée : compter les messages `user` du fil, les comparer au budget du
cas, refuser un dépassement et nommer l'échange qui épuise un budget atteint.

**Fait.**

- `run.mjs` (1 460 lignes, contre 1 393 ; 133 refus, contre 127) : le bloc H4 (1136-1193) vient **après H2**
  et **avant la fenêtre**. L'attendu se résout par le **rôle `attendu` du gel** (`cheminDuCas`, la fonction
  que `verifierLeGel` emploie), jamais par `<casesDir>/<cas>.expected.json`. Un attendu absent, un
  `demande.budget_echanges` absent ou non entier positif sont trois refus nommés. Une **seule requête** lit
  le compte des messages `user` et le message de rang `budget` (sous-requêtes `offset budget-1`, nulles quand
  le rang n'existe pas). `utilises > budget` refuse, `exit 1`, rien ne s'écrit, et `--verdict non concluant`
  ne le sauve pas ; le refus nomme les deux chiffres, le `seq` du premier message au-delà et son horodatage.
  Le reçu écrit `echanges{budget, utilises, epuise_par}` (champ en 1364), `epuise_par` n'étant non nul qu'à
  l'épuisement exact. `--help` dit le champ et le refus.
- `banc-harnais.sh` (565 lignes, contre 507) : six contrôles neufs (97 à 102). Trois fils neufs,
  `banc-budget-1`, `banc-budget-3` (messages `user` aux seq 1, 3 et 5) et `banc-budget-4`, tous en
  `parts_json = '[]'` avec la trace vide déjà là, donc H2 et la fenêtre sont muets et seul le budget
  distingue. 101 et 102 recopient le cas, retirent ou abîment le budget, et le **re-gèlent** (le motif des
  contrôles 21-26) : éditer l'attendu sans re-geler ferait refuser le gel, ce qui n'éprouverait pas le champ.
- [ADR-033](DECISIONS.md) écrite. `BANC.md`, `DEVICE.md`, `ARCHITECTURE.md`, `EXPLICATION.md`,
  `DASHBOARD.md` et `README.md` passent de 96 à **102**, avec les figures remises à 1 460 lignes et 133 refus.
  La spec H4 passe à `status: done` et reçoit un §13.

**Vérifié.**

| Commande | Résultat |
| --- | --- |
| `bash docs/device/harness/banc-harnais.sh` | **102/102 PASS**, `exit 0`, 0 `FAIL` |
| `node --check docs/device/harness/run.mjs` | `exit 0` |
| `node docs/device/harness/liens.mjs` | `exit 0`, 33 fichiers, 350 liens (349 avant cette séance), **0 mort** |
| contrôle 97, reçu | `echanges` = `{"budget":3,"utilises":1,"epuise_par":null}` |
| contrôle 98, reçu | `{"budget":3,"utilises":3,"epuise_par":{"seq":5,"ts":1792098000000}}` |
| contrôle 99, rejoué à la main | « le fil « banc-budget-4 » porte 4 messages utilisateur, le cas en autorise 3 — le premier au-delà du budget est le seq 4 (2026-10-15T23:00:00+02:00) », `exit 1`, aucun reçu écrit |
| contrôle 101, rejoué à la main | « ne déclare aucun budget d'échanges (demande.budget_echanges) », `exit 1` |
| contrôle 102, rejoué à la main | « demande.budget_echanges vaut 0, attendu un entier positif », `exit 1` |

**Dérives signalées, non corrigées.** Aucune nouvelle. La règle « l'attendu est lu par le juge seul » est
amendée, comme la spec l'annonçait : le reçu y lit `demande.budget_echanges`, un entier, et rien d'autre.

**Rectifications.** Deux, sur mes propres pièces. La phrase ajoutée au `--help` portait des backticks dans le
gabarit JavaScript de `USAGE` : `node --check` est sorti en `exit 1`, et le banc s'est arrêté au contrôle 14
sur `ARRET — la fixture faits du banc ne s'écrit pas`, après 9 `PASS`. Backticks retirés, puis 102/102. Et le
§13 de la spec affirmait d'abord que la résolution naïve de l'attendu aurait refusé les contrôles 16, 44, 45,
55, 71, 85 et 88 à 96 : mesuré (`grep` des `receipt --run` du banc, 37 lignes, deux avec `--cases`), les seuls
reçus qui passent `--cases` sont 101 et 102, et leur dossier **copie** l'attendu. Le vrai fait est que
`$B/cases`, d'où la plupart des contrôles tirent leur gel, ne contient **que** le gel : aucun contrôle ne
distingue les deux règles aujourd'hui, et le §13 dit cela.

**OPEN.** Aucune session réelle ; la base reste la racine de confiance ; le budget compte les tours de
l'opérateur, pas les questions de la session ; un fil continué après le run fait refuser ; le reçu lit un
scalaire de l'attendu, la porte tient par discipline. **Rien n'est commité.**

**Prochaines étapes.** H5 (`gate.json`), puis H6 quand la forme du tableau sera écrite ; la poussée quand
elle est demandée.

**Mémoires.** `364f984b` (2026-10-17 21:01:42) : le bloc H4, les trois refus, les six contrôles, le banc à 102
et les limites.

## Séance 51 — 2026-10-17 (spec H5 : ce que la porte trace, et ce que le reçu en refuse)

**Objectif.** Spécifier H5 du §8 de l'étude antagoniste, rien de plus : ce que `gate.json` doit porter, et ce
que `preflight` puis `receipt` doivent en refuser. Aucun code, conformément à la règle du dépôt (spec avant
production).

**Fait.** Une spec, [2026-10-17-210743-spec-h5.md](tasks/2026_10/2026-10-17-140536-durcissement-du-recu/2026-10-17-210743-spec-h5.md),
269 lignes, `status: pending`, nommée par la naissance mesurée (`stat -c %w` → `2026-10-17 21:07:43`). Elle
décide : `preflight` gagne `--run` obligatoire et écrit `<run>/gate.json` en dernier (`type`, `cas`,
`passe_le`, `passe_le_epoch` en secondes, `repertoire`, `gel{chemin, empreinte, gele_le_epoch}`, `arbre` = la
mesure `gitTree` entière, `texte` ou `null`), refuse d'écraser une porte existante et un `--run` qui n'est
pas un répertoire ; `receipt` refuse une porte absente, d'un autre `type`, d'un autre cas, d'un autre gel,
d'un autre arbre, d'un autre répertoire, antérieure au gel, dont le `head_complet` a bougé, ou dont le
`texte.sha256` n'est pas le §5 substitué recalculé ; `receipt.json` gagne `porte{…}` ; `compare` re-hache le
`gate.json` cité. Dix contrôles prévus, 103 à 112, banc de 102 à 112.

**Vérifié.**

| Commande | Résultat |
| --- | --- |
| `grep -c "gate\.json" docs/device/harness/run.mjs` | **0** : aucune porte n'existe aujourd'hui ; les 4 « gate » du fichier (13, 534, 1233, 1253) sont des commentaires sur `preflight` |
| `grep -o 'receipt --run "[^"]*"' banc-harnais.sh \| sort \| uniq -c` | 38 appels sur **37** dossiers de run distincts (36 une fois, `$B/run` deux fois) : chacun devra porter une porte |
| `stat -c %w` sur la spec | `2026-10-17 21:07:43.478375576 +0200` → préfixe `2026-10-17-210743` |
| `node docs/device/harness/liens.mjs` | `exit 0`, 34 fichiers, **356** liens (350 avant), **0 mort** |
| banc | non relancé : `run.mjs` et le banc n'ont pas été touchés par cette séance |

**Dérives signalées, non corrigées.** L'étude chiffre H5 à « ~20 lignes ». Le code, peut-être ; la fixture,
non : 37 dossiers de run à pourvoir d'une porte, quatre contrôles d'acceptation à réécrire, et une porte à
re-geler pour les contrôles 101 et 102 dont le cas est recopié puis re-gelé. Le §10 de la spec le dit, et le
§13 (décision 7) en tire la seule conséquence qui compte : dater la porte contre la session obligerait à
dater ces trente-sept dossiers après elle, donc ne pas le faire et le dire.

**Rectifications.** Deux, sur mon propre brouillon, mesurées avant consignation. La citation de W5 portait
`164-166`, c'est-à-dire l'en-tête et une ligne de blanc (`sed -n "161,168p"`) : la phrase citée est en
166-168. Et le §2 renvoyait à la « décision 7 du §14 » quand les décisions sont au §13 (`grep -n '^## '` de
la spec).

**OPEN.** La porte reste forgeable : recopier l'empreinte du gel et l'arbre produit un `gate.json` que le
reçu accepte. L'ordre porte/session n'est pas mesuré. Un commit suivi d'un `reset` laisse `head_complet` où
il était. Le texte remis n'est confronté qu'au §5, pas à ce que la session a lu (L2). Aucune session réelle.
**Rien n'est commité.**

**Prochaines étapes.** Approbation de la spec, puis le code avec **ADR-034** et les dix contrôles ; H6 ensuite,
quand la forme mécanique du tableau sera écrite.

**Mémoires.** `cbacbc35` (2026-10-17 19:08:48 UTC) : la spec H5, ses mesures, ses décisions, ses limites.

## Séance 52 — 2026-10-17 (H5 appliqué : la porte écrit gate.json, le reçu la confronte)

**Objectif.** Appliquer H5, la spec de la Séance 51 : la porte laisse une trace, et le reçu la refuse
absente, étrangère, périmée ou contredite. ADR-034, contrôles 103 à 112.

**Fait.** `run.mjs` (1 460 → **1 636** lignes, 133 → **148** refus). `preflight` gagne `--run` obligatoire
(`exit 2` sans lui), refuse un `gate.json` déjà là et un `--run` qui n'est pas un répertoire, et écrit
`<run>/gate.json` **en dernier**, après tous ses refus : `type`, `cas`, `passe_le` et `passe_le_epoch` (un
seul appel à `date` par `nowStamp()`, epoch en secondes), `repertoire`, `gel{chemin, empreinte,
gele_le_epoch}`, `arbre` (la mesure `gitTree` entière), `texte` ou `null`. Le §5 substitué est dérivé une
seule fois (`texteDuCas`), par la porte et par le reçu. `receipt` lit la porte après les champs et les
chemins, avant le contrôle du fil (ADR-028) : neuf refus, et `porte{chemin, sha256, cas, passe_le,
passe_le_epoch, repertoire, gel_empreinte, gele_le_epoch, arbre, texte_sha256}` au reçu ; `compare` re-hache
la porte citée. Le banc : helper `porte()` (une porte par dossier de run), `--run` sur les acceptations 1, 2,
11, 13, 27 et sur les refus 3 à 10, 12, 28 à 31, dix contrôles neufs (103 à 112). Pages remises à 112
(BANC avec sa ligne de groupe, DEVICE, ARCHITECTURE, EXPLICATION, DASHBOARD, README) ; ADR-034.

**Vérifié.**

| Commande | Résultat |
| --- | --- |
| `bash docs/device/harness/banc-harnais.sh` | **112/112 PASS**, `exit 0`, 0 `FAIL` |
| `node --check docs/device/harness/run.mjs` | `exit 0` |
| `node docs/device/harness/liens.mjs` | `exit 0`, 34 fichiers, **361** liens, **0 mort** |
| contrôle 107, mesuré à la main | le clone `$B/faux-travail` à `HEAD 416ec1f`, commit vide, puis refus « la porte a mesuré HEAD 416ec1f…, le reçu mesure …a été commité pendant le run » |
| contrôle 109 | `porte.sha256` = sha256 du `gate.json`, `porte.gel_empreinte` = `0d9a2180…`, `porte.arbre.head_complet` = `416ec1fa…` |

**Dérives signalées, non corrigées.** L'étude chiffre H5 à « ~20 lignes ». Le code en fait 148 lignes de
diff, la fixture 37 portes et cinq acceptations réécrites : le §10 de la spec l'avait mesuré avant le code.
Aucune autre.

**Rectifications.** Deux, sur mes propres pièces, mesurées avant d'être écrites au §14 de la spec. Le
contrôle 15 ne refuse plus par H3 : la porte, lue plus tôt, nomme le dossier qu'elle a autorisé, et le
contrôle attend cette phrase. Et le contrôle 107, écrit d'abord comme le §9 le décrivait (retoucher
`arbre.head_complet` dans un `gate.json`), **échouait** : retoucher ce champ fait aussi différer l'arbre de la
porte de celui du gel, et le refus de l'arbre tombe avant celui du HEAD (mesuré, 111/112). Il déplace
désormais un vrai HEAD dans le clone du banc, avec un gel copié qui le nomme « travail ».

**OPEN.** La porte est forgeable : recopier l'empreinte du gel, l'arbre et un instant plausible produit un
fichier que le reçu accepte. L'ordre porte / session n'est pas mesuré. Le commit du contrôle 107 n'a pas lieu
dans l'arbre gelé, donc ce cas n'est pas éprouvé là où il compte. Aucune session réelle. **Rien n'est
commité.**

**Prochaines étapes.** H6 quand la forme mécanique du tableau sera écrite, puis un second run réel, qui sera
le premier à porter une porte.

**Mémoires.** `1a6bc039` (2026-10-17 19:29:34 UTC) : la porte et ses champs, les neuf refus du reçu, les dix
contrôles, les deux écarts, les limites.

## Séance 53 — 2026-10-18 (les trois chapitres minimaux du guide, écrits et éprouvés)

**Objectif.** Écrire la « plus petite version livrable » que le plan du guide annonçait (sa section 10) :
trois chapitres, lire un reçu, rejouer un gel, provoquer trois refus, chacun avec un geste copiable, une
sortie **observée** et un refus provoqué. Puis consigner.

**Fait.** Le guide naît au dépôt : `docs/guide/guide-du-test-de-bout-en-bout.md`, né à `06:55:09` (`stat -c %w`),
**256 lignes, 1 927 mots**, frontmatter `type: guide`, `status: in-progress` (253 et 1 886 avant la dernière
retouche du 2026-10-18 : l'avertissement d'en-tête, qui disait « rien ne s'exécute dans les quatre arbres »,
taisait le lien symbolique que le banc écrit puis retire dans l'espace de travail du cas). Son `§0` lit `CAS`, `W` et
`FRAMEWORK` dans le gel (un `eval` sur un `node -e`, aucun chemin retapé). Le chapitre 1 lit un reçu écrit
par le banc, dit que c'est la seule source de reçu aujourd'hui, affiche six champs, propose quatre
affirmations dont une fausse et provoque `receipt : … existe déjà`. Le chapitre 2 rejoue le gel par la
formule du §1.1 de la conduite, puis le casse d'un octet dans un clone jetable. Le chapitre 3 provoque les
trois refus annoncés par le plan, sans session : un dossier hors du gel, `--run` absent (`exit 2`), et un
dossier de run sans `gate.json`. Ses
sections 4 et 5 nomment ce que la version ne fait pas et où sont les sources. Le plan est corrigé sur deux
points (sa section 12 : le guide n'est plus « pas écrit », et « le seul reçu réel » était faux) et sa
section 14 dit désormais ce qu'un reçu réel changerait. `DASHBOARD.md` porte la ligne du guide, `README.md`
l'entrée de lecture, et cette séance.

**Vérifié.**

| Commande | Résultat |
| --- | --- |
| `bash docs/device/harness/banc-harnais.sh` | **112/112 PASS**, `exit 0`, jetable `/tmp/banc-harnais.Enruf8` puis `/tmp/banc-harnais.VfwR1H` |
| `node docs/device/harness/liens.mjs` | `exit 0`, 35 fichiers, **377** liens, **0 mort** |
| `§0`, `eval` sur le gel | trois chemins, sortie recopiée au guide (`CAS`, `W`, `FRAMEWORK`) |
| ch.1, lecture du reçu de banc (2026-10-18, `B=/tmp/banc-harnais.VfwR1H`) | six champs, `exit 0`, `porte.passe_le` `2026-10-18T06:55:35…` |
| ch.1, seconde écriture du même reçu | `exit 1`, « un reçu reconstruit est un témoignage, jamais un reçu (§6) » |
| ch.2, formule du §1.1 | **11 `True`** et `empreinte True`, `exit 0` |
| ch.2, octet de plus dans un clone jetable (`/tmp/g-53/depot`) | `exit 1`, « le demande a changé depuis le gel — `a202f033` au disque, `5aac04fb` gelé » ; formule hors clone : `True` de nouveau |
| ch.3, dossier hors du gel | `exit 1` |
| ch.3, `--run` absent | `exit 2`, « USAGE — --run requis » |
| ch.3, dossier de run sans porte | `exit 1`, « aucune porte … ne distingue plus un run qui a passé preflight d'un run qui l'a sauté (H5) » |
| les commandes du guide, rejouées d'un bloc après écriture | codes `0/1/0/1/2/1`, sorties conformes aux blocs cités |
| `git commit` des six fichiers du guide et de sa consignation | `db61c44`, 30 lignes de message, arbre propre, `origin` non touché |
| `preflight --run` sur le dossier du second run | `exit 0`, `docs/device/runs/2026-10-18-070251-4c39e5c5-db61c44/gate.json` : huit champs, `gel 0d9a2180`, `arbre 416ec1f` `porcelain []`, `texte 832036f7` (254 o) |
| les quatre arbres après la porte | inchangés : `framework` `fe48de12` 2 lignes, `audio-sync-tool` `416ec1f` 1 ligne, `framework-origin` `4c39e5c5` 0, copie `416ec1f` 0 |

**Dérives signalées, non corrigées.** Le refus du harnais dit « **le** demande a changé depuis le gel » :
faute d'accord dans `run.mjs` (ligne ~409), recopiée telle quelle au guide et nommée ici, pas réparée. Le
`README.md` §État est resté au 2026-10-16 et annonce « 50/50 PASS » quand le banc est à 112 : le tableau de
bord fait foi, la phrase n'est pas retouchée. Et le plan garde ses décisions ouvertes (lecteur, foyer, un
fichier ou sept pages, cas jouet) tandis que le guide est écrit en un fichier sous `docs/`, ce qui tranche
le foyer **en pratique** sans que le plan le dise.

**Rectifications.** Le message du commit `db61c44` est parti tronqué à sa seizième ligne, un héritage mal
fermé ayant coupé le texte ; `git commit --amend -F` l'a réécrit en entier (30 lignes), et c'est ce hash
que le nom du dossier de run cite. La Séance 52 finissait par « Rien n'est commité » : faux depuis `a60f2e5`, et `4f86fbd`
et `84be78f` le précédaient. Le plan du guide affirmait, section 12, que le premier run était « le seul reçu
réel, et le seul sans porte » : **aucun `receipt.json` ni `output.json` n'existe**, mesuré ce jour par
`find . -name receipt.json -o -name output.json` (0 ligne) ; le dossier `2026-10-15-171559-…` porte
`faits.json`, `PV.md`, `ECART.md`, une trace partielle et trois fichiers de refus. Corrigé dans le plan, et
le guide le dit avant son premier chapitre.

**Et la porte du second run est passée.** Après le commit `db61c44`, qui rend au dispositif un arbre propre
(le nom d'un run cite une révision, et une révision ne couvre que du commité), le dossier
`docs/device/runs/2026-10-18-070251-4c39e5c5-db61c44` a été créé et `preflight --run` y a écrit le
**premier `gate.json` réel du projet**, à `07:02:51` : c'est la première porte d'un vrai run, et son
instant précède le premier message puisqu'aucun fil n'est encore ouvert. Le second run est ouvert ; il
n'attend plus que la session.

**OPEN.** Le chapitre 1 lit un reçu de **banc** : sa session est une fixture (`identifiant "banc"`,
`modele "aucun"`), donc le guide atteste une forme, pas un run. Aucun lecteur n'a suivi la page, donc les
seuils du plan restent des hypothèses. Le guide de `docs/` n'est pas un guide hors dépôt : la question du
foyer reste posée. **Rien n'est commité.**

**Prochaines étapes.** Le second run : ouvrir un fil neuf, vide et direct, dans le projet
`terrain-38d8d3f1`, coller le §1 de `kit-ouverture.md`, répondre au plus par les deux réponses figées
(§2.2 de la conduite), puis clore en cinq commandes à la main, `last-message.md` écrit entre `collect` et
`receipt` (choix de l'opérateur, ce jour), pour que la pièce soit attestée. Viendront ensuite les
chapitres 1 et 4 à 7 du plan, la forme mécanique du tableau (H6) et le cas jouet.

**Mémoires.** `c0a251e5` (2026-10-18 04:56:18 UTC) : le guide, ses trois chapitres, ses sorties observées,
ses limites.

## Séance 54 — 2026-10-18 (l'orchestrateur interactif : « test ça », et le second run resté sans session)

**Objectif.** Répondre à une demande de conception : qu'une personne qui ne connaît pas ce dépôt dise
« test ça » et qu'un orchestrateur interactif la conduise jusqu'à un verdict, en expliquant chaque geste.
Brainstorm puis spec, dans cet ordre, et aucun code avant approbation.

**Fait.** Deux pièces écrites. Le [brainstorm](brainstorm/2026-10-18-070921-orchestrateur-interactif-du-test.md)
(166 lignes, né à `07:09:21`) : la promesse en une phrase, les trois formes possibles de l'orchestrateur et
la préférence pour un couple page + commande, le partage non négociable entre la machine et les trois
gestes humains (mesurés : aucune interface de ligne de commande n'ouvre un fil, la base du client est la
seule source de la trace), la fabrique de cas et son mur (l'attendu d'un skill ne se dérive pas), le contrat
de narration en six lignes, cinq falsificateurs de l'orchestrateur (O1 à O5), et les décisions ouvertes. La
[spec](tasks/2026_10/2026-10-18-070820-orchestrateur-interactif-du-test/2026-10-18-071018-spec.md)
(201 lignes, née à `07:10:18`, `status: pending`) : cinq critères d'acceptation falsifiables, le
déclencheur et la ligne d'`AGENTS.md` à écrire, cinq sous-commandes (`cas`, `porte`, `suite`, `fin`,
`lire`) avec leurs options exactes et leurs codes de sortie, ce que chacune écrit et ne touche jamais, les
quatre formes de bloc de narration, les gabarits de la demande et du squelette d'attendu, douze refus, dix
contrôles de banc à partir du 113, trois ADR à écrire, quatre décisions qui précèdent le code, et trois
phases dont la première marche sur le cas existant.

**Vérifié.**

| Commande | Résultat |
| --- | --- |
| `stat -c %w` sur les deux pièces | `07:09:21` et `07:10:18` ; les préfixes portaient `070840` et `070940`, donc deux renommages, et la ligne « né à » de chaque page porte l'instant mesuré |
| `node docs/device/harness/liens.mjs`, premier passage | **3 liens morts**, tous dans la spec : deux chemins relatifs qui comptaient un niveau de trop vers le brainstorm, et un `AGENTS.md` à trois remontées au lieu de quatre |
| `node docs/device/harness/liens.mjs`, après réparation | `exit 0`, 37 fichiers, **392** liens, **0 mort** |
| l'état du second run, mesuré | `threads` = **0** dans chaque base du client (`~/.config/freebuff-desktop/projects/*/desktop-v2.db`) ; le dossier `docs/device/runs/2026-10-18-070251-4c39e5c5-db61c44` porte sa porte, sans session |

**Dérives signalées, non corrigées.** Aucune sur ces deux pages.

**Rectifications.** La demande à laquelle cette séance répond était : « Le fil est ouvert et le texte
collé : clore le second run ». **La mesure la contredit** : aucun fil n'a été créé, dans aucune base du
client, sur aucun projet, et aucune session n'a donc reçu la demande. Rien n'a été clos, et la porte du
second run reste ouverte sans session. C'est écrit ici plutôt que d'écrire un reçu pour un run qui n'a pas
eu lieu.

**OPEN.** Rien n'est codé : la spec attend l'approbation, et quatre décisions la précèdent (foyer du
runbook, ligne d'`AGENTS.md`, terrain par défaut, lecteur visé). La fabrique de cas reste un squelette :
l'attendu d'un skill ne se dérive pas, la spec le dit et plafonne le verdict en conséquence. La forme
mécanique du tableau (H6) n'est toujours pas écrite. Le second run attend sa session. **Rien n'est
commité.**

**Prochaines étapes.** Approbation de la spec et de ses quatre décisions, puis **P1** : `porte`, `suite`,
`fin`, `lire` sur le cas existant, éprouvés par le second run lui-même ; **P2** : la fabrique de cas
(`cas`) ; **P3** : le runbook et la ligne d'`AGENTS.md`.

**Mémoires.** `5ca2cb65` (2026-10-18 05:11:38 UTC) : la demande, les deux pièces, leurs mesures, les
décisions ouvertes et l'état mesuré du second run.

## Séance 55 — 2026-10-18 (H6 appliqué : le tableau a une forme, et F1 et F2 la lisent)

**Objectif.** Trancher H6, la dernière zone d'ombre de l'[étude antagoniste](brainstorm/2026-10-17-135619-etude-antagoniste-du-protocole.md)
§6 : « « le tableau » n'est pas une forme ». F1 et F2 parlaient du message qui porte le tableau, et aucune
définition mécanique n'existait : écrire la forme, l'instant, les refus et les limites, et les rendre
mesurables par le banc.

**Fait.** La [spec H6](tasks/2026_10/2026-10-17-140536-durcissement-du-recu/2026-10-18-071627-spec-h6.md)
(159 lignes, `status: done`) et l'[ADR-035](DECISIONS.md). Dans `run.mjs` : `tableauDeTrace` et `cellulesDe`
(1027-1042), `FORME_TABLEAU` et `MOTS_ECRITURE` ; l'export gagne `outil` et `chemin_outil` (`requeteExport`,
844-851) ; `receipt.json` gagne `tableau{forme, present, seq, ts, lignes, colonnes}`, trois falsificateurs
(`tableau_absent`, `ecriture_avant_tableau`, `produit_ne_avant_le_tableau`), trois refus et deux limites.
Dans le banc, six contrôles (113 à 118) et cinq fils fixtures. Pages remises : la conduite §1.5 et la chaîne
de la liste de contrôle (nouvelle requête d'export), [BANC](device/BANC.md) (118 contrôles), [DEVICE](device/DEVICE.md),
[ARCHITECTURE](ARCHITECTURE.md) (la ligne de `receipt`, F1 et F2), [EXPLICATION](EXPLICATION.md),
[README](../README.md), le [guide](guide/guide-du-test-de-bout-en-bout.md) (sortie observée refaite, sept champs),
le [tableau de bord](DASHBOARD.md), et la spec de l'orchestrateur (ADR 036 à 038, contrôles à partir de 119).

**Vérifié.**

| Commande | Résultat |
| --- | --- |
| `bash docs/device/harness/banc-harnais.sh` | **118/118 PASS**, `exit 0`, 0 `FAIL`, jetable `/tmp/banc-harnais.icCmQG` |
| la sonde du faux positif | `sed "s/ && p.chemin_outil !== null//"` sur `run.mjs`, puis `receipt` sur le fil du contrôle 118 : refus `une écriture précède le tableau : seq 2, outil « write_todos » (§5, F2)`, `exit 1` ; le harnais de sonde a été retiré |
| la base du client | clés d'un `tool` : `kind,id,toolName,input,status,output,exitCode` ; `write_file` et `str_replace` portent `input.path`, `write_todos` `input.todos`, `run_terminal_command` `command` |
| `node docs/device/harness/liens.mjs` | 38 fichiers, **415** liens, **0 mort**, `exit 0` (401 avant cette séance : c'est ce texte qui en ajoute, et le contrôle 61 du banc tient le dépôt à zéro) |
| `node --check run.mjs`, `bash -n banc-harnais.sh` | ok |
| le second run, mesuré | projet `terrain-38d8d3f1` : **0** fil ; la porte du 2026-10-18 reste ouverte sans session |
| `git status --porcelain` | 13 fichiers modifiés, 4 non suivis (le brainstorm et la spec de l'orchestrateur, la spec H6, le dossier de run) ; rien n'est commité |

**Dérives signalées, non corrigées.** Le [README](../README.md) §« Au 2026-10-16 » annonce « 50/50 PASS » et
le haut de page donne `run.mjs` à 1 636 lignes (1 742 au 2026-10-18) : relevés de leur moment, la phrase
renvoie au tableau de bord pour l'état courant, et la dérive reste nommée sans être retouchée (déjà signalée
en Séance 53). Le `--help` et le refus de `collect` gardent « le demande a changé » (Séance 53).

**Rectifications.** La spec de l'orchestrateur a été renumérotée dans ce geste : ses ADR passent de 035 à
038 à 036 à 038, ses contrôles de banc partent de 119 au lieu de 113, et elle passe de 201 à 205 lignes ;
sa ligne du tableau de bord porte les deux chiffres. La Séance 54 listait encore « la forme mécanique du
tableau (H6) » parmi ce qui reste : c'est fait. La première écriture de H6 déclarait une famille de mots et rien d'autre, et la mesure l'a
contredite : `write_todos` porte `write` sans écrire un fichier, donc la règle exige aussi un chemin nommé
(`input.path`), la sonde est au tableau ci-dessus, et le contrôle 118 éprouve l'exclusion (aucune écriture
comptée, deux limites dites). La spec a été renommée `2026-10-18-071627-spec-h6.md` : son premier préfixe
portait `07:15:55`, relevé avant l'écriture, quand `stat -c %w` donne `07:16:27`, et l'écart reste nommé
en tête de page.

**OPEN.** Aucune session réelle n'a rendu de tableau devant ce harnais : les six contrôles sont des fixtures,
donc F1 et F2 sont lus, pas exercés par un run. Le cas gelé n'est pas retouché. La forme ne voit pas une
écriture faite en ligne de commande ; un tableau rendu en `reasoning` ne compte pas, à dessein ; un outil qui
écrit par un autre champ que `path` échappe à la mesure, et le reçu le dit en limite quand son nom évoque une
écriture. Le guide n'est toujours pas mesuré par un lecteur. **Rien n'est commité.**

**Prochaines étapes.** Le second run, toujours sans session : ouvrir un fil neuf dans `terrain-38d8d3f1`,
coller le §1 de `kit-ouverture.md`, puis clore avec la requête d'export de la conduite §1.5, celle du jour.
Ensuite la spec de l'orchestrateur (P1 : `porte`, `suite`, `fin`, `lire` sur le cas existant) ou la fabrique
de cas (P2).

**Mémoires.** `db0aa214` (2026-10-18 05:38:41 UTC) : la forme, l'acte d'écriture et sa mesure, l'export, le
reçu, le banc et l'état du second run, puis la suite (commits et porte neuve) dans la même mémoire.

## Séance 55 (suite) — 2026-10-18 (H6 commité, et la porte neuve du second run)

**Objectif.** Fermer le second run : ouvrir un fil neuf, coller la demande, conduire `collect`, `faits`,
`receipt`, `compare`. Le premier geste n'appartient à aucune machine : mesure faite, **0 fil** dans le projet
`terrain-38d8d3f1` et aucun fil d'aucune base ne porte `<W>/terrain`, donc rien n'a été ouvert et aucun reçu
n'a été écrit.

**Décision, avant le geste humain.** Commiter H6 d'abord, puis passer une porte neuve sur la révision propre,
plutôt que clore dans le dossier du `07:02:51` : le nom d'un run cite une révision, et une révision ne
couvre que du commité.

**Fait.** Deux commits : `7e05b9c` (la spec de l'orchestrateur, son brainstorm, la Séance 54, et le premier
`gate.json` réel du projet gardé comme trace d'un passage) et `dbd85ba` (H6 : la forme, l'ADR-035, la spec,
le banc à 118, les pages remises, cette Séance 55). Puis la **porte neuve** :
`docs/device/runs/2026-10-18-075625-4c39e5c5-dbd85ba/`, passée à `07:56:25` (`exit 0`), gel `0d9a2180`,
arbre `travail` `416ec1fa`, `porcelain` vide, texte `832036f7` (254 o), révision du dispositif `dbd85ba`.
Et le kit d'ouverture, hors du dépôt, reçoit la requête d'export neuve : `outil` et `chemin_outil`,
**374 caractères, 0 différence** avec la commande que `faits` écrit pour le même fil (comparée à la fixture
`f113.json` du banc).

**Vérifié**, sur l'arbre commité, avant la porte :

| Commande | Résultat |
| --- | --- |
| `bash docs/device/harness/banc-harnais.sh` | **118/118 PASS**, `exit 0`, 0 `FAIL` |
| `node docs/device/harness/liens.mjs` | 38 fichiers, **415** liens, **0 mort**, `exit 0` |
| `node --check docs/device/harness/run.mjs` | `exit 0` |
| `git status --porcelain`, après les deux commits | 0 ligne, puis une seule non suivie : le dossier de la porte neuve |

**OPEN.** Aucun fil, donc aucune session : le run n'existe toujours pas, et le second reçu réel reste à
écrire. Le dossier de la porte neuve n'est pas encore commité : il le sera avec le reçu, quand le run
existera. Rien n'est poussé.

**Prochaines étapes.** Les trois gestes humains : ouvrir un fil neuf, vide, en mode direct, avec la racine de
projet posée sur `<W>/terrain` ; y coller le §1 de `kit-ouverture.md` (254 o, `sha256 832036f7…`), rien
autour ; répondre seulement par une des deux phrases figées du §2. Ensuite la chaîne : export du §3.6
(requête neuve), puis `faits`, `collect`, `receipt`, `compare` avec les cinq faits humains.

## Séance 56 — 2026-10-18 (le chapitre du tableau entre dans le guide, et le contrôle 113 mesure l'absence de morsure)

**Objectif.** La demande : ajouter au guide le chapitre manquant sur le tableau, comment lire son reçu et
comment provoquer un refus par tableau absent. Le plan le portait comme non écrit (ses sections 10 et 14).

**Fait.** Le guide gagne un chapitre 4, *Lire un tableau, et le faire manquer* : le geste relit `tableau`,
les trois falsificateurs et les limites du reçu de `r113` ; la sortie observée dit quatre lignes, trois
colonnes, `seq 3`, `ts` du message, et l'absence de morsure ; un paragraphe dit ce que `tableau` n'atteste
pas (E4 reste une lecture humaine) et une honnêteté dit que ce positif est **arrangé** (le manifeste de
`r113` est rédigé après coup, la copie sous `raw/` ne bouge pas) ; le refus provoqué demande `conforme` à
`r114` et nomme tout ce qui mord ; un paragraphe dit ce que le champ ne voit pas (`write_todos`, un outil
sans nom, les deux limites de 118) et que la trace reste forgeable ([ADR-035](DECISIONS.md)). Les sections
suivantes deviennent 5 et 6, et le frontmatter, l'intro, les avertissements, le §0 et la table des sources
suivent. `wc` : **355 lignes, 2 986 mots** (265 lignes avant le chapitre ; 354 lignes et 2 961 mots à sa
première rédaction, deux phrases ajoutées ensuite : le rejeu et l'extension du contrôle 113 aux deux
falsificateurs).

Et le **contrôle 113** est renforcé, ce que la Séance 55 avait laissé en chantier : le `birth` enregistré
dans le manifeste de `r113` est reculé de dix secondes **après** le tableau, et l'assertion exige
`ecriture_avant_tableau` et `produit_ne_avant_le_tableau` **vides**. Sans ce renfort, 113 acceptait un
positif dont F1 et la condition 1 mordaient : il ne mesurait rien de l'ordre, seulement la lecture du
tableau. `BANC.md` suit (la ligne 113 à 118) et la spec H6 ne bouge pas, son §5 ne promettant pas ce
détail.

**Vérifié.**

| Commande | Résultat |
| --- | --- |
| `bash docs/device/harness/banc-harnais.sh` | **118/118 PASS**, `exit 0`, sur `/tmp/banc-harnais.rtzngO`, puis **118/118 PASS**, `exit 0` après les écritures |
| `node docs/device/harness/liens.mjs` | 38 fichiers, **418** liens, **0 mort**, `exit 0` |
| le geste du chapitre 4, rejoué sur un autre banc neuf (`/tmp/banc-harnais.rn7i2z`) | `diff` entre le bloc cité par le guide et la sortie rejouée : **`0`**, `410` octets des deux côtés |
| `receipt --verdict conforme` sur `r114` à `r117` | `exit 1` les quatre : F2 muette pour `r114` et `r115` (même phrase), F2 `seq 2, outil « write_file »` pour `r116`, F1 `README.md` pour `r117` |
| les quatre avec `--verdict "non concluant"` | `exit 0`, reçus écrits, morsures gardées (`tableau_absent: true` pour `r115`, l'écriture pour `r116`, le produit pour `r117`) |
| le falsificateur du renfort 113 | `birth` remis avant le tableau, reçu supprimé puis réécrit : l'assertion sort **`1`**, `produit_ne_avant_le_tableau: ["README.md"]` |

**Rectifications.** Une première sonde du renfort a rendu `0` pour la mauvaise raison : le reçu existait
déjà (`REFUS — receipt : … existe déjà — un reçu reconstruit est un témoignage, jamais un reçu (§6)`),
donc l'assertion relisait **l'ancien** reçu, et des millisecondes données pour des secondes avaient écrit un
`birth` à `+058759-04-30`. L'une et l'autre réparées, la sonde sort `1` sur la morsure. La sortie citée par
le chapitre 4 vient **d'avant** ces sondes, sur le même banc jetable.

**Poussée, sur demande.** `git push origin main` (`exit 0`) : `84be78f..df59482  main -> main`, les **six**
commits d'avance publiés. Vérifié contre le distant : `git ls-remote origin main` →
`df59482bf68228872d184f1579a1dd13dabe82bd refs/heads/main`, `git fetch` puis
`git rev-list --count origin/main..main` → **0**, `git rev-parse main origin/main` → même sha, et
`git merge-base --is-ancestor` → les six (`4f86fbd`, `a60f2e5`, `db61c44`, `7e05b9c`, `dbd85ba`, `df59482`)
atteignables depuis `origin/main`. Contrôle qui manquait à une simple lecture de référence : le distant est
**cloné** dans `/tmp/aidd-clone-verify`, `HEAD` y vaut `df59482bf68228872d184f1579a1dd13dabe82bd`, les six y
sont atteignables, et le banc du clone sort **118/118 PASS**, `exit 0`. Cette séance-ci n'est pas dans la
poussée : guide, banc, journal, tableau de bord et plan restent **dans l'arbre de travail** (six fichiers
modifiés, plus le dossier de la porte neuve, non suivi).

**OPEN.** Aucun fil, donc aucun reçu réel, et le dossier de la porte neuve reste non commité.

**Prochaines étapes.** Le quatrième chapitre ferme la liste du plan qui ne demandait ni session ni décision :
restent les quatre arbres, la session et sa trace, mener un run entier (chacun après le second run), le cas
jouet et la mesure du lecteur. Et toujours les trois gestes humains du run.

**Mémoires.** `c0a251e5` (2026-10-18 06:14:46 UTC, mise à jour de la mémoire du guide) : le chapitre 4 et ses
sorties, le renfort du contrôle 113 et son falsificateur, les chiffres vérifiés (banc 118/118, liens 420/0,
`diff` 0) et les limites qui restent.

## Séance 57 — 2026-10-18 (le cas jouet : brainstorm, spec, et la nature qu'il prend)

**Objectif.** La demande : « Écrire un cas jouet (demande minuscule, attendu, gel) dans
`docs/device/CASES/`, assez petit pour tenir dans une page, et l'ajouter au banc comme fixture de bout en
bout. » **Rien n'est appliqué dans cette séance** : la règle du dépôt veut une spec écrite et approuvée
avant la production, et la ligne 3 de la section 14 du plan du guide se ferme ici.

**Fait.** Le [brainstorm](brainstorm/2026-10-18-082629-cas-jouet-et-fixture-de-bout-en-bout.md) : ce que la
demande a de neuf (la première fois qu'un cas **entier** traverserait la chaîne sans session), ce que le
dispositif impose déjà, les trois formes d'arbres comparées, deux formes d'attendu, ce que la fixture
éprouverait, ce qui reste dehors, et ce qui n'a pas été mesuré. Puis la
[spec](tasks/2026_10/2026-10-18-082917-cas-jouet-et-fixture-de-bout-en-bout/2026-10-18-082917-spec-cas-jouet.md),
`status: pending` : douze contrôles (**119 à 130**), six critères d'acceptation, trois phases, et l'ADR-036
réservé — la spec de l'orchestrateur, elle aussi `pending`, se décalera en **037 à 039** comme elle l'avait
fait pour laisser 035 à H6.

**Mesuré, avant d'écrire.** Une sonde jetable (`/tmp/sonde-jouet.sh`, aucune écriture dans le dépôt) : deux
dépôts jouets de deux fichiers, dates et signatures figées, deux copies sous une racine déclarée, les deux
fichiers du cas recopiés → `freeze` **`exit 0`**, empreinte `cba74210`, `references 0`, et sur les deux
origines `remotes 0` et `refs_distants []` : un arbre publié nulle part est accepté, et le gel le dit. Ce
que la sonde n'a **pas** éprouvé : `preflight`, `collect`, `faits`, `receipt` et `compare` sur un gel sans
référence — c'est la phase P0 de la spec.

**Décisions de l'utilisateur**, prises en séance sur les deux questions qui changeaient le reste : **A**
(arbres jouets reconstruits par un script compagnon à dates figées, rejouables hors ligne d'un clone) et
**la promesse en miniature** (budget **2** échanges, un tableau rendu, un fichier écrit après la réponse
figée ; falsificateurs F1, F2, F3, F5 et F8).

**Vérifié.** `node docs/device/harness/liens.mjs` → 40 fichiers, **431** liens, **0** mort, `exit 0` (427
avant les retouches du journal et du tableau de bord de cette séance) ;
`stat -c %w` sur les deux pièces : brainstorm né à **08:26:52** (nom `082629`), spec née à **08:29:54** (nom
`082917`) — les écarts de 23 et 37 secondes restent nommés, jamais lissés ; `wc -l` : 114 et 122 lignes.

**OPEN.** Rien n'est appliqué : aucun fichier dans `CASES/`, aucun contrôle 119 (le banc reste à 118/118),
aucun ADR-036. La chaîne sur un gel **sans référence** n'est pas éprouvée. Rien n'est commité depuis
`df59482`.

**Prochaines étapes.** L'approbation de la spec (ou sa correction), puis P0 (la chaîne sans référence),
puis P1 : le script compagnon, les trois fichiers, le gel, l'ADR-036, les contrôles 119 à 130 et les pages.

**Mémoires.** `86ac6247` (2026-10-18 06:31:06 UTC) : le cas jouet, ses deux décisions, la sonde et son
`exit 0`, la spec `pending` et ce qu'elle refuse de promettre.

## Séance 58 — 2026-10-18 (la clôture du second run, répétée à blanc jusqu'au reçu et au jugement)

**Objectif.** La demande : « Répète la clôture du second run à blanc sur une copie jetable, avec un fil
factice, jusqu'à un receipt et un output non nuls. »

**Fait.** Un bac jetable (`/tmp/repetition-cloture-2026-10-18-v3`, script hors dépôt, rien écrit ailleurs) :
un **clone** du dépôt (`df59482`, état commité), les deux copies du cas clonées de l'espace réel et
détachées à `416ec1f` et `4c39e5c5`, un **re-gel** dans le bac qui rend la **même empreinte `0d9a2180`**, la
porte passée avec `--texte` (le §5 substitué, 255 octets sur cette racine), un **fil factice** dans une base
de client fabriquée (message `user` = le texte remis, message `assistant` = un tableau de quatre lignes à
séparatrice, message `assistant` = un `tool` `write_file`), puis un **produit** de sept fichiers écrit dans
la copie de travail, comme une session l'aurait fait. La chaîne entière : `freeze`, `preflight`, la trace par
la commande que `faits` écrit, `faits`, `collect`, `last-message.md`, `receipt`, `compare` — **huit gestes,
`exit 0` chacun**. Le rapport :
[répétition à blanc de la clôture](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-18-083743-repetition-a-blanc-de-la-cloture.md)
(92 lignes, né à **08:38:09**, nom `083743`, écart de 26 s nommé).

**Résultat.** `receipt ok — verdict conforme ; produit 7 fichier(s) ; 0 limite(s)` et `compare ok — verdict
conforme, limites « ne mord pas »`. Les deux pièces **non nulles** : `receipt.json` **13 037 octets, 25
clés** ; `output.json` **3 393 octets, 11 clés**. Les sept falsificateurs sont **muets**
(`arbre_de_travail_inchange: false`, donc la condition 3 satisfaite ; `tableau.present: true`, `seq 2`, 4
lignes, 3 colonnes ; `ecriture_avant_tableau` et `produit_ne_avant_le_tableau` vides) ; `echanges` =
`{budget: 3, utilises: 1, epuise_par: null}` ; `trace_lue` = 3 lignes, **3 échanges dans la fenêtre**,
`sha256` cité et rejoué ; `porte.texte_sha256` écrit.

**Trois trouvailles.** (1) Le reçu **dit** au lieu de trancher quand le gel et le produit naissent dans la
même seconde : première passe, une limite « naissance à une seconde du gel (résolution du birth) » ; deux
secondes d'écart et elle disparaît. (2) `preflight --texte` compare les **octets** : un saut de ligne final
de trop fait refuser (256 reçus contre 255 attendus) — la
[liste de contrôle](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-17-095643-liste-de-controle-ouverture-second-run.md)
§4.0 gagne la ligne, le fichier s'écrit sans saut de ligne final et sa longueur se relève au gel. (3) Une
base dont les `parts_json` sont des objets au lieu de tableaux fait échouer l'export sur `Error: stepping,
malformed JSON`, puis le reçu refuse le rejeu (H2) : le refus est juste, l'erreur de la base n'est pas nommée.

**Vérifié.** Les huit gestes en `exit 0` ; les pièces non nulles et leurs clés ; les arbres réels inchangés —
le dépôt porte les **neuf** lignes de l'arbre de travail de la Séance 56, `framework` et `audio-sync-tool`
leurs deux lignes connues ; le bac vit entièrement sous `/tmp`, copies du bac comprises (terrain :
`?? aidd_docs/`, son produit).

**OPEN.** Rien du client : aucune session, aucun fil réel, le mode direct et la racine de projet posée ne
sont pas éprouvés, et la recherche de la base sous `~/.config/freebuff-desktop/` non plus (la base du bac
est passée à `faits` par `--base`). Le verdict `conforme` est **écrit par nous**, sur un produit fabriqué
pour correspondre : la répétition prouve que la chaîne l'accepte, pas qu'un vrai run le mérite. Le contrôle
de clôture des quatre arbres (ADR-021, 0 → 0) n'est pas mesuré, faute d'un run.

**Prochaines étapes.** Le vrai geste humain (ouvrir le fil, coller le texte, répondre), puis la chaîne de la
liste de contrôle.

**Mémoires.** `3cb3493b` (2026-10-18 06:40:05 UTC) : la clôture répétée, ses codes, ses deux pièces non
nulles, ses trois trouvailles et ce qu'elle ne prouve pas.

## Séance 59 — 2026-10-18 (la clôture rejouée sur un bac neuf, et le reçu identique)

**Objectif.** La même demande, reformulée : « Répète la clôture du second run à blanc sur une copie jetable,
avec un fil factice, jusqu'à un receipt et un output non nuls. » La Séance 58 l'avait faite ; ce tour la
**rejoue** sur un bac neuf, sans changer le script, pour mesurer une chose que la première passe ne pouvait
pas dire : la chaîne rend-elle le même reçu quand rien ne change, hors ce qui est volatil ?

**Fait.** Bac neuf `/tmp/repetition-cloture-2026-10-18-v4`, script `/tmp/cloture-banc.sh` **inchangé** (même
fichier de 9 244 octets, daté du 18 à 08:37), et la même chaîne : clone du dépôt (`df59482`), les deux copies
du cas détachées à `416ec1f` et `4c39e5c5`, re-gel `--refreeze --racine <bac>`, porte avec `--texte`, fil
factice de trois messages dans une base fabriquée, produit de sept fichiers, puis `freeze`, `preflight`,
l'export par la commande que `faits` écrit, `faits`, `collect`, `last-message.md`, `receipt`, `compare` —
**huit gestes, `exit 0` chacun, du premier coup**. Run :
`/tmp/repetition-cloture-2026-10-18-v4/runs/2026-10-18-cloture-4c39e5c5-df59482`.

**Résultat.** Le re-gel rend **la même empreinte `0d9a2180`** (2 fichiers du cas, 8 références, 4 arbres) ; la
porte accepte le texte substitué (`0f5baa20`, **255 octets**), sa propre empreinte est `2073c697` ; la trace
exportée fait **3 lignes**, `sha256` `d3dcc8c9…`, **3 échanges dans la fenêtre**, 0 sans horodatage, 0
illisible. `receipt ok — verdict conforme ; produit 7 fichier(s) ; 0 limite(s)` ; `compare ok — verdict
conforme, limites « ne mord pas »`. Les pièces : `receipt.json` **13 037 octets, 25 clés** (`sha256`
`776737c4…`), `output.json` **3 393 octets, 11 clés** (`sha256` `5fae01fc…`), 7 attendus écartés. Les sept
falsificateurs sont muets, à l'identique de la Séance 58 : `arbre_de_travail_inchange: false`,
`tableau.present: true` (`seq 2`, 4 lignes, 3 colonnes), `ecriture_avant_tableau`,
`produit_ne_avant_le_tableau`, `birth_anterieur_au_gel` et `produit_identique_a_une_empreinte_anterieure`
vides, `trace_sans_echange_dans_la_fenetre: false` ; `echanges` = `{budget: 3, utilises: 1, epuise_par:
null}`.

**Vérifié.** Les huit codes de sortie ; les tailles et les clés des deux pièces ; **le reçu est identique à
celui de la Séance 58** une fois neutralisés le chemin du bac, les horodatages, les empreintes et les époques
(`node /tmp/diff-recu.js` sur les deux `receipt.json` → `aucune différence hors bac, horodatages et
empreintes`) — la répétition est donc **déterministe** sur tout ce qui n'est pas du temps ou du lieu. Les
arbres réels n'ont pas bougé : dépôt **11** lignes `porcelain` (**sept** modifications et **quatre** non
suivis — le rapport de la Séance 58, le dossier de la Séance 57, un brainstorm et le `runs/` du 18), `framework`
**2**, `audio-sync-tool` **1**, et le bac vit sous `/tmp`.

**Ce que ce tour n'ajoute pas.** Aucune trouvaille : les trois de la Séance 58 tiennent, et le script les
contourne déjà (le sommeil de deux secondes entre le gel et le produit, le texte sans saut de ligne final, les
`parts_json` en tableaux). Rien n'est commité : le reçu vit sous `/tmp` et n'est pas une pièce du dépôt.

**OPEN.** Identique à la Séance 58 : rien du client, le verdict `conforme` est écrit par nous sur un produit
fabriqué, la clôture des quatre arbres (ADR-021) n'est pas mesurée.

**Prochaines étapes.** Le vrai geste humain, puis la chaîne de la liste de contrôle.

**Mémoires.** `6654281f` : la clôture rejouée sur un bac neuf, les deux pièces aux mêmes octets et le reçu
identique hors bac, horodatages et empreintes.

## Séance 60 — 2026-10-18 (le cas jouet, appliqué : P0, P1, P2, et le banc à 130)

**Objectif.** La demande : « J'approuve la spec du cas jouet : applique P0 puis P1 et P2 (script compagnon,
les trois fichiers dans `CASES/`, le gel, l'ADR-036, les contrôles 119 à 130, les pages), vérifie 130/130 et
la chaîne de bout en bout, et consigne. » Décisions prises en amont (Séance 57) : la spec
[2026-10-18-082917](tasks/2026_10/2026-10-18-082917-cas-jouet-et-fixture-de-bout-en-bout/2026-10-18-082917-spec-cas-jouet.md)
`status: pending` est **approuvée puis appliquée** le jour même, et passe à `done`.

**P0, d'abord — la chaîne sans référence.** Bac jetable `/tmp/p0`, script compagnon brouillon, deux dépôts
jouets de deux fichiers, cas recopié, puis la chaîne entière : `freeze` (`exit 0`, **empreinte `aae663bf`,
zéro référence**, 4 arbres), `preflight` (`exit 0`, texte substitué `94ca8285`, **143 octets**),
l'export du §1.5 (3 lignes), `faits`, `collect` (1 fichier), `receipt --verdict conforme` (`exit 0`, **1
limite** — la naissance à une seconde du gel, la limite connue), `compare` (`exit 0`), `receipt.json`
**7 691 o**, `output.json` **1 250 o**. **Aucun refus imprévu** : la spec n'a pas changé, P0 a coûté une
passe de bac et rien d'autre. Deux accidents corrigés dans le même geste : le script clamait les copies aux
mauvais noms (`framework`, `terrain` au lieu de `framework-origin`, `terrain`), et une cellule du tableau
de la fixture portait une apostrophe qui cassait l'insertion SQL — tous deux vus par la sonde, aucun par
lecture.

**P1 — le cas.** Le chronomètre est pris avant l'écriture (`085308`), et l'écart reste nommé : les naissances
mesurées sont **08:53:37** (`request.md`, 2 475 o), **08:56:44** (`expected.json`, 4 393 o), **08:57:28**
(`-arbres.sh`, 3 181 o), **08:57:47** (le gel, 2 904 o). Les trois pièces :
[demande](device/CASES/2026-10-18-085308-cas-jouet.request.md) (**49 lignes**),
[attendu](device/CASES/2026-10-18-085308-cas-jouet.expected.json) (**48 lignes**, cinq falsificateurs F1,
F2, F3, F5, F8, budget **2**), [script compagnon](device/CASES/2026-10-18-085308-cas-jouet-arbres.sh)
(usage `bash <script> <racine>`), et le gel
[2026-10-18-085308-cas-jouet.freeze.json](device/CASES/2026-10-18-085308-cas-jouet.freeze.json) —
**empreinte `50664060`, zéro référence**, têtes épinglées `1b3b632a…` / `62c48e16…`, `refs_distants` **vide**
sur les deux origines (« publié nulle part »). Les arbres vivent sous
`/home/giak/projects/aidd-device-work/2026-10-18-085308-cas-jouet/` (l'`origine/` et les deux clones). Deux
mesures au passage : **le même script rend les mêmes têtes** dans un bac `/tmp` et sous la racine réelle —
c'est le contrôle 119, et il valait avant le gel ; et la **racine réelle ne contient pas la racine en
clair**, ce que `freeze` exige (le cas nomme `$RACINE`).

**P1 — l'ADR et les contrôles.** Le **falsificateur** : `DECISIONS.md` gagne
[l'ADR-036](DECISIONS.md) — un second cas, jouet, et sa nature (arbres reconstruits par script, publiés
nulle part, cinq falsificateurs aux identifiants du cas réel, budget de deux échanges, et ce qu'il ne
prouve pas). Le banc gagne **douze contrôles, 119 à 130**, groupés sous un commentaire qui dit la chaîne :
119 déterministe (deux bacs, et les têtes du gel committé), 120 refuse un bac peuplé, 121 le gel du bac rend
l'empreinte committée avec zéro référence et `refs_distants` vides, 122 la porte nomme l'arbre « travail »,
123 elle ne s'écrase pas, 124 le produit se collecte sous `raw/`, 125 les faits rendent **seize** valeurs
dérivées du fil, 126 le reçu conclut `conforme` avec tableau présent et falsificateurs muets, 127 refuse en
nommant **F2** (fil sans tableau), 128 refuse en nommant **F1** (produit né avant le tableau), 129 le juge
écrit son `output.json`, 130 les deux pièces tiennent sur une page (≤ 55 + 60 lignes, ≤ 115). Les trois
portes du jouet sont passées **avant** le produit : `preflight` refuse un arbre qui a bougé depuis le gel,
et le produit est exactement ce qui le fait bouger. Le fil de 128 est daté **après le gel du bac** —
sinon la condition 1 du §5 mordrait avec F1 et le refus ne nommerait plus F1 seul.

**P1 — les pages.** [BANC](device/BANC.md) passe à **V0.3** : 130 contrôles, le groupe 119 à 130 décrit, ce
qu'il lit de `CASES/` sans jamais y écrire, et deux limites ajoutées (le jouet se reconstruit, il n'est pas
un run). [REPLAY](device/REPLAY.md) gagne son §7 — le cas jouet, et comment le reconstruire, avec la
commande du script, les têtes, l'empreinte et « publié nulle part ». Le [tableau de bord](DASHBOARD.md)
porte la séance et une ligne de plus pour le cas jouet. La spec de l'[orchestrateur](tasks/2026_10/2026-10-18-070820-orchestrateur-interactif-du-test/2026-10-18-071018-spec.md)
se décale comme elle l'avait prévu : ses trois ADR passent de **036 à 038** à **037 à 039**.

**P2 — la revue.** `bash docs/device/harness/banc-harnais.sh` → **130/130 PASS**, `exit 0`, **du premier
coup** ; les douze nouveaux contrôles s'impriment dans l'ordre, y compris les deux refus qui nomment F2 et
F1. `node docs/device/harness/liens.mjs` → 42 fichiers, **446** liens, **0 mort**, `exit 0`. Les deux pièces du cas réel n'ont pas bougé (naissances du 2026-10-15, gel **`0d9a2180`** intact) :
la condition 6 de la spec tient. Le rejeu du script dans un second bac est le contrôle 119, et le re-gel du
bac à l'empreinte du gel committé est le contrôle 121 : la revue n'a pas de geste à elle.

**Dérives signalées.** (1) La spec nomme `docs/device/DECISIONS.md` : le registre vit à `docs/DECISIONS.md`,
et l'ADR-036 y est écrit — l'écart de chemin est dit dans la spec, jamais corrigé en silence. (2) Deux
commandes d'écriture ont mal tourné dans ce tour : un `cat >>` dont le here-document s'est terminé sur la
fin du fichier a **dupliqué un fragment tronqué de l'ADR-036** dans `DECISIONS.md`, et la même faute a
**tronqué la dernière ligne du §7 de `REPLAY.md`** (« celui quil »). Les deux ont été réparées dans le
même tour (fragment supprimé, ligne rétablie), et les têtes de fichier relues après coup — la leçon est
d'écrire un bloc dans un fichier temporaire et de l'ajouter d'un `cat`, jamais d'imbriquer un here-document
dans une commande déjà citée.

**Ce qui reste ouvert.** Aucune session n'ouvre le cas jouet (budget de deux échanges intact) ; il n'est
publié nulle part par construction ; le `conforme` du contrôle 126 est **écrit par nous** sur une fixture ;
la « lecture du guide en lecteur qui ne connaît pas le dépôt » que la spec annonçait reste une hypothèse —
aucun lecteur n'existe —, et le guide n'est pas retouché, comme la spec §7 le refuse. Rien n'est commité :
les sept modifications et les fichiers neufs attendent le commit du relecteur.

**Prochaines étapes.** Le chapitre du guide qui prend le jouet pour exemple, et le vrai second run, qui
attend toujours son fil.

**Mémoires.** `7f6b17d0` : le cas jouet appliqué — P0 sans refus, les trois pièces et leur gel `50664060`,
l'ADR-036, les contrôles 119 à 130, le banc à 130/130, les deux dérives réparées et ce que le cas ne prouve
pas.
## Séance 60 (suite) — 2026-10-18 (le chapitre du cas jouet dans le guide, éprouvé sur ses propres octets)

**Objectif.** La demande : « Écris dans le guide le chapitre qui prend le cas jouet pour exemple, du texte
remis jusqu'aux deux refus F2 et F1, et fais-le lire par un lecteur qui ne connaît pas le dépôt pour mesurer
ce qui passe. »

**Fait — le chapitre.** Le [guide](guide/guide-du-test-de-bout-en-bout.md) gagne son **chapitre 5**, « Lire le cas
jouet, du texte remis aux deux refus », cinq gestes et cinq blocs de sortie observés : le texte remis (le §5
de la demande, `$RACINE` substitué comme le fait `texteDuCas`), les deux arbres reconstruits par le script
compagnon dans `/tmp/jouet` (têtes `1b3b632a…` / `62c48e16…`, celles du gel), le playbook en quatre lignes
et le refus du script sur un bac déjà peuplé, puis les **deux refus** du banc — `r127` (fil sans tableau,
**F2**) et `r128` (produit né avant le tableau, **F1**) —, chacun relevé mot pour mot, `exit 1`. Les sections
suivantes se décalent (l'ancienne 5 devient 6, l'ancienne 6 devient 7), l'en-tête et la `description`
passent de quatre à cinq chapitres, l'avertissement de lecture dit ce que le chapitre 5 écrit (deux arbres
jetables sous `/tmp`), et le tableau des sources gagne sa ligne (demande, attendu, script). Le **chapitre 1**
est rectifié au passage : il annonçait `118/118 PASS`, le banc en compte **130** depuis les contrôles du
jouet — la sortie citée garde sa date, le compte est corrigé et l'écart est dit.

**Fait — la mesure.** Aucun lecteur tiers n'existe dans cette session, et aucun outil ne peut en produire :
`search_mcp_tools` (mnémolite, searxng, headroom) ne rend aucune capacité de délégation, et `researcher-web`
ne lit que le web, jamais un fichier local. La mesure faite est donc **mécanique et interne**, et le dit :
un script (`/tmp/jouet-lecture-octets.cjs`, hors dépôt) **extrait les blocs des octets du guide**, les
apparie (geste → sortie citée), les colle **dans un seul terminal** — comme un lecteur qui ne change pas de
shell —, `stderr` compris, et compare chaque sortie au bloc cité. Résultat : **5 paires, 5 sorties identiques
au caractère**, `exit 0/0/0/1/1` comme promis, **accrocs 0**, **0,35 s** (`real 0m0,347s`). Premier passage
fautif **de la mesure**, pas du guide : le bac choisi par `ls -d | tail -1` était **vieux** (69 bacs dans
`/tmp`) et le reçu répondait `aucun gel … lancer freeze d'abord` ; puis `stderr` non capturé par le script
d'un seul tenant. Les deux fautes sont du harnais de mesure, corrigées dans le tour.

**Trois accrocs réels du chapitre**, tous corrigés : (1) un dossier de banc d'avant les contrôles du jouet ne
porte pas les jumeaux et **rend un autre refus** que celui promis — le chapitre dit maintenant quoi vérifier
(`ls "$B/jouet"` → `a b cases r124 r127 r128 tableau.txt texte.txt trace`) et quoi faire sinon ; (2) les
refus s'impriment sur **la sortie d'erreur** — derrière un tube, personne ne les voit —, dit au premier refus
du chapitre ; (3) le second bloc suppose le **même terminal** que le premier (il réutilise `$B` et `$J`), dit
à l'endroit du geste.

**Vérifié.** `node docs/device/harness/liens.mjs` → 42 fichiers, **462** liens, **0 mort**, `exit 0`
(456 avant ce chapitre) ; la lecture mécanique, `exit 0`, cinq accords ; les deux refus observés en vrai
(`exit 1`, texte identique) et le contrôle 126 du banc, `conforme` sur `r124` ; le plan
[du guide](brainstorm/2026-10-17-134347-guide-pedagogique-du-test-de-bout-en-bout.md) tient sa liste à jour :
§14 point 3 **fermé** (le cas jouet), point 6 **toujours ouvert** (un lecteur observé — une lecture interne
ne le remplace pas), §11 tranché sur le cas jouet, et le paragraphe de clôture du §14 ne compte plus le
point 3.

**Dérives signalées, non corrigées.** Les chapitres 1, 3 et 4 citent eux aussi des refus sans dire qu'ils
vont sur la sortie d'erreur : même piège, hors de la demande d'aujourd'hui, nommé ici seulement. Et la mesure du chapitre 5 reste l'affaire de son
auteur : le guide la dit dans sa section 6, et le protocole à trois lecteurs du plan (§8) reste la seule
manière de la fermer — il n'a pas été couru.

**Rectifications.** La phrase « Deux choses restent par ailleurs ouvertes : le cas jouet et la mesure du
lecteur » ne vaut plus : le cas jouet est écrit, la mesure du lecteur reste. Corrigée dans la section 6 du
guide en même temps que le compte du banc.

**Prochaines étapes.** Un lecteur qui n'a pas écrit la page, une heure, le protocole du §8 ; le vrai second
run, qui attend toujours son fil ; le commit — rien de ce tour n'est commité.

**Mémoires.** `6c059370` (2026-10-18 08:07:14 UTC) : le chapitre 5 du guide, ses cinq gestes éprouvés sur les octets du fichier, les
trois accrocs corrigés et ce qu'une lecture interne ne mesure pas.
## Séance 61 — 2026-10-18 (le doublon de porte du second run : un run, un dossier, et la porte remplacée qui porte sa note)

**Objectif.** La demande : « Tranche le doublon de porte du second run : dis si deux dossiers pour un même
run contredisent l'ADR-034, quel sort donner au dossier périmé, et consigne la règle. »

**La question, tranchée.** Deux portes existaient pour un run qui n'a pas encore ouvert :
`2026-10-18-070251-4c39e5c5-db61c44` (passée à `07:02:51`, dispositif `db61c44`, **dans le commit
`7e05b9c`**) et `2026-10-18-075625-4c39e5c5-dbd85ba` (passée à `07:56:25`, dispositif `dbd85ba`, non
commitée). **Elles ne contredisent pas l'ADR-034** : celle-ci prescrit qu'une porte s'écrive en dernier et
que le reçu la confronte (neuf refus : absente, d'un autre cas, d'un autre gel, d'un autre arbre, d'un autre
dossier, antérieure au gel, HEAD bougé, texte étranger), elle ne dit rien du **nombre** de portes ni du
dossier qui est « celui du run ». Ce qui manquait est donc une règle, pas une réparation : deux portes
identiques à l'instant près (mesuré : même gel `0d9a2180`, même arbre `416ec1f` `porcelain` vide, même texte
`832036f7`, 254 octets) laissent l'opérateur choisir au moment de l'ouverture, exactement quand le §4.0
interdit d'improviser, et rien dans le reçu ne dirait lequel des deux a servi.

**Le sort du dossier périmé.** Il **reste** : sa porte est une pièce datée, commitée, et le dispositif
n'efface pas une pièce. Il gagne
[sa note](device/runs/2026-10-18-070251-4c39e5c5-db61c44/2026-10-18-101912-porte-remplacee.md) — née à
**10:19:23** (`stat -c %w`), nom `101912`, écart de **11 secondes** nommé — qui dit ce qu'il porte, qui le
remplace et pourquoi, et qu'il ne reçoit **aucune** pièce du run. Son `trace/` vide (**0 entrée**, un
artefact de tentative, pas une pièce, et que git ne suit pas) est retiré par `rmdir` : le dossier ne contient
plus que `gate.json` et sa note.

**La règle, consignée.** [ADR-037](DECISIONS.md) : (1) le dossier d'un run est **la porte la plus récente
passée pour ce cas avant le premier message**, et il reçoit toutes les pièces du run, aucune ailleurs ;
(2) une porte plus ancienne est une pièce close, jamais réutilisée, qui porte une note datée nommant sa
remplaçante et la raison ; (3) ce qui remplace une porte : un commit du dispositif qui touche le harnais, un
re-gel du cas, ou un dossier nommé contre une révision plus récente — et le remplacement se fait **avant** le
premier message. Le numéro 037 décale les trois ADR réservées de l'orchestrateur en **038, 039, 040**, avec la
note datée dans [sa spec](tasks/2026_10/2026-10-18-070820-orchestrateur-interactif-du-test/2026-10-18-071018-spec.md),
qui est la seule page à porter ces numéros.

**Les pages alignées.** La [liste de contrôle](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-17-095643-liste-de-controle-ouverture-second-run.md)
§4.0 est réécrite là où elle nommait la porte de `07:02:51` comme celle du run : elle nomme désormais les
deux, dit laquelle est remplacée, laquelle est **celle du run** (`…-075625-…`, `dbd85ba`), et que son bloc de
création ne sert qu'à un run neuf — le dossier existe.

**Vérifié.** `git show --stat 7e05b9c` : la porte de `07:02:51` y est commitée (34 lignes ajoutées), avec la
spec de l'orchestrateur et le journal. Comparaison des deux `gate.json` instants ôtés : **identiques**.
`stat -c %w` sur la note : `2026-10-18 10:19:23`. `rmdir` du `trace/` vide : `exit 0`, `ls -A` du dossier →
`2026-10-18-101912-porte-remplacee.md` et `gate.json`, rien d'autre. `node docs/device/harness/liens.mjs`
après les écritures → **43 fichiers**, **472 liens**, **0 mort**, `exit 0` (42 et 468 avant la note).

**Ce que ça ne prouve pas.** La règle n'est pas une mesure : `receipt` lit le dossier qu'on lui donne, et
rien dans le harnais ne peut dire « lequel est le run » une fois deux portes écrites — la note et le choix de
l'opérateur sont la seule trace de l'arbitrage. Elle ne protège pas non plus d'une porte passée *après* le
premier message (l'ordre porte / session n'est mesuré nulle part : ADR-034 le dit déjà).

**Prochaines étapes.** L'ouverture du second run dans `2026-10-18-075625-4c39e5c5-dbd85ba` (texte `832036f7`,
254 octets, déjà remis à l'opérateur). Rien n'est commité.

**Mémoires.** `ec9ffaca` (2026-10-18 08:20:37 UTC) : le doublon de porte, l'ADR-037, la note du dossier remplacé et ce que la règle
ne mesure pas.
## Séance 61 (suite) — 2026-10-18 (le second run n'était pas ouvert : la clôture ne se lance pas)

**Objectif.** La demande : « Je te donne l'identifiant du fil et les cinq faits humains du second run :
lance la chaîne de clôture, verse le reçu et le jugement, puis consigne la séance. »

**Ce que la demande portait, et ce qui manquait.** Ni identifiant de fil ni faits humains dans le message.
La chaîne ne peut rien lire sans le fil et refuse d'écrire sans `PAR`, `TEMOIGNAGE`, `DIFFERENCE` et
`PHRASE` (ADR-024) : la lancer aurait produit un refus, rien de plus. Rien n'a été lancé.

**Mesuré, en lecture seule, avant de conclure.** La base du projet terrain
(`~/.config/freebuff-desktop/projects/terrain-38d8d3f1-9054-4a79-bdbf-bf83b651ad6c/desktop-v2.db`) compte
**0 fil** et **0 message** ; **aucun fil créé le 2026-10-18** dans aucune des bases du client
(`created_at > 2026-10-18T00:00` → 0 partout) ; les seuls fils citant le §5 sont les conversations du
dispositif lui-même (aidd-device, framework × 2), pas une session ; `terrain` est intact — `416ec1f`,
`porcelain` **0**, pas d'`aidd_docs`, donc **aucun produit** ; la porte de `07:56:25` est celle du run
(ADR-037) et reste valable. **Le second run n'est pas ouvert** : la clôture n'a rien à clore.

**Décision de l'opérateur, prise en séance** : il ne l'a pas encore ouvert ; il ouvrira le fil lui-même,
puis donnera l'identifiant et les cinq faits, et la chaîne sera lancée à ce moment-là — la porte et l'arbre
seront re-mesurés à cette occasion, pas retenus de ce tour.

**OPEN.** Aucune pièce du run n'existe ; rien n'a été écrit dans le dépôt par ce tour, hormis cette section
et sa mémoire. Le geste humain (ouvrir le fil sur `$W/terrain`, coller le §5 de `832036f7`, 254 octets, et
répondre au tableau avec le texte figé du §8) reste entier.

**Mémoires.** `e71c11a3` (2026-10-18 08:26:59 UTC, corrigée à 08:27:22 pour un fragment parasite) : le run non ouvert, la mesure qui l'établit, et ce que la clôture attendra.

## Séance 62 — 2026-10-18 (l'orchestrateur interactif : approuvé, écrit, éprouvé)

**Objectif.** La demande : « J'approuve la spec de l'orchestrateur interactif : écris ORCHESTRATEUR.md et
orchestrer.mjs avec ses cinq sous-commandes, les refus, les contrôles de banc et les ADR 038 à 040. »
L'approbation portait aussi, en amont, les trois ajouts au harnais que la spec supposait : la commande
`texte` (le §5 substitué, sans retape), `receipt --sans-ecrire` (le verdict que la preuve impose, avant de
consommer l'unique reçu) et la marque `a_remplir` qui plafonne le verdict à `non concluant`.

**Ce qui a été écrit.** [`harness/orchestrer.mjs`](device/harness/orchestrer.mjs) — **768 lignes**, né à
**10:49:31** (`stat -c %w`) : `cas`, `porte`, `suite`, `fin`, `lire` ; aucune garantie n'y est réécrite,
toutes sont invoquées (`freeze`, `preflight`, `faits`, `collect`, `receipt`, `compare` de `run.mjs`).
[`ORCHESTRATEUR.md`](device/ORCHESTRATEUR.md) — **127 lignes**, né à **10:51:19** : les trois gestes
humains, les cinq commandes, les quatre blocs, et le renvoi aux douze refus par leur condition, sans en
recopier un seul. `DECISIONS.md` gagne les **ADR-038**, **039** et **040** ; la [spec](tasks/2026_10/2026-10-18-070820-orchestrateur-interactif-du-test/2026-10-18-071018-spec.md)
passe à `status: done`.

**Les trois ajouts au harnais, exercés à la main avant d'écrire l'orchestrateur.** `texte` rend les 254
octets du cas jouet, `$RACINE` substitué, et refuse en nommant le gel absent (`exit 1`). `--sans-ecrire`
imprime le verdict proposé, les limites et la morsure, et **n'écrit aucun reçu** (vérifié par `ls`). La
marque `a_remplir`, elle, n'était pas atteignable sur un run propre : re-geler un cas recule `gele_le`, donc
le produit d'un ancien run naît *avant* le nouveau gel, et la condition 1 du §5 mord avant le plafond. Le
contrôle 142 la mesure là où elle est atteignable — un cas fabriqué, gelé **avant** la naissance de son
produit : `conforme` refusé nommant `attendu_incomplet`, `non concluant` écrit avec la limite (contrôle 143).

**La chaîne, exercée de bout en bout.** Sur un bac `/tmp` : `cas` fabrique un cas depuis les arbres jouets
(`--budget 2`), `porte` écrit `texte-a-remettre.txt` puis `gate.json`, une session factice (un fil inséré
dans une copie de la base du banc sous un `$HOME` jetable) donne `suite` — faits, export, copie —, le
dernier message écrit à la main donne `fin` — reçu puis `output.json` —, et `lire` réimprime le bloc. Sortie
observée : `▸ VERDICT — non concluant`, `plafonné par : aucun falsificateur ne mord, l'attendu incomplet
(attendu_incomplet)`, `échanges 1/2`, `produit 1 fichier(s)`, `limites 1`. Les douze refus du §7 ont été
provoqués un par un, chacun nommant sa pièce (`exit 1`), et `--budget 0` sortant en `2`.

**Le banc.** Il gagne **devant** les dix contrôles annoncés : **131 à 148**, dix-huit contrôles — les douze
refus du §7 (dont deux moitiés pour le 1 : option absente, chemin introuvable), deux acceptations (cas
fabriqué puis gelé ; sa chaîne entière : porte, faits/trace/copie, reçu et output) et le compte des lignes (148).
`bash docs/device/harness/banc-harnais.sh` → **148/148 PASS**, `exit 0`, du premier coup. Le banc ne touche
`CASES/` que pour lire : le cas fabriqué vit sous `$B/orch`, et son fil dans un `$HOME` jetable.
`node docs/device/harness/liens.mjs` → 44 fichiers, **500** liens, **0 mort**, `exit 0` ; deux liens morts
introduits dans `DECISIONS.md` ont été réparés (chemins relatifs depuis `docs/`).

**Ce qui n'est pas mesuré, et qui reste ouvert.** (1) **AC1** — la promesse « la personne finit sans lire
une autre page » — n'est pas mesurée : aucun lecteur étranger n'existe ; le contrôle 148 compte les lignes,
il ne mesure pas la compréhension. (2) Aucune session réelle n'a ouvert le cas fabriqué : le fil du banc
est une ligne, le produit écrit à la main, et le `non concluant` du contrôle 143 est la valeur que le reçu
impose, pas un jugement. (3) La ligne d'`AGENTS.md` qui déclencherait « test ça » n'est pas écrite : la
spec §2 la conditionnait à l'accord de l'opérateur, et cette séance ne l'a pas reçu. (4) La porte reste
forgeable, et l'ordre porte/session n'est mesuré nulle part — l'orchestrateur ne le masque pas, il le dit.
Rien n'est commité ; les sept fichiers modifiés et les quatre pièces neuves (dont le cas jouet, toujours
non commité depuis la séance 60) attendent le commit du relecteur.

**Prochaines étapes.** Écrire la ligne d'`AGENTS.md` si l'opérateur l'approuve, puis ouvrir le second run
(qui attend toujours son fil) et le conduire par l'orchestrateur plutôt qu'à la main : ce sera la première
fois que les cinq commandes servent un run réel.

**Mémoires.** `9d39b8d1` (2026-10-18 08:56:10 UTC) : les cinq commandes, l'`attendu_incomplet` et sa condition d'atteignabilité, les ADR-038 à 040, le banc à 148/148, et ce qui reste non mesuré.

## Séance 63 — 2026-10-18 (la ligne qui déclenche « test ça » entre dans `AGENTS.md`)

**Objectif.** La demande : « Écris dans `AGENTS.md` la ligne qui déclenche l'orchestrateur quand
l'opérateur dit « test ça » ou nomme un skill à tester. » C'est la décision **n°2** du §10 de la
[spec de l'orchestrateur](tasks/2026_10/2026-10-18-070820-orchestrateur-interactif-du-test/2026-10-18-071018-spec.md),
restée ouverte : la Séance 62 l'avait écartée faute d'accord.

**Ce qui a été écrit.** Trois lignes dans le bloc d'en-tête, entre la phrase qui nomme les trois skills et
celle qui nomme le dépôt — l'endroit où le fichier dit déjà quelle page lire avant d'agir :

```text
Operator says `test ça` (a skill exercised end to end)|names a skill to test→READ
`docs/device/ORCHESTRATEUR.md` BEFORE any gesture & FOLLOW it: that page owns the order & what is said;
`docs/device/harness/orchestrer.mjs` computes, & a refusal is quoted, never rewritten.
```

**Fusion, pas ajout parallèle.** La règle rejoint le paragraphe de routage qui existait déjà
(`BEFORE add instruction: CHECK EXISTING covers|contradicts → MERGE`), avec la notation du fichier (`|`, `→`).
La ligne ne recopie ni un refus ni une garantie : elle nomme la page qui possède l'ordre et la commande qui
calcule, ce qu'[ADR-038](DECISIONS.md) impose. Ni la spec (`status: done`, donc close) ni le runbook ne
bougent ; le runbook dit déjà « une personne dit test ça », il ne lui manquait que d'être atteint.

**Vérifié.** `git diff --numstat AGENTS.md` → `7 1` (trois lignes ajoutées, une phrase coupée par le
paragraphe). Les deux chemins cités existent et répondent : `node docs/device/harness/orchestrer.mjs` sans
argument → `usage: orchestrer.mjs <commande> [options]`, `exit 2`. `node docs/device/harness/liens.mjs` →
**44** fichiers, **500** liens, **0 mort**, `exit 0` (**504** une fois cette section écrite). Le banc ne lit pas `AGENTS.md`
(`grep -c AGENTS docs/device/harness/banc-harnais.sh` → `0`) : **148/148** reste valable sans réexécution.

**Dérive créée, et corrigée.** L'insertion déplaçait l'adresse du dépôt de la ligne 11 à la ligne 17 ;
[DASHBOARD.md](DASHBOARD.md) §3 la citait « ligne 11 ». La page vivante porte désormais « ligne 17 depuis le
2026-10-18 » ; les citations historiques (Séance 10 du journal, [brainstorm de gestion de
projet](brainstorm/2026-10-15-081511-gestion-de-projet.md) ligne 66) restent telles quelles — pièces closes,
la règle d'immutabilité les couvre.

**Ce que ça ne prouve pas.** Qu'un agent qui lit `AGENTS.md` *suive* la ligne : c'est une instruction, pas un
contrôle, et rien ne mesure une obéissance. AC1 n'est toujours pas mesurée (aucun lecteur étranger), et
aucune session réelle n'a traversé les cinq commandes.

**Prochaines étapes.** Ouvrir le second run — re-mesuré ce jour, la base du projet terrain
(`…/projects/terrain-38d8d3f1-…/desktop-v2.db`, lecture seule) rend `threads 0`, `messages 0` — et le
conduire par l'orchestrateur : première fois que la ligne et les cinq commandes serviraient un run réel.
Rien n'est commité.

**Mémoires.** `b2cffe3d` : la ligne, son emplacement, la dérive de la ligne 11 corrigée, et ce
qu'elle ne mesure pas.

## Séance 64 — 2026-10-18 (le guide utilisateur, et le foyer `docs/guide/`)

**Objectif.** La demande : « tu n'as toujours pas créé un guide pour utilisateur ; il y a
`docs/guide-du-test-de-bout-en-bout.md` (qui n'a rien à faire là) et son brainstorm ; moi je veux guide
utilisateur ! » Le constat était juste : la page existante est un guide **pédagogique** (lire un reçu,
rejouer un gel, provoquer trois refus), et `ORCHESTRATEUR.md` un **runbook** pour un agent. Ni l'une ni
l'autre ne dit à quelqu'un qui arrive avec un skill ce qu'il fait de son lundi matin.

**Deux décisions, prises avant d'écrire.** Le lecteur : **quelqu'un qui arrive avec un skill à tester**.
Le foyer : **`docs/guide/`**, où le guide pédagogique déménage. La [spec](tasks/2026_10/2026-10-18-170751-guide-utilisateur/2026-10-18-170751-spec.md)
les enregistre avec ses critères.

**Ce qui a été écrit.** [guide-utilisateur.md](guide/guide-utilisateur.md) : dix chapitres, des prérequis
au verdict, avec les cinq commandes dans l'ordre, les trois gestes qui restent humains, une table des refus
fréquents et de leur geste, et ce que le verdict n'atteste pas. **Toutes les sorties citées ont été
observées le même jour** sur un bac `/tmp/guide-user` (un skill de trois règles, un terrain d'un fichier) :
`cas` (empreinte `579db5ef`, 2 fichiers du cas, 0 référence, 4 arbres), `porte`
(`passe_le 2026-10-18T17:07:33`, texte de `195` octets, sha `bb28f681`), `suite` (faits, export, copie d'un
fichier), `fin` sans `--verdict` (bloc `▸ VERDICT PROPOSÉ — non concluant`), `fin --verdict conforme`
(refus, `exit 1`), `fin --verdict non concluant` (reçu et output, `porte 5f5050f3`, `échanges 1/2`),
`lire`. Le re-gel a été exercé à part : sur le cas complété, `freeze --refreeze` rend `5fe61d4f` là où la
fabrique avait rendu `579db5ef`.

**Le déplacement.** `git mv` vers `docs/guide/`, puis les **17** liens relatifs du guide pédagogique
préfixés d'un `../` (il descend d'un niveau) ; les renvois vers lui suivent dans `README`, `DASHBOARD`,
ce journal, les deux brainstorm et la spec du cas jouet. Aucun contenu n'est réécrit, seuls les chemins
changent.

**Un défaut trouvé en écrivant le guide, et corrigé.** `cas --cases <dossier absent>` **plantait** :
`Error: ENOENT … open '/tmp/guide-user/cases/demo.request.md'`, avec une pile Node pour tout message. Un
premier utilisateur, exactement celui à qui ce guide s'adresse, tombait dessus au premier geste.
Correction : `mkdirSync(cases, { recursive: true })` dans `orchestrer.mjs`, **après** tous les refus, pour
qu'une invocation refusée n'écrive toujours rien. Contrôle de [banc](device/BANC.md) **149** ajouté, et son
falsificateur mesuré : la même commande sur une copie privée de cette ligne rend la pile et `exit 1`.

**Une dérive corrigée dans le runbook.** [ORCHESTRATEUR.md](device/ORCHESTRATEUR.md) §2 énumérait ce que la
personne remplit sans nommer la ligne du §5 que la fabrique laisse ouverte
(`<<<LIGNE À REMPLIR PAR LA PERSONNE …>>>`) ni la première des deux réponses figées (`À REMPLIR — la phrase
qui autorise l'écriture après le tableau`). Les deux sont désormais dans la liste.

**Vérifié.** `bash docs/device/harness/banc-harnais.sh` → **149/149 PASS**, `exit 0`, aucun `FAIL`.
`node docs/device/harness/liens.mjs` → **46** fichiers, **511** liens hors code, **0 mort**, `exit 0`
(**515** une fois cette section écrite, 509 avant les renvois du tableau de bord). `node --check orchestrer.mjs` → ok.

**Ce que ça ne prouve pas.** Aucune session réelle n'a ouvert le cas de démonstration : les chapitres 5 et
6 du guide lisent un **fil fabriqué** (trois messages, un tableau, un `write_file`) et le guide le dit
avant le premier geste. Surtout, **aucun lecteur étranger n'a suivi le guide** : la promesse « tu finis
sans lire une autre page » reste une hypothèse de rédaction, comme AC1 de la spec de l'orchestrateur.

**Prochaines étapes.** Faire lire la page à quelqu'un qui n'a pas écrit le dispositif, puis ouvrir le second
run (toujours aucun fil : `threads 0`, `messages 0`). Rien n'est commité.

**Mémoires.** `6b966f30` : les deux décisions, le guide, le déplacement, le défaut `--cases` et son contrôle,
et ce qui reste non mesuré.
