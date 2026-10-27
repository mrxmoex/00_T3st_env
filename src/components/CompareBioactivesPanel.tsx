import { BIOACTIVE_COMPOUNDS, bioactiveValue, type BioactiveValue } from "../data/bioactives";
import { BIOACTIVE_LABELS, BIOACTIVE_ROLES } from "../i18n/labels";
import { foodName } from "../i18n/locale";
import { useLocale } from "../i18n/LocaleContext";
import { formatAmount } from "./format";
import type { FoodRecord } from "../scoring/types";

function chipLabel(value: BioactiveValue, notDetected: string): string | null {
  switch (value.status) {
    case "value":
      return `${formatAmount(value.mgPer100g)}${value.rawValueForPreparedFood ? "*" : ""}`;
    case "notDetected":
      return notDetected;
    case "notExpected":
    case "noData":
      return null;
    default: {
      const _exhaustive: never = value;
      return _exhaustive;
    }
  }
}

function notable(value: BioactiveValue): boolean {
  switch (value.status) {
    case "value":
    case "notDetected":
      return true;
    case "notExpected":
    case "noData":
      return false;
    default: {
      const _exhaustive: never = value;
      return _exhaustive;
    }
  }
}

export function CompareBioactivesPanel({ foods }: { foods: readonly FoodRecord[] }) {
  const { t, locale, localize } = useLocale();

  return (
    <div className="bioactives-profiles">
      {foods.map((food) => {
        const entries = BIOACTIVE_COMPOUNDS.flatMap((compound) => {
          const value = bioactiveValue(food, compound);
          if (!notable(value)) return [];
          const amount = chipLabel(value, t.compare.notDetectedShort);
          return [{ compound, value, amount }];
        });

        return (
          <article key={food.id} className="bioactives-profile card">
            <h3>{foodName(food, locale)}</h3>
            <p className="muted">{t.compare.bioactivesProfileLede}</p>
            {entries.length === 0 ? (
              <p className="muted">{t.compare.bioactivesProfileEmpty}</p>
            ) : (
              <ul className="bioactive-chips">
                {entries.map(({ compound, value, amount }) => (
                  <li key={compound}>
                    <details className="bioactive-chip">
                      <summary>
                        <span className="bioactive-chip-name">{localize(BIOACTIVE_LABELS[compound])}</span>
                        <span className="bioactive-chip-amount mono">{amount}</span>
                      </summary>
                      <p className="bioactive-chip-role">{localize(BIOACTIVE_ROLES[compound])}</p>
                      {value.status === "value" && value.rawValueForPreparedFood ? (
                        <p className="muted">{t.food.bioactiveRawValue}</p>
                      ) : null}
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </article>
        );
      })}
    </div>
  );
}
