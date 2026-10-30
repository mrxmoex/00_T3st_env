# Phase 2 handoff: Compare density and hierarchy

## Intent

Same truth, fewer words on `/compare`, in EN and DE. Worked through the Phase 2 list in `docs/handoffs/phase-1.md` and wrote the rule it followed into `docs/ux-copy-contract.md` §8 (hint hierarchy). Served inputs C1, B1, B8, A3.

## Truth ledger

Where each fact lives now. Backings are unchanged from the Phase 1 ledger unless stated.

**Bioactive compounds**
- "mg per 100 g", "not scored", "compounds without an analysis are left out": one hint, level 1. "Left out" → `chipLabel` drops "not expected" and "no data".
- "What each compound does": the chip's role text, level 3.
- "The body makes several of these": dropped from the panel. Role texts state it for creatine, coenzyme Q10, and L-carnitine, and say humans cannot make ergothioneine. Phase 6 extends this.
- `*` and n.d.: marker key under the cards, level 2. Each entry shows only when a shown chip carries its mark, computed in `BioactivesProfile`.
- **Restored (Phase 1 miss):** what was measured, "state not given", range, and dry-weight scaling, inside the expanded chip, level 3 → `bioactiveValue` (`measured`, `state`, `range`, `fromDryWeight`). These were lost in Phase 0 when the table became chips; without them a value from beef semitendinosus read as measured in beef mince (non-claims 15 and 18).

**Nutrient radar**
- Full-scale grams, and "Percent: share of energy, the same on either basis": one hint, level 1.
- "4 · 9 · 4 kcal/g; fibre energy not counted": donut tooltip, level 3 → `macroEnergyShares`.
- Dropped as duplicates: "the bars show what 100 g is made of" (the bars' heading says it) and "grams follow the basis" (the toggle reads "Amounts").

**Axis radar**
- Protein split: one hint, level 1. "DIAAS = AAS × digestibility" stays in the digestibility spoke tooltip; "can exceed 1" is visible in the cards (egg 1.215).
- Protein readout under the radar: removed on Compare because the cards print the same line. Food keeps it (`showProteinReadout` defaults to true).

**Axis table**
- Carbohydrate row: the sentence becomes a key inside the row, level 2. "×" means under 0.5 g per 100 g → `CarbTypePie` threshold. "Not a 0–100 rank" dropped; the key names types and the pie tooltip gives grams per 100 g.
- **Fixed (pre-existing):** the key's swatches had been transparent since `50ca639` (the colour classes set SVG `fill`, which spans ignore). The key now shows the colours it names.
- "What reaches the body": the hint row is gone; the header carries the method link, level 4. Ileal digestibility is defined in a tooltip on its label, level 3.

**Micronutrient table**
- One sentence: full colour at 20 % DV per 100 kcal → `DENSITY_SATURATION_PCT_DV`.
- ⚠ sentence: shown only when a ⚠ cell is on screen, level 2. "How often it is eaten matters; the score is not lowered" moves to the ⚠ cell tooltip, level 3 → `upperLimitExceedances`.

## Decisions

- **Conditional keys, not permanent sentences.** The default trio (egg, lentils, roasted salmon) has no ⚠, so the ⚠ sentence was noise there.
- **Keep the cards' protein line, cut the radar's copy.** The cards are the primary summary and sit higher; one fact, one place.
- **Key beside its marks.** The carbohydrate legend floated between the radars and the table; it now sits in the row with the pies.
- **Tooltips only for detail that is not needed to avoid a misreading** (contract §8), because touch screens have no hover.
- **Restored provenance inside collapsed chips.** It costs no visible text and closes a truth gap Phase 1 missed.
- **Refused:** layout calibration (390 px table fit, legend spacing, radar scales) → Phase 3; renames; Food and Matrix copy → Phase 5.

## Files

- `src/components/BioactivesProfile.tsx`, `CompareBioactivesPanel.tsx`, `CompareAxisRadar.tsx`, `NutrientRadar.tsx`, `HeatCell.tsx`; `src/pages/ComparePage.tsx`; `src/index.css`; `src/i18n/en.ts`, `de.ts`, `messages.ts`; `docs/ux-copy-contract.md`.
- Keys removed: `compare.bioactivesSubtitle`, `compare.macroLegendNote`, `compare.carbRowHint`, `compare.necessityImpactGroupHint`.
- Keys added: `compare.bioactiveMarkers`, `compare.digestibilityDefinition`, `compare.microWarningKey`, `compare.microWarningTitle`.
- Keys changed: `compare.bioactivesHint`, `compare.axisRadarHint`, `compare.nutrientRadarHint`, `compare.macroShareCaption`, `compare.carbLegend.none`, `compare.microHint`.
- CSS removed: `.macro-legend-note`, `.group-hint-row`, `.carb-seg-quiet`.

## Verified

- `npm test` (89), `npm run build`, `npm run lint`.
- Help text on `/compare` with egg, lentils, and roasted salmon, counted by script: EN 440 → 296 words (−33 %), DE 423 → 283; 47 → 43 blocks; page height 4,377 → 4,289 px at 1,440 px wide and 6,395 → 6,211 px at 390 px.
- Scripted Chrome run (EN, DE, the liver ⚠ case, raw salmon without `*`, 390 px, Food page): 28 of 29 checks pass. The failure is the 390 px fit below.
- Evidence in `/opt/cursor/artifacts/` (VM-local): `phase2-before-*` and `phase2-after-*` screenshots, `phase2-compare-density-checks-2.mp4`, `phase2-browser-checks.log`, `phase2-metrics-before.log`, `phase2-metrics-after.log`.

## Found, not fixed

- At 390 px the micronutrient table needs 62 px of sideways scroll: 384 px in a 322 px panel, down from 920 px. Sticky label 168 px plus three 72 px value cells → Phase 3.
- Food page repeats its protein readout (radar and the EAA panel) and stacks two bioactive paragraphs (`food.bioactivesLede`, `compare.bioactivesProfileLede`) → Phase 5; it can switch on `markerKey` and drop the lede.
- Still open from Phase 1: per-100-kcal radar scales, macro legend dot spacing, pie size not encoding amount, the resistant-starch double count (needs the user's decision), Food page "limiting".

## Seeds for the next phase

Phase 3 (visual calibration):

1. Fit `table.compare-micro` at 390 px: below 480 px, tighter cell padding, a narrower pill (`.heat-percent` min-width), and a narrower sticky label. Target: table width ≤ panel width; the browser check already exists in the Phase 2 script.
2. Nutrient radar per 100 kcal: basis-specific full scales (pure fat is 11.1 g per 100 kcal, so the 20 g fat scale tops out at 56 %), with the hint still interpolated from the constant.
3. A scale cue on the nutrient radar now that ring numbers are gone, for example full-scale labels at the spoke ends.
4. Macro legend: dot spacing in `.macro-share-lines li`; decide whether each food needs a name line when the radar's figcaption already names it.
5. Carbohydrate pie: size for amount (A2). Any better-or-worse colour cue (B6) must follow the carbohydrate-axis formula; category colours stay types (contract §3).
6. Check at 1,280, 1,024, 768, and 390 px, light and dark.
