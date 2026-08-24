"use client";

import { useMemo, useState } from "react";
import type { EvaluationAxis, FoodItem } from "@/lib/types";
import { EVALUATION_AXES, PLANT_CATEGORIES, ANIMAL_CATEGORIES } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TierBadge } from "@/components/source-citation";
import { getAxisLabel, getCategoryLabel, t } from "@/i18n/messages";
import type { Locale } from "@/lib/types";
import { computeCompositeScore } from "@/lib/scoring/engine";

interface FoodTierListProps {
  foods: FoodItem[];
  locale: Locale;
}

export function FoodTierList({ foods, locale }: FoodTierListProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [kingdomFilter, setKingdomFilter] = useState<string>("all");
  const [sortAxis, setSortAxis] = useState<EvaluationAxis | "composite">("composite");

  const categories = [...PLANT_CATEGORIES, ...ANIMAL_CATEGORIES];

  const filtered = useMemo(() => {
    let list = [...foods];
    if (categoryFilter !== "all") {
      list = list.filter((f) => f.category === categoryFilter);
    }
    if (kingdomFilter !== "all") {
      list = list.filter((f) => f.kingdom === kingdomFilter);
    }
    list.sort((a, b) => {
      const scoreA =
        sortAxis === "composite"
          ? computeCompositeScore(a.axisScores)
          : a.axisScores[sortAxis].adjusted;
      const scoreB =
        sortAxis === "composite"
          ? computeCompositeScore(b.axisScores)
          : b.axisScores[sortAxis].adjusted;
      return scoreB - scoreA;
    });
    return list;
  }, [foods, categoryFilter, kingdomFilter, sortAxis]);

  const groupedByTier = useMemo(() => {
    const groups: Record<string, FoodItem[]> = { S: [], A: [], B: [], C: [], D: [] };
    for (const food of filtered) {
      groups[food.classTier].push(food);
    }
    return groups;
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Select value={categoryFilter} onValueChange={(v) => v && setCategoryFilter(v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("ui", "filterCategory", locale)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("ui", "allCategories", locale)}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {getCategoryLabel(cat, locale)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={kingdomFilter} onValueChange={(v) => v && setKingdomFilter(v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("ui", "allKingdoms", locale)}</SelectItem>
            <SelectItem value="plant">{t("ui", "plant", locale)}</SelectItem>
            <SelectItem value="animal">{t("ui", "animal", locale)}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortAxis}
          onValueChange={(v) => setSortAxis(v as EvaluationAxis | "composite")}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("ui", "filterAxis", locale)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="composite">
              {locale === "de" ? "Gesamt" : "Composite"}
            </SelectItem>
            {EVALUATION_AXES.map((axis) => (
              <SelectItem key={axis} value={axis}>
                {getAxisLabel(axis, locale)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(["S", "A", "B", "C", "D"] as const).map((tier) => {
        const tierFoods = groupedByTier[tier];
        if (tierFoods.length === 0) return null;
        return (
          <Card key={tier} className="border-border/60 bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TierBadge tier={tier} label={t("tiers", tier, locale)} />
                <span className="text-sm font-normal text-muted-foreground">
                  ({tierFoods.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{locale === "de" ? "Lebensmittel" : "Food"}</TableHead>
                    <TableHead>{locale === "de" ? "Kategorie" : "Category"}</TableHead>
                    <TableHead className="text-right">{t("ui", "adjustedScore", locale)}</TableHead>
                    <TableHead className="text-right">{t("ui", "classTier", locale)}</TableHead>
                    <TableHead className="text-right">{t("ui", "globalTier", locale)}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tierFoods.map((food) => (
                    <TableRow key={food.id}>
                      <TableCell className="font-medium">{food.name[locale]}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {getCategoryLabel(food.category, locale)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {computeCompositeScore(food.axisScores)}
                      </TableCell>
                      <TableCell className="text-right">
                        <TierBadge tier={food.classTier} />
                      </TableCell>
                      <TableCell className="text-right">
                        <TierBadge tier={food.globalTier} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
