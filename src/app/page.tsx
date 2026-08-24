"use client";

import Link from "next/link";
import { INVARIANTS } from "@/data/invariants";
import { FOODS } from "@/data/foods";
import { useLocale } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { ALL_CATEGORIES, categoryName, t } from "@/lib/i18n";
import { loc } from "@/lib/utils";

export default function HomePage() {
  const { locale } = useLocale();
  const copy = t(locale);
  const counts = Object.fromEntries(
    ALL_CATEGORIES.map((category) => [category, FOODS.filter((food) => food.category === category).length]),
  );

  return (
    <div className="space-y-10">
      <section className="max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">{copy.subtitle}</p>
        <h1 className="font-serif text-4xl leading-tight text-paper sm:text-5xl">{copy.brand}</h1>
        <p className="text-lg text-paper/85">{copy.homeLead}</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/matrix">
            <Button>{copy.openMatrix}</Button>
          </Link>
          <Link href="/compare">
            <Button variant="outline">{copy.openCompare}</Button>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-serif text-2xl">{locale === "de" ? "Strikte Ontologie" : "Strict ontology"}</h2>
        <p className="mb-4 max-w-2xl text-sm text-mute">
          {locale === "de"
            ? "Pflanzenklassen bleiben ungleich. Kein Gemüsedurchschnitt."
            : "Plant classes stay unequal. There is no vegetable mean."}
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_CATEGORIES.map((category) => (
            <Link
              key={category}
              href="/matrix"
              className="rounded-lg border border-line bg-panel px-3 py-3 hover:border-gold/40"
            >
              <p className="text-sm text-paper">{categoryName(locale, category)}</p>
              <p className="text-[11px] text-mute">
                {counts[category]} {locale === "de" ? "Einträge" : "entries"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl">{locale === "de" ? "Biochemische Invarianten" : "Biochemical invariants"}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {INVARIANTS.map((invariant) => (
            <article key={invariant.id} className="rounded-lg border border-line bg-panel p-4">
              <h3 className="font-serif text-lg text-paper">{loc(invariant.title, locale)}</h3>
              <p className="mt-2 text-sm text-paper/80">{loc(invariant.implication, locale)}</p>
            </article>
          ))}
        </div>
        <Link href="/invariants" className="inline-flex text-sm text-gold underline">
          {locale === "de" ? "Vollständiger Text und Quellen" : "Full text and sources"}
        </Link>
      </section>
    </div>
  );
}
