'use client';

import { supportedLocales } from '../../i18n/config';
import { useTranslation } from '../../i18n/I18nProvider';
import type { Locale } from '../../i18n/resources';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation('vortex');

  return (
    <div className="respira-lang-switch">
      {supportedLocales.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            data-active={active}
            onClick={() => setLocale(code as Locale)}
            className={`respira-lang-chip ${active ? 'is-active' : ''}`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
