import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Document Management Functions
 * 
 * Handles document operations including:
 * - Creating, reading, updating, and deleting documents
 * - Document versioning
 * - Document search and filtering
 * - AI analysis integration
 */

/**
 * Create a new document
 */
export const createDocument = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    type: v.union(
      v.literal("resume"),
      v.literal("cover_letter"),
      v.literal("portfolio"),
      v.literal("other")
    ),
    content: v.string(),
    format: v.union(v.literal("pdf"), v.literal("docx"), v.literal("txt"), v.literal("html")),
    fileSize: v.optional(v.number()),
    storageUrl: v.optional(v.string()),
    isTemplate: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const documentId = await ctx.db.insert("documents", {
      userId: args.userId,
      title: args.title,
      type: args.type,
      content: args.content,
      format: args.format,
      fileSize: args.fileSize,
      storageUrl: args.storageUrl,
      version: 1,
      isTemplate: args.isTemplate ?? false,
      isFavorite: false,
      lastEditedAt: now,
      createdAt: now,
    });

    return {
      documentId,
      message: "Document created successfully",
    };
  },
});

/**
 * Get document by ID
 */
export const getDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Document not found");
    }

    return document;
  },
});

/**
 * Get all documents for a user
 */
export const getUserDocuments = query({
  args: {
    userId: v.id("users"),
    type: v.optional(
      v.union(
        v.literal("resume"),
        v.literal("cover_letter"),
        v.literal("portfolio"),
        v.literal("other")
      )
    ),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("documents");

    if (args.type) {
      query = query.withIndex("by_user_and_type", (q) =>
        q.eq("userId", args.userId).eq("type", args.type)
      );
    } else {
      query = query.withIndex("by_user_id", (q) => q.eq("userId", args.userId));
    }

    const documents = await query.order("desc").collect();

    return documents;
  },
});

/**
 * Update document
 */
export const updateDocument = mutation({
  args: {
    documentId: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    aiScore: v.optional(v.number()),
    aiSuggestions: v.optional(v.array(v.string())),
    keywords: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { documentId, ...updateData } = args;

    const document = await ctx.db.get(documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    const version = args.content !== undefined ? document.version + 1 : document.version;

    await ctx.db.patch(documentId, {
      ...filteredData,
      version,
      lastEditedAt: Date.now(),
    });

    return {
      success: true,
      message: "Document updated successfully",
      version,
    };
  },
});

/**
 * Delete document
 */
export const deleteDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    await ctx.db.delete(args.documentId);

    return {
      success: true,
      message: "Document deleted successfully",
    };
  },
});

/**
 * Toggle document favorite status
 */
export const toggleFavorite = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    const isFavorite = !document.isFavorite;

    await ctx.db.patch(args.documentId, {
      isFavorite,
    });

    return {
      success: true,
      isFavorite,
      message: isFavorite ? "Added to favorites" : "Removed from favorites",
    };
  },
});

/**
 * Get favorite documents
 */
export const getFavoriteDocuments = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_favorite", (q) => q.eq("userId", args.userId).eq("isFavorite", true))
      .order("desc")
      .collect();

    return documents;
  },
});

/**
 * Get recent documents
 */
export const getRecentDocuments = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);

    return documents;
  },
});

/**
 * Search documents by title or content
 */
export const searchDocuments = query({
  args: {
    userId: v.id("users"),
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const searchLower = args.searchTerm.toLowerCase();

    const allDocs = await ctx.db
      .query("documents")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    const matchingDocs = allDocs
      .filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchLower) ||
          doc.content.toLowerCase().includes(searchLower)
      )
      .slice(0, limit);

    return matchingDocs;
  },
});

/**
 * Get document statistics for a user
 */
export const getDocumentStats = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    const stats = {
      total: documents.length,
      byType: {
        resume: 0,
        cover_letter: 0,
        portfolio: 0,
        other: 0,
      },
      favorites: 0,
      templates: 0,
    };

    documents.forEach((doc) => {
      stats.byType[doc.type]++;
      if (doc.isFavorite) stats.favorites++;
      if (doc.isTemplate) stats.templates++;
    });

    return stats;
  },
});

/**
 * Update AI analysis results
 */
export const updateAIAnalysis = mutation({
  args: {
    documentId: v.id("documents"),
    aiScore: v.number(),
    aiSuggestions: v.array(v.string()),
    keywords: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    await ctx.db.patch(args.documentId, {
      aiScore: args.aiScore,
      aiSuggestions: args.aiSuggestions,
      keywords: args.keywords,
      lastEditedAt: Date.now(),
    });

    return {
      success: true,
      message: "AI analysis updated successfully",
    };
  },
});
