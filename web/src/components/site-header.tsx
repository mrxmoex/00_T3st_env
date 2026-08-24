import Link from "next/link";
import { headers } from "next/headers";
import { getLocale, withLang } from "@/lib/locale";
import { UI, otherLocale, t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/", key: "matrix" },
  { href: "/compare", key: "compare" },
  { href: "/invariants", key: "invariants" },
  { href: "/sources", key: "sources" },
] as const;

export async function SiteHeader() {
  const locale = await getLocale();
  const headerList = await headers();
  const pathname = headerList.get("x-nahrung-path") ?? "/";
  const currentSearch = headerList.get("x-nahrung-search") ?? "";
  const params = new URLSearchParams(currentSearch.startsWith("?") ? currentSearch.slice(1) : currentSearch);
  params.set("lang", otherLocale(locale));
  const toggleHref = `${pathname}?${params.toString()}`;

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Link href={withLang("/", locale)} className="block font-semibold tracking-tight text-ink">
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
                href={withLang(link.href, locale)}
                className={cn(
                  "rounded-full px-3 py-1.5",
                  active ? "bg-bg-soft text-copper" : "text-muted hover:text-ink",
                )}
              >
                {t(UI[link.key], locale)}
              </Link>
            );
          })}
          <Link
            href={toggleHref}
            className="ml-1 rounded-full border border-line px-3 py-1.5 text-xs uppercase tracking-wide text-muted hover:text-ink"
          >
            {otherLocale(locale)}
          </Link>
        </nav>
      </div>
    </header>
  );
}
