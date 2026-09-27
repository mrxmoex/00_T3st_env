import { useEffect, useState } from "react";
import { useLocale } from "../i18n/LocaleContext";
import { applyTheme, readTheme, type Theme } from "../theme";

export function ThemeToggle() {
  const { t } = useLocale();
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
    <button type="button" className="btn" onClick={toggle} aria-label={t.theme.toggle}>
      {theme === "dark" ? t.theme.light : t.theme.dark}
    </button>
  );
}
