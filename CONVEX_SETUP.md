# Convex Setup Guide

## Overview

This guide explains how to set up Convex as the backend for the CareerSU platform. Convex provides real-time database, authentication, and serverless functions out of the box.

---

## What is Convex?

**Convex** is a backend platform that combines:
- **Real-time Database**: Automatic data syncing across clients
- **TypeScript Functions**: Write backend logic in TypeScript
- **Built-in Auth**: Authentication with popular providers
- **File Storage**: Upload and serve files
- **Scheduled Jobs**: Cron-like background tasks

### Why Convex for CareerSU?

1. **Type-Safe**: End-to-end TypeScript
2. **Real-Time**: Live updates for chat and notifications
3. **Serverless**: No infrastructure management
4. **Developer Experience**: Fast development and deployment

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- GitHub account (for authentication)

---

## Step 1: Create Convex Account

1. **Go to Convex Dashboard**
   - Visit: https://dashboard.convex.dev
   - Sign up with GitHub or email

2. **Create New Project**
   ```
   Project Name: careersu-platform
   Region: Choose closest to your users
   ```

3. **Get Deployment URL**
   - After creation, you'll see a deployment URL
   - Format: `https://[random-string].convex.cloud`
   - Copy this URL for the next step

---

## Step 2: Install Convex

1. **Install Convex Package**
   ```bash
   npm install convex
   ```

2. **Initialize Convex in Project**
   ```bash
   npx convex dev
   ```

   This will:
   - Create a `convex/` directory
   - Set up configuration files
   - Prompt you to select your project

3. **Login to Convex**
   ```bash
   npx convex login
   ```

   - Opens browser for authentication
   - Select your Convex account
   - Authorize the CLI

---

## Step 3: Configure Environment

1. **Create `.env.local` File**
   ```bash
   cp .env.example .env.local
   ```

2. **Add Convex URL**
   ```env
   # .env.local
   VITE_CONVEX_URL=https://your-deployment.convex.cloud
   ```

3. **Update `vite.config.ts`** (if needed)
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     // Convex automatically injects env variables
   })
   ```

---

## Step 4: Create Database Schema

1. **Create Schema File**
   ```bash
   mkdir -p convex
   touch convex/schema.ts
   ```

2. **Define Data Models**
   ```typescript
   // convex/schema.ts
   import { defineSchema, defineTable } from 'convex/server'
   import { v } from 'convex/values'

   export default defineSchema({
     users: defineTable({
       email: v.string(),
       name: v.string(),
       role: v.union(v.literal('job_seeker'), v.literal('coach')),
       avatar: v.optional(v.string()),
       createdAt: v.number(),
     }).index('by_email', ['email']),

     documents: defineTable({
       userId: v.id('users'),
       title: v.string(),
       type: v.union(
         v.literal('resume'),
         v.literal('cover_letter'),
         v.literal('portfolio')
       ),
       content: v.string(),
       status: v.union(
         v.literal('draft'),
         v.literal('final'),
         v.literal('archived')
       ),
       lastModified: v.number(),
     })
       .index('by_user', ['userId'])
       .index('by_user_and_type', ['userId', 'type']),

     jobs: defineTable({
       title: v.string(),
       company: v.string(),
       location: v.string(),
       type: v.string(),
       salary: v.optional(
         v.object({
           min: v.number(),
           max: v.number(),
           currency: v.string(),
         })
       ),
       description: v.string(),
       requirements: v.array(v.string()),
       posted: v.number(),
     })
       .index('by_posted', ['posted'])
       .index('by_company', ['company']),

     applications: defineTable({
       jobId: v.id('jobs'),
       userId: v.id('users'),
       status: v.union(
         v.literal('pending'),
         v.literal('interview'),
         v.literal('offer'),
         v.literal('rejected')
       ),
       appliedAt: v.number(),
       updatedAt: v.number(),
     })
       .index('by_user', ['userId'])
       .index('by_job', ['jobId']),

     messages: defineTable({
       userId: v.id('users'),
       role: v.union(v.literal('user'), v.literal('assistant')),
       content: v.string(),
       timestamp: v.number(),
     }).index('by_user', ['userId']),
   })
   ```

---

## Step 5: Create API Functions

### 1. User Functions

```typescript
// convex/users.ts
import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// Get current user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', identity.email!))
      .first()

    return user
  },
})

// Create user
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal('job_seeker'), v.literal('coach')),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert('users', {
      ...args,
      createdAt: Date.now(),
    })
    return userId
  },
})
```

### 2. Document Functions

```typescript
// convex/documents.ts
import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// Get user's documents
export const getUserDocuments = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect()

    return documents
  },
})

// Create document
export const createDocument = mutation({
  args: {
    userId: v.id('users'),
    title: v.string(),
    type: v.union(
      v.literal('resume'),
      v.literal('cover_letter'),
      v.literal('portfolio')
    ),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const docId = await ctx.db.insert('documents', {
      ...args,
      status: 'draft',
      lastModified: Date.now(),
    })
    return docId
  },
})

// Update document
export const updateDocument = mutation({
  args: {
    id: v.id('documents'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      content: args.content,
      lastModified: Date.now(),
    })
  },
})
```

### 3. Job Functions

```typescript
// convex/jobs.ts
import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// Get all jobs
export const getAllJobs = query({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db
      .query('jobs')
      .withIndex('by_posted')
      .order('desc')
      .take(50)

    return jobs
  },
})

// Get job by ID
export const getJobById = query({
  args: { id: v.id('jobs') },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.id)
    return job
  },
})

// Apply for job
export const applyForJob = mutation({
  args: {
    jobId: v.id('jobs'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const applicationId = await ctx.db.insert('applications', {
      ...args,
      status: 'pending',
      appliedAt: Date.now(),
      updatedAt: Date.now(),
    })
    return applicationId
  },
})
```

---

## Step 6: Integrate with React

### 1. Setup Convex Provider

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import App from './App'
import './index.css'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConvexProvider>
  </React.StrictMode>
)
```

### 2. Use Convex Hooks

```tsx
// Example: Fetch documents
import { useQuery, useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'

function DocumentsPage() {
  const documents = useQuery(api.documents.getUserDocuments, {
    userId: currentUserId,
  })

  const createDocument = useMutation(api.documents.createDocument)

  const handleCreate = async () => {
    await createDocument({
      userId: currentUserId,
      title: 'New Resume',
      type: 'resume',
      content: '',
    })
  }

  if (documents === undefined) {
    return <LoadingSkeleton />
  }

  return (
    <div>
      {documents.map((doc) => (
        <DocumentCard key={doc._id} document={doc} />
      ))}
    </div>
  )
}
```

---

## Step 7: Deploy

### Development
```bash
# Start Convex dev server
npx convex dev

# In another terminal, start Vite
npm run dev
```

### Production
```bash
# Deploy Convex backend
npx convex deploy

# Build frontend
npm run build

# Deploy to your hosting platform
# (Vercel, Netlify, etc.)
```

---

## Authentication Setup

### 1. Configure Auth Providers

```bash
# In Convex dashboard:
# Settings -> Auth -> Add Provider
```

Supported providers:
- Google
- GitHub
- Email/Password
- Custom JWT

### 2. Implement Auth in React

```tsx
import { useAuth } from 'convex/react'

function LoginPage() {
  const { login, logout } = useAuth()

  return (
    <button onClick={() => login('google')}>
      Sign in with Google
    </button>
  )
}
```

---

## Best Practices

### 1. Type Safety
```typescript
// Always use generated types
import { api } from '../convex/_generated/api'
import { Id } from '../convex/_generated/dataModel'
```

### 2. Error Handling
```typescript
const createDoc = useMutation(api.documents.createDocument)

try {
  await createDoc({ ... })
  toast.success('Document created!')
} catch (error) {
  toast.error('Failed to create document')
}
```

### 3. Optimistic Updates
```typescript
const updateDoc = useMutation(api.documents.updateDocument)

// Update UI immediately
setLocalContent(newContent)

// Sync with server
updateDoc({ id, content: newContent })
```

---

## Troubleshooting

### Issue: "Convex is not defined"
**Solution:** Make sure Convex URL is set in `.env.local`

### Issue: "Failed to connect to Convex"
**Solution:** Check deployment URL and internet connection

### Issue: "Type errors in generated code"
**Solution:** Run `npx convex dev` to regenerate types

---

## Resources

- **Official Docs**: https://docs.convex.dev
- **Dashboard**: https://dashboard.convex.dev
- **Examples**: https://github.com/get-convex/convex-demos
- **Discord**: https://convex.dev/community

---

## Next Steps

1. Set up authentication
2. Implement real-time features
3. Add file upload for documents
4. Set up scheduled jobs
5. Configure production deployment

For questions, refer to the main README.md or Convex documentation.
