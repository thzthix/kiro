import { useCallback, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { CareItemType } from '../types';
import { TimerService, TimerHandle } from '../utils/TimerService';

/**
 * Duration constants for turtle state transitions
 */
const EATING_DURATION_MS = 1000;
const HAPPY_DURATION_MS = 3000;

/**
 * Custom hook for managing study session state and timer integration
 * 
 * This hook integrates the timer logic with the app state management,
 * handling session lifecycle, turtle state transitions, and care item interactions.
 * 
 * @returns Session state and control functions
 */
export function useStudySession() {
  const { state, dispatch } = useAppContext();
  const { session } = state;

  // Refs for tracking eating/happy state transitions
  const eatingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const happyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Timer service ref
  const timerServiceRef = useRef<TimerService>(new TimerService());
  const timerHandleRef = useRef<TimerHandle | null>(null);

  /**
   * Clear a specific timeout ref
   */
  const clearTimeoutRef = useCallback((timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /**
   * Clear all pending state transition timeouts
   */
  const clearStateTimeouts = useCallback(() => {
    clearTimeoutRef(eatingTimeoutRef);
    clearTimeoutRef(happyTimeoutRef);
  }, [clearTimeoutRef]);

  /**
   * Schedule transition to happy state after eating completes
   */
  const scheduleHappyTransition = useCallback((timestamp: number) => {
    happyTimeoutRef.current = setTimeout(() => {
      dispatch({
        type: 'UPDATE_TURTLE_STATE',
        payload: { turtleState: 'walking' },
      });
    }, HAPPY_DURATION_MS);

    dispatch({
      type: 'UPDATE_TURTLE_STATE',
      payload: {
        turtleState: 'happy',
        timestamp,
      },
    });
  }, [dispatch]);

  /**
   * Schedule transition from eating to happy state
   */
  const scheduleEatingToHappyTransition = useCallback((eatingDuration: number) => {
    eatingTimeoutRef.current = setTimeout(() => {
      scheduleHappyTransition(Date.now());
    }, eatingDuration);
  }, [scheduleHappyTransition]);

  /**
   * Restore turtle state after resume based on previous state
   */
  const restoreTurtleStateAfterResume = useCallback((currentTime: number) => {
    if (!session) return;

    const { previousStateBeforePause, remainingEatingDuration, remainingHappyDuration } = session;

    if (previousStateBeforePause === 'eating' && remainingEatingDuration) {
      dispatch({
        type: 'UPDATE_TURTLE_STATE',
        payload: { turtleState: 'eating', timestamp: currentTime },
      });
      scheduleEatingToHappyTransition(remainingEatingDuration);
    } else if (previousStateBeforePause === 'happy' && remainingHappyDuration) {
      dispatch({
        type: 'UPDATE_TURTLE_STATE',
        payload: { turtleState: 'happy', timestamp: currentTime },
      });
      happyTimeoutRef.current = setTimeout(() => {
        dispatch({
          type: 'UPDATE_TURTLE_STATE',
          payload: { turtleState: 'walking' },
        });
      }, remainingHappyDuration);
    }
  }, [session, dispatch, scheduleEatingToHappyTransition]);

  /**
   * Handle timer tick - update remaining time
   */
  const handleTick = useCallback((_remainingSeconds: number) => {
    dispatch({ type: 'TICK' });
  }, [dispatch]);

  /**
   * Handle timer completion - transition to arrived state
   */
  const handleComplete = useCallback(() => {
    clearStateTimeouts();
    dispatch({ type: 'UPDATE_TURTLE_STATE', payload: { turtleState: 'arrived' } });
    dispatch({ type: 'COMPLETE_SESSION' });
  }, [dispatch, clearStateTimeouts]);

  /**
   * Auto-start timer when session exists but timer hasn't been started
   * Only start if status is 'running' and timer doesn't exist yet
   */
  useEffect(() => {
    if (session && session.status === 'running' && !timerHandleRef.current) {
      timerHandleRef.current = timerServiceRef.current.start(
        session.remainingTime,
        handleTick,
        handleComplete
      );
    }
    
    // Don't restart timer if it already exists or if session is paused
    if (session && session.status === 'paused' && timerHandleRef.current) {
      // Timer should already be paused, do nothing
    }
  }, [session?.status, handleTick, handleComplete]); // Only depend on status, not entire session

  /**
   * Start a new study session with the specified duration
   */
  const startSession = useCallback((durationSeconds: number) => {
    const durationMinutes = durationSeconds / 60;

    dispatch({
      type: 'START_SESSION',
      payload: { duration: durationMinutes },
    });
  }, [dispatch, handleTick, handleComplete]);

  /**
   * Pause the current session
   */
  const pauseSession = useCallback(() => {
    if (!session || session.status !== 'running') {
      return;
    }

    clearStateTimeouts();

    dispatch({
      type: 'PAUSE_SESSION',
      payload: { currentTime: Date.now() },
    });

    if (timerHandleRef.current) {
      timerServiceRef.current.pause(timerHandleRef.current);
    }
  }, [session, dispatch, clearStateTimeouts]);

  /**
   * Resume the paused session
   */
  const resumeSession = useCallback(() => {
    if (!session || session.status !== 'paused') {
      return;
    }

    const currentTime = Date.now();
    dispatch({ type: 'RESUME_SESSION', payload: { currentTime } });

    restoreTurtleStateAfterResume(currentTime);

    if (timerHandleRef.current) {
      timerServiceRef.current.resume(timerHandleRef.current);
    }
  }, [session, dispatch, restoreTurtleStateAfterResume]);

  /**
   * Stop the current session
   */
  const stopSession = useCallback(() => {
    clearStateTimeouts();
    dispatch({ type: 'STOP_SESSION' });
    
    if (timerHandleRef.current) {
      timerServiceRef.current.stop(timerHandleRef.current);
      timerHandleRef.current = null;
    }
  }, [dispatch, clearStateTimeouts]);

  /**
   * Provide a care item to the turtle
   */
  const provideItem = useCallback((itemType: CareItemType) => {
    if (!session || session.status !== 'running') {
      return;
    }

    const currentCount = itemType === 'carrot' ? session.carrotCount : session.waterCount;
    if (currentCount <= 0 || session.turtleState === 'eating' || session.turtleState === 'happy') {
      return;
    }

    clearStateTimeouts();

    const currentTime = Date.now();
    dispatch({
      type: 'PROVIDE_ITEM',
      payload: { itemType, timestamp: currentTime },
    });

    scheduleEatingToHappyTransition(EATING_DURATION_MS);
  }, [session, dispatch, clearStateTimeouts, scheduleEatingToHappyTransition]);

  // Cleanup timeouts and timer on unmount
  useEffect(() => {
    return () => {
      clearStateTimeouts();
      if (timerHandleRef.current) {
        timerServiceRef.current.stop(timerHandleRef.current);
      }
    };
  }, [clearStateTimeouts]);

  return {
    session,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    provideItem,
  };
}
