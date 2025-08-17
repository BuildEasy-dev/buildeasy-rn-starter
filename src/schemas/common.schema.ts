import { z } from 'zod';

/**
 * Common validation rules and schemas
 * Reusable validation patterns for consistent validation across the app
 */

// ============================================================================
// Basic field validations
// ============================================================================

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const strongPasswordSchema = passwordSchema.regex(
  /[^a-zA-Z0-9]/,
  'Password must contain at least one special character'
);

export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number');

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
  .refine((val) => !val.startsWith('_'), 'Username cannot start with underscore')
  .refine((val) => !val.endsWith('_'), 'Username cannot end with underscore');

export const urlSchema = z.string().url('Please enter a valid URL').or(z.literal(''));

export const requiredStringSchema = z.string().min(1, 'This field is required').trim();

export const optionalStringSchema = z.string().optional().or(z.literal(''));

// ============================================================================
// Age and date validations
// ============================================================================

export const ageSchema = z
  .number()
  .min(13, 'You must be at least 13 years old')
  .max(120, 'Please enter a valid age');

export const birthDateSchema = z
  .date()
  .refine((date) => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= 13;
  }, 'You must be at least 13 years old')
  .refine((date) => date <= new Date(), 'Birth date cannot be in the future');

// ============================================================================
// Terms and conditions
// ============================================================================

export const termsAcceptanceSchema = z
  .boolean()
  .refine((val) => val === true, 'You must accept the terms and conditions');

export const optionalBooleanSchema = z.boolean().optional();

// ============================================================================
// File upload validations
// ============================================================================

export const imageFileSchema = z
  .object({
    uri: z.string(),
    type: z.string().regex(/^image\/(jpeg|jpg|png|gif|webp)$/, 'Only image files are allowed'),
    size: z.number().max(5 * 1024 * 1024, 'Image must be smaller than 5MB'), // 5MB
  })
  .optional();

// ============================================================================
// Custom validation helpers
// ============================================================================

/**
 * Creates a password confirmation schema that validates against another password field
 */
export const createPasswordConfirmationSchema = (passwordField: string = 'password') =>
  z.string().min(1, 'Please confirm your password');

/**
 * Creates a conditional required string schema based on another field
 */
export const createConditionalRequiredSchema = (
  condition: (data: any) => boolean,
  message: string = 'This field is required'
) => z.string().optional();

/**
 * Creates a minimum age validation schema
 */
export const createMinAgeSchema = (minAge: number) =>
  z.date().refine((date) => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= minAge;
  }, `You must be at least ${minAge} years old`);

// ============================================================================
// Array validations
// ============================================================================

export const nonEmptyArraySchema = <T>(itemSchema: z.ZodSchema<T>) =>
  z.array(itemSchema).min(1, 'Please select at least one option');

export const maxItemsArraySchema = <T>(itemSchema: z.ZodSchema<T>, maxItems: number) =>
  z.array(itemSchema).max(maxItems, `You can select up to ${maxItems} items`);

// ============================================================================
// Transform helpers
// ============================================================================

/**
 * Transforms string to number with validation
 */
export const stringToNumberSchema = z
  .string()
  .transform((val) => {
    const num = parseFloat(val);
    return isNaN(num) ? undefined : num;
  })
  .pipe(z.number().optional());

/**
 * Transforms string to date with validation
 */
export const stringToDateSchema = z
  .string()
  .transform((val) => {
    const date = new Date(val);
    return isNaN(date.getTime()) ? undefined : date;
  })
  .pipe(z.date().optional());
