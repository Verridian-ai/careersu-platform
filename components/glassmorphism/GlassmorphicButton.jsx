/**
 * GlassmorphicButton - Accessible button with glassmorphism
 *
 * Features:
 * - Multiple style variants
 * - Size options
 * - Loading state with spinner
 * - Disabled state
 * - Focus ring support
 * - Accessibility features
 */

import React from 'react';

export const GlassmorphicButton = React.forwardRef(
  ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className = '',
    type = 'button',
    ...props
  }, ref) => {
    const baseStyles = `
      rounded-lg font-semibold transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      backdrop-filter backdrop-blur-sm
      inline-flex items-center justify-center gap-2
      whitespace-nowrap
    `;

    const variants = {
      primary: `
        bg-blue-500/80 hover:bg-blue-600 text-white
        focus:ring-blue-500 border border-blue-400/30
      `,
      secondary: `
        bg-white/10 hover:bg-white/20 border border-white/20 text-white
        focus:ring-white
      `,
      danger: `
        bg-red-500/80 hover:bg-red-600 text-white
        focus:ring-red-500 border border-red-400/30
      `,
      success: `
        bg-green-500/80 hover:bg-green-600 text-white
        focus:ring-green-500 border border-green-400/30
      `,
      outline: `
        border-2 border-white/30 hover:border-white/50 text-white
        hover:bg-white/5 focus:ring-white
      `,
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

GlassmorphicButton.displayName = 'GlassmorphicButton';

export default GlassmorphicButton;
