import {
  getAllScored,
  getNutritionMeta,
  getFoodById,
  scoreFood,
  applyDietaryFlags,
} from "../nutrition/dist/index.js";

const VALID_PATTERNS = new Set(["omnivore", "vegan", "low_residue"]);

export function registerNutritionRoutes(app) {
  app.get("/api/nutrition/meta", (_req, res) => {
    res.json(getNutritionMeta());
  });

  app.get("/api/nutrition/foods", (_req, res) => {
    const scored = getAllScored();
    res.json(scored.map((s) => s.food));
  });

  app.get("/api/nutrition/scores", (req, res) => {
    const pattern = VALID_PATTERNS.has(req.query.pattern)
      ? req.query.pattern
      : "omnivore";
    res.json(getAllScored(pattern));
  });

  app.get("/api/nutrition/foods/:id", (req, res) => {
    const food = getFoodById(req.params.id);
    if (!food) {
      res.status(404).json({ error: "food not found" });
      return;
    }
    const pattern = VALID_PATTERNS.has(req.query.pattern)
      ? req.query.pattern
      : "omnivore";
    const scored = applyDietaryFlags(scoreFood(food), pattern);
    res.json(scored);
  });
}
