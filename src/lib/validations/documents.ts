/**
 * Document Validation Schemas
 *
 * Zod schemas for validating document-related forms.
 *
 * @example
 * ```tsx
 * import { documentSchema } from '@/lib/validations/documents'
 * ```
 */

import { z } from 'zod'

/**
 * Document creation/update schema
 */
export const documentSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  type: z.enum(['resume', 'cover_letter', 'portfolio'], {
    required_error: 'Please select a document type',
  }),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'final', 'archived']).default('draft'),
  tags: z.array(z.string()).optional(),
})

export type DocumentFormData = z.infer<typeof documentSchema>

/**
 * Document search/filter schema
 */
export const documentFilterSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['all', 'resume', 'cover_letter', 'portfolio']).default('all'),
  status: z.enum(['all', 'draft', 'final', 'archived']).default('all'),
  sortBy: z.enum(['lastModified', 'title', 'createdDate']).default('lastModified'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type DocumentFilterData = z.infer<typeof documentFilterSchema>

/**
 * Document export settings schema
 */
export const documentExportSchema = z.object({
  format: z.enum(['pdf', 'docx', 'txt']),
  includeMetadata: z.boolean().default(false),
  paperSize: z.enum(['a4', 'letter']).default('a4'),
  margins: z.enum(['normal', 'narrow', 'wide']).default('normal'),
})

export type DocumentExportData = z.infer<typeof documentExportSchema>
