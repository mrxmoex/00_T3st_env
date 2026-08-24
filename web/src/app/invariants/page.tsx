import { InvariantList } from "@/components/invariant-list";
import { getLocale } from "@/lib/locale";

export default async function InvariantsPage() {
  const locale = await getLocale();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        {locale === "de" ? "Biochemische Invarianten" : "Biochemical invariants"}
      </h1>
      <p className="max-w-3xl text-sm text-muted">
        {locale === "de"
          ? "Harte Randbedingungen, keine Meinungen. Jede Aussage ist quellengebunden. Die Matrix verweigert das Zusammenlegen von Pflanzenklassen und verweigert Diät-Werbung."
          : "Hard constraints, not opinions. Each claim is source-linked. The matrix refuses plant-category collapse and refuses diet advocacy."}
      </p>
      <InvariantList locale={locale} />
    </div>
  );
}
