import React, { forwardRef } from 'react';
import classNames from 'classnames';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  value?: SelectOption['value'];
  fullWidth?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  label,
  error,
  helperText,
  options,
  value,
  fullWidth = false,
  placeholder,
  id,
  required,
  disabled,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const containerClasses = classNames(
    'flex flex-col',
    {
      'w-full': fullWidth,
      'opacity-60 cursor-not-allowed': disabled
    },
    className
  );

  const selectContainerClasses = classNames(
    'relative rounded-md border transition-all duration-200',
    {
      'border-gray-300 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500': !error,
      'border-red-500 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500': error,
      'bg-gray-100': disabled
    }
  );

  const selectClasses = classNames(
    'block w-full pl-3 pr-10 py-2 text-base border-0 bg-transparent focus:outline-none focus:ring-0 text-right',
    {
      'text-gray-500': !value && placeholder
    }
  );

  return (
    <div className={containerClasses}>
      {label && (
        <label
          htmlFor={selectId}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}

      <div className={selectContainerClasses}>
        <select
          ref={ref}
          id={selectId}
          className={selectClasses}
          value={value}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={`${selectId}-error`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {(error || helperText) && (
        <p
          id={`${selectId}-error`}
          className={classNames(
            'mt-1 text-sm',
            {
              'text-red-500': error,
              'text-gray-500': !error && helperText
            }
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}); 