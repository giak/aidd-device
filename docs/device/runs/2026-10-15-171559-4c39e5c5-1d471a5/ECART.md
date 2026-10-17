---
name: ECART — le premier cas, run `non concluant`
description: Le compte-rendu du premier run dans la forme que la pull request attend — phrase de verdict, écart nommé, limites qui mordent, preuve du contrôle négatif, révisions, commande qui refait le run — et ce qui manque pour qu'il soit publiable
type: ecart
status: in-progress
---

# ECART — le cas « promesse-memoire-avant-ecriture »

> V0.1 — 2026-10-17. Écrit au foyer du run, à côté de ses pièces brutes, dans la **forme** que la
> pull request du framework attend : la phrase de verdict, l'écart du cas, les limites qui mordent, la
> preuve du contrôle négatif, la révision du framework, la révision du dispositif et la commande qui le
> clone, la commande qui refait le run, et ce qui n'a pas été fait. Destiné à
> `aidd_docs/tasks/<mois>/<dossier de la tâche>/ECART.md` dans un working copy de la PR — jamais
> l'origine. **Il n'y est pas** : aucune PR n'existe, donc aucune copie de travail n'existe ; le geste
> de publication est nommé au §7, pas fait.
>
> Aucun lien markdown : le dépôt du framework fait tomber un contrôle sur un lien mort
> (`check-markdown-links.js`), donc chaque chemin est cité en `backticks`.

## 1. Ce qu'il faut savoir en une ligne

**Au vu de l'attendu écrit, le produit fait *rien* : la session a lu une copie installée de la skill, lu
le dépôt, et s'est arrêtée sans rendre le tableau qu'elle devait rendre avant d'écrire ; l'attendu disait
qu'elle rend d'abord un tableau lu depuis le dépôt et attend la réponse de l'opérateur, puis écrit les
seules destinations de `memory-destinations.md`.**

C'est la phrase de verdict du run. Elle compare, elle n'attribue pas : elle ne dit pas pourquoi la
session s'est arrêtée.

## 2. Les révisions, et de quoi ce document parle

| Ce qui est nommé | Valeur | Où elle se lit |
| --- | --- | --- |
| cas | `2026-10-15-133423-promesse-memoire-avant-ecriture` | `docs/device/CASES/` |
| framework, révision sous test | `4c39e5c59f54b9b34b51af3ee552dbfb8dfb6651` | gel `0d9a2180`, arbre `revision-sous-test` |
| terrain | `416ec1fa08b7c8cabb8dedb4d5fd0eec37a5afde` | gel, arbre `terrain` |
| dispositif, au moment du run | `1d471a5`, **plus des fichiers non commités** (PV §6.8) | nom du dossier du run |
| dispositif, au moment de ce document | `6f7f583`, arbre de travail non commité au-dessus | `git -C <dispositif> rev-parse --short HEAD` |
| run | `docs/device/runs/2026-10-15-171559-4c39e5c5-1d471a5`, `17:15:59`–`17:29:51` | `horodatage_debut.txt`, `horodatage_fin.txt` |

Le dispositif se récupère par `git clone https://github.com/giak/aidd-device.git` ; le gel se rejoue par
la formule du `docs/tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md`
§1.1, qui rend `True` sur chacun de ses fichiers et de ses références, puis sur l'empreinte, et sort en
`1` sur un seul `False`.

## 3. L'écart

| | |
| --- | --- |
| **attendu** | lire la skill à un chemin absolu, parcourir le dépôt, rendre **un tableau** — une ligne par capacité et par outil, chacune avec sa preuve (un chemin, une dépendance) — puis **s'arrêter et attendre** la réponse de l'opérateur ; ensuite seulement écrire les destinations de `memory-destinations.md`, sans `TODO` ni `<placeholder>`, et finir par un rapport court |
| **produit** | rien. Trace : trois `Glob`, tous à **0 résultat** (dont `**/framework-origin/**`), des lectures de fichiers, trois `read` sans arguments (`Tool call arguments were not completed and were not executed`), un dernier message de raisonnement seul. Aucun tableau, aucune question, aucun fichier. `aidd_docs/` absent avant et après |
| **différence nommée** | l'attendu commence par **montrer avant d'écrire** ; le run n'a jamais montré. Le premier pas du flux promis n'a pas eu lieu, donc les suivants n'ont pas commencé. Deuxième différence, distincte : l'objet lu n'était pas la révision sous test mais une copie installée (`~/.config/aidd/cache/built/5.4.0/…`), un état **postérieur** de la skill — 4 fichiers sur 44 diffèrent, dont deux qui alimentent des destinations attendues |
| **verdict** | `non concluant` |
| **pourquoi pas `écart`** | un verdict `écart` demande un produit à comparer. Ici le produit n'existe pas, et la spec §9 dit ce cas : produit = la sortie brute, verdict `non concluant` |

Le budget n'a pas été épuisé : **un** échange consommé sur trois. Celui qui manque est le **premier** —
celui où le tableau devait arriver — et il manque du fait de la session, pas de l'opérateur : aucune des
deux réponses figées n'avait de déclencheur, la session n'ayant posé aucune question.

## 4. Les limites qui mordent

| Falsificateur de l'attendu gelé | Mord ? | Mesure |
| --- | --- | --- |
| `F1` — un produit né avant le tableau | non évaluable | aucun produit |
| `F2` — la trace ne porte aucun tableau | **mord** | la trace ne porte que globs, lectures, échecs d'outil et raisonnement |
| `F3`, `F4`, `F6`, `F7` | non | supposent un produit ; il n'y en a pas |
| `F5` — une écriture hors du répertoire de travail | **non** | les quatre arbres ont le même `HEAD` et le même `porcelain` après le run ; la copie installée n'a reçu que des lectures |
| `F8` — aucun fichier sous `terrain/aidd_docs/` | **mord** | 0 fichier, mesuré pendant le run toutes les 15 s (`veille-etat.txt`) et après |
| `F9` — la trace ne montre aucun accès à la révision sous test | **mord** | écrit **après** ce run ; appliqué à sa trace conservée, il nomme la même différence que le §3 : aucun appel d'outil ne touche `framework-origin` |

Les limites **du run lui-même**, telles que son PV les porte : message passé entre guillemets par le
client (deux caractères ajoutés) ; session pilotée en ligne de commande, pas ouverte dans une interface ;
`--auto`, donc permissions pré-approuvées ; modèle substitué, le défaut configuré étant absent du serveur ;
contexte du client reçu en plus du texte (règles globales, skills globales, serveurs MCP) ; les deux
réponses figées inutilisées ; **l'opérateur et le juge sont le même contexte**, la séparation du §8 de la
spec n'est pas tenue.

Une pièce du run cite un chemin mort : `faits.json` porte
`/home/giak/runs/aidd-device/2026-10-15-133335-promesse-memoire-avant-ecriture/terrain`, l'espace de
travail d'avant son déplacement vers `~/projects/aidd-device-work`. La copie est la même (`416ec1f`), le
chemin ne l'est plus.

## 5. La preuve du contrôle négatif

`docs/device/NEGATIVE.md`, mesuré le 2026-10-17 : une phrase de
`plugins/aidd-context/skills/02-project-memory/SKILL.md` retournée dans une copie jetable de la révision —
`End with a short report of what changed.` → `Never report what changed.` — fait passer `preflight` de
`exit 0` à `exit 1`, avec la sortie qui le nomme :

```text
REFUS — preflight : la référence « plugins/aidd-context/skills/02-project-memory/SKILL.md » de
l'arbre « revision-sous-test » a changé depuis le gel — 329852d0 au disque, 149f0f19 gelé (…) ;
le cas n'est plus celui qui a été gelé
```

Ce que ce contrôle prouve et ce qu'il ne prouve pas est écrit là-bas : il signale **l'identité** de la
casse, pas son effet. Aucun produit n'a été écrit selon la règle retournée, donc la moitié
comportementale du contrôle négatif manque encore, et la question 6 du §11 du v6 reste à moitié répondue.

## 6. Ce qui n'a pas été fait

1. **Aucun `receipt.json`, aucun `output.json`.** Les trois commandes ont refusé, et leurs refus sont
   conservés à côté : `collect` → `--from absent : …/terrain/aidd_docs` ; `receipt` → `aucun manifeste …
   lancer collect d'abord` ; `compare` → `aucun reçu … le juge travaille sur le reçu seul (§8)`. Ce run
   est antérieur au chemin sans produit ; le harnais sait désormais écrire ces deux pièces
   (`collect --sans-produit`), et le second run les produira.
2. **Aucune PR, aucun working copy.** Ce document est prêt à être copié sous
   `aidd_docs/tasks/<mois>/<dossier de la tâche>/ECART.md` dans un checkout du framework — jamais
   l'origine, jamais en écriture dans `framework-origin`.
3. **Aucun second run.** Le geste reste à faire : un fil neuf en mode direct dans le projet déjà ouvert sur
   la copie du terrain, le texte du §5 collé mot pour mot, trois messages au plus.
4. **La moitié comportementale du contrôle négatif**, décrite ci-dessus.
5. **Ce document n'est pas commité** : l'arbre de travail du dispositif le porte en non suivi.

## 7. Comment refaire le run, et comment contester sans rien cloner

Le texte remis ne se retape pas : il se copie du cas, `$RACINE` substitué, et la porte le vérifie — le
bloc exact est au `docs/tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md`
§1.0, puis §2.1 pour l'ouverture et les deux réponses figées, §2.3 pour le budget. L'ordre complet, après
laquelle le harnais juge, est le §3 de la même page.

Contester ce compte-rendu ne demande rien à installer : les pièces brutes sont ici, dans ce dossier du
run — `trace/session-ses_ebfdd6595ffentQru7gA9UPLSc.json` (161 022 octets, `sha256`
`40f7bb60…`), l'échange lisible `trace/echange-1.txt`, les trois refus, `faits.json`, `veille-etat.txt`,
les deux horodatages. Ce document ne prouve pas que la session *ne pouvait pas* rendre le tableau ; il
constate qu'elle ne l'a pas rendu, sur une trace qu'un tiers peut relire.
