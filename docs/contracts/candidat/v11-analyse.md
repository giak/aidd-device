# Analyse et audit du candidat v11

Ce fichier ne fait pas partie du contrat. Le contrat est
[`docs/contracts/AGENTS-source.md`](../AGENTS-source.md) ; le candidat est
[`candidat/v11.md`](v11.md) ; l'artefact chargé à chaque tour est `AGENTS.md`.

---

## 1. Audit : 18 régressions trouvées, 18 réparées

L'audit a été conduit en comparant chaque énoncé de l'original à sa présence dans v11, un par
un. Il en a trouvé **18**. Aucune n'était visible par lecture rapide : six étaient des puces
entièrement disparues, six des mots porteurs de sens retirés, six des réécritures qui
affaiblissaient la règle sans la supprimer.

### Six puces entièrement perdues

| perdue | cause |
|---|---|
| `Quote the shortest decisive line of an error or log, never the dump.` | troncature |
| `No tool-call narration. No decorative table, emoji or em-dash in prose…` | troncature |
| `Independent review is never mandatory, and never claimed when it did not happen…` | troncature |
| `No hidden chain-of-thought: conclusions, evidence, checks, concise rationale.` | troncature |
| `Prose under docs/ is French. Code, commands, identifiers and this file are English.` | troncature |
| `` `NO_PROGRESS → STOP` `` | réécriture |

Les cinq premières ont disparu parce que le candidat a été reconstruit avec une frontière
codée en dur au lieu de la frontière réelle. Le noyau s'arrêtait à « No preamble » et
`# SKILLS` suivait immédiatement. La comparaison des tailles ne l'a pas montré : les lignes
perdues étaient remplacées par d'autres, le compte de caractères restait proche.

La sixième est plus grave et plus discrète : en réécrivant `RECOVERY` pour supprimer un
renvoi faux vers `STOP`, j'ai supprimé la chaîne elle-même. « Ne pas répéter une stratégie
échouée sans prémisse modifiée » ne couvre pas « arrêter quand plus rien ne progresse » : on
peut changer de prémisse et stagner quand même.

### Six mots porteurs de sens retirés

| original | ce que le mot portait | restitution |
|---|---|---|
| verify their claim against the project's actual state **before acting on it** | le déclenchement temporel : agir, pas seulement entendre | v11 porte de nouveau « before acting on it » |
| Double-check material **claims, decisions and changes** | deux des trois objets n'étaient plus vérifiés | « WHEN a claim, a decision or a change is material… » |
| capabilities, sources, tools, **files, tests** | deux objets absents de l'en-tête | liste rendue |
| available **and verification could affect the result** | seconde condition : sans elle, toute affirmation matérielle se vérifie, y compris l'inutile | les deux conditions rendues |
| **Never guess** an API… **before relying on it** | l'interdiction et son délai ; il ne restait qu'une prescription | « Never guess… : WHEN one is needed → read… before relying on it » |
| Seek **only** alternatives | la retenue | « seek only alternatives » |

### Une dérive en sens inverse

`Investigate **material** regressions` → v11 demandait d'investiguer *toute* régression
rencontrée. Plus strict que l'original, et contraire au filtre de matérialité qui gouverne
le reste du contrat. Corrigé.

### Deux suppressions assumées

| supprimé | pourquoi |
|---|---|
| `pragmatic·efficient·robust·concise·precise·rigorous·meticulous·reliable` | aucun test observable. Ce n'est pas un goût : c'est la règle du contrat lui-même, *une règle qui n'est ni claire ni spécifique est supprimée*. `KISS` `DRY` `YAGNI` survivent, principes nommés avec un référent partagé |
| « an uncommitted change is unfinished, so the request is part of consignment » | contradictoire avec « never commit unless the user asks » dans la même puce. La contrainte « never commit » est intacte ; c'est le raisonnement qui tombe |

## 2. Ce que v11 corrige par rapport à l'original

| # | défaut de l'original | correction |
|---|---|---|
| 1 | « never execute an inapplicable rule » — circulaire : on ne peut exécuter qu'une règle applicable | « never apply a rule whose condition does not hold » |
| 2 | « un blocage est la troisième condition de `STOP` » — les trois conditions portent sur la tâche, aucune ne mentionne le blocage | renvoi faux supprimé, chaîne `NO_PROGRESS → STOP` conservée |
| 3 | la porte de production est en fin de OUTPUT, lue comme une règle de format | remontée en tête de CHANGE |
| 4 | `R7` `R8` `R9` `R10` sont en OUTPUT : règles de raisonnement et de preuve, invisibles au moment du choix | `R7 R8 R9` en REASON, `R10` en VERIFY, pointeur dans OUTPUT |
| 5 | « no em-dash in prose ; a named format is not prose » — réserve circulaire, et le contrat écrit un em-dash en prose dans la puce `R4` | règle énonçant son domaine ; noyau à zéro em-dash |
| 6 | `R3`…`R11` entassés dans une puce de 900 caractères | une puce par règle, chacune lisible seule |
| 7 | 18 conditions sur 26 enfouies **après** l'action | 16 déclencheurs `WHEN` / `AFTER` en tête de puce, contre 0 |

## 3. Six contraintes en double, fondues

| contrainte répétée | fondue dans |
|---|---|
| « double-check material claims » + « verify material claims » | une seule règle, VERIFY |
| « never invent… » + « use only real capabilities… » | l'en-tête, plus une puce « tools, files and tests » conservée |
| « never expand scope » + SCOPE | SCOPE |
| « challenge the result » + « seek only alternatives » | une clause REASON |
| « smallest sufficient solution » + « smallest sufficient change » | REASON |
| « produce only what the task requires » + « execute only the requested task » | SCOPE |

## 4. Mesure — et un chiffre que je dois corriger

| | original | candidat v11 |
|---|---|---|
| noyau | 7 915 car | **8 117 car (+202, +2,5 %)** |
| puces | 53 | 63 |
| déclencheur `WHEN` / `AFTER` en tête | 0 | **16** |
| em-dash en prose | 1, dans la règle qui l'interdit | **0** |
| contraintes perdues | — | **0** |
| skills modifiés | — | 0 |

J'avais annoncé **−243 caractères**. C'était faux, et l'audit en donne la raison : le fichier
mesuré était tronqué de six puces, et une troncature qui remplace des lignes par d'autres
laisse une taille presque inchangée. Le candidat ne compresse pas : il coûte 202 caractères
de plus pour 16 déclencheurs explicites, 6 fusions et 7 corrections.

C'est le vrai arbitrage, et il n'est pas gratuit : le contexte de `AGENTS.md` est payé à
chaque tour, pour toujours, contre une activation plus probable de 16 règles.

## 5. Idées empruntées à d'autres contrats, et pourquoi elles sont rejetées

Deux références ont été étudiées : `/home/giak/projects/audio-sync-tool/AGENT.md` et les
`*.dsl.md` de `/home/giak/Work/MCO/docs/research`.

### audio-sync-tool : compression locale, redondance globale

Le fichier est dense, et il applique les trois techniques que j'avais envisagées — règles
nommées (`S1`·`W1`·`△DATA-SAFETY`), portes sous forme de questions (`Gate 1 : ai-je lu tout
le nécessaire ?`), boucle nommée (`READ → PLAN → EXEC → VERIFY → CLOSE`). Il les applique
mal, et il le prouve :

| énoncé | occurrences | où |
|---|---|---|
| liste d'adjectifs identique | 2 | lignes 45 et 183 |
| `YAGNI` | 5 | 40 · 171 · 174 · 188 · 191 |
| `KISS` | 3 | 40 · 171 · 191 |
| « ne pas casser les tests / NO regression » | 2 | 39 · 187 |
| « scope strict » | 2 | 174 · 188 |
| « Double-check : claims → evidence → verification » | 2 | 55 · 182 |

La liste d'adjectifs que j'ai coupée de ce contrat est dans ce fichier, deux fois, mot pour
mot. `RIGUEUR`, `SURGERY` et `WORK-RULES` sont trois copies du même noyau. **Sa compression
est locale, pas globale** : denses chaque section, le document reste redondant — et une règle
énoncée trois fois n'est pas trois fois plus appliquée, elle est trois fois diluée, et quand
elles divergent on ne sait plus laquelle fait foi.

Sa densité vient aussi de ce qu'il empile règles **et** documentation de projet : les lignes
145 à 153 sont le pipeline Discogs, les caches, les quotas d'API. Ce n'est pas un contrat,
c'est un journal.

### MCO : une thèse, pas un modèle

Le guide est méta : il ne compresse pas un contrat, il argumente pour la compression
symbolique. Deux choses en sont retenables :

- `|` comme marqueur de condition (`A|C→B`), ligne 111
- `C₁ simplify · C₂ merge · C₃ abstract`, ligne 280 — nommer les trois opérations rend la
  méthode reproductible ; c'est au document de méthode, pas au contrat

Le reste est écarté, et le guide fournit lui-même les arguments : §12.1 « Péché : 300
symboles dès début », et il propose une bibliothèque de 24 grecques et plus de 30 opérateurs ;
§12.4 « 1 symbole = 1 sens », et il définit `∂` trois fois (§3 ligne 89 « scalpel précision »,
ligne 120 « retouche douce », ligne 262 « vitesse d'apprentissage ») ; §12.3 « glossaire
commenté », et son glossaire tient en quatre lignes sans commentaire. Ses propres limites
avouent « risque charabia indéchiffrable » et « IA parfois capricieuse (modèle-dépendant) ».
**L'auteur dit lui-même que c'est non mesuré.**

L'inventaire `Ω` = Grand Patron, `Φ` = Détective, `Ψ` = Archiviste n'a aucune base : nommer
un noyau de raisonnement ne le fait pas raisonner mieux. Les archétypes — `TheGreatThinker`,
`CosmicReasoningCore` — sont antithétiques à un contrat : un contrat dit ce qui doit être
vrai de la sortie, il ne dit pas au modèle d'incarner un personnage.

La règle que j'en retiens : **un glyphe n'entre que s'il n'apporte rien que la notation
existante ne fasse déjà.** `Ω` n'apporte rien que `→` ne fasse. `|` aurait dû non plus.

### Le coût mesuré des trois idées

Chacune a été écrite, mesurée, puis jetée.

| idée | coût | verdict |
|---|---|---|
| `S1` `G1` `E1` `C1` — règles nommées | **+132 car** | la convention doit entrer dans l'en-tête : « a rule without a name cannot be cited without being copied ». Ne paie que si quelque chose la référence ; une seule règle le fait |
| `READ → PLAN → EXEC → VERIFY → CLOSE` | **+166 car** | elle n'absorbe rien : « read what is necessary » et « verify the requested result » sont réécrits en développé, pas supprimés |
| priorité de conflit sur 4 niveaux | **+131 car** | 85 → 216 caractères pour expliciter ce que `CONSIGN` et `TERRITORY` disent déjà là où ça agit |
| **les trois ensemble** | **+640 car** | 8 555 contre 7 915 |

Sur le critère qui compte — efficience au chargement, capacité à comprendre et à appliquer —
les quatre sont un échec : elles ajoutent du décodage pour un bénéfice d'activation
qu'aucune mesure ne soutient.

### `|` : gain annoncé, perte réelle

`WHEN` coûte 5 caractères, `|` en coûte 2 : sur 18 occurrences, −49. Mais le glyphe doit être
défini — le commandement même du guide l'impose — et la définition coûte 58 de plus que le
mot entier. Bilan réel : **+9 caractères**, plus une collision, `|` signifiant la condition en
tête de puce et l'alternative dans `VERIFY|QUALIFY|REMOVE`. Deux sens, un glyphe.

Conservé : `WHEN`. Il dit la même chose sans convention à retenir.

## 6. Ce qui reste non établi

Une condition placée avant l'action devrait être lue avant l'action. C'est une raison de
placement, pas une mesure. Rien ici ne l'établit : un LLM n'est pas déterministe, et
« déclencheur visible » n'est pas une preuve de « règle appliquée ».

Le banc qui le montrerait : mêmes scénarios, deux conditions, N répétitions, taux de
violation par règle, comparaison des intervalles. Non fait. v11 est un candidat texte, pas
un contrat prouvé — et il coûte 202 caractères de plus que l'original.

Ce que la soirée a produit de solide ne vient d'aucun emprunt : dix-neuf déclencheurs
remontés devant leur action, six contraintes en double fondues, une phrase qui mentait sur
`STOP` réparée, deux règles mal placées déplacées. Des gains de compréhension, pas de
longueur.