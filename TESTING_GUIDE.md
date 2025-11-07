# RAG System Testing Guide

## Quick Start Testing

### 1. Setup Testing Environment

```bash
# Install dependencies
npm install

# Setup Convex
npx convex dev

# Set environment variables
npx convex env set OPENAI_API_KEY sk-...

# In .env file
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

### 2. Create Test Data

#### Create Test User
```typescript
// In Convex dashboard or via API
const userId = await ctx.runMutation(api.users.createUser, {
  email: "test@example.com",
  name: "Test User",
  role: "job_seeker",
  authProvider: "email",
});
```

#### Create Test Document
```typescript
const docId = await ctx.runMutation(api.documents.createDocument, {
  userId: userId,
  title: "Software Engineer Resume",
  type: "resume",
  format: "txt",
  content: `
    John Doe
    Software Engineer

    Experience:
    - 5 years of full-stack development
    - Expert in React, Node.js, TypeScript
    - Built scalable web applications
    - Led team of 3 developers

    Skills:
    JavaScript, TypeScript, React, Node.js, PostgreSQL, AWS

    Education:
    BS Computer Science, MIT, 2018
  `
});
```

#### Create Test Job
```typescript
const jobId = await ctx.runMutation(api.jobs.createJob, {
  title: "Senior Frontend Engineer",
  company: "TechCorp",
  location: "San Francisco, CA",
  locationType: "hybrid",
  description: "Looking for experienced React developer",
  requirements: [
    "5+ years React experience",
    "TypeScript expertise",
    "Team leadership"
  ],
  experienceLevel: "senior",
  employmentType: "full_time",
  industry: "Technology",
  skills: ["React", "TypeScript", "JavaScript"],
  source: "manual",
  salaryMin: 150000,
  salaryMax: 200000,
  salaryCurrency: "USD"
});
```

### 3. Test Embedding Generation

#### Test Document Embedding
```typescript
// Generate embeddings for the document
const result = await ctx.runAction(api.embeddings.embedDocument, {
  documentId: docId
});

console.log("Chunks processed:", result.chunksProcessed);

// Verify embeddings were created
const embeddings = await ctx.db
  .query("documentEmbeddings")
  .withIndex("by_document", (q) => q.eq("documentId", docId))
  .collect();

console.log(`Created ${embeddings.length} embedding chunks`);
// Expected: 1-3 chunks depending on content length
```

#### Test Job Embedding
```typescript
await ctx.runAction(api.embeddings.embedJob, {
  jobId: jobId
});

const jobEmbedding = await ctx.db
  .query("jobEmbeddings")
  .withIndex("by_job", (q) => q.eq("jobId", jobId))
  .first();

console.log("Job embedding created:", !!jobEmbedding);
// Expected: true
```

### 4. Test RAG Retrieval

#### Test Document Search
```typescript
const searchResults = await ctx.runAction(api.rag.searchUserDocuments, {
  userId: userId,
  query: "React and TypeScript experience",
  limit: 5
});

console.log("Found documents:", searchResults.length);
console.log("Top result:", searchResults[0]);
// Expected: Array with resume chunks mentioning React/TypeScript
```

#### Test Job Matching
```typescript
const matchedJobs = await ctx.runAction(api.rag.matchJobsToProfile, {
  userId: userId,
  limit: 10
});

console.log("Matched jobs:", matchedJobs.length);
console.log("Top match:", matchedJobs[0].title);
console.log("Match score:", matchedJobs[0].matchScore);
// Expected: Jobs sorted by relevance to user's resume
```

### 5. Test AI Features

#### Test Chat
```typescript
// Create conversation
const conversationId = await ctx.runMutation(api.messages.createConversation, {
  userId: userId,
  title: "Test Conversation"
});

// Send message
const response = await ctx.runAction(api.ai.streamChatResponse, {
  userId: userId,
  conversationId: conversationId,
  message: "Help me improve my resume for frontend roles"
});

console.log("AI Response:", response.message);
console.log("Tokens used:", response.usage?.total_tokens);
// Expected: Relevant advice based on user's resume and context
```

#### Test Resume Optimization
```typescript
const optimization = await ctx.runAction(api.ai.optimizeResume, {
  documentId: docId,
  targetJobId: jobId,
  focusAreas: ["keywords", "achievements"]
});

console.log("Suggestions:", optimization.suggestions);
// Expected: Specific, actionable feedback
```

#### Test Interview Prep
```typescript
const interviewPrep = await ctx.runAction(api.ai.prepareForInterview, {
  userId: userId,
  jobId: jobId
});

console.log("Interview questions:", interviewPrep.interviewPrep);
// Expected: Customized interview preparation materials
```

#### Test Cover Letter Generation
```typescript
const coverLetter = await ctx.runAction(api.ai.generateCoverLetter, {
  userId: userId,
  resumeId: docId,
  jobId: jobId,
  tone: "professional"
});

console.log("Cover letter:", coverLetter.coverLetter);
// Expected: Personalized cover letter
```

### 6. Test Frontend Integration

#### Test Chat Component
```tsx
// In your app
import ChatWithAI from '@/pages/ChatWithAI';

function TestChat() {
  return <ChatWithAI userId={testUserId} />;
}
```

**Expected Behavior**:
- Chat interface loads
- Can send messages
- AI responds with relevant context
- Messages persist in database
- Loading states work correctly
- Errors are handled gracefully

#### Test Hooks
```tsx
import { useAIChat } from '@/hooks/useAIChat';

function TestChatHook() {
  const { messages, sendMessage, isLoading, error } = useAIChat({
    userId: testUserId,
    onError: (err) => console.error(err)
  });

  useEffect(() => {
    if (messages.length === 1) {
      sendMessage("Test message");
    }
  }, [messages]);

  return (
    <div>
      <p>Messages: {messages.length}</p>
      <p>Loading: {isLoading.toString()}</p>
      <p>Error: {error?.message || 'None'}</p>
    </div>
  );
}
```

**Expected Behavior**:
- Hook initializes conversation
- Can send messages
- Messages update in real-time
- Loading state changes correctly
- Errors are caught and reported

## Manual Testing Checklist

### Embedding Pipeline
- [ ] Documents are chunked appropriately (500-1000 tokens)
- [ ] Chunks have proper overlap
- [ ] Embeddings are stored with correct metadata
- [ ] Vector indexes are created
- [ ] Duplicate embeddings are handled (updated, not duplicated)

### RAG Retrieval
- [ ] Semantic search returns relevant results
- [ ] Results are filtered by userId correctly
- [ ] Similarity scores are reasonable (>0.5 for good matches)
- [ ] Context building includes all necessary information
- [ ] Empty results are handled gracefully

### AI Features
- [ ] Chat responses are coherent and relevant
- [ ] Responses include context from user documents
- [ ] Resume optimization gives specific suggestions
- [ ] Interview prep is customized to job posting
- [ ] Cover letters are personalized
- [ ] Error messages are clear and actionable

### Frontend
- [ ] Chat interface is responsive
- [ ] Messages appear in correct order
- [ ] Loading states are visible
- [ ] Errors are displayed to user
- [ ] Quick actions work
- [ ] Message persistence works across page reloads

## Performance Testing

### Vector Search Performance
```typescript
const startTime = Date.now();
const results = await ctx.runAction(api.rag.searchUserDocuments, {
  userId: userId,
  query: "test query",
  limit: 5
});
const duration = Date.now() - startTime;
console.log(`Search took ${duration}ms`);
// Expected: <200ms
```

### LLM Response Time
```typescript
const startTime = Date.now();
const response = await ctx.runAction(api.ai.streamChatResponse, {
  userId: userId,
  conversationId: conversationId,
  message: "test message"
});
const duration = Date.now() - startTime;
console.log(`LLM response took ${duration}ms`);
// Expected: 2000-5000ms
```

### Embedding Generation Time
```typescript
const startTime = Date.now();
await ctx.runAction(api.embeddings.embedDocument, {
  documentId: docId
});
const duration = Date.now() - startTime;
console.log(`Embedding took ${duration}ms`);
// Expected: 500-2000ms depending on document size
```

## Error Testing

### Test Invalid User ID
```typescript
try {
  await ctx.runAction(api.rag.searchUserDocuments, {
    userId: "invalid" as any,
    query: "test"
  });
} catch (error) {
  console.log("Error caught:", error.message);
  // Expected: Clear error message
}
```

### Test Missing Document
```typescript
try {
  await ctx.runAction(api.ai.optimizeResume, {
    documentId: "nonexistent" as any
  });
} catch (error) {
  console.log("Error caught:", error.message);
  // Expected: "Document not found"
}
```

### Test Missing API Key
```typescript
// Remove OPENAI_API_KEY temporarily
// Try to send chat message
// Expected: Clear error about missing API key
```

## Load Testing

### Multiple Concurrent Requests
```typescript
const promises = Array.from({ length: 10 }, (_, i) =>
  ctx.runAction(api.ai.streamChatResponse, {
    userId: userId,
    conversationId: conversationId,
    message: `Test message ${i}`
  })
);

const results = await Promise.all(promises);
console.log(`Completed ${results.length} requests`);
// Expected: All requests complete successfully
```

### Large Document Processing
```typescript
const largeContent = "Lorem ipsum... ".repeat(1000); // ~10,000 words

const docId = await ctx.runMutation(api.documents.createDocument, {
  userId: userId,
  title: "Large Document",
  type: "resume",
  format: "txt",
  content: largeContent
});

await ctx.runAction(api.embeddings.embedDocument, {
  documentId: docId
});

const embeddings = await ctx.db
  .query("documentEmbeddings")
  .withIndex("by_document", (q) => q.eq("documentId", docId))
  .collect();

console.log(`Created ${embeddings.length} chunks for large document`);
// Expected: 10-20 chunks
```

## Common Issues and Solutions

### Issue: No results from vector search
**Solution**:
1. Verify embeddings exist in database
2. Check userId filter is correct
3. Ensure vector index is created
4. Try lower similarity threshold

### Issue: Slow LLM responses
**Solution**:
1. Reduce context size
2. Use GPT-4o-mini instead of GPT-4o
3. Lower max_tokens parameter
4. Check OpenAI API status

### Issue: Embeddings not generating
**Solution**:
1. Verify OPENAI_API_KEY is set
2. Check API key has credits
3. Verify document content is not empty
4. Check Convex deployment status

### Issue: Chat not persisting
**Solution**:
1. Verify conversationId is valid
2. Check user has permission to access conversation
3. Verify Convex database is writable
4. Check for JavaScript errors in console

## Success Criteria

✅ **Embedding Pipeline**:
- Documents chunk correctly
- Embeddings generate in <2 seconds
- Vector indexes work

✅ **RAG Retrieval**:
- Search returns relevant results
- Search completes in <200ms
- Context building is comprehensive

✅ **AI Features**:
- Chat responses are coherent
- Responses include relevant context
- All AI features work end-to-end

✅ **Frontend**:
- UI is responsive
- Error handling works
- Messages persist
- Loading states are clear

## Next Steps After Testing

1. **Fix any issues** found during testing
2. **Optimize performance** based on metrics
3. **Add monitoring** for production
4. **Set up alerts** for errors and high costs
5. **Deploy to production** with confidence

## Support

For testing issues:
1. Check Convex dashboard for errors
2. Check browser console for frontend errors
3. Review OpenAI API logs for LLM issues
4. Consult `RAG_IMPLEMENTATION_GUIDE.md`
