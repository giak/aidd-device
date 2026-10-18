---
name: Guide utilisateur — faire tester un skill
description: Tu arrives avec un skill et un dépôt, tu dis « test ça » à une session d'agent, l'agent conduit le test de bout en bout, tu confirmes ce qu'il a lu de ton skill, tu fais les trois gestes que personne ne peut faire à ta place, et tu lis un verdict avec la phrase qui dit ce qu'il atteste
type: guide
status: in-progress
---

# Guide utilisateur — faire tester un skill

> 2026-10-18. Tu as écrit un skill, tu as un dépôt sur lequel tu veux le voir travailler, et tu veux
> savoir s'il tient. Tu n'as aucune commande à apprendre : tu demandes, une session d'agent conduit le
> test, et tu lis le résultat.
>
> **Ce que tu fais dans ce parcours** : deux confirmations, trois gestes que lui ne peut pas faire (ouvrir
> un fil, coller un texte, répondre une phrase), et la lecture d'un verdict. Tout le reste est conduit.
>
> **Ce que tu obtiens** : un reçu et un verdict, et la phrase qui dit ce que ce verdict atteste. Un
> verdict `non concluant` est un résultat normal : le dispositif refuse de conclure sur une preuve
> incomplète, ce n'est pas ton skill qui a échoué.

## 1. Ce que tu dis

Ouvre une session d'agent **dans ce dépôt** (le dispositif), puis dis, en une phrase :

```text
test ça : <le chemin de ton skill>
```

Donne aussi le dépôt à tester si ce n'est pas celui que l'agent te propose. Par exemple :
`test ça : ~/projets/mon-framework/skills/revue-de-code/SKILL.md, sur ~/projets/mon-service`.

C'est tout ce que tu as à décider pour démarrer. L'agent lit alors la page qui gouverne le geste
([ORCHESTRATEUR.md](../device/ORCHESTRATEUR.md)) et suit ses cinq étapes dans l'ordre.

**Ce que tu ne fais pas** : retaper une commande, remplir un JSON, choisir un identifiant de cas, geler
quoi que ce soit. Si quelqu'un te demande ça dans une session qui a lu cette page, ce n'est pas le
parcours décrit ici.

**Trois conditions côté machine**, que l'agent vérifie et te dit s'il en manque une : ton skill doit vivre
dans un dépôt `git` (le gel hache une révision, pas un fichier qui bouge) ; le dépôt à tester doit être
un autre dépôt `git` (le test écrit dans une copie, jamais dans la révision qu'il lit) ; et **ton dépôt doit
être propre**. Si tu as un fichier commencé mais non commité, l'agent te le dit, te le nomme, et te propose
soit de commiter, soit de tester l'arbre tel quel : sans ça, le test porterait sur ton dernier commit sans
que tu le saches, ce qui est exactement ce qu'un test ne doit pas faire.

## 2. Les deux choses que l'agent te fait confirmer

Il ne les invente pas : il lit ton skill et te les propose. C'est toi qui les valides, parce que c'est ton
intention qui est jugée, pas sa lecture.

| # | Ce qu'il te montre | Ce que tu réponds |
| --- | --- | --- |
| 1 | **la promesse**, en une phrase : ce que ton skill dit qu'il fera, et ce qui prouverait qu'il ne l'a pas fait | « c'est ça », ou la correction : c'est la phrase qui servira de juge |
| 2 | **le produit attendu** : le fichier (ou le dossier) que la session doit laisser, et où, relativement au répertoire de travail | le chemin exact, ou « celui que tu proposes » |

Tant que la première n'est pas écrite, un reçu ne peut pas conclure autre chose que `non concluant` : le
dispositif refuse de juger une promesse qu'il n'a pas. C'est le seul endroit du parcours où ton attention
est vraiment requise, et c'est pour cette raison qu'il te le demande au lieu de le deviner.

## 3. Les trois gestes qui restent à toi

Aucune commande n'ouvre de fil dans ton client, et la base du client est la seule source de la trace. Trois
gestes, donc, et l'agent te donne à chaque fois la valeur exacte à utiliser :

1. **ouvrir un fil neuf** dans ton client, au répertoire qu'il t'indique, en mode direct, sans worktree ;
2. **coller le texte** qu'il te remet, d'un bloc, sans le retaper (il l'a écrit pour toi dans le dossier du
   run et vérifie ensuite que le fil porte bien ces octets) ;
3. **répondre** par la phrase figée qu'il te donne, quand la session la demande. Une autre réponse fait
   sortir le run du cadre, et le verdict le dira.

Rien d'autre. Le dispositif n'observe pas la session : il lira ce que ton client a écrit.

## 4. Ce que tu lis à la fin

L'agent te rend trois choses : les chemins des pièces, le verdict, et ce que le verdict n'atteste pas. Le
bloc a cette forme (observée le 2026-10-18 sur un cas de démonstration, fil fabriqué : tes valeurs
différeront, la forme non) :

```text
▸ VERDICT — non concluant
  plafonné par        : l'attendu incomplet (attendu_incomplet)
  ce que le reçu porte: porte 5f5050f3, échanges 1/2, produit 1 fichier(s), limites 1
  ce qu'il n'atteste pas : le reçu atteste qu'un run a eu lieu, jamais que le travail vaut ;
                        l'output du juge dit « non concluant »
```

Ici le plafond vient de l'attendu : la promesse du skill n'était pas encore écrite. Avec une promesse
confirmée au chapitre 2, la même ligne nomme les falsificateurs qui ont mordu, ou `aucun`.

## 5. Lire son verdict

| Verdict | Ce qu'il signifie | Ce qu'il ne dit pas |
| --- | --- | --- |
| `conforme` | un run a eu lieu, et rien de ce que ton skill promet n'a été démenti par la preuve | que ton skill est utile, ni que le produit est juste |
| `ecart` | le run a eu lieu, et ce que tu as constaté d'écart avec la promesse est nommé | que l'écart vient du skill plutôt que de la session |
| `non concluant` | la preuve ne permet pas de conclure : une pièce manque, un falsificateur mord, ou la promesse n'était pas écrite | une défaillance : c'est souvent le dispositif qui fonctionne |

La ligne `plafonné par` dit **pourquoi** le verdict est borné, et c'est elle qu'il faut lire avant le mot.

## 6. Quand ça s'arrête

Deux familles d'arrêt, et dans les deux cas l'agent recopie le texte tel quel, sans le reformuler.

- **Un refus** (`exit 1`) : une pièce manque, un dossier porte déjà une porte, le fil nommé n'existe pas,
  le dernier message de la session n'est pas écrit. Le refus dit ce qu'il empêche, et le geste qui le lève
  est presque toujours un des tiens (ouvrir le fil, coller le texte, écrire la dernière réponse) ou un
  nouveau dossier de run que l'agent choisit.
- **Une commande mal formée** (`exit 2`) : une option manquante ou hors domaine. Ça ne concerne que
  l'agent : le parcours ne te demande aucune option.

Dans les deux cas, l'agent ne relance pas la commande qui a refusé et ne contourne pas le refus : il te dit
ce qu'il empêche, puis reprend là où le parcours s'est arrêté.

## 7. Ce que personne ne peut te promettre

- **Que ton skill soit jugé bon.** Le reçu atteste qu'un run a eu lieu, avec quelle porte, quelle trace,
  quelle copie, quel budget, et quels falsificateurs ont mordu. La justesse du texte produit reste une
  lecture humaine.
- **Que la porte soit honnête.** Elle est forgeable : elle dit qu'un contrôle a autorisé ce dossier à cet
  instant, pas que personne ne l'a fabriquée après coup.
- **Que ce guide ait été éprouvé par un lecteur.** Les sorties citées ont été observées, la compréhension
  qu'on en a n'a pas été mesurée.

## Annexe — les cinq étapes que l'agent conduit

Pour ta curiosité, ou pour vérifier ce qu'il te raconte. Tu n'as jamais besoin de les taper.

| Étape | Ce qu'elle fait | Ce qu'elle laisse |
| --- | --- | --- |
| `cas` | copie ton skill et ton dépôt sous une racine, écrit la demande et le squelette d'attendu, puis gèle l'ensemble ; `--tel-quel` porte tes modifications non commitées au lieu de les refuser (`ADR-042`) | trois pièces du cas, deux origines, leurs deux copies |
| (confirmation) | rien à taper : l'agent écrit la promesse et le produit que tu as confirmés, puis re-gèle | une empreinte neuve |
| `porte` | écrit le texte à coller et autorise l'ouverture dans la copie du dépôt | `gate.json`, `texte-a-remettre.txt` |
| `suite` | dérive les faits du fil, exécute l'export de la trace, copie le produit | `faits.json`, `trace/`, `raw/<cas>/` |
| `fin` | demande à blanc le verdict que la preuve impose, puis écrit le reçu et l'output | `receipt.json`, `output.json` |
| `lire` | relit le verdict, sans rien écrire | rien |

Les commandes exactes, leurs options et leurs douze refus sont dans
[ORCHESTRATEUR.md](../device/ORCHESTRATEUR.md). Ce que chaque pièce atteste, et comment les vérifier à la
main, est dans [le guide du test](guide-du-test-de-bout-en-bout.md).
