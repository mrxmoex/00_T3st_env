import { useMemo, useState } from "react";
import { FOODS } from "../data/catalog";
import { Filters, type FilterState } from "../components/Filters";
import { MatrixTable, axisValue } from "../components/MatrixTable";
import { SourcePanel } from "../components/SourcePanel";
import { downloadText, matrixToCsv, matrixToJson } from "../export/matrixExport";
import { recommend } from "../recommend/engine";
import { scoreCatalog } from "../scoring/scoreFood";
import { kingdomOf } from "../scoring/types";

export function MatrixPage() {
  const cards = useMemo(() => scoreCatalog(FOODS), []);
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    kingdom: "all",
    foodClass: "all",
    pattern: "hybrid",
    sortAxis: "composite",
  });

  const rows = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const filtered = FOODS.filter((food) => {
      if (filters.kingdom !== "all" && kingdomOf(food.class) !== filters.kingdom) return false;
      if (filters.foodClass !== "all" && food.class !== filters.foodClass) return false;
      if (filters.pattern === "plant-only" && kingdomOf(food.class) !== "plant") return false;
      if (q && !`${food.name} ${food.nameDe} ${food.class}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const joined = filtered.map((food) => {
      const card = cards.find((item) => item.foodId === food.id);
      if (!card) throw new Error(`Unscored food ${food.id}`);
      return { food, card };
    });
    return joined.sort((a, b) => axisValue(b.card, filters.sortAxis) - axisValue(a.card, filters.sortAxis));
  }, [cards, filters]);

  const rec = recommend({ pattern: filters.pattern, selectedIds: rows.map((row) => row.food.id) });

  return (
    <main>
      <h1>Du bist was du isst</h1>
      <p className="lede">
        An honest matrix of biochemical efficiency, completeness, and real-world value.
        Plant proteins are incomplete. Non-heme iron is not heme iron. Algae, mushrooms,
        sprouts, kraut, legumes, and leafy salads are not interchangeable.
      </p>
      <Filters value={filters} onChange={setFilters} />
      <div className="toolbar">
        <button
          type="button"
          className="btn"
          onClick={() =>
            downloadText("du-bist-was-du-isst.csv", matrixToCsv(rows.map((row) => row.card)), "text/csv")
          }
        >
          Export CSV
        </button>
        <button
          type="button"
          className="btn"
          onClick={() =>
            downloadText(
              "du-bist-was-du-isst.json",
              matrixToJson(rows.map((row) => row.card)),
              "application/json",
            )
          }
        >
          Export JSON
        </button>
        <span className="muted mono">{rows.length} foods in view</span>
      </div>
      <MatrixTable
        rows={rows}
        extraClass={filters.foodClass}
        sortAxis={filters.sortAxis}
        onSort={(axis) => setFilters({ ...filters, sortAxis: axis })}
      />
      <p className="muted">
        Tiers S–D are assigned from the class-weighted composite. Heat is 0–100 on each axis.
        Residue is inverted (higher = lower contaminant risk).
      </p>
      <section className="panel">
        <h2>{rec.headline}</h2>
        <p className="muted">Pattern: {filters.pattern}. This banner does not sell completeness.</p>
        <ul>
          {rec.gaps
            .filter((gap) => gap.severity === "required")
            .map((gap) => (
              <li key={gap.id}>
                <strong>{gap.title}.</strong> {gap.detail}
              </li>
            ))}
        </ul>
      </section>
      <SourcePanel />
    </main>
  );
}
