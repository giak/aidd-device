---
name: Retour d'expérience — le run guidé de `01-plan`
description: "Ce qu'un run guidé prouve et ne prouve pas, mesuré sur le run de 01-plan : granularité d'un seq unique, chemins lus absents de l'export, accord invisible, fichier vide laissé par un refus ; sept corrections génériques à tout skill, classées par coût"
type: brainstorm
status: done
---

# Retour d'expérience — le run guidé de `01-plan`

> 2026-10-23, né à **17:30:17** (`stat -c %w`). Source : [run guidé](../device/runs/2026-10-23-171858-guide-01-plan/run-guide.md)
> et sa trace (133 lignes), [spéc du run guidé](../tasks/2026_10/2026-10-22-221207-traces-et-run-guide/2026-10-22-221207-spec-run-guide.md),
> [présentation de l'épreuve](../tasks/2026_10/2026-10-23-034641-presentation-de-l-epreuve/2026-10-23-034641-spec.md),
> [PROTOCOLE](../PROTOCOLE.md), [ADR-073](../DECISIONS.md), [ADR-074](../DECISIONS.md).
> Une seule instance : ce document propose, il ne mesure pas ses propres propositions.

## 0. Les six questions

1. Le skill est-il testé ?
2. Ce qu'il a produit a-t-il été testé ?
3. Qu'avons-nous appris ?
4. Où sont les erreurs ?
5. Comment les corriger ?
6. Que changer dans le protocole, pour **tout** skill ?

## 1. Réponses courtes

| Question | Réponse | Preuve |
| --- | --- | --- |
| le skill est-il testé ? | **Non, au sens d'une mesure.** Sa procédure a été exercée une fois, dans la session qui l'évalue, sans cas, sans second opérateur. | une instance, `statut: forme tenue`, limites `session_non_independante` et `attendu_non_gele` ; `docs/device/CASES/` ne porte aucun cas `01-plan` |
| le produit est-il testé ? | **Non.** Aucune phase exécutée, aucun test lancé, aucune route appelée. Sont vérifiés : la forme, les chemins, les sections, l'absence de place-holder, la couverture des projections, l'intégrité du terrain. | huit fichiers, 582 lignes, `sha256` du `plan.md` ; `app.py` du terrain inchangé (`sha256` `9f2e8d5c…`) |
| qu'a-t-on appris ? | voir §2 : cinq faits mesurés, dont trois que le protocole ne sait pas voir | trace seq 656-657, 62 outils pour un seul `seq` |
| où sont les erreurs ? | quatre dans le protocole, deux dans le harnais, une dans le skill éprouvé, deux dans la méthode | §3 |
| comment corriger ? | sept corrections, dont trois sans une ligne de code | §4 |
| quoi améliorer pour tout skill ? | une grille dérivée des actions du skill, des preuves granulaires, un accord qui laisse une trace, une clôture nommée | §5 |

## 2. Ce qui a été mesuré

- **La trace ne connaît qu'un tour.** L'export fait 133 lignes : le message 656 (la consigne, une part) et le message 657 (le run entier, 132 parts), dont 62 parts `tool`, 49 `reasoning`, 18 `text`. Donc **six gestes d'écriture, trois questions, quatorze lectures et vingt commandes partagent un seul `seq`** : la grille cite `seq 657` pour onze lignes, et ne peut pas dire quand, dans le tour, chaque geste a eu lieu.
- **L'export ne nomme pas les chemins lus.** `chemin_outil` ne lit que `$.input.path` ; les six appels `read_files` de ce run ont `chemin_outil` nul, parce que l'outil prend `paths`. La famille « accès à une source » se prouve par le nom de l'outil, jamais par la source.
- **L'accord de la personne n'est pas dans la trace.** Les trois appels `ask_questions` gardent `kind`, `id`, `toolName`, `input` : la réponse choisie n'est écrite nulle part. La ligne « poser une question et obtenir l'accord » du run a dû passer de `tenu` à `non observé` après lecture des parts.
- **Un run guidé ne peut pas attacher sa trace dans le tour qui le joue.** Premier `tracer` : `REFUS — l'export … est vide`, parce que la fenêtre partait de la consigne (`17:18:04`) et que le client n'écrit le message d'un tour qu'à sa fin ; le seul message du run présent portait `17:17:43`. L'export a réussi au tour suivant, fenêtre `17:17:00 → 17:27:00`.
- **Un refus de `tracer` laisse un fichier derrière lui.** `trace/echange.jsonl` de zéro octet a été créé avant le constat de vacuité ; un second appel aurait refusé pour « trace déjà là ». Retiré à la main.
- **Le produit n'a pas été exercé.** Les six phases sont des instructions ; leurs critères d'acceptation n'ont été exécutés ni par moi ni par personne. Les 33 routes et les sept modules sont des projections, pas des faits.

## 3. Rôles, et ce que chaque lentille a trouvé

Cinq rôles, joués **en interne** dans cette séance. Revue déclarée interne : aucun second relecteur n'est disponible
dans cette session, et le seul agent délégable ouvre le web, il n'audite pas ce dépôt ; aucune revue indépendante
n'est donc revendiquée ([AGENTS.md](../../AGENTS.md), `INDEPENDENT REVIEW`).

**R1 — Expérimentateur.** Ce qui a eu lieu est une **instance**, pas une mesure : n = 1, sans cas, sans opérateur
séparé, sur une source que l'agent a choisie lui-même. Trouve que le mot « testé » est surévalué, et propose que le
protocole nomme ses niveaux : `touché` (une instance jouée), `mesuré` (un cas, une grille, des preuves citées),
`indépendant` (session qui n'a pas vu l'attendu).

**R2 — Auditeur de preuve.** La grille est écrite par celui qui joue le skill, avec des preuves qu'il choisit. Un
`seq` unique rend onze lignes indiscernables ; les chemins lus manquent ; l'accord manque. Trouve que la grille est
aujourd'hui une **déclaration structurée**, pas une lecture de trace, et propose de dériver les lignes des actions
du skill, d'ajouter le rang de part et les `paths`, et de faire vérifier la grille mécaniquement.

**R3 — Ingénieur harnais.** Deux défauts reproduisibles : l'écriture avant le constat de vacuité, et
`chemin_outil` qui ignore `paths`. Trouve que les deux tiennent en peu de lignes et qu'aucun ne demande une ADR.

**R4 — Concepteur de protocole.** Le protocole suppose une pause qui laisse un tour `user` ([ADR-069](../DECISIONS.md)) ;
le mode guidé valide par un outil, donc la pause n'existe pas comme fait. Il suppose aussi qu'un run peut se clore
dans son tour, ce qui est faux par construction du client. Trouve que ces deux points ne sont pas des accidents :
le mode guidé a été décidé avant `tracer`, et la spec du run guidé ne les a pas rouverts.

**R5 — Avocat du diable.** Coût réel : une heure, 582 lignes produites, zéro exécution, zéro décision tranchée sur
le découpage d'`app.py`. Le dispositif mesure la **forme** et appelle cela un test de skill. Il propose un budget
déclaré avant le run (fichiers, lignes, minutes) et l'obligation de dire ce que le produit engage, sinon un run
guidé devient une production déguisée en épreuve.

## 4. Où sont les erreurs

| Couche | Erreur | Nature |
| --- | --- | --- |
| protocole | la pause est un tour `user`, mais le mode guidé valide par `ask_questions`, dont la réponse n'est pas persistée | mesure |
| protocole | la grille est écrite par le joueur, sans dérivation obligatoire depuis les actions du skill | conception |
| protocole | un `seq` par message : deux gestes du même tour ne se distinguent pas | mesure |
| protocole | aucun geste de clôture : la trace ne peut pas naître dans le tour qui la cite | conception |
| harnais | `tracer` écrit `echange.jsonl` avant de savoir que l'export est vide | défaut |
| harnais | `chemin_outil` ne lit que `path`, jamais `paths` | défaut |
| skill éprouvé | `01-plan` ne dit pas comment vérifier qu'une phase est exécutable, et son gabarit contient des mermaid qu'aucune commande ne valide | limite du skill |
| méthode | le joueur, l'auteur de l'attendu et le juge sont la même session | conception |
| méthode | aucun budget : un plan de six phases a été produit sans que personne ait demandé cette taille | dérive |

## 5. Corrections, génériques à tout skill

Classées par couche et par coût. Chacune porte son falsificateur : l'observation qui la rendrait inutile ou fausse.

| # | Correction | Couche | Coût | Falsificateur |
| --- | --- | --- | --- | --- |
| C1 | **La grille se dérive du skill** : une ligne par action déclarée dans `SKILL.md`, plus les quatre familles d'ADR-073 ; une action sans ligne rend la grille incomplète | règle | nul | un skill de trois actions dont la grille porte trois lignes rattachées, et une action volontairement omise que le contrôle signale |
| C2 | **L'accord est un tour `user`, ou la ligne est `non observé`** : une validation rendue par un outil ne compte pas comme pause | règle | nul | un run dont l'accord est un message `user` et dont la ligne cite son `seq` |
| C3 | **La clôture est un geste nommé** : le run guidé s'ouvre, se joue, puis se clôt au message suivant ; `run.json` porte `cloture_le`, et le §5 bis n'est rempli qu'à la clôture | règle + 1 champ | faible | un run dont la trace est exportée dans le tour du jeu sans refus |
| C4 | **Les preuves citent `seq#rang`** : l'export ajoute le rang de la part, et la grille cite `657#12` au lieu de `657` | harnais | faible | deux gestes du même message distingués par leur rang, et un rang hors bornes refusé |
| C5 | **Les chemins lus sortent** : `chemins_outil` lit `$.input.paths` (liste) en plus de `$.input.path` | harnais | faible | un `read_files` dont les chemins sont cités dans la grille et retrouvés dans l'export |
| C6 | **`tracer` n'écrit rien avant de savoir** : export dans un fichier temporaire, renommage après le contrôle de vacuité ; un refus ne laisse aucune pièce | harnais | faible | un refus suivi d'un second appel accepté, sans nettoyage manuel |
| C7 | **`runs.mjs` vérifie la grille** : chaque ligne `tenu` cite un `seq` présent dans la trace et un chemin cité qui existe ; une ligne `tenu` sans preuve est refusée | harnais | moyen | une grille avec un `seq` absent, refusée ; la grille réelle du run 01-plan, acceptée sur les lignes `tenu` |

Deux règles sans contrôle, qui relèvent du protocole et non du harnais :

- **L'attendu se scelle par empreinte** : `run.json` porte le `sha256` du §3 au moment de la validation. Cela ne
  prouve pas l'antériorité, mais interdit de réécrire l'attendu après le produit sans que la pièce le montre.
  Falsificateur : un §3 modifié après coup, dont l'empreinte ne correspond plus.
- **Forme n'est pas effet** : un run guidé prouve la forme ; il ne ferme un skill que si un second run donne le
  produit à une session qui l'exécute. La [spec du 22:12](../tasks/2026_10/2026-10-22-221207-traces-et-run-guide/2026-10-22-221207-spec-run-guide.md)
  §8 le dit déjà ; le PROTOCOLE ne le dit pas, et c'est là que le mot « test » se surévalue.

## 6. Ce que ces corrections ne règlent pas

- **L'indépendance** : aucune correction ne remplace une session qui n'a pas lu l'attendu ; elles rendent la
  déclaration vérifiable, pas la séparation réelle.
- **La vérité du produit** : vérifier qu'une ligne `tenu` cite un `seq` existant ne dit pas que le geste a eu lieu ;
  cela dit que la preuve est bien formée. Un `seq` cité peut désigner un tour où le geste est ailleurs.
- **La valeur d'un plan** : rien ici ne mesure si les phases sont exécutables, ni si le découpage est le bon.
- **Le coût** : C4 à C7 ajoutent des contrôles ; sans budget déclaré, un dispositif plus rigoureux produira plus de
  pièces pour le même nombre de décisions tranchées.

## 7. Ordre proposé

1. **C2 et C1**, règles seules : elles changent ce qu'un run a le droit d'écrire `tenu`, sans toucher au code.
2. **C6, C5, C4**, une requête et un fichier temporaire : les trois défauts mesurés.
3. **C3**, la clôture : un champ et un paragraphe.
4. **C7**, le contrôle de grille : le seul qui transforme une déclaration en pièce vérifiée.
5. **Le sceau de l'attendu** et la règle forme/effet, quand un deuxième run voudra comparer.

## 8. Ce que ce retour ne prouve pas

Une instance, un skill, un terrain, une session. Les rôles sont internes. Les corrections sont proposées, aucune
n'est éprouvée. Les chiffres viennent de la trace du run et des commandes citées au journal, pas d'une seconde
lecture indépendante. Le rendu des mermaid n'a été validé par aucune commande : c'est justement l'une des limites
du skill éprouvé.

## 9. Décision demandée

Une seule question : commence-t-on par les deux règles gratuites (C1, C2), ou par les trois défauts du harnais
(C4, C5, C6) qui ont un contrôle de banc à écrire ?
