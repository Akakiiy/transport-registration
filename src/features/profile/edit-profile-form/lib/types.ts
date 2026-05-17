import type { UserProfile } from '@shared/types';

export type EditProfileFormValues = {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  citizenship: string;
  iin: string;
  documentNumber: string;
  documentIssueDate: string;
  documentIssuer: string;
  driverLicenseNumber: string;
  driverLicenseCategory: string;
  driverLicenseIssueDate: string;
};

export type EditProfileFormProps = {
  profile: UserProfile;
  onSaved: (profile: UserProfile) => void;
  onCancel: () => void;
};
