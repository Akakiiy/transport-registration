import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { z } from 'zod';
import { getCountryByCode } from './countries';

export const loginFormSchema = z
  .object({
    phone: z.string().trim().min(1, 'errors.required'),
    countryCode: z.string().trim().min(1, 'errors.required'),
    password: z.string().min(4, 'errors.passwordMin'),
    isPolicyAccepted: z.boolean().refine((value) => value, {
      message: 'errors.policyRequired',
    }),
  })
  .superRefine((values, context) => {
    const country = getCountryByCode(values.countryCode);
    const parsedPhone = parsePhoneNumberFromString(values.phone, country.code);

    if (!parsedPhone || !parsedPhone.isValid()) {
      context.addIssue({
        code: 'custom',
        message: 'errors.invalidPhone',
        path: ['phone'],
      });
    }
  });
