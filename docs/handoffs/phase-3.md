# Phase 3 handoff: Compare visual calibration

## Intent

Make the Compare charts read at a glance and stay true across the larger catalog: data track D1 added nuts with 45–70 g fat and dried fruit with 38 g sugar per 100 g, which the old per-spoke scales (25 g protein, 20 g fat, 10 g sugar) would have capped. Served inputs B3, B4, B5, B6, A2, A3, E2, and E1 for the bumps below.

## Truth ledger

**Nutrient radar**
- Per 100 g: every spoke on one gram scale, full at 80 g, rings labelled 20, 40, 60, 80 g → `NUTRIENT_RADAR_FULL.per100g`. The heaviest catalog value is walnut fat (70.6 g); a test fails if a future food passes the scale.
- Per 100 kcal: a spoke is the kcal that nutrient gives in 100 kcal of the food, rings 25 to 100 kcal → `nutrientRadarAmounts`. It equals the legend's share of energy by construction (both use `energyDenominatorKcal`); a test checks every food.
- The third spoke is available carbs (sugars plus starch), not sugar. Starch-heavy foods (grains, legumes, potatoes) no longer look empty. Sugar stays visible as the table row "of which sugars" and as the carbohydrate pie's slice.
- Ring numbers return because every spoke now shares a scale with a unit (contract §3).

**Energy split (legend and donut)**
- Covers the whole database energy: protein, fat, available carbs, and fibre & other (fibre at 2 kcal/g, organic acids, alcohol, rounding under EU factors). The four parts sum to 100 % (test) → `macroEnergyShares`. This replaces Phase 1's "fibre energy is not counted": the remainder is now shown instead of left out.
- Where USDA's food-specific factors make the 4 / 9 / 4 sum larger than the stored kcal, that sum is the denominator, so no share passes 100 %.

**Carbohydrate row**
- Pie area is proportional to grams of carbohydrate (available plus fibre and resistant starch) per 100 g, full at 80 g → `CARB_PIE_FULL_G`. The catalog maximum is oat flakes, 64.3 g.
- The axis score (0–100, `scoreCarbs`) sits beside the pie in heat colour: the better-or-worse cue the user asked for (B6), backed by the formula, while the pie's colours stay types (contract §3).
- Foods under 0.5 g show × with the fixed score 70; its tooltip says why.

**Layout**
- Macro legend lines wrap with gaps; a later `.radar-legend li` rule had made them run together.
- At 390 px the micronutrient table fits its panel (322 of 322 px; it was 384 px after Phase 2 and 920 px before).

## Bumps eased (E1)

- Food page EAA summary and the source card said "limiting LYS" for complete proteins; they now follow the Compare rule (tests cover both).
- Snapshot pipeline: starch now comes from the same database entry as available carbohydrate (`docs/data-sources.md` rule 6). Nine stored values changed: dried shiitake lost 61.7 g of starch borrowed from a different USDA total, stewed shiitake 8.5 g, raw shiitake 1.9 g, chanterelle 1.5 g; white button mushroom gained 2.7 g (its BLS available carbohydrate minus sugars); avocado and three leaves or sprouts moved by 0.1 g or less. A test now fails if sugars plus starch exceed available carbohydrate.

## Decisions

- **Shared scales over per-spoke scales.** Ring labels become true; nothing saturates.
- **80 g, not tighter.** At 40 or 60 g most nuts would cap. Watery foods look small because they are mostly water; the mass bars right below show the water.
- **Score beside the pie, not a recoloured pie.** Keeps category colours as types and gives the verdict a formula.
- **kcal on the radar, % in the legend.** The rings need a unit; the two numbers are equal by construction.
- **Refused:** a square-root or log radial scale (hard to read honestly); hiding sugar entirely (kept in table and pie).

## Files

- `src/scoring/generalNutrients.ts`, `macroEnergy.ts` and their tests; `src/components/NutrientRadar.tsx`, `RadarChart.tsx`, `MacroCompositionPie.tsx`, `CarbTypePie.tsx`; `src/pages/ComparePage.tsx`; `src/index.css`; `src/i18n/en.ts`, `de.ts`, `messages.ts`, `i18n.test.ts`.
- Bumps: `scripts/data/build_snapshot.py`, `src/data/sources/snapshot.json`, `src/data/sources/snapshot.test.ts`.
- Docs: `docs/ux-copy-contract.md` §3 and §4, `docs/data-sources.md`.

## Verified

- `npm test` (90), `npm run build`, `npm run lint`.
- Scripted Chrome run (light and dark, EN and DE, 1,440 and 390 px; walnuts, oat flakes, and apple as the extreme mix; Brazil nuts for ⚠; Food pages for egg and lentils): 21 of 21 checks pass. Radar kcal equals the legend share (walnut fat 88 kcal and 88 %); pie radii follow grams (walnuts 10 px, apple 16 px, oat flakes 36 px).
- Evidence in `/opt/cursor/artifacts/`: `phase3-final-*.png`, `phase3-radars-*.png`, `phase3-carb-row-*.png`, `phase3-d1-visual-checks.mp4`, `phase3-browser-checks.log`.

## Found, not fixed

- Food page radars render small in its three-column layout at 1,024 px → Phase 5.
- Matrix carbohydrate column shows the sized pie without the score chip → Phase 5.
- The nutrient radar leaves empty space under the triangle in single-column layouts → Phase 5.
- Still open for the user: the resistant-starch double count (curated resistant starch added on top of database starch and fibre).

## Seeds for the next phase

Phase 4 (necessity and impact):

1. Bring "necessity" back with content: body-store rows from `BODY_STORAGE` and Daily Value coverage, so the group label "What reaches the body" can grow into need plus impact.
2. Link each row to its Method section; the group header already links `/method`.
3. Review the "Importance" group, which holds only the composite.
