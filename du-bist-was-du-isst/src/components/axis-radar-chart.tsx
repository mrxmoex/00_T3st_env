"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";
import type { EvaluationAxis, FoodItem } from "@/lib/types";
import { EVALUATION_AXES } from "@/lib/types";
import { getAxisLabel } from "@/i18n/messages";
import type { Locale } from "@/lib/types";

interface AxisRadarChartProps {
  foods: FoodItem[];
  locale: Locale;
  maxFoods?: number;
}

const AXIS_SHORT: Record<EvaluationAxis, Record<Locale, string>> = {
  nutrient_density: { de: "Nährst.", en: "Nutr." },
  protein_quality: { de: "Protein", en: "Protein" },
  essential_fatty_acids: { de: "EFA", en: "EFA" },
  carbohydrate_quality: { de: "KH-Qual.", en: "Carb Q." },
  bioavailability_antinutrients: { de: "Bioverf.", en: "Bioavail." },
  unique_bioactives: { de: "Bioakt.", en: "Bioact." },
  practical_efficiency: { de: "Prakt.", en: "Pract." },
};

export function AxisRadarChart({ foods, locale, maxFoods = 3 }: AxisRadarChartProps) {
  const displayFoods = foods.slice(0, maxFoods);
  const colors = ["#34d399", "#60a5fa", "#f472b6"];

  const data = EVALUATION_AXES.map((axis) => {
    const point: Record<string, string | number> = {
      axis: AXIS_SHORT[axis][locale],
      fullLabel: getAxisLabel(axis, locale),
    };
    displayFoods.forEach((food) => {
      point[food.id] = food.axisScores[axis].adjusted;
    });
    return point;
  });

  return (
    <ResponsiveContainer width="100%" height={360}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="oklch(1 0 0 / 15%)" />
        <PolarAngleAxis dataKey="axis" tick={{ fill: "oklch(0.708 0 0)", fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "oklch(0.556 0 0)", fontSize: 10 }} />
        <RechartsTooltip
          contentStyle={{
            background: "oklch(0.205 0 0)",
            border: "1px solid oklch(1 0 0 / 10%)",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(value, _name, props) => [
            `${value}`,
            props.payload?.fullLabel ?? "",
          ]}
        />
        {displayFoods.map((food, i) => (
          <Radar
            key={food.id}
            name={food.name[locale]}
            dataKey={food.id}
            stroke={colors[i]}
            fill={colors[i]}
            fillOpacity={0.2}
            strokeWidth={2}
          />
        ))}
        <Legend wrapperStyle={{ fontSize: 12, color: "oklch(0.708 0 0)" }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
