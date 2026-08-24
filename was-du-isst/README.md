# Was du isst

Public, login-free food evaluation matrix. Plant categories stay unequal. Quantity without bioavailability is treated as noise.

**Du bist was du isst** — the interface is a seven-axis matrix plus within-class and across-class tiers. It does not advocate a plant-only or animal-only diet.

## Stack

Next.js App Router · TypeScript · Tailwind CSS v4 · Recharts · Vitest

## Run

```bash
cd was-du-isst
npm ci
npm run dev
```

App: http://localhost:3000

```bash
npm test
npm run typecheck
npm run build
```

## What is hard-coded as constraint

1. Nine indispensable amino acids; DIAAS (ileal) before ranking; cereals lysine-limited; legumes Met+Cys-limited.
2. Heme iron absorbs better than nonheme; phytate/oxalate/polyphenols cut mineral uptake.
3. Preformed B12, EPA/DHA, creatine, carnosine, and retinol are essentially absent from unaugmented plants. ALA conversion is low (NIH: <15%).
4. Fiber / resistant starch is a plant (and some fungal) structural advantage — passive carbohydrate.
5. Water-soluble vitamins are labile; carotenoids can become more available when the matrix is disrupted.
6. Leafy surfaces typically carry higher residue detections than roots or thick skins.
7. Ferments, sprouts, UV fungi, and algae are distinct niches. They are never averaged into “vegetables”.

## Data

Seed nutrient panels cite USDA FoodData Central SR Legacy (NDB numbers on each food). Protein quality cites FAO DIAAS (2013), Herreman et al. 2020, and Mathai et al. 2017. Reference anchors cite DGE 2025 and EFSA DRVs. Iron, B12, vitamin A, and omega-3 language cites NIH ODS. Residues cite USDA PDP 2024 and EFSA 2024 monitoring.

Sparse or proxied DIAAS values are labelled `sparse` or `contested` in the UI.

## Routes

| Path | Role |
| --- | --- |
| `/` | Ontology + seven invariants |
| `/matrix` | Radar + sortable table |
| `/tiers` | Filterable tier list |
| `/compare` | Side-by-side + radar |
| `/food/[id]` | Full axes, panel, sources, gaps |
| `/invariants` | Educational layer |
| `/sources` | Source catalog with year + URL |

German is the default locale. Toggle DE/EN in the header. No account.
