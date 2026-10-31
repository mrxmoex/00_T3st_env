import { useId } from "react";

export interface RadarAxis {
  short: string;
  label: string;
}

export interface RadarSeries {
  id: string;
  label: string;
  values: readonly number[];
  /** Hover text per spoke. Falls back to the 0–100 length. */
  tips?: readonly string[];
}

const WIDTH = 420;
const HEIGHT = 340;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const RADIUS = 112;
const LABEL_RADIUS = RADIUS + 16;
export const RINGS = [25, 50, 75, 100] as const;
const MAX = 100;
const CENTER_LINE = 16;
const CENTER_WIDTH = 186;
const CENTER_PAD_Y = 8;

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

export interface RadarCenterLine {
  text: string;
  seriesClass?: string;
}

export function RadarChart({
  axes,
  series,
  title,
  center,
  hideLegend = false,
  tickLabel = (ring: number) => String(ring),
}: {
  axes: readonly RadarAxis[];
  series: readonly RadarSeries[];
  title: string;
  /** Energy or other absolute values drawn in the middle of the polygon. */
  center?: readonly RadarCenterLine[];
  hideLegend?: boolean;
  /** Label for a ring at this percentage of the full spoke; only meaningful when every spoke shares one scale. */
  tickLabel?: (ring: number) => string;
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
          return (
            <line
              key={axis.short}
              className="radar-spoke"
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        {center === undefined
          ? RINGS.map((ring) => (
              <text key={ring} className="radar-tick" x={CX + 4} y={CY - (ring / MAX) * RADIUS - 2}>
                {tickLabel(ring)}
              </text>
            ))
          : null}
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
              const tip = item.tips?.[index] ?? `${item.label} · ${axis?.label ?? ""}: ${value.toFixed(1)}`;
              return (
                <circle key={axis?.short ?? index} className="radar-dot" cx={x} cy={y} r={3.2}>
                  <title>{tip}</title>
                </circle>
              );
            })}
          </g>
        ))}
        {center && center.length > 0 ? (
          <g className="radar-center">
            <rect
              className="radar-center-plate"
              x={CX - CENTER_WIDTH / 2}
              y={CY - (center.length * CENTER_LINE) / 2 - CENTER_PAD_Y}
              width={CENTER_WIDTH}
              height={center.length * CENTER_LINE + CENTER_PAD_Y * 2}
              rx={8}
            />
            {center.map((line, index) => (
              <text
                key={`${line.seriesClass ?? "center"}-${index}`}
                className={line.seriesClass ? `radar-center-text ${line.seriesClass}` : "radar-center-text"}
                x={CX}
                y={CY - ((center.length - 1) * CENTER_LINE) / 2 + index * CENTER_LINE}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {line.text}
              </text>
            ))}
          </g>
        ) : null}
      </svg>
      {!hideLegend && series.length > 1 ? (
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
