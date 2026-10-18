---
name: Guide utilisateur — tester un skill de bout en bout
description: Le parcours d'une personne qui arrive avec un skill à tester : les quatre prérequis, les cinq commandes dans l'ordre avec leurs sorties observées le 2026-10-18, les trois gestes humains, ce que le verdict atteste, les refus fréquents et leur geste, et le plafond du cas fabriqué
type: guide
status: in-progress
---

# Guide utilisateur — tester un skill de bout en bout

> 2026-10-18. Ce guide s'adresse à **toi qui arrives avec un skill à tester** : un fichier ou un dossier
> markdown, et un dépôt sur lequel tu veux le voir travailler. Tu n'as pas besoin de connaître le
> vocabulaire du dispositif ; les mots arrivent quand un geste les rend utiles.
>
> **Ce que tu obtiens à la fin** : un reçu, un verdict, et la phrase qui dit ce que ce verdict atteste.
> Un verdict `non concluant` est un résultat normal : c'est le dispositif qui refuse de conclure sur une
> preuve incomplète, pas ton skill qui a échoué.
>
> **Deux avertissements, avant le premier geste.** Les sorties citées ici ont été observées le 2026-10-18
> sur un bac `/tmp/guide-user` (un skill de trois règles, un terrain d'un fichier), et les chapitres 5 et 6
> lisent un **fil fabriqué**, pas une session : aucune session n'a ouvert ce cas de démonstration. Les
> valeurs changeront chez toi, la forme des blocs non. Les blocs de cette page sont recopiés de la console,
> et les plus longs sont abrégés par `…` : aucune de ces lignes n'est paraphrasée. Et **un cas fabriqué
> plafonne ton verdict à `non concluant`** tant que tu n'as pas écrit le falsificateur de promesse du
> chapitre 2 : c'est dit là, avant que tu le rencontres.

## 0. Ce qu'il te faut

| # | Ce qu'il faut | Pourquoi |
| --- | --- | --- |
| 1 | ce dépôt cloné, et `node` (mesuré sur `v22.12.0`), `git`, `sqlite3` | les cinq commandes sont des scripts Node ; l'export de la trace est un appel `sqlite3` |
| 2 | ton skill dans un **dépôt git** : le dossier qui le contient, et sa tête | le gel hache une révision, pas un fichier qui bouge |
| 3 | un **terrain** dans un dépôt git, distinct du précédent | c'est là que la session écrira, et le test ne doit pas écrire dans la révision qu'il lit |
| 4 | un **client** qui écrit sa trace dans une base `desktop-v2.db` (Freebuff Desktop) | le harnais lit la base du client ; aucune commande n'ouvre de fil à ta place |

Les cinq commandes s'appellent toutes de la même façon, depuis la racine de ce dépôt :

```text
node docs/device/harness/orchestrer.mjs <commande> [options]
```

Elles sortent en `0` quand tout va au bout, en `1` sur un refus motivé (le texte dit quoi faire), en `2`
quand la commande est mal formée (option absente, valeur hors domaine).

## 1. Fabriquer le cas — `cas`

**Le geste.** Tu désignes ton skill, ton terrain, une racine où vivront les copies, et un dossier pour les
pièces du cas.

```bash
node docs/device/harness/orchestrer.mjs cas \
  --skill /tmp/guide-user/framework/skills/demo/SKILL.md \
  --terrain /tmp/guide-user/terrain \
  --id demo \
  --racine /tmp/guide-user/espaces \
  --cases /tmp/guide-user/cases \
  --budget 2
```

**La sortie observée**, `exit 0` : deux étapes, puis le bilan.

```text
▸ ÉTAPE 1/2 — la fabrique
  obtenu              : demo.expected.json, demo.freeze.json, demo.request.md

▸ ÉTAPE 2/2 — le gel
  obtenu              : freeze ok — demo : racine /tmp/guide-user/espaces, 2 fichiers du cas,
                         0 reference(s) du framework, 4 arbre(s) ; empreinte 579db5ef

▸ FIN — cas demo gelé — le falsificateur de promesse reste a_remplir, donc le verdict plafonne
  à non concluant
```

**Ce qui existe maintenant.** Trois pièces dans `--cases` (la demande, l'attendu, le gel), deux origines
sous `<racine>/demo/origine/` (ton dépôt et ton terrain, copiés), et leurs deux clones détachés
`framework-origin/` et `terrain/`, qui sont ce que la session lira et où elle écrira. Rien n'est parti vers
un client.

**Deux refus que tu peux rencontrer ici**, et leur geste. Un `--skill` qui n'existe pas est refusé avant
toute écriture (`exit 1`, le chemin est nommé). Un identifiant déjà pris ne s'écrase pas : `cas : le cas
demo existe déjà …` ; change `--id`, ou supprime le dossier du cas si c'est bien le même.

## 2. Écrire ce que la machine ne peut pas deviner

La fabrique dérive tout ce qui est mécanique, et laisse vides quatre endroits. Tant qu'ils le sont, le
verdict ne peut pas dire autre chose que `non concluant` : c'est le plafond annoncé par le `▸ FIN` du
chapitre 1, et il est voulu. Aucun fichier du dispositif n'est à modifier : ce sont des pièces de **ton**
cas.

| Où | Quoi écrire |
| --- | --- |
| `--cases/demo.request.md`, §5 | la ligne entre `<<<LIGNE À REMPLIR PAR LA PERSONNE` et `>>>` : ce que ton terrain est, et ce qu'il attend |
| `--cases/demo.expected.json`, `attendu` | ce que la session doit faire, dans quel ordre, et la preuve de chaque geste |
| `--cases/demo.expected.json`, `attendu_details.produit.racine` | le chemin exact du produit, relatif au répertoire de travail (ici `aidd_docs`) |
| `--cases/demo.expected.json`, `falsificateurs_du_run` | le falsificateur de la promesse de **ton** skill, marqué `P`, à la place de celui qui porte `a_remplir: true` |
| `--cases/demo.expected.json`, `demande.reponses_figees[0]` | la phrase qui autorise l'écriture après le tableau, telle que tu la diras à la session |

La marque du plafond est un **champ** `"a_remplir": true` cherché récursivement, pas le mot : un texte qui
parle de `a_remplir` ne plafonne rien.

**Puis re-gèle**, parce que le gel hache ces fichiers :

```bash
node docs/device/harness/run.mjs freeze --refreeze --case demo --cases /tmp/guide-user/cases2 \
  --racine /tmp/guide-user/espaces \
  --arbre framework-origin=/tmp/guide-user/espaces/demo/framework-origin \
  --arbre terrain=/tmp/guide-user/espaces/demo/terrain
```

```text
freeze ok — demo : racine /tmp/guide-user/espaces, 2 fichiers du cas, 0 reference(s) du framework,
4 arbre(s) ; empreinte 5fe61d4f
```

L'empreinte change (`579db5ef` avant, `5fe61d4f` après) : c'est celle du dossier que tu passes en
`--cases` que la porte et le reçu liront. Sur ton cas, re-gèle donc **le dossier que tu vas utiliser** :
un re-gel dans une copie ne change que cette copie.

## 3. Passer la porte — `porte`

**Le geste.** Un dossier de run, puis la porte. Le dossier doit être neuf : une porte ne s'écrase pas.

```bash
node docs/device/harness/orchestrer.mjs porte --cas demo --cases /tmp/guide-user/cases \
  --run /tmp/guide-user/run
```

**La sortie observée**, `exit 0` : l'étape, puis le texte à coller et les deux réponses figées.

```text
▸ ÉTAPE 1/1 — la porte
  obtenu              : { "type": "gate", "cas": "demo", "passe_le": "2026-10-18T17:07:33.380883570+0200",
                         "repertoire": "/tmp/guide-user/espaces/demo/terrain", … }

À coller dans la session, tel quel (aucune retape) :

Read the skill at /tmp/guide-user/espaces/demo/framework-origin/skills/demo/SKILL.md and use it on this repository.
<<<LIGNE À REMPLIR PAR LA PERSONNE : ce que terrain est, et ce qu'il attend>>>

Les réponses figées, à utiliser telles quelles :
  1. À REMPLIR — la phrase qui autorise l'écriture après le tableau.
  2. Answer from the repository. If it cannot be read there, say so and stop.
```

Le `gate.json` écrit dans le dossier du run porte l'instant du passage, le répertoire autorisé, l'empreinte
du gel, et l'empreinte du texte remis (sha256 et octets). C'est la pièce qui, plus tard, distingue un run
d'une reconstitution.

**Deux refus fréquents.** Le dossier porte déjà une porte : `une porte ne s'écrase pas`, prends un autre
`--run`. Le `--cases` ne porte pas le gel de ce cas : `aucun gel …/demo.freeze.json — la commande porte n'a
pas de cas gelé à lire` ; c'est le dossier du chapitre 2 qu'il faut passer.

## 4. La session — trois gestes qui restent humains

Aucune commande n'ouvre de fil : la base du client est la seule source de la trace, et c'est le client qui
l'écrit. Ce que tu fais, dans cet ordre :

1. **ouvre un fil neuf** dans ton client, au répertoire que la porte a imprimé
   (`/tmp/guide-user/espaces/demo/terrain` dans l'exemple), en mode direct, sans worktree ;
2. **colle le texte** que `porte` a imprimé, d'un bloc, sans le retaper ;
3. **réponds** par une des deux phrases figées du cas, jamais par une autre : la seconde est lue telle
   quelle, la première est celle que tu as écrite au chapitre 2.

C'est tout. Le dispositif n'observe pas la session ; il lira ce que ton client a écrit.

## 5. Après la session — `suite`

**Le geste.** Tu repasses l'identifiant du fil que ton client a créé, et le produit que la session a écrit.

```bash
node docs/device/harness/orchestrer.mjs suite --cas demo --cases /tmp/guide-user/cases \
  --run /tmp/guide-user/run --fil demo-fil --produit aidd_docs
```

**La sortie observée**, `exit 0` :

```text
▸ ÉTAPE 1/2 — la trace
  obtenu              : faits ok — demo : fil demo-fil, début 2026-10-18T16:55:59+02:00,
                         fin 2026-10-18T17:07:39+02:00 ; /tmp/guide-user/run/faits.json

▸ ÉTAPE 2/2 — la copie
  obtenu              : collect ok — demo : 1 fichier(s) verbatim sous /tmp/guide-user/run/raw/demo,
                         source /tmp/guide-user/espaces/demo/terrain/aidd_docs (arbre « travail »)

▸ FIN — le run demo a ses trois pièces (faits, trace, copie) — il s'arrête là, la session est celle
  de la personne
```

Trois pièces sont nées : `faits.json` (les seize valeurs que le reçu exigera), `trace/echange.jsonl`
(l'export, exécuté depuis la commande que les faits ont écrite, jamais retapée), et `raw/demo/` (la copie
verbatim du produit, avec ses empreintes).

**Le dernier geste de ce chapitre**, que la sortie nomme : écris le dernier message de la session dans
`raw/demo/last-message.md`. Le reçu refuse de s'écrire sans lui.

Si la session n'a **rien** produit, ne fabrique pas un produit : dis-le avec `--sans-produit` à la place de
`--produit`. Un run qui ne produit rien reste un run, et le reçu le dira.

## 6. Le verdict — `fin`, puis `lire`

**Demande d'abord à blanc.** Sans `--verdict`, `fin` n'écrit rien : il te dit la valeur que la preuve
impose, et pourquoi.

```bash
node docs/device/harness/orchestrer.mjs fin --cas demo --run /tmp/guide-user/run \
  --difference "aucune difference : les trois notes portent les trois regles" \
  --phrase "la session a lu, montre, puis ecrit" --limites "ne mord pas"
```

```text
▸ VERDICT PROPOSÉ — non concluant
  ce qui l'impose    : receipt : verdict « conforme » refusé — l'attendu du cas porte un falsificateur
                       marqué a_remplir, et un attendu incomplet plafonne le verdict à « non concluant »
                       tant que la personne ne l'a pas rempli (attendu_incomplet, ADR-039)
  ce qui reste écrit : rien — la même commande avec --verdict non concluant écrirait le reçu, une seule fois
```

**Un verdict contre la preuve est refusé**, et le refus dit ce qu'il empêche :

```text
▸ REFUS — receipt : verdict « conforme » refusé — l'attendu du cas porte un falsificateur marqué
  a_remplir …   (exit 1)
```

**Puis écris-le**, une seule fois : la même commande avec la valeur proposée écrit `receipt.json`, puis
`output.json`, puis réimprime le bloc de verdict.

```bash
node docs/device/harness/orchestrer.mjs fin --cas demo --run /tmp/guide-user/run \
  --difference "aucune difference : les trois notes portent les trois regles" \
  --phrase "la session a lu, montre, puis ecrit" --verdict "non concluant" --limites "ne mord pas"
```

```text
▸ ÉTAPE 1/2 — le reçu
  obtenu              : receipt ok — demo : verdict non concluant ; produit 1 fichier(s) ;
                         1 limite(s) ; /tmp/guide-user/run/receipt.json

▸ VERDICT — non concluant
  plafonné par        : l'attendu incomplet (attendu_incomplet)
  ce que le reçu porte: porte 5f5050f3, échanges 1/2, produit 1 fichier(s), limites 1
  ce qu'il n'atteste pas : le reçu atteste qu'un run a eu lieu, jamais que le travail vaut ;
                        l'output du juge dit « non concluant »
```

`--difference`, `--phrase` et `--limites` viennent de toi : aucune commande ne les dérive. `difference` est
ce que tu as vu d'écart entre ce que le skill promet et ce que la session a fait ; `phrase` est la phrase
que tu veux voir citée ; `limites` dit si un falsificateur a mordu.

**Relire, sans rien écrire**, à tout moment :

```bash
node docs/device/harness/orchestrer.mjs lire --cas demo --run /tmp/guide-user/run
```

Elle réimprime le même bloc `▸ VERDICT`. Si le dossier n'a pas de reçu, elle refuse et nomme le chemin
attendu.

## 7. Lire son verdict

Trois valeurs, et aucune ne dit si ton skill est « bon » :

| Verdict | Ce qu'il signifie | Ce qu'il ne dit pas |
| --- | --- | --- |
| `conforme` | un run a eu lieu, et aucun falsificateur du cas n'a mordu | que le skill est utile, ni que le produit est juste |
| `ecart` | le run a eu lieu, et ce que tu as nommé en `--difference` s'écarte de ce que le skill promet | que l'écart vient du skill plutôt que de la session |
| `non concluant` | la preuve ne permet pas de conclure : un falsificateur mord, une pièce manque, ou l'attendu était incomplet | une défaillance : `non concluant` est souvent le résultat d'un dispositif qui fonctionne |

La ligne `plafonné par` te dit **pourquoi** le verdict est borné. Tant qu'elle nomme `attendu_incomplet`,
c'est ton chapitre 2 qui n'est pas fini, pas le run.

## 8. Quand ça refuse

Un refus sort en `1`, nomme la pièce qui manque, et ne laisse rien derrière lui. Les plus fréquents :

| Ce que tu lis | Ce que ça veut dire | Le geste |
| --- | --- | --- |
| `cas : --skill est obligatoire` / `introuvable` | tu n'as pas nommé de skill, ou le chemin n'existe pas | corrige le chemin ; rien n'est écrit |
| `cas : le cas <id> existe déjà` | un cas de ce nom est déjà là | un autre `--id`, ou supprime le dossier si c'est le même |
| `cas : le skill vit dans un des quatre arbres déjà gelés` | tu testes le dispositif avec ses propres arbres | nomme un dépôt à toi |
| `une porte ne s'écrase pas` | ton `--run` porte déjà un `gate.json` | un nouveau `--run` : une porte par run |
| `aucune porte …/gate.json` | tu appelles `suite` avant `porte` | passe la porte d'abord, puis ouvre la session |
| `n'existe dans aucune base` | l'identifiant de fil n'est pas celui que ton client a écrit | relis l'identifiant du fil dans ton client |
| `last-message.md` | le reçu refuse de s'écrire sans le dernier message de la session | écris-le sous `raw/<cas>/` |
| `verdict « conforme » refusé` | la preuve ne le permet pas, et le refus dit ce qui mord | relance sans `--verdict` pour lire la valeur imposée |
| `lire` sur un reçu absent | le run n'a pas encore de verdict | `fin` d'abord |

Une commande mal formée (`--budget 0`, `--verdict flou`, `--run` absent) sort en `2` et affiche son usage :
ce n'est pas un refus du dispositif, c'est un appel à corriger.

## 9. Ce que ce guide ne te promet pas

- **Que ton skill soit jugé bon.** Le reçu atteste qu'un run a eu lieu, avec quelle porte, quelle trace,
  quelle copie, quel budget, et quels falsificateurs ont mordu. La justesse du texte produit reste une
  lecture humaine.
- **Que la porte soit honnête.** Elle est forgeable : elle dit qu'un `preflight` a autorisé ce dossier à
  cet instant, pas que personne ne l'a fabriquée après coup.
- **Un guide déjà éprouvé par un lecteur.** Aucun étranger ne l'a suivi : les commandes de cette page ont
  été exécutées, la compréhension qu'on en a n'a pas été mesurée.

## 10. Pour aller plus loin, quand tu en auras besoin

Ce guide suffit à faire le parcours. Le reste est là si un mot te résiste, et rien n'y est nécessaire pour
avancer.

- [ORCHESTRATEUR.md](../device/ORCHESTRATEUR.md) : le runbook du dispositif, les quatre blocs de narration
  et les trois gestes humains, en une page.
- [le guide du test](guide-du-test-de-bout-en-bout.md) : lire un reçu, rejouer un gel, provoquer des refus,
  comprendre ce que chaque pièce atteste.
- [BANC.md](../device/BANC.md) : les 149 contrôles du harnais, et ce qu'ils ne prouvent pas.
- [DECISIONS.md](../DECISIONS.md) : les ADR, dont l'ADR-039 (le plafond du cas fabriqué) et l'ADR-038
  (la page et la commande).
