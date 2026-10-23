// clients.mjs — la frontière des deux clients.
//
// Un client n'est pas un schéma que le harnais lit directement : c'est une source de session et
// de trace, derrière une interface normalisée. Freebuff lit `desktop-v2.db` en -readonly ;
// opencode lit l'export JSON de son CLI. `faits`, `receipt` et `suite` parlent à cette frontière,
// jamais à un schéma de client (ADR-043).
//
// Les fonctions jettent une Error dont le message est le refus, sans préfixe : l'appelant le
// préfixe de sa commande (`faits :`, `receipt :`, `suite :`) et garde son code de sortie.
import { existsSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";

const sha256Buf = (b) => createHash("sha256").update(b).digest("hex");
const sha256Text = (t) => createHash("sha256").update(t).digest("hex");
const estDans = (p, racine) => p === racine || p.startsWith(racine + "/");
const resolu = (p) => {
  try {
    return execFileSync("realpath", [p], { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
};
const isoDeMs = (ms, ou) => {
  const n = Number(ms);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`${ou} : « ${ms} » n'est pas un horodatage — la source ne dit pas quand`);
  return execFileSync("date", ["-d", "@" + Math.floor(n / 1000), "--iso-8601=seconds"], { encoding: "utf8" }).trim();
};

// ---------------------------------------------------------------------------
// Freebuff — la requête d'export, écrite une fois (ADR-032)
// ---------------------------------------------------------------------------
// ADR-051 : the literal command of a tool travels with the part, so the receipt can read what a
// `shell` call did. Three field names are read, in this order, and only a JSON string counts: a
// number or an object at that place is not a command, and the line carries `null` instead. The
// receipt never re-runs this text; it compares paths it parses, and says what it cannot parse.
// La fenêtre est facultative et n'entre dans la requête que si une borne est nommée : sans borne, le
// SQL reste octet pour octet celui d'avant, et la commande relue d'un reçu existant ne diverge pas.
export const requeteExport = (fil, { depuis = null, jusqu = null } = {}) =>
  `select json_object('seq', m.seq, 'role', m.role, 'kind', json_extract(value,'$.kind'), ` +
  `'open', json_extract(value,'$.open'), 'outil', json_extract(value,'$.toolName'), ` +
  `'chemin_outil', json_extract(value,'$.input.path'), ` +
  `'commande', case when json_type(value,'$.input.command')='text' then json_extract(value,'$.input.command') ` +
  `when json_type(value,'$.input.cmd')='text' then json_extract(value,'$.input.cmd') ` +
  `when json_type(value,'$.input.script')='text' then json_extract(value,'$.input.script') end, ` +
  `'text', json_extract(value,'$.text'), 'ts', m.ts) from messages m, ` +
  `json_each(m.parts_json) where m.thread_id='${fil}'` +
  `${depuis === null ? "" : ` and m.ts >= ${Math.floor(depuis)}`}` +
  `${jusqu === null ? "" : ` and m.ts < ${Math.floor(jusqu)}`}` +
  ` order by m.seq, json_each.key;`;
export const commandeExport = (base, fil, trace, bornes = {}) => `sqlite3 -readonly ${base} "${requeteExport(fil, bornes)}" > ${trace}`;

function lireBase(base, sql, ou) {
  let sortie;
  try {
    sortie = execFileSync("sqlite3", ["-readonly", base, sql], { encoding: "utf8" });
  } catch (e) {
    if (e.code === "ENOENT") throw new Error(`${ou} : sqlite3 introuvable — cette commande lit la base du client, elle ne la devine pas`);
    throw new Error(`${ou} : la base ${base} est illisible — ${String(e.stderr ?? e.message).trim().split("\n")[0]}`);
  }
  const t = sortie.trim();
  if (t === "") return null;
  try {
    return JSON.parse(t);
  } catch {
    throw new Error(`${ou} : la réponse de la base n'est pas du JSON — ${t.slice(0, 120)}`);
  }
}

export function basesDuClient() {
  const home = process.env.HOME;
  if (!home) return [];
  const racine = join(home, ".config/freebuff-desktop/projects");
  if (!existsSync(racine)) return [];
  const bases = [];
  for (const projet of execFileSync("ls", ["-1", racine], { encoding: "utf8" }).split("\n").filter(Boolean)) {
    const db = join(racine, projet, "desktop-v2.db");
    if (existsSync(db)) bases.push(db);
  }
  return bases;
}
export function filDansBase(base, fil) {
  const r = spawnSync("sqlite3", ["-readonly", base, `select 1 from threads where id = '${fil.replace(/'/g, "''")}' limit 1;`], { encoding: "utf8" });
  if (r.status !== 0) return false;
  return (r.stdout || "").trim() === "1";
}
export function trouveBase(fil) {
  if (spawnSync("sqlite3", ["--version"], { encoding: "utf8" }).status !== 0) {
    throw new Error("sqlite3 est absent — la trace du fil vit dans la base du client, et elle ne se devine pas");
  }
  for (const base of basesDuClient()) if (filDansBase(base, fil)) return base;
  return null;
}

const sqlThread = (fil) =>
  `select json_object('id', id, 'project_path', project_path, 'execution_mode', execution_mode, 'branch', branch, 'worktree_path', worktree_path, 'harness_id', harness_id, 'model', model, 'created_at', created_at) from threads where id = '${fil}';`;
const sqlPremier = (fil) => `select json_object('ts', ts, 'seq', seq) from messages where thread_id = '${fil}' and role = 'user' order by seq limit 1;`;

// ---------------------------------------------------------------------------
// Freebuff — la session normalisée et les trois gestes sur la trace
// ---------------------------------------------------------------------------
export function sessionFreebuff(fil, { base, cwd } = {}) {
  if (!base) throw new Error("la base Freebuff n'est pas nommée");
  if (!existsSync(base)) throw new Error(`la base « ${base} » n'existe pas — le dossier du client se lit sous .freebuff/project-id, il ne se devine pas`);
  const f = lireBase(base, sqlThread(fil), "faits");
  if (!f) throw new Error(`aucun fil « ${fil} » dans « ${base} » — l'identifiant du fil se lit dans la base, il ne se devine pas`);
  if (!f.project_path) throw new Error(`le fil « ${fil} » ne nomme aucun project_path — le répertoire du run ne se devine pas`);
  if (!f.model) throw new Error(`le fil « ${fil} » ne nomme aucun modèle — le reçu refuse un champ vide, et le modèle est un fait`);
  if (f.execution_mode !== "local") throw new Error(`le fil « ${fil} » s'exécute en « ${f.execution_mode ?? "(vide)"} », pas en local — un run dans un autre environnement n'écrit pas dans l'arbre gelé`);
  if (f.branch || f.worktree_path) throw new Error(`le fil « ${fil} » vit dans un worktree (branche « ${f.branch ?? ""} », ${f.worktree_path ?? ""}) — il déplacerait le HEAD de la copie, et le produit sortirait de l'arbre gelé`);
  const travail = resolve(f.project_path);
  if (!existsSync(travail)) throw new Error(`le répertoire de travail du fil (${travail}) ne résout pas — le run aurait écrit nulle part`);
  if (!statSync(travail).isDirectory()) throw new Error(`« ${travail} » n'est pas un répertoire`);
  if (cwd !== undefined && resolu(cwd) !== resolu(travail)) {
    throw new Error(`le fil ouvre ${travail}, le gel nomme « travail » ${cwd} — des faits d'un run ouvert ailleurs nommeraient un produit que le gel ne couvre pas`);
  }
  const premier = lireBase(base, sqlPremier(fil), "faits");
  if (!premier) throw new Error(`le fil « ${fil} » ne porte aucun message utilisateur — le début du run ne se lit pas, et rien ne l'invente`);
  const ouverte = isoDeMs(f.created_at, "faits");
  const debut = isoDeMs(premier.ts, "faits");
  return {
    outil: "freebuff",
    application: `Freebuff Desktop (desktop-v2.db${f.harness_id ? `, harness_id ${f.harness_id}` : ""})`,
    identifiant: f.id,
    modele: f.model,
    ouverte_le: ouverte,
    repertoire_de_travail: travail,
    execution_mode: f.execution_mode,
    worktree: null,
    premier_message: { ts: debut, seq: premier.seq },
  };
}

export function exportFreebuff(fil, { base, dest, depuis = null, jusqu = null } = {}) {
  if (!base) throw new Error("la base Freebuff n'est pas nommée");
  mkdirSync(dirname(dest), { recursive: true });
  let octets;
  try {
    octets = execFileSync("sqlite3", ["-readonly", base, requeteExport(fil, { depuis, jusqu })], { maxBuffer: 64 * 1024 * 1024 });
  } catch (e) {
    if (e.code === "ENOENT") throw new Error("« sqlite3 » est introuvable — le rejeu de l'export ne se devine pas");
    throw new Error(`le rejeu de l'export sur ${base} a échoué — ${String(e.stderr ?? e.message).trim().split("\n")[0] || "sans message"} ; la pièce (1) du §5 ne se vérifie pas`);
  }
  writeFileSync(dest, octets);
  return {
    commande: commandeExport(base, fil, dest, { depuis, jusqu }),
    source: `${base} (tables threads, messages)`,
    cwd: null,
    sha256: sha256Buf(octets),
    brut_sha256: null,
  };
}

// ADR-076 : la liste qui aide à choisir un fil — des métadonnées seulement, aucun contenu de message.
// L'identifiant d'un fil ne se devine pas ; il se lit dans la base du client, borné par son activité.
// L'activité est le dernier message écrit, jamais `created_at` : une conversation reprise garde sa date
// de création, et borner sur elle rendait 0 fil pour un fil actif (spec du 2026-10-23 14:43).
export function filsFreebuff(depuis, { base } = {}) {
  if (!base) throw new Error("la base Freebuff n'est pas nommée");
  const ms = Number(depuis);
  if (!Number.isFinite(ms)) throw new Error(`« ${depuis} » n'est pas un horodatage — la liste se borne`);
  return lireBase(base,
    `select json_group_array(json_object('id', id, 'modele', modele, 'messages', messages, 'created_at', created_at, 'activite', activite)) ` +
    `from (select t.id as id, t.model as modele, t.created_at as created_at, ` +
    `coalesce(a.activite, t.created_at) as activite, coalesce(a.messages, 0) as messages ` +
    `from threads t left join (select thread_id, max(ts) as activite, count(*) as messages from messages group by thread_id) a ` +
    `on a.thread_id = t.id) as f where activite >= ${Math.floor(ms)} order by activite desc;`,
    "fils") ?? [];
}

export function replayFreebuff(fil, { base, depuis = null, jusqu = null } = {}) {
  if (!base) throw new Error("la base Freebuff n'est pas nommée");
  let octets;
  try {
    octets = execFileSync("sqlite3", ["-readonly", base, requeteExport(fil, { depuis, jusqu })], { maxBuffer: 64 * 1024 * 1024 });
  } catch (e) {
    if (e.code === "ENOENT") throw new Error("« sqlite3 » est introuvable — le rejeu de l'export ne se devine pas");
    throw new Error(`le rejeu de l'export sur ${base} a échoué — ${String(e.stderr ?? e.message).trim().split("\n")[0] || "sans message"} ; la pièce (1) du §5 ne se vérifie pas`);
  }
  return { octets, sha256: sha256Buf(octets), brut_octets: null, brut_sha256: null };
}

// ---------------------------------------------------------------------------
// opencode — le CLI rend un JSON, l'adaptateur le normalise en JSONL
// ---------------------------------------------------------------------------
function versionOpencode() {
  let sortie;
  try {
    sortie = execFileSync("opencode", ["--version"], { encoding: "utf8" }).trim();
  } catch (e) {
    if (e.code === "ENOENT") throw new Error("« opencode » est introuvable — le client opencode ne se devine pas");
    throw new Error(`« opencode --version » a échoué — ${String(e.stderr ?? e.message).trim().split("\n")[0] || "sans message"}`);
  }
  const m = sortie.match(/v?(\d+(?:\.\d+)*)/);
  return m ? m[1] : sortie;
}
function binOpencode() {
  try {
    return execFileSync("sh", ["-c", "command -v opencode"], { encoding: "utf8" }).trim() || "opencode";
  } catch {
    return "opencode";
  }
}
function exportBrutOpencode(fil, { cwd } = {}) {
  if (!cwd) throw new Error("le répertoire de session opencode n'est pas nommé");
  let sortie;
  try {
    sortie = execFileSync("opencode", ["session", "export", fil], { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  } catch (e) {
    if (e.code === "ENOENT") throw new Error("« opencode » est introuvable — le client opencode ne se devine pas");
    throw new Error(`l'export opencode du fil « ${fil} » a échoué dans ${cwd} — ${String(e.stderr ?? e.message).trim().split("\n")[0] || "sans message"}`);
  }
  try {
    return { brut: sortie, json: JSON.parse(sortie) };
  } catch {
    throw new Error(`l'export opencode du fil « ${fil} » n'est pas du JSON — ${sortie.trim().slice(0, 120)}`);
  }
}
function partsOf(m) {
  if (Array.isArray(m.parts)) return m.parts;
  if (Array.isArray(m.content)) return m.content;
  return [];
}
function roleOf(m) {
  // Le CLI réel écrit `type` au niveau du message ; la forme `info.role` reste lue pour les fixtures
  // et les exports d'une autre version, sans que l'une écrase l'autre.
  return m.type ?? m.info?.role ?? m.role ?? null;
}
function tsOf(m) {
  const t = Number(m.time?.created ?? m.info?.time?.created);
  return Number.isFinite(t) ? t : null;
}
function textOfPart(p) {
  return typeof p.text === "string" ? p.text : null;
}
function cheminOutil(p) {
  const i = p.state?.input ?? null;
  if (!i || typeof i !== "object") return null;
  return i.path ?? i.filePath ?? i.file_path ?? null;
}
// ADR-051 : same three names as the Freebuff query, same rule — only a string is a command.
function commandeOutil(p) {
  const i = p.state?.input ?? null;
  if (!i || typeof i !== "object") return null;
  for (const nom of ["command", "cmd", "script"]) if (typeof i[nom] === "string") return i[nom];
  return null;
}
export function normaliseOpencode(fil, j) {
  const messages = Array.isArray(j.messages) ? j.messages : null;
  if (!messages) throw new Error(`l'export opencode du fil « ${fil} » ne porte aucune liste de messages`);
  const lignes = [];
  messages.forEach((m, i) => {
    const seq = i + 1;
    const role = roleOf(m);
    const ts = tsOf(m);
    if (role === "user") {
      const parts = partsOf(m);
      const texte = typeof m.text === "string" ? m.text : parts.filter((p) => p.type === "text").map((p) => textOfPart(p) ?? "").join("");
      lignes.push({ seq, role, kind: "text", open: null, outil: null, chemin_outil: null, commande: null, text: texte, ts });
      for (const p of parts) {
        if (p.type === "synthetic" && typeof p.text === "string") {
          lignes.push({ seq, role, kind: "text", open: null, outil: null, chemin_outil: null, commande: null, text: p.text, ts });
        }
      }
      return;
    }
    for (const p of partsOf(m)) {
      if (p.type === "text") lignes.push({ seq, role, kind: "text", open: null, outil: null, chemin_outil: null, commande: null, text: textOfPart(p) ?? "", ts });
      else if (p.type === "reasoning") lignes.push({ seq, role, kind: "reasoning", open: null, outil: null, chemin_outil: null, commande: null, text: textOfPart(p) ?? "", ts });
      else if (p.type === "tool") lignes.push({ seq, role, kind: "tool", open: null, outil: p.name ?? null, chemin_outil: cheminOutil(p), commande: commandeOutil(p), text: null, ts });
      else if (p.type === "synthetic" && typeof p.text === "string") lignes.push({ seq, role, kind: "text", open: null, outil: null, chemin_outil: null, commande: null, text: p.text, ts });
      else if (p.type === "idle" && typeof p.text === "string" && p.text !== "") lignes.push({ seq, role, kind: "text", open: null, outil: null, chemin_outil: null, commande: null, text: p.text, ts });
    }
  });
  return lignes;
}

// La fenêtre d'opencode : l'export du CLI ne prend pas de bornes, le filtre s'applique donc aux lignes
// normalisées. Une ligne sans horodatage ne se borne pas : elle est refusée, jamais écartée en silence.
export function fenetrer(lignes, { depuis = null, jusqu = null } = {}) {
  if (depuis === null && jusqu === null) return lignes;
  const sans = lignes.find((l) => l.ts === null || l.ts === undefined || !Number.isFinite(Number(l.ts)));
  if (sans) throw new Error("une ligne de l'export n'a pas d'horodatage — une fenêtre ne se borne pas sur une ligne qui ne dit pas quand");
  return lignes.filter((l) => (depuis === null || Number(l.ts) >= depuis) && (jusqu === null || Number(l.ts) < jusqu));
}

export function sessionOpencode(fil, { store, cwd } = {}) {
  if (!store) throw new Error("le store opencode n'est pas nommé");
  if (!existsSync(store)) throw new Error(`le store opencode « ${store} » n'existe pas — la session ne se lit pas`);
  if (!statSync(store).isDirectory()) throw new Error(`« ${store} » n'est pas un répertoire — le store opencode en est un`);
  if (!cwd) throw new Error("le répertoire de session opencode n'est pas nommé");
  const { json: j } = exportBrutOpencode(fil, { cwd });
  const info = j.info ?? null;
  if (!info) throw new Error(`l'export opencode du fil « ${fil} » ne porte aucune en-tête info`);
  if (info.id !== fil) throw new Error(`l'export opencode décrit la session « ${info.id ?? "(aucune)"} », pas « ${fil} » — il ne se copie pas d'un fil à l'autre`);
  if (!info.location || typeof info.location.directory !== "string" || info.location.directory === "") {
    throw new Error(`l'export opencode du fil « ${fil} » ne nomme aucune location.directory — le répertoire du run ne se devine pas`);
  }
  if (!info.model) throw new Error(`l'export opencode du fil « ${fil} » ne nomme aucun modèle — le reçu refuse un champ vide, et le modèle est un fait`);
  if (!info.time || !Number.isFinite(Number(info.time.created))) {
    throw new Error(`l'export opencode du fil « ${fil} » ne nomme aucune time.created — l'heure d'ouverture ne se devine pas`);
  }
  const directory = resolve(info.location.directory);
  if (!existsSync(directory)) {
    throw new Error(`le répertoire de session ${info.location.directory} ne résout pas, le gel nomme « travail » ${cwd} — des faits d'un run ouvert ailleurs nommeraient un produit que le gel ne couvre pas`);
  }
  if (!statSync(directory).isDirectory()) throw new Error(`le répertoire de session ${info.location.directory} n'est pas un répertoire`);
  if (resolu(directory) !== resolu(cwd)) {
    throw new Error(`le répertoire de session ${info.location.directory} n'est pas le gel « travail » ${cwd} — des faits d'un run ouvert ailleurs nommeraient un produit que le gel ne couvre pas`);
  }
  const messages = Array.isArray(j.messages) ? j.messages : [];
  const premier = messages.find((m) => roleOf(m) === "user") ?? null;
  if (!premier) throw new Error(`l'export opencode du fil « ${fil} » ne porte aucun message utilisateur — le début du run ne se lit pas, et rien ne l'invente`);
  const idx = messages.indexOf(premier);
  const ts = tsOf(premier);
  if (ts === null) throw new Error(`le premier message utilisateur du fil « ${fil} » n'a pas d'horodatage — le début du run ne se date pas`);
  const modele = typeof info.model === "string"
    ? info.model
    : `${info.model.providerID ?? info.model.provider ?? info.model.providerId ?? "?"}/${info.model.id ?? info.model.modelID ?? "?"}`;
  const version = versionOpencode();
  return {
    outil: "opencode",
    application: `opencode ${version} (${binOpencode()}, agent ${info.agent ?? "?"})`,
    identifiant: String(info.id ?? fil),
    modele,
    ouverte_le: isoDeMs(info.time.created, "faits"),
    repertoire_de_travail: directory,
    execution_mode: "local",
    worktree: null,
    premier_message: { ts: isoDeMs(ts, "faits"), seq: idx + 1 },
  };
}

export function exportOpencode(fil, { store, cwd, dest, brut, depuis = null, jusqu = null } = {}) {
  if (!dest) throw new Error("le chemin de la trace normalisée n'est pas nommé");
  const { brut: raw, json: j } = exportBrutOpencode(fil, { cwd });
  const lignes = fenetrer(normaliseOpencode(fil, j), { depuis, jusqu });
  const texte = lignes.map((l) => JSON.stringify(l)).join("\n") + (lignes.length ? "\n" : "");
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, texte);
  if (brut) {
    mkdirSync(dirname(brut), { recursive: true });
    writeFileSync(brut, raw);
  }
  const version = versionOpencode();
  return {
    commande: `opencode session export ${fil}`,
    source: `opencode ${version} (CLI export, store ${store ?? "(défaut)"})`,
    cwd,
    sha256: sha256Text(texte),
    brut_sha256: sha256Text(raw),
  };
}

export function replayOpencode(fil, { store, cwd, depuis = null, jusqu = null } = {}) {
  const { brut: raw, json: j } = exportBrutOpencode(fil, { cwd });
  const lignes = fenetrer(normaliseOpencode(fil, j), { depuis, jusqu });
  const texte = lignes.map((l) => JSON.stringify(l)).join("\n") + (lignes.length ? "\n" : "");
  return { octets: Buffer.from(texte, "utf8"), sha256: sha256Text(texte), brut_octets: Buffer.from(raw, "utf8"), brut_sha256: sha256Text(raw) };
}

export function budgetOpencode(fil, n, { store, cwd } = {}) {
  const { json: j } = exportBrutOpencode(fil, { cwd });
  const users = (Array.isArray(j.messages) ? j.messages : []).filter((m) => roleOf(m) === "user");
  const rang = (k) => (k >= 0 && k < users.length ? users[k] : null);
  const epuise = rang(n - 1);
  const auDela = rang(n);
  return {
    utilises: users.length,
    epuise_seq: epuise ? (Array.isArray(j.messages) ? j.messages.indexOf(epuise) + 1 : null) : null,
    epuise_ts: epuise ? tsOf(epuise) : null,
    au_dela_seq: auDela ? (Array.isArray(j.messages) ? j.messages.indexOf(auDela) + 1 : null) : null,
    au_dela_ts: auDela ? tsOf(auDela) : null,
  };
}

export function detectAll(fil, { cwd, store } = {}) {
  const trouves = [];
  let base = null;
  try {
    base = trouveBase(fil);
  } catch {
    // Sans sqlite3, Freebuff ne parle pas ; opencode peut encore répondre, et la suite le dira.
  }
  if (base) trouves.push({ client: "freebuff", base });
  try {
    const { json: j } = exportBrutOpencode(fil, { cwd });
    if (j.info && j.info.id === fil) trouves.push({ client: "opencode" });
  } catch {
    // Un client absent ou une session illisible ne fabrique pas un candidat : l'autre client parle seul.
  }
  return trouves;
}

// L'interface du §3 nomme `detect` ; `detectAll` est la forme qui peut dire l'ambiguïté, et `detect`
// garde le premier candidat pour un appelant qui n'a pas besoin de la disputer.
export function detect(fil, opts = {}) {
  return detectAll(fil, opts)[0] ?? null;
}

export function premierMessage(client, fil, opts = {}) {
  return session(client, fil, opts).premier_message;
}

export function session(client, fil, opts = {}) {
  if (client === "freebuff") return sessionFreebuff(fil, opts);
  if (client === "opencode") return sessionOpencode(fil, opts);
  throw new Error(`client « ${client} » inconnu — freebuff ou opencode`);
}
export function exportTrace(client, fil, opts = {}) {
  if (client === "freebuff") return exportFreebuff(fil, opts);
  if (client === "opencode") return exportOpencode(fil, opts);
  throw new Error(`client « ${client} » inconnu — freebuff ou opencode`);
}
export function replayTrace(client, fil, opts = {}) {
  if (client === "freebuff") return replayFreebuff(fil, opts);
  if (client === "opencode") return replayOpencode(fil, opts);
  throw new Error(`client « ${client} » inconnu — freebuff ou opencode`);
}
export function budget(client, fil, n, opts = {}) {
  if (client === "freebuff") {
    const base = opts.base;
    return lireBase(base, `select json_object('utilises', (select count(*) from messages where thread_id = '${fil}' and role = 'user'), 'epuise_seq', (select seq from messages where thread_id = '${fil}' and role = 'user' order by seq limit 1 offset ${n - 1}), 'epuise_ts', (select ts from messages where thread_id = '${fil}' and role = 'user' order by seq limit 1 offset ${n - 1}));`, "receipt");
  }
  if (client === "opencode") return budgetOpencode(fil, n, opts);
  throw new Error(`client « ${client} » inconnu — freebuff ou opencode`);
}
export function commandeAttendue(client, fil, opts = {}) {
  if (client === "freebuff") {
    if (!opts.base || !opts.trace) throw new Error("la commande Freebuff attend la base et le chemin de la trace");
    return commandeExport(opts.base, fil, opts.trace);
  }
  if (client === "opencode") return `opencode session export ${fil}`;
  throw new Error(`client « ${client} » inconnu — freebuff ou opencode`);
}
