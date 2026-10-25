---
name: Note — le fil s'est ouvert hors du terrain, le reçu refuse
description: "le fil Freebuff du 2026-10-25 17:21 a reçu le texte de la porte, mais son dossier est un projet local vide : faits refuse, aucun reçu n'est possible, et rien du skill n'a été mesuré"
type: run-note
status: done
---

# Note — le fil s'est ouvert hors du terrain, le reçu refuse

> Note datée du **2026-10-25 à 17:27:36** (`date`). Elle ne remplace ni un reçu ni un verdict : elle dit
> pourquoi ce run n'en aura pas, et ce que la session a produit ailleurs.

## Le fait

- La porte du run est passée le 2026-10-25 à 10:23:20 sur `terrain` (`62c48e1`, porcelain vide), avec le
  texte `2e224aa0…` (343 octets) et le gel `27fb38ab…`.
- Le fil Freebuff `0d054e1d-0829-45d9-9db1-b06598bec626` (« Apply Playbook To Repository ») a été créé le
  2026-10-25 à 17:21:58, et son `project_path` est
  `/home/giak/.config/freebuff-desktop/local-projects/f31e5171-b909-4ae2-97f8-d07c50f5a44f` : un projet
  local vide, pas le terrain du cas.
- Le texte remis est bien celui de la porte : la première part `text` du fil a le `sha256`
  `2e224aa0b90605d5f5d36f6a7879e306faab119c6b796b2b5941d578c9c98d7a`, 343 octets, identique à
  `gate.json`.
- La session a lu `framework-origin/` **et** `origine/framework/`, `origine/terrain/` (les quatre dépôts),
  posé un formulaire « Note location » dont l'option marquée Recommandé était « Case root », reçu la
  réponse figée, puis écrit `<cas>/aidd_docs/NOTES.md` : 3 lignes, 198 octets, `sha256`
  `a83d98eb6d78122c52b5571c23ca8e81b93b4d7e58f24f56bcf63e328fdffb21`, né le 17:24:20.
- Ce fichier est à la racine du cas, pas sous `terrain/aidd_docs/` : le produit du cas n'existe pas là où
  l'attendu le nomme.

## Le refus

```text
▸ REFUS — faits : le fil ouvre /home/giak/.config/freebuff-desktop/local-projects/f31e5171-…, le gel nomme
« travail » /home/giak/projects/aidd-device-work/2026-10-18-085308-cas-jouet/terrain — des faits d'un run
ouvert ailleurs nommeraient un produit que le gel ne couvre pas
```

`exit 1`, à la première étape de `suite` : `faits.json` n'est pas écrit. La trace, elle, l'est déjà :
`trace/echange.jsonl` (33 895 octets) a été exportée avant le refus, que le commentaire d'`orchestrer.mjs`
annonce pourtant sans écriture (« un refus laisse le dossier du run exactement comme il était »).
Conséquence immédiate : une `suite` neuve sur ce dossier refusera sur cette trace orpheline, et
`--reprendre` n'a pas de `faits.json` où reprendre. La porte est dépensée.

## Ce que ça veut dire

C'est le premier geste humain qui a manqué : le protocole demande d'ouvrir le fil **au répertoire que
`porte` imprime**. Ouvert sur un projet local vide, le fil a lu « this repository » comme la racine du cas,
et la réponse figée `aidd_docs/NOTES.md` s'est résolue contre cette racine. Le cas lui-même ne nomme pas
son terrain : il ne tient que si la session part de `terrain/`.

Rien du skill sous test n'est mesuré : ni l'ordre, ni la pause, ni le produit. Les deux lectures de
`origine/` et l'écriture hors du terrain restent des gestes d'une session **non recevable**, pas des
morsures du reçu : `fin` n'a aucun fait à lire.

## Ce qui n'est pas fait

- Aucun reçu, aucun verdict, aucune page de décision : ce run reste « avorté, sans reçu » à l'index.
- Le fichier `<cas>/aidd_docs/NOTES.md` est laissé en place : il est hors de tout dépôt, et l'effacer
  n'appartient pas au dispositif.
- Aucune mesure de durée ajoutée : le cas garde ses deux reçus du 2026-10-22 (`004410`, `non concluant` ; `070952`, `ecart`), tous deux rendus non re-jugeables par le re-gel du 2026-10-25 17:30 — le prix dit d'un re-gel (ADR-032).

## La suite

Ouvrir un projet Freebuff (ou une session) **dans** `/home/giak/projects/aidd-device-work/2026-10-18-085308-cas-jouet/terrain`,
y coller `texte-a-remettre.txt` tel quel, jouer la réponse figée, puis `suite --client freebuff --conduite
humain --par <qui>` et `fin` jusqu'au reçu. Une porte neuve est préférable : celle du 10:23 a déjà servi
deux ouvertures, dont aucune recevable.
