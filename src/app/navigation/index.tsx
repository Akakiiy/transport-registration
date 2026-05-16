import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '@screens/login';
import { ProfileScreen } from '@screens/profile';
import { RegistrationScreen } from '@screens/registration';
import { ROUTES } from './routes';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={ROUTES.Login}
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name={ROUTES.Login} component={LoginScreen} />
        <Stack.Screen
          name={ROUTES.Registration}
          component={RegistrationScreen}
        />
        <Stack.Screen name={ROUTES.Profile} component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
