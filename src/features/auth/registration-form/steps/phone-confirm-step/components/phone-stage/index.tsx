import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AppButton, PhoneInput } from '@shared/ui';
import { COUNTRIES } from '@shared/config';
import { mockSendPhoneCode } from '@shared/lib/mock-api';
import type { RegistrationFormStep, RegistrationFormValues } from '../../../../lib/types';
import { RESEND_TIMEOUT_MS } from '../../../../lib/constants';
import { styles } from './styles';

type PhoneStageProps = {
  onCodeSent: (resendAvailableAt: number) => void;
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

export const PhoneStage = ({
  onCodeSent,
  saveRegistrationDraft,
}: PhoneStageProps) => {
  const { t } = useTranslation();
  const {
    control,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();

  const [isSending, setIsSending] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const countryCode = watch('countryCode');

  const handleSendCode = useCallback(async () => {
    const isValid = await trigger(['phone', 'countryCode']);
    if (!isValid) {
      return;
    }

    try {
      setIsSending(true);
      setPhoneError(null);

      const { phone } = getValues();
      await mockSendPhoneCode(phone);

      const nextResendAvailableAt = Date.now() + RESEND_TIMEOUT_MS;

      await saveRegistrationDraft({
        resendAvailableAt: nextResendAvailableAt,
        step: 0,
      });

      console.log('📱 [DEV] SMS verification code: 1111');

      onCodeSent(nextResendAvailableAt);
    } catch (error: unknown) {
      console.warn('[PhoneStage] Failed to send phone code', error);
      setPhoneError(t(getErrorMessage(error)));
    } finally {
      setIsSending(false);
    }
  }, [trigger, getValues, saveRegistrationDraft, onCodeSent, t]);

  return (
    <View style={styles.container}>
      <View style={styles.contentSection}>
        <Text style={styles.title}>{t('registration.phoneConfirmTitle')}</Text>
        <Text style={styles.description}>
          {t('registration.phoneConfirmDescription')}
        </Text>

        <Controller
          control={control}
          name="phone"
          render={({ field: { onBlur, onChange, value } }) => (
            <PhoneInput
              countries={COUNTRIES}
              countryCode={countryCode}
              error={errors.phone?.message ? t(errors.phone.message) : undefined}
              label={t('login.phoneLabel')}
              onBlur={onBlur}
              onChangeCountry={nextCountryCode => {
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

        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
      </View>

      <View style={styles.actionArea}>
        <AppButton
          title={t('registration.sendCode')}
          onPress={handleSendCode}
          disabled={isSending}
          loading={isSending}
        />
      </View>
    </View>
  );
};
