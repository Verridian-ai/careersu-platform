import { v } from "convex/values";
import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

/**
 * AI Integration Functions
 * Handles LLM calls with streaming support for chat and AI features
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const DEFAULT_MODEL = "gpt-4o-mini"; // Fast and cost-effective
const ADVANCED_MODEL = "gpt-4o"; // For complex tasks

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Build system prompt with RAG context
 */
function buildSystemPrompt(context: any): string {
  let systemPrompt = `You are an expert AI Career Assistant for CareerSU, a career development platform.
You help job seekers with resume optimization, interview preparation, job search strategies, and career advice.

Be professional, encouraging, and provide actionable advice. Keep responses concise but informative.`;

  // Add user profile context
  if (context.userProfile) {
    systemPrompt += `\n\nUser Profile:
- Name: ${context.userProfile.name}
- Role: ${context.userProfile.role === 'job_seeker' ? 'Job Seeker' : 'Career Coach'}`;
  }

  // Add relevant documents context
  if (context.relevantDocuments && context.relevantDocuments.length > 0) {
    systemPrompt += `\n\nRelevant User Documents:`;
    context.relevantDocuments.forEach((doc: any, index: number) => {
      systemPrompt += `\n${index + 1}. ${doc.documentTitle} (${doc.documentType}):
${doc.chunkText.substring(0, 500)}...`;
    });
  }

  // Add career advice context
  if (context.careerAdvice && context.careerAdvice.length > 0) {
    systemPrompt += `\n\nRelevant Career Guidance:`;
    context.careerAdvice.forEach((advice: any, index: number) => {
      systemPrompt += `\n${index + 1}. ${advice.topic}:
${advice.content.substring(0, 300)}...`;
    });
  }

  return systemPrompt;
}

/**
 * Stream chat response from OpenAI
 */
export const streamChatResponse = action({
  args: {
    userId: v.id("users"),
    conversationId: v.id("conversations"),
    message: v.string(),
    useAdvancedModel: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    // Save user message
    await ctx.runMutation(api.messages.createMessage, {
      conversationId: args.conversationId,
      role: "user",
      content: args.message,
    });

    // Build RAG context
    const ragContext = await ctx.runAction(api.rag.buildRAGContext, {
      userId: args.userId,
      conversationId: args.conversationId,
      query: args.message,
    });

    // Build messages for the API
    const systemPrompt = buildSystemPrompt(ragContext);
    const conversationHistory = ragContext.conversationHistory.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
    ];

    // Call OpenAI with streaming
    const model = args.useAdvancedModel ? ADVANCED_MODEL : DEFAULT_MODEL;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false, // We'll handle streaming on the frontend
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    // Save assistant message
    await ctx.runMutation(api.messages.createMessage, {
      conversationId: args.conversationId,
      role: "assistant",
      content: assistantMessage,
      metadata: {
        tokensUsed: data.usage?.total_tokens,
        model,
        retrievedContext: ragContext.relevantDocuments.map(
          (doc: any) => doc.documentId
        ),
      },
    });

    return {
      message: assistantMessage,
      usage: data.usage,
    };
  },
});

/**
 * Optimize resume with AI
 */
export const optimizeResume = action({
  args: {
    documentId: v.id("documents"),
    targetJobId: v.optional(v.id("jobs")),
    focusAreas: v.optional(v.array(v.string())), // e.g., ["formatting", "keywords", "achievements"]
  },
  handler: async (ctx, args) => {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    // Get context for resume optimization
    const context = await ctx.runAction(api.rag.getResumeOptimizationContext, {
      documentId: args.documentId,
      jobId: args.targetJobId,
    });

    const focusAreas = args.focusAreas || [
      "formatting",
      "keywords",
      "achievements",
      "clarity",
    ];

    // Build prompt
    let prompt = `Analyze and suggest improvements for this resume:\n\n${context.document.content}\n\n`;

    if (context.targetJob) {
      prompt += `Target Job: ${context.targetJob.title} at ${context.targetJob.company}\n`;
      prompt += `Job Requirements: ${context.targetJob.requirements.join(", ")}\n\n`;
    }

    prompt += `Focus on these areas: ${focusAreas.join(", ")}.\n\n`;
    prompt += `Provide specific, actionable suggestions. Format your response as:
1. Overall Assessment (brief)
2. Key Strengths
3. Areas for Improvement (with specific examples)
4. Suggested Changes (concrete edits)
5. Keywords to Add (if targeting specific job)`;

    const messages: ChatMessage[] = [
      {
        role: "system",
        content:
          "You are an expert resume writer and career coach. Provide detailed, actionable feedback.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: ADVANCED_MODEL, // Use advanced model for quality analysis
        messages,
        temperature: 0.5, // Lower temperature for more focused suggestions
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${error}`);
    }

    const data = await response.json();

    return {
      suggestions: data.choices[0].message.content,
      targetJob: context.targetJob,
      usage: data.usage,
    };
  },
});

/**
 * Generate interview questions and prep based on job
 */
export const prepareForInterview = action({
  args: {
    userId: v.id("users"),
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    // Get context
    const context = await ctx.runAction(api.rag.getInterviewPrepContext, {
      userId: args.userId,
      jobId: args.jobId,
    });

    const prompt = `Generate interview preparation materials for this job:

Job: ${context.job.title} at ${context.job.company}
Description: ${context.job.description}
Requirements: ${context.job.requirements.join(", ")}

${context.resume ? `Candidate's Resume Summary:\n${context.resume.content.substring(0, 1000)}` : ""}

Provide:
1. 5 likely interview questions specific to this role
2. Suggested talking points based on the candidate's experience
3. Key skills to emphasize
4. Questions to ask the interviewer
5. Tips for this specific company/role`;

    const messages: ChatMessage[] = [
      {
        role: "system",
        content:
          "You are an expert career coach specializing in interview preparation.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: ADVANCED_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${error}`);
    }

    const data = await response.json();

    return {
      interviewPrep: data.choices[0].message.content,
      job: context.job,
      usage: data.usage,
    };
  },
});

/**
 * Generate personalized cover letter
 */
export const generateCoverLetter = action({
  args: {
    userId: v.id("users"),
    resumeId: v.id("documents"),
    jobId: v.id("jobs"),
    tone: v.optional(v.union(v.literal("professional"), v.literal("enthusiastic"), v.literal("creative"))),
  },
  handler: async (ctx, args) => {
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    const tone = args.tone || "professional";

    // Get resume and job
    const resume = await ctx.runQuery(api.documents.getDocument, {
      documentId: args.resumeId,
    });

    const job = await ctx.runQuery(api.jobs.getJob, {
      jobId: args.jobId,
    });

    if (!resume || !job) {
      throw new Error("Resume or job not found");
    }

    const prompt = `Generate a personalized cover letter:

Job: ${job.title} at ${job.company}
Location: ${job.location}
Job Description: ${job.description}
Requirements: ${job.requirements.join(", ")}

Candidate's Resume:
${resume.content}

Tone: ${tone}

Write a compelling cover letter that:
1. Opens with a strong hook
2. Highlights relevant experience from the resume
3. Connects skills to job requirements
4. Shows enthusiasm for the role and company
5. Ends with a clear call to action

Keep it to 3-4 paragraphs, professional but personable.`;

    const messages: ChatMessage[] = [
      {
        role: "system",
        content:
          "You are an expert at writing personalized, compelling cover letters that get interviews.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: ADVANCED_MODEL,
        messages,
        temperature: 0.8, // Slightly higher for creativity
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${error}`);
    }

    const data = await response.json();

    return {
      coverLetter: data.choices[0].message.content,
      job,
      usage: data.usage,
    };
  },
});

/**
 * Perform semantic job search
 */
export const semanticJobSearch = action({
  args: {
    userId: v.id("users"),
    searchQuery: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    // Generate embedding for search query
    const { embedding } = await ctx.runAction(api.embeddings.embedQuery, {
      query: args.searchQuery,
    });

    // Vector search for matching jobs
    const results = await ctx.vectorSearch("jobEmbeddings", "by_embedding", {
      vector: embedding,
      limit,
    });

    // Fetch full job details with match scores
    const jobs = await Promise.all(
      results.map(async (result) => {
        const job = await ctx.runQuery(api.jobs.getJob, {
          jobId: result.jobId,
        });
        return {
          ...job,
          matchScore: Math.round(result._score * 100), // Convert to percentage
        };
      })
    );

    return jobs;
  },
});
