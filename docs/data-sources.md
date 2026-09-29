# Data sources

Nutrient values are imported by script, never typed by hand. Curated fields (class, digestibility, residue and stability profiles, NOVA group, notes) live next to each food in `src/data/foods/*.ts`. Bioactive compound contents come from published analyses and live in `src/data/bioactives.ts`, one citation per value.

## Databases

| Database | Licence | Role |
| --- | --- | --- |
| **BLS 4.0** – Bundeslebensmittelschlüssel, Max Rubner-Institut (2025), DOI [10.25826/Data20251217-134202-0](https://doi.org/10.25826/Data20251217-134202-0) | CC BY 4.0 | Primary source for every food it lists: macros, all essential amino acids, fatty acids, vitamins, minerals incl. iodine, and per-value provenance. Cooked variants are BLS recipe calculations that include weight and nutrient changes from cooking. |
| **USDA FoodData Central, SR Legacy** (April 2018) | Public domain (CC0 1.0) | Foods BLS does not list (black beans, kimchi, wakame, spirulina) and nutrients BLS does not report (choline, selenium). |
| **Open Food Facts** (retrieved 2026-09-29) | ODbL 1.0 | Aggregate counts only: NOVA groups and E numbers in the ingredient lists of a product category, for foods whose processing depends on the product (instant mash, canned potatoes). Built by `scripts/data/processing_evidence.py` into `src/data/sources/processing-evidence.json`. Attribution: Open Food Facts contributors, https://world.openfoodfacts.org. |

Attribution for BLS: *Max Rubner-Institut (2025): Bundeslebensmittelschlüssel (BLS), Version 4.0 - Deutsche Nährstoffdatenbank. Karlsruhe. DOI: 10.25826/Data20251217-134202-0.* Values are used unchanged; the selection of foods, the documented gap filling below, and every score are this project's.

## Pipeline

```
src/data/sources/manifest.json    food id → BLS code and/or FDC id (+ match quality, amino acid pattern)
scripts/data/build_snapshot.py    downloads both archives, verifies SHA-256, maps both schemas to one set of keys
src/data/sources/snapshot.json    committed output: per food, per nutrient [value, provenance, database]
src/data/sources/snapshot.ts      typed access; src/data/foods/helpers.ts merges it with the curated spec
```

Rebuild after editing the manifest:

```bash
pip install -r scripts/data/requirements.txt
python3 scripts/data/build_snapshot.py
npm test
```

The archive hashes are pinned in the script. If an upstream archive changes, the script stops instead of silently importing different numbers.

## Merge and gap rules

1. The BLS entry is primary whenever the manifest lists one; otherwise the FDC entry is.
2. The secondary entry only fills nutrients the primary does not report. `fdcMatch: "similar"` marks a stand-in (for example a roasted instead of a pan-fried chicken breast); values filled from it are labelled *taken from a similar food*.
3. Missing stays missing. A value no database reports is `null`, shown as —, excluded from the score, and named in the food's flags.
4. An essential amino acid of exactly 0 in a food with at least 0.5 g protein is a data defect (BLS pattern calculations for zucchini report all zeros) and is treated as missing.
5. Amino acids still missing are filled from the pattern of a named similar food (`aaPattern`), scaled to this food's protein. This is the method BLS documents as *Musterberechnung*; the filled values carry the provenance `pattern`.

## Provenance categories

Each value keeps the database's own category, mapped to one vocabulary: lab analysis, literature, aggregated literature, other database, recipe calculation, pattern of a similar food, taken from a similar food, rescaled, formula, logical zero, logical assumption, trace, label value. USDA derivation codes are mapped by their source code (analytical, calculated, assumed zero, …).

## Coefficients and curated values

| Source | What we take | Maps to |
| --- | --- | --- |
| FAO 2013 / WHO/FAO protein quality | Adult AA scoring pattern; DIAAS/PDCAAS convention | EAA axis, `ilealDigestibility` |
| Evenepoel et al. 1998, J Nutr 128:1716–1722 | Human ileal digestibility of raw vs cooked egg (51.3 % vs 90.9 %) | Raw egg digestibility |
| IOM / EFSA vitamin A | Food RAE: β-carotene /12, other provitamin A carotenoids /24 | Micro axis, `raeUg` |
| FDA Daily Values (21 CFR 101.9, 2016) | Reference amounts for the 20 scored micronutrients | Micro axis density |
| EFSA tolerable upper intake levels | Retinol, iodine, selenium, copper, zinc, vitamin D, calcium, B6 | Micro axis cost when 100 kcal exceed a day's limit |
| Iron/zinc bioavailability meta-analyses | Fractional absorption midpoints (heme vs non-heme, phytate) | `absorbableIronMg`, `absorbableZincMg` |
| IOM 2001 (iron, zinc DRIs); Weaver et al. 1999 | Absorption the Daily Value assumes: iron 18 %, zinc 41 %, calcium as milk 32.1 % | `DV_REFERENCE_ABSORPTION`: absorbed amounts in DV units |
| Weaver, Proulx & Heaney 1999, Am J Clin Nutr 70:543S (Table 2) | Human calcium absorption by food (spinach 5.1 %, kale 49.3 %, broccoli 61.3 %, beans 22–27 %, tofu 31 %, milk 32.1 %) | `absorbableCalciumMg` |
| 21 CFR 182.3766; EPA RED for inorganic sulfites | Sulfites destroy thiamin; not allowed in foods that are a source of vitamin B1 in the US | Notes on canned and instant potato products |
| Directive 96/22/EC | Ban on hormonal growth promoters in EU livestock farming (since 1988) | Hormone note on animal foods |
| EFSA contaminant opinions (cadmium, lead, methylmercury, dioxins) | Body storage and half-lives of accumulating contaminants | Storage section of the methodology |
| EFSA n-3 LC-PUFA opinions | Preformed EPA/DHA vs ALA conversion inefficiency | EFA axis coefficients 0.08 / 0.01 |
| Watanabe et al., reviews of algal corrinoids | Inactive B12 analogues in seaweeds and spirulina | `b12IsAnalogue` → effective B12 = 0 |
| EU/US MRL monitoring (classed, not lot-level) | Surface-area and systemic vs contact residue logic | Residue axis |
| Published analyses (see `docs/scoring-formulas.md`) | Creatine, taurine, carnosine, anserine, CoQ10, L-carnitine, ergothioneine, glucosinolates (in neither database) | Bioactive compound table, creatine / glucosinolate / ergothioneine columns |

## Versioning

- `DATASET_VERSION` / `LAST_VERIFIED` in `src/data/coefficients.ts`
- Shown in the header, export files, and the Source & method panel
