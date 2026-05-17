import type { UserProfile } from '@shared/types';

export type EditProfileFormValues = {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type EditProfileFormProps = {
  profile: UserProfile;
  onSaved: (profile: UserProfile) => void;
  onCancel: () => void;
};
