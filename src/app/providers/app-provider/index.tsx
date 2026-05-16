import { AppNavigator } from '@app/navigation';
import { I18nProvider } from '@app/providers/i18n-provider';

export const AppProvider = () => {
  return (
    <I18nProvider>
      <AppNavigator />
    </I18nProvider>
  );
};
