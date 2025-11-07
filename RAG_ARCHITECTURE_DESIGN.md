# RAG Architecture Design for CareerSU AI Career Assistant

**Document Version:** 1.0
**Date:** 2025-11-07
**Author:** AI Architecture Team

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [RAG Architecture Overview](#rag-architecture-overview)
3. [Vector Database Recommendations](#vector-database-recommendations)
4. [Embedding Strategy](#embedding-strategy)
5. [RAG Query Flow](#rag-query-flow)
6. [Data to Embed](#data-to-embed)
7. [Use Case Implementations](#use-case-implementations)
8. [Implementation Roadmap](#implementation-roadmap)
9. [Cost Analysis](#cost-analysis)
10. [Code Examples](#code-examples)

---

## 1. Executive Summary

This document outlines a comprehensive Retrieval-Augmented Generation (RAG) implementation for CareerSU's AI career assistant. The system will provide context-aware, personalized career guidance by combining:

- **User's documents** (resumes, cover letters)
- **Job descriptions** and requirements
- **Career advice knowledge base**
- **User's application history**
- **Conversation context**

**Key Recommendations:**
- **Vector Database:** Convex Vector Search (primary) with Pinecone as alternative
- **Embedding Model:** OpenAI text-embedding-3-small (cost-effective, high-quality)
- **LLM:** GPT-4 or Claude 3.5 Sonnet for generation
- **Estimated Cost:** $0.02-0.05 per user conversation (20 messages)

---

## 2. RAG Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Query                                │
│              "Help me improve my resume"                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Query Processing Layer                         │
│  - Extract intent (resume, interview, job search, etc.)          │
│  - Identify user context (userId, current application, etc.)     │
│  - Generate embedding for semantic search                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Vector Database (Convex)                        │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │   User Docs  │  Job Listings│  Knowledge   │ Conversation │  │
│  │  Embeddings  │  Embeddings  │    Base      │   History    │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
│         │              │              │              │           │
│         └──────────────┴──────────────┴──────────────┘           │
│                            │                                     │
│                  Top-K Similar Documents                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Context Assembly Layer                          │
│  - Rank retrieved documents by relevance                         │
│  - Apply metadata filters (userId, documentType, etc.)           │
│  - Limit token count (stay within LLM context window)            │
│  - Structure context for prompt                                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Prompt Construction                           │
│  System: You are a career coach...                              │
│  Context: [Retrieved resume, job description, knowledge]         │
│  History: [Last 5 messages]                                      │
│  User Query: "Help me improve my resume"                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LLM Generation (GPT-4/Claude)                 │
│  - Generate response based on context                            │
│  - Stream response back to user                                  │
│  - Include citations/sources when relevant                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Response + Storage                            │
│  - Display to user (streaming)                                   │
│  - Store conversation in database                                │
│  - Update embeddings if needed                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Core Components

1. **Embedding Layer**: Converts text to vectors
2. **Vector Store**: Stores and retrieves similar content
3. **Context Manager**: Assembles relevant context
4. **LLM Integration**: Generates responses
5. **Feedback Loop**: Learns from interactions

---

## 3. Vector Database Recommendations

### 3.1 Option 1: Convex Vector Search (RECOMMENDED)

**Pros:**
- Already using Convex for backend
- Integrated with existing data models
- Real-time updates and reactivity
- No additional infrastructure
- Built-in authentication and authorization
- TypeScript-native
- Cost-effective (included in Convex pricing)

**Cons:**
- Newer feature, less mature than dedicated solutions
- May have limitations on scale (millions of vectors)

**Best For:** CareerSU's current scale and integration needs

**Implementation Example:**
```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documentEmbeddings: defineTable({
    userId: v.string(),
    documentId: v.string(),
    documentType: v.union(
      v.literal("resume"),
      v.literal("cover_letter"),
      v.literal("job_description")
    ),
    content: v.string(),
    embedding: v.array(v.float64()),
    metadata: v.object({
      title: v.string(),
      lastModified: v.string(),
      chunkIndex: v.optional(v.number()),
    }),
  })
    .index("by_user", ["userId"])
    .index("by_document", ["documentId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536, // OpenAI text-embedding-3-small
      filterFields: ["userId", "documentType"],
    }),
});
```

### 3.2 Option 2: Pinecone

**Pros:**
- Purpose-built for vector search
- Excellent performance at scale
- Managed service, no infrastructure
- Advanced features (namespaces, metadata filtering)
- Great documentation

**Cons:**
- Additional cost ($70-120/month for production)
- Another service to manage
- Need to sync data between Convex and Pinecone

**Best For:** If you need advanced vector operations or expect millions of embeddings

**Pricing:**
- Starter: $70/month (1 pod, 100k vectors)
- Production: $120+/month

### 3.3 Option 3: pgvector (PostgreSQL Extension)

**Pros:**
- Free if using PostgreSQL
- SQL queries with vector operations
- Proven reliability

**Cons:**
- Need to set up PostgreSQL
- Performance may degrade at scale
- Not as feature-rich as purpose-built solutions
- CareerSU currently uses Convex, not PostgreSQL

**Best For:** Teams already on PostgreSQL stack

### 3.4 Recommendation: Convex Vector Search

For CareerSU, **Convex Vector Search** is the optimal choice because:

1. Zero additional infrastructure
2. Seamless integration with existing Convex backend
3. Type-safe vector operations
4. Real-time reactivity for embeddings
5. Cost-effective for current scale
6. Easy to switch to Pinecone if needed later

---

## 4. Embedding Strategy

### 4.1 Embedding Model Selection

**Recommended: OpenAI text-embedding-3-small**

| Model | Dimensions | Cost per 1M tokens | Performance | Use Case |
|-------|-----------|-------------------|-------------|-----------|
| **text-embedding-3-small** | 1536 | $0.02 | Excellent | **Recommended** - Best value |
| text-embedding-3-large | 3072 | $0.13 | Better | High-accuracy needs |
| Cohere embed-english-v3.0 | 1024 | $0.10 | Good | Alternative option |
| Voyage AI voyage-2 | 1024 | $0.12 | Excellent | Specialized for RAG |

**Why text-embedding-3-small:**
- 10x cheaper than text-embedding-3-large
- Performance nearly identical for most use cases
- 1536 dimensions = good balance
- OpenAI ecosystem integration

### 4.2 Chunking Strategy

Different content types require different chunking approaches:

#### A. Resumes
```typescript
// Don't chunk - embed entire resume
// Resumes are typically 1-2 pages (~500-1000 tokens)
// Keep semantic coherence

interface ResumeEmbedding {
  type: 'resume_full';
  content: string; // Full resume text
  sections: {
    summary: string;
    experience: string[];
    education: string[];
    skills: string[];
  };
}
```

**Rationale:** Resumes are concise documents where context matters. Splitting would lose important connections between sections.

#### B. Job Descriptions
```typescript
// Chunk by section if very long
// Most job descriptions: 200-500 tokens (no chunking needed)

interface JobEmbedding {
  type: 'job_description';
  jobId: string;
  content: string; // Full job description
  sections: {
    title: string;
    company: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
  };
}
```

#### C. Career Advice Knowledge Base
```typescript
// Chunk larger articles into semantic sections
// Target: 300-500 tokens per chunk

interface KnowledgeChunk {
  type: 'knowledge';
  topic: string; // "resume_tips", "interview_prep", etc.
  content: string; // Chunk text
  chunkIndex: number;
  totalChunks: number;
  metadata: {
    source: string;
    category: string;
    lastUpdated: string;
  };
}
```

**Chunking Algorithm:**
```typescript
function chunkKnowledgeArticle(article: string, maxTokens: 400): string[] {
  // 1. Split by headers (##, ###)
  // 2. If section > maxTokens, split by paragraphs
  // 3. Maintain 50-token overlap between chunks
  // 4. Preserve semantic meaning
}
```

#### D. Cover Letters
```typescript
// Similar to resumes - no chunking
// Typical length: 300-500 tokens

interface CoverLetterEmbedding {
  type: 'cover_letter';
  content: string; // Full cover letter
  targetJobId?: string; // If tailored for specific job
}
```

### 4.3 Metadata Strategy

Store rich metadata for filtering and ranking:

```typescript
interface EmbeddingMetadata {
  // Common fields
  userId: string;
  documentType: 'resume' | 'cover_letter' | 'job' | 'knowledge';
  createdAt: string;
  updatedAt: string;

  // Document-specific
  documentId?: string;
  documentTitle?: string;

  // Job-specific
  jobId?: string;
  jobTitle?: string;
  company?: string;
  matchScore?: number; // Pre-computed if applicable

  // Knowledge-specific
  category?: string; // "resume_writing", "interview", "networking"
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];

  // Version tracking
  version: number;
  isActive: boolean;
}
```

### 4.4 When to Embed

**Real-time Embedding:**
- User creates/updates resume
- User creates/updates cover letter
- New job is posted/imported
- User asks question (for conversation history)

**Batch Embedding:**
- Initial knowledge base import
- Nightly updates for job listings
- Conversation history (after session ends)

---

## 5. RAG Query Flow

### 5.1 Query Processing Pipeline

```typescript
// Step 1: Analyze user query
interface QueryAnalysis {
  intent: 'resume_help' | 'job_search' | 'interview_prep' |
          'cover_letter' | 'career_advice' | 'general';
  entities: {
    documentId?: string;
    jobId?: string;
    skills?: string[];
  };
  requiresContext: {
    userResume: boolean;
    jobDescriptions: boolean;
    previousConversation: boolean;
    knowledgeBase: boolean;
  };
}

// Step 2: Retrieve relevant context
interface RetrievalStrategy {
  // Vector search parameters
  topK: number; // Usually 3-10
  similarityThreshold: number; // 0.7-0.9
  filters: {
    userId: string;
    documentTypes: string[];
    dateRange?: { start: string; end: string };
  };

  // Hybrid search (optional)
  includeKeywordSearch: boolean;
  keywordBoost: number;
}

// Step 3: Rank and re-rank results
interface RankingStrategy {
  // Score components
  vectorSimilarity: number; // 0-1
  recency: number; // 0-1 (newer = higher)
  userPreference: number; // 0-1 (starred docs = higher)
  relevanceToIntent: number; // 0-1

  // Final score
  finalScore: number; // Weighted combination
}

// Step 4: Construct prompt
interface PromptTemplate {
  systemPrompt: string;
  contextSection: string;
  conversationHistory: ChatMessage[];
  userQuery: string;
  maxTokens: number; // e.g., 8000 for GPT-4
}
```

### 5.2 Implementation Example

```typescript
// convex/ai/ragQuery.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const askCareerAssistant = mutation({
  args: {
    userId: v.string(),
    message: v.string(),
    conversationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Analyze query intent
    const intent = await analyzeIntent(args.message);

    // 2. Generate query embedding
    const queryEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: args.message,
    });

    // 3. Vector search across relevant collections
    const relevantDocs = await ctx.db
      .query("documentEmbeddings")
      .withIndex("by_embedding", (q) =>
        q.similar("embedding", queryEmbedding.data[0].embedding, 10)
      )
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // 4. Retrieve additional context based on intent
    let additionalContext = "";

    if (intent.includes("resume")) {
      const userResume = await ctx.db
        .query("documents")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .filter((q) => q.eq(q.field("type"), "resume"))
        .order("desc")
        .first();

      if (userResume) {
        additionalContext += `\n\nUser's Current Resume:\n${userResume.content}`;
      }
    }

    if (intent.includes("job")) {
      const savedJobs = await ctx.db
        .query("applications")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .take(5);

      // Fetch job details
      // additionalContext += job descriptions...
    }

    // 5. Get conversation history
    const conversationHistory = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId || "")
      )
      .order("desc")
      .take(10);

    // 6. Construct prompt
    const prompt = constructPrompt({
      relevantDocs,
      additionalContext,
      conversationHistory: conversationHistory.reverse(),
      userQuery: args.message,
    });

    // 7. Call LLM
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: prompt,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    // 8. Stream response back
    // Implementation depends on Convex streaming support
    // For now, return full response

    // 9. Store conversation
    await ctx.db.insert("messages", {
      conversationId: args.conversationId || generateId(),
      userId: args.userId,
      role: "user",
      content: args.message,
      timestamp: Date.now(),
    });

    await ctx.db.insert("messages", {
      conversationId: args.conversationId || generateId(),
      userId: args.userId,
      role: "assistant",
      content: completion.choices[0].message.content,
      timestamp: Date.now(),
    });

    return {
      response: completion.choices[0].message.content,
      sources: relevantDocs.map((doc) => ({
        id: doc.documentId,
        title: doc.metadata.title,
        relevance: doc._score,
      })),
    };
  },
});

// Helper function
function constructPrompt(context: any) {
  return [
    {
      role: "system",
      content: `You are an expert career coach and advisor. You help job seekers with:
- Resume and cover letter optimization
- Job search strategies
- Interview preparation
- Career development advice

Use the provided context about the user's documents, job applications, and career knowledge to give personalized, actionable advice.

Always be encouraging, specific, and cite sources when possible.`,
    },
    {
      role: "system",
      content: `Relevant Context:\n${context.relevantDocs
        .map((doc) => `${doc.metadata.title}:\n${doc.content}`)
        .join("\n\n")}${context.additionalContext}`,
    },
    ...context.conversationHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: "user",
      content: context.userQuery,
    },
  ];
}

function analyzeIntent(message: string): string[] {
  // Simple keyword-based intent detection
  // In production, use a classifier or LLM-based intent detection
  const intents: string[] = [];

  const resumeKeywords = ["resume", "cv", "experience", "skills"];
  const jobKeywords = ["job", "position", "application", "apply"];
  const interviewKeywords = ["interview", "prepare", "questions"];

  if (resumeKeywords.some((kw) => message.toLowerCase().includes(kw))) {
    intents.push("resume");
  }
  if (jobKeywords.some((kw) => message.toLowerCase().includes(kw))) {
    intents.push("job");
  }
  if (interviewKeywords.some((kw) => message.toLowerCase().includes(kw))) {
    intents.push("interview");
  }

  return intents;
}
```

### 5.3 Streaming Implementation

For better UX, stream responses:

```typescript
// Using Server-Sent Events (SSE) or WebSocket
export const streamCareerAssistant = mutation({
  args: { /* same as above */ },
  handler: async (ctx, args) => {
    // ... (same retrieval logic)

    const stream = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: prompt,
      stream: true,
    });

    // Stream chunks back to client
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";

      // Send chunk to client via WebSocket/SSE
      await ctx.scheduler.runAfter(0, "sendChunk", {
        userId: args.userId,
        conversationId: args.conversationId,
        content,
      });
    }
  },
});
```

---

## 6. Data to Embed

### 6.1 User Documents

| Document Type | Embedding Strategy | Update Frequency |
|--------------|-------------------|------------------|
| Resume | Full document | On save/update |
| Cover Letter | Full document | On save/update |
| Portfolio | Section-wise (if large) | On save/update |

**Storage:**
```typescript
{
  userId: "user123",
  documentId: "doc456",
  documentType: "resume",
  content: "Full resume text...",
  embedding: [0.234, -0.123, ...], // 1536-dim vector
  metadata: {
    title: "Senior Developer Resume",
    lastModified: "2025-01-15T10:30:00Z",
    version: 3,
    isActive: true
  }
}
```

### 6.2 Job Descriptions

**What to Embed:**
- Job title
- Company name
- Full description
- Requirements
- Responsibilities
- Benefits
- Location/remote info

**When to Embed:**
- New job posted
- Job updated
- User saves/bookmarks job

```typescript
{
  jobId: "job789",
  userId: null, // Global job or null if user-specific
  documentType: "job_description",
  content: `Senior Software Engineer at TechCorp

Location: San Francisco, CA (Remote)
Salary: $120k-180k

Description:
Build scalable web applications...

Requirements:
- 5+ years React experience
- Node.js expertise
...`,
  embedding: [...],
  metadata: {
    title: "Senior Software Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    remote: true,
    postedDate: "2025-01-10",
    matchScore: 95, // Pre-computed for this user
  }
}
```

### 6.3 Career Knowledge Base

Build a curated knowledge base of career advice:

**Topics to Include:**
1. Resume Writing Best Practices
2. Cover Letter Templates & Tips
3. Interview Preparation Guides
4. Salary Negotiation Strategies
5. Networking Advice
6. Industry-Specific Guides (Tech, Healthcare, Finance, etc.)
7. Job Search Strategies
8. LinkedIn Optimization
9. Portfolio Development
10. Career Transitions

**Sources:**
- Curated articles from career experts
- Industry best practices
- Success stories
- Common Q&A

**Example:**
```typescript
{
  documentType: "knowledge",
  topic: "resume_writing",
  category: "resume_tips",
  content: `How to Write an Effective Resume Summary:

A resume summary should be 2-3 sentences that highlight:
1. Your professional identity (job title, years of experience)
2. Key skills and expertise
3. Notable achievements or value proposition

Example:
"Senior Software Engineer with 8+ years building scalable web applications. Expert in React, Node.js, and cloud architecture. Led team of 5 developers to deliver $2M revenue-generating platform."

Tips:
- Use action verbs
- Quantify achievements
- Tailor to target job
- Keep it concise...`,
  embedding: [...],
  metadata: {
    category: "resume_tips",
    subcategory: "summary",
    difficulty: "beginner",
    tags: ["resume", "summary", "writing"],
    lastUpdated: "2025-01-01",
  }
}
```

### 6.4 Conversation History

Embed conversation for context in future sessions:

**Strategy:**
- Embed every 5-10 message exchanges
- Keep last 3 conversations readily accessible
- Archive older conversations (reduce token usage)

```typescript
{
  documentType: "conversation",
  userId: "user123",
  conversationId: "conv456",
  content: `User: Help me improve my resume
Assistant: I'd be happy to help! Based on your current resume, I notice a few areas where we can make improvements:

1. Your summary section could be more impactful...
2. Your experience bullets could use more quantifiable achievements...

User: Can you give me examples for the experience section?
Assistant: Absolutely! Here are some ways to improve your experience bullets...`,
  embedding: [...],
  metadata: {
    conversationDate: "2025-01-15",
    messageCount: 8,
    topics: ["resume", "experience_section"],
    satisfactionRating: 5, // User feedback
  }
}
```

---

## 7. Use Case Implementations

### 7.1 Resume Optimization

**Flow:**
```
User: "Help me improve my resume for a senior developer position"
  ↓
Retrieve:
  - User's current resume
  - Target job description (if specified)
  - Knowledge: resume best practices
  - Knowledge: tech industry standards
  ↓
Generate:
  - Specific suggestions with examples
  - Before/after comparisons
  - Keyword optimization tips
```

**Prompt Template:**
```typescript
const resumeOptimizationPrompt = `
System: You are an expert resume coach specializing in tech careers.

Context:
User's Current Resume:
${userResume}

${targetJob ? `Target Job Description:\n${jobDescription}` : ""}

Best Practices:
${knowledgeContext}

User Query: ${userQuery}

Instructions:
1. Analyze the resume against best practices and target job
2. Provide specific, actionable improvements
3. Give before/after examples
4. Highlight missing keywords or skills
5. Suggest stronger action verbs and quantifiable achievements
`;
```

### 7.2 Job Matching

**Flow:**
```
User: "Find jobs matching my skills"
  ↓
Retrieve:
  - User's resume (extract skills)
  - All job descriptions in database
  - Calculate semantic similarity
  ↓
Rank:
  - Top 10 matches by similarity score
  - Filter by user preferences (location, salary, etc.)
  ↓
Present:
  - Job listings with match scores
  - Explanation of why each job is a good fit
  - Gaps to address in application
```

**Implementation:**
```typescript
export const findMatchingJobs = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Get user's resume
    const resume = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("type"), "resume"))
      .first();

    if (!resume) return [];

    // Get resume embedding
    const resumeEmbedding = await ctx.db
      .query("documentEmbeddings")
      .withIndex("by_document", (q) => q.eq("documentId", resume._id))
      .first();

    // Find similar jobs
    const matchingJobs = await ctx.db
      .query("documentEmbeddings")
      .withIndex("by_embedding", (q) =>
        q.similar("embedding", resumeEmbedding.embedding, 20)
      )
      .filter((q) => q.eq(q.field("documentType"), "job_description"))
      .collect();

    // Return with match scores
    return matchingJobs.map((job) => ({
      ...job,
      matchScore: Math.round(job._score * 100),
    }));
  },
});
```

### 7.3 Interview Preparation

**Flow:**
```
User: "Prepare me for an interview at Google"
  ↓
Retrieve:
  - User's resume
  - Target job description
  - Knowledge: interview tips
  - Knowledge: company-specific interview guides
  ↓
Generate:
  - Common interview questions
  - STAR method examples based on user's experience
  - Technical questions relevant to job requirements
  - Behavioral questions
  - Questions to ask interviewer
```

**Prompt Template:**
```typescript
const interviewPrepPrompt = `
System: You are an interview coach with expertise in tech interviews.

User's Background:
${userResume}

Target Position:
${jobDescription}

Interview Best Practices:
${knowledgeContext}

User Query: ${userQuery}

Instructions:
1. Generate 10 likely interview questions based on the job requirements
2. For each question, provide:
   - The question
   - Why they're asking (what they're looking for)
   - A sample STAR answer using the user's experience
   - Tips for answering effectively
3. Include both technical and behavioral questions
4. Suggest 5 questions the user should ask the interviewer
`;
```

### 7.4 Cover Letter Writing

**Flow:**
```
User: "Write a cover letter for this job"
  ↓
Retrieve:
  - User's resume
  - Target job description
  - Knowledge: cover letter best practices
  - User's previous cover letters (for style consistency)
  ↓
Generate:
  - Personalized cover letter
  - Highlight relevant experience
  - Address job requirements
  - Company-specific enthusiasm
```

**Implementation:**
```typescript
const coverLetterPrompt = `
System: You are a professional cover letter writer.

User's Resume:
${userResume}

Job Posting:
${jobDescription}

Cover Letter Best Practices:
${knowledgeContext}

${previousCoverLetters ? `User's Previous Cover Letters (for style reference):\n${previousCoverLetters}` : ""}

Instructions:
1. Write a compelling cover letter (300-400 words)
2. Opening: Hook that shows enthusiasm and knowledge of company
3. Body: Match user's experience to job requirements with specific examples
4. Closing: Clear call-to-action
5. Maintain professional yet personable tone
6. Use user's previous style if available
`;
```

---

## 8. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

**Tasks:**
1. Set up Convex vector database schema
2. Implement embedding pipeline for documents
3. Create basic RAG query flow
4. Test with sample data

**Deliverables:**
- Convex schema with vector indexes
- Document embedding functions
- Basic chat endpoint with RAG

### Phase 2: Core Features (Week 3-4)

**Tasks:**
1. Implement resume optimization
2. Build job matching algorithm
3. Create knowledge base and embed initial content
4. Add conversation history tracking

**Deliverables:**
- Resume analysis feature
- Job recommendation engine
- 50+ knowledge articles embedded
- Conversation persistence

### Phase 3: Advanced Features (Week 5-6)

**Tasks:**
1. Interview preparation module
2. Cover letter generation
3. Streaming responses
4. Context ranking improvements

**Deliverables:**
- Interview prep chatbot
- Cover letter writer
- Real-time streaming UI
- Enhanced relevance scoring

### Phase 4: Optimization (Week 7-8)

**Tasks:**
1. Performance optimization
2. Cost reduction (caching, deduplication)
3. User feedback integration
4. Analytics and monitoring

**Deliverables:**
- Optimized query performance (<2s response time)
- 30% cost reduction through caching
- User satisfaction tracking
- Analytics dashboard

---

## 9. Cost Analysis

### 9.1 Embedding Costs

**Assumptions:**
- Average user: 2 resumes, 3 cover letters
- Each document: ~500 tokens
- 100 active users

**Calculations:**
```
Documents per user: 5 documents × 500 tokens = 2,500 tokens
100 users: 100 × 2,500 = 250,000 tokens

Cost: 250,000 / 1,000,000 × $0.02 = $0.005
```

**One-time embedding cost:** ~$0.005 for initial user documents

**Knowledge Base:**
```
100 articles × 2,000 tokens = 200,000 tokens
Cost: 200,000 / 1,000,000 × $0.02 = $0.004
```

**Job Listings:**
```
1,000 jobs × 400 tokens = 400,000 tokens
Cost: 400,000 / 1,000,000 × $0.02 = $0.008
```

**Total Initial Embedding:** ~$0.02 (one-time)

**Monthly Updates:**
- Assume 20% document updates/month
- New jobs: 200/month
- **Monthly Embedding Cost:** ~$0.01/user

### 9.2 LLM Inference Costs

**GPT-4 Turbo Pricing:**
- Input: $10 / 1M tokens
- Output: $30 / 1M tokens

**Average Conversation:**
- User message: 50 tokens
- Retrieved context: 2,000 tokens
- System prompt: 500 tokens
- Conversation history: 500 tokens
- **Total Input:** 3,050 tokens
- **Output:** 400 tokens

**Per Message Cost:**
```
Input: 3,050 / 1,000,000 × $10 = $0.03
Output: 400 / 1,000,000 × $30 = $0.012
Total: $0.042 per message
```

**Per Conversation (avg 20 messages):**
```
20 × $0.042 = $0.84
```

**With Caching (50% reduction on context):**
```
~$0.50 per conversation
```

### 9.3 Alternative: Claude 3.5 Sonnet

**Claude 3.5 Sonnet Pricing:**
- Input: $3 / 1M tokens
- Output: $15 / 1M tokens

**Per Message Cost:**
```
Input: 3,050 / 1,000,000 × $3 = $0.009
Output: 400 / 1,000,000 × $15 = $0.006
Total: $0.015 per message
```

**Per Conversation:**
```
20 × $0.015 = $0.30
```

**60% cheaper than GPT-4!**

### 9.4 Total Monthly Costs (100 users)

| Component | Cost (GPT-4) | Cost (Claude) |
|-----------|--------------|---------------|
| Embeddings | $1 | $1 |
| Conversations (5/user/month) | $420 | $150 |
| Vector DB (Convex) | Included | Included |
| **Total** | **$421/month** | **$151/month** |
| **Per User** | **$4.21/month** | **$1.51/month** |

### 9.5 Cost Optimization Strategies

1. **Caching:** Cache common queries (50% reduction)
2. **Smaller Models:** Use GPT-3.5 for simple queries (80% cheaper)
3. **Smart Retrieval:** Reduce context size (30% reduction)
4. **Conversation Limits:** Limit free tier to 10 messages/month
5. **Batch Processing:** Process embeddings in batches

**Optimized Cost per User:**
- GPT-4: **$2.00/month**
- Claude: **$0.75/month**

---

## 10. Code Examples

### 10.1 Complete Convex Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User documents
  documents: defineTable({
    userId: v.string(),
    title: v.string(),
    type: v.union(
      v.literal("resume"),
      v.literal("cover_letter"),
      v.literal("portfolio")
    ),
    content: v.string(),
    lastModified: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("final"),
      v.literal("archived")
    ),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["userId", "type"]),

  // Vector embeddings for all content
  embeddings: defineTable({
    // Reference
    sourceType: v.union(
      v.literal("document"),
      v.literal("job"),
      v.literal("knowledge"),
      v.literal("conversation")
    ),
    sourceId: v.string(),
    userId: v.optional(v.string()), // null for global content

    // Content
    content: v.string(),
    embedding: v.array(v.float64()),

    // Metadata
    metadata: v.object({
      title: v.string(),
      category: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      createdAt: v.string(),
      updatedAt: v.string(),
    }),

    // Versioning
    version: v.number(),
    isActive: v.boolean(),
  })
    .index("by_source", ["sourceType", "sourceId"])
    .index("by_user", ["userId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["sourceType", "userId", "isActive"],
    }),

  // Jobs
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
    salary: v.optional(
      v.object({
        min: v.number(),
        max: v.number(),
        currency: v.string(),
      })
    ),
    description: v.string(),
    requirements: v.array(v.string()),
    posted: v.string(),
  }).index("by_posted", ["posted"]),

  // Conversations
  conversations: defineTable({
    userId: v.string(),
    title: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
    messageCount: v.number(),
  }).index("by_user", ["userId"]),

  // Messages
  messages: defineTable({
    conversationId: v.id("conversations"),
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    timestamp: v.string(),

    // Optional metadata
    sources: v.optional(
      v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          relevance: v.number(),
        })
      )
    ),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user", ["userId"]),

  // User applications
  applications: defineTable({
    jobId: v.id("jobs"),
    userId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("interview"),
      v.literal("offer"),
      v.literal("rejected")
    ),
    appliedAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_job", ["jobId"]),
});
```

### 10.2 Embedding Generation Function

```typescript
// convex/ai/embeddings.ts
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const embedDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    // Get document
    const document = await ctx.db.get(args.documentId);
    if (!document) throw new Error("Document not found");

    // Generate embedding
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: document.content,
      encoding_format: "float",
    });

    const embedding = embeddingResponse.data[0].embedding;

    // Check if embedding already exists
    const existingEmbedding = await ctx.db
      .query("embeddings")
      .withIndex("by_source", (q) =>
        q.eq("sourceType", "document").eq("sourceId", args.documentId)
      )
      .first();

    if (existingEmbedding) {
      // Update existing
      await ctx.db.patch(existingEmbedding._id, {
        content: document.content,
        embedding,
        metadata: {
          title: document.title,
          updatedAt: new Date().toISOString(),
        },
        version: existingEmbedding.version + 1,
      });
    } else {
      // Create new
      await ctx.db.insert("embeddings", {
        sourceType: "document",
        sourceId: args.documentId,
        userId: document.userId,
        content: document.content,
        embedding,
        metadata: {
          title: document.title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        version: 1,
        isActive: true,
      });
    }

    return { success: true };
  },
});

export const embedJob = mutation({
  args: {
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");

    // Construct rich text representation
    const jobText = `${job.title} at ${job.company}

Location: ${job.location}
Type: ${job.type}
${job.salary ? `Salary: $${job.salary.min}-${job.salary.max}` : ""}

Description:
${job.description}

Requirements:
${job.requirements.join("\n")}`;

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: jobText,
    });

    await ctx.db.insert("embeddings", {
      sourceType: "job",
      sourceId: args.jobId,
      userId: undefined, // Jobs are global
      content: jobText,
      embedding: embeddingResponse.data[0].embedding,
      metadata: {
        title: `${job.title} - ${job.company}`,
        category: "job_posting",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      version: 1,
      isActive: true,
    });

    return { success: true };
  },
});
```

### 10.3 RAG Query Implementation

```typescript
// convex/ai/chat.ts
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatWithAssistant = mutation({
  args: {
    userId: v.string(),
    message: v.string(),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    // 1. Get or create conversation
    let conversationId = args.conversationId;
    if (!conversationId) {
      conversationId = await ctx.db.insert("conversations", {
        userId: args.userId,
        title: args.message.slice(0, 50) + "...",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 0,
      });
    }

    // 2. Generate query embedding
    const queryEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: args.message,
    });

    // 3. Retrieve relevant context
    const relevantDocs = await ctx.db
      .query("embeddings")
      .withIndex("by_embedding", (q) =>
        q.similar(
          "embedding",
          queryEmbedding.data[0].embedding,
          10
        )
      )
      .filter((q) =>
        q.or(
          q.eq(q.field("userId"), args.userId), // User's docs
          q.eq(q.field("userId"), undefined) // Global knowledge
        )
      )
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // 4. Get conversation history
    const history = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId)
      )
      .order("asc")
      .take(10);

    // 5. Construct prompt
    const systemPrompt = `You are an expert career coach and advisor specializing in helping job seekers succeed. You provide personalized, actionable advice based on the user's specific situation.

Your expertise includes:
- Resume and cover letter optimization
- Job search strategies
- Interview preparation
- Career development and transitions
- Professional networking
- Salary negotiation

Always be encouraging, specific, and cite sources when referencing the user's documents or external knowledge.`;

    const contextPrompt = relevantDocs.length > 0
      ? `Relevant context from user's documents and knowledge base:\n\n${relevantDocs
          .map(
            (doc, i) =>
              `[${i + 1}] ${doc.metadata.title}:\n${doc.content.slice(0, 500)}...`
          )
          .join("\n\n")}`
      : "";

    const messages: any[] = [
      { role: "system", content: systemPrompt },
      { role: "system", content: contextPrompt },
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: args.message },
    ];

    // 6. Call LLM
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const assistantResponse = completion.choices[0].message.content || "";

    // 7. Save messages
    await ctx.db.insert("messages", {
      conversationId,
      userId: args.userId,
      role: "user",
      content: args.message,
      timestamp: new Date().toISOString(),
    });

    await ctx.db.insert("messages", {
      conversationId,
      userId: args.userId,
      role: "assistant",
      content: assistantResponse,
      timestamp: new Date().toISOString(),
      sources: relevantDocs.slice(0, 3).map((doc) => ({
        id: doc.sourceId,
        title: doc.metadata.title,
        relevance: doc._score || 0,
      })),
    });

    // 8. Update conversation
    await ctx.db.patch(conversationId, {
      updatedAt: new Date().toISOString(),
      messageCount: history.length + 2,
    });

    return {
      response: assistantResponse,
      sources: relevantDocs.slice(0, 3).map((doc) => ({
        id: doc.sourceId,
        title: doc.metadata.title,
        type: doc.sourceType,
      })),
      conversationId,
    };
  },
});
```

### 10.4 React Integration

```typescript
// src/hooks/useCareerAssistant.ts
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function useCareerAssistant(userId: string) {
  const [conversationId, setConversationId] = useState<string>();

  const chatMutation = useMutation(api.ai.chat.chatWithAssistant);

  const sendMessage = async (message: string) => {
    const result = await chatMutation({
      userId,
      message,
      conversationId,
    });

    if (!conversationId) {
      setConversationId(result.conversationId);
    }

    return result;
  };

  return { sendMessage };
}

// Usage in Chat.tsx
import { useCareerAssistant } from "@/hooks/useCareerAssistant";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { sendMessage } = useCareerAssistant("user123");

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Call RAG-powered assistant
      const result = await sendMessage(inputValue);

      // Add assistant response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.response,
        timestamp: new Date().toISOString(),
        sources: result.sources, // Display sources in UI
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      // Handle error
    } finally {
      setIsTyping(false);
    }
  };

  // ... rest of component
};
```

---

## Appendix A: Knowledge Base Topics

### Initial Knowledge Articles (50+)

**Resume Writing (10 articles)**
1. How to Write an Effective Resume Summary
2. Action Verbs for Resume Bullet Points
3. Quantifying Achievements: The STAR Method
4. ATS-Friendly Resume Formatting
5. Tailoring Your Resume to Job Descriptions
6. Common Resume Mistakes to Avoid
7. Resume Length: How Long Should It Be?
8. Including Freelance and Contract Work
9. Addressing Employment Gaps
10. Keywords and Optimization

**Cover Letters (5 articles)**
1. Cover Letter Structure and Format
2. Opening Paragraphs That Hook
3. Addressing Career Changes
4. Company Research for Cover Letters
5. When to Include a Cover Letter

**Interview Preparation (15 articles)**
1. Common Interview Questions and Answers
2. Behavioral Interview: STAR Method Examples
3. Technical Interview Preparation
4. System Design Interview Guide
5. Questions to Ask Your Interviewer
6. Phone Interview Best Practices
7. Video Interview Tips
8. Salary Negotiation Strategies
9. Following Up After Interviews
10. Handling Difficult Interview Questions
11. Panel Interview Strategies
12. Case Interview Frameworks
13. Whiteboard Coding Best Practices
14. Cultural Fit Questions
15. Second Round Interview Prep

**Job Search (10 articles)**
1. Effective Job Search Strategies
2. Networking for Job Seekers
3. Using LinkedIn Effectively
4. Hidden Job Market: Finding Unlisted Jobs
5. When to Apply to Jobs
6. Application Tracking and Organization
7. Job Search While Employed
8. Relocating for a Job
9. Remote Job Search Tips
10. Leveraging Recruiters

**Career Development (10 articles)**
1. Career Change Strategies
2. Upskilling and Reskilling
3. Building a Professional Portfolio
4. Personal Branding
5. Side Projects for Career Growth
6. Mentorship: Finding and Being a Mentor
7. Work-Life Balance
8. Career Advancement Strategies
9. Freelancing vs. Full-Time
10. Building Professional Relationships

---

## Appendix B: Performance Benchmarks

### Target Metrics

| Metric | Target | Current (Baseline) |
|--------|--------|-------------------|
| Query Response Time | <2s | N/A |
| Embedding Generation | <500ms | N/A |
| Vector Search | <100ms | N/A |
| Context Assembly | <200ms | N/A |
| LLM Inference | <1s | N/A |
| User Satisfaction | >4.5/5 | N/A |
| Answer Accuracy | >90% | N/A |
| Source Citation Rate | >80% | N/A |

---

## Appendix C: Monitoring and Analytics

### Key Metrics to Track

1. **Usage Metrics:**
   - Messages per user
   - Conversations per user
   - Active users (daily/monthly)
   - Session duration

2. **Performance Metrics:**
   - Average response time
   - P95/P99 latency
   - Error rate
   - Cache hit rate

3. **Quality Metrics:**
   - User satisfaction ratings
   - Thumbs up/down per response
   - Follow-up question rate
   - Conversation abandonment rate

4. **Cost Metrics:**
   - Embedding costs (daily/monthly)
   - LLM inference costs
   - Cost per user
   - Cost per conversation

5. **Content Metrics:**
   - Most retrieved documents
   - Knowledge base usage
   - Low-performing articles
   - Coverage gaps

### Monitoring Tools

- Convex Dashboard (built-in)
- OpenAI Usage Dashboard
- Custom analytics (PostHog, Mixpanel)
- Error tracking (Sentry)

---

## Conclusion

This RAG architecture provides CareerSU with a robust, scalable, and cost-effective AI career assistant. Key benefits:

1. **Personalized:** Uses user's actual documents and history
2. **Accurate:** Grounded in real job descriptions and curated knowledge
3. **Cost-Effective:** $0.75-2.00 per user per month
4. **Scalable:** Convex handles growth seamlessly
5. **Maintainable:** Clear separation of concerns

**Next Steps:**
1. Review and approve architecture
2. Set up Convex vector database
3. Implement Phase 1 (Weeks 1-2)
4. Test with beta users
5. Iterate based on feedback

**Questions or Concerns:**
Contact: [Your Email]
