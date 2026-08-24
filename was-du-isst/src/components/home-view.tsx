"use client";

import Link from "next/link";
import { KingdomBadge } from "@/components/kingdom-badge";
import { SourceCite } from "@/components/source-cite";
import { useLocale } from "@/components/locale-provider";
import { getCategories, getEvaluatedFoods, getInvariants } from "@/lib/catalog";
import { t } from "@/lib/i18n";

export function HomeView() {
  const { locale, copy } = useLocale();
  const categories = getCategories();
  const invariants = getInvariants();
  const foods = getEvaluatedFoods();

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-brass">{copy.tagline}</p>
        <p className="text-xs text-muted">{locale === "de" ? "Sprache: Deutsch" : "Language: English"}</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{copy.title}</h1>
        <p className="max-w-2xl text-base text-muted sm:text-lg">{copy.subtitle}</p>
        <div className="flex flex-wrap gap-2">
          <Link href={`/matrix?lang=${locale}`} className="rounded-md bg-brass px-4 py-2 text-sm font-medium text-bg">
            {copy.nav.matrix}
          </Link>
          <Link href={`/compare?lang=${locale}`} className="rounded-md border border-line px-4 py-2 text-sm">
            {copy.nav.compare}
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wide text-muted">{copy.ontology}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const count = foods.filter((item) => item.food.category === category.id).length;
            return (
              <article key={category.id} className="rounded-lg border border-line bg-bg-elev p-4">
                <KingdomBadge category={category.id} />
                <p className="mt-3 text-sm text-muted">{t(category.whyUnequal, locale)}</p>
                <p className="mt-2 font-mono text-xs text-brass">{count}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wide text-muted">{copy.nav.invariants}</h2>
        <div className="space-y-4">
          {invariants.map((invariant) => (
            <article key={invariant.id} className="rounded-lg border border-line bg-bg-elev p-4">
              <h3 className="text-base font-medium">
                {invariant.number}. {t(invariant.title, locale)}
              </h3>
              <p className="mt-2 text-sm text-muted">{t(invariant.body, locale)}</p>
              <div className="mt-3">
                <SourceCite ids={invariant.sourceIds} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
