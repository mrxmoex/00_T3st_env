import { notFound } from "next/navigation";
import { FoodDetail } from "@/components/food-detail";
import { FOODS } from "@/data/foods";
import { getCatalog } from "@/lib/catalog";
import { getLocale } from "@/lib/locale";

export function generateStaticParams() {
  return FOODS.map((food) => ({ id: food.id }));
}

export default async function FoodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const scored = getCatalog().find((item) => item.food.id === id);
  if (!scored) {
    notFound();
  }
  return <FoodDetail scored={scored} locale={locale} />;
}
