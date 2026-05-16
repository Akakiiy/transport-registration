import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../../../shared/config/i18n';
import { getSelectedLanguage } from '../../../shared/lib/storage';

type I18nProviderProps = {
  children: ReactNode;
};

export const I18nProvider = ({ children }: I18nProviderProps) => {
  useEffect(() => {
    let isMounted = true;

    const setupLanguage = async () => {
      const language = await getSelectedLanguage();

      if (!isMounted || !language) {
        return;
      }

      await i18n.changeLanguage(language);
    };

    setupLanguage().catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
