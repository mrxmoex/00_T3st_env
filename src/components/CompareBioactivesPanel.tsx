import { useLocale } from "../i18n/LocaleContext";
import type { FoodRecord } from "../scoring/types";
import { BioactivesProfile } from "./BioactivesProfile";

export function CompareBioactivesPanel({ foods }: { foods: readonly FoodRecord[] }) {
  const { t } = useLocale();
  return (
    <>
      <p className="muted">{t.compare.bioactivesSubtitle}</p>
      <p className="muted">{t.compare.bioactivesHint}</p>
      <p className="muted">{t.compare.bioactivesProfileLede}</p>
      <BioactivesProfile foods={foods} />
    </>
  );
}
