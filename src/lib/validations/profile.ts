/**
 * Profile and User Data Validation Schemas
 *
 * Zod schemas for validating user profile and settings forms.
 *
 * @example
 * ```tsx
 * import { profileSchema } from '@/lib/validations/profile'
 *
 * const result = profileSchema.safeParse(formData)
 * ```
 */

import { z } from 'zod'

/**
 * Profile update validation schema
 */
export const profileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  phone: z
    .string()
    .regex(/^[\d\s()+-]*$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .max(100, 'Location must be less than 100 characters')
    .optional(),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  linkedin: z
    .string()
    .url('Please enter a valid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  github: z
    .string()
    .url('Please enter a valid GitHub URL')
    .optional()
    .or(z.literal('')),
})

export type ProfileFormData = z.infer<typeof profileSchema>

/**
 * Job seeker profile schema
 */
export const jobSeekerProfileSchema = profileSchema.extend({
  skills: z.array(z.string()).min(1, 'Please add at least one skill'),
  experience: z.array(
    z.object({
      title: z.string().min(1, 'Job title is required'),
      company: z.string().min(1, 'Company name is required'),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().optional(),
      current: z.boolean().optional(),
      description: z.string().optional(),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string().min(1, 'Degree is required'),
      institution: z.string().min(1, 'Institution is required'),
      year: z.string().min(1, 'Year is required'),
      field: z.string().optional(),
    })
  ),
  jobPreferences: z.object({
    desiredRoles: z.array(z.string()),
    desiredLocations: z.array(z.string()),
    salaryMin: z.number().optional(),
    salaryMax: z.number().optional(),
    jobType: z.array(z.enum(['full-time', 'part-time', 'contract', 'remote'])),
  }),
})

export type JobSeekerProfileData = z.infer<typeof jobSeekerProfileSchema>

/**
 * Coach profile schema
 */
export const coachProfileSchema = profileSchema.extend({
  specializations: z
    .array(z.string())
    .min(1, 'Please add at least one specialization'),
  certifications: z.array(
    z.object({
      name: z.string().min(1, 'Certification name is required'),
      issuer: z.string().min(1, 'Issuer is required'),
      year: z.string().min(1, 'Year is required'),
    })
  ),
  hourlyRate: z
    .number()
    .min(0, 'Rate must be positive')
    .optional(),
  availability: z.object({
    timezone: z.string(),
    schedule: z.array(
      z.object({
        day: z.string(),
        slots: z.array(z.string()),
      })
    ),
  }),
})

export type CoachProfileData = z.infer<typeof coachProfileSchema>

/**
 * Settings update schema
 */
export const settingsSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'connections']),
    showEmail: z.boolean(),
    showPhone: z.boolean(),
  }),
  preferences: z.object({
    language: z.string(),
    timezone: z.string(),
    theme: z.enum(['light', 'dark', 'system']),
  }),
})

export type SettingsFormData = z.infer<typeof settingsSchema>
