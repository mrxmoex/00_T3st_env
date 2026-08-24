import { CompareApp } from "@/components/compare-app";
import { parseCompareQuery, type SearchRecord } from "@/lib/query";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<SearchRecord>;
}) {
  const query = parseCompareQuery(await searchParams);
  return <CompareApp query={query} />;
}
