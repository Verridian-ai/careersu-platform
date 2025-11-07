# Contributing to CareerSU

Thank you for your interest in contributing to CareerSU! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- A code editor (VS Code recommended)
- OpenAI API key for testing AI features

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/careersu-platform.git
   cd careersu-platform
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/your-org/careersu-platform.git
   ```

### Setup Development Environment

```bash
# Install dependencies
npm install

# Initialize Convex
npx convex dev

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

---

## 🔄 Development Process

### 1. Create a Feature Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

Examples:
- `feature/add-job-alerts`
- `fix/resume-export-bug`
- `docs/update-api-reference`

### 2. Make Your Changes

- Write clean, readable code
- Follow our [coding standards](#coding-standards)
- Add tests for new features
- Update documentation as needed
- Keep commits focused and atomic

### 3. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <subject>

git commit -m "feat(documents): add PDF export functionality"
git commit -m "fix(auth): resolve login redirect issue"
git commit -m "docs(readme): update installation instructions"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Open a Pull Request

1. Go to the [original repository](https://github.com/your-org/careersu-platform)
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template
5. Submit the pull request

---

## 🎯 Pull Request Process

### Before Submitting

- [ ] Code builds without errors (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] TypeScript has no errors (`npm run type-check`)
- [ ] Code follows our style guide
- [ ] Documentation is updated
- [ ] Changelog is updated (for significant changes)
- [ ] Screenshots included (for UI changes)

### PR Template

When you open a PR, please include:

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Tested on mobile devices

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Process

1. **Automated Checks**: CI/CD runs tests and builds
2. **Code Review**: Maintainers review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, PR will be merged

### After Your PR is Merged

```bash
# Update your main branch
git checkout main
git pull upstream main

# Delete your feature branch
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

## 💻 Coding Standards

### TypeScript

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

function updateProfile(profile: UserProfile): Promise<void> {
  // Implementation
}

// ❌ Bad
function updateProfile(profile: any) {
  // Using 'any' type
}
```

### React Components

```typescript
// ✅ Good
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary'
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant}`}
      aria-label="Action button"
    >
      {children}
    </button>
  );
};
```

### File Organization

```
src/
├── components/
│   ├── ui/              # Generic UI components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   └── features/        # Feature-specific components
│       └── jobs/
│           └── JobCard.tsx
├── pages/              # Route pages
├── hooks/              # Custom hooks
├── lib/                # Utilities
└── types/              # TypeScript types
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)
- **Types/Interfaces**: PascalCase (`UserProfile`)

### Code Style

```typescript
// Use functional components
const MyComponent: React.FC<Props> = () => {
  // Hooks at the top
  const [state, setState] = useState();
  const { data } = useQuery();

  // Event handlers
  const handleClick = () => {
    // Implementation
  };

  // Early returns for conditions
  if (!data) return <LoadingSpinner />;

  // JSX
  return <div>{/* ... */}</div>;
};

// Use meaningful variable names
const isUserAuthenticated = checkAuth(); // ✅ Good
const flag = checkAuth();                 // ❌ Bad

// Use destructuring
const { name, email } = user;  // ✅ Good
const name = user.name;        // ❌ Acceptable but verbose

// Use optional chaining
const userName = user?.profile?.name; // ✅ Good
```

---

## 🧪 Testing Guidelines

### Writing Tests

```typescript
// Button.test.tsx
import { render, screen, userEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Test Coverage

- Aim for **80%+ coverage** for critical paths
- All new features must include tests
- Bug fixes should include regression tests

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Specific file
npm test Button.test.tsx
```

---

## 📚 Documentation

### Code Comments

```typescript
// ✅ Good: Explain WHY, not WHAT
// We need to debounce to avoid excessive API calls
// during rapid user input
const debouncedSearch = useMemo(
  () => debounce(searchJobs, 300),
  []
);

// ❌ Bad: States the obvious
// This function searches for jobs
function searchJobs() { }
```

### JSDoc for Public APIs

```typescript
/**
 * Optimizes a resume document using AI analysis
 *
 * @param documentId - ID of the document to optimize
 * @param targetJobId - Optional job ID to tailor the optimization
 * @returns Promise with optimization suggestions
 * @throws {Error} If document is not found
 *
 * @example
 * const suggestions = await optimizeResume('doc_123', 'job_456');
 */
export async function optimizeResume(
  documentId: string,
  targetJobId?: string
): Promise<OptimizationResult> {
  // Implementation
}
```

### README Updates

Update README.md if you:
- Add a new feature
- Change installation steps
- Modify configuration
- Update dependencies

---

## 🐛 Bug Reports

When filing a bug report, include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**:
   ```
   1. Go to '...'
   2. Click on '...'
   3. Scroll down to '...'
   4. See error
   ```
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Screenshots**: If applicable
6. **Environment**:
   - OS: [e.g., macOS 14.0]
   - Browser: [e.g., Chrome 120]
   - Node version: [e.g., 18.17.0]
7. **Additional Context**: Any other relevant information

---

## 💡 Feature Requests

When suggesting a feature:

1. **Problem Statement**: What problem does this solve?
2. **Proposed Solution**: How would you solve it?
3. **Alternatives**: Other solutions you've considered
4. **Additional Context**: Screenshots, mockups, examples

---

## 🌍 Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and ideas
- **Discord**: Real-time chat (link in README)
- **Email**: team@careersu.com

### Getting Help

1. Check existing documentation
2. Search existing issues
3. Ask in GitHub Discussions
4. Join our Discord

### Recognition

Contributors are recognized in:
- [CONTRIBUTORS.md](CONTRIBUTORS.md)
- Release notes
- Project README

---

## 📝 Licensing

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## ❓ Questions?

If you have questions about contributing, please:

1. Check this guide
2. Review [Developer Guide](DEVELOPER_GUIDE.md)
3. Ask in GitHub Discussions
4. Email team@careersu.com

Thank you for contributing to CareerSU! 🎉
