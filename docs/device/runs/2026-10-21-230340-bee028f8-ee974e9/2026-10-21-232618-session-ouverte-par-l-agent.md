---
name: Session ouverte par l'agent — 2026-10-21-230340-bee028f8-ee974e9
description: Les pièces de ce run nomment « giak » comme auteur de l'ouverture, alors que la session a été ouverte par l'agent ; ce que cela change, ce que cela ne change pas, et pourquoi les pièces restent telles quelles
type: note
status: done
---

# Session ouverte par l'agent

> 2026-10-21, né à **23:26:28** (`stat -c %w`) ; le nom porte `232618` et l'écart de **10 secondes**
> reste nommé.

La session `ses_e9fb7e081ffeccjeY17yzKLo8s` de ce run a été **ouverte et suivie par l'agent** (buffy,
Freebuff), à la demande de l'opérateur, par `opencode run --model opencode/minimax-m3.1-flash-free
--auto --format json` au terrain du gel. Les trois gestes humains du §1 d'[ORCHESTRATEUR](../../ORCHESTRATEUR.md)
n'ont donc pas eu lieu : aucune personne n'a collé le texte, aucune n'a répondu la phrase figée.

**Ce que les pièces disent, et qui est faux.** `faits.json` porte `session.ouverte_par: "giak"` et un
`temoignage` qui affirme que « le fil a été ouvert et suivi par la personne » ; le reçu recopie les deux
champs, et [RAPPORT.md](RAPPORT.md) §2 écrit « ouverte par giak ». C'est le défaut de `suite`, qui prend
`$USER` quand `--par` et `--temoignage` manquent : la Séance 99 avait passé
`--par "buffy (agent Freebuff, à la demande de giak)"`, cette fois ils n'ont pas été passés.

**Ce que cela ne change pas.** Aucun falsificateur ne lit ces deux champs : le `conforme` du
[reçu](receipt.json) repose sur le tableau (51 lignes, 4 colonnes, seq 19), le produit (5 fichiers,
`sha256` re-hachés), les chemins lus et écrits, et la porte `24210562`. Les pièces ne sont pas réécrites :
`faits` refuse un fichier existant et `receipt` ne s'écrit qu'une fois ([ADR-037](../../../DECISIONS.md)).
Un run qui veut un témoignage vrai ouvre un dossier neuf et passe les deux options.

**Ce que le run ne mesure pas.** Le client non interactif ne peut pas poser de question : la session a
appelé l'outil `question` au seq 19, puis écrit les cinq fichiers aux seq 22 à 26 **dans le même tour**,
sans réponse de personne (budget **1/3**). L'attente de l'accord que la demande exige n'est donc pas
mesurée ; le reçu mesure l'ordre — tableau avant le produit — et les destinations, jamais la pause.
