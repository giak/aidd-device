---
name: Orchestrateur interactif du test — dire « test ça », et être pris par la main
description: Brainstorm : ce qu'une personne qui ne connaît rien au dépôt doit pouvoir faire en trois mots, les trois formes possibles de l'orchestrateur, le partage inévitable entre la machine et les gestes humains, la fabrique de cas, le contrat de narration, ses propres falsificateurs, et les décisions qui restent ouvertes
type: brainstorm
status: in-progress
---

# Orchestrateur interactif du test

> 2026-10-18, né à 07:09:21 (`stat -c %w`). Ceci est un **brainstorm**, pas une spec : il dit à qui
> l'orchestrateur parle, ce qu'il promet, où sont les murs, et ce qui reste à décider. La spec est au
> même sujet, dans son dossier de tâche. Les faits sur le dispositif sont lus dans ce dépôt.

## 1. La commande, et ce qu'elle suppose

La commande est : **« test ça »**, où « ça » est un skill du framework `aidd` (un fichier, ou un dossier du
dépôt `framework`), et où « ça » peut aussi désigner un couple (skill, dépôt sur lequel l'appliquer). Le
reste est dit par l'orchestrateur, pas par la personne.

Trois choses doivent exister pour que la promesse tienne, et aucune n'est fournie par la phrase :

| Ce qu'il faut | Qui le fournit | Aujourd'hui |
| --- | --- | --- |
| la **cible** : quel skill | la personne, en le nommant ou en le montrant | personne ne le demande |
| le **terrain** : sur quel dépôt le skill s'exerce | l'orchestrateur propose, la personne tranche | c'est un paramètre caché du cas |
| le **dispositif** : gel, porte, session, trace, reçu, verdict | le dépôt `aidd-device`, et rien d'autre | six commandes et deux gestes d'application, que la personne doit connaître |

La promesse, en une phrase : **une personne qui n'a jamais ouvert ce dépôt finit avec un reçu et un
verdict, sans lire une autre page que ce que l'orchestrateur lui montre.**

## 2. Ce que ça coûte aujourd'hui, mesuré

Le dépôt sait déjà tout faire, mais rien ne prend par la main. Le premier cas a coûté un dossier de tâche
entier : une spec, une conduite en six sections, une liste de contrôle, un kit d'ouverture, trois
commandes de gel, un banc — et la personne doit savoir, avant de commencer, ce qu'est `$RACINE`, un gel,
une porte, une fenêtre, un plafond de verdict. Le [guide](../guide-du-test-de-bout-en-bout.md) en trois
chapitres réduit la marche à trois refus et un reçu de banc, mais il ne fabrique aucun cas : il enseigne
sur celui qui existe.

Ce que le guide ne fait pas et que l'orchestrateur doit faire : **choisir le terrain, écrire le cas,
geler, ouvrir, clore, lire le verdict, et expliquer chaque geste pendant qu'il le fait.**

## 3. Trois formes possibles, et ma préférence

| # | Forme | Ce que c'est | Ce qu'elle rate |
| --- | --- | --- | --- |
| A | un **runbook** dans le dépôt | une page qui décrit les gestes, un agent la suit | rien ne devient reproductible ; chaque agent improvise la fabrique de cas |
| B | une **commande du harnais** | `orchestrer.mjs` fait tout le mécanique | la narration (ce qui est expliqué, quand) se dilue dans du code |
| C | un **couple** : runbook + commande | la page dit *quoi dire et quand*, la commande fait *ce qui se calcul* | deux choses à tenir d'accord, donc un risque de dérive entre les deux |

**Ma préférence : C**, avec la règle que la page ne recopie jamais un message de refus (elle renvoie au
harnais, seule source des textes) et que la commande ne contient aucune phrase pédagogique (elle imprime
des blocs, la page dit ce qu'ils veulent dire). C'est la même séparation que la porte et le reçu : le
mécanisme refuse, la page explique.

## 4. Le partage qui ne se négocie pas

La machine peut tout faire sauf trois gestes, et ces trois gestes sont mesurés, pas supposés :

| Geste | Qui | Pourquoi pas la machine |
| --- | --- | --- |
| ouvrir un fil neuf, vide, en mode direct, sur la copie du cas | la personne, dans l'application | aucune interface de ligne de commande n'ouvre un fil ; la base du client est la seule source de la trace (`desktop-v2.db`, tables `threads` et `messages`) |
| coller la demande, mot pour mot | la personne | c'est ce qui est mesuré : le texte stocké est comparé au §5 substitué du cas |
| répondre par l'une des deux réponses figées | la personne | deux phrases existent, figées avant le run ; en improviser une mesure autre chose |

Tout le reste est mécanique : les copies du cas, le gel, la porte, l'export de la trace, `faits`,
`collect`, `last-message.md` (écrit par la personne, à la main, mais à un endroit que la machine nomme),
`receipt`, `compare`, et la lecture du verdict.

## 5. La fabrique de cas, et son mur

Un cas, c'est trois pièces gelées : une **demande** (le texte remis, ses marqueurs, son budget, ses
interdits), un **attendu** (ce que la modification promet), et un **gel** (les empreintes qui les scellent).

Ce qui s'écrit tout seul, sans rien inventer :

- l'identifiant, horodaté, et le nom de dossier que [l'ADR-023](../DECISIONS.md) fixe ;
- la racine déclarée et les deux copies dérivées ([ADR-019](../DECISIONS.md)) ;
- les marqueurs `<<<DEMANDE` / `>>>DEMANDE` et la substitution de `$RACINE` ;
- le budget (trois échanges par défaut), les interdits, et les falsificateurs du dispositif : la lecture
  hors du répertoire de travail (F5), le produit et l'arbre immobile (F6), le produit identique à une
  empreinte antérieure (F7), le silence de la session (F8), la lecture de la révision sous test (F9).

Le mur : **l'attendu du skill ne s'écrit pas tout seul**. Ce que la modification promet, et le
falsificateur de cette promesse, sont une lecture du skill, pas une dérivation. Trois issues, aucune
gratuite :

1. v1 ne connaît qu'un skill : celui qui a un cas, et l'orchestrateur se contente de rejouer le cas existant
   sur un terrain choisi ;
2. l'orchestrateur écrit un **squelette** d'attendu, avec les falsificateurs du dispositif seuls, et la
   personne remplit la promesse ; le reçu portera `attendu_incomplet` comme limite ;
3. la fabrique lit la `description` du skill et en tire un falsificateur de forme (l'ordre promis, la
   destination nommée), ce qui ne marche que pour les skills dont la promesse est un ordre vérifiable.

**Décision ouverte n°1**, et c'est la plus lourde : laquelle des trois pour la v1.

## 6. Le contrat de narration

La demande est « précis et concis ». Cela se traduit en une forme, pas en une intention : chaque étape
s'imprime en **six lignes au plus**, dans cet ordre, et rien d'autre.

```text
▸ ÉTAPE 3/8 — écrire le cas et le geler
  on fait     : request.md, expected.json, puis freeze
  commande    : node docs/device/harness/orchestrer.mjs cas --skill … --terrain …
  attendu     : gel 0d9a2180…, 2 fichiers du cas, 8 références
  obtenu      : gel 0d9a2180…, 2 fichiers du cas, 8 références
  ce que ça veut dire : le texte de la demande ne peut plus changer sans être vu
```

Trois natures de bloc, et pas une de plus : le **geste** (ci-dessus), le **refus** (le texte du harnais,
recopié tel quel, puis une ligne sur ce qu'il empêche et le geste qui suit), et le **verdict** (le verdict
lu dans `output.json`, ses limites, et ce qu'il ne dit pas). Règles : la commande s'imprime **avant** sa
sortie pour que la personne puisse la rejouer ; jamais une ligne qui ne soit adossée à un fichier écrit ou
à une commande passée ; et si un geste échoue, l'orchestrateur s'arrête là, il ne contourne pas.

## 7. Ses propres falsificateurs

Un orchestrateur qui prend par la main se falsifie comme un run. Cinq manières de montrer qu'il a échoué :

| # | Ce qui le fait mordre | Ce que ça tue |
| --- | --- | --- |
| O1 | à la fin, la personne ne sait pas dire ce que le verdict atteste | la narration n'a rien transmis |
| O2 | la demande a été retapée, ou corrigée pendant le run | la fabrique, et le §5 du cas |
| O3 | il annonce un résultat que le reçu ne porte pas | la règle « rien sans pièce » |
| O4 | il a écrit dans un des quatre arbres | la frontière, et le run entier |
| O5 | la même personne relancée sur le même terrain produit un cas différent | la fabrique n'est pas déterministe, donc rien n'est comparable |

## 8. Ce qu'il ne fera pas

Il ne choisit pas le terrain à la place de la personne (il propose) ; il ne juge pas la qualité du skill,
seulement l'ordre de ses gestes ; il ne publie rien ; il n'écrit jamais l'attendu à la place de la
personne (v1) ; il n'ouvre pas la session ; il ne re-gèle pas un cas gelé sans le dire (le re-gel coûte une
empreinte nouvelle, et le reçu doit la porter).

## 9. Ce que je devine, et ce qui reste ouvert

- **Le lecteur** : quelqu'un qui teste un skill du framework et ne connaît ni `$RACINE` ni le mot « gel ».
  C'est une devinette ; si c'est plutôt un contributeur du framework, le ton et la profondeur changent.
- **Le foyer** : le runbook sous `docs/device/`, à côté de `DEVICE.md` et `BOUNDARY.md`, ou une page hors
  dépôt comme le kit ? Le dépôt donne une page versionnée ; l'extérieur donne une page qu'on suit sans
  cloner.
- **Le déclencheur** : une ligne dans `AGENTS.md` (« si l'opérateur dit *test ça*, lire la page ») fait
  partie du contrat de travail du dépôt ; à écrire ou non, c'est un choix, pas une évidence.
- **Le terrain par défaut** : le dépôt courant de la personne, ou toujours un clone jetable ? Un clone
  jetable est plus sûr (aucune écriture dans son projet) et plus lent (un clone par run).
- **Décision ouverte n°1** : les trois issues du §5.
- **La forme mécanique du tableau** reste non écrite (H6) : tant qu'elle ne l'est pas, le falsificateur
  « un tableau dans la trace » sera une lecture humaine, y compris dans un cas fabriqué.

## 10. Ce sur quoi je m'appuie, et ce que je n'ai pas mesuré

**Lu dans ce dépôt** : la [spec du run](../tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-130103-spec.md),
la [conduite](../tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md), la
[liste de contrôle](../tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-17-095643-liste-de-controle-ouverture-second-run.md),
le kit d'ouverture (`aidd-device-work/2026-10-15-133423-promesse-memoire-avant-ecriture/kit-ouverture.md`,
**hors du dépôt** : un clone ne le porte pas),
le [banc](../device/BANC.md), [DEVICE](../device/DEVICE.md), [BOUNDARY](../device/BOUNDARY.md),
[REPLAY](../device/REPLAY.md), le [guide](../guide-du-test-de-bout-en-bout.md), le
[plan du guide](2026-10-17-134347-guide-pedagogique-du-test-de-bout-en-bout.md) et le `--help` du harnais.

**Non mesuré, et qui compte** : aucune personne étrangère au dépôt n'a jamais suivi ces pages ; le temps
d'un run complet « à la main » par un novice n'est pas chiffré ; l'automatisation de la clôture n'est pas
écrite ; et, à cet instant, le second run n'a **pas** de session ouverte : la porte est passée le
2026-10-18 à 07:02:51, et aucune base du client ne porte de fil neuf (mesuré : `threads` à 0 dans chaque
projet du client). L'orchestrateur, lui, n'existe pas.
