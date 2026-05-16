import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@shared/config';
import { SupportedLanguage } from '@shared/config/i18n';
import { RegistrationDraft, UserProfile } from '@shared/types';

const parseJson = <T>(value: string | null): T | null => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn('[storage] Failed to parse JSON value', error);
    return null;
  }
};

export const getDraft = async (): Promise<RegistrationDraft | null> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.registrationDraft);
    return parseJson<RegistrationDraft>(value);
  } catch (error) {
    console.warn('[storage] Failed to read draft', error);
    return null;
  }
};

export const saveDraft = async (draft: RegistrationDraft): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.registrationDraft,
      JSON.stringify(draft),
    );
  } catch (error) {
    console.warn('[storage] Failed to save draft', error);
    throw error;
  }
};

export const clearDraft = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.registrationDraft);
  } catch (error) {
    console.warn('[storage] Failed to clear draft', error);
    throw error;
  }
};

export const getProfile = async (): Promise<UserProfile | null> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.userProfile);
    return parseJson<UserProfile>(value);
  } catch (error) {
    console.warn('[storage] Failed to read profile', error);
    return null;
  }
};

export const saveProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(profile));
  } catch (error) {
    console.warn('[storage] Failed to save profile', error);
    throw error;
  }
};

export const clearProfile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.userProfile);
  } catch (error) {
    console.warn('[storage] Failed to clear profile', error);
    throw error;
  }
};

export const getSelectedLanguage = async (): Promise<SupportedLanguage | null> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.selectedLanguage);

    if (value === 'ru' || value === 'en') {
      return value;
    }

    return null;
  } catch (error) {
    console.warn('[storage] Failed to read selected language', error);
    return null;
  }
};

export const saveSelectedLanguage = async (
  language: SupportedLanguage,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.selectedLanguage, language);
  } catch (error) {
    console.warn('[storage] Failed to save selected language', error);
    throw error;
  }
};

export const clearAllRegistrationData = async (): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.registrationDraft),
      AsyncStorage.removeItem(STORAGE_KEYS.userProfile),
    ]);
  } catch (error) {
    console.warn('[storage] Failed to clear registration data', error);
    throw error;
  }
};
