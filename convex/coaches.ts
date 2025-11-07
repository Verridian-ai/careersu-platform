import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Coach Management Functions
 * 
 * Handles coach profile operations including:
 * - Coach profile management
 * - Coach search and discovery
 * - Ratings and reviews
 */

/**
 * Get coach profile by user ID
 */
export const getCoachProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const coach = await ctx.db
      .query("coaches")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!coach) {
      throw new Error("Coach profile not found");
    }

    const user = await ctx.db.get(args.userId);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    return {
      coach,
      user,
      profile,
    };
  },
});

/**
 * Update coach profile
 */
export const updateCoachProfile = mutation({
  args: {
    userId: v.id("users"),
    title: v.optional(v.string()),
    company: v.optional(v.string()),
    biography: v.optional(v.string()),
    isAcceptingClients: v.optional(v.boolean()),
    maxClientsPerMonth: v.optional(v.number()),
    sessionTypes: v.optional(
      v.array(
        v.object({
          name: v.string(),
          duration: v.number(),
          price: v.number(),
          description: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const { userId, ...updateData } = args;

    const coach = await ctx.db
      .query("coaches")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!coach) {
      throw new Error("Coach profile not found");
    }

    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(coach._id, {
      ...filteredData,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Coach profile updated successfully",
    };
  },
});

/**
 * Get all coaches
 */
export const getAllCoaches = query({
  args: {
    limit: v.optional(v.number()),
    isAcceptingClients: v.optional(v.boolean()),
    isVerified: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    let coaches;

    if (args.isAcceptingClients !== undefined) {
      coaches = await ctx.db
        .query("coaches")
        .withIndex("by_is_accepting_clients", (q) =>
          q.eq("isAcceptingClients", args.isAcceptingClients)
        )
        .collect();
    } else if (args.isVerified !== undefined) {
      coaches = await ctx.db
        .query("coaches")
        .withIndex("by_is_verified", (q) => q.eq("isVerified", args.isVerified))
        .collect();
    } else {
      coaches = await ctx.db.query("coaches").collect();
    }

    if (args.isVerified !== undefined && args.isAcceptingClients !== undefined) {
      coaches = coaches.filter(
        (c) =>
          c.isVerified === args.isVerified && c.isAcceptingClients === args.isAcceptingClients
      );
    }

    const coachesWithUsers = await Promise.all(
      coaches.slice(0, limit).map(async (coach) => {
        const user = await ctx.db.get(coach.userId);
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_user_id", (q) => q.eq("userId", coach.userId))
          .first();
        return { ...coach, user, profile };
      })
    );

    return coachesWithUsers;
  },
});

/**
 * Get top-rated coaches
 */
export const getTopRatedCoaches = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    const coaches = await ctx.db
      .query("coaches")
      .withIndex("by_average_rating")
      .order("desc")
      .take(limit);

    const coachesWithUsers = await Promise.all(
      coaches.map(async (coach) => {
        const user = await ctx.db.get(coach.userId);
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_user_id", (q) => q.eq("userId", coach.userId))
          .first();
        return { ...coach, user, profile };
      })
    );

    return coachesWithUsers;
  },
});

/**
 * Search coaches by specialization
 */
export const searchCoachesBySpecialization = query({
  args: {
    specialization: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const searchLower = args.specialization.toLowerCase();

    const allCoaches = await ctx.db.query("coaches").collect();

    const profiles = await Promise.all(
      allCoaches.map((coach) =>
        ctx.db
          .query("profiles")
          .withIndex("by_user_id", (q) => q.eq("userId", coach.userId))
          .first()
      )
    );

    const matchingCoaches = allCoaches.filter((coach, index) => {
      const profile = profiles[index];
      return profile?.specializations?.some((s) => s.toLowerCase().includes(searchLower));
    });

    const coachesWithUsers = await Promise.all(
      matchingCoaches.slice(0, limit).map(async (coach) => {
        const user = await ctx.db.get(coach.userId);
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_user_id", (q) => q.eq("userId", coach.userId))
          .first();
        return { ...coach, user, profile };
      })
    );

    return coachesWithUsers;
  },
});

/**
 * Verify coach
 */
export const verifyCoach = mutation({
  args: {
    coachId: v.id("coaches"),
  },
  handler: async (ctx, args) => {
    const coach = await ctx.db.get(args.coachId);
    if (!coach) {
      throw new Error("Coach not found");
    }

    await ctx.db.patch(args.coachId, {
      isVerified: true,
      verifiedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Coach verified successfully",
    };
  },
});

/**
 * Update coach rating
 */
export const updateCoachRating = mutation({
  args: {
    coachId: v.id("coaches"),
    newRating: v.number(),
  },
  handler: async (ctx, args) => {
    const coach = await ctx.db.get(args.coachId);
    if (!coach) {
      throw new Error("Coach not found");
    }

    const totalRatings = coach.totalReviews * coach.averageRating;
    const newTotalReviews = coach.totalReviews + 1;
    const newAverageRating = (totalRatings + args.newRating) / newTotalReviews;

    await ctx.db.patch(args.coachId, {
      averageRating: newAverageRating,
      totalReviews: newTotalReviews,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      newAverageRating,
      message: "Coach rating updated successfully",
    };
  },
});

/**
 * Increment coach session count
 */
export const incrementSessionCount = mutation({
  args: {
    coachId: v.id("coaches"),
  },
  handler: async (ctx, args) => {
    const coach = await ctx.db.get(args.coachId);
    if (!coach) {
      throw new Error("Coach not found");
    }

    await ctx.db.patch(args.coachId, {
      totalSessions: coach.totalSessions + 1,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      totalSessions: coach.totalSessions + 1,
    };
  },
});

/**
 * Update coach client count
 */
export const updateClientCount = mutation({
  args: {
    coachId: v.id("coaches"),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const coach = await ctx.db.get(args.coachId);
    if (!coach) {
      throw new Error("Coach not found");
    }

    await ctx.db.patch(args.coachId, {
      currentClientCount: args.count,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      currentClientCount: args.count,
    };
  },
});
