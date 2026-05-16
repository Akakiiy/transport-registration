import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage } from '../../config/i18n';
import { saveSelectedLanguage } from '../../lib/storage';
import { styles } from './styles';

type LanguageSwitcherProps = {};

export const LanguageSwitcher = ({}: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation();

  const changeLanguage = async (language: SupportedLanguage) => {
    await i18n.changeLanguage(language);
    await saveSelectedLanguage(language);
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
          changeLanguage('ru').catch(() => undefined);
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
          changeLanguage('en').catch(() => undefined);
        }}
      >
        <Text style={styles.text}>{t('common.en')}</Text>
      </Pressable>
    </View>
  );
};
