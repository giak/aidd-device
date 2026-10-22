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

> Nettoyage du 2026-10-16, sur décision du relecteur : les ADR-007, 008, 009, 010 et 012 — qui
> traitaient du contenu ou de la forme d'`AGENTS.md`, pas du projet — ont été retirés, avec la campagne
> documentaire qui les avait produits. **Un numéro n'est jamais réattribué** : le registre passe de 006
> à 011, puis de 011 à 013.

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
n'existe, c'est-à-dire exactement la règle non spécifiée que le dépôt efface.

**Conséquences** : le terrain se juge sur son HEAD, pas sur ses dossiers ignorés. Le seul écart
réel est nommé et non corrigé : `?? .freebuff/` (37 octets, 2026-10-14 15:49), écrit par le client
dans un arbre read-only, non ignoré ; laissé en place, le supprimer étant une écriture de plus dans
les données de quelqu'un d'autre.

## ADR-013 — Les artefacts du dispositif vivent sous `docs/device/`, sous les noms du v6 (2026-10-15)

**Contexte** : le v6 §10 nomme les artefacts du dispositif — `DEVICE.md`, `BOUNDARY.md`, `CASES/`,
`runs/`, `NEGATIVE.md`, `REFUSED.md`, `LIMITS.md`, `ATTEMPT.md` — sans dire où ils vivent, et ses
§7/§10 le veulent « chez lui, dans son propre dépôt git ». Or ce dépôt-ci **est** le dispositif, et
son contrat (ADR-002, §`CONSIGN`) range tout document sous `docs/` et interdit qu'un fichier flotte à
la racine. La [spec du run](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-130103-spec.md)
a laissé la question ouverte (§10) en recommandant `docs/device/`.

**Mesure, faite au tour de l'arbitrage** : le v6 §10 **ne prescrit pas la racine**. `grep -n 'racine'`
sur le méga-prompt v6 → **une seule ligne**, l.524 de l'annexe A, et elle parle du *résolveur de
racine du framework* (`project-root.ts`) ; sur le journal v6 → aucune. Le §10
nomme les artefacts du dispositif **sans dossier parent**, et le seul chemin à dossier de son côté
est `runs/<horodatage>-<framework@rev>-<dispositif@rev>/output.json`. Il ne donne de chemin complet
que pour le côté framework (`ECART.md`, sous `aidd_docs/tasks/<année_mois>/<date_slug>/`). Il n'y a
donc pas de conflit à trancher entre le v6 et le contrat de ce dépôt : il y a un silence du v6, et
c'est le contrat qui le comble. La ligne 186 de `docs/trace.md`, qui affirmait le contraire, était
une inférence de l'agent, rectifiée sur place (rectification 5 de la séance) et reprise dans la
mémoire `e185e4da`.

**Options** : (a) la racine du dépôt, comme les noms du v6 le suggèrent, au prix d'une exception au
contrat que le dispositif enseigne ; (b) `docs/device/`, noms du v6 conservés et correspondance dite
en tête de `DEVICE.md` ; (c) des noms datés selon la règle `NAMING`, ce qui casse la recherche du
lecteur qui vient chercher `DEVICE.md` (question 1 du §11).

**Décision** : (b). `DEVICE.md` et `BOUNDARY.md` vivent dans `docs/device/`, sous leurs noms
prescrits et **sans préfixe daté** — le préfixe sert à rendre l'ordre alphabétique chronologique
entre documents d'une même nature, et ceux-ci sont des singletons nommés par le v6, comme `AGENTS.md`
et `README.md` à la racine. `ECART.md` reste chez le framework,
`aidd_docs/tasks/<année_mois>/<date_slug>/`. La correspondance est écrite dans `DEVICE.md`.

**Conséquences** : aucune exception au contrat — le dispositif n'énonce plus une règle qu'il
violerait lui-même ; le coût est qu'un lecteur qui clone doit lire un chemin, dit en tête de
`DEVICE.md`. Le harnais n'est pas décidé ici : il s'écrit après l'arbitrage de la spec du run, et
rien du dispositif n'est codé avant. Mesures du jour : `DEVICE.md` 895 mots (limite du §10 : 900),
`BOUNDARY.md` 1 013 mots, `liens_morts=0` sur 14 markdown, `framework-origin` inchangée (porcelain
2 lignes, HEAD `fe48de12`, avant et après écriture). Le coût de l'indirection, lui, se paie à la
porte : `README.md` faisait 14 octets et ne portait aucune entrée — il nomme désormais `AGENTS.md`,
les deux pages du dispositif et le journal, sans quoi la question 1 du §11 se serait répondue « non »
pour une raison de chemin.

## ADR-014 — La preuve d'appartenance se mesure en paires chemin + contenu (2026-10-15)

**Contexte** : le v6 §10 exige de `BOUNDARY.md` « la preuve écrite que **aucun fichier du dispositif
n'appartient au framework** — ses propres `git ls-files` (le dispositif est un dépôt), confrontés à
`git ls-files` du framework, **intersection vide** », et la question 7 du §11 lit cette preuve. Le
relevé du jour a mesuré cette clause **insatisfiable telle qu'écrite** : `LC_ALL=C comm -12` des deux
listes triées rend **2 lignes**, `AGENTS.md` et `README.md` — deux dépôts qui portent chacun leur
page d'entrée partagent forcément ces noms. La dérive a été signalée et non corrigée : le v6 n'est
pas de l'agent, et la règle du dépôt veut qu'une clause ni claire ni spécifiée soit
réparée, jamais interprétée en silence. Le relecteur ordonne la réparation.

**Mesures** (2026-10-15 ; dispositif `d02b750`, 11 fichiers suivis, contre framework `fe48de12`,
2 599) : intersection des **chemins** → `AGENTS.md` et `README.md`, qui ne sont pas les mêmes
fichiers (`sha256` `030506ef…` contre `499b6a99…`, `9920d7e1…` contre `aae97f91…`) ; intersection des
**contenus** → 0, mais le framework suit **13 fichiers vides** (`e69de29b…`) : au premier `.gitkeep`
écrit d'un côté, cette intersection tombe sans qu'aucun fichier n'appartienne à l'autre ;
intersection des **paires** chemin + contenu (`git ls-files -s`) → **0**, sur 2 599 paires contre 11.

**Options** : (a) garder la lettre et lui ajouter une exception écrite (« intersection vide, pages
d'entrée exclues ») — une liste à tenir à la main, que le prochain nom partagé par convention
rouvre ; (b) retenir le contenu seul — un critère qu'un fichier vide casse sans rien prouver ;
(c) la paire chemin + contenu, où un seul élément commun **est** le même fichier.

**Décision** : (c), consignée en mémoire `2dc0e6a0`. La clause du §10 et sa lecture par la question 7 du §11 sont réparées dans le
document — `docs/brainstorm/MEGA-PROMPT-TEST-AIDD-v6.md`, §10 (l.371-379) et §11 (l.454-456) :
l'intersection des **paires chemin + contenu** doit être vide, et la clause dit elle-même pourquoi le
chemin seul (deux pages d'entrée se partagent un nom) et le contenu seul (deux fichiers vides se
partagent un contenu) ne décident pas. `BOUNDARY.md` §6 porte les trois relevés, l'ordre des raisons
et la paire de `porcelain` qui garde l'intégrité du framework — elle ne change pas.

**Conséquences** : une paire commune vaut appartenance, sans exception à tenir ni cas trivial à
excuser ; l'intersection reste un relevé daté, valable pour ces deux révisions seulement. Limite
nommée : le contrôle porte sur les fichiers **suivis**, et les artefacts non commités du dispositif
(`docs/device/`, `docs/tasks/`) n'y entrent pas — ce qu'ils touchent est couvert par la paire de
`porcelain`, relevée avant et après chaque run. Mesures après réparation : v6 `md5` `607eebaf…` →
`a33f947d…`, `wc -l` 600 → 605 ; `BOUNDARY.md` 1 013 → 1 383 mots. Le journal v6 et la copie périmée
restée chez l'origine ne sont pas touchés : l'un est un enregistrement daté, l'autre est hors de
portée. Réparation faite aussi d'une dérive du tour, nommée dans `BOUNDARY.md` §8 : la demande du
premier cas avait atterri dans `framework-origin` (chemin relatif résolu contre la racine du client),
remise dans `docs/device/CASES/` — porcelain de l'origine revenu à ses 2 lignes documentées.

## ADR-015 — Les interdits du run ne se disent pas, ils sont structurels (2026-10-15)

**Contexte** : la conduite du premier cas a laissé un point `OPEN` (mémoire `0aeef2f8`) : le §5 de la
demande exige que le texte remis à la session soit les deux lignes entre gardes « et rien d'autre »,
alors que son §7 lui interdit quatre choses. L'ordre du relecteur : « mesure si une session tient le
cadre du §7 sans qu'on énonce les interdits, et tranche en conséquence » (mémoire `691e913c`).

**Mesures** (2026-10-15, révision sous test `4c39e5c5`) : `references/tools.md` vise `CLAUDE.md`,
`AGENTS.md`, `.cursorrules`, `.github/copilot-instructions.md` — tous **relatifs au projet** — et
`hooks/update_memory.js` écrit les mêmes plus `aidd_docs/memory/README.md` ; il ne stage rien quand la
skill l'appelle (le `git add` n'appartient qu'au hook automatique), et l'étape 3 de
`actions/04-sync.md` attend le choix de l'utilisateur avant d'écrire quoi que ce soit. Aucune étape de
la skill n'écrit donc hors du projet. En face, la seule chose qui a réellement fait sortir un agent du
cadre ce jour-là n'est pas un manque de paroles mais la résolution d'un chemin relatif par le client
contre **sa** racine de projet : deux incidents (13:0x, 13:34), deux fois réparés.

**Options** : (a) énoncer les interdits à la session — le texte remis cesse d'être les deux lignes du
§5, la demande gagne une variable et le gel doit être refait ; (b) ne rien changer — un run consommé
pour une réponse qui se lit déjà dans le code de la skill ; (c) garder le §5 pur et rendre le cadre
**structurellement** vrai à l'ouverture.

**Choix** : (c). Le texte remis reste les deux lignes ; les interdits ne sont pas dits. La session
s'ouvre avec sa **racine de projet** posée sur `$W/terrain`, parce que c'est elle — pas le répertoire
courant, pas la bonne volonté — qui décide où tombent les chemins relatifs de la skill. Le seul
interdit qui reste non structurel est « ne pas lire `CASES/` » : rien dans la demande ne l'y invite, et
le reçu le mesure (`cloisonnement.attendu_vu`).

**Conséquences** : la conduite porte la conséquence à l'ouverture et garde le contrôle d'après-run
(paire de `porcelain`, `find -newer`), qui constate sans prévenir. La justification du §7 de la
demande, fausse à cette révision (« il vise des fichiers hors du répertoire de travail »), est
remplacée par la mesure ; la prohibition demeure et le gel du cas est refait avant toute ouverture de
session — `1b9a8434` détruit, `bc126fe6` au `2026-10-15T15:59:39.604335300+0200`. Cet arbitrage est
**faux** si le premier run montre une session quittant le cadre par ses propres décisions : les
interdits devraient alors être dits, et le §5 amendé.

## ADR-016 — Le gel ne stocke que des chemins relatifs (2026-10-15)

**Contexte** : le gel `bc126fe6` a été rejoué depuis un clone neuf du dépôt public, en tiers qui doute
(mémoires `d7ec5531`, `79f3858f`). La formule se recalcule, mais pas verbatim : les chemins gelés sont
**absolus** — `/home/giak/projects/aidd-device/docs/device/CASES/…` pour les deux fichiers du cas,
un champ `racine` pour les huit références. Un tiers doit donc réécrire ce que le gel contient avant de
pouvoir le rejouer, et un gel que seul son auteur peut rejouer ne prouve rien à personne.

**Options** : (a) garder les chemins absolus et documenter la substitution — le rejeu reste possible,
mais chaque relecture commence par modifier le fichier gelé ; (b) stocker des chemins relatifs et
nommer les références par l'arbre où elles ont été hachées ; (c) réserver le rejeu à qui a accès à la
machine de l'auteur.

**Choix** : (b). `fichiers[].chemin` devient relatif à la racine du dépôt — le nom de base seul quand
le cas vit hors du dépôt, comme sur un banc jetable ; `references[]` porte `arbre`, le label de l'arbre
où le fichier a été haché, à la place de `racine` ; et `freeze` **refuse** un `--ref-root` qui n'est
l'un des `--arbre`, puisqu'un chemin absolu ne doit plus entrer au gel. Les arbres, eux, gardent leur
chemin absolu — « où cette machine a lu cet arbre » est un fait, pas un paramètre — et gagnent
`remotes`, sans quoi un label ne dit pas où retrouver l'arbre.

**Conséquences** : le rejeu du §1.1 de la conduite se fait sans réécrire un chemin, avec un seul
paramètre fourni (`RACINE_FRAMEWORK`), et il vérifie en plus que l'arbre du relecteur est à la révision
gelée — mesuré : à `main` au lieu de `4c39e5c5`, les huit fichiers hachés sont identiques et
l'empreinte concorde, seul le contrôle de `HEAD` distingue les deux. L'empreinte **ne bouge pas**
(`bc126fe6`) : la formule ne hache que les rôles, les noms de base et les `sha256`, jamais les chemins.
Le gel est refait le `2026-10-15T16:36:06.165096639+0200` et l'ancien est détruit ; le reçu et le
jugement d'attendu ne changent pas, et `commande` garde les chemins absolus qu'elle a réellement portés
— un fait n'est pas réécrit. La portabilité vaut pour la **formule** : les quatre arbres restent, eux,
hors de portée d'un tiers (`framework-origin` n'est publié nulle part, mesuré en `d7ec5531`).

## ADR-017 — L'origine du framework est publiée là où un tiers la retrouve (2026-10-15)

**Contexte** : mesure du tour précédent (mémoire `d7ec5531`) — des quatre arbres gelés, un seul n'était
joignable par personne : `framework-origin` (`fe48de12`) n'était dans **aucune** branche distante, et un
`git fetch` par `sha` sur le dépôt public le refuse (« impossible de trouver la référence distante »).
Un arbre que seul son auteur peut constater ne rend que sa parole. L'ordre : « publie la révision gelée
là où un inconnu peut la retrouver, puis revalide le gel ».

**Options** : (a) laisser `framework-origin` privé et l'écrire comme limite — c'est ce que faisaient
l'ADR-016 et BOUNDARY §3 ; (b) publier la révision sur le fork public `github.com/giak/framework`,
sous une branche dédiée ; (c) pousser la branche de travail de l'origine ou `main`.

**Choix** : (b). `git push origin fe48de12:refs/heads/gel/2026-10-15-fe48de12` — un ref neuf, aucune
branche existante déplacée, `main` et l'upstream intacts. Le gel gagne de quoi le dire : `arbres[]`
porte `refs_distants`, les branches distantes qui portent le `HEAD` telles que ce clone les connaît, et
`head_complet`, le hash entier — `--short` s'abrège **par dépôt** : le même commit rend `fe48de1` dans
un clone et `fe48de12` ici, mesuré, et la comparaison courte aurait menti.

**Conséquences** : les quatre `HEAD` gelés sont publics — `framework-origin` par la branche nommée,
`terrain` et `travail` (`416ec1f`) par `github.com/giak/audio-sync-tool` `main`, `revision-sous-test`
(`4c39e5c5`) par six branches de `github.com/ai-driven-dev/framework`. Le `porcelain` gelé, lui, ne se
reconstitue pas : les fichiers non suivis n'entrent dans aucun commit — la limite est dite dans
BOUNDARY §3, pas cachée. Le gel est refait le `2026-10-15T16:43:17.693147522+0200`, empreinte
`bc126fe6` encore inchangée (les arbres ne sont pas hachés), et revalidé : `10/10`, l'arbre du relecteur
au `HEAD` gelé, `receipt` et `compare` inchangés. Un tiers refait donc son propre gel sans réécrire un
chemin — mais il refait, il ne rejoue pas celui-ci : le gel du dispositif porte les chemins de cette
machine.

## ADR-018 — La session s'ouvre dans l'espace de travail gelé, ou elle ne s'ouvre pas (2026-10-15)

**Contexte** : trois faits mesurés le même jour. (1) Le premier run a montré qu'une session résout ses
chemins relatifs contre **sa** racine de projet, et qu'une session ouverte au mauvais endroit lit une
copie installée de la révision au lieu de la révision sous test ; l'ADR-015 a rendu la conséquence
obligatoire sans que le geste d'ouverture soit mesuré nulle part. (2) `receipt` acceptait comme
répertoire de travail **n'importe lequel** des quatre arbres gelés : banc du 2026-10-15, un `faits.json`
déclarant `/home/giak/projects/audio-sync-tool` — le terrain **original**, celui que le cas promet de ne
pas toucher — a écrit un `receipt.json` et sorti en `0`. (3) L'espace de travail a été déplacé le même
jour (`~/runs/aidd-device/` → `~/projects/aidd-device-work/<cas>/`) : le dossier gelé peut désormais ne
plus exister, et rien ne le disait avant d'ouvrir.

**Options** : (a) garder le contrôle après coup et l'écrire comme limite ; (b) resserrer `receipt` sur
le seul label `travail` ; (c) ajouter au harnais une porte qui refuse **avant** l'ouverture, et
resserrer `receipt` en second filet.

**Choix** : (c). Cinquième commande, `preflight` : le cas est re-haché comme au reçu, puis le dossier
examiné — `--repertoire`, ou le répertoire courant quand l'opérateur se tient dans le dossier qu'il va
ouvrir — doit être **exactement** le chemin gelé sous le label `travail`, exister, être un répertoire, ne
pas vivre dans le dépôt du dispositif, et être encore dans l'état gelé (`HEAD` **et** `porcelain`).
`receipt` refuse en plus tout `repertoire_de_travail` qui n'est pas le label `travail` du gel.

**Conséquences** : vingt contrôles de banc sous `/tmp`, **20/20** en code de sortie attendu — treize pour
la porte : neuf refus (terrain original, révision sous test, ancien foyer disparu, répertoire courant
resté dans le dépôt, cas sans gel, arbre `travail` gelé dans le dépôt, arbre `travail` qui n'est plus un
dépôt git, arbre à la bonne révision mais au `porcelain` d'un autre état, cas dont un fichier a bougé
depuis le gel) et quatre ouvertures autorisées (dossier gelé par `--repertoire`, par le répertoire
courant, deux gels rejoués depuis un banc) — et sept de non-régression : les refus d'origine de
`freeze`, `collect`, `receipt` et `compare` tombent toujours, et `receipt` gagne le sien (un autre arbre
que le `travail` gelé). Le harnais passe de 4
commandes, 40 refus et 598 lignes à **5 commandes, 47 refus et 677 lignes**. Ce que la porte **ne** couvre
pas : ce que la session fait une fois ouverte — sortir du cadre reste constaté au reçu (condition 3 du
§5) ; et `collect` acceptait tout `--from`, que le manifeste nommait — trou nommé ici, fermé depuis par
l'ADR-020.

## ADR-019 — L'espace de travail se nomme par une racine déclarée, jamais par la machine (2026-10-15)

**Contexte** : le déplacement de l'espace de travail du même jour a coûté un re-gel entier —
`38fa91f4` → `07246039` — parce que le chemin de cette machine était écrit **dans** les deux fichiers
gelés, à trois endroits (demande §2, §4, §5 ; attendu, trois champs de contexte). Récrire un cas gelé
est le geste que l'ADR-016 a rendu inutile pour les **références**, et l'ADR-017 pour la **publication**
des arbres ; le cas, lui, restait attaché à la machine, et l'[REPLAY](device/REPLAY.md) le disait comme
une limite (« un tiers qui rejoue substitue ses propres chemins »). Second fait, plus grave : rien ne
vérifiait que le texte remis à la session était bien le §5 du cas — l'opérateur le recopiait, le
`sha256` du texte était cité dans la conduite, et aucune commande ne le comparait.

**Options** : (a) garder le chemin absolu et documenter la substitution à la main, comme le fait
REPLAY ; (b) déclarer la racine une fois par machine (variable d'environnement, fichier d'à côté) et
laisser le harnais deviner le reste ; (c) en faire un **paramètre de gel**, `--racine`, enregistré dans
le gel et dont les deux copies du cas sont dérivées.

**Choix** : (c). `freeze --racine <chemin>` devient obligatoire ; le gel enregistre
`racine_espace_de_travail` (à côté des arbres, même doctrine : où cette machine garde ses espaces de
travail est un fait) et en dérive `<racine>/<cas>/framework-origin` et `<racine>/<cas>/terrain` ; les
deux autres arbres (`framework-origin`, `terrain`) restent donnés, et `--arbre` sur un label dérivé est
refusé. Le cas nomme `$RACINE`, et le harnais **refuse** un gel dont un fichier de cas écrit la racine
en clair. `preflight --texte <fichier>` reçoit le texte à remettre et refuse tout ce qui n'est pas le
§5 du cas, `$RACINE` substitué par la racine du gel — donc sans variable et sans saut de ligne final.

**Conséquences** : le cas n'est plus attaché à la machine. Un déplacement, une autre machine ou un
rejeu tiers ne réécrivent plus le cas gelé : ils redéclarent la racine, et le **texte remis** aux mêmes
valeurs (mesuré : `832036f7…`, 254 octets, identique à celui du gel précédent — la substitution
redonne exactement l'ancien chemin). Sixième re-gel du même jour, empreinte `07246039` → `0d9a2180`,
`gele_le` `2026-10-15T22:11:24.782242943+0200` ; demande `5aac04fb…` (13 413 o), attendu `ae4914c5…`
(15 423 o). Banc `/tmp/banc-porte.sh` étendu à **31/31 PASS**, dont onze contrôles pour la racine
(dé) : quatre refus de `freeze`, la dérivation vérifiée dans le gel écrit, et cinq contrôles du texte
substitué. Le harnais passe de 677 à **773 lignes**, de 47 à **56 refus**, toujours 5 commandes. Ce que
le nouveau contrôle **ne** couvre pas : qu'un opérateur substitue à la main un autre chemin — c'est
`preflight --texte`, pas la porte du §1.0, qui l'attrape, et il faut la lui donner ; et la racine reste
un fait **par gel**, pas une propriété du cas : deux machines font deux gels, ce que le projet dit déjà
des arbres.

## ADR-020 — Le produit ne vient que de l'arbre « travail », ou il n'entre pas (2026-10-15)

**Contexte** : l'ADR-018 a resserré l'ouverture — la session s'ouvre dans l'espace gelé, ou elle ne
s'ouvre pas — et a nommé ce qu'elle laissait ouvert : « `collect` accepte toujours un `--from` venu
d'ailleurs ». C'est le même trou d'un cran plus loin : `collect` copiait ce qu'on lui donnait, où qu'il
soit, et le reçu lisait ensuite le manifeste comme la provenance du produit. Un `--from` déplacé — le
terrain **original**, la copie `framework-origin`, un dossier de `/tmp` — écrivait donc un `raw/<cas>/`
indiscernable de celui d'un run ouvert au bon endroit, alors que la paire avant/après du §5.2 mesurait un
arbre où rien n'avait été écrit. Mesuré sur banc : les trois sources ci-dessus passaient avant ce tour.

**Options** : (a) garder la limite, le manifeste nommant la source ; (b) refuser seulement au reçu,
quand les empreintes sont déjà recopiées ; (c) refuser au **collect**, là où l'opérateur déclare la
provenance, et refaire le contrôle au reçu, qui relit les pièces au lieu de croire le geste.

**Choix** : (c). `collect --from` exige le gel du cas, lit l'arbre que le gel nomme `travail`, et refuse
toute source dont le chemin **résolu** (`realpathSync` : un lien posé dans l'espace de travail ne compte
pas pour l'espace de travail) ne tombe pas dans cet arbre. Le manifeste enregistre l'arbre d'où la copie
vient (`arbre_de_travail`). `receipt` refait le contrôle sur le manifeste seul — une porte peut être
sautée : un `arbre_de_travail` qui n'est pas celui du gel, ou une source de fichier hors de l'arbre
`travail`, sont des refus ; une source qui ne se résout plus au reçu devient une **limite** écrite, pas
un refus, parce que le produit est déjà copié et haché quand le reçu s'écrit.

**Conséquences** : le harnais passe de 773 à **882 lignes**, de 56 à **63 refus**, toujours 5 commandes.
Banc `/tmp/banc-porte.sh` étendu de 31 à **46 contrôles, 46/46 PASS** : quinze pour l'origine — deux
d'acceptation (`collect` depuis l'espace gelé, et son manifeste nommant l'arbre du gel), sept refus de
`collect` (terrain original, `framework-origin`, dossier hors des quatre arbres, source absente, cas sans
gel, gel sans arbre `travail`, et un **lien** posé dans l'espace de travail qui pointe ailleurs — c'est le
`realpath` qui le refuse), l'espace de travail relu propre après le lien, puis quatre contrôles du reçu
(manifeste d'un autre arbre et source hors de l'espace : refus ; source dans l'espace : accepté ; source
disparue : accepté) et la limite de cette dernière relue dans le reçu écrit. Ce que le nouveau contrôle
**ne** couvre pas : un opérateur qui recollerait à la main un manifeste cohérent après coup — le reçu
relit alors les mêmes pièces que lui, et rien ne distingue un manifeste réécrit d'un manifeste né ainsi ;
et `collect` ne vérifie pas que l'arbre `travail` est encore dans l'état gelé, ce que la porte (ADR-018)
puis le reçu mesurent.

## ADR-021 — Le contrôle qu'une dérive démontrée rend exigible : le volet séance seul, retenu (acceptée le 2026-10-16)

**Contexte** : ADR-004 conditionne le contrôle mécanique à une dérive démontrée, et sa conséquence exige de
toute règle mécanique qu'elle dise **sa classe, sa commande et son contrôle négatif avant usage**. La dérive
est là, deux fois le 2026-10-15 (`13:0x` et `13:34`) : les outils de fichiers du client résolvent un chemin
relatif contre la racine du projet du client, qui est le framework, donc une écriture relative née d'ici
atterrit dans `framework-origin` (BOUNDARY §8 ; journal, Séance 1) et y laisse un **fait faux** que rien ne
lit.

**Fait mesuré, commun aux deux variantes** : la paire d'états avant/après est déjà écrite dans le reçu
(`run.mjs` l.788, `arbres.avant` / `arbres.apres`) et rien ne la lit pour l'origine : `memeArbre` n'est
appelé que pour l'arbre `travail` (l.487 la porte, l.748 le reçu). Le **crochet est écarté**, et par trois
raisons structurelles, pas par goût : la dérive n'écrit aucun événement git dans le dispositif ; le seul
arbre où un crochet la verrait est l'origine, que BOUNDARY §1 interdit d'écrire ; la résolution du chemin
appartient à l'outil du client, hors des deux dépôts, donc la détection est après coup de toute façon.

**Réponse : `A`, le 2026-10-16**, le jour même où la fiche a été réduite à deux variantes (Séance 11).
`B` reste décrit ci-dessous, **non retenu** : son jour reviendrait si un arbre voisin était un jour
constaté déplacé pendant un run, ce qu'aucune mesure n'a montré.

**Variante A — le volet séance seul.** Classe : relevé d'état d'arbre, hors run. Commande, une seule, celle
qui a établi le retour les deux fois : `git -C /home/giak/projects/framework status --porcelain`, comparée
aux deux lignes déjà documentées (BOUNDARY §5), en clôture de toute séance capable d'écrire, le relevé et
son écart allant au `Vérifié` de la séance ; une troisième ligne non suivie, ou un fichier suivi modifié,
s'y nomme, jamais ne se répare en silence. Contrôle négatif **couru** le 2026-10-16 : les deux lignes,
`exit 0`. Prix : **aucune ligne de code**, deux lignes de prose dans BOUNDARY §5 et le geste. Portée :
exactement la classe qui a mordu.

**Variante B — les deux volets.** A, plus le volet reçu : `receipt` compare, avec `memeArbre`, `avant` et
`apres` pour les arbres autres que `travail`, et écrit l'écart en **limite**, jamais en refus, parce qu'un
run dont l'origine a bougé reste un run lisible et que le §7 ne fait tomber le verdict que sur ce qui rend
le produit illisible. Prix : une comparaison et une limite dans le harnais, et **deux contrôles** au banc
(`46` → `48`, dont un run propre qui n'écrit pas la limite et un run où l'origine reçoit un fichier qui
l'écrit avec la ligne exacte). Portée : A, plus la classe voisine, un arbre déplacé **pendant** un run. À
dire dans les deux cas : cette classe voisine **n'est pas** celle des deux incidents datés, puisqu'aucun run
n'était ouvert alors, le premier ouvrant à `17:15:59`.

**Ce que le choix ne change pas**, dans les deux variantes : la parade reste l'écriture en chemin absolu et
la racine du projet du client posée sur l'arbre visé ; un écart réparé avant le relevé ne laisse rien à
lire ; rien dans le dépôt n'empêche l'écriture, seulement son silence.

**Conséquences.** Appliquée le jour de la réponse : le geste du §5 et ses deux lignes y sont écrits, et
BOUNDARY §8 ne dit plus que « rien dans le dépôt ne la contrôle » mais que la dérive est **lue**, jamais
empêchée. Aucune ligne de code : le harnais reste à 882 lignes et le banc à 46 contrôles, et le banc n'y
gagne rien, il éprouve le harnais, pas le client. `B` n'est pas codé ; si un jour un run montre un arbre
voisin déplacé, la variante est reprise telle qu'elle est écrite ici, comparaison au reçu, écart en limite,
deux contrôles au banc (`46` → `48`).

## ADR-022 — Le banc du harnais vit dans le dépôt, et n'est pas un contrôle du dépôt (2026-10-16)

**Contexte** : les ADR-018 et 020 chiffrent leurs refus par un banc cité six fois dans les pages datées,
`/tmp/banc-porte.sh`, 46 contrôles, et ce fichier n'existait nulle part dans le dépôt. La dérive est
démontrée au sens d'ADR-004 : **une preuve citée sans son artefact**, dans un dossier qui ne survit pas à
un redémarrage, quand [REPLAY.md](device/REPLAY.md) promet déjà de rejouer le gel depuis un clone neuf. Un
tiers pouvait relire chaque chiffre annoncé (63 refus, 46 contrôles) sans pouvoir en rejouer un seul.

**Choix** : le banc entre dans le dépôt, `docs/device/harness/banc-harnais.sh`, avec son mode d'emploi
[BANC.md](device/BANC.md). Il est **renommé avec son foyer** : « porte » ne nomme que la première des cinq
commandes qu'il éprouve depuis ADR-020 ; les ADR-018 et 020, datées, gardent l'ancien nom tel qu'elles
l'ont écrit, et ne se réécrivent pas. Ses faits de machine sont lus **au gel**
(`racine_espace_de_travail`, `arbres[].chemin`, ADR-019) au lieu d'être écrits en clair, son dossier de
travail vient de `mktemp`, et trois arrêts `exit 2` le font taire quand le gel ou l'espace de travail
manquent : un banc dont la pièce est absente compterait des accidents comme des refus.

**Ce qu'il n'est pas**, dit ici parce qu'ADR-004 et ADR-012 tiennent encore : ni un crochet, ni une CI, ni
un contrôle du dépôt. Rien ne le déclenche seul ; il n'éprouve que le harnais, jamais l'arbre, et
n'énonce aucune règle sur lui. Ce que la dérive démontrée a mérité, c'est **l'artefact de la preuve**, pas
un automatisme.

**Conséquences** : 46 contrôles, **46/46 PASS** depuis le dépôt, rejoué aussi depuis la racine du système
(le script retrouve le dépôt par sa propre position), et les trois garde-fous éprouvés un par un (`exit 2`
chacun). Le banc se lit et se corrige avec le harnais qu'il éprouve, et les contrôles à venir (les deux du
volet reçu d'ADR-021) prennent place dans ce même compte. Ce qu'il ne couvre pas reste ce qu'il ne
couvrait pas : aucun run, aucune qualité du cas, rien de ce qui est propre à une machine.

## ADR-023 — Le nom du dossier d'un run s'écrit en tirets, `framework@rev` est la notation du v6 (2026-10-16)

**Contexte** : la Séance 16 a rendu visible une divergence d'un caractère, laissée à trancher. Trois pages
vivantes prescrivent le nom du dossier d'un run sous la forme copiée du v6,
`runs/<horodatage>-<framework@rev>-<dispositif@rev>/` : la [spec du run](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-130103-spec.md)
l. 83, la [conduite](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md) l. 205
(qui le dit « nom imposé par la spec §4 ») et [DEVICE](device/DEVICE.md) l. 70. Or la commande que cette
même conduite donne à l'opérateur, l. 212, rend des **tirets**
(`$(date +%Y-%m-%d-%H%M%S)-4c39e5c5-$(git -C … rev-parse --short HEAD)`), et le seul dossier de run qui
existe, commité et cité par son nom dans trois pages, est
`docs/device/runs/2026-10-15-171559-4c39e5c5-1d471a5/`. [ARCHITECTURE](ARCHITECTURE.md), rectifiée le
même jour, est la seule page alignée sur le nom réel.

**Mesure, faite au tour de l'arbitrage** : le v6 §10 écrit son gabarit l. 387, entre chevrons, et énonce lui
même son exigence l. 392-393 : « Le nom du dossier porte les deux révisions, sans quoi la sortie ne dit pas
ce qui l'a produite. » Le **séparateur n'est prescrit nulle part** ; ce qui est prescrit, ce sont les deux
révisions dans le nom. Le nom réel les porte : `4c39e5c5` (la révision sous test du gel) et `1d471a5`, que
`git cat-file -t` dit `commit` de ce dépôt.

**Options** : (a) le nom littéral sépare par des tirets, et `framework@rev` reste la notation du v6 ; (b) le
nom littéral porte un `@`, ce qui déclare mal nommé le dossier du premier run, le fait renommer et casse
les liens de trois pages ; (c) ne pas trancher, l'état de la Séance 16.

**Choix** : (a). Les pages du dispositif qui **prescrivent** écrivent le nom littéral,
`runs/<horodatage>-<révision du framework>-<révision du dispositif>/`. Les **citations du v6 restent
verbatim** : le méga-prompt lui-même, l'ADR-013 l. 145 (qui *mesure* le texte du v6, il ne le prescrit
pas) et le journal, aux deux endroits qui portent le gabarit (Séance 1 l. 345, Séance 16 l. 1290 et
l. 1311) : un enregistrement daté ne se réécrit pas pour une notation.
Les trois pages vivantes sont amendées, avec leur note datée en tête pour la spec et la conduite, et la
phrase du §5 d'[ARCHITECTURE](ARCHITECTURE.md) reçoit le renvoi.

**Ce que ce n'est pas** : un renommage. Rien ne bouge sur le disque, le premier run garde son nom, et
`run.mjs` ne construit aucun nom de dossier : `--run` reçoit le chemin, il ne le fabrique pas.

**Conséquences** : une seule lecture du gabarit, et plus aucune page du dispositif qui prescrive un nom
qu'aucune commande ne produit. Le séparateur n'est pas ce que le v6 éprouve ; les deux révisions dans le nom
le sont, et elles y sont. **Falsificateur** : un dossier de run dont le nom porte un `@`, ou une ligne de la
conduite qui en rend un.

## ADR-024 — Le harnais écrit `faits.json`, et refuse de l'inventer (2026-10-17)

**Contexte** : la [répétition à blanc](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-17-100609-repetition-a-blanc-de-l-ouverture.md)
du 2026-10-17 a suivi la liste de contrôle ligne à ligne : six gestes manquaient, dont `faits.json`.
`receipt` le prend en argument et refuse tout champ vide ; il exige **quinze valeurs**, sous sept clés, dont
deux nomment un chemin qui doit résoudre. Écrit à la main, c'est la dernière pièce que rien ne vérifie :
`receipt` lit ses champs, pas leur vérité.

**Mesure, faite le même jour** : la base du client nomme le fil, son `project_path`, son `execution_mode`,
sa `branch`, son `worktree_path`, son `harness_id`, son `model` et son `created_at` (epoch en
millisecondes) ; `messages` porte le premier message utilisateur et son `ts`. Le gel nomme l'arbre
`travail`. Trois choses ne sont dans aucune machine : qui a ouvert, quand le run s'est terminé, et ce que
l'opérateur témoigne.

**Options** : (a) laisser `faits.json` à la main ; (b) une commande qui remplit tout, y compris les trois
faits humains, avec des valeurs par défaut ; (c) une commande qui dérive ce que la base et le gel disent,
exige les trois faits humains, et refuse tout chemin qui ne résout pas.

**Choix** : (c). `faits` lit la base en `-readonly` par `sqlite3` et refuse : un fil absent, un modèle vide,
un `project_path` qui ne résout pas ou qui n'est pas l'arbre `travail` du gel, un `execution_mode` autre
que `local`, une `branch` ou un `worktree_path` non vide (le piège mesuré du §1.7 de la conduite), un fil
sans message utilisateur, une trace absente, une fin antérieure au début, un `faits.json` déjà écrit. Elle
dérive `session.application` · `identifiant` · `modele` · `ouverte_le`, `horodatage_debut` (premier message
utilisateur), `repertoire_de_travail`, `trace.source` · `chemin_exporte` · `commande` (la requête du §1.5,
éprouvée sur une base réelle, `exit 0`).

**Ce qu'elle n'invente pas** : `ouverte_par`, `horodatage_fin` et `temoignage` sont trois arguments
obligatoires, et rien n'en fournit un défaut. `cloisonnement.attendu_vu` vaut `non` à défaut, et n'accepte
que `oui` ou `non`.

**Conséquences** : le harnais passe à **six commandes** ; le banc gagne quatre contrôles (acceptation, fil
inconnu, chemin qui ne résout pas, fil en worktree) ; les pages qui comptent les commandes et les contrôles
sont remises au vrai. Le format de `faits.json` ne change pas, donc `receipt` est intact.
**Falsificateur** : un `faits.json` dont `repertoire_de_travail` n'est pas l'arbre `travail` du gel, ou
dont `trace.chemin_exporte` ne résout pas — `receipt` l'accepte encore, `faits` le refuse.
*Clos le même jour par l'[ADR-025](#adr-025--receipt-refuse-un-faitsjson-dont-les-chemins-ne-se-situent-pas-2026-10-17) :
`receipt` refuse désormais un répertoire de travail absent et un dossier de trace absent.*

## ADR-025 — `receipt` refuse un `faits.json` dont les chemins ne se situent pas (2026-10-17)

**Contexte** : l'[ADR-024](#adr-024--le-harnais-écrit-faitsjson-et-refuse-de-linventer-2026-10-17) a nommé
son propre falsificateur — « un `faits.json` dont `repertoire_de_travail` n'est pas l'arbre `travail` du gel,
ou dont `trace.chemin_exporte` ne résout pas : `receipt` l'accepte encore, `faits` le refuse ». Deux commandes
qui ne croient pas la même chose : le contrôle de ces chemins existe chez celle qui écrit le fichier, pas chez
celle qui le lit.

**Mesure, faite le même jour** sur un banc jetable (`/tmp/mesure-receipt.X9UBZr`), quatre `faits.json`
variantes, même cas gelé, même run sans produit :

| Ce que le fichier nomme | `receipt` avant | `faits` |
| --- | --- | --- |
| la trace sous un dossier absent | **accepté**, `exit 0`, 3 limites dont « trace machine introuvable » | refusé |
| un répertoire de travail inexistant | refusé `exit 1`, mais « n'est pas celui que le gel nomme « travail » » — le diagnostic désigne l'arbre, pas le chemin | refusé |
| le même arbre écrit `…/terrain/../terrain` | accepté `exit 0` (`resolve` normalise) | accepté |
| le même arbre ouvert par un lien symbolique | **refusé** `exit 1` | **accepté** `exit 0` |

La dernière ligne est la plus coûteuse : `faits` écrit un fichier que `receipt` refuse, un run se perd entre
les deux commandes.

**Options** : (a) laisser les deux commandes divergentes ; (b) refuser, comme `faits`, sur le fichier de trace
lui-même — ce qui rend la branche du §7 (« la trace n'a pas été exportée : le manque est nommé dans le reçu »)
inatteignable ; (c) refuser quand le chemin **ne se situe pas** — répertoire de travail absent ou non
répertoire, dossier du chemin exporté absent — et comparer les arbres après résolution des liens, un fichier
de trace absent sous un dossier présent restant une limite du §7.

**Choix** : (c). `receipt` refuse `repertoire_de_travail` qui ne résout pas ou n'est pas un répertoire, refuse
`trace.chemin_exporte` dont le dossier ne résout pas, et compare l'arbre gelé au chemin déclaré **après
résolution des liens** (`resolu`), comme `faits` le compare.

**Conséquences** : un `faits.json` que `faits` vient d'écrire n'est plus refusé par `receipt` (lien
symbolique) ; le refus d'un répertoire absent nomme la résolution, plus une différence d'arbre ; le
falsificateur de l'ADR-024 est fermé. Une différence subsiste, **voulue** : `faits` refuse d'écrire une trace
absente, `receipt` la note comme limite quand son dossier existe — §7 demande que le reçu enregistre un export
manqué, non qu'il fasse disparaître le run. Le banc passe de 50 à **56** contrôles (51-56).
**Falsificateur** : un `faits.json` dont `trace.chemin_exporte` a un dossier absent, ou dont
`repertoire_de_travail` n'existe pas — `receipt` doit refuser ; et un répertoire de travail ouvert par un lien
vers l'arbre gelé — `receipt` doit accepter.

## ADR-026 — Le harnais déclare ses prérequis et les vérifie avant la commande (2026-10-17)

**Contexte** : `run.mjs` appelle trois outils hors de Node — `git` (les quatre arbres), `date` (les
horodatages, en options GNU : `--iso-8601=seconds`, `-d @<epoch>`) et `sqlite3` (`faits` seul, en
`-readonly`). Aucun n'était déclaré au `--help`, et un seul était vérifié, tard, dans `lireBase`.

**Mesure, faite le même jour**, quatre PATH amputés sur la machine qui a gelé le cas (banc
`/tmp/prerequis.dePd9W`, `PATH` ne gardant que les outils voulus, `node` appelé par son chemin absolu) :

| Ce qui manque | Commande essayée | Ce que le harnais a rendu | `exit` |
| --- | --- | --- | --- |
| `sqlite3` | `faits` | `REFUS — faits : sqlite3 introuvable…` — déjà explicite, mais après les contrôles de `--out` | 1 |
| `date` | `collect --sans-produit` | une **trace Node** (`spawnSync` ENOENT), pas un refus | 1 |
| `date` non GNU (faux `date` refusant `--iso-8601`) | `collect --sans-produit` | `date: illegal option -- -` puis une **trace Node** | 1 |
| `git` | `preflight` | un refus qui **accuse le dossier** : « ouverture refusée dans … — le gel de ce cas ouvre la session ailleurs » | 1 |

Les quatre sortent en `1` : un banc qui ne lirait que le code de sortie n'y verrait rien. Deux cas sur quatre
ne disent pas la vérité, et le quatrième l'inverse de la cause.

**Options** : (a) laisser les pannes parler d'elles-mêmes ; (b) vérifier au démarrage les trois outils pour
**toutes** les commandes, y compris celles qui n'en ont pas besoin ; (c) déclarer les prérequis au `--help`,
et les vérifier au démarrage **par commande**, avec un refus qui nomme l'outil, la commande, l'usage et le
remède.

**Choix** : (c). Quatre entrées, sondées par l'appel réel que le harnais fera : `git --version` et
`date --iso-8601=seconds` pour toutes les commandes, `date -d @0 --iso-8601=seconds` et `sqlite3 -version`
pour `faits` seule. Une sonde `ENOENT` dit « introuvable » ; une sonde qui répond mal dit ce qu'elle a
répondu et réclame la variante GNU. Le refus précède tout contrôle de chemin : c'est la machine qui manque,
pas le run.

**Conséquences** : deux à quatre processus de plus par invocation — négligeable devant les `git` déjà lancés ;
le `--help` porte un bloc « prérequis » qui les déclare sans rien sonder ; le banc gagne quatre contrôles
(57 à 60) : `sqlite3` absent, `date` qui n'obéit pas, `git` absent, et le `--help` qui les déclare. Le banc
passe de 56 à **60**.
**Falsificateur** : un PATH sans `sqlite3`, sans `git`, ou avec un `date` non GNU — le harnais doit refuser en
nommant l'outil, jamais rendre une trace Node ni accuser le dossier.

## ADR-027 — Un contrôle de liens du dépôt, qui lit la prose et pas les citations (2026-10-17)

**Contexte** : la séance 34 a annoncé « 76 liens, 0 mort » puis mesuré 73 : l'expression qui comptait lisait
aussi les motifs `](…)` écrits entre backticks, et un exemple de lien typographique (`](../…)`) a été compté
comme un lien mort. La séance 35 a refait le contrôle à la main une troisième fois. Le dépôt n'a aucun script
pour cela, et un chiffre annoncé à la main n'est vérifiable par personne.

**Mesure, faite le même jour**, dépôt entier, deux comptes sur le même balayage (les fichiers d'un dossier
caché exclus) :

| Compte | Liens | Morts | Ce que les morts sont |
| --- | --- | --- | --- |
| naïf — tout motif `](…)`, code compris | **316** | **2** | deux citations `](../…)` entre backticks, dans le journal |
| strict — blocs et segments de code écartés | **312** | **0** | — |

L'écart est de 4 : le compte naïf ajoute des citations, et fabrique deux faux morts. Un même fichier ne peut
donc pas être cité « 312 liens » et « 320 liens » sans dire lequel des deux comptes il parle — **320 et 8**
après l'écriture de cette ADR, qui cite elle-même quatre fois le motif qu'elle décrit. Le compte strict ne
bouge pas : c'est celui qu'on annonce.

**Options** : (a) continuer au `grep` et au python jetable ; (b) un script qui ne distingue pas code et prose —
c'est le compte naïf, dont on vient de voir qu'il ment ; (c) un script du dépôt, sans dépendance, qui écarte
les blocs et segments de code, **imprime les deux comptes**, nomme l'écart, et sort en `1` seulement sur un
lien mort en prose.

**Choix** : (c), `docs/device/harness/liens.mjs`, à côté du banc qui l'éprouve. Il lit tous les `.md` du
dépôt hors dossiers cachés, résout chaque cible relative depuis le fichier qui la porte, écarte `http(s)`,
`mailto`, les ancres seules et les schémas extérieurs, et `--json` rend le même résultat en objet. Le compte
annoncé est le **strict** ; le naïf est imprimé à côté, avec le nombre de motifs écartés, pour que l'écart se
voie au lieu de se discuter.

**Conséquences** : le banc gagne trois contrôles (61 à 63) — le dépôt sans lien mort, un lien mort en prose
(refus), un lien mort écrit entre backticks (accepté, compté comme motif écarté) — et passe de 60 à **63**.
Une limite est dite : les ancres (`#…`) ne sont pas vérifiées, et un bloc de code **indenté** n'est pas
écarté, seul le bloc clôturé l'est.
**Falsificateur** : un fichier dont un lien mort est écrit entre backticks — le script doit sortir en `0` et
l'imprimer comme motif écarté ; le même lien en prose — il doit sortir en `1` et le nommer.

## ADR-028 — `receipt` rattache `session.identifiant` au fil que la trace exporte (2026-10-17)

**Contexte** : la séance 34 a nommé cette limite « `receipt` ne vérifie pas `session.identifiant` : aucune
pièce du run ne nomme le fil, il reste donc recopié ». C'est faux à moitié : une pièce le nomme — la commande
d'export, que `faits` construit avec l'identifiant du fil (`… where m.thread_id='<fil>' …`, §1.5). Le reçu ne
la lisait pas, et recopiait `session.identifiant` de `faits.json` sans le comparer à rien.

**Mesure, faite le même jour** (banc `/tmp/mesure-ident.s5IH3U`, cas gelé, runs sans produit, trois
`faits.json`) :

| Ce que le fichier dit | Ce que la commande d'export lit | `receipt` avant |
| --- | --- | --- |
| `session.identifiant` = `fil-a` | `thread_id='fil-b'` | **accepté**, `exit 0` |
| `session.identifiant` = `fil-a` | aucun fil (`"banc"`) | **accepté**, `exit 0` |
| `session.identifiant` = `fil-a` | `thread_id='fil-a'` | accepté, `exit 0` |

Le premier cas est le plus coûteux : un `faits.json` recopié d'un autre run, ou édité sur un champ et pas
l'autre, entre dans un reçu qui affirme « la session était `fil-a` » alors que la trace exportée est celle
d'un autre fil.

**Options** : (a) laisser le champ recopié ; (b) faire lire la base du client par `receipt` pour y retrouver
le fil — mais `receipt` n'a pas le chemin de la base, il n'est que du texte dans `trace.source`, et il lui
faudrait un prérequis de plus ; (c) lire les identifiants de fil **dans la commande d'export** et refuser
quand `session.identifiant` n'est pas celui-là.

**Choix** : (c). `receipt` extrait les `thread_id='…'` de `trace.commande` et refuse : aucune mention (rien à
quoi rattacher l'identifiant), plusieurs fils distincts (un run lit un fil, le reçu ne choisit pas), un fil
différent de `session.identifiant`, et une commande qui ne lit pas les messages (aucun `from messages` : la
pièce (1) du §5 ne vient pas d'une autre requête).

**Conséquences** : `faits` produit déjà cette forme, donc aucun run réel ne change ; un `faits.json` écrit à la
main doit nommer le fil dans sa commande, ou il est refusé. Le banc gagne deux contrôles (64 et 65) et ses
fixtures `faits-bon.json` / `faits-mauvais.json` portent désormais une commande qui nomme `banc` ; le banc
passe de 63 à **65**. Limite dite : un fichier édité **sur les deux champs** passe encore — c'est un contrôle
de cohérence dans la pièce, pas un second témoin.
**Falsificateur** : un `faits.json` dont `session.identifiant` diffère du fil que `trace.commande` lit — le
reçu doit refuser ; la même valeur des deux côtés — il doit accepter.

## ADR-029 — `receipt` lit la trace exportée, et compte les échanges de la fenêtre (2026-10-17)

**Contexte** : la condition 2 du §5 — « la trace machine ne porte aucun échange dans la fenêtre du run » —
n'était pas évaluée. Le reçu portait en dur `falsificateurs.trace_non_lue_par_le_harnais: true` et une limite
« le harnais ne lit aucune des trois sources du §5.1 » : il affirmait ne pas lire, et ne lisait pas.

**Mesure, faite le même jour** (banc `/tmp/mesure-trace.Qhvqm8`, quatre exports, fenêtre 23:00–23:01) :

| Export | Contenu | `receipt` avant |
| --- | --- | --- |
| `hors.jsonl` | un échange, **une heure avant** la fenêtre | accepté, `exit 0`, falsificateur `true` |
| `vide.jsonl` | rien | accepté, `exit 0`, falsificateur `true` |
| `boue.jsonl` | une ligne qui n'est pas du JSON | accepté, `exit 0`, falsificateur `true` |
| `dans.jsonl` | deux échanges **dans** la fenêtre | accepté, `exit 0`, falsificateur `true` |

Les quatre rendent le même reçu. Un export qui prouve le run et un export qui ne prouve rien sont
indistinguables, et le falsificateur dit « non lue » même quand la trace est parfaitement lisible.

**Options** : (a) laisser la limite et le falsificateur en dur ; (b) lire le fichier et refuser quand aucun
échange n'y tombe — ce qui transformerait un falsificateur du §5 en refus, et retirerait au reçu la possibilité
de conclure « non concluant » sur une trace vide ; (c) lire le fichier, compter les échanges de la fenêtre,
porter la condition 2 comme falsificateur, et **dire** ce qui n'a pas pu être compté.

**Choix** : (c). `receipt` lit l'export ligne à ligne (JSONL du §1.5, `ts` en epoch ms), compte les lignes,
les illisibles, celles sans horodatage numérique et les échanges dans la fenêtre, écrit ce compte sous
`trace_lue`, remplace le falsificateur en dur par `trace_sans_echange_dans_la_fenetre`, et remplace la limite
« ne lit aucune source » par les limites qui disent ce que le fichier a de travers. Un export absent reste une
limite du §7 et fait mordre la condition 2. Un dossier nommé comme la trace est un refus : ce n'est pas un
export (ADR-025).

**Conséquences** : le reçu distingue enfin « le run a eu lieu » de « le fichier est là » ; les quatre conditions
du §5 sont toutes lues par le script, et `--help` ne dit plus le contraire. Le banc gagne deux contrôles (66 et
67) et deux de ses fixtures pointent désormais un **fichier** (`$B/trace/echange.jsonl`) au lieu du dossier
`$B/trace` ; il passe de 65 à **67**. Limite dite : la forme lue est celle de l'export du §1.5 (Freebuff
Desktop) ; un export d'une autre source du §5.1, dont les lignes ne portent pas `ts`, est compté comme lignes
sans horodatage, et la fenêtre ne le date pas.
**Falsificateur** : un export dont les échanges tombent hors fenêtre — le reçu doit mordre la condition 2 et le
dire ; le même export décalé dans la fenêtre — il doit passer la condition et laisser le falsificateur faux.
## ADR-030 — `receipt` re-hache la copie sous `raw/` (H1) (2026-10-17)

**Contexte** : l'[étude antagoniste](brainstorm/2026-10-17-135619-etude-antagoniste-du-protocole.md) §3 a
mesuré deux fois le même trou. Le reçu recopiait les `sha256` du manifeste (`run.mjs` 1049-1052) et
n'ouvrait jamais les fichiers qu'il citait sous `raw/<cas>/` : une copie réécrite après `collect`
(28 → 34 octets) rendait `exit 0`, `conforme`, avec l'ancienne empreinte, et une copie supprimée rendait
le même reçu, citant des chemins absents.

**Options** : (a) laisser la copie au manifeste ; (b) re-hacher les seuls fichiers listés ; (c) re-hacher
les fichiers listés, refuser un fichier que le manifeste ne liste pas, et hacher le manifeste lui-même.

**Choix** : (c), dans `verifierCopie`, appelée au reçu après la comparaison des arbres et avant les
falsificateurs. Le reçu écrit `produit.verifie{fichiers, manifeste_sha256}`. Deux précisions trouvées à
l'implémentation : un produit dont un fichier s'appelle `manifest.json` est refusé, puisque `collect` écrit
son manifeste à ce chemin et l'écraserait en silence ; et `last-message.md`, que la spec §4 fait écrire
**à la main** sous `raw/<cas>/` après `collect`, est admis, mesuré (`last_message_sha256`), et n'est pas
compté comme une copie qui a grossi. Sans cette seconde précision, H1 aurait refusé tout run conforme à la
spec.

**Conséquences** : aucun prérequis nouveau, aucun champ existant changé. Le banc gagne huit contrôles
(68 à 74 et 87) : copie réécrite, copie supprimée, fichier en trop, copie intacte et comptée, manifeste
haché, chemin qui sort de `raw/`, lien symbolique, dernier message admis et haché. Il passe de 67 à **87**
avec H3 (ADR-031). Limite dite : une copie modifiée **avant** `collect` est le produit, pas une fraude.
**Falsificateur** : une copie réécrite après `collect` dont le reçu sort en `0` — la règle est fausse ; la
même copie intacte — le reçu doit sortir en `0` et compter ses fichiers.

## ADR-031 — `receipt` relit la base nommée par `faits.json` (H3) (2026-10-17)

**Contexte** : `faits` dérive de la base du client le fil, le modèle, le répertoire, le mode, la branche,
le worktree et le premier message, et refuse ce qui ne s'y trouve pas (ADR-024). Mais le reçu lit un
**fichier** : un `faits.json` écrit à la main, ou édité après `faits`, passait sans être confronté à rien.
L'étude §3 A l'a exécuté : aucun fil n'existait dans aucune base, le reçu est sorti en `0`, `conforme`.

**Options** : (a) continuer à croire le fichier ; (b) extraire le chemin de la base de `trace.source` ;
(c) ajouter à `faits.json` un champ `trace.base` et faire relire la base au reçu.

**Choix** : (c). `faits` écrit `trace.base`, chemin absolu résolu ; `receipt` l'exige, lit la base en
`-readonly`, et refuse : fil absent, `project_path` résolu différent de `repertoire_de_travail`, mode
d'exécution non local, branche ou worktree non vide, modèle vide ou différent de `session.modele`,
`created_at` différent de `session.ouverte_le`, aucun message `user`, premier message différent de
`horodatage_debut`. Les heures se comparent par la même dérivation que `faits` (`date -d @<seconde>`), et
`session_verifiee` porte ce que la base dit, non ce que le fichier dit. `sqlite3 -version` et
`date -d @0` passent de `faits` seule à `faits` et `receipt` (ADR-026 étendu).

**Conséquences** : `faits.json` passe en v2 ; un fichier d'avant cette ADR est refusé par le nouveau reçu,
sans effet sur les reçus déjà écrits, qui refusent de s'écraser. Le banc gagne douze contrôles (75 à 86) :
champ absent, base absente, fil inconnu, répertoire hors de l'arbre, mode non local, worktree, modèle,
heure d'ouverture, premier message, aucun message, base concordante, et le prérequis `sqlite3` au reçu.
Limite dite : une base forgée avec un fil cohérent passe, et `trace.base` peut nommer une autre base que
`trace.commande` tant que H2 n'est pas fait. **Close par l'ADR-032** (2026-10-17) : la commande citée est
désormais comparée à celle que le reçu reconstruit.
**Falsificateur** : un `faits.json` qui nomme un fil absent de la base et sort en `0` — la règle est
fausse ; le même fichier avec le fil réel — il doit sortir en `0` et écrire `session_verifiee`.

## ADR-032 — `receipt` rejoue l'export et hache la trace (H2) (2026-10-17)

**Contexte** : la pièce (1) du §5, la trace machine, était un fichier que l'opérateur exportait et que
**rien** ne comparait à sa source. `faits` construisait la commande d'export et l'écrivait dans
`faits.json` ; `receipt` en lisait le fil (ADR-028) puis comptait les échanges du fichier (ADR-029), sans
jamais vérifier que le fichier **était** ce que la base rend. L'étude antagoniste (§3, lièvres L4 et L5)
le dit en deux temps : la commande n'est jamais comparée à l'exécutée, et la trace n'est pas hachée.

**Options** : (a) exécuter `trace.commande` telle que la pièce la porte ; (b) ne hacher que le fichier ;
(c) reconstruire la commande depuis les champs de la pièce, refuser une commande qui en diffère, exécuter
la requête reconstruite en `-readonly`, comparer les octets, et hacher le fichier dans le reçu.

**Choix** : (c). (a) est écartée pour une raison de sûreté, non de style : `faits.json` est un fichier
éditable, et l'exécuter donnerait à qui l'édite l'exécution de code arbitraire sur la machine du reçu. Le
gabarit de l'export est donc écrit **une fois** (`requeteExport`, `commandeExport`, `run.mjs` 767-771),
`faits` s'en sert (830), et `receipt` le rejoue depuis `trace.base`, `session.identifiant` et
`trace.chemin_exporte` (1090-1126). `trace.commande` doit être égale, caractère pour caractère, à la
commande reconstruite : un chemin de base, un fil, un chemin d'export, une requête ou une redirection qui
diffèrent sont un refus, sans que la chaîne de la pièce soit interprétée. Le rejeu capture **les octets**
de la sortie standard, jamais décodés puis ré-encodés, et les confronte au `sha256` du fichier. Le reçu
écrit `trace_lue.sha256` et `trace_lue.rejoue_le` à côté des comptes d'ADR-029 ; une trace absente reste
l'absence que le reçu disait, sans rejeu (deux `null`) et avec sa limite. `compare` re-hache la trace citée
avant de juger (1345-1358) : un reçu qui cite une trace qui n'est plus celle qu'il a lue ne juge plus le
même run. Ordre : le rejeu vient **après** H3, qui a établi que la base est lisible et porte ce fil, et
**avant** la fenêtre, qui compterait sinon les échanges d'un texte dont la provenance n'est pas établie.

**Conséquences** : `faits` ne change pas de sortie, `receipt.json` gagne deux champs sous `trace_lue`,
`compare` une vérification ; aucune commande, aucun drapeau, aucun prérequis nouveau. Le banc passe de 87 à
**96** (contrôles 88 à 96). Deux coûts trouvés à l'implémentation, tous deux dus au fait que H2 mord : les
fixtures 66 et 67 tapaient leur export **à la main** et sont désormais produites par le rejeu — donc le cas
« hors fenêtre » se déplace dans la base (premier message utilisateur sans part, message exporté une heure
plus tard), et le `faits.json` du banc, écrit à la main jusqu'ici, doit être produit par `faits`, sinon son
`trace.commande` n'est plus la commande reconstruite. Limites dites : la base reste la racine de confiance
(une base forgée, cohérente, rend un export cohérent, W1 ouvert) ; un message ajouté au fil **après**
l'export fait refuser le reçu, ce qui impose l'ordre du §1.5 ; `faits` écrit le chemin de la base sans
guillemets, donc un chemin avec espace casserait à la fois le rejeu et la comparaison ; le rejeu prouve
que le fichier est l'export de cette base **à l'instant du reçu**, pas au bon moment.
**Falsificateur** : un export dont un octet a été ajouté et un reçu qui sort en `0` — la règle est fausse ;
le même export intact — le reçu doit sortir en `0` et écrire un `sha256` égal à celui du fichier.

## ADR-033 — `receipt` mesure le budget d'échanges du cas contre les messages du fil (H4) (2026-10-17)

**Contexte** : le cas fixe son budget en prose (« **Trois échanges au plus.** Le premier porte la demande,
les suivants sont figés ici », `request.md` 193) et en machine (`demande.budget_echanges`, `3`,
`expected.json` 9), et la même demande promet que « le reçu nomme l'échange qui l'a épuisé » (`request.md`
214). Rien ne le mesurait : `grep -c budget docs/device/harness/run.mjs` rendait **0**, et une session qui
prend trente échanges produit un reçu identique (étude antagoniste §4, W4). Le budget était une consigne,
pas une mesure.

**Options** : (a) porter le budget dans le gel ; (b) le faire écrire par l'opérateur (`--budget`) ; (c) lire
`demande.budget_echanges` dans l'attendu du cas, que `verifierLeGel` re-hache déjà au début de chaque reçu.

**Choix** : (c). (a) est écartée par construction : `empreinteDeGel` hache `fichiers` et `references`,
jamais les champs du gel lui-même, donc un budget écrit là serait éditable sans re-gel, exactement le trou
que H4 ne doit pas rouvrir. (b) remplacerait une mesure par une déclaration. L'attendu n'est pas re-haché
pour l'occasion : il fait partie des deux fichiers que le gel enregistre (rôles `attendu` et `demande`), et
il est résolu par le chemin que le gel lui donne, pas par `casesDir`, sans quoi un banc qui rejoue un gel
dont les fichiers vivent encore dans le dépôt refuserait chaque reçu.

Le **compte** est celui des messages `user` du fil, **tous**, sans filtre de fenêtre : le fil est le run
(`faits` refuse un fil ouvert ailleurs et le reçu relit cette appartenance, ADR-031), `horodatage_fin` est
un instant choisi par l'opérateur et un budget qu'on peut réduire en reculant la fin ne mesurerait rien, et
l'export du §1.5 ne filtre pas non plus (ADR-032). Un échange est un message, pas une part : les appels
d'outils sont des parts de `parts_json`, et l'export rend une ligne par part. Les tours de l'opérateur sont
comptés, pas les questions de la session : trois questions dans un seul message consomment un échange.

**Refus, pas plafond de verdict.** `utilises > budget` refuse le reçu (`exit 1`, rien n'est écrit, le refus
nomme les deux chiffres, le `seq` du premier message au-delà et son horodatage), et `--verdict non concluant`
ne le sauve pas : le cas fige ses réponses, un message au-delà n'en est pas une, et le reçu attesterait un
run que le cas ne décrit pas. L'**épuisement** exact (`utilises == budget`) n'est pas un défaut : le reçu
s'écrit, et `echanges.epuise_par` nomme l'échange qui a consommé le dernier tour (`{seq, ts}`), seul cas où
il n'est pas nul. L'ordre est celui de la forme du run : après H3 et H2 qui ont établi les pièces, avant la
fenêtre qui compte les échanges de la trace.

**Conséquences** : `receipt.json` gagne `echanges{budget, utilises, epuise_par}` (run.mjs 1136-1193, champ
écrit en 1364) ; aucune commande, aucun drapeau, aucun prérequis nouveaux, une requête de plus sur une base
déjà ouverte. Le banc passe de **96 à 102** (contrôles 97 à 102) : un message sous le budget, trois messages
pour un budget de trois avec `epuise_par` nommant le seq 5, quatre messages refusés avec les deux chiffres
et le seq en trop, le même refus sous `--verdict non concluant`, et deux cas recopiés puis **re-gelés**
(`freeze --refreeze`) dont l'attendu ne porte aucun budget ou en porte un illisible. Limites dites : la base
reste la racine de confiance (un fil forgé de trois messages passe) ; un fil continué après le run fait
refuser ; le reçu lit un scalaire de l'attendu, ce que la spec du protocole réservait au juge (un entier,
jamais le contenu), et cette porte tient par discipline ; aucune session réelle.
**Falsificateur** : un fil à quatre messages `user` pour un budget de trois dont le reçu s'écrit — la règle
est fausse ; le même fil à trois messages — le reçu doit s'écrire et `epuise_par.seq` nommer le troisième.

## ADR-034 — `preflight` écrit une porte, et `receipt` la confronte (H5) (2026-10-17)

**Contexte** : `preflight` est la seule commande qui refuse avant le fait — un dossier qui n'est pas celui
que le gel nomme « travail », un arbre qui a bougé, un texte qui n'est pas le §5 substitué (banc 1 à 13 et
27 à 31, éprouvés). Puis elle ne laissait rien : `grep -c "gate\.json" docs/device/harness/run.mjs` rendait
**0**, et un run qui saute la porte produit un reçu indiscernable d'un run qui l'a passée (étude antagoniste
§4, W5). En amont, le gel ne fixe pas la géométrie : `empreinteDeGel` ne hache que les fichiers du cas et
les références, jamais `arbres`, donc « où le run a eu lieu » reste un champ que l'opérateur édite.

**Options** : (a) faire signer la porte — une clé, un HMAC ; (b) demander à l'opérateur une déclaration
`--porte` ; (c) écrire un `gate.json` dans le dossier du run, mesuré par la porte elle-même, et le
confronter au gel, à l'arbre et au dossier du run.

**Choix** : (c). (a) déplace la racine de confiance vers une clé posée sur la même machine, que rien ne
protège contre qui écrit le fichier, et un tiers ne pourrait pas mieux la vérifier ; (b) remplacerait une
mesure par une déclaration.

La porte écrit ce qu'elle vient de vérifier, **en dernier**, après tous ses refus : `type`, `cas`,
`passe_le` et `passe_le_epoch` (**secondes**, comme `gele_le_epoch` et `birth_epoch`, pas millisecondes comme
les `ts` des messages), `repertoire`, `gel{chemin, empreinte, gele_le_epoch}`, `arbre` (la mesure `gitTree`
entière, non retaillée), `texte` ou `null`. Pas de champ `commande` : rien ne la relirait. `--run` devient
obligatoire — une porte qui ne laisse pas de trace n'est plus une porte —, une porte existante n'est pas
écrasée, et un `--run` qui n'est pas un répertoire est refusé avant l'écriture, qui aurait sinon sorti en
trace de pile.

Le reçu la lit **après les champs et les chemins, avant le contrôle du fil** : elle est la condition
préalable du run, pas une de ses pièces. Neuf refus : absente ; illisible ou d'un autre `type` ; d'un autre
cas ; d'un autre gel (empreinte) ; d'un autre arbre que celui du gel (`memeArbre` et chemin résolu) ; d'un
autre dossier que `faits.repertoire_de_travail` (liens résolus) ; antérieure au gel ; d'un `head_complet`
qui n'est plus celui mesuré au reçu ; ou d'un `texte.sha256` qui n'est pas le §5 substitué, recalculé par la
même fonction que la porte (`texteDuCas`). Le huitième est le seul qui confronte la porte à une mesure
postérieure : un `git commit` dans l'arbre de travail déplace le HEAD, et rien ne le refusait jusqu'ici
(`memeArbre(avant, apres)` ne se plaint que d'un arbre **inchangé**).

**Ce que la porte ne prouve pas** : elle est forgeable. Recopier l'empreinte du gel, l'arbre et un instant
plausible produit un fichier que le reçu accepte. H5 rend le saut visible et une porte étrangère réfutable,
jamais le passage impossible : c'est la nature de `attendu_vu`, une discipline rendue visible et confrontée
à ce qui peut l'être. Et l'ordre porte / session n'est pas mesuré : la seule borne indépendante serait le
premier message `user`, c'est-à-dire la base du client, et la comparaison forcerait le banc à dater ses fils
après la porte. La limite est dite dans la spec (§12) et dans ce que le reçu ne porte pas.

**Conséquences** : `preflight` gagne `--run` obligatoire et écrit `<run>/gate.json` ; `receipt.json` gagne
`porte{chemin, sha256, cas, passe_le, passe_le_epoch, repertoire, gel_empreinte, gele_le_epoch, arbre,
texte_sha256}` ; `compare` re-hache la porte citée, comme il re-hache la trace depuis l'ADR-032. Le §5
substitué est dérivé **une seule fois** (`texteDuCas`), employé par la porte et par le reçu : deux copies
dériveraient comme deux copies du gabarit d'export auraient dérivé. Le banc passe de **102 à 112** : dix
contrôles (103 à 112), cinq acceptations de `preflight` qui reçoivent `--run` (1, 2, 11, 13, 27), les refus
de `preflight` qui le reçoivent aussi pour refuser pour la raison qu'ils nomment, et une porte par dossier de
run (le helper `porte` du banc, 37 dossiers). Le contrôle 15 change de refus : la porte, lue avant le fil,
nomme le dossier qu'elle a autorisé là où H3 nommait la base ; le refus de H3 reste éprouvé par 78. Limites :
aucune session réelle, la porte d'un vrai run n'a jamais été écrite ; le contrôle 107 déplace un HEAD dans le
clone du banc, jamais dans l'espace de travail, et n'éprouve donc pas un commit réel dans l'arbre gelé.

**Falsificateur** : un reçu écrit pour un dossier de run sans `gate.json` — la règle est fausse ; une porte
dont la `porcelain` diffère de celle du gel, acceptée — le refus de l'arbre est faux.

## ADR-035 — le tableau a une forme mécanique, et F1 et F2 la lisent (H6) (2026-10-18)

**Contexte** : l'attendu du cas, gelé, porte deux falsificateurs que rien ne lit. F1 : « le `birth` d'un
fichier sous `terrain/aidd_docs/` est antérieur à l'horodatage du message qui porte le tableau ». F2 : « la
trace ne porte aucun tableau, ou porte des écritures avant tout tableau ». Le reçu comparait la naissance des
produits à l'instant du **gel**, pas à celui du message, et comptait les échanges de la fenêtre sans rien
savoir d'un tableau. L'étude antagoniste (§6, ombre 3) le dit en une phrase : « « le tableau » n'est pas une
forme. » Tant qu'elle n'est pas écrite, F1 et F2 restent des lectures humaines.

**Options** : (a) laisser les deux en lecture humaine ; (b) lire un type de part dédié au tableau, s'il
existait ; (c) écrire la forme dans le harnais : un bloc de lignes reconnaissable dans une part `text` d'un
message `assistant`, son instant, et ce qu'un acte d'écriture est.

**Choix** : (c). (b) n'a pas d'objet : les genres de parts mesurés dans les bases du client de ce poste sont
`text`, `reasoning`, `tool`, `agent`, `ad`, `changes`, `compaction`, `notice`, et aucun ne nomme un tableau.
La forme, écrite une seule fois (`tableauDeTrace`, `run.mjs` 1010-1042) : un bloc maximal de lignes consécutives où chaque ligne commence et
finit par `|`, la deuxième est une séparatrice (`-`, `:`, espaces, au moins un `-`), la première porte au
moins deux cellules, et le bloc compte au moins trois lignes. Dans une part `text` d'un message `assistant`
seulement : ce que la session **montre** est ce qu'elle écrit dans une part `text` ; un tableau rendu en
`reasoning` n'est pas montré, et ne compte pas. L'instant du tableau est le `ts` du message qui porte le
**premier** tableau de la trace ; absent, il est `null`, et c'est une absence, pas une erreur.

**Un acte d'écriture** est une part `tool` dont le nom porte un des mots déclarés
(`write|edit|create|patch|apply|delete|move|rename`, insensible à la casse) **et** dont l'entrée nomme un
chemin (`input.path`). La seconde moitié n'est pas un ornement : elle est née d'une mesure, faite le
2026-10-18 dans la base du client de cette machine. Les noms d'outils y sont mesurables (`toolName`), et
`write_todos` porte le mot `write` sans écrire un fichier du produit : compter par le nom seul aurait refusé
tout run qui tient sa liste de tâches avant de montrer son tableau. La sonde est faite, et elle est le
falsificateur de la règle : le harnais privé de la condition `chemin_outil !== null` refuse le fil de
contrôle 118 par `une écriture précède le tableau : seq 2, outil « write_todos » (§5, F2)`.

**Ce que le reçu gagne, et ce qu'il refuse.** `receipt.json` gagne `tableau{forme, present, seq, ts, lignes,
colonnes}` et trois falsificateurs : `tableau_absent`, `ecriture_avant_tableau` (liste de `{seq, ts, outil,
chemin}`), `produit_ne_avant_le_tableau` (liste de `{chemin, birth, tableau_ts}`, comparée au `ts` du tableau
et non plus au gel). Trois refus s'y joignent : aucun tableau ; une écriture avant lui ; un produit né avant
lui. Deux limites, jamais des refus : une trace sans nom d'outil (export d'avant ce durcissement) rend
l'ordre non mesurable, et un tableau sans `ts` lisible ne se date pas.

**L'export gagne deux champs**, `outil` et `chemin_outil`, écrits une seule fois (`requeteExport`,
`run.mjs` 844-851) : le nom de l'outil et le chemin que son entrée nomme n'étaient nulle part dans la pièce
que le run cite. Conséquence tenue : la commande d'export est reconstruite au reçu, caractère pour caractère
(ADR-032), donc les pages qui la portent (conduite §1.5, chaîne de la liste de contrôle) sont réécrites dans
le même geste, et un `faits.json` d'avant ce durcissement est refusé — exactement, la pièce vient d'une autre
révision du harnais.

**Conséquences** : `receipt.json` gagne un champ et trois falsificateurs, l'export deux champs, la conduite
et la chaîne leur requête ; aucune commande, aucun drapeau, aucun prérequis nouveaux. Le banc passe de
**112 à 118** (contrôles 113 à 118) : un tableau de quatre lignes dans une part `text` précédée d'un tableau
en `reasoning` (le tableau gardé est celui de la part `text`, seq et `ts` à l'appui), une ligne de prose
seule, un tableau de deux lignes, une écriture avant le tableau, un produit né avant l'instant du tableau, et
un fil dont les outils ne portent pas de nom — les deux dernières limites à l'appui. Limites dites : une
table forgée dans la trace reste possible (même racine de confiance que le reste de l'export) ; un outil qui
écrit par un autre champ que `input.path`, ou en ligne de commande, échappe à la règle, et le reçu le dit
(limite « ne nomment aucun chemin ») ; aucune session réelle n'a encore rendu de tableau devant ce harnais,
donc le reçu d'un vrai run reste à écrire.
**Falsificateur** : le tableau rendu seulement en `reasoning`, accepté — la forme est fausse ; le même
tableau déplacé dans la part `text`, refusé — la forme est fausse aussi. Et `write_todos` avant le tableau,
refusé comme une écriture : c'est le faux positif que la condition de chemin a mesuré, puis écarté.

## ADR-036 — Un second cas, jouet, et sa nature (2026-10-18)

**Contexte** : le plan du guide demande « un cas jouet, à écrire ou à extraire du cas réel », et le banc
n'avait aucune fixture qui traverse **un cas entier** : chaque commande a ses contrôles, la couture entre
elles n'était éprouvée que sur des morceaux recollés. Le cas réel ne s'y prête pas : ses arbres pèsent
60 Mo, vivent sur cette machine, et un run a déjà eu lieu sur son gel.

**Options** : (a) pas de cas jouet, le guide s'en passe ; (b) les arbres du jouet sont ceux du cas réel —
rien à construire, mais le jouet ne s'ouvre que sur cette machine et n'ajoute rien ; (c) deux dépôts jouets
**publiés** sur GitHub — l'esprit de l'ADR-017 à la lettre, au prix du réseau, de deux dépôts de plus et de
quatre fichiers ; (d) deux dépôts de deux fichiers, **reconstruits par un script compagnon** à dates et
signatures figées, sous la racine déclarée.

**Choix** : (d), et la **forme 1** du brainstorm : la promesse en miniature — un tableau rendu, puis un
fichier écrit après la réponse figée. Le cas `2026-10-18-085308-cas-jouet` porte deux pièces (demande,
attendu) et son gel (`empreinte 50664060`, **zéro référence**), le script
`2026-10-18-085308-cas-jouet-arbres.sh` vit dans `CASES/` avec un **tiret** — donc hors du préfixe `<cas>.`
qui définit les fichiers du cas et l'empreinte —, et ses arbres portent `refs_distants` **vide** : le gel
dit « publié nulle part », et le script est la réponse à « où les retrouver ». Les deux têtes sont épinglées
(`1b3b632a…`, `62c48e16…`) : les figer a demandé de neutraliser trois réglages de git qui auraient pu
réécrire les octets ou signer le commit (`core.autocrlf`, `commit.gpgsign`, nom et courriel posés par le
script). Cinq falsificateurs, les **mêmes identifiants** que le cas réel pour que le guide les nomme une
fois : F1 (produit né avant le tableau), F2 (aucun tableau, ou une écriture avant lui), F3 (chemin hors du
§6), F5 (écriture hors du répertoire de travail), F8 (aucun produit) ; budget de **deux** échanges, qu'exige
la lecture du budget au reçu (H4, ADR-033).

**Conséquences** : `CASES/` porte son premier second cas ; le banc passe de **118 à 130** (contrôles 119 à
130) et traverse la chaîne entière — gel, porte, export, faits, collect, reçu, juge — sur **un cas**, sans
session, en refusant deux fois (F2 sans tableau, F1 produit né avant lui) ; `REPLAY.md` gagne le bloc de
reconstitution du jouet, et le gel du cas réel (`0d9a2180`) n'est pas touché.

**Limites dites** : aucune session n'ouvre ce cas, son budget n'est jamais consommé, et il n'est pas
publié ; le `conforme` du contrôle 126 est **écrit par nous** sur une fixture — il prouve que la chaîne
l'accepte, jamais qu'un run le mériterait ; le déterminisme du script vaut pour une machine dont git
applique les réglages laissés par défaut (les trois neutralisés sont ceux qui l'auraient rompu ici) ; rien
du client n'est éprouvé par ce cas.

**Falsificateur** : deux exécutions du script sur deux machines rendant des têtes différentes — la
reconstruction est fausse ; le re-gel du bac rendant une empreinte autre que celle du gel committé — le gel
committé est faux.
## ADR-037 — Un run, un dossier : une porte remplacée reste sur place et porte sa note (2026-10-18)

**Contexte** : le second run n'est pas encore ouvert, et **deux portes** l'attendent —
`docs/device/runs/2026-10-18-070251-4c39e5c5-db61c44/gate.json`, passée le 2026-10-18 à 07:02:51 sur la
révision de dispositif `db61c44` et **commitée** dans `7e05b9c` (le premier `gate.json` réel), et
`docs/device/runs/2026-10-18-075625-4c39e5c5-dbd85ba/gate.json`, passée à 07:56:25 sur `dbd85ba` et non
commitée. Mesuré le 2026-10-18 : les deux sont **identiques** une fois `passe_le` et `passe_le_epoch`
ôtés — même gel `0d9a2180`, même arbre `416ec1f` et `porcelain` vide, même texte `832036f7` (254 octets).
Entre les deux, H6 est entré (ADR-035) : le harnais qui produira les pièces n'est plus celui
que le premier dossier nomme. ADR-034 prescrit qu'une porte s'écrive et que le reçu la
confronte ; elle ne dit rien d'une porte **remplacée**, ni lequel de deux dossiers est celui du run. Le
premier dossier porte en outre un `trace/` vide, que git ne suit pas.

**Options** : (a) supprimer le dossier périmé — l'état le plus petit, mais effacerait un passage réel,
exigerait un commit qui défait un autre, et rien ne dirait ensuite pourquoi une porte neuve est apparue ;
(b) laisser les deux en l'état — l'ambiguïté reste, et l'opérateur choisit au moment de l'ouverture,
exactement quand le §4.0 interdit d'improviser ; (c) garder le dossier périmé, l'annoter d'une note datée
qui nomme sa remplaçante et la raison, et écrire la règle.

**Choix** : (c). Le dispositif ne supprime pas une pièce datée ; il l'annote.

**La règle.**

1. **Un run, un dossier.** Le dossier du run est **la porte la plus récente passée pour ce cas avant le
   premier message**. Il reçoit la trace, `faits.json`, la copie sous `raw/`, le reçu et le jugement ;
   aucune pièce du run n'est écrite ailleurs.
2. **Une porte remplacée reste, et se date.** Toute porte plus ancienne est une pièce close : elle ne reçoit
   aucune pièce du run, elle n'est jamais réutilisée comme dossier de run, et elle porte une note datée qui
   nomme sa remplaçante et la raison du remplacement.
3. **Ce qui remplace une porte** : un commit du dispositif qui touche le harnais depuis son passage (le nom
   du dossier cite la révision du dispositif, et le harnais qui jugera n'est plus celui-là) ; un re-gel du cas
   (le reçu refuserait la porte : elle cite une autre empreinte) ; ou un dossier que l'opérateur nomme contre
   une révision plus récente. Le remplacement se fait **avant** le premier message, jamais pendant le run.

**Conséquences** : le dossier `2026-10-18-070251-4c39e5c5-db61c44` reçoit sa note datée et perd son
`trace/` vide — **0 entrée**, un artefact, pas une pièce ; la
[liste de contrôle](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-17-095643-liste-de-controle-ouverture-second-run.md)
§4.0 reçoit le choix de la porte la plus récente et le renvoi ici ; le numéro **037** décale les trois ADR
réservées de l'[orchestrateur](tasks/2026_10/2026-10-18-070820-orchestrateur-interactif-du-test/2026-10-18-071018-spec.md)
en **038, 039, 040**, même geste que celui qui les avait décalées de 036 à 037-039. Le harnais ne change
pas : `receipt` lit le dossier qu'on lui donne, et rien en lui ne peut dire « lequel est le run » une fois
deux portes écrites.

**Ce que ce n'est pas** : une mesure. La règle est une discipline rendue visible, comme `attendu_vu` : ce
qui la rend vraie, c'est que le dossier choisi porte toutes les pièces, et qu'aucune autre n'en porte. Elle
ne remplace pas ADR-034, elle en règle le cas qu'elle avait laissé ouvert.

**Falsificateur** : un run dont la trace ou le reçu vivent dans un dossier qui n'est pas la porte la plus
récente passée pour son cas avant son premier message ; ou une porte remplacée sans sa note.

## ADR-038 — L'orchestrateur est un couple page + commande, et la page ne recopie aucun refus (2026-10-18)

**Contexte** : une personne qui ne connaît pas ce dépôt ne peut aujourd'hui traverser un test qu'en lisant
la conduite, le harnais, les cas et le banc — quatre pages, dont aucune ne dit « commence ici ». Le
[brainstorm](brainstorm/2026-10-18-070921-orchestrateur-interactif-du-test.md) §3 a écarté les trois
formes possibles (un seul script, une page seule, un couple) au profit d'un **couple** : une page qui dit
ce qui se dit et quand, une commande qui calcule. La raison est la dérive : un texte de refus recopié dans
une page cesse d'être vrai au premier commit qui change le harnais, et personne ne le remarque, parce
qu'une page ne teste pas.

**Options** : (a) la page seule, avec les commandes et les refus copiés — lisible, et fausse dès le
lendemain ; (b) la commande seule, sans page — exacte, et muette sur ce qu'une personne doit faire des
trois gestes humains ; (c) le couple, la page renvoyant aux refus par leur condition, la commande les
imprimant.

**Choix** : (c).

**La règle.**

1. **La page ne recopie aucun texte de refus.** Elle nomme la condition et le renvoi ; le texte vient du
   harnais, recopié tel quel par l'orchestrateur, jamais reformulé.
2. **La commande n'improvise aucun contrôle.** Chaque garantie (gel re-haché, porte écrite en dernier,
   produit collecté sous l'arbre gelé, reçu unique) reste dans `run.mjs` ; `orchestrer.mjs` enchaîne et
   refuse, il ne vérifie pas à nouveau.
3. **L'orchestrateur imprime quatre blocs et rien d'autre** ([ADR-040](#adr-040--le-contrat-de-narration-quatre-formes-six-lignes-la-commande-avant-sa-sortie-2026-10-18)),
   et une étape qui refuse arrête la chaîne : il ne contourne pas un refus, ne relance pas la commande qui
   a refusé, et ne réécrit jamais un reçu existant.
4. **Il n'ouvre aucune session** : les trois gestes humains restent humains, et le runbook dit lesquels.

**Conséquences** : `docs/device/ORCHESTRATEUR.md` (le runbook) et
[`harness/orchestrer.mjs`](device/harness/orchestrer.mjs) (les cinq sous-commandes) naissent ensemble ; le banc
gagne les contrôles **131 à 148**, un par refus du §7 de la spec plus les acceptations et le compte des
lignes ; `suite` gagne `--produit`, parce que le chemin du produit est une lecture du skill que la fabrique
ne fait pas, et deux refus qui n'étaient pas au tableau : aucun produit nommé, et un produit hors de l'arbre
travail.

**Ce que ce n'est pas** : une mesure du dispositif. Le couple rend le parcours lisible, il ne rend pas le
verdict plus vrai ; un cas fabriqué le dit lui-même (attendu incomplet, [ADR-039](#adr-039--le-squelette-dattendu-sa-marque-a_remplir-et-la-limite-attendu_incomplet-qui-plafonne-le-verdict-2026-10-18)).

**Falsificateur** : un texte de refus présent dans le runbook ; ou une garantie du harnais réécrite dans
l'orchestrateur, au lieu d'être invoquée.

## ADR-039 — Le squelette d'attendu, sa marque `a_remplir`, et la limite `attendu_incomplet` qui plafonne le verdict (2026-10-18)

**Contexte** : la fabrique de cas ([spec §6](tasks/2026_10/2026-10-18-070820-orchestrateur-interactif-du-test/2026-10-18-071018-spec.md))
dérive tout ce qui est mécanique — la demande, les deux origines, le gel, les falsificateurs du dispositif
(F3 à F9) — et ne peut pas dériver **la promesse du skill** : c'est une lecture, et une fabrique qui
l'inventerait produirait un attendu plausible et faux. Le brainstorm §5 laissait trois issues : n'accepter
qu'un skill qui a déjà un cas, écrire un squelette avec la promesse à remplir, ou déduire la promesse de la
`description` du skill.

**Options** : (a) refuser tout skill sans cas existant — sûr, et stérile : la fabrique ne fabrique rien ;
(b) le squelette, la promesse marquée à remplir, et un verdict qui dit qu'il ne sait pas ; (c) déduire un
falsificateur de forme de la `description` — ne marche que sur les skills dont la promesse est un ordre
vérifiable, et ment sur les autres.

**Choix** : (b).

**La règle.**

1. **La fabrique écrit un squelette** : les falsificateurs du dispositif d'emblée, la promesse du skill
   marquée `{"id": "P", "a_remplir": true}`.
2. **Le reçu lit la marque dans l'attendu, jamais dans le gel.** Le gel hache un cas, il ne l'interprète
   pas ; et un attendu relu depuis le gel pourrait mentir sur son propre contenu.
3. **La marque pose une limite et plafonne le verdict** : `limites` porte
   « l'attendu n'a pas de falsificateur de promesse : le jugement ne peut pas dire conforme
   (attendu_incomplet) », et un verdict autre que `non concluant` est refusé, avec le motif.
4. **Le plafond vit dans `receipt`**, pas dans l'orchestrateur : le reçu est la seule pièce qui décide ce
   qu'un verdict a le droit de dire, et un plafond hors du reçu se contournerait en appelant le harnais.

**Conséquences** : `receipt` gagne la lecture récursive de la marque, la limite et le refus ; le contrat de
sortie de `run.mjs` ne bouge pas ; l'orchestrateur n'écrit jamais un verdict que le reçu refuserait, et
`fin` demande d'abord à blanc la valeur imposée. Mesuré le 2026-10-18 sur un cas fabriqué : `conforme`
refusé nommant `attendu_incomplet`, `non concluant` écrit avec la limite, et un reçu de banc qui porte
exactement une limite (contrôles 142 et 143).

**Ce que ce n'est pas** : une mesure de la qualité. Un `non concluant` dû à l'attendu incomplet ne dit rien
du skill : il dit que le juge n'a pas encore de quoi le juger.

**Falsificateur** : un reçu `conforme` sur un cas dont l'attendu porte encore `a_remplir` ; ou une limite
`attendu_incomplet` écrite sans que le verdict soit plafonné.

## ADR-040 — Le contrat de narration : quatre formes, six lignes, la commande avant sa sortie (2026-10-18)

**Contexte** : le brainstorm §3 promet qu'une personne qui ne connaît rien au dépôt finit sans lire une
autre page que ce que l'orchestrateur imprime (AC1 de la [spec](tasks/2026_10/2026-10-18-070820-orchestrateur-interactif-du-test/2026-10-18-071018-spec.md)).
Une sortie de console brute ne tient pas cette promesse : elle dit ce qui est arrivé, jamais ce qui devait
arriver, et une sortie recopiée sans sa commande ne se rejoue pas.

**Options** : (a) laisser chaque commande imprimer ce qu'elle veut — lisible pour qui l'a écrite, opaque
pour les autres ; (b) un bloc unique et long par exécution — complet, et illisible ; (c) quatre formes
fermées, six lignes au plus, la commande précédant sa sortie.

**Choix** : (c).

**La règle.**

1. **Quatre formes, et rien d'autre** : `▸ ÉTAPE n/N`, `▸ REFUS`, `▸ VERDICT`, `▸ FIN`.
2. **Six lignes au plus**, `▸` compris, une ligne vide entre deux blocs, et **rien entre elles**.
3. **La commande précède sa sortie** : `commande` dit ce qui a été lancé, `obtenu` recopie la console —
   jamais un résumé, et jamais une sortie sans sa commande.
4. **Un refus n'est pas reformulé** : `▸ REFUS` recopie le texte du harnais, puis dit ce qu'il empêche et
   le geste qui suit, ou « rien : cette étape s'arrête ici ».
5. **Le verdict dit ce qu'il n'atteste pas** : la dernière ligne de `▸ VERDICT` répète que le reçu atteste
   qu'un run a eu lieu, jamais que le travail vaut.

**Conséquences** : les quatre formes sont imprimées par `orchestrer.mjs` et écrites dans le runbook ; le banc
les compte (contrôle 148 : aucun bloc de plus de six lignes sur la sortie de `lire`) ; la forme est un
format, pas un style — un bloc de sept lignes est un défaut, et le contrôle le dit.

**Ce que ce n'est pas** : une preuve de clarté. Le compte des lignes mesure la forme, jamais si la personne
a compris ; AC1 ne se mesure qu'avec un lecteur étranger, et il n'a pas encore été mesuré.

**Falsificateur** : une sortie de l'orchestrateur qui porte un bloc hors des quatre formes, plus de six
lignes, ou une sortie sans la commande qui l'a produite.

## ADR-041 — Le squelette est rempli par l'agent, et confirmé par la personne (2026-10-18)

**Contexte** : le geste promis est « tu arrives, tu dis *test ça*, le dispositif te prend en main ». La
première version du [guide utilisateur](guide/guide-utilisateur.md), écrite le jour même, en faisait
l'inverse : cinq commandes à taper, un `expected.json` à éditer, un falsificateur à inventer, un re-gel à
lancer. L'opérateur l'a relevé, et c'était juste : ce parcours demande à celui qui vient faire tester son
skill de faire le travail de lecture du dispositif. [ADR-039](#adr-039--le-squelette-dattendu-sa-marque-a_remplir-et-la-limite-attendu_incomplet-qui-plafonne-le-verdict-2026-10-18)
avait laissé la promesse du skill « à la personne » : la lettre de cette règle visait la fabrique, qui ne
doit pas **inventer** une lecture, pas l'agent, qui peut la faire.

**Options** : (a) la personne continue de remplir seule, et le guide reste une page d'exploitation ;
(b) l'agent remplit le squelette sans rien demander, la personne lit le verdict ; (c) l'agent lit le skill,
propose la promesse et le produit, la personne confirme ou corrige, puis l'agent écrit et re-gèle.

**Choix** : (c).

**La règle.**

1. **L'agent lit le skill et propose** la promesse en une phrase, le produit attendu, la ligne du §5, le §6
   de la demande, la marque `P` de l'attendu et la première des deux réponses figées.
2. **La personne confirme ou corrige** ces six lectures. C'est son intention qui est jugée : l'agent ne la
   devine pas, il la lui rend lisible.
3. **La fabrique ne change pas.** `cas` écrit toujours un squelette marqué `a_remplir`, et le reçu plafonne
   toujours à `non concluant` tant que la marque est là : la règle dit qui remplit, pas ce que la machine
   devine.
4. **Le re-gel reste explicite** (`freeze --refreeze`), appelé par l'agent après confirmation, jamais en
   effet de bord d'une autre commande.

**Conséquences** : `ORCHESTRATEUR.md` §2 et §4 disent qui remplit et qui tranche ; le guide utilisateur est
réécrit autour de la prise en main, et les commandes passent en annexe. Le compte des gestes humains ne
bouge pas (ouvrir le fil, coller le texte, répondre la phrase figée) : la personne gagne la lecture de son
skill, pas une commande de moins à taper sur elle.

**Ce que ce n'est pas** : une mesure. Rien ne vérifie *a posteriori* que la promesse confirmée était celle
du skill ; c'est une lecture, et le reçu porte la phrase confirmée, pas la preuve qu'elle était juste.

**Falsificateur** : un parcours où l'agent remplit la promesse et écrit le reçu sans que la personne l'ait
confirmée ; ou une page qui rend une commande obligatoire à la personne sans qu'aucun geste humain ne
l'exige.

## ADR-042 — Un dépôt sale est refusé, sauf `--tel-quel` explicite (2026-10-18)

**Contexte** : le scénario que l'opérateur a posé le 2026-10-18 : « je suis en train de travailler sur un
truc (dernier commit, ou fichier modifié non commité) et je demande de tester ». Mesuré sur un bac : un
skill modifié **non commité**, puis `cas` → `exit 0`, `freeze ok`, et `diff` entre l'arbre de travail et la
copie sous test → **DIFFERENTE** ; le `porcelain` de `framework-origin` restait **vide**, et aucun message
ne le disait. La cause est mécanique : `cas` clone `origine/framework` pour fabriquer `framework-origin`, et
un clone ne porte que les commits. Le run aurait jugé le dernier commit pendant que la personne croyait
tester son fichier ouvert.

**Options** : (a) embarquer les modifications d'office dans la copie — rien à commiter, mais le test porte
alors sur un état qui n'est dans aucune révision, sans que personne l'ait demandé ; (b) avertir sans
bloquer — le run part quand même, et l'avertissement se perd dans la sortie ; (c) refuser par défaut, les
fichiers nommés, avec un drapeau explicite `--tel-quel` pour porter l'arbre de travail tel quel.

**Choix** : (c).

**La règle.**

1. **Un dépôt sale est refusé avant toute écriture.** `cas` lit `git status --porcelain` du dépôt qui porte
   le skill, et du terrain quand il est donné ; non vide, il sort en `1`, nomme jusqu'à trois fichiers par
   arbre et dit les deux issues : commiter, ou `--tel-quel`.
2. **`--tel-quel` porte l'arbre, et le dit.** La copie est faite par copie du dossier au lieu d'un clone,
   donc les modifications non commitées sont dans la copie sous test, et le `porcelain` non vide que le gel
   enregistre atteste que ce run-là portait un arbre de travail.
3. **Le terrain par défaut n'est pas concerné** : quand `--terrain` est absent, le clone jetable du dépôt
   courant reste un clone, et le refus ne bloque pas l'essai rapide.
4. **Le silence est interdit** : aucune forme ne laisse partir un run sur une copie qui n'est pas ce que la
   personne a sous les yeux sans le lui dire.

**Conséquences** : le banc gagne les contrôles **150** (dépôt du skill sale refusé), **151** (`--tel-quel`
porte la modification) et **152** (terrain sale refusé) ; `ORCHESTRATEUR.md` §5 compte ce troisième refus
propre à l'orchestrateur ; le guide utilisateur nomme la condition « ton dépôt doit être propre ».

**Ce que ce n'est pas** : une mesure de ce que la personne voulait tester. `--tel-quel` dit « cet arbre,
tel quel » ; il ne dit pas que cet arbre est le bon, ni qu'il correspond à une révision.

**Falsificateur** : un run dont la copie sous test diffère de l'arbre de travail sans que le reçu ni le gel
ne le disent ; ou un `--tel-quel` dont le gel enregistre un `porcelain` vide.

## ADR-043 — Une frontière d'adaptation pour les deux clients (2026-10-20)

**Contexte** : le même cas doit pouvoir être conduit sous Freebuff ou sous opencode. Les deux n'ont ni la
même source (base `desktop-v2.db` d'un côté, export JSON du CLI de l'autre) ni la même forme de trace ;
laisser `faits`, `receipt` et `suite` lire chaque schéma directement dupliquerait les contrôles et
laisserait deux chemins diverger.

**Choix** : un module `docs/device/harness/clients.mjs` expose deux implémentations derrière une interface
normalisée : `session`, `exportTrace`, `replayTrace`, `budget`, `commandeAttendue`, et `detect`/`detectAll`.
Les commandes du harnais ne parlent qu'à cette interface ; une erreur de client est une `Error` dont le
message est le refus, que l'appelant préfixe de sa commande.

**Conséquences** : `faits` et `receipt` importent la frontière ; le reçu rejoue l'export par elle, jamais
par une chaîne qu'il exécuterait ; le banc peut substituer un faux `opencode` sans base ni réseau. Le
contrat de sortie est la session normalisée du §3.1 de la spec et le JSONL du §3.2.

**Ce que ce n'est pas** : une garantie d'intégrité du client ni du CLI. Un faux binaire forge un export,
comme un faux `sqlite3` forge une base.

**Falsificateur** : un `faits` ou un `receipt` qui lit un schéma de client hors de `clients.mjs`, ou deux
formes de trace qui ne se comparent plus au même endroit.

**Constat du 2026-10-20.** L'adaptateur a été exercé par un run réel, pas seulement par le faux binaire du
banc : `receipt.json` du run `2026-10-20-202333-50664060-1028c8b` porte `session_verifiee.outil =
"opencode"`, `trace_verifiee.sha256` et `brut_sha256`, et le rejeu du JSONL normalisé passe. Le banc
reste la preuve du contrat ; ce reçu est la preuve d'un appel réel.

## ADR-044 — Le client est un fait du run, jamais un paramètre du cas (2026-10-20)

**Contexte** : le même cas, le même gel et la même porte doivent servir aux deux clients. Inscrire le
client dans le cas obligerait à geler deux exemplaires et à choisir avant de savoir qui a ouvert.

**Choix** : `faits.session.outil` et `faits.trace.client` nomment le client ; le reçu refuse un champ hors
de `freebuff|opencode`, ou deux champs qui se contredisent. `faits` accepte `--client`, ou le déduit de
`--base`/`--store` ; `suite` accepte `--client auto|freebuff|opencode`, et `auto` refuse l'ambiguïté en
nommant `--client`.

**Conséquences** : `session_verifiee.outil` est écrit pour les deux clients ; `--store` avec
`--client freebuff` est un refus ; le cas reste inchangé d'un client à l'autre. Les trois gestes humains
sont les mêmes, avec un fil Freebuff ou une session opencode.

**Ce que ce n'est pas** : une preuve que le client est celui que la personne croit. Le client est un fait
de la pièce, confronté à ce que la source rend, pas une signature.

**Falsificateur** : un reçu dont `session.outil` diffère de `trace.client`, ou un cas qui nomme un client.

**Constat du 2026-10-20.** Le premier run réel porte `session.outil = "opencode"`, `trace.client =
"opencode"` et le modèle `ollama/qwen3:8b` ; le cas jouet n'a pas été modifié pour choisir son client. Le
même gel et la même porte restent donc disponibles pour un run Freebuff.

## ADR-045 — L'ordre de la trace est celui des lignes (2026-10-20)

**Contexte** : deux parts d'un même message peuvent porter une écriture et le tableau ; le `seq` seul ne
dit pas laquelle vient d'abord, et une écriture antérieure au tableau doit mordre F2 même dans le même
message.

**Choix** : le `seq` reste le numéro de message ; deux parts le partagent. `tableauDeTrace` rend un
`index` (position dans le JSONL), et `ecriture_avant_tableau` compare les `index`, pas les `seq`.

**Conséquences** : le `tableau` gagne `index` ; les entrées de `ecriture_avant_tableau` gagnent `index` ;
le `seq` reste. Une écriture avant le tableau dans le même message est vue ; une écriture après ne mord
pas. Les deux clients produisent le même ordre, messages puis parts.

**Ce que ce n'est pas** : une datation de la part. Le `ts` du tableau reste celui du message qui le porte.

**Falsificateur** : un tableau et une écriture du même message dont l'ordre dépend du `seq`, ou un
`ecriture_avant_tableau` vide alors qu'une écriture précède le tableau dans le JSONL.

## ADR-046 — L'export opencode est normalisé, l'export brut n'est qu'une pièce datée (2026-10-20)

**Contexte** : le CLI opencode rend un JSON dont `info.time.updated` et les jetons changent dès que la
session bouge ; comparer ce brut octet à octet refuserait un run intact, ou forcerait à ne plus rien
dire.

**Choix** : l'adaptateur normalise le JSON en JSONL, une ligne par part ; c'est ce JSONL qui est la
condition du reçu. Le brut est conservé et haché ; s'il diffère au rejeu, le reçu écrit la limite
`export_brut_instable`, jamais un refus.

**Conséquences** : `faits.trace` porte `export_brut` pour opencode ; `trace_verifiee` porte `sha256` du
normalisé et `brut_sha256` ; le reçu rejoue par le même normaliseur. Un JSONL modifié reste un refus.

**Ce que ce n'est pas** : une stabilité du format opencode. Une version qui change la forme de l'export
est refusée ou limitée, jamais devinée ; un bug systématique du normaliseur est invisible au rejeu.

**Falsificateur** : un JSONL modifié accepté, ou un brut différent qui refuse au lieu d'écrire la limite.

## ADR-047 — H6 accepte un tableau d'une colonne (2026-10-20)

**Contexte** : le premier run opencode réel du cas jouet, le 2026-10-20, a rendu un tableau Markdown
d'une colonne (`| File Path |`, une séparatrice, deux chemins). La forme de l'ADR-035 exigeait au moins
deux cellules, donc le reçu a écrit `tableau.present = false` et `tableau_absent = true` alors que
l'opérateur voyait un tableau. Le faux négatif venait de la forme, pas du run
([spec](tasks/2026_10/2026-10-20-221757-h6-tableau-une-colonne/2026-10-20-221757-spec.md)).

**Choix** : la première ligne du bloc doit porter **au moins une cellule**, et non plus au moins deux.
Les trois autres conditions de H6 sont inchangées : au moins trois lignes, deuxième ligne séparatrice,
chaque ligne commençant et finissant par `|`, part `text` d'un message `assistant`. `FORME_TABLEAU`
devient `text/assistant, >=3 lignes, 2e ligne séparatrice, >=1 colonne`.

**Conséquences** : le reçu du run réel juge le tableau présent sur une copie de ses pièces, `colonnes`
vaut `1`, et le banc gagne le contrôle **172** ; les contrôles 113 à 118 restent inchangés, dont le refus
du tableau de deux lignes et le refus de la prose. Les cas gelés ne sont pas retouchés.

**Ce que ce n'est pas** : une table de deux lignes, une ligne isolée entre deux `|`, ou un tableau rendu
en `reasoning`. La forme reste mécanique ; elle ne juge pas le contenu.

**Falsificateur** : un tableau d'une colonne, trois lignes et une séparatrice, encore refusé ; ou une
ligne de prose entre deux `|` acceptée comme tableau.

## ADR-048 — Le juge refuse une phrase qui contredit les colonnes mesurées (2026-10-20)

**Contexte** : le second run opencode du cas jouet, le 2026-10-20, a rendu un tableau de six colonnes ;
l'`output.json` écrit par `compare` disait pourtant « un tableau d'une colonne ». Le reçu mesurait
`tableau.colonnes: 6`, et le juge n'avait aucun moyen de confronter sa propre phrase à cette mesure
([spec](tasks/2026_10/2026-10-20-230502-controle-phrase-colonnes/2026-10-20-230502-spec.md)).

**Choix** : `compare` lit `receipt.tableau` ; quand le tableau est présent et que `colonnes` est un entier
positif, toute citation de colonnes de `--phrase` doit valoir ce nombre. Une citation est un nombre en
chiffres, ou un mot français de `un` à `vingt`, immédiatement suivi de `colonne` ou `colonnes` ; une
citation qui diffère est refusée, `exit 1`, sans écrire `output.json`, et le refus nomme les deux nombres
et le texte cité. Sans citation, sans tableau mesuré, ou quand toutes les citations concordent, le
comportement de `compare` est inchangé. Un `output.json` déjà présent reste refusé avant cette
confrontation, par son ancien refus.

**Conséquences** : le banc gagne les contrôles **173** (phrase de six colonnes contre un reçu à une,
refusée) et **174** (phrase d'une colonne, acceptée et écrite sur une copie du même run) ; il passe de
**172 à 174**. La phrase reste le fait de la personne, mais elle ne peut plus démentir une mesure du reçu.

**Ce que ce n'est pas** : un lecteur de prose. La règle ne comprend ni une négation (`six colonnes, pas
une` est refusée), ni un nombre composé comme tel (seul son dernier mot peut être lu), ni un nombre écrit
au-delà de vingt ; elle ne vérifie pas `difference`, ni la justesse du tableau, ni le contenu du produit.

**Falsificateur** : une phrase qui nomme six colonnes acceptée sur un reçu qui en mesure une, ou une
phrase qui nomme une colonne refusée sur un reçu qui en mesure une.

## ADR-049 — Une lecture hors du dossier du cas interdit `conforme` (2026-10-21)

**Contexte** : le second run opencode du cas jouet, le 2026-10-20, a rendu un reçu `conforme` alors que
sa trace porte deux lectures hors de son dossier, `aidd-device-work/README.md` et le `kit-ouverture.md`
d'un autre cas, puis deux `grep` dans le framework de cet autre cas. Le reçu ne mesurait que
`cloisonnement.attendu_vu`, pas les chemins lus ; le [rapport utilisateur](device/runs/2026-10-20-222845-50664060-3d0db46/RAPPORT.md)
l'a nommé, et la [spec](tasks/2026_10/2026-10-21-001614-lecture-hors-dossier/2026-10-21-001614-spec.md)
écrit la règle avant le code.

**Choix** : `receipt` lit les parts `tool` dont le nom appartient à la famille de lecture
`read|grep|glob|search|find|cat|view` et dont `chemin_outil` est nommé. Un chemin absolu est résolu tel
quel, un chemin relatif depuis le répertoire de travail du run ; les liens sont résolus quand la cible
existe, sinon le chemin absolu est comparé lexicalement. La racine autorisée est
`<racine_espace_de_travail>/<cas>` : `terrain/`, `framework-origin/` et `origine/` y vivent, le kit d'un
autre cas, le README de la racine et `CASES/` n'y vivent pas. Toute lecture hors de cette racine devient
`falsificateurs.lecture_hors_dossier` et force `non concluant` ; un `conforme` est refusé.

**Conséquences** : le banc gagne **176** (refus nommé d'un `conforme` sur une lecture hors dossier),
**177** (reçu `non concluant` qui nomme la lecture, son `seq` et son chemin) et **178** (lecture dans le
dossier non signalée, sur un reçu `non concluant` pour une autre raison), et passe à **178/178**. Le
rapport utilisateur du run historique garde ses conclusions ; un reçu reconstruit avec la nouvelle règle
ne pourrait plus être `conforme`, et aucun reçu existant n'est réécrit.

**Ce que ce n'est pas** : une mesure des commandes `shell` (la trace normalisée ne les porte pas, et le
reçu ajoute une limite nommée quand elles existent), une mesure du contenu lu, ni une preuve que la
lecture hors dossier a changé la décision de la session. C'est une règle de chemin, mécanique.

**Falsificateur** : une lecture hors dossier encore acceptée en `conforme`, ou une lecture dans le
dossier du cas signalée comme hors dossier.

**Remplacé partiellement (ADR-052, 2026-10-21)** : la racine constante `<racine_espace_de_travail>/<cas>`
est remplacée par les racines que le cas déclare dans `cloisonnement.lecture.autorisees`. Le falsificateur
se lit désormais « une lecture hors du cadre déclaré acceptée en `conforme`, ou une lecture dans ce cadre
signalée ». `origine/` n'est plus autorisé par défaut : un cas qui le lit doit le déclarer.

## ADR-050 — Le rapport utilisateur est une vue déterministe, écrite après le reçu (2026-10-21)

**Contexte** : le premier `RAPPORT.md` d'un run réel, celui du 2026-10-20, a été écrit à la main par un
agent. Il dit ce que `conforme` couvre, la lecture hors dossier que le reçu ne mesurait pas alors, et six
pistes pour la suite. Mais ce document dépend de la présence d'un agent, de sa lecture et de sa rédaction :
un run qui n'a pas cette chance laisse un reçu et un output, pas de rapport pour la personne qui a commandé
le test.

**Choix** : un module `docs/device/harness/rapport.mjs`, sans dépendance, lit `receipt.json`,
`output.json`, `trace/echange.jsonl`, `gate.json` et `faits.json`, puis écrit `RAPPORT.md` à la racine du
run. `orchestrer.mjs fin` l'appelle après l'output ; une sixième commande `rapport` reconstruit le document
d'un run déjà clos, avec `--remplacer` explicite. Le rapport est déterministe : aucune date de génération,
aucun appel réseau, aucun modèle. Il ne décide pas du verdict et ne relit pas les falsificateurs ; il lit
les champs, nomme les morsures, recopie les limites et dérive une piste par morsure ou limite. Un champ
absent est dit absent : un reçu antérieur à l'ADR-049 n'a pas `lecture_hors_dossier`, et le rapport ne
prétend pas que les lectures sont propres.

**Conséquences** : le banc gagne les contrôles **179 à 186** et passe à **186/186** ; `run.mjs`, le reçu et
l'output ne changent pas. `fin` refuse de commencer si `RAPPORT.md` est déjà là, pour qu'un rapport ne
reste pas à côté d'un reçu neuf ; `rapport` refuse d'écraser sans `--remplacer`. Le rapport manuel du run
historique n'est pas réécrit et reste sa lecture. Deux appels sur les mêmes pièces rendent le même fichier.

**Ce que ce n'est pas** : une rédaction libre, un second verdict, une preuve du contenu du produit, ni une
mesure des commandes `shell`. Le rapport est une vue des pièces ; le reçu reste la preuve.

**Falsificateur** : un rapport qui nomme un verdict qui n'est pas celui du reçu, ou qui affirme qu'un champ
absent n'a pas mordu, ou deux rapports différents pour les mêmes pièces.

## ADR-051 — La trace porte la commande, et le reçu mesure les effets hors cadre (2026-10-21)

**Contexte** : l'[audit des 35 commandes shell](tasks/2026_10/2026-10-21-093003-effets-hors-cadre/2026-10-21-093625-audit-shell.md)
du run « promesse mémoire » montre ce que le reçu ne voyait pas : pour la quatrième fois, la session a
lu `/home/giak/projects/deuteros-resurrected-web/aidd_docs/memory/project-brief.md`, avec `cat` et
`read` ; la trace normalisée ne gardait ni le texte de la commande ni la cible d'une écriture faite par
`cp` ou `echo >`. L'ADR-049 mesurait les outils qui nomment un `path`, et l'ADR-052 a rendu leur cadre
lisible ; les commandes `shell`, elles, restaient hors de la mesure, dites en limite. La
[spec](tasks/2026_10/2026-10-21-093003-effets-hors-cadre/2026-10-21-093003-spec.md) écrit la règle
avant le code.

**Choix** : `clients.mjs` écrit `commande` sur chaque ligne `tool` quand `input.command`, `input.cmd` ou
`input.script` est une chaîne ; les anciennes traces n'ont pas le champ et le reçu le lit comme
`null`. `run.mjs` ajoute un scan littéral des commandes `shell`, segment par segment : il suit un `cd`
littéral, développe `~`, `$HOME` et une affectation `VAR=<chemin>` référencée entre guillemets dans la
même commande, résout les chemins contre le répertoire courant et compare les cibles aux racines du bloc
`cloisonnement`. Il en tire cinq falsificateurs : `shell_hors_dossier` (chemin lu hors des racines de
lecture), `shell_ecriture_hors_produit` (cible d'écriture hors de `produit.racine`),
`shell_non_interpretable` (variable non résolue, référence non quotée, substitution, backtick, `eval`,
`xargs`, `find -exec`, `cd -` ou `cd` variable, `git commit`/`git checkout`, commande absente), `reseau`
(`curl`, `wget`, `nc`, `ssh`, `git fetch/push/clone`, `npm install`, `pip install`) et `hors_produit`
(chemin nouveau du `porcelain` sous `terrain`, hors du produit). Les deux interdits déclarés commandent
les morsures ; un fichier de contexte (`AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`)
force `non concluant`, un fichier de produit autorise `ecart`, un artefact `.freebuff/` reste une limite.

**Conséquences** : `motifRefus` reçoit un motif par tableau non vide et `receipt --verdict conforme`
sort en `1` ; `RAPPORT.md` nomme les tableaux au §5, une section par falsificateur au §6 et une piste au
§7. Le banc gagne les contrôles **194 à 201** et passe à **201/201 PASS**, `exit 0` : quatre refus sur
une trace Freebuff (lecture, écriture, réseau, commande non interprétable), un fichier de contexte qui
force `non concluant`, un fichier de produit qui autorise `ecart`, et deux positifs (`$?`, apostrophes,
`\$`, affectation double-quotée). Une calibration hors banc et hors compte produit les cinq
falsificateurs dans le même reçu, et `receipt --verdict conforme` y sort en `1` en les nommant. La limite
shell devient : « les commandes shell sont lues quand leur texte est littéral ; une commande construite
dynamiquement n'est pas interprétée, et le reçu le dit ».

**Ce que ce n'est pas** : un interpréteur, ni une mesure des effets d'un binaire opaque. Un chemin
construit par une variable non résolue, une substitution ou un outil inconnu n'est pas mesuré ; une
commande non reconnue n'est pas une preuve d'absence d'écriture ou de réseau. Une modification ou une
suppression d'un fichier déjà présent hors du produit n'est pas listée, et les entrées du `porcelain`
sont comparées comme des chaînes. Aucun reçu existant n'est rejoué ni réécrit : la correction vaut pour
la prochaine porte.

**Falsificateur** : une des cinq commandes de calibration acceptée en `conforme`, un fichier de contexte
hors du produit qui ne force pas `non concluant`, une écriture hors du produit qui passe `conforme`, ou
un fichier de contexte signalé sur un cas qui l'autorise.

**Révisé le 2026-10-21 (ADR-056, ADR-057).** La phrase « une variable non résolue, une référence non
quotée, une substitution, un backtick, `eval`, `xargs`… » est plus large que la règle qui suit : une
substitution de commande **bornée** est désormais lue, ses effets mesurés, et seule sa valeur reste
inconnue (ADR-056) ; la commande interne d'un **`xargs`** et d'un **`find -exec`** littéral est lue de la
même façon, son placeholder `{}` restant inconnu (ADR-057). `eval` reste refusé. La règle générale ne
bouge pas — ce que le lecteur ne borne pas reste refusé, avec son motif.

## ADR-052 — Le cadre du cas est un bloc lu, pas une constante du harnais (2026-10-21)

**Contexte** : l'ADR-049 a rendu mesurables les lectures hors du dossier du cas, mais la racine autorisée
restait `<racine_espace_de_travail>/<cas>`, supposée par le code. Un cas ne pouvait ni déclarer un cadre
plus étroit, ni autoriser une lecture hors de son dossier. Les deux `expected.json` portaient leurs
interdits en prose, dans `contexte.interdits`, et le harnais ne les lisait pas. La
[spec](tasks/2026_10/2026-10-21-095321-cloisonnement-structure/2026-10-21-095321-spec-cloisonnement.md)
écrit la règle avant le code.

**Choix** : chaque `expected.json` porte un objet de premier niveau `cloisonnement` :
`lecture.autorisees` et `ecriture.autorisees`, deux listes non vides de chemins relatifs à la racine du
cas, puis `reseau` (`"interdit"` ou `"autorise"`) et `fichiers_de_contexte` (`"interdits"` ou
`"autorises"`). Un champ absent, vide, d'un autre type, ou un chemin absolu est un refus nommé ; le
harnais ne remplace jamais un bloc manquant par le cadre standard. `receipt` résout les racines de
lecture depuis la racine du cas et calcule `lecture_hors_dossier` contre elles, non plus contre le
dossier du cas ; le reçu écrit le bloc appliqué avec `lecture.resolues` et `ecriture.resolues`. Le
produit du cas doit être sous une racine d'écriture déclarée, sinon le cas est refusé comme
contradictoire. Un squelette fabriqué par `orchestrer.mjs cas` naît avec le bloc par défaut et la personne
le corrige dans l'attendu.

Les deux cas existants reçoivent le même bloc : `terrain` et `framework-origin` en lecture,
`terrain/aidd_docs` en écriture, réseau et fichiers de contexte interdits. Ils sont re-gelés :
`0d9a2180` devient `ba1096aa` pour la promesse mémoire, `50664060` devient `ea4523ef` pour le cas jouet,
les deux gels datés `2026-10-21T10:04:38+0200`. Le `request.md` ne change pas.

**Conséquences** : le banc gagne les contrôles **191** (le reçu porte le cadre déclaré), **192** (un cas
re-gelé dont la lecture se limite à `framework-origin` fait mordre une lecture de `terrain/README.md`,
pourtant dans le dossier du cas) et **193** (un cas sans bloc est refusé, sans reçu), et passe à
**193/193**. Les huit contrôles prévus par la spec des effets hors cadre passent de 191-198 à 194-201,
leur compte cible de 198 à 201. `origine/` n'est plus autorisé par défaut : un cas qui le lit doit
l'ajouter au bloc. Aucun reçu existant n'est rejoué ni réécrit ; le message de `lecture_hors_dossier`
devient « une lecture est sortie du cadre déclaré », et le contrôle 176 le relit.

**Ce que ce n'est pas** : une mesure des écritures hors du cadre, du réseau ou des fichiers de contexte.
Le reçu déclare ces interdits et ajoute une limite pour chacun, il ne les prouve pas ; les falsificateurs
shell et les écritures hors produit restent la matière de la spec des effets hors cadre. Ce n'est pas non
plus un jugement sur la justesse du bloc : un cas qui déclare un cadre trop large l'obtient.

**Falsificateur** : une lecture hors des racines déclarées acceptée en `conforme`, une lecture dans ces
racines signalée comme hors cadre, ou un attendu sans bloc `cloisonnement` accepté par `receipt`.

## ADR-053 — `/dev/null` est un puits, pas un chemin (2026-10-21)

**Contexte.** Le premier run réel du cas jouet sous ADR-051
([2026-10-21-133836-ea4523ef-dde7723](device/runs/2026-10-21-133836-ea4523ef-dde7723/receipt.json)) a
produit un reçu `non concluant` à quatre morsures, dont deux venaient du même mot : `/dev/null`. Le scan
comptait sept entrées de `shell_hors_dossier` et **toutes** les entrées de `shell_ecriture_hors_produit`
(`6 sur 6`) tirées de `rtk ls -la 2>/dev/null` et de `curl -s -m 5 -o /dev/null -w …`. Un chemin égal à
`/dev/null` est forcément hors de toute racine du cadre : tout run qui redirige une sortie vers le puits
était donc refusé `conforme`, sans avoir rien écrit, et le banc ne le voyait pas — aucune de ses fixtures
n'écrit vers `/dev/null` (`201/201 PASS` avant cette décision).

**Décision.** `run.mjs` déclare `PUITS_SHELL = new Set(["/dev/null"])` et un prédicat `estPuitsShell`,
appliqué au seul endroit qui ajoute une entrée aux listes d'effets (`ajouter` dans `effetsShell`) : un
puits n'est ni une lecture ni une écriture, par redirection (`2>/dev/null`) comme par argument
(`cp … /dev/null`). La comparaison porte sur le chemin **déjà résolu** par `cheminShell`, donc sur le
chemin entier : `dev/null` relatif reste un fichier du dossier de travail, et `/dev/nullx` reste un
chemin ordinaire. Les autres fichiers de périphérique (`/dev/stdout`, `/dev/stderr`, `/dev/tty`) restent
comptés ; le reçu ajoute une limite qui nomme le puits et cette exclusion, dans le bloc des limites shell.

**Conséquences** : le banc gagne les contrôles **202** (redirection et argument vers le puits : aucune des
deux listes ne le retient, `conforme` accepté, limite nommée) et **203** (`/dev/nullx` : les deux listes
le retiennent, `conforme` refusé), et passe à **203/203**. Le contrôle 175, qui comptait les runs réels du
cas jouet dans une constante, compte désormais les `receipt.json` du dossier : le quatrième run du cas ne
fait plus rougir le banc, et les deux figures qu'il éprouve (maximum mesuré, fourchette à cinq minutes)
ne bougent pas. Sur la trace réelle du run cité, recalculée dans une copie hors dépôt, les comptes
passent de 24 à 17 et de 6 à 0 ; les trois autres falsificateurs ne changent pas. Le reçu du run reste la
pièce datée du défaut : il n'est ni rejoué ni réécrit.

**Ce que ce n'est pas** : une règle sur les autres périphériques, une interprétation des effets d'un
binaire opaque qui écrirait vers le puits sans le nommer, ni un moyen pour un cas d'interdire l'écriture
vers `/dev/null` — s'il le demandait un jour, ce serait un champ du bloc `cloisonnement`, pas une
exception du scan.

**Falsificateur** : un `/dev/null` littéral retenu dans l'une des deux listes, `/dev/nullx` ignoré, ou un
`conforme` refusé pour une commande dont les seules cibles hors produit sont le puits.

## ADR-054 — F7 compare le produit aux fichiers lus, pas seulement au gel (2026-10-21)

**Contexte.** `produit_identique_a_une_empreinte_anterieure` ne comparait le `sha256` du produit qu'aux
deux pièces du cas et aux références du framework. Le run réel
[2026-10-21-133836-ea4523ef-dde7723](device/runs/2026-10-21-133836-ea4523ef-dde7723/receipt.json) a
montré ce que cette comparaison ne voit pas : le produit `NOTES.md` y est **octet pour octet** celui d'un
run précédent, que la session a lu au seq 13 dans
`$RACINE/2026-10-18-085308-cas-jouet.avant-run-20261021/terrain/aidd_docs/NOTES.md` et recopié au seq 17 ;
le reçu portait `produit_identique_a_une_empreinte_anterieure: []`. F7 ne voyait pas un fichier recopié
dès qu'il venait d'ailleurs que du gel.

**Décision.** `run.mjs` rassemble les lectures de la trace — tout outil dont le nom relève de
`MOTS_LECTURE` et qui porte un `chemin_outil`, plus les chemins littéraux lus par une commande `shell`
(`effets.chemins`, ADR-051) — résolues par `cheminDepuis`, avec la plus ancienne ligne gardée. Pour chaque
fichier du manifeste, il retient une entrée `{chemin, source, sha256, seq}` quand la lecture précède la
naissance du produit (`ts / 1000 <= birth_epoch`), que la source est hors de `produit.racine` et n'est pas
le produit lui-même, que le fichier existe encore, qu'il est un fichier ordinaire non symbolique, et que
son `sha256` égale celui du produit. La clé reste **la même** :
`produit_identique_a_une_empreinte_anterieure`, où la correspondance au gel porte `source: "gel"`. Le
motif de refus nomme les deux chemins (`NOTES.md ← /…/NOTES.md`), et le rapport, qui sérialise la valeur,
n'a pas changé. Le reçu ajoute une limite quand des lectures hors du produit existent : la comparaison se
fait **au reçu**, sur le fichier tel qu'il est alors.

**Conséquences** : le banc gagne les contrôles **204** (le fil lit une copie exacte du produit avant sa
naissance : F7 la nomme avec sa source, `conforme` refusé, `non concluant` accepté), **205** (le fil lit
le playbook, au contenu différent : aucun falsificateur, `conforme` accepté), **206** (la même copie
exacte, lue **après** la naissance : F7 reste vide, `conforme` accepté) et **207** (le fil relit **le
produit lui-même** avant sa naissance : F7 reste vide, `conforme` accepté). Les 206 et 207 exigent la
limite d'ADR-054 dans le reçu, donc la lecture a été vue. Le banc passe à **207/207** ; retirer la
condition d'ordre fait tomber le 206 seul, retirer l'exclusion du produit fait tomber le 207 seul.
Recalculé hors dépôt sur une copie du run cité, le reçu porte l'entrée F7 nommant `NOTES.md` et le
snapshot, là où le reçu d'origine porte `[]` ; le reçu d'origine n'est ni rejoué ni réécrit. La forme des
entrées change (une chaîne devient un objet) : aucun reçu sur disque ne portait d'entrée F7 — les six
portent `[]` —, donc aucune forme ancienne n'est attestée, le rapport sérialise l'une comme l'autre, et
aucun reçu n'est réécrit.

**Ce que ce n'est pas** : un balayage de `$RACINE`. Le reçu ne lit que ce que la trace nomme ; une copie
faite par un binaire opaque (un script, un outil dont la ligne de commande ne nomme aucun chemin) reste
invisible. **Révisé le 2026-10-21 (ADR-057)** : `find -exec cat` n'est plus un exemple de binaire
opaque — la commande interne d'un `find -exec` littéral est lue, et ses chemins sont comparés comme les
autres. Un fichier lu puis modifié ou
supprimé avant le reçu n'est plus reconnu — la limite le dit. Un produit identique par coïncidence à un
fichier lu mord aussi : le dispositif ne sait pas distinguer une copie d'une convergence, et il l'écrit.
Un cas qui **demanderait** une copie deviendrait `non concluant` ; s'il le fallait un jour, ce serait un
champ du bloc `cloisonnement`, pas une exception.

**Falsificateur** : un produit octet pour octet identique à un fichier lu avant sa naissance accepté en
`conforme`, ou une lecture ordinaire au contenu différent qui fait mordre F7.

## ADR-055 — F7 ne mord que sur une seconde strictement antérieure à la naissance (2026-10-21)

**Contexte.** L'ADR-054 retient une copie quand `ts / 1000 <= birth_epoch`, où `ts` est l'horodatage en
millisecondes du message qui porte la lecture et `birth_epoch` la naissance du produit en secondes. Or
`birth_epoch` vient de `stat -c %W`, qui rend une seconde entière : la naissance réelle `b` vérifie
`birth_epoch <= b < birth_epoch + 1`, et une lecture datée dans cette même seconde peut aussi bien
précéder `b` que la suivre. La condition d'égalité affirmait donc une antériorité que la mesure ne peut
pas établir. Le contrôle **206**, écrit pour éprouver l'exclusion postérieure, lisait exactement cette
seconde d'égalité : il ne distinguait pas `>` de `>=`, et sa description (« 5 s après ») était fausse.

**Décision.** F7 mord si et seulement si `Math.floor(ts / 1000) < birth_epoch`. La seconde d'égalité est
écartée de la morsure — après les mêmes contrôles de contenu : fichier hors du produit, existant,
ordinaire, de même `sha256` — et le reçu ajoute une limite qui nomme le produit, la lecture et son `seq` :
« lecture dans la seconde de naissance du produit (résolution du birth) … — l'ordre n'est pas décidable à
la seconde, F7 ne mord pas, et un produit copié et lu dans cette seconde lui échappe (ADR-055) ». La
phrase de l'ADR-054, `ts / 1000 <= birth_epoch`, est remplacée par celle-ci ; l'ADR-054 reste datée.
Trois raisons : la morsure ne peut pas dépasser la preuve ; la condition 1 du §5 traite déjà la même
résolution ainsi (`birth_anterieur_au_gel` est un `<` strict, et une naissance à une seconde du gel donne
une limite, pas une morsure) ; une morsure fausse accuse une session honnête, une morsure manquée laisse
passer une copie que la limite nomme.

**Conséquences** : le banc gagne **208** (copie exacte lue dans la seconde de naissance : F7 vide,
`conforme` accepté, limite ADR-055 nommant la copie) et **209** (la même copie lue à la dernière
milliseconde de la seconde précédente : F7 mord, `non concluant` accepté, aucune limite ADR-055) ; le
**206** est corrigé pour lire la seconde **suivante**, ce que sa description disait déjà. Le banc passe à
**209/209**. Mutations mesurées sur une copie de `run.mjs` restaurée ensuite (`sha256 c56754f0…`) :
l'égalité rendue mordante (`seconde === birth_epoch` neutralisé) => le 208 seul tombe, 208/209, `exit 1` ;
l'égalité étendue d'une seconde (`seconde >= birth_epoch - 1`) => le 209 seul tombe, 208/209, `exit 1` ;
limite retirée => le 208 seul tombe, `conforme` inchangé, 208/209, `exit 1`.

**Ce que ce n'est pas** : une preuve d'absence de copie. Un produit copié et sa copie lue dans la même
seconde échappe à F7 ; le reçu le dit en limite, pas en silence. La seconde réelle n'est pas mesurée : les
contrôles fabriquent l'instant de la lecture autour du `mtime` du produit et retouchent `birth_epoch`.

**Falsificateur** : une lecture dans la seconde de naissance qui fait mordre F7, une lecture dans la
seconde précédente qui ne mord pas, ou l'absence de la limite d'ADR-055 dans le premier cas.

## ADR-056 — Une substitution bornée est lue, sa valeur reste inconnue (2026-10-21)

**Contexte.** Le run neuf du cas `plan-simple`
([2026-10-21-203553-bee028f8-295211c](device/runs/2026-10-21-203553-bee028f8-295211c/receipt.json)) est
plafonné par une seule morsure, `shell_non_interpretable` seq 50 :
`for f in *.md; do n=$(grep -c <clôture> "$f"); echo "$f : $n fences"; done` (le motif compte les clôtures de bloc). La boucle est déroulée depuis la
séance 98, mais la substitution qu'elle contient est refusée d'un bloc, alors que sa commande interne —
`grep -c` sur un fichier du terrain — est entièrement lisible. Le run précédent portait 12 limites et deux
morsures, celui-ci 11 et une seule : le refus est devenu le dernier obstacle de la même famille, une
commande littérale dont une partie seulement échappe au lecteur.

**Décision.** `run.mjs` extrait `$(TEXTE)` quand son texte est **borné** : parenthèses équilibrées hors
guillemets, aucune substitution imbriquée, aucun backtick à l'intérieur, texte non vide, et pas la forme
arithmétique `$((`. Le texte interne passe par le **même** lecteur, au répertoire courant de la
substitution : ses chemins lus, ses cibles d'écriture et ses clients réseau entrent dans les listes du
segment qui la porte, et un refus interne refuse la commande entière. Le résultat de la commande interne
n'est jamais calculé : le mot qui porte la substitution reçoit une marque (un octet NUL, qu'aucune
commande ne porte), et la marque fait refuser tout mot qui deviendrait un chemin — `ajouter`, seul point
d'entrée des listes d'effets, et une cible de `cd`. La marque survit à l'affectation littérale
(`n=$(…)` puis `$n`), donc une valeur inconnue ne devient pas un chemin par détour. Refus nommés :
substitution imbriquée, non fermée, vide, arithmétique, commande interne non interprétable, valeur
utilisée comme chemin ou comme nom de commande. Le motif
« chemin construit par une substitution $(...) : valeur inconnue » est le seul refus nouveau.

**Conséquences.** Le banc gagne les contrôles **214** (substitution lue : `conforme` accepté), **215**
(lecture interne mesurée : `shell_hors_dossier` nomme `../hors-cadre.md` lu dans la substitution), **216**
(valeur inconnue jamais un chemin : `cat $(ls aidd_docs)` refusé, motif nommé) et **217** (imbrication
refusée), et passe à **217/217 PASS**, `exit 0`. Mutations mesurées sur une copie restaurée de `run.mjs`
(`sha256 4fdcf596…` avant et après) : lecture retirée (refus d'un bloc) => les 214 à 217 tombent,
213/217, `exit 1` ; effets internes ignorés => le 215 seul tombe, 216/217, `exit 1`. Sur la trace réelle
du run cité, relue à blanc sur une copie sans `receipt.json`, le verdict proposé passe de `non concluant`
à « conforme ou ecart — rien ne mord », et les limites de 11 à 9 ; le reçu clos sur disque n'est pas
réécrit. La ligne de limite shell devient : les commandes sont lues quand leur texte est littéral, une
substitution bornée comprise.

**Ce que ce n'est pas** : une exécution. Le lecteur ne calcule aucune valeur, ne développe aucun glob, ne
simule aucune sortie ; `$(date +%s)` est accepté comme borné, et rien de ce qu'il rend n'est connu. Une
substitution non bornée reste refusée. Ce n'est pas non plus une preuve que la commande interne s'est
exécutée : comme le reste du scan, elle mesure des chemins écrits, pas des effets.

**Falsificateur** : une substitution bornée refusée, une lecture interne non mesurée, une valeur de
substitution comptée comme un chemin, ou une substitution imbriquée acceptée.

## ADR-057 — `xargs` et `find -exec` se lisent par leur commande interne (2026-10-21)

**Contexte.** L'ADR-051 refusait `xargs` et `find -exec` d'un bloc, faute de savoir les lire. Sous
l'ADR-056, la même famille de refus restait : `xargs -0 sha256sum`, `xargs grep -n motif README.md` ou
`find … -exec grep …` nomment des chemins entièrement lisibles, et une seule occurrence suffisait à rendre
un run `non concluant` sur leurs effets non mesurés.

**Décision.** `run.mjs` lit la commande interne des deux formes, par le même lecteur, et fusionne ses
effets dans le segment qui la porte (`fusionnerEffets`, la fonction que la substitution emploie déjà).
Pour `xargs`, les options connues sont sautées — drapeaux `-0`, `-r`, `-t`, `-p`, `-x`, options à valeur
`-I`, `-n`, `-L`, `-P`, `-d`, `-E`, `-s`, collées comprises —, `-a FICHIER` compte le fichier comme lu, et
le premier mot restant est la commande ; sans commande, `xargs` lance `echo` et ne mesure rien. Pour
`find`, le bloc va de `-exec`/`-execdir`/`-ok` au premier `;` ou `+`, et la boucle de chemins saute ce
bloc, puisqu'il a été lu comme une commande et non comme des arguments de `find`. Le placeholder `{}` et
la chaîne de remplacement d'`-I` sont remplacés par la marque d'une valeur inconnue de l'ADR-056 : un mot
qui n'est pas un chemin reste neutre, un chemin est refusé. Refus nommés, jamais un silence : `find
-exec` sans terminateur, `find -exec` sans commande, `xargs` ou `find -exec` imbriqué (profondeur > 0 —
le lecteur ne déroule qu'un niveau), commande interne non interprétable. `eval` reste refusé.

**Conséquences.** Le banc gagne les contrôles **218** (`echo x | xargs grep -n plan README.md` :
`conforme`), **219** (`find . -exec cat ../hors-cadre.md ;` : `shell_hors_dossier` nomme la lecture
interne), **220** (`find . -exec cat {} ;` : refus « valeur inconnue ») et **221** (`find . -exec cat` :
refus « non terminée »), et passe à **221/221 PASS**, `exit 0`. Mutations mesurées sur une copie
restaurée de `run.mjs` (`sha256 1dfbb1a9…` avant et après) : refus d'un bloc rétabli => les 218 à 221
tombent, 217/221, `exit 1` ; effets internes ignorés => les 219 et 220 tombent, 219/221, `exit 1` — le 220
tombe parce que le refus de `{}` vient de la lecture interne, qu'ignorer supprime.

**Ce que ce n'est pas** : une exécution, ni une connaissance de ce que `xargs` reçoit par le pipe ou de ce
que `find` énumère. Le lecteur mesure les chemins écrits, pas les effets ; un `{}` qui n'est pas un chemin
reste inconnu sans refus ; un `eval`, un script ou un binaire opaque restent non mesurés, et la limite le
dit. Aucune trace réelle du dépôt ne porte `xargs` ni `-exec` : contrairement à l'ADR-056, cet ADR n'a pas
de relecture à blanc sur un run existant, et le dit.

**Falsificateur** : un `xargs` ou un `find -exec` littéral refusé, une commande interne non mesurée, un
`{}` compté comme un chemin, ou un bloc `-exec` sans terminateur accepté.

## ADR-058 — Une question posée sans réponse mord (2026-10-21)

**Contexte.** Le troisième run du cas `plan-simple` a été clos `conforme` en Séance 102 : le tableau, les
cinq écritures sous `aidd_docs/tasks/`, aucune lecture ni écriture hors cadre. Mais la demande exige que
la session *attende l'accord* après son tableau, et le reçu n'en mesurait rien. La trace du run
`2026-10-21-230340-bee028f8-ee974e9` dit pourquoi : l'outil `question` à l'index 65 (seq 19), les cinq
`write` aux seq 22 à 26, et **une seule** ligne `user` (seq 1) — le client non interactif a annulé la
question, et la session a écrit dans le même tour. Un reçu qui conclut `conforme` sur cette trace affirme
plus que ce qu'il mesure.

**Décision.** `run.mjs` lit la question comme un acte **bloquant** dont la famille est déclarée
(`MOTS_QUESTION = /(question|ask_user)/i`, à côté des trois familles d'écriture, de lecture et de shell,
ADR-035), jamais la liste d'outils d'un client. La mesure compare la **dernière** question à la
**première** écriture — un acte nommé au sens de H6, nom d'écriture *et* `chemin_outil` nommé, sans
deuxième copie de la règle — et cherche une part `role: "user"` d'index strictement entre les deux. Sans
elle, le falsificateur `question_sans_reponse` porte `{seq_question, index_question, outil, seq_ecriture,
index_ecriture}` et interdit tout verdict sauf `non concluant` : la pause est ce que la demande exige, et
son absence rend le run non mesurable tel que le cas le décrit, sans accuser le produit. Le falsificateur
est **universel** : il ne lit aucune déclaration de l'attendu, donc aucun cas n'est touché, aucun re-gel.

**Conséquences.** Le banc gagne les contrôles **222** (question seq 3, écriture seq 4, aucune ligne
`user` : `conforme` refusé, `non concluant` accepté, les deux seq nommés) et **223** (la réponse figée
entre les deux : `question_sans_reponse` vide, `conforme` accepté), et passe à **223/223 PASS**, `exit 0`.
Mutations mesurées sur une copie restaurée de `run.mjs` (`sha256 537a0a7f…` avant et après) : réponse
ignorée dans la comparaison => le 223 seul tombe, 222/223, `exit 1` ; famille de question retirée => le 222
seul tombe, 222/223, `exit 1`. Le run de la Séance 102, relu à blanc sur une copie sans `receipt.json` :
`conforme` refusé, `non concluant` accepté, **une** morsure nommant seq 19 et seq 22, produit 5 fichiers,
**11** limites ; le reçu sur disque reste `conforme`, il n'est pas réécrit.

**Ce que ce n'est pas** : une mesure des gestes humains, ni de la qualité du skill. Une demande d'accord
écrite dans un texte d'assistant, un outil de question hors de la famille déclarée, et une écriture faite
par une commande `shell` (que la définition de H6 ne reconnaît pas) ne sont pas vus — la limite ajoutée à
chaque reçu le dit. Une question que ne suit aucune écriture n'a rien à comparer, et reste muette.

**Falsificateur** : une question suivie d'une écriture sans ligne `user` entre les deux qui ne mord pas, une
question répondue qui mord, ou un `conforme` accepté sur une question sans réponse.

## ADR-059 — `ouvrir` ouvre la session par l'API, et joue la pause (2026-10-22)

**Contexte.** La Séance 104 a mesuré la pause du cas `2026-10-21-173843-plan-simple` : la session rend son
tableau, pose sa question, et la réponse figée part pendant le blocage, ce que la mesure d'ADR-058
attend pour se taire. Mais la pause a été **jouée à la main** : cinq appels d'API tapés un par un dans un
script jetable de `/tmp`, hors du dépôt et hors du banc. Le runbook d'ouverture en restait à trois gestes
humains (ouvrir le fil, coller le texte, répondre la phrase figée), et rien dans le dispositif ne
reproduisait la pause d'un run à l'autre : le seul reçu qui la porte est celui d'un soir où j'ai piloté.

**Décision.** `orchestrer.mjs` gagne une septième sous-commande, `ouvrir`. Elle lance `opencode serve` sur
un port libre (ou se branche sur `--api`), lit le mot de passe que le serveur imprime, crée la session
dans l'arbre `travail` du gel, envoie `texte-a-remettre.txt` **verbatim** après avoir vérifié le `sha256`
que `gate.json` a inscrit, puis joue la pause : à chaque formulaire qui attend, elle envoie la réponse
figée du cas comme message, puis répond au formulaire par l'option marquée « Recommandé » (à défaut la
première), et s'arrête quand la session devient inactive. Elle n'écrit rien dans le dossier du run : le
fil se dit, et la chaîne `suite` → `fin` reste la seule qui mesure.

Trois constats mesurés sur `opencode v2.1.2` commandent la boucle, et sont la raison d'être de
l'implémentation plutôt que d'un script : `time.idle` et `time.updated` de la session **ne bougent pas**
pendant un tour, une session bloquée sur un formulaire **n'émet pas** de message `idle`, et c'est le
message `type:"idle"` daté après l'envoi qui marque la fin d'un tour. Une commande qui lirait
`session.time.idle` conclurait « inactive » avant que la session ait commencé à travailler.

**Conséquences.** Le banc gagne **224** (aucune porte : refus), **225** (`opencode` introuvable dans le
`PATH` : refus), **226** (bout en bout contre un serveur factice : le texte envoyé est celui de la porte
octet pour octet, la réponse figée part avant la réponse au formulaire, le formulaire reçoit l'option
« Recommandé », `exit 0`, le dossier du run est inchangé) et **227** (trois questions pour deux réponses
figées : refus qui les nomme), et passe à **227/227 PASS**. Le runbook d'`ORCHESTRATEUR.md` nomme la
commande et cesse de dire qu'aucune interface n'ouvre de session ; l'annexe du guide utilisateur gagne sa
ligne. Le contrôle **153** confronte les deux pages au code avec sept commandes.

**Ce que ce n'est pas** : une preuve de présence humaine. `ouvrir` fait ce que je faisais à la main, par
l'API du client au lieu de l'interface ; les trois gestes du runbook restent non mesurés, et `suite --par`
/ `--temoignage` doivent continuer de dire la vérité, que le bloc imprime. Les réponses au formulaire sont
des options proposées par le modèle : le cas ne tranche aucune question de conception par cette voie. Et
l'API `/api/…` est la surface du serveur, pas un contrat public : une version d'opencode qui la change
casse `ouvrir`, et le banc ne le verrait pas, puisqu'il ne parle qu'à son serveur factice.

**Falsificateur** : un `--api` qui n'écrit pas le texte de la porte, une réponse au formulaire qui n'est pas
l'option marquée Recommandé, une écriture de `ouvrir` dans le dossier du run, une session déclarée
inactive avant son `idle`, ou une question jouée au-delà des réponses figées du cas.

## ADR-060 — Le texte du cas jouet interdit d'explorer le dossier parent (2026-10-22)

**Contexte.** Le run `2026-10-22-002306-ea4523ef-554752b` a été clos `non concluant` : la session a
commencé par `ls -la ..`, est montée jusqu'à `~/projects/aidd-device/docs`, puis a lu
`CASES/2026-10-18-085308-cas-jouet.request.md` — dix entrées de `shell_hors_dossier`, deux de
`lecture_hors_dossier`. La mesure existait ([ADR-052](DECISIONS.md)) ; ce qui manquait était le texte :
**seul le §5 de la demande voyage vers la session**, et le §7, qui interdit de sortir du répertoire de
travail, ne lui parvient jamais. La phrase disait « apply it to this repository » : elle nomme un dépôt
sans en fermer les alentours.

**Décision.** Une phrase ajoutée au §5, donc au texte remis : « Stay inside this repository: do not list or
read its parent folder, its siblings, or anything above `$RACINE/2026-10-18-085308-cas-jouet/.` ». Le §7 et
l'attendu (`contexte.interdits`) portent la même règle, pour que le cas dise la même chose à ses trois
lecteurs. Les deux pièces restent sur une page (50 + 55 lignes, contrôle 130), et le cas est **re-gelé** :
empreinte `27fb38ab`, qui remplace `ea4523ef` (et `50664060` avant elle) comme référence de rejeu. Les
reçus déjà écrits gardent la leur ; ils ne se rejouent plus contre le gel du dépôt, et c'est le prix dit
d'un re-gel.

**Conséquences.** Le terrain est reconstruit (l'ancien déplacé en `.avant-run-20261022b`, têtes
`1b3b632` / `62c48e1`, `porcelain` vide), `porte` crée
[2026-10-22-004410-27fb38ab-6e06c97](device/runs/2026-10-22-004410-27fb38ab-6e06c97), et `ouvrir` joue la
pause en une session de **3 min 51 s** (00:44:18 → 00:48:09). Mesure : `lecture_hors_dossier` et
`shell_hors_dossier` **vides** — la session n'est plus sortie du dossier du cas. Mais `reseau` **mord** :
`curl` vers `http://localhost:8001/health` et `:8002/mcp` au seq 5, et la session a écrit une mémoire
Mnemolite (`d2af9c4c-ecd5-40a5-8ed6-428a4578c060`, créée à 00:46:28, pendant le run) qui ne figure nulle
part dans la trace : l'outil MCP n'appartient ni à la famille `shell`, ni à une famille mesurée. `fin` à blanc propose donc encore `non concluant`. Le banc reste
**227/227 PASS**, `exit 0`.

**Ce que ce n'est pas** : une clôture. Un texte est une consigne ; le reçu mesure les chemins. Le run
suivant montre que le durcissement déplace la sortie de cadre (du système de fichiers vers un appel réseau
local) sans la supprimer, et la limite d'ADR-051 le disait déjà : un client réseau non listé n'est pas
mesuré, et un outil MCP n'apparaît pas dans la famille `shell`.

**Falsificateur** : une session qui sort encore du dossier du cas alors que le texte le lui interdit ; un
re-gel qui garderait l'ancienne empreinte comme référence ; un banc qui attendrait encore 49 + 48 lignes.

## ADR-061 — La sortie utilisateur est un fichier à part, dérivé du reçu (2026-10-22)

**Contexte.** Le `RAPPORT.md` d'ADR-050 est exact et illisible pour qui n'a pas écrit le dispositif : il
conclut `ecart` quand le produit est celui de l'attendu, il aligne six empreintes avant de nommer un seul
geste, il emploie « morsure » et « falsificateur » sans les définir, et il ne dit jamais ce que la
personne peut décider. Trois retours de l'opérateur sur le rapport du run
`2026-10-22-070952` ont nommé le défaut : le résultat est obscur, le mot « morsure » ne veut rien dire,
et il manque la confrontation attendu/résultat.

**Décision.** `fin` et `rapport` écrivent, à côté du rapport technique, un **`RESULTAT.md`** destiné à la
personne : huit sections (en une phrase, le contexte, ce qui était attendu, attendu contre observé, ce
que ça veut dire, ce que tu peux décider, ce que ce run ne dit pas, les preuves), un tableau qui
confronte chaque geste attendu à ce qui a été observé, et deux réponses explicites : « utilisable en
l'état ? » et « quoi corriger ? ». Le corps n'emploie aucun mot du dedans ; ceux-là restent dans le
rapport technique, qui n'est pas réécrit.

**L'appariement est déclaré dans le cas**, dans `CASES/<cas>.lecture.json` : pour chaque geste, une ou
plusieurs assertions d'un vocabulaire fermé (`trace_outil`, `falsificateur_vide`, `produit`). Un geste a
trois états, jamais deux : **tenu**, **violé**, **non observé**. Le troisième est le seul qui protège :
une mesure absente ne devient jamais « tenu ». Ce fichier n'entre pas dans le gel, parce qu'y toucher
aurait imposé un re-gel des trois cas et rendu les treize reçus existants non re-jugeables (ADR-032) ; il
est donc daté, révisable, et son absence est dite au lieu d'être comblée.

**Conséquences.** `resultat.mjs` (nouveau module) rend le fichier sans modèle ni réseau, et deux appels
sur les mêmes pièces rendent le même octet. `fin` refuse un `RESULTAT.md` déjà là, comme il refuse un
`RAPPORT.md` déjà là. Un cas sans lecture garde son rapport technique et n'obtient pas de page
utilisateur : l'absence s'imprime, elle ne s'invente pas. Le banc gagne **228** (huit sections, une ligne
par geste, aucun mot du dedans), **229** (les trois états, dont « non observé » qui n'est pas « tenu ») et
**230** (déterminisme, refus d'écrasement), et passe à **230/230 PASS**.

**Ce que ce n'est pas** : une preuve que le skill est bon. La page dit elle-même ce que le run ne couvre
pas, et le tableau peut afficher « tenu » là où le juge a lu autre chose : c'est écrit à la section 5,
parce que le reçu ne mesure pas cet outil.

**Falsificateur** : un `RESULTAT.md` qui dit « tenu » sans la mesure qui le soutient ; un mot du dedans
dans son corps ; deux appels qui rendent deux fichiers ; une section qui manque ; un geste déclaré par le
cas et absent du tableau.

## ADR-062 — Le produit se mesure fichier par fichier, et son parent n'est jamais un écart (2026-10-22)

**Contexte.** Le run `2026-10-22-092354-0052c168-496fbe8` conclut `non concluant` avec, parmi ses six
morsures, `hors_produit` sur `terrain/aidd_docs` alors que la racine du produit est
`terrain/aidd_docs/backlog/`. Cause : `git status --porcelain` replie un dossier non suivi en une seule
entrée, et le reçu comparait cette entrée à la racine du produit comme s'il s'agissait d'un fichier.

**Décision.** Le reçu mesure son propre côté après-run avec `--untracked-files=all`, donc fichier par
fichier. Le gel, la porte et F6 gardent leur mesure repliée : les quatre gels du dépôt la portent, et en
changer la forme les rendrait incompatibles sans re-geler. Deux chemins ne sont jamais attribués : celui
qui tombe sous une entrée de la porte finissant par `/` (un dossier déjà non suivi avant le run, dont les
fichiers ne sont pas attribuables), et celui qui est un **ancêtre** de la racine du produit.

**Conséquences.** Le 237 rend `hors_produit: []` sur un produit sous `aidd_docs/backlog/` ; le 238 prouve
qu'un dossier neuf est nommé fichier par fichier (`terrain/docs/y.md`, jamais `terrain/docs`) et qu'un
fichier d'un dossier déjà connu est sauté. Le 199 change d'attendu : il nomme désormais le fichier, plus
le dossier. La limite du reçu sur le `porcelain` est réécrite.

**Ce que ce n'est pas** : une preuve que l'ancêtre est atteint. `--untracked-files=all` ne replie plus de
dossier sur ce git ; la règle de l'ancêtre reste un garde-fou, et le banc dit qu'aucun contrôle ne
l'éprouve directement.

**Falsificateur** : un run dont le produit est sous la racine de l'attendu et qui porte encore un
`hors_produit` sur un parent ; un fichier neuf nommé par son dossier et non par son nom.

## ADR-063 — L'outil d'écriture du client est mesuré comme sa lecture (2026-10-22)

**Contexte.** Deux scripts écrits par l'outil `write` sous `/tmp/opencode/spike_annees/`, puis quatre
éditions du second, n'ont produit **aucune** morsure : les chemins des outils d'écriture ne servaient qu'à
l'ordre écriture/tableau (`ecriture_avant_tableau`), jamais au cadre. Le run écrivait hors de son espace
d'écriture déclaré sans que le reçu le voie.

**Décision.** Un falsificateur nouveau, `ecriture_hors_dossier`, lit chaque part `tool` dont le nom porte
un des mots de la famille déclarée (`MOTS_ECRITURE`, la même que H6) et dont le chemin est nommé, et
retient celles qui sortent de `cloisonnement.ecriture.resolues`. Il porte `{seq, index, ts, outil,
chemin}` et force `non concluant`, comme une lecture hors cadre. Un outil d'écriture qui ne nomme aucun
chemin reste la limite déjà rendue par `outilsEcritureSansChemin`.

**Conséquences.** Sur le run `spike-annees`, la règle mord six parts (seq 42, 47, 49, 51, 53, 54), toutes
sous `/tmp/opencode/spike_annees/`. Le rapport technique gagne sa section 6.2, la page utilisateur sa
phrase et son conseil, le banc les contrôles 239 et 240.

**Ce que ce n'est pas** : une mesure de ce qu'un outil fait réellement. Le reçu lit le chemin que l'outil
nomme, pas son effet ; un outil inconnu qui n'ouvre pas de chemin reste une limite.

**Falsificateur** : une écriture d'outil hors du cadre qui ne mord pas ; une écriture dans le cadre qui
mord ; un outil d'écriture sans chemin qui devient une morsure au lieu d'une limite.

## ADR-064 — La racine du cas se lit par égalité, jamais par contenance (2026-10-22)

**Contexte.** Le seq 7 du run `spike-annees` liste `$RACINE/<cas>/`, le répertoire de travail que la
demande nomme, et `cloisonnement.lecture.autorisees` ne déclare que `terrain` et `framework-origin` : un
`ls` de son propre dossier devenait une morsure. Le remède évident — ajouter la racine du cas aux racines
résolues — a été mesuré au banc : il avale `terrain`, `framework-origin` et `origine`, rend décoratives
les racines déclarées, et fait tomber le contrôle 192 (cadre rétréci) et le 215 (lecture interne d'une
substitution, `../hors-cadre.md` résolu dans la racine du cas).

**Décision.** `cloisonnement.lecture` gagne `racine_du_cas`, le chemin résolu, à côté de `autorisees` et
`resolues`. Une lecture dans le cadre est une lecture sous une racine **déclarée**, ou une lecture du
chemin **égal** à `racine_du_cas`. Ses sous-arbres ne sont pas absorbés.

**Conséquences.** Le listing de son propre dossier ne mord plus ; une lecture de `$RACINE` (le parent),
d'un sous-dossier `origine/`, ou d'un autre cas mord encore. Le 241 mesure les trois. Le reçu dit le cadre
qu'il mesure, et le 192 reste vrai.

**Ce que ce n'est pas** : un droit de regard sur les sources `origine/`, qui restent hors cadre ; ni une
garantie qu'un client nomme le répertoire de travail de cette façon.

**Falsificateur** : un cadre rétréci qui ne mord plus parce que la racine du cas l'a absorbé ; une lecture
du parent qui passe.

## ADR-065 — `last-message.md` est écrit par `suite`, haché et reconfronté à la trace (2026-10-22)

**Contexte.** `last-message.md` est la pièce que le juge lit, et elle était transcrite à la main, sans
empreinte : rien ne la reliait à la trace, et le reçu ne pouvait que la hasher.

**Décision.** `suite` écrit `raw/<cas>/last-message.md` avec le texte de la dernière part `text` d'un
message `assistant` de la trace exportée, refuse si le fichier existe déjà, et ajoute à `faits.json`
`dernier_message{chemin, sha256, seq, ts}`. Le reçu vérifie que le chemin est celui de la pièce, que
l'empreinte est celle des faits, et que le texte est celui de la dernière part `text` d'assistant de la
trace qu'il rejoue. Un `faits.json` sans ce champ reste lisible et reçoit la limite
`dernier_message_non_atteste`, pas un refus : les reçus déjà écrits restent re-jugeables (ADR-032).

**Conséquences.** Le banc gagne 242 (fichier écrit, attesté, reçu à blanc accepté) et 243 (pièce
retouchée refusée ; champ absent = limite). Le contrôle 141 garde son refus en privant le run de la pièce
et la restaure **octet pour octet**. Les fixtures opencode qui retapaient le fichier après `suite` ne le
retapent plus : `suite` l'a écrit.

**Ce que ce n'est pas** : une preuve que le texte est la dernière chose dite à la personne. C'est la
dernière part `text` d'un assistant dans la trace ; un message final fait d'un outil seul n'a pas de texte,
et `suite` refuse alors au lieu d'inventer.

**Falsificateur** : un `last-message.md` retouché accepté ; un `faits.json` sans champ refusé.

## ADR-066 — Relire son propre fichier n'est pas une seconde sortie de cadre (2026-10-22)

**Contexte.** Après ADR-064, le run `spike-annees` gardait une `lecture_hors_dossier` : seq 50 relit
`/tmp/opencode/spike_annees/h2_runtime.py`, un fichier que la session elle-même a écrit (seq 47) puis
édité. L'écriture mord déjà (`ecriture_hors_dossier`, seq 47) ; compter la relecture chargeait deux fois le
même acte, et le critère de la phase 0 — cinq morsures, ni plus ni moins — devenait inatteignable.

**Décision.** Une part `read` dont le chemin résolu est exactement un chemin qu'une part d'écriture de la
même trace a nommé n'alimente pas `lecture_hors_dossier` ; elle est dite en limite, avec son seq et son
chemin. La comparaison est celle du chemin entier : un autre fichier du même dossier mord encore.

**Conséquences.** Le reçu du run copié rend exactement cinq morsures : `tableau_absent`,
`ecriture_hors_dossier` (six parts), `shell_hors_dossier`, `shell_ecriture_hors_produit`,
`shell_non_interpretable` ; `hors_produit` et `lecture_hors_dossier` sont vides. Le 241 éprouve la règle
sur un fichier écrit puis relu.

**Ce que ce n'est pas** : une autorisation d'écrire hors cadre. L'écriture reste la morsure, et la
relecture ne la retire pas.

**Falsificateur** : une relecture d'un fichier écrit qui laisse deux morsures ; une lecture d'un autre
fichier du même dossier qui ne mord pas.

## ADR-067 — Le scratch d'un cas se déclare sous son arbre, se collecte en annexe et n'est jamais le produit (2026-10-22)

**Contexte.** Le run `spike-annees` du 2026-10-22 a demandé à une session d'investiguer : elle a écrit
deux scripts sous `/tmp/opencode/spike_annees/` et les a édités, puis la spike a cité l'un d'eux comme
preuve. Le cas interdisait `/tmp` et n'autorisait que `terrain/aidd_docs` en écriture : aucune destination
légitime n'existait pour un outil, et un chemin volatil ne se collecte pas. La phase 0 mesure désormais
ces six parts en `ecriture_hors_dossier`, mais la morsure reste juste : le cas n'offrait pas d'espace de
travail ([spec](tasks/2026_10/2026-10-22-115048-phase-1-le-cas/2026-10-22-115048-spec.md) §2).

**Décision.** `cloisonnement.ecriture.scratch` est un chemin **relatif à la racine du cas**, optionnel.
Quand il est déclaré, il est lisible et scriptible au même titre qu'une racine d'écriture, il n'est jamais
compté comme produit (`hors_produit`, `shell_ecriture_hors_produit` et le `porcelain` le sautent), et il se
collecte séparément : `collect --annexe <dir>` copie le dossier sous `annexe/<cas>/` avec un manifeste
`role: annexe` de même forme que celui du produit. `receipt` vérifie cette copie (existence, `sha256`,
contenu non augmenté) et porte `annexe{fichiers, manifeste_sha256, verifie}`. `suite` collecte l'annexe
quand le cas déclare un scratch et que le dossier existe. Un attendu dont le produit tombe dans le scratch
est refusé.

**Conséquences.** Le banc gagne 244 (écriture et relecture sous le scratch sans morsure, un fichier voisin
hors cadre mordu, aucun fichier du scratch dans `hors_produit`), 245 (annexe copiée, citée par le reçu,
retouchée après coup → reçu refusé) et la partie scratch du 248 (le gabarit autorise `terrain/.scratch/`).
Le reçu d'un cas qui déclare un scratch mais n'a pas d'annexe porte la limite qui le dit. Les quatre cas
gelés ne déclarent aucun scratch : leur lecture ne change pas.

**Ce que ce n'est pas** : une autorisation d'écrire hors de l'arbre du cas. `/tmp` reste interdit, un
scratch hors de l'arbre n'est pas collectable, et le run `spike-annees` garde ses cinq morsures.

**Falsificateur** : un fichier du scratch qui apparaît dans `hors_produit` ; `collect --annexe` acceptant
une source hors de l'arbre gelé ; une annexe retouchée acceptée.

## ADR-068 — Le tableau est demandé par le cas, et son absence ne mord que si le cas le demande (2026-10-22)

**Contexte.** `tableau_absent` mordait sur toute trace sans tableau, alors que les quatre cas gelés ont été
écrits dans un monde où la convention existait et que le run `spike-annees` ne demandait aucun tableau : le
plafond tombait sur une convention que le cas n'avait pas écrite (spec §3).

**Décision.** `attendu_details.tableau.requis` est un booléen, **vrai par défaut** quand il est absent,
pour que les cas gelés gardent leur lecture. Quand il vaut `false`, `tableau_absent` ne mord pas,
`ecriture_avant_tableau` et `produit_ne_avant_le_tableau` restent vides faute de tableau auquel comparer,
et une limite dit que le cas n'en demande pas. Le gabarit de `cas` ajoute au texte remis, après la phrase
de qualification, la demande d'un tableau de ce qui est qualifié et de la destination de l'écriture ; il
écrit `attendu_details.tableau = { requis: true, forme: … }` dans le squelette.

**Conséquences.** Le banc gagne 246 (attendu privé du champ puis re-gelé : `tableau_absent` mord par
défaut) et 247 (`requis: false` : aucune morsure, limite nommée), et la partie tableau du 248. Un cas
ancien sans le champ garde son verdict ; aucun reçu n'est réécrit.

**Ce que ce n'est pas** : une suppression de H6. La forme mécanique du tableau, ses trois lignes et sa
séparatrice restent jugées quand le tableau existe.

**Falsificateur** : un cas sans `tableau.requis` qui cesse de mordre sur `tableau_absent` ; une absence
qui mord encore sur un cas qui déclare `requis: false`.

## ADR-069 — La pause se mesure sur un tour de la personne, jamais sur l'outil `question` (2026-10-22)

**Contexte.** La lecture du geste « montrer, puis attendre l'accord » exigeait de la session qu'elle
appelle l'outil `question` : le run `spike-annees` a montré (seq 21), la réponse figée est arrivée (seq 25),
la première écriture a suivi (seq 26), et la page disait « non observé » pour une pause tenue (spec §4).

**Décision.** `attendu_details.pause.requis` est un booléen, **faux par défaut**, pour que les reçus
existants ne changent pas de verdict. `receipt` mesure `ouverture` (la première part `role: user`),
`premiere_ecriture` (la première part `tool` d'écriture nommant un chemin, la règle de H6) et
`pause.mesuree` (il existe une part `user` après l'ouverture et avant l'écriture). Il porte
`pause{requise, mesuree, seq_reponse, seq_ecriture, outil_ecriture}`. Si `requise` et qu'une écriture
existe sans ce tour, `pause_non_tenue` mord et force `non concluant`. `question_sans_reponse` reste une
rupture distincte. Le gabarit écrit `attendu_details.pause.requis: true`.

**Conséquences.** Sur une copie du run `2026-10-22-092354-0052c168-496fbe8` privée de son reçu, `pause`
rend `{requise: false, mesuree: true, seq_reponse: 25, seq_ecriture: 26}`, aucune part `question`
n'existe, `pause_non_tenue` est vide, `tableau_absent` mord encore et le verdict reste `non concluant`.
Le banc gagne 244 (pause tenue sans outil `question`), 246 (aucun tour `user` → `pause_non_tenue`), et la
partie pause du 248.

**Ce que ce n'est pas** : une mesure de la durée. Un tour arrivé dans la même seconde compte comme un tour,
et le reçu le dit en limite.

**Falsificateur** : une pause tenue sans `question` qui reste « non observée » ; une écriture sans tour qui
ne mord pas alors que le cas exige la pause.

## ADR-070 — Une commande shell mal formée et un lecteur aveugle sont deux morsures distinctes (2026-10-22)

**Contexte.** Le run `spike-annees` porte une entrée `shell_non_interpretable`, seq 65, motif
« guillemet simple non fermé » : la commande ferme sa chaîne au deuxième `'`, et le shell l'aurait
refusée. Le même nom rangeait aussi `cat $P/x`, `eval` ou `git commit`, des commandes que le shell
accepte et dont le lecteur ne voit pas les effets. La page utilisateur disait des deux « une commande
n'a pas pu être lue », et la personne ne pouvait pas savoir si la session avait fauté ou si l'instrument
était aveugle ([brainstorm](brainstorm/2026-10-22-100513-protocole-apres-le-run-spike.md) §4
problème 8, [spec](tasks/2026_10/2026-10-22-122615-phase-2-le-shell/2026-10-22-122615-spec.md) §2).

**Décision.** Le reçu porte deux clés. `shell_invalide` reçoit les motifs dont la commande est mal
formée, c'est-à-dire ceux pour lesquels le shell refuserait le texte : `guillemet simple non fermé`,
`guillemet double non fermé`, `substitution $(...) non fermée`, `substitution vide`,
`accolade non fermée`, `« find -exec » non terminée`, `« find -exec » sans commande`,
`boucle « … » non fermée`. `shell_non_interpretable` garde les autres : la commande est valide et le
lecteur ne la suit pas. Le classement est fait par une fonction unique, `motifInvalide`, sur le
vocabulaire que le lecteur écrit déjà ; un motif neuf tombe du côté aveugle par défaut, parce que
déclarer une commande mal formée est une affirmation sur le shell, pas sur le lecteur. Les deux clés
plafonnent à `non concluant`, et chacune porte une limite par entrée qui nomme son seq, son motif et
l'absence de preuve sur les effets.

**Conséquences.** Sur une copie du run `2026-10-22-092354-0052c168-496fbe8` privée de son reçu,
`shell_invalide` porte une entrée (seq 65) et `shell_non_interpretable` est vide ; le verdict reste
`non concluant` et le nombre de clés non vides reste cinq. Le banc gagne **249** (guillemet non fermé,
classé invalide, refus nommé, limite par entrée) et **250** (commande valide mais aveugle : clé aveugle,
limite par entrée, limite agrégée disparue) ; le **221** change de clé attendue, de
`shell_non_interpretable` à `shell_invalide`, et le **234** nomme la seizième clé. Au passage, le banc
répare son propre détail d'échec : `controle` exporte `DETAIL`, et quarante-deux contrôles écrivent leurs
raisons dans `process.env.DETAIL` au lieu d'un `$DETAIL` vide, donc les raisons s'impriment sous `FAIL`.

**Ce que ce n'est pas** : une dégradation du lecteur aveugle en simple limite. Le brainstorm la
conditionnait à une autre mesure qui couvrirait les mêmes effets, et elle n'existe pas : le `porcelain`
voit les fichiers, jamais une lecture, et rien ne voit un réseau appelé sous une variable. La dégradation
est refusée, et un run dont une commande est illisible reste `non concluant`.

**Falsificateur** : une commande que le shell accepterait classée `shell_invalide` ; une commande au
guillemet non fermé laissée dans `shell_non_interpretable` ; une copie du run `spike-annees` dont le
verdict ou le nombre de morsures change.

## ADR-071 — La conduite d'un run se déclare, agent ou humain, et ne s'atteste plus (2026-10-22)

**Contexte.** `faits.json` portait un `temoignage{qui, quand, texte}` que `faits` exigeait et que `suite`
remplissait d'un texte par défaut : « orchestrateUR : le fil a été ouvert et suivi par la personne, aucune
session n'est simulée ». Le run `spike-annees` a pourtant été ouvert et conduit par `ouvrir`, sans
personne, et son `faits.json` porte ce texte ; le rapport technique en tire « les gestes humains, qui
reposent sur `temoignage` ». Une pièce attestait donc une présence qu'aucune machine n'a vue
([brainstorm](brainstorm/2026-10-22-100513-protocole-apres-le-run-spike.md) §2 et §5,
[spec](tasks/2026_10/2026-10-22-124513-conduite-declaree/2026-10-22-124513-spec.md) §1 et §2).

**Décision.** `faits.json` porte un bloc `conduite{mode: "agent" | "humain", qui, quand}`, et plus de
`temoignage`. `faits` exige `--conduite` ; une valeur hors des deux mots, ou absente, est un refus d'usage
(`exit 2`) qui nomme les deux valeurs. `--par` reste l'identifiant de qui a conduit et alimente
`conduite.qui` ; `--fin` alimente `conduite.quand`. `orchestrer suite` reçoit `--conduite` et le passe à
`faits` : il n'a plus de `--temoignage` et plus de valeur par défaut. Le reçu recopie le bloc tel quel et
ajoute toujours une limite qui dit que la conduite est **déclarée** par l'opérateur, jamais vérifiée, et
que le reçu ne prouve pas qui a répondu.

**Conséquences.** Un `faits.json` antérieur, qui porte `temoignage` et aucun `conduite`, reste lisible : le
reçu écrit `conduite: null` et ajoute la limite `conduite_non_declaree`, qui nomme l'ADR-071 et l'ignorance
du mode. Il ne déduit jamais `humain` d'un témoignage : le run `spike-annees` est exactement le contre-exemple,
un témoignage de personne sur un run conduit par un agent. Un `faits.json` sans `conduite` ni `temoignage`
est refusé. Le verdict ne change pas : une conduite d'agent n'est ni une faute ni un mérite. Les pages
lisibles par la personne disent le mode — le rapport technique par une ligne, la page utilisateur par la
phrase d'en-tête et une ligne de ce qu'elle ne dit pas. Le banc gagne **251** (`faits --conduite agent`
écrit le bloc, sans témoignage, et le reçu le recopie), **252** (conduite absente ou hors domaine refusée en
`2`, sans écrire, refus qui nomme `agent | humain`) et **253** (`faits` antérieur accepté, `conduite: null`,
limite nommée, verdict inchangé) ; le compte des valeurs du contrôle **125** reste **18**, `conduite` ayant
trois clés comme `temoignage` en avait trois.

**Ce que ce n'est pas** : une vérification de la conduite. Aucun témoin, aucune empreinte de personne : le
mode reste une parole de l'opérateur, et c'est pourquoi il porte une limite plutôt qu'un champ de preuve.
Ce n'est pas non plus un jugement de qualité : déclarer `agent` ne dégrade ni n'améliore un run.

**Falsificateur** : un `faits.json` sans `conduite` ni `temoignage` accepté par `receipt` ; un témoignage
seul rendant `conduite.mode: "humain"` ; une copie du run `spike-annees` dont le `faits.json` réécrit avec
`conduite {mode: "agent", qui: "ouvrir"}` rend un verdict autre que `non concluant`, ou dont une limite
affirme que la conduite est prouvée.

## ADR-072 — Une question en texte est une pause, elle aussi (2026-10-22)

**Contexte.** Le run `2026-10-22-151155-bee028f8-e2df6dc` rejoue le cas `plan-simple` sur
`ollama/qwen3:8b`. La trace porte deux fichiers distincts lus, un `glob`, un chargement de skill, puis au
seq 9 un texte `assistant` qui finit par « Would you like to proceed with creating the implementation plan
using this skill? » et rien d'autre. Aucun formulaire, aucune écriture, huit limites, verdict
`non concluant`. `ouvrir` ne connaissait que `GET …/form` : il aurait vu zéro formulaire, un `idle`, et
conclu, sans envoyer la réponse figée. La pause n'aurait pas été jouée.

**Décision.** `ouvrir` lit aussi le dernier texte d'un message `assistant` postérieur à sa référence.
Si sa dernière ligne non vide **hors bloc de code** se termine par `?`, c'est une question en texte :
la réponse figée suivante part comme message `user`, une seule fois, et le bloc dit qu'elle a été jouée.
Le message auquel une réponse a déjà été envoyée est exclu par son `id`, et un part `text` qui commence
par `<system-reminder>` n'est pas un texte du modèle. Un formulaire garde la priorité ; la question en texte n'est examinée qu'une fois la session inactive,
jamais pendant un tour. S'il ne reste aucune réponse figée, le refus est celui de la spec 000407, avec le
même texte : la question suivante se fige dans l'attendu, jamais à la volée. La détection est mécanique et
bornée : un `?` dans un bloc de code ne compte pas, et le dernier texte est le seul examiné.

**Conséquences.** Cinq contrôles, **254** à **258**, contre le serveur factice des contrôles 224 à 227 :
une question en texte reçoit la réponse une fois (254) ; un formulaire répond d'abord, puis une question
en texte reçoit la réponse suivante, sans double envoi (255) ; trois questions pour deux réponses figées
refusent la troisième (256) ; un `?` dans un bloc ne déclenche rien (257) ; un rappel système terminé par `?` est écarté (258). Le banc passe à **258/258
PASS**. `ORCHESTRATEUR`, `BANC`, `ARCHITECTURE`, `EXPLICATION`, `README`, `DEVICE` et le guide portent le
nouveau compte.

**Mesure après coup.** Un run neuf, `2026-10-22-165953-bee028f8-bc24b7c`, même cas et même gel,
`ollama/qwen3:8b`, a été ouvert par `ouvrir` : **13 min 24 s**, `1/3` échanges, **0 question**, aucun
produit. La session s'est arrêtée sur un texte `<system-reminder>` au seq 9, qui ne finit pas par `?` ;
`ouvrir` a conclu sans inventer de réponse, et le reçu est `non concluant` à **8** limites. Le chemin
de la question en texte n'a donc été exercé que par les contrôles **254 à 258**, pas par une session
réelle : un run dont le modèle pose un texte terminé par `?` reste à faire.

**Ce que ce n'est pas** : une compréhension de la question. Un texte rhétorique qui finit par `?` reçoit
la réponse figée ; c'est une limite, dite au bloc et lisible dans la trace. Ce n'est pas non plus un
formulaire : aucun champ n'est rempli, aucune option n'est choisie, et la réponse vient toujours de
`demande.reponses_figees`. Le cas, le gel et l'attendu ne changent pas.

**Falsificateur** : une réponse figée envoyée deux fois au même texte ; une question en texte non jouée
alors qu'une réponse restait ; un formulaire qui perd la priorité ; un `?` dans un bloc de code qui
déclenche un envoi ; un `exit 0` alors que la session est encore vivante.
