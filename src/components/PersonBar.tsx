import { useState } from "react";
import { useLocale } from "../i18n/LocaleContext";
import {
  ACTIVITIES,
  SWEAT_LEVELS,
  defaultPerson,
  energyKcal,
  parsePerson,
  proteinReferenceG,
  sweatSodiumMg,
  type Person,
  type Sex,
} from "../person/context";
import { usePerson } from "../person/PersonContext";

export function PersonBar() {
  const { t } = useLocale();
  const { person, setPerson } = usePerson();
  const [draft, setDraft] = useState<Person>(person ?? defaultPerson());
  const p = t.person;

  const update = (patch: Partial<Person>) => setDraft({ ...draft, ...patch });

  return (
    <details className="person-bar">
      <summary>{p.heading}</summary>
      <p className="muted">{p.lede}</p>
      <div className="person-fields">
        <label>
          {p.sex}
          <select value={draft.sex} onChange={(event) => update({ sex: event.target.value as Sex })}>
            <option value="female">{p.female}</option>
            <option value="male">{p.male}</option>
          </select>
        </label>
        <label>
          {p.age}
          <input
            type="number"
            min={15}
            max={100}
            value={draft.ageYears}
            onChange={(event) => update({ ageYears: Number(event.target.value) })}
          />
        </label>
        <label>
          {p.weight}
          <input
            type="number"
            min={30}
            max={250}
            value={draft.weightKg}
            onChange={(event) => update({ weightKg: Number(event.target.value) })}
          />
        </label>
        <label>
          {p.height}
          <input
            type="number"
            min={120}
            max={230}
            value={draft.heightCm}
            onChange={(event) => update({ heightCm: Number(event.target.value) })}
          />
        </label>
        <label>
          {p.activity}
          <select value={draft.activity} onChange={(event) => update({ activity: event.target.value as Person["activity"] })}>
            {ACTIVITIES.map((activity) => (
              <option key={activity} value={activity}>
                {p.activities[activity]}
              </option>
            ))}
          </select>
        </label>
        <label>
          {p.sweat}
          <select value={draft.sweat} onChange={(event) => update({ sweat: event.target.value as Person["sweat"] })}>
            {SWEAT_LEVELS.map((level) => (
              <option key={level} value={level}>
                {p.sweatLevels[level]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="btn"
          onClick={() => {
            const parsed = parsePerson(draft);
            if (parsed) setPerson(parsed);
          }}
        >
          {p.apply}
        </button>
        <button type="button" className="btn" onClick={() => setPerson(null)}>
          {p.clear}
        </button>
      </div>
      {person ? (
        <p className="muted">
          {p.summary({
            energy: Math.round(energyKcal(person)),
            protein: Math.round(proteinReferenceG(person)),
            sodiumLow: Math.round(sweatSodiumMg(person)[0]),
            sodiumHigh: Math.round(sweatSodiumMg(person)[1]),
          })}
        </p>
      ) : null}
    </details>
  );
}
