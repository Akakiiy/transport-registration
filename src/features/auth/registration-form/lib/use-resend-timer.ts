import { useEffect, useState } from 'react';

type UseResendTimerResult = {
  remainingSeconds: number;
  canResend: boolean;
  formattedRemaining: string;
};

export const useResendTimer = (
  resendAvailableAt: number | undefined,
): UseResendTimerResult => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!resendAvailableAt) {
    return {
      remainingSeconds: 0,
      canResend: true,
      formattedRemaining: '00:00',
    };
  }

  const remainingMs = Math.max(0, resendAvailableAt - now);
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const canResend = remainingSeconds === 0;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedRemaining = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return {
    remainingSeconds,
    canResend,
    formattedRemaining,
  };
};
