import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

/**
 * Embedding Generation and Storage Functions
 * Handles creating embeddings for documents, jobs, and knowledge base content
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const EMBEDDING_MODEL = "text-embedding-3-small";
const CHUNK_SIZE = 800; // tokens (~500-1000 tokens as specified)
const CHUNK_OVERLAP = 100; // overlap for context continuity

/**
 * Generate embedding using OpenAI API
 */
async function generateEmbedding(text: string): Promise<number[]> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
      encoding_format: "float",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Chunk text into smaller pieces for embedding
 * Uses simple sentence-based chunking with overlap
 */
function chunkText(text: string, chunkSize: number = CHUNK_SIZE, overlap: number = CHUNK_OVERLAP): string[] {
  // Remove excessive whitespace
  const cleanText = text.replace(/\s+/g, ' ').trim();

  // Split by sentences (rough approximation)
  const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];

  const chunks: string[] = [];
  let currentChunk = "";
  let previousSentences: string[] = [];

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();

    // Rough token estimate (1 token ≈ 4 characters)
    const estimatedTokens = (currentChunk + trimmedSentence).length / 4;

    if (estimatedTokens > chunkSize && currentChunk.length > 0) {
      // Save current chunk
      chunks.push(currentChunk.trim());

      // Start new chunk with overlap (last few sentences)
      const overlapText = previousSentences.slice(-2).join(' ');
      currentChunk = overlapText + ' ' + trimmedSentence;
      previousSentences = [trimmedSentence];
    } else {
      currentChunk += ' ' + trimmedSentence;
      previousSentences.push(trimmedSentence);
    }
  }

  // Add the last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [cleanText];
}

/**
 * Embed a document (resume, cover letter, etc.)
 */
export const embedDocument = action({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    // Get the document
    const document = await ctx.runQuery(api.documents.getDocument, {
      documentId: args.documentId,
    });

    if (!document) {
      throw new Error("Document not found");
    }

    // Delete existing embeddings for this document
    await ctx.runMutation(internal.embeddings.deleteDocumentEmbeddings, {
      documentId: args.documentId,
    });

    // Chunk the document content
    const chunks = chunkText(document.content);

    // Generate embeddings for each chunk
    const embeddings = await Promise.all(
      chunks.map(async (chunk, index) => {
        const embedding = await generateEmbedding(chunk);
        return {
          documentId: args.documentId,
          userId: document.userId,
          chunkIndex: index,
          chunkText: chunk,
          embedding,
          metadata: {
            documentType: document.type,
            documentTitle: document.title,
            totalChunks: chunks.length,
          },
        };
      })
    );

    // Store embeddings in database
    for (const embeddingData of embeddings) {
      await ctx.runMutation(internal.embeddings.storeDocumentEmbedding, embeddingData);
    }

    return {
      success: true,
      chunksProcessed: chunks.length,
    };
  },
});

/**
 * Embed a job posting for semantic search
 */
export const embedJob = action({
  args: {
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    // Get the job
    const job = await ctx.runQuery(api.jobs.getJob, {
      jobId: args.jobId,
    });

    if (!job) {
      throw new Error("Job not found");
    }

    // Create a comprehensive text representation of the job
    const jobText = `
      Title: ${job.title}
      Company: ${job.company}
      Location: ${job.location}
      Type: ${job.type}
      Description: ${job.description}
      Requirements: ${job.requirements.join(", ")}
    `.trim();

    // Generate embedding
    const embedding = await generateEmbedding(jobText);

    // Store embedding
    await ctx.runMutation(internal.embeddings.storeJobEmbedding, {
      jobId: args.jobId,
      embedding,
      metadata: {
        title: job.title,
        company: job.company,
        location: job.location,
      },
    });

    return { success: true };
  },
});

/**
 * Embed career advice/knowledge base content
 */
export const embedKnowledgeBase = action({
  args: {
    topic: v.string(),
    content: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate embedding for the content
    const embedding = await generateEmbedding(args.content);

    // Store in knowledge base
    await ctx.runMutation(internal.embeddings.storeKnowledgeBaseEmbedding, {
      topic: args.topic,
      content: args.content,
      embedding,
      metadata: {
        category: args.category,
        tags: args.tags,
        source: args.source,
      },
    });

    return { success: true };
  },
});

/**
 * Generate embedding for a query (used in retrieval)
 */
export const embedQuery = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const embedding = await generateEmbedding(args.query);
    return { embedding };
  },
});

/**
 * Batch embed chat history for context retrieval
 */
export const embedChatHistory = action({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    // Get recent messages from the conversation
    const messages = await ctx.runQuery(api.messages.getConversationMessages, {
      conversationId: args.conversationId,
      limit: 10,
    });

    // Create a summary of the conversation
    const conversationSummary = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    // Generate embedding for the conversation context
    const embedding = await generateEmbedding(conversationSummary);

    return {
      embedding,
      messageCount: messages.length,
    };
  },
});

// Internal mutations for storing embeddings

export const deleteDocumentEmbeddings = internalAction({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.embeddingsMutations.deleteDocumentEmbeddingsInternal, args);
  },
});

export const storeDocumentEmbedding = internalAction({
  args: {
    documentId: v.id("documents"),
    userId: v.id("users"),
    chunkIndex: v.number(),
    chunkText: v.string(),
    embedding: v.array(v.float64()),
    metadata: v.object({
      documentType: v.string(),
      documentTitle: v.string(),
      totalChunks: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.embeddingsMutations.storeDocumentEmbeddingInternal, args);
  },
});

export const storeJobEmbedding = internalAction({
  args: {
    jobId: v.id("jobs"),
    embedding: v.array(v.float64()),
    metadata: v.object({
      title: v.string(),
      company: v.string(),
      location: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.embeddingsMutations.storeJobEmbeddingInternal, args);
  },
});

export const storeKnowledgeBaseEmbedding = internalAction({
  args: {
    topic: v.string(),
    content: v.string(),
    embedding: v.array(v.float64()),
    metadata: v.object({
      category: v.string(),
      tags: v.array(v.string()),
      source: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.embeddingsMutations.storeKnowledgeBaseEmbeddingInternal, args);
  },
});
