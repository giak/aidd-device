---
source: docs/superpowers/specs/2026-08-01-carte-visite-v2-design.md
generated_at: 2026-10-24T10:09:57.806Z
# status: 
---

# Shadow Areas Report

Source: `docs/superpowers/specs/2026-08-01-carte-visite-v2-design.md`
Generated: 2026-10-24T10:09:57.806Z

Total gaps: 6 | Blocker: 4 | Major: 1 | Minor: 1

---
## Gaps by Category

### unstated assumption

**[blocker]** what assumption about printing being black and white is being treated as obvious without being written down?
> L'utilisateur (Christophe Giacomel, publication « Résistance Cognitive » sur Substack) veut des cartes de visite imprimées en laser noir et blanc sur A4, plusieurs cartes par page.


### ambiguous term

**[minor]** what is the precise definition of 'limite LaTeX' in this context?
> La v2 est plus minimale, plus « carrée », limite LaTeX.


### missing actor

**[blocker]** who is responsible for approving the design decisions before implementation?
> L'utilisateur (Christophe Giacomel, publication « Résistance Cognitive » sur Substack) veut des cartes de visite imprimées en laser noir et blanc sur A4, plusieurs cartes par page.


### missing acceptance criterion

**[blocker]** what acceptance criterion or testable pass/fail condition is missing for the measurement system?
> La pyramide est calibrée par **mesure réelle** (canvas `measureText`, polices chargées) : chaque ligne reçoit une taille et un letter-spacing calculés pour atteindre exactement sa largeur cible.

**[major]** what acceptance criterion or testable pass/fail condition is missing for the 'pas de texte tronqué' requirement?
> - PDF A4 imprimé en laser B&N : 10 cartes découpables, lisibles, aucun texte tronqué.


### missing dependency

**[blocker]** which external measurement system or tool is required but not named in the document?
> La pyramide est calibrée par **mesure réelle** (canvas `measureText`, polices chargées) : chaque ligne reçoit une taille et un letter-spacing calculés pour atteindre exactement sa largeur cible.


