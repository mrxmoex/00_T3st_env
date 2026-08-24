"use client";

import { MatrixTable } from "@/components/matrix-table";
import { RadarMatrix } from "@/components/radar-matrix";
import { useLocale } from "@/components/locale-provider";
import { getEvaluatedFoods } from "@/lib/catalog";

export default function MatrixPage() {
  const { copy } = useLocale();
  const foods = getEvaluatedFoods();
  const preview = [...foods]
    .sort((a, b) => b.combined - a.combined)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{copy.nav.matrix}</h1>
        <p className="max-w-2xl text-sm text-muted">{copy.combinedNote}</p>
      </header>
      <RadarMatrix foods={preview} />
      <MatrixTable foods={foods} />
    </div>
  );
}
