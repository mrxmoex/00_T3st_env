# Du bist was du isst

Public, login-free food evaluation matrix. Plant classes are not collapsed into a vegetable average. Completeness and bioavailability are applied before ranking.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Recharts radar matrices
- Static seed derived from USDA FoodData Central SR Legacy, FAO DIAAS, DGE Referenzwerte, EFSA DRVs, NIH ODS, and residue monitoring

## Run

```bash
npm ci
npm run dev
```

Open http://localhost:3000

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Next.js dev server on port 3000 |
| `npm test` | Vitest: ontology, sourced schema, scoring multipliers |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run build` | Production build |

## What the matrix does

Seven axes, no single number:

1. Nutrient density
2. Protein quality (DIAAS preferred, PDCAAS fallback, limiting amino acid)
3. Essential fatty-acid profile (preformed EPA/DHA vs ALA)
4. Carbohydrate quality (passive fiber vs active sugars/starches)
5. Bioavailability and anti-nutrient load
6. Unique bioactives
7. Practical efficiency

Categories stay split: leafy greens, legumes, sprouts, fermented plants, mushrooms, algae, muscle meats, organs, eggs, dairy, fish/seafood.

Every displayed composition or ranking input carries a source id and year. Sparse and contested values (spirulina analog B12, algal true B12, organ-specific DIAAS) are marked.

## Data

- Live USDA SR Legacy pulls (2019 publication date) for spinach, kale, lentils, chickpeas, soy, white mushrooms, alfalfa sprouts, sauerkraut
- Compiled SR Legacy 2019 values with FDC IDs for the remaining seed foods
- DIAAS from FAO 2013, Herreman et al. 2020, Mathai/Stein 2017, and later reviews
- Adult reference intakes from DGE 3rd edition (2025 reprint) with chapter years (iron 2024, B12 2018, protein 2017)

`src/lib/types.ts` is the schema. `src/data/foods.ts` is the seed. `src/data/sources.ts` is the bibliography.

## Guardrails

The system does not advocate a plant-only or animal-only diet. Trade-offs stay visible: liver wins density and loses fiber; lentils win passive carbohydrate and lose DIAAS and heme iron.

[`bulwark/`](bulwark/) remains a separate prototype in this repository.
