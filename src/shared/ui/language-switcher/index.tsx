import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage } from '@shared/config/i18n';
import { saveSelectedLanguage } from '@shared/lib';
import { styles } from './styles';

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage: SupportedLanguage = i18n.language.startsWith('ru')
    ? 'ru'
    : 'en';
  const nextLanguage: SupportedLanguage = currentLanguage === 'ru' ? 'en' : 'ru';

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
      <Pressable
        style={[styles.button, styles.buttonActive]}
        onPress={() => {
          changeLanguage(nextLanguage);
        }}
      >
        <Text style={styles.text}>
          {currentLanguage === 'ru' ? t('common.ru') : t('common.en')}
        </Text>
      </Pressable>
    </View>
  );
};
