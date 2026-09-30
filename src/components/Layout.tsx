import { NavLink, Outlet } from "react-router-dom";
import { DATA_META } from "../data/catalog";
import { useLocale } from "../i18n/LocaleContext";
import { LanguageToggle } from "./LanguageToggle";
import { PersonBar } from "./PersonBar";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { to: "/", key: "matrix" },
  { to: "/compare", key: "compare" },
  { to: "/recommend", key: "recommend" },
  { to: "/method", key: "method" },
  { to: "/limits", key: "limits" },
] as const;

export function Layout() {
  const { t } = useLocale();

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <strong>Du bist was du isst</strong>
          <span>{t.brandTagline(DATA_META.version)}</span>
        </NavLink>
        <nav className="nav" aria-label={t.nav.label}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
            >
              {t.nav[link.key]}
            </NavLink>
          ))}
          <LanguageToggle />
          <ThemeToggle />
        </nav>
      </header>
      <PersonBar />
      <Outlet />
      <footer className="site">{t.footer(DATA_META.lastVerified)}</footer>
    </div>
  );
}
