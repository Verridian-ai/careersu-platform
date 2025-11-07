# Convex Code Examples - Ready to Use

Complete, production-ready code examples for CareerSU platform.

---

## Table of Contents

1. [Custom React Hooks](#custom-react-hooks)
2. [Complete Convex Functions](#complete-convex-functions)
3. [Component Examples](#component-examples)
4. [Seed Data Scripts](#seed-data-scripts)
5. [Quick Start Checklist](#quick-start-checklist)

---

## Custom React Hooks

### 1. useCurrentUser Hook

Create: `src/hooks/useCurrentUser.ts`

```typescript
import { useQuery, useMutation } from 'convex/react'
import { useConvexAuth } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useEffect } from 'react'

export function useCurrentUser() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
  const user = useQuery(api.users.getCurrentUser)
  const createOrUpdate = useMutation(api.users.createOrUpdateUser)

  // Auto-create user on first login
  useEffect(() => {
    if (isAuthenticated && user === null) {
      // User is authenticated but not in database yet
      // This will be called from LoginPage after Clerk provides user info
    }
  }, [isAuthenticated, user])

  return {
    user,
    isLoading: authLoading || user === undefined,
    isAuthenticated,
    createOrUpdate,
  }
}
```

### 2. useDocuments Hook

Create: `src/hooks/useDocuments.ts`

```typescript
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { useState } from 'react'

type DocumentType = 'resume' | 'cover_letter' | 'portfolio'
type DocumentStatus = 'draft' | 'final' | 'archived'

export function useDocuments(type?: DocumentType) {
  const documents = useQuery(api.documents.getUserDocuments, type ? { type } : {})
  const createDoc = useMutation(api.documents.createDocument)
  const updateDoc = useMutation(api.documents.updateDocument)
  const deleteDoc = useMutation(api.documents.deleteDocument)

  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const create = async (data: { title: string; type: DocumentType; content: string }) => {
    setIsCreating(true)
    try {
      const id = await createDoc(data)
      return id
    } finally {
      setIsCreating(false)
    }
  }

  const update = async (
    documentId: Id<'documents'>,
    data: { title?: string; content?: string; status?: DocumentStatus }
  ) => {
    setIsUpdating(true)
    try {
      await updateDoc({ documentId, ...data })
    } finally {
      setIsUpdating(false)
    }
  }

  const remove = async (documentId: Id<'documents'>) => {
    setIsDeleting(true)
    try {
      await deleteDoc({ documentId })
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    documents,
    isLoading: documents === undefined,
    create,
    update,
    remove,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
```

### 3. useApplications Hook

Create: `src/hooks/useApplications.ts`

```typescript
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { useState } from 'react'

type ApplicationStatus =
  | 'pending'
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'

export function useApplications(status?: ApplicationStatus) {
  const applications = useQuery(
    api.applications.getUserApplications,
    status ? { status } : {}
  )
  const createApp = useMutation(api.applications.createApplication)
  const updateStatus = useMutation(api.applications.updateApplicationStatus)

  const [isApplying, setIsApplying] = useState(false)

  const apply = async (data: {
    jobId: Id<'jobs'>
    resumeId?: Id<'documents'>
    coverLetterId?: Id<'documents'>
    notes?: string
  }) => {
    setIsApplying(true)
    try {
      const id = await createApp(data)
      return id
    } finally {
      setIsApplying(false)
    }
  }

  const updateAppStatus = async (
    applicationId: Id<'applications'>,
    status: ApplicationStatus,
    notes?: string
  ) => {
    await updateStatus({ applicationId, status, notes })
  }

  // Compute stats
  const stats = applications
    ? {
        total: applications.length,
        pending: applications.filter((a) => a.status === 'pending').length,
        interviews: applications.filter((a) => a.status === 'interview').length,
        offers: applications.filter((a) => a.status === 'offer').length,
        rejected: applications.filter((a) => a.status === 'rejected').length,
      }
    : null

  return {
    applications,
    stats,
    isLoading: applications === undefined,
    apply,
    updateStatus: updateAppStatus,
    isApplying,
  }
}
```

### 4. useJobs Hook

Create: `src/hooks/useJobs.ts`

```typescript
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { useState, useMemo } from 'react'

interface JobFilters {
  type?: string
  location?: string
  remote?: boolean
  limit?: number
}

export function useJobs(filters?: JobFilters) {
  const jobs = useQuery(api.jobs.getActiveJobs, filters || {})
  const [searchQuery, setSearchQuery] = useState('')

  // Client-side filtering for search
  const filteredJobs = useMemo(() => {
    if (!jobs || !searchQuery) return jobs

    const query = searchQuery.toLowerCase()
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
    )
  }, [jobs, searchQuery])

  return {
    jobs: filteredJobs,
    allJobs: jobs,
    isLoading: jobs === undefined,
    searchQuery,
    setSearchQuery,
  }
}

export function useJobWithApplication(jobId: Id<'jobs'>) {
  const data = useQuery(api.jobs.getJobWithApplicationStatus, { jobId })

  return {
    job: data?.job,
    application: data?.application,
    isLoading: data === undefined,
    hasApplied: !!data?.application,
  }
}
```

### 5. useChat Hook

Create: `src/hooks/useChat.ts`

```typescript
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { useState } from 'react'

export function useChat(conversationId: string) {
  const messages = useQuery(api.chat.getChatHistory, { conversationId })
  const sendMsg = useMutation(api.chat.sendMessage)
  const [isSending, setIsSending] = useState(false)

  const send = async (
    content: string,
    context?: {
      jobId?: Id<'jobs'>
      documentId?: Id<'documents'>
      applicationId?: Id<'applications'>
    }
  ) => {
    setIsSending(true)
    try {
      await sendMsg({ conversationId, content, context })
    } finally {
      setIsSending(false)
    }
  }

  return {
    messages,
    isLoading: messages === undefined,
    send,
    isSending,
  }
}
```

---

## Complete Convex Functions

### convex/schema.ts

```typescript
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("job_seeker"), v.literal("coach")),
    avatar: v.optional(v.string()),
    tokenIdentifier: v.string(),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    phone: v.optional(v.string()),
    currentTitle: v.optional(v.string()),
    yearsExperience: v.optional(v.number()),
    skills: v.optional(v.array(v.string())),
    targetRoles: v.optional(v.array(v.string())),
    specializations: v.optional(v.array(v.string())),
    hourlyRate: v.optional(v.number()),
    rating: v.optional(v.number()),
    totalSessions: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  documents: defineTable({
    userId: v.id("users"),
    title: v.string(),
    type: v.union(v.literal("resume"), v.literal("cover_letter"), v.literal("portfolio")),
    content: v.string(),
    status: v.union(v.literal("draft"), v.literal("final"), v.literal("archived")),
    version: v.number(),
    fileSize: v.optional(v.number()),
    fileUrl: v.optional(v.string()),
    aiSummary: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    createdAt: v.number(),
    lastModified: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_type", ["userId", "type"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_modified", ["lastModified"]),

  jobs: defineTable({
    title: v.string(),
    company: v.string(),
    location: v.string(),
    type: v.union(v.literal("full-time"), v.literal("part-time"), v.literal("contract"), v.literal("remote")),
    salary: v.optional(v.object({ min: v.number(), max: v.number(), currency: v.string() })),
    description: v.string(),
    requirements: v.array(v.string()),
    responsibilities: v.optional(v.array(v.string())),
    benefits: v.optional(v.array(v.string())),
    companyLogo: v.optional(v.string()),
    companySize: v.optional(v.string()),
    companyIndustry: v.optional(v.string()),
    remote: v.boolean(),
    experienceLevel: v.optional(v.union(v.literal("entry"), v.literal("mid"), v.literal("senior"), v.literal("lead"))),
    skills: v.optional(v.array(v.string())),
    externalId: v.optional(v.string()),
    externalUrl: v.optional(v.string()),
    isActive: v.boolean(),
    posted: v.number(),
    deadline: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_company", ["company"])
    .index("by_type", ["type"])
    .index("by_active", ["isActive"])
    .index("by_posted", ["posted"])
    .index("by_location", ["location"]),

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
    resumeId: v.optional(v.id("documents")),
    coverLetterId: v.optional(v.id("documents")),
    portfolioId: v.optional(v.id("documents")),
    matchScore: v.optional(v.number()),
    matchReasons: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    followUpDate: v.optional(v.number()),
    interviewDates: v.optional(v.array(v.number())),
    recruiterName: v.optional(v.string()),
    recruiterEmail: v.optional(v.string()),
    recruiterPhone: v.optional(v.string()),
    appliedAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_job", ["jobId"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_status", ["status"])
    .index("by_applied_date", ["appliedAt"]),

  chatMessages: defineTable({
    userId: v.id("users"),
    conversationId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
    model: v.optional(v.string()),
    tokens: v.optional(v.number()),
    context: v.optional(
      v.object({
        jobId: v.optional(v.id("jobs")),
        documentId: v.optional(v.id("documents")),
        applicationId: v.optional(v.id("applications")),
      })
    ),
    attachments: v.optional(v.array(v.object({ type: v.string(), url: v.string(), name: v.string() }))),
    rating: v.optional(v.number()),
    feedback: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_conversation", ["conversationId"])
    .index("by_user_and_conversation", ["userId", "conversationId"])
    .index("by_timestamp", ["timestamp"]),

  coachProfiles: defineTable({
    userId: v.id("users"),
    title: v.string(),
    yearsExperience: v.number(),
    specializations: v.array(v.string()),
    certifications: v.optional(v.array(v.string())),
    availability: v.object({
      timezone: v.string(),
      scheduleSlots: v.array(
        v.object({
          dayOfWeek: v.number(),
          startTime: v.string(),
          endTime: v.string(),
        })
      ),
    }),
    hourlyRate: v.number(),
    packageDeals: v.optional(
      v.array(v.object({ name: v.string(), sessions: v.number(), price: v.number(), description: v.string() }))
    ),
    rating: v.number(),
    totalReviews: v.number(),
    totalSessions: v.number(),
    totalClients: v.number(),
    isActive: v.boolean(),
    isAcceptingClients: v.boolean(),
    videoIntroUrl: v.optional(v.string()),
    portfolioUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_active", ["isActive"])
    .index("by_rating", ["rating"]),

  coachingSessions: defineTable({
    coachId: v.id("users"),
    clientId: v.id("users"),
    coachProfileId: v.id("coachProfiles"),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("resume_review"),
      v.literal("interview_prep"),
      v.literal("career_strategy"),
      v.literal("salary_negotiation"),
      v.literal("general")
    ),
    scheduledAt: v.number(),
    duration: v.number(),
    timezone: v.string(),
    meetingUrl: v.optional(v.string()),
    meetingId: v.optional(v.string()),
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show")
    ),
    price: v.number(),
    paymentStatus: v.union(v.literal("pending"), v.literal("paid"), v.literal("refunded")),
    paymentId: v.optional(v.string()),
    coachNotes: v.optional(v.string()),
    clientNotes: v.optional(v.string()),
    actionItems: v.optional(v.array(v.string())),
    rating: v.optional(v.number()),
    review: v.optional(v.string()),
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
})
```

### convex/users.ts

```typescript
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

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

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId)
  },
})

export const createOrUpdateUser = mutation({
  args: {
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
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
        avatar: args.avatar,
        updatedAt: now,
      })
      return existingUser._id
    }

    return await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      email: args.email,
      name: args.name,
      avatar: args.avatar,
      role: args.role,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const updateProfile = mutation({
  args: {
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    phone: v.optional(v.string()),
    currentTitle: v.optional(v.string()),
    yearsExperience: v.optional(v.number()),
    skills: v.optional(v.array(v.string())),
    targetRoles: v.optional(v.array(v.string())),
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

    return user._id
  },
})
```

### convex/documents.ts

```typescript
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getUserDocuments = query({
  args: {
    type: v.optional(v.union(v.literal("resume"), v.literal("cover_letter"), v.literal("portfolio"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user) return []

    let query = ctx.db.query("documents").withIndex("by_user", (q) => q.eq("userId", user._id))

    const docs = await query.order("desc").collect()

    if (args.type) {
      return docs.filter((doc) => doc.type === args.type)
    }

    return docs
  },
})

export const getDocumentById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const doc = await ctx.db.get(args.documentId)
    if (!doc) return null

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first()

    if (!user || doc.userId !== user._id) {
      throw new Error("Not authorized")
    }

    return doc
  },
})

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

    const { documentId, ...updates } = args

    await ctx.db.patch(documentId, {
      ...updates,
      lastModified: Date.now(),
    })
  },
})

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

---

## Component Examples

### Updated DocumentsPage with Convex

```typescript
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '@/components/layout/Navigation'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { useDocuments } from '@/hooks/useDocuments'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { FileText, Plus, Search, Edit, Download, Copy, Star, Clock, Calendar } from 'lucide-react'
import { format } from 'date-fns'

const DocumentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'resumes' | 'cover-letters'>('all')

  const { user, isLoading: userLoading } = useCurrentUser()
  const { documents, isLoading: docsLoading, remove } = useDocuments(
    filterType === 'all' ? undefined : filterType === 'resumes' ? 'resume' : 'cover_letter'
  )

  const isLoading = userLoading || docsLoading

  const filteredDocuments = documents?.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation isAuthenticated={true} userType="seeker" />
        <div className="pt-24 text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation isAuthenticated={true} userType="seeker" />

      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto container-padding">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-responsive-2xl font-bold text-foreground mb-2">My Documents</h1>
                <p className="text-responsive-base text-muted-foreground">
                  Create and manage your resumes and cover letters
                </p>
              </div>
              <Link to="/documents/new">
                <Button size="lg" className="w-full sm:w-auto">
                  <Plus className="w-5 h-5 mr-2" />
                  New Document
                </Button>
              </Link>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11"
                  glass
                />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                <Button
                  variant={filterType === 'all' ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => setFilterType('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'resumes' ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => setFilterType('resumes')}
                >
                  Resumes
                </Button>
                <Button
                  variant={filterType === 'cover-letters' ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => setFilterType('cover-letters')}
                >
                  Cover Letters
                </Button>
              </div>
            </div>
          </div>

          {/* Documents Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-responsive-xl font-semibold text-foreground">
                Recent Documents ({filteredDocuments?.length || 0})
              </h2>
            </div>

            {!filteredDocuments || filteredDocuments.length === 0 ? (
              <Card glass className="text-center p-8 sm:p-12">
                <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-responsive-lg font-semibold text-foreground mb-2">
                  No documents found
                </h3>
                <p className="text-responsive-sm text-muted-foreground mb-6">
                  {searchQuery ? 'Try adjusting your search query' : 'Create your first document to get started'}
                </p>
                <Link to="/documents/new">
                  <Button size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Document
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredDocuments.map((doc) => (
                  <Card key={doc._id} glass hover>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base sm:text-lg">{doc.title}</CardTitle>
                          <CardDescription className="capitalize">{doc.type.replace('_', ' ')}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-2 text-responsive-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>Modified {format(doc.lastModified, 'PPp')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Created {format(doc.createdAt, 'PP')}</span>
                        </div>
                        <div className="pt-2">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                              doc.status === 'final'
                                ? 'bg-green-100 text-green-700'
                                : doc.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <div className="grid grid-cols-3 gap-2 w-full">
                        <Link to={`/documents/edit/${doc._id}`}>
                          <Button variant="ghost" size="sm" className="flex-col h-auto py-2 w-full">
                            <Edit className="w-4 h-4 mb-1" />
                            <span className="text-xs">Edit</span>
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
                          <Download className="w-4 h-4 mb-1" />
                          <span className="text-xs">Export</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-col h-auto py-2"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this document?')) {
                              remove(doc._id)
                            }
                          }}
                        >
                          <Copy className="w-4 h-4 mb-1" />
                          <span className="text-xs">Delete</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentsPage
```

---

## Seed Data Scripts

### convex/seedJobs.ts

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
        description: "Build scalable web applications using React and Node.js",
        requirements: ["5+ years experience", "React", "Node.js", "TypeScript", "AWS"],
        responsibilities: ["Lead development", "Code reviews", "Mentor juniors"],
        benefits: ["Health insurance", "401k", "Remote work"],
        remote: true,
        experienceLevel: "senior" as const,
        skills: ["React", "Node.js", "TypeScript", "AWS"],
        isActive: true,
        posted: Date.now(),
        createdAt: Date.now(),
      },
      {
        title: "Product Manager",
        company: "InnovateLabs",
        location: "Remote",
        type: "full-time" as const,
        salary: { min: 100000, max: 150000, currency: "USD" },
        description: "Lead product strategy and development for our SaaS platform",
        requirements: ["3+ years PM experience", "Agile", "Data-driven", "Technical background"],
        responsibilities: ["Define roadmap", "Stakeholder management", "Feature prioritization"],
        benefits: ["Remote first", "Stock options", "Unlimited PTO"],
        remote: true,
        experienceLevel: "mid" as const,
        skills: ["Product Strategy", "Agile", "Analytics", "Leadership"],
        isActive: true,
        posted: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1 week ago
        createdAt: Date.now(),
      },
      // Add more jobs as needed
    ]

    for (const job of jobs) {
      await ctx.db.insert("jobs", job)
    }

    return { inserted: jobs.length }
  },
})
```

**Run seed script**:
In Convex dashboard console, run: `await api.seedJobs.seedJobs({})`

---

## Quick Start Checklist

### Initial Setup (30 minutes)

- [ ] Run `npx convex dev` to initialize Convex
- [ ] Add `VITE_CONVEX_URL` to `.env.local`
- [ ] Update `src/main.tsx` with ConvexProvider
- [ ] Test that Convex dashboard opens

### Clerk Authentication (45 minutes)

- [ ] Install: `npm install @clerk/clerk-react`
- [ ] Create Clerk account and application
- [ ] Add `VITE_CLERK_PUBLISHABLE_KEY` to `.env.local`
- [ ] Create JWT template named "convex" in Clerk dashboard
- [ ] Create `convex/auth.config.ts`
- [ ] Add `CLERK_JWT_ISSUER_DOMAIN` to Convex dashboard env
- [ ] Update `src/main.tsx` with ClerkProvider and ConvexProviderWithClerk
- [ ] Test sign in/sign out flow

### Schema & Functions (1 hour)

- [ ] Copy `convex/schema.ts` from this guide
- [ ] Create `convex/users.ts` with user queries/mutations
- [ ] Create `convex/documents.ts` with document operations
- [ ] Create `convex/jobs.ts` with job queries
- [ ] Create `convex/applications.ts` with application tracking
- [ ] Verify types are generated in `convex/_generated/`

### Custom Hooks (30 minutes)

- [ ] Create `src/hooks/useCurrentUser.ts`
- [ ] Create `src/hooks/useDocuments.ts`
- [ ] Create `src/hooks/useApplications.ts`
- [ ] Create `src/hooks/useJobs.ts`

### Seed Data (15 minutes)

- [ ] Create `convex/seedJobs.ts`
- [ ] Run seed script in Convex dashboard
- [ ] Verify data appears in Convex dashboard

### Update Components (2-3 hours)

- [ ] Update `DocumentsPage.tsx` to use Convex hooks
- [ ] Update `JobsPage.tsx` to use Convex hooks
- [ ] Update `SeekerDashboard.tsx` to use Convex hooks
- [ ] Add authentication guards to protected pages
- [ ] Test all CRUD operations

### Testing (1 hour)

- [ ] Test user creation on first login
- [ ] Test document creation, editing, deletion
- [ ] Test job browsing and filtering
- [ ] Test application submission
- [ ] Verify real-time updates across tabs

### Deployment

- [ ] Run `npx convex deploy --prod`
- [ ] Add production env vars to hosting platform
- [ ] Deploy frontend
- [ ] Test production deployment

**Total estimated time: 6-8 hours for complete migration**

---

## Tips & Troubleshooting

1. **Keep Convex dev server running**: Always have `npx convex dev` running during development
2. **Check dashboard logs**: Use Convex dashboard to debug function errors
3. **Use generated types**: Import from `convex/_generated/api` for type safety
4. **Handle loading states**: Queries return `undefined` while loading
5. **Authentication first**: Always get user identity before database operations
6. **Use indexes**: Add indexes for frequently queried fields
7. **Real-time by default**: useQuery automatically updates on data changes

---

**Ready to start?** Follow the Quick Start Checklist above!
