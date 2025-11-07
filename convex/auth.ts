import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Authentication Functions for CareerSU Platform
 * 
 * Handles user authentication including:
 * - User registration
 * - Login/Logout
 * - Session management
 * - Email verification
 */

/**
 * Register a new user
 * Creates a user account and profile
 */
export const registerUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("job_seeker"), v.literal("coach")),
    authProvider: v.string(),
    authProviderId: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const now = Date.now();

    // Create user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: args.role,
      authProvider: args.authProvider,
      authProviderId: args.authProviderId,
      emailVerified: false,
      profileImageUrl: args.profileImageUrl,
      createdAt: now,
      lastLoginAt: now,
      isActive: true,
    });

    // Create default profile
    await ctx.db.insert("profiles", {
      userId,
      updatedAt: now,
    });

    // If coach, create coach profile
    if (args.role === "coach") {
      await ctx.db.insert("coaches", {
        userId,
        title: "",
        biography: "",
        averageRating: 0,
        totalReviews: 0,
        totalSessions: 0,
        isAcceptingClients: false,
        currentClientCount: 0,
        sessionTypes: [],
        isVerified: false,
        createdAt: now,
        updatedAt: now,
      });
    }

    return {
      userId,
      message: "User registered successfully",
    };
  },
});

/**
 * Get user by email
 * Used for authentication flows
 */
export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    return user;
  },
});

/**
 * Get user by auth provider ID
 * Used for OAuth authentication
 */
export const getUserByAuthProvider = query({
  args: {
    authProvider: v.string(),
    authProviderId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_provider", (q) =>
        q.eq("authProvider", args.authProvider).eq("authProviderId", args.authProviderId)
      )
      .first();

    return user;
  },
});

/**
 * Update last login timestamp
 */
export const updateLastLogin = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      lastLoginAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Verify user email
 */
export const verifyEmail = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.emailVerified) {
      throw new Error("Email already verified");
    }

    await ctx.db.patch(args.userId, {
      emailVerified: true,
    });

    return {
      success: true,
      message: "Email verified successfully",
    };
  },
});

/**
 * Update user profile image
 */
export const updateProfileImage = mutation({
  args: {
    userId: v.id("users"),
    profileImageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.userId, {
      profileImageUrl: args.profileImageUrl,
    });

    return {
      success: true,
      profileImageUrl: args.profileImageUrl,
    };
  },
});

/**
 * Deactivate user account
 */
export const deactivateAccount = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.userId, {
      isActive: false,
    });

    return {
      success: true,
      message: "Account deactivated successfully",
    };
  },
});

/**
 * Reactivate user account
 */
export const reactivateAccount = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.userId, {
      isActive: true,
      lastLoginAt: Date.now(),
    });

    return {
      success: true,
      message: "Account reactivated successfully",
    };
  },
});

/**
 * Get current user session info
 */
export const getCurrentUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      return null;
    }

    // Get user profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    // Get coach profile if applicable
    let coachProfile = null;
    if (user.role === "coach") {
      coachProfile = await ctx.db
        .query("coaches")
        .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
        .first();
    }

    return {
      user,
      profile,
      coachProfile,
    };
  },
});
