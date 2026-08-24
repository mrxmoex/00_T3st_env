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
import { useLocale } from "@/components/locale-provider";
import { AXIS_ORDER } from "@/lib/scoring";
import type { EvaluatedFood } from "@/types/catalog";

const COLORS = ["#c4b07a", "#7d9a6e", "#c17b5a", "#9b8ec4"];

export function RadarMatrix({ foods }: { foods: EvaluatedFood[] }) {
  const { copy } = useLocale();
  const data = AXIS_ORDER.map((axis) => {
    const row: Record<string, string | number> = { axis: copy.axes[axis] };
    for (const food of foods) {
      row[food.food.id] = food.scores[axis].adjusted;
    }
    return row;
  });

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke="#2c3026" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: "#9a9688", fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#9a9688", fontSize: 10 }} />
          {foods.map((food, index) => (
            <Radar
              key={food.food.id}
              name={food.food.name.en}
              dataKey={food.food.id}
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.18}
            />
          ))}
          <Tooltip
            contentStyle={{ background: "#151712", border: "1px solid #2c3026", color: "#ece8dc" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
