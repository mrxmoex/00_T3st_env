import type { SourceRef } from "../../scoring/types";

const HODGKINSON_2025_URL = "https://doi.org/10.1016/j.tjnut.2025.08.004";

/**
 * True ileal digestibility of nitrogen in growing pigs, 97 foods as people eat them.
 * Hodgkinson et al. 2022 (J Nutr 152:1635) found pig values interchangeable with adult human ones.
 */
export function pigIleal(note: string): SourceRef {
  return { label: "Hodgkinson et al. 2025, J Nutr, Table 2", url: HODGKINSON_2025_URL, note };
}

/** For a food nobody has measured: the median of its category in the same pig study (amino acids, Table 3). */
export function classValue(note: string): SourceRef {
  return { label: "Class value", url: HODGKINSON_2025_URL, note: `${note} (Hodgkinson et al. 2025, J Nutr, Table 3).` };
}

/** True ileal digestibility in humans from 15N-labelled foods and a naso-ileal tube. */
export const WALTHER_2019: SourceRef = {
  label: "Walther et al. 2019, Mol Nutr Food Res, Table 1",
  url: "https://doi.org/10.1002/mnfr.201900677",
  note: "Human, true ileal digestibility of nitrogen: wheat toast (15N gluten) 90.3 %.",
};

export const RUTHERFURD_2015: SourceRef = {
  label: "Rutherfurd et al. 2015, J Nutr, Table 1",
  url: "https://doi.org/10.3945/jn.114.195438",
  note: "Rat, true ileal digestibility of nitrogen: roasted peanuts 90.9 %. Pigs were fed blanched, unroasted peanuts (81.5 %), so the roasted value is used.",
};

export const BAILEY_STEIN_2020: SourceRef = {
  label: "Bailey & Stein 2020, J Sci Food Agric, Table 4",
  url: "https://doi.org/10.1002/jsfa.10429",
  note: "Growing pig, standardized ileal digestibility of crude protein: raw pistachios 94.45 %, roasted 85.19 %.",
};

export const LACKEY_FLEMING_2021: SourceRef = {
  label: "Lackey & Fleming 2021, Front Nutr, Table 3",
  url: "https://doi.org/10.3389/fnut.2021.702857",
  note: "Rat, true faecal protein digestibility of defatted raw walnuts: 86.22 %. No ileal value was found.",
};

export const FREITAS_2012: SourceRef = {
  label: "Freitas et al. 2012, Food Nutr Sci, Table 4",
  url: "https://doi.org/10.4236/fns.2012.36114",
  note: "Rat, true faecal protein digestibility of raw Brazil nuts: 89.20 %. No ileal value was found.",
};

export function proxy(note: string): SourceRef {
  return { label: "Proxy", note };
}
