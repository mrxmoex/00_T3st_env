import { clamp, num, round } from "./math.js";

export function scoreCarbs(food) {
  const carbs = food.carbs ?? {};
  const sugars = num(carbs.sugarsG);
  const starch = num(carbs.starchG);
  const fiber = num(carbs.fiberG);
  const resistant = num(carbs.resistantStarchG);
  const total = num(carbs.totalG, sugars + starch + fiber);
  const activeG = round(Math.max(0, sugars + starch - resistant), 3);
  const passiveG = round(fiber + resistant, 3);

  let score;
  if (total < 1.5 && activeG < 1) {
    score = 68;
  } else {
    const denom = activeG + passiveG;
    const passiveRatio = denom > 0 ? passiveG / denom : 0;
    const activePenalty = clamp(activeG / 40, 0, 1);
    score = 100 * (0.62 * passiveRatio + 0.38 * (1 - activePenalty));
  }

  return {
    activeG,
    passiveG,
    fiberG: fiber,
    resistantStarchG: resistant,
    sugarsG: sugars,
    starchG: starch,
    score: round(clamp(score, 0, 100), 2),
    formula:
      "active = sugars + starch − resistant_starch; passive = fibre + resistant_starch. Animal foods with ~0 g carbohydrate receive a neutral-high structural score, not a 'perfect carb' claim.",
  };
}
