/**
 * ErrorHandler - Centralized error handling utilities
 * 
 * Provides consistent error logging and handling across the application.
 * Supports graceful degradation and session state preservation.
 */

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  /** Informational warnings that don't affect functionality */
  WARN = 'warn',
  /** Errors that affect functionality but allow graceful degradation */
  ERROR = 'error',
  /** Critical errors that may require user intervention */
  CRITICAL = 'critical',
}

/**
 * Error context for better debugging
 */
export interface ErrorContext {
  component?: string;
  operation?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log an error with consistent formatting
 * 
 * @param message - Human-readable error message
 * @param error - Error object or unknown error
 * @param severity - Error severity level
 * @param context - Additional context for debugging
 */
export function logError(
  message: string,
  error: unknown,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  context?: ErrorContext
): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const contextStr = context
    ? ` [${context.component || 'Unknown'}${context.operation ? `:${context.operation}` : ''}]`
    : '';

  const fullMessage = `${message}${contextStr}: ${errorMessage}`;

  if (severity === ErrorSeverity.WARN) {
    console.warn(fullMessage);
  } else {
    console.error(fullMessage);
  }

  // Log metadata if available
  if (context?.metadata) {
    console.error('Error metadata:', context.metadata);
  }
}

/**
 * Log a warning with consistent formatting
 * 
 * @param message - Human-readable warning message
 * @param context - Additional context for debugging
 */
export function logWarning(message: string, context?: ErrorContext): void {
  const contextStr = context
    ? ` [${context.component || 'Unknown'}${context.operation ? `:${context.operation}` : ''}]`
    : '';

  console.warn(`${message}${contextStr}`);

  // Log metadata if available
  if (context?.metadata) {
    console.warn('Warning metadata:', context.metadata);
  }
}

/**
 * Handle animation errors with fallback behavior
 * 
 * @param error - Animation error
 * @param fallback - Fallback function to execute
 * @param context - Error context
 */
export function handleAnimationError(
  error: unknown,
  fallback: () => void,
  context?: ErrorContext
): void {
  logError('Animation error', error, ErrorSeverity.ERROR, {
    ...context,
    component: context?.component || 'Animation',
  });

  try {
    fallback();
  } catch (fallbackError) {
    logError(
      'Fallback operation failed',
      fallbackError,
      ErrorSeverity.CRITICAL,
      {
        ...context,
        component: context?.component || 'Animation',
        operation: 'fallback',
      }
    );
  }
}

/**
 * Handle image load errors with graceful degradation
 * 
 * @param error - Image load error
 * @param imageName - Name of the image that failed to load
 * @param context - Error context
 */
export function handleImageLoadError(
  error: unknown,
  imageName: string,
  context?: ErrorContext
): void {
  logError(`Image load error: ${imageName}`, error, ErrorSeverity.ERROR, {
    ...context,
    component: context?.component || 'Image',
    metadata: {
      ...context?.metadata,
      imageName,
    },
  });
}

/**
 * Handle invalid state with warning and default value
 * 
 * @param message - Warning message
 * @param defaultValue - Default value to return
 * @param context - Error context
 * @returns Default value
 */
export function handleInvalidState<T>(
  message: string,
  defaultValue: T,
  context?: ErrorContext
): T {
  logWarning(message, context);
  return defaultValue;
}

/**
 * Handle timer operation errors gracefully
 * 
 * @param operation - Timer operation name
 * @param timerId - Timer ID
 * @param reason - Reason for the error
 * @param context - Error context
 */
export function handleTimerError(
  operation: string,
  timerId: string,
  reason: string,
  context?: ErrorContext
): void {
  logWarning(`Timer ${operation} failed: ${reason}`, {
    ...context,
    component: context?.component || 'TimerService',
    operation,
    metadata: {
      ...context?.metadata,
      timerId,
      reason,
    },
  });
}

/**
 * Validate and handle invalid input
 * 
 * @param condition - Validation condition
 * @param message - Error message if validation fails
 * @param context - Error context
 * @returns True if valid, false if invalid
 */
export function validateInput(
  condition: boolean,
  message: string,
  context?: ErrorContext
): boolean {
  if (!condition) {
    logWarning(message, context);
    return false;
  }
  return true;
}
