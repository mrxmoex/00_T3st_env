import { useId } from "react";
import { useLocale } from "../i18n/LocaleContext";
import { macroEnergyShares } from "../scoring/macroEnergy";
import type { FoodRecord } from "../scoring/types";

const SIZE = 28;

function arcPath(cx: number, cy: number, r: number, start: number, end: number): string {
  const s = polar(cx, cy, r, start);
  const e = polar(cx, cy, r, end);
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${s[0]} ${s[1]} A ${r} ${r} 0 ${large} 1 ${e[0]} ${e[1]} Z`;
}

function polar(cx: number, cy: number, r: number, angle: number): [number, number] {
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}

/** Small energy-split donut for legend rows (protein / fat / available carbs / fibre and other). */
export function MacroCompositionPie({ food }: { food: FoodRecord }) {
  const { t } = useLocale();
  const titleId = useId();
  const shares = macroEnergyShares(food);
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const r = SIZE / 2 - 1;

  const slices: { key: "protein" | "fat" | "carb" | "other"; pct: number; className: string }[] = [
    { key: "protein", pct: shares.protein, className: "macro-seg-protein" },
    { key: "fat", pct: shares.fat, className: "macro-seg-fat" },
    { key: "carb", pct: shares.carb, className: "macro-seg-carb" },
    { key: "other", pct: shares.other, className: "macro-seg-other" },
  ];

  let angle = -Math.PI / 2;
  const arcs = slices
    .filter((s) => s.pct > 0.5)
    .map((slice) => {
      const sweep = (slice.pct / 100) * Math.PI * 2;
      const path = arcPath(cx, cy, r, angle, angle + sweep);
      angle += sweep;
      return { ...slice, path };
    });

  const title = t.compare.macroShareCaption({
    protein: shares.protein.toFixed(0),
    fat: shares.fat.toFixed(0),
    carb: shares.carb.toFixed(0),
    other: shares.other.toFixed(0),
  });

  return (
    <span className="macro-comp-pie" title={title} aria-labelledby={titleId}>
      <span id={titleId} className="sr-only">
        {title}
      </span>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        {arcs.map((seg) => (
          <path key={seg.key} className={seg.className} d={seg.path} />
        ))}
        <circle className="macro-pie-hole" cx={cx} cy={cy} r={r * 0.45} />
      </svg>
    </span>
  );
}
