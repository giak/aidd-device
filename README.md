# aidd-device

Le dispositif de test du framework AIDD : il fait exécuter une modification du framework par une
session ouverte par l'opérateur, et nomme l'écart entre ce qu'elle annonce et ce qu'elle produit.

## Entrées

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — **la vue d'ensemble**, et c'est par ici qu'un nouveau
  lecteur commence : le dispositif fait exécuter une modification du **framework AIDD** (un framework de
  compétences markdown pour assistants IA, publié sur `github.com/giak/framework`) par une session IA, et
  nomme l'écart entre ce qu'elle annonce et ce qu'elle produit. Puis les acteurs et ce que chacun ne voit
  jamais, les arbres et qui écrit où, les six commandes du harnais, la vie des artefacts, les
  falsificateurs et le plafond du verdict, en cinq schémas. Le pourquoi du dépôt est à la
  [VISION](docs/VISION.md).
- [AGENTS.md](AGENTS.md) — le contrat de travail, autonome : il vaut pour tout ce qui s'écrit ici.
- [docs/device/DEVICE.md](docs/device/DEVICE.md) — le dispositif en une page : ce qu'il fait, ce qu'il ne
  fait pas, ce qui part, ce qui revient, comment le récupérer et le lancer.
- [docs/device/BOUNDARY.md](docs/device/BOUNDARY.md) — la frontière : les quatre arbres, les chemins
  lus, et la preuve que le framework est intact et qu'aucun fichier du dispositif ne lui appartient.
- [docs/device/REPLAY.md](docs/device/REPLAY.md) — la recette qu'un inconnu suit pour rejouer le gel
  depuis un clone neuf : le bloc exact, la sortie observée, et les limites qu'elle ne franchit pas.
- [docs/device/BANC.md](docs/device/BANC.md) — le banc du harnais : les 50 contrôles qui éprouvent ses
  refus et ses acceptations, comment les lancer, et ce qu'ils ne prouvent pas.
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
([docs/device/harness/run.mjs](docs/device/harness/run.mjs), 1 006 lignes, six commandes : `freeze`
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
et les raisons de ce verdict, ses arbitrages et ses brainstorm sont au
[bilan du premier run](docs/brainstorm/2026-10-15-201458-bilan-premier-run.md).

**Au 2026-10-16.** Les trois trous du premier run sont comblés (reçu d'un run sans produit, chemin du
§5 qui ne résolvait pas, lecture de la révision sous test non mesurée) et le client du second run est
sondé : ses foyers, le mode *worktree* à refuser, le texte remis stocké octet pour octet. Le harnais a
désormais son banc dans le dépôt, **50/50 PASS**, et le nom du dossier d'un run est tranché
([ADR-023](docs/DECISIONS.md) : des tirets). Ce qui reste n'est plus une mesure mais un geste : ouvrir un
projet Freebuff sur `<W>/terrain`, en mode direct et sans *worktree*, puis conduire le second run. L'état
courant, ses trous et les prochains pas sont au [tableau de bord](docs/DASHBOARD.md). Et rien n'a encore
produit d'écart : aucun `output.json` n'existe, `NEGATIVE.md` (casser quelque chose exprès et le voir
signalé) et `ECART.md` (le compte-rendu rendu au framework) restent à écrire.
