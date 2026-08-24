export function MethodologyPage() {
  return (
    <div className="methodology">
      <h2>Methodology</h2>
      <p>
        <strong>Du bist was du isst</strong> evaluates foods on eight independent
        biochemical axes, then composites them with division-specific weights.
        Plant and animal classes are not interchangeable.
      </p>

      <h2>Scoring axes</h2>
      <ol>
        <li>
          <strong>EAA completeness + digestibility</strong> — limiting amino acid
          vs WHO pattern × PDCAAS/DIAAS
        </li>
        <li>
          <strong>EFA / glyceride profile</strong> — ω6:ω3 balance, EPA/DHA bonus,
          saturation penalty
        </li>
        <li>
          <strong>Carbohydrate type</strong> — active (starch+sugar) vs passive
          (fibre); legumes weighted differently
        </li>
        <li>
          <strong>Micronutrient density</strong> — per 100 kcal with iron/zinc/Vit
          A bioavailability factors
        </li>
        <li>
          <strong>Fibre / phytochemical load</strong> — fibre g + class
          phytochemical index
        </li>
        <li>
          <strong>Residue safety</strong> — inverse of pesticide/heavy-metal/dioxin
          tier risk
        </li>
        <li>
          <strong>Stability</strong> — water-soluble vitamin cooking loss + PUFA
          oxidation sensitivity
        </li>
        <li>
          <strong>Composite + tier</strong> — weighted sum → S/A/B/C/D
        </li>
      </ol>

      <h2>What we will NOT claim</h2>
      <ul>
        <li>Not medical advice or personalized nutrition</li>
        <li>
          No plant-only complete protein without fortification/pairing notes
        </li>
        <li>No clinical outcome claims for tier rankings</li>
        <li>No real-time batch contamination data</li>
        <li>No AI-inferred nutrient values</li>
        <li>Algae ≠ mushrooms ≠ legumes — distinct divisions</li>
      </ul>

      <h2>Formulas</h2>
      <p>
        Full reproducible formulas are documented in{" "}
        <code>nutrition/docs/SCORING.md</code> in the repository.
      </p>
    </div>
  );
}
