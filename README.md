# Du bist was du isst

Public, free matrix evaluation of foods by **biochemical efficiency, completeness, and real-world value**. Explicit formulas. No equivalence theater between incomplete plant proteins and complete animal proteins. No black-box “AI nutrition score”.

The previous Notes demo in this repo is replaced by this product. `bulwark/` remains a separate prototype.

## Inevitable biological truths (encoded, not decorated)

- Plant proteins are incomplete as a class; animal proteins are complete. DIAAS/PDCAAS are not equalised.
- Non-heme iron, phytate-bound zinc, and carotenoid vitamin A are not equivalent to heme iron, animal zinc, and retinol.
- Fibre/phytochemicals are plant advantages. B12, creatine, taurine, carnosine, and LC EPA/DHA are animal (or algae-oil) advantages.
- Water-soluble vitamins degrade; fat-soluble vitamins oxidise.
- Agricultural residues belong in the matrix.
- Active vs passive carbohydrates are scored separately.
- Fatty-acid composition is a first-class axis.
- Algae, mushrooms, sprouts, kraut, legumes, and leafy salads are distinct classes.

## Stack

- Vite + React + TypeScript + Tailwind
- Static catalog + pure scoring functions
- Vitest for formula tests

## Run

```bash
npm ci
npm run dev    # http://localhost:3000
```

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Vite dev server, port 3000 |
| `npm test`     | Scoring and export tests   |
| `npm run build`| Production build           |
| `npm run lint` | ESLint                     |

## Architecture

- `docs/ARCHITECTURE.md` — layers, data contract, extension path
- `docs/METHODOLOGY.md` — auditable formulas and non-claims
- `src/data/` — versioned foods, sources, class weights, coefficients
- `src/scoring/` — pure axis functions
- `src/recommend/` — pattern-aware engine with required B12 disclosure
- `src/export/` — CSV / JSON

Catalog version and last verification date are in `src/data/manifest.ts` and in the UI footer.
