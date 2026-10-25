// La page de décision (ADR-061, amendé le 2026-10-25) : `RESULTAT.md`, dérivé du reçu, de l'output, de
// la trace, de l'attendu et de la lecture déclarée par le cas. Ce module ne juge rien et n'invente aucune
// cause : chaque phrase vient d'un champ. Six sections, soixante lignes au plus : le verdict en trois
// phrases, le récit daté, la promesse clause par clause, la faute, ce que le run dit et ne dit pas, trois
// gestes. Aucun modèle, aucun réseau, aucune dépendance. Deux appels sur les mêmes pièces rendent le même
// fichier.
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import { createHash } from "node:crypto";

const VERDICTS = ["conforme", "ecart", "non concluant"];

// Le vocabulaire fermé des lectures (spec du 2026-10-22 07:33, §3 ; trace_texte ajouté par l'ADR-075).
// Une assertion hors de ces types n'est pas une mesure : elle se refuse, elle ne devient pas « non jugé ».
export const TYPES_ASSERTION = ["trace_outil", "trace_texte", "falsificateur_vide", "produit", "pause"];

// Les mots du dedans, interdits dans le corps de la page. Le plafond de lignes et le nombre de sections
// sont le contrat ; les mots sont le second : une page qui les emploie n'est pas une page de lecture.
const MOTS_INTERDITS = /\b(morsures?|mord(?:ent)?|falsificateurs?|porcelain|plafonn(?:é|ée|és|ées)|seq|reçus?|sha256|empreintes?|manifeste)\b|\braw\/|`(?:porte|gel)`/i;

const MAX_LIGNES = 60;

// Les phrases de la section 4 : une règle, une phrase, dans le vocabulaire de la personne. La clé brute
// ne doit jamais atteindre la page — le contrôle 234 le vérifie sur les seize clés.
const PHRASES_RECU = {
  tableau_absent: "la session n'a pas montré de tableau",
  ecriture_avant_tableau: "une écriture a précédé le tableau",
  produit_ne_avant_le_tableau: "le fichier a été écrit avant le tableau",
  question_sans_reponse: "la session a posé une question et écrit sans attendre la réponse",
  question_en_formulaire: "la session a posé sa question par un formulaire alors que le cas exige une question en texte",
  pause_non_tenue: "la session a écrit sans laisser la personne répondre",
  lecture_hors_dossier: "une lecture est sortie du dossier autorisé",
  ecriture_hors_dossier: "une écriture est sortie du dossier autorisé",
  code_hors_dossier: "un chemin du code exécuté est sorti du dossier autorisé",
  shell_hors_dossier: "une commande a lu hors du dossier autorisé",
  shell_ecriture_hors_produit: "une commande a écrit hors du fichier attendu",
  shell_invalide: "une commande était mal formée et le shell l'aurait refusée",
  shell_non_interpretable: "une commande n'a pas pu être lue",
  reseau: "un appel réseau interdit a eu lieu",
  hors_produit: "un fichier a été écrit hors du produit attendu",
  birth_anterieur_au_gel: "un fichier est né avant le gel du cas",
  arbre_de_travail_inchange: "le produit existe mais le dépôt n'a pas bougé",
  produit_identique_a_une_empreinte_anterieure: "le produit recopie un fichier déjà présent",
  trace_sans_echange_dans_la_fenetre: "la trace ne porte aucun échange dans la fenêtre du run",
  session_terminale_en_erreur: "la session s'est arrêtée sur une erreur et le run n'a pas été mesuré",
  produit_incomplet: "le produit n'a pas tous les fichiers que son propre plan annonce",
};

// Ce qu'une mesure vide dit de positif. Sans cette phrase, une clause tenue s'écrirait « aucune violation
// mesurée » quatre fois : exact, illisible.
const MESURES = {
  tableau_absent: "tableau rendu",
  ecriture_avant_tableau: "aucune écriture avant le tableau",
  produit_ne_avant_le_tableau: "aucun fichier né avant le tableau",
  question_sans_reponse: "réponse obtenue avant l'écriture",
  question_en_formulaire: "question posée en texte",
  pause_non_tenue: "pause tenue",
  lecture_hors_dossier: "aucune lecture hors dossier",
  ecriture_hors_dossier: "aucune écriture hors dossier",
  code_hors_dossier: "aucun chemin hors dossier",
  shell_hors_dossier: "aucune commande hors dossier",
  shell_ecriture_hors_produit: "aucune écriture shell hors produit",
  shell_invalide: "aucune commande mal formée",
  shell_non_interpretable: "toutes les commandes lisibles",
  reseau: "aucun appel réseau",
  hors_produit: "aucun fichier hors produit",
  birth_anterieur_au_gel: "aucun fichier né avant le cas",
  arbre_de_travail_inchange: "le dépôt a bougé",
  produit_identique_a_une_empreinte_anterieure: "aucune copie d'un fichier antérieur",
  trace_sans_echange_dans_la_fenetre: "des échanges dans la fenêtre",
  session_terminale_en_erreur: "la session n'a pas fini sur une erreur",
  produit_incomplet: "produit complet",
};

// Un geste qui sort du cadre est un fait de session, jamais une clause du skill. Trois familles : ce que
// la session fait (elle), ce que la procédure du skill n'obtient pas (le skill), et ce qui rend le run
// inexploitable (le run).
const FAITS_SESSION = new Set([
  "lecture_hors_dossier", "ecriture_hors_dossier", "code_hors_dossier", "shell_hors_dossier",
  "shell_ecriture_hors_produit", "shell_invalide", "shell_non_interpretable", "reseau", "hors_produit",
  "question_en_formulaire", "question_sans_reponse", "pause_non_tenue",
]);
const FAITS_SKILL = new Set(["tableau_absent", "ecriture_avant_tableau", "produit_ne_avant_le_tableau", "produit_incomplet"]);
const FAITS_DE_CHEMIN = new Set(["lecture_hors_dossier", "ecriture_hors_dossier", "shell_hors_dossier", "code_hors_dossier"]);

// L'ordre de lecture d'un fait : le produit et l'ordre d'abord, le cadre ensuite. Le premier fait nommé au
// §4 est celui qui interdit le verdict favorable, pas celui que l'objet a écrit en premier.
const PRIORITE = [
  "tableau_absent", "ecriture_avant_tableau", "produit_ne_avant_le_tableau", "question_sans_reponse",
  "question_en_formulaire", "pause_non_tenue", "produit_incomplet", "hors_produit", "lecture_hors_dossier",
  "ecriture_hors_dossier", "code_hors_dossier", "shell_hors_dossier", "shell_ecriture_hors_produit",
  "shell_invalide", "shell_non_interpretable", "reseau", "birth_anterieur_au_gel",
  "arbre_de_travail_inchange", "produit_identique_a_une_empreinte_anterieure",
  "trace_sans_echange_dans_la_fenetre", "session_terminale_en_erreur",
];

const EPREUVES = {
  lecture_hors_dossier: "une ligne qui dise de ne pas lire hors du dossier de travail",
  shell_hors_dossier: "une ligne qui dise de ne pas lire au-dessus du dossier de travail",
  reseau: "une ligne qui dise que le réseau est interdit",
  question_en_formulaire: "une ligne qui demande la question en texte",
  produit_incomplet: "une ligne qui dise de finir le produit annoncé",
};

const CAUSES = { modele: "modèle", cas: "cas", dispositif: "dispositif", skill: "skill", inconnu: "inconnue" };
const CAUSES_ARTICLE = { modele: "le modèle", cas: "le cas", dispositif: "le dispositif", skill: "le skill", inconnu: "l'inconnu" };

const texte = (valeur, defaut = "—") =>
  valeur === null || valeur === undefined || valeur === "" ? defaut : String(valeur);
const liste = (valeur) => (Array.isArray(valeur) ? valeur : []);
const pluriel = (n, mot, plurielMot = `${mot}s`) => `${n} ${n > 1 ? plurielMot : mot}`;
const cellule = (valeur) => texte(valeur).replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
const base = (chemin) => String(chemin || "").split("/").pop();
const borne = (valeur, largeur = 60) => {
  const t = String(valeur ?? "").replace(/\s+/g, " ").trim();
  return t.length > largeur ? `${t.slice(0, largeur - 3)}…` : t;
};
const cap = (phrase) => (phrase ? phrase.charAt(0).toUpperCase() + phrase.slice(1) : phrase);
const sansRappel = (t) => !String(t).trimStart().startsWith("<system-reminder>");
const deux = (n) => String(n).padStart(2, "0");
const heure = (ms) => {
  if (!Number.isFinite(Number(ms))) return "—";
  const d = new Date(Number(ms));
  return `${deux(d.getHours())}:${deux(d.getMinutes())}`;
};
const dureeCourte = (ms) => {
  if (!Number.isFinite(Number(ms)) || Number(ms) < 0) return "—";
  const s = Math.round(Number(ms) / 1000);
  const m = Math.floor(s / 60);
  return m ? `${m} min ${deux(s % 60)} s` : `${s} s`;
};
const ko = (octets) => (Number(octets) < 1024 ? `${Number(octets) || 0} octets` : `${Math.round(Number(octets) / 1024)} Ko`);
const dossier = (chemin) => {
  const morceaux = String(chemin || "").split("/");
  morceaux.pop();
  return morceaux.join("/");
};

function lireJson(chemin) {
  try {
    return JSON.parse(readFileSync(chemin, "utf8"));
  } catch {
    return null;
  }
}

function lireParts(chemin) {
  if (!existsSync(chemin)) return { present: false, parts: [], textes: [], temps: [] };
  const parts = [];
  const textes = [];
  const temps = [];
  for (const ligne of readFileSync(chemin, "utf8").split(/\r?\n/)) {
    if (!ligne.trim()) continue;
    let part;
    try {
      part = JSON.parse(ligne);
    } catch {
      continue;
    }
    if (part && Number.isFinite(part.ts)) temps.push(part.ts);
    if (part && part.kind === "tool" && typeof part.outil === "string") parts.push(part);
    if (part && part.kind === "text" && typeof part.text === "string") {
      textes.push({ seq: part.seq ?? null, role: part.role ?? null, text: part.text, ts: part.ts ?? null });
    }
  }
  return { present: true, parts, textes, temps };
}

// Même règle que `ouvrir` (ADR-072) : la dernière ligne non vide hors bloc, espaces de fin retirés.
function derniereLigneHorsBloc(contenu) {
  let dansBloc = false;
  let ligne = "";
  for (const brute of String(contenu).split(/\r?\n/)) {
    if (/^\s*```/.test(brute)) {
      dansBloc = !dansBloc;
      continue;
    }
    if (!dansBloc && brute.trim() !== "") ligne = brute.trimEnd();
  }
  return ligne;
}

/**
 * Vérifie une lecture avant qu'elle ne serve : chaque geste porte un nom, au moins une assertion, et un
 * `rang` facultatif qui le rattache à une clause de l'ordre du cas. Un rang hors domaine ou deux fois le
 * même se refusent : la page ne devine pas quel geste mesure quelle clause.
 */
export function verifierLecture(lecture, cas = null) {
  const refus = (message) => {
    throw new Error(`lecture : ${message}`);
  };
  const nomme = (valeur) => typeof valeur === "string" && valeur.trim();
  if (!lecture || typeof lecture !== "object" || Array.isArray(lecture)) refus("le fichier ne porte aucun objet lisible");
  if (cas && lecture.cas && lecture.cas !== cas) refus(`le fichier nomme le cas ${lecture.cas}, pas ${cas}`);
  if (!Array.isArray(lecture.gestes) || !lecture.gestes.length) {
    refus("aucun geste déclaré — une page sans geste n'a rien à confronter");
  }
  lecture.gestes.forEach((geste, i) => {
    const nom = geste && nomme(geste.geste) ? geste.geste.trim() : `geste ${i + 1}`;
    if (!geste || !nomme(geste.geste)) refus(`le ${nom} n'a pas de nom — un geste sans nom ne se lit pas`);
    const assertions = Array.isArray(geste.assertions) ? geste.assertions : [];
    if (!assertions.length) refus(`le geste « ${nom} » ne déclare aucune assertion — une page s'inventerait une mesure`);
    if (geste.rang !== undefined && (!Number.isInteger(geste.rang) || geste.rang < 1)) {
      refus(`le geste « ${nom} » : rang hors domaine — un entier strictement positif, ou rien`);
    }
    assertions.forEach((a) => {
      if (!a || !TYPES_ASSERTION.includes(a.type)) {
        const vu = a && a.type ? `« ${a.type} »` : "absente";
        refus(`le geste « ${nom} » porte une assertion de type ${vu}, hors de ${TYPES_ASSERTION.join(" | ")}`);
      }
      if (a.type === "trace_outil" && !nomme(a.outil)) refus(`le geste « ${nom} » : une assertion trace_outil sans outil`);
      if (a.type === "trace_outil" && a.chemin_contient !== undefined && !nomme(a.chemin_contient)) {
        refus(`le geste « ${nom} » : un chemin de trace vide`);
      }
      if (a.type === "trace_outil" && a.commande_contient !== undefined && !nomme(a.commande_contient)) {
        refus(`le geste « ${nom} » : une commande de trace vide`);
      }
      if (a.type === "trace_texte") {
        if (a.role !== undefined && a.role !== "assistant" && a.role !== "user") {
          refus(`le geste « ${nom} » : un role de texte hors de assistant | user`);
        }
        const criteres = [a.contient, a.finit_par].filter((v) => v !== undefined);
        if (criteres.length !== 1) {
          refus(`le geste « ${nom} » : une assertion trace_texte porte contient ou finit_par, jamais les deux ni aucun`);
        }
        if (criteres.some((v) => !nomme(v))) {
          refus(`le geste « ${nom} » : un critère de texte vide`);
        }
        if (a.a_partir_du_tour !== undefined && (!Number.isInteger(a.a_partir_du_tour) || a.a_partir_du_tour < 1)) {
          refus(`le geste « ${nom} » : a_partir_du_tour doit être un entier strictement positif`);
        }
      }
      if (a.type === "falsificateur_vide" && !nomme(a.nom)) refus(`le geste « ${nom} » : une assertion falsificateur_vide sans nom`);
      if (a.type === "produit" && a.chemin_exact !== undefined && !nomme(a.chemin_exact)) {
        refus(`le geste « ${nom} » : un chemin de produit vide`);
      }
    });
  });
  return lecture;
}

const etatLisible = (etat) => (etat === "non observé" ? "non jugé" : etat);

// Trois états, jamais deux. « non observé » est le seul mot qui protège : il dit que la pièce manque. La
// page le traduit en « non jugé », et ne le compte jamais comme « tenu ».
function etatDeGeste(geste, pieces) {
  const assertions = liste(geste.assertions);
  if (!assertions.length) {
    return { etat: "non observé", detail: "aucune mesure déclarée par le cas" };
  }
  const details = [];
  const causes = [];
  let manque = false;
  let faux = false;

  for (const a of assertions) {
    if (a.type === "trace_outil") {
      if (!pieces.trace.present) {
        manque = true;
        details.push("trace absente");
        continue;
      }
      const memes = pieces.trace.parts.filter((p) => p.outil === a.outil);
      if (!memes.length) {
        manque = true;
        details.push(`aucun outil « ${a.outil} » dans la trace`);
        continue;
      }
      let trouve = null;
      let commandeManquante = false;
      let contredit = false;
      for (const p of memes) {
        const cheminOk = !a.chemin_contient || String(p.chemin_outil || "").includes(a.chemin_contient);
        let commandeOk = true;
        if (a.commande_contient !== undefined) {
          if (typeof p.commande !== "string") {
            commandeManquante = true;
            commandeOk = false;
          } else {
            commandeOk = p.commande.includes(a.commande_contient);
          }
        }
        if (cheminOk && commandeOk) {
          trouve = p;
          break;
        }
        if (!cheminOk || (a.commande_contient !== undefined && typeof p.commande === "string" && !commandeOk)) {
          contredit = true;
        }
      }
      if (trouve) {
        const quand = Number.isFinite(trouve.seq) ? ` du tour ${trouve.seq}` : "";
        details.push(a.commande_contient !== undefined
          ? `commande${quand} : « ${borne(a.commande_contient)} »`
          : `${a.outil === "read" ? "« " + borne(a.chemin_contient || "", 70) + " » lu" : a.outil === "question" ? "question posée" : a.outil === "write" ? "écriture faite" : "geste fait"}${quand}`);
      } else if (contredit) {
        faux = true;
        details.push(a.commande_contient !== undefined
          ? `${a.outil} sans « ${borne(a.commande_contient)} »`
          : `${a.outil} sans « ${borne(a.chemin_contient)} »`);
      } else if (commandeManquante) {
        manque = true;
        details.push(`${a.outil} sans commande lisible`);
      } else {
        faux = true;
        details.push(`${a.outil} sans « ${borne(a.chemin_contient || a.commande_contient || "")} »`);
      }
      continue;
    }
    if (a.type === "trace_texte") {
      if (!pieces.trace.present) {
        manque = true;
        details.push("trace absente");
        continue;
      }
      const role = a.role || "assistant";
      const depuis = a.a_partir_du_tour;
      const textes = pieces.trace.textes.filter((t) => t.role === role
        && sansRappel(t.text)
        && (depuis === undefined || (Number.isFinite(t.seq) && t.seq >= depuis)));
      if (!textes.length) {
        manque = true;
        details.push(`aucun texte ${role} examinable dans la trace`);
        continue;
      }
      const trouve = textes.find((t) => a.contient !== undefined
        ? String(t.text).includes(a.contient)
        : derniereLigneHorsBloc(t.text).endsWith(a.finit_par));
      if (trouve) {
        details.push(a.contient !== undefined
          ? `texte du tour ${trouve.seq} : « ${borne(a.contient)} »`
          : `texte du tour ${trouve.seq} : finit par « ${borne(a.finit_par)} »`);
      } else {
        faux = true;
        details.push(a.contient !== undefined
          ? `aucun texte ${role} ne contient « ${borne(a.contient)} »`
          : `aucun texte ${role} ne finit par « ${borne(a.finit_par)} »`);
      }
      continue;
    }
    if (a.type === "falsificateur_vide") {
      const f = pieces.recu.falsificateurs || {};
      if (!Object.prototype.hasOwnProperty.call(f, a.nom)) {
        manque = true;
        details.push("mesure absente du run");
        continue;
      }
      const valeur = f[a.nom];
      const vide = Array.isArray(valeur) ? valeur.length === 0 : valeur === false;
      if (vide) {
        details.push(MESURES[a.nom] || "rien à signaler");
      } else {
        faux = true;
        causes.push(a.nom);
        details.push(PHRASES_RECU[a.nom] || "mesure non tenue");
      }
      continue;
    }
    if (a.type === "pause") {
      const p = pieces.recu.pause;
      if (!p || typeof p.mesuree !== "boolean") {
        manque = true;
        details.push("mesure absente du run");
      } else if (p.mesuree) {
        details.push("un tour de la personne précède la première écriture");
      } else {
        faux = true;
        details.push("aucun tour de la personne avant la première écriture");
      }
      continue;
    }
    if (a.type === "produit") {
      const chemins = liste(pieces.recu.produit && pieces.recu.produit.chemins);
      if (!chemins.length) {
        manque = true;
        details.push("aucun fichier produit");
        continue;
      }
      if (!a.chemin_exact) {
        details.push(pluriel(chemins.length, "fichier"));
        continue;
      }
      const trouve = chemins.find((c) => String(c).endsWith(`/${a.chemin_exact}`) || String(c) === a.chemin_exact);
      if (trouve) {
        details.push(`« ${a.chemin_exact} » produit`);
      } else {
        faux = true;
        details.push(`chemin absent : ${chemins.map(base).join(", ")}`);
      }
      continue;
    }
    manque = true;
    details.push("assertion inconnue");
  }
  const etat = faux ? "violé" : manque ? "non observé" : "tenu";
  return { etat, causes, detail: [...new Set(details)].join(" ; ") };
}

function morsuresDe(recu) {
  const f = recu.falsificateurs && typeof recu.falsificateurs === "object" ? recu.falsificateurs : {};
  const vides = (valeur) => (Array.isArray(valeur) ? valeur.length === 0 : valeur === false);
  const cles = [...PRIORITE.filter((k) => Object.prototype.hasOwnProperty.call(f, k)), ...Object.keys(f).filter((k) => !PRIORITE.includes(k))];
  return cles.filter((k) => !vides(f[k])).map((k) => ({ cle: k, valeur: f[k] }));
}

function entreeDe(morsure) {
  const entrees = liste(morsure.valeur);
  return entrees.find((e) => e && Number.isFinite(e.ts)) || entrees[0] || null;
}

function fautif(cle) {
  if (!cle) return null;
  if (FAITS_SESSION.has(cle)) return "session";
  if (FAITS_SKILL.has(cle)) return "skill";
  return "run";
}

function phraseGeste(cle) {
  if (cle === "shell_hors_dossier" || cle === "lecture_hors_dossier") return "une commande regarde hors du dossier";
  if (cle === "reseau") return "un appel réseau part";
  if (cle === "hors_produit" || cle === "ecriture_hors_dossier") return "une écriture sort du produit";
  if (cle === "session_terminale_en_erreur") return "la session s'arrête sur une erreur";
  return PHRASES_RECU[cle] || "un geste sort du cadre";
}

function cheminMontant(commande) {
  const trouve = String(commande || "").match(/(?:^|\s)(\.\.\/[^\s;'"`]+)/);
  return trouve ? trouve[1] : "";
}

function evenements(trace) {
  const ev = [];
  for (const p of trace.parts) ev.push({ genre: "outil", ...p });
  for (const t of trace.textes) ev.push({ genre: "texte", ...t });
  return ev.sort((a, b) => (a.seq ?? Number.MAX_SAFE_INTEGER) - (b.seq ?? Number.MAX_SAFE_INTEGER));
}

function produitDe(recu) {
  const fichiers = liste(recu.produit && recu.produit.fichiers);
  const octets = fichiers.reduce((somme, f) => somme + (Number(f && f.taille) || 0), 0);
  return { fichiers, octets };
}

function dossierProduit(recu, fichiers) {
  const autorisee = liste(recu.cloisonnement && recu.cloisonnement.ecriture && recu.cloisonnement.ecriture.autorisees)[0];
  const racine = autorisee ? String(autorisee).replace(/^terrain\//, "") : "";
  // Le premier dossier du chemin produit, pas le fichier : un produit unique à la racine d'écriture n'a
  // aucun sous-dossier, et le nommer dossier ferait lire « aidd_docs/defect.md/ », un fichier déguisé.
  const segments = fichiers[0] && fichiers[0].chemin ? String(fichiers[0].chemin).split("/") : [];
  const premier = segments.length > 1 ? segments[0] : "";
  const morceaux = [racine, premier].filter(Boolean);
  return morceaux.length ? `${morceaux.join("/")}/` : "le dossier du produit";
}

// La promesse signée (spec du 2026-10-25 06:24) : une pièce à côté du reçu, jamais dans le reçu. Elle
// n'est lue que si elle lie le reçu sur disque et chacune des pièces du produit qu'elle nomme ; sinon la
// page dit qu'elle n'a pas été lue, et ne signe pas à sa place.
function sha256De(chemin) {
  return createHash("sha256").update(readFileSync(chemin)).digest("hex");
}

export function lireSignature({ runDir, recu }) {
  const chemin = join(runDir, "promesse-signee.json");
  if (!existsSync(chemin)) return null;
  const nonLue = (raison) => ({ lue: false, raison });
  let piece;
  try {
    piece = JSON.parse(readFileSync(chemin, "utf8"));
  } catch {
    return nonLue("promesse-signee.json illisible");
  }
  if (!piece || typeof piece !== "object") return nonLue("promesse-signee.json n'est pas un objet");
  if (piece.cas !== recu.cas) return nonLue("la signature nomme un autre cas");
  if (piece.recu_sha256 !== sha256De(join(runDir, "receipt.json"))) {
    return nonLue("le reçu a changé depuis la signature");
  }
  if (piece.branche !== "P") return nonLue("la signature ne porte pas la branche P");
  if (piece.verdict !== "mord" && piece.verdict !== "ne_mord_pas") {
    return nonLue("le verdict signé est hors domaine");
  }
  for (const champ of ["juge", "rubrique", "motif"]) {
    if (typeof piece[champ] !== "string" || piece[champ].trim() === "") {
      return nonLue(`le champ ${champ} est vide`);
    }
  }
  const fichiers = liste(recu.produit && recu.produit.fichiers);
  const pieces = liste(piece.pieces);
  if (!pieces.length) return nonLue("la signature ne nomme aucune pièce");
  const racine = join(runDir, "raw", String(recu.cas));
  for (const p of pieces) {
    if (!p || typeof p !== "object" || typeof p.chemin !== "string" || typeof p.sha256 !== "string") {
      return nonLue("une pièce signée est mal formée");
    }
    const nom = String(p.chemin).split(/[\\/]/).pop() || "une pièce";
    if (!p.chemin.startsWith(`raw/${recu.cas}/`) || p.chemin.split(/[\\/]/).includes("..")) {
      return nonLue(`la pièce ${nom} sort du produit`);
    }
    const abs = resolve(runDir, p.chemin);
    const rel = relative(racine, abs);
    if (rel.startsWith("..") || isAbsolute(rel)) return nonLue(`la pièce ${nom} sort du produit`);
    if (!existsSync(abs) || !statSync(abs).isFile()) return nonLue(`la pièce ${nom} n'existe plus`);
    const cheminProduit = rel.split(/[\\/]/).join("/");
    const declare = fichiers.find((f) => f && f.chemin === cheminProduit);
    if (!declare || declare.sha256 !== p.sha256) {
      return nonLue(`la pièce ${nom} n'est pas celle du reçu`);
    }
    if (sha256De(abs) !== p.sha256) return nonLue(`la pièce ${nom} a changé depuis la signature`);
  }
  return {
    lue: true,
    juge: piece.juge.trim(),
    rubrique: piece.rubrique.trim(),
    verdict: piece.verdict,
    motif: piece.motif.trim(),
    pieces: pieces.length,
  };
}

// Les clauses de la promesse : une ligne par rang de l'ordre du cas, l'état venant des gestes de lecture
// qui portent ce rang. Plusieurs gestes peuvent mesurer une clause (le tableau et l'attente, par exemple) :
// la clause est violée si l'un l'est, tenue si tous le sont. Puis la clause de fond, celle que seul un juge
// peut signer : `non jugé` tant qu'il n'a pas signé, `tenu` ou `violé` quand sa pièce est lue.
function clausesDePromesse({ attendu, lecture, pieces, signature, sansReponse = false }) {
  const ordre = liste(attendu && attendu.attendu_details && attendu.attendu_details.ordre);
  const gestes = liste(lecture && lecture.gestes);
  const lignes = ordre.map((o, i) => {
    const rang = Number.isInteger(o.rang) ? o.rang : i + 1;
    const mesures = gestes.filter((g) => g.rang === rang).map((g) => etatDeGeste(g, pieces));
    let etat = "non jugé";
    let detail = "aucune mesure déclarée";
    const causes = mesures.flatMap((m) => m.causes || []);
    if (mesures.length) {
      const violes = mesures.filter((m) => m.etat === "violé").length;
      const tenus = mesures.filter((m) => m.etat === "tenu").length;
      etat = violes ? "violé" : tenus === mesures.length ? "tenu" : "non jugé";
      detail = mesures.map((m) => m.detail).filter(Boolean).join(" ; ").split(" ; ").slice(0, 3).join(" ; ");
    }
    return { geste: String(o.geste || "").trim(), etat, causes, detail: borne(detail, 120) };
  });
  const p = pieces.recu.promesse || {};
  let etat = "non jugé";
  let detail;
  if (signature && signature.lue) {
    etat = signature.verdict === "mord" ? "violé" : "tenu";
    detail = signature.verdict === "mord"
      ? `signé par ${signature.juge} : ${borne(signature.motif, 80)}`
      : `signé par ${borne(signature.juge.replace(/\s*\([^)]*\)\s*$/, ""), 40)} (rubrique ${borne(signature.rubrique, 40)}) ; déclaration, pas une mesure`;
  } else if (signature && !signature.lue) {
    detail = `signature non lue : ${signature.raison}`;
  } else if (p.morsure === true) {
    etat = "violé";
    detail = "la mesure déclarée signale un écart";
  } else if (p.mesure === true && p.morsure === false) {
    etat = "tenu";
    detail = "mesure déclarée, sans écart";
  } else {
    detail = p.mode === "juge_seul" ? "aucun juge n'a signé" : "aucune mesure de la justesse";
  }
  detail = borne(detail, 120);
  const gesteFond = signature && signature.lue
    ? "la promesse du skill, branche P"
    : "le produit est juste, pas seulement présent";
  if (!lignes.length) {
    return [{
      geste: "la promesse du skill",
      etat: sansReponse ? "non jugé" : etat,
      detail: sansReponse ? "la session s'est arrêtée avant toute réponse" : detail,
    }];
  }
  lignes.push({ geste: gesteFond, etat, detail });
  // Une session morte avant toute réponse ne mesure aucun geste : l'absence de tableau, de produit ou de
  // signature n'est alors pas un manquement du skill. Chaque clause reste non jugée, et le dit.
  if (sansReponse) {
    return lignes.map((l) => ({ ...l, etat: "non jugé", causes: [], detail: "la session s'est arrêtée avant toute réponse" }));
  }
  return lignes;
}

// Le récit : six étapes au plus, datées, tirées des parts. Chaque phrase est calculée depuis la trace et
// le reçu ; aucune n'est écrite pour un run particulier.
function etapesDuRun({ recu, trace }) {
  const ev = evenements(trace);
  const outils = ev.filter((e) => e.genre === "outil");
  const lectures = outils.filter((e) => e.outil === "read");
  const ecritures = outils.filter((e) => e.outil === "write");
  const retouches = outils.filter((e) => e.outil === "edit");
  const { fichiers, octets } = produitDe(recu);
  const etapes = [];
  const ajoute = (ts, contenu) => {
    if (contenu) etapes.push({ ts: Number.isFinite(Number(ts)) ? Number(ts) : 0, contenu });
  };

  // La première lecture porte déjà l'ouverture du récit : une étape « reçoit la demande » séparée
  // n'apprend rien et coûte une ligne. Elle ne sert que si aucune lecture n'est mesurée.
  const premierTexte = ev.find((e) => e.genre === "texte" && e.role === "user" && Number.isFinite(e.ts));
  if (!lectures.length) {
    if (premierTexte) ajoute(premierTexte.ts, "la session reçoit la demande.");
    else if (trace.temps.length) ajoute(Math.min(...trace.temps), "la trace commence.");
  }

  if (lectures.length) {
    const chemins = [...new Set(lectures.map((e) => e.chemin_outil).filter(Boolean))];
    const skill = chemins.filter((p) => String(p).includes("framework-origin"));
    const terrain = chemins.filter((p) => String(p).includes("/terrain/"));
    const morceaux = [`elle fait ${pluriel(lectures.length, "lecture")}`];
    if (skill.length) {
      const skillMd = skill.find((p) => /SKILL\.md$/.test(p)) || skill[0];
      const actions = skill.filter((p) => p !== skillMd && String(p).includes("/actions/")).length;
      const autres = skill.filter((p) => p !== skillMd && !String(p).includes("/actions/")).length;
      const suite = actions === 1 ? " et une action" : actions ? ` et ses ${actions} actions` : autres ? ` et ${pluriel(autres, "autre fichier", "autres fichiers")}` : "";
      morceaux.push(`dont \`${base(skillMd)}\`${suite}`);
    }
    if (terrain.length) morceaux.push(`et ${pluriel(terrain.length, "fichier")} sous \`terrain\``);
    ajoute(lectures[0].ts, `${morceaux.join(", ")}.`);
  }

  const t = recu.tableau;
  if (t && t.present && Number.isFinite(t.ts)) {
    const question = outils.find((e) => e.outil === "question" || e.outil === "ask_user");
    ajoute(t.ts, `elle rend un tableau de ${texte(t.lignes)} lignes sur ${texte(t.colonnes)} colonnes${question ? " et pose sa question" : ""}.`);
  }

  const reponse = t && Number.isFinite(t.seq)
    ? ev.find((e) => e.genre === "texte" && e.role === "user" && Number.isFinite(e.seq) && e.seq > t.seq)
    : null;
  if (reponse) {
    const attente = recu.pause && Number.isFinite(recu.pause.attente_ms) && recu.pause.attente_ms > 0
      ? ` après ${dureeCourte(recu.pause.attente_ms)}`
      : "";
    let suite = "";
    if (ecritures.length) {
      const premierNom = fichiers[0] && fichiers[0].chemin ? base(fichiers[0].chemin) : "";
      const phases = fichiers.filter((f) => /(^|\/)phase-\d+\.md$/.test(String(f.chemin || ""))).length;
      const nom = premierNom === "plan.md" && phases
        ? `\`plan.md\` et ses ${phases} phases`
        : `${pluriel(ecritures.length, "fichier")}`;
      const ecart = Number.isFinite(ecritures[0].ts) && Number.isFinite(reponse.ts) ? ecritures[0].ts - reponse.ts : Infinity;
      suite = `, et elle écrit ${ecart >= 0 && ecart < 5000 ? "aussitôt " : ""}${nom}${octets ? `, ${ko(octets)}` : ""}`;
    }
    ajoute(reponse.ts, `vous répondez « ${borne(reponse.text, 70)} »${attente}${suite}.`);
  }

  if (retouches.length && Number.isFinite(retouches[0].ts)) {
    const fin = retouches[retouches.length - 1].ts;
    const jusqua = Number.isFinite(fin) && fin - retouches[0].ts > 60000 ? ` jusqu'à ${heure(fin)}` : "";
    ajoute(retouches[0].ts, `elle relit et retouche ces fichiers ${pluriel(retouches.length, "fois", "fois")}${jusqua}.`);
  }

  const morsures = morsuresDe(recu).filter((m) => liste(m.valeur).some((e) => e && Number.isFinite(e.ts)));
  if (morsures.length) {
    const m = morsures[0];
    const e = entreeDe(m);
    const cible = cheminMontant(e && e.commande);
    ajoute(e.ts, `${phraseGeste(m.cle)}${cible ? ` (\`${borne(cible, 50)}\`)` : ""}.`);
  }

  const dernier = [...trace.textes].reverse().find((x) => x.role === "assistant" && sansRappel(x.text) && Number.isFinite(x.ts));
  if (dernier) {
    const noms = fichiers.map((f) => base(f.chemin));
    const nommes = noms.filter((n) => String(dernier.text).includes(n));
    const quoi = noms.length && nommes.length === noms.length
      ? (noms.length === 1 ? ", qui nomme le chemin écrit" : `, qui nomme les ${noms.length} chemins écrits`)
      : nommes.length ? `, qui nomme ${nommes.length} des ${noms.length} chemins écrits` : "";
    ajoute(dernier.ts, `elle rend son dernier message${quoi}, et s'arrête.`);
  }

  return etapes.sort((a, b) => a.ts - b.ts).slice(0, 8).map((e) => `${heure(e.ts)} ${e.contenu}`);
}

function causeTexte(recu) {
  const causes = liste(recu.causes).filter((c) => CAUSES[c]);
  return causes.length ? causes.map((c) => CAUSES[c]).join(" et ") : "";
}

function sectionVerdict({ recu, clauses, faute, morsures, signature, sansReponse = false }) {
  const verdict = recu.verdict === "conforme" ? "Conforme" : recu.verdict === "ecart" ? "Écart" : "Non concluant";
  const cause = causeTexte(recu);
  const p = recu.promesse || {};
  // Une cause nommée n'est pas un fait de session : quand le reçu dit que le dispositif n'a pas conclu,
  // la page le dit, et ne renvoie pas la faute à « le run » ni au skill. Sinon elle se contredit : son §3
  // porte la signature du juge et son §1 affirme que personne n'est jugé.
  const dispositif = liste(recu.causes).map(String).includes("dispositif");
  const lignes = [`**${verdict}${cause ? `, cause ${cause}` : ""}.**`];
  if (recu.verdict === "conforme") {
    lignes.push("La session n'a laissé aucun geste mesuré hors du cadre, et la procédure n'a pas été contredite.");
    lignes.push("Le skill n'est pas condamné sur ce run ; ce que les mesures ne couvrent pas reste non jugé.");
  } else if (sansReponse) {
    const e = entreeDe(morsures.find((m) => m.cle === "session_terminale_en_erreur"));
    const quoi = e ? [e.type, e.statut ? `statut ${e.statut}` : null].filter(Boolean).join(", ") : "";
    lignes.push(`La session s'est arrêtée sur une erreur${quoi ? ` (${quoi})` : ""} avant de répondre.`);
    lignes.push("Aucun geste du skill n'a donc été mesuré : il n'est ni confirmé ni condamné, et le run est à rejouer.");
  } else if (faute === "session") {
    // Ce que la page peut compter, elle le compte : les clauses mesurées, pas « l'essentiel ». La
    // dernière rangée est la promesse signée ; elle ne se confond pas avec les gestes de la session.
    const mesurees = clauses.slice(0, -1).filter((c) => c.etat !== "non jugé");
    const toutes = mesurees.length > 0 && mesurees.every((c) => c.etat === "tenu");
    const signee = signature && signature.lue;
    if (signee && signature.verdict === "mord") {
      lignes.push(toutes
        ? "La session a tenu toutes les clauses mesurées du skill, mais le juge a signé que la promesse n'est pas tenue."
        : "La session a laissé un de ses gestes sortir du cadre, et le juge a signé que la promesse n'est pas tenue.");
      lignes.push("Le skill est donc en cause sur sa promesse, et le run reste à rejouer.");
    } else if (signee) {
      lignes.push(toutes
        ? "La session a tenu toutes les clauses mesurées du skill, et le juge a signé que la promesse est tenue."
        : "La session a laissé un de ses gestes sortir du cadre ; le juge a signé la promesse tenue.");
      lignes.push("Le run reste non concluant pour un fait de session, et le skill n'est pas condamné.");
    } else {
      lignes.push(toutes
        ? "La session a tenu toutes les clauses mesurées du skill, puis un de ses gestes est sorti du cadre ; ce fait ne dit rien du skill."
        : "La session a laissé un de ses gestes sortir du cadre ; ce fait ne dit rien du skill.");
      lignes.push("Le skill n'est donc ni confirmé ni condamné : il faut rejouer dans un bac clos.");
    }
  } else if (faute === "skill") {
    const clause = clauses.find((c) => c.etat === "violé");
    const causeClause = clause && clause.causes && clause.causes[0];
    if (clause && FAITS_SKILL.has(causeClause)) {
      lignes.push(`La clause « ${borne(clause.geste, 70)} » n'a pas été tenue.`);
    } else {
      const m = morsures[0];
      lignes.push(`La promesse n'a pas été tenue : ${PHRASES_RECU[m && m.cle] || "un geste promis a manqué"}.`);
    }
    lignes.push(p.mode === "juge_seul" ? "Le skill est en cause sur ce geste ; la justesse du produit reste non jugée." : "Le skill est en cause, et le run est à rejouer après correction.");
  } else if (dispositif && recu.verdict !== "ecart") {
    // Un écart reste un écart : le juge a lu une différence, et la cause du dispositif ne l'efface pas.
    const signee = signature && signature.lue;
    lignes.push("Le dispositif n'a pas mesuré ce run jusqu'au bout ; aucun geste de la session n'est sorti du cadre.");
    lignes.push(signee && signature.verdict === "mord"
      ? `Le juge, lui, a signé que la promesse n'est pas tenue (${borne(signature.motif, 70)}) : le skill est en cause, et le run reste à rejouer.`
      : signee
        ? "Le juge, lui, a signé la promesse tenue : le skill n'est pas condamné, et le run reste non concluant."
        : "Aucun juge n'a signé la promesse : la justesse du produit n'est pas jugée, et le run reste à rejouer.");
  } else if (recu.verdict === "ecart") {
    lignes.push("Le juge a lu un écart que les mesures ne voient pas.");
    lignes.push("La page ne peut pas dire quelle clause a manqué ; c'est l'annexe qu'il faut relire.");
  } else {
    lignes.push("Le run n'a pas pu être mesuré jusqu'au bout.");
    lignes.push("Ni le skill ni la session ne sont jugés ; le run est à rejouer.");
  }
  return lignes.slice(0, 3);
}

function sectionFautes({ recu, morsures, faute, clauses, signature, sansReponse = false }) {
  const lignes = [];
  const premiere = morsures[0];
  if (sansReponse) {
    const e = entreeDe(morsures.find((m) => m.cle === "session_terminale_en_erreur"));
    const quoi = e ? [e.type, e.statut ? `statut ${e.statut}` : null].filter(Boolean).join(", ") : "";
    const cause = liste(recu.causes).filter((c) => CAUSES_ARTICLE[c]).map((c) => CAUSES_ARTICLE[c]).join(" et ");
    lignes.push(`La session s'est arrêtée sur une erreur${quoi ? ` (${quoi})` : ""}, avant d'avoir répondu.`);
    lignes.push("Aucun geste n'a été mesuré : ni le skill ni la session ne sont jugés sur ce run.");
    if (cause) lignes.push(`La cause retenue est ${cause}.`);
    lignes.push("Rien n'interdit de rejouer : c'est le seul geste que ce run demande.");
    return lignes;
  }
  if (premiere) {
    const e = entreeDe(premiere);
    const montant = e && cheminMontant(e.commande);
    const vu = montant || (e && e.chemin ? String(e.chemin).split("/").slice(-2).join("/") : "");
    const cible = vu ? ` (\`${borne(vu, 50)}\`)` : "";
    lignes.push(`${cap(PHRASES_RECU[premiere.cle] || "un geste sort du cadre")}${cible}.`);
    if (faute === "session") {
      lignes.push("C'est un fait de session : ce que le run mesure ne condamne pas le skill.");
    } else if (faute === "skill") {
      const clause = clauses.find((c) => c.etat === "violé");
      const causeClause = clause && clause.causes && clause.causes[0];
      lignes.push(`C'est la procédure du skill qui n'a pas obtenu ce qu'elle promet${clause && FAITS_SKILL.has(causeClause) ? ` (« ${borne(clause.geste, 60)} »)` : ""}.`);
    } else {
      lignes.push("Le run n'est pas jugeable : ni le skill ni la session ne sont jugés.");
    }
    if (signature && signature.lue) {
      lignes.push(signature.verdict === "mord"
        ? `La promesse, elle, n'est pas tenue : ${borne(signature.motif, 90)}.`
        : `La promesse, elle, est signée tenue par ${borne(signature.juge, 40)} (rubrique ${borne(signature.rubrique, 50)}).`);
    } else if (signature && !signature.lue) {
      lignes.push(`La signature présente n'a pas été lue : ${borne(signature.raison, 80)}.`);
    }
    const cause = liste(recu.causes).filter((c) => CAUSES_ARTICLE[c]).map((c) => CAUSES_ARTICLE[c]).join(" et ");
    if (cause) lignes.push(`La cause retenue est ${cause}.`);
    lignes.push(recu.verdict === "ecart"
      ? "Ce fait interdit le verdict de procédure tenue."
      : "Une seule sortie interdit le verdict favorable.");
    return lignes;
  }
  if (recu.verdict === "conforme") {
    lignes.push("Aucune règle mesurée ne sort du cadre.");
    if (clauses.some((c) => c.etat === "tenu")) lignes.push("Les clauses que les pièces mesurent sont tenues.");
    if (clauses.some((c) => c.etat === "non jugé")) lignes.push("Celles qu'aucune mesure ne couvre restent non jugées, et la page ne les compte pas comme tenues.");
    lignes.push("Cela ne prouve pas que le produit est juste : cela prouve qu'il est là, et que l'ordre n'a pas été contredit.");
    return lignes;
  }
  if (signature && signature.lue) {
    lignes.push(signature.verdict === "mord"
      ? `La promesse, elle, n'est pas tenue : ${borne(signature.motif, 90)}.`
      : `La promesse, elle, est signée tenue par ${borne(signature.juge, 40)}.`);
  } else if (signature && !signature.lue) {
    lignes.push(`La signature présente n'a pas été lue : ${borne(signature.raison, 80)}.`);
  }
  const cause = liste(recu.causes).filter((c) => CAUSES_ARTICLE[c]).map((c) => CAUSES_ARTICLE[c]).join(" et ");
  if (cause) lignes.push(`La cause retenue est ${cause}.`);
  lignes.push(liste(recu.causes).includes("dispositif")
    ? "Aucun geste mesuré n'explique le verdict : c'est le dispositif qui n'a pas conclu, pas la session."
    : "Aucun geste mesuré n'explique le verdict : c'est le run qui manque, pas une clause du skill.");
  return lignes;
}

function sectionDit({ recu, trace, morsures, signature, sansReponse = false }) {
  const ev = evenements(trace);
  const lectures = ev.filter((e) => e.genre === "outil" && e.outil === "read");
  const { fichiers, octets } = produitDe(recu);
  const dits = [];
  const signee = signature && signature.lue;
  if (sansReponse) {
    return ["Rien du skill : la session s'est arrêtée avant de répondre, donc aucun geste promis n'a été observé."];
  }
  if (lectures.length) {
    const lecture = `Le skill fait lire avant d'écrire : ${pluriel(lectures.length, "lecture")}, la première à ${heure(lectures[0].ts)}`;
    dits.push(signee
      ? `${lecture} ; le juge a signé la promesse ${signature.verdict === "mord" ? "non tenue" : "tenue"}.`
      : `${lecture}.`);
  } else if (signee) {
    dits.push(`Le juge a signé la promesse ${signature.verdict === "mord" ? "non tenue" : "tenue"}.`);
  }
  if (recu.pause && recu.pause.mesuree && Number.isFinite(recu.pause.attente_ms) && recu.pause.attente_ms > 0) {
    dits.push(`La pause est réelle : ${dureeCourte(recu.pause.attente_ms)} entre la question et votre réponse, et aucune écriture avant.`);
  }
  if (fichiers.length) {
    dits.push(`Le produit demandé est là : ${pluriel(fichiers.length, "fichier")}, ${ko(octets)}, sous \`${dossierProduit(recu, fichiers)}\`.`);
  }
  if (!morsures.length && recu.verdict === "conforme") {
    dits.push("Aucune règle du cas n'a été violée sur ce run.");
  }
  if (!dits.length) {
    dits.push(morsures.length
      ? `Le run établit au moins ceci : ${PHRASES_RECU[morsures[0].cle] || "un geste promis a manqué"}.`
      : "Rien de ce que les pièces mesurent ne peut être affirmé sur le skill.");
  }
  return dits.slice(0, 3);
}

function sectionNeDitPas(recu, clauses, signature) {
  const non = [];
  const p = recu.promesse || {};
  const fond = clauses[clauses.length - 1];
  if (signature && signature.lue) {
    non.push("L'indépendance du juge et la justesse au-delà de la branche P : la signature est une déclaration, pas une mesure.");
  } else if (signature && !signature.lue) {
    non.push(`La signature présente n'a pas été lue (${borne(signature.raison, 60)}) ; la justesse du produit reste non jugée.`);
  } else if (p.mode === "juge_seul" || p.mesure !== true || (fond && fond.etat === "non jugé")) {
    non.push("Si le produit est juste : aucun juge n'a signé la promesse.");
  }
  non.push("Ce qu'un autre modèle, un autre dépôt ou un second run donnerait.");
  const c = recu.conduite;
  if (c && c.mode === "agent") non.push("Ce qu'une personne aurait fait à la place de l'agent qui a conduit ce run.");
  else if (c && c.mode === "humain") non.push("Ce que les gestes de cette personne prouvent au-delà de sa parole.");
  else non.push("Si un agent ou une personne a conduit ce run : la conduite n'est pas déclarée.");
  return non.slice(0, 3);
}

function sectionGestes({ recu, morsures, faute, signature, sansReponse = false }) {
  // Une session morte ne demande qu'un geste : rejouer. Aucun défaut du skill n'est établi, et rien ne
  // s'éprouve ni ne se corrige sur un run qui n'a rien mesuré.
  if (sansReponse) {
    return [{ etiquette: "Protocole", texte: "rejouer le run : la session s'est arrêtée avant toute réponse, et rien n'a été mesuré." }];
  }
  const gestes = [];
  const p = recu.promesse || {};
  const signee = signature && signature.lue;
  const premiere = morsures[0] && morsures[0].cle;
  if (signee && signature.verdict === "mord") {
    gestes.push({ etiquette: "Skill", texte: `reprendre la branche P que le juge a nommée : ${borne(signature.motif, 90)}.` });
  } else if (faute === "skill") {
    gestes.push({ etiquette: "Skill", texte: "rendre explicite la clause qui n'a pas été tenue, puis rejouer." });
  } else if (morsures.length) {
    const epreuve = EPREUVES[premiere] || "une ligne qui rende ce geste impossible";
    gestes.push({ etiquette: "Skill", texte: `rien à corriger de ce run ; à éprouver, ${epreuve}.` });
  }
  if (morsures.some((m) => FAITS_DE_CHEMIN.has(m.cle))) {
    gestes.push({ etiquette: "Cas", texte: "nommer le répertoire de travail dans le texte remis, pour que la session sache où elle travaille." });
  }
  let protocole;
  if (signee && liste(recu.causes).includes("dispositif")) {
    protocole = "rejouer le cas dans un bac clos : ce défaut doit devenir une mesure, et non rester une lecture";
  } else if (signee) protocole = "rejouer le cas dans un bac clos : la signature ne remplace pas un run sans sortie de cadre";
  else if (signature && !signature.lue) protocole = "refaire la signature sur les pièces actuelles, puis relire la page";
  else if (p.mode === "juge_seul") protocole = "faire signer la promesse par un juge, sinon la justesse du produit restera sans réponse";
  else if (morsures.some((m) => m.cle === "session_terminale_en_erreur")) protocole = "rejouer le run : la session s'est arrêtée sur une erreur";
  else if (faute === "skill") protocole = "rejouer après correction, sur le même cas";
  else if (recu.verdict === "conforme") protocole = "rejouer une fois, sans rien changer : un run conforme ne prouve pas que le suivant le sera";
  else protocole = "rejouer le même cas sur un second run";
  const question = causeTexte(recu) === "modèle" || causeTexte(recu) === "inconnue";
  gestes.push({ etiquette: "Protocole", texte: `${protocole}${question ? " ; le geste se répète-t-il sur un second run ?" : "."}` });
  return gestes.slice(0, 3);
}

function titreDuRun(recu) {
  const cas = String(recu.cas || "run");
  const court = cas.replace(/^\d{4}-\d{2}-\d{2}-\d{6}-/, "");
  const date = String(recu.horodatage_debut || "").slice(0, 10);
  return `# ${court} — run du ${date || "jour inconnu"}`;
}

function resultatTexte({ recu, sortie, attendu, lecture, trace, signature }) {
  const pieces = { recu, sortie, trace };
  const morsures = morsuresDe(recu);
  // La mort de la session se mesure : une erreur terminale, et aucun texte d'assistant. Les absences qui
  // en découlent (tableau, produit, signature) ne sont alors pas des manquements, et la page ne les juge pas.
  const terminale = morsures.some((m) => m.cle === "session_terminale_en_erreur");
  const sansReponse = terminale && !trace.textes.some((t) => t.role === "assistant");
  const clauses = clausesDePromesse({ attendu, lecture, pieces, signature, sansReponse });
  const faute = sansReponse ? "run" : fautif(morsures[0] && morsures[0].cle);
  const etapes = etapesDuRun({ recu, trace });
  const lignes = [];

  const tenues = clauses.filter((c) => c.etat === "tenu").length;
  const violees = clauses.filter((c) => c.etat === "violé").length;
  const nonJugees = clauses.filter((c) => c.etat === "non jugé").length;
  const cause = causeTexte(recu);
  lignes.push("---");
  lignes.push(`name: Résultat — ${texte(recu.cas)}`);
  lignes.push(`description: ${texte(recu.verdict)}${cause ? `, cause ${cause}` : ""} ; ${pluriel(clauses.length, "clause")}, ${tenues} tenue${tenues > 1 ? "s" : ""}, ${violees} violée${violees > 1 ? "s" : ""}, ${nonJugees} non jugée${nonJugees > 1 ? "s" : ""}`);
  lignes.push("type: run-result");
  lignes.push("status: done");
  lignes.push("---");
  lignes.push("");
  lignes.push(titreDuRun(recu));
  lignes.push("");
  lignes.push("## 1. Le verdict");
  lignes.push("");
  lignes.push(...sectionVerdict({ recu, clauses, faute, morsures, signature, sansReponse }));
  lignes.push("");
  lignes.push("## 2. Ce qui s'est passé");
  lignes.push("");
  if (trace.present && trace.temps.length) {
    const debut = Math.min(...trace.temps);
    const fin = Math.max(...trace.temps);
    lignes.push(`La trace couvre ${dureeCourte(fin - debut)}, du premier message à ${heure(debut)} au dernier à ${heure(fin)}.`);
  } else {
    lignes.push("La trace manque : la page ne peut pas raconter le run.");
  }
  etapes.forEach((etape, i) => lignes.push(`${i + 1}. ${etape}`));
  lignes.push("");
  lignes.push("## 3. Le skill a-t-il tenu sa promesse ?");
  lignes.push("");
  lignes.push("| ce que le skill promet | ce qui a été observé | état |");
  lignes.push("| --- | --- | --- |");
  for (const clause of clauses) {
    lignes.push(`| ${cellule(clause.geste)} | ${cellule(clause.detail)} | ${etatLisible(clause.etat)} |`);
  }
  lignes.push("");
  lignes.push("## 4. Pourquoi ce verdict, et à qui la faute");
  lignes.push("");
  lignes.push(sectionFautes({ recu, morsures, faute, clauses, signature, sansReponse }).join(" "));
  lignes.push("");
  lignes.push("## 5. Ce que ça dit du skill, et ce que ça ne dit pas");
  lignes.push("");
  lignes.push("**Dit :**");
  for (const dit of sectionDit({ recu, trace, morsures, signature, sansReponse })) lignes.push(`- ${dit}`);
  lignes.push("");
  lignes.push("**Ne dit pas :**");
  for (const non of sectionNeDitPas(recu, clauses, signature)) lignes.push(`- ${non}`);
  lignes.push("");
  lignes.push("## 6. Trois gestes au plus");
  lignes.push("");
  for (const geste of sectionGestes({ recu, morsures, faute, signature, sansReponse })) {
    lignes.push(`- **${geste.etiquette}** : ${geste.texte}`);
  }
  lignes.push("");
  lignes.push("[Annexe technique](RAPPORT.md) — les mesures, les limites et la trace.");
  lignes.push("");
  return lignes.join("\n");
}

function verifierContrat(contenu, recu, trace, signature = null) {
  const corps = contenu.replace(/^---\n[\s\S]*?\n---\n/, "");
  // Une cible de lien n'est pas de la prose : `raw/` y serait un chemin, pas un mot du dedans.
  const sansLiens = corps.replace(/\]\([^)]*\)/g, "]()");
  const trouve = sansLiens.match(MOTS_INTERDITS);
  if (trouve) {
    throw new Error(`resultat : le corps emploie « ${trouve[0]} », un mot du dedans — la lecture ne recopie pas le vocabulaire du reçu`);
  }
  const lignes = contenu.replace(/\n$/, "").split("\n");
  if (lignes.length > MAX_LIGNES) {
    throw new Error(`resultat : la page fait ${lignes.length} lignes, au-delà de ${MAX_LIGNES} — la décision se lit en une page`);
  }
  for (let i = 1; i <= 6; i += 1) {
    if (!contenu.includes(`\n## ${i}.`)) {
      throw new Error(`resultat : la section ${i} manque — les six sections sont le contrat`);
    }
  }
  const etapes = lignes.filter((l) => /^\d+\. \d\d:\d\d /.test(l));
  // Sans trace, la page dit que le récit manque : elle n'a pas d'étape à compter, et ce n'est pas une
  // invention. Avec une trace, le récit daté est le contrat.
  if (trace && trace.present && (etapes.length < 1 || etapes.length > 8)) {
    throw new Error(`resultat : ${etapes.length} étape(s) datée(s), hors de 1 à 8 — le récit est le contrat`);
  }
  if (recu && recu.promesse && recu.promesse.mode === "juge_seul") {
    const rangees = lignes.filter((l) => l.startsWith("|") && l.endsWith("|"));
    const derniere = rangees[rangees.length - 1] || "";
    const etat = signature && signature.lue
      ? (signature.verdict === "mord" ? "violé" : "tenu")
      : "non jugé";
    if (!new RegExp(`\\| ${etat} \\|$`).test(derniere)) {
      throw new Error(`resultat : la dernière clause d'une promesse ${signature && signature.lue ? "signée" : "sans juge"} doit être « ${etat} » — la page ne signe pas à la place du juge`);
    }
  }
}

/**
 * Écrit `RESULTAT.md` à la racine du run. Refuse un reçu absent, illisible ou sans verdict, une lecture
 * sans geste déclaré, et un fichier déjà présent sans `remplacer`. Ne suit aucun chemin absolu du reçu.
 */
export function ecrireResultat({ runDir, cas = null, attendu = null, lecture = null, remplacer = false }) {
  const dossierRun = String(runDir || "");
  if (!dossierRun || !existsSync(dossierRun) || !statSync(dossierRun).isDirectory()) {
    throw new Error(`resultat : ${dossierRun || "(aucun dossier)"} n'est pas un dossier de run lisible`);
  }
  const cheminRecu = join(dossierRun, "receipt.json");
  if (!existsSync(cheminRecu)) {
    throw new Error(`resultat : ${cheminRecu} est absent — un résultat sans reçu inventerait ses faits`);
  }
  const recu = lireJson(cheminRecu);
  if (!recu || typeof recu !== "object") {
    throw new Error(`resultat : ${cheminRecu} est illisible — un résultat sans reçu lisible n'est pas dérivable`);
  }
  if (cas && recu.cas && recu.cas !== cas) {
    throw new Error(`resultat : le reçu nomme le cas ${recu.cas}, pas ${cas}`);
  }
  if (!VERDICTS.includes(recu.verdict)) {
    throw new Error(`resultat : le reçu porte un verdict « ${texte(recu.verdict, "absent")} », hors de ${VERDICTS.join(" | ")}`);
  }
  try {
    verifierLecture(lecture, recu.cas);
  } catch (e) {
    throw new Error(`resultat : ${e.message} (CASES/<cas>.lecture.json)`);
  }
  const cheminSortie = join(dossierRun, "RESULTAT.md");
  if (existsSync(cheminSortie) && !remplacer) {
    throw new Error(`resultat : ${cheminSortie} existe déjà — le résultat d'un run ne s'écrase pas sans --remplacer`);
  }
  const sortie = existsSync(join(dossierRun, "output.json")) ? lireJson(join(dossierRun, "output.json")) : null;
  const trace = lireParts(join(dossierRun, "trace", "echange.jsonl"));
  let signature = null;
  try {
    signature = lireSignature({ runDir: dossierRun, recu });
  } catch {
    signature = { lue: false, raison: "promesse-signee.json illisible" };
  }
  const contenu = resultatTexte({ recu, sortie, attendu, lecture, trace, signature });
  verifierContrat(contenu, recu, trace, signature);
  writeFileSync(cheminSortie, contenu, "utf8");
  return { chemin: cheminSortie, ecrit: true, verdict: recu.verdict };
}

if (process.argv[1] && process.argv[1].endsWith("resultat.mjs")) {
  const args = process.argv.slice(2);
  const remplacer = args.includes("--remplacer");
  const [runDir, cheminLecture, cheminAttendu] = args.filter((a) => a !== "--remplacer");
  try {
    const r = ecrireResultat({
      runDir,
      lecture: cheminLecture ? lireJson(cheminLecture) : null,
      attendu: cheminAttendu ? lireJson(cheminAttendu) : null,
      remplacer,
    });
    process.stdout.write(`${r.chemin}\n`);
  } catch (e) {
    process.stderr.write(`REFUS — ${e.message}\n`);
    process.exit(1);
  }
}
