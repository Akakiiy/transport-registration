import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PhoneInputScreen } from '../../screens/phone-input';
import { ProfileScreen } from '../../screens/profile';
import { RegistrationScreen } from '../../screens/registration';
import { RoleSelectScreen } from '../../screens/role-select';
import { SmsConfirmScreen } from '../../screens/sms-confirm';
import { ROUTES } from './routes';
import { RootStackParamList } from './types';

type AppNavigatorProps = {};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = ({}: AppNavigatorProps) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={ROUTES.PhoneInput}
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name={ROUTES.PhoneInput} component={PhoneInputScreen} />
        <Stack.Screen name={ROUTES.RoleSelect} component={RoleSelectScreen} />
        <Stack.Screen name={ROUTES.SmsConfirm} component={SmsConfirmScreen} />
        <Stack.Screen
          name={ROUTES.Registration}
          component={RegistrationScreen}
        />
        <Stack.Screen name={ROUTES.Profile} component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
