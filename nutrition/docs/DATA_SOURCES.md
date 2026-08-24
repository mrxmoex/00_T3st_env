# External data sources mapping

| Domain | Authority | Use in app | Field mapping |
|--------|-----------|------------|---------------|
| Macronutrients, minerals, vitamins | [USDA FoodData Central](https://fdc.nal.usda.gov/) | `per100g` basis | FDC ID in `sources` |
| Amino acid profiles | USDA + WHO reference pattern | EAA axis | `per100g.aminoAcids` |
| PDCAAS / DIAAS | FAO/WHO reports, meta-analyses | `bioavailability.pdcaas/diaas` | `coefficients.ts` |
| Iron/zinc bioavailability | WHO/FAO, Hallberg et al. | `bioavailability.ironFactor` etc. | Documented in Source panel |
| Omega-3/6, EPA/DHA | USDA + EFSA DRV | EFA axis | `per100g.fattyAcids` |
| MRL / residue tiers | EU pesticide DB, US EPA | `residue` object | Tier 1–5 → risk index |
| Vitamin stability | USDA retention factors | Degradation axis | `degradation` object |

## Sample record provenance

Each `FoodRecord.sources[]` entry:

```json
{
  "id": "fdc-168462",
  "name": "USDA FDC — Spinach, raw",
  "url": "https://fdc.nal.usda.gov/fdc-app.html#/food-details/168462",
  "verifiedAt": "2026-08-24"
}
```

## Versioning

- Dataset version: `nutrition/src/data/version.ts`
- Coefficient changelog in `nutrition/src/coefficients.ts` header comment
- `lastVerificationDate` on meta endpoint

## Future import pipeline

1. FDC bulk CSV → normalizer → `FoodRecord`
2. Manual QC flags for conversion coefficients
3. Division assignment rules (not interchangeable classes)
