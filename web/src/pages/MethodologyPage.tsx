import { DATASET_META } from "../catalog/dataset-meta.ts";
import { COEFFICIENTS } from "../catalog/coefficients.ts";
import { SOURCES } from "../catalog/sources.ts";
import { WHO_FAO_ADULT_MG_PER_G_PROTEIN } from "../catalog/who-fao-pattern.ts";

export function MethodologyPage() {
  return (
    <main>
      <div className="page-head">
        <div>
          <h2>Methodology</h2>
          <p className="lede">
            Version {DATASET_META.version}, last verified {DATASET_META.lastVerified}. Every axis
            is an explicit function of the raw table plus named coefficients. There are no model
            scores.
          </p>
        </div>
      </div>

      <section className="cannot">
        <h3>What this system will not claim</h3>
        <ul>
          <li>It will not treat plant and animal proteins as equivalent, even when a soy isolate DIAAS approaches 1.0.</li>
          <li>It will not label a plant-only pattern complete without required B12 fortification/supplementation and without naming EPA/DHA, creatine, taurine, and carnosine gaps.</li>
          <li>It will not treat non-heme iron, phytate-bound zinc, or carotenoid vitamin A as equal to heme iron, animal zinc, or preformed retinol.</li>
          <li>It will not treat ALA as EPA/DHA. Conversion coefficients are {COEFFICIENTS.alaToEpa} and {COEFFICIENTS.alaToDha}.</li>
          <li>It will not collapse algae, mushrooms, sprouts, fermented kraut, legumes, or leafy salads into one “plant” score.</li>
          <li>It will not diagnose, prescribe, or replace clinical nutrition advice. Residue scores are commodity-class risk bands, not a claim that a serving exceeds an MRL.</li>
          <li>It will not invent a nutrient amount without a flag. Estimates are labelled estimate or literature.</li>
        </ul>
      </section>

      <section className="panel">
        <h3>1. Essential amino acids + digestibility</h3>
        <p>
          Adult scoring pattern (mg/g protein), WHO/FAO/UNU 2007 as used in FAO 2013: His{" "}
          {WHO_FAO_ADULT_MG_PER_G_PROTEIN.his}, Ile {WHO_FAO_ADULT_MG_PER_G_PROTEIN.ile}, Leu{" "}
          {WHO_FAO_ADULT_MG_PER_G_PROTEIN.leu}, Lys {WHO_FAO_ADULT_MG_PER_G_PROTEIN.lys}, SAA{" "}
          {WHO_FAO_ADULT_MG_PER_G_PROTEIN.saa}, AAA {WHO_FAO_ADULT_MG_PER_G_PROTEIN.aaa}, Thr{" "}
          {WHO_FAO_ADULT_MG_PER_G_PROTEIN.thr}, Trp {WHO_FAO_ADULT_MG_PER_G_PROTEIN.trp}, Val{" "}
          {WHO_FAO_ADULT_MG_PER_G_PROTEIN.val}.
        </p>
        <pre className="formula">{`AAS_i = (AA_i mg per g food protein) / (WHO-FAO adult mg/g)_i
chemicalScore = min(min_i(AAS_i), ${COEFFICIENTS.aminoAcidScoreCap})
diaasLike = publishedDIAAS ?? chemicalScore × ilealDigestibility
eaaScore = clamp(diaasLike × 100, 0, 100)

complete iff kingdom = animal
        AND ilealDigestibility ≥ ${COEFFICIENTS.completeDigestibilityFloor}
        AND (every AAS_i ≥ 1  OR  publishedDIAAS ≥ ${COEFFICIENTS.completeDiaasFloor})
Plant kingdom ⇒ incomplete, always.
Published DIAAS is used when an FDC amino-acid panel is incomplete
(e.g. cooked ground beef tryptophan under-reported at 0.094 g/100 g).`}</pre>
      </section>

      <section className="panel">
        <h3>2. Essential fatty acids / glyceride profile</h3>
        <pre className="formula">{`n3Quality: EPA+DHA tiers (0.5 / 0.1 / 0.05 g) beat ALA.
implied EPA from ALA = ALA × ${COEFFICIENTS.alaToEpa}
n6/n3 ratio score uses linoleic / (ALA+EPA+DHA)
glyceride = 0.55·MUFA_share + 0.45·SFA_moderation
special = CLA + odd-chain (ruminant/dairy estimates)
stability = 1 − PUFA_share × 0.65
efa = 100 × (0.35 n3 + 0.25 ratio + 0.20 glyceride + 0.10 special + 0.10 stability)`}</pre>
      </section>

      <section className="panel">
        <h3>3. Carbohydrate type</h3>
        <pre className="formula">{`active = sugars + max(0, starch − resistantStarch)
passive = fibre + resistantStarch
If animal and total carb ≈ 0: score = 64 (no glycemic load; missing fibre is not a defect here)
else score = 100 × (0.55·(1 − active/${COEFFICIENTS.activeCarbSatG}) + 0.45·passive/${COEFFICIENTS.passiveCarbSatG})
Starch is derived as total − sugars − fibre unless measured.`}</pre>
      </section>

      <section className="panel">
        <h3>4. Micronutrient density + bioavailability</h3>
        <pre className="formula">{`density = amount / kcal × 100
ironCoeff = hemeFraction + (1−hemeFraction)×${COEFFICIENTS.nonHemeIronVsHeme}×phytateIron
zincCoeff = phytateBound ? ${COEFFICIENTS.phytateZincVsAnimal} : 1
VACoeff = retinol 1.0 | carotenoid ${COEFFICIENTS.carotenoidMatrixCaution} (RAE already uses 12:1)
B12Coeff = active 1 | absent 0 | analog 0
term = clamp(adjustedDensity / target_per_100kcal, 0, 1.4)
microScore = mean(terms) × 100 / 1.4`}</pre>
        <p className="small muted">
          β-carotene → RAE conversion factor {COEFFICIENTS.betaCaroteneToRae}; other carotenoids{" "}
          {COEFFICIENTS.otherCarotenoidToRae}.
        </p>
      </section>

      <section className="panel">
        <h3>5. Fibre / phytochemical load</h3>
        <pre className="formula">{`Animal foods with no fibre: score = 6
else 100 × (0.50·fibre/${COEFFICIENTS.fibreSatG} + 0.50·tagScore + 0.08 if fermented)
Tags are class-specific: glucosinolates, carotenoids, fungal beta-glucan/ergothioneine, algae pigments.`}</pre>
      </section>

      <section className="panel">
        <h3>6. Residue / contaminant risk</h3>
        <pre className="formula">{`risk = 0.45·PDP_detect + 0.25·heavyMetal + 0.20·mercury + 0.10·iodineExcess
score = 100 × (1 − risk)
Higher is cleaner. Not a legal MRL verdict.`}</pre>
      </section>

      <section className="panel">
        <h3>7. Degradation sensitivity</h3>
        <pre className="formula">{`vulnerability = 0.38·waterSolubleLoad + 0.22·PUFA_ox + 0.25·waterActivity + 0.15·carotenoidLight
              + fermentAdj (−0.08 if fermented)
score = 100 × (1 − vulnerability)
Dried foods reduce the water-activity term.`}</pre>
      </section>

      <section className="panel">
        <h3>8. EVN composite and within-class tiers</h3>
        <pre className="formula">{`composite = Σ (classWeight_axis × axisScore)
Weights sum to 1 and differ by class (see src/catalog/class-weights.ts).
Fibre weight ≈ 0.02 in animal classes.

Within-class tier from rank percentile, then floors:
score < 40 → D; < 55 → at best C; S requires score ≥ 70.`}</pre>
      </section>

      <section className="panel">
        <h3>Sources</h3>
        <ul>
          {SOURCES.map((source) => (
            <li key={source.id}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.title}
              </a>
              <div className="small muted">
                {source.publisher} · accessed {source.accessed}
                {source.notes ? ` · ${source.notes}` : ""}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
