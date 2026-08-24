# Scoring formulas

All scores are 0–100 unless noted. Implementation: `lib/scoring/`. Tests: `test/scoring.test.js`.

## 1. Essential amino acid completeness + digestibility

FAO 2013 DIAAS reference (mg / g protein):

| AA | His | Ile | Leu | Lys | SAA (Met+Cys) | AAA (Phe+Tyr) | Thr | Trp | Val |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ref | 16 | 30 | 61 | 48 | 23 | 41 | 25 | 6.6 | 40 |

```
digestible_i = EAA_i (mg/g) × ileal_digestibility
ratio_i      = digestible_i / FAO2013_ref_i
DIAAS        = 100 × min(ratio_i)
limiting AA  = argmin(ratio_i)
PDCAAS       = min(1, fecal_digestibility × min(EAA_i / ref_i))
```

PDCAAS is capped at 1.0. DIAAS is not.

Axis map:

```
if DIAAS ≥ 120: score = 100
if DIAAS ≥ 100: score = 85 + 15 × (DIAAS − 100) / 20
else:           score = 0.85 × DIAAS
```

**Honesty rules**

- Animal foods with every undigested ratio ≥ 1 → `complete_animal`.
- All plant / fungal / algal foods → `incomplete_plant`, even if one limiting amino acid is close to the reference.
- `claims.proteinEquivalentToAnimal` is always `false`.
- A high lysine score never cancels a low SAA score.

## 2. Essential fatty acid / glyceride profile

```
effective_LC_n3 = EPA + DHA + 0.08 × ALA
```

0.08 is a combined ALA → EPA+DHA conversion factor (typical human conversion ~5–10% to EPA and <1% to DHA). ALA is never treated as EPA/DHA.

```
n3_quality   = clamp(effective_LC_n3 / 0.5 g, 0, 1) × 40
n6/n3 score  = 25 if ≤ 4; 18 if ≤ 10; else decaying
odd+CLA      = clamp(50 × (odd_chain + CLA), 0, 12)
balance      = MUFA share and not-excess n-6 PUFA
```

Very low-fat foods (< 1 g / 100 g) receive a mid-band structural score so “no fat” is not scored as a perfect fat profile. Ruminant odd-chain fats and CLA are credited and flagged as emerging, not as miracle lipids.

## 3. Carbohydrate type (active vs passive)

```
active  = sugars + starch − resistant_starch
passive = fibre + resistant_starch
```

If total carbohydrate < 1.5 g and active < 1 g (typical muscle/egg): score = 68 (neutral-high structural absence, not a “perfect carb” claim).

Otherwise:

```
score = 100 × (0.62 × passive/(active+passive) + 0.38 × (1 − clamp(active/40, 0, 1)))
```

## 4. Micronutrient density + bioavailability

Iron:

```
bio_iron = 0.25 × heme + nonheme_abs × non-heme
nonheme_abs = 0.08
            × 0.6 if phytate > 100 mg
            × 1.4 if vitamin C ≥ 25 mg (capped)
```

Zinc: phytate:Zn molar ratio (phytate MW 660.04, Zn MW 65.38)

| Ratio | Coefficient |
| --- | --- |
| > 15 | 0.35 |
| > 5 | 0.50 |
| else | 0.85 |

Vitamin A:

```
effective_RAE = retinol + 0.5 × (RAE − retinol)
```

The 0.5 is an extra uncertainty haircut on top of IOM 12:1 / 24:1 RAE math. Carotenoid vitamin A is not retinol.

Density is a weighted coverage of bioavailability-adjusted nutrients per 100 kcal, log-compressed to 0–100. Tissue metabolites (creatine, taurine, carnosine) add a small animal-only coverage term; their absence on plants is not “fixed” by fibre.

## 5. Fibre / phytochemical load

```
score = clamp(fibre/8, 0, 1)×50
      + clamp((polyphenols + 2×glucosinolates + unique_pigments)/80, 0, 1)×45
      + class bonuses (fermented kraut +6, mushrooms +4, algae +4)
```

Animal foods typically land below 25. That is correct. Muscle is not a fibre food.

## 6. Residue / contaminant risk

```
risk  = 0.40×pesticide + 0.35×heavy_metal + 0.25×POP
score = 100 × (1 − risk)
```

These inputs are **class-typical indices**, not a certificate of analysis for a named batch. Higher score = cleaner typical risk, not “organic certified”.

## 7. Degradation sensitivity

```
fragility = 0.35×water_soluble_vitamin_load
          + 0.25×cut_surface
          + 0.20×heat_lability
          + 0.20×PUFA_oxidation
score     = 100 × (1 − fragility)
```

Water-soluble vitamins (C, folate, many B) degrade with time, oxygen, light, cutting, and heat. Fat-soluble vitamins are more stable but oxidise, especially with high PUFA.

## 8. Composite (Efficiency-Value-Nutrition)

```
composite = Σ weight_class[axis] × score[axis]
```

Weights are in `lib/scoring/constants.js` and always sum to 1. Leafy greens are not protein-weighted. Organs are micros-weighted. Fish is EFA-weighted. Algae EFA weight is not reused for mushrooms.

## Tiers

Tiers are **within class**, never across the whole matrix.

- Absolute bands: S ≥ 82, A ≥ 68, B ≥ 52, C ≥ 36, else D.
- If a class has two or more different composites, also compute a min–max relative band (S ≥ 0.85, A ≥ 0.60, B ≥ 0.35, C ≥ 0.15, else D).
- The assigned tier is the **better** of the absolute and relative bands, so a strong food is not labelled D merely because its class has only two members.
- The class leader is raised to at least A if composite ≥ 50.
- The class trailer cannot inherit a relative S.

A “D” salad is a weak salad, not a claim that beef is “better than spinach” at being a salad.
