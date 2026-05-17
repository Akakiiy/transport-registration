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
  const isCarrier = profile.role === 'carrier';

  const renderField = (label: string, value?: string) => {
    if (!value) {
      return null;
    }

    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    );
  };

  return (
    <View style={styles.content}>
      <View style={styles.fieldsContainer}>
        {renderField(t('profile.phone'), profile.phone)}
        {renderField(t('profile.role'), roleText)}

        <Text style={styles.sectionTitle}>{t('profile.personalInfo')}</Text>
        {renderField(t('profile.company'), profile.data.companyName)}
        {renderField(t('profile.fullName'), profile.data.fullName)}
        {renderField(t('profile.firstName'), profile.data.firstName)}
        {renderField(t('profile.lastName'), profile.data.lastName)}
        {renderField(t('profile.email'), profile.data.email)}
        {renderField(t('profile.birthDate'), profile.data.birthDate)}
        {renderField(t('profile.citizenship'), profile.data.citizenship)}
        {renderField(t('profile.iin'), profile.data.iin)}

        <Text style={styles.sectionTitle}>{t('profile.documentInfo')}</Text>
        {renderField(t('profile.documentNumber'), profile.data.documentNumber)}
        {renderField(t('profile.documentIssueDate'), profile.data.documentIssueDate)}
        {renderField(t('profile.documentIssuer'), profile.data.documentIssuer)}

        {isCarrier ? (
          <>
            <Text style={styles.sectionTitle}>{t('profile.driverLicenseInfo')}</Text>
            {renderField(
              t('profile.driverLicenseNumber'),
              profile.data.driverLicenseNumber,
            )}
            {renderField(
              t('profile.driverLicenseCategory'),
              profile.data.driverLicenseCategory,
            )}
            {renderField(
              t('profile.driverLicenseIssueDate'),
              profile.data.driverLicenseIssueDate,
            )}
          </>
        ) : null}
      </View>

      <View style={styles.buttonsContainer}>
        <AppButton title={t('profile.edit')} onPress={onEdit} />
        <AppButton title={t('profile.logout')} onPress={onLogout} variant="secondary" />
      </View>
    </View>
  );
};
