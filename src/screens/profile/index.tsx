import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenLayout } from '@shared/ui';
import { styles } from './styles';

export const ProfileScreen = () => {
  const { t } = useTranslation();

  return (
    <ScreenLayout title={t('profile.title')}>
      <View style={styles.content} />
    </ScreenLayout>
  );
};
