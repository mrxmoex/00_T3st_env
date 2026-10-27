import { describe, expect, it } from "vitest";
import { FOODS } from "../data/catalog";
import { en } from "../i18n/en";
import { scoreCatalog } from "../scoring/scoreFood";
import { foodHonors } from "./foodHonors";

const cards = scoreCatalog(FOODS);

function honorsFor(id: string) {
  const food = FOODS.find((item) => item.id === id);
  const card = cards.find((item) => item.foodId === id);
  expect(food, id).toBeDefined();
  expect(card, id).toBeDefined();
  return foodHonors(food!, card!, en, "en");
}

describe("foodHonors", () => {
  it("marks a raw-tissue value shown for a prepared food (non-claim 18)", () => {
    const creatine = honorsFor("salmon_roasted").find((honor) => honor.key === "creatine");
    expect(creatine?.text).toBe("Creatine 450 mg*");
    expect(creatine?.note).toBe(en.food.bioactiveRawValue);
  });

  it("leaves a value measured in the same state unmarked", () => {
    const creatine = honorsFor("salmon_raw").find((honor) => honor.key === "creatine");
    expect(creatine?.text).toBe("Creatine 450 mg");
    expect(creatine?.note).toBeUndefined();
  });

  it("names no compound the index has no positive value for", () => {
    expect(honorsFor("lentils_boiled").map((honor) => honor.key)).not.toContain("creatine");
  });
});
