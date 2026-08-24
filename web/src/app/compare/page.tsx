import { Suspense } from "react";
import { CompareApp } from "@/components/compare-app";

export default function ComparePage() {
  return (
    <Suspense fallback={<p className="text-muted">…</p>}>
      <CompareApp />
    </Suspense>
  );
}
