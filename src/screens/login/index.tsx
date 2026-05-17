import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app/navigation/types';
import { ROUTES } from '@app/navigation/routes';
import { LoginForm } from '@features/auth/login-form';
import { LanguageSwitcher, TranslineLogo } from '@shared/ui';
import { styles } from './styles';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <TranslineLogo />
          <LanguageSwitcher />
        </View>
        <Text style={styles.title}>{t('login.titleLine1')}</Text>
        <Text style={styles.title}>{t('login.titleLine2')}</Text>
        <Text style={styles.description}>{t('login.description')}</Text>
        <View style={styles.divider} />
        <View style={styles.form}>
          <LoginForm
            onRegisterPress={({ phone, countryCode }) =>
              navigation.navigate(ROUTES.Registration, {
                phone,
                countryCode,
              })
            }
          />
        </View>
        <View style={styles.footer}>
          <Pressable onPress={() => console.log('forgot password pressed')}>
            <Text style={styles.forgotLink}>{t('login.forgotPassword')}</Text>
          </Pressable>
          <Text style={styles.footerText}>{t('login.questions')}</Text>
          <Text style={styles.supportText}>{t('login.supportPhone')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
