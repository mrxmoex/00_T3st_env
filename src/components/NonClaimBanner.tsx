export function NonClaimBanner() {
  return (
    <aside className="border border-copper-600/40 bg-copper-500/10 px-3 py-2 text-sm text-stone-700 dark:text-stone-300">
      <p className="font-medium">This system will not claim:</p>
      <ul className="mt-1 list-disc space-y-0.5 pl-5">
        <li>equivalence between incomplete plant proteins and complete animal proteins</li>
        <li>
          that a pure plant diet is complete without fortification/supplementation (B12 required;
          LC EPA/DHA and creatine typically required)
        </li>
        <li>a black-box “AI nutrition score” — every number is a documented formula</li>
      </ul>
    </aside>
  );
}
