import { DATA_META } from "../data/catalog";
import { DATASETS, NUTRIENT_KEYS, SOURCE_DBS, type SourceEntry } from "../data/sources/snapshot";
import { NUTRIENT_LABELS } from "../i18n/labels";
import { useLocale } from "../i18n/LocaleContext";
import type { FoodRecord, ScoreCard } from "../scoring/types";

function entryUrl(entry: SourceEntry): string | undefined {
  return entry.db === "FDC" ? `https://fdc.nal.usda.gov/food-details/${entry.code}/nutrients` : undefined;
}

export function SourcePanel({ food, card }: { food?: FoodRecord; card?: ScoreCard }) {
  const { t, locale, localize } = useLocale();
  const secondary = food?.sourceEntries[1];
  const filled = food && secondary
    ? NUTRIENT_KEYS.filter((key) => food.provenance[key]?.db === secondary.db).map((key) => localize(NUTRIENT_LABELS[key]))
    : [];

  return (
    <details className="panel">
      <summary>{t.source.summary}</summary>
      <p className="muted">{t.source.dataset(DATA_META.version, DATA_META.lastVerified)}</p>
      {food ? (
        <>
          <h3>{t.source.entriesHeading}</h3>
          <ul>
            {food.sourceEntries.map((entry, index) => {
              const url = entryUrl(entry);
              const name = (locale === "de" ? entry.name.de : undefined) ?? entry.name.en;
              return (
                <li key={`${entry.db}-${entry.code}`}>
                  <strong>
                    {entry.db} {entry.code}
                  </strong>{" "}
                  — {name}{" "}
                  <span className="muted">
                    ({index === 0 ? t.source.primary : entry.match === "similar" ? t.source.matchSimilar : t.source.matchSame}
                    {index > 0 && filled.length > 0 ? `; ${t.source.fills(filled.join(", "))}` : ""})
                  </span>
                  {url ? (
                    <>
                      {" "}
                      <a href={url} target="_blank" rel="noreferrer">
                        {t.source.link}
                      </a>
                    </>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {food.sources.length > 0 ? (
            <>
              <h3>{t.source.curatedHeading}</h3>
              <ul>
                {food.sources.map((source) => (
                  <li key={`${source.label}-${source.id ?? ""}`}>
                    <strong>{source.label}</strong>
                    {source.id ? ` · ${source.id}` : ""}
                    {source.note ? ` — ${source.note}` : ""}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </>
      ) : (
        <ul>
          {t.source.general.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      <h3>{t.source.datasetsHeading}</h3>
      <ul>
        {SOURCE_DBS.map((db) => {
          const dataset = DATASETS[db];
          return (
            <li key={db}>
              {dataset.citation} <span className="muted">({dataset.license})</span>{" "}
              {dataset.doi ? (
                <a href={`https://doi.org/${dataset.doi}`} target="_blank" rel="noreferrer">
                  DOI
                </a>
              ) : (
                <a href={dataset.url} target="_blank" rel="noreferrer">
                  {t.source.link}
                </a>
              )}
            </li>
          );
        })}
      </ul>
      <p className="muted">{t.source.updatePath}</p>
      {card ? (
        <p className="mono muted">
          {t.source.cardLine({
            aas: card.eaa.aas,
            diaas: card.eaa.diaas,
            pdcaas: card.eaa.pdcaas,
            limiting: card.eaa.limitingAa.toUpperCase(),
            rae: card.micro.raeUg,
            iron: card.micro.absorbableIronMg,
          })}
        </p>
      ) : null}
    </details>
  );
}
