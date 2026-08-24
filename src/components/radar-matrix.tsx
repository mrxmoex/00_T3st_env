"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AXIS_IDS } from "@/lib/types";
import { AXIS_SHORT, t } from "@/lib/i18n";
import type { EvaluatedFood, Locale } from "@/lib/types";

type RadarMatrixProps = {
  rows: readonly EvaluatedFood[];
  locale: Locale;
  mode?: "adjusted" | "raw";
};

const COLORS = ["#d4b46a", "#8fa87c", "#c46a55", "#7ea0b8"];

export function RadarMatrix({ rows, locale, mode = "adjusted" }: RadarMatrixProps) {
  const data = AXIS_IDS.map((axis) => {
    const point: Record<string, string | number> = {
      axis: t(AXIS_SHORT[axis], locale),
    };
    rows.forEach((row, index) => {
      point[`f${index}`] = Math.round(mode === "adjusted" ? row.axes[axis].adjusted : row.axes[axis].raw);
    });
    return point;
  });

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke="#2a3228" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: "#c9c2b3", fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#6f6a60", fontSize: 10 }} />
          {rows.map((row, index) => (
            <Radar
              key={row.food.id}
              name={t(row.food.name, locale)}
              dataKey={`f${index}`}
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.18}
            />
          ))}
          <Tooltip
            contentStyle={{ background: "#141814", border: "1px solid #2a3228", color: "#e7e2d6" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
