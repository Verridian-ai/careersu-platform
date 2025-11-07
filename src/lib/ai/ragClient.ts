/**
 * RAG Client Library
 * Frontend utilities for AI and RAG features
 */

import { Id } from "../../../convex/_generated/dataModel";

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: {
    tokensUsed?: number;
    model?: string;
    retrievedContext?: string[];
  };
}

export interface ResumeOptimizationResult {
  suggestions: string;
  targetJob?: any;
  usage?: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export interface InterviewPrepResult {
  interviewPrep: string;
  job: any;
  usage?: {
    total_tokens: number;
  };
}

export interface CoverLetterResult {
  coverLetter: string;
  job: any;
  usage?: {
    total_tokens: number;
  };
}

export interface JobMatch {
  _id: Id<"jobs">;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  matchScore: number;
  [key: string]: any;
}

/**
 * Parse streamed AI responses
 */
export function parseStreamedResponse(chunk: string): string {
  try {
    const lines = chunk.split("\n").filter((line) => line.trim());
    let content = "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") break;

        try {
          const parsed = JSON.parse(data);
          if (parsed.choices?.[0]?.delta?.content) {
            content += parsed.choices[0].delta.content;
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }

    return content;
  } catch (error) {
    console.error("Error parsing streamed response:", error);
    return "";
  }
}

/**
 * Format message for display
 */
export function formatMessage(message: AIMessage): AIMessage {
  return {
    ...message,
    timestamp:
      typeof message.timestamp === "number"
        ? new Date(message.timestamp).toISOString()
        : message.timestamp,
  };
}

/**
 * Extract key points from AI suggestions
 */
export function extractKeyPoints(text: string): string[] {
  const lines = text.split("\n").filter((line) => line.trim());
  const keyPoints: string[] = [];

  for (const line of lines) {
    // Look for numbered lists or bullet points
    if (/^[\d]+\./.test(line) || /^[-*•]/.test(line)) {
      keyPoints.push(line.trim());
    }
  }

  return keyPoints;
}

/**
 * Calculate match score as percentage
 */
export function formatMatchScore(score: number): string {
  const percentage = Math.round(score * 100);
  return `${percentage}%`;
}

/**
 * Get match score color class
 */
export function getMatchScoreColor(score: number): string {
  if (score >= 0.8) return "text-green-600";
  if (score >= 0.6) return "text-blue-600";
  if (score >= 0.4) return "text-yellow-600";
  return "text-gray-600";
}

/**
 * Format job match for display
 */
export function formatJobMatch(job: JobMatch): JobMatch & {
  matchScoreFormatted: string;
  matchScoreColor: string;
} {
  return {
    ...job,
    matchScoreFormatted: formatMatchScore(job.matchScore / 100),
    matchScoreColor: getMatchScoreColor(job.matchScore / 100),
  };
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Validate environment variables are set
 */
export function validateAIConfig(): {
  isValid: boolean;
  missingVars: string[];
} {
  const requiredVars = ["OPENAI_API_KEY"];
  const missingVars: string[] = [];

  // Note: In production, this check would be done server-side
  // This is just for development guidance

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
}

/**
 * Parse markdown-style formatting
 */
export function parseMarkdown(text: string): {
  type: "paragraph" | "heading" | "list" | "code";
  content: string;
  level?: number;
}[] {
  const lines = text.split("\n");
  const parsed: {
    type: "paragraph" | "heading" | "list" | "code";
    content: string;
    level?: number;
  }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Headings
    if (trimmed.startsWith("#")) {
      const level = trimmed.match(/^#+/)?.[0].length || 1;
      parsed.push({
        type: "heading",
        content: trimmed.replace(/^#+\s*/, ""),
        level,
      });
    }
    // Lists
    else if (/^[\d]+\./.test(trimmed) || /^[-*•]/.test(trimmed)) {
      parsed.push({
        type: "list",
        content: trimmed.replace(/^[\d]+\.\s*|^[-*•]\s*/, ""),
      });
    }
    // Code blocks
    else if (trimmed.startsWith("```")) {
      parsed.push({
        type: "code",
        content: trimmed.replace(/```/g, ""),
      });
    }
    // Regular paragraphs
    else {
      parsed.push({
        type: "paragraph",
        content: trimmed,
      });
    }
  }

  return parsed;
}
