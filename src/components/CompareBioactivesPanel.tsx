import { useLocale } from "../i18n/LocaleContext";
import type { FoodRecord } from "../scoring/types";
import { BioactivesProfile } from "./BioactivesProfile";

export function CompareBioactivesPanel({ foods }: { foods: readonly FoodRecord[] }) {
  const { t } = useLocale();
  return (
    <>
      <p className="muted">{t.compare.bioactivesHint}</p>
      <BioactivesProfile foods={foods} showSources markerKey />
    </>
  );
}
