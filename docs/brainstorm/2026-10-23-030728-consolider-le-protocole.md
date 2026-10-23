---
name: Brainstorm — consolider le protocole de test
description: "trois défauts mesurés — le mode guidé sans trace machine, une pause non reconnue par `ouvrir`, une durée de pause non mesurée — leurs remèdes, ce qui est écarté et l'ordre"
type: brainstorm
status: open
---

# Brainstorm — consolider le protocole de test

> 2026-10-23, Séance 124 (suite). Sources : [Séance 121](../trace.md) (le délai qui coupe `ouvrir`),
> [run `2026-10-22-211526`](../device/runs/2026-10-22-211526-95c42aa9-b259cc8/gate.json) et
> [brainstorm du 22 octobre](2026-10-22-210512-processus-de-test-skill-10-task.md) (le brouillon fini par
> « : »), [run guidé du 21:37](../tasks/2026_10/2026-10-22-221207-traces-et-run-guide/2026-10-22-221207-run-guide.md),
> [reçu du 151155](../device/runs/2026-10-22-151155-bee028f8-e2df6dc/receipt.json), et le banc mesuré
> aujourd'hui, **262/262 PASS**.

## 1. Le socle tient

Ce qui est solide ne se refait pas : **262** contrôles passent, quatre cas sont gelés, les deux clients sont
couverts par des fixtures (contrôles 154 à 171, base `desktop-v2.db` fabriquée comprise), le reçu porte
**14** falsificateurs, et la page utilisateur est déterministe. Le défaut n'est pas la couverture du
harnais : il est dans le mode le plus utilisé, et dans deux mesures qui se taisent.

## 2. Trois défauts mesurés

| # | Fait, preuve | Couche | Gravité |
| --- | --- | --- | --- |
| 1 | Le mode par défaut ([ADR-074](../DECISIONS.md)) ne laisse **aucune trace machine**. Le run guidé du 21:37 est un recast du rapport ; son fil n'est pas exporté ; la grille du gabarit se remplit à la main, et la Séance 124 n'a pu tenir que le chemin, la forme et l'empreinte du produit. | protocole | haute : le mode majoritaire est le moins instrumenté |
| 2 | `ouvrir` prend une session arrêtée sur un texte **sans `?`** pour un run fini : run `211526`, brouillon fini par « : », **0** question rendue, réponse envoyée à la main ; le run a continué sans que la pièce le dise. Le refus de délai, lui, **ne nomme pas le fil** : run `182505`, coupé à 20 min, reprise impossible sans retrouver l'identifiant. | instrument | haute : une pause non jouée passe pour un succès |
| 3 | La pause **n'a pas de durée** : `receipt.pause = {requise, mesuree, seq_reponse, seq_ecriture, outil_ecriture}`, et la limite dit « sa durée n'est pas mesurée ». Un tour `user` dans la même seconde que le message précédent compte comme une attente. | instrument | moyenne : une pause auto-répondue est indiscernable |

## 3. Les remèdes

**R1 — `tracer`, la trace du run guidé.** Une huitième commande qui exporte le fil d'un run guidé par la
frontière des clients (`clients.mjs`) et écrit `trace/echange.jsonl` plus `trace/fil.json` (client, modèle,
nombre de messages, premier et dernier, `sha256`). Elle n'écrit rien d'autre : ni reçu, ni verdict, ni
gel. La grille du gabarit cite alors des `seq` au lieu de tours lus à la main, et `non observé` ne couvre
plus que ce que la trace ne porte pas. Elle refuse un dossier qui ne contient pas exactement un
`*-run-guide.md`, un fil inconnu, une trace déjà écrite, et un fil en worktree. `--liste --depuis <iso>`
rend les fils récents du projet avec leur modèle et leur nombre de messages, sans contenu, parce que
l'identifiant d'un fil ne se devine pas.

**R2 — `ouvrir` ne prend pas une session arrêtée pour un run fini.** Quand la session devient inactive
sans formulaire et sans question terminée par `?`, alors qu'il reste une réponse figée à jouer,
`ouvrir` refuse : elle nomme le fil, la dernière ligne émise, et le geste qui reprend le run
(`suite --fil <id>`). Le succès avec **0** question disparaît pour ce cas. Le refus de délai nomme le fil,
lui aussi. Rien d'autre ne change : formulaires, questions `?`, ordre des réponses.

**R3 — la pause porte sa durée.** `receipt.pause.attente_ms` reçoit l'écart entre l'instant de la part
`assistant` qui précède immédiatement le tour `user` de la pause et celui de ce tour, ou `null` si la
trace ne donne pas les deux instants. La limite qui disait « sa durée n'est pas mesurée » est remplacée
par ce qu'elle mesure : un intervalle, jamais une attente humaine. Un écart inférieur à une seconde
ajoute une limite nommée, parce qu'une réponse dans la seconde du message ne prouve pas une personne.

## 4. Ce que je ne recommande pas

- **Confronter la phrase au nombre de fichiers.** Le reçu `151155` porte `produit.fichiers = 0` alors que
  le juge parle de « quatre fichiers » : la mesure n'existe pas là où il faudrait, et compter les écritures
  de la trace mêlerait `shell`, outils et dossiers. Le défaut reste dit, sans faux contrôle.
- **Rouvrir le headless.** Rien n'a changé depuis l'[ADR-074](../DECISIONS.md) : quota, taille de requête et
  lenteur restent les mêmes. Le mode guidé se consolide d'abord.
- **Un contrôle de CI.** Le drift de comptes est couvert par le contrôle **153** pour les deux pages des
  commandes ; aucun nouveau drift n'est mesuré aujourd'hui. `01-consign` le dit : un contrôle mécanique se
  gagne par un drift démontré, jamais par une promesse.
- **Un reçu pour le run guidé.** Sans gel ni porte, il attesterait plus que le run (spec du 22:12 §4).
  `tracer` ajoute une source, pas une attestation.

## 5. L'ordre

R2 d'abord : c'est un refus, sans schéma ni fichier. R3 ensuite : un champ et une limite. R1 enfin : une
commande, ses refus et ses contrôles. Six contrôles de banc, **263** à **268**, et aucun reçu existant
n'est réécrit : les reçus antérieurs restent lisibles sans `attente_ms`, comme ceux d'avant l'ADR-071 le
sont sans `conduite`.

## 6. Ce qui reste ouvert

- **L'indépendance** du run guidé : `tracer` ne la donne pas, elle reste dite dans le §7 du gabarit.
- **La grille** reste remplie par l'agent : la trace rend chaque ligne citable, elle n'automatise pas le
  jugement des quatre familles.
- **La trace contient la conversation entière**, messages de la personne compris. Elle vit sous
  `docs/tasks/`, donc dans le dépôt, et le gabarit le dit.
- **Aucun fil Freebuff réel n'a été exporté à ce jour** : les fixtures prouvent l'adaptateur, pas ce fil.
  Le premier run guidé qui appellera `tracer` le mesurera, ou nommera l'échec.

## 7. Décision

Une seule : appliquer les trois remèdes (recommandé), R2 et R3 seulement en gardant R1 pour une spec
séparée, ou écrire la spec sans l'appliquer.
