import { useCallback, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { CareItemType } from '../types';
import { TimerService, TimerHandle } from '../utils/TimerService';

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
   * Handle timer tick - update remaining time
   */
  const handleTick = useCallback((_remainingSeconds: number) => {
    dispatch({ type: 'TICK' });
  }, [dispatch]);

  /**
   * Handle timer completion - transition to arrived state
   */
  const handleComplete = useCallback(() => {
    // Clear any pending eating/happy transitions
    if (eatingTimeoutRef.current) {
      clearTimeout(eatingTimeoutRef.current);
      eatingTimeoutRef.current = null;
    }
    if (happyTimeoutRef.current) {
      clearTimeout(happyTimeoutRef.current);
      happyTimeoutRef.current = null;
    }

    // Transition to arrived state
    dispatch({ type: 'UPDATE_TURTLE_STATE', payload: { turtleState: 'arrived' } });
    dispatch({ type: 'COMPLETE_SESSION' });
  }, [dispatch]);

  /**
   * Start a new study session with the specified duration
   */
  const startSession = useCallback((durationSeconds: number) => {
    // Convert seconds to minutes for the reducer
    const durationMinutes = durationSeconds / 60;
    
    dispatch({
      type: 'START_SESSION',
      payload: {
        duration: durationMinutes,
      },
    });

    // Start the timer with the duration in seconds
    timerHandleRef.current = timerServiceRef.current.start(
      durationSeconds,
      handleTick,
      handleComplete
    );
  }, [dispatch, handleTick, handleComplete]);

  /**
   * Pause the current session
   */
  const pauseSession = useCallback(() => {
    if (!session || session.status !== 'running') {
      return;
    }

    // Clear any pending timeouts
    if (eatingTimeoutRef.current) {
      clearTimeout(eatingTimeoutRef.current);
      eatingTimeoutRef.current = null;
    }
    if (happyTimeoutRef.current) {
      clearTimeout(happyTimeoutRef.current);
      happyTimeoutRef.current = null;
    }

    const currentTime = Date.now();
    dispatch({
      type: 'PAUSE_SESSION',
      payload: { currentTime },
    });

    // Pause the timer
    if (timerHandleRef.current) {
      timerServiceRef.current.pause(timerHandleRef.current);
    }
  }, [session, dispatch]);

  /**
   * Resume the paused session
   */
  const resumeSession = useCallback(() => {
    if (!session || session.status !== 'paused') {
      return;
    }

    const currentTime = Date.now();
    dispatch({ type: 'RESUME_SESSION', payload: { currentTime } });

    // Restore eating/happy state with remaining duration if needed
    if (session.previousStateBeforePause === 'eating' && session.remainingEatingDuration) {
      dispatch({
        type: 'UPDATE_TURTLE_STATE',
        payload: {
          turtleState: 'eating',
          timestamp: currentTime,
        },
      });

      eatingTimeoutRef.current = setTimeout(() => {
        // Transition to happy state
        dispatch({
          type: 'UPDATE_TURTLE_STATE',
          payload: {
            turtleState: 'happy',
            timestamp: Date.now(),
          },
        });

        happyTimeoutRef.current = setTimeout(() => {
          // Transition back to walking
          dispatch({
            type: 'UPDATE_TURTLE_STATE',
            payload: { turtleState: 'walking' },
          });
        }, 3000);
      }, session.remainingEatingDuration);
    } else if (session.previousStateBeforePause === 'happy' && session.remainingHappyDuration) {
      dispatch({
        type: 'UPDATE_TURTLE_STATE',
        payload: {
          turtleState: 'happy',
          timestamp: currentTime,
        },
      });

      happyTimeoutRef.current = setTimeout(() => {
        // Transition back to walking
        dispatch({
          type: 'UPDATE_TURTLE_STATE',
          payload: { turtleState: 'walking' },
        });
      }, session.remainingHappyDuration);
    }

    // Resume the timer
    if (timerHandleRef.current) {
      timerServiceRef.current.resume(timerHandleRef.current);
    }
  }, [session, dispatch]);

  /**
   * Stop the current session
   */
  const stopSession = useCallback(() => {
    // Clear any pending timeouts
    if (eatingTimeoutRef.current) {
      clearTimeout(eatingTimeoutRef.current);
      eatingTimeoutRef.current = null;
    }
    if (happyTimeoutRef.current) {
      clearTimeout(happyTimeoutRef.current);
      happyTimeoutRef.current = null;
    }

    dispatch({ type: 'STOP_SESSION' });
    
    // Stop the timer
    if (timerHandleRef.current) {
      timerServiceRef.current.stop(timerHandleRef.current);
      timerHandleRef.current = null;
    }
  }, [dispatch]);

  /**
   * Provide a care item to the turtle
   */
  const provideItem = useCallback((itemType: CareItemType) => {
    if (!session || session.status !== 'running') {
      return;
    }

    // Check if item count is available
    const currentCount = itemType === 'carrot' ? session.carrotCount : session.waterCount;
    if (currentCount <= 0) {
      return;
    }

    // Check if turtle is already in eating or happy state
    if (session.turtleState === 'eating' || session.turtleState === 'happy') {
      return;
    }

    // Clear any existing timeouts
    if (eatingTimeoutRef.current) {
      clearTimeout(eatingTimeoutRef.current);
      eatingTimeoutRef.current = null;
    }
    if (happyTimeoutRef.current) {
      clearTimeout(happyTimeoutRef.current);
      happyTimeoutRef.current = null;
    }

    const currentTime = Date.now();
    
    // Dispatch PROVIDE_ITEM action to decrement count and transition to eating
    dispatch({
      type: 'PROVIDE_ITEM',
      payload: {
        itemType,
        timestamp: currentTime,
      },
    });

    // Schedule transition to happy state after 1 second
    eatingTimeoutRef.current = setTimeout(() => {
      dispatch({
        type: 'UPDATE_TURTLE_STATE',
        payload: {
          turtleState: 'happy',
          timestamp: Date.now(),
        },
      });

      // Schedule transition back to walking after 3 seconds
      happyTimeoutRef.current = setTimeout(() => {
        dispatch({
          type: 'UPDATE_TURTLE_STATE',
          payload: { turtleState: 'walking' },
        });
      }, 3000);
    }, 1000);
  }, [session, dispatch]);

  // Cleanup timeouts and timer on unmount
  useEffect(() => {
    return () => {
      if (eatingTimeoutRef.current) {
        clearTimeout(eatingTimeoutRef.current);
      }
      if (happyTimeoutRef.current) {
        clearTimeout(happyTimeoutRef.current);
      }
      if (timerHandleRef.current) {
        timerServiceRef.current.stop(timerHandleRef.current);
      }
    };
  }, []);

  return {
    session,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    provideItem,
  };
}
