---
name: "Brainstorm : un protocole de test robuste pour tout skill AIDD"
description: "retour d'expérience du run 06-test, réponse aux six questions, rôles séparés, niveaux de preuve et douze corrections génériques priorisées, chacune avec son contrôle de banc"
type: brainstorm
status: open
---

# Brainstorm : un protocole de test robuste pour tout skill AIDD

> 2026-10-23, après le run indépendant de `06-test` sur `audio-sync-tool`. Sources mesurées :
> le [rapport](../device/runs/2026-10-23-202344-32cfec45-e51e7a6/RAPPORT.md), le
> [reçu](../device/runs/2026-10-23-202344-32cfec45-e51e7a6/receipt.json), les
> [faits](../device/runs/2026-10-23-202344-32cfec45-e51e7a6/faits.json), la
> [trace](../device/runs/2026-10-23-202344-32cfec45-e51e7a6/trace/echange.jsonl), le
> [produit](../device/runs/2026-10-23-202344-32cfec45-e51e7a6/raw/2026-10-23-202011-test-analyse/test_skill_analysis.py),
> la [demande](../device/CASES/2026-10-23-202011-test-analyse.request.md), l'[attendu](../device/CASES/2026-10-23-202011-test-analyse.expected.json),
> le [protocole](../PROTOCOLE.md) et le [banc](../BANC.md). Le skill lu est
> `/home/giak/projects/framework/plugins/aidd-dev/skills/06-test/SKILL.md` (`model: sonnet`).
>
> Deux recherches web ont été menées : isolement d'opencode 2.1.x et pratique de l'évaluation
> d'agents (mutation, contamination, attribution). Elles sont citées au §9, avec leur limite :
> la documentation v2 ne tranche pas tout, et le code source 2.1.0 n'a pas pu être lu.

## 1. Réponse directe aux six questions

**Le skill est-il testé ?** Non, au sens fort. Le run prouve que le skill a été lu, que son action
`01-test` a été suivie, et que la session a produit le fichier demandé. Il ne prouve pas qu'un skill
défectueux serait refusé. Le protocole le dit déjà au §6 de [PROTOCOLE](../PROTOCOLE.md) : « la qualité
du skill, ni la justesse du produit » ne sont pas attestées. Le vrai défaut n'est donc pas un mensonge
du protocole, c'est son objet : il mesure la **conduite**, pas la **compétence**.

**Ce qu'il a produit a-t-il été testé ?** Le produit a été **exécuté** : `python3 -m pytest -q
test_skill_analysis.py` rend `9 passed`, et le fichier est sain à la lecture (mock à la frontière
`subprocess`, arguments ignorés, aucune fonction privée du DSP touchée). Il n'a pas été **éprouvé** :
aucune faute n'a été injectée, donc on ne sait pas si ces neuf cas détecteraient une régression. Une
suite verte prouve qu'elle s'exécute, pas qu'elle mord.

**Qu'avons-nous appris ?** Cinq choses, dans l'ordre de coût :

1. Le cas est une pièce de l'instrument. Une règle que le falsificateur ne mesure pas laisse le juge
   trancher hors reçu : ici « au plus deux tests, un par comportement » n'a aucun écho dans `P`, qui
   ne compte que les comportements. Le produit a quatre fonctions pour deux comportements : il
   dépasse la borne, et le reçu ne le voit pas.
2. Une règle sans falsificateur sort du reçu. Le juge tranche alors hors mesure, et son verdict n'est
   plus reproductible.
3. La trace n'est pas la session. L'export ne porte pas le prompt système assemblé, donc l'origine
   d'une instruction étrangère reste `UNKNOWN`, même quand sa trace est visible.
4. Un test de skill sans contrôle négatif ne mesure pas la discrimination. Il faut une faute, ou un
   skill mutilé, pour savoir si le cas distingue.
5. Un seul agent peut jouer tous les rôles, à condition de les séparer par les pièces et le temps,
   jamais par une déclaration d'indépendance.

**Où sont les erreurs ?** Huit, classées au §5 : une de la session (la borne dépassée), une du cas (la
borne sans mesure), deux du harnais (la question, l'option fantôme), deux de l'environnement (les
instructions globales, le modèle), et deux du protocole (l'attribution du verdict, l'absence de
vérification du produit). La session a dépassé la borne ; c'est l'écart, pas une erreur de mesure.

**Comment corriger ?** Douze corrections génériques au §6, dont quatre bloquantes : isolement mesuré
par canari, règle adossée à un falsificateur, verdict attribué à une couche, question détectée partout
dans le message. Les autres ajoutent le modèle déclaré, la vérification du produit, le contrat du
skill, la famille de cas et la revue externe.

**Que corriger dans le protocole ?** Huit invariants au §7. Le protocole est déjà rigoureux sur la
forme ; il lui manque la **validité** : prouver que l'instrument mesure ce qu'il prétend, et que le
produit détecte ce qu'il prétend. Le §8 donne l'ordre : quatre corrections bloquantes, puis quatre
mesures, puis quatre améliorations de campagne.

## 2. Les niveaux de preuve, et ce que le run atteint

Le mot « testé » recouvre cinq niveaux. Les nommer évite de discuter d'un mot.

| Niveau | Ce qu'il prouve | Mesure | Le run `06-test` |
| --- | --- | --- | --- |
| **L0 lu** | le skill a été ouvert | un chemin lu dans la trace | atteint |
| **L1 exercé** | l'action a été suivie, dans l'ordre | les gestes, la pause, le produit | atteint |
| **L2 conforme** | le produit respecte les règles du cas | les falsificateurs du reçu, la lecture du juge | partiel : aucun falsificateur ne mesure le compte des tests |
| **L3 valide** | le produit fait ce qu'il prétend | une faute injectée, le produit doit échouer | non atteint |
| **L4 discriminant** | le cas refuse un skill défectueux | le skill mutilé, le cas doit rendre `ecart` | non atteint |

Le protocole actuel s'arrête à L2, et seulement quand une règle a un falsificateur. Le run est L1,
avec un L2 partiel. La question « le skill est-il testé ? » a donc une réponse nette : **L1, pas L4**.
Un dispositif honnête affiche ce niveau dans le reçu, au lieu de laisser « conforme » suggérer L4.

Le niveau n'est pas un label décoratif : il commande ce qu'on peut conclure. À L1, on peut dire « la
session a suivi ce skill ». À L3, on peut dire « les tests produits détectent une faute ». À L4, on
peut dire « ce cas distingue un bon skill d'un mauvais ». Aucun run ne devrait laisser croire au
niveau supérieur.

## 3. Les rôles

Sept rôles, définis par ce qu'ils produisent, pas par leur titre.

| Rôle | Responsabilité | Pièce produite | Ne peut pas |
| --- | --- | --- | --- |
| **Auteur** | écrire la demande, l'attendu, la borne et les falsificateurs | `request.md`, `expected.json` | juger le run qu'il a instrumenté |
| **Greffier** | exécuter le harnais, enregistrer les faits, exporter la trace | `gate.json`, `faits.json`, `trace/` | interpréter un fait, choisir un verdict |
| **Juge** | comparer l'attendu à la trace et au produit, proposer le verdict | `output.json`, `receipt.json` | réécrire l'attendu, changer une règle |
| **Avocat du diable** | chercher la cause alternative, attaquer le verdict | un bloc `critique` | trancher |
| **Auditeur** | vérifier l'instrument : bornes, règles, falsificateurs, isolement, modèle | un bloc `audit` | auditer un cas dont il est l'auteur |
| **Opérateur** | choisir le périmètre, geler, trancher le verdict final | la décision, la mémoire | se substituer au juge sur un fait mesuré |
| **Relecteur externe** | relire sans avoir vu l'attendu, avec un autre modèle ou client | un bloc `relecture` | être invoqué sans preuve d'indépendance |

Deux séparations suffisent à éviter la plupart des biais : **auteur ≠ juge ≠ auditeur**, et
**opérateur ≠ session sous test**. Dans un dispositif à un seul agent, la séparation est temporelle :
l'auteur écrit avant le gel, le juge lit après la trace, l'auditeur lit après le juge, et chacun
produit une pièce distincte. Une revue interne se déclare `revue_interne` ; elle ne se dit jamais
indépendante. Le run `06-test` n'a eu ni avocat du diable ni auditeur, et c'est précisément pourquoi
la règle de borne sans mesure a survécu jusqu'au verdict.

Le rôle d'auditeur n'est pas une réunion : c'est une passe de lecture courte, avec une liste fermée.
Il lit l'attendu et la demande côte à côte, cherche les bornes, les règles sans mesure et les
falsificateurs qui ne mesurent pas leur règle. Il ne lit pas la trace, pour ne pas juger le run.

## 4. Le run sous la loupe

### 4.1 Ce qui tient

- Le skill et son action ont été lus avant toute écriture ; la trace porte les lectures.
- La liste des dix comportements non testés est montrée avec un score, avant l'accord.
- La pause est mesurée : `pause.attente_ms: 110866`, `seq_reponse: 15`, `seq_ecriture: 16`.
  La réponse figée a été envoyée, à la main (voir E3), puis l'écriture a suivi.
- Un seul fichier neuf : `test_skill_analysis.py`, `sha256 3c01985e…`, 4134 octets, aucun fichier
  existant modifié (`git status`: `?? test_skill_analysis.py`).
- La suite passe : `9 passed`, `exit 0`, dans la trace.
- Le reçu porte 14 limites, et aucun falsificateur ne mord. La forme est tenue.

### 4.2 Ce qui ne tient pas

- **La borne n'a pas de mesure.** La demande §6 et l'attendu disent « au plus deux tests, un par
  comportement approuvé » ; le falsificateur `P` dit « plus de deux comportements traités ». Le
  produit porte quatre fonctions de test et neuf cas pour deux comportements : il dépasse la borne,
  mais `P` ne le voit pas. Le reçu ne peut pas trancher, et le juge a tranché hors reçu.
- **L'attribution manque.** Le rapport dit « le produit porte neuf tests pour deux comportements, là
  où l'attendu demandait au plus deux tests ». Il ne dit pas que la demande §6 dit la même chose, ni
  que quatre fonctions pour deux comportements dépassent « un par comportement ». Un lecteur voit un
  écart, sans savoir s'il vient de la session, du skill, du cas ou du harnais.
- **L'isolement n'est pas mesuré.** `faits.cloisonnement.attendu_vu: "non"` dit que l'attendu n'a pas
  été vu par la session, pas que l'environnement était propre. Trois commandes portent `rtk`
  (`seq 6`, `seq 7`, `seq 19`), et un raisonnement le cite en `seq 8` ; la convention est absente du
  terrain et du cas. La source probable est le skill global `rtk-first`, pas une instruction du skill
  testé.
- **Le modèle n'est pas celui du skill.** Le skill déclare `model: sonnet` ; le run a tourné sur
  `opencode/deepseek-v4.1-flash-free`. Le reçu le note dans `session.modele`, mais aucune limite ne
  dit que le skill n'a pas été exercé dans son modèle déclaré.
- **Le prompt système n'est pas dans l'export.** L'export du run ne porte pas le prompt assemblé, et
  la documentation v2 ne dit pas qu'il l'exporte. L'origine exacte de `rtk` reste donc `UNKNOWN`, même
  si sa trace est certaine.
- **Sept comportements sur dix ne sont ni testés ni explicitement écartés.** Deux sont couverts, un
  est `pending` avec sa raison, sept sont silencieux. La demande autorisait ce choix (« au plus les
  deux comportements les plus prioritaires ») ; la trace ne dit pas pourquoi les sept tombent.
- **Aucune faute injectée.** `9 passed` ne dit pas si les tests détectent une régression.

### 4.3 Une rectification de ma propre hypothèse

J'ai d'abord soupçonné un couplage à l'implémentation dans le mock ffmpeg, parce que le dernier
message affirmait « aucun couplage ». La lecture du fichier réfute le soupçon : `fake_run(*_args,
**_kwargs)` ignore les arguments, ne teste ni la ligne de commande ni une fonction privée, et remplace
seulement la frontière externe `analysis.subprocess.run`. L'affirmation du dernier message est juste.
Je la garde comme preuve que la lecture du produit, et pas la confiance dans son auteur, est ce qui
tranche. La réserve sur le produit est ailleurs : quatre fonctions pour deux comportements, là où la
demande dit « au plus deux tests, un par comportement ». La couverture de deux comportements sur dix,
elle, était autorisée.

## 5. Les erreurs, par couche

| # | Erreur | Couche | Preuve | Correction |
| --- | --- | --- | --- | --- |
| E1 | Le produit dépasse la borne écrite : quatre fonctions de test et neuf cas pour deux comportements, là où la demande §6 dit « au plus deux tests, un par comportement » | session | demande §6, produit collecté | aucune : c'est l'écart mesuré |
| E2 | La borne n'a pas de falsificateur : `P` compte les comportements, pas les tests | cas (auteur) | attendu, `falsificateur P` | C2 |
| E3 | Le verdict n'est attribué à aucune couche ; `ecart` peut désigner la session, le skill, le cas ou le harnais | protocole | `receipt.verdict: "ecart"`, champ d'attribution absent | C5 |
| E4 | `ouvrir` refuse une question bien formée dont la dernière ligne est une consigne (`Reply "oui"…`) | harnais | PROTOCOLE §2, règle de la dernière ligne ; réponse envoyée à la main par `opencode run --session` | C3 |
| E5 | `fin --sans-ecrire` est documenté et dans l'usage, mais le parseur le refuse | harnais | `USAGE — option inconnue « --sans-ecrire »`, `exit 2` | C4 |
| E6 | L'environnement du client charge des instructions globales ; le prompt système n'est pas exporté | environnement | `rtk` en `seq 6, 7, 19` ; `attendu_vu: "non"` ; export sans prompt | C1 |
| E7 | Le modèle du run n'est pas celui déclaré par le skill | environnement | `faits.session.modele`, skill `model: sonnet` | C6 |
| E8 | Le produit est exécuté, jamais éprouvé | protocole | `9 passed`, aucune mutation | C7 |

E1 est le fait que le run a trouvé ; il fonde `ecart`, et il n'appelle pas de correction. E2 est
de ma main : le cas gelé n'est pas réécrit, la correction vaut pour la variante suivante, qui cite
celle-ci. E3 est la plus coûteuse en confiance : un `ecart` sans attribution se lit comme un échec du
skill, alors qu'ici la session a dépassé la borne et que le cas ne l'a pas mesurée. La décision de
l'opérateur reste `ecart` ; l'audit ne la conteste pas, il constate que le reçu ne nomme ni la règle
ni la couche.

## 6. Les corrections, génériques à tout skill

Douze corrections. Chacune dit le défaut, le mécanisme, le contrôle de banc et le coût. Aucune n'est
un nouveau paragraphe de doctrine : chacune est un champ, un refus ou une commande.

### P0, avant le prochain run

**C1. Isoler l'environnement, et le prouver par un canari.**

Défaut : le client charge la configuration globale, les skills globaux et les `AGENTS.md` de
l'utilisateur ; le cas ne peut pas l'interdire, et le reçu ne le voit pas. La recherche donne la
recette pour opencode 2.1.x : un `HOME` neuf et un `XDG_CONFIG_HOME` neuf pour **le serveur et le
client**, le même environnement des deux côtés, `--server` explicite, et `OPENCODE_CONFIG*` retirés.
`OPENCODE_CONFIG` est additif, `OPENCODE_CONFIG_DIR` n'est pas un interrupteur fiable, `OPENCODE_HOME`
n'est pas documenté, et `--pure` n'est pas documenté en v2, donc ne peut pas être la solution
retenue. L'export du run ne porte pas le prompt assemblé, et la documentation v2 ne dit pas qu'il
l'exporte.

Mécanisme : le lanceur crée `$RACINE/<cas>/environnement/{home,xdg}` ; il démarre `opencode serve`
avec ces deux variables et les transmet à `run`. `faits.json` gagne un bloc `environnement`
(`home`, `xdg`, `isole: true|false`, `version`, `modele`, `prompt_systeme: "non_exporte"`). Si
`isole` est faux, `fin` ajoute la limite `environnement_non_isole` et `instructions_globales:
inconnues`. Un canari prouve l'isolement : une fixture dont le `$HOME` porte un `AGENTS.md` et un
skill marqueurs, avec un `XDG_CONFIG_HOME` vide ; la trace du run ne doit contenir aucun marqueur.

Contrôle 282 : deux canaris, l'un sous `$HOME/.config/opencode`, l'autre sous `$HOME/.agents/skills` ;
le run de banc doit rendre `isole: true` et zéro occurrence des marqueurs. Coût : deux variables, un
champ, un contrôle.

**C2. Toute règle a un falsificateur, ou elle est dite `juge_seul`.**

Défaut : `produit.regle` peut contenir une clause qu'aucun falsificateur ne mesure ; le juge décide
alors sans mesure, et le verdict n'est pas reproductible. C'est exactement E2.

Mécanisme : `attendu_details.produit.regles[]`, chaque entrée portant `id`, `texte`, et soit
`mesure: <id de falsificateur>`, soit `juge_seul: true` avec une raison. `unite_de_borne` vaut
`test_fonction`, `cas_de_test` ou `comportement`, et la demande doit employer la même unité. `fin`
imprime `regles_sans_mesure` ; une règle `juge_seul` est admise mais affichée. Le gel refuse une
règle sans `mesure` ni `juge_seul`, et une unité absente.

Contrôle 285 : un cas dont une règle n'a ni mesure ni `juge_seul` est refusé au gel. Contrôle 286 :
un cas dont la règle dit « au plus deux tests » sans `unite_de_borne`, et dont le produit porte quatre
fonctions pour deux comportements, est refusé au gel, avec la règle et le produit cités. Coût : un
champ, un refus, deux contrôles.

**C3. Détecter la question dans tout le message, pas sur sa dernière ligne.**

Défaut : `ouvrir` exige que la dernière ligne hors bloc de code finisse par `?`. Une question
parfaitement lisible suivie d'une consigne (« Reply "oui" to start writing, ») est refusée, et la
pause est jouée à la main, hors du harnais. Le run a payé ce refus.

Mécanisme : le détecteur lit le dernier texte d'assistant hors blocs de code, et cherche un `?` dans
tout le message. Si une question existe, `ouvrir` joue la réponse figée et attend ; `pause.par` vaut
`ouvrir` ou `main`. Quand la réponse a été envoyée par le CLI, `suite` porte la limite
`pause_hors_harnais` et `pause.mesuree` reste vrai seulement si un tour `user` est présent.

Contrôle 283 : une fixture dont le message finit par « Reply "oui"… » et dont la question est au
milieu ; `ouvrir` doit accepter, envoyer la réponse et mesurer la pause. Coût : une fonction, un
champ, un contrôle.

**C4. Les options documentées existent, ou elles disparaissent.**

Défaut : `fin --sans-ecrire` est dans l'usage et au §4 du protocole, le parseur rend `exit 2`. Une
page qui promet une option absente est un piège pour l'opérateur.

Mécanisme : implémenter l'option (le à-blanc s'obtient déjà en omettant `--verdict`, donc
l'implémentation est triviale) ou la retirer des deux pages. Un contrôle rejoue chaque option
documentée avec une fixture et vérifie que le parseur ne rend pas `2`. La liste des options vient de
l'usage, pas d'une page séparée.

Contrôle 284 : `fin --sans-ecrire` sur un run de fixture rend `0` et n'écrit rien, ou l'option n'est
plus documentée nulle part. Coût : une ligne, un contrôle.

**C5. Attribuer le verdict à une couche.**

Défaut : `conforme|ecart|non concluant` ne dit pas **qui** a fauté. Un `ecart` peut venir du skill,
du cas, du harnais, de l'environnement, de la session ou d'une cause inconnue. Le rapport actuel
nomme le produit et l'attendu, jamais la couche fautive ; ici la session a dépassé la borne, et le
rapport ne le dit pas comme une attribution.

Mécanisme : `attribution` obligatoire pour `ecart` et `non concluant`, avec un vocabulaire fermé :
`skill`, `cas`, `harnais`, `environnement`, `session`, `inconnu`. `attribution_detail` porte une
phrase qui cite la pièce. `fin` refuse un `ecart` sans attribution ; `inconnu` est admis avec la
limite `cause_non_etablie`. Le rapport imprime l'attribution dans le bloc `▸ VERDICT`.

Contrôle 287 : un `ecart` sans attribution est refusé, avec le texte du refus recopié ; un `ecart`
avec `attribution: cas` s'écrit et se relit. Coût : deux champs, un refus.

### P1, avant de généraliser

**C6. Le modèle est une variable déclarée, pas un détail.**

Défaut : le skill déclare `model: sonnet`, le run tourne sur un modèle gratuit, et rien ne le dit
comme une limite. Un résultat sur un modèle n'est pas un résultat sur un autre.

Mécanisme : `ouvrir` lit `model:` du skill et l'utilise par défaut ; si `--modele` diffère, `faits`
porte `modele_du_skill` et `fin` ajoute `modele_non_conforme`. Le modèle effectif reste dans
`session.modele`, comme aujourd'hui.

Contrôle 288 : un skill à `model: sonnet` lancé avec un autre modèle rend la limite, et le reçu la
cite. Coût : une lecture de frontmatter, un champ.

**C7. Vérifier le produit, pas seulement son code de sortie.**

Défaut : `9 passed` prouve que la suite s'exécute, pas qu'elle détecte. C'est le cœur de L3.

Mécanisme : le cas déclare un bloc `verification` (`commande`, `attendu_code`, `delai`) exécuté sur
la copie collectée, hors réseau, avec un délai. Pour un skill qui produit des tests, il déclare en
plus `mutations[]` : deux ou trois fautes choisies à la main, chacune avec `fichier`, `remplacement`
et `doit_echouer: true`. Sur chaque mutant, la suite doit échouer ; le reçu porte `mord: true|false`
par mutant et `mutants_survivants`. Le seuil n'est pas un score universel : **100 % des fautes
critiques doivent être tuées**, et les mutants non couverts, les délais et les erreurs sont comptés
séparément. Le seuil agrégé de 80 % / 90 % des sources est un point de départ, pas une norme.

Contrôle 289 : une fixture avec un test qui passe sur l'original et sur le mutant ; `verifier` doit
rendre `mord: false` et nommer le mutant. Coût : quelques secondes par mutant, aucun réseau.

**C8. Le contrat du skill est une liste mesurable.**

Défaut : le skill dit « une action par run », « jamais de couplage à l'implémentation », « ne
compromets jamais la qualité pour la vitesse ». Ces phrases ne sont pas mesurées ; la trace peut les
tenir ou non, et le reçu n'en sait rien.

Mécanisme : `contrat[]` dans l'attendu, une entrée par obligation du `## Test` et de l'action lue,
avec `mesure` (chemin lu, geste, falsificateur) ou `juge_seul`. `fin` imprime `contrat_non_tenu`.
Pour `06-test`, cinq obligations suffisent : lire l'action, lister les comportements non testés,
attendre l'accord, écrire le fichier demandé, itérer jusqu'au vert. Le « jamais de couplage » reste
`juge_seul`, avec la lecture du produit comme preuve.

Contrôle 290 : un contrat dont une obligation n'a ni mesure ni `juge_seul` est refusé. Coût : un
bloc, une passe de lecture.

### P2, pour la durée

**C9. Famille de cas et variantes.** Un cas gelé ne se réécrit pas ; une correction du harnais ou du
cas demande un nouveau cas. Sans clé de famille, deux runs du même skill ne se comparent pas.
`famille` vaut `sha256(texte de la demande + chemin du skill + révision)` ; `variante_de` cite l'id
du cas précédent ; l'index groupe par famille. Le cas gelé reste immuable, la variante le cite.
Coût : deux champs, un regroupement d'index.

**C10. Revue externe déclarée.** Aucun agent `thinker` ou `reviewer` n'est disponible dans cette
session ; le seul agent invoqué est `researcher-web`, sur des questions, pas sur mes conclusions.
La revue de ce brainstorm est donc interne. `relecture: {par, modele, independant}` porte le fait ;
sans second modèle ou client, `independant: false` et la limite `revue_interne`. On ne dit jamais
« revue indépendante » sans pièce.

**C11. Corriger `06-test` lui-même.** Le skill ne demande pas de couvrir tous les comportements
listés, ne donne aucun exemple de ce qui est un couplage, et ne tranche pas le lot contre le un par
un. Une ligne suffit : « pour chaque comportement listé, teste-le, diffère-le avec une raison, ou
écarte-le avec une raison ». Un exemple de mock à la frontière (comme celui du run) et un contrexemple
(mock d'une fonction privée) ferment l'ambiguïté. C'est une modification du framework, donc une spec
séparée, pas un ajout au dispositif.

**C12. Campagne L4.** Un cas n'est discriminant que s'il refuse un skill mutilé. La campagne retire
une règle du skill (par exemple « attends l'accord »), rejoue le cas, et exige `ecart` ou
`non concluant` avec `attribution: skill`. Elle se joue par révision majeure, pas à chaque run, et
son coût est celui d'un run. C'est la seule preuve de L4, et elle vaut d'être faite au moins une fois
par famille de skill.

## 7. Les invariants à ajouter au protocole

1. **L'instrument s'audite avant le gel.** Une règle sans mesure, une unité non dite, un
   falsificateur qui ne mesure pas sa règle : le gel refuse, ou la limite le dit.
2. **Aucun verdict sans attribution.** `ecart` et `non concluant` nomment la couche ; `inconnu` est
   une réponse, pas une omission.
3. **L'isolement se mesure, il ne se suppose pas.** Un canari, un bloc `environnement`, et une limite
   quand le `HOME` n'est pas neuf.
4. **Une suite verte est une exécution, pas une validité.** L3 demande une faute injectée ; sans
   elle, le reçu dit `produit_non_eprouve`.
5. **La trace n'est pas la session.** Le prompt système absent est une limite nommée, jamais un
   blanc.
6. **Même cas, même environnement, même modèle.** Sinon c'est une variante, et elle le dit.
7. **Les rôles se séparent par les pièces et le temps, pas par une déclaration.** Une revue interne
   se dit interne.
8. **Un cas gelé ne se réécrit pas.** Une correction produit une variante qui cite l'original.

## 8. Le plan

**Phase 0, bloquante.** Une spec pour C1, C2, C3, C5, et les contrôles 282, 283, 285, 286, 287. Le
critère de sortie : un run de fixture isole, détecte la question au milieu du message, refuse une
règle sans mesure, refuse un `ecart` sans attribution. Aucun code avant la spec (règle du dépôt).

**Phase 1, mesures.** C4, C6, C7, C8, et les contrôles 284, 288, 289, 290. Le critère de sortie : un
run de fixture rend `mord: true` sur une faute critique, `modele_non_conforme` quand le modèle
diffère, et le contrat du skill est cité ligne par ligne.

**Phase 2, durée.** C9, C10, C11, C12. La famille et les variantes d'abord, parce qu'elles rendent
les rejeux comparables ; la campagne L4 ensuite, sur une famille à la fois ; la correction de
`06-test` dans une spec de framework séparée.

**Le prochain run de `06-test`** est une variante : même demande, unité dite, « deux comportements,
deux fonctions de test au plus, cas paramétrés libres », isolement neuf, modèle déclaré, bloc
`mutations` avec deux fautes (par exemple retirer le recentrage 8 bits et faire retomber ffmpeg sur le
repli WAV), et attribution obligatoire. Il ne remplace pas le run `ecart` ; il le suit.

## 9. Sources

Locales : les liens du chapeau, plus [PROTOCOLE](../PROTOCOLE.md) §1, §2, §4 et §6, [BANC](../BANC.md),
et le skill `06-test` sous `fe48de12`.

Web, pour l'isolement : la [CLI v2](https://opencode.ai/v2/docs/cli/), les
[commandes v2](https://opencode.ai/v2/docs/cli/commands/), la [config v2](https://opencode.ai/v2/docs/config/),
les [instructions v2](https://opencode.ai/v2/docs/instructions/), les [skills v2](https://opencode.ai/v2/docs/skills/),
les [plugins v2](https://opencode.ai/v2/docs/plugins/) et les [réglages CLI](https://opencode.ai/v2/docs/cli/config).
La recette `HOME` + `XDG_CONFIG_HOME` est une recommandation adossée à ces pages ; le code 2.1.0 n'a
pas pu être lu, donc le canari de C1 est la vérification, pas la documentation.

Web, pour l'évaluation : la [théorie du mutation testing](https://cosmic-ray.readthedocs.io/en/latest/theory.html),
[PIT](https://pitest.org/quickstart/basic_concepts/), [SkillsBench](https://arxiv.org/html/2602.12670v1),
le [guide d'évaluation de skills d'OpenAI](https://developers.openai.com/blog/eval-skills), l'audit
[SWE-bench Verified](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/), les
[attaques de benchmarks](https://rdi.berkeley.edu/blog/trustworthy-benchmarks-cont/), le
[bruit d'infrastructure](https://www.anthropic.com/research/infrastructure-noise) et le
[harnais SWE-bench](https://www.swebench.com/SWE-bench/reference/harness/). Les chiffres cités dans
C7 (100 % des fautes critiques, 80 % / 90 % en agrégé) sont des points de départ d'ingénierie, pas
des normes établies.

## 10. Ce que ce brainstorm ne prouve pas

- Les douze corrections ne sont pas implémentées, ni leurs contrôles joués. Ce sont des propositions,
  pas des résultats.
- La source de `rtk` est une inférence : la convention est absente du terrain et du cas, un skill
  global du même nom existe, mais le prompt système n'est pas exporté, donc l'origine exacte reste
  `UNKNOWN`.
- L'isolement d'opencode 2.1.x par `HOME` + `XDG_CONFIG_HOME` est adossé à la documentation v2, pas
  au code 2.1.0 ; le canari doit le trancher avant de s'y fier.
- Le seuil de mutation est une recommandation, pas une mesure ; il dépend des fautes choisies.
- L'`ecart` est fondé sur la règle : quatre fonctions pour deux comportements dépassent « au plus
  deux tests, un par comportement ». L'audit ne le conteste pas ; il constate que le cas ne l'a pas
  mesuré et que le reçu ne l'attribue pas.
- Aucune revue externe n'a eu lieu : les rôles du §3 sont une organisation interne, pas une preuve
  d'indépendance.

**Prochaine action** : écrire la spec de la phase 0 (C1, C2, C3, C5) et ses cinq contrôles de banc,
avant toute modification du harnais.
