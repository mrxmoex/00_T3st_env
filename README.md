# Du bist was du isst

A free, public biochemical evaluation of foods. Honest matrix. No marketing equivalence. No paywall.

Plant proteins are incomplete; animal proteins are complete. Non-heme iron is not heme iron. Algae, mushrooms, sprouts, fermented kraut, legumes, and leafy salads are scored as distinct classes.

## Run

```bash
npm ci
npm run dev      # http://localhost:3000
npm test
npm run build
```

`PORT` is not used; Vite is fixed to port 3000 to match the Cloud Agent environment.

## What you get

- Interactive heat-map matrix, sortable, filterable by class and dietary pattern
- S/A/B/C/D tiers **within each food class**
- Food deep dive, side-by-side compare, best-practice gap engine
- Methodology (every formula + coefficient) and a non-claims page
- CSV / JSON export of the current matrix
- Dark / light, mobile-first

## How scores are computed

Pure functions in `src/scoring/` over raw tables in `src/data/`. Documented in `docs/scoring-formulas.md` and `/method`. Composite = class-weighted sum of seven axes. Not an AI score.

Dataset version and last verification date live in `src/data/coefficients.ts` and appear in the UI and exports.

## What it will not claim

See `docs/non-claims.md` and `/limits`. In particular: it will never call a plant-only diet complete without fortification or supplementation.

## Repo map

| Path | Contents |
| --- | --- |
| `docs/architecture.md` | High-level architecture + data model |
| `docs/scoring-formulas.md` | Explicit formulas |
| `docs/wireframes.md` | Primary matrix UI |
| `docs/data-sources.md` | External sources → axes |
| `docs/non-claims.md` | Hard limits |
| `src/data/foods/` | Sample foods (all plant + animal classes) |
| `src/scoring/` | Deterministic scoring + tests |
| `src/pages/` | Matrix, food, compare, recommend, method, limits |

`bulwark/` is an unrelated prototype left in this repository; it is not part of the food matrix.
