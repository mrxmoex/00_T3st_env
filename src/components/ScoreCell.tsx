import { heatColor, heatText } from "../lib/heat";
import { useTheme } from "../state/theme";

export function ScoreCell({
  score,
  compact = false,
}: {
  score: number;
  compact?: boolean;
}) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const value = Math.round(score);
  return (
    <span
      className={`heat inline-flex items-center justify-center font-mono ${
        compact ? "h-8 min-w-10 px-1 text-xs" : "h-9 min-w-12 px-1.5 text-sm"
      }`}
      style={{ background: heatColor(score, dark), color: heatText(score, dark) }}
    >
      {value}
    </span>
  );
}
