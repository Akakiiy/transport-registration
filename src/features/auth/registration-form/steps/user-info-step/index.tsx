import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AppButton, AppInput } from '@shared/ui';
import type { RegistrationFormStep, RegistrationFormValues, } from '../../lib/types';
import { userInfoStepSchema } from '../../lib/schema';
import { styles } from './styles';

type UserInfoStepProps = {
  onNext: () => void;
  saveRegistrationDraft: (params?: {
    resendAvailableAt?: number;
    step?: RegistrationFormStep;
  }) => Promise<void>;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'errors.generic';
};

export const UserInfoStep = ({
  onNext,
  saveRegistrationDraft,
}: UserInfoStepProps) => {
  const { t } = useTranslation();
  const {
    control,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();

  const [isSaving, setIsSaving] = useState(false);

  const handleContinue = useCallback(async () => {
    try {
      setIsSaving(true);

      const values = getValues();
      const validation = userInfoStepSchema.safeParse({
        companyName: values.companyName,
        lastName: values.lastName,
        firstName: values.firstName,
        email: values.email,
      });

      if (!validation.success) {
        validation.error.issues.forEach(err => {
          const fieldName = err.path[0] as keyof RegistrationFormValues;
          setError(fieldName, { message: err.message });
        });
        return;
      }

      clearErrors(['companyName', 'lastName', 'firstName', 'email']);

      await saveRegistrationDraft({ step: 2 });

      onNext();
    } catch (error: unknown) {
      console.warn('[UserInfoStep] Failed to continue', error);
      setError('root', { message: t(getErrorMessage(error)) });
    } finally {
      setIsSaving(false);
    }
  }, [getValues, setError, clearErrors, saveRegistrationDraft, onNext, t]);

  return (
    <View style={styles.container}>
      <View style={styles.contentSection}>
        <Text style={styles.title}>{t('registration.userInfoTitle')}</Text>
        <Text style={styles.description}>
          {t('registration.userInfoDescription')}
        </Text>
        <Controller
          control={control}
          name="companyName"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label={t('registration.companyNameLabel')}
              value={value ?? ''}
              onChangeText={onChange}
              error={
                errors.companyName?.message
                  ? t(errors.companyName.message)
                  : undefined
              }
            />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label={t('registration.lastNameLabel')}
              value={value ?? ''}
              onChangeText={onChange}
              error={
                errors.lastName?.message
                  ? t(errors.lastName.message)
                  : undefined
              }
            />
          )}
        />
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label={t('registration.firstNameLabel')}
              value={value ?? ''}
              onChangeText={onChange}
              error={
                errors.firstName?.message
                  ? t(errors.firstName.message)
                  : undefined
              }
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label={t('registration.emailLabel')}
              value={value ?? ''}
              onChangeText={onChange}
              keyboardType="email-address"
              error={
                errors.email?.message ? t(errors.email.message) : undefined
              }
            />
          )}
        />
      </View>
      <View style={styles.actionArea}>
        <AppButton
          title={t('registration.continue')}
          onPress={handleContinue}
          disabled={isSaving}
          loading={isSaving}
        />
      </View>
    </View>
  );
};
