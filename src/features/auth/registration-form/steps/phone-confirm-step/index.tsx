import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AppButton, PhoneInput } from '@shared/ui';
import { COUNTRIES, getCountryByCode } from '@shared/config';
import { mockSendPhoneCode, mockVerifySmsCode } from '@shared/lib/mock-api';
import type { RegistrationFormStep, RegistrationFormValues, } from '../../lib/types';
import { RESEND_TIMEOUT_MS, SMS_CODE_LENGTH } from '../../lib/constants';
import { useResendTimer } from '../../lib/use-resend-timer';
import { smsCodeSchema } from '../../lib/schema';
import { SmsCodeInput } from './components/sms-code-input';
import { styles } from './styles';

type PhoneConfirmStepProps = {
  initialResendAvailableAt?: number;
  onNext: () => void;
  saveRegistrationDraft: (params?: {
    resendAvailableAt?: number;
    step?: RegistrationFormStep;
  }) => Promise<void>;
  registerBackHandler?: (handler: (() => void) | null) => void;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'errors.generic';
};

export const PhoneConfirmStep = ({
  initialResendAvailableAt,
  onNext,
  saveRegistrationDraft,
  registerBackHandler,
}: PhoneConfirmStepProps) => {
  const { t } = useTranslation();
  const {
    control,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();

  const [isCodeStage, setIsCodeStage] = useState(
    Boolean(initialResendAvailableAt),
  );
  const [smsCode, setSmsCode] = useState('');
  const [smsError, setSmsError] = useState<string | null>(null);
  const [resendAvailableAt, setResendAvailableAt] = useState<
    number | undefined
  >(initialResendAvailableAt);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const { canResend, formattedRemaining } = useResendTimer(resendAvailableAt);
  const countryCode = watch('countryCode');

  const handleBackFromSms = useCallback(async () => {
    try {
      setIsCodeStage(false);
      setSmsCode('');
      setSmsError(null);
      setResendAvailableAt(undefined);

      // Unregister back handler when leaving SMS stage
      if (registerBackHandler) {
        registerBackHandler(null);
      }

      await saveRegistrationDraft({
        resendAvailableAt: undefined,
        step: 0,
      });
    } catch (error: unknown) {
      console.warn(
        '[PhoneConfirmStep] Failed to go back from SMS state',
        error,
      );
    }
  }, [saveRegistrationDraft, registerBackHandler]);

  const sendCodeAndStartTimer = async () => {
    const { phone } = getValues();
    await mockSendPhoneCode(phone);

    const nextResendAvailableAt = Date.now() + RESEND_TIMEOUT_MS;
    setResendAvailableAt(nextResendAvailableAt);
    setSmsCode('');
    setSmsError(null);

    await saveRegistrationDraft({
      resendAvailableAt: nextResendAvailableAt,
      step: 0,
    });
  };

  const handleSendCode = async () => {
    const isValid = await trigger(['phone', 'countryCode']);
    if (!isValid) {
      return;
    }

    try {
      setIsSending(true);
      setPhoneError(null);

      await sendCodeAndStartTimer();
      
      console.log('📱 [DEV] SMS code sent. Test code: 123456');
      
      setIsCodeStage(true);
      
      // Register back handler when entering SMS stage
      if (registerBackHandler) {
        registerBackHandler(handleBackFromSms);
      }
    } catch (error: unknown) {
      console.warn('[PhoneConfirmStep] Failed to send phone code', error);
      setPhoneError(t(getErrorMessage(error)));
    } finally {
      setIsSending(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) {
      return;
    }

    try {
      setIsVerifying(true);
      setSmsError(null);

      await sendCodeAndStartTimer();
    } catch (error: unknown) {
      console.warn('[PhoneConfirmStep] Failed to resend code', error);
      setSmsError(getErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify ?? smsCode;
    
    // Validate SMS code locally
    const validation = smsCodeSchema.safeParse(code);
    if (!validation.success) {
      setSmsError('errors.invalidSmsCode');
      return;
    }

    try {
      setIsVerifying(true);
      setSmsError(null);

      await mockVerifySmsCode(code);

      // Save draft for next step
      await saveRegistrationDraft({
        step: 1,
        resendAvailableAt: undefined,
      });

      // Move to next step
      onNext();
    } catch (error: unknown) {
      console.warn('[PhoneConfirmStep] Failed to verify SMS code', error);
      setSmsError(getErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  };

  // SMS Code Stage
  if (isCodeStage) {
    const { phone } = getValues();
    const country = getCountryByCode(countryCode);
    const formattedPhone = `${country.callingCode} ${phone}`;

    return (
      <View style={styles.container}>
        <View style={styles.contentSection}>
          <Text style={styles.title}>{t('registration.phoneConfirmTitle')}</Text>
          <Text style={styles.description}>
            {t('registration.smsDescription')} {formattedPhone}
          </Text>

          <View style={styles.smsCodeContainer}>
            <SmsCodeInput
              value={smsCode}
              onChangeText={value => {
                setSmsCode(value);
                setSmsError(null);
                if (value.length === SMS_CODE_LENGTH) {
                  // Auto-submit when code is complete - pass the value directly
                  setTimeout(() => {
                    handleVerify(value);
                  }, 100);
                }
              }}
              error={Boolean(smsError)}
            />
            {smsError ? (
              <Text style={styles.errorText}>{t(smsError)}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.actionArea}>
          <AppButton
            title={
              canResend
                ? t('registration.resendCode')
                : `${t('registration.resendCodeIn')} ${formattedRemaining}`
            }
            onPress={handleResend}
            disabled={!canResend || isVerifying}
            loading={isVerifying && !smsCode}
            variant={canResend ? 'primary' : 'secondary'}
          />
        </View>
      </View>
    );
  }

  // Phone Input Stage
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
