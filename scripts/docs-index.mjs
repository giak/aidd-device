#!/usr/bin/env node
// docs-index.mjs — generates docs/index.md, docs/dashboard.md and docs/trace.md
// from the frontmatter of the documents under docs/.
//
// Dependency-free on purpose: this repository has no package.json, and reading
// four scalar keys does not justify adding one.
//
// Writes only those three files. Nothing outside docs/ is touched, and a file
// whose content has not changed is left alone — stamp included.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, relative } from "node:path";

const ROOT = process.cwd();
const DOCS = "docs";
const COMMAND = "node scripts/docs-index.mjs";
const STRICT = process.argv.includes("--strict");

// The vocabulary kanban's reader can convert. `todo` is deliberately absent:
// it does not exist upstream and would fall back to `unknown`.
const STATUSES = ["pending", "in-progress", "done", "blocked"];
const COLUMNS = ["todo", "in-progress", "done", "blocked", "unknown"];
const STATUS_TO_PROGRESS = {
  pending: "todo",
  "in-progress": "in-progress",
  done: "done",
  blocked: "blocked",
};

// The three generated documents belong to the manifest by construction, never
// read back from disk. Without that, the first run writes files the second run
// then has to describe and the tool only converges after two passes.
const GENERATED_DOCUMENTS = [
  {
    path: `${DOCS}/index.md`,
    name: "Index des documents",
    description: "Chaque document de docs/, avec son type, son statut et la date de son dernier commit",
    type: "index",
  },
  {
    path: `${DOCS}/dashboard.md`,
    name: "Tableau de bord documentaire",
    description: "Compte par colonne et documents groupés, dérivé du frontmatter",
    type: "dashboard",
  },
  {
    path: `${DOCS}/trace.md`,
    name: "Trace documentaire",
    description: "Chronologie des documents telle que git la date, du plus récent au plus ancien",
    type: "trace",
  },
];
const GENERATED = new Set(GENERATED_DOCUMENTS.map((document) => document.path));

function fieldsOf(documentPath) {
  const descriptor = GENERATED_DOCUMENTS.find((document) => document.path === documentPath);
  return {
    name: descriptor.name,
    description: descriptor.description,
    type: descriptor.type,
    status: "done",
  };
}

const STAMP_PLACEHOLDER = "STAMP";
const STAMP_PATTERN = /^> Généré le .* — ne pas éditer\.$/m;

// Two different things, kept apart: `errors` fails --strict, `notices` never does.
// A document that is simply not committed yet is not a vocabulary defect, and
// conflating them made --strict fail on every freshly written document.
const errors = [];
const notices = [];

function walk(directory) {
  const paths = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...walk(path));
    else if (entry.isFile() && entry.name.endsWith(".md")) paths.push(path);
  }
  return paths;
}

// Only the leading block, only scalar `key: value` pairs. Anything fancier is
// reported as unknown rather than guessed.
function parseFrontmatter(text) {
  if (!text.startsWith("---\n")) return {};
  const end = text.indexOf("\n---", 4);
  if (end === -1) return {};
  const data = {};
  for (const line of text.slice(4, end).split("\n")) {
    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, raw] = match;
    data[key] = raw.replace(/^["']|["']$/g, "").trim();
  }
  return data;
}

// Dates come from git, never from the document: ordering a trace on a declared
// date would be ordering it on a claim.
function gitDates(relPath) {
  try {
    const history = execFileSync("git", ["log", "--format=%cI", "--", relPath], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (!history) return { date: "unknown", updated: "unknown", tracked: false };
    const lines = history.split("\n").filter(Boolean);
    return { date: lines[lines.length - 1], updated: lines[0], tracked: true };
  } catch {
    return { date: "unknown", updated: "unknown", tracked: false };
  }
}

function describeDocument(absPath) {
  const path = relative(ROOT, absPath);
  const frontmatter = parseFrontmatter(readFileSync(absPath, "utf8"));
  const status = frontmatter.status ?? "unknown";
  if (status !== "unknown" && !STATUSES.includes(status)) {
    errors.push(`${path}: statut « ${status} » hors vocabulaire (attendu : ${STATUSES.join(" | ")})`);
  }
  const dates = gitDates(path);
  if (!dates.tracked) notices.push(`${path}: non suivi par git, date inconnue`);
  return {
    path,
    name: frontmatter.name ?? path.split("/").pop().replace(/\.md$/, ""),
    description: frontmatter.description ?? "",
    type: frontmatter.type ?? "unknown",
    status,
    column: STATUS_TO_PROGRESS[status] ?? "unknown",
    ...dates,
  };
}

function localTimestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  const offset = -now.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const minutes = Math.abs(offset);
  return (
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` +
    `${sign}${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`
  );
}

function relativeLink(path) {
  return `[${path.split("/").pop()}](${path.slice(DOCS.length + 1)})`;
}

function renderFrontmatter(fields) {
  const lines = Object.entries(fields).map(([key, value]) => `${key}: ${value}`);
  return `---\n${lines.join("\n")}\n---`;
}

function render(fields, body) {
  return `${renderFrontmatter(fields)}\n\n> ${STAMP_PLACEHOLDER}\n\n${body}\n`;
}

function withoutStamp(text) {
  const stripped = text.replace(STAMP_PATTERN, `> ${STAMP_PLACEHOLDER}`);
  return stripped.endsWith("\n") ? stripped : `${stripped}\n`;
}

function writeIfChanged(path, fields, body) {
  const target = join(ROOT, path);
  const candidate = render(fields, body);
  const existing = existsSync(target) ? readFileSync(target, "utf8") : null;
  if (existing !== null && withoutStamp(existing) === candidate) return false;
  const stamp = `Généré le ${localTimestamp()} par \`${COMMAND}\` — ne pas éditer.`;
  // A repository with no docs/ yet is a legitimate state, not a crash: measured
  // before this line existed, the run died on ENOENT with a stack trace.
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, candidate.replace(STAMP_PLACEHOLDER, stamp));
  return true;
}

function byPath(left, right) {
  return left.path.localeCompare(right.path);
}

function byRecency(left, right) {
  const leftDate = left.updated === "unknown" ? "" : left.updated;
  const rightDate = right.updated === "unknown" ? "" : right.updated;
  if (leftDate !== rightDate) return rightDate.localeCompare(leftDate);
  return left.path.localeCompare(right.path);
}

function buildIndex(documents) {
  const rows = [...documents].sort(byPath).map(
    (document) =>
      `| ${document.name} | ${document.type} | ${document.status} | ${document.updated} | ${relativeLink(document.path)} |`,
  );
  const body = [
    "| Document | Type | Statut | Dernier commit | Chemin |",
    "| --- | --- | --- | --- | --- |",
    ...rows,
    "",
    `${documents.length} document(s).`,
  ].join("\n");
  return [fieldsOf(`${DOCS}/index.md`), body];
}

function buildDashboard(documents) {
  // The generated files are left out of the counts: state must not depend on
  // its own output, or adding one file would move a total that names it.
  const counted = documents.filter((document) => !GENERATED.has(document.path));
  const lines = ["| Colonne | Nombre |", "| --- | --- |"];
  for (const column of COLUMNS) {
    lines.push(`| ${column} | ${counted.filter((document) => document.column === column).length} |`);
  }
  lines.push("", `${counted.length} document(s) comptés ; les fichiers générés en sont exclus.`);
  for (const column of COLUMNS) {
    const group = counted.filter((document) => document.column === column).sort(byPath);
    if (group.length === 0) continue;
    lines.push("", `## ${column} (${group.length})`, "");
    for (const document of group) {
      lines.push(`- ${relativeLink(document.path)} — ${document.type} — ${document.name}`);
    }
  }
  return [fieldsOf(`${DOCS}/dashboard.md`), lines.join("\n")];
}

function buildTrace(documents) {
  const rows = [...documents].sort(byRecency).map(
    (document) =>
      `| ${document.updated} | ${relativeLink(document.path)} | ${document.type} | ${document.status} |`,
  );
  const body = [
    "> Cette trace ne rapporte que ce que les documents déclarent et que git a commité.",
    "> Un document non commité, ou une modification faite sans document, n'y laisse aucune trace.",
    "",
    "| Date | Document | Type | Statut |",
    "| --- | --- | --- | --- |",
    ...rows,
    "",
    `${documents.length} document(s).`,
  ].join("\n");
  return [fieldsOf(`${DOCS}/trace.md`), body];
}

const authoredDocuments = existsSync(join(ROOT, DOCS))
  ? walk(join(ROOT, DOCS))
      .map((absPath) => relative(ROOT, absPath))
      .filter((path) => !GENERATED.has(path))
      .map((path) => describeDocument(join(ROOT, path)))
  : [];

// Dates still come from git for the generated files, so their row is dated as
// soon as they are committed.
const generatedDocuments = GENERATED_DOCUMENTS.map((document) => ({
  ...document,
  status: "done",
  column: "done",
  ...gitDates(document.path),
}));

const documents = [...authoredDocuments, ...generatedDocuments].sort(byPath);

const written = [];
for (const [path, [fields, body]] of [
  [`${DOCS}/index.md`, buildIndex(documents)],
  [`${DOCS}/dashboard.md`, buildDashboard(documents)],
  [`${DOCS}/trace.md`, buildTrace(documents)],
]) {
  if (writeIfChanged(path, fields, body)) written.push(path);
}

for (const error of errors) console.error(`docs-index: ${error}`);
for (const notice of notices) console.error(`docs-index (note): ${notice}`);
console.log(
  `docs-index: ${documents.length} document(s) lus, ${written.length} fichier(s) réécrit(s)` +
    (written.length > 0 ? ` (${written.join(", ")})` : " (rien à changer)"),
);

process.exit(STRICT && errors.length > 0 ? 1 : 0);
