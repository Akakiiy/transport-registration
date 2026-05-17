import { z } from 'zod';
import { registrationFormSchema } from './schema';

export type { RegistrationFormStep } from '@shared/types';

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
