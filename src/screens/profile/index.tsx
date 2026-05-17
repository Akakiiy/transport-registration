import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app/navigation/types';
import { ROUTES } from '@app/navigation/routes';
import { EditProfileForm } from '@features/profile/edit-profile-form';
import { ScreenLayout } from '@shared/ui';
import { clearAllRegistrationData, getProfile } from '@shared/lib/storage';
import type { UserProfile } from '@shared/types';
import { ProfileView } from './ui/profile-view';
import { styles } from './styles';

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;
type ProfileMode = 'view' | 'edit';

export const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<ProfileMode>('view');

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const loadedProfile = await getProfile();
        if (isMounted) {
          setProfile(loadedProfile);
        }
      } catch (error: unknown) {
        console.warn('[ProfileScreen] Failed to load profile', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile().catch((error: unknown) => {
      console.warn('[ProfileScreen] Failed to run profile loader', error);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEdit = useCallback(() => {
    setMode('edit');
  }, []);

  const handleCancel = useCallback(() => {
    setMode('view');
  }, []);

  const handleSaved = useCallback((updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setMode('view');
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await clearAllRegistrationData();
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.Login }],
      });
    } catch (error: unknown) {
      console.warn('[ProfileScreen] Failed to logout', error);
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.Login }],
      });
    }
  }, [navigation]);

  if (isLoading) {
    return (
      <ScreenLayout title={t('profile.title')}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('profile.loading')}</Text>
        </View>
      </ScreenLayout>
    );
  }

  if (!profile) {
    return (
      <ScreenLayout title={t('profile.title')}>
        <View style={styles.content}>
          <Text style={styles.noDataText}>{t('profile.noData')}</Text>
        </View>
      </ScreenLayout>
    );
  }

  if (mode === 'edit') {
    return (
      <ScreenLayout title={t('profile.title')}>
        <EditProfileForm
          profile={profile}
          onSaved={handleSaved}
          onCancel={handleCancel}
        />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title={t('profile.title')}>
      <ProfileView
        profile={profile}
        onEdit={handleEdit}
        onLogout={handleLogout}
      />
    </ScreenLayout>
  );
};
