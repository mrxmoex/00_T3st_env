import { ExposureCatalog } from "../components/ExposurePanel";
import { useLocale } from "../i18n/LocaleContext";

export function ExposurePage() {
  const { t } = useLocale();
  return (
    <main>
      <h1>{t.exposure.title}</h1>
      <p className="lede">{t.exposure.lede}</p>
      <ExposureCatalog />
    </main>
  );
}
