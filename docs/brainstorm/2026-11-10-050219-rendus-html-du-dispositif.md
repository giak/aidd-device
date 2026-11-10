---
name: Rendre l'état lisible — trois rendus HTML, ou aucun
description: "ce que les quatre pages d'expanse font, ce que la règle « une réponse, un foyer » interdit à un HTML du dispositif, le jeu de trois rendus datés proposé avec la discipline PAO héritée, et ce qu'aucune page ne peut prouver"
type: brainstorm
status: in-progress
question: Quelles pages HTML produire pour le dispositif, sans créer un second foyer ?
---

# Brainstorm — des rendus HTML pour le dispositif

> Né le 2026-11-10, nom porté par la mesure `date '+%Y-%m-%d-%H%M%S'` à 05:02:19 ; la naissance mesurée
> vaut 05:03:50 (`stat -c %w`), et l'écart de 91 s sépare la mesure du nom de l'écriture : il se nomme
> plutôt que de se corriger. Aucun HTML n'est écrit ici : cette page prépare la décision, elle ne la prend
> pas.
> Note de lecture : le dépôt s'est arrêté le 2026-10-25 (dernier commit `393a881`), avec un travail du
> 2026-10-26 non commité. Tous les chiffres cités plus bas sont donc ceux du 2026-10-26, pas ceux de ce
> matin.

## 1. Où en est le dépôt, en faits mesurés

Une page qui reprend le projet après une semaine doit d'abord savoir ce que le dépôt porte réellement.

- **Dernier commit** : `393a881`, 2026-10-25, « Consigner les contrôles de recevabilité, la page de
  décision et le run mort du 2026-10-25 » (`git log -1`).
- **Non commité** : l'audit du 2026-10-26 (204 lignes), trois dossiers de runs (`192849`, `193711`,
  `194204`), et les modifications de `docs/device/runs/INDEX.md` et `docs/trace.md` (`git status
  --porcelain`). Un rendu daté de ce matin citerait donc des pièces que `git log` ne porte pas encore.
- **Corpus** : 60 runs, 36 reçus, 5 guidés, 17 avortés, 2 manuels, tous les reçus en `client: opencode`
  (`head docs/device/runs/INDEX.md`, généré par `runs.mjs`).
- **Banc** : dernier passage enregistré 340/340 (Séance 197), non rejoué depuis ; la Séance 198 le dit
  plutôt que de le supposer.
- **Ce qui bloque** : le geste d'import de dossier dans l'application Freebuff. Quatre fils ouverts sur le
  cas jouet, quatre refus identiques, `sources: []` sur les quatre projets nommés par le chemin ; la boîte
  GTK accepte le dossier mais `Return` prend la première complétion, `.git` (`docs/trace.md`, Séance 198,
  22:21 ; audit §2.2).
- **Points ouverts** : dix lignes au [tableau de bord](../DASHBOARD.md), numéros 1 à 9 et 11, le 10 restant
  libre par convention.

Conséquence pour la suite : aucune page ne peut dater l'état d'aujourd'hui. Elle peut dater l'état du
2026-10-26, et dire lequel.

## 2. Ce que les quatre pages d'expanse font vraiment

| Page | Question à laquelle elle répond | Genre tenu | Ce qui se réutilise ici |
| --- | --- | --- | --- |
| `architecture.html` | où vit quoi, et par où passe chaque chose ? | atelier : IBM Plex, grille de fond, palette teal/ambre/argile, rail de navigation | le triptyque **carte physique / flux / limites**, et la légende de traits qui distingue le flux réel du flux manquant |
| `dashboard.html` | qu'est-ce qui est ouvert, et dans quel état ? | tableau dense, chiffres en tête, extrait de trace daté | la rangée de mesures d'ouverture, puis le détail par section ; la trace en extrait avec son horodatage |
| `parcours-etat.html` | qu'est-ce qui est prouvé, où est l'écart, quelle est la prochaine décision ? | dossier : serif, papier, navy et laiton, aucune police distante | **le brief PAO en tête de fichier** et la section « Sources, au même endroit » ; c'est la page la plus utile au porteur seul |
| `recap-visuel.html` | comment le projet s'est-il construit, en combien d'actes ? | récit chronologique, durées, étapes | rien qui ne soit déjà dans le dossier de situation : c'est le récit, et le récit est au journal |

Deux choses frappent à la lecture des quatre. D'abord, la page de dossier charge **zéro police distante**
alors que les trois autres tirent IBM Plex de Google Fonts : la pièce qui doit survivre s'ouvre hors ligne,
les autres s'embellissent en ligne. Ensuite, la discipline de ces pages n'est pas dans le CSS mais dans
trois gestes : un brief PAO qui énonce la thèse avant la première balise, une figure par affirmation avec sa
légende, et un pied qui dit comment vérifier ce qu'on vient de lire.

## 3. La tension propre à ce dépôt : un HTML y est un second foyer

L'[INDEX](../INDEX.md) §2 est explicite : « Un fait chiffré se cite par son foyer. S'il apparaît ailleurs,
c'est un défaut, même si les deux copies concordent. » Une page qui afficherait « 60 runs, 36 reçus, dix
points ouverts » recopierait [DASHBOARD](../DASHBOARD.md) et l'index généré des runs. Elle serait un
second foyer, donc un défaut, quelle que soit sa qualité visuelle.

Trois issues, et une seule tient :

1. **Le rendu daté** : la page n'est pas un foyer, c'est une **vue** d'une date. Son nom porte la date,
   elle ne s'édite jamais, elle se régénère sous un nouveau nom quand l'état change. Trois conditions la
   tiennent honnête : chaque chiffre porte la commande qui l'établit ; chaque section nomme le foyer dont
   elle est la vue ; l'[INDEX](../INDEX.md) gagne une section « rendus » qui dit qu'un rendu ne fait pas
   autorité. Une page périmée se périme par son nom, elle ne ment pas.
2. **Un nouveau foyer** : lui donner sa propre question (« comment lire l'état d'un coup d'œil ? ») et
   assumer qu'elle fait autorité. Coûteux : il faudrait alors la tenir à jour, donc la maintenir à la main,
   ce que le dépôt refuse partout ailleurs (l'index des runs est généré, pas écrit).
3. **Aucun HTML** : rester au markdown. Honnête, et suffisant pour qui lit `docs/` dans un éditeur. Insuffisant
   pour la demande d'aujourd'hui : reprendre après une semaine, d'un coup d'œil.

**Recommandation : l'issue 1**, dans `docs/rendus/`, un fichier par page et par date.

## 4. Trois pages, pas quatre

| Rendu proposé | Question | Genre | Foyers dont il est la vue | Ce qu'il ne dit pas |
| --- | --- | --- | --- | --- |
| `etat-2026-11-10.html` | qu'est-ce qui est prouvé, qu'est-ce qui bloque, quelle est la prochaine décision ? | dossier, serif et papier | DASHBOARD, audit du 26, Séance 198, ADR-106 et ADR-107 | que le dispositif tient sa promesse : aucun reçu Freebuff n'existe |
| `architecture-2026-11-10.html` | où vit quoi, et par où passe une pièce, de la demande au reçu ? | atelier, Plex et grille | ARCHITECTURE §2, §3, §4, §7 | ce que coûte le mode guidé, qui est une limite, pas un flux |
| `runs-2026-11-10.html` | quelle preuve ce corpus porte-t-il, et quelle part n'en porte aucune ? | instrument, table dense | index généré des runs, audit §2 | une cause d'avorté que le corpus ne nomme pas |

Trois raisons de s'arrêter à trois :

- **Le récit est déjà écrit.** `recap-visuel.html` raconte la construction ; ici, le récit est le
  [journal](../trace.md), 10 765 lignes, et un rendu qui le résume serait soit une copie, soit une perte.
  Le dossier de situation porte déjà ce qu'un récit apporterait de décidable.
- **Le protocole ne se regarde pas, il s'exécute.** Une page du [PROTOCOLE](../PROTOCOLE.md) montrerait
  neuf commandes et leurs refus ; elle remplacerait un mode d'emploi ordonné par une image, et devrait
  recopier les commandes. Il existe déjà : c'est le protocole.
- **La troisième page est celle qui manque le plus.** Le corpus de 60 runs n'est lisible nulle part
  aujourd'hui : l'index généré est un tableau de 60 lignes sans agrégat, et l'audit du 26 en donne les
  cohortes au milieu de 204 lignes de prose. C'est exactement le cas d'usage d'un rendu.

## 5. La discipline PAO, héritée et non imitée

Les pages d'expanse ne s'imiteront pas dans leur palette : le dispositif est un instrument de mesure, pas
un produit. Ce qui s'hérite, c'est la méthode, et elle est courte.

- **Brief PAO avant la première balise**, en commentaire : `THÈSE`, `GENRE`, `LECTEUR`, `MOUVEMENT`,
  `PREUVE`, `LIMITE`. Le brief est un test d'échec : si la page ne tient pas sa thèse, elle est refaite, pas
  retouchée.
- **Une figure, une affirmation**, et la légende l'énonce. Une flèche porte son verbe et son volume
  (« 36 reçus sur 53 runs ouverts »), jamais « lié à ».
- **La couleur encode l'état, pas l'esthétique** : rouge seulement pour un manque prouvé, ambre pour une
  limite nommée, le reste au neutre. Aucune couleur décorative dans les trois pages.
- **Zéro dépendance distante** : CSS inline, favicon en `data:`, aucune police téléchargée, aucune
  bibliothèque. Une pièce de preuve doit s'ouvrir dans cinq ans, hors ligne. C'est le choix de
  `parcours-etat.html`, étendu aux trois.
- **Pied « Vérifier cette lecture »** avec les commandes qui rétablissent chaque chiffre : ici
  `node docs/device/harness/runs.mjs --index`, `node docs/device/harness/liens.mjs`, et
  `bash docs/device/harness/banc-harnais.sh` pour le banc.

## 6. Ce qu'aucune des trois pages ne peut prouver

La règle de force de claim s'applique à un dessin comme à une phrase.

- **Aucun reçu Freebuff n'existe.** Une page peut montrer 36 reçus `opencode` et une porte ouverte ;
  elle ne peut pas montrer le run qui manque, et ne doit pas laisser croire qu'il existe.
- **Le banc n'a pas été rejoué depuis la Séance 197.** La page peut citer 340/340 enregistré, avec sa
  séance ; elle ne peut pas dire « le banc passe ».
- **Le geste d'import reste humain.** La page de situation peut décrire le critère d'acceptation
  (projet dont la clé est le chemin du terrain, `sources[0].kind = folder`, fil dont `threads.project_path`
  vaut ce chemin) ; elle ne peut pas exécuter le geste.
- **Le MCP `visual-explainer` n'est pas branché.** La recherche des outils MCP disponibles ne rend que
  `mcp-searxng-local`, `mnemolite`, `headroom`, `headroom-memory` et `context-mode` : les pages seraient
  écrites en suivant la skill `visual-explainer` (0.11.0), pas par son serveur MCP. L'écart se dit ici pour
  que personne ne l'attribue au MCP.

## 7. La décision, et ce qui la rendrait fausse

Une seule question : **produit-on les trois rendus datés dans `docs/rendus/`, un seul dossier de
situation, ou aucun HTML ?** Recommandation : les trois, dans `docs/rendus/`, avec une ligne par rendu à
l'[INDEX](../INDEX.md) qui dit qu'un rendu ne fait pas autorité.

Ce qui rendrait cette recommandation fausse : si l'état bouge avant la production (le run Freebuff réel
aboutit), le dossier de situation daterait un état déjà dépassé et il vaudrait mieux le produire après.
Autre falsificateur : si la production des trois pages demande plus de travail que la lecture directe de
`DASHBOARD.md` et de l'index des runs, alors la page est un ornement et il faut n'en faire aucune.

## 8. Ce que cette page ne fait pas

Aucun HTML, aucun dossier `docs/rendus/`, aucune modification d'[INDEX](../INDEX.md) ni du
[DASHBOARD](../DASHBOARD.md). La séquence du contrat est tenue : brainstorm, puis accord, puis spec courte
si l'accord ne suffit pas, puis production. Le travail du 2026-10-26 reste non commité : un rendu daté de
ce matin le citerait par chemin, ce qui est exact mais fragile, et le commit de ce travail est un geste
distinct, qui n'appartient pas à cette page.
