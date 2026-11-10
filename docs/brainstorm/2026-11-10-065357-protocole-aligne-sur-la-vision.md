---
name: "Brainstorm : faire correspondre le protocole à la VISION"
description: "les six temps de la VISION v0.4 confrontés à ce que le protocole mesure aujourd'hui, cinq écarts nommés, quatre options par écart, et un ordre de trois specs"
type: brainstorm
status: open
---

# Brainstorm : faire correspondre le protocole à la VISION

> 2026-11-10, après la constatation que le test s'est déjà fait dans un projet local,
> `/home/giak/projects/audio-sync-tool`. Mesures de ce jour : 16 gels dans `CASES/`, dont 5 nomment ce
> projet ; le clone de `plan-simple` est à `416ec1f` ; `ls /home/giak/projects/audio-sync-tool` ne rend ni
> `aidd_docs` ni `AGENT.md` ; 61 runs, dont 6 guidés, 36 reçus et 22 `RESULTAT.md`. Références :
> [VISION](../VISION.md) v0.4, [PROTOCOLE](../PROTOCOLE.md), [ADR-061](../DECISIONS.md) (la page de
> décision) et [ADR-111](../DECISIONS.md) (l'intention déclarée).

## 1. La question

La VISION v0.4 décrit une boucle en six temps : déclarer l'intention, installer AIDD dans un projet local,
y faire tourner le skill, noter le produit, le comparer à l'intention, écrire un rapport pour la personne,
puis modifier et recommencer. Le protocole, lui, mesure la conduite d'une session dans un arbre gelé. Le
brainstorm demande : **quels gestes manquent pour que ces six temps soient des gestes, et non une
discipline tenue à la main ?** Il ne tranche pas : il nomme les écarts, les options et leur coût.

## 2. Ce que le protocole fait déjà

Le test s'est bien fait dans un projet local. Cinq gels nomment `/home/giak/projects/audio-sync-tool`
comme `terrain`, et le clone de `plan-simple` y est à `416ec1f` ; les runs se font sur ces clones, jamais
sur le projet de la personne, qui porte `AGENT.md`
mais ni `aidd_docs` ni `.aidd` : aucune trace d'installation d'AIDD n'y est mesurable.

Ce qui existe, mesuré :

- **la situation** : un projet réel, gelé, cloné par cas (`cas`, `--refreeze`) ;
- **le run** : `porte`, `ouvrir`, `suite`, `fin`, 61 runs consignés ;
- **la note du produit** : `raw/`, manifeste, empreintes ;
- **la comparaison** : falsificateurs du cas, verdict, `comparaison` exigée depuis le 2026-11-10 ;
- **le rapport à la personne** : `RESULTAT.md`, la page de décision d'ADR-061, 22 produites ;
- **l'état frais** : clone neuf ([REPLAY](../REPLAY.md)), terrain « ramené à l'état gelé » à chaque re-gel.

## 3. Les écarts, temps par temps

| temps de la VISION | ce qui existe | ce qui manque |
| --- | --- | --- |
| 1. déclarer l'intention depuis le skill | `attendu` du cas ; `intention` du run (ADR-111) | rien de bloquant ; l'intention est recopiée du skill, personne ne vérifie qu'elle en vient |
| 2. installer AIDD dans un projet local | le terrain est un projet réel, cloné | aucun geste d'installation, aucune pièce qui dise quelle révision d'AIDD est dans le terrain |
| 3. faire tourner le skill | `porte`, `ouvrir`, `suite`, `fin` | rien |
| 4. noter le produit | `raw/`, manifeste, empreintes | rien |
| 5. comparer à l'intention | falsificateurs, verdict, `comparaison` | rien de structurel ; la comparaison est déclarée, jamais recalculée |
| 6. rapporter à la personne | `RESULTAT.md`, 22 pages | le rapport est par run, pas par skill ; il ne dit pas ce qu'une série de passages établit |
| la boucle : modifier, rétablir, relancer | clone neuf, re-gel | aucun objet qui relie deux passages ; `git reset` n'est pas un geste du protocole |

Deux écarts sont matériels : **l'installation** (temps 2) et **la boucle** (le dernier). Les autres sont
des manques de forme, pas de mesure.

## 4. Les options

### A. L'installation

- **A1, une commande `installer`** qui copie le framework dans le projet et écrit un marqueur
  (`.aidd/installation.json` : révision, empreinte, date). Coût : une commande de plus, un contrat de
  dossier, deux contrôles. Risque : réimplémenter l'installeur du framework et mesurer le nôtre, pas le
  vrai.
- **A2, une installation déclarée et vérifiée** : le cas déclare la révision d'AIDD et l'empreinte du
  marqueur ; `preflight`, qui vérifie déjà l'état gelé, refuse un terrain dont le marqueur manque ou ne
  correspond pas. Coût : un champ dans le gel, une règle dans `preflight`, deux contrôles. Limite : la
  déclaration reste déclarée, mais elle est confrontée à un fichier du terrain.
- **A3, rien** : le terrain cloné suffit, l'installation reste une précondition humaine.

### B. La remise à zéro entre deux passages

- **B1, documenter le geste** : `git reset --hard <tête gelée>` et `git clean -fd` sur le clone, suivi de
  la porte, qui refuse déjà un arbre hors de l'état gelé. Coût : quelques lignes au PROTOCOLE et un
  contrôle qui prouve le refus. C'est le moins cher, et le garde-fou existe.
- **B2, une commande `remettre`** qui exécute le reset, le clean et écrit `remise.json`. Coût : une
  commande et ses contrôles, pour un geste que la porte vérifie déjà.

### C. La boucle, c'est-à-dire la série de passages

- **C1, une campagne par skill** : `docs/device/campagnes/<skill>/campagne.json` (intention, passages
  dans l'ordre, décisions prises après chaque rapport) et une page déterministe qui la rend. Coût : un
  lecteur, un écrivain, deux contrôles. Gain : la boucle devient un objet lisible, et le rapport cesse
  d'être isolé.
- **C2, une page écrite à la main** par skill. Coût nul, valeur nulle : rien ne la vérifie.
- **C3, rien** : la boucle reste une discipline, ce que la VISION refuse.

### D. Le rapport à la personne

- **D1, deux niveaux** : `RESULTAT.md` reste le rapport d'un passage ; la page de campagne porte la
  synthèse et le geste suivant. Coût : nul, la page de C1 le fait.
- **D2, un rapport unique** qui refait la synthèse à chaque passage. Coût : réécrire la page de décision,
  et perdre la trace de ce que chaque passage a établi.

## 5. Recommandation

Trois specs, dans cet ordre, chacune avec ses contrôles, la VISION restant la référence :

1. **A2, installation déclarée et vérifiée par `preflight`** : le geste entre dans le protocole sans
   dupliquer l'installeur du framework.
2. **B1, remise à zéro documentée**, refus déjà mesuré par la porte : un contrôle de banc prouve qu'un
   terrain non remis est refusé.
3. **C1 avec D1, la campagne** : un objet par skill qui relie les passages, et la page qui porte la
   synthèse et le geste suivant.

L'ordre est celui du coût et du risque : A2 ne crée aucune commande, B1 non plus, C1 crée le seul objet
neuf, et c'est celui qui donne son sens à la boucle.

## 6. Ce qui pourrait invalider ces choix

- Si le framework expose un installeur stable, versionné et vérifiable, A1 devient supérieur à A2 :
  mesurer le vrai geste vaut mieux que vérifier une déclaration.
- Si un passage coûte trop cher, la campagne se réduit à une page, et C1 perd son écrivain.
- Si l'indépendance exigée par ADR-074 interdit de relier deux passages du même opérateur, la boucle doit
  changer d'opérateur à chaque tour plutôt que d'outiller la répétition : c'est alors la VISION qu'il faut
  corriger, pas le protocole.

## 7. Limites de ce brainstorm

La trace machine des runs guidés de cette conversation est absente (`tracer` refuse ces fils) : les
chiffres cités viennent des pièces consignées, pas d'un journal de session. Les propriétés
d'`audio-sync-tool` sont celles de son gel, pas de son état courant.
