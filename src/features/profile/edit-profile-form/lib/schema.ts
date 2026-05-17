import { z } from 'zod';

export const editProfileFormSchema = z.object({
  companyName: z.string().min(1, 'errors.required'),
  firstName: z.string().min(1, 'errors.required'),
  lastName: z.string().min(1, 'errors.required'),
  email: z.string().min(1, 'errors.required').email('errors.invalidEmail'),
});
