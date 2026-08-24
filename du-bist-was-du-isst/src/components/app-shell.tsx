"use client";

import { useState } from "react";
import { getAllFoods } from "@/lib/foods";
import { AppHeader } from "@/components/app-header";
import { AxisRadarChart } from "@/components/axis-radar-chart";
import { FoodTierList } from "@/components/food-tier-list";
import { FoodCompare } from "@/components/food-compare";
import { InvariantsPanel } from "@/components/invariants-panel";
import { useLocale } from "@/i18n/locale-context";
import { t } from "@/i18n/messages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EVALUATION_AXES } from "@/lib/types";
import { getAxisLabel, getCategoryLabel } from "@/i18n/messages";
import { SourceCitation, TierBadge } from "@/components/source-citation";
import { computeCompositeScore } from "@/lib/scoring/engine";

export function AppShell() {
  const [activeTab, setActiveTab] = useState("matrix");
  const { locale } = useLocale();
  const foods = getAllFoods();

  const topFoods = [...foods]
    .sort((a, b) => computeCompositeScore(b.axisScores) - computeCompositeScore(a.axisScores))
    .slice(0, 3);

  const tradeoffExamples = [
    { plant: foods.find((f) => f.id === "spinach-raw"), animal: foods.find((f) => f.id === "beef-sirloin") },
    { plant: foods.find((f) => f.id === "lentils-cooked"), animal: foods.find((f) => f.id === "egg-whole") },
  ].filter((p) => p.plant && p.animal);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <p className="mb-6 text-sm italic text-muted-foreground border-l-2 border-emerald-500/50 pl-3">
          {t("app", "tagline", locale)}
        </p>

        {activeTab === "matrix" && (
          <div className="space-y-8">
            <Card className="border-border/60 bg-card/50">
              <CardHeader>
                <CardTitle>
                  {locale === "de" ? "Top-Performer Radar" : "Top Performer Radar"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AxisRadarChart foods={topFoods} locale={locale} />
              </CardContent>
            </Card>

            <section>
              <h2 className="mb-4 text-lg font-semibold">
                {locale === "de" ? "Sichtbare Trade-offs" : "Visible Trade-offs"}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {tradeoffExamples.map(({ plant, animal }) => (
                  <Card key={`${plant!.id}-${animal!.id}`} className="border-border/60 bg-card/50">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-medium text-emerald-400">{plant!.name[locale]}</p>
                          <p className="text-xs text-muted-foreground">
                            {getCategoryLabel(plant!.category, locale)}
                          </p>
                        </div>
                        <TierBadge tier={plant!.classTier} />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">vs</p>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-medium text-blue-400">{animal!.name[locale]}</p>
                          <p className="text-xs text-muted-foreground">
                            {getCategoryLabel(animal!.category, locale)}
                          </p>
                        </div>
                        <TierBadge tier={animal!.classTier} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground mb-1">
                            {getAxisLabel("protein_quality", locale)}
                          </p>
                          <p>
                            {plant!.axisScores.protein_quality.adjusted} vs{" "}
                            {animal!.axisScores.protein_quality.adjusted}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">
                            {getAxisLabel("carbohydrate_quality", locale)}
                          </p>
                          <p>
                            {plant!.axisScores.carbohydrate_quality.adjusted} vs{" "}
                            {animal!.axisScores.carbohydrate_quality.adjusted}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">
                            {getAxisLabel("bioavailability_antinutrients", locale)}
                          </p>
                          <p>
                            {plant!.axisScores.bioavailability_antinutrients.adjusted} vs{" "}
                            {animal!.axisScores.bioavailability_antinutrients.adjusted}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">
                            {getAxisLabel("nutrient_density", locale)}
                          </p>
                          <p>
                            {plant!.axisScores.nutrient_density.adjusted} vs{" "}
                            {animal!.axisScores.nutrient_density.adjusted}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-lg font-semibold">
                {locale === "de" ? "Alle Lebensmittel — Achsenübersicht" : "All Foods — Axis Overview"}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-left text-muted-foreground">
                      <th className="py-2 pr-4">{locale === "de" ? "Lebensmittel" : "Food"}</th>
                      <th className="py-2 pr-4">{locale === "de" ? "Kategorie" : "Category"}</th>
                      {EVALUATION_AXES.map((axis) => (
                        <th key={axis} className="py-2 px-1 text-right text-xs">
                          {getAxisLabel(axis, locale).split(" ")[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {foods.map((food) => (
                      <tr key={food.id} className="border-b border-border/30 hover:bg-muted/20">
                        <td className="py-2 pr-4 font-medium">{food.name[locale]}</td>
                        <td className="py-2 pr-4 text-muted-foreground text-xs">
                          {getCategoryLabel(food.category, locale)}
                        </td>
                        {EVALUATION_AXES.map((axis) => (
                          <td key={axis} className="py-2 px-1 text-right tabular-nums text-xs">
                            {food.axisScores[axis].adjusted}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === "tiers" && <FoodTierList foods={foods} locale={locale} />}

        {activeTab === "compare" && <FoodCompare foods={foods} locale={locale} />}

        {activeTab === "invariants" && <InvariantsPanel locale={locale} />}
      </main>

      <footer className="border-t border-border/60 mt-12 py-6">
        <div className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground space-y-2">
          <p>
            {locale === "de"
              ? "Daten primär aus USDA FoodData Central, FAO/WHO DIAAS, EFSA, DGE, NIH ODS."
              : "Data primarily from USDA FoodData Central, FAO/WHO DIAAS, EFSA, DGE, NIH ODS."}
          </p>
          <SourceCitation
            sourceIds={["usda_fdc", "fao_diaas", "efsa_drv", "dge_referenz", "nih_iron"]}
            locale={locale}
          />
        </div>
      </footer>
    </div>
  );
}
