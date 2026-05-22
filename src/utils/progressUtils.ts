/**
 * Progress Utility Functions
 * Feature: turtle-study-app
 * Task: 8.5 Refactor display components (REFACTOR)
 * 
 * Shared utility functions for progress-related calculations and validations.
 */

/**
 * Clamps progress value to valid range [0, 100]
 * Handles invalid inputs (NaN, undefined, null) by returning 0
 * 
 * @param progress - Raw progress value
 * @returns Clamped progress value between 0 and 100
 */
export function clampProgress(progress: number): number {
  if (typeof progress !== 'number' || isNaN(progress)) {
    return 0;
  }
  return Math.max(0, Math.min(100, progress));
}

/**
 * Formats progress value as percentage string
 * 
 * @param progress - Progress value (0-100)
 * @returns Formatted percentage string (e.g., "50%")
 */
export function formatProgressPercentage(progress: number): string {
  return `${progress}%`;
}

/**
 * Sanitizes seconds input to handle edge cases
 * Ensures non-negative integer seconds
 * 
 * @param seconds - Raw seconds value
 * @returns Sanitized non-negative integer seconds
 */
export function sanitizeSeconds(seconds: number): number {
  if (isNaN(seconds) || seconds < 0) {
    return 0;
  }
  return Math.floor(seconds);
}

/**
 * Creates accessibility label with readable time information
 * 
 * @param seconds - Time in seconds
 * @returns Accessibility label string describing remaining time
 */
export function createTimeAccessibilityLabel(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds} seconds remaining`;
  }
  
  if (remainingSeconds === 0) {
    return `${minutes} minutes remaining`;
  }
  
  return `${minutes} minutes and ${remainingSeconds} seconds remaining`;
}
