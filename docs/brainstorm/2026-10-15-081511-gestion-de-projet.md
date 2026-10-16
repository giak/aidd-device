---
name: Gestion de projet (boucle 2)
description: L'unité de travail et sa vie — critère falsifiable avant le travail, un dossier par tâche, la frontière avec le journal, la clôture, le commit, le remote — en itération ouverte
type: spec
status: in-progress
---

# Gestion de projet

## Origine

Ouverte le 2026-10-15 par le relecteur, verbatim, mémoire `6bf9e005` : « commit, puis brainstorm la
boucle 2, écrit des specs ». Elle repose sur la fondation documentaire approuvée le même jour
([2026-10-15-080225-fondation-documentaire.md](2026-10-15-080225-fondation-documentaire.md)) et en
est la boucle 2 décidée d'avance (« la gestion de projet : la boucle suivante », arbitrage 2 de la
boucle 1). Le commit de la boucle 1 est fait à sa demande : `1bbb9d2`.

Elle répond à la maladie documentée de la nuit du 2026-10-14 (mémoires `74e784de`, `9ed80a52`) :
six dossiers de tâche ouverts en treize minutes sans critère ni clôture ; une divagation
d'ingénierie aux dépens du vrai travail ; des documents de travail jamais commités.

## Les bases

**P1. L'unité de travail est le critère, pas le sujet.** Une tâche s'ouvre avec un critère
d'acceptation falsifiable, écrit avant le travail : ce qui sera vérifié, par quelle commande ou
démonstration, et ce qui la fera fermer. Un thème, un souhait, une « idée à creuser » ne sont pas
une tâche : ils restent dans la section de séance jusqu'à ce qu'un critère en fasse une.

**P2. Une tâche est un dossier ; un dossier est un chantier suivi.** La tâche vit dans
`docs/tasks/<yyyy_mm>/<YYYY-MM-DD-HHMMSS>-<slug>/`, dossier nommé à l'heure mesurée de sa création
(`date`, pas une heure entrevue). Son `spec.md` porte le critère ; sa section « Décisions » nomme
son auteur. Un dossier ouvert sans critère est une dérive B6, nommée immédiatement.

**P3. La frontière avec le journal est l'objet, jamais le déroulé.** Le dossier de tâche porte ce
que la tâche **livre et prouve** : spec, plan, run, écart. Le journal de séance porte le comment
et le pourquoi de la séance (méthode, découvertes, arbitrages, dérives), et renvoie à la tâche par
son chemin. Un compte rendu de tâche ne raconte pas la séance ; une section de séance ne remplace
pas le run d'une tâche.

**P4. Une clôture est une vérification, pas une fatigue.** Le dossier se ferme quand son critère
est vérifié, la vérification citée dans son `run.md` (commande et sortie brute, y compris les
échecs). La clôture est nommée par une ligne de la section de séance du jour. Un dossier jamais
clos est une dette ouverte : il apparaît dans les « Prochaines étapes » tant qu'il n'est pas fermé.

**P5. Le commit de clôture est une condition de citabilité.** Aucune tâche n'est finie tant que
son incrément n'est pas commité ; du travail non commité est du travail invisible (L4). Proposition
posée pour arbitrage : le commit de clôture est autorisé en droit sous sauf du relecteur, cas par
cas — la demande explicite de cette séance (« commit, puis brainstorm ») ne vaut que pour elle.

**P6. Le remote est la seule puissance qui manque.** Aucune preuve n'est lisible par un lecteur
hors machine tant que ce dépôt n'a pas de remote ; c'est une action externe, jamais assumée par
l'agent. Proposition, à arbitrer : un remote git (public ou privé), créé par le relecteur, puis
déclaré dans `AGENTS.md` s'il en veut l'usage.

> **Réparé le 2026-10-16 (Séance 6, suite).** La première moitié de P6 est faite, et mesurée : le dépôt
> porte un remote public, `origin` = `https://github.com/giak/aidd-device.git`, et `main` y est poussée.
> Relevé du 2026-10-16 : `git ls-remote https://github.com/giak/aidd-device.git main` rend
> `d239b08b8b36852aad5ec36237b90ab837a593d3` **sans authentification**, ce qui est la preuve de la lecture
> hors machine que P6 demandait ; la première poussée date du 2026-10-15 (18 commits), les dernières sont
> `6789bec..8b52313`. Ce qui reste de P6 n'est donc plus un manque matériel mais un choix : la
> **déclaration** du remote dans `AGENTS.md`. Mesuré le même jour, `AGENTS.md` ne porte aucune occurrence
> de « remote » ni de « github » ; la seule adresse écrite vit dans [DEVICE](../device/DEVICE.md), dans un
> bloc de clonage.
>
> **P6 close le 2026-10-16 (Séance 13).** La déclaration est faite : `AGENTS.md` nomme `origin` et `main`
> (ligne 11, commit `0fd34d7`), et la journée est poussée (`d239b08..0fd34d7  main -> main`, `exit 0`). Le
> relevé de la Séance 10 qui comptait 0 occurrence de « remote » ou « github » dans ce fichier ne vaut plus :
> `grep -n 'github.com/giak/aidd-device' AGENTS.md` → ligne 11. P6 n'a plus de reste.

## Hors de portée de cette spec

- **Le protocole de test du framework** (MEGA-PROMPT v6) : le vrai travail, après que cette boucle
  2 a vécu. Les specs du dispositif ne s'écrivent pas ici ; la fondation s'applique d'abord.
- **Tout enforcement mécanique** (« pas de script », arbitrage 4 de la boucle 1) : un contrôle
  automatisé de ce que P1–P5 promettent naît d'une dérive répétée démontrée, jamais d'une envie de
  tout verrouiller le soir de l'écriture.
- **Le contenu du dispositif** (ce qu'il mesure, son architecture) : boucle suivante après
  l'approbation de celle-ci.

## Décisions, et de qui

- Du relecteur, 2026-10-15 : la boucle 2 est ouverte avec écriture immédiate des specs (mémoire
  `6bf9e005`) ; le commit de clôture de la boucle 1 est explicitement autorisé, ponctuel.
- De l'agent, réversibles à l'itération : P1–P6, le format du dossier, le hors-périmètre.
- À décider par le relecteur : le commit debout de P5, l'approbation de cette spec comme la boucle 2 du
  contrat. La **déclaration** du remote dans `AGENTS.md`, qui figurait ici, est **faite le 2026-10-16**
  (note datée sous P6).
