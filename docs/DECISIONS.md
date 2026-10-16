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
