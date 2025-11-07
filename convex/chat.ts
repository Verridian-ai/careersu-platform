import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Chat Messaging Functions
 * 
 * Handles real-time chat operations including:
 * - Sending and receiving messages
 * - Managing conversations
 * - Message status tracking
 * - Real-time subscriptions
 */

/**
 * Send a new chat message
 */
export const sendMessage = mutation({
  args: {
    senderId: v.id("users"),
    receiverId: v.id("users"),
    conversationId: v.string(),
    content: v.string(),
    messageType: v.optional(v.union(v.literal("text"), v.literal("file"), v.literal("system"))),
    attachmentUrl: v.optional(v.string()),
    attachmentName: v.optional(v.string()),
    attachmentType: v.optional(v.string()),
    attachmentSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("chatMessages", {
      senderId: args.senderId,
      receiverId: args.receiverId,
      conversationId: args.conversationId,
      content: args.content,
      messageType: args.messageType ?? "text",
      attachmentUrl: args.attachmentUrl,
      attachmentName: args.attachmentName,
      attachmentType: args.attachmentType,
      attachmentSize: args.attachmentSize,
      isRead: false,
      isEdited: false,
      isDeleted: false,
      createdAt: Date.now(),
    });

    return {
      messageId,
      message: "Message sent successfully",
    };
  },
});

/**
 * Get messages for a conversation
 */
export const getConversationMessages = query({
  args: {
    conversationId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_conversation_and_created", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("desc")
      .take(limit);

    return messages.reverse();
  },
});

/**
 * Get conversations for a user
 */
export const getUserConversations = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const sentMessages = await ctx.db
      .query("chatMessages")
      .withIndex("by_sender_id", (q) => q.eq("senderId", args.userId))
      .collect();

    const receivedMessages = await ctx.db
      .query("chatMessages")
      .withIndex("by_receiver_id", (q) => q.eq("receiverId", args.userId))
      .collect();

    const allMessages = [...sentMessages, ...receivedMessages];

    const conversationMap = new Map();

    allMessages.forEach((msg) => {
      const existing = conversationMap.get(msg.conversationId);
      if (!existing || msg.createdAt > existing.createdAt) {
        conversationMap.set(msg.conversationId, msg);
      }
    });

    const conversations = Array.from(conversationMap.values());

    const conversationsWithUsers = await Promise.all(
      conversations.map(async (msg) => {
        const otherUserId = msg.senderId === args.userId ? msg.receiverId : msg.senderId;
        const otherUser = await ctx.db.get(otherUserId);

        const unreadCount = await ctx.db
          .query("chatMessages")
          .withIndex("by_conversation_id", (q) => q.eq("conversationId", msg.conversationId))
          .collect()
          .then((messages) =>
            messages.filter((m) => m.receiverId === args.userId && !m.isRead).length
          );

        return {
          conversationId: msg.conversationId,
          otherUser,
          lastMessage: msg,
          unreadCount,
        };
      })
    );

    return conversationsWithUsers.sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt);
  },
});

/**
 * Mark message as read
 */
export const markMessageAsRead = mutation({
  args: {
    messageId: v.id("chatMessages"),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    await ctx.db.patch(args.messageId, {
      isRead: true,
      readAt: Date.now(),
    });

    return {
      success: true,
      message: "Message marked as read",
    };
  },
});

/**
 * Mark all messages in a conversation as read
 */
export const markConversationAsRead = mutation({
  args: {
    conversationId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_conversation_id", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    const unreadMessages = messages.filter(
      (msg) => msg.receiverId === args.userId && !msg.isRead
    );

    const now = Date.now();

    await Promise.all(
      unreadMessages.map((msg) =>
        ctx.db.patch(msg._id, {
          isRead: true,
          readAt: now,
        })
      )
    );

    return {
      success: true,
      markedCount: unreadMessages.length,
      message: "Messages marked as read",
    };
  },
});

/**
 * Edit a message
 */
export const editMessage = mutation({
  args: {
    messageId: v.id("chatMessages"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    if (message.isDeleted) {
      throw new Error("Cannot edit deleted message");
    }

    await ctx.db.patch(args.messageId, {
      content: args.content,
      isEdited: true,
      editedAt: Date.now(),
    });

    return {
      success: true,
      message: "Message edited successfully",
    };
  },
});

/**
 * Delete a message
 */
export const deleteMessage = mutation({
  args: {
    messageId: v.id("chatMessages"),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    await ctx.db.patch(args.messageId, {
      isDeleted: true,
      content: "[This message has been deleted]",
    });

    return {
      success: true,
      message: "Message deleted successfully",
    };
  },
});

/**
 * Get unread message count for a user
 */
export const getUnreadCount = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const unreadMessages = await ctx.db
      .query("chatMessages")
      .withIndex("by_unread", (q) => q.eq("receiverId", args.userId).eq("isRead", false))
      .collect();

    return {
      count: unreadMessages.length,
    };
  },
});

/**
 * Search messages in a conversation
 */
export const searchMessages = query({
  args: {
    conversationId: v.string(),
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const searchLower = args.searchTerm.toLowerCase();

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_conversation_id", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    const matchingMessages = messages
      .filter((msg) => msg.content.toLowerCase().includes(searchLower) && !msg.isDeleted)
      .slice(0, limit);

    return matchingMessages;
  },
});

/**
 * Create a conversation ID from two user IDs
 * Utility function to generate consistent conversation IDs
 */
export const createConversationId = query({
  args: {
    userId1: v.id("users"),
    userId2: v.id("users"),
  },
  handler: async (ctx, args) => {
    const ids = [args.userId1, args.userId2].sort();
    return {
      conversationId: `${ids[0]}_${ids[1]}`,
    };
  },
});
