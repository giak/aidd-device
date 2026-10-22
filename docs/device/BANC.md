---
name: BANC — le banc du harnais
description: Les 258 contrôles qui éprouvent les refus et les acceptations de run.mjs, du contrôle de liens, de l'orchestrateur, du rapport technique et de la page utilisateur, où ils vivent, comment les lancer, ce qu'ils touchent et ce qu'ils ne prouvent pas
type: banc
status: in-progress
---

# BANC — le banc du harnais

> V0.1 — 2026-10-16. Reprend le banc jetable `/tmp/banc-porte.sh`, né le 2026-10-15 avec la porte
> (ADR-018) puis étendu au reste du harnais (ADR-020). Il change de nom en changeant de foyer :
> « porte » ne nomme que la première des six commandes qu'il éprouve aujourd'hui ; les ADR-018 et 020,
> datées, gardent l'ancien nom tel qu'elles l'ont écrit. V0.2 — 2026-10-18 : 118 contrôles, le groupe
> 113 à 118 éprouve la forme mécanique du tableau (H6, ADR-035). V0.3 — 2026-10-18 : **130** contrôles,
> le groupe 119 à 130 traverse le **cas jouet** de bout en bout (ADR-036). V0.4 — 2026-10-18 : **148**
> contrôles, le groupe 131 à 148 éprouve l'**orchestrateur interactif** (ADR-038 à 040) : les douze refus
> du §7 de sa spec, un cas fabriqué puis gelé, un reçu de bout en bout, et le compte des lignes d'un bloc.
> V0.5 — 2026-10-18 : **153** contrôles ; 149 à 153 : `cas` crée son dossier `--cases`, un dépôt de skill ou un
> terrain sale est **refusé** et `--tel-quel` porte l'arbre de travail (ADR-042), et l'annexe du guide est
> comparée à l'usage réel de l'orchestrateur — la page ne peut plus nommer une option qui n'existe pas.
> V0.6 — 2026-10-18 : le compte ne bouge pas, **153** ; le contrôle 153 s'étend à `ORCHESTRATEUR.md` : ses
> cinq commandes et leurs options contre l'usage réel, et ses douze refus contre la table du §7 de la spec,
> les contrôles « refus N » du banc et le texte que le code écrit — les deux pages qui parlent des commandes
> ne peuvent plus mentir en silence. V0.7 — 2026-10-20 : **171** contrôles ; 154 à 171 éprouvent les deux
> clients (ADR-043 à ADR-046) : `faits` et `receipt` opencode sur fixtures, l'ambiguïté de `suite`, le
> budget, le premier message, le JSONL rejoué, et l'ordre écriture/tableau par ligne. V0.8 — 2026-10-20 :
> **172** contrôles ; le contrôle 172 accepte un tableau d'une colonne, après le faux négatif du premier
> run opencode réel (ADR-047). V0.9 — 2026-10-20 : **174** contrôles ; 173 et 174 confrontent la phrase
> du juge au nombre de colonnes mesuré dans le reçu, après la phrase fausse du second run opencode
> (ADR-048) : le 173 refuse « six colonnes » contre un reçu à une, le 174 accepte « une colonne » et
> écrit l'output. V0.10 — 2026-10-20 : **175** contrôles ; le 175 lit la durée de `porte` dans les deux
> reçus réels du cas jouet — 2 runs, 9 min 42 s à 15 min 50 s, 2 modèles, 1 outil — au lieu d'une
> constante. V0.11 — 2026-10-21 : **178** contrôles ; 176 à 178 éprouvent la lecture hors du dossier du
> cas (ADR-049), après le run qui avait lu le kit d'un autre cas. V0.12 — 2026-10-21 : **186** contrôles ;
> 179 à 186 éprouvent le `RAPPORT.md` déterministe (ADR-050), écrit par `fin` et reconstructible par la
> commande `rapport`. V0.13 — 2026-10-21 : **187** contrôles ; le 187 part d'un reçu `ecart` sans
> falsificateur et exige que la différence de l'output soit recopiée et qu'une piste en soit dérivée,
> après le run neuf de la Séance 83. V0.14 — 2026-10-21 : **188** contrôles ; le 188 part du même reçu
> `ecart`, y ajoute un falsificateur `tableau_absent` et garde `output.difference` : la morsure et la
> différence coexistent au §5, et le §7 porte la piste de la morsure **et** celle de la différence.
> V0.15 — 2026-10-21 : **189** contrôles ; le 189 retire différence, morsure et limite à un reçu
> `ecart` : le repli `Aucune action dérivée ; relire le reçu et le produit.` doit rester, et la
> section ne doit pas se vider. V0.16 — 2026-10-21 : **190** contrôles ; le 190 passe un reçu en
> `non concluant` avec une différence non vide, et exige que ni le §5 ni le §7 ne la nomment.
> V0.17 — 2026-10-21 : **193** contrôles ; 191 à 193 éprouvent le bloc `cloisonnement` (ADR-052) :
> le reçu porte les racines déclarées, un cadre rétréci fait mordre une lecture restée dans le dossier
> du cas, et un bloc absent est refusé — le harnais ne retombe jamais sur l'ancienne constante.
> V0.18 — 2026-10-21 : **201** contrôles ; 194 à 201 éprouvent les **effets hors cadre** (ADR-051) :
> la commande d'une part `shell` entre dans la trace, et le reçu en lit les chemins littéraux — lecture
> hors du cadre, écriture hors du produit, appel réseau, commande non interprétable — plus les fichiers
> nouveaux du `porcelain` hors du produit. 194 à 197 refusent `conforme` et nomment la morsure ; 198
> fait d'un fichier de contexte un `non concluant`, 199 d'un fichier de produit un `ecart` ; 200 et 201
> sont les positifs : des commandes littérales (`$?`, apostrophes, `\$`) et une affectation résolue
> entre guillemets restent `conforme`, et 201 lit `commande` dans la trace.
> V0.19 — 2026-10-21 : **203** contrôles ; 202 et 203 éprouvent le **puits `/dev/null`** (ADR-053) :
> une redirection ou un argument qui le cible ne mord ni en lecture ni en écriture et `conforme` passe,
> la limite le nomme, et `/dev/nullx` reste un chemin ordinaire que les deux falsificateurs retiennent.
> Le 175 ne compte plus les runs réels du cas dans une constante : il lit les `receipt.json` du dossier,
> pour qu'un run de plus ne fasse pas rougir le banc.
> V0.20 — 2026-10-21 : **205** contrôles ; 204 et 205 éprouvent la seconde forme de **F7** (ADR-054) :
> un produit octet pour octet identique à un fichier lu avant sa naissance mord et nomme les deux
> chemins, et une lecture ordinaire au contenu différent ne mord pas.
> V0.21 — 2026-10-21 : **207** contrôles ; 206 et 207 éprouvent les deux **exclusions** de F7 : une
> lecture postérieure à la naissance du produit et une relecture du produit lui-même ne mordent pas, et
> les deux contrôles exigent la limite d'ADR-054 pour qu'une fixture non lue ne passe pas pour un silence.
> V0.22 — 2026-10-21 : **209** contrôles ; 206 corrigé (il lit désormais la seconde **suivante**, et non
> plus la seconde d'égalité) et 208-209 éprouvent la **frontière d'égalité** de F7 (ADR-055) : une lecture
> dans la seconde de naissance ne mord pas et le reçu nomme l'indécision, une lecture dans la seconde
> précédente mord encore et nomme la copie.
> V0.23 — 2026-10-21 : **211** contrôles ; 210 éprouve `cas` **sans `--id`** quand le skill est un fichier
> (`PLAYBOOK.md` donne `<horodatage>-playbook`), et 211 exige que le `obtenu` de `porte` recopie la ligne
> de `preflight` entière, `gate.json` compris, sans la coupe à 220 caractères.
> V0.24 — 2026-10-21 : **213** contrôles ; 212 et 213 éprouvent deux formes que le lecteur `shell`
> confondait, mesurées sur le run `plan-simple` de la Séance 98 : la plage d'un `awk`
> (`'/^a$/,/^b$/'`) n'est pas un chemin, et la variable d'une boucle `for … in` littérale se résout au
> lieu de rendre la commande opaque. Le programme d'`awk` et le script de `sed` sont sautés ; une boucle
> non littérale, imbriquée, non fermée ou qui réaffecte sa variable reste refusée.
> V0.25 — 2026-10-21 : **217** contrôles ; 214 à 217 éprouvent la substitution de commande **bornée**
> (ADR-056), née du run `plan-simple` de la Séance 99 : `$(grep -c plan README.md)` est lue, ses effets
> internes sont mesurés, sa valeur reste inconnue et ne devient jamais un chemin ; une substitution
> imbriquée reste refusée.
> V0.26 — 2026-10-21 : **221** contrôles ; 218 à 221 éprouvent `xargs` et `find -exec` **littéraux**
> (ADR-057) : la commande interne est lue, ses effets mesurés, `{}` reste une valeur inconnue, et un bloc
> `-exec` sans terminateur reste refusé.
> V0.27 — 2026-10-21 : **223** contrôles ; 222 et 223 éprouvent la **question sans réponse** (ADR-058),
> née du reçu `conforme` du cas `plan-simple` de la Séance 102 : une question posée par l'outil déclaré et
> suivie d'une écriture sans ligne `user` entre les deux mord et nomme les deux seq, la réponse entre les
> deux laisse le reçu muet, et `conforme` passe.

> V0.38 — 2026-10-22 : **258** contrôles ; 254 à 258 éprouvent la **question en texte** (ADR-072) : une
> question posée par un texte `assistant` dont la dernière ligne hors bloc finit par `?` reçoit la réponse
> figée du cas, une fois (254) ; un formulaire garde la priorité, puis une question en texte reçoit la
> réponse suivante sans double envoi (255) ; une troisième question, pour deux réponses figées, refuse en
> nommant le compte (256) ; un `?` dans un bloc de code ne déclenche aucun envoi (257) ; un rappel
> `<system-reminder>` terminé par `?` n’en est pas un (258). Le serveur factice
> des contrôles 224 à 227 sert les cinq modes, toujours sans réseau.
> V0.37 — 2026-10-22 : **253** contrôles ; 251 à 253 éprouvent la **conduite déclarée** (ADR-071) :
> `faits --conduite agent` écrit `conduite{mode, qui, quand}` sans `temoignage`, et le reçu le recopie avec
> la limite qui dit qu'elle est déclarée (251) ; `--conduite` absente ou hors de `agent | humain` sort en
> `2` sans écrire et le refus nomme les deux valeurs (252) ; un `faits.json` antérieur, qui ne porte qu'un
> `temoignage`, reste lisible : `conduite: null`, limite `conduite_non_declaree`, verdict inchangé (253).
> Le contrôle 125 compte toujours dix-huit valeurs, les trois clés de `conduite` remplaçant les trois de
> `temoignage`.
> V0.36 — 2026-10-22 : **250** contrôles ; 249 et 250 éprouvent la **phase 2 du protocole**
> (ADR-070) : une commande au guillemet simple non fermé tombe dans `shell_invalide`, laisse
> `shell_non_interpretable` vide, fait refuser `conforme` en nommant la faute de session et porte une limite
> par entrée (249) ; une commande valide que le lecteur ne suit pas reste `shell_non_interpretable`, avec une
> limite par entrée qui nomme le seq et ce qui reste non prouvé, et la limite agrégée disparaît (250). Le
> 221 attend désormais `shell_invalide`, et le 234 nomme la seizième clé. Le passage répare aussi le détail
> d'échec du banc : `controle` exporte `DETAIL`, et quarante-deux contrôles écrivent leurs raisons dans
> `process.env.DETAIL`, donc les raisons s'impriment sous `FAIL` comme le §5 le promettait.
> V0.35 — 2026-10-22 : **248** contrôles ; 244 à 248 éprouvent la **phase 1 du protocole**, née du run
> `spike-annees` (ADR-067 à ADR-069) : un fichier écrit et relu sous `terrain/.scratch/`, déclaré au gel,
> ne mord ni comme lecture ni comme écriture et n'est pas compté comme produit, alors qu'un fichier voisin
> hors du cadre mord encore (244) ; `collect --annexe` copie le scratch sous `annexe/<cas>/` avec son
> manifeste, le reçu le vérifie et le cite, et une retouche de l'annexe fait refuser le reçu (245) ; un
> attendu sans champ `tableau` mord toujours sur `tableau_absent` (défaut vrai), et une écriture sans aucun
> tour `user` mord sur `pause_non_tenue` (246) ; un attendu qui déclare `tableau.requis: false` ne mord plus
> et nomme la limite (247) ; le gabarit de `cas` demande le tableau, autorise le scratch, exige
> l'autosuffisance du produit et écrit les trois champs dans son squelette (248).
> V0.34 — 2026-10-22 : **243** contrôles ; 237 à 243 éprouvent la phase 0 du protocole, née du run
> `spike-annees` (ADR-062 à ADR-066) : un produit sous un dossier neuf ne mord plus sur son parent (237),
> un fichier d'un dossier déjà non suivi avant le run est sauté et un dossier neuf est nommé fichier par
> fichier (238), une écriture d'outil hors du cadre mord et nomme son seq (239), une écriture dans le
> cadre ne mord pas et un outil d'écriture sans chemin reste une limite (240), `$RACINE/<cas>/` se lit
> par égalité, son parent mord encore et la relecture de son propre fichier ne mord qu'une fois (241),
> `suite` écrit `last-message.md` et l'atteste (242), un dernier message retouché fait refuser le reçu
> quand un `faits.json` sans le champ rend une limite (243).
> V0.33 — 2026-10-22 : **236** contrôles ; 235 et 236 font refuser une lecture mal formée avant toute
> écriture, et `rapport` accepte `--cases` pour qu'une lecture de banc s'éprouve hors du dossier du dépôt.
> Ce passage rend effective la phrase du §3 de la spec du 2026-10-22 07:33, qui promettait un refus là où le
> code rendait « non observé » ; la validation vit dans `verifierLecture`, appelée par `lectureDe` et par
> `ecrireResultat`.
> V0.32 — 2026-10-22 : **234** contrôles ; le 229 exige que la section 1 ne dise jamais « la procédure
> attendue est tenue » quand une règle mord, et le 234 déclare d'un coup les quatorze règles que les reçus
> portent : chacune doit avoir sa phrase (aucun identifiant à tiret bas dans la section 5) et son conseil
> (une ligne par règle en section 6, plus la phrase du second run). Ce passage répare les deux défauts
> relevés par l'audit : un `ecart` qui portait une morsure affichait « 2 violés » puis « la procédure
> attendue est tenue », et trois règles n'avaient aucun conseil.
> V0.31 — 2026-10-22 : **233** contrôles ; 231 et 232 écrivent la page des deux autres cas gelés depuis une
> copie de leur run réel, et 233 tient le vocabulaire fermé de toutes les lectures déclarées. Le premier
> exige les trois états sur un même reçu (« violé » pour la lecture hors dossier, « non observé » pour la
> question que ce reçu ne mesure pas) et la page sous son plafond de 80 lignes, ce run portant 22 fichiers
> produits dont cinq sont liés ; le second, tous les gestes tenus sur un run `conforme`. Ce passage a
> révélé un refus trop large : sur un produit qui ne correspond pas au chemin attendu, la page citait
> `raw/…` dans son tableau et se refusait elle-même ; `resultat.mjs` nomme désormais le fichier sans ce
> préfixe, et les contrôles 185, 186 et 194 à 197 repassent.
> V0.30 — 2026-10-22 : **230** contrôles ; 228 à 230 éprouvent la **page utilisateur** (`RESULTAT.md`,
> ADR-061) : huit sections, aucune ligne du dedans dans le corps, une ligne par geste déclaré, les trois
> états d'un geste (« tenu », « violé », « non observé »), deux appels sur les mêmes pièces rendant le même
> octet, et le refus d'écraser un `RESULTAT.md` sans `--remplacer`. Un geste sans mesure ne dit jamais
> « tenu ».
> V0.29 — 2026-10-22 : **227** contrôles, compte inchangé ; l'attendu du 175 est **recalculé** depuis les
> `receipt.json` du dépôt — nombre de runs, minimum, maximum et fourchette arrondie, avec la définition du
> code (`ouverte_le` → `recu_ecrit_le`) — au lieu d'être figé : deux runs réels de plus l'ont fait rougir
> alors qu'aucun code du harnais n'avait changé, et le contrôle mesurait alors le dossier, pas `porte`.
> V0.28 — 2026-10-22 : **227** contrôles ; 224 à 227 éprouvent `ouvrir` (ADR-059), la commande qui ouvre
> la session opencode par l'API et joue la pause : aucune porte et un `opencode` absent du `PATH` sont
> refusés, un **serveur factice** (les cinq routes de l'API, en `node:http`) reçoit le texte de la porte
> octet pour octet puis la réponse figée, répond au formulaire par l'option marquée Recommandé avec
> `exit 0` et un dossier de run intact, et un serveur qui pose trois questions pour deux réponses figées
> fait refuser la troisième. Rien n'ouvre de vraie session, rien ne touche au réseau.

**En une phrase.** Il rejoue à blanc les refus et les acceptations du harnais, 258 contrôles, sans ouvrir
aucune session et sans écrire dans le dépôt. Il éprouve quatre instruments du dossier `harness/` :
`run.mjs`, le harnais du run (contrôles 1 à 60, puis 64 à 118, puis 119 à 130 — les douze derniers
traversent un cas entier) ; `liens.mjs`, le contrôle de liens des documents du dépôt (contrôles 61 à 63) ;
`orchestrer.mjs`, l'orchestrateur interactif (contrôles 131 à 153, qui traversent un cas **fabriqué** par
lui) ; `rapport.mjs`, la vue déterministe du reçu (contrôles 179 à 190). Il éprouve aussi l'adaptateur
`clients.mjs` sous un faux `opencode` (contrôles 154 à 171), la lecture hors du **cadre déclaré**
(contrôles 176 à 178), le bloc qui déclare ce cadre (contrôles 191 à 193), et les effets d'une
commande `shell` lus dans son texte (contrôles 194 à 201), et le puits `/dev/null` qui n'est ni un
chemin lu ni un chemin écrit (contrôles 202 et 203), et deux formes de commande que le lecteur
confondait, la plage d'un `awk` et la variable d'une boucle littérale (contrôles 212 et 213), et la
substitution de commande bornée, lue sans que sa valeur devienne un chemin (contrôles 214 à 217), puis
la commande interne d'`xargs` et de `find -exec` (contrôles 218 à 221), la question que la première
écriture suit sans réponse (contrôles 222 et 223), la session qu'`ouvrir` ouvre et conduit par l'API
(contrôles 224 à 227), puis la question posée en texte, jouée sans formulaire (contrôles 254 à 258), et la page utilisateur que `resultat.mjs` écrit (contrôles 228 à 230), puis les
lectures des deux autres cas gelés (contrôles 231 à 233), et une phrase et un conseil pour chaque règle
que les reçus portent (contrôle 234), le refus d'une lecture mal formée, sans qu'aucune pièce ne
s'écrive (contrôles 235 et 236), puis la phase 0 de l'instrument (contrôles 237 à 243) : le produit sous
un dossier neuf, le dossier déjà non suivi, l'écriture d'outil mesurée, la racine du cas lue par égalité,
et le dernier message écrit et attesté par `suite` ; enfin la phase 1 du protocole (contrôles 244 à 248) :
le scratch déclaré, collecté en annexe et jamais produit, le tableau que le cas peut ne pas demander, et la
pause mesurée par un tour de la personne, sans l'outil `question` ; et la phase 2 (contrôles 249 et 250) :
une commande mal formée séparée d'une commande que le lecteur ne suit pas, chacune avec sa limite par entrée ;
et la conduite déclarée (contrôles 251 à 253) : le mode `agent` écrit dans `faits.json` et recopié par le reçu,
la valeur absente ou hors domaine refusée en `2`, et un faits antérieur lu avec `conduite: null`.

## 1. Le lancer

```text
bash docs/device/harness/banc-harnais.sh          → 258/258 PASS, exit 0
node docs/device/harness/liens.mjs                → 0 lien mort, exit 0 (le compte des liens s'imprime)
bash docs/device/harness/banc-harnais.sh <cas>    → le même banc sur un autre cas gelé
```

Chaque contrôle s'imprime `PASS` ou `FAIL` avec le code de sortie vu et celui qui était attendu ; le
dernier mot est le compte, `258/258 PASS`, et le script sort en `0` seulement si tout passe. Un `FAIL` est
une information : le dossier jetable du passage est imprimé au départ et conservé, c'est là que vivent
les gels faux et les manifestes recollés qui l'ont produit.

## 2. Ce qu'il exige avant de commencer

Il lit son dispositif dans le **gel du cas**, jamais dans une constante : la racine des espaces de travail
et les quatre arbres viennent de `racine_espace_de_travail` et de `arbres[].chemin` (ADR-019). Depuis
V0.17, le cadre des lectures n'est plus une constante non plus : il vient du bloc `cloisonnement` de
l'attendu du cas, que les contrôles 191 à 193 éprouvent et que `receipt` refuse d'inventer (ADR-052).
Aucun chemin de cette machine n'est écrit dans le script, qui retrouve aussi le dépôt par sa propre position.

Trois arrêts, `exit 2`, avant le premier contrôle :

| Ce qui manque | Ce qu'il dit |
| --- | --- |
| le gel du cas | `ARRET — gel absent` : il éprouve le harnais sur un gel réel, il ne le fabrique pas |
| `racine_espace_de_travail` au gel | `ARRET — le gel ne déclare pas racine_espace_de_travail (gel d'avant l'ADR-019)` |
| l'espace de travail du cas | `ARRET — l'espace de travail du cas n'est pas là` : re-geler, ou lancer depuis la machine qui l'a gelé |

Un banc dont la pièce est absente compterait des accidents comme des refus : il se tait plutôt.

Il lui faut `bash`, `node`, `sqlite3` (les contrôles 47 à 50, 66 à 118, 124 à 129 et 139 à 143 lisent une
base de client factice ; les 154 à 171 ajoutent un faux `opencode` et un store de bac), `git` (les contrôles 133 à 152 fabriquent un cas : copie, clones, gel), un cas gelé
et son espace de travail ([REPLAY.md](REPLAY.md) rejoue le gel depuis un clone neuf), et — depuis V0.3 — les
deux pièces du cas jouet avec son script compagnon : il s'arrête en `exit 2` s'ils manquent, comme du gel du
cas réel. Ces outils-là
ne sont pas supposés : `run.mjs` les déclare au `--help` et les sonde au démarrage, et les contrôles 57 à
60 lui donnent un `PATH` amputé pour l'entendre refuser ([ADR-026](../DECISIONS.md)). Le banc, lui, ne
sonde pas sa propre machine : il s'arrête ( `exit 2`) si le gel ou l'espace de travail manque, et laisse
une panne d'outil se voir dans un `FAIL`.

## 3. Ce qu'il touche, et ce qu'il ne touche pas

- Un dossier jetable sous `$TMPDIR`, `mktemp -d`, imprimé au départ et conservé pour inspection.
- **Un lien symbolique**, écrit puis retiré, dans l'espace de travail du cas (contrôles 40 et 41 ; le 41
  échoue si l'espace n'est pas rendu propre). C'est la seule écriture hors du dossier jetable ; sous
  `$B`, les contrôles 198 et 199 écrivent puis retirent `AGENTS.md` et `aidddocs/NOTES.md` dans l'arbre
  du **jouet**, qui est reconstruit dans le bac.
- Jamais le dépôt, jamais les quatre arbres, jamais `run.mjs`. Aucune session n'est ouverte. Aucune porte
  n'est écrite à la main : les contrôles 104 à 108 et 112 partent d'un `gate.json` produit par `preflight`,
  puis retouchent un seul champ. Depuis V0.3, il **lit** `CASES/` — les deux pièces du jouet et son script —
  et n'y écrit jamais : le cas jouet est reconstruit et re-gelé sous `$B`.
- Depuis V0.4, il fabrique un cas **sous `$B/orch` uniquement** : les deux origines, leurs clones, les deux
  pièces et le gel ne quittent pas le dossier jetable, et `--cases` pointe toujours là. Le fil de `suite`
  est une ligne de la base du banc, recopiée dans un `$HOME` jetable (`$B/orch/home`), jamais lue dans la
  vraie base du poste : l'orchestrateur découvre la base par `$HOME`, comme sur une machine neuve.

## 4. Les contrôles, par groupe

| Contrôles | Ce qu'ils éprouvent | Livre |
| --- | --- | --- |
| 1 à 13 | la porte, `preflight` : le dossier que le gel nomme, huit mauvais, et le `gate.json` qu'elle écrit dans `--run` | ADR-018, ADR-034 |
| 14 à 20 | non-régression du reste : le reçu sur le dossier gelé, les refus d'origine, `--help` | — |
| 21 à 31 | la racine déclarée : gel, garde du cas, texte substitué | ADR-019 |
| 32 à 46 | l'origine du produit : `collect` exige l'espace gelé, le reçu relit le manifeste | ADR-020 |
| 47 à 50 | les faits : dérivés du fil et du gel, puis refusés quand le fil est inconnu, quand le chemin ne résout pas, quand le fil vit dans un worktree | ADR-024 |
| 51 à 56 | les chemins du `faits.json` relus par `receipt` : répertoire de travail absent (refus, et le message nomme la résolution), dossier de la trace absent (refus, message à l'appui), travail ouvert par un lien vers l'arbre gelé (accepté), trace absente sous un dossier présent (acceptée, limite du §7 écrite) | ADR-025 |
| 57 à 60 | les prérequis, déclarés et sondés : `sqlite3` absent, `date` qui n'obéit pas, `git` absent — trois refus qui nomment l'outil — et le `--help` qui les déclare | ADR-026 |
| 61 à 63 | le contrôle de liens : le dépôt sans lien mort (accepté), un lien mort en prose (refusé, nommé), une citation `](…)` entre backticks (acceptée, comptée comme motif écarté) | ADR-027 |
| 64 à 65 | `session.identifiant` rattaché au fil que la commande d'export lit : un autre fil (refusé, nommé), aucune mention de fil (refusé) | ADR-028 |
| 66 à 67 | l'export lu par le reçu : un échange dans la fenêtre du run (accepté, compté sous `trace_lue`), un échange hors fenêtre (accepté, condition 2 du §5 mordue et nommée). Le fichier n'est plus écrit à la main : il est la sortie de la commande que `faits` écrit, exécutée sur la base du banc ; le cas hors fenêtre se déplace dans la base (premier message sans part, message exporté une heure plus tard) | ADR-029, ADR-032 |
| 68 à 74 | la copie re-hachée : réécrite après `collect` (refus, empreinte nommée), supprimée (refus), fichier en trop (refus), intacte (acceptée et comptée), manifeste haché au reçu, chemin qui sort de `raw/` (refus), lien symbolique (refus) | ADR-030 |
| 75 à 86 | la base relue : champ `trace.base` absent, base absente, fil inconnu, répertoire hors de l'arbre, mode non local, worktree, modèle, heure d'ouverture, premier message, aucun message — dix refus nommés —, base concordante (acceptée, `session_verifiee` venue de la base), et `sqlite3` absent au reçu (refus nommé) | ADR-031 |
| 87 | `last-message.md`, écrit à la main sous `raw/<cas>/` après `collect` : admis et haché sous `produit.verifie` | ADR-030 |
| 88 à 96 | l'export rejoué — deux acceptations, sept refus : intact (accepté, `trace_lue.sha256` égal au fichier et `rejoue_le` écrit), un octet ajouté, lignes permutées, requête retouchée, autre base citée, autre chemin d'export cité, message ajouté à la base après l'export (refus, les deux empreintes à l'appui), `compare` sur une trace intacte (accepté), `compare` sur une trace réécrite entre le reçu et le juge (refus) | ADR-032 |
| 97 à 102 | le budget d'échanges mesuré contre les messages `user` du fil : un message sous le budget (accepté, `echanges{budget, utilises, epuise_par: null}`), trois messages pour un budget de trois (accepté, `epuise_par` nomme le seq 5 et son horodatage), quatre messages (refus nommant les deux chiffres, le seq en trop, et sans reçu écrit), le même avec `--verdict non concluant` (refus aussi : un dépassement n'est pas un plafond), attendu sans budget (refus), budget illisible (refus) — les deux derniers sur un cas recopié et **re-gelé** | ADR-033 |
| 103 à 112 | la porte tracée et confrontée : un reçu sans `gate.json` (refus, « aucune porte »), une porte d'un autre cas, d'un autre gel (cas re-gelé), d'un autre arbre, datée avant le gel (refus nommés), un HEAD commité après la porte dans le clone du banc (refus), une porte intacte (acceptée, `porte.sha256`, `porte.gel_empreinte` et `porte.arbre.head_complet` au reçu, et le juge re-hache), une porte déjà là et un `--run` manquant (refus de `preflight`) | ADR-034 |
| 173 à 174 | la phrase du juge confrontée au nombre de colonnes du reçu : sur un reçu à une colonne, une phrase qui en nomme six est refusée, `exit 1`, sans `output.json`, et le refus nomme les deux nombres (173) ; la même phrase qui en nomme une est acceptée et l'output est écrit sur une copie du run (174). La règle est mécanique : chiffres ou mots de `un` à `vingt` devant `colonne(s)` ; une négation ou un nombre composé n'est pas compris comme tel (le dernier mot d'un composé peut être lu), et un mot au-delà de vingt n'est pas lu | [ADR-048](../DECISIONS.md) |
| 175 | la durée de `porte` lue dans les reçus réels du cas jouet : le terrain propre est recopié sous `$B`, le gel du dépôt n'est pas touché, et la sortie doit nommer le nombre de runs, le minimum, le maximum et la fourchette arrondie **recalculés depuis les `receipt.json`** (`ouverte_le` → `recu_ecrit_le`) — un run réel de plus ne fait pas rougir le banc (ADR-053). Le contrôle a nommé en dur « 9 min 42 s à 15 min 50 s » et « 10 à 20 min » jusqu'au 2026-10-22 : deux runs de plus l'ont fait rougir sans qu'aucun code ne change | [ADR-053](../DECISIONS.md) |
| 176 à 178 | la **lecture hors du cadre déclaré** : un `read` de `$RACINE/autre-cas/kit.md` avant le tableau fait refuser `conforme` (176, refus nommé), et un reçu `non concluant` nomme la lecture, son `seq` et son chemin (177) ; une lecture de `$W/terrain/README.md` n'est pas signalée quand `terrain` est déclaré (178, `non concluant` pour la condition 3, pas pour la lecture). Les racines autorisées sont `cloisonnement.lecture.autorisees`, relatives à la racine du cas (ADR-052) ; les commandes `shell` restent hors de la trace normalisée et sont dites en limite | [ADR-049](../DECISIONS.md), [ADR-052](../DECISIONS.md) |
| 179 à 190 | le **rapport utilisateur** (ADR-050) : sur une copie du reçu `conforme`, `rapport` écrit un `RAPPORT.md` qui nomme le verdict, le produit, les liens et les preuves (179) ; sur le reçu `non concluant`, il nomme `tableau_absent` et le chemin produit (180) ; un rapport existant est refusé sans `--remplacer` et garde ses octets (181), `--remplacer` le réécrit (182) ; un run sans reçu est refusé sans écrire (183) ; `fin` écrit le rapport automatiquement et refuse une seconde fois quand il est déjà là (184) ; un reçu qui porte `lecture_hors_dossier` est nommé avec son `seq`, son outil et son chemin, et la piste du bac propre (185) ; un reçu qui n'a pas le champ dit qu'il précède l'ADR-049 et ajoute la limite, sans prétendre que les lectures sont propres (186) ; un reçu `ecart` sans falsificateur recopie `output.difference` et en dérive une piste, au lieu de « Aucune action dérivée » (187) ; le même reçu `ecart` porte aussi un falsificateur `tableau_absent`, et la morsure n'efface ni la différence recopiée ni sa piste (188) ; un reçu `ecart` sans falsificateur, sans limite et sans différence garde le repli `Aucune action dérivée ; relire le reçu et le produit.` (189) ; un reçu `non concluant` avec une différence non vide la tait au §5 et ne dérive pas sa piste au §7 (190). Deux appels de 179 rendent le même fichier (`cmp` par empreinte) | [ADR-050](../DECISIONS.md) |
| 191 à 193 | le **bloc `cloisonnement`**, le cadre lu au lieu d'être supposé (ADR-052) : le reçu de 178 porte `lecture.autorisees` avec `terrain` et `framework-origin`, `reseau: interdit` et `fichiers_de_contexte: interdits` (191) ; un cas recopié et re-gelé dont `lecture.autorisees` ne garde que `framework-origin` fait mordre une lecture de `terrain/README.md`, pourtant dans le dossier du cas, et le reçu porte le cadre rétréci (192) ; un cas recopié sans bloc est refusé par `receipt` — « ne déclare aucun bloc cloisonnement » —, sans reçu écrit (193). Le 192 prouve que la liste blanche est lue, le 193 qu'un bloc absent n'est pas remplacé par l'ancien défaut | [ADR-052](../DECISIONS.md) |
| 194 à 201 | les **effets hors cadre**, lus dans le texte des commandes `shell` (ADR-051) : `cat <ailleurs>/projet-brief.md` fait refuser `conforme` et le reçu nomme `shell_hors_dossier` avec la commande et son chemin, puis un `non concluant` s'écrit et `lecture_hors_dossier` reste vide (194) ; `echo x > <ailleurs>/ecrit.txt` donne `shell_ecriture_hors_produit` (195) ; `curl -s http://localhost:8010/mcp` donne `reseau` motif `curl` (196) ; `P=/tmp; echo x > $P/x` donne `shell_non_interpretable` motif « référence non quotée » et la limite qui dit les effets non mesurés (197) ; un `AGENTS.md` neuf sous `terrain` donne `hors_produit` `nature:"contexte"`, `conforme` refusé et `non concluant` accepté (198) ; un `aidddocs/NOTES.md` neuf donne `nature:"produit"`, `conforme` refusé et `ecart` accepté (199) ; `git status`, `cat aidd_docs/memory/api.md`, `true; echo $?`, `echo '$HOME'` et `echo \$HOME` ne mordent pas et laissent `conforme` (200) ; une affectation `T=<playbook>` suivie de `cp "$T" …` et `cp "${T}" …` est résolue dans les deux formes, aucun falsificateur ne mord, et la trace porte les deux `commande` (201). Chaque refus est relu par `rapport` : la morsure au §5, la piste au §7. Les 198 et 199 écrivent dans l'arbre du **jouet** sous `$B`, jamais dans le dépôt | [ADR-051](../DECISIONS.md) |
| 202 à 203 | le **puits `/dev/null`** (ADR-053) : `head -n 2 README.md 2>/dev/null; cp README.md /dev/null; ls -la` ne laisse aucune entrée dans `shell_hors_dossier` ni dans `shell_ecriture_hors_produit`, `conforme` est accepté et la limite nomme le puits (202) ; `cat /dev/nullx; echo x > /dev/nullx` laisse une entrée par chemin dans les deux listes — le nom qui commence par le puits n'est pas le puits —, `conforme` est refusé en nommant `shell_hors_dossier`, et `non concluant` s'écrit (203). Le 203 est le garde-fou du 202 : la règle compare le chemin entier, pas un préfixe | [ADR-053](../DECISIONS.md) |
| 204 à 205 | la **seconde forme de F7** (ADR-054) : le fil lit `framework-origin/COPIE.md`, copie exacte du produit, avant la naissance du produit — `produit_identique_a_une_empreinte_anterieure` porte `{chemin: "NOTES.md", source: …/COPIE.md, sha256, seq}`, `conforme` est refusé en nommant le fichier déjà présent, et `non concluant` s'écrit (204) ; le fil lit `framework-origin/PLAYBOOK.md`, au contenu différent — le falsificateur reste vide et `conforme` est accepté (205). La lecture est dans le cadre, donc seule F7 est en jeu | [ADR-054](../DECISIONS.md) |
| 206 à 207 | les **deux exclusions de F7** (ADR-054) : le fil lit `framework-origin/COPIE-APRES.md`, copie exacte du produit, dans la seconde **suivante** — F7 reste vide et `conforme` est accepté (206) ; le fil relit **le produit lui-même**, `terrain/aidd_docs/NOTES.md`, 10 s avant sa naissance — F7 reste vide et `conforme` est accepté (207). Les deux exigent la limite d'ADR-054, donc la lecture a bien été vue : une fixture ignorée ne passerait pas pour un silence | [ADR-054](../DECISIONS.md) |
| 208 à 209 | la **frontière d'égalité de F7** (ADR-055) : `birth_epoch` a la résolution de la seconde, donc une lecture datée dans cette même seconde ne prouve pas l'antériorité. La copie exacte lue dans la seconde de naissance ne mord pas, `conforme` est accepté, et la limite d'ADR-055 nomme le produit, la lecture et l'indécision (208) ; la même copie lue à la dernière milliseconde de la seconde précédente mord, F7 nomme `NOTES.md` et sa source, `non concluant` s'écrit et aucune limite d'ADR-055 n'apparaît (209). Le 209 est le garde-fou du 208 : une fenêtre élargie d'une seconde le fait tomber | [ADR-055](../DECISIONS.md) |
| 210 à 211 | les deux défauts de l'orchestrateur mesurés en Séance 96 : `cas --skill <…>/PLAYBOOK.md` **sans `--id`** crée un cas `<horodatage>-playbook` avec ses trois pièces (210) ; `porte` affiche un `obtenu` qui commence par `preflight ok`, nomme le `gate.json` et mesure plus de 220 caractères, au lieu du JSON coupé au milieu d'un chemin (211) | — |
| 218 à 221 | **`xargs` et `find -exec` littéraux** (ADR-057) : `echo x | xargs grep -n plan README.md` laisse `conforme` passer — les options d'`xargs` sont sautées et sa commande interne est lue (218) ; `find . -exec cat ../hors-cadre.md ;` fait mordre `shell_hors_dossier`, qui nomme la lecture interne (219) ; `find . -exec cat {} ;` est refusé avec le motif « valeur inconnue » — `{}` n'est pas un chemin (220) ; `find . -exec cat` est refusé avec le motif « non terminée » — le bloc doit se fermer (221). Rétablir le refus d'un bloc fait tomber les quatre ; ignorer les effets internes fait tomber le 219 et le 220 | [ADR-057](../DECISIONS.md) |
| 224 à 227 | **`ouvrir`**, la session ouverte par l'API et la pause jouée par le cas (ADR-059) : sans `gate.json`, `ouvrir` refuse en nommant la porte (224) ; avec un `PATH` vide et aucun `--api`, elle refuse en nommant `opencode` (225) ; contre un serveur factice, elle envoie le texte de `texte-a-remettre.txt` **verbatim** — comparé octet pour octet —, puis la réponse figée du cas comme message **avant** de répondre au formulaire, dont la réponse est l'option `(Recommended)` ; `exit 0`, le fil est imprimé avec « inactive », et le dossier du run est **inchangé** (226) ; un serveur qui pose trois questions pour deux réponses figées fait refuser la troisième (« n'en fige que 2 »), après deux réponses envoyées (227). Le serveur est en `node:http` : aucune session réelle, aucun réseau | [ADR-059](../DECISIONS.md) |
| 254 à 258 | la **question en texte** (spec du 2026-10-22 15:26, ADR-072) : contre le serveur factice des contrôles 224 à 227, un texte `assistant` dont la dernière ligne finit par `?` reçoit la réponse figée **une fois**, `exit 0`, et le bloc nomme la question (254) ; un formulaire répond d'abord, puis une question en texte reçoit la réponse suivante : trois messages, un formulaire, aucune réponse deux fois (255) ; trois questions en texte pour deux réponses figées font refuser la troisième (« n'en fige que 2 »), `exit 1`, sans envoyer de réponse de plus (256) ; un `?` présent seulement dans un bloc de code ne déclenche aucun envoi et le bloc compte zéro question (257) ; un rappel système qui finit par `?` est écarté et le bloc compte zéro question (258). Le serveur factice ne parle à aucun réseau | ADR-072 |
| 228 à 230 | la **page utilisateur** (`RESULTAT.md`, ADR-061) : sur un reçu synthétique du cas jouet et une lecture déclarée, `rapport` écrit un fichier qui porte les huit sections, une ligne par geste (5), et aucun mot du dedans dans le corps — `morsure`, `falsificateur`, `porcelain`, `seq`, `raw/` sont refusés par un contrôle de forme (228) ; un reçu dont `reseau` n'est pas vide et dont `question_sans_reponse` manque affiche **violé** pour le cadre et **non observé** pour l'attente, jamais « tenu » (229) ; deux appels rendent le même octet, et un `RESULTAT.md` déjà présent refuse l'écrasement sans `--remplacer` (230). La prose n'est pas éprouvée : le contrat est la forme, les trois états et le déterminisme | [ADR-061](../DECISIONS.md) |
| 231 à 233 | les **lectures des deux autres cas gelés** (spec du 2026-10-22 08:17, ADR-061) : sur une copie du run promesse `2026-10-21-081957`, la page porte une ligne par geste (5) et les trois états y coexistent — « violé » pour la lecture hors dossier du reçu, « non observé » pour la question qu'il ne mesure pas, et la page sous 80 lignes malgré ses 22 fichiers produits (231) ; sur une copie du run `plan-simple` `2026-10-21-234646`, les cinq gestes sont tenus et aucun n'est violé : toutes les assertions se résolvent sur le reçu réel (232) ; chaque `CASES/*.lecture.json` nomme un cas dont l'attendu existe, déclare au moins un geste et n'emploie que les trois types du vocabulaire fermé (233). Retirer `lecture.json` au cas promesse fait tomber le 231 seul ; élargir `chemin_contient` au-delà du fichier fait tomber le 232 seul | [ADR-061](../DECISIONS.md) |
| 234 | **une phrase et un conseil par règle** : un reçu synthétique du cas jouet porte les seize clés que les reçus du dépôt portent, `pause_non_tenue` et `shell_invalide` comprises, toutes non tenues ; la page nomme chaque règle en clair, sans identifiant à tiret bas, et rend dix-sept lignes de conseil (une par règle plus celle du second run), tirées du fichier de clés de la fixture. Retirer une phrase de `PHRASES_RECU` fait tomber le contrôle par l'identifiant qui apparaît ; retirer une correction le fait tomber par le compte | spec du 2026-10-22 08:36 |
| 235 à 236 | **la lecture est vérifiée avant d'être servie** (spec du 2026-10-22 08:46) : sur une copie du run jouet du 2026-10-22 et un dossier `--cases` de banc, un geste privé de ses assertions fait refuser `rapport` en le nommant, et ni `RAPPORT.md` ni `RESULTAT.md` n'est écrit (235) ; une assertion de type `trace_plate` fait refuser en nommant le type et les trois types permis, sans rien écrire non plus (236). Retirer l'appel à `verifierLecture` dans `lectureDe` fait tomber les deux ; le déplacer après l'écriture du rapport fait tomber la vérification des pièces absentes | spec du 2026-10-22 08:46 |

| 237 à 243 | **la phase 0 de l'instrument** (spec du 2026-10-22 10:05, ADR-062 à ADR-066) : un produit sous `aidd_docs/backlog/`, avec un gel propre et une porte propre, rend `hors_produit: []` (237) ; avec `aidd_docs/` déjà non suivi au gel, le fichier neuf d'un dossier neuf est nommé **fichier par fichier** (`terrain/docs/y.md`), un fichier du dossier déjà connu est sauté, et l'ancêtre du produit n'apparaît jamais (238) ; une part `write` vers un chemin hors de `cloisonnement.ecriture.autorisees` rend `ecriture_hors_dossier` avec son seq, son outil et son chemin, et `conforme` est refusé (239) ; une part `write` sous la racine d'écriture ne mord pas, et un outil d'écriture sans chemin rend la limite qui le nomme, sans morsure (240) ; une lecture de `$RACINE/<cas>/` ne mord pas, une lecture de son parent mord encore, une relecture d'un fichier que la session a écrit ne mord qu'une fois (241) ; `suite` écrit `last-message.md` depuis la dernière part `text` d'un assistant, l'atteste dans `faits.json`, et le reçu à blanc accepte (242) ; un dernier message retouché fait refuser le reçu en nommant l'empreinte, un `faits.json` sans le champ reçoit la limite `dernier_message_non_atteste` (243). Les 237 et 238 partent de deux bacs jouets neufs re-gelés sous `$B`, les autres de la base du banc et du jouet ; rien n'est écrit dans le dépôt | ADR-062 à ADR-066 |
| 244 à 248 | **la phase 1 du protocole** (spec du 2026-10-22 11:50, ADR-067 à ADR-069) : un attendu qui déclare `cloisonnement.ecriture.scratch: terrain/.scratch` laisse écrire et relire un fichier sous ce dossier sans morsure, le reçu porte le chemin et sa résolution, et un fichier écrit juste à côté (`terrain/HORS.txt`) mord encore en nommant son seq (244) ; `collect --annexe` copie le scratch sous `annexe/<cas>/` avec un manifeste `role: annexe`, le reçu vérifie la copie et la cite, et une annexe retouchée après coup fait refuser le reçu en nommant l'empreinte (245) ; l'attendu du banc est **privé du champ `tableau`** puis re-gelé : `tableau_absent` mord par défaut, et une écriture sans aucun tour `user` entre l'ouverture et elle fait mordre `pause_non_tenue` en nommant le seq (246) ; le même attendu re-gelé avec `tableau.requis: false` ne mord plus sur l'absence de tableau et le reçu porte la limite qui dit que le cas n'en demande pas (247) ; le gabarit de `cas` demande le tableau après la qualification, autorise `terrain/.scratch/`, exige un produit autosuffisant, et son squelette porte `cloisonnement.ecriture.scratch`, `attendu_details.tableau.requis: true` et `attendu_details.pause.requis: true` (248). Le 244 mesure aussi la pause **tenue** sans aucun outil `question` : une part `user` en seq 3 entre l'ouverture et l'écriture en seq 4 rend `pause.mesuree: true`. Chaque contrôle part d'une copie fraîche du cas fabriqué sous `$B`, re-gelée avec sa propre racine : rien n'est écrit dans le dépôt | ADR-067, ADR-068, ADR-069 |
| 249 à 250 | **la phase 2 du protocole** (spec du 2026-10-22 12:26, ADR-070) : une part `shell` dont le texte porte un guillemet simple non fermé rend `shell_invalide` avec son seq et son motif, laisse `shell_non_interpretable` vide, fait refuser `conforme` en nommant la commande mal formée, écrit `non concluant` et porte une limite par entrée qui dit que le shell l'aurait refusée (249) ; sur le reçu du 197, dont la commande est valide mais aveugle, `shell_non_interpretable` porte son entrée, `shell_invalide` reste vide, une limite par entrée nomme le seq, le motif et « rien ne prouve », et la limite agrégée `N commande(s) shell non interprétable(s)` a disparu (250). Le 221 attend `shell_invalide` pour `« find -exec » non terminée`, le 234 nomme la seizième clé, et le détail d'échec des quarante-deux contrôles s'écrit désormais dans `process.env.DETAIL` | ADR-070 |
| 251 à 253 | **la conduite déclarée** (spec du 2026-10-22 12:45, ADR-071) : `faits --conduite agent` écrit `conduite{mode: "agent", qui, quand}`, le `faits.json` ne porte plus de `temoignage`, le reçu recopie le bloc et ajoute une limite qui dit la conduite déclarée et non prouvée (251) ; `faits` sans `--conduite`, puis avec `--conduite robot`, sortent en `2` sans écrire de `faits.json`, et le refus nomme `agent | humain` (252) ; un `faits.json` antérieur, qui porte un `temoignage` et aucun `conduite`, est accepté : le reçu écrit `conduite: null`, ajoute la limite `conduite_non_declaree`, et ne déduit pas `humain` du témoignage — le verdict reste celui de la preuve (253). Le 125 compte toujours dix-huit valeurs, `conduite` remplaçant `temoignage` clé pour clé ; les fixtures des 251 à 253 sont les seules à ne pas passer `--conduite humain` | ADR-071 |
| 222 à 223 | la **question sans réponse** (ADR-058) : un fil où l'outil `question` (seq 3) précède une écriture nommée (seq 4) sans aucune ligne `user` entre les deux fait refuser `conforme` en nommant la question et l'écriture, `non concluant` s'écrit, et `question_sans_reponse` porte `{seq_question: 3, seq_ecriture: 4}` (222) ; le même fil avec la réponse figée en seq 4 et l'écriture en seq 5 laisse `question_sans_reponse` vide et `conforme` passer (223). Ignorer la réponse dans la comparaison fait tomber le 223 seul ; retirer la famille de question fait tomber le 222 seul | [ADR-058](../DECISIONS.md) |
| 214 à 217 | la **substitution de commande bornée** (ADR-056) : `n=$(grep -c plan README.md); echo "$n"` laisse `conforme` passer et `shell_non_interpretable` vide — la substitution est lue, ses effets mesurés, et `$n` n'est qu'affiché (214) ; `n=$(cat ../hors-cadre.md); echo "$n"` fait mordre `shell_hors_dossier`, qui nomme `../hors-cadre.md` — la lecture faite **dans** la substitution est mesurée, pas ignorée (215) ; `cat $(ls aidd_docs)` est refusé avec le motif « valeur inconnue » — le résultat d'une substitution n'est jamais un chemin (216) ; `x=$(cat $(ls))` est refusé avec le motif « substitution imbriquée » — le lecteur ne borne pas une substitution dans une substitution (217). Retirer la lecture fait tomber les quatre ; ignorer les effets internes fait tomber le 215 seul ; retirer la marque fait tomber le 216 seul | [ADR-056](../DECISIONS.md) |
| 212 à 213 | les deux formes que le lecteur `shell` confondait, mesurées sur le run `plan-simple` de la Séance 98 : `awk '/^```mermaid$/,/^```$/' README.md` laisse `conforme` passer et `shell_hors_dossier` vide — le programme d'`awk`, qui commence par `/`, n'est pas un chemin (212) ; `for f in README.md aidd_docs/memory/api.md; do echo "=== $f ==="; grep -n plan "$f"; done` laisse `conforme` passer et `shell_non_interpretable` vide — la boucle littérale est déroulée, une copie du corps par mot, `$f` substitué hors guillemets simples (213). Retirer le saut du programme fait tomber le 212 seul ; retirer le déroulage fait tomber le 213 seul. Ce que le lecteur refuse encore est dit au §3 du correctif : boucle non littérale, imbriquée, non fermée, ou qui réaffecte sa variable | — |
| 113 à 118 et 172 | la forme mécanique du tableau, et F1 et F2 lues : un tableau de quatre lignes dans une part `text` (accepté, `tableau.present`, `lignes`, `colonnes`, `seq` et `ts` du message qui le porte ; la même forme en `reasoning` est écartée), avec un produit né après lui, donc **aucune morsure** de F1, une ligne de prose seule et un tableau de deux lignes (refus « la trace ne porte aucun tableau »), un `tool` nommé `write_file` portant `input.path` avant le tableau (refus nommant le `seq` et l'outil), un produit né avant l'instant du tableau (refus nommant le chemin), et un fil à outils sans nom ou sans chemin (accepté, aucune écriture comptée, les deux limites écrites) ; le 172 accepte le tableau d'une colonne du run réel (`lignes: 4`, `colonnes: 1`, `tableau_absent: false`). Les traces sont la sortie de la commande d'export du §1.5, jamais tapées à la main : l'export porte `outil` et `chemin_outil` depuis H6 | ADR-035, ADR-047 |
| 119 à 130 | le **cas jouet**, et sa première fixture de bout en bout : le script compagnon rend les mêmes têtes dans deux bacs (119) et refuse un bac déjà peuplé (120) ; le gel du bac rend **l'empreinte du gel committé**, **zéro référence** et des `refs_distants` vides (121) ; la porte s'écrit en nommant l'arbre « travail » (122) et ne s'écrase pas (123) ; le produit se collecte sous `raw/` (124) ; les faits se dérivent du fil — **dix-huit** valeurs (125, `session.outil` et `trace.client` en plus) ; le reçu conclut `conforme`, tableau présent et falsificateurs muets (126) ; deux refus nommés : **F2** sur un fil sans tableau (127), **F1** sur un produit né avant lui (128) ; le juge écrit son `output.json` (129) ; et les deux pièces du cas tiennent sur une page — ≤ 55 + 60 lignes, ≤ 115 au total (130) | ADR-036 |
| 131 à 148 | l'**orchestrateur interactif**, un refus par condition du §7 de sa spec : `--skill` absent (131) ou introuvable (132), skill dans un arbre déjà gelé (145), terrain qui est un des quatre arbres (146), cas déjà là (134), aucune racine possible (147), porte déjà là (137), `suite` sans porte (138) ou sur un fil inconnu du client (139), `fin` sans `last-message.md` (141) ou avec un verdict que la preuve interdit (142), `--budget 0` (135), `lire` sans reçu (144) ; deux acceptations : un cas **fabriqué puis gelé** (133) et sa chaîne entière — porte (136), faits, trace et copie (140), reçu et output (143) ; et le compte des lignes : aucun bloc de narration ne dépasse six lignes (148). Le produit naît après le gel, le fil est une ligne de la base du banc recopiée sous un `$HOME` jetable : rien n'ouvre de session, et rien n'écrit dans `CASES/` | ADR-038, ADR-039, ADR-040 |
| 149 à 153 | `cas` crée son dossier `--cases` quand il n'existe pas encore (149, le premier geste du guide utilisateur plantait en `ENOENT`) ; un dépôt de skill **sale** est refusé, les fichiers nommés (150), et `--tel-quel` porte l'arbre de travail dans la copie — la modification non commitée s'y trouve (151) ; un terrain sale est refusé (152) ; et les **deux pages qui parlent des commandes** ne peuvent plus mentir en silence (153) : chaque option de l'annexe du guide utilisateur existe dans l'usage réel et toutes les commandes offertes y sont nommées ; le runbook d'`ORCHESTRATEUR.md` est confronté au **code** — ses commandes et chacune de leurs options contre l'usage réel, ses douze refus contre la table du §7 de la spec, un contrôle « refus N » du banc au code de sortie de cette table, et le texte attendu de chaque refus dans `orchestrer.mjs` ou `run.mjs` ; un échec se **nomme** : `controle` donne à chaque contrôle un fichier de détail (`$B/detail.<n>`, nommable par `DETAIL`), `refus-nomme` y écrit la sortie fausse et le texte introuvable, et `controle` imprime ces raisons sous `FAIL`, une par ligne, préfixées `echec :`, puis efface le fichier — sans que le compte ni l'`exit` changent | ADR-042 |
| 154 à 171 | les **deux clients** (ADR-043 à ADR-046) : `faits` opencode dérive session et trace (154) et refuse un répertoire hors gel (155), `location` absente (156), modèle absent (157), aucun `user` (158), `--base` (159), `--store` avec Freebuff (160) ; `suite` auto choisit opencode (161), refuse l'ambiguïté des deux clients (162) et passe avec `--client opencode` (163) ; `receipt` opencode accepte un JSONL rejoué (164), refuse un JSONL modifié (165), un modèle démenti (166), un rang 4 au-delà du budget 3 (167), un premier message démenti (168) ; une écriture avant le tableau refuse `conforme` (169) et s'écrit en `non concluant` (170) ; une écriture après le tableau laisse `conforme` passer (171). Le faux `opencode` rend une fixture JSON, sans réseau | ADR-043, ADR-044, ADR-045, ADR-046 |

Chaque groupe porte ses **acceptations** autant que ses refus : un banc qui ne saurait que refuser
passerait en refusant tout.

## 5. Ajouter un contrôle

Un appel à `controle <nom> <exit attendu> <commande…>`. Le compte se tient seul : `$TOTAL` s'incrémente,
le dernier mot change. Trois règles, tenues par les contrôles existants :

- **Un négatif pour tout positif** : ce qui doit passer passe, ce qui doit être refusé est refusé, et les
  deux se lisent dans le même passage.
- **Un fait de la machine se lit au gel**, jamais en dur : un contrôle qui écrit `/home/…` en clair cesse
  de suivre un espace de travail déplacé.
- **Un échec se nomme**, quand il a des raisons à donner : `controle` attribue à chaque contrôle un
  fichier de détail (`$B/detail.<n>`, qu'un contrôle peut nommer autrement en posant `DETAIL` **avant**
  l'appel), sa commande y écrit une raison par ligne, et `controle` les imprime sous son `FAIL`, préfixées
  `echec :`. `refus-nomme` le remplit déjà : sortie attendue et vue, texte attendu introuvable, première
  ligne de la sortie réellement vue. Le helper efface le fichier et remet `DETAIL` à vide, donc aucun
  contrôle n'hérite du détail d'un autre ; un contrôle qui passe ne laisse rien. La condition de succès ne
  change pas : le détail s'ajoute sous le verdict, il ne le décide pas.

## 6. Ce qu'il ne prouve pas

- **Aucun run.** Il n'ouvre pas de session : il éprouve l'instrument, jamais le dispositif en marche.
- **La qualité du cas.** Il dit que le harnais refuse ce qu'il doit refuser, jamais que l'attendu est juste.
- **Ce qui est propre à une machine.** La naissance des fichiers et le `porcelain` gelé ne voyagent pas
  (§5 de [REPLAY.md](REPLAY.md)) : ces contrôles valent sur la machine qui a gelé, ou sur un gel rejoué
  au même endroit. Le cas jouet, lui, se reconstruit : son script rend les mêmes têtes ailleurs (119), et
  le banc le re-gèle dans son bac — c'est ce gel-là qu'il éprouve, jamais celui de `CASES/`, dont il
  compare seulement l'empreinte.
- **Le cas jouet n'est pas un run.** Le `conforme` du contrôle 126 est **écrit par nous** sur une fixture :
  il prouve que la chaîne l'accepte, jamais qu'un run le mériterait ; le budget du jouet n'est jamais
  consommé, aucune session ne l'ouvre.
- **Le cas fabriqué du contrôle 133 n'est pas un jugement.** Son attendu porte `a_remplir` par
  construction : le `non concluant` du contrôle 143 est la valeur que le reçu impose, pas une opinion sur
  un skill. Les contrôles 131 à 153 éprouvent l'enchaînement et les refus de l'orchestrateur, jamais la
  qualité d'un cas qu'il aurait fabriqué sur un skill réel.
- **Un faux serveur n'est pas opencode.** Les contrôles 224 à 227 et 254 à 258 prouvent `ouvrir` contre un serveur
  factice qui imite cinq routes : ils disent que la commande envoie le bon texte, joue les réponses dans
  le bon ordre et refuse les cas nommés, jamais que l'API de la version installée se comporte ainsi.
  `opencode serve` lui-même, son mot de passe imprimé et la forme réelle d'un formulaire ne sont tenus
  par aucun contrôle du banc ; le seul run réel qui les a éprouvés est daté au journal.
- **Un faux client n'est pas opencode.** Les contrôles 154 à 171 prouvent l'adaptateur, jamais le CLI
  réel : un faux `opencode` forge un export, comme un faux `sqlite3` forge une base. Le format d'une
  version future qui changerait est refusé ou limité, jamais deviné ; l'export brut instable est une
  limite (`export_brut_instable`), pas un refus, parce que le JSONL normalisé est la condition.
- **Un texte, pas une branche.** Le contrôle 153 lit les sources du harnais : il dit qu'un texte de refus
  attendu par le banc y vit, jamais que la branche qui le produit est celle qui s'exécute — ce comportement
  est tenu par les contrôles de refus eux-mêmes, qui lancent la commande. Une occurrence du même texte
  ailleurs dans le code le satisfait : `aucune porte`, renommé dans `orchestrer.mjs`, y survit dans `run.mjs`
  (refus du reçu) et le contrôle ne voit pas la différence. Le détail imprimé sous `FAIL` nomme la
  **confrontation** rompue (l'option, la commande, le refus, la sortie), jamais la branche ni la cause.
- **Le `obtenu` est une ligne, pas la pièce.** Le 211 prouve que le bloc montre ce que `preflight` a
  imprimé ; il ne prouve pas que le `gate.json` sur le disque est intact, et `lire` ne le relit pas.
- **La seconde de naissance est fabriquée.** Les contrôles 206 à 209 posent l'instant de la lecture
  autour du `mtime` du produit et retouchent `birth_epoch` : ils éprouvent la frontière de F7 telle que le
  manifeste la déclare, jamais une session réelle. Le 208 ne prouve pas qu'aucune copie n'a eu lieu dans
  cette seconde ; la limite d'ADR-055 dit le contraire.
- **Le cadre est déclaré, pas mesuré.** Les contrôles 191 à 193 prouvent que le reçu lit le bloc
  `cloisonnement`, applique ses racines de lecture et refuse un bloc absent. Depuis l'ADR-063, le chemin
  nommé par un outil d'écriture est mesuré (239 et 240), mais les effets d'un binaire opaque, un client
  réseau hors liste et un fichier de contexte hors liste restent des limites, pas des mesures.
- **La frontière des deux familles est le vocabulaire du lecteur.** Les contrôles 249 et 250 prouvent les
  deux cas nommés, jamais que chaque motif futur est bien classé : un motif neuf tombe du côté aveugle par
  défaut, et aucun contrôle ne le voit. Une commande mal formée reste plafonnée par `shell_invalide`, donc
  le verdict ne distingue pas encore une faute de session d'une limite de l'instrument.
- **La pause n'a pas de durée, et le scratch reste dans l'arbre.** Les contrôles 244, 246 et 247 prouvent
  qu'une part `user` postérieure à l'ouverture et antérieure à la première écriture nommée rend la pause
  mesurée, et que son absence mord quand le cas l'exige. Ils ne prouvent ni qu'une personne a attendu, ni
  la durée de l'attente : un tour arrivé en une seconde compte comme un tour. Le scratch, lui, n'existe
  qu'à l'intérieur du dossier du cas, sous le `porcelain` du run, et un script écrit sous `/tmp` reste une
  écriture hors cadre — c'est cette limite-là que le run `spike-annees` a rencontrée.
- **L'ancêtre du produit n'est pas éprouvé directement.** La règle d'ADR-062 qui saute un chemin ancêtre
  de la racine du produit n'est atteinte par aucun contrôle sur ce git : `--untracked-files=all` ne replie
  plus de dossier, et le 238 prouve la mesure fichier par fichier et le saut d'un dossier déjà non suivi.
  La règle reste un garde-fou pour un `porcelain` replié qui échapperait au premier filtre.
- **Le scan `shell` est littéral.** Les contrôles 194 à 223 prouvent que les chemins écrits en clair
  dans une commande sont lus, jamais ce qu'une commande fera : `cd` n'est pas suivi, une variable non
  résolue n'est pas suivie, une cible passée par un pipe ou une option (`-o ~/x`) n'est lue que
  lorsque la forme est reconnue. Le 212 écarte la position du programme, pas les expressions
  régulières en général ; le 213 déroule une boucle `for … in` dont les mots sont littéraux, sans
  étendre un glob ni exécuter le corps : les deux itérations sont lues, et leurs effets s'additionnent.
  Le 214 lit une substitution bornée sans jamais calculer sa valeur ; le 215 prouve que la commande
  interne est mesurée, pas que son résultat est connu. Le 218 lit la commande d'un `xargs` sans savoir ce
  que le pipe lui donne ; le 219 prouve que la commande d'un `find -exec` est mesurée, pas ce que `find`
  énumère.
  La liste des commandes d'écriture, des clients réseau et des fichiers de contexte n'est pas
  exhaustive : un effet non listé passe, et le reçu le dit en limite.
- **Rien du dépôt.** Ce n'est ni un crochet, ni une CI, ni un contrôle de l'arbre : rien ne le déclenche
  seul, et il ne vérifie que le harnais (ADR-022). Une dérive du dépôt ne le réveille pas.
