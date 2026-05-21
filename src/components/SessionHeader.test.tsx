/**
 * Unit Tests for SessionHeader Component (RED Phase)
 * Feature: turtle-study-app
 * 
 * These tests verify the SessionHeader component behavior including:
 * - Beige round panel container rendering
 * - Centered timer display in MM:SS format
 * - Progress bar display below timer
 * - Mini turtle icon slider on progress bar
 * 
 * All tests should FAIL in RED phase until component is implemented.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import SessionHeader from './SessionHeader';

describe('SessionHeader Component - Unit Tests (RED)', () => {
  describe('Component Rendering', () => {
    it('should render beige round panel container', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={1800} progress={0} />
      );

      const container = getByTestId('session-header-container');
      expect(container).toBeTruthy();
      
      // Check for beige background styling
      expect(container.props.style).toMatchObject(
        expect.objectContaining({
          backgroundColor: expect.stringMatching(/beige|#F5F5DC|#F4E8D8/i),
        })
      );
    });

    it('should render with round panel styling', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={1800} progress={0} />
      );

      const container = getByTestId('session-header-container');
      
      // Check for rounded corners
      expect(container.props.style).toMatchObject(
        expect.objectContaining({
          borderRadius: expect.any(Number),
        })
      );
    });

    it('should be positioned at top of screen', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={1800} progress={0} />
      );

      const container = getByTestId('session-header-container');
      
      // Check for top positioning
      expect(container.props.style).toBeDefined();
    });
  });

  describe('Timer Display', () => {
    it('should display centered timer in MM:SS format', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={1800} progress={0} />
      );

      const timer = getByTestId('timer-display');
      expect(timer).toBeTruthy();
      expect(timer.props.children).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should display timer with large typography', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={1800} progress={0} />
      );

      const timer = getByTestId('timer-display');
      
      // Check for large font size
      expect(timer.props.style).toMatchObject(
        expect.objectContaining({
          fontSize: expect.any(Number),
        })
      );
    });

    it('should center timer horizontally', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={1800} progress={0} />
      );

      const timer = getByTestId('timer-display');
      
      // Check for center alignment
      expect(timer.props.style).toMatchObject(
        expect.objectContaining({
          textAlign: 'center',
        })
      );
    });

    it('should format 1800 seconds as 30:00', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={1800} progress={0} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('30:00');
    });

    it('should format 900 seconds as 15:00', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={900} progress={50} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('15:00');
    });

    it('should format 65 seconds as 01:05', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={65} progress={95} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('01:05');
    });

    it('should format 0 seconds as 00:00', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={0} progress={100} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('00:00');
    });
  });

  describe('Progress Bar', () => {
    it('should display progress bar directly below timer', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={1800} progress={0} />
      );

      const progressBar = getByTestId('progress-bar');
      expect(progressBar).toBeTruthy();
    });

    it('should display progress bar with mini turtle icon slider', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={1800} progress={50} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      expect(turtleSlider).toBeTruthy();
    });

    it('should position mini turtle icon at 0% progress', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={1800} progress={0} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      // Check that turtle is positioned at start (0%)
      expect(turtleSlider.props.style).toMatchObject(
        expect.objectContaining({
          left: expect.stringMatching(/0%/),
        })
      );
    });

    it('should position mini turtle icon at 50% progress', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={900} progress={50} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      // Check that turtle is positioned at middle (50%)
      expect(turtleSlider.props.style).toMatchObject(
        expect.objectContaining({
          left: expect.stringMatching(/50%/),
        })
      );
    });

    it('should position mini turtle icon at 100% progress', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={0} progress={100} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      // Check that turtle is positioned at end (100%)
      expect(turtleSlider.props.style).toMatchObject(
        expect.objectContaining({
          left: expect.stringMatching(/100%/),
        })
      );
    });

    it('should move turtle icon rightward as progress increases', () => {
      const { getByTestId, rerender } = render(
        <SessionHeader remainingSeconds={1800} progress={25} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      const initialPosition = turtleSlider.props.style.left;

      // Increase progress
      rerender(<SessionHeader remainingSeconds={900} progress={75} />);

      const newPosition = turtleSlider.props.style.left;
      
      // New position should be greater (more to the right)
      expect(parseFloat(newPosition)).toBeGreaterThan(parseFloat(initialPosition));
    });
  });

  describe('Layout Structure', () => {
    it('should render timer above progress bar', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={1800} progress={0} />
      );

      const container = getByTestId('session-header-container');
      const timer = getByTestId('timer-display');
      const progressBar = getByTestId('progress-bar');

      // Both should exist within container
      expect(timer).toBeTruthy();
      expect(progressBar).toBeTruthy();
      expect(container).toBeTruthy();
    });

    it('should have consistent padding in container', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={1800} progress={0} />
      );

      const container = getByTestId('session-header-container');
      
      // Check for padding
      expect(container.props.style).toMatchObject(
        expect.objectContaining({
          padding: expect.any(Number),
        })
      );
    });
  });

  describe('Props Handling', () => {
    it('should update timer when remainingSeconds prop changes', () => {
      const { getByTestId, rerender } = render(
        <SessionHeader remainingSeconds={1800} progress={0} />
      );

      let timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('30:00');

      // Update remaining seconds
      rerender(<SessionHeader remainingSeconds={1740} progress={3.33} />);

      timer = getByTestId('timer-display');
      expect(timer.props.children).toBe('29:00');
    });

    it('should update progress bar when progress prop changes', () => {
      const { getByTestId, rerender } = render(
        <SessionHeader remainingSeconds={1800} progress={0} />
      );

      let turtleSlider = getByTestId('progress-bar-turtle-slider');
      const initialPosition = turtleSlider.props.style.left;

      // Update progress
      rerender(<SessionHeader remainingSeconds={900} progress={50} />);

      turtleSlider = getByTestId('progress-bar-turtle-slider');
      const newPosition = turtleSlider.props.style.left;

      expect(newPosition).not.toBe(initialPosition);
    });

    it('should handle edge case of negative remainingSeconds gracefully', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={-10} progress={100} />
      );

      const timer = getByTestId('timer-display');
      // Should display 00:00 or handle gracefully
      expect(timer.props.children).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should handle edge case of progress > 100 gracefully', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={0} progress={150} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      // Should clamp to 100% or handle gracefully
      expect(turtleSlider).toBeTruthy();
    });

    it('should handle edge case of progress < 0 gracefully', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={1800} progress={-10} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      // Should clamp to 0% or handle gracefully
      expect(turtleSlider).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible timer display', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={1800} progress={0} />
      );

      const timer = getByTestId('timer-display');
      expect(timer.props.accessible).toBeTruthy();
    });

    it('should have accessible progress bar', () => {
      const { getByTestId } = render(
        <SessionHeader remainingSeconds={1800} progress={0} />
      );

      const progressBar = getByTestId('progress-bar');
      expect(progressBar.props.accessible).toBeTruthy();
    });
  });
});
