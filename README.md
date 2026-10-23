# aidd-device

Le dispositif de test du framework AIDD : il fait exécuter une modification du framework par une
session ouverte par l'opérateur, et nomme l'écart entre ce qu'elle annonce et ce qu'elle produit.

## Entrées

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — **la vue d'ensemble**, et c'est par ici qu'un nouveau
  lecteur commence : le dispositif fait exécuter une modification du **framework AIDD** (un framework de
  compétences markdown pour assistants IA, publié sur `github.com/giak/framework`) par une session IA, et
  nomme l'écart entre ce qu'elle annonce et ce qu'elle produit. Puis les acteurs et ce que chacun ne voit
  jamais, les arbres et qui écrit où, les six commandes du harnais, la vie des artefacts, les
  falsificateurs et le plafond du verdict, en cinq schémas. Le pourquoi du dépôt est à la
  [VISION](docs/VISION.md).
- [AGENTS.md](AGENTS.md) — le contrat de travail, autonome : il vaut pour tout ce qui s'écrit ici.
- [docs/device/DEVICE.md](docs/device/DEVICE.md) — le dispositif en une page : ce qu'il fait, ce qu'il ne
  fait pas, ce qui part, ce qui revient, comment le récupérer et le lancer.
- [docs/device/BOUNDARY.md](docs/device/BOUNDARY.md) — la frontière : les quatre arbres, les chemins
  lus, et la preuve que le framework est intact et qu'aucun fichier du dispositif ne lui appartient.
- [docs/device/REPLAY.md](docs/device/REPLAY.md) — la recette qu'un inconnu suit pour rejouer le gel
  depuis un clone neuf : le bloc exact, la sortie observée, et les limites qu'elle ne franchit pas.
- [docs/device/BANC.md](docs/device/BANC.md) — le banc du harnais : les 268 contrôles qui éprouvent ses
  refus et ses acceptations, comment les lancer, et ce qu'ils ne prouvent pas.
- [docs/guide/guide-utilisateur.md](docs/guide/guide-utilisateur.md) — **le guide utilisateur** : tu
  arrives avec un skill à tester, tu dis « test ça » dans une session d'agent, l'agent conduit, tu confirmes
  ce qu'il a lu de ton skill, tu fais trois gestes, et tu lis le verdict avec la phrase qui dit ce qu'il
  atteste. Les commandes ne sont qu'en annexe (ADR-041). Depuis le 2026-10-22, le mode par défaut est le
  **run guidé** dans la conversation courante ([ADR-074](docs/DECISIONS.md)), consigné dans le gabarit de
  la [spec du 22:12](docs/tasks/2026_10/2026-10-22-221207-traces-et-run-guide/2026-10-22-221207-spec-run-guide.md)
  §3 et sans reçu ; ce guide et l'orchestrateur décrivent le **run indépendant**.
- [docs/guide/guide-du-test-de-bout-en-bout.md](docs/guide/guide-du-test-de-bout-en-bout.md) — le guide
  pédagogique : lire un reçu, rejouer un gel, provoquer trois refus, lire un tableau, lire le cas
  jouet ; chaque sortie a été observée, et chaque chapitre se termine par un refus provoqué.
- [docs/EXPLICATION.md](docs/EXPLICATION.md) — le projet raconté simplement, pour qui n'en
  connaît rien : analogies, schémas, état réel au 2026-10-22, échecs compris.
- [docs/brainstorm/2026-10-15-201458-bilan-premier-run.md](docs/brainstorm/2026-10-15-201458-bilan-premier-run.md)
  — le bilan du premier run : ce qui a marché, les quatre causes du `non concluant`, les arbitrages à
  rendre et les brainstorm à conduire, avec schémas.
- [docs/trace.md](docs/trace.md) — le journal des séances, une entrée par séance.
- [docs/VISION.md](docs/VISION.md) · [docs/PFD.md](docs/PFD.md) · [docs/DECISIONS.md](docs/DECISIONS.md) ·
  [docs/DASHBOARD.md](docs/DASHBOARD.md) — la raison d'être, les phases, les décisions, l'état.

## État

Un run a eu lieu le 2026-10-15 (`17:16:12`–`17:29:51`, session `opencode`) et s'est conclu
**`non concluant`** : la session n'a rendu aucun tableau et n'a rien écrit. Le harnais est écrit
([docs/device/harness/run.mjs](docs/device/harness/run.mjs), 2 869 lignes, six commandes : `freeze`
— qui déclare une seule fois la racine des espaces de travail, dont dérivent les deux copies du cas —,
`preflight` — la porte qui refuse d'ouvrir une session ailleurs que dans l'espace de travail gelé, et
vérifie le texte remis —, `faits` — les valeurs que le reçu exigera, dérivées du fil ou de la session opencode et du gel —,
`collect` — qui ne prend pour produit que ce que la session a écrit dans cet
espace, et dont `collect --sans-produit` pour un run qui ne rend rien —,
`receipt`, `compare`), le premier cas est **re-gelé** après le run, après le déplacement de l'espace de
travail, puis après le passage à la racine déclarée, puis le 2026-10-21 pour le bloc `cloisonnement`
(empreinte `ba1096aa`, [ADR-052](docs/DECISIONS.md), [docs/device/CASES/](docs/device/CASES/)) et
la conduite du run est écrite
([2026-10-15-154303-run.md](docs/tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-154303-run.md)).
Le compte-rendu du run est dans
[docs/device/runs/2026-10-15-171559-4c39e5c5-1d471a5/PV.md](docs/device/runs/2026-10-15-171559-4c39e5c5-1d471a5/PV.md),
et les raisons de ce verdict, ses arbitrages et ses brainstorm sont au
[bilan du premier run](docs/brainstorm/2026-10-15-201458-bilan-premier-run.md).

**Au 2026-10-16.** Les trois trous du premier run sont comblés (reçu d'un run sans produit, chemin du
§5 qui ne résolvait pas, lecture de la révision sous test non mesurée) et le client du second run est
sondé : ses foyers, le mode *worktree* à refuser, le texte remis stocké octet pour octet. Le harnais a
désormais son banc dans le dépôt, **50/50 PASS**, et le nom du dossier d'un run est tranché
([ADR-023](docs/DECISIONS.md) : des tirets). Ce qui reste n'est plus une mesure mais un geste : ouvrir un
projet Freebuff sur `<W>/terrain`, en mode direct et sans *worktree*, puis conduire le second run. L'état
courant, ses trous et les prochains pas sont au [tableau de bord](docs/DASHBOARD.md). Et rien n'a encore
produit d'écart : aucun `output.json` n'existe, `NEGATIVE.md` (casser quelque chose exprès et le voir
signalé) et `ECART.md` (le compte-rendu rendu au framework) restent à écrire.

**Au 2026-10-18.** Le dispositif a sa face interactive : [ORCHESTRATEUR.md](docs/device/ORCHESTRATEUR.md)
et `harness/orchestrer.mjs` (1 562 lignes, huit commandes — `cas` fabrique et gèle un cas, `porte` écrit le
texte et autorise l'ouverture, `ouvrir` ouvre la session opencode par l'API et joue la pause du cas
(ADR-059), `suite` dérive faits, trace et copie, `fin` demande le verdict imposé puis écrit le reçu,
l'output et le rapport, `rapport` reconstruit le rapport d'un run clos, `lire` relit sans écrire —), la ligne d'`AGENTS.md` qui route « test ça » vers cette page, et
le [guide utilisateur](docs/guide/guide-utilisateur.md), qui ne demande aucune commande à la personne. Le
banc du dépôt passe **153/153** (`exit 0`) et le contrôle de liens ne rend aucun lien mort sur 46 fichiers ;
les deux pages qui parlent des commandes sont confrontées au code, donc aucune ne peut plus nommer une
option ou un refus qui n'existe pas. Trois portes ont été passées, et aucune n'a encore reçu de reçu :
aucun `receipt.json` n'existe. Ce qui reste n'est plus une mesure mais un geste : dire « test ça » et
ouvrir le fil.

**Au 2026-10-20.** Le premier `receipt.json` d'un run opencode réel existe, dans
[docs/device/runs/2026-10-20-202333-50664060-1028c8b](docs/device/runs/2026-10-20-202333-50664060-1028c8b/receipt.json) :
session `ses_ea564a976ffevcpzB4aY03ELBF`, `session_verifiee.outil = "opencode"`, deux échanges sur
deux, verdict `non concluant`. Le modèle a rendu un tableau d'une colonne, puis écrit
`aidldocs/NOTES.md` au lieu de `aidd_docs/NOTES.md` ; F2 mordait aussi parce que la forme mécanique H6
exigeait deux colonnes, ce que l'ADR-047 a corrigé : la même trace rend désormais `tableau.present`
vrai, sans réécrire le reçu du dépôt. Une session ouverte dans `<W>` est refusée par `faits` et `suite`. Les trois
gestes ont été exécutés par l'agent via l'API du client, pas par une personne devant l'interface :
c'est la limite nommée de ce premier reçu.

**Au 2026-10-21.** Le second run opencode du cas jouet a son [rapport utilisateur](docs/device/runs/2026-10-20-222845-50664060-3d0db46/RAPPORT.md).
Il dit ce que `conforme` couvre, et surtout ce qu'il ne couvrait pas : la trace montre que la session a lu
deux documents hors de son dossier, dont le kit d'un autre cas. L'ADR-049 ajoute ce contrôle : une lecture
hors du dossier du cas interdit désormais `conforme`. `fin` écrit aussi `RAPPORT.md` automatiquement, à
partir du reçu, de l'output et de la trace, et la commande `rapport` le reconstruit pour un run déjà clos
(ADR-050).
Le cas jouet n'est plus intact (budget 2/2, `aidd_docs/NOTES.md` dans le terrain) ; le rapport proposait
de mesurer les lectures hors dossier, ce que l'ADR-049 fait, et de rejouer dans un bac propre, ce qui
reste à faire.

**Le même jour, le cadre cesse d'être supposé.** Les deux `expected.json` portent un bloc
`cloisonnement` que `receipt` lit : racines de lecture et d'écriture, réseau, fichiers de contexte
(ADR-052). Un attendu sans bloc est refusé, une lecture hors des racines déclarées interdit `conforme`,
et le banc passe à **193/193**. Les deux cas sont re-gelés (`ba1096aa` pour la promesse mémoire,
`ea4523ef` pour le cas jouet) ; aucun reçu existant n'est réécrit.

**Puis les effets d'une commande.** L'audit des 35 commandes `shell` du run « promesse mémoire » a
montré que la session avait encore lu le brief d'un autre projet, cette fois par `cat`, et que la trace
ne gardait pas le texte de la commande. `clients.mjs` écrit désormais `commande`, et `receipt` en lit
cinq falsificateurs : lecture hors du cadre, écriture hors du produit, réseau, commande non
interprétable, fichier nouveau hors du produit (ADR-051) ; `/dev/null` n'est ni une lecture ni une
écriture (ADR-053), F7 compare le produit aux fichiers lus avant sa naissance (ADR-054), et une lecture
dans la seconde de naissance ne le fait pas mordre (ADR-055). Le banc
passe à **223/223** ; une commande dynamique refuse `conforme` et le dit, elle n'est jamais supposée sans
effet, et une substitution de commande bornée est lue, sa valeur restant inconnue (ADR-056).

**Au 2026-10-23.** Le dépôt compte **dix-neuf `receipt.json`** et **cinq cas gelés** (le jouet, la promesse
mémoire, `plan-simple`, `spike-annees` et `task-config-manquante`) : **14 `non concluant`, 3 `conforme`,
2 `ecart`**.
`plan-simple` a rendu un `conforme` avec une vraie pause (question, réponse figée, écriture), et le cas
jouet un `ecart` dont la différence repose sur des appels que le reçu ne mesure pas. `fin` et `rapport`
écrivent désormais un [`RESULTAT.md`](docs/device/runs/2026-10-22-070952-27fb38ab-3f0cf9d/RESULTAT.md) à
côté du rapport technique : huit sections, un tableau geste par geste, trois états (tenu, violé, non
observé), et une lecture déclarée par le cas ([ADR-061](docs/DECISIONS.md)) ; une lecture mal formée est
refusée avant toute écriture. Le banc passe à **268/268**, et le contrôle de liens ne rend **aucun mort** ; `tracer` attache désormais la trace d'un run guidé ([ADR-076](docs/DECISIONS.md)),
`ouvrir` refuse une session arrêtée sans question ([ADR-077](docs/DECISIONS.md)) et la pause porte son
intervalle ([ADR-078](docs/DECISIONS.md)). Le quatrième cas, `spike-annees` (skill `aidd-pm/05-spike`, gel `0052c168`, 11
références), a sa porte passée (`ae54c1a3`, 748 octets) et **aucune session ouverte** : le prochain geste
est de le jouer.
