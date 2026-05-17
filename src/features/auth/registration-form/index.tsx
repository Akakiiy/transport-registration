import { Text, View } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import type { CountryCode } from 'libphonenumber-js';
import { DEFAULT_COUNTRY_CODE } from '@shared/config';
import { PhoneConfirmStep } from './steps/phone-confirm-step';
import { UserInfoStep } from './steps/user-info-step';
import { PasswordStep } from './steps/password-step';

import { registrationFormSchema } from './lib/schema';
import { useRegistrationDraft } from './lib/use-registration-draft';
import type { RegistrationFormStep, RegistrationFormValues } from './lib/types';
import { styles } from './styles';

type RegistrationFormProps = {
  formStep: RegistrationFormStep;
  setFormStep: (step: RegistrationFormStep) => void;
  onRegisterBackHandler?: (handler: (() => void) | null) => void;
  onNavigateToProfile: () => void;
  initialPhone?: string;
  initialCountryCode?: CountryCode;
};

export const RegistrationForm = ({
  formStep,
  setFormStep,
  onRegisterBackHandler,
  onNavigateToProfile,
  initialPhone,
  initialCountryCode,
}: RegistrationFormProps) => {
  const { t } = useTranslation();

  const methods = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      phone: '',
      countryCode: DEFAULT_COUNTRY_CODE,
      companyName: '',
      lastName: '',
      firstName: '',
      email: '',
      password: '',
    },
  });

  const { isRestoring, restoredResendAvailableAt, saveRegistrationDraft } =
    useRegistrationDraft({
      methods,
      formStep,
      setFormStep,
      initialPhone,
      initialCountryCode,
    });

  const renderFormStep = (step: RegistrationFormStep) => {
    switch (step) {
      case 0:
        return (
          <PhoneConfirmStep
            initialResendAvailableAt={restoredResendAvailableAt}
            onNext={() => setFormStep(1)}
            saveRegistrationDraft={saveRegistrationDraft}
            registerBackHandler={onRegisterBackHandler}
          />
        );
      case 1:
        return (
          <UserInfoStep
            onNext={() => setFormStep(2)}
            saveRegistrationDraft={saveRegistrationDraft}
          />
        );
      case 2:
        return (
          <PasswordStep
            onComplete={onNavigateToProfile}
            saveRegistrationDraft={saveRegistrationDraft}
          />
        );
      default:
        return null;
    }
  };

  if (isRestoring) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>{renderFormStep(formStep)}</View>
    </FormProvider>
  );
};
