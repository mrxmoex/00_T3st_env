import type { SourceRef } from "../../scoring/types";

/** True protein digestibility in humans from faecal nitrogen balance. */
export const FAO_WHO_UNU_1985: SourceRef = {
  label: "FAO/WHO/UNU 1985, Table 36",
  url: "https://www.fao.org/4/aa040e/aa040e08.htm",
  note: "True protein digestibility in humans (faecal): oatmeal 86 %, polished rice 88 %, whole wheat 86 %, refined wheat 96 %, mature peas 88 %, peanut butter 95 %; diets of coarse whole-grain cereals 85 %.",
};

/** True ileal digestibility in humans from 15N-labelled foods. */
export const WALTHER_2019: SourceRef = {
  label: "Walther et al. 2019, Mol Nutr Food Res, Table 1",
  url: "https://doi.org/10.1002/mnfr.201900677",
  note: "True ileal digestibility in humans: wheat toast (15N gluten) 90.3 %, pea flour 89.4 %.",
};

export function proxy(note: string): SourceRef {
  return { label: "Proxy", note };
}

export function estimate(note: string): SourceRef {
  return { label: "Estimate", note };
}
