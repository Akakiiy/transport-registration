import { useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ROUTES } from '@app/navigation/routes';
import { RootStackParamList } from '@app/navigation/types';
import { RegistrationForm } from '@features/auth/registration-form';
import type { RegistrationFormStep } from '@shared/types';
import { clearDraft } from '@shared/lib/storage';
import { RegistrationHeader } from './ui/registration-header';
import { StepProgress } from './ui/step-progress';
import { styles } from './styles';

type RegistrationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Registration'
>;

export const RegistrationScreen = ({ navigation }: RegistrationScreenProps) => {
  const [formStep, setFormStep] = useState<RegistrationFormStep>(0);
  const [formBackHandler, setFormBackHandler] = useState<(() => void) | null>(
    null,
  );

  const handleBack = () => {
    if (formStep > 0) {
      setFormStep((formStep - 1) as RegistrationFormStep);
    } else if (formBackHandler) {
      formBackHandler();
    } else {
      navigation.goBack();
    }
  };

  const handleClose = async () => {
    try {
      await clearDraft();
    } catch (error: unknown) {
      console.warn('[RegistrationScreen] Failed to clear draft on close', error);
    } finally {
      navigation.navigate(ROUTES.Login);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <RegistrationHeader onBack={handleBack} onClose={handleClose} />
        <StepProgress currentStep={formStep} />
        <View style={styles.content}>
          <RegistrationForm
            formStep={formStep}
            setFormStep={setFormStep}
            onRegisterBackHandler={setFormBackHandler}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
