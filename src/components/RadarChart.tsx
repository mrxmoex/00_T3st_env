import { useId } from "react";

export interface RadarAxis {
  short: string;
  label: string;
}

export interface RadarSeries {
  id: string;
  label: string;
  values: readonly number[];
}

const WIDTH = 420;
const HEIGHT = 340;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const RADIUS = 112;
const LABEL_RADIUS = RADIUS + 16;
const RINGS = [25, 50, 75, 100] as const;
const MAX = 100;

function angleAt(index: number, count: number): number {
  return -Math.PI / 2 + (index * 2 * Math.PI) / count;
}

function pointAt(index: number, count: number, value: number, radius = RADIUS): [number, number] {
  const angle = angleAt(index, count);
  const r = (Math.min(MAX, Math.max(0, value)) / MAX) * radius;
  return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)];
}

function polygonPoints(values: readonly number[]): string {
  return values
    .map((value, index) => pointAt(index, values.length, value).map((n) => n.toFixed(1)).join(","))
    .join(" ");
}

function labelAnchor(angle: number): "start" | "middle" | "end" {
  const cos = Math.cos(angle);
  if (Math.abs(cos) < 0.2) return "middle";
  return cos > 0 ? "start" : "end";
}

function labelBaseline(angle: number): "auto" | "middle" | "hanging" {
  const sin = Math.sin(angle);
  if (sin < -0.5) return "auto";
  if (sin > 0.5) return "hanging";
  return "middle";
}

export function RadarChart({
  axes,
  series,
  title,
}: {
  axes: readonly RadarAxis[];
  series: readonly RadarSeries[];
  title: string;
}) {
  const titleId = useId();
  const count = axes.length;

  return (
    <figure className="radar">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby={titleId}>
        <title id={titleId}>{title}</title>
        {RINGS.map((ring) => (
          <polygon key={ring} className="radar-grid" points={polygonPoints(axes.map(() => ring))} />
        ))}
        {axes.map((axis, index) => {
          const [x, y] = pointAt(index, count, MAX);
          return <line key={axis.short} className="radar-grid" x1={CX} y1={CY} x2={x} y2={y} />;
        })}
        {RINGS.map((ring) => (
          <text key={ring} className="radar-tick" x={CX + 4} y={CY - (ring / MAX) * RADIUS - 2}>
            {ring}
          </text>
        ))}
        {axes.map((axis, index) => {
          const angle = angleAt(index, count);
          const [x, y] = pointAt(index, count, MAX, LABEL_RADIUS);
          return (
            <text
              key={axis.short}
              className="radar-label"
              x={x}
              y={y}
              textAnchor={labelAnchor(angle)}
              dominantBaseline={labelBaseline(angle)}
            >
              <title>{axis.label}</title>
              {axis.short}
            </text>
          );
        })}
        {series.map((item, seriesIndex) => (
          <g key={item.id} className={`radar-series series-${seriesIndex + 1}`}>
            <polygon className="radar-area" points={polygonPoints(item.values)} />
            {item.values.map((value, index) => {
              const [x, y] = pointAt(index, count, value);
              const axis = axes[index];
              return (
                <circle key={axis?.short ?? index} className="radar-dot" cx={x} cy={y} r={3.2}>
                  <title>{`${item.label} · ${axis?.label ?? ""}: ${value.toFixed(1)}`}</title>
                </circle>
              );
            })}
          </g>
        ))}
      </svg>
      {series.length > 1 ? (
        <figcaption>
          <ul className="radar-legend">
            {series.map((item, seriesIndex) => (
              <li key={item.id} className={`series-${seriesIndex + 1}`}>
                <span className="radar-swatch" aria-hidden="true" />
                {item.label}
              </li>
            ))}
          </ul>
        </figcaption>
      ) : null}
    </figure>
  );
}
