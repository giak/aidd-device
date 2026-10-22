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
//            It writes <run>/gate.json last — the instant, the HEAD and porcelain it just
//            measured, and the freeze's fingerprint — and the receipt refuses a run that
//            carries no such trace (ADR-034).
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
//            byte to the file, which is then hashed into the receipt (ADR-032), the
//            budget of exchanges the case declares measured against the thread's `user`
//            messages, a run past it being refused (ADR-033), and the gate of the run
//            confronted to the gel, the tree and the run directory, a missing or foreign
//            gate being refused (ADR-034)
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
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  commandeAttendue as commandeAttendueClient,
  commandeExport,
  session as sessionClient,
  budget as budgetClient,
  exportTrace as exporterTrace,
  replayTrace as rejouerTrace,
} from "./clients.mjs";

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
  preflight --case <id> --run <dir> [--repertoire <chemin>] [--cases <dir>] [--texte <fichier>]
           la porte d'avant la session : refuse d'autoriser l'ouverture si le dossier
           n'est pas celui que le gel nomme « travail », ou si cet arbre n'est plus dans
           l'état gelé (§3). Sans --repertoire, le dossier examiné est le répertoire
           courant — celui où l'opérateur se trouve avant d'ouvrir. Le cas est re-haché
           comme au reçu : autoriser sur un cas qui a bougé n'autoriserait rien. Avec
           --texte, elle refuse aussi un texte qui n'est pas le §5 du cas, $RACINE
           substitué par la racine du gel : c'est le texte qui part vers la session, et
           une substitution ratée donnerait à lire un chemin qui n'existe pas.
           Elle écrit <run>/gate.json en dernier, après tous ses refus (ADR-034) :
           l'instant en secondes, le dossier autorisé, l'empreinte du gel et l'arbre
           mesuré, le texte remis s'il y en a un. --run est obligatoire, une porte ne
           s'écrase pas, et un --run qui n'est pas un répertoire est refusé : une porte
           qui ne laisse pas de trace ne serait plus une porte
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
  texte    --case <id> [--cases <dir>]
           imprime le §5 du cas, $RACINE substitué par la racine du gel — la même
           dérivation que la porte et le reçu emploient (texteDuCas), écrite sans saut
           de ligne final : la redirection vers texte-a-remettre.txt écrit alors
           exactement les octets que preflight --texte acceptera. La dérivation reste
           ici, une fois : une
           deuxième copie dériverait comme deux copies du gabarit d'export auraient
           dérivé (ADR-032)
  faits    --case <id> --client <freebuff|opencode> [--base <desktop-v2.db>] [--store <dir>]
           --fil <id> --trace <fichier> --out <faits.json> --par <qui> --fin <date -Is>
           --temoignage <texte> [--attendu-vu oui|non] [--cases <dir>]
           écrit les faits que receipt lira, sans les inventer : session (outil, application,
           identifiant, modele, ouverte_le), horodatage_debut (le premier message de l'utilisateur),
           le répertoire de travail, la trace. --client est optionnel : --base implique freebuff et
           --store implique opencode ; les deux ensemble sont un refus. Freebuff lit desktop-v2.db en
           -readonly ; opencode lit « opencode session export <id> » dans le répertoire de session et
           normalise le JSON en JSONL. Refuse un fil absent, un modèle vide, un chemin qui ne résout
           pas, un fil hors de l'arbre « travail » du gel, un fil en worktree, une fin antérieure au
           début, et un faits.json déjà écrit. --par, --fin et --temoignage sont les trois faits que
           seule une personne peut donner : rien ne les remplace
  receipt  --run <dir> --case <id> --faits <faits.json> [--verdict conforme|ecart|non concluant]
           [--limite <texte> ...] [--cases <dir>] [--sans-ecrire]
           --sans-ecrire calcule tout et n'écrit rien : le verdict qu'il proposerait, le
           nombre de limites et les morsures sont imprimés, et la même commande sans le
           drapeau écrirait le reçu. C'est ce qui permet de connaître le verdict que les
           falsificateurs imposent avant de consommer l'unique reçu (§6 : un reçu
           reconstruit est un témoignage)
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
           Il lit session.outil et trace.client, refuse s'ils diffèrent ou sortent de
           freebuff|opencode (ADR-044). Pour Freebuff il relit la base nommée par trace.base
           (ADR-031) : un fil absent, un project_path hors de l'arbre gelé, un mode non local,
           un worktree, un modèle ou une heure d'ouverture que la base démentent, sont des
           refus. Pour opencode il rejoue « opencode session export » dans trace.cwd et compare
           info.id, location.directory, model, time.created et le premier user (ADR-043).
           Il reconstruit la commande d'export, sans jamais exécuter la chaîne que la pièce
           cite (ADR-032) : trace.commande doit être égale à la commande reconstruite, puis
           l'export se rejoue et ses octets normalisés se comparent au fichier. Une différence
           est un refus ; trace_lue et trace_verifiee portent le sha256 et l'heure du rejeu.
           Il lit le budget d'échanges du cas dans son attendu et compte les messages
           user du fil (ADR-033) : au-delà du budget, un refus qui nomme les deux
           chiffres et le message en trop, un dépassement n'étant pas un plafond de
           verdict ; à l'épuisement exact, le reçu nomme l'échange qui l'a épuisé.
           Il lit enfin la porte du run (ADR-034) : absente, d'un autre cas, d'un autre
           gel, d'un autre arbre que celui du gel, d'un autre dossier que celui du run,
           antérieure au gel, d'un HEAD qui a bougé depuis elle, ou d'un texte qui n'est
           pas le §5 substitué, elle est refusée — et porte figure au reçu avec son
           sha256, que le juge relit.
           Il lit aussi l'attendu du cas : un falsificateur marqué a_remplir: true
           (le squelette de la fabrique, ADR-039) ajoute la limite attendu_incomplet et
           plafonne le verdict à non concluant — l'attendu d'un cas fabriqué dit ce
           qu'il ne sait pas encore, et le reçu ne le masque pas. Il lit le bloc
           cloisonnement (ADR-052) : lecture.autorisees fixe les racines lues,
           ecriture.autorisees le cadre du produit, reseau et fichiers_de_contexte
           les deux interdits déclarés. Un bloc absent ou invalide est un refus ; le
           harnais ne retombe jamais sur le dossier du cas.
           Il lit enfin la forme mécanique du tableau dans la trace exportée (ADR-035,
           H6) : un bloc d'au moins trois lignes dans une part text d'un message
           assistant, sa deuxième ligne séparatrice, sa première au moins une cellule.
           Le reçu écrit tableau{forme, present, seq, ts, lignes, colonnes} et confronte
           F2 (aucun tableau, ou une écriture avant lui — l'export gagne outil et
           chemin_outil) et F1 (naissance d'un produit contre l'instant du tableau).
  compare  --run <dir> --case <id> --difference <texte> --phrase <texte>
           --verdict conforme|ecart|non concluant [--limites mord|ne mord pas|non évaluable]
           [--cases <dir>]
           refuse de juger un cas dont les fichiers ne concordent plus avec le gel, ou
           dont le reçu cite une empreinte que le gel sur disque ne porte plus, ou dont
           la trace citée ne rend plus le sha256 que le reçu a écrit (ADR-032), ou dont
           la porte citée ne rend plus le sien (ADR-034) ; il refuse aussi une phrase qui
           nomme un nombre de colonnes différent de receipt.tableau.colonnes (ADR-048)

  prérequis (déclarés ici, sondés au démarrage ; un refus nomme l'outil, la commande, l'usage et le remède) :
    git --version                  toutes les commandes — les quatre arbres, leur porcelain
    date --iso-8601=seconds        toutes les commandes — geler, collecter, recevoir, juger
    date -d @<epoch>               faits et receipt — l'epoch du fil en date locale
    sqlite3 -version               faits et receipt, client Freebuff — la base, en -readonly
    opencode --version             faits et receipt, client opencode — l'export du CLI

  faits.json (receipt) : session{outil,application,identifiant,modele,ouverte_par,ouverte_le}
    horodatage_debut · horodatage_fin · repertoire_de_travail ·
    trace{client,source,chemin_exporte,commande} · cloisonnement{attendu_vu: oui|non}
    temoignage{qui,quand,texte}
    trace gagne base pour Freebuff, store/cwd/export_brut pour opencode

  receipt.json (spec §6) : les champs du §6, plus tableau (la forme mécanique du
    tableau rendu par la session, son instant, ses lignes et ses colonnes — H6),
    falsificateurs (les quatre conditions du §5, les trois de H6 et la lecture hors
    dossier : la 2e lit l'export ligne à ligne, F2 y ajoute la présence du tableau
    et l'ordre des écritures, F1 y ajoute la naissance des produits contre l'instant
    du tableau, question_sans_reponse y ajoute la question que la première écriture
    suit sans réponse (ADR-058), et lecture_hors_dossier nomme toute lecture hors des racines de
    cloisonnement.lecture.autorisees),
    trace_lue
    (lignes, échanges dans la fenêtre, lignes sans horodatage, illisibles, sha256 du
    fichier exporté, heure du rejeu — nuls quand la trace est absente), echanges
    (budget du cas, messages user du fil, et l'échange qui a épuisé le budget ;
    un dépassement refuse au lieu de s'écrire), porte (le gate.json lu, son sha256,
    son instant, l'empreinte du gel et l'arbre qu'il dit avoir mesuré), recu_ecrit_le,
    demande.gel et gel_verifie (l'empreinte et le nombre de fichiers que le reçu a
    re-hachés avant de s'écrire), cloisonnement{attendu_vu, lecture{autorisees,
    resolues}, ecriture{autorisees, resolues}, reseau, fichiers_de_contexte}.
    produit.chemins donne les chemins bruts,
    produit.fichiers le sha256, la taille et le birth de chacun. Les arbres gelés sont
    repris sous arbres.avant, remesurés sous arbres.apres ; les labels framework-origin
    et terrain alimentent en plus framework_rev et terrain_rev.
  output.json (spec §8) : cas, attendu, produit_brut, difference, verdict, limites,
    ecarte_comme_non_testable, phrase, et gel_verifie — le même re-hachage, refait
    avant que le juge tranche.`;

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const CASES_DEFAULT = join(REPO, "docs", "device", "CASES");
const BOOLEAN_FLAGS = new Set(["help", "refreeze", "sans-produit", "sans-ecrire"]);
const VERDICTS = new Set(["conforme", "ecart", "non concluant"]);
const LIMITES = new Set(["mord", "ne mord pas", "non évaluable"]);
// Labels whose revision the receipt names as its own fields (§6 `framework_rev`, `terrain_rev`).
const LABEL_TO_FIELD = { "framework-origin": "framework_rev", terrain: "terrain_rev" };
// The case's two copies are derived from the declared root: one label, one subdirectory, and
// nothing to keep in sync by hand.
const LABELS_DERIVES = { "revision-sous-test": "framework-origin", travail: "terrain" };
const cheminDerive = (racine, cas, label) => join(racine, cas, LABELS_DERIVES[label]);

// The judge writes a free sentence, and a free sentence is not judged. But the receipt measures the
// table it saw: when the phrase names a number of columns, that number is a fact the judge can check.
// The rule is deliberately mechanical — digits, or a French word from one to twenty, immediately
// followed by « colonne(s) » — so the judge never pretends to understand prose. The false sentence
// written on 2026-10-20 (« un tableau d'une colonne » against a receipt saying six) is the case this
// closes; a negation or a compound word stays outside the rule, and BANC.md says so.
const NOMBRES_EN_LETTRES = {
  un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9,
  dix: 10, onze: 11, douze: 12, treize: 13, quatorze: 14, quinze: 15, seize: 16, vingt: 20,
};
const MOTIF_COLONNES = /\b(\d+|un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingt)\s+colonnes?\b/gi;
function colonnesCitees(phrase) {
  const citees = [];
  for (const m of phrase.matchAll(MOTIF_COLONNES)) {
    const brut = m[1].toLowerCase();
    const valeur = /^\d+$/.test(brut) ? Number(brut) : NOMBRES_EN_LETTRES[brut];
    if (Number.isInteger(valeur)) citees.push({ valeur, texte: m[0] });
  }
  return citees;
}
function verifierPhraseColonnes(phrase, recu) {
  const mesure = recu?.tableau;
  if (!mesure || mesure.present !== true || !Number.isInteger(mesure.colonnes) || mesure.colonnes <= 0) return;
  const fausse = colonnesCitees(phrase).find((citee) => citee.valeur !== mesure.colonnes);
  if (!fausse) return;
  const mot = fausse.valeur > 1 ? "colonnes" : "colonne";
  refuse(
    `compare : la phrase cite ${fausse.valeur} ${mot}, le reçu en mesure ${mesure.colonnes} (« ${fausse.texte} ») — une phrase ne peut pas contredire le tableau mesuré (§8)`,
  );
}

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
    client: "freebuff",
    remede: "installer sqlite3",
  },
  {
    outil: "opencode",
    sonde: ["--version"],
    pour: "exporte la session opencode",
    commandes: ["faits", "receipt"],
    client: "opencode",
    remede: "installer opencode",
  },
];
function clientDemande(cmd, a) {
  if (cmd === "faits") {
    const c = a.one("client");
    if (c === "freebuff" || c === "opencode") return c;
    if (a.one("base")) return "freebuff";
    if (a.one("store")) return "opencode";
    return "freebuff";
  }
  if (cmd === "receipt") {
    try {
      return JSON.parse(readFileSync(resolve(a.one("faits")), "utf8")).session?.outil ?? null;
    } catch {
      return null;
    }
  }
  return null;
}
function verifierPrerequis(cmd, a) {
  const client = clientDemande(cmd, a);
  for (const { outil, sonde, pour, commandes, remede, client: pourClient } of PREREQUIS) {
    if (commandes && !commandes.includes(cmd)) continue;
    if (pourClient && client !== pourClient) continue;
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
// The §5 text handed to a session: the case's block with $RACINE substituted, so the case stays
// portable and the session still receives an absolute path (the lesson of the first run). Written
// once: preflight compares the file it hands over, and the receipt re-derives it to confront the
// sha256 the gate recorded (ADR-034). Two copies of this derivation would drift the same way two
// copies of the export template would have (ADR-032).
function texteDuCas(gel, casesDir, ou) {
  const racineEspace = gel.racine_espace_de_travail;
  if (!racineEspace) {
    refuse(`${ou} : le gel ne déclare aucune racine des espaces de travail (racine_espace_de_travail) — un gel d'avant la racine déclarée ne peut pas substituer $RACINE ; le refaire`);
  }
  const demande = (gel.fichiers ?? []).find((f) => f.role === "demande");
  if (!demande) refuse(`${ou} : le gel ne nomme aucun fichier « demande » — le §5 du cas n'a alors aucune source, et rien ne l'invente`);
  const chemin = cheminDuCas(demande.chemin, casesDir);
  const lignes = readFileSync(chemin, "utf8").split("\n");
  const debut = lignes.findIndex((l) => l.trim() === "<<<DEMANDE");
  const fin = lignes.findIndex((l) => l.trim() === ">>>DEMANDE");
  if (debut < 0 || fin <= debut) {
    refuse(`${ou} : ${display(chemin)} ne porte pas de bloc §5 (« <<<DEMANDE » puis « >>>DEMANDE ») — il n'y a pas de texte à remettre`);
  }
  return { chemin, texte: lignes.slice(debut + 1, fin).join("\n").split("$RACINE").join(racineEspace) };
}

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
  // H5 (ADR-034) : the gate writes what it measured, in the run directory, or it leaves no trace
  // and the receipt cannot tell a run that passed it from one that skipped it. No default: a gate
  // that guesses where to write attests a directory nobody chose.
  const runDir = resolve(a.required("run"));
  const gatePath = join(runDir, "gate.json");
  if (existsSync(gatePath)) {
    refuse(
      `preflight : ${display(gatePath)} existe déjà — une porte ne s'écrase pas : le premier passage aurait disparu, ` +
        `et un second passage est un autre acte ; faire un autre dossier de run (H5)`,
    );
  }
  if (existsSync(runDir) && !statSync(runDir).isDirectory()) {
    refuse(`preflight : le dossier du run (${runDir}) existe et n'est pas un répertoire — la porte s'écrit dans un dossier, et rien n'y serait écrit (H5)`);
  }
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
    const cheminTexte = resolve(a.one("texte"));
    if (!existsSync(cheminTexte)) refuse(`preflight : --texte ${cheminTexte} n'existe pas`);
    const derive = texteDuCas(gel, casesDir, "preflight");
    const recu = readFileSync(cheminTexte, "utf8");
    if (recu !== derive.texte) {
      const octets = (t) => Buffer.byteLength(t, "utf8");
      refuse(
        `preflight : --texte n'est pas le §5 du cas, $RACINE substitué — ${sha256Text(recu).slice(0, 8)} reçu (${octets(recu)} octets), ` +
          `${sha256Text(derive.texte).slice(0, 8)} attendu (${octets(derive.texte)} octets) ; la session lirait un chemin qui n'est pas celui du gel`,
      );
    }
    texte = { chemin: display(cheminTexte), sha256: sha256Text(recu), octets: Buffer.byteLength(recu, "utf8") };
  }

  // Written last, after every refusal: a gate that refuses leaves nothing, and a gate that writes
  // has measured. One `date` call, so the label and the epoch of the same instant cannot straddle a
  // second. The epoch is in seconds, like `gele_le_epoch` and `birth_epoch`, not milliseconds like
  // the thread's `ts` (H5).
  const pose = nowStamp();
  const porte = {
    type: "gate",
    cas,
    passe_le: pose.gele_le,
    passe_le_epoch: pose.gele_le_epoch,
    repertoire: declare,
    gel: { chemin: display(gelPath), empreinte: gel.empreinte, gele_le_epoch: gel.gele_le_epoch },
    arbre: mesure,
    texte,
  };
  writeJson(gatePath, porte);

  console.log(
    `preflight ok — ${cas} : ouverture autorisée dans ${declare} (HEAD ${mesure.head}, porcelain ${mesure.porcelain.length} ligne(s)) ; ` +
      `gel ${String(gel.empreinte).slice(0, 8)} re-haché, ${gelVerifie.fichiers} fichier(s) du cas et ${gelVerifie.references} référence(s)` +
      (texte ? ` ; texte ${texte.sha256.slice(0, 8)} (${texte.octets} octets) conforme au §5 substitué` : "") +
      ` ; porte ${display(gatePath)}`,
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
// The case declares its frame, and the receipt reads it instead of assuming the case folder. A
// missing block is a refusal, never a fallback to the old constant: a fallback would keep the
// assumption the block exists to remove. Paths are relative to the case root and no absolute path
// enters the block, so a case stays replayable on another machine; `..` is allowed because a case
// may declare a frame outside its own folder, and the block says so explicitly.
function lireCloisonnement(attendu, { cas, racineCas, ou }) {
  const c = attendu?.cloisonnement;
  if (c === null || typeof c !== "object" || Array.isArray(c)) {
    refuse(`${ou} : l'attendu du cas ${cas} ne déclare aucun bloc cloisonnement — le cadre n'est plus supposé, il se lit (ADR-052)`);
  }
  const liste = (valeur, champ) => {
    if (!Array.isArray(valeur) || valeur.length === 0) {
      refuse(`${ou} : ${champ} doit être une liste non vide de chemins relatifs à la racine du cas (${cas}) — un cadre vide ne se lit pas (ADR-052)`);
    }
    for (const p of valeur) {
      if (typeof p !== "string" || p.trim() === "" || isAbsolute(p)) {
        refuse(`${ou} : ${champ} porte ${JSON.stringify(p)}, attendu un chemin relatif non vide — la racine du cas est le seul point d'ancrage (ADR-052)`);
      }
    }
    return valeur.map((p) => p.trim());
  };
  const lecture = liste(c.lecture?.autorisees, "cloisonnement.lecture.autorisees");
  const ecriture = liste(c.ecriture?.autorisees, "cloisonnement.ecriture.autorisees");
  if (c.reseau !== "interdit" && c.reseau !== "autorise") {
    refuse(`${ou} : cloisonnement.reseau vaut ${JSON.stringify(c.reseau ?? null)}, attendu « interdit » ou « autorise » (ADR-052)`);
  }
  if (c.fichiers_de_contexte !== "interdits" && c.fichiers_de_contexte !== "autorises") {
    refuse(`${ou} : cloisonnement.fichiers_de_contexte vaut ${JSON.stringify(c.fichiers_de_contexte ?? null)}, attendu « interdits » ou « autorises » (ADR-052)`);
  }
  const produit = attendu?.attendu_details?.produit?.racine;
  if (produit !== undefined && produit !== null && produit !== "") {
    const produitResolu = resolve(racineCas, produit);
    if (!ecriture.some((p) => estDans(produitResolu, resolve(racineCas, p)))) {
      refuse(
        `${ou} : le produit du cas (${produit}) n'est sous aucune racine de cloisonnement.ecriture.autorisees ` +
          `(${ecriture.join(", ")}) — le cadre et le produit se contredisent (ADR-052)`,
      );
    }
  }
  return {
    lecture: { autorisees: lecture, resolues: lecture.map((p) => resolve(racineCas, p)) },
    ecriture: { autorisees: ecriture, resolues: ecriture.map((p) => resolve(racineCas, p)) },
    reseau: c.reseau,
    fichiers_de_contexte: c.fichiers_de_contexte,
  };
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

// The §1.5 export, written once in clients.mjs. `faits` puts this string into the piece; the
// receipt rebuilds it from the piece's fields and compares the two character for character
// (ADR-032). Two copies of the template would drift, and the drift would be invisible: the
// receipt would refuse a command faits itself wrote.

function choisirClientFaits(a) {
  const client = a.one("client");
  const base = a.one("base");
  const store = a.one("store");
  if (client !== undefined && client !== "freebuff" && client !== "opencode") {
    usage(`--client vaut « ${client} », attendu : freebuff | opencode`);
  }
  if (client === "freebuff") {
    if (!base) refuse("faits : --client freebuff exige --base — le fil Freebuff vit dans desktop-v2.db, et rien ne le devine (refus 1)");
    if (store) refuse("faits : --client freebuff refuse --store — ce store est celui d'opencode (refus 2)");
    return "freebuff";
  }
  if (client === "opencode") {
    if (base) refuse("faits : --client opencode refuse --base — la session opencode se lit par l'export de son CLI (refus 3)");
    return "opencode";
  }
  if (base && store) refuse("faits : --base et --store sans --client nomment deux clients — choisir avec --client (refus 17)");
  if (base) return "freebuff";
  if (store) return "opencode";
  usage("--client, --base ou --store est requis — le client est un fait du run, il ne se devine pas");
}

function cmdFaits(a) {
  const client = choisirClientFaits(a);
  if (client === "opencode") return cmdFaitsOpencode(a);
  const cas = a.required("case");
  const base = resolve(a.one("base"));
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
      outil: "freebuff",
      application: `Freebuff Desktop (desktop-v2.db${f.harness_id ? `, harness_id ${f.harness_id}` : ""})`,
      identifiant: f.id,
      modele: f.model,
      ouverte_par: par,
      ouverte_le: isoDeMs(f.created_at, "faits"),
    },
    horodatage_debut: debut,
    horodatage_fin: fin,
    repertoire_de_travail: travail,
    trace: { source: `${display(base)} (tables threads, messages)`, client: "freebuff", base, chemin_exporte: trace, commande },
    cloisonnement: { attendu_vu: attenduVu },
    temoignage: { qui: par, quand: fin, texte: temoignage },
  };
  writeJson(out, faits);
  console.log(`faits ok — ${cas} : fil ${f.id}, début ${debut}, fin ${fin} ; ${display(out)}`);
}

function cmdFaitsOpencode(a) {
  const cas = a.required("case");
  const fil = a.required("fil");
  if (!/^[A-Za-z0-9_-]{1,120}$/.test(fil)) refuse(`faits : « ${fil} » n'est pas un identifiant de fil — lettres, chiffres, tirets et soulignés seulement`);
  const trace = resolve(a.required("trace"));
  const out = resolve(a.required("out"));
  const par = a.required("par");
  const fin = a.required("fin");
  const temoignage = a.required("temoignage");
  const attenduVu = a.one("attendu-vu") ?? "non";
  if (attenduVu !== "oui" && attenduVu !== "non") refuse(`faits : --attendu-vu vaut « ${attenduVu} », attendu « oui » ou « non »`);
  const storeBrut = a.one("store") ?? (process.env.HOME ? join(process.env.HOME, ".local/share/opencode") : "");
  if (!storeBrut) refuse("faits : le store opencode se nomme par --store ou par HOME — sans lui, la session ne se lit pas");
  const store = resolve(storeBrut);
  if (!existsSync(dirname(out))) refuse(`faits : le dossier de ${display(out)} n'existe pas — les faits s'écrivent dans le dossier du run, ils ne le créent pas`);
  if (existsSync(out)) refuse(`faits : ${display(out)} existe déjà — les faits s'écrivent une fois, à chaud ; un fichier reconstruit est un témoignage (§6)`);
  if (!par.trim() || !temoignage.trim()) refuse(`faits : --par et --temoignage ne peuvent pas être vides — ces faits-là viennent de l'opérateur, jamais d'une machine`);
  const casesDir = casesDirOf(a);
  const gelPath = join(casesDir, `${cas}.freeze.json`);
  const gel = lireJson(gelPath, "faits");
  if (!gel) refuse(`faits : aucun gel ${display(gelPath)} — le répertoire du fil se compare à l'arbre « travail » du gel, sinon il n'y a rien à comparer`);
  const geleTravail = (gel.arbres ?? []).find((t) => t.label === "travail");
  if (!geleTravail) refuse("faits : le gel ne décrit aucun arbre « travail » — le répertoire du run ne se compare pas");
  let s;
  try {
    s = sessionClient("opencode", fil, { store, cwd: geleTravail.chemin });
  } catch (e) {
    refuse(`faits : ${e.message}`);
  }
  const finMs = Date.parse(fin);
  if (!Number.isFinite(finMs)) refuse(`faits : --fin « ${fin} » n'est pas une date lisible — l'heure de fin se lit avec date -Is`);
  if (finMs < Date.parse(s.premier_message.ts)) refuse(`faits : la fin (${fin}) précède le début (${s.premier_message.ts}) — un run ne se termine pas avant d'avoir commencé`);
  const brut = join(dirname(trace), "export-brut.json");
  let exp;
  try {
    exp = exporterTrace("opencode", fil, { store, cwd: s.repertoire_de_travail, dest: trace, brut });
  } catch (e) {
    refuse(`faits : ${e.message}`);
  }
  const faits = {
    session: {
      outil: "opencode",
      application: s.application,
      identifiant: s.identifiant,
      modele: s.modele,
      ouverte_par: par,
      ouverte_le: s.ouverte_le,
    },
    horodatage_debut: s.premier_message.ts,
    horodatage_fin: fin,
    repertoire_de_travail: s.repertoire_de_travail,
    trace: {
      source: exp.source,
      client: "opencode",
      store,
      cwd: s.repertoire_de_travail,
      chemin_exporte: trace,
      export_brut: brut,
      commande: exp.commande,
    },
    cloisonnement: { attendu_vu: attenduVu },
    temoignage: { qui: par, quand: fin, texte: temoignage },
  };
  writeJson(out, faits);
  console.log(`faits ok — ${cas} : fil ${s.identifiant}, début ${s.premier_message.ts}, fin ${fin}, client opencode ; ${display(out)}`);
}

// H1 (ADR-030)

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

// H6 (ADR-035) : F1 and F2 both speak of « the message that carries the table », and no mechanical form
// existed, so both stayed human readings (study §6, ombre 3). The form is written here, once: a block of
// at least three lines inside a `text` part of an assistant message, every line starting and ending with
// `|`, its second line a separator of dashes, colons and spaces carrying at least one dash, its first
// line at least one cell. What the session SHOWS is what it writes into a text part: a table rendered in
// `reasoning` is not shown to the operator, and does not count.
const FORME_TABLEAU = "text/assistant, >=3 lignes, 2e ligne séparatrice, >=1 colonne";
// A write act is a `tool` part whose name carries one of the declared words AND whose input names a path.
// Measured on this machine's client base (2026-10-18): `write_file` and `str_replace` carry `input.path`,
// `write_todos` carries `input.todos` and is the session's own bookkeeping, not a file of the product;
// `run_terminal_command` carries a command and no path, so a write done through the shell escapes the
// measure, which the limits say. The family is declared, never a client's tool list.
const MOTS_ECRITURE = /(write|edit|create|patch|apply|delete|move|rename)/i;
const MOTS_LECTURE = /(read|grep|glob|search|find|cat|view)/i;
const MOTS_SHELL = /(shell|bash|terminal|command)/i;
// ADR-058 : a question is a blocking act — the tool exists to stop the turn until the operator answers.
// Its family is declared here, like the three above, never read from a client's tool list: a question
// asked through another name escapes the measure, and the limits say so.
const MOTS_QUESTION = /(question|ask_user)/i;

function cellulesDe(ligne) {
  const t = typeof ligne === "string" ? ligne.trim() : "";
  if (!t.startsWith("|") || !t.endsWith("|") || t.length < 2) return null;
  return t.slice(1, -1).split("|").map((c) => c.trim());
}

// The first table of the trace, in the export's own order, or its absence said as one. The instant kept
// is the `ts` of the message that carries it: that is what F1 lacked, and what a product's birth is now
// compared to, in place of the freeze's instant only.
function tableauDeTrace(parties) {
  for (let index = 0; index < parties.length; index++) {
    const p = parties[index];
    if (p.role !== "assistant" || p.kind !== "text" || p.text === null) continue;
    const lignes = p.text.split("\n");
    for (let i = 0; i + 2 < lignes.length; i++) {
      const entete = cellulesDe(lignes[i]);
      if (!entete || entete.length < 1) continue;
      const sep = cellulesDe(lignes[i + 1]);
      if (!sep || !sep.every((c) => /^[-: ]*$/.test(c)) || !sep.some((c) => c.includes("-"))) continue;
      let n = 2;
      while (i + n < lignes.length && cellulesDe(lignes[i + n])) n++;
      if (n < 3) continue;
      return { forme: FORME_TABLEAU, present: true, index, seq: p.seq, ts: p.ts, lignes: n, colonnes: entete.length };
    }
  }
  return { forme: FORME_TABLEAU, present: false, index: null, seq: null, ts: null, lignes: 0, colonnes: 0 };
}

// ---------------------------------------------------------------------------
// shell — what a literal command does, and what it refuses to read (ADR-051)
// ---------------------------------------------------------------------------
// The trace carries the literal text of a tool's command (`commande`, written by clients.mjs).
// This is not an interpreter: it splits the text into segments, follows a literal `cd`, expands
// `~`, `$HOME` and a literal assignment referenced between double quotes, and names everything it
// cannot resolve. A command it cannot read refuses `conforme` and leaves a limit: never a silence.
// The initial directory is the gel's `travail`, because the trace records no cwd per command: the
// scan follows the text, not what a failed `cd` would have done.
const CLIENTS_RESEAU = new Set(["curl", "wget", "nc", "ssh"]);
// ADR-053 : `/dev/null` is a sink, not a path. A redirection to it (`2>/dev/null`) or a tool writing its
// output there (`-o /dev/null`) persists nothing and exists on every machine; counting it refused
// `conforme` for a shell idiom. The set is closed to that one path: another device file stays counted,
// and only the resolved path matches, so `dev/null` under the work tree remains an ordinary path.
const PUITS_SHELL = new Set(["/dev/null"]);
const estPuitsShell = (chemin) => PUITS_SHELL.has(chemin);
// The commands whose non-option arguments are paths. `git status` is not one of them: `status` is
// a verb, and reading it as a path under the work tree would only add noise.
const COMMANDES_A_CHEMIN = new Set([
  "cat", "ls", "head", "tail", "tee", "cp", "mv", "rm", "touch", "mkdir", "stat", "wc",
  "grep", "sed", "find", "diff", "sha256sum", "sort", "uniq", "chmod", "ln", "cd", "du",
  "file", "readlink", "realpath",
]);

const estCheminShell = (t) =>
  t.startsWith("/") || t === "~" || t.startsWith("~/") || t === "." || t === ".." ||
  t.startsWith("./") || t.startsWith("../") ||
  (t.includes("/") && !/^[A-Za-z][A-Za-z0-9+.-]*:\/\//.test(t));

// `;`, `&&`, `||` and `|` separate segments, outside quotes and outside `2>&1`. A lone `&` is a
// background separator; `>` keeps its own meaning and is tokenized below.
function segmentsShell(commande) {
  const segments = [];
  let courant = "";
  let quote = null;
  for (let i = 0; i < commande.length; i++) {
    const c = commande[i];
    if (quote !== null) {
      courant += c;
      if (c === quote) quote = null;
      else if (c === "\\" && quote === '"' && i + 1 < commande.length) courant += commande[++i];
      continue;
    }
    if (c === "'" || c === '"') { quote = c; courant += c; continue; }
    if (c === "\\" && i + 1 < commande.length) { courant += c + commande[++i]; continue; }
    if (c === ";" || c === "|") {
      segments.push(courant);
      courant = "";
      if (c === "|" && (commande[i + 1] === "|" || commande[i + 1] === "&")) i++;
      continue;
    }
    if (c === "&") {
      if (commande[i + 1] === "&") { segments.push(courant); courant = ""; i++; continue; }
      if (commande[i - 1] === ">" || /[0-9]/.test(commande[i + 1] ?? "")) { courant += c; continue; }
      segments.push(courant);
      courant = "";
      continue;
    }
    courant += c;
  }
  segments.push(courant);
  return segments.map((s) => s.trim()).filter(Boolean);
}

// A `for NAME in W1 W2 …; do … done` whose words are literals is unrolled before the segments are
// read: the body is copied once per word with `$NAME` and `${NAME}` substituted outside single quotes.
// The words stay literal — a glob is not expanded — and every shape the reader cannot bound (a word
// built from `$`, a backtick or a parenthesis, a nested loop, a body that reassigns the name, a loop
// never closed) is refused with its motif, never read as neutral. Recognising the keywords after
// `segmentsShell` means a `for` inside quotes is not a loop.
function substituerBoucle(texte, nom, valeur) {
  let sortie = "";
  let simple = false;
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i];
    if (c === "'") { simple = !simple; sortie += c; continue; }
    if (simple) { sortie += c; continue; }
    if (c === "\\" && i + 1 < texte.length) { sortie += c + texte[++i]; continue; }
    if (c !== "$") { sortie += c; continue; }
    const suite = texte.slice(i + 1);
    const acc = /^\{([A-Za-z_][A-Za-z0-9_]*)\}/.exec(suite);
    const nu = acc ? null : /^([A-Za-z_][A-Za-z0-9_]*)/.exec(suite);
    const lu = acc ? acc[1] : nu ? nu[1] : null;
    if (lu === null) { sortie += c; continue; }
    if (lu === nom) { sortie += valeur; i += (acc ?? nu)[0].length; continue; }
    sortie += acc ? `\${${lu}}` : `\$${lu}`;
    i += (acc ?? nu)[0].length;
  }
  return sortie;
}

function deroulerBoucles(segments) {
  const sortie = [];
  for (let i = 0; i < segments.length; i++) {
    const entete = /^for\s+([A-Za-z_][A-Za-z0-9_]*)\s+in\s+(.+)$/.exec(segments[i]);
    if (!entete) { sortie.push(segments[i]); continue; }
    const nom = entete[1];
    const mots = entete[2].trim().split(/\s+/).filter(Boolean);
    if (!mots.length) return { motif: `boucle « ${nom} » sans valeur` };
    for (const mot of mots) {
      if (/[$`(]/.test(mot)) return { motif: `boucle « ${nom} » non littérale` };
    }
    let profondeur = 1;
    let j = i + 1;
    const corps = [];
    for (; j < segments.length; j++) {
      const s = segments[j];
      if (/^for\s+/.test(s)) profondeur++;
      if (/^done\b/.test(s)) { profondeur--; if (profondeur === 0) break; }
      corps.push(s);
    }
    if (profondeur !== 0) return { motif: `boucle « ${nom} » non fermée` };
    if (corps.some((s) => /^for\s+/.test(s))) return { motif: `boucle « ${nom} » imbriquée` };
    if (corps.some((s) => new RegExp(`(^|[\\s;&|])${nom}=`).test(s))) return { motif: `boucle « ${nom} » qui réaffecte la variable` };
    const premier = corps.length ? corps[0].replace(/^do\b\s*/, "") : "";
    const corpsNet = [premier, ...corps.slice(1)].filter((s) => s !== "");
    for (const mot of mots) for (const s of corpsNet) sortie.push(substituerBoucle(s, nom, mot));
    i = j;
  }
  return { segments: sortie };
}

// ADR-056 : a command substitution is read only when its text is bounded — parentheses balanced outside
// quotes, no nested `$(`, no backtick inside, not empty, not the arithmetic form. Its inner command goes
// through the same reader, so its effects are measured, and its *value* stays unknown: the word that
// carries it is marked, and a marked word never becomes a path. The mark is a NUL byte, which no command
// text carries, and it survives the literal assignment (`n=$(…)` then `$n`).
const MARQUE_SUBSTITUTION = "\u0000";
const MOTIF_VALEUR_SUBSTITUEE = "chemin construit par une substitution $(...) : valeur inconnue";
const estMarque = (v) => typeof v === "string" && v.includes(MARQUE_SUBSTITUTION);

function extraireSubstitution(texte, i, motifs) {
  if (texte[i + 2] === "(") { motifs.push("arithmétique $((...)) non interprétée"); return null; }
  let profondeur = 0;
  let quote = null;
  for (let j = i + 2; j < texte.length; j++) {
    const c = texte[j];
    if (quote !== null) {
      if (c === quote) quote = null;
      else if (c === "\\" && quote === '"' && j + 1 < texte.length) j++;
      continue;
    }
    if (c === "'" || c === '"') { quote = c; continue; }
    if (c === "\\") { j++; continue; }
    if (c === "`") { motifs.push("substitution imbriquée non interprétée"); return null; }
    if (c === "(") {
      if (texte[j - 1] === "$") { motifs.push("substitution imbriquée non interprétée"); return null; }
      profondeur++;
      continue;
    }
    if (c === ")") {
      if (profondeur > 0) { profondeur--; continue; }
      const interieur = texte.slice(i + 2, j);
      if (!interieur.trim()) { motifs.push("substitution vide"); return null; }
      return { interieur, fin: j };
    }
  }
  motifs.push("substitution $(...) non fermée");
  return null;
}

// The inner command is read, never run: its reads, writes and network clients enter the lists of the
// segment that carries it, and a refusal inside it refuses the whole command. ADR-056 for a substitution,
// ADR-057 for `xargs` and `find -exec`: the three share this one merge, no second copy.
function fusionnerEffets(interne, ctx, motifs) {
  if (interne.motifs.length) { motifs.push(interne.motifs[0]); return false; }
  for (const p of interne.chemins) ctx.ajouter(ctx.chemins, p);
  for (const p of interne.ecritures) ctx.ajouter(ctx.ecritures, p);
  for (const p of interne.reseaux) ctx.ajouter(ctx.reseaux, p);
  return true;
}

function mesurerSubstitution(interieur, ctx, motifs) {
  return fusionnerEffets(ctx.mesurer(interieur, ctx.cwd), ctx, motifs);
}

// ADR-057 : `{}` (and the replacement string of `xargs -I`) is a value the reader cannot know. It is
// replaced by the same mark a substitution leaves, so a word built on it never becomes a path.
function marquerPlaceholder(texte, remplacement) {
  let sortie = texte.split("{}").join(MARQUE_SUBSTITUTION);
  if (remplacement && remplacement !== "{}") sortie = sortie.split(remplacement).join(MARQUE_SUBSTITUTION);
  return sortie;
}

// `xargs [options] [CMD ARG…]`: the options the tool accepts are skipped, `-a FILE` names a file it reads,
// and the first word left is the command. Without a command, `xargs` runs `echo` and measures nothing.
function lireXargs(args, ctx, motifs) {
  const aValeur = new Set(["-I", "-n", "-L", "-P", "-d", "-E", "-s"]);
  let remplacement = null;
  let i = 0;
  for (; i < args.length; i++) {
    const a = args[i];
    if (a === "--") { i++; break; }
    if (aValeur.has(a)) { if (a === "-I") remplacement = args[i + 1] ?? null; i++; continue; }
    if (a === "-a") { ctx.ajouter(ctx.chemins, cheminShell(args[i + 1] ?? "", ctx.cwd)); i++; continue; }
    if (/^-[ILnPdEs]./.test(a) || /^-a./.test(a)) {
      if (a.startsWith("-I")) remplacement = a.slice(2);
      if (a.startsWith("-a")) ctx.ajouter(ctx.chemins, cheminShell(a.slice(2), ctx.cwd));
      continue;
    }
    if (/^-[0rtpx]+$/.test(a) || !a.startsWith("-")) break;
  }
  const interne = args.slice(i);
  if (!interne.length) return { ok: true };
  if (ctx.profondeur > 0) return { ok: false, motif: "« xargs » imbriqué n'est pas interprété" };
  const texte = marquerPlaceholder(interne.join(" "), remplacement);
  return { ok: fusionnerEffets(ctx.mesurer(texte, ctx.cwd), ctx, motifs) };
}

// `find … -exec CMD ARG… ;` (or `-execdir`, `-ok`, and the `+` terminator): the inner command is read
// from the option to its terminator, `{}` marked as an unknown value. A block without a terminator is
// refused, never read as neutral.
function lireFindExec(jetons, k, ctx, motifs) {
  const ouvre = jetons.findIndex((t, j) => j > k && ["-exec", "-execdir", "-ok"].includes(t.mot));
  if (ouvre < 0) return { ok: true };
  let fin = -1;
  for (let j = ouvre + 1; j < jetons.length; j++) {
    if (jetons[j].mot === ";" || jetons[j].mot === "+") { fin = j; break; }
  }
  if (fin < 0) return { ok: false, motif: "« find -exec » non terminée" };
  const mots = jetons.slice(ouvre + 1, fin).map((t) => t.mot).filter(Boolean);
  if (!mots.length) return { ok: false, motif: "« find -exec » sans commande" };
  if (ctx.profondeur > 0) return { ok: false, motif: "« find -exec » imbriqué n'est pas interprété" };
  const texte = marquerPlaceholder(mots.join(" "), null);
  return { ok: fusionnerEffets(ctx.mesurer(texte, ctx.cwd), ctx, motifs), debut: ouvre, fin };
}

// Inside double quotes only `$HOME` and a literal assignment recorded earlier in the same command
// resolve; anything else is named as unresolved. Single quotes are literal, and a `\` escapes only
// `$`, a backtick, `"` and itself — the other backslashes stay, as in the shell.
function developperDouble(texte, vars, motifs, ctx) {
  let sortie = "";
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i];
    if (c === "\\" && i + 1 < texte.length) {
      const suivant = texte[i + 1];
      if (suivant === "$" || suivant === "`" || suivant === '"' || suivant === "\\") { sortie += suivant; i++; continue; }
      sortie += c;
      continue;
    }
    if (c === "`") { motifs.push("backtick non interprété"); return sortie; }
    if (c !== "$") { sortie += c; continue; }
    if (texte[i + 1] === "(") {
      const sub = extraireSubstitution(texte, i, motifs);
      if (!sub) return sortie;
      if (!mesurerSubstitution(sub.interieur, ctx, motifs)) return sortie;
      sortie += MARQUE_SUBSTITUTION;
      i = sub.fin;
      continue;
    }
    if (texte[i + 1] === "?") { sortie += "$?"; i++; continue; }
    let nom;
    if (texte[i + 1] === "{") {
      const fin = texte.indexOf("}", i + 2);
      if (fin < 0) { motifs.push("accolade non fermée"); return sortie; }
      nom = texte.slice(i + 2, fin);
      i = fin;
    } else {
      const m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(texte.slice(i + 1));
      if (!m) { sortie += "$"; continue; }
      nom = m[0];
      i += m[0].length;
    }
    if (nom === "HOME") { sortie += process.env.HOME ?? ""; continue; }
    if (Object.prototype.hasOwnProperty.call(vars, nom)) { sortie += vars[nom]; continue; }
    motifs.push(`variable non résolue « $${nom} »`);
    sortie += "$" + nom;
  }
  return sortie;
}

function jetonsShell(segment, vars, motifs, ctx) {
  const jetons = [];
  let mot = "";
  let ouvert = false;
  const finir = () => { if (ouvert) { jetons.push({ mot, redirection: false }); mot = ""; ouvert = false; } };
  for (let i = 0; i < segment.length; i++) {
    const c = segment[i];
    if (/\s/.test(c)) { finir(); continue; }
    if (c === "'") {
      const fin = segment.indexOf("'", i + 1);
      if (fin < 0) { motifs.push("guillemet simple non fermé"); return []; }
      mot += segment.slice(i + 1, fin);
      ouvert = true;
      i = fin;
      continue;
    }
    if (c === '"') {
      let j = i + 1;
      let dedans = "";
      let ferme = false;
      while (j < segment.length) {
        // The escape is kept for `developperDouble`, which decides what it means: dropping it here
        // would turn `\$HOME` into an expansion the shell never made.
        if (segment[j] === "\\" && j + 1 < segment.length && /["\\`$]/.test(segment[j + 1])) { dedans += segment[j] + segment[j + 1]; j += 2; continue; }
        if (segment[j] === '"') { ferme = true; break; }
        dedans += segment[j];
        j++;
      }
      if (!ferme) { motifs.push("guillemet double non fermé"); return []; }
      mot += developperDouble(dedans, vars, motifs, ctx);
      ouvert = true;
      i = j;
      continue;
    }
    if (c === "\\") { if (i + 1 < segment.length) { mot += segment[++i]; ouvert = true; } continue; }
    if (c === "`") { motifs.push("backtick non interprété"); return []; }
    if (c === "$") {
      if (segment[i + 1] === "(") {
        const sub = extraireSubstitution(segment, i, motifs);
        if (!sub) return [];
        if (!mesurerSubstitution(sub.interieur, ctx, motifs)) return [];
        mot += MARQUE_SUBSTITUTION;
        ouvert = true;
        i = sub.fin;
        continue;
      }
      if (segment[i + 1] === "?") { mot += "$?"; ouvert = true; i++; continue; }
      const m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(segment.slice(i + 1));
      if (m) { motifs.push(`référence non quotée « $${m[0]} »`); return []; }
      mot += "$";
      ouvert = true;
      continue;
    }
    if (c === ">") {
      if (/^\d+$/.test(mot) && ouvert) { mot = ""; ouvert = false; } else finir();
      if (segment[i + 1] === ">") { jetons.push({ mot: ">>", redirection: true }); i++; continue; }
      if (segment[i + 1] === "&") { i += 2; while (i < segment.length && !/\s/.test(segment[i])) i++; i--; continue; }
      jetons.push({ mot: ">", redirection: true });
      continue;
    }
    mot += c;
    ouvert = true;
  }
  finir();
  return jetons;
}

// A literal path, resolved against the segment's directory; links are resolved when the target
// exists, exactly as the read falsifier does, so a missing path is compared lexically.
function cheminShell(mot, cwd) {
  const brut = mot === "~" ? (process.env.HOME ?? "~") : mot.startsWith("~/") ? join(process.env.HOME ?? "~", mot.slice(2)) : mot;
  const abs = isAbsolute(brut) ? resolve(brut) : resolve(cwd, brut);
  return resolu(abs) ?? abs;
}

// The first non-option argument of `awk` and `sed` is their program, never a path: a range
// `/^a$/,/^b$/` starts with `/` and used to be counted as an absolute path, outside the frame. `-f`
// names a program file, which is a path and hides nothing; `-e` declares a script, so `sed` has no
// positional program left. `awk -v x=1` takes its value separately, and that value is not the program.
function indiceProgramme(jetons, k, nom, args) {
  if (nom !== "awk" && nom !== "sed") return -1;
  if (args.some((a) => a === "-f" || /^-f./.test(a))) return -1;
  if (nom === "sed" && args.some((a) => a === "-e" || /^-e./.test(a))) return -1;
  const aValeur = nom === "awk" ? new Set(["-v", "-F"]) : new Set();
  for (let i = k + 1; i < jetons.length; i++) {
    const t = jetons[i];
    if (t.redirection) continue;
    if (aValeur.has(t.mot)) { i++; continue; }
    if (t.mot.startsWith("-")) continue;
    return i;
  }
  return -1;
}

function effetsShell(commande, { cwd, profondeur = 0 }) {
  const vars = {};
  const chemins = [];
  const ecritures = [];
  const reseaux = [];
  // One filter, at the only place an effect enters a list: a sink is ignored for reads and writes alike,
  // and a word that carries a substitution's unknown value never enters one (ADR-056).
  let refus = null;
  const ajouter = (liste, valeur) => {
    if (estMarque(valeur)) { refus = MOTIF_VALEUR_SUBSTITUEE; return; }
    if (valeur && !estPuitsShell(valeur) && !liste.includes(valeur)) liste.push(valeur);
  };
  const arret = (motif) => ({ motifs: [motif], chemins: [], ecritures: [], reseaux: [] });
  let courant = cwd;
  const mesurer = (texte, ou) => effetsShell(texte, { cwd: ou, profondeur: profondeur + 1 });
  const decoupe = deroulerBoucles(segmentsShell(commande));
  if (decoupe.motif) return arret(decoupe.motif);
  for (const segment of decoupe.segments) {
    const motifs = [];
    refus = null;
    const ctx = { cwd: courant, profondeur, mesurer, ajouter, chemins, ecritures, reseaux };
    const jetons = jetonsShell(segment, vars, motifs, ctx);
    if (motifs.length) return arret(motifs[0]);
    let k = 0;
    while (k < jetons.length && !jetons[k].redirection) {
      const m = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(jetons[k].mot);
      if (!m) break;
      const valeur = m[2];
      if (valeur.includes("$") || valeur.includes("`") || valeur.includes("(") || /^~[^/]/.test(valeur)) {
        return arret(`affectation non littérale « ${m[1]} »`);
      }
      vars[m[1]] = valeur === "~"
        ? (process.env.HOME ?? "~")
        : valeur.startsWith("~/")
          ? join(process.env.HOME ?? "~", valeur.slice(2))
          : valeur;
      k++;
    }
    const nom = jetons[k] && !jetons[k].redirection ? basename(jetons[k].mot) : null;
    if (estMarque(nom)) return arret("commande construite par une substitution $(...) : valeur inconnue");
    const args = jetons.slice(k + 1).filter((t) => !t.redirection).map((t) => t.mot);
    const nonOption = args.filter((a) => !a.startsWith("-"));

    if (nom === "eval") return arret("« eval » n'est pas interprété");
    // ADR-057 : `xargs` and `find -exec` are read when their inner command is literal; the block of a
    // `find -exec` is then skipped by the path loop, since its words were read as a command, not as
    // arguments of `find`.
    let blocExec = null;
    if (nom === "xargs") {
      const lu = lireXargs(args, ctx, motifs);
      if (motifs.length) return arret(motifs[0]);
      if (!lu.ok) return arret(lu.motif);
    }
    if (nom === "find") {
      const lu = lireFindExec(jetons, k, ctx, motifs);
      if (motifs.length) return arret(motifs[0]);
      if (!lu.ok) return arret(lu.motif);
      if (lu.debut !== undefined) blocExec = lu;
    }
    // A commit or a checkout writes in the tree without naming a path, so no write target can be
    // compared to the product: it is refused as unreadable rather than counted as neutral (§4.3).
    if (nom === "git" && (nonOption[0] === "commit" || nonOption[0] === "checkout")) {
      return arret(`« git ${nonOption[0]} » écrit sans chemin attribuable`);
    }

    for (let i = 0; i < jetons.length; i++) {
      if (!jetons[i].redirection) continue;
      const cible = jetons[i + 1];
      if (!cible || cible.redirection) continue;
      if (/^~[^/]/.test(cible.mot)) return arret(`« ${cible.mot} » : ~user n'est pas interprété`);
      ajouter(ecritures, cheminShell(cible.mot, courant));
    }
    if (nom === "tee" || nom === "touch" || nom === "mkdir" || nom === "rm") {
      for (const a of nonOption) ajouter(ecritures, cheminShell(a, courant));
    }
    if (nom === "cp" || nom === "mv") {
      if (nonOption.length >= 2) ajouter(ecritures, cheminShell(nonOption[nonOption.length - 1], courant));
    }
    if (nom === "sed" && args.some((a) => a === "--in-place" || /^-i/.test(a))) {
      const avecE = args.some((a) => a === "-e" || /^-e/.test(a));
      for (const a of avecE ? nonOption : nonOption.slice(1)) ajouter(ecritures, cheminShell(a, courant));
    }

    if (CLIENTS_RESEAU.has(nom)) ajouter(reseaux, nom);
    if (nom === "git" && ["fetch", "push", "clone"].includes(nonOption[0])) ajouter(reseaux, `git ${nonOption[0]}`);
    if ((nom === "npm" || nom === "pip" || nom === "pip3") && nonOption[0] === "install") ajouter(reseaux, `${nom} install`);

    const consomme = COMMANDES_A_CHEMIN.has(nom);
    const programme = indiceProgramme(jetons, k, nom, args);
    for (let i = k + 1; i < jetons.length; i++) {
      if (blocExec && i >= blocExec.debut && i <= blocExec.fin) continue;
      const v = jetons[i].mot;
      if (i === programme || jetons[i].redirection || v === "" || v.startsWith("-")) continue;
      if (/^~[^/]/.test(v)) return arret(`« ${v} » : ~user n'est pas interprété`);
      if (!estCheminShell(v) && !consomme) continue;
      ajouter(chemins, cheminShell(v, courant));
    }
    if (nom === "cd") {
      const cible = args[0];
      if (cible === undefined) courant = process.env.HOME ?? courant;
      else if (cible === "-") return arret("« cd - » n'est pas interprété");
      else if (estMarque(cible)) return arret(MOTIF_VALEUR_SUBSTITUEE);
      else courant = cheminShell(cible, courant);
    }
    if (refus) return arret(refus);
  }
  return { motifs: [], chemins, ecritures, reseaux };
}

function cmdReceipt(a) {
  const runDir = resolve(a.required("run"));
  const cas = a.required("case");
  const verdict = a.one("verdict") ?? "non concluant";
  const sansEcrire = a.has("sans-ecrire");
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

  const outil = exigerChamp(faits, "session.outil", "receipt", "faits.json");
  if (outil !== "freebuff" && outil !== "opencode") {
    refuse(`receipt : session.outil vaut « ${outil} », attendu freebuff | opencode — le client est un fait du run, et un reçu ne lit pas un schéma qu'il ne connaît pas (ADR-044)`);
  }
  const clientTrace = exigerChamp(faits, "trace.client", "receipt", "faits.json");
  if (clientTrace !== outil) {
    refuse(`receipt : session.outil vaut « ${outil} », trace.client vaut « ${clientTrace} » — un run a un client, et deux champs qui se contredisent ne nomment aucun run (ADR-044)`);
  }
  const session = {
    outil,
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
    client: clientTrace,
    source: exigerChamp(faits, "trace.source", "receipt", "faits.json"),
    chemin_exporte: exigerChamp(faits, "trace.chemin_exporte", "receipt", "faits.json"),
    commande: exigerChamp(faits, "trace.commande", "receipt", "faits.json"),
  };
  if (outil === "freebuff") {
    trace.base = resolve(exigerChamp(faits, "trace.base", "receipt", "faits.json"));
  } else {
    trace.store = resolve(exigerChamp(faits, "trace.store", "receipt", "faits.json"));
    trace.cwd = resolve(exigerChamp(faits, "trace.cwd", "receipt", "faits.json"));
    trace.export_brut = resolve(exigerChamp(faits, "trace.export_brut", "receipt", "faits.json"));
  }
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
  // The tree the run was opened in, measured now: the gate confronts its own measurement to the
  // gel's, and the receipt confronts the gate's to this one (the HEAD comparison below).
  const apres = gel.arbres.map(gitTree);
  const geleTravail = gel.arbres.find((t) => t.label === "travail");
  const racineDeclaree = resolu(travail);
  const apresTravail = apres.find((t) => racineDeclaree !== null && resolu(resolve(t.chemin)) === racineDeclaree);

  // H5 (ADR-034) : preflight refuses a folder that is not the frozen one, then leaves nothing, so a
  // run that skipped the gate produced a receipt indistinguishable from one that passed it (study
  // §4, W5). The gate writes what it just measured, and the receipt confronts that trace to what it
  // can establish itself: the gel it re-hashed, the tree it re-measures, the run directory faits
  // names. Read here, after the fields and the paths and before the thread check: a gate is the
  // precondition of a run, not one of its pieces.
  const gatePath = join(runDir, "gate.json");
  if (!existsSync(gatePath)) {
    refuse(
      `receipt : aucune porte ${display(gatePath)} — la porte d'avant la session n'a pas laissé de trace : ` +
        `un reçu sans elle ne distingue plus un run qui a passé preflight d'un run qui l'a sauté (H5)`,
    );
  }
  if (!statSync(gatePath).isFile()) {
    refuse(`receipt : ${display(gatePath)} n'est pas un fichier — la porte est un fichier écrit par preflight, jamais un dossier, et rien n'y atteste un passage (H5)`);
  }
  const porte = lireJson(gatePath, "receipt");
  if (porte.type !== "gate") {
    refuse(
      `receipt : ${display(gatePath)} ne porte pas type « gate » (${JSON.stringify(porte.type ?? null)}) — ` +
        `un fichier d'une autre nature à ce chemin n'atteste pas un passage de porte (H5)`,
    );
  }
  const casPorte = exigerChamp(porte, "cas", "receipt", "gate.json");
  const repertoirePorte = exigerChamp(porte, "repertoire", "receipt", "gate.json");
  const gelPorte = {
    empreinte: exigerChamp(porte, "gel.empreinte", "receipt", "gate.json"),
    gele_le_epoch: exigerChamp(porte, "gel.gele_le_epoch", "receipt", "gate.json"),
  };
  const arbrePorte = {
    chemin: exigerChamp(porte, "arbre.chemin", "receipt", "gate.json"),
    head: exigerChamp(porte, "arbre.head", "receipt", "gate.json"),
    head_complet: exigerChamp(porte, "arbre.head_complet", "receipt", "gate.json"),
    porcelain: exigerChamp(porte, "arbre.porcelain", "receipt", "gate.json"),
  };
  if (casPorte !== cas) {
    refuse(`receipt : cette porte autorise le cas « ${casPorte} », le reçu traite « ${cas} » — elle a été passée pour un autre run (H5)`);
  }
  if (gelPorte.empreinte !== gel.empreinte) {
    refuse(
      `receipt : la porte cite l'empreinte du gel ${String(gelPorte.empreinte).slice(0, 8)}, le gel sur disque porte ` +
        `${String(gel.empreinte).slice(0, 8)} — le cas a été regelé depuis la porte, ou la porte vient d'un autre gel (H5)`,
    );
  }
  if (!geleTravail || resolu(resolve(arbrePorte.chemin)) !== resolu(resolve(geleTravail.chemin)) || !memeArbre(arbrePorte, geleTravail)) {
    refuse(
      `receipt : la porte dit avoir mesuré ${display(arbrePorte.chemin)} (HEAD ${arbrePorte.head}, porcelain ${JSON.stringify(arbrePorte.porcelain)}), ` +
        `le gel nomme « travail » ${display(geleTravail?.chemin ?? "(aucun arbre « travail »)")} ` +
        `(HEAD ${geleTravail?.head ?? "?"}, porcelain ${JSON.stringify(geleTravail?.porcelain ?? null)}) — ` +
        `la porte n'a pas été passée sur l'arbre du run (H5)`,
    );
  }
  if (resolu(repertoirePorte) !== resolu(travail)) {
    refuse(
      `receipt : la porte a autorisé ${repertoirePorte}, le run déclare ${travail} — ` +
        `l'ouverture autorisée et le dossier du run ne sont pas le même (H5)`,
    );
  }
  const passeLeEpoch = Number(porte.passe_le_epoch);
  if (!Number.isFinite(passeLeEpoch) || passeLeEpoch < Number(gelPorte.gele_le_epoch)) {
    refuse(
      `receipt : la porte est datée ${JSON.stringify(porte.passe_le_epoch ?? null)} (${String(porte.passe_le ?? "").slice(0, 32)}), ` +
        `le gel ${gelPorte.gele_le_epoch} — une porte antérieure au gel n'a rien pu mesurer, et une porte sans instant ne date aucun passage (H5)`,
    );
  }
  if (!apresTravail) {
    refuse(`receipt : ${travail} n'est pas un dépôt git lisible — la porte nomme un HEAD, et le reçu ne peut pas le mesurer (H5)`);
  }
  if (arbrePorte.head_complet !== apresTravail.head_complet) {
    refuse(
      `receipt : la porte a mesuré HEAD ${arbrePorte.head_complet}, le reçu mesure ${apresTravail.head_complet} — ` +
        `l'arbre de travail a été commité pendant le run, et le produit n'est plus ce qu'une session écrit dans un dossier (H5)`,
    );
  }
  if (porte.texte) {
    const derive = texteDuCas(gel, casesDir, "receipt");
    const shaTexte = sha256Text(derive.texte);
    if (porte.texte.sha256 !== shaTexte) {
      refuse(
        `receipt : la porte dit avoir remis ${String(porte.texte.sha256 ?? "(aucune empreinte)").slice(0, 8)}, ` +
          `le §5 substitué du cas porte ${shaTexte.slice(0, 8)} — le texte autorisé n'est pas celui du cas (H5)`,
      );
    }
  }
  const porteLue = {
    chemin: gatePath,
    sha256: sha256File(gatePath),
    cas: casPorte,
    passe_le: porte.passe_le,
    passe_le_epoch: porte.passe_le_epoch,
    repertoire: repertoirePorte,
    gel_empreinte: gelPorte.empreinte,
    gele_le_epoch: gelPorte.gele_le_epoch,
    arbre: arbrePorte,
    texte_sha256: porte.texte?.sha256 ?? null,
  };
  const traceExportee = resolve(trace.chemin_exporte);
  if (!existsSync(dirname(traceExportee))) {
    refuse(
      `receipt : le dossier du chemin exporté de la trace (${dirname(traceExportee)}) ne résout pas — faits refuse un chemin qui ne se situe pas ; ` +
        `un reçu ne recopie pas ce qu'il ne peut pas situer (§7)`,
    );
  }
  let sessionVerifiee;
  if (outil === "freebuff") {
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
  sessionVerifiee = {
    outil: "freebuff",
    base,
    fil: filBase.id,
    project_path: filBase.project_path,
    execution_mode: filBase.execution_mode,
    modele: filBase.model,
    ouverte_le: ouverteBase,
    premier_message: debutBase,
  };
  } else {
    // opencode : le store et le cwd sont des faits du run, pas des chemins de confort. Le reçu
    // rejoue l'export par l'adaptateur, dans le répertoire que faits a nommé, et confronte les
    // champs normalisés à ceux de la pièce.
    if (!existsSync(trace.store)) {
      refuse(`receipt : le store opencode (${trace.store}) n'existe pas — la session rejouée se lirait nulle part (ADR-044)`);
    }
    if (!statSync(trace.store).isDirectory()) {
      refuse(`receipt : le store opencode (${trace.store}) n'est pas un répertoire — un store se lit, il ne s'improvise pas (ADR-044)`);
    }
    if (!existsSync(trace.cwd)) {
      refuse(`receipt : le répertoire de session opencode (${trace.cwd}) ne résout pas — la trace se rejouerait ailleurs (ADR-044)`);
    }
    if (!statSync(trace.cwd).isDirectory()) refuse(`receipt : le répertoire de session opencode (${trace.cwd}) n'est pas un répertoire`);
    if (resolu(trace.cwd) !== resolu(travail)) {
      refuse(`receipt : trace.cwd vaut ${trace.cwd}, le gel nomme « travail » ${travail} — la trace se rejouerait dans un autre arbre que celui du run (refus 16)`);
    }
    let s;
    try {
      s = sessionClient("opencode", session.identifiant, { store: trace.store, cwd: trace.cwd });
    } catch (e) {
      refuse(`receipt : ${e.message}`);
    }
    if (s.application !== session.application) {
      refuse(`receipt : la session opencode se nomme « ${s.application} », le reçu dit « ${session.application} » — l'application du reçu est démentie`);
    }
    if (s.modele !== session.modele) {
      refuse(`receipt : la session opencode dit le modèle « ${s.modele} », le reçu dit « ${session.modele} » — le modèle du reçu est démenti (refus 15)`);
    }
    if (s.ouverte_le !== session.ouverte_le) {
      refuse(`receipt : la session opencode ouvre à ${s.ouverte_le}, le reçu dit ${session.ouverte_le} — l'heure d'ouverture est démentie (refus 15)`);
    }
    if (s.premier_message.ts !== horodatageDebut) {
      refuse(`receipt : la session opencode date son premier message à ${s.premier_message.ts}, le reçu dit ${horodatageDebut} — le début du run est démenti (refus 15)`);
    }
    if (resolu(s.repertoire_de_travail) !== resolu(travail)) {
      refuse(`receipt : la session opencode ouvre ${s.repertoire_de_travail}, le reçu dit ${travail} — des faits d'un run ouvert ailleurs nomment un produit que le gel ne couvre pas`);
    }
    sessionVerifiee = {
      outil: "opencode",
      store: trace.store,
      fil: s.identifiant,
      repertoire_de_travail: s.repertoire_de_travail,
      modele: s.modele,
      ouverte_le: s.ouverte_le,
      premier_message: s.premier_message.ts,
    };
  }
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
  const commandeAttendue = outil === "freebuff"
    ? commandeExport(trace.base, session.identifiant, traceExportee)
    : commandeAttendueClient("opencode", session.identifiant, { store: trace.store, cwd: trace.cwd });
  if (trace.commande !== commandeAttendue) {
    refuse(
      `receipt : trace.commande n'est pas la commande que ce run reconstruit — la pièce cite « ${court(trace.commande)} », ` +
        `le rejeu serait « ${court(commandeAttendue)} » ; une commande qu'on n'exécute pas se compare, et celle-ci ` +
        `ne décrit pas l'export lu (§1.5, H2)`,
    );
  }
  let traceRejouee = null;
  let brutInstable = false;
  if (existsSync(traceExportee)) {
    let rejoue;
    try {
      rejoue = rejouerTrace(outil, session.identifiant, outil === "freebuff" ? { base: trace.base } : { store: trace.store, cwd: trace.cwd });
    } catch (e) {
      refuse(`receipt : ${e.message}`);
    }
    const empreinteFichier = sha256File(traceExportee);
    if (rejoue.sha256 !== empreinteFichier) {
      const quoi = outil === "freebuff" ? "ce que la base rend" : "ce que le client rend";
      refuse(
        `receipt : la trace exportée ne rend pas ${quoi} pour le fil « ${session.identifiant} » — ` +
          `${empreinteFichier.slice(0, 8)} au fichier, ${rejoue.sha256.slice(0, 8)} au rejeu (${display(traceExportee)}) ; ` +
          `le fichier a été réécrit, tronqué ou complété après l'export, et la condition 2 du §5 se lirait sur un texte qui n'est plus le client`,
      );
    }
    traceRejouee = outil === "freebuff"
      ? { sha256: empreinteFichier, rejoue_le: localIso() }
      : { outil: "opencode", commande: commandeAttendue, cwd: trace.cwd, sha256: empreinteFichier, brut_sha256: rejoue.brut_sha256 ?? null, rejoue_le: localIso() };
    if (outil === "opencode" && rejoue.brut_sha256 && existsSync(trace.export_brut)) {
      brutInstable = sha256File(trace.export_brut) !== rejoue.brut_sha256;
    }
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
  const racineCas = gel.racine_espace_de_travail
    ? resolu(resolve(gel.racine_espace_de_travail, cas)) ?? resolve(gel.racine_espace_de_travail, cas)
    : resolve(travail, "..");
  const cadre = lireCloisonnement(attendu, { cas, racineCas, ou: "receipt" });
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
  // The factory's expected is a skeleton: the skill's promise falsifier is left for the person to
  // write, and it is marked `a_remplir: true` (ADR-039). An expectation that says what it does not
  // know yet cannot conclude: the limit is written, and the verdict is capped here — the cap lives
  // in the receipt because the receipt is the only piece that decides what a verdict may say. The
  // flag is read from the expected file itself, never from the gel: the gel hashes a case, it does
  // not interpret it.
  const aRemplir = (function cherche(v) {
    if (v === null || typeof v !== "object") return false;
    if (Array.isArray(v)) return v.some(cherche);
    return v.a_remplir === true || Object.values(v).some(cherche);
  })(attendu);
  // One query: how many `user` messages the thread carries, and the message of rank `budget`, which is
  // the exchange that exhausts the budget when there is one. Null when the rank does not exist.
  let mesuresBudget;
  try {
    mesuresBudget = budgetClient(outil, session.identifiant, budget, outil === "freebuff" ? { base: trace.base } : { store: trace.store, cwd: trace.cwd });
  } catch (e) {
    refuse(`receipt : ${e.message}`);
  }
  if (mesuresBudget === null || !Number.isInteger(mesuresBudget.utilises)) {
    refuse(
      `receipt : le client n'a pas rendu le compte des messages utilisateur du fil « ${session.identifiant} » — ` +
        `le budget d'échanges ne se mesure pas, et rien ne l'invente (H4)`,
    );
  }
  if (mesuresBudget.utilises > budget) {
    const auDela = outil === "freebuff"
      ? lireBase(
          trace.base,
          `select json_object('seq', seq, 'ts', ts) from messages where thread_id = '${session.identifiant}' and role = 'user' order by seq limit 1 offset ${budget};`,
          "receipt",
        )
      : { seq: mesuresBudget.au_dela_seq ?? null, ts: mesuresBudget.au_dela_ts ?? null };
    refuse(
      `receipt : le fil « ${session.identifiant} » porte ${mesuresBudget.utilises} messages utilisateur, le cas en autorise ${budget} — ` +
        `le rang ${budget + 1} (seq ${auDela?.seq ?? "?"}${auDela ? `, ${isoDeMs(auDela.ts, "receipt")}` : ""}) est au-delà du budget : ` +
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
  const partiesLues = [];
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
      partiesLues.push({
        index: partiesLues.length,
        seq: entree?.seq ?? null,
        role: entree?.role ?? null,
        kind: entree?.kind ?? null,
        outil: typeof entree?.outil === "string" ? entree.outil : null,
        chemin_outil: typeof entree?.chemin_outil === "string" ? entree.chemin_outil : null,
        commande: typeof entree?.commande === "string" ? entree.commande : null,
        text: typeof entree?.text === "string" ? entree.text : null,
        ts: Number.isFinite(Number(entree?.ts)) ? Number(entree.ts) : null,
      });
      const ts = Number(entree?.ts);
      if (!Number.isFinite(ts)) {
        traceLue.sans_horodatage++;
        continue;
      }
      if (ts >= debutMs && ts <= finMs) traceLue.echanges_dans_la_fenetre++;
    }
  }

  // The working directory is the tree the freeze names « travail », not any tree it happens
  // to describe: the original terrain is one of the four, and a run opened there would write
  // into the project the case means to leave untouched. Checked again at the receipt, because a
  // gate authorises an opening and a receipt must stand on the gel alone. Compared after the links
  // are resolved, as faits compares it: a session opened through a link into the frozen tree wrote
  // in that tree, and refusing it would refuse the file faits itself wrote (ADR-025).
  const avantTravail =
    geleTravail && racineDeclaree !== null && resolu(resolve(geleTravail.chemin)) === racineDeclaree ? geleTravail : null;
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

  // H6 (ADR-035) : the table's form, its instant, and the two conditions F1 and F2 declared and nothing
  // read. A write is a `tool` part whose name carries one of the declared words — a declared family, not
  // a client's tool list; a trace without the field can't be measured, and says so instead of passing.
  const tableau = tableauDeTrace(partiesLues);
  const ecrituresAvant = tableau.present
    ? partiesLues
        .filter((p) => p.kind === "tool" && p.outil !== null && p.chemin_outil !== null && MOTS_ECRITURE.test(p.outil) && Number(p.index) < Number(tableau.index))
        .map((p) => ({ seq: p.seq, index: p.index, ts: p.ts, outil: p.outil, chemin: p.chemin_outil }))
    : [];
  const produitsNeAvant = tableau.present && tableau.ts !== null
    ? manifeste.fichiers.filter((f) => f.birth_epoch !== null && f.birth_epoch * 1000 < tableau.ts).map((f) => ({ chemin: f.chemin, birth: f.birth, tableau_ts: tableau.ts }))
    : [];
  const outilsSansNom = partiesLues.filter((p) => p.kind === "tool" && p.outil === null).length;
  // A family name without a named path is an act the rule cannot classify: said as a limit, named, never
  // silently dropped (measured: `write_todos` is one on this machine).
  const outilsEcritureSansChemin = [...new Set(partiesLues.filter((p) => p.kind === "tool" && p.outil !== null && p.chemin_outil === null && MOTS_ECRITURE.test(p.outil)).map((p) => p.outil))];
  // ADR-058 : a question left unanswered. The write act is H6's (a family name AND a named path, no second
  // copy of the rule); the question is the last one before it, and the answer is a `user` part strictly
  // between the two. Without one, the session did not wait: the client annulled the question, and the pause
  // the case asks for was never measured. A question no write follows has nothing to compare, so it stays
  // silent — the limit names what this leaves out (a question in free text, a write through the shell).
  const premiereEcriture = partiesLues.find((p) => p.kind === "tool" && p.outil !== null && p.chemin_outil !== null && MOTS_ECRITURE.test(p.outil)) ?? null;
  const questionSansReponse = [];
  if (premiereEcriture) {
    const questions = partiesLues.filter((p) => p.kind === "tool" && p.outil !== null && MOTS_QUESTION.test(p.outil) && Number(p.index) < Number(premiereEcriture.index));
    const q = questions.length ? questions[questions.length - 1] : null;
    if (q) {
      const reponse = partiesLues.some((p) => p.role === "user" && Number(p.index) > Number(q.index) && Number(p.index) < Number(premiereEcriture.index));
      if (!reponse) {
        questionSansReponse.push({
          seq_question: q.seq, index_question: q.index, outil: q.outil,
          seq_ecriture: premiereEcriture.seq, index_ecriture: premiereEcriture.index,
        });
      }
    }
  }
  // A read outside the roots the case declares is a breach of the request's §7, whether or not the file
  // exists: the session had no business opening the kit of another case. The roots come from
  // `cloisonnement.lecture.autorisees`, never from the trace nor from a constant; relative paths are the
  // session's, resolved from the work tree. Links are resolved when the target exists; a path that does
  // not resolve is compared lexically, so a missing target cannot hide the breach. A `shell` part has no
  // `chemin_outil`: its text is read separately (ADR-051), so this falsifier is never fed by it twice.
  const cheminDepuis = (p) => {
    const abs = isAbsolute(p) ? resolve(p) : resolve(travail, p);
    return resolu(abs) ?? abs;
  };
  // ADR-054 : what the session read, resolved, earliest line kept. The product is compared to these
  // paths at receipt time, so a copy of a file read before it was born is F7's second form — the gel's
  // hashes alone never reach a snapshot left outside the frozen trees.
  const lecturesFaites = new Map();
  const noterLecture = (chemin, seq, ts) => {
    if (typeof chemin !== "string" || chemin === "") return;
    const c = cheminDepuis(chemin);
    const deja = lecturesFaites.get(c);
    if (!deja || Number(ts) < Number(deja.ts)) lecturesFaites.set(c, { seq, ts: Number(ts) });
  };
  const lecturesHorsDossier = [];
  const outilsLectureSansChemin = new Set();
  const outilsShell = new Set();
  const outilsShellSansCommande = new Set();
  for (const p of partiesLues) {
    if (p.kind !== "tool" || p.outil === null) continue;
    if (MOTS_SHELL.test(p.outil) && p.commande === null) outilsShellSansCommande.add(p.outil);
    if (!MOTS_LECTURE.test(p.outil)) continue;
    if (p.chemin_outil === null) {
      outilsLectureSansChemin.add(p.outil);
      continue;
    }
    noterLecture(p.chemin_outil, p.seq, p.ts);
    if (!cadre.lecture.resolues.some((r) => estDans(cheminDepuis(p.chemin_outil), r))) {
      lecturesHorsDossier.push({ seq: p.seq, index: p.index, ts: p.ts, outil: p.outil, chemin: p.chemin_outil });
    }
  }

  // ADR-051 : the five effects the product and the declared paths did not reach. The product's root comes
  // from the attendu, never from a constant; when the case declares none (`--sans-produit`, or no
  // `attendu_details.produit.racine`), every literal write target is listed and the receipt says why.
  const racineProduit = typeof attendu?.attendu_details?.produit?.racine === "string" && attendu.attendu_details.produit.racine.trim() !== ""
    ? resolve(racineCas, attendu.attendu_details.produit.racine)
    : null;
  const shellHorsDossier = [];
  const shellEcritureHorsProduit = [];
  const shellNonInterpretable = [];
  const appelsReseau = [];
  for (const p of partiesLues) {
    if (p.kind !== "tool" || p.outil === null || !MOTS_SHELL.test(p.outil)) continue;
    outilsShell.add(p.outil);
    const entree = { seq: p.seq, index: p.index, ts: p.ts, outil: p.outil, commande: p.commande };
    if (p.commande === null) {
      shellNonInterpretable.push({ ...entree, motif: "commande absente" });
      continue;
    }
    const effets = effetsShell(p.commande, { cwd: travail });
    if (effets.motifs.length) {
      shellNonInterpretable.push({ ...entree, motif: effets.motifs[0] });
      continue;
    }
    for (const chemin of effets.chemins) {
      noterLecture(chemin, p.seq, p.ts);
      if (!cadre.lecture.resolues.some((r) => estDans(chemin, r))) shellHorsDossier.push({ ...entree, chemin });
    }
    for (const chemin of effets.ecritures) {
      if (racineProduit === null || !estDans(chemin, racineProduit)) shellEcritureHorsProduit.push({ ...entree, chemin });
    }
    if (cadre.reseau === "interdit") for (const motif of effets.reseaux) appelsReseau.push({ ...entree, motif });
  }

  // ADR-051 : the new paths the gate did not see. `porcelain` is relative to the work tree, so each path
  // is prefixed `terrain/` before it meets the product root. Only additions are attributed: a modified or
  // deleted path was already known to the gate, and the limit says the comparison does not retain it.
  const porcelainAvant = new Set(arbrePorte.porcelain ?? []);
  const nouveauxPorcelain = (apresTravail.porcelain ?? []).filter((l) => !porcelainAvant.has(l));
  const produitRel = racineProduit === null ? null : relative(racineCas, racineProduit).split(sep).join("/");
  const horsProduit = [];
  for (const ligne of nouveauxPorcelain) {
    const brut = ligne.slice(3).trim().replace(/\/+$/, "");
    if (!brut) continue;
    const noms = brut.includes(" -> ") ? [brut.split(" -> ").pop()] : [brut];
    for (const nom of noms) {
      const cheminRel = `terrain/${nom.replace(/\/+$/, "")}`;
      if (produitRel !== null && estDans(cheminRel, produitRel)) continue;
      const nature = /(^|\/)\.freebuff(\/|$)/.test(cheminRel)
        ? "artefact_client"
        : /(^|\/)(AGENTS|CLAUDE)\.md$/.test(cheminRel) || /(^|\/)\.github\/copilot-instructions\.md$/.test(cheminRel)
          ? "contexte"
          : "produit";
      // The declared interdict commands the bite: a case that authorizes context files gets no entry
      // for one (ADR-051). An artifact of the client is a limit, never a bite.
      if (nature === "contexte" && cadre.fichiers_de_contexte !== "interdits") continue;
      if (!horsProduit.some((h) => h.chemin === cheminRel)) horsProduit.push({ chemin: cheminRel, nature });
    }
  }

  // ADR-054 : F7's second form, measured on the files the trace names as read. The read must precede
  // the product's birth, the file must lie outside the product, still exist, be an ordinary file, and
  // carry the product's sha256. A read file changed or deleted since is not recognised, and the limit
  // below says so rather than letting the silence pass for an absence of copy.
  // ADR-055 : `birth_epoch` is a whole second (`stat -c %W`), so a read stamped in that same second may
  // precede or follow the real birth. Only a strictly earlier second proves the order; the equal second
  // stays out of the bite and is named in a limit instead, as the gel's one-second ambiguity already is.
  const copiesDuneLecture = [];
  const frontieresDuneLecture = [];
  if (racineProduit !== null) {
    for (const f of manifeste.fichiers) {
      if (f.birth_epoch === null) continue;
      const sourceProduit = resolu(f.source) ?? f.source;
      for (const [lu, { seq, ts }] of lecturesFaites) {
        if (lu === sourceProduit || estDans(lu, racineProduit)) continue;
        if (!Number.isFinite(ts)) continue;
        const seconde = Math.floor(ts / 1000);
        if (seconde > f.birth_epoch) continue;
        if (!existsSync(lu)) continue;
        let st;
        try { st = lstatSync(lu); } catch { continue; }
        if (!st.isFile() || st.isSymbolicLink()) continue;
        if (sha256File(lu) !== f.sha256) continue;
        if (seconde === f.birth_epoch) {
          frontieresDuneLecture.push({ chemin: f.chemin, source: lu, seq });
          continue;
        }
        copiesDuneLecture.push({ chemin: f.chemin, source: lu, sha256: f.sha256, seq });
      }
    }
  }
  const falsificateurs = {
    birth_anterieur_au_gel: manifeste.fichiers.filter((f) => f.birth_epoch !== null && f.birth_epoch < gel.gele_le_epoch).map((f) => f.chemin),
    arbre_de_travail_inchange: manifeste.fichiers.length > 0 && memeArbre(avantTravail, apresTravail),
    produit_identique_a_une_empreinte_anterieure: [
      ...manifeste.fichiers
        .filter((f) => [...gel.fichiers, ...gel.references].some((g) => g.sha256 === f.sha256))
        .map((f) => ({ chemin: f.chemin, source: "gel", sha256: f.sha256 })),
      ...copiesDuneLecture,
    ],
    trace_sans_echange_dans_la_fenetre: traceLue.echanges_dans_la_fenetre === 0,
    tableau_absent: !tableau.present,
    ecriture_avant_tableau: ecrituresAvant,
    produit_ne_avant_le_tableau: produitsNeAvant,
    question_sans_reponse: questionSansReponse,
    lecture_hors_dossier: lecturesHorsDossier,
    shell_hors_dossier: shellHorsDossier,
    shell_ecriture_hors_produit: shellEcritureHorsProduit,
    shell_non_interpretable: shellNonInterpretable,
    reseau: appelsReseau,
    hors_produit: horsProduit,
  };

  // ADR-051 : a bite either blocks `conforme` only, or blocks every verdict but `non concluant`. A file
  // of the product written outside the product's root is a deviation the session can be charged with, so
  // it allows `ecart`; a file of context, an unreadable command, network, a read outside the frame, and
  // the four §5 conditions say the run is not measurable as the case describes, so they force
  // `non concluant`. `ecart` with no bite stays allowed: the judge may have read a difference the receipt
  // does not measure.
  const motifRefus = [];
  const motifsEcart = [];
  if (attenduVu === "oui") motifRefus.push("le cloisonnement est rompu : l'attendu a été vu (§3, §9)");
  if (falsificateurs.lecture_hors_dossier.length) {
    const l = falsificateurs.lecture_hors_dossier[0];
    motifRefus.push(`une lecture est sortie du cadre déclaré : seq ${l.seq}, outil « ${l.outil} », chemin ${l.chemin} (demande §7)`);
  }
  if (falsificateurs.shell_hors_dossier.length) {
    const e = falsificateurs.shell_hors_dossier[0];
    motifRefus.push(`une commande shell sort du cadre déclaré : seq ${e.seq}, outil « ${e.outil} », chemin ${e.chemin} (demande §7)`);
  }
  if (falsificateurs.shell_ecriture_hors_produit.length) {
    const e = falsificateurs.shell_ecriture_hors_produit[0];
    motifRefus.push(`une commande shell écrit hors du produit : seq ${e.seq}, outil « ${e.outil} », chemin ${e.chemin} (§4)`);
  }
  if (falsificateurs.shell_non_interpretable.length) {
    const e = falsificateurs.shell_non_interpretable[0];
    motifRefus.push(`une commande shell n'est pas interprétable : seq ${e.seq}, motif « ${e.motif} » (ADR-051)`);
  }
  if (falsificateurs.reseau.length) {
    const e = falsificateurs.reseau[0];
    motifRefus.push(`un appel réseau interdit : seq ${e.seq}, « ${court(e.motif)} » (cloisonnement.reseau)`);
  }
  for (const f of falsificateurs.hors_produit) {
    if (f.nature === "produit") motifsEcart.push(`un fichier hors du produit a été écrit : ${f.chemin} (§4)`);
    else if (f.nature === "contexte") motifRefus.push(`un fichier de contexte est écrit hors du produit : ${f.chemin} (§4, fichiers_de_contexte)`);
  }
  if (manifeste.fichiers.length === 0) motifRefus.push("la session n'a rien produit : le produit est sa sortie brute (§9)");
  if (falsificateurs.birth_anterieur_au_gel.length) motifRefus.push(`un fichier produit est né avant le gel : ${falsificateurs.birth_anterieur_au_gel.join(", ")} (§5, condition 1)`);
  if (falsificateurs.arbre_de_travail_inchange) motifRefus.push("le produit existe et l'arbre de travail est inchangé (§5, condition 3)");
  if (falsificateurs.produit_identique_a_une_empreinte_anterieure.length) {
    const cites = falsificateurs.produit_identique_a_une_empreinte_anterieure.map((f) => `${f.chemin} ← ${f.source}`);
    motifRefus.push(`le produit est identique à un fichier déjà présent avant le run : ${cites.join(", ")} (§5, condition 4)`);
  }
  if (falsificateurs.trace_sans_echange_dans_la_fenetre) {
    motifRefus.push("la trace exportée ne porte aucun échange dans la fenêtre du run (§5, condition 2)");
  }
  if (falsificateurs.tableau_absent) {
    motifRefus.push("la trace ne porte aucun tableau rendu par la session (§5, F2)");
  }
  if (falsificateurs.ecriture_avant_tableau.length) {
    const e = falsificateurs.ecriture_avant_tableau[0];
    motifRefus.push(`une écriture précède le tableau : seq ${e.seq}, outil « ${e.outil} » (§5, F2)`);
  }
  if (falsificateurs.produit_ne_avant_le_tableau.length) {
    motifRefus.push(`un produit est né avant le tableau : ${falsificateurs.produit_ne_avant_le_tableau.map((p) => p.chemin).join(", ")} (§5, F1)`);
  }
  if (falsificateurs.question_sans_reponse.length) {
    const q = falsificateurs.question_sans_reponse[0];
    motifRefus.push(
      `la session a posé une question et écrit sans réponse : question seq ${q.seq_question} (outil « ${q.outil} »), écriture seq ${q.seq_ecriture} — la pause demandée n'a pas eu lieu (ADR-058)`,
    );
  }

  if (motifRefus.length && verdict !== "non concluant") {
    refuse(`receipt : verdict « ${verdict} » refusé, le verdict suit la preuve (§7) : ${motifRefus.join(" ; ")}`);
  }
  // The incomplete expectation comes before the product-outside-the-product bite: it is a property of
  // the case, not of the run, and it is the one a person can act on first (ADR-039).
  if (aRemplir && verdict !== "non concluant") {
    refuse(
      `receipt : verdict « ${verdict} » refusé — l'attendu du cas porte un falsificateur marqué a_remplir, ` +
        `et un attendu incomplet plafonne le verdict à « non concluant » tant que la personne ne l'a pas rempli (attendu_incomplet, ADR-039)`,
    );
  }
  if (verdict === "conforme" && motifsEcart.length) {
    refuse(`receipt : verdict « conforme » refusé, un fichier est hors du produit (§4) : ${motifsEcart.join(" ; ")} — un écart ne se dit pas conforme`);
  }

  const limites = [...a.all("limite")];
  limites.push(
    `le cas limite l'écriture à ${cadre.ecriture.autorisees.join(", ")} ; ce reçu compare les cibles littérales des commandes shell et les chemins nouveaux du porcelain, pas les effets d'un binaire opaque (cloisonnement.ecriture)`,
  );
  if (cadre.reseau === "interdit") {
    limites.push(
      "le cas interdit le réseau ; les clients déclarés sont curl, wget, nc, ssh, git fetch/push/clone, npm install et pip install — un client non listé n'est pas mesuré (cloisonnement.reseau)",
    );
  }
  if (cadre.fichiers_de_contexte === "interdits") {
    limites.push(
      "le cas interdit les fichiers de contexte ; le reçu ne reconnaît que les noms déclarés — AGENTS.md, CLAUDE.md, .github/copilot-instructions.md (cloisonnement.fichiers_de_contexte)",
    );
  }
  if (aRemplir) {
    limites.push("l'attendu n'a pas de falsificateur de promesse : le jugement ne peut pas dire conforme (attendu_incomplet)");
  }
  const ambigus = manifeste.fichiers.filter((f) => f.birth_epoch !== null && f.birth_epoch >= gel.gele_le_epoch && f.birth_epoch - gel.gele_le_epoch <= 1);
  if (ambigus.length) {
    limites.push(`naissance à une seconde du gel (résolution du birth) : ${ambigus.map((f) => f.chemin).join(", ")} — la condition 1 du §5 ne les distingue pas`);
  }
  if (!existsSync(traceExportee)) limites.push("trace machine introuvable au chemin exporté — pièce (1) absente (§7 : verdict possible, limite dite)");
  if (brutInstable) {
    limites.push("export_brut_instable : le brut rejoué diffère du brut conservé — le JSONL normalisé reste la condition, le brut n'est qu'une pièce datée (ADR-046)");
  }
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
  if (outilsSansNom) {
    limites.push("l'ordre écriture/tableau n'est pas mesurable : la trace ne porte pas le nom des outils (H6)");
  }
  if (tableau.present && tableau.ts === null) {
    limites.push("le tableau n'est pas daté : la condition 1 du §5 se lit contre le gel seulement (H6)");
  }
  if (tableau.present && falsificateurs.ecriture_avant_tableau.length === 0 && outilsSansNom) {
    limites.push("aucun acte d'écriture ne précède le tableau dans la trace, mais la trace ne dit pas tout ce qui a été écrit (H6)");
  }
  if (outilsEcritureSansChemin.length) {
    limites.push(`outil(s) dont le nom évoque une écriture et qui ne nomment aucun chemin : ${outilsEcritureSansChemin.slice(0, 3).join(", ")} — l'ordre écriture/tableau ne les classe pas (H6)`);
  }
  limites.push(
    "la pause n'est mesurée que par l'outil de question déclaré (nom portant `question` ou `ask_user`) et contre le premier acte d'écriture nommé : une demande d'accord écrite dans un texte, une écriture faite par une commande shell, et un outil de question d'un autre nom ne sont pas vus (ADR-058)",
  );
  if (outilsLectureSansChemin.size) {
    limites.push(`outil(s) de lecture sans chemin : ${[...outilsLectureSansChemin].slice(0, 3).join(", ")} — la lecture hors dossier ne les classe pas`);
  }
  if (outilsShell.size) {
    limites.push(
      `les commandes shell sont lues quand leur texte est littéral (${[...outilsShell].slice(0, 3).join(", ")}) ; une commande construite dynamiquement n'est pas interprétée, et le reçu le dit`,
    );
    limites.push(
      "le répertoire initial d'une commande shell est le `travail` du gel ; le reçu suit le texte, donc un `cd` qui aurait échoué ne déplace pas la lecture (ADR-051)",
    );
    limites.push(
      "`/dev/null` est un puits : il n'est ni une lecture ni une écriture, les autres fichiers de périphérique restent comptés (ADR-053)",
    );
  }
  if (outilsShellSansCommande.size) {
    limites.push(`shell_sans_commande : la trace ne porte aucune commande pour ${[...outilsShellSansCommande].slice(0, 3).join(", ")} — ses effets ne sont pas mesurés`);
  }
  if (falsificateurs.shell_non_interpretable.length) {
    limites.push(
      `${falsificateurs.shell_non_interpretable.length} commande(s) shell non interprétable(s) : ${falsificateurs.shell_non_interpretable.slice(0, 2).map((e) => `seq ${e.seq} (${e.motif})`).join(", ")} — leurs effets ne sont pas mesurés`,
    );
  }
  if (lecturesFaites.size) {
    limites.push(
      "le produit est comparé par sha256 aux fichiers lus hors du produit, relus au reçu ; un fichier lu puis modifié ou supprimé ne peut plus être reconnu (ADR-054)",
    );
  }
  if (frontieresDuneLecture.length) {
    limites.push(
      `lecture dans la seconde de naissance du produit (résolution du birth) : ${frontieresDuneLecture
        .map((e) => `${e.chemin} ← ${e.source} (seq ${e.seq})`)
        .join(", ")} — l'ordre n'est pas décidable à la seconde, F7 ne mord pas, et un produit copié et lu dans cette seconde lui échappe (ADR-055)`,
    );
  }
  const artefactsClient = falsificateurs.hors_produit.filter((f) => f.nature === "artefact_client");
  if (artefactsClient.length) {
    limites.push(
      `artefact_client : ${artefactsClient.map((f) => f.chemin).join(", ")} — un artefact du client a été écrit hors du produit, et le reçu ne le compte pas comme une écriture de la session`,
    );
  }
  if (racineProduit === null) {
    limites.push(
      "le cas ne déclare aucune racine de produit : tous les chemins nouveaux du porcelain sont listés hors du produit, et aucun n'est distingué d'un produit légitime (ADR-051)",
    );
  }
  if (nouveauxPorcelain.length) {
    limites.push(
      "hors_produit ne retient que les chemins nouveaux du porcelain : une modification ou une suppression d'un fichier déjà présent hors du produit n'est pas attribuée au run (ADR-051)",
    );
    limites.push(
      "un dossier non suivi est une seule entrée du porcelain : le reçu nomme le dossier, pas chacun de ses fichiers ; les entrées sont comparées comme des chaînes, sans décoder les guillemets de git",
    );
  }
  for (const m of motifRefus) limites.push(m);
  for (const m of motifsEcart) limites.push(m);

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
    trace_verifiee: traceRejouee,
    tableau,
    echanges,
    porte: porteLue,
    arbres,
    produit,
    cloisonnement: { attendu_vu: attenduVu, ...cadre },
    temoignage,
    falsificateurs,
    verdict,
    limites,
  };
  // The dry run computes everything, refuses everything and writes nothing: it is how a person learns
  // the verdict the falsifiers impose before the one receipt of the run is consumed. It is not a
  // shortened path: every refusal above fired as usual, and the pieces it read were read the same way.
  if (sansEcrire) {
    const proposition = motifRefus.length
      ? `non concluant (${motifRefus.length} morsure(s) : ${motifRefus[0]})`
      : motifsEcart.length
        ? `ecart (${motifsEcart.length} morsure(s) hors produit : ${motifsEcart[0]})`
        : "conforme ou ecart — rien ne mord, la personne tranche (spec §3)";
    console.log(
      `receipt (à blanc) — ${cas} : verdict proposé ${proposition} ; produit ${manifeste.fichiers.length} fichier(s) ; ` +
        `${limites.length} limite(s) ; rien n'a été écrit — sans --sans-ecrire, la même commande écrirait ${display(receiptPath)}`,
    );
    return;
  }
  writeJson(receiptPath, recu);
  console.log(
    `receipt ok — ${cas} : verdict ${verdict} ; produit ${manifeste.fichiers.length} fichier(s) ; ` +
      `${limites.length} limite(s) ; ${display(receiptPath)}`,
  );
}

// ---------------------------------------------------------------------------
// texte — the §5, substituted, printed once
// ---------------------------------------------------------------------------
// The text that goes to the session is derived here and nowhere else: `preflight --texte` compares
// a file to this derivation byte for byte, the receipt re-derives it against the gate, and the
// orchestrator writes the file by running this command. A second derivation would drift exactly the
// way a second export template would have (ADR-032) — and the failure would be silent: a path that
// resolves nowhere, read by a session that then answers about another directory.
function cmdTexte(a) {
  const cas = a.required("case");
  const casesDir = casesDirOf(a);
  const gelPath = join(casesDir, `${cas}.freeze.json`);
  const gel = lireJson(gelPath, "texte");
  if (!gel) refuse(`texte : aucun gel ${display(gelPath)} — le §5 substitué se dérive du gel, et rien ne le devine`);
  const derive = texteDuCas(gel, casesDir, "texte");
  // No trailing newline: measured 2026-10-18, one extra newline made a 254-byte text weigh 255 and
  // the gate refused it (256 read against 255 expected on another root). The redirect writes the
  // bytes as they are, and the gate is the judge of whether they are the case's.
  process.stdout.write(derive.texte);
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

  // H5 (ADR-034) : the gate the receipt read is cited by its sha256, and the judge re-hashes it
  // before judging, as it re-hashes the trace above: a receipt citing a gate that is no longer the
  // one it read no longer judges the same run. Absent file: nothing to compare, the receipt already
  // said the absence.
  if (recu.porte?.sha256 && recu.porte.chemin) {
    const porteCitee = resolve(recu.porte.chemin);
    if (existsSync(porteCitee) && !statSync(porteCitee).isDirectory()) {
      const empreintePorte = sha256File(porteCitee);
      if (empreintePorte !== recu.porte.sha256) {
        refuse(
          `compare : la porte citée par le reçu ne rend plus son empreinte — ${empreintePorte.slice(0, 8)} au disque, ` +
            `${String(recu.porte.sha256).slice(0, 8)} au reçu (${display(porteCitee)}) ; le run jugé ne serait plus celui que le reçu a lu (H5)`,
        );
      }
    }
  }

  if (verdict !== "non concluant" && recu.verdict === "non concluant") {
    refuse(`compare : verdict « ${verdict} » refusé — le reçu conclut « non concluant » : ${recu.limites.join(" ; ")}`);
  }

  verifierPhraseColonnes(phrase, recu);

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

const COMMANDS = { freeze: cmdFreeze, preflight: cmdPreflight, collect: cmdCollect, faits: cmdFaits, receipt: cmdReceipt, compare: cmdCompare, texte: cmdTexte };
const a = parseArgs(process.argv.slice(2));
if (a.cmd === "help" || a.cmd === "--help" || a.has("help")) {
  console.log(USAGE);
  process.exit(0);
}
const commande = COMMANDS[a.cmd];
if (!commande) usage(`commande inconnue : ${a.cmd}`);
verifierPrerequis(a.cmd, a);
commande(a);
