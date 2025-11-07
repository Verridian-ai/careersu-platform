/**
 * Tailwind CSS Configuration for Glassmorphism
 *
 * This configuration extends Tailwind CSS with custom utilities
 * and settings optimized for glassmorphism design
 */

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      // Extended backdrop blur values
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
      },

      // Custom glassmorphic background colors
      backgroundColor: {
        glass: 'rgba(255, 255, 255, 0.1)',
        'glass-light': 'rgba(255, 255, 255, 0.15)',
        'glass-medium': 'rgba(255, 255, 255, 0.2)',
        'glass-heavy': 'rgba(255, 255, 255, 0.25)',
        'glass-dark': 'rgba(30, 30, 30, 0.1)',
      },

      // Custom glassmorphic border colors
      borderColor: {
        glass: 'rgba(255, 255, 255, 0.2)',
        'glass-light': 'rgba(255, 255, 255, 0.3)',
        'glass-dark': 'rgba(255, 255, 255, 0.1)',
      },

      // Custom shadows for glass effect depth
      boxShadow: {
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.05)',
        'glass-md': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 12px 48px rgba(0, 0, 0, 0.15)',
        'glass-xl': '0 20px 64px rgba(0, 0, 0, 0.2)',
        'glass-inset': 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
      },

      // Custom blur animations
      keyframes: {
        'glass-fade': {
          '0%': {
            opacity: '0',
            backdropFilter: 'blur(0)',
          },
          '100%': {
            opacity: '1',
            backdropFilter: 'blur(10px)',
          },
        },
        'glass-slide-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
            backdropFilter: 'blur(0)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
            backdropFilter: 'blur(10px)',
          },
        },
        'blob': {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
        },
      },

      animation: {
        'glass-fade': 'glass-fade 0.3s ease-out',
        'glass-slide-in': 'glass-slide-in 0.3s ease-out',
        'blob': 'blob 7s infinite',
      },

      // Responsive breakpoints (standard Tailwind)
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },

      // Custom opacity for glassmorphic elements
      opacity: {
        glass: '0.1',
        'glass-light': '0.15',
        'glass-medium': '0.2',
        'glass-heavy': '0.25',
      },

      // Custom border radius for modern look
      borderRadius: {
        glass: '12px',
        'glass-md': '16px',
        'glass-lg': '20px',
      },
    },
  },

  plugins: [
    // Plugin for additional glassmorphism utilities
    function ({ addComponents, theme, e }) {
      const glassComponents = {
        // Base glass component
        '.glass': {
          '@apply bg-white/10 backdrop-filter backdrop-blur-md border border-white/20 rounded-lg':
            {},
        },

        // Glass variants
        '.glass-light': {
          '@apply bg-white/5 backdrop-blur-sm border border-white/10': {},
        },
        '.glass-dark': {
          '@apply bg-gray-900/10 backdrop-blur-md border border-white/10': {},
        },
        '.glass-card': {
          '@apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6': {},
        },

        // Interactive glass
        '.glass-interactive': {
          '@apply glass hover:bg-white/20 hover:border-white/30 transition-all duration-300':
            {},
        },

        // Glass with overlay
        '.glass-overlay': {
          '@apply relative bg-white/10 backdrop-blur-lg border border-white/20': {},
          '&::before': {
            content: '""',
            '@apply absolute inset-0 bg-gradient-to-b from-black/20 to-black/5 pointer-events-none':
              {},
          },
        },
      };

      addComponents(glassComponents);
    },

    // Plugin for accessibility utilities
    function ({ addUtilities, theme, e, corePlugins }) {
      const accessibility = {
        // High contrast mode support
        '@media (prefers-contrast: more)': {
          '.glass': {
            '@apply bg-white/95 border-black/50': {},
          },
        },

        // Reduced transparency support
        '@media (prefers-reduced-transparency: reduce)': {
          '.glass, .glass-light, .glass-dark, .glass-card': {
            '@apply backdrop-blur-none': {},
            'background-color': 'rgba(255, 255, 255, 0.9)',
          },
        },

        // Reduced motion support
        '@media (prefers-reduced-motion: reduce)': {
          '.glass-interactive': {
            '@apply transition-none': {},
          },
        },
      };

      addUtilities(accessibility);
    },

    // Plugin for fallback support
    function ({ addUtilities }) {
      const fallbacks = {
        '@supports (backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0))': {
          '.glass-supported': {
            '@apply bg-white/10 backdrop-blur-md border border-white/20': {},
          },
        },
        '@supports not ((backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0)))': {
          '.glass-fallback': {
            '@apply bg-white/80 border border-gray-300': {},
          },
        },
      };

      addUtilities(fallbacks);
    },
  ],
};
