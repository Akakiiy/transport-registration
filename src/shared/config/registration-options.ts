export type OptionConfig = {
  value: string;
  labelKey: string;
};

export const CITIZENSHIP_OPTIONS: OptionConfig[] = [
  { value: 'Kazakhstan', labelKey: 'registration.citizenshipKazakhstan' },
  { value: 'Russia', labelKey: 'registration.citizenshipRussia' },
  { value: 'Belarus', labelKey: 'registration.citizenshipBelarus' },
  { value: 'Uzbekistan', labelKey: 'registration.citizenshipUzbekistan' },
  { value: 'Kyrgyzstan', labelKey: 'registration.citizenshipKyrgyzstan' },
  { value: 'Other', labelKey: 'registration.citizenshipOther' },
];

export const DRIVER_LICENSE_CATEGORY_OPTIONS: string[] = [
  'A',
  'B',
  'C',
  'D',
  'BE',
  'CE',
  'DE',
];
