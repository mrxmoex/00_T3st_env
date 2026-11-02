# Phase 4 handoff: Necessity and impact

## Intent

Give Compare one group that says why a food matters: what it covers of a day's values, what the body holds, how its iron is counted, where an upper limit is passed, and which exposure notes apply. Every row in that group links the page that backs it. Served inputs B7, A6, A1, and B2 (storage). Phase 3 and data track D1 were confirmed before this phase started.

## Truth ledger

- Group label "Need and what reaches the body" / "Bedarf und was im Körper ankommt" → the Daily Value row is in the group, which is what contract §4 allows "need" to mean. "Necessity" is still unused.
- "Overall" / "Gesamt" → the group holds only the composite. It was "Importance", which named a judgment the row does not make. The composite links `/method#composite`.
- "Daily Values covered", `n/m` → `needFacts` in `src/pages/compareNecessity.ts`. Covered means `pctDvPer100kcal` at or above `DENSITY_SATURATION_PCT_DV` (20), the same bar as the micronutrient score. `m` is the nutrients a source reports, so a missing value is not counted as uncovered. Heat colour is that share. It is not a new axis. Link: `/method#micros`.
- "Held for months or years" → the covered nutrients whose `BODY_STORAGE` store is `years` or `months`, with the store word and, in the tooltip, the site. Weeks and none are left off. Link: `/method#storage`.
- "Iron form" → `food.micros.ironForm`, labelled in `IRON_FORM_LABELS`. Mixed iron names the heme share from `HEME_SHARE_OF_MIXED_IRON`. Not scored. Link: `/method#micros`.
- "Adult upper limit" → `upperLimitExceedances`: 100 kcal above the adult whole-day EFSA limit. The ⚠ does not lower a score, the same rule as the micronutrient table. Link: `/method#micros`, where the limit table is.
- Residue score → unchanged formula, `/method#residue`. "Not a certificate for a farm or lot" links `/limits#non-claims` (non-claim 10).
- "Exposure notes" → `exposureForFood`, each name linking `/exposure#<id>`. The row says these are class notes, not a measured amount in this food.
- NOVA → `/method#processing`. Primary source → `/method#data`. Ileal digestibility and DIAAS → `/method#eaa` (the digestibility definition stays in the tooltip). Nutrient keeping power → `/method#degradation`. The kind-group axes link their own method sections (`AXIS_METHOD_ANCHOR`).
- A hash link scrolls to its section (`HashScroll`). Client-side routing was opening the page and leaving the section below the fold.

## Decisions

- **The existing 20 % bar, not a new one.** Coverage uses the constant the micronutrient score already treats as covered.
- **Months and years only.** A nutrient the body turns over in days is not listed as held. The full table stays on the method page.
- **Names, with the caveat on the row.** Exposure notes are what the catalog already attaches to a class. The row says they are not measurements, so the names cannot be read as lab results.
- **Overall stays its own group.** The composite summarises every axis, so it does not sit inside the need group.
- **Refused:** a new score for coverage, storage, or exposure; re-sourcing the older foods' digestibility (that is D2, and it moves ranks).

## Files

- `src/pages/compareNecessity.ts`, `compareNecessity.test.ts`, `compareAxisGroups.ts`, `ComparePage.tsx`
- `src/components/Layout.tsx`, `ExposurePanel.tsx`; `src/pages/MethodPage.tsx`, `LimitsPage.tsx` (section ids)
- `src/i18n/labels.ts`, `en.ts`, `de.ts`, `messages.ts`, `i18n.test.ts`; `src/index.css`
- `docs/ux-copy-contract.md` §4 and §7

## Verified

- `npm test` (97), `npm run build`, `npm run lint`.
- Scripted Chrome, 16 of 16: egg 5/20 and vitamin B12 held for years; Brazil nuts ⚠ selenium and a glyphosate link; salmon iron "Mixed"; method and exposure anchors land on their sections (72 px from the top); German dark mode; at 390 px the axis table scrolls inside its panel.
- Evidence in `/opt/cursor/artifacts/`: `phase4-need-group-en.png`, `phase4-need-group-de-dark.png`, `phase4-need-390.png`, `phase4-method-micros.png`, `phase4-need-and-impact-checks.mp4`, `phase4-browser-checks.log`.

## Found, not fixed

- The 96 foods from before D1 still carry unsourced digestibility (cooked egg shows 0.97; the app's own human citation says 0.909) → D2.
- Food and Matrix do not show these rows → Phase 5. A matrix cell cannot hold the store list as Compare does.
- The food pickers are wider than a 390 px viewport. That predates this phase; the new rows stay inside the table's own scroller.

## Seeds for the next phase

Phase 5 (Food and Matrix):

1. Food page: the same `needFacts` under the food, where a list has room. Do not copy Compare's three-column store list into a matrix cell.
2. Matrix: the sized carbohydrate pie still has no score chip beside it (Phase 3).
3. Food page radars are small in the three-column layout at 1,024 px, and the nutrient radar leaves empty space under the triangle in a single column (Phase 3).
