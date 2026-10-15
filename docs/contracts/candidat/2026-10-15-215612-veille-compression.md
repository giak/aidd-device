---
name: Veille et arbitrage de compression du contrat
description: Ce que la veille du 2026-10-15 change aux candidats v11, v12 et v13, l'état du contrat mesuré au jeton, et les leviers restants avec leur prix
type: veille
status: done
---

# Veille et arbitrage : compresser le contrat après v13

Ce fichier ne fait pas partie du contrat. Il ne change aucune règle et ne produit aucun candidat :
il mesure l'état, rapporte ce que la veille change aux analyses v11, v12 et v13, et chiffre les
leviers restants pour que le relecteur tranche.

Les trois analyses antérieures sont supposées lues : [v11-analyse](v11-analyse.md),
[v12-analyse](v12-analyse.md), [v13-analyse](v13-analyse.md).

---

## 0. Question et critères, écrits avant les mesures

**Question.** Sur `AGENTS-source.md`, quelle opération de compression reste disponible, et à quel
prix prouvé ?

**Critères falsifiables.** C1 : toute affirmation de coût porte la commande qui l'établit. C2 :
toute source citée est primaire, et son URL a été lue. C3 : une grandeur annoncée en jetons est
mesurée par un encodeur nommé, jamais déduite des caractères. C4 : ce qui n'est pas mesuré est
écrit comme non mesuré. C5 : aucune règle du contrat n'est modifiée par ce document.

**Hors périmètre.** `AGENTS-source.md`, `AGENTS.md` et les trois `SKILL.md` ne sont pas touchés ;
aucun candidat v14 n'est produit ici ; aucun contrôle mécanique n'est committé (ADR-004).

---

## 1. État mesuré

Encodeur : `tiktoken` en `o200k_base` et `cl100k_base`, mesuré dans un venv jetable hors du dépôt
(`/tmp/tokvenv`), le dépôt ne portant aucune dépendance Python.

```bash
python3 -c "import tiktoken; ... len(tiktoken.get_encoding('o200k_base').encode(open(f).read()))"
```

| fichier | caractères | octets | jetons `o200k` | jetons `cl100k` |
|---|---:|---:|---:|---:|
| `AGENTS-source.md` | 14 181 | 14 332 | **3 302** | 3 316 |
| `candidat/v11.md` | 14 382 | 14 554 | 3 381 | 3 397 |
| `candidat/v12.md` | 13 988 | 14 139 | **3 302** | 3 314 |
| `candidat/v13.md` | 13 742 | 13 840 | **3 197** | 3 213 |
| `AGENTS.md` (noyau livré) | 7 915 | 8 003 | **1 835** | 1 831 |
| `.agents/skills/01-consign/SKILL.md` | 3 500 | 3 541 | 832 | 843 |
| `.agents/skills/02-memory/SKILL.md` | 1 388 | 1 395 | 300 | 302 |
| `.agents/skills/03-boundaries/SKILL.md` | 1 313 | 1 321 | 295 | 296 |

Découpe mesurée : `AGENTS-source.md` = noyau 7 915 car. / 1 835 jetons, skills 6 256 car. /
1 464 jetons. `candidat/v13.md` = noyau 7 592 car. / **1 768 jetons**, skills 6 140 car. /
**1 426 jetons**. Les chiffres de [`v13-analyse.md`](v13-analyse.md) §3 sont donc reproduits
indépendamment, y compris le fait que **v12 ne gagne pas un jeton sur la source** (noyau v12 :
7 790 car. / 1 848 jetons, soit +13 jetons sur la source).

**Synchronisation des artefacts** (mesurée, deux commandes) :

* noyau de la source contre `AGENTS.md` : `diff` rend **une seule ligne**, une ligne vide finale ;
  l'artefact chargé à chaque tour est donc le noyau de la source, à un blanc près.
* blocs `## 01-consign` / `02-memory` / `03-boundaries` contre `.agents/skills/*/SKILL.md`,
  frontmatter retiré : les trois sont **identiques**, seul le niveau de titre diffère (`##` dans la
  source, `###` dans l'artefact pour loger sous le titre `##`).
* aucun écart de contenu n'est constaté entre la source et les quatre artefacts à cette révision.

**Coût du format, mesuré** (`o200k`, sur `candidat/v13.md`) : retirer tous les points finaux de
puce, toutes les lignes vides (38), remplacer `* ` par `- `, ou supprimer les lignes vides en
gardant celles qui précèdent un titre, donnent **0 jeton** dans les quatre cas ; retirer toutes les
emphases `**` en donne **−14**. Le BPE fusionne `\n\n` en un jeton, et `* ` ne coûte pas plus cher
que `- `. Conséquence : **le format n'est pas un gisement**, et le chiffre de `v13-analyse.md` §1
(« ~160 (4,8 %) du format : 18 titres, 82 puces, lignes vides ») n'est pas reproduit ; les
marqueurs de format coûtent au plus ~14 jetons, l'emphase comprise. Corriger ce chiffre ne change
la conclusion d'aucune analyse : la part non réécrite est un peu plus petite que dit, pas plus
grande.

---

## 2. La veille

Deux pages ont été lues **et** vérifiées ici (abstract primaire) ; le reste est rapporté par une
passe de recherche web qui a lu les URL citées, sans relecture indépendante de ma part, et est
étiqueté comme tel.

### 2.1 Vérifié ici : le fichier de contexte est suivi, les règles sont la partie utile

Gloaguen et al., *Evaluating AGENTS.md*, [arXiv:2602.11988](https://arxiv.org/abs/2602.11988) (v3,
révisé le 2026-09-29), abstract lu :

> « providing context files does not generally improve task success rates, while increasing
> inference cost by over 20% on average [...] while instructions in the context files are well
> followed by coding agents, repository overviews [...] are not helpful. [...] context files are
> useful for specifying non-standard coding practices »

Ce que cela change : la conclusion de `v13-analyse.md` §4 (« un fichier de contexte n'améliore pas
en général la réussite et coûte ~20 % d'inférence en plus ») est exacte, mais elle avait laissé
tomber la clause qui compte pour ce contrat : **les instructions sont bien suivies**, ce sont les
aperçus de dépôt qui ne servent à rien. Ce contrat ne contient que des instructions, et il
spécifie des pratiques non standard, exactement le cas d'usage que l'article valide. Cela
n'autorise aucune compression : cela **interdit** de présenter une suppression de règles comme
gratuite, et cela rend l'objection « un fichier de contexte ne sert à rien » non recevable telle
quelle contre ce contrat.

### 2.2 La seule expérience qui teste la compression symbolique sans légende

MetaGlyph, *Semantic Compression of LLM Instructions via Symbolic Metalanguages*,
[arXiv:2601.07354](https://arxiv.org/abs/2601.07354) (prépublication du 2026-01-12, non révisée par
les pairs), abstract lu : huit modèles, deux dimensions (échelle 3B à 1T, accessibilité) ; « 62-81%
token reduction across all task types » ; mais « Results vary by model » et, pour les opérateurs,
Gemini 2.5 Flash 75 % d'équivalence sémantique (tâche de sélection) avec **49,9 %** de fidélité de
l'opérateur d'appartenance, Claude Haiku 4.5 **26 %** de fidélité d'appartenance avec 100 % de
succès de parsing, GPT-5.2 91,3 % de fidélité d'appartenance, Kimi K2 98,1 % pour l'implication, et
« Mid-sized open-source models (7B-12B) show near-zero operator fidelity ».

Ce que cela change : la mesure d'équivalence (62 à 75 %) et de fidélité (26 à 98 % selon
l'opérateur et le modèle) est ce qui condamne une notation symbolique privée comme support de
règles. Le tableau par opérateur plus complet (dont `→` à 0 % pour tous les modèles testés, chiffre
que `v11-analyse.md` §5 et `v12-analyse.md` §1.3 citent déjà) vient de la passe de recherche, qui a
lu le corps de l'article ; je ne l'ai pas relu. **Conflit non tranché, laissé `OPEN`** : la passe de
recherche lit la méthode de comptage comme un compte de mots séparés par des espaces, ce qui
rendrait les 62 à 81 % non comparables à des jetons BPE ; l'abstract, lui, écrit « token
reduction ». Je n'ai pas lu la section de méthode. Donc : ne pas citer ce ratio comme un gain de
jetons **et** ne pas affirmer qu'il ne l'est pas.

### 2.3 Compression de prompt : ce qui est mesuré, et sur quoi

| travail | mesure | ce que ça n'établit pas |
|---|---|---|
| LLMLingua [2310.05736](https://arxiv.org/html/2310.05736v2) | jusqu'à 20× ; à 20× GSM8K 77,33 contre 78,85 ; à 7× BBH 56,85 contre 70,07 | mesuré sur du raisonnement avec démonstrations, pas sur la conformité à des règles ; l'instruction n'est pas protégée intégralement |
| LongLLMLingua [ACL 2024](https://aclanthology.org/2024.acl-long.91/) | 2× à 6×, choix des informations dépendant de la question | compression *question-aware* d'un contexte, sans évaluation d'un règlement réutilisé |
| LLMLingua-2 [2403.12968](https://arxiv.org/html/2403.12968v2) | MeetingBank 3,1× (86,92 contre 87,75), BBH en demi-shot 5× (61,94 contre 70,07) | l'équipe signale elle-même que son générateur d'exemples **omettait des détails essentiels** et a parfois halluciné ; aucune mesure dédiée des négations, exceptions, seuils |
| gist tokens [2304.08467](https://arxiv.org/html/2304.08467v3) | jusqu'à 26× sur des activations apprises, prompts d'entraînement d'environ 20 jetons | exige un modèle entraîné ; sur le jeu hors distribution, victoire contre le contrôle 52,3 % (LLaMA-7B) et 40,6 % (FLAN-T5-XXL) : pas une restitution des règles |
| 500xCompressor [ACL 2025](https://aclanthology.org/2025.acl-long.1219/) | 6× à 500×, mais 70-74 % du F1 et 77-84 % de l'EM conservés au ratio maximal | textes d'articles et questions extractives, pas des règles |

Conclusion opérationnelle : ces méthodes suppriment des tokens, et aucune des sources ne mesure la
conservation des marqueurs de portée (négation, exception, condition, seuil, priorité). Sur un
contrat, ce sont précisément les tokens qui portent l'obligation. Elles restent **rejetées**, pour
la raison déjà écrite en v12, avec une preuve de plus : l'équipe de LLMLingua-2 documente que sa
propre génération de labels était infidèle.

### 2.4 Nombre et ordre des contraintes

* Harada et al. [2509.21051](https://arxiv.org/html/2509.21051v1) : la conformité chute quand le
  nombre d'instructions monte (99 % → 20 % pour « characters per line » chez Gemini 1.5 Pro, 97 % →
  2 % chez Claude 3.5 Sonnet, quand cinq autres contraintes s'ajoutent). **Précision qui manquait à
  `v12-analyse.md` §1.1** : les 57,4 % (5 contraintes) et 21,3 % (10) sont un **contrôle par
  règles**, contre 81,5 % et 65,7 % avec un juge GPT-4o : c'est une comparaison d'évaluateurs, pas
  une courbe de performance du modèle. La direction reste établie par quatre travaux, le chiffre
  doit être attribué à son instrument.
* IFScale [2507.11538](https://arxiv.org/html/2507.11538v1) : 10 à 500 contraintes, meilleur score
  68,9 % (Gemini 2.5 Pro) ; biais de primauté, ratio d'erreur dernier tiers / premier tiers 1,78 à
  500 contraintes.
* ScaledIF [2510.14842](https://arxiv.org/html/2510.14842) : Llama 3.3 70B 0,88 (2 règles) → 0,66
  (10) ; **aucune relation cohérente trouvée entre position et réussite**, ce qui contredit en
  partie IFScale : les deux mesures ne portent pas sur la même chose.
* Zeng et al. [2502.17204](https://arxiv.org/html/2502.17204v1) : ordonner les contraintes de la
  plus difficile à la plus facile gagne **≈ 7,7 points** de conformité moyenne (Llama 3 8B, 7
  contraintes, un tour ; 53,30 % → 60,95 %), ≈ 5 points pour Qwen2.5 7B, **26,3 points** en
  multi-tour. C'est la seule mesure trouvée où un **réordonnancement** améliore l'application.
* IHEval [2502.08745](https://arxiv.org/html/2502.08745v1) : sur instructions en conflit, GPT-4o
  70,0 % (91,0 % en cas aligné) ; **ajouter au prompt système une règle de priorité explicite
  n'améliore pas notablement le score**. À retenir contre l'attente : écrire la priorité dans le
  contrat ne la fait pas appliquer. Le contrat en porte trois formulations (`SCOPE` conflit, merge
  dans le plus fort, `R8`).

### 2.5 DSL de contraintes : là où le symbolique paie réellement

Rapporté par la passe de recherche : AgentSpec ([2503.18666](https://arxiv.org/abs/2503.18666),
accepté ICSE 2026), Agent-C ([2512.23738](https://arxiv.org/abs/2512.23738)), Agent Behavioral
Contracts ([2602.22302](https://arxiv.org/html/2602.22302v1)) : des DSL de contraintes dont la
conformité est **vérifiée à l'exécution** par interception des actions, avec 88 à 100 % de
conformité déclarée sur leurs périmètres. Le mécanisme compte : c'est un **vérificateur** qui lit
le symbole, pas le modèle. Aucun de ces travaux ne montre qu'un LLM décode fidèlement une notation
privée ; ils montrent qu'un contrat symbolique appliqué par un exécuteur tient. C'est un levier de
dispositif, hors du texte, et l'ADR-004 interdit par défaut d'ajouter un script sans dérive
démontrée.

### 2.6 Normes d'exigence : deux appuis et une tension

Rapporté par la passe de recherche, [NASA, Appendix C](https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/)
et ISO/IEC/IEEE 29148:2018 (clause 5.2.5 : nécessaire, appropriée, non ambiguë, complète,
singulière, faisable, vérifiable, correcte, conforme ; texte intégral sous abonnement, non lu ici) :

* **Appui 1** : la liste NASA des « termes non vérifiables » contient *robust*, *quickly*, *easily*,
  *clearly*, *maximize*, *minimize* : la suppression des huit adjectifs de `S1` par v11 et v12 est
  adossée à une norme, pas seulement au goût du rédacteur.
* **Appui 2** : NASA demande qu'une exigence soit accompagnée d'une *rationale* lisible, mais
  séparée de la clause normative. La transposition retenue ici est donc défendable : une
  justification retirée du contrat n'est pas effacée, elle vit dans les analyses et les ADR, et
  c'est écrit.
* **Tension, non résolue** : la norme veut **une pensée par énoncé** (singulière) ; la littérature
  d'application veut **moins de contraintes** (§2.4). Fusionner deux devoirs distincts satisfait
  l'une et viole l'autre. Les huit fusions de v12 ont été revues sous ce critère : elles portent
  toutes sur un devoir énoncé deux fois, pas sur deux devoirs distincts, donc elles satisfont les
  deux. Toute fusion future doit passer ce test.
* **Micro-tension nommée, sans action** : *sufficient* figure dans la liste NASA des termes non
  vérifiables, et le contrat porte « smallest sufficient solution ». La règle commande une action
  contrôlable par le relecteur ; elle reste. Elle est la seule de la liste NASA présente ici.

### 2.7 Déduplication : la prémisse n'est pas établie

Aucune source trouvée ne mesure l'effet d'une **déduplication** de clauses sur la conformité. Un
résultat va même contre l'intuition : *Prompt Repetition Improves Non-Reasoning LLMs*
([2512.14982](https://arxiv.org/html/2512.14982)) rapporte 47 victoires significatives et 0 défaite
sur 70 combinaisons modèle × benchmark en répétant **la même requête** (sans raisonnement, McNemar
p < 0,1). Cela ne dit rien d'un contrat (répéter une question n'est pas dupliquer une clause) et
allonge l'entrée, mais cela interdit de présenter « une redite coûte toujours » comme mesuré. La
justification qui reste debout pour les fusions de v12 est celle du **compte de contraintes** §2.4,
pas celle de la redondance.

---

## 3. Corrections aux analyses antérieures

| # | affirmé | mesure | état |
|---|---|---|---|
| 1 | `v13-analyse.md` §1 : « ~160 (4,8 %) du format » | marqueurs de format mesurés : 0 jeton (points, lignes vides, puce), −14 (emphase) | **chiffre non reproduit**, conclusion inchangée |
| 2 | `v12-analyse.md` §1.1 : « GPT-4o : 57,4 % (5 contraintes) → 21,3 % (10) » | ce sont deux instruments différents (contrôle par règles contre juge GPT-4o) | **attribution à corriger**, direction inchangée |
| 3 | `v12-analyse.md` §1.1 et `v13-analyse.md` §4 : le fichier de contexte n'améliore pas la réussite | Gloaguen v3 ajoute : les **instructions sont bien suivies**, les aperçus de dépôt non | **complément**, pas une contradiction |
| 4 | `v12-analyse.md` §1.3 : « −62 à −81 % de jetons » (MetaGlyph) | l'abstract dit « token reduction » ; la passe de recherche lit un comptage par mots | **`OPEN`**, ne pas citer comme gain de jetons |
| 5 | `v13-analyse.md` §1 : « 24,5 % intouchables (littéraux + format) » | littéraux confirmés (651 jetons) ; format ≈ 14 jetons au plus | **part du format surestimée** |
| 6 | `v11-analyse.md` §3 et `v12-analyse.md` §3 : fusions de devoirs | revues sous le critère de singularité NASA (§2.6) | **confirmées** : un devoir, énoncé deux fois |
| 7 | `v13-analyse.md` §5 : « aucun accès à un modèle depuis cet espace de travail » | toujours vrai ici | **inchangé** : aucun banc de conformité n'est possible dans ce tour |

`docs/contracts/README.md` annonce `candidat/v12.md` comme « le candidat courant ». Mesuré : au
jeton comme au caractère, **v13 domine v12** (3 197 contre 3 302, noyau 1 768 contre 1 848) et
v12 ne gagne rien sur la source. Le README est en retard d'une version.

---

## 4. Contrôle de couverture indépendant, source → v13

Instrument différent de celui de v12 (matrice énoncé par énoncé, faite à la main) : comparaison
automatique par recouvrement de jetons, puce source contre puce candidate, seuil de Jaccard 0,35,
contenu entre backticks retiré avant comparaison. **Ses limites sont réelles et le disqualifient
comme preuve** : il retire les littéraux, donc il est aveugle à quatre puces d'invariants qui ne
sont que des littéraux, et il compare des puces entières, donc une puce fusionnée fait chuter son
score. Il sert de borne supérieure, pas de garantie.

`source → v13` : 10 alertes sur 82 puces source. Toutes expliquées :

| puce source alertée | destination dans v13 |
|---|---|
| `CORRELATION != CAUSATION`… / `EVIDENCE >= CLAIM`… / `FACT != EVIDENCE`… / `FIRST PLAUSIBLE RESULT`… | présentes mot pour mot ; l'instrument est aveugle aux littéraux |
| les huit adjectifs de `S1` | supprimés, décision assumée de v11, adossée à la norme NASA §2.6 |
| « Use only real capabilities, sources, tools, files, tests. » | fondue dans l'en-tête ¶1 (« never invent … use only real ones ») |
| « No preamble, no recap of visible changes, no menu of options. » | `OUTPUT` : « no opener …, no hedge, no preamble, no recap, no menu » |
| « Execute only the requested task. `RELEVANT != NECESSARY`. » | `SCOPE` 1, la formule littérale y est |
| « Double-check material claims, decisions and changes… » | `VERIFY` 1 (« Claim, decision or change material … → verify it ») |
| « Never continue merely because further analysis is possible. » | `STOP`, dans la même puce que les trois conditions |

`v13 → source` (sens inverse, pour attraper l'ajout silencieux) : aucune puce de v13 sans
équivalent source, hors les six réparations déjà documentées (renvoi faux de `NO_PROGRESS`, cadratin
énonçant son domaine, `R7`–`R10` rendus à leur section, la liste d'adjectifs, les deux
suppressions `S40` et `S58`).

---

## 5. Les leviers, chiffrés

| levier | gain mesuré | coût ou risque | recommandation |
|---|---:|---|---|
| **(a) adopter v13 tel quel** | noyau **−67 jetons (−3,7 %)**, fichier −105 (−3,2 %) | lisibilité (dense), matrice de couverture faite à la main disponible | **oui** : gain reproduit, aucune règle perdue selon les deux instruments |
| (b) différer `AUDIT` + `RECOVERY` + `STOP` dans un skill | noyau −182 jetons (−9,9 %) | dépend du chargeur ; Vercel mesure 56 % de non-déclenchement **sans** consigne explicite, 95 %+ **avec** | **à arbitrer**, seule question ouverte de ce document |
| (c) différer `REASON` + `VERIFY` + `CHANGE` en plus | noyau −510 jetons (−27,8 %) | ce sont les règles applicables à chaque tâche | **non** en l'état |
| (d) réordonner les règles | Zeng : +7,7 points de conformité (un tour) | aucune mesure de l'effet d'une **position** dans un contrat système lu à chaque tour ; ni difficulté ni fréquence mesurables ici | **non**, banc requis |
| (e) notation symbolique privée | 62-81 % annoncés, grandeur contestée (`OPEN`) | fidélité par opérateur 26 % à 98 %, proche de zéro pour les modèles 7B-12B, et `→` à 0 % | **non** |
| (f) faire appliquer le contrat hors du modèle (DSL + vérificateur) | 88-100 % de conformité déclarée (AgentSpec et al.) | hors du texte ; exige un harnais ; ADR-004 : pas de script sans dérive démontrée | **non** ici, direction nommée |
| (g) supprimer des règles | non chiffrable | décision sémantique, pas technique ; contre-indiqué par Gloaguen §2.1, qui valide les instructions | **au relecteur** |

Aucun de ces mouvements n'a de preuve d'améliorer l'application des règles dans **ce** contrat. Le
seul résultat mesuré de toute la veille où une restructuration a tenu est l'index de documentation
de Vercel (40 Ko vers 8 Ko, 100 % de réussite), et il portait sur du **matériau de référence
recopié**, que ce contrat ne contient pas.

---

## 6. Dérives signalées, non corrigées

1. `docs/contracts/` est **entièrement non commité** (`git status --porcelain` : `?? docs/contracts/`),
   comme `.agents/` (`?? .agents/`). La source, les trois candidats, les trois analyses et l'archive
   ne survivent donc qu'à la mémoire locale, contre `CONSIGN` (« a document left uncommitted leaves
   nothing read »).
2. **ADR-012 est contredit sans acte daté.** Il a tranché « un seul contrat, `AGENTS.md`, sans
   skills, sans copie », et supprimé `.agents/`. L'état courant porte un renvoi dans `AGENTS.md`,
   trois `SKILL.md` vivants et une source à quatre artefacts. Aucun ADR ne cite l'ADR-012 pour le
   réviser ; `grep -rn "ADR-012" docs/` ne rend que le registre lui-même et deux mentions du
   journal.
3. **La campagne v11, v12, v13 n'est pas consignée au journal** : `grep -n "v1[123]\|candidat"
   docs/trace.md` ne rend rien. La Séance 1 reste ouverte.
4. **Les trois analyses n'ont pas de frontmatter** (`name`, `description`, `type`, `status`), là où
   `CONSIGN` l'exige d'un document consigné ; ce fichier-ci en porte un.

Ces quatre points dépassent la tâche demandée : signalés, pas touchés.

---

## 7. Ce qui n'est pas établi

* **Aucune mesure d'application des règles**, ici comme en v11, v12 et v13 : pas d'accès à un
  modèle dans ce tour, donc pas de taux de violation par règle, ni avant ni après.
* **Le gain de v13 vaut ce que vaut une mesure de jetons** : il dit le coût, rien de la qualité.
* **La grandeur de MetaGlyph reste `OPEN`** (compte de mots ou jetons BPE) ; je n'ai pas lu sa
  section de méthode.
* **Le tableau par opérateur** (`→` à 0 %, `∩` à 0-21 %) vient de la passe de recherche, qui a lu
  le corps ; je n'ai vérifié que l'abstract.
* **La transférabilité de Zeng** (ordonner du plus difficile au plus facile) à un contrat système
  n'est pas mesurée ; elle est nommée, pas utilisée.
* **Le déclenchement d'un skill dans ce client n'est pas mesuré** : la liste de skills fournie à
  cette session ne contient pas les trois skills du dépôt, ce qui laisse la consigne écrite dans le
  noyau comme **seule** voie de découverte. C'est une observation de ce tour, pas une mesure du
  chargeur, et elle porte sur la version de client, pas sur le contrat.

---

## 8. Recommandation

Adopter `candidat/v13.md` comme nouvelle source (levier a), puis traiter **une seule** question de
structure : différer ou non `AUDIT`, `RECOVERY` et `STOP` (levier b, −182 jetons du noyau, −9,9 %),
sachant que ce qui a changé depuis v12 est que le remède au non-déclenchement est désormais mesuré
(consigne explicite dans le noyau : 95 %+) et que ce contrat porte déjà une consigne de ce type
pour ses trois skills de dépôt. Le reste est chiffré et déconseillé.
