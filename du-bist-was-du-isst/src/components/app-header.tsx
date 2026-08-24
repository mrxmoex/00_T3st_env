"use client";

import { useLocale } from "@/i18n/locale-context";
import { t } from "@/i18n/messages";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AppHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppHeader({ activeTab, onTabChange }: AppHeaderProps) {
  const { locale, setLocale } = useLocale();

  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {t("app", "title", locale)}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              {t("app", "subtitle", locale)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {t("ui", "noLogin", locale)}
            </span>
            <div className="flex rounded-md border border-border/60">
              <Button
                variant={locale === "de" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-r-none"
                onClick={() => setLocale("de")}
              >
                DE
              </Button>
              <Button
                variant={locale === "en" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-l-none"
                onClick={() => setLocale("en")}
              >
                EN
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={onTabChange} className="mt-4">
          <TabsList className="grid w-full grid-cols-4 sm:w-auto sm:inline-flex">
            <TabsTrigger value="matrix">{t("nav", "matrix", locale)}</TabsTrigger>
            <TabsTrigger value="tiers">{t("nav", "tiers", locale)}</TabsTrigger>
            <TabsTrigger value="compare">{t("nav", "compare", locale)}</TabsTrigger>
            <TabsTrigger value="invariants">{t("nav", "invariants", locale)}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
}
