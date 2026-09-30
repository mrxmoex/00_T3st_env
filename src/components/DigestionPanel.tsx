import { foodsInGroup } from "../data/catalog";
import { DIGESTION_SOURCES, METABOLISM_NOTES, MILIEU_LIMIT, fermentable, matrixNotes, spongyNotes, type DigestionSourceId } from "../data/digestion";
import { GLYCEMIC_SOURCES, glycemicAssessment } from "../data/glycemic";
import { PREPARATION_LABELS } from "../i18n/labels";
import { useLocale } from "../i18n/LocaleContext";
import type { FoodRecord } from "../scoring/types";

function sourceHref(id: DigestionSourceId): string | undefined {
  const source = DIGESTION_SOURCES[id];
  if ("doi" in source && source.doi) return `https://doi.org/${source.doi}`;
  if ("url" in source && source.url) return source.url;
  return undefined;
}

function SourceCite({ id }: { id: DigestionSourceId }) {
  const source = DIGESTION_SOURCES[id];
  const href = sourceHref(id);
  const author = source.citation.split(/[ ,]/)[0] ?? source.citation;
  const year = /\((\d{4})\)/.exec(source.citation)?.[1];
  const label = year ? `${author} ${year}` : author;
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" title={source.citation}>
      {label}
    </a>
  ) : (
    <span title={source.citation}>{label}</span>
  );
}

export function DigestionPanel({ food }: { food: FoodRecord }) {
  const { t, localize } = useLocale();
  const d = t.food;
  const glycemic = glycemicAssessment(food);
  const gas = fermentable(food);
  const spongy = spongyNotes(food);
  const matrix = matrixNotes(food);
  const siblings = foodsInGroup(food.group)
    .map((variant) => ({ variant, glycemic: glycemicAssessment(variant) }))
    .filter((row) => row.glycemic.status === "value");

  return (
    <section className="panel">
      <h2>{d.digestionHeading}</h2>
      <h3>{d.digestionGi}</h3>
      {glycemic.status === "value" ? (
        <>
          <p>
            <span className="mono">
              {glycemic.gi} · {d.digestionBands[glycemic.band]}
            </span>
            . {localize(glycemic.tested)}. {d.digestionLoad(glycemic.loadPer100g)}. <SourceCite id={glycemic.source} />
          </p>
          {glycemic.carriedOver ? <p className="muted">{d.digestionCarried}</p> : null}
        </>
      ) : null}
      {glycemic.status === "tooLittleCarbohydrate" ? <p>{d.digestionTooLittle(glycemic.availableCarbG)}</p> : null}
      {glycemic.status === "noData" ? <p>{d.digestionNoGi}</p> : null}
      {siblings.length > 1 ? (
        <ul>
          {siblings.map(({ variant, glycemic: value }) =>
            value.status === "value" ? (
              <li key={variant.id}>
                {localize(PREPARATION_LABELS[variant.preparation])}: <span className="mono">{value.gi}</span>
                {value.carriedOver ? <span className="muted"> · {d.digestionCarried}</span> : null}
              </li>
            ) : null,
          )}
        </ul>
      ) : null}

      <h3>{d.digestionFerment}</h3>
      {gas.status === "measured" ? <p>{d.digestionLactose(gas.gPer100g)}</p> : null}
      {gas.status === "class" ? (
        <p>
          {localize(gas.compound)} <SourceCite id={gas.source} />
        </p>
      ) : null}
      {gas.status === "notExpected" ? <p>{localize(gas.reason)}</p> : null}
      {gas.status === "noData" ? <p>{d.digestionNoFermentData}</p> : null}

      {spongy.length > 0 ? (
        <>
          <h3>{d.digestionSpongy}</h3>
          <ul>
            {spongy.map((note) => (
              <li key={note.en}>{localize(note)}</li>
            ))}
          </ul>
          <p className="muted">
            {glycemic.status === "value" && glycemic.band === "high" ? (
              <>
                <SourceCite id="olsson1970" /> ·{" "}
              </>
            ) : null}
            <SourceCite id="monash" />
          </p>
        </>
      ) : null}

      <h3>{d.digestionMatrix}</h3>
      <ul>
        {matrix.map((note) => (
          <li key={note.en}>{localize(note)}</li>
        ))}
      </ul>
      <p className="muted">
        <SourceCite id="jenkins1981" /> · <SourceCite id="parada2007" />
      </p>

      <h3>{d.digestionMilieu}</h3>
      <p>{localize(MILIEU_LIMIT)}</p>
      <p className="muted">
        <SourceCite id="iomFolate" />
      </p>

      <h3>{d.digestionMetabolism}</h3>
      <ul>
        {METABOLISM_NOTES.map((note) => (
          <li key={note.en}>{localize(note)}</li>
        ))}
      </ul>
      <p className="muted">
        <SourceCite id="enattah2002" /> · <SourceCite id="perry2007" /> · <SourceCite id="celis2017" />
      </p>
      <p className="muted">
        {d.digestionSources}: {GLYCEMIC_SOURCES.atkinson2021.citation}
      </p>
    </section>
  );
}
