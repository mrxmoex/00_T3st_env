"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { axisName } from "@/lib/i18n";
import type { AxisId, FoodScore, Locale } from "@/lib/types";

const COLORS = ["#7ea05a", "#c46a3a", "#3d9b8f"];

export function RadarMatrix({
  scores,
  names,
  locale,
}: {
  scores: FoodScore[];
  names: string[];
  locale: Locale;
}) {
  const axes = Object.keys(scores[0]?.axes ?? {}) as AxisId[];
  const data = axes.map((axis) => {
    const point: Record<string, string | number> = { axis: axisName(locale, axis) };
    scores.forEach((score, index) => {
      point[`f${index}`] = Math.round(score.axes[axis].adjusted);
    });
    return point;
  });

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid stroke="#2a2e24" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: "#b7b09e", fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#8b8574", fontSize: 10 }} />
          {scores.map((score, index) => (
            <Radar
              key={score.foodId}
              name={names[index]}
              dataKey={`f${index}`}
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.18}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
