import { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { clearDraft, getDraft, saveDraft } from '@shared/lib/storage';
import { DEFAULT_COUNTRY_CODE } from '@shared/config';
import type { RegistrationFormStep, RegistrationFormValues } from './types';

type UseRegistrationDraftParams = {
  methods: UseFormReturn<RegistrationFormValues>;
  formStep: RegistrationFormStep;
  setFormStep: (step: RegistrationFormStep) => void;
};

type UseRegistrationDraftReturn = {
  isRestoring: boolean;
  restoredResendAvailableAt?: number;
  saveRegistrationDraft: (params?: {
    resendAvailableAt?: number;
    step?: RegistrationFormStep;
  }) => Promise<void>;
  clearRegistrationDraft: () => Promise<void>;
};

const stepMap: Record<string, RegistrationFormStep> = {
  'phone-confirmation': 0,
  'user-info': 1,
  password: 2,
};

const stepNameMap: Record<
  RegistrationFormStep,
  'phone-confirmation' | 'user-info' | 'password'
> = {
  0: 'phone-confirmation',
  1: 'user-info',
  2: 'password',
};

export const useRegistrationDraft = ({
  methods,
  formStep,
  setFormStep,
}: UseRegistrationDraftParams): UseRegistrationDraftReturn => {
  const [isRestoring, setIsRestoring] = useState(true);
  const [restoredResendAvailableAt, setRestoredResendAvailableAt] = useState<
    number | undefined
  >();

  // Restore draft on mount
  useEffect(() => {
    const restore = async () => {
      try {
        const draft = await getDraft();
        if (draft) {
          // Restore form values
          methods.reset({
            phone: draft.phone || '',
            countryCode: draft.countryCode || DEFAULT_COUNTRY_CODE,
          });

          // Restore formStep from either formStep or step field
          const restoredStep =
            typeof draft.formStep === 'number'
              ? draft.formStep
              : draft.step
              ? stepMap[draft.step] ?? 0
              : 0;
          setFormStep(restoredStep as RegistrationFormStep);

          // Restore resendAvailableAt
          if (draft.resendAvailableAt) {
            setRestoredResendAvailableAt(draft.resendAvailableAt);
          }
        }
      } catch (error: unknown) {
        console.warn('[useRegistrationDraft] Failed to restore draft', error);
      } finally {
        setIsRestoring(false);
      }
    };

    restore();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveRegistrationDraft = async (params?: {
    resendAvailableAt?: number;
    step?: RegistrationFormStep;
  }) => {
    try {
      const values = methods.getValues();
      const currentStep = params?.step ?? formStep;
      const stepName = stepNameMap[currentStep];

      await saveDraft({
        step: stepName as 'phone-confirmation' | 'user-info' | 'password',
        formStep: currentStep,
        phone: values.phone,
        countryCode: values.countryCode,
        resendAvailableAt: params?.resendAvailableAt,
        updatedAt: Date.now(),
      });
    } catch (error: unknown) {
      console.warn('[useRegistrationDraft] Failed to save draft', error);
      throw error;
    }
  };

  const clearRegistrationDraft = async () => {
    try {
      await clearDraft();
    } catch (error: unknown) {
      console.warn('[useRegistrationDraft] Failed to clear draft', error);
      throw error;
    }
  };

  return {
    isRestoring,
    restoredResendAvailableAt,
    saveRegistrationDraft,
    clearRegistrationDraft,
  };
};
