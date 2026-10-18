---
name: BANC — le banc du harnais
description: Les 118 contrôles qui éprouvent les refus et les acceptations de run.mjs et du contrôle de liens, où ils vivent, comment les lancer, ce qu'ils touchent et ce qu'ils ne prouvent pas
type: banc
status: in-progress
---

# BANC — le banc du harnais

> V0.1 — 2026-10-16. Reprend le banc jetable `/tmp/banc-porte.sh`, né le 2026-10-15 avec la porte
> (ADR-018) puis étendu au reste du harnais (ADR-020). Il change de nom en changeant de foyer :
> « porte » ne nomme que la première des six commandes qu'il éprouve aujourd'hui ; les ADR-018 et 020,
> datées, gardent l'ancien nom tel qu'elles l'ont écrit. V0.2 — 2026-10-18 : 118 contrôles, le groupe
> 113 à 118 éprouve la forme mécanique du tableau (H6, ADR-035).

**En une phrase.** Il rejoue à blanc les refus et les acceptations du harnais, 118 contrôles, sans ouvrir
aucune session et sans écrire dans le dépôt. Il éprouve deux instruments du dossier `harness/` : `run.mjs`,
le harnais du run (contrôles 1 à 60, puis 64 à 118), et `liens.mjs`, le contrôle de liens des documents du
dépôt (contrôles 61 à 63).

## 1. Le lancer

```text
bash docs/device/harness/banc-harnais.sh          → 118/118 PASS, exit 0
node docs/device/harness/liens.mjs                → 0 lien mort, exit 0 (le compte des liens s'imprime)
bash docs/device/harness/banc-harnais.sh <cas>    → le même banc sur un autre cas gelé
```

Chaque contrôle s'imprime `PASS` ou `FAIL` avec le code de sortie vu et celui qui était attendu ; le
dernier mot est le compte, `118/118 PASS`, et le script sort en `0` seulement si tout passe. Un `FAIL` est
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

Il lui faut `bash`, `node`, `sqlite3` (les contrôles 47 à 50 et 66 à 118 lisent une base de client factice), un cas
gelé et son espace de travail ([REPLAY.md](REPLAY.md) rejoue le gel depuis un clone neuf). Ces outils-là
ne sont pas supposés : `run.mjs` les déclare au `--help` et les sonde au démarrage, et les contrôles 57 à
60 lui donnent un `PATH` amputé pour l'entendre refuser ([ADR-026](../DECISIONS.md)). Le banc, lui, ne
sonde pas sa propre machine : il s'arrête ( `exit 2`) si le gel ou l'espace de travail manque, et laisse
une panne d'outil se voir dans un `FAIL`.

## 3. Ce qu'il touche, et ce qu'il ne touche pas

- Un dossier jetable sous `$TMPDIR`, `mktemp -d`, imprimé au départ et conservé pour inspection.
- **Un lien symbolique**, écrit puis retiré, dans l'espace de travail du cas (contrôles 40 et 41 ; le 41
  échoue si l'espace n'est pas rendu propre). C'est la seule écriture hors du dossier jetable.
- Jamais le dépôt, jamais les quatre arbres, jamais `run.mjs`. Aucune session n'est ouverte. Aucune porte
  n'est écrite à la main : les contrôles 104 à 108 et 112 partent d'un `gate.json` produit par `preflight`,
  puis retouchent un seul champ.

## 4. Les 118, par groupe

| Contrôles | Ce qu'ils éprouvent | Livre |
| --- | --- | --- |
| 1 à 13 | la porte, `preflight` : le dossier que le gel nomme, huit mauvais, et le `gate.json` qu'elle écrit dans `--run` | ADR-018, ADR-034 |
| 14 à 20 | non-régression du reste : le reçu sur le dossier gelé, les refus d'origine, `--help` | — |
| 21 à 31 | la racine déclarée : gel, garde du cas, texte substitué | ADR-019 |
| 32 à 46 | l'origine du produit : `collect` exige l'espace gelé, le reçu relit le manifeste | ADR-020 |
| 47 à 50 | les faits : dérivés du fil et du gel, puis refusés quand le fil est inconnu, quand le chemin ne résout pas, quand le fil vit dans un worktree | ADR-024 |
| 51 à 56 | les chemins du `faits.json` relus par `receipt` : répertoire de travail absent (refus, et le message nomme la résolution), dossier de la trace absent (refus, message à l'appui), travail ouvert par un lien vers l'arbre gelé (accepté), trace absente sous un dossier présent (acceptée, limite du §7 écrite) | ADR-025 |
| 57 à 60 | les prérequis, déclarés et sondés : `sqlite3` absent, `date` qui n'obéit pas, `git` absent — trois refus qui nomment l'outil — et le `--help` qui les déclare | ADR-026 |
| 61 à 63 | le contrôle de liens : le dépôt sans lien mort (accepté), un lien mort en prose (refusé, nommé), une citation `](…)` entre backticks (acceptée, comptée comme motif écarté) | ADR-027 |
| 64 à 65 | `session.identifiant` rattaché au fil que la commande d'export lit : un autre fil (refusé, nommé), aucune mention de fil (refusé) | ADR-028 |
| 66 à 67 | l'export lu par le reçu : un échange dans la fenêtre du run (accepté, compté sous `trace_lue`), un échange hors fenêtre (accepté, condition 2 du §5 mordue et nommée). Le fichier n'est plus écrit à la main : il est la sortie de la commande que `faits` écrit, exécutée sur la base du banc ; le cas hors fenêtre se déplace dans la base (premier message sans part, message exporté une heure plus tard) | ADR-029, ADR-032 |
| 68 à 74 | la copie re-hachée : réécrite après `collect` (refus, empreinte nommée), supprimée (refus), fichier en trop (refus), intacte (acceptée et comptée), manifeste haché au reçu, chemin qui sort de `raw/` (refus), lien symbolique (refus) | ADR-030 |
| 75 à 86 | la base relue : champ `trace.base` absent, base absente, fil inconnu, répertoire hors de l'arbre, mode non local, worktree, modèle, heure d'ouverture, premier message, aucun message — dix refus nommés —, base concordante (acceptée, `session_verifiee` venue de la base), et `sqlite3` absent au reçu (refus nommé) | ADR-031 |
| 87 | `last-message.md`, écrit à la main sous `raw/<cas>/` après `collect` : admis et haché sous `produit.verifie` | ADR-030 |
| 88 à 96 | l'export rejoué — deux acceptations, sept refus : intact (accepté, `trace_lue.sha256` égal au fichier et `rejoue_le` écrit), un octet ajouté, lignes permutées, requête retouchée, autre base citée, autre chemin d'export cité, message ajouté à la base après l'export (refus, les deux empreintes à l'appui), `compare` sur une trace intacte (accepté), `compare` sur une trace réécrite entre le reçu et le juge (refus) | ADR-032 |
| 97 à 102 | le budget d'échanges mesuré contre les messages `user` du fil : un message sous le budget (accepté, `echanges{budget, utilises, epuise_par: null}`), trois messages pour un budget de trois (accepté, `epuise_par` nomme le seq 5 et son horodatage), quatre messages (refus nommant les deux chiffres, le seq en trop, et sans reçu écrit), le même avec `--verdict non concluant` (refus aussi : un dépassement n'est pas un plafond), attendu sans budget (refus), budget illisible (refus) — les deux derniers sur un cas recopié et **re-gelé** | ADR-033 |
| 103 à 112 | la porte tracée et confrontée : un reçu sans `gate.json` (refus, « aucune porte »), une porte d'un autre cas, d'un autre gel (cas re-gelé), d'un autre arbre, datée avant le gel (refus nommés), un HEAD commité après la porte dans le clone du banc (refus), une porte intacte (acceptée, `porte.sha256`, `porte.gel_empreinte` et `porte.arbre.head_complet` au reçu, et le juge re-hache), une porte déjà là et un `--run` manquant (refus de `preflight`) | ADR-034 |
| 113 à 118 | la forme mécanique du tableau, et F1 et F2 lues : un tableau de quatre lignes dans une part `text` (accepté, `tableau.present`, `lignes`, `colonnes`, `seq` et `ts` du message qui le porte ; la même forme en `reasoning` est écartée), une ligne de prose seule et un tableau de deux lignes (refus « la trace ne porte aucun tableau »), un `tool` nommé `write_file` portant `input.path` avant le tableau (refus nommant le `seq` et l'outil), un produit né avant l'instant du tableau (refus nommant le chemin), et un fil à outils sans nom ou sans chemin (accepté, aucune écriture comptée, les deux limites écrites). Les traces sont la sortie de la commande d'export du §1.5, jamais tapées à la main : l'export porte `outil` et `chemin_outil` depuis H6 | ADR-035 |

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
