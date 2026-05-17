import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import type { RegistrationFormStep } from '../../lib/types';
import { PhoneStage } from './components/phone-stage';
import { SmsStage } from './components/sms-stage';
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

export const PhoneConfirmStep = ({
  initialResendAvailableAt,
  onNext,
  saveRegistrationDraft,
  registerBackHandler,
}: PhoneConfirmStepProps) => {
  const [isCodeStage, setIsCodeStage] = useState(
    Boolean(initialResendAvailableAt),
  );
  const [resendAvailableAt, setResendAvailableAt] = useState<
    number | undefined
  >(initialResendAvailableAt);

  const handleBackToPhoneStage = useCallback(async () => {
    setIsCodeStage(false);
    setResendAvailableAt(undefined);
    registerBackHandler?.(null);

    await saveRegistrationDraft({
      resendAvailableAt: undefined,
      step: 0,
    });
  }, [registerBackHandler, saveRegistrationDraft]);

  const handleCodeSent = useCallback(
    (nextResendAvailableAt: number) => {
      setResendAvailableAt(nextResendAvailableAt);
      setIsCodeStage(true);
      registerBackHandler?.(handleBackToPhoneStage);
    },
    [handleBackToPhoneStage, registerBackHandler],
  );

  const handleResendCodeSent = useCallback((nextResendAvailableAt: number) => {
    setResendAvailableAt(nextResendAvailableAt);
  }, []);

  // Register back handler only for restored SMS stage
  useEffect(() => {
    if (isCodeStage && Boolean(initialResendAvailableAt)) {
      registerBackHandler?.(handleBackToPhoneStage);
    }

    return () => {
      registerBackHandler?.(null);
    };
  }, [
    isCodeStage,
    initialResendAvailableAt,
    registerBackHandler,
    handleBackToPhoneStage,
  ]);

  const stageContent = isCodeStage ? (
    <SmsStage
      resendAvailableAt={resendAvailableAt}
      onResendCodeSent={handleResendCodeSent}
      onNext={onNext}
      saveRegistrationDraft={saveRegistrationDraft}
    />
  ) : (
    <PhoneStage
      onCodeSent={handleCodeSent}
      saveRegistrationDraft={saveRegistrationDraft}
    />
  );

  return <View style={styles.container}>{stageContent}</View>;
};
