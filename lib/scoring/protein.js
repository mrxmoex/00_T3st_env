import { FAO_2013_DIAAS_REF_MG_PER_G } from "./constants.js";
import { clamp, num, round } from "./math.js";

function eaaRatios(eaa, digestibility) {
  const saa = num(eaa.met) + num(eaa.cys);
  const aaa = num(eaa.phe) + num(eaa.tyr);
  const digestible = {
    his: num(eaa.his) * digestibility,
    ile: num(eaa.ile) * digestibility,
    leu: num(eaa.leu) * digestibility,
    lys: num(eaa.lys) * digestibility,
    saa: saa * digestibility,
    aaa: aaa * digestibility,
    thr: num(eaa.thr) * digestibility,
    trp: num(eaa.trp) * digestibility,
    val: num(eaa.val) * digestibility,
  };
  const ratios = {};
  let limitingAA = "his";
  let minRatio = Infinity;
  for (const [aa, ref] of Object.entries(FAO_2013_DIAAS_REF_MG_PER_G)) {
    const ratio = digestible[aa] / ref;
    ratios[aa] = round(ratio, 4);
    if (ratio < minRatio) {
      minRatio = ratio;
      limitingAA = aa;
    }
  }
  return { digestible, ratios, minRatio, limitingAA, saa, aaa };
}

function mapDiaasToScore(diaas) {
  if (diaas >= 120) return 100;
  if (diaas >= 100) return 85 + ((diaas - 100) * 15) / 20;
  return clamp(diaas * 0.85, 0, 84.9);
}

/**
 * Plant proteins are scored as incomplete even when an amino-acid profile
 * looks numerically adequate: digestibility and limiting-AA reality differ
 * from complete animal proteins. This function never emits equivalence.
 */
export function scoreProtein(food) {
  const protein = food.protein ?? {};
  const eaa = protein.eaaMgPerGProtein ?? {};
  const ileal = clamp(num(protein.ilealDigestibility, 0.7), 0, 1);
  const fecal = clamp(num(protein.fecalDigestibility, ileal), 0, 1);
  const digested = eaaRatios(eaa, ileal);
  const undigested = eaaRatios(eaa, 1);
  const diaas = round(100 * digested.minRatio, 2);
  const pdcaasUncapped = fecal * undigested.minRatio;
  const pdcaas = round(Math.min(1, pdcaasUncapped), 4);
  const animal = food.kingdom === "animal";
  const profileAdequate = undigested.minRatio >= 1;
  const complete = animal && profileAdequate;
  const kind = animal
    ? complete
      ? "complete_animal"
      : "incomplete_animal"
    : "incomplete_plant";

  return {
    kind,
    complete,
    limitingAA: digested.limitingAA,
    diaas,
    pdcaas,
    ilealDigestibility: ileal,
    fecalDigestibility: fecal,
    ratios: digested.ratios,
    saaMgPerG: round(digested.saa, 2),
    aaaMgPerG: round(digested.aaa, 2),
    score: round(mapDiaasToScore(diaas), 2),
    claims: {
      proteinEquivalentToAnimal: false,
      proteinNote: animal
        ? "Animal protein is complete (all nine EAAs in a usable pattern) with high ileal digestibility. DIAAS is not capped; PDCAAS is capped at 1.0."
        : "Plant/fungal/algal protein is incomplete or digestibility-limited. A high lysine score does not cancel a low SAA score. Not equivalent to complete animal protein.",
    },
    formula: "DIAAS = 100 × min(EAA_i × ileal_digestibility / FAO2013_ref_i); PDCAAS = min(1, fecal_digestibility × min(EAA_i / ref_i))",
  };
}
