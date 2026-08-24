import { notFound } from "next/navigation";
import { FoodDetail } from "@/components/food-detail";
import { getEvaluatedFoods, getFood } from "@/lib/catalog";

export function generateStaticParams() {
  return getEvaluatedFoods().map((item) => ({ id: item.food.id }));
}

export default async function FoodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const food = getFood(id);
  if (!food) notFound();
  return <FoodDetail food={food} />;
}
