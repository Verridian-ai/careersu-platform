import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Session Management Functions
 * 
 * Handles coaching session operations including:
 * - Creating and scheduling sessions
 * - Managing session status
 * - Session notes and feedback
 */

/**
 * Create a new coaching session
 */
export const createSession = mutation({
  args: {
    coachId: v.id("users"),
    clientId: v.id("users"),
    coachProfileId: v.id("coaches"),
    title: v.string(),
    description: v.optional(v.string()),
    sessionType: v.string(),
    scheduledAt: v.number(),
    duration: v.number(),
    timezone: v.string(),
    price: v.number(),
    meetingUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const endTime = args.scheduledAt + args.duration * 60 * 1000;

    const sessionId = await ctx.db.insert("sessions", {
      coachId: args.coachId,
      clientId: args.clientId,
      coachProfileId: args.coachProfileId,
      title: args.title,
      description: args.description,
      sessionType: args.sessionType,
      scheduledAt: args.scheduledAt,
      duration: args.duration,
      endTime,
      timezone: args.timezone,
      status: "scheduled",
      meetingUrl: args.meetingUrl,
      price: args.price,
      isPaid: false,
      createdAt: now,
      updatedAt: now,
    });

    return {
      sessionId,
      message: "Session created successfully",
    };
  },
});

/**
 * Get session by ID
 */
export const getSession = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    const coach = await ctx.db.get(session.coachId);
    const client = await ctx.db.get(session.clientId);
    const coachProfile = await ctx.db.get(session.coachProfileId);

    return {
      session,
      coach,
      client,
      coachProfile,
    };
  },
});

/**
 * Get sessions for a coach
 */
export const getCoachSessions = query({
  args: {
    coachId: v.id("users"),
    status: v.optional(
      v.union(
        v.literal("scheduled"),
        v.literal("in_progress"),
        v.literal("completed"),
        v.literal("cancelled"),
        v.literal("no_show")
      )
    ),
  },
  handler: async (ctx, args) => {
    let sessions;

    if (args.status) {
      sessions = await ctx.db
        .query("sessions")
        .withIndex("by_coach_id", (q) => q.eq("coachId", args.coachId))
        .collect()
        .then((s) => s.filter((session) => session.status === args.status));
    } else {
      sessions = await ctx.db
        .query("sessions")
        .withIndex("by_coach_id", (q) => q.eq("coachId", args.coachId))
        .order("desc")
        .collect();
    }

    const sessionsWithUsers = await Promise.all(
      sessions.map(async (session) => {
        const client = await ctx.db.get(session.clientId);
        return { ...session, client };
      })
    );

    return sessionsWithUsers;
  },
});

/**
 * Get sessions for a client
 */
export const getClientSessions = query({
  args: {
    clientId: v.id("users"),
    status: v.optional(
      v.union(
        v.literal("scheduled"),
        v.literal("in_progress"),
        v.literal("completed"),
        v.literal("cancelled"),
        v.literal("no_show")
      )
    ),
  },
  handler: async (ctx, args) => {
    let sessions;

    if (args.status) {
      sessions = await ctx.db
        .query("sessions")
        .withIndex("by_client_id", (q) => q.eq("clientId", args.clientId))
        .collect()
        .then((s) => s.filter((session) => session.status === args.status));
    } else {
      sessions = await ctx.db
        .query("sessions")
        .withIndex("by_client_id", (q) => q.eq("clientId", args.clientId))
        .order("desc")
        .collect();
    }

    const sessionsWithCoaches = await Promise.all(
      sessions.map(async (session) => {
        const coach = await ctx.db.get(session.coachId);
        const coachProfile = await ctx.db.get(session.coachProfileId);
        return { ...session, coach, coachProfile };
      })
    );

    return sessionsWithCoaches;
  },
});

/**
 * Update session status
 */
export const updateSessionStatus = mutation({
  args: {
    sessionId: v.id("sessions"),
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show")
    ),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    await ctx.db.patch(args.sessionId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Session status updated successfully",
    };
  },
});

/**
 * Cancel session
 */
export const cancelSession = mutation({
  args: {
    sessionId: v.id("sessions"),
    cancelledBy: v.id("users"),
    cancellationReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    await ctx.db.patch(args.sessionId, {
      status: "cancelled",
      cancelledBy: args.cancelledBy,
      cancelledAt: Date.now(),
      cancellationReason: args.cancellationReason,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Session cancelled successfully",
    };
  },
});

/**
 * Add session notes
 */
export const addSessionNotes = mutation({
  args: {
    sessionId: v.id("sessions"),
    userId: v.id("users"),
    coachNotes: v.optional(v.string()),
    clientNotes: v.optional(v.string()),
    actionItems: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (args.userId === session.coachId && args.coachNotes) {
      updateData.coachNotes = args.coachNotes;
    }

    if (args.userId === session.clientId && args.clientNotes) {
      updateData.clientNotes = args.clientNotes;
    }

    if (args.actionItems) {
      updateData.actionItems = args.actionItems;
    }

    await ctx.db.patch(args.sessionId, updateData);

    return {
      success: true,
      message: "Session notes added successfully",
    };
  },
});

/**
 * Submit session review
 */
export const submitSessionReview = mutation({
  args: {
    sessionId: v.id("sessions"),
    clientRating: v.number(),
    clientReview: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    if (session.status !== "completed") {
      throw new Error("Can only review completed sessions");
    }

    await ctx.db.patch(args.sessionId, {
      clientRating: args.clientRating,
      clientReview: args.clientReview,
      reviewedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Review submitted successfully",
    };
  },
});

/**
 * Mark session as paid
 */
export const markSessionAsPaid = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    await ctx.db.patch(args.sessionId, {
      isPaid: true,
      paidAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Session marked as paid",
    };
  },
});

/**
 * Get upcoming sessions
 */
export const getUpcomingSessions = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const now = Date.now();

    const coachSessions = await ctx.db
      .query("sessions")
      .withIndex("by_coach_id", (q) => q.eq("coachId", args.userId))
      .collect();

    const clientSessions = await ctx.db
      .query("sessions")
      .withIndex("by_client_id", (q) => q.eq("clientId", args.userId))
      .collect();

    const allSessions = [...coachSessions, ...clientSessions];

    const upcomingSessions = allSessions
      .filter((s) => s.scheduledAt > now && s.status === "scheduled")
      .sort((a, b) => a.scheduledAt - b.scheduledAt)
      .slice(0, limit);

    const sessionsWithUsers = await Promise.all(
      upcomingSessions.map(async (session) => {
        const coach = await ctx.db.get(session.coachId);
        const client = await ctx.db.get(session.clientId);
        return { ...session, coach, client };
      })
    );

    return sessionsWithUsers;
  },
});

/**
 * Get session statistics for a coach
 */
export const getCoachSessionStats = query({
  args: {
    coachId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_coach_id", (q) => q.eq("coachId", args.coachId))
      .collect();

    const stats = {
      total: sessions.length,
      byStatus: {
        scheduled: 0,
        in_progress: 0,
        completed: 0,
        cancelled: 0,
        no_show: 0,
      },
      totalRevenue: 0,
      paidRevenue: 0,
      averageRating: 0,
      totalReviews: 0,
    };

    let totalRatings = 0;

    sessions.forEach((session) => {
      stats.byStatus[session.status]++;
      stats.totalRevenue += session.price;
      if (session.isPaid) {
        stats.paidRevenue += session.price;
      }
      if (session.clientRating) {
        totalRatings += session.clientRating;
        stats.totalReviews++;
      }
    });

    if (stats.totalReviews > 0) {
      stats.averageRating = totalRatings / stats.totalReviews;
    }

    return stats;
  },
});
