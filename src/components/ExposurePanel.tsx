import { Link } from "react-router-dom";
import {
  ADDITIVE_ENTRIES,
  EXPOSURE_CARDS,
  EXPOSURE_SOURCES,
  additivesForFood,
  exposureForFood,
} from "../data/exposure";
import { useLocale } from "../i18n/LocaleContext";
import type { FoodRecord } from "../scoring/types";

const ADDITIVES_IN_ORDER = [...ADDITIVE_ENTRIES].sort(
  (a, b) => Number(b.inTrackedCategories) - Number(a.inTrackedCategories) || a.code.localeCompare(b.code),
);

export function ExposurePanel({ food }: { food: FoodRecord }) {
  const { t, localize } = useLocale();
  const mentions = exposureForFood(food);
  const additives = additivesForFood(food);
  if (mentions.length === 0 && additives.length === 0) return null;

  return (
    <section className="panel">
      <h2>{t.exposure.foodHeading}</h2>
      <p className="muted">{t.exposure.foodLede}</p>
      {mentions.map((id) => {
        const card = EXPOSURE_CARDS[id];
        return (
          <article key={id}>
            <h3>{localize(card.title)}</h3>
            <p>{localize(card.body)}</p>
            <p className="muted">{localize(card.where)}</p>
          </article>
        );
      })}
      {additives.length > 0 ? (
        <>
          <h3>{t.exposure.enumbersHere}</h3>
          <ul>
            {additives.map((item) => (
              <li key={item.code}>
                <span className="mono">{item.code}</span> {localize(item.name)} · {localize(item.role)}
                {item.body ? <span className="role">{localize(item.body)}</span> : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <p>
        <Link className="btn" to="/exposure">
          {t.exposure.more}
        </Link>
      </p>
    </section>
  );
}

export function ExposureCatalog() {
  const { t, localize } = useLocale();
  return (
    <>
      {Object.values(EXPOSURE_CARDS).map((card) => (
        <article key={card.id} className="panel">
          <h2>{localize(card.title)}</h2>
          <p>{localize(card.body)}</p>
          <p className="muted">{localize(card.where)}</p>
          <ul className="muted">
            {card.sources.map((id) => (
              <li key={id}>
                <a href={EXPOSURE_SOURCES[id].url} target="_blank" rel="noreferrer">
                  {EXPOSURE_SOURCES[id].citation}
                </a>
              </li>
            ))}
          </ul>
        </article>
      ))}
      <section className="panel">
        <h2>{t.exposure.enumberHeading}</h2>
        <p>{t.exposure.enumberLede}</p>
        <div className="matrix-wrap">
          <table className="matrix wrap-table">
            <thead>
              <tr>
                <th>{t.exposure.columns.code}</th>
                <th>{t.exposure.columns.name}</th>
                <th>{t.exposure.columns.body}</th>
                <th>{t.exposure.columns.seen}</th>
              </tr>
            </thead>
            <tbody>
              {ADDITIVES_IN_ORDER.map((item) => (
                <tr key={item.code}>
                  <td className="mono">{item.code}</td>
                  <td>
                    {localize(item.name)}
                    <span className="role">{localize(item.role)}</span>
                  </td>
                  <td>{item.body ? localize(item.body) : "—"}</td>
                  <td>{item.inTrackedCategories ? t.exposure.seenYes : t.exposure.seenNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
