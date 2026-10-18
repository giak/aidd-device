---
name: ORCHESTRATEUR — conduire un test de bout en bout
description: Le runbook d'une personne qui dit « test ça » : les trois gestes humains, les cinq commandes dans l'ordre, les quatre blocs de narration, et ce que la page ne recopie jamais du harnais
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

## 1. Ce que la page ne fait pas

Elle n'ouvre pas de session, ne colle pas de texte, ne répond pas à la place de la personne : aucune
interface de ligne de commande n'ouvre un fil dans le client, et la base du client est la seule source de
la trace. Trois gestes restent humains ([spec §11](../tasks/2026_10/2026-10-18-070820-orchestrateur-interactif-du-test/2026-10-18-071018-spec.md)) :

1. **ouvrir le fil** dans l'application, au répertoire que `porte` imprime ;
2. **coller** le texte que `porte` imprime, sans le retaper ;
3. **répondre** par une des deux phrases figées du cas, jamais par une autre.

Tout le reste se calcule, et chaque pièce écrite porte de quoi la vérifier : un chemin, une empreinte, un
code de sortie.

## 2. Les cinq commandes, dans l'ordre

Chaque commande imprime son bloc d'étape avant de passer à la suivante ; une étape qui refuse arrête
l'orchestrateur (`exit 1`), une commande mal formée sort en `2` sans rien écrire.

```text
node docs/device/harness/orchestrer.mjs cas --skill <chemin-du-skill> [--terrain <dépôt>] [--id <slug>]
node docs/device/harness/orchestrer.mjs porte --cas <id> --run <dossier>
node docs/device/harness/orchestrer.mjs suite --cas <id> --fil <id> --produit <chemin> | --sans-produit
node docs/device/harness/orchestrer.mjs fin --cas <id> --run <dossier> --difference <texte> --phrase <texte> [--verdict <v>]
node docs/device/harness/orchestrer.mjs lire --cas <id> --run <dossier>
```

| Commande | Ce qu'elle dérive, jamais de la personne | Ce qu'elle écrit |
| --- | --- | --- |
| `cas` | la demande, le squelette d'attendu, les deux origines et leurs clones | `--cases` (deux pièces et le gel), `<racine>/<cas>/` |
| `porte` | le texte substitué, l'empreinte du gel, le dossier autorisé | `gate.json`, `texte-a-remettre.txt` dans `--run` |
| `suite` | les faits, l'export de trace, la copie du produit | `faits.json`, `trace/`, `raw/<cas>/` |
| `fin` | le verdict que la preuve autorise, l'output du juge | `receipt.json`, `output.json` |
| `lire` | rien : elle relit | rien |

`cas` fabrique un **squelette** : le falsificateur de la promesse du skill reste marqué `a_remplir`, et
tant qu'il l'est, le reçu porte la limite `attendu_incomplet` et le verdict plafonne à `non concluant`
([ADR-039](../DECISIONS.md)). La personne remplit le §6 de la demande et la marque `P` de l'attendu, puis
re-gèle : `run.mjs freeze --refreeze` est la seule commande qui re-gèle, et l'orchestrateur ne l'appelle
jamais.

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
  à lire ensuite      : <une ligne, ou rien>
```

La commande précède sa sortie : le bloc dit ce qui a été lancé avant de dire ce qui en est sorti, et
`obtenu` recopie la console, il ne la résume pas.

## 4. Ce qui décide, et qui ne décide pas

- **Le gel décide** du dossier autorisé et de l'état des arbres ; `porte` le re-hache avant d'autoriser.
- **Le reçu décide** du verdict : `fin` demande d'abord, à blanc (`--sans-ecrire`), la valeur que les
  falsificateurs imposent. Sans `--verdict`, l'orchestrateur l'imprime avec sa raison et n'écrit rien :
  c'est la personne qui tranche, et la même commande avec `--verdict` écrit le reçu une seule fois.
- **La personne décide** de `--difference`, `--phrase` et `--limites` : trois faits qu'aucune commande ne
  dérive, et que `compare` refuse vides.
- **L'orchestrateur ne décide de rien.** Il ne contourne pas un refus, ne relance pas une commande qui a
  refusé, et ne réécrit jamais un reçu existant.

## 5. Les refus

Les douze conditions sont celles du [§7 de la spec](../tasks/2026_10/2026-10-18-070820-orchestrateur-interactif-du-test/2026-10-18-071018-spec.md),
chacune éprouvée par un contrôle du [banc](BANC.md). La page ne les recopie pas : un refus se lit dans la
console, avec le code de sortie, et il nomme la pièce qui manque. Trois d'entre eux disent quoi faire
ensuite, parce que la personne peut les lever seule : une porte déjà là (un nouveau `--run`), un fil
introuvable (ouvrir le fil d'abord), un verdict interdit (`--verdict` absent pour lire la valeur imposée).

Deux refus sont propres à l'orchestrateur et ne figurent pas dans le tableau parce qu'ils n'existaient pas
au harnais : **`suite` sans produit nommé** (ni `--produit`, ni `attendu_details.produit.racine`, ni
fichier changé sous l'arbre de travail) et **`suite` sur un produit qui sort de l'arbre travail**. Le
second est la porte de `collect`, lue avant lui par l'orchestrateur pour ne pas laisser le harnais écrire un
manifeste que le reçu refusera.

## 6. Ce que ce dispositif n'atteste pas

- **La qualité du skill**, ni la justesse du produit : l'ordre des gestes et les destinations, jamais le
  texte. Un cas fabriqué le dit deux fois (attendu incomplet, verdict plafonné).
- **Que la porte n'a pas été sautée** : elle est forgeable, et le reçu ne mesure pas l'ordre porte/session.
- **Un run sans session** : les contrôles du banc traversent la chaîne sur des fixtures ; un `conforme` de
  banc prouve que le harnais l'accepte, jamais qu'un run le mériterait.
