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
    formState: { isValid },
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
    mode: 'onTouched',
    reValidateMode: 'onChange',
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
        render={({ field: { onBlur, onChange, value }, fieldState }) => (
          <PhoneInput
            countries={COUNTRIES}
            countryCode={countryCode}
            error={
              fieldState.error
                ? t(fieldState.error.message ?? 'errors.invalidPhone')
                : undefined
            }
            label={t('login.phoneLabel')}
            onBlur={onBlur}
            onChangeCountry={(nextCountryCode) => {
              setValue('countryCode', nextCountryCode, {
                shouldTouch: true,
                shouldValidate: true,
              });
              setValue('phone', '', {
                shouldTouch: true,
                shouldValidate: true,
              });
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
        render={({ field: { onBlur, onChange, value }, fieldState }) => (
          <PasswordInput
            error={
              fieldState.error
                ? t(fieldState.error.message ?? 'errors.passwordMin')
                : undefined
            }
            hideLabel={t('common.hide')}
            label={t('login.passwordLabel')}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder={t('login.passwordPlaceholder')}
            showLabel={t('common.show')}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="isPolicyAccepted"
        render={({ field: { onBlur, onChange, value }, fieldState }) => (
          <>
            <Checkbox
              checked={Boolean(value)}
              labelLink={t('login.policyLink')}
              labelPrefix={t('login.policyPrefix')}
              onPress={() => {
                onChange(!value);
                onBlur();
              }}
            />
            {fieldState.error ? (
              <Text style={styles.policyError}>
                {t(fieldState.error.message ?? 'errors.policyRequired')}
              </Text>
            ) : null}
          </>
        )}
      />
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
