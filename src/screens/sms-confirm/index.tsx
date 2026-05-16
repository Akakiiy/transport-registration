import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { ROUTES } from '../../app/navigation/routes';
import { RootStackParamList } from '../../app/navigation/types';
import { AppButton } from '../../shared/ui/app-button';
import { ScreenLayout } from '../../shared/ui/screen-layout';
import { styles } from './styles';

type SmsConfirmScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SmsConfirm'
>;

export const SmsConfirmScreen = ({ navigation }: SmsConfirmScreenProps) => {
  return (
    <ScreenLayout title="SMS Confirm">
      <View style={styles.content}>
        <AppButton
          title="Go to Registration"
          onPress={() => navigation.navigate(ROUTES.Registration)}
        />
      </View>
    </ScreenLayout>
  );
};
