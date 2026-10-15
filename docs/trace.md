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
- Sur l'ordre de brainstorm et de spec (« braonstorm et écrit les specs sur ce cadre d'ouput
  LLM », mémoire `74c1714b`), la norme d'output est écrite :
  `docs/brainstorm/2026-10-15-084346-cadre-output-llm.md` — trois niveaux proportionnés (N1
  réponse brève, N2 blocs KERNEL, N3 livrable), onze règles, refus explicites, limites déclarées ;
  l'`ADR-009` acte que la norme vit là et que les `ADR-007`/`ADR-008` restent des relevés datés.
- Implémenté sur l'ordre « ok, implémente » (mémoire `be2c01c7`) : la section `OUTPUT` d'`AGENTS.md`
  porte désormais les trois niveaux et leur triage, les onze règles `R1`–`R11`, les refus
  explicitement dits, et citait la spec par son chemin (**retiré à l'audit ci-dessous**, le contrat
  est autonome) ; la spec passe à `status: done` ; le
  DASHBOARD gagne sa ligne d'état. Toute itération ultérieure du cadre s'ouvrira par un document
  daté neuf, jamais par réécriture de la spec (immuabilité B4).
- Sur ordre « commit » (mémoire `15a1923b`), la salve entière est commitée : `9768b4c`, 6 fichiers,
+601/−65 — contrat autonome, cadre d'output, charte KERNEL, registre, état, journal. L'arbre est
redevenu propre après ce commit.
- L'`AGENTS.md` est jugé pollué (« ce n'est pas le but d'agents.md », mémoire `fc902198`) et
audité section par section : le renvoi à la spec, la date d'approbation et l'id de mémoire du
bloc `CONSIGN`, le récit de rétrospection et l'anecdote datée des parts d'outils, l'anecdote de
dérive du bloc `MEMORY`, les deux puces historiques du bloc `NAMING`, et le paragraphe de renvoi
du bloc `OUTPUT` sont supprimés ; le reste est resserré. Contrôle : `grep -nE 'ADR-|docs/brainstorm|
id hex|2026-10-1[45]|relecteur'` sur `AGENTS.md` → aucune ligne ; `grep -c '^## '` → 13 sections ;
123 lignes, mesurées (`wc -l`), contre 149 au commit `326a5be` (`git show 326a5be:AGENTS.md | wc -l`),
c'est-à-dire avant l'implémentation du cadre d'output et avant l'audit.
- Sous ordre du relecteur, cette structure et les corrections du double-check sont commitées :
  `326a5be`, 7 fichiers, +350/−15 (mémoire `439732cd`).
- Le brainstorm de l'output, ordonné par le relecteur (« ce qu'il réponds n'est pas assez precis
  en concis »), est proposé : `ADR-007` dans `docs/DECISIONS.md`, en attente de validation ; son
  application à la section `OUTPUT` d'`AGENTS.md` attend cette validation.
- L'investigation web demandée en suivi a été faite par un chercheur à contexte neuf (mémoires
  `de1bf857`, `41fea883`) : huit pratiques à sources primaires (Anthropic, OpenAI, prompt système
  publié du dépôt `anthropics/claude-code`), citées dans l'`ADR-007` enrichi avec leurs tensions
  et leurs limites. La concision de cette page reste : six règles, une ancre source par règle,
  les origines du dépôt restant non court-circuitées.
- La charte « COGNITIVE CONTROL KERNEL » remise ce matin par le relecteur est conservée verbatim
  (`docs/brainstorm/2026-10-15-083943-kernel-charte-relecteur.md`, mémoire `09faccc1`) et traitée
  par l'`ADR-008` : adoptée pour la priorité, la table de sélection, le test de falsifiabilité et
  les blocs de sortie ; refusée comme obligatoire pour les revues indépendantes à lancer (aucun
  second relecteur disponible ici — règle morte ou fabrication), le pipeline uniforme (contraire à
  la proportion) et `INTERNAL_REASONING := MAX` (non auditable) ; ses invariants et son échelle
  épistémique sont redondants avec `AGENTS.md` et n'y sont pas recopiés.
- Le journal est recréé (cette page) ; c'est l'application minimale de B1, pas une anti-coupée.

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

**Prochaines étapes (TODO).**

1. Itérer la spec avec le relecteur (c'est le brainstorm ouvert).
2. Une fois approuvée : réécrire `CONSIGN` d'`AGENTS.md` sur son modèle — **fait ce jour** ; puis
   ouvrir la boucle 2 (gestion de projet : unité de travail, critère falsifiable, commit) —
   **fait ce jour**, commit `1bbb9d2` puis spec `081511` en itération.
3. Arbitrer la spec boucle 2 : le commit debout de P5, le remote de P6.
4. Après l'approbation de la boucle 2 : le vrai travail, le protocole de test du framework
   (MEGA-PROMPT v6).

**Rectifications de ses propres affirmations.** Trouvées par le double-check ordonné par le
relecteur (mémoire `731fb8d3`) : (1) la paragraphe « mémoires antérieures » avait fait passer
`8c78b47e` et `50add890` pour antérieures à la séance, alors qu'elles ont été écrites ce matin
dans cette séance — corrigé dans la liste ci-dessous ; (2) `VISION.md` citait les chiffres du v6
comme acquis — désormais marqués `SUPPOSÉ(MEGA-PROMPT v6 §2)` ; (3) `DECISIONS.md` ADR-001 citait
« tu n'a rien fait » sans attribution et avec une ponctuation transformée — citation exacte
rétablie, attribuée à `e493b0b8` ; (4) trouvées au double-check de l'implémentation du cadre
d'output (mémoire `8f5cd85d`) : la spec était passée à `done` alors que sa section listait encore
l'adoption et la portée comme à arbitrer — adoption marquée faite, portée restée pendante ; le
`ADR-009` annonçait une citation de la spec dans `AGENTS.md`, que l'audit a retirée — la
conséquence du relevé est dépassée, dite ici et non réécrite ; la clause de revue indépendante
a été alignée sur la spec (ne pas la rendre obligatoire, et ne pas en revendiquer une qui n'a pas
eu lieu).

**Mémoires de la séance.** `8c78b47e` le verdict du matin (« enfonce des portes ouvertes »,
« tout revoir ») ; `50add890` la remise à plat et la correction du pivot (`aidd_docs/<date>.md`
refusé) ; `e493b0b8` l'effacement et la demande de fond en comble ; `7f2cd67b` les
quatre arbitrages (fondation d'abord, trop vite, baby steps, pas de script) ; `44bd6559` l'exemple
deuteros et ses leçons ; `f923e5ff` l'ordre d'écrire les specs sur disque en itération ; `e5411d2e`
l'approbation de la fondation et l'ordre de corriger `AGENTS.md` ; `a3e08338` la correction des  specs répétées et la structure VISION/PFD/DECISIONS/DASHBOARD à la deuteros ; `731fb8d3` le
  double-check et ses corrections ; `439732cd` le second commit ordonné, la question « P5/P6 ? »
  qui prouve le jargon interne, et le brainstorm de l'output ; `09faccc1` la charte KERNEL et
  l'ADR-008 ; `74c1714b` la spec cadre-output et ses trois niveaux ; `be2c01c7` son
  implémentation dans `AGENTS.md`. Une mémoire antérieure à la séance,
  qui survit à l'effacement des fichiers : `12cdb674` (les cinq décisions du 14 et la réfutation
  du « 0 tool rows »).
