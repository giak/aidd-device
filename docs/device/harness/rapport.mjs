// Le rapport utilisateur, dérivé du reçu, de l'output et de la trace (ADR-050). Ce module ne juge
// rien : il lit les pièces et rend un markdown dont chaque phrase vient d'un champ. Aucun modèle,
// aucun réseau, aucune dépendance. Deux appels sur les mêmes pièces rendent le même fichier.
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const VERDICTS = ["conforme", "ecart", "non concluant"];

const ORDRE_FALSIFICATEURS = [
  "birth_anterieur_au_gel",
  "arbre_de_travail_inchange",
  "produit_identique_a_une_empreinte_anterieure",
  "trace_sans_echange_dans_la_fenetre",
  "tableau_absent",
  "ecriture_avant_tableau",
  "produit_ne_avant_le_tableau",
  "question_sans_reponse",
  "pause_non_tenue",
  "lecture_hors_dossier",
  "ecriture_hors_dossier",
  "shell_hors_dossier",
  "shell_ecriture_hors_produit",
  "shell_invalide",
  "shell_non_interpretable",
  "reseau",
  "hors_produit",
];

const PHRASES_FALSIFICATEUR = {
  birth_anterieur_au_gel: "un produit est né avant le gel",
  arbre_de_travail_inchange: "le produit existe mais l'arbre de travail n'a pas bougé",
  produit_identique_a_une_empreinte_anterieure: "le produit recopie un fichier déjà présent",
  trace_sans_echange_dans_la_fenetre: "la trace ne porte aucun échange dans la fenêtre du run",
  tableau_absent: "la trace ne porte aucun tableau rendu par la session",
  ecriture_avant_tableau: "une écriture précède le tableau",
  produit_ne_avant_le_tableau: "un produit est né avant le tableau",
  question_sans_reponse: "la session a posé une question et écrit sans attendre la réponse",
  pause_non_tenue: "la session a écrit sans laisser la personne répondre",
  lecture_hors_dossier: "une lecture est sortie du cadre déclaré",
  ecriture_hors_dossier: "une écriture d'outil est sortie du cadre déclaré",
  shell_hors_dossier: "une commande shell lit hors du cadre déclaré",
  shell_ecriture_hors_produit: "une commande shell écrit hors du produit",
  shell_invalide: "une commande shell est mal formée et le shell l'aurait refusée",
  shell_non_interpretable: "une commande shell n'est pas interprétable",
  reseau: "un appel réseau interdit a eu lieu",
  hors_produit: "un fichier a été écrit hors du produit",
};

const texte = (valeur, defaut = "—") =>
  valeur === null || valeur === undefined || valeur === "" ? defaut : String(valeur);
const cellule = (valeur) => texte(valeur).replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
const inline = (valeur) => `\`${texte(valeur).replace(/`/g, "'")}\``;
const liste = (valeur) => (Array.isArray(valeur) ? valeur : []);

function lireJson(chemin) {
  try {
    return JSON.parse(readFileSync(chemin, "utf8"));
  } catch {
    return null;
  }
}

function lireTrace(chemin) {
  if (!existsSync(chemin)) return { present: false, lignes: 0, illisibles: 0, outils: {} };
  const contenu = readFileSync(chemin, "utf8");
  const outils = {};
  let lignes = 0;
  let illisibles = 0;
  for (const ligne of contenu.split(/\r?\n/)) {
    if (!ligne.trim()) continue;
    lignes += 1;
    let part;
    try {
      part = JSON.parse(ligne);
    } catch {
      illisibles += 1;
      continue;
    }
    if (part && part.kind === "tool" && typeof part.outil === "string" && part.outil) {
      outils[part.outil] = (outils[part.outil] || 0) + 1;
    }
  }
  return { present: true, lignes, illisibles, outils };
}

function morsuresDe(recu) {
  const falsificateurs = recu.falsificateurs && typeof recu.falsificateurs === "object"
    ? recu.falsificateurs
    : {};
  const cles = [
    ...ORDRE_FALSIFICATEURS.filter((cle) => Object.prototype.hasOwnProperty.call(falsificateurs, cle)),
    ...Object.keys(falsificateurs).filter((cle) => !ORDRE_FALSIFICATEURS.includes(cle)),
  ];
  return cles
    .map((cle) => ({ cle, valeur: falsificateurs[cle] }))
    .filter(({ valeur }) => (Array.isArray(valeur) ? valeur.length > 0 : valeur === true));
}

function limitesDe(recu, { output, trace, gate, faits, champLecturePresent, lectures }) {
  const limites = [...liste(recu.limites).map(String)];
  const ajouter = (ligne) => {
    if (!limites.includes(ligne)) limites.push(ligne);
  };
  if (!champLecturePresent) {
    ajouter(
      "le reçu ne porte pas `lecture_hors_dossier` : il a été écrit avant l'ADR-049, et les lectures hors dossier ne sont pas mesurées",
    );
  } else if (!Array.isArray(lectures)) {
    ajouter("le champ `lecture_hors_dossier` du reçu n'est pas une liste : les lectures ne sont pas classées");
  }
  if (!output) ajouter("l'output.json du juge est absent : la phrase du juge n'est pas disponible");
  if (!trace.present) ajouter("la trace normalisée est absente : les outils et leurs chemins ne sont pas comptés");
  if (trace.illisibles) ajouter(`${trace.illisibles} ligne(s) de la trace sont illisibles : elles ne comptent pas`);
  if (!gate) ajouter("gate.json est absent : la porte n'est pas relue par le rapport");
  if (!faits) ajouter("faits.json est absent : les faits du run ne sont pas relus par le rapport");
  return limites;
}

function dateRecu(recu) {
  return texte(recu.recu_ecrit_le, "date inconnue");
}

function tableLignes(lignes) {
  return ["| | |", "| --- | --- |", ...lignes.map(([gauche, droite]) => `| ${cellule(gauche)} | ${cellule(droite)} |`)];
}

function sectionReponse(recu, sortie, morsures, limites) {
  const details = [];
  if (morsures.length) details.push(`morsures : ${morsures.map((m) => `\`${m.cle}\``).join(", ")}`);
  if (limites.length) details.push(`limites : ${limites.length} (voir §5)`);
  const verdict = recu.verdict;
  const debut = verdict === "conforme"
    ? `Le reçu conclut \`conforme\` : aucun falsificateur mesuré n'a mordu${details.length ? ` ; ${details.join(" ; ")}` : ""}.`
    : verdict === "ecart"
      ? `Le reçu conclut \`ecart\`${details.length ? ` ; ${details.join(" ; ")}` : ""}.`
      : `Le reçu conclut \`non concluant\`${details.length ? ` ; ${details.join(" ; ")}` : ""}.`;
  const milieu = verdict === "conforme"
    ? "Cela atteste la chaîne, la porte, la trace et l'ordre des gestes, pas la qualité du skill ni la justesse du produit."
    : verdict === "ecart"
      ? "L'écart est nommé ; il ne dit pas s'il vient du skill ou de la session."
      : "Un non concluant n'est pas une défaillance du dispositif : il dit ce que la preuve ne permet pas de conclure.";
  const phrase = sortie && typeof sortie.phrase === "string" && sortie.phrase.trim()
    ? `> « ${sortie.phrase.trim()} » — \`output.json\``
    : "Aucune phrase du juge n'est disponible : `output.json` est absent.";
  return ["## 1. La réponse", "", debut, "", milieu, "", phrase];
}

function sectionTeste(recu, trace) {
  const session = recu.session || recu.session_verifiee || {};
  const echanges = recu.echanges || {};
  const tableau = recu.tableau || {};
  const produit = recu.produit || {};
  const fichiers = liste(produit.fichiers);
  const chemins = liste(produit.chemins);
  const produitTexte = produit.absent || chemins.length === 0
    ? "absent"
    : `${chemins.length} fichier(s) : ${chemins.map((c) => inline(c)).join(", ")}${fichiers.length ? ` (${fichiers.map((f) => `${cellule(f.chemin)} ${texte(f.taille, "?")} o`).join(", ")})` : ""}`;
  const outils = Object.entries(trace.outils)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([outil, n]) => `${outil} ${n}`)
    .join(", ");
  const budget = echanges.budget === undefined
    ? "non mesuré"
    : `${texte(echanges.utilises)}/${texte(echanges.budget)} échange(s)${echanges.epuise_par ? `, épuisé au seq ${texte(echanges.epuise_par.seq)}` : ""}`;
  const tableauTexte = tableau.present
    ? `présent, ${texte(tableau.lignes)} ligne(s) × ${texte(tableau.colonnes)} colonne(s), seq ${texte(tableau.seq)}`
    : "absent";
  return [
    "## 2. Ce qui a été testé",
    "",
    ...tableLignes([
      ["Cas", inline(recu.cas)],
      ["Session", `${texte(session.outil)} ; modèle ${inline(session.modele)} ; fil ${inline(session.identifiant)} ; ouverte par ${texte(session.ouverte_par)} le ${texte(session.ouverte_le)}`],
      ["Budget", budget],
      ["Tableau", tableauTexte],
      ["Produit", produitTexte],
      ["Révisions", `framework ${inline(recu.framework_rev)} ; terrain ${inline(recu.terrain_rev)}`],
      ["Durée", `de ${texte(recu.horodatage_debut)} à ${texte(recu.horodatage_fin)}`],
      ["Trace", trace.present ? `${trace.lignes} ligne(s) lue(s)${outils ? ` ; outils : ${outils}` : " ; aucun outil nommé"}` : "absente"],
    ]),
  ];
}

function sectionEtablit(recu) {
  const gel = recu.gel_verifie || {};
  const porte = recu.porte || {};
  const trace = recu.trace_lue || {};
  const verifiee = recu.trace_verifiee || {};
  const produit = recu.produit || {};
  const copie = produit.verifie || {};
  const echanges = recu.echanges || {};
  const tableau = recu.tableau || {};
  const lignes = [];
  lignes.push(gel.empreinte
    ? `- le gel a été re-haché : empreinte ${inline(gel.empreinte)}, ${texte(gel.fichiers)} fichier(s), ${texte(gel.references)} référence(s) (\`gel_verifie\`).`
    : "- le gel n'est pas décrit par le reçu (`gel_verifie` absent).");
  lignes.push(porte.sha256
    ? `- la porte est citée : ${inline(porte.sha256)}, cas ${inline(porte.cas)}, gel ${inline(porte.gel_empreinte)} (\`porte\`).`
    : "- la porte n'est pas citée par le reçu (`porte` absent).");
  lignes.push(trace.sha256
    ? `- la trace a été lue et rejouée : ${texte(trace.lignes)} ligne(s), ${texte(trace.echanges_dans_la_fenetre)} échange(s) dans la fenêtre, sha256 ${inline(trace.sha256)} (\`trace_lue\`), ${inline(verifiee.rejoue_le)} (\`trace_verifiee\`).`
    : "- la trace n'a pas été lue par le reçu (`trace_lue` absent).");
  lignes.push(copie.fichiers !== undefined
    ? `- la copie sous \`raw/\` a été re-hachée : ${texte(copie.fichiers)} fichier(s), manifeste ${inline(copie.manifeste_sha256)} (\`produit.verifie\`).`
    : "- la copie sous `raw/` n'est pas décrite par le reçu (`produit.verifie` absent).");
  lignes.push(echanges.budget !== undefined
    ? `- le budget a été compté : ${texte(echanges.utilises)}/${texte(echanges.budget)} échange(s) (\`echanges\`).`
    : "- le budget n'est pas compté par le reçu (`echanges` absent).");
  // ADR-071 : the declaration is cited, with what it does not prove.
  const conduite = recu.conduite;
  lignes.push(conduite && (conduite.mode === "agent" || conduite.mode === "humain")
    ? `- la conduite est déclarée ${conduite.mode === "agent" ? "par un agent" : "par une personne"}${conduite.qui ? ` (${texte(conduite.qui)})` : ""}, non vérifiée (\`conduite\`).`
    : "- la conduite n'est pas déclarée par ce reçu (`conduite` absent ou nul).");
  lignes.push(tableau.present !== undefined
    ? `- la forme du tableau a été lue : ${tableau.present ? `${texte(tableau.lignes)} ligne(s) × ${texte(tableau.colonnes)} colonne(s), seq ${texte(tableau.seq)}` : "aucun tableau"} (\`tableau\`).`
    : "- la forme du tableau n'est pas décrite par le reçu (`tableau` absent).");
  return ["## 3. Ce que le reçu établit", "", ...lignes];
}

function sectionNEtablitPas(sortie) {
  const ecartes = liste(sortie && sortie.ecarte_comme_non_testable);
  const lignes = [
    "- la qualité du skill, la justesse du produit et la reproductibilité ;",
    "- la conduite (agent ou humain), qui est déclarée par l'opérateur et jamais vérifiée ;",
    "- le contenu d'une commande `shell` construite dynamiquement, que le reçu ne sait pas lire (ADR-051) ;",
    "- les limites du reçu, détaillées au §5.",
  ];
  if (ecartes.length) {
    lignes.push("", "Ce que l'output écarte comme non testable :", "");
    for (const e of ecartes) {
      lignes.push(`- ${texte(e.attendu, "attendu non nommé")} : ${texte(e.critere, "critère non nommé")}`);
    }
  }
  return ["## 4. Ce qu'il n'établit pas", "", ...lignes];
}

function sectionMorsures(recu, morsures, limites, sortie) {
  const lignes = ["## 5. Les morsures et les limites", ""];
  if (!morsures.length) {
    lignes.push("Aucun falsificateur ne mord dans le reçu.", "");
  } else {
    lignes.push("| Clé | Ce que la morsure dit |", "| --- | --- |");
    for (const { cle, valeur } of morsures) {
      const phrase = PHRASES_FALSIFICATEUR[cle] || `falsificateur \`${cle}\``;
      const detail = Array.isArray(valeur) ? valeur.map((v) => JSON.stringify(v)).join(", ") : JSON.stringify(valeur);
      lignes.push(`| ${cellule(cle)} | ${cellule(`${phrase} ; valeur : ${detail}`)} |`);
    }
    lignes.push("");
  }
  const difference = sortie && typeof sortie.difference === "string" ? sortie.difference.trim() : "";
  if (recu.verdict === "ecart" && difference) {
    lignes.push("**L'écart nommé par le juge**", "", difference, "");
  }
  if (!limites.length) {
    lignes.push("Le reçu ne porte aucune limite.", "");
  } else {
    lignes.push("**Limites**", "");
    for (const l of limites) lignes.push(`- ${l}`);
    lignes.push("");
  }
  return lignes;
}

// §6 says each measured effect in its own subsection. A field an old receipt does not carry is said
// absent here, never in the limits list: adding a limit would move the fallback of §7 for a receipt
// that predates ADR-051, and the report does not get to rewrite the pieces it reads.
function tableauEffets(entetes, lignes, cle) {
  const sortie = [`| ${entetes.join(" | ")} |`, `| ${entetes.map(() => "---").join(" | ")} |`];
  for (const l of lignes) sortie.push(`| ${entetes.map((_, i) => cellule(l[i])).join(" | ")} |`);
  sortie.push("", `Ces entrées interdisent \`conforme\` (\`${cle}\`).`, "");
  return sortie;
}

function sectionEffets(falsificateurs, { champLecturePresent, lectures }) {
  const a = (cle) => Object.prototype.hasOwnProperty.call(falsificateurs, cle);
  const liste = (cle) => (Array.isArray(falsificateurs[cle]) ? falsificateurs[cle] : null);
  const lignes = ["## 6. Les effets hors cadre", "", "### 6.1 Les lectures hors dossier", ""];
  if (!champLecturePresent) {
    lignes.push(
      "Ce reçu a été écrit avant l'ADR-049 : il ne porte pas `lecture_hors_dossier`. Le rapport ne peut donc pas conclure sur les lectures hors dossier, et l'absence de ce champ est dite dans les limites.",
      "",
    );
  } else if (!Array.isArray(lectures)) {
    lignes.push("Le champ `lecture_hors_dossier` n'est pas une liste : le rapport ne classe pas les lectures.", "");
  } else if (!lectures.length) {
    lignes.push("Le reçu ne nomme aucune lecture hors dossier.", "");
  } else {
    lignes.push("| seq | outil | chemin |", "| --- | --- | --- |");
    for (const l of lectures) lignes.push(`| ${cellule(l.seq)} | ${cellule(l.outil)} | ${cellule(l.chemin)} |`);
    lignes.push("", "Ces lectures interdisent `conforme`.", "");
  }

  lignes.push("### 6.2 Les écritures d'outil hors dossier", "");
  if (!a("ecriture_hors_dossier")) {
    lignes.push("Ce reçu ne porte pas `ecriture_hors_dossier` : il a été écrit avant l'ADR-063, et les chemins nommés par les outils d'écriture ne sont pas mesurés.", "");
  } else if (!liste("ecriture_hors_dossier").length) {
    lignes.push("Le reçu ne nomme aucune écriture d'outil hors du cadre déclaré.", "");
  } else {
    lignes.push(...tableauEffets(["seq", "outil", "chemin"], liste("ecriture_hors_dossier").map((e) => [e.seq, e.outil, e.chemin]), "ecriture_hors_dossier"));
  }

  lignes.push("### 6.3 Les lectures par une commande shell", "");
  if (!a("shell_hors_dossier")) {
    lignes.push("Ce reçu ne porte pas `shell_hors_dossier` : il a été écrit avant l'ADR-051, et les lectures faites par une commande shell ne sont pas mesurées.", "");
  } else if (!liste("shell_hors_dossier").length) {
    lignes.push("Le reçu ne nomme aucune lecture shell hors du cadre déclaré.", "");
  } else {
    lignes.push(...tableauEffets(["seq", "commande", "chemin"], liste("shell_hors_dossier").map((e) => [e.seq, e.commande, e.chemin]), "shell_hors_dossier"));
  }

  lignes.push("### 6.4 Les écritures shell hors du produit", "");
  if (!a("shell_ecriture_hors_produit")) {
    lignes.push("Ce reçu ne porte pas `shell_ecriture_hors_produit` : il a été écrit avant l'ADR-051, et les écritures d'une commande shell ne sont pas mesurées.", "");
  } else if (!liste("shell_ecriture_hors_produit").length) {
    lignes.push("Le reçu ne nomme aucune écriture shell hors du produit.", "");
  } else {
    lignes.push(...tableauEffets(["seq", "commande", "chemin"], liste("shell_ecriture_hors_produit").map((e) => [e.seq, e.commande, e.chemin]), "shell_ecriture_hors_produit"));
  }

  lignes.push("### 6.5 Les appels réseau", "");
  if (!a("reseau")) {
    lignes.push("Ce reçu ne porte pas `reseau` : il a été écrit avant l'ADR-051, et les appels réseau ne sont pas mesurés.", "");
  } else if (!liste("reseau").length) {
    lignes.push("Le reçu ne nomme aucun appel réseau interdit.", "");
  } else {
    lignes.push(...tableauEffets(["seq", "commande", "motif"], liste("reseau").map((e) => [e.seq, e.commande, e.motif]), "reseau"));
  }

  lignes.push("### 6.6 Les fichiers hors du produit", "");
  if (!a("hors_produit")) {
    lignes.push("Ce reçu ne porte pas `hors_produit` : il a été écrit avant l'ADR-051, et les fichiers nouveaux hors du produit ne sont pas mesurés.", "");
  } else if (!liste("hors_produit").length) {
    lignes.push("Le reçu ne nomme aucun fichier nouveau hors du produit.", "");
  } else {
    lignes.push(...tableauEffets(["chemin", "nature"], liste("hors_produit").map((e) => [e.chemin, e.nature]), "hors_produit"));
  }

  lignes.push("### 6.7 Les commandes shell mal formées", "");
  if (!a("shell_invalide")) {
    lignes.push("Ce reçu ne porte pas `shell_invalide` : il a été écrit avant l'ADR-070, et une commande mal formée est comptée avec les commandes non interprétées.", "");
  } else if (!liste("shell_invalide").length) {
    lignes.push("Le reçu ne nomme aucune commande shell mal formée.", "");
  } else {
    lignes.push(...tableauEffets(["seq", "commande", "motif"], liste("shell_invalide").map((e) => [e.seq, e.commande, e.motif]), "shell_invalide"));
  }

  lignes.push("### 6.8 Les commandes shell non interprétées", "");
  if (!a("shell_non_interpretable")) {
    lignes.push("Ce reçu ne porte pas `shell_non_interpretable` : il a été écrit avant l'ADR-051, et une commande shell non littérale n'est pas signalée.", "");
  } else if (!liste("shell_non_interpretable").length) {
    lignes.push("Le reçu ne nomme aucune commande shell non interprétable.", "");
  } else {
    lignes.push(...tableauEffets(["seq", "commande", "motif"], liste("shell_non_interpretable").map((e) => [e.seq, e.commande, e.motif]), "shell_non_interpretable"));
  }
  return lignes;
}

function sectionPistes(recu, sortie, morsures, limites, lectures, { outputPresent, champLecturePresent }) {
  const pistes = [];
  const ajouter = (piste) => {
    if (!pistes.includes(piste)) pistes.push(piste);
  };
  const cles = new Set(morsures.map((m) => m.cle));
  const limitesTexte = limites.join(" ");
  if (limitesTexte.includes("attendu_incomplet")) {
    ajouter("Remplir le falsificateur de promesse, faire confirmer la promesse, puis re-geler le cas.");
  }
  if (cles.has("tableau_absent") || cles.has("ecriture_avant_tableau")) {
    ajouter("Vérifier que la session rend un tableau avant d'écrire, puis rejouer.");
  }
  if (recu.produit?.absent || liste(recu.produit?.chemins).length === 0 || cles.has("arbre_de_travail_inchange")) {
    ajouter("Vérifier le chemin du produit et la collecte sous `raw/<cas>/`, puis rejouer.");
  }
  if (Array.isArray(lectures) && lectures.length) {
    ajouter("Rejouer dans un bac propre, sans accès aux autres cas, et vérifier la trace avant de conclure.");
  }
  if (cles.has("ecriture_hors_dossier")) {
    ajouter("Vérifier ce que la session a écrit avec un outil d'écriture hors du dossier autorisé, corriger le chemin, puis rejouer.");
  }
  if (cles.has("shell_hors_dossier")) {
    ajouter("Rejouer dans un bac propre, sans accès aux autres cas, et vérifier les commandes shell de la trace avant de conclure.");
  }
  if (cles.has("shell_ecriture_hors_produit")) {
    ajouter("Vérifier ce que la session a écrit hors du produit, corriger la commande qui l'a fait, puis rejouer.");
  }
  if (cles.has("shell_invalide")) {
    ajouter("Corriger la commande mal formée que le shell refuserait, puis rejouer : rien de ce qu'elle promettait n'a eu lieu.");
  }
  if (cles.has("shell_non_interpretable")) {
    ajouter("Lire à la main la commande que le reçu n'interprète pas, puis rejouer avec une commande littérale.");
  }
  if (cles.has("reseau")) {
    ajouter("Vérifier l'interdiction réseau de la demande, puis rejouer sans y toucher.");
  }
  if (cles.has("hors_produit")) {
    ajouter("Classer les fichiers nouveaux hors du produit (contexte, artefact du client, produit) et corriger ce que la session a écrit, puis rejouer.");
  }
  if (cles.has("trace_sans_echange_dans_la_fenetre") || limites.some((l) => String(l).includes("trace normalisée est absente"))) {
    ajouter("Vérifier l'export de la trace et le répertoire de la session.");
  }
  if (!outputPresent) {
    ajouter("Écrire l'output du juge avant de conclure sur la phrase du verdict.");
  }
  if (!champLecturePresent) {
    ajouter("Rejouer avec un reçu écrit après l'ADR-049, ou reconstruire les pièces avec la règle actuelle.");
  }
  if (recu.verdict === "conforme" && !morsures.length) {
    ajouter("Répéter sur un autre modèle ou un vrai dépôt, et lire le produit à la main : le reçu ne juge pas son contenu.");
  }
  const difference = sortie && typeof sortie.difference === "string" ? sortie.difference.trim() : "";
  if (recu.verdict === "ecart" && difference) {
    ajouter("Relire l'écart nommé par le juge dans `output.difference`, vérifier le produit, puis rejouer le cas.");
  }
  for (const limite of limites) {
    if (String(limite).includes("lecture_hors_dossier")) continue;
    if (/tableau|produit|output|trace|attendu_incomplet|shell|réseau|porcelain|contexte|écriture/i.test(String(limite))) continue;
    const deja = pistes.some((p) => p.includes(limite));
    if (!deja) ajouter(`Relire la limite « ${limite} » et corriger la pièce qu'elle nomme.`);
  }
  if (!pistes.length) pistes.push("Aucune action dérivée ; relire le reçu et le produit.");
  return ["## 7. Les pistes", "", ...pistes.map((p) => `- ${p}`)];
}

function sectionPreuves(runDir, recu, outputPresent, tracePresent, gatePresent, faitsPresent) {
  const pieces = [
    ["receipt.json", "receipt.json", true],
    ["output.json", "output.json", outputPresent],
    ["trace/echange.jsonl", "trace/echange.jsonl", tracePresent],
    ["gate.json", "gate.json", gatePresent],
    ["faits.json", "faits.json", faitsPresent],
  ];
  for (const chemin of liste(recu.produit?.chemins)) pieces.push([chemin, chemin, existsSync(join(runDir, chemin))]);
  const lignes = ["## 8. Où lire les preuves", "", "| Pièce | Lien |", "| --- | --- |"];
  for (const [label, chemin, present] of pieces) {
    lignes.push(`| ${cellule(label)} | ${present ? `[${cellule(label)}](${chemin})` : `absent : ${cellule(chemin)}`} |`);
  }
  return lignes;
}

function sectionNeProuvePas() {
  return [
    "## 9. Ce que ce rapport ne prouve pas",
    "",
    "Ce rapport est une vue des pièces du run, pas un nouveau run. Il ne juge ni le contenu ni la qualité du produit, ne remplace pas la lecture humaine, et ne mesure pas ce que le reçu ne mesure pas. Les absences et les limites sont dites dans les sections précédentes ; elles ne sont pas comblées par ce document.",
  ];
}

function rapportTexte({ runDir, recu, sortie, trace, gate, faits, falsificateurs, champLecturePresent, lectures, morsures, limites }) {
  const description = [
    recu.verdict,
    morsures.length ? `morsure(s) : ${morsures.map((m) => m.cle).join(", ")}` : "aucune morsure",
    `${limites.length} limite(s)`,
  ].join(" ; ");
  return [
    "---",
    `name: Rapport utilisateur — ${recu.cas}`,
    `description: ${description}`,
    "type: run-report",
    "status: done",
    "---",
    "",
    `# Rapport utilisateur — ${recu.cas}`,
    "",
    `> Vue déterministe du reçu \`receipt.json\` et de la trace \`trace/echange.jsonl\`. Reçu écrit le ${dateRecu(recu)}. Ce rapport ne remplace ni le reçu ni l'output.`,
    "",
    ...sectionReponse(recu, sortie, morsures, limites),
    "",
    ...sectionTeste(recu, trace),
    "",
    ...sectionEtablit(recu),
    "",
    ...sectionNEtablitPas(sortie),
    "",
    ...sectionMorsures(recu, morsures, limites, sortie),
    ...sectionEffets(falsificateurs, { champLecturePresent, lectures }),
    ...sectionPistes(recu, sortie, morsures, limites, lectures, {
      outputPresent: Boolean(sortie),
      champLecturePresent,
    }),
    "",
    ...sectionPreuves(runDir, recu, Boolean(sortie), trace.present, Boolean(gate), Boolean(faits)),
    "",
    ...sectionNeProuvePas(),
    "",
  ].join("\n");
}

/**
 * Écrit `RAPPORT.md` à la racine du run. Refuse un reçu absent, illisible ou sans verdict, et un
 * rapport déjà présent sans `remplacer`. Ne lit que le dossier du run ; aucun chemin absolu du reçu
 * n'est suivi.
 */
export function ecrireRapport({ runDir, cas = null, remplacer = false }) {
  const dossier = String(runDir || "");
  if (!dossier || !existsSync(dossier) || !statSync(dossier).isDirectory()) {
    throw new Error(`rapport : ${dossier || "(aucun dossier)"} n'est pas un dossier de run lisible`);
  }
  const cheminRecu = join(dossier, "receipt.json");
  if (!existsSync(cheminRecu)) {
    throw new Error(`rapport : ${cheminRecu} est absent — un rapport sans reçu inventerait ses faits`);
  }
  const recu = lireJson(cheminRecu);
  if (!recu || typeof recu !== "object") {
    throw new Error(`rapport : ${cheminRecu} est illisible — un rapport sans reçu lisible n'est pas dérivable`);
  }
  if (cas && recu.cas && recu.cas !== cas) {
    throw new Error(`rapport : le reçu nomme le cas ${recu.cas}, pas ${cas}`);
  }
  if (!VERDICTS.includes(recu.verdict)) {
    throw new Error(`rapport : le reçu porte un verdict « ${texte(recu.verdict, "absent")} », hors de ${VERDICTS.join(" | ")}`);
  }
  const cheminRapport = join(dossier, "RAPPORT.md");
  if (existsSync(cheminRapport) && !remplacer) {
    throw new Error(`rapport : ${cheminRapport} existe déjà — le rapport d'un run ne s'écrase pas sans --remplacer`);
  }

  const cheminOutput = join(dossier, "output.json");
  const sortie = existsSync(cheminOutput) ? lireJson(cheminOutput) : null;
  const trace = lireTrace(join(dossier, "trace", "echange.jsonl"));
  const gate = existsSync(join(dossier, "gate.json"));
  const faits = existsSync(join(dossier, "faits.json"));
  const falsificateurs = recu.falsificateurs && typeof recu.falsificateurs === "object"
    ? recu.falsificateurs
    : {};
  const champLecturePresent = Object.prototype.hasOwnProperty.call(falsificateurs, "lecture_hors_dossier");
  const lectures = champLecturePresent ? falsificateurs.lecture_hors_dossier : null;
  const morsures = morsuresDe(recu);
  const limites = limitesDe(recu, {
    output: Boolean(sortie),
    trace,
    gate,
    faits,
    champLecturePresent,
    lectures,
  });
  const contenu = rapportTexte({
    runDir: dossier,
    recu,
    sortie,
    trace,
    gate,
    faits,
    falsificateurs,
    champLecturePresent,
    lectures,
    morsures,
    limites,
  });
  writeFileSync(cheminRapport, contenu, "utf8");
  return { chemin: cheminRapport, ecrit: true, verdict: recu.verdict };
}

if (process.argv[1] && process.argv[1].endsWith("rapport.mjs")) {
  const [runDir, cas] = process.argv.slice(2);
  try {
    const r = ecrireRapport({ runDir, cas, remplacer: false });
    process.stdout.write(`${r.chemin}\n`);
  } catch (e) {
    process.stderr.write(`REFUS — ${e.message}\n`);
    process.exit(1);
  }
}
