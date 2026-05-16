import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../config/storage-keys';
import { SupportedLanguage } from '../../config/i18n';
import { RegistrationDraft, UserProfile } from '../../types/registration';

const parseJson = <T>(value: string | null): T | null => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const setJson = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Intentionally ignore to avoid app crash on storage failures.
  }
};

export const getDraft = async (): Promise<RegistrationDraft | null> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.registrationDraft);
    return parseJson<RegistrationDraft>(value);
  } catch {
    return null;
  }
};

export const saveDraft = async (draft: RegistrationDraft): Promise<void> => {
  await setJson(STORAGE_KEYS.registrationDraft, draft);
};

export const clearDraft = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.registrationDraft);
  } catch {
    // Intentionally ignore to avoid app crash on storage failures.
  }
};

export const getProfile = async (): Promise<UserProfile | null> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.userProfile);
    return parseJson<UserProfile>(value);
  } catch {
    return null;
  }
};

export const saveProfile = async (profile: UserProfile): Promise<void> => {
  await setJson(STORAGE_KEYS.userProfile, profile);
};

export const clearProfile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.userProfile);
  } catch {
    // Intentionally ignore to avoid app crash on storage failures.
  }
};

export const getSelectedLanguage = async (): Promise<SupportedLanguage | null> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.selectedLanguage);

    if (value === 'ru' || value === 'en') {
      return value;
    }

    return null;
  } catch {
    return null;
  }
};

export const saveSelectedLanguage = async (
  language: SupportedLanguage,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.selectedLanguage, language);
  } catch {
    // Intentionally ignore to avoid app crash on storage failures.
  }
};

export const clearAllRegistrationData = async (): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.registrationDraft),
      AsyncStorage.removeItem(STORAGE_KEYS.userProfile),
    ]);
  } catch {
    // Intentionally ignore to avoid app crash on storage failures.
  }
};
