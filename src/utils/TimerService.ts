/**
 * TimerService - Manages countdown timers with pause/resume functionality
 * 
 * **Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**
 */

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
   * Start a new countdown timer
   * @param duration - Duration in seconds
   * @param onTick - Callback triggered every second with remaining time
   * @param onComplete - Callback triggered when timer reaches 0
   * @returns TimerHandle to control the timer
   */
  start(
    duration: number,
    onTick: (remaining: number) => void,
    onComplete: () => void
  ): TimerHandle {
    const id = this.generateId();
    const startTimestamp = Date.now();

    const intervalId = setInterval(() => {
      this.tick(id);
    }, 1000);

    const state: TimerState = {
      intervalId,
      startTimestamp,
      pausedTimestamp: null,
      totalDuration: duration,
      remainingAtPause: null,
      onTick,
      onComplete,
      isCompleted: false,
    };

    this.timers.set(id, state);

    return {
      id,
      intervalId,
      totalDuration: duration,
    };
  }

  /**
   * Pause a running timer
   * @param handle - Timer handle returned from start()
   */
  pause(handle: TimerHandle): void {
    const state = this.timers.get(handle.id);
    if (!state || !state.intervalId) return;

    // Clear the interval
    clearInterval(state.intervalId);
    state.intervalId = null;

    // Store the remaining time at pause
    state.pausedTimestamp = Date.now();
    state.remainingAtPause = this.calculateRemainingTime(state);
  }

  /**
   * Resume a paused timer
   * @param handle - Timer handle returned from start()
   */
  resume(handle: TimerHandle): void {
    const state = this.timers.get(handle.id);
    if (!state || state.intervalId || state.remainingAtPause === null) return;

    // Reset start timestamp to continue from remaining time
    state.startTimestamp = Date.now();
    state.totalDuration = state.remainingAtPause;
    state.pausedTimestamp = null;
    state.remainingAtPause = null;

    // Restart the interval
    const intervalId = setInterval(() => {
      this.tick(handle.id);
    }, 1000);

    state.intervalId = intervalId;
  }

  /**
   * Stop a timer and clear all resources
   * @param handle - Timer handle returned from start()
   */
  stop(handle: TimerHandle): void {
    const state = this.timers.get(handle.id);
    if (!state) return;

    // Clear the interval if running
    if (state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }

    // Remove from timers map
    this.timers.delete(handle.id);
  }

  /**
   * Get remaining time for a timer
   * @param handle - Timer handle returned from start()
   * @returns Remaining time in seconds
   */
  getRemainingTime(handle: TimerHandle): number {
    const state = this.timers.get(handle.id);
    if (!state) return 0;

    // If paused, return the stored remaining time
    if (state.pausedTimestamp !== null && state.remainingAtPause !== null) {
      return state.remainingAtPause;
    }

    // Calculate remaining time from current timestamp
    return this.calculateRemainingTime(state);
  }

  /**
   * Internal tick handler called every second
   */
  private tick(id: string): void {
    const state = this.timers.get(id);
    if (!state || state.isCompleted) return;

    const remaining = this.calculateRemainingTime(state);

    // Check if timer has completed
    if (remaining <= 0) {
      state.isCompleted = true;
      
      // Clear interval
      if (state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = null;
      }

      // Call onComplete callback
      state.onComplete();
      return;
    }

    // Call onTick callback with remaining time
    state.onTick(remaining);
  }

  /**
   * Calculate remaining time based on elapsed time since start
   */
  private calculateRemainingTime(state: TimerState): number {
    const now = Date.now();
    const elapsed = Math.floor((now - state.startTimestamp) / 1000);
    const remaining = state.totalDuration - elapsed;
    return Math.max(0, remaining);
  }

  /**
   * Generate a unique ID for a timer
   */
  private generateId(): string {
    return `timer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
