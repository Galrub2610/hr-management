import { useCallback } from 'react';
import { showSuccessToast, showErrorToast, showInfoToast, showWarningToast } from '../utils/toast';

export const useToast = () => {
  const success = useCallback((message: string) => {
    showSuccessToast(message);
  }, []);

  const error = useCallback((message: string) => {
    showErrorToast(message);
  }, []);

  const info = useCallback((message: string) => {
    showInfoToast(message);
  }, []);

  const warning = useCallback((message: string) => {
    showWarningToast(message);
  }, []);

  return {
    success,
    error,
    info,
    warning
  };
}; 