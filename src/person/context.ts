/**
 * A person's context for reading a food. These are published estimation methods,
 * not allowances and not advice. Two people do not share one daily amount.
 */

export const SEXES = ["female", "male"] as const;
export type Sex = (typeof SEXES)[number];

export const ACTIVITIES = ["seated", "active", "heavy"] as const;
export type Activity = (typeof ACTIVITIES)[number];

export const SWEAT_LEVELS = ["little", "some", "aLot"] as const;
export type SweatLevel = (typeof SWEAT_LEVELS)[number];

export interface Person {
  sex: Sex;
  ageYears: number;
  weightKg: number;
  heightCm: number;
  activity: Activity;
  sweat: SweatLevel;
}

export const PERSON_STORAGE_KEY = "dbwdi-person";

/**
 * FAO/WHO/UNU 2004 lifestyle ranges, as one value inside each range.
 * Seated 1.40–1.69, active 1.70–1.99, vigorous 2.00–2.40.
 */
export const ACTIVITY_PAL: Readonly<Record<Activity, number>> = {
  seated: 1.5,
  active: 1.75,
  heavy: 2.1,
};

/**
 * Protein reference points, g per kg body weight per day.
 * Seated: EFSA adult PRI 0.83 g/kg. Active and heavy: the lower and mid published
 * ranges used for people who train (about 1.2 and 1.6 g/kg). Reference points, not targets.
 */
export const PROTEIN_G_PER_KG: Readonly<Record<Activity, number>> = {
  seated: 0.83,
  active: 1.2,
  heavy: 1.6,
};

/**
 * Whole-body sweat sodium is about 10–70 mmol/L (Baker 2017, Sports Med).
 * 1 mmol sodium = 23 mg. The sweat volumes are the levels a person can pick, not measurements.
 */
export const SWEAT_SODIUM_MMOL_PER_L = { low: 10, high: 70 } as const;
export const SWEAT_LITRES: Readonly<Record<SweatLevel, number>> = {
  little: 0.3,
  some: 1,
  aLot: 2,
};

const SODIUM_MG_PER_MMOL = 23;

/** Mifflin–St Jeor 1990, kcal/day. Men +5, women −161. */
export function restingEnergyKcal(person: Person): number {
  const sexConstant = person.sex === "male" ? 5 : -161;
  return 10 * person.weightKg + 6.25 * person.heightCm - 5 * person.ageYears + sexConstant;
}

/** Resting energy × the physical activity level of the chosen lifestyle. */
export function energyKcal(person: Person): number {
  return restingEnergyKcal(person) * ACTIVITY_PAL[person.activity];
}

export function proteinReferenceG(person: Person): number {
  return PROTEIN_G_PER_KG[person.activity] * person.weightKg;
}

/** Sodium carried in the sweat volume the person described, as a low–high range in mg. */
export function sweatSodiumMg(person: Person): readonly [number, number] {
  const litres = SWEAT_LITRES[person.sweat];
  return [
    litres * SWEAT_SODIUM_MMOL_PER_L.low * SODIUM_MG_PER_MMOL,
    litres * SWEAT_SODIUM_MMOL_PER_L.high * SODIUM_MG_PER_MMOL,
  ];
}

export function defaultPerson(): Person {
  return { sex: "female", ageYears: 35, weightKg: 65, heightCm: 168, activity: "active", sweat: "some" };
}

function inRange(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

export function parsePerson(raw: unknown): Person | null {
  if (typeof raw !== "object" || raw === null) return null;
  const value = raw as Partial<Person>;
  if (value.sex !== "female" && value.sex !== "male") return null;
  if (value.activity !== "seated" && value.activity !== "active" && value.activity !== "heavy") return null;
  if (value.sweat !== "little" && value.sweat !== "some" && value.sweat !== "aLot") return null;
  if (!inRange(value.ageYears ?? NaN, 15, 100)) return null;
  if (!inRange(value.weightKg ?? NaN, 30, 250)) return null;
  if (!inRange(value.heightCm ?? NaN, 120, 230)) return null;
  return {
    sex: value.sex,
    ageYears: value.ageYears ?? 0,
    weightKg: value.weightKg ?? 0,
    heightCm: value.heightCm ?? 0,
    activity: value.activity,
    sweat: value.sweat,
  };
}

export function readPerson(): Person | null {
  try {
    const stored = localStorage.getItem(PERSON_STORAGE_KEY);
    return stored === null ? null : parsePerson(JSON.parse(stored));
  } catch {
    return null;
  }
}

export function writePerson(person: Person | null): void {
  if (person === null) localStorage.removeItem(PERSON_STORAGE_KEY);
  else localStorage.setItem(PERSON_STORAGE_KEY, JSON.stringify(person));
}
