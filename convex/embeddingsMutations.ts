import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const deleteDocumentEmbeddingsInternal = internalMutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const embeddings = await ctx.db
      .query("documentEmbeddings")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();

    for (const embedding of embeddings) {
      await ctx.db.delete(embedding._id);
    }
  },
});

export const storeDocumentEmbeddingInternal = internalMutation({
  args: {
    documentId: v.id("documents"),
    userId: v.id("users"),
    chunkIndex: v.number(),
    chunkText: v.string(),
    embedding: v.array(v.float64()),
    metadata: v.object({
      documentType: v.string(),
      documentTitle: v.string(),
      totalChunks: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("documentEmbeddings", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const storeJobEmbeddingInternal = internalMutation({
  args: {
    jobId: v.id("jobs"),
    embedding: v.array(v.float64()),
    metadata: v.object({
      title: v.string(),
      company: v.string(),
      location: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // Delete existing embedding for this job
    const existing = await ctx.db
      .query("jobEmbeddings")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    // Insert new embedding
    await ctx.db.insert("jobEmbeddings", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const storeKnowledgeBaseEmbeddingInternal = internalMutation({
  args: {
    topic: v.string(),
    content: v.string(),
    embedding: v.array(v.float64()),
    metadata: v.object({
      category: v.string(),
      tags: v.array(v.string()),
      source: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("knowledgeBaseEmbeddings", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
