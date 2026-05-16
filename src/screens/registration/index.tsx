import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { ROUTES } from '../../app/navigation/routes';
import { RootStackParamList } from '../../app/navigation/types';
import { AppButton } from '../../shared/ui/app-button';
import { ScreenLayout } from '../../shared/ui/screen-layout';
import { styles } from './styles';

type RegistrationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Registration'
>;

export const RegistrationScreen = ({ navigation }: RegistrationScreenProps) => {
  return (
    <ScreenLayout title="Registration">
      <View style={styles.content}>
        <AppButton
          title="Go to Profile"
          onPress={() => navigation.navigate(ROUTES.Profile)}
        />
      </View>
    </ScreenLayout>
  );
};
