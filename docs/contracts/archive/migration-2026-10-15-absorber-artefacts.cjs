// migration-2026-10-15-absorber-artefacts.cjs — MIGRATION DEJA EXECUTEE, NE PAS RELANCER.
//
// Sens INVERSE de tools/build-depuis-source.mjs : il reconstitue la source a partir des
// artefacts. La regle du contrat est « la source est la verite, les artefacts se regenrent » ;
// relancer ceci ecrase la source avec un etat arbitraire des artefacts. C est exactement
// la faute commise le 2026-10-15, qui a permis d ecraser AGENTS.md avant toute validation.
//
// Conserve comme trace de la migration initiale (2026-10-15). Pour modifier le contrat :
// editer docs/contracts/versions/AGENTS-source.md, puis node tools/build-depuis-source.mjs

const core = fs.readFileSync(R + "AGENTS.md", "utf8");
const IDS = ["01-consign", "02-memory", "03-boundaries"];
const skills = {};
IDS.forEach((i) => (skills[i] = fs.readFileSync(R + ".agents/skills/" + i + "/SKILL.md", "utf8")));

// ---- noyau : tout ce qui precede la premiere section, verbatim ----
const premierSection = core.search(/^## /m);
if (premierSection < 0) throw new Error("aucune section dans le noyau");
const entete = core.slice(0, premierSection).replace(/\n+$/, "");
const blocs = core.slice(premierSection).replace(/\n+$/, "");
const NUCLEU = [...blocs.matchAll(/^## (\S+)$/gm)].map((m) => m[1]);

// ---- skills : frontmatter + sections, verbatim ----
const parse = (id) => {
  const t = skills[id];
  const i1 = t.indexOf("\n---\n");
  if (i1 < 0) throw new Error("pas de frontmatter : " + id);
  return { fm: t.slice(0, i1 + 5), corps: t.slice(i1 + 5).replace(/\n+$/, "") };
};

const L = [];
const w = (s = "") => L.push(s);
const barre = "=".repeat(74);

w("---");
w("name: Source unique du contrat — un fichier, quatre artefacts");
w("description: Contient le noyau et les trois skills, délimités par des marqueurs. AGENTS.md et .agents/skills/* en sont dérivés par tools/build-depuis-source.mjs. Ne jamais éditer un artefact : éditer ici.");
w("type: source");
w("status: done");
w("---");
w("");
w("# Source unique du contrat");
w("");
w(barre);
w("");
w("```");
w("docs/contracts/versions/AGENTS-source.md      CETTE SOURCE, la seule à éditer");
w("        │");
w("        ├── tools/build-depuis-source.mjs");
w("        │");
w("        ├── AGENTS.md                            noyau, 9 sections, chargé à chaque tour");
w("        ├── .agents/skills/01-consign/SKILL.md  CONSIGN + NAMING, à la pertinence");
w("        ├── .agents/skills/02-memory/SKILL.md   MEMORY, à la pertinence");
w("        └── .agents/skills/03-boundaries/SKILL.md  TERRITORY, à la pertinence");
w("```");
w("");
w("```sh");
w("node tools/build-depuis-source.mjs           # regénère les quatre");
w("node tools/build-depuis-source.mjs --check   # sort 1 si un artefact diffère de la source");
w("node tools/guard-agents.mjs                  # refus si une règle de la référence a disparu");
w("node tools/bilan-pertes.mjs                  # compte, sans rien empêcher");
w("```");
w("");
w("Un bloc porte les sections d'une seule maison. Une section présente dans deux blocs");
w("est refusée. Aucun cas particulier : le noyau se restitue tel quel, les skills aussi.");
w("");
w(barre);
w("");
w("<!-- noyau:begin -->");
w(entete);
w("");
w(blocs);
w("<!-- noyau:end -->");
w("");

IDS.forEach((id) => {
  const { fm, corps } = parse(id);
  w("<!-- skill:" + id + ":begin -->");
  w(fm + corps);
  w("<!-- skill:" + id + ":end -->");
  w("");
});

fs.writeFileSync(R + "docs/contracts/versions/AGENTS-source.md", L.join("\n"));

// ---- controle immediat ----
const src = L.join("\n");
const verifs = [
  ["Control spec", src.includes("Control spec:")],
  ["renvoi long (ids cites)", ["01-consign", "02-memory", "03-boundaries"].every((n) => src.includes("`" + n + "`"))],
  ["les 9 sections du noyau", NUCLEU.length === 9],
  ["la porte, une seule fois", src.split("No production before a written spec").length - 1 === 1],
  ["frontmatters", ["Consign and naming", "Memory discipline", "Repository boundaries"].every((n) => src.includes("name: " + n))],
  ["4 blocs", ["noyau", ...IDS.map((i) => "skill:" + i)].every((b) => src.includes(b + ":begin") && src.includes(b + ":end"))],
  ["le noyau restitue exactement", (entete.length + 2 + blocs.length + 1) === core.length],
];
console.log("=== la source est-elle complete ? ===");
let ko = 0;
verifs.forEach(([l, ok]) => { if (!ok) ko++; console.log("  " + (ok ? "ok      " : "ECHEC   ") + l); });
console.log("");
console.log("  noyau restituable : " + (entete.length + 2 + blocs.length + 1) + " car, AGENTS.md en fait " + core.length);
console.log("  source : " + fs.statSync(R + "docs/contracts/versions/AGENTS-source.md").size + " octets");
if (ko) process.exit(1);