import {
  BIOACTIVE_COMPOUNDS,
  BIOACTIVE_SOURCES,
  bioactiveProfile,
  shortCitation,
  sourceLink,
  type BioactiveSourceId,
  type BioactiveValue,
} from "../data/bioactives";
import { BIOACTIVE_LABELS, BIOACTIVE_ROLES, MEASURED_STATE_LABELS } from "../i18n/labels";
import { useLocale } from "../i18n/LocaleContext";
import type { FoodRecord } from "../scoring/types";
import { formatAmount } from "./format";

function SourceCell({ source }: { source: BioactiveSourceId }) {
  const ref = BIOACTIVE_SOURCES[source];
  const href = sourceLink(ref);
  const label = shortCitation(ref);
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" title={ref.citation}>
      {label}
    </a>
  ) : (
    <span title={ref.citation}>{label}</span>
  );
}

export function BioactivesTable({ food }: { food: FoodRecord }) {
  const { t, localize } = useLocale();
  const profile = bioactiveProfile(food);

  const content = (value: BioactiveValue) => {
    switch (value.status) {
      case "value":
        return (
          <>
            {formatAmount(value.mgPer100g)}
            {value.range ? (
              <span className="cell-note">
                {t.food.bioactiveRange(formatAmount(value.range[0]), formatAmount(value.range[1]))}
              </span>
            ) : null}
          </>
        );
      case "notDetected":
        return <span className="muted">{t.food.bioactiveStatus.notDetected}</span>;
      case "notExpected":
        return <span className="muted">{t.food.bioactiveStatus.notExpected}</span>;
      case "noData":
        return <span className="muted">— {t.food.bioactiveStatus.noData}</span>;
      default: {
        const _exhaustive: never = value;
        return _exhaustive;
      }
    }
  };

  const measured = (value: BioactiveValue) => {
    switch (value.status) {
      case "value":
        return (
          <>
            {localize(value.measured)}
            {value.fromDryWeight ? null : ` · ${localize(MEASURED_STATE_LABELS[value.state])}`}
            {value.rawValueForPreparedFood ? <span className="cell-note">{t.food.bioactiveRawValue}</span> : null}
            {value.fromDryWeight ? <span className="cell-note">{t.food.bioactiveDryWeight}</span> : null}
          </>
        );
      case "notDetected":
        return localize(value.measured);
      case "notExpected":
        return <span className="muted">{localize(value.reason)}</span>;
      case "noData":
        return null;
      default: {
        const _exhaustive: never = value;
        return _exhaustive;
      }
    }
  };

  return (
    <section className="panel">
      <h2>{t.food.bioactivesHeading}</h2>
      <p className="muted">{t.food.bioactivesLede}</p>
      <div className="matrix-wrap">
        <table className="matrix nutrient-table">
          <thead>
            <tr>
              <th>{t.food.bioactiveColumns.compound}</th>
              <th>{t.food.bioactiveColumns.content}</th>
              <th>{t.food.bioactiveColumns.measured}</th>
              <th>{t.food.bioactiveColumns.source}</th>
            </tr>
          </thead>
          <tbody>
            {BIOACTIVE_COMPOUNDS.map((compound) => {
              const value = profile[compound];
              return (
                <tr key={compound}>
                  <td>
                    {localize(BIOACTIVE_LABELS[compound])}
                    <span className="role">{localize(BIOACTIVE_ROLES[compound])}</span>
                  </td>
                  <td className="mono">{content(value)}</td>
                  <td>{measured(value)}</td>
                  <td className="muted">
                    {value.status === "value" || value.status === "notDetected" ? <SourceCell source={value.source} /> : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
