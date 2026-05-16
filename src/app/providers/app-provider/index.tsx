import { AppNavigator } from '../../navigation';
import { I18nProvider } from '../i18n-provider';

type AppProviderProps = {};

export const AppProvider = ({}: AppProviderProps) => {
  return (
    <I18nProvider>
      <AppNavigator />
    </I18nProvider>
  );
};
