# Du bist was du isst

Free public **efficiency-value-nutrition** web app: a multi-axis evaluation matrix for plant and animal foods. It does **not** treat plant and animal proteins, irons, zincs, or vitamin A forms as equivalent.

The interactive app lives in [`web/`](web/).

## Run

```bash
npm ci
npm ci --prefix web
npm run dev
```

Open http://localhost:3000

| Command        | Description                                      |
| -------------- | ------------------------------------------------ |
| `npm run dev`  | Vite app on port 3000                            |
| `npm test`     | Notes API tests + nutrition scoring tests        |
| `npm run build`| Production build of the matrix app               |
| `npm run lint` | ESLint (root JS) + oxlint (web)                  |

## Biological constraints the software enforces

- Plant proteins are labelled **incomplete**. Animal proteins are complete only when they meet the WHO/FAO adult pattern and a digestibility floor.
- Non-heme iron, phytate-bound zinc, and carotenoid vitamin A use published bioavailability coefficients.
- Active carbohydrate (sugars + digestible starch) is scored separately from fibre and resistant starch.
- Algae, mushrooms, sprouts, fermented kraut, legumes, and leafy salads are distinct classes.
- A plant-only recommendation always names required B12 fortification/supplementation and does not claim completeness.

See [web/README.md](web/README.md) and the in-app **Methodology** page.

## Also in this repo

- [`src/`](src/) + [`public/`](public/) — original Notes demo API (still tested)
- [`bulwark/`](bulwark/) — separate AI-agent behaviour-security prototype
