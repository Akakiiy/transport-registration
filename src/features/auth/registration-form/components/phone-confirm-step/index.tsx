import { useState } from 'react';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import type { CountryCode } from 'libphonenumber-js';
import { COUNTRIES, DEFAULT_COUNTRY_CODE, getCountryByCode } from '@shared/config';
import { mockSendPhoneCode, mockVerifySmsCode } from '@shared/lib/mock-api';
import { phoneFormSchema, smsCodeFormSchema } from '../../lib/schema';
import type { PhoneFormValues, SmsCodeFormValues } from '../../lib/types';
import { RESEND_TIMEOUT_MS, SMS_CODE_LENGTH } from '../../lib/constants';
import { useResendTimer } from '../../lib/use-resend-timer';
import { PhoneInputState } from './components/phone-input-state';
import { SmsCodeState } from './components/sms-code-state';
import { styles } from './styles';

type PhoneConfirmStepProps = {
  initialPhone?: string;
  initialCountryCode?: CountryCode;
  initialState?: 'phone-input' | 'sms-code';
  initialResendAvailableAt?: number;
  onPhoneSubmit: (phone: string, countryCode: CountryCode, resendAvailableAt: number) => void;
  onSmsVerified: () => void;
  onBackToPhoneInput: () => void;
};

export const PhoneConfirmStep = ({
  initialPhone,
  initialCountryCode,
  initialState = 'phone-input',
  initialResendAvailableAt,
  onPhoneSubmit,
  onSmsVerified,
  onBackToPhoneInput,
}: PhoneConfirmStepProps) => {
  const { t } = useTranslation();
  const [currentState, setCurrentState] = useState<'phone-input' | 'sms-code'>(initialState);
  const [submittedPhone, setSubmittedPhone] = useState(initialPhone || '');
  const [submittedCountryCode, setSubmittedCountryCode] = useState<CountryCode>(
    initialCountryCode || DEFAULT_COUNTRY_CODE,
  );
  const [resendAvailableAt, setResendAvailableAt] = useState<number | undefined>(
    initialResendAvailableAt,
  );

  const { canResend, formattedRemaining } = useResendTimer(resendAvailableAt);

  // Phone form
  const {
    control: phoneControl,
    formState: { isValid: isPhoneValid },
    handleSubmit: handlePhoneSubmit,
    setValue: setPhoneValue,
    watch: watchPhone,
  } = useForm<PhoneFormValues>({
    defaultValues: {
      countryCode: initialCountryCode || DEFAULT_COUNTRY_CODE,
      phone: initialPhone || '',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(phoneFormSchema),
  });

  const phoneCountryCode = watchPhone('countryCode');

  const [isPhoneSubmitting, setIsPhoneSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const onPhoneFormSubmit = handlePhoneSubmit(async (values) => {
    try {
      setIsPhoneSubmitting(true);
      setPhoneError(null);

      await mockSendPhoneCode(values.phone);

      const newResendAvailableAt = Date.now() + RESEND_TIMEOUT_MS;
      setSubmittedPhone(values.phone);
      setSubmittedCountryCode(values.countryCode);
      setResendAvailableAt(newResendAvailableAt);
      setCurrentState('sms-code');
      onPhoneSubmit(values.phone, values.countryCode, newResendAvailableAt);
    } catch (error) {
      console.warn('[PhoneConfirmStep] Failed to send phone code', error);
      setPhoneError(t('errors.generic'));
    } finally {
      setIsPhoneSubmitting(false);
    }
  });

  // SMS code form
  const {
    control: smsControl,
    handleSubmit: handleSmsSubmit,
    formState: { errors: smsErrors },
    setError: setSmsError,
    clearErrors: clearSmsErrors,
    setValue: setSmsValue,
  } = useForm<SmsCodeFormValues>({
    defaultValues: {
      code: '',
    },
    mode: 'onChange',
    resolver: zodResolver(smsCodeFormSchema),
  });

  const [isSmsSubmitting, setIsSmsSubmitting] = useState(false);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }

    return 'errors.generic';
  };

  const onSmsFormSubmit = handleSmsSubmit(async (values) => {
    try {
      setIsSmsSubmitting(true);
      await mockVerifySmsCode(values.code);
      onSmsVerified();
    } catch (error: unknown) {
      console.warn('[PhoneConfirmStep] Failed to verify SMS code', error);
      setSmsError('code', {
        type: 'manual',
        message: getErrorMessage(error),
      });
    } finally {
      setIsSmsSubmitting(false);
    }
  });

  const handleResend = async () => {
    if (!canResend) {
      return;
    }

    try {
      setIsSmsSubmitting(true);
      clearSmsErrors();
      setSmsValue('code', '');

      await mockSendPhoneCode(submittedPhone);

      const newResendAvailableAt = Date.now() + RESEND_TIMEOUT_MS;
      setResendAvailableAt(newResendAvailableAt);
      onPhoneSubmit(submittedPhone, submittedCountryCode, newResendAvailableAt);
    } catch (error) {
      console.warn('[PhoneConfirmStep] Failed to resend code', error);
      setSmsError('code', {
        type: 'manual',
        message: 'errors.generic',
      });
    } finally {
      setIsSmsSubmitting(false);
    }
  };

  const handleBackToPhone = () => {
    setCurrentState('phone-input');
    clearSmsErrors();
    setSmsValue('code', '');
    onBackToPhoneInput();
  };

  if (currentState === 'sms-code') {
    const country = getCountryByCode(submittedCountryCode);
    const formattedPhone = `${country.callingCode} ${submittedPhone}`;

    return (
      <View style={styles.container}>
        <SmsCodeState
          control={smsControl}
          errors={smsErrors}
          formattedPhone={formattedPhone}
          canResend={canResend}
          formattedRemaining={formattedRemaining}
          isSmsSubmitting={isSmsSubmitting}
          onCodeChange={(text) => {
            setSmsValue('code', text, { shouldValidate: true });
            clearSmsErrors();
            if (text.length === SMS_CODE_LENGTH) {
              onSmsFormSubmit();
            }
          }}
          onResend={handleResend}
          onBack={handleBackToPhone}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PhoneInputState
        control={phoneControl}
        countryCode={phoneCountryCode}
        countries={COUNTRIES}
        onChangeCountry={(nextCountryCode) => {
          setPhoneValue('countryCode', nextCountryCode, {
            shouldTouch: true,
            shouldValidate: true,
          });
          setPhoneValue('phone', '', {
            shouldTouch: true,
            shouldValidate: true,
          });
        }}
        onPhoneSubmit={onPhoneFormSubmit}
        isPhoneValid={isPhoneValid}
        isPhoneSubmitting={isPhoneSubmitting}
        phoneError={phoneError}
      />
    </View>
  );
};
