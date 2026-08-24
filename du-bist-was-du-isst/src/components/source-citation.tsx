"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSource } from "@/dataset/sources";
import type { Locale } from "@/lib/types";
import { ExternalLink } from "lucide-react";

interface SourceCitationProps {
  sourceIds: string[];
  locale: Locale;
  compact?: boolean;
}

export function SourceCitation({ sourceIds, locale, compact }: SourceCitationProps) {
  const unique = [...new Set(sourceIds)];
  if (unique.length === 0) return null;

  if (compact) {
    return (
      <span className="inline-flex flex-wrap gap-1">
        {unique.map((id) => {
          const src = getSource(id);
          if (!src) return null;
          return (
            <Tooltip key={id}>
              <TooltipTrigger
              render={
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400 hover:underline"
                >
                  [{src.organization} {src.year}]
                </a>
              }
            />
              <TooltipContent className="max-w-xs">
                <p className="font-medium">{src.title}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </span>
    );
  }

  return (
    <ul className="space-y-1 text-xs text-muted-foreground">
      {unique.map((id) => {
        const src = getSource(id);
        if (!src) return null;
        return (
          <li key={id} className="flex items-start gap-1">
            <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 hover:underline"
            >
              {src.organization} ({src.year}): {src.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

interface TierBadgeProps {
  tier: string;
  label?: string;
}

const tierColors: Record<string, string> = {
  S: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  A: "bg-lime-500/20 text-lime-300 border-lime-500/40",
  B: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  C: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  D: "bg-red-500/20 text-red-300 border-red-500/40",
};

export function TierBadge({ tier, label }: TierBadgeProps) {
  return (
    <Badge variant="outline" className={tierColors[tier] ?? ""}>
      {label ?? tier}
    </Badge>
  );
}

interface DataFlagBadgeProps {
  flag: string;
  locale: Locale;
}

const flagLabels: Record<string, Record<Locale, string>> = {
  sparse: { de: "Spärlich", en: "Sparse" },
  contested: { de: "Umstritten", en: "Contested" },
  estimated: { de: "Geschätzt", en: "Estimated" },
};

export function DataFlagBadge({ flag, locale }: DataFlagBadgeProps) {
  return (
    <Badge variant="outline" className="border-amber-500/40 text-amber-300">
      {flagLabels[flag]?.[locale] ?? flag}
    </Badge>
  );
}
