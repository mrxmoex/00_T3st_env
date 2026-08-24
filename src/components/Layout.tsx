import { NavLink, Outlet } from "react-router-dom";
import { DATA_META } from "../data/catalog";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { to: "/", label: "Matrix" },
  { to: "/compare", label: "Compare" },
  { to: "/recommend", label: "Best practice" },
  { to: "/method", label: "Methodology" },
  { to: "/limits", label: "Non-claims" },
] as const;

export function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <strong>Du bist was du isst</strong>
          <span>Biochemical food matrix · v{DATA_META.version}</span>
        </NavLink>
        <nav className="nav" aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
          <ThemeToggle />
        </nav>
      </header>
      <Outlet />
      <footer className="site">
        Free public access. Deterministic scores from raw tables + published coefficients.
        Last verified {DATA_META.lastVerified}. Not medical advice.
      </footer>
    </div>
  );
}
