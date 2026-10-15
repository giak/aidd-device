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
  `6c040683` — les quatre commits de la séance et le dépôt public ouvert, sans push.
