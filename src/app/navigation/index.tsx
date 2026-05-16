import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '@screens/login';
import { ProfileScreen } from '@screens/profile';
import { RegistrationScreen } from '@screens/registration';
import { getDraft, getProfile } from '@shared/lib/storage';
import { ROUTES } from './routes';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const [initialRouteName, setInitialRouteName] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    const determineInitialRoute = async () => {
      try {
        // Check if user has a profile (logged in)
        const profile = await getProfile();
        if (profile) {
          setInitialRouteName(ROUTES.Profile);
          return;
        }

        // Check if there's an unfinished registration draft
        const draft = await getDraft();
        if (draft && draft.step === 'phone-confirmation') {
          setInitialRouteName(ROUTES.Registration);
          return;
        }

        // Default to login
        setInitialRouteName(ROUTES.Login);
      } catch (error) {
        console.warn('[AppNavigator] Failed to determine initial route', error);
        setInitialRouteName(ROUTES.Login);
      }
    };

    determineInitialRoute();
  }, []);

  if (!initialRouteName) {
    // Wait for initial route to be determined
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
        <Stack.Screen name={ROUTES.Profile} component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
