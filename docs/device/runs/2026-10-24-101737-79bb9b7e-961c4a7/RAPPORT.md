---
name: Rapport utilisateur — 2026-10-24-055310-shadow-areas-design
description: non concluant ; morsure(s) : ecriture_hors_dossier, code_hors_dossier, shell_hors_dossier, hors_produit ; 24 limite(s)
type: run-report
status: done
---

# Rapport utilisateur — 2026-10-24-055310-shadow-areas-design

> Vue déterministe du reçu `receipt.json` et de la trace `trace/echange.jsonl`. Reçu écrit le 2026-10-24T10:24:16+02:00. Ce rapport ne remplace ni le reçu ni l'output.

## 1. La réponse

Le reçu conclut `non concluant` ; morsures : `ecriture_hors_dossier`, `code_hors_dossier`, `shell_hors_dossier`, `hors_produit` ; limites : 24 (voir §5).

Un non concluant n'est pas une défaillance du dispositif : il dit ce que la preuve ne permet pas de conclure.

La promesse du cas n'est pas mesurée mécaniquement : elle relève d'un juge, et aucun juge n'est nommé dans l'output.

> « Le skill 03-shadow-areas a écrit son rapport d'ombres à côté de la source intacte, mais a laissé cinq scripts d'aide à la racine du terrain et lu hors du cadre : le run ne peut pas attester la promesse. » — `output.json`

## 2. Ce qui a été testé

| | |
| --- | --- |
| Cas | `2026-10-24-055310-shadow-areas-design` |
| Session | opencode ; modèle `openrouter/cohere/north-mini-code:free` ; fil `ses_e930348d8ffeYHzzvlUz1CcNSF` ; ouverte par Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-24 le 2026-10-24T10:17:43+02:00 |
| Budget | 1/1 échange(s), épuisé au seq 1 |
| Tableau | absent |
| Attendu vu | déclaré non ; mesure non |
| Produit | 1 fichier(s) : `raw/2026-10-24-055310-shadow-areas-design/2026-08-01-carte-visite-v2-design-shadow-report.md` (2026-08-01-carte-visite-v2-design-shadow-report.md 1942 o) |
| Révisions | framework `fe48de12` ; terrain `6a74c46` |
| Durée | de 2026-10-24T10:17:44+02:00 à 2026-10-24T10:21:37+02:00 (premier et dernier message de la trace) |
| Fenêtre du reçu | déclarée de 2026-10-24T10:17:44+02:00 à 2026-10-24T10:21:51+02:00 |
| Trace | 95 ligne(s) lue(s) ; outils : read 20, shell 20, write 5, execute 3, skill 1 |

## 3. Ce que le reçu établit

- le gel a été re-haché : empreinte `79bb9b7e47e7964b5d8e3f4f3b58bdacc11babd8985815336ccb77a7ad9d1582`, 2 fichier(s), 1 référence(s) (`gel_verifie`).
- la porte est citée : `5c6aedf14d66679568817b4e188a06551b8e660e3ce63b1a89a1ca960b4816a8`, cas `2026-10-24-055310-shadow-areas-design`, gel `79bb9b7e47e7964b5d8e3f4f3b58bdacc11babd8985815336ccb77a7ad9d1582` (`porte`).
- la trace a été lue et rejouée : 95 ligne(s), dont 95 dans la fenêtre du run, sha256 `33522fc647af9fb3ddd32c203eccfbae56b4b117eec25ff482bb807bcbf1614c` (`trace_lue`), `2026-10-24T10:24:16+02:00` (`trace_verifiee`).
- la copie sous `raw/` a été re-hachée : 1 fichier(s), manifeste `dd1e3b2d9081f42b2ad4803781ea09cf4bc1b5a2281305b8b878aa02e2aae3d1` (`produit.verifie`).
- le budget a été compté : 1/1 échange(s) (`echanges`).
- la conduite est déclarée par un agent (Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-24), non vérifiée (`conduite`).
- la forme du tableau a été lue : aucun tableau (`tableau`).
- la promesse du cas est `juge_seul` : la promesse est énoncée, mais aucune mesure ne l'éprouve : `compare` doit nommer le juge et sa rubrique (`promesse`).

## 4. Ce qu'il n'établit pas

- la qualité du skill, la justesse du produit et la reproductibilité ;
- la conduite (agent ou humain), qui est déclarée par l'opérateur et jamais vérifiée ;
- l'identité du juge, sa rubrique et la fidélité de sa lecture ;
- le contenu d'une commande `shell` construite dynamiquement, que le reçu ne sait pas lire (ADR-051) ;
- les limites du reçu, détaillées au §5.

Ce que l'output écarte comme non testable :

- le contenu du produit est juste : le contenu ne se juge pas ici : le cas mesure le nom, l'emplacement, la forme classée et l'invariant de la source, jamais la pertinence des écarts trouvés
- le rapport couvre toutes les ombres réelles de la spec : aucune mesure d'exhaustivité n'existe : un rapport court et bien formé passe, un rapport long et bien formé aussi

## 5. Les morsures et les limites

| Clé | Ce que la morsure dit |
| --- | --- |
| ecriture_hors_dossier | une écriture d'outil est sortie du cadre déclaré ; valeur : {"seq":22,"index":46,"ts":1792829973873,"outil":"write","chemin":"/home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/terrain/analyze.py"}, {"seq":27,"index":56,"ts":1792829998087,"outil":"write","chemin":"/home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/terrain/analyze_fixed.py"}, {"seq":32,"index":66,"ts":1792830020574,"outil":"write","chemin":"/home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/terrain/analyze_final.py"}, {"seq":36,"index":74,"ts":1792830043383,"outil":"write","chemin":"/home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/terrain/run_shadow_analysis.py"}, {"seq":41,"index":84,"ts":1792830076914,"outil":"write","chemin":"/home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/terrain/create_report.py"} |
| code_hors_dossier | un chemin nommé dans le code d'un outil est sorti du cadre déclaré ; valeur : {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/assume/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/obviously/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/pre-agreed/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/implicit/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/ambigu/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/boundary/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/exceptional/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/zero-byte/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/person/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/system/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/role/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/entity/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/responsible/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/workflow/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/fail/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/timeout/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/declined/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/error/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/exception/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/criterion/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/verifiable/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/objective/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/pass/fail"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/external/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/service/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/library/i"}, {"seq":18,"ts":1792829899201,"outil":"execute","chemin":"/dataset/i"} |
| shell_hors_dossier | une commande shell lit hors du cadre déclaré ; valeur : {"seq":24,"index":50,"ts":1792829989794,"outil":"shell","commande":"cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -name \"locked-sets.json\" -type f","chemin":"/home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/locked-sets.json"}, {"seq":24,"index":50,"ts":1792829989794,"outil":"shell","commande":"cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -name \"locked-sets.json\" -type f","chemin":"/home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/f"}, {"seq":29,"index":60,"ts":1792830016106,"outil":"shell","commande":"cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -name \"locked-sets.json\" -type f \| head -5","chemin":"/home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/locked-sets.json"}, {"seq":29,"index":60,"ts":1792830016106,"outil":"shell","commande":"cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -name \"locked-sets.json\" -type f \| head -5","chemin":"/home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/f"}, {"seq":30,"index":62,"ts":1792830017627,"outil":"shell","commande":"cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -name \"locked-sets.json\" 2>/dev/null \| grep -v \".git\" \| head -3","chemin":"/home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/locked-sets.json"}, {"seq":30,"index":62,"ts":1792830017627,"outil":"shell","commande":"cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -name \"locked-sets.json\" 2>/dev/null \| grep -v \".git\" \| head -3","chemin":"/home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/.git"}, {"seq":31,"index":64,"ts":1792830019423,"outil":"shell","commande":"cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && ls -la ./origine/framework/plugins/aidd-refine/skills/03-shadow-areas/references/","chemin":"/home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/origine/framework/plugins/aidd-refine/skills/03-shadow-areas/references"}, {"seq":34,"index":70,"ts":1792830038137,"outil":"shell","commande":"cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -type f -name \"locked-sets.json\" \| grep -v \"__pycache__\" \| grep -v \".git\" \| head -3","chemin":"/home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/f"}, {"seq":34,"index":70,"ts":1792830038137,"outil":"shell","commande":"cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -type f -name \"locked-sets.json\" \| grep -v \"__pycache__\" \| grep -v \".git\" \| head -3","chemin":"/home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/locked-sets.json"}, {"seq":34,"index":70,"ts":1792830038137,"outil":"shell","commande":"cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -type f -name \"locked-sets.json\" \| grep -v \"__pycache__\" \| grep -v \".git\" \| head -3","chemin":"/home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/__pycache__"}, {"seq":34,"index":70,"ts":1792830038137,"outil":"shell","commande":"cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -type f -name \"locked-sets.json\" \| grep -v \"__pycache__\" \| grep -v \".git\" \| head -3","chemin":"/home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/.git"} |
| hors_produit | un fichier a été écrit hors du produit ; valeur : {"chemin":"terrain/analyze.py","nature":"produit"}, {"chemin":"terrain/analyze_final.py","nature":"produit"}, {"chemin":"terrain/analyze_fixed.py","nature":"produit"}, {"chemin":"terrain/create_report.py","nature":"produit"}, {"chemin":"terrain/run_shadow_analysis.py","nature":"produit"} |

**Limites**

- la conduite (agent) est déclarée par « Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-24 » : le reçu ne prouve pas qui a répondu, et un run conduit par un agent n'est ni une faute ni un mérite (ADR-071)
- le cas limite l'écriture à terrain/docs/superpowers/specs et à son scratch terrain/.scratch ; ce reçu compare les chemins nommés par les outils d'écriture, les cibles littérales des commandes shell et les chemins nouveaux du porcelain, pas les effets d'un binaire opaque (cloisonnement.ecriture, ADR-063)
- les chemins absolus nommés dans le code de execute sont lus dans l'export brut (27 chemin(s)) ; un chemin construit dynamiquement, relatif ou hors d'un littéral n'est pas mesuré, et le reçu ne distingue pas une lecture d'une écriture (ADR-088)
- le scratch terrain/.scratch est lisible et scriptible, jamais compté comme produit ; il est collecté sous annexe/<cas>/ et le reçu le vérifie (ADR-067)
- le cas déclare un scratch, mais le run n'a aucune annexe collectée : les scripts et les sorties qu'il cite ne sont pas dans le reçu (ADR-067)
- le cas ne demande pas de tableau : l'ordre écriture/tableau n'est pas mesuré (ADR-068)
- le cas interdit le réseau ; les clients déclarés sont curl, wget, nc, ssh, git fetch/push/clone, npm install et pip install — un client non listé n'est pas mesuré (cloisonnement.reseau)
- le cas interdit les fichiers de contexte ; le reçu ne reconnaît que les noms déclarés — AGENTS.md, CLAUDE.md, .github/copilot-instructions.md (cloisonnement.fichiers_de_contexte)
- la promesse du cas n'est pas mesurée mécaniquement : elle relève d'un juge, que `compare` doit nommer avec sa rubrique pour `conforme` — le reçu ne vérifie ni l'identité du juge ni sa lecture (audit du 2026-10-24, D2, D3)
- la pause est mesurée comme un tour `user` entre l'ouverture et la première écriture nommée : sa durée est l'intervalle entre la part précédente et ce tour, jamais une attente humaine, un accord donné sans tour n'est pas vu, et une écriture faite par une commande shell ne la clôt pas (ADR-069, ADR-078)
- les commandes shell sont lues quand leur texte est littéral (shell) ; une commande construite dynamiquement n'est pas interprétée, et le reçu le dit
- le répertoire initial d'une commande shell est le `travail` du gel ; le reçu suit le texte, donc un `cd` qui aurait échoué ne déplace pas la lecture (ADR-051)
- `/dev/null` est un puits : il n'est ni une lecture ni une écriture, les autres fichiers de périphérique restent comptés (ADR-053)
- le produit est comparé par sha256 aux fichiers lus hors du produit, relus au reçu ; un fichier lu puis modifié ou supprimé ne peut plus être reconnu (ADR-054)
- hors_produit ne retient que les chemins nouveaux du porcelain : une modification ou une suppression d'un fichier déjà présent hors du produit n'est pas attribuée au run (ADR-051)
- la porte et le gel replient un dossier non suivi en une seule entrée du porcelain ; le reçu étend seulement son propre côté après-run (`--untracked-files=all`), saute un chemin sous un dossier déjà non suivi avant le run et un ancêtre de la racine du produit, et compare les entrées comme des chaînes, sans décoder les guillemets de git (ADR-062)
- une écriture d'outil sort du cadre déclaré : seq 22, outil « write », chemin /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/terrain/analyze.py (demande §7)
- un chemin hors du cadre est nommé dans le code d'un outil : seq 18, outil « execute », chemin /assume/i — le reçu ne distingue pas lecture et écriture (demande §7, F5)
- une commande shell sort du cadre déclaré : seq 24, outil « shell », chemin /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/locked-sets.json (demande §7)
- un fichier hors du produit a été écrit : terrain/analyze.py (§4)
- un fichier hors du produit a été écrit : terrain/analyze_final.py (§4)
- un fichier hors du produit a été écrit : terrain/analyze_fixed.py (§4)
- un fichier hors du produit a été écrit : terrain/create_report.py (§4)
- un fichier hors du produit a été écrit : terrain/run_shadow_analysis.py (§4)

## 6. Les effets hors cadre

### 6.1 Les lectures hors dossier

Le reçu ne nomme aucune lecture hors dossier.

### 6.2 Les écritures d'outil hors dossier

| seq | outil | chemin |
| --- | --- | --- |
| 22 | write | /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/terrain/analyze.py |
| 27 | write | /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/terrain/analyze_fixed.py |
| 32 | write | /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/terrain/analyze_final.py |
| 36 | write | /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/terrain/run_shadow_analysis.py |
| 41 | write | /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/terrain/create_report.py |

Ces entrées interdisent `conforme` (`ecriture_hors_dossier`).

### 6.3 Les lectures par une commande shell

| seq | commande | chemin |
| --- | --- | --- |
| 24 | cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -name "locked-sets.json" -type f | /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/locked-sets.json |
| 24 | cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -name "locked-sets.json" -type f | /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/f |
| 29 | cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -name "locked-sets.json" -type f \| head -5 | /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/locked-sets.json |
| 29 | cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -name "locked-sets.json" -type f \| head -5 | /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/f |
| 30 | cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -name "locked-sets.json" 2>/dev/null \| grep -v ".git" \| head -3 | /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/locked-sets.json |
| 30 | cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -name "locked-sets.json" 2>/dev/null \| grep -v ".git" \| head -3 | /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/.git |
| 31 | cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && ls -la ./origine/framework/plugins/aidd-refine/skills/03-shadow-areas/references/ | /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/origine/framework/plugins/aidd-refine/skills/03-shadow-areas/references |
| 34 | cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -type f -name "locked-sets.json" \| grep -v "__pycache__" \| grep -v ".git" \| head -3 | /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/f |
| 34 | cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -type f -name "locked-sets.json" \| grep -v "__pycache__" \| grep -v ".git" \| head -3 | /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/locked-sets.json |
| 34 | cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -type f -name "locked-sets.json" \| grep -v "__pycache__" \| grep -v ".git" \| head -3 | /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/__pycache__ |
| 34 | cd /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design && find . -type f -name "locked-sets.json" \| grep -v "__pycache__" \| grep -v ".git" \| head -3 | /home/giak/aidd-device-work-rejeu/2026-10-24-055310-shadow-areas-design/.git |

Ces entrées interdisent `conforme` (`shell_hors_dossier`).

### 6.4 Les écritures shell hors du produit

Le reçu ne nomme aucune écriture shell hors du produit.

### 6.5 Les appels réseau

Le reçu ne nomme aucun appel réseau interdit.

### 6.6 Les fichiers hors du produit

| chemin | nature |
| --- | --- |
| terrain/analyze.py | produit |
| terrain/analyze_final.py | produit |
| terrain/analyze_fixed.py | produit |
| terrain/create_report.py | produit |
| terrain/run_shadow_analysis.py | produit |

Ces entrées interdisent `conforme` (`hors_produit`).

### 6.7 Les commandes shell mal formées

Le reçu ne nomme aucune commande shell mal formée.

### 6.8 Les commandes shell non interprétées

Le reçu ne nomme aucune commande shell non interprétable.

### 6.9 Les chemins nommés dans le code des outils

| seq | outil | chemin |
| --- | --- | --- |
| 18 | execute | /assume/i |
| 18 | execute | /obviously/i |
| 18 | execute | /pre-agreed/i |
| 18 | execute | /implicit/i |
| 18 | execute | /ambigu/i |
| 18 | execute | /boundary/i |
| 18 | execute | /exceptional/i |
| 18 | execute | /zero-byte/i |
| 18 | execute | /person/i |
| 18 | execute | /system/i |
| 18 | execute | /role/i |
| 18 | execute | /entity/i |
| 18 | execute | /responsible/i |
| 18 | execute | /workflow/i |
| 18 | execute | /fail/i |
| 18 | execute | /timeout/i |
| 18 | execute | /declined/i |
| 18 | execute | /error/i |
| 18 | execute | /exception/i |
| 18 | execute | /criterion/i |
| 18 | execute | /verifiable/i |
| 18 | execute | /objective/i |
| 18 | execute | /pass/fail |
| 18 | execute | /external/i |
| 18 | execute | /service/i |
| 18 | execute | /library/i |
| 18 | execute | /dataset/i |

Ces entrées interdisent `conforme` (`code_hors_dossier`).

## 7. Les pistes

- Vérifier ce que la session a écrit avec un outil d'écriture hors du dossier autorisé, corriger le chemin, puis rejouer.
- Relire le code exécuté par la session : un chemin absolu y sort du dossier autorisé, et le programme doit rester dans le répertoire de travail.
- Rejouer dans un bac propre, sans accès aux autres cas, et vérifier les commandes shell de la trace avant de conclure.
- Classer les fichiers nouveaux hors du produit (contexte, artefact du client, produit) et corriger ce que la session a écrit, puis rejouer.
- Relire la limite « la conduite (agent) est déclarée par « Buffy, agent de l'opérateur giak, sur sa consigne du 2026-10-24 » : le reçu ne prouve pas qui a répondu, et un run conduit par un agent n'est ni une faute ni un mérite (ADR-071) » et corriger la pièce qu'elle nomme.
- Relire la limite « le cas déclare un scratch, mais le run n'a aucune annexe collectée : les scripts et les sorties qu'il cite ne sont pas dans le reçu (ADR-067) » et corriger la pièce qu'elle nomme.

## 8. Où lire les preuves

| Pièce | Lien |
| --- | --- |
| receipt.json | [receipt.json](receipt.json) |
| output.json | [output.json](output.json) |
| trace/echange.jsonl | [trace/echange.jsonl](trace/echange.jsonl) |
| gate.json | [gate.json](gate.json) |
| faits.json | [faits.json](faits.json) |
| raw/2026-10-24-055310-shadow-areas-design/2026-08-01-carte-visite-v2-design-shadow-report.md | [raw/2026-10-24-055310-shadow-areas-design/2026-08-01-carte-visite-v2-design-shadow-report.md](raw/2026-10-24-055310-shadow-areas-design/2026-08-01-carte-visite-v2-design-shadow-report.md) |

## 9. Ce que ce rapport ne prouve pas

Ce rapport est une vue des pièces du run, pas un nouveau run. Il ne juge ni le contenu ni la qualité du produit, ne remplace pas la lecture humaine, et ne mesure pas ce que le reçu ne mesure pas. Les absences et les limites sont dites dans les sections précédentes ; elles ne sont pas comblées par ce document.
