---
name: ORCHESTRATEUR — conduire un test de bout en bout
description: Le runbook d'une personne qui dit « test ça » : les huit commandes dans l'ordre, les trois gestes humains que rien ne remplace, les quatre blocs de narration, et ce que la page ne recopie jamais du harnais
type: runbook
status: in-progress
---

# ORCHESTRATEUR — conduire un test de bout en bout

> 2026-10-18, écrit après approbation de la [spec](../tasks/2026_10/2026-10-18-070820-orchestrateur-interactif-du-test/2026-10-18-071018-spec.md)
> et de son [brainstorm](../brainstorm/2026-10-18-070921-orchestrateur-interactif-du-test.md). Le couple
> est celui qu'a tranché le brainstorm §3 : **cette page dit ce qui se dit et quand**, la commande
> [harness/orchestrer.mjs](harness/orchestrer.mjs) calcule. La page ne recopie aucun refus
> ([ADR-038](../DECISIONS.md)) : le texte d'un refus vient du harnais, tel quel, et il change là où il est
> écrit, pas ici.

**En une phrase.** Une personne qui ne connaît rien à ce dépôt dit « test ça » sur un skill, et
l'orchestrateur la conduit jusqu'à un reçu, un verdict, et la phrase qui dit ce que le verdict atteste.

> **Depuis le 2026-10-22.** Le test d'un skill se joue par défaut dans la **conversation courante**
> ([ADR-074](../DECISIONS.md)) : pas de headless, pas de fil séparé, pas de reçu. Le run guidé se consigne
> dans le gabarit de la [spec du 22:12](../tasks/2026_10/2026-10-22-221207-traces-et-run-guide/2026-10-22-221207-spec-run-guide.md)
> §3, et depuis le 2026-10-23 il **attache sa trace machine** par `tracer` et gagne un §5 bis
> ([ADR-076](../DECISIONS.md), [spec du 2026-10-23](../tasks/2026_10/2026-10-23-030816-consolider-le-protocole/2026-10-23-030816-spec.md) §4.4).
> Cette page reste le runbook d'un **run indépendant**, demandé explicitement.

## 1. Ce que la page ne fait pas

Elle n'ouvre pas de session, ne colle pas de texte, ne répond pas à la place de la personne. La
sous-commande `ouvrir` ouvre la session **opencode** par l'API de son serveur et joue la réponse figée
du cas ([ADR-059](../DECISIONS.md)) ; elle n'atteste personne, et elle n'existe que pour opencode.
L'ouverture d'un fil Freebuff reste à la main, et la source du client — base Freebuff ou export opencode
— est la seule source de la trace. Trois gestes restent humains ([spec §11](../tasks/2026_10/2026-10-18-070820-orchestrateur-interactif-du-test/2026-10-18-071018-spec.md)) :

1. **ouvrir le fil** dans l'application, au répertoire que `porte` imprime — ou laisser `ouvrir` le
   faire pour opencode ;
2. **coller** le texte que `porte` imprime, sans le retaper — ou laisser `ouvrir` l'envoyer ;
3. **répondre** par une des deux phrases figées du cas, jamais par une autre — `ouvrir` les envoie dans
   l'ordre, répond aux formulaires par l'option marquée Recommandé, et joue aussi une question posée en
   texte quand sa dernière ligne hors bloc de code finit par `?`.

Aucun de ces trois gestes n'est attesté par une pièce : `ouvrir` les automatise, il ne les prouve pas.

Tout le reste se calcule, et chaque pièce écrite porte de quoi la vérifier : un chemin, une empreinte, un
code de sortie.

## 2. Les huit commandes, dans l'ordre

Chaque commande imprime son bloc d'étape avant de passer à la suivante ; une étape qui refuse arrête
l'orchestrateur (`exit 1`), une commande mal formée sort en `2` sans rien écrire.

```text
node docs/device/harness/orchestrer.mjs cas --skill <chemin-du-skill> [--terrain <dépôt>] [--id <slug>]
node docs/device/harness/orchestrer.mjs porte --cas <id> --run <dossier>
node docs/device/harness/orchestrer.mjs ouvrir --cas <id> --run <dossier> [--cases <dir>] [--api <url>] [--modele <fournisseur/modèle>] [--delai <minutes>]
node docs/device/harness/orchestrer.mjs suite --cas <id> --fil <id> [--client auto|freebuff|opencode] [--store <dir>] --par <qui> --conduite agent|humain --produit <chemin> | --sans-produit
node docs/device/harness/orchestrer.mjs fin --cas <id> --run <dossier> --difference <texte> --phrase <texte> [--verdict <v>]
node docs/device/harness/orchestrer.mjs rapport --cas <id> --run <dossier> [--remplacer] [--cases <dir>]
node docs/device/harness/orchestrer.mjs lire --cas <id> --run <dossier>
node docs/device/harness/orchestrer.mjs tracer --run <dossier> --fil <id> [--client auto|freebuff|opencode] [--store <dir>]
node docs/device/harness/orchestrer.mjs tracer --run <dossier> --liste --depuis <iso>
```

| Commande | Ce qu'elle dérive, jamais de la personne | Ce qu'elle écrit |
| --- | --- | --- |
| `cas` | la demande, le squelette d'attendu, les deux origines et leurs clones | `--cases` (deux pièces et le gel), `<racine>/<cas>/` |
| `porte` | le texte substitué, l'empreinte du gel, le dossier autorisé | `gate.json`, `texte-a-remettre.txt` dans `--run` |
| `ouvrir` | le fil de la session, la réponse figée de chaque question — formulaire ou texte —, l'option marquée Recommandé | rien : elle imprime le fil |
| `suite` | les faits, l'export de trace par l'adaptateur du client, le dernier message (dernière part `text` d'un assistant, hachée dans `faits.json`, [ADR-065](../DECISIONS.md)), la copie du produit, et l'annexe du scratch quand le cas le déclare | `faits.json`, `trace/`, `raw/<cas>/last-message.md`, `raw/<cas>/manifest.json` et la copie, plus `annexe/<cas>/manifest.json` et sa copie |
| `fin` | le verdict que la preuve autorise, l'output du juge, le rapport technique, et la page utilisateur quand le cas déclare sa lecture | `receipt.json`, `output.json`, `RAPPORT.md`, et `RESULTAT.md` si `CASES/<cas>.lecture.json` existe |
| `rapport` | le rapport et la page utilisateur, depuis le reçu, l'output, la trace et la lecture du cas, vérifiée avant toute écriture | `RAPPORT.md` et `RESULTAT.md`, avec `--remplacer` |
| `lire` | rien : elle relit | rien |
| `tracer` | le client du fil, la session normalisée, le compte des lignes et le `sha256` de l'export | `trace/echange.jsonl` et `trace/fil.json` dans un dossier de run guidé, et rien d'autre |

`ouvrir` est la seule commande qui parle à un client au lieu de lire ses pièces ([ADR-059](../DECISIONS.md)).
Elle lance `opencode serve` sur un port libre de `127.0.0.1` — ou se branche sur `--api`, dont le mot de
passe vient de `OPENCODE_SERVER_PASSWORD` —, lit le mot de passe que le serveur imprime, crée la session
dans l'arbre `travail` du gel, puis envoie `texte-a-remettre.txt` **verbatim** après avoir vérifié le
`sha256` de `gate.json` : le texte que la session reçoit est celui que la porte a autorisé, pas une
recopie. Elle attend ensuite la question — un formulaire, ou un texte `assistant` dont la dernière ligne
non vide hors bloc de code finit par `?` —, envoie la réponse figée suivante du cas comme message, répond au
formulaire par l'option marquée « Recommandé » (à défaut la première), et s'arrête quand la session devient
inactive ; au délai (30 min par défaut), elle refuse sans conclure. Une question en texte ne crée aucun
formulaire : la réponse part comme message `user`, une seule fois, et le bloc dit qu'elle a été jouée. Elle n'écrit **rien** dans le dossier
du run : le fil qu'elle imprime est le `--fil` de `suite`. Ce qu'elle n'atteste pas — qui a conduit le run,
et le choix des options du formulaire — se dit dans `faits.json` : `suite` exige `--conduite agent|humain` et
`--par`, et le reçu recopie ce bloc avec la limite qui dit qu'il est déclaré, jamais vérifié
([ADR-071](../DECISIONS.md)). Une personne qui a conduit le run écrit `humain` ; `ouvrir` a conduit, donc
`agent`. Aucune valeur par défaut ne parle à la place de qui a tenu le volant.

`tracer` est la commande du **run guidé** ([ADR-076](../DECISIONS.md)) : elle exporte le fil par la
frontière des clients et écrit `trace/echange.jsonl` plus `trace/fil.json`, sans reçu ni verdict. Elle
refuse un dossier qui ne porte pas exactement un `*-run-guide.md`, un fil inconnu, un client ambigu et une
trace déjà écrite. `--liste --depuis <iso>` rend les fils récents du projet — identifiant, modèle, nombre
de messages, début — sans aucun contenu, parce qu'un identifiant ne se devine pas. Le gabarit du run guidé
reçoit alors son §5 bis : le fichier, son empreinte, ses lignes, sa source, et des preuves qui citent un
`seq` au lieu d'un tour lu à la main.

`porte` ajoute au bloc `▸ FIN` deux lignes qui ne viennent d'aucune lecture de la personne : la durée
observée du cas et la taille de l'échantillon, avec ses réserves. Un cas jamais mesuré reçoit
« aucune mesure pour ce cas », jamais une fourchette par défaut. Cette durée n'est pas une promesse :
elle est lue dans les runs passés du même cas, et le libellé le dit.

`fin` écrit aussi `RAPPORT.md` dans le dossier du run, après l'output : en langage clair, ce qui a été
testé, ce que le verdict couvre, ce qu'il ne couvre pas, et des pistes pour le prochain test. Le rapport
est **déterministe** : il ne fait aucun appel réseau et chaque phrase vient du reçu, de l'output ou de la
trace. Ce n'est pas un bloc de console : c'est un document, et `lire` ne le remplace pas. La commande
`rapport` le reconstruit pour un run déjà clos ; sans `--remplacer`, elle refuse d'écraser un rapport
existant. `fin` refuse de commencer si `RAPPORT.md` est déjà là, pour qu'un rapport ne reste pas à côté
d'un reçu neuf.

`cas` fabrique un **squelette** : le falsificateur de la promesse du skill reste marqué `a_remplir`, et
tant qu'il l'est, le reçu porte la limite `attendu_incomplet` et le verdict plafonne à `non concluant`
([ADR-039](../DECISIONS.md)). **L'agent remplit ce squelette, la personne le confirme** ([ADR-041](../DECISIONS.md)) :
il lit le skill, propose la promesse en une phrase, le produit attendu, la ligne du §5 que la fabrique
laisse ouverte, le §6 de la demande, la marque `P` de l'attendu et la première des deux réponses figées ;
la personne corrige ou confirme, puis l'agent écrit et re-gèle. Le squelette porte aussi un bloc
`cloisonnement` (`terrain` et `framework-origin` en lecture, `terrain/aidd_docs` en écriture, réseau et
fichiers de contexte interdits) : c'est le cadre par défaut d'un cas neuf, et la personne le corrige
dans l'attendu si son cas demande autre chose. Ce cadre porte aussi le **scratch**
(`cloisonnement.ecriture.scratch: terrain/.scratch`), un dossier lisible et scriptible sous l'arbre du cas,
collecté en annexe par `suite` et jamais compté comme produit : c'est là qu'un skill d'investigation écrit
les scripts dont il cite la sortie, et un chemin volatil comme `/tmp` reste hors cadre ([ADR-067](../DECISIONS.md)).
Le gabarit demande enfin le **tableau** de ce que l'agent qualifie, juste après la phrase de qualification,
et il écrit dans le squelette `attendu_details.tableau.requis: true` et `attendu_details.pause.requis: true` :
la pause entre la qualification et la première écriture est ainsi mesurée sur un tour de la personne, sans
exiger l'outil `question` ([ADR-068](../DECISIONS.md), [ADR-069](../DECISIONS.md)). Le §6 de la demande exige
un produit autosuffisant : ce que le produit cite comme preuve est dans le fichier, ou sous le scratch collecté. `receipt` refuse un attendu sans ce bloc ; il ne retombe
jamais sur une racine supposée ([ADR-052](../DECISIONS.md)). `run.mjs freeze --refreeze` est la seule
commande qui re-gèle, et l'orchestrateur ne l'appelle jamais : le re-gel est un geste de l'agent, explicite,
jamais un effet de bord d'une autre commande.

## 3. Les quatre blocs

Le contrat est exact ([ADR-040](../DECISIONS.md)) : quatre formes, six lignes au plus chacune, `▸` compris,
une ligne vide entre deux blocs, et rien entre elles.

```text
▸ ÉTAPE n/N — <titre court>
  on fait             : <une ligne, à l'infinitif>
  commande            : <la commande exacte, copiable>
  attendu             : <ce qui doit sortir>
  obtenu              : <ce qui est sorti, recopié de la console>
  ce que ça veut dire : <une ligne, adossée à la pièce écrite>
```

```text
▸ REFUS — <le texte du harnais, recopié>
  ce qu'il empêche    : <une ligne>
  le geste qui suit   : <une ligne, ou « rien : cette étape s'arrête ici »>
```

```text
▸ VERDICT — <conforme|ecart|non concluant>
  plafonné par        : <les falsificateurs qui mordent, ou l'attendu incomplet, ou « aucun »>
  ce que le reçu porte: <porte, échanges, produit, limites>
  ce qu'il n'atteste pas : le reçu atteste qu'un run a eu lieu, jamais que le travail vaut
```

```text
▸ FIN — <état en une ligne>
  pièces              : <les chemins écrits>
  durée estimée       : <optionnel, porte : la fourchette lue dans les reçus du cas et ce qu'elle comprend>
  échantillon         : <optionnel, porte : n, la mesure et les réserves>
  à lire ensuite      : <une ligne, ou rien>
```

Les deux lignes optionnelles restent dans `▸ FIN` : les quatre formes et le plafond de six lignes de
l'ADR-040 tiennent, et aucune autre commande ne les imprime.

La commande précède sa sortie : le bloc dit ce qui a été lancé avant de dire ce qui en est sorti, et
`obtenu` recopie la console, il ne la résume pas.

## 4. Ce qui décide, et qui ne décide pas

- **Le gel décide** du dossier autorisé et de l'état des arbres ; `porte` le re-hache avant d'autoriser.
  **L'attendu décide du cadre** : `cloisonnement.lecture.autorisees` fixe les seules racines dont une
  lecture est dans le cadre, et le reçu les recopie avec leurs chemins résolus. Une lecture hors de ces
  racines mord, même dans le dossier du cas ; seule `$RACINE/<cas>/` elle-même est lue par égalité, comme
  le répertoire de travail que la demande nomme ([ADR-064](../DECISIONS.md)). Le scratch déclaré est lu et écrit
  au même titre qu'une racine d'écriture, sans jamais compter comme produit ([ADR-067](../DECISIONS.md)). Un outil d'écriture qui
  nomme un chemin hors de `cloisonnement.ecriture.autorisees` mord de même ([ADR-063](../DECISIONS.md)) ;
  relire un fichier que la session a elle-même écrit ne mord pas deux fois ([ADR-066](../DECISIONS.md)).
- **Le reçu décide** du verdict : `fin` demande d'abord, à blanc (`--sans-ecrire`), la valeur que les
  falsificateurs imposent. Sans `--verdict`, l'orchestrateur l'imprime avec sa raison et n'écrit rien :
  c'est la personne qui tranche, et la même commande avec `--verdict` écrit le reçu une seule fois.
- **La personne décide** de `--difference`, `--phrase` et `--limites` : trois faits qu'aucune commande ne
dérive, et que `compare` refuse vides. L'agent les propose, elle les tranche ; un agent qui les remplirait
seul écrirait sa propre opinion dans la pièce qui doit rester la sienne. `compare` refuse aussi une
phrase qui nomme un nombre de colonnes différent de `tableau.colonnes` du reçu ([ADR-048](../DECISIONS.md)) : la phrase
reste la sienne, mais elle ne peut pas démentir une mesure.
- **L'orchestrateur ne décide de rien.** Il ne contourne pas un refus, ne relance pas une commande qui a
  refusé, et ne réécrit jamais un reçu existant.

## 5. Les refus

Les douze conditions sont celles du [§7 de la spec](../tasks/2026_10/2026-10-18-070820-orchestrateur-interactif-du-test/2026-10-18-071018-spec.md),
chacune éprouvée par un contrôle du [banc](BANC.md). La page ne les recopie pas : un refus se lit dans la
console, avec le code de sortie, et il nomme la pièce qui manque. Trois d'entre eux disent quoi faire
ensuite, parce que la personne peut les lever seule : une porte déjà là (un nouveau `--run`), un fil
introuvable (ouvrir le fil d'abord), un verdict interdit (`--verdict` absent pour lire la valeur imposée).

Cinq refus sont propres à l'orchestrateur et ne figurent pas dans le tableau parce qu'ils n'existaient pas
au harnais : **l'ambiguïté du fil** (les deux clients le connaissent, `--client` le tranche), **`--store`
avec `--client freebuff`** (ce store est celui d'opencode), puis **`suite` sans produit nommé** (ni `--produit`, ni `attendu_details.produit.racine`, ni
fichier changé sous l'arbre de travail) et **`suite` sur un produit qui sort de l'arbre travail**. Le
second est la porte de `collect`, lue avant lui par l'orchestrateur pour ne pas laisser le harnais écrire un
manifeste que le reçu refusera. Le troisième est né du scénario « je suis en train de travailler sur un truc » :
**un dépôt de skill ou un terrain sale est refusé**, les fichiers nommés, parce qu'un clone ne porte que les
commits et que la copie sous test serait le dernier commit sans le dire ; `--tel-quel` lève le refus en portant
l'arbre de travail dans la copie, et le porcelain que le gel enregistre le dit ([ADR-042](../DECISIONS.md)).

`ouvrir` a ses propres refus, qui ne rejoignent pas le tableau : aucune porte, un texte dont le `sha256`
n'est plus celui de la porte, un gel sans arbre `travail`, un attendu sans réponse figée, `opencode`
introuvable, un serveur muet ou qui rend `401`, une session ou un message refusés, un champ de formulaire
que la règle du §2 ne remplit pas, une question de plus que le cas n'en fige — formulaire ou texte —, une
session arrêtée sur un texte qui ne demande rien alors qu'une réponse reste à jouer
([ADR-077](../DECISIONS.md)), et le délai dépassé. Chacun sort en `1` et nomme la pièce, le fil compris
pour les deux derniers ; le banc les éprouve (224, 225, 227, 256, 257, 266, 267).

Le client est un fait du run, jamais un paramètre du cas ([ADR-044](../DECISIONS.md)). `suite` sans
`--client` essaie Freebuff puis opencode : deux clients qui connaissent le fil sont un refus qui nomme
`--client`, aucun est le refus 7 qui nomme les deux sources. `--client freebuff` lit
`~/.config/freebuff-desktop/projects/*/desktop-v2.db` ; `--client opencode` exporte la session dans le
répertoire `travail` du gel, par `opencode session export`, et `--store` nomme sa racine
(`~/.local/share/opencode` par défaut). Les trois gestes humains sont les mêmes : ouvrir le fil **ou** la
session au répertoire que `porte` imprime, coller le texte, répondre la phrase figée.

## 6. Ce que ce dispositif n'atteste pas

- **La qualité du skill**, ni la justesse du produit : l'ordre des gestes et les destinations, jamais le
  texte. Un cas fabriqué le dit deux fois (attendu incomplet, verdict plafonné).
- **Que la porte n'a pas été sautée** : elle est forgeable, et le reçu ne mesure pas l'ordre porte/session.
- **Un run sans session** : les contrôles du banc traversent la chaîne sur des fixtures ; un `conforme` de
  banc prouve que le harnais l'accepte, jamais qu'un run le mériterait.
- **Le cadre est déclaré, pas mesuré** : le reçu lit les racines de lecture, et il ajoute une limite pour
  l'écriture hors du cadre, le réseau et les fichiers de contexte — il ne prouve pas leur respect.
- **La pause n'est pas chronométrée** : `pause.mesuree` dit qu'un tour `user` s'est placé entre l'ouverture
  et la première écriture nommée, jamais qu'une personne a attendu. Un tour donné dans la même seconde
  compte ; une question posée sans tour `user` reste une rupture distincte (`question_sans_reponse`).
- **Le contenu d'une commande dynamique** : le reçu lit le texte littéral des commandes `shell` ; une
  variable non résolue, une substitution non bornée ou des backticks refusent `conforme` et disent leurs
  effets non mesurés, jamais ce que la commande a réellement fait. Une substitution `$(…)` bornée est
  lue et ses effets mesurés, mais sa valeur reste inconnue (ADR-056) : elle ne devient jamais un chemin.
  La commande interne d'un `xargs` ou d'un `find -exec` littéral est lue de la même façon, `{}` restant
  inconnu (ADR-057) ; un `eval` reste refusé. Une commande que le shell refuserait (guillemet ou
  substitution non fermés, `find -exec` sans terminateur) est une **faute de session**, nommée
  `shell_invalide` ; une commande valide que le lecteur ne suit pas (`$P/x`, `eval`, `git commit`) reste
  une **limite de l'instrument**, nommée `shell_non_interpretable`, plafonnée et dite par une limite par
  entrée qui nomme son seq et ce qui reste non prouvé ([ADR-070](../DECISIONS.md)). Un binaire opaque qui écrit sans nommer un chemin
  dans sa ligne de commande (`ln`, `dd`, `chmod`, un script) n'est pas vu : le reçu ajoute une limite pour
  la liste des commandes reconnues, il ne prouve pas l'absence d'écriture ni de réseau.
- **Le puits `/dev/null` n'est pas un chemin** : une redirection ou un argument qui le cible ne compte ni
  en lecture ni en écriture ([ADR-053](../DECISIONS.md)). Les autres fichiers de périphérique restent
  comptés, et un binaire opaque qui écrirait vers le puits sans le nommer n'est pas vu — la limite le dit.
- **F7 ne lit que ce que la trace nomme** : le produit est comparé par `sha256` aux fichiers lus avant sa
  naissance ([ADR-054](../DECISIONS.md)), pas à tout le disque. Une copie faite par un binaire opaque, un
  fichier lu modifié ou supprimé avant le reçu, et un contenu identique par coïncidence lui échappent ou
  le font mordre à tort ; la limite et l'ADR le disent.
