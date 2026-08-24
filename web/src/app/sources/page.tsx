import { SourceLibrary } from "@/components/source-library";

export default function SourcesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Quellen / Sources</h1>
      <p className="max-w-3xl text-sm text-muted">
        Priority order: USDA FoodData Central, FAO/WHO DIAAS, EFSA, DGE/ÖGE,
        NIH ODS, post-2015 bioavailability papers, EFSA/USDA residue programs.
      </p>
      <SourceLibrary />
    </div>
  );
}
