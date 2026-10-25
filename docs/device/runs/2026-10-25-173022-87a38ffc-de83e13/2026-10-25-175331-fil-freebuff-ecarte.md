---
name: Note — le fil Freebuff écarté, et le run arrêté sur la limite du fournisseur
description: "le fil Freebuff e4fa2118 n'a jamais reçu le texte du cas, a produit hors du terrain et sur les skills de compte ; le harnais le refuse, et la session opencode du même run s'est arrêtée sur un 429 avant tout texte d'assistant"
type: run-note
status: done
---

# Note — le fil Freebuff écarté, et le run arrêté sur la limite du fournisseur

> Note dont le nom porte **17:53:31** (`date +%Y-%m-%d-%H%M%S`) et dont la naissance mesurée est
> **17:53:49** (`stat -c %w`) : l'écart de 18 s sépare la mesure du nom de l'écriture, et il se nomme
> plutôt que de se corriger. Elle ne remplace ni un reçu ni un verdict : elle dit pourquoi ce run n'en aura
> pas, et ce que chacune des deux tentatives a produit.

## Le fait

La porte est passée le 2026-10-25 à 17:30:23 (`gate.json`, `passe_le`), sur le gel `87a38ffc…` : `terrain`
à `62c48e1`, `porcelain` vide, texte substitué `53deb433…` (689 octets).

Deux sessions ont suivi dans ce même run, et aucune n'a produit le fichier du cas là où l'attendu le nomme.

**La tentative Freebuff**, fil `e4fa2118-403c-4995-9fad-179c1eed9c6b`, base
`~/.config/freebuff-desktop/projects/15220bb0-81f0-4a2d-8772-bc74d2e78582-6fc329c2-607d-4baa-8aab-b99bf679b06f/desktop-v2.db`,
créée le 2026-10-25 à 17:32:33 (`threads.created_at`), modèle `m-ddc687c50f`, `harness_id` `codebuff`,
`execution_mode` `local`, sans branche ni worktree, quatre messages.

- Son `project_path` est `/home/giak/.config/freebuff-desktop/local-projects/15220bb0-81f0-4a2d-8772-bc74d2e78582`,
  un espace de projet local de l'application, pas le terrain du cas.
- Le texte du §5 n'y a jamais été collé : la première part `text` du fil (`seq 1`) fait 95 caractères et
  porte « Yes, that matches. Write the notes file at aidd_docs/NOTES.md, one line per rule. Nothing else. ».
  La table que cette phrase confirme n'existe pas dans la trace du fil, et rien dans les pièces ne dit
  comment la session a commencé par une confirmation : `UNKNOWN`.
- Faute de playbook, la session a pris les quatre skills de compte de son prompt système pour « les
  règles » : le produit est `…/local-projects/15220bb0-…/threads/acd6fc04f361df7ac50c02241cfaa2b1b65a9e560d2ac3d9bdb342fbbb307c9e/aidd_docs/NOTES.md`,
  38 lignes, 4576 octets, `sha256` `91c5e34c7dd5b8c6…`, commençant par
  « mnemolite-mem-first: MnemoLite is canonical memory; MEMORY != EVIDENCE ». La part `changes` du fil
  porte `added`, 39 lignes ajoutées.
- `terrain` n'a pas bougé : `git status --porcelain` vide, `HEAD` `62c48e1`.

**La tentative opencode**, session `ses_e8c0896b9ffelL8Pg7s1kOZbcW`, modèle
`opencode/deepseek-v4.1-flash-free`, ouverte le 2026-10-25 à 17:49:16, a reçu le texte du cas
(`trace/echange.jsonl`, 1 ligne, 821 octets) puis s'est arrêtée sur une erreur de fournisseur :
`etat_terminal.outcome` `failed`, `provider.free-limit`, statut `429`, `seq 3`, à 17:49:18 pour une fin
mesurée à 17:49:43 (`faits.json`). Aucun texte d'assistant n'a été écrit.

## Le refus

Le fil Freebuff ne se trace pas. Le refus est celui de la fonction que `faits` appelle, rendu par
`sessionFreebuff(fil, { base, cwd: terrain })` :

```text
REFUS — le fil ouvre /home/giak/.config/freebuff-desktop/local-projects/15220bb0-81f0-4a2d-8772-bc74d2e78582,
le gel nomme « travail » /home/giak/projects/aidd-device-work/2026-10-18-085308-cas-jouet/terrain — des faits
d'un run ouvert ailleurs nommeraient un produit que le gel ne couvre pas
```

Le run opencode, lui, ne se clôt pas : `suite --reprendre` s'arrête sur sa propre trace, et rend

```text
REFUS — suite : la trace exportée ne porte aucun texte d'assistant — sans dernier message, fin refuserait de
toute façon, et rien ne s'invente
```

(`exit 1`). Sans `raw/<cas>/last-message.md`, que seule l'étape 3 de `suite` écrit, `fin` n'a pas de pièce à
lire : ce run ne peut pas recevoir de reçu. L'index le porte « avorté, sans reçu », à côté des autres.

## Ce que ça dit du dispositif

- Le premier geste humain du protocole est de loin le plus fragile : deux tentatives, deux façons de le
  manquer, et dans les deux cas le harnais a nommé ce qui manquait avant d'écrire quoi que ce soit.
- Le refus de `sessionFreebuff` protège la mesure : un produit écrit hors du terrain gelé aurait fait lire
  un `aidd_docs/NOTES.md` que le cas ne couvre pas, et la paire avant/après du §5.2 ne l'aurait pas vu.
- Le refus de `suite` sur une trace sans texte d'assistant laisse un angle mort réel : une session morte
  sur une erreur de fournisseur, avant toute réponse, ne peut produire ni reçu ni verdict. Le cas est
  prévu par les contrôles 324 à 326 pour une session qui rend un dernier message avant de s'arrêter ; il ne
  l'est pas pour une session qui meurt sans rien écrire. C'est une limite du harnais, constatée ici sur
  pièces, pas une hypothèse.

## Ce qui n'est pas fait

- Aucun reçu, aucun verdict, aucune page de décision pour ce run.
- Le `NOTES.md` du fil est laissé où il est : il vit dans l'espace de l'application, hors de tout arbre du
  cas, et l'effacer n'appartient pas au dispositif.
- Le fil Freebuff est nommé « tentative écartée » ici seulement ; il n'est inscrit dans aucune pièce du
  harnais, qui ne connaît que des runs et leurs traces.
- Aucun correctif du harnais n'est proposé dans cette note : la limite est dite, la décision ne m'appartient
  pas.

## La suite

Ouvrir un projet Freebuff **sur** `/home/giak/projects/aidd-device-work/2026-10-18-085308-cas-jouet/terrain`,
y ouvrir un fil, y coller `texte-a-remettre.txt` tel quel, puis repasser une porte neuve : celle du 17:30 a
déjà servi deux sessions, dont aucune recevable. L'application sait ouvrir un terrain de cas comme projet,
`select root_path from projects` rend déjà
`/home/giak/projects/aidd-device-work/2026-10-15-133423-promesse-memoire-avant-ecriture/terrain` dans la base
`terrain-38d8d3f1-…` ; aucune base ne porte aujourd'hui le terrain de `cas-jouet`.
