"use client";

import { BIOCHEMICAL_INVARIANTS } from "@/dataset/invariants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceCitation } from "@/components/source-citation";
import type { Locale } from "@/lib/types";

interface InvariantsPanelProps {
  locale: Locale;
}

export function InvariantsPanel({ locale }: InvariantsPanelProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {locale === "de"
          ? "Diese biochemischen Invarianten sind harte Systembeschränkungen — keine Meinungen. Jede Behauptung ist quellenverknüpft."
          : "These biochemical invariants are hard system constraints — not opinions. Every claim is source-linked."}
      </p>
      {BIOCHEMICAL_INVARIANTS.map((inv) => (
        <Card key={inv.id} className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{inv.title[locale]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed text-foreground/90">{inv.body[locale]}</p>
            <SourceCitation sourceIds={inv.sourceIds} locale={locale} compact />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
