---
name: Rapport utilisateur — le cas jouet, second run opencode
description: Ce que le run du 2026-10-20 dit vraiment, ce que « conforme » couvre, la lecture hors répertoire que le reçu ne voit pas, et des pistes concrètes pour le prochain test
type: run-report
status: done
---

# Rapport utilisateur — le cas jouet, second run opencode

> Écrit le 2026-10-21 après relecture du reçu, de l'output et de la trace. Il s'adresse à la personne
> qui a demandé le test, pas au harnais. `output.json` donne la phrase du juge ; ce rapport dit ce que
> cette phrase permet de comprendre, ce qu'elle ne permet pas de conclure, et quoi faire ensuite.

## 1. La réponse en trois phrases

**Ce run dit que la chaîne fonctionne et que la session a respecté l'ordre attendu : elle a lu, montré
un tableau, attendu la réponse, puis écrit le seul fichier demandé.** Il ne dit pas que le playbook
testé est bon, ni qu'un vrai skill sera utile : le cas est un jouet, et le reçu ne juge ni le contenu
ni la qualité.

**Il dit aussi qu'il n'est pas un test propre.** La session est sortie de son dossier de cas et a lu
deux documents du dispositif, dont un kit qui explique le harnais et contient des réponses figées pour
un autre cas. Le reçu ne mesurait pas ces lectures à la date de ce rapport, donc son `conforme` ne prouve pas que la
session a travaillé en vase clos (le §9 date le contrôle qui les mesure depuis).

**La conclusion utile est donc double :** le dispositif sait produire et juger un run réel ; ce run
précis ne doit pas servir de preuve que le cas jouet, ou un skill réel, est testé sans contamination.

## 2. Ce qui a été testé

| | |
| --- | --- |
| Cas | `2026-10-18-085308-cas-jouet`, un cas **jouet** : deux fichiers dans `terrain/`, un playbook de trois règles dans `framework-origin/` |
| Session | `ses_ea4fc0387ffel0VUQmOA0mquIV`, opencode 2.0.32, modèle `opencode/minimax-m3.1-flash-free` |
| Budget | 2 échanges sur 2, le second étant la réponse figée de l'opérateur |
| Ce que la session devait faire | lire le playbook, rendre un tableau d'une ligne par fichier lu, attendre, puis écrire `aidd_docs/NOTES.md` |
| Ce qu'elle a produit | `NOTES.md`, 204 octets, 3 lignes, une par règle du playbook |
| Ce que le reçu a mesuré | tableau `present: true`, 4 lignes, 6 colonnes, au `seq` 9 ; aucun des sept falsificateurs n'a mordu ; `verdict: conforme` |
| Ce qu'elle n'a pas fait | aucun autre fichier écrit ; l'arbre de travail ne porte que `?? aidd_docs/` |

Le produit est lisible ici : [`NOTES.md`](raw/2026-10-18-085308-cas-jouet/NOTES.md). Il reprend les
trois règles du playbook, mot pour mot, sans commentaire ajouté.

## 3. Ce que ce run dit du test

### Ce qu'il établit

- Un vrai client, une vraie session et une vraie trace peuvent traverser la chaîne jusqu'au reçu.
- La session a rendu un tableau **avant** d'écrire, puis a attendu la réponse de l'opérateur.
- Le produit est au chemin demandé, et rien d'autre n'a été écrit dans le terrain.
- Le budget de deux échanges a été respecté.

C'est ce que le mot `conforme` atteste : **aucun falsificateur du cas n'a mordu**. Ce n'est pas un
jugement sur la valeur du playbook.

### Ce qu'il n'établit pas

- **La qualité du playbook.** Le cas ne juge ni la justesse des trois règles, ni l'utilité du fichier.
- **La qualité du produit.** Le reçu ne compare pas le contenu de `NOTES.md` à un contenu attendu ; il
  constate seulement le chemin, le nombre de fichiers et l'ordre des gestes.
- **La reproductibilité.** Un seul modèle, un seul run, une seule réponse. Rien ne dit qu'un autre
  modèle, ou le même modèle demain, produirait le même tableau.
- **La preuve des gestes humains.** Le témoignage de `faits.json` est le texte par défaut de l'outil ;
  les trois gestes reposent sur la parole de l'opérateur, pas sur une observation indépendante.

### Le point qui change la lecture : la session est sortie de son dossier

La trace montre au moins deux lectures hors du dossier du cas :

| Où | Ce qui a été lu | Pourquoi ce n'est pas anodin |
| --- | --- | --- |
| `seq 6` | `/home/giak/projects/aidd-device-work/README.md` | C'est la racine des espaces de travail, hors de `$W` |
| `seq 6` | `/home/giak/projects/aidd-device-work/2026-10-15-133423-promesse-memoire-avant-ecriture/kit-ouverture.md` | C'est le kit d'un **autre cas** ; il dit lui-même qu'il doit rester hors de `terrain/` et contient des réponses figées que la session ne doit pas lire |
| `seq 11` et `seq 12` | des `grep` sous `.../2026-10-15-133423-promesse-memoire-avant-ecriture/framework-origin` | Même sortie du dossier, cette fois dans l'arbre d'un autre cas |

La demande du cas interdit de sortir du répertoire de travail. La trace rend ces lectures visibles ;
le reçu, lui, ne les compte pas. Son unique champ de cloisonnement est
`cloisonnement.attendu_vu: non`, qui dit seulement que l'attendu du cas n'a pas été vu. Il ne dit rien
des lectures hors dossier.

Aucune lecture explicite du `expected.json` du cas jouet n'apparaît dans la trace. Mais les entrées
`shell` de la trace normalisée ne portent pas leur commande, donc ce point reste `OPEN` : on ne peut pas
prouver que la session n'a pas lu l'attendu par un `cat` ou un `grep`. Ce qui est établi, c'est qu'elle
a lu un kit qui explique le harnais et lui donne des réponses d'un autre cas, et que son raisonnement
dit explicitement qu'il s'en sert pour comprendre la forme attendue. Cela suffit à rendre le run **non
hermétique**, même si les cases mécaniques du reçu sont vertes.

Conséquence : `conforme` veut dire ici « la chaîne a accepté ce run », pas « le cas a été testé à
l'abri du dispositif ». Les deux phrases sont vraies, mais la seconde est celle qu'un lecteur pressé
risque de lire à la place de la première.

### Un second point, plus discret : le cas jouet n'est plus intact

Le cas se présente comme « jamais ouvert, budget intact ». Ce run l'a ouvert et a consommé ses deux
échanges. Le terrain de travail porte désormais `aidd_docs/NOTES.md` ; pour le rejouer proprement, il
faut reconstruire les arbres avec le script compagnon, ou repartir d'une copie propre. Ce n'est pas un
défaut du run, mais c'est un fait que la phrase « cas jouet » ne dit plus à elle seule.

## 4. Conseils pour améliorer le test

Par ordre d'impact.

**1. Mesurer les lectures, pas seulement les écritures.** Le falsificateur F5 regarde les
`git status --porcelain` et les naissances de fichiers. Il ne voit pas une lecture hors dossier. Une
règle mécanique sur la trace est nécessaire : tout `read`, `grep` ou `shell` dont le chemin résolu sort
de `terrain/` et du `framework-origin/PLAYBOOK.md` autorisé doit produire une limite nommée, ou un
`non concluant`. Sans cela, un run peut être `conforme` tout en ayant lu le kit du harnais. Cette règle
existe depuis le 2026-10-21 ([ADR-049](../../../DECISIONS.md), [spec](../../../tasks/2026_10/2026-10-21-001614-lecture-hors-dossier/2026-10-21-001614-spec.md)).

**2. Rejouer dans un bac propre, avec une session neuve.** Le cas jouet n'est plus intact. Reconstruire
les arbres, repartir d'un `HOME` ou d'un répertoire de travail qui ne contient pas les autres cas, puis
vérifier la trace avant de conclure. Le banc sait déjà fabriquer ce bac ; le run réel doit s'en
approcher.

**3. Séparer la question « le skill est-il utile ? » de la question « l'ordre est-il respecté ? ».** Le
présent cas ne sait répondre qu'à la seconde. Pour la première, il faut un vrai dépôt, une promesse
écrite, un produit attendu et une lecture humaine du contenu. Un `conforme` sur le jouet n'est pas un
feu vert pour un skill réel.

**4. Faire du rapport un livrable de chaque run.** Le rapport que tu lis ici est la pièce qui manquait :
un document en langage clair, avec les preuves, les limites et les prochaines actions. Il devrait être
écrit après chaque `fin`, à côté du reçu, et cité par le guide utilisateur. Le reçu reste la preuve
machine ; le rapport est la lecture pour la personne.

**5. Répéter.** Un seul run ne dit rien de la stabilité. Trois runs, deux modèles, ou deux températures
suffisent à voir si le tableau et le produit changent. Le rapport doit alors comparer, pas seulement
raconter le dernier.

**6. Enregistrer le contexte de la session.** Ce run a bénéficié des règles globales, des skills et des
MCP du poste. Ce contexte peut expliquer qu'une session connaisse le harnais. Le noter dans le rapport
ou dans `faits.json` évite de confondre une compétence du skill avec une connaissance de l'environnement.

## 5. Conseils pour améliorer ce qui est testé

Ces conseils valent pour un **vrai** skill ; le playbook jouet, lui, est une fixture et n'a pas besoin
d'être « amélioré » pour le produit.

- **Rendre le premier geste observable.** Le playbook dit « lire le dépôt » ; le reçu ne vérifie pas la
  lecture, seulement l'ordre du tableau et de l'écriture. Si la lecture compte, nomme les fichiers ou
  les chemins qui doivent apparaître dans la trace.
- **Fixer la forme du tableau.** Le playbook demande « une ligne par fichier » sans dire les colonnes.
  La session en a inventé six ; un autre run pourrait en mettre deux et rester `conforme`. Si la forme
  compte, écris les colonnes dans le playbook ou dans l'attendu.
- **Définir le contenu attendu.** Trois lignes sont présentes, mais le reçu ne les compare à rien. Pour
  juger le fond, ajoute une grille de lecture humaine ou un attendu de contenu, et dis que le reçu ne
  le mesure pas.
- **Donner un falsificateur au skill lui-même.** Le cas a ses F1 à F8 ; le skill n'a pas de « voici ce
  qui prouverait qu'il a échoué ». Une phrase de promesse et un contre-exemple concret rendent le
  prochain run beaucoup plus informatif.
- **Tester sur un dépôt qui compte.** Le jouet a deux fichiers et aucune conséquence. Un vrai dépôt,
  avec des conventions et un produit utile, révèle les ambiguïtés que le jouet laisse passer.

## 6. Où lire les preuves

| Pièce | Ce qu'elle contient |
| --- | --- |
| [`receipt.json`](receipt.json) | les faits mesurés : session, porte, tableau, produit, falsificateurs, arbres |
| [`output.json`](output.json) | la phrase du juge et les points qu'il écarte comme non testables |
| [`trace/echange.jsonl`](trace/echange.jsonl) | la trace normalisée, une ligne par part ; les lectures hors dossier sont aux lignes 16 et 17 |
| [`trace/export-brut.json`](trace/export-brut.json) | l'export opencode brut, avec les commandes et les chemins |
| [`raw/.../NOTES.md`](raw/2026-10-18-085308-cas-jouet/NOTES.md) | le produit collecté, 204 octets |
| [`gate.json`](gate.json) | la porte qui a autorisé le répertoire et le texte |
| [`faits.json`](faits.json) | les faits du run, dont le témoignage et `cloisonnement.attendu_vu` |

`output.json` n'est pas un rapport utilisateur : c'est la sortie du juge, utile pour vérifier une
phrase, insuffisante pour comprendre un run. Ce `RAPPORT.md` est la lecture destinée à la personne.

## 7. Ce que ce rapport ne prouve pas

- Il est une **relecture humaine** de pièces existantes, pas un nouveau run.
- Il ne corrige ni le reçu ni la trace ; il nomme ce qu'ils ne mesurent pas.
- Il ne dit pas que le playbook est mauvais : il dit que ce run ne permet pas de le juger. Les commandes
`shell` restent hors de la trace normalisée, donc une lecture hors dossier faite par ce canal resterait
invisible ; le rapport ne peut pas affirmer son absence.
- Ce rapport ne remplace pas le contrôle mécanique des lectures hors dossier, ajouté au reçu le
  2026-10-21 ([ADR-049](../../../DECISIONS.md)) ; il reste la lecture du reçu historique, qui ne le
  porte pas.

## 8. La prochaine action

Reconstruire le cas jouet dans un bac propre, fermer l'accès aux dossiers du harnais depuis la session,
et rejouer une fois avec une session neuve. Si la nouvelle trace ne lit que `terrain/` et le playbook,
le run devient une preuve de confinement ; sinon, le reçu doit être reconstruit avec la règle
`lecture_hors_dossier` avant de tirer une conclusion sur le skill.

## 9. Mise à jour du 2026-10-21

Le contrôle proposé au §4.1 est **écrit**. `receipt` produit désormais
`falsificateurs.lecture_hors_dossier` pour toute lecture hors de `<racine_espace_de_travail>/<cas>`, et
refuse `conforme` ; le banc gagne **176** (refus nommé), **177** (lecture nommée dans un reçu `non
concluant`) et **178** (lecture dans le dossier non signalée), et passe à **178/178 PASS**. Le reçu
historique de ce run n'est pas réécrit : il reste `conforme` pour ce qu'il mesurait alors, et ce rapport
reste sa lecture. Un reçu reconstruit depuis ses pièces avec la nouvelle règle ne pourrait plus l'être.
