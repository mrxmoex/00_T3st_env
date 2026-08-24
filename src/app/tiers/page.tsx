"use client";

import { TierBoard } from "@/components/tier-board";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";

export default function TiersPage() {
  const { locale } = useLocale();
  const copy = t(locale);
  return (
    <div className="space-y-5">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl">{copy.nav.tiers}</h1>
        <p className="max-w-3xl text-sm text-mute">{copy.methodology}</p>
      </header>
      <TierBoard />
    </div>
  );
}
