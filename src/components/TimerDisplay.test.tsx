/**
 * Unit Tests for TimerDisplay Component (RED Phase)
 * Feature: turtle-study-app
 * 
 * These tests verify the TimerDisplay component behavior including:
 * - Correct time formatting in MM:SS format
 * - Large, bold typography
 * - Center alignment
 * - Zero-padding for single digits
 * 
 * All tests should FAIL in RED phase until component is implemented.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import TimerDisplay from './TimerDisplay';

describe('TimerDisplay Component - Unit Tests (RED)', () => {
  describe('Component Rendering', () => {
    it('should render with timer text', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={1800} />
      );

      const timer = getByTestId('timer-display');
      expect(timer).toBeTruthy();
    });

    it('should render as Text component', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={1800} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.type).toBe('Text');
    });
  });

  describe('Time Formatting - MM:SS Format', () => {
    it('should format 0 seconds as 00:00', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={0} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('00:00');
    });

    it('should format 1 second as 00:01', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={1} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('00:01');
    });

    it('should format 59 seconds as 00:59', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={59} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('00:59');
    });

    it('should format 60 seconds as 01:00', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={60} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('01:00');
    });

    it('should format 65 seconds as 01:05', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={65} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('01:05');
    });

    it('should format 600 seconds as 10:00', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={600} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('10:00');
    });

    it('should format 900 seconds as 15:00', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={900} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('15:00');
    });

    it('should format 1800 seconds as 30:00', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={1800} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('30:00');
    });

    it('should format 3599 seconds as 59:59', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={3599} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('59:59');
    });

    it('should format 3600 seconds as 60:00', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={3600} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('60:00');
    });

    it('should format 10800 seconds (180 minutes) as 180:00', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={10800} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('180:00');
    });
  });

  describe('Zero-Padding', () => {
    it('should zero-pad minutes less than 10', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={540} /> // 9 minutes
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('09:00');
      expect(timer.props.children).toMatch(/^0\d:\d{2}$/);
    });

    it('should zero-pad seconds less than 10', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={605} /> // 10:05
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('10:05');
      expect(timer.props.children).toMatch(/^\d{2}:0\d$/);
    });

    it('should zero-pad both minutes and seconds when less than 10', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={125} /> // 2:05
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('02:05');
      expect(timer.props.children).toMatch(/^0\d:0\d$/);
    });

    it('should always display MM:SS format with proper padding', () => {
      const testCases = [
        { seconds: 0, expected: '00:00', length: 5 },
        { seconds: 1, expected: '00:01', length: 5 },
        { seconds: 59, expected: '00:59', length: 5 },
        { seconds: 60, expected: '01:00', length: 5 },
        { seconds: 65, expected: '01:05', length: 5 },
        { seconds: 600, expected: '10:00', length: 5 },
        { seconds: 900, expected: '15:00', length: 5 },
        { seconds: 1800, expected: '30:00', length: 5 },
        { seconds: 3599, expected: '59:59', length: 5 },
        { seconds: 3600, expected: '60:00', length: 5 },
        { seconds: 10800, expected: '180:00', length: 6 }, // 180 minutes = 6 chars
      ];
      
      testCases.forEach(({ seconds, expected, length }) => {
        const { getByTestId } = render(
          <TimerDisplay remainingSeconds={seconds} />
        );

        const timer = getByTestId('timer-display');
        expect(timer.props.children).toBe(expected);
        expect(timer.props.children).toHaveLength(length);
        expect(timer.props.children).toMatch(/^\d+:\d{2}$/);
      });
    });
  });

  describe('Typography Styling', () => {
    it('should have large font size', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={1800} />
      );

      const timer = getByTestId('timer-display');
      
      // Check for large font size (should be >= 32)
      expect(timer.props.style).toMatchObject(
        expect.objectContaining({
          fontSize: expect.any(Number),
        })
      );
      
      const fontSize = Array.isArray(timer.props.style)
        ? timer.props.style.find((s: any) => s?.fontSize)?.fontSize
        : timer.props.style?.fontSize;
      
      expect(fontSize).toBeGreaterThanOrEqual(32);
    });

    it('should have bold font weight', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={1800} />
      );

      const timer = getByTestId('timer-display');
      
      // Check for bold font weight
      expect(timer.props.style).toMatchObject(
        expect.objectContaining({
          fontWeight: expect.stringMatching(/bold|700|800|900/),
        })
      );
    });

    it('should be centered horizontally', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={1800} />
      );

      const timer = getByTestId('timer-display');
      
      // Check for center text alignment
      expect(timer.props.style).toMatchObject(
        expect.objectContaining({
          textAlign: 'center',
        })
      );
    });
  });

  describe('Props Handling', () => {
    it('should update display when remainingSeconds prop changes', () => {
      const { getByTestId, rerender } = render(
        <TimerDisplay remainingSeconds={1800} />
      );

      let timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('30:00');

      // Update remaining seconds
      rerender(<TimerDisplay remainingSeconds={1740} />);

      timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('29:00');
    });

    it('should handle rapid prop changes', () => {
      const { getByTestId, rerender } = render(
        <TimerDisplay remainingSeconds={100} />
      );

      // Simulate rapid countdown
      for (let i = 100; i >= 95; i--) {
        rerender(<TimerDisplay remainingSeconds={i} />);
        const timer = getByTestId('timer-display');
        expect(timer.props.children).toMatch(/^\d{2}:\d{2}$/);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative remainingSeconds gracefully', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={-10} />
      );

      const timer = getByTestId('timer-display');
      // Should display 00:00 or handle gracefully
      expect(timer.props.children).toBe('00:00');
    });

    it('should handle very large remainingSeconds', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={99999} /> // ~1666 minutes
      );

      const timer = getByTestId('timer-display');
      // Should still format correctly
      expect(timer.props.children).toMatch(/^\d+:\d{2}$/);
    });

    it('should handle decimal remainingSeconds by flooring', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={65.7} />
      );

      const timer = getByTestId('timer-display');
      // Should floor to 65 seconds = 01:05
      expect(timer.props.children).toBe('01:05');
    });

    it('should handle NaN remainingSeconds gracefully', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={NaN} />
      );

      const timer = getByTestId('timer-display');
      // Should display 00:00 or handle gracefully
      expect(timer.props.children).toBe('00:00');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={1800} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.accessible).toBeTruthy();
    });

    it('should have accessibility label with time information', () => {
      const { getByTestId } = render(
        <TimerDisplay remainingSeconds={1800} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.accessibilityLabel).toBeDefined();
      expect(timer.props.accessibilityLabel).toContain('30');
    });

    it('should update accessibility label when time changes', () => {
      const { getByTestId, rerender } = render(
        <TimerDisplay remainingSeconds={1800} />
      );

      let timer = getByTestId('timer-display');
      const initialLabel = timer.props.accessibilityLabel;

      rerender(<TimerDisplay remainingSeconds={900} />);

      timer = getByTestId('timer-display');
      const newLabel = timer.props.accessibilityLabel;

      expect(newLabel).not.toBe(initialLabel);
    });
  });

  describe('Performance', () => {
    it('should render efficiently with same props', () => {
      const { getByTestId, rerender } = render(
        <TimerDisplay remainingSeconds={1800} />
      );

      const timer = getByTestId('timer-display');
      const initialRender = timer.props.children;

      // Re-render with same props
      rerender(<TimerDisplay remainingSeconds={1800} />);

      const afterRerender = getByTestId('timer-display').props.children;
      expect(afterRerender).toBe(initialRender);
    });
  });
});
