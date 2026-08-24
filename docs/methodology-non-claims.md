# Methodology and non-claims

This page is part of the product, not an appendix. The UI links here as **Methodik**.

## What this system is

A transparent, class-honest scoring matrix. It compares foods **inside a biochemical class** and shows trade-offs across eight axes. It is free. There is no paywall and no personalized medical diagnosis.

## What this system will not claim

1. **Protein equivalence.** Plant proteins are incomplete and/or digestibility-limited. Animal proteins are complete. A similar 0–100 EAA axis number is not interchangeability.
2. **That a plant-only pattern is complete without fortification.** Bioactive B12, reliable long-chain EPA/DHA, creatine, taurine, carnosine, heme iron, and preformed retinol are animal advantages (or require specific algae oil / supplements / fortification).
3. **That fibre and phytochemicals are optional flavour.** They are plant advantages. Muscle and organs score low here on purpose.
4. **That RAE on a carrot equals retinol in liver.** Carotenoid conversion is inefficient and variable. The engine applies an extra 0.5 haircut.
5. **That non-heme iron equals heme iron, or phytate-bound zinc equals meat zinc.**
6. **That ALA equals EPA/DHA.** Conversion is scored at 0.08 combined and flagged.
7. **That mushrooms, algae, sprouts, legumes, kraut, and leafy salads are one “plant” bucket.** They are distinct classes with distinct weights.
8. **That fresh cabbage equals sauerkraut, or milk equals yogurt.** Fermentation is first-class.
9. **That residue scores are lab results.** They are class-typical risk indices informed by MRL regimes, not a batch COA.
10. **That a high composite is a command to eat that food.** Calories, ecology, ethics, cost, allergy, and culture are out of scope.
11. **Medical, paediatric, or clinical dietetics advice.** Density references are scoring rulers, not prescriptions.
12. **That PDCAAS and DIAAS are the same method.** PDCAAS is capped; DIAAS is not.

## Dietary-pattern engine limits

| Pattern | Completeness without fortification | Required honesty |
| --- | --- | --- |
| Plant-only | `false` | B12 fortification/supplementation is mandatory in this model. LC n-3 from algae oil or an animal source. Tissue metabolites absent. |
| Hybrid | true only if a complete animal food is present | Plants remain the fibre/phytochemical class. |
| Animal-inclusive | true only if a complete animal food is present | Still recommend at least one high-fibre plant class. |

## How to audit a number

1. Open the food. Expand **Source & Method**.
2. Read the raw table (USDA FDC ID or literature note).
3. Note `flags.estimatedFields` and conversion coefficients.
4. Recompute with `lib/scoring` or the formulas in `docs/scoring-formulas.md`.
5. Check `dataset/meta.js` `version` and `verifiedAt`.

If a field is estimated and not flagged, that is a bug.
