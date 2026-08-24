"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/locale-provider";
import { UI, otherLocale, t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/", key: "matrix" },
  { href: "/compare", key: "compare" },
  { href: "/invariants", key: "invariants" },
  { href: "/sources", key: "sources" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Link href="/" className="block font-semibold tracking-tight text-ink">
            {t(UI.title, locale)}
          </Link>
          <p className="truncate text-xs text-muted">{t(UI.subtitle, locale)}</p>
        </div>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5",
                  active ? "bg-bg-soft text-copper" : "text-muted hover:text-ink",
                )}
              >
                {t(UI[link.key], locale)}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setLocale(otherLocale(locale))}
            className="ml-1 rounded-full border border-line px-3 py-1.5 text-xs uppercase tracking-wide text-muted hover:text-ink"
          >
            {otherLocale(locale)}
          </button>
        </nav>
      </div>
    </header>
  );
}
