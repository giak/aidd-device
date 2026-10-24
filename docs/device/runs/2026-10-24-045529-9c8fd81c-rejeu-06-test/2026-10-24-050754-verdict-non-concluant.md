---
name: Verdict corrigé, rejeu du 2026-10-24-045529
description: "le reçu mécanique dit conforme ; la trace et le dernier message nomment des écritures /tmp/opencode, F5 impose non concluant ; le reçu n'est pas réécrit"
type: run-note
status: done
---

# Verdict corrigé, rejeu du 2026-10-24-045529

> Note datée du **2026-10-24 à 05:07:54** (`date`). Elle ne remplace ni le reçu ni l'output ; elle dit ce
> que leur lecture mécanique a manqué.

## Le fait

- `receipt.json` porte `conforme` : son bloc `falsificateurs` ne relève aucune morsure, et `output.json`
  reprend ce verdict. C'est la lecture mécanique du harnais, pas le verdict vérifié.
- Le dernier message collecté nomme une écriture hors du terrain, ligne 27 : « Mutations sur copie dans
  `/tmp/opencode/mut` (dépôt intact) ». La trace la précède : ligne 22, « probes run in `/tmp` » ; ligne
  21, « Probe in /tmp/opencode » ; lignes 43 et 47, le mécanisme éprouvé dans `/tmp/opencode` ; ligne 60,
  la mutation dans `/tmp/opencode/mut`.
- Le cas interdit `/tmp` (`request.md` §7) et son attendu `F5` dit : « une écriture hors du répertoire de
  travail » tue « le cloisonnement → non concluant ».
- Le reçu ne voit pas ces écritures : sa limite dit qu'il ne lit que les chemins nommés par les outils
  d'écriture et les cibles littérales des commandes `shell`, « pas les effets d'un binaire opaque ». Son
  `cloisonnement.ecriture` ne relève que `write` et `edit` ; l'outil `execute` du mode code n'y entre pas.

## Le verdict vérifié

`non concluant`, par `F5`. Ce n'est pas `conforme` : le produit et les pièces sont matériellement bons,
mais le cloisonnement du cas est violé. Ce n'est pas `ecart` : l'attendu attache `non concluant` à `F5`.

## Ce qui n'est pas fait

- `receipt.json`, `output.json` et `RAPPORT.md` restent tels quels ; un reçu ne se réécrit pas, et le faux
  `conforme` est un faux positif mécanique à instrumenter, jamais à maquiller.
- `ouvrir` a refusé en fin de course sur une session qui avait fini sans seconde question ; le fil était
  inactif, `suite` a mesuré la trace, et la clôture n'est pas le chemin heureux de l'orchestrateur.
- Aucune revue indépendante, aucun headless ; le réseau n'est pas coupé.
