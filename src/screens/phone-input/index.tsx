import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@app/navigation/routes';
import { RootStackParamList } from '@app/navigation/types';
import { AppButton, ScreenLayout } from '@shared/ui';
import { styles } from './styles';

type PhoneInputScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PhoneInput'
>;

export const PhoneInputScreen = ({ navigation }: PhoneInputScreenProps) => {
  const { t } = useTranslation();

  return (
    <ScreenLayout title={t('phoneInput.title')}>
      <View style={styles.content}>
        <AppButton
          title={t('common.next')}
          onPress={() => navigation.navigate(ROUTES.RoleSelect)}
        />
      </View>
    </ScreenLayout>
  );
};
