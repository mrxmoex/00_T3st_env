import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { NonClaimBanner } from "../components/NonClaimBanner";
import { ScoreCell } from "../components/ScoreCell";
import { TierBadge } from "../components/TierBadge";
import {
  ANIMAL_CLASSES,
  PLANT_CLASSES,
  axisHint,
  axisLabel,
  classLabel,
  classShort,
  patternLabel,
} from "../data/labels";
import type { DietaryPattern, FoodClass, ScoreAxis } from "../data/types";
import { downloadText, toCsv, toJsonPayload } from "../export/serialize";
import { FOODS, SCORED_FOODS, requireScore } from "../state/store";

const AXES: ScoreAxis[] = [
  "eaa",
  "fat",
  "carb",
  "micro",
  "fibre",
  "residue",
  "degradation",
  "composite",
];

function axisValue(foodId: string, axis: ScoreAxis): number {
  const score = requireScore(foodId);
  return axis === "composite" ? score.composite : score[axis].score;
}

export function MatrixPage() {
  const [pattern, setPattern] = useState<DietaryPattern>("hybrid");
  const [kingdom, setKingdom] = useState<"all" | "plant" | "animal">("all");
  const [foodClass, setFoodClass] = useState<FoodClass | "all">("all");
  const [sortAxis, setSortAxis] = useState<ScoreAxis>("composite");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    return FOODS.filter((food) => {
      if (pattern === "plant-only" && food.kingdom !== "plant") return false;
      if (kingdom !== "all" && food.kingdom !== kingdom) return false;
      if (foodClass !== "all" && food.foodClass !== foodClass) return false;
      if (query && !`${food.name} ${food.nameDe}`.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (a.foodClass !== b.foodClass) return a.foodClass.localeCompare(b.foodClass);
      return axisValue(b.id, sortAxis) - axisValue(a.id, sortAxis);
    });
  }, [foodClass, kingdom, pattern, query, sortAxis]);

  const visibleFoods = rows;
  const visibleScores = SCORED_FOODS.filter((score) =>
    visibleFoods.some((food) => food.id === score.foodId),
  );

  return (
    <div className="space-y-5">
      <NonClaimBanner />
      <section className="grid gap-3 md:grid-cols-4">
        <label className="grid gap-1 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
            Dietary pattern
          </span>
          <select
            className="border border-stone-400 bg-white px-2 py-2 dark:border-ink-600 dark:bg-ink-900"
            value={pattern}
            onChange={(event) => setPattern(event.target.value as DietaryPattern)}
          >
            <option value="hybrid">{patternLabel("hybrid")}</option>
            <option value="animal-inclusive">{patternLabel("animal-inclusive")}</option>
            <option value="plant-only">{patternLabel("plant-only")}</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
            Kingdom
          </span>
          <select
            className="border border-stone-400 bg-white px-2 py-2 dark:border-ink-600 dark:bg-ink-900"
            value={kingdom}
            onChange={(event) => setKingdom(event.target.value as "all" | "plant" | "animal")}
          >
            <option value="all">All</option>
            <option value="plant">Plant classes</option>
            <option value="animal">Animal classes</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
            Food class
          </span>
          <select
            className="border border-stone-400 bg-white px-2 py-2 dark:border-ink-600 dark:bg-ink-900"
            value={foodClass}
            onChange={(event) => setFoodClass(event.target.value as FoodClass | "all")}
          >
            <option value="all">All classes (kept separate)</option>
            {[...PLANT_CLASSES, ...ANIMAL_CLASSES].map((item) => (
              <option key={item} value={item}>
                {classLabel(item)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
            Search
          </span>
          <input
            className="border border-stone-400 bg-white px-2 py-2 dark:border-ink-600 dark:bg-ink-900"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name…"
          />
        </label>
      </section>

      {pattern === "plant-only" ? (
        <p className="border border-stone-400 px-3 py-2 text-sm dark:border-ink-600">
          Plant-only filter hides animal rows. It does not make plant proteins complete. B12
          supplementation is required; LC EPA/DHA and creatine are typical gaps.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-stone-500">
          {rows.length} foods · sort by {axisLabel(sortAxis)} · tiers are{" "}
          <strong>within class</strong>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="border border-stone-500 px-2 py-1"
            onClick={() =>
              downloadText("du-bist-was-du-isst.csv", toCsv(visibleFoods, visibleScores), "text/csv")
            }
          >
            Export CSV
          </button>
          <button
            type="button"
            className="border border-stone-500 px-2 py-1"
            onClick={() =>
              downloadText(
                "du-bist-was-du-isst.json",
                toJsonPayload(visibleFoods, visibleScores),
                "application/json",
              )
            }
          >
            Export JSON
          </button>
        </div>
      </div>

      <div className="matrix-scroll overflow-x-auto border border-stone-300 dark:border-ink-700">
        <table className="min-w-[980px] w-full border-collapse text-left text-sm">
          <thead className="bg-stone-200 dark:bg-ink-900">
            <tr>
              <th className="sticky left-0 z-10 bg-stone-200 px-2 py-2 dark:bg-ink-900">Food</th>
              <th className="px-2 py-2">Class</th>
              <th className="px-2 py-2">Tier</th>
              {AXES.map((axis) => (
                <th key={axis} className="px-1 py-2">
                  <button
                    type="button"
                    title={axisHint(axis)}
                    className={`font-mono text-[11px] uppercase ${
                      sortAxis === axis ? "text-copper-600 dark:text-copper-400" : ""
                    }`}
                    onClick={() => setSortAxis(axis)}
                  >
                    {axis}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((food) => {
              const score = requireScore(food.id);
              return (
                <tr
                  key={food.id}
                  className="border-t border-stone-200 odd:bg-white even:bg-stone-50 dark:border-ink-800 dark:odd:bg-ink-950 dark:even:bg-ink-900/40"
                >
                  <td className="sticky left-0 z-10 bg-inherit px-2 py-1.5">
                    <Link className="underline decoration-stone-500 underline-offset-2" to={`/food/${food.id}`}>
                      {food.name}
                    </Link>
                    {food.fermented ? (
                      <span className="ml-2 font-mono text-[10px] uppercase text-stone-500">
                        fermented
                      </span>
                    ) : null}
                  </td>
                  <td className="px-2 py-1.5 text-stone-500">{classShort(food.foodClass)}</td>
                  <td className="px-2 py-1.5">
                    <TierBadge tier={score.tier} />
                  </td>
                  {AXES.map((axis) => (
                    <td key={axis} className="px-1 py-1.5">
                      <ScoreCell score={axisValue(food.id, axis)} compact />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-stone-500">{axisHint(sortAxis)}</p>
    </div>
  );
}
