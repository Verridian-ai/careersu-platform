# RAG Implementation Examples for CareerSU

Complete code examples for implementing the RAG system.

---

## Table of Contents
1. [Convex Functions](#convex-functions)
2. [React Components](#react-components)
3. [Knowledge Base Seeding](#knowledge-base-seeding)
4. [Testing Examples](#testing-examples)

---

## 1. Convex Functions

### Directory Structure

```
convex/
├── schema.ts                 # Database schema
├── ai/
│   ├── embeddings.ts        # Embedding generation
│   ├── chat.ts              # RAG chat implementation
│   ├── analysis.ts          # Resume/job analysis
│   └── matching.ts          # Job matching logic
├── documents.ts             # Document CRUD operations
├── jobs.ts                  # Job CRUD operations
└── _generated/              # Auto-generated types
```

### convex/schema.ts (Complete)

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("job_seeker"), v.literal("coach")),
    avatar: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_email", ["email"]),

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
    .index("by_user_and_type", ["userId", "type"]),

  embeddings: defineTable({
    sourceType: v.union(
      v.literal("document"),
      v.literal("job"),
      v.literal("knowledge"),
      v.literal("conversation")
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
      dimensions: 1536,
      filterFields: ["sourceType", "userId", "isActive"],
    }),

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
  })
    .index("by_posted", ["posted"])
    .index("by_company", ["company"]),

  conversations: defineTable({
    userId: v.string(),
    title: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
    messageCount: v.number(),
  }).index("by_user", ["userId"]),

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

  knowledgeBase: defineTable({
    topic: v.string(),
    category: v.string(),
    title: v.string(),
    content: v.string(),
    difficulty: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced")
    ),
    tags: v.array(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_category", ["category"])
    .index("by_topic", ["topic"]),
});
```

### convex/ai/embeddings.ts

```typescript
import { mutation, internalMutation } from "../_generated/server";
import { v } from "convex/values";

// Note: In production, use Convex actions for external API calls
// This is a simplified version for demonstration

export const generateAndStoreEmbedding = internalMutation({
  args: {
    sourceType: v.union(
      v.literal("document"),
      v.literal("job"),
      v.literal("knowledge")
    ),
    sourceId: v.string(),
    userId: v.optional(v.string()),
    content: v.string(),
    title: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // In production, this would call OpenAI API
    // For now, we'll use a placeholder
    const embedding = await generateEmbedding(args.content);

    // Check if embedding exists
    const existing = await ctx.db
      .query("embeddings")
      .withIndex("by_source", (q) =>
        q.eq("sourceType", args.sourceType).eq("sourceId", args.sourceId)
      )
      .first();

    if (existing) {
      // Update
      await ctx.db.patch(existing._id, {
        content: args.content,
        embedding,
        metadata: {
          title: args.title,
          ...args.metadata,
          updatedAt: new Date().toISOString(),
        },
        version: existing.version + 1,
      });
      return existing._id;
    } else {
      // Insert
      return await ctx.db.insert("embeddings", {
        sourceType: args.sourceType,
        sourceId: args.sourceId,
        userId: args.userId,
        content: args.content,
        embedding,
        metadata: {
          title: args.title,
          ...args.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        version: 1,
        isActive: true,
      });
    }
  },
});

// Placeholder - in production, call OpenAI API
async function generateEmbedding(text: string): Promise<number[]> {
  // This should call OpenAI API
  // For testing, return dummy embedding
  return Array(1536).fill(0).map(() => Math.random());
}

export const embedDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) throw new Error("Document not found");

    await ctx.scheduler.runAfter(0, "ai/embeddings:generateAndStoreEmbedding", {
      sourceType: "document",
      sourceId: args.documentId,
      userId: document.userId,
      content: document.content,
      title: document.title,
      metadata: {
        category: document.type,
      },
    });

    return { success: true };
  },
});

export const embedAllUserDocuments = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const doc of documents) {
      await ctx.scheduler.runAfter(0, "ai/embeddings:generateAndStoreEmbedding", {
        sourceType: "document",
        sourceId: doc._id,
        userId: doc.userId,
        content: doc.content,
        title: doc.title,
        metadata: {
          category: doc.type,
        },
      });
    }

    return { count: documents.length };
  },
});
```

### convex/ai/chat.ts

```typescript
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const chat = mutation({
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
        title: args.message.slice(0, 50),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 0,
      });
    }

    // 2. Generate query embedding
    const queryEmbedding = await generateEmbedding(args.message);

    // 3. Retrieve relevant context via vector search
    const relevantDocs = await ctx.db
      .query("embeddings")
      .withIndex("by_embedding", (q) =>
        q.similar("embedding", queryEmbedding, 10)
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

    // 5. Construct prompt and call LLM
    const response = await generateResponse({
      message: args.message,
      relevantDocs,
      history,
    });

    // 6. Save messages
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
      relevance: 0.9, // In production, use actual similarity score
    }));

    await ctx.db.insert("messages", {
      conversationId,
      userId: args.userId,
      role: "assistant",
      content: response,
      timestamp: new Date().toISOString(),
      sources,
    });

    // 7. Update conversation
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

export const getConversations = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .collect();
  },
});

// Helper functions (in production, these call external APIs)
async function generateEmbedding(text: string): Promise<number[]> {
  // Call OpenAI API
  return Array(1536).fill(0).map(() => Math.random());
}

async function generateResponse(context: any): Promise<string> {
  // Call GPT-4 or Claude
  // For demo purposes, return a placeholder
  return "This is a placeholder response. In production, this would be generated by GPT-4 or Claude based on the retrieved context.";
}
```

### convex/ai/matching.ts

```typescript
import { query } from "../_generated/server";
import { v } from "convex/values";

export const findMatchingJobs = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;

    // Get user's resume
    const resume = await ctx.db
      .query("documents")
      .withIndex("by_user_and_type", (q) =>
        q.eq("userId", args.userId).eq("type", "resume")
      )
      .order("desc")
      .first();

    if (!resume) {
      return [];
    }

    // Get resume embedding
    const resumeEmbedding = await ctx.db
      .query("embeddings")
      .withIndex("by_source", (q) =>
        q.eq("sourceType", "document").eq("sourceId", resume._id)
      )
      .first();

    if (!resumeEmbedding) {
      return [];
    }

    // Find similar jobs
    const matchingJobEmbeddings = await ctx.db
      .query("embeddings")
      .withIndex("by_embedding", (q) =>
        q.similar("embedding", resumeEmbedding.embedding, limit)
      )
      .filter((q) => q.eq(q.field("sourceType"), "job"))
      .collect();

    // Get full job details
    const jobs = await Promise.all(
      matchingJobEmbeddings.map(async (jobEmbed) => {
        const job = await ctx.db.get(jobEmbed.sourceId as any);
        return {
          ...job,
          matchScore: Math.round(Math.random() * 20 + 80), // In production, use actual similarity
          embedding: jobEmbed,
        };
      })
    );

    return jobs.filter(Boolean);
  },
});

export const analyzeJobMatch = query({
  args: {
    userId: v.string(),
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    // Get user's resume
    const resume = await ctx.db
      .query("documents")
      .withIndex("by_user_and_type", (q) =>
        q.eq("userId", args.userId).eq("type", "resume")
      )
      .first();

    // Get job
    const job = await ctx.db.get(args.jobId);

    if (!resume || !job) {
      return null;
    }

    // Get embeddings
    const resumeEmbed = await ctx.db
      .query("embeddings")
      .withIndex("by_source", (q) =>
        q.eq("sourceType", "document").eq("sourceId", resume._id)
      )
      .first();

    const jobEmbed = await ctx.db
      .query("embeddings")
      .withIndex("by_source", (q) =>
        q.eq("sourceType", "job").eq("sourceId", args.jobId)
      )
      .first();

    if (!resumeEmbed || !jobEmbed) {
      return null;
    }

    // Calculate similarity (in production, use proper cosine similarity)
    const matchScore = Math.round(Math.random() * 20 + 80);

    // Generate detailed analysis using LLM
    const analysis = {
      matchScore,
      strengths: [
        "Strong technical skills match",
        "Relevant industry experience",
        "Location compatibility",
      ],
      gaps: [
        "Missing certification in X",
        "Could use more experience with Y",
      ],
      recommendations: [
        "Highlight your project involving Z in your cover letter",
        "Emphasize your leadership experience",
      ],
    };

    return analysis;
  },
});
```

---

## 2. React Components

### src/hooks/useCareerChat.ts

```typescript
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useCallback } from "react";
import { Id } from "../../convex/_generated/dataModel";

export interface ChatSource {
  id: string;
  title: string;
  relevance: number;
}

export interface ChatResponse {
  response: string;
  sources: ChatSource[];
  conversationId: Id<"conversations">;
}

export function useCareerChat(userId: string) {
  const [conversationId, setConversationId] = useState<Id<"conversations">>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatMutation = useMutation(api.ai.chat.chat);
  const conversations = useQuery(api.ai.chat.getConversations, { userId });
  const messages = useQuery(
    api.ai.chat.getMessages,
    conversationId ? { conversationId } : "skip"
  );

  const sendMessage = useCallback(
    async (message: string): Promise<ChatResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await chatMutation({
          userId,
          message,
          conversationId,
        });

        if (!conversationId) {
          setConversationId(result.conversationId);
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [userId, conversationId, chatMutation]
  );

  const startNewConversation = useCallback(() => {
    setConversationId(undefined);
  }, []);

  return {
    sendMessage,
    isLoading,
    error,
    conversations,
    currentMessages: messages,
    conversationId,
    startNewConversation,
  };
}
```

### src/components/chat/ChatMessage.tsx

```typescript
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, User, ExternalLink } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: Array<{
    id: string;
    title: string;
    relevance: number;
  }>;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  timestamp,
  sources,
}) => {
  return (
    <div
      className={`flex gap-3 sm:gap-4 animate-fade-in ${
        role === "user" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <Avatar className="shrink-0">
        <AvatarFallback
          className={
            role === "assistant"
              ? "bg-gradient-to-br from-blue-100 to-purple-100"
              : "bg-gradient-to-br from-green-100 to-teal-100"
          }
        >
          {role === "assistant" ? (
            <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          ) : (
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
          )}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div
        className={`flex-1 min-w-0 ${
          role === "user" ? "flex flex-col items-end" : ""
        }`}
      >
        <div
          className={`inline-block max-w-full sm:max-w-[85%] lg:max-w-[75%] ${
            role === "user"
              ? "glass-card bg-gradient-to-br from-blue-500 to-purple-500 text-white"
              : "glass-card"
          } p-3 sm:p-4 rounded-2xl ${
            role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"
          }`}
        >
          <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
            {content}
          </p>

          {/* Sources */}
          {sources && sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-xs font-semibold mb-2 text-muted-foreground">
                Sources:
              </p>
              <div className="space-y-1">
                {sources.map((source, idx) => (
                  <button
                    key={idx}
                    className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{source.title}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {Math.round(source.relevance * 100)}% match
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className={`flex items-center gap-2 mt-1 px-2 ${
            role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(timestamp)}
          </span>
          {role === "assistant" && (
            <Badge variant="glass" className="text-xs">
              AI
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
```

### src/components/chat/EnhancedChat.tsx

```typescript
import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ChatMessage } from "./ChatMessage";
import { useCareerChat } from "@/hooks/useCareerChat";
import {
  Send,
  Bot,
  MoreVertical,
  FileText,
  Briefcase,
  MessageSquare,
  Sparkles,
  Loader2,
} from "lucide-react";

const EnhancedChat: React.FC<{ userId: string }> = ({ userId }) => {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    sendMessage,
    isLoading,
    error,
    currentMessages,
    startNewConversation,
  } = useCareerChat(userId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue;
    setInputValue("");

    try {
      await sendMessage(message);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const quickPrompts = [
    { icon: FileText, text: "Help me improve my resume", color: "blue" },
    { icon: Briefcase, text: "Find jobs matching my skills", color: "purple" },
    { icon: MessageSquare, text: "Prepare for interview", color: "green" },
    { icon: Sparkles, text: "Career advice", color: "orange" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <div className="glass-nav sticky top-0 z-50 border-b">
        <div className="container-padding py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100">
                <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                  AI Career Assistant
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Powered by RAG
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={startNewConversation}
              title="Start new conversation"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto smooth-scroll">
        <div className="container-padding py-4 sm:py-6 space-y-4 sm:space-y-6">
          {(!currentMessages || currentMessages.length === 0) && (
            <div className="mb-6 sm:mb-8">
              <Card glass className="p-4 sm:p-6 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto py-3 sm:py-4 justify-start text-left"
                      onClick={() => setInputValue(prompt.text)}
                    >
                      <prompt.icon
                        className={`mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-${prompt.color}-600`}
                      />
                      <span className="text-xs sm:text-sm">{prompt.text}</span>
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {currentMessages?.map((message) => (
            <ChatMessage
              key={message._id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              sources={message.sources}
            />
          ))}

          {isLoading && (
            <div className="flex gap-3 sm:gap-4 animate-fade-in">
              <div className="glass-card p-3 sm:p-4 rounded-2xl rounded-tl-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm text-muted-foreground">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              Error: {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="glass-nav border-t sticky bottom-0">
        <div className="container-padding py-3 sm:py-4">
          <div className="flex gap-2 sm:gap-3">
            <Input
              type="text"
              placeholder="Ask me anything about your career..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 text-sm sm:text-base"
              glass
              disabled={isLoading}
            />
            <Button
              variant="primary"
              size="icon"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="shrink-0 touch-target"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChat;
```

---

## 3. Knowledge Base Seeding

### scripts/seedKnowledgeBase.ts

```typescript
// Run with: npx convex run scripts/seedKnowledgeBase

import { internalMutation } from "../convex/_generated/server";

export default internalMutation({
  handler: async (ctx) => {
    const knowledgeArticles = [
      // Resume Writing
      {
        topic: "resume_writing",
        category: "resume_tips",
        title: "How to Write an Effective Resume Summary",
        content: `A resume summary is a 2-3 sentence statement at the top of your resume that highlights your professional identity, key skills, and value proposition.

Components of a Strong Summary:
1. Professional Identity: Job title and years of experience
2. Key Skills: 2-3 most relevant technical or soft skills
3. Value Proposition: Notable achievements or unique strengths

Examples:

GOOD:
"Senior Software Engineer with 8+ years building scalable web applications. Expert in React, Node.js, and cloud architecture. Led team of 5 developers to deliver $2M revenue-generating platform."

BAD:
"Hardworking individual seeking software engineering position. Good with computers and teamwork."

Tips:
- Use strong action verbs
- Quantify achievements (numbers, percentages, revenue)
- Tailor to target job description
- Keep it concise (2-3 sentences max)
- Avoid clichés ("hardworking", "team player")

Format:
[Title] with [X years] experience in [industry/specialty]. Expert in [key skills]. [Notable achievement with quantifiable result].`,
        difficulty: "beginner" as const,
        tags: ["resume", "summary", "writing", "professional_identity"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      {
        topic: "resume_writing",
        category: "resume_tips",
        title: "Action Verbs for Resume Bullet Points",
        content: `Strong action verbs make your resume more dynamic and impactful. Replace weak verbs with powerful alternatives.

Weak Verbs to Avoid:
- Responsible for
- Worked on
- Helped with
- Did
- Made

Power Verbs by Category:

LEADERSHIP:
- Directed, Led, Managed, Coordinated, Supervised
- Mentored, Coached, Trained, Developed

ACHIEVEMENT:
- Achieved, Delivered, Exceeded, Accomplished, Attained
- Generated, Increased, Improved, Optimized

CREATION:
- Built, Created, Designed, Developed, Engineered
- Architected, Implemented, Launched, Established

ANALYSIS:
- Analyzed, Assessed, Evaluated, Researched, Investigated
- Identified, Diagnosed, Forecasted

COMMUNICATION:
- Presented, Communicated, Negotiated, Persuaded
- Collaborated, Facilitated, Consulted

Examples:

BEFORE:
"Responsible for managing team of developers"

AFTER:
"Led team of 8 developers to deliver 12 features on time and 15% under budget"

BEFORE:
"Helped improve sales process"

AFTER:
"Optimized sales process, reducing cycle time by 25% and increasing conversion rate by 18%"`,
        difficulty: "beginner" as const,
        tags: ["resume", "action_verbs", "writing", "bullet_points"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      // Interview Preparation
      {
        topic: "interview_prep",
        category: "behavioral",
        title: "Mastering the STAR Method for Behavioral Interviews",
        content: `The STAR method is a structured approach to answering behavioral interview questions.

STAR stands for:
- Situation: Set the context
- Task: Describe your responsibility
- Action: Explain what you did
- Result: Share the outcome (with metrics)

Common Behavioral Questions:
1. "Tell me about a time you faced a challenge"
2. "Describe a situation where you showed leadership"
3. "Give an example of a conflict you resolved"
4. "Tell me about a failure and what you learned"

Example Answer:

Question: "Tell me about a time you led a difficult project"

Situation (15 seconds):
"At my previous company, we had a critical product launch deadline in 6 weeks, but our team was 2 developers short due to unexpected departures."

Task (10 seconds):
"As tech lead, I needed to ensure we delivered all features on time without burning out the team."

Action (30 seconds):
"I took three actions: First, I re-prioritized features with the product manager, identifying must-haves vs. nice-to-haves. Second, I implemented pair programming to accelerate knowledge transfer. Third, I negotiated with management to bring in a contractor for specialized work. I also held daily 15-minute standups to identify blockers early."

Result (15 seconds):
"We launched on time with 95% of planned features. Post-launch surveys showed 4.8/5 user satisfaction. The team appreciated the transparent communication, and I was promoted to senior tech lead."

Tips:
- Keep total answer under 90 seconds
- Focus on YOUR actions (not "we", use "I")
- Always include quantifiable results
- Prepare 5-7 STAR stories covering different competencies
- Practice out loud`,
        difficulty: "intermediate" as const,
        tags: ["interview", "STAR", "behavioral", "preparation"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      // Job Search
      {
        topic: "job_search",
        category: "strategy",
        title: "Effective Job Search Strategies",
        content: `A successful job search requires strategy, not just submitting applications.

The 5-Pillar Job Search Strategy:

1. ONLINE JOB BOARDS (30% of effort)
- LinkedIn, Indeed, Glassdoor
- Company career pages
- Apply to 5-10 quality positions per week
- Tailor each application

2. NETWORKING (40% of effort)
- Reach out to 5 people per week
- Attend industry events/meetups
- Informational interviews
- Leverage alumni networks
- 70% of jobs are filled through networking

3. RECRUITERS (15% of effort)
- Build relationships with 3-5 recruiters in your industry
- Update them monthly on your search
- Be responsive and professional

4. DIRECT OUTREACH (10% of effort)
- Identify 10 dream companies
- Connect with hiring managers on LinkedIn
- Send personalized messages
- Reference specific projects/values

5. SKILL BUILDING (5% of effort)
- Take relevant courses
- Build portfolio projects
- Contribute to open source
- Blog about your learnings

Weekly Schedule Template:

Monday:
- Review new job postings (1 hour)
- Apply to 2-3 positions (2 hours)

Tuesday:
- Networking: Reach out to 2 people (1 hour)
- Customize resume/cover letter (1 hour)

Wednesday:
- LinkedIn activity: Comment, post (30 min)
- Informational interview or coffee chat (1 hour)

Thursday:
- Apply to 2-3 positions (2 hours)
- Follow up on applications (30 min)

Friday:
- Recruiter outreach (1 hour)
- Skill building: Course or project (1 hour)

Metrics to Track:
- Applications submitted
- Response rate
- Phone screens
- On-site interviews
- Offers

Adjust strategy based on what's working.`,
        difficulty: "beginner" as const,
        tags: ["job_search", "strategy", "networking", "applications"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      // Salary Negotiation
      {
        topic: "negotiation",
        category: "salary",
        title: "Salary Negotiation: Scripts and Strategies",
        content: `Negotiating your salary can increase your earnings by 10-20% or more. Here's how to do it effectively.

Rule #1: Always Negotiate
- Companies expect it
- The worst they can say is "no"
- You have the most leverage after an offer

When to Discuss Salary:

Early in Process (Recruiter Asks):
"I'm focused on finding the right role and cultural fit. I'm confident we can agree on compensation if we're mutually interested. What range has been budgeted for this position?"

After Offer:
"Thank you for the offer! I'm excited about this opportunity. I'd like to review the details and get back to you by [date]. Would that work?"

Negotiation Scripts:

Script 1: Counter Offer
"I'm thrilled about the opportunity to join [Company]. Based on my research of market rates for this role and my [X years] of experience in [specialty], I was expecting something in the range of $[X]-$[Y]. Is there flexibility to meet closer to $[target]?"

Script 2: Highlighting Value
"I'm very excited about this role. Given my experience with [specific skill] and my track record of [achievement], I believe $[target] would be appropriate. I'm confident I can deliver [specific value] in the first 90 days."

Script 3: Multiple Components
"I appreciate the base salary offer. In addition to base, I'd like to discuss:
- Signing bonus to offset my current year-end bonus
- Equity allocation
- Start date flexibility
- Professional development budget
Can we explore these areas?"

Script 4: If They Can't Budge
"I understand the budget constraints. A few alternative options:
- Performance review at 6 months instead of 12
- Additional PTO days
- Remote work flexibility
- Guaranteed raise% at 1-year mark
Would any of these be possible?"

Negotiation Tips:
- Get the offer in writing first
- Never accept on the spot
- Research market rates (Glassdoor, Levels.fyi, Payscale)
- Know your walk-away number
- Be collaborative, not adversarial
- Express enthusiasm for the role
- Negotiate total compensation, not just base salary

Market Research Resources:
- Levels.fyi (tech salaries)
- Glassdoor
- Payscale
- LinkedIn Salary Insights
- H1B Salary Database (for US)

Remember: You have the most leverage NOW. Once you accept, you lose negotiating power.`,
        difficulty: "intermediate" as const,
        tags: ["negotiation", "salary", "offer", "compensation"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Insert articles
    for (const article of knowledgeArticles) {
      const articleId = await ctx.db.insert("knowledgeBase", article);

      // Generate and store embedding
      await ctx.scheduler.runAfter(0, "ai/embeddings:generateAndStoreEmbedding", {
        sourceType: "knowledge" as const,
        sourceId: articleId,
        content: article.content,
        title: article.title,
        metadata: {
          category: article.category,
          topic: article.topic,
          tags: article.tags,
        },
      });
    }

    return {
      success: true,
      count: knowledgeArticles.length,
    };
  },
});
```

---

## 4. Testing Examples

### Test RAG System

```typescript
// tests/rag.test.ts
import { test, expect } from "@jest/globals";
// This is a conceptual example - actual testing would use Convex testing framework

test("Resume analysis retrieves relevant knowledge", async () => {
  const userId = "test-user-123";

  // Create test resume
  const resumeId = await createDocument({
    userId,
    type: "resume",
    content: "Senior Software Engineer with 8 years of experience...",
  });

  // Embed resume
  await embedDocument(resumeId);

  // Ask question
  const response = await chat({
    userId,
    message: "How can I improve my resume?",
  });

  // Assertions
  expect(response.sources).toContainEqual(
    expect.objectContaining({
      title: "How to Write an Effective Resume Summary",
    })
  );
  expect(response.response).toContain("action verbs");
});

test("Job matching returns relevant jobs", async () => {
  const userId = "test-user-123";

  // Create resume
  const resumeId = await createDocument({
    userId,
    type: "resume",
    content: "Full-stack developer with React and Node.js experience",
  });

  // Create test jobs
  await createJob({
    title: "Senior React Developer",
    description: "Looking for React expert...",
  });

  await createJob({
    title: "Data Scientist",
    description: "Looking for ML expert...",
  });

  // Find matching jobs
  const matches = await findMatchingJobs(userId);

  // Assertions
  expect(matches[0].title).toBe("Senior React Developer");
  expect(matches[0].matchScore).toBeGreaterThan(80);
});
```

---

## Next Steps

1. **Set up Convex project:**
   ```bash
   npx convex dev
   ```

2. **Copy schema and functions** into your `convex/` directory

3. **Install OpenAI SDK:**
   ```bash
   npm install openai
   ```

4. **Configure environment variables:**
   ```
   OPENAI_API_KEY=your-key-here
   ```

5. **Seed knowledge base:**
   ```bash
   npx convex run scripts/seedKnowledgeBase
   ```

6. **Update React components** to use the new hooks

7. **Test the RAG system** with sample data

---

## Resources

- [Convex Documentation](https://docs.convex.dev)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [RAG Best Practices](https://www.anthropic.com/index/retrieval-augmented-generation)
