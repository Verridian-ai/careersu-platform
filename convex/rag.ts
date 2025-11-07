import { v } from "convex/values";
import { action, query } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

/**
 * RAG (Retrieval-Augmented Generation) Functions
 * Handles semantic search and context retrieval for AI responses
 */

/**
 * Search user's documents for relevant content
 */
export const searchUserDocuments = action({
  args: {
    userId: v.id("users"),
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;

    // Generate embedding for the query
    const { embedding } = await ctx.runAction(api.embeddings.embedQuery, {
      query: args.query,
    });

    // Vector search in document embeddings
    const results = await ctx.vectorSearch("documentEmbeddings", "by_embedding", {
      vector: embedding,
      limit,
      filter: (q) => q.eq("userId", args.userId),
    });

    // Fetch full document details
    const documents = await Promise.all(
      results.map(async (result) => {
        const doc = await ctx.runQuery(api.documents.getDocument, {
          documentId: result.documentId,
        });
        return {
          documentId: result.documentId,
          chunkText: result.chunkText,
          score: result._score,
          documentTitle: result.metadata.documentTitle,
          documentType: result.metadata.documentType,
          fullDocument: doc,
        };
      })
    );

    return documents;
  },
});

/**
 * Find jobs matching user's profile/resume
 */
export const matchJobsToProfile = action({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    // Get user's most recent resume
    const resumes = await ctx.runQuery(api.documents.getUserDocuments, {
      userId: args.userId,
      type: "resume",
    });

    if (resumes.length === 0) {
      return [];
    }

    const latestResume = resumes[0];

    // Generate embedding for the resume
    const { embedding } = await ctx.runAction(api.embeddings.embedQuery, {
      query: latestResume.content,
    });

    // Vector search for matching jobs
    const results = await ctx.vectorSearch("jobEmbeddings", "by_embedding", {
      vector: embedding,
      limit,
    });

    // Fetch full job details
    const jobs = await Promise.all(
      results.map(async (result) => {
        const job = await ctx.runQuery(api.jobs.getJob, {
          jobId: result.jobId,
        });
        return {
          ...job,
          matchScore: result._score,
        };
      })
    );

    return jobs;
  },
});

/**
 * Search career knowledge base for relevant advice
 */
export const searchCareerAdvice = action({
  args: {
    query: v.string(),
    topic: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 3;

    // Generate embedding for the query
    const { embedding } = await ctx.runAction(api.embeddings.embedQuery, {
      query: args.query,
    });

    // Vector search in knowledge base
    const results = await ctx.vectorSearch(
      "knowledgeBaseEmbeddings",
      "by_embedding",
      {
        vector: embedding,
        limit,
        filter: args.topic
          ? (q) => q.eq("topic", args.topic)
          : undefined,
      }
    );

    return results.map((result) => ({
      topic: result.topic,
      content: result.content,
      category: result.metadata.category,
      tags: result.metadata.tags,
      score: result._score,
    }));
  },
});

/**
 * Retrieve conversation context for chat
 */
export const getConversationContext = query({
  args: {
    conversationId: v.id("conversations"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("desc")
      .take(limit);

    return messages.reverse(); // Return in chronological order
  },
});

/**
 * Build RAG context for AI prompt
 * Combines user documents, conversation history, and knowledge base
 */
export const buildRAGContext = action({
  args: {
    userId: v.id("users"),
    conversationId: v.id("conversations"),
    query: v.string(),
    includeDocuments: v.optional(v.boolean()),
    includeKnowledgeBase: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const includeDocuments = args.includeDocuments ?? true;
    const includeKnowledgeBase = args.includeKnowledgeBase ?? true;

    const context: {
      conversationHistory: any[];
      relevantDocuments: any[];
      careerAdvice: any[];
      userProfile?: any;
    } = {
      conversationHistory: [],
      relevantDocuments: [],
      careerAdvice: [],
    };

    // Get conversation history
    context.conversationHistory = await ctx.runQuery(
      api.rag.getConversationContext,
      {
        conversationId: args.conversationId,
        limit: 10,
      }
    );

    // Search user's documents if requested
    if (includeDocuments) {
      context.relevantDocuments = await ctx.runAction(
        api.rag.searchUserDocuments,
        {
          userId: args.userId,
          query: args.query,
          limit: 3,
        }
      );
    }

    // Search knowledge base if requested
    if (includeKnowledgeBase) {
      context.careerAdvice = await ctx.runAction(api.rag.searchCareerAdvice, {
        query: args.query,
        limit: 2,
      });
    }

    // Get user profile
    context.userProfile = await ctx.runQuery(api.users.getUserProfile, {
      userId: args.userId,
    });

    return context;
  },
});

/**
 * Search for similar jobs based on a job description
 */
export const findSimilarJobs = action({
  args: {
    jobId: v.id("jobs"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;

    // Get the job
    const job = await ctx.runQuery(api.jobs.getJob, {
      jobId: args.jobId,
    });

    if (!job) {
      throw new Error("Job not found");
    }

    // Create job text for embedding
    const jobText = `${job.title} at ${job.company}. ${job.description}`;

    // Generate embedding
    const { embedding } = await ctx.runAction(api.embeddings.embedQuery, {
      query: jobText,
    });

    // Vector search for similar jobs
    const results = await ctx.vectorSearch("jobEmbeddings", "by_embedding", {
      vector: embedding,
      limit: limit + 1, // +1 to exclude the input job itself
    });

    // Filter out the input job and fetch details
    const similarJobs = await Promise.all(
      results
        .filter((result) => result.jobId !== args.jobId)
        .slice(0, limit)
        .map(async (result) => {
          const similarJob = await ctx.runQuery(api.jobs.getJob, {
            jobId: result.jobId,
          });
          return {
            ...similarJob,
            similarityScore: result._score,
          };
        })
    );

    return similarJobs;
  },
});

/**
 * Get relevant context for resume optimization
 */
export const getResumeOptimizationContext = action({
  args: {
    documentId: v.id("documents"),
    jobId: v.optional(v.id("jobs")),
  },
  handler: async (ctx, args) => {
    // Get the document
    const document = await ctx.runQuery(api.documents.getDocument, {
      documentId: args.documentId,
    });

    if (!document) {
      throw new Error("Document not found");
    }

    const context: {
      document: any;
      targetJob?: any;
      careerAdvice: any[];
    } = {
      document,
      careerAdvice: [],
    };

    // If targeting a specific job, include it
    if (args.jobId) {
      context.targetJob = await ctx.runQuery(api.jobs.getJob, {
        jobId: args.jobId,
      });
    }

    // Get resume writing advice
    context.careerAdvice = await ctx.runAction(api.rag.searchCareerAdvice, {
      query: "resume optimization best practices",
      topic: "resume_writing",
      limit: 3,
    });

    return context;
  },
});

/**
 * Get relevant context for interview preparation
 */
export const getInterviewPrepContext = action({
  args: {
    userId: v.id("users"),
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    // Get the job
    const job = await ctx.runQuery(api.jobs.getJob, {
      jobId: args.jobId,
    });

    if (!job) {
      throw new Error("Job not found");
    }

    // Get user's resume
    const resumes = await ctx.runQuery(api.documents.getUserDocuments, {
      userId: args.userId,
      type: "resume",
    });

    // Get interview prep advice
    const interviewAdvice = await ctx.runAction(api.rag.searchCareerAdvice, {
      query: `interview preparation for ${job.title} position`,
      topic: "interview_prep",
      limit: 3,
    });

    return {
      job,
      resume: resumes[0] || null,
      interviewAdvice,
    };
  },
});
