import { PROCESSING_EVIDENCE } from "../data/processing";
import { preparationIdeas, qualityBeyondTable, residueReality } from "../data/sourcing";
import { isTreat } from "../data/treat";
import { useLocale } from "../i18n/LocaleContext";
import { energyKcal, proteinReferenceG, sweatSodiumMg } from "../person/context";
import { usePerson } from "../person/PersonContext";
import type { FoodRecord } from "../scoring/types";

export function ContextPanels({ food }: { food: FoodRecord }) {
  const { t, localize } = useLocale();
  const { person } = usePerson();
  const ideas = preparationIdeas(food);
  const residues = residueReality(food);
  const quality = qualityBeyondTable(food);
  const treat = isTreat(food);
  const category = food.processing.evidence;
  const ingredients = category ? PROCESSING_EVIDENCE.categories[category].all : undefined;

  return (
    <>
      {treat ? (
        <section className="panel treat">
          <h2>
            <span className="treat-badge">{t.food.treatBadge}</span>
          </h2>
          <p>{t.food.treatNote}</p>
          {ingredients && ingredients.ingredientsMedian !== null ? (
            <p className="muted">
              {t.food.treatIngredients({
                median: ingredients.ingredientsMedian,
                over: ingredients.ingredientsOver3,
                known: ingredients.ingredientsKnown,
              })}
            </p>
          ) : null}
        </section>
      ) : null}
      {person ? (
        <section className="panel">
          <h2>{t.person.coverageHeading}</h2>
          <p>
            {t.person.coverage({
              energyPct: Math.round((food.kcalPer100g / energyKcal(person)) * 1000) / 10,
              proteinG: Math.round(food.proteinG * 10) / 10,
              proteinRef: Math.round(proteinReferenceG(person)),
              sodiumMg: Math.round(food.composition.sodiumMg),
              sodiumLow: Math.round(sweatSodiumMg(person)[0]),
              sodiumHigh: Math.round(sweatSodiumMg(person)[1]),
            })}
          </p>
          <p className="muted">{t.person.notAllowance}</p>
        </section>
      ) : null}
      <section className="panel">
        <h2>{t.food.sourcingHeading}</h2>
        {ideas.length > 0 ? (
          <>
            <h3>{t.food.sourcingPreparation}</h3>
            <ul>
              {ideas.map((idea) => (
                <li key={idea.en}>{localize(idea)}</li>
              ))}
            </ul>
          </>
        ) : null}
        <h3>{t.food.sourcingResidues}</h3>
        <ul>
          {residues.map((note) => (
            <li key={note.en}>{localize(note)}</li>
          ))}
        </ul>
      </section>
      {quality ? (
        <section className="panel">
          <h2>{t.food.qualityHeading}</h2>
          <p>{localize(quality)}</p>
        </section>
      ) : null}
    </>
  );
}
