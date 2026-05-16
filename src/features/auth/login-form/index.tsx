import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { wait } from '@shared/lib';
import { AppButton, Checkbox, PasswordInput, PhoneInput } from '@shared/ui';
import {
  COUNTRIES,
  DEFAULT_COUNTRY_CODE,
} from './lib/countries';
import { loginFormSchema } from './lib/schema';
import type { LoginFormValues } from './lib/types';
import { styles } from './styles';

export const LoginForm = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
    watch,
  } = useForm<LoginFormValues>({
    defaultValues: {
      countryCode: DEFAULT_COUNTRY_CODE,
      isPolicyAccepted: false,
      password: '',
      phone: '',
    },
    mode: 'onChange',
    resolver: zodResolver(loginFormSchema),
  });

  const countryCode = watch('countryCode');

  const onSubmit = handleSubmit(async (values) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await wait(1000);
      console.log('login submitted', values);
    } catch (error) {
      console.warn('[LoginForm] Failed to submit login form', error);
      setSubmitError(t('login.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <PhoneInput
            countries={COUNTRIES}
            countryCode={countryCode}
            error={
              errors.phone ? t(errors.phone.message ?? 'errors.invalidPhone') : undefined
            }
            label={t('login.phoneLabel')}
            onChangeCountry={(nextCountryCode) => {
              setValue('countryCode', nextCountryCode, {
                shouldValidate: true,
              });
              setValue('phone', '', { shouldValidate: true });
            }}
            onChangeText={onChange}
            placeholder={t('login.phonePlaceholder')}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <PasswordInput
            error={
              errors.password ? t(errors.password.message ?? 'errors.passwordMin') : undefined
            }
            label={t('login.passwordLabel')}
            onChangeText={onChange}
            placeholder={t('login.passwordPlaceholder')}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="isPolicyAccepted"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            checked={Boolean(value)}
            labelLink={t('login.policyLink')}
            labelPrefix={t('login.policyPrefix')}
            onPress={() => onChange(!value)}
          />
        )}
      />
      {errors.isPolicyAccepted ? (
        <Text style={styles.policyError}>
          {t(errors.isPolicyAccepted.message ?? 'errors.policyRequired')}
        </Text>
      ) : null}
      {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}
      <AppButton
        disabled={!isValid || isSubmitting}
        loading={isSubmitting}
        onPress={onSubmit}
        title={t('login.submit')}
      />
    </View>
  );
};
