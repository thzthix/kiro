import { PathCoordinates, Point } from '../types';

/**
 * Calculate progress percentage from elapsed and total duration
 * Formula: (elapsed / total) × 100, clamped to [0, 100]
 */
export function calculateProgress(
  elapsed: number,
  totalDuration: number
): number {
  // Implementation will be added in Task 2.5 (GREEN phase)
  throw new Error('Not implemented yet');
}

/**
 * Format seconds to MM:SS with zero-padding
 */
export function formatTime(seconds: number): string {
  // Implementation will be added in Task 2.5 (GREEN phase)
  throw new Error('Not implemented yet');
}

/**
 * Map progress percentage to path coordinates
 */
export function calculatePosition(
  progress: number,
  pathCoordinates: PathCoordinates
): Point {
  // Implementation will be added in Task 2.5 (GREEN phase)
  throw new Error('Not implemented yet');
}
