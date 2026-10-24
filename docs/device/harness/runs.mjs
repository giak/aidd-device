#!/usr/bin/env node
// runs — un run, un dossier : classification et index (spec du 2026-10-23 08:22).
// Aucun réseau, aucune session : il lit un dossier de runs et écrit son INDEX.md.
// Un `correction.json` dans un dossier de reçu lie la note qui corrige le verdict ; l'index montre le
// verdict du reçu et le verdict retenu, et le reçu n'est jamais réécrit.
// `--runs` lit un autre dossier que docs/device/runs/, pour le banc.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEPOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const DEFAUT = join(DEPOT, "docs/device/runs");
const ENTETE = "<!-- généré par runs.mjs — ne pas éditer -->";
const MODES = ["guide", "manuel"];
const STATUTS = ["forme tenue", "forme non tenue", "non observé"];
const VERDICTS = ["conforme", "ecart", "non concluant"];
const CORRECTION = "correction.json";
const CODES = new Set([
  "session_non_independante", "trace_absente", "terrain_non_propre", "attendu_non_gele",
  "revision_non_consignee", "run_non_observe", "protocole_anterieur",
]);

const refuse = (m) => {
  console.error(`runs : ${m}`);
  process.exit(1);
};
const usage = (m) => {
  console.error(`runs : ${m}\nusage : node docs/device/harness/runs.mjs --verifier|--index [--runs <dossier>]`);
  process.exit(2);
};
const texte = (v) => typeof v === "string" && v.trim() !== "";
const iso = (v) => v === null || (typeof v === "string" && Number.isFinite(Date.parse(v)));
const piecePropre = (p) => texte(p) && !p.includes("..") && !p.startsWith("/") && !p.split("/").includes("");
const cellule = (v) => String(v).replace(/\|/g, "\\|");

let action = null;
let runs = DEFAUT;
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--verifier" || args[i] === "--index") {
    if (action) usage("une seule action : --verifier ou --index");
    action = args[i];
  } else if (args[i] === "--runs") {
    if (i + 1 >= args.length) usage("--runs attend un dossier");
    runs = resolve(args[++i]);
  } else {
    usage(`option inconnue : ${args[i]}`);
  }
}
if (!action) usage("il faut --verifier ou --index");
if (!existsSync(runs) || !statSync(runs).isDirectory()) {
  refuse(`${runs} n'est pas un dossier — un index se lit dans un dossier de runs`);
}

function validerRun(nom, r, dir) {
  if (r.type !== "run") refuse(`${nom} : run.json n'a pas type « run » — un run.json se reconnaît à son type`);
  if (!MODES.includes(r.mode)) refuse(`${nom} : mode « ${r.mode} » hors domaine — guide ou manuel`);
  if (!STATUTS.includes(r.statut)) refuse(`${nom} a un statut hors des trois — forme tenue, forme non tenue, non observé`);
  if (r.verdict !== null) refuse(`${nom} : run.json porte un verdict — un guidé n'atteste pas ce qu'il n'a pas`);
  if (!["agent", "humain"].includes(r.conduite)) refuse(`${nom} : conduite « ${r.conduite} » hors domaine — agent ou humain`);
  if (!iso(r.rapport_le) || !iso(r.consigne_le)) refuse(`${nom} : rapport_le ou consigne_le n'est pas ISO 8601`);
  if (r.mode === "guide" && (!r.skill || !r.terrain)) {
    refuse(`${nom} : skill et terrain sont requis pour un guidé`);
  }
  if (r.skill !== null && r.skill !== undefined) {
    if (!texte(r.skill.nom) || !texte(r.skill.chemin) || !(r.skill.revision === null || texte(r.skill.revision))) {
      refuse(`${nom} : skill incomplet — nom, chemin et revision`);
    }
  }
  if (r.terrain !== null && r.terrain !== undefined) {
    if (!texte(r.terrain.chemin) || !texte(r.terrain.tete) || typeof r.terrain.porcelain !== "string") {
      refuse(`${nom} : terrain incomplet — chemin, tete, porcelain`);
    }
  }
  if (!Array.isArray(r.limites) || r.limites.length === 0) {
    refuse(r.mode === "guide"
      ? `${nom} est guidé sans limite — un guidé qui ne dit pas ce qu'il ne prouve pas ne se consigne pas`
      : `${nom} : limites est vide — un run se consigne avec ses limites`);
  }
  for (const [i, l] of r.limites.entries()) {
    if (!l || !texte(l.code) || !texte(l.effet) || !texte(l.detail)) {
      refuse(`${nom} : limite ${i + 1} incomplète — code, effet, detail`);
    }
    if (!CODES.has(l.code)) refuse(`${nom} : code de limite inconnu : ${l.code}`);
  }
  const codes = new Set(r.limites.map((l) => l.code));
  if (!r.pertinence || typeof r.pertinence.comme_preuve_du_skill !== "boolean" || !texte(r.pertinence.raison)) {
    refuse(`${nom} : pertinence incomplète — comme_preuve_du_skill et raison`);
  }
  if (r.pertinence.comme_preuve_du_skill && codes.has("session_non_independante")) {
    refuse(`${nom} dit session_non_independante et pertinence vraie — la limite et la pertinence se contredisent`);
  }
  if (!CODES.has(r.pertinence.raison)) refuse(`${nom} : pertinence.raison « ${r.pertinence.raison} » n'est pas un code de limite`);
  if (r.skill && r.skill.revision === null && !codes.has("revision_non_consignee")) {
    refuse(`${nom} a revision null sans revision_non_consignee`);
  }
  // Le fil est facultatif : absent ou null, un run sans trace reste valide. Une chaîne se lit, et quand
  // une trace existe, elle doit nommer le même fil, sinon les deux pièces se contredisent.
  if (r.fil !== undefined && r.fil !== null && !texte(r.fil)) {
    refuse(`${nom} : fil n'est pas une chaîne — le fil d'un run se nomme ou reste null`);
  }
  const traceFil = join(dir, "trace", "fil.json");
  if (existsSync(traceFil)) {
    let t;
    try {
      t = JSON.parse(readFileSync(traceFil, "utf8"));
    } catch {
      refuse(`${nom} : trace/fil.json illisible — une trace se lit ou se refuse`);
    }
    if (typeof r.fil === "string" && t.identifiant !== r.fil) {
      refuse(`${nom} : trace/fil.json nomme « ${t.identifiant} » et run.json nomme « ${r.fil} » — les deux se contredisent`);
    }
  }
  if (!Array.isArray(r.pieces) || r.pieces.length === 0) refuse(`${nom} : pieces est vide — un run cite ses pièces`);
  for (const p of r.pieces) {
    if (!piecePropre(p)) refuse(`${nom} : pièce hors du dossier : ${p}`);
  }
  if (r.mode === "guide") {
    if (!r.pieces.includes("run-guide.md")) refuse(`${nom} ne cite pas run-guide.md dans pieces`);
    if (!existsSync(join(dir, "run-guide.md"))) refuse(`${nom} n'a pas run-guide.md — pieces le cite, le fichier manque`);
  }
  for (const p of r.pieces) {
    if (!existsSync(join(dir, p))) refuse(`${nom} cite une pièce absente : ${p}`);
  }
}

function piecesDossier(dir) {
  const noms = readdirSync(dir).filter((n) => statSync(join(dir, n)).isFile()).sort();
  if (existsSync(join(dir, "trace")) && statSync(join(dir, "trace")).isDirectory()) noms.push("trace/");
  return noms.join(", ");
}

function ficheRun(nom, r) {
  const codes = r.limites.map((l) => l.code);
  return {
    nom,
    date: nom.slice(0, 10),
    mode: r.mode,
    cas: r.skill ? r.skill.nom : "inconnu",
    statut: r.statut,
    limites: `${codes.length}, ${codes.join(", ")}`,
    pieces: r.pieces.join(", "),
  };
}

// Une correction dit ce qu'un reçu a manqué, sans le réécrire : elle nomme la note qui l'établit, le
// verdict retenu et la preuve qui le porte. Le reçu garde son verdict, l'index montre les deux.
function lireCorrection(nom, dir, verdict) {
  const chemin = join(dir, CORRECTION);
  if (!existsSync(chemin)) return null;
  let c;
  try {
    c = JSON.parse(readFileSync(chemin, "utf8"));
  } catch {
    refuse(`${nom} : ${CORRECTION} illisible — une correction se lit ou se refuse`);
  }
  if (!c || typeof c !== "object" || Array.isArray(c)) refuse(`${nom} : ${CORRECTION} n'est pas un objet`);
  if (!piecePropre(c.note) || !existsSync(join(dir, c.note))) {
    refuse(`${nom} : note « ${c.note} » absente du dossier — une correction cite sa note, la note existe`);
  }
  if (!VERDICTS.includes(c.verdict_retenu)) {
    refuse(`${nom} : verdict_retenu « ${c.verdict_retenu} » hors domaine — ${VERDICTS.join(", ")}`);
  }
  if (c.verdict_retenu === verdict) {
    refuse(`${nom} : correction.json retient « ${verdict} », le reçu le dit déjà — une correction corrige`);
  }
  if (!texte(c.preuve)) refuse(`${nom} : correction.json sans preuve — une correction se démontre`);
  return { note: c.note, verdict_retenu: c.verdict_retenu, preuve: c.preuve };
}

function ficheRecu(nom, dir) {
  let r;
  try {
    r = JSON.parse(readFileSync(join(dir, "receipt.json"), "utf8"));
  } catch {
    refuse(`${nom} : receipt.json illisible — un reçu se lit ou se refuse`);
  }
  if (!texte(r.verdict)) refuse(`${nom} est un reçu sans verdict lisible`);
  const correction = lireCorrection(nom, dir, r.verdict);
  const limites = Array.isArray(r.limites) && r.limites.length ? `${r.limites.length}, reçu` : "0, aucune";
  return {
    nom,
    date: nom.slice(0, 10),
    mode: "indépendant",
    cas: texte(r.cas) ? r.cas : "inconnu",
    statut: correction
      ? `${r.verdict} (corrigé ${correction.verdict_retenu}, [note](${nom}/${correction.note}))`
      : r.verdict,
    limites,
    pieces: piecesDossier(dir),
  };
}

function ficheAvorte(nom, dir) {
  const pieces = ["gate.json"];
  if (existsSync(join(dir, "texte-a-remettre.txt"))) pieces.push("texte-a-remettre.txt");
  return { nom, date: nom.slice(0, 10), mode: "avorté", cas: "sans reçu", statut: "sans reçu", limites: "0, aucune", pieces: pieces.join(", ") };
}

function classer(nom) {
  const dir = join(runs, nom);
  const a = (f) => existsSync(join(dir, f));
  const recep = a("receipt.json");
  const runj = a("run.json");
  const gate = a("gate.json");
  const out = a("output.json");
  if (recep && runj) refuse(`${nom} porte receipt.json et run.json — un run porte une seule pièce de statut`);
  if (!recep && !runj && !gate) refuse(`${nom} ne porte ni receipt.json, ni gate.json, ni run.json — un dossier de run se classifie`);
  if (runj) {
    let r;
    try {
      r = JSON.parse(readFileSync(join(dir, "run.json"), "utf8"));
    } catch {
      refuse(`${nom} : run.json illisible — un run.json se lit ou se refuse`);
    }
    if (r.mode === "guide") {
      if (recep) refuse(`${nom} est guidé et porte receipt.json — un guidé n'atteste pas ce qu'il n'a pas`);
      if (gate) refuse(`${nom} est guidé et porte gate.json`);
      if (out) refuse(`${nom} est guidé et porte output.json`);
      if (a(CORRECTION)) refuse(`${nom} est guidé et porte ${CORRECTION} — il n'a pas de verdict à corriger`);
    }
    validerRun(nom, r, dir);
    return ficheRun(nom, r);
  }
  if (recep) return ficheRecu(nom, dir);
  return ficheAvorte(nom, dir);
}

function resume(fiches) {
  const modes = [["indépendant", "indépendants"], ["guide", "guidés"], ["avorté", "avortés"], ["manuel", "manuels"]];
  const parts = modes.map(([mode, nom]) => `${fiches.filter((f) => f.mode === mode).length} ${nom}`);
  return `${fiches.length} ${fiches.length > 1 ? "runs" : "run"} : ${parts.join(", ")}.`;
}

function index(fiches) {
  const lignes = fiches.map((f) =>
    `| ${cellule(f.nom)} | ${cellule(f.date)} | ${cellule(f.mode)} | ${cellule(f.cas)} | ${cellule(f.statut)} | ${cellule(f.limites)} | ${cellule(f.pieces)} |`);
  return [
    ENTETE,
    "",
    resume(fiches),
    "",
    "| Run | Date | Mode | Cas / skill | Statut ou verdict | Limites | Pièces |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...lignes,
    "",
  ].join("\n");
}

const dossiers = readdirSync(runs).filter((n) => statSync(join(runs, n)).isDirectory()).sort();
const fiches = dossiers.map(classer);
const attendu = index(fiches);
const cheminIndex = join(runs, "INDEX.md");

if (action === "--verifier") {
  if (!existsSync(cheminIndex)) refuse("INDEX.md diverge de la génération — régénérer");
  if (readFileSync(cheminIndex, "utf8") !== attendu) refuse("INDEX.md diverge de la génération — régénérer");
  process.exit(0);
}

writeFileSync(cheminIndex, attendu);
console.log(`INDEX — ${fiches.length} run(s) écrit(s) dans ${cheminIndex}`);
