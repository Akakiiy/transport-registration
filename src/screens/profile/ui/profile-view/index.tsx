import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@shared/ui';
import type { UserProfile } from '@shared/types';
import { styles } from './styles';

type ProfileViewProps = {
  profile: UserProfile;
  onEdit: () => void;
  onLogout: () => void;
};

export const ProfileView = ({ profile, onEdit, onLogout }: ProfileViewProps) => {
  const { t } = useTranslation();
  const roleText =
    profile.role === 'customer' ? t('profile.customer') : t('profile.carrier');

  return (
    <View style={styles.content}>
      <View style={styles.fieldsContainer}>
        <View style={styles.field}>
          <Text style={styles.label}>{t('profile.phone')}</Text>
          <Text style={styles.value}>{profile.phone}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('profile.role')}</Text>
          <Text style={styles.value}>{roleText}</Text>
        </View>

        {profile.data.companyName ? (
          <View style={styles.field}>
            <Text style={styles.label}>{t('profile.company')}</Text>
            <Text style={styles.value}>{profile.data.companyName}</Text>
          </View>
        ) : null}

        {profile.data.fullName ? (
          <View style={styles.field}>
            <Text style={styles.label}>{t('profile.fullName')}</Text>
            <Text style={styles.value}>{profile.data.fullName}</Text>
          </View>
        ) : null}

        {profile.data.email ? (
          <View style={styles.field}>
            <Text style={styles.label}>{t('profile.email')}</Text>
            <Text style={styles.value}>{profile.data.email}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.buttonsContainer}>
        <AppButton title={t('profile.edit')} onPress={onEdit} />
        <AppButton title={t('profile.logout')} onPress={onLogout} variant="secondary" />
      </View>
    </View>
  );
};
