#!/usr/bin/env node
// run.mjs — the minimal harness of a run.
//
// It opens no session and decides nothing by itself. Four commands, one per moment
// of the run, each carrying the spec paragraph that demands it
// (docs/tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-130103-spec.md):
//
//   freeze   before the session opens — the case files and the framework references
//            hashed, and the trees' state recorded (§3 "Figement", §5.2 "avant")
//   collect  once the product is back — verbatim copy under runs/<id>/raw/<case>/,
//            with sha256, size and birth per file (§4)
//   receipt  at run time, hot — receipt.json (§6), the four falsifiers of §5 checked,
//            the verdict ceiling of §7 enforced
//   compare  the judge, from the receipt alone — runs/<id>/output.json (§8, v6 §10)
//
// Usage: node docs/device/harness/run.mjs <freeze|collect|receipt|compare> [options]
//        node docs/device/harness/run.mjs --help
//
// Exit status: 0 done · 1 refusal (printed, never counted) · 2 usage.
//
// Constraints it respects: no dependency, no hook, no CI — this is the run's
// instrument, not a mechanical check on the repository. It never writes outside the
// paths it is given, it refuses to overwrite an existing freeze, product or receipt,
// it refuses a symlink inside the product (a way out of the working directory), and
// it resolves its own repository root from its own path, never from the working
// directory of the caller. Every path it writes is printed absolute.

import { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const USAGE = `usage: run.mjs <commande> [options]

  freeze   --case <id> --arbre <label>=<chemin> [--arbre ...] [--cases <dir>]
           [--ref <chemin-relatif> ...] [--ref-root <dir>] [--refreeze]
  collect  --run <dir> --case <id> --from <fichier|dir>   (copie verbatim le contenu
           de --from sous raw/<case>/ : l'arbre du produit s'y reflète à l'identique,
           la source absolue de chaque fichier est dans le manifeste)
  receipt  --run <dir> --case <id> --faits <faits.json> [--verdict conforme|ecart|non concluant]
           [--limite <texte> ...] [--cases <dir>]
  compare  --run <dir> --case <id> --difference <texte> --phrase <texte>
           --verdict conforme|ecart|non concluant [--limites mord|ne mord pas|non évaluable]
           [--cases <dir>]

  faits.json (receipt) : session{application,identifiant,modele,ouverte_par,ouverte_le}
    horodatage_debut · horodatage_fin · repertoire_de_travail ·
    trace{source,chemin_exporte,commande} · cloisonnement{attendu_vu: oui|non}
    temoignage{qui,quand,texte}

  receipt.json (spec §6) : les champs du §6, plus falsificateurs (les quatre
    conditions du §5, dont celle que ce script ne peut pas évaluer), recu_ecrit_le
    et demande.gel. produit.chemins donne les chemins bruts, produit.fichiers
    le sha256, la taille et le birth de chacun. Les arbres gelés sont repris sous
    arbres.avant, remesurés sous arbres.apres ; les labels framework-origin et
    terrain alimentent en plus framework_rev et terrain_rev.`;

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const CASES_DEFAULT = join(REPO, "docs", "device", "CASES");
const BOOLEAN_FLAGS = new Set(["help", "refreeze"]);
const VERDICTS = new Set(["conforme", "ecart", "non concluant"]);
const LIMITES = new Set(["mord", "ne mord pas", "non évaluable"]);
// Labels whose revision the receipt names as its own fields (§6 `framework_rev`, `terrain_rev`).
const LABEL_TO_FIELD = { "framework-origin": "framework_rev", terrain: "terrain_rev" };

function refuse(message) {
  console.error("REFUS — " + message);
  process.exit(1);
}
function usage(message) {
  console.error("USAGE — " + message + "\n\n" + USAGE);
  process.exit(2);
}
function parseArgs(argv) {
  const flags = new Map();
  const add = (nom, val) => flags.set(nom, [...(flags.get(nom) ?? []), val]);
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) usage(`argument inattendu : ${a}`);
    const nom = a.slice(2);
    if (BOOLEAN_FLAGS.has(nom)) {
      add(nom, true);
      continue;
    }
    const val = argv[i + 1];
    if (val === undefined || val.startsWith("--")) usage(`--${nom} attend une valeur`);
    i++;
    add(nom, val);
  }
  return {
    cmd: argv[0] ?? "help",
    has: (n) => flags.has(n),
    one: (n) => (flags.get(n) ?? [])[0],
    all: (n) => flags.get(n) ?? [],
    required(n) {
      const v = this.one(n);
      if (v === undefined) usage(`--${n} requis`);
      return v;
    },
  };
}

const localIso = () => execFileSync("date", ["--iso-8601=seconds"], { encoding: "utf8" }).trim();
// One instant, two readings of it: the label and the epoch never drift apart.
function nowStamp() {
  const [epoch, iso] = execFileSync("date", ["+%s %Y-%m-%dT%H:%M:%S.%N%z"], { encoding: "utf8" }).trim().split(" ");
  return { gele_le: iso, gele_le_epoch: Number(epoch) };
}
const sha256File = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const sha256Text = (t) => createHash("sha256").update(t).digest("hex");
const display = (p) => (p.startsWith(REPO + sep) ? relative(REPO, p) : p);
const writeJson = (p, objet) => {
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(objet, null, 2) + "\n");
};

function stats(p) {
  const [taille, birth, birthEpoch] = execFileSync("stat", ["-c", "%s|%w|%W", p], { encoding: "utf8" }).trim().split("|");
  return {
    taille: Number(taille),
    birth: birth === "-" ? null : birth,
    birth_epoch: Number(birthEpoch) === 0 ? null : Number(birthEpoch),
  };
}
function empreinteDe(p) {
  return { sha256: sha256File(p), ...stats(p) };
}
function parsePaire(valeur, drapeau) {
  const i = valeur.indexOf("=");
  if (i < 1) usage(`${drapeau} attend <label>=<chemin>, reçu : ${valeur}`);
  return { label: valeur.slice(0, i), chemin: resolve(valeur.slice(i + 1)) };
}
function gitTree({ label, chemin }) {
  const lire = (args) => {
    try {
      return execFileSync("git", ["-C", chemin, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    } catch {
      return null;
    }
  };
  const porcelain = lire(["status", "--porcelain"]);
  return {
    label,
    chemin,
    head: lire(["rev-parse", "--short", "HEAD"]),
    porcelain: porcelain === null ? null : porcelain.split("\n").filter(Boolean),
  };
}
const memeArbre = (a, b) => a.head === b.head && JSON.stringify(a.porcelain) === JSON.stringify(b.porcelain);
const casesDirOf = (a) => resolve(a.one("cases") ?? CASES_DEFAULT);

// ---------------------------------------------------------------------------
// freeze — the pre-run snapshot
// ---------------------------------------------------------------------------
function cmdFreeze(a) {
  const cas = a.required("case");
  const casesDir = casesDirOf(a);
  const arbres = a.all("arbre").map((v) => parsePaire(v, "--arbre"));
  if (arbres.length === 0) {
    refuse("freeze : --arbre <label>=<chemin> requis — l'état des arbres avant fait partie du gel (§5.2)");
  }
  for (const champ of Object.keys(LABEL_TO_FIELD)) {
    if (!arbres.some((t) => t.label === champ)) {
      refuse(`freeze : aucun arbre étiqueté « ${champ} » — le reçu du §6 porte ${LABEL_TO_FIELD[champ]}, et un gel qui ne mesure pas cet arbre ne le lui donne pas`);
    }
  }
  if (!existsSync(casesDir)) refuse(`freeze : ${casesDir} n'existe pas`);

  const noms = readdirSync(casesDir).filter((n) => n.startsWith(cas + ".")).sort();
  const demande = noms.find((n) => n.endsWith(".request.md"));
  const attendu = noms.find((n) => n.endsWith(".expected.json"));
  const gel = join(casesDir, `${cas}.freeze.json`);
  if (!demande) refuse(`freeze : aucune demande ${cas}.request.md dans ${casesDir}`);
  if (!attendu) {
    refuse(
      `freeze : aucun attendu ${cas}.expected.json — un gel qui ne couvre pas l'attendu ne prouve pas ` +
        `« écrit avant d'avoir vu le produit » (v6 §10) : il gèlerait un cas incomplet`,
    );
  }
  if (existsSync(gel) && !a.has("refreeze")) {
    refuse(`freeze : ${display(gel)} existe déjà — --refreeze pour le refaire, le gel précédent est alors perdu`);
  }

  const fichiers = noms
    .filter((n) => !n.endsWith(".freeze.json"))
    .map((n) => ({ role: n.endsWith(".request.md") ? "demande" : "attendu", chemin: join(casesDir, n), ...empreinteDe(join(casesDir, n)) }));

  const references = [];
  for (const rel of a.all("ref")) {
    const root = a.one("ref-root");
    if (!root) refuse("freeze : --ref exige --ref-root (le chemin d'un fichier du framework est relatif à sa racine)");
    const racine = resolve(root);
    const abs = resolve(racine, rel);
    if (!abs.startsWith(racine + sep)) refuse(`freeze : ${abs} sort de --ref-root ${racine}`);
    if (!existsSync(abs)) refuse(`freeze : référence absente : ${abs}`);
    references.push({ chemin: relative(racine, abs), racine, ...empreinteDe(abs) });
  }

  const empreinte = sha256Text(
    [...fichiers.map((f) => `${f.role}\t${basename(f.chemin)}\t${f.sha256}`), ...references.map((r) => `reference\t${r.chemin}\t${r.sha256}`)].sort().join("\n") + "\n",
  );
  const objet = {
    cas,
    ...nowStamp(), // taken once the case files are hashed: the freeze marks the fingerprint, not its beginning
    commande: process.argv.slice(1).map((v) => (v.includes(" ") ? JSON.stringify(v) : v)).join(" "),
    empreinte,
    fichiers,
    references,
    arbres: arbres.map(gitTree),
  };
  // A refrozen freeze must not keep the birth of the one it replaces: unlink, then write.
  if (existsSync(gel)) rmSync(gel);
  writeJson(gel, objet);
  console.log(
    `freeze ok — ${cas} : ${fichiers.length} fichiers du cas, ${references.length} reference(s) du framework, ` +
      `${objet.arbres.length} arbre(s) ; empreinte ${empreinte.slice(0, 8)} : ${display(gel)}`,
  );
}

// ---------------------------------------------------------------------------
// collect — the verbatim product and its manifest
// ---------------------------------------------------------------------------
function cmdCollect(a) {
  const runDir = resolve(a.required("run"));
  const cas = a.required("case");
  const from = resolve(a.required("from"));
  if (!existsSync(from)) refuse(`collect : --from absent : ${from}`);
  const dest = join(runDir, "raw", cas);
  if (existsSync(dest)) refuse(`collect : ${display(dest)} existe déjà — un produit collecté deux fois n'est plus le produit du run`);
  mkdirSync(dest, { recursive: true });

  const fichiers = [];
  const copier = (src, dst) => {
    if (lstatSync(src).isSymbolicLink()) refuse(`collect : lien symbolique dans le produit : ${src} — une sortie du répertoire de travail n'est pas un produit`);
    const st = statSync(src);
    if (st.isDirectory()) {
      mkdirSync(dst, { recursive: true });
      for (const n of readdirSync(src).sort()) copier(join(src, n), join(dst, n));
      return;
    }
    const avant = empreinteDe(src);
    copyFileSync(src, dst);
    if (sha256File(dst) !== avant.sha256) refuse(`collect : la copie de ${src} ne rend pas le même sha256 — copie refusée`);
    fichiers.push({ chemin: relative(dest, dst), source: src, ...avant });
  };
  if (statSync(from).isDirectory()) {
    for (const n of readdirSync(from).sort()) copier(join(from, n), join(dest, n));
  } else {
    copier(from, join(dest, basename(from)));
  }
  if (fichiers.length === 0) refuse(`collect : rien à collecter sous ${from}`);

  const manifeste = { cas, run: runDir, source: from, collecte_le: localIso(), fichiers };
  writeJson(join(dest, "manifest.json"), manifeste);
  console.log(`collect ok — ${cas} : ${fichiers.length} fichier(s) verbatim sous ${display(dest)}, source ${from}`);
}

// ---------------------------------------------------------------------------
// receipt — the hot receipt, its falsifiers and its verdict ceiling
// ---------------------------------------------------------------------------
function lireJson(p, quoi) {
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch (e) {
    refuse(`${quoi} : ${display(p)} n'est pas du JSON lisible (${e.message})`);
  }
}
function exigerChamp(objet, chemin, ou, quoi) {
  const valeur = chemin.split(".").reduce((o, k) => (o == null ? o : o[k]), objet);
  if (valeur === undefined || valeur === null || valeur === "") {
    refuse(`${ou} : le champ « ${chemin} » manque dans ${quoi} — un reçu ne devine rien (§6)`);
  }
  return valeur;
}

function cmdReceipt(a) {
  const runDir = resolve(a.required("run"));
  const cas = a.required("case");
  const verdict = a.one("verdict") ?? "non concluant";
  if (!VERDICTS.has(verdict)) usage(`--verdict vaut « ${verdict} », attendu : conforme | ecart | non concluant`);
  const casesDir = casesDirOf(a);
  const faitsPath = resolve(a.required("faits"));
  const receiptPath = join(runDir, "receipt.json");
  if (existsSync(receiptPath)) refuse(`receipt : ${display(receiptPath)} existe déjà — un reçu reconstruit est un témoignage, jamais un reçu (§6)`);

  const gelPath = join(casesDir, `${cas}.freeze.json`);
  const gel = lireJson(gelPath, "receipt");
  if (!gel) refuse(`receipt : aucun gel ${display(gelPath)} — la pièce (3) du §5 vient de là ; lancer freeze d'abord`);
  const manifestPath = join(runDir, "raw", cas, "manifest.json");
  const manifeste = lireJson(manifestPath, "receipt");
  if (!manifeste) refuse(`receipt : aucun manifeste ${display(manifestPath)} — lancer collect d'abord`);
  const faits = lireJson(faitsPath, "receipt");
  if (!faits) refuse(`receipt : faits illisibles : ${display(faitsPath)}`);

  const session = {
    application: exigerChamp(faits, "session.application", "receipt", "faits.json"),
    identifiant: exigerChamp(faits, "session.identifiant", "receipt", "faits.json"),
    modele: exigerChamp(faits, "session.modele", "receipt", "faits.json"),
    ouverte_par: exigerChamp(faits, "session.ouverte_par", "receipt", "faits.json"),
    ouverte_le: exigerChamp(faits, "session.ouverte_le", "receipt", "faits.json"),
  };
  const horodatageDebut = exigerChamp(faits, "horodatage_debut", "receipt", "faits.json");
  const horodatageFin = exigerChamp(faits, "horodatage_fin", "receipt", "faits.json");
  const travail = resolve(exigerChamp(faits, "repertoire_de_travail", "receipt", "faits.json"));
  const trace = {
    source: exigerChamp(faits, "trace.source", "receipt", "faits.json"),
    chemin_exporte: exigerChamp(faits, "trace.chemin_exporte", "receipt", "faits.json"),
    commande: exigerChamp(faits, "trace.commande", "receipt", "faits.json"),
  };
  const attenduVu = exigerChamp(faits, "cloisonnement.attendu_vu", "receipt", "faits.json");
  if (attenduVu !== "oui" && attenduVu !== "non") refuse(`receipt : cloisonnement.attendu_vu vaut « ${attenduVu} », attendu « oui » ou « non »`);
  const temoignage = {
    qui: exigerChamp(faits, "temoignage.qui", "receipt", "faits.json"),
    quand: exigerChamp(faits, "temoignage.quand", "receipt", "faits.json"),
    texte: exigerChamp(faits, "temoignage.texte", "receipt", "faits.json"),
  };

  const apres = gel.arbres.map(gitTree);
  const avantTravail = gel.arbres.find((t) => t.chemin === travail);
  const apresTravail = apres.find((t) => t.chemin === travail);
  if (!avantTravail) {
    refuse(`receipt : le répertoire de travail ${travail} n'est pas dans l'état des arbres gelé — la condition 3 du §5 ne peut pas être établie`);
  }
  if (avantTravail.porcelain === null || apresTravail.porcelain === null) {
    refuse(`receipt : ${travail} n'est pas un dépôt git lisible — la condition 3 du §5 ne peut pas être établie`);
  }

  const demande = gel.fichiers.find((f) => f.role === "demande");
  const falsificateurs = {
    birth_anterieur_au_gel: manifeste.fichiers.filter((f) => f.birth_epoch !== null && f.birth_epoch < gel.gele_le_epoch).map((f) => f.chemin),
    arbre_de_travail_inchange: manifeste.fichiers.length > 0 && memeArbre(avantTravail, apresTravail),
    produit_identique_a_une_empreinte_anterieure: manifeste.fichiers
      .filter((f) => [...gel.fichiers, ...gel.references].some((g) => g.sha256 === f.sha256))
      .map((f) => f.chemin),
    trace_non_lue_par_le_harnais: true,
  };

  const motifRefus = [];
  if (attenduVu === "oui") motifRefus.push("le cloisonnement est rompu : l'attendu a été vu (§3, §9)");
  if (manifeste.fichiers.length === 0) motifRefus.push("la session n'a rien produit : le produit est sa sortie brute (§9)");
  if (falsificateurs.birth_anterieur_au_gel.length) motifRefus.push(`un fichier produit est né avant le gel : ${falsificateurs.birth_anterieur_au_gel.join(", ")} (§5, condition 1)`);
  if (falsificateurs.arbre_de_travail_inchange) motifRefus.push("le produit existe et l'arbre de travail est inchangé (§5, condition 3)");
  if (falsificateurs.produit_identique_a_une_empreinte_anterieure.length) {
    motifRefus.push(`le produit est identique à un fichier déjà présent avant le run : ${falsificateurs.produit_identique_a_une_empreinte_anterieure.join(", ")} (§5, condition 4)`);
  }

  if (motifRefus.length && verdict !== "non concluant") {
    refuse(`receipt : verdict « ${verdict} » refusé, le verdict suit la preuve (§7) : ${motifRefus.join(" ; ")}`);
  }

  const limites = [...a.all("limite")];
  const ambigus = manifeste.fichiers.filter((f) => f.birth_epoch !== null && f.birth_epoch >= gel.gele_le_epoch && f.birth_epoch - gel.gele_le_epoch <= 1);
  if (ambigus.length) {
    limites.push(`naissance à une seconde du gel (résolution du birth) : ${ambigus.map((f) => f.chemin).join(", ")} — la condition 1 du §5 ne les distingue pas`);
  }
  if (!existsSync(trace.chemin_exporte)) limites.push("trace machine introuvable au chemin exporté — pièce (1) absente (§7 : verdict possible, limite dite)");
  if (falsificateurs.trace_non_lue_par_le_harnais) limites.push("le harnais ne lit aucune des trois sources du §5.1 : la pièce (1) est attestée par l'export, pas par ce script");
  for (const m of motifRefus) limites.push(m);

  const produit = {
    chemins: manifeste.fichiers.map((f) => join("raw", cas, f.chemin)),
    fichiers: manifeste.fichiers.map(({ chemin, source, sha256, taille, birth, birth_epoch }) => ({ chemin, source, sha256, taille, birth, birth_epoch })),
  };
  const arbres = { avant: gel.arbres, apres };
  const reecrireRevision = (t) => {
    const champ = LABEL_TO_FIELD[t.label];
    return champ ? { [champ]: t.head, [`${champ}_arbre`]: t.chemin } : {};
  };

  const recu = {
    cas,
    recu_ecrit_le: localIso(),
    session,
    demande: { chemin: demande?.chemin ?? null, sha256: demande?.sha256 ?? null, gel: gelPath, empreinte_gel: gel.empreinte, gele_le: gel.gele_le },
    ...Object.assign({}, ...apres.map(reecrireRevision)),
    repertoire_de_travail: travail,
    horodatage_debut: horodatageDebut,
    horodatage_fin: horodatageFin,
    trace,
    arbres,
    produit,
    cloisonnement: { attendu_vu: attenduVu },
    temoignage,
    falsificateurs,
    verdict,
    limites,
  };
  writeJson(receiptPath, recu);
  console.log(
    `receipt ok — ${cas} : verdict ${verdict} ; produit ${manifeste.fichiers.length} fichier(s) ; ` +
      `${limites.length} limite(s) ; ${display(receiptPath)}`,
  );
}

// ---------------------------------------------------------------------------
// compare — the judge, on the receipt alone
// ---------------------------------------------------------------------------
function cmdCompare(a) {
  const runDir = resolve(a.required("run"));
  const cas = a.required("case");
  const difference = a.required("difference");
  const phrase = a.required("phrase");
  const verdict = a.required("verdict");
  if (!VERDICTS.has(verdict)) usage(`--verdict vaut « ${verdict} », attendu : conforme | ecart | non concluant`);
  const limites = a.one("limites") ?? "non évaluable";
  if (!LIMITES.has(limites)) usage(`--limites vaut « ${limites} », attendu : mord | ne mord pas | non évaluable`);
  const casesDir = casesDirOf(a);
  const attenduPath = join(casesDir, `${cas}.expected.json`);
  const attendu = lireJson(attenduPath, "compare");
  if (!attendu) refuse(`compare : aucun attendu ${display(attenduPath)}`);
  const receiptPath = join(runDir, "receipt.json");
  const recu = lireJson(receiptPath, "compare");
  if (!recu) refuse(`compare : aucun reçu ${display(receiptPath)} — le juge travaille sur le reçu seul (§8)`);
  const outPath = join(runDir, "output.json");
  if (existsSync(outPath)) refuse(`compare : ${display(outPath)} existe déjà`);

  if (verdict !== "non concluant" && recu.verdict === "non concluant") {
    refuse(`compare : verdict « ${verdict} » refusé — le reçu conclut « non concluant » : ${recu.limites.join(" ; ")}`);
  }

  const produitBrut = join(runDir, "raw", cas);
  const sortie = {
    cas,
    attendu: attendu.attendu ?? attendu,
    produit_brut: display(produitBrut),
    difference,
    verdict,
    limites,
    ecarte_comme_non_testable: attendu.ecartes ?? [],
    phrase,
    juge_le: localIso(),
    depuis_le_recu: display(receiptPath),
  };
  writeJson(outPath, sortie);
  console.log(`compare ok — ${cas} : verdict ${verdict}, limites « ${limites} » ; ${display(outPath)}`);
}

const COMMANDS = { freeze: cmdFreeze, collect: cmdCollect, receipt: cmdReceipt, compare: cmdCompare };
const a = parseArgs(process.argv.slice(2));
if (a.cmd === "help" || a.cmd === "--help" || a.has("help")) {
  console.log(USAGE);
  process.exit(0);
}
const commande = COMMANDS[a.cmd];
if (!commande) usage(`commande inconnue : ${a.cmd}`);
commande(a);
