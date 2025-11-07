import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * User Management Functions
 * 
 * Handles user profile operations including:
 * - Profile CRUD operations
 * - User search and filtering
 * - Profile updates
 */

/**
 * Get user profile by user ID
 */
export const getUserProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    return {
      user,
      profile,
    };
  },
});

/**
 * Update user profile
 */
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    phoneNumber: v.optional(v.string()),
    location: v.optional(v.string()),
    timezone: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    portfolioUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    targetRole: v.optional(v.string()),
    experienceLevel: v.optional(
      v.union(
        v.literal("entry"),
        v.literal("mid"),
        v.literal("senior"),
        v.literal("lead"),
        v.literal("executive")
      )
    ),
    skills: v.optional(v.array(v.string())),
    industries: v.optional(v.array(v.string())),
    desiredSalaryMin: v.optional(v.number()),
    desiredSalaryMax: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId, ...profileData } = args;

    // Get existing profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Filter out undefined values
    const updateData = Object.fromEntries(
      Object.entries(profileData).filter(([_, value]) => value !== undefined)
    );

    // Update profile
    await ctx.db.patch(profile._id, {
      ...updateData,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Profile updated successfully",
    };
  },
});

/**
 * Update coach profile
 */
export const updateCoachProfile = mutation({
  args: {
    userId: v.id("users"),
    specializations: v.optional(v.array(v.string())),
    yearsOfExperience: v.optional(v.number()),
    hourlyRate: v.optional(v.number()),
    availability: v.optional(v.string()),
    certifications: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { userId, ...coachData } = args;

    // Verify user is a coach
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "coach") {
      throw new Error("User is not a coach");
    }

    // Get existing profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Filter out undefined values
    const updateData = Object.fromEntries(
      Object.entries(coachData).filter(([_, value]) => value !== undefined)
    );

    // Update profile
    await ctx.db.patch(profile._id, {
      ...updateData,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Coach profile updated successfully",
    };
  },
});

/**
 * Get all users (admin only - add auth check in production)
 */
export const getAllUsers = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;

    const users = await ctx.db
      .query("users")
      .order("desc")
      .take(limit);

    return users;
  },
});

/**
 * Get users by role
 */
export const getUsersByRole = query({
  args: {
    role: v.union(v.literal("job_seeker"), v.literal("coach"), v.literal("admin")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const users = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .order("desc")
      .take(limit);

    return users;
  },
});

/**
 * Search users by name or email
 */
export const searchUsers = query({
  args: {
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const searchLower = args.searchTerm.toLowerCase();

    const allUsers = await ctx.db.query("users").collect();

    // Filter users by name or email containing search term
    const matchingUsers = allUsers
      .filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      )
      .slice(0, limit);

    return matchingUsers;
  },
});

/**
 * Update user basic info
 */
export const updateUserInfo = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updateData } = args;

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Filter out undefined values
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(userId, filteredData);

    return {
      success: true,
      message: "User info updated successfully",
    };
  },
});

/**
 * Get user statistics
 */
export const getUserStats = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Get document count
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    // Get application count
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    // Get application stats by status
    const applicationsByStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let coachStats = null;
    if (user.role === "coach") {
      // Get session count
      const sessions = await ctx.db
        .query("sessions")
        .withIndex("by_coach_id", (q) => q.eq("coachId", args.userId))
        .collect();

      const sessionsByStatus = sessions.reduce((acc, session) => {
        acc[session.status] = (acc[session.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      coachStats = {
        totalSessions: sessions.length,
        sessionsByStatus,
      };
    }

    return {
      documentsCount: documents.length,
      applicationsCount: applications.length,
      applicationsByStatus,
      coachStats,
    };
  },
});

/**
 * Delete user account (soft delete by deactivating)
 */
export const deleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Deactivate instead of hard delete
    await ctx.db.patch(args.userId, {
      isActive: false,
    });

    return {
      success: true,
      message: "User account deleted successfully",
    };
  },
});
