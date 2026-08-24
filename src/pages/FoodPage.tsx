import { Link, useParams } from "react-router-dom";
import { SourcePanel } from "../components/SourcePanel";
import { FOODS, foodById } from "../data/catalog";
import { CLASS_WEIGHTS } from "../data/classWeights";
import { scoreCatalog } from "../scoring/scoreFood";
import { AXIS_KEYS, kingdomOf } from "../scoring/types";
import { AXIS_LABELS, CLASS_LABELS, EXTRA_LABELS } from "../ui/labels";

const cards = scoreCatalog(FOODS);

export function FoodPage() {
  const { id } = useParams();
  const food = id ? foodById(id) : undefined;
  const card = cards.find((item) => item.foodId === id);

  if (!food || !card) {
    return (
      <main>
        <h1>Unknown food</h1>
        <p>
          <Link to="/">Back to matrix</Link>
        </p>
      </main>
    );
  }

  const weights = CLASS_WEIGHTS[food.class];

  return (
    <main>
      <p className="muted">
        <Link to="/">Matrix</Link> · {CLASS_LABELS[food.class]} · {kingdomOf(food.class)}
      </p>
      <h1>{food.nameDe}</h1>
      <p className="lede">
        {food.name}. {food.edibleState}. FDC {food.fdcId ?? "—"}. {food.kcalPer100g} kcal / 100 g.
        Tier {card.tier} (#{card.classRank} of {card.classSize} in class).
      </p>
      <div className="axis-bars">
        {AXIS_KEYS.map((axis) => {
          const score =
            axis === "composite"
              ? card.composite
              : axis === "eaa"
                ? card.eaa.score
                : axis === "efa"
                  ? card.efa.score
                  : axis === "carb"
                    ? card.carb.score
                    : axis === "micro"
                      ? card.micro.score
                      : axis === "fibre"
                        ? card.fibre.score
                        : axis === "residue"
                          ? card.residue.score
                          : card.degradation.score;
          return (
            <div className="bar-row" key={axis}>
              <span>{AXIS_LABELS[axis]}</span>
              <div className="bar">
                <span style={{ width: `${score}%` }} />
              </div>
              <span className="mono">{score.toFixed(1)}</span>
            </div>
          );
        })}
      </div>
      <section className="grid-2">
        <article className="panel">
          <h2>EAA + digestibility</h2>
          <p>
            AAS {card.eaa.aas}, DIAAS {card.eaa.diaas}, PDCAAS {card.eaa.pdcaas}. Limiting amino
            acid: {card.eaa.limitingAa.toUpperCase()}. Ileal digestibility {food.ilealDigestibility}.
          </p>
          <ul>
            {card.eaa.flags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
        </article>
        <article className="panel">
          <h2>Fats, carbs, micros</h2>
          <ul>
            {card.efa.flags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
            {card.carb.flags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
            {card.micro.flags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
          <p className="mono muted">
            RAE {card.micro.raeUg} µg · abs. Fe {card.micro.absorbableIronMg} mg · abs. Zn{" "}
            {card.micro.absorbableZincMg} mg · B12 {card.micro.effectiveB12Ug} µg
          </p>
        </article>
      </section>
      <section className="panel">
        <h2>Class-specific columns</h2>
        <ul>
          {Object.entries(card.extras).map(([key, value]) => (
            <li key={key}>
              {EXTRA_LABELS[key] ?? key}: <span className="mono">{value.toFixed(1)}</span>
            </li>
          ))}
        </ul>
        <p className="muted">
          Composite weights for {CLASS_LABELS[food.class]}: EAA {weights.eaa}, EFA {weights.efa},
          carb {weights.carb}, micro {weights.micro}, fibre {weights.fibre}, residue {weights.residue},
          stability {weights.degradation}.
        </p>
      </section>
      <section className="panel">
        <h2>Notes</h2>
        <ul>
          {food.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
          {card.fibre.flags.map((flag) => (
            <li key={flag}>{flag}</li>
          ))}
          {card.residue.flags.map((flag) => (
            <li key={flag}>{flag}</li>
          ))}
          {card.degradation.flags.map((flag) => (
            <li key={flag}>{flag}</li>
          ))}
        </ul>
        <p>
          <Link className="btn" to={`/compare?a=${food.id}`}>
            Compare this food
          </Link>
        </p>
      </section>
      <SourcePanel food={food} card={card} />
    </main>
  );
}
