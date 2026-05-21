import { TurtleState, CareItem } from '../types';

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
 * Get next turtle state based on current state and trigger
 */
export function getNextState(
  currentState: TurtleState,
  trigger: TransitionTrigger,
  currentTime: number,
  item?: CareItem,
  previousStateBeforePause?: TurtleState
): StateTransitionResult {
  // Implementation will be added in Task 2.8 (GREEN phase)
  throw new Error('Not implemented yet');
}

/**
 * Check if 1 second has elapsed since eating state started
 */
export function shouldTransitionFromEating(
  eatingStartTime: number,
  currentTime: number
): boolean {
  // Implementation will be added in Task 2.8 (GREEN phase)
  throw new Error('Not implemented yet');
}

/**
 * Check if 3 seconds have elapsed since happy state started
 */
export function shouldTransitionFromHappy(
  happyStartTime: number,
  currentTime: number
): boolean {
  // Implementation will be added in Task 2.8 (GREEN phase)
  throw new Error('Not implemented yet');
}

/**
 * Check if timer completed during eating/happy states
 */
export function shouldImmediatelyTransitionToArrived(
  currentState: TurtleState,
  remainingTime: number
): boolean {
  // Implementation will be added in Task 2.8 (GREEN phase)
  throw new Error('Not implemented yet');
}

/**
 * Calculate remaining duration for eating/happy states when paused
 */
export function calculateRemainingStateDuration(
  state: TurtleState,
  stateEndTime: number,
  currentTime: number
): number {
  // Implementation will be added in Task 2.8 (GREEN phase)
  throw new Error('Not implemented yet');
}
