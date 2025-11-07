# Developer Guide

## Welcome

This guide will help you set up your development environment, understand the codebase, and start contributing to CareerSU.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Common Tasks](#common-tasks)
- [Debugging](#debugging)
- [Testing](#testing)
- [Code Style](#code-style)
- [Git Workflow](#git-workflow)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

1. **Node.js** (v20+)
   ```bash
   # Check version
   node --version

   # Install via nvm (recommended)
   nvm install 20
   nvm use 20
   ```

2. **npm** (v10+)
   ```bash
   # Check version
   npm --version

   # Update npm
   npm install -g npm@latest
   ```

3. **Git** (v2.30+)
   ```bash
   # Check version
   git --version

   # Install from https://git-scm.com/
   ```

### Recommended Tools

1. **VS Code** - Code editor
   - Extensions:
     - ESLint
     - Prettier
     - Tailwind CSS IntelliSense
     - TypeScript and JavaScript Language Features
     - Convex

2. **Chrome DevTools** - For debugging

3. **Postman** or **Insomnia** - API testing (optional)

### Accounts Needed

1. **OpenAI** - For AI features
   - Sign up: https://platform.openai.com/signup
   - Get API key: https://platform.openai.com/api-keys

2. **Convex** (optional for deployment)
   - Sign up: https://dashboard.convex.dev/
   - Free tier available

3. **Clerk** (optional, for production auth)
   - Sign up: https://clerk.com/

---

## Quick Start

### 1. Clone Repository

```bash
# Clone via SSH (recommended)
git clone git@github.com:your-org/careersu-platform.git

# Or via HTTPS
git clone https://github.com/your-org/careersu-platform.git

# Navigate to directory
cd careersu-platform
```

### 2. Install Dependencies

```bash
# Install all packages
npm install

# This installs:
# - Frontend dependencies (React, Vite, Tailwind, etc.)
# - Backend dependencies (Convex, OpenAI, etc.)
# - Dev dependencies (Vitest, ESLint, TypeScript, etc.)
```

### 3. Set Up Environment Variables

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your keys
nano .env.local
```

**Required variables:**

```env
# OpenAI API Key (required for AI features)
VITE_OPENAI_API_KEY=sk-...

# Convex Deployment URL (auto-generated on first run)
VITE_CONVEX_URL=https://...

# Clerk Keys (optional, for production auth)
VITE_CLERK_PUBLISHABLE_KEY=pk_...
```

### 4. Initialize Convex

```bash
# Start Convex development server
npx convex dev

# This will:
# 1. Create a new Convex project (first time)
# 2. Push your schema to Convex
# 3. Generate TypeScript types
# 4. Start real-time sync
# 5. Print your VITE_CONVEX_URL
```

**Copy the URL to `.env.local`:**
```env
VITE_CONVEX_URL=https://your-deployment-url.convex.cloud
```

### 5. Start Development Server

```bash
# In a new terminal tab
npm run dev

# Opens browser at http://localhost:5173
```

### 6. Verify Setup

1. **Frontend**: Navigate to http://localhost:5173
2. **Backend**: Open Convex dashboard at https://dashboard.convex.dev/
3. **Test Login**: Use demo account (email: `demo@example.com`, password: `password123`)

**You're ready to develop!**

---

## Project Structure

```
careersu-platform/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── ui/            # Base UI components (Button, Card, etc.)
│   │   ├── layout/        # Layout components (Navigation, Footer)
│   │   ├── features/      # Feature-specific components
│   │   └── ErrorBoundary.tsx
│   ├── pages/             # Route pages
│   │   ├── LandingPage.tsx
│   │   ├── SeekerDashboard.tsx
│   │   ├── DocumentsPage.tsx
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   ├── useConvex.ts   # Convex data hooks
│   │   ├── useAIChat.ts   # AI feature hooks
│   │   └── useToast.ts
│   ├── lib/               # Utility libraries
│   │   ├── convex.ts      # Convex client
│   │   ├── ai/            # AI utilities
│   │   ├── validations/   # Zod schemas
│   │   └── utils.ts
│   ├── types/             # TypeScript types
│   ├── __tests__/         # Test files
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── convex/                # Backend (Convex functions)
│   ├── schema.ts          # Database schema
│   ├── auth.ts            # Authentication
│   ├── users.ts           # User management
│   ├── documents.ts       # Document CRUD
│   ├── jobs.ts            # Job listings
│   ├── applications.ts    # Applications
│   ├── chat.ts            # Chat messages
│   ├── embeddings.ts      # Vector embeddings
│   ├── rag.ts             # RAG retrieval
│   ├── ai.ts              # LLM integration
│   └── _generated/        # Auto-generated types
├── public/                # Static assets
├── docs/                  # Additional documentation
├── .env.local             # Environment variables (not in git)
├── .env.example           # Example env file
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config
├── tailwind.config.js     # Tailwind config
├── vitest.config.ts       # Test config
└── README.md              # Project overview
```

### Key Directories

**`src/components/ui/`**
- Base UI primitives (Button, Card, Input, etc.)
- Fully accessible with ARIA attributes
- Mobile-friendly with glassmorphism design

**`src/pages/`**
- One component per route
- Lazy-loaded for performance
- Use Convex hooks for data

**`src/hooks/`**
- `useConvex.ts`: All Convex data hooks (30+ hooks)
- `useAIChat.ts`: AI feature hooks (chat, resume optimization, etc.)
- Custom hooks follow `use*` naming convention

**`convex/`**
- Backend functions (queries, mutations)
- Database schema definition
- RAG system implementation

---

## Development Workflow

### Typical Development Flow

1. **Start Convex** (terminal 1)
   ```bash
   npx convex dev
   # Keeps schema synced, generates types
   ```

2. **Start Vite** (terminal 2)
   ```bash
   npm run dev
   # Frontend dev server with HMR
   ```

3. **Make Changes**
   - Edit files in `src/` for frontend
   - Edit files in `convex/` for backend
   - Changes auto-reload (no restart needed)

4. **Test Changes**
   - UI updates instantly (HMR)
   - Backend changes push automatically
   - Test in browser at http://localhost:5173

5. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/your-branch
   ```

### Hot Module Replacement (HMR)

**Vite HMR:**
- Changes to React components reload instantly
- State is preserved when possible
- No page refresh needed

**Convex Live Reload:**
- Backend function changes push automatically
- Schema changes validated in real-time
- Types regenerated on save

---

## Common Tasks

### Adding a New Page

1. **Create page component:**
   ```bash
   touch src/pages/NewPage.tsx
   ```

2. **Implement component:**
   ```typescript
   import { useQuery } from 'convex/react';
   import { api } from '@/convex/_generated/api';

   export default function NewPage() {
     const data = useQuery(api.yourFunction.get);

     if (data === undefined) return <div>Loading...</div>;

     return <div>{/* Your UI */}</div>;
   }
   ```

3. **Add route in `App.tsx`:**
   ```typescript
   const NewPage = lazy(() => import('./pages/NewPage'));

   // In routes
   <Route path="/new-page" element={<NewPage />} />
   ```

### Adding a New Backend Function

1. **Edit Convex file** (e.g., `convex/users.ts`):
   ```typescript
   import { query } from "./_generated/server";
   import { v } from "convex/values";

   export const getUser = query({
     args: { userId: v.id("users") },
     handler: async (ctx, args) => {
       return await ctx.db.get(args.userId);
     },
   });
   ```

2. **Use in frontend:**
   ```typescript
   import { useQuery } from 'convex/react';
   import { api } from '@/convex/_generated/api';

   const user = useQuery(api.users.getUser, { userId });
   ```

3. **Types are auto-generated** - No manual typing needed!

### Adding a Database Table

1. **Edit `convex/schema.ts`:**
   ```typescript
   export default defineSchema({
     // Existing tables...

     newTable: defineTable({
       name: v.string(),
       description: v.string(),
       createdAt: v.number(),
     })
     .index("by_name", ["name"]),
   });
   ```

2. **Convex will validate and push schema automatically**

3. **Use in functions:**
   ```typescript
   // Insert
   await ctx.db.insert("newTable", {
     name: "Example",
     description: "Description",
     createdAt: Date.now(),
   });

   // Query
   const items = await ctx.db
     .query("newTable")
     .withIndex("by_name", (q) => q.eq("name", "Example"))
     .collect();
   ```

### Adding a New UI Component

1. **Create component file:**
   ```bash
   touch src/components/ui/NewComponent.tsx
   ```

2. **Implement component:**
   ```typescript
   interface NewComponentProps {
     title: string;
     onClick?: () => void;
   }

   export function NewComponent({ title, onClick }: NewComponentProps) {
     return (
       <button onClick={onClick} className="...">
         {title}
       </button>
     );
   }
   ```

3. **Export from index (if needed):**
   ```typescript
   // src/components/ui/index.ts
   export { NewComponent } from './NewComponent';
   ```

### Adding a Form with Validation

1. **Create Zod schema** (`src/lib/validations/`):
   ```typescript
   import { z } from 'zod';

   export const newFormSchema = z.object({
     name: z.string().min(2, "Name must be at least 2 characters"),
     email: z.string().email("Invalid email"),
   });

   export type NewFormData = z.infer<typeof newFormSchema>;
   ```

2. **Use in component:**
   ```typescript
   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { newFormSchema, type NewFormData } from '@/lib/validations/newForm';

   function MyForm() {
     const form = useForm<NewFormData>({
       resolver: zodResolver(newFormSchema),
     });

     const onSubmit = (data: NewFormData) => {
       console.log(data); // Fully typed and validated!
     };

     return <form onSubmit={form.handleSubmit(onSubmit)}>{/* ... */}</form>;
   }
   ```

### Adding Environment Variables

1. **Add to `.env.local`:**
   ```env
   VITE_NEW_API_KEY=your-key-here
   ```

2. **Use in code:**
   ```typescript
   const apiKey = import.meta.env.VITE_NEW_API_KEY;
   ```

3. **Add to `.env.example` for documentation:**
   ```env
   VITE_NEW_API_KEY=your-key-here
   ```

**Note:** Environment variables must start with `VITE_` to be accessible in frontend.

---

## Debugging

### Frontend Debugging

**Chrome DevTools:**
1. Open DevTools (F12)
2. Sources tab → Select file → Set breakpoints
3. Refresh page → Debugger pauses

**Console Logging:**
```typescript
console.log('Debug:', data);
console.error('Error:', error);
console.table(arrayOfObjects);
```

**React DevTools:**
1. Install extension: [React DevTools](https://react.dev/learn/react-developer-tools)
2. Inspect component props/state
3. Profile performance

### Backend Debugging

**Convex Dashboard:**
1. Open dashboard: `npx convex dashboard`
2. View function logs in real-time
3. Inspect database queries
4. Monitor performance

**Console Logging:**
```typescript
// In Convex functions
export const myFunction = query({
  handler: async (ctx, args) => {
    console.log('Args:', args); // Shows in Convex logs
    // ...
  }
});
```

**Error Handling:**
```typescript
try {
  // Your code
} catch (error) {
  console.error('Error in myFunction:', error);
  throw new Error('User-friendly error message');
}
```

### Common Issues

**"Module not found" error:**
- Check import path spelling
- Ensure file exists
- Restart dev server

**"Type error" in TypeScript:**
- Check Convex generated types: `convex/_generated/`
- Restart Convex dev server
- Run `npm run typecheck`

**"Convex function not found":**
- Ensure function is exported
- Check file is in `convex/` directory
- Restart Convex dev server

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for specific file
npm test -- Button.test.tsx
```

### Writing Tests

**Component Test Example:**

```typescript
// src/components/__tests__/Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ui/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**Hook Test Example:**

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useToast } from '@/hooks/useToast';

describe('useToast', () => {
  it('shows toast', () => {
    const { result } = renderHook(() => useToast());

    result.current.toast({
      title: 'Success',
      description: 'It worked!',
    });

    // Assert toast was shown
  });
});
```

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical user flows
- **E2E Tests**: Main user journeys (planned)

---

## Code Style

### TypeScript

**Follow these conventions:**

```typescript
// Good: Explicit return types for functions
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Good: Interface for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// Good: Type for unions
type Status = 'pending' | 'completed' | 'failed';

// Good: Const assertions for literals
const COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
} as const;
```

### React

**Functional components with hooks:**

```typescript
// Good: Named function export
export function UserProfile({ userId }: { userId: string }) {
  const user = useQuery(api.users.getUser, { userId });

  if (user === undefined) return <Skeleton />;

  return <div>{user.name}</div>;
}

// Good: Props interface
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

### Tailwind CSS

**Use utility classes:**

```tsx
// Good: Responsive, semantic classes
<div className="flex flex-col gap-4 md:flex-row md:gap-6">
  <Card className="bg-white/10 backdrop-blur-lg border border-white/20" />
</div>

// Avoid: Inline styles
<div style={{ display: 'flex', gap: '1rem' }}>
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Hooks: `camelCase.ts` (e.g., `useConvex.ts`)
- Utils: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `PascalCase.ts` (e.g., `User.ts`)

---

## Git Workflow

### Branch Naming

```bash
feature/add-user-profile    # New features
fix/login-button-error      # Bug fixes
docs/update-readme          # Documentation
refactor/simplify-auth      # Code refactoring
test/add-button-tests       # Tests
```

### Commit Messages

**Format:** `type: description`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code change (no feature/bug)
- `test`: Adding tests
- `chore`: Tooling, dependencies

**Examples:**
```bash
git commit -m "feat: add user profile page"
git commit -m "fix: resolve login button click issue"
git commit -m "docs: update setup instructions"
```

### Pull Request Process

1. Create branch from `main`
2. Make changes and commit
3. Push to remote
4. Open PR with description
5. Request review
6. Address feedback
7. Merge when approved

**See [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines.**

---

## Troubleshooting

### Port Already in Use

```bash
# Error: Port 5173 is already in use

# Solution: Kill process on port
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Convex Dev Not Starting

```bash
# Error: Convex dev fails to start

# Solution 1: Clear Convex cache
rm -rf node_modules/.convex
npx convex dev

# Solution 2: Recreate project
npx convex dev --create-project
```

### TypeScript Errors

```bash
# Error: Type errors in IDE but builds fine

# Solution: Restart TypeScript server
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

# Or regenerate types
npx convex dev --codegen
```

### Slow Development Server

```bash
# Solution: Clear caches
rm -rf node_modules/.vite
rm -rf dist
npm run dev
```

### OpenAI API Errors

```bash
# Error: 401 Unauthorized

# Check API key in .env.local
cat .env.local | grep OPENAI

# Verify key is valid at https://platform.openai.com/api-keys
```

---

## Resources

### Documentation

- [Project README](./README.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Architecture](./ARCHITECTURE.md)
- [Contributing](./CONTRIBUTING.md)
- [Security](./SECURITY.md)

### External Docs

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Convex](https://docs.convex.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite](https://vitejs.dev/)

### Tools

- [Convex Dashboard](https://dashboard.convex.dev/)
- [OpenAI Platform](https://platform.openai.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)

---

## Getting Help

**Stuck? Try these resources:**

1. **Documentation** - Check guides above
2. **GitHub Issues** - Search existing issues
3. **Stack Overflow** - Search for error messages
4. **Discord** - Join community (coming soon)
5. **Email** - team@careersu.com

---

**Last Updated**: November 7, 2025
**Version**: 1.0

Happy coding!
