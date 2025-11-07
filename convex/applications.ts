import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Application Tracking Functions
 * 
 * Handles job application operations including:
 * - Creating and updating applications
 * - Tracking application status
 * - Application analytics
 */

/**
 * Create a new application
 */
export const createApplication = mutation({
  args: {
    userId: v.id("users"),
    jobId: v.id("jobs"),
    resumeId: v.optional(v.id("documents")),
    coverLetterId: v.optional(v.id("documents")),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("submitted"),
        v.literal("under_review"),
        v.literal("interview_scheduled"),
        v.literal("interviewed"),
        v.literal("offer_received"),
        v.literal("accepted"),
        v.literal("rejected"),
        v.literal("withdrawn")
      )
    ),
  },
  handler: async (ctx, args) => {
    const existingApp = await ctx.db
      .query("applications")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    const duplicate = existingApp.find((app) => app.jobId === args.jobId);
    if (duplicate) {
      throw new Error("You have already applied to this job");
    }

    const now = Date.now();

    const applicationId = await ctx.db.insert("applications", {
      userId: args.userId,
      jobId: args.jobId,
      resumeId: args.resumeId,
      coverLetterId: args.coverLetterId,
      status: args.status ?? "draft",
      lastStatusChangeAt: now,
      createdAt: now,
    });

    return {
      applicationId,
      message: "Application created successfully",
    };
  },
});

/**
 * Get application by ID
 */
export const getApplication = query({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const application = await ctx.db.get(args.applicationId);

    if (!application) {
      throw new Error("Application not found");
    }

    const job = await ctx.db.get(application.jobId);
    const resume = application.resumeId ? await ctx.db.get(application.resumeId) : null;
    const coverLetter = application.coverLetterId
      ? await ctx.db.get(application.coverLetterId)
      : null;

    return {
      application,
      job,
      resume,
      coverLetter,
    };
  },
});

/**
 * Get all applications for a user
 */
export const getUserApplications = query({
  args: {
    userId: v.id("users"),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("submitted"),
        v.literal("under_review"),
        v.literal("interview_scheduled"),
        v.literal("interviewed"),
        v.literal("offer_received"),
        v.literal("accepted"),
        v.literal("rejected"),
        v.literal("withdrawn")
      )
    ),
  },
  handler: async (ctx, args) => {
    let applications;

    if (args.status) {
      applications = await ctx.db
        .query("applications")
        .withIndex("by_user_and_status", (q) =>
          q.eq("userId", args.userId).eq("status", args.status)
        )
        .order("desc")
        .collect();
    } else {
      applications = await ctx.db
        .query("applications")
        .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
        .order("desc")
        .collect();
    }

    const applicationsWithJobs = await Promise.all(
      applications.map(async (app) => {
        const job = await ctx.db.get(app.jobId);
        return { ...app, job };
      })
    );

    return applicationsWithJobs;
  },
});

/**
 * Update application status
 */
export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.union(
      v.literal("draft"),
      v.literal("submitted"),
      v.literal("under_review"),
      v.literal("interview_scheduled"),
      v.literal("interviewed"),
      v.literal("offer_received"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("withdrawn")
    ),
  },
  handler: async (ctx, args) => {
    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    const now = Date.now();

    await ctx.db.patch(args.applicationId, {
      status: args.status,
      lastStatusChangeAt: now,
      appliedAt: args.status === "submitted" && !application.appliedAt ? now : application.appliedAt,
    });

    return {
      success: true,
      message: "Application status updated successfully",
    };
  },
});

/**
 * Update application details
 */
export const updateApplication = mutation({
  args: {
    applicationId: v.id("applications"),
    resumeId: v.optional(v.id("documents")),
    coverLetterId: v.optional(v.id("documents")),
    notes: v.optional(v.string()),
    interviewNotes: v.optional(v.string()),
    followUpDate: v.optional(v.number()),
    contactPerson: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    appliedVia: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { applicationId, ...updateData } = args;

    const application = await ctx.db.get(applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(applicationId, filteredData);

    return {
      success: true,
      message: "Application updated successfully",
    };
  },
});

/**
 * Delete application
 */
export const deleteApplication = mutation({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    await ctx.db.delete(args.applicationId);

    return {
      success: true,
      message: "Application deleted successfully",
    };
  },
});

/**
 * Get applications requiring follow-up
 */
export const getFollowUpApplications = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const allApplications = await ctx.db
      .query("applications")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    const followUpApps = allApplications.filter(
      (app) => app.followUpDate && app.followUpDate <= now
    );

    const applicationsWithJobs = await Promise.all(
      followUpApps.map(async (app) => {
        const job = await ctx.db.get(app.jobId);
        return { ...app, job };
      })
    );

    return applicationsWithJobs;
  },
});

/**
 * Get application statistics for a user
 */
export const getApplicationStats = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    const stats = {
      total: applications.length,
      byStatus: {
        draft: 0,
        submitted: 0,
        under_review: 0,
        interview_scheduled: 0,
        interviewed: 0,
        offer_received: 0,
        accepted: 0,
        rejected: 0,
        withdrawn: 0,
      },
      pendingFollowUp: 0,
    };

    const now = Date.now();

    applications.forEach((app) => {
      stats.byStatus[app.status]++;
      if (app.followUpDate && app.followUpDate <= now) {
        stats.pendingFollowUp++;
      }
    });

    return stats;
  },
});

/**
 * Get recent applications
 */
export const getRecentApplications = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    const applications = await ctx.db
      .query("applications")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);

    const applicationsWithJobs = await Promise.all(
      applications.map(async (app) => {
        const job = await ctx.db.get(app.jobId);
        return { ...app, job };
      })
    );

    return applicationsWithJobs;
  },
});
