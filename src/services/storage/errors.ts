/**
 * Custom error types for storage operations.
 * Provides typed, contextual errors for better debugging and error handling.
 */

/**
 * Base class for all storage-related errors.
 * Contains key context information like storage tier, operation, and key.
 */
export class StorageError extends Error {
  public readonly tier: 'preferences' | 'cache' | 'secure' | 'temp' | 'manager';
  public readonly operation: string;
  public readonly key?: string;
  public readonly cause?: Error;

  constructor(
    message: string,
    options: {
      tier: 'preferences' | 'cache' | 'secure' | 'temp' | 'manager';
      operation: string;
      key?: string;
      cause?: Error;
    }
  ) {
    super(message);
    this.name = 'StorageError';
    this.tier = options.tier;
    this.operation = options.operation;
    this.key = options.key;
    this.cause = options.cause;

    // Append the original error's stack trace for better debugging
    if (options.cause?.stack) {
      this.stack = `${this.stack}
Caused by: ${options.cause.stack}`;
    }
  }
}

/**
 * Thrown when storage service initialization fails, typically due to encryption key issues.
 */
export class InitializationError extends StorageError {
  constructor(message: string, options: { tier: 'secure' | 'manager'; cause?: Error }) {
    super(message, { ...options, operation: 'initialize' });
    this.name = 'InitializationError';
  }
}

/**
 * Thrown when encryption, decryption, or key management operations fail.
 */
export class EncryptionError extends StorageError {
  constructor(
    message: string,
    options: {
      operation: 'key_generation' | 'key_retrieval' | 'encryption' | 'decryption';
      cause?: Error;
    }
  ) {
    super(message, { ...options, tier: 'secure' });
    this.name = 'EncryptionError';
  }
}

/**
 * Thrown when JSON.stringify serialization fails.
 */
export class SerializationError extends StorageError {
  constructor(key: string, tier: StorageError['tier'], cause: Error) {
    super(`Failed to serialize value for key "${key}" in tier "${tier}".`, {
      tier,
      operation: 'serialize',
      key,
      cause,
    });
    this.name = 'SerializationError';
  }
}

/**
 * Thrown when JSON.parse deserialization fails, typically indicating data corruption.
 */
export class DeserializationError extends StorageError {
  constructor(key: string, tier: StorageError['tier'], cause: Error) {
    super(
      `Failed to deserialize value for key "${key}" in tier "${tier}". Data may be corrupted.`,
      {
        tier,
        operation: 'deserialize',
        key,
        cause,
      }
    );
    this.name = 'DeserializationError';
  }
}

/**
 * Thrown when underlying native MMKV read/write operations fail.
 */
export class IOError extends StorageError {
  constructor(
    message: string,
    options: {
      tier: StorageError['tier'];
      operation: string;
      key?: string;
      cause?: Error;
    }
  ) {
    super(message, options);
    this.name = 'IOError';
  }
}
