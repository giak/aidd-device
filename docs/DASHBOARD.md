---
name: Tableau de bord
description: "les points ouverts du projet, une ligne par point, avec ce qui le fermerait et son foyer de preuve ; ni chronologie, ni inventaire de documents"
type: dashboard
status: in-progress
question: Qu'est-ce qui reste ouvert ?
---

# DASHBOARD — les points ouverts

> Une ligne par point ouvert. Un point fermé sort de cette table : ce qu'il est advenu se lit dans le
> [journal](trace.md), ce qui est vrai se lit dans l'[ARCHITECTURE](ARCHITECTURE.md). Aucune chronologie
> ici, et aucun compte recopié. Le numéro d'un point ne bouge pas : un point fermé laisse son numéro
> libre, pour qu'une séance datée puisse le citer sans mentir.

## 1. Les points ouverts

| # | Point ouvert | Ce qui le fermerait | Foyer |
| --- | --- | --- | --- |
| 1 | Le run **Freebuff** réel n'a jamais été ouvert : opencode a rendu un reçu `non concluant` puis un `conforme` sur le cas jouet, Freebuff aucun. | Un fil neuf en **mode direct**, sur le gel `ba1096aa`, trois échanges, puis `collect`, `receipt`, `compare`. | Conduite §1.7 et [liste de contrôle du 17](tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-17-095643-liste-de-controle-ouverture-second-run.md) |
| 2 | Le cas `10-task` n'a pas été rejoué avec le §5 bis du gabarit guidé. | Un run guidé dont la grille cite des `seq` de la trace jointe. | [Spec du 22:12](tasks/2026_10/2026-10-22-221207-traces-et-run-guide/2026-10-22-221207-spec-run-guide.md) |
| 3 | `tracer` n'a exporté **aucun fil Freebuff réel** : les fixtures prouvent l'adaptateur, pas ce fil. | Le premier run guidé qui appelle `tracer` sur un fil Freebuff, ou l'échec nommé. | [Brainstorm du 03:07](brainstorm/2026-10-23-030728-consolider-le-protocole.md) §6 |
| 4 | L'**indépendance** du run guidé n'est pas mesurée : l'agent a lu l'attendu avant de produire. | Un run dont la session n'a pas vu l'attendu, donc un exécutant choisi par le harnais. | [ADR-074](DECISIONS.md), run guidé §7 |
| 5 | Le **headless** est différé, pas tranché : quota 402, 413, modèle local trop lent. | Un modèle stable et un quota, ou une décision de ne plus le poursuivre. | [ADR-074](DECISIONS.md) |
| 6 | Le contrôle négatif n'est fermé qu'à moitié : une phrase de skill retournée est signalée, mais aucun produit n'a été jugé `écart`. | Un run qui produit et que le dispositif juge `écart`, et qui nomme la règle retournée. | [Journal, Séance 29](trace.md) |
| 7 | `ECART.md` existe hors de toute pull request du framework. | Sa publication dans une PR, au chemin que la spec fixe. | [ECART du premier run](device/runs/2026-10-15-171559-4c39e5c5-1d471a5/ECART.md) |
| 8 | P5 ouverte : le commit **debout** n'est pas arbitré, et le frontmatter des trois skills attend un drift démontré. | Une décision d'ADR, ou un drift mesuré. | [Journal, Séance 5](trace.md) |
| 9 | Le refus est corrigé et éprouvé ([ADR-080](DECISIONS.md)), mais le cas `03-shadow-areas` n'est ni fabriqué ni joué : aucun reçu indépendant pour un skill AIDD. | Le cas fabriqué, gelé, puis joué par `porte`, `ouvrir`, `suite` et `fin`. | [Spec du refus](tasks/2026_10/2026-10-23-082232-runs-centralises/2026-10-23-082232-spec-refus-framework.md) §4 et §5 |

## 2. Ce que cette page ne porte pas

Ni inventaire des documents (il est dans [INDEX](INDEX.md)), ni runs : l'[index généré des
runs](device/runs/INDEX.md) les compte par mode (indépendants, guidés, avortés, manuels) et porte leurs
limites. Ni commits (ils sont dans `git log`), ni prose d'historique (elle est dans le journal). Un chiffre
recopié ici serait un second foyer.
