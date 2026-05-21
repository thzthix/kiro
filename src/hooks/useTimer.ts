import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerService, TimerHandle } from '../utils/TimerService';

/**
 * Return type for the useTimer hook.
 * Provides timer state and control methods.
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
 * This hook provides a complete timer interface with the following features:
 * - Start/stop/pause/resume controls
 * - Automatic cleanup on unmount
 * - Callback notifications on tick and completion
 * - Accurate time tracking via TimerService
 *
 * @param totalDuration - Initial duration in seconds (must be positive)
 * @param onTick - Callback triggered every second with remaining time
 * @param onComplete - Callback triggered when timer reaches 0
 * @returns Timer control interface with current state and control methods
 *
 * @example
 * ```tsx
 * const { remainingTime, start, pause, resume, stop } = useTimer(
 *   60,
 *   (remaining) => console.log(`${remaining}s left`),
 *   () => console.log('Timer completed!')
 * );
 * ```
 */
export function useTimer(
  totalDuration: number,
  onTick: (remaining: number) => void,
  onComplete: () => void
): UseTimerReturn {
  const [remainingTime, setRemainingTime] = useState<number>(totalDuration);
  const timerServiceRef = useRef<TimerService>(new TimerService());
  const timerHandleRef = useRef<TimerHandle | null>(null);

  /**
   * Helper function to stop the current timer if one exists.
   * Cleans up the timer handle reference.
   */
  const stopCurrentTimer = useCallback((): void => {
    if (timerHandleRef.current) {
      timerServiceRef.current.stop(timerHandleRef.current);
      timerHandleRef.current = null;
    }
  }, []);

  /**
   * Helper function to create tick callback that updates both state and user callback.
   */
  const createTickCallback = useCallback(
    (remaining: number): void => {
      setRemainingTime(remaining);
      onTick(remaining);
    },
    [onTick]
  );

  /**
   * Helper function to create completion callback that updates state and user callback.
   */
  const createCompletionCallback = useCallback((): void => {
    setRemainingTime(0);
    onComplete();
  }, [onComplete]);

  /**
   * Cleanup effect: Stop timer when component unmounts to prevent memory leaks.
   */
  useEffect(() => {
    return () => {
      stopCurrentTimer();
    };
  }, [stopCurrentTimer]);

  /**
   * Start or restart the timer from the beginning.
   * If a timer is already running, it will be stopped first.
   */
  const start = useCallback((): void => {
    stopCurrentTimer();

    timerHandleRef.current = timerServiceRef.current.start(
      totalDuration,
      createTickCallback,
      createCompletionCallback
    );
  }, [totalDuration, createTickCallback, createCompletionCallback, stopCurrentTimer]);

  /**
   * Pause the timer and preserve the current remaining time.
   * The timer can be resumed later from this point.
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
   * Has no effect if the timer is not currently paused.
   */
  const resume = useCallback((): void => {
    if (timerHandleRef.current) {
      timerServiceRef.current.resume(timerHandleRef.current);
    }
  }, []);

  /**
   * Stop the timer completely and clean up resources.
   * The timer cannot be resumed after stopping.
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
