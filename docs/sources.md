# Source map

Every axis is traceable to a standard plus an engine coefficient. Dataset version: see `dataset/meta.js`.

| Axis | Primary data | Coefficient / method | What is estimated |
| --- | --- | --- | --- |
| EAA completeness + digestibility | USDA FDC amino acids where present; otherwise literature-typical mg/g protein | FAO 2013 DIAAS pattern; ileal vs fecal digestibility | Most EAA panels and digestibility coefficients |
| EFA / glyceride | USDA FDC fatty acids | ALA→EPA+DHA = 0.08; odd-chain + CLA bonus | Odd-chain and CLA amounts when FDC is silent |
| Carbohydrate type | USDA FDC carbohydrate, fibre, sugars | active = sugars+starch−RS; passive = fibre+RS | Resistant starch (often literature-typical) |
| Micronutrient density + bioavailability | USDA FDC vitamins/minerals | Heme 25% / non-heme 8% (± phytate, vitamin C); phytate:Zn bands; carotenoid RAE × 0.5 | Heme split when FDC reports only total iron; tissue metabolites |
| Fibre / phytochemicals | USDA fibre; literature polyphenols / glucosinolates / pigments | Class bonuses for kraut, mushrooms, algae | Polyphenol and glucosinolate milligrams |
| Residue / contaminant | EU MRL database, US tolerances, seafood metal literature | 0.40 / 0.35 / 0.25 risk mix | **All residue indices are class-typical, not lot-specific** |
| Degradation | Biochemistry of water-soluble vitamins, cut-surface area, PUFA oxidation | 0.35 / 0.25 / 0.20 / 0.20 fragility mix | All four fragility inputs are heuristics |
| Composite | Class weights in `lib/scoring/constants.js` | Weighted sum, weights sum to 1 | Weights are modelling choices, documented not hidden |

## Primary standards

| ID | Document | Used for |
| --- | --- | --- |
| `usda-fdc` | [FoodData Central](https://fdc.nal.usda.gov/) | Proximate, vitamin, mineral, many lipid and amino-acid values. FDC IDs are stored on each food. |
| `fao-2013-diaas` | FAO 2013 protein quality consultation | DIAAS reference pattern and ileal-digestibility framing |
| `who-fao-ununu-protein` | WHO/FAO/UNU protein requirements | EAA requirement context |
| `efsa-drv` | EFSA Dietary Reference Values | Density denominators (not medical RDAs) |
| `iom-vitamina` | IOM/NASEM RAE | 12:1 / 24:1 carotenoid math before the extra 0.5 haircut |
| `hurrell-egli-iron` | Iron bioavailability reviews | Heme vs non-heme absorption |
| `iZiNCG-zinc` | IZiNCG / WHO phytate:zinc | Zinc bioavailability bands |
| `eu-mrl` | [EU pesticide MRLs](https://ec.europa.eu/food/plant/pesticides/eu-pesticides-database/start/screen/mrls) | Residue-risk context |

## Conversion factors the UI must show

- ALA → EPA+DHA: **0.08**
- Heme iron absorption: **0.25**
- Non-heme iron absorption base: **0.08**
- Carotenoid RAE extra haircut: **0.50**
- Phytate:Zn cut-points: **5** and **15**

## Last verification

`dataset/meta.js` → `verifiedAt` (currently 2026-08-24) and `version` (currently 1.0.0). Bump both when tables change.
