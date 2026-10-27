import { Link } from "react-router-dom";
import { useLocale } from "../i18n/LocaleContext";
import type { FoodRecord, ScoreCard } from "../scoring/types";
import {
  COMPARE_RADAR_KEYS,
  compareRadarLabels,
  compareRadarTip,
  compareRadarValue,
} from "./compareRadarAxes";
import { RadarChart } from "./RadarChart";

export interface CompareAxisRadarEntry {
  id: string;
  label: string;
  food: FoodRecord;
  card: ScoreCard;
}

export function CompareAxisRadar({ entries, title }: { entries: readonly CompareAxisRadarEntry[]; title: string }) {
  const { t } = useLocale();
  const labels = compareRadarLabels(t);

  return (
    <div className="compare-axis-radar">
      <RadarChart
        title={title}
        axes={COMPARE_RADAR_KEYS.map((key) => labels[key])}
        series={entries.map(({ id, label, food, card }) => ({
          id,
          label,
          values: COMPARE_RADAR_KEYS.map((key) => compareRadarValue(card, key)),
          tips: COMPARE_RADAR_KEYS.map((key) => compareRadarTip(card, key, label, t, food)),
        }))}
      />
      <p className="muted compare-radar-hint">
        {t.compare.axisRadarHint}{" "}
        <Link to="/method">{t.compare.axisRadarMethodLink}</Link>
      </p>
      {entries.length > 0 ? (
        <ul className="compare-radar-protein-legend" aria-label={t.compare.radarProteinLegendHeading}>
          {entries.map(({ id, label, card }, index) => (
            <li key={id} className={`series-${index + 1}`}>
              <strong>{label}</strong>{" "}
              {t.compare.radarProteinLegendLine({
                aas: card.eaa.aas,
                diaas: card.eaa.diaas,
                limiting: card.eaa.limitingAa.toUpperCase(),
              })}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
