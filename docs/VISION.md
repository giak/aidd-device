---
name: Vision
description: La raison d'être du dépôt en une page, à la manière d'un document-cadre stable
type: vision
status: done
question: Pourquoi ce dispositif existe-t-il ?
---

# VISION

> Version 0.4 — 2026-11-10 (l'objet est un skill d'AIDD, ajouté ou modifié ; il tourne dans un AIDD installé
> dans un projet local, et le rapport sert la décision de l'utilisateur avant de rejouer la boucle).
> Complétée par la personne le 2026-11-10 ; [ADR-111](DECISIONS.md) reste la décision sur l'intention et sa
> comparaison. Document-cadre : se change rarement, par décision.

## Le projet en une phrase

Un **dispositif de test des skills d'AIDD**, qu'on en ajoute un ou qu'on en modifie un. On déclare
l'**intention**, c'est-à-dire ce que ce skill est censé faire et produire ; on **installe AIDD dans un projet
local** ; on y **fait tourner le skill** ; on **note ce qu'il produit** ; on **compare** ce produit à
l'intention de départ ; et on **écrit un rapport** qui aide l'utilisateur à décider. Il modifie alors le
skill, on remet le projet sur un AIDD fraîchement installé, et on **recommence**.

## Pourquoi ce dispositif

- `SUPPOSÉ(MEGA-PROMPT v6 §2)` : le framework porte deux surfaces, 458 fichiers markdown,
  16 413 lignes, et « aucun de ces contrôles ne dit si une promesse est vraie quand un modèle lit
  la skill » ([MEGA-PROMPT v6](brainstorm/MEGA-PROMPT-TEST-AIDD-v6.md), §2) — chiffres relevés
  par le v6 dans le dépôt du framework, jamais remesurés ici.
- Le besoin entier est : **transformer une conviction privée en fait partagé** — à une autre
  personne, pas à une machine (MEGA-PROMPT v6, §1).
- `SUPPOSÉ(MEGA-PROMPT v6 §9)` : huit tentatives antérieures ont échoué pour des causes
  récurrentes — dispositif non rejouable, attendu écrit après le produit, des chiffres produits
  faux puis réfutés par la commande qui tranche.

## La boucle, dans l'ordre

1. **Déclarer l'intention.** Le skill doit être assez explicite pour qu'on écrive, sans deviner, ce qu'il est
   censé faire et produire. Une intention qu'il faut inventer n'est pas une référence : c'est une faute du
   skill, et le test le dit.
2. **Installer.** Un projet local, puis AIDD installé dedans : c'est la situation du test, et ce projet ne
   sert qu'à elle.
3. **Faire tourner.** On emploie le skill dans ce projet, comme l'utilisateur l'emploierait.
4. **Noter.** Ce que le skill produit et fait, tel quel, avant toute interprétation.
5. **Comparer.** Le produit à l'intention de départ. L'écart nommé entre les deux est le résultat.
6. **Rapporter.** Un texte intelligible sur ce skill : ce qu'il fait, ce qu'il a produit ici, l'écart, et ce
   que l'utilisateur peut en faire. Approche pédagogique, aide à la décision, guide, explications : le
   rapport s'adresse à celui qui va modifier le skill, pas à une machine ni à un tableau de bord.

## La boucle ne s'arrête pas au rapport

L'utilisateur lit le rapport, décide, modifie le skill de l'AIDD. On met à jour ce skill dans le projet, on
remet le projet à un **AIDD fraîchement installé** (`git reset`), pour ne jamais mesurer un état mélangé, et
on fait tourner le skill de nouveau. Autant de fois que nécessaire. Chaque passage compare à la même
intention déclarée ; si l'intention change, le changement se déclare, et la nouvelle référence est écrite
avant le passage suivant.

## Ce qui la porte déjà

Trois des six temps ont leur pièce aujourd'hui : la **situation** est le terrain d'un cas, un projet où AIDD
est installé (`aidd_docs/` à sa racine) ; la **comparaison** est le verdict de `fin` ; le **rapport** est
`RESULTAT.md`, la page de décision de l'[ADR-061](DECISIONS.md), écrite dans le vocabulaire de la personne.
L'état frais s'obtient par le gel et le clone, et un terrain « ramené à l'état gelé » est déjà pratiqué à
chaque re-gel. L'installation d'AIDD dans un projet et la remise à zéro entre deux passages ont désormais leur place : le cas
déclare l'installation, le gel la mesure et la porte la relit ([ADR-112](DECISIONS.md)) ; la remise à zéro
est un geste documenté que la même porte garde ([ADR-113](DECISIONS.md)).

## La dérive qu'elle interdit

La référence est l'intention déclarée **avant** le run, jamais la forme des pièces que le run laisse. La
dérive guettée a été constatée le 2026-11-10 : un run guidé a rendu « forme tenue » parce que le produit
portait les renvois et les chemins attendus, alors que le skill n'avait pas fait ce qu'il déclare ; la
comparaison avait changé d'objet sans que rien ne le dise. Vérifier une forme n'est pas tester un skill, et
le nombre de contrôles du harnais ne mesure aucun skill. Une seconde dérive guette la fin de la boucle : un
rapport qui décrit des pièces au lieu de dire à l'utilisateur ce que le skill fait et ce qu'il peut en
décider.

## Pour qui

- **Celui qui ajoute ou modifie un skill** : il déclare l'intention, installe AIDD dans un projet, fait
  tourner le skill, lit le rapport, décide, modifie, et recommence.
- **Celui qui relit la pull request** : il tranche sans cloner le dispositif, et a le droit de ne
  pas y croire. Ce sont les deux seuls utilisateurs (v6 §3).

## Ce que ce dépôt est

- Le dispositif versionné dans son propre dépôt git ;
- un terrain de consignation exemplaire : tout est tracé, noté, fondé et daté — la gestion
  documentaire ici pratique ce que le dispositif mesure ailleurs ;
- un seul foyer documentaire : `docs/`, dont la carte est [INDEX](INDEX.md) ; aucune page n'est le
  second foyer d'une autre.

## Les trois phases

| Phase | Contenu |
| --- | --- |
| 1 la gestion documentaire | la gestion comme terrain de consignation : la fondation, l'unité de travail, la clôture, le remote |
| 2 le dispositif | les artefacts du v6 §10, les cas gelés, les runs rejouables, le protocole de test d'un skill, le rapport à l'utilisateur et la boucle qui se rejoue |
| 3 l'amélioration continue | la mesure des dérives de sa propre consignation, et les arbitrages |

Aucune phase ne porte son avancement ici : ce qui reste ouvert est au [DASHBOARD](DASHBOARD.md), et ce
qui est vrai aujourd'hui à l'[ARCHITECTURE](ARCHITECTURE.md).

## Ce que le dispositif n'est **PAS** (non-objectifs)

- ❌ Pas une refonte du framework : il l'appelle comme objet sous test et n'exige aucune
  modification de lui (v6 §5).
- ❌ Pas un lecteur de pensées : il ne juge jamais le raisonnement caché, seulement les **traces
  vérifiables** qu'il laisse — une question, une décision motivée, une source citée, une commande, un
  fichier écrit ([ADR-073](DECISIONS.md)).
- ❌ Pas un harnais de régression classique : il rejoue un départ, jamais une réponse (v6 §8).
- ❌ Pas un vérificateur de formulaires : un produit qui respecte les formes d'un journal, d'un reçu ou
  d'un gabarit ne prouve pas que le skill a fait ce qu'il déclare ; seul l'écart au produit de l'intention
  compte ([ADR-111](DECISIONS.md)).
- ❌ Pas un dispositif qui se mesure lui-même : un `conforme` de banc atteste que le harnais accepte, jamais
  qu'un run mériterait son verdict.
- ❌ Pas un rapport de machine : le rapport s'adresse à l'utilisateur qui va modifier le skill ; un journal
  de pièces ne le remplace pas.
- ❌ Pas un runner garanti : précondition constatée, jamais supposée (v6 §7).
