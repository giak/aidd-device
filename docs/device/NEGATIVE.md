---
name: NEGATIVE — le contrôle négatif
description: La casse volontaire introduite dans un skill du framework, le cas qui doit la signaler, la sortie brute du dispositif, et la moitié du contrôle qui ne peut pas être faite avant un run qui produit
type: negative
status: in-progress
---

# NEGATIVE — le contrôle négatif

> V0.1 — 2026-10-17. Le nom est celui que le v6 §10 prescrit, comme `DEVICE.md` et `BOUNDARY.md` : il ne
> porte donc pas de préfixe daté. Il répond à la **question 6 du §11** — « le dispositif a-t-il signalé une
> casse volontaire, et comment le sait-on ? » — **et à moitié seulement**. Ce qui est construit l'est avec sa
> sortie ; ce qui ne l'est pas dit pourquoi, et le v6 est explicite : une raison documentée n'est pas un
> contrôle fait, et la question reste sans réponse.

## 1. Ce que le v6 demande

Le §10, mot pour mot : « la casse volontaire que tu as introduite (une phrase de skill retournée, par
exemple), le cas qui doit la signaler, la sortie brute qui la signale — ou la raison documentée pour
laquelle ce contrôle ne peut pas être construit ». Et le vocabulaire du v6, au début du méga-prompt : « Un
**contrôle négatif** est un cas dont on sait qu'il doit être signalé. »

Deux choses se mesurent donc séparément : **la casse est-elle signalée**, et **le signal est-il celui du
cas**. Ce document mesure la première sur la chaîne de preuve du dispositif, et nomme la seconde comme
manquante.

## 2. La casse volontaire

Une phrase de `plugins/aidd-context/skills/02-project-memory/SKILL.md`, à la révision sous test `4c39e5c5`,
section « Transversal rules », ligne 33 :

```text
avant : - End with a short report of what changed.
après : - Never report what changed.
```

Le fichier passe de **1 223** à **1 209** octets ; son `sha256` de `149f0f19…` à `329852d0…` — la valeur
gelée du cas est `149f0f196d2fc03c7919e63a4d30720e88124e93fd3ed8606a506c112da2363c`, celle du gel
`0d9a2180`.

Cette phrase n'est pas choisie au hasard : l'attendu la cite **mot pour mot**. Le falsificateur `E2`
(`falsificateurs_de_l_attendu`) dit « aucun rapport final ne nomme ce qui a changé », verdict `écart`, et
son motif est « règle transverse de `SKILL.md` : « End with a short report of what changed. » ». Retourner
la phrase tue la raison d'être de `E2` : le cas demanderait toujours un rapport que le skill n'exige plus.

## 3. Le contrôle, et ses deux directions

La casse ne se fait pas dans les quatre arbres. Un espace jetable sert de banc, hors de tout arbre :
`/tmp/negatif-2026-10-17-100043`, avec une copie de la révision sous test et une copie de `CASES/`. Un seul
champ du gel **copié** y est modifié : `arbres[revision-sous-test].chemin`, qui pointe la copie. Ce champ
n'entre pas dans l'empreinte — la formule du §1.1 hache `role`, nom de base et `sha256`, jamais un chemin
([ADR-016](../DECISIONS.md)) — donc rien n'est maquillé : seule la **relecture du fichier** peut produire le
refus.

**Direction positive, la copie intacte.** Elle prouve que le banc n'est pas piégé :

```text
node docs/device/harness/run.mjs preflight --cases /tmp/negatif-2026-10-17-100043/cases \
  --case 2026-10-15-133423-promesse-memoire-avant-ecriture \
  --repertoire /home/giak/projects/aidd-device-work/2026-10-15-133423-promesse-memoire-avant-ecriture/terrain \
  --texte /home/giak/projects/aidd-device-work/2026-10-15-133423-promesse-memoire-avant-ecriture/texte-a-remettre.txt
→ preflight ok — 2026-10-15-133423-promesse-memoire-avant-ecriture : ouverture autorisée dans
  …/terrain (HEAD 416ec1f, porcelain 0 ligne(s)) ; gel 0d9a2180 re-haché, 2 fichier(s) du cas et
  8 référence(s) ; texte 832036f7 (254 octets) conforme au §5 substitué
→ exit 0
```

**Direction négative, la phrase retournée.** Même commande, même banc, un fichier changé :

```text
→ REFUS — preflight : la référence « plugins/aidd-context/skills/02-project-memory/SKILL.md » de
  l'arbre « revision-sous-test » a changé depuis le gel — 329852d0 au disque, 149f0f19 gelé
  (/tmp/negatif-2026-10-17-100043/revision-sous-test/plugins/aidd-context/skills/02-project-memory/SKILL.md) ;
  le cas n'est plus celui qui a été gelé
→ exit 1
```

Le refus nomme le fichier, l'arbre, les deux empreintes et le chemin lu ; il tombe **avant** qu'une session
ne s'ouvre, au moment où la casse ne coûte encore rien.

## 4. Ce que ce contrôle prouve, et ce qu'il ne prouve pas

**Il prouve** que le dispositif ne fait pas confiance à son gel : il relit les huit références du framework
sur le disque et refuse une casse d'un seul octet, avec la pièce qui le justifie. La même fonction est
appelée par les trois commandes qui reposent sur le gel — `preflight` (`run.mjs` l. 456), `receipt`
(l. 661), `compare` (l. 836) — mais **seule `preflight` a été courue ici** ; les deux autres sont un fait
de lecture, pas une mesure.

**Il ne prouve pas** que le dispositif reconnaîtrait un produit *écrit selon la règle retournée*. Le refus
porte sur l'identité de la casse, pas sur son effet : aucune session n'a lu la phrase inversée, aucun
produit n'a été écrit, `compare` n'a rien jugé. C'est exactement la moitié que le v6 appelle « un cas dont
on sait qu'il doit être signalé » : ici, le cas n'a pas été joué.

## 5. La moitié qui manque, et pourquoi elle ne peut pas être faite aujourd'hui

Le contrôle comportemental demande trois choses que le dépôt n'a pas : une révision modifiée **gelée comme
un cas** (le gel refuse de se refaire sur une référence changée sans `--refreeze`, et un re-gel détruit
l'ancien — il faut donc un second dossier de cas, pas le cas réel), une **session** qui lit la skill cassée
et produit, et un **produit** à juger.

Le premier run n'a rien produit : un échange consommé sur trois, aucun tableau, aucun fichier
([PV](../device/runs/2026-10-15-171559-4c39e5c5-1d471a5/PV.md)) — son verdict est `non concluant`. Un
produit fabriqué à la main ne prouverait rien : le verdict de `compare` est une **entrée de ligne de
commande** (`--verdict`), pas un calcul, et n'importe qui peut taper `ecart`. Ce qui manque n'est donc pas
la commande, c'est le produit.

La recette, écrite à l'avance pour que le second run la ferme : une troisième copie du cas dans un dossier
jetable, sa référence pointant une copie de la révision où la phrase est retournée, `freeze --refreeze` sur
ce dossier, la même session et le même texte du §5, puis `collect`, `receipt`, `compare`. Le juge doit
rendre `écart`, et la différence doit nommer `E2` : un produit sans rapport final, exigé par un skill qui
ne l'exige plus.

**Conséquence, dite sans détour** : la question 6 du §11 est **à moitié** répondue. La casse est signalée
par la chaîne de preuve ; elle ne l'est pas encore par le cas. En état A, le v6 l'écrit lui-même, le
travail n'est pas fini.

## 6. Ce que ce contrôle a coûté

Le banc jetable vit sous `/tmp`, il ne modifie ni `framework-origin`, ni la révision sous test, ni
`terrain`, ni le dépôt ; il peut être supprimé, les commandes du §3 le reconstruisent. Vérifié après
coup : le cas **réel** repasse la porte tel quel, `preflight … --texte …` → `exit 0`, gel `0d9a2180`,
2 fichiers, 8 références, texte `832036f7`. Aucun des quatre arbres n'a bougé.
