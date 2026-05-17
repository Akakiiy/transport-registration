import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppButton, AppInput } from '@shared/ui';
import { saveProfile } from '@shared/lib/storage';
import type { UserProfile } from '@shared/types';
import { editProfileFormSchema } from './lib/schema';
import type { EditProfileFormProps, EditProfileFormValues } from './lib/types';
import { styles } from './styles';

export const EditProfileForm = ({
  profile,
  onSaved,
  onCancel,
}: EditProfileFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: useMemo(
      () => ({
        companyName: profile.data.companyName ?? '',
        firstName: profile.data.firstName ?? profile.data.fullName.split(' ')[0] ?? '',
        lastName: profile.data.lastName ?? profile.data.fullName.split(' ').slice(1).join(' ') ?? '',
        email: profile.data.email ?? '',
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
        <View style={styles.phoneField}>
          <Text style={styles.label}>{t('profile.phone')}</Text>
          <Text style={styles.value}>{profile.phone}</Text>
        </View>

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
