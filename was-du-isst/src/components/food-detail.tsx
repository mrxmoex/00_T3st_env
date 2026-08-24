"use client";

import { KingdomBadge, TierMark } from "@/components/kingdom-badge";
import { RadarMatrix } from "@/components/radar-matrix";
import { SourceCite } from "@/components/source-cite";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";
import { AXIS_ORDER } from "@/lib/scoring";
import type { EvaluatedFood } from "@/types/catalog";

export function FoodDetail({ food }: { food: EvaluatedFood }) {
  const { locale, copy } = useLocale();
  const n = food.food.nutrients;

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <TierMark tier={food.acrossClassTier} />
          <KingdomBadge category={food.food.category} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{t(food.food.name, locale)}</h1>
        <p className="text-sm text-muted">
          USDA NDB {food.food.usdaNdb} · {food.food.usdaDescription} · {copy.per100g}
        </p>
        <SourceCite ids={food.food.nutrientSourceIds} />
      </header>

      <RadarMatrix foods={[food]} />

      <section className="grid gap-3 sm:grid-cols-2">
        {AXIS_ORDER.map((axis) => {
          const score = food.scores[axis];
          return (
            <div key={axis} className="rounded-lg border border-line bg-bg-elev p-4">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-sm font-medium">{copy.axes[axis]}</h2>
                <span className="font-mono text-brass">{score.adjusted.toFixed(1)}</span>
              </div>
              <p className="mt-2 text-xs text-muted">{copy.axisHint[axis]}</p>
              <p className="mt-2 text-sm">{t(score.rationale, locale)}</p>
              <div className="mt-2">
                <SourceCite ids={score.sourceIds} />
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-muted">
                {score.tradeoffs.map((item) => (
                  <li key={item.en}>{t(item, locale)}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="rounded-lg border border-line bg-bg-elev p-4">
        <h2 className="text-sm uppercase tracking-wide text-muted">{copy.per100g}</h2>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          <Fact label="kcal" value={n.energyKcal} />
          <Fact label="protein g" value={n.proteinG} />
          <Fact label="fiber g" value={n.fiberG} />
          <Fact label="sugars g" value={n.sugarsG} />
          <Fact label="Fe mg" value={n.feMg} />
          <Fact label="Zn mg" value={n.znMg} />
          <Fact label="Ca mg" value={n.caMg} />
          <Fact label="C mg" value={n.vitCMg} />
          <Fact label="folate µg" value={n.folateUg} />
          <Fact label="B12 µg" value={n.vitB12Ug} />
          <Fact label="RAE µg" value={n.vitARaeUg} />
          <Fact label="retinol µg" value={n.retinolUg} />
          <Fact label="EPA g" value={n.epaG} />
          <Fact label="DHA g" value={n.dhaG} />
          <Fact label="ALA g" value={n.alaG} />
        </dl>
        <p className="mt-4 text-sm">
          {copy.diaas} {food.food.proteinQuality.diaas.toFixed(2)} · {copy.limiting}{" "}
          {food.food.proteinQuality.limitingAA} · {copy.confidenceMap[food.food.proteinQuality.confidence]}
        </p>
        <p className="mt-2 text-sm text-muted">{t(food.food.proteinQuality.notes, locale)}</p>
        <SourceCite ids={food.food.proteinQuality.sourceIds} />
      </section>

      {food.food.dataGaps.length > 0 && (
        <section className="rounded-lg border border-warn/40 bg-bg-elev p-4 text-sm">
          <h2 className="text-warn">{copy.confidence}</h2>
          <ul className="mt-2 list-disc pl-4 text-muted">
            {food.food.dataGaps.map((gap) => (
              <li key={gap.en}>{t(gap, locale)}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

function Fact({ label, value }: { label: string; value: number | null }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-mono">{value === null ? "—" : value}</dd>
    </div>
  );
}
