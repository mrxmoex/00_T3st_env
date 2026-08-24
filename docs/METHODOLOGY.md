# Methodology — Du bist was du isst

Auditable scoring. Every axis is a documented function of raw quantities and
named coefficients. This document is the human-readable twin of `src/scoring/`.

**This system does not claim:**

- Equivalence between incomplete plant proteins and complete animal proteins.
- That a pure plant diet is nutritionally complete without fortification /
  supplementation (vitamin B12 is required; long-chain EPA/DHA and creatine
  are typically required or absent).
- That fibre/phytochemicals cancel missing essential animal-exclusive compounds,
  or the reverse.
- A black-box “AI nutrition score”.

Plant classes (leafy, legumes, sprouts, cruciferous/kraut, mushrooms, algae,
roots/tubers, other vegetables) are scored with **separate weights**. They are
not interchangeable.

## Data sources

Primary tables:

- USDA FoodData Central (FDC) — proximate, amino acids, fatty acids, micros.
- FAO/WHO/UNU protein quality (2007 amino-acid scoring pattern; 2013 DIAAS
  recommendation).
- EFSA Dietary Reference Values and iron/zinc/vitamin A bioavailability opinions.
- WHO/FAO human vitamin and mineral requirements.
- EU and US MRL frameworks plus published residue-monitoring summaries (EFSA
  annual reports; USDA PDP) for the residue axis.
- Bioavailability meta-analyses for heme vs non-heme iron, phytate–zinc, and
  carotenoid → retinol conversion.

Each food lists FDC IDs or literature citations. Where a published DIAAS is
unavailable, the record is tagged `estimated` and the UI shows that flag.

Catalog version and last verification date: `src/data/manifest.ts`.

## FAO/WHO 2007 adult amino-acid scoring pattern

mg/g protein:

| His | Ile | Leu | Lys | SAA (Met+Cys) | AAA (Phe+Tyr) | Thr | Trp | Val |
|----:|----:|----:|----:|--------------:|--------------:|----:|----:|----:|
| 15 | 30 | 59 | 45 | 22 | 38 | 23 | 6 | 39 |

Source: WHO/FAO/UNU 2007, Protein and amino acid requirements in human nutrition.

## Axis 1 — Essential amino acid completeness + digestibility

For each indispensable amino acid (or sulphur/aromatic pair):

```
ratio_i = (mg amino acid / g protein) / pattern_i
uncappedAAS = min(ratio_i)
completeness = min(1, uncappedAAS)
```

`completeness = 1` means the food meets every adult pattern minimum — a
**complete** protein. Values below 1 mean a limiting amino acid. Typical
limiting residues: lysine (cereals), sulphur amino acids (legumes), tryptophan
or lysine (some leaves). Animal muscle, eggs, dairy, and most fish meet the
pattern.

Digestibility:

```
quality = published DIAAS or PDCAAS (fraction, may exceed 1.0 for DIAAS)
digest = min(1, quality)          # PDCAAS-style cap for the 0–100 axis
surplus = max(0, min(quality, 1.18) - 1)   # DIAAS > 100
eaaAxis = 100 * completeness * digest + 8 * (surplus / 0.18)
eaaAxis = clamp(eaaAxis, 0, 100)
```

DIAAS above 100 can add at most 8 points, and only if the protein is already
complete. An incomplete protein cannot be rescued by a high digestibility
coefficient. Plant and animal scores are **not** min-max normalised against
each other.

PDCAAS is faecal and capped at 1.0 by definition; DIAAS is ileal and may
exceed 1.0. The method is stored and displayed.

## Axis 2 — Essential fatty acid / glyceride profile

Inputs per 100 g: SFA, MUFA, PUFA, ALA, EPA, DHA, LA, AA, optional odd-chain
and conjugated linoleic acid (CLA).

ALA → long-chain n-3 conversion is inefficient. Coefficient
`ALA_TO_LC_N3 = 0.08` (≈5–10% to EPA; DHA conversion is lower; 8% is a mid
estimate and is **flagged** whenever applied).

```
n3_effective = EPA + DHA + ALA * ALA_TO_LC_N3
n6 = LA + AA
ratio = n6 / max(n3_effective, 0.001)
```

Score components (0–100 each), then weighted:

- Long-chain n-3 presence (EPA+DHA): largest distinctive credit. Algae and fatty
  fish score here; flax/walnut credit only the converted ALA fraction.
- n-6/n-3 effective ratio: applied when PUFA load is meaningful (≥ 0.4 g/100 g).
  Very-low-PUFA fats (typical muscle trim) are not punished for an unstable ratio.
- Glyceride mix: MUFA share 0.25–0.55 is treated as compositionally ordinary;
  very high PUFA adds an oxidation-awareness penalty (not a moral score).
- Odd-chain + CLA: modest documented credit for ruminant fat (composition, not
  a health claim).
- Essential FA present: LA and/or n-3 above trace. Ruminant fat can score in
  the middle of the axis without EPA/DHA; it cannot match fatty fish.

Very-low-fat foods (total fat < 1 g/100 g) receive a **neutral 48**, not a
penalty: they are not fat sources.

## Axis 3 — Carbohydrate type

Active carbohydrate = sugars + max(0, starch − resistant starch).
Passive carbohydrate = fibre + resistant starch.

These occupy different metabolic positions. They are never summed into “total
carbs are carbs”.

```
if active + passive < 1 g / 100 g:
  carbAxis = 50   # animal foods: not a carbohydrate vehicle; neutral + flagged
else:
  passiveShare = passive / (active + passive)
  carbAxis = clamp(28 + 4.2 * passive + 22 * passiveShare - 0.85 * active, 0, 100)
```

Leafy tissue (high fibre, low sugar) scores high. Boiled potato (high digestible
starch) scores lower than cooled potato with resistant starch. Legumes sit
between. Sweet fruit-like vegetables with sugar and little fibre score down.

## Axis 4 — Micronutrient density × bioavailability

Amounts are converted to a 200 kcal basis, then adjusted:

| Nutrient | Form / context | Coefficient | Rationale |
|---|---|---|---|
| Iron | heme | 1.00 | Reference absorption class |
| Iron | non-heme | 0.35 | Lower, phytate/polyphenol-sensitive |
| Zinc | animal / low-phytate | 1.00 | Reference |
| Zinc | phytate-bound | 0.40 | Phytate chelation |
| Vitamin A | preformed retinol | 1.00 | Reference |
| Vitamin A | carotenoid RAE | 0.70 **additional** | RAE already uses 12:1 / 24:1; extra factor for conversion variance |
| B12 | animal | 1.00 | Bioactive cobalamin |
| B12 | unfortified plant / algal analog | 0.00 | Analogs are often inactive in humans |
| Iodine | algae / seafood | 1.00 | Content varies; amount still used |
| Folate, C, D, Ca, Se | — | 1.00 | No extra form penalty in v1 |

Adult reference values (used only as a density denominator, not as advice):

Iron 8 mg, zinc 11 mg, VA 900 µg RAE, B12 2.4 µg, folate 400 µg DFE,
vitamin C 90 mg, vitamin D 15 µg, calcium 1000 mg, selenium 55 µg,
iodine 150 µg.

```
adj_i = amount_per_100g * coefficient_i
per_200kcal_i = adj_i * (200 / kcal_per_100g)
coverage_i = min(1.25, per_200kcal_i / ref_i)
microAxis = 100 * weightedMean(coverage)
```

Weights emphasise iron, zinc, B12, vitamin A, iodine (nutrients whose **form**
differs by kingdom). Vitamin C and folate still count.

## Axis 5 — Fibre / phytochemical load

```
fibrePart = min(100, fibre_g * 8)
phytoPart = phytochemicalLoad          # 0–100 literature-informed index
fibrePhytoAxis = 0.62 * fibrePart + 0.38 * phytoPart
```

Animal foods score near zero on this axis. That is a real plant advantage.
It is not used to invent protein completeness.

`phytochemicalLoad` is a documented ordinal index (glucosinolates, polyphenols,
carotenoids, ergothioneine, etc.), not a mass-spectrometry assay. Flagged as
`index`.

## Axis 6 — Residue / contaminant risk

Higher axis value = lower estimated risk.

```
surface = { low: 0.22, medium: 0.50, high: 0.90 }[surfaceAreaClass]
risk = 0.34 * surface
      + 0.24 * systemicRisk
      + 0.18 * contactRisk
      + 0.24 * mrlExceedanceRate
residueAxis = clamp(100 * (1 - risk), 0, 100)
```

Leafy salads: high surface area, higher monitoring detects. Smooth roots: lower
surface. Systemic herbicides/insecticides raise `systemicRisk` independent of
wash-off. Animal foods use veterinary / persistent-organic / mercury fields
instead of crop-surface defaults (fish mercury is stored as `aquaticMercuryRisk`).

This is **not** a claim that conventional produce is unsafe. It records that
residues exist, vary, and belong in the matrix.

## Axis 7 — Degradation sensitivity

Higher axis value = more post-harvest stable.

```
stress = 0.30 * waterSolubleVitaminRisk
       + 0.18 * fatSolubleOxidationRisk
       + 0.20 * cuttingSensitivity
       + 0.16 * heatSensitivity
       + 0.16 * timeFactor
timeFactor = 1 - min(1, storageDaysTypical / 21)
degradationAxis = clamp(100 * (1 - stress), 0, 100)
```

Water-soluble vitamins (C, folate, B1) degrade with time, oxygen, light,
cutting, and heat. Fat-soluble vitamins are more stable but oxidise with PUFA
and light. Fermented kraut is not scored as fresh cabbage.

## Axis 8 — Composite (efficiency–value–nutrition)

```
composite = Σ w_class[axis] * axisScore
```

Weights are **per food class** (`src/data/weights.ts`). They express what that
class is biochemically for. They do not launder a weak axis.

Examples (must sum to 1.00):

- Leafy salad: micro + fibre/phyto + residue + degradation dominate; EAA is
  honest and low-weighted because leaves are not a protein staple.
- Legumes: EAA and carb type rise; still not rescaled to dairy.
- Muscle ruminant: EAA + fat profile + bioavailable micros; fibre weight is
  small because muscle is not a fibre food — the fibre **score** remains ~0
  and is still shown.

Tiers **S / A / B / C / D** are assigned **within each class** from that class’s
composite distribution (percentile if n ≥ 4, else absolute gates). A class-S
lettuce is not claimed to be an S-tier protein.

## Exclusive compounds (reported, not a hidden 9th axis)

Creatine, taurine, carnosine, and LC EPA/DHA are animal (or algae, for EPA/DHA)
advantages. They appear on the food deep-dive and drive the recommendation
engine’s gap list. They are not silently added to the composite.

## Dietary-pattern recommendations

The engine never says a plant-only pattern is complete.

| Pattern | What it may recommend | Required disclosures |
|---|---|---|
| Plant-only | Highest-axis plants **within each plant class**; complementary EAA pairing | B12 supplementation **required**. Typical gaps: bioactive LC EPA/DHA (algae oil, not automatically spirulina), creatine, taurine, carnosine, heme iron, preformed retinol, high-DIAAS protein |
| Animal-inclusive | Animal staples + plant classes for fibre/phyto | Fibre/phytochemical gap if animal-only; residue notes for large predatory fish |
| Hybrid | Pair high-DIAAS animal protein / organs / eggs with high-fibre plant classes | Same biochemical limits; pairing ≠ equivalence |

## Reproducibility

```
npm test                 # formula unit tests
```

Given the same `formulaVersion` and catalog, scores are deterministic.
Export JSON includes `formulaVersion`, `dataVersion`, and per-axis breakdown
with applied coefficients.
