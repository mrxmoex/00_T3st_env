import { Link, useParams } from "react-router-dom";
import { AxisRadar } from "../components/AxisRadar";
import { BioactivesTable } from "../components/BioactivesTable";
import { BurdenPanel } from "../components/BurdenPanel";
import { axisValue } from "../components/MatrixTable";
import { NutrientTable } from "../components/NutrientTable";
import { PreparationPanel } from "../components/PreparationPanel";
import { DigestionPanel } from "../components/DigestionPanel";
import { ContextPanels } from "../components/SourcingPanel";
import { SourcePanel } from "../components/SourcePanel";
import { FOODS, foodById } from "../data/catalog";
import { CLASS_WEIGHTS } from "../data/classWeights";
import { NOVA_LABELS, PREPARATION_LABELS } from "../i18n/labels";
import { altFoodName, foodName } from "../i18n/locale";
import { useLocale } from "../i18n/LocaleContext";
import { scoreCatalog } from "../scoring/scoreFood";
import { BENEFIT_AXES, BURDEN_AXES, kingdomOf, type AxisKey, type ScoreCard } from "../scoring/types";

const cards = scoreCatalog(FOODS);

function AxisBar({ label, card, axis, className }: { label: string; card: ScoreCard; axis: AxisKey; className?: string }) {
  const score = axisValue(card, axis);
  return (
    <div className={className ? `bar-row ${className}` : "bar-row"}>
      <span>{label}</span>
      <div className="bar">
        <span style={{ width: `${score}%` }} />
      </div>
      <span className="mono">{score.toFixed(1)}</span>
    </div>
  );
}

export function FoodPage() {
  const { id } = useParams();
  const { t, locale, localize } = useLocale();
  const food = id ? foodById(id) : undefined;
  const card = cards.find((item) => item.foodId === id);

  if (!food || !card) {
    return (
      <main>
        <h1>{t.food.unknown}</h1>
        <p>
          <Link to="/">{t.food.back}</Link>
        </p>
      </main>
    );
  }

  const name = foodName(food, locale);
  const classLabel = t.classes[food.class];

  return (
    <main>
      <p className="muted">
        <Link to="/">{t.nav.matrix}</Link> · {classLabel} · {t.kingdoms[kingdomOf(food.class)]}
      </p>
      <h1>{name}</h1>
      <p className="lede">
        {t.food.lede({
          altName: altFoodName(food, locale),
          preparation: localize(PREPARATION_LABELS[food.preparation]),
          source: food.sourceEntries.map((entry) => `${entry.db} ${entry.code}`).join(" + "),
          kcal: food.kcalPer100g,
          tier: card.tier,
          rank: card.classRank,
          size: card.classSize,
        })}
      </p>
      <div className="food-overview">
        <div className="axis-bars">
          <p className="bars-heading">{t.food.benefitsHeading}</p>
          {BENEFIT_AXES.map((axis) => (
            <AxisBar key={axis} label={t.axes[axis]} card={card} axis={axis} />
          ))}
          <p className="bars-heading">{t.food.burdensHeading}</p>
          {BURDEN_AXES.map((axis) => (
            <AxisBar key={axis} label={t.axes[axis]} card={card} axis={axis} className="burden" />
          ))}
          <AxisBar label={t.axes.composite} card={card} axis="composite" className="composite" />
          <p>
            <span className={`nova-badge nova-${food.processing.nova}`}>NOVA {food.processing.nova}</span>{" "}
            <span className="muted">{localize(NOVA_LABELS[food.processing.nova])}</span>
          </p>
        </div>
        <AxisRadar title={t.food.radarTitle(name)} entries={[{ id: food.id, label: name, card }]} />
      </div>
      <PreparationPanel food={food} cards={cards} />
      <section className="grid-2">
        <article className="panel">
          <h2>{t.axes.eaa}</h2>
          <p>
            {t.food.eaaSummary({
              aas: card.eaa.aas,
              diaas: card.eaa.diaas,
              pdcaas: card.eaa.pdcaas,
              limiting: card.eaa.limitingAa.toUpperCase(),
              digestibility: food.ilealDigestibility,
            })}
          </p>
          <ul>
            {card.eaa.flags.map((flag) => (
              <li key={flag.en}>{localize(flag)}</li>
            ))}
          </ul>
        </article>
        <article className="panel">
          <h2>{t.food.fatsCarbsMicros}</h2>
          <ul>
            {[...card.efa.flags, ...card.carb.flags, ...card.micro.flags].map((flag) => (
              <li key={flag.en}>{localize(flag)}</li>
            ))}
          </ul>
          <p className="mono muted">
            {t.food.microLine({
              rae: card.micro.raeUg,
              iron: card.micro.absorbableIronMg,
              zinc: card.micro.absorbableZincMg,
              calcium: card.micro.absorbableCalciumMg,
              b12: card.micro.effectiveB12Ug,
            })}
          </p>
        </article>
      </section>
      <BioactivesTable food={food} />
      <BurdenPanel food={food} card={card} />
      <ContextPanels food={food} />
      <DigestionPanel food={food} />
      <section className="panel">
        <h2>{t.food.classColumns}</h2>
        <ul>
          {Object.entries(card.extras).map(([key, value]) => (
            <li key={key}>
              {t.extras[key] ?? key}: <span className="mono">{value === null ? "—" : value.toFixed(1)}</span>
            </li>
          ))}
        </ul>
        <p className="muted">{t.food.weights(classLabel, CLASS_WEIGHTS[food.class])}</p>
      </section>
      <section className="panel">
        <h2>{t.food.notes}</h2>
        <ul>
          {[...food.notes, ...card.fibre.flags].map((note) => (
            <li key={note.en}>{localize(note)}</li>
          ))}
        </ul>
        <p>
          <Link className="btn" to={`/compare?a=${food.id}`}>
            {t.food.compareCta}
          </Link>
        </p>
      </section>
      <NutrientTable food={food} card={card} />
      <SourcePanel food={food} card={card} />
    </main>
  );
}
