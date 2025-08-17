import { z } from 'zod';
import {
  emailSchema,
  strongPasswordSchema,
  nameSchema,
  usernameSchema,
  termsAcceptanceSchema,
} from './common.schema';

/**
 * Authentication-related schemas
 * Used for login, signup, password reset forms
 */

// ============================================================================
// Login Schema
// ============================================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================================
// Sign Up Schema
// ============================================================================

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

export type SignUpFormData = z.infer<typeof signUpSchema>;

// ============================================================================
// Forgot Password Schema
// ============================================================================

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ============================================================================
// Reset Password Schema
// ============================================================================

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

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ============================================================================
// Change Password Schema
// ============================================================================

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

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// ============================================================================
// Email Verification Schema
// ============================================================================

export const emailVerificationSchema = z.object({
  code: z
    .string()
    .min(1, 'Verification code is required')
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only numbers'),
});

export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;

// ============================================================================
// Two-Factor Authentication Schema
// ============================================================================

export const twoFactorSchema = z.object({
  code: z
    .string()
    .min(1, 'Authentication code is required')
    .length(6, 'Authentication code must be 6 digits')
    .regex(/^\d{6}$/, 'Authentication code must contain only numbers'),
});

export type TwoFactorFormData = z.infer<typeof twoFactorSchema>;
