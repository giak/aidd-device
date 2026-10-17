---
name: Répétition à blanc — l'ouverture du second run
description: La liste de contrôle suivie ligne à ligne sur une copie jetable du cas, ce qui a pu être éprouvé, ce qui ne pouvait pas l'être faute de session, les six trous trouvés et les réparations apportées à la liste
type: repetition
status: done
---

# Répétition à blanc — l'ouverture du second run

> Née le 2026-10-17 à 10:06:09 (`stat -c %w`). Elle suit la
> [liste de contrôle](2026-10-17-095643-liste-de-controle-ouverture-second-run.md) ligne à ligne, sur une
> copie jetable du cas, avant de payer un vrai run. Elle ne remplace ni la liste ni la conduite : elle dit
> ce que la liste fait quand on l'exécute, et ce qu'elle ne dit pas.

## 1. Ce que la répétition pouvait éprouver, et ce qu'elle ne pouvait pas

Pouvait : tout ce qui se lit ou s'écrit sur le disque — le gel, la porte, le nom du dossier du run,
`collect`, `receipt`, `compare`, et la requête SQL du fil.

Ne pouvait pas : **ouvrir un fil**. La répétition n'a aucune session, donc les étapes 4.1 (fil neuf, mode
direct), 4.3 (coller le texte) et 4.4 (comparer le premier message stocké au texte gelé) restent non
éprouvées — la requête de 4.2, elle, s'exécute pour de vrai, mais sur une base qui n'a **aucun** fil à
rendre.

## 2. Le banc, et ce qu'il a appris au passage

`/tmp/repetition-2026-10-17-100539` : une copie du terrain, une copie de la révision sous test, une copie de
`CASES/`. Le cas y est re-gelé avec `freeze --refreeze --racine <banc>` ; le gel neuf rend **la même
empreinte, `0d9a2180`**, et la même sortie : `2 fichiers du cas, 8 reference(s) du framework, 4 arbre(s)`,
`exit 0`. C'est une vérification de plus que le cas voyage : son empreinte ne dépend ni de la machine, ni
du chemin, ni du nom du dossier.

## 3. Ligne par ligne

| Étape de la liste | Éprouvée ? | Ce qu'elle a rendu |
| --- | --- | --- |
| §2 — la porte | oui | `preflight ok … (HEAD 416ec1f, porcelain 0 ligne(s)) ; gel 0d9a2180 re-haché, 2 fichier(s) et 8 référence(s)` — `exit 0` |
| §4.1 — fil neuf, mode direct | **non** | aucune session ; rien à mesurer |
| §4.2 — la requête du fil | oui, sur la base réelle | `sqlite3 -readonly … from threads;` — `exit 0`, **0 ligne** (le projet n'a pas encore de fil) |
| §4.3 — coller le texte | **non** | — |
| §4.4 — le premier maillon | **non** | demande un fil et un message |
| §4.5 — l'export de la trace | oui, en structure | fichier créé à `$RUN/trace/echange.jsonl`, puis nommé dans `faits.json` |
| §4.6 — le nom du dossier | oui | `<horodatage>-4c39e5c5-6f7f583` produit par la commande de la liste |
| §4.7 — `collect` | oui | `2 fichier(s) verbatim`, source sous l'arbre `travail` — `exit 0` |
| §4.7 — `receipt` | oui | `verdict ecart ; produit 2 fichier(s) ; 1 limite(s)` — `exit 0`, reçu à 20 champs |
| §4.7 — `compare` | oui | `verdict ecart, limites « non évaluable »` — `exit 0`, `output.json` à 11 clés, 7 attendus écartés |
| §4.7 — sans produit | oui | `collect --sans-produit` → 0 fichier ; `receipt` → `non concluant`, 3 limites ; `compare` → `non concluant` — trois `exit 0` |

## 4. Les six trous trouvés

La liste disait, au §4.7 : « L'ordre et les champs sont ceux de la conduite §3 ; cette liste ne les
recopie pas. » Suivie à la lettre, elle laisse six gestes sans commande, et quatre d'entre eux font refuser
le harnais.

1. **Rien ne dit d'écrire `faits.json`.** `receipt` le prend en argument et refuse un champ vide ; sans lui,
   pas de reçu. La liste ne le nomme nulle part.
2. **Rien ne dit d'écrire `last-message.md`.** La conduite le demande sous `raw/<cas>/`, la liste l'oublie.
3. **Le chemin de l'export n'est pas relié aux faits.** `faits.trace.chemin_exporte` doit nommer le fichier
   exporté ; sinon `receipt` ne refuse pas, il **ajoute une limite** — « trace machine introuvable » — et
   on découvre après coup que la pièce (1) manque.
4. **La branche « aucun produit » manque.** Le premier run est exactement ce cas, et la liste n'a que
   `collect --from` : sans `--sans-produit`, `collect` refuse, donc `receipt` et `compare` refusent. Éprouvé
   ici : les deux branches passent, `exit 0`.
5. **La règle du reçu écrit à chaud manque.** `receipt` refuse d'écraser un reçu existant : un reçu
   reconstruit est un témoignage. La liste ne le dit pas, et un opérateur qui relance la commande après une
   faute de frappe la verra refuser sans comprendre.
6. **Le verdict est lié.** `receipt` refuse un verdict autre que `non concluant` quand un falsificateur
   mord ; `compare` refuse un verdict autre que `non concluant` quand le reçu conclut ainsi. Le verdict se
   choisit donc **au reçu**, et la liste ne dit pas qu'il est contraint.

Un septième point, qui n'est pas un trou de la liste mais l'a fait trébucher : `collect`, `receipt` et
`compare` lisent le gel dans `docs/device/CASES` **par défaut**. C'est ce qu'il faut pour le vrai run ;
sur le banc, il a fallu `--cases`, sans quoi `collect` refusait un produit « hors de l'espace de travail
gelé » — le refus était juste, le gel lu était celui du vrai cas.

## 5. Ce que la répétition ne prouve pas

- **Rien du client** : aucun fil, donc ni mode direct, ni racine de projet, ni texte stocké. Les étapes
  4.1, 4.3 et 4.4 restent à faire au vrai geste.
- **Rien du candidat** : le produit est factice, deux fichiers écrits pour l'exercice, et le reçu dit
  lui-même « répétition à aucune session ». Aucun de ces fichiers n'est cité comme un run.
- **Le chemin du dossier du run** : la commande a été éprouvée, pas son parent `docs/device/runs/` — un
  `mkdir` sous `/tmp` a tenu lieu.
- **Le verdict** : `ecart` a été passé à la main, comme au vrai run. La répétition prouve que la chaîne
  l'accepte, pas qu'il soit juste.

## 6. Les réparations faites à la liste

Le §4 de la liste de contrôle gagne, après la répétition : `faits.json` écrit à chaud avec les champs du
§1.4 de la conduite, `last-message.md` sous `raw/<cas>/`, le chemin de l'export recopié dans
`faits.trace.chemin_exporte`, les **deux** branches de `collect`, la règle du reçu écrit une fois, et le
verdict contraint par les falsificateurs. Chaque ajout renvoie à la ligne de la conduite qui le fonde.
