import type { Meta } from "../types";

interface Props {
  meta: Meta | null;
  open: boolean;
  onToggle: () => void;
}

export function SourceMethodPanel({ meta, open, onToggle }: Props) {
  return (
    <div className={`panel ${open ? "" : "collapsed"}`}>
      <button type="button" className="panel-toggle" onClick={onToggle}>
        Source & Method {open ? "▲" : "▼"}
      </button>
      {open && meta && (
        <div className="panel-body" style={{ marginTop: "0.75rem" }}>
          <p style={{ fontSize: "0.85rem" }}>
            Dataset v{meta.datasetVersion} · Coefficients v
            {meta.coefficientVersion} · Last verified{" "}
            {meta.lastVerificationDate}
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            Scores computed from USDA FoodData Central, WHO/FAO reference
            patterns, and published bioavailability coefficients. No black-box
            AI ratings.
          </p>
          <ul className="source-list">
            <li>
              <a href="https://fdc.nal.usda.gov/" target="_blank" rel="noreferrer">
                USDA FoodData Central
              </a>
            </li>
            <li>
              <a
                href="https://www.who.int/news-room/fact-sheets/detail/protein-quality-evaluation"
                target="_blank"
                rel="noreferrer"
              >
                WHO protein quality evaluation
              </a>
            </li>
            <li>
              <a
                href="https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values"
                target="_blank"
                rel="noreferrer"
              >
                EFSA dietary reference values
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
