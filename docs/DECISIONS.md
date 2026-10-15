---
name: Registre des décisions
description: ADR léger — contexte, choix, conséquences, numéroté, au fil de l'eau ; le fond du contrat documentaire
type: decisions
status: in-progress
---

# DECISIONS — Registre des décisions

> Chaque ADR documente une décision structurante : contexte, options, choix, conséquences.
> Format léger proposé par l'ADR léger (vision/Dashboard template, deuteros). Une décision non
> consignée n'existe pas ; un numéro n'est jamais réattribué.

## ADR-001 — La fondation documentaire : six bases de consignation (approuvée 2026-10-15)

**Contexte** : l'appareil documentaire du 14 a été vidé par le relecteur, verbatim, mémoire
`e493b0b8` : « bon, tu n'a rien fait. j'ai tout éffacé dans le projet. il faut brainstorm des
specs. revoir de fond en comble /home/giak/projects/aidd-device/AGENTS.md. posé les bases de la
gestion docuementaires et de gestion de projet » ; il exige « comment on trace tout, on note
tout ».

**Options** : appareil d'outils générationnels (vécu = 19 docs non commités) · fondation en prose
sans script (choisi) · CI.

**Choix** : deux canaux (mémoire par échange écrite immédiatement ; section de séance numérotée,
append-only), un foyer par nature, chaque fait porte sa preuve, deux niveaux d'immuabilité, zéro
dérive. Décision portée mémoire `e5411d2e` ; le squelette d'une entrée est celui de `docs/trace.md`.

**Conséquences** : sans script ni hook ni CI ; toute vérification mécanique sera méritée, pas
promis.

## ADR-002 — Un seul foyer documentaire, dit `docs/` (2026-10-15)

**Contexte** : l'agent avait proposé `aidd_docs/<date>.md` à la racine ; refus verbatim « cela va
denirie le bordel . on a djà un dossier docs » (mémoire `50add890`) ; l'exemple deuteros vit le
même bazar (deux maisons, specs duplicées, chemins morts).

**Choix** : un type de document, un foyer ; rien ne flotte à la racine ; aucune maison gelée
d'exception tant que la fondation ne la déclare pas. PAS de déplacement vers `aidd_docs/` pour ce
dépôt.

**Conséquences** : la convention `aidd_docs/` du framework s'applique aux projets consommateurs,
pas ici : ce dépôt la consomme, n'ouvre aucun arbre parallèle et n'en prolonge pas la structure.

## ADR-003 — Séance consignée numérotée, un format auditable (2026-10-15)

**Contexte** : deuils d'audits rétrospectifs (`8c78b47e`, `9ed80a52`) : des échanges entiers
sans mémoire ; des sections de séance bavardes non falsifiables.

**Choix** : `## Séance N — YYYY-MM-DD (sujet)`, continuité par `(suite)` ; le squelette interne
est : Objectif · Fait · Vérifié · Dérives signalées non corrigées · Rectifications · Prochaines
étapes · Mémoires (une ligne par `memory_id`) ; un sous-titre absent est un silence, jamais un
remplissage. Emprunte du journal de l'exemple deuteros (l'archive `TRACE.md` de
`/home/giak/projects/deuteros-resurrected-web`), sans lien direct : un chemin hors du dépôt est
cité en clair, jamais en lien.

**Conséquences** : tout échange reçoit un `memory_id` mentionné dans la section du jour ; une
absence de `memory_id` dans une entrée du jour est une erreur auditable.

## ADR-004 — Pas de script, pas de hook, pas de CI tant qu'une dérive n'est pas démontrée (2026-10-15)

**Contexte** : l'arbitrage « pas de script » (`7f2cd67b`) ; le soir du 14 rien n'a arrêté mon
appareil de contrôles ; mieux : mon audit « 19 documents non commités » promettait
l'absence de travaux, pas une preuve (L4).

**Choix** : la discipline (write-back par échange, arbitrage humain) tient le gate. Une
vérification mécanique ne sera **méritée** que par une dérive démontrée, jamais ajoutée par envie.

**Conséquences** : le dépôt n'a plus aucun contrôle automatique, conformément au retrait du
crochet ; une future règle M précise sa classe, sa commande et son contrôle négatif avant usage.

## ADR-005 — Critère d'acceptation falsifiable AVANT le travail (boucle 2, en itération 2026-10-15)

**Contexte** : six dossiers de tâche créés en treize minutes la nuit du 14, sans critère ni
clôture ; le relecteur rejette ainsi une tâche sans critère pour l'agent.

**Choix** (à valider) : une tâche s'ouvre avec un critère falsifiable, écrit AVANT le travail ;
sinon, le sujet reste un constat de séance. Toute clôture est une vérification citée dans le
`run.md`. En itération : [081511-gestion-de-projet.md](brainstorm/2026-10-15-081511-gestion-de-projet.md).

**Conséquences** : aucun dossier suivi d'à-côté ; le journal porte le déroulé, le dossier porte
l'objet livré.

## ADR-006 — La phrase « 0 tool rows » est fausse ; corrigée sur place (2026-10-15)

**Contexte** : le contrat d'`AGENTS.md` portait « mesuré : 0 tool rows in 69 messages » ; la
mesure
visait la mauvaise colonne : les appels d'outils sont des parts dans `parts_json`, pas des lignes
de messages ; 659 parts d'outils mesurées dans un fil (mémoire `12cdb674`).

**Choix** : `AGENTS.md` est un contrat vivant, corrigé sur place ; le document daté qui a dit
faux ne se réécrit pas, une rectification datée lui répond.

**Conséquences** : toute mesure de l'agent porte la commande qui l'établit ; un chiffre recopié
d'un document, d'un journal ou d'une mémoire n'est jamais une preuve.

## ADR-007 — Le message de l'agent est une réponse, pas un rapport (en itération, sources citées, 2026-10-15)

**Contexte** : le relecteur, après avoir dû demander « P5/P6 : c'est quoi ? » sur des codes que le
message avait livré sans définition, ordonne (mémoire `439732cd`) : « il va falloir brainstorm sur
l'ouput du LLM, ce qu'il réponds n'est pas assez precis en concis ». L'investigation web demandée
en suivi (`de1bf857`) a rapporté huit pratiques à sources primaires (mémoire `41fea883`) : ce qui
suit les intègre, et nomme ce qu'elles ne prouvent pas.

**Proposition enrichie** (à valider, six règles) :

1. **Réponse d'abord, raison ensuite.** Ancre : OpenAI « Efficient » — « An immediate direct
   answer first, followed by concise reasoning or steps » (`help.openai.com/en/articles/11899719`,
   style de personnalité, pas une loi générale).
2. **Preuve en ligne.** Toute affirmation d'état porte sa commande, sa sortie ou son hash de
   commit, sur la même ligne ; local règle du dépôt (VERIFY), confirmée par l'usage du v6.
3. **Format de sortie déclaré, vérifiable.** Anchres : OpenAI — « Be specific... about the
   desired context, outcome, length, format, style » (`help.openai.com/en/articles/6654000`) et
   Structured Outputs pour les usages programmatiques (`developers.openai.com` prompt
   engineering) ; le prompt système d'agent-creation publié dans le dépôt officiel
   `anthropics/claude-code` (`plugins/plugin-dev/skills/agent-development/references/
   agent-creation-system-prompt.md`) — « Always define clear output format in system prompt ».
   Application ici : les réponses qui livrent un état suivent un cœur fixe (résultat, preuve,
   reste à arbitrer), ce que fait déjà le squelette de tracé.
4. **Concision demandée explicitement, jamais en uniforme.** Ancre : Anthropic — « Prompt
   explicitly for conciseness instead » (`platform.claude.com`, Prompting best practices : les
   comportements de longueur varient par modèle). Et la tension nommée par une issue du même
   dépôt (`anthropics/claude-code#32508`, signalement, pas preuve) : « Go straight to the point »
   peut être lit comme « agir vite » ; la règle ici précise donc : **la brièveté est une forme,
   pas une omission** — rien de matériel ne disparaît d'un message pour être court.
5. **Pas de code interne sans définition.** Un sigle ou une étiquette (`P5`, `B1`, `L4`) est
   interdit dans un message sans sa définition en une phrase, à sa première occurrence. Règle
   locale, née du cas P5/P6 ; les sources annexe ne portent pas ce point, elles ne le contudent
   pas non plus.
6. **Une demande, une décision.** Une seule question à la fois, l'option recommandée nommée.
   Local, cohérent avec « Be clear and direct » (Anthropic).

**Tensions connues, ne pas confondre** : (a) « réponse d'abord » et « citer d'abord les extraits »
ciblent des contextes différents (style de réponse vs tâches sur documents longs,
`platform.claude.com`) ; ici, la citation (2) s'applique aux affirmations d'état du dépôt, point
règle 1 s'applique à l'ordre du message ; (b) la concision des sources ne vaut pas mesure d'issue
— la brièveté n'exempt pas d'un élement matériel nécessaire.

**Limites de l'investigation** : le fichier GitHub cité est un prompt système d'une fonction
précise, pas les instructions globales d'un assistant d'ingénierie ; aucun dépôt officiel complet
d'instructions globales n'a été trouvé dans les pages primaires consultées ; l'issue #32508 est
un signalement d'utilisateur, pas une validation Anthropic.

**Conséquences attendues** : le relecteur ne redemande jamais ce qu'un code voulait dire ;
l'arbitrage d'une décision prend une ligne ; les réponses sont inspectables ligne par ligne,
comme les documents.

## ADR-008 — La charte KERNEL du relecteur : adoptée amputée de ce qui n'est pas exécutable (proposée 2026-10-15)

**Contexte** : le relecteur a remis verbatim un « COGNITIVE CONTROL KERNEL » (mémoire `09faccc1` ;
le relevé qui le conservait a été effacé le 2026-10-15, cet ADR garde seul ce qui en est adopté) :
priorité, invariants, échelle épistémique, neuf penseurs, pipeline en treize étapes,
revues indépendantes à lancer, table de sélection, blocs de sortie. Il recoupe en partie
`AGENTS.md` et l'ADR-007 — ce qui est redondant se référence, ne se recopie pas.

**Adopté** (matériellement nouveau) :

1. L'ordre de priorité `TRUTH > EVIDENCE > VALID_REASONING > ROBUSTNESS > SIMPLICITY > UTILITY >
   PERFORMANCE > NOVELTY` comme trancheur quand deux solutions s'opposent.
2. La table de sélection : `WRONG → REJECT` · `UNSUPPORTED → VERIFY|QUALIFY|REMOVE` ·
   `CONTRADICTED → REPAIR|REJECT` · `WEAK → STRENGTHEN|REPLACE` · `REDUNDANT → REMOVE` ·
   `REGRESSION → REVERT|REPAIR` · `SUPERIOR → REPLACE` · `COMPATIBLE+GAIN → SYNTHESIZE`.
3. Le test de falsifiabilité `"WHAT WOULD MAKE x WRONG?"` posé avant d'accepter une affirmation
   non triviale : une affirmation dont on ne sait pas ce qui la rendrait fausse n'est pas acceptée.
4. Les blocs de sortie des réponses substantielles : `RESULT` · `KEY_EVIDENCE` ·
   `MATERIAL_CRITICISMS` · `KEY_TRADEOFFS` · `CORRECTIONS` · `REJECTED_ALTERNATIVES` ·
   `MATERIAL_UNCERTAINTY` — un bloc vide est un silence, jamais du remplissage.
5. `CLAIM_STRENGTH <= EVIDENCE_STRENGTH` énoncé explicitement (déjà l'esprit de `VERIFY`).

**Refusé comme obligatoire**, et dit tel quel :

1. `SPAWN → INDEPENDENT_REVIEWS → NO_SHARED_CONCLUSION` : dans cet environnement, le seul agent
   indépendant disponible est un chercheur web. Exiger une revue indépendante à chaque tâche
   créerait soit une règle morte, soit une fabrication — exactement le mode d'échec d'une règle
   sans contrôle (ADR-004). Usage : quand un second relecteur est réellement disponible, on s'en
   sert et on le dit ; sinon la revue est interne et déclarée interne.
2. Le pipeline en treize étapes appliqué à toute tâche : contraire à KISS, à
   `MINIMAL_SUFFICIENT` et à la règle de proportion (ADR-007, règle 4). Il s'applique aux tâches
   matérielles, pas à un renommage.
3. `INTERNAL_REASONING := MAX` : inobservable, non auditable. Conservé comme intention, jamais
   revendiqué comme fait.

**Redondant, donc par référence, jamais recopié** : les `INVARIANTS` (KISS/DRY/YAGNI,
non-régression, pas de fabrication), l'anti-complaisance, l'échelle
`FACT ≠ EVIDENCE ≠ INFERENCE ≠ HYPOTHESIS ≠ UNKNOWN`, `SOURCE ≠ EVIDENCE`,
`EVIDENCE ≠ VERIFICATION` — déjà dans `AGENTS.md` (§`INVARIANTS`, §`VERIFY`).

**Conséquences** : l'application à la section `OUTPUT` d'`AGENTS.md` (ADR-007 + ces cinq points)
attend la validation du relecteur ; le texte verbatim de la charte n'étant plus au dépôt (effacé le
2026-10-15), une divergence se tranche devant le relecteur, jamais par ma réécriture silencieuse.

## ADR-009 — Le cadre d'output devient une spec normative (2026-10-15)

**Contexte** : le relecteur ordonne « braonstorm et écrit les specs sur ce cadre d'ouput LLM »
(mémoire `74c1714b`). Deux ADR (007, 008) portaient déjà le sujet : leur garder le rôle de norme
aurait obligé à les réécrire à chaque itération, ce que l'immutabilité refuse, et à répéter la
même matière dans le registre.

**Décision** : la norme d'output vit dans une spec datée (`status: pending` à la décision), qui
reprend les deux ADR et les organise (trois niveaux proportionnés N1/N2/N3, onze règles R1–R11,
refus explicites, limites). Les ADR-007 et ADR-008 restent des relevés datés : ni réécrits ni
recopiés. La section `OUTPUT` d'`AGENTS.md` porte la norme depuis le 2026-10-15 ; cette spec ayant
été effacée le jour même, le contrat autonome en reste le seul texte en vigueur.

**Conséquences** : une itération sur le cadre d'output se fait dans un seul document — `AGENTS.md`
depuis l'effacement de la spec ; la portée de l'adoption (ce dépôt ou tout le parc) reste à
arbitrer, et elle était écrite dans la spec, pas décidée en silence.

## ADR-010 — Une règle ni claire ni spécifiée est effacée, jamais interprétée (2026-10-15)

**Contexte** : l'audit externe d'`AGENTS.md` avait relevé les marqueurs de degré ; j'en avais
motivé un (« typically a PR head » décrit sans décider, donc conservé). Le relecteur tranche
autrement : « si ce n'est pas clair ou spécifié, on efface » (mémoire `24db199c`).

**Décision** : le contrat porte la règle (§`INVARIANTS` : « A rule stated in this file that is
neither clear nor specific is deleted, never interpreted »), appliquée le jour même à trois
endroits : le marqueur retiré (`TERRITORY`), les déclencheurs d'`AUDIT` reformulés en critères
opératoires (`high-impact` non mesurable, `meaningful` non spécifié), `substantive` remplacé par
« could change the result ».

**Conséquences** : un défaut de précision se répare par suppression ou par un critère mesurable,
jamais par une glose ; l'audit d'un document suit la règle de l'audit d'un résultat.

## ADR-011 — Le worktree tiers dans le terrain est constaté, jamais corrigé (2026-10-15)

**Contexte** : l'audit externe relève `.kilo/worktrees/polished-climb` (5,7 M) dans l'arbre du
terrain, là où le contrat veut que tout ce qui exécute vive dans un dossier jetable hors des
arbres. Le relecteur demande de trancher : tolérer par exception écrite, déplacer, ou supprimer.

**Mesures** (`git -C /home/giak/projects/audio-sync-tool …`) : le terrain enregistre lui-même ce
worktree, détaché sur `416ec1f`, exactement son HEAD (`416ec1fa08b7c8cabb8dedb4d5fd0eec37a5afde`,
commit du 2026-09-23) ; mtime du dossier 2026-09-25 20:21 ; son arbre de travail est propre ;
`.kilo/worktrees/` figure dans `.git/info/exclude` du terrain (ligne 9), donc `git status` n'en
dit rien ; aucun run du dispositif n'a eu lieu (`docs/tasks` est absent du dépôt device).

**Décision** : constaté, conservé tel quel, **aucune clause ajoutée**. La règle existante oblige
l'appareil (« Anything that executes runs in a throwaway directory outside these trees ») et
n'interdit rien à un outil tiers déjà présent. Supprimer serait écrire dans un arbre déclaré
read-only, détruire 5,7 M de données tierces et désenregistrer le worktree de Kilo ; déplacer
ecrirait autant dans le terrain et rendrait le registre du dépôt principal caduc. Mécanisme, rectifié
après double-check : le `.git` du worktree contient le chemin **absolu**
(`gitdir: /home/giak/projects/audio-sync-tool/.git/worktrees/polished-climb`), il resterait donc
valide ; c'est l'autre sens qui casse — `audio-sync-tool/.git/worktrees/polished-climb/gitdir`
contient l'ancien chemin du worktree, que seul un `git worktree repair` répare. Ma première phrase
(« casserait le lien `gitdir` ») nommait le mauvais lien. Les deux pour un gain mesuré nul : le
terrain reste propre. Une exception écrite inventerait une permission là où aucune interdiction
n'existe, c'est-à-dire la règle non spécifiée que l'ADR-010 efface.

**Conséquences** : le terrain se juge sur son HEAD, pas sur ses dossiers ignorés. Le seul écart
réel est nommé et non corrigé : `?? .freebuff/` (37 octets, 2026-10-14 15:49), écrit par le client
dans un arbre read-only, non ignoré ; laissé en place, le supprimer étant une écriture de plus dans
les données de quelqu'un d'autre.

## ADR-012 — Un seul contrat : `AGENTS.md`, sans skills, sans copie, sans contrôle mécanique (2026-10-15)

**Contexte** : à 12:56-12:57, un auteur tiers (non consigné, non commité) a découpé le contrat —
`AGENTS.md` réduit à un noyau de 9 sections plus une phrase de renvoi, quatre sections déplacées
(`TERRITORY`, `MEMORY`, `CONSIGN`, `NAMING`) dans `.agents/skills/` — et déposé deux pièces de
plus : `docs/contracts/2026-10-15-125647-agents-reference.md` (la recopie du contrat d'avant la
découpe) et `tools/guard-agents.mjs` (le contrôle de la découpe). `AGENTS-compact.md`, une seconde
recopie du contrat, avait déjà disparu de l'arbre. L'ordre : « Tranche la coexistence d'AGENTS.md,
d'AGENTS-compact.md et des cinq skills de .agents/ en un seul contrat, et supprime ce qui fait
doublon. »

**Mesures** : `AGENTS.md` → 82 lignes, 9 sections, 6448 caractères ; `ls -1 .agents/skills | wc -l`
→ **3** (01-consign, 02-memory, 03-boundaries), pas cinq — le chiffre de cinq venait de ma propre
note, pas d'un comptage, et la carte de suite portait cette erreur ; `AGENTS-compact.md` → absent
de l'arbre, présent dans `.local/share/Trash/files/` (`DeletionDate=2026-10-15T12:58:07`) ;
`node tools/guard-agents.mjs <référence>` → `ok — 13 sections, 72 regles, noyau 6448 o, 3 skills`.

**Décision** : le contrat est **un seul fichier**, `AGENTS.md`, autonome et stand alone (exigence
déjà consignée, `fc902198`) ; les quatre sections déplacées reviennent à leur place d'origine et la
phrase de renvoi disparaît. Sont supprimés comme doublons : `.agents/` (un second foyer pour des
règles du contrat, et un arbre parallèle à la racine — deux interdits du §`CONSIGN`), la copie de
référence (« A document restating another is a duplicate; the copy loses »), et le guard (contrôle
mécanique non mérité par une dérive démontrée — ADR-004 —, dont l'unique référence disparaît avec
la copie). `AGENTS-compact.md` n'était plus à supprimer.

**Preuve que rien n'est perdu** : le repli rend `AGENTS.md` identique **octet pour octet** à la
copie de référence (`cmp` → exit 0) ; le diff section par section ne montre, sur TERRITORY, MEMORY
et NAMING, qu'une ligne vide finale de différence, et CONSIGN aucune. Avant sa suppression, le
guard désigne exactement les doublons à retirer — `REFUS — 4 derive(s) : section a deux maisons :
TERRITORY / MEMORY / CONSIGN / NAMING`, exit 1 ; `.agents/` retiré, il rend
`ok — 13 sections, 72 regles, noyau 11374 o, 0 skills`, exit 0. Contre le dépôt : `AGENTS.md` n'est
plus modifié aux yeux de git, donc le contrat restauré est celui que le commit porte déjà
(13 sections, 124 lignes). Après suppression : racine = `AGENTS.md docs .git README.md`,
`liens_morts=0` sur les 12 markdown, aucun renvoi résiduel aux chemins retirés. Empreintes des
pièces détruites (aucune n'était suivie par git) : référence `030506ef…`, guard `94ee38ee…`,
01-consign `c56a217d…`, 02-memory `ba85b4ad…`, 03-boundaries `2fa3041d…`.

**Conséquences** : une règle, une maison — le contrat entier se lit dans `AGENTS.md`, rien ne le
complète, rien ne le duplique, et la racine n'a plus d'arbre parallèle ni de script. Perte assumée
et nommée : les `description` de déclenchement des skills (quand les lire, quand ne pas les lire)
ne sont pas reportées, faute de chargeur on-demand dans ce dépôt. Une tentative de re-découpe devra
venir avec sa dérive mesurée, pas avec un contrôle promis.
