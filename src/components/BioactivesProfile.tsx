import { BIOACTIVE_COMPOUNDS, bioactiveValue, type BioactiveCompound, type BioactiveValue } from "../data/bioactives";
import { BIOACTIVE_LABELS, BIOACTIVE_ROLES } from "../i18n/labels";
import { foodName } from "../i18n/locale";
import { useLocale } from "../i18n/LocaleContext";
import { BioactiveSourceLink } from "./BioactiveSourceLink";
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

function BioactiveChip({
  compound,
  value,
  amount,
  showSources,
}: {
  compound: BioactiveCompound;
  value: BioactiveValue;
  amount: string;
  showSources: boolean;
}) {
  const { t, localize } = useLocale();

  return (
    <details className="bioactive-chip">
      <summary>
        <span className="bioactive-chip-name">{localize(BIOACTIVE_LABELS[compound])}</span>
        <span className="bioactive-chip-amount mono">{amount}</span>
      </summary>
      <p className="bioactive-chip-role">{localize(BIOACTIVE_ROLES[compound])}</p>
      {value.status === "value" && value.rawValueForPreparedFood ? (
        <p className="muted">{t.food.bioactiveRawValue}</p>
      ) : null}
      {showSources && (value.status === "value" || value.status === "notDetected") ? (
        <p className="bioactive-chip-source muted">
          {t.food.bioactiveColumns.source}: <BioactiveSourceLink source={value.source} />
        </p>
      ) : null}
    </details>
  );
}

export function BioactivesProfile({
  foods,
  showSources = false,
  showProfileLede = false,
}: {
  foods: readonly FoodRecord[];
  showSources?: boolean;
  /** When false, the lede lives in the page header (compare / food). */
  showProfileLede?: boolean;
}) {
  const { t, locale } = useLocale();

  return (
    <div className="bioactives-profiles">
      {foods.map((food) => {
        const entries = BIOACTIVE_COMPOUNDS.flatMap((compound) => {
          const value = bioactiveValue(food, compound);
          if (!notable(value)) return [];
          const amount = chipLabel(value, t.compare.notDetectedShort);
          if (amount === null) return [];
          return [{ compound, value, amount }];
        });

        return (
          <article key={food.id} className="bioactives-profile card">
            {foods.length > 1 ? <h3>{foodName(food, locale)}</h3> : null}
            {showProfileLede ? <p className="muted">{t.compare.bioactivesProfileLede}</p> : null}
            {entries.length === 0 ? (
              <p className="muted">{t.compare.bioactivesProfileEmpty}</p>
            ) : (
              <ul className="bioactive-chips">
                {entries.map(({ compound, value, amount }) => (
                  <li key={compound}>
                    <BioactiveChip compound={compound} value={value} amount={amount} showSources={showSources} />
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
