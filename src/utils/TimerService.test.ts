import * as fc from 'fast-check';
import { TimerService } from './TimerService';

describe('TimerService - Property-Based Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('Property 5: Pause-Resume Time Preservation', () => {
    it('should preserve remaining time when pausing and immediately resuming', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 5, max: 180 }), // duration in seconds (at least 5 to allow pause)
          (duration) => {
            const timerService = new TimerService();
            let currentRemaining = duration;

            const onTick = (remaining: number) => {
              currentRemaining = remaining;
            };
            const onComplete = jest.fn();

            // Start timer
            const handle = timerService.start(duration, onTick, onComplete);

            // Wait a bit (simulate some time passing)
            jest.advanceTimersByTime(2000); // 2 seconds

            // Get remaining time before pause
            const remainingBeforePause = timerService.getRemainingTime(handle);

            // Pause immediately
            timerService.pause(handle);

            // Get remaining time after pause
            const remainingAfterPause = timerService.getRemainingTime(handle);

            // Resume immediately
            timerService.resume(handle);

            // Get remaining time after resume
            const remainingAfterResume = timerService.getRemainingTime(handle);

            // Cleanup
            timerService.stop(handle);

            // Verify time preservation (within 1 second tolerance)
            expect(Math.abs(remainingBeforePause - remainingAfterPause)).toBeLessThanOrEqual(1);
            expect(Math.abs(remainingAfterPause - remainingAfterResume)).toBeLessThanOrEqual(1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve remaining time across multiple pause-resume cycles', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 10, max: 60 }), // duration in seconds
          fc.integer({ min: 2, max: 5 }), // number of pause-resume cycles
          (duration, cycles) => {
            const timerService = new TimerService();
            let currentRemaining = duration;

            const onTick = (remaining: number) => {
              currentRemaining = remaining;
            };
            const onComplete = jest.fn();

            // Start timer
            const handle = timerService.start(duration, onTick, onComplete);

            let previousRemaining = duration;

            // Perform multiple pause-resume cycles
            for (let i = 0; i < cycles; i++) {
              // Wait a bit
              jest.advanceTimersByTime(1000);

              // Pause
              timerService.pause(handle);
              const remainingAfterPause = timerService.getRemainingTime(handle);

              // Resume
              timerService.resume(handle);
              const remainingAfterResume = timerService.getRemainingTime(handle);

              // Verify time preservation (within 1 second tolerance)
              expect(Math.abs(remainingAfterPause - remainingAfterResume)).toBeLessThanOrEqual(1);

              // Verify time is decreasing
              expect(remainingAfterResume).toBeLessThanOrEqual(previousRemaining);
              previousRemaining = remainingAfterResume;
            }

            // Cleanup
            timerService.stop(handle);
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});

describe('TimerService - Unit Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('Timer Initialization', () => {
    it('should initialize timer with valid duration', () => {
      const timerService = new TimerService();
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const handle = timerService.start(60, onTick, onComplete);

      expect(handle).toBeDefined();
      expect(handle.id).toBeDefined();
      expect(handle.intervalId).toBeDefined();
      expect(handle.totalDuration).toBe(60);

      // Cleanup
      timerService.stop(handle);
    });

    it('should start with full duration remaining', () => {
      const timerService = new TimerService();
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const handle = timerService.start(120, onTick, onComplete);
      const remaining = timerService.getRemainingTime(handle);

      expect(remaining).toBe(120);

      // Cleanup
      timerService.stop(handle);
    });
  });

  describe('Timer Tick Accuracy', () => {
    it('should tick every second with 1 second tolerance', () => {
      const timerService = new TimerService();
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const handle = timerService.start(10, onTick, onComplete);

      // Advance time by 1 second
      jest.advanceTimersByTime(1000);

      // Should have called onTick with remaining time
      expect(onTick).toHaveBeenCalled();
      const remaining = timerService.getRemainingTime(handle);
      expect(remaining).toBeGreaterThanOrEqual(8);
      expect(remaining).toBeLessThanOrEqual(10);

      // Cleanup
      timerService.stop(handle);
    });

    it('should maintain cumulative accuracy within 1 second tolerance', () => {
      const timerService = new TimerService();
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const duration = 60;
      const handle = timerService.start(duration, onTick, onComplete);

      // Advance time by 30 seconds
      jest.advanceTimersByTime(30000);

      const remaining = timerService.getRemainingTime(handle);
      const elapsed = duration - remaining;

      // Verify elapsed time is within 1 second tolerance
      expect(Math.abs(elapsed - 30)).toBeLessThanOrEqual(1);

      // Cleanup
      timerService.stop(handle);
    });
  });

  describe('Pause Functionality', () => {
    it('should preserve remaining time when paused', () => {
      const timerService = new TimerService();
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const handle = timerService.start(60, onTick, onComplete);

      // Advance time by 10 seconds
      jest.advanceTimersByTime(10000);

      const remainingBeforePause = timerService.getRemainingTime(handle);

      // Pause
      timerService.pause(handle);

      // Advance time while paused
      jest.advanceTimersByTime(5000);

      const remainingAfterPause = timerService.getRemainingTime(handle);

      // Time should not have changed while paused (within 1 second tolerance)
      expect(Math.abs(remainingBeforePause - remainingAfterPause)).toBeLessThanOrEqual(1);

      // Cleanup
      timerService.stop(handle);
    });

    it('should not call onTick while paused', () => {
      const timerService = new TimerService();
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const handle = timerService.start(60, onTick, onComplete);

      // Clear previous calls
      onTick.mockClear();

      // Pause
      timerService.pause(handle);

      // Advance time while paused
      jest.advanceTimersByTime(5000);

      // onTick should not have been called while paused
      expect(onTick).not.toHaveBeenCalled();

      // Cleanup
      timerService.stop(handle);
    });
  });

  describe('Resume Functionality', () => {
    it('should continue from paused time when resumed', () => {
      const timerService = new TimerService();
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const handle = timerService.start(60, onTick, onComplete);

      // Advance time by 10 seconds
      jest.advanceTimersByTime(10000);

      // Pause
      timerService.pause(handle);
      const remainingAtPause = timerService.getRemainingTime(handle);

      // Advance time while paused (should not affect timer)
      jest.advanceTimersByTime(5000);

      // Resume
      timerService.resume(handle);
      const remainingAfterResume = timerService.getRemainingTime(handle);

      // Should continue from paused time (within 1 second tolerance)
      expect(Math.abs(remainingAtPause - remainingAfterResume)).toBeLessThanOrEqual(1);

      // Advance time after resume
      jest.advanceTimersByTime(5000);

      const remainingAfterMoreTime = timerService.getRemainingTime(handle);

      // Time should have decreased after resume
      expect(remainingAfterMoreTime).toBeLessThan(remainingAfterResume);

      // Cleanup
      timerService.stop(handle);
    });

    it('should call onTick after resume', () => {
      const timerService = new TimerService();
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const handle = timerService.start(60, onTick, onComplete);

      // Pause
      timerService.pause(handle);

      // Clear previous calls
      onTick.mockClear();

      // Resume
      timerService.resume(handle);

      // Advance time
      jest.advanceTimersByTime(1000);

      // onTick should have been called after resume
      expect(onTick).toHaveBeenCalled();

      // Cleanup
      timerService.stop(handle);
    });
  });

  describe('Stop Functionality', () => {
    it('should clear interval when stopped', () => {
      const timerService = new TimerService();
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const handle = timerService.start(60, onTick, onComplete);

      // Clear previous calls
      onTick.mockClear();

      // Stop
      timerService.stop(handle);

      // Advance time after stop
      jest.advanceTimersByTime(5000);

      // onTick should not have been called after stop
      expect(onTick).not.toHaveBeenCalled();
    });

    it('should not call onComplete when stopped before completion', () => {
      const timerService = new TimerService();
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const handle = timerService.start(60, onTick, onComplete);

      // Stop before completion
      timerService.stop(handle);

      // Advance time past completion
      jest.advanceTimersByTime(70000);

      // onComplete should not have been called
      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe('Completion Callback', () => {
    it('should trigger onComplete callback when timer reaches 00:00', () => {
      const timerService = new TimerService();
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const handle = timerService.start(5, onTick, onComplete);

      // Advance time to completion
      jest.advanceTimersByTime(5000);

      // onComplete should have been called
      expect(onComplete).toHaveBeenCalled();

      // Cleanup
      timerService.stop(handle);
    });

    it('should have 0 remaining time when completed', () => {
      const timerService = new TimerService();
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const handle = timerService.start(5, onTick, onComplete);

      // Advance time to completion
      jest.advanceTimersByTime(5000);

      const remaining = timerService.getRemainingTime(handle);

      // Remaining time should be 0 (or very close to 0)
      expect(remaining).toBeLessThanOrEqual(1);

      // Cleanup
      timerService.stop(handle);
    });

    it('should call onComplete only once', () => {
      const timerService = new TimerService();
      const onTick = jest.fn();
      const onComplete = jest.fn();

      const handle = timerService.start(5, onTick, onComplete);

      // Advance time past completion
      jest.advanceTimersByTime(10000);

      // onComplete should have been called exactly once
      expect(onComplete).toHaveBeenCalledTimes(1);

      // Cleanup
      timerService.stop(handle);
    });
  });
});
