"use client";

import { useLocale } from "@/components/locale-provider";
import { REFERENCE_INTAKES } from "@/data/references";
import { SOURCES } from "@/data/sources";
import { t } from "@/lib/i18n";
import { loc } from "@/lib/utils";

export default function SourcesPage() {
  const { locale } = useLocale();
  const copy = t(locale);
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl">{copy.nav.sources}</h1>
        <p className="max-w-3xl text-sm text-mute">{copy.methodology}</p>
      </header>

      <section className="space-y-3">
        <h2 className="font-serif text-xl">{locale === "de" ? "Referenzzufuhren" : "Reference intakes"}</h2>
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="min-w-full text-sm">
            <thead className="bg-panel text-xs uppercase text-mute">
              <tr>
                <th className="px-3 py-2 text-left">{locale === "de" ? "Nährstoff" : "Nutrient"}</th>
                <th className="px-3 py-2 text-left">{locale === "de" ? "Wert" : "Value"}</th>
                <th className="px-3 py-2 text-left">{copy.year}</th>
                <th className="px-3 py-2 text-left">{locale === "de" ? "Population" : "Population"}</th>
              </tr>
            </thead>
            <tbody>
              {REFERENCE_INTAKES.map((row) => (
                <tr key={row.id} className="border-t border-line">
                  <td className="px-3 py-2">{row.nutrient}</td>
                  <td className="px-3 py-2 font-mono">
                    {row.amount} {row.unit}
                  </td>
                  <td className="px-3 py-2">{row.year}</td>
                  <td className="px-3 py-2 text-mute">{loc(row.population, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl">{locale === "de" ? "Quellenkatalog" : "Source catalog"}</h2>
        <ul className="space-y-3">
          {SOURCES.map((source) => (
            <li key={source.id} className="rounded-lg border border-line bg-panel p-4">
              <a href={source.url} target="_blank" rel="noreferrer" className="text-paper hover:text-gold">
                {source.title}
              </a>
              <p className="mt-1 text-xs text-mute">
                {source.publisher} · {source.year} · {source.kind} · {locale === "de" ? "Zugriff" : "accessed"} {source.accessed}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
