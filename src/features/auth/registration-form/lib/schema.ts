import { z } from 'zod';
import { parsePhoneNumber, type CountryCode } from 'libphonenumber-js';
import { COUNTRIES } from '@shared/config';
import { SMS_CODE_LENGTH } from './constants';

const countryCodeEnum = z.enum(
  COUNTRIES.map(c => c.code) as [CountryCode, ...CountryCode[]],
);

export const phoneFormSchema = z.object({
  phone: z.string().min(1, 'errors.required'),
  countryCode: countryCodeEnum,
}).refine(
  (data) => {
    try {
      const country = COUNTRIES.find(c => c.code === data.countryCode);
      if (!country) {
        return false;
      }
      const fullPhone = country.callingCode + data.phone;
      const phoneNumber = parsePhoneNumber(fullPhone, { defaultCountry: data.countryCode as CountryCode });
      return phoneNumber?.isValid() ?? false;
    } catch {
      return false;
    }
  },
  {
    message: 'errors.invalidPhone',
    path: ['phone'],
  },
);

export const smsCodeFormSchema = z.object({
  code: z
    .string()
    .min(1, 'errors.required')
    .regex(/^\d+$/, 'errors.invalidSmsCode')
    .length(SMS_CODE_LENGTH, 'errors.invalidSmsCode'),
});
