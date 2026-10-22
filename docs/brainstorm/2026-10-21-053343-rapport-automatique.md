---
name: Un rapport utilisateur écrit à partir des pièces du run
description: Le rapport actuel est rédigé à la main ; les options pour le dériver du reçu et de la trace, la recommandation d'une vue déterministe, et ce que ce brainstorm ne tranche pas
type: brainstorm
status: done
---

# Un rapport utilisateur écrit à partir des pièces du run

> 2026-10-21, nom `053343`, né à 05:34:22 (`stat -c %w`), écart de **39 s** nommé. Ce document ne code rien : il fixe le problème, les options et une
> recommandation. La spec vient après approbation, puis le code.

## 1. La demande

Le dossier d'un run porte déjà un `receipt.json` et un `output.json`. Le premier run réel du cas jouet a
aussi un [`RAPPORT.md`](../device/runs/2026-10-20-222845-50664060-3d0db46/RAPPORT.md), mais il a été
écrit **à la main**, après relecture, par un agent. La personne qui commande le test doit aujourd'hui
attendre cette rédaction, ou lire elle-même le reçu.

La demande : que chaque run produise automatiquement un `RAPPORT.md` à partir du **reçu** et de la
**trace**, avec des conclusions, des limites et des pistes pour la personne.

## 2. Ce que les pièces contiennent déjà

| Pièce | Ce qu'elle donne | Ce qu'elle ne donne pas |
| --- | --- | --- |
| `receipt.json` | verdict, falsificateurs, limites, session, budget, tableau, produit, empreintes, arbres | la lecture en langage clair, ni la priorité des actions |
| `output.json` | la phrase du juge, l'attendu, la différence, ce qui est écarté comme non testable | une conclusion indépendante du verdict |
| `trace/echange.jsonl` | les parts, les outils, les chemins lus, les horodatages | le contenu des commandes `shell` |
| `gate.json` | la porte, le répertoire autorisé, l'empreinte du gel | ce qui s'est passé après elle |
| `raw/<cas>/` | le produit, ses octets, son manifeste | la justesse du contenu |

Un rapport automatique peut donc dire, sans inventer : ce qui a été testé, ce que le verdict atteste,
quels falsificateurs ont mordu, quelles limites le reçu porte, quelles pièces lire, et quelle action
suit chaque limite. Il ne peut pas dire si le skill est utile, ni si le produit est juste.

## 3. Les options

**A. Un rapport rédigé par un modèle.** Le générateur envoie le reçu et la trace à un client, qui écrit
le rapport. Prose plus souple, mais non déterministe, dépendante d'un réseau et d'un modèle, et
difficile à éprouver : deux exécutions sur les mêmes pièces peuvent diverger. Rejeté pour ce dépôt.

**B. Une vue déterministe, écrite par un module.** Un module lit le reçu, l'output et la trace, puis
rend un markdown dont chaque phrase est dérivée d'un champ. Recommandé : le rapport est reproductible,
testable au banc, sans dépendance, et ne peut pas inventer un fait que les pièces ne portent pas.

**C. Laisser l'agent écrire le rapport, avec un squelette.** L'orchestrateur imprime un plan, l'agent
le remplit. C'est l'état actuel, à peine outillé : le rapport reste dépendant de la présence et de la
qualité d'un agent. Rejeté comme automatisme ; peut rester une pratique après coup.

**D. Générer le rapport dans `run.mjs`.** Le harnais qui décide du verdict écrirait aussi la lecture
pour la personne. Rejeté : le reçu est une preuve, le rapport est une vue ; les mêler rend le premier
responsable de la prose du second.

## 4. Recommandation

Un module `docs/device/harness/rapport.mjs`, sans dépendance, qui lit les pièces d'un run et écrit
`RAPPORT.md` à la racine du run. `orchestrer.mjs` l'appelle **après** `output.json`, dans `fin`, et
expose aussi une commande `rapport` pour reconstruire le document d'un run déjà clos.

Le rapport est une **vue** :

- il ne décide pas du verdict ; il le lit ;
- il ne réécrit ni le reçu ni l'output ;
- il ne relit pas la trace pour re-juger les falsificateurs ; il lit
  `receipt.falsificateurs.lecture_hors_dossier`, et dit quand ce champ manque (reçu antérieur à
  l'ADR-049) ;
- il n'invente aucune action : chaque piste est liée à une morsure ou à une limite nommée.

Le module ne remplace pas le rapport manuel du run historique : il produit un rapport pour les runs
suivants, et peut être rejoué sur les anciens sans réécrire leurs reçus.

## 5. Ce que le rapport doit contenir

1. **En-tête** : cas, verdict, date du reçu, phrase du juge si `output.json` existe.
2. **Ce qui a été testé** : session, modèle, budget, tableau, produit, répertoire, révisions.
3. **Ce que le reçu établit** : falsificateurs muets, produit re-haché, trace, porte.
4. **Ce qu'il n'établit pas** : qualité du skill, justesse du produit, reproductibilité, gestes humains,
   commandes `shell` invisibles.
5. **Les morsures et les limites** : une ligne par falsificateur qui mord, une ligne par limite.
6. **Les lectures hors dossier** : celles que le reçu nomme ; sinon, la limite qui dit que le reçu ne
   les mesure pas.
7. **Les pistes** : une action par morsure ou limite, et une action de répétition quand le run est
   `conforme`.
8. **Où lire les preuves** : liens relatifs vers les pièces du run.
9. **Ce que ce rapport ne prouve pas** : il est une vue des pièces, pas un nouveau run.

## 6. Les décisions laissées à la spec

- Le nom du module, la forme exacte de ses fonctions et le nombre de contrôles.
- Le moment exact dans `fin` : après `output.json`, avant le bloc `▸ FIN`.
- Le comportement quand `RAPPORT.md` existe déjà : refus, remplacement explicite, ou conservation.
- La longueur maximale du rapport et la forme des tableaux.
- Le traitement des pièces absentes : `output.json` manquant, trace absente, champ
  `lecture_hors_dossier` absent.
- Le nombre d'ADR à réserver et les pages à mettre à jour.

## 7. Ce que ce document ne fait pas

Il ne code rien, n'écrit aucun rapport, ne touche à aucun run existant. Il ne tranche pas le nombre de
contrôles ni la forme exacte du markdown. Il ne prétend pas qu'un rapport automatique remplace la
lecture humaine du produit. Il ne crée pas un cinquième bloc de narration : `fin` garde ses quatre
formes, et `rapport` imprime une ligne de chemin.
