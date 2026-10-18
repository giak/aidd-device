---
name: BANC — le banc du harnais
description: Les 153 contrôles qui éprouvent les refus et les acceptations de run.mjs, du contrôle de liens et de l'orchestrateur, où ils vivent, comment les lancer, ce qu'ils touchent et ce qu'ils ne prouvent pas
type: banc
status: in-progress
---

# BANC — le banc du harnais

> V0.1 — 2026-10-16. Reprend le banc jetable `/tmp/banc-porte.sh`, né le 2026-10-15 avec la porte
> (ADR-018) puis étendu au reste du harnais (ADR-020). Il change de nom en changeant de foyer :
> « porte » ne nomme que la première des six commandes qu'il éprouve aujourd'hui ; les ADR-018 et 020,
> datées, gardent l'ancien nom tel qu'elles l'ont écrit. V0.2 — 2026-10-18 : 118 contrôles, le groupe
> 113 à 118 éprouve la forme mécanique du tableau (H6, ADR-035). V0.3 — 2026-10-18 : **130** contrôles,
> le groupe 119 à 130 traverse le **cas jouet** de bout en bout (ADR-036). V0.4 — 2026-10-18 : **148**
> contrôles, le groupe 131 à 148 éprouve l'**orchestrateur interactif** (ADR-038 à 040) : les douze refus
> du §7 de sa spec, un cas fabriqué puis gelé, un reçu de bout en bout, et le compte des lignes d'un bloc.
> V0.5 — 2026-10-18 : **153** contrôles ; 149 à 153 : `cas` crée son dossier `--cases`, un dépôt de skill ou un
> terrain sale est **refusé** et `--tel-quel` porte l'arbre de travail (ADR-042), et l'annexe du guide est
> comparée à l'usage réel de l'orchestrateur — la page ne peut plus nommer une option qui n'existe pas.
> V0.6 — 2026-10-18 : le compte ne bouge pas, **153** ; le contrôle 153 s'étend à `ORCHESTRATEUR.md` : ses
> cinq commandes et leurs options contre l'usage réel, et ses douze refus contre la table du §7 de la spec,
> les contrôles « refus N » du banc et le texte que le code écrit — les deux pages qui parlent des commandes
> ne peuvent plus mentir en silence.

**En une phrase.** Il rejoue à blanc les refus et les acceptations du harnais, 153 contrôles, sans ouvrir
aucune session et sans écrire dans le dépôt. Il éprouve trois instruments du dossier `harness/` : `run.mjs`,
le harnais du run (contrôles 1 à 60, puis 64 à 118, puis 119 à 130 — les douze derniers traversent un cas
entier), `liens.mjs`, le contrôle de liens des documents du dépôt (contrôles 61 à 63), et `orchestrer.mjs`,
l'orchestrateur interactif (contrôles 131 à 153, qui traversent un cas **fabriqué** par lui).

## 1. Le lancer

```text
bash docs/device/harness/banc-harnais.sh          → 153/153 PASS, exit 0
node docs/device/harness/liens.mjs                → 0 lien mort, exit 0 (le compte des liens s'imprime)
bash docs/device/harness/banc-harnais.sh <cas>    → le même banc sur un autre cas gelé
```

Chaque contrôle s'imprime `PASS` ou `FAIL` avec le code de sortie vu et celui qui était attendu ; le
dernier mot est le compte, `153/153 PASS`, et le script sort en `0` seulement si tout passe. Un `FAIL` est
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

Il lui faut `bash`, `node`, `sqlite3` (les contrôles 47 à 50, 66 à 118, 124 à 129 et 139 à 143 lisent une
base de client factice), `git` (les contrôles 133 à 152 fabriquent un cas : copie, clones, gel), un cas gelé
et son espace de travail ([REPLAY.md](REPLAY.md) rejoue le gel depuis un clone neuf), et — depuis V0.3 — les
deux pièces du cas jouet avec son script compagnon : il s'arrête en `exit 2` s'ils manquent, comme du gel du
cas réel. Ces outils-là
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
  puis retouchent un seul champ. Depuis V0.3, il **lit** `CASES/` — les deux pièces du jouet et son script —
  et n'y écrit jamais : le cas jouet est reconstruit et re-gelé sous `$B`.
- Depuis V0.4, il fabrique un cas **sous `$B/orch` uniquement** : les deux origines, leurs clones, les deux
  pièces et le gel ne quittent pas le dossier jetable, et `--cases` pointe toujours là. Le fil de `suite`
  est une ligne de la base du banc, recopiée dans un `$HOME` jetable (`$B/orch/home`), jamais lue dans la
  vraie base du poste : l'orchestrateur découvre la base par `$HOME`, comme sur une machine neuve.

## 4. Les 153, par groupe

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
| 113 à 118 | la forme mécanique du tableau, et F1 et F2 lues : un tableau de quatre lignes dans une part `text` (accepté, `tableau.present`, `lignes`, `colonnes`, `seq` et `ts` du message qui le porte ; la même forme en `reasoning` est écartée), avec un produit né après lui, donc **aucune morsure** de F1, une ligne de prose seule et un tableau de deux lignes (refus « la trace ne porte aucun tableau »), un `tool` nommé `write_file` portant `input.path` avant le tableau (refus nommant le `seq` et l'outil), un produit né avant l'instant du tableau (refus nommant le chemin), et un fil à outils sans nom ou sans chemin (accepté, aucune écriture comptée, les deux limites écrites). Les traces sont la sortie de la commande d'export du §1.5, jamais tapées à la main : l'export porte `outil` et `chemin_outil` depuis H6 | ADR-035 |
| 119 à 130 | le **cas jouet**, et sa première fixture de bout en bout : le script compagnon rend les mêmes têtes dans deux bacs (119) et refuse un bac déjà peuplé (120) ; le gel du bac rend **l'empreinte du gel committé**, **zéro référence** et des `refs_distants` vides (121) ; la porte s'écrit en nommant l'arbre « travail » (122) et ne s'écrase pas (123) ; le produit se collecte sous `raw/` (124) ; les faits se dérivent du fil — **seize** valeurs (125) ; le reçu conclut `conforme`, tableau présent et falsificateurs muets (126) ; deux refus nommés : **F2** sur un fil sans tableau (127), **F1** sur un produit né avant lui (128) ; le juge écrit son `output.json` (129) ; et les deux pièces du cas tiennent sur une page — ≤ 55 + 60 lignes, ≤ 115 au total (130) | ADR-036 |
| 131 à 148 | l'**orchestrateur interactif**, un refus par condition du §7 de sa spec : `--skill` absent (131) ou introuvable (132), skill dans un arbre déjà gelé (145), terrain qui est un des quatre arbres (146), cas déjà là (134), aucune racine possible (147), porte déjà là (137), `suite` sans porte (138) ou sur un fil inconnu du client (139), `fin` sans `last-message.md` (141) ou avec un verdict que la preuve interdit (142), `--budget 0` (135), `lire` sans reçu (144) ; deux acceptations : un cas **fabriqué puis gelé** (133) et sa chaîne entière — porte (136), faits, trace et copie (140), reçu et output (143) ; et le compte des lignes : aucun bloc de narration ne dépasse six lignes (148). Le produit naît après le gel, le fil est une ligne de la base du banc recopiée sous un `$HOME` jetable : rien n'ouvre de session, et rien n'écrit dans `CASES/` | ADR-038, ADR-039, ADR-040 |
| 149 à 153 | `cas` crée son dossier `--cases` quand il n'existe pas encore (149, le premier geste du guide utilisateur plantait en `ENOENT`) ; un dépôt de skill **sale** est refusé, les fichiers nommés (150), et `--tel-quel` porte l'arbre de travail dans la copie — la modification non commitée s'y trouve (151) ; un terrain sale est refusé (152) ; et les **deux pages qui parlent des commandes** ne peuvent plus mentir en silence (153) : chaque option de l'annexe du guide utilisateur existe dans l'usage réel et les cinq commandes offertes y sont nommées ; le runbook d'`ORCHESTRATEUR.md` est confronté au **code** — ses cinq commandes et chacune de leurs options contre l'usage réel, ses douze refus contre la table du §7 de la spec, un contrôle « refus N » du banc au code de sortie de cette table, et le texte attendu de chaque refus dans `orchestrer.mjs` ou `run.mjs` ; un échec se **nomme** : un contrôle pose `DETAIL` avant son appel et `controle` imprime sous `FAIL` les raisons que la commande y a écrites, une par ligne, préfixées `echec :`, puis efface le fichier — sans que le compte ni l'`exit` changent, et sans ligne d'impression collée à un numéro de contrôle | ADR-042 |

Chaque groupe porte ses **acceptations** autant que ses refus : un banc qui ne saurait que refuser
passerait en refusant tout.

## 5. Ajouter un contrôle

Un appel à `controle <nom> <exit attendu> <commande…>`. Le compte se tient seul : `$TOTAL` s'incrémente,
le dernier mot change. Trois règles, tenues par les contrôles existants :

- **Un négatif pour tout positif** : ce qui doit passer passe, ce qui doit être refusé est refusé, et les
  deux se lisent dans le même passage.
- **Un fait de la machine se lit au gel**, jamais en dur : un contrôle qui écrit `/home/…` en clair cesse
  de suivre un espace de travail déplacé.
- **Un échec se nomme**, quand il a des raisons à donner : le contrôle pose `DETAIL=<fichier>` **avant**
  l'appel, sa commande y écrit une raison par ligne, et `controle` les imprime sous son `FAIL`, préfixées
  `echec :`. Le helper efface le fichier et remet `DETAIL` à vide, donc aucun contrôle n'hérite du détail
  d'un autre ; un contrôle qui passe ne laisse rien. La condition de succès ne change pas : le détail
  s'ajoute sous le verdict, il ne le décide pas.

## 6. Ce qu'il ne prouve pas

- **Aucun run.** Il n'ouvre pas de session : il éprouve l'instrument, jamais le dispositif en marche.
- **La qualité du cas.** Il dit que le harnais refuse ce qu'il doit refuser, jamais que l'attendu est juste.
- **Ce qui est propre à une machine.** La naissance des fichiers et le `porcelain` gelé ne voyagent pas
  (§5 de [REPLAY.md](REPLAY.md)) : ces contrôles valent sur la machine qui a gelé, ou sur un gel rejoué
  au même endroit. Le cas jouet, lui, se reconstruit : son script rend les mêmes têtes ailleurs (119), et
  le banc le re-gèle dans son bac — c'est ce gel-là qu'il éprouve, jamais celui de `CASES/`, dont il
  compare seulement l'empreinte.
- **Le cas jouet n'est pas un run.** Le `conforme` du contrôle 126 est **écrit par nous** sur une fixture :
  il prouve que la chaîne l'accepte, jamais qu'un run le mériterait ; le budget du jouet n'est jamais
  consommé, aucune session ne l'ouvre.
- **Le cas fabriqué du contrôle 133 n'est pas un jugement.** Son attendu porte `a_remplir` par
  construction : le `non concluant` du contrôle 143 est la valeur que le reçu impose, pas une opinion sur
  un skill. Les contrôles 131 à 153 éprouvent l'enchaînement et les refus de l'orchestrateur, jamais la
  qualité d'un cas qu'il aurait fabriqué sur un skill réel.
- **Un texte, pas une branche.** Le contrôle 153 lit les sources du harnais : il dit qu'un texte de refus
  attendu par le banc y vit, jamais que la branche qui le produit est celle qui s'exécute — ce comportement
  est tenu par les contrôles de refus eux-mêmes, qui lancent la commande. Une occurrence du même texte
  ailleurs dans le code le satisfait : `aucune porte`, renommé dans `orchestrer.mjs`, y survit dans `run.mjs`
  (refus du reçu) et le contrôle ne voit pas la différence. Le détail imprimé sous `FAIL` nomme la
  **confrontation** rompue (l'option, la commande, le refus, la sortie), jamais la branche ni la cause.
- **Rien du dépôt.** Ce n'est ni un crochet, ni une CI, ni un contrôle de l'arbre : rien ne le déclenche
  seul, et il ne vérifie que le harnais (ADR-022). Une dérive du dépôt ne le réveille pas.
