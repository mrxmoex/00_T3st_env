import { useId } from "react";
import { useLocale } from "../i18n/LocaleContext";
import { formatAmount } from "./format";
import type { CarbBreakdown } from "../scoring/types";
import type { FoodRecord } from "../scoring/types";

const SIZE = 44;

interface Segment {
  key: "sugar" | "starch" | "passive";
  grams: number;
  className: string;
}

function segmentsFor(food: FoodRecord, carb: CarbBreakdown): readonly Segment[] {
  const passiveG = carb.passiveG;
  return [
    { key: "sugar", grams: food.carbs.sugars, className: "carb-seg-sugar" },
    { key: "starch", grams: Math.max(0, carb.activeG - food.carbs.sugars), className: "carb-seg-starch" },
    { key: "passive", grams: passiveG, className: "carb-seg-passive" },
  ];
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polar(cx, cy, r, startAngle);
  const end = polar(cx, cy, r, endAngle);
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${start[0]} ${start[1]} A ${r} ${r} 0 ${large} 1 ${end[0]} ${end[1]} Z`;
}

function polar(cx: number, cy: number, r: number, angle: number): [number, number] {
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}

/** Composition of carbohydrate type for one food; not a 0–100 rank. */
export function CarbTypePie({ food, carb }: { food: FoodRecord; carb: CarbBreakdown }) {
  const { t } = useLocale();
  const titleId = useId();
  const segments = segmentsFor(food, carb);
  const total = segments.reduce((sum, seg) => sum + seg.grams, 0);
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const r = SIZE / 2 - 2;

  const title =
    total < 0.5
      ? t.compare.carbPie.quiet
      : t.compare.carbPie.title({
          sugar: formatAmount(food.carbs.sugars),
          starch: formatAmount(Math.max(0, carb.activeG - food.carbs.sugars)),
          passive: formatAmount(carb.passiveG),
        });

  if (total < 0.5) {
    return (
      <span className="carb-pie carb-pie-quiet" title={title} aria-labelledby={titleId}>
        <span id={titleId} className="sr-only">
          {title}
        </span>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
          <circle className="carb-seg-quiet" cx={cx} cy={cy} r={r - 4} />
        </svg>
      </span>
    );
  }

  let angle = -Math.PI / 2;
  const arcs = segments
    .filter((seg) => seg.grams > 0.01)
    .map((seg) => {
      const slice = (seg.grams / total) * Math.PI * 2;
      const path = arcPath(cx, cy, r, angle, angle + slice);
      angle += slice;
      return { ...seg, path };
    });

  return (
    <span className="carb-pie" title={title} aria-labelledby={titleId}>
      <span id={titleId} className="sr-only">
        {title}
      </span>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-hidden="true">
        {arcs.map((seg) => (
          <path key={seg.key} className={seg.className} d={seg.path} />
        ))}
        <circle className="carb-pie-hole" cx={cx} cy={cy} r={r * 0.38} />
      </svg>
    </span>
  );
}
