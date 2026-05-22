import { TurtleState, CareItemType } from '../types';

// State duration constants (in milliseconds)
const EATING_DURATION_MS = 1000; // 1 second
const HAPPY_DURATION_MS = 3000; // 3 seconds

export interface StateTransitionResult {
  nextState: TurtleState;
  eatingStateEndTime?: number;
  happyStateEndTime?: number;
  previousStateBeforePause?: TurtleState;
  remainingEatingDuration?: number;
  remainingHappyDuration?: number;
}

export type TransitionTrigger = 'provide-item' | 'pause' | 'resume' | 'tick';

/**
 * Get next turtle state based on current state and trigger.
 * 
 * @param currentState - Current turtle state
 * @param trigger - Event that triggers the transition
 * @param currentTime - Current timestamp in milliseconds
 * @param item - Care item provided (for 'provide-item' trigger)
 * @param previousStateBeforePause - State before pause (for 'resume' trigger)
 * @returns State transition result with next state and timing information
 */
export function getNextState(
  currentState: TurtleState,
  trigger: TransitionTrigger,
  currentTime: number,
  _item?: CareItemType,
  previousStateBeforePause?: TurtleState
): StateTransitionResult {
  switch (trigger) {
    case 'provide-item':
      return transitionToEating(currentTime);

    case 'pause':
      return transitionToSleeping(currentState);

    case 'resume':
      return transitionFromSleeping(previousStateBeforePause);

    case 'tick':
      // No automatic transitions on tick (handled by shouldTransition functions)
      return { nextState: currentState };

    default:
      return { nextState: currentState };
  }
}

/**
 * Transition to eating state when item is provided.
 */
function transitionToEating(currentTime: number): StateTransitionResult {
  return {
    nextState: 'eating',
    eatingStateEndTime: currentTime + EATING_DURATION_MS,
  };
}

/**
 * Transition to sleeping state and preserve current state.
 */
function transitionToSleeping(
  currentState: TurtleState
): StateTransitionResult {
  return {
    nextState: 'sleeping',
    previousStateBeforePause: currentState,
  };
}

/**
 * Restore previous state when resuming from sleeping.
 */
function transitionFromSleeping(
  previousStateBeforePause?: TurtleState
): StateTransitionResult {
  return {
    nextState: previousStateBeforePause || 'walking',
  };
}

/**
 * Check if 1 second has elapsed since eating state started.
 * 
 * @param eatingStartTime - Timestamp when eating state started (ms)
 * @param currentTime - Current timestamp (ms)
 * @returns True if eating duration has elapsed
 */
export function shouldTransitionFromEating(
  eatingStartTime: number,
  currentTime: number
): boolean {
  return currentTime - eatingStartTime >= EATING_DURATION_MS;
}

/**
 * Check if 3 seconds have elapsed since happy state started.
 * 
 * @param happyStartTime - Timestamp when happy state started (ms)
 * @param currentTime - Current timestamp (ms)
 * @returns True if happy duration has elapsed
 */
export function shouldTransitionFromHappy(
  happyStartTime: number,
  currentTime: number
): boolean {
  return currentTime - happyStartTime >= HAPPY_DURATION_MS;
}

/**
 * Check if timer completed during eating/happy states.
 * When timer reaches 0 during these states, turtle should immediately transition to arrived.
 * 
 * @param currentState - Current turtle state
 * @param remainingTime - Remaining session time in seconds
 * @returns True if should immediately transition to arrived
 */
export function shouldImmediatelyTransitionToArrived(
  currentState: TurtleState,
  remainingTime: number
): boolean {
  return (
    (currentState === 'eating' || currentState === 'happy') &&
    remainingTime === 0
  );
}

/**
 * Calculate remaining duration for eating/happy states when paused.
 * 
 * @param state - Current state ('eating' or 'happy')
 * @param stateEndTime - Timestamp when state should end (ms)
 * @param currentTime - Current timestamp (ms)
 * @returns Remaining duration in milliseconds
 */
export function calculateRemainingStateDuration(
  _state: TurtleState,
  stateEndTime: number,
  currentTime: number
): number {
  const remaining = stateEndTime - currentTime;
  return Math.max(0, remaining);
}
