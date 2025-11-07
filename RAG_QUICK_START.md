# RAG Quick Start Guide for CareerSU

Get your RAG-powered AI career assistant up and running in 30 minutes.

---

## Prerequisites

- Node.js 18+ installed
- Convex account (sign up at [convex.dev](https://convex.dev))
- OpenAI API key (get at [platform.openai.com](https://platform.openai.com))
- CareerSU platform already set up

---

## Step 1: Install Dependencies (5 minutes)

```bash
# Install OpenAI SDK
npm install openai

# Install Convex (if not already installed)
npm install convex

# Install dev dependencies
npm install --save-dev @types/node
```

---

## Step 2: Initialize Convex (5 minutes)

```bash
# Initialize Convex in your project
npx convex dev

# This will:
# 1. Create convex/ directory
# 2. Generate convex.json config
# 3. Start local dev server
```

Follow the prompts to:
1. Sign in to Convex
2. Create a new project or select existing
3. Choose deployment name

---

## Step 3: Set Up Schema (5 minutes)

Create `convex/schema.ts`:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Your existing tables (users, documents, jobs, etc.)
  // ...

  // Add new table for embeddings
  embeddings: defineTable({
    sourceType: v.union(
      v.literal("document"),
      v.literal("job"),
      v.literal("knowledge")
    ),
    sourceId: v.string(),
    userId: v.optional(v.string()),
    content: v.string(),
    embedding: v.array(v.float64()),
    metadata: v.object({
      title: v.string(),
      category: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      createdAt: v.string(),
      updatedAt: v.string(),
    }),
    version: v.number(),
    isActive: v.boolean(),
  })
    .index("by_source", ["sourceType", "sourceId"])
    .index("by_user", ["userId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536, // OpenAI text-embedding-3-small
      filterFields: ["sourceType", "userId", "isActive"],
    }),

  // Add conversations table
  conversations: defineTable({
    userId: v.string(),
    title: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
    messageCount: v.number(),
  }).index("by_user", ["userId"]),

  // Add messages table
  messages: defineTable({
    conversationId: v.id("conversations"),
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    timestamp: v.string(),
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
});
```

Push schema to Convex:
```bash
# Schema will auto-deploy when you save the file (if convex dev is running)
```

---

## Step 4: Configure OpenAI (2 minutes)

Create `convex/.env.local`:

```bash
OPENAI_API_KEY=sk-your-api-key-here
```

**Important:** Add to `.gitignore`:
```
convex/.env.local
```

---

## Step 5: Create OpenAI Action (5 minutes)

Convex requires using **Actions** for external API calls.

Create `convex/ai/openai.ts`:

```typescript
import { action } from "../_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate embedding for text
export const generateEmbedding = action({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: args.text,
    });

    return response.data[0].embedding;
  },
});

// Generate chat response
export const generateChatResponse = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(
          v.literal("system"),
          v.literal("user"),
          v.literal("assistant")
        ),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: args.messages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    return response.choices[0].message.content || "";
  },
});
```

---

## Step 6: Create Embedding Functions (5 minutes)

Create `convex/ai/embeddings.ts`:

```typescript
import { mutation, internalMutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

// Embed a document
export const embedDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) throw new Error("Document not found");

    // Generate embedding via action
    const embedding = await ctx.runAction(internal.ai.openai.generateEmbedding, {
      text: document.content,
    });

    // Store embedding
    const existing = await ctx.db
      .query("embeddings")
      .withIndex("by_source", (q) =>
        q.eq("sourceType", "document").eq("sourceId", args.documentId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: document.content,
        embedding,
        metadata: {
          ...existing.metadata,
          title: document.title,
          updatedAt: new Date().toISOString(),
        },
        version: existing.version + 1,
      });
    } else {
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
```

---

## Step 7: Create Chat Function (5 minutes)

Create `convex/ai/chat.ts`:

```typescript
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

export const chat = mutation({
  args: {
    userId: v.string(),
    message: v.string(),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    // 1. Create or get conversation
    let conversationId = args.conversationId;
    if (!conversationId) {
      conversationId = await ctx.db.insert("conversations", {
        userId: args.userId,
        title: args.message.slice(0, 50),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 0,
      });
    }

    // 2. Generate query embedding
    const queryEmbedding = await ctx.runAction(
      internal.ai.openai.generateEmbedding,
      { text: args.message }
    );

    // 3. Vector search for relevant context
    const relevantDocs = await ctx.db
      .query("embeddings")
      .withIndex("by_embedding", (q) =>
        q.similar("embedding", queryEmbedding, 5)
      )
      .filter((q) =>
        q.and(
          q.or(
            q.eq(q.field("userId"), args.userId),
            q.eq(q.field("userId"), undefined)
          ),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();

    // 4. Get conversation history
    const history = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .order("asc")
      .take(10);

    // 5. Construct prompt
    const systemPrompt = `You are an expert career coach and advisor. You help job seekers with resume optimization, interview preparation, job search strategies, and career advice.

Use the provided context to give personalized, actionable advice. Always be encouraging and specific.`;

    const contextPrompt =
      relevantDocs.length > 0
        ? `Relevant context:\n\n${relevantDocs
            .map((doc, i) => `[${i + 1}] ${doc.metadata.title}:\n${doc.content.slice(0, 500)}`)
            .join("\n\n")}`
        : "";

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "system" as const, content: contextPrompt },
      ...history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: args.message },
    ];

    // 6. Generate response
    const response = await ctx.runAction(
      internal.ai.openai.generateChatResponse,
      { messages }
    );

    // 7. Save messages
    await ctx.db.insert("messages", {
      conversationId,
      userId: args.userId,
      role: "user",
      content: args.message,
      timestamp: new Date().toISOString(),
    });

    const sources = relevantDocs.slice(0, 3).map((doc) => ({
      id: doc.sourceId,
      title: doc.metadata.title,
      relevance: 0.9,
    }));

    await ctx.db.insert("messages", {
      conversationId,
      userId: args.userId,
      role: "assistant",
      content: response,
      timestamp: new Date().toISOString(),
      sources,
    });

    // 8. Update conversation
    await ctx.db.patch(conversationId, {
      updatedAt: new Date().toISOString(),
      messageCount: history.length + 2,
    });

    return {
      response,
      sources,
      conversationId,
    };
  },
});
```

---

## Step 8: Update React Chat Component (3 minutes)

Update `src/pages/Chat.tsx`:

```typescript
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatMutation = useMutation(api.ai.chat.chat);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

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
      // Call RAG-powered chat
      const result = await chatMutation({
        userId: "current-user-id", // Replace with actual user ID
        message: userMessage.content,
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // ... rest of component
};
```

---

## Step 9: Test the System (5 minutes)

### A. Embed a test document

```typescript
// In browser console or test script
const mutation = useMutation(api.ai.embeddings.embedDocument);

// Create a test resume first
const doc = await createDocument({
  userId: "test-user",
  type: "resume",
  title: "My Resume",
  content: "Software Engineer with 5 years experience in React and Node.js...",
});

// Embed it
await mutation({ documentId: doc._id });
```

### B. Chat with the assistant

```typescript
const chat = useMutation(api.ai.chat.chat);

const response = await chat({
  userId: "test-user",
  message: "Help me improve my resume",
});

console.log(response.response);
console.log(response.sources);
```

---

## Cost Calculator

### For 100 Active Users

**Assumptions:**
- Average: 5 conversations/user/month
- 20 messages per conversation
- 2 documents per user

**Monthly Costs:**

| Item | Calculation | Cost |
|------|------------|------|
| Document Embeddings | 100 users × 2 docs × 500 tokens × $0.02/1M | $0.002 |
| Query Embeddings | 100 users × 5 conv × 20 msgs × 50 tokens × $0.02/1M | $0.10 |
| LLM Inference (GPT-4) | 100 users × 5 conv × 20 msgs × (3000 input + 400 output) × $10-30/1M | $410 |
| **Total (GPT-4)** | | **$410.10** |
| **Per User** | | **$4.10** |

**With Claude 3.5 Sonnet (60% cheaper):**
- Total: **$164**
- Per User: **$1.64**

**Free Tier Strategy:**
- Limit: 10 messages/month for free users
- Cost per free user: ~$0.50/month
- Premium ($9.99/month): Unlimited messages

---

## Optimization Tips

### 1. Cache Common Queries

```typescript
// Store frequently asked questions and answers
const cache = new Map<string, string>();

if (cache.has(args.message)) {
  return { response: cache.get(args.message)!, sources: [] };
}
```

### 2. Use GPT-3.5 for Simple Queries

```typescript
// Detect simple queries
const isSimple = args.message.length < 50 && !args.message.includes("resume");

const model = isSimple ? "gpt-3.5-turbo" : "gpt-4-turbo-preview";
```

### 3. Batch Embeddings

```typescript
// Embed multiple documents at once
const texts = documents.map((d) => d.content);

const response = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: texts, // Array of texts
});
```

### 4. Reduce Context Size

```typescript
// Limit retrieved docs to top 3 instead of 10
const relevantDocs = await ctx.db
  .query("embeddings")
  .withIndex("by_embedding", (q) => q.similar("embedding", queryEmbedding, 3))
  .collect();
```

---

## Monitoring

### Key Metrics to Track

```typescript
// convex/analytics.ts
export const logChatMetrics = mutation({
  args: {
    userId: v.string(),
    responseTime: v.number(),
    tokensUsed: v.number(),
    satisfaction: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chatMetrics", {
      ...args,
      timestamp: new Date().toISOString(),
    });
  },
});
```

Track:
- Average response time
- Tokens used per conversation
- User satisfaction ratings
- Most common queries
- Error rates

---

## Troubleshooting

### Issue: "Vector index not found"

**Solution:** Ensure your schema includes the `vectorIndex`:

```typescript
.vectorIndex("by_embedding", {
  vectorField: "embedding",
  dimensions: 1536,
  filterFields: ["sourceType", "userId", "isActive"],
})
```

### Issue: "OpenAI API key not found"

**Solution:** Check `convex/.env.local`:
```bash
OPENAI_API_KEY=sk-...
```

Restart Convex dev:
```bash
npx convex dev
```

### Issue: Slow responses

**Solutions:**
1. Reduce number of retrieved docs (10 → 3)
2. Use smaller context windows
3. Cache common queries
4. Use GPT-3.5 for simple queries

### Issue: Poor answer quality

**Solutions:**
1. Improve prompt engineering
2. Increase retrieved docs (3 → 10)
3. Add more knowledge base articles
4. Fine-tune similarity threshold

---

## Next Steps

1. **Add Knowledge Base:** Seed with career advice articles
2. **Implement Streaming:** Use SSE or WebSocket for real-time responses
3. **Add Analytics:** Track usage and optimize
4. **User Feedback:** Thumbs up/down on responses
5. **Advanced Features:**
   - Multi-turn conversations
   - Document comparison
   - Interview prep quiz
   - Cover letter generation

---

## Resources

- [Convex Docs](https://docs.convex.dev)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [RAG Guide](https://www.anthropic.com/index/retrieval-augmented-generation)
- [CareerSU GitHub](https://github.com/your-repo)

---

## Support

Questions? Issues?
- Discord: [CareerSU Community](#)
- Email: support@careersu.com
- GitHub Issues: [Report a bug](#)

---

**You're all set!** 🚀

Your RAG-powered AI career assistant is ready to help users with personalized career advice.
