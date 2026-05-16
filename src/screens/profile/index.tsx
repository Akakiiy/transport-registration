import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenLayout } from '../../shared/ui/screen-layout';
import { styles } from './styles';

type ProfileScreenProps = {};

export const ProfileScreen = ({}: ProfileScreenProps) => {
  const { t } = useTranslation();

  return (
    <ScreenLayout title={t('profile.title')}>
      <View style={styles.content} />
    </ScreenLayout>
  );
};
