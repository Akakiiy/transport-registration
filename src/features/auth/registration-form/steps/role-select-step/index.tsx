import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@shared/ui';
import type { RegistrationFormStep, RegistrationFormValues } from '../../lib/types';
import { roleSelectStepSchema } from '../../lib/schema';
import { styles } from './styles';

type RoleSelectStepProps = {
  onNext: () => void;
  saveRegistrationDraft: (params?: { step?: RegistrationFormStep }) => Promise<void>;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'errors.generic';
};

export const RoleSelectStep = ({
  onNext,
  saveRegistrationDraft,
}: RoleSelectStepProps) => {
  const { t } = useTranslation();
  const { watch, setValue, setError, clearErrors } = useFormContext<RegistrationFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRole = watch('role');

  const handleRoleSelect = useCallback((role: 'customer' | 'carrier') => {
    setValue('role', role, { shouldValidate: true, shouldDirty: true });
    clearErrors('role');
  }, [setValue, clearErrors]);

  const handleContinue = useCallback(async () => {
    try {
      setIsSubmitting(true);
      clearErrors('role');

      const validation = roleSelectStepSchema.safeParse({ role: selectedRole });

      if (!validation.success) {
        validation.error.issues.forEach(err => {
          const fieldName = err.path[0] as keyof RegistrationFormValues;
          setError(fieldName, { message: err.message });
        });
        return;
      }

      await saveRegistrationDraft({ step: 2 });
      onNext();
    } catch (error: unknown) {
      console.warn('[RoleSelectStep] Failed to continue', error);
      setError('root', { message: t(getErrorMessage(error)) });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedRole, saveRegistrationDraft, onNext, setError, clearErrors, t]);

  return (
    <View style={styles.container}>
      <View style={styles.contentSection}>
        <Text style={styles.title}>{t('registration.roleSelectTitle')}</Text>
        <Text style={styles.description}>
          {t('registration.roleSelectDescription')}
        </Text>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[
              styles.card,
              selectedRole === 'customer' && styles.cardSelected,
            ]}
            onPress={() => handleRoleSelect('customer')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.cardTitle,
              selectedRole === 'customer' && styles.cardTitleSelected,
            ]}>
              {t('registration.customerTitle')}
            </Text>
            <Text style={styles.cardDescription}>
              {t('registration.customerDescription')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.card,
              selectedRole === 'carrier' && styles.cardSelected,
            ]}
            onPress={() => handleRoleSelect('carrier')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.cardTitle,
              selectedRole === 'carrier' && styles.cardTitleSelected,
            ]}>
              {t('registration.carrierTitle')}
            </Text>
            <Text style={styles.cardDescription}>
              {t('registration.carrierDescription')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionArea}>
        <AppButton
          title={t('registration.continue')}
          onPress={handleContinue}
          disabled={!selectedRole || isSubmitting}
          loading={isSubmitting}
        />
      </View>
    </View>
  );
};
