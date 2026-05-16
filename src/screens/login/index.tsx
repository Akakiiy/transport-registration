import { ScrollView, Text, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '@features/auth/login-form';
import { LanguageSwitcher, TranslineLogo } from '@shared/ui';
import { styles } from './styles';

export const LoginScreen = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.languageWrapper}>
          <LanguageSwitcher />
        </View>
        <View style={styles.logoWrapper}>
          <TranslineLogo />
        </View>
        <Text style={styles.title}>{t('login.titleLine1')}</Text>
        <Text style={styles.title}>{t('login.titleLine2')}</Text>
        <Text style={styles.description}>{t('login.description')}</Text>
        <View style={styles.divider} />
        <View style={styles.form}>
          <LoginForm />
        </View>
        <View style={styles.linksRow}>
          <Text style={styles.noAccountText}>{t('login.noAccount')}</Text>
          <Pressable onPress={() => console.log('register pressed')}>
            <Text style={styles.registerLink}>{t('login.register')}</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => console.log('forgot password pressed')}>
          <Text style={styles.forgotLink}>{t('login.forgotPassword')}</Text>
        </Pressable>
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('login.questions')}</Text>
          <Text style={styles.supportText}>{t('login.supportPhone')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
