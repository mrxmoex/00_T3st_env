import { MatrixApp } from "@/components/matrix-app";
import { parseMatrixQuery, type SearchRecord } from "@/lib/query";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchRecord>;
}) {
  const query = parseMatrixQuery(await searchParams);
  return <MatrixApp query={query} />;
}
