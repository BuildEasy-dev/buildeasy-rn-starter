import { z } from 'zod';
import {
  nameSchema,
  emailSchema,
  phoneSchema,
  urlSchema,
  optionalStringSchema,
  birthDateSchema,
  imageFileSchema,
} from './common.schema';

/**
 * User profile-related schemas
 * Used for profile editing, preferences, and settings forms
 */

// ============================================================================
// Basic Profile Schema
// ============================================================================

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

export type ProfileFormData = z.infer<typeof profileSchema>;

// ============================================================================
// Extended Profile Schema
// ============================================================================

export const extendedProfileSchema = profileSchema.extend({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  birthDate: birthDateSchema.optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  occupation: optionalStringSchema,
  company: optionalStringSchema,
  timezone: z.string().optional(),
  language: z.enum(['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko']).default('en'),
});

export type ExtendedProfileFormData = z.infer<typeof extendedProfileSchema>;

// ============================================================================
// Privacy Settings Schema
// ============================================================================

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'friends', 'private']).default('public'),
  showEmail: z.boolean().default(false),
  showPhone: z.boolean().default(false),
  showBirthDate: z.boolean().default(false),
  allowMessages: z.boolean().default(true),
  allowFriendRequests: z.boolean().default(true),
  searchable: z.boolean().default(true),
  showOnlineStatus: z.boolean().default(true),
});

export type PrivacySettingsFormData = z.infer<typeof privacySettingsSchema>;

// ============================================================================
// Notification Preferences Schema
// ============================================================================

export const notificationPreferencesSchema = z.object({
  // Email notifications
  emailNotifications: z.boolean().default(true),
  emailMarketing: z.boolean().default(false),
  emailUpdates: z.boolean().default(true),
  emailDigest: z.enum(['never', 'daily', 'weekly', 'monthly']).default('weekly'),

  // Push notifications
  pushNotifications: z.boolean().default(true),
  pushMessages: z.boolean().default(true),
  pushFriendRequests: z.boolean().default(true),
  pushLikes: z.boolean().default(true),
  pushComments: z.boolean().default(true),

  // In-app notifications
  soundEnabled: z.boolean().default(true),
  vibrationEnabled: z.boolean().default(true),
  badgeCount: z.boolean().default(true),
});

export type NotificationPreferencesFormData = z.infer<typeof notificationPreferencesSchema>;

// ============================================================================
// Contact Information Schema
// ============================================================================

export const contactInfoSchema = z.object({
  primaryEmail: emailSchema,
  secondaryEmail: emailSchema.optional().or(z.literal('')),
  primaryPhone: phoneSchema,
  secondaryPhone: phoneSchema.optional().or(z.literal('')),
  address: z
    .object({
      street: z.string().min(1, 'Street address is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      zipCode: z
        .string()
        .min(1, 'ZIP code is required')
        .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
      country: z.string().min(1, 'Country is required'),
    })
    .optional(),
  emergencyContact: z
    .object({
      name: nameSchema,
      relationship: z.string().min(1, 'Relationship is required'),
      phone: phoneSchema,
      email: emailSchema.optional().or(z.literal('')),
    })
    .optional(),
});

export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;

// ============================================================================
// Account Settings Schema
// ============================================================================

export const accountSettingsSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: emailSchema,
  twoFactorEnabled: z.boolean().default(false),
  sessionTimeout: z.enum(['15m', '30m', '1h', '4h', '8h', 'never']).default('4h'),
  loginNotifications: z.boolean().default(true),
  passwordChangeNotifications: z.boolean().default(true),
  suspiciousActivityAlerts: z.boolean().default(true),
});

export type AccountSettingsFormData = z.infer<typeof accountSettingsSchema>;

// ============================================================================
// Social Links Schema
// ============================================================================

export const socialLinksSchema = z.object({
  twitter: urlSchema.optional().or(z.literal('')),
  facebook: urlSchema.optional().or(z.literal('')),
  instagram: urlSchema.optional().or(z.literal('')),
  linkedin: urlSchema.optional().or(z.literal('')),
  github: urlSchema.optional().or(z.literal('')),
  youtube: urlSchema.optional().or(z.literal('')),
  tiktok: urlSchema.optional().or(z.literal('')),
  discord: z
    .string()
    .regex(/^.{3,32}#[0-9]{4}$|^$/, 'Invalid Discord username format (username#1234)')
    .optional()
    .or(z.literal('')),
});

export type SocialLinksFormData = z.infer<typeof socialLinksSchema>;
