import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { CountryCode } from 'libphonenumber-js';
import { getDraft, saveDraft, clearDraft } from '@shared/lib/storage';
import type { PhoneConfirmationState, RegistrationStep } from '@shared/types';
import { RegistrationHeader } from './components/registration-header';
import { StepProgress } from './components/step-progress';
import { PhoneConfirmStep } from './components/phone-confirm-step';
import { styles } from './styles';

type RegistrationFormProps = {
  onBack: () => void;
  onClose: () => void;
};

export const RegistrationForm = ({ onBack, onClose }: RegistrationFormProps) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('phone-confirmation');
  const [phoneConfirmationState, setPhoneConfirmationState] = useState<PhoneConfirmationState>('phone-input');
  const [phone, setPhone] = useState<string | undefined>();
  const [countryCode, setCountryCode] = useState<CountryCode | undefined>();
  const [resendAvailableAt, setResendAvailableAt] = useState<number | undefined>();
  const [isPhoneConfirmed, setIsPhoneConfirmed] = useState(false);

  // Restore draft on mount
  useEffect(() => {
    const restoreDraft = async () => {
      try {
        const draft = await getDraft();
        if (draft && draft.step === 'phone-confirmation') {
          setCurrentStep(draft.step);
          setPhoneConfirmationState(draft.phoneConfirmationState || 'phone-input');
          setPhone(draft.phone);
          setCountryCode(draft.countryCode);
          setResendAvailableAt(draft.resendAvailableAt);
        }
      } catch (error) {
        console.warn('[RegistrationForm] Failed to restore draft', error);
      }
    };

    restoreDraft();
  }, []);

  const handlePhoneSubmit = async (
    submittedPhone: string,
    submittedCountryCode: CountryCode,
    newResendAvailableAt: number,
  ) => {
    try {
      setPhone(submittedPhone);
      setCountryCode(submittedCountryCode);
      setResendAvailableAt(newResendAvailableAt);
      setPhoneConfirmationState('sms-code');

      await saveDraft({
        step: 'phone-confirmation',
        phoneConfirmationState: 'sms-code',
        phone: submittedPhone,
        countryCode: submittedCountryCode,
        resendAvailableAt: newResendAvailableAt,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.warn('[RegistrationForm] Failed to save draft after phone submit', error);
    }
  };

  const handleSmsVerified = async () => {
    try {
      setIsPhoneConfirmed(true);
      // For now, just update the draft to indicate phone is confirmed
      // In the future, this would transition to user-info step
      await saveDraft({
        step: 'phone-confirmation',
        phoneConfirmationState: 'sms-code',
        phone,
        countryCode,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.warn('[RegistrationForm] Failed to save draft after SMS verification', error);
    }
  };

  const handleBackToPhoneInput = async () => {
    try {
      setPhoneConfirmationState('phone-input');
      setResendAvailableAt(undefined);

      await saveDraft({
        step: 'phone-confirmation',
        phoneConfirmationState: 'phone-input',
        phone,
        countryCode,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.warn('[RegistrationForm] Failed to save draft when going back to phone input', error);
    }
  };

  const handleBack = async () => {
    if (phoneConfirmationState === 'sms-code') {
      handleBackToPhoneInput();
    } else {
      // Navigate back to login
      onBack();
    }
  };

  const handleClose = async () => {
    try {
      await clearDraft();
      onClose();
    } catch (error) {
      console.warn('[RegistrationForm] Failed to clear draft on close', error);
      onClose();
    }
  };

  if (isPhoneConfirmed) {
    return (
      <View style={styles.container}>
        <RegistrationHeader onBack={handleBack} onClose={handleClose} />
        <StepProgress currentStep={1} totalSteps={3} />
        <View style={styles.content}>
          <Text style={styles.placeholderText}>
            {t('registration.phoneConfirmedPlaceholder')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RegistrationHeader onBack={handleBack} onClose={handleClose} />
      <StepProgress currentStep={1} totalSteps={3} />
      <View style={styles.content}>
        {currentStep === 'phone-confirmation' ? (
          <PhoneConfirmStep
            initialPhone={phone}
            initialCountryCode={countryCode}
            initialState={phoneConfirmationState}
            initialResendAvailableAt={resendAvailableAt}
            onPhoneSubmit={handlePhoneSubmit}
            onSmsVerified={handleSmsVerified}
            onBackToPhoneInput={handleBackToPhoneInput}
          />
        ) : null}
      </View>
    </View>
  );
};
