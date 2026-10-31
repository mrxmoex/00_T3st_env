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

Find codes for a new food in the cached archives (run the build once first):

```bash
cd scripts/data
python3 find_food.py Apfel roh          # BLS: code, names, macros, whether all amino acids are reported
python3 find_food.py --fdc apples raw   # USDA SR Legacy: FDC id and description
```

The archive hashes are pinned in the script. If an upstream archive changes, the script stops instead of silently importing different numbers.

## Merge and gap rules

1. The BLS entry is primary whenever the manifest lists one; otherwise the FDC entry is.
2. The secondary entry only fills nutrients the primary does not report. `fdcMatch: "similar"` marks a stand-in (for example a roasted instead of a pan-fried chicken breast); values filled from it are labelled *taken from a similar food*.
3. Missing stays missing. A value no database reports is `null`, shown as —, excluded from the score, and named in the food's flags.
4. An essential amino acid of exactly 0 in a food with at least 0.5 g protein is a data defect (BLS pattern calculations for zucchini report all zeros) and is treated as missing.
5. Amino acids still missing are filled from the pattern of a named similar food (`aaPattern`), scaled to this food's protein. This is the method BLS documents as *Musterberechnung*; the filled values carry the provenance `pattern`.
6. Starch comes from the same entry as available carbohydrate. When that entry lists no starch, starch is available carbohydrate minus sugars. Another database's starch is derived from a different total and could push sugars plus starch past it (it did for dried shiitake: 61.7 g on top of 21.7 g).
7. A value that cannot be true for the tissue is not used. Two foods take USDA as their primary entry and the manifest says why: pistachios (BLS: 5.6 mg potassium) and pumpkin seeds (BLS: folate exactly 0 by formula).

## Protein digestibility

`ilealDigestibility` is the share of a food's protein absorbed by the end of the small intestine: true ileal digestibility of nitrogen, one value per food. Foods from D1 on cite theirs (`src/data/foods/proteinDigestibility.ts`, linked in the Food page source panel), and `proteinDigestibility.test.ts` checks each value against a percentage its source states. Measurements of the food as people eat it come first, in this order:

1. Human, true ileal (15N-labelled food with a naso-ileal tube, or ileostomates).
2. Growing pig, true ileal. Hodgkinson et al. 2025 measured 97 foods with one method in three laboratories; Hodgkinson et al. 2022 found pig and adult human values interchangeable (human = 1.00 × pig − 0.010).
3. Rat, true ileal.
4. Rat or human, true faecal, only when no ileal value exists: in rats, faecal values exceeded ileal ones for 11 of 14 foods, by 10 % on average (Rutherfurd et al. 2015).

A food nobody has measured takes a **proxy**, named, when one measured food is clearly closer than its category (cooked oatmeal for uncooked oat flakes, whole wheat bread for wholemeal pasta); otherwise a **class value**, the median of its category in the pig study (Table 3: fruit 62 %, seeds 64 %, vegetables 86 %, nuts 90 %), which the authors call indicative only for plant categories. Raw grain measured as animal feed does not stand in for cooked food (Hodgkinson et al. 2022).

Limits:
- One value covers every amino acid. The limiting one can digest far worse: reactive lysine 17 % against 46 % of nitrogen in the pig study's rye bread.
- Class values are medians of amino acid digestibility; measured values are nitrogen.
- The pig study was funded by Project Proteos, a consortium of food sectors coordinated by the Global Dairy Platform, as the paper declares.

## Provenance categories

Each value keeps the database's own category, mapped to one vocabulary: lab analysis, literature, aggregated literature, other database, recipe calculation, pattern of a similar food, taken from a similar food, rescaled, formula, logical zero, logical assumption, trace, label value. USDA derivation codes are mapped by their source code (analytical, calculated, assumed zero, …).

## Coefficients and curated values

| Source | What we take | Maps to |
| --- | --- | --- |
| FAO 2013 / WHO/FAO protein quality | Adult AA scoring pattern; DIAAS/PDCAAS convention | EAA axis |
| Evenepoel et al. 1998, J Nutr 128:1716–1722 | Human ileal digestibility of raw vs cooked egg (51.3 % vs 90.9 %) | Raw egg digestibility |
| Hodgkinson et al. 2025, J Nutr, doi:10.1016/j.tjnut.2025.08.004 (Tables 2–3); Hodgkinson et al. 2022, J Nutr 152:1635 | Pig true ileal nitrogen digestibility of 97 foods; category medians; pig = human | `ilealDigestibility` of D1 foods |
| Walther et al. 2019, Mol Nutr Food Res (Table 1); Rutherfurd et al. 2015, J Nutr 145:372 (Table 1); Bailey & Stein 2020, J Sci Food Agric (Table 4); Lackey & Fleming 2021, Front Nutr (Table 3); Freitas et al. 2012, Food Nutr Sci (Table 4) | Human, rat, and pig values for white bread, roasted peanuts, pistachios, walnuts, Brazil nuts | `ilealDigestibility` where the pig study has no match |
| IOM / EFSA vitamin A | Food RAE: β-carotene /12, other provitamin A carotenoids /24 | Micro axis, `raeUg` |
| FDA Daily Values (21 CFR 101.9, 2016) | Reference amounts for the 20 scored micronutrients | Micro axis density |
| EFSA tolerable upper intake levels | Retinol, iodine, selenium, copper, zinc, vitamin D, calcium, B6 | Marked (⚠) when 100 kcal exceed a day's limit; not scored |
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
