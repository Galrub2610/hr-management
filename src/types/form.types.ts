export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    message: string;
  };
}

export interface FormStep {
  title: string;
  fields: FormField[];
}

export interface FormConfig {
  steps: FormStep[];
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  initialData?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  currentStep: number;
  data: { [key: string]: any };
  errors: { [key: string]: string };
  isSubmitting: boolean;
  isValid: boolean;
} 