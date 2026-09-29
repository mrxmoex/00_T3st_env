# Du bist was du isst

A free, public biochemical evaluation of foods. Honest matrix. No marketing equivalence. No paywall.

Most plant proteins fall short on an amino acid, on digestibility, or on density; animal proteins generally do not. Non-heme iron is not heme iron. Algae, mushrooms, sprouts, fermented kraut, legumes, and leafy salads are scored as distinct classes.

## Run

```bash
npm ci
npm run dev      # http://localhost:3000
npm test
npm run build
```

`PORT` is not used; Vite is fixed to port 3000 to match the Cloud Agent environment.

## What you get

- 95 foods in 17 classes, with nutrient values imported from BLS 4.0 and USDA FoodData Central
- Benefit against burden: essential amino acids, fats, and micronutrients as the amount the body can absorb, against residues, nutrient loss, and processing (NOVA; ultra-processed foods stay in tier D)
- Preparation groups (raw, boiled, stewed, fried, canned, instant, …): each food page compares its preparations per gram of dry matter using the databases' own entries
- Bioactive compounds indexed by measured content with a citation per value: creatine, taurine, carnosine, anserine, CoQ10, L-carnitine, ergothioneine, glucosinolates
- Which nutrients the body stores, and which contaminants it accumulates
- Every nutrient value shows its database and how that database obtained it (analysis, literature, recipe calculation, …)
- Composition relevant to specific and medical diets (sodium, potassium, phosphorus, lactose, cholesterol, phenylalanine), shown, not scored
- Interactive heat-map matrix, sortable, filterable by class, preparation, and dietary pattern
- S/A/B/C/D tiers **within each food class**
- Food deep dive with a seven-axis radar profile; side-by-side compare overlays up to three foods and their 20-nutrient micronutrient vectors
- Best-practice gap engine
- Methodology (every formula + coefficient) and a non-claims page
- CSV / JSON export of the current matrix
- German / English UI (follows the browser language on first visit, then remembers the choice)
- Dark / light, mobile-first

## How scores are computed

Pure functions in `src/scoring/` over the imported values and curated fields in `src/data/`. Documented in `docs/scoring-formulas.md` and `/method`. Composite = class-weighted sum of seven axes. Not an AI score.

Dataset version and last verification date live in `src/data/coefficients.ts` and appear in the UI and exports.

## Data sources

Nutrient values are imported by `scripts/data/build_snapshot.py`, never typed by hand. See `docs/data-sources.md` for the merge and gap rules.

- **BLS 4.0**: Max Rubner-Institut (2025): Bundeslebensmittelschlüssel (BLS), Version 4.0 - Deutsche Nährstoffdatenbank. Karlsruhe. DOI: [10.25826/Data20251217-134202-0](https://doi.org/10.25826/Data20251217-134202-0). Licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Primary source.
- **USDA FoodData Central, SR Legacy** (April 2018), public domain. Foods BLS does not list, plus choline and selenium.

Values are used unchanged; the food selection, the documented gap filling, and every score are this project's. To add or refresh foods:

```bash
pip install -r scripts/data/requirements.txt
python3 scripts/data/build_snapshot.py    # reads src/data/sources/manifest.json
npm test
```

## Translations

UI copy lives in `src/i18n/en.ts` and `src/i18n/de.ts`, both typed against `src/i18n/messages.ts`, so a missing German string fails the type-check in `npm run build`. Scoring flags, recommendation texts, and food notes carry `{ en, de }` pairs next to the code or data that produces them; nutrient, provenance, and preparation labels live in `src/i18n/labels.ts`. `src/i18n/i18n.test.ts` covers what the types cannot: class-specific column labels, and engine or data text that is empty in either language.

## CI and deployment

Every pull request runs `.github/workflows/ci.yml`: lint, tests, and production build for the matrix, plus the Bulwark tests.

Pushes to `main` publish the matrix to GitHub Pages via `.github/workflows/pages.yml` at `https://mrxmoex.github.io/00_T3st_env/`. The workflow builds with the Pages base path and copies `index.html` to `404.html` so deep links such as `/food/kale_raw` load the app.

## What it will not claim

See `docs/non-claims.md` and `/limits`. In particular: it will never call a plant-only diet complete without fortification or supplementation, and it will never turn a value no database reports into zero.

## Repo map

| Path | Contents |
| --- | --- |
| `docs/architecture.md` | High-level architecture + data model |
| `docs/scoring-formulas.md` | Explicit formulas |
| `docs/wireframes.md` | Primary matrix UI |
| `docs/data-sources.md` | Databases, import pipeline, gap rules, coefficients |
| `docs/non-claims.md` | Hard limits |
| `scripts/data/` | Snapshot builder for BLS 4.0 + USDA SR Legacy |
| `src/data/sources/` | Manifest, imported snapshot, typed access |
| `src/data/foods/` | Curated food specs and preparation groups |
| `src/scoring/` | Deterministic scoring + tests |
| `src/pages/` | Matrix, food, compare, recommend, method, limits |

`bulwark/` is an unrelated prototype left in this repository; it is not part of the food matrix.
