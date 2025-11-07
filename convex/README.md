# CareerSU Convex Backend

This directory contains the complete Convex backend implementation for the CareerSU platform.

## Overview

Convex is a real-time backend-as-a-service that provides:
- Serverless database with real-time subscriptions
- TypeScript-first development experience
- Automatic API generation
- Built-in authentication support
- Real-time data synchronization

## Directory Structure

```
convex/
├── schema.ts              # Database schema definitions
├── auth.ts                # Authentication functions
├── users.ts               # User management functions
├── documents.ts           # Document CRUD operations
├── jobs.ts                # Job listing functions
├── applications.ts        # Application tracking functions
├── chat.ts                # Real-time messaging functions
├── coaches.ts             # Coach management functions
├── sessions.ts            # Coaching session functions
├── tsconfig.json          # TypeScript configuration
└── _generated/            # Auto-generated API and types
```

## Database Schema

### Tables

1. **users** - Core user authentication and account information
2. **profiles** - Extended user profile data
3. **documents** - Resumes, cover letters, and portfolios
4. **jobs** - Job listings from various sources
5. **applications** - Job application tracking
6. **chatMessages** - Real-time messaging between users
7. **coaches** - Career coach profiles and information
8. **sessions** - Coaching session management

## Setup Instructions

### 1. Install Convex CLI

```bash
npm install -g convex
```

### 2. Login to Convex

```bash
npx convex login
```

### 3. Initialize Convex Project

```bash
npx convex dev
```

This will:
- Create a new Convex project (if needed)
- Generate the `_generated` directory
- Create a `.env.local` file with your development URL
- Start the Convex development server

### 4. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

The `npx convex dev` command will automatically populate `VITE_CONVEX_URL` in `.env.local`.

### 5. Deploy to Production

```bash
npx convex deploy
```

## Usage in React Components

### Import Hooks

```typescript
import { useUserDocuments, useCreateDocument } from '@/hooks/useConvex';
```

### Query Data (Real-time)

```typescript
function MyComponent() {
  const userId = "user-id";
  const documents = useUserDocuments(userId, "resume");

  if (!documents) return <div>Loading...</div>;

  return (
    <div>
      {documents.map(doc => (
        <div key={doc._id}>{doc.title}</div>
      ))}
    </div>
  );
}
```

### Mutations (Create/Update/Delete)

```typescript
function CreateDocumentForm() {
  const createDocument = useCreateDocument();

  const handleSubmit = async (data) => {
    await createDocument({
      userId: currentUserId,
      title: data.title,
      type: "resume",
      content: data.content,
      format: "html",
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Available Functions

### Authentication (`auth.ts`)
- `registerUser` - Create new user account
- `getCurrentUser` - Get current user session
- `updateLastLogin` - Update login timestamp
- `verifyEmail` - Verify user email

### Users (`users.ts`)
- `getUserProfile` - Get user profile
- `updateProfile` - Update user profile
- `getUserStats` - Get user statistics

### Documents (`documents.ts`)
- `createDocument` - Create new document
- `getUserDocuments` - Get user's documents
- `updateDocument` - Update document
- `deleteDocument` - Delete document
- `toggleFavorite` - Toggle favorite status
- `searchDocuments` - Search documents

### Jobs (`jobs.ts`)
- `createJob` - Create job listing
- `getActiveJobs` - Get active jobs
- `searchJobs` - Search jobs with filters
- `getRecommendedJobs` - Get AI-matched jobs

### Applications (`applications.ts`)
- `createApplication` - Create new application
- `getUserApplications` - Get user applications
- `updateApplicationStatus` - Update status
- `getApplicationStats` - Get application statistics

### Chat (`chat.ts`)
- `sendMessage` - Send chat message
- `getConversationMessages` - Get conversation
- `markConversationAsRead` - Mark as read
- `getUserConversations` - Get all conversations

### Coaches (`coaches.ts`)
- `getCoachProfile` - Get coach profile
- `getAllCoaches` - Get all coaches
- `updateCoachProfile` - Update coach info
- `getTopRatedCoaches` - Get top-rated coaches

### Sessions (`sessions.ts`)
- `createSession` - Create coaching session
- `getCoachSessions` - Get coach's sessions
- `getClientSessions` - Get client's sessions
- `updateSessionStatus` - Update session status
- `submitSessionReview` - Submit review

## Real-time Features

All queries are real-time by default. When data changes in the database, React components automatically re-render with the latest data.

### Example: Real-time Chat

```typescript
function ChatRoom({ conversationId }) {
  const messages = useConversationMessages(conversationId);
  const sendMessage = useSendMessage();

  // Messages update in real-time as they're sent
  return (
    <div>
      {messages?.map(msg => (
        <div key={msg._id}>{msg.content}</div>
      ))}
    </div>
  );
}
```

## Type Safety

All Convex functions are fully typed. The `_generated` directory contains:
- `api.ts` - Auto-generated API references
- `dataModel.ts` - TypeScript types for all tables

Import types:

```typescript
import { Id } from "../convex/_generated/dataModel";

type UserId = Id<"users">;
type DocumentId = Id<"documents">;
```

## Performance Optimization

### Indexes

The schema includes indexes for common query patterns:
- User lookups by email
- Document filtering by user and type
- Job searches by location, type, industry
- Application tracking by user and status
- Message queries by conversation

### Pagination

Use the `limit` parameter for queries:

```typescript
const jobs = useActiveJobs(50); // Limit to 50 jobs
```

## Security

### Add Authentication

Implement authentication checks in functions:

```typescript
export const updateDocument = mutation({
  args: { documentId: v.id("documents"), ... },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    // ... rest of function
  },
});
```

### Row-Level Security

Filter queries by user ID to ensure users only see their own data:

```typescript
const documents = await ctx.db
  .query("documents")
  .withIndex("by_user_id", (q) => q.eq("userId", currentUserId))
  .collect();
```

## Development Commands

```bash
# Start development server
npx convex dev

# Deploy to production
npx convex deploy

# View dashboard
npx convex dashboard

# Run TypeScript checks
npx convex typecheck

# Clear all data (development only)
npx convex data clear
```

## Troubleshooting

### "Cannot find module '_generated/api'"

Run `npx convex dev` to generate the API files.

### Environment variable not found

Ensure `.env.local` exists with `VITE_CONVEX_URL` set.

### Data not updating in real-time

Check that components are using the Convex hooks (not REST API calls).

## Next Steps

1. Run `npx convex dev` to start development
2. Test queries in the Convex dashboard
3. Implement authentication provider
4. Add data validation rules
5. Set up production deployment
6. Configure monitoring and logging

## Resources

- [Convex Documentation](https://docs.convex.dev)
- [React Integration Guide](https://docs.convex.dev/client/react)
- [Database Schema Best Practices](https://docs.convex.dev/database/schemas)
