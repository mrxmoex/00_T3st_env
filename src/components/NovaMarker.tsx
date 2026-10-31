import type { NovaGroup } from "../scoring/types";

/** Compact NOVA group marker; full label in tooltip and aria-label. */
export function NovaMarker({ group, fullLabel }: { group: NovaGroup; fullLabel: string }) {
  return (
    <span className={`nova-marker nova-${group}`} title={fullLabel} aria-label={fullLabel}>
      <span className="nova-supernova" aria-hidden="true" />
      <span className="nova-marker-text">NOVA {group}</span>
    </span>
  );
}
