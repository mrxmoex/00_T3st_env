# Phase 5 handoff: Food and Matrix

## Intent

Food and Matrix speak like Compare. The same carbohydrate pie and score, the same need facts where a list has room, and radars that are large enough to read. Served inputs A8 and C1, plus the three seeds in the Phase 4 handoff. Phase 4 was confirmed before this phase started.

## Truth ledger

- Matrix carbohydrate cell → `CarbScoreCell`: the sized pie (`CarbTypePie`, full at 80 g) beside `card.carb.score`. Under 0.5 g the pie is × and the score's tooltip is the fixed-70 sentence. Compare uses the same component.
- Food page "Need and what reaches the body" → `NeedFactsList`, from `needFacts` (`src/scoring/needFacts.ts`). Daily Values covered, months-or-years stores, iron form, and the adult upper limit use the same words and the same links as Compare. Exposure notes stay in `ExposurePanel` on that page, so they are not listed twice.
- Food axis names link to the same method sections as Compare (`AXIS_METHOD_ANCHOR`). The bar is still the score; the pie beside carbohydrate type is the composition.
- Nutrient radar canvas → `radarViewBox`. A three-spoke chart's box is the spokes and their labels (egg: 378 by 247), so the triangle is not drawn in the old 420 by 340 square. A seven-spoke chart stays taller. A test checks both.
- Food overview from 880 px wide → the score bars keep a narrow column and the two radars share the rest, side by side.
- "Fibre & other: 0%" on the egg → `Math.max(0, Math.round(shares.other))`. The share was about −0.4 before rounding, and `toFixed(0)` printed "−0".

## Decisions

- **One component for the pie and the score.** Compare and the matrix cannot drift apart.
- **A list on the food page, not a second compare table.** The store names need a column of their own. A matrix cell does not get that list.
- **Exposure stays where the full note is.** The food page already renders `ExposurePanel`.
- **The bars column stays narrow.** Widening the charts column is what makes the radars readable. The bars did not need half the page.
- **Refused:** copying Compare's three-column store row into the matrix; a new score.

## Files

- `src/components/CarbTypePie.tsx` (`CarbScoreCell`), `MatrixTable.tsx`, `NeedFactsList.tsx`, `RadarChart.tsx`, `RadarChart.test.ts`, `NutrientRadar.tsx`
- `src/pages/ComparePage.tsx`, `FoodPage.tsx`, `compareAxisGroups.test.ts`
- `src/scoring/needFacts.ts`, `needFacts.test.ts` (moved out of `src/pages/` so a component can use it)
- `src/index.css`

## Verified

- `npm test` (99), `npm run build`, `npm run lint`.
- Scripted Chrome, 9 of 9: egg food page shows 5/20, vitamin B12 held for years, and non-heme iron; the first axis links to `/method#eaa`; the nutrient radar box is 247 px tall and the charts column is 780 px at 1,280 px; Brazil nuts in German show the selenium warning; the matrix carb cell has the pie and a score; Compare still pairs them; the food need panel fits 390 px.
- Evidence in `/opt/cursor/artifacts/`: `phase5-food-egg-en.png`, `phase5-food-radars.png`, `phase5-food-brazil-de-dark.png`, `phase5-matrix-carb.png`, `phase5-food-390.png`, `phase5-food-matrix-checks.mp4`, `phase5-browser-checks.log`.

## Found, not fixed

- The four displayed energy shares are each rounded, so they can add to 99 or 101. Only a negative zero was clamped → a later display pass if it shows up.
- Older foods still carry unsourced digestibility → D2.
- Compare's food pickers are wider than 390 px. That predates this phase.

## Seeds for the next phase

Phase 6 (bioactives story):

1. Each compound's role text needs a citation. `BIOACTIVE_ROLES` in `src/i18n/labels.ts` currently has none.
2. Honours and the profile should not state the same compound twice without saying so.
3. Empty grids stay out. The profile already replaces the grid; check Food and Compare still agree.
