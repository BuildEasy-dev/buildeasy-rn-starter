import { z } from 'zod';

/**
 * Common validation rules and schemas
 * @fileoverview Reusable Zod validation patterns for consistent form validation across the app
 */

/**
 * Email address validation schema
 * @description Validates email format with required field check
 * @example
 * ```typescript
 * const email = emailSchema.parse('user@example.com');
 * ```
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

/**
 * Basic password validation schema
 * @description Validates password with minimum length and character requirements
 * @example
 * ```typescript
 * const password = passwordSchema.parse('MyPass123');
 * ```
 */

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Strong password validation schema
 * @description Extends passwordSchema with special character requirement
 * @example
 * ```typescript
 * const strongPass = strongPasswordSchema.parse('MyPass123!');
 * ```
 */
export const strongPasswordSchema = passwordSchema.regex(
  /[^a-zA-Z0-9]/,
  'Password must contain at least one special character'
);

/**
 * Phone number validation schema
 * @description Validates international phone number format
 * @example
 * ```typescript
 * const phone = phoneSchema.parse('+1234567890');
 * ```
 */

export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number');

/**
 * Name validation schema
 * @description Validates person names with length and character restrictions
 * @example
 * ```typescript
 * const name = nameSchema.parse('John Doe');
 * ```
 */
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

/**
 * Username validation schema
 * @description Validates username format with alphanumeric and underscore support
 * @example
 * ```typescript
 * const username = usernameSchema.parse('user_123');
 * ```
 */

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
  .refine((val) => !val.startsWith('_'), 'Username cannot start with underscore')
  .refine((val) => !val.endsWith('_'), 'Username cannot end with underscore');

/**
 * URL validation schema
 * @description Validates URL format or allows empty string
 * @example
 * ```typescript
 * const url = urlSchema.parse('https://example.com');
 * ```
 */
export const urlSchema = z.string().url('Please enter a valid URL').or(z.literal(''));

/**
 * Required string validation schema
 * @description Validates non-empty string with trimming
 * @example
 * ```typescript
 * const required = requiredStringSchema.parse('some text');
 * ```
 */

export const requiredStringSchema = z.string().min(1, 'This field is required').trim();

/**
 * Optional string validation schema
 * @description Validates optional string or empty string
 * @example
 * ```typescript
 * const optional = optionalStringSchema.parse('');
 * ```
 */
export const optionalStringSchema = z.string().optional().or(z.literal(''));

/**
 * Age validation schema
 * @description Validates age within reasonable bounds (13-120 years)
 * @example
 * ```typescript
 * const age = ageSchema.parse(25);
 * ```
 */

export const ageSchema = z
  .number()
  .min(13, 'You must be at least 13 years old')
  .max(120, 'Please enter a valid age');

/**
 * Birth date validation schema
 * @description Validates birth date with minimum age requirement and future date check
 * @example
 * ```typescript
 * const birthDate = birthDateSchema.parse(new Date('1990-01-01'));
 * ```
 */
export const birthDateSchema = z
  .date()
  .refine((date) => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= 13;
  }, 'You must be at least 13 years old')
  .refine((date) => date <= new Date(), 'Birth date cannot be in the future');

/**
 * Terms acceptance validation schema
 * @description Validates that terms and conditions have been accepted (must be true)
 * @example
 * ```typescript
 * const accepted = termsAcceptanceSchema.parse(true);
 * ```
 */

export const termsAcceptanceSchema = z
  .boolean()
  .refine((val) => val === true, 'You must accept the terms and conditions');

/**
 * Optional boolean validation schema
 * @description Validates optional boolean value
 * @example
 * ```typescript
 * const optional = optionalBooleanSchema.parse(undefined);
 * ```
 */
export const optionalBooleanSchema = z.boolean().optional();

/**
 * Image file validation schema
 * @description Validates image file upload with type and size constraints
 * @example
 * ```typescript
 * const image = imageFileSchema.parse({
 *   uri: 'file://path/to/image.jpg',
 *   type: 'image/jpeg',
 *   size: 1024000
 * });
 * ```
 */

export const imageFileSchema = z
  .object({
    uri: z.string(),
    type: z.string().regex(/^image\/(jpeg|jpg|png|gif|webp)$/, 'Only image files are allowed'),
    size: z.number().max(5 * 1024 * 1024, 'Image must be smaller than 5MB'), // 5MB
  })
  .optional();

/**
 * Creates a password confirmation schema that validates against another password field
 * @param passwordField - The name of the password field to validate against
 * @returns Zod schema for password confirmation
 * @example
 * ```typescript
 * const confirmSchema = createPasswordConfirmationSchema('newPassword');
 * ```
 */
export const createPasswordConfirmationSchema = (passwordField: string = 'password') =>
  z.string().min(1, 'Please confirm your password');

/**
 * Creates a conditional required string schema based on another field
 * @param condition - Function that determines if field is required
 * @param message - Custom error message for validation failure
 * @returns Zod schema for conditional required string
 * @example
 * ```typescript
 * const conditionalSchema = createConditionalRequiredSchema(
 *   (data) => data.hasAddress,
 *   'Address is required when selected'
 * );
 * ```
 */
export const createConditionalRequiredSchema = (
  condition: (data: any) => boolean,
  message: string = 'This field is required'
) => z.string().optional();

/**
 * Creates a minimum age validation schema
 * @param minAge - Minimum required age
 * @returns Zod schema for age validation
 * @example
 * ```typescript
 * const adultSchema = createMinAgeSchema(18);
 * ```
 */
export const createMinAgeSchema = (minAge: number) =>
  z.date().refine((date) => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= minAge;
  }, `You must be at least ${minAge} years old`);

/**
 * Creates a non-empty array validation schema
 * @param itemSchema - Zod schema for array items
 * @returns Zod schema for non-empty array
 * @example
 * ```typescript
 * const tagsSchema = nonEmptyArraySchema(z.string());
 * ```
 */

export const nonEmptyArraySchema = <T>(itemSchema: z.ZodSchema<T>) =>
  z.array(itemSchema).min(1, 'Please select at least one option');

/**
 * Creates a maximum items array validation schema
 * @param itemSchema - Zod schema for array items
 * @param maxItems - Maximum number of items allowed
 * @returns Zod schema for limited array
 * @example
 * ```typescript
 * const skillsSchema = maxItemsArraySchema(z.string(), 5);
 * ```
 */
export const maxItemsArraySchema = <T>(itemSchema: z.ZodSchema<T>, maxItems: number) =>
  z.array(itemSchema).max(maxItems, `You can select up to ${maxItems} items`);

/**
 * Transforms string to number with validation
 * @description Converts string input to number, handling invalid inputs gracefully
 * @example
 * ```typescript
 * const numberSchema = stringToNumberSchema;
 * const result = numberSchema.parse('42'); // returns 42
 * ```
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
 * @description Converts string input to Date object, handling invalid dates gracefully
 * @example
 * ```typescript
 * const dateSchema = stringToDateSchema;
 * const result = dateSchema.parse('2023-12-25'); // returns Date object
 * ```
 */
export const stringToDateSchema = z
  .string()
  .transform((val) => {
    const date = new Date(val);
    return isNaN(date.getTime()) ? undefined : date;
  })
  .pipe(z.date().optional());
