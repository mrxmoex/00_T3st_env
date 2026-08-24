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
import { AXIS_LABELS, CLASS_LABELS, PATTERN_LABELS } from "../ui/labels";

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
  return (
    <div className="toolbar" role="search">
      <label>
        Search
        <input
          type="search"
          value={value.query}
          placeholder="Spinach, Leber…"
          onChange={(event) => onChange({ ...value, query: event.target.value })}
        />
      </label>
      <label>
        Kingdom
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
          <option value="all">All classes</option>
          <option value="plant">Plant classes only</option>
          <option value="animal">Animal classes only</option>
        </select>
      </label>
      <label>
        Food class
        <select
          value={value.foodClass}
          onChange={(event) =>
            onChange({ ...value, foodClass: event.target.value as FilterState["foodClass"] })
          }
        >
          <option value="all">All</option>
          <optgroup label="Plant">
            {PLANT_CLASSES.map((foodClass) => (
              <option key={foodClass} value={foodClass}>
                {CLASS_LABELS[foodClass]}
              </option>
            ))}
          </optgroup>
          <optgroup label="Animal">
            {ANIMAL_CLASSES.map((foodClass) => (
              <option key={foodClass} value={foodClass}>
                {CLASS_LABELS[foodClass]}
              </option>
            ))}
          </optgroup>
        </select>
      </label>
      <label>
        Dietary pattern
        <select
          value={value.pattern}
          onChange={(event) =>
            onChange({ ...value, pattern: event.target.value as DietaryPattern })
          }
        >
          {DIETARY_PATTERNS.map((pattern) => (
            <option key={pattern} value={pattern}>
              {PATTERN_LABELS[pattern]}
            </option>
          ))}
        </select>
      </label>
      <label>
        Sort axis
        <select
          value={value.sortAxis}
          onChange={(event) =>
            onChange({ ...value, sortAxis: event.target.value as AxisKey })
          }
        >
          {AXIS_KEYS.map((axis) => (
            <option key={axis} value={axis}>
              {AXIS_LABELS[axis]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
