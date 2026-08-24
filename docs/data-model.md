# Data model

Authoritative schemas live in `docs/schemas/`. This page is the narrative.

## Food record (per 100 g edible)

| Field | Meaning |
| --- | --- |
| `id` | Stable slug |
| `name` | Display name |
| `classId` | One of the 16 biochemical classes. Not a marketing category. |
| `kingdom` | `plant` \| `animal` \| `fungi` \| `algae` |
| `fermented` | Fresh vs fermented (required for kraut and animal ferments) |
| `serving.grams` / `serving.kcal` | Basis for density scores |
| `protein.eaaMgPerGProtein` | His, Ile, Leu, Lys, Met, Cys, Phe, Tyr, Thr, Trp, Val |
| `protein.ilealDigestibility` / `fecalDigestibility` | DIAAS vs PDCAAS coefficients |
| `lipids` | SFA/MUFA/PUFA, n-3/n-6, ALA/EPA/DHA, odd-chain, CLA |
| `carbs` | sugars, starch, fibre, resistant starch (active vs passive) |
| `micros` | Iron split into heme/non-heme; retinol vs carotenoids; B12; tissue metabolites |
| `phytochemicals` | Polyphenols, glucosinolates, class-unique pigments |
| `antinutrients` | Phytate, oxalate, lectin/goitrogen flags |
| `residues` | 0–1 class-typical pesticide / heavy-metal / POP indices |
| `degradation` | 0–1 water-soluble load, cut surface, heat, PUFA oxidation |
| `flags.estimatedFields` | Every estimated or converted field must be listed |
| `sources` | FDC IDs or literature notes |
| `extensions` | Reserved: supplements, processedFood, bloodworkOverlay |

## Classes (do not collapse)

**Plant / non-animal**

- `leafy_salad`
- `legumes`
- `sprouts`
- `cruciferous_kraut` (fresh and fermented rows are distinct)
- `mushrooms` (fungi — “Schroom”)
- `algae`
- `roots_tubers`
- `other_vegetables`

**Animal**

- `muscle_ruminant` / `muscle_monogastric` / `muscle_poultry` / `muscle_fish`
- `organs`
- `eggs`
- `dairy`
- `fermented_animal`

Mushrooms are not vegetables. Algae are not leafy greens. Sprouts are not legumes. Sauerkraut is not raw cabbage.

## Scored food (engine output)

The engine returns the raw record plus:

- `protein.kind`: `complete_animal` \| `incomplete_animal` \| `incomplete_plant`
- `protein.diaas`, `protein.pdcaas`, `protein.limitingAA`
- `lipids.effectiveLongChainN3G` (EPA + DHA + 0.08 × ALA)
- `carbs.activeG` / `carbs.passiveG`
- bioavailability-adjusted micros
- `axes` (0–100) and `composite`
- `tier` (S/A/B/C/D **within class**)
- `claims.proteinEquivalentToAnimal` — always `false`
- `trace` — formula strings for the Source & Method panel

## Dataset meta

`dataset/meta.js` versions the table (`version`, `verifiedAt`, `engineVersion`) and lists the primary standards. Changing numbers without bumping `verifiedAt` is a documentation defect.
