"use client";

import { getSource } from "@/data/sources";
import { useLocale } from "@/components/locale-provider";
import type { SourcedValue } from "@/lib/types";

export function SourceCite({ value, label }: { value: SourcedValue; label?: string }) {
  const { locale } = useLocale();
  const source = getSource(value.sourceId);
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      {label ? <span className="text-mute">{label}</span> : null}
      <span className="font-mono text-paper">
        {value.value}
        {value.unit ? ` ${value.unit}` : ""}
      </span>
      <a
        href={source.url}
        target="_blank"
        rel="noreferrer"
        className="text-[11px] text-gold underline decoration-gold/30 underline-offset-2 hover:decoration-gold"
        title={`${source.title} (${source.year})`}
      >
        {source.publisher} {value.year}
        {value.confidence !== "high" ? ` · ${value.confidence}` : ""}
      </a>
      {value.note ? <span className="w-full text-[11px] text-mute">{value.note[locale]}</span> : null}
    </span>
  );
}

export function SourceLink({ id }: { id: string }) {
  const source = getSource(id);
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      className="text-gold underline decoration-gold/30 underline-offset-2 hover:decoration-gold"
    >
      {source.title} ({source.year})
    </a>
  );
}
