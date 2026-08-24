# Du bist was du isst

Free public multi-axis food evaluation matrix. Plant and animal foods are scored with **class-specific weights**. Plant proteins are never labelled complete.

## Run

```bash
cd web
npm install
npm run dev      # http://localhost:3000
npm test         # deterministic scoring + non-equivalence invariants
npm run build
npm run preview
```

From the repository root: `npm run dev`, `npm test`, `npm run build`.

## What is in the app

- Sortable heatmap matrix with S/A/B/C/D tiers **within each food class**
- Filters: kingdom, class, axis, dietary pattern, search
- Single-food deep dive with Source & Method
- Side-by-side compare
- Best-practice recommendations that refuse to call plant-only diets complete without fortification
- Transparent methodology (formulas, coefficients, non-claims)
- CSV / JSON export

## Architecture

Scores are computed in TypeScript from raw per-100 g tables plus documented coefficients (`src/scoring/*`, `src/catalog/coefficients.ts`). There is no model-generated score.

Dataset version and last verification date live in `src/catalog/dataset-meta.ts`.
