const IIN_LENGTH = 12;

const FIRST_WEIGHTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const SECOND_WEIGHTS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2];

export const normalizeIin = (value: string): string => {
  return value.replace(/\D/g, '');
};

const getWeightedChecksum = (digits: number[], weights: number[]): number => {
  const sum = digits.reduce((acc, digit, index) => acc + digit * weights[index], 0);
  return sum % 11;
};

export const isValidIin = (value: string): boolean => {
  const normalized = normalizeIin(value);

  if (!/^\d{12}$/.test(normalized)) {
    return false;
  }

  const digits = normalized.split('').map(Number);
  const payload = digits.slice(0, IIN_LENGTH - 1);
  const controlDigit = digits[IIN_LENGTH - 1];

  const firstResult = getWeightedChecksum(payload, FIRST_WEIGHTS);

  if (firstResult !== 10) {
    return firstResult === controlDigit;
  }

  const secondResult = getWeightedChecksum(payload, SECOND_WEIGHTS);

  if (secondResult === 10) {
    return false;
  }

  return secondResult === controlDigit;
};
