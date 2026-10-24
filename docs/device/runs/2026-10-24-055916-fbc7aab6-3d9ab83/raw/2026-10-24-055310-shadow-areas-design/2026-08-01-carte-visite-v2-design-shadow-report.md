---
source: docs/superpowers/specs/2026-08-01-carte-visite-v2-design.md
generated_at: 2026-10-24T06:01:32+02:00
---

# Shadow Areas Report

Source: `docs/superpowers/specs/2026-08-01-carte-visite-v2-design.md`
Generated: `2026-10-24T06:01:32+02:00`

Total gaps: 18 | Blocker: 0 | Major: 11 | Minor: 7

---

## Gaps by Category

### unstated assumption

**[major]** Are the canvas-measured widths at 34px guaranteed to reproduce in the printed PDF at 25.5pt after the px→pt→mm conversion?
> La pyramide est calibrée par **mesure réelle** (canvas `measureText`, polices chargées)

**[major]** Does the calibration measure the URL line as rendered in uppercase, or as the lowercase source string?
> Le texte de l'URL doit rester strictement `giak.substack.com` (affichage en majuscules via CSS `text-transform`, pas de substitution du texte).

**[major]** Should the print instructions require 100% scale with fit-to-page disabled?
> Impression | Laser B&N, 100% noir sur blanc pur.

### ambiguous term

**[major]** Is the 0.5pt cut border drawn inside the 90×55mm trim box?
> Gabarit | 90×55mm, grille 2×5 = **10 cartes par A4**, bordure fine 0.5pt autour de chaque carte (repère de coupe).

**[major]** Which small-caps implementation applies to lines 1-2: the font's native smcp feature or synthetic scaled capitals?
> Lignes 1-2 : EB Garamond small caps.

**[major]** Is the ~5mm cut margin a fixed offset or a minimum around a centred 180×275mm grid?
> `@page` : A4, marges telles que la grille 2×5 (90×55mm) tienne avec marge de coupe suffisante (~5mm autour de la grille).

**[minor]** What does « carrée » mean concretely for the v2 composition?
> La v2 est plus minimale, plus « carrée », limite LaTeX.

### missing edge case

**[major]** How are two adjacent cards cut so that each keeps its own clean 0.5pt edge at 90×55mm?
> Gabarit | 90×55mm, grille 2×5 = **10 cartes par A4**, bordure fine 0.5pt autour de chaque carte (repère de coupe).

**[minor]** What happens to the targeted width when the 0.42em letter-spacing cap is reached before the target?
> sinon le letter-spacing comble l'écart (cap 0.42em).

### missing actor

**[minor]** Who approves the vertical offset of the signature block that the spec leaves to implementation finish?
> la signature (L3 + L4) peut être légèrement décalée vers le bas pour respirer (décision de finition à l'implémentation, sans bouger l'axe horizontal).

### missing failure mode

**[major]** What should the build do when a Google Fonts request fails so the PDF is not produced with fallback glyphs?
> Polices chargées via Google Fonts (EB Garamond + Montserrat) ; le PDF doit embarquer les glyphes (chrome headless le fait).

**[minor]** Does the pipeline fail loudly when google-chrome is not installed on the build machine?
> Technique | HTML/CSS → PDF via `google-chrome --headless --print-to-pdf` (même chaîne que v1).

### missing acceptance criterion

**[major]** Which tolerance makes the inverted pyramid verifiably « visible à l'œil nu » on the printed card?
> Pyramide inversée visible à l'œil nu sur la carte imprimée.

**[major]** What minimum printed cap height defines « lisible » for the four lines?
> PDF A4 imprimé en laser B&N : 10 cartes découpables, lisibles, aucun texte tronqué.

**[minor]** Which measurements must `v2/carte_de_visite.svg` match to count as coherent with the A4 sheet?
> `v2/carte_de_visite.svg` — carte unique (aperçu / usage numérique), cohérente avec l'A4.

### missing dependency

**[major]** How is `v2/carte_de_visite.svg` produced so its metrics stay identical to the calibrated A4 sheet?
> 3. `v2/carte_de_visite.svg` — carte unique (aperçu / usage numérique), cohérente avec l'A4.

**[minor]** Are the EB Garamond and Montserrat files vendored locally instead of fetched from Google Fonts at generation time?
> Polices chargées via Google Fonts (EB Garamond + Montserrat) ; le PDF doit embarquer les glyphes (chrome headless le fait).

**[minor]** Are the brainstorm mockups that anchor the calibration retained in version control?
> Mockups de brainstorming : `.superpowers/brainstorm/1306592-1785595127/content/` (layout.html, apercu-a4.html, composition-c-pure.html, nom-auteur.html, nom-complet.html, largeurs.html, largeurs-v2.html).
