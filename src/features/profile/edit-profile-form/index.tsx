import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppButton, AppInput } from '@shared/ui';
import { saveProfile } from '@shared/lib/storage';
import type { UserProfile } from '@shared/types';
import { createEditProfileFormSchema } from './lib/schema';
import type { EditProfileFormProps, EditProfileFormValues } from './lib/types';
import { styles } from './styles';

export const EditProfileForm = ({
  profile,
  onSaved,
  onCancel,
}: EditProfileFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCarrier = profile.role === 'carrier';
  const roleText = isCarrier ? t('profile.carrier') : t('profile.customer');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(createEditProfileFormSchema(isCarrier)),
    defaultValues: useMemo(
      () => ({
        companyName: profile.data.companyName ?? '',
        firstName: profile.data.firstName ?? profile.data.fullName.split(' ')[0] ?? '',
        lastName: profile.data.lastName ?? profile.data.fullName.split(' ').slice(1).join(' ') ?? '',
        email: profile.data.email ?? '',
        birthDate: profile.data.birthDate ?? '',
        citizenship: profile.data.citizenship ?? '',
        iin: profile.data.iin ?? '',
        documentNumber: profile.data.documentNumber ?? '',
        documentIssueDate: profile.data.documentIssueDate ?? '',
        documentIssuer: profile.data.documentIssuer ?? '',
        driverLicenseNumber: profile.data.driverLicenseNumber ?? '',
        driverLicenseCategory: profile.data.driverLicenseCategory ?? '',
        driverLicenseIssueDate: profile.data.driverLicenseIssueDate ?? '',
      }),
      [profile],
    ),
  });

  const onSubmit = handleSubmit(async formValues => {
    try {
      setIsSubmitting(true);

      const fullName = [formValues.firstName, formValues.lastName]
        .filter(Boolean)
        .join(' ')
        .trim();

      const updatedProfile: UserProfile = {
        ...profile,
        data: {
          ...profile.data,
          fullName: fullName || 'User',
          companyName: formValues.companyName,
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          birthDate: formValues.birthDate,
          citizenship: formValues.citizenship,
          iin: formValues.iin,
          documentNumber: formValues.documentNumber,
          documentIssueDate: formValues.documentIssueDate,
          documentIssuer: formValues.documentIssuer,
          ...(isCarrier
            ? {
                driverLicenseNumber: formValues.driverLicenseNumber,
                driverLicenseCategory: formValues.driverLicenseCategory,
                driverLicenseIssueDate: formValues.driverLicenseIssueDate,
              }
            : {
                driverLicenseNumber: undefined,
                driverLicenseCategory: undefined,
                driverLicenseIssueDate: undefined,
              }),
        },
      };

      await saveProfile(updatedProfile);
      onSaved(updatedProfile);
    } catch (error: unknown) {
      console.warn('[EditProfileForm] Failed to save profile', error);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <View style={styles.content}>
      <View style={styles.fieldsContainer}>
        <View style={styles.readOnlyField}>
          <Text style={styles.label}>{t('profile.phone')}</Text>
          <Text style={styles.value}>{profile.phone}</Text>
        </View>

        <View style={styles.readOnlyField}>
          <Text style={styles.label}>{t('profile.role')}</Text>
          <Text style={styles.value}>{roleText}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t('profile.personalInfo')}</Text>

        <Controller
          control={control}
          name="companyName"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label={t('profile.company')}
              value={value}
              onChangeText={onChange}
              error={errors.companyName?.message ? t(errors.companyName.message) : undefined}
            />
          )}
        />

        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label={t('profile.firstName')}
              value={value}
              onChangeText={onChange}
              error={errors.firstName?.message ? t(errors.firstName.message) : undefined}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label={t('profile.lastName')}
              value={value}
              onChangeText={onChange}
              error={errors.lastName?.message ? t(errors.lastName.message) : undefined}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label={t('profile.email')}
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              error={errors.email?.message ? t(errors.email.message) : undefined}
            />
          )}
        />

        <Controller
          control={control}
          name="birthDate"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label={t('profile.birthDate')}
              value={value}
              onChangeText={onChange}
              placeholder={t('registration.datePlaceholder')}
              error={errors.birthDate?.message ? t(errors.birthDate.message) : undefined}
            />
          )}
        />

        <Controller
          control={control}
          name="citizenship"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label={t('profile.citizenship')}
              value={value}
              onChangeText={onChange}
              error={errors.citizenship?.message ? t(errors.citizenship.message) : undefined}
            />
          )}
        />

        <Controller
          control={control}
          name="iin"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label={t('profile.iin')}
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              maxLength={12}
              error={errors.iin?.message ? t(errors.iin.message) : undefined}
            />
          )}
        />

        <Text style={styles.sectionTitle}>{t('profile.documentInfo')}</Text>

        <Controller
          control={control}
          name="documentNumber"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label={t('profile.documentNumber')}
              value={value}
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
            <AppInput
              label={t('profile.documentIssueDate')}
              value={value}
              onChangeText={onChange}
              placeholder={t('registration.datePlaceholder')}
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
              label={t('profile.documentIssuer')}
              value={value}
              onChangeText={onChange}
              error={
                errors.documentIssuer?.message
                  ? t(errors.documentIssuer.message)
                  : undefined
              }
            />
          )}
        />

        {isCarrier ? (
          <>
            <Text style={styles.sectionTitle}>{t('profile.driverLicenseInfo')}</Text>

            <Controller
              control={control}
              name="driverLicenseNumber"
              render={({ field: { onChange, value } }) => (
                <AppInput
                  label={t('profile.driverLicenseNumber')}
                  value={value}
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
                <AppInput
                  label={t('profile.driverLicenseCategory')}
                  value={value}
                  onChangeText={onChange}
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
                <AppInput
                  label={t('profile.driverLicenseIssueDate')}
                  value={value}
                  onChangeText={onChange}
                  placeholder={t('registration.datePlaceholder')}
                  error={
                    errors.driverLicenseIssueDate?.message
                      ? t(errors.driverLicenseIssueDate.message)
                      : undefined
                  }
                />
              )}
            />
          </>
        ) : null}
      </View>

      <View style={styles.buttonsContainer}>
        <AppButton
          title={t('profile.save')}
          onPress={onSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
        />
        <AppButton
          title={t('profile.cancel')}
          onPress={onCancel}
          disabled={isSubmitting}
          variant="secondary"
        />
      </View>
    </View>
  );
};
