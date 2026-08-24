# Du bist was du isst

Public, free, no-login food matrix. Dark-mode native, mobile-first, German + English.

Quantity without bioavailability is noise. Completeness without digestibility is incomplete. Plant categories are never averaged into “vegetable”.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Recharts. Seed data is static and sourced.

## Run

```bash
cd web
npm ci
npm run dev    # http://localhost:3000
npm test
npm run typecheck
npm run build
```

## What is encoded

- `src/lib/schema.ts` — ontology, sourced values, axes, tiers
- `src/lib/scoring.ts` — multipliers and penalties before ranking
- `src/data/foods/` — seed foods across all strict categories
- `src/data/sources.ts` — USDA / FAO / EFSA / DGE / NIH / papers / residue programs
- `src/data/invariants.ts` — seven biochemical constraints as UI text

The composite score is an unweighted mean used only as a sort key. Trade-offs stay visible on every food.
