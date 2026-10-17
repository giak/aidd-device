---
name: BANC — le banc du harnais
description: Les 67 contrôles qui éprouvent les refus et les acceptations de run.mjs et du contrôle de liens, où ils vivent, comment les lancer, ce qu'ils touchent et ce qu'ils ne prouvent pas
type: banc
status: in-progress
---

# BANC — le banc du harnais

> V0.1 — 2026-10-16. Reprend le banc jetable `/tmp/banc-porte.sh`, né le 2026-10-15 avec la porte
> (ADR-018) puis étendu au reste du harnais (ADR-020). Il change de nom en changeant de foyer :
> « porte » ne nomme que la première des six commandes qu'il éprouve aujourd'hui ; les ADR-018 et 020,
> datées, gardent l'ancien nom tel qu'elles l'ont écrit.

**En une phrase.** Il rejoue à blanc les refus et les acceptations du harnais, 67 contrôles, sans ouvrir
aucune session et sans écrire dans le dépôt. Il éprouve deux instruments du dossier `harness/` : `run.mjs`,
le harnais du run (contrôles 1 à 60, puis 64 à 67), et `liens.mjs`, le contrôle de liens des documents du
dépôt (contrôles 61 à 63).

## 1. Le lancer

```text
bash docs/device/harness/banc-harnais.sh          → 67/67 PASS, exit 0
node docs/device/harness/liens.mjs                → 312 liens hors code, 0 mort, exit 0
bash docs/device/harness/banc-harnais.sh <cas>    → le même banc sur un autre cas gelé
```

Chaque contrôle s'imprime `PASS` ou `FAIL` avec le code de sortie vu et celui qui était attendu ; le
dernier mot est le compte, `67/67 PASS`, et le script sort en `0` seulement si tout passe. Un `FAIL` est
une information : le dossier jetable du passage est imprimé au départ et conservé, c'est là que vivent
les gels faux et les manifestes recollés qui l'ont produit.

## 2. Ce qu'il exige avant de commencer

Il lit son dispositif dans le **gel du cas**, jamais dans une constante : la racine des espaces de travail
et les quatre arbres viennent de `racine_espace_de_travail` et de `arbres[].chemin` (ADR-019). Aucun
chemin de cette machine n'est écrit dans le script, qui retrouve aussi le dépôt par sa propre position.

Trois arrêts, `exit 2`, avant le premier contrôle :

| Ce qui manque | Ce qu'il dit |
| --- | --- |
| le gel du cas | `ARRET — gel absent` : il éprouve le harnais sur un gel réel, il ne le fabrique pas |
| `racine_espace_de_travail` au gel | `ARRET — le gel ne déclare pas racine_espace_de_travail (gel d'avant l'ADR-019)` |
| l'espace de travail du cas | `ARRET — l'espace de travail du cas n'est pas là` : re-geler, ou lancer depuis la machine qui l'a gelé |

Un banc dont la pièce est absente compterait des accidents comme des refus : il se tait plutôt.

Il lui faut `bash`, `node`, `sqlite3` (les contrôles 47 à 50 lisent une base de client factice), un cas
gelé et son espace de travail ([REPLAY.md](REPLAY.md) rejoue le gel depuis un clone neuf). Ces outils-là
ne sont pas supposés : `run.mjs` les déclare au `--help` et les sonde au démarrage, et les contrôles 57 à
60 lui donnent un `PATH` amputé pour l'entendre refuser ([ADR-026](../DECISIONS.md)). Le banc, lui, ne
sonde pas sa propre machine : il s'arrête ( `exit 2`) si le gel ou l'espace de travail manque, et laisse
une panne d'outil se voir dans un `FAIL`.

## 3. Ce qu'il touche, et ce qu'il ne touche pas

- Un dossier jetable sous `$TMPDIR`, `mktemp -d`, imprimé au départ et conservé pour inspection.
- **Un lien symbolique**, écrit puis retiré, dans l'espace de travail du cas (contrôles 40 et 41 ; le 41
  échoue si l'espace n'est pas rendu propre). C'est la seule écriture hors du dossier jetable.
- Jamais le dépôt, jamais les quatre arbres, jamais `run.mjs`. Aucune session n'est ouverte.

## 4. Les 67, par groupe

| Contrôles | Ce qu'ils éprouvent | Livre |
| --- | --- | --- |
| 1 à 13 | la porte, `preflight` : le dossier que le gel nomme, et huit mauvais | ADR-018 |
| 14 à 20 | non-régression du reste : le reçu sur le dossier gelé, les refus d'origine, `--help` | — |
| 21 à 31 | la racine déclarée : gel, garde du cas, texte substitué | ADR-019 |
| 32 à 46 | l'origine du produit : `collect` exige l'espace gelé, le reçu relit le manifeste | ADR-020 |
| 47 à 50 | les faits : dérivés du fil et du gel, puis refusés quand le fil est inconnu, quand le chemin ne résout pas, quand le fil vit dans un worktree | ADR-024 |
| 51 à 56 | les chemins du `faits.json` relus par `receipt` : répertoire de travail absent (refus, et le message nomme la résolution), dossier de la trace absent (refus, message à l'appui), travail ouvert par un lien vers l'arbre gelé (accepté), trace absente sous un dossier présent (acceptée, limite du §7 écrite) | ADR-025 |
| 57 à 60 | les prérequis, déclarés et sondés : `sqlite3` absent, `date` qui n'obéit pas, `git` absent — trois refus qui nomment l'outil — et le `--help` qui les déclare | ADR-026 |
| 61 à 63 | le contrôle de liens : le dépôt sans lien mort (accepté), un lien mort en prose (refusé, nommé), une citation `](…)` entre backticks (acceptée, comptée comme motif écarté) | ADR-027 |
| 64 à 65 | `session.identifiant` rattaché au fil que la commande d'export lit : un autre fil (refusé, nommé), aucune mention de fil (refusé) | ADR-028 |
| 66 à 67 | l'export lu par le reçu : un échange dans la fenêtre du run (accepté, compté sous `trace_lue`), un échange hors fenêtre (accepté, condition 2 du §5 mordue et nommée) | ADR-029 |

Chaque groupe porte ses **acceptations** autant que ses refus : un banc qui ne saurait que refuser
passerait en refusant tout.

## 5. Ajouter un contrôle

Un appel à `controle <nom> <exit attendu> <commande…>`. Le compte se tient seul : `$TOTAL` s'incrémente,
le dernier mot change. Deux règles, tenues par les contrôles existants :

- **Un négatif pour tout positif** : ce qui doit passer passe, ce qui doit être refusé est refusé, et les
  deux se lisent dans le même passage.
- **Un fait de la machine se lit au gel**, jamais en dur : un contrôle qui écrit `/home/…` en clair cesse
  de suivre un espace de travail déplacé.

## 6. Ce qu'il ne prouve pas

- **Aucun run.** Il n'ouvre pas de session : il éprouve l'instrument, jamais le dispositif en marche.
- **La qualité du cas.** Il dit que le harnais refuse ce qu'il doit refuser, jamais que l'attendu est juste.
- **Ce qui est propre à une machine.** La naissance des fichiers et le `porcelain` gelé ne voyagent pas
  (§5 de [REPLAY.md](REPLAY.md)) : ces contrôles valent sur la machine qui a gelé, ou sur un gel rejoué
  au même endroit.
- **Rien du dépôt.** Ce n'est ni un crochet, ni une CI, ni un contrôle de l'arbre : rien ne le déclenche
  seul, et il ne vérifie que le harnais (ADR-022). Une dérive du dépôt ne le réveille pas.
