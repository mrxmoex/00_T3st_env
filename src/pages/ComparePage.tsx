import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ScoreCell } from "../components/ScoreCell";
import { SourcePanel } from "../components/SourcePanel";
import { TierBadge } from "../components/TierBadge";
import { FOODS } from "../data/catalog";
import { axisLabel, classLabel } from "../data/labels";
import type { Food, ScoreAxis } from "../data/types";
import { requireScore } from "../state/store";

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

function pick(id: string | null): Food | undefined {
  return FOODS.find((food) => food.id === id);
}

function valueOf(food: Food, axis: ScoreAxis): number {
  const score = requireScore(food.id);
  return axis === "composite" ? score.composite : score[axis].score;
}

export function ComparePage() {
  const [params, setParams] = useSearchParams();
  const [leftId, setLeftId] = useState(params.get("a") ?? "egg-whole");
  const [rightId, setRightId] = useState(params.get("b") ?? "lentils-boiled");
  const left = pick(leftId);
  const right = pick(rightId);

  const warning = useMemo(() => {
    if (!left || !right) return "";
    if (left.kingdom !== right.kingdom) {
      return "Different kingdoms. Side-by-side is comparison, not substitution.";
    }
    if (left.foodClass !== right.foodClass) {
      return "Different biochemical classes. They are not interchangeable.";
    }
    return "Same class — ranking is meaningful within the class.";
  }, [left, right]);

  const update = (side: "a" | "b", id: string) => {
    if (side === "a") setLeftId(id);
    else setRightId(id);
    const next = new URLSearchParams(params);
    next.set(side, id);
    setParams(next, { replace: true });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold">Comparison</h2>
      <p className="text-sm text-stone-500">
        Scores stay on their own axes. A high fibre number does not complete a protein.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Left</span>
          <select
            className="border border-stone-400 bg-white px-2 py-2 dark:border-ink-600 dark:bg-ink-900"
            value={leftId}
            onChange={(event) => update("a", event.target.value)}
          >
            {FOODS.map((food) => (
              <option key={food.id} value={food.id}>
                {food.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Right</span>
          <select
            className="border border-stone-400 bg-white px-2 py-2 dark:border-ink-600 dark:bg-ink-900"
            value={rightId}
            onChange={(event) => update("b", event.target.value)}
          >
            {FOODS.map((food) => (
              <option key={food.id} value={food.id}>
                {food.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="border border-copper-600/40 bg-copper-500/10 px-3 py-2 text-sm">{warning}</p>
      {left && right ? (
        <div className="overflow-x-auto border border-stone-300 dark:border-ink-700">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-stone-200 dark:bg-ink-900">
              <tr>
                <th className="px-2 py-2 text-left">Axis</th>
                <th className="px-2 py-2 text-left">
                  <Link className="underline" to={`/food/${left.id}`}>
                    {left.name}
                  </Link>
                  <div className="font-normal text-stone-500">{classLabel(left.foodClass)}</div>
                </th>
                <th className="px-2 py-2 text-left">
                  <Link className="underline" to={`/food/${right.id}`}>
                    {right.name}
                  </Link>
                  <div className="font-normal text-stone-500">{classLabel(right.foodClass)}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-stone-200 dark:border-ink-800">
                <td className="px-2 py-2">Within-class tier</td>
                <td className="px-2 py-2">
                  <TierBadge tier={requireScore(left.id).tier} />
                </td>
                <td className="px-2 py-2">
                  <TierBadge tier={requireScore(right.id).tier} />
                </td>
              </tr>
              {AXES.map((axis) => (
                <tr key={axis} className="border-t border-stone-200 dark:border-ink-800">
                  <td className="px-2 py-2">{axisLabel(axis)}</td>
                  <td className="px-2 py-2">
                    <ScoreCell score={valueOf(left, axis)} />
                  </td>
                  <td className="px-2 py-2">
                    <ScoreCell score={valueOf(right, axis)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {left ? <SourcePanel food={left} /> : null}
      {right ? <SourcePanel food={right} /> : null}
    </div>
  );
}
