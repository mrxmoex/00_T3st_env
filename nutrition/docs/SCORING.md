# Scoring formulas

All axis scores are **0–100** unless noted. Implementation: `nutrition/src/scoring/`.

## 1. EAA completeness + digestibility

**Biological basis:** Plant proteins are often incomplete (limiting amino acids); animal proteins are generally complete. Digestibility adjusted via PDCAAS/DIAAS-style coefficients.

```
limiting_ratio = min(AA_i / ref_i) for essential amino acids i
completeness = clamp(limiting_ratio, 0, 1)   // plants typically < 1

digestibility =
  animal complete protein → diaasCoefficient (default 0.95–1.0)
  plant → pdcaasCoefficient (legume ~0.6–0.75, leafy ~0.4–0.6)

eaaCompletenessDigestibility = 100 × completeness × digestibility
```

Animal muscle/fish/eggs with `completeness = 1` and high DIAAS cap near 100. Legumes score mid-tier; leafy greens low on this axis alone.

## 2. EFA / glyceride profile

**First-class axis** for omega balance, EPA/DHA vs ALA, saturation.

```
omega_score = 100 × exp(-|log(ω6:ω3) - log(target)|)   // target ratio ~4:1
epa_dha_bonus = min(30, (EPA+DHA_g) × 15)              // animal/algae advantage
ala_only_cap = kingdom === plant ? min(omega_score, 55) : omega_score
sat_penalty = min(25, max(0, (SFA_g - 5) × 2))

efaGlycerideProfile = clamp(ala_only_cap + epa_dha_bonus - sat_penalty, 0, 100)
```

## 3. Carbohydrate type (active vs passive)

Active carbs (starch + sugars) scored separately from passive (fibre counted in axis 5).

```
active_g = starch_g + sugars_g
passive_g = fibre_g
active_ratio = active_g / (active_g + passive_g + 1)

// Lower active dominance → higher score (except legumes where starch is structural)
carbohydrateType = 100 × (1 - active_ratio × legume_starch_factor)
legume_starch_factor = division === legumes ? 0.7 : 1.0
```

## 4. Micronutrient density + bioavailability

Per-100 kcal density for iron, zinc, B12, folate, retinol/carotenoids, with bioavailability multipliers.

```
micro_sum = Σ (nutrient_per_100kcal × bioavailability_coeff × importance_weight)

bioavailability examples:
  non-heme iron × 0.15 (phytate high → × 0.08)
  heme iron × 0.25
  plant zinc × 0.3 (phytate-bound)
  animal zinc × 0.4
  carotenoid vit A × 0.12 (vs retinol × 1.0)

micronutrientDensity = clamp(micro_sum / reference_max × 100, 0, 100)
```

B12, creatine, taurine, carnosine only contribute on animal divisions.

## 5. Fibre / phytochemical load

```
fibre_score = min(60, fibre_g × 6)
phyto_score = phytochemicalIndex × 40   // class-specific 0–1 index
fibrePhytochemical = clamp(fibre_score + phyto_score, 0, 100)
```

Leafy greens, cruciferous, algae rank high; muscle meat low.

## 6. Residue / contaminant risk

**Higher score = lower risk** (safer).

```
risk_index = weighted_sum(pesticide_tier, heavy_metal_tier, dioxin_tier)  // 0–100 risk
residueRisk = 100 - risk_index
```

Sourced from EU/US MRL tiers per crop (see `DATA_SOURCES.md`).

## 7. Degradation sensitivity

**Higher score = more stable** (less vitamin loss / oxidation risk).

```
ws_vitamin_risk = (vit_c + folate + b1) × cooking_loss_factor
fs_oxidation_risk = (PUFA_g) × oxidation_factor
degradationSensitivity = clamp(100 - ws_vitamin_risk - fs_oxidation_risk, 0, 100)
```

## 8. Composite + tier

Division-specific weights `w_d` (sum to 1):

```
composite = Σ (w_d,axis × axis_score)
```

Default weights differ: e.g. legumes weight EAA lower, fibre higher; fish weights EFA higher.

| Tier | Composite range |
|------|-----------------|
| S | ≥ 85 |
| A | ≥ 70 |
| B | ≥ 55 |
| C | ≥ 40 |
| D | < 40 |

## Recommendation engine guardrails

- Never label a plant-only pattern "complete protein" without fortification / pairing notes
- Flag B12, EPA/DHA, heme iron gaps for vegan filter
- Pairing suggestions (legume + grain) are informational, not score inflation
