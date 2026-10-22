---
name: Une issue pour porter le protocole au framework
description: L'angle retenu, les alternatives écartées, le corps publié dans l'issue #1079 et les trois décisions laissées aux mainteneurs
type: brainstorm
status: done
---

# ISSUE FRAMEWORK : LE PROTOCOLE DE TEST

> 2026-10-22. Brouillon à relire avant publication. Le corps est en anglais, comme les issues du dépôt
> cible. Il montre un reçu avant d'énoncer des principes, et ne décrit aucun format.
>
> **Publiée** le 2026-10-22 : https://github.com/ai-driven-dev/framework/issues/1079. Corps vérifié
> identique au fichier, à la nouvelle ligne près que `gh --jq` ajoute (`diff` : `94a95`).

## 1. Ce que je propose

Une issue courte, qui **montre le reçu** avant de nommer le principe. Le lecteur voit en dix lignes ce
qu'il obtiendrait, puis trois principes, puis une demande en quatre points. Ni schéma, ni empreinte,
ni chemin, ni client.

Ce qu'elle demande :

1. une page qui donne le vocabulaire et la forme d'un reçu ;
2. trois principes, un paragraphe chacun ;
3. un cas pilote sur un skill publié, avec son reçu ;
4. une règle dans `CONTRIBUTING.md` et un renvoi au POC, limites comprises.

## 2. Pourquoi cet angle

**Le lecteur d'une issue est un mainteneur pressé.** Une page de principes se discute ; un reçu se
lit. Mettre la forme du reçu en premier transforme « encore une méthodologie » en « voilà l'artéfact,
voilà ce qu'il prouve ».

**Le dépôt cible est saturé de vérifications structurelles.** Skills, plugins, générateurs, liens,
tests de la CLI : tout prouve qu'un artéfact existe et qu'il est bien formé. #952 et #985 renforcent
même la qualité des tests produits par les skills. Rien ne regarde ce qui se passe quand un modèle lit
la skill et agit.

**L'instrument sait se contredire, et c'est son meilleur argument.** Un reçu a déclaré un tableau
absent alors qu'il était là (ADR-047), un autre a été `conforme` avant qu'une lecture hors dossier ne
soit mesurée (ADR-049) ; les deux fois, la règle a été corrigée et le reçu historique laissé intact.

**Le POC est une preuve, pas une offre.** Quatorze reçus dont neuf refusent de conclure : c'est ce qui
autorise à dire « c'est mesurable », et rien de plus. Une phrase suffit, sans apologie.

## 3. Les alternatives écartées

- **Proposer le dispositif comme plugin** : trop lourd, lie le framework à une configuration, et
  transforme un POC en engagement de support.
- **Ouvrir une Discussion** : `config.yml` y renvoie les idées, mais ici il y a un livrable
  vérifiable et la règle du dépôt est « issue-first ».
- **Proposer un benchmark de modèles ou de skills** : mauvais objet, le dispositif juge une promesse
  de skill à une révision donnée.
- **Proposer une porte CI** : contraire au fonctionnement, qui rend un verdict à lire, pas un feu
  vert.
- **Vendre les quatorze reçus comme résultat** : deux `ecart` et trois `conforme` ne prouvent rien sur
  le framework.
- **Détailler les formats dans l'issue** : schéma, empreintes et chemins vont changer ; les écrire
  maintenant ferait vieillir la page.

## 4. Brouillon du corps de l'issue

Titre : `feat(framework): test what a skill makes an agent do`

````markdown
## Problem

You change one line in a skill. The checks stay green: the file parses, the generator emits it, the
link resolves. Nobody knows whether an agent reading it now behaves differently. The checks prove the
artifact; the promise is behavioural, and it is the only thing a skill is for.

Two failures the structure cannot see, both observed:

- a session told to write `aidd_docs/NOTES.md` wrote `aidldocs/NOTES.md`;
- a receipt said `conforme` while its trace carried reads outside the workspace, one of them another
  case's briefing.

This is not a gap in testing. `03-assert`, `05-review`, `06-test` and acceptance QA judge the
product. None compares what the session was told with what it did.

A POC exists at [giak/aidd-device](https://github.com/giak/aidd-device): 14 receipts, 9 of which
refuse to conclude. It is not the proposal. It is the proof that the comparison is measurable.

The gain is not a badge. It is a maintainer able to say, after one run, whether the change holds,
and where it does not.

## Shape of a receipt (illustrative, not a run)

```text
case      <skill> at <revision>, budget 6 exchanges
expected  the session produces <artifact> and names <decision>
observed  it produced <artifact>, named <decision>, stopped at exchange 4
verdict   conforme
limits    one run, one client, one host; says nothing about other models
```

```text
observed  it wrote NOTES.md outside the declared workspace (seq 12)
verdict   ecart
```

## Scope

- A protocol page: the vocabulary and the shape of a receipt. Principles and shape only, no file
  format.
- Three principles, one paragraph each, that a reviewer can check a case against.
- One pilot case on a shipped skill: the expectation frozen before the run, the receipt committed.
- A paragraph in `CONTRIBUTING.md`: when a case is warranted (a behavioural promise, not a typo),
  who writes the expectation, what a reviewer may conclude.
- A line pointing to the POC as the reference implementation, with its limits.

## Three principles (initial proposal)

1. **The expectation is frozen before the run.** Written or edited afterwards, it measures nothing.
2. **The session receives the request, never the expectation.** A case fixes the departure, not the
   answer.
3. **The verdict is capped by the trace.** A contradicted expectation forbids `conforme`; a missing
   trace forbids every verdict but `non concluant`.

## Acceptance criteria

- [ ] The page lets a reader who never saw the POC say what a receipt proves and what it does not.
- [ ] The pilot case names the promise it tests; its receipt names one verdict and its limits.
- [ ] `CONTRIBUTING.md` says when a case is warranted and who owns the expectation.
- [ ] No CI gate, no dependency, no host support claim, no model ranking.
- [ ] The POC is cited with its limits, never as proof that the framework works.

## Prior art in this repo

- [`aidd-qa/01-acceptance-qa`](https://github.com/ai-driven-dev/framework/blob/main/plugins/aidd-qa/skills/01-acceptance-qa/SKILL.md)
  verifies a running product through its interface.
- [`03-assert`](https://github.com/ai-driven-dev/framework/blob/main/plugins/aidd-dev/skills/03-assert/SKILL.md),
  [`05-review`](https://github.com/ai-driven-dev/framework/blob/main/plugins/aidd-dev/skills/05-review/SKILL.md)
  and [`06-test`](https://github.com/ai-driven-dev/framework/blob/main/plugins/aidd-dev/skills/06-test/SKILL.md)
  run or judge the product.
- #983 adds `validator` and `checker`; they read a candidate, not the session that produced it.
- #707 and #978 set the evidence discipline this protocol borrows: a claim never exceeds what the
  test class proves.

All of them judge the product. None reads the session against a frozen expectation.

## Out of scope

- Benchmarking models, ranking skills, publishing comparative scores.
- A CI gate, a merge blocker, or a badge: a case is evidence a maintainer reads.
- Vendoring the POC, promising host coverage, supporting another client in V1.
- Rewriting existing skills, or replacing unit, integration, acceptance QA and telemetry.
- Fixing the protocol's formats now: they will change, and the issue must survive that change.
- A skill or a CLI that runs a case: later, once the page holds. This issue asks for the page and one
  case, not the runner.

## Open questions for maintainers

1. Home: a root `docs/PROTOCOL.md`, or a reference inside `aidd-qa`? I recommend the root page,
   because the object under test is the framework.
2. Ownership: may a contributor write the expectation for their own change, or must a maintainer own
   the first one to avoid grading one's own work?
3. Pilot: which shipped skill should carry the first case? I propose a small one with an observable
   product, `aidd-pm/05-spike` or `aidd-dev/01-plan`.
````

## 5. Ce que le brouillon ne dit pas

- Aucun chiffre du MEGA-PROMPT (458 fichiers, 16 413 lignes) : ces valeurs sont `SUPPOSÉ`.
- Aucun schéma, aucune empreinte, aucun chemin, aucun client : le format appartient à la page de
  protocole.
- Aucune promesse de date, de portabilité, ni d'intégration au CLI.
- Aucune affirmation qu'un `conforme` se reproduit, ni que les reçus du POC prouvent le framework.
- Aucune revendication de nouveauté absolue : le prior art dit ce qui existe et où la différence se
  situe.

## 6. Ce qui a été vérifié avant de publier

- [ ] Re-mesurer et dater : 14 reçus, dont 9 `non concluant` ; 4 cas gelés. Relevé du 2026-10-22 sur
      `main` distant (`gh api .../git/trees/main`).
- [ ] Vérifier l'exemple : `request.md:36` dit `terrain/aidd_docs/NOTES.md`, le reçu porte
      `terrain/aidldocs/NOTES.md`.
- [ ] Vérifier `aidd-pm/05-spike` à la révision citée avant d'en faire le cas pilote.
- [ ] Choisir le scope : `framework` (recommandé, autorisé par `commitlint.config.cjs`) ou `docs`.
- [ ] Relire à froid : une issue ne se réécrit pas après publication.

## 7. Les trois décisions qui restent

1. **Le foyer** : page racine `docs/PROTOCOL.md` (recommandé) ou référence dans `aidd-qa`.
2. **L'auteur de l'attendu** : mainteneur pour le cas pilote (recommandé), contributeur ensuite.
3. **Le skill du cas pilote** : `aidd-pm/05-spike` (produit observable, budget court) ou
   `aidd-dev/01-plan` (plus central, plus long à juger). Recommandé : `05-spike` d'abord.

## 8. Ce qui reste hors de l'issue, et pourquoi

Les questions de mise en œuvre sont réelles et non résolues : un reçu du POC porte des chemins
absolus (`/home/giak/...`), donc un reçu commité exigera une racine de cas relative ; le schéma du cas
et l'empreinte de l'attendu restent à écrire. Ces points appartiennent à la page de protocole et à son
premier cas. Les mettre dans l'issue la ferait porter des détails qui changeront.
