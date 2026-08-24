import { AXIS_LABELS, t } from "@/lib/i18n";
import type { LocaleCode, ScoredFood } from "@/lib/schema";

const COLORS = ["#d4a574", "#5aa7a7", "#c48472"] as const;
const SIZE = 380;
const CX = 190;
const CY = 190;
const RADIUS = 112;

function polar(index: number, total: number, value: number): [number, number] {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const radius = (RADIUS * value) / 100;
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)];
}

function pointsFor(total: number, value: number): string {
  return Array.from({ length: total }, (_, index) => polar(index, total, value).join(",")).join(
    " ",
  );
}

export function AxisRadar({
  foods,
  locale,
}: {
  foods: readonly ScoredFood[];
  locale: LocaleCode;
}) {
  const first = foods[0];
  if (!first) {
    return null;
  }
  const axes = first.axes;
  const total = axes.length;

  return (
    <svg
      role="img"
      data-radar="1"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-72 w-full min-w-[16rem] sm:h-80"
      aria-label={foods.map((food) => t(food.food.names, locale)).join(" vs ")}
    >
      {[25, 50, 75, 100].map((ring) => (
        <polygon
          key={ring}
          fill="none"
          stroke="#2c3038"
          points={pointsFor(total, ring)}
        />
      ))}
      {axes.map((axis, index) => {
        const [x, y] = polar(index, total, 100);
        const [labelX, labelY] = polar(index, total, 128);
        return (
          <g key={axis.axis}>
            <line x1={CX} y1={CY} x2={x} y2={y} stroke="#2c3038" />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#9b958b"
              fontSize="10"
            >
              {t(AXIS_LABELS[axis.axis], locale)}
            </text>
          </g>
        );
      })}
      {foods.map((food, foodIndex) => {
        const color = COLORS[foodIndex % COLORS.length];
        const points = food.axes
          .map((axis, index) => polar(index, total, axis.score).join(","))
          .join(" ");
        return (
          <polygon
            key={food.food.id}
            data-food-radar={food.food.id}
            points={points}
            fill={color}
            fillOpacity={0.18}
            stroke={color}
            strokeWidth={2}
          />
        );
      })}
    </svg>
  );
}
