import { Link, useParams } from "react-router-dom";
import { foodById } from "../catalog/foods.ts";
import { foodClassLabel, kingdomLabel, SCORE_AXES } from "../catalog/labels.ts";
import { ScoreBar } from "../components/ScoreBar.tsx";
import { SourcePanel } from "../components/SourcePanel.tsx";
import { EVAL_BY_ID } from "../state/catalog.ts";

export function FoodPage() {
  const { id } = useParams();
  const food = id ? foodById(id) : undefined;
  const evaluation = id ? EVAL_BY_ID[id] : undefined;

  if (!food || !evaluation) {
    return (
      <main>
        <h2>Food not found</h2>
        <Link to="/">Back to matrix</Link>
      </main>
    );
  }

  return (
    <main>
      <p className="small muted">
        <Link to="/">Matrix</Link> / {food.name}
      </p>
      <div className="page-head">
        <div>
          <h2>{food.name}</h2>
          <p className="lede">
            {food.nameDe} · {kingdomLabel(food.kingdom)} · {foodClassLabel(food.foodClass)} ·{" "}
            {food.state}
            {food.fdcId ? ` · FDC ${food.fdcId}` : ""}
          </p>
        </div>
        <Link className="btn" to={`/compare?a=${food.id}`}>
          Compare
        </Link>
      </div>
      <div className="grid-2">
        <section className="panel">
          <h3>Scores</h3>
          {SCORE_AXES.map((axis) => (
            <ScoreBar
              key={axis}
              axis={axis}
              score={evaluation.scores[axis]}
              tier={evaluation.tiers[axis]}
            />
          ))}
        </section>
        <section className="panel">
          <h3>Protein quality</h3>
          <p>
            Label: <strong>{evaluation.eaa.completeness}</strong>. This label is never “complete”
            for plant-kingdom foods.
          </p>
          <p className="small">
            Limiting amino acid: {evaluation.eaa.limitingAminoAcid}. Chemical score{" "}
            {evaluation.eaa.chemicalScore.toFixed(2)}. Digestibility {evaluation.eaa.digestibility}.
            DIAAS-like {evaluation.eaa.diaasLike.toFixed(2)}.
          </p>
          <ul className="small">
            {Object.entries(evaluation.eaa.aminoAcidScores).map(([key, value]) => (
              <li key={key}>
                {key}: {value.toFixed(2)}
              </li>
            ))}
          </ul>
          <h3>Per 100 g</h3>
          <p className="small">
            {food.energyKcal} kcal · protein {food.proteinG} g · fat {food.fatG} g · carb{" "}
            {food.carbs.total} g (sugars {food.carbs.sugars}, fibre {food.carbs.fiber}, RS{" "}
            {food.carbs.resistantStarch}) · Fe {food.micros.ironMg} mg ({food.micros.ironForm}) ·
            Zn {food.micros.zincMg} mg · B12 {food.micros.b12Ug} µg ({food.micros.b12Form}) · VA{" "}
            {food.micros.vitaminARaeUg} µg RAE ({food.micros.vitaminAForm})
          </p>
          <p className="small">
            Animal-exclusive markers: creatine {String(food.animalExclusive.creatine)}, taurine{" "}
            {String(food.animalExclusive.taurine)}, carnosine {String(food.animalExclusive.carnosine)}
            , EPA/DHA {String(food.animalExclusive.longChainEpaDha)}, active B12{" "}
            {String(food.animalExclusive.activeB12)}, heme iron {String(food.animalExclusive.hemeIron)}
            , retinol {String(food.animalExclusive.preformedRetinol)}.
          </p>
        </section>
      </div>
      <SourcePanel food={food} evaluation={evaluation} />
    </main>
  );
}
