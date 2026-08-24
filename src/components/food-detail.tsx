"use client";

import { RadarMatrix } from "@/components/radar-matrix";
import { SourceCite, SourceLink } from "@/components/source-cite";
import { FlagBadge, KingdomBadge, TierBadge } from "@/components/ui/badge";
import { useLocale } from "@/components/locale-provider";
import { axisName, categoryName, t } from "@/lib/i18n";
import { scoreFood } from "@/lib/scoring";
import type { Food } from "@/lib/types";
import { loc } from "@/lib/utils";

export function FoodDetail({ food }: { food: Food }) {
  const { locale } = useLocale();
  const copy = t(locale);
  const score = scoreFood(food, locale);
  const nutrients = [
    [copy.per100g, food.composition.energyKcal],
    ["Protein", food.composition.proteinG],
    [locale === "de" ? "Ballaststoffe" : "Fiber", food.composition.fiberG],
    [locale === "de" ? "Zucker" : "Sugars", food.composition.sugarsG],
    ["Fe", food.composition.ironMg],
    ["Zn", food.composition.zincMg],
    ["Ca", food.composition.calciumMg],
    ["B12", food.composition.vitaminB12Ug],
    ["Retinol", food.composition.retinolUg],
    ["Vitamin A RAE", food.composition.vitaminARaeUg],
    ["Vitamin C", food.composition.vitaminCMg],
    ["Folate DFE", food.composition.folateDfeUg],
    ["Vitamin D", food.composition.vitaminDUg],
    ["EPA", food.fattyAcids.epaMg],
    ["DHA", food.fattyAcids.dhaMg],
    ["ALA", food.fattyAcids.alaMg],
  ] as const;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">{categoryName(locale, food.category)}</p>
          <h1 className="font-serif text-4xl text-paper">{loc(food.name, locale)}</h1>
          {food.scientificName ? <p className="mt-1 text-sm italic text-mute">{food.scientificName}</p> : null}
        </div>
        <TierBadge tier={score.tierAcross} />
      </header>

      <div className="flex flex-wrap gap-2">
        <KingdomBadge kingdom={food.kingdom} label={food.kingdom} />
        {food.fdcId ? (
          <a
            href={`https://fdc.nal.usda.gov/food-details/${food.fdcId}/nutrients`}
            className="text-xs text-gold underline"
            target="_blank"
            rel="noreferrer"
          >
            {copy.fdc} {food.fdcId}
          </a>
        ) : null}
      </div>

      <p className="max-w-3xl text-sm leading-7 text-paper/85">{loc(food.tradeoffs, locale)}</p>

      <RadarMatrix scores={[score]} names={[loc(food.name, locale)]} locale={locale} />

      <section className="grid gap-3 sm:grid-cols-2">
        {Object.values(score.axes).map((axis) => (
          <div key={axis.axis} className="rounded-lg border border-line bg-panel p-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-paper">{axisName(locale, axis.axis)}</h2>
              <span className="font-mono text-sm">{Math.round(axis.adjusted)}</span>
            </div>
            <p className="mt-1 text-[11px] text-mute">
              {copy.raw} {Math.round(axis.raw)}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-line bg-panel p-4">
        <h2 className="font-serif text-xl">{copy.diaas}</h2>
        <div className="mt-2 space-y-1 text-sm">
          {food.proteinQuality.diaas ? <SourceCite value={food.proteinQuality.diaas} label="DIAAS" /> : <p className="text-mute">{copy.sparse}</p>}
          {food.proteinQuality.pdcaas ? <SourceCite value={food.proteinQuality.pdcaas} label={copy.pdcaas} /> : null}
          <p className="text-mute">
            {copy.limiting}: {food.proteinQuality.limitingAA}
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-panel p-4">
        <h2 className="font-serif text-xl">{copy.per100g}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {nutrients.map(([label, value]) => (
            <li key={label} className="flex flex-wrap justify-between gap-2 border-b border-line/60 py-1">
              <span className="text-mute">{label}</span>
              <SourceCite value={value} />
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <article className="rounded-lg border border-line bg-panel p-4">
          <h2 className="font-serif text-xl">{copy.prep}</h2>
          <p className="mt-2 text-sm leading-6">{loc(food.prepNote, locale)}</p>
        </article>
        <article className="rounded-lg border border-line bg-panel p-4">
          <h2 className="font-serif text-xl">{copy.residues}</h2>
          <p className="mt-2 text-sm leading-6">{loc(food.residues.note, locale)}</p>
          <p className="mt-2 text-sm">
            <SourceLink id={food.residues.sourceId} />
          </p>
        </article>
      </section>

      <div className="flex flex-wrap gap-1">
        {food.flags.map((flag) => (
          <FlagBadge key={flag}>{flag}</FlagBadge>
        ))}
      </div>
    </div>
  );
}
