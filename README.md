# aidd-device

Le dispositif de test du framework AIDD : il fait exécuter une modification du framework par une session
ouverte par l'opérateur, et nomme l'écart entre ce qu'elle annonce et ce qu'elle produit, de façon
rejouable. Il garde de quoi refaire le départ, jamais la réponse.

## Par où entrer

- [docs/INDEX.md](docs/INDEX.md) : **la carte**, une page par question. Commencer ici quand on ne sait pas
  où lire.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) : **la vue d'ensemble** du dispositif, ce qu'il fait et ne
  fait pas, les acteurs et ce que chacun ne voit jamais, les quatre arbres et leurs preuves, la vie des
  artefacts, les falsificateurs et le plafond du verdict.
- [docs/PROTOCOLE.md](docs/PROTOCOLE.md) : la conduite d'un test, les deux modes, les huit commandes, les
  quatre blocs, les refus.
- [docs/guide/guide-utilisateur.md](docs/guide/guide-utilisateur.md) : pour qui ne tape aucune commande.
  [docs/guide/guide-du-test-de-bout-en-bout.md](docs/guide/guide-du-test-de-bout-en-bout.md) : le même
  parcours, chapitre par chapitre, sorties observées. [docs/guide/explication.md](docs/guide/explication.md) :
  le projet raconté simplement.
- [docs/VISION.md](docs/VISION.md) : pourquoi ce dépôt existe, et ses trois phases.
  [docs/DECISIONS.md](docs/DECISIONS.md) : chaque décision et les options écartées.
- [docs/BANC.md](docs/BANC.md) : les contrôles qui éprouvent le harnais. [docs/REPLAY.md](docs/REPLAY.md) :
  rejouer un gel depuis un clone neuf.
- [docs/device/CASES/](docs/device/CASES/) : les cas gelés. [docs/device/runs/](docs/device/runs/) : les
  pièces des runs, une par dossier ; leur [index généré](docs/device/runs/INDEX.md) les classe par mode
  (indépendants, guidés, avortés, manuels), avec les comptes et les limites de chacun.
- [AGENTS.md](AGENTS.md) : le contrat de travail, autonome ; il vaut pour tout ce qui s'écrit ici.
- [docs/brainstorm/](docs/brainstorm/) et [docs/tasks/](docs/tasks/) : le raisonnement qui a précédé, et le
  travail spécifié.

## Récupérer et lancer

```text
git clone https://github.com/giak/aidd-device.git
```

**Il n'y a pas de commande unique de lancement**, et la dire unique serait mentir : un run inclut un geste
humain, ouvrir la session. La séquence est au [PROTOCOLE](docs/PROTOCOLE.md) §2, le banc qui éprouve le
harnais sans ouvrir de session se lance par `bash docs/device/harness/banc-harnais.sh`, et le rejeu d'un gel
est au [REPLAY](docs/REPLAY.md). Le harnais lui-même est `docs/device/harness/run.mjs`.

## État

Trois foyers, aucun récit ici : ce qui est vrai aujourd'hui est à l'[ARCHITECTURE](docs/ARCHITECTURE.md),
ce qui reste ouvert au [DASHBOARD](docs/DASHBOARD.md), et ce qui a eu lieu au [journal](docs/trace.md). Un
compte ou une date recopiés ici seraient un second foyer.
