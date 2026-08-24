import { useTheme } from "../state/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      className="border border-stone-600/60 px-2 py-1 text-xs uppercase tracking-wide text-stone-600 hover:border-copper-400 hover:text-copper-600 dark:text-stone-300"
      onClick={toggle}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
