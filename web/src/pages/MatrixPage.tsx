import { useMemo, useState } from "react";
import { FOODS } from "../catalog/foods.ts";
import { DATASET_META } from "../catalog/dataset-meta.ts";
import {
  DEFAULT_FILTERS,
  FiltersBar,
  matchesPattern,
  type FilterState,
} from "../components/FiltersBar.tsx";
import { MatrixTable } from "../components/MatrixTable.tsx";
import { exportFilename, toCsvExport, toJsonExport } from "../export/serialize.ts";
import { EVALUATIONS, EVAL_BY_ID } from "../state/catalog.ts";
import type { ScoreAxis } from "../types/domain.ts";

function download(filename: string, contents: string, type: string): void {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function MatrixPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const rows = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return FOODS.filter((food) => {
      if (filters.kingdom !== "all" && food.kingdom !== filters.kingdom) {
        return false;
      }
      if (filters.foodClass !== "all" && food.foodClass !== filters.foodClass) {
        return false;
      }
      if (!matchesPattern(food.kingdom, filters.pattern)) {
        return false;
      }
      if (
        query &&
        !`${food.name} ${food.nameDe} ${food.id}`.toLowerCase().includes(query)
      ) {
        return false;
      }
      return true;
    })
      .map((food) => {
        const evaluation = EVAL_BY_ID[food.id];
        if (!evaluation) {
          throw new Error(`Missing evaluation for ${food.id}`);
        }
        return { food, evaluation };
      })
      .sort((a, b) => b.evaluation.scores[filters.axis] - a.evaluation.scores[filters.axis]);
  }, [filters]);

  return (
    <main>
      <div className="page-head">
        <div>
          <h2>Multi-axis evaluation matrix</h2>
          <p className="lede">
            Plant and animal classes stay distinct. Plant proteins are never labelled complete.
            Scores come from USDA tables plus published bioavailability coefficients — dataset{" "}
            {DATASET_META.version}.
          </p>
        </div>
        <div className="actions">
          <button
            type="button"
            className="btn"
            onClick={() =>
              download(exportFilename("csv"), toCsvExport(FOODS, EVALUATIONS), "text/csv")
            }
          >
            Export CSV
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={() =>
              download(
                exportFilename("json"),
                toJsonExport(FOODS, EVALUATIONS),
                "application/json",
              )
            }
          >
            Export JSON
          </button>
        </div>
      </div>
      <FiltersBar
        value={filters}
        onChange={(next) => setFilters(next)}
      />
      <p className="small muted">
        {rows.length} foods · sorted by {filters.axis.replaceAll("_", " ")}
      </p>
      <MatrixTable
        rows={rows}
        sortAxis={filters.axis}
        onSort={(axis: ScoreAxis) => setFilters({ ...filters, axis })}
      />
    </main>
  );
}
