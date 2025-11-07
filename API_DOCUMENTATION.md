# API Documentation

## Overview

CareerSU uses **Convex** as its backend, providing type-safe, real-time APIs. All API functions are defined in the `/convex` directory and automatically generate TypeScript types.

---

## Table of Contents

- [Authentication](#authentication)
- [Users & Profiles](#users--profiles)
- [Documents](#documents)
- [Jobs](#jobs)
- [Applications](#applications)
- [Chat & AI](#chat--ai)
- [Coaches & Sessions](#coaches--sessions)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Authentication

### Register User

```typescript
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

const register = useMutation(api.auth.register);

await register({
  email: "user@example.com",
  password: "SecurePass123!",
  name: "John Doe",
  userType: "job_seeker" // or "coach"
});
```

**Parameters:**
- `email` (string, required): User's email address
- `password` (string, required): Password (min 8 characters)
- `name` (string, required): Full name
- `userType` (string, required): Either "job_seeker" or "coach"

**Returns:** User ID

**Errors:**
- `EMAIL_ALREADY_EXISTS`: Email is already registered
- `INVALID_EMAIL`: Email format is invalid
- `WEAK_PASSWORD`: Password doesn't meet requirements

---

### Login

```typescript
const login = useMutation(api.auth.login);

const result = await login({
  email: "user@example.com",
  password: "SecurePass123!"
});
```

**Returns:**
```typescript
{
  userId: string;
  token: string;
  userType: "job_seeker" | "coach";
}
```

---

## Users & Profiles

### Get User Profile

```typescript
import { useQuery } from "convex/react";

const user = useQuery(api.users.getUser, {
  userId: "user_123"
});
```

**Returns:**
```typescript
{
  _id: string;
  email: string;
  name: string;
  userType: "job_seeker" | "coach";
  avatar?: string;
  createdAt: number;
  profile?: {
    bio: string;
    location: string;
    skills: string[];
    experience: Array<{
      company: string;
      position: string;
      startDate: string;
      endDate?: string;
      description: string;
    }>;
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      graduationYear: number;
    }>;
  };
}
```

### Update Profile

```typescript
const updateProfile = useMutation(api.users.updateProfile);

await updateProfile({
  userId: "user_123",
  updates: {
    bio: "Experienced software engineer...",
    skills: ["TypeScript", "React", "Node.js"],
    location: "San Francisco, CA"
  }
});
```

### Search Users

```typescript
const users = useQuery(api.users.searchUsers, {
  query: "software engineer",
  userType: "job_seeker",
  limit: 20
});
```

---

## Documents

### Create Document

```typescript
const createDocument = useMutation(api.documents.create);

const documentId = await createDocument({
  userId: "user_123",
  type: "resume", // or "cover_letter", "portfolio"
  title: "Senior Software Engineer Resume",
  content: {
    // TipTap JSON format
    type: "doc",
    content: [...]
  }
});
```

**Parameters:**
- `userId` (string, required)
- `type` (string, required): "resume", "cover_letter", or "portfolio"
- `title` (string, required)
- `content` (object, required): TipTap JSON
- `metadata` (object, optional): Additional metadata

### Get User Documents

```typescript
const documents = useQuery(api.documents.getUserDocuments, {
  userId: "user_123",
  type: "resume" // optional filter
});
```

**Returns:** Array of documents

### Update Document

```typescript
const updateDocument = useMutation(api.documents.update);

await updateDocument({
  documentId: "doc_123",
  updates: {
    title: "Updated Resume Title",
    content: newContent,
    status: "published" // draft, published, archived
  }
});
```

### Delete Document

```typescript
const deleteDocument = useMutation(api.documents.delete);

await deleteDocument({
  documentId: "doc_123"
});
```

### Generate Document Embedding

```typescript
const generateEmbedding = useMutation(api.embeddings.generateDocumentEmbedding);

await generateEmbedding({
  documentId: "doc_123"
});
```

---

## Jobs

### Search Jobs

```typescript
const jobs = useQuery(api.jobs.searchJobs, {
  query: "software engineer",
  location: "San Francisco",
  remote: true,
  experienceLevel: "mid",
  limit: 20,
  offset: 0
});
```

**Parameters:**
- `query` (string, optional): Search keywords
- `location` (string, optional): Location filter
- `remote` (boolean, optional): Remote jobs only
- `experienceLevel` (string, optional): "entry", "mid", "senior"
- `jobType` (string, optional): "full_time", "part_time", "contract"
- `salaryMin` (number, optional): Minimum salary
- `salaryMax` (number, optional): Maximum salary
- `limit` (number, optional): Results per page (default: 20)
- `offset` (number, optional): Pagination offset (default: 0)

**Returns:**
```typescript
{
  jobs: Array<{
    _id: string;
    title: string;
    company: string;
    location: string;
    remote: boolean;
    description: string;
    requirements: string[];
    salary: {
      min: number;
      max: number;
      currency: string;
    };
    experienceLevel: string;
    jobType: string;
    postedDate: number;
  }>;
  total: number;
  hasMore: boolean;
}
```

### Get Job Details

```typescript
const job = useQuery(api.jobs.getJob, {
  jobId: "job_123"
});
```

### Get Job Matches (AI-powered)

```typescript
const matches = useQuery(api.jobs.getJobMatches, {
  userId: "user_123",
  limit: 10
});
```

**Returns:** Jobs ranked by AI matching score (0-100)

---

## Applications

### Create Application

```typescript
const createApplication = useMutation(api.applications.create);

await createApplication({
  userId: "user_123",
  jobId: "job_123",
  resumeId: "doc_123",
  coverLetterId: "doc_456",
  status: "submitted"
});
```

### Get User Applications

```typescript
const applications = useQuery(api.applications.getUserApplications, {
  userId: "user_123",
  status: "submitted" // optional filter
});
```

**Returns:**
```typescript
Array<{
  _id: string;
  userId: string;
  jobId: string;
  job: Job; // Populated job details
  resumeId: string;
  coverLetterId?: string;
  status: "draft" | "submitted" | "interview" | "offer" | "rejected";
  appliedAt: number;
  notes?: string;
}>
```

### Update Application Status

```typescript
const updateStatus = useMutation(api.applications.updateStatus);

await updateStatus({
  applicationId: "app_123",
  status: "interview",
  notes: "Phone interview scheduled for next week"
});
```

### Get Application Statistics

```typescript
const stats = useQuery(api.applications.getStats, {
  userId: "user_123"
});
```

**Returns:**
```typescript
{
  total: number;
  byStatus: {
    draft: number;
    submitted: number;
    interview: number;
    offer: number;
    rejected: number;
  };
  responseRate: number;
  averageDaysToInterview: number;
}
```

---

## Chat & AI

### Send Chat Message

```typescript
const sendMessage = useMutation(api.chat.sendMessage);

await sendMessage({
  senderId: "user_123",
  receiverId: "coach_456", // or null for AI
  conversationId: "conv_123",
  content: "How can I improve my resume?"
});
```

### Get Conversation Messages

```typescript
const messages = useQuery(api.chat.getConversationMessages, {
  conversationId: "conv_123",
  limit: 50
});
```

### AI Resume Optimization

```typescript
const optimize = useMutation(api.ai.optimizeResume);

const result = await optimize({
  documentId: "doc_123",
  targetJobId: "job_456" // optional
});
```

**Returns:**
```typescript
{
  suggestions: Array<{
    section: string;
    current: string;
    suggestion: string;
    reason: string;
    priority: "high" | "medium" | "low";
  }>;
  overallScore: number;
  keywords: {
    missing: string[];
    present: string[];
  };
}
```

### AI Job Matching

```typescript
const match = useMutation(api.ai.matchJobsToUser);

const matches = await match({
  userId: "user_123",
  limit: 20
});
```

**Returns:** Array of jobs with match scores and explanations

### Generate Interview Questions

```typescript
const generateQuestions = useMutation(api.ai.generateInterviewQuestions);

const questions = await generateQuestions({
  jobId: "job_123",
  userId: "user_123"
});
```

**Returns:**
```typescript
{
  technical: string[];
  behavioral: string[];
  situational: string[];
  companySpecific: string[];
}
```

### Generate Cover Letter

```typescript
const generateCoverLetter = useMutation(api.ai.generateCoverLetter);

const result = await generateCoverLetter({
  userId: "user_123",
  jobId: "job_123"
});
```

**Returns:**
```typescript
{
  content: string; // Full cover letter text
  suggestions: string[]; // Personalization tips
}
```

---

## Coaches & Sessions

### Get Coach Profile

```typescript
const coach = useQuery(api.coaches.getCoach, {
  coachId: "coach_123"
});
```

**Returns:**
```typescript
{
  _id: string;
  userId: string;
  user: User; // Populated user details
  specializations: string[];
  experience: number; // Years
  hourlyRate: number;
  bio: string;
  certifications: string[];
  availability: {
    monday: Array<{ start: string; end: string }>;
    // ... other days
  };
  rating: number;
  totalSessions: number;
  reviews: Array<{
    rating: number;
    comment: string;
    clientName: string;
    date: number;
  }>;
}
```

### Search Coaches

```typescript
const coaches = useQuery(api.coaches.searchCoaches, {
  specialization: "tech",
  minRating: 4.5,
  maxRate: 150,
  limit: 10
});
```

### Book Session

```typescript
const bookSession = useMutation(api.sessions.bookSession);

const sessionId = await bookSession({
  coachId: "coach_123",
  clientId: "user_123",
  startTime: 1699900800000, // Unix timestamp
  duration: 60, // minutes
  sessionType: "resume_review",
  notes: "Need help with technical resume"
});
```

### Get Upcoming Sessions

```typescript
const sessions = useQuery(api.sessions.getUpcomingSessions, {
  userId: "user_123"
});
```

### Cancel Session

```typescript
const cancelSession = useMutation(api.sessions.cancelSession);

await cancelSession({
  sessionId: "session_123",
  reason: "Scheduling conflict"
});
```

---

## Error Handling

All Convex functions throw errors that can be caught:

```typescript
try {
  await createDocument({...});
} catch (error) {
  if (error.message === "UNAUTHORIZED") {
    // Handle unauthorized
  } else if (error.message === "VALIDATION_ERROR") {
    // Handle validation error
  } else {
    // Handle generic error
  }
}
```

### Common Error Codes

- `UNAUTHORIZED`: User not authenticated
- `FORBIDDEN`: User lacks permission
- `NOT_FOUND`: Resource doesn't exist
- `VALIDATION_ERROR`: Input validation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `AI_API_ERROR`: OpenAI API error
- `EMBEDDING_GENERATION_FAILED`: Vector embedding failed

---

## Rate Limiting

Rate limits are enforced at the Convex level:

| Endpoint Type | Limit |
|--------------|-------|
| Authentication | 5 requests/minute |
| Document Operations | 30 requests/minute |
| Job Search | 60 requests/minute |
| AI Features | 10 requests/minute |
| Chat Messages | 20 requests/minute |

When rate limit is exceeded, you'll receive a `RATE_LIMIT_EXCEEDED` error with a `retryAfter` timestamp.

---

## Pagination

Most list endpoints support pagination:

```typescript
// Page 1
const page1 = useQuery(api.jobs.searchJobs, {
  query: "engineer",
  limit: 20,
  offset: 0
});

// Page 2
const page2 = useQuery(api.jobs.searchJobs, {
  query: "engineer",
  limit: 20,
  offset: 20
});
```

---

## Real-time Subscriptions

Convex queries automatically subscribe to real-time updates:

```typescript
// This component will automatically re-render when messages update
function ChatMessages({ conversationId }) {
  const messages = useQuery(api.chat.getConversationMessages, {
    conversationId
  });

  // Messages stay in sync with database automatically!
  return <MessageList messages={messages} />;
}
```

---

## Type Safety

All API calls are fully type-safe with TypeScript:

```typescript
import { api } from "@/convex/_generated/api";

// Types are automatically inferred
const documents = useQuery(api.documents.getUserDocuments, {
  userId: "user_123",
  type: "resume" // TypeScript knows valid types!
});

// TypeScript error: Property 'invalid' does not exist
const invalid = useQuery(api.documents.getUserDocuments, {
  invalid: "field"
});
```

---

## Best Practices

1. **Use Queries for Reads**: Always use `useQuery` for reading data to get real-time updates
2. **Use Mutations for Writes**: Use `useMutation` for creating, updating, or deleting data
3. **Handle Loading States**: Queries return `undefined` while loading
4. **Handle Errors**: Wrap mutations in try-catch blocks
5. **Optimize Queries**: Use filters and pagination to limit data transfer
6. **Cache Awareness**: Convex automatically caches and syncs data

```typescript
function MyComponent() {
  const documents = useQuery(api.documents.getUserDocuments, {
    userId: currentUser.id
  });

  const createDoc = useMutation(api.documents.create);

  if (documents === undefined) {
    return <LoadingSpinner />;
  }

  const handleCreate = async () => {
    try {
      await createDoc({ ... });
      toast.success("Document created!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return <DocumentList documents={documents} onCreate={handleCreate} />;
}
```

---

## Additional Resources

- [Convex Documentation](https://docs.convex.dev)
- [Type-safe API Reference](./convex/README.md)
- [Schema Documentation](./DATABASE.md)
- [Testing Guide](./TESTING.md)

---

**Last Updated**: November 7, 2025
