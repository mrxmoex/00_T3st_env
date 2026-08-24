import { DATA_META } from "../data/catalog";
import type { FoodRecord, ScoreCard } from "../scoring/types";

export function SourcePanel({ food, card }: { food?: FoodRecord; card?: ScoreCard }) {
  return (
    <details className="panel">
      <summary>Source &amp; method</summary>
      <p className="muted">
        Dataset {DATA_META.version}, last verified {DATA_META.lastVerified}. Scores are
        computed in the client from raw nutrient fields plus documented coefficients.
        There is no black-box model.
      </p>
      <p className="muted">{DATA_META.updatePath}</p>
      {food ? (
        <ul>
          {food.sources.map((source) => (
            <li key={`${source.label}-${source.id ?? ""}`}>
              <strong>{source.label}</strong>
              {source.id ? ` · ${source.id}` : ""}
              {source.note ? ` — ${source.note}` : ""}
              {source.url ? (
                <>
                  {" "}
                  <a href={source.url} target="_blank" rel="noreferrer">
                    link
                  </a>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          <li>USDA FoodData Central (FDC IDs on each food)</li>
          <li>FAO 2013 adult amino acid scoring pattern + DIAAS/PDCAAS literature</li>
          <li>IOM/EFSA RAE conversion (β-carotene /12, other carotenoids /24)</li>
          <li>Iron/zinc absorption midpoints from bioavailability meta-analyses</li>
          <li>EU/US MRL residue logic as classed risk, not a lab certificate</li>
        </ul>
      )}
      {card ? (
        <p className="mono muted">
          AAS {card.eaa.aas} · DIAAS {card.eaa.diaas} · PDCAAS {card.eaa.pdcaas} · limiting{" "}
          {card.eaa.limitingAa.toUpperCase()} · RAE {card.micro.raeUg} µg · absorbable Fe{" "}
          {card.micro.absorbableIronMg} mg
        </p>
      ) : null}
    </details>
  );
}
