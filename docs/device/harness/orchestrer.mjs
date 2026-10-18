#!/usr/bin/env node
// L'orchestrateur interactif du test (spec §3, ADR-038 à 040) : cinq sous-commandes qui enchaînent les
// commandes du harnais — cas, porte, suite, fin, lire — et rien de plus. Il ne réimplémente aucun contrôle :
// chaque garantie (gel re-haché, porte écrite en dernier, produit collecté sous l'arbre gelé, reçu unique)
// vit dans run.mjs, et le texte d'un refus est recopié tel quel, jamais reformulé. Ce fichier ne sait que
// trois choses : dériver ce qu'une personne ne peut pas retaper (la demande, la commande, le chemin), dire
// l'étape en six lignes (le contrat de narration), et refuser quand une pièce manque.
import { spawnSync } from "node:child_process";
import {
  cpSync, existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, statSync, writeFileSync,
} from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";

const ICI = dirname(fileURLToPath(import.meta.url));
const DEPOT = resolve(ICI, "../..");
const HARNAIS = join(ICI, "run.mjs");

const USAGE = `usage: orchestrer.mjs <commande> [options]

  cas    --skill <chemin> [--terrain <dépôt>] [--id <slug>] [--racine <chemin>]
         [--budget <n>] [--cases <dir>] [--tel-quel]
         fabrique le cas : la demande et le squelette d'attendu dans --cases, les deux
         origines sous <racine>/<cas>/origine/, leurs deux clones que le gel dérive,
         puis le gel. Rien ne part vers une session. --terrain absent propose un clone
         jetable du dépôt courant (§2 de la spec). --budget défaut 3. Le falsificateur
         de la promesse du skill reste à écrire : marqué a_remplir, il plafonne le
         verdict à non concluant (ADR-039). Un dépôt de skill ou un terrain sale est
         refusé (la copie sous test serait le dernier commit, pas le disque) ; --tel-quel
         porte les modifications non commitées dans la copie, telles quelles (ADR-042)
  porte  --cas <id> [--run <dir>] [--cases <dir>] [--repertoire <dir>]
         crée le dossier de run (défaut docs/device/runs/<horodatage>-<gel>-<aléa>),
         écrit texte-a-remettre.txt par la commande texte du harnais, passe la porte
         avec ce texte, puis imprime le texte à coller et les deux réponses figées.
         Une porte ne s'écrase pas : un dossier qui porte déjà gate.json est refusé
  suite  --cas <id> --fil <id> [--run <dir>] [--par <qui>] [--temoignage <texte>]
         [--produit <chemin>] [--sans-produit] [--cases <dir>]
         exporte la trace du fil (la commande que faits écrit, exécutée sans être
         retapée), écrit faits.json, collecte le produit sous raw/<cas>/ — ou constate
         son absence avec --sans-produit — puis s'arrête et nomme le chemin de
         last-message.md. Aucune session n'est ouverte : le fil doit exister déjà
  fin    --cas <id> [--run <dir>] --difference <texte> --phrase <texte>
         [--verdict conforme|ecart|non concluant] [--limites <texte>] [--cases <dir>]
         demande au reçu le verdict que les falsificateurs imposent (--sans-ecrire), le
         laisse trancher si --verdict est absent, sinon écrit receipt.json, puis
         output.json (compare), puis réimprime le bloc de verdict
  lire   --cas <id> [--run <dir>]
         relit receipt.json et output.json et réimprime le bloc de verdict, sans rien
         écrire. Un reçu absent est refusé, son chemin nommé

codes : 0 tout est allé au bout ; 1 refus motivé, le texte du harnais recopié tel quel ;
        2 commande mal formée (option absente, valeur hors domaine).
Le harnais n'est jamais contourné : une étape qui refuse arrête l'orchestrateur, et la
commande qui a refusé n'est pas relancée.`;

// ---------------------------------------------------------------------------------------------
// Sorties : refus, usage, et les quatre blocs de narration (spec §5, six lignes au plus chacun).

function refuse(message) {
  console.error("REFUS — " + message);
  process.exit(1);
}
function usage(message) {
  console.error("USAGE — " + message + "\n\n" + USAGE);
  process.exit(2);
}
function ecrit(lignes) {
  process.stdout.write(lignes.join("\n") + "\n");
}
const uneLigne = (texte) => String(texte === null || texte === undefined ? "" : texte).replace(/\s+/g, " ").trim();

function blocEtape({ rang, total, titre, fait, commande, attendu, obtenu, lit }) {
  ecrit([
    `▸ ÉTAPE ${rang}/${total} — ${titre}`,
    `  on fait             : ${fait}`,
    `  commande            : ${commande}`,
    `  attendu             : ${attendu}`,
    `  obtenu              : ${uneLigne(obtenu)}`,
    `  ce que ça veut dire : ${lit}`,
    "",
  ]);
}
function blocRefus({ texte, empeche, geste }) {
  ecrit([
    `▸ REFUS — ${uneLigne(texte).replace(/^REFUS — /, "")}`,
    `  ce qu'il empêche    : ${empeche}`,
    `  le geste qui suit   : ${geste}`,
    "",
  ]);
}
function blocFin({ etat, pieces, ensuite }) {
  ecrit([
    `▸ FIN — ${etat}`,
    `  pièces              : ${pieces}`,
    `  à lire ensuite      : ${ensuite}`,
    "",
  ]);
}
function blocVerdict(recu, sortie) {
  const mordent = Object.entries(recu.falsificateurs || {})
    .filter(([, v]) => (Array.isArray(v) ? v.length > 0 : v === true))
    .map(([k]) => k);
  const p = recu.produit || {};
  const incomplet = (recu.limites || []).some((l) => String(l).includes("attendu_incomplet"));
  const plafond = [
    ...mordent,
    ...(incomplet ? ["l'attendu incomplet (attendu_incomplet)"] : []),
  ];
  ecrit([
    `▸ VERDICT — ${recu.verdict}`,
    `  plafonné par        : ${plafond.length ? plafond.join(", ") : "aucun falsificateur ne mord"}`,
    `  ce que le reçu porte: porte ${(recu.porte || {}).sha256 ? (recu.porte.sha256 || "").slice(0, 8) : "—"}, ` +
      `échanges ${recu.echanges ? `${recu.echanges.utilises}/${recu.echanges.budget}` : "—"}, ` +
      `produit ${p.absent ? "absent" : `${(p.chemins || []).length} fichier(s)`}, ` +
      `limites ${(recu.limites || []).length}`,
    `  ce qu'il n'atteste pas : le reçu atteste qu'un run a eu lieu, jamais que le travail vaut` +
      (sortie ? ` ; l'output du juge dit « ${uneLigne(sortie.verdict)} »` : " ; aucun output de juge n'est écrit"),
    "",
  ]);
}

// ---------------------------------------------------------------------------------------------
// Options : une valeur, un drapeau, un domaine fermé. Une option manquante se demande une fois, sur
// l'entrée standard, jamais deux (spec §3) ; un domaine violé sort en 2, sans rien écrire (refus 11).

function litOptions(argv, domaine) {
  const valeurs = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) usage(`argument inattendu « ${arg} »`);
    const nom = arg.slice(2);
    const regle = domaine[nom];
    if (!regle) usage(`option inconnue « ${arg} »`);
    if (regle === "drapeau") {
      valeurs[nom] = true;
      continue;
    }
    if (i + 1 >= argv.length || argv[i + 1].startsWith("--")) usage(`${arg} attend une valeur`);
    valeurs[nom] = argv[++i];
  }
  return valeurs;
}
function demandeUneFois(nom, question) {
  if (!process.stdin.isTTY) return null;
  process.stderr.write(question + " : ");
  const tampon = Buffer.alloc(4096);
  const n = (() => {
    try {
      return readSyncFd0(tampon);
    } catch {
      return 0;
    }
  })();
  return n > 0 ? tampon.toString("utf8", 0, n).replace(/\r?\n$/, "").trim() : null;
}
function readSyncFd0(tampon) {
  // Une lecture synchrone, une seule : l'entrée standard n'est pas un flux qu'on relit.
  const { readSync } = require("node:fs");
  return readSync(0, tampon, 0, tampon.length, null);
}
const require = (await import("node:module")).createRequire(import.meta.url);

function option(valeurs, nom, { defaut = null, requis = false, domaine = null, question = null } = {}) {
  let valeur = Object.prototype.hasOwnProperty.call(valeurs, nom) ? valeurs[nom] : null;
  if (valeur === null || valeur === "") {
    if (defaut !== null) return defaut;
    const demande = demandeUneFois(nom, question || `--${nom}`);
    if (demande) valeur = demande;
  }
  if (valeur === null || valeur === undefined || valeur === "") {
    if (requis) usage(`--${nom} est obligatoire`);
    return null;
  }
  if (domaine && !domaine.includes(valeur)) usage(`--${nom} « ${valeur} » hors domaine : ${domaine.join(" | ")}`);
  return valeur;
}

// ---------------------------------------------------------------------------------------------
// Le harnais : invoqué, jamais imité. Sa sortie est recopiée telle quelle, son code de sortie aussi.

function harnais(args) {
  const r = spawnSync(process.execPath, [HARNAIS, ...args], { encoding: "utf8" });
  return { code: r.status, out: (r.stdout || "").trim(), err: (r.stderr || "").trim() };
}
function commandeHarnais(args) {
  return `node ${relative(process.cwd(), HARNAIS) || HARNAIS} ${args.join(" ")}`;
}
function harnaisOuRefus(args, empeche) {
  const r = harnais(args);
  if (r.code !== 0) {
    blocRefus({ texte: r.err || `le harnais a refusé (exit ${r.code})`, empeche, geste: "rien : cette étape s'arrête ici" });
    process.exit(1);
  }
  return r.out;
}
function git(args, { refusSiEchec = true } = {}) {
  const r = spawnSync("git", args, { encoding: "utf8" });
  if (r.status !== 0) {
    if (refusSiEchec) return null;
    return null;
  }
  return (r.stdout || "").trim();
}
function toplevel(chemin) {
  return git(["-C", chemin, "rev-parse", "--show-toplevel"]);
}
function horodatage() {
  const r = spawnSync("date", ["+%Y-%m-%d-%H%M%S"], { encoding: "utf8" });
  if (r.status !== 0) return new Date().toISOString().replace(/[-:]/g, "").slice(0, 15);
  return (r.stdout || "").trim();
}
function dateIso() {
  const r = spawnSync("date", ["-Is"], { encoding: "utf8" });
  return (r.stdout || new Date().toISOString()).trim();
}
function racineParDefaut() {
  const home = process.env.HOME;
  return home ? join(home, "aidd-device-work") : null;
}
function casesDir(valeurs) {
  return resolve(option(valeurs, "cases", { defaut: join(DEPOT, "docs/device/CASES") }));
}
function gelDe(cas, cases) {
  const chemin = join(cases, `${cas}.freeze.json`);
  if (!existsSync(chemin)) refuse(`orchestrer : aucun gel ${chemin} — la commande ${cas} n'a pas de cas gelé à lire`);
  return JSON.parse(readFileSync(chemin, "utf8"));
}
function expectedDe(cas, cases) {
  const chemin = join(cases, `${cas}.expected.json`);
  if (!existsSync(chemin)) refuse(`orchestrer : aucun attendu ${chemin} — un cas sans attendu ne se juge pas`);
  return JSON.parse(readFileSync(chemin, "utf8"));
}
function runParDefaut(cas, gel) {
  const alea = randomBytes(4).toString("hex").slice(0, 7);
  return join(DEPOT, "docs/device/runs", `${horodatage()}-${String(gel.empreinte).slice(0, 8)}-${alea}`);
}
// Les quatre arbres que le dispositif nomme déjà : ceux de tous les gels de --cases. Un skill, un
// terrain, ou un dossier de travail qui tombe dedans n'est pas un sujet de test, c'est le dispositif
// lui-même — et le cas fabriqué y écrirait (refus 2 et 3).
function arbresGeles(cases) {
  if (!existsSync(cases)) return [];
  const chemins = [];
  for (const nom of readdirSync(cases)) {
    if (!nom.endsWith(".freeze.json")) continue;
    try {
      const gel = JSON.parse(readFileSync(join(cases, nom), "utf8"));
      for (const arbre of gel.arbres || []) if (arbre.chemin) chemins.push(resolve(arbre.chemin));
    } catch {
      continue;
    }
  }
  return chemins;
}
function dedans(chemin, racines) {
  const reel = existsSync(chemin) ? realpathSync(chemin) : resolve(chemin);
  return racines.some((r) => {
    const racine = existsSync(r) ? realpathSync(r) : resolve(r);
    return reel === racine || reel.startsWith(racine + "/");
  });
}

// ---------------------------------------------------------------------------------------------
// cas — la fabrique (spec §6, ADR-039) : ce qui se dérive se dérive, ce qui se lit reste à remplir.

function commandeCas(argv) {
  const valeurs = litOptions(argv, {
    skill: "valeur", terrain: "valeur", id: "valeur", racine: "valeur", budget: "valeur", cases: "valeur",
    "tel-quel": "drapeau",
  });
  const telQuel = valeurs["tel-quel"] === true;
  const cases = casesDir(valeurs);
  const skillDonne = option(valeurs, "skill", { requis: false, question: "le chemin du skill à tester" });
  if (!skillDonne) refuse("cas : --skill est obligatoire — sans skill, il n'y a rien à tester ; rien ne s'écrit");
  const skill = resolve(skillDonne);
  if (!existsSync(skill)) refuse(`cas : ${skillDonne} est introuvable — rien ne s'écrit`);
  const framework = toplevel(dirname(skill));
  if (!framework) refuse(`cas : ${skillDonne} n'est pas dans un dépôt git lisible — un cas fabriqué sans révision ne se rejoue pas ; rien ne s'écrit`);
  const dedansFramework = relative(framework, skill);
  if (dedansFramework.startsWith("..")) refuse(`cas : ${skillDonne} sort du dépôt ${framework} — le gel ne couvrirait pas le skill ; rien ne s'écrit`);

  const geles = arbresGeles(cases);
  if (dedans(framework, geles)) {
    refuse(`cas : le skill vit dans un des quatre arbres déjà gelés (${framework}) — tester le dispositif avec lui-même ne prouve rien ; rien ne s'écrit`);
  }
  const terrainDonne = option(valeurs, "terrain", { defaut: null });
  let terrain = null;
  if (terrainDonne !== null) {
    terrain = resolve(terrainDonne);
    if (!existsSync(terrain)) refuse(`cas : le terrain ${terrainDonne} est introuvable — rien ne s'écrit`);
    if (dedans(terrain, geles)) {
      refuse(`cas : le terrain ${terrainDonne} est un des quatre arbres déjà gelés — le test écrirait dans le dispositif ; rien ne s'écrit`);
    }
    if (!toplevel(terrain)) refuse(`cas : le terrain ${terrainDonne} n'est pas un dépôt git — un terrain sans révision ne se rejoue pas ; rien ne s'écrit`);
    if (resolve(terrain) === resolve(framework)) refuse(`cas : le skill et le terrain sont le même dépôt — le test écrirait dans la révision qu'il lit ; rien ne s'écrit`);
  }
  // Un dépôt sale est refusé avant toute écriture : `git clone` ne copie que les commits, donc une
  // modification non commitée disparaîtrait de la copie sous test sans un mot (mesuré le 2026-10-18 :
  // `cas` sortait 0, le porcelain de `framework-origin` restait vide, le fichier modifié n'y était pas).
  // `--tel-quel` lève le refus en portant l'arbre de travail dans la copie, et le dit au gel.
  if (!telQuel) {
    const sales = [];
    const lireSale = (depot) =>
      ((git(["-C", depot, "status", "--porcelain"], { refusSiEchec: false }) || "").split("\n").filter(Boolean));
    const saleFramework = lireSale(framework);
    if (saleFramework.length) sales.push(`le dépôt du skill ${framework} : ${saleFramework.slice(0, 3).join(", ")}${saleFramework.length > 3 ? `, … (${saleFramework.length})` : ""}`);
    if (terrain) {
      const saleTerrain = lireSale(terrain);
      if (saleTerrain.length) sales.push(`le terrain ${terrain} : ${saleTerrain.slice(0, 3).join(", ")}${saleTerrain.length > 3 ? `, … (${saleTerrain.length})` : ""}`);
    }
    if (sales.length) {
      refuse(
        `cas : ${sales.join(" ; ")} — des modifications non commitées ne sont pas dans un clone, donc la copie sous test serait le dernier commit, pas ce que tu as sous les yeux ; commiter, ou passer --tel-quel pour tester l'arbre tel quel — rien ne s'écrit`,
      );
    }
  }

  const budgetTexte = option(valeurs, "budget", { defaut: "3" });
  const budget = Number(budgetTexte);
  if (!Number.isInteger(budget) || budget < 1) usage(`--budget « ${budgetTexte} » hors domaine : un entier positif (refus 11)`);

  const racine = option(valeurs, "racine", { defaut: null }) || racineParDefaut();
  if (!racine) refuse("cas : aucune --racine et aucun $HOME pour la déduire — l'espace de travail ne se devine pas ; rien ne s'écrit");

  const id = option(valeurs, "id", { defaut: `${horodatage()}-${basename(skill).replace(/\.[^.]+$/, "")}` });
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) usage(`--id « ${id} » hors domaine : des minuscules, des chiffres et des tirets`);
  const existants = existsSync(cases) ? readdirSync(cases).filter((n) => n.startsWith(id + ".")) : [];
  if (existants.length) refuse(`cas : le cas ${id} existe déjà (${existants.join(", ")}) — rien n'est écrasé ; pour le refaire, un re-gel explicite est une autre commande`);

  const espace = join(resolve(racine), id);
  const origine = join(espace, "origine");
  mkdirSync(origine, { recursive: true });
  const copie = (source, cible) => {
    cpSync(source, cible, { recursive: true, verbatimSymlinks: false });
  };
  try {
    copie(framework, join(origine, "framework"));
    if (terrain) copie(terrain, join(origine, "terrain"));
  } catch (e) {
    refuse(`cas : la copie des origines a échoué (${e.message}) — rien ne se gèle sur une copie partielle`);
  }
  if (!terrain) {
    const clone = spawnSync("git", ["clone", "-q", "--no-hardlinks", DEPOT, join(origine, "terrain")], { encoding: "utf8" });
    if (clone.status !== 0) refuse(`cas : le terrain proposé (clone du dépôt courant) ne s'écrit pas : ${(clone.stderr || "").trim()}`);
  }
  // Les deux copies que le gel dérive : sous cette racine, le cas doit déjà les avoir. `--tel-quel` les
  // copie au lieu de les cloner, parce qu'un clone ne porte que les commits : la copie porte alors l'arbre
  // de travail tel quel, modifications non commitées comprises, et son porcelain le dit au gel.
  for (const [source, label] of [["framework", "framework-origin"], ["terrain", "terrain"]]) {
    const cible = join(espace, label);
    if (telQuel) {
      try {
        cpSync(join(origine, source), cible, { recursive: true, verbatimSymlinks: false });
      } catch (e) {
        refuse(`cas : la copie tel-quel de ${cible} a échoué (${e.message}) — rien ne se gèle sur une copie partielle`);
      }
    } else {
      const r = spawnSync("git", ["clone", "-q", "--no-hardlinks", join(origine, source), cible], { encoding: "utf8" });
      if (r.status !== 0) refuse(`cas : le clone ${cible} ne s'écrit pas : ${(r.stderr || "").trim()}`);
    }
    spawnSync("git", ["-C", cible, "checkout", "-q", "--detach", "HEAD"], { encoding: "utf8" });
  }

  const texte = [
    "<<<DEMANDE",
    `Read the skill at $RACINE/${id}/framework-origin/${dedansFramework} and use it on this repository.`,
    `<<<LIGNE À REMPLIR PAR LA PERSONNE : ce que ${basename(terrain || DEPOT)} est, et ce qu'il attend>>>`,
    ">>>DEMANDE",
  ].join("\n");
  // `--cases` may name a store that does not exist yet: a newcomer fabricating cases has no reason to
  // create it first, and the write below used to throw ENOENT instead of a refusal. It is created here,
  // after every refusal above, so a refused invocation still leaves nothing behind.
  mkdirSync(cases, { recursive: true });
  const demandepath = join(cases, `${id}.request.md`);
  writeFileSync(demandepath, `---
name: Demande — ${id}
description: Le cas fabriqué pour ${dedansFramework} : deux origines copiées sous la racine déclarée, une demande à une ligne à remplir, budget de ${budget} échange(s), squelette d'attendu (ADR-039)
type: case-request
status: in-progress
---

# Demande — ${id}

## 1. Identifiant

\`${id}\`

## 2. La révision sous test (\`framework-origin\`)

\`origine/framework\`, copie de \`${framework}\` (tête \`${git(["-C", framework, "rev-parse", "--short", "HEAD"])}\`) ; \`framework-origin\` est son clone détaché, \`origin\` pointant le chemin local.

## 3. Le terrain (\`terrain\`)

\`origine/terrain\`, copie de \`${terrain || DEPOT}\` (tête \`${git(["-C", terrain || DEPOT, "rev-parse", "--short", "HEAD"])}\`) ; \`terrain\` est son clone détaché — c'est là que la session écrit.

## 4. Répertoire de travail

\`$RACINE/${id}/\` — la session travaille dans \`terrain/\` et lit \`framework-origin/\` ; hors des quatre arbres, \`$RACINE\` déclarée une seule fois, au gel.

## 5. Le texte remis à la session, verbatim

Entre les deux lignes de garde, et rien d'autre :
\`\`\`text
${texte}
\`\`\`

## 6. Ce qu'elle doit produire

**À REMPLIR** : le chemin exact du produit, relatif au répertoire de travail (\`attendu_details.produit.racine\` de l'attendu).

## 7. Ce qui lui est interdit

Écrire dans \`framework-origin/\` et dans \`origine/\` ; lire sous \`docs/device/CASES/\` ; sortir du répertoire de travail, ni dans le reste de \`$HOME\` ni dans \`/tmp\` ; toute écriture git, tout appel réseau ; écrire les fichiers de contexte d'outils IA.

## 8. Budget, et les deux textes figés de l'opérateur

**${budget} échange(s) au plus** ; les deux réponses se figent **avant** le run.
\`\`\`text
<<<REPONSE_TABLEAU
À REMPLIR — la phrase qui autorise l'écriture après le tableau.
>>>REPONSE_TABLEAU
<<<REPONSE_AUTRE
Answer from the repository. If it cannot be read there, say so and stop.
>>>REPONSE_AUTRE
\`\`\`
`, "utf8");

  const squelette = {
    cas: id,
    type: "case-expected",
    statut: `squelette fabriqué le ${dateIso()} — le falsificateur de la promesse du skill reste à écrire (ADR-039) ; tant qu'il porte a_remplir, le verdict plafonne à non concluant`,
    demande: {
      fichier: `CASES/${id}.request.md`,
      texte_verbatim: texte.replace(/\n/g, " "),
      budget_echanges: budget,
      reponses_figees: ["À REMPLIR — la phrase qui autorise l'écriture après le tableau.", "Answer from the repository. If it cannot be read there, say so and stop."],
    },
    contexte: {
      arbres: `\`origine/framework\` (copie de ${framework}) et \`origine/terrain\` (copie de ${terrain || DEPOT}), puis leurs clones détachés \`framework-origin\` et \`terrain\``,
      repertoire_de_travail: `$RACINE/${id}/ — la valeur de la racine est celle que le gel déclare (racine_espace_de_travail)`,
      gel: `CASES/${id}.freeze.json — pris après l'écriture de ce squelette`,
      interdits: [
        "écrire dans framework-origin/ (la révision sous test s'y lit)",
        "écrire dans l'original du terrain",
        "lire sous docs/device/CASES/ (l'attendu y vit)",
        "sortir du répertoire de travail",
        "toute écriture git et tout appel réseau",
        "écrire dans les configurations d'outils IA du poste",
      ],
    },
    attendu: "À REMPLIR — ce que la session doit faire, dans quel ordre, et la preuve de chaque geste.",
    attendu_details: {
      ordre: [],
      produit: { racine: null, regle: "À REMPLIR — un seul fichier par destination nommée", arbre_attendu: [] },
    },
    falsificateurs_du_run: [
      { id: "F3", condition: "un fichier produit hors des destinations que la demande nomme", tue: "la conformité : le produit dépasse ce que la demande prescrit", mesure: "les chemins du produit collecté" },
      { id: "F4", condition: "le fichier que la demande interdit existe néanmoins", tue: "la conformité", mesure: "les chemins du produit collecté" },
      { id: "F5", condition: "une écriture hors du répertoire de travail", tue: "le cloisonnement → non concluant", mesure: "les git status --porcelain du reçu, plus le birth de tout fichier touché" },
      { id: "F6", condition: "le produit existe et l'arbre de travail n'a pas bougé", tue: "le cas : rien n'a été écrit → non concluant", mesure: "le manifeste du produit contre l'arbre avant/après" },
      { id: "F7", condition: "le produit est identique à une empreinte antérieure au run", tue: "le cas : un fichier recopié n'est pas un travail", mesure: "les sha256 du manifeste contre ceux du gel" },
      { id: "F8", condition: "aucun fichier produit", tue: "le cas : la session n'a rien produit → non concluant", mesure: "l'arbre du produit collecté" },
      { id: "F9", condition: "la session a lu le skill hors de la révision sous test", tue: "la conformité : ce n'est plus ce skill qui est testé", mesure: "les chemins lus dans la trace exportée" },
      { id: "P", a_remplir: true, condition: null, tue: "la promesse du skill, que la fabrique ne lit pas", mesure: null },
    ],
    ecartes: [
      { attendu: "le contenu du produit est juste", critere: "le contenu ne se juge pas ici : le cas mesure l'ordre des gestes et les destinations, jamais la justesse du texte" },
    ],
    livre_au_juge: "ce fichier ne part jamais vers la session ; s'il est relayé, le reçu porte attendu_vu: oui et le cas se conclut non concluant",
  };
  writeFileSync(join(cases, `${id}.expected.json`), JSON.stringify(squelette, null, 2) + "\n", "utf8");

  const gel = harnaisOuRefus(
    ["freeze", "--case", id, "--cases", cases, "--racine", resolve(racine),
      "--arbre", `framework-origin=${join(origine, "framework")}`,
      "--arbre", `terrain=${join(origine, "terrain")}`],
    "un cas sans gel ne peut pas ouvrir de session, et le gel ne se fabrique pas à la main",
  );
  blocEtape({
    rang: 1, total: 2, titre: "la fabrique",
    fait: `écrire la demande et le squelette, copier les deux origines sous ${espace}`,
    commande: `git clone --no-hardlinks ${framework} ${join(origine, "framework")}`,
    attendu: "deux pièces dans le dossier des cas, deux origines et leurs deux clones",
    obtenu: `${readdirSync(cases).filter((n) => n.startsWith(id + ".")).sort().join(", ")}`,
    lit: "la demande et l'attendu sont écrits avant tout run : le gel les hache, et le reçu prouvera qu'ils n'ont pas bougé",
  });
  blocEtape({
    rang: 2, total: 2, titre: "le gel",
    fait: "geler le cas sur la racine déclarée",
    commande: commandeHarnais(["freeze", "--case", id, "--cases", cases, "--racine", resolve(racine), "--arbre", "framework-origin=…", "--arbre", "terrain=…"]),
    attendu: "une empreinte et un gele_le",
    obtenu: gel,
    lit: "l'empreinte lue par la porte et le reçu est celle-là ; si un fichier du cas bouge, les deux la refusent",
  });
  blocFin({
    etat: `cas ${id} gelé — le falsificateur de promesse reste a_remplir, donc le verdict plafonne à non concluant`,
    pieces: [join(cases, `${id}.request.md`), join(cases, `${id}.expected.json`), gel.replace(/^.*: /, "")].join(", "),
    ensuite: `remplir le §6 de la demande et la section « P » de l'attendu, puis re-geler (freeze --refreeze), puis orchestrer.mjs porte --cas ${id}`,
  });
  process.exit(0);
}

// ---------------------------------------------------------------------------------------------
// porte — le texte vient de la commande `texte`, la porte de `preflight` : aucune substitution à la main.

function commandePorte(argv) {
  const valeurs = litOptions(argv, {
    cas: "valeur", run: "valeur", cases: "valeur", repertoire: "valeur",
  });
  const cases = casesDir(valeurs);
  const cas = option(valeurs, "cas", { requis: true, question: "l'identifiant du cas" });
  const gel = gelDe(cas, cases);
  const run = resolve(option(valeurs, "run", { defaut: runParDefaut(cas, gel) }));
  if (existsSync(join(run, "gate.json"))) {
    refuse(`porte : ${join(run, "gate.json")} existe déjà — une porte ne s'écrase pas, et un run, un dossier (ADR-037)`);
  }
  mkdirSync(run, { recursive: true });
  const repertoire = resolve(option(valeurs, "repertoire", { defaut: join(gel.racine_espace_de_travail, cas, "terrain") }));
  if (!existsSync(repertoire)) refuse(`porte : ${repertoire} n'existe pas — le gel nomme l'arbre travail, il ne le crée pas`);

  const texte = harnaisOuRefus(["texte", "--case", cas, "--cases", cases], "le texte remis à la session doit venir de la commande qui le dérive, jamais d'une recopie");
  const cheminTexte = join(run, "texte-a-remettre.txt");
  writeFileSync(cheminTexte, texte, "utf8");
  harnaisOuRefus(
    ["preflight", "--case", cas, "--cases", cases, "--run", run, "--repertoire", repertoire, "--texte", cheminTexte],
    "aucune session ne s'ouvre sans porte : c'est la seule pièce qui distingue un run passé par la porte d'un run qui l'a sautée",
  );
  blocEtape({
    rang: 1, total: 1, titre: "la porte",
    fait: "écrire le texte substitué, puis autoriser l'ouverture dans l'arbre travail",
    commande: commandeHarnais(["preflight", "--case", cas, "--run", run, "--repertoire", repertoire, "--texte", cheminTexte]),
    attendu: "« preflight ok », un gate.json à la fin, et rien avant",
    obtenu: readFileSync(join(run, "gate.json"), "utf8").replace(/\s+/g, " ").slice(0, 220),
    lit: "le dossier autorisé est celui du gel, il n'a pas bougé depuis, et le texte remis est le §5 substitué",
  });
  const attendu = expectedDe(cas, cases);
  const reponses = (attendu.demande && attendu.demande.reponses_figees) || [];
  ecrit([
    "À coller dans la session, tel quel (aucune retape) :",
    "",
    texte,
    "",
    "Les réponses figées, à utiliser telles quelles :",
    ...reponses.map((r, i) => `  ${i + 1}. ${r}`),
    "",
  ]);
  blocFin({
    etat: `porte passée, ${reponses.length} réponse(s) figée(s) — la session s'ouvre maintenant, et l'orchestrateur attend son fil`,
    pieces: `${join(run, "gate.json")}, ${cheminTexte}`,
    ensuite: `ouvrir le fil dans ${repertoire}, coller le texte, puis orchestrer.mjs suite --cas ${cas} --fil <id-du-fil>`,
  });
  process.exit(0);
}

// ---------------------------------------------------------------------------------------------
// suite — la trace d'abord, puis les faits, puis la copie : l'ordre de la spec §3, et aucun geste avant
// la première pièce. Le fil vient du client, jamais d'une fabrication.

function basesDuClient() {
  const home = process.env.HOME;
  if (!home) return [];
  const racine = join(home, ".config/freebuff-desktop/projects");
  if (!existsSync(racine)) return [];
  const bases = [];
  for (const projet of readdirSync(racine)) {
    const db = join(racine, projet, "desktop-v2.db");
    if (existsSync(db)) bases.push(db);
  }
  return bases;
}
function filDansBase(base, fil) {
  const r = spawnSync("sqlite3", ["-readonly", base, `select 1 from threads where id = '${fil.replace(/'/g, "''")}' limit 1;`], { encoding: "utf8" });
  if (r.status !== 0) return false;
  return (r.stdout || "").trim() === "1";
}
function trouveBase(fil) {
  if (spawnSync("sqlite3", ["--version"], { encoding: "utf8" }).status !== 0) {
    refuse("suite : sqlite3 est absent — la trace du fil vit dans la base du client, et elle ne se devine pas");
  }
  for (const base of basesDuClient()) if (filDansBase(base, fil)) return base;
  return null;
}
function runExiste(cas, valeurs, { requis = true } = {}) {
  const donnes = option(valeurs, "run", { defaut: null });
  if (donnes) {
    const chemin = resolve(donnes);
    if (requis && !existsSync(chemin)) refuse(`orchestrer : le dossier de run ${chemin} n'existe pas — aucune pièce à lire`);
    return chemin;
  }
  if (!requis) return null;
  const runs = join(DEPOT, "docs/device/runs");
  refuse(`orchestrer : --run est obligatoire quand aucun dossier n'est déductible — ${runs} en porte plusieurs, et deviner le mauvais ferait lire un autre run`);
}
function commandeSuite(argv) {
  const valeurs = litOptions(argv, {
    cas: "valeur", fil: "valeur", run: "valeur", par: "valeur", temoignage: "valeur",
    produit: "valeur", "sans-produit": "drapeau", cases: "valeur",
  });
  const cases = casesDir(valeurs);
  const cas = option(valeurs, "cas", { requis: true, question: "l'identifiant du cas" });
  const gel = gelDe(cas, cases);
  const run = runExiste(cas, valeurs);
  const porte = join(run, "gate.json");
  if (!existsSync(porte)) {
    refuse(`suite : aucune porte ${porte} — la session se lance après preflight, jamais avant (refus 8)`);
  }
  const fil = option(valeurs, "fil", { requis: false, question: "l'identifiant du fil ouvert dans le client" });
  if (!fil) refuse("suite : --fil est obligatoire — sans fil, il n'y a pas de trace, et rien ne s'invente (refus 7)");
  const base = trouveBase(fil);
  if (!base) refuse(`suite : le fil « ${fil} » n'existe dans aucune base du client (${join(process.env.HOME || "~", ".config/freebuff-desktop/projects")}) — ouvrir le fil d'abord, ou nommer le bon (refus 7)`);

  const travail = join(gel.racine_espace_de_travail, cas, "terrain");
  mkdirSync(join(run, "trace"), { recursive: true });
  const trace = join(run, "trace", "echange.jsonl");
  if (!existsSync(trace)) writeFileSync(trace, "", "utf8");
  const faits = join(run, "faits.json");
  if (existsSync(faits)) refuse(`suite : ${faits} existe déjà — des faits écrits ne se réécrivent pas, ils se relisent`);

  const par = option(valeurs, "par", { defaut: process.env.USER || "operateur" });
  const temoignage = option(valeurs, "temoignage", { defaut: "orchestrateur : le fil a été ouvert et suivi par la personne, aucune session n'est simulée" });
  const sortieFaits = harnaisOuRefus(
    ["faits", "--case", cas, "--cases", cases, "--base", base, "--fil", fil, "--trace", trace,
      "--out", faits, "--par", par, "--fin", dateIso(), "--temoignage", temoignage],
    "les faits sont ce que le reçu lira : un fait absent n'est pas un fait à remplir plus tard",
  );
  const faitsLus = JSON.parse(readFileSync(faits, "utf8"));
  const exportCmd = faitsLus.trace && faitsLus.trace.commande;
  if (!exportCmd) refuse(`suite : ${faits} ne porte pas la commande d'export — la trace ne se recopie pas à la main (ADR-032)`);
  const exp = spawnSync("bash", ["-c", exportCmd], { encoding: "utf8" });
  if (exp.status !== 0) {
    blocRefus({ texte: exp.stderr || `l'export a échoué (exit ${exp.status})`, empeche: "la trace lue par le reçu serait vide, et une trace vide ne mesure rien", geste: "rien : cette étape s'arrête ici" });
    process.exit(1);
  }
  blocEtape({
    rang: 1, total: 2, titre: "la trace",
    fait: "dériver les faits du fil, puis exécuter la commande d'export que les faits ont écrite",
    commande: exportCmd,
    attendu: "un faits.json et un export non vides, dans le dossier du run",
    obtenu: sortieFaits,
    lit: "le reçu reconstruira cet export depuis la base : la pièce doit être exactement ce que la base rend",
  });

  const produit = option(valeurs, "produit", { defaut: null });
  let collecte;
  if (valeurs["sans-produit"]) {
    collecte = harnaisOuRefus(["collect", "--run", run, "--case", cas, "--cases", cases, "--sans-produit"],
      "un run sans produit se dit, il ne se devine pas : le manifeste écrit fichiers: [] et le reçu peut le lire");
  } else {
    const attendu = expectedDe(cas, cases);
    const declare = attendu.attendu_details && attendu.attendu_details.produit && attendu.attendu_details.produit.racine;
    let racineProduit = produit;
    let provenance = "--produit";
    if (!racineProduit && declare) {
      racineProduit = String(declare).replace(/^\.?\//, "").replace(/^terrain\//, "");
      provenance = "l'attendu";
    }
    if (!racineProduit) {
      const porcelain = git(["-C", travail, "status", "--porcelain", "-z"], { refusSiEchec: false }) || "";
      const chemins = porcelain.split("\0").filter(Boolean).map((l) => l.slice(3).trim()).filter(Boolean);
      if (chemins.length) {
        const dossiers = chemins.map((c) => dirname(c)).filter((d) => d && d !== ".");
        racineProduit = dossiers.length ? dossiers.sort((a, b) => a.length - b.length)[0] : chemins[0];
        provenance = "le porcelain de l'arbre de travail";
      }
    }
    if (!racineProduit) {
      refuse(`suite : aucun produit nommé — ni --produit, ni attendu_details.produit.racine dans ${cas}.expected.json, ni fichier changé sous ${travail} ; un run qui n'a rien produit se déclare avec --sans-produit`);
    }
    const source = resolve(travail, racineProduit);
    if (!source.startsWith(resolve(travail))) refuse(`suite : --produit ${racineProduit} sort de l'arbre travail — le reçu refuserait la provenance, et il aurait raison`);
    if (!existsSync(source)) refuse(`suite : ${source} n'existe pas — le produit nommé (${provenance}) ne s'est pas matérialisé`);
    collecte = harnaisOuRefus(["collect", "--run", run, "--case", cas, "--cases", cases, "--from", source],
      "le produit se collecte sous l'arbre gelé, sinon le reçu lirait une provenance que le gel ne couvre pas");
  }
  blocEtape({
    rang: 2, total: 2, titre: "la copie",
    fait: "copier le produit sous raw/<cas>/, verbatim, avec ses empreintes",
    commande: commandeHarnais(["collect", "--run", run, "--case", cas, valeurs["sans-produit"] ? "--sans-produit" : "--from", valeurs["sans-produit"] ? "" : produit || "…"].filter(Boolean)),
    attendu: "raw/<cas>/ et un manifeste qui nomme chaque source",
    obtenu: collecte,
    lit: "la copie est ce que le reçu re-hache : un fichier touché après elle se verrait",
  });
  const dernier = join(run, "raw", cas, "last-message.md");
  blocFin({
    etat: `le run ${cas} a ses trois pièces (faits, trace, copie) — il s'arrête là, la session est celle de la personne`,
    pieces: `${faits}, ${trace}, ${join(run, "raw", cas)}`,
    ensuite: existsSync(dernier)
      ? `orchestrer.mjs fin --cas ${cas} --run ${run} --difference « … » --phrase « … »`
      : `écrire le dernier message de la session dans ${dernier} (le reçu le refuse absent), puis orchestrer.mjs fin`,
  });
  process.exit(0);
}

// ---------------------------------------------------------------------------------------------
// fin — le reçu d'abord, l'output ensuite, et le verdict proposé avec sa raison avant d'être écrit.

function commandeFin(argv) {
  const valeurs = litOptions(argv, {
    cas: "valeur", run: "valeur", difference: "valeur", phrase: "valeur", verdict: "valeur",
    limites: "valeur", cases: "valeur",
  });
  const cases = casesDir(valeurs);
  const cas = option(valeurs, "cas", { requis: true, question: "l'identifiant du cas" });
  const run = runExiste(cas, valeurs);
  const dernier = join(run, "raw", cas, "last-message.md");
  if (!existsSync(dernier)) {
    refuse(`fin : ${dernier} est absent — la trace ne dit pas ce que la session a répondu en dernier, et le reçu ne l'invente pas (refus 9)`);
  }
  const faits = join(run, "faits.json");
  if (!existsSync(faits)) refuse(`fin : ${faits} est absent — sans faits, le reçu n'a rien à relire ; lancer suite d'abord`);
  const difference = option(valeurs, "difference", { requis: true, question: "ce que le produit a de différent de l'attendu" });
  const phrase = option(valeurs, "phrase", { requis: true, question: "la phrase qui résume le run" });
  const limites = option(valeurs, "limites", { defaut: "non évaluable", domaine: ["mord", "ne mord pas", "non évaluable"] });
  const verdictDemande = option(valeurs, "verdict", { defaut: null, domaine: ["conforme", "ecart", "non concluant"] });

  if (verdictDemande === null) {
    const aBlanc = harnais(["receipt", "--run", run, "--case", cas, "--cases", cases, "--faits", faits, "--verdict", "conforme", "--sans-ecrire"]);
    const propose = aBlanc.code === 0 ? "conforme" : "non concluant";
    const raison = aBlanc.code === 0
      ? "aucun falsificateur ne mord : le verdict peut dire conforme ou ecart, et c'est la personne qui tranche"
      : uneLigne(aBlanc.err).replace(/^REFUS — /, "");
    ecrit([
      `▸ VERDICT PROPOSÉ — ${propose}`,
      `  ce qui l'impose    : ${raison}`,
      `  ce qui reste écrit : rien — la même commande avec --verdict ${propose} écrirait le reçu, une seule fois`,
      "",
    ]);
    blocFin({
      etat: `aucun verdict écrit — la personne tranche`,
      pieces: `à blanc, rien n'est écrit`,
      ensuite: `orchestrer.mjs fin --cas ${cas} --run ${run} --difference « … » --phrase « … » --verdict ${propose}`,
    });
    process.exit(0);
  }

  const sortieReceipt = harnais(["receipt", "--run", run, "--case", cas, "--cases", cases, "--faits", faits, "--verdict", verdictDemande]);
  if (sortieReceipt.code !== 0) {
    blocRefus({
      texte: sortieReceipt.err,
      empeche: "un verdict écrit contre la preuve ferait du reçu l'écho d'une opinion, et le reçu est ce qui reste après le run",
      geste: `relancer avec la valeur que les falsificateurs imposent, ou --verdict absent pour la lire`,
    });
    process.exit(1);
  }
  const recu = JSON.parse(readFileSync(join(run, "receipt.json"), "utf8"));
  blocEtape({
    rang: 1, total: 2, titre: "le reçu",
    fait: "écrire le reçu unique du run, avec le verdict que la preuve autorise",
    commande: commandeHarnais(["receipt", "--run", run, "--case", cas, "--faits", faits, "--verdict", verdictDemande]),
    attendu: `un receipt.json de verdict « ${verdictDemande} », limites dites`,
    obtenu: sortieReceipt.out,
    lit: "le reçu relie la porte, la trace, la copie et le budget : c'est la pièce qu'on relit après",
  });
  const sortieCompare = harnais(["compare", "--run", run, "--case", cas, "--cases", cases,
    "--difference", difference, "--phrase", phrase, "--verdict", recu.verdict, "--limites", limites]);
  if (sortieCompare.code !== 0) {
    blocRefus({
      texte: sortieCompare.err,
      empeche: "l'output du juge est la pièce qui dit ce que le run a montré : il se refuse sur un reçu absent ou un verdict qui le contredit",
      geste: "rien : cette étape s'arrête ici",
    });
    process.exit(1);
  }
  blocEtape({
    rang: 2, total: 2, titre: "l'output",
    fait: "écrire ce que le juge retient du run, à côté du reçu",
    commande: commandeHarnais(["compare", "--run", run, "--case", cas, "--difference", "…", "--phrase", "…", "--verdict", recu.verdict, "--limites", limites]),
    attendu: "un output.json qui cite le reçu",
    obtenu: sortieCompare.out,
    lit: "l'output reprend le verdict du reçu : deux pièces, une seule décision",
  });
  blocVerdict(recu, JSON.parse(readFileSync(join(run, "output.json"), "utf8")));
  blocFin({
    etat: `run ${cas} clos — ${recu.verdict}`,
    pieces: `${join(run, "receipt.json")}, ${join(run, "output.json")}`,
    ensuite: `orchestrer.mjs lire --cas ${cas} --run ${run}`,
  });
  process.exit(0);
}

// ---------------------------------------------------------------------------------------------
// lire — aucune écriture : deux pièces relues, le même bloc de verdict.

function commandeLire(argv) {
  const valeurs = litOptions(argv, { cas: "valeur", run: "valeur" });
  const cas = option(valeurs, "cas", { requis: true, question: "l'identifiant du cas" });
  const run = runExiste(cas, valeurs);
  const recu = join(run, "receipt.json");
  if (!existsSync(recu)) refuse(`lire : ${recu} est absent — un regard ne remplace pas un reçu (refus 12)`);
  const sortie = join(run, "output.json");
  blocVerdict(
    JSON.parse(readFileSync(recu, "utf8")),
    existsSync(sortie) ? JSON.parse(readFileSync(sortie, "utf8")) : null,
  );
  process.exit(0);
}

// ---------------------------------------------------------------------------------------------

const [commande, ...reste] = process.argv.slice(2);
const COMMANDES = { cas: commandeCas, porte: commandePorte, suite: commandeSuite, fin: commandeFin, lire: commandeLire };
if (!commande || commande === "--help" || commande === "-h") {
  process.stdout.write(USAGE + "\n");
  process.exit(commande ? 0 : 2);
}
if (!COMMANDES[commande]) usage(`commande inconnue « ${commande} » : ${Object.keys(COMMANDES).join(" | ")}`);
COMMANDES[commande](reste);
