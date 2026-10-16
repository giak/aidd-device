---
name: Delta de v13 contre l'état d'avant application
description: Comparaison du contrat appliqué avec l'état pré-v13 retrouvé dans git, règle par règle, avec les gains, les pertes, les régressions, et la correction de la prémisse de la relecture du 2026-10-15-220849
type: audit
status: done
---

# v13 contre l'état d'avant application

Ce fichier ne fait pas partie du contrat. Il compare l'état appliqué à celui qu'il remplace et ne
modifie rien.

---

## 1. Ce que ce document corrige d'abord

La relecture du 2026-10-15-220849 s'ouvre sur cette prémisse :

> Le texte d'avant application n'existe plus dans le dépôt : la source a été remplacée en place le
> même soir, et « la copie perd ». Il a donc été **reconstruit** […]

**Elle est fausse.** L'état d'avant application est dans git, dans le commit `3b54711` (« Freebuff:
Cloud's files for chat dfe8952d-8775-4c41-93ff-c252ae57b05f », 2026-10-15T20:54:23+02:00), une
branche latérale conservée dans le magasin d'objets : il y porte `AGENTS-source.md` (164 lignes,
14 181 caractères) **et** les quatre artefacts qu'elle rend. La reconstruction n'était pas
nécessaire, et cette comparaison-ci ne repose pas sur elle.

Trois mesures concordent avec celles faites localement avant d'écrire :

| mesure de la source d'avant application | valeur |
|---|---|
| caractères (`wc -m`) | 14 181 |
| jetons `o200k` | 3 302 |
| puces de premier niveau | 82 |

et `3b54711` la rend à l'octet dans ses propres artefacts (noyau identique, trois blocs
identiques). Que ce soit **la copie locale elle-même** reste `SUPPOSÉ` : l'original local a été
écrasé le 2026-10-15 à 22:00:38, aucun `cmp` ne peut plus le prouver, et trois mesures égales ne
valent pas une identité.

**Anomalie non résolue.** La relecture annonçait un `diff -u` de **229 lignes** ; le même diff, sur
la base de `3b54711`, en fait **211**. Je ne sais pas d'où viennent les 18 lignes d'écart : la
reconstruction d'alors n'existe plus, le paragraphe de tête de `# SKILLS` de `3b54711` est
identique à celui de `candidat/v12.md`, et rien d'autre n'explique la différence. Le compte de 229
est donc à retirer, remplacé par 211 mesuré ici ; la conclusion d'aucun devoir perdu n'en dépend
pas, elle est revérifiée ci-dessous sur la base durable.

---

## 2. L'état appliqué est bien v13, et les artefacts sont en phase

Établi ce soir, sur l'arbre courant :

| contrôle | commande | résultat |
|---|---|---|
| v13 est la source appliquée | `cmp candidat/v13.md AGENTS-source.md` | identiques |
| le noyau de la source est `AGENTS.md` | `sed -n '1,/^# SKILLS$/p' … \| head -n -2` puis `diff` | muet |
| chaque bloc est son `SKILL.md` | extraction, `###`→`##`, hors frontmatter | trois muets |
| la `description` est la phrase de tête | comparaison littérale | trois « identique » |
| rien de local ne dérive du commit `12ad625` | `git status --porcelain -- AGENTS.md .agents docs/contracts` | vide avant l'écriture de ce document ; depuis, seuls `README.md` et ce fichier y apparaissent, non commités |

Les trois `name` et `description` de frontmatter sont **identiques** à ceux d'avant application
(les diffs des skills commencent à la ligne 4) : aucun déclencheur de skill n'a bougé.

---

## 3. Les gains

**Densité, mesurée.** Les cinq fichiers passent de 6 564 à 6 354 jetons `o200k` (−210, −3,2 %) ;
le noyau, repayé à chaque appel, de 1 835 à 1 768 (−67, −3,7 %) ; les skills de 1 427 à 1 389. Coût
réel d'une session, mesuré à part : 1 768 jetons par appel, 0,169 % d'une fenêtre client de
1 048 576.

**Des règles devenues adressables.** `R7`, `R8`, `R9` et `R10` vivaient au milieu d'une puce
compacte d'`OUTPUT` ; ils ont leur propre puce dans la section qui les gouverne (`REASON`, `VERIFY`),
et `OUTPUT` les cite par leur nom :

> * R7;R8;R9 govern reasoning, R10 evidence: see REASON and VERIFY.

**Le devoir de production remis à sa place.** « No production before a written spec: brainstorm →
design doc → approved → only then code. » était la *dernière* puce du fichier, après « Prose under
`docs/` is French ». Elle ouvre maintenant `CHANGE`, où un agent la cherche.

**Une contradiction réparée.** « `NO_PROGRESS → STOP`: a stall without a changed premise is the
third condition of `STOP`. » contredisait la liste de `STOP`, qui en énumère trois autres. Le texte
appliqué dit : « a stall without a changed premise ends the attempt. Not a condition of `STOP`,
which judges the task, not the loop. »

**L'en-tête élargi.** « never invent capability, input, evidence, source, tool result, execution or
verification » devient « never invent a capability, an input, an evidence, a source, a tool, a file,
a test, a result, an execution or a verification: use only real ones ». Trois objets gagnés (fichier,
test, résultat) et une clôture explicite. « never execute an inapplicable rule » devient « never
apply a rule whose condition does not hold » : le critère est nommé au lieu d'être qualifié.

**`R4` et la ponctuation décorative, précisés.** « concision is demanded and never uniform » devient
« concision in chat, prose in docs and code: chat telegraphic, fragments over sentences, fewest
words, cut any word that does not change meaning » ; et « a named format is not prose » devient
« A typed list or a named block is a format, not prose, and keeps its own separators » — le cas des
séparateurs internes est tranché.

**Forme plus courte à devoir égal, dans les skills.** « The seconds hold the property: at minute
resolution… » devient « Seconds, not minutes: at minute resolution… » ; « the protocol that
establishes » devient « the protocol establishing » ; « and are never merged » devient « never
merged ». Séparateurs `·`, `—` et `≠` remplacés par `;`, `:` et `!=`.

---

## 4. Les pertes : un devoir qui n'a plus de domicile

**`F2` — « Never invent missing information ».**
`RECOVERY` portait : « Missing data, capability or unresolved conflict → best effort + explicit
limits. **Never invent missing information.** » Le texte appliqué garde la première phrase et perd la
seconde. Son seul domicile devient indirect, `OUTPUT` `R11` « no fabrication ». La relecture du
220849 avait déjà nommé ce cas et la justification écrite qui l'accompagnait reposait sur une
prémisse fausse (« déjà dans l'en-tête ¶1 »). **Rien de nouveau, mais rien de réparé.**

**`F8` — la justification du commit.**
« Never commit or push unless the user asks: an uncommitted change is unfinished, so the request is
part of consignment. » Le texte appliqué garde l'ordre et retire le « pourquoi ». Le lien entre
committer et consigner ne survit qu'à distance, par `CONSIGN` « Only committed documents outlive
memory ».

**Nouveau — huit qualités d'`INVARIANTS`.**
« `KISS`·`DRY`·`YAGNI`·no overengineering·**pragmatic·efficient·robust·concise·precise·rigorous·
meticulous·reliable**. » Les quatre premiers survivent ; les huit adjectifs disparaissent. Domicile
trouvé pour deux : « concise » → `R4` ; « robust » → `R8` (critère `ROBUSTNESS`). Restent
**pragmatic, efficient, precise, rigorous, meticulous, reliable** : six termes de qualité sans
aucun domicile dans le texte appliqué. Ce n'est pas un devoir perdu — aucune de ces six qualités
n'énonçait une obligation vérifiable — mais c'est le vocabulaire dans lequel le contrat se
décrivait, retiré sans être consigné par aucune des trois analyses.

**Nouveau — « named as one ».**
`CONSIGN` portait : « What the agent writes is a reconstruction, **named as one**; the source is the
machine… ». Le texte appliqué le déplace en `R2` (« what the agent writes is a reconstruction, never
a source ») et perd la contrainte de nommage : dire qu'une reconstruction en est une. Le déplacement
était connu, la nuance perdue ne l'était pas.

---

## 5. Les régressions : devoir affaibli, ou forme cassée

**`F1` — « Never merely describe » → « Never describe ».**
L'adverbe tombe. La seconde lecture est plus large : elle interdit aussi la description, pas
seulement la description *tenue pour* de la conformité. Elle entre en tension avec `R4`, qui exige
« prose in docs and code ». Aucune des trois analyses de campagne (`v11-analyse.md`,
`v12-analyse.md`, `v13-analyse.md`) ne l'avait consigné ; c'est la relecture du 220849 qui l'a
nommé.

**`F3` — « the required capability is available » → « capability exists ».**
Deux conditions différentes : une capacité peut exister sans être disponible à cet agent, dans ce
dépôt, à ce tour. La seconde formulation est plus faible que la première, et
`candidat/v11-analyse.md` §1 revendiquait pourtant avoir rendu cette condition. Le texte appliqué
est de plus un fragment sans verbe : « Claim, decision or change material, capability exists,
verification could affect the result → verify it. »

**Nouveau — la règle des règles floues perd son verbe.**
`INVARIANTS` portait : « A rule stated in this file that is neither clear nor specific is deleted,
never interpreted. » Le texte appliqué dit : « **A rule here neither clear nor specific is deleted,
never interpreted.** » Il manque « that is » : la phrase est agrammaticale. C'est la règle d'ADR-010,
celle qui décide de l'effacement des règles obscures ; elle se lit maintenant sur deux niveaux. Le
déplacement de « in this file » vers « here » élargit en outre sa portée sans le dire.

**Nouveau — trois affaiblissements de forme, matière nulle.**
« check whether an existing one **already** covers » → « covers » ; « Merge into the stronger
**one** » → « the stronger » ; « the format **it happens to use** » → « the format ». Les deux
premiers sont des pertes de précision négligeables ; le troisième est plus strict que l'original,
qui n'interdisait que le nom tiré du mécanisme effectivement employé.

---

## 6. Les déplacements : aucun devoir perdu, domicile changé

Revérifiés sur la base durable, un par un, dans les cinq diffs lus en entier :

| énoncé d'avant | domicile dans le texte appliqué |
|---|---|
| « never expand scope » (`INVARIANTS`) | `SCOPE` « No scope creep » |
| « Use only real capabilities, sources, tools, files, tests. » | en-tête « use only real ones » |
| « Double-check material claims, decisions and changes… » | `VERIFY` ¶1 |
| « The user can be wrong: verify their claim… » | `VERIFY` ¶2 |
| « No sycophancy·no fabrication·absolute honesty·forensic truth. » | `OUTPUT` `R11`, élargi |
| « Before modifying, read what is necessary… » (`CHANGE`) | `REASON` ¶3 |
| « Produce only what the task requires. » (`OUTPUT`) | `SCOPE` ¶1 |
| « Never continue merely because… » (`STOP` ¶2) | fusionné dans la puce `STOP` |
| « A séance entry… » ponctuation `·` → `;` (`CONSIGN`) | même puce, séparateurs seuls |

Aucun de ces neuf énoncés ne perd son devoir : la relecture du 220849 concluait « aucun devoir
perdu sur 82 énoncés », et cette comparaison sur une base git ne la contredit pas.

---

## 7. Mesures, avant → après

| fichier | caractères | jetons `o200k` | Δ jetons |
|---|---|---|---|
| `AGENTS-source.md` (la source entière) | 14 181 → 13 742 | 3 302 → 3 197 | −105 |
| `AGENTS.md` (le noyau, repayé à chaque appel) | 7 915 → 7 592 | **1 835 → 1 768** | **−67** |
| `01-consign/SKILL.md` | 3 500 → 3 405 | 832 → 802 | −30 |
| `02-memory/SKILL.md` | 1 388 → 1 375 | 300 → 294 | −6 |
| `03-boundaries/SKILL.md` | 1 313 → 1 305 | 295 → 293 | −2 |
| total des cinq | 28 297 → 27 419 | 6 564 → 6 354 | −210 |

---

## 8. Limites

* L'identité de `3b54711` avec la copie locale d'avant application est `SUPPOSÉ` : trois mesures
  concordantes (caractères, jetons, puces) et un rendu cohérent, pas un `cmp`.
* `3b54711` n'est pas un ancêtre de `HEAD` : il est tenu par une seule référence locale,
  `freebuff/landing/dfe8952d-8775-4c41-93ff-c252ae57b05f/cloud`, créée par le client. Si cette
  référence disparaît, la base de cette comparaison devient inaccessible : elle n'est pas un
  document, elle est une branche.
* Audit de conservation de texte, jamais de comportement : rien ici ne dit qu'une règle est mieux
  appliquée après qu'avant.
* Le décompte à l'intérieur d'une puce (énumérations de `R9`, squelette de séance) traite la puce
  comme un bloc, pas énoncé par énoncé.
* L'anomalie des 229 contre 211 lignes reste `OPEN`.

---

## 9. Ce que ce document laisse à décider

Quatre réparations, chiffrées au jeton `o200k`, sur 1 768 de noyau :

1. **`F2`** — rendre « Never invent missing information. » : **+5 jetons**, ou acter que `R11` le
   porte en le disant.
2. **Le verbe manquant** — « A rule here **that is** neither clear nor specific… » : **+2 jetons**.
3. **`F1`** — « Never **merely** describe » : **+1 jeton**.
4. **`F3`** — « capability **is available** » au lieu de « capability exists » : **+1 jeton**.

Total **+9 jetons**, soit 1 777 au lieu de 1 768 : 0,51 % de plus, pour retirer une perte, une
agrammaticalité et deux affaiblissements. À comparer au gain de la campagne, 67 jetons.

Les six qualités retirées ne se réparent pas de la même façon : les réintroduire coûte **18 jetons**
(mesuré sur `·pragmatic·efficient·precise·rigorous·meticulous·reliable`, et revérifié sur le fichier
entier) pour un gain qui n'est pas un devoir, et leur place est peut-être dans le `# AGENT` de tête
plutôt que dans `INVARIANTS`.

**Rectification (contrôle du 2026-10-16).** Deux des quatre chiffres ci-dessus ne se reproduisent
pas. Rejoués en appliquant réellement chaque réparation à une copie d'`AGENTS.md`, puis en comptant
le fichier entier en `o200k` : `F2` **+5**, « that is » **+2**, `F1` **+1**, `F3` **+1**,
**total +9** (1 777, 0,51 %). Les valeurs publiées avant ce contrôle — « +3 » pour le verbe et pour
`F1`, « +12 / 1 780 / 0,68 % » au total — sont fausses et remplacées ici. Même faute de compte sur
la ligne d'`INVARIANTS` : elle porte **huit** adjectifs, non neuf, donc **six** sans domicile, non
sept. La conclusion ne bouge pas : la réparation coûte moins que le gain de la campagne, et trois
jetons de moins que ce que ce paragraphe annonçait.
