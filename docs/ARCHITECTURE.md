# Architecture — Du bist was du isst

Static-first biochemical evaluation system. Scores are computed from raw nutrient
tables plus explicit bioavailability coefficients. No model inference. No black-box
nutrition score.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS
- React Router (client-side)
- Vitest for scoring and recommendation unit tests
- Data: versioned TypeScript modules (typed at compile time), exportable as JSON/CSV

No backend is required for the core product. The matrix, rankings, comparison,
recommendations, methodology, and exports all run from static assets.

## Design constraints

1. Formulas live in `src/scoring/` as pure functions. The UI never invents a score.
2. Food records store measured (or literature-estimated) quantities, not scores.
3. Every numeric adjustment carries a `flag` the UI can surface.
4. Plant classes never share a collapsed “vegetable” score. Class weights are
   per-class and are part of the versioned data contract.
5. Animal and plant proteins are not rescaled to appear equivalent.
6. Extension points (supplements, processed foods, bloodwork overlays) add
   optional overlays. They must not mutate core axis definitions.

## Layers

```
data/          raw foods, sources, coefficients, class weights, manifest
scoring/       pure axis functions → FoodScores
recommend/     pattern-aware pairing; biochemical gap list
export/        CSV / JSON serializers
ui/            matrix, deep dive, compare, recommendations, methodology
```

## Data contract

See `src/data/types.ts`. A food is a biochemical record:

- identity + kingdom + **one** food class
- macros per 100 g edible portion
- amino acids as mg/g protein (FAO reporting convention)
- published or estimated protein-quality method + value
- fatty acids including LC n-3, ALA, n-6, optional odd-chain and CLA
- carbohydrate split: sugars, starch, fibre, resistant starch
- micronutrients with **form** tags (heme/non-heme, retinol/carotenoid, …)
- exclusive compounds (creatine, taurine, carnosine) when measured or estimated
- residue and degradation profiles
- `sources[]` with citation + retrieved date
- `dataVersion` + `lastVerified`

Scores are **not** stored on the food. They are derived.

## Scoring pipeline

`scoreFood(food, ctx) → FoodScores`

1. EAA completeness + digestibility (`src/scoring/eaa.ts`)
2. Essential fatty acid / glyceride profile (`src/scoring/fattyAcids.ts`)
3. Carbohydrate type (`src/scoring/carbs.ts`)
4. Micronutrient density × bioavailability (`src/scoring/micros.ts`)
5. Fibre / phytochemical load (`src/scoring/fibre.ts`)
6. Residue / contaminant risk (`src/scoring/residues.ts`)
7. Degradation sensitivity (`src/scoring/degradation.ts`)
8. Class-weighted composite (`src/scoring/composite.ts`)
9. Within-class tier S/A/B/C/D (`src/scoring/tiers.ts`)

`ctx` supplies the versioned coefficient table and FAO amino-acid pattern so
tests can freeze a version.

## Update path

1. Edit or add a food in `src/data/foods/`.
2. Bump `src/data/manifest.ts` (`dataVersion`, `lastVerified`).
3. If a coefficient or formula changes, bump `formulaVersion` in the manifest
   **and** document the change in `docs/METHODOLOGY.md`.
4. Run `npm test`. Scores are deterministic; snapshot-sensitive tests live next
   to the formulas.

## Future extensions (non-breaking)

| Extension | How it attaches | What it must not do |
|---|---|---|
| Supplements | Separate `Supplement` records; recommendation engine can fill a **gap**, never a food class | Recast a vitamin pill as a food row in the core matrix |
| Processed foods | New classes with an `ultraprocessed` flag; same axes | Invent a parallel “health halo” score |
| Bloodwork overlay | User-side multipliers on micro gaps (e.g. low ferritin ↑ heme-iron weight) | Change published food scores in the shared catalog |

## Versioning

`manifest.schemaVersion` — record shape.
`manifest.dataVersion` — catalog contents.
`manifest.formulaVersion` — scoring math.
`manifest.lastVerified` — ISO date of last source check.

Shown in the UI footer and on the methodology page.
