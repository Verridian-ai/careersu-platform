# Convex Quick Reference Guide

Quick reference for common Convex operations in CareerSU platform.

---

## Environment Setup

### Required Environment Variables

**.env.local** (Frontend):
```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

**Convex Dashboard Settings** (Backend):
```env
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-domain.clerk.accounts.dev
```

---

## Common Patterns

### 1. Query Data (Read)

```typescript
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'

// Simple query
const user = useQuery(api.users.getCurrentUser)

// Query with args
const job = useQuery(api.jobs.getJobById, { jobId: "j..." })

// Optional query (only runs when args present)
const job = useQuery(
  jobId ? api.jobs.getJobById : "skip",
  jobId ? { jobId } : "skip"
)

// Handle loading state
if (user === undefined) return <div>Loading...</div>
if (user === null) return <div>Not found</div>
return <div>{user.name}</div>
```

### 2. Mutate Data (Write)

```typescript
import { useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'

function MyComponent() {
  const createDoc = useMutation(api.documents.createDocument)

  const handleCreate = async () => {
    try {
      const id = await createDoc({
        title: "My Resume",
        type: "resume",
        content: "..."
      })
      console.log("Created:", id)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return <button onClick={handleCreate}>Create</button>
}
```

### 3. Get Authenticated User

**In React**:
```typescript
import { useConvexAuth } from 'convex/react'
import { Authenticated, Unauthenticated } from 'convex/react'

function App() {
  const { isAuthenticated, isLoading } = useConvexAuth()

  return (
    <>
      <Authenticated>
        <ProtectedContent />
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
    </>
  )
}
```

**In Convex Function**:
```typescript
export const myFunction = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    // identity.tokenIdentifier, identity.email, identity.name
  }
})
```

### 4. Paginated Queries

```typescript
import { usePaginatedQuery } from 'convex/react'
import { api } from '../convex/_generated/api'

function JobsList() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.jobs.getActiveJobs,
    {},
    { initialNumItems: 20 }
  )

  return (
    <div>
      {results.map(job => <JobCard key={job._id} job={job} />)}
      {status === "CanLoadMore" && (
        <button onClick={() => loadMore(10)}>Load More</button>
      )}
    </div>
  )
}
```

### 5. Optimistic Updates

```typescript
const updateDoc = useMutation(api.documents.updateDocument)

const handleUpdate = async (docId, title) => {
  // Optimistically update UI
  setLocalTitle(title)

  try {
    await updateDoc({ documentId: docId, title })
  } catch (error) {
    // Revert on error
    setLocalTitle(originalTitle)
  }
}
```

---

## Schema Patterns

### Define Table

```typescript
import { defineTable } from "convex/server"
import { v } from "convex/values"

defineTable({
  // Required fields
  title: v.string(),
  count: v.number(),
  isActive: v.boolean(),

  // Optional fields
  bio: v.optional(v.string()),

  // Arrays
  tags: v.array(v.string()),

  // Objects
  metadata: v.object({
    key: v.string(),
    value: v.number(),
  }),

  // Unions (enums)
  status: v.union(v.literal("draft"), v.literal("published")),

  // References
  userId: v.id("users"),

  // Timestamps
  createdAt: v.number(),
})
```

### Add Indexes

```typescript
defineTable({
  email: v.string(),
  role: v.string(),
  createdAt: v.number(),
})
  .index("by_email", ["email"])
  .index("by_role", ["role"])
  .index("by_role_and_email", ["role", "email"])
```

---

## Query Patterns

### Simple Query

```typescript
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tableName").collect()
  },
})
```

### Query with Index

```typescript
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()
  },
})
```

### Query with Filter

```typescript
export const getActiveJobs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("jobs")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect()
  },
})
```

### Query with Order

```typescript
export const getRecentPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_created", (q) => q.eq("status", "published"))
      .order("desc")
      .take(10)
  },
})
```

### Complex Query with Multiple Conditions

```typescript
export const searchJobs = query({
  args: {
    location: v.optional(v.string()),
    type: v.optional(v.string()),
    remote: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("jobs")

    const jobs = await query.collect()

    // Apply filters
    let filtered = jobs.filter(j => j.isActive)

    if (args.location) {
      filtered = filtered.filter(j =>
        j.location.toLowerCase().includes(args.location!.toLowerCase())
      )
    }

    if (args.type) {
      filtered = filtered.filter(j => j.type === args.type)
    }

    if (args.remote !== undefined) {
      filtered = filtered.filter(j => j.remote === args.remote)
    }

    return filtered
  },
})
```

---

## Mutation Patterns

### Simple Insert

```typescript
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    return await ctx.db.insert("documents", {
      ...args,
      userId: identity.sub,
      createdAt: Date.now(),
    })
  },
})
```

### Update (Patch)

```typescript
export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args

    // Verify ownership
    const doc = await ctx.db.get(id)
    if (!doc) throw new Error("Not found")

    const identity = await ctx.auth.getUserIdentity()
    if (doc.userId !== identity?.sub) throw new Error("Not authorized")

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    })
  },
})
```

### Delete

```typescript
export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    // Verify ownership
    const doc = await ctx.db.get(args.id)
    if (!doc) throw new Error("Not found")

    const identity = await ctx.auth.getUserIdentity()
    if (doc.userId !== identity?.sub) throw new Error("Not authorized")

    await ctx.db.delete(args.id)
  },
})
```

### Replace (Full Update)

```typescript
export const replace = mutation({
  args: {
    id: v.id("documents"),
    title: v.string(),
    content: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args

    await ctx.db.replace(id, {
      ...data,
      updatedAt: Date.now(),
    })
  },
})
```

---

## Authorization Patterns

### Get Current User Helper

```typescript
async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) return null

  return await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .first()
}
```

### Require Authentication

```typescript
export const protectedAction = mutation({
  args: { /* ... */ },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")

    // ... perform action
  },
})
```

### Check Ownership

```typescript
export const updateDocument = mutation({
  args: { documentId: v.id("documents"), title: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")

    const doc = await ctx.db.get(args.documentId)
    if (!doc) throw new Error("Document not found")

    if (doc.userId !== user._id) {
      throw new Error("Not authorized to modify this document")
    }

    await ctx.db.patch(args.documentId, { title: args.title })
  },
})
```

### Role-Based Access

```typescript
export const adminAction = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user) throw new Error("Not authenticated")

    if (user.role !== "admin") {
      throw new Error("Admin access required")
    }

    // ... perform admin action
  },
})
```

---

## File Storage

### Upload File

```typescript
import { mutation } from "./_generated/server"

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  },
})
```

**In React**:
```typescript
const generateUploadUrl = useMutation(api.files.generateUploadUrl)

const handleFileUpload = async (file: File) => {
  // Get upload URL
  const uploadUrl = await generateUploadUrl()

  // Upload file
  const result = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  })

  const { storageId } = await result.json()

  // Save reference in database
  await saveDocument({ fileStorageId: storageId })
}
```

### Get File URL

```typescript
export const getFileUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId)
  },
})
```

---

## Scheduling (Cron Jobs)

### Define Scheduled Function

Create `convex/crons.ts`:

```typescript
import { cronJobs } from "convex/server"
import { internal } from "./_generated/api"

const crons = cronJobs()

// Run every day at midnight
crons.daily(
  "cleanup-old-data",
  { hourUTC: 0, minuteUTC: 0 },
  internal.tasks.cleanupOldData
)

// Run every hour
crons.hourly(
  "send-reminders",
  { minuteUTC: 0 },
  internal.notifications.sendReminders
)

export default crons
```

### Internal Function (Only Callable by System)

```typescript
import { internalMutation } from "./_generated/server"

export const cleanupOldData = internalMutation({
  args: {},
  handler: async (ctx) => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

    const oldDocs = await ctx.db
      .query("documents")
      .filter((q) => q.lt(q.field("createdAt"), thirtyDaysAgo))
      .collect()

    for (const doc of oldDocs) {
      await ctx.db.delete(doc._id)
    }
  },
})
```

---

## Actions (External API Calls)

```typescript
import { action } from "./_generated/server"
import { api } from "./_generated/api"
import { v } from "convex/values"

export const sendEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    // Actions can call external APIs
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: args.to }] }],
        from: { email: "noreply@careersu.com" },
        subject: args.subject,
        content: [{ type: "text/plain", value: args.body }],
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`)
    }

    // Actions can call mutations
    await ctx.runMutation(api.emails.logSent, {
      to: args.to,
      subject: args.subject,
      sentAt: Date.now(),
    })
  },
})
```

**Call from React**:
```typescript
const sendEmail = useAction(api.emails.sendEmail)

await sendEmail({
  to: "user@example.com",
  subject: "Welcome!",
  body: "Thanks for joining CareerSU"
})
```

---

## Testing Queries in Dashboard

### Open Dashboard Console

1. Go to your Convex dashboard
2. Click "Functions" > Your function
3. Click "Run in Console"
4. Enter arguments as JSON

### Example Test Queries

```javascript
// Test getCurrentUser
await api.users.getCurrentUser({})

// Test getUserDocuments with filter
await api.documents.getUserDocuments({ type: "resume" })

// Test job search
await api.jobs.getActiveJobs({ limit: 10, type: "remote" })
```

---

## Common Errors & Solutions

### Error: "No auth provider found"
**Solution**: Check `convex/auth.config.ts` and `CLERK_JWT_ISSUER_DOMAIN` env var

### Error: "Cannot read property '_id' of undefined"
**Solution**: Handle loading state: `if (data === undefined) return <Loading />`

### Error: "Not authenticated"
**Solution**: Ensure user is logged in and Clerk JWT template is named "convex"

### Error: "Invalid argument type"
**Solution**: Check that argument types match schema validators

### TypeScript errors with generated types
**Solution**: Restart `npx convex dev` and restart TypeScript server

---

## Performance Tips

1. **Use Indexes**: Add indexes for frequently queried fields
2. **Limit Results**: Use `.take(n)` or pagination
3. **Denormalize**: Store computed values (e.g., counts, stats)
4. **Batch Operations**: Group multiple operations in single mutation
5. **Client-Side Filtering**: Use client-side filtering for search
6. **Cache Strategy**: Queries are cached automatically
7. **Conditional Queries**: Skip queries with `"skip"` when args not ready

---

## Debugging

### Console Logs

```typescript
export const myFunction = query({
  args: {},
  handler: async (ctx) => {
    console.log("Starting query...")

    const data = await ctx.db.query("users").collect()
    console.log("Found users:", data.length)

    return data
  },
})
```

Logs appear in Convex dashboard under "Logs" tab.

### Dashboard Logs

- **Real-time**: See function calls and errors in real-time
- **Filter**: Filter by function name, log level, or time range
- **Search**: Search log messages

### TypeScript Type Checking

```typescript
import { Doc, Id } from "../convex/_generated/dataModel"

// Use generated types
const user: Doc<"users"> = await ctx.db.get(userId)
const docId: Id<"documents"> = user.lastDocumentId
```

---

## Migration Checklist

### Before Migration
- [ ] Backup current mock data
- [ ] Test Convex setup in development
- [ ] Create all necessary Convex functions
- [ ] Test authentication flow

### During Migration
- [ ] Update one page at a time
- [ ] Keep old code commented out initially
- [ ] Test each page thoroughly before moving to next
- [ ] Update tests

### After Migration
- [ ] Remove all mock data
- [ ] Remove unused code
- [ ] Run full test suite
- [ ] Deploy to staging
- [ ] Get user feedback
- [ ] Deploy to production

---

## Useful Commands

```bash
# Start development server
npx convex dev

# Deploy to production
npx convex deploy

# Run migrations
npx convex import --table tableName data.jsonl

# Export data
npx convex export

# Clear all data (dangerous!)
npx convex data clear

# View logs
npx convex logs --watch

# Run function from CLI
npx convex run functionName '{"arg": "value"}'
```

---

## Additional Resources

- [Convex Documentation](https://docs.convex.dev/)
- [Convex Stack (Community)](https://stack.convex.dev/)
- [Clerk + Convex Guide](https://docs.convex.dev/auth/clerk)
- [React Hooks Guide](https://docs.convex.dev/client/react)
- [TypeScript Guide](https://docs.convex.dev/understanding/best-practices/typescript)

---

**Last Updated**: November 7, 2025
