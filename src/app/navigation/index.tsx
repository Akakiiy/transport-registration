import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '@screens/login';
import { AuthPinScreen } from '@screens/auth-pin';
import { ProfileScreen } from '@screens/profile';
import { RegistrationScreen } from '@screens/registration';
import { useAppBootstrap } from '../lib/use-app-bootstrap';
import { ROUTES } from './routes';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { isBootstrapping, initialRouteName } = useAppBootstrap();

  if (isBootstrapping || !initialRouteName) {
    // Wait for bootstrap to complete
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name={ROUTES.Login} component={LoginScreen} />
        <Stack.Screen
          name={ROUTES.Registration}
          component={RegistrationScreen}
        />
        <Stack.Screen name={ROUTES.AuthPin} component={AuthPinScreen} />
        <Stack.Screen name={ROUTES.Profile} component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
