import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PhoneInputScreen } from '../../screens/phone-input';
import { ProfileScreen } from '../../screens/profile';
import { RegistrationScreen } from '../../screens/registration';
import { RoleSelectScreen } from '../../screens/role-select';
import { SmsConfirmScreen } from '../../screens/sms-confirm';
import { ScreenLayout } from '../../shared/ui/screen-layout';
import { getDraft, getProfile } from '../../shared/lib/storage';
import { ROUTES } from './routes';
import { RootStackParamList } from './types';

type AppNavigatorProps = {};

const Stack = createNativeStackNavigator<RootStackParamList>();
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export const AppNavigator = ({}: AppNavigatorProps) => {
  const { t } = useTranslation();
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [initialRouteName, setInitialRouteName] =
    useState<keyof RootStackParamList>(ROUTES.PhoneInput);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const profile = await getProfile();
      const draft = await getDraft();

      if (!isMounted) {
        return;
      }

      if (profile) {
        setInitialRouteName(ROUTES.Profile);
      } else if (draft) {
        setInitialRouteName(ROUTES.Registration);
      } else {
        setInitialRouteName(ROUTES.PhoneInput);
      }

      setIsBootstrapping(false);
    };

    bootstrap().catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  if (isBootstrapping) {
    return (
      <ScreenLayout title={t('common.loading')}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
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
