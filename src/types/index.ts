/**
 * Core TypeScript interfaces for Turtle Study App
 * All types are strictly typed with no 'any' usage
 */

/**
 * Session status types
 */
export type SessionStatus = 'running' | 'paused' | 'completed';

/**
 * Turtle state types
 */
export type TurtleState =
  | 'walking'
  | 'eating'
  | 'happy'
  | 'sleeping'
  | 'arrived';

/**
 * Care item types
 */
export type CareItemType = 'carrot' | 'water';

/**
 * Screen types for navigation
 */
export type ScreenType = 'home' | 'session' | 'complete';

/**
 * Validation error types
 */
export type ValidationError = 'empty' | 'non-integer' | 'out-of-range';

/**
 * Point coordinates for positioning
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Path coordinates for turtle movement
 */
export interface PathCoordinates {
  start: Point;
  goal: Point;
  waypoints: Point[];
}

/**
 * Session state interface
 */
export interface SessionState {
  totalDuration: number; // in seconds
  remainingTime: number; // in seconds
  status: SessionStatus;
  turtleState: TurtleState;
  eatingStateEndTime: number | null; // timestamp when eating state ends (1 second duration)
  happyStateEndTime: number | null; // timestamp when happy state ends (3 seconds duration)
  previousStateBeforePause: 'walking' | 'eating' | 'happy' | null; // for restoring state after resume
  remainingEatingDuration: number | null; // remaining ms of eating state when paused
  remainingHappyDuration: number | null; // remaining ms of happy state when paused
  carrotCount: number; // remaining carrot items (0-3, initialized to 3)
  waterCount: number; // remaining water items (0-3, initialized to 3)
}

/**
 * Error state interface
 */
export interface ErrorState {
  message: string;
  type: 'validation' | 'timer' | 'animation' | 'state-transition';
}

/**
 * Application state interface
 */
export interface AppState {
  screen: ScreenType;
  session: SessionState | null;
  error: ErrorState | null;
}

/**
 * Study session data model
 */
export interface StudySession {
  id: string; // UUID
  totalDuration: number; // seconds
  remainingTime: number; // seconds
  elapsedTime: number; // seconds
  status: SessionStatus;
  turtleState: TurtleState;
  startTime: number; // timestamp
  pausedTime: number | null; // timestamp
  eatingStateEndTime: number | null; // timestamp when eating ends (1 second duration)
  happyStateEndTime: number | null; // timestamp when happy ends (3 seconds duration)
  previousStateBeforePause: 'walking' | 'eating' | 'happy' | null; // for restoring state after resume
  remainingEatingDuration: number | null; // remaining ms of eating state when paused
  remainingHappyDuration: number | null; // remaining ms of happy state when paused
  carrotCount: number; // remaining carrot items (0-3, initialized to 3)
  waterCount: number; // remaining water items (0-3, initialized to 3)
}

/**
 * Timer state interface
 */
export interface TimerState {
  intervalId: NodeJS.Timeout | null;
  startTimestamp: number;
  pausedTimestamp: number | null;
  totalDuration: number;
  remainingAtPause: number;
}

/**
 * UI state interface
 */
export interface UIState {
  showTimeInputPopup: boolean;
  showStopConfirmation: boolean;
  errorMessage: string | null;
  errorTimeout: NodeJS.Timeout | null;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  value?: number;
  error?: ValidationError;
}

/**
 * Timer handle for managing timer lifecycle
 */
export interface TimerHandle {
  id: string;
  intervalId: NodeJS.Timeout;
  startTimestamp: number;
  totalDuration: number;
}

/**
 * Background element types
 */
export type BackgroundElementType = 'hill' | 'lake' | 'tree' | 'flower';

/**
 * Decorative element types
 */
export type DecorativeElementType =
  | 'wooden-sign'
  | 'plant'
  | 'stone'
  | 'bush'
  | 'tree'
  | 'flag';

/**
 * Background element interface
 */
export interface BackgroundElement {
  type: BackgroundElementType;
  position: Point;
  scale: number;
}

/**
 * Decorative element interface
 */
export interface DecorativeElement {
  type: DecorativeElementType;
  position: Point;
  scale: number;
}

/**
 * Visual theme interface
 */
export interface VisualTheme {
  colors: {
    beige: string;
    lightYellow: string;
    mint: string;
    oliveGreen: string;
  };
  backgroundElements: BackgroundElement[];
  decorativeElements: DecorativeElement[];
}

/**
 * Color palette interface
 */
export interface ColorPalette {
  background: {
    primary: string;
    secondary: string;
  };
  path: string;
  grass: string;
  progress: string;
  progressBg: string;
  turtleBody: string;
  turtleShell: string;
  carrot: string;
  water: string;
  text: {
    primary: string;
    secondary: string;
  };
  button: {
    primary: string;
    secondary: string;
    disabled: string;
  };
}

/**
 * Typography interface
 */
export interface Typography {
  timer: {
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
  };
  button: {
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
  };
  label: {
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
  };
  error: {
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
  };
}

/**
 * Layout dimensions interface
 */
export interface LayoutDimensions {
  screenPadding: number;
  turtleWidth: number;
  turtleHeight: number;
  pathHeight: number;
  pathWidth: string;
  progressBarHeight: number;
  progressBarWidth: string;
  minTouchTarget: number;
  itemSize: number;
  itemSpacing: number;
  buttonHeight: number;
  buttonMinWidth: number;
  buttonBorderRadius: number;
}

/**
 * Animation timings interface
 */
export interface AnimationTimings {
  turtlePositionUpdate: number;
  turtleStateTransition: number;
  eatingStateDuration: number;
  happyStateDuration: number;
  touchFeedback: number;
  itemFeedback: number;
  errorMessageDuration: number;
  itemToEatingImmediate: number;
  eatingToHappyDelay: number;
  buttonActionDelay: number;
  tapDebounce: number;
  itemDebounce: number;
}
