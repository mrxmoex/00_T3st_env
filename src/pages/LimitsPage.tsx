import { useLocale } from "../i18n/LocaleContext";

export function LimitsPage() {
  const { t } = useLocale();

  return (
    <main>
      <h1>{t.limits.title}</h1>
      <p className="lede">{t.limits.lede}</p>
      <section className="panel">
        <h2>{t.limits.nonClaimsHeading}</h2>
        <ul>
          {t.limits.nonClaims.map((claim) => (
            <li key={claim}>{claim}</li>
          ))}
        </ul>
      </section>
      <section className="panel">
        <h2>{t.limits.willDoHeading}</h2>
        <ul>
          {t.limits.willDo.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
