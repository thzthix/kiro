/**
 * TimerService - Manages countdown timers with pause/resume functionality
 * 
 * **Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**
 */

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
   */
  start(
    duration: number,
    onTick: (remaining: number) => void,
    onComplete: () => void
  ): TimerHandle {
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
   * 
   * @param handle - Timer handle returned from start()
   */
  pause(handle: TimerHandle): void {
    const state = this.timers.get(handle.id);
    if (!state || !state.intervalId) return;

    this.clearInterval(state);
    this.saveRemainingTime(state);
  }

  /**
   * Resume a paused timer.
   * 
   * @param handle - Timer handle returned from start()
   */
  resume(handle: TimerHandle): void {
    const state = this.timers.get(handle.id);
    if (!state || state.intervalId || state.remainingAtPause === null) return;

    this.resetTimerFromPause(state);
    state.intervalId = this.createInterval(handle.id);
  }

  /**
   * Stop a timer and clear all resources.
   * 
   * @param handle - Timer handle returned from start()
   */
  stop(handle: TimerHandle): void {
    const state = this.timers.get(handle.id);
    if (!state) return;

    if (state.intervalId) {
      this.clearInterval(state);
    }

    this.timers.delete(handle.id);
  }

  /**
   * Get remaining time for a timer.
   * 
   * @param handle - Timer handle returned from start()
   * @returns Remaining time in seconds
   */
  getRemainingTime(handle: TimerHandle): number {
    const state = this.timers.get(handle.id);
    if (!state) return 0;

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

    if (this.isCompleted(remaining)) {
      this.handleCompletion(state);
      return;
    }

    state.onTick(remaining);
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
