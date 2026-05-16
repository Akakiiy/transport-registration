import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ROUTES } from '@app/navigation/routes';
import { RootStackParamList } from '@app/navigation/types';
import { RegistrationForm } from '@features/auth/registration-form';
import { styles } from './styles';

type RegistrationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Registration'
>;

export const RegistrationScreen = ({ navigation }: RegistrationScreenProps) => {
  const handleBack = () => {
    navigation.goBack();
  };

  const handleClose = () => {
    navigation.navigate(ROUTES.Login);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <RegistrationForm onBack={handleBack} onClose={handleClose} />
    </SafeAreaView>
  );
};
