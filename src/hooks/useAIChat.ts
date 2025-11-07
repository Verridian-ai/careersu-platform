import { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { AIMessage } from "@/lib/ai/ragClient";

/**
 * React Hook for AI Chat functionality
 * Manages conversation state and message sending
 */

export interface UseAIChatOptions {
  userId: Id<"users">;
  conversationId?: Id<"conversations">;
  onError?: (error: Error) => void;
}

export function useAIChat(options: UseAIChatOptions) {
  const { userId, conversationId: initialConversationId, onError } = options;

  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(
    initialConversationId || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Mutations
  const createConversation = useMutation(api.messages.createConversation);
  const streamChatResponse = useMutation(api.ai.streamChatResponse);

  // Query messages
  const messages = useQuery(
    api.messages.getConversationMessages,
    conversationId ? { conversationId } : "skip"
  );

  // Initialize conversation if needed
  useEffect(() => {
    if (!conversationId && userId) {
      createConversation({
        userId,
        title: "New Conversation",
      })
        .then((newConversationId) => {
          setConversationId(newConversationId);
        })
        .catch((err) => {
          setError(err);
          onError?.(err);
        });
    }
  }, [conversationId, userId, createConversation, onError]);

  /**
   * Send a message to the AI
   */
  const sendMessage = useCallback(
    async (message: string, useAdvancedModel = false) => {
      if (!conversationId) {
        throw new Error("No conversation initialized");
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await streamChatResponse({
          userId,
          conversationId,
          message,
          useAdvancedModel,
        });

        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, userId, streamChatResponse, onError]
  );

  /**
   * Start a new conversation
   */
  const startNewConversation = useCallback(async () => {
    try {
      const newConversationId = await createConversation({
        userId,
        title: "New Conversation",
      });
      setConversationId(newConversationId);
      return newConversationId;
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
      throw error;
    }
  }, [userId, createConversation, onError]);

  return {
    conversationId,
    messages: messages || [],
    isLoading,
    error,
    sendMessage,
    startNewConversation,
  };
}

/**
 * Hook for resume optimization
 */
export function useResumeOptimization() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const optimizeResume = useMutation(api.ai.optimizeResume);

  const optimize = useCallback(
    async (
      documentId: Id<"documents">,
      targetJobId?: Id<"jobs">,
      focusAreas?: string[]
    ) => {
      setIsOptimizing(true);
      setError(null);

      try {
        const result = await optimizeResume({
          documentId,
          targetJobId,
          focusAreas,
        });
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsOptimizing(false);
      }
    },
    [optimizeResume]
  );

  return {
    optimize,
    isOptimizing,
    error,
  };
}

/**
 * Hook for interview preparation
 */
export function useInterviewPrep() {
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const prepareForInterview = useMutation(api.ai.prepareForInterview);

  const prepare = useCallback(
    async (userId: Id<"users">, jobId: Id<"jobs">) => {
      setIsPreparing(true);
      setError(null);

      try {
        const result = await prepareForInterview({
          userId,
          jobId,
        });
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsPreparing(false);
      }
    },
    [prepareForInterview]
  );

  return {
    prepare,
    isPreparing,
    error,
  };
}

/**
 * Hook for cover letter generation
 */
export function useCoverLetterGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateCoverLetter = useMutation(api.ai.generateCoverLetter);

  const generate = useCallback(
    async (
      userId: Id<"users">,
      resumeId: Id<"documents">,
      jobId: Id<"jobs">,
      tone?: "professional" | "enthusiastic" | "creative"
    ) => {
      setIsGenerating(true);
      setError(null);

      try {
        const result = await generateCoverLetter({
          userId,
          resumeId,
          jobId,
          tone,
        });
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsGenerating(false);
      }
    },
    [generateCoverLetter]
  );

  return {
    generate,
    isGenerating,
    error,
  };
}

/**
 * Hook for semantic job search
 */
export function useSemanticJobSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const semanticJobSearch = useMutation(api.ai.semanticJobSearch);

  const search = useCallback(
    async (userId: Id<"users">, searchQuery: string, limit?: number) => {
      setIsSearching(true);
      setError(null);

      try {
        const result = await semanticJobSearch({
          userId,
          searchQuery,
          limit,
        });
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsSearching(false);
      }
    },
    [semanticJobSearch]
  );

  return {
    search,
    isSearching,
    error,
  };
}

/**
 * Hook for job matching based on user profile
 */
export function useJobMatching() {
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const matchJobs = useMutation(api.rag.matchJobsToProfile);

  const match = useCallback(
    async (userId: Id<"users">, limit?: number) => {
      setIsMatching(true);
      setError(null);

      try {
        const result = await matchJobs({
          userId,
          limit,
        });
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsMatching(false);
      }
    },
    [matchJobs]
  );

  return {
    match,
    isMatching,
    error,
  };
}
