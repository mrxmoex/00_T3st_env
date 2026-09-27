import { useMemo, useState } from "react";
import { FOODS } from "../data/catalog";
import { Filters, type FilterState } from "../components/Filters";
import { MatrixTable, axisValue } from "../components/MatrixTable";
import { SourcePanel } from "../components/SourcePanel";
import { downloadText, matrixToCsv, matrixToJson } from "../export/matrixExport";
import { useLocale } from "../i18n/LocaleContext";
import { recommend } from "../recommend/engine";
import { scoreCatalog } from "../scoring/scoreFood";
import { kingdomOf } from "../scoring/types";

export function MatrixPage() {
  const { t, localize } = useLocale();
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
      <p className="lede">{t.matrix.lede}</p>
      <Filters value={filters} onChange={setFilters} />
      <div className="toolbar">
        <button
          type="button"
          className="btn"
          onClick={() =>
            downloadText("du-bist-was-du-isst.csv", matrixToCsv(rows.map((row) => row.card)), "text/csv")
          }
        >
          {t.matrix.exportCsv}
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
          {t.matrix.exportJson}
        </button>
        <span className="muted mono">{t.matrix.inView(rows.length)}</span>
      </div>
      <MatrixTable
        rows={rows}
        extraClass={filters.foodClass}
        sortAxis={filters.sortAxis}
        onSort={(axis) => setFilters({ ...filters, sortAxis: axis })}
      />
      <p className="muted">{t.matrix.legend}</p>
      <section className="panel">
        <h2>{localize(rec.headline)}</h2>
        <p className="muted">{t.matrix.patternNote(t.patterns[filters.pattern])}</p>
        <ul>
          {rec.gaps
            .filter((gap) => gap.severity === "required")
            .map((gap) => (
              <li key={gap.id}>
                <strong>{localize(gap.title)}.</strong> {localize(gap.detail)}
              </li>
            ))}
        </ul>
      </section>
      <SourcePanel />
    </main>
  );
}
