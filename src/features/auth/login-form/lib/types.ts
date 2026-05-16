import type { CountryCode } from 'libphonenumber-js';

export type CountryOption = {
  code: CountryCode;
  name: string;
  callingCode: string;
  flag: string;
};

export type LoginFormValues = {
  phone: string;
  countryCode: string;
  password: string;
  isPolicyAccepted: boolean;
};
