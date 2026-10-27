import { useLocale } from "../i18n/LocaleContext";
import type { FoodRecord, ScoreCard } from "../scoring/types";
import { foodHonors } from "./foodHonors";

export function FoodHonorsList({ food, card }: { food: FoodRecord; card: ScoreCard }) {
  const { t, locale } = useLocale();
  const honors = foodHonors(food, card, t, locale);

  if (honors.length === 0) {
    return <p className="muted honor-line">{t.compare.honorsEmpty}</p>;
  }

  return (
    <p className="honor-line">
      {honors.map((honor) => (
        <span key={honor.key} className="honor-chip">
          {honor.stamp === "fibre" ? <span className="honor-stamp fibre-stamp" aria-hidden="true" /> : null}
          {honor.text}
        </span>
      ))}
    </p>
  );
}
