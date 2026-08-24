import { useEffect, useState } from "react";
import { applyTheme, readTheme, type Theme } from "../theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const initial = readTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function toggle(): void {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button type="button" className="btn" onClick={toggle} aria-label="Toggle color theme">
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
