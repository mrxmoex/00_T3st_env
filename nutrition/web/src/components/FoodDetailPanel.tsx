import type { ScoredFood } from "../types";

interface Props {
  food: ScoredFood | null;
}

export function FoodDetailPanel({ food }: Props) {
  if (!food) {
    return (
      <div className="panel">
        <p style={{ color: "var(--muted)" }}>Select a food row for deep dive.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h3>{food.food.name}</h3>
      <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
        {food.food.kingdom} · {food.food.division.replace(/_/g, " ")}
        {food.food.fermented ? " · fermented" : ""}
      </p>
      {food.flags.length > 0 && (
        <ul className="flag-list">
          {food.flags.map((f) => (
            <li key={f}>⚠ {f}</li>
          ))}
        </ul>
      )}
      <h4 style={{ marginTop: "1rem" }}>Axis breakdown</h4>
      <ul style={{ fontSize: "0.85rem", paddingLeft: "1.25rem" }}>
        {Object.entries(food.scores)
          .filter(([k]) => k !== "tier")
          .map(([k, v]) => (
            <li key={k}>
              {k}: {typeof v === "number" ? Math.round(v) : v}
            </li>
          ))}
      </ul>
    </div>
  );
}
