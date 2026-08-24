# Scoring formulas

All axes emit 0–100 unless noted. Implementation: `src/scoring/`. Tests: `src/scoring/scoring.test.ts`.

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

ALA-only foods are flagged as not equivalent to preformed EPA/DHA.

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
RAE = retinol + β-carotene/12 + other_carotenoids/24
Fe* = Fe × {heme 0.25 | nonheme 0.05 | +vit C 0.12 | high phytate 0.03 | mixed weighted}
Zn* = Zn × {animal 0.40 | low-phytate plant 0.25 | phytate 0.15}
B12*= 0 if analogue flag else B12
contrib_i = clamp( (%DV_absorbed per 100 kcal) / 20%, 0, 1 )
Micro = 100 × mean(contrib_i)
```

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

## Degradation / stability (higher = more stable)

```
sensitivity = 0.28×water_soluble + 0.18×cut + 0.18×heat
            + 0.18×oxygen_light + 0.18×(1 − days/21)
bonus = {fresh 0 | cooked 0.08 | fermented 0.22 | dried 0.28}
Stable = 100 × clamp(1 − sensitivity + bonus, 0, 1)
```

## Composite and tiers

```
composite = Σ w_class,axis × axis
tier = S≥80 | A≥65 | B≥50 | C≥35 | D
```

Weights live in `src/data/classWeights.ts` and must sum to 1. Within-class rank is `classRank` / `classSize`.

## Class-specific columns

Extra 0–100 columns (folate density, SAA adequacy, EPA+DHA, analogue B12, etc.) are defined in `src/scoring/extras.ts`. They do not replace the seven core axes.
