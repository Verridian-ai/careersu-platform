# Convex Backend Setup Guide for CareerSU Platform

**Version**: Convex 1.28.2
**Date**: November 2025
**Project**: CareerSU - AI-Powered Career Success Platform

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Initial Setup](#initial-setup)
3. [Schema Design](#schema-design)
4. [Authentication Strategy](#authentication-strategy)
5. [API Integration Patterns](#api-integration-patterns)
6. [Migration Path](#migration-path)
7. [File Structure](#file-structure)
8. [Deployment](#deployment)

---

## Project Overview

### Current State
- **Frontend**: React 18.3.1 + TypeScript + Vite
- **State Management**: None (migrating to Convex)
- **Data**: Mock data in components
- **Authentication**: None (to be implemented)

### Target State
- **Backend**: Convex 1.28.2 (already installed)
- **Real-time Database**: Convex reactive database
- **Authentication**: Clerk (recommended) or Auth0
- **Type Safety**: End-to-end TypeScript from database to UI

---

## Initial Setup

### Step 1: Initialize Convex

Run the following commands from your project root:

```bash
# Initialize Convex (creates convex/ directory)
npx convex dev
```

This will:
1. Authenticate you via GitHub
2. Create a new Convex project
3. Generate a `.env.local` file with your `VITE_CONVEX_URL`
4. Create a `convex/` directory for backend functions

### Step 2: Environment Configuration

Your `.env.local` should contain:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

Add to `.gitignore` if not already present:
```
.env.local
.env
```

### Step 3: Update main.tsx

Update `/home/user/careersu-platform/src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import App from './App'
import './index.css'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

### Step 4: Verify Setup

Start your development servers:

```bash
# Terminal 1: Start Convex backend
npx convex dev

# Terminal 2: Start Vite frontend
npm run dev
```

---

## Schema Design

Create `convex/schema.ts` with the following comprehensive schema:

```typescript
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // ============================================
  // USERS TABLE
  // ============================================
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("job_seeker"), v.literal("coach")),
    avatar: v.optional(v.string()),

    // Clerk/Auth0 integration
    tokenIdentifier: v.string(),

    // Profile fields
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    phone: v.optional(v.string()),

    // Job seeker specific
    currentTitle: v.optional(v.string()),
    yearsExperience: v.optional(v.number()),
    skills: v.optional(v.array(v.string())),
    targetRoles: v.optional(v.array(v.string())),

    // Coach specific (only if role === 'coach')
    specializations: v.optional(v.array(v.string())),
    hourlyRate: v.optional(v.number()),
    rating: v.optional(v.number()),
    totalSessions: v.optional(v.number()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // ============================================
  // DOCUMENTS TABLE
  // ============================================
  documents: defineTable({
    userId: v.id("users"),
    title: v.string(),
    type: v.union(
      v.literal("resume"),
      v.literal("cover_letter"),
      v.literal("portfolio")
    ),
    content: v.string(), // Rich text JSON or markdown
    status: v.union(
      v.literal("draft"),
      v.literal("final"),
      v.literal("archived")
    ),

    // Metadata
    version: v.number(),
    fileSize: v.optional(v.number()),
    fileUrl: v.optional(v.string()), // For PDF exports

    // AI-generated metadata
    aiSummary: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),

    // Timestamps
    createdAt: v.number(),
    lastModified: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_type", ["userId", "type"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_modified", ["lastModified"]),

  // ============================================
  // JOBS TABLE
  // ============================================
  jobs: defineTable({
    title: v.string(),
    company: v.string(),
    location: v.string(),
    type: v.union(
      v.literal("full-time"),
      v.literal("part-time"),
      v.literal("contract"),
      v.literal("remote")
    ),

    // Salary information
    salary: v.optional(
      v.object({
        min: v.number(),
        max: v.number(),
        currency: v.string(),
      })
    ),

    // Job details
    description: v.string(),
    requirements: v.array(v.string()),
    responsibilities: v.optional(v.array(v.string())),
    benefits: v.optional(v.array(v.string())),

    // Company information
    companyLogo: v.optional(v.string()),
    companySize: v.optional(v.string()),
    companyIndustry: v.optional(v.string()),

    // Job metadata
    remote: v.boolean(),
    experienceLevel: v.optional(
      v.union(
        v.literal("entry"),
        v.literal("mid"),
        v.literal("senior"),
        v.literal("lead")
      )
    ),
    skills: v.optional(v.array(v.string())),

    // External reference
    externalId: v.optional(v.string()),
    externalUrl: v.optional(v.string()),

    // Status
    isActive: v.boolean(),

    // Timestamps
    posted: v.number(),
    deadline: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_company", ["company"])
    .index("by_type", ["type"])
    .index("by_active", ["isActive"])
    .index("by_posted", ["posted"])
    .index("by_location", ["location"]),

  // ============================================
  // APPLICATIONS TABLE
  // ============================================
  applications: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobs"),

    status: v.union(
      v.literal("pending"),
      v.literal("applied"),
      v.literal("screening"),
      v.literal("interview"),
      v.literal("offer"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("withdrawn")
    ),

    // Application materials
    resumeId: v.optional(v.id("documents")),
    coverLetterId: v.optional(v.id("documents")),
    portfolioId: v.optional(v.id("documents")),

    // AI match score
    matchScore: v.optional(v.number()),
    matchReasons: v.optional(v.array(v.string())),

    // Application tracking
    notes: v.optional(v.string()),
    followUpDate: v.optional(v.number()),
    interviewDates: v.optional(v.array(v.number())),

    // Contact information
    recruiterName: v.optional(v.string()),
    recruiterEmail: v.optional(v.string()),
    recruiterPhone: v.optional(v.string()),

    // Timestamps
    appliedAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_job", ["jobId"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_status", ["status"])
    .index("by_applied_date", ["appliedAt"]),

  // ============================================
  // CHAT MESSAGES TABLE
  // ============================================
  chatMessages: defineTable({
    userId: v.id("users"),
    conversationId: v.string(), // Group related messages

    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),

    // AI metadata
    model: v.optional(v.string()),
    tokens: v.optional(v.number()),

    // Context
    context: v.optional(
      v.object({
        jobId: v.optional(v.id("jobs")),
        documentId: v.optional(v.id("documents")),
        applicationId: v.optional(v.id("applications")),
      })
    ),

    // Attachments
    attachments: v.optional(
      v.array(
        v.object({
          type: v.string(),
          url: v.string(),
          name: v.string(),
        })
      )
    ),

    // Feedback
    rating: v.optional(v.number()),
    feedback: v.optional(v.string()),

    // Timestamps
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_conversation", ["conversationId"])
    .index("by_user_and_conversation", ["userId", "conversationId"])
    .index("by_timestamp", ["timestamp"]),

  // ============================================
  // COACH PROFILES TABLE
  // ============================================
  coachProfiles: defineTable({
    userId: v.id("users"), // Must reference a user with role 'coach'

    // Professional info
    title: v.string(),
    yearsExperience: v.number(),
    specializations: v.array(v.string()),
    certifications: v.optional(v.array(v.string())),

    // Availability
    availability: v.object({
      timezone: v.string(),
      scheduleSlots: v.array(
        v.object({
          dayOfWeek: v.number(), // 0-6
          startTime: v.string(), // "09:00"
          endTime: v.string(), // "17:00"
        })
      ),
    }),

    // Pricing
    hourlyRate: v.number(),
    packageDeals: v.optional(
      v.array(
        v.object({
          name: v.string(),
          sessions: v.number(),
          price: v.number(),
          description: v.string(),
        })
      )
    ),

    // Stats
    rating: v.number(),
    totalReviews: v.number(),
    totalSessions: v.number(),
    totalClients: v.number(),

    // Status
    isActive: v.boolean(),
    isAcceptingClients: v.boolean(),

    // Media
    videoIntroUrl: v.optional(v.string()),
    portfolioUrl: v.optional(v.string()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_active", ["isActive"])
    .index("by_rating", ["rating"])
    .index("by_specialization", ["specializations"]),

  // ============================================
  // COACHING SESSIONS TABLE
  // ============================================
  coachingSessions: defineTable({
    coachId: v.id("users"),
    clientId: v.id("users"),
    coachProfileId: v.id("coachProfiles"),

    // Session details
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("resume_review"),
      v.literal("interview_prep"),
      v.literal("career_strategy"),
      v.literal("salary_negotiation"),
      v.literal("general")
    ),

    // Scheduling
    scheduledAt: v.number(),
    duration: v.number(), // minutes
    timezone: v.string(),

    // Meeting info
    meetingUrl: v.optional(v.string()),
    meetingId: v.optional(v.string()),

    // Status
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show")
    ),

    // Payment
    price: v.number(),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("refunded")
    ),
    paymentId: v.optional(v.string()),

    // Session notes
    coachNotes: v.optional(v.string()),
    clientNotes: v.optional(v.string()),
    actionItems: v.optional(v.array(v.string())),

    // Feedback
    rating: v.optional(v.number()),
    review: v.optional(v.string()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_coach", ["coachId"])
    .index("by_client", ["clientId"])
    .index("by_status", ["status"])
    .index("by_scheduled", ["scheduledAt"])
    .index("by_coach_and_status", ["coachId", "status"])
    .index("by_client_and_status", ["clientId", "status"]),

  // ============================================
  // USER STATS TABLE (Denormalized for performance)
  // ============================================
  userStats: defineTable({
    userId: v.id("users"),

    // Application stats
    totalApplications: v.number(),
    pendingApplications: v.number(),
    interviews: v.number(),
    offers: v.number(),
    rejections: v.number(),

    // Response metrics
    responseRate: v.number(),
    averageResponseTime: v.optional(v.number()), // days

    // Document stats
    totalDocuments: v.number(),
    totalResumes: v.number(),
    totalCoverLetters: v.number(),

    // Engagement
    lastActive: v.number(),
    daysStreak: v.number(),
    totalSessions: v.number(),

    // Coach-specific stats (only if user is coach)
    coachingRevenue: v.optional(v.number()),
    coachingHours: v.optional(v.number()),

    // Timestamps
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),
})
```

---

## Authentication Strategy

### Recommended: Clerk Authentication

Clerk is the recommended solution for CareerSU due to:
- Built-in user management UI
- Social login support (Google, LinkedIn, GitHub)
- Excellent Convex integration
- Free tier for development

### Clerk Setup Instructions

#### 1. Install Clerk

```bash
npm install @clerk/clerk-react
```

#### 2. Create Clerk Account & Application

1. Go to [clerk.com](https://clerk.com) and create account
2. Create new application: "CareerSU Platform"
3. Copy your Publishable Key

#### 3. Configure Environment Variables

Add to `.env.local`:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

#### 4. Create JWT Template in Clerk

1. Navigate to Clerk Dashboard > JWT Templates
2. Click "New Template" > Select "Convex"
3. **Important**: Keep the token name as `convex` (do not rename)
4. Copy the "Issuer" URL (Frontend API URL)

#### 5. Configure Convex Auth

Create `convex/auth.config.ts`:

```typescript
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
}
```

Add to `.env.local` (in Convex dashboard settings):

```env
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-domain.clerk.accounts.dev
```

#### 6. Update main.tsx with Clerk

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'
import App from './App'
import './index.css'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={clerkPubKey}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <App />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

#### 7. Use Convex Auth Components

Replace conditional rendering with Convex auth components:

```typescript
import { Authenticated, Unauthenticated, useConvexAuth } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/clerk-react'

function App() {
  const { isLoading, isAuthenticated } = useConvexAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Authenticated>
        <UserButton />
        {/* Protected app content */}
      </Authenticated>

      <Unauthenticated>
        <SignInButton mode="modal">
          <button>Sign In</button>
        </SignInButton>
      </Unauthenticated>
    </>
  )
}
```

#### 8. Access User in Backend Functions

In any Convex function:

```typescript
import { mutation, query } from "./_generated/server"

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated")
    }

    // identity contains: { tokenIdentifier, email, name, ... }
    return identity
  },
})
```

---

## API Integration Patterns

### Pattern 1: Queries (Read Data)

Create `convex/users.ts`:

```typescript
import { query } from "./_generated/server"
import { v } from "convex/values"

// Get current user profile
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()
  },
})

// Get user by ID
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId)
  },
})

// Get all coaches
export const getCoaches = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "coach"))
      .collect()
  },
})
```

**Usage in React**:

```typescript
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'

function ProfilePage() {
  const currentUser = useQuery(api.users.getCurrentUser)

  if (currentUser === undefined) return <div>Loading...</div>
  if (currentUser === null) return <div>Not logged in</div>

  return <div>Welcome, {currentUser.name}!</div>
}
```

### Pattern 2: Mutations (Write Data)

Create `convex/users.ts` (continued):

```typescript
import { mutation } from "./_generated/server"
import { v } from "convex/values"

// Create or update user on first login
export const createOrUpdateUser = mutation({
  args: {
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("job_seeker"), v.literal("coach")),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first()

    const now = Date.now()

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        updatedAt: now,
      })
      return existingUser._id
    }

    return await ctx.db.insert("users", {
      ...args,
      createdAt: now,
      updatedAt: now,
    })
  },
})

// Update user profile
export const updateProfile = mutation({
  args: {
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    currentTitle: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user) throw new Error("User not found")

    await ctx.db.patch(user._id, {
      ...args,
      updatedAt: Date.now(),
    })
  },
})
```

**Usage in React**:

```typescript
import { useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'

function ProfileEditForm() {
  const updateProfile = useMutation(api.users.updateProfile)

  const handleSubmit = async (formData) => {
    await updateProfile({
      bio: formData.bio,
      location: formData.location,
      skills: formData.skills,
    })
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### Pattern 3: Documents Management

Create `convex/documents.ts`:

```typescript
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// Get user's documents
export const getUserDocuments = query({
  args: {
    type: v.optional(v.union(v.literal("resume"), v.literal("cover_letter"), v.literal("portfolio"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user) throw new Error("User not found")

    let query = ctx.db.query("documents").withIndex("by_user", (q) => q.eq("userId", user._id))

    if (args.type) {
      query = query.filter((q) => q.eq(q.field("type"), args.type))
    }

    return await query.order("desc").collect()
  },
})

// Create new document
export const createDocument = mutation({
  args: {
    title: v.string(),
    type: v.union(v.literal("resume"), v.literal("cover_letter"), v.literal("portfolio")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user) throw new Error("User not found")

    const now = Date.now()

    return await ctx.db.insert("documents", {
      userId: user._id,
      title: args.title,
      type: args.type,
      content: args.content,
      status: "draft",
      version: 1,
      createdAt: now,
      lastModified: now,
    })
  },
})

// Update document
export const updateDocument = mutation({
  args: {
    documentId: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("final"), v.literal("archived"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const document = await ctx.db.get(args.documentId)
    if (!document) throw new Error("Document not found")

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user || document.userId !== user._id) {
      throw new Error("Not authorized")
    }

    await ctx.db.patch(args.documentId, {
      ...args,
      lastModified: Date.now(),
    })
  },
})

// Delete document
export const deleteDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const document = await ctx.db.get(args.documentId)
    if (!document) throw new Error("Document not found")

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user || document.userId !== user._id) {
      throw new Error("Not authorized")
    }

    await ctx.db.delete(args.documentId)
  },
})
```

### Pattern 4: Jobs & Applications

Create `convex/jobs.ts`:

```typescript
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// Get all active jobs
export const getActiveJobs = query({
  args: {
    limit: v.optional(v.number()),
    type: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("jobs")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("desc")

    const jobs = await query.collect()

    // Apply filters
    let filtered = jobs
    if (args.type) {
      filtered = filtered.filter(j => j.type === args.type)
    }
    if (args.location) {
      filtered = filtered.filter(j =>
        j.location.toLowerCase().includes(args.location!.toLowerCase())
      )
    }

    // Apply limit
    if (args.limit) {
      filtered = filtered.slice(0, args.limit)
    }

    return filtered
  },
})

// Get job with user's application status
export const getJobWithApplicationStatus = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId)
    if (!job) return null

    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return { job, application: null }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user) return { job, application: null }

    const application = await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("jobId"), args.jobId))
      .first()

    return { job, application }
  },
})
```

Create `convex/applications.ts`:

```typescript
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// Get user's applications
export const getUserApplications = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user) throw new Error("User not found")

    let query = ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))

    const applications = await query.collect()

    if (args.status) {
      return applications.filter(app => app.status === args.status)
    }

    return applications
  },
})

// Create application
export const createApplication = mutation({
  args: {
    jobId: v.id("jobs"),
    resumeId: v.optional(v.id("documents")),
    coverLetterId: v.optional(v.id("documents")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user) throw new Error("User not found")

    // Check if already applied
    const existing = await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("jobId"), args.jobId))
      .first()

    if (existing) {
      throw new Error("Already applied to this job")
    }

    const now = Date.now()

    return await ctx.db.insert("applications", {
      userId: user._id,
      jobId: args.jobId,
      status: "applied",
      resumeId: args.resumeId,
      coverLetterId: args.coverLetterId,
      notes: args.notes,
      appliedAt: now,
      updatedAt: now,
    })
  },
})

// Update application status
export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const application = await ctx.db.get(args.applicationId)
    if (!application) throw new Error("Application not found")

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user || application.userId !== user._id) {
      throw new Error("Not authorized")
    }

    await ctx.db.patch(args.applicationId, {
      status: args.status as any,
      notes: args.notes,
      updatedAt: Date.now(),
    })
  },
})
```

### Pattern 5: Chat Messages

Create `convex/chat.ts`:

```typescript
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// Get chat history
export const getChatHistory = query({
  args: {
    conversationId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user) throw new Error("User not found")

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user_and_conversation", (q) =>
        q.eq("userId", user._id).eq("conversationId", args.conversationId)
      )
      .order("desc")
      .take(args.limit ?? 50)

    return messages.reverse()
  },
})

// Send message
export const sendMessage = mutation({
  args: {
    conversationId: v.string(),
    content: v.string(),
    context: v.optional(
      v.object({
        jobId: v.optional(v.id("jobs")),
        documentId: v.optional(v.id("documents")),
        applicationId: v.optional(v.id("applications")),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user) throw new Error("User not found")

    // Insert user message
    const messageId = await ctx.db.insert("chatMessages", {
      userId: user._id,
      conversationId: args.conversationId,
      role: "user",
      content: args.content,
      context: args.context,
      timestamp: Date.now(),
    })

    // TODO: Integrate with AI service (OpenAI, Anthropic, etc.)
    // For now, return a placeholder

    return messageId
  },
})
```

---

## Migration Path

### Phase 1: Setup & Authentication (Week 1)

1. Initialize Convex: `npx convex dev`
2. Set up Clerk authentication
3. Update main.tsx with providers
4. Test authentication flow

### Phase 2: Schema & Initial Data (Week 1-2)

1. Create `convex/schema.ts` with all tables
2. Create seed data script for jobs
3. Create user profile management
4. Test CRUD operations

### Phase 3: Migrate Documents Page (Week 2)

**Before** (mock data in component):
```typescript
const documents = [
  { id: 1, title: 'Resume', ... },
  ...
]
```

**After** (Convex queries):
```typescript
// In component
import { useQuery, useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'

function DocumentsPage() {
  const documents = useQuery(api.documents.getUserDocuments)
  const createDoc = useMutation(api.documents.createDocument)

  // ... rest of component
}
```

### Phase 4: Migrate Jobs Page (Week 2-3)

**Before**:
```typescript
const jobs = [ /* hardcoded array */ ]
```

**After**:
```typescript
const jobs = useQuery(api.jobs.getActiveJobs, { limit: 20 })
const userApplications = useQuery(api.applications.getUserApplications)
```

### Phase 5: Chat & Real-time Features (Week 3)

1. Implement chat messages table
2. Add AI integration (OpenAI/Anthropic)
3. Real-time message updates
4. Context-aware conversations

### Phase 6: Coach Features (Week 4)

1. Coach profiles
2. Session booking
3. Calendar integration
4. Payment processing (Stripe)

### Migration Script Template

Create `scripts/migrate-mock-data.ts`:

```typescript
// Run with: npx tsx scripts/migrate-mock-data.ts

import { ConvexHttpClient } from "convex/browser"
import { api } from "../convex/_generated/api"

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL!)

async function migrate() {
  // Example: Migrate jobs
  const mockJobs = [
    {
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "full-time",
      // ... rest of fields
    },
    // ... more jobs
  ]

  for (const job of mockJobs) {
    await client.mutation(api.jobs.createJob, job)
    console.log(`Migrated job: ${job.title}`)
  }
}

migrate().then(() => console.log("Migration complete!"))
```

---

## File Structure

Your project structure after setup:

```
careersu-platform/
├── convex/
│   ├── _generated/          # Auto-generated by Convex
│   ├── schema.ts            # Database schema
│   ├── auth.config.ts       # Authentication config
│   ├── users.ts             # User queries & mutations
│   ├── documents.ts         # Document operations
│   ├── jobs.ts              # Job listings
│   ├── applications.ts      # Application tracking
│   ├── chat.ts              # Chat messages
│   ├── coaches.ts           # Coach management
│   ├── sessions.ts          # Coaching sessions
│   ├── stats.ts             # Analytics & stats
│   └── http.ts              # HTTP endpoints (optional)
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   │   ├── useCurrentUser.ts    # Custom auth hook
│   │   ├── useDocuments.ts      # Document management hook
│   │   └── useApplications.ts   # Application hooks
│   ├── types/
│   │   └── index.ts             # Keep for client-side types
│   ├── App.tsx
│   └── main.tsx                 # Updated with providers
│
├── .env.local                   # Environment variables
├── package.json
└── README.md
```

---

## Deployment

### Deploy to Production

```bash
# Deploy Convex backend
npx convex deploy

# Build frontend
npm run build

# Deploy to Netlify/Vercel
# (Follow their respective guides)
```

### Environment Variables for Production

Ensure these are set in your hosting platform:

```env
VITE_CONVEX_URL=https://your-production.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

---

## Best Practices

1. **Type Safety**: Always use generated types from `convex/_generated/api`
2. **Authentication**: Use `ctx.auth.getUserIdentity()` in all mutations/queries
3. **Authorization**: Always verify user ownership before modifying data
4. **Indexes**: Add indexes for frequently queried fields
5. **Pagination**: Use `.take()` or limit parameters for large datasets
6. **Error Handling**: Throw descriptive errors from backend functions
7. **Real-time**: Leverage Convex's reactive queries for live updates
8. **Testing**: Test auth flows thoroughly (logged in/out states)
9. **Denormalization**: Use `userStats` table for performance
10. **Migrations**: Use Convex dashboard for schema changes in production

---

## Troubleshooting

### Issue: "No auth provider found"
- Ensure `auth.config.ts` is configured correctly
- Verify JWT template in Clerk is named "convex"
- Check `CLERK_JWT_ISSUER_DOMAIN` environment variable

### Issue: TypeScript errors with generated types
- Run `npx convex dev` to regenerate types
- Restart TypeScript server in VS Code

### Issue: Query returns undefined
- Check if Convex dev server is running
- Verify `.env.local` has correct `VITE_CONVEX_URL`
- Check browser console for connection errors

### Issue: Mutation fails silently
- Mutations throw errors that must be caught
- Use try/catch or .catch() in async handlers
- Check Convex dashboard logs

---

## Next Steps

1. Complete initial setup (Phases 1-2)
2. Create custom React hooks for common operations
3. Implement search functionality with full-text search
4. Add file upload for documents (use Convex file storage)
5. Integrate AI services (OpenAI API) for chat
6. Set up Stripe for coach payments
7. Add email notifications (Resend, SendGrid)
8. Implement analytics dashboard
9. Set up monitoring (Sentry)
10. Load testing & optimization

---

## Resources

- [Convex Documentation](https://docs.convex.dev/)
- [Clerk + Convex Guide](https://docs.convex.dev/auth/clerk)
- [Convex React Guide](https://docs.convex.dev/quickstart/react)
- [TypeScript Best Practices](https://docs.convex.dev/understanding/best-practices/typescript)
- [Convex Stack (Community)](https://stack.convex.dev/)

---

**Generated**: November 7, 2025
**Version**: 1.0
**Maintainer**: CareerSU Development Team
