/**
 * Integration Tests for Turtle Study App
 * 
 * These tests verify end-to-end user flows across multiple components:
 * - Complete study session flow (start → timer → completion)
 * - Pause/resume flow (start → pause → resume → complete)
 * - Care item interaction flow (start → give item → turtle eats → continues walking)
 * - Error recovery flows (timer errors, state transition errors)
 * - Navigation flows between screens
 * 
 * Task 17.1: Write integration tests (RED)
 * These tests are expected to FAIL initially as they test complete flows
 * that require full integration between components.
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { AppProvider } from '../context/AppContext';
import { HomeScreen } from '../screens/HomeScreen';
import { StudySessionScreen } from '../screens/StudySessionScreen';
import { CompletionScreen } from '../screens/CompletionScreen';

// Setup fake timers for all tests
beforeEach(() => {
  jest.useFakeTimers({ doNotFake: ['nextTick'] });
  jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('Integration Tests - Complete User Flows', () => {
  describe('Complete Study Session Flow', () => {
    it('should complete full session from start to completion with arrived state', async () => {
      // User opens app and sees home screen
      const { getByTestId, getByText, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // User sees time input popup
      const timeInput = getByTestId('time-input-field');
      expect(timeInput).toBeTruthy();

      // User enters 1 minute duration
      fireEvent.changeText(timeInput, '1');
      
      // User taps start button
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      // Session should start - render StudySessionScreen
      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      // Verify session started with timer at 01:00
      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('01:00');

      // Verify turtle is in walking state at start
      expect(getByTestId('turtle-character-walking')).toBeTruthy();

      // Verify progress bar shows 0% at start
      const progressBar = getByTestId('progress-bar');
      expect(progressBar.props.progress).toBe(0);

      // Fast-forward time to completion (60 seconds)
      act(() => {
        jest.advanceTimersByTime(60000);
      });

      // Timer should reach 00:00
      await waitFor(() => {
        expect(timer.props.children).toBe('00:00');
      });

      // Turtle should transition to arrived state (turtle_arrived.png static, NO bouncing)
      await waitFor(() => {
        expect(getByTestId('turtle-character-arrived')).toBeTruthy();
      });

      // Progress bar should show 100%
      await waitFor(() => {
        expect(progressBar.props.progress).toBe(100);
      });

      // Completion screen should appear within 500ms
      rerender(
        <AppProvider>
          <CompletionScreen />
        </AppProvider>
      );

      await waitFor(() => {
        expect(getByText(/완료/)).toBeTruthy();
      });
    });

    it('should display turtle always facing rightward during session', () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '2');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      // Verify turtle faces rightward at start
      const turtle = getByTestId('turtle-character-walking');
      expect(turtle).toBeTruthy();

      // Advance time and verify turtle still faces rightward
      act(() => {
        jest.advanceTimersByTime(30000); // 30 seconds
      });

      // Turtle should still be walking and facing rightward
      expect(getByTestId('turtle-character-walking')).toBeTruthy();
    });

    it('should update progress bar mini turtle slider as time progresses', () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '2');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      // Verify mini turtle slider exists
      const miniTurtleSlider = getByTestId('progress-bar-turtle-slider');
      expect(miniTurtleSlider).toBeTruthy();

      // Progress should be 0% at start
      const progressBar = getByTestId('progress-bar');
      expect(progressBar.props.progress).toBe(0);

      // Advance time to 50% completion
      act(() => {
        jest.advanceTimersByTime(60000); // 60 seconds = 50% of 2 minutes
      });

      // Progress should be around 50%
      expect(progressBar.props.progress).toBeGreaterThan(45);
      expect(progressBar.props.progress).toBeLessThan(55);
    });
  });

  describe('Pause/Resume Flow', () => {
    it('should handle complete pause/resume flow with timer and turtle state preservation', async () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '2');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      // Verify initial state
      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('02:00');
      expect(getByTestId('turtle-character-walking')).toBeTruthy();

      // Advance time by 30 seconds
      act(() => {
        jest.advanceTimersByTime(30000);
      });

      // Timer should show 01:30
      expect(timer.props.children).toBe('01:30');

      // User pauses session
      const pauseButton = getByTestId('pause-button');
      fireEvent.press(pauseButton);

      // Turtle should transition to sleeping state
      await waitFor(() => {
        expect(getByTestId('turtle-character-sleeping')).toBeTruthy();
      });

      // Timer should freeze at 01:30
      expect(timer.props.children).toBe('01:30');

      // Advance time while paused - timer should not change
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(timer.props.children).toBe('01:30');

      // User resumes session
      const resumeButton = getByTestId('resume-button');
      fireEvent.press(resumeButton);

      // Turtle should return to walking state
      await waitFor(() => {
        expect(getByTestId('turtle-character-walking')).toBeTruthy();
      });

      // Timer should continue from 01:30
      expect(timer.props.children).toBe('01:30');

      // Advance time by 30 more seconds
      act(() => {
        jest.advanceTimersByTime(30000);
      });

      // Timer should now show 01:00
      expect(timer.props.children).toBe('01:00');
    });

    it('should preserve turtle position when pausing and resuming', () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '2');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      // Advance to 50% progress
      act(() => {
        jest.advanceTimersByTime(60000);
      });

      const progressBar = getByTestId('progress-bar');
      const progressBeforePause = progressBar.props.progress;

      // Pause
      const pauseButton = getByTestId('pause-button');
      fireEvent.press(pauseButton);

      // Progress should remain the same
      expect(progressBar.props.progress).toBe(progressBeforePause);

      // Resume
      const resumeButton = getByTestId('resume-button');
      fireEvent.press(resumeButton);

      // Progress should still be the same
      expect(progressBar.props.progress).toBe(progressBeforePause);
    });

    it('should disable care items panel when session is paused', () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '1');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      // Care panel should be enabled initially
      const carePanel = getByTestId('care-items-panel-container');
      expect(carePanel.props.disabled).toBe(false);

      // Pause session
      const pauseButton = getByTestId('pause-button');
      fireEvent.press(pauseButton);

      // Care panel should be disabled
      expect(carePanel.props.disabled).toBe(true);

      // Resume session
      const resumeButton = getByTestId('resume-button');
      fireEvent.press(resumeButton);

      // Care panel should be enabled again
      expect(carePanel.props.disabled).toBe(false);
    });
  });

  describe('Care Item Interaction Flow', () => {
    it('should handle complete care item flow: give item → eating → happy → walking', async () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '3');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      // Verify initial state
      expect(getByTestId('turtle-character-walking')).toBeTruthy();

      // Verify initial carrot count is 3
      const carePanel = getByTestId('care-items-panel-container');
      expect(carePanel.props.carrotCount).toBe(3);

      // User gives carrot
      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);

      // Carrot count should decrement to 2
      expect(carePanel.props.carrotCount).toBe(2);

      // Turtle should immediately transition to eating state (turtle_eating.jpeg)
      await waitFor(() => {
        expect(getByTestId('turtle-character-eating')).toBeTruthy();
      });

      // Care panel should be disabled during eating
      expect(carePanel.props.disabled).toBe(true);

      // After 1 second, turtle should transition to happy state (turtle_happy.jpeg with heart)
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(getByTestId('turtle-character-happy')).toBeTruthy();
      });

      // Care panel should still be disabled during happy
      expect(carePanel.props.disabled).toBe(true);

      // After 3 more seconds, turtle should return to walking state
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(getByTestId('turtle-character-walking')).toBeTruthy();
      });

      // Care panel should be enabled again
      expect(carePanel.props.disabled).toBe(false);

      // Carrot count should still be 2
      expect(carePanel.props.carrotCount).toBe(2);
    });

    it('should handle water item with same eating → happy → walking flow', async () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '3');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      // Verify initial water count is 3
      const carePanel = getByTestId('care-items-panel-container');
      expect(carePanel.props.waterCount).toBe(3);

      // User gives water
      const waterButton = getByTestId('water-button');
      fireEvent.press(waterButton);

      // Water count should decrement to 2
      expect(carePanel.props.waterCount).toBe(2);

      // Turtle should transition to eating state
      await waitFor(() => {
        expect(getByTestId('turtle-character-eating')).toBeTruthy();
      });

      // After 1 second, transition to happy
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(getByTestId('turtle-character-happy')).toBeTruthy();
      });

      // After 3 more seconds, return to walking
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(getByTestId('turtle-character-walking')).toBeTruthy();
      });
    });

    it('should disable individual button when count reaches 0', async () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '10');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      const carrotButton = getByTestId('carrot-button');
      const carePanel = getByTestId('care-items-panel-container');

      // Use all 3 carrots
      for (let i = 0; i < 3; i++) {
        fireEvent.press(carrotButton);
        
        // Wait for eating + happy cycle to complete
        act(() => {
          jest.advanceTimersByTime(4000); // 1s eating + 3s happy
        });
      }

      // Carrot count should be 0
      expect(carePanel.props.carrotCount).toBe(0);

      // Carrot button should be disabled
      expect(carrotButton.props.disabled).toBe(true);

      // Water button should still be enabled
      const waterButton = getByTestId('water-button');
      expect(waterButton.props.disabled).toBe(false);
    });

    it('should play shake animation when depleted button is tapped', () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '10');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      const carrotButton = getByTestId('carrot-button');

      // Use all 3 carrots
      for (let i = 0; i < 3; i++) {
        fireEvent.press(carrotButton);
        act(() => {
          jest.advanceTimersByTime(4000);
        });
      }

      // Tap depleted button
      fireEvent.press(carrotButton);

      // Should trigger shake animation (verified by animation state or class)
      // This test verifies the tap is handled, actual animation is visual
      expect(carrotButton.props.disabled).toBe(true);
    });

    it('should debounce rapid taps on care item buttons', () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '5');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      const carrotButton = getByTestId('carrot-button');
      const carePanel = getByTestId('care-items-panel-container');

      // Rapid tap 3 times within 1 second
      fireEvent.press(carrotButton);
      fireEvent.press(carrotButton);
      fireEvent.press(carrotButton);

      // Only first tap should be processed
      expect(carePanel.props.carrotCount).toBe(2);
    });
  });

  describe('Timer Completion During Eating/Happy State', () => {
    it('should immediately transition to arrived if timer completes during eating state', async () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start very short session (1 minute)
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '1');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      // Advance to near end (59 seconds)
      act(() => {
        jest.advanceTimersByTime(59000);
      });

      // Give care item to trigger eating state
      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);

      // Verify eating state
      await waitFor(() => {
        expect(getByTestId('turtle-character-eating')).toBeTruthy();
      });

      // Complete timer during eating state
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Should immediately transition to arrived state (turtle_arrived.png static, NO bouncing)
      await waitFor(() => {
        expect(getByTestId('turtle-character-arrived')).toBeTruthy();
      });

      // Should NOT transition to happy state
      expect(() => getByTestId('turtle-character-happy')).toThrow();
    });

    it('should immediately transition to arrived if timer completes during happy state', async () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start very short session (1 minute)
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '1');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      // Advance to near end (58 seconds)
      act(() => {
        jest.advanceTimersByTime(58000);
      });

      // Give care item
      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);

      // Wait for eating state to complete and transition to happy
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(getByTestId('turtle-character-happy')).toBeTruthy();
      });

      // Complete timer during happy state
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Should immediately transition to arrived state
      await waitFor(() => {
        expect(getByTestId('turtle-character-arrived')).toBeTruthy();
      });

      // Should NOT return to walking state
      expect(() => getByTestId('turtle-character-walking')).toThrow();
    });

    it('should clear all async intervals when transitioning to arrived during eating/happy', async () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '1');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      // Advance to near end
      act(() => {
        jest.advanceTimersByTime(59000);
      });

      // Give care item
      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);

      // Complete timer
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Should be in arrived state
      await waitFor(() => {
        expect(getByTestId('turtle-character-arrived')).toBeTruthy();
      });

      // Advance time further - should remain in arrived state
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      // Should still be in arrived state (no further transitions)
      expect(getByTestId('turtle-character-arrived')).toBeTruthy();
    });
  });

  describe('Pause During Eating/Happy State', () => {
    it('should preserve remaining eating duration when paused during eating', async () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '5');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      // Give care item
      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);

      // Verify eating state
      await waitFor(() => {
        expect(getByTestId('turtle-character-eating')).toBeTruthy();
      });

      // Pause after 500ms of eating (should have 500ms remaining)
      act(() => {
        jest.advanceTimersByTime(500);
      });

      const pauseButton = getByTestId('pause-button');
      fireEvent.press(pauseButton);

      // Should transition to sleeping
      await waitFor(() => {
        expect(getByTestId('turtle-character-sleeping')).toBeTruthy();
      });

      // Resume
      const resumeButton = getByTestId('resume-button');
      fireEvent.press(resumeButton);

      // Should restore eating state
      await waitFor(() => {
        expect(getByTestId('turtle-character-eating')).toBeTruthy();
      });

      // After remaining 500ms, should transition to happy
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(getByTestId('turtle-character-happy')).toBeTruthy();
      });
    });

    it('should preserve remaining happy duration when paused during happy', async () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '5');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      // Give care item and wait for happy state
      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);

      act(() => {
        jest.advanceTimersByTime(1000); // eating completes
      });

      await waitFor(() => {
        expect(getByTestId('turtle-character-happy')).toBeTruthy();
      });

      // Pause after 1500ms of happy (should have 1500ms remaining)
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      const pauseButton = getByTestId('pause-button');
      fireEvent.press(pauseButton);

      // Should transition to sleeping
      await waitFor(() => {
        expect(getByTestId('turtle-character-sleeping')).toBeTruthy();
      });

      // Resume
      const resumeButton = getByTestId('resume-button');
      fireEvent.press(resumeButton);

      // Should restore happy state
      await waitFor(() => {
        expect(getByTestId('turtle-character-happy')).toBeTruthy();
      });

      // After remaining 1500ms, should transition to walking
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(getByTestId('turtle-character-walking')).toBeTruthy();
      });
    });
  });

  describe('Stop Flow with Confirmation Dialog', () => {
    it('should show confirmation dialog and stop session when confirmed', async () => {
      const { getByTestId, getByText, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '3');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      // Advance time
      act(() => {
        jest.advanceTimersByTime(30000);
      });

      // User taps stop button
      const stopButton = getByTestId('stop-button');
      fireEvent.press(stopButton);

      // Confirmation dialog should appear
      await waitFor(() => {
        expect(getByText('세션을 종료하시겠습니까?')).toBeTruthy();
      });

      // User confirms stop
      const confirmButton = getByTestId('stop-confirmation-dialog-confirm');
      fireEvent.press(confirmButton);

      // Session should end and return to home screen
      rerender(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      await waitFor(() => {
        expect(getByTestId('home-screen')).toBeTruthy();
      });
    });

    it('should dismiss dialog and maintain session when stop is cancelled', async () => {
      const { getByTestId, getByText, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '3');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      const timer = getByTestId('timer-display');
      const timerBefore = timer.props.children;

      // User taps stop button
      const stopButton = getByTestId('stop-button');
      fireEvent.press(stopButton);

      // Confirmation dialog should appear
      await waitFor(() => {
        expect(getByText('세션을 종료하시겠습니까?')).toBeTruthy();
      });

      // User cancels stop
      const cancelButton = getByTestId('stop-confirmation-dialog-cancel');
      fireEvent.press(cancelButton);

      // Session should continue
      expect(timer.props.children).toBe(timerBefore);
      expect(getByTestId('study-session-screen')).toBeTruthy();
    });
  });

  describe('Error Recovery Flows', () => {
    it('should handle non-interactive area touches without any response', () => {
      const { getByTestId, queryByText, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '2');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      const timer = getByTestId('timer-display');
      const progressBar = getByTestId('progress-bar');
      const timerBefore = timer.props.children;
      const progressBefore = progressBar.props.progress;

      // Tap background
      const background = getByTestId('background-image');
      fireEvent.press(background);

      // No error message should appear
      expect(queryByText(/잘못 클릭하셨어요/)).toBeNull();
      expect(queryByText(/error/i)).toBeNull();

      // Timer and progress should be unchanged
      expect(timer.props.children).toBe(timerBefore);
      expect(progressBar.props.progress).toBe(progressBefore);

      // Tap path
      const path = getByTestId('path-container');
      fireEvent.press(path);

      // Still no error message
      expect(queryByText(/잘못 클릭하셨어요/)).toBeNull();
      expect(timer.props.children).toBe(timerBefore);

      // Tap decorative elements
      const decorative = getByTestId('decorative-elements');
      fireEvent.press(decorative);

      // Still no error message
      expect(queryByText(/잘못 클릭하셨어요/)).toBeNull();
      expect(timer.props.children).toBe(timerBefore);
    });

    it('should preserve session state during non-interactive touches', () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '2');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      // Advance time
      act(() => {
        jest.advanceTimersByTime(30000);
      });

      const timer = getByTestId('timer-display');
      const progressBar = getByTestId('progress-bar');
      const controls = getByTestId('session-controls-container');
      
      const timerValue = timer.props.children;
      const progressValue = progressBar.props.progress;
      const statusValue = controls.props.status;

      // Multiple non-interactive touches
      const background = getByTestId('background-image');
      fireEvent.press(background);
      fireEvent.press(background);
      fireEvent.press(background);

      // All state should be preserved
      expect(timer.props.children).toBe(timerValue);
      expect(progressBar.props.progress).toBe(progressValue);
      expect(controls.props.status).toBe(statusValue);
    });
  });

  describe('Navigation Flows Between Screens', () => {
    it('should navigate from home to session to completion', async () => {
      const { getByTestId, getByText, rerender } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Verify home screen
      expect(getByTestId('home-screen')).toBeTruthy();
      expect(getByText('🐢 Turtle Study')).toBeTruthy();

      // Start session
      const timeInput = getByTestId('time-input-field');
      fireEvent.changeText(timeInput, '1');
      const startButton = getByTestId('submit-button');
      fireEvent.press(startButton);

      // Navigate to session screen
      rerender(
        <AppProvider>
          <StudySessionScreen />
        </AppProvider>
      );

      expect(getByTestId('study-session-screen')).toBeTruthy();

      // Complete session
      act(() => {
        jest.advanceTimersByTime(60000);
      });

      // Navigate to completion screen
      rerender(
        <AppProvider>
          <CompletionScreen />
        </AppProvider>
      );

      await waitFor(() => {
        expect(getByTestId('completion-screen')).toBeTruthy();
      });
    });

    it('should allow starting new session from completion screen', async () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <CompletionScreen />
        </AppProvider>
      );

      // Verify completion screen
      expect(getByTestId('completion-screen')).toBeTruthy();

      // Tap new session button
      const newSessionButton = getByTestId('start-new-button');
      fireEvent.press(newSessionButton);

      // Should show time input popup
      rerender(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      await waitFor(() => {
        expect(getByTestId('time-input-popup')).toBeTruthy();
      });
    });

    it('should return to home screen from completion screen', async () => {
      const { getByTestId, rerender } = render(
        <AppProvider>
          <CompletionScreen />
        </AppProvider>
      );

      // Tap close button
      const closeButton = getByTestId('close-button');
      fireEvent.press(closeButton);

      // Should return to home screen
      rerender(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      await waitFor(() => {
        expect(getByTestId('home-screen')).toBeTruthy();
      });
    });

    it('should cancel time input and stay on home screen', () => {
      const { getByTestId } = render(
        <AppProvider>
          <HomeScreen />
        </AppProvider>
      );

      // Time input popup should be visible
      expect(getByTestId('time-input-popup')).toBeTruthy();

      // Tap cancel button
      const cancelButton = getByTestId('cancel-button');
      fireEvent.press(cancelButton);

      // Should stay on home screen
      expect(getByTestId('home-screen')).toBeTruthy();
    });
  });
});
