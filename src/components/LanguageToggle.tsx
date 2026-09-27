import { LOCALES, type Locale } from "../i18n/locale";
import { useLocale } from "../i18n/LocaleContext";

const NATIVE_NAMES: Record<Locale, string> = { de: "Deutsch", en: "English" };

export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="segmented" role="group" aria-label={t.languageLabel}>
      {LOCALES.map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          title={NATIVE_NAMES[option]}
          aria-label={NATIVE_NAMES[option]}
          aria-pressed={locale === option}
          onClick={() => setLocale(option)}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
