#!/usr/bin/env node
// liens.mjs — le contrôle de liens du dépôt : il lit la prose, pas les citations (ADR-027).
//
// Pourquoi deux comptes. Le compte naïf — tout motif `](…)`, code compris — a été annoncé comme la mesure
// pendant trois séances : il compte des exemples de lien écrits entre backticks et fabrique des liens morts
// qui n'en sont pas (le journal portait deux `](../…)`). Le compte strict écarte blocs et segments de code :
// c'est celui qu'on cite, et le naïf est imprimé à côté pour que l'écart se lise au lieu de se discuter.
//
// Usage : node docs/device/harness/liens.mjs [--racine <dir>] [--json]
//         → une ligne de compte, un `MORT …` par lien mort en prose ; exit 0 si aucun, 1 sinon, 2 sur usage.
// Limites dites : les ancres (`#…`) ne sont pas vérifiées, et un bloc de code **indenté** n'est pas écarté —
// seul le bloc clôturé par ``` ou ~~~ l'est.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const USAGE = `liens.mjs — contrôle de liens des documents du dépôt (ADR-027)

  node docs/device/harness/liens.mjs [--racine <dir>] [--json]

  --racine <dir>  ce qu'on balaie (défaut : la racine du dépôt)
  --json           le même résultat en JSON, pour un autre script

  Lit tous les .md sous la racine, hors dossiers cachés. Écarte http(s), mailto, les schémas
  extérieurs, les ancres seules, les blocs clôturés et les segments entre backticks. Résout
  chaque cible relative depuis le fichier qui la porte. Imprime le compte strict puis le naïf.

  exit 0 : aucun lien mort en prose ; 1 : au moins un ; 2 : usage.`;

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const CIBLE = /\]\(([^)\s]+)\)/g;

function usage(message) {
  console.error("USAGE — " + message + "\n\n" + USAGE);
  process.exit(2);
}

function args(argv) {
  const a = { racine: REPO, json: false };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x === "--help" || x === "-h") {
      console.log(USAGE);
      process.exit(0);
    } else if (x === "--json") a.json = true;
    else if (x === "--racine") {
      const v = argv[++i];
      if (v === undefined) usage("--racine attend une valeur");
      a.racine = resolve(v);
    } else usage(`argument inattendu : ${x}`);
  }
  return a;
}

// Un dossier caché n'est pas un document du dépôt : .git, .freebuff, .agents, .specstory.
// Une copie de run (`raw/`) est verbatim : ses liens sont relatifs à l'arbre du terrain, pas au dépôt,
// et les vérifier fabriquerait des morts que le produit n'a pas (la copie n'est pas une prose du dépôt).
function fichiersMd(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const p = join(dir, e.name);
    const segments = p.split(sep);
    if (e.isDirectory()) {
      if (e.name === "raw" && segments.includes("device") && segments.includes("runs")) continue;
      fichiersMd(p, out);
    } else if (e.isFile() && e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

// Le code s'écarte avant tout comptage : blocs clôturés (``` ou ~~~, avec ou sans langue), puis segments
// entre backticks. L'ordre compte : un backtick de segment à l'intérieur d'un bloc ne doit pas survivre.
const sansCode = (texte) =>
  texte
    .replace(/^```[^\n]*\n[\s\S]*?^```[^\n]*$/gm, "")
    .replace(/^~~~[^\n]*\n[\s\S]*?^~~~[^\n]*$/gm, "")
    .replace(/`[^`\n]*`/g, "");

function cibles(texte) {
  const out = [];
  for (const m of texte.matchAll(CIBLE)) {
    let t = m[1];
    if (t.startsWith("<") && t.endsWith(">")) t = t.slice(1, -1);
    if (t.startsWith("#")) continue; // ancre de la même page : non vérifiée, dite en limite
    if (t.startsWith("//")) continue; // relatif au protocole : extérieur
    if (/^[a-z][a-z0-9+.-]*:/i.test(t)) continue; // http:, https:, mailto:, ssh:…
    out.push(t);
  }
  return out;
}

function resout(fichier, cible) {
  const sansAncre = cible.split("#")[0];
  if (sansAncre === "") return true;
  let p = sansAncre;
  try {
    p = decodeURIComponent(sansAncre);
  } catch {
    // une cible qui n'est pas de l'UTF-8 percent-encodé se résout telle quelle
  }
  return existsSync(resolve(dirname(fichier), p));
}

const a = args(process.argv.slice(2));
const resultat = { fichiers: 0, liens: 0, morts: [], ecartes: 0, naif: 0, morts_naifs: [] };

for (const fichier of fichiersMd(a.racine)) {
  resultat.fichiers++;
  const texte = readFileSync(fichier, "utf8");
  const strictes = cibles(sansCode(texte));
  const naives = cibles(texte);
  resultat.liens += strictes.length;
  resultat.naif += naives.length;
  resultat.ecartes += naives.length - strictes.length;
  for (const t of strictes) if (!resout(fichier, t)) resultat.morts.push({ fichier, cible: t });
  for (const t of naives) if (!resout(fichier, t)) resultat.morts_naifs.push({ fichier, cible: t });
}

if (a.json) {
  console.log(JSON.stringify({ ...resultat, limites: ["ancres non vérifiées", "bloc indenté non écarté"] }, null, 2));
} else {
  console.log(
    `liens — ${resultat.fichiers} fichier(s) : ${resultat.liens} lien(s) hors code, ${resultat.morts.length} mort(s) ; ` +
      `${resultat.ecartes} motif(s) \`](…)\` dans du code écarté(s) — ${resultat.naif} au compte naïf`,
  );
  for (const { fichier, cible } of resultat.morts) console.log(`  MORT ${fichier} -> ${cible}`);
  console.log("  (limites : ancres #… non vérifiées ; un bloc de code indenté n'est pas écarté)");
}
process.exit(resultat.morts.length ? 1 : 0);
