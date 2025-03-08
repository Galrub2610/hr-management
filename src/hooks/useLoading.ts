import { useState, useCallback } from 'react';
import { useToast } from './useToast';

export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const toast = useToast();

  const withLoading = useCallback(async <T>(
    operation: () => Promise<T>,
    options?: {
      successMessage?: string;
      errorMessage?: string;
      showSuccessToast?: boolean;
      showErrorToast?: boolean;
    }
  ): Promise<T | undefined> => {
    try {
      setIsLoading(true);
      const result = await operation();
      
      if (options?.showSuccessToast && options.successMessage) {
        toast.success(options.successMessage);
      }
      
      return result;
    } catch (error) {
      if (options?.showErrorToast) {
        toast.error(
          options.errorMessage || 
          (error instanceof Error ? error.message : 'אירעה שגיאה')
        );
      }
      console.error('Operation failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    setIsLoading,
    withLoading
  };
}; 