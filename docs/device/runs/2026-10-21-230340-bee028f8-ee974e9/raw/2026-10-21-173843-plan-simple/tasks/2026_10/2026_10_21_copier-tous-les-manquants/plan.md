---
objective: "Sur la page Sync, un bouton « Copier tous les manquants » range en un geste, dans leurs dossiers de style calculés, tous les fichiers éparpillés absents de Source Data, après un aperçu qui nomme chaque dossier cible et chaque exclusion."
status: pending
---

<!-- Fill or omit these sections; never add, rename, or reorder one. -->

# Plan: Copier tous les manquants — page Sync

## Overview

| Field      | Value                                                                                                                                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Goal**   | Un bouton unique range d'un geste tous les fichiers éparpillés « manquants », chacun dans son dossier `<style>_<tranche>` calculé, après un aperçu qui nomme chaque dossier cible et chaque exclusion.           |
| **Source** | Texte de la demande (2026-10-21) : « un bouton "copier tous les manquants" à sa page Sync », cadré par le `README.md` du dépôt. Aucun ticket ni fichier de backlog nommé → aucun `backlog-link.json`. |

## Phases

| #   | Phase                                    | File                         |
| --- | ---------------------------------------- | ---------------------------- |
| 1   | Confinement du chemin de `POST /copy`    | [`phase-1.md`](./phase-1.md) |
| 2   | Le plan « manquants » — calcul pur       | [`phase-2.md`](./phase-2.md) |
| 3   | Bouton, aperçu et application du lot     | [`phase-3.md`](./phase-3.md) |
| 4   | Traçabilité EPIC-057 et documentation    | [`phase-4.md`](./phase-4.md) |

## Decisions

<!-- Architecture-magnitude only, one you'd regret reversing. Omit if none qualify. -->

| Decision                                                                                                                                                                                             | Why                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| La destination de chaque fichier est **calculée** : style de session `g` s'il existe, sinon la suggestion automatique déjà codée (`styleSuggest.ts`, seuil 0,25). | Le dépôt a déjà la mécanique (`destFor` dans `styles.ts`, `suggestStyle` dans `styleSuggest.ts`) et sa philosophie : « le style est la seule décision humaine, la tranche se déduit de l'année du tag, le dossier cible est calculé ». Un lot vers une seule destination ne rangerait rien musicalement. |
| Le lot réutilise `copyFilesTo` (une requête `POST /copy` par fichier) — **aucun** endpoint batch.                                          | `/copy` est déjà le contrat qui écrit le style du dossier cible, journalise la copie et met le cache à jour ; un endpoint batch dupliquerait cette grammaire (EPIC-043/050) pour un gain de performance marginal en local. Le coût est amorti par l'aperçu explicite. |
| `POST /copy` est confiné (`is_path_allowed` sur la source **et** la destination) **avant** la feature.                                       | DATA-SAFETY est une priorité absolue dans `AGENT.md`, et `/copy` est aujourd'hui la seule route d'écriture de fichier sans confinement, alors que `/move`, `/delete` et `/mkdir` en ont un. Le lot multiplie une écriture non confinée.                        |
| Bouton seul, **aucun raccourci clavier**.                                                                                              | La légende `?` est générée depuis les bindings labellisés et un test de bijection la verrouille ; ajouter une touche élargit la surface (légende + matrice clavier, 78 cellules) pour un usage qui a déjà son chemin (`g` puis `e`).            |
| Les exclusions sont **dites**, pas appliquées silencieusement : un fichier écarté du lot apparaît dans l'aperçu.                           | Règle de la modale de copie (EPIC-051/042) : « une information ne disparaît jamais sans bruit ». Un fichier qui ne part pas sans être nommé devient un fichier perdu.                                                      |

<!-- Pas de section Resources : aucune source externe n'a été consultée. Le plan se
fonde sur le dépôt lui-même (`README.md`, `AGENT.md`, `static/src/`, `app.py`).

Hypothèses retenues faute de retour interactif (2026-10-21) — à confirmer ou corriger avant l'exécution :

1. « Les manquants » = fichiers éparpillés au statut `nouveau` (absents de Source Data ET absents du journal des copies), en excluant ceux dont un homonyme probable est déjà rangé (la pastille « ⤷ déjà rangé ») — sinon le lot crée des doublons. Le compte est déjà affiché dans la barre d'état (`● N reste`).
2. La destination de chaque fichier est calculée par style (décision ci-dessus), et non le dossier surligné à droite.
3. Le confinement de `POST /copy` fait partie du plan, en phase 1.
-->
