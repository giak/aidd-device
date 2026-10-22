---
name: Deux clients pour le même test, opencode et Freebuff
description: Le constat du couplage Freebuff, les quatre options, l'adaptateur de client recommandé, le modèle normalisé, les falsificateurs et ce que ce brainstorm ne tranche pas
type: brainstorm
status: pending
---

# Deux clients pour le même test, opencode et Freebuff

> 2026-10-20, nom `180518`, né à 18:06:04 (`stat -c %w`), écart de 46 s nommé. Mesuré sur
> opencode **2.0.32** et sur la base Freebuff `terrain-38d8d3f1`. Ce document ne code rien : il
> fixe le problème, les options et une recommandation. La spec vient après approbation, puis le code.

## 1. La demande

Le même cas doit pouvoir être conduit **sous opencode et sous Freebuff**. Le cas, le gel, la porte,
le texte remis, les deux réponses figées et le reçu ne changent pas. Seul le client qui porte la
session change, et le dispositif doit le lire sans qu'on lui mente.

Aujourd'hui, un run opencode ne peut pas produire de reçu. Ce n'est pas un défaut de la session :
c'est un couplage du dispositif à un seul client.

## 2. Ce que chaque client donne, mesuré

| Ce que le reçu exige | Freebuff Desktop | opencode 2.0.32 |
| --- | --- | --- |
| la session | ligne `threads` de `desktop-v2.db` | objet `info` de `opencode session export <id>` |
| les messages | table `messages`, colonne `parts_json` | tableau `messages`, types `user`, `assistant`, `synthetic`, `idle` |
| le modèle | colonne `model` | `info.model.providerID` + `/` + `info.model.id` |
| le répertoire | colonne `project_path` | `info.location.directory` |
| le début | premier `messages.role = 'user'` et son `ts` | premier `messages[].type = "user"` et `time.created` |
| le budget | `count(*) where role = 'user'` | `count(type = "user")` |
| le worktree | colonnes `branch` et `worktree_path` | aucun champ ; le répertoire exact est la garde |
| la trace | requête SQL `json_object(...)` en JSONL | export JSON, puis normalisation en JSONL |

Mesures du 2026-10-20 :

- `opencode --version` => `opencode v2.0.32`.
- `opencode session export ses_ea5fecf3cffeLXbPhaN0y2Fph4` => 365 792 octets, `info` + `messages`,
  29 messages, **1** message `user`, types `user`, `assistant`, `synthetic`, `idle` ;
  `info.location.directory` = `<W>`, hors du terrain ; modèle
  `opencode/minimax-m3.1-flash-free` ; premier message `user` à `2026-10-20T15:49:49.984Z`.
- Une part `tool` opencode : `{ type: "tool", name: "read", state: { status, input: { path }, content } }`.
  Une part `text` ou `reasoning` porte `text`. Une part Freebuff peut porter `kind`, `open`,
  `toolName`, `input.path`, `text` : la normalisation est possible sans perte.
- `<W>/aidd_docs` et `<W>/terrain/aidd_docs` sont absents ; `terrain` est propre à `416ec1f`.
- La session opencode courante est ouverte dans `<W>`, **pas** dans `<W>/terrain` : la porte `075625`
  autorise `<W>/terrain`. Elle ne peut donc pas être le run. L'export relancé depuis `<W>/terrain`
  rend les mêmes 365 792 octets : le CLI retrouve la session, et `info.location.directory` reste `<W>`.

`<W>` = `/home/giak/projects/aidd-device-work/2026-10-15-133423-promesse-memoire-avant-ecriture`.

## 3. Où le harnais est câblé sur Freebuff

- `faits` (`run.mjs`) ouvre `--base <desktop-v2.db>`, lit `threads` et `messages`, et écrit
  `session.application = "Freebuff Desktop (...)"`, `trace.source = "<base> (tables threads, messages)"`
  et une commande d'export SQL. Il gagne `--client` et `--store` ; `--base` reste le fichier Freebuff,
  et `trace.base` n'est exigé que pour lui.
- `receipt` relit cette base pour confronter la session, le modèle, l'ouverture, le premier message et
  le budget ; il rejoue la requête SQL et compare les octets ; il exige `from messages` et un
  `thread_id='…'` dans `trace.commande`. Pour opencode, ces deux contrôles deviennent ceux de
  l'adaptateur : `trace.client`, `trace.store` et `trace.cwd` remplacent `trace.base`.
- `orchestrer.mjs suite` cherche le fil dans `~/.config/freebuff-desktop/projects/*/desktop-v2.db`
  (`basesDuClient`), sans autre client.
- Le banc fabrique une base Freebuff (`threads`, `messages`, `parts_json`) et des fils `banc-*`.

Conséquence : changer de client ne demande pas seulement un export différent. Le reçu doit pouvoir
**re-dériver** la session, le début et le budget depuis le client, jamais depuis `faits.json`.

## 4. Les options

**A. Deux chemins de code**, `--client freebuff|opencode`, chacun avec ses lectures et ses refus.
Rejeté : deux reçus à maintenir, deux jeux de conditions, et la dérive devient invisible.

**B. Un adaptateur de client** : une interface normalisée, deux implémentations, le reste du harnais
inchangé. Recommandé : le reçu, les falsificateurs et le produit ne connaissent qu'un modèle.

**C. Normaliser seulement la trace**, laisser `faits` et `receipt` sur Freebuff, et demander les faits
de session à la personne. Rejeté : le reçu ne peut plus confronter la session ni le budget au client ;
la preuve s'affaiblit sans le dire.

**D. Un export universel** produit par un petit `client export`, et un `faits` qui ne lit que ce JSONL.
Variante de B, utile pour le banc, mais insuffisante seule : le reçu doit **re-exporter** pour vérifier
que le fichier est bien ce que le client rend, donc l'adaptateur reste.

## 5. Recommandation : un adaptateur de client

Un module, deux objets, une seule frontière. Le nom du fichier et le nom des méthodes se tranchent
dans la spec ; la forme proposée est :

```text
detect(fil, { gel, store, cwd }) -> { client, session } | null
session(fil)                     -> { application, identifiant, modele, ouverte_le,
                                       repertoire_de_travail, execution_mode, worktree }
premierMessage(fil)              -> { ts, seq }
budget(fil, n)                   -> { utilises, epuise_seq, epuise_ts }
exportTrace(fil, dest)           -> { commande, source, cwd, sha256 }
replayTrace(fil)                 -> { octets, sha256 }
```

- **Freebuff** : les requêtes actuelles, à comportement constant.
- **opencode** : `opencode session export <id>` lancé dans le répertoire `travail` du gel (mesuré :
  l'export de la session `<W>` relancé depuis `<W>/terrain` rend les mêmes 365 792 octets), puis
  normalisation des messages et des parts en JSONL `{ seq, role, kind, open, outil, chemin_outil,
  text, ts }`. `synthetic` est conservé, `idle` aussi s'il porte du texte ; le budget ne compte que
  `user`.
- Le JSONL normalisé est **la seule** trace que les falsificateurs lisent. L'export brut est la
  matière, pas la preuve : il est conservé et haché, mais pas comparé octet à octet, parce que
  `info.time.updated` et les jetons changent si la session bouge. La condition est le JSONL, stable.
- `open` n'existe pas dans une part opencode : la normalisation le pose à `null`. `tableauDeTrace`
  ne le lit pas ; `ecrituresAvant` lit `kind`, `outil` et `chemin_outil`.
- Le chemin d'un outil se lit dans `state.input.path`, `filePath` ou `file_path`. `read`, `glob` et
  `grep` le portent ; `shell`, `execute` et `skill` non ; une écriture opencode n'a pas été mesurée,
  et la fixture doit la couvrir.
- **L'ordre est celui des lignes du JSONL, pas `seq`** : le `seq` d'un message est partagé par ses
  parts, donc une écriture et le tableau dans le même message assistant auraient le même `seq`.
  Le reçu doit comparer l'index de ligne (ou un `part` explicite), sinon F2 ne voit pas une écriture
  qui précède le tableau dans le même message. C'est un angle mort du H6 actuel, à corriger pour les
  deux clients.
- `faits` écrit `session.outil`, `trace.client`, `trace.store`, `trace.cwd` et `trace.commande`.
  `receipt` choisit l'adaptateur sur `session.outil` et re-dérive du client les faits du client ;
  les faits humains (`par`, `temoignage`, `fin`, `attendu_vu`) restent dans `faits.json`.
- `trace.commande` est comparée à la commande que l'adaptateur reconstruit ; le reçu n'exécute jamais
  la chaîne écrite dans `faits.json`. Il appelle l'adaptateur.
- `suite` essaie Freebuff, puis opencode ; si les deux répondent au même identifiant, il refuse et
  demande `--client` ; si aucun ne répond, il refuse. `--client` lève l'ambiguïté ; `--store` donne
  la racine opencode, par défaut `~/.local/share/opencode`.
- La porte reste **client-agnostique**. Le répertoire de la session doit résoudre au `travail` du
  gel ; une session opencode ouverte dans `<W>` est refusée comme le serait un fil Freebuff ouvert
  ailleurs.

## 6. Ce qui ne change pas

- Le cas, le gel, la porte, le texte, les deux réponses, le budget, les falsificateurs F1 à F9, le
  produit sous `terrain/aidd_docs`, les conditions du verdict, la règle « un run, un dossier ».
- Le client est un **fait du run**, jamais un paramètre du cas : le même cas doit pouvoir tourner sous
  l'un ou l'autre, et le reçu dit lequel.
- Les trois gestes humains restent trois : ouvrir le fil ou la session, coller le texte, répondre.
  Freebuff ouvre un fil ; opencode ouvre une session avec `opencode` dans `<W>/terrain`.

## 7. Falsificateurs de l'adaptateur

- **A1** : une session opencode ouverte dans `<W>` (hors du `travail` du gel) est refusée.
- **A2** : un export sans `info.location.directory` est refusé, pas deviné.
- **A3** : un `faits.json` qui dit `session.outil = opencode` et porte une commande SQL Freebuff est
  refusé.
- **A4** : une trace normalisée modifiée après l'export est refusée par le rejeu et son empreinte.
  L'export brut est conservé et haché, mais il n'est pas comparé octet à octet.
- **A5** : une session à 4 messages `user` contre un budget de 3 est refusée, et le rang fautif est
  nommé.
- **A6** : un identifiant qui se résout dans les deux clients est refusé sans `--client`.
- **A7** : un `modele`, une `ouverte_le` ou un premier message qui diffèrent de l'export sont refusés.
- **A8** : un tableau dans une part `reasoning` n'est pas un tableau ; un tableau dans une part `text`
  en est un. F2 ne bouge pas.
- **A9** : une écriture et le tableau dans le même message assistant, l'écriture avant le tableau,
  sont attrapés par l'ordre des lignes ; le `seq` seul ne suffit pas.

## 8. Banc

- Un faux binaire `opencode` dans `PATH`, qui répond à `--version` et rend une fixture d'export ;
  aucun réseau.
- Fixtures : une session à `$W/terrain` avec demande, tableau, lecture et écriture ; une écriture dans
  le même message que le tableau, avant lui ; une session à `$W/ailleurs` ; une session à quatre
  messages `user` ; une session sans `location.directory`.
- Les contrôles listés ci-dessous (douze, plus l'ordre dans un même message) ; la spec fixe le compte
  final : détection opencode, champs de session, premier message, budget, trace normalisée, tableau,
  écriture, rejeu, désaccord, ambiguïté, `--client`, refus de `<W>`.
- Les contrôles Freebuff restent ; le banc doit passer sur les deux clients. Le nombre exact de
  contrôles est fixé par la spec.

## 9. Pages à mettre à jour

- `ORCHESTRATEUR.md` : le client est choisi au geste, `suite` détecte, `--client` tranche l'ambiguïté ;
  les trois gestes pour chaque client.
- `DEVICE.md` et `BOUNDARY.md` : les deux sources, ce qui est lu, ce qui n'est jamais écrit.
- `ARCHITECTURE.md` : la frontière d'adaptation, les deux modèles de trace, le plafond inchangé.
- `BANC.md` : les contrôles de l'adaptateur et ce qu'ils ne prouvent pas.
- `guide-utilisateur.md` : les deux parcours, sans commande à retenir pour la personne.
- `REPLAY.md` : rejouer un export opencode et un export Freebuff.

## 10. Ce que ce brainstorm ne tranche pas

1. **Auto-détection ou option explicite** : recommandation, auto-détection avec `--client` pour
   l'ambiguïté. À confirmer.
2. **Le client dans le cas** : recommandation, non ; c'est un fait du run, pas une propriété du cas.
3. **La session opencode courante** : recommandation, ne pas confirmer son tableau ; elle informe la
   forme de la fixture, mais la fixture du banc est fabriquée et petite, pas la session réelle ;
   ouvrir une nouvelle session dans `<W>/terrain` pour le run. À confirmer.
4. **Le modèle opencode** : il est enregistré, pas contraint par le cas ; le premier run a déjà
   enregistré un modèle local différent de la configuration par défaut. À confirmer.
5. **Le nombre de contrôles et le nom du module** : spec.
6. **Le `texte` du harnais** : le code expose sept commandes (`freeze`, `preflight`, `collect`,
   `texte`, `faits`, `receipt`, `compare`) alors que quatre pages disent six. C'est une dérive
   documentaire distincte, non corrigée ici.
7. **L'ordre écriture/tableau dans un même message** : le H6 actuel compare `seq`, qui est le numéro
   de message, et deux parts du même message partagent ce numéro. Recommandation : comparer l'ordre
   des lignes (ou un `part`), pour les deux clients. À trancher dans la spec.

## 11. Ce que ce document ne fait pas

Il ne code rien, n'écrit aucune spec, ne touche ni au gel, ni à la porte, ni à la session ouverte. Il
ne transforme pas la session `<W>` en run : elle est hors cadre, et le restera.

## 12. Simulation et corrections du 2026-10-20

Un script jetable sous `/tmp` (hors dépôt) a normalisé l'export réel de la session
`ses_ea5fecf3cffeLXbPhaN0y2Fph4` :

- 29 messages rendent **75** lignes JSONL : 1 `user/text`, 2 `assistant/text`, 47 `assistant/tool`,
  23 `assistant/reasoning`, 2 `synthetic/text` ; aucun `idle` ne porte de texte.
- 1 message `user`, premier à `2026-10-20T15:49:49.984Z` ; `info.location.directory` = `<W>`.
- Le tableau est dans une part `assistant/text` ; `tableauDeTrace` filtre `role === "assistant"`,
  donc les instructions `synthetic` ne peuvent pas le simuler.
- Outils : `read`, `glob` et `grep` portent `state.input.path` ; `shell`, `execute` et `skill` non ;
  aucune écriture n'a été mesurée. La fixture doit couvrir `write`/`edit` et leur champ de chemin,
  sinon l'ordre écriture/tableau reste une limite.
- Le code de F2 (`tableauDeTrace`, `ecrituresAvant`) compare `seq`, le numéro de message : une
  écriture et le tableau dans le même message assistant ne sont pas ordonnés. Le JSONL doit porter
  un ordre de part, ou le reçu doit utiliser l'index de ligne.
- L'export relancé depuis `<W>/terrain` rend les mêmes 365 792 octets : le CLI retrouve la session
  ouverte dans `<W>`, et `info.location.directory` reste `<W>`. Le refus A1 est donc lisible.
- `opencode.db` ne porte pas la session courante (la ligne est absente) : le CLI est la source, pas
  la base.

Corrections que cet audit a imposées à ce document : le compte des contrôles, qui n'était pas neuf ;
la session réelle n'est pas une fixture ; le reçu re-dérive les faits du client, pas les faits humains ;
l'export brut est conservé, pas comparé octet à octet ; l'ordre écriture/tableau manque un ordre de
part dans un même message.
