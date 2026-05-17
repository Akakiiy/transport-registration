import type { CountryCode } from 'libphonenumber-js';

export type RootStackParamList = {
  Login: undefined;
  Registration: { phone?: string; countryCode?: CountryCode } | undefined;
  Profile: undefined;
};
