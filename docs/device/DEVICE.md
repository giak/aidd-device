---
name: DEVICE — le dispositif
description: Ce qu'il fait et ne fait pas, qui fait quoi, ce qui part et ce qui revient, comment le récupérer et le lancer
type: device
status: in-progress
---

# DEVICE — le dispositif

> V0.1 — 2026-10-15, d'après le [MEGA-PROMPT v6](../brainstorm/MEGA-PROMPT-TEST-AIDD-v6.md) §7
> (amendé), §10, §11 et la [spec du run](../tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-130103-spec.md).

**En une phrase.** Il fait exécuter une modification du framework par une session ouverte par
l'opérateur, et nomme l'écart entre ce qu'elle annonce et ce qu'elle produit — en gardant de quoi
refaire le départ, jamais la réponse.

**Comment c'est câblé** : acteurs, trajets des fichiers, six commandes et plafond du verdict sont au
détail sur [ARCHITECTURE.md](../ARCHITECTURE.md).

## Ce qu'il fait

- Il gèle les attendus **avant** tout run : `CASES/` haché, empreinte enregistrée.
- Il remet à la session une demande écrite verbatim, et rien de plus : l'attendu ne part jamais.
- Il conserve le produit tel quel, et seulement s'il vient de l'espace de travail gelé (ADR-020) —
  copie verbatim, manifeste `sha256`/taille/`birth`.
- Il rend un écart nommé et une phrase de verdict qui compare, sans attribuer de faute (v6 §8).
- Il emporte la trace machine du run, sans laquelle « le run a eu lieu » n'est qu'une parole : la base
  du fil pour Freebuff, l'export du CLI pour opencode, normalisé en JSONL par la même frontière
  (`harness/clients.mjs`, ADR-043).

## Ce qu'il ne fait pas

- Pas une refonte : il lit le framework, ne le modifie pas ([BOUNDARY.md](BOUNDARY.md)).
- Pas un harnais de régression : il rejoue un **départ**, jamais une réponse.
- Pas un runner automatique : le runner, c'est la session que l'opérateur ouvre (v6 §7).
- Pas un juge : il ne sait pas si l'attendu était juste, et il le dit (v6 §8).

## Qui fait quoi

| Rôle | Qui le tiendra | Fait | Ne voit pas |
| --- | --- | --- | --- |
| auteur de l'attendu | le relecteur | écrit `CASES/`, gèle l'empreinte | le produit |
| opérateur | le relecteur | ouvre la session, remet la demande, recueille, exporte la trace | — |
| juge | l'agent | compare depuis le reçu, écrit le verdict | la session |

Séparation **de contexte, pas de personne** (question 4 du §11) : auteur et
opérateur seront la même personne, le juge ne verra pas la session — aucune position ne verra
l'objet qui la contredit le plus.

## L'état

- **Existent** : cette page, `BOUNDARY.md`, la spec du run, le harnais (`harness/run.mjs`), son banc
  (`harness/banc-harnais.sh`, 253 contrôles, [BANC.md](BANC.md)), l'orchestrateur interactif
  ([ORCHESTRATEUR.md](ORCHESTRATEUR.md) et `harness/orchestrer.mjs`, sept commandes, ADR-038 à 042 et
  ADR-059, et
  `harness/rapport.mjs` pour la commande `rapport`, ADR-050) et quatre cas gelés (`CASES/` : la promesse
  mémoire, le cas jouet, `plan-simple` et `spike-annees`).
- **Manquent** : le compte-rendu `ECART.md`.
- **Deux clients** : Freebuff (base `desktop-v2.db`, lu en `-readonly`, `sqlite3` requis) et opencode
  (session exportée par `opencode session export`, `opencode` requis ; son store est lu, jamais écrit).
  Le client est un fait du run (`session.outil`, `trace.client`), pas un paramètre du cas (ADR-044).
- **État B** (v6 §7) : rendu une fois, le 2026-10-15 — `non concluant`, aucun produit
  ([PV](runs/2026-10-15-171559-4c39e5c5-1d471a5/PV.md)).

## Ce qui part

`CASES/<cas>.request.md`, huit champs : identifiant ; révision du framework sous test et commande
d'installation en répertoire jetable ; révision du terrain et commande de copie de travail ; chemin
du répertoire de travail, hors des quatre arbres, situé par la racine déclarée au gel (`$RACINE/<cas>/`, ADR-019) ; **le texte remis à la session, verbatim,
entre deux lignes de garde** ; ce qu'elle doit produire, chemin et nom exacts ; les interdits
(écrire dans `framework-origin`, écrire dans le terrain, lire `CASES/`, sortir du répertoire de
travail) ; le budget d'échanges. L'attendu reste ici : relayé, il se lit dans le reçu
(`attendu_vu: oui`).

## Ce qui revient

Sous `runs/<horodatage>-<révision du framework>-<révision du dispositif>/` (des tirets, [ADR-023](../DECISIONS.md)) :
`raw/<cas>/` et son manifeste,
`gate.json` (la porte, ADR-034), `last-message.md`, `trace/`, `receipt.json`, `output.json`, l'écart écrit par `compare` (le juge),
jamais par l'opérateur (`run.mjs` : `join(runDir, "output.json")`), `RAPPORT.md`, la vue
déterministe du reçu, de l'output et de la trace ([ADR-050](../DECISIONS.md)), et `RESULTAT.md`, la page
lue par la personne : ce qui était attendu, ce qui a été observé, ce qu'elle peut décider ([ADR-061](../DECISIONS.md)). Le reçu porte
`cloisonnement` : les racines de lecture et d'écriture que l'attendu du cas déclare, résolues, plus
`reseau` et `fichiers_de_contexte` ; `falsificateurs.lecture_hors_dossier` nomme toute lecture hors des
racines de lecture ([ADR-052](../DECISIONS.md)), et un attendu sans bloc est refusé (ADR-049 pour la
mesure, ADR-052 pour le cadre lu). Rien d'autre. La forme d'`output.json`
et la phrase de verdict sont au §4 d'[ARCHITECTURE.md](../ARCHITECTURE.md).

## Récupérer et lancer

```text
git clone https://github.com/giak/aidd-device.git
git -C aidd-device rev-parse --short HEAD   → 64901e3   (branche main, relevé du 2026-10-16)
```

Ce chiffre est un relevé, jamais une constante : il se relève au moment où on le cite.

D'une autre machine : oui — les quatre arbres du cas sont publiés (§3 de [BOUNDARY.md](BOUNDARY.md)), le
gel se rejoue ([REPLAY.md](REPLAY.md)), et le cas ne nomme plus aucun chemin de machine : la racine se
redéclare (ADR-019).

Le harnais : `docs/device/harness/run.mjs`. Pas de commande unique de lancement, et la dire unique
serait mentir. Son banc, qui éprouve l'harnais sans ouvrir de session :
`bash docs/device/harness/banc-harnais.sh` → `236/236 PASS` ([BANC.md](BANC.md)). La séquence d'un run :

1. relever les deux `git status --porcelain` ([BOUNDARY.md](BOUNDARY.md)) ;
2. écrire la demande, puis `freeze --racine <racine>` — l'empreinte de `CASES/`, la racine des espaces
de travail déclarée une seule fois, et l'état des arbres avant ;
3. `preflight --run <dossier>` — la porte : elle refuse d'autoriser l'ouverture si le dossier n'est pas
   l'espace de travail que le gel nomme `travail`, encore dans l'état gelé (ADR-018), puis elle écrit
   `<dossier>/gate.json`, ce qu'elle vient de mesurer (ADR-034) ; le reçu refuse un run sans cette trace ;
4. l'opérateur ouvre une session neuve et lui remet le texte verbatim — geste humain, sans commande ;
5. `collect`, l'export par le client, `faits` (les faits que le reçu lira, dérivés du fil ou de la
   session, et du gel), puis `receipt` —
   produit verbatim, manifeste, reçu écrit à chaud ; le reçu re-hache la copie, relit la base, y rejoue
   l'export du §1.5 et y compte les échanges du fil contre le budget du cas (ADR-030, ADR-031, ADR-032,
   ADR-033) ;
6. `compare` — l'écart et la phrase de verdict, depuis le reçu seul.

Ces six étapes à la main ont désormais un enchaînement : `node docs/device/harness/orchestrer.mjs`
(`cas`, `porte`, `suite`, `fin`, `lire`) les appelle dans l'ordre, imprime quatre blocs de narration, et
laisse à la personne les trois gestes humains ([ORCHESTRATEUR.md](ORCHESTRATEUR.md)).

## Les noms du v6, et leur foyer

Le contrat range tout sous `docs/` (ADR-002) et les noms du v6 §10 sont conservés : la correspondance
des huit noms est au tableau de l'[ADR-013](../DECISIONS.md), et `ECART.md` seul se rend chez le
framework, `aidd_docs/tasks/<année_mois>/<date_slug>/`. Ces noms sont prescrits, jamais préfixés
d'une date : des singletons du v6.
