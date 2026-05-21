import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerService, TimerHandle } from '../utils/TimerService';

/**
 * Return type for the useTimer hook.
 *
 * Provides timer state and control methods for managing countdown timers.
 */
export interface UseTimerReturn {
  /** Current remaining time in seconds */
  remainingTime: number;
  /** Start or restart the timer from the beginning */
  start: () => void;
  /** Pause the timer and preserve remaining time */
  pause: () => void;
  /** Resume the timer from where it was paused */
  resume: () => void;
  /** Stop the timer and clean up resources */
  stop: () => void;
}

/**
 * Custom hook for managing countdown timers with pause/resume functionality.
 *
 * This hook provides a complete timer interface with accurate time tracking,
 * pause/resume capabilities, and automatic cleanup. It delegates the actual
 * timer logic to TimerService for accuracy and testability.
 *
 * **Features:**
 * - Start/stop/pause/resume controls
 * - Automatic cleanup on unmount (prevents memory leaks)
 * - Callback notifications on tick and completion
 * - Accurate time tracking via TimerService (no drift accumulation)
 *
 * **Usage Notes:**
 * - Calling `start()` while a timer is running will restart from the beginning
 * - `pause()` and `resume()` can be called safely even when timer is not running
 * - All callbacks are memoized to prevent unnecessary re-renders
 *
 * @param totalDuration - Initial duration in seconds (must be positive)
 * @param onTick - Callback triggered every second with remaining time
 * @param onComplete - Callback triggered when timer reaches 0
 * @returns Timer control interface with current state and control methods
 *
 * @example
 * Basic usage:
 * ```tsx
 * const { remainingTime, start, pause, resume, stop } = useTimer(
 *   60,
 *   (remaining) => console.log(`${remaining}s left`),
 *   () => console.log('Timer completed!')
 * );
 *
 * // Start the timer
 * start();
 *
 * // Pause after some time
 * pause();
 *
 * // Resume later
 * resume();
 * ```
 */
export function useTimer(
  totalDuration: number,
  onTick: (remaining: number) => void,
  onComplete: () => void
): UseTimerReturn {
  // State: current remaining time displayed to user
  const [remainingTime, setRemainingTime] = useState<number>(totalDuration);

  // Refs: persist across renders without causing re-renders
  const timerServiceRef = useRef<TimerService>(new TimerService());
  const timerHandleRef = useRef<TimerHandle | null>(null);

  /**
   * Internal helper: Stop the current timer if one exists.
   *
   * This function safely stops any running timer and cleans up the handle reference.
   * It's safe to call even when no timer is running.
   *
   * @internal
   */
  const stopCurrentTimer = useCallback((): void => {
    if (timerHandleRef.current) {
      timerServiceRef.current.stop(timerHandleRef.current);
      timerHandleRef.current = null;
    }
  }, []);

  /**
   * Internal handler: Process timer tick events.
   *
   * Updates both the internal state and notifies the user's callback.
   * Memoized to prevent unnecessary re-renders.
   *
   * @param remaining - Current remaining time in seconds
   * @internal
   */
  const handleTick = useCallback(
    (remaining: number): void => {
      setRemainingTime(remaining);
      onTick(remaining);
    },
    [onTick]
  );

  /**
   * Internal handler: Process timer completion events.
   *
   * Sets remaining time to 0 and notifies the user's callback.
   * Memoized to prevent unnecessary re-renders.
   *
   * @internal
   */
  const handleComplete = useCallback((): void => {
    setRemainingTime(0);
    onComplete();
  }, [onComplete]);

  /**
   * Cleanup effect: Stop timer on unmount.
   *
   * This prevents memory leaks by ensuring the timer is stopped
   * when the component using this hook unmounts.
   */
  useEffect(() => {
    return stopCurrentTimer;
  }, [stopCurrentTimer]);

  /**
   * Start or restart the timer from the beginning.
   *
   * If a timer is already running, it will be stopped and a new timer
   * will start from the full duration. This ensures consistent behavior
   * regardless of the current timer state.
   */
  const start = useCallback((): void => {
    stopCurrentTimer();
    timerHandleRef.current = timerServiceRef.current.start(
      totalDuration,
      handleTick,
      handleComplete
    );
  }, [totalDuration, handleTick, handleComplete, stopCurrentTimer]);

  /**
   * Pause the timer and preserve the current remaining time.
   *
   * The timer can be resumed later from the same point using `resume()`.
   * Safe to call even when no timer is running (no-op in that case).
   */
  const pause = useCallback((): void => {
    if (timerHandleRef.current) {
      timerServiceRef.current.pause(timerHandleRef.current);
      const remaining = timerServiceRef.current.getRemainingTime(
        timerHandleRef.current
      );
      setRemainingTime(remaining);
    }
  }, []);

  /**
   * Resume the timer from where it was paused.
   *
   * Continues counting down from the remaining time when `pause()` was called.
   * Safe to call even when timer is not paused (no-op in that case).
   */
  const resume = useCallback((): void => {
    if (timerHandleRef.current) {
      timerServiceRef.current.resume(timerHandleRef.current);
    }
  }, []);

  /**
   * Stop the timer completely and clean up resources.
   *
   * After calling this, the timer must be restarted with `start()` to run again.
   * Safe to call even when no timer is running (no-op in that case).
   */
  const stop = useCallback((): void => {
    stopCurrentTimer();
  }, [stopCurrentTimer]);

  return {
    remainingTime,
    start,
    pause,
    resume,
    stop,
  };
}
