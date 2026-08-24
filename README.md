# Was du isst

Public, login-free nutritional evaluation matrix titled around **Du bist was du isst**.

The app treats plant categories as unequal, evaluates animal foods on the same seven axes, and refuses a single score as sufficient. Completeness and bioavailability multipliers are applied before ranking. Anti-nutrient and residue penalties are explicit and source-linked. Every displayed claim carries a publisher and year.

This is not dietary advocacy. Trade-offs stay visible.

## Stack

- Next.js 15 App Router, TypeScript, Tailwind CSS v4
- Recharts for radar matrices
- Static seed data derived from USDA FoodData Central (SR Legacy), FAO/WHO DIAAS, EFSA DRVs, DGE/ÖGE Referenzwerte, NIH ODS fact sheets, and cited bioavailability / residue literature

`bulwark/` remains a separate prototype in this repository and is not part of the matrix app.

## Run

```bash
npm ci
npm run dev    # http://localhost:3000
npm test
npm run typecheck
npm run build
```

Core pages: `/` matrix + tiers, `/compare`, `/invariants`, `/sources`, `/food/[id]`. German and English toggle in the header. No account.

## Data model

- Ontology: six plant categories and five animal categories — never collapsed into a “vegetable” average
- Axes: nutrient density, protein quality (DIAAS preferred), essential fats, carbohydrate quality (passive fiber vs active sugar/starch), bioavailability, unique bioactives, practical efficiency
- Scoring: `src/lib/scoring.ts` — multipliers and penalties are applied to raw axis scores before combined ranking and tier placement
- Seed foods: `src/data/foods/` (all eleven categories)
- Sources: `src/data/sources.ts`

Sparse, contested, estimated, and preparation-dependent values are flagged on the record.

## Guardrails

- Quantity without bioavailability is treated as noise
- Complementarity is not scored as equivalent to high-DIAAS animal protein
- Spirulina “B12” is stored as inactive analogs (usable B12 = 0)
- Fiber absence on animal foods is axis-neutral, not a moral penalty
- Residue claims cite EFSA monitoring and USDA PDP, not marketing lists
