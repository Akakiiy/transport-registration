import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';

type SupportedLanguage = 'ru' | 'en';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v4',
      fallbackLng: 'ru',
      lng: 'ru',
      resources,
      interpolation: {
        escapeValue: false,
      },
    })
    .catch(() => undefined);
}

export { i18n };
export type { SupportedLanguage };
