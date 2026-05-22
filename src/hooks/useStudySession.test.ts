import { renderHook, act } from '@testing-library/react-native';
import { useStudySession } from './useStudySession';
import { CareItemType } from '../types';

/**
 * Unit Tests for useStudySession Hook (RED Phase)
 * Feature: turtle-study-app
 * 
 * These tests are written BEFORE implementation (TDD RED phase).
 * All tests should FAIL until the hook is implemented.
 */

describe('useStudySession Hook - Unit Tests (RED Phase)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  // ============================================================================
  // Start Session with Duration
  // ============================================================================

  describe('Start session with duration', () => {
    it('should initialize session with provided duration', () => {
      const { result } = renderHook(() => useStudySession());

      act(() => {
        result.current.startSession(60);
      });

      expect(result.current.session).not.toBeNull();
      expect(result.current.session?.totalDuration).toBe(60);
      expect(result.current.session?.remainingTime).toBe(60);
    });

    it('should initialize session with running status', () => {
      const { result } = renderHook(() => useStudySession());

      act(() => {
        result.current.startSession(60);
      });

      expect(result.current.session?.status).toBe('running');
    });

    it('should initialize turtle in walking state', () => {
      const { result } = renderHook(() => useStudySession());

      act(() => {
        result.current.startSession(60);
      });

      expect(result.current.session?.turtleState).toBe('walking');
    });

    it('should initialize carrot count to 3', () => {
      const { result } = renderHook(() => useStudySession());

      act(() => {
        result.current.startSession(60);
      });

      expect(result.current.session?.carrotCount).toBe(3);
    });

    it('should initialize water count to 3', () => {
      const { result } = renderHook(() => useStudySession());

      act(() => {
        result.current.startSession(60);
      });

      expect(result.current.session?.waterCount).toBe(3);
    });
  });

  // ============================================================================
  // Pause Session
  // ============================================================================

  describe('Pause session', () => {
    it('should change status to paused when pause is called', () => {
      const { result } = renderHook(() => useStudySession());

      act(() => {
        result.current.startSession(60);
      });

      act(() => {
        result.current.pauseSession();
      });

      expect(result.current.session?.status).toBe('paused');
    });

    it('should change turtle to sleeping state when paused', () => {
      const { result } = renderHook(() => useStudySession());

      act(() => {
        result.current.startSession(60);
      });

      act(() => {
        result.current.pauseSession();
      });

      expect(result.current.session?.turtleState).toBe('sleeping');
    });

    it('should preserve remaining time when paused', () => {
      const { result } = renderHook(() => useStudySession());

      act(() => {
        result.current.startSession(60);
      });

      // Advance time by 5 seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      const remainingBeforePause = result.current.session?.remainingTime;

      act(() => {
        result.current.pauseSession();
      });

      // Advance time while paused
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      const remainingAfterPause = result.current.session?.remainingTime;

      // Remaining time should be preserved (within 1 second tolerance)
      expect(
        Math.abs((remainingBeforePause ?? 0) - (remainingAfterPause ?? 0))
      ).toBeLessThanOrEqual(1);
    });

    it('should store previous state when paused from walking', () => {
      const { result } = renderHook(() => useStudySession());

      act(() => {
        result.current.startSession(60);
      });

      act(() => {
        result.current.pauseSession();
      });

      expect(result.current.session?.previousStateBeforePause).toBe('walking');
    });
  });
});
