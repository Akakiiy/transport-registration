import type { CountryCode } from 'libphonenumber-js';
import { UserRole } from './role';

export type RegistrationStep = 'phone-confirmation' | 'user-info' | 'password';

export type PhoneConfirmationState = 'phone-input' | 'sms-code';

export type RegistrationData = {
  fullName: string;
  birthDate: string;
  citizenship: string;
  phone: string;
  iin: string;
  documentNumber: string;
  documentIssueDate: string;
  documentIssuer: string;
  driverLicenseNumber?: string;
  driverLicenseCategory?: string;
  driverLicenseIssueDate?: string;
};

export type RegistrationDraft = {
  step: RegistrationStep;
  phoneConfirmationState?: PhoneConfirmationState;
  phone?: string;
  countryCode?: CountryCode;
  resendAvailableAt?: number;
  updatedAt: number;
  role?: UserRole;
  form?: Partial<RegistrationData>;
};

export type UserProfile = {
  phone: string;
  role: UserRole;
  data: RegistrationData;
};
