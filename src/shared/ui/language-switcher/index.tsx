import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage } from '@shared/config/i18n';
import { saveSelectedLanguage } from '@shared/lib';
import { styles } from './styles';

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = async (language: SupportedLanguage) => {
    try {
      await i18n.changeLanguage(language);
    } catch (error) {
      console.warn('[LanguageSwitcher] Failed to change language', error);
      return;
    }

    try {
      await saveSelectedLanguage(language);
    } catch (error) {
      console.warn('[LanguageSwitcher] Failed to persist selected language', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('common.language')}</Text>
      <Pressable
        style={[
          styles.button,
          i18n.language === 'ru' && styles.buttonActive,
        ]}
        onPress={() => {
          changeLanguage('ru');
        }}
      >
        <Text style={styles.text}>{t('common.ru')}</Text>
      </Pressable>
      <Pressable
        style={[
          styles.button,
          i18n.language === 'en' && styles.buttonActive,
        ]}
        onPress={() => {
          changeLanguage('en');
        }}
      >
        <Text style={styles.text}>{t('common.en')}</Text>
      </Pressable>
    </View>
  );
};
