import { RichText } from "../components/RichText";
import { BODY_STORAGE, WEAVER_1999, calciumStudyRows } from "../data/absorption";
import { BIOACTIVE_SOURCES, shortCitation, sourceLink } from "../data/bioactives";
import { foodsInGroup } from "../data/catalog";
import { CLASS_WEIGHTS } from "../data/classWeights";
import {
  ALA_TO_DHA_EFFICIENCY,
  ALA_TO_EPA_EFFICIENCY,
  BETA_CAROTENE_TO_RAE,
  DATASET_VERSION,
  DENSITY_REF_UNITS,
  DENSITY_REFS,
  DENSITY_SATURATION_PCT_DV,
  DV_REFERENCE_ABSORPTION,
  FAO_2013_ADULT_MG_PER_G,
  HEME_SHARE_OF_MIXED_IRON,
  IRON_ABSORPTION,
  LAST_VERIFIED,
  OTHER_CAROTENOID_TO_RAE,
  UPPER_LIMITS,
  ZINC_ABSORPTION,
} from "../data/coefficients";
import { PROCESSING_EVIDENCE } from "../data/processing";
import { DATASETS, SOURCE_DBS } from "../data/sources/snapshot";
import { BODY_STORE_LABELS, MICRO_LABELS } from "../i18n/labels";
import { foodName } from "../i18n/locale";
import { useLocale } from "../i18n/LocaleContext";
import { ULTRA_PROCESSED_CEILING } from "../scoring/tiers";
import { FOOD_CLASSES, MICRO_NUTRIENTS } from "../scoring/types";

function coefficient(value: number): string {
  return String(Number(value.toPrecision(3)));
}

function percent(fraction: number): number {
  return Math.round(fraction * 1000) / 10;
}

export function MethodPage() {
  const { t, locale, localize } = useLocale();
  const m = t.method;

  return (
    <main>
      <h1>{m.title}</h1>
      <p className="lede">
        <RichText text={m.lede(DATASET_VERSION, LAST_VERIFIED)} />
      </p>

      <section className="panel">
        <h2>{m.dataHeading}</h2>
        <p>{m.dataPrimary}</p>
        <p>
          <RichText text={m.dataScript} />
        </p>
        <p>{m.dataMissing}</p>
        <p>{m.dataPreparation}</p>
        <ul className="muted">
          {SOURCE_DBS.map((db) => (
            <li key={db}>
              {DATASETS[db].citation} ({DATASETS[db].license})
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>{m.frameHeading}</h2>
        <p>{m.frameBenefits}</p>
        <p>{m.frameBurdens}</p>
        <p>{m.frameComposite}</p>
      </section>

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
            hemeSharePct: Math.round(HEME_SHARE_OF_MIXED_IRON * 100),
          })}
        </p>
        <p>
          {m.microAvailability({
            iron: percent(DV_REFERENCE_ABSORPTION.iron),
            zinc: percent(DV_REFERENCE_ABSORPTION.zinc),
            calcium: percent(DV_REFERENCE_ABSORPTION.calcium),
          })}
        </p>
        <div className="matrix-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th>{m.calciumTable.studied}</th>
                <th>{m.calciumTable.absorption}</th>
                <th>{m.calciumTable.usedFor}</th>
              </tr>
            </thead>
            <tbody>
              {calciumStudyRows().map((row) => (
                <tr key={row.studiedFood.en}>
                  <td>{localize(row.studiedFood)}</td>
                  <td className="mono">{percent(row.fraction)} %</td>
                  <td>
                    {[
                      ...row.classes.map((foodClass) => t.classes[foodClass]),
                      ...row.groups.map(({ group, carriedOver }) => {
                        const [first] = foodsInGroup(group);
                        const label = first ? foodName(first, locale).split(",")[0] : group;
                        return carriedOver ? `${label}*` : label;
                      }),
                    ].join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted">
          {m.calciumNote}{" "}
          <a href={`https://doi.org/${WEAVER_1999.doi}`} target="_blank" rel="noreferrer">
            {WEAVER_1999.citation}
          </a>
        </p>
        <p>
          {m.microRae(coefficient(BETA_CAROTENE_TO_RAE), coefficient(OTHER_CAROTENOID_TO_RAE))}
        </p>
        <p>
          <RichText text={m.microDensity(DENSITY_SATURATION_PCT_DV)} />
        </p>
        <p>{m.microUpperLimit}</p>
        <div className="matrix-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th>{m.microTable.nutrient}</th>
                <th>{m.microTable.dailyValue}</th>
                <th>{m.microTable.upperLimit}</th>
              </tr>
            </thead>
            <tbody>
              {MICRO_NUTRIENTS.map((nutrient) => {
                const limit = UPPER_LIMITS[nutrient];
                return (
                  <tr key={nutrient}>
                    <td>{localize(MICRO_LABELS[nutrient])}</td>
                    <td className="mono">
                      {DENSITY_REFS[nutrient]} {DENSITY_REF_UNITS[nutrient]}
                    </td>
                    <td className="mono">{limit === undefined ? "—" : `${limit} ${DENSITY_REF_UNITS[nutrient]}`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
        <p>{m.hormonesNote}</p>
      </section>

      <section className="panel">
        <h2>{m.degradationHeading}</h2>
        <p className="mono">
          sensitivity = 0.28×water_soluble_load + 0.18×cut + 0.18×heat + 0.18×O₂/light + 0.18×perish;
          score = 100 × clamp(1 − sensitivity + stability_bonus) × retention; retention = median(min(1,
          (x/DM)_processed / (x/DM)_home)) over vitamin C, thiamin, folate, B6 for NOVA 3–4, else 1
        </p>
        <p>{m.degradationNote}</p>
      </section>

      <section className="panel">
        <h2>{m.compositeHeading}</h2>
        <p className="mono">
          composite = Σ (w_class,axis × axis_score); tier S≥80, A≥65, B≥50, C≥35, else D; NOVA 4 → min(composite,{" "}
          {ULTRA_PROCESSED_CEILING})
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

      <section className="panel">
        <h2>{m.processingHeading}</h2>
        <p>{m.processingGroups}</p>
        <p>{m.processingCap(String(ULTRA_PROCESSED_CEILING))}</p>
        <p>
          <RichText text={m.processingEvidence} />
        </p>
        <p>{m.processingSulfite}</p>
        <p className="muted">
          {PROCESSING_EVIDENCE.source.attribution} ({PROCESSING_EVIDENCE.source.license}), {PROCESSING_EVIDENCE.retrieved}
        </p>
      </section>

      <section className="panel">
        <h2>{m.storageHeading}</h2>
        <p>{m.storageNutrients}</p>
        <div className="matrix-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th>{m.storageTable.nutrient}</th>
                <th>{m.storageTable.store}</th>
                <th>{m.storageTable.site}</th>
              </tr>
            </thead>
            <tbody>
              {MICRO_NUTRIENTS.map((nutrient) => (
                <tr key={nutrient}>
                  <td>{localize(MICRO_LABELS[nutrient])}</td>
                  <td>{localize(BODY_STORE_LABELS[BODY_STORAGE[nutrient].store])}</td>
                  <td className="muted">{localize(BODY_STORAGE[nutrient].site)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>{m.storageContaminantsLead}</p>
        <ul>
          {m.storageContaminants.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>{m.bioactivesHeading}</h2>
        <p>{m.bioactivesNote}</p>
        <ul className="muted">
          {Object.entries(BIOACTIVE_SOURCES).map(([id, source]) => {
            const href = sourceLink(source);
            return (
              <li key={id}>
                <strong>{shortCitation(source)}</strong>: {source.citation}
                {href ? (
                  <>
                    {" "}
                    <a href={href} target="_blank" rel="noreferrer">
                      {source.doi ? `doi:${source.doi}` : t.source.link}
                    </a>
                  </>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
