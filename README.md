# aidd-device

Le dispositif de test du framework AIDD : il fait exécuter une modification du framework par une
session ouverte par l'opérateur, et nomme l'écart entre ce qu'elle annonce et ce qu'elle produit.

## Entrées

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — **la vue d'ensemble** : les acteurs et ce que chacun ne
  voit jamais, les arbres et qui écrit où, les cinq commandes du harnais, la vie des artefacts, les
  falsificateurs et le plafond du verdict, en cinq schémas. C'est par ici qu'un nouveau lecteur commence.
- [AGENTS.md](AGENTS.md) — le contrat de travail, autonome : il vaut pour tout ce qui s'écrit ici.
- [docs/device/DEVICE.md](docs/device/DEVICE.md) — le dispositif en une page : ce qu'il fait, ce qu'il ne
  fait pas, ce qui part, ce qui revient, comment le récupérer et le lancer.
- [docs/device/BOUNDARY.md](docs/device/BOUNDARY.md) — la frontière : les quatre arbres, les chemins
  lus, et la preuve que le framework est intact et qu'aucun fichier du dispositif ne lui appartient.
- [docs/device/REPLAY.md](docs/device/REPLAY.md) — la recette qu'un inconnu suit pour rejouer le gel
  depuis un clone neuf : le bloc exact, la sortie observée, et les limites qu'elle ne franchit pas.
- [docs/EXPLICATION.md](docs/EXPLICATION.md) — le projet raconté simplement, pour qui n'en
  connaît rien : analogies, schémas, état réel au 2026-10-15, échecs compris.
- [docs/brainstorm/2026-10-15-201458-bilan-premier-run.md](docs/brainstorm/2026-10-15-201458-bilan-premier-run.md)
  — le bilan du premier run : ce qui a marché, les quatre causes du `non concluant`, les arbitrages à
  rendre et les brainstorm à conduire, avec schémas.
- [docs/trace.md](docs/trace.md) — le journal des séances, une entrée par séance.
- [docs/VISION.md](docs/VISION.md) · [docs/PFD.md](docs/PFD.md) · [docs/DECISIONS.md](docs/DECISIONS.md) ·
  [docs/DASHBOARD.md](docs/DASHBOARD.md) — la raison d'être, les phases, les décisions, l'état.

## État

Un run a eu lieu le 2026-10-15 (`17:16:12`–`17:29:51`, session `opencode`) et s'est conclu
**`non concluant`** : la session n'a rendu aucun tableau et n'a rien écrit. Le harnais est écrit
([docs/device/harness/run.mjs](docs/device/harness/run.mjs), 882 lignes, cinq commandes : `freeze`
— qui déclare une seule fois la racine des espaces de travail, dont dérivent les deux copies du cas —,
`preflight` — la porte qui refuse d'ouvrir une session ailleurs que dans l'espace de travail gelé, et
vérifie le texte remis —, `collect` — qui ne prend pour produit que ce que la session a écrit dans cet
espace, et dont `collect --sans-produit` pour un run qui ne rend rien —,
`receipt`, `compare`), le premier cas est **re-gelé** après le run, après le déplacement de l'espace de
travail, puis après le passage à la racine déclarée (empreinte `0d9a2180`,
[docs/device/CASES/](docs/device/CASES/)) et
la conduite du run est écrite
([2026-10-15-154303-run.md](docs/tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md)).
Le compte-rendu du run est dans
[docs/device/runs/2026-10-15-171559-4c39e5c5-1d471a5/PV.md](docs/device/runs/2026-10-15-171559-4c39e5c5-1d471a5/PV.md),
et l'état du projet, ses trous et l'ordre de reprise sont au
[bilan du premier run](docs/brainstorm/2026-10-15-201458-bilan-premier-run.md).
