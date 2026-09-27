import { useLocale } from "../i18n/LocaleContext";
import {
  ANIMAL_CLASSES,
  AXIS_KEYS,
  DIETARY_PATTERNS,
  PLANT_CLASSES,
  type AxisKey,
  type DietaryPattern,
  type FoodClass,
  type Kingdom,
} from "../scoring/types";

export interface FilterState {
  query: string;
  kingdom: "all" | Kingdom;
  foodClass: "all" | FoodClass;
  pattern: DietaryPattern;
  sortAxis: AxisKey;
}

export function Filters({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const { t } = useLocale();

  return (
    <div className="toolbar" role="search">
      <label>
        {t.filters.search}
        <input
          type="search"
          value={value.query}
          placeholder={t.filters.searchPlaceholder}
          onChange={(event) => onChange({ ...value, query: event.target.value })}
        />
      </label>
      <label>
        {t.filters.kingdom}
        <select
          value={value.kingdom}
          onChange={(event) =>
            onChange({
              ...value,
              kingdom: event.target.value as FilterState["kingdom"],
              foodClass: "all",
            })
          }
        >
          <option value="all">{t.filters.allClasses}</option>
          <option value="plant">{t.filters.plantOnly}</option>
          <option value="animal">{t.filters.animalOnly}</option>
        </select>
      </label>
      <label>
        {t.filters.foodClass}
        <select
          value={value.foodClass}
          onChange={(event) =>
            onChange({ ...value, foodClass: event.target.value as FilterState["foodClass"] })
          }
        >
          <option value="all">{t.filters.all}</option>
          <optgroup label={t.kingdoms.plant}>
            {PLANT_CLASSES.map((foodClass) => (
              <option key={foodClass} value={foodClass}>
                {t.classes[foodClass]}
              </option>
            ))}
          </optgroup>
          <optgroup label={t.kingdoms.animal}>
            {ANIMAL_CLASSES.map((foodClass) => (
              <option key={foodClass} value={foodClass}>
                {t.classes[foodClass]}
              </option>
            ))}
          </optgroup>
        </select>
      </label>
      <label>
        {t.filters.pattern}
        <select
          value={value.pattern}
          onChange={(event) =>
            onChange({ ...value, pattern: event.target.value as DietaryPattern })
          }
        >
          {DIETARY_PATTERNS.map((pattern) => (
            <option key={pattern} value={pattern}>
              {t.patterns[pattern]}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t.filters.sortAxis}
        <select
          value={value.sortAxis}
          onChange={(event) =>
            onChange({ ...value, sortAxis: event.target.value as AxisKey })
          }
        >
          {AXIS_KEYS.map((axis) => (
            <option key={axis} value={axis}>
              {t.axes[axis]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
