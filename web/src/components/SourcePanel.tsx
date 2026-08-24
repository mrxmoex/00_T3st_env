import { sourceById } from "../catalog/sources.ts";
import { valueFlagLabel } from "../catalog/labels.ts";
import type { Food, FoodEvaluation } from "../types/domain.ts";

export function SourcePanel({
  food,
  evaluation,
}: {
  food: Food;
  evaluation: FoodEvaluation;
}) {
  return (
    <details className="sources panel">
      <summary>Source &amp; method</summary>
      <p className="small muted">
        Completeness: <strong>{evaluation.eaa.completeness}</strong>. Limiting AA:{" "}
        {evaluation.eaa.limitingAminoAcid}. DIAAS-like {evaluation.eaa.diaasLike.toFixed(2)}
        {evaluation.eaa.usedPublishedDiaas ? " (published DIAAS)" : " (computed AAS × digestibility)"}.
      </p>
      <ul>
        {food.sourceIds.map((id) => {
          const source = sourceById(id);
          return (
            <li key={id}>
              {source ? (
                <>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                  </a>
                  <div className="small muted">
                    {source.publisher} · accessed {source.accessed}
                    {source.notes ? ` · ${source.notes}` : ""}
                  </div>
                </>
              ) : (
                id
              )}
            </li>
          );
        })}
      </ul>
      <p className="small muted">
        Digestibility flag: {valueFlagLabel(food.quality.digestibilityFlag)}. Phytate:{" "}
        {food.quality.phytateMg ?? "n/a"} mg ({valueFlagLabel(food.quality.phytateFlag)}). FDC{" "}
        {food.fdcId ?? "none"}.
      </p>
      {food.notes.map((note) => (
        <p key={note} className="small">
          {note}
        </p>
      ))}
    </details>
  );
}
