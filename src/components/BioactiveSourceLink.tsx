import { BIOACTIVE_SOURCES, shortCitation, sourceLink, type BioactiveSourceId } from "../data/bioactives";

export function BioactiveSourceLink({ source }: { source: BioactiveSourceId }) {
  const ref = BIOACTIVE_SOURCES[source];
  const href = sourceLink(ref);
  const label = shortCitation(ref);
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" title={ref.citation}>
      {label}
    </a>
  ) : (
    <span title={ref.citation}>{label}</span>
  );
}
