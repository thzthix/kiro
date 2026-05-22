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
  darkGray: '#4A4A4A',
  lightGray: '#E5E5E5',
  textPrimary: '#2C3E50',
  white: '#FFFFFF',
  black: '#000000',
  error: '#FF6B6B',
  overlay: 'rgba(0, 0, 0, 0.5)',
  text: {
    primary: '#333333',
    secondary: '#666666',
  },
  button: {
    cancel: '#E8E8E8',
  },
} as const;

/**
 * Typography constants for consistent text styling
 */
export const TYPOGRAPHY = {
  timerFontSize: 48,
  timerFontWeight: '700' as const,
  turtleIconSize: 20,
} as const;

/**
 * Layout and spacing constants
 */
export const LAYOUT = {
  borderRadiusSmall: 4,
  borderRadiusLarge: 20,
  progressBarHeight: 8,
  turtleSliderSize: 24,
  spacing: {
    small: 8,
    medium: 16,
    large: 20,
    extraLarge: 40,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 44,
    minWidth: 44,
  },
  dialog: {
    borderRadius: 16,
    padding: 24,
    maxWidth: 320,
  },
  image: {
    turtleIllustration: 200,
    turtleArrived: 120,
    goalFlag: 60,
    goalFlagHeight: 80,
  },
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
