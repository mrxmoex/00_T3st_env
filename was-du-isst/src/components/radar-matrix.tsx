"use client";

import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";
import { AXIS_ORDER } from "@/lib/scoring";
import type { EvaluatedFood } from "@/types/catalog";

const COLORS = ["#c4b07a", "#7d9a6e", "#c17b5a", "#9b8ec4"];

function point(cx: number, cy: number, radius: number, index: number, total: number): { x: number; y: number } {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / total;
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

export function RadarMatrix({ foods }: { foods: EvaluatedFood[] }) {
  const { locale, copy } = useLocale();
  const size = 360;
  const cx = size / 2;
  const cy = size / 2 + 8;
  const maxR = 118;
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <div className="rounded-lg border border-line bg-bg-elev p-3">
      <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-72 w-full max-w-md text-muted" role="img">
        <title>{foods.map((food) => t(food.food.name, locale)).join(" · ")}</title>
        {rings.map((ring) => {
          const pts = AXIS_ORDER.map((_, index) => {
            const p = point(cx, cy, maxR * ring, index, AXIS_ORDER.length);
            return `${p.x},${p.y}`;
          }).join(" ");
          return <polygon key={ring} points={pts} fill="none" stroke="#2c3026" />;
        })}
        {AXIS_ORDER.map((axis, index) => {
          const p = point(cx, cy, maxR, index, AXIS_ORDER.length);
          const label = point(cx, cy, maxR + 22, index, AXIS_ORDER.length);
          return (
            <g key={axis}>
              <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#2c3026" />
              <text x={label.x} y={label.y} textAnchor="middle" fontSize="8" fill="#9a9688">
                {copy.axes[axis]}
              </text>
            </g>
          );
        })}
        {foods.map((food, foodIndex) => {
          const pts = AXIS_ORDER.map((axis, index) => {
            const p = point(cx, cy, (food.scores[axis].adjusted / 100) * maxR, index, AXIS_ORDER.length);
            return `${p.x},${p.y}`;
          }).join(" ");
          const color = COLORS[foodIndex % COLORS.length];
          return (
            <polygon
              key={food.food.id}
              points={pts}
              fill={color}
              fillOpacity={0.18}
              stroke={color}
              strokeWidth={1.5}
            />
          );
        })}
      </svg>
      <ul className="mt-2 flex flex-wrap justify-center gap-3 text-xs">
        {foods.map((food, index) => (
          <li key={food.food.id} className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
            {t(food.food.name, locale)}
          </li>
        ))}
      </ul>
    </div>
  );
}
