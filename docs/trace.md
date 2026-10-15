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
- L'`AGENTS.md` est jugé pollué (« ce n'est pas le but d'agents.md », mémoire `fc902198`) et
audité section par section : le renvoi à la spec, la date d'approbation et l'id de mémoire du
bloc `CONSIGN`, le récit de rétrospection et l'anecdote datée des parts d'outils, l'anecdote de
dérive du bloc `MEMORY`, les deux puces historiques du bloc `NAMING`, et le paragraphe de renvoi
du bloc `OUTPUT` sont supprimés ; le reste est resserré. Contrôle : `grep -nE 'ADR-|docs/brainstorm|
id hex|2026-10-1[45]|relecteur'` sur `AGENTS.md` → aucune ligne ; `grep -c '^## '` → 13 sections ;
123 lignes, mesurées (`wc -l`), contre 149 au commit `326a5be` (`git show 326a5be:AGENTS.md | wc -l`).
- Sous ordre du relecteur, cette structure et les corrections du double-check sont commitées :
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
- **Le contrat redevient un seul fichier**, sur l'ordre « Tranche la coexistence d'AGENTS.md,
  d'AGENTS-compact.md et des cinq skills de .agents/ en un seul contrat, et supprime ce qui fait
  doublon » (ADR-012, mémoire `594f7674`). Mesuré avant : `AGENTS.md` 82 lignes, 9 sections ;
  `.agents/skills` **3** skills et non cinq (`ls -1 | wc -l`) ; `AGENTS-compact.md` déjà hors de
  l'arbre (`Trash`, `DeletionDate=2026-10-15T12:58:07`). Fait : les quatre sections déplacées
  (`TERRITORY`, `MEMORY`, `CONSIGN`, `NAMING`) repliées dans `AGENTS.md`, la phrase de renvoi aux
  skills retirée, puis `.agents/`, `docs/contracts/2026-10-15-125647-agents-reference.md` et
  `tools/guard-agents.mjs` supprimés. Preuve : `cmp` entre `AGENTS.md` et la copie de référence →
  identiques octet pour octet ; diff section par section → seule une ligne vide finale distingue
  TERRITORY, MEMORY et NAMING, CONSIGN identique ; le guard, avant sa suppression, refuse les
  quatre sections « à deux maisons » (la liste même des doublons), et une fois `.agents/` retiré il
  rend `ok — 13 sections, 72 regles, noyau 11374 o, 0 skills` (`exit 0`). Après suppression :
  racine = `AGENTS.md docs .git README.md`, `liens_morts=0` sur 12 markdown, aucun renvoi résiduel.
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
  jamais en silence — ADR-010), puis **réparée sur ordre du relecteur** dans le tour suivant (ADR-014,
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

- Audit externe d'`AGENTS.md` (un autre LLM) vérifié point par point le 2026-10-15 (mémoire
  `312c1c32`) : confirmés — le worktree `.kilo/worktrees/polished-climb` dans l'arbre du terrain
  (état antérieur à tout run, non ma violation, non supprimé sans arbitrage) ; les marqueurs de
  dégré (`typically`, `When relevant`, `critical`) ; la contradiction `NO_PROGRESS → STOP` contre
  « Stop only when all three ». Réfuté — le reproche « material non défini », retiré par
  l'auditeur lui-même : son décompte était faux (il annonçait 14 occurrences, `grep -c` en donne
  10). Désaccord d'abord motivé, puis tranché par le relecteur contre moi (« si ce n'est pas clair
  ou spécifié, on efface », mémoire `24db199c`) : « typically a PR head » est exact mais non
  spécifié, donc effacé. Corrigé : les deux
  occurrences `TRACE.md` du DASHBOARD, plus deux que l'auditeur n'avait pas vues (`docs/PFD.md`
  ligne 39 et `docs/DECISIONS.md` ligne 27, celle-ci portant aussi une phrase dérivée) ; la
  contradiction d'arrêt levée par un lien explicite vers `STOP` (`AGENTS.md:110`), `critical`
  remplacé par le critère opératoire du fichier, `When relevant` remplacé par le critère
  d'effet, `intactness` requalifié en `unchanged`. Le `TRACE.md` de `DECISIONS.md:53` reste : il
  désigne l'archive homonyme de l'exemple deuteros, qui existe bien.

- Règle de suppression du relecteur, le 2026-10-15 : « si ce n'est pas clair ou spécifié, on
  efface » (mémoire `24db199c`). Elle devient une règle du contrat (`AGENTS.md:19`, §`INVARIANTS`)
  et un ADR (ADR-010). Appliquée dans la foulée à `AGENTS.md` : le marqueur retiré (`TERRITORY`,
  ligne 34), les déclencheurs d'`AUDIT` reformulés en critères opératoires — `high-impact` non
  mesurable, `meaningful` non spécifié, `weak-evidence-based` redondant avec « evidence weaker than
  the claim » — et `substantive` remplacé par « could change the result » (lignes 96 et 98).
  Contrôle : `wc -l AGENTS.md` → 124, `grep -c '^## '` → 13 sections,
  `grep -n 'typically a PR head\|high-impact\|substantive disagreement' AGENTS.md` → code de sortie      1, aucun résidu. Le fichier est passé de 123 à 124 lignes
 : une règle ajoutée, trois reformulées,
  aucune section touchée.

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
fait dans ce tour : **trois** skills, pas cinq ; la rectification vit dans l'ADR-012 et dans la
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
l'approbation de la fondation et l'ordre de corriger `AGENTS.md` ; `a3e08338` la correction des  specs répétées et la structure VISION/PFD/DECISIONS/DASHBOARD à la deuteros ; `731fb8d3` le
  double-check et ses corrections ; `439732cd` le second commit ordonné, la question « P5/P6 ? »
  qui prouve le jargon interne. Une mémoire antérieure à la séance,
  qui survit à l'effacement des fichiers : `12cdb674` (les cinq décisions du 14 et la réfutation
  du « 0 tool rows »). Du tour d'après : `594f7674` l'arbitrage du contrat unique — `AGENTS.md`
  seul, les trois artefacts doublons supprimés avec leurs empreintes, et la rectification du
  « cinq skills » mesuré à trois. Du tour suivant : `118a0d4f` les deux pages du dispositif
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

Du tour suivant : `AGENTS.md` — quatre puces de forme de réponse et un `R4` renforcé, **non commité**.
`framework/CLAUDE.md` (3 870 o) et `framework/AGENTS.md` (4 125 o) portent les mêmes 22 règles ; mesurées
contre le noyau d'ici (`node /tmp/opencode/couverture.cjs`, test par jetons donc upper bound, relecture
manuelle ensuite), **4 couvertes, 18 absentes**. Le motif est instructif et pas un simple oubli : le
contrat framework est écrit en antipatterns nommés concrètement — « ne pas ouvrir par `sure` »,
« la ligne la plus courte et décisive », « pas de narration d'appel outil » — alors que le dense est fait
d'obligations positives et de listes fermées. En densifiant on a abstractisé, et le gain d'octets a payé
des règles devenues invérifiables. La preuve exacte est `R4` : le dense garde le principe
« concision is demanded and never uniform », le framework donne la **liste fermée** des exceptions
(sécurité, irréversible, étapes ordonnées, nuance) ; un agent peut constater qu'il a quitté une liste,
il ne peut pas constater qu'il est « uniforme ». Récupéré : interdit d'ouverture et **dernière ligne**
(aucune règle du noyau ne spécifiait où une réponse se termine), pas de préambule ni menu, citation de la
ligne la plus courte, pas de narration d'appel outil ni de décoration. `R4` remplacé **sur place, jamais
doublé** — la règle framework « ne pas ajouter un parallèle, fusionner dans la plus forte » est elle-même
absente du noyau et s'applique au patch lui-même ; ma première proposition contenait « answer first on the
first line », doublon de R1, retiré avant application. Vérifié après écriture : 72 → 76 puces, **0 perdue**,
R1 à R11 présentes 11/11, l'ancien R4 absent, 11 374 → 11 842 caractères. Deux des 22 règles framework
étaient déjà couvertes et n'ont pas été réimportées : « Answer first » = R1, « Evidence over assertion »
= R2 + VERIFY, plus fort avec `SUPPOSÉ(<source>)`. **Point ouvert** : la puce nouvelle interdit le tiret
cadratin et la puce R1–R11 en contient un — contradiction interne, non tranchée par l'arbitrage.
Mémoire `047d9f2b` pour le motif de l'abstraction, `ec04b064` pour les emplacements de skills
(`<projet>/.agents/skills/` lu par opencode V2 **et** Freebuff, `~/.agents/skills/` lu par Freebuff
seulement si opt-in, ce qui explique l'absence de `chatgpt-bridge` chez Freebuff). **Dérive signalée,
non corrigée** : le découpage noyau + skills tenté plus haut dans la séance a été perdu — rien n'était
commité, `.agents/`, `tools/guard-agents.mjs` et `docs/contracts/` ont disparu et `AGENTS.md` est revenu
à 11 520 o / 13 sections via `d590aea`. Ce que j'avais retain du découpage tient dans les quatre puces
ci-dessus : un noyau qui ne contient que ce qui vaut partout, et le reste par moment d'application.
**Rectifications du tour précédent** — les quatre puces et le `R4` Validés tiennent, mes énoncés ne tiennent pas tous.
« 0 puce perdue » : la **conclusion** est juste, la **preuve** était invalide. Mon contrôle comparait les six
premiers mots de chaque puce, test qui laisse passer toute troncature ; j'ai donc affiché vert un contrôle
qui ne testait rien. Refait en comparaison de puce entière : 1 puce diffère — la ligne `R1`–`R11`, où `R4` a
été modifié — et sa version transformée est présente, donc **0 règle perdue**.
« Le principe de `R4` est conservé mot pour mot » : **FAUX**. La clause de tête « concision is demanded and
never uniform » a été **remplacée** par « concision in chat, prose in docs and code » ; « never uniform »
ne survit qu'en sens, via la liste fermée qui suit. Le reste — « brevity is a form, not an omission —
nothing material disappears to shorten » — est bien conservé mot pour mot.
« 4 règles framework couvertes » : **3**. La quatrième était un faux positif, `parallel` venait de CONSIGN
« no parallel tree » et non d'une règle de sous-agents ; `subagent` et `fan out` sont absents du noyau.
« 14 restent absentes » : **12**, plus 1 partiellement couverte (le registre chat/prose et `=>` sont passés
dans `R4`, « telegraphic, fragments over sentences » non).
« 22 règles framework » : le fichier en compte **27** items. J'en ai énuméré 22 ; les 5 omis sont la ligne
d'accueil et 4 puces `aidd_docs/` spécifiques au dépôt parent.
« 11 em-dash » : **14 occurrences sur 11 lignes**. J'ai annoncé un compte de lignes comme un compte
d'occurrences.
« Ce qui explique l'absence de `chatgpt-bridge` chez Freebuff » : **cause non établie**, et l'affirmation
est fausse telle quelle. Si `includeHomeSkills` était à `false`, **aucun** skill global ne serait là ; or
`mnemolite-mem-first` et `visual-explainer` y sont. L'opt-in est donc actif, et il n'explique pas à lui seul
l'absence du troisième. Rien ne tranche ici.
Freebuff : le binaire analysé est **0.0.173** (via `7z` sur l'AppImage), la machine tourne **0.0.186**
(`freebuff-metadata.json`). Seule la 0.0.173 est sur disque, donc 0.0.186 n'est pas vérifiable ici. La
conclusion « Freebuff lit `<projet>/.agents/skills/` » repose sur une version treize révisions en retrait,
et je ne l'ai pas signalé au moment où je concluais. La mémoire `ec04b064` nomme la bonne version dans son
corps ; mon message, non.
Le split noyau + skills « perdu parce que rien n'était commité » : le fait est vrai — `git status`
montrait `?? .agents/` — mais `AGENTS.md` revenu à 11 520 o l'a été par `d590aea`, un commit qui n'est pas
le mien. **Qui a restauré n'est pas établi.** J'ai présenté une corrélation comme une cause.
Mémoire `047d9f2b` corrigée sur tous ces points. Ce qui reste solide : les 4 puces et le `R4` sont dans le
fichier, `R1`–`R11` complètes, l'ancien `R4` a disparu, et les 12 règles absentes sont listées dans le
tour précédent.
## Séance 2 — 2026-10-15 (compression du contrat : veille, mesure, arbitrage)

**Objectif.** Sur `docs/contracts/AGENTS-source.md`, établir ce qui reste à prendre après les
candidats v11, v12 et v13 : recherche web sur la compression sémantique, heuristique et symbolique,
état mesuré au jeton, leviers chiffrés. La séance ne produit aucun candidat ; elle instruit
l'arbitrage.

**Fait.**

- Quatre angles de veille menés en parallèle : compression de prompt avec preuves mesurées
  (LLMLingua et dérivés, gist tokens, 500xCompressor, xRAG, Activation Beacon) ; notations
  symboliques et méta-langages (MetaGlyph, chain-of-symbol, symbol tuning, DSL de contraintes
  vérifiées à l'exécution) ; respect des instructions selon le nombre, l'ordre et le format des
  contraintes, et fichiers de contexte d'agent ; qualité et consolidation d'exigences hors LLM
  (ISO/IEC/IEEE 29148, NASA, IBM ODM, MBSE, EARS).
- Deux sources vérifiées en direct, abstract primaire lu : `arXiv:2602.11988` (Gloaguen et al., v3
  du 2026-09-29) et `arXiv:2601.07354` (MetaGlyph, prépublication). Le reste est rapporté, URL lue
  par la passe de recherche, non relu ici, et étiqueté comme tel.
- Rapport écrit : `docs/contracts/candidat/2026-10-15-215612-veille-compression.md`, 23 373 octets,
  324 lignes, frontmatter `name`·`description`·`type`·`status`. Naissance mesurée
  (`stat -c %w`) : `2026-10-15 21:56:12.374218382 +0200`. Le premier nom portait `215522` ; renommé
  au temps mesuré, l'écart de 50 secondes venant de la mesure faite avant l'écriture.
- Encodeur `tiktoken` monté dans un venv jetable hors du dépôt (`/tmp/tokvenv`), le dépôt ne
  portant aucune dépendance Python : aucune écriture d'outillage ici.
- État du contrat mesuré et **synchronisation des artefacts vérifiée** : `diff` du noyau de la
  source contre `AGENTS.md` rend une seule ligne (un blanc final) ; les trois blocs de `# SKILLS`
  contre `.agents/skills/*/SKILL.md`, frontmatter retiré, sont identiques hors niveau de titre.

**Vérifié.**

- Mesures `o200k` / `cl100k` (caractères / octets / jetons) : source 14 181 / 14 332 / **3 302** /
  3 316 ; `v11.md` 14 382 / 14 554 / 3 381 / 3 397 ; `v12.md` 13 988 / 14 139 / **3 302** / 3 314 ;
  `v13.md` 13 742 / 13 840 / **3 197** / 3 213 ; `AGENTS.md` 7 915 / 8 003 / 1 835 / 1 831. Découpe :
  noyau source 1 835 j, skills 1 464 j ; noyau v13 **1 768 j**, skills v13 1 426 j. Les chiffres de
  `v13-analyse.md` §3 sont reproduits, y compris « v12 ne gagne pas un jeton », et v12 **coûte**
  13 jetons de noyau de plus que la source.
- Coût du format, mesuré sur `v13.md` : retirer les points finaux de puce, les 38 lignes vides, ou
  remplacer `* ` par `- ` donnent **0 jeton** ; retirer les emphases `**` donne −14. Le chiffre
  « ~160 (4,8 %) du format » de `v13-analyse.md` §1 n'est donc pas reproduit ; la part non
  réécrite est un peu plus petite que dit, jamais plus grande.
- Contrôle de couverture indépendant `source → v13` par recouvrement de jetons (outil différent de
  la matrice de v12, borné par construction, ses limites écrites) : 10 alertes sur 82 puces source,
  toutes expliquées, aucune perte constatée. Sens inverse `v13 → source` : aucune puce sans
  équivalent source hors les six réparations déjà documentées.
- Aucune règle du contrat modifiée dans cette séance : `AGENTS-source.md`, `AGENTS.md` et les trois
  `SKILL.md` sont intacts (`git status --porcelain` ne les montre pas comme modifiés par ce tour,
  `docs/contracts/` étant déjà non suivi avant lui).

**Rectifications de mes propres énoncés.** J'ai d'abord lu l'écart entre `wc -c` (14 332) et le
chiffre de `v13-analyse.md` (14 181) comme un fichier modifié depuis cette analyse. Faux : c'est
l'écart octets contre caractères, les 56 `·`, 13 `—` et 19 `→` valant deux à trois octets chacun.
Les fichiers mesurés sont bien ceux que v13 a mesurés.

**Dérives signalées, non corrigées.**

1. `docs/contracts/` est **entièrement non commité** (`?? docs/contracts/`), comme `.agents/`
   (`?? .agents/`), contre `CONSIGN` : un document non commité ne laisse rien à lire.
2. `ADR-012` est contredit sans acte daté : il a tranché « un seul contrat, `AGENTS.md`, sans
   skills » et supprimé `.agents/` ; l'état courant porte un renvoi, trois `SKILL.md` vivants et une
   source à quatre artefacts. `grep -rn "ADR-012" docs/` ne rend que le registre et deux mentions du
   journal. `AGENTS.md` au `HEAD` fait 11 520 octets, l'arbre de travail en porte le noyau avec la
   phrase de renvoi.
3. La campagne v11, v12, v13 n'est consignée nulle part au journal (`grep -n "v1[123]\|candidat"
   docs/trace.md` ne rend rien) : cette séance-ci est la première à la porter.
4. Les trois analyses (`v11`, `v12`, `v13`) n'ont pas de frontmatter, là où `CONSIGN` l'exige d'un
   document consigné ; le rapport de cette séance en porte un.
5. `docs/contracts/README.md` annonce `candidat/v12.md` comme le candidat courant, alors que v13 le
   domine mesuré (3 197 contre 3 302 jetons ; noyau 1 768 contre 1 848) : le README est en retard
   d'une version.

**Prochaines étapes.** Deux décisions appartiennent au relecteur, et une seule question de
structure reste ouverte : adopter `candidat/v13.md` comme nouvelle source, et différer ou non
`AUDIT`, `RECOVERY` et `STOP` dans un skill (−182 jetons de noyau, −9,9 %). Puis régler les cinq
dérives ci-dessus, dont le commit qui les rend lisibles.

**Mémoires.** `2722a797` (mesures et reproduction de v13) · `854d95eb` (veille, avec `OPEN` sur
l'unité de MetaGlyph) · `22a06280` (dérives mesurées).

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
`docs/device/runs/`, `docs/device/REPLAY.md`, `docs/contracts/`, `.agents/`, `.gitignore` et les
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

> Rattaché à la Séance 2, et posé après la Séance 3 : celle-ci s'est écrite entre mes deux ajouts au
> même fichier, et cet ajout est tombé à sa suite. Il appartient à la Séance 2.

**Application, suite de la Séance 2, sur arbitrage du relecteur.**

**Fait.** Le relecteur tranche « v13 seul ». `cp docs/contracts/candidat/v13.md
docs/contracts/AGENTS-source.md` ; `cmp` des deux rend identiques, octet pour octet. Les quatre
artefacts sont réécrits depuis la nouvelle source par un rendu transitoire (`/tmp/render.py`, hors
du dépôt, non commité) : `AGENTS.md` reçoit le noyau, chaque `.agents/skills/<id>/SKILL.md` reçoit
son bloc et garde son frontmatter. Ce rendu a été validé **avant** d'appliquer : lancé sur l'ancienne
source, il reproduisait les quatre anciens artefacts à l'octet. `docs/contracts/README.md` nomme
désormais v13 comme texte appliqué, v11 et v12 comme étapes de la campagne, et référence la veille.

**Vérifié.** Après application, re-rendu de la source contre les artefacts en place : les quatre
`cmp` sortent 0, source et artefacts sont en phase. Mesures `o200k` après : source 13 742 car. /
**3 197 j** (avant 14 181 / 3 302, −3,2 %) ; `AGENTS.md` 7 592 / **1 768 j** (avant 7 915 / 1 835,
−67 j, −3,7 %) ; skills 802 + 294 + 293 j contre 1 427. Les trois descriptions de frontmatter sont
identiques aux phrases de tête des blocs de v13 : aucun déclencheur de skill n'a bougé. Aucune règle
perdue, la source livrée étant le fichier exact que le contrôle de couverture de cette séance a
mesuré, à l'octet près.

**Mémoire.** `c4800bff`.

**Relecture du contrat appliqué, énoncé par énoncé (suite de la Séance 2).**

**Fait.** Audit demandé : les 82 énoncés d'avant application ont-ils tous une destination dans le
texte appliqué ? Le texte d'avant n'existe plus dans le dépôt, il a donc été reconstruit et la
reconstruction prouvée : noyau depuis la partition du texte d'alors, blocs depuis les artefacts
d'alors, et `cmp` du rendu de la reconstruction contre les quatre artefacts d'avant → identiques
(exit 0 pour les quatre), reconstruction à 14 181 caractères, la taille mesurée de la source avant
application. Surface : `diff -u` des deux textes, 229 lignes, lues en entier ; 82 puces avant,
83 après, dont 30 à suite de mots identique et 52 remaniées.

**Vérifié.** Aucun devoir perdu : 8 fusions, 6 déplacements, 4 suppressions justifiées dans le texte,
6 réparations, 1 index ajouté. Trois écarts qu'aucune des trois analyses n'avait vus, tous dans le
rapport `docs/contracts/candidat/2026-10-15-220849-relecture-contrat-applique.md` :
`F2` « Never invent missing information » retiré par v11 en silence, puis justifié par
`v12-analyse.md` §2 par une prémisse **fausse** (l'en-tête ¶1 est une énumération fermée qui ne
contient pas une information) ; son domicile n'est plus qu'indirect, via `OUTPUT` `R11` « no
fabrication ». `F1` « merely » retiré par v12 sans être consigné. `F3` « available » devenu « exists »
par v11, alors que `v11-analyse.md` §1 revendique avoir rendu la condition.

**Limites.** Revue **interne** : le même agent a appliqué v13 et écrit cette relecture, aucun second
relecteur n'existe ici. Aucune mesure d'application, c'est un audit de conservation de texte. Et
`F2` appelle une décision du relecteur : rendre la phrase (+7 jetons), laisser `R11` la porter en le
disant, ou écrire la règle ailleurs.

**Mémoire.** `5883a9be`.

**Préparation de la clôture : quel commit, quelle checklist (suite de la Séance 2).**

**Fait.** État mesuré avant clôture : `HEAD` = `d0d894b` « Ranger les espaces de travail sous
`~/projects/`, et re-geler le cas » (2026-10-15T22:01:06+02:00), branche `main`, remote
`github.com/giak/aidd-device`. Un autre fil a déjà committé la séance 3 (28 fichiers, +4231/−125,
dont `docs/trace.md` +218). `git status --porcelain` rend 14 entrées `M` et 2 entrées `??`
(`.agents/`, `docs/contracts/`), soit 31 fichiers non suivis dans `docs/contracts/` (28, 364 Ko) et
`.agents/` (3, 32 Ko).

**Commit proposé, un seul, 33 fichiers** : `AGENTS.md` (le noyau appliqué), les trois
`.agents/skills/*/SKILL.md`, tout `docs/contracts/` (source, `README.md`, `candidat/` avec v11, v12,
v13, leurs trois analyses et les deux rapports datés, `archive/` v0 à v9) et `docs/trace.md`.

**Reste hors du commit, 13 fichiers d'un autre auteur** : `README.md`, `docs/DASHBOARD.md`,
`docs/DECISIONS.md`, `docs/EXPLICATION.md`, `docs/device/` (BOUNDARY, DEVICE, REPLAY, harness/run.mjs
et les trois pièces du cas), `docs/tasks/2026_10/` (spec et run). Rien de cela n'est stagé.

**Point délicat, mesuré et non contourné** : `docs/trace.md` porte 78 lignes ajoutées non committées,
dont les blocs de cette séance 2 et un bloc « Tour suivant : la porte d'avant la session » écrit par
l'autre fil. Un `git add docs/trace.md` stage les deux ; un commit par auteur exigerait `git add -p`.

**Checklist écrite et lancée**, dans `docs/contracts/README.md` section « Ce qu'un tiers peut
vérifier lui-même » : noyau contre `AGENTS.md`, chaque bloc contre son `SKILL.md` (frontmatter et
niveau de titre exclus), `description` du frontmatter contre la phrase de tête du bloc, et le compte
de jetons en facultatif. Les quatre passent : trois `diff` vides et trois « identique », capturés ce
soir. Aucune commande n'est committée comme script, hook ou CI, ADR-004 tient ; deux pièges ont été
corrigés à l'essai, un bloc de source finissant par une ligne vide sauf le dernier, et `head -n -2`
étant GNU.

**Dérive signalée, non corrigée.** `ADR-012` n'est toujours pas révisé par un acte daté, et le commit
proposé ne contient pas `docs/DECISIONS.md` : le registre continuera donc de contredire l'arbre après
la clôture.

**Prochaines étapes.** Le mot du relecteur pour lancer le commit, puis l'ADR qui tranche
l'architecture source + quatre artefacts.

**Mémoire.** `9ee8717a`.
