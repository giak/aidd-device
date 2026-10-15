# Cadre, méthode et audit du candidat v12

Ce fichier ne fait pas partie du contrat. Le contrat est
[`docs/contracts/AGENTS-source.md`](../AGENTS-source.md) ; le candidat est
[`candidat/v12.md`](v12.md) ; l'artefact chargé à chaque tour est `AGENTS.md`.

Ce document a été ouvert **avant** la première ligne du candidat : le cadre et les critères
d'acceptation ci-dessous précèdent la production, comme le contrat l'exige. Le reste du fichier a
été écrit après, et le dit là où il rapporte une mesure.

---

## 0. Cadre et critères d'acceptation (écrits avant le candidat)

**But.** Réduire le coût de `AGENTS-source.md` sans perdre une seule obligation, et sans introduire
une convention qu'aucune mesure ne soutient.

**Deux grandeurs distinctes, à ne jamais confondre.**

| grandeur | ce qu'elle coûte | ce que la recherche en dit |
|---|---|---|
| caractères | des jetons à chaque tour | aucune mesure établissant qu'une même règle écrite plus court est mieux suivie |
| obligations distinctes | une chance de moins d'être satisfaites toutes | mesuré : l'adhérence simultanée chute quand le nombre de contraintes monte |

C'est la seule raison de méthode qui compte ici : **la compression utile est au niveau de
l'obligation, pas de la phrase.** On fusionne deux énoncés du même devoir, on retire ce qui ne
commande rien ; on ne réécrit pas des phrases déjà denses.

**Critères d'acceptation, chacun falsifiable.**

| # | critère | ce qui le falsifie |
|---|---|---|
| A1 | Toute obligation de la source a une destination dans v12, prouvée par une matrice de couverture énoncé par énoncé | un énoncé source sans destination, ou dont le contenu est introuvable |
| A2 | `v12.md` est plus court que `AGENTS-source.md`, mesuré par `wc -c` | `v12.md` ≥ source |
| A3 | v12 porte **moins d'obligations distinctes** que la source (prouvé, §3) **et** que v11 (estimé seulement, §7) | un compte supérieur ou égal |
| A4 | Aucune obligation nouvelle : chaque puce de v12 remonte à au moins un énoncé source | une puce sans source |
| A5 | Zéro glyphe privé : aucun symbole dont le sens n'est pas déjà défini par la source | une convention à retenir qui n'existait pas |
| A6 | La frontière `# SKILLS` tient : les trois blocs `## 0N-…` restent un par skill, sans retouche | un bloc qui ne se projette plus sur son `SKILL.md` |
| A7 | Zéro contradiction interne, y compris celle déjà connue du tiret cadratin dans les skills | une règle qui interdit ce que le fichier fait |

**Hors périmètre.** `AGENTS-source.md` n'est pas modifié ; les quatre artefacts ne sont pas
réécrits ; aucun contrôle mécanique n'est committé (règle du dépôt : « no script, no hook, no CI by
default »).

**Opérations autorisées.** Trois, nommées d'après la méthode relevée dans le guide MCO (`C₁
simplify · C₂ merge · C₃ abstract`), et retenues selon la recherche :

* **C₁ simplifier** — retirer ce qui ne commande aucune action : justification, degré, adjectif sans
  test observable.
* **C₂ fusionner** — un devoir énoncé deux fois devient une puce, dans la formulation la plus
  forte. C'est la seule opération qui achète le critère A3.
* **C₃ abstraire** — **rejetée**. La recherche ne soutient pas qu'une notation privée définie une
  fois par son auteur se décode sans coût ; voir §1.

**Ce qui n'est pas une preuve.** Une taille plus petite ne prouve pas une meilleure application.
Aucun banc n'a été conduit ici : v12 est un candidat texte, au même titre que v11.

---

## 1. La veille

Quatre questions posées, quatre réponses qui ont effectivement changé une décision. Le reste de la
veille n'a rien changé et n'est pas rapporté ici.

### 1.1 Ce qui est mesuré : le nombre de contraintes, pas la longueur des phrases

| source | mesure | ce que j'en retiens |
|---|---|---|
| Harada et al., *When Instructions Multiply* — [2509.21051](https://arxiv.org/html/2509.21051v1) | même tâche, 1 à 10 contraintes vérifiables ; GPT-4o : 57,4 % (5 contraintes) → **21,3 %** (10). Sur StyleMBPP, « characters per line » : Gemini 1.5 Pro 99 % seule → **20 %** avec cinq autres ; Claude 3.5 Sonnet 97 % → **2 %** | l'unité de coût est la contrainte, pas le caractère |
| IFScale — [2507.11538](https://arxiv.org/html/2507.11538v1) | 10 à 500 instructions sur 20 modèles ; le meilleur plafonne à ~68 % à 500, et les premières de la liste sont mieux suivies | même conclusion ; **et** l'ordre compte |
| ScaledIF — [2510.14842](https://arxiv.org/html/2510.14842v1) | 2 → 10 instructions : Llama-3.3-70B 0,88 → 0,66 ; Mixtral 0,56 → 0,39 | la tension entre contraintes accompagne la chute |
| IHEval — [2502.08745](https://arxiv.org/html/2502.08745v1) | 3 538 exemples ; sur instructions en conflit, le meilleur modèle ouvert fait **48 %**, GPT-4o 70 % | deux règles contradictoires ne se départagent pas seules : une duplication qui diverge est un défaut, pas un renfort |

**Aucune** de ces sources n'établit qu'une même règle écrite plus court est mieux suivie. C'est le
résultat négatif qui a décidé la méthode : **v12 attaque le compte d'obligations, et rapporte sa
baisse de caractères comme un sous-produit non prouvé.**

### 1.2 Le seul cas public de compression forte d'un `AGENTS.md`

Vercel rapporte [avoir fait passer un index de documentation embarqué de ~40 Ko à 8 Ko (‑80 %) en
gardant 100 % de réussite](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)
sur son banc Next.js. La comparaison est instructive parce qu'elle **ne s'applique pas ici** : ce qui
a été retiré, c'est du *matériau de référence recopié dans le fichier*, remplacé par un lien vers la
documentation. Ce contrat ne recopie aucune référence : il ne contient que des règles. Il n'y a donc
pas d'index à remplacer, et la seule façon d'en retirer 80 % serait de supprimer les règles.

La même page porte l'avertissement qui a fait refuser le déménagement des sections vers un skill :
le skill à déclenchement automatique n'a **pas été invoqué dans 56 % des cas** de leur évaluation.
Anthropic recommande pourtant de déplacer procedures et règles locales hors du contexte permanent
([Claude Code, memory](https://code.claude.com/docs/en/memory)) — mais le gain n'est acquis que si
le matériel déplacé est effectivement chargé. Non mesuré ici : voir §6.

Deux travaux bornent le reste : Gloaguen et al., [*Evaluating AGENTS.md*](https://arxiv.org/html/2602.11988v1)
trouvent que les fichiers de contexte n'améliorent pas en général la réussite des tâches et
coûtent ~20 % d'inférence en plus ; Liu et al., [*Lost in the Middle*](https://arxiv.org/html/2307.03172),
mesurent la chute de performance quand l'information utile est au milieu d'un long contexte. Le
premier interdit de traiter ce contrat comme un gain automatique ; le second ne dit rien d'un fichier
d'un seul tenant de 8 Ko, lu en tête de contexte.

### 1.3 Le symbolique : pourquoi `C₃` est rejetée

| source | mesure | décision |
|---|---|---|
| MetaGlyph — [2601.07354](https://arxiv.org/html/2601.07354) (prépublication) | −62 à −81 % de jetons, mais équivalence sémantique très variable selon le modèle et l'opérateur : fidélité **0 %** pour la flèche de transformation, **faible** pour `∩` ; bouts de tâches de 50 à 200 instances | une notation privée se paie en décodage et se dégrade par opérateur |
| Symbol tuning — [2305.08298](https://arxiv.org/html/2305.08298) | des étiquettes arbitraires s'apprennent **par entraînement** (+11,1 points sur 11 tâches), pas par une définition dans le prompt | définir `Ω` une fois ne l'apprend pas au modèle |
| Chain-of-Symbol — [2305.10276](https://arxiv.org/html/2305.10276v7) | gains réels (31,8 % → 92,6 % en Brick World) **avec cinq démonstrations** qui servent de codebook | sans exemples, le symbole n'est pas décodé |
| LLMLingua-2 — [2403.12968](https://arxiv.org/html/2403.12968v2) | compression extractive 2 à 5× ; les auteurs nomment le mode d'échec : un qualificatif, une exception, un token critique peuvent disparaître | c'est exactement la perte que l'audit de v11 a mesurée six fois |

Conclusion, et c'est celle du guide MCO retournée contre lui : **un glyphe n'entre que s'il
n'apporte rien que la notation existante ne fasse déjà.** v12 n'en ajoute aucun (A5). Le seul
symbole introduit par v11, `WHEN`, est un mot, pas un glyphe : il se lit sans convention.

### 1.4 Comment on vérifie qu'un réécrit n'a rien perdu

La veille a fourni un protocole, et il a remplacé le contrôle par mots-clés utilisé plus tôt dans ce
dépôt (le journal de la séance 1 note ce contrôle-là comme **invalide** : six premiers mots comparés,
donc toute troncature passait). Retenu :

* matrice de couverture énoncé par énoncé, avec l'identifiant de la source, la force, la portée et la
  destination ([NASA, *Requirements Verification Matrix*](https://www.nasa.gov/reference/appendix-d-requirements-verification-matrix/)) ;
* vérification bidirectionnelle : source → réécrit **et** réécrit → source, pour attraper aussi
  l'ajout silencieux ;
* une anomalie de règle a quatre familles nommées : redondance, ambivalence, circularité, déficience
  ; et un rapport vide n'est **pas** une garantie
  ([IBM ODM, consistency checking](https://www.ibm.com/docs/en/odm/9.0.0?topic=analysis-consistency-checking)).
  C'est ce qui justifie de nommer explicitement « aucune anomalie trouvée » plutôt que « contrôle
  passé ».

## 2. Ce que v12 fait

**Huit fusions** — un devoir énoncé deux fois devient une puce.

| fusion | énoncés | destination |
|---|---|---|
| 1 | `S2` never expand scope + `S16`/`S17`/`S51` (execute only / no scope creep / produce only) | `SCOPE` 1 |
| 2 | `S2` + `S3` (improve materially / preserve behaviour) | `INVARIANTS` 2 |
| 3 | `S4` (no sycophancy…) + `R11` (`S49`) | `OUTPUT` `R11` |
| 4 | `S7` (double-check material) + `S25` (verify material claims) | `VERIFY` 1 |
| 5 | `S24` (smallest sufficient solution) + `S35` (smallest sufficient change) | `REASON` 4 |
| 6 | `S42` + `S43` (stop when… / never continue merely) | `STOP` 1 |
| 7 | `S45` + `S46` (no opener / no preamble) | `OUTPUT` 9 |
| 8 | `S8` (use only real capabilities, files, tests) + l'en-tête (never invent…) | en-tête ¶1 |

**Quatre suppressions**, chacune coûtée. Aucune ne supprime un devoir : ce sont des justifications,
des degrés ou une redite.

| supprimé | car. | pourquoi |
|---|---|---|
| `S1` : `pragmatic·efficient·robust·concise·precise·rigorous·meticulous·reliable` | −68 | aucun test observable ; la règle du contrat lui-même les efface. Ce ne sont pas des règles, ce sont des intentions |
| `S38` : « an uncommitted change is unfinished, so the request is part of consignment » | −77 | la justification **contredit** la règle qu'elle accompagne (« Never commit or push unless the user asks »). La contrainte reste intacte |
| `S40` : « Never invent missing information » | −35 | déjà dans l'en-tête ¶1 (« never invent a capability, an input, an evidence… ») |
| `S58` : « What the agent writes is a reconstruction, named as one » | −47 | redite mot pour mot de `R2`, et un skill n'est jamais chargé seul : `AGENTS.md` l'accompagne toujours |

**Trois réparations**, qui ne coûtent rien et sont des gains de compréhension.

* `S41` affirmait que l'absence de progrès est « the third condition of `STOP` » : les trois
  conditions de `STOP` portent sur la tâche, aucune ne mentionne le blocage. Renvoi faux supprimé,
  chaîne `NO_PROGRESS → STOP` conservée.
* `S48` interdisait le tiret cadratin **dans une puce qui en contient un**, et sa réserve (« a named
  format is not prose ») était circulaire. La règle dit maintenant son domaine ; v12 n'a plus un seul
  tiret cadratin en prose.
* `R7` à `R10` vivaient dans `OUTPUT` : ce sont des règles de raisonnement et de preuve, invisibles
  au moment du choix. `R7`·`R8`·`R9` sont en `REASON`, `R10` en `VERIFY`, avec un pointeur.

## 3. Matrice de couverture : 82 énoncés, 82 destinations

Contrôle fait à la main, énoncé par énoncé, parce que le contrôle automatique ne prouve rien (il
mesure une borne supérieure de recouvrement de jetons et produit des faux positifs). Les 7 seuls
alertés par le contrôle automatique sont expliqués après la table.

| source | destination dans v12 |
|---|---|
| en-tête | ¶1 (`S8` fusionné), ¶2 |
| `S1` | `INVARIANTS` 1 (8 adjectifs supprimés, §2) |
| `S2` `S3` | `INVARIANTS` 2 |
| `S4` | `OUTPUT` `R11` |
| `S5` | `VERIFY` 2 |
| `S6` | `INVARIANTS` 3 |
| `S7` | `VERIFY` 1 |
| `S8` | en-tête ¶1 |
| `S9` `S10` `S11` `S12` `S13` `S14` `S15` | `INVARIANTS` 4, 5, 6, 7, 8, 9, 10 |
| `S16` `S17` `S51` (1ʳᵉ phrase) | `SCOPE` 1 ; `S51` (2ᵉ phrase) → `OUTPUT` 13 |
| `S18` `S19` | `SCOPE` 2, 3 |
| `S20` `S21` `S22` `S23` `S24` | `REASON` 1, 2, 2, 3, 4 |
| `R7` `R8` `R9` | `REASON` 5, 6, 7 |
| `S25` `S26` `S27` `S28` `S29` `S30` | `VERIFY` 1, 3, 4, 5, 6, 7 |
| `R10` | `VERIFY` 8 |
| `S31` `S32` `S33` `S34` | `AUDIT` 1, 2, 3, 4 |
| `S35` | `REASON` 4 |
| `S36` `S37` `S38` | `CHANGE` 2, 3, 4 (justification de `S38` supprimée, §2) |
| `S53` | `CHANGE` 1 |
| `S39` `S40` `S41` | `RECOVERY` 1, 2, 3 (clause de `S40` supprimée, §2 ; `S41` réparé) |
| `S42` `S43` | `STOP` 1 |
| `R1` `R2` … `R6` `R11` | `OUTPUT` 1 … 5, 6 |
| `R7`–`R10` | pointeur `OUTPUT` 7 |
| `S44` | `OUTPUT` 8 |
| `S45` `S46` `S47` `S48` | `OUTPUT` 9, 9, 10, 11 (réparé) |
| `S50` `S51` `S52` | `OUTPUT` 12, 13, 14 |
| `S54` … `S63` | `CONSIGN` 1 … 10 (`S58` : redite supprimée, §2) |
| `S64` `S65` `S66` `S67` | `NAMING` 1, 2, 3, 4 |
| `S68` … `S75` | `MEMORY` 1 … 8 |
| `S76` … `S82` | `TERRITORY` 1 … 7 |

**Les sept alertes du contrôle automatique, et leur explication.** Le contrôle compare des ensembles
de jetons significatifs par puce ; il alerte sur `S1`, `S7`, `S8`, `S25`, `S38`, `S46` et `S49`.

* `S1` : les huit adjectifs sont bien absents, c'est la suppression assumée du §2.
* `S7` + `S25` : fusionnés en `VERIFY` 1 ; les mots de `S7` ont changé de forme (« double-check »
  disparaît au profit de « verify »), ce qui suffit à faire chuter le recouvrement.
* `S8` : déplacé dans l'en-tête, qui n'est pas une puce : le contrôle ne compare que des puces.
* `S38` : la justification est supprimée, la règle reste, à l'identique.
* `S46` : fusionné en `OUTPUT` 9 avec `S45` ; « no recap of visible changes » et « no menu of
  options » deviennent « no recap » et « no menu », ce qui suffit à faire chuter le recouvrement de
  jetons sans retirer la règle.
* `S49` : la puce de 1 393 caractères est éclatée en huit ; le contrôle lui cherche un seul
  correspondant et retombe sur `R4`. C'est le faux positif le plus net, et il illustre pourquoi il ne
  tient pas lieu de preuve.

Aucun énoncé source n'est sans destination.

## 4. Mesure

| | source | v11 | v12 | v12 − source | v12 − v11 |
|---|---|---|---|---|---|
| total (car.) | 14 181 | 14 382 | **13 988** | **−193 (−1,4 %)** | **−394 (−2,7 %)** |
| noyau (car.) | 7 916 | 8 117 | **7 791** | **−125 (−1,6 %)** | **−326 (−4,0 %)** |
| skills (car.) | 6 265 | 6 265 | **6 197** | −68 | −68 |
| puces `* ` | 82 | 92 | 83 | +1 | **−9** |
| obligations distinctes | 82 | 76–78 estimé (non recompté) | **70** | **−12** | non mesuré, voir §7 |
| tirets cadratins, dont prose | 13, dont 1 | 10, dont 5 | **5, dont 0** | — | — |
| contraintes perdues | — | instrument non valide | **0** (matrice §3) | — | — |

Lecture, et elle est inconfortable : **la compression réelle est de 1,4 %.** v11 coûtait +202
caractères de plus que la source (chiffre de [`v11-analyse.md`](v11-analyse.md) §4 ; +201 mesurés
ici sur le noyau), achetés par l'éclatement de la puce `R1`–`R11` et par ses réparations ; v12 garde
ce gain de lisibilité **et** le paie par les suppressions, ce qui la ramène 193 caractères sous la
source. La baisse de 2,7 % contre v11 est donc l'essentiel du chiffre, et de cette baisse je ne sais
nommer que trois parts : **−68** pour les skills (le seul endroit où v11 et v12 diffèrent hors noyau),
**−82** de contenu supprimé que v11 gardait (`S40`, `S58`) et **−24** de puces fusionnées (8 × 3).
Le reste, −220, est du resserrement de phrase, mesuré en bloc et non attribué pièce par pièce.

Ce qui **n'est pas** dans ce tableau : la mesure qui compterait, à savoir le taux de violation par
règle avant et après. Elle n'a pas été faite (§7).

## 5. Corrections apportées à v11 et à sa propre analyse

Trouvées en vérifiant, pas en relisant.

1. **Une fusion annoncée n'a pas eu lieu.** [`v11-analyse.md`](v11-analyse.md) §3 promettait
   « "double-check material claims" + "verify material claims" → une seule règle, VERIFY ». Mesure :
   `v11.md` lignes 20 et 50 portent toujours les deux. La table de §3 est juste pour 5 entrées sur 6,
   fausse pour celle-là.
2. **« em-dash en prose : 0 » est vrai du noyau, faux du fichier.** v11 conservait les skills
   intacts, et ceux-ci portent **5 tirets cadratins en prose** (lignes 121, 131, 133 deux fois, 148)
   alors que la règle `R4` réécrite les interdit. v12 les répare ; les 5 qui restent sont dans des
   formats typés (motif `## Séance N — …`, quatre listes de définitions), que la règle autorise
   explicitement.
3. **Le contrôle automatique de v11 n'est pas recevable.** Le journal de la séance 1 constate que
   comparer les six premiers mots d'une puce « laisse passer toute troncature ». La matrice §3
   remplace ce contrôle. Le contrôle par jetons a été conservé, mais étiqueté borne supérieure, et
   ses six alertes sont expliquées une par une — un rapport vide n'étant pas une garantie, un
   rapport non vide n'est pas non plus une preuve.

Ce que v11 apporte et que v12 garde : les 16 déclencheurs `WHEN`/`AFTER` en tête de puce, la
réparation du renvoi faux vers `STOP`, le déplacement de `R7`–`R10` vers leur section, le traitement
du tiret cadratin énonçant son domaine, et la suppression de la liste d'adjectifs.

## 6. Le levier restant, coûté, non pris

Aucun de ces mouvements n'est fait : chacun change la sémantique du contrat ou dépend d'un arbitrage
qui n'appartient pas à cette tâche.

| levier | gain mesuré | ce qu'il coûte |
|---|---|---|
| déplacer `REASON` + `AUDIT` + `RECOVERY` (1 035 car., 13 % du noyau) dans un skill chargé au moment du raisonnement | −13 % du noyau, chaque tour | Vercel mesure qu'un skill à déclenchement automatique n'est pas invoqué 56 % du temps. Déplacer, c'est parier que le chargeur fait mieux que le banc de Vercel |
| supprimer la numérotation `R1`–`R11` avec son pointeur | −96 car. | `DECISIONS.md` ADR-009 nomme « onze règles R1–R11 » : le numéro a un référent hors du fichier |
| éclater `OUTPUT` (2 987 car., 38 % du noyau) | aucune mesure disponible | c'est la section la plus dense en listes fermées (`RESULT · KEY_EVIDENCE · …`, `R8`, `R9`, statuts) : la seule façon de la réduire est d'y supprimer des règles |
| accepter la liste d'adjectifs de `S1` | +68 car. | reprise assumée du `C₁` ; l'analyse de v11 la proposait déjà à ce prix |
| porter le contrat en notation symbolique (`C₃`) | −62 à −81 % de jetons annoncés | §1.3 : équivalence non soutenue, fidélité 0 % pour un opérateur mesuré, et l'apprentissage d'une notation exige un entraînement, pas une définition |

## 7. Ce qui n'est pas établi

* **Aucune mesure d'application.** Rien ici n'établit qu'une contrainte soit mieux respectée dans
  v12 que dans la source. La seule raison de placer un déclencheur avant son action reste une raison
  de lecture : la recherche ne fournit aucune expérience sur la position d'une condition dans une
  puce de contrat, et v11 l'avait déjà écrit.
* **La prémisse de la suppression `S58`.** Elle suppose que `AGENTS.md` est chargé à chaque tour avec
  le skill demandé. C'est ce que dit [`contracts/README.md`](../README.md) et c'est le comportement
  documenté des chargeurs, mais je ne l'ai pas mesuré ici. Si un skill était chargé seul, cette
  suppression retire un énoncé de son seul domicile.
* **Le gain réel de 1,4 % vaut ce que vaut une mesure de caractères.** Il ne dit rien de la
  qualité, et le §1.1 donne la raison de ne pas le présenter comme un gain d'application.
* **Aucun banc n'a été conduit.** Le banc qui trancherait : mêmes scénarios, deux contrats, N
  répétitions, taux de violation par règle, comparaison des intervalles. Non fait, ici comme en v11.
* **Le compte d'obligations de v11 n'a pas été recompté.** Le contrôle par jetons ne lui trouve aucun
  énoncé source orphelin (4 alertes, toutes expliquées), donc v11 porte les 82 obligations ; mais son
  propre §3 annonce six fusions dont une est contredite par le fichier, et l'énoncé `S51`
  « Produce only what the task requires » n'y a plus de domicile. Son compte réel se situe donc entre
  76 et 78 **par estimation, non par matrice**. Le critère A3 n'est prouvé que contre la source :
  contre v11, il reste une inférence.

**Reste à faire** : le relecteur tranche `v12` contre `v11` et contre la source ; puis, si un
candidat est retenu, les quatre artefacts sont réécrits à la main et la séance est consignée au
journal.
