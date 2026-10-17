#!/usr/bin/env node
// run.mjs — the minimal harness of a run.
//
// It opens no session and decides nothing by itself. Six commands, one per moment
// of the run, each carrying the spec paragraph that demands it
// (docs/tasks/2026_10/2026-10-15-130103-run-par-session-operateur/2026-10-15-130103-spec.md):
//
//   freeze   before the session opens — the case files and the framework references
//            hashed, and the trees' state recorded (§3 "Figement", §5.2 "avant").
//            The workspace root is declared once (--racine), recorded in the freeze, and
//            the case's two copies are derived from it: a case that names the machine's
//            root cannot survive a move, and rewriting a frozen case costs a re-freeze.
//   preflight the gate, between the freeze and the session — the directory the session
//            opens in must be the one the freeze names for the tree « travail », still
//            in the state the freeze recorded (§3 "Ouverture dans le répertoire
//            déclaré"). Without it, nothing before the run says where the run happens.
//   collect  once the product is back — verbatim copy under runs/<id>/raw/<case>/,
//            with sha256, size and birth per file (§4). The product is what the session
//            wrote in the frozen workspace, so a --from that resolves outside it is
//            refused: a product from elsewhere would make the receipt read an origin
//            the freeze does not cover (§4 "Ce qui revient")
//   faits    between the export and the receipt — faits.json, the values the receipt reads,
//            plus trace.base, the base they were read from. Derived from the client's base
//            (thread, model, project root, mode, branch, worktree) and from the freeze (the
//            tree « travail »), never typed by hand: a path that does not resolve is refused
//            here, not copied into a receipt.
//            The three human facts — who opened, when it ended, what the operator testifies
//            — are required arguments, and nothing invents them (ADR-024).
//   receipt  at run time, hot — receipt.json (§6), the four falsifiers of §5 checked,
//            the verdict ceiling of §7 enforced, the case re-hashed against the freeze,
//            the copy under raw/ re-hashed (ADR-030), the client's base re-read (ADR-031),
//            the export it cites rebuilt from that base, replayed and compared byte for
//            byte to the file, which is then hashed into the receipt (ADR-032), and the
//            budget of exchanges the case declares measured against the thread's `user`
//            messages, a run past it being refused (ADR-033)
//   compare  the judge — runs/<id>/output.json (§8, v6 §10) — reading the receipt for what
//            happened (§8: never the session) and the freeze for the premise, which it
//            re-hashes before judging
//
// Usage: node docs/device/harness/run.mjs <freeze|collect|faits|receipt|compare> [options]
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
//
// It refuses a case whose files no longer match the freeze, at the receipt as at the
// judgment: the receipt's only proof of « écrit avant d'avoir vu le produit » is the
// fingerprint §3 records, and a fingerprint whose files have moved on proves nothing.

import { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, realpathSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const USAGE = `usage: run.mjs <commande> [options]

  freeze   --case <id> --racine <chemin> --arbre <label>=<chemin> [--arbre ...]
           [--cases <dir>] [--ref <chemin-relatif> ...] [--ref-root <chemin>] [--refreeze]
           --racine est la racine des espaces de travail, déclarée une seule fois : le gel
           l'enregistre (racine_espace_de_travail) et en dérive les deux copies du cas,
           <racine>/<cas>/framework-origin et <racine>/<cas>/terrain ; les deux autres arbres
           restent donnés (ce sont les arbres de la machine), et --arbre sur un label dérivé
           est refusé. Un cas qui écrirait cette racine dans ses propres fichiers est refusé :
           un cas qui nomme la machine ne survit pas à un déplacement sans être réécrit, et
           réécrire un cas gelé coûte un re-gel. chemins gelés relatifs, références nommées
           par leur arbre : un tiers rejoue la formule sur son clone sans réécrire un chemin
           (--ref-root doit être l'un des --arbre) ; seul le chemin d'un arbre reste absolu,
           parce que « où cette machine a lu cet arbre » est un fait, pas un paramètre
  preflight --case <id> [--repertoire <chemin>] [--cases <dir>] [--texte <fichier>]
           la porte d'avant la session : refuse d'autoriser l'ouverture si le dossier
           n'est pas celui que le gel nomme « travail », ou si cet arbre n'est plus dans
           l'état gelé (§3). Sans --repertoire, le dossier examiné est le répertoire
           courant — celui où l'opérateur se trouve avant d'ouvrir. Le cas est re-haché
           comme au reçu : autoriser sur un cas qui a bougé n'autoriserait rien. Avec
           --texte, elle refuse aussi un texte qui n'est pas le §5 du cas, $RACINE
           substitué par la racine du gel : c'est le texte qui part vers la session, et
           une substitution ratée donnerait à lire un chemin qui n'existe pas
  collect  --run <dir> --case <id> --from <fichier|dir>   (copie verbatim le contenu
           de --from sous raw/<case>/ : l'arbre du produit s'y reflète à l'identique,
           la source absolue de chaque fichier est dans le manifeste)
           --from doit tomber DANS l'espace de travail gelé (l'arbre « travail » du
           gel, liens résolus) : le produit d'un run est ce que la session y a écrit,
           et rien d'ailleurs — un produit venu d'un autre arbre ferait lire au reçu
           une provenance que le gel ne couvre pas. Exige donc le gel, comme receipt
  collect  --run <dir> --case <id> --sans-produit          (run sans produit, spec §9 :
           le manifeste est écrit avec fichiers: [] et produit_absent: true, sans
           --from ; sans lui, un run qui ne produit rien ne laissait aucun reçu)
  faits    --case <id> --base <desktop-v2.db> --fil <thread> --trace <fichier> --out <faits.json>
           --par <qui> --fin <date -Is> --temoignage <texte> [--attendu-vu oui|non] [--cases <dir>]
           écrit les faits que receipt lira, sans les inventer : session (application, identifiant,
           modele, ouverte_le), horodatage_debut (le premier message de l'utilisateur), le
           répertoire de travail, la trace. Refuse un fil absent, un modèle vide, un chemin qui
           ne résout pas, un fil hors de l'arbre « travail » du gel, un fil en worktree, une fin
           antérieure au début, et un faits.json déjà écrit. --par, --fin et --temoignage sont
           les trois faits que seule une personne peut donner : rien ne les remplace
  receipt  --run <dir> --case <id> --faits <faits.json> [--verdict conforme|ecart|non concluant]
           [--limite <texte> ...] [--cases <dir>]
           refuse si un fichier du cas ou une référence du gel a changé depuis le gel
           (re-hachage, §3) : le gel est relu sur le disque, jamais cru sur parole. Refait
           aussi le contrôle d'origine du produit, sur le manifeste : toute source
           déclarée hors de l'arbre « travail » du gel est un refus — la porte de
           collect peut être contournée, le reçu relit les pièces. Refuse enfin un
           faits.json dont les chemins ne se situent pas : un répertoire de travail
           absent ou qui n'est pas un répertoire, un dossier de trace absent ; l'arbre
           du run se compare après résolution des liens, comme faits le compare
           (ADR-025). Il rattache session.identifiant au fil que trace.commande lit
           (ADR-028) : aucune mention, plusieurs fils, ou un autre fil, sont des refus.
           Il re-hache la copie sous raw/<case>/ contre le manifeste (ADR-030) : un
           fichier absent, en trop, ou dont le sha256 a changé, est un refus.
           Il relit la base nommée par trace.base (ADR-031) : un fil absent, un
           project_path hors de l'arbre gelé, un mode non local, un worktree, un modèle
           ou une heure d'ouverture que la base démentent, sont des refus.
           Il reconstruit l'export du §1.5 depuis cette base, sans jamais exécuter la
           chaîne que la pièce cite (ADR-032) : trace.commande doit être égale, caractère
           pour caractère, à la commande reconstruite, puis la requête s'exécute en
           -readonly et ses octets se comparent au fichier exporté. Une différence est un
           refus ; trace_lue porte le sha256 du fichier et l'heure du rejeu.
           Il lit le budget d'échanges du cas dans son attendu et compte les messages
           user du fil (ADR-033) : au-delà du budget, un refus qui nomme les deux
           chiffres et le message en trop, un dépassement n'étant pas un plafond de
           verdict ; à l'épuisement exact, le reçu nomme l'échange qui l'a épuisé
  compare  --run <dir> --case <id> --difference <texte> --phrase <texte>
           --verdict conforme|ecart|non concluant [--limites mord|ne mord pas|non évaluable]
           [--cases <dir>]
           refuse de juger un cas dont les fichiers ne concordent plus avec le gel, ou
           dont le reçu cite une empreinte que le gel sur disque ne porte plus, ou dont
           la trace citée ne rend plus le sha256 que le reçu a écrit (ADR-032)

  prérequis (déclarés ici, sondés au démarrage ; un refus nomme l'outil, la commande, l'usage et le remède) :
    git --version                  toutes les commandes — les quatre arbres, leur porcelain
    date --iso-8601=seconds        toutes les commandes — geler, collecter, recevoir, juger
    date -d @<epoch>               faits et receipt — l'epoch du fil en date locale
    sqlite3 -version               faits et receipt — la base du client, en -readonly

  faits.json (receipt) : session{application,identifiant,modele,ouverte_par,ouverte_le}
    horodatage_debut · horodatage_fin · repertoire_de_travail ·
    trace{source,chemin_exporte,commande} · cloisonnement{attendu_vu: oui|non}
    temoignage{qui,quand,texte}

  receipt.json (spec §6) : les champs du §6, plus falsificateurs (les quatre
    conditions du §5, toutes lues ici — la 2e lit l'export ligne à ligne), trace_lue
    (lignes, échanges dans la fenêtre, lignes sans horodatage, illisibles, sha256 du
    fichier exporté, heure du rejeu — nuls quand la trace est absente), echanges
    (budget du cas, messages user du fil, et l'échange qui a épuisé le budget ;
    un dépassement refuse au lieu de s'écrire), recu_ecrit_le,
    demande.gel et gel_verifie (l'empreinte et le nombre de fichiers que le reçu a
    re-hachés avant de s'écrire). produit.chemins donne les chemins bruts,
    produit.fichiers le sha256, la taille et le birth de chacun. Les arbres gelés sont
    repris sous arbres.avant, remesurés sous arbres.apres ; les labels framework-origin
    et terrain alimentent en plus framework_rev et terrain_rev.
  output.json (spec §8) : cas, attendu, produit_brut, difference, verdict, limites,
    ecarte_comme_non_testable, phrase, et gel_verifie — le même re-hachage, refait
    avant que le juge tranche.`;

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const CASES_DEFAULT = join(REPO, "docs", "device", "CASES");
const BOOLEAN_FLAGS = new Set(["help", "refreeze", "sans-produit"]);
const VERDICTS = new Set(["conforme", "ecart", "non concluant"]);
const LIMITES = new Set(["mord", "ne mord pas", "non évaluable"]);
// Labels whose revision the receipt names as its own fields (§6 `framework_rev`, `terrain_rev`).
const LABEL_TO_FIELD = { "framework-origin": "framework_rev", terrain: "terrain_rev" };
// The case's two copies are derived from the declared root: one label, one subdirectory, and
// nothing to keep in sync by hand.
const LABELS_DERIVES = { "revision-sous-test": "framework-origin", travail: "terrain" };
const cheminDerive = (racine, cas, label) => join(racine, cas, LABELS_DERIVES[label]);

function refuse(message) {
  console.error("REFUS — " + message);
  process.exit(1);
}
function usage(message) {
  console.error("USAGE — " + message + "\n\n" + USAGE);
  process.exit(2);
}
// The harness runs three tools outside node, and each one missing surfaces late and wrong: an absent
// `date` used to come out as a stack trace from execFileSync, an absent `git` as a refusal accusing the
// directory. The prerequisites are declared in USAGE and probed before the command runs, so a machine
// that lacks one hears which tool, for which command, and what to do (ADR-026). A probe is the call the
// harness will actually make: `date --iso-8601=seconds` is GNU coreutils, and a BSD `date` fails it.
const PREREQUIS = [
  { outil: "git", sonde: ["--version"], pour: "lit les quatre arbres et leur porcelain", remede: "installer git" },
  {
    outil: "date",
    sonde: ["--iso-8601=seconds"],
    pour: "horodate le gel, le manifeste, le reçu et le jugement",
    remede: "GNU coreutils requis (date --iso-8601)",
  },
  {
    outil: "date",
    sonde: ["-d", "@0", "--iso-8601=seconds"],
    pour: "convertit l'epoch du fil en date locale",
    commandes: ["faits", "receipt"],
    remede: "GNU coreutils requis (date -d)",
  },
  {
    outil: "sqlite3",
    sonde: ["-version"],
    pour: "lit la base du client en -readonly",
    commandes: ["faits", "receipt"],
    remede: "installer sqlite3",
  },
];
function verifierPrerequis(cmd) {
  for (const { outil, sonde, pour, commandes, remede } of PREREQUIS) {
    if (commandes && !commandes.includes(cmd)) continue;
    try {
      execFileSync(outil, sonde, { stdio: ["ignore", "ignore", "pipe"] });
    } catch (e) {
      const quoi =
        e.code === "ENOENT" ? `« ${outil} » est introuvable` : `« ${outil} ${sonde.join(" ")} » échoue (${String(e.stderr ?? e.message).trim().split("\n")[0] || "sans message"})`;
      refuse(`prérequis : ${quoi} — « ${cmd} » ${pour} ; ${remede} avant de relancer`);
    }
  }
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
// A refusal quotes the decisive part of a long string: two export commands side by side are
// readable up to the point where they differ, and a wall of SQL hides the difference it names.
const court = (s) => (s.length > 180 ? s.slice(0, 180) + "…" : s);
const estDans = (p, racine) => p === racine || p.startsWith(racine + sep);
// A path compared against the frozen trees is compared after its links are resolved: a symlink
// left in the workspace is how a product written elsewhere would look like a product written
// here. null when the path does not resolve — the caller decides what that costs.
const resolu = (p) => {
  try {
    return realpathSync(p);
  } catch {
    return null;
  }
};
// The tree the freeze names « travail » — the only place a run may write, and therefore the only
// place a product may come from. Both moments that copy or read a product ask this one question.
const arbreTravail = (gel) => (gel.arbres ?? []).find((t) => t.label === "travail");
// A frozen path is never absolute, so a third party replays the formula on its own
// clone without rewriting anything it reads here. Inside the repository the path names
// the file from the repository root; outside it (a throwaway bench) the freeze sits
// beside the file, so its base name is enough.
const cheminPortable = (p) => {
  const rel = relative(REPO, p);
  return rel.startsWith("..") ? basename(p) : rel;
};
// Where an arbre can be found again: a label alone does not let a stranger fetch it.
const remotesDe = (chemin) => {
  try {
    return execFileSync("git", ["-C", chemin, "remote", "-v"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .split("\n")
      .filter(Boolean)
      .map((l) => l.split(/\s+/))
      .filter(([, , sens]) => sens === "(fetch)")
      .map(([nom, url]) => ({ nom, url }));
  } catch {
    return [];
  }
};
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
  const head = lire(["rev-parse", "--short", "HEAD"]);
  // Where a stranger can meet this revision: the remote branches carrying it, as this clone
  // knows them — an empty list says out loud that the tree is published nowhere.
  const distants = head === null ? null : lire(["branch", "-r", "--contains", head]);
  return {
    label,
    chemin,
    head,
    head_complet: lire(["rev-parse", "HEAD"]),
    porcelain: porcelain === null ? null : porcelain.split("\n").filter(Boolean),
    remotes: remotesDe(chemin),
    refs_distants:
      distants === null
        ? []
        : distants
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l !== "" && !l.includes("->")),
  };
}
// The fingerprint of a case: roles, base names and hashes, never the paths — so the same
// case fingerprints identically from any clone, and a receipt can cite it anywhere.
const empreinteDeGel = (fichiers, references) =>
  sha256Text(
    [...fichiers.map((f) => `${f.role}\t${basename(f.chemin)}\t${f.sha256}`), ...references.map((r) => `reference\t${r.chemin}\t${r.sha256}`)].sort().join("\n") + "\n",
  );
// The inverse of cheminPortable: a case file is named from the repository root, or by its
// base name alone when the case sits beside its freeze (a throwaway bench).
const cheminDuCas = (chemin, casesDir) => (chemin.includes(sep) ? resolve(REPO, chemin) : join(casesDir, chemin));

// A freeze is worth what its files are worth. Both moments that lean on it — the receipt
// at run time, the judgment after — re-hash the case files and the references and refuse on
// the first drift, then check that the freeze still fingerprints to what it claims. Without
// this, §3's « le reçu porte cette empreinte » is a citation, not a proof.
function verifierLeGel(gel, casesDir, ou) {
  const arbres = new Map((gel.arbres ?? []).map((t) => [t.label, t]));
  const fichiers = (gel.fichiers ?? []).map((f) => {
    const p = cheminDuCas(f.chemin, casesDir);
    if (!existsSync(p)) {
      refuse(`${ou} : le fichier du cas « ${f.chemin} » du gel n'est plus là (${display(p)}) — un gel sans ses fichiers ne fonde rien (§3)`);
    }
    const sha256 = sha256File(p);
    if (sha256 !== f.sha256) {
      refuse(
        `${ou} : le ${f.role} a changé depuis le gel — ${sha256.slice(0, 8)} au disque, ${f.sha256.slice(0, 8)} gelé ` +
          `(${display(p)}) ; le gel est la seule preuve du « écrit avant d'avoir vu le produit » (§3), donc rien ne s'écrit ici`,
      );
    }
    return { role: f.role, chemin: f.chemin, sha256 };
  });
  const references = (gel.references ?? []).map((r) => {
    const arbre = arbres.get(r.arbre);
    if (!arbre) {
      refuse(`${ou} : la référence « ${r.chemin} » se nomme par l'arbre « ${r.arbre} », que le gel ne décrit pas — l'arbre où elle a été hachée est introuvable`);
    }
    const racine = arbre.chemin;
    const p = resolve(racine, r.chemin);
    if (p !== racine && !p.startsWith(racine + sep)) refuse(`${ou} : la référence « ${r.chemin} » sort de l'arbre « ${r.arbre} » (${racine})`);
    if (!existsSync(p)) {
      refuse(`${ou} : la référence « ${r.chemin} » de l'arbre « ${r.arbre} » est introuvable sous ${racine} — les références du gel ne peuvent pas être re-hachées`);
    }
    const sha256 = sha256File(p);
    if (sha256 !== r.sha256) {
      refuse(
        `${ou} : la référence « ${r.chemin} » de l'arbre « ${r.arbre} » a changé depuis le gel — ` +
          `${sha256.slice(0, 8)} au disque, ${r.sha256.slice(0, 8)} gelé (${display(p)}) ; le cas n'est plus celui qui a été gelé`,
      );
    }
    return { arbre: r.arbre, chemin: r.chemin, sha256 };
  });
  const empreinte = empreinteDeGel(fichiers, references);
  if (gel.empreinte && empreinte !== gel.empreinte) {
    refuse(
      `${ou} : le gel ne concorde pas avec lui-même — empreinte recalculée ${empreinte.slice(0, 8)}, empreinte écrite ${gel.empreinte.slice(0, 8)} ; ` +
        `des empreintes et des fichiers ont été réécrits ensemble, le gel n'atteste plus l'instant qu'il déclare`,
    );
  }
  return { le: localIso(), empreinte, fichiers: fichiers.length, references: references.length };
}

// The full hash when both sides carry it: a short hash is abbreviated per clone, so two
// clones of the same commit can print different widths and a string equality would lie.
const memeArbre = (a, b) =>
  (a.head_complet ?? a.head) === (b.head_complet ?? b.head) && JSON.stringify(a.porcelain) === JSON.stringify(b.porcelain);
const casesDirOf = (a) => resolve(a.one("cases") ?? CASES_DEFAULT);

// ---------------------------------------------------------------------------
// freeze — the pre-run snapshot
// ---------------------------------------------------------------------------
function cmdFreeze(a) {
  const cas = a.required("case");
  const casesDir = casesDirOf(a);
  const racineEspace = resolve(a.required("racine"));
  if (!existsSync(racineEspace)) {
    refuse(
      `freeze : --racine ${racineEspace} n'existe pas — la racine des espaces de travail se déclare une seule fois, ` +
        `et c'est elle qui situe les deux copies du cas`,
    );
  }
  if (!statSync(racineEspace).isDirectory()) refuse(`freeze : --racine ${racineEspace} n'est pas un répertoire`);
  if (estDans(racineEspace, REPO)) {
    refuse(
      `freeze : --racine ${racineEspace} est dans le dépôt du dispositif (${REPO}) — l'espace de travail vit hors des ` +
        `quatre arbres (BOUNDARY §1), et un cas gelé sur un dossier du dépôt ferait écrire la session dans les preuves`,
    );
  }
  const declares = a.all("arbre").map((v) => parsePaire(v, "--arbre"));
  for (const label of Object.keys(LABELS_DERIVES)) {
    if (declares.some((t) => t.label === label)) {
      refuse(
        `freeze : --arbre ${label}=… n'a plus lieu : cet arbre est dérivé de --racine ` +
          `(${cheminDerive(racineEspace, cas, label)}) — un espace de travail déclaré deux fois finit par se contredire`,
      );
    }
  }
  for (const label of Object.keys(LABELS_DERIVES)) {
    const chemin = cheminDerive(racineEspace, cas, label);
    if (!existsSync(chemin)) {
      refuse(
        `freeze : ${chemin} n'existe pas — sous cette racine, le cas ${cas} n'a pas ses deux copies ` +
          `(framework-origin et terrain) ; les faire, ou déclarer la bonne racine`,
      );
    }
  }
  const arbres = [...declares, ...Object.keys(LABELS_DERIVES).map((label) => ({ label, chemin: cheminDerive(racineEspace, cas, label) }))];
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

  // The declared root is a fact of this machine, and it stays in the freeze — never in the case.
  // A case that spells it out cannot be moved, re-rooted or replayed elsewhere without being
  // rewritten, and rewriting a frozen case costs a re-freeze of the very artifact that proves
  // when the case was written. The check runs on the bytes about to be hashed, so a gel cannot
  // be taken over a case that names this machine.
  for (const n of noms.filter((x) => !x.endsWith(".freeze.json"))) {
    if (readFileSync(join(casesDir, n), "utf8").includes(racineEspace)) {
      refuse(
        `freeze : ${n} écrit la racine des espaces de travail en clair (${racineEspace}) — le cas nomme $RACINE, ` +
          `et le gel dit ce que $RACINE vaut ici ; un cas qui nomme la machine ne se rejoue plus ailleurs sans être réécrit`,
      );
    }
  }

  const fichiers = noms
    .filter((n) => !n.endsWith(".freeze.json"))      .map((n) => ({ role: n.endsWith(".request.md") ? "demande" : "attendu", chemin: cheminPortable(join(casesDir, n)), ...empreinteDe(join(casesDir, n)) }));

  const references = [];
  for (const rel of a.all("ref")) {
    const root = a.one("ref-root");
    if (!root) refuse("freeze : --ref exige --ref-root (le chemin d'un fichier du framework est relatif à sa racine)");
    const racine = resolve(root);
    const arbre = arbres.find((t) => resolve(t.chemin) === racine);
    if (!arbre) {
      refuse(
        `freeze : --ref-root ${racine} n'est l'un des --arbre — une référence ne se nomme que par ` +
          `l'arbre où elle a été hachée, et un chemin absolu n'entre pas au gel`,
      );
    }
    const abs = resolve(racine, rel);
    if (!abs.startsWith(racine + sep)) refuse(`freeze : ${abs} sort de --ref-root ${racine}`);
    if (!existsSync(abs)) refuse(`freeze : référence absente : ${abs}`);
    references.push({ arbre: arbre.label, chemin: relative(racine, abs), ...empreinteDe(abs) });
  }

  const empreinte = empreinteDeGel(fichiers, references);
  const objet = {
    cas,
    // Declared once, and recorded here like the trees' paths: where this machine keeps the
    // workspaces of its cases is a fact, not a parameter — but a fact said once.
    racine_espace_de_travail: racineEspace,
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
    `freeze ok — ${cas} : racine ${racineEspace}, ${fichiers.length} fichiers du cas, ` +
      `${references.length} reference(s) du framework, ${objet.arbres.length} arbre(s) ; ` +
      `empreinte ${empreinte.slice(0, 8)} : ${display(gel)}`,
  );
}

// ---------------------------------------------------------------------------
// preflight — the gate before the session opens
// ---------------------------------------------------------------------------
// The premise of a run is not only that the case was frozen before a session opened: it is
// that the session opened *in the frozen workspace*. Nothing measured that until now, and
// the receipt accepted any of the four trees as the working directory — the original terrain
// included, where a session writes into the project the case means to leave untouched. This
// is the only command that answers before the fact instead of after it.
function cmdPreflight(a) {
  const cas = a.required("case");
  const casesDir = casesDirOf(a);
  const gelPath = join(casesDir, `${cas}.freeze.json`);
  const gel = lireJson(gelPath, "preflight");
  if (!gel) {
    refuse(`preflight : aucun gel ${display(gelPath)} — rien n'autorise l'ouverture d'une session sur un cas qui n'est pas gelé (§3)`);
  }
  const gelVerifie = verifierLeGel(gel, casesDir, "preflight");

  const gele = (gel.arbres ?? []).find((t) => t.label === "travail");
  if (!gele) {
    refuse(
      "preflight : le gel ne décrit aucun arbre étiqueté « travail » — le dossier où la session s'ouvre serait " +
        "alors un paramètre que rien ne contraint (§4 de la demande)",
    );
  }
  const attendu = resolve(gele.chemin);
  const declare = resolve(a.one("repertoire") ?? process.cwd());
  if (declare !== attendu) {
    refuse(
      `preflight : ouverture refusée dans ${declare} — le gel de ce cas ouvre la session dans ${attendu} ` +
        `(§4 de la demande) ; écrire ailleurs ferait du produit l'écrit d'un autre dossier, et la paire avant/après du §5.2 ne le mesurerait pas`,
    );
  }
  if (!existsSync(declare)) {
    refuse(
      `preflight : ${declare} n'existe pas — le gel le nomme comme espace de travail, donc le cas a été déplacé ou ` +
        `perdu ; refaire le cas, jamais ouvrir ailleurs`,
    );
  }
  if (!statSync(declare).isDirectory()) refuse(`preflight : ${declare} n'est pas un répertoire`);
  if (estDans(declare, REPO)) {
    refuse(
      `preflight : ${declare} est dans le dépôt du dispositif (${REPO}) — la session écrirait dans l'arbre qui porte ` +
        `les preuves du cas, dont l'attendu qu'elle ne doit pas lire (§7) ; l'espace de travail vit hors des quatre arbres (BOUNDARY §1)`,
    );
  }
  const mesure = gitTree({ label: gele.label, chemin: declare });
  if (!memeArbre(gele, mesure)) {
    refuse(
      `preflight : l'espace de travail n'est plus celui du gel — HEAD ${mesure.head ?? "(illisible)"} contre ${gele.head} gelé, ` +
        `porcelain ${JSON.stringify(mesure.porcelain)} contre ${JSON.stringify(gele.porcelain)} ; la paire avant/après du §5.2 ne se lirait pas, ` +
        `et refaire le gel avant d'ouvrir est le seul remède (§3)`,
    );
  }

  // The text handed to the session is the case's §5 with $RACINE substituted: the case stays
  // portable, the session still receives an absolute path — the one lesson of the first run. It is
  // checked here, at the same moment as the folder, because both are what the operator does just
  // before the session opens.
  let texte = null;
  if (a.has("texte")) {
    const racineEspace = gel.racine_espace_de_travail;
    if (!racineEspace) {
      refuse("preflight : le gel ne déclare aucune racine des espaces de travail (racine_espace_de_travail) — un gel d'avant la racine déclarée ne peut pas substituer $RACINE ; le refaire");
    }
    const cheminTexte = resolve(a.one("texte"));
    if (!existsSync(cheminTexte)) refuse(`preflight : --texte ${cheminTexte} n'existe pas`);
    const cheminDemande = cheminDuCas(gel.fichiers.find((f) => f.role === "demande").chemin, casesDir);
    const lignes = readFileSync(cheminDemande, "utf8").split("\n");
    const debut = lignes.findIndex((l) => l.trim() === "<<<DEMANDE");
    const fin = lignes.findIndex((l) => l.trim() === ">>>DEMANDE");
    if (debut < 0 || fin <= debut) {
      refuse(`preflight : ${display(cheminDemande)} ne porte pas de bloc §5 (« <<<DEMANDE » puis « >>>DEMANDE ») — il n'y a pas de texte à remettre`);
    }
    const attendu = lignes.slice(debut + 1, fin).join("\n").split("$RACINE").join(racineEspace);
    const recu = readFileSync(cheminTexte, "utf8");
    if (recu !== attendu) {
      const octets = (t) => Buffer.byteLength(t, "utf8");
      refuse(
        `preflight : --texte n'est pas le §5 du cas, $RACINE substitué — ${sha256Text(recu).slice(0, 8)} reçu (${octets(recu)} octets), ` +
          `${sha256Text(attendu).slice(0, 8)} attendu (${octets(attendu)} octets) ; la session lirait un chemin qui n'est pas celui du gel`,
      );
    }
    texte = { chemin: display(cheminTexte), sha256: sha256Text(recu), octets: Buffer.byteLength(recu, "utf8") };
  }

  console.log(
    `preflight ok — ${cas} : ouverture autorisée dans ${declare} (HEAD ${mesure.head}, porcelain ${mesure.porcelain.length} ligne(s)) ; ` +
      `gel ${String(gel.empreinte).slice(0, 8)} re-haché, ${gelVerifie.fichiers} fichier(s) du cas et ${gelVerifie.references} référence(s)` +
      (texte ? ` ; texte ${texte.sha256.slice(0, 8)} (${texte.octets} octets) conforme au §5 substitué` : ""),
  );
}

// ---------------------------------------------------------------------------
// collect — the verbatim product and its manifest
// ---------------------------------------------------------------------------
function cmdCollect(a) {
  const runDir = resolve(a.required("run"));
  const cas = a.required("case");
  const sansProduit = a.has("sans-produit");
  if (sansProduit && a.has("from")) refuse("collect : --sans-produit et --from sont exclusifs — un run a un produit, ou n'en a pas (§9)");
  const from = sansProduit ? null : resolve(a.required("from"));
  if (!sansProduit && !existsSync(from)) refuse(`collect : --from absent : ${from}`);
  const dest = join(runDir, "raw", cas);
  if (existsSync(dest)) refuse(`collect : ${display(dest)} existe déjà — un produit collecté deux fois n'est plus le produit du run`);

  if (sansProduit) {
    // Spec §9 : « la session ne produit rien → non concluant, produit = sa sortie brute ».
    // Le harnais ne juge pas la sortie brute ; il en garde la place, écrite, pour que le
    // reçu puisse exister et que le juge lise un verdict au lieu d'un silence.
    mkdirSync(dest, { recursive: true });
    const manifesteVide = { cas, run: runDir, source: null, produit_absent: true, collecte_le: localIso(), fichiers: [] };
    writeJson(join(dest, "manifest.json"), manifesteVide);
    console.log(`collect ok — ${cas} : run sans produit (§9), 0 fichier ; le manifeste nomme l'absence sous ${display(dest)}`);
    return;
  }

  // A product is what the session wrote in the frozen workspace. The freeze is read here — not
  // asked of the operator — so the origin of the product is established at the moment it is
  // copied, and not only at the receipt, where the copy is already the record.
  const casesDir = casesDirOf(a);
  const gelPath = join(casesDir, `${cas}.freeze.json`);
  const gel = lireJson(gelPath, "collect");
  if (!gel) {
    refuse(
      `collect : aucun gel ${display(gelPath)} — rien ne dit quel espace de travail est celui du cas, donc d'où le ` +
        `produit peut venir ; lancer freeze d'abord`,
    );
  }
  const geleTravail = arbreTravail(gel);
  if (!geleTravail) {
    refuse(
      "collect : le gel ne décrit aucun arbre « travail » — l'espace de travail du cas est introuvable, et un produit " +
        "dont la provenance n'est pas gelée n'entre pas au reçu",
    );
  }
  const racineTravail = resolu(geleTravail.chemin);
  const fromResolu = resolu(from);
  if (racineTravail === null || fromResolu === null) {
    refuse(
      `collect : --from ${from} ou l'espace de travail gelé (${geleTravail.chemin}) n'est pas résolvable — un produit ` +
        `dont le chemin ne se résout pas ne peut pas être rapporté à l'espace du cas (lien mort, dossier déplacé)`,
    );
  }
  if (!estDans(fromResolu, racineTravail)) {
    refuse(
      `collect : --from ${from} est hors de l'espace de travail gelé (${geleTravail.chemin}) — le produit d'un run est ` +
        `ce que la session a écrit là (§4), et un produit venu d'ailleurs ferait lire au reçu une provenance que le gel ` +
        `ne couvre pas ; collecter le dossier gelé, ou refaire le run là où le gel l'ouvre`,
    );
  }

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

  // Where the product was copied from, said against the tree the freeze names: the receipt can
  // then re-read the origin without asking collect what it did.
  const manifeste = {
    cas,
    run: runDir,
    source: from,
    arbre_de_travail: { label: geleTravail.label, chemin: geleTravail.chemin },
    collecte_le: localIso(),
    fichiers,
  };
  writeJson(join(dest, "manifest.json"), manifeste);
  console.log(`collect ok — ${cas} : ${fichiers.length} fichier(s) verbatim sous ${display(dest)}, source ${from} (arbre « travail » ${geleTravail.chemin})`);
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

// ---------------------------------------------------------------------------
// faits — what the receipt will read, derived where a machine holds it
// ---------------------------------------------------------------------------
// The rehearsal of 2026-10-17 (Séance 31) found the gap: the receipt needs nine values, three of them
// exact paths, and nothing checked them because they were typed by hand. This command derives what
// the client's base and the freeze say, refuses every path that does not resolve, and leaves the
// three human facts to the operator — it does not invent them (ADR-024).
const isoDeMs = (ms, ou) => {
  const n = Number(ms);
  if (!Number.isFinite(n) || n <= 0) refuse(`${ou} : « ${ms} » n'est pas un horodatage — la base ne dit pas quand`);
  return execFileSync("date", ["-d", "@" + Math.floor(n / 1000), "--iso-8601=seconds"], { encoding: "utf8" }).trim();
};
const lireBase = (base, sql, ou) => {
  let sortie;
  try {
    sortie = execFileSync("sqlite3", ["-readonly", base, sql], { encoding: "utf8" });
  } catch (e) {
    if (e.code === "ENOENT") refuse(`${ou} : sqlite3 introuvable — cette commande lit la base du client, elle ne la devine pas`);
    refuse(`${ou} : la base ${display(base)} est illisible — ${String(e.stderr ?? e.message).trim().split("\n")[0]}`);
  }
  const t = sortie.trim();
  if (t === "") return null;
  try {
    return JSON.parse(t);
  } catch {
    refuse(`${ou} : la réponse de la base n'est pas du JSON — ${t.slice(0, 120)}`);
  }
};

// The §1.5 export, written once. `faits` puts this string into the piece; the receipt rebuilds it from
// the piece's fields and compares the two character for character (ADR-032). Two copies of the
// template would drift, and the drift would be invisible: the receipt would refuse a command faits
// itself wrote. The thread id is interpolated after both commands have refused anything but
// [A-Za-z0-9_-], and the SQL holds no double quote, so the shell quoting is unambiguous.
const requeteExport = (fil) =>
  `select json_object('seq', m.seq, 'role', m.role, 'kind', json_extract(value,'$.kind'), ` +
  `'open', json_extract(value,'$.open'), 'text', json_extract(value,'$.text'), 'ts', m.ts) from messages m, ` +
  `json_each(m.parts_json) where m.thread_id='${fil}' order by m.seq, json_each.key;`;
const commandeExport = (base, fil, trace) => `sqlite3 -readonly ${base} "${requeteExport(fil)}" > ${trace}`;

function cmdFaits(a) {
  const cas = a.required("case");
  const base = resolve(a.required("base"));
  const fil = a.required("fil");
  if (!/^[A-Za-z0-9_-]{1,120}$/.test(fil)) refuse(`faits : « ${fil} » n'est pas un identifiant de fil — lettres, chiffres, tirets et soulignés seulement`);
  const trace = resolve(a.required("trace"));
  const out = resolve(a.required("out"));
  const par = a.required("par");
  const fin = a.required("fin");
  const temoignage = a.required("temoignage");
  const attenduVu = a.one("attendu-vu") ?? "non";
  if (attenduVu !== "oui" && attenduVu !== "non") refuse(`faits : --attendu-vu vaut « ${attenduVu} », attendu « oui » ou « non »`);

  if (!existsSync(base)) refuse(`faits : la base ${display(base)} n'existe pas — le dossier du client se lit sous .freebuff/project-id, il ne se devine pas`);
  if (!existsSync(dirname(out))) refuse(`faits : le dossier de ${display(out)} n'existe pas — les faits s'écrivent dans le dossier du run, ils ne le créent pas`);
  if (existsSync(out)) refuse(`faits : ${display(out)} existe déjà — les faits s'écrivent une fois, à chaud ; un fichier reconstruit est un témoignage (§6)`);

  const f = lireBase(
    base,
    `select json_object('id', id, 'project_path', project_path, 'execution_mode', execution_mode, 'branch', branch, 'worktree_path', worktree_path, 'harness_id', harness_id, 'model', model, 'created_at', created_at) from threads where id = '${fil}';`,
    "faits",
  );
  if (!f) refuse(`faits : aucun fil « ${fil} » dans ${display(base)} — l'identifiant du fil se lit dans la base, il ne se devine pas`);
  if (!f.project_path) refuse(`faits : le fil « ${fil} » ne nomme aucun project_path — le répertoire du run ne se devine pas`);
  if (!f.model) refuse(`faits : le fil « ${fil} » ne nomme aucun modèle — le reçu refuse un champ vide, et le modèle est un fait`);
  if (f.execution_mode !== "local")
    refuse(`faits : le fil « ${fil} » s'exécute en « ${f.execution_mode ?? "(vide)"} », pas en local — un run dans un autre environnement n'écrit pas dans l'arbre gelé`);
  if (f.branch || f.worktree_path)
    refuse(
      `faits : le fil « ${fil} » vit dans un worktree (branche « ${f.branch ?? ""} », ${f.worktree_path ?? ""}) — il déplacerait le HEAD de la copie, et le produit sortirait de l'arbre gelé (§1.7)`,
    );

  const travail = resolve(f.project_path);
  if (!existsSync(travail)) refuse(`faits : le répertoire de travail du fil (${travail}) ne résout pas — le run aurait écrit nulle part`);
  if (!statSync(travail).isDirectory()) refuse(`faits : ${travail} n'est pas un répertoire`);

  const casesDir = casesDirOf(a);
  const gelPath = join(casesDir, `${cas}.freeze.json`);
  const gel = lireJson(gelPath, "faits");
  if (!gel) refuse(`faits : aucun gel ${display(gelPath)} — le répertoire du fil se compare à l'arbre « travail » du gel, sinon il n'y a rien à comparer`);
  const geleTravail = (gel.arbres ?? []).find((t) => t.label === "travail");
  if (!geleTravail || resolu(resolve(geleTravail.chemin)) !== resolu(travail)) {
    refuse(
      `faits : le fil ouvre ${travail}, le gel nomme « travail » ${geleTravail?.chemin ?? "(aucun arbre « travail »)"} — des faits d'un run ouvert ailleurs nommeraient un produit que le gel ne couvre pas`,
    );
  }

  const premier = lireBase(base, `select json_object('ts', ts, 'seq', seq) from messages where thread_id = '${fil}' and role = 'user' order by seq limit 1;`, "faits");
  if (!premier) refuse(`faits : le fil « ${fil} » ne porte aucun message utilisateur — le début du run ne se lit pas, et rien ne l'invente`);
  const debut = isoDeMs(premier.ts, "faits");
  const finMs = Date.parse(fin);
  if (!Number.isFinite(finMs)) refuse(`faits : --fin « ${fin} » n'est pas une date lisible — l'heure de fin se lit avec date -Is`);
  if (finMs < Date.parse(debut)) refuse(`faits : la fin (${fin}) précède le début (${debut}) — un run ne se termine pas avant d'avoir commencé`);
  if (!existsSync(trace)) refuse(`faits : la trace ${display(trace)} n'existe pas — l'export se fait avant tout autre geste (§1.5), et un chemin qui ne résout pas ne se recopie pas`);
  if (!par.trim() || !temoignage.trim())
    refuse(`faits : --par et --temoignage ne peuvent pas être vides — ces faits-là viennent de l'opérateur, jamais d'une machine`);

  const commande = commandeExport(base, fil, trace);

  const faits = {
    session: {
      application: `Freebuff Desktop (desktop-v2.db${f.harness_id ? `, harness_id ${f.harness_id}` : ""})`,
      identifiant: f.id,
      modele: f.model,
      ouverte_par: par,
      ouverte_le: isoDeMs(f.created_at, "faits"),
    },
    horodatage_debut: debut,
    horodatage_fin: fin,
    repertoire_de_travail: travail,
    trace: { source: `${display(base)} (tables threads, messages)`, base, chemin_exporte: trace, commande },
    cloisonnement: { attendu_vu: attenduVu },
    temoignage: { qui: par, quand: fin, texte: temoignage },
  };
  writeJson(out, faits);
  console.log(`faits ok — ${cas} : fil ${f.id}, début ${debut}, fin ${fin} ; ${display(out)}`);
}

// H1 (ADR-030) : the copy under raw/ is the record the receipt cites, and nothing re-read it —
// a copy rewritten or deleted after collect kept the manifest's word (study §3 F, G). The receipt
// re-hashes every file the manifest names, refuses one it does not name, and hashes the manifest
// itself so a later edit of the piece shows. A run without product has an empty manifest and
// passes here: it is F8, not this, that refuses a « conforme » on nothing.
function verifierCopie(dest, manifeste, ou) {
  if (!Array.isArray(manifeste.fichiers)) {
    refuse(`${ou} : le manifeste ne porte aucune liste de fichiers — il n'a pas été écrit par collect, ou il a été réécrit`);
  }
  if (!existsSync(dest)) refuse(`${ou} : la copie du produit (${display(dest)}) n'existe pas — le manifeste décrit un dossier absent`);
  if (!statSync(dest).isDirectory()) refuse(`${ou} : ${display(dest)} n'est pas un répertoire — un produit se copie dans un dossier`);
  const manifestePath = join(dest, "manifest.json");
  // `last-message.md` is the protocol's second piece under raw/<cas>/ (spec §4): the operator
  // writes it by hand after collect, so the manifest cannot list it. H1 measures it instead of
  // ignoring it, and does not count it as a copy that grew.
  const dernierMessage = join(dest, "last-message.md");
  const permises = new Set([manifestePath, dernierMessage]);
  const nommes = new Set();
  for (const f of manifeste.fichiers) {
    if (typeof f.chemin !== "string" || f.chemin.trim() === "") {
      refuse(`${ou} : une entrée du manifeste ne nomme aucun chemin — une copie qu'on ne peut pas situer ne s'atteste pas`);
    }
    if (typeof f.sha256 !== "string" || !/^[0-9a-f]{64}$/.test(f.sha256)) {
      refuse(`${ou} : l'entrée « ${f.chemin} » du manifeste ne porte aucun sha256 lisible — il n'y a rien à confronter`);
    }
    const p = resolve(dest, f.chemin);
    if (p !== dest && !p.startsWith(dest + sep)) {
      refuse(`${ou} : le chemin « ${f.chemin} » du manifeste sort de ${display(dest)} — une copie ne cite pas ce qui est hors d'elle`);
    }
    if (p === manifestePath) {
      refuse(
        `${ou} : le manifeste liste « ${f.chemin} » comme fichier du produit — collect écrit son propre manifeste à ce chemin, donc le produit de ce nom a été écrasé, et le reçu ne peut pas dire lequel il lit`,
      );
    }
    nommes.add(p);
    if (!existsSync(p)) {
      refuse(`${ou} : le fichier « ${f.chemin} » du manifeste n'est plus dans la copie (${display(p)}) — un produit cité qui n'existe plus n'atteste rien`);
    }
    const st = lstatSync(p);
    if (st.isSymbolicLink()) refuse(`${ou} : lien symbolique dans la copie (${display(p)}) — une copie qui sort d'elle-même n'est pas le produit`);
    if (!st.isFile()) refuse(`${ou} : « ${f.chemin} » du manifeste n'est pas un fichier (${display(p)})`);
    const sha256 = sha256File(p);
    if (sha256 !== f.sha256) {
      refuse(
        `${ou} : la copie « ${f.chemin} » ne rend plus l'empreinte du manifeste — ${sha256.slice(0, 8)} au disque, ${f.sha256.slice(0, 8)} au manifeste (${display(p)}) ; la copie a été réécrite après collect`,
      );
    }
  }
  const parcourir = (d) => {
    for (const n of readdirSync(d).sort()) {
      const p = join(d, n);
      const st = lstatSync(p);
      if (st.isSymbolicLink()) refuse(`${ou} : lien symbolique dans la copie (${display(p)}) — une copie qui sort d'elle-même n'est pas le produit`);
      if (st.isDirectory()) {
        parcourir(p);
        continue;
      }
      if (permises.has(p)) continue;
      if (!nommes.has(p)) {
        refuse(`${ou} : « ${display(p)} » est dans la copie et absent du manifeste — la copie a grossi après collect, et le manifeste n'est plus son contenu`);
      }
    }
  };
  parcourir(dest);
  const verifie = { fichiers: manifeste.fichiers.length, manifeste_sha256: sha256File(manifestePath) };
  if (existsSync(dernierMessage)) {
    const st = lstatSync(dernierMessage);
    if (st.isSymbolicLink()) refuse(`${ou} : ${display(dernierMessage)} est un lien symbolique — le dernier message se lit sous raw/, pas ailleurs`);
    if (!st.isFile()) refuse(`${ou} : ${display(dernierMessage)} n'est pas un fichier — le dernier message est un texte, pas un dossier`);
    verifie.last_message_sha256 = sha256File(dernierMessage);
  }
  return verifie;
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
  const gelVerifie = verifierLeGel(gel, casesDir, "receipt");
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

  // faits refuses a path that does not resolve when it writes the file (ADR-024); the receipt reads
  // that same file and must situate its paths, otherwise the check moves to whoever reads the
  // receipt. A declared directory that is not there is a defect of the piece, not a condition of
  // the run, and it is refused as such rather than reported as a difference of trees (ADR-025).
  if (!existsSync(travail)) {
    refuse(
      `receipt : le répertoire de travail déclaré (${travail}) ne résout pas — ce n'est pas un arbre du gel, c'est un chemin absent : ` +
        `la condition 3 du §5 ne se lirait sur rien`,
    );
  }
  if (!statSync(travail).isDirectory()) {
    refuse(`receipt : le répertoire de travail déclaré (${travail}) n'est pas un répertoire — une session y écrit des fichiers`);
  }
  const traceExportee = resolve(trace.chemin_exporte);
  if (!existsSync(dirname(traceExportee))) {
    refuse(
      `receipt : le dossier du chemin exporté de la trace (${dirname(traceExportee)}) ne résout pas — faits refuse un chemin qui ne se situe pas ; ` +
        `un reçu ne recopie pas ce qu'il ne peut pas situer (§7)`,
    );
  }
  // The identifiant was copied from faits.json and compared to nothing. One piece does name the
  // thread: the export command, which faits builds with the run's thread id (§1.5). The receipt reads
  // it there and refuses a file that describes one run while its command reads another (ADR-028).
  // A file edited on both fields still passes: this is consistency inside the piece, not a witness.
  const filsNommes = [...new Set([...trace.commande.matchAll(/thread_id\s*=\s*'([^']+)'/g)].map((m) => m[1]))];
  if (filsNommes.length === 0) {
    refuse(`receipt : trace.commande ne nomme aucun fil (thread_id='…') — session.identifiant n'a alors aucune pièce à quoi se rattacher (§6)`);
  }
  if (filsNommes.length > 1) {
    refuse(`receipt : trace.commande nomme plusieurs fils (${filsNommes.join(", ")}) — un run lit un fil, et le reçu ne choisit pas lequel`);
  }
  if (filsNommes[0] !== session.identifiant) {
    refuse(
      `receipt : session.identifiant vaut « ${session.identifiant} », la trace exportée lit le fil « ${filsNommes[0]} » — ce faits.json décrit un run, sa commande en décrit un autre (§6)`,
    );
  }
  if (!/from\s+messages/i.test(trace.commande)) {
    refuse(`receipt : trace.commande ne lit pas les messages (aucun « from messages ») — la pièce (1) du §5 ne vient pas d'une autre requête`);
  }
  // H3 (ADR-031) : faits derived these values from the client's base, but the receipt reads a
  // file, and a file is written by hand or edited after faits. It re-reads the base the piece
  // names and compares what it publishes to what the base says: a receipt that copies a session
  // nobody can find attests nothing (study §3 A). The base's path is a field, not a sentence
  // parsed out of trace.source.
  const base = resolve(exigerChamp(faits, "trace.base", "receipt", "faits.json"));
  if (!existsSync(base)) {
    refuse(`receipt : la base nommée par faits.json (${base}) n'existe pas — le reçu ne peut pas confronter la session qu'il publie à celle que la base porte (§6)`);
  }
  if (!statSync(base).isFile()) refuse(`receipt : la base nommée par faits.json (${base}) n'est pas un fichier`);
  if (!/^[A-Za-z0-9_-]{1,120}$/.test(session.identifiant)) {
    refuse(
      `receipt : « ${session.identifiant} » n'est pas un identifiant de fil — lettres, chiffres, tirets et soulignés seulement ; un identifiant ne s'interpole pas dans une requête`,
    );
  }
  const filBase = lireBase(
    base,
    `select json_object('id', id, 'project_path', project_path, 'execution_mode', execution_mode, 'branch', branch, 'worktree_path', worktree_path, 'model', model, 'created_at', created_at) from threads where id = '${session.identifiant}';`,
    "receipt",
  );
  if (!filBase) {
    refuse(`receipt : la base ${base} ne connaît aucun fil « ${session.identifiant} » — le faits.json décrit une session que rien ne porte (§6)`);
  }
  const projetBase = filBase.project_path ? resolu(resolve(filBase.project_path)) : null;
  const travailResolu = resolu(travail);
  if (!filBase.project_path || projetBase === null || travailResolu === null || projetBase !== travailResolu) {
    refuse(
      `receipt : la base dit que le fil « ${session.identifiant} » ouvre ${filBase.project_path ?? "(aucun project_path)"}, le reçu dit ${travail} — des faits d'un run ouvert ailleurs nomment un produit que le gel ne couvre pas`,
    );
  }
  if (filBase.execution_mode !== "local") {
    refuse(
      `receipt : la base dit que le fil « ${session.identifiant} » s'exécute en « ${filBase.execution_mode ?? "(vide)"} », pas en local — un run dans un autre environnement n'écrit pas dans l'arbre gelé`,
    );
  }
  if (filBase.branch || filBase.worktree_path) {
    refuse(
      `receipt : la base dit que le fil « ${session.identifiant} » vit dans un worktree (branche « ${filBase.branch ?? ""} », ${filBase.worktree_path ?? ""}) — il déplacerait le HEAD de la copie`,
    );
  }
  if (!filBase.model || filBase.model !== session.modele) {
    refuse(
      `receipt : la base dit le modèle « ${filBase.model ?? "(vide)"} » pour le fil « ${session.identifiant} », le reçu dit « ${session.modele} » — le modèle du reçu est démenti`,
    );
  }
  const ouverteBase = isoDeMs(filBase.created_at, "receipt");
  if (ouverteBase !== session.ouverte_le) {
    refuse(
      `receipt : la base date l'ouverture du fil « ${session.identifiant} » à ${ouverteBase}, le reçu dit ${session.ouverte_le} — l'heure d'ouverture est démentie`,
    );
  }
  const premierBase = lireBase(
    base,
    `select json_object('ts', ts, 'seq', seq) from messages where thread_id = '${session.identifiant}' and role = 'user' order by seq limit 1;`,
    "receipt",
  );
  if (!premierBase) {
    refuse(`receipt : la base ne porte aucun message utilisateur pour le fil « ${session.identifiant} » — le début du run ne se lit pas, et rien ne l'invente`);
  }
  const debutBase = isoDeMs(premierBase.ts, "receipt");
  if (debutBase !== horodatageDebut) {
    refuse(
      `receipt : la base date le premier message du fil « ${session.identifiant} » à ${debutBase}, le reçu dit ${horodatageDebut} — le début du run est démenti`,
    );
  }
  const sessionVerifiee = {
    base,
    fil: filBase.id,
    project_path: filBase.project_path,
    execution_mode: filBase.execution_mode,
    modele: filBase.model,
    ouverte_le: ouverteBase,
    premier_message: debutBase,
  };
  // Condition 2 of §5 asks the trace to carry at least one exchange inside the run's window. The
  // receipt asserted it could not read the export at all; it reads it now — a JSONL line per part,
  // `ts` in epoch milliseconds as the §1.5 query writes it. What the file has wrong is counted and
  // said, never passed over: an unreadable line is a line, not an exchange (ADR-029).
  if (existsSync(traceExportee) && statSync(traceExportee).isDirectory()) {
    refuse(
      `receipt : le chemin exporté de la trace (${trace.chemin_exporte}) est un répertoire — l'export du §1.5 est un fichier JSONL, et un dossier ne s'atteste pas`,
    );
  }
  // H2 (ADR-032) : the export was compared to nothing. faits built the command that should have
  // produced it (§1.5) and wrote it into the piece; the receipt rebuilds that command from its own
  // fields — never running the string the piece carries, which would hand code execution to whoever
  // edits faits.json — refuses a piece that cites another, then runs the rebuilt query in -readonly,
  // keeps the bytes undecoded, and compares their sha256 to the file's. Order matters: H3 has just
  // established that the base is readable and holds this thread, and the window is counted only
  // after, because counting the exchanges of a file not shown to come from the base counts text.
  const commandeAttendue = commandeExport(base, session.identifiant, traceExportee);
  if (trace.commande !== commandeAttendue) {
    refuse(
      `receipt : trace.commande n'est pas la commande que ce run reconstruit — la pièce cite « ${court(trace.commande)} », ` +
        `le rejeu serait « ${court(commandeAttendue)} » ; une commande qu'on n'exécute pas se compare, et celle-ci ` +
        `ne décrit pas l'export lu (§1.5, H2)`,
    );
  }
  let traceRejouee = null;
  if (existsSync(traceExportee)) {
    let octets;
    try {
      octets = execFileSync("sqlite3", ["-readonly", base, requeteExport(session.identifiant)], { maxBuffer: 64 * 1024 * 1024 });
    } catch (e) {
      if (e.code === "ENOENT") refuse(`receipt : sqlite3 introuvable — le rejeu de l'export ne se devine pas`);
      refuse(
        `receipt : le rejeu de l'export sur ${display(base)} a échoué — ` +
          `${String(e.stderr ?? e.message).trim().split("\n")[0] || "sans message"} ; la pièce (1) du §5 ne se vérifie pas (H2)`,
      );
    }
    const empreinteFichier = sha256File(traceExportee);
    const empreinteRejeu = createHash("sha256").update(octets).digest("hex");
    if (empreinteRejeu !== empreinteFichier) {
      refuse(
        `receipt : la trace exportée ne rend pas ce que la base rend pour le fil « ${session.identifiant} » — ` +
          `${empreinteFichier.slice(0, 8)} au fichier, ${empreinteRejeu.slice(0, 8)} au rejeu (${display(traceExportee)}) ; ` +
          `le fichier a été réécrit, tronqué ou complété après l'export, et la condition 2 du §5 se lirait sur un texte qui n'est plus la base`,
      );
    }
    traceRejouee = { sha256: empreinteFichier, rejoue_le: localIso() };
  }
  // H4 (ADR-033) : the case fixes a budget of exchanges (request.md §8), and nothing measured it. A
  // session that took thirty exchanges produced the same receipt (study §4, W4). The count comes from
  // the base H3 has just opened and validated; the budget from the case's attendu, whose sha256
  // verifierLeGel re-read at the top of this receipt. The attendu is resolved the way the gel names
  // it, not from the cases directory: a bench replays a gel whose case files still live in the
  // repository. No budget field lives in the gel on purpose — `empreinte` hashes the case files and
  // the references, never a field of the gel itself, so a budget written there would be editable
  // without a re-freeze. Order: after H2 (the pieces), before the window (the run's shape), and the
  // window itself is untouched: the budget counts every `user` message of the thread, no filter.
  const attenduPath = (() => {
    const f = (gel.fichiers ?? []).find((x) => x.role === "attendu");
    if (!f) refuse(`receipt : le gel ne nomme aucun fichier « attendu » — le budget d'échanges du cas se lit là, et un reçu ne le devine pas (H4)`);
    return cheminDuCas(f.chemin, casesDir);
  })();
  const attendu = lireJson(attenduPath, "receipt");
  if (!attendu) refuse(`receipt : aucun attendu ${display(attenduPath)} — le budget d'échanges du cas se lit là, et un reçu ne le devine pas (H4)`);
  const budget = attendu.demande?.budget_echanges;
  if (budget === undefined) {
    refuse(
      `receipt : l'attendu du cas (${display(attenduPath)}) ne déclare aucun budget d'échanges (demande.budget_echanges) — ` +
        `le cas fixe ce chiffre avant le run ; sans lui, un dépassement ne se mesure pas (H4)`,
    );
  }
  if (!Number.isInteger(budget) || budget < 1) {
    refuse(`receipt : demande.budget_echanges vaut ${JSON.stringify(budget)}, attendu un entier positif — un budget illisible ne se mesure pas (H4)`);
  }
  // One query: how many `user` messages the thread carries, and the message of rank `budget`, which is
  // the exchange that exhausts the budget when there is one. Null when the rank does not exist.
  const mesuresBudget = lireBase(
    base,
    `select json_object('utilises', (select count(*) from messages where thread_id = '${session.identifiant}' and role = 'user'), ` +
      `'epuise_seq', (select seq from messages where thread_id = '${session.identifiant}' and role = 'user' order by seq limit 1 offset ${budget - 1}), ` +
      `'epuise_ts', (select ts from messages where thread_id = '${session.identifiant}' and role = 'user' order by seq limit 1 offset ${budget - 1}));`,
    "receipt",
  );
  if (mesuresBudget === null || !Number.isInteger(mesuresBudget.utilises)) {
    refuse(
      `receipt : la base ${display(base)} n'a pas rendu le compte des messages utilisateur du fil « ${session.identifiant} » — ` +
        `le budget d'échanges ne se mesure pas, et rien ne l'invente (H4)`,
    );
  }
  if (mesuresBudget.utilises > budget) {
    const auDela = lireBase(
      base,
      `select json_object('seq', seq, 'ts', ts) from messages where thread_id = '${session.identifiant}' and role = 'user' order by seq limit 1 offset ${budget};`,
      "receipt",
    );
    refuse(
      `receipt : le fil « ${session.identifiant} » porte ${mesuresBudget.utilises} messages utilisateur, le cas en autorise ${budget} — ` +
        `le premier au-delà du budget est le seq ${auDela?.seq ?? "?"}${auDela ? ` (${isoDeMs(auDela.ts, "receipt")})` : ""} : ` +
        `un run qui dépasse le budget d'échanges n'est pas celui que le cas décrit, ses réponses figées s'arrêtant à la ${budget}e (H4, §8 de la demande)`,
    );
  }
  const echanges = {
    budget,
    utilises: mesuresBudget.utilises,
    epuise_par: mesuresBudget.utilises === budget && mesuresBudget.epuise_seq !== null ? { seq: mesuresBudget.epuise_seq, ts: mesuresBudget.epuise_ts } : null,
  };
  const debutMs = Date.parse(horodatageDebut);
  const finMs = Date.parse(horodatageFin);
  if (!Number.isFinite(debutMs) || !Number.isFinite(finMs)) {
    refuse(
      `receipt : les horodatages du run (${horodatageDebut} → ${horodatageFin}) ne se lisent pas — la fenêtre du §5 ne se mesure pas, et la condition 2 avec elle`,
    );
  }
  const traceLue = {
    lignes: 0,
    echanges_dans_la_fenetre: 0,
    sans_horodatage: 0,
    illisibles: 0,
    sha256: traceRejouee?.sha256 ?? null,
    rejoue_le: traceRejouee?.rejoue_le ?? null,
  };
  if (existsSync(traceExportee)) {
    for (const ligne of readFileSync(traceExportee, "utf8").split("\n")) {
      if (ligne.trim() === "") continue;
      traceLue.lignes++;
      let entree;
      try {
        entree = JSON.parse(ligne);
      } catch {
        traceLue.illisibles++;
        continue;
      }
      const ts = Number(entree?.ts);
      if (!Number.isFinite(ts)) {
        traceLue.sans_horodatage++;
        continue;
      }
      if (ts >= debutMs && ts <= finMs) traceLue.echanges_dans_la_fenetre++;
    }
  }

  const apres = gel.arbres.map(gitTree);
  // The working directory is the tree the freeze names « travail », not any tree it happens
  // to describe: the original terrain is one of the four, and a run opened there would write
  // into the project the case means to leave untouched. Checked again at the receipt because
  // the gate can be skipped, and a receipt stands on the gel alone. Compared after the links are
  // resolved, as faits compares it: a session opened through a link into the frozen tree wrote in
  // that tree, and refusing it would refuse the file faits itself wrote (ADR-025).
  const geleTravail = gel.arbres.find((t) => t.label === "travail");
  const racineDeclaree = resolu(travail);
  const avantTravail =
    geleTravail && racineDeclaree !== null && resolu(resolve(geleTravail.chemin)) === racineDeclaree ? geleTravail : null;
  const apresTravail = apres.find((t) => racineDeclaree !== null && resolu(resolve(t.chemin)) === racineDeclaree);
  if (!avantTravail) {
    refuse(
      `receipt : le répertoire de travail déclaré (${travail}) n'est pas celui que le gel nomme « travail » ` +
        `(${geleTravail?.chemin ?? "aucun arbre « travail » au gel"}) — la condition 3 du §5 se lirait sur un autre arbre que celui du run`,
    );
  }
  if (!apresTravail || avantTravail.porcelain === null || apresTravail.porcelain === null) {
    refuse(`receipt : ${travail} n'est pas un dépôt git lisible — la condition 3 du §5 ne peut pas être établie`);
  }

  // The product's origin, re-read from the pieces rather than from collect's word: a source that
  // resolves outside the frozen workspace means the run copied what it did not write there, and
  // the receipt is the piece that would have carried that provenance on. The gate can be skipped;
  // a receipt stands on the gel and the manifest alone.
  const sourcesHorsEspace = [];
  const sourcesNonVerifiables = [];
  const racineTravail = resolu(avantTravail.chemin);
  if (racineTravail === null) {
    refuse(
      `receipt : l'espace de travail gelé (${avantTravail.chemin}) n'est pas résolvable — le produit ne peut pas être ` +
        `rapporté à l'arbre du run (§4), et un reçu dont la provenance ne se résout pas n'atteste rien`,
    );
  }
  if (manifeste.arbre_de_travail) {
    const declareTravail = resolu(resolve(manifeste.arbre_de_travail.chemin));
    if (declareTravail === null || declareTravail !== racineTravail) {
      refuse(
        `receipt : le manifeste dit le produit collecté depuis ${manifeste.arbre_de_travail.chemin}, le gel nomme ` +
          `« travail » ${avantTravail.chemin} — le produit vient d'un autre arbre que celui du run (§4), ou de l'arbre ` +
          `du run tel qu'un autre gel le nommait`,
      );
    }
  }
  for (const f of manifeste.fichiers) {
    const source = f.source == null ? null : resolu(resolve(f.source));
    if (source === null) sourcesNonVerifiables.push({ chemin: f.chemin, source: f.source ?? "(non nommée)" });
    else if (!estDans(source, racineTravail)) sourcesHorsEspace.push({ chemin: f.chemin, source: f.source });
  }
  if (sourcesHorsEspace.length) {
    refuse(
      `receipt : le produit a été collecté hors de l'espace de travail gelé (${avantTravail.chemin}) — ` +
        sourcesHorsEspace.map((f) => `${f.chemin} ← ${f.source}`).join(", ") +
        ` ; le §4 ne connaît qu'un produit : ce que la session a écrit dans l'arbre du run`,
    );
  }

  const demande = gel.fichiers.find((f) => f.role === "demande");
  // H1 (ADR-030) : the copy is re-read after the trees and before the falsifiers, so the
  // receipt cites a product it has just measured, not one the manifest describes.
  const copieVerifiee = verifierCopie(join(runDir, "raw", cas), manifeste, "receipt");

  const falsificateurs = {
    birth_anterieur_au_gel: manifeste.fichiers.filter((f) => f.birth_epoch !== null && f.birth_epoch < gel.gele_le_epoch).map((f) => f.chemin),
    arbre_de_travail_inchange: manifeste.fichiers.length > 0 && memeArbre(avantTravail, apresTravail),
    produit_identique_a_une_empreinte_anterieure: manifeste.fichiers
      .filter((f) => [...gel.fichiers, ...gel.references].some((g) => g.sha256 === f.sha256))
      .map((f) => f.chemin),
    trace_sans_echange_dans_la_fenetre: traceLue.echanges_dans_la_fenetre === 0,
  };

  const motifRefus = [];
  if (attenduVu === "oui") motifRefus.push("le cloisonnement est rompu : l'attendu a été vu (§3, §9)");
  if (manifeste.fichiers.length === 0) motifRefus.push("la session n'a rien produit : le produit est sa sortie brute (§9)");
  if (falsificateurs.birth_anterieur_au_gel.length) motifRefus.push(`un fichier produit est né avant le gel : ${falsificateurs.birth_anterieur_au_gel.join(", ")} (§5, condition 1)`);
  if (falsificateurs.arbre_de_travail_inchange) motifRefus.push("le produit existe et l'arbre de travail est inchangé (§5, condition 3)");
  if (falsificateurs.produit_identique_a_une_empreinte_anterieure.length) {
    motifRefus.push(`le produit est identique à un fichier déjà présent avant le run : ${falsificateurs.produit_identique_a_une_empreinte_anterieure.join(", ")} (§5, condition 4)`);
  }
  if (falsificateurs.trace_sans_echange_dans_la_fenetre) {
    motifRefus.push("la trace exportée ne porte aucun échange dans la fenêtre du run (§5, condition 2)");
  }

  if (motifRefus.length && verdict !== "non concluant") {
    refuse(`receipt : verdict « ${verdict} » refusé, le verdict suit la preuve (§7) : ${motifRefus.join(" ; ")}`);
  }

  const limites = [...a.all("limite")];
  const ambigus = manifeste.fichiers.filter((f) => f.birth_epoch !== null && f.birth_epoch >= gel.gele_le_epoch && f.birth_epoch - gel.gele_le_epoch <= 1);
  if (ambigus.length) {
    limites.push(`naissance à une seconde du gel (résolution du birth) : ${ambigus.map((f) => f.chemin).join(", ")} — la condition 1 du §5 ne les distingue pas`);
  }
  if (!existsSync(traceExportee)) limites.push("trace machine introuvable au chemin exporté — pièce (1) absente (§7 : verdict possible, limite dite)");
  if (sourcesNonVerifiables.length) {
    limites.push(
      `source du produit non résolvable au reçu : ${sourcesNonVerifiables.map((f) => `${f.chemin} ← ${f.source}`).join(", ")} — ` +
        "l'origine de ce fichier ne se vérifie plus sur le disque (§4)",
    );
  }
  if (traceLue.illisibles) {
    limites.push(
      `${traceLue.illisibles} ligne(s) de la trace illisible(s) — l'export n'est pas celui du §1.5, et une ligne qu'on ne lit pas ne compte pas comme échange`,
    );
  }
  if (traceLue.sans_horodatage) {
    limites.push(`${traceLue.sans_horodatage} ligne(s) de la trace sans horodatage numérique — la fenêtre du §5 ne les date pas`);
  }
  for (const m of motifRefus) limites.push(m);

  const produit = {
    absent: manifeste.fichiers.length === 0,
    chemins: manifeste.fichiers.map((f) => join("raw", cas, f.chemin)),
    fichiers: manifeste.fichiers.map(({ chemin, source, sha256, taille, birth, birth_epoch }) => ({ chemin, source, sha256, taille, birth, birth_epoch })),
    verifie: copieVerifiee,
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
    session_verifiee: sessionVerifiee,
    demande: { chemin: demande?.chemin ?? null, sha256: demande?.sha256 ?? null, gel: gelPath, empreinte_gel: gel.empreinte, gele_le: gel.gele_le },
    gel_verifie: gelVerifie,
    ...Object.assign({}, ...apres.map(reecrireRevision)),
    repertoire_de_travail: travail,
    horodatage_debut: horodatageDebut,
    horodatage_fin: horodatageFin,
    trace,
    trace_lue: traceLue,
    echanges,
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
  const gelPath = join(casesDir, `${cas}.freeze.json`);
  const gel = lireJson(gelPath, "compare");
  if (!gel) refuse(`compare : aucun gel ${display(gelPath)} — le juge relit le cas gelé avant de comparer, sans quoi il juge un cas qui n'est plus celui qui a été gelé (§3)`);
  const gelVerifie = verifierLeGel(gel, casesDir, "compare");
  const attenduPath = join(casesDir, `${cas}.expected.json`);
  const attendu = lireJson(attenduPath, "compare");
  if (!attendu) refuse(`compare : aucun attendu ${display(attenduPath)}`);
  const receiptPath = join(runDir, "receipt.json");
  const recu = lireJson(receiptPath, "compare");
  if (!recu) refuse(`compare : aucun reçu ${display(receiptPath)} — le juge travaille sur le reçu seul (§8)`);
  if (recu.demande?.empreinte_gel && recu.demande.empreinte_gel !== gel.empreinte) {
    refuse(
      `compare : le reçu cite l'empreinte ${String(recu.demande.empreinte_gel).slice(0, 8)}, le gel sur disque porte ` +
        `${String(gel.empreinte).slice(0, 8)} — le cas a été regelé depuis le reçu, le jugement ne porterait pas sur le cas reçu (§3)`,
    );
  }
  const outPath = join(runDir, "output.json");
  if (existsSync(outPath)) refuse(`compare : ${display(outPath)} existe déjà`);

  // H2 (ADR-032) : the receipt cites one export by its sha256; the judge re-hashes that file before
  // judging, so a trace rewritten between the receipt and the judgment is refused rather than judged
  // against a file the receipt never saw. Absent file: nothing to compare — the receipt said the
  // absence and kept the empreinte (§4).
  if (recu.trace_lue?.sha256 && recu.trace?.chemin_exporte) {
    const traceCitee = resolve(recu.trace.chemin_exporte);
    if (existsSync(traceCitee) && !statSync(traceCitee).isDirectory()) {
      const empreinteDisque = sha256File(traceCitee);
      if (empreinteDisque !== recu.trace_lue.sha256) {
        refuse(
          `compare : la trace citée par le reçu ne rend plus son empreinte — ${empreinteDisque.slice(0, 8)} au disque, ` +
            `${String(recu.trace_lue.sha256).slice(0, 8)} au reçu (${display(traceCitee)}) ; le run jugé ne serait plus celui que le reçu a lu (H2)`,
        );
      }
    }
  }

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
    gel_verifie: gelVerifie,
    juge_le: localIso(),
    depuis_le_recu: display(receiptPath),
  };
  writeJson(outPath, sortie);
  console.log(`compare ok — ${cas} : verdict ${verdict}, limites « ${limites} » ; ${display(outPath)}`);
}

const COMMANDS = { freeze: cmdFreeze, preflight: cmdPreflight, collect: cmdCollect, faits: cmdFaits, receipt: cmdReceipt, compare: cmdCompare };
const a = parseArgs(process.argv.slice(2));
if (a.cmd === "help" || a.cmd === "--help" || a.has("help")) {
  console.log(USAGE);
  process.exit(0);
}
const commande = COMMANDS[a.cmd];
if (!commande) usage(`commande inconnue : ${a.cmd}`);
verifierPrerequis(a.cmd);
commande(a);
