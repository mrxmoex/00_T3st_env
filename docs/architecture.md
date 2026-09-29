# Architecture

**Du bist was du isst** is a static Vite + React + TypeScript app. All scores are computed in the browser from versioned nutrient tables and published coefficients. There is no recommendation model, no paid API, and no server-side nutrition brain.

## Runtime

```
index.html
  → src/main.tsx
    → App routes
      → Matrix / Food / Compare / Recommend / Method / Limits
    → scoring.scoreCatalog(FOODS)
    → export CSV/JSON
```

Dev server: Vite on port 3000 (`npm run dev`). Production: `npm run build` then any static host.

## Layers

| Layer | Path | Responsibility |
| --- | --- | --- |
| Domain types | `src/scoring/types.ts` | Food classes, raw records, score cards |
| Coefficients | `src/data/coefficients.ts` | FAO pattern, RAE factors, absorption midpoints, Daily Values, EFSA upper limits, dataset version |
| Weights | `src/data/classWeights.ts` | Class-specific composite weights (sum 1.0) |
| Source data | `src/data/sources/`, `scripts/data/build_snapshot.py` | Manifest, imported BLS 4.0 / USDA snapshot with per-value provenance |
| Foods | `src/data/foods/*.ts`, `catalog.ts` | Curated specs merged with snapshot values; preparation groups |
| Scoring | `src/scoring/*.ts` | Pure functions, one axis per module |
| Recommend | `src/recommend/engine.ts` | Gap engine; never claims plant-only completeness |
| Export | `src/export/matrixExport.ts` | CSV / JSON |
| UI | `src/pages`, `src/components` | Matrix, deep dive, compare, docs pages |

## Data model (food record)

Each `FoodRecord` stores per 100 g (unless noted):

- Identity: `id`, names, `class`, `group` (shared by all preparations of one food), `preparation`
- Source entries (BLS code and/or FDC id), raw `nutrients` by key, and per-value `provenance`
- Macros: kcal, protein, fat
- Amino acids in **mg/g protein** + `ilealDigestibility`
- Fatty acids (SFA/MUFA/PUFA, ALA/EPA/DHA, LA/AA, odd-chain, CLA)
- Carbohydrates split into sugars, starch, fibre, resistant starch
- Micros (20 scored nutrients) with iron form, phytate-zinc flag, retinol vs carotenoids, B12 analogue flag; `null` where no source reports a value
- Composition for specific diets: water, sodium, phosphorus, cholesterol, lactose
- Animal-exclusive compounds (creatine, taurine, carnosine; curated estimates)
- Residue profile (surface area, systemic/contact, MRL proximity, metals, veterinary)
- Degradation profile (water-soluble load, cut/heat/O₂, perishability, processing)
- Phytochemical index (0–1) and curated literature list

## Update path

1. Map the food to its BLS or FDC entry in `src/data/sources/manifest.json` and run `python3 scripts/data/build_snapshot.py` (see `docs/data-sources.md`).
2. Add its curated spec in `src/data/foods/*.ts` (a cooked variant can reuse its raw base via `prepared()`).
3. Bump `DATASET_VERSION` and `LAST_VERIFIED` in `coefficients.ts`.
4. Run `npm test` (formulas, catalog coverage, snapshot integrity, preparation–source name check).
5. Rebuild. No migration of scores — scores are derived.

## Extension points (non-breaking)

- Supplements: add a future `supplement` kingdom with the same axes; do not fold them into plant/animal classes.
- Processed foods: new classes, same seven biochemical axes.
- Bloodwork overlays: consume `ScoreCard` + lab values in a future module. Do not rewrite core axes.

## What is intentionally absent

Auth, paywall, accounts, tracking pixels, AI scoring, meal-plan generators that declare completeness.
