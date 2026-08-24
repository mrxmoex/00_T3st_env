# Du bist was du isst

A free, public-access web application for multi-axis biochemical food evaluation.

> *Menge ohne Bioverfügbarkeit ist Rauschen. Vollständigkeit ohne Verdaulichkeit ist unvollständig.*

## Principles

- **No category collapsing** — plant categories (leafy greens, legumes, sprouts, fermented, mushrooms, algae) are evaluated separately from animal categories (muscle, organs, eggs, dairy, fish).
- **Seven evaluation axes** — nutrient density, protein quality (DIAAS), essential fatty acids, carbohydrate quality, bioavailability/anti-nutrients, unique bioactives, practical efficiency.
- **Bioavailability multipliers** applied before ranking.
- **Every claim source-linked** — USDA FDC, FAO/WHO DIAAS, EFSA, DGE, NIH ODS.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Recharts (radar charts)
- Static seed data from USDA-derived nutrient profiles

## Data Schema

```
src/lib/types/index.ts     — Food ontology, axis types, nutrient profiles
src/dataset/foods/raw.ts        — Seed foods (USDA FDC IDs)
src/dataset/sources.ts          — Verified source references
src/dataset/invariants.ts       — Biochemical invariants (hard constraints)
src/lib/scoring/engine.ts    — Scoring with bioavailability multipliers
```

## Commands

```bash
npm ci
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

## Features

- Interactive radar matrix comparison
- Filterable/sortable tier lists (by category, axis, kingdom)
- Side-by-side food comparison (up to 3 foods)
- Biochemical invariants educational layer
- German + English UI
- Dark mode default
- No login required
