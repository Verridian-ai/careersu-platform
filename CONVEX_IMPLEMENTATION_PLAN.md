# Convex Implementation Plan - CareerSU Platform

A day-by-day implementation guide for migrating CareerSU from mock data to Convex backend.

---

## Overview

- **Total Duration**: 4-5 days (full-time work)
- **Team Size**: 1-2 developers
- **Risk Level**: Low (can develop alongside existing code)
- **Rollback Plan**: Keep mock data until full migration complete

---

## Day 1: Foundation & Authentication

**Duration**: 6-8 hours
**Goal**: Set up Convex and authentication, verify everything works

### Morning (3-4 hours)

#### 1. Initialize Convex (30 min)
```bash
cd /home/user/careersu-platform
npx convex dev
```

**Expected outcome**:
- `convex/` directory created
- `.env.local` with `VITE_CONVEX_URL` created
- Convex dashboard opens in browser

**Verify**: Visit dashboard, see your project

#### 2. Install Clerk (15 min)
```bash
npm install @clerk/clerk-react
```

#### 3. Set Up Clerk Account (30 min)
1. Go to [clerk.com](https://clerk.com)
2. Create account
3. Create application: "CareerSU Platform"
4. Copy Publishable Key to `.env.local`
5. Configure: Enable Google, GitHub social logins
6. Create JWT Template:
   - Go to JWT Templates
   - Click "New Template"
   - Select "Convex"
   - **Keep name as "convex"** (don't change!)
   - Copy Issuer URL

#### 4. Configure Auth (1 hour)

**Create** `convex/auth.config.ts`:
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

**Update** `.env.local`:
```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

**In Convex Dashboard** > Settings > Environment Variables:
```env
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-domain.clerk.accounts.dev
```

**Update** `src/main.tsx`:
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

**Verify**:
- App still loads
- No console errors
- Convex dev server running

#### 5. Create Basic Schema (1 hour)

**Create** `convex/schema.ts` (copy from `CONVEX_CODE_EXAMPLES.md`)

**Verify**:
- No errors in Convex dev console
- Types generated in `convex/_generated/`
- Dashboard shows tables (empty)

### Afternoon (3-4 hours)

#### 6. Create User Functions (1.5 hours)

**Create** `convex/users.ts` (copy from `CONVEX_CODE_EXAMPLES.md`)

Functions to create:
- `getCurrentUser` (query)
- `getUserById` (query)
- `createOrUpdateUser` (mutation)
- `updateProfile` (mutation)

**Test in Dashboard Console**:
```javascript
// Should return null (not logged in yet)
await api.users.getCurrentUser({})
```

#### 7. Create useCurrentUser Hook (30 min)

**Create** `src/hooks/useCurrentUser.ts` (copy from `CONVEX_CODE_EXAMPLES.md`)

#### 8. Update LoginPage (1 hour)

**Update** `src/pages/LoginPage.tsx`:
```typescript
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignIn, SignUp, useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

const LoginPage: React.FC = () => {
  const { user, isLoaded } = useUser()
  const createOrUpdate = useMutation(api.users.createOrUpdateUser)
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && user) {
      // Create user in database on first login
      createOrUpdate({
        tokenIdentifier: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        name: user.fullName || user.firstName || 'User',
        avatar: user.imageUrl,
        role: 'job_seeker', // Default role
      }).then(() => {
        navigate('/dashboard')
      })
    }
  }, [isLoaded, user])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-md w-full p-8">
        <SignIn routing="path" path="/login" signUpUrl="/signup" />
        {/* Or <SignUp routing="path" path="/signup" signInUrl="/login" /> */}
      </div>
    </div>
  )
}

export default LoginPage
```

#### 9. Add Auth Guards (30 min)

**Create** `src/components/AuthGuard.tsx`:
```typescript
import { useConvexAuth } from 'convex/react'
import { Navigate } from 'react-router-dom'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth()

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div>Loading...</div>
    </div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
```

**Update** `src/App.tsx`:
```typescript
import { AuthGuard } from '@/components/AuthGuard'

// Wrap protected routes
<Route path="/dashboard" element={
  <AuthGuard>
    <SeekerDashboard />
  </AuthGuard>
} />
```

### End of Day 1 Testing (30 min)

**Test checklist**:
- [ ] Can visit login page
- [ ] Can sign up with email
- [ ] Can sign in with Google/GitHub
- [ ] User created in Convex database (check dashboard)
- [ ] Redirected to dashboard after login
- [ ] Protected routes require login
- [ ] Can sign out
- [ ] Redirected to login after sign out

**If tests pass**: Day 1 complete! ✓

---

## Day 2: Documents & Core Features

**Duration**: 6-8 hours
**Goal**: Migrate Documents page to use Convex

### Morning (3-4 hours)

#### 1. Create Document Functions (1 hour)

**Create** `convex/documents.ts` (copy from `CONVEX_CODE_EXAMPLES.md`)

Functions:
- `getUserDocuments` (query)
- `getDocumentById` (query)
- `createDocument` (mutation)
- `updateDocument` (mutation)
- `deleteDocument` (mutation)

#### 2. Create useDocuments Hook (30 min)

**Create** `src/hooks/useDocuments.ts` (copy from `CONVEX_CODE_EXAMPLES.md`)

#### 3. Update DocumentsPage - Part 1: Read (1 hour)

**Update** `src/pages/DocumentsPage.tsx`:

Replace:
```typescript
const documents = [ /* mock data */ ]
```

With:
```typescript
import { useDocuments } from '@/hooks/useDocuments'

const { documents, isLoading } = useDocuments()

if (isLoading) return <div>Loading...</div>
```

**Test**:
- [ ] Page loads (shows empty state)
- [ ] No console errors

#### 4. Update DocumentsPage - Part 2: Create (1 hour)

Add create document functionality:

```typescript
const { documents, isLoading, create } = useDocuments()

const handleCreate = async () => {
  await create({
    title: "My Resume",
    type: "resume",
    content: "",
  })
}
```

**Test**:
- [ ] Can create document
- [ ] Document appears in list
- [ ] Real-time update (appears immediately)

### Afternoon (3-4 hours)

#### 5. Update DocumentsPage - Part 3: Edit & Delete (2 hours)

Add edit and delete:

```typescript
const { documents, isLoading, create, update, remove } = useDocuments()

const handleUpdate = async (docId, title) => {
  await update(docId, { title })
}

const handleDelete = async (docId) => {
  if (confirm('Delete this document?')) {
    await remove(docId)
  }
}
```

**Test**:
- [ ] Can edit document title
- [ ] Can delete document
- [ ] Changes reflect immediately

#### 6. Create Document Editor Page (2 hours)

**Create** `src/pages/DocumentEditor.tsx`:

```typescript
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState, useEffect } from 'react'

export default function DocumentEditor() {
  const { documentId } = useParams()
  const doc = useQuery(api.documents.getDocumentById, {
    documentId: documentId as any
  })
  const updateDoc = useMutation(api.documents.updateDocument)

  const [content, setContent] = useState('')

  useEffect(() => {
    if (doc) setContent(doc.content)
  }, [doc])

  const handleSave = async () => {
    await updateDoc({
      documentId: doc!._id,
      content,
    })
  }

  if (doc === undefined) return <div>Loading...</div>
  if (doc === null) return <div>Not found</div>

  return (
    <div className="p-8">
      <h1>{doc.title}</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-96 p-4 border rounded"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  )
}
```

**Add route** in `App.tsx`:
```typescript
<Route path="/documents/edit/:documentId" element={
  <AuthGuard>
    <DocumentEditor />
  </AuthGuard>
} />
```

**Test**:
- [ ] Can open document editor
- [ ] Can edit content
- [ ] Can save changes
- [ ] Changes persist after reload

### End of Day 2 Testing (30 min)

**Full documents flow test**:
- [ ] Create new resume
- [ ] Edit resume content
- [ ] Save changes
- [ ] Navigate away and back
- [ ] Changes persisted
- [ ] Delete document
- [ ] Document removed

**If tests pass**: Day 2 complete! ✓

---

## Day 3: Jobs & Applications

**Duration**: 6-8 hours
**Goal**: Migrate Jobs page and add application tracking

### Morning (3-4 hours)

#### 1. Seed Jobs Data (1 hour)

**Create** `convex/seedJobs.ts`:

```typescript
import { mutation } from "./_generated/server"

export const seedJobs = mutation({
  args: {},
  handler: async (ctx) => {
    const jobs = [
      {
        title: "Senior Software Engineer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        type: "full-time" as const,
        salary: { min: 120000, max: 180000, currency: "USD" },
        description: "Build scalable web applications using React and Node.js. Work with a talented team on cutting-edge projects.",
        requirements: [
          "5+ years of software development experience",
          "Expert in React and TypeScript",
          "Experience with Node.js and Express",
          "Cloud platform experience (AWS, GCP, or Azure)",
          "Strong problem-solving skills"
        ],
        responsibilities: [
          "Design and implement new features",
          "Review code and mentor junior developers",
          "Collaborate with product and design teams",
          "Optimize application performance"
        ],
        benefits: [
          "Competitive salary and equity",
          "Health, dental, and vision insurance",
          "401(k) with company match",
          "Flexible work schedule",
          "Professional development budget"
        ],
        remote: true,
        experienceLevel: "senior" as const,
        skills: ["React", "Node.js", "TypeScript", "AWS"],
        isActive: true,
        posted: Date.now(),
        createdAt: Date.now(),
      },
      // Add 10-15 more jobs...
    ]

    for (const job of jobs) {
      await ctx.db.insert("jobs", job)
    }

    return { inserted: jobs.length }
  },
})
```

**Run in Dashboard Console**:
```javascript
await api.seedJobs.seedJobs({})
```

**Verify**: Check database, should see jobs

#### 2. Create Job Functions (1 hour)

**Create** `convex/jobs.ts`:

```typescript
import { query } from "./_generated/server"
import { v } from "convex/values"

export const getActiveJobs = query({
  args: {
    limit: v.optional(v.number()),
    type: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let jobs = await ctx.db
      .query("jobs")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("desc")
      .collect()

    // Apply filters
    if (args.type) {
      jobs = jobs.filter(j => j.type === args.type)
    }
    if (args.location) {
      jobs = jobs.filter(j =>
        j.location.toLowerCase().includes(args.location!.toLowerCase())
      )
    }
    if (args.limit) {
      jobs = jobs.slice(0, args.limit)
    }

    return jobs
  },
})

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

#### 3. Create Application Functions (1 hour)

**Create** `convex/applications.ts` (copy from `CONVEX_CODE_EXAMPLES.md`)

#### 4. Create Hooks (30 min)

**Create** `src/hooks/useJobs.ts` (copy from `CONVEX_CODE_EXAMPLES.md`)
**Create** `src/hooks/useApplications.ts` (copy from `CONVEX_CODE_EXAMPLES.md`)

### Afternoon (3-4 hours)

#### 5. Update JobsPage (2 hours)

**Update** `src/pages/JobsPage.tsx`:

Replace mock data:
```typescript
import { useJobs } from '@/hooks/useJobs'
import { useApplications } from '@/hooks/useApplications'

const { jobs, isLoading, searchQuery, setSearchQuery } = useJobs()
const { apply, isApplying } = useApplications()

const handleApply = async (jobId) => {
  try {
    await apply({ jobId })
    toast.success('Application submitted!')
  } catch (error) {
    toast.error(error.message)
  }
}
```

#### 6. Add Application Status (1 hour)

Show if user has already applied:

```typescript
const { job, application, hasApplied } = useJobWithApplication(jobId)

return (
  <Button disabled={hasApplied || isApplying}>
    {hasApplied ? 'Applied' : 'Apply Now'}
  </Button>
)
```

#### 7. Create Applications Page (1 hour)

**Create** `src/pages/ApplicationsPage.tsx`:

```typescript
import { useApplications } from '@/hooks/useApplications'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export default function ApplicationsPage() {
  const { applications, stats, isLoading } = useApplications()

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="p-8">
      <h1>My Applications ({stats?.total || 0})</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={stats?.total} />
        <StatCard label="Interviews" value={stats?.interviews} />
        <StatCard label="Offers" value={stats?.offers} />
        <StatCard label="Rejected" value={stats?.rejected} />
      </div>

      <div className="space-y-4">
        {applications?.map(app => (
          <ApplicationCard key={app._id} application={app} />
        ))}
      </div>
    </div>
  )
}
```

### End of Day 3 Testing (30 min)

**Test checklist**:
- [ ] Jobs page shows real jobs
- [ ] Can search/filter jobs
- [ ] Can apply to job
- [ ] Application tracked in database
- [ ] Can view all applications
- [ ] Stats calculated correctly
- [ ] Can't apply twice to same job

**If tests pass**: Day 3 complete! ✓

---

## Day 4: Dashboard & Chat

**Duration**: 6-8 hours
**Goal**: Update dashboard with real data and add chat

### Morning (3-4 hours)

#### 1. Create Stats Functions (1 hour)

**Create** `convex/stats.ts`:

```typescript
import { query } from "./_generated/server"

export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user) return null

    const applications = await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()

    return {
      totalApplications: applications.length,
      pendingApplications: applications.filter(a => a.status === 'pending').length,
      interviews: applications.filter(a => a.status === 'interview').length,
      offers: applications.filter(a => a.status === 'offer').length,
      rejections: applications.filter(a => a.status === 'rejected').length,
      responseRate: applications.length > 0
        ? (applications.filter(a => a.status !== 'pending').length / applications.length) * 100
        : 0,
      totalDocuments: documents.length,
      totalResumes: documents.filter(d => d.type === 'resume').length,
      totalCoverLetters: documents.filter(d => d.type === 'cover_letter').length,
    }
  },
})
```

#### 2. Update Dashboard (2 hours)

**Update** `src/pages/SeekerDashboard.tsx`:

```typescript
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useApplications } from '@/hooks/useApplications'
import { useDocuments } from '@/hooks/useDocuments'

export default function SeekerDashboard() {
  const { user } = useCurrentUser()
  const stats = useQuery(api.stats.getUserStats)
  const { applications } = useApplications()
  const { documents } = useDocuments()

  if (!stats) return <div>Loading...</div>

  return (
    <div className="p-8">
      <h1>Welcome back, {user?.name}!</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Applications"
          value={stats.totalApplications}
          icon={<Briefcase />}
        />
        <StatCard
          label="Interviews"
          value={stats.interviews}
          icon={<Calendar />}
        />
        <StatCard
          label="Documents"
          value={stats.totalDocuments}
          icon={<FileText />}
        />
        <StatCard
          label="Response Rate"
          value={`${stats.responseRate.toFixed(0)}%`}
          icon={<TrendingUp />}
        />
      </div>

      {/* Recent Applications */}
      <RecentApplications applications={applications?.slice(0, 5)} />

      {/* Recent Documents */}
      <RecentDocuments documents={documents?.slice(0, 5)} />
    </div>
  )
}
```

### Afternoon (3-4 hours)

#### 3. Create Chat Functions (2 hours)

**Create** `convex/chat.ts`:

```typescript
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

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

    // TODO: In real implementation, call AI API here
    // For now, just echo back
    await ctx.db.insert("chatMessages", {
      userId: user._id,
      conversationId: args.conversationId,
      role: "assistant",
      content: `I received your message: "${args.content}". AI integration coming soon!`,
      timestamp: Date.now(),
    })

    return messageId
  },
})
```

#### 4. Create useChat Hook (30 min)

**Create** `src/hooks/useChat.ts` (copy from `CONVEX_CODE_EXAMPLES.md`)

#### 5. Update Chat Page (1.5 hours)

**Update** `src/pages/Chat.tsx`:

```typescript
import { useChat } from '@/hooks/useChat'
import { useState } from 'react'

export default function ChatPage() {
  const conversationId = 'main' // Or generate unique ID
  const { messages, isLoading, send, isSending } = useChat(conversationId)
  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return

    await send(input)
    setInput('')
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md p-4 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded"
            disabled={isSending}
          />
          <button
            onClick={handleSend}
            disabled={isSending}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
```

### End of Day 4 Testing (30 min)

**Test checklist**:
- [ ] Dashboard shows real stats
- [ ] Stats update after creating application
- [ ] Chat loads message history
- [ ] Can send message
- [ ] Messages appear in real-time
- [ ] All pages connected to Convex

**If tests pass**: Day 4 complete! ✓

---

## Day 5: Polish & Deploy

**Duration**: 4-6 hours
**Goal**: Clean up, test thoroughly, deploy

### Morning (2-3 hours)

#### 1. Remove Mock Data (1 hour)

Go through all files and remove mock data:

- [ ] `JobsPage.tsx` - Remove hardcoded jobs array
- [ ] `DocumentsPage.tsx` - Remove hardcoded documents
- [ ] `SeekerDashboard.tsx` - Remove hardcoded stats
- [ ] Any other components with mock data

#### 2. Add Loading States (1 hour)

Ensure all pages have proper loading states:

```typescript
if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  )
}
```

#### 3. Add Error Handling (1 hour)

Wrap mutations in try-catch:

```typescript
const handleAction = async () => {
  try {
    await mutation(args)
    toast.success('Success!')
  } catch (error) {
    toast.error(error.message || 'Something went wrong')
    console.error(error)
  }
}
```

### Afternoon (2-3 hours)

#### 4. Full Testing (1.5 hours)

**Complete user flow test**:

1. **Sign Up**
   - [ ] New user can sign up
   - [ ] User created in database
   - [ ] Redirected to dashboard

2. **Profile**
   - [ ] Can view profile
   - [ ] Can edit profile
   - [ ] Changes save correctly

3. **Documents**
   - [ ] Can create document
   - [ ] Can edit document
   - [ ] Can delete document
   - [ ] Filter by type works
   - [ ] Search works

4. **Jobs**
   - [ ] Jobs load correctly
   - [ ] Search/filter works
   - [ ] Can apply to job
   - [ ] Application tracked
   - [ ] Can't apply twice

5. **Applications**
   - [ ] View all applications
   - [ ] Stats correct
   - [ ] Can update status
   - [ ] Changes persist

6. **Chat**
   - [ ] Can send message
   - [ ] Messages appear
   - [ ] History loads
   - [ ] Real-time updates

7. **Dashboard**
   - [ ] Stats displayed
   - [ ] Recent items shown
   - [ ] Links work

#### 5. Deploy (1 hour)

**Deploy Convex Backend**:
```bash
npx convex deploy --prod
```

This creates production deployment and gives you production URL.

**Update Environment Variables**:

In your hosting platform (Netlify/Vercel), add:
```env
VITE_CONVEX_URL=https://your-production.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

**Switch Clerk to Production**:
1. In Clerk dashboard, switch to production
2. Copy production publishable key
3. Update JWT template for production domain

**Deploy Frontend**:
```bash
npm run build
# Deploy dist/ folder to your hosting
```

#### 6. Post-Deployment Testing (30 min)

Test on production:

- [ ] Can sign up/sign in
- [ ] All features work
- [ ] No console errors
- [ ] Data persists
- [ ] Real-time updates work

### End of Day 5

**Migration complete!** ✓

---

## Rollback Plan

If something goes wrong:

1. **Keep old code**: Don't delete mock data until fully tested
2. **Git branches**: Work on `feature/convex-migration` branch
3. **Incremental**: Migrate one page at a time
4. **Can revert**: Just revert commits to go back to mock data

---

## Success Metrics

After completion, you should have:

- ✅ Zero mock data in codebase
- ✅ All pages using Convex
- ✅ Authentication working
- ✅ Real-time updates
- ✅ Type-safe API
- ✅ Production deployment
- ✅ All tests passing

---

## Next Steps (Optional)

After basic migration:

1. **AI Integration**: Connect chat to OpenAI/Anthropic
2. **File Upload**: Add resume PDF upload
3. **Email Notifications**: Add Resend/SendGrid
4. **Coach Features**: Build coaching session booking
5. **Payment**: Integrate Stripe for coach payments
6. **Analytics**: Add analytics dashboard
7. **Search**: Implement full-text search
8. **Mobile App**: Build React Native app with same backend

---

**Ready to start?** Begin with Day 1, Morning, Step 1!

Good luck! 🚀
