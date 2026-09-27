import { RichText } from "../components/RichText";
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
import { useLocale } from "../i18n/LocaleContext";
import { FOOD_CLASSES } from "../scoring/types";

function coefficient(value: number): string {
  return String(Number(value.toPrecision(3)));
}

export function MethodPage() {
  const { t } = useLocale();
  const m = t.method;

  return (
    <main>
      <h1>{m.title}</h1>
      <p className="lede">
        <RichText text={m.lede(DATASET_VERSION, LAST_VERIFIED)} />
      </p>

      <section className="panel">
        <h2>{m.eaaHeading}</h2>
        <p>
          {m.eaaPattern} His {FAO_2013_ADULT_MG_PER_G.his}, Ile {FAO_2013_ADULT_MG_PER_G.ile}, Leu{" "}
          {FAO_2013_ADULT_MG_PER_G.leu}, Lys {FAO_2013_ADULT_MG_PER_G.lys}, SAA{" "}
          {FAO_2013_ADULT_MG_PER_G.saa}, AAA {FAO_2013_ADULT_MG_PER_G.aaa}, Thr{" "}
          {FAO_2013_ADULT_MG_PER_G.thr}, Trp {FAO_2013_ADULT_MG_PER_G.trp}, Val{" "}
          {FAO_2013_ADULT_MG_PER_G.val}.
        </p>
        <p className="mono">{m.eaaRatios}</p>
        <p className="mono">{m.eaaAxis}</p>
        <p>{m.eaaNote}</p>
      </section>

      <section className="panel">
        <h2>{m.efaHeading}</h2>
        <p className="mono">
          {m.efaConversion(coefficient(ALA_TO_DHA_EFFICIENCY), coefficient(ALA_TO_EPA_EFFICIENCY))}
        </p>
        <p className="mono">{m.efaAxis}</p>
        <p>{m.efaFatFree}</p>
      </section>

      <section className="panel">
        <h2>{m.carbHeading}</h2>
        <p className="mono">{m.carbSplit}</p>
        <p className="mono">
          activeScore = 100 × (1 − clamp(active_g_per_100kcal / 15));
          passiveScore = 100 × clamp(passive_g_per_100kcal / 8)
        </p>
        <p>{m.carbCombined}</p>
      </section>

      <section className="panel">
        <h2>{m.microHeading}</h2>
        <p>
          {m.microAbsorption({
            heme: IRON_ABSORPTION.heme,
            nonhemeBase: IRON_ABSORPTION.nonhemeBase,
            nonhemeWithVitaminC: IRON_ABSORPTION.nonhemeWithVitaminC,
            nonhemeHighPhytate: IRON_ABSORPTION.nonhemeHighPhytate,
            zincAnimal: ZINC_ABSORPTION.animal,
            zincPhytate: ZINC_ABSORPTION.phytateBound,
            zincLowPhytate: ZINC_ABSORPTION.lowPhytatePlant,
          })}
        </p>
        <p>
          {m.microRae(coefficient(BETA_CAROTENE_TO_RAE), coefficient(OTHER_CAROTENOID_TO_RAE))}
        </p>
        <p>
          <RichText
            text={m.microDensity({
              ironMg: DENSITY_REFS.ironMg,
              zincMg: DENSITY_REFS.zincMg,
              raeUg: DENSITY_REFS.vitaminARaeUg,
              b12Ug: DENSITY_REFS.vitaminB12Ug,
            })}
          />
        </p>
      </section>

      <section className="panel">
        <h2>{m.fibreHeading}</h2>
        <p className="mono">
          fibreScore = clamp((fibre_g / kcal) × 100 / 4); phyto = 0.65 × class_baseline + 0.35 ×
          food_index; axis = 100 × (0.60 × fibreScore + 0.40 × phyto)
        </p>
        <p>{m.fibreNote}</p>
      </section>

      <section className="panel">
        <h2>{m.residueHeading}</h2>
        <p className="mono">
          risk = 0.28×surface + 0.18×systemic + 0.14×contact + 0.14×MRL_proximity + 0.16×metals +
          0.10×veterinary; score = 100 × (1 − risk)
        </p>
        <p>{m.residueNote}</p>
      </section>

      <section className="panel">
        <h2>{m.degradationHeading}</h2>
        <p className="mono">
          sensitivity = 0.28×water_soluble_load + 0.18×cut + 0.18×heat + 0.18×O₂/light + 0.18×perish;
          score = 100 × clamp(1 − sensitivity + stability_bonus)
        </p>
        <p>{m.degradationNote}</p>
      </section>

      <section className="panel">
        <h2>{m.compositeHeading}</h2>
        <p className="mono">
          composite = Σ (w_class,axis × axis_score); tier S≥80, A≥65, B≥50, C≥35, else D
        </p>
        <p>{m.compositeNote}</p>
        <div className="matrix-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th>{t.table.class}</th>
                <th>{t.axesShort.eaa}</th>
                <th>{t.axesShort.efa}</th>
                <th>{t.axesShort.carb}</th>
                <th>{t.axesShort.micro}</th>
                <th>{t.axesShort.fibre}</th>
                <th>{t.axesShort.residue}</th>
                <th>{t.axesShort.degradation}</th>
              </tr>
            </thead>
            <tbody>
              {FOOD_CLASSES.map((foodClass) => {
                const w = CLASS_WEIGHTS[foodClass];
                return (
                  <tr key={foodClass}>
                    <td>{t.classes[foodClass]}</td>
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
