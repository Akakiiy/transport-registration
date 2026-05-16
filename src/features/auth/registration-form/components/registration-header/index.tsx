import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';

type RegistrationHeaderProps = {
  onBack: () => void;
  onClose: () => void;
};

export const RegistrationHeader = ({ onBack, onClose }: RegistrationHeaderProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backIcon}>←</Text>
      </Pressable>
      <Text style={styles.title}>{t('registration.title')}</Text>
      <Pressable onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeIcon}>×</Text>
      </Pressable>
    </View>
  );
};
