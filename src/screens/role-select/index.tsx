import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { ROUTES } from '../../app/navigation/routes';
import { RootStackParamList } from '../../app/navigation/types';
import { AppButton } from '../../shared/ui/app-button';
import { ScreenLayout } from '../../shared/ui/screen-layout';
import { styles } from './styles';

type RoleSelectScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RoleSelect'
>;

export const RoleSelectScreen = ({ navigation }: RoleSelectScreenProps) => {
  return (
    <ScreenLayout title="Role Select">
      <View style={styles.content}>
        <AppButton
          title="Go to SMS Confirm"
          onPress={() => navigation.navigate(ROUTES.SmsConfirm)}
        />
      </View>
    </ScreenLayout>
  );
};
