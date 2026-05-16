import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '@shared/config/i18n';
import { getSelectedLanguage } from '@shared/lib';

type I18nProviderProps = {
  children: ReactNode;
};

export const I18nProvider = ({ children }: I18nProviderProps) => {
  useEffect(() => {
    let isMounted = true;

    const setupLanguage = async () => {
      try {
        const language = await getSelectedLanguage();

        if (!isMounted || !language) {
          return;
        }

        await i18n.changeLanguage(language);
      } catch (error) {
        console.warn('[I18nProvider] Failed to setup language', error);
      }
    };

    setupLanguage();

    return () => {
      isMounted = false;
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
