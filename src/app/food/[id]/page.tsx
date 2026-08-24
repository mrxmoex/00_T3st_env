import { FOODS } from "@/data/foods";
import { FoodDetail } from "@/components/food-detail";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return FOODS.map((food) => ({ id: food.id }));
}

export default async function FoodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!FOODS.some((food) => food.id === id)) {
    notFound();
  }
  return <FoodDetail id={id} />;
}
