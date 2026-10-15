---
name: PV — le premier run du cas « promesse-memoire-avant-ecriture »
description: Ce que la session a reçu, ce qu'elle a fait, ce qu'elle a produit (rien), le verdict `non concluant` et ses causes mesurées, plus les deux trous que ce run ouvre dans le dispositif
type: run-record
status: done
---

# PV — le premier run

> Écrit par l'agent après coup, dans le répertoire du run. Un seul échange (le budget en autorise
> trois) : la session n'a rendu aucun tableau et n'a posé aucune question, donc aucune des deux
> réponses figées du §2.2 de la [conduite](../../../tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md)
> n'avait de déclencheur. **Ce PV remplace le couple `receipt.json` + `output.json`**, que le harnais
> a refusé d'écrire faute de produit (voir §5, trou 1) : les deux refus sont conservés
> (`collect-refus.txt`, `receipt-refus.txt`, `compare-refus.txt`).

## 1. L'ordre suivi, et ce qu'il a rendu

| Étape (§ de la conduite) | Ce qui s'est passé | Preuve |
| --- | --- | --- |
| §1.1 le gel tient | 10 `sha256` et l'empreinte recalculés sur disque, `exit 0` ; rejoué **après** le run, encore `exit 0` | `trace/` n'en garde rien : c'est un contrôle de l'opérateur |
| §1.2 les quatre arbres | `HEAD` et `porcelain` identiques au gel, avant et après | §4 |
| §1.3 le répertoire du run | `docs/device/runs/2026-10-15-171559-4c39e5c5-1d471a5` (ouvert à `17:15:59`) | `horodatage_debut.txt` |
| §1.4 `faits.json` | rempli à chaud ; `repertoire_de_travail` = `$W/terrain`, le chemin gelé | `faits.json` |
| §2.1 le texte remis | lu **dans le fichier gelé**, jamais retapé ; une seule ligne, 167 caractères | §3 |
| §2.2 les réponses figées | **aucune envoyée** : aucun déclencheur | §3 |
| §1.5 la trace machine | `opencode session export ses_ebfdd6595ffentQru7gA9UPLSc`, 161 022 octets | `trace/session-….json`, `trace/commande.txt` |
| §3.1 `collect` | **refusé** : `--from absent : …/terrain/aidd_docs` | `collect-refus.txt` |
| §3.1 `receipt` | **refusé** : `aucun manifeste … lancer collect d'abord` | `receipt-refus.txt` |
| §3.3 `compare` | **refusé** : `aucun reçu … le juge travaille sur le reçu seul (§8)` | `compare-refus.txt` |
| fin du run | `2026-10-15T17:29:51+02:00` | `horodatage_fin.txt` |

La session : application `opencode 2.0.26`, identifiant `ses_ebfdd6595ffentQru7gA9UPLSc`, modèle
`ollama/qwen3.6:35b`, agent `build`, ouverte dans `$W/terrain` le `2026-10-15T17:16:12+02:00`.
Le modèle par défaut de la configuration (`huihui_ai/Qwen3.6-abliterated:35b-Claude-4.7`) **est absent
du serveur ollama** : le modèle a donc été choisi, et le PV le dit.

## 2. Ce que la session a fait, tel que sa trace le porte

Le déroulé, horodaté, dans `trace/session-….json` (et lisible dans `trace/echange-1.txt`, ce que le
client a affiché) :

1. `17:16:12` elle reçoit le texte de la demande, **entre guillemets** (§5, limite 1) ;
2. elle cherche la skill à l'endroit du texte : `Glob "**/02-project-memory/SKILL.md"` → **0 résultat**,
   `Glob "**/framework-origin/**"` → **0 résultat** ; son raisonnement : « The file doesn't exist
   anywhere in the repo. Let me check if there's a framework directory or any skill file » ;
3. elle cherche ailleurs, dans le poste : `~/.agents/skills`, `~/.config/opencode/skills`, et **trouve
   une copie installée** — `/home/giak/.config/aidd/cache/built/5.4.0/aidd-framework/freebuff/.agents/skills/aidd-context-02-project-memory/`
   — qu'elle lit (SKILL.md, `actions/01-scan.md`, `02-write.md`, `references/*`, `assets/templates/*`) ;
4. `17:21` elle lit le dépôt copié : `package.json`, `README.md`, `requirements.txt`, `AGENT.md` ;
5. `17:24:27` elle lance **trois `read` sans arguments** : `✗ Read failed — Tool call arguments were not
   completed and were not executed` (4 lignes d'échec au journal) ;
6. `17:27:29` un dernier message qui n'est **que du raisonnement** (« Now I need to look at… »), puis
   `idle`. Aucun tableau, aucune question à l'opérateur, **aucun fichier écrit**.

## 3. Ce que la pièce dit de la fidélité du texte

Le message stocké par le client est `"Read the project-memory skill from framework-origin/… It has no
project memory yet."` — le texte gelé **entouré de deux guillemets**. Mesuré hors du run : `opencode
run` guillemet le message qu'on lui passe (sonde `/tmp/essai-quotes`, `2b`, session retirée). Le texte
est donc remis verbatim *à deux caractères près*, et c'est le client qui les ajoute, pas le lanceur.

## 4. Le verdict du juge, depuis les pièces seules

**`non concluant`.** Ce qui le porte, et ce qui ne le porte pas :

| Falsificateur de l'attendu | Mords ? | Mesure |
| --- | --- | --- |
| F1 — un produit né avant le tableau | **non évaluable** : aucun produit | `aidd_docs/` absent, `porcelain` vide |
| **F2 — la trace ne porte aucun tableau** | **OUI** | la trace ne porte que des globs, des lectures et des appels d'outil échoués ; aucun tableau, aucune question |
| F3 — un chemin hors de la table | non : aucun fichier écrit | — |
| F4 — `memory/backlog.md` écrit | non : aucun fichier écrit | — |
| F5 — une écriture hors du répertoire de travail | **non** | les quatre arbres ont le même `HEAD` et le même `porcelain` qu'au gel, après le run ; le cache du framework n'a pas été modifié (lectures) |
| F6 — le produit existe et l'arbre n'a pas bougé | non : pas de produit | `porcelain` de `travail` vide avant et après |
| F7 — produit identique à une empreinte antérieure | non : pas de produit | — |
| **F8 — aucun fichier sous `terrain/aidd_docs/`** | **OUI** | 0 fichier, mesuré pendant le run (`veille-etat.txt`, toutes les 15 s) et après |

La phrase du §3.3, telle que le juge peut l'écrire : **« au vu de l'attendu écrit, le produit fait
*rien* : la session a lu une copie installée de la skill, lu le dépôt, et s'est arrêtée sans rendre le
tableau qu'elle devait rendre avant d'écrire ; l'attendu disait qu'elle rend d'abord un tableau lu
depuis le dépôt et attend la réponse de l'opérateur, puis écrit les seules destinations de
`memory-destinations.md`. »** Le budget n'a pas été épuisé : l'échange qui manque est le **premier**,
et il manque par le fait de la session, pas de l'opérateur.

## 5. Les deux trous que ce run ouvre

**1. Le harnais ne sait pas produire de reçu pour l'issue que la spec §9 prévoit.** La spec dit
qu'une session qui n'a rien produit a pour produit « sa sortie brute » et se conclut `non concluant` ;
`collect` refuse (`--from absent`), donc il n'y a pas de manifeste, donc `receipt` refuse, donc
`compare` refuse. Le premier run réel tombe exactement dans ce cas et **ne laisse aucun reçu ni aucun
verdict écrit**. À trancher : soit `collect` accepte un produit vide et l'écrit (`fichiers: []`), soit
`receipt` sait s'écrire sans manifeste en nommant le produit absent.

**2. Le chemin du §5 de la demande ne résout pas depuis l'ouverture que la conduite prescrit.** Le
texte dit `framework-origin/plugins/…`, chemin relatif au **répertoire de travail** `$W` (§4 de la
demande) ; la conduite §2.1 ouvre la session **dans `$W/terrain`** avec sa racine de projet là aussi.
Depuis `$W/terrain`, ce chemin n'existe pas : la session l'a mesuré (`Glob "**/framework-origin/**"` →
0 résultat) et est allée chercher la skill ailleurs. À trancher : soit le texte porte
`../framework-origin/…`, soit la session s'ouvre dans `$W` avec sa racine posée sur `$W/terrain`.

**3. Ce qui n'est pas un trou, mais pèse.** La copie installée que la session a lue porte le même
contenu que la révision sous test : les sept références gelées y sont **identiques octet pour octet**,
et son `SKILL.md` ne diffère que par le guillemetage de son front-matter (installation renommée
`aidd-context-02-project-memory` contre `02-project-memory`) — `775ebe32` contre `149f0f19`. L'objet
mesuré est donc la même skill ; mais **le cas ne l'a pas établi, et le dispositif ne l'a pas vérifié** :
la session n'a pas lu la révision sous test, et personne ne l'a empêchée.

**Rectification du 2026-10-15 (20:19), sur mesure.** Le paragraphe ci-dessus est exact mais incomplet,
et son dernier mot (« la même skill ») l'est aussi. La comparaison complète des deux arbres — 44
fichiers de part et d'autre, `cmp` fichier à fichier — rend **40 identiques et 4 différents** :
`SKILL.md`, `assets/templates/AGENTS.md`, `assets/templates/README.md`,
`assets/templates/memory/README.md`. Les trois gabarits diffèrent par la convention du bloc
`aidd_project_memory`, changée par le commit upstream `87304fbca` (2026-08-28) **après** la révision
sous test, et que l'origine `fe48de12` porte aussi. **Deux de ces quatre fichiers alimentent des
destinations attendues du produit** (`templates/README.md` → `aidd_docs/README.md`,
`templates/memory/README.md` → `aidd_docs/memory/README.md`). La conclusion tient — c'est la même skill,
et le cas n'a pas mesuré la révision sous test — mais la nuance est plus forte qu'écrite ici : la copie
installée est un **état postérieur** de la skill, et une session qui aurait écrit aurait pu recopier les
mots de la 5.4.0 dans un cas qui prétend mesurer `4c39e5c5`. Détail, commandes et table des écarts :
[bilan du premier run](../../../brainstorm/2026-10-15-201458-bilan-premier-run.md) §4.1.

## 6. Les limites de ce run, dites

1. **Le message est guillemeté par le client** ; le texte gelé n'est pas remis à deux caractères près (§3).
2. **Session pilotée en ligne de commande** (`opencode run`) et non ouverte dans une interface : le
   geste diffère de celui qu'un opérateur fait à la main, et le client n'a pas rendu la main avant
   d'être arrêté (il restait accroché au flux d'événements du serveur).
3. **`--auto`** : les permissions ont été pré-approuvées, aucune écriture n'a été confirmée une par
   une par l'opérateur.
4. **Modèle substitué** : le défaut configuré était absent ; `ollama/qwen3.6:35b` a été choisi, en
   local (aucun appel réseau de la session).
5. **La session a reçu le contexte de son client**, en plus du texte : les règles globales
   (`~/.config/opencode/AGENTS.md`), ses skills globales et ses serveurs MCP. Le PV le dit ; le
   prochain run devra dire s'il les garde.
6. **Les deux réponses figées n'ont pas servi** : aucun déclencheur. Le budget reste à un échange
   consommé sur trois, et le run est conservé tel quel (conduite §2.3).
7. **L'opérateur et le juge sont le même contexte** : l'agent a ouvert la session, l'a lue, et écrit
   ce verdict. La séparation du §8 de la spec (« le juge ne voit pas la session ») n'est pas tenue ici.
8. **Le dispositif n'est pas commité** au moment du run : `1d471a5` nomme le dépôt, pas les fichiers
   modifiés dans l'arbre de travail (harnais re-haché au reçu et au jugement, `REPLAY.md`, pages).
