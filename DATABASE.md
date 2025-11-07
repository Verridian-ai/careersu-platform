# Database Documentation

## Overview

CareerSU uses **Convex** as its database, a serverless NoSQL database with real-time subscriptions, vector search, and automatic scaling.

**Key Features:**
- Real-time data synchronization
- Type-safe schema with TypeScript
- Automatic indexing
- Vector search for RAG
- Serverless with auto-scaling
- Built-in migrations

---

## Table of Contents

- [Schema Overview](#schema-overview)
- [Tables](#tables)
- [Indexes](#indexes)
- [Relationships](#relationships)
- [Vector Search](#vector-search)
- [Migrations](#migrations)
- [Query Patterns](#query-patterns)
- [Performance](#performance)

---

## Schema Overview

**Location**: `convex/schema.ts`

**8 Tables:**
1. `users` - User accounts
2. `profiles` - User profiles (job seekers & coaches)
3. `documents` - Resumes, cover letters, portfolios
4. `jobs` - Job listings
5. `applications` - Job applications
6. `chatMessages` - Chat history
7. `coaches` - Coach profiles & availability
8. `sessions` - Coaching sessions

**40+ Indexes:**
- Primary indexes on all tables
- Compound indexes for complex queries
- Vector index for semantic search (1536 dimensions)

**Data Types:**
- `v.string()` - Text fields
- `v.number()` - Numeric fields
- `v.boolean()` - True/false flags
- `v.array()` - Lists
- `v.object()` - Nested objects
- `v.union()` - Enum-like types
- `v.optional()` - Nullable fields
- `v.id("tableName")` - Foreign keys

---

## Tables

### 1. Users Table

**Purpose**: Store user account information

```typescript
users: defineTable({
  email: v.string(),
  passwordHash: v.string(),
  name: v.string(),
  userType: v.union(
    v.literal("job_seeker"),
    v.literal("coach")
  ),
  avatar: v.optional(v.string()),
  emailVerified: v.boolean(),
  createdAt: v.number(),
  lastLoginAt: v.optional(v.number()),
})
```

**Fields:**
- `_id` (auto): Unique user ID
- `email` (string): Email address (unique)
- `passwordHash` (string): Hashed password (bcrypt)
- `name` (string): Full name
- `userType` (enum): "job_seeker" or "coach"
- `avatar` (string, optional): Profile picture URL
- `emailVerified` (boolean): Email verification status
- `createdAt` (number): Unix timestamp
- `lastLoginAt` (number, optional): Last login timestamp

**Indexes:**
- `by_email` - Unique index on email
- `by_userType` - Filter by user type

**Sample Document:**
```json
{
  "_id": "jh7abc123",
  "email": "john@example.com",
  "passwordHash": "$2b$10$...",
  "name": "John Doe",
  "userType": "job_seeker",
  "avatar": "https://cdn.example.com/avatar.jpg",
  "emailVerified": true,
  "createdAt": 1699900800000,
  "lastLoginAt": 1699987200000
}
```

---

### 2. Profiles Table

**Purpose**: Store detailed user profiles (separate from accounts)

```typescript
profiles: defineTable({
  userId: v.id("users"),
  bio: v.optional(v.string()),
  location: v.optional(v.string()),
  skills: v.array(v.string()),
  experience: v.array(v.object({
    company: v.string(),
    position: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    description: v.string(),
    current: v.boolean(),
  })),
  education: v.array(v.object({
    institution: v.string(),
    degree: v.string(),
    field: v.string(),
    graduationYear: v.number(),
  })),
  preferences: v.optional(v.object({
    desiredRoles: v.array(v.string()),
    desiredLocations: v.array(v.string()),
    remotePreference: v.union(
      v.literal("remote_only"),
      v.literal("hybrid"),
      v.literal("onsite"),
      v.literal("flexible")
    ),
    salaryExpectation: v.optional(v.object({
      min: v.number(),
      max: v.number(),
      currency: v.string(),
    })),
  })),
  socialLinks: v.optional(v.object({
    linkedin: v.optional(v.string()),
    github: v.optional(v.string()),
    portfolio: v.optional(v.string()),
    twitter: v.optional(v.string()),
  })),
  updatedAt: v.number(),
})
```

**Fields:**
- `_id` (auto): Profile ID
- `userId` (id): Foreign key to users table
- `bio` (string, optional): Professional summary
- `location` (string, optional): Current location
- `skills` (array): List of skills
- `experience` (array): Work history
- `education` (array): Educational background
- `preferences` (object, optional): Job preferences
- `socialLinks` (object, optional): Social media URLs
- `updatedAt` (number): Last update timestamp

**Indexes:**
- `by_userId` - Unique index (one profile per user)
- `by_skills` - Search by skills

**Sample Document:**
```json
{
  "_id": "pf7xyz789",
  "userId": "jh7abc123",
  "bio": "Senior software engineer with 5 years experience in React and Node.js",
  "location": "San Francisco, CA",
  "skills": ["TypeScript", "React", "Node.js", "AWS"],
  "experience": [
    {
      "company": "Tech Corp",
      "position": "Senior Software Engineer",
      "startDate": "2020-01",
      "endDate": null,
      "description": "Led frontend team...",
      "current": true
    }
  ],
  "education": [
    {
      "institution": "Stanford University",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "graduationYear": 2018
    }
  ],
  "preferences": {
    "desiredRoles": ["Senior Engineer", "Tech Lead"],
    "desiredLocations": ["San Francisco", "Remote"],
    "remotePreference": "hybrid",
    "salaryExpectation": {
      "min": 150000,
      "max": 200000,
      "currency": "USD"
    }
  },
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe"
  },
  "updatedAt": 1699900800000
}
```

---

### 3. Documents Table

**Purpose**: Store resumes, cover letters, and portfolios

```typescript
documents: defineTable({
  userId: v.id("users"),
  type: v.union(
    v.literal("resume"),
    v.literal("cover_letter"),
    v.literal("portfolio")
  ),
  title: v.string(),
  content: v.any(), // TipTap JSON
  plainTextContent: v.string(),
  status: v.union(
    v.literal("draft"),
    v.literal("published"),
    v.literal("archived")
  ),
  template: v.optional(v.string()),
  metadata: v.optional(v.object({
    targetRole: v.optional(v.string()),
    targetCompany: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
  })),
  createdAt: v.number(),
  updatedAt: v.number(),
  version: v.number(),
})
```

**Fields:**
- `_id` (auto): Document ID
- `userId` (id): Owner's user ID
- `type` (enum): "resume", "cover_letter", or "portfolio"
- `title` (string): Document title
- `content` (any): Rich text (TipTap JSON format)
- `plainTextContent` (string): Plain text for search/embeddings
- `status` (enum): "draft", "published", or "archived"
- `template` (string, optional): Template name used
- `metadata` (object, optional): Additional metadata
- `createdAt` (number): Creation timestamp
- `updatedAt` (number): Last update timestamp
- `version` (number): Version number for tracking changes

**Indexes:**
- `by_userId` - All documents for a user
- `by_userId_type` - Filter by user and type
- `by_status` - Filter by status

**Sample Document:**
```json
{
  "_id": "doc_abc123",
  "userId": "jh7abc123",
  "type": "resume",
  "title": "Senior Software Engineer Resume",
  "content": { "type": "doc", "content": [...] },
  "plainTextContent": "John Doe\nSenior Software Engineer...",
  "status": "published",
  "template": "modern",
  "metadata": {
    "targetRole": "Senior Engineer",
    "keywords": ["React", "TypeScript", "AWS"]
  },
  "createdAt": 1699900800000,
  "updatedAt": 1699987200000,
  "version": 3
}
```

---

### 4. Jobs Table

**Purpose**: Store job listings

```typescript
jobs: defineTable({
  title: v.string(),
  company: v.string(),
  companyLogo: v.optional(v.string()),
  location: v.string(),
  remote: v.boolean(),
  description: v.string(),
  requirements: v.array(v.string()),
  responsibilities: v.array(v.string()),
  salary: v.optional(v.object({
    min: v.number(),
    max: v.number(),
    currency: v.string(),
  })),
  experienceLevel: v.union(
    v.literal("entry"),
    v.literal("mid"),
    v.literal("senior"),
    v.literal("lead")
  ),
  jobType: v.union(
    v.literal("full_time"),
    v.literal("part_time"),
    v.literal("contract"),
    v.literal("internship")
  ),
  skills: v.array(v.string()),
  benefits: v.optional(v.array(v.string())),
  applicationUrl: v.optional(v.string()),
  postedDate: v.number(),
  expiryDate: v.optional(v.number()),
  status: v.union(
    v.literal("active"),
    v.literal("closed"),
    v.literal("filled")
  ),
})
```

**Fields:**
- `_id` (auto): Job ID
- `title` (string): Job title
- `company` (string): Company name
- `companyLogo` (string, optional): Logo URL
- `location` (string): Job location
- `remote` (boolean): Remote work allowed
- `description` (string): Full job description
- `requirements` (array): List of requirements
- `responsibilities` (array): Job responsibilities
- `salary` (object, optional): Salary range
- `experienceLevel` (enum): Required experience level
- `jobType` (enum): Employment type
- `skills` (array): Required skills
- `benefits` (array, optional): Benefits offered
- `applicationUrl` (string, optional): External application URL
- `postedDate` (number): When job was posted
- `expiryDate` (number, optional): When listing expires
- `status` (enum): "active", "closed", or "filled"

**Indexes:**
- `by_status` - Filter active jobs
- `by_company` - All jobs from a company
- `by_experienceLevel` - Filter by experience level
- `by_remote` - Remote jobs only
- `by_postedDate` - Sort by newest

**Sample Document:**
```json
{
  "_id": "job_xyz789",
  "title": "Senior React Developer",
  "company": "Tech Corp",
  "companyLogo": "https://cdn.example.com/techcorp.png",
  "location": "San Francisco, CA",
  "remote": true,
  "description": "We're looking for an experienced React developer...",
  "requirements": [
    "5+ years React experience",
    "TypeScript proficiency",
    "State management (Redux/Context)"
  ],
  "responsibilities": [
    "Build scalable web applications",
    "Mentor junior developers",
    "Code reviews and architecture decisions"
  ],
  "salary": {
    "min": 150000,
    "max": 200000,
    "currency": "USD"
  },
  "experienceLevel": "senior",
  "jobType": "full_time",
  "skills": ["React", "TypeScript", "Node.js"],
  "benefits": ["Health insurance", "401k", "Remote work"],
  "postedDate": 1699900800000,
  "expiryDate": 1702579200000,
  "status": "active"
}
```

---

### 5. Applications Table

**Purpose**: Track job applications

```typescript
applications: defineTable({
  userId: v.id("users"),
  jobId: v.id("jobs"),
  resumeId: v.id("documents"),
  coverLetterId: v.optional(v.id("documents")),
  status: v.union(
    v.literal("draft"),
    v.literal("submitted"),
    v.literal("interview"),
    v.literal("offer"),
    v.literal("rejected"),
    v.literal("accepted"),
    v.literal("withdrawn")
  ),
  appliedAt: v.number(),
  updatedAt: v.number(),
  notes: v.optional(v.string()),
  interviewDates: v.optional(v.array(v.object({
    date: v.number(),
    type: v.string(),
    notes: v.optional(v.string()),
  }))),
})
```

**Fields:**
- `_id` (auto): Application ID
- `userId` (id): Applicant's user ID
- `jobId` (id): Job being applied to
- `resumeId` (id): Resume used for application
- `coverLetterId` (id, optional): Cover letter used
- `status` (enum): Application status
- `appliedAt` (number): Application submission timestamp
- `updatedAt` (number): Last update timestamp
- `notes` (string, optional): User notes
- `interviewDates` (array, optional): Interview schedule

**Indexes:**
- `by_userId` - All applications for a user
- `by_jobId` - All applicants for a job
- `by_userId_status` - Filter user applications by status
- `by_appliedAt` - Sort by application date

**Sample Document:**
```json
{
  "_id": "app_def456",
  "userId": "jh7abc123",
  "jobId": "job_xyz789",
  "resumeId": "doc_abc123",
  "coverLetterId": "doc_ghi789",
  "status": "interview",
  "appliedAt": 1699900800000,
  "updatedAt": 1699987200000,
  "notes": "Reached out to recruiter on LinkedIn",
  "interviewDates": [
    {
      "date": 1700150400000,
      "type": "Phone screen",
      "notes": "30-minute call with hiring manager"
    }
  ]
}
```

---

### 6. Chat Messages Table

**Purpose**: Store chat conversation history

```typescript
chatMessages: defineTable({
  conversationId: v.string(),
  senderId: v.id("users"),
  receiverId: v.optional(v.id("users")), // null for AI
  role: v.union(
    v.literal("user"),
    v.literal("assistant"),
    v.literal("system")
  ),
  content: v.string(),
  metadata: v.optional(v.object({
    contextUsed: v.optional(v.array(v.string())),
    tokensUsed: v.optional(v.number()),
    model: v.optional(v.string()),
  })),
  createdAt: v.number(),
})
```

**Fields:**
- `_id` (auto): Message ID
- `conversationId` (string): Conversation identifier
- `senderId` (id): User who sent message
- `receiverId` (id, optional): Recipient (null for AI chat)
- `role` (enum): "user", "assistant", or "system"
- `content` (string): Message text
- `metadata` (object, optional): AI metadata (context, tokens, model)
- `createdAt` (number): Message timestamp

**Indexes:**
- `by_conversationId` - All messages in a conversation
- `by_senderId` - All messages from a user
- `by_createdAt` - Sort messages chronologically

**Sample Document:**
```json
{
  "_id": "msg_uvw123",
  "conversationId": "conv_abc123",
  "senderId": "jh7abc123",
  "receiverId": null,
  "role": "user",
  "content": "How can I improve my resume?",
  "createdAt": 1699900800000
}
```

---

### 7. Coaches Table

**Purpose**: Store coach profiles and availability

```typescript
coaches: defineTable({
  userId: v.id("users"),
  specializations: v.array(v.string()),
  experience: v.number(), // years
  hourlyRate: v.number(),
  bio: v.string(),
  certifications: v.array(v.string()),
  availability: v.object({
    monday: v.array(v.object({ start: v.string(), end: v.string() })),
    tuesday: v.array(v.object({ start: v.string(), end: v.string() })),
    wednesday: v.array(v.object({ start: v.string(), end: v.string() })),
    thursday: v.array(v.object({ start: v.string(), end: v.string() })),
    friday: v.array(v.object({ start: v.string(), end: v.string() })),
    saturday: v.array(v.object({ start: v.string(), end: v.string() })),
    sunday: v.array(v.object({ start: v.string(), end: v.string() })),
  }),
  rating: v.number(),
  totalSessions: v.number(),
  createdAt: v.number(),
})
```

**Fields:**
- `_id` (auto): Coach profile ID
- `userId` (id): Associated user account
- `specializations` (array): Areas of expertise
- `experience` (number): Years of coaching experience
- `hourlyRate` (number): Rate in USD
- `bio` (string): Coach biography
- `certifications` (array): Professional certifications
- `availability` (object): Weekly schedule
- `rating` (number): Average rating (0-5)
- `totalSessions` (number): Total sessions completed
- `createdAt` (number): Profile creation timestamp

**Indexes:**
- `by_userId` - Unique index (one coach profile per user)
- `by_specialization` - Search by expertise
- `by_rating` - Sort by rating

---

### 8. Sessions Table

**Purpose**: Store coaching session bookings

```typescript
sessions: defineTable({
  coachId: v.id("coaches"),
  clientId: v.id("users"),
  startTime: v.number(),
  duration: v.number(), // minutes
  sessionType: v.string(),
  status: v.union(
    v.literal("scheduled"),
    v.literal("completed"),
    v.literal("cancelled"),
    v.literal("no_show")
  ),
  notes: v.optional(v.string()),
  rating: v.optional(v.number()),
  feedback: v.optional(v.string()),
  createdAt: v.number(),
})
```

**Fields:**
- `_id` (auto): Session ID
- `coachId` (id): Coach conducting session
- `clientId` (id): Client attending session
- `startTime` (number): Session start timestamp
- `duration` (number): Duration in minutes
- `sessionType` (string): Type of session
- `status` (enum): Session status
- `notes` (string, optional): Session notes
- `rating` (number, optional): Client rating (0-5)
- `feedback` (string, optional): Client feedback
- `createdAt` (number): Booking timestamp

**Indexes:**
- `by_coachId` - All sessions for a coach
- `by_clientId` - All sessions for a client
- `by_startTime` - Sort by date

---

## Indexes

### Purpose of Indexes

Indexes improve query performance by creating fast lookup structures.

**Types:**
1. **Primary Index** - On `_id` (automatic)
2. **Single Field** - On one field (e.g., `by_email`)
3. **Compound** - On multiple fields (e.g., `by_userId_type`)
4. **Vector** - For semantic search (RAG)

### Index Strategy

**All tables have:**
- Primary index on `_id` (automatic)
- Indexes on foreign keys (e.g., `userId`)
- Indexes on common query fields (e.g., `status`)

**Example: Documents Table Indexes**

```typescript
.index("by_userId", ["userId"])
.index("by_userId_type", ["userId", "type"])
.index("by_status", ["status"])
```

**Query Performance:**
```typescript
// Fast (uses index)
ctx.db.query("documents")
  .withIndex("by_userId", (q) => q.eq("userId", currentUserId))
  .collect();

// Slow (no index, full table scan)
ctx.db.query("documents")
  .filter((q) => q.eq(q.field("someRandomField"), "value"))
  .collect();
```

---

## Relationships

### One-to-One

**User → Profile:**
```typescript
// One user has one profile
profiles.index("by_userId", ["userId"]) // Unique
```

### One-to-Many

**User → Documents:**
```typescript
// One user has many documents
const docs = await ctx.db
  .query("documents")
  .withIndex("by_userId", (q) => q.eq("userId", userId))
  .collect();
```

**Job → Applications:**
```typescript
// One job has many applications
const apps = await ctx.db
  .query("applications")
  .withIndex("by_jobId", (q) => q.eq("jobId", jobId))
  .collect();
```

### Many-to-Many

**Jobs ↔ Users (via Applications):**
```typescript
// A user applies to many jobs
// A job receives many applications
// Applications table is the join table
```

---

## Vector Search

### Embeddings Table (Implicit)

Used for RAG semantic search:

```typescript
// Stored as metadata in Convex
{
  documentId: "doc_abc123",
  embedding: [0.123, -0.456, ...], // 1536 dimensions
  text: "Senior Software Engineer with 5 years...",
  metadata: {
    type: "resume",
    section: "experience"
  }
}
```

### Vector Index

```typescript
// In schema.ts
.vectorIndex("by_embedding", {
  vectorField: "embedding",
  dimensions: 1536,
  filterFields: ["documentId", "type"]
})
```

### Vector Search Query

```typescript
// Search for similar documents
const results = await ctx.db
  .query("embeddings")
  .withSearchIndex("by_embedding", (q) =>
    q.similar("embedding", queryEmbedding, 10) // Top 10
  )
  .collect();
```

---

## Migrations

### Schema Changes

Convex handles migrations automatically:

1. Update `convex/schema.ts`
2. Save file (Convex detects change)
3. Convex validates schema
4. Schema deployed (zero-downtime)
5. Existing data remains (backward compatible)

### Adding a Field

```typescript
// Before
users: defineTable({
  email: v.string(),
  name: v.string(),
})

// After (new field)
users: defineTable({
  email: v.string(),
  name: v.string(),
  phoneNumber: v.optional(v.string()), // Must be optional!
})
```

### Renaming a Field

**Not supported directly.** Workaround:

1. Add new field (optional)
2. Migrate data (custom mutation)
3. Remove old field
4. Make new field required

### Changing Field Type

**Not supported.** Workaround:

1. Add new field with new type
2. Migrate data
3. Remove old field

---

## Query Patterns

### Basic Read

```typescript
// Get by ID
const user = await ctx.db.get(userId);

// Query with filter
const activeJobs = await ctx.db
  .query("jobs")
  .withIndex("by_status", (q) => q.eq("status", "active"))
  .collect();
```

### Pagination

```typescript
// Limit results
const jobs = await ctx.db
  .query("jobs")
  .withIndex("by_postedDate")
  .order("desc")
  .take(20); // First 20

// Offset pagination (not ideal for large datasets)
const page2 = await ctx.db
  .query("jobs")
  .withIndex("by_postedDate")
  .order("desc")
  .skip(20)
  .take(20);
```

### Joins (Manual)

```typescript
// Get application with job details
const application = await ctx.db.get(appId);
const job = await ctx.db.get(application.jobId);
const user = await ctx.db.get(application.userId);

return {
  ...application,
  job,
  user,
};
```

### Aggregation

```typescript
// Count applications by status
const applications = await ctx.db
  .query("applications")
  .withIndex("by_userId", (q) => q.eq("userId", userId))
  .collect();

const stats = {
  total: applications.length,
  submitted: applications.filter(a => a.status === "submitted").length,
  interview: applications.filter(a => a.status === "interview").length,
};
```

---

## Performance

### Query Optimization

**Use Indexes:**
```typescript
// Good: Uses index
.withIndex("by_userId", (q) => q.eq("userId", userId))

// Bad: Full table scan
.filter((q) => q.eq(q.field("userId"), userId))
```

**Limit Results:**
```typescript
// Good: Limits results
.take(20)

// Bad: Returns all (could be millions)
.collect()
```

**Avoid N+1 Queries:**
```typescript
// Bad: N+1 queries
const apps = await ctx.db.query("applications").collect();
const appsWithJobs = await Promise.all(
  apps.map(async app => ({
    ...app,
    job: await ctx.db.get(app.jobId) // N queries!
  }))
);

// Good: Batch fetch
const apps = await ctx.db.query("applications").collect();
const jobIds = [...new Set(apps.map(a => a.jobId))];
const jobs = await Promise.all(jobIds.map(id => ctx.db.get(id)));
const jobsMap = Object.fromEntries(jobs.map(j => [j._id, j]));
const appsWithJobs = apps.map(app => ({
  ...app,
  job: jobsMap[app.jobId]
}));
```

### Database Limits

**Convex Limits:**
- Document size: 1 MB max
- Query timeout: 60 seconds
- Transaction size: 8 MB max
- Batch size: 1000 documents

**Best Practices:**
- Keep documents small
- Use pagination for large datasets
- Denormalize data when needed
- Cache frequently accessed data

---

## Backup & Recovery

**Automatic Backups:**
- Convex performs automatic backups
- Point-in-time recovery available
- 30-day retention by default

**Export Data:**
```bash
# Export all data
npx convex export --output backup.jsonl

# Import data
npx convex import backup.jsonl
```

---

## Security

### Row-Level Security

```typescript
// Check permissions in every query
mutation(async (ctx, args) => {
  const user = await getCurrentUser(ctx);

  const doc = await ctx.db.get(args.documentId);
  if (doc.userId !== user._id) {
    throw new Error("Unauthorized");
  }

  // Proceed with operation
});
```

### Input Validation

```typescript
// Convex validators
mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // args are validated automatically
  }
});
```

---

## Monitoring

### Convex Dashboard

**View:**
- Query performance metrics
- Function execution logs
- Database storage usage
- Active connections
- Error rates

**Access:**
```bash
npx convex dashboard
```

---

## References

- [Convex Schema Docs](https://docs.convex.dev/database/schemas)
- [Convex Indexes Guide](https://docs.convex.dev/database/indexes)
- [Convex Vector Search](https://docs.convex.dev/vector-search)
- [API Documentation](./API_DOCUMENTATION.md)

---

**Last Updated**: November 7, 2025
**Version**: 1.0
