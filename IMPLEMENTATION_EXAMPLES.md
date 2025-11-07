# Glassmorphism Implementation Examples

## Quick Start Guide

### 1. Setup

#### Install Dependencies
```bash
npm install react react-dom next tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Update tailwind.config.js
```javascript
const glassConfig = require('./config/tailwind-glassmorphism-config');
module.exports = glassConfig;
```

#### Import Styles
```jsx
// In your _app.jsx or layout.jsx
import '../styles/glassmorphism.css';
```

---

## Component Usage Examples

### Example 1: Simple Card

```jsx
import GlassmorphicCard from '@/components/glassmorphism/GlassmorphicCard';

export default function SimpleCard() {
  return (
    <GlassmorphicCard variant="light" blur="md">
      <h3 className="text-lg font-semibold text-white mb-2">
        Card Title
      </h3>
      <p className="text-gray-100 text-sm">
        This is a simple glassmorphic card component.
      </p>
    </GlassmorphicCard>
  );
}
```

### Example 2: Interactive Button Group

```jsx
import GlassmorphicButton from '@/components/glassmorphism/GlassmorphicButton';
import { useState } from 'react';

export default function ButtonGroup() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <div className="flex gap-4">
      <GlassmorphicButton variant="primary" size="md" onClick={handleClick} loading={loading}>
        Primary Action
      </GlassmorphicButton>
      <GlassmorphicButton variant="secondary" size="md">
        Secondary Action
      </GlassmorphicButton>
      <GlassmorphicButton variant="danger" size="md">
        Dangerous Action
      </GlassmorphicButton>
    </div>
  );
}
```

### Example 3: Form Input with Validation

```jsx
import GlassmorphicInput from '@/components/glassmorphism/GlassmorphicInput';
import GlassmorphicButton from '@/components/glassmorphism/GlassmorphicButton';
import { useState } from 'react';
import { EnvelopeIcon, LockIcon } from '@heroicons/react/24/solid';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassmorphicInput
          label="Email Address"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={EnvelopeIcon}
        />

        <GlassmorphicInput
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={LockIcon}
        />

        <GlassmorphicButton variant="primary" size="lg" className="w-full">
          Sign In
        </GlassmorphicButton>
      </form>
    </div>
  );
}
```

### Example 4: Modal Dialog

```jsx
import GlassmorphicModal from '@/components/glassmorphism/GlassmorphicModal';
import GlassmorphicButton from '@/components/glassmorphism/GlassmorphicButton';
import { useState } from 'react';

export default function ModalExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <GlassmorphicButton variant="primary" onClick={() => setIsModalOpen(true)}>
        Open Modal
      </GlassmorphicButton>

      <GlassmorphicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Welcome to Glassmorphism"
        size="md"
        footer={
          <>
            <GlassmorphicButton
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </GlassmorphicButton>
            <GlassmorphicButton
              variant="primary"
              onClick={() => setIsModalOpen(false)}
            >
              Confirm
            </GlassmorphicButton>
          </>
        }
      >
        <p className="text-gray-100 mb-4">
          This is a glassmorphic modal dialog with proper focus management and accessibility features.
        </p>
        <p className="text-gray-100">
          Press Escape to close or click the close button.
        </p>
      </GlassmorphicModal>
    </>
  );
}
```

### Example 5: Navigation Bar

```jsx
import GlassmorphicNavbar from '@/components/glassmorphism/GlassmorphicNavbar';

export default function NavbarExample() {
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <GlassmorphicNavbar
      logo="MyApp"
      links={navLinks}
    />
  );
}
```

### Example 6: Responsive Card Grid

```jsx
import GlassmorphicCard from '@/components/glassmorphism/GlassmorphicCard';
import { StarIcon, SparklesIcon, BoltIcon } from '@heroicons/react/24/solid';

const features = [
  {
    icon: StarIcon,
    title: 'Modern Design',
    description: 'Built with the latest design trends and best practices.',
  },
  {
    icon: SparklesIcon,
    title: 'Responsive',
    description: 'Works seamlessly on all devices and screen sizes.',
  },
  {
    icon: BoltIcon,
    title: 'Performance',
    description: 'Optimized for speed and smooth user experience.',
  },
];

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, idx) => {
        const Icon = feature.icon;
        return (
          <GlassmorphicCard
            key={idx}
            variant="light"
            blur="md"
            className="group hover:shadow-lg"
          >
            <div className="mb-4 p-3 bg-blue-500/20 rounded-lg w-fit group-hover:bg-blue-500/30 transition">
              <Icon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-100 text-sm">
              {feature.description}
            </p>
          </GlassmorphicCard>
        );
      })}
    </div>
  );
}
```

### Example 7: Accessibility-Aware Component

```jsx
import GlassmorphicCard from '@/components/glassmorphism/GlassmorphicCard';
import useAccessibilityPreferences from '@/hooks/useAccessibilityPreferences';

export default function AccessibleCard() {
  const { reducedTransparency, highContrast, reducedMotion } = useAccessibilityPreferences();

  return (
    <GlassmorphicCard
      variant={highContrast ? 'light' : 'light'}
      blur={reducedTransparency ? 'sm' : 'md'}
      className={!reducedMotion ? 'hover:shadow-lg transition-shadow' : ''}
    >
      <h3 className="text-lg font-semibold text-white mb-2">
        Accessible Card
      </h3>
      <p className="text-gray-100 text-sm">
        This card respects user accessibility preferences for transparency, contrast, and motion.
      </p>
      {reducedTransparency && (
        <p className="mt-2 text-xs text-yellow-300">
          Note: Transparency has been reduced based on your system settings.
        </p>
      )}
    </GlassmorphicCard>
  );
}
```

### Example 8: Full Page Layout

```jsx
import GlassmorphicNavbar from '@/components/glassmorphism/GlassmorphicNavbar';
import GlassmorphicCard from '@/components/glassmorphism/GlassmorphicCard';
import GlassmorphicButton from '@/components/glassmorphism/GlassmorphicButton';

export default function HomePage() {
  return (
    <div className="
      min-h-screen
      bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900
      relative overflow-hidden
    ">
      {/* Animated background blobs */}
      <div className="
        absolute -top-40 -right-40 w-80 h-80
        bg-purple-500 rounded-full mix-blend-multiply
        filter blur-3xl opacity-20 animate-blob
      " />
      <div className="
        absolute -bottom-40 -left-40 w-80 h-80
        bg-blue-500 rounded-full mix-blend-multiply
        filter blur-3xl opacity-20 animate-blob
        animation-delay-2000
      " />

      {/* Navigation */}
      <GlassmorphicNavbar logo="MyApp" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-16">
            <h1 className="
              text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6
              bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400
              bg-clip-text text-transparent
            ">
              Welcome to Glassmorphism
            </h1>
            <p className="
              text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto
              leading-relaxed
            ">
              Create beautiful, modern interfaces with glassmorphic design patterns.
              Optimized for performance and accessibility.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <GlassmorphicButton variant="primary" size="lg">
              Get Started
            </GlassmorphicButton>
            <GlassmorphicButton variant="secondary" size="lg">
              Learn More
            </GlassmorphicButton>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                title: 'Modern Design',
                desc: 'Beautiful frosted glass effects',
              },
              {
                title: 'Accessible',
                desc: 'WCAG compliant and user-friendly',
              },
              {
                title: 'Performant',
                desc: 'Optimized for all devices',
              },
            ].map((feature, idx) => (
              <GlassmorphicCard key={idx} variant="light" blur="md">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-100 text-sm">
                  {feature.desc}
                </p>
              </GlassmorphicCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## CSS Class Usage

### Direct CSS Classes

```html
<!-- Basic glass effect -->
<div class="glass">
  Content goes here
</div>

<!-- Light variant -->
<div class="glass-light">
  Light glass content
</div>

<!-- Dark variant -->
<div class="glass-dark">
  Dark glass content
</div>

<!-- Interactive glass -->
<div class="glass-interactive">
  Hover for interactive effect
</div>

<!-- Card with padding and border-radius -->
<div class="glass-card">
  <h2>Card Title</h2>
  <p>Card content</p>
</div>

<!-- Glass with gradient border -->
<div class="glass-gradient-border">
  Gradient border effect
</div>
```

### Tailwind Utilities

```html
<!-- Basic setup with utility classes -->
<div class="
  bg-white/10 backdrop-blur-md border border-white/20 rounded-xl
  hover:bg-white/20 hover:border-white/30
  transition-all duration-300
  p-6
">
  Content with Tailwind utilities
</div>

<!-- Mobile responsive -->
<div class="
  sm:backdrop-blur-sm md:backdrop-blur-md lg:backdrop-blur-lg
  sm:p-4 md:p-6 lg:p-8
  sm:rounded-lg md:rounded-xl lg:rounded-2xl
">
  Mobile responsive glass
</div>

<!-- With custom background opacity -->
<div class="
  bg-white/5 sm:bg-white/10 md:bg-white/15
  backdrop-blur-md border border-white/20
  rounded-xl p-6
">
  Responsive opacity
</div>
```

---

## Performance Tips

### 1. Limit Elements
```jsx
// Good: Use glassmorphism sparingly
<div className="grid grid-cols-3 gap-6">
  <GlassmorphicCard>Featured Card 1</GlassmorphicCard>
  <GlassmorphicCard>Featured Card 2</GlassmorphicCard>
  <GlassmorphicCard>Featured Card 3</GlassmorphicCard>
</div>

// Avoid: Too many glass elements
<div>
  {items.map(item => (
    <div key={item.id} className="glass">
      {/* This creates performance issues */}
    </div>
  ))}
</div>
```

### 2. Reduce Blur on Mobile
```jsx
import { useMediaQuery } from 'react-responsive';

export function ResponsiveGlass() {
  const isMobile = useMediaQuery({ maxWidth: '640px' });

  return (
    <div className={`
      ${isMobile ? 'backdrop-blur-sm' : 'backdrop-blur-md'}
      bg-white/10 border border-white/20 rounded-lg p-6
    `}>
      Content
    </div>
  );
}
```

### 3. GPU Acceleration
```jsx
// Apply GPU acceleration for animated glass
<div className="glass-optimized transform translateZ-0">
  Optimized glass content
</div>
```

---

## Accessibility Best Practices

### 1. Color Contrast
```jsx
// Good: Add overlay for text contrast
<div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
  <div className="bg-black/20 rounded p-4 -m-4 mb-2">
    <h2 className="text-white font-bold">Title</h2>
  </div>
  <p className="text-gray-100">Content with good contrast</p>
</div>
```

### 2. Semantic HTML
```jsx
// Always use proper semantic elements
<article className="glass-card">
  <h2>Article Title</h2>
  <p>Article content</p>
  <button aria-label="Read more">Learn More</button>
</article>
```

### 3. Focus States
```jsx
// Include visible focus rings
<button className="
  glass px-4 py-2 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-white
">
  Interactive Element
</button>
```

---

## Browser Compatibility Handling

### Feature Detection
```jsx
import useBackdropFilterSupport from '@/hooks/useBackdropFilterSupport';

export function SmartGlass() {
  const { isSupported } = useBackdropFilterSupport();

  return (
    <div className={isSupported ? 'glass' : 'glass-fallback'}>
      Content adapts based on browser support
    </div>
  );
}
```

### CSS @supports Query
```css
/* Use @supports for progressive enhancement */
@supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.25);
  }
}

@supports not ((backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px))) {
  .glass {
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
}
```

---

## Dark Mode Support

```jsx
// Use Tailwind dark mode
export function ThemedGlass() {
  return (
    <div className="
      light:bg-white/10 light:border-white/20
      dark:bg-gray-900/10 dark:border-white/10
      backdrop-blur-md rounded-lg p-6
    ">
      Content with theme support
    </div>
  );
}
```

---

## Animation Examples

### Fade In Animation
```jsx
<div className="
  bg-white/10 backdrop-blur-md rounded-lg p-6
  animate-glass-fade
">
  Content fades in with glass blur effect
</div>
```

### Slide In Animation
```jsx
<div className="
  bg-white/10 backdrop-blur-md rounded-lg p-6
  animate-glass-slide-in
">
  Content slides in from top
</div>
```

---

## Testing Recommendations

### Visual Testing
- Test on Chrome, Firefox, Safari, Edge
- Test on desktop, tablet, mobile
- Test with various background images/colors

### Accessibility Testing
- Use WAVE or Axe DevTools
- Test with screen readers (NVDA, VoiceOver)
- Test keyboard navigation (Tab, Enter, Escape)
- Check color contrast with WebAIM Contrast Checker

### Performance Testing
- Use Chrome DevTools Performance tab
- Monitor FPS with 60fps target
- Check bundle size impact
- Test on low-end devices

---

## Common Issues & Solutions

### Issue: Text Hard to Read
**Solution**: Add background overlay behind text
```jsx
<div className="bg-black/20 rounded p-4">
  <p className="text-white">Text with contrast overlay</p>
</div>
```

### Issue: Performance Degradation
**Solution**: Reduce blur on mobile and limit elements
```jsx
<div className="
  sm:backdrop-blur-sm md:backdrop-blur-md
  max-w-md rounded-lg p-6
">
  Performance-optimized glass
</div>
```

### Issue: Firefox No Blur
**Solution**: Use fallback styling via @-moz-document or feature detection
```jsx
const { isSupported } = useBackdropFilterSupport();
// Render fallback for unsupported browsers
```

---

## Next Steps

1. Copy component files to your project
2. Update tailwind.config.js with the provided configuration
3. Import glassmorphism.css in your global styles
4. Use components in your pages and layouts
5. Test on various devices and browsers
6. Adjust opacity and blur values for your design
7. Ensure accessibility compliance with your designs
