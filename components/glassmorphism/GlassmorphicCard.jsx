/**
 * GlassmorphicCard - Reusable glassmorphic card component
 *
 * Features:
 * - Multiple style variants (light, dark, colored)
 * - Customizable blur intensity
 * - Hover effects with smooth transitions
 * - Accessibility-friendly
 * - Mobile responsive
 */

import React from 'react';

export const GlassmorphicCard = React.forwardRef(
  ({
    children,
    className = '',
    variant = 'light',
    blur = 'md',
    interactive = true,
  }, ref) => {
    const baseStyles = `
      rounded-xl border backdrop-filter backdrop-blur
      transition-all duration-300
      ${interactive ? 'hover:shadow-lg cursor-pointer' : ''}
    `;

    const variants = {
      light: `
        bg-white/10 border-white/20
        ${interactive ? 'hover:bg-white/20 hover:border-white/30' : ''}
      `,
      dark: `
        bg-gray-900/10 border-white/10
        ${interactive ? 'hover:bg-gray-900/20 hover:border-white/20' : ''}
      `,
      colored: `
        bg-blue-500/10 border-blue-400/30
        ${interactive ? 'hover:bg-blue-500/20 hover:border-blue-400/40' : ''}
      `,
      danger: `
        bg-red-500/10 border-red-400/30
        ${interactive ? 'hover:bg-red-500/20 hover:border-red-400/40' : ''}
      `,
      success: `
        bg-green-500/10 border-green-400/30
        ${interactive ? 'hover:bg-green-500/20 hover:border-green-400/40' : ''}
      `,
    };

    const blurSizes = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl',
      '2xl': 'backdrop-blur-2xl',
    };

    return (
      <div
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${blurSizes[blur]}
          ${className}
        `}
        role="article"
      >
        {children}
      </div>
    );
  }
);

GlassmorphicCard.displayName = 'GlassmorphicCard';

export default GlassmorphicCard;
