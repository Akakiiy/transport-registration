import { UserRole } from './role';

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
  phone?: string;
  role?: UserRole;
  form?: Partial<RegistrationData>;
};

export type UserProfile = {
  phone: string;
  role: UserRole;
  data: RegistrationData;
};
