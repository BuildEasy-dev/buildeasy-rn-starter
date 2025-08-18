/**
 * Schema exports
 * @fileoverview Central export point for all Zod validation schemas
 */

/**
 * Authentication schemas
 * @description Exports login, signup, password reset, and other auth-related schemas
 */
export * from './auth.schema';

/**
 * Profile schemas
 * @description Exports user profile, settings, and preference validation schemas
 */
export * from './profile.schema';

/**
 * Re-export Zod for convenience
 * @description Provides direct access to Zod library from schema index
 */
export { z } from 'zod';
