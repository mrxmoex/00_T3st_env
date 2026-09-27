import type { ScoreCard } from "../scoring/types";
import { AXIS_KEYS } from "../scoring/types";
import { AXIS_LABELS, AXIS_SHORT } from "../ui/labels";
import { axisValue } from "./MatrixTable";
import { RadarChart } from "./RadarChart";

const RADAR_AXES = AXIS_KEYS.filter((axis) => axis !== "composite");

export interface AxisRadarEntry {
  id: string;
  label: string;
  card: ScoreCard;
}

export function AxisRadar({ entries, title }: { entries: readonly AxisRadarEntry[]; title: string }) {
  return (
    <RadarChart
      title={title}
      axes={RADAR_AXES.map((axis) => ({ short: AXIS_SHORT[axis], label: AXIS_LABELS[axis] }))}
      series={entries.map(({ id, label, card }) => ({
        id,
        label,
        values: RADAR_AXES.map((axis) => axisValue(card, axis)),
      }))}
    />
  );
}
