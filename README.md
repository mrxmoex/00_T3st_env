# Du bist was du isst

A free, public-access food-quality matrix. Scores are **computed**, not guessed: raw nutrient tables plus documented bioavailability coefficients. Plant proteins are never treated as equivalent to complete animal proteins.

Open http://localhost:3000 after `npm start`. No account. No paywall.

## What you get

- Interactive heatmap matrix with S/A/B/C/D **within each biochemical class**
- Filters: class, axis, dietary pattern (plant-only / animal-inclusive / hybrid), search
- Single-food deep dive with a collapsible **Source & Method** panel
- Side-by-side comparison
- Recommendation engine that refuses to mark plant-only patterns complete without fortification
- CSV / JSON export of the current view
- Dark / light mode, mobile-first layout

## Honest biology (non-negotiable)

- Plant proteins are incomplete; animal proteins are complete. DIAAS/PDCAAS and digestibility are not interchangeable slogans.
- Non-heme iron, phytate-bound zinc, and carotenoid vitamin A are less bioavailable than heme iron, animal zinc, and retinol.
- Fibre and phytochemicals are plant advantages. B12, creatine, taurine, carnosine, and long-chain EPA/DHA are animal advantages (or need algae oil / supplements).
- Algae, mushrooms (Schroom), sprouts, fermented kraut, legumes, and leafy salads are **distinct classes**.
- Active carbs (sugars + starch) are scored separately from passive carbs (fibre + resistant starch).

Read the [non-claims page](docs/methodology-non-claims.md) before quoting a number.

## Stack

- Vanilla HTML/CSS/JS (ES modules)
- Scoring engine in `lib/scoring/` — same code in the browser and in `node --test`
- Optional Express host (`src/server.js`) so this Cloud Agent environment can serve files
- Dataset in `dataset/` (versioned; last verification date is shown in the header)

The engine does **not** need a backend. Any static host that can serve the `public/`, `lib/`, `dataset/`, and `docs/` trees works.

## Commands

| Command | Description |
| --- | --- |
| `npm ci` | Install locked dependencies |
| `npm start` | Serve the app on http://localhost:3000 |
| `npm run dev` | Same with `--watch` |
| `npm test` | Formula, dataset, export, and HTTP tests |
| `npm run lint` | ESLint |

`PORT` overrides the listen port (default `3000`).

## Documentation

| Doc | Contents |
| --- | --- |
| [docs/architecture.md](docs/architecture.md) | Runtime, update path, future overlays |
| [docs/data-model.md](docs/data-model.md) | Food record + class list |
| [docs/schemas/](docs/schemas/) | JSON Schema for food + meta |
| [docs/scoring-formulas.md](docs/scoring-formulas.md) | Every axis, every coefficient |
| [docs/sources.md](docs/sources.md) | USDA / FAO / EFSA / MRL map |
| [docs/methodology-non-claims.md](docs/methodology-non-claims.md) | What we will not claim |

## Update path

1. Edit `dataset/foods.js` (flag every estimated field).
2. Bump `version` and `verifiedAt` in `dataset/meta.js`.
3. `npm test`.
4. Redeploy static files.

Reserved, non-breaking slots on every food: `extensions.supplements`, `extensions.processedFood`, `extensions.bloodworkOverlay`.

## Also in this repo

- [`/notes.html`](public/notes.html) — original Notes sandbox (`/api/notes`).
- [`bulwark/`](bulwark/) — separate AI-agent behaviour-security prototype.

## Cloud Agent environment

`.cursor/environment.json` still runs `npm ci` and `npm run dev` on port 3000. The process now serves this matrix.
