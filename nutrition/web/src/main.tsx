import { StrictMode, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import type { ScoredFood, Meta, AxisKey, DietaryPattern } from "./types";
import { MatrixTable } from "./components/MatrixTable";
import { FoodDetailPanel } from "./components/FoodDetailPanel";
import { SourceMethodPanel } from "./components/SourceMethodPanel";
import { MethodologyPage } from "./pages/MethodologyPage";
import "./styles.css";

type Page = "matrix" | "methodology";

function exportJson(foods: ScoredFood[]) {
  const blob = new Blob([JSON.stringify(foods, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "du-bist-scores.json";
  a.click();
  URL.revokeObjectURL(url);
}

function exportCsv(foods: ScoredFood[]) {
  const headers = [
    "id",
    "name",
    "kingdom",
    "division",
    "tier",
    "composite",
    "eaa",
    "efa",
    "carbs",
    "micro",
    "fibre",
    "residue",
    "stability",
  ];
  const rows = foods.map((f) => [
    f.food.id,
    f.food.name,
    f.food.kingdom,
    f.food.division,
    f.scores.tier,
    Math.round(f.scores.composite),
    Math.round(f.scores.eaaCompletenessDigestibility),
    Math.round(f.scores.efaGlycerideProfile),
    Math.round(f.scores.carbohydrateType),
    Math.round(f.scores.micronutrientDensity),
    Math.round(f.scores.fibrePhytochemical),
    Math.round(f.scores.residueRisk),
    Math.round(f.scores.degradationSensitivity),
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "du-bist-scores.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [page, setPage] = useState<Page>("matrix");
  const [foods, setFoods] = useState<ScoredFood[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pattern, setPattern] = useState<DietaryPattern>("omnivore");
  const [kingdom, setKingdom] = useState<"all" | "plant" | "animal">("all");
  const [division, setDivision] = useState<string>("all");
  const [sortAxis, setSortAxis] = useState<AxisKey>("composite");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [sourceOpen, setSourceOpen] = useState(false);

  const load = useCallback(async (p: DietaryPattern) => {
    setLoading(true);
    setError(null);
    try {
      const [scoresRes, metaRes] = await Promise.all([
        fetch(`/api/nutrition/scores?pattern=${p}`),
        fetch("/api/nutrition/meta"),
      ]);
      if (!scoresRes.ok || !metaRes.ok) throw new Error("API error");
      setFoods(await scoresRes.json());
      setMeta(await metaRes.json());
    } catch {
      setError("Failed to load nutrition data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(pattern);
  }, [pattern, load]);

  const divisions = Array.from(new Set(foods.map((f) => f.food.division)));

  const filtered = foods.filter((f) => {
    if (kingdom !== "all" && f.food.kingdom !== kingdom) return false;
    if (division !== "all" && f.food.division !== division) return false;
    return true;
  });

  const selected = foods.find((f) => f.food.id === selectedId) ?? null;

  const onSort = (axis: AxisKey) => {
    if (sortAxis === axis) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortAxis(axis);
      setSortDir("desc");
    }
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-3)
    );
  };

  if (loading) return <div className="loading">Loading biochemical matrix…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="app-shell">
      <header className="header">
        <div>
          <h1>Du bist was du isst</h1>
          <p className="subtitle">
            Honest matrix-based food evaluation · biochemical reality
          </p>
        </div>
        <nav className="nav">
          <button
            type="button"
            className={page === "matrix" ? "active" : ""}
            onClick={() => setPage("matrix")}
          >
            Matrix
          </button>
          <button
            type="button"
            className={page === "methodology" ? "active" : ""}
            onClick={() => setPage("methodology")}
          >
            Methodology
          </button>
        </nav>
      </header>

      {page === "methodology" ? (
        <MethodologyPage />
      ) : (
        <>
          <div className="filters">
            <label>
              Dietary pattern
              <select
                value={pattern}
                onChange={(e) =>
                  setPattern(e.target.value as DietaryPattern)
                }
              >
                <option value="omnivore">Omnivore</option>
                <option value="vegan">Vegan / plant-only</option>
                <option value="low_residue">Low residue</option>
              </select>
            </label>
            <label>
              Kingdom
              <select
                value={kingdom}
                onChange={(e) =>
                  setKingdom(e.target.value as "all" | "plant" | "animal")
                }
              >
                <option value="all">All</option>
                <option value="plant">Plant</option>
                <option value="animal">Animal</option>
              </select>
            </label>
            <label>
              Division
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
              >
                <option value="all">All</option>
                {divisions.map((d) => (
                  <option key={d} value={d}>
                    {d.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="export-bar">
            <button type="button" onClick={() => exportCsv(filtered)}>
              Export CSV
            </button>
            <button type="button" onClick={() => exportJson(filtered)}>
              Export JSON
            </button>
          </div>

          <MatrixTable
            foods={filtered}
            sortAxis={sortAxis}
            sortDir={sortDir}
            onSort={onSort}
            selectedId={selectedId}
            onSelect={setSelectedId}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
          />

          {compareIds.length > 0 && (
            <div className="comparison">
              Comparing:{" "}
              {compareIds.map((id) => (
                <span key={id}>
                  {foods.find((f) => f.food.id === id)?.food.name ?? id}
                </span>
              ))}
            </div>
          )}

          <FoodDetailPanel food={selected} />
          <SourceMethodPanel
            meta={meta}
            open={sourceOpen}
            onToggle={() => setSourceOpen((o) => !o)}
          />
        </>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
