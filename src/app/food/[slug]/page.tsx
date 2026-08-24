import { notFound } from "next/navigation";
import { FoodDetail } from "@/components/food-detail";
import { FOODS } from "@/data/foods";

export function generateStaticParams() {
  return FOODS.map((food) => ({ slug: food.slug }));
}

export default async function FoodPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const food = FOODS.find((item) => item.slug === slug);
  if (!food) notFound();
  return <FoodDetail food={food} />;
}
