import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Job Management Functions
 * 
 * Handles job listing operations including:
 * - Creating and updating job listings
 * - Searching and filtering jobs
 * - Job matching and recommendations
 */

/**
 * Create a new job listing
 */
export const createJob = mutation({
  args: {
    title: v.string(),
    company: v.string(),
    companyLogo: v.optional(v.string()),
    location: v.string(),
    locationType: v.union(v.literal("remote"), v.literal("hybrid"), v.literal("onsite")),
    description: v.string(),
    requirements: v.array(v.string()),
    responsibilities: v.optional(v.array(v.string())),
    benefits: v.optional(v.array(v.string())),
    salaryMin: v.optional(v.number()),
    salaryMax: v.optional(v.number()),
    salaryCurrency: v.optional(v.string()),
    salaryPeriod: v.optional(v.union(v.literal("hourly"), v.literal("annual"))),
    experienceLevel: v.union(
      v.literal("entry"),
      v.literal("mid"),
      v.literal("senior"),
      v.literal("lead"),
      v.literal("executive")
    ),
    employmentType: v.union(
      v.literal("full_time"),
      v.literal("part_time"),
      v.literal("contract"),
      v.literal("internship")
    ),
    industry: v.string(),
    skills: v.array(v.string()),
    source: v.string(),
    externalId: v.optional(v.string()),
    externalUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const jobId = await ctx.db.insert("jobs", {
      ...args,
      isActive: true,
      postedAt: now,
      createdAt: now,
    });

    return {
      jobId,
      message: "Job created successfully",
    };
  },
});

/**
 * Get job by ID
 */
export const getJob = query({
  args: {
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    return job;
  },
});

/**
 * Get all active jobs
 */
export const getActiveJobs = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_is_active", (q) => q.eq("isActive", true))
      .order("desc")
      .take(limit);

    return jobs;
  },
});

/**
 * Search jobs with filters
 */
export const searchJobs = query({
  args: {
    searchTerm: v.optional(v.string()),
    locationType: v.optional(v.union(v.literal("remote"), v.literal("hybrid"), v.literal("onsite"))),
    experienceLevel: v.optional(
      v.union(
        v.literal("entry"),
        v.literal("mid"),
        v.literal("senior"),
        v.literal("lead"),
        v.literal("executive")
      )
    ),
    employmentType: v.optional(
      v.union(
        v.literal("full_time"),
        v.literal("part_time"),
        v.literal("contract"),
        v.literal("internship")
      )
    ),
    industry: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    let jobs = await ctx.db
      .query("jobs")
      .withIndex("by_is_active", (q) => q.eq("isActive", true))
      .collect();

    if (args.locationType) {
      jobs = jobs.filter((job) => job.locationType === args.locationType);
    }

    if (args.experienceLevel) {
      jobs = jobs.filter((job) => job.experienceLevel === args.experienceLevel);
    }

    if (args.employmentType) {
      jobs = jobs.filter((job) => job.employmentType === args.employmentType);
    }

    if (args.industry) {
      jobs = jobs.filter((job) => job.industry === args.industry);
    }

    if (args.searchTerm) {
      const searchLower = args.searchTerm.toLowerCase();
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower)
      );
    }

    return jobs.slice(0, limit);
  },
});

/**
 * Get jobs by company
 */
export const getJobsByCompany = query({
  args: {
    company: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_company", (q) => q.eq("company", args.company))
      .order("desc")
      .take(limit);

    return jobs;
  },
});

/**
 * Get jobs by industry
 */
export const getJobsByIndustry = query({
  args: {
    industry: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_industry", (q) => q.eq("industry", args.industry))
      .order("desc")
      .take(limit);

    return jobs.filter((job) => job.isActive);
  },
});

/**
 * Get recommended jobs for a user based on their profile
 */
export const getRecommendedJobs = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_is_active", (q) => q.eq("isActive", true))
      .collect();

    if (!profile) {
      return jobs.slice(0, limit);
    }

    const scoredJobs = jobs.map((job) => {
      let score = 0;

      if (profile.targetRole && job.title.toLowerCase().includes(profile.targetRole.toLowerCase())) {
        score += 5;
      }

      if (profile.experienceLevel && job.experienceLevel === profile.experienceLevel) {
        score += 3;
      }

      if (profile.skills) {
        const matchingSkills = job.skills.filter((skill) =>
          profile.skills?.some((userSkill) => userSkill.toLowerCase() === skill.toLowerCase())
        );
        score += matchingSkills.length * 2;
      }

      if (profile.industries) {
        const matchingIndustry = profile.industries.some(
          (industry) => industry.toLowerCase() === job.industry.toLowerCase()
        );
        if (matchingIndustry) score += 4;
      }

      return { ...job, matchScore: score };
    });

    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

    return scoredJobs.slice(0, limit);
  },
});

/**
 * Update job listing
 */
export const updateJob = mutation({
  args: {
    jobId: v.id("jobs"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    requirements: v.optional(v.array(v.string())),
    responsibilities: v.optional(v.array(v.string())),
    benefits: v.optional(v.array(v.string())),
    salaryMin: v.optional(v.number()),
    salaryMax: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { jobId, ...updateData } = args;

    const job = await ctx.db.get(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(jobId, filteredData);

    return {
      success: true,
      message: "Job updated successfully",
    };
  },
});

/**
 * Delete job (deactivate)
 */
export const deleteJob = mutation({
  args: {
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    await ctx.db.patch(args.jobId, {
      isActive: false,
    });

    return {
      success: true,
      message: "Job deactivated successfully",
    };
  },
});

/**
 * Get job statistics
 */
export const getJobStats = query({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db.query("jobs").collect();

    const stats = {
      total: jobs.length,
      active: 0,
      byEmploymentType: {
        full_time: 0,
        part_time: 0,
        contract: 0,
        internship: 0,
      },
      byLocationType: {
        remote: 0,
        hybrid: 0,
        onsite: 0,
      },
      byExperienceLevel: {
        entry: 0,
        mid: 0,
        senior: 0,
        lead: 0,
        executive: 0,
      },
    };

    jobs.forEach((job) => {
      if (job.isActive) stats.active++;
      stats.byEmploymentType[job.employmentType]++;
      stats.byLocationType[job.locationType]++;
      stats.byExperienceLevel[job.experienceLevel]++;
    });

    return stats;
  },
});
