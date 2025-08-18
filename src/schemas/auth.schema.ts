import { z } from 'zod';
import {
  emailSchema,
  strongPasswordSchema,
  nameSchema,
  usernameSchema,
  termsAcceptanceSchema,
} from '@/components/form/validation.schema';

/**
 * Authentication-related schemas
 * @fileoverview Zod schemas for authentication flows including login, signup, password reset, etc.
 */

/**
 * Login form validation schema
 * @description Validates user login credentials with email and password
 * @example
 * ```typescript
 * const loginData = loginSchema.parse({
 *   email: 'user@example.com',
 *   password: 'password123',
 *   rememberMe: true
 * });
 * ```
 */

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

/**
 * Type definition for login form data
 */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * User registration form validation schema
 * @description Validates new user registration with password confirmation
 * @example
 * ```typescript
 * const signUpData = signUpSchema.parse({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   username: 'johndoe',
 *   email: 'john@example.com',
 *   password: 'SecurePass123!',
 *   confirmPassword: 'SecurePass123!',
 *   acceptTerms: true,
 *   subscribeNewsletter: false
 * });
 * ```
 */

export const signUpSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    username: usernameSchema,
    email: emailSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: termsAcceptanceSchema,
    subscribeNewsletter: z.boolean().optional().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Type definition for sign up form data
 */
export type SignUpFormData = z.infer<typeof signUpSchema>;

/**
 * Forgot password form validation schema
 * @description Validates email for password reset request
 * @example
 * ```typescript
 * const forgotData = forgotPasswordSchema.parse({
 *   email: 'user@example.com'
 * });
 * ```
 */

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Type definition for forgot password form data
 */
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password form validation schema
 * @description Validates password reset with verification code and new password confirmation
 * @example
 * ```typescript
 * const resetData = resetPasswordSchema.parse({
 *   code: '123456',
 *   newPassword: 'NewSecurePass123!',
 *   confirmPassword: 'NewSecurePass123!'
 * });
 * ```
 */

export const resetPasswordSchema = z
  .object({
    code: z
      .string()
      .min(1, 'Verification code is required')
      .length(6, 'Verification code must be 6 digits')
      .regex(/^\d{6}$/, 'Verification code must contain only numbers'),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Type definition for reset password form data
 */
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Change password form validation schema
 * @description Validates password change with current password verification
 * @example
 * ```typescript
 * const changeData = changePasswordSchema.parse({
 *   currentPassword: 'OldPass123!',
 *   newPassword: 'NewPass123!',
 *   confirmPassword: 'NewPass123!'
 * });
 * ```
 */

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

/**
 * Type definition for change password form data
 */
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

/**
 * Email verification form validation schema
 * @description Validates 6-digit verification code for email confirmation
 * @example
 * ```typescript
 * const verificationData = emailVerificationSchema.parse({
 *   code: '123456'
 * });
 * ```
 */

export const emailVerificationSchema = z.object({
  code: z
    .string()
    .min(1, 'Verification code is required')
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only numbers'),
});

/**
 * Type definition for email verification form data
 */
export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;

/**
 * Two-factor authentication form validation schema
 * @description Validates 6-digit 2FA authentication code
 * @example
 * ```typescript
 * const twoFactorData = twoFactorSchema.parse({
 *   code: '123456'
 * });
 * ```
 */

export const twoFactorSchema = z.object({
  code: z
    .string()
    .min(1, 'Authentication code is required')
    .length(6, 'Authentication code must be 6 digits')
    .regex(/^\d{6}$/, 'Authentication code must contain only numbers'),
});

/**
 * Type definition for two-factor authentication form data
 */
export type TwoFactorFormData = z.infer<typeof twoFactorSchema>;
