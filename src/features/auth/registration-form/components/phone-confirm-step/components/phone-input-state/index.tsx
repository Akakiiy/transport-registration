import { Text, View } from 'react-native';
import { Controller, type Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { CountryCode } from 'libphonenumber-js';
import type { CountryOption } from '@shared/types';
import { AppButton, PhoneInput } from '@shared/ui';
import type { PhoneFormValues } from '../../../../lib/types';
import { styles } from './styles';

type PhoneInputStateProps = {
  control: Control<PhoneFormValues>;
  countryCode: CountryCode;
  countries: CountryOption[];
  onChangeCountry: (nextCountryCode: CountryCode) => void;
  onPhoneSubmit: () => void;
  isPhoneValid: boolean;
  isPhoneSubmitting: boolean;
  phoneError: string | null;
};

export const PhoneInputState = ({
  control,
  countryCode,
  countries,
  onChangeCountry,
  onPhoneSubmit,
  isPhoneValid,
  isPhoneSubmitting,
  phoneError,
}: PhoneInputStateProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('registration.phoneConfirmTitle')}</Text>
      <Text style={styles.description}>{t('registration.phoneConfirmDescription')}</Text>

      <Controller
        control={control}
        name="phone"
        render={({ field: { onBlur, onChange, value }, fieldState }) => (
          <PhoneInput
            countries={countries}
            countryCode={countryCode}
            error={
              fieldState.error
                ? t(fieldState.error.message ?? 'errors.invalidPhone')
                : undefined
            }
            label={t('login.phoneLabel')}
            onBlur={onBlur}
            onChangeCountry={onChangeCountry}
            onChangeText={onChange}
            placeholder={t('login.phonePlaceholder')}
            value={value}
          />
        )}
      />

      {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

      <AppButton
        title={t('registration.sendCode')}
        onPress={onPhoneSubmit}
        disabled={!isPhoneValid || isPhoneSubmitting}
        loading={isPhoneSubmitting}
      />
    </View>
  );
};
