# Phase 0 handoff: baseline

## Intent

Ship a working Compare page from annotation batches A and B (see the input log in `docs/roadmap.md`) and carry its patterns to Food, Matrix, Method, and the burden and preparation panels. Not final polish.

## What exists, by commit

| Commit | Change |
|---|---|
| `f5219eb` | Grouped axis table and a nutrient radar on Compare |
| `974af8d`, `0d2cff0` | Energy label size; long labels wrap in the axis table |
| `088b3ab` | Protein split into three radar spokes: amino-acid pattern, ileal digestibility, protein density (A1) |
| `fbda7ce` | `CarbTypePie` in the carbohydrate row; macro energy donuts (A2, A3) |
| `c13e1b6` | `NovaMarker`, honorary mentions, bioactive profiles, "Nutrient keeping power" (A4 to A7) |
| `ea1e292`, `18ae721`, `7fea71c`, `60ef008` | Shared `BioactivesProfile` and `FoodHonorsList`; Food page radar pair; Matrix carb pie; NOVA markers in panels; Method heading (A8) |
| `50ca639` | Batch B: basis toggle drives radar and donuts, bioactives header, carbohydrate legend and ×, "Necessity & impact" group, micronutrient row hints |
| `025718c` | `AGENTS.md` |

## Truth ledger

Not audited; Phase 1 does that. Suspects to check first:

- Energy shares under "per 100 g" and "per 100 kcal": a share of energy does not depend on the basis. Check what the toggle changes and what the legend claims (B5).
- Carbohydrate colour key: "good" and "bad" must follow the carbohydrate-axis formula, not a health verdict (non-claim 6).
- "Necessity & impact" group label: nothing computes necessity yet (B7).
- Bioactives header: storage, daily-need, and essentiality wording needs a source per claim (B2).
- Micronutrient row hints: check each against `docs/scoring-formulas.md` and `BODY_STORAGE`.

## Decisions

- Display only: no axis, composite, or tier formula changed.
- Shared components (`BioactivesProfile`, `FoodHonorsList`, `NovaMarker`, `CarbTypePie`, `MacroCompositionPie`) instead of page-local copies.

## Verified

`npm test` (83 passing) and `npm run build` at `50ca639`. The user confirmed Compare works (C1).

## Found, not fixed

- Too much text on Compare (C1) → Phase 2.
- `BioactivesTable` may be unused → Phase 7. (`compare.bioactivesHint` is in use again since `50ca639`.)

## Seeds for the next phase

Phase 1 starts with the suspects listed under *Truth ledger*.
