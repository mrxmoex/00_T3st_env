import { NavLink, Outlet } from "react-router-dom";
import { DATASET_META } from "../catalog/dataset-meta.ts";
import { ThemeToggle } from "./ThemeToggle.tsx";

const LINKS = [
  { to: "/", label: "Matrix" },
  { to: "/compare", label: "Compare" },
  { to: "/recommend", label: "Practice" },
  { to: "/methodology", label: "Methodology" },
] as const;

export function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <h1>Du bist was du isst</h1>
          <p>Efficiency-value-nutrition matrix · free, no paywall</p>
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
      <footer>
        Dataset {DATASET_META.version} · last verified {DATASET_META.lastVerified} ·
        formulas are deterministic, not AI scores
      </footer>
    </div>
  );
}
