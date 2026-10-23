// La sortie utilisateur (ADR-061) : `RESULTAT.md`, dérivé du reçu, de l'output, de la trace et de la
// lecture déclarée par le cas. Ce module ne juge rien et n'invente aucune cause : chaque phrase vient
// d'un champ, et un geste dont la mesure manque s'écrit « non observé », jamais « tenu ». Aucun modèle,
// aucun réseau, aucune dépendance. Deux appels sur les mêmes pièces rendent le même fichier.
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const VERDICTS = ["conforme", "ecart", "non concluant"];

// Le vocabulaire fermé des lectures (spec du 2026-10-22 07:33, §3 ; trace_texte ajouté par l'ADR-075).
// Une assertion hors de ces types n'est pas une mesure : elle se refuse, elle ne devient pas « non observé ».
export const TYPES_ASSERTION = ["trace_outil", "trace_texte", "falsificateur_vide", "produit", "pause"];

// Le plafond de la page est de 80 lignes (spec §2) : au-delà de cinq produits, la table des preuves
// renverrait au rapport technique plutôt que de le recopier.
const MAX_PRODUITS = 5;

// Les mots du dedans, interdits dans le corps du RESULTAT (F2). Le rapport technique garde son
// vocabulaire : c'est un document d'audit, celui-ci est une page de lecture.
const MOTS_INTERDITS = /\b(morsures?|mord(?:ent)?|falsificateurs?|porcelain|plafonn(?:é|ée|és|ées)|seq)\b|\braw\/|`(?:porte|gel|empreinte)`/i;

const PHRASES_RECU = {
  tableau_absent: "la session n'a pas montré de tableau",
  ecriture_avant_tableau: "une écriture a précédé le tableau",
  produit_ne_avant_le_tableau: "le fichier a été écrit avant le tableau",
  question_sans_reponse: "la session a posé une question et écrit sans attendre la réponse",
  pause_non_tenue: "la session a écrit sans laisser la personne répondre",
  lecture_hors_dossier: "une lecture est sortie du dossier autorisé",
  ecriture_hors_dossier: "une écriture est sortie du dossier autorisé",
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
};

const CORRECTIONS = {
  tableau_absent: "le cas exige un tableau avant l'écriture : la session ne l'a pas rendu, donc le skill doit dire plus clairement qu'il faut montrer avant d'écrire",
  ecriture_avant_tableau: "la session a écrit avant de montrer : c'est l'ordre du skill qui n'a pas été suivi, et le skill peut le rendre plus explicite",
  produit_ne_avant_le_tableau: "le fichier est né avant le tableau : même cause, même correction",
  question_sans_reponse: "la question a été posée sans attendre : si le skill demande un accord, il doit dire qu'il bloque",
  pause_non_tenue: "la session n'a pas attendu la personne avant d'écrire : le skill doit rendre la pause explicite, ou le cas doit la retirer",
  lecture_hors_dossier: "une lecture est sortie du dossier : le cas doit nommer les racines permises, ou le skill doit dire où lire",
  ecriture_hors_dossier: "une écriture est sortie du dossier autorisé : le cas doit nommer le dossier d'écriture, ou le skill doit écrire au chemin demandé",
  shell_hors_dossier: "une commande a lu hors du dossier : pareil, la racine est à déclarer ou l'ordre à corriger",
  shell_ecriture_hors_produit: "une commande a écrit hors du fichier attendu : vérifier si le skill autorise cette écriture",
  shell_invalide: "une commande était mal formée : la session doit l'écrire en une ligne que le shell accepte, et le skill doit donner l'exemple",
  shell_non_interpretable: "une commande n'a pas pu être lue : le cas doit l'écrire en clair, sinon la mesure restera aveugle",
  reseau: "le cas interdit le réseau : si un outil doit être permis, c'est l'attendu qu'il faut changer, pas le rapport",
  hors_produit: "un fichier a été écrit en dehors du produit attendu : le cas doit dire s'il est permis",
  birth_anterieur_au_gel: "un fichier est né avant le cas : l'horloge de la machine ou le dossier de travail est à vérifier avant de rejouer",
  arbre_de_travail_inchange: "le fichier existe mais le dépôt n'a pas bougé : il vient d'ailleurs, et le run est à refaire dans un dossier propre",
  produit_identique_a_une_empreinte_anterieure: "le fichier recopie un fichier déjà présent : la session n'a rien écrit de neuf, et le cas doit distinguer les deux",
  trace_sans_echange_dans_la_fenetre: "la trace ne porte aucun échange : le run n'a pas eu lieu, ou l'export est à refaire",
};

const texte = (valeur, defaut = "—") =>
  valeur === null || valeur === undefined || valeur === "" ? defaut : String(valeur);
const pluriel = (n, mot, plurielMot = `${mot}s`) => `${n} ${n > 1 ? plurielMot : mot}`;
const lu = (outil, chemin) => {
  if (outil === "read") return chemin ? `« ${chemin} » lu` : "lecture faite";
  if (outil === "question") return "question posée";
  if (outil === "write") return chemin ? `« ${chemin} » écrit` : "écriture faite";
  if (outil === "shell") return "commande lancée";
  return chemin ? `${outil} ${chemin}` : outil;
};
const cellule = (valeur) => texte(valeur).replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
const liste = (valeur) => (Array.isArray(valeur) ? valeur : []);
// Un chemin de produit porte le préfixe interne `raw/<cas>/` : la page montre le nom tel que la personne
// le lit, et n'emploie jamais ce préfixe (F2). Un chemin d'un autre cas garde son préfixe tronqué au cas.
const nomProduit = (chemin, cas) => String(chemin).split(`${texte(cas)}/`).pop();

/**
 * Vérifie une lecture avant qu'elle ne serve : chaque geste porte un nom et au moins une assertion, chaque
 * assertion son type et ses champs. Refuse au lieu de rendre « non observé » une lecture mal formée.
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

const sansRappel = (texte) => !String(texte).trimStart().startsWith("<system-reminder>");
const borne = (valeur) => {
  const texte = String(valeur).replace(/\s+/g, " ").trim();
  return texte.length > 60 ? `${texte.slice(0, 57)}…` : texte;
};
const tourDe = (part) => (Number.isFinite(part.seq) ? `du tour ${part.seq}` : "sans tour");

// Trois états, jamais deux. « non observé » est le seul mot qui protège : il dit que la pièce manque.
function etatDeGeste(geste, pieces) {
  const assertions = liste(geste.assertions);
  if (!assertions.length) {
    return { etat: "non observé", detail: "aucune mesure déclarée par le cas" };
  }
  const details = [];
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
        details.push(a.commande_contient !== undefined
          ? `commande ${tourDe(trouve)} : « ${borne(a.commande_contient)} »`
          : lu(a.outil, a.chemin_contient));
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
          ? `texte ${tourDe(trouve)} : « ${borne(a.contient)} »`
          : `texte ${tourDe(trouve)} : finit par « ${borne(a.finit_par)} »`);
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
        details.push("mesure absente du reçu");
        continue;
      }
      const valeur = f[a.nom];
      const vide = Array.isArray(valeur) ? valeur.length === 0 : valeur === false;
      if (vide) {
        details.push("aucune violation mesurée");
      } else {
        faux = true;
        details.push(PHRASES_RECU[a.nom] || "mesure non tenue");
      }
      continue;
    }
    if (a.type === "pause") {
      const p = pieces.recu.pause;
      if (!p || typeof p.mesuree !== "boolean") {
        manque = true;
        details.push("mesure absente du reçu");
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
        details.push(`${chemins.length} fichier(s)`);
        continue;
      }
      const trouve = chemins.find((c) => String(c).endsWith(`/${a.chemin_exact}`) || String(c) === a.chemin_exact);
      if (trouve) {
        details.push(`« ${a.chemin_exact} » produit`);
      } else {
        faux = true;
        details.push(`chemin absent : ${chemins.map((c) => nomProduit(c, pieces.recu.cas)).join(", ")}`);
      }
      continue;
    }
    manque = true;
    details.push("assertion inconnue");
  }
  const etat = faux ? "violé" : manque ? "non observé" : "tenu";
  return { etat, detail: [...new Set(details)].join(" ; ") };
}

function violationsDe(recu) {
  const f = recu.falsificateurs && typeof recu.falsificateurs === "object" ? recu.falsificateurs : {};
  const out = [];
  for (const [nom, valeur] of Object.entries(f)) {
    const vide = Array.isArray(valeur) ? valeur.length === 0 : valeur === false;
    if (!vide) out.push(nom);
  }
  return out;
}

function duree(recu) {
  const debut = Date.parse(recu.horodatage_debut);
  const fin = Date.parse(recu.horodatage_fin);
  if (!Number.isFinite(debut) || !Number.isFinite(fin) || fin < debut) return null;
  const s = Math.round((fin - debut) / 1000);
  const minutes = Math.floor(s / 60);
  const secondes = s % 60;
  return minutes ? `${minutes} min ${String(secondes).padStart(2, "0")} s` : `${secondes} s`;
}

function dateDuRun(recu) {
  const brut = String(recu.horodatage_debut || "");
  return brut.slice(0, 10) || "date inconnue";
}

function phraseVerdict(recu, etats, violations, difference) {
  const tenus = etats.filter((e) => e.etat === "tenu").length;
  const violes = etats.filter((e) => e.etat === "violé").length;
  const nonObserves = etats.filter((e) => e.etat === "non observé").length;
  const compte = `${pluriel(etats.length, "geste attendu", "gestes attendus")} : ${tenus} tenu${tenus > 1 ? "s" : ""}, ${violes} violé${violes > 1 ? "s" : ""}, ${nonObserves} non observé${nonObserves > 1 ? "s" : ""}.`;
  if (recu.verdict === "conforme" && !violations.length) {
    return `${compte} Aucune règle mesurée n'a été violée.`;
  }
  if (recu.verdict === "ecart") {
    // Une règle non tenue interdit de dire la procédure tenue, même quand le juge a lu autre chose : la
    // section 4 affiche « violé », la section 1 ne peut pas le contredire.
    if (violations.length || !difference) {
      return `${compte} Quelque chose est sorti du cadre que le cas déclare : voir la section 5.`;
    }
    return `${compte} La procédure attendue est tenue ; le juge a lu un comportement que le reçu ne mesure pas : voir la section 5.`;
  }
  if (recu.verdict === "non concluant") {
    return `${compte} Le run ne permet pas de conclure.`;
  }
  return compte;
}

function sectionCadre(gestes, etats, recu, sortie) {
  const lignes = [
    "## 4. Attendu contre observé",
    "",
    "| Attendu | Observé | Résultat |",
    "| --- | --- | --- |",
  ];
  gestes.forEach((geste, i) => {
    const e = etats[i];
    const marque = e.etat === "tenu" ? "tenu" : e.etat === "violé" ? "**violé**" : "non observé";
    lignes.push(`| ${cellule(geste.geste)} | ${cellule(e.detail)} | ${marque} |`);
  });
  const difference = sortie && typeof sortie.difference === "string" ? sortie.difference.trim() : "";
  if (recu.verdict === "ecart" && difference) {
    lignes.push("");
    lignes.push("Le juge a lu autre chose que ce tableau : voir la section 5.");
  }
  return lignes;
}

function sectionSens(recu, sortie, violations) {
  const lignes = ["## 5. Ce que ça veut dire", ""];
  const difference = sortie && typeof sortie.difference === "string" ? sortie.difference.trim() : "";
  if (violations.length) {
    lignes.push(`Règles non tenues : ${violations.map((v) => PHRASES_RECU[v] || v).join(" ; ")}.`);
  } else if (recu.verdict === "conforme") {
    lignes.push("Rien de ce que le reçu mesure ne sort du cadre : les gestes attendus ont été faits dans l'ordre, et le fichier attendu est au bon endroit.");
  }
  if (recu.verdict === "ecart" && difference) {
    lignes.push(
      `Le juge retient : « ${difference} ».`,
      "",
      "Le reçu ne mesure pas cette différence : elle ne vient pas d'une règle qu'il sait lire, et le tableau de la section 4 peut donc dire « tenu » là où le juge voit un écart.",
    );
  }
  if (recu.verdict === "non concluant") {
    lignes.push("Le reçu ne peut pas trancher : ce que le cas attend n'a pas pu être constaté, ou une règle bloque le verdict.");
  }
  return lignes;
}

function sectionDecider(recu, violations, sortie) {
  const lignes = ["## 6. Ce que tu peux décider", ""];
  if (recu.verdict === "conforme") {
    lignes.push(
      "- **Utilisable en l'état ?** Oui pour ce cas : les gestes attendus sont tenus et rien de mesuré ne sort du cadre. Ce que ça ne couvre pas est à la section 7.",
    );
  } else if (recu.verdict === "ecart") {
    lignes.push(
      "- **Utilisable en l'état ?** La procédure est tenue, donc le skill n'est pas mis en cause par ce run ; c'est la session ou la mesure qui ne l'est pas.",
    );
  } else {
    lignes.push(
      "- **Utilisable en l'état ?** Non : ce run ne démontre ni que le skill tient, ni qu'il échoue. Il faut rejouer.",
    );
  }
  lignes.push("");
  lignes.push("**À corriger.**");
  const corrections = violations.map((v) => CORRECTIONS[v]).filter(Boolean);
  if (corrections.length) {
    for (const c of corrections) lignes.push(`- ${c}`);
  }
  const difference = sortie && typeof sortie.difference === "string" ? sortie.difference.trim() : "";
  if (recu.verdict === "ecart" && !violations.length && difference) {
    lignes.push("- Le juge a lu ce que le reçu ne voit pas. Si ce comportement doit être permis ou interdit, c'est le cas qu'il faut écrire, pas le rapport.");
  }
  lignes.push("- Un second run, sur un autre modèle, dira si le comportement vient du skill ou de la session.");
  return lignes;
}

// ADR-071 : the page says what the declaration covers, and never turns it into a proof.
function phraseConduite(recu) {
  const c = recu.conduite;
  if (c && c.mode === "agent") return "- La conduite est déclarée par un agent : ce run ne dit rien de ce qu'une personne aurait fait.";
  if (c && c.mode === "humain") return "- La conduite est déclarée par une personne : les gestes qui en dépendent reposent sur sa parole.";
  return "- La conduite n'est pas déclarée : la page ne peut pas dire si un agent ou une personne a conduit le run.";
}

function sectionNeDitPas(recu) {
  return [
    "## 7. Ce que ce run ne dit pas",
    "",
    "- La justesse de ce que la session a écrit n'est pas jugée ici.",
    "- Un autre modèle, un autre dépôt, un autre skill ne sont pas couverts.",
    phraseConduite(recu),
    "- Ce que le reçu ne sait pas mesurer est listé dans les limites du rapport technique.",
  ];
}

function sectionPreuves(runDir, recu) {
  const lignes = ["## 8. Les preuves", "", "| Pièce | Lien |", "| --- | --- |"];
  const pieces = [
    ["Rapport technique", "RAPPORT.md"],
    ["Reçu", "receipt.json"],
    ["Décision du juge", "output.json"],
    ["Trace", "trace/echange.jsonl"],
  ];
  for (const [nom, chemin] of pieces) {
    if (existsSync(join(runDir, chemin))) lignes.push(`| ${nom} | [${chemin}](${chemin}) |`);
  }
  // La page reste sous son plafond (spec §2) : la liste complète des produits vit dans le rapport
  // technique, ici on en montre quelques-uns et on dit combien il y en a.
  const fichiers = liste(recu.produit && recu.produit.fichiers).filter(
    (f) => f && f.chemin && existsSync(join(runDir, join("raw", texte(recu.cas), f.chemin))),
  );
  for (const f of fichiers.slice(0, MAX_PRODUITS)) {
    const relatif = join("raw", texte(recu.cas), f.chemin);
    lignes.push(`| Fichier produit | [${f.chemin}](${relatif}) |`);
  }
  if (fichiers.length > MAX_PRODUITS) {
    lignes.push("", `${fichiers.length} fichiers produits au total ; la liste complète est dans le rapport technique.`);
  }
  return lignes;
}

function resultatTexte({ runDir, recu, sortie, attendu, lecture, trace, produit }) {
  const gestes = liste(lecture && lecture.gestes);
  const etats = gestes.map((g) => etatDeGeste(g, { recu, sortie, trace, produit }));
  const violations = violationsDe(recu);
  const differencePhrase = sortie && typeof sortie.difference === "string" ? sortie.difference.trim() : "";
  const titre = `# Résultat du test — ${texte(recu.cas)}, ${dateDuRun(recu)}`;
  const lignes = [
    "---",
    `name: Résultat — ${texte(recu.cas)}`,
    `description: ${texte(recu.verdict)} ; ${pluriel(violations.length, "règle non tenue", "règles non tenues")} ; ${pluriel(gestes.length, "geste déclaré", "gestes déclarés")}`,
    "type: run-result",
    "status: done",
    "---",
    "",
    titre,
    "",
    "## 1. En une phrase",
    "",
    phraseVerdict(recu, etats, violations, differencePhrase),
    "",
    "## 2. Le contexte",
    "",
  ];
  const session = recu.session || {};
  const modele = texte(session.modele, "modèle inconnu");
  const modeleCourt = session.outil && modele.startsWith(`${session.outil}/`) ? modele.slice(String(session.outil).length + 1) : modele;
  const morceaux = [
    `Cas \`${texte(recu.cas)}\``,
    `session ${texte(session.outil, "inconnue")}`,
    `modèle ${modeleCourt}`,
  ];
  const depot = lecture && typeof lecture.depot === "string" ? lecture.depot.trim() : "";
  if (depot) morceaux.push(depot);
  const d = duree(recu);
  if (d) morceaux.push(d);
  const echanges = recu.echanges || {};
  if (Number.isFinite(echanges.utilises) && Number.isFinite(echanges.budget)) {
    morceaux.push(`${pluriel(echanges.utilises, "échange", "échanges")} sur ${echanges.budget}`);
  }
  // ADR-071 : who conducted the run is a declared fact, and a page that hides it would let a reader
  // believe a person answered when an agent did.
  const conduite = recu.conduite;
  if (conduite && (conduite.mode === "agent" || conduite.mode === "humain")) {
    morceaux.push(`conduite ${conduite.mode === "agent" ? "par un agent" : "par une personne"}${conduite.qui ? ` (${conduite.qui})` : ""}`);
  } else if (recu.conduite === null || recu.conduite === undefined) {
    morceaux.push("conduite non déclarée");
  }
  lignes.push(`${morceaux.join(", ")}.`.replace(/, (\d+ min|\d+ s)/, ". Durée : $1"));
  lignes.push("", "## 3. Ce qui était attendu", "");
  if (attendu && typeof attendu.attendu === "string" && attendu.attendu.trim()) {
    lignes.push(attendu.attendu.trim());
  } else {
    lignes.push("Le cas ne décrit pas son attendu : la comparaison de la section 4 repose sur la seule lecture déclarée.");
  }
  const produitAttendu = attendu && attendu.attendu_details && attendu.attendu_details.produit;
  if (produitAttendu && produitAttendu.regle) {
    lignes.push("", `Produit attendu : ${produitAttendu.regle}.`);
  }
  lignes.push("");
  lignes.push(...sectionCadre(gestes, etats, recu, sortie));
  lignes.push("");
  lignes.push(...sectionSens(recu, sortie, violations));
  lignes.push("");
  lignes.push(...sectionDecider(recu, violations, sortie));
  lignes.push("");
  lignes.push(...sectionNeDitPas(recu));
  lignes.push("");
  lignes.push(...sectionPreuves(runDir, recu));
  lignes.push("");
  return lignes.join("\n");
}

function verifierContrat(contenu) {
  const corps = contenu.split("\n").filter((l) => !l.startsWith("name:") && !l.startsWith("description:") && !l.startsWith("type:") && !l.startsWith("status:"));
  // Une cible de lien n'est pas de la prose : « raw/ » y est un chemin, pas un mot du dedans.
  const trouve = corps.join("\n").replace(/\]\([^)]*\)/g, "]()").match(MOTS_INTERDITS);
  if (trouve) {
    throw new Error(`resultat : le corps emploie « ${trouve[0]} », un mot du dedans — la lecture ne recopie pas le vocabulaire du reçu`);
  }
  for (let i = 1; i <= 8; i += 1) {
    if (!contenu.includes(`## ${i}.`)) {
      throw new Error(`resultat : la section ${i} manque — les huit sections sont le contrat`);
    }
  }
}

/**
 * Écrit `RESULTAT.md` à la racine du run. Refuse un reçu absent, illisible ou sans verdict, une lecture
 * sans geste déclaré, et un fichier déjà présent sans `remplacer`. Ne suit aucun chemin absolu du reçu.
 */
export function ecrireResultat({ runDir, cas = null, attendu = null, lecture = null, remplacer = false }) {
  const dossier = String(runDir || "");
  if (!dossier || !existsSync(dossier) || !statSync(dossier).isDirectory()) {
    throw new Error(`resultat : ${dossier || "(aucun dossier)"} n'est pas un dossier de run lisible`);
  }
  const cheminRecu = join(dossier, "receipt.json");
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
  const cheminSortie = join(dossier, "RESULTAT.md");
  if (existsSync(cheminSortie) && !remplacer) {
    throw new Error(`resultat : ${cheminSortie} existe déjà — le résultat d'un run ne s'écrase pas sans --remplacer`);
  }
  const sortie = existsSync(join(dossier, "output.json")) ? lireJson(join(dossier, "output.json")) : null;
  const trace = lireParts(join(dossier, "trace", "echange.jsonl"));
  const produit = { present: Boolean(recu.produit && liste(recu.produit.chemins).length) };
  const contenu = resultatTexte({ runDir: dossier, recu, sortie, attendu, lecture, trace, produit });
  verifierContrat(contenu);
  writeFileSync(cheminSortie, contenu, "utf8");
  return { chemin: cheminSortie, ecrit: true, verdict: recu.verdict };
}

if (process.argv[1] && process.argv[1].endsWith("resultat.mjs")) {
  const [runDir, cheminLecture, cheminAttendu] = process.argv.slice(2);
  try {
    const r = ecrireResultat({
      runDir,
      lecture: cheminLecture ? lireJson(cheminLecture) : null,
      attendu: cheminAttendu ? lireJson(cheminAttendu) : null,
      remplacer: false,
    });
    process.stdout.write(`${r.chemin}\n`);
  } catch (e) {
    process.stderr.write(`REFUS — ${e.message}\n`);
    process.exit(1);
  }
}
