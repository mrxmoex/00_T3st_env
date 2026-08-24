"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/matrix", key: "matrix" },
  { href: "/tiers", key: "tiers" },
  { href: "/compare", key: "compare" },
  { href: "/invariants", key: "invariants" },
  { href: "/sources", key: "sources" },
] as const;

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const copy = t(locale);

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="min-w-0">
            <p className="font-serif text-lg leading-none text-paper">{copy.brand}</p>
            <p className="mt-1 truncate text-[11px] text-mute">{copy.tagline}</p>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-xs sm:text-sm",
                  pathname === link.href ? "bg-paper/10 text-paper" : "text-mute hover:text-paper",
                )}
              >
                {copy.nav[link.key]}
              </Link>
            ))}
            <div className="ml-2 flex overflow-hidden rounded-md border border-line">
              <button
                type="button"
                onClick={() => setLocale("de")}
                className={cn("px-2 py-1 text-xs", locale === "de" ? "bg-paper/10 text-paper" : "text-mute")}
              >
                DE
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={cn("px-2 py-1 text-xs", locale === "en" ? "bg-paper/10 text-paper" : "text-mute")}
              >
                EN
              </button>
            </div>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>
      <footer className="border-t border-line px-4 py-6 text-center text-[11px] text-mute">
        {copy.noLogin} · {copy.methodology}
      </footer>
    </div>
  );
}
