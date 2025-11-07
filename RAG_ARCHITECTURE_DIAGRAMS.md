# RAG Architecture Diagrams for CareerSU

Visual representations of the RAG system architecture.

---

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CAREERSU PLATFORM                            │
└─────────────────────────────────────────────────────────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│   Frontend   │          │   Convex     │          │  External    │
│   (React)    │◄────────►│   Backend    │◄────────►│  AI APIs     │
│              │          │              │          │              │
│ • Chat UI    │          │ • Vector DB  │          │ • OpenAI     │
│ • Documents  │          │ • RAG Engine │          │ • Anthropic  │
│ • Jobs       │          │ • Auth       │          │              │
└──────────────┘          └──────────────┘          └──────────────┘
```

---

## 2. RAG Processing Pipeline

```
┌──────────────────────────────────────────────────────────────────────┐
│                        USER QUERY                                     │
│  "Help me improve my resume for a senior developer position"         │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Intent Detection │
                    │                  │
                    │ Type: Resume     │
                    │ Action: Improve  │
                    │ Context: Dev     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Embed Query     │
                    │                  │
                    │  OpenAI API      │
                    │  1536-dim vector │
                    └────────┬─────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────────┐
│                    VECTOR DATABASE SEARCH                           │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐              │
│  │ User Resume │  │ Job Postings│  │  Knowledge   │              │
│  │ Embeddings  │  │  Embeddings │  │     Base     │              │
│  │             │  │             │  │  Embeddings  │              │
│  │  [vector]   │  │  [vector]   │  │   [vector]   │              │
│  └─────────────┘  └─────────────┘  └──────────────┘              │
│                                                                     │
│                  Similarity Search (Cosine)                         │
│                        Top K=10                                     │
│                  Filter: userId, isActive                           │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Rank Results    │
                    │                  │
                    │ Score = 0.4×sim  │
                    │       + 0.3×rec  │
                    │       + 0.3×rel  │
                    └────────┬─────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────────┐
│                    RETRIEVED CONTEXT (Top 5)                        │
│                                                                     │
│  1. User's Resume (0.95 similarity)                                │
│     "Senior Software Engineer with 8 years..."                     │
│                                                                     │
│  2. "How to Write Resume Summary" (0.87 similarity)                │
│     "A resume summary should highlight..."                         │
│                                                                     │
│  3. "Action Verbs for Resumes" (0.82 similarity)                   │
│     "Use strong action verbs like Led, Achieved..."                │
│                                                                     │
│  4. Senior Dev Job Posting (0.78 similarity)                       │
│     "Seeking Senior Developer with React..."                       │
│                                                                     │
│  5. "ATS Optimization Guide" (0.75 similarity)                     │
│     "Optimize your resume for ATS systems..."                      │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────────┐
│                    PROMPT CONSTRUCTION                              │
│                                                                     │
│  System Prompt:                                                    │
│  "You are an expert career coach..."                               │
│                                                                     │
│  Context:                                                          │
│  [Top 5 retrieved documents]                                       │
│                                                                     │
│  Conversation History:                                             │
│  [Last 5 messages]                                                 │
│                                                                     │
│  User Query:                                                       │
│  "Help me improve my resume for a senior developer position"       │
│                                                                     │
│  Total Tokens: ~3500                                               │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   LLM Generate   │
                    │                  │
                    │  Claude 3.5      │
                    │  Sonnet          │
                    │                  │
                    │  Temp: 0.7       │
                    │  Max: 1500       │
                    └────────┬─────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────────┐
│                         RESPONSE                                    │
│                                                                     │
│  "Based on your resume, here are 5 specific improvements:          │
│                                                                     │
│   1. SUMMARY: Your current summary is good, but could be           │
│      more impactful. Instead of:                                   │
│      'Experienced developer with many skills'                      │
│                                                                     │
│      Try:                                                          │
│      'Senior Software Engineer with 8+ years building scalable     │
│       web applications. Expert in React, Node.js, and AWS.         │
│       Led team of 5 to deliver $2M revenue-generating platform.'   │
│                                                                     │
│   2. ACTION VERBS: Replace weak verbs with power verbs:            │
│      • 'Responsible for' → 'Led'                                   │
│      • 'Worked on' → 'Architected'                                 │
│      • 'Helped with' → 'Optimized'                                 │
│                                                                     │
│   3. QUANTIFY ACHIEVEMENTS..."                                     │
│                                                                     │
│  Sources:                                                          │
│  [1] Your Resume                                                   │
│  [2] How to Write Resume Summary (95% match)                       │
│  [3] Action Verbs for Resumes (87% match)                          │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Store & Display │
                    │                  │
                    │ • Save message   │
                    │ • Update history │
                    │ • Show to user   │
                    └──────────────────┘
```

---

## 3. Data Flow: Document Upload

```
┌──────────────────────────────────────────────────────────────────┐
│                    USER UPLOADS RESUME                            │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  Frontend       │
                │  Validation     │
                │                 │
                │ • File type     │
                │ • Size limit    │
                │ • Parse content │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  Convex         │
                │  Mutation       │
                │                 │
                │  Insert into    │
                │  'documents'    │
                │  table          │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  Trigger        │
                │  Embedding      │
                │                 │
                │  Auto-run on    │
                │  insert/update  │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  OpenAI Action  │
                │                 │
                │  Call embedding │
                │  API            │
                │                 │
                │  Input: text    │
                │  Output: vector │
                └────────┬────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                    STORE EMBEDDING                                │
│                                                                   │
│  {                                                                │
│    sourceType: "document",                                        │
│    sourceId: "doc123",                                            │
│    userId: "user456",                                             │
│    content: "Full resume text...",                                │
│    embedding: [0.234, -0.123, 0.456, ...], // 1536 dimensions   │
│    metadata: {                                                    │
│      title: "Senior Developer Resume",                            │
│      createdAt: "2025-01-15T10:30:00Z",                          │
│      updatedAt: "2025-01-15T10:30:00Z"                           │
│    },                                                             │
│    version: 1,                                                    │
│    isActive: true                                                 │
│  }                                                                │
└──────────────────────────────────────────────────────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  Success        │
                │  Notification   │
                │                 │
                │  "Resume ready  │
                │   for AI chat!" │
                └─────────────────┘
```

---

## 4. Vector Similarity Search

```
Query: "Find jobs matching my skills"

Step 1: Get Resume Embedding
┌──────────────────────────┐
│  Resume Vector           │
│  [0.12, -0.34, 0.56...] │
└──────────────────────────┘

Step 2: Compare with All Job Embeddings
┌─────────────────────────────────────────────────────────────┐
│                    JOB EMBEDDINGS                            │
│                                                              │
│  Job 1: [0.10, -0.32, 0.54...]  → Cosine Sim: 0.95 ✅       │
│  Job 2: [0.45, 0.67, -0.23...]  → Cosine Sim: 0.88 ✅       │
│  Job 3: [-0.78, 0.12, 0.34...]  → Cosine Sim: 0.45 ❌       │
│  Job 4: [0.15, -0.30, 0.60...]  → Cosine Sim: 0.92 ✅       │
│  Job 5: [0.89, 0.23, -0.45...]  → Cosine Sim: 0.38 ❌       │
│  ...                                                         │
│  Job 1000: [0.02, -0.45, 0.78...] → Cosine Sim: 0.65        │
└─────────────────────────────────────────────────────────────┘

Step 3: Rank by Similarity
┌────────────────────────────────────────┐
│  Top Matches:                          │
│                                        │
│  1. Job 1: Senior React Dev (95%)     │
│  2. Job 4: Full-Stack Eng (92%)       │
│  3. Job 2: Frontend Lead (88%)        │
│  4. Job 7: JavaScript Dev (87%)       │
│  5. Job 12: Web Developer (84%)       │
└────────────────────────────────────────┘

Cosine Similarity Formula:
                A · B
similarity = ─────────
              |A| |B|

Where A = resume vector, B = job vector
```

---

## 5. Database Schema Relationships

```
┌─────────────┐
│    users    │
│─────────────│
│ _id         │◄────────┐
│ email       │         │
│ name        │         │
│ role        │         │
└─────────────┘         │
                        │ userId
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌──────────────┐
│  documents  │  │conversations│  │ applications │
│─────────────│  │─────────────│  │──────────────│
│ _id         │  │ _id         │  │ _id          │
│ userId      │  │ userId      │  │ userId       │
│ title       │  │ title       │  │ jobId        │
│ type        │  │ createdAt   │  │ status       │
│ content     │  │ messageCount│  └──────────────┘
│ status      │  └─────────────┘
└──────┬──────┘         │
       │                │ conversationId
       │ documentId     │
       │                ▼
       │         ┌──────────────┐
       │         │   messages   │
       │         │──────────────│
       │         │ _id          │
       │         │ conversationId
       │         │ userId       │
       │         │ role         │
       │         │ content      │
       │         │ sources[]    │
       │         └──────────────┘
       │
       ▼
┌──────────────┐
│  embeddings  │
│──────────────│
│ _id          │
│ sourceType   │◄── "document" | "job" | "knowledge"
│ sourceId     │◄── references documents._id or jobs._id
│ userId       │
│ content      │
│ embedding[]  │◄── [1536 floats] - Vector Index
│ metadata{}   │
│ version      │
│ isActive     │
└──────────────┘
       ▲
       │ jobId
       │
┌──────┴───────┐
│     jobs     │
│──────────────│
│ _id          │
│ title        │
│ company      │
│ description  │
│ requirements │
│ location     │
│ salary{}     │
└──────────────┘
```

---

## 6. Embedding Generation Process

```
┌──────────────────────────────────────────────────────────────┐
│                    INPUT DOCUMENT                             │
│                                                               │
│  "Senior Software Engineer with 8+ years of experience        │
│   building scalable web applications. Expert in React,       │
│   Node.js, TypeScript, and AWS. Led team of 5 developers     │
│   to deliver $2M revenue-generating platform.                │
│                                                               │
│   EXPERIENCE:                                                 │
│   • Led development of microservices architecture...         │
│   • Optimized database queries, reducing load time by 40%... │
│   • Mentored junior developers..."                           │
│                                                               │
│  (500 tokens)                                                 │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  Preprocessing  │
                │                 │
                │ • Clean text    │
                │ • Remove HTML   │
                │ • Normalize     │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  OpenAI API     │
                │                 │
                │  Model:         │
                │  text-embedding │
                │  -3-small       │
                │                 │
                │  Input: 500 tok │
                │  Cost: $0.00001 │
                └────────┬────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    EMBEDDING VECTOR                           │
│                                                               │
│  [                                                            │
│    0.0234,  -0.1234,   0.4567,  -0.7890,   0.2345,          │
│   -0.5678,   0.8901,  -0.3456,   0.6789,  -0.0123,          │
│    0.4567,  -0.8901,   0.2345,  -0.6789,   0.1234,          │
│    ...                                                        │
│    0.7890,  -0.4567,   0.1234   // 1536 dimensions total     │
│  ]                                                            │
│                                                               │
│  Dimensionality: 1536                                         │
│  Vector Norm: 1.0 (normalized)                                │
│  Storage Size: ~6KB (1536 × 4 bytes)                         │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  Store in       │
                │  Vector DB      │
                │                 │
                │  Index: b-tree  │
                │  Metric: cosine │
                └─────────────────┘
```

---

## 7. Context Assembly Strategy

```
Retrieved Documents (10 docs):
┌──────────────────────────────────────────────────────────────┐
│ 1. User Resume           (0.95 sim, 500 tokens)              │
│ 2. Resume Tips Article   (0.87 sim, 800 tokens)              │
│ 3. Action Verbs Guide    (0.82 sim, 600 tokens)              │
│ 4. Senior Dev Job        (0.78 sim, 400 tokens)              │
│ 5. ATS Optimization      (0.75 sim, 700 tokens)              │
│ 6. Interview Prep        (0.72 sim, 900 tokens)  ← Cut here  │
│ 7. Cover Letter Tips     (0.68 sim, 500 tokens)              │
│ 8. Salary Negotiation    (0.65 sim, 600 tokens)              │
│ 9. LinkedIn Tips         (0.62 sim, 550 tokens)              │
│ 10. Networking Guide     (0.58 sim, 650 tokens)              │
└──────────────────────────────────────────────────────────────┘

Context Budget: 2500 tokens

Selection Strategy:
┌────────────────────────────────────────────────────────────┐
│                                                             │
│  Score = 0.4 × similarity                                  │
│        + 0.3 × recency                                     │
│        + 0.2 × documentType relevance                      │
│        + 0.1 × user preference                             │
│                                                             │
│  Filter: similarity > 0.70                                 │
│  Sort: by score descending                                 │
│  Take: while total_tokens < 2500                           │
└────────────────────────────────────────────────────────────┘

Final Context (Top 5):
┌────────────────────────────────────────────────────────────┐
│  [Doc 1] User Resume (500 tokens)                          │
│  [Doc 2] Resume Tips (800 tokens)                          │
│  [Doc 3] Action Verbs (600 tokens)                         │
│  [Doc 4] Senior Dev Job (400 tokens)                       │
│  [Doc 5] ATS Optimization (100 tokens, truncated)          │
│                                                             │
│  Total: 2400 tokens (within budget!)                       │
└────────────────────────────────────────────────────────────┘
```

---

## 8. Complete RAG System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CAREERSU RAG SYSTEM                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│ 1. USER      │ "Help me improve my resume"
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. FRONTEND (React)                                          │
│    • Capture input                                           │
│    • Show typing indicator                                   │
│    • Call Convex mutation                                    │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. CONVEX MUTATION (ai/chat.chat)                           │
│    • Validate input                                          │
│    • Get/create conversation                                 │
│    • Call embedding action                                   │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. OPENAI ACTION (generateEmbedding)                         │
│    • Call OpenAI API                                         │
│    • Return 1536-dim vector                                  │
│    • Cost: $0.00001                                          │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. VECTOR SEARCH                                             │
│    • Query embeddings table                                  │
│    • Similarity search (cosine)                              │
│    • Filter by userId + isActive                             │
│    • Return Top 10 docs                                      │
│    • Latency: ~50ms                                          │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│ 6. CONTEXT ASSEMBLY                                          │
│    • Rank by relevance score                                 │
│    • Select top 5 within token budget                        │
│    • Get conversation history (last 10 messages)             │
│    • Construct prompt                                        │
│    • Total tokens: ~3500                                     │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│ 7. ANTHROPIC ACTION (generateChatResponse)                   │
│    • Call Claude 3.5 Sonnet API                              │
│    • Streaming enabled                                       │
│    • Temperature: 0.7                                        │
│    • Max tokens: 1500                                        │
│    • Cost: ~$0.015                                           │
│    • Latency: ~2s                                            │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│ 8. SAVE TO DATABASE                                          │
│    • Insert user message                                     │
│    • Insert assistant message                                │
│    • Update conversation metadata                            │
│    • Store sources cited                                     │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│ 9. RETURN TO FRONTEND                                        │
│    • Response text                                           │
│    • Sources (with relevance scores)                         │
│    • Conversation ID                                         │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────┐
│ 10. DISPLAY  │ Stream response to user with citations
└──────────────┘

Total Latency: ~2.5 seconds
Total Cost: ~$0.015 per query
```

---

## 9. Scaling Architecture

### Current (100 users)
```
┌─────────────────────────────────────────┐
│          Single Convex Deployment        │
│                                          │
│  ┌────────────┐      ┌────────────┐    │
│  │  Vector DB │      │  Functions │    │
│  │  ~20MB     │      │  ~100/sec  │    │
│  └────────────┘      └────────────┘    │
│                                          │
│  OpenAI API: ~10K calls/month            │
│  Claude API: ~10K calls/month            │
└─────────────────────────────────────────┘
```

### Scale (10K users)
```
┌─────────────────────────────────────────────────────────┐
│           Convex Production Deployment                   │
│                                                          │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐     │
│  │  Vector DB │   │ Read Cache │   │  Functions │     │
│  │  ~2GB      │   │  ~500MB    │   │  ~1K/sec   │     │
│  └────────────┘   └────────────┘   └────────────┘     │
│                                                          │
│  OpenAI API: ~1M calls/month (with rate limits)          │
│  Claude API: ~1M calls/month (with batching)             │
│                                                          │
│  Caching: 40% hit rate                                   │
│  Avg latency: <2s (P95: <3s)                            │
└─────────────────────────────────────────────────────────┘
```

---

## 10. Cost Breakdown Visualization

### Per-Query Cost Breakdown (Claude 3.5)

```
┌────────────────────────────────────────────────────┐
│                                                     │
│  Query Embedding     █ $0.000001 (0.01%)           │
│  Vector Search       [free - Convex included]      │
│  LLM Input (3500 tk) ████████████ $0.011 (73%)     │
│  LLM Output (400 tk) ████ $0.006 (27%)             │
│                                                     │
│  TOTAL: $0.015 per query                           │
│                                                     │
└────────────────────────────────────────────────────┘

Monthly Cost for Different User Tiers (5 conversations/user/month):

Free Users (10 msgs/month):
100 users × 10 msgs × $0.015 = $15/month

Pro Users (unlimited, avg 100 msgs/month):
100 users × 100 msgs × $0.015 = $150/month

Enterprise (custom):
Custom pricing + dedicated knowledge base
```

---

## 11. Security & Privacy Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     USER DATA                               │
│              (Resume, Cover Letters)                        │
└──────────────────────┬─────────────────────────────────────┘
                       │
                       │ HTTPS/TLS
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                  CONVEX BACKEND                              │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Authentication & Authorization                       │   │
│  │  • Convex Auth (userId)                              │   │
│  │  • Row-level security                                │   │
│  │  • userId filter on all queries                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Data at Rest                                        │   │
│  │  • Encrypted in Convex DB                            │   │
│  │  • Isolated by userId                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Calls                                           │   │
│  │  • OpenAI: No data retention policy                  │   │
│  │  • Anthropic: No training on API data                │   │
│  │  • Ephemeral processing only                         │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘

Privacy Guarantees:
✅ User data isolated by userId
✅ Embeddings not shared between users
✅ No training on user data
✅ GDPR compliant (right to deletion)
✅ Encrypted in transit and at rest
```

---

## Summary

These diagrams illustrate:

1. **System Architecture** - High-level component interaction
2. **RAG Pipeline** - Step-by-step query processing
3. **Document Upload** - Embedding generation workflow
4. **Vector Search** - Similarity matching process
5. **Database Schema** - Data relationships
6. **Embedding Process** - Vector generation details
7. **Context Assembly** - Intelligent document selection
8. **Complete Flow** - End-to-end system operation
9. **Scaling** - Growth from 100 to 10K users
10. **Cost Breakdown** - Per-query economics
11. **Security** - Privacy and data protection

Use these diagrams as reference when implementing and explaining the RAG system to stakeholders.
