import { parsePhoneNumberFromString } from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';
import { z } from 'zod';
import { COUNTRIES, getCountryByCode } from './countries';

export const loginFormSchema = z
  .object({
    phone: z.string().trim().min(1, 'errors.required'),
    countryCode: z.custom<CountryCode>(
      (value) =>
        typeof value === 'string' &&
        COUNTRIES.some((country) => country.code === value),
      'errors.required',
    ),
    password: z.string().min(4, 'errors.passwordMin'),
    isPolicyAccepted: z.boolean().refine((value) => value, {
      message: 'errors.policyRequired',
    }),
  })
  .superRefine((values, context) => {
    const country = getCountryByCode(values.countryCode);
    const localDigits = values.phone.replace(/\D/g, '');
    const fullPhoneNumber = `${country.callingCode}${localDigits}`;
    const parsedPhone = parsePhoneNumberFromString(fullPhoneNumber);

    if (!parsedPhone || !parsedPhone.isValid()) {
      context.addIssue({
        code: 'custom',
        message: 'errors.invalidPhone',
        path: ['phone'],
      });
    }
  });
