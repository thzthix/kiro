/**
 * AppReducer - State reducer for Turtle Study App
 * Feature: turtle-study-app
 *
 * Handles all state transitions for the application including session management,
 * timer updates, turtle state changes, and care item interactions.
 */

import { AppState, SessionState, TurtleState, CareItemType } from '../types';

// ============================================================================
// Constants
// ============================================================================

/**
 * Duration of eating animation in milliseconds
 */
const EATING_DURATION_MS = 1000;

/**
 * Duration of happy animation in milliseconds
 */
const HAPPY_DURATION_MS = 3000;

/**
 * Initial count for care items (carrot and water)
 */
const INITIAL_ITEM_COUNT = 3;

/**
 * Conversion factor from minutes to seconds
 */
const SECONDS_PER_MINUTE = 60;

// ============================================================================
// Action Types
// ============================================================================

/**
 * Action types for the reducer
 */
export type AppAction =
  | { type: 'START_SESSION'; payload: { duration: number } }
  | { type: 'PAUSE_SESSION'; payload?: { currentTime: number } }
  | { type: 'RESUME_SESSION'; payload?: { currentTime: number } }
  | { type: 'STOP_SESSION' }
  | { type: 'TICK' }
  | {
      type: 'UPDATE_TURTLE_STATE';
      payload: { turtleState: TurtleState; timestamp?: number };
    }
  | {
      type: 'PROVIDE_ITEM';
      payload: { itemType: CareItemType; timestamp: number };
    }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'NAVIGATE_TO_HOME' }
  | { type: 'NAVIGATE_TO_SESSION' }
  | { type: 'NAVIGATE_TO_COMPLETE' };

// ============================================================================
// Action Creators
// ============================================================================

/**
 * Creates an action to start a new study session
 * @param duration - Duration in minutes
 * @returns START_SESSION action
 */
export const startSession = (duration: number): AppAction => ({
  type: 'START_SESSION',
  payload: { duration },
});

/**
 * Creates an action to pause the current session
 * @param currentTime - Optional current timestamp in milliseconds
 * @returns PAUSE_SESSION action
 */
export const pauseSession = (currentTime?: number): AppAction => ({
  type: 'PAUSE_SESSION',
  payload: currentTime !== undefined ? { currentTime } : undefined,
});

/**
 * Creates an action to resume a paused session
 * @param currentTime - Optional current timestamp in milliseconds
 * @returns RESUME_SESSION action
 */
export const resumeSession = (currentTime?: number): AppAction => ({
  type: 'RESUME_SESSION',
  payload: currentTime !== undefined ? { currentTime } : undefined,
});

/**
 * Creates an action to stop the current session
 * @returns STOP_SESSION action
 */
export const stopSession = (): AppAction => ({
  type: 'STOP_SESSION',
});

/**
 * Creates an action to decrement the timer by one second
 * @returns TICK action
 */
export const tick = (): AppAction => ({
  type: 'TICK',
});

/**
 * Creates an action to update the turtle's state
 * @param turtleState - New turtle state
 * @param timestamp - Optional timestamp in milliseconds
 * @returns UPDATE_TURTLE_STATE action
 */
export const updateTurtleState = (
  turtleState: TurtleState,
  timestamp?: number
): AppAction => ({
  type: 'UPDATE_TURTLE_STATE',
  payload: { turtleState, timestamp },
});

/**
 * Creates an action to provide a care item to the turtle
 * @param itemType - Type of care item (carrot or water)
 * @param timestamp - Current timestamp in milliseconds
 * @returns PROVIDE_ITEM action
 */
export const provideItem = (
  itemType: CareItemType,
  timestamp: number
): AppAction => ({
  type: 'PROVIDE_ITEM',
  payload: { itemType, timestamp },
});

/**
 * Creates an action to mark the session as completed
 * @returns COMPLETE_SESSION action
 */
export const completeSession = (): AppAction => ({
  type: 'COMPLETE_SESSION',
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates a new session state with initial values
 * @param durationMinutes - Duration in minutes
 * @returns New session state
 */
const createNewSession = (durationMinutes: number): SessionState => {
  const totalDurationSeconds = durationMinutes * SECONDS_PER_MINUTE;

  return {
    totalDuration: totalDurationSeconds,
    remainingTime: totalDurationSeconds,
    status: 'running',
    turtleState: 'walking',
    eatingStateEndTime: null,
    happyStateEndTime: null,
    previousStateBeforePause: null,
    remainingEatingDuration: null,
    remainingHappyDuration: null,
    carrotCount: INITIAL_ITEM_COUNT,
    waterCount: INITIAL_ITEM_COUNT,
  };
};

/**
 * Calculates remaining duration for a timed state
 * @param endTime - End timestamp in milliseconds
 * @param currentTime - Current timestamp in milliseconds
 * @returns Remaining duration in milliseconds, or null if endTime is null
 */
const calculateRemainingDuration = (
  endTime: number | null,
  currentTime: number
): number | null => {
  if (endTime === null) return null;
  return Math.max(0, endTime - currentTime);
};

/**
 * Handles pause logic for session state
 * @param session - Current session state
 * @param currentTime - Current timestamp in milliseconds
 * @returns Updated session state
 */
const handlePause = (
  session: SessionState,
  currentTime: number
): SessionState => {
  const { turtleState, eatingStateEndTime, happyStateEndTime } = session;

  const remainingEating =
    turtleState === 'eating'
      ? calculateRemainingDuration(eatingStateEndTime, currentTime)
      : null;

  const remainingHappy =
    turtleState === 'happy'
      ? calculateRemainingDuration(happyStateEndTime, currentTime)
      : null;

  // Only store walking, eating, or happy states for restoration
  // sleeping and arrived states should not be paused
  const stateToRestore: 'walking' | 'eating' | 'happy' | null =
    turtleState === 'walking' || turtleState === 'eating' || turtleState === 'happy'
      ? turtleState
      : null;

  return {
    ...session,
    status: 'paused',
    turtleState: 'sleeping',
    previousStateBeforePause: stateToRestore,
    remainingEatingDuration: remainingEating,
    remainingHappyDuration: remainingHappy,
  };
};

/**
 * Handles resume logic for session state
 * @param session - Current session state
 * @param currentTime - Current timestamp in milliseconds
 * @returns Updated session state
 */
const handleResume = (
  session: SessionState,
  currentTime: number
): SessionState => {
  const {
    previousStateBeforePause,
    remainingEatingDuration,
    remainingHappyDuration,
  } = session;

  const restoredState: TurtleState = previousStateBeforePause || 'walking';

  const eatingEndTime =
    previousStateBeforePause === 'eating' && remainingEatingDuration
      ? currentTime + remainingEatingDuration
      : null;

  const happyEndTime =
    previousStateBeforePause === 'happy' && remainingHappyDuration
      ? currentTime + remainingHappyDuration
      : null;

  return {
    ...session,
    status: 'running',
    turtleState: restoredState,
    eatingStateEndTime: eatingEndTime,
    happyStateEndTime: happyEndTime,
    previousStateBeforePause: null,
    remainingEatingDuration: null,
    remainingHappyDuration: null,
  };
};

/**
 * Calculates end time for a turtle state based on its type
 * @param turtleState - Turtle state
 * @param currentTime - Current timestamp in milliseconds
 * @returns Object with eatingStateEndTime and happyStateEndTime
 */
const calculateStateEndTimes = (
  turtleState: TurtleState,
  currentTime: number
): { eatingStateEndTime: number | null; happyStateEndTime: number | null } => {
  return {
    eatingStateEndTime:
      turtleState === 'eating' ? currentTime + EATING_DURATION_MS : null,
    happyStateEndTime:
      turtleState === 'happy' ? currentTime + HAPPY_DURATION_MS : null,
  };
};

/**
 * Handles providing a care item to the turtle
 * @param session - Current session state
 * @param itemType - Type of care item
 * @param timestamp - Current timestamp in milliseconds
 * @returns Updated session state, or original state if item unavailable
 */
const handleProvideItem = (
  session: SessionState,
  itemType: CareItemType,
  timestamp: number
): SessionState => {
  const { carrotCount, waterCount } = session;
  const currentCount = itemType === 'carrot' ? carrotCount : waterCount;

  // Don't trigger eating state if count is 0
  if (currentCount === 0) {
    return session;
  }

  // Decrement item count
  const newCarrotCount =
    itemType === 'carrot' ? Math.max(0, carrotCount - 1) : carrotCount;
  const newWaterCount =
    itemType === 'water' ? Math.max(0, waterCount - 1) : waterCount;

  return {
    ...session,
    carrotCount: newCarrotCount,
    waterCount: newWaterCount,
    turtleState: 'eating',
    eatingStateEndTime: timestamp + EATING_DURATION_MS,
  };
};

// ============================================================================
// Main Reducer
// ============================================================================

/**
 * Main reducer function for application state
 * Handles all state transitions based on dispatched actions
 * @param state - Current application state
 * @param action - Action to process
 * @returns New application state
 */
export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'START_SESSION': {
      const { duration } = action.payload;
      const newSession = createNewSession(duration);

      return {
        ...state,
        screen: 'session',
        session: newSession,
      };
    }

    case 'PAUSE_SESSION': {
      if (!state.session) return state;

      const currentTime = action.payload?.currentTime ?? Date.now();
      const updatedSession = handlePause(state.session, currentTime);

      return {
        ...state,
        session: updatedSession,
      };
    }

    case 'RESUME_SESSION': {
      if (!state.session) return state;

      const currentTime = action.payload?.currentTime ?? Date.now();
      const updatedSession = handleResume(state.session, currentTime);

      return {
        ...state,
        session: updatedSession,
      };
    }

    case 'STOP_SESSION': {
      return {
        ...state,
        screen: 'home',
        session: null,
      };
    }

    case 'TICK': {
      if (!state.session) return state;

      const newRemainingTime = Math.max(0, state.session.remainingTime - 1);

      return {
        ...state,
        session: {
          ...state.session,
          remainingTime: newRemainingTime,
        },
      };
    }

    case 'UPDATE_TURTLE_STATE': {
      if (!state.session) return state;

      const { turtleState, timestamp } = action.payload;
      const currentTime = timestamp ?? Date.now();
      const endTimes = calculateStateEndTimes(turtleState, currentTime);

      return {
        ...state,
        session: {
          ...state.session,
          turtleState,
          ...endTimes,
        },
      };
    }

    case 'PROVIDE_ITEM': {
      if (!state.session) return state;

      const { itemType, timestamp } = action.payload;
      const updatedSession = handleProvideItem(
        state.session,
        itemType,
        timestamp
      );

      return {
        ...state,
        session: updatedSession,
      };
    }

    case 'COMPLETE_SESSION': {
      if (!state.session) return state;

      return {
        ...state,
        screen: 'complete',
        session: {
          ...state.session,
          status: 'completed',
        },
      };
    }

    case 'NAVIGATE_TO_HOME': {
      return {
        ...state,
        screen: 'home',
        session: null,
      };
    }

    case 'NAVIGATE_TO_SESSION': {
      return {
        ...state,
        screen: 'session',
      };
    }

    case 'NAVIGATE_TO_COMPLETE': {
      return {
        ...state,
        screen: 'complete',
      };
    }

    default:
      return state;
  }
};
