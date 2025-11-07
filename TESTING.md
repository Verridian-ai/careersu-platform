# Testing Guide for CareerSU Platform

## Overview

This document outlines the testing strategy and setup for the CareerSU platform. We use a combination of unit tests, integration tests, and manual testing to ensure code quality.

## Testing Stack

### Recommended Tools
- **Vitest**: Fast unit test framework (recommended for Vite projects)
- **React Testing Library**: For testing React components
- **MSW (Mock Service Worker)**: For mocking API requests
- **Playwright** or **Cypress**: For E2E testing

## Setup Instructions

### 1. Install Testing Dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npm install -D @vitest/ui @vitest/coverage-v8
```

### 2. Create Vitest Config

Create `vitest.config.ts` in the root directory (example provided in this repo).

### 3. Update package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## Test Structure

```
src/
├── __tests__/           # Test files
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── utils/          # Test utilities and helpers
├── components/
│   └── __tests__/      # Component-specific tests
└── lib/
    └── __tests__/      # Library/utility tests
```

## Writing Tests

### Example: Component Test

```tsx
// src/components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Button from '../ui/Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByText('Click me'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button loading>Save</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Example: Validation Test

```tsx
// src/lib/validations/__tests__/auth.test.ts
import { describe, it, expect } from 'vitest'
import { loginSchema } from '../auth'

describe('Login Validation', () => {
  it('validates correct login data', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })
})
```

### Example: Hook Test

```tsx
// src/hooks/__tests__/useToast.test.ts
import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useToast } from '../useToast'

describe('useToast Hook', () => {
  it('provides toast methods', () => {
    const { result } = renderHook(() => useToast())

    expect(result.current).toHaveProperty('success')
    expect(result.current).toHaveProperty('error')
    expect(result.current).toHaveProperty('warning')
    expect(result.current).toHaveProperty('info')
  })
})
```

## Testing Best Practices

### 1. Follow AAA Pattern
- **Arrange**: Set up test data and conditions
- **Act**: Execute the code being tested
- **Assert**: Verify the results

### 2. Test User Behavior
```tsx
// ❌ Don't test implementation details
expect(component.state.isOpen).toBe(true)

// ✅ Test what users see and do
expect(screen.getByRole('dialog')).toBeVisible()
```

### 3. Use Accessible Queries
```tsx
// ✅ Prefer accessible queries
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email/i)

// ❌ Avoid fragile queries
screen.getByClassName('submit-btn')
screen.getByTestId('email-input')
```

### 4. Mock External Dependencies
```tsx
import { vi } from 'vitest'

// Mock API calls
vi.mock('@/lib/api', () => ({
  fetchUser: vi.fn(() => Promise.resolve({ id: 1, name: 'Test' }))
}))
```

### 5. Clean Up After Tests
```tsx
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
```

## Coverage Goals

Aim for the following coverage targets:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

Priority areas for testing:
1. Form validation logic
2. Authentication flows
3. Data transformation utilities
4. Critical user interactions
5. Error handling

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- src/components/__tests__/Button.test.tsx
```

## Continuous Integration

Tests should run automatically on:
- Every pull request
- Before merging to main branch
- Before deployment to production

Example GitHub Actions workflow:
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

## Manual Testing Checklist

### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout functionality
- [ ] Session persistence
- [ ] Password reset flow

### Documents
- [ ] Create new document
- [ ] Edit existing document
- [ ] Delete document
- [ ] Search documents
- [ ] Filter by type/status
- [ ] Export document

### Jobs
- [ ] Browse job listings
- [ ] Filter jobs
- [ ] Save job
- [ ] Apply for job
- [ ] View application status

### Responsive Design
- [ ] Mobile view (< 640px)
- [ ] Tablet view (640px - 1024px)
- [ ] Desktop view (> 1024px)
- [ ] Touch interactions work properly

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators visible
- [ ] ARIA labels present

### Performance
- [ ] Page load time < 3 seconds
- [ ] No console errors
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] Optimized images

## Debugging Tests

### Common Issues

1. **Component not rendering**
   - Check if all required props are provided
   - Verify imports are correct
   - Ensure dependencies are mocked

2. **Async operations timeout**
   - Use `waitFor` for async updates
   - Increase timeout if needed
   - Check if promises resolve/reject correctly

3. **Element not found**
   - Verify element is actually rendered
   - Use `screen.debug()` to see DOM
   - Check if element is conditionally rendered

### Useful Commands

```tsx
// Debug rendered output
screen.debug()

// Wait for element to appear
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// Find all elements
screen.getAllByRole('button')

// Check what queries are available
screen.logTestingPlaygroundURL()
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [MSW Documentation](https://mswjs.io/)

## Next Steps

1. Set up Vitest configuration
2. Add test scripts to package.json
3. Write tests for critical components
4. Set up CI/CD pipeline
5. Monitor and improve coverage over time
