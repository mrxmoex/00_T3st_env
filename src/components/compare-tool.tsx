"use client";

import { useMemo, useState } from "react";
import { CATALOG } from "@/lib/catalog";
import { t, UI } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { RadarMatrix } from "./radar-matrix";
import { AxisNotes, MultiplierBar, TierBadge, TradeoffList } from "./tier-table";

export function CompareTool({ locale }: { locale: Locale }) {
  const [idA, setIdA] = useState("spinach-raw");
  const [idB, setIdB] = useState("beef-liver");
  const a = useMemo(() => CATALOG.find((row) => row.food.id === idA), [idA]);
  const b = useMemo(() => CATALOG.find((row) => row.food.id === idB), [idB]);

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-muted">{t(UI.compareHint, locale)}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <FoodSelect label={t(UI.pickA, locale)} value={idA} onChange={setIdA} locale={locale} />
        <FoodSelect label={t(UI.pickB, locale)} value={idB} onChange={setIdB} locale={locale} />
      </div>
      {a && b ? (
        <>
          <div className="rounded-md border border-line bg-surface p-3">
            <RadarMatrix rows={[a, b]} locale={locale} />
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
              <span className="text-gold">{t(a.food.name, locale)}</span>
              <span className="text-sage">{t(b.food.name, locale)}</span>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <CompareCard row={a} locale={locale} />
            <CompareCard row={b} locale={locale} />
          </div>
        </>
      ) : (
        <p>{t(UI.emptyCompare, locale)}</p>
      )}
    </div>
  );
}

function FoodSelect({
  label,
  value,
  onChange,
  locale,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  locale: Locale;
}) {
  return (
    <label className="block text-xs text-muted">
      {label}
      <select
        className="mt-1 w-full rounded-sm border border-line bg-surface px-2 py-2 text-sm text-cream"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {CATALOG.map((row) => (
          <option key={row.food.id} value={row.food.id}>
            {t(row.food.name, locale)}
          </option>
        ))}
      </select>
    </label>
  );
}

function CompareCard({
  row,
  locale,
}: {
  row: NonNullable<ReturnType<typeof CATALOG.find>>;
  locale: Locale;
}) {
  return (
    <article className="space-y-3 rounded-md border border-line bg-surface p-4">
      <header className="flex items-center justify-between gap-2">
        <h2 className="font-serif text-xl">{t(row.food.name, locale)}</h2>
        <div className="flex gap-1">
          <TierBadge tier={row.globalTier} />
          <TierBadge tier={row.classTier} />
        </div>
      </header>
      <MultiplierBar row={row} locale={locale} />
      <TradeoffList row={row} locale={locale} />
      <AxisNotes row={row} locale={locale} />
    </article>
  );
}
