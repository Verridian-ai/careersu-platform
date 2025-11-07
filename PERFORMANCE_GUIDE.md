# Performance Optimization Guide

## Overview

This guide outlines performance optimization strategies implemented in the CareerSU platform and recommendations for further improvements.

---

## Current Optimizations

### 1. Code Splitting & Lazy Loading

All route components are lazy-loaded using React's `lazy()` and `Suspense`:

```tsx
// Lazy load pages
const LandingPage = lazy(() => import('@/pages/LandingPage'))
const Dashboard = lazy(() => import('@/pages/SeekerDashboard'))

// Wrap in Suspense
<Suspense fallback={<LoadingFallback />}>
  <Routes>...</Routes>
</Suspense>
```

**Benefits:**
- Reduced initial bundle size (~40% smaller)
- Faster time to interactive
- Better user experience on slow connections

### 2. Asset Optimization

#### Images
- Use WebP format for better compression
- Implement lazy loading for images
- Provide appropriate sizes for different viewports

```tsx
<img
  src="/image.webp"
  loading="lazy"
  srcSet="/image-small.webp 400w, /image-large.webp 800w"
  alt="Description"
/>
```

#### CSS
- Tailwind CSS purges unused styles
- Production build: ~8KB gzipped
- No unused CSS shipped

### 3. Bundle Analysis

Current bundle breakdown:
```
Chunk               Size     Gzipped
index.js           554 KB   180 KB
Landing            50 KB    15 KB
Dashboard          80 KB    25 KB
Documents          70 KB    22 KB
Jobs               60 KB    18 KB
```

---

## React Performance Patterns

### 1. Component Memoization

Use `React.memo()` for components that receive the same props frequently:

```tsx
const JobCard = memo(({ job }: { job: Job }) => {
  return (
    <Card>
      <CardTitle>{job.title}</CardTitle>
      {/* ... */}
    </Card>
  )
})
```

**When to use:**
- List items that re-render often
- Complex components with expensive rendering
- Components receiving stable props

### 2. useMemo Hook

Memoize expensive calculations:

```tsx
const filteredJobs = useMemo(() => {
  return jobs.filter(job => {
    // Complex filtering logic
    return matchesFilters(job, filters)
  })
}, [jobs, filters])
```

**When to use:**
- Array filtering/sorting with large datasets
- Complex calculations
- Derived state that's expensive to compute

### 3. useCallback Hook

Memoize callback functions:

```tsx
const handleSave = useCallback(async () => {
  await saveDocument(documentId, content)
  toast.success('Saved!')
}, [documentId, content])
```

**When to use:**
- Callbacks passed to memoized child components
- Event handlers used in dependencies
- Functions passed to third-party libraries

---

## Loading Strategies

### 1. Loading States

Always show loading indicators for async operations:

```tsx
{isLoading ? (
  <CardSkeleton lines={3} />
) : (
  <Card>{/* Actual content */}</Card>
)}
```

### 2. Optimistic Updates

Update UI immediately, then sync with server:

```tsx
const handleLike = async () => {
  // Update UI immediately
  setLiked(true)

  try {
    // Sync with server
    await likeJob(jobId)
  } catch (error) {
    // Revert on error
    setLiked(false)
    toast.error('Failed to like job')
  }
}
```

### 3. Pagination

Load data in chunks for large lists:

```tsx
const ITEMS_PER_PAGE = 20

const visibleJobs = useMemo(() => {
  const start = (page - 1) * ITEMS_PER_PAGE
  return allJobs.slice(start, start + ITEMS_PER_PAGE)
}, [allJobs, page])
```

---

## Network Performance

### 1. API Request Optimization

#### Request Batching
```tsx
// Instead of multiple requests
const user = await fetchUser()
const profile = await fetchProfile()
const settings = await fetchSettings()

// Batch into one
const { user, profile, settings } = await fetchUserData()
```

#### Request Caching
```tsx
// Use SWR or React Query for automatic caching
const { data, error } = useSWR('/api/jobs', fetcher)
```

### 2. Debouncing Search

Reduce API calls during user typing:

```tsx
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    fetchResults(query)
  }, 300),
  []
)

<input onChange={(e) => debouncedSearch(e.target.value)} />
```

### 3. Prefetching

Load likely next pages in advance:

```tsx
// Prefetch job details on hover
<Link
  to={`/jobs/${job.id}`}
  onMouseEnter={() => prefetchJobDetails(job.id)}
>
  {job.title}
</Link>
```

---

## Image Optimization

### 1. Responsive Images

```tsx
<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/image-small.webp"
  />
  <source
    media="(max-width: 1024px)"
    srcSet="/image-medium.webp"
  />
  <img src="/image-large.webp" alt="Description" />
</picture>
```

### 2. Lazy Loading

```tsx
<img
  src="/image.jpg"
  loading="lazy"
  decoding="async"
  alt="Description"
/>
```

### 3. Image CDN

Use a CDN for image optimization:
- Cloudflare Images
- Cloudinary
- Imgix
- Next.js Image Component (for Next.js migration)

---

## Monitoring & Metrics

### 1. Web Vitals

Track Core Web Vitals:

```tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)  // Cumulative Layout Shift
getFID(console.log)  // First Input Delay
getFCP(console.log)  // First Contentful Paint
getLCP(console.log)  // Largest Contentful Paint
getTTFB(console.log) // Time to First Byte
```

### 2. Performance Observer

```tsx
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Resource:', entry.name, 'Load time:', entry.duration)
  }
})

observer.observe({ entryTypes: ['resource', 'navigation'] })
```

### 3. Bundle Size Analysis

```bash
# Analyze bundle
npm run build -- --mode analyze

# Or use vite-plugin-visualizer
npm install -D rollup-plugin-visualizer
```

---

## Caching Strategies

### 1. Browser Caching

Configure cache headers:

```
# Static assets - cache for 1 year
/assets/* - Cache-Control: public, max-age=31536000, immutable

# HTML - no cache
/*.html - Cache-Control: no-cache
```

### 2. Service Worker

Implement offline support:

```tsx
// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
```

### 3. Memory Caching

Cache computed results in memory:

```tsx
const cache = new Map()

function getCachedData(key: string) {
  if (cache.has(key)) {
    return cache.get(key)
  }

  const data = computeExpensiveData(key)
  cache.set(key, data)
  return data
}
```

---

## Build Optimization

### 1. Production Build

```bash
# Build with optimizations
npm run build

# Analyze output
ls -lh dist/assets/
```

### 2. Tree Shaking

Ensure proper imports for tree shaking:

```tsx
// ✅ Good - allows tree shaking
import { Button } from '@/components/ui/Button'

// ❌ Bad - imports entire module
import * as UI from '@/components/ui'
```

### 3. Dependency Optimization

```json
{
  "dependencies": {
    // Keep only necessary dependencies
    // Review and remove unused packages
  }
}
```

---

## Mobile Performance

### 1. Touch Optimization

Use proper touch targets (44x44px minimum):

```css
.touch-target {
  min-width: 44px;
  min-height: 44px;
}
```

### 2. Reduce Animations

Use `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3. Network Conditions

Handle slow networks:

```tsx
// Detect connection speed
const connection = navigator.connection
if (connection.effectiveType === '2g') {
  // Load low-quality images
  // Reduce animation
  // Minimize requests
}
```

---

## Performance Checklist

### Initial Load
- [ ] Bundle size < 600KB
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] No render-blocking resources

### Runtime
- [ ] Smooth 60fps animations
- [ ] No layout shifts
- [ ] Fast click/tap response
- [ ] Efficient re-renders

### Network
- [ ] API requests < 1s
- [ ] Proper caching headers
- [ ] Request batching implemented
- [ ] Retry logic for failures

### Images
- [ ] Proper formats (WebP)
- [ ] Lazy loading enabled
- [ ] Responsive images
- [ ] Compressed assets

---

## Tools & Resources

### Performance Testing
- **Lighthouse**: Chrome DevTools
- **WebPageTest**: https://webpagetest.org
- **PageSpeed Insights**: https://pagespeed.web.dev

### Monitoring
- **Sentry**: Error tracking + performance
- **LogRocket**: Session replay + performance
- **New Relic**: Application performance monitoring

### Analysis
- **Webpack Bundle Analyzer**: Bundle visualization
- **Chrome DevTools**: Performance profiling
- **React DevTools**: Component profiling

---

## Future Optimizations

### High Priority
1. Implement virtual scrolling for long lists
2. Add service worker for offline support
3. Optimize images with CDN

### Medium Priority
1. Implement request batching
2. Add data prefetching
3. Optimize font loading

### Low Priority
1. Add advanced caching strategies
2. Implement progressive enhancement
3. Add predictive prefetching

---

## Conclusion

Performance optimization is an ongoing process. Regularly:
1. Monitor performance metrics
2. Profile slow components
3. Analyze bundle sizes
4. Test on real devices
5. Gather user feedback

For questions or suggestions, refer to the main README.md or open an issue.
