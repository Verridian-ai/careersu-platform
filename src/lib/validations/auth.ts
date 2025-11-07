/**
 * Authentication Form Validation Schemas
 *
 * Zod schemas for validating authentication-related forms.
 * Provides type-safe validation for login, signup, and password reset.
 *
 * @example
 * ```tsx
 * import { loginSchema } from '@/lib/validations/auth'
 *
 * const result = loginSchema.safeParse(formData)
 * if (!result.success) {
 *   console.error(result.error.flatten())
 * }
 * ```
 */

import { z } from 'zod'

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Signup form validation schema
 */
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['job_seeker', 'coach'], {
      required_error: 'Please select a role',
    }),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, 'You must accept the terms and conditions'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignupFormData = z.infer<typeof signupSchema>

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>

/**
 * Password reset schema
 */
export const passwordResetSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type PasswordResetData = z.infer<typeof passwordResetSchema>

/**
 * Email change schema
 */
export const emailChangeSchema = z.object({
  newEmail: z
    .string()
    .min(1, 'New email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required for email change'),
})

export type EmailChangeData = z.infer<typeof emailChangeSchema>
