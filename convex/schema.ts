import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * CareerSU Platform Database Schema
 *
 * This schema defines all tables for the CareerSU platform including:
 * - User authentication and profiles
 * - Document management (resumes, cover letters)
 * - Job listings and matching
 * - Application tracking
 * - Real-time chat messaging
 * - Coach management and sessions
 */

export default defineSchema({
  /**
   * Users Table
   * Core user authentication and account information
   */
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("job_seeker"), v.literal("coach"), v.literal("admin")),
    authProvider: v.string(), // e.g., "email", "google", "github"
    authProviderId: v.optional(v.string()),
    emailVerified: v.boolean(),
    profileImageUrl: v.optional(v.string()),
    createdAt: v.number(),
    lastLoginAt: v.number(),
    isActive: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_auth_provider", ["authProvider", "authProviderId"])
    .index("by_created_at", ["createdAt"]),

  /**
   * Profiles Table
   * Extended user profile information for job seekers and coaches
   */
  profiles: defineTable({
    userId: v.id("users"),
    phoneNumber: v.optional(v.string()),
    location: v.optional(v.string()),
    timezone: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    portfolioUrl: v.optional(v.string()),
    bio: v.optional(v.string()),

    // Job seeker specific fields
    targetRole: v.optional(v.string()),
    experienceLevel: v.optional(v.union(
      v.literal("entry"),
      v.literal("mid"),
      v.literal("senior"),
      v.literal("lead"),
      v.literal("executive")
    )),
    skills: v.optional(v.array(v.string())),
    industries: v.optional(v.array(v.string())),
    desiredSalaryMin: v.optional(v.number()),
    desiredSalaryMax: v.optional(v.number()),

    // Coach specific fields
    specializations: v.optional(v.array(v.string())),
    yearsOfExperience: v.optional(v.number()),
    hourlyRate: v.optional(v.number()),
    availability: v.optional(v.string()),
    certifications: v.optional(v.array(v.string())),

    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_experience_level", ["experienceLevel"])
    .index("by_target_role", ["targetRole"]),

  /**
   * Documents Table
   * Stores resumes, cover letters, and other career documents
   */
  documents: defineTable({
    userId: v.id("users"),
    title: v.string(),
    type: v.union(
      v.literal("resume"),
      v.literal("cover_letter"),
      v.literal("portfolio"),
      v.literal("other")
    ),
    content: v.string(), // JSON string of document content
    format: v.union(v.literal("pdf"), v.literal("docx"), v.literal("txt"), v.literal("html")),

    // Metadata
    fileSize: v.optional(v.number()),
    storageUrl: v.optional(v.string()), // URL to stored file (if using external storage)
    thumbnailUrl: v.optional(v.string()),

    // Versioning
    version: v.number(),
    parentDocumentId: v.optional(v.id("documents")),

    // AI analysis results
    aiScore: v.optional(v.number()),
    aiSuggestions: v.optional(v.array(v.string())),
    keywords: v.optional(v.array(v.string())),

    // Status and metadata
    isTemplate: v.boolean(),
    isFavorite: v.boolean(),
    lastEditedAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_type", ["type"])
    .index("by_user_and_type", ["userId", "type"])
    .index("by_created_at", ["createdAt"])
    .index("by_favorite", ["userId", "isFavorite"]),

  /**
   * Jobs Table
   * Job listings from various sources
   */
  jobs: defineTable({
    title: v.string(),
    company: v.string(),
    companyLogo: v.optional(v.string()),
    location: v.string(),
    locationType: v.union(v.literal("remote"), v.literal("hybrid"), v.literal("onsite")),

    description: v.string(),
    requirements: v.array(v.string()),
    responsibilities: v.optional(v.array(v.string())),
    benefits: v.optional(v.array(v.string())),

    // Compensation
    salaryMin: v.optional(v.number()),
    salaryMax: v.optional(v.number()),
    salaryCurrency: v.optional(v.string()),
    salaryPeriod: v.optional(v.union(v.literal("hourly"), v.literal("annual"))),

    // Categorization
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

    // Source information
    source: v.string(), // e.g., "linkedin", "indeed", "company_website", "manual"
    externalId: v.optional(v.string()),
    externalUrl: v.optional(v.string()),

    // AI matching
    matchScore: v.optional(v.number()),

    // Status
    isActive: v.boolean(),
    postedAt: v.number(),
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_company", ["company"])
    .index("by_location", ["location"])
    .index("by_location_type", ["locationType"])
    .index("by_experience_level", ["experienceLevel"])
    .index("by_employment_type", ["employmentType"])
    .index("by_industry", ["industry"])
    .index("by_is_active", ["isActive"])
    .index("by_posted_at", ["postedAt"])
    .index("by_created_at", ["createdAt"]),

  /**
   * Applications Table
   * Tracks job applications and their status
   */
  applications: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobs"),

    // Application details
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

    // Documents used
    resumeId: v.optional(v.id("documents")),
    coverLetterId: v.optional(v.id("documents")),

    // Application metadata
    appliedVia: v.optional(v.string()), // e.g., "platform", "email", "company_website"
    contactPerson: v.optional(v.string()),
    contactEmail: v.optional(v.string()),

    // Timeline
    appliedAt: v.optional(v.number()),
    lastStatusChangeAt: v.number(),
    followUpDate: v.optional(v.number()),

    // Notes and tracking
    notes: v.optional(v.string()),
    interviewNotes: v.optional(v.string()),

    // Offer details
    offerSalary: v.optional(v.number()),
    offerBenefits: v.optional(v.array(v.string())),

    createdAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_job_id", ["jobId"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_status", ["status"])
    .index("by_applied_at", ["appliedAt"])
    .index("by_follow_up_date", ["followUpDate"])
    .index("by_created_at", ["createdAt"]),

  /**
   * Chat Messages Table
   * Real-time chat messages between users and coaches
   */
  chatMessages: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    conversationId: v.string(), // Unique ID for the conversation thread

    content: v.string(),
    messageType: v.union(
      v.literal("text"),
      v.literal("file"),
      v.literal("system")
    ),

    // File attachment (if applicable)
    attachmentUrl: v.optional(v.string()),
    attachmentName: v.optional(v.string()),
    attachmentType: v.optional(v.string()),
    attachmentSize: v.optional(v.number()),

    // Message status
    isRead: v.boolean(),
    readAt: v.optional(v.number()),
    isEdited: v.boolean(),
    editedAt: v.optional(v.number()),
    isDeleted: v.boolean(),

    // Reactions and threading
    replyToMessageId: v.optional(v.id("chatMessages")),
    reactions: v.optional(v.array(v.object({
      userId: v.id("users"),
      emoji: v.string(),
      timestamp: v.number(),
    }))),

    createdAt: v.number(),
  })
    .index("by_conversation_id", ["conversationId"])
    .index("by_sender_id", ["senderId"])
    .index("by_receiver_id", ["receiverId"])
    .index("by_conversation_and_created", ["conversationId", "createdAt"])
    .index("by_unread", ["receiverId", "isRead"])
    .index("by_created_at", ["createdAt"]),

  /**
   * Coaches Table
   * Additional information specific to career coaches
   */
  coaches: defineTable({
    userId: v.id("users"),

    // Professional information
    title: v.string(),
    company: v.optional(v.string()),
    biography: v.string(),

    // Ratings and reviews
    averageRating: v.number(),
    totalReviews: v.number(),
    totalSessions: v.number(),

    // Availability
    isAcceptingClients: v.boolean(),
    maxClientsPerMonth: v.optional(v.number()),
    currentClientCount: v.number(),

    // Pricing
    sessionTypes: v.array(v.object({
      name: v.string(),
      duration: v.number(), // in minutes
      price: v.number(),
      description: v.string(),
    })),

    // Verification
    isVerified: v.boolean(),
    verifiedAt: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_is_accepting_clients", ["isAcceptingClients"])
    .index("by_average_rating", ["averageRating"])
    .index("by_is_verified", ["isVerified"]),

  /**
   * Sessions Table
   * Coaching sessions between coaches and job seekers
   */
  sessions: defineTable({
    coachId: v.id("users"),
    clientId: v.id("users"),
    coachProfileId: v.id("coaches"),

    // Session details
    title: v.string(),
    description: v.optional(v.string()),
    sessionType: v.string(), // matches one of the coach's session types

    // Scheduling
    scheduledAt: v.number(),
    duration: v.number(), // in minutes
    endTime: v.number(),
    timezone: v.string(),

    // Status
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show")
    ),

    // Meeting details
    meetingUrl: v.optional(v.string()),
    meetingPassword: v.optional(v.string()),
    location: v.optional(v.string()),

    // Session notes
    coachNotes: v.optional(v.string()),
    clientNotes: v.optional(v.string()),
    actionItems: v.optional(v.array(v.string())),

    // Payment
    price: v.number(),
    isPaid: v.boolean(),
    paidAt: v.optional(v.number()),

    // Feedback
    clientRating: v.optional(v.number()),
    clientReview: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),

    // Cancellation
    cancelledBy: v.optional(v.id("users")),
    cancelledAt: v.optional(v.number()),
    cancellationReason: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_coach_id", ["coachId"])
    .index("by_client_id", ["clientId"])
    .index("by_status", ["status"])
    .index("by_scheduled_at", ["scheduledAt"])
    .index("by_coach_and_scheduled", ["coachId", "scheduledAt"])
    .index("by_client_and_scheduled", ["clientId", "scheduledAt"])
    .index("by_created_at", ["createdAt"]),
});
