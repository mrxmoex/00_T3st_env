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
import { AXIS_LABELS, t } from "@/lib/i18n";
import type { ScoredFood } from "@/lib/schema";

type RadarRow = {
  axis: string;
  [foodId: string]: string | number;
};

function rows(foods: readonly ScoredFood[]): RadarRow[] {
  const first = foods[0];
  if (!first) return [];
  return first.axes.map((axis) => {
    const row: RadarRow = { axis: axis.axis };
    for (const food of foods) {
      const match = food.axes.find((item) => item.axis === axis.axis);
      row[food.food.id] = match?.score ?? 0;
    }
    return row;
  });
}

const COLORS = ["#d4a574", "#5aa7a7", "#c48472"];

export function AxisRadar({ foods }: { foods: readonly ScoredFood[] }) {
  const { locale } = useLocale();
  const data = rows(foods);

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke="#2c3038" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "#9b958b", fontSize: 11 }}
            tickFormatter={(value: string) =>
              t(AXIS_LABELS[value as keyof typeof AXIS_LABELS], locale)
            }
          />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={{ fill: "#9b958b", fontSize: 10 }}
            axisLine={false}
          />
          {foods.map((food, index) => (
            <Radar
              key={food.food.id}
              name={t(food.food.names, locale)}
              dataKey={food.food.id}
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.18}
            />
          ))}
          <Tooltip
            contentStyle={{
              background: "#14161a",
              border: "1px solid #2c3038",
              borderRadius: 8,
              color: "#ece8e1",
            }}
            labelFormatter={(value) =>
              t(AXIS_LABELS[String(value) as keyof typeof AXIS_LABELS], locale)
            }
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
