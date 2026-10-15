---
name: Journal de réflexion du dispositif, première session
description: Ce que cette session a cherché, mesuré, jeté, et ce qui reste ouvert avant d'écrire quoi que ce soit du dispositif
type: brainstorm
status: in-progress
---

# Journal de réflexion — le dispositif, première session (2026-10-14)

> Accompagne `MEGA-PROMPT-TEST-AIDD-v6.md`, comme le journal de la campagne précédente accompagne
> `MEGA-PROMPT-TEST-AIDD-v5.md`. Ce journal **n'est pas** le prompt : c'est ce qu'on a cherché, ce
> qu'on a mesuré, ce qu'on a jeté, et ce qui reste ouvert.
>
> Convention, reprise de celui de v5 : tout chiffre porte **la commande qui l'a produit**. `CONNU`
> est un fait lu ou établi par une commande, `VÉRIFIÉ` une mesure prise par cette session (dépôt
> jetable, crochet réel, navigateur), `SUPPOSÉ` ce qui vient d'ailleurs et n'a pas été reproduit,
> `OUVERT` ce qui n'a pas de réponse. **Les mesures fausses sont gardées, avec leur réfutation** —
> elles sont la partie la plus utile d'un journal.
>
> Toutes les mesures ci-dessous ont été prises le **2026-10-14**, entre 17 h et 19 h, depuis
> `/home/giak/projects/aidd-device` et `/home/giak/projects/framework`.

---

## 1. Ce que cette session a produit, et ce qu'elle n'a pas produit

C'est la première chose à lire, et elle est désagréable.

```text
CONNU   aucun artefact du §10 du méga-prompt n'existe —
 `git -C /home/giak/projects/aidd-device ls-files` => AGENTS.md, README.md,
   .githooks/pre-commit, scripts/docs-index.mjs, docs/{index,dashboard,trace}.md,
   docs/brainstorm/MEGA-PROMPT-TEST-AIDD-v6.md,
   docs/tasks/2026_10/2026_10_14_orchestrateur-documentaire/{spec,plan,run}.md
 → pas de DEVICE.md, pas de BOUNDARY.md, pas de CASES/, pas de runs/, pas de NEGATIVE.md,
   pas de REFUSED.md, pas de LIMITS.md.
CONNU   ce qui a été construit à la place : un outillage documentaire.
 4 commits en tout, dont 3 dans cette session —
 `git -C /home/giak/projects/aidd-device log --oneline`
   e09f0d9 Initial commit                    (README.md, 1 ligne)
   9d3ee04 Faire entrer les documents sous le contrôle de git   (10 fichiers, 1457 insertions)
   d33721d Les fichiers d'état ne se datent plus eux-mêmes      (6 fichiers, 152 / 40)
   359cfa5 Rattraper les dates que le commit précédent a déplacées (2 fichiers, 8 / 8)
```

**Le learn de la session, et il vaut d'être dit franchement** : le besoin était de construire un
dispositif, et la session a construit une **chaîne documentaire**. Ce n'est pas la même chose. Le
dispositif a besoin de documents (ses attendus, ses écarts, ses limites), et cette chaîne sert ces
documents — mais aucun des livrables du §10 n'en est sorti. Si la session devait être jugée sur le
§10, elle n'a rien livré.

```text
OUVERT  la chaîne documentaire est-elle un moyen du dispositif, ou un projet à part ? Elle a coûté
        la session entière. La garder suppose d'assumer ce coût ; la retirer suppose de dire où
        vivent les documents du dispositif.
```

---

## 2. Le point de départ, vérifié

Rien ici n'est recopié : tout est relu au moment d'écrire.

```text
CONNU   la modification candidate est la branche `feat/protocole-de-test-aidd`, un commit d'écart —
 `git -C /home/giak/projects/framework diff --stat main...HEAD`
   aidd_docs/MEGA-PROMPT-TEST-AIDD-journal.md | 790 ++++++++++++++++++++++
   aidd_docs/MEGA-PROMPT-TEST-AIDD-v5.md      | 445 ++++++++++++++++
   2 files changed, 1235 insertions(+)
 → la modification sous test est du TEXTE, pas du code : un prompt et son journal.
CONNU   le méga-prompt v6 n'est pas suivi par le framework, il vit chez le dispositif —
 `git -C /home/giak/projects/framework ls-files --error-unmatch aidd_docs/MEGA-PROMPT-TEST-AIDD-v6.md`
   => error: Did you forget to 'git add'?
 `ls -1 /home/giak/projects/aidd-device/docs/brainstorm/` => MEGA-PROMPT-TEST-AIDD-v6.md
CONNU   le terrain existe, et sa mesure datée du méga-prompt est déjà périmée —
 `git -C /home/giak/projects/audio-sync-tool rev-parse --short HEAD`  => 416ec1f
 `git -C /home/giak/projects/audio-sync-tool status --porcelain | wc -l` => 1
 `git -C /home/giak/projects/audio-sync-tool ls-files | wc -l`          => 307
 → le §6 du méga-prompt annonçait 0 fichier modifié, et prévenait que « une mesure périmée reste
   une mesure à refaire ». Elle l'était.
```

`SUPPOSÉ` — et c'est mon hypothèse, pas un fait lu : la modification à prouver est celle de la
pull request en cours (v5 + journal). Le méga-prompt parle d'« une modification du framework » en
général, et `feat/protocole-de-test-aidd` est la seule candidate présente sur cette machine. Écrit
en clair ici pour que ce soit corrigé si c'est faux.

```text
OUVERT  quelle modification doit être prouvée ? Toute la suite en dépend : les attendus, le
        périmètre de `CASES/`, et ce que `ECART.md` doit nommer.
```

---

## 3. Ce que la chaîne documentaire fait, et ce qu'elle a coûté

Ce qui a été mis en place, en une phrase : trois fichiers d'état (`docs/index.md`,
`docs/dashboard.md`, `docs/trace.md`) sont **recalculés** depuis le frontmatter des documents et
depuis git par `scripts/docs-index.mjs`, sans aucune dépendance, et un crochet refuse un commit dont
l'état ne correspond plus aux documents.

```text
VÉRIFIÉ le générateur est idempotent, ligne de dérivation comprise —
 `node scripts/docs-index.mjs` deux fois de suite => « 0 fichier(s) réécrit(s) » au second passage,
   et `git diff` vide.
VÉRIFIÉ il n'écrit que trois fichiers, et seulement sous `docs/` —
 `node scripts/docs-index.mjs` dans un dossier sans `docs/` => exit 0, trois fichiers créés
   (défaut ENOENT corrigé dans la session, voir §5).
VÉRIFIÉ `--strict` ne fait échouer que le vocabulaire de statut —
 `node scripts/docs-index.mjs --strict` sur l'état courant                     => exit 0
 avec une sonde portant `status: todo` (valeur absente en amont)                => exit 1
 un document simplement non commité                                             => note, jamais une erreur
VÉRIFIÉ le crochet est appelé par git lui-même, et refuse —
 `git commit` avec une sonde neuve indexée => exit 1, « ces trois fichiers étaient périmés »
   puis « ces fichiers diffèrent de ce qui est indexé », les trois nommés.
   `git log --oneline | wc -l` inchangé après ce refus.
CONNU   la compatibilité avec le lecteur `kanban` du framework n'est pas constatable —
 `sed -n '13p' /home/giak/projects/framework/cli/src/kernel/paths.ts`
   => export const DOCS_DIR = "aidd_docs" as const;
 `head -4 /home/giak/projects/framework/kanban/package.json`
   => "name": "@ai-driven-dev/kanban-source", "private": true,
      "description": "Source folder mounted by the AIDD CLI as `aidd kanban`. Never published on its own."
 `git -C /home/giak/projects/framework ls-files kanban | head -3`
   => kanban/README.md, kanban/aidd_docs/tasks/2026_07/... (dossier source suivi, pas un paquet)
 → personne ne lit `docs/` aujourd'hui ; adopter son vocabulaire est une convention que nous
   tenons seuls (voir §4).
```

**Le coût, nommé** : cette chaîne a occupé la session. Elle a produit une spec, un plan, un run, et
un fait solide — l'état du dossier ne peut plus mentir sans que quelque chose le refuse. Elle n'a
pas produit un seul artefact du §10.

---

## 4. Mesures fausses, gardées avec leur réfutation

Trois, dont deux dans la spec de la tâche documentaire.

**Fausse mesure n° 1 — « nos documents restent lisibles par les outils du framework ».** Écrite dans
la première version de la spec pour justifier le choix de `docs/` au lieu de `aidd_docs/`. Réfutée
en lisant la source : la commande hôte qui montait `kanban` est débranchée, `kanban/` n'a ni binaire
ni point d'entrée, et le CLI cherche une constante de nom, `DOCS_DIR = "aidd_docs"`
(`cli/src/kernel/paths.ts:13`). **La compatibilité invoquée n'existe pas** ; la spec la présente
désormais comme une convention tenue par nous seuls.

**Fausse mesure n° 2 — « le repli du nom est le nom de fichier ».** `resolveTaskDocumentNameFallback`
rend le **nom du dossier parent** pour `plan.md`, `master-plan.md` et `spec.md`
(`kanban/src/domain/models/task-name-fallback.ts`, `task-group.ts:10-12`), le nom de fichier sinon.
Sans effet sur nos documents, qui portent tous un `name`. Spec corrigée.

**Fausse mesure n° 3, la plus instructive — « la dérive s'arrête ».** Après le premier commit des
fichiers d'état, une régénération les réécrivait. Éprouvé dans un dépôt jetable à **trois commits
dans la même seconde** : le générateur annonçait `0 fichier(s) réécrit(s)`, et j'ai failli conclure
que ça convergeait. C'était faux : les dates se confondent à la seconde près.

```text
VÉRIFIÉ la dérive est sans fin, commits espacés de deux secondes —
 mêmes essais avec `sleep 2` entre chaque commit : après CHAQUE commit, la régénération réécrit
 `index.md` et `trace.md`. Index au commit `00510dd` : date affichée 18:14:58, date réelle 18:15:00.
CONNU   la cause : ces deux fichiers affichaient la date de leur PROPRE dernier commit. Le commit
 qui les enregistre devient cette date, donc ils sont périmés au sortir de chaque commit, et un
 crochet qui refuse sur « la régénération a réécrit un fichier » refuse alors chaque commit.
CONNU   corrigé à la cause : les trois fichiers générés portent la date de leur premier commit, seul
 repère qu'un commit suivant ne déplace pas ; les documents écrits gardent celle de leur dernier.
VÉRIFIÉ convergence remesurée, crochet armé, codes de sortie capturés —
 B2 après le commit qui fait entrer les trois fichiers => 2 réécritures (unknown → premier commit)
 B3 après ce rattrapage                              => 0 réécriture, arbre propre
 B4 commit sans rapport (README.md)                  => 0 réécriture, arbre propre
 B5 un document change, crochet armé, sans régénérer => commit accepté (exit 0)
 B6 régénération à froid                             => 2 réécritures : le retard d'un commit
 B7 rattrapage committé                              => 0 réécriture, arbre propre
 B8 spec.md : git 18:17:57, index 18:17:57           => accord
VÉRIFIÉ le même accord tient dans le dépôt du dispositif après `359cfa5` — git 18:19:20 des deux
 côtés pour `spec.md`, `plan.md` et `run.md`.
```

**La leçon gardée** : mon premier protocole de mesure ne pouvait pas distinguer « ça converge » de
« les horodatages se confondent ». Le défaut était réel, la mesure était fausse. Un essai dont
l'intervalle de temps est plus court que la résolution de la mesure ne mesure rien.

---

## 5. Défauts trouvés en exécutant, jamais en relisant

Cinq, tous corrigés à la cause. Ils sont consignés ici parce qu'ils disent ce que cette classe
d'outil rate quand on la relit au lieu de la lancer.

1. **`--strict` sortait en 1 sur quatre documents simplement non commités** : deux conditions très
   différentes — vocabulaire invalide, fichier non commité — étaient confondues. Un portier qui
   échoue à chaque document neuf ne sert à rien. Séparées : erreurs et notes.
2. **Sans dossier `docs/`, le générateur plantait en `ENOENT` avec une pile d'appels** (mesuré dans
   un dossier jetable). Il crée désormais le dossier : exit 0, trois fichiers, idempotent.
3. **Une règle `* { transition-duration: … }` multiplie par douze la mise en page des figures** —
   hauteur mesurée : 540 unités sans la règle, 6 416 avec. C'est la forme habituelle du respect de
   `prefers-reduced-motion`, et elle casse les schémas Mermaid. Isolée par bissection des 97 règles
   du CSS, puis réduite à `* { transition-duration: 0.01ms !important }`. Corrigée en portée.
4. **Le recadrage d'une figure calculait sur la hauteur de repli de sa zone de dessin** : `height:
   100%` manquait sur `.mermaid-viewport`, qui retombait donc sur son `min-height: 280px` du CSS —
   228 px utiles une fois le rembourrage déduit — alors que le cadre faisait 701 px de haut. Mesuré
   avant correction : étiquette « 160 % — largeur », figure rendue 398 × 1066 dans ce cadre, donc
   coupée. Après : 97 % puis 77 %, sans débordement.
5. **Forcer une police sur les libellés Mermaid les rogne** (« écrit 3 fichi ») : Mermaid réserve la
   place en mesurant avec la police du thème. Dérogations retirées ; vérifié en comparant largeur
   réservée et largeur du contenu, 96 = 96 et 126 = 126, zéro libellé rogné.

```text
VÉRIFIÉ les figures de la page, mesurées dans le navigateur (DOM et console) —
 figure 1, hauteur du viewBox : 539,5 unités sans la règle universelle, 6 416 avec ; coupable isolée
   par bissection des 97 règles du CSS, puis réduite à `* { transition-duration: 0.01ms !important }`
 recadrage : « 160 % — largeur » avant correction, « 97 % — contain » et « 77 % — contain » après
 libellés : largeur réservée = largeur du contenu (96 = 96, 126 = 126), 0 rogné sur les deux figures
 page : aucun débordement horizontal, aucune ligne de console
VÉRIFIÉ les deux premiers défauts, par leur code de sortie —
 `node scripts/docs-index.mjs --strict` : exit 0 sur l'état courant, exit 1 avec une sonde `status: todo`
 générateur lancé dans un dossier sans `docs/` : exit 0, trois fichiers, idempotent au second passage
VÉRIFIÉ le garde-fou « CDN injoignable » a été éprouvé, pas supposé —
 page servie avec l'URL du CDN remplacée par une adresse inexistante : au bout de 6 s les deux
 figures affichent « Mermaid injoignable », la page garde 10 100 caractères de texte, le sommaire
 et le tableau de 8 lignes restent en place ; une seule ligne console, ERR_NAME_NOT_RESOLVED.
```

---

## 6. La précondition du runner : ce que la campagne précédente avait mesuré

C'est le point qui décide entre état A et état B, et il n'est pas neuf — il est déjà écrit dans le
journal de v5, §6ter. Je le reprends tel quel, et je ne l'ai **pas** reproduit.

```text
SUPPOSÉ (journal v5, §6ter, mesuré le 2026-10-14, non reproduit par cette session)
 `claude -p "PONG"`                              => 1 939 ms | « Not logged in · Please run /login »
 `opencode run --standalone --auto "PONG"`        => 1 596 ms | modèle introuvable
 `opencode ... --model groq/openai/gpt-oss-120b`  => 35 748 ms | « TPM: Limit 8000, Requested 9168 »
 → aucun runner headless ne répond sur cette machine, même gratuit.
VÉRIFIÉ les binaires, eux, sont là — `command -v` pour chacun :
 claude=/home/giak/.local/bin/claude  opencode=/home/giak/.opencode/bin/opencode
 ollama=/usr/local/bin/ollama ; absents : codex, gemini, aider, llm, sgpt, crush
VÉRIFIÉ aucune variable de clé d'API n'est posée (ANTHROPIC, OPENAI, GEMINI, GROQ, OPENROUTER,
 MISTRAL : toutes absentes) — ce qui ne dit rien d'un CLI authentifié par sa propre session.
CONNU   le harnais du framework appelle le runner en mode sans interaction —
 `scripts/skill-eval.mjs:37-45` : spawn("claude", ["-p", prompt, "--model", MODEL,
 "--setting-sources", "project,local", "--add-dir", cwd, "--dangerously-skip-permissions"]),
 timeout 600 000 ms ; et D8 du journal v5 : DEUX formes d'appel pour DEUX binaires, choisis par
 le NOM du binaire.
CONNU   la réponse de la campagne précédente, décidée par le demandeur — c'est l'opérateur qui
 ouvre ses sessions, et l'indépendance des rôles ne dépend d'aucune capacité de spawn.
```

**Ce que j'en conclus, et qui touche le méga-prompt v6** : le §7 de v6 demande de *constater* le
runner et de rendre `ATTEMPT.md` quand il n'y en a pas. Le constat a été fait la veille, et la
conclusion retenue n'est pas « pas de runner » mais « le runner, c'est la session de l'opérateur ».
Les deux textes ne disent pas la même chose.

```text
OUVERT  v6 demande un constat de runner ; v5 a déjà tranché que le runner est une session
        d'opérateur. Laquelle des deux lectures gouverne le dispositif ? Une invocation réelle de
        `claude -p` ou d'`opencode run` le dirait en une commande, et je ne l'ai pas lancée parce
        qu'elle peut consommer du crédit ou rester bloquée sans réponse.
```

---

## 7. Où sont les traces, et laquelle manquait

Question posée par le demandeur en fin de session : « rien n'est tracé, logué ? ». Réponse mesurée,
et elle distingue deux choses qu'il ne faut pas confondre.

```text
VÉRIFIÉ ce qui est logué, oui, au sens technique —
 `~/.config/freebuff-desktop/projects/framework-445d76bb-…/desktop-v2.db` (17 Mo, écrit à 18:45)
   contient la phrase de commit de cette session 5 fois et « circuit-documentaire » 15 fois ;
   l'autre base du même projet (150 Mo, arrêtée à 15:49) n'en contient rien.
 `~/.claude/projects/-home-giak-projects-framework/*.jsonl` (36 655 octets, 16:52) : une session
   d'avant la nôtre.
 `~/.config/Typora/draftsRecover/2026-10-14 MEGA-PROMPT-TEST-AIDD-v6 17*.md` : vos versions de
   travail du prompt, 16:58–17:03.
CONNU   ce qui n'existait pas : l'artefact. Un log local, hors de tout dépôt, ne se relit pas —
 il consigne les détours comme les mesures, sans la discipline de ce journal.
CONNU   le motif venait d'ailleurs : v5 a son journal (790 lignes, commit `fe48de12a`), v6 n'en
 avait pas. C'est ce fichier-ci.
```

---

## 8. Décisions, et de qui

**Du demandeur, pendant la session** : les trois fichiers d'état sont **générés** ; la chaîne
documentaire par tâche est le sous-ensemble `brainstorm` / `spec` / `plan` / `phase-N` / `run` /
`ecart` ; une spec a **une seule maison**, la tâche — `docs/specs/` n'existe pas.

**Miennes, à corriger si elles déplaisent** : `docs/` plutôt qu'`aidd_docs/` ; la prose en français
et le code en anglais ; le générateur sans aucune dépendance ; `scripts/docs-index.mjs` ; les dates
lues dans git et jamais déclarées ; l'idempotence, ligne de dérivation comprise ; les fichiers
générés exclus des comptes du tableau de bord ; un statut hors vocabulaire signalé sans faire
échouer, `--strict` pour l'inverse ; la date d'un fichier généré est celle de son **premier** commit.

**Non décidée, et je ne l'ai pas décidée seul** : la forme du dispositif. Aucune interface
(`framework@ref`, `terrain@ref`, commande de runner, format du fichier d'attendu) n'est arrêtée.

---

## 9. Ce qui reste ouvert, et qui commande la suite

```text
OUVERT  la modification à prouver : la pull request en cours, ou autre chose (§2).
OUVERT  l'interface du dispositif : révisions du framework et du terrain, commande de runner,
        format des attendus. Le journal v5 laissait déjà ces quatre points ouverts ; la session
        n'en a tranché aucun.
OUVERT  les deux rôles : qui écrit l'attendu sans voir le produit, et qui juge. Le v5 a retenu
        trois sessions ouvertes par l'opérateur ; v6 en fait une question ouverte (§11, question 4).
OUVERT  la frontière du testable : quels attendus sont écartés, et par quel critère. C'est la
        question 5 du §11, et c'est celle qui n'a aucune réponse écrite nulle part.
OUVERT  le sort de la chaîne documentaire : moyen du dispositif, ou projet à part (§1).
OUVERT  les traces de campagnes antérieures dans le voisinage (`audio-sync-tool-aidd`,
        `audio-sync-tool-placebo`, `test-dsl`, `framework-aidd-temp` — listées par le journal v5,
        §11) : lues, réutilisées, ou déclarées obsolètes. Aucune n'est triée.
OUVERT  la trace des SESSIONS, et pas seulement des documents. Mesuré ici : le générateur ne lit
        que `git log` et les `.md` de `docs/` (`scripts/docs-index.mjs:122,136,267`), le crochet ne
        surveille que trois chemins (`.githooks/pre-commit:24`), et ni le code, ni le crochet, ni la
        spec ne connaissent les mots session, fil ou transcription — la seule occurrence est une
        phrase citée dans la prose de la spec. Le pont entre le log de l'application et les
        documents versionnés est donc MANUEL : une session qui n'écrit rien ne laisse rien de
        relisible, et c'est exactement ce qui s'est passé ici avant que le demandeur ne pose la
        question. Le framework, lui, a une machinerie de session (`aidd telemetry report`,
        `.aidd/manifest.json`) dont v5 a nommé deux défauts : un inconnu rapporté comme un zéro, et
        un enregistrement antérieur à son journal. Faut-il capturer les sessions du dispositif, ou
        un artefact écrit suffit-il ?
```

---

## 10. Chronologie, limitée à ce qui est horodaté

Les étapes antérieures — générateur, squelette `docs/`, crochet — n'ont **aucun horodatage
vérifiable** dans le dépôt : elles précèdent le premier commit des documents, et je ne les
date pas de mémoire.

```text
CONNU (dates de commit, `git log --format='%h %cI %s'`)
17:23:14  e09f0d9 Initial commit — README.md seul : c'est le point de départ, pas notre travail
18:14:10  9d3ee04 AGENTS.md, le générateur, le crochet et docs/ entrent sous git
18:19:20  d33721d le correctif d'auto-référence
18:19:27  359cfa5 le rattrapage des dates
CONNU (ligne de dérivation des fichiers générés)
18:15:35  premier passage APRÈS le commit : c'est l'instant où la dérive se voit, index.md et
          trace.md réécrits alors que rien n'avait changé côté documents
18:19:20  embarquée dans `359cfa5:docs/trace.md`, l. 8 : la date du commit précédent, pas la sienne
CONNU (mtime du fichier)
18:22–18:34  page d'explication visuelle : créée, puis ses trois défauts corrigés
```
