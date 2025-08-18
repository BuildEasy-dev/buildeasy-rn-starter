import { z } from 'zod';
import {
  nameSchema,
  emailSchema,
  phoneSchema,
  urlSchema,
  optionalStringSchema,
  imageFileSchema,
} from '@/components/form/validation.schema';

/**
 * User profile-related schemas
 * @fileoverview Zod schemas for basic user profile information
 */

/**
 * Basic user profile validation schema
 * @description Validates core user profile information including name, contact details, and avatar
 * @example
 * ```typescript
 * const profile = profileSchema.parse({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john@example.com',
 *   phone: '+1234567890',
 *   bio: 'Software developer',
 *   location: 'San Francisco',
 *   website: 'https://johndoe.com'
 * });
 * ```
 */
export const profileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal('')),
  location: optionalStringSchema,
  website: urlSchema.optional().or(z.literal('')),
  avatar: imageFileSchema,
});

/**
 * Type definition for basic profile form data
 */
export type ProfileFormData = z.infer<typeof profileSchema>;
