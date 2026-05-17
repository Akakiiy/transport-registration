const DEFAULT_DELAY_MS = 1000;
const VALID_SMS_CODE = '1111';

export const wait = async (ms: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(() => resolve(undefined), Math.max(ms, 0));
  });
};

export const mockRequest = async <T>(data: T, delay = DEFAULT_DELAY_MS): Promise<T> => {
  await wait(delay);
  return data;
};

export const mockSendPhoneCode = async (_phone: string): Promise<{ success: true }> => {
  return mockRequest({ success: true }, DEFAULT_DELAY_MS);
};

export const mockVerifySmsCode = async (code: string): Promise<{ success: true }> => {
  await wait(DEFAULT_DELAY_MS);

  if (code !== VALID_SMS_CODE) {
    throw new Error('errors.invalidSmsCode');
  }

  return { success: true };
};
