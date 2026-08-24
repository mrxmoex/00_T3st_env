import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { NonClaimBanner } from "../components/NonClaimBanner";
import { ScoreCell } from "../components/ScoreCell";
import { foodById } from "../data/catalog";
import { patternLabel } from "../data/labels";
import type { DietaryPattern } from "../data/types";
import { recommend } from "../recommend/engine";
import { FOODS, SCORED_FOODS, requireScore } from "../state/store";

export function RecommendPage() {
  const [pattern, setPattern] = useState<DietaryPattern>("hybrid");
  const report = useMemo(
    () => recommend({ pattern, foods: FOODS, scores: SCORED_FOODS }),
    [pattern],
  );

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold">Best-practice engine</h2>
      <p className="max-w-3xl text-sm text-stone-600 dark:text-stone-400">
        Recommendations respect biochemical limits. They pick highest within-class scores and
        list gaps that food selection cannot erase.
      </p>
      <NonClaimBanner />
      <label className="grid max-w-sm gap-1 text-sm">
        <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
          Pattern
        </span>
        <select
          aria-label="Pattern"
          className="border border-stone-400 bg-white px-2 py-2 dark:border-ink-600 dark:bg-ink-900"
          value={pattern}
          onChange={(event) => setPattern(event.target.value as DietaryPattern)}
        >
          <option value="hybrid">{patternLabel("hybrid")}</option>
          <option value="animal-inclusive">{patternLabel("animal-inclusive")}</option>
          <option value="plant-only">{patternLabel("plant-only")}</option>
        </select>
      </label>
      <p className="border border-stone-400 px-3 py-2 text-sm dark:border-ink-600">{report.headline}</p>

      <section>
        <h3 className="font-medium">Gaps that remain</h3>
        <ul className="mt-2 space-y-2">
          {report.gaps.map((gap) => (
            <li key={gap.id} className="border border-stone-300 p-3 dark:border-ink-700">
              <p className="font-mono text-[10px] uppercase tracking-widest text-copper-600 dark:text-copper-400">
                {gap.severity}
              </p>
              <p className="font-medium">{gap.title}</p>
              <p className="text-sm text-stone-600 dark:text-stone-400">{gap.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-medium">Picks</h3>
        <ul className="mt-2 divide-y divide-stone-200 border border-stone-300 dark:divide-ink-800 dark:border-ink-700">
          {report.picks.map((pick) => {
            const food = foodById(pick.foodId);
            if (!food) return null;
            const score = requireScore(food.id);
            return (
              <li key={pick.foodId} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                <div>
                  <Link className="underline" to={`/food/${food.id}`}>
                    {food.name}
                  </Link>
                  <p className="text-xs text-stone-500">{pick.reason}</p>
                </div>
                <ScoreCell score={score.composite} compact />
              </li>
            );
          })}
        </ul>
      </section>

      {report.pairings.length > 0 ? (
        <section>
          <h3 className="font-medium">Pairings</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {report.pairings.map((pair) => {
              const lead = foodById(pair.lead);
              const complement = foodById(pair.complement);
              return (
                <li key={`${pair.lead}-${pair.complement}`} className="border border-stone-300 p-3 dark:border-ink-700">
                  <p className="font-medium">
                    {lead?.name} + {complement?.name}
                  </p>
                  <p className="text-stone-600 dark:text-stone-400">{pair.note}</p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section>
        <h3 className="font-medium">Refusals</h3>
        <ul className="mt-1 list-disc pl-5 text-sm text-stone-600 dark:text-stone-400">
          {report.refusals.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
