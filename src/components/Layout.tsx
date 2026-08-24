import { NavLink, Outlet } from "react-router-dom";
import { MANIFEST } from "../data/manifest";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { to: "/", label: "Matrix" },
  { to: "/compare", label: "Compare" },
  { to: "/recommend", label: "Best practice" },
  { to: "/methodology", label: "Methodology" },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 dark:bg-ink-950 dark:text-stone-200">
      <header className="border-b border-stone-300 dark:border-ink-700">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-copper-600 dark:text-copper-400">
              Public · free · auditable
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Du bist was du isst
            </h1>
            <p className="max-w-xl text-sm text-stone-600 dark:text-stone-400">
              Biochemical efficiency, completeness, and real-world value. No
              equivalence theater. No black-box score.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <nav className="flex flex-wrap gap-2 text-sm">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `border px-2 py-1 ${
                      isActive
                        ? "border-copper-500 text-copper-700 dark:text-copper-400"
                        : "border-stone-400 text-stone-600 hover:border-stone-700 dark:border-ink-600 dark:text-stone-400"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-stone-300 px-4 py-4 text-xs text-stone-500 dark:border-ink-700 dark:text-stone-500">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:flex-row sm:justify-between">
          <span>
            data {MANIFEST.dataVersion} · formula {MANIFEST.formulaVersion} ·
            verified {MANIFEST.lastVerified}
          </span>
          <span>Core matrix is free. Scores are functions, not opinions.</span>
        </div>
      </footer>
    </div>
  );
}
