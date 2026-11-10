# aidd-device

Le dispositif de test des skills du framework AIDD : il déclare ce qu'un skill est censé faire, le met en
situation dans une session ouverte par l'opérateur, note ce qu'il produit et nomme l'écart entre les deux,
de façon rejouable. Il garde de quoi refaire le départ, jamais la réponse.

## Trois parcours

**Comprendre en dix minutes.** [VISION](docs/VISION.md) dit pourquoi le dépôt existe, puis
[ARCHITECTURE](docs/ARCHITECTURE.md) dit comment il est fait et ce que chaque acteur ne voit jamais. Pour la
version racontée : [explication](docs/guide/explication.md).

**Lancer un test.** [PROTOCOLE](docs/PROTOCOLE.md) §2 donne les dix commandes dans l'ordre ; pour qui ne tape
aucune commande, [guide-utilisateur](docs/guide/guide-utilisateur.md) ; pour éprouver le harnais sans ouvrir de
session, `bash docs/device/harness/banc-harnais.sh`.

**Relire une preuve.** [device/runs/README](docs/device/runs/README.md) dit ce qu'un dossier de run contient et
à quoi se fier ; l'[index des runs](docs/device/runs/INDEX.md) les classe par mode avec leurs limites ;
[REPLAY](docs/REPLAY.md) rejoue un gel depuis un clone neuf ; [BANC](docs/BANC.md) dit ce que les contrôles
prouvent, et ce qu'ils ne prouvent pas.

Trois portes de plus quand on sait ce qu'on cherche : [INDEX](docs/INDEX.md), la carte, une page par question ;
[DECISIONS](docs/DECISIONS.md), chaque choix avec les options écartées ; [AGENTS.md](AGENTS.md), le contrat de
travail, autonome.

## Récupérer et lancer

```text
git clone https://github.com/giak/aidd-device.git
```

**Il n'y a pas de commande unique de lancement**, et la dire unique serait mentir : un run inclut un geste
humain, ouvrir la session. La séquence est au [PROTOCOLE](docs/PROTOCOLE.md) §2, le banc qui éprouve le harnais
sans ouvrir de session se lance par `bash docs/device/harness/banc-harnais.sh`, et le rejeu d'un gel est au
[REPLAY](docs/REPLAY.md). Le harnais lui-même est `docs/device/harness/run.mjs`.

## État

Trois foyers, aucun récit ici : ce qui est vrai aujourd'hui est à l'[ARCHITECTURE](docs/ARCHITECTURE.md), ce qui
reste ouvert au [DASHBOARD](docs/DASHBOARD.md), et ce qui a eu lieu au [journal](docs/trace.md). Un compte ou une
date recopiés ici seraient un second foyer.
