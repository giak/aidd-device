# v13 : ce que la campagne au jeton a mesuré, et pourquoi elle s'arrête

Ce fichier ne fait pas partie du contrat. Il note les mesures, y compris celles qui
condamnent mon propre travail antérieur.

---

## 0. Correction : la monnaie de v12 était la mauvaise

`v12-analyse.md` §4 annonçait « −193 caractères (−1,4 %) contre la source ». Mesuré au
jeton, la même livraison donne :

| fichier | caractères | jetons o200k | jetons cl100k |
|---|---:|---:|---:|
| `AGENTS-source.md` | 14 181 | **3 302** | 3 316 |
| `candidat/v11.md` | 14 382 | 3 381 | 3 397 |
| `candidat/v12.md` | 13 988 | **3 302** | 3 314 |

**v12 ne gagne pas un seul jeton sur la source**, et deux sur `cl100k`. Les 193 caractères
retirés ont été rendus en caractères ailleurs : l'éclatement de la puce `R1`–`R11`, les
déclencheurs `WHEN` plus longs que les tournures qu'ils remplacent, et les listes fermées
conservées. Le chiffre que j'avais mis en avant mesurait une grandeur qui ne coûte rien.

C'est la première leçon de la campagne, et elle est méthodologique : **une compression de
contrat se mesure en jetons, jamais en caractères.** Commande :
`python3 -c "import tiktoken; print(len(tiktoken.get_encoding('o200k_base').encode(open('f').read())))"`.

## 1. Où sont les jetons

| section | jetons (o200k) | part du noyau |
|---|---:|---:|
| `OUTPUT` | **780** | **42,5 %** |
| `INVARIANTS` | 371 | 20,2 % |
| `VERIFY` | 180 | 9,8 % |
| entête `AGENT` | 148 | 8,1 % |
| `REASON` | 78 | 4,3 % |
| `RECOVERY` | 71 | 3,9 % |
| `SCOPE` | 71 | 3,9 % |
| `CHANGE` | 70 | 3,8 % |
| `AUDIT` | 67 | 3,7 % |
| `STOP` | 44 | 2,4 % |
| **noyau** | **1 835** | |

Deux énoncés portent à eux seuls **30 % du noyau** : la puce `R1`–`R11` (389 jetons) et la
spécification `N1`/`N2`/`N3` (174). La moitié de l'arbre est hors du noyau : `# SKILLS`
= 1 464 jetons, chargés à la pertinence seulement.

Le fichier entier = 3 302 jetons, dont **651 (19,7 %) sont des littéraux** entre backticks
(chemins, énumérations, commandes, identifiants) et ~160 (4,8 %) du format (18 titres, 82
puces, lignes vides). Ces deux parts ne se réécrivent pas.

## 2. Le coût des symboles, mesuré

Chaque ligne est une mesure `o200k_base`, identique en `cl100k_base` sauf mention.

| forme | jetons | alternative | jetons | gain |
|---|---:|---|---:|---:|
| `a·b·c` | 5 | `a;b;c` | **3** | **−2** |
| ligne d'invariants réelle, `·` | 36 | même ligne, `;` | **33** | −3 |
| `x ≠ y` | 4 | `x != y` | **3** | −1 |
| `` `R1` `` dans une puce | +2 | `R1` | **+0** | −2 |
| `—` | 1 | `:` | 1 | 0 |
| `→` | 1 | `->` | 1 | 0 |
| `≥` | 3 | `>=` | 3 | 0 |

Le point médian `·`, que le contrat emploie 56 fois, coûte **deux jetons par séparateur en
contexte** : seule, la chaîne `·` vaut un jeton, mais entre deux mots le BPE ne la fusionne
pas, alors qu'il fusionne `a;`. Les backticks autour d'un simple numéro de règle coûtent un
jeton chacun. À l'inverse, `—`, `→`, `=>` et les flèches typographiques sont **gratuits**
par rapport à leurs équivalents ASCII : la prudence habituelle contre les glyphes était mal
dirigée, le coût est au point médian, pas à la flèche.

Ces quatre corrections appliquées à tout le fichier valent ~40 jetons, soit **1,2 %**. Ce
n'est pas là qu'est le gisement, mais c'est gratuit et sans perte sémantique.

## 3. L'essai de densité : `v13`, et son plafond

`candidat/v13.md` applique, sur la base de v12 déjà fusionnée : densité de phrase (articles,
copules, tournures « is a », « the agent » retirés), `;` au lieu de `·`, `!=` au lieu de `≠`,
backticks retirés des renvois `R`.

| | caractères | jetons o200k | noyau | skills |
|---|---:|---:|---:|---:|
| source | 14 181 | 3 302 | 1 835 | 1 464 |
| v13 | 13 742 | **3 197** | **1 768** | 1 426 |
| **gain** | **−439** | **−105 (−3,2 %)** | **−67 (−3,7 %)** | −38 |

Contrôle de couverture `source → v13` : 7 alertes, **les mêmes que pour v12**, toutes
expliquées (liste d'adjectifs retirée, fusions, redites). Aucune règle perdue.

**Trois méthodes indépendantes convergent vers quelques pour cent :**

1. v12, restructuration et fusions d'obligations : **0 jeton** gagné.
2. v13, densité et optimisation des symboles : **−3,2 %**.
3. Le plancher structurel : 19,7 % de littéraux + 4,8 % de format = **24,5 % intouchables**,
   et les 75 % restants sont des règles, pas des phrases. 82 obligations pour 3 302 jetons
   font 39 jetons par règle ; une règle minimale en coûte 10. L'écart n'est pas du gras, il
   est fait des listes fermées, des chemins, des énumérations de statuts et des renvois qui
   **sont** la substance de ces règles.

La sensibilité d'encodeur confirme que ce n'est pas un artefact : `cl100k` et `o200k`
diffèrent de +0,4 % sur ce fichier.

**Conclusion de la partie textuelle : le contrat est à son plancher de jetons.** On peut
encore lui prendre deux ou trois pour cent ; pas trente.

## 4. Le seul levier à grand chiffre : charger moins

Le fichier alimente quatre artefacts. `AGENTS.md` est chargé **à chaque tour** ; les trois
`SKILL.md` seulement à la pertinence. Ce qui coûte tous les tours, c'est le noyau.

| scénario | jetons chargés | part du noyau | différé |
|---|---:|---:|---:|
| noyau actuel | 1 835 | 100 % | 0 |
| moins `AUDIT`+`RECOVERY`+`STOP` | 1 653 | 90,1 % | 182 |
| noyau = entête + `INVARIANTS` + `SCOPE` + `OUTPUT` | **1 370** | **74,7 %** | 510 |
| index seul, sans `OUTPUT` | 1 055 | 57,5 % | 780 |

`OUTPUT` (780 jetons, 42,5 %) ne se diffère pas : il gouverne chaque réponse.

Le prix de ce levier est mesuré ailleurs, et il est lourd. Chez Vercel, un skill à
déclenchement automatique n'a **pas été invoqué dans 56 % des cas**, et le score ne bougeait
pas du niveau de base ([Vercel](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)).
La même évaluation donne le remède : une consigne explicite d'invoquer le skill fait monter
le déclenchement à **95 %+** et le score à 79 %. Autrement dit : différer sans instruction
explicite est un pari perdu une fois sur deux ; différer avec un déclencheur nommé dans le
noyau est le pattern qui a tenu.

Deux contre-feux de la littérature, tous deux mesurés : [Gloaguen et al.](https://arxiv.org/html/2602.11988v1)
trouvent qu'un fichier de contexte n'améliore pas en général la réussite et coûte ~20 %
d'inférence en plus ; et aucune étude ne montre qu'une même consigne écrite plus court est
mieux suivie. **Le bénéfice mesuré d'une compression porte donc sur le coût, jamais sur
l'application.** Quiconque présente un contrat plus court comme « mieux appliqué » affirme
sans preuve.

## 5. Le banc qui manquerait pour trancher

Il n'a pas été exécuté, et il ne pouvait pas l'être ici : **aucun accès à un modèle** depuis
cet espace de travail. Je ne peux pas produire une sortie d'agent, donc pas mesurer un taux
de violation. Le protocole, tel que la littérature le prescrit :

1. geler N scénarios et, pour chacun, le critère objectif de passage de chaque règle ;
2. passer les deux versions sur **les mêmes** scénarios, même modèle, même décodage, ordre
   contrebalancé ;
3. plusieurs générations par scénario, et **plus de scénarios plutôt que plus de répétitions** :
   à 80 % de puissance, détecter 3 points d'écart demande ~969 questions indépendantes
   ([Miller](https://arxiv.org/html/2411.00640v1)) ;
4. noter **règle par règle**, pas un score global ; vérificateurs déterministes quand la
   règle est objectivement vérifiable, juge validé sur labels humains sinon
   ([FollowBench](https://arxiv.org/html/2310.20410v3) : 88 % d'accord juge/humain contre
   85 % entre humains) ;
5. comparer en apparié : « la réécriture répare » contre « la réécriture casse ».

Une génération unique trompe : sur 105 problèmes et trois tirages, GPT-4 change de réponse
sur ~35 % des problèmes et un classement sur deux s'inverse ([Do Repetitions Matter?](https://arxiv.org/html/2509.24086v1)).

## 6. Ce que le relecteur doit décider, et ce que je recommande

| levier | gain mesuré | coût ou risque | recommandé |
|---|---:|---|---|
| v13 : densité + symboles | −105 jetons (−3,2 %) | perte de lisibilité, à évaluer | **oui**, c'est gratuit et sans perte de règle |
| `;` au lieu de `·`, `!=`, backticks | −40 jetons (1,2 %) | nul | **oui**, intégré à v13 |
| différer `AUDIT`+`RECOVERY`+`STOP` | −182 jetons du noyau (−9,9 %) | déclenchement non mesuré ici | à arbitrer |
| différer `REASON`+`VERIFY`+`CHANGE` en plus | −510 jetons (−27,8 %) | l'agent raisonne et vérifie à chaque tâche : ce sont les règles les plus fréquemment applicables | **non** en l'état |
| supprimer des règles | illimité | décision sémantique, pas technique | au relecteur |
| notation symbolique privée | annoncé −62 à −81 % | fidélité non soutenue, décodage payé | **non**, cf. §1.3 de `v12-analyse.md` |

Aucun de ces mouvements n'a de preuve d'améliorer l'application des règles. Le seul résultat
mesuré de toute la littérature consultée où une compression forte a tenu est celui d'un
**index** remplaçant du **matériau de référence recopié** : 40 Ko vers 8 Ko, 100 % de
réussite. Ce contrat ne recopie aucune référence. C'est la raison de fond pour laquelle il
n'y a pas de facteur 5 à aller chercher dans son texte.
