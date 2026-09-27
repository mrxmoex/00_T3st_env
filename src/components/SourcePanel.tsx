import { DATA_META } from "../data/catalog";
import { useLocale } from "../i18n/LocaleContext";
import type { FoodRecord, ScoreCard } from "../scoring/types";

export function SourcePanel({ food, card }: { food?: FoodRecord; card?: ScoreCard }) {
  const { t } = useLocale();

  return (
    <details className="panel">
      <summary>{t.source.summary}</summary>
      <p className="muted">{t.source.dataset(DATA_META.version, DATA_META.lastVerified)}</p>
      <p className="muted">{t.source.updatePath}</p>
      {food ? (
        <ul>
          {food.sources.map((source) => (
            <li key={`${source.label}-${source.id ?? ""}`}>
              <strong>{source.label}</strong>
              {source.id ? ` · ${source.id}` : ""}
              {source.note ? ` — ${source.note}` : ""}
              {source.url ? (
                <>
                  {" "}
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {t.source.link}
                  </a>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          {t.source.general.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
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
