# RAG Implementation Guide for CareerSU Platform

## Overview

This document describes the complete RAG (Retrieval-Augmented Generation) implementation for the CareerSU AI Career Assistant platform.

## Architecture

### Tech Stack
- **Vector Database**: Convex (with built-in vector search)
- **Embeddings**: OpenAI text-embedding-3-small (1536 dimensions)
- **LLM**: OpenAI GPT-4o-mini (default) and GPT-4o (advanced)
- **Backend**: Convex serverless functions
- **Frontend**: React with custom hooks

### Components

```
convex/
├── schema.ts               # Database schema with vector indexes
├── embeddings.ts          # Embedding generation and storage
├── rag.ts                 # Retrieval and context building
├── ai.ts                  # LLM integration
├── embeddingsMutations.ts # Internal mutations for embeddings
├── documents.ts           # Document CRUD operations
├── jobs.ts                # Job listing operations
├── messages.ts            # Chat message operations
├── users.ts               # User profile operations
└── tsconfig.json          # TypeScript configuration

src/
├── lib/
│   ├── ai/
│   │   └── ragClient.ts   # Frontend AI utilities
│   └── convex.ts          # Convex client setup
└── hooks/
    └── useAIChat.ts       # React hooks for AI features
```

## Features Implemented

### 1. Vector Embeddings
- ✅ Document embeddings (resumes, cover letters)
- ✅ Job description embeddings
- ✅ Knowledge base embeddings
- ✅ Chunking strategy (500-1000 tokens with overlap)

### 2. RAG Retrieval
- ✅ Search user's documents
- ✅ Find relevant career advice
- ✅ Match jobs to user profile
- ✅ Retrieve conversation context
- ✅ Build comprehensive RAG context

### 3. AI Features
- ✅ AI-powered chat with RAG context
- ✅ Resume optimization
- ✅ Interview preparation
- ✅ Cover letter generation
- ✅ Semantic job search

### 4. Frontend Integration
- ✅ React hooks (useAIChat, useResumeOptimization, etc.)
- ✅ Real-time chat interface
- ✅ Error handling and loading states
- ✅ Message persistence

## Database Schema

### Vector Tables

#### documentEmbeddings
Stores embeddings for user documents (resumes, cover letters).
```typescript
{
  documentId: Id<"documents">,
  userId: Id<"users">,
  chunkIndex: number,
  chunkText: string,
  embedding: number[], // 1536 dimensions
  metadata: {
    documentType: string,
    documentTitle: string,
    totalChunks: number,
  }
}
```

#### jobEmbeddings
Stores embeddings for job postings.
```typescript
{
  jobId: Id<"jobs">,
  embedding: number[],
  metadata: {
    title: string,
    company: string,
    location: string,
  }
}
```

#### knowledgeBaseEmbeddings
Stores career advice and knowledge base content.
```typescript
{
  topic: string,
  content: string,
  embedding: number[],
  metadata: {
    category: string,
    tags: string[],
    source?: string,
  }
}
```

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the project root:

```bash
# Copy from example
cp .env.example .env

# Add your keys
VITE_CONVEX_URL=https://your-deployment.convex.cloud
OPENAI_API_KEY=sk-...
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Deploy Convex Backend

```bash
# Install Convex CLI globally
npm install -g convex

# Login to Convex
npx convex login

# Initialize and deploy
npx convex dev
```

This will:
- Create a new Convex deployment
- Generate the deployment URL
- Deploy all backend functions
- Create vector indexes

### 4. Update Environment

Add the generated Convex URL to your `.env`:
```
VITE_CONVEX_URL=https://[your-deployment].convex.cloud
```

### 5. Add OpenAI API Key to Convex

```bash
npx convex env set OPENAI_API_KEY sk-...
```

### 6. (Optional) Seed Knowledge Base

Create a script to seed career advice:

```bash
# Create seed script
cat > scripts/seedKnowledgeBase.ts << 'EOF'
import { api } from "../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);

async function seed() {
  // Resume writing advice
  await client.mutation(api.embeddings.embedKnowledgeBase, {
    topic: "resume_writing",
    category: "documents",
    tags: ["resume", "writing", "best-practices"],
    content: `
      Resume Writing Best Practices:
      1. Use action verbs to start bullet points
      2. Quantify achievements with numbers and metrics
      3. Tailor resume to each job posting
      4. Keep it concise (1-2 pages max)
      5. Use consistent formatting
      6. Include keywords from job description
      7. Focus on results, not just responsibilities
    `
  });

  // Interview prep advice
  await client.mutation(api.embeddings.embedKnowledgeBase, {
    topic: "interview_prep",
    category: "interviews",
    tags: ["interview", "preparation", "tips"],
    content: `
      Interview Preparation Tips:
      1. Research the company thoroughly
      2. Prepare STAR method examples
      3. Practice common interview questions
      4. Prepare questions to ask the interviewer
      5. Dress professionally
      6. Arrive 10-15 minutes early
      7. Follow up with thank-you email
    `
  });

  console.log("Knowledge base seeded successfully!");
}

seed();
EOF

# Run seed script
npx tsx scripts/seedKnowledgeBase.ts
```

## Usage Examples

### 1. AI Chat

```tsx
import { useAIChat } from '@/hooks/useAIChat';
import { Id } from '../convex/_generated/dataModel';

function ChatPage() {
  const userId = "..." as Id<"users">;

  const { messages, sendMessage, isLoading } = useAIChat({
    userId,
    onError: (error) => console.error(error)
  });

  const handleSend = async (message: string) => {
    await sendMessage(message);
  };

  return (
    <div>
      {messages.map(msg => (
        <div key={msg._id}>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}
      <button onClick={() => handleSend("Help me with my resume")}>
        Send
      </button>
    </div>
  );
}
```

### 2. Resume Optimization

```tsx
import { useResumeOptimization } from '@/hooks/useAIChat';

function ResumeEditor() {
  const { optimize, isOptimizing } = useResumeOptimization();

  const handleOptimize = async () => {
    const result = await optimize(
      documentId,
      targetJobId, // optional
      ["formatting", "keywords", "achievements"]
    );

    console.log(result.suggestions);
  };

  return (
    <button onClick={handleOptimize} disabled={isOptimizing}>
      Optimize Resume
    </button>
  );
}
```

### 3. Job Matching

```tsx
import { useJobMatching } from '@/hooks/useAIChat';

function JobRecommendations() {
  const { match, isMatching } = useJobMatching();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const loadJobs = async () => {
      const matchedJobs = await match(userId, 10);
      setJobs(matchedJobs);
    };
    loadJobs();
  }, []);

  return (
    <div>
      {jobs.map(job => (
        <div key={job._id}>
          <h3>{job.title}</h3>
          <p>Match Score: {job.matchScore}%</p>
        </div>
      ))}
    </div>
  );
}
```

## Testing

### 1. Test Embedding Generation

```typescript
// In Convex dashboard or via CLI
import { api } from "./convex/_generated/api";

// Create a test document
const docId = await ctx.runMutation(api.documents.createDocument, {
  userId: testUserId,
  title: "Test Resume",
  type: "resume",
  content: "Software Engineer with 5 years of experience...",
  format: "txt"
});

// Generate embeddings
await ctx.runAction(api.embeddings.embedDocument, {
  documentId: docId
});

// Verify embeddings were created
const embeddings = await ctx.db
  .query("documentEmbeddings")
  .withIndex("by_document", (q) => q.eq("documentId", docId))
  .collect();

console.log(`Created ${embeddings.length} chunks`);
```

### 2. Test Semantic Search

```typescript
// Search for relevant documents
const results = await ctx.runAction(api.rag.searchUserDocuments, {
  userId: testUserId,
  query: "frontend development experience",
  limit: 5
});

console.log("Search results:", results);
```

### 3. Test AI Chat

```typescript
// Send a test message
const response = await ctx.runAction(api.ai.streamChatResponse, {
  userId: testUserId,
  conversationId: testConversationId,
  message: "Help me prepare for a software engineering interview"
});

console.log("AI response:", response.message);
```

## Performance Considerations

### Chunking Strategy
- Chunk size: 500-1000 tokens (~2000-4000 characters)
- Overlap: 100 tokens (~400 characters)
- Benefits: Better context preservation, improved retrieval

### Vector Search
- Top-K: 3-5 results for knowledge base
- Top-K: 3-5 results for documents
- Filters: userId, documentId, topic
- Fast: <100ms for most queries

### LLM Calls
- Default model: GPT-4o-mini (fast, cost-effective)
- Advanced model: GPT-4o (complex tasks)
- Max tokens: 1000-2000 (adjustable)
- Temperature: 0.5-0.8 (task-dependent)

## Cost Estimation

### OpenAI API Costs

**Embeddings** (text-embedding-3-small):
- Cost: $0.02 / 1M tokens
- Average document: ~1000 tokens = $0.00002
- 1000 documents: ~$0.02

**LLM** (GPT-4o-mini):
- Input: $0.150 / 1M tokens
- Output: $0.600 / 1M tokens
- Average chat: ~500 input + 200 output = $0.00019
- 1000 messages: ~$0.19

**Total for typical usage**:
- 1000 documents + 1000 messages = ~$0.21

## Troubleshooting

### Issue: "Missing OPENAI_API_KEY"
```bash
# Set in Convex environment
npx convex env set OPENAI_API_KEY sk-...
```

### Issue: "Vector index not found"
```bash
# Redeploy to create indexes
npx convex dev
```

### Issue: "No embeddings found"
```typescript
// Check if embeddings exist
const embeddings = await ctx.db
  .query("documentEmbeddings")
  .collect();
console.log(`Found ${embeddings.length} embeddings`);

// If none, run embedding generation
await ctx.runAction(api.embeddings.embedDocument, {
  documentId: yourDocId
});
```

### Issue: "Chat not working"
1. Check Convex deployment status
2. Verify environment variables
3. Check browser console for errors
4. Verify user and conversation IDs exist

## Next Steps

### Enhancements
1. **Streaming Responses**: Implement real-time streaming
2. **Conversation Titles**: Auto-generate from first message
3. **Message Reactions**: Like/dislike for feedback
4. **Export Chat**: Download conversation history
5. **Advanced RAG**: Add re-ranking, query expansion

### Optimization
1. **Caching**: Cache frequently accessed embeddings
2. **Batch Processing**: Process multiple documents at once
3. **Incremental Updates**: Update only changed chunks
4. **Lazy Loading**: Load messages on scroll

### Analytics
1. **Usage Tracking**: Monitor AI feature usage
2. **Quality Metrics**: Track user satisfaction
3. **Cost Monitoring**: Alert on high usage
4. **A/B Testing**: Test different prompts

## Support

For issues or questions:
1. Check Convex docs: https://docs.convex.dev
2. OpenAI docs: https://platform.openai.com/docs
3. GitHub issues: [your-repo]/issues

## License

MIT
