import { useMemo } from "react";
import type { ScoredFood, AxisKey } from "../types";
import { AXIS_LABELS } from "../types";

const AXES: AxisKey[] = [
  "eaaCompletenessDigestibility",
  "efaGlycerideProfile",
  "carbohydrateType",
  "micronutrientDensity",
  "fibrePhytochemical",
  "residueRisk",
  "degradationSensitivity",
  "composite",
];

function heatColor(score: number): string {
  const t = score / 100;
  if (t < 0.5) {
    const u = t * 2;
    const r = Math.round(30 + u * 30);
    const g = Math.round(58 + u * 80);
    const b = Math.round(95 + u * 60);
    return `rgb(${r},${g},${b})`;
  }
  const u = (t - 0.5) * 2;
  const r = Math.round(60 - u * 40);
  const g = Math.round(138 + u * 50);
  const b = Math.round(155 - u * 40);
  return `rgb(${r},${g},${b})`;
}

interface Props {
  foods: ScoredFood[];
  sortAxis: AxisKey;
  sortDir: "asc" | "desc";
  onSort: (axis: AxisKey) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
}

export function MatrixTable({
  foods,
  sortAxis,
  sortDir,
  onSort,
  selectedId,
  onSelect,
  compareIds,
  onToggleCompare,
}: Props) {
  const sorted = useMemo(() => {
    const copy = [...foods];
    copy.sort((a, b) => {
      const av = a.scores[sortAxis];
      const bv = b.scores[sortAxis];
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return copy;
  }, [foods, sortAxis, sortDir]);

  return (
    <div className="matrix-wrap">
      <table className="matrix-table">
        <thead>
          <tr>
            <th>Food</th>
            <th>Division</th>
            <th>Tier</th>
            {AXES.map((axis) => (
              <th
                key={axis}
                className="sortable"
                onClick={() => onSort(axis)}
                title={AXIS_LABELS[axis]}
              >
                {AXIS_LABELS[axis]}
                {sortAxis === axis ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
              </th>
            ))}
            <th>Compare</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((item) => (
            <tr
              key={item.food.id}
              onClick={() => onSelect(item.food.id)}
              style={{
                outline:
                  selectedId === item.food.id
                    ? "2px solid var(--accent)"
                    : undefined,
                cursor: "pointer",
              }}
            >
              <td className="food-name">
                <span className={`kingdom-${item.food.kingdom}`}>●</span>{" "}
                {item.food.name}
              </td>
              <td>{item.food.division.replace(/_/g, " ")}</td>
              <td>
                <span className={`tier-badge tier-${item.scores.tier}`}>
                  {item.scores.tier}
                </span>
              </td>
              {AXES.map((axis) => {
                const v = item.scores[axis];
                return (
                  <td key={axis}>
                    <span
                      className="heat"
                      style={{
                        background: heatColor(v),
                        color: v > 55 ? "#0a0f1a" : "#e8edf5",
                        padding: "0.15rem 0.35rem",
                      }}
                    >
                      {Math.round(v)}
                    </span>
                  </td>
                );
              })}
              <td>
                <input
                  type="checkbox"
                  checked={compareIds.includes(item.food.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleCompare(item.food.id);
                  }}
                  aria-label={`Compare ${item.food.name}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
