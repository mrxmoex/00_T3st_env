import { BIOACTIVE_COMPOUNDS, bioactiveValue, type BioactiveCompound, type BioactiveValue } from "../data/bioactives";
import { BIOACTIVE_LABELS, BIOACTIVE_ROLES, MEASURED_STATE_LABELS } from "../i18n/labels";
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

function BioactiveProvenance({ value }: { value: BioactiveValue }) {
  const { t, localize } = useLocale();
  switch (value.status) {
    case "value":
      return (
        <p className="bioactive-chip-source muted">
          {t.food.bioactiveColumns.measured}: {localize(value.measured)}
          {value.state === "unspecified" ? ` · ${localize(MEASURED_STATE_LABELS.unspecified)}` : null}
          {value.range ? ` · ${t.food.bioactiveRange(formatAmount(value.range[0]), formatAmount(value.range[1]))}` : null}
          {value.fromDryWeight ? ` · ${t.food.bioactiveDryWeight}` : null}
          <br />
          {t.food.bioactiveColumns.source}: <BioactiveSourceLink source={value.source} />
        </p>
      );
    case "notDetected":
      return (
        <p className="bioactive-chip-source muted">
          {t.food.bioactiveColumns.measured}: {localize(value.measured)}
          <br />
          {t.food.bioactiveColumns.source}: <BioactiveSourceLink source={value.source} />
        </p>
      );
    case "notExpected":
    case "noData":
      return null;
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
        <p className="bioactive-chip-source muted">{t.food.bioactiveRawValue}</p>
      ) : null}
      {showSources ? <BioactiveProvenance value={value} /> : null}
    </details>
  );
}

export function BioactivesProfile({
  foods,
  showSources = false,
  showProfileLede = false,
  markerKey = false,
}: {
  foods: readonly FoodRecord[];
  showSources?: boolean;
  /** When false, the lede lives in the page header (compare / food). */
  showProfileLede?: boolean;
  /** Explain `*` and n.d. under the cards, each only when it appears in them. */
  markerKey?: boolean;
}) {
  const { t, locale } = useLocale();

  const profiles = foods.map((food) => ({
    food,
    entries: BIOACTIVE_COMPOUNDS.flatMap((compound) => {
      const value = bioactiveValue(food, compound);
      const amount = chipLabel(value, t.compare.notDetectedShort);
      return amount === null ? [] : [{ compound, value, amount }];
    }),
  }));
  const shown = profiles.flatMap((profile) => profile.entries);
  const markers = [
    shown.some(({ value }) => value.status === "value" && value.rawValueForPreparedFood)
      ? t.compare.bioactiveMarkers.raw
      : null,
    shown.some(({ value }) => value.status === "notDetected") ? t.compare.bioactiveMarkers.notDetected : null,
  ].filter((marker): marker is string => marker !== null);

  return (
    <>
      <div className="bioactives-profiles">
        {profiles.map(({ food, entries }) => (
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
        ))}
      </div>
      {markerKey && markers.length > 0 ? <p className="marker-key muted">{markers.join(" · ")}</p> : null}
    </>
  );
}
