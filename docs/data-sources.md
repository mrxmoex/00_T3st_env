# External data sources and matrix mapping

| Source | What we take | Maps to |
| --- | --- | --- |
| USDA FoodData Central | Proximate, vitamins, minerals, fatty acids, FDC IDs | `FoodRecord` macros, micros, fats, carbs |
| FAO 2013 / WHO/FAO protein quality | Adult AA scoring pattern; DIAAS/PDCAAS convention | EAA axis, `ilealDigestibility` |
| IOM / EFSA vitamin A | Food RAE: β-carotene /12, other /24 | Micro axis, `raeUg` |
| Iron/zinc bioavailability meta-analyses | Fractional absorption midpoints (heme vs non-heme, phytate) | `absorbableIronMg`, `absorbableZincMg` |
| EFSA n-3 LC-PUFA opinions | Preformed EPA/DHA vs ALA conversion inefficiency | EFA axis coefficients 0.08 / 0.01 |
| Watanabe et al. and reviews of algal corrinoids | Inactive B12 analogues in many seaweeds | `b12IsAnalogue` → effective B12 = 0 |
| EU/US MRL monitoring (classed, not lot-level) | Surface-area and systemic vs contact residue logic | Residue axis |
| EFSA vitamin A UL | Retinol toxicity context for organs | Recommendation flags, not a score cap |
| Published creatine/taurine/carnosine tissue values | Animal-exclusive compounds | Extra columns + plant-only gaps |

## Versioning

- `DATASET_VERSION` / `LAST_VERIFIED` in `src/data/coefficients.ts`
- Shown in the header, export files, and Source & Method panel

## Transcription caveat

Sample foods are sourced (FDC IDs cited) and rounded to published typical values. They are not a live USDA pull. Re-verify against FDC before treating a cell as a lab result. Amino-acid mg/g protein for some plants are literature-typical patterns where FDC amino-acid panels are thin.

## How to refresh

1. Look up FDC ID → replace numeric fields.
2. Keep coefficients in `coefficients.ts` unless the underlying standard changes (then bump version and document the delta on the methodology page).
3. Residue fields are **classed risk**, not a substituted MRL spreadsheet. A future importer can overwrite them without changing the formula.
