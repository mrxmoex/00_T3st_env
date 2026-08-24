"use client";

import { CATALOG } from "@/lib/catalog";
import { CATEGORY_BLURB, CATEGORY_LABELS } from "@/lib/ontology";
import { AXIS_LABELS, t, UI } from "@/lib/i18n";
import { AXIS_IDS } from "@/lib/types";
import { useLocale } from "./locale-context";
import { RadarMatrix } from "./radar-matrix";
import { AxisNotes, MultiplierBar, TierBadge, TradeoffList } from "./tier-table";
import { SourceChip, SourceStack } from "./source-chip";
export function FoodDetail({ id }: { id: string }) {
  const { locale } = useLocale();
  const row = CATALOG.find((item) => item.food.id === id);
  if (!row) {
    return <p className="text-muted">Unknown food.</p>;
  }
  const food = row.food;

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted">
          {t(CATEGORY_LABELS[food.category], locale)}
        </p>
        <h1 className="font-serif text-4xl">{t(food.name, locale)}</h1>
        <p className="max-w-2xl text-sm text-muted">{t(CATEGORY_BLURB[food.category], locale)}</p>
        <div className="flex flex-wrap items-center gap-2">
          <TierBadge tier={row.globalTier} />
          <span className="text-xs text-muted">{t(UI.acrossClasses, locale)}</span>
          <TierBadge tier={row.classTier} />
          <span className="text-xs text-muted">{t(UI.withinClass, locale)}</span>
          {food.fdcId ? (
            <a
              href={`https://fdc.nal.usda.gov/food-details/${food.fdcId}/nutrients`}
              className="text-xs text-gold underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {t(UI.fdc, locale)} {food.fdcId}
            </a>
          ) : null}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-line bg-surface p-4">
          <RadarMatrix rows={[row]} locale={locale} />
        </div>
        <div className="space-y-3 rounded-md border border-line bg-surface p-4">
          <p className="text-xs uppercase text-muted">{t(UI.multipliers, locale)}</p>
          <MultiplierBar row={row} locale={locale} />
          <TradeoffList row={row} locale={locale} />
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <Fact
          label={`${t(UI.per100g, locale)} · kcal`}
          value={`${food.energyKcal.amount}`}
          sourceId={food.energyKcal.sourceId}
          locale={locale}
        />
        <Fact
          label={locale === "de" ? "Protein" : "Protein"}
          value={`${food.proteinG.amount} g`}
          sourceId={food.proteinG.sourceId}
          locale={locale}
        />
        <Fact
          label={t(UI.method, locale)}
          value={`${food.proteinQuality.method} ${food.proteinQuality.score.toFixed(2)}`}
          sourceId={food.proteinQuality.sourceId}
          locale={locale}
        />
      </section>

      <p className="text-sm text-muted">
        {t(UI.limiting, locale)}: {food.proteinQuality.limitingAA.join(", ") || "—"}
        {food.proteinQuality.flag ? ` · ${t(UI[flagKey(food.proteinQuality.flag)], locale)}` : ""}
      </p>

      <section>
        <h2 className="mb-2 font-serif text-2xl">{t(UI.navMatrix, locale)}</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {AXIS_IDS.map((axis) => (
            <li key={axis} className="rounded-sm border border-line bg-surface px-3 py-2 text-sm">
              <div className="flex justify-between gap-2">
                <span>{t(AXIS_LABELS[axis], locale)}</span>
                <span className="font-mono text-gold">
                  {row.axes[axis].adjusted.toFixed(0)}
                  <span className="text-muted">/{row.axes[axis].raw.toFixed(0)}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <AxisNotes row={row} locale={locale} />

      <section>
        <h2 className="mb-2 font-serif text-2xl">{locale === "de" ? "Bioaktive" : "Bioactives"}</h2>
        <ul className="space-y-2">
          {food.bioactives.map((item) => (
            <li key={item.id} className="rounded-sm border border-line bg-surface p-3">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <strong>{t(item.name, locale)}</strong>
                <SourceChip sourceId={item.sourceId} locale={locale} />
              </div>
              <p className="text-sm text-cream/85">{t(item.notes, locale)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 font-serif text-2xl">{locale === "de" ? "Zubereitung" : "Preparation"}</h2>
        {food.preparation.map((step) => (
          <div key={step.method.en} className="mb-2 rounded-sm border border-line bg-surface p-3">
            <p className="font-medium">{t(step.method, locale)}</p>
            <p className="text-sm text-cream/85">{t(step.notes, locale)}</p>
            <div className="mt-2">
              <SourceStack sourceIds={step.sourceIds} locale={locale} />
            </div>
          </div>
        ))}
      </section>
    </article>
  );
}

function Fact({
  label,
  value,
  sourceId,
  locale,
}: {
  label: string;
  value: string;
  sourceId: string;
  locale: "de" | "en";
}) {
  return (
    <div className="rounded-md border border-line bg-surface p-3">
      <p className="text-[10px] uppercase text-muted">{label}</p>
      <p className="font-mono text-lg text-cream">{value}</p>
      <SourceChip sourceId={sourceId} locale={locale} />
    </div>
  );
}

function flagKey(flag: "sparse" | "contested" | "estimated" | "preparation_dependent") {
  switch (flag) {
    case "sparse":
      return "sparse" as const;
    case "contested":
      return "contested" as const;
    case "estimated":
      return "estimated" as const;
    case "preparation_dependent":
      return "prepDep" as const;
    default: {
      const _exhaustive: never = flag;
      return _exhaustive;
    }
  }
}
