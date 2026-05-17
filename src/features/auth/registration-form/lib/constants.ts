export const RESEND_TIMEOUT_MS = 60_000;

export const SMS_CODE_LENGTH = 4;

export const REGISTRATION_STEPS = {
  PHONE_CONFIRMATION: 'phone-confirmation',
  USER_INFO: 'user-info',
  PASSWORD: 'password',
} as const;
