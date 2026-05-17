import { useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AppButton, PasswordInput } from '@shared/ui';
import { clearDraft, saveProfile } from '@shared/lib/storage';
import type { UserProfile } from '@shared/types';
import type { RegistrationFormValues } from '../../lib/types';
import { PasswordRequirement } from './components/password-requirement';
import { styles } from './styles';

type PasswordStepProps = {
  onComplete: () => void;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'errors.generic';
};

export const PasswordStep = ({
  onComplete,
}: PasswordStepProps) => {
  const { t } = useTranslation();
  const { control, getValues } = useFormContext<RegistrationFormValues>();

  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const password = useWatch({ control, name: 'password' }) ?? '';

  const requirements = useMemo(() => ({
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  }), [password]);

  const allRequirementsMet = Object.values(requirements).every(Boolean);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const canSubmit = allRequirementsMet && passwordsMatch;

  const handleComplete = useCallback(async () => {
    if (!canSubmit) {
      return;
    }

    try {
      setIsSubmitting(true);
      setPasswordError(null);

      // Get form values to build profile
      const formValues = getValues();

      // Build fullName from firstName and lastName
      const fullName = [formValues.firstName, formValues.lastName]
        .filter(Boolean)
        .join(' ')
        .trim();

      // Build minimal UserProfile with available data
      const profile: UserProfile = {
        phone: formValues.phone,
        role: 'customer',
        data: {
          fullName: fullName || 'User',
          birthDate: '',
          citizenship: '',
          phone: formValues.phone,
          iin: '',
          documentNumber: '',
          documentIssueDate: '',
          documentIssuer: '',
        },
      };

      // Save profile first
      await saveProfile(profile);

      // Clear draft after successful profile save
      await clearDraft();

      console.log('[DEV] Registration completed');

      onComplete();
    } catch (error: unknown) {
      console.warn('[PasswordStep] Failed to complete registration', error);
      setPasswordError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [canSubmit, getValues, onComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.contentSection}>
        <Text style={styles.title}>{t('registration.passwordTitle')}</Text>
        <Text style={styles.description}>
          {t('registration.passwordDescription')}
        </Text>

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <PasswordInput
              label={t('registration.passwordLabel')}
              value={value ?? ''}
              onChangeText={onChange}
              placeholder={t('registration.passwordPlaceholder')}
              showLabel={t('common.show')}
              hideLabel={t('common.hide')}
            />
          )}
        />

        <PasswordInput
          label={t('registration.confirmPasswordLabel')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={t('registration.confirmPasswordPlaceholder')}
          error={
            confirmPassword && !passwordsMatch
              ? t('errors.passwordMismatch')
              : undefined
          }
          showLabel={t('common.show')}
          hideLabel={t('common.hide')}
        />

        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>
            {t('registration.passwordRequirements')}
          </Text>
          <PasswordRequirement
            met={requirements.minLength}
            text={t('registration.passwordReq8Chars')}
          />
          <PasswordRequirement
            met={requirements.hasUppercase}
            text={t('registration.passwordReqUppercase')}
          />
          <PasswordRequirement
            met={requirements.hasLowercase}
            text={t('registration.passwordReqLowercase')}
          />
          <PasswordRequirement
            met={requirements.hasDigit}
            text={t('registration.passwordReqDigit')}
          />
          <PasswordRequirement
            met={requirements.hasSpecial}
            text={t('registration.passwordReqSpecial')}
          />
        </View>

        {passwordError ? (
          <Text style={styles.errorText}>{t(passwordError)}</Text>
        ) : null}
      </View>

      <View style={styles.actionArea}>
        <AppButton
          title={t('registration.complete')}
          onPress={handleComplete}
          disabled={!canSubmit || isSubmitting}
          loading={isSubmitting}
        />
      </View>
    </View>
  );
};
