import { Text, View } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { DEFAULT_COUNTRY_CODE } from '@shared/config';
import { PhoneConfirmStep } from './steps/phone-confirm-step';
import { registrationFormSchema } from './lib/schema';
import { useRegistrationDraft } from './lib/use-registration-draft';
import type { RegistrationFormStep, RegistrationFormValues } from './lib/types';
import { styles } from './styles';

type RegistrationFormProps = {
  formStep: RegistrationFormStep;
  setFormStep: (step: RegistrationFormStep) => void;
  onRegisterBackHandler?: (handler: (() => void) | null) => void;
};

export const RegistrationForm = ({
  formStep,
  setFormStep,
  onRegisterBackHandler,
}: RegistrationFormProps) => {
  const { t } = useTranslation();

  const methods = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      phone: '',
      countryCode: DEFAULT_COUNTRY_CODE,
    },
  });

  const { isRestoring, restoredResendAvailableAt, saveRegistrationDraft } =
    useRegistrationDraft({
      methods,
      formStep,
      setFormStep,
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
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              {t('registration.userInfoPlaceholder')}
            </Text>
          </View>
        );
      case 2:
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              {t('registration.passwordPlaceholder')}
            </Text>
          </View>
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
