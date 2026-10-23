---
name: Brainstorm — remettre à plat la documentation
description: "mesure de la dispersion, les trois natures mêlées, le principe un besoin un foyer, la carte cible à huit pages, trois options, l'ordre de migration et ce qui la rendrait fausse"
type: brainstorm
status: open
---

# Brainstorm — remettre à plat la documentation

> 2026-10-23, Séance 128. Toutes les mesures de cette page sont prises le même jour, sur l'arbre de
> travail, par les commandes citées sur leur ligne. Le journal reste [trace.md](../trace.md).

## 1. Ce qui est mesuré

**Volume.** `find docs -name '*.md' | wc -l` rend **202** fichiers et **33 729** lignes ; `find` par foyer
rend 7 pages à `docs/`, 6 à `docs/device/`, 2 à `docs/guide/`, 20 `brainstorm/`, et le reste en `tasks/`.
Le journal pèse 7 166 lignes, `DECISIONS.md` 2 455.

**Les pages de doctrine**, c'est-à-dire celles qui prétendent décrire le dispositif :

| Page | Lignes | Octets | ADR citées | Rôle déclaré au frontmatter |
| --- | --- | --- | --- | --- |
| `VISION.md` | 53 | 2 624 | 1 | la raison d'être |
| `PFD.md` | 57 | 6 120 | 5 | ce que le dispositif produit, par phase |
| `EXPLICATION.md` | 444 | 35 828 | 18 | le projet raconté simplement |
| `ARCHITECTURE.md` | 560 | 50 488 | **44** | l'architecture détaillée |
| `DASHBOARD.md` | 130 | **80 128** | **58** | l'état d'avancement |
| `device/DEVICE.md` | 130 | 8 010 | 20 | ce qu'il fait, comment le lancer |
| `device/BANC.md` | 414 | 64 947 | **52** | les 268 contrôles |
| `device/ORCHESTRATEUR.md` | 259 | 21 184 | 25 | conduire un test |
| `device/REPLAY.md` | 256 | 15 816 | 7 | rejouer le gel |
| `device/BOUNDARY.md` | 217 | 13 604 | 7 | les quatre arbres |
| `device/NEGATIVE.md` | 122 | 7 390 | 1 | le contrôle négatif |
| `README.md` | 133 | 11 533 | 17 | l'entrée |

**La répétition**, mesurée par `grep` :

- le compte **268** apparaît dans **8** fichiers ; « huit commandes » dans **7** ; `framework-origin` dans **13** ;
- la question « où en est le projet » a **4** foyers déclarés (`DASHBOARD`, `PFD`, `EXPLICATION` §9, `ARCHITECTURE`), plus le journal ;
- la même page `DASHBOARD.md` fait **130 lignes pour 80 128 octets** : une seule ligne porte la chronologie d'une cinquantaine de séances ;
- `ARCHITECTURE.md` ouvre sur **60 lignes de rectifications datées** (lignes 10 à 69) avant son §1.

## 2. Ce que le constat dit de faux, et ce qu'il dit de vrai

Le constat était : « l'architecture n'est pas mise à jour ». Mesure : elle l'est.

`ARCHITECTURE.md` cite `tracer` et l'[ADR-076](../DECISIONS.md) (l. 12, 176), le mode guidé et
l'[ADR-074](../DECISIONS.md) (l. 45, 91, 105, 184), l'[ADR-075](../DECISIONS.md) (l. 48), la présentation
de l'épreuve de la Séance 126 (l. 50), la mesure de la Séance 127 (l. 55), et `268/268` (l. 58, 244). Ce
n'est pas une page en retard.

Ce que le constat dit de vrai est plus grave, et il est mesuré ci-dessus : la page **porte trois natures à
la fois**, et la même réponse s'écrit dans six endroits. Le défaut n'est pas la fraîcheur, il est la
structure.

## 3. Le diagnostic

Trois natures de document existent ici, et un seul format de page les reçoit :

| Nature | Question à laquelle elle répond | Format | Ce qu'elle ne doit jamais porter |
| --- | --- | --- | --- |
| état | qu'est-ce qui est vrai **maintenant** ? | prose au présent, tableaux, schémas | dates, séances, numéros d'ADR, récit |
| décision | **pourquoi** ce choix, quelles options écartées ? | une ADR, Contexte, Options, Décision, Conséquences, Falsificateur | description de l'état courant |
| récit | **que s'est-il passé**, et quand ? | une section datée par séance | règles, état recopié |

Le mélange produit trois effets mesurables. **Une ADR sert de justification dans de la prose descriptive**,
donc 44 numéros entrent dans une page qui devrait décrire le présent. **Une page d'état porte sa propre
chronologie**, donc `DASHBOARD` et `ARCHITECTURE` réécrivent le journal. **Une réponse vit dans plusieurs
foyers**, donc chaque changement touche cinq ou six pages, et l'écart entre elles devient inévitable. La
dérive est structurelle, pas une négligence.

La cause est unique : le lien n'a jamais été tenu pour suffisant. Une page qui a besoin d'un fait le
recopie plutôt que de le citer, parce que rien n'interdit la copie.

## 4. Le principe

Sept règles, courtes, vérifiables. Elles valent pour ce dépôt et pour tout dépôt qui suit la même
discipline documentaire.

1. **Une page, une question.** Le frontmatter porte `question:`, une phrase interrogative. Deux pages qui
   répondent à la même question sont une erreur, pas une variante.
2. **Une réponse, un foyer.** Ailleurs, un lien, jamais une copie. Une valeur chiffrée qui apparaît deux
   fois est un défaut, même si les deux copies concordent.
3. **Trois natures, trois formats.** Pas de chronologie dans une page d'état, pas de description dans une
   ADR, pas de règle dans le journal.
4. **Les en-têtes sont l'index.** `##` numérotés, stables, une idée par section ; les dix premières lignes
   disent ce que la page répond et ce qu'elle ne répond pas. C'est ce qui rend la navigation par un agent
   possible sans lire la page entière.
5. **Un lien porte la question, pas le numéro.** Une page descriptive nomme les décisions liées en fin de
   page, dans une liste, jamais au milieu d'une phrase.
6. **Pas de date déclarée dans une page d'état.** `status` au frontmatter, date de modification lue par
   `git log -1 --format=%cI`, jamais recopiée à la main.
7. **Une page morte s'archive, elle ne s'édite pas.** Un document remplacé reçoit une note datée qui le
   renvoie à son remplaçant.

La règle 2 est la seule qui coûte quelque chose : elle oblige à choisir le foyer d'un fait avant de
l'écrire, au lieu de l'écrire là où l'on passait.

## 5. La carte cible

Huit pages de doctrine, deux manuels, des preuves, des travaux.

| Foyer | La question qu'il répond seul | Sort |
| --- | --- | --- |
| `AGENTS.md` | quel comportement l'agent tient-il, ici et ailleurs ? | inchangé, allégé de ce qui n'est pas une règle |
| `docs/INDEX.md` | quelle page répond à quelle question ? | **créé**, une table, 30 lignes |
| `docs/VISION.md` | pourquoi ce dispositif existe-t-il ? | gardé, absorbe les phases de `PFD` |
| `docs/ARCHITECTURE.md` | comment le dispositif est-il fait **aujourd'hui** ? | réécrit au présent, sans ADR ni dates |
| `docs/PROTOCOLE.md` | comment conduit-on un test, et que prouve chaque étape ? | **créé**, absorbe `ORCHESTRATEUR` et le §4.1 |
| `docs/DASHBOARD.md` | qu'est-ce qui reste ouvert ? | **réduit** à une table, absorbe le statut de `PFD` ; le nom `ETAT` est différé, 47 fichiers citent `DASHBOARD.md` |
| `docs/DECISIONS.md` | pourquoi chaque choix ? | gardé, immuable |
| `docs/trace.md` | que s'est-il passé, et quand ? | gardé, reçoit toutes les chronologies |
| `docs/BANC.md` | quels contrôles, et que prouvent-ils ? | remonté de `device/` |
| `docs/REPLAY.md` | comment rejouer un gel ? | remonté de `device/` |
| `docs/device/CASES`, `runs` | quelles preuves, quelle empreinte ? | inchangés, aucune prose de doctrine |
| `docs/tasks`, `docs/brainstorm` | quel travail, quel raisonnement ? | inchangés |
| `docs/guide/` | comment un profane s'en sert ? | reçoit `EXPLICATION` |

## 6. Ce qui disparaît, et ce que cela coûte

| Page | Lignes | Devient |
| --- | --- | --- |
| `PFD.md` | 57 | la table de `ETAT` et les phases de `VISION`, puis archivé |
| `DASHBOARD.md` | 130 | réduit à une table, chronologie rendue à `trace.md` ; garde son nom |
| `device/DEVICE.md` | 130 | `ARCHITECTURE` §1 et le guide de prise en main |
| `device/BOUNDARY.md` | 217 | `ARCHITECTURE` §3 et la skill `03-boundaries` |
| `device/ORCHESTRATEUR.md` | 259 | `PROTOCOLE` |
| `device/NEGATIVE.md` | 122 | une ligne d'`ETAT` et son cas |
| `EXPLICATION.md` | 444 | `docs/guide/` |

**1 359 lignes** relogées, plus la réécriture de 560 lignes d'`ARCHITECTURE` : environ **1 900 lignes**
touchées. Deux coûts réels, nommés d'avance :

- `liens.mjs` compte aujourd'hui **204 fichiers, 1 396 liens, 0 mort** (mesure du jour) ; chaque
  déplacement en casse une partie, et c'est lui qui le dira ;
- le contrôle **153** du banc lit en dur `$REPO/docs/device/ORCHESTRATEUR.md` (l. 1107). `PROTOCOLE`
  oblige à changer le chemin, et la confrontation des options et des refus doit rester la même.

## 7. Les options

**A. Les règles seules.** On écrit `INDEX.md` et la règle, on nettoie `ARCHITECTURE` et `DASHBOARD`,
rien ne bouge de place. Coût faible, risque nul. Laisse douze foyers de doctrine et la copie reste
permise partout ailleurs.

**B. La carte cible, en deux tranches.** Tranche 1 : `INDEX.md`, la règle, `ARCHITECTURE` au présent,
`DASHBOARD` réduit à `ETAT`. Tranche 2 : les six absorptions, les liens, le banc. Coût réel, résultat
vérifiable : une réponse, un foyer.

**C. La réécriture à zéro.** Une doctrine de six pages écrite d'un coup, le reste archivé. Le plus
propre en apparence, le plus risqué en fait : les mesures, les falsificateurs et les limites vivent dans
les pages actuelles, et une réécriture les perd sans le dire.

## 8. L'ordre de migration

1. `docs/INDEX.md`, huit lignes de table, et la règle écrite une seule fois.
2. `ARCHITECTURE` : les 60 lignes datées rejoignent `trace.md` (ce sont des séances), les 44 ADR
   deviennent une liste en fin de page, le corps passe au présent.
3. `DASHBOARD` : réduit à la table des points ouverts, la chronologie supprimée, elle est déjà au
   journal ; le renommage en `ETAT.md` est différé, 47 fichiers citent le nom actuel.
4. `PROTOCOLE` : assemblé depuis `ORCHESTRATEUR`, le §4.1 d'`ARCHITECTURE`, les ADR-074, 076 et 077, et
   la présentation de l'épreuve ; le contrôle 153 suit le nouveau chemin.
5. `DEVICE`, `BOUNDARY`, `PFD`, `NEGATIVE`, `EXPLICATION` absorbés, puis archivés avec leur note datée.
6. `liens.mjs`, banc, `README`, `guide`, frontmatter.

Chaque étape est séparée et vérifiable seule. Aucune ne demande de réécrire le journal, aucune ne
touche aux cas gelés ni aux reçus.

## 9. Ce qui rendrait cette proposition fausse

- après migration, un fait chiffré encore présent dans deux pages (un `grep` sur une valeur distinctive
  doit rendre un seul foyer) ;
- une page sans `question:` au frontmatter ;
- une page de description qui cite un numéro d'ADR dans sa prose ;
- un contrôle du banc retiré au lieu d'être repointé ;
- `ETAT.md` qui reprend une chronologie et redevient un tableau de bord ;
- un lien mort laissé derrière, ou un archivage sans note datée.

## 10. Décision, et ce qui a été appliqué

Décidé le 2026-10-23 : **B, deux tranches**, la règle cross-projet écrite une fois dans
`~/.AGENTS.md` et citée ici par un lien, sans recopie. Le renommage `DASHBOARD` → `ETAT` est abandonné
(KISS : 47 fichiers citent le nom, pour un gain de vocabulaire seulement).

**Tranche 1 faite.** `~/.AGENTS.md` porte la règle ; `AGENTS.md` la cite en une ligne ; [INDEX](../INDEX.md)
nomme 21 foyers et leur question ; `ARCHITECTURE` perd son bloc de 60 lignes datées (561 → 510) ;
`DASHBOARD` passe de 130 lignes et 80 128 octets à une table de dix points ouverts. Vérifié :
`liens.mjs` rend 0 mort, `git diff --check` rend 0.

**Tranche 2 faite.** [PROTOCOLE](../PROTOCOLE.md) absorbe `ORCHESTRATEUR`, le §4.1 et la présentation de
l'épreuve ; [ARCHITECTURE](../ARCHITECTURE.md) absorbe `DEVICE` et `BOUNDARY` (§3 et §3.1) ; `VISION` reçoit
les trois phases et `DASHBOARD` les points que `PFD` portait ; `NEGATIVE` tient au journal, Séance 29 ;
`EXPLICATION` devient [guide/explication](../guide/explication.md). Les six pages restent comme notes
datées. Vérifié : `liens.mjs` rend 208 fichiers, 0 mort ; le banc 268/268, `exit 0`, contrôle 153 repointé
sur `docs/PROTOCOLE.md`. Décision dans l'[ADR-079](../DECISIONS.md). Reste ouvert : `BANC` et `REPLAY` sous
`docs/device/`, et la chronologie du `README`.
