# Phase 1 handoff: truth audit and copy contract

## Intent

Make every claim on `/compare` true to the code and the data, in EN and DE, and write down the rules future copy follows (`docs/ux-copy-contract.md`). Served inputs C2, B2, B3, B5, B6, B7. Words, colours, and marks changed; no axis, composite, or tier formula did.

## Truth ledger

Legend: **kept** (true as it was), **changed** (was false, unbacked, drifted, stale, or imprecise), with the backing.

**Food cards**
- Class and tier line, NOVA marker: kept → `card.tier`, `food.processing.nova`.
- Protein line `compare.eaaLine`: changed. "limiting X" only when AAS < 1, otherwise "complete" → `scoreEaa` flags (`src/scoring/eaa.ts`). Before: egg and salmon read "limiting LYS"; 50 of 96 foods were affected.
- Honours `foodHonors`: changed. Raw-tissue compound values on prepared foods carry `*` and the note `food.bioactiveRawValue` (non-claim 18; `rawValueForPreparedFood` in `src/data/bioactives.ts`). Before: roasted and smoked salmon, fried chicken, poached cod and herring, roasted lamb, and boiled cabbage showed raw values unmarked. The line now ends with "per 100 g".
- `compare.honorsEmpty`: changed to name all three honour kinds (fibre, B12, bioactives).

**Axis radar**
- Spokes and protein split labels and tips: kept → `compareRadarValue`, `eaa.parts` (pattern = min(1, AAS), digestibility, density = protein / 20 g).
- `compare.axisRadarHint`: changed. Dropped "plain available", which attached the user's A1 phrase to DIAAS with the opposite meaning; DE carried a different wording.
- `compare.radarProteinLegendLine`: changed, same rule as the protein line.

**Nutrient radar**
- Title `compare.nutrientRadarTitle`: changed. It was fixed to "per 100 g" by the callers even when the toggle read per 100 kcal; now derived from the basis inside `NutrientRadar`.
- Hint `compare.nutrientRadarHint`: changed. Claimed the toggle updates the energy-share donuts; `macroEnergyShares` renormalised away the basis, so they never moved. Full-scale grams now come from `GENERAL_NUTRIENT_FULL_G`.
- Toggle label `compare.macroShareToggleLabel`: changed from "Energy share basis" to "Amounts".
- Axis labels and dot tooltips: changed. Said "(g / 100 g)" under per 100 kcal; now name the active basis.
- Ring numbers 25/50/75/100: removed (`hideTicks`). Spokes have different full scales (25 g, 20 g, 10 g), so "100" on the protein spoke read as 100 g.
- Legend percentages: kept → `macroEnergyShares` (4 / 9 / 4 kcal per g, relative to their sum). Its unused `basis` parameter is gone.
- Legend grams: kept → `scaleGramsForBasis`.
- `compare.macroLegendNote`, `compare.macroShareCaption`: changed. Name the whole ("energy from protein, fat, and available carbs"), state that fibre energy is not counted, drop the basis from the share.
- Mass bar: tooltip changed to the same carbohydrate sum the bar draws (`activeCarbsG + passiveCarbsG`); legend reads "Carbohydrate incl. fibre".

**Axis table**
- Protein, fat, sugar gram rows: changed. Red-to-green heat colour removed; more sugar or fat is not better.
- kJ row: changed to "(kJ / 100 g, from kcal)" → `energyKj` converts kcal × 4.184; no database kJ is imported.
- Carbohydrate row label and hint: kept. `compare.carbLegend.sugar`: changed, "fast" dropped (fructose and lactose are not fast). `compare.carbPie.quiet`: changed, "metabolically quiet" replaced by the threshold the code uses (< 0.5 g per 100 g). `compare.carbPie.title`: changed, states per 100 g.
- Group `compare.axisGroups.necessityImpact`: changed from "Necessity & impact" to "What reaches the body". Nothing in the group computes need; it holds residue, NOVA, data source, ileal digestibility, DIAAS, and keeping power (`src/pages/compareAxisGroups.ts`). "Necessity" can return in Phase 4 with need and storage rows.
- `compare.necessityImpactGroupHint`: changed to list the rows the group holds; dropped "one necessity/impact vector".

**Micronutrient table**
- Heading and colour saturation: kept → `DENSITY_SATURATION_PCT_DV = 20`.
- `compare.microHint`: changed. "⚠ marks a stored nutrient" was not what the code checks: `upperLimitExceedances` tests 100 kcal against the whole-day EFSA limit for any nutrient with a limit, stored or not.
- Row hints now live once in `MICRO_ROW_HINTS` (`src/i18n/labels.ts`), not copied into both locale files. Changed:
  - niacin: was false, now "preformed only" → BLS `NIA`, USDA 406; no tryptophan conversion.
  - copper: was false ("flagged on limits page"), now "liver stores it for months" → `BODY_STORAGE`.
  - B12: "algal analogues count as 0" → `effectiveB12Ug`.
  - folate: "sensitive to heat and water" → degradation retention set.
  - vitamin K: "K2 is often not reported" → USDA 430 is phylloquinone only.
  - B6: "muscle holds a store for weeks" → `BODY_STORAGE`.
  - calcium: "human studies where they exist; otherwise counted like milk" → `microAmounts`.
  - potassium: "no body store" → `BODY_STORAGE`; dropped "high in plants".
  - selenium: "values from USDA" → source mapping (BLS has no selenium).
  - iodine: dropped "not in all catalog foods" (ambiguous).
- Kept as reference-level physiology: vitamin C, D, E, riboflavin, thiamin, magnesium, choline, iron, zinc, vitamin A.

**Bioactive compounds**
- `compare.bioactivesSubtitle`: changed. Promised "storage, daily need" that no chip shows; now "what each compound does". Storage and need belong to Phase 6.
- `compare.bioactivesHint`: changed. "Expand a chip for role and source" was false on Compare (sources were hidden); `CompareBioactivesPanel` now passes `showSources`. Marker note now covers processed foods; DE had dropped that half.
- `compare.bioactivesProfileEmpty`: changed from "Nothing notable" to "No analysis in the index"; it shows only when every compound is "no data" or "not expected" (nori, wakame, spirulina, low-fat quark).
- `food.bioactiveRawValue`: changed "cooking" to "preparation" (smoked salmon is processed, not cooked).
- `BIOACTIVE_ROLES.glucosinolates`: changed. "Conversion needs myrosinase" overstated; gut bacteria convert a smaller share after cooking.
- Other role texts: kept as reference-level physiology, uncited → Phase 6.
- DE `compare.honors.glucosinolates` read "Glucosinolates": translated.

**Docs**
- `docs/data-sources.md`: said upper limits cost micro-axis points; the code only marks them. Fixed.

## Decisions

- **No disclaimer added.** The user called Compare text-heavy (C1). Truth came from correcting claims, not from a "v1" note.
- **Visual marks count as claims.** A green 10 g sugar cell and a "100" on the protein spoke said things the code does not mean, so colour and ticks were fixed here instead of waiting for Phase 3.
- **Energy split stays basis-free.** It is correct maths; the copy around it was wrong. The toggle now promises only what it changes.
- **"Necessity" removed until it is backed.** Renaming the user's B7 label is the one change that walks back a request; Phase 4 is where it can come back with content.
- **Honours mark instead of hide.** A raw-tissue value is still information; the `*` convention already existed in the profile chips.
- **One bilingual table for micro hints.** Four copies of each line (two per locale file) were a drift risk; `MICRO_ROW_HINTS` joins the existing `labels.ts` tables and its test.
- **Refused in this phase:** shortening true text, layout and legend spacing, the fibre-stamp rule, renaming the carbohydrate axis app-wide, Food and Matrix copy.

## Files

- Code: `src/scoring/macroEnergy.ts`, `src/components/NutrientRadar.tsx`, `MacroCompositionPie.tsx`, `MassCompositionBar.tsx`, `RadarChart.tsx`, `foodHonors.ts`, `FoodHonorsList.tsx`, `CompareBioactivesPanel.tsx`, `src/pages/ComparePage.tsx`, `FoodPage.tsx` (call site only), `src/index.css` (`.honor-basis`).
- Copy: `src/i18n/en.ts`, `de.ts`, `labels.ts`, `messages.ts`.
- Tests: `src/scoring/macroEnergy.test.ts`, `src/components/foodHonors.test.ts` (new), `src/i18n/i18n.test.ts`.
- Comments: `src/pages/compareAxisGroups.ts`, `src/scoring/generalNutrients.ts`.
- Docs: `docs/ux-copy-contract.md` (new), `docs/data-sources.md`, `AGENTS.md`.

## Verified

- `npm test` (89 passing, 6 new), `npm run build`, `npm run lint`.
- Browser, Chrome on the VM display, `/compare?a=egg_boiled&b=lentils_boiled&c=salmon_roasted` in EN and DE and `/food/salmon_roasted`: 37 of 38 scripted checks pass. The failure is a missing `/favicon.ico` (404), which predates this phase. Per 100 kcal changes the polygon and the legend grams; the energy split stays 39/60/1, 35/6/59, 46/54/0.
- Screenshots and recording in `/opt/cursor/artifacts/` (VM-local): `phase1-compare-en-per100g.png`, `phase1-compare-en-per100kcal.png`, `phase1-compare-en-axis-table.png`, `phase1-compare-en-bioactive-source.png`, `phase1-compare-de.png`, `phase1-food-salmon-roasted.png`, `phase1-compare-truth-checks.mp4`, `phase1-browser-checks.log`.

## Found, not fixed

- Food page says "Limiting amino acid: LYS" for AAS ≥ 1 (`food.eaaSummary`, `SourcePanel`) → Phase 5.
- Per 100 kcal, the fat spoke cannot pass about 56 % (pure fat is 11.1 g per 100 kcal against a 20 g full scale); basis-specific full scales → Phase 3.
- With ring numbers gone the nutrient radar has no scale cue besides the hint → Phase 3.
- Macro legend colour dots sit against the previous item; the raw-tissue note renders larger than the role text; "per 100 g" wraps on the salmon card → Phase 3.
- The carbohydrate pie does not encode amount by size (A2) → Phase 3.
- Possible double count: curated resistant starch is added on top of database starch and fibre (potatoes 1.3 g, lentils 2 g) in passive carbs, the pie, and the mass bar. This touches the carbohydrate axis, so it needs the user's decision on a scoring change.
- Axis label `axes.carb` ("Carbohydrate type" / "Kohlenhydrattyp") differs from the Compare row label → Phase 5.
- Group "Importance" holds only Composite → naming review in Phase 4.
- Role texts are uncited; only 4 of 8 say whether the body makes the compound; honour thresholds (B12 ≥ 0.3 µg, taurine ≥ 20 mg, glucosinolates ≥ 10 mg) are not shown → Phase 6.
- `generalNutrientScores` is only called by its test; `BioactivesTable` is unused; `compare.necessityImpact*` key names no longer match; `/favicon.ico` 404; `NovaMarker` puts `aria-label` on a span without a role → Phase 7.

## Seeds for the next phase

Phase 2 list, all true after this phase; each needs cut, merge, move to a tooltip, or keep with a reason:

1. `compare.bioactivesSubtitle`, `compare.bioactivesHint`, `compare.bioactivesProfileLede`: three stacked paragraphs about one panel. Merge into one line plus a compact marker key (`*`, n.d.).
2. `compare.nutrientRadarHint` and `compare.macroLegendNote`: two paragraphs about one chart. One line under the toggle; the 4 / 9 / 4 kcal detail can move to the donut tooltip.
3. `compare.axisRadarHint`: long. Keep the DIAAS sentence near the protein legend; consider a tooltip.
4. `compare.carbRowHint` and the carbohydrate legend above the table explain the same thing. Keep one.
5. `compare.necessityImpactGroupHint`: a full sentence in a table row. A compact list plus the method link.
6. `compare.microHint`: three sentences. One sentence; ⚠ explained once.
7. `MICRO_ROW_HINTS`: 20 lines. Keep them true; check density at 390 px.
8. Keep as they are: `compare.lede`, `compare.degradationRowHint`, `compare.honorsEmpty`.

Shared keys changed here that also render on Food or Matrix: `compare.honors.*`, `compare.honorsEmpty`, the honours basis suffix, `compare.nutrientRadar*`, `compare.macro*`, `compare.massComposition*`, `compare.carbPie.*`, `compare.axisRadarHint`, `compare.radarProteinLegendLine`, `compare.bioactivesProfileEmpty`, `food.bioactiveRawValue`, `BIOACTIVE_ROLES.glucosinolates`.
