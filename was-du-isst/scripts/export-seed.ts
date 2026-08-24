import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CATEGORIES } from "../src/data/categories";
import { SEED_FOODS } from "../src/data/foods/index";
import { INVARIANTS } from "../src/data/invariants";
import { SOURCES } from "../src/data/sources";
import { evaluateFoods } from "../src/lib/scoring";

const out = join(dirname(fileURLToPath(import.meta.url)), "../src/data/seed");
mkdirSync(out, { recursive: true });

const write = (name: string, value: unknown) => {
  writeFileSync(join(out, name), `${JSON.stringify(value, null, 2)}\n`);
};

write("sources.json", SOURCES);
write("invariants.json", INVARIANTS);
write("categories.json", CATEGORIES);
write("foods.json", SEED_FOODS);
write("evaluated.json", evaluateFoods(SEED_FOODS));
