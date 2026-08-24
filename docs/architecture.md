# Architecture

**Du bist was du isst** is a static, browser-computed nutrition matrix. Scores are not produced by a model. They are produced by documented arithmetic over versioned nutrient tables and bioavailability coefficients.

## High-level shape

```
dataset/          raw foods + meta (version, sources, flags)
lib/scoring/      deterministic engine (ESM, used by tests and the browser)
public/           mobile-first UI (hash routes, no backend required)
src/              optional Express host so the Cloud Agent environment can serve files
docs/             formulas, schemas, source map, non-claims
```

The same `lib/scoring/` module runs in Node tests and in the browser. There is one implementation of each formula.

## Runtime

1. The UI imports `/dataset/foods.js`, `/dataset/meta.js`, and `/lib/scoring/index.js`.
2. `scoreDataset` + `assignTiers` compute every axis and a class-local S/A/B/C/D rank.
3. Filters, compare, recommendations, and CSV/JSON export operate on that in-memory result.
4. Express is only a file server plus the leftover Notes demo API. The matrix does not need it. Opening `public/index.html` via any static host is enough if import paths resolve.

## Update path

1. Edit a food record in `dataset/foods.js` (keep `flags.estimatedFields` honest).
2. Bump `dataset/meta.js` `version` and `verifiedAt` when the table changes.
3. Run `npm test`. The engine is covered by formula tests; the table is covered by class-coverage and non-equivalence tests.
4. Redeploy the static files. No migration, no model retraining.

## Future extensions (non-breaking)

Every food already has:

```js
extensions: { supplements: null, processedFood: null, bloodworkOverlay: null }
```

Those slots may later hold supplement facts, ultra-processed markers, or optional lab overlays. They must **not** rewrite the eight core axes. New scores belong in new optional axes or in overlay views.

## Trust boundary

- No user-supplied HTML is interpolated into the matrix.
- CSV export escapes quotes and commas.
- Filter values are compared as closed enums (`classId`, axis key, dietary pattern), not evaluated.
- There are no secrets, accounts, or paywalls.
