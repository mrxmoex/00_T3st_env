# Du bist was du isst — Architecture

## Overview

A static-first, reproducible biochemical nutrition evaluation platform. Scores are **computed from raw nutrient tables and published coefficients** — no black-box ML or opaque AI ratings.

```
┌─────────────────────────────────────────────────────────────────┐
│  nutrition/web (Vite + React + TypeScript)                      │
│  Matrix UI · Filters · Food detail · Methodology · Export       │
└────────────────────────────┬────────────────────────────────────┘
                             │ fetch /api/nutrition/*
┌────────────────────────────▼────────────────────────────────────┐
│  Express (src/app.js)                                           │
│  GET /api/nutrition/foods · GET /api/nutrition/scores           │
│  GET /api/nutrition/meta · static → public/nutrition/           │
└────────────────────────────┬────────────────────────────────────┘
                             │ import
┌────────────────────────────▼────────────────────────────────────┐
│  nutrition/src                                                  │
│  types · coefficients · sample-foods · scoring/engine           │
└─────────────────────────────────────────────────────────────────┘
```

## Data model

### `FoodRecord`

Canonical food entry with traceable provenance.

| Field | Description |
|-------|-------------|
| `id` | Stable slug |
| `name` | Display name |
| `kingdom` | `plant` \| `animal` |
| `division` | Plant or animal class (non-interchangeable) |
| `per100g` | Raw nutrient basis (USDA-style) |
| `bioavailability` | Axis-specific adjustment flags |
| `residue` | Crop/product residue risk inputs |
| `degradation` | Storage/cooking sensitivity inputs |
| `sources` | `{ id, name, url, verifiedAt }[]` |

### Plant divisions

`leafy_greens`, `legumes`, `sprouts`, `cruciferous_kraut`, `mushrooms`, `algae_seaweed`, `roots_tubers`, `other_vegetables`

Fresh vs fermented kraut are distinct records (e.g. `sauerkraut_fermented` vs `cabbage_fresh`).

### Animal divisions

`muscle_ruminant`, `muscle_monogastric`, `muscle_poultry`, `muscle_fish`, `organs`, `eggs`, `dairy`, `fermented_animal`

### `AxisScores`

Eight computable axes plus composite and tier:

1. `eaaCompletenessDigestibility`
2. `efaGlycerideProfile`
3. `carbohydrateType`
4. `micronutrientDensity`
5. `fibrePhytochemical`
6. `residueRisk` (higher = safer / lower contaminant exposure)
7. `degradationSensitivity` (higher = more stable / less loss risk)
8. `composite`
9. `tier` — `S` \| `A` \| `B` \| `C` \| `D`

### `DivisionWeights`

Per-division weight vectors for composite scoring (see `SCORING.md`).

## Versioning

- `nutrition/src/data/version.ts` — dataset semver + `lastVerificationDate`
- API `/api/nutrition/meta` exposes version for client Source & Method panel

## Extensibility

1. Add `FoodRecord` to `sample-foods.ts` (or future USDA import pipeline)
2. Scoring engine auto-computes all axes
3. Division weights in `division-weights.ts` tune composite without changing axis math
4. New plant/animal class = new division enum + weight row

## UI components (wireframe)

| Component | Role |
|-----------|------|
| `AppShell` | Header, nav (Matrix / Methodology), dark theme |
| `MatrixTable` | Sortable heatmap grid; rows = foods, cols = axes + tier |
| `FilterBar` | Kingdom, division, dietary pattern, sort axis |
| `FoodDetailPanel` | Collapsible deep dive + comparison checkbox |
| `SourceMethodPanel` | Collapsible citations, coefficients, verification date |
| `ExportBar` | CSV + JSON download of filtered scores |
| `MethodologyPage` | Formulas summary, limitations, data sources |

## Build pipeline

```bash
npm run build:nutrition   # tsc nutrition + vite build web → public/nutrition
npm test                  # Node test runner includes nutrition/scoring tests
```
