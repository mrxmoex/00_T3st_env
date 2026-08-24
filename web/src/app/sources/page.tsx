import { SourceLibrary } from "@/components/source-library";
import { getLocale } from "@/lib/locale";

export default async function SourcesPage() {
  const locale = await getLocale();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        {locale === "de" ? "Quellen" : "Sources"}
      </h1>
      <p className="max-w-3xl text-sm text-muted">
        {locale === "de"
          ? "Reihenfolge: USDA FoodData Central, FAO/WHO DIAAS, EFSA, DGE/ÖGE, NIH ODS, Bioverfügbarkeitsarbeiten nach 2015, EFSA/USDA-Rückstandsprogramme."
          : "Priority order: USDA FoodData Central, FAO/WHO DIAAS, EFSA, DGE/ÖGE, NIH ODS, post-2015 bioavailability papers, EFSA/USDA residue programs."}
      </p>
      <SourceLibrary locale={locale} />
    </div>
  );
}
