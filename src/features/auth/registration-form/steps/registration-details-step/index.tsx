import { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AppButton, AppInput } from '@shared/ui';
import type { RegistrationFormStep, RegistrationFormValues, } from '../../lib/types';
import { registrationDetailsStepSchema } from '../../lib/schema';
import { DateField } from './components/date-field';
import { SelectField } from './components/select-field';
import {
  CITIZENSHIP_OPTIONS,
  DRIVER_LICENSE_CATEGORY_OPTIONS,
} from './lib/options';
import { styles } from './styles';

type RegistrationDetailsStepProps = {
  onNext: () => void;
  saveRegistrationDraft: (params?: {
    step?: RegistrationFormStep;
  }) => Promise<void>;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'errors.generic';
};

export const RegistrationDetailsStep = ({
  onNext,
  saveRegistrationDraft,
}: RegistrationDetailsStepProps) => {
  const { t } = useTranslation();
  const {
    control,
    getValues,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const role = watch('role');
  const phone = watch('phone');
  const today = useMemo(() => new Date(), []);

  const citizenshipOptions = useMemo(
    () =>
      CITIZENSHIP_OPTIONS.map(option => ({
        value: option.value,
        label: t(option.labelKey),
      })),
    [t],
  );

  const driverLicenseCategoryOptions = useMemo(
    () =>
      DRIVER_LICENSE_CATEGORY_OPTIONS.map(category => ({
        value: category,
        label: category,
      })),
    [],
  );

  const handleContinue = useCallback(async () => {
    try {
      setIsSubmitting(true);

      const values = getValues();
      const validation = registrationDetailsStepSchema.safeParse({
        ...values,
        role,
      });

      if (!validation.success) {
        validation.error.issues.forEach(err => {
          const fieldName = err.path[0] as keyof RegistrationFormValues;
          setError(fieldName, { message: err.message });
        });
        return;
      }

      clearErrors();
      await saveRegistrationDraft({ step: 3 });
      onNext();
    } catch (error: unknown) {
      console.warn('[RegistrationDetailsStep] Failed to continue', error);
      setError('root', { message: t(getErrorMessage(error)) });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    getValues,
    role,
    setError,
    clearErrors,
    saveRegistrationDraft,
    onNext,
    t,
  ]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{t('registration.detailsTitle')}</Text>
        <Text style={styles.description}>
          {t('registration.detailsDescription')}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('registration.personalInfo')}
          </Text>

          <AppInput
            label={t('registration.phoneLabel')}
            value={phone}
            editable={false}
          />

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

          <Controller
            control={control}
            name="birthDate"
            render={({ field: { onChange, value } }) => (
              <DateField
                label={t('registration.birthDateLabel')}
                value={value ?? ''}
                onChange={onChange}
                placeholder={t('registration.datePlaceholder')}
                maximumDate={today}
                error={
                  errors.birthDate?.message
                    ? t(errors.birthDate.message)
                    : undefined
                }
              />
            )}
          />

          <Controller
            control={control}
            name="citizenship"
            render={({ field: { onChange, value } }) => (
              <SelectField
                label={t('registration.citizenshipLabel')}
                value={value ?? ''}
                onChange={onChange}
                placeholder={t('registration.citizenshipPlaceholder')}
                options={citizenshipOptions}
                error={
                  errors.citizenship?.message
                    ? t(errors.citizenship.message)
                    : undefined
                }
              />
            )}
          />

          <Controller
            control={control}
            name="iin"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label={t('registration.iinLabel')}
                value={value ?? ''}
                onChangeText={onChange}
                keyboardType="numeric"
                maxLength={12}
                error={errors.iin?.message ? t(errors.iin.message) : undefined}
              />
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('registration.documentInfo')}
          </Text>

          <Controller
            control={control}
            name="documentNumber"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label={t('registration.documentNumberLabel')}
                value={value ?? ''}
                onChangeText={onChange}
                error={
                  errors.documentNumber?.message
                    ? t(errors.documentNumber.message)
                    : undefined
                }
              />
            )}
          />

          <Controller
            control={control}
            name="documentIssueDate"
            render={({ field: { onChange, value } }) => (
              <DateField
                label={t('registration.documentIssueDateLabel')}
                value={value ?? ''}
                onChange={onChange}
                placeholder={t('registration.datePlaceholder')}
                maximumDate={today}
                error={
                  errors.documentIssueDate?.message
                    ? t(errors.documentIssueDate.message)
                    : undefined
                }
              />
            )}
          />

          <Controller
            control={control}
            name="documentIssuer"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label={t('registration.documentIssuerLabel')}
                value={value ?? ''}
                onChangeText={onChange}
                error={
                  errors.documentIssuer?.message
                    ? t(errors.documentIssuer.message)
                    : undefined
                }
              />
            )}
          />
        </View>

        {role === 'carrier' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('registration.driverLicenseInfo')}
            </Text>

            <Controller
              control={control}
              name="driverLicenseNumber"
              render={({ field: { onChange, value } }) => (
                <AppInput
                  label={t('registration.driverLicenseNumberLabel')}
                  value={value ?? ''}
                  onChangeText={onChange}
                  error={
                    errors.driverLicenseNumber?.message
                      ? t(errors.driverLicenseNumber.message)
                      : undefined
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="driverLicenseCategory"
              render={({ field: { onChange, value } }) => (
                <SelectField
                  label={t('registration.driverLicenseCategoryLabel')}
                  value={value ?? ''}
                  onChange={onChange}
                  placeholder={t('registration.driverLicenseCategoryPlaceholder')}
                  options={driverLicenseCategoryOptions}
                  error={
                    errors.driverLicenseCategory?.message
                      ? t(errors.driverLicenseCategory.message)
                      : undefined
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="driverLicenseIssueDate"
              render={({ field: { onChange, value } }) => (
                <DateField
                  label={t('registration.driverLicenseIssueDateLabel')}
                  value={value ?? ''}
                  onChange={onChange}
                  placeholder={t('registration.datePlaceholder')}
                  maximumDate={today}
                  error={
                    errors.driverLicenseIssueDate?.message
                      ? t(errors.driverLicenseIssueDate.message)
                      : undefined
                  }
                />
              )}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.actionArea}>
        <AppButton
          title={t('registration.continue')}
          onPress={handleContinue}
          disabled={isSubmitting}
          loading={isSubmitting}
        />
      </View>
    </View>
  );
};
