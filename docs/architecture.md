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
| Coefficients | `src/data/coefficients.ts` | FAO pattern, RAE factors, absorption midpoints, dataset version |
| Weights | `src/data/classWeights.ts` | Class-specific composite weights (sum 1.0) |
| Foods | `src/data/foods/*.ts`, `catalog.ts` | Versioned sample + sourced foods |
| Scoring | `src/scoring/*.ts` | Pure functions, one axis per module |
| Recommend | `src/recommend/engine.ts` | Gap engine; never claims plant-only completeness |
| Export | `src/export/matrixExport.ts` | CSV / JSON |
| UI | `src/pages`, `src/components` | Matrix, deep dive, compare, docs pages |

## Data model (food record)

Each `FoodRecord` stores per 100 g (unless noted):

- Identity: `id`, names, `class`, edible state, optional USDA FDC ID
- Macros: kcal, protein, fat
- Amino acids in **mg/g protein** + `ilealDigestibility`
- Fatty acids (SFA/MUFA/PUFA, ALA/EPA/DHA, LA/AA, odd-chain, CLA)
- Carbohydrates split into sugars, starch, fibre, resistant starch
- Micros with iron form, phytate-zinc flag, retinol vs carotenoids, B12 analogue flag
- Animal-exclusive compounds (creatine, taurine, carnosine)
- Residue profile (surface area, systemic/contact, MRL proximity, metals, veterinary)
- Degradation profile (water-soluble load, cut/heat/O₂, perishability, processing)
- Phytochemical index (0–1) and source list

## Update path

1. Edit a food file or add a record.
2. Bump `DATASET_VERSION` and `LAST_VERIFIED` in `coefficients.ts`.
3. Run `npm test` (formulas + catalog coverage).
4. Rebuild. No migration of scores — scores are derived.

## Extension points (non-breaking)

- Supplements: add a future `supplement` kingdom with the same axes; do not fold them into plant/animal classes.
- Processed foods: new classes, same seven biochemical axes.
- Bloodwork overlays: consume `ScoreCard` + lab values in a future module. Do not rewrite core axes.

## What is intentionally absent

Auth, paywall, accounts, tracking pixels, AI scoring, meal-plan generators that declare completeness.
