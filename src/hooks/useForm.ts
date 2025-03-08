import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message: string;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface Errors {
  [key: string]: string;
}

export const useForm = <T extends { [key: string]: any }>(
  initialState: T,
  validationRules?: ValidationRules
) => {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((name: string, value: any): string => {
    if (!validationRules || !validationRules[name]) return '';

    const rules = validationRules[name];

    if (rules.required && !value) {
      return rules.message;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return rules.message;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.message;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message;
    }

    if (rules.custom && !rules.custom(value)) {
      return rules.message;
    }

    return '';
  }, [validationRules]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    const error = validate(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [validate]);

  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<void>,
    onError?: (errors: Errors) => void
  ) => {
    setIsSubmitting(true);
    
    // בדיקת ולידציה לכל השדות
    const newErrors: Errors = {};
    Object.keys(values).forEach(key => {
      const error = validate(key, values[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      onError?.(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate]);

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setIsSubmitting(false);
  }, [initialState]);

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    const error = validate(name as string, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [validate]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setValue
  };
}; 