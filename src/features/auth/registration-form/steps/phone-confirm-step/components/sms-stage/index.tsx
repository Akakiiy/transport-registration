import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@shared/ui';
import { getCountryByCode } from '@shared/config';
import { mockSendPhoneCode, mockVerifySmsCode } from '@shared/lib/mock-api';
import type { RegistrationFormStep, RegistrationFormValues } from '../../../../lib/types';
import { RESEND_TIMEOUT_MS, SMS_CODE_LENGTH } from '../../../../lib/constants';
import { useResendTimer } from '../../../../lib/use-resend-timer';
import { smsCodeSchema } from '../../../../lib/schema';
import { SmsCodeInput } from '../sms-code-input';
import { styles } from './styles';

type SmsStageProps = {
  resendAvailableAt?: number;
  onResendCodeSent: (resendAvailableAt: number) => void;
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

export const SmsStage = ({
  resendAvailableAt,
  onResendCodeSent,
  onNext,
  saveRegistrationDraft,
}: SmsStageProps) => {
  const { t } = useTranslation();
  const { getValues, watch } = useFormContext<RegistrationFormValues>();

  const [smsCode, setSmsCode] = useState('');
  const [smsError, setSmsError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const { canResend, formattedRemaining } = useResendTimer(resendAvailableAt);
  const countryCode = watch('countryCode');

  const handleVerify = useCallback(async (codeToVerify: string) => {
    // Validate SMS code locally
    const validation = smsCodeSchema.safeParse(codeToVerify);
    if (!validation.success) {
      setSmsError('errors.invalidSmsCode');
      return;
    }

    try {
      setIsVerifying(true);
      setSmsError(null);

      await mockVerifySmsCode(codeToVerify);

      // Save draft for next step
      await saveRegistrationDraft({
        step: 1,
        resendAvailableAt: undefined,
      });

      // Move to next step
      onNext();
    } catch (error: unknown) {
      console.warn('[SmsStage] Failed to verify SMS code', error);
      setSmsError(getErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  }, [saveRegistrationDraft, onNext]);

  const handleResend = useCallback(async () => {
    if (!canResend) {
      return;
    }

    try {
      setIsVerifying(true);
      setSmsError(null);

      const { phone } = getValues();
      await mockSendPhoneCode(phone);

      const nextResendAvailableAt = Date.now() + RESEND_TIMEOUT_MS;

      setSmsCode('');

      await saveRegistrationDraft({
        resendAvailableAt: nextResendAvailableAt,
        step: 0,
      });

      console.log('📱 [DEV] SMS verification code: 1111');

      onResendCodeSent(nextResendAvailableAt);
    } catch (error: unknown) {
      console.warn('[SmsStage] Failed to resend code', error);
      setSmsError(getErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  }, [canResend, getValues, saveRegistrationDraft, onResendCodeSent]);

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
};
