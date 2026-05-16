import moment from 'moment';

const MIN_ADULT_AGE = 18;
const MAX_ADULT_AGE = 65;

const toMoment = (date: string | Date) => moment(date);

export const formatDate = (date: string | Date): string => {
  const value = toMoment(date);

  if (!value.isValid()) {
    return '';
  }

  return value.format('DD.MM.YYYY');
};

export const isFutureDate = (date: string | Date): boolean => {
  const value = toMoment(date);

  if (!value.isValid()) {
    return false;
  }

  return value.isAfter(moment(), 'day');
};

export const getAge = (date: string | Date): number => {
  const value = toMoment(date);

  if (!value.isValid()) {
    return 0;
  }

  return moment().diff(value, 'years');
};

export const isValidAdultAge = (date: string | Date): boolean => {
  const age = getAge(date);

  return age >= MIN_ADULT_AGE && age < MAX_ADULT_AGE;
};
