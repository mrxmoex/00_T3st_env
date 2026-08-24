import type { AxisBreakdown, Food } from "../data/types";

export function SourcePanel({
  food,
  breakdowns,
}: {
  food: Food;
  breakdowns?: AxisBreakdown[];
}) {
  return (
    <details className="border border-stone-300 bg-white/70 p-3 text-sm dark:border-ink-600 dark:bg-ink-900/60">
      <summary className="cursor-pointer font-medium text-copper-700 dark:text-copper-400">
        Source &amp; method
      </summary>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
            Citations
          </h3>
          <ul className="mt-1 space-y-1">
            {food.sources.map((source) => (
              <li key={source.id}>
                <a className="underline decoration-stone-500 underline-offset-2" href={source.url}>
                  {source.label}
                </a>
                <span className="text-stone-500"> · retrieved {source.retrieved}</span>
                {source.notes ? <p className="text-stone-500">{source.notes}</p> : null}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-stone-500">
            Quality method: {food.proteinQuality.method} = {food.proteinQuality.value.toFixed(2)}
            {food.estimateFlags.length > 0
              ? ` · flags: ${food.estimateFlags.join(", ")}`
              : ""}
          </p>
          <p className="text-stone-500">Last verified {food.lastVerified}.</p>
        </div>
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
            Applied coefficients
          </h3>
          <ul className="mt-1 space-y-1 text-stone-600 dark:text-stone-400">
            {(breakdowns ?? []).flatMap((axis) =>
              axis.flags
                .filter((flag) => flag.applied)
                .map((flag) => (
                  <li key={`${axis.score}-${flag.key}`}>
                    <span className="font-mono text-xs">{flag.key}</span> × {flag.value} — {flag.reason}
                  </li>
                )),
            )}
          </ul>
        </div>
      </div>
    </details>
  );
}
