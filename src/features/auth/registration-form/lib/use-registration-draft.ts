import { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { CountryCode } from 'libphonenumber-js';
import { clearDraft, getDraft, saveDraft } from '@shared/lib/storage';
import { DEFAULT_COUNTRY_CODE } from '@shared/config';
import type { RegistrationFormStep, RegistrationFormValues } from './types';

type UseRegistrationDraftParams = {
  methods: UseFormReturn<RegistrationFormValues>;
  formStep: RegistrationFormStep;
  setFormStep: (step: RegistrationFormStep) => void;
  initialPhone?: string;
  initialCountryCode?: CountryCode;
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
  'role-selection': 1,
  'user-info': 2, // Backward compatibility
  'registration-details': 2,
  password: 3,
};

const stepNameMap: Record<
  RegistrationFormStep,
  'phone-confirmation' | 'role-selection' | 'registration-details' | 'password'
> = {
  0: 'phone-confirmation',
  1: 'role-selection',
  2: 'registration-details',
  3: 'password',
};

export const useRegistrationDraft = ({
  methods,
  formStep,
  setFormStep,
  initialPhone,
  initialCountryCode,
}: UseRegistrationDraftParams): UseRegistrationDraftReturn => {
  const [isRestoring, setIsRestoring] = useState(true);
  const [restoredResendAvailableAt, setRestoredResendAvailableAt] = useState<
    number | undefined
  >();

  // Restore draft on mount
  useEffect(() => {
    const restore = async () => {
      try {
        // Priority: route params > draft > defaults
        const hasRouteParams = initialPhone !== undefined || initialCountryCode !== undefined;
        
        if (hasRouteParams) {
          // Fresh registration from Login - use route params
          methods.reset({
            phone: initialPhone || '',
            countryCode: initialCountryCode || DEFAULT_COUNTRY_CODE,
          });
          // Start at step 0, no timer restoration
          setFormStep(0);
        } else {
          // No route params - try to restore draft
          const draft = await getDraft();
          if (draft) {
            // Restore form values
            methods.reset({
              phone: draft.phone || '',
              countryCode: draft.countryCode || DEFAULT_COUNTRY_CODE,
              role: draft.role,
              companyName: draft.companyName || '',
              firstName: draft.firstName || '',
              lastName: draft.lastName || '',
              email: draft.email || '',
              birthDate: draft.birthDate || '',
              citizenship: draft.citizenship || '',
              iin: draft.iin || '',
              documentNumber: draft.documentNumber || '',
              documentIssueDate: draft.documentIssueDate || '',
              documentIssuer: draft.documentIssuer || '',
              driverLicenseNumber: draft.driverLicenseNumber || '',
              driverLicenseCategory: draft.driverLicenseCategory || '',
              driverLicenseIssueDate: draft.driverLicenseIssueDate || '',
              password: '', // Never restore password
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
          // If no draft, defaults from useForm will be used
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
        step: stepName,
        formStep: currentStep,
        phone: values.phone,
        countryCode: values.countryCode,
        role: values.role,
        companyName: values.companyName,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        birthDate: values.birthDate,
        citizenship: values.citizenship,
        iin: values.iin,
        documentNumber: values.documentNumber,
        documentIssueDate: values.documentIssueDate,
        documentIssuer: values.documentIssuer,
        driverLicenseNumber: values.driverLicenseNumber,
        driverLicenseCategory: values.driverLicenseCategory,
        driverLicenseIssueDate: values.driverLicenseIssueDate,
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
