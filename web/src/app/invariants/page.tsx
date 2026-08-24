import { InvariantList } from "@/components/invariant-list";

export default function InvariantsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        Biochemische Invarianten / Biochemical invariants
      </h1>
      <p className="max-w-3xl text-sm text-muted">
        Hard constraints, not opinions. Each claim is source-linked. The matrix
        refuses plant-category collapse and refuses diet advocacy.
      </p>
      <InvariantList />
    </div>
  );
}
