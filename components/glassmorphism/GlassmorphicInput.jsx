/**
 * GlassmorphicInput - Form input with glassmorphism styling
 *
 * Features:
 * - Multiple input types
 * - Icon support
 * - Error state
 * - Disabled state
 * - Focus styles
 * - Accessibility support
 */

import React from 'react';

export const GlassmorphicInput = React.forwardRef(
  ({
    type = 'text',
    placeholder,
    value,
    onChange,
    disabled = false,
    error = false,
    icon: Icon,
    label,
    helperText,
    className = '',
    ...props
  }, ref) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="
              block text-sm font-medium text-white mb-2
              transition-colors duration-200
            "
          >
            {label}
          </label>
        )}

        <div className={`
          flex items-center
          bg-white/5 backdrop-filter backdrop-blur-md
          border-2 rounded-xl
          transition-all duration-200
          focus-within:border-blue-500/50 focus-within:bg-white/10
          ${error
            ? 'border-red-500/50 focus-within:border-red-500'
            : 'border-white/20 hover:border-white/30'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed bg-white/3' : ''}
          ${className}
        `}>
          {Icon && (
            <span className="pl-4 text-gray-300 flex-shrink-0" aria-hidden="true">
              <Icon className="w-5 h-5" />
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`
              flex-1 px-4 py-3 bg-transparent text-white
              placeholder-gray-400 placeholder-opacity-70
              focus:outline-none transition-all
              disabled:cursor-not-allowed
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error || helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
        </div>

        {(error || helperText) && (
          <p
            id={`${inputId}-helper`}
            className={`
              mt-2 text-sm transition-colors duration-200
              ${error ? 'text-red-400' : 'text-gray-400'}
            `}
            role={error ? 'alert' : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

GlassmorphicInput.displayName = 'GlassmorphicInput';

export default GlassmorphicInput;
