import { useEffect, useState } from 'react';
import { getDraft, getProfile } from '@shared/lib/storage';
import type { RegistrationDraft } from '@shared/types';
import { ROUTES } from '../navigation/routes';
import type { RootStackParamList } from '../navigation/types';

const REGISTRATION_STEPS = [
  'phone-confirmation',
  'user-info',
  'password',
] as const;

const isValidRegistrationDraft = (
  draft: RegistrationDraft | null,
): draft is RegistrationDraft => {
  if (!draft) {
    return false;
  }

  // Check by formStep (numeric, preferred for reliability)
  if (
    typeof draft.formStep === 'number' &&
    draft.formStep >= 0 &&
    draft.formStep <= 2
  ) {
    return true;
  }

  // Check by step string (backward compatibility)
  return REGISTRATION_STEPS.includes(draft.step);
};

type UseAppBootstrapReturn = {
  isBootstrapping: boolean;
  initialRouteName: keyof RootStackParamList | null;
};

export const useAppBootstrap = (): UseAppBootstrapReturn => {
  const [initialRouteName, setInitialRouteName] =
    useState<keyof RootStackParamList | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Check if user has a profile (logged in)
        const profile = await getProfile();
        if (profile) {
          setInitialRouteName(ROUTES.AuthPin);
          return;
        }

        // Check if there's a valid registration draft
        const draft = await getDraft();
        if (isValidRegistrationDraft(draft)) {
          setInitialRouteName(ROUTES.Registration);
          return;
        }

        // Default to login
        setInitialRouteName(ROUTES.Login);
      } catch (error: unknown) {
        console.warn('[useAppBootstrap] Failed to bootstrap app', error);
        setInitialRouteName(ROUTES.Login);
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, []);

  return { isBootstrapping, initialRouteName };
};
