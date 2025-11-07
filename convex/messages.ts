import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

export const createConversation = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("conversations", {
      userId: args.userId,
      title: args.title,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getUserConversations = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const createMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    metadata: v.optional(
      v.object({
        tokensUsed: v.optional(v.number()),
        model: v.optional(v.string()),
        retrievedContext: v.optional(v.array(v.string())),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Update conversation timestamp
    await ctx.db.patch(args.conversationId, {
      updatedAt: now,
    });

    return await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: args.role,
      content: args.content,
      timestamp: now,
      metadata: args.metadata,
    });
  },
});

export const getConversationMessages = query({
  args: {
    conversationId: v.id("conversations"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("desc")
      .take(limit)
      .then((messages) => messages.reverse());
  },
});
