---
name: runs — ce qu'une session a laissé
description: "L'anatomie d'un dossier de run, pièce par pièce : ce qui fait foi, ce qui est déclaré, ce qui n'est qu'une trace machine, et comment distinguer une porte franchie d'un run sans produit"
type: manuel
status: in-progress
question: Qu'est-ce qu'un dossier de run, et à quoi se fier ?
---

# runs — ce qu'une session a laissé

> Un dossier par run, nommé par sa date, son heure et un suffixe qui identifie le cas ou le fil. Les pièces
> n'ont pas toute la même valeur : certaines décident, d'autres déclarent, d'autres ne sont qu'une trace. Ce
> fichier dit lesquelles, pour qu'on ne lise pas une déclaration comme une preuve. Le classement par mode et
> les limites de chaque run sont dans l'[index généré](INDEX.md), jamais recopiés ici.

## 1. Les pièces, et ce qu'elles valent

| Pièce | Écrite par | Ce qu'elle vaut |
| --- | --- | --- |
| `gate.json` | `preflight` | la **porte** : l'instant, le dossier autorisé, l'empreinte du gel, le texte remis. Une par run ; une seconde dans le même dossier est refusée |
| `texte-a-remettre.txt` | `preflight` | le §5 du cas, verbatim, tel qu'il a été remis à la session |
| `trace/` | l'opérateur, ou `suite` | l'export de la session et la commande qui l'a produit : la pièce la plus forte du run |
| `faits.json` | `faits` | des **déclarations** (session, outil, horodatage, conduite `agent` ou `humain`), pas une mesure |
| `raw/<cas>/` | `collect` | les copies verbatim du produit, `last-message.md` et le manifeste qui les hache |
| `receipt.json` | `receipt`, à chaud | **la seule pièce qui décide** : elle re-hache le gel, la porte, la trace et le produit, et nomme les falsificateurs. Jamais reconstruite après coup |
| `output.json` | `compare` | l'écart : le verdict du juge, adossé au reçu seul |
| `verification.json` | `verifier` | les mutations jouées, quand l'attendu déclare un bloc `verification` |
| `RAPPORT.md` | `rapport`, ou `fin` | le rapport technique, régénérable, jamais écrasé sans `--remplacer` |
| `RESULTAT.md` | `resultat.mjs` | la page de décision, six sections, soixante lignes au plus ; elle exige une lecture déclarée par le cas |
| `promesse-signee.json` | `signer` | la signature du juge quand la promesse est `juge_seul` : hors du reçu, elle le lie par son empreinte |
| `run.json`, `run-guide.md`, `signature.json` | `runs.mjs` | le journal d'un run guidé ou manuel, sa page, et la signature de ses clauses par un second relecteur |
| `ECART.md` | l'auteur | l'écart publié chez le framework, pas dans ce dépôt |

Les pièces d'exception (`receipt-refus.txt`, `compare-refus.txt`, `ouvrir.log`, `horodatage_*.txt`,
`correction.json`, `annexe/`, `reprise-1/`, les notes datées) gardent la trace d'un refus ou d'une reprise :
elles se lisent avec la pièce qu'elles accompagnent, jamais seules.

## 2. Une porte franchie n'est pas un run

Un dossier qui ne porte qu'une `gate.json` est une ouverture qui n'a pas eu de reçu : la porte garde sa date
et son empreinte, et il n'y a ni produit collecté, ni verdict, ni page. C'est pourquoi un dossier sans
`RAPPORT.md` ni `RESULTAT.md` n'est pas forcément un run raté. Ce qui tranche entre les deux est la présence
d'un `receipt.json` : sans lui, rien n'a été mesuré, et aucune page ne doit prétendre le contraire.

## 3. Où lire la suite

- [index généré](INDEX.md) : les runs classés par mode, avec leurs comptes et leurs limites ;
- [PROTOCOLE](../../PROTOCOLE.md) §2 : les dix commandes, dans l'ordre, et ce que chacune écrit ;
- [ARCHITECTURE](../../ARCHITECTURE.md) §5 : la table complète des pièces, avec leur écrivain et leur durée de
  vie ;
- [BANC](../../BANC.md) : ce que les contrôles éprouvent, et ce qu'ils ne prouvent pas.
