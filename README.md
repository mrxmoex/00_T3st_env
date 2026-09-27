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
- Food deep dive with a seven-axis radar profile; side-by-side compare overlays up to three foods
- Best-practice gap engine
- Methodology (every formula + coefficient) and a non-claims page
- CSV / JSON export of the current matrix
- German / English UI (follows the browser language on first visit, then remembers the choice)
- Dark / light, mobile-first

## How scores are computed

Pure functions in `src/scoring/` over raw tables in `src/data/`. Documented in `docs/scoring-formulas.md` and `/method`. Composite = class-weighted sum of seven axes. Not an AI score.

Dataset version and last verification date live in `src/data/coefficients.ts` and appear in the UI and exports.

## Translations

UI copy lives in `src/i18n/en.ts` and `src/i18n/de.ts`, both typed against `src/i18n/messages.ts`, so a missing German string fails the type-check in `npm run build`. Scoring flags, recommendation texts, and food notes carry `{ en, de }` pairs next to the code or data that produces them. `src/i18n/i18n.test.ts` covers what the types cannot: class-specific column labels, and engine or data text that is empty in either language.

## CI and deployment

Every pull request runs `.github/workflows/ci.yml`: lint, tests, and production build for the matrix, plus the Bulwark tests.

Pushes to `main` publish the matrix to GitHub Pages via `.github/workflows/pages.yml` at `https://mrxmoex.github.io/00_T3st_env/`. One-time setup: in the repository settings open **Pages** and set **Source** to **GitHub Actions**. The workflow builds with the Pages base path and copies `index.html` to `404.html` so deep links such as `/food/kale_raw` load the app.

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
