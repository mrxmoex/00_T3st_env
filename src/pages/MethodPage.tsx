import { CLASS_WEIGHTS } from "../data/classWeights";
import {
  ALA_TO_DHA_EFFICIENCY,
  ALA_TO_EPA_EFFICIENCY,
  BETA_CAROTENE_TO_RAE,
  DATASET_VERSION,
  DENSITY_REFS,
  FAO_2013_ADULT_MG_PER_G,
  IRON_ABSORPTION,
  LAST_VERIFIED,
  OTHER_CAROTENOID_TO_RAE,
  ZINC_ABSORPTION,
} from "../data/coefficients";
import { FOOD_CLASSES } from "../scoring/types";
import { CLASS_LABELS } from "../ui/labels";

export function MethodPage() {
  return (
    <main>
      <h1>Methodology</h1>
      <p className="lede">
        Every score is a documented function of raw tables plus coefficients. Dataset{" "}
        {DATASET_VERSION}, last verified {LAST_VERIFIED}. Formulas are implemented in{" "}
        <span className="mono">src/scoring/</span> and unit-tested.
      </p>

      <section className="panel">
        <h2>1. Essential amino acid completeness + digestibility</h2>
        <p>
          FAO 2013 adult scoring pattern (mg/g protein): His {FAO_2013_ADULT_MG_PER_G.his}, Ile{" "}
          {FAO_2013_ADULT_MG_PER_G.ile}, Leu {FAO_2013_ADULT_MG_PER_G.leu}, Lys{" "}
          {FAO_2013_ADULT_MG_PER_G.lys}, SAA {FAO_2013_ADULT_MG_PER_G.saa}, AAA{" "}
          {FAO_2013_ADULT_MG_PER_G.aaa}, Thr {FAO_2013_ADULT_MG_PER_G.thr}, Trp{" "}
          {FAO_2013_ADULT_MG_PER_G.trp}, Val {FAO_2013_ADULT_MG_PER_G.val}.
        </p>
        <p className="mono">
          ratio_i = food_i / ref_i; AAS = min(ratio_i); DIAAS = AAS × ileal digestibility;
          PDCAAS = min(1, AAS) × digestibility
        </p>
        <p className="mono">
          EAA_axis = 100 × (0.55 × min(1, AAS) + 0.30 × digestibility + 0.15 × clamp(protein_g / 20, 0, 1))
        </p>
        <p>
          Plant proteins remain incomplete when a ratio is below 1. Density prevents spinach
          protein from ranking as a protein food.
        </p>
      </section>

      <section className="panel">
        <h2>2. Essential fatty acids / glycerides</h2>
        <p className="mono">
          effective_LC_n3 = EPA + DHA + ALA × {ALA_TO_DHA_EFFICIENCY} (DHA-eq). ALA→EPA
          coefficient {ALA_TO_EPA_EFFICIENCY} is flagged, not used as EPA equivalence.
        </p>
        <p className="mono">
          EFA_axis = 100 × (0.45 × clamp(LC / 0.5) + 0.35 × n6/n3_score + 0.20 × glyceride_quality)
          + up to 10 points for odd-chain + CLA
        </p>
        <p>Fat-free foods score 45: no EFA contribution, not a fat-quality failure.</p>
      </section>

      <section className="panel">
        <h2>3. Carbohydrate type</h2>
        <p className="mono">
          active = sugars + digestible starch; passive = fibre + resistant starch
        </p>
        <p className="mono">
          activeScore = 100 × (1 − clamp(active_g_per_100kcal / 15));
          passiveScore = 100 × clamp(passive_g_per_100kcal / 8)
        </p>
        <p>
          Combined: 0.55 × passive_fraction + 0.25 × activeScore + 0.20 × (1 − sugar_fraction).
          Near-zero carb animal foods score 70 (metabolically quiet, fibre absent).
        </p>
      </section>

      <section className="panel">
        <h2>4. Micronutrient density + bioavailability</h2>
        <p>
          Iron absorption: heme {IRON_ABSORPTION.heme}, non-heme base {IRON_ABSORPTION.nonhemeBase},
          with vitamin C {IRON_ABSORPTION.nonhemeWithVitaminC}, high phytate{" "}
          {IRON_ABSORPTION.nonhemeHighPhytate}. Zinc: animal {ZINC_ABSORPTION.animal}, phytate{" "}
          {ZINC_ABSORPTION.phytateBound}, low-phytate plant {ZINC_ABSORPTION.lowPhytatePlant}.
        </p>
        <p>
          RAE = retinol + β-carotene × {BETA_CAROTENE_TO_RAE} (1/12) + other carotenoids ×{" "}
          {OTHER_CAROTENOID_TO_RAE} (1/24). Algal B12 analogues contribute 0.
        </p>
        <p>
          Each nutrient is % of a reference per 100 kcal, capped so 20% DV / 100 kcal = 1.0, then
          averaged. References: Fe {DENSITY_REFS.ironMg} mg, Zn {DENSITY_REFS.zincMg} mg, RAE{" "}
          {DENSITY_REFS.vitaminARaeUg} µg, B12 {DENSITY_REFS.vitaminB12Ug} µg, and the remaining
          listed vitamins/minerals in <span className="mono">coefficients.ts</span>.
        </p>
      </section>

      <section className="panel">
        <h2>5. Fibre / phytochemicals</h2>
        <p className="mono">
          fibreScore = clamp((fibre_g / kcal) × 100 / 4); phyto = 0.65 × class_baseline + 0.35 ×
          food_index; axis = 100 × (0.60 × fibreScore + 0.40 × phyto)
        </p>
        <p>Animal classes have baseline 0. That is composition, not a smear.</p>
      </section>

      <section className="panel">
        <h2>6. Residue / contaminant risk</h2>
        <p className="mono">
          risk = 0.28×surface + 0.18×systemic + 0.14×contact + 0.14×MRL_proximity + 0.16×metals +
          0.10×veterinary; score = 100 × (1 − risk)
        </p>
        <p>
          Higher score = lower risk. Leafy high surface area is not scored like a tuber. Fish/algae
          metals and veterinary residues are first-class, not footnotes.
        </p>
      </section>

      <section className="panel">
        <h2>7. Degradation sensitivity</h2>
        <p className="mono">
          sensitivity = 0.28×water_soluble_load + 0.18×cut + 0.18×heat + 0.18×O₂/light + 0.18×perish;
          score = 100 × clamp(1 − sensitivity + stability_bonus)
        </p>
        <p>Bonuses: cooked +0.08, fermented +0.22, dried +0.28. Fresh leafy stays labile.</p>
      </section>

      <section className="panel">
        <h2>8. Composite and tiers</h2>
        <p className="mono">
          composite = Σ (w_class,axis × axis_score); tier S≥80, A≥65, B≥50, C≥35, else D
        </p>
        <p>
          Weights are class-specific and sum to 1. Fibre is down-weighted for animal classes
          because absence is expected — the fibre axis itself still reads 0.
        </p>
        <div className="matrix-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th>Class</th>
                <th>EAA</th>
                <th>EFA</th>
                <th>Carb</th>
                <th>Micro</th>
                <th>Fibre</th>
                <th>Residue</th>
                <th>Stable</th>
              </tr>
            </thead>
            <tbody>
              {FOOD_CLASSES.map((foodClass) => {
                const w = CLASS_WEIGHTS[foodClass];
                return (
                  <tr key={foodClass}>
                    <td>{CLASS_LABELS[foodClass]}</td>
                    <td>{w.eaa}</td>
                    <td>{w.efa}</td>
                    <td>{w.carb}</td>
                    <td>{w.micro}</td>
                    <td>{w.fibre}</td>
                    <td>{w.residue}</td>
                    <td>{w.degradation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
