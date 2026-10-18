---
name: Répétition à blanc — la clôture du second run
description: La chaîne de clôture (export, faits, collect, last-message, receipt, compare) suivie sur une copie jetable avec un fil factice jusqu'à un reçu et une sortie non nuls — verdict conforme, zéro limite — et les trois trouvailles de bords qu'elle a faites
type: repetition
status: done
---

# Répétition à blanc — la clôture du second run

> 2026-10-18, né à **08:38:09** (`stat -c %w`) ; le nom porte la minute mesurée avant l'écriture
> (`083743`), et l'écart de **26 secondes** reste nommé, jamais lissé. Elle répète la **clôture** décrite par la
> [liste de contrôle](2026-10-17-095643-liste-de-controle-ouverture-second-run.md) §4.5 à §4.7 et la
> [conduite](2026-10-15-154303-run.md) §1.5–§3, sur une copie jetable, avec un fil factice, **jusqu'à un
> `receipt.json` et un `output.json` non nuls**. La précédente répétition
> ([2026-10-17-100609](2026-10-17-100609-repetition-a-blanc-de-l-ouverture.md)) s'arrêtait à l'ouverture ;
> celle-ci va au reçu et au jugement, avec le harnais de H5 et de H6, que la précédente n'avait pas.

## 1. Le banc

`/tmp/repetition-cloture-2026-10-18-v3`, construit par un script jetable, sans écrire ailleurs :

1. un **clone** du dépôt (`df59482`, état commité) — le harnais de la répétition est celui qu'un tiers a ;
2. les deux copies du cas clonées depuis l'espace de travail réel, détachées à `416ec1f` et `4c39e5c5` ;
3. un **re-gel** dans le bac : `freeze --refreeze --racine /tmp/repetition-cloture-2026-10-18-v3`, empreinte
   **`0d9a2180`** — la même que le cas réel, sur une autre racine, une autre machine de temps : le cas
   voyage toujours (ADR-019) ;
4. la **porte**, passée avec `--texte` : le §5 substitué, **255 octets** (la longueur dépend de la racine) ;
5. un **fil factice** dans une base de client fabriquée (schéma `threads`/`messages` du banc) : message 1
   `user` (le texte remis), message 2 `assistant` portant un tableau de quatre lignes à séparatrice,
   message 3 `assistant` portant un `tool` `write_file` vers `aidd_docs/README.md` ;
6. un **produit** écrit dans la copie de travail, comme une session l'aurait fait : les sept chemins de la
   table `Write to`, moins `backlog.md`.

## 2. La chaîne, et ce qu'elle a rendu

| Geste | Résultat |
| --- | --- |
| `freeze --refreeze` | `freeze ok … empreinte 0d9a2180`, `exit 0` |
| `preflight --run … --repertoire … --texte …` | `preflight ok … (HEAD 416ec1f, porcelain 0 ligne(s)) ; gel 0d9a2180 re-haché, 2 fichier(s) du cas et 8 référence(s)`, `exit 0` ; `gate.json` écrit |
| la trace, par la commande que `faits` écrit (§1.5) | `exit 0`, **3 lignes** ; `trace_lue` : 3 lignes, **3 échanges dans la fenêtre**, 0 illisible, `sha256` cité, rejoué au reçu |
| `faits` | `exit 0` — seize valeurs dérivées du fil et du gel |
| `collect --from …/terrain/aidd_docs` | `exit 0`, **7 fichiers** sous `raw/<cas>/`, source nommée sous l'arbre `travail`, manifeste et empreinte de la copie au reçu |
| `last-message.md`, à la main | écrit sous `raw/<cas>/`, sa `sha256` au reçu |
| `receipt --verdict conforme` | **`receipt ok — verdict conforme ; produit 7 fichier(s) ; 0 limite(s)`**, `exit 0` |
| `compare --verdict conforme` | **`compare ok — verdict conforme, limites « ne mord pas »`**, `exit 0` |

Les deux pièces, non nulles : `receipt.json` **13 037 octets, 25 clés** ; `output.json` **3 393 octets, 11
clés**. Les sept falsificateurs sont **muets** (`arbre_de_travail_inchange: false`, donc la condition 3 est
satisfaite ; `tableau_absent: false`, `seq 2`, 4 lignes, 3 colonnes ; `ecriture_avant_tableau` et
`produit_ne_avant_le_tableau` vides — les mécanismes de H6 lisent un vrai fil), et `echanges` vaut
`{budget: 3, utilises: 1, epuise_par: null}`.

**Les arbres réels n'ont pas bougé** : le dépôt du dispositif porte les neuf lignes de l'arbre de travail de
la Séance 56, `framework` et `audio-sync-tool` leurs deux lignes connues, et le travail de la répétition vit
entier sous `/tmp`.

## 3. Les trois trouvailles

1. **Un `birth` à la seconde du gel n'est pas distinguable.** Première passe (`…-2026-10-18`) : le re-gel et
   le produit naissaient dans la même seconde, et le reçu l'a dit — une **limite** nommée,
   « naissance à une seconde du gel (résolution du birth) : … la condition 1 du §5 ne les distingue pas »,
   verdict `conforme` avec 1 limite. Deux secondes d'écart (passe `v3`) et la limite disparaît. Au vrai run
   le gel précède la session de plusieurs minutes, donc le cas ne mord pas ; ce qui compte est que le reçu
   **le dit** au lieu de trancher.
2. **`preflight --texte` compare les octets.** Passe `v2` : le texte remis portait un saut de ligne final de
   trop — 256 octets reçus contre **255** attendus — et la porte a refusé : « `--texte` n'est pas le §5 du
   cas, `$RACINE` substitué ». L'opérateur écrit le texte substitué **sans** saut de ligne final ; la
   longueur attendue dépend de la racine déclarée, elle se relève au gel et ne se retient pas.
3. **La base du client doit porter des part `parts_json` en tableau.** Une première fabrication du fil y
   avait mis un objet JSON : l'export a échoué sur `Error: stepping, malformed JSON` (le `json_extract` de
   la requête s'applique aux éléments d'un tableau), puis le reçu a refusé le rejeu (H2) — refus juste, mais
   l'erreur de la base, elle, n'est pas nommée : c'est la commande d'export de l'opérateur qui la rend.

## 4. Ce que la répétition ne prouve pas

- **Rien du client** : aucun fil réel, aucune session ouverte, ni mode direct, ni racine de projet posée, ni
  texte stocké par le client. Le fil factice est dans une base fabriquée, passée à `faits` par `--base` ;
  la chaîne réelle, elle, **cherche** la base qui contient le fil sous `~/.config/freebuff-desktop/`, et
  cette recherche n'est pas éprouvée ici.
- **Rien du verdict** : `conforme` a été **écrit** par nous, et le produit a été écrit pour correspondre à
  l'attendu. La répétition prouve que la chaîne accepte un `conforme` propre de bout en bout, pas qu'un vrai
  run le mérite.
- **Rien du texte remis par une session** : le message 1 contient le texte substitué, mais c'est nous qui
  l'avons collé ; les étapes humaines (ouvrir le fil, coller, répondre) restent hors de portée.
- **Rien des quatre arbres réels** : le contrôle de clôture d'ADR-021 (0 → 0) se fait sur les arbres du
  run réel ; ici, rien n'a été mesuré après la clôture, faute d'un run.

## 5. Ce que la liste de contrôle gagnerait

Une ligne, à la clôture : **« le texte remis n'a pas de saut de ligne final, et sa longueur se relève au
gel »** — c'est le seul des trois bords qui puisse faire refuser la porte d'un vrai run pour une raison qui
ne se devine pas. Les deux autres sont des accidents de banc, conservés ici pour la mémoire.
