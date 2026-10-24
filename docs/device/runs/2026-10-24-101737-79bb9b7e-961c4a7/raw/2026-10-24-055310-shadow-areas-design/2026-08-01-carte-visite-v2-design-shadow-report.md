---
source: docs/superpowers/specs/2026-08-01-carte-visite-v2-design.md
generated_at: 2026-10-24T10:21:29.555008
# status: clean
---

# Shadow Areas Report

Source: `docs/superpowers/specs/2026-08-01-carte-visite-v2-design.md`
Generated: `2026-10-24T10:21:29.555008`

Total gaps: 7 | Blocker: 1 | Major: 4 | Minor: 2

---

## Warnings

- None

---

## Gaps by Category

### missing acceptance criterion

**[blocker]** what specific test or metric defines that the margin is "suffisante" (~5mm)?
> marges telles que la grille 2×5 (90×55mm) tienne avec marge de coupe suffisante (~5mm autour de la grille).

**[major]** what specific test or metric defines that the cards are "lisibles" (readable)?
> PDF A4 imprimé en laser B&N : 10 cartes découpables, lisibles, aucun texte tronqué.

**[major]** what specific test or metric defines "aucun texte tronqué" (no truncated text)?
> PDF A4 imprimé en laser B&N : 10 cartes découpables, lisibles, aucun texte tronqué.

### ambiguous term

**[minor]** how much is "légèrement décalée" (slightly displaced) in the card layout?
> la signature (L3 + L4) peut être légèrement décalée vers le bas pour respirer (décision de finition à l'implémentation, sans bouger l'axe horizontal).

**[minor]** how fine is "fine" for the 0.5pt border around each card?
> gabarit : 90×55mm, grille 2×5 = 10 cartes par A4, bordure fine 0.5pt autour de chaque carte (repère de coupe).

### missing failure mode

**[major]** what happens if Google Fonts CDN fails to load during PDF generation?
> Polices chargées via Google Fonts (EB Garamond + Montserrat) ; le PDF doit embarquer les glyphes (chrome headless le fait).

### missing edge case

**[major]** what happens with special characters (À, È, etc.) during font rendering and PDF generation?
> Le texte de l'URL doit rester strictement `giak.substack.com` (affichage en majuscules via CSS `text-transform`, pas de substitution du texte).
