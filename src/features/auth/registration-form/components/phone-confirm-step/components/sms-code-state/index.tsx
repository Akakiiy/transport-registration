import { Text, View } from 'react-native';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@shared/ui';
import type { SmsCodeFormValues } from '../../../../lib/types';
import { SmsCodeInput } from '../../../sms-code-input';
import { styles } from './styles';

type SmsCodeStateProps = {
  control: Control<SmsCodeFormValues>;
  errors: FieldErrors<SmsCodeFormValues>;
  formattedPhone: string;
  canResend: boolean;
  formattedRemaining: string;
  isSmsSubmitting: boolean;
  onCodeChange: (nextCode: string) => void;
  onResend: () => void;
  onBack: () => void;
};

export const SmsCodeState = ({
  control,
  errors,
  formattedPhone,
  canResend,
  formattedRemaining,
  isSmsSubmitting,
  onCodeChange,
  onResend,
  onBack,
}: SmsCodeStateProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('registration.phoneConfirmTitle')}</Text>
      <Text style={styles.description}>
        {t('registration.smsDescription')} {formattedPhone}
      </Text>

      <View style={styles.smsCodeContainer}>
        <Controller
          control={control}
          name="code"
          render={({ field: { value } }) => (
            <SmsCodeInput
              value={value}
              onChangeText={onCodeChange}
              error={Boolean(errors.code)}
            />
          )}
        />
        {errors.code ? (
          <Text style={styles.errorText}>
            {t(errors.code.message || 'errors.invalidSmsCode')}
          </Text>
        ) : null}
      </View>

      <AppButton
        title={
          canResend
            ? t('registration.resendCode')
            : `${t('registration.resendCodeIn')} ${formattedRemaining}`
        }
        onPress={onResend}
        disabled={!canResend || isSmsSubmitting}
        loading={isSmsSubmitting}
        variant="secondary"
      />

      <AppButton
        title={t('common.back')}
        onPress={onBack}
        variant="secondary"
      />
    </View>
  );
};
