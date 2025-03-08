import React, { forwardRef } from 'react';
import classNames from 'classnames';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  error,
  helperText,
  startAdornment,
  endAdornment,
  fullWidth = false,
  id,
  required,
  disabled,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const containerClasses = classNames(
    'flex flex-col',
    {
      'w-full': fullWidth,
      'opacity-60 cursor-not-allowed': disabled
    },
    className
  );

  const inputContainerClasses = classNames(
    'relative flex items-center rounded-md border transition-all duration-200',
    {
      'border-gray-300 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500': !error,
      'border-red-500 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500': error,
      'bg-gray-100': disabled
    }
  );

  const inputClasses = classNames(
    'w-full px-3 py-2 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-right',
    {
      'pl-3 pr-10': startAdornment,
      'pl-10 pr-3': endAdornment,
      'px-3': !startAdornment && !endAdornment
    }
  );

  const renderAdornment = (adornment: React.ReactNode, position: 'start' | 'end') => {
    if (!adornment) return null;

    return (
      <div className={classNames(
        'absolute inset-y-0 flex items-center px-3 pointer-events-none text-gray-500',
        {
          'right-0': position === 'start',
          'left-0': position === 'end'
        }
      )}>
        {adornment}
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}

      <div className={inputContainerClasses}>
        {renderAdornment(startAdornment, 'start')}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={`${inputId}-error`}
          {...props}
        />
        {renderAdornment(endAdornment, 'end')}
      </div>

      {(error || helperText) && (
        <p
          id={`${inputId}-error`}
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