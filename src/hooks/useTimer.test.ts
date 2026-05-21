import { renderHook, act } from '@testing-library/react-native';
import { useTimer } from './useTimer';

describe('useTimer Hook - Unit Tests (RED Phase)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('Initialization with duration', () => {
    it('should initialize with the provided duration', () => {
      const { result } = renderHook(() => useTimer(60, jest.fn(), jest.fn()));

      expect(result.current.remainingTime).toBe(60);
    });

    it('should not start timer automatically on initialization', () => {
      const onTick = jest.fn();
      const onComplete = jest.fn();

      renderHook(() => useTimer(60, onTick, onComplete));

      // Advance time
      jest.advanceTimersByTime(2000);

      // Timer should not have ticked yet (not started)
      expect(onTick).not.toHaveBeenCalled();
    });
  });

  describe('Start timer', () => {
    it('should start the timer when start is called', () => {
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const { result } = renderHook(() => useTimer(60, onTick, onComplete));

      act(() => {
        result.current.start();
      });

      // Advance time by 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // onTick should have been called
      expect(onTick).toHaveBeenCalled();
    });

    it('should decrement remaining time when timer is running', () => {
      const { result } = renderHook(() => useTimer(10, jest.fn(), jest.fn()));

      act(() => {
        result.current.start();
      });

      const initialTime = result.current.remainingTime;

      // Advance time by 2 seconds
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Remaining time should have decreased
      expect(result.current.remainingTime).toBeLessThan(initialTime);
    });

    it('should call onTick callback with remaining time', () => {
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const { result } = renderHook(() => useTimer(60, onTick, onComplete));

      act(() => {
        result.current.start();
      });

      // Advance time by 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // onTick should have been called with remaining time
      expect(onTick).toHaveBeenCalledWith(expect.any(Number));
      expect(onTick.mock.calls[0][0]).toBeGreaterThan(0);
      expect(onTick.mock.calls[0][0]).toBeLessThanOrEqual(60);
    });
  });

  describe('Pause timer', () => {
    it('should pause the timer when pause is called', () => {
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const { result } = renderHook(() => useTimer(60, onTick, onComplete));

      act(() => {
        result.current.start();
      });

      // Advance time by 2 seconds
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Clear previous calls
      onTick.mockClear();

      // Pause the timer
      act(() => {
        result.current.pause();
      });

      // Advance time while paused
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // onTick should not have been called while paused
      expect(onTick).not.toHaveBeenCalled();
    });

    it('should preserve remaining time when paused', () => {
      const { result } = renderHook(() => useTimer(60, jest.fn(), jest.fn()));

      act(() => {
        result.current.start();
      });

      // Advance time by 5 seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      const remainingBeforePause = result.current.remainingTime;

      // Pause the timer
      act(() => {
        result.current.pause();
      });

      // Advance time while paused
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      const remainingAfterPause = result.current.remainingTime;

      // Remaining time should be preserved (within 1 second tolerance)
      expect(Math.abs(remainingBeforePause - remainingAfterPause)).toBeLessThanOrEqual(1);
    });
  });

  describe('Resume timer', () => {
    it('should resume the timer when resume is called', () => {
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const { result } = renderHook(() => useTimer(60, onTick, onComplete));

      act(() => {
        result.current.start();
      });

      // Pause the timer
      act(() => {
        result.current.pause();
      });

      // Clear previous calls
      onTick.mockClear();

      // Resume the timer
      act(() => {
        result.current.resume();
      });

      // Advance time
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // onTick should have been called after resume
      expect(onTick).toHaveBeenCalled();
    });

    it('should continue from paused time when resumed', () => {
      const { result } = renderHook(() => useTimer(60, jest.fn(), jest.fn()));

      act(() => {
        result.current.start();
      });

      // Advance time by 5 seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Pause the timer
      act(() => {
        result.current.pause();
      });

      const remainingAtPause = result.current.remainingTime;

      // Advance time while paused (should not affect timer)
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Resume the timer
      act(() => {
        result.current.resume();
      });

      const remainingAfterResume = result.current.remainingTime;

      // Should continue from paused time (within 1 second tolerance)
      expect(Math.abs(remainingAtPause - remainingAfterResume)).toBeLessThanOrEqual(1);
    });

    it('should decrement time after resume', () => {
      const { result } = renderHook(() => useTimer(60, jest.fn(), jest.fn()));

      act(() => {
        result.current.start();
      });

      // Pause the timer
      act(() => {
        result.current.pause();
      });

      // Resume the timer
      act(() => {
        result.current.resume();
      });

      const remainingAfterResume = result.current.remainingTime;

      // Advance time
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Time should have decreased after resume
      expect(result.current.remainingTime).toBeLessThan(remainingAfterResume);
    });
  });

  describe('Stop timer', () => {
    it('should stop the timer when stop is called', () => {
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const { result } = renderHook(() => useTimer(60, onTick, onComplete));

      act(() => {
        result.current.start();
      });

      // Clear previous calls
      onTick.mockClear();

      // Stop the timer
      act(() => {
        result.current.stop();
      });

      // Advance time after stop
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // onTick should not have been called after stop
      expect(onTick).not.toHaveBeenCalled();
    });

    it('should not call onComplete when stopped before completion', () => {
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const { result } = renderHook(() => useTimer(10, onTick, onComplete));

      act(() => {
        result.current.start();
      });

      // Stop before completion
      act(() => {
        result.current.stop();
      });

      // Advance time past completion
      act(() => {
        jest.advanceTimersByTime(15000);
      });

      // onComplete should not have been called
      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe('Timer completion callback', () => {
    it('should call onComplete when timer reaches 00:00', () => {
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const { result } = renderHook(() => useTimer(5, onTick, onComplete));

      act(() => {
        result.current.start();
      });

      // Advance time to completion
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // onComplete should have been called
      expect(onComplete).toHaveBeenCalled();
    });

    it('should have 0 remaining time when completed', () => {
      const { result } = renderHook(() => useTimer(5, jest.fn(), jest.fn()));

      act(() => {
        result.current.start();
      });

      // Advance time to completion
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Remaining time should be 0 or very close to 0
      expect(result.current.remainingTime).toBeLessThanOrEqual(1);
    });

    it('should call onComplete only once', () => {
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const { result } = renderHook(() => useTimer(5, onTick, onComplete));

      act(() => {
        result.current.start();
      });

      // Advance time past completion
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      // onComplete should have been called exactly once
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Remaining time updates', () => {
    it('should update remainingTime as timer runs', () => {
      const { result } = renderHook(() => useTimer(10, jest.fn(), jest.fn()));

      act(() => {
        result.current.start();
      });

      const times: number[] = [];
      times.push(result.current.remainingTime);

      // Advance time by 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      times.push(result.current.remainingTime);

      // Advance time by another 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      times.push(result.current.remainingTime);

      // Each subsequent time should be less than the previous
      expect(times[1]).toBeLessThan(times[0]);
      expect(times[2]).toBeLessThan(times[1]);
    });

    it('should provide accurate remaining time', () => {
      const { result } = renderHook(() => useTimer(60, jest.fn(), jest.fn()));

      act(() => {
        result.current.start();
      });

      // Advance time by 10 seconds
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      const remaining = result.current.remainingTime;

      // Remaining time should be approximately 50 seconds (within 1 second tolerance)
      expect(Math.abs(remaining - 50)).toBeLessThanOrEqual(1);
    });
  });

  describe('Cleanup on unmount', () => {
    it('should clean up timer when component unmounts', () => {
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const { result, unmount } = renderHook(() =>
        useTimer(60, onTick, onComplete)
      );

      act(() => {
        result.current.start();
      });

      // Clear previous calls
      onTick.mockClear();

      // Unmount the hook
      unmount();

      // Advance time after unmount
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // onTick should not have been called after unmount
      expect(onTick).not.toHaveBeenCalled();
    });

    it('should not call onComplete after unmount', () => {
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const { result, unmount } = renderHook(() =>
        useTimer(5, onTick, onComplete)
      );

      act(() => {
        result.current.start();
      });

      // Unmount before completion
      unmount();

      // Advance time past completion
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      // onComplete should not have been called after unmount
      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe('Multiple pause-resume cycles', () => {
    it('should handle multiple pause-resume cycles correctly', () => {
      const { result } = renderHook(() => useTimer(60, jest.fn(), jest.fn()));

      act(() => {
        result.current.start();
      });

      // First cycle
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      act(() => {
        result.current.pause();
      });
      const remaining1 = result.current.remainingTime;

      act(() => {
        result.current.resume();
      });

      // Second cycle
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      act(() => {
        result.current.pause();
      });
      const remaining2 = result.current.remainingTime;

      act(() => {
        result.current.resume();
      });

      // Third cycle
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      const remaining3 = result.current.remainingTime;

      // Each remaining time should be less than the previous
      expect(remaining2).toBeLessThan(remaining1);
      expect(remaining3).toBeLessThan(remaining2);
    });
  });

  describe('Edge cases', () => {
    it('should handle pause when timer is not running', () => {
      const { result } = renderHook(() => useTimer(60, jest.fn(), jest.fn()));

      // Pause without starting
      expect(() => {
        act(() => {
          result.current.pause();
        });
      }).not.toThrow();
    });

    it('should handle resume when timer is not paused', () => {
      const { result } = renderHook(() => useTimer(60, jest.fn(), jest.fn()));

      act(() => {
        result.current.start();
      });

      // Resume without pausing
      expect(() => {
        act(() => {
          result.current.resume();
        });
      }).not.toThrow();
    });

    it('should handle stop when timer is not running', () => {
      const { result } = renderHook(() => useTimer(60, jest.fn(), jest.fn()));

      // Stop without starting
      expect(() => {
        act(() => {
          result.current.stop();
        });
      }).not.toThrow();
    });

    it('should handle very short duration (1 second)', () => {
      const onComplete = jest.fn();

      const { result } = renderHook(() => useTimer(1, jest.fn(), onComplete));

      act(() => {
        result.current.start();
      });

      // Advance time to completion
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Should complete successfully
      expect(onComplete).toHaveBeenCalled();
    });

    it('should handle long duration (180 seconds)', () => {
      const { result } = renderHook(() => useTimer(180, jest.fn(), jest.fn()));

      act(() => {
        result.current.start();
      });

      // Advance time by 60 seconds
      act(() => {
        jest.advanceTimersByTime(60000);
      });

      // Should still be running with approximately 120 seconds remaining
      expect(result.current.remainingTime).toBeGreaterThan(110);
      expect(result.current.remainingTime).toBeLessThanOrEqual(120);
    });
  });
});
