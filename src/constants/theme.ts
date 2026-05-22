/**
 * Theme Constants
 * Feature: turtle-study-app
 * Task: 12.5 Refactor background components (REFACTOR)
 * 
 * Centralized color palette and theme constants for consistent styling
 * across all components.
 */

/**
 * Color palette from design specification
 * Requirements: 6.1, 6.2
 */
export const COLORS = {
  beige: '#F5F1E8',
  lightYellow: '#FFFACD',
  mint: '#A8D5BA',
  oliveGreen: '#8B9556',
} as const;

/**
 * Default path coordinates for turtle journey
 * Used by StudyCanvas and related components
 */
export const DEFAULT_PATH_COORDINATES: import('../types').PathCoordinates = {
  start: { x: 50, y: 300 },
  goal: { x: 350, y: 300 },
  waypoints: [
    { x: 125, y: 290 },
    { x: 200, y: 310 },
    { x: 275, y: 295 },
  ],
};
