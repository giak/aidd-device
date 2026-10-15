---
name: Relecture énoncé par énoncé du contrat appliqué
description: Audit du texte appliqué contre la source d'avant application, énoncé par énoncé, avec les écarts que les trois analyses antérieures n'avaient pas vus
type: audit
status: done
---

# Relecture du contrat appliqué, énoncé par énoncé

Ce fichier ne fait pas partie du contrat. Il audite le texte appliqué le 2026-10-15 et ne modifie
rien.

---

## 0. Ce que cette relecture est, et ce qu'elle n'est pas

**Ce qu'elle n'est pas : indépendante.** L'agent qui a écrit ces lignes est celui qui a appliqué
`candidat/v13.md` et rédigé la veille du même soir. Aucun second relecteur n'existe ici : la règle
du contrat s'applique à elle-même, cette revue est interne et le dit. Ce qui la rend utile n'est pas
une prétention d'indépendance, c'est qu'elle cherche à **falsifier** la conclusion d'aucune perte, et
rapporte ce qu'elle trouve contre elle.

**La question.** Les 82 énoncés de la source d'avant application ont-ils tous une destination dans
le texte appliqué, et quels énoncés sont ambigus ou sans domicile ?

**Critères.** R1 : tout écart est cité par sa ligne, jamais résumé. R2 : un énoncé est « conservé »
seulement si son devoir, son déclencheur et ses objets survivent. R3 : un énoncé supprimé l'est pour
une raison vérifiable, pas pour une raison affirmée. R4 : ce que la relecture ne peut pas trancher
est écrit `OPEN`.

---

## 1. Méthode et surface

Le texte d'avant application n'existe plus dans le dépôt : la source a été remplacée en place le
même soir, et « la copie perd ». Il a donc été **reconstruit**, et la reconstruction est prouvée :

1. le noyau vient de la partition du texte d'alors (`/tmp/core_now.txt`, conservé le 2026-10-15
   à 21:59 par `partition('\n# SKILLS\n')`) ;
2. les trois blocs viennent des artefacts d'alors (`/tmp/before/*.SKILL.md`, copiés à 22:00 avant
   l'écriture), le paragraphe de tête étant repris de `candidat/v12.md`, qui l'a conservé ;
3. contrôle : le rendeur (`/tmp/render.py`) appliqué à la reconstruction reproduit les **quatre**
   anciens artefacts octet pour octet (`cmp`, exit 0 sur `AGENTS.md` et les trois `SKILL.md`) ;
4. la reconstruction fait **14 181 caractères**, exactement la taille mesurée de la source avant
   application.

Limite nommée : le paragraphe de tête du bloc `# SKILLS` vient de v12, sa fidélité à l'octet n'est
pas prouvée ; il ne porte aucun énoncé.

**Surface d'audit.** `diff -u` des deux textes : **229 lignes**, lues en entier. 82 puces avant,
83 après. 30 puces ont la même suite de mots (seuls séparateurs, ponctuation et backticks changent),
52 ont des mots modifiés : la revue porte sur ces 52, une par une.

---

## 2. Les cinq classes d'écart, et leur compte

Les 82 puces source se partitionnent en deux, et c'est mesuré :

| classe | puces source | vérification |
|---|---:|---|
| même suite de mots (`·`→`;`, `≠`→`!=`, backticks retirés des renvois `R`, retour à la ligne) | **30** | listes de mots identiques, dans le même ordre |
| mots modifiés | **52** | 30 + 52 = 82 |

Dans les 52, les catégories se recouvrent, un même énoncé pouvant être resserré **et** fusionné :

| opération | énoncés touchés | où |
|---|---:|---|
| resserrement sans perte de devoir, de déclencheur ou d'objet | les 52 | diff, ligne à ligne |
| fusion de deux énoncés d'un même devoir | 11 | les 8 fusions de v12 |
| déplacement vers la section de l'objet | 6 | `R7`–`R10`, `S8`, le squelette de séance |
| suppression assumée | 4 | `S1` (adjectifs), `S38` (justification), `S40`, `S58` |
| réparation d'un défaut du texte | 6 | les réparations de v11 |
| ajout sans source | 1 | le pointeur `R7;R8;R9 …` |

Les huit fusions de v12 et les six réparations de v11 se retrouvent dans le texte appliqué : `S2` +
`S16`/`S17`/`S51` dans `SCOPE` 1, `S2` + `S3` dans `INVARIANTS` 2, `S4` + `R11` dans `OUTPUT`, `S7` +
`S25` dans `VERIFY` 1, `S24` + `S35` dans `REASON` 4, `S42` + `S43` dans `STOP`, `S45` + `S46` dans
`OUTPUT`, `S8` dans l'en-tête ¶1. Les réparations sont présentes : renvoi faux de `NO_PROGRESS`
corrigé, cadratin énonçant son domaine, `R7`–`R10` rendus à leur section, liste d'adjectifs
retirée, justification de `S38` retirée, `S58` retirée.

---

## 3. Les neuf trouvailles

Les trois analyses antérieures n'en annonçaient aucune. Deux touchent un critère de la relecture
(R2, R3) ; les autres sont des observations.

### F1. « merely » a disparu, sans être consigné nulle part

| | |
|---|---|
| avant | `Never **merely** describe, simulate or claim compliance` |
| après | `Never describe, simulate or claim compliance` |
| qui | `grep -o "merely describe"` présent dans `v11.md`, absent de `v12.md` et `v13.md` : **v12** l'a retiré |
| documenté | non : aucune des trois analyses ne le mentionne |

Effet : la prohibition passe de « ne pas se contenter de décrire » à « ne pas décrire ». La seconde
lecture est plus stricte, et elle peut se heurter au devoir de réponse. Matérialité **faible**,
direction non documentée. Réparation : un mot, `Never merely describe, …` (+1 jeton).

### F2. « Never invent missing information » : supprimé, puis justifié par une prémisse fausse

| | |
|---|---|
| avant | `RECOVERY` : `Missing data, capability or unresolved conflict → best effort + explicit limits. **Never invent missing information.**` |
| après | `Data, a capability or an unresolved conflict missing → best effort + explicit limits.` |
| qui | `grep` : absent de `v11.md`, `v12.md` et `v13.md` : **v11** l'a retiré, en silence |
| documenté | au tour suivant seulement, par `v12-analyse.md` §2 : « déjà dans l'en-tête ¶1 (`never invent a capability, an input, an evidence…`) » |

La prémisse ne tient pas telle qu'écrite : l'en-tête ¶1 est une **énumération fermée** (une
capacité, une entrée, une preuve, une source, un outil, un fichier, un test, un résultat, une
exécution, une vérification), où une *information* n'a pas de place. Le devoir ne survit donc que
par une adresse indirecte : `OUTPUT` `R11` porte « no fabrication », dans une section qui parle de
forme de réponse et non de discipline probatoire. Matérialité **modérée**, c'est la seule trouvaille
qui appelle une décision. Réparation : rendre la phrase, ou acter que `R11` couvre (+7 à 8 jetons).

### F3. « la capacité requise est disponible » est devenue « la capacité existe »

| | |
|---|---|
| avant | `VERIFY` : `Verify material claims whenever the required capability is **available** and verification could affect the result.` |
| après | `Claim, decision or change material, **capability exists**, verification could affect the result → verify it.` |
| qui | présent dans `v11.md` dès l'origine : **v11** |
| documenté | à contresens : `v11-analyse.md` §1 revendique d'avoir « rendu » la condition, mot d'origine `available` |

« Existe » est plus faible que « est disponible » : un outil peut exister et être hors service, ce
que ce dépôt a mesuré le 2026-10-15 (`MNEMO_UNAVAILABLE`). Matérialité **faible**, mais l'écart est
réel et l'analyse affirme le contraire. Réparation : `whenever the capability is available` (+2).

### F4. « decorative » qualifie maintenant l'emoji aussi

| | |
|---|---|
| avant | `No decorative table, emoji or em-dash in prose; a named format is not prose.` |
| après | `No decorative table or emoji. No em-dash in prose: …` |
| qui | v13 |

Le qualificatif, qui portait sur « table », porte désormais sur « emoji » aussi, ce qui autorise un
emoji non décoratif. Un tel objet n'existe pas dans un rapport d'agent : matérialité **nulle**,
consignée pour être complète.

### F5. Le devoir d'honnêteté a changé de domicile

`No sycophancy·no fabrication·absolute honesty·forensic truth` était en `INVARIANTS` ; il vit
désormais dans `OUTPUT` `R11`, avec `flattery`, `agreement-seeking` et `restating`. Contenu intact.
Observation : par la logique qui a fait déplacer `R7`–`R10` vers `REASON` et `VERIFY` (une règle vit
dans la section de son objet), l'honnêteté est un invariant, pas une règle de forme. Matérialité
**faible**, aucun énoncé perdu.

### F6. « Triage : » a disparu, la règle de tri reste

`Three levels, **chosen by triage**` puis `Triage: a non-trivial claim …` deviennent
`Three levels, **by triage**` et la règle sans son intitulé. Matérialité **nulle**.

### F7. Le pointeur `R7;R8;R9 …` est le seul énoncé sans source

`* R7;R8;R9 govern reasoning, R10 evidence: see REASON and VERIFY.` n'a pas d'équivalent source :
c'est l'ajout assumé qui accompagne le déplacement de `R7`–`R10`. Il n'est pas une règle nouvelle,
c'est un index. Matérialité **nulle**, conforme à l'exigence d'un domicile unique par règle.

### F8. La justification de `S38` est retirée, et son « pourquoi » vit ailleurs

`Never commit or push unless the user asks: an uncommitted change is unfinished, so the request is
part of consignment.` devient la seule obligation, la justification tombant. Ce n'est pas une perte
sèche : `v12-analyse.md` §2 porte la raison du retrait, et la norme d'exigence veut une *rationale*
séparée de la clause. Matérialité **nulle**. Deux notes : le motif invoqué par v12 (la justification
contredit la règle) est vérifiable dans le texte ; et aucune contradiction de devoir ne subsiste avec
`CONSIGN`, « Only committed documents outlive memory » s'énonçant comme un fait, pas comme un ordre.

### F9. `S58` a quitté `01-consign` pour `R2`, et ce domicile tient ici

`What the agent writes is a reconstruction, named as one` a disparu du bloc `01-consign` ; `OUTPUT`
`R2` porte `what the agent writes is a reconstruction, never a source`, donc plus strict que ce qui a
été retiré. Documenté par `v12-analyse.md` §2, prémisse comprise : `AGENTS.md` accompagne toujours le
skill chargé. Cette prémisse est vraie dans ce dépôt, où le noyau est le fichier lu à chaque tour, et
`v12-analyse.md` §7 la range explicitement dans ce qui n'est pas établi. Matérialité **nulle** ici ; à
surveiller si un artefact venait à se charger seul.

---

## 4. Verdict

**Adoption : maintenue.** Sur 82 énoncés, aucun devoir n'est perdu : 30 conservent leur suite de
mots, 52 sont remaniés sans perte relevée de devoir, de déclencheur ou d'objet, dont 11 touchés par
une fusion, 6 par un déplacement, 4 par une suppression justifiée dans le texte et 6 par une
réparation ; 1 ajout est un index. Aucune obligation nouvelle, aucune
transformation de modal (jamais, toujours, seulement) que la revue ait relevée.

**Réserves, par ordre de poids.**

1. `F2` : une obligation (« never invent missing information ») n'a qu'un domicile indirect, et la
   justification écrite de sa suppression est fausse. Décision à prendre : rendre la phrase, laisser
   `R11` la porter en le disant, ou écrire la règle ailleurs.
2. `F1` et `F3` : deux micro-déplacements non consignés, l'un plus strict (`merely`), l'autre plus
   faible (`exists` au lieu de `available`). Réparation ensemble : +3 jetons sur 3 197.
3. `F5` : observation de placement, sans conséquence démontrable.

**Ce qui falsifierait ce verdict.** Trois choses, et elles sont mesurables plus tard : un énoncé de
la source reconstruite qui ne serait ni dans le texte appliqué ni dans les quatre suppressions ; une
reconstruction infidèle, ce que seul un accès à la source d'origine pourrait établir ; ou une
définition de « devoir conservé » plus stricte que la mienne, qui compterait un déclencheur reformulé
comme une perte, ce qui ferait tomber sous réserve une part des 42 resserrements.

---

## 5. Limites

* **Relecture interne**, pas indépendante : même agent, même soir, et la conclusion qui la précède
  (aucune perte) n'est pas une preuve de sa propre justesse.
* **La source d'origine n'existe plus** : la reconstruction est prouvée par le rendeur et par la
  taille, pas par une comparaison à l'original disparu. Une seule pièce échappe à cette preuve, le
  paragraphe de tête du bloc `# SKILLS`, qui ne porte aucun énoncé.
* **Aucune mesure d'application** : rien ici ne dit qu'une règle est mieux respectée après
  application. C'est un audit de conservation de texte, pas de comportement.
* **`OPEN`** : le compte de 82 énoncés est celui de v12, repris tel quel ; la reconstruction en
  compte bien 82 puces, mais les énoncés à l'intérieur d'une même puce (le squelette de séance,
  l'énumération de `R9`) n'ont pas été décomptés un à un ici, la revue les ayant traités comme un
  bloc.
