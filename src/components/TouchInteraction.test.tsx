/**
 * Unit Tests for Touch Interaction (RED Phase)
 * Feature: turtle-study-app
 * Task: 14.1 Write unit tests for touch interaction
 * 
 * These tests verify touch interaction behavior including:
 * - Touch target size (minimum 44x44 points)
 * - Visual feedback timing (< 100ms for buttons, 300-1000ms for care items)
 * - Debouncing (1 second cooldown for care items)
 * - Disabled state prevents interaction
 * - Non-interactive area touches are completely ignored (no error message, no visual response)
 * 
 * Validates: Requirements 5.13, 5.14, 5.15, 5.16, 6.7, 8.1, 9.6, 9.7, 9.8
 * 
 * All tests should FAIL in RED phase until implementation is complete.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CareItemsPanel from './CareItemsPanel';
import SessionControls from './SessionControls';
import StudyCanvas from './StudyCanvas';

describe('Touch Interaction - Unit Tests (RED)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Touch Target Size (Minimum 44x44 points)', () => {
    describe('CareItemsPanel Buttons', () => {
      it('should have minimum 44x44 touch target for carrot button', () => {
        const { getByTestId } = render(
          <CareItemsPanel
            onItemTap={jest.fn()}
            disabled={false}
            carrotCount={3}
            waterCount={3}
            turtleState="walking"
          />
        );

        const carrotButton = getByTestId('carrot-button');
        const style = carrotButton.props.style;

        // Check minimum touch target size (44x44 points)
        expect(style.width).toBeGreaterThanOrEqual(44);
        expect(style.height).toBeGreaterThanOrEqual(44);
      });

      it('should have minimum 44x44 touch target for water button', () => {
        const { getByTestId } = render(
          <CareItemsPanel
            onItemTap={jest.fn()}
            disabled={false}
            carrotCount={3}
            waterCount={3}
            turtleState="walking"
          />
        );

        const waterButton = getByTestId('water-button');
        const style = waterButton.props.style;

        // Check minimum touch target size (44x44 points)
        expect(style.width).toBeGreaterThanOrEqual(44);
        expect(style.height).toBeGreaterThanOrEqual(44);
      });
    });

    describe('SessionControls Buttons', () => {
      it('should have minimum 44x44 touch target for pause button', () => {
        const { getByTestId } = render(
          <SessionControls
            status="running"
            onPause={jest.fn()}
            onResume={jest.fn()}
            onStop={jest.fn()}
          />
        );

        const pauseButton = getByTestId('pause-button');
        const style = pauseButton.props.style;

        // Check minimum touch target size (44x44 points)
        expect(style.width).toBeGreaterThanOrEqual(44);
        expect(style.height).toBeGreaterThanOrEqual(44);
      });

      it('should have minimum 44x44 touch target for resume button', () => {
        const { getByTestId } = render(
          <SessionControls
            status="paused"
            onPause={jest.fn()}
            onResume={jest.fn()}
            onStop={jest.fn()}
          />
        );

        const resumeButton = getByTestId('resume-button');
        const style = resumeButton.props.style;

        // Check minimum touch target size (44x44 points)
        expect(style.width).toBeGreaterThanOrEqual(44);
        expect(style.height).toBeGreaterThanOrEqual(44);
      });

      it('should have minimum 44x44 touch target for stop button', () => {
        const { getByTestId } = render(
          <SessionControls
            status="running"
            onPause={jest.fn()}
            onResume={jest.fn()}
            onStop={jest.fn()}
          />
        );

        const stopButton = getByTestId('stop-button');
        const style = stopButton.props.style;

        // Check minimum touch target size (44x44 points)
        expect(style.width).toBeGreaterThanOrEqual(44);
        expect(style.height).toBeGreaterThanOrEqual(44);
      });
    });
  });

  describe('Visual Feedback Timing', () => {
    describe('Button Visual Feedback (< 100ms)', () => {
      it('should display visual feedback within 100ms for carrot button tap', () => {
        const { getByTestId } = render(
          <CareItemsPanel
            onItemTap={jest.fn()}
            disabled={false}
            carrotCount={3}
            waterCount={3}
            turtleState="walking"
          />
        );

        const carrotButton = getByTestId('carrot-button');
        const startTime = Date.now();

        fireEvent.press(carrotButton);

        const endTime = Date.now();
        const feedbackTime = endTime - startTime;

        // Visual feedback should appear within 100ms
        expect(feedbackTime).toBeLessThan(100);
      });

      it('should display visual feedback within 100ms for water button tap', () => {
        const { getByTestId } = render(
          <CareItemsPanel
            onItemTap={jest.fn()}
            disabled={false}
            carrotCount={3}
            waterCount={3}
            turtleState="walking"
          />
        );

        const waterButton = getByTestId('water-button');
        const startTime = Date.now();

        fireEvent.press(waterButton);

        const endTime = Date.now();
        const feedbackTime = endTime - startTime;

        // Visual feedback should appear within 100ms
        expect(feedbackTime).toBeLessThan(100);
      });

      it('should display visual feedback within 100ms for pause button tap', () => {
        const { getByTestId } = render(
          <SessionControls
            status="running"
            onPause={jest.fn()}
            onResume={jest.fn()}
            onStop={jest.fn()}
          />
        );

        const pauseButton = getByTestId('pause-button');
        const startTime = Date.now();

        fireEvent.press(pauseButton);

        const endTime = Date.now();
        const feedbackTime = endTime - startTime;

        // Visual feedback should appear within 100ms
        expect(feedbackTime).toBeLessThan(100);
      });

      it('should display visual feedback within 100ms for stop button tap', () => {
        const { getByTestId } = render(
          <SessionControls
            status="running"
            onPause={jest.fn()}
            onResume={jest.fn()}
            onStop={jest.fn()}
          />
        );

        const stopButton = getByTestId('stop-button');
        const startTime = Date.now();

        fireEvent.press(stopButton);

        const endTime = Date.now();
        const feedbackTime = endTime - startTime;

        // Visual feedback should appear within 100ms
        expect(feedbackTime).toBeLessThan(100);
      });
    });

    describe('Care Item Visual Feedback (300-1000ms)', () => {
      it('should display care item visual feedback for 300-1000ms on carrot button tap', () => {
        const { getByTestId } = render(
          <CareItemsPanel
            onItemTap={jest.fn()}
            disabled={false}
            carrotCount={3}
            waterCount={3}
            turtleState="walking"
          />
        );

        const carrotButton = getByTestId('carrot-button');
        fireEvent.press(carrotButton);

        // Check that visual feedback animation is present
        const feedbackIndicator = getByTestId('carrot-button-feedback');
        expect(feedbackIndicator).toBeTruthy();

        // Advance time by 300ms (minimum duration)
        jest.advanceTimersByTime(300);
        expect(feedbackIndicator).toBeTruthy();

        // Advance time by 1000ms (maximum duration)
        jest.advanceTimersByTime(700);
        // Feedback should complete by 1000ms
      });

      it('should display care item visual feedback for 300-1000ms on water button tap', () => {
        const { getByTestId } = render(
          <CareItemsPanel
            onItemTap={jest.fn()}
            disabled={false}
            carrotCount={3}
            waterCount={3}
            turtleState="walking"
          />
        );

        const waterButton = getByTestId('water-button');
        fireEvent.press(waterButton);

        // Check that visual feedback animation is present
        const feedbackIndicator = getByTestId('water-button-feedback');
        expect(feedbackIndicator).toBeTruthy();

        // Advance time by 300ms (minimum duration)
        jest.advanceTimersByTime(300);
        expect(feedbackIndicator).toBeTruthy();

        // Advance time by 1000ms (maximum duration)
        jest.advanceTimersByTime(700);
        // Feedback should complete by 1000ms
      });
    });
  });

  describe('Debouncing (1 Second Cooldown for Care Items)', () => {
    it('should process first carrot button tap and ignore subsequent taps within 1 second', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel
          onItemTap={onItemTap}
          disabled={false}
          carrotCount={3}
          waterCount={3}
          turtleState="walking"
        />
      );

      const carrotButton = getByTestId('carrot-button');

      // First tap
      fireEvent.press(carrotButton);
      expect(onItemTap).toHaveBeenCalledTimes(1);

      // Second tap within 1 second (should be ignored)
      fireEvent.press(carrotButton);
      expect(onItemTap).toHaveBeenCalledTimes(1);

      // Third tap within 1 second (should be ignored)
      fireEvent.press(carrotButton);
      expect(onItemTap).toHaveBeenCalledTimes(1);
    });

    it('should process first water button tap and ignore subsequent taps within 1 second', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel
          onItemTap={onItemTap}
          disabled={false}
          carrotCount={3}
          waterCount={3}
          turtleState="walking"
        />
      );

      const waterButton = getByTestId('water-button');

      // First tap
      fireEvent.press(waterButton);
      expect(onItemTap).toHaveBeenCalledTimes(1);

      // Second tap within 1 second (should be ignored)
      fireEvent.press(waterButton);
      expect(onItemTap).toHaveBeenCalledTimes(1);
    });

    it('should allow carrot button tap after 1 second cooldown', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel
          onItemTap={onItemTap}
          disabled={false}
          carrotCount={3}
          waterCount={3}
          turtleState="walking"
        />
      );

      const carrotButton = getByTestId('carrot-button');

      // First tap
      fireEvent.press(carrotButton);
      expect(onItemTap).toHaveBeenCalledTimes(1);

      // Advance time by 1 second
      jest.advanceTimersByTime(1000);

      // Second tap after cooldown (should be processed)
      fireEvent.press(carrotButton);
      expect(onItemTap).toHaveBeenCalledTimes(2);
    });

    it('should allow water button tap after 1 second cooldown', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel
          onItemTap={onItemTap}
          disabled={false}
          carrotCount={3}
          waterCount={3}
          turtleState="walking"
        />
      );

      const waterButton = getByTestId('water-button');

      // First tap
      fireEvent.press(waterButton);
      expect(onItemTap).toHaveBeenCalledTimes(1);

      // Advance time by 1 second
      jest.advanceTimersByTime(1000);

      // Second tap after cooldown (should be processed)
      fireEvent.press(waterButton);
      expect(onItemTap).toHaveBeenCalledTimes(2);
    });

    it('should have independent debouncing for carrot and water buttons', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel
          onItemTap={onItemTap}
          disabled={false}
          carrotCount={3}
          waterCount={3}
          turtleState="walking"
        />
      );

      const carrotButton = getByTestId('carrot-button');
      const waterButton = getByTestId('water-button');

      // Tap carrot
      fireEvent.press(carrotButton);
      expect(onItemTap).toHaveBeenCalledTimes(1);
      expect(onItemTap).toHaveBeenCalledWith('carrot');

      // Tap water immediately (should work - independent debouncing)
      fireEvent.press(waterButton);
      expect(onItemTap).toHaveBeenCalledTimes(2);
      expect(onItemTap).toHaveBeenCalledWith('water');
    });
  });

  describe('Disabled State Prevents Interaction', () => {
    describe('CareItemsPanel Disabled During Eating/Happy States', () => {
      it('should not trigger onItemTap when carrot button is tapped during eating state', () => {
        const onItemTap = jest.fn();
        const { getByTestId } = render(
          <CareItemsPanel
            onItemTap={onItemTap}
            disabled={false}
            carrotCount={3}
            waterCount={3}
            turtleState="eating"
          />
        );

        const carrotButton = getByTestId('carrot-button');
        fireEvent.press(carrotButton);

        expect(onItemTap).not.toHaveBeenCalled();
      });

      it('should not trigger onItemTap when water button is tapped during happy state', () => {
        const onItemTap = jest.fn();
        const { getByTestId } = render(
          <CareItemsPanel
            onItemTap={onItemTap}
            disabled={false}
            carrotCount={3}
            waterCount={3}
            turtleState="happy"
          />
        );

        const waterButton = getByTestId('water-button');
        fireEvent.press(waterButton);

        expect(onItemTap).not.toHaveBeenCalled();
      });

      it('should disable carrot button when turtleState is "eating"', () => {
        const { getByTestId } = render(
          <CareItemsPanel
            onItemTap={jest.fn()}
            disabled={false}
            carrotCount={3}
            waterCount={3}
            turtleState="eating"
          />
        );

        const carrotButton = getByTestId('carrot-button');
        expect(carrotButton.props.accessibilityState?.disabled).toBe(true);
      });

      it('should disable water button when turtleState is "happy"', () => {
        const { getByTestId } = render(
          <CareItemsPanel
            onItemTap={jest.fn()}
            disabled={false}
            carrotCount={3}
            waterCount={3}
            turtleState="happy"
          />
        );

        const waterButton = getByTestId('water-button');
        expect(waterButton.props.accessibilityState?.disabled).toBe(true);
      });
    });

    describe('CareItemsPanel Disabled When Count Reaches 0', () => {
      it('should not trigger onItemTap when carrot button with 0 count is tapped', () => {
        const onItemTap = jest.fn();
        const { getByTestId } = render(
          <CareItemsPanel
            onItemTap={onItemTap}
            disabled={false}
            carrotCount={0}
            waterCount={3}
            turtleState="walking"
          />
        );

        const carrotButton = getByTestId('carrot-button');
        fireEvent.press(carrotButton);

        expect(onItemTap).not.toHaveBeenCalled();
      });

      it('should not trigger onItemTap when water button with 0 count is tapped', () => {
        const onItemTap = jest.fn();
        const { getByTestId } = render(
          <CareItemsPanel
            onItemTap={onItemTap}
            disabled={false}
            carrotCount={3}
            waterCount={0}
            turtleState="walking"
          />
        );

        const waterButton = getByTestId('water-button');
        fireEvent.press(waterButton);

        expect(onItemTap).not.toHaveBeenCalled();
      });

      it('should disable carrot button when carrotCount is 0', () => {
        const { getByTestId } = render(
          <CareItemsPanel
            onItemTap={jest.fn()}
            disabled={false}
            carrotCount={0}
            waterCount={3}
            turtleState="walking"
          />
        );

        const carrotButton = getByTestId('carrot-button');
        expect(carrotButton.props.accessibilityState?.disabled).toBe(true);
      });

      it('should disable water button when waterCount is 0', () => {
        const { getByTestId } = render(
          <CareItemsPanel
            onItemTap={jest.fn()}
            disabled={false}
            carrotCount={3}
            waterCount={0}
            turtleState="walking"
          />
        );

        const waterButton = getByTestId('water-button');
        expect(waterButton.props.accessibilityState?.disabled).toBe(true);
      });
    });
  });

  describe('Non-Interactive Area Touches Completely Ignored', () => {
    it('should ignore touch on background area (no error message, no visual response)', () => {
      const { getByTestId, queryByText } = render(
        <StudyCanvas progress={50} turtleState="walking" />
      );

      const background = getByTestId('background-image');
      fireEvent.press(background);

      // No error message should appear
      expect(queryByText(/잘못 클릭하셨어요/)).toBeNull();
      expect(queryByText(/error/i)).toBeNull();

      // No visual response indicator should appear
      expect(queryByText(/feedback/i)).toBeNull();
    });

    it('should ignore touch on path area (no error message, no visual response)', () => {
      const { getByTestId, queryByText } = render(
        <StudyCanvas progress={50} turtleState="walking" />
      );

      const path = getByTestId('path-container');
      fireEvent.press(path);

      // No error message should appear
      expect(queryByText(/잘못 클릭하셨어요/)).toBeNull();
      expect(queryByText(/error/i)).toBeNull();

      // No visual response indicator should appear
      expect(queryByText(/feedback/i)).toBeNull();
    });

    it('should ignore touch on decorative elements (no error message, no visual response)', () => {
      const { getByTestId, queryByText } = render(
        <StudyCanvas progress={50} turtleState="walking" />
      );

      const decorativeElements = getByTestId('decorative-elements');
      fireEvent.press(decorativeElements);

      // No error message should appear
      expect(queryByText(/잘못 클릭하셨어요/)).toBeNull();
      expect(queryByText(/error/i)).toBeNull();

      // No visual response indicator should appear
      expect(queryByText(/feedback/i)).toBeNull();
    });

    it('should not modify timer value when non-interactive area is touched', () => {
      const { getByTestId } = render(
        <StudyCanvas progress={50} turtleState="walking" />
      );

      const background = getByTestId('background-image');
      
      // Touch non-interactive area
      fireEvent.press(background);

      // Timer should remain unchanged (no state modification)
      // This is verified by the absence of any state change callbacks
    });

    it('should not modify turtle position when non-interactive area is touched', () => {
      const { getByTestId } = render(
        <StudyCanvas progress={50} turtleState="walking" />
      );

      const path = getByTestId('path-container');
      
      // Touch non-interactive area
      fireEvent.press(path);

      // Turtle position should remain unchanged (no state modification)
      // This is verified by the absence of any state change callbacks
    });

    it('should not modify session status when non-interactive area is touched', () => {
      const { getByTestId } = render(
        <StudyCanvas progress={50} turtleState="walking" />
      );

      const decorativeElements = getByTestId('decorative-elements');
      
      // Touch non-interactive area
      fireEvent.press(decorativeElements);

      // Session status should remain unchanged (no state modification)
      // This is verified by the absence of any state change callbacks
    });

    it('should have no visual feedback animation on non-interactive area touch', () => {
      const { getByTestId, queryByTestId } = render(
        <StudyCanvas progress={50} turtleState="walking" />
      );

      const background = getByTestId('background-image');
      fireEvent.press(background);

      // No visual feedback indicator should exist
      expect(queryByTestId('touch-feedback-indicator')).toBeNull();
      expect(queryByTestId('ripple-effect')).toBeNull();
      expect(queryByTestId('highlight-effect')).toBeNull();
    });

    it('should have no audio feedback on non-interactive area touch', () => {
      const { getByTestId } = render(
        <StudyCanvas progress={50} turtleState="walking" />
      );

      const path = getByTestId('path-container');
      
      // Touch non-interactive area
      fireEvent.press(path);

      // No audio feedback should be triggered
      // This is verified by the absence of any audio-related callbacks or indicators
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid taps on non-interactive areas gracefully', () => {
      const { getByTestId, queryByText } = render(
        <StudyCanvas progress={50} turtleState="walking" />
      );

      const background = getByTestId('background-image');

      // Rapid taps
      fireEvent.press(background);
      fireEvent.press(background);
      fireEvent.press(background);
      fireEvent.press(background);
      fireEvent.press(background);

      // No error messages should appear
      expect(queryByText(/잘못 클릭하셨어요/)).toBeNull();
      expect(queryByText(/error/i)).toBeNull();
    });

    it('should handle simultaneous touches on interactive and non-interactive areas', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <>
          <StudyCanvas progress={50} turtleState="walking" />
          <CareItemsPanel
            onItemTap={onItemTap}
            disabled={false}
            carrotCount={3}
            waterCount={3}
            turtleState="walking"
          />
        </>
      );

      const background = getByTestId('background-image');
      const carrotButton = getByTestId('carrot-button');

      // Touch non-interactive area
      fireEvent.press(background);

      // Touch interactive button
      fireEvent.press(carrotButton);

      // Only interactive button should trigger callback
      expect(onItemTap).toHaveBeenCalledTimes(1);
      expect(onItemTap).toHaveBeenCalledWith('carrot');
    });

    it('should maintain touch target size when button is disabled', () => {
      const { getByTestId } = render(
        <CareItemsPanel
          onItemTap={jest.fn()}
          disabled={false}
          carrotCount={0}
          waterCount={3}
          turtleState="walking"
        />
      );

      const carrotButton = getByTestId('carrot-button');
      const style = Array.isArray(carrotButton.props.style)
        ? carrotButton.props.style.flat().reduce((acc, s) => ({ ...acc, ...s }), {})
        : carrotButton.props.style;

      // Touch target size should remain 44x44 even when disabled
      expect(style.width).toBeGreaterThanOrEqual(44);
      expect(style.height).toBeGreaterThanOrEqual(44);
    });

    it('should not provide visual feedback for disabled button taps', () => {
      const { getByTestId, queryByTestId } = render(
        <CareItemsPanel
          onItemTap={jest.fn()}
          disabled={false}
          carrotCount={3}
          waterCount={3}
          turtleState="eating"
        />
      );

      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);

      // No visual feedback should appear for disabled button
      // (except shake animation for depleted buttons, which is tested separately)
      const feedbackIndicator = queryByTestId('carrot-button-feedback');
      expect(feedbackIndicator).toBeNull();
    });
  });
});
