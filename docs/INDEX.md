---
name: INDEX — la carte documentaire
description: "quelle page répond à quelle question : le foyer, la question, la nature et le statut de chaque page du dépôt"
type: index
status: in-progress
question: Quelle page répond à quelle question ?
---

# INDEX — la carte documentaire

> La règle vit dans `~/.AGENTS.md` (une page, une question ; une réponse, un foyer). Cette page ne la
> répète pas : elle nomme les foyers. Une question absente de ce tableau n'a pas de foyer, donc pas de
> réponse. Une page absente de ce tableau est un orphelin, donc un défaut.

## 1. Les foyers

| Foyer | La question qu'il répond | Nature | Statut |
| --- | --- | --- | --- |
| [AGENTS.md](../AGENTS.md) | quel comportement l'agent tient-il ici ? | règle | vivant |
| [INDEX](INDEX.md) | quelle page répond à quelle question ? | carte | vivant |
| [VISION](VISION.md) | pourquoi ce dispositif existe-t-il ? | état stable | vivant |
| [ARCHITECTURE](ARCHITECTURE.md) | comment le dispositif est-il fait aujourd'hui ? | état | vivant |
| [PROTOCOLE](PROTOCOLE.md) | comment conduit-on un test, et que prouve chaque étape ? | protocole | vivant |
| [DASHBOARD](DASHBOARD.md) | qu'est-ce qui reste ouvert ? | état | vivant |
| [DECISIONS](DECISIONS.md) | pourquoi chaque choix, et quelles options ont été écartées ? | décision | vivant |
| [trace](trace.md) | que s'est-il passé, et quand ? | récit | vivant |
| [BANC](BANC.md) | quels contrôles, et que prouvent-ils ? | manuel | vivant |
| [REPLAY](REPLAY.md) | comment rejouer un gel depuis un clone neuf ? | manuel | vivant |
| [guide-utilisateur](guide/guide-utilisateur.md) | comment une personne s'en sert-elle ? | guide | vivant |
| [explication](guide/explication.md) | comment expliquer le dispositif à qui n'en connaît rien ? | guide | vivant |
| [guide-du-test](guide/guide-du-test-de-bout-en-bout.md) | comment l'apprendre par les gestes ? | guide | vivant |
| [tasks/](tasks/) | quel travail est spécifié, et pour quel besoin ? | travail | vivant |
| [brainstorm/](brainstorm/) | quel raisonnement a précédé une décision ? | travail | vivant |
| [CASES/](device/CASES/) | quelles demandes, quels attendus, quels gels ? | preuve | vivant |
| [runs/](device/runs/) | quelles pièces un run a-t-il laissées ? | preuve | vivant |
| [runs/INDEX](device/runs/INDEX.md) | quels runs, par mode, et quelles limites ? | preuve | vivant |
| [README](../README.md) | comment entrer dans ce dépôt ? | entrée | vivant |

## 1 bis. Les notes

Une note est un fichier daté qui ne répond plus à une question : il renvoie à son repreneur, et il existe
pour qu'un lien ancien ne meure pas. Une note ne s'édite pas, et ne compte pas comme un foyer.

| Note | Repreneur | Depuis |
| --- | --- | --- |
| [ORCHESTRATEUR](device/ORCHESTRATEUR.md) | [PROTOCOLE](PROTOCOLE.md) | 2026-10-23 |
| [DEVICE](device/DEVICE.md) | [ARCHITECTURE](ARCHITECTURE.md), [README](../README.md) | 2026-10-23 |
| [BOUNDARY](device/BOUNDARY.md) | [ARCHITECTURE](ARCHITECTURE.md) §3 et §3.1 | 2026-10-23 |
| [NEGATIVE](device/NEGATIVE.md) | [journal](trace.md) Séance 29, [DASHBOARD](DASHBOARD.md) | 2026-10-23 |
| [PFD](PFD.md) | [VISION](VISION.md), [DASHBOARD](DASHBOARD.md) | 2026-10-23 |
| [EXPLICATION](EXPLICATION.md) | [guide/explication](guide/explication.md) | 2026-10-23 |
| [device/BANC](device/BANC.md) | [BANC](BANC.md), déplacé | 2026-10-23 |
| [device/REPLAY](device/REPLAY.md) | [REPLAY](REPLAY.md), déplacé | 2026-10-23 |

## 2. Comment naviguer

- Une question se lit d'abord ici, puis dans le foyer qu'elle nomme. Jamais dans une page voisine qui la
  recopie.
- Une page se lit par ses en-têtes : chacun énonce une idée, et les dix premières lignes disent ce que la
  page répond et ce qu'elle ne répond pas.
- Un fait chiffré se cite par son foyer. S'il apparaît ailleurs, c'est un défaut, même si les deux copies
  concordent.

## 3. Ce que cette carte ne porte pas

Aucun contenu, aucune mesure, aucun statut d'avancement. Le statut d'une page est `vivant`, `note` ou
`preuve` ; un point ouvert se lit dans [DASHBOARD](DASHBOARD.md), pas ici.

## 4. Tenue de la carte

Une page créée, déplacée ou absorbée met cette table à jour dans le même geste. Une page absorbée devient
une **note** datée qui renvoie à son repreneur : son contenu a été repris ailleurs, pas recopié, et un lien
ancien continue de mener quelque part.
