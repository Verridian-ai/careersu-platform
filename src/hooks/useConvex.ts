/**
 * Convex React Hooks
 * 
 * Custom hooks for integrating Convex queries and mutations with React components
 * These hooks provide type-safe access to all Convex backend functions
 */

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

/**
 * Authentication Hooks
 */

export function useCurrentUser(userId: Id<"users"> | null) {
  return useQuery(
    api.auth.getCurrentUser,
    userId ? { userId } : "skip"
  );
}

export function useRegisterUser() {
  return useMutation(api.auth.registerUser);
}

export function useUpdateLastLogin() {
  return useMutation(api.auth.updateLastLogin);
}

/**
 * User Management Hooks
 */

export function useUserProfile(userId: Id<"users"> | null) {
  return useQuery(
    api.users.getUserProfile,
    userId ? { userId } : "skip"
  );
}

export function useUpdateProfile() {
  return useMutation(api.users.updateProfile);
}

export function useUserStats(userId: Id<"users"> | null) {
  return useQuery(
    api.users.getUserStats,
    userId ? { userId } : "skip"
  );
}

/**
 * Document Management Hooks
 */

export function useUserDocuments(userId: Id<"users"> | null, type?: "resume" | "cover_letter" | "portfolio" | "other") {
  return useQuery(
    api.documents.getUserDocuments,
    userId ? { userId, type } : "skip"
  );
}

export function useDocument(documentId: Id<"documents"> | null) {
  return useQuery(
    api.documents.getDocument,
    documentId ? { documentId } : "skip"
  );
}

export function useCreateDocument() {
  return useMutation(api.documents.createDocument);
}

export function useUpdateDocument() {
  return useMutation(api.documents.updateDocument);
}

export function useDeleteDocument() {
  return useMutation(api.documents.deleteDocument);
}

export function useToggleFavorite() {
  return useMutation(api.documents.toggleFavorite);
}

export function useDocumentStats(userId: Id<"users"> | null) {
  return useQuery(
    api.documents.getDocumentStats,
    userId ? { userId } : "skip"
  );
}

/**
 * Job Management Hooks
 */

export function useActiveJobs(limit?: number) {
  return useQuery(api.jobs.getActiveJobs, { limit });
}

export function useJob(jobId: Id<"jobs"> | null) {
  return useQuery(
    api.jobs.getJob,
    jobId ? { jobId } : "skip"
  );
}

export function useSearchJobs(filters: {
  searchTerm?: string;
  locationType?: "remote" | "hybrid" | "onsite";
  experienceLevel?: "entry" | "mid" | "senior" | "lead" | "executive";
  employmentType?: "full_time" | "part_time" | "contract" | "internship";
  industry?: string;
  limit?: number;
}) {
  return useQuery(api.jobs.searchJobs, filters);
}

export function useRecommendedJobs(userId: Id<"users"> | null, limit?: number) {
  return useQuery(
    api.jobs.getRecommendedJobs,
    userId ? { userId, limit } : "skip"
  );
}

export function useCreateJob() {
  return useMutation(api.jobs.createJob);
}

export function useUpdateJob() {
  return useMutation(api.jobs.updateJob);
}

/**
 * Application Tracking Hooks
 */

export function useUserApplications(
  userId: Id<"users"> | null,
  status?: "draft" | "submitted" | "under_review" | "interview_scheduled" | "interviewed" | "offer_received" | "accepted" | "rejected" | "withdrawn"
) {
  return useQuery(
    api.applications.getUserApplications,
    userId ? { userId, status } : "skip"
  );
}

export function useApplication(applicationId: Id<"applications"> | null) {
  return useQuery(
    api.applications.getApplication,
    applicationId ? { applicationId } : "skip"
  );
}

export function useCreateApplication() {
  return useMutation(api.applications.createApplication);
}

export function useUpdateApplicationStatus() {
  return useMutation(api.applications.updateApplicationStatus);
}

export function useUpdateApplication() {
  return useMutation(api.applications.updateApplication);
}

export function useApplicationStats(userId: Id<"users"> | null) {
  return useQuery(
    api.applications.getApplicationStats,
    userId ? { userId } : "skip"
  );
}

/**
 * Chat Messaging Hooks
 */

export function useConversationMessages(conversationId: string | null, limit?: number) {
  return useQuery(
    api.chat.getConversationMessages,
    conversationId ? { conversationId, limit } : "skip"
  );
}

export function useUserConversations(userId: Id<"users"> | null) {
  return useQuery(
    api.chat.getUserConversations,
    userId ? { userId } : "skip"
  );
}

export function useSendMessage() {
  return useMutation(api.chat.sendMessage);
}

export function useMarkMessageAsRead() {
  return useMutation(api.chat.markMessageAsRead);
}

export function useMarkConversationAsRead() {
  return useMutation(api.chat.markConversationAsRead);
}

export function useUnreadCount(userId: Id<"users"> | null) {
  return useQuery(
    api.chat.getUnreadCount,
    userId ? { userId } : "skip"
  );
}

/**
 * Coach Management Hooks
 */

export function useCoachProfile(userId: Id<"users"> | null) {
  return useQuery(
    api.coaches.getCoachProfile,
    userId ? { userId } : "skip"
  );
}

export function useAllCoaches(filters?: {
  limit?: number;
  isAcceptingClients?: boolean;
  isVerified?: boolean;
}) {
  return useQuery(api.coaches.getAllCoaches, filters || {});
}

export function useTopRatedCoaches(limit?: number) {
  return useQuery(api.coaches.getTopRatedCoaches, { limit });
}

export function useUpdateCoachProfile() {
  return useMutation(api.coaches.updateCoachProfile);
}

/**
 * Session Management Hooks
 */

export function useCoachSessions(
  coachId: Id<"users"> | null,
  status?: "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show"
) {
  return useQuery(
    api.sessions.getCoachSessions,
    coachId ? { coachId, status } : "skip"
  );
}

export function useClientSessions(
  clientId: Id<"users"> | null,
  status?: "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show"
) {
  return useQuery(
    api.sessions.getClientSessions,
    clientId ? { clientId, status } : "skip"
  );
}

export function useSession(sessionId: Id<"sessions"> | null) {
  return useQuery(
    api.sessions.getSession,
    sessionId ? { sessionId } : "skip"
  );
}

export function useUpcomingSessions(userId: Id<"users"> | null, limit?: number) {
  return useQuery(
    api.sessions.getUpcomingSessions,
    userId ? { userId, limit } : "skip"
  );
}

export function useCreateSession() {
  return useMutation(api.sessions.createSession);
}

export function useUpdateSessionStatus() {
  return useMutation(api.sessions.updateSessionStatus);
}

export function useCancelSession() {
  return useMutation(api.sessions.cancelSession);
}

export function useSubmitSessionReview() {
  return useMutation(api.sessions.submitSessionReview);
}
