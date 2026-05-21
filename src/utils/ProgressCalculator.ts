import { PathCoordinates, Point } from '../types';

// Time formatting constants
const SECONDS_PER_MINUTE = 60;
const TIME_COMPONENT_PADDING = 2;

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
  return clamp(rawProgress, 0, 100);
}

/**
 * Format seconds to MM:SS with zero-padding.
 * Supports times up to 999:59 (59999 seconds).
 * 
 * @param seconds - Time in seconds (non-negative)
 * @returns Formatted time string in MM:SS format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const remainingSeconds = seconds % SECONDS_PER_MINUTE;

  return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
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

  return cubicBezier(t, start, controlPoints[0], controlPoints[1], end);
}

/**
 * Clamp a value between min and max.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Pad a number with leading zeros to specified length.
 */
function padZero(value: number): string {
  return value.toString().padStart(TIME_COMPONENT_PADDING, '0');
}

/**
 * Calculate point on cubic Bezier curve.
 * Formula: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
 */
function cubicBezier(
  t: number,
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point
): Point {
  const oneMinusT = 1 - t;
  const oneMinusTSquared = oneMinusT * oneMinusT;
  const oneMinusTCubed = oneMinusTSquared * oneMinusT;
  const tSquared = t * t;
  const tCubed = tSquared * t;

  const x =
    oneMinusTCubed * p0.x +
    3 * oneMinusTSquared * t * p1.x +
    3 * oneMinusT * tSquared * p2.x +
    tCubed * p3.x;

  const y =
    oneMinusTCubed * p0.y +
    3 * oneMinusTSquared * t * p1.y +
    3 * oneMinusT * tSquared * p2.y +
    tCubed * p3.y;

  return { x, y };
}
