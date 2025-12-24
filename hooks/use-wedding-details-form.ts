'use client';

import { useState, useCallback } from 'react';
import { WeddingDetailsFormData } from '@/lib/types/wedding-details';
import { getEmptyWeddingDetails } from '@/lib/utils/wedding-details.utils';

export function useWeddingDetailsForm(initialData?: Partial<WeddingDetailsFormData>) {
  const [formData, setFormData] = useState<WeddingDetailsFormData>(() => ({
    ...getEmptyWeddingDetails(),
    ...initialData,
  }));

  const updateField = useCallback(<K extends keyof WeddingDetailsFormData>(
    field: K,
    value: WeddingDetailsFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateNestedField = useCallback((
    field: keyof WeddingDetailsFormData,
    nestedField: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] as any),
        [nestedField]: value,
      },
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(getEmptyWeddingDetails());
  }, []);

  return {
    formData,
    updateField,
    updateNestedField,
    resetForm,
    setFormData,
  };
}
