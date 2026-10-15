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

## Ce qu'il fait

- Il gèle les attendus **avant** tout run : `CASES/` haché, empreinte enregistrée.
- Il remet à la session une demande écrite verbatim, et rien de plus : l'attendu ne part jamais.
- Il conserve le produit tel quel — copie verbatim, manifeste `sha256`/taille/`birth`.
- Il rend un écart nommé et une phrase de verdict qui compare, sans attribuer de faute (v6 §8).
- Il emporte la trace machine du run, sans laquelle « le run a eu lieu » n'est qu'une parole.

## Ce qu'il ne fait pas

- Pas une refonte : il lit le framework, ne le modifie pas ([BOUNDARY.md](BOUNDARY.md)).
- Pas un harnais de régression : il rejoue un **départ**, jamais une réponse.
- Pas un runner automatique : aucun runner sans interaction ne répond ici, donc pas de commande à
  brancher — le runner est la session que l'opérateur ouvre (v6 §7).
- Pas un juge : il ne sait pas si l'attendu était juste, et il le dit (v6 §8).

## Qui fait quoi

| Rôle | Qui le tiendra | Fait | Ne voit pas |
| --- | --- | --- | --- |
| auteur de l'attendu | le relecteur | écrit `CASES/`, gèle l'empreinte | le produit |
| opérateur | le relecteur | ouvre la session, remet la demande, recueille, exporte la trace | — |
| juge | l'agent | compare depuis le reçu, écrit le verdict | la session |

Aucun cas n'existe encore : ces rôles sont attribués, pas encore joués, et le reçu portera
`temoignage.qui`. Séparation **de contexte, pas de personne** (question 4 du §11) : auteur et
opérateur seront la même personne, le juge ne verra pas la session — aucune position ne verra
l'objet qui la contredit le plus.

## L'état

- **Existent** : cette page, `BOUNDARY.md`, la spec du run, l'emplacement des artefacts, le harnais
  (`harness/run.mjs`) et le premier cas gelé (`CASES/` : demande, attendu, gel).
- **Manquent** : l'export de trace — geste du run, pas du harnais — et le compte-rendu `ECART.md`.
- **État B** (v6 §7) : aucune session n'a reçu de demande ; il se rend avec la session demandée et
  la réponse obtenue — ou son absence.

## Ce qui part

`CASES/<cas>.request.md`, huit champs : identifiant ; révision du framework sous test et commande
d'installation en répertoire jetable ; révision du terrain et commande de copie de travail ; chemin
absolu du répertoire de travail, hors des quatre arbres ; **le texte remis à la session, verbatim,
entre deux lignes de garde** ; ce qu'elle doit produire, chemin et nom exacts ; les interdits
(écrire dans `framework-origin`, écrire dans le terrain, lire `CASES/`, sortir du répertoire de
travail) ; le budget d'échanges. L'attendu reste ici : s'il est relayé, le reçu porte
`attendu_vu: oui` et le cas se conclut `non concluant`.

## Ce qui revient

Sous `runs/<horodatage>-<framework@rev>-<dispositif@rev>/` : `raw/<cas>/` et son manifeste,
`last-message.md`, `trace/`, `receipt.json`. Rien d'autre.

## Récupérer et lancer

```text
git clone /home/giak/projects/aidd-device
git -C aidd-device rev-parse --short HEAD   → d02b750
```

D'une autre machine : impossible — aucun remote, donc la question 1 du §11 se répond « non » ;
« oui » par un remote ou par l'archive des sources jointe à la pull request.

Le harnais : `docs/device/harness/run.mjs`. Pas de commande unique de lancement, et la dire unique
serait mentir. La séquence d'un run :

1. relever les deux `git status --porcelain` ([BOUNDARY.md](BOUNDARY.md)) ;
2. écrire la demande, puis `freeze` — l'empreinte de `CASES/` et l'état des arbres avant ;
3. l'opérateur ouvre une session neuve et lui remet le texte verbatim — geste humain, sans commande ;
4. `collect` puis `receipt` — produit verbatim, manifeste, reçu écrit à chaud ;
5. `compare` — l'écart et la phrase de verdict, depuis le reçu seul.

## Lire un écart

`output.json` : un objet par cas — `{ cas, attendu, produit_brut, difference, verdict (conforme |
écart | non concluant), limites (mord | ne mord pas | non évaluable), ecarte_comme_non_testable }` —
plus une phrase de verdict par exécution : « au vu de l'attendu écrit, le produit fait X ; l'attendu
disait Y ». « La modification ne marche pas » n'est pas une réponse.

## Les noms du v6, et leur foyer

Le contrat range tout sous `docs/` (ADR-002) ; les noms du v6 §10 sont conservés, le foyer diffère :

| Noms du v6 §10 | Foyer |
| --- | --- |
| `DEVICE.md` (cette page), `BOUNDARY.md`, `CASES/`, `runs/`, `NEGATIVE.md`, `REFUSED.md`, `LIMITS.md`, `ATTEMPT.md` | `docs/device/` |
| `ECART.md` | chez le framework, `aidd_docs/tasks/<année_mois>/<date_slug>/` |

Nom prescrit, sans préfixe daté : le préfixe rend l'ordre alphabétique chronologique entre documents
d'une même nature ; ces pages sont des singletons nommés par le v6.
