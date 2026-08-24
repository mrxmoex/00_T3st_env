export type Theme = "dark" | "light";

export function readTheme(): Theme {
  const stored = localStorage.getItem("dbwdi-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("dbwdi-theme", theme);
}
