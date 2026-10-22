---
name: Brainstorm — ARCHITECTURE.md, à jour et lisible
description: "Relecture datée de la page d'architecture : le frontmatter qui ne se lit pas, les chiffres qui ont vieilli depuis les Séances 105 à 110, et la réécriture en deux couches"
type: brainstorm
status: done
---

# Brainstorm — ARCHITECTURE.md, à jour et lisible

> 2026-10-22, Séance 111. Déclencheur : un outil refuse le frontmatter de la page
> (`mapping values are not allowed in this context`), et la page n'a pas suivi les Séances 105 à 110.

## 1. Ce que j'ai mesuré, pas ce que la page dit

- **Le frontmatter ne se lit pas.** `description` est un scalaire nu qui contient « : » ; `yaml.safe_load`
  rend `ScannerError`, ligne 3, colonne 53 (l'outil de l'opérateur compte la ligne 2, le `---` exclu).
  Vingt-cinq autres fichiers du dépôt portent la même forme.
- **§2 annonce « Cinq positions »** et la table en porte sept depuis l'[ADR-061](../DECISIONS.md).
- **§4 ne connaît que le harnais.** L'orchestrateur ([ORCHESTRATEUR](../device/ORCHESTRATEUR.md),
  `harness/orchestrer.mjs`, **1 295 lignes**, sept commandes, [ADR-059](../DECISIONS.md)) est absent, donc le
  cycle décrit n'est plus celui qu'une personne suit : `ouvrir`, `suite` et `fin` portent le run réel.
- **§5 ignore cinq pièces nées depuis** : `gate.json`, `faits.json`, `RAPPORT.md`, `RESULTAT.md`, et
  `CASES/<cas>.lecture.json`, la lecture hors gel. Il dit d'`ECART.md` « à écrire, pas ouvert à ce jour »,
  alors qu'il est écrit depuis le 2026-10-17 (Séance 28-31).
- **§6 dit « les 8 fichiers »** de la révision sous test ; le gel `0052c168` en porte **11**.
- **§7 dit « les neuf falsificateurs »** ; `receipt` en mesure **14**, et deux d'entre eux ne bloquent que
  `conforme` là où les autres forcent `non concluant` (ADR-051).
- **§3 fige l'instantané d'un cas** (`revision-sous-test` `4c39e5c5`) ; le gel courant porte `fe48de12`,
  et chaque cas a le sien.
- **Ce qui reste vrai, mesuré ce jour** : `run.mjs` 2 869 lignes, `rapport.mjs` 527, `resultat.mjs` 497,
  `clients.mjs` 405, `liens.mjs` 124, `orchestrer.mjs` 1 295, banc **236** contrôles, **4** gels,
  **19** runs, **14** reçus.

## 2. Ce que la page doit être

Une page d'architecture vaut ce qu'un lecteur peut vérifier sans elle. Trois formes possibles :

- **A. Rustiner** les chiffres faux en gardant la structure. Le moins cher, et la page continue de décrire
  une seule couche alors que deux existent.
- **B. Deux couches, tables complètes, falsificateurs mesurés.** Retenu.
- **C. Éclater en deux pages** (protocole, harnais). Écarté : ORCHESTRATEUR et BANC possèdent déjà ces
  contenus, une troisième page les recopierait et divergerait.

## 3. Décision

B, sous trois règles que la page s'applique déjà ailleurs :

1. chaque chiffre nomme sa pièce, ou n'est pas écrit ;
2. la page ne recopie aucun refus ([ADR-038](../DECISIONS.md)), elle renvoie au runbook ;
3. elle dit ce qu'elle possède et ce que possèdent les autres pages.

## 4. Ce qui change

- frontmatter cité, donc lisible par un outil ;
- en-tête en **V0.2**, rectifications datées en liste plutôt qu'en paragraphes empilés ;
- §2 : **sept** positions, et l'orchestrateur dit pour ce qu'il est, la main de l'opérateur ;
- §3 : l'instantané nomme le cas et sa date ; un gel par cas ;
- §4 : **deux couches** (sept commandes d'orchestration au-dessus des six du harnais), cycle mis à jour ;
- §5 : les cinq pièces manquantes, et `ECART.md` rendu à son état ;
- §6 : les références sont par cas, avec l'exemple courant ;
- §7 : les **14** falsificateurs mesurés, les deux plafonds, et les F* du cas comme couche séparée ;
- §8 : `run.mjs` n'ouvre aucune session, `ouvrir` en ouvre une par l'API locale ;
- §9 : ORCHESTRATEUR et les deux guides entrent à la table ;
- les quatre schémas re-rendus, libellés relus dans le SVG produit.

## 5. Ce que je ne fais pas

- corriger les vingt-cinq autres frontmatters : même défaut, autre portée, signalé au journal ;
- toucher au code, aux cas gelés, aux reçus : la page se relit, elle ne réécrit pas la preuve ;
- promettre que la page est complète : elle décrit ce qui est câblé, pas ce qui devrait l'être.

## 6. Comment je vérifie

`python3` + `yaml.safe_load` sur le frontmatter, `wc -l` sur les six modules, `grep -c` sur le banc,
`liens.mjs` (**0 mort** attendu), `mmdc` sur les quatre schémas et `grep` des libellés dans les SVG.
