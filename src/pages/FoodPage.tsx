import { Link, useParams } from "react-router-dom";
import { BioactivesProfile } from "../components/BioactivesProfile";
import { BurdenPanel } from "../components/BurdenPanel";
import { CarbTypePie } from "../components/CarbTypePie";
import { CompareAxisRadar } from "../components/CompareAxisRadar";
import { DigestionPanel } from "../components/DigestionPanel";
import { ExposurePanel } from "../components/ExposurePanel";
import { FoodHonorsList } from "../components/FoodHonorsList";
import { NovaMarker } from "../components/NovaMarker";
import { NutrientRadar } from "../components/NutrientRadar";
import { NutrientTable } from "../components/NutrientTable";
import { PreparationPanel } from "../components/PreparationPanel";
import { ContextPanels } from "../components/SourcingPanel";
import { SourcePanel } from "../components/SourcePanel";
import { axisValue } from "../components/MatrixTable";
import { FOODS, foodById } from "../data/catalog";
import { CLASS_WEIGHTS } from "../data/classWeights";
import { NOVA_LABELS, PREPARATION_LABELS } from "../i18n/labels";
import { altFoodName, foodName } from "../i18n/locale";
import { useLocale } from "../i18n/LocaleContext";
import { scoreCatalog } from "../scoring/scoreFood";
import { BENEFIT_AXES, BURDEN_AXES, kingdomOf, type AxisKey, type FoodRecord, type ScoreCard } from "../scoring/types";

const cards = scoreCatalog(FOODS);

function AxisBar({
  label,
  card,
  axis,
  food,
  className,
}: {
  label: string;
  card: ScoreCard;
  axis: AxisKey;
  food: FoodRecord;
  className?: string;
}) {
  const score = axisValue(card, axis);
  return (
    <div className={className ? `bar-row ${className}` : "bar-row"}>
      <span className="bar-row-label">
        {label}
        {axis === "carb" ? <CarbTypePie food={food} carb={card.carb} /> : null}
      </span>
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
  const novaFull = t.compare.novaLine(food.processing.nova, localize(NOVA_LABELS[food.processing.nova]));

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
      <p className="food-meta">
        <NovaMarker group={food.processing.nova} fullLabel={novaFull} />
        <span className="muted">{t.food.burden.novaMeaning[food.processing.nova]}</span>
      </p>
      <FoodHonorsList food={food} card={card} />
      <div className="food-overview">
        <div className="axis-bars">
          <p className="bars-heading">{t.food.benefitsHeading}</p>
          {BENEFIT_AXES.map((axis) => (
            <AxisBar key={axis} label={t.axes[axis]} card={card} axis={axis} food={food} />
          ))}
          <p className="bars-heading">{t.food.burdensHeading}</p>
          {BURDEN_AXES.map((axis) => (
            <AxisBar key={axis} label={t.axes[axis]} card={card} axis={axis} food={food} className="burden" />
          ))}
          <AxisBar label={t.axes.composite} card={card} axis="composite" food={food} className="composite" />
        </div>
        <div className="food-charts">
          <div className="radar-pair food-radar-pair">
            <div>
              <h2 className="radar-block-heading">{t.compare.radarHeading}</h2>
              <CompareAxisRadar
                title={t.food.radarTitle(name)}
                entries={[{ id: food.id, label: name, food, card }]}
              />
            </div>
            <div>
              <h2 className="radar-block-heading">{t.compare.nutrientRadarHeading}</h2>
              <NutrientRadar entries={[{ id: food.id, label: name, food }]} />
            </div>
          </div>
        </div>
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
      <section className="panel">
        <h2>{t.food.bioactivesHeading}</h2>
        <p className="muted">{t.food.bioactivesLede}</p>
        <p className="muted">{t.compare.bioactivesProfileLede}</p>
        <BioactivesProfile foods={[food]} showSources />
      </section>
      <BurdenPanel food={food} card={card} />
      <ExposurePanel food={food} />
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
