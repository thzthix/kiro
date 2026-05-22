/**
 * TimerService - Manages countdown timers with pause/resume functionality
 * 
 * **Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**
 */

import { handleTimerError } from './ErrorHandler';

// Timer constants
const TICK_INTERVAL_MS = 1000; // 1 second
const MS_PER_SECOND = 1000;

export interface TimerHandle {
  id: string;
  intervalId: NodeJS.Timeout;
  totalDuration: number;
}

interface TimerState {
  intervalId: NodeJS.Timeout | null;
  startTimestamp: number;
  pausedTimestamp: number | null;
  totalDuration: number;
  remainingAtPause: number | null;
  onTick: (remaining: number) => void;
  onComplete: () => void;
  isCompleted: boolean;
}

export class TimerService {
  private timers: Map<string, TimerState> = new Map();

  /**
   * Start a new countdown timer.
   * 
   * @param duration - Duration in seconds
   * @param onTick - Callback triggered every second with remaining time
   * @param onComplete - Callback triggered when timer reaches 0
   * @returns TimerHandle to control the timer
   * @throws Error if duration is invalid or callbacks are missing
   */
  start(
    duration: number,
    onTick: (remaining: number) => void,
    onComplete: () => void
  ): TimerHandle {
    // Validate duration
    if (typeof duration !== 'number' || isNaN(duration)) {
      throw new Error('Timer duration must be a valid number');
    }
    if (duration <= 0) {
      throw new Error('Timer duration must be greater than 0');
    }

    // Validate callbacks
    if (typeof onTick !== 'function') {
      throw new Error('onTick callback is required and must be a function');
    }
    if (typeof onComplete !== 'function') {
      throw new Error('onComplete callback is required and must be a function');
    }

    const id = this.generateId();
    const intervalId = this.createInterval(id);
    const state = this.createTimerState(
      intervalId,
      duration,
      onTick,
      onComplete
    );

    this.timers.set(id, state);

    return {
      id,
      intervalId,
      totalDuration: duration,
    };
  }

  /**
   * Pause a running timer.
   * Gracefully handles non-existent timers without throwing.
   * 
   * @param handle - Timer handle returned from start()
   */
  pause(handle: TimerHandle): void {
    if (!handle || !handle.id) {
      handleTimerError('pause', 'unknown', 'Invalid timer handle provided');
      return;
    }

    const state = this.timers.get(handle.id);
    if (!state) {
      handleTimerError('pause', handle.id, 'Timer not found');
      return;
    }
    
    if (!state.intervalId) {
      handleTimerError('pause', handle.id, 'Timer is already paused');
      return;
    }

    this.clearInterval(state);
    this.saveRemainingTime(state);
  }

  /**
   * Resume a paused timer.
   * Gracefully handles non-existent timers without throwing.
   * 
   * @param handle - Timer handle returned from start()
   */
  resume(handle: TimerHandle): void {
    if (!handle || !handle.id) {
      handleTimerError('resume', 'unknown', 'Invalid timer handle provided');
      return;
    }

    const state = this.timers.get(handle.id);
    if (!state) {
      handleTimerError('resume', handle.id, 'Timer not found');
      return;
    }
    
    if (state.intervalId) {
      handleTimerError('resume', handle.id, 'Timer is already running');
      return;
    }
    
    if (state.remainingAtPause === null) {
      handleTimerError('resume', handle.id, 'Timer was not paused, cannot resume');
      return;
    }

    this.resetTimerFromPause(state);
    state.intervalId = this.createInterval(handle.id);
  }

  /**
   * Stop a timer and clear all resources.
   * Gracefully handles non-existent timers without throwing.
   * 
   * @param handle - Timer handle returned from start()
   */
  stop(handle: TimerHandle): void {
    if (!handle || !handle.id) {
      handleTimerError('stop', 'unknown', 'Invalid timer handle provided');
      return;
    }

    const state = this.timers.get(handle.id);
    if (!state) {
      handleTimerError('stop', handle.id, 'Timer not found');
      return;
    }

    if (state.intervalId) {
      this.clearInterval(state);
    }

    this.timers.delete(handle.id);
  }

  /**
   * Get remaining time for a timer.
   * Gracefully handles non-existent timers by returning 0.
   * 
   * @param handle - Timer handle returned from start()
   * @returns Remaining time in seconds (0 if timer not found)
   */
  getRemainingTime(handle: TimerHandle): number {
    if (!handle || !handle.id) {
      handleTimerError('getRemainingTime', 'unknown', 'Invalid timer handle provided');
      return 0;
    }

    const state = this.timers.get(handle.id);
    if (!state) {
      handleTimerError('getRemainingTime', handle.id, 'Timer not found');
      return 0;
    }

    return this.isPaused(state)
      ? state.remainingAtPause!
      : this.calculateRemainingTime(state);
  }

  /**
   * Internal tick handler called every second.
   */
  private tick(id: string): void {
    const state = this.timers.get(id);
    if (!state || state.isCompleted) return;

    const remaining = this.calculateRemainingTime(state);

    // Always call onTick first, even when completing
    state.onTick(remaining);

    if (this.isCompleted(remaining)) {
      this.handleCompletion(state);
      return;
    }
  }

  /**
   * Create a new interval for a timer.
   */
  private createInterval(id: string): NodeJS.Timeout {
    return setInterval(() => {
      this.tick(id);
    }, TICK_INTERVAL_MS);
  }

  /**
   * Create initial timer state.
   */
  private createTimerState(
    intervalId: NodeJS.Timeout,
    duration: number,
    onTick: (remaining: number) => void,
    onComplete: () => void
  ): TimerState {
    return {
      intervalId,
      startTimestamp: Date.now(),
      pausedTimestamp: null,
      totalDuration: duration,
      remainingAtPause: null,
      onTick,
      onComplete,
      isCompleted: false,
    };
  }

  /**
   * Clear interval and set to null.
   */
  private clearInterval(state: TimerState): void {
    if (state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }
  }

  /**
   * Save remaining time when pausing.
   */
  private saveRemainingTime(state: TimerState): void {
    state.pausedTimestamp = Date.now();
    state.remainingAtPause = this.calculateRemainingTime(state);
  }

  /**
   * Reset timer state to resume from paused time.
   */
  private resetTimerFromPause(state: TimerState): void {
    state.startTimestamp = Date.now();
    state.totalDuration = state.remainingAtPause!;
    state.pausedTimestamp = null;
    state.remainingAtPause = null;
  }

  /**
   * Check if timer is paused.
   */
  private isPaused(state: TimerState): boolean {
    return state.pausedTimestamp !== null && state.remainingAtPause !== null;
  }

  /**
   * Check if timer has completed.
   */
  private isCompleted(remaining: number): boolean {
    return remaining <= 0;
  }

  /**
   * Handle timer completion.
   */
  private handleCompletion(state: TimerState): void {
    state.isCompleted = true;
    this.clearInterval(state);
    state.onComplete();
  }

  /**
   * Calculate remaining time based on elapsed time since start.
   */
  private calculateRemainingTime(state: TimerState): number {
    const now = Date.now();
    const elapsed = Math.floor((now - state.startTimestamp) / MS_PER_SECOND);
    const remaining = state.totalDuration - elapsed;
    return Math.max(0, remaining);
  }

  /**
   * Generate a unique ID for a timer.
   */
  private generateId(): string {
    return `timer-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}
