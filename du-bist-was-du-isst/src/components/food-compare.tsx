"use client";

import { useState } from "react";
import type { FoodItem } from "@/lib/types";
import { EVALUATION_AXES } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AxisRadarChart } from "@/components/axis-radar-chart";
import { SourceCitation, TierBadge, DataFlagBadge } from "@/components/source-citation";
import { getAxisLabel, getCategoryLabel, t } from "@/i18n/messages";
import type { Locale } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

interface FoodCompareProps {
  foods: FoodItem[];
  locale: Locale;
}

export function FoodCompare({ foods, locale }: FoodCompareProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    foods[0]?.id ?? "",
    foods.find((f) => f.kingdom === "animal")?.id ?? foods[1]?.id ?? "",
  ]);

  const selectedFoods = selectedIds
    .map((id) => foods.find((f) => f.id === id))
    .filter((f): f is FoodItem => Boolean(f));

  const updateSelection = (index: number, id: string) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[index] = id;
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {[0, 1, 2].map((slot) => (
          <Select
            key={slot}
            value={selectedIds[slot] ?? ""}
            onValueChange={(v) => v && updateSelection(slot, v)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder={`${t("ui", "compareSelect", locale)} ${slot + 1}`} />
            </SelectTrigger>
            <SelectContent>
              {foods.map((food) => (
                <SelectItem key={food.id} value={food.id}>
                  {food.name[locale]} ({getCategoryLabel(food.category, locale)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      {selectedFoods.length >= 2 && (
        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">
              {locale === "de" ? "Radar-Vergleich" : "Radar Comparison"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AxisRadarChart foods={selectedFoods} locale={locale} maxFoods={3} />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {selectedFoods.map((food) => (
          <Card key={food.id} className="border-border/60 bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{food.name[locale]}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {getCategoryLabel(food.category, locale)} · {t("ui", "per100g", locale)}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                <TierBadge tier={food.classTier} label={`${t("ui", "classTier", locale)}: ${food.classTier}`} />
                <TierBadge tier={food.globalTier} label={`${t("ui", "globalTier", locale)}: ${food.globalTier}`} />
                {food.dataFlags.map((flag) => (
                  <DataFlagBadge key={flag} flag={flag} locale={locale} />
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {EVALUATION_AXES.map((axis) => {
                const score = food.axisScores[axis];
                return (
                  <div key={axis} className="flex justify-between gap-2">
                    <span className="text-muted-foreground">{getAxisLabel(axis, locale)}</span>
                    <span className="tabular-nums">
                      <span className="text-muted-foreground">{score.raw}</span>
                      {" → "}
                      <span className="font-medium text-emerald-400">{score.adjusted}</span>
                      <TierBadge tier={score.tier} />
                    </span>
                  </div>
                );
              })}
              <Separator />
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  {locale === "de" ? "Proteinqualität" : "Protein Quality"}
                </p>
                <p className="text-xs">
                  {food.proteinQuality.method}: {food.proteinQuality.score}
                  {food.proteinQuality.limitingAminoAcid &&
                    ` · ${locale === "de" ? "limitierend" : "limiting"}: ${food.proteinQuality.limitingAminoAcid}`}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  {t("ui", "sources", locale)}
                </p>
                <SourceCitation sourceIds={food.sourceIds} locale={locale} compact />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
