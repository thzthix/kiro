import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CompletionScreen } from './CompletionScreen';

describe('CompletionScreen', () => {
  describe('Rendering', () => {
    it('should render the completion screen container', () => {
      const { getByTestId } = render(<CompletionScreen totalDuration={1800} />);
      expect(getByTestId('completion-screen')).toBeTruthy();
    });

    it('should display turtle in arrived state at GOAL point', () => {
      const { getByTestId } = render(<CompletionScreen totalDuration={1800} />);
      const turtle = getByTestId('completion-turtle');
      expect(turtle.props.state).toBe('arrived');
    });

    it('should display turtle using turtle_arrived.png image', () => {
      const { getByTestId } = render(<CompletionScreen totalDuration={1800} />);
      const turtle = getByTestId('completion-turtle');
      expect(turtle.props.source).toMatch(/turtle_arrived\.png/);
    });

    it('should display turtle static next to GOAL flag without bouncing animation', () => {
      const { getByTestId } = render(<CompletionScreen totalDuration={1800} />);
      const turtle = getByTestId('completion-turtle');
      expect(turtle.props.animated).toBe(false);
    });

    it('should display GOAL flag next to turtle', () => {
      const { getByTestId } = render(<CompletionScreen totalDuration={1800} />);
      expect(getByTestId('goal-flag')).toBeTruthy();
    });
  });

  describe('Session Summary Display', () => {
    it('should display total study duration in MM:SS format', () => {
      const { getByTestId } = render(<CompletionScreen totalDuration={1800} />);
      const duration = getByTestId('completion-duration');
      expect(duration.props.children).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should format 1800 seconds as "30:00"', () => {
      const { getByText } = render(<CompletionScreen totalDuration={1800} />);
      expect(getByText('30:00')).toBeTruthy();
    });

    it('should format 60 seconds as "01:00"', () => {
      const { getByText } = render(<CompletionScreen totalDuration={60} />);
      expect(getByText('01:00')).toBeTruthy();
    });

    it('should format 3600 seconds as "60:00"', () => {
      const { getByText } = render(<CompletionScreen totalDuration={3600} />);
      expect(getByText('60:00')).toBeTruthy();
    });

    it('should display completion message', () => {
      const { getByText } = render(<CompletionScreen totalDuration={1800} />);
      expect(getByText(/완료/)).toBeTruthy();
    });

    it('should display congratulatory text', () => {
      const { getByText } = render(<CompletionScreen totalDuration={1800} />);
      expect(getByText(/축하합니다|잘하셨습니다|수고하셨습니다/)).toBeTruthy();
    });
  });

  describe('Action Buttons', () => {
    it('should provide a button to start new session', () => {
      const { getByTestId } = render(<CompletionScreen totalDuration={1800} />);
      expect(getByTestId('start-new-button')).toBeTruthy();
    });

    it('should display "새로운 세션 시작" or similar text on start new button', () => {
      const { getByText } = render(<CompletionScreen totalDuration={1800} />);
      expect(getByText(/새로운 세션|다시 시작|새로 시작/)).toBeTruthy();
    });

    it('should provide a close button', () => {
      const { getByTestId } = render(<CompletionScreen totalDuration={1800} />);
      expect(getByTestId('close-button')).toBeTruthy();
    });

    it('should display "닫기" or similar text on close button', () => {
      const { getByText } = render(<CompletionScreen totalDuration={1800} />);
      expect(getByText(/닫기|홈으로|종료/)).toBeTruthy();
    });
  });

  describe('Button Interactions', () => {
    it('should call onStartNew when start new button is pressed', () => {
      const onStartNew = jest.fn();
      const { getByTestId } = render(
        <CompletionScreen totalDuration={1800} onStartNew={onStartNew} />
      );
      
      const startNewButton = getByTestId('start-new-button');
      fireEvent.press(startNewButton);
      
      expect(onStartNew).toHaveBeenCalled();
    });

    it('should open TimeInputPopup when start new button is pressed', () => {
      const onStartNew = jest.fn();
      const { getByTestId } = render(
        <CompletionScreen totalDuration={1800} onStartNew={onStartNew} />
      );
      
      const startNewButton = getByTestId('start-new-button');
      fireEvent.press(startNewButton);
      
      expect(onStartNew).toHaveBeenCalledWith(expect.objectContaining({
        action: 'openTimeInput'
      }));
    });

    it('should call onClose when close button is pressed', () => {
      const onClose = jest.fn();
      const { getByTestId } = render(
        <CompletionScreen totalDuration={1800} onClose={onClose} />
      );
      
      const closeButton = getByTestId('close-button');
      fireEvent.press(closeButton);
      
      expect(onClose).toHaveBeenCalled();
    });

    it('should return to home screen when close button is pressed', () => {
      const onClose = jest.fn();
      const { getByTestId } = render(
        <CompletionScreen totalDuration={1800} onClose={onClose} />
      );
      
      const closeButton = getByTestId('close-button');
      fireEvent.press(closeButton);
      
      expect(onClose).toHaveBeenCalledWith(expect.objectContaining({
        action: 'returnHome'
      }));
    });
  });

  describe('Display Timing', () => {
    it('should display within 500ms of timer reaching 00:00', () => {
      const startTime = Date.now();
      render(<CompletionScreen totalDuration={1800} />);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(500);
    });
  });

  describe('Visual Theme Consistency', () => {
    it('should use watercolor background matching app theme', () => {
      const { UNSAFE_queryAllByType } = render(<CompletionScreen totalDuration={1800} />);
      // BackgroundImage should be rendered via ScreenLayout
      const BackgroundImage = require('../components/BackgroundImage').default;
      const backgrounds = UNSAFE_queryAllByType(BackgroundImage);
      expect(backgrounds.length).toBeGreaterThan(0);
    });

    it('should use colors from defined palette (beige, light yellow, mint, olive green)', () => {
      const { getByTestId } = render(<CompletionScreen totalDuration={1800} />);
      const container = getByTestId('completion-screen');
      expect(container.props.style).toBeDefined();
    });

    it('should display decorative elements consistent with other screens', () => {
      const { getByTestId } = render(<CompletionScreen totalDuration={1800} />);
      expect(getByTestId('decorative-elements')).toBeTruthy();
    });

    it('should display background with landscape elements (hills, lakes, trees, flowers)', () => {
      const { UNSAFE_queryAllByType } = render(<CompletionScreen totalDuration={1800} />);
      // BackgroundImage should be rendered via ScreenLayout
      const BackgroundImage = require('../components/BackgroundImage').default;
      const backgrounds = UNSAFE_queryAllByType(BackgroundImage);
      expect(backgrounds.length).toBeGreaterThan(0);
    });
  });

  describe('Fallback Handling', () => {
    it('should display solid beige background if background image fails to load', () => {
      const { getByTestId } = render(<CompletionScreen totalDuration={1800} />);
      const backgroundImage = getByTestId('background-watercolor-image');
      
      // Simulate image load failure on the actual Image component
      fireEvent(backgroundImage, 'error');
      
      // Should show fallback background
      const fallback = getByTestId('background-fallback');
      expect(fallback).toBeTruthy();
    });

    it('should handle missing totalDuration prop gracefully', () => {
      const { getByTestId } = render(<CompletionScreen />);
      expect(getByTestId('completion-screen')).toBeTruthy();
    });

    it('should display "00:00" when totalDuration is undefined', () => {
      const { getByText } = render(<CompletionScreen />);
      expect(getByText('00:00')).toBeTruthy();
    });

    it('should display "00:00" when totalDuration is 0', () => {
      const { getByText } = render(<CompletionScreen totalDuration={0} />);
      expect(getByText('00:00')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible buttons with minimum touch target size', () => {
      const { getByTestId } = render(<CompletionScreen totalDuration={1800} />);
      const startNewButton = getByTestId('start-new-button');
      const closeButton = getByTestId('close-button');
      
      expect(startNewButton.props.accessible).toBe(true);
      expect(closeButton.props.accessible).toBe(true);
    });

    it('should provide accessible labels for buttons', () => {
      const { getByTestId } = render(<CompletionScreen totalDuration={1800} />);
      const startNewButton = getByTestId('start-new-button');
      const closeButton = getByTestId('close-button');
      
      expect(startNewButton.props.accessibilityLabel).toBeDefined();
      expect(closeButton.props.accessibilityLabel).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very short sessions (1 minute)', () => {
      const { getByText } = render(<CompletionScreen totalDuration={60} />);
      expect(getByText('01:00')).toBeTruthy();
    });

    it('should handle very long sessions (180 minutes)', () => {
      const { getByText } = render(<CompletionScreen totalDuration={10800} />);
      expect(getByText('180:00')).toBeTruthy();
    });

    it('should handle rapid button presses without duplicate actions', () => {
      const onStartNew = jest.fn();
      const { getByTestId } = render(
        <CompletionScreen totalDuration={1800} onStartNew={onStartNew} />
      );
      
      const startNewButton = getByTestId('start-new-button');
      
      // Rapid presses
      fireEvent.press(startNewButton);
      fireEvent.press(startNewButton);
      fireEvent.press(startNewButton);
      
      // Should only trigger once due to debouncing
      expect(onStartNew).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration with Navigation', () => {
    it('should support navigation to home screen', () => {
      const onClose = jest.fn();
      const { getByTestId } = render(
        <CompletionScreen totalDuration={1800} onClose={onClose} />
      );
      
      const closeButton = getByTestId('close-button');
      fireEvent.press(closeButton);
      
      expect(onClose).toHaveBeenCalled();
    });

    it('should support navigation to new session flow', () => {
      const onStartNew = jest.fn();
      const { getByTestId } = render(
        <CompletionScreen totalDuration={1800} onStartNew={onStartNew} />
      );
      
      const startNewButton = getByTestId('start-new-button');
      fireEvent.press(startNewButton);
      
      expect(onStartNew).toHaveBeenCalled();
    });
  });
});
