import { NextResponse } from "next/server";
import { FOODS } from "@/data/foods";
import { scoreCatalog } from "@/lib/scoring";

export function GET() {
  const scores = scoreCatalog(FOODS);
  return NextResponse.json({
    generated: new Date().toISOString(),
    foods: FOODS,
    scores,
  });
}
