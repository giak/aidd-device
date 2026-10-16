---
name: Relecture à froid des entrées
description: La marche du README et de ses huit entrées, faite en inconnu, avec les six endroits où la lecture décroche, la mesure de chacun, et la plus petite réparation qui les enlève
type: relecture
status: in-progress
---

# Relecture à froid des entrées

> 2026-10-16. Marche faite dans l'ordre du [README](../../README.md) : ARCHITECTURE, AGENTS, DEVICE,
> BOUNDARY, REPLAY, EXPLICATION, le bilan du premier run, le journal, puis les quatre pages du dernier
> groupe. **Ce n'est pas une relecture indépendante** : la même main a écrit aujourd'hui la page
> d'architecture et l'entrée du README, donc elle sait où chaque chose est rangée, et c'est exactement
> ce qui l'empêche de voir. Les constats ci-dessous sont mesurés, jamais appliqués : aucune réparation
> n'est faite ici.

## En une page

| # | Là où la lecture décroche | La mesure | Plus petite réparation |
| --- | --- | --- | --- |
| 1 | l'ordre ouvre par le dedans | `README.md` l.8 : ARCHITECTURE en tête ; la `VISION`, qui dit pourquoi le dépôt existe, est l.19, groupée avec trois autres pages | une phrase dans l'entrée d'architecture : ce que ce dépôt est, et pourquoi |
| 2 | « AIDD » n'est défini nulle part | `grep -i aidd` sur README, VISION, EXPLICATION, ARCHITECTURE : des emplois, aucune définition ; le dépôt testé n'est nommé qu'en BOUNDARY §3 | une ligne : le framework testé, son dépôt, ce que « AIDD » désigne |
| 3 | « run » et « cas » sans définition | le lexique (EXPLICATION §14) définit quatorze mots, dont ni `run` ni `cas` ; le README ouvre sa section État par « Un run a eu lieu » | deux lignes au lexique |
| 4 | un même nom pour deux arbres | BOUNDARY §1 l.19 : `framework-origin` est la **source** ; l.20 : la **copie** vit dans `<racine>/<cas>/framework-origin` et son label est « révision sous test » | un avertissement d'une ligne, là où les deux tableaux se suivent |
| 5 | ce qui n'existe pas encore n'est pas dit | `NEGATIVE.md` : 0 occurrence dans README et ARCHITECTURE ; `ECART.md` : trois, toutes dans ARCHITECTURE ; le README promet « il nomme l'écart », qu'aucun run n'a produit | une ligne d'état : ce qui est écrit, ce qui reste |
| 6 | la fraîcheur d'EXPLICATION | son en-tête annonce « 2026-10-15, 21 commits » ; l'arbre est au 36e | rien à corriger, c'est daté : dire d'où vient l'état courant (le DASHBOARD) |

## 1. La marche, et ce qu'elle a trouvé

| Étape | Ce que la page apprend | Ce qu'elle suppose déjà connu |
| --- | --- | --- |
| README | le dispositif nomme l'écart entre ce qu'une modification promet et ce qu'elle produit ; l'état du 2026-10-15, un run `non concluant` | « framework AIDD », « session », « run » |
| ARCHITECTURE | le câblage complet : acteurs, arbres, cinq commandes, artefacts, falsificateurs, plafond | « run », « cas », « gel », « attendu », tous expliqués en passant mais pas définis |
| AGENTS.md | le contrat de travail, dense, à la deuxième personne | rien : celui-là ne s'adresse pas au lecteur mais à l'agent |
| DEVICE | ce qu'il fait, ne fait pas, la séquence d'un run, comment cloner | « run », et un lecteur qui ne connaît pas la spec |
| BOUNDARY | les arbres, les chemins lus, les preuves chiffrées d'intégrité | le lecteur doit déjà savoir quel arbre porte quoi |
| REPLAY | la recette la plus actionnable du dépôt : rejouer le gel depuis un clone neuf, avec sa sortie observée | « gel », « empreinte », « arbre » |
| EXPLICATION | le projet raconté avec des analogies, l'état réel, les échecs | rien : c'est la page la plus accueillante, et elle arrive sixième |
| bilan du premier run | les quatre causes du `non concluant`, l'ordre de reprise | « run », et 534 lignes de lecture |
| journal | ce qui a été fait, séance par séance | le vocabulaire des séances |

## 2. Les six endroits, un par un

### 1. On commence par le dedans

La première entrée est la plus technique : commandes, falsificateurs, plafond du verdict. Un inconnu
apprend *comment c'est câblé* avant de savoir *ce que ça résout*. La page la plus simple, EXPLICATION,
est sixième (« le projet raconté simplement »), et celle qui dit pourquoi le dépôt existe, la VISION,
est dans le dernier groupe, mêlée à trois autres. Le remède n'est pas de réordonner les entrées : c'est
de dire, dans la ligne d'entrée d'architecture, ce que le dépôt est, en une phrase, et où lire le
pourquoi.

### 2. « AIDD » n'est défini nulle part

Le mot est dans le titre du dépôt et dans la première phrase du README, et il n'est jamais défini. Un
inconnu ne peut pas savoir de quel framework il s'agit, ni où il vit : les deux adresses
(`github.com/giak/framework`, `github.com/ai-driven-dev/framework`) n'apparaissent qu'en BOUNDARY §3,
au milieu d'un paragraphe de relevés. EXPLICATION §2 s'en approche (« un framework de compétences pour
assistants IA ») mais ne le nomme pas.

### 3. « run » et « cas » sans définition

Ce sont les deux mots qui nomment le travail, et le lexique ne les a pas. Le README les emploie dès sa
section État ; ARCHITECTURE les emploie dans chacune de ses tables. Les définitions existent
implicitement (un run est une épreuve menée par une session, le cas est sa fiche), elles ne sont écrites
nulle part en une phrase.

### 4. Un même nom pour deux arbres

`framework-origin` désigne à la fois la **source** (`/home/giak/projects/framework`, BOUNDARY §1 l.19) et
le **dossier de la copie** (`<racine>/<cas>/framework-origin`, l.20), dont le label de gel est
« révision sous test ». Le texte remis à la session porte le second sens, BOUNDARY §3 parle du premier,
et rien ne prévient. Un lecteur qui croise `framework-origin` doit décider à chaque fois duquel on
parle. ARCHITECTURE §3 montre les deux ensembles de « quatre arbres » mais ne nomme pas ce
recouvrement-là.

### 5. Ce qui n'existe pas encore n'est pas dit

Le README promet que le dispositif « nomme l'écart » ; aucun run n'a produit d'`output.json`, et rien,
dans les deux premières pages, ne le dit. `NEGATIVE.md` n'apparaît ni au README ni dans ARCHITECTURE ;
`ECART.md` n'apparaît que dans ARCHITECTURE, sous forme de ligne de tableau. Un inconnu cherchera donc
l'écart et le compte-rendu, et ne trouvera ni l'un ni l'autre, sans explication.

### 6. La fraîcheur d'EXPLICATION

Son en-tête annonce « État décrit : 2026-10-15, 21 commits » et son §9 dit « 21 commits, poussé » :
l'arbre est au 36e. C'est daté, donc ce n'est pas faux, mais c'est la page qu'un inconnu lit pour
comprendre, et son état a six séances de retard. Y renvoyer vers le DASHBOARD pour l'état courant
suffirait.

## 3. Ce qui manque, et qui n'est dans aucune des huit entrées

- **Aucune page ne dit ce qu'un inconnu peut faire tout de suite.** REPLAY est la recette la plus
  actionnable (elle se lance depuis un clone neuf, sans cette machine), DEVICE dit explicitement qu'il
  n'y a pas de commande unique de lancement. Mais rien ne répond à « je viens d'arriver, que puis-je
  vérifier en cinq minutes ? », alors que la réponse existe et est mesurée.
- **Le vocabulaire des états** (A : un run a eu lieu ; B : rien n'est revenu ; C proposé : un run sans
  produit) vit dans EXPLICATION §14 et dans DEVICE §L'état, jamais au même endroit qu'une explication
  d'ensemble.
- **Le journal n'a pas d'index.** 814 lignes, quatre sections ; son en-tête explique bien les numéros
  manquants (les séances 2 et 4 sont parties avec le dossier du contrat), donc rien n'y est faux. Il faut
  le lire linéairement pour retrouver un sujet.

## 4. Limites de cette relecture

- Elle n'est **pas indépendante** : la même main a écrit aujourd'hui la page d'architecture et l'entrée
  du README. Un vrai inconnu verrait probablement d'autres choses, et peut-être pas celles-ci.
- Elle a **lu**, elle n'a **rien exécuté** : ni la recette de REPLAY, ni la séquence de DEVICE. Ce que
  coûte une installation réelle (les quatre arbres, la base du client) n'est donc pas mesuré ici.
- Les six constats sont **mesurés mais non arbitrés** : la plus petite réparation de chacun est proposée,
  aucune n'est appliquée.
