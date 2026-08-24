"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/", key: "home" as const },
  { href: "/matrix", key: "matrix" as const },
  { href: "/tiers", key: "tiers" as const },
  { href: "/compare", key: "compare" as const },
  { href: "/invariants", key: "invariants" as const },
  { href: "/sources", key: "sources" as const },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale, setLocale, copy } = useLocale();

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-3">
            <Link href="/" className="font-semibold tracking-tight text-ink">
              {copy.title}
            </Link>
            <span className="hidden text-xs text-muted sm:inline">{copy.free}</span>
          </div>
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            {LINKS.filter((link) => link.key !== "home").map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-2.5 py-1.5",
                    active ? "bg-bg-soft text-brass" : "text-muted hover:text-ink",
                  )}
                >
                  {copy.nav[link.key]}
                </Link>
              );
            })}
            <div className="ml-2 flex overflow-hidden rounded-md border border-line text-xs">
              <button
                type="button"
                onClick={() => setLocale("de")}
                className={cn("px-2 py-1", locale === "de" ? "bg-bg-soft text-ink" : "text-muted")}
              >
                DE
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={cn("px-2 py-1", locale === "en" ? "bg-bg-soft text-ink" : "text-muted")}
              >
                EN
              </button>
            </div>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-10">{children}</main>
      <footer className="border-t border-line px-4 py-6 text-center text-xs text-muted">
        {copy.seedNote}
      </footer>
    </div>
  );
}
