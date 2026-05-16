import type { CountryCode } from 'libphonenumber-js';

export type PhoneFormValues = {
  phone: string;
  countryCode: CountryCode;
};

export type SmsCodeFormValues = {
  code: string;
};
