import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { ROUTES } from '../../app/navigation/routes';
import { RootStackParamList } from '../../app/navigation/types';
import { AppButton } from '../../shared/ui/app-button';
import { ScreenLayout } from '../../shared/ui/screen-layout';
import { styles } from './styles';

type PhoneInputScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PhoneInput'
>;

export const PhoneInputScreen = ({ navigation }: PhoneInputScreenProps) => {
  return (
    <ScreenLayout title="Phone Input">
      <View style={styles.content}>
        <AppButton
          title="Go to Role Select"
          onPress={() => navigation.navigate(ROUTES.RoleSelect)}
        />
      </View>
    </ScreenLayout>
  );
};
