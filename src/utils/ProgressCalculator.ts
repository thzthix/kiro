import { PathCoordinates, Point } from '../types';

/**
 * Calculate progress percentage from elapsed and total duration.
 * Formula: (elapsed / total) × 100, clamped to [0, 100]
 * 
 * @param elapsed - Elapsed time in seconds
 * @param totalDuration - Total duration in seconds
 * @returns Progress percentage between 0 and 100
 */
export function calculateProgress(
  elapsed: number,
  totalDuration: number
): number {
  if (totalDuration <= 0) {
    return 0;
  }

  const rawProgress = (elapsed / totalDuration) * 100;
  return Math.min(100, Math.max(0, rawProgress));
}

/**
 * Format seconds to MM:SS with zero-padding.
 * Supports times up to 999:59 (59999 seconds).
 * 
 * @param seconds - Time in seconds (non-negative)
 * @returns Formatted time string in MM:SS format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${paddedMinutes}:${paddedSeconds}`;
}

/**
 * Map progress percentage to path coordinates using cubic Bezier curve.
 * 
 * @param progress - Progress percentage (0-100)
 * @param pathCoordinates - Path definition with start, end, and control points
 * @returns Point on the path corresponding to the progress
 */
export function calculatePosition(
  progress: number,
  pathCoordinates: PathCoordinates
): Point {
  const t = progress / 100; // Normalize to [0, 1]

  const { start, end, controlPoints } = pathCoordinates;

  // Cubic Bezier curve: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
  const oneMinusT = 1 - t;
  const oneMinusTSquared = oneMinusT * oneMinusT;
  const oneMinusTCubed = oneMinusTSquared * oneMinusT;
  const tSquared = t * t;
  const tCubed = tSquared * t;

  const x =
    oneMinusTCubed * start.x +
    3 * oneMinusTSquared * t * controlPoints[0].x +
    3 * oneMinusT * tSquared * controlPoints[1].x +
    tCubed * end.x;

  const y =
    oneMinusTCubed * start.y +
    3 * oneMinusTSquared * t * controlPoints[0].y +
    3 * oneMinusT * tSquared * controlPoints[1].y +
    tCubed * end.y;

  return { x, y };
}
