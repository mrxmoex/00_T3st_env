import { Link, useParams } from "react-router-dom";
import { NonClaimBanner } from "../components/NonClaimBanner";
import { ScoreCell } from "../components/ScoreCell";
import { SourcePanel } from "../components/SourcePanel";
import { TierBadge } from "../components/TierBadge";
import { axisHint, axisLabel, classLabel, kingdomLabel } from "../data/labels";
import { CLASS_WEIGHTS } from "../data/weights";
import type { ScoreAxis } from "../data/types";
import { aminoAcidRatios } from "../scoring/eaa";
import { activeCarbs, passiveCarbs } from "../scoring/carbs";
import { foodById } from "../data/catalog";
import { requireScore } from "../state/store";

const AXES: Exclude<ScoreAxis, "composite">[] = [
  "eaa",
  "fat",
  "carb",
  "micro",
  "fibre",
  "residue",
  "degradation",
];

export function FoodPage() {
  const { id } = useParams();
  const food = id ? foodById(id) : undefined;
  if (!food) {
    return <p>Unknown food. <Link to="/">Back to matrix</Link></p>;
  }
  const score = requireScore(food.id);
  const ratios = aminoAcidRatios(food.aminoAcids);
  const weights = CLASS_WEIGHTS[food.foodClass];

  return (
    <div className="space-y-5">
      <p className="text-sm">
        <Link className="underline" to="/">
          Matrix
        </Link>
        {" · "}
        <Link className="underline" to={`/compare?a=${food.id}`}>
          Compare
        </Link>
      </p>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
            {kingdomLabel(food.kingdom)} · {classLabel(food.foodClass)}
            {food.fermented ? " · fermented" : ""}
          </p>
          <h2 className="text-3xl font-semibold">{food.name}</h2>
          <p className="text-stone-500">{food.nameDe} · {food.ediblePortionNote}</p>
        </div>
        <div className="flex items-center gap-3">
          <TierBadge tier={score.tier} />
          <div>
            <p className="font-mono text-[10px] uppercase text-stone-500">Composite</p>
            <ScoreCell score={score.composite} />
          </div>
        </div>
      </header>
      <NonClaimBanner />

      <section className="grid gap-2 md:grid-cols-4">
        {AXES.map((axis) => (
          <article key={axis} className="border border-stone-300 p-3 dark:border-ink-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{axisLabel(axis)}</h3>
              <ScoreCell score={score[axis].score} compact />
            </div>
            <p className="mt-1 text-xs text-stone-500">{axisHint(axis)}</p>
            <p className="mt-1 font-mono text-[10px] text-stone-500">
              class weight {(weights[axis] * 100).toFixed(0)}%
            </p>
            <ul className="mt-2 space-y-1 text-xs text-stone-600 dark:text-stone-400">
              {score[axis].notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="border border-stone-300 p-3 dark:border-ink-700">
          <h3 className="font-medium">Protein quality</h3>
          <p className="mt-1 text-sm">
            Completeness {ratios.completeness.toFixed(2)} · limiting {ratios.limiting} ·{" "}
            {food.proteinQuality.method} {food.proteinQuality.value.toFixed(2)}
          </p>
          <p className="text-sm text-stone-500">
            {ratios.completeness >= 1
              ? "Complete protein: all FAO 2007 adult minima met."
              : "Incomplete protein. Not rescaled toward animal complete proteins."}
          </p>
          <dl className="mt-2 grid grid-cols-3 gap-1 font-mono text-xs">
            {Object.entries(ratios)
              .filter(([key]) => key !== "limiting" && key !== "uncappedAas" && key !== "completeness")
              .map(([key, value]) => (
                <div key={key}>
                  <dt className="text-stone-500">{key}</dt>
                  <dd>{Number(value).toFixed(2)}</dd>
                </div>
              ))}
          </dl>
        </article>
        <article className="border border-stone-300 p-3 dark:border-ink-700">
          <h3 className="font-medium">Carbohydrate split</h3>
          <p className="mt-1 text-sm">
            Active {activeCarbs(food).toFixed(1)} g · passive {passiveCarbs(food).toFixed(1)} g
          </p>
          <p className="text-sm text-stone-500">
            Active = sugars + digestible starch. Passive = fibre + resistant starch.
          </p>
          <h3 className="mt-3 font-medium">Exclusive compounds</h3>
          <p className="text-sm">
            Creatine {food.exclusive.creatineMg} mg · taurine {food.exclusive.taurineMg} mg ·
            carnosine {food.exclusive.carnosineMg} mg / 100 g
          </p>
          <p className="text-xs text-stone-500">
            Reported, not folded into the composite as a hidden ninth axis.
          </p>
        </article>
      </section>

      <SourcePanel
        food={food}
        breakdowns={[
          score.eaa,
          score.fat,
          score.carb,
          score.micro,
          score.fibre,
          score.residue,
          score.degradation,
        ]}
      />
    </div>
  );
}
