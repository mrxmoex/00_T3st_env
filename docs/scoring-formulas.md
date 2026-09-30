# Scoring formulas

All axes emit 0–100 unless noted. Implementation: `src/scoring/`. Tests: `src/scoring/scoring.test.ts`, `src/scoring/benefitsBurdens.test.ts`.

## Benefit against burden

- **Benefit axes:** EAA + digestibility, EFA / glycerides, carbohydrate type, micros as *available* amounts, fibre / phytochemicals.
- **Burden axes** (higher score = less burden): residue / contaminants (pesticides, metals, veterinary drugs) and stability / nutrient loss (storage losses plus what industrial processing destroyed).
- **Processing** (NOVA group) caps ultra-processed foods; additives and salt are shown from market data and the databases.
- **Bioactive compounds** (creatine, taurine, carnosine, anserine, CoQ10, L-carnitine, ergothioneine, glucosinolates) are indexed by measured content, shown and not scored.

## EAA completeness + digestibility

FAO 2013 adult pattern (mg/g protein): His 15, Ile 30, Leu 61, Lys 48, SAA 23, AAA 41, Thr 25, Trp 6.6, Val 40.

```
ratio_i = food_mg_g / ref_mg_g
AAS     = min(ratio_i)                 # untruncated
DIAAS   = AAS × ileal_digestibility    # may exceed 1.0
PDCAAS  = min(1, AAS) × digestibility
density = clamp(protein_g_per_100g / 20, 0, 1)
EAA     = 100 × (0.55×min(1,AAS) + 0.30×digestibility + 0.15×density)
```

Plant proteins stay incomplete when any ratio &lt; 1. Density stops low-protein leaves from ranking as protein foods.

## EFA / glyceride profile

```
ALA→EPA efficiency = 0.08
ALA→DHA efficiency = 0.01
effective_LC = EPA + DHA + ALA × 0.01
lc_score     = clamp(effective_LC / 0.5, 0, 1)
n6/n3        = (LA+AA) / max(ALA+EPA+DHA, 0.01)
ratio_score  = 0.70 if n6+n3 < 0.2 else clamp(1 − (ratio−2)/20, 0, 1)
quality      = clamp(0.45 + 0.35×MUFA_frac + 0.10×(1−|SFA_frac−0.35|), 0, 1)
odd_bonus    = clamp((odd_chain + CLA)/2, 0, 0.10)
EFA          = 45 if fat < 0.5 g/100 g
             else 100×(0.45×lc + 0.35×ratio + 0.20×quality) + 100×odd_bonus
```

ALA-only foods are flagged as not equivalent to preformed EPA/DHA. When a source does not report odd-chain fatty acids or CLA, the bonus counts only what is reported and animal foods say so in their flags.

## Carbohydrate type

```
active  = sugars + starch
passive = fibre + resistant_starch
activeScore  = 100 × (1 − clamp(active_g_per_100kcal / 15, 0, 1))
passiveScore = 100 × clamp(passive_g_per_100kcal / 8, 0, 1)
Carb = 70 if active+passive < 0.5   # quiet animal foods; fibre still absent
     else 100 × (0.55×passive/total + 0.25×activeScore/100 + 0.20×(1−sugars/total))
```

## Micros + bioavailability

```
RAE = retinol + β-carotene/12 + other_provitamin_A/24      (source RAE if a component is missing)
Fe_abs = Fe × {heme 0.25 | nonheme 0.05 | +vit C 0.12 | high phytate 0.03
               | mixed = 0.6×0.25 + 0.4×0.05}               (meat, fish, organs; eggs and dairy are nonheme)
Zn_abs = Zn × {animal 0.40 | low-phytate plant 0.25 | phytate 0.15}
Ca_abs = Ca × fraction absorbed in humans (Weaver et al. 1999; table below), none if no study
Fe* = Fe_abs / 0.18      Zn* = Zn_abs / 0.41      Ca* = Ca_abs / 0.321, or Ca without a study
B12*= 0 if analogue flag else B12
N   = the 20 nutrients below that a source reports          (missing values are excluded, not 0)
contrib_i = clamp( (%DV of available amount per 100 kcal) / 20%, 0, 1 )
Micro = 100 × max(0, mean_{i ∈ N}(contrib_i))
```

A stored nutrient past the adult upper limit is marked with how many limit-days 100 g covers. It does not lower the score: the body buffers a portion eaten now and then, and frequency is the person's.

The Daily Values already assume an absorption: the US iron RDA assumes 18 % from a mixed diet, the zinc RDA 41 % (IOM 2001), and calcium is referenced to milk (32.1 %). Dividing the absorbed amount by that factor expresses it in DV units, so absorption is counted once. Before this, absorbed iron and zinc were compared with intake-based DVs, which discounted them twice.

| Calcium absorbed | Measured for | Applied to (* = related food) |
| --- | --- | --- |
| 32.1 % | milk, yogurt, cheddar | dairy and fermented dairy classes |
| 5.1 % | spinach (oxalate) | spinach, chard* |
| 49.3 % | kale | kale |
| 61.3 % | broccoli | broccoli |
| 54.8 % | mean of kale, broccoli, bok choy | white and Chinese cabbage*, cauliflower*, Brussels sprouts*, rocket*, sauerkraut*, kimchi* |
| 24.4 % | red beans | kidney beans |
| 24.3 % | mean of pinto, red, white beans | black beans*, lentils*, chickpeas*, mung beans* |
| 31.0 % | calcium-set tofu | tofu, soybeans* |
| 22.2 % | sweet potato | sweet potato |

The body-store column (`BODY_STORAGE` in `src/data/absorption.ts`) marks how long the body holds each nutrient (years: vitamin A, B12, iron, calcium in bone; months: vitamin D, E, folate, iodine, copper, selenium, magnesium; weeks: B6, C, thiamin; none: K, riboflavin, niacin, choline, zinc, potassium). It is shown, not scored.

Scored nutrients and FDA Daily Values: iron 18 mg, zinc 11 mg, vitamin A 900 µg RAE, B12 2.4 µg, folate 400 µg DFE, C 90 mg, D 20 µg, E 15 mg, K 120 µg, thiamin 1.2 mg, riboflavin 1.3 mg, niacin 16 mg, B6 1.7 mg, choline 550 mg, calcium 1300 mg, magnesium 420 mg, potassium 4700 mg, copper 0.9 mg, selenium 55 µg, iodine 150 µg.

EFSA upper limits checked per 100 kcal: preformed retinol 3000 µg, iodine 600 µg, selenium 255 µg, copper 5 mg, zinc 25 mg, vitamin D 100 µg, calcium 2500 mg, B6 12 mg. The vitamin A limit uses retinol, not RAE, so carotenoid-A never trips it.

## Glycemic index, fermentation, and the food matrix

Shown, not scored. Implementation: `src/data/glycemic.ts`, `src/data/digestion.ts`.

Glycemic index is the ISO glucose-scale mean from Atkinson et al. 2021 (Am J Clin Nutr, doi:10.1093/ajcn/nqab233) when that paper's supplemental table gives a mean for the food and preparation. Boiled potato 73 (29 studies), mashed potato 79, instant mash 84, boiled sweet potato 46, roasted sweet potato 86, boiled lentils 16, carrots 32, full-fat milk 37, yoghurts 33. A close preparation is marked as carried over (steamed potato uses the boiled mean; canned chickpeas and kidney beans stand in for the boiled legumes). Foods under 5 g available carbohydrate per 100 g are usually untested. Glycemic load per 100 g = GI × (sugars + starch) / 100. Cooling a cooked potato drops the GI to 49 in the same tables.

A high GI is one way a meal feels spongy: glycogen binds about 3 g of water per gram (Olsson & Saltin 1970). Fermentable carbohydrate that escapes the small intestine is another (gas). Sodium is a third (water outside the cells). They are not one score.

Lactose grams come from the nutrient database. Other FODMAP classes (legume GOS, mushroom mannitol, firm tofu low) follow the Monash University public food list. Their laboratory gram values are not copied.

The GI is the food eaten alone. Fat, protein, and acid in the same meal slow gastric emptying (Jenkins et al. 1981). The food matrix changes absorption (Parada & Aguilera 2007). It does not make every natural molecule fully used or every isolated one inert: supplemental folic acid is counted as 1.7 times food folate (IOM 1998).

Lactase (Enattah et al. 2002) and AMY1 copy number (Perry et al. 2007) change how the same food is digested. Food4Me found that advice fitted to the person beat generic advice, and that adding genotype did not clearly beat diet and phenotype (Celis-Morales et al. 2017). The app does not sell a metabolism type.

## Exposure mentions and E-numbers

Shown, not scored. Implementation: `src/data/exposure.ts`. A mention is attached only when a published source ties the substance to the food class or the preparation. No concentration is filled in.

Fluoride is built into bone and tooth mineral; the adult upper level is 7 mg/day and the main sources are water and tea, which this catalog does not measure (EFSA 2013). Glyphosate is tagged on field crops with both the IARC Group 2A classification and the 2023 EU renewal, and without a milligram value. Long-chain PFAS bind albumin, are not metabolised, and have half-lives of years (EFSA 2020; group TWI 4.4 ng/kg per week); fish, eggs, and industrially packaged foods get the mention. Hydrophobic contaminants partition into body fat and can adsorb to plastic; WHO 2022 did not find a measured health risk from dietary microplastics at the exposures then estimated. Acrylamide is tagged on dry, hot starch (frying, baking, roasting, instant drying), not on boiling or steaming (EFSA 2015). Methylmercury is tagged on fish, cadmium on offal, seaweed and leafy crops, lead on offal.

E-numbers found in the counted Open Food Facts categories are named, including the ones that are ordinary molecules (ascorbic acid, citric acid). Codes with a separate published body note that those categories did not contain (titanium dioxide, nitrite, aspartame, BHA, tartrazine) are listed too and marked as not seen in the counts. The legal inventory remains Regulation (EC) No 1333/2008.

## Fibre / phytochemicals

```
fibreScore = clamp(fibre_g_per_100kcal / 4, 0, 1)
phyto      = 0.65 × class_baseline + 0.35 × food_index
Fibre      = 100 × (0.60×fibreScore + 0.40×phyto)
```

Animal class baseline = 0.

## Residue / contaminants (higher = safer)

```
risk = 0.28×surface + 0.18×systemic + 0.14×contact
     + 0.14×MRL_proximity + 0.16×metals + 0.10×veterinary
Residue = 100 × (1 − risk)
```

Surface map: high 0.85, medium 0.50, low 0.25, none 0.05.

## Stability / nutrient loss (higher = more stable, less lost)

```
sensitivity = 0.28×water_soluble + 0.18×cut + 0.18×heat
            + 0.18×oxygen_light + 0.18×(1 − days/21)
bonus = {fresh 0 | cooked 0.08 | fermented 0.22 | dried 0.28}
retention = median over {vitamin C, thiamin, folate, B6} of
            min(1, (x / dry_matter)_processed / (x / dry_matter)_home)   for NOVA 3–4 with a NOVA 1 reference
          = 1                                                            otherwise
Stable = 100 × clamp(1 − sensitivity + bonus, 0, 1) × retention
```

The reference is the first home-prepared (NOVA 1) preparation in the same group: freshly boiled potatoes for canned ones, home-made mash for instant mash, grilled sardines for canned, raw salmon for smoked. Dry matter removes the effect of water gained or lost. The median keeps one vitamin measured in a different analysis from deciding the result. Home cooking is not penalised here; its losses already lower the micro axis.

## Processing (NOVA)

```
NOVA 1 unprocessed or minimally processed (home-cooked foods stay 1)
NOVA 2 processed culinary ingredients
NOVA 3 processed: preserved with salt, sugar, oil, brine, or smoke (canned, smoked, cheese, kraut, tofu)
NOVA 4 ultra-processed: industrial formulations with non-culinary ingredients or cosmetic additives
```

Where the group depends on the product, it follows the majority of the matching Open Food Facts category (`src/data/sources/processing-evidence.json`, from `scripts/data/processing_evidence.py`). Instant mashed potatoes: 292 of 339 classified products NOVA 4 (48 of 50 in Germany), most frequent additives E471, E450, E392, E330, E304, E223. Canned potatoes: 39 of 59 classified NOVA 3, additives E300, E509, E223.

## Composite and tiers

```
composite = Σ w_class,axis × axis
composite = min(composite, 34.9)  if NOVA 4      # ultra-processed stays in tier D
tier = S≥80 | A≥65 | B≥50 | C≥35 | D
```

Weights live in `src/data/classWeights.ts` and must sum to 1. Within-class rank is `classRank` / `classSize`.

## Class-specific columns

Extra 0–100 columns (folate density, SAA adequacy, EPA+DHA, analogue B12, etc.) are defined in `src/scoring/extras.ts`. They do not replace the seven core axes. Creatine (full at 400 mg/100 g), glucosinolates (100 mg/100 g), and ergothioneine (10 mg/100 g) now read the sourced compound index; a food without an analysis shows —.

## Bioactive compounds (shown, not scored)

`src/data/bioactives.ts` holds mg per 100 g from published analyses, keyed by food group with per-food overrides where a source measured the cooked food. Every value names the tissue and state measured and its source; "not detected" means an analysis found none, "not expected" means the compound does not occur in that kind of food (muscle compounds in plants, glucosinolates outside the cabbage family), and "no data" means no analysis was found. Ergothioneine is stored per gram dry weight and scaled with each food's water content.

| Compound | Sources |
| --- | --- |
| Creatine | Balsom et al. 1994 (fish), Kulczyński et al. 2019 (beef, lamb, pork, heart, liver), Elbir & Oz 2021 (chicken) |
| Taurine | Laidlaw et al. 1990 (raw and cooked meat, dairy, 48 plant foods: not detected), Kulczyński et al. 2019 (liver, salmon, cod, lamb) |
| Carnosine, anserine | Szerdahelyi et al. 2020 (beef, pork, chicken, turkey), Mori et al. 2015 (lamb; not detected in chicken and pork liver, chicken heart), Kulczyński et al. 2019 (salmon, sardine) |
| Coenzyme Q10 | Pravst et al. 2010 |
| L-carnitine (free) | Demarquoy et al. 2004 |
| Ergothioneine | Kalaras et al. 2017 |
| Glucosinolates | McNaughton & Marks 2003 (median across studies; cooked values where measured) |
