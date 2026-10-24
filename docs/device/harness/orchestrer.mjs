#!/usr/bin/env node
// L'orchestrateur interactif du test (spec §3, ADR-038 à 040) : les sous-commandes qui enchaînent
// les commandes du harnais — cas, porte, suite, fin, lire — et rien de plus. Il ne réimplémente aucun contrôle :
// chaque garantie (gel re-haché, porte écrite en dernier, produit collecté sous l'arbre gelé, reçu unique)
// vit dans run.mjs, et le texte d'un refus est recopié tel quel, jamais reformulé. Ce fichier ne sait que
// trois choses : dériver ce qu'une personne ne peut pas retaper (la demande, la commande, le chemin), dire
// l'étape en six lignes (le contrat de narration), et refuser quand une pièce manque.
import { spawn, spawnSync } from "node:child_process";
import {
  cpSync, existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, statSync, writeFileSync,
} from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:net";
import { exportTrace as exporterTraceClient, filsFreebuff, session as sessionClient } from "./clients.mjs";
import { ecrireRapport } from "./rapport.mjs";
import { ecrireResultat, verifierLecture } from "./resultat.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const DEPOT = resolve(ICI, "../../..");
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
         avec ce texte, puis imprime le texte à coller, les deux réponses figées et la
         durée observée du cas, lue dans ses reçus (n et réserves), avant l'ouverture de la session.
         Une porte ne s'écrase pas : un dossier qui porte déjà gate.json est refusé
  ouvrir --cas <id> --run <dir> [--cases <dir>] [--api <url>] [--modele <fournisseur/modèle>]
         [--delai <minutes>]
         ouvre la session opencode par l'API de son serveur — le sien sur un port libre, ou celui
         que --api nomme —, envoie le texte que la porte a écrit (sha256 de gate.json vérifié),
         puis joue la pause : à chaque question posée — formulaire ou question en texte —, envoie la
         réponse figée du cas et répond au formulaire par l'option marquée Recommandé. S'arrête quand la
         session devient inactive,
         et refuse au délai (défaut 30 min). N'écrit rien dans le run : elle imprime le fil, que
         suite reçoit ensuite ; elle n'atteste aucun geste humain
  suite  --cas <id> --fil <id> [--run <dir>] [--client auto|freebuff|opencode]
         [--store <racine opencode>] [--par <qui>] --conduite agent|humain
         [--produit <chemin>] [--sans-produit] [--cases <dir>]
         exporte la trace du fil par l'adaptateur du client, écrit faits.json, écrit
         raw/<cas>/last-message.md depuis le dernier texte d'assistant de la trace et
         l'atteste dans faits.json, collecte le produit sous raw/<cas>/ — ou constate son
         absence avec --sans-produit — puis s'arrête. --client auto (défaut) essaie
         Freebuff puis opencode ; les deux ou aucun sont des refus qui nomment --client.
         Aucune session n'est ouverte : le fil doit exister déjà
  fin    --cas <id> [--run <dir>] --difference <texte> --phrase <texte>
         [--verdict conforme|ecart|non concluant] [--limites <texte>]
         [--juge <qui> --rubrique <texte>] [--cases <dir>]
         demande au reçu le verdict que les falsificateurs imposent (--sans-ecrire), le
         laisse trancher si --verdict est absent, sinon écrit receipt.json, puis
         output.json (compare) en exigeant --juge et --rubrique pour « conforme » (D3),
         RAPPORT.md, et RESULTAT.md quand CASES/<cas>.lecture.json
         déclare la lecture qui apparie chaque geste attendu à une mesure (ADR-061), puis
         réimprime le bloc de verdict. Quand l'attendu déclare un bloc verification, joue
         d'abord verifier : un mutant survivant interdit conforme, sans empêcher un ecart
  lire   --cas <id> [--run <dir>]
         relit receipt.json et output.json et réimprime le bloc de verdict, sans rien
         écrire. Un reçu absent est refusé, son chemin nommé
  rapport --cas <id> [--run <dir>] [--remplacer] [--cases <dir>]
         écrit RAPPORT.md à la racine du run, dérivé du reçu, de l'output et de la trace,
         sans modèle ni réseau. Un rapport déjà présent est refusé sans --remplacer ;
         fin l'écrit automatiquement quand le reçu et l'output viennent d'être écrits.
         La lecture du cas, quand elle existe, est vérifiée avant toute écriture
  tracer --run <dir> --fil <id> [--client auto|freebuff|opencode] [--store <dir>]
         [--depuis <iso>] [--jusqu <iso>]
         exporte le fil d'un run guidé sous trace/ — echange.jsonl et fil.json — sans reçu
         ni verdict. --depuis et --jusqu bornent la trace au run, sur l'heure de chaque
         message, borne haute exclue ; sans borne, le fil entier. Refuse un dossier sans
         run.json guidé, un mode autre que guide, une trace déjà écrite (ADR-076).
         --liste --depuis <iso> rend les fils actifs depuis cette date, sans contenu
         de message, parce qu'un identifiant ne se devine pas

codes : 0 tout est allé au bout ; 1 refus motivé, le texte du harnais recopié tel quel ;
        2 commande mal formée (option absente, valeur hors domaine).
Le harnais n'est jamais contourné : une étape qui refuse arrête l'orchestrateur, et la
commande qui a refusé n'est pas relancée.`;

// ---------------------------------------------------------------------------------------------
// Sorties : refus, usage, et les quatre blocs de narration (spec §5, six lignes au plus chacun).

// Un dossier de scratch ne se collecte que s'il porte au moins un fichier, à quelque profondeur :
// `collect` refuse un dossier vide, et un sous-dossier vide ne vaut pas mieux qu'un dossier vide.
function contientUnFichier(dossier) {
  for (const entree of readdirSync(dossier, { withFileTypes: true })) {
    if (entree.isFile()) return true;
    if (entree.isDirectory() && contientUnFichier(join(dossier, entree.name))) return true;
  }
  return false;
}

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

// The duration of a case is read from its real receipts, never from a table that a new run cannot
// move. Each receipt measures from the session's opening to the last message, then to the receipt:
// the sample is the set of receipts whose `cas` is the one `porte` is opening. A receipt with a
// missing, unparsable or negative instant is ignored; a `non concluant` verdict still counts, because
// a verdict is not a duration. The numbers of models and tools are derived too; the gestures are not
// compared, and the line says so.
const dureeMin = (s) => `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`;
const entierDe5 = (s) => Math.ceil(s / 300) * 5;
function recusDuCas(cas) {
  const runs = join(DEPOT, "docs/device/runs");
  if (!existsSync(runs)) return [];
  const mesures = [];
  for (const nom of readdirSync(runs)) {
    const chemin = join(runs, nom, "receipt.json");
    if (!existsSync(chemin)) continue;
    let recu;
    try {
      recu = JSON.parse(readFileSync(chemin, "utf8"));
    } catch {
      continue;
    }
    if (!recu || recu.cas !== cas) continue;
    const debut = Date.parse(recu.session?.ouverte_le ?? recu.session_verifiee?.ouverte_le ?? recu.horodatage_debut);
    const fin = Date.parse(recu.horodatage_fin);
    const ecrit = Date.parse(recu.recu_ecrit_le);
    if (!Number.isFinite(debut) || !Number.isFinite(fin) || !Number.isFinite(ecrit)) continue;
    if (fin < debut || ecrit < fin) continue;
    mesures.push({
      total_s: Math.round((ecrit - debut) / 1000),
      modele: recu.session?.modele ?? recu.session_verifiee?.modele ?? null,
      outil: recu.session?.outil ?? recu.session_verifiee?.outil ?? null,
    });
  }
  return mesures;
}
function dureeDuCas(cas) {
  const mesures = recusDuCas(cas);
  if (mesures.length === 0) return { duree: "aucune mesure pour ce cas", echantillon: "0 run ; aucune durée ne se promet" };
  const totaux = mesures.map((m) => m.total_s);
  const bas = Math.min(...totaux);
  const haut = Math.max(...totaux);
  const modeles = new Set(mesures.map((m) => m.modele).filter(Boolean)).size;
  const outils = new Set(mesures.map((m) => m.outil).filter(Boolean)).size;
  const reserves = [];
  if (modeles) reserves.push(`${modeles} modèle${modeles > 1 ? "s" : ""}`);
  if (outils) reserves.push(`${outils} outil${outils > 1 ? "s" : ""}`);
  reserves.push("gestes non comparés");
  const mesure = bas === haut ? dureeMin(bas) : `${dureeMin(bas)} à ${dureeMin(haut)}`;
  const fourchette = entierDe5(bas) === entierDe5(haut)
    ? `${entierDe5(bas)} min`
    : `${entierDe5(bas)} à ${entierDe5(haut)} min`;
  return {
    duree: `${fourchette}, ouverture et réponses comprises`,
    echantillon: `${mesures.length} run${mesures.length > 1 ? "s" : ""} ; mesuré ${mesure} (session + harnais) ; ${reserves.join(", ")}`,
  };
}

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
function blocFin({ etat, pieces, duree = null, echantillon = null, ensuite }) {
  ecrit([
    `▸ FIN — ${etat}`,
    `  pièces              : ${pieces}`,
    ...(duree ? [`  durée estimée       : ${duree}`] : []),
    ...(echantillon ? [`  échantillon         : ${echantillon}`] : []),
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
// The default case id is built from the skill's name. A file called `SKILL.md` names its folder, since
// « skill » distinguishes no case; every other file keeps its stem. The result is slugged before the
// domain check, because `basename(skill)` alone refused any uppercase name (`SKILL`, `PLAYBOOK`).
function slugDeSkill(skill) {
  const base = basename(skill);
  const nom = base.toLowerCase() === "skill.md" ? basename(dirname(skill)) : base.replace(/\.[^.]+$/, "");
  return nom.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
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
// La lecture d'un cas (ADR-061) : la pièce qui apparie un geste attendu à une mesure du reçu. Elle
// n'est pas dans le gel, et son absence n'est pas une erreur : le rapport technique s'écrit quand même,
// et l'absence de page utilisateur est dite.
function lectureDe(cas, cases) {
  const chemin = join(cases, `${cas}.lecture.json`);
  if (!existsSync(chemin)) return null;
  let lecture;
  try {
    lecture = JSON.parse(readFileSync(chemin, "utf8"));
  } catch {
    refuse(`orchestrer : la lecture ${chemin} est illisible — une page utilisateur ne s'invente pas`);
  }
  try {
    return verifierLecture(lecture, cas);
  } catch (e) {
    refuse(`${e.message} — ${chemin}`);
  }
}
function runParDefaut(cas, gel) {
  const alea = randomBytes(4).toString("hex").slice(0, 7);
  return join(DEPOT, "docs/device/runs", `${horodatage()}-${String(gel.empreinte).slice(0, 8)}-${alea}`);
}
// Les quatre arbres que le dispositif nomme déjà : ceux de tous les gels de --cases. Un terrain, ou un
// dossier de travail qui tombe dedans n'est pas un sujet de test, c'est le dispositif lui-même — et le
// cas fabriqué y écrirait (refus 3). Un skill n'est refusé que par sa destination : un arbre que le run
// écrit, ou le dépôt du dispositif (refus 2, ADR-080).
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
// Les arbres de label « travail » : ceux que la session écrira. Un skill qui y vit serait testé sur son
// propre terrain, et le run se confondrait avec ce qu'il mesure.
function arbresEcrits(cases) {
  if (!existsSync(cases)) return [];
  const chemins = [];
  for (const nom of readdirSync(cases)) {
    if (!nom.endsWith(".freeze.json")) continue;
    try {
      const gel = JSON.parse(readFileSync(join(cases, nom), "utf8"));
      for (const arbre of gel.arbres || []) if (arbre.label === "travail" && arbre.chemin) chemins.push(resolve(arbre.chemin));
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
  if (dedans(framework, [DEPOT])) {
    refuse(`cas : le skill vit dans le dépôt du dispositif (${framework}) — le dispositif se mesurerait lui-même ; rien ne s'écrit`);
  }
  if (dedans(framework, arbresEcrits(cases))) {
    refuse(`cas : le skill vit dans un arbre que le run écrit (${framework}) — la session y écrirait, et le test se confondrait avec son terrain ; rien ne s'écrit`);
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

  const idDonne = Object.prototype.hasOwnProperty.call(valeurs, "id");
  const slugSkill = slugDeSkill(skill);
  const id = option(valeurs, "id", { defaut: `${horodatage()}-${slugSkill}` });
  if (!idDonne && !slugSkill) usage(`cas : le chemin « ${skillDonne} » ne donne aucun nom de cas — passe --id <slug>`);
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
    // ADR-068 : the table is the only proof that the session showed before writing, so the request asks
    // for one. The case that does not want it declares `attendu_details.tableau.requis: false`.
    "Montre d'abord un tableau de ce que tu qualifies et où tu comptes écrire, puis attends mon accord sans avoir écrit un seul fichier.",
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

**À REMPLIR** : le chemin exact du produit, relatif à la racine du cas (\`attendu_details.produit.racine\` de l'attendu), par exemple \`terrain/aidd_docs\`.

Le produit doit se suffire : ce que la session cite comme preuve est dans le fichier produit, ou sous \`terrain/.scratch/\`, collecté en annexe ; un chemin volatil n'est pas une preuve (ADR-067).

## 7. Ce qui lui est interdit

Écrire dans \`framework-origin/\` et dans \`origine/\` ; lire sous \`docs/device/CASES/\` ; écrire hors de \`terrain/aidd_docs\` et de \`terrain/.scratch/\` (le scratch est collecté en annexe, jamais compté comme produit) ; sortir du répertoire de travail, ni dans le reste de \`$HOME\` ni dans \`/tmp\` ; toute écriture git, tout appel réseau ; écrire les fichiers de contexte d'outils IA.

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
    cloisonnement: {
      lecture: { autorisees: ["terrain", "framework-origin"] },
      ecriture: { autorisees: ["terrain/aidd_docs"], scratch: "terrain/.scratch" },
      reseau: "interdit",
      fichiers_de_contexte: "interdits",
    },
    attendu: "À REMPLIR — ce que la session doit faire, dans quel ordre, et la preuve de chaque geste.",
    attendu_details: {
      ordre: [],
      produit: { racine: null, regle: "À REMPLIR — un seul fichier par destination nommée", arbre_attendu: [] },
      tableau: { requis: true, forme: "un tableau Markdown, au moins une colonne" },
      pause: { requis: true },
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
  const sortiePreflight = harnaisOuRefus(
    ["preflight", "--case", cas, "--cases", cases, "--run", run, "--repertoire", repertoire, "--texte", cheminTexte],
    "aucune session ne s'ouvre sans porte : c'est la seule pièce qui distingue un run passé par la porte d'un run qui l'a sautée",
  );
  blocEtape({
    rang: 1, total: 1, titre: "la porte",
    fait: "écrire le texte substitué, puis autoriser l'ouverture dans l'arbre travail",
    commande: commandeHarnais(["preflight", "--case", cas, "--run", run, "--repertoire", repertoire, "--texte", cheminTexte]),
    attendu: "« preflight ok », un gate.json à la fin, et rien avant",
    obtenu: uneLigne(sortiePreflight),
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
    ...dureeDuCas(cas),
    ensuite: `orchestrer.mjs ouvrir --cas ${cas} --run ${run} (la session opencode s'ouvre par l'API et joue la pause), ou ouvrir le fil dans ${repertoire} et coller le texte, puis orchestrer.mjs suite --cas ${cas} --fil <id-du-fil>`,
  });
  process.exit(0);
}

// ---------------------------------------------------------------------------------------------
// ouvrir — la session par l'API d'opencode, et la pause jouée par le cas (spec 2026-10-22-000407).
// La commande lance `opencode serve`, envoie le texte que la porte a écrit — jamais une recopie —,
// et répond à chaque question par la réponse figée du cas puis par l'option marquée Recommandé. Elle
// n'écrit rien : le fil se dit, et la chaîne suite → fin reste la seule qui mesure.

class Refus extends Error {
  constructor(message) {
    super(message);
    this.name = "Refus";
  }
}

const dormir = (ms) => new Promise((fin) => setTimeout(fin, ms));

function portLibre() {
  return new Promise((ok, ko) => {
    const sonde = createServer();
    sonde.once("error", ko);
    sonde.listen(0, "127.0.0.1", () => {
      const { port } = sonde.address();
      sonde.close(() => ok(port));
    });
  });
}

function binaireOpencode() {
  const dirs = (process.env.PATH || "").split(":").filter(Boolean);
  return dirs.map((d) => join(d, "opencode")).find((c) => existsSync(c)) || null;
}

// Une seule requête, un seul refus : le serveur est celui d'opencode, son mot de passe vient de sa
// propre sortie, et rien ne se devine quand il ne répond pas.
async function requete(api, chemin, { methode = "GET", corps = null, motDePasse = null } = {}) {
  const entetes = {};
  if (corps !== null) entetes["content-type"] = "application/json";
  if (motDePasse) entetes.authorization = "Basic " + Buffer.from(`opencode:${motDePasse}`).toString("base64");
  let reponse;
  try {
    reponse = await fetch(api + chemin, {
      method: methode, headers: entetes, body: corps === null ? undefined : JSON.stringify(corps),
    });
  } catch (e) {
    throw new Refus(`${api}${chemin} ne répond pas (${e.cause ? e.cause.code : e.message}) — aucun serveur opencode à cette adresse`);
  }
  const texte = await reponse.text();
  let json = null;
  try {
    json = texte ? JSON.parse(texte) : null;
  } catch {
    json = null;
  }
  return { code: reponse.status, json };
}

async function demarrerServeur(binaire) {
  const port = await portLibre();
  const enfant = spawn(binaire, ["serve", "--hostname", "127.0.0.1", "--port", String(port)], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  let sortie = "";
  let erreur = null;
  enfant.on("error", (e) => {
    erreur = e;
  });
  const lire = (bloc) => {
    sortie += bloc.toString();
  };
  enfant.stdout.on("data", lire);
  enfant.stderr.on("data", lire);
  const arreter = () => {
    try {
      enfant.kill("SIGTERM");
    } catch {
      // déjà sorti : rien à arrêter
    }
  };
  const limite = Date.now() + 20000;
  while (Date.now() < limite) {
    if (erreur) throw new Refus(`${binaire} ne se lance pas (${erreur.code || erreur.message}) — aucune session ne s'ouvre sans serveur`);
    const url = sortie.match(/server listening on (http:\/\/\S+)/);
    const motDePasse = sortie.match(/server password (\S+)/);
    if (url && motDePasse) return { url: url[1], motDePasse: motDePasse[1], arreter };
    if (enfant.exitCode !== null) {
      arreter();
      throw new Refus(`opencode serve est sorti (code ${enfant.exitCode}) — ${uneLigne(sortie).slice(0, 200)}`);
    }
    await dormir(150);
  }
  arreter();
  throw new Refus(`opencode serve n'a annoncé ni son url ni son mot de passe en 20 s — ${uneLigne(sortie).slice(0, 200)}`);
}

async function envoyerTexte(api, fil, motDePasse, texte) {
  const envoi = await requete(api, `/api/session/${fil}/prompt`, { methode: "POST", motDePasse, corps: { text: texte } });
  if (envoi.code !== 200) {
    throw new Refus(`le message ne part pas (${envoi.code}) — ${uneLigne(JSON.stringify(envoi.json)).slice(0, 200)}`);
  }
  return envoi.json?.data?.time?.created ?? Date.now();
}

async function messagesDe(api, fil, motDePasse) {
  const liste = await requete(api, `/api/session/${fil}/message`, { motDePasse });
  if (liste.code !== 200 || !Array.isArray(liste.json?.data)) {
    throw new Refus(`les messages de ${fil} ne se lisent pas (${liste.code}) — sans eux, l'inactivité ne se constate pas`);
  }
  return liste.json.data;
}

function estInactive(messages, reference) {
  return messages.some((m) => m.type === "idle" && (m.time?.created ?? 0) >= reference);
}

// Une question n'a pas toujours la forme d'un formulaire : le modèle écrit sa demande et rend la main.
// La règle est mécanique et bornée — le dernier texte d'un message `assistant` postérieur à la
// référence, sa dernière ligne non vide hors bloc de code, terminée par `?`.
function derniereLigneHorsBloc(texte) {
  let dansBloc = false;
  let ligne = "";
  for (const brute of String(texte).split(/\r?\n/)) {
    if (/^\s*```/.test(brute)) {
      dansBloc = !dansBloc;
      continue;
    }
    if (!dansBloc && brute.trim() !== "") ligne = brute.trimEnd();
  }
  return ligne;
}

function derniereReponseEnTexte(messages, reference, dejaRepondu = null) {
  let dernier = null;
  for (const m of messages) {
    const role = m.type ?? m.info?.role ?? m.role;
    if (role !== "assistant" || m.id === dejaRepondu) continue;
    const cree = Number(m.time?.created ?? m.info?.time?.created);
    if (!Number.isFinite(cree) || cree < reference) continue;
    const parts = Array.isArray(m.parts) ? m.parts : Array.isArray(m.content) ? m.content : [];
    // Un rappel système ajouté par le client n'est pas un texte du modèle : le run 165953 s'est arrêté
    // sur un `<system-reminder>`, et il ne doit jamais devenir une question.
    const textes = parts.filter((p) => p && p.type === "text" && typeof p.text === "string"
      && !p.text.trimStart().startsWith("<system-reminder>"));
    const texte = textes.length ? textes[textes.length - 1].text : (typeof m.text === "string" ? m.text : "");
    if (texte.trim() === "") continue;
    if (!dernier || cree >= dernier.cree) dernier = { cree, texte, id: m.id ?? null };
  }
  if (!dernier) return null;
  const ligne = derniereLigneHorsBloc(dernier.texte);
  return ligne === "" ? null : { ligne, id: dernier.id };
}


// La règle de la spec §5 : l'option marquée Recommandé, sinon la première ; un tableau quand le champ
// en est un ; le défaut d'un booléen ou d'un nombre ; et le refus pour tout le reste, parce qu'un texte
// tapé à la place d'une personne n'est pas une réponse figée.
function repondreAuFormulaire(formulaire) {
  const answer = {};
  const choix = [];
  for (const champ of formulaire.fields || []) {
    const cle = champ.key || champ.name;
    if (!cle) throw new Refus(`le formulaire ${formulaire.id} a un champ sans clé — la réponse ne s'invente pas`);
    const options = champ.options || [];
    if (options.length) {
      const preferee = options.find((o) => /recommand|recommended/i.test(`${o.label ?? ""} ${o.value ?? ""}`)) || options[0];
      const valeur = preferee.value ?? preferee.label;
      answer[cle] = champ.type === "array" ? [valeur] : valeur;
      choix.push(`${cle} = ${uneLigne(valeur)}`);
      continue;
    }
    if (champ.default !== undefined && ["boolean", "number", "integer"].includes(champ.type)) {
      answer[cle] = champ.default;
      choix.push(`${cle} = ${champ.default} (défaut du champ)`);
      continue;
    }
    throw new Refus(`le formulaire ${formulaire.id} demande « ${cle} » sans option ni défaut — la commande ne tape pas un texte à la place d'une personne`);
  }
  return { corps: { answer }, choix };
}

async function commandeOuvrir(argv) {
  const valeurs = litOptions(argv, {
    cas: "valeur", run: "valeur", cases: "valeur", api: "valeur", modele: "valeur", delai: "valeur",
  });
  const cases = casesDir(valeurs);
  const cas = option(valeurs, "cas", { requis: true, question: "l'identifiant du cas" });
  const minutesTexte = option(valeurs, "delai", { defaut: "30" });
  const minutes = Number(minutesTexte);
  if (!Number.isInteger(minutes) || minutes < 1) usage(`--delai « ${minutesTexte} » hors domaine : un entier de minutes, au moins 1`);
  const modeleTexte = option(valeurs, "modele", { defaut: null });
  let modele = null;
  if (modeleTexte !== null) {
    const coupe = modeleTexte.indexOf("/");
    if (coupe < 1 || coupe === modeleTexte.length - 1) usage(`--modele « ${modeleTexte} » hors domaine : <fournisseur>/<modèle>`);
    modele = { providerID: modeleTexte.slice(0, coupe), id: modeleTexte.slice(coupe + 1) };
  }
  const apiDonne = option(valeurs, "api", { defaut: null });
  if (apiDonne !== null && !/^https?:\/\/\S+$/.test(apiDonne)) usage(`--api « ${apiDonne} » hors domaine : une url http(s), sans chemin`);

  const gel = gelDe(cas, cases);
  const run = runExiste(cas, valeurs);
  const attendu = expectedDe(cas, cases);
  const reponses = ((attendu.demande || {}).reponses_figees || []).filter((r) => typeof r === "string" && r.trim());
  // D5 de l'audit du 2026-10-24 : la règle d'ADR-077 protège une pause qui existe. Un cas qui déclare
  // `pause.requis: false` ne pause pas : zéro question est sa clôture normale, et une question qu'il
  // n'attend pas se refuse. Un cas antérieur, sans ce bloc, garde le comportement d'avant (requis).
  const pauseDeclaree = (attendu.attendu_details || {}).pause;
  const pauseRequise = !(pauseDeclaree && typeof pauseDeclaree === "object" && pauseDeclaree.requis === false);

  let code = 0;
  let serveur = null;
  try {
    const porte = join(run, "gate.json");
    if (!existsSync(porte)) throw new Refus(`aucune porte ${porte} — une session s'ouvre après preflight, jamais avant`);
    const gate = JSON.parse(readFileSync(porte, "utf8"));
    if (gate.cas !== cas) throw new Refus(`la porte ${porte} est celle du cas ${gate.cas}, pas de ${cas} — deux runs ne se mélangent pas`);
    const cheminTexte = join(run, "texte-a-remettre.txt");
    if (!existsSync(cheminTexte)) throw new Refus(`${cheminTexte} est absent — le texte de la porte est la seule chose que la session reçoit`);
    const octets = readFileSync(cheminTexte);
    const sha = createHash("sha256").update(octets).digest("hex");
    const shaPorte = (gate.texte || {}).sha256;
    if (shaPorte !== sha) {
      throw new Refus(`${cheminTexte} n'est plus le texte que la porte a écrit (sha256 ${sha.slice(0, 8)} contre ${String(shaPorte).slice(0, 8)}) — la session ne reçoit pas un texte que la porte n'a pas autorisé`);
    }
    const geleTravail = (gel.arbres || []).find((t) => t.label === "travail");
    if (!geleTravail) throw new Refus(`le gel de ${cas} ne nomme aucun arbre « travail » — la session n'a pas de dépôt où écrire`);
    const travail = resolve(geleTravail.chemin);
    if (!existsSync(travail)) throw new Refus(`l'arbre travail ${travail} n'existe pas — le gel le nomme, il ne le crée pas`);
    if (pauseRequise && !reponses.length) {
      throw new Refus(`l'attendu de ${cas} ne fige aucune réponse (demande.reponses_figees) — sans elles, la pause se jouerait à la main, et c'est ce que cette commande retire`);
    }

    let api;
    let motDePasse = null;
    if (apiDonne !== null) {
      api = apiDonne.replace(/\/+$/, "");
      motDePasse = process.env.OPENCODE_SERVER_PASSWORD || null;
    } else {
      const binaire = binaireOpencode();
      if (!binaire) throw new Refus("opencode est introuvable dans le PATH — sans serveur, aucune session ne s'ouvre ; installer opencode, ou nommer --api");
      serveur = await demarrerServeur(binaire);
      api = serveur.url;
      motDePasse = serveur.motDePasse;
    }

    const creation = await requete(api, "/api/session", {
      methode: "POST",
      motDePasse,
      corps: {
        title: `run ${cas}`,
        location: { directory: travail },
        agent: "build",
        ...(modele ? { model: modele } : {}),
      },
    });
    if (creation.code !== 200 || !creation.json?.data?.id) {
      throw new Refus(`la session ne s'ouvre pas (${creation.code}) — ${uneLigne(JSON.stringify(creation.json)).slice(0, 200)}`);
    }
    const fil = creation.json.data.id;
    const m = creation.json.data.model;
    const modeleReel = m ? `${m.providerID}/${m.id}` : "choisi par le serveur";

    let reference = await envoyerTexte(api, fil, motDePasse, octets.toString("utf8"));
    const jouees = [];
    let dejaRepondu = null;
    const limite = Date.now() + minutes * 60000;
    for (;;) {
      const attente = await requete(api, `/api/session/${fil}/form`, { motDePasse });
      if (attente.code !== 200 || !Array.isArray(attente.json?.data)) {
        throw new Refus(`les formulaires de ${fil} ne se lisent pas (${attente.code}) — la question ne se devine pas`);
      }
      const formulaire = attente.json.data[0];
      if (formulaire) {
        if (!pauseRequise) {
          throw new Refus(`la session a posé une question (formulaire ${formulaire.id}) alors que ${cas} déclare pause.requis: false — le cas n'en attend aucune`);
        }
        if (jouees.length >= reponses.length) {
          throw new Refus(`la session a posé ${jouees.length + 1} question(s) et ${cas} n'en fige que ${reponses.length} — la suivante se fige dans l'attendu, jamais à la volée`);
        }
        // Le champ se remplit d'abord : un formulaire que la règle ne sait pas remplir se refuse
        // avant qu'un message de plus parte vers la session.
        const reponse = repondreAuFormulaire(formulaire);
        reference = await envoyerTexte(api, fil, motDePasse, reponses[jouees.length]);
        const envoi = await requete(api, `/api/session/${fil}/form/${formulaire.id}/reply`, {
          methode: "POST", motDePasse, corps: reponse.corps,
        });
        if (envoi.code !== 204) {
          throw new Refus(`le formulaire ${formulaire.id} refuse la réponse (${envoi.code}) — ${uneLigne(JSON.stringify(envoi.json)).slice(0, 200)}`);
        }
        jouees.push({ reponse: reponses[jouees.length], choix: reponse.choix });
        continue;
      }
      const messages = await messagesDe(api, fil, motDePasse);
      if (estInactive(messages, reference)) {
        const texte = derniereReponseEnTexte(messages, reference, dejaRepondu);
        if (!texte) break;
        const question = texte.ligne.endsWith("?") ? texte : null;
        if (!question) {
          // ADR-077 : une session arrêtée sur un texte qui ne demande rien n'est pas un run fini.
          // Tant qu'AUCUNE réponse figée n'a été jouée, la tenir pour un succès effacerait la pause.
          // ADR-089 : après une réponse jouée, la session a passé la question et peut légitimement
          // finir sur son dernier message ; exiger la seconde réponse figée refusait une clôture
          // normale. Le texte n'est donc plus un refus dès la première réponse jouée.
          // ADR-093 : un cas qui ne déclare aucune pause se clôt sans question, même après zéro réponse.
          if (!pauseRequise || jouees.length > 0) break;
          throw new Refus(`la session ${fil} s'est arrêtée sans question après ${jouees.length} réponse(s) jouée(s) : dernière ligne « ${uneLigne(texte.ligne).slice(0, 80)} » — réponds à la main, puis « suite --fil ${fil} » ; le run n'est pas un succès à zéro question`);
        }
        if (!pauseRequise) {
          throw new Refus(`la session a posé une question « ${uneLigne(texte.ligne).slice(0, 80)} » alors que ${cas} déclare pause.requis: false — le cas n'en attend aucune`);
        }
        if (jouees.length >= reponses.length) {
          throw new Refus(`la session a posé ${jouees.length + 1} question(s) et ${cas} n'en fige que ${reponses.length} — la suivante se fige dans l'attendu, jamais à la volée`);
        }
        const indice = jouees.length;
        reference = await envoyerTexte(api, fil, motDePasse, reponses[indice]);
        dejaRepondu = question.id;
        jouees.push({ reponse: reponses[indice], choix: ["texte"], forme: "texte", question: question.ligne });
        continue;
      }
      if (Date.now() > limite) {
        throw new Refus(`la session ${fil} n'est pas devenue inactive en ${minutes} min — elle est peut-être encore vivante, et rien ne se conclut d'un tour inachevé ; le fil reste lisible par « suite --fil ${fil} »`);
      }
      await dormir(2000);
    }

    blocEtape({
      rang: 1, total: 1, titre: "la session",
      fait: `ouvrir la session opencode dans ${travail}, envoyer le texte de la porte, jouer la pause`,
      commande: serveur ? `opencode serve --hostname 127.0.0.1 --port ${String(serveur.url).split(":").pop()}` : `--api ${api}`,
      attendu: pauseRequise
        ? `un fil, ${jouees.length} question(s) jouée(s), et une session inactive`
        : "un fil, 0 question attendue, et une session inactive",
      obtenu: `${fil} ; ${jouees.length} question(s) ; modèle ${modeleReel} ; inactive`,
      lit: "chaque réponse envoyée vient du cas : la pause n'a plus de geste à la main, et la trace la portera",
    });
    ecrit([
      "Les réponses envoyées, dans l'ordre (le cas joue la pause, la personne ne la joue plus) :",
      ...jouees.map((j, i) => `  ${i + 1}. ${uneLigne(j.reponse).slice(0, 90)} => ${j.forme === "texte" ? `texte, question « ${uneLigne(j.question).slice(0, 60)} »` : j.choix.join(", ")}`),
      "",
      "Ce que ouvrir n'atteste pas : qui a conduit le run. suite le déclare par --conduite agent|humain, et le reçu le recopie sans le vérifier.",
      "",
    ]);
    blocFin({
      etat: pauseRequise
        ? `session ${fil} inactive après ${jouees.length} question(s) — le run s'arrête là, et rien n'est encore mesuré`
        : `session ${fil} inactive après 0 question attendue — le cas ne déclare aucune pause, et rien n'est encore mesuré`,
      pieces: `aucune : ouvrir n'écrit rien ; le run tient à ${join(run, "gate.json")}`,
      ensuite: `orchestrer.mjs suite --cas ${cas} --run ${run} --fil ${fil} --par « qui a réellement conduit le run » --conduite agent`,
    });
  } catch (e) {
    if (!(e instanceof Refus)) throw e;
    console.error("REFUS — " + e.message);
    code = 1;
  } finally {
    if (serveur) serveur.arreter();
  }
  process.exit(code);
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
function essaiFreebuff(fil) {
  if (spawnSync("sqlite3", ["--version"], { encoding: "utf8" }).status !== 0) {
    return { ok: false, raison: "sqlite3 est absent, donc aucune base Freebuff ne se lit" };
  }
  for (const base of basesDuClient()) if (filDansBase(base, fil)) return { ok: true, base };
  return { ok: false, raison: `aucune base sous ${join(process.env.HOME || "~", ".config/freebuff-desktop/projects")} ne porte ce fil` };
}
function essaiOpencode(fil, { store, cwd }) {
  try {
    sessionClient("opencode", fil, { store, cwd });
    return { ok: true };
  } catch (e) {
    return { ok: false, raison: e.message };
  }
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
    cas: "valeur", fil: "valeur", run: "valeur", par: "valeur", conduite: "valeur",
    produit: "valeur", "sans-produit": "drapeau", cases: "valeur", client: "valeur", store: "valeur",
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
  // Ce refus se lève avant tout appel client et avant toute écriture : un dossier qui porte déjà des faits
  // n'a rien à exporter, et le dire ne doit rien y ajouter.
  const faits = join(run, "faits.json");
  if (existsSync(faits)) refuse(`suite : ${faits} existe déjà — des faits écrits ne se réécrivent pas, ils se relisent`);
  // Une trace déjà écrite est une pièce : `suite` ne la remplace pas, comme `tracer` (ADR-083). Le refus
  // nomme son auteur, dérivé des seules pièces présentes et d'aucun fichier neuf : `tracer` est le seul à
  // écrire `trace/fil.json`, et `suite` écrit ses faits juste après sa trace. Une trace qui porte un
  // `fil.json` vient donc de `tracer` ; sans lui, c'est la trace d'un `suite` arrêté entre les deux. Ce
  // refus se lève avant tout appel client et avant toute écriture.
  const traceDeja = join(run, "trace", "echange.jsonl");
  const filDeja = join(run, "trace", "fil.json");
  if (existsSync(traceDeja)) {
    refuse(existsSync(filDeja)
      ? `suite : ${traceDeja} existe déjà — c'est une trace de run guidé, écrite par \`tracer\` (${filDeja} est là) ; une trace ne se réécrit pas, elle se relit`
      : `suite : ${traceDeja} existe déjà — aucun ${filDeja} : c'est la trace d'un \`suite\` arrêté avant ses faits ; la déplacer, puis relancer`);
  }
  const clientVoulu = option(valeurs, "client", { defaut: "auto", domaine: ["auto", "freebuff", "opencode"] });
  if (clientVoulu === "freebuff" && valeurs.store !== undefined) {
    refuse("suite : --client freebuff refuse --store — ce store est celui d'opencode, et un client n'a qu'une source (refus 18)");
  }
  const storeBrut = option(valeurs, "store", { defaut: process.env.HOME ? join(process.env.HOME, ".local/share/opencode") : "" });
  if (!storeBrut) refuse("suite : le store opencode se nomme par --store ou par HOME — sans lui, aucune session opencode ne se lit");
  const store = resolve(storeBrut);

  const geleTravail = (gel.arbres ?? []).find((t) => t.label === "travail");
  if (!geleTravail) refuse("suite : le gel ne nomme aucun arbre « travail » — le répertoire opencode ne se compare pas, et le produit n'a pas de source");
  const travail = resolve(geleTravail.chemin);

  let client;
  let base = null;
  if (clientVoulu === "freebuff") {
    const essai = essaiFreebuff(fil);
    if (!essai.ok) refuse(`suite : Freebuff ne connaît pas le fil « ${fil} » — ${essai.raison} ; ouvrir le fil d'abord, ou nommer le bon (refus 7)`);
    client = "freebuff";
    base = essai.base;
  } else if (clientVoulu === "opencode") {
    const essai = essaiOpencode(fil, { store, cwd: travail });
    if (!essai.ok) refuse(`suite : opencode ne connaît pas le fil « ${fil} » dans ${travail} — ${essai.raison} ; ouvrir la session d'abord, ou nommer la bonne (refus 7)`);
    client = "opencode";
  } else {
    const fb = essaiFreebuff(fil);
    const oc = essaiOpencode(fil, { store, cwd: travail });
    if (fb.ok && oc.ok) {
      refuse(`suite : le fil « ${fil} » existe dans les deux clients (Freebuff ${fb.base}, opencode ${store}) — un run a un client, et --client le nomme (refus 10)`);
    }
    if (!fb.ok && !oc.ok) {
      refuse(`suite : le fil « ${fil} » n'existe dans aucune base Freebuff, et opencode ne le connaît pas non plus — Freebuff : ${fb.raison} ; opencode : ${oc.raison} (refus 11)`);
    }
    client = fb.ok ? "freebuff" : "opencode";
    base = fb.ok ? fb.base : null;
  }

  const dossierTrace = join(run, "trace");
  const trace = join(dossierTrace, "echange.jsonl");
  const par = option(valeurs, "par", { defaut: process.env.USER || "operateur" });
  // ADR-071 : no default. A run's conduct is declared, and `ouvrir` conducting it means `agent`.
  const conduite = option(valeurs, "conduite", { requis: true, question: "qui a conduit le run", domaine: ["agent", "humain"] });

  // Le même fichier de travail que `tracer` ([ADR-083](DECISIONS.md)) : la trace ne prend son nom qu'une fois
  // relue, non vide et ligne par ligne du JSON. Un refus laisse le dossier du run exactement comme il était.
  const traceTravail = join(run, `.suite-${process.pid}.echange.jsonl`);
  const brutTravail = join(run, `.suite-${process.pid}.export-brut.json`);
  const nettoyerTravail = () => {
    for (const f of [traceTravail, brutTravail]) {
      try {
        rmSync(f, { force: true });
      } catch {
        /* un fichier de travail déjà absent ne retient pas le refus */
      }
    }
  };
  let exp;
  try {
    exp = exporterTraceClient(client, fil, client === "freebuff"
      ? { base, dest: traceTravail }
      : { store, cwd: travail, dest: traceTravail, brut: brutTravail });
    const contenu = readFileSync(traceTravail, "utf8");
    const lignes = contenu.split("\n").filter((l) => l.trim() !== "");
    if (!lignes.length) throw new Error(`suite : l'export de ${fil} est vide — une trace vide ne se cite pas`);
    lignes.forEach((l, i) => {
      try {
        JSON.parse(l);
      } catch {
        throw new Error(`suite : la ligne ${i + 1} de l'export n'est pas du JSON — la trace ne se cite pas`);
      }
    });
  } catch (e) {
    nettoyerTravail();
    blocRefus({ texte: e.message, empeche: "la trace lue par le reçu serait vide, et une trace vide ne mesure rien", geste: "rien : cette étape s'arrête ici" });
    process.exit(1);
  }
  mkdirSync(dossierTrace, { recursive: true });
  renameSync(traceTravail, trace);
  const brutFinal = join(dossierTrace, "export-brut.json");
  if (existsSync(brutTravail)) renameSync(brutTravail, brutFinal);
  nettoyerTravail();
  // La commande consignée rejoue l'export vers la pièce définitive, jamais vers le fichier de travail.
  exp.commande = String(exp.commande).split(traceTravail).join(trace).split(brutTravail).join(brutFinal);

  const argsFaits = ["faits", "--case", cas, "--cases", cases, "--client", client];
  if (client === "freebuff") argsFaits.push("--base", base);
  else argsFaits.push("--store", store);
  argsFaits.push("--fil", fil, "--trace", trace, "--out", faits, "--par", par, "--fin", dateIso(), "--conduite", conduite);
  const sortieFaits = harnaisOuRefus(
    argsFaits,
    "les faits sont ce que le reçu lira : un fait absent n'est pas un fait à remplir plus tard",
  );
  blocEtape({
    rang: 1, total: 3, titre: "la trace",
    fait: `dériver les faits du fil (${client}), puis exporter la trace par l'adaptateur du client`,
    commande: exp.commande,
    attendu: "un faits.json et un export non vides, dans le dossier du run",
    obtenu: sortieFaits,
    lit: "le reçu rejouera cet export par le même adaptateur : la pièce doit être exactement ce que le client rend",
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
  // ADR-067 : le scratch déclaré se collecte après le produit, sous annexe/<cas>/, et jamais dans
  // raw/<cas>/ : c'est une preuve exécutable, pas le produit. Un scratch absent ne fait pas échouer.
  let annexeCollecte = "";
  const attenduPath = join(cases, `${cas}.expected.json`);
  if (existsSync(attenduPath)) {
    const attenduCas = expectedDe(cas, cases);
    const scratch = attenduCas?.cloisonnement?.ecriture?.scratch;
    if (typeof scratch === "string" && scratch.trim() !== "") {
      const relatif = scratch.replace(/^\.?\//, "").replace(/^terrain\//, "");
      const sourceAnnexe = resolve(travail, relatif);
      if (!sourceAnnexe.startsWith(resolve(travail))) {
        refuse(`suite : le scratch ${scratch} sort de l'arbre travail — il ne se collecte pas (ADR-067)`);
      }
      // Un scratch vide n'est pas une preuve : `collect --annexe` refuse « rien à collecter », et le
      // run perdait alors la collecte de son produit pour un dossier que la session a créé sans y
      // écrire. Le dossier vide se saute, et le reçu dit qu'aucune annexe n'a été collectée.
      if (existsSync(sourceAnnexe) && contientUnFichier(sourceAnnexe)) {
        annexeCollecte = harnaisOuRefus(
          ["collect", "--run", run, "--case", cas, "--cases", cases, "--annexe", sourceAnnexe],
          "le scratch déclaré se collecte sous annexe/<cas>/ : sans lui, la preuve citée par le produit n'est pas dans le reçu (ADR-067)",
        );
      }
    }
  }
  // ADR-065 : le dernier message est la pièce que le juge lit, et il était transcrit à la main, sans
  // empreinte. Il se dérive maintenant de la trace exportée, et `faits.json` le cite : le reçu confronte
  // l'empreinte du fichier, puis son texte à la dernière part `text` d'un message assistant de la trace
  // qu'il rejoue. Un fichier déjà là est refusé : une transcription manuelle ne se remplace pas en silence.
  const dernier = join(run, "raw", cas, "last-message.md");
  if (existsSync(dernier)) {
    refuse(`suite : ${dernier} existe déjà — un dernier message transcrit à la main ne se remplace pas en silence ; le déplacer, puis relancer`);
  }
  const morceaux = readFileSync(trace, "utf8").split(/\r?\n/).filter((l) => l.trim() !== "").map((l) => {
    try {
      return JSON.parse(l);
    } catch {
      return null;
    }
  }).filter(Boolean);
  const dernierTexte = morceaux.filter((p) => p.role === "assistant" && p.kind === "text" && typeof p.text === "string").pop() ?? null;
  if (!dernierTexte) {
    refuse("suite : la trace exportée ne porte aucun texte d'assistant — sans dernier message, fin refuserait de toute façon, et rien ne s'invente");
  }
  mkdirSync(dirname(dernier), { recursive: true });
  writeFileSync(dernier, dernierTexte.text, "utf8");
  const faitsEcrits = JSON.parse(readFileSync(faits, "utf8"));
  faitsEcrits.dernier_message = {
    chemin: dernier,
    sha256: createHash("sha256").update(readFileSync(dernier)).digest("hex"),
    seq: dernierTexte.seq,
    ts: dernierTexte.ts,
  };
  writeFileSync(faits, JSON.stringify(faitsEcrits, null, 2) + "\n");
  blocEtape({
    rang: 2, total: 3, titre: "le dernier message",
    fait: `écrire ${dernier} depuis la dernière part \`text\` d'un message assistant de la trace`,
    commande: `suite --cas ${cas} --run ${run} … (le même geste, la pièce en plus)`,
    attendu: "un fichier dont le texte est celui de la trace, cité et haché dans faits.json",
    obtenu: `${dernierTexte.text.length} o, seq ${dernierTexte.seq} — sha256 dans faits.json`,
    lit: "le juge lit ce texte : il ne peut plus être une transcription libre que rien ne rattache à la trace",
  });
  blocEtape({
    rang: 3, total: 3, titre: "la copie",
    fait: "copier le produit sous raw/<cas>/, verbatim, avec ses empreintes",
    commande: commandeHarnais(["collect", "--run", run, "--case", cas, valeurs["sans-produit"] ? "--sans-produit" : "--from", valeurs["sans-produit"] ? "" : produit || "…"].filter(Boolean)),
    attendu: "raw/<cas>/ et un manifeste qui nomme chaque source",
    obtenu: [collecte, annexeCollecte].filter(Boolean).join(" ; "),
    lit: "la copie est ce que le reçu re-hache : un fichier touché après elle se verrait",
  });
  blocFin({
    etat: `le run ${cas} a ses quatre pièces (faits, trace, dernier message, copie) — il s'arrête là, la session est celle de la personne`,
    pieces: `${faits}, ${trace}, ${dernier}, ${join(run, "raw", cas)}`,
    ensuite: `orchestrer.mjs fin --cas ${cas} --run ${run} --difference « … » --phrase « … »`,
  });
  process.exit(0);
}

// ---------------------------------------------------------------------------------------------
// fin — le reçu d'abord, l'output ensuite, et le verdict proposé avec sa raison avant d'être écrit.

function commandeFin(argv) {
  const valeurs = litOptions(argv, {
    cas: "valeur", run: "valeur", difference: "valeur", phrase: "valeur", verdict: "valeur",
    limites: "valeur", juge: "valeur", rubrique: "valeur", cases: "valeur",
  });
  const cases = casesDir(valeurs);
  const cas = option(valeurs, "cas", { requis: true, question: "l'identifiant du cas" });
  const run = runExiste(cas, valeurs);
  // La lecture est vérifiée avant le reçu : une pièce mal formée ne doit pas coûter un run.
  const lecture = lectureDe(cas, cases);
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
  const juge = option(valeurs, "juge", { defaut: null });
  const rubrique = option(valeurs, "rubrique", { defaut: null });
  // Le reçu s'écrit une fois : nommer le juge après coup n'est plus possible une fois `receipt.json`
  // posé. Un `conforme` sans juge est donc refusé ici, avant la première pièce (D3).
  if (verdictDemande === "conforme" && (!juge || !rubrique)) {
    refuse(`fin : verdict « conforme » refusé — --juge et --rubrique sont requis avant que le reçu s'écrive : le reçu dit ce que la promesse est, pas qui l'a jugée (D3)`);
  }
  const attendu = expectedDe(cas, cases);
  const verifDeclaree = attendu.verification !== undefined || attendu.mutations !== undefined;
  const totalFin = verifDeclaree ? 3 : 2;

  // C7 : le cas déclare sa vérification, et `fin` la joue avant le reçu. Un refus du harnais qui a
  // laissé verification.json n'arrête pas la clôture : un test qui ne mord pas est un écart à juger,
  // pas un run à cacher. Un refus sans pièce arrête tout, parce qu'il n'y a alors rien à lire.
  let verification = null;
  if (verifDeclaree) {
    const sortieVerif = harnais(["verifier", "--run", run, "--case", cas, "--cases", cases]);
    const cheminVerif = join(run, "verification.json");
    if (!existsSync(cheminVerif)) {
      blocRefus({
        texte: sortieVerif.err || `verifier a refusé (exit ${sortieVerif.code}) sans écrire verification.json`,
        empeche: "le cas déclare une vérification, et aucune pièce ne dit ce que la commande a rendu : le reçu refuserait de conclure sur un produit supposé vérifié (C7)",
        geste: "corriger la déclaration ou la commande, puis relancer fin",
      });
      process.exit(1);
    }
    try {
      verification = JSON.parse(readFileSync(cheminVerif, "utf8"));
    } catch (e) {
      refuse(`fin : ${cheminVerif} n'est pas du JSON lisible (${e.message}) — la pièce de vérification ne se devine pas`);
    }
    blocEtape({
      rang: 1, total: totalFin, titre: "la vérification du produit",
      fait: "exécuter la commande du cas sur le produit collecté, puis sur chaque mutation déclarée",
      commande: commandeHarnais(["verifier", "--run", run, "--case", cas, "--cases", cases]),
      attendu: "une référence verte et aucun mutant survivant",
      obtenu: sortieVerif.code === 0 ? sortieVerif.out : (sortieVerif.err || sortieVerif.out),
      lit: verification.mord === true
        ? "chaque mutation déclarée a été tuée : le test écrit par le produit détecte au moins ces fautes"
        : "un mutant survit ou reste non évalué : le reçu refusera conforme, et l'écart reste jugeable",
    });
  }

  if (verdictDemande === null) {
    const aBlanc = harnais(["receipt", "--run", run, "--case", cas, "--cases", cases, "--faits", faits, "--verdict", "conforme", "--sans-ecrire"]);
    const propose = aBlanc.code === 0 ? "conforme" : "non concluant";
    const raison = aBlanc.code === 0
      ? "aucun falsificateur ne mord : le verdict peut dire conforme, et un écart sans morsure est refusé — la personne tranche"
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
      ensuite: propose === "conforme"
        ? `orchestrer.mjs fin --cas ${cas} --run ${run} --difference « … » --phrase « … » --verdict conforme --juge « … » --rubrique « P »`
        : `orchestrer.mjs fin --cas ${cas} --run ${run} --difference « … » --phrase « … » --verdict ${propose}`,
    });
    process.exit(0);
  }

  const cheminRapport = join(run, "RAPPORT.md");
  if (existsSync(cheminRapport)) {
    refuse(`fin : ${cheminRapport} existe déjà — un rapport ne doit pas rester à côté d'un reçu neuf ; le déplacer ou le nommer autrement, puis relancer`);
  }
  const cheminResultat = join(run, "RESULTAT.md");
  if (existsSync(cheminResultat)) {
    refuse(`fin : ${cheminResultat} existe déjà — le résultat d'un run ne se réécrit pas ; le déplacer, puis relancer`);
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
    rang: verifDeclaree ? 2 : 1, total: totalFin, titre: "le reçu",
    fait: "écrire le reçu unique du run, avec le verdict que la preuve autorise",
    commande: commandeHarnais(["receipt", "--run", run, "--case", cas, "--faits", faits, "--verdict", verdictDemande]),
    attendu: `un receipt.json de verdict « ${verdictDemande} », limites dites`,
    obtenu: sortieReceipt.out,
    lit: "le reçu relie la porte, la trace, la copie et le budget : c'est la pièce qu'on relit après",
  });
  const sortieCompare = harnais(["compare", "--run", run, "--case", cas, "--cases", cases,
    "--difference", difference, "--phrase", phrase, "--verdict", recu.verdict, "--limites", limites,
    ...(juge ? ["--juge", juge] : []), ...(rubrique ? ["--rubrique", rubrique] : [])]);
  if (sortieCompare.code !== 0) {
    blocRefus({
      texte: sortieCompare.err,
      empeche: "l'output du juge est la pièce qui dit ce que le run a montré : il se refuse sur un reçu absent ou un verdict qui le contredit",
      geste: "rien : cette étape s'arrête ici",
    });
    process.exit(1);
  }
  blocEtape({
    rang: totalFin, total: totalFin, titre: "l'output",
    fait: "écrire ce que le juge retient du run, à côté du reçu",
    commande: commandeHarnais(["compare", "--run", run, "--case", cas, "--difference", "…", "--phrase", "…", "--verdict", recu.verdict, "--limites", limites,
      ...(juge ? ["--juge", juge] : []), ...(rubrique ? ["--rubrique", rubrique] : [])]),
    attendu: "un output.json qui cite le reçu",
    obtenu: sortieCompare.out,
    lit: "l'output reprend le verdict du reçu : deux pièces, une seule décision",
  });
  let rapport;
  try {
    rapport = ecrireRapport({ runDir: run, cas, remplacer: false });
  } catch (e) {
    refuse(`${e.message} — le reçu et l'output sont écrits, la commande rapport peut les relire`);
  }
  let resultat = null;
  if (lecture) {
    try {
      resultat = ecrireResultat({ runDir: run, cas, attendu: expectedDe(cas, cases), lecture, remplacer: false });
    } catch (e) {
      refuse(`${e.message} — le reçu, l'output et le rapport sont écrits`);
    }
  }
  blocVerdict(recu, JSON.parse(readFileSync(join(run, "output.json"), "utf8")));
  blocFin({
    etat: `run ${cas} clos — ${recu.verdict}, rapport écrit${resultat ? ", page utilisateur écrite" : " (aucune lecture déclarée : pas de page utilisateur)"}`,
    pieces: [join(run, "receipt.json"), join(run, "output.json"), rapport.chemin, ...(resultat ? [resultat.chemin] : [])].join(", "),
    ensuite: `orchestrer.mjs lire --cas ${cas} --run ${run}`,
  });
  process.exit(0);
}

// ---------------------------------------------------------------------------------------------
// tracer — la trace machine d'un run guidé (ADR-076). Elle exporte le fil par la frontière des
// clients et écrit deux pièces sous trace/ : l'export normalisé et ce qu'il faut pour le citer.
const isoDepuisMs = (ms) => {
  const r = spawnSync("date", ["-d", "@" + Math.floor(Number(ms) / 1000), "-Is"], { encoding: "utf8" });
  return (r.stdout || "").trim() || String(ms);
};

function commandeTracer(argv) {
  const valeurs = litOptions(argv, {
    run: "valeur", fil: "valeur", client: "valeur", store: "valeur", liste: "drapeau", depuis: "valeur", jusqu: "valeur",
  });
  const run = resolve(option(valeurs, "run", { requis: true, question: "le dossier du run guidé" }));
  if (!existsSync(run) || !statSync(run).isDirectory()) {
    refuse(`tracer : ${run} n'est pas un dossier — la trace s'écrit dans un dossier de run guidé, jamais dans un chemin inventé`);
  }
  const cheminRun = join(run, "run.json");
  if (!existsSync(cheminRun)) {
    refuse(`tracer : ${run} n'a pas run.json — la trace se lit par run.json.pieces, jamais par un motif de nom`);
  }
  let decl;
  try {
    decl = JSON.parse(readFileSync(cheminRun, "utf8"));
  } catch {
    refuse(`tracer : ${cheminRun} n'est pas du JSON — un run.json se lit ou se refuse`);
  }
  if (decl.mode !== "guide") {
    refuse(`tracer : ${run} a le mode « ${decl.mode} » — tracer ne lit qu'un run guidé`);
  }
  if (!Array.isArray(decl.pieces) || !decl.pieces.includes("run-guide.md")) {
    refuse(`tracer : ${run} ne cite pas run-guide.md dans pieces — la spec du run guidé le nomme`);
  }
  if (!existsSync(join(run, "run-guide.md"))) {
    refuse(`tracer : ${run}/run-guide.md est absent — pieces le cite, le fichier manque`);
  }
  const clientVoulu = option(valeurs, "client", { defaut: "auto", domaine: ["auto", "freebuff", "opencode"] });
  const storeBrut = option(valeurs, "store", { defaut: process.env.HOME ? join(process.env.HOME, ".local/share/opencode") : "" });
  if (!storeBrut) refuse("tracer : le store opencode se nomme par --store ou par HOME — sans lui, aucune session opencode ne se lit");
  const store = resolve(storeBrut);
  const cwd = toplevel(run) ?? run;

  if (valeurs.liste) {
    if (valeurs.fil !== undefined) usage("tracer : --liste et --fil s'excluent — une liste ne choisit pas un fil");
    if (valeurs.jusqu !== undefined) usage("tracer : --jusqu ne s'emploie pas avec --liste — la liste borne par le bas seulement");
    const depuis = option(valeurs, "depuis", { requis: true, question: "l'instant de départ de la liste (ISO 8601)" });
    const ms = Date.parse(depuis);
    if (!Number.isFinite(ms)) usage(`tracer : --depuis « ${depuis} » hors domaine : un instant ISO 8601`);
    const bases = basesDuClient();
    if (!bases.length) refuse(`tracer : aucune base Freebuff sous ${join(process.env.HOME || "~", ".config/freebuff-desktop/projects")} — --liste lit le client, elle ne le devine pas`);
    const fils = [];
    for (const base of bases) {
      let lus;
      try {
        lus = filsFreebuff(ms, { base });
      } catch (e) {
        refuse(`tracer : ${e.message}`);
      }
      for (const f of lus) fils.push(f);
    }
    fils.sort((a, b) => Number(b.activite) - Number(a.activite));
    ecrit([
      `▸ FILS — ${fils.length} actifs depuis ${depuis}`,
      ...(fils.length
        ? fils.map((f) => `  ${f.id}  ${f.modele ?? "(sans modèle)"}  ${f.messages} message(s)  actif ${isoDepuisMs(f.activite)}  créé ${isoDepuisMs(f.created_at)}`)
        : ["  aucun fil actif depuis cette date"]),
      "  aucun contenu de message n'est imprimé",
      "",
    ]);
    process.exit(0);
  }

  // La fenêtre ne vaut que pour l'export : la liste, elle, borne sur l'activité du fil.
  const depuisBrut = Object.prototype.hasOwnProperty.call(valeurs, "depuis") ? valeurs.depuis : null;
  const jusquBrut = Object.prototype.hasOwnProperty.call(valeurs, "jusqu") ? valeurs.jusqu : null;
  const instant = (brut, nom) => {
    if (brut === null) return null;
    const ms = Date.parse(brut);
    if (!Number.isFinite(ms)) usage(`tracer : --${nom} « ${brut} » hors domaine : un instant ISO 8601`);
    return ms;
  };
  const depuisMs = instant(depuisBrut, "depuis");
  const jusquMs = instant(jusquBrut, "jusqu");
  if (depuisMs !== null && jusquMs !== null && jusquMs <= depuisMs) {
    refuse("tracer : --jusqu ne suit pas --depuis : une fenêtre vide ne se borne pas");
  }

  const fil = option(valeurs, "fil", { requis: true, question: "l'identifiant du fil" });
  // Le run déclare son fil ; `tracer` ne l'écrit jamais et ne le remplace pas. Un désaccord se refuse,
  // parce qu'une trace rattachée au mauvais fil est une pièce qui ne prouve pas ce qu'elle prétend.
  if (typeof decl.fil === "string" && decl.fil !== fil) {
    refuse(`tracer : ${run} nomme le fil « ${decl.fil} », pas « ${fil} » — la trace se rattache au fil que le run déclare`);
  }
  if (decl.fil !== undefined && decl.fil !== null && typeof decl.fil !== "string") {
    refuse(`tracer : ${run}/run.json porte un fil qui n'est pas une chaîne — le fil du run se nomme ou reste null`);
  }
  const trace = join(run, "trace", "echange.jsonl");
  const filJson = join(run, "trace", "fil.json");
  if (existsSync(trace) || existsSync(filJson)) {
    refuse(`tracer : ${existsSync(trace) ? trace : filJson} existe déjà — une trace ne se réécrit pas, elle se relit`);
  }
  let client;
  let base = null;
  if (clientVoulu === "freebuff") {
    const essai = essaiFreebuff(fil);
    if (!essai.ok) refuse(`tracer : Freebuff ne connaît pas le fil « ${fil} » — ${essai.raison} ; nommer le bon fil (refus 7)`);
    client = "freebuff";
    base = essai.base;
  } else if (clientVoulu === "opencode") {
    const essai = essaiOpencode(fil, { store, cwd });
    if (!essai.ok) refuse(`tracer : opencode ne connaît pas le fil « ${fil} » — ${essai.raison} ; nommer la bonne session (refus 7)`);
    client = "opencode";
  } else {
    const fb = essaiFreebuff(fil);
    const oc = essaiOpencode(fil, { store, cwd });
    if (fb.ok && oc.ok) {
      refuse(`tracer : le fil « ${fil} » existe dans les deux clients (Freebuff ${fb.base}, opencode ${store}) — un fil a un client, et --client le nomme (refus 10)`);
    }
    if (!fb.ok && !oc.ok) {
      refuse(`tracer : le fil « ${fil} » n'existe dans aucune base Freebuff, et opencode ne le connaît pas non plus — Freebuff : ${fb.raison} ; opencode : ${oc.raison} (refus 11)`);
    }
    client = fb.ok ? "freebuff" : "opencode";
    base = fb.ok ? fb.base : null;
  }

  let sess;
  try {
    sess = sessionClient(client, fil, client === "freebuff" ? { base } : { store, cwd });
  } catch (e) {
    refuse(`tracer : ${e.message}`);
  }
  // Un refus ne laisse aucune pièce : l'export s'écrit dans un fichier de travail, et ne prend son nom
  // définitif qu'une fois relu, non vide et ligne par ligne du JSON. Le renommage reste dans le dossier
  // du run, donc sur le même système de fichiers que `trace/`.
  const dossierTrace = join(run, "trace");
  const traceTravail = join(run, `.tracer-${process.pid}.echange.jsonl`);
  const brutTravail = join(run, `.tracer-${process.pid}.export-brut.json`);
  const nettoyerTravail = () => {
    for (const f of [traceTravail, brutTravail]) {
      try {
        rmSync(f, { force: true });
      } catch {
        /* un fichier de travail déjà absent ne retient pas le refus */
      }
    }
  };
  let exp;
  let lignes;
  let lues;
  try {
    exp = exporterTraceClient(client, fil, client === "freebuff"
      ? { base, dest: traceTravail, depuis: depuisMs, jusqu: jusquMs }
      : { store, cwd, dest: traceTravail, brut: brutTravail, depuis: depuisMs, jusqu: jusquMs });
    const contenu = readFileSync(traceTravail, "utf8");
    lignes = contenu.split("\n").filter((l) => l.trim() !== "");
    if (!lignes.length) throw new Error(`tracer : l'export de ${fil} est vide — une trace vide ne se cite pas`);
    lues = lignes.map((l, i) => {
      try {
        return JSON.parse(l);
      } catch {
        throw new Error(`tracer : la ligne ${i + 1} de l'export n'est pas du JSON — la trace ne se cite pas`);
      }
    });
  } catch (e) {
    nettoyerTravail();
    refuse(String(e.message).startsWith("tracer : ") ? e.message : `tracer : ${e.message}`);
  }
  mkdirSync(dossierTrace, { recursive: true });
  renameSync(traceTravail, trace);
  const brutFinal = join(dossierTrace, "export-brut.json");
  if (existsSync(brutTravail)) renameSync(brutTravail, brutFinal);
  nettoyerTravail();
  // La commande consignée rejoue l'export vers la pièce définitive, jamais vers le fichier de travail.
  exp.commande = String(exp.commande).split(traceTravail).join(trace).split(brutTravail).join(brutFinal);
  const premier = { seq: lues[0].seq ?? null, ts: lues[0].ts ?? null };
  const dernier = { seq: lues[lues.length - 1].seq ?? null, ts: lues[lues.length - 1].ts ?? null };
  const piece = {
    type: "fil",
    client,
    application: sess.application ?? null,
    identifiant: sess.identifiant ?? fil,
    modele: sess.modele ?? null,
    dossier: run,
    exporte_le: dateIso(),
    lignes: lignes.length,
    premier,
    dernier,
    fenetre: depuisMs === null && jusquMs === null ? null : { depuis: depuisBrut, jusqu: jusquBrut, premier, dernier },
    trace: { chemin: trace, sha256: exp.sha256, lignes: lignes.length, source: exp.source, commande: exp.commande },
  };
  writeFileSync(filJson, JSON.stringify(piece, null, 2) + "\n", "utf8");
  ecrit([
    `▸ TRACE — ${fil}`,
    `  fichier             : ${trace}`,
    `  empreinte           : ${exp.sha256} (${lignes.length} ligne(s))`,
    ...(depuisMs === null && jusquMs === null
      ? []
      : [`  fenêtre             : ${depuisBrut ?? "(début)"} → ${jusquBrut ?? "(fin)"}`]),
    `  source              : ${client}, ${sess.modele ?? "(modèle non nommé)"}`,
    "  à lire ensuite      : remplir le §5 bis du run-guide et citer les seq",
    "",
  ]);
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

function commandeRapport(argv) {
  const valeurs = litOptions(argv, { cas: "valeur", run: "valeur", remplacer: "drapeau", cases: "valeur" });
  const cas = option(valeurs, "cas", { requis: true, question: "l'identifiant du cas" });
  const run = runExiste(cas, valeurs);
  try {
    const remplacer = valeurs.remplacer === true;
    // La lecture est vérifiée avant le rapport : un refus ne doit laisser aucune pièce derrière lui.
    const lecture = lectureDe(cas, casesDir(valeurs));
    const rapport = ecrireRapport({ runDir: run, cas, remplacer });
    ecrit([`▸ RAPPORT — ${rapport.chemin}`, `  verdict             : ${rapport.verdict}`, ""]);
    if (lecture) {
      const resultat = ecrireResultat({ runDir: run, cas, attendu: expectedDe(cas, casesDir(valeurs)), lecture, remplacer });
      ecrit([`▸ RESULTAT — ${resultat.chemin}`, `  pour la personne     : ce que le run a montré, et ce qu'elle peut décider`, ""]);
    } else {
      ecrit(["▸ RESULTAT — aucun", "  le cas ne déclare aucune lecture : aucune page utilisateur ne s'invente", ""]);
    }
  } catch (e) {
    refuse(e.message);
  }
  process.exit(0);
}

// ---------------------------------------------------------------------------------------------

const [commande, ...reste] = process.argv.slice(2);
const COMMANDES = {
  cas: commandeCas, porte: commandePorte, ouvrir: commandeOuvrir, suite: commandeSuite,
  fin: commandeFin, lire: commandeLire, rapport: commandeRapport, tracer: commandeTracer,
};
if (!commande || commande === "--help" || commande === "-h") {
  process.stdout.write(USAGE + "\n");
  process.exit(commande ? 0 : 2);
}
if (!COMMANDES[commande]) usage(`commande inconnue « ${commande} » : ${Object.keys(COMMANDES).join(" | ")}`);
// `ouvrir` rend une promesse : elle s'attend ici, une seule fois, pour que son refus sorte en 1 et
// que le serveur qu'elle a lancé soit arrêté avant la sortie.
await COMMANDES[commande](reste);
