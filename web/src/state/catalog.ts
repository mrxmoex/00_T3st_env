import { FOODS } from "../catalog/foods.ts";
import { evaluateAll, evaluationById } from "../scoring/evaluate.ts";

export const EVALUATIONS = evaluateAll(FOODS);
export const EVAL_BY_ID = evaluationById(EVALUATIONS);
