import { Link } from "react-router-dom";
import { NonClaimBanner } from "../components/NonClaimBanner";
import { ANIMAL_CLASSES, PLANT_CLASSES, axisLabel, classLabel } from "../data/labels";
import { MANIFEST } from "../data/manifest";
import { SOURCES } from "../data/sources";
import { CLASS_WEIGHTS } from "../data/weights";
import type { ScoreAxis } from "../data/types";

const AXES: Exclude<ScoreAxis, "composite">[] = [
  "eaa",
  "fat",
  "carb",
  "micro",
  "fibre",
  "residue",
  "degradation",
];

export function MethodologyPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-2xl font-semibold">Methodology</h2>
      <p className="text-sm text-stone-500">
        Formula {MANIFEST.formulaVersion} · data {MANIFEST.dataVersion} · last verified{" "}
        {MANIFEST.lastVerified}. Full write-up: <code>docs/METHODOLOGY.md</code>.
      </p>
      <NonClaimBanner />

      <section className="space-y-2 text-sm leading-6">
        <h3 className="text-lg font-medium">How a score is made</h3>
        <p>
          Foods store raw quantities (USDA-style per 100 g, amino acids as mg/g protein). The UI
          never invents a number. <code>scoreFood</code> applies documented coefficients and
          class-specific weights. Plant classes are never collapsed into “vegetables”.
        </p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>EAA completeness = min(FAO 2007 ratios), then × digestibility. Incomplete stays incomplete.</li>
          <li>Fat: EPA+DHA first; ALA × 0.08; n-6/n-3; SFA/MUFA/PUFA; odd-chain/CLA when present.</li>
          <li>Carbs: active (sugars + digestible starch) vs passive (fibre + resistant starch).</li>
          <li>Micros: 200 kcal density after heme / phytate-zinc / carotenoid / B12-form coefficients.</li>
          <li>Fibre/phytochemicals: plant advantage. Animal foods near zero.</li>
          <li>Residues: surface area, systemic vs contact, monitoring, aquatic mercury.</li>
          <li>Degradation: water-soluble loss, PUFA oxidation, cutting, heat, time.</li>
          <li>Composite = class-weighted sum. Tiers S–D are within each class.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-medium">Class weights</h3>
        <p className="mb-2 text-sm text-stone-500">
          Weights express what the class is for. They do not launder a weak axis.
        </p>
        <div className="matrix-scroll overflow-x-auto border border-stone-300 dark:border-ink-700">
          <table className="min-w-[720px] w-full text-left text-xs">
            <thead className="bg-stone-200 dark:bg-ink-900">
              <tr>
                <th className="px-2 py-2">Class</th>
                {AXES.map((axis) => (
                  <th key={axis} className="px-2 py-2 font-mono">
                    {axis}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...PLANT_CLASSES, ...ANIMAL_CLASSES].map((foodClass) => (
                <tr key={foodClass} className="border-t border-stone-200 dark:border-ink-800">
                  <td className="px-2 py-1.5">{classLabel(foodClass)}</td>
                  {AXES.map((axis) => (
                    <td key={axis} className="px-2 py-1.5 font-mono">
                      {(CLASS_WEIGHTS[foodClass][axis] * 100).toFixed(0)}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2 text-sm">
        <h3 className="text-lg font-medium">Sources</h3>
        <ul className="list-disc space-y-1 pl-5">
          {Object.values(SOURCES).map((source) => (
            <li key={source.id}>
              <a className="underline" href={source.url}>
                {source.label}
              </a>{" "}
              <span className="text-stone-500">retrieved {source.retrieved}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2 text-sm">
        <h3 className="text-lg font-medium">Extension path</h3>
        <p>
          Supplements, processed foods, and bloodwork overlays can attach later without changing
          axis definitions. See <code>docs/ARCHITECTURE.md</code>.
        </p>
        <p>
          <Link className="underline" to="/">
            Return to the matrix
          </Link>
        </p>
      </section>

      <p className="text-xs text-stone-500">
        Axis labels: {AXES.map((axis) => axisLabel(axis)).join(" · ")}
      </p>
    </div>
  );
}
