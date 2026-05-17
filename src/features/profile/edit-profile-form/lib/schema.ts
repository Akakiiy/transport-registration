import { z } from 'zod';
import { isValidIin } from '@shared/lib/iin';

export const createEditProfileFormSchema = (isCarrier: boolean) =>
  z
    .object({
      companyName: z.string().min(1, 'errors.required'),
      firstName: z.string().min(1, 'errors.required'),
      lastName: z.string().min(1, 'errors.required'),
      email: z.string().min(1, 'errors.required').email('errors.invalidEmail'),
      birthDate: z.string().min(1, 'errors.required'),
      citizenship: z.string().min(1, 'errors.required'),
      iin: z.string().min(1, 'errors.required').length(12, 'errors.invalidIin'),
      documentNumber: z.string().min(1, 'errors.required'),
      documentIssueDate: z.string().min(1, 'errors.required'),
      documentIssuer: z.string().min(1, 'errors.required'),
      driverLicenseNumber: z.string(),
      driverLicenseCategory: z.string(),
      driverLicenseIssueDate: z.string(),
    })
    .refine(
      data => {
        if (!data.iin || data.iin.length !== 12) {
          return true;
        }
        return isValidIin(data.iin);
      },
      {
        message: 'errors.invalidIin',
        path: ['iin'],
      },
    )
    .superRefine((data, ctx) => {
      if (data.birthDate) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data.birthDate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'errors.invalidBirthDate',
            path: ['birthDate'],
          });
        } else {
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
          } else {
            const now = new Date();
            if (birthDateObj > now) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'errors.invalidBirthDate',
                path: ['birthDate'],
              });
            } else {
              const age = now.getFullYear() - birthDateObj.getFullYear();
              const monthDiff = now.getMonth() - birthDateObj.getMonth();
              const dayDiff = now.getDate() - birthDateObj.getDate();
              const actualAge =
                monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)
                  ? age - 1
                  : age;

              if (actualAge < 18 || actualAge >= 65) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'errors.ageRestriction',
                  path: ['birthDate'],
                });
              }
            }
          }
        }
      }

      if (!isCarrier) {
        return;
      }

      if (!data.driverLicenseNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'errors.required',
          path: ['driverLicenseNumber'],
        });
      }

      if (!data.driverLicenseCategory) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'errors.required',
          path: ['driverLicenseCategory'],
        });
      }

      if (!data.driverLicenseIssueDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'errors.required',
          path: ['driverLicenseIssueDate'],
        });
      }
    });
