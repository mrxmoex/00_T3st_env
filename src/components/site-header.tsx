"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, UI } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { useLocale } from "./locale-context";

const LINKS = [
  { href: "/", key: "navMatrix" },
  { href: "/compare", key: "navCompare" },
  { href: "/invariants", key: "navInvariants" },
  { href: "/sources", key: "navSources" },
] as const;

export function SiteHeader() {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-baseline gap-3">
          <Link href="/" className="font-serif text-xl tracking-tight text-cream">
            {t(UI.appName, locale)}
          </Link>
          <span className="hidden text-xs text-muted sm:inline">{t(UI.appTitle, locale)}</span>
        </div>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-sm px-2.5 py-1 text-muted hover:text-cream",
                  active && "bg-surface-2 text-cream",
                )}
              >
                {t(UI[link.key], locale)}
              </Link>
            );
          })}
          <div className="ml-2 flex rounded-sm border border-line">
            {(["de", "en"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={cn(
                  "px-2 py-1 text-xs uppercase",
                  locale === code ? "bg-gold text-bg" : "text-muted",
                )}
              >
                {code}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
