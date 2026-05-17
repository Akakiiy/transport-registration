import { z } from 'zod';
import { parsePhoneNumber, type CountryCode } from 'libphonenumber-js';
import { COUNTRIES } from '@shared/config';
import { SMS_CODE_LENGTH } from './constants';

const countryCodeEnum = z.enum(
  COUNTRIES.map(c => c.code) as [CountryCode, ...CountryCode[]],
);

export const registrationFormSchema = z.object({
  // Step 0 fields
  phone: z.string().min(1, 'errors.required'),
  countryCode: countryCodeEnum,
  
  // Step 1 fields (optional in main schema to not break earlier steps)
  companyName: z.string().optional(),
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  email: z.string().optional(),
  
  // Step 2 field
  password: z.string().optional(),
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

// Step-level validation schemas
export const userInfoStepSchema = z.object({
  companyName: z.string().min(1, 'errors.required'),
  lastName: z.string().min(1, 'errors.required'),
  firstName: z.string().min(1, 'errors.required'),
  email: z.string().min(1, 'errors.required').email('errors.invalidEmail'),
});

export const smsCodeSchema = z
  .string()
  .min(1, 'errors.required')
  .regex(/^\d+$/, 'errors.invalidSmsCode')
  .length(SMS_CODE_LENGTH, 'errors.invalidSmsCode');
