import type { CountryCode } from 'libphonenumber-js';
import type { CountryOption } from '@shared/types';

export const COUNTRIES: CountryOption[] = [
  { code: 'KZ', name: 'Kazakhstan', callingCode: '+7', flag: '🇰🇿' },
  { code: 'RU', name: 'Russia', callingCode: '+7', flag: '🇷🇺' },
  { code: 'BY', name: 'Belarus', callingCode: '+375', flag: '🇧🇾' },
  { code: 'GE', name: 'Georgia', callingCode: '+995', flag: '🇬🇪' },
  { code: 'AM', name: 'Armenia', callingCode: '+374', flag: '🇦🇲' },
  { code: 'PL', name: 'Poland', callingCode: '+48', flag: '🇵🇱' },
  { code: 'CY', name: 'Cyprus', callingCode: '+357', flag: '🇨🇾' },
  { code: 'DE', name: 'Germany', callingCode: '+49', flag: '🇩🇪' },
  { code: 'US', name: 'United States', callingCode: '+1', flag: '🇺🇸' },
  { code: 'TR', name: 'Turkey', callingCode: '+90', flag: '🇹🇷' },
];

export const DEFAULT_COUNTRY_CODE: CountryCode = 'KZ';

const FALLBACK_COUNTRY: CountryOption = {
  code: 'KZ',
  name: 'Kazakhstan',
  callingCode: '+7',
  flag: '🇰🇿',
};

export const getCountryByCode = (countryCode: CountryCode): CountryOption => {
  const defaultCountry = COUNTRIES.find(
    country => country.code === DEFAULT_COUNTRY_CODE,
  );

  return (
    COUNTRIES.find(country => country.code === countryCode) ??
    defaultCountry ??
    FALLBACK_COUNTRY
  );
};
