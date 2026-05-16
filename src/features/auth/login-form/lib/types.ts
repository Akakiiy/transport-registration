import type { z } from 'zod';
import { loginFormSchema } from './schema';

export type LoginFormValues = z.infer<typeof loginFormSchema>;
