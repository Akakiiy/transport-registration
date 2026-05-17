import type { CountryCode } from 'libphonenumber-js';
import { UserRole } from './role';

export type RegistrationFormStep = 0 | 1 | 2 | 3;

export type RegistrationStep = 'phone-confirmation' | 'role-selection' | 'registration-details' | 'password';

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
  companyName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
};

export type RegistrationDraft = {
  step: RegistrationStep;
  formStep?: RegistrationFormStep;
  phoneConfirmationState?: PhoneConfirmationState;
  phone?: string;
  countryCode?: CountryCode;
  resendAvailableAt?: number;
  role?: UserRole;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  citizenship?: string;
  iin?: string;
  documentNumber?: string;
  documentIssueDate?: string;
  documentIssuer?: string;
  driverLicenseNumber?: string;
  driverLicenseCategory?: string;
  driverLicenseIssueDate?: string;
  updatedAt: number;
};

export type UserProfile = {
  phone: string;
  role: UserRole;
  data: RegistrationData;
};
