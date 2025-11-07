# Glassmorphism Design Implementation Guide
## Best Practices for React/Next.js with Tailwind CSS

## Table of Contents
1. [Core Principles](#core-principles)
2. [CSS & Tailwind Implementation](#css--tailwind-implementation)
3. [React/Next.js Component Examples](#reactnextjs-component-examples)
4. [Performance Optimization](#performance-optimization)
5. [Accessibility Considerations](#accessibility-considerations)
6. [Browser Compatibility & Fallbacks](#browser-compatibility--fallbacks)
7. [Mobile Responsive Design](#mobile-responsive-design)
8. [Modern Trends & Best Practices](#modern-trends--best-practices)

---

## Core Principles

### What is Glassmorphism?

Glassmorphism is a UI design style that creates a frosted glass effect using translucency and blur. It utilizes different levels of transparency to create depth and visual contrast between foreground and background elements.

### Key Visual Characteristics

1. **Transparency & Opacity**
   - Controls how much background is visible through the element
   - Typical range: 0.05 to 0.3 opacity (5-30%)
   - Higher opacity = more visibility, lower contrast
   - Lower opacity = less visibility, better blur effect

2. **Background Blur (Backdrop Filter)**
   - Distorts background elements to create an out-of-focus appearance
   - Improves focus on foreground content
   - Recommended blur radius: 8-12px for desktop, 3-5px for mobile
   - Uses CSS `backdrop-filter: blur()` property

3. **Visual Enhancements**
   - **Soft Borders**: White or light-colored outlines (opacity 20-40%) define boundaries
   - **Gradient Overlays**: Subtle gradients replicate light reflection on actual glass
   - **Depth Shadows**: Soft box shadows enhance the 3D glass appearance
   - **Rounded Corners**: Border radius 8-16px creates smooth, modern appearance

### Design Principles

| Principle | Implementation |
|-----------|-----------------|
| **Sparingly Used** | Use glossmorphism for 2-3 key elements per viewport, not throughout the entire UI |
| **Visual Hierarchy** | Ensure glassmorphic elements stand out and clearly indicate interactive components |
| **Content Priority** | Never sacrifice readability or usability for aesthetic effects |
| **Consistency** | Maintain consistent blur, opacity, and border treatment across similar components |
| **Contrast** | Ensure text and interactive elements maintain WCAG-compliant contrast ratios |

---

## CSS & Tailwind Implementation

### Essential Tailwind Classes

```html
<!-- Basic Glassmorphism Card -->
<div class="bg-white/10 backdrop-filter backdrop-blur-md rounded-lg border border-white/20">
  <!-- Content -->
</div>
```

**Key Classes Explained:**

| Class | Purpose | Values |
|-------|---------|--------|
| `bg-white/X` | Background color with opacity | `bg-white/5`, `bg-white/10`, `bg-white/20`, `bg-white/30` |
| `backdrop-filter` | Enables backdrop filter support | Required flag (no values) |
| `backdrop-blur-X` | Applies blur to background | `blur-sm`, `blur-md`, `blur-lg`, `blur-xl`, `blur-2xl` |
| `border` | Define element boundaries | `border`, `border-2`, `border-4` |
| `border-white/X` | Border color with opacity | `border-white/10`, `border-white/20`, `border-white/40` |
| `rounded-X` | Corner radius | `rounded-lg`, `rounded-xl`, `rounded-2xl` |

### Standard CSS Implementation

```css
/* Base Glassmorphism Style */
.glassmorphic {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
}

/* Enhanced with Gradient Overlay */
.glassmorphic-enhanced {
  background: rgba(255, 255, 255, 0.15);
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0)
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Dark Theme Glassmorphism */
.glassmorphic-dark {
  background-color: rgba(30, 30, 30, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}
```

### Tailwind Configuration Extensions

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      backgroundColor: {
        glass: 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(30, 30, 30, 0.1)',
      },
      borderColor: {
        glass: 'rgba(255, 255, 255, 0.2)',
        'glass-dark': 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [
    function ({ addBase, theme, e, corePlugins }) {
      if (!corePlugins('backdropFilter')) {
        addBase({
          '@supports (backdrop-filter: blur(0))': {
            '.backdrop-blur-sm': {
              backdropFilter: 'blur(4px)',
            },
            '.backdrop-blur-md': {
              backdropFilter: 'blur(8px)',
            },
            '.backdrop-blur-lg': {
              backdropFilter: 'blur(12px)',
            },
          },
        });
      }
    },
  ],
};
```

### Opacity Guidelines

| Use Case | Background Opacity | Border Opacity |
|----------|-------------------|-----------------|
| Light backgrounds | 0.05 - 0.15 (5-15%) | 0.2 - 0.3 (20-30%) |
| Medium backgrounds | 0.15 - 0.25 (15-25%) | 0.15 - 0.25 (15-25%) |
| Dark backgrounds | 0.2 - 0.3 (20-30%) | 0.1 - 0.2 (10-20%) |
| Overlays/Modals | 0.3 - 0.5 (30-50%) | 0.2 - 0.3 (20-30%) |

---

## React/Next.js Component Examples

### 1. Glassmorphic Card Component

```jsx
// components/GlassmorphicCard.jsx
import React from 'react';

export const GlassmorphicCard = ({
  children,
  className = '',
  variant = 'light',
  blur = 'md'
}) => {
  const baseStyles = 'rounded-xl border backdrop-filter backdrop-blur transition-all duration-300';

  const variants = {
    light: 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30',
    dark: 'bg-gray-900/10 border-white/10 hover:bg-gray-900/20 hover:border-white/20',
    colored: 'bg-blue-500/10 border-blue-400/30 hover:bg-blue-500/20',
  };

  const blurSizes = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${blurSizes[blur]} ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassmorphicCard;
```

**Usage:**
```jsx
<GlassmorphicCard variant="light" blur="md">
  <h3 className="text-lg font-semibold text-white mb-2">Card Title</h3>
  <p className="text-gray-100 text-sm">Your content here</p>
</GlassmorphicCard>
```

### 2. Glassmorphic Navigation Bar

```jsx
// components/GlassmorphicNavbar.jsx
import React, { useState } from 'react';
import Link from 'next/link';

export const GlassmorphicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50">
      {/* Glassmorphic Background */}
      <div className="bg-white/5 backdrop-filter backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-white hover:text-gray-100 transition">
              Logo
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {['Home', 'About', 'Services', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-gray-100 hover:text-white transition duration-200 px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {['Home', 'About', 'Services', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="block px-4 py-2 text-gray-100 hover:bg-white/10 rounded-lg transition"
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default GlassmorphicNavbar;
```

### 3. Glassmorphic Modal/Dialog

```jsx
// components/GlassmorphicModal.jsx
import React from 'react';

export const GlassmorphicModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className={`${sizeClasses[size]} w-full`}>
          <div className="bg-white/10 backdrop-filter backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-lg transition text-gray-300 hover:text-white"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {children}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-500/80 hover:bg-blue-600 text-white transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlassmorphicModal;
```

**Usage:**
```jsx
const [isModalOpen, setIsModalOpen] = useState(false);

<GlassmorphicModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Welcome"
  size="md"
>
  <p className="text-gray-100">Modal content goes here</p>
</GlassmorphicModal>
```

### 4. Glassmorphic Form/Input Component

```jsx
// components/GlassmorphicInput.jsx
import React from 'react';

export const GlassmorphicInput = React.forwardRef(({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  icon: Icon,
  ...props
}, ref) => {
  return (
    <div className="relative">
      <div className={`
        flex items-center
        bg-white/5 backdrop-filter backdrop-blur-md
        border rounded-xl
        transition-all duration-200
        ${error ? 'border-red-500/50' : 'border-white/20 hover:border-white/30 focus-within:border-blue-500/50'}
      `}>
        {Icon && (
          <span className="pl-4 text-gray-300">
            <Icon className="w-5 h-5" />
          </span>
        )}

        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400
            focus:outline-none transition-all
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

GlassmorphicInput.displayName = 'GlassmorphicInput';

export default GlassmorphicInput;
```

**Usage:**
```jsx
<GlassmorphicInput
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
/>
```

### 5. Glassmorphic Button Component

```jsx
// components/GlassmorphicButton.jsx
import React from 'react';

export const GlassmorphicButton = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed backdrop-filter';

  const variants = {
    primary: 'bg-blue-500/80 hover:bg-blue-600 text-white focus:ring-blue-500',
    secondary: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white focus:ring-white',
    danger: 'bg-red-500/80 hover:bg-red-600 text-white focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
});

GlassmorphicButton.displayName = 'GlassmorphicButton';

export default GlassmorphicButton;
```

### 6. Glassmorphic Feature Card Grid

```jsx
// components/GlassmorphicFeatureGrid.jsx
import React from 'react';

export const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="group">
    <div className="relative">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur" />

      {/* Glass card */}
      <div className="relative bg-white/5 backdrop-filter backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer">

        {/* Icon container */}
        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
          {Icon && <Icon className="w-6 h-6 text-blue-400" />}
        </div>

        {/* Text content */}
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{description}</p>

        {/* Hover indicator */}
        <div className="mt-4 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm font-medium">Learn more</span>
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
);

export const GlassmorphicFeatureGrid = ({ features }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {features.map((feature, index) => (
      <FeatureCard key={index} {...feature} />
    ))}
  </div>
);

export default GlassmorphicFeatureGrid;
```

---

## Performance Optimization

### Key Performance Guidelines

#### 1. **Blur Radius Recommendations**

```javascript
// Performance-optimized blur values
const BLUR_RECOMMENDATIONS = {
  desktop: {
    light: 'blur(12px)',      // Cards, subtle effects
    medium: 'blur(16px)',      // Modals, overlays
    heavy: 'blur(20px)',       // Full-screen effects (use sparingly)
  },
  mobile: {
    light: 'blur(4px)',        // Minimal performance impact
    medium: 'blur(6px)',       // Balance between effect and performance
    heavy: 'blur(8px)',        // Maximum before noticeable slowdown
  },
};
```

#### 2. **Element Limitations**

- **Per viewport**: Maximum 2-3 glassmorphic elements visible at once
- **Per page**: Limit to 5-7 total glassmorphic elements
- **Avoid animating**: Don't animate elements with `backdrop-filter`
- **Use for key elements**: Navigation, modals, featured cards only

#### 3. **CSS Optimization Pattern**

```css
/* Optimize with transform: translateZ(0) for GPU acceleration */
.glassmorphic-optimized {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  will-change: auto;  /* Change to 'auto' unless animation is truly needed */
  transform: translateZ(0);  /* Enable GPU acceleration */
  -webkit-transform: translateZ(0);
}

/* Animate position, not backdrop-filter */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px) translateZ(0);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateZ(0);
  }
}

.glass-animate {
  animation: slideIn 0.3s ease-out;
}
```

#### 4. **Mobile Performance Strategy**

```jsx
// adaptive-glassmorphism.jsx - Reduce blur on mobile
import { useMediaQuery } from 'react-responsive';

export const AdaptiveGlassmorphic = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: '768px' });

  return (
    <div className={`
      bg-white/10
      ${isMobile ? 'backdrop-blur-sm' : 'backdrop-blur-md'}
      border border-white/20
      rounded-xl
      p-6
    `}>
      {children}
    </div>
  );
};
```

#### 5. **Lazy Loading Glassmorphic Effects**

```jsx
// lazy-glass-component.jsx
import { useEffect, useRef, useState } from 'react';

export const LazyGlassmorphic = ({ children, threshold = 0.1 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-500
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${isVisible ? 'bg-white/10 backdrop-blur-md' : 'bg-white/5 backdrop-blur-none'}
      `}
    >
      {children}
    </div>
  );
};
```

#### 6. **Bundle Size Considerations**

```javascript
// tailwind.config.js - Only include necessary utilities
module.exports = {
  safelist: [
    'backdrop-blur-sm',
    'backdrop-blur-md',
    'backdrop-blur-lg',
    'bg-white/5',
    'bg-white/10',
    'bg-white/20',
    'border-white/10',
    'border-white/20',
  ],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Only extend with what you need
    },
  },
};
```

---

## Accessibility Considerations

### WCAG 2.2 Compliance Requirements

#### 1. **Contrast Ratio Standards**

| Element Type | WCAG AA Minimum | WCAG AAA Minimum | Implementation |
|--------------|-----------------|------------------|-----------------|
| Body text (< 18pt) | 4.5:1 | 7:1 | Use solid background overlay behind text |
| Large text (≥ 18pt) | 3:1 | 4.5:1 | Allow higher transparency |
| UI components | 3:1 | 4.5:1 | Test against multiple backgrounds |
| Disabled state | Not required | Not required | Can use lower contrast |

#### 2. **Implementation Pattern - Accessible Glassmorphism**

```jsx
// AccessibleGlassmorphic.jsx
export const AccessibleGlassmorphicCard = ({ title, content }) => {
  return (
    <article className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">

      {/* Text always has sufficient contrast with semi-opaque overlay */}
      <div className="bg-gradient-to-b from-black/20 to-black/10 rounded-lg p-4 -m-4 mb-2">
        <h2 className="text-xl font-bold text-white" id="card-title">
          {title}
        </h2>
      </div>

      {/* Content area with contrast overlay */}
      <div className="bg-black/5 rounded-lg p-4 mt-4">
        <p className="text-gray-100 leading-relaxed" id="card-content">
          {content}
        </p>
      </div>

      {/* ARIA labels for clarity */}
      <button
        aria-label={`Learn more about ${title}`}
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition focus:ring-2 focus:ring-blue-300 focus:outline-none"
      >
        Learn More
      </button>
    </article>
  );
};
```

#### 3. **Respecting User Preferences**

```css
/* Respect reduced motion and transparency preferences */
@media (prefers-reduced-motion: reduce) {
  .glassmorphic {
    animation: none;
    transition: none;
  }
}

@media (prefers-reduced-transparency: reduce) {
  .glassmorphic {
    background-color: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: none !important;
    border: 2px solid rgba(0, 0, 0, 0.2);
  }
}

/* High contrast mode support */
@media (prefers-contrast: more) {
  .glassmorphic {
    background-color: rgba(255, 255, 255, 0.95);
    border: 2px solid rgba(0, 0, 0, 0.5);
  }
}
```

#### 4. **React Hook for Accessibility Preferences**

```jsx
// useAccessibilityPreferences.js
import { useEffect, useState } from 'react';

export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    reducedTransparency: false,
    highContrast: false,
  });

  useEffect(() => {
    // Check reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPreferences(prev => ({ ...prev, reducedMotion: motionQuery.matches }));

    // Check reduced transparency preference
    const transparencyQuery = window.matchMedia('(prefers-reduced-transparency: reduce)');
    setPreferences(prev => ({ ...prev, reducedTransparency: transparencyQuery.matches }));

    // Check high contrast preference
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');
    setPreferences(prev => ({ ...prev, highContrast: contrastQuery.matches }));

    // Listen for changes
    motionQuery.addEventListener('change', (e) => {
      setPreferences(prev => ({ ...prev, reducedMotion: e.matches }));
    });

    transparencyQuery.addEventListener('change', (e) => {
      setPreferences(prev => ({ ...prev, reducedTransparency: e.matches }));
    });

    contrastQuery.addEventListener('change', (e) => {
      setPreferences(prev => ({ ...prev, highContrast: e.matches }));
    });

    return () => {
      motionQuery.removeEventListener('change', () => {});
      transparencyQuery.removeEventListener('change', () => {});
      contrastQuery.removeEventListener('change', () => {});
    };
  }, []);

  return preferences;
}

// Usage
export const AccessibleGlassmorphic = ({ children }) => {
  const { reducedTransparency, highContrast } = useAccessibilityPreferences();

  return (
    <div className={`
      rounded-lg border p-6 transition-all
      ${reducedTransparency ? 'bg-white/90 border-gray-300 backdrop-blur-none' : 'bg-white/10 border-white/20 backdrop-blur-md'}
      ${highContrast ? 'border-2 border-black' : ''}
    `}>
      {children}
    </div>
  );
};
```

#### 5. **Screen Reader Support**

```jsx
// ScreenReaderFriendlyGlassmorphic.jsx
export const ScreenReaderGlassCard = ({
  title,
  description,
  icon: Icon,
  onAction
}) => {
  return (
    <section
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6"
      role="article"
      aria-labelledby="glass-card-title"
      aria-describedby="glass-card-desc"
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <Icon
            className="w-8 h-8 text-blue-400 flex-shrink-0"
            aria-hidden="true"
          />
        )}

        <div className="flex-1">
          <h3 id="glass-card-title" className="text-xl font-bold text-white mb-2">
            {title}
          </h3>
          <p id="glass-card-desc" className="text-gray-100 mb-4">
            {description}
          </p>
          <button
            onClick={onAction}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            aria-label={`${title} - More information`}
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};
```

---

## Browser Compatibility & Fallbacks

### Support Matrix

| Browser | Version | Support | Status |
|---------|---------|---------|--------|
| Chrome | 76+ | Full | ✅ Fully Supported |
| Safari | 9+ | Full | ✅ Fully Supported |
| Edge | 79+ | Full | ✅ Fully Supported |
| Firefox | 103+ | Full | ✅ Now Supported (was disabled by default) |
| Opera | 63+ | Full | ✅ Fully Supported |
| Mobile Safari (iOS) | 9+ | Full | ✅ Fully Supported |
| Chrome Mobile | 76+ | Full | ✅ Fully Supported |
| Firefox Mobile | 103+ | Full | ✅ Fully Supported |

**Coverage**: ~94% of global traffic as of 2024

### Vendor Prefixes

```css
.glassmorphic {
  /* Standard (W3C) */
  backdrop-filter: blur(10px);

  /* Safari and older browsers */
  -webkit-backdrop-filter: blur(10px);

  /* Firefox (older versions, no longer needed for 103+) */
  -moz-backdrop-filter: blur(10px);
}
```

### Fallback Strategies

#### 1. **Progressive Enhancement - Solid Color Fallback**

```css
.glassmorphic {
  /* Fallback for non-supporting browsers */
  background-color: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.2);

  /* Enhanced with backdrop filter for supporting browsers */
  @supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
    background-color: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}
```

#### 2. **Feature Detection in React**

```jsx
// useBackdropFilterSupport.js
import { useEffect, useState } from 'react';

export function useBackdropFilterSupport() {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if backdrop-filter is supported
    const element = document.createElement('div');
    const style = element.style;

    const isSupported = (
      style.backdropFilter !== undefined ||
      style.WebkitBackdropFilter !== undefined
    );

    setIsSupported(isSupported);
  }, []);

  return isSupported;
}

// Usage Component
export const SmartGlassmorphic = ({ children }) => {
  const isSupported = useBackdropFilterSupport();

  if (!isSupported) {
    return (
      <div className="bg-white/80 border border-gray-300 rounded-lg p-6">
        {children}
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
      {children}
    </div>
  );
};
```

#### 3. **Firefox-Specific Fallback**

```css
/* Firefox detection and fallback */
@-moz-document url-prefix() {
  .glassmorphic {
    /* Firefox doesn't support backdrop-filter, use solid color */
    background-color: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(0, 0, 0, 0.15);
  }
}

/* For other browsers */
.glassmorphic {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
}
```

#### 4. **Tailwind Config with Fallback**

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    function ({ addUtilities, e }) {
      const utilities = {
        '.backdrop-blur-fallback': {
          '@supports (backdrop-filter: blur(0px))': {
            backdropFilter: 'blur(10px)',
            '-webkit-backdrop-filter': 'blur(10px)',
          },
          '@supports not (backdrop-filter: blur(0px))': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
        },
      };

      addUtilities(utilities);
    },
  ],
};
```

---

## Mobile Responsive Design

### Mobile-First Strategy

```jsx
// MobileResponsiveGlassmorphic.jsx
import { useMediaQuery } from 'react-responsive';

export const ResponsiveGlassmorphic = ({ children, title }) => {
  const isMobile = useMediaQuery({ maxWidth: '640px' });
  const isTablet = useMediaQuery({ minWidth: '641px', maxWidth: '1024px' });
  const isDesktop = useMediaQuery({ minWidth: '1025px' });

  const blurValue = isMobile ? 'backdrop-blur-sm' : 'backdrop-blur-md';
  const padding = isMobile ? 'p-4' : 'p-6';
  const borderRadius = isMobile ? 'rounded-lg' : 'rounded-2xl';

  return (
    <div className={`
      bg-white/10 border border-white/20 ${blurValue}
      ${padding} ${borderRadius}
      transition-all duration-300
    `}>
      <h2 className={`
        font-bold text-white mb-4
        ${isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl'}
      `}>
        {title}
      </h2>
      {children}
    </div>
  );
};
```

### Breakpoint Specifications

```tailwind
/* Tailwind CSS Breakpoints Applied to Glassmorphism */

/* Mobile (< 640px) */
sm: 'backdrop-blur-sm'        /* 4px blur */
sm: 'p-4'
sm: 'rounded-lg'
sm: 'text-base'

/* Tablet (640px - 1024px) */
md: 'backdrop-blur-md'        /* 12px blur */
md: 'p-6'
md: 'rounded-xl'
md: 'text-lg'

/* Desktop (1024px - 1280px) */
lg: 'backdrop-blur-lg'        /* 16px blur */
lg: 'p-8'
lg: 'rounded-2xl'
lg: 'text-xl'

/* Large Desktop (1280px+) */
xl: 'backdrop-blur-xl'        /* 20px blur */
xl: 'p-10'
xl: 'rounded-3xl'
xl: 'text-2xl'
```

### Responsive Component Example

```jsx
// ResponsiveGlassCard.jsx
import React from 'react';

export const ResponsiveGlassCard = ({
  icon: Icon,
  title,
  description,
  stats
}) => {
  return (
    <div className="
      bg-white/10 backdrop-blur-md border border-white/20 rounded-xl
      sm:p-4 md:p-6 lg:p-8
      sm:rounded-lg md:rounded-xl lg:rounded-2xl
      sm:backdrop-blur-sm md:backdrop-blur-md lg:backdrop-blur-lg
      hover:bg-white/20 transition-all duration-300
    ">
      {/* Header with responsive text size */}
      <div className="flex items-start gap-4 mb-4 sm:mb-6">
        {Icon && (
          <div className="
            bg-blue-500/20 rounded-lg flex items-center justify-center
            flex-shrink-0
            sm:w-10 sm:h-10
            md:w-12 md:h-12
            lg:w-14 lg:h-14
          ">
            <Icon className="
              text-blue-400
              sm:w-5 sm:h-5
              md:w-6 md:h-6
              lg:w-7 lg:h-7
            " />
          </div>
        )}

        <div className="flex-1">
          <h3 className="
            font-bold text-white
            sm:text-base
            md:text-lg
            lg:text-xl
          ">
            {title}
          </h3>
        </div>
      </div>

      {/* Description with responsive text size */}
      <p className="
        text-gray-100 leading-relaxed
        sm:text-xs sm:mb-4
        md:text-sm md:mb-6
        lg:text-base lg:mb-8
      ">
        {description}
      </p>

      {/* Stats grid - responsive columns */}
      {stats && (
        <div className="
          grid gap-4
          sm:grid-cols-1 sm:gap-3
          md:grid-cols-2 md:gap-4
          lg:grid-cols-3 lg:gap-6
          pt-4 border-t border-white/10
        ">
          {stats.map((stat, idx) => (
            <div key={idx} className="
              bg-white/5 rounded-lg p-3
              sm:p-2 md:p-3 lg:p-4
            ">
              <p className="
                text-gray-300 font-semibold
                sm:text-sm
                md:text-base
                lg:text-lg
              ">
                {stat.value}
              </p>
              <p className="
                text-gray-400 text-xs
              ">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponsiveGlassCard;
```

### Touch-Friendly Mobile Adjustments

```jsx
// TouchFriendlyGlassmorphic.jsx
export const TouchFriendlyButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        bg-blue-500/80 hover:bg-blue-600 text-white
        rounded-lg font-semibold transition-all
        backdrop-filter backdrop-blur-md
        border border-blue-400/30

        /* Touch-friendly sizing (48px minimum on mobile) */
        sm:px-3 sm:py-2 sm:text-sm
        md:px-4 md:py-2 md:text-base
        lg:px-6 lg:py-3 lg:text-lg

        /* Touch feedback */
        active:scale-95
        focus:ring-2 focus:ring-offset-2 focus:ring-blue-500

        /* Prevent text zoom on iOS */
        text-base

        /* Prevent double-tap zoom */
        touch-manipulation
      "
    >
      {children}
    </button>
  );
};
```

---

## Modern Trends & Best Practices

### 2024-2025 Glassmorphism Trends

#### 1. **Liquid Glass UI**
Combines glassmorphism with fluid animations and organic shapes.

```jsx
// LiquidGlassComponent.jsx
export const LiquidGlass = ({ children }) => {
  return (
    <div className="
      relative
      bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl
      p-6
      before:absolute before:inset-0 before:rounded-3xl
      before:bg-gradient-to-br before:from-blue-500/10 before:via-transparent before:to-purple-500/10
      before:opacity-0 before:hover:opacity-100 before:transition-opacity before:duration-300
      after:absolute after:inset-0 after:rounded-3xl
      after:blur-2xl after:-z-10
      overflow-hidden
    ">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
```

#### 2. **Neumorphic-Glassmorphic Hybrid**
Combines soft shadows with transparency for depth.

```css
.hybrid-glass-neumorphic {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.1),
    -2px -2px 8px rgba(255, 255, 255, 0.1),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
}
```

#### 3. **Dynamic Color Glassmorphism**
Glassmorphism that adapts to dominant background colors.

```jsx
// DynamicColorGlass.jsx
import { useEffect, useState } from 'react';

export const DynamicColorGlassmorphic = ({
  children,
  backgroundImageUrl
}) => {
  const [dominantColor, setDominantColor] = useState('bg-blue-500');

  useEffect(() => {
    // Extract dominant color from background image
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = backgroundImageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let r = 0, g = 0, b = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      r = Math.floor(r / (data.length / 4));
      g = Math.floor(g / (data.length / 4));
      b = Math.floor(b / (data.length / 4));

      // Determine complementary color
      const hsl = rgbToHsl(r, g, b);
      // Update dominant color state based on HSL
      setDominantColor(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    };
  }, [backgroundImageUrl]);

  return (
    <div className={`
      bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
      p-6 transition-all duration-500
    `}
    style={{
      borderColor: `rgba(255, 255, 255, 0.2)`,
      backgroundImage: `linear-gradient(135deg, ${dominantColor}15, ${dominantColor}05)`
    }}>
      {children}
    </div>
  );
};
```

#### 4. **Interactive Glassmorphic Elements**
Glassmorphism with micro-interactions.

```jsx
// InteractiveGlassmorphic.jsx
import { useState } from 'react';

export const InteractiveGlassElement = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative bg-white/10 border border-white/20 rounded-xl p-6
        backdrop-blur-md transition-all duration-300
        ${isHovered ? 'bg-white/20 border-white/40' : ''}
      `}
    >
      {/* Interactive shine effect */}
      {isHovered && (
        <div
          className="
            absolute inset-0 rounded-xl overflow-hidden pointer-events-none
          "
        >
          <div
            className="
              absolute -top-1/2 -left-1/2 w-full h-full
              bg-gradient-to-br from-white/20 to-transparent
              opacity-0 group-hover:opacity-100
              animation-pulse
            "
            style={{
              animation: isHovered ? 'shimmer 2s infinite' : 'none'
            }}
          />
        </div>
      )}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
```

#### 5. **Gradient Border Glassmorphism**
Glassmorphism with animated gradient borders.

```css
.glass-gradient-border {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2px;
  background-clip: padding-box;
}

.glass-gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 2px;
  background: linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5);
  background-size: 300% 300%;
  animation: gradientAnimation 3s ease infinite;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

---

## Complete Page Example

### Full Landing Page with Glassmorphism

```jsx
// pages/landing.jsx
import React, { useState } from 'react';
import GlassmorphicNavbar from '../components/GlassmorphicNavbar';
import GlassmorphicCard from '../components/GlassmorphicCard';
import GlassmorphicButton from '../components/GlassmorphicButton';
import GlassmorphicInput from '../components/GlassmorphicInput';
import ResponsiveGlassCard from '../components/ResponsiveGlassCard';
import { useAccessibilityPreferences } from '../hooks/useAccessibilityPreferences';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const { reducedTransparency } = useAccessibilityPreferences();

  return (
    <div className="
      min-h-screen
      bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900
      before:fixed before:inset-0 before:bg-[url('/noise.png')] before:opacity-5
      relative overflow-hidden
    ">
      {/* Animated background blobs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

      {/* Navigation */}
      <GlassmorphicNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="
              text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6
              bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent
            ">
              Welcome to Glassmorphism
            </h1>
            <p className="
              text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto
              leading-relaxed
            ">
              Discover the elegant world of frosted glass design. Modern,
              accessible, and performant UI components built with React and
              Tailwind CSS.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <GlassmorphicButton
              variant="primary"
              size="lg"
              className="sm:w-auto"
            >
              Get Started
            </GlassmorphicButton>
            <GlassmorphicButton
              variant="secondary"
              size="lg"
              className="sm:w-auto"
            >
              Learn More
            </GlassmorphicButton>
          </div>

          {/* Email Signup */}
          <div className="max-w-md mx-auto mb-16">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Stay Updated
              </h3>
              <div className="flex flex-col gap-3">
                <GlassmorphicInput
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <GlassmorphicButton variant="primary" className="w-full">
                  Subscribe
                </GlassmorphicButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-12">
            Why Choose Glassmorphism?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Modern Design',
                description: 'Elegant frosted glass aesthetics that look contemporary and professional.',
                value: '2024',
                label: 'Latest Trend'
              },
              {
                title: 'Accessible',
                description: 'Built with WCAG compliance and accessibility features from the start.',
                value: '100%',
                label: 'WCAG AA'
              },
              {
                title: 'Performant',
                description: 'Optimized blur effects that work smoothly on mobile and desktop.',
                value: '94%',
                label: 'Browser Support'
              },
            ].map((feature, idx) => (
              <ResponsiveGlassCard
                key={idx}
                title={feature.title}
                description={feature.description}
                stats={[{ value: feature.value, label: feature.label }]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-12">
            Component Library
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassmorphicCard variant="light" blur="md">
              <h3 className="text-lg font-semibold text-white mb-3">Card Variant</h3>
              <p className="text-gray-100 text-sm mb-4">
                This is a glassmorphic card component with light transparency
              </p>
              <GlassmorphicButton size="sm">Learn More</GlassmorphicButton>
            </GlassmorphicCard>

            <GlassmorphicCard variant="colored" blur="lg">
              <h3 className="text-lg font-semibold text-white mb-3">Colored Variant</h3>
              <p className="text-gray-100 text-sm mb-4">
                This is a glassmorphic card with a blue color accent
              </p>
              <GlassmorphicButton size="sm">Learn More</GlassmorphicButton>
            </GlassmorphicCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative mt-20 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 Glassmorphism Design. Built with React, Next.js, and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
```

---

## Summary & Quick Reference

### Essential Checklist

- [ ] Use glassmorphism sparingly (2-3 elements per viewport)
- [ ] Maintain WCAG AA contrast ratios (4.5:1 for text)
- [ ] Add background overlays behind text for readability
- [ ] Use appropriate blur values (8-12px desktop, 3-5px mobile)
- [ ] Include vendor prefixes (`-webkit-backdrop-filter`)
- [ ] Provide fallbacks for unsupported browsers
- [ ] Respect `prefers-reduced-transparency` and `prefers-reduced-motion`
- [ ] Test on real devices and with assistive technologies
- [ ] Optimize performance with GPU acceleration
- [ ] Use semantic HTML and ARIA labels

### Key Properties

```css
/* Core Properties */
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
background-color: rgba(255, 255, 255, 0.15);
border: 1px solid rgba(255, 255, 255, 0.25);
border-radius: 12px;
```

### Tailwind Classes

```
Blur: backdrop-blur-{sm|md|lg|xl|2xl}
Opacity: bg-{color}/{opacity}
Border: border-{color}/{opacity}
Radius: rounded-{lg|xl|2xl|3xl}
```

---

## Resources & References

### Official Documentation
- [Tailwind CSS Backdrop Blur](https://tailwindcss.com/docs/backdrop-blur)
- [MDN: Backdrop Filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
- [W3C Spec: Backdrop Filter](https://drafts.fxtf.org/filter-effects-2/#backdrop-filter)

### Tools & Generators
- [UI.Glass Glassmorphism Generator](https://ui.glass/)
- [Notchtools Glassmorphism Generator](https://notchtools.com/css-glassmorphism-generator/)
- [Tailwind CSS Glassmorphism Generator](https://tailwindcss-glassmorphism.vercel.app/)

### Component Libraries
- [Liquid Glass UI - React](https://liquidglass.liqueai.com/)
- [GlassCN - shadcn Components](https://allshadcn.com/components/glasscn-ui/)
- [React Glassmorphism npm](https://www.npmjs.com/package/@tsamantanis/react-glassmorphism)

### Learning Resources
- [NN/G - Glassmorphism Design Article](https://www.nngroup.com/articles/glassmorphism/)
- [Axess Lab - Glassmorphism & Accessibility](https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive/)
- [LogRocket - Glassmorphism in React](https://blog.logrocket.com/how-to-create-glassmorphism-effect-react/)
