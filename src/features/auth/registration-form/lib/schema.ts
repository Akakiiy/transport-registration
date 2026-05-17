import { z } from 'zod';
import { parsePhoneNumber, type CountryCode } from 'libphonenumber-js';
import { COUNTRIES } from '@shared/config';
import { isValidIin } from '@shared/lib/iin';
import { SMS_CODE_LENGTH } from './constants';

const countryCodeEnum = z.enum(
  COUNTRIES.map(c => c.code) as [CountryCode, ...CountryCode[]],
);

export const registrationFormSchema = z.object({
  // Step 0 fields
  phone: z.string().min(1, 'errors.required'),
  countryCode: countryCodeEnum,
  
  // Step 1 fields
  role: z.enum(['customer', 'carrier']).optional(),
  
  // Step 2 fields (optional in main schema to not break earlier steps)
  companyName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  birthDate: z.string().optional(),
  citizenship: z.string().optional(),
  iin: z.string().optional(),
  documentNumber: z.string().optional(),
  documentIssueDate: z.string().optional(),
  documentIssuer: z.string().optional(),
  driverLicenseNumber: z.string().optional(),
  driverLicenseCategory: z.string().optional(),
  driverLicenseIssueDate: z.string().optional(),
  
  // Step 3 field
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

// Step 1: Role selection
export const roleSelectStepSchema = z.object({
  role: z.enum(['customer', 'carrier'], 'errors.roleRequired'),
});

// Step 2: Registration details
export const registrationDetailsStepSchema = z.object({
  companyName: z.string().min(1, 'errors.required'),
  firstName: z.string().min(1, 'errors.required'),
  lastName: z.string().min(1, 'errors.required'),
  email: z.string().min(1, 'errors.required').email('errors.invalidEmail'),
  birthDate: z.string().min(1, 'errors.required'),
  citizenship: z.string().min(1, 'errors.required'),
  phone: z.string().min(1, 'errors.required'),
  iin: z.string().min(1, 'errors.required').length(12, 'errors.invalidIin'),
  documentNumber: z.string().min(1, 'errors.required'),
  documentIssueDate: z.string().min(1, 'errors.required'),
  documentIssuer: z.string().min(1, 'errors.required'),
  driverLicenseNumber: z.string().optional(),
  driverLicenseCategory: z.string().optional(),
  driverLicenseIssueDate: z.string().optional(),
  role: z.enum(['customer', 'carrier']).optional(),
}).refine(
  (data) => {
    if (!data.iin || data.iin.length !== 12) {
      return true; // Let basic validation handle this
    }
    return isValidIin(data.iin);
  },
  {
    message: 'errors.invalidIin',
    path: ['iin'],
  },
).superRefine((data, ctx) => {
  if (!data.birthDate) {
    return;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.birthDate)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'errors.invalidBirthDate',
      path: ['birthDate'],
    });
    return;
  }

  const [yearString, monthString, dayString] = data.birthDate.split('-');
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  const birthDateObj = new Date(year, month - 1, day);

  const isInvalidDate =
    birthDateObj.getFullYear() !== year ||
    birthDateObj.getMonth() !== month - 1 ||
    birthDateObj.getDate() !== day;

  if (isInvalidDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'errors.invalidBirthDate',
      path: ['birthDate'],
    });
    return;
  }

  const now = new Date();
  if (birthDateObj > now) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'errors.invalidBirthDate',
      path: ['birthDate'],
    });
    return;
  }

  const age = now.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = now.getMonth() - birthDateObj.getMonth();
  const dayDiff = now.getDate() - birthDateObj.getDate();
  const actualAge =
    monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

  if (actualAge < 18 || actualAge >= 65) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'errors.ageRestriction',
      path: ['birthDate'],
    });
  }
}).refine(
  (data) => {
    if (data.role === 'carrier') {
      return !!data.driverLicenseNumber && !!data.driverLicenseCategory && !!data.driverLicenseIssueDate;
    }
    return true;
  },
  {
    message: 'errors.required',
    path: ['driverLicenseNumber'],
  },
);

export const smsCodeSchema = z
  .string()
  .min(1, 'errors.required')
  .regex(/^\d+$/, 'errors.invalidSmsCode')
  .length(SMS_CODE_LENGTH, 'errors.invalidSmsCode');
